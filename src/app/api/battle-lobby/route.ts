export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

export type BattleMode = "1vs1" | "group" | "all_members";

export interface Participant {
  email: string;
  name: string;
  avatar: string;
  team?: "shinobi" | "samurai";
  joinedAt: number;
  score: number;
  hp: number;
  isReady: boolean;
}

export interface BattleRoom {
  id: string;
  mode: BattleMode;
  roomCode: string;
  requiredCount: number;
  status: "waiting" | "countdown" | "in_battle" | "finished";
  countdownSeconds: number;
  topicLevel: "all" | "A1" | "A2.1" | "A2.2";
  topicChapter: number; // 0 = all
  topicCategory: "all" | "noun" | "adj" | "verb1" | "verb2" | "verb3";
  participants: Participant[];
  createdAt: number;
  updatedAt: number;
}

// Global in-memory storage on Edge instance
const globalRooms: Map<string, BattleRoom> = new Map();

function resolveRoomId(mode: BattleMode, roomCode?: string | null): string {
  if (roomCode && roomCode.trim().length > 0) {
    return `custom_${roomCode.trim().toUpperCase()}`;
  }
  return `room_${mode}`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = (searchParams.get("mode") || "1vs1") as BattleMode;
    const roomCode = searchParams.get("roomCode");
    const sinceParam = searchParams.get("since");
    const since = sinceParam ? parseInt(sinceParam, 10) : 0;

    const now = Date.now();
    // Prune rooms inactive for > 15 minutes
    for (const [key, r] of globalRooms.entries()) {
      if (now - r.updatedAt > 15 * 60 * 1000) {
        globalRooms.delete(key);
      }
    }

    const roomId = resolveRoomId(mode, roomCode);
    let room = globalRooms.get(roomId);

    const requiredQuota = mode === "1vs1" ? 2 : mode === "group" ? 4 : 6;

    if (!room) {
      room = {
        id: roomId,
        mode,
        roomCode: roomCode ? roomCode.trim().toUpperCase() : mode.toUpperCase(),
        requiredCount: requiredQuota,
        status: "waiting",
        countdownSeconds: 5,
        topicLevel: "A2.2",
        topicChapter: 0,
        topicCategory: "all",
        participants: [],
        createdAt: now,
        updatedAt: now,
      };
      globalRooms.set(roomId, room);
    }

    // Delta Short-Circuit: If client already has the latest state, return tiny response
    if (since > 0 && room.updatedAt <= since) {
      return NextResponse.json(
        { success: true, changed: false, updatedAt: room.updatedAt },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        changed: true,
        room,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err: any) {
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
    } = body as {
      action: "join" | "leave" | "toggle_ready" | "choose_team" | "choose_avatar" | "set_topic" | "reset";
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
    };

    const roomId = resolveRoomId(mode, roomCode);
    const requiredQuota = mode === "1vs1" ? 2 : mode === "group" ? 4 : 6;
    const now = Date.now();

    let room = globalRooms.get(roomId);
    if (!room) {
      room = {
        id: roomId,
        mode,
        roomCode: roomCode ? roomCode.trim().toUpperCase() : mode.toUpperCase(),
        requiredCount: requiredQuota,
        status: "waiting",
        countdownSeconds: 5,
        topicLevel: "A2.2",
        topicChapter: 0,
        topicCategory: "all",
        participants: [],
        createdAt: now,
        updatedAt: now,
      };
      globalRooms.set(roomId, room);
    }

    if (action === "reset") {
      room.status = "waiting";
      room.countdownSeconds = 5;
      room.participants = [];
      room.updatedAt = now;
      return NextResponse.json({ success: true, room });
    }

    if (action === "set_topic") {
      if (topicLevel) room.topicLevel = topicLevel;
      if (typeof topicChapter === "number") room.topicChapter = topicChapter;
      if (topicCategory) room.topicCategory = topicCategory;
      room.updatedAt = now;
      return NextResponse.json({ success: true, room });
    }

    if (action === "leave") {
      if (email) {
        room.participants = room.participants.filter((p) => p.email.toLowerCase() !== email.toLowerCase());
      }
      if (room.status === "countdown" && room.participants.length < room.requiredCount) {
        room.status = "waiting";
        room.countdownSeconds = 5;
      }
      room.updatedAt = now;
      return NextResponse.json({ success: true, room });
    }

    if (action === "toggle_ready") {
      const p = room.participants.find((part) => part.email.toLowerCase() === (email || "").toLowerCase());
      if (p) {
        p.isReady = typeof isReady === "boolean" ? isReady : !p.isReady;
      }

      // Check if all participants are ready and quota is met
      const allReady =
        room.participants.length >= room.requiredCount &&
        room.participants.every((part) => part.isReady);

      if (allReady && room.status === "waiting") {
        room.status = "countdown";
        room.countdownSeconds = 5;
      } else if (!allReady && room.status === "countdown") {
        room.status = "waiting";
        room.countdownSeconds = 5;
      }

      room.updatedAt = now;
      return NextResponse.json({ success: true, room });
    }

    if (action === "choose_team") {
      const p = room.participants.find((part) => part.email.toLowerCase() === (email || "").toLowerCase());
      if (p) {
        p.team = team;
      }
      room.updatedAt = now;
      return NextResponse.json({ success: true, room });
    }

    if (action === "choose_avatar") {
      const p = room.participants.find((part) => part.email.toLowerCase() === (email || "").toLowerCase());
      if (p) {
        p.avatar = avatar;
      }
      room.updatedAt = now;
      return NextResponse.json({ success: true, room });
    }

    if (action === "join") {
      if (!email || !email.trim()) {
        return NextResponse.json({ error: "Identitas email akun siswa wajib diisi." }, { status: 400 });
      }

      const cleanEmail = email.trim().toLowerCase();
      const cleanName = name?.trim() || cleanEmail.split("@")[0].toUpperCase();

      const existingIdx = room.participants.findIndex((p) => p.email.toLowerCase() === cleanEmail);
      if (existingIdx >= 0) {
        room.participants[existingIdx].joinedAt = now;
        room.participants[existingIdx].name = cleanName;
        room.participants[existingIdx].avatar = avatar;
        if (team) room.participants[existingIdx].team = team;
      } else {
        if (room.participants.length >= room.requiredCount) {
          return NextResponse.json(
            { error: `Lobi sudah penuh (${room.requiredCount}/${room.requiredCount}). Pilih atau buat room lain.` },
            { status: 400 }
          );
        }

        room.participants.push({
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

      room.updatedAt = now;
      return NextResponse.json({ success: true, room });
    }

    return NextResponse.json({ success: true, room });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
