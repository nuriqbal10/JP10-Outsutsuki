export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { battleMatchHistory } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import {
  TOURNAMENT_REWARD_TIERS,
  getTournamentUnlockStatus,
} from "@/data/tournamentRewards";

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
  tournamentWins: number;
  tournamentPlayed: number;
  tournamentTitle: string;
  unlockedAvatars: string[];
  unlockedBadges: any[];
}

function resolveRankTitle(wins: number): string {
  if (wins >= 20) return "Kage Legendaris (Hokage)";
  if (wins >= 10) return "Jonin Elit (Sensei)";
  if (wins >= 6) return "Chunin Berpengalaman";
  if (wins >= 3) return "Genin Tangguh";
  return "Murid Akademi";
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
      .limit(500);

    const statsMap: Record<string, LeaderboardEntry> = {};

    for (const match of allMatches) {
      const parts = (match.participants as MatchParticipant[]) || [];
      const isTournament = match.mode === "tournament";

      for (const p of parts) {
        const key = (p.email || p.name || "").toLowerCase().trim();
        if (!key) continue;

        if (!statsMap[key]) {
          statsMap[key] = {
            email: p.email || "",
            name: p.name || key,
            avatar: p.avatar || "🥷",
            team: p.team || "shinobi",
            matchesPlayed: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
            totalScore: 0,
            rankTitle: "Murid Akademi",
            tournamentWins: 0,
            tournamentPlayed: 0,
            tournamentTitle: "Peserta Turnamen Baru",
            unlockedAvatars: [],
            unlockedBadges: [],
          };
        }

        statsMap[key].matchesPlayed += 1;
        statsMap[key].totalScore += p.score || 0;

        if (isTournament) {
          statsMap[key].tournamentPlayed += 1;
        }

        const isWinner =
          (match.winnerEmail && p.email && match.winnerEmail.toLowerCase().trim() === p.email.toLowerCase().trim()) ||
          (match.winnerName && p.name && match.winnerName.toLowerCase().trim() === p.name.toLowerCase().trim());

        if (isWinner) {
          statsMap[key].wins += 1;
          if (isTournament) {
            statsMap[key].tournamentWins += 1;
          }
        } else {
          statsMap[key].losses += 1;
        }
      }
    }

    // Calculate win rates, rank titles, and tournament rewards unlock status
    const leaderboard: LeaderboardEntry[] = Object.values(statsMap)
      .map((entry) => {
        const winRate = entry.matchesPlayed > 0 ? Math.round((entry.wins / entry.matchesPlayed) * 100) : 0;
        const tournamentStatus = getTournamentUnlockStatus(entry.tournamentWins);
        return {
          ...entry,
          winRate,
          rankTitle: resolveRankTitle(entry.wins),
          tournamentTitle: tournamentStatus.currentTitle,
          unlockedAvatars: Array.from(tournamentStatus.unlockedAvatars),
          unlockedBadges: tournamentStatus.unlockedBadges,
        };
      })
      .sort((a, b) => b.wins - a.wins || b.totalScore - a.totalScore);

    // Dedicated tournament champions leaderboard
    const tournamentLeaderboard = [...leaderboard]
      .filter((e) => e.tournamentWins > 0 || e.tournamentPlayed > 0)
      .sort(
        (a, b) =>
          b.tournamentWins - a.tournamentWins ||
          b.wins - a.wins ||
          b.totalScore - a.totalScore
      );

    return NextResponse.json(
      {
        success: true,
        matches,
        leaderboard,
        tournamentLeaderboard,
        tournamentRewardTiers: TOURNAMENT_REWARD_TIERS,
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
