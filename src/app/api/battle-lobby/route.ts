export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import masterRaporDataRaw from "@/data/raporMasterData.json";

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
  participants: Participant[];
  createdAt: number;
  updatedAt: number;
}

// Global in-memory storage on Edge instance
const globalRooms: Map<string, BattleRoom> = new Map();

function getEnrolledMembers() {
  const levels = (masterRaporDataRaw as any)?.levels;
  const listA22 = levels?.["A2.2"]?.students || levels?.["A1"]?.students || [];
  return listA22.map((s: any) => ({
    name: s.name,
    email: `${s.name.toLowerCase().replace(/[^a-z0-9]/g, ".")}@irodori.outsutsuki.sch.id`,
    avatar: s.name.length % 2 === 0 ? "🥷" : "🌸",
  }));
}

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
    const userEmail = searchParams.get("email");

    const now = Date.now();
    // Prune rooms inactive for > 30 minutes
    for (const [key, room] of globalRooms.entries()) {
      if (now - room.updatedAt > 30 * 60 * 1000) {
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
        participants: [],
        createdAt: now,
        updatedAt: now,
      };
      globalRooms.set(roomId, room);
    }

    const enrolledMembers = getEnrolledMembers();

    return NextResponse.json({
      success: true,
      room,
      enrolledMembers,
    });
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
    } = body as {
      action: "join" | "leave" | "toggle_ready" | "choose_team" | "choose_avatar" | "reset";
      mode?: BattleMode;
      roomCode?: string;
      email: string;
      name?: string;
      avatar?: string;
      team?: "shinobi" | "samurai";
      isReady?: boolean;
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

    if (action === "leave") {
      room.participants = room.participants.filter((p) => p.email !== email);
      if (room.status === "countdown" && room.participants.length < room.requiredCount) {
        room.status = "waiting";
        room.countdownSeconds = 5;
      }
      room.updatedAt = now;
      return NextResponse.json({ success: true, room });
    }

    if (action === "toggle_ready") {
      const p = room.participants.find((part) => part.email === email);
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
      const p = room.participants.find((part) => part.email === email);
      if (p) {
        p.team = team;
      }
      room.updatedAt = now;
      return NextResponse.json({ success: true, room });
    }

    if (action === "choose_avatar") {
      const p = room.participants.find((part) => part.email === email);
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

      const existingIdx = room.participants.findIndex((p) => p.email === cleanEmail);
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
          isReady: false, // Siswa menentukan kesiapan sendiri via tombol SAYA SIAP
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
