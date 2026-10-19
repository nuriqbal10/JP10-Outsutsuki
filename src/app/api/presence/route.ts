export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { onlinePresence, battleInvitations, battleRooms } from "@/db/schema";
import { eq, and, gt, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase() || "";
    const now = Date.now();
    const threshold = now - 45 * 1000; // active in last 45 seconds

    // 1. Fetch active online students
    const activeUsers = await db
      .select()
      .from(onlinePresence)
      .where(gt(onlinePresence.lastSeen, threshold))
      .orderBy(sql`last_seen DESC`);

    // 2. Fetch any pending duel invitation for this user
    let pendingInvite = null;
    if (email) {
      const invites = await db
        .select()
        .from(battleInvitations)
        .where(
          and(
            eq(battleInvitations.toEmail, email),
            eq(battleInvitations.status, "pending"),
            gt(battleInvitations.createdAt, now - 60 * 1000)
          )
        )
        .limit(1);

      if (invites.length > 0) {
        pendingInvite = invites[0];
      }
    }

    return NextResponse.json(
      {
        success: true,
        onlineUsers: activeUsers,
        pendingInvite,
      },
      {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      }
    );
  } catch (err: any) {
    console.error("GET presence error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, email, name, avatar, status = "online", roomCode, inviteId, response } = body;
    const now = Date.now();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // HEARTBEAT
    if (action === "heartbeat") {
      const cleanName = name?.trim() || cleanEmail.split("@")[0].toUpperCase();
      await db
        .insert(onlinePresence)
        .values({
          email: cleanEmail,
          name: cleanName,
          avatar: avatar || "🥷",
          status,
          currentRoomCode: roomCode || null,
          lastSeen: now,
        })
        .onConflictDoUpdate({
          target: onlinePresence.email,
          set: {
            name: cleanName,
            avatar: avatar || "🥷",
            status,
            currentRoomCode: roomCode || null,
            lastSeen: now,
          },
        });

      return NextResponse.json({ success: true });
    }

    // SEND DUEL CHALLENGE
    if (action === "send_invite") {
      const { toEmail, targetRoomCode } = body;
      if (!toEmail || !targetRoomCode) {
        return NextResponse.json({ error: "toEmail and targetRoomCode are required" }, { status: 400 });
      }

      const cleanToEmail = toEmail.trim().toLowerCase();
      const inviteId = `inv_${now}_${Math.random().toString(36).substring(2, 7)}`;

      await db.insert(battleInvitations).values({
        id: inviteId,
        fromEmail: cleanEmail,
        fromName: name || cleanEmail.split("@")[0],
        fromAvatar: avatar || "🥷",
        toEmail: cleanToEmail,
        roomCode: targetRoomCode.toUpperCase(),
        status: "pending",
        createdAt: now,
      });

      return NextResponse.json({ success: true, inviteId });
    }

    // RESPOND TO INVITATION (ACCEPT / DECLINE)
    if (action === "respond_invite") {
      if (!inviteId || !response) {
        return NextResponse.json({ error: "inviteId and response are required" }, { status: 400 });
      }

      await db
        .update(battleInvitations)
        .set({ status: response })
        .where(eq(battleInvitations.id, inviteId));

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("POST presence error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
