export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { battleMatchHistory } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export interface MatchParticipant {
  email: string;
  name: string;
  avatar: string;
  team?: "shinobi" | "samurai";
  score: number;
  hp: number;
  isReady: boolean;
}

export interface MatchHistoryItem {
  id: string;
  roomCode: string;
  mode: string;
  topicLevel: string;
  topicChapter: number;
  topicCategory: string;
  winnerEmail: string | null;
  winnerName: string | null;
  winnerAvatar: string | null;
  winnerTeam: string | null;
  participants: MatchParticipant[];
  totalQuestions: number;
  createdAt: number;
}

export interface LeaderboardEntry {
  email: string;
  name: string;
  avatar: string;
  team: string;
  matchesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
  totalScore: number;
  rankTitle: string;
}

function resolveRankTitle(wins: number): string {
  if (wins >= 50) return "Kage Legendaris (Hokage)";
  if (wins >= 25) return "Jonin Elit (Sensei)";
  if (wins >= 10) return "Chunin Berpengalaman";
  if (wins >= 3) return "Genin Tangguh";
  return "Murid Akademi Baru";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase() || "";
    const limit = parseInt(searchParams.get("limit") || "25", 10);

    // 1. Fetch recent match history
    const rawMatches = await db
      .select()
      .from(battleMatchHistory)
      .orderBy(desc(battleMatchHistory.createdAt))
      .limit(limit);

    const matches: MatchHistoryItem[] = rawMatches.map((m) => ({
      id: m.id,
      roomCode: m.roomCode,
      mode: m.mode,
      topicLevel: m.topicLevel,
      topicChapter: m.topicChapter,
      topicCategory: m.topicCategory,
      winnerEmail: m.winnerEmail,
      winnerName: m.winnerName,
      winnerAvatar: m.winnerAvatar,
      winnerTeam: m.winnerTeam,
      participants: (m.participants as MatchParticipant[]) || [],
      totalQuestions: m.totalQuestions,
      createdAt: m.createdAt,
    }));

    // 2. Fetch all matches for building aggregated leaderboard
    const allMatches = await db
      .select()
      .from(battleMatchHistory)
      .orderBy(desc(battleMatchHistory.createdAt))
      .limit(200);

    const statsMap: Record<string, LeaderboardEntry> = {};

    for (const match of allMatches) {
      const parts = (match.participants as MatchParticipant[]) || [];
      for (const p of parts) {
        if (!p.email) continue;
        const e = p.email.toLowerCase();
        if (!statsMap[e]) {
          statsMap[e] = {
            email: e,
            name: p.name || e.split("@")[0].toUpperCase(),
            avatar: p.avatar || "🥷",
            team: p.team || "shinobi",
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
            totalScore: 0,
            rankTitle: "Murid Akademi Baru",
          };
        }

        statsMap[e].matchesPlayed += 1;
        statsMap[e].totalScore += p.score || 0;

        if (match.winnerEmail && match.winnerEmail.toLowerCase() === e) {
          statsMap[e].wins += 1;
        } else {
          statsMap[e].losses += 1;
        }
      }
    }

    // Calculate win rates and rank titles
    const leaderboard: LeaderboardEntry[] = Object.values(statsMap)
      .map((entry) => {
        const winRate = entry.matchesPlayed > 0 ? Math.round((entry.wins / entry.matchesPlayed) * 100) : 0;
        return {
          ...entry,
          winRate,
          rankTitle: resolveRankTitle(entry.wins),
        };
      })
      .sort((a, b) => b.wins - a.wins || b.totalScore - a.totalScore);

    return NextResponse.json(
      {
        success: true,
        matches,
        leaderboard,
      },
      {
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      }
    );
  } catch (err: any) {
    console.error("GET battle-history error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
