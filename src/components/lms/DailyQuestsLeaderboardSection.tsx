"use client";

import React, { useEffect, useState } from "react";
import {
  Trophy,
  Flame,
  Award,
  Crown,
  Medal,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  CheckCircle2,
  Clock,
  History,
  RotateCcw,
  Swords,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { getDailyQuests, getLeaderboardData, DailyQuest, LeaderboardUser } from "@/lib/dailyQuests";
import { UserGamificationState, getGamificationState } from "@/lib/gamification";

interface MatchParticipant {
  email: string;
  name: string;
  avatar: string;
  team?: "shinobi" | "samurai";
  score: number;
  hp: number;
  isReady: boolean;
}

interface MatchHistoryItem {
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

interface LeaderboardEntry {
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

function formatTimeAgo(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return "Baru saja";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} mnt lalu`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} jam lalu`;
  return `${Math.floor(diffHr / 24)} hari lalu`;
}

export default function DailyQuestsLeaderboardSection({
  onOpenBattle,
}: {
  onOpenBattle?: () => void;
}) {
  const { user: clerkUser } = useUser();
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [battleMatches, setBattleMatches] = useState<MatchHistoryItem[]>([]);
  const [battleLeaderboard, setBattleLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"quests" | "leaderboard" | "history">("quests");
  const [userState, setUserState] = useState<UserGamificationState | null>(null);

  const currentEmail = clerkUser?.primaryEmailAddress?.emailAddress?.toLowerCase() || "";
  const currentName = (clerkUser?.fullName || clerkUser?.firstName || "").toLowerCase();

  const fetchBattleData = async () => {
    try {
      const res = await fetch("/api/battle-history");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.matches)) setBattleMatches(data.matches);
          if (Array.isArray(data.leaderboard)) setBattleLeaderboard(data.leaderboard);
        }
      }
    } catch (e) { }
  };

  useEffect(() => {
    const state = getGamificationState();
    setUserState(state);
    setQuests(getDailyQuests());
    setLeaderboard(getLeaderboardData("Anda (Shinobi)", state.xp, state.level));
    fetchBattleData();

    const handleQuestUpdate = (e: any) => {
      setQuests(e.detail);
    };

    const handleGamificationUpdate = (e: any) => {
      setUserState(e.detail);
      setLeaderboard(getLeaderboardData("Anda (Shinobi)", e.detail.xp, e.detail.level));
      fetchBattleData();
    };

    window.addEventListener("daily-quests-updated", handleQuestUpdate);
    window.addEventListener("gamification-updated", handleGamificationUpdate);

    return () => {
      window.removeEventListener("daily-quests-updated", handleQuestUpdate);
      window.removeEventListener("gamification-updated", handleGamificationUpdate);
    };
  }, []);

  const completedQuestsCount = quests.filter((q) => q.isCompleted).length;

  return (
    <div className="clay-card rounded-3xl p-5 sm:p-7 border border-amber-500/30 shadow-xl relative overflow-hidden flex flex-col gap-6">
      {/* HEADER TABS & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black">
            🎯
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black">Misi Harian & Riwayat Battle Shinobi</h3>
            <p className="text-xs opacity-70">
              Selesaikan misi harian, kumpulkan riwayat kemenangan duel & taklukkan peringkat klan!
            </p>
          </div>
        </div>

        {/* TAB TOGGLES */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("quests")}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${activeTab === "quests"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-black/5 dark:bg-white/5 hover:bg-black/10 opacity-80"
              }`}
          >
            <Target className="w-3.5 h-3.5" />
            Misi Harian ({completedQuestsCount}/{quests.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("leaderboard");
              fetchBattleData();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${activeTab === "leaderboard"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-black/5 dark:bg-white/5 hover:bg-black/10 opacity-80"
              }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Papan Peringkat (Top 10)
          </button>
          <button
            onClick={() => {
              setActiveTab("history");
              fetchBattleData();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${activeTab === "history"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-black/5 dark:bg-white/5 hover:bg-black/10 opacity-80"
              }`}
          >
            <Swords className="w-3.5 h-3.5" />
            Riwayat Pertandingan ({battleMatches.length})
          </button>
        </div>
      </div>

      {/* CONTENT TAB 1: DAILY QUESTS */}
      {activeTab === "quests" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {quests.map((q) => {
            const pct = Math.min(100, Math.round((q.current / q.target) * 100));
            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 ${q.isCompleted
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-black/5 dark:bg-black/20 border-current/10 hover:border-amber-400/40"
                  }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{q.icon}</span>
                    <div>
                      <h4 className="font-black text-sm">{q.title}</h4>
                      <p className="text-xs opacity-70 mt-0.5">{q.desc}</p>
                    </div>
                  </div>
                  {q.isCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-black text-emerald-500 bg-emerald-500/15 px-2 py-0.5 rounded-lg shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono font-bold opacity-75 shrink-0">
                      {q.current}/{q.target}
                    </span>
                  )}
                </div>

                {/* PROGRESS & REWARD ROW */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-current/10">
                  <div className="w-36">
                    <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${q.isCompleted ? "bg-emerald-500" : "bg-gradient-to-r from-amber-400 to-amber-600"
                          }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                      +{q.rewardXp} XP
                    </span>
                    {q.category === "battle" && !q.isCompleted && onOpenBattle && (
                      <button
                        onClick={onOpenBattle}
                        className="clay-btn-gold px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 hover:scale-105 transition"
                      >
                        <Swords className="w-3 h-3" /> Tanding
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONTENT TAB 2: LEADERBOARD */}
      {activeTab === "leaderboard" && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1 text-xs opacity-75">
            <span className="font-bold flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-500" />
              10 Besar Jawara Battle Otsutsuki
            </span>
            <span className="text-[11px] font-mono opacity-80">
              {battleLeaderboard.length} Siswa Terdaftar
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {battleLeaderboard.length === 0 ? (
              <div className="text-center py-8 text-xs opacity-60">
                Memuat data papan peringkat...
              </div>
            ) : (
              battleLeaderboard.slice(0, 10).map((entry, idx) => {
                const rankPos = idx + 1;
                let medalIcon = <span className="font-mono text-xs font-black">{rankPos}</span>;
                if (rankPos === 1) medalIcon = <span className="text-xl">🥇</span>;
                else if (rankPos === 2) medalIcon = <span className="text-xl">🥈</span>;
                else if (rankPos === 3) medalIcon = <span className="text-xl">🥉</span>;

                const isMe =
                  (currentEmail && entry.email && entry.email.toLowerCase() === currentEmail) ||
                  (currentName && entry.name && entry.name.toLowerCase().includes(currentName));

                return (
                  <div
                    key={entry.email || entry.name || idx}
                    className={`p-3 sm:p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                      isMe
                        ? "bg-amber-500/15 border-amber-400 font-black shadow-lg ring-1 ring-amber-400/50"
                        : "bg-black/5 dark:bg-black/20 border-current/10 hover:bg-black/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                        {medalIcon}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xl">{entry.avatar || "🥷"}</span>
                        <div>
                          <div className="text-xs sm:text-sm font-black flex items-center gap-2">
                            <span>{entry.name}</span>
                            {isMe && (
                              <span className="text-[9px] font-black uppercase bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded">
                                ANDA
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] opacity-60 flex items-center gap-1.5 mt-0.5">
                            <span className="font-semibold text-amber-500">{entry.rankTitle}</span>
                            <span>•</span>
                            <span className="text-emerald-500 font-bold">{entry.winRate}% Win Rate</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-right">
                      <div className="hidden sm:block">
                        <div className="text-[10px] font-bold text-amber-500 flex items-center gap-1 justify-end">
                          <Trophy className="w-3 h-3" /> {entry.wins}x Menang ({entry.matchesPlayed} Match)
                        </div>
                        <div className="text-[10px] opacity-60">
                          Skor Duel: {entry.totalScore} PTS
                        </div>
                      </div>

                      <div className="bg-amber-500/20 text-amber-500 border border-amber-400/30 px-3 py-1 rounded-xl font-mono font-black text-xs">
                        {entry.totalScore} PTS
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* IF USER IS RANKED OUTSIDE TOP 10, DISPLAY USER'S STANDING */}
            {(() => {
              if (battleLeaderboard.length <= 10) return null;
              const userIdx = battleLeaderboard.findIndex(
                (e) =>
                  (currentEmail && e.email && e.email.toLowerCase() === currentEmail) ||
                  (currentName && e.name && e.name.toLowerCase().includes(currentName))
              );
              if (userIdx < 10) return null; // already shown in top 10
              const myEntry = battleLeaderboard[userIdx];
              if (!myEntry) return null;
              return (
                <div className="mt-3 pt-3 border-t border-dashed border-current/20">
                  <div className="text-[11px] font-bold opacity-70 mb-1.5 px-1 flex items-center gap-1">
                    <span>Posisi Peringkat Anda:</span>
                  </div>
                  <div className="p-3 sm:p-3.5 rounded-2xl border bg-amber-500/15 border-amber-400 font-black shadow-lg ring-1 ring-amber-400/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 font-mono text-xs font-black">
                        #{userIdx + 1}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{myEntry.avatar || "🥷"}</span>
                        <div>
                          <div className="text-xs sm:text-sm font-black flex items-center gap-2">
                            <span>{myEntry.name}</span>
                            <span className="text-[9px] font-black uppercase bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded">
                              ANDA
                            </span>
                          </div>
                          <div className="text-[10px] opacity-75 text-amber-400">
                            {myEntry.rankTitle} • {myEntry.winRate}% Win Rate
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] opacity-75">
                        {myEntry.wins}x Menang ({myEntry.matchesPlayed} Match)
                      </div>
                      <div className="font-mono text-xs text-amber-400">
                        {myEntry.totalScore} PTS
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* CONTENT TAB 3: BATTLE MATCH HISTORY */}
      {activeTab === "history" && (
        <div className="flex flex-col gap-3">
          {battleMatches.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-2xl bg-black/5 dark:bg-black/20 border border-current/10 flex flex-col items-center gap-3">
              <span className="text-4xl">📜</span>
              <div>
                <h4 className="font-black text-sm">Belum Ada Riwayat Pertandingan</h4>
                <p className="text-xs opacity-70 mt-1 max-w-sm">
                  Semua rekaman hasil duel Battle Royale (skor, HP, pemenang) akan otomatis tersimpan di database Neon secara permanen.
                </p>
              </div>
              {onOpenBattle && (
                <button
                  onClick={onOpenBattle}
                  className="clay-btn-gold px-5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow"
                >
                  <Swords className="w-3.5 h-3.5" /> Mulai Duel Sekarang
                </button>
              )}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
              {battleMatches.map((match) => {
                const p1 = match.participants[0];
                const p2 = match.participants[1];
                const isP1Winner = match.winnerEmail && p1 && match.winnerEmail.toLowerCase() === p1.email?.toLowerCase();
                const isP2Winner = match.winnerEmail && p2 && match.winnerEmail.toLowerCase() === p2.email?.toLowerCase();

                return (
                  <div
                    key={match.id}
                    className="p-3.5 rounded-2xl border border-current/10 bg-black/5 dark:bg-black/20 hover:border-amber-400/40 transition flex flex-col gap-2.5"
                  >
                    {/* MATCH HEADER INFO */}
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-black uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-md font-mono text-[10px]">
                          {match.mode === "1vs1" ? "1 VS 1 DUEL" : match.mode.toUpperCase()}
                        </span>
                        <span className="opacity-75 font-mono text-[10px]">
                          [{match.topicLevel} • {match.topicChapter ? `Bab ${match.topicChapter}` : "Semua Bab"} • {match.topicCategory?.toUpperCase()}]
                        </span>
                      </div>
                      <span className="text-[10px] opacity-60 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" /> {formatTimeAgo(match.createdAt)}
                      </span>
                    </div>

                    {/* MATCHUP VERSUS DISPLAY */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {/* Player 1 */}
                      {p1 && (
                        <div
                          className={`p-2 rounded-xl border flex items-center justify-between gap-2 ${isP1Winner
                              ? "bg-amber-500/15 border-amber-400/60 font-black shadow-sm"
                              : "bg-black/10 dark:bg-white/5 border-current/10 opacity-75"
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-lg">{p1.avatar || "🥷"}</span>
                            <div className="truncate">
                              <span className="font-bold truncate block">{p1.name}</span>
                              <span className="text-[9px] uppercase tracking-wider opacity-60 block">
                                {p1.team || "shinobi"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono font-black text-amber-400 block">{p1.score} PTS</span>
                            {isP1Winner && (
                              <span className="text-[9px] font-black uppercase text-amber-400 flex items-center gap-0.5 justify-end">
                                👑 MENANG
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Player 2 */}
                      {p2 && (
                        <div
                          className={`p-2 rounded-xl border flex items-center justify-between gap-2 ${isP2Winner
                              ? "bg-amber-500/15 border-amber-400/60 font-black shadow-sm"
                              : "bg-black/10 dark:bg-white/5 border-current/10 opacity-75"
                            }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-lg">{p2.avatar || "⚔️"}</span>
                            <div className="truncate">
                              <span className="font-bold truncate block">{p2.name}</span>
                              <span className="text-[9px] uppercase tracking-wider opacity-60 block">
                                {p2.team || "samurai"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono font-black text-amber-400 block">{p2.score} PTS</span>
                            {isP2Winner && (
                              <span className="text-[9px] font-black uppercase text-amber-400 flex items-center gap-0.5 justify-end">
                                👑 MENANG
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}