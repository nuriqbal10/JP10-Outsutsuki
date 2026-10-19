export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { sql } from "drizzle-orm";
import masterRaporDataRaw from "@/data/raporMasterData.json";

// In-memory active battle rooms for Edge Runtime
// Key: room code or mode ("1vs1" | "group" | "all_members")
interface BattleRoom {
  id: string;
  mode: "1vs1" | "group" | "all_members";
  requiredCount: number;
  status: "waiting" | "countdown" | "in_battle" | "finished";
  countdownSeconds: number;
  participants: {
    email: string;
    name: string;
    avatar: string;
    joinedAt: number;
    score: number;
    hp: number;
    isReady: boolean;
  }[];
  createdAt: number;
  updatedAt: number;
}

// Global variable across requests in edge instance
const globalRooms: Map<string, BattleRoom> = new Map();

// Helper to get master enrolled members list
function getEnrolledMembers() {
  const levels = (masterRaporDataRaw as any)?.levels;
  const listA22 = levels?.["A2.2"]?.students || levels?.["A1"]?.students || [];
  return listA22.map((s: any) => ({
    name: s.name,
    email: `${s.name.toLowerCase().replace(/[^a-z0-9]/g, ".")}@irodori.outsutsuki.sch.id`,
    avatar: s.name.length % 2 === 0 ? "🥷" : "🌸",
  }));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = (searchParams.get("mode") || "1vs1") as "1vs1" | "group" | "all_members";
    const userEmail = searchParams.get("email");

    // Clean up stale rooms older than 15 minutes
    const now = Date.now();
    for (const [key, room] of globalRooms.entries()) {
      if (now - room.updatedAt > 15 * 60 * 1000) {
        globalRooms.delete(key);
      }
    }

    const roomId = `room_${mode}`;
    let room = globalRooms.get(roomId);

    const requiredQuota = mode === "1vs1" ? 2 : mode === "group" ? 4 : 6;

    if (!room) {
      room = {
        id: roomId,
        mode,
        requiredCount: requiredQuota,
        status: "waiting",
        countdownSeconds: 5,
        participants: [],
        createdAt: now,
        updatedAt: now,
      };
      globalRooms.set(roomId, room);
    }

    // Also fetch enrolled members for autocomplete/selection
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
    const { action, mode, email, name, avatar } = body as {
      action: "join" | "leave" | "ready" | "reset";
      mode: "1vs1" | "group" | "all_members";
      email: string;
      name?: string;
      avatar?: string;
    };

    const roomId = `room_${mode || "1vs1"}`;
    const requiredQuota = mode === "1vs1" ? 2 : mode === "group" ? 4 : 6;
    const now = Date.now();

    let room = globalRooms.get(roomId);
    if (!room) {
      room = {
        id: roomId,
        mode: mode || "1vs1",
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

    if (action === "join") {
      if (!email) {
        return NextResponse.json({ error: "Email member terdaftar wajib diisi." }, { status: 400 });
      }

      // Check if already in room
      const existingIdx = room.participants.findIndex((p) => p.email === email);
      if (existingIdx >= 0) {
        room.participants[existingIdx].joinedAt = now;
        room.participants[existingIdx].name = name || room.participants[existingIdx].name;
      } else {
        // Only allow if not full or already in battle
        if (room.participants.length >= room.requiredCount) {
          return NextResponse.json(
            { error: `Kuota lobi penuh (${room.requiredCount}/${room.requiredCount} member). Tunggu pertandingan selesai!` },
            { status: 400 }
          );
        }

        room.participants.push({
          email,
          name: name || email.split("@")[0],
          avatar: avatar || "🥷",
          joinedAt: now,
          score: 0,
          hp: 100,
          isReady: true,
        });
      }

      // Check if quota met -> trigger countdown
      if (room.participants.length >= room.requiredCount && room.status === "waiting") {
        room.status = "countdown";
        room.countdownSeconds = 5;
      }

      room.updatedAt = now;
      return NextResponse.json({ success: true, room });
    }

    return NextResponse.json({ success: true, room });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
