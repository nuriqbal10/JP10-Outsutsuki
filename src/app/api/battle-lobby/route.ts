export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { battleRooms, BattleRoomEntity, battleMatchHistory } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  generateBattleQuestions,
  VocabCategory,
  VocabLevel,
} from "@/data/battleQuestionBank";

export type BattleMode = "1vs1" | "group" | "all_members" | "tournament";

export interface Participant {
  email: string;
  name: string;
  avatar: string;
  team?: "shinobi" | "samurai";
  joinedAt: number;
  score: number;
  hp: number;
  isReady: boolean;
  rematchVote?: boolean;
}

function resolveRoomId(mode: BattleMode, roomCode?: string | null): { roomId: string; isCustom: boolean; cleanCode: string } {
  if (roomCode && roomCode.trim().length > 0) {
    const cleanCode = roomCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    return { roomId: `custom_${cleanCode}`, isCustom: true, cleanCode };
  }
  return { roomId: `room_${mode}`, isCustom: false, cleanCode: mode.toUpperCase() };
}

function formatRoom(r: BattleRoomEntity) {
  return {
    id: r.id,
    mode: r.mode as BattleMode,
    roomCode: r.roomCode,
    requiredCount: r.requiredCount,
    status: r.status as "waiting" | "countdown" | "in_battle" | "finished",
    countdownSeconds: r.countdownSeconds,
    topicLevel: r.topicLevel as "all" | "A1" | "A2.1" | "A2.2",
    topicChapter: r.topicChapter,
    topicCategory: r.topicCategory as "all" | "noun" | "adj" | "verb1" | "verb2" | "verb3",
    participants: (r.participants as Participant[]) || [],
    questions: (r.questions as any[]) || [],
    battleLog: (r.battleLog as string[]) || [],
    updatedAt: r.updatedAt,
    createdAt: r.createdAt,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = (searchParams.get("mode") || "1vs1") as BattleMode;
    const roomCode = searchParams.get("roomCode");
    const sinceParam = searchParams.get("since");
    const since = sinceParam ? parseInt(sinceParam, 10) : 0;

    const { roomId, cleanCode } = resolveRoomId(mode, roomCode);
    const now = Date.now();

    const existingList = await db.select().from(battleRooms).where(eq(battleRooms.id, roomId)).limit(1);
    let roomEntity = existingList[0];

    const requiredQuota = mode === "1vs1" ? 2 : mode === "group" ? 4 : mode === "tournament" ? 8 : 6;

    if (!roomEntity) {
      const newRoom = {
        id: roomId,
        mode,
        roomCode: cleanCode,
        requiredCount: requiredQuota,
        status: "waiting",
        countdownSeconds: 5,
        topicLevel: "A2.2",
        topicChapter: 0,
        topicCategory: "all",
        participants: [] as Participant[],
        updatedAt: now,
        createdAt: now,
      };

      await db.insert(battleRooms).values(newRoom).onConflictDoNothing();
      const refetch = await db.select().from(battleRooms).where(eq(battleRooms.id, roomId)).limit(1);
      roomEntity = refetch[0] || newRoom;
    } else if (roomEntity.mode === "tournament" && roomEntity.requiredCount !== 8 && roomEntity.status === "waiting") {
      roomEntity.requiredCount = 8;
      await db.update(battleRooms).set({ requiredCount: 8 }).where(eq(battleRooms.id, roomId));
    }

    // Delta Short-Circuit: If state hasn't changed since client's last seen timestamp
    if (since > 0 && roomEntity.updatedAt <= since) {
      return NextResponse.json(
        { success: true, changed: false, updatedAt: roomEntity.updatedAt },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
      );
    }

    return NextResponse.json(
      {
        success: true,
        changed: true,
        room: formatRoom(roomEntity),
      },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } }
    );
  } catch (err: any) {
    console.error("GET battle-lobby error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action,
      mode = "1vs1",
      roomCode,
      email,
      name,
      avatar = "🥷",
      team = "shinobi",
      isReady,
      topicLevel,
      topicChapter,
      topicCategory,
      isCorrect,
      chosenAnswer,
      questionIndex,
    } = body as {
      action: "join" | "leave" | "toggle_ready" | "choose_team" | "choose_avatar" | "set_topic" | "reset" | "finish_match" | "request_rematch" | "cancel_rematch" | "submit_turn";
      mode?: BattleMode;
      roomCode?: string;
      email?: string;
      name?: string;
      avatar?: string;
      team?: "shinobi" | "samurai";
      isReady?: boolean;
      topicLevel?: "all" | "A1" | "A2.1" | "A2.2";
      topicChapter?: number;
      topicCategory?: "all" | "noun" | "adj" | "verb1" | "verb2" | "verb3";
      isCorrect?: boolean;
      chosenAnswer?: string;
      questionIndex?: number;
    };

    const { roomId, cleanCode } = resolveRoomId(mode, roomCode);
    const requiredQuota = mode === "1vs1" ? 2 : mode === "group" ? 4 : mode === "tournament" ? 8 : 6;
    const now = Date.now();

    const existingList = await db.select().from(battleRooms).where(eq(battleRooms.id, roomId)).limit(1);
    let room = existingList[0];

    if (!room) {
      const initialRoom = {
        id: roomId,
        mode,
        roomCode: cleanCode,
        requiredCount: requiredQuota,
        status: "waiting",
        countdownSeconds: 5,
        topicLevel: "A2.2",
        topicChapter: 0,
        topicCategory: "all",
        participants: [] as Participant[],
        questions: [] as any[],
        battleLog: [] as string[],
        updatedAt: now,
        createdAt: now,
      };
      await db.insert(battleRooms).values(initialRoom).onConflictDoNothing();
      const refetch = await db.select().from(battleRooms).where(eq(battleRooms.id, roomId)).limit(1);
      room = refetch[0] || initialRoom;
    } else if (room.mode === "tournament" && room.requiredCount !== 8 && room.status === "waiting") {
      room.requiredCount = 8;
      await db.update(battleRooms).set({ requiredCount: 8 }).where(eq(battleRooms.id, roomId));
    }

    let participants = (room.participants as Participant[]) || [];
    let status = room.status;
    let countdownSeconds = room.countdownSeconds;
    let currentTopicLevel = room.topicLevel;
    let currentTopicChapter = room.topicChapter;
    let currentTopicCategory = room.topicCategory;
    let questions = (room.questions as any[]) || [];
    let battleLog = (room.battleLog as string[]) || [];

    if (action === "reset") {
      status = "waiting";
      countdownSeconds = 5;
      participants = [];
      questions = [];
      battleLog = [];
    }

    if (action === "finish_match") {
      status = "finished";
      // Clear rematch votes on match finish
      participants.forEach((p) => {
        p.rematchVote = false;
        p.isReady = false;
      });

      // Save match to battle_match_history in Neon Postgres
      if (participants.length > 0) {
        const sorted = [...participants].sort((a, b) => b.score - a.score || b.hp - a.hp);
        const winner = sorted[0];
        const matchId = `match_${now}_${Math.random().toString(36).substring(2, 7)}`;
        try {
          await db.insert(battleMatchHistory).values({
            id: matchId,
            roomCode: cleanCode,
            mode,
            topicLevel: currentTopicLevel,
            topicChapter: currentTopicChapter,
            topicCategory: currentTopicCategory,
            winnerEmail: winner?.email || null,
            winnerName: winner?.name || null,
            winnerAvatar: winner?.avatar || null,
            winnerTeam: winner?.team || null,
            participants,
            totalQuestions: questions.length || (mode === "tournament" ? 8 : 5),
            createdAt: now,
          });
        } catch (histErr) {
          console.error("Error saving match history:", histErr);
        }
      }
    }

    if (action === "submit_turn" && email) {
      const p = participants.find((part) => part.email.toLowerCase() === email.toLowerCase());
      if (p) {
        if (isCorrect) {
          p.score += 20;
          const newLog = `⚔️ ${p.name} menjawab BENAR! (+20 PTS)`;
          battleLog = [newLog, ...battleLog].slice(0, 10);
        } else {
          const dmg = chosenAnswer === "__TIMEOUT__" ? 30 : 25;
          p.hp = Math.max(0, p.hp - dmg);
          const newLog = `💥 ${p.name} ${chosenAnswer === "__TIMEOUT__" ? "KEHABISAN WAKTU" : "SALAH JAWAB"}! (-${dmg} HP)`;
          battleLog = [newLog, ...battleLog].slice(0, 10);
        }
      }
    }

    if (action === "request_rematch" && email) {
      const p = participants.find((part) => part.email.toLowerCase() === email.toLowerCase());
      if (p) {
        p.rematchVote = true;
      }

      // Check if ALL participants currently in the room agree to rematch
      const allVotedRematch =
        participants.length >= room.requiredCount &&
        participants.every((part) => part.rematchVote === true);

      if (allVotedRematch) {
        // Both agreed! Reset HP, score, ready, and trigger countdown with fresh shared questions
        status = "countdown";
        countdownSeconds = 5;
        participants.forEach((part) => {
          part.hp = 100;
          part.score = 0;
          part.isReady = true;
          part.rematchVote = false;
        });

        questions = generateBattleQuestions({
          level: currentTopicLevel as VocabLevel,
          chapter: currentTopicChapter,
          category: currentTopicCategory as VocabCategory,
          count: mode === "tournament" ? 8 : 5,
        });

        battleLog = [
          mode === "tournament"
            ? `🏆 BABAK REMATCH TURNAMEN DIMULAI! Topik: [${currentTopicLevel} • ${
                currentTopicChapter ? `Bab ${currentTopicChapter}` : "Semua Bab"
              } • ${currentTopicCategory.toUpperCase()}]`
            : `🔥 REMATCH DIMULAI! Topik: [${currentTopicLevel} • ${
                currentTopicChapter ? `Bab ${currentTopicChapter}` : "Semua Bab"
              } • ${currentTopicCategory.toUpperCase()}]`,
        ];
      }
    }

    if (action === "cancel_rematch" && email) {
      const p = participants.find((part) => part.email.toLowerCase() === email.toLowerCase());
      if (p) {
        p.rematchVote = false;
      }
    }

    if (action === "set_topic") {
      if (topicLevel) currentTopicLevel = topicLevel;
      if (typeof topicChapter === "number") currentTopicChapter = topicChapter;
      if (topicCategory) currentTopicCategory = topicCategory;
    }

    if (action === "leave" && email) {
      participants = participants.filter((p) => p.email.toLowerCase() !== email.toLowerCase());
      if (participants.length === 0) {
        status = "waiting";
        countdownSeconds = 5;
        questions = [];
        battleLog = [];
      } else if (status === "finished" || (status === "countdown" && participants.length < room.requiredCount)) {
        status = "waiting";
        countdownSeconds = 5;
        participants.forEach((p) => {
          p.rematchVote = false;
          p.isReady = false;
        });
      }
    }

    if (action === "toggle_ready" && email) {
      const p = participants.find((part) => part.email.toLowerCase() === email.toLowerCase());
      if (p) {
        p.isReady = typeof isReady === "boolean" ? isReady : !p.isReady;
      }

      const allReady =
        participants.length >= room.requiredCount &&
        participants.every((part) => part.isReady);

      if (allReady && status === "waiting") {
        status = "countdown";
        countdownSeconds = 5;
        // Generate authentic shared questions on server for all participants!
        questions = generateBattleQuestions({
          level: currentTopicLevel as VocabLevel,
          chapter: currentTopicChapter,
          category: currentTopicCategory as VocabCategory,
          count: mode === "tournament" ? 8 : 5,
        });
        battleLog = [
          mode === "tournament"
            ? `🏆 TURNAMEN RESMI OTSUTSUKI CUP DIMULAI! Perebutan Gelar Juara & Trophy Eksklusif! Topik: [${currentTopicLevel} • ${
                currentTopicChapter ? `Bab ${currentTopicChapter}` : "Semua Bab"
              } • ${currentTopicCategory.toUpperCase()}]`
            : `🔥 PERTANDINGAN DIMULAI! Topik: [${currentTopicLevel} • ${
                currentTopicChapter ? `Bab ${currentTopicChapter}` : "Semua Bab"
              } • ${currentTopicCategory.toUpperCase()}]`,
        ];
      } else if (!allReady && status === "countdown") {
        status = "waiting";
        countdownSeconds = 5;
      }
    }

    if (action === "choose_team" && email) {
      const p = participants.find((part) => part.email.toLowerCase() === email.toLowerCase());
      if (p) {
        p.team = team;
      }
    }

    if (action === "choose_avatar" && email) {
      const p = participants.find((part) => part.email.toLowerCase() === email.toLowerCase());
      if (p) {
        p.avatar = avatar;
      }
    }

    if (action === "join") {
      if ((status === "finished" || status === "in_battle") && participants.length === 0) {
        status = "waiting";
      }
      if (!email || !email.trim()) {
        return NextResponse.json({ error: "Identitas email akun siswa wajib diisi." }, { status: 400 });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name?.trim() || cleanEmail.split("@")[0].toUpperCase();

      const existingIdx = participants.findIndex((p) => p.email.toLowerCase() === cleanEmail);
      if (existingIdx >= 0) {
        participants[existingIdx].joinedAt = now;
        participants[existingIdx].name = cleanName;
        participants[existingIdx].avatar = avatar;
        if (team) participants[existingIdx].team = team;
      } else {
        if (participants.length >= room.requiredCount) {
          return NextResponse.json(
            { error: `Lobi sudah penuh (${room.requiredCount}/${room.requiredCount}). Buat atau gunakan kode room lain.` },
            { status: 400 }
          );
        }

        participants.push({
          email: cleanEmail,
          name: cleanName,
          avatar,
          team,
          joinedAt: now,
          score: 0,
          hp: 100,
          isReady: false,
        });
      }
    }

    // Save back to Neon PostgreSQL
    await db
      .update(battleRooms)
      .set({
        status,
        countdownSeconds,
        topicLevel: currentTopicLevel,
        topicChapter: currentTopicChapter,
        topicCategory: currentTopicCategory,
        participants,
        questions,
        battleLog,
        updatedAt: now,
      })
      .where(eq(battleRooms.id, roomId));

    const updatedRoom: BattleRoomEntity = {
      ...room,
      status,
      countdownSeconds,
      topicLevel: currentTopicLevel,
      topicChapter: currentTopicChapter,
      topicCategory: currentTopicCategory,
      participants,
      questions,
      battleLog,
      updatedAt: now,
    };

    return NextResponse.json({
      success: true,
      room: formatRoom(updatedRoom),
    });
  } catch (err: any) {
    console.error("POST battle-lobby error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
