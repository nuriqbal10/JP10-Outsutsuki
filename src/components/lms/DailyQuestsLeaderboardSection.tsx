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
  Swords,
} from "lucide-react";
import { getDailyQuests, getLeaderboardData, DailyQuest, LeaderboardUser } from "@/lib/dailyQuests";
import { UserGamificationState, getGamificationState } from "@/lib/gamification";

export default function DailyQuestsLeaderboardSection({
  onOpenBattle,
}: {
  onOpenBattle?: () => void;
}) {
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [activeTab, setActiveTab] = useState<"quests" | "leaderboard">("quests");
  const [userState, setUserState] = useState<UserGamificationState | null>(null);

  useEffect(() => {
    const state = getGamificationState();
    setUserState(state);
    setQuests(getDailyQuests());
    setLeaderboard(getLeaderboardData("Anda (Shinobi)", state.xp, state.level));

    const handleQuestUpdate = (e: any) => {
      setQuests(e.detail);
    };

    const handleGamificationUpdate = (e: any) => {
      setUserState(e.detail);
      setLeaderboard(getLeaderboardData("Anda (Shinobi)", e.detail.xp, e.detail.level));
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
            <h3 className="text-base sm:text-lg font-black">Misi Harian & Papan Peringkat Shinobi</h3>
            <p className="text-xs opacity-70">
              Selesaikan misi harian untuk mengumpulkan XP & taklukkan peringkat kelas!
            </p>
          </div>
        </div>

        {/* TAB TOGGLES */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("quests")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              activeTab === "quests"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-black/5 dark:bg-white/5 hover:bg-black/10 opacity-80"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Misi Harian ({completedQuestsCount}/{quests.length})
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              activeTab === "leaderboard"
                ? "bg-amber-500 text-stone-950 shadow-md"
                : "bg-black/5 dark:bg-white/5 hover:bg-black/10 opacity-80"
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Papan Peringkat Kelas
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
                className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 ${
                  q.isCompleted
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
                        className={`h-full rounded-full transition-all duration-500 ${
                          q.isCompleted ? "bg-emerald-500" : "bg-gradient-to-r from-amber-400 to-amber-600"
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
          <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {leaderboard.map((user, idx) => {
              const rankPos = idx + 1;
              let medalIcon = <span className="font-mono text-xs font-black">{rankPos}</span>;
              if (rankPos === 1) medalIcon = <span className="text-xl">🥇</span>;
              else if (rankPos === 2) medalIcon = <span className="text-xl">🥈</span>;
              else if (rankPos === 3) medalIcon = <span className="text-xl">🥉</span>;

              return (
                <div
                  key={user.id}
                  className={`p-3 sm:p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    user.isCurrentUser
                      ? "bg-amber-500/15 border-amber-400 font-black shadow-lg ring-1 ring-amber-400/50"
                      : "bg-black/5 dark:bg-black/20 border-current/10 hover:bg-black/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                      {medalIcon}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xl">{user.avatar}</span>
                      <div>
                        <div className="text-xs sm:text-sm font-black flex items-center gap-2">
                          <span>{user.name}</span>
                          {user.isCurrentUser && (
                            <span className="text-[9px] font-black uppercase bg-amber-500 text-stone-950 px-1.5 py-0.5 rounded">
                              ANDA
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] opacity-60">
                          Lv.{user.level} • {user.rankTitle}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-right">
                    <div className="hidden sm:block">
                      <div className="text-[10px] font-bold text-rose-500 flex items-center gap-1 justify-end">
                        <Flame className="w-3 h-3 fill-current" /> {user.streak} Hari Streak
                      </div>
                      <div className="text-[10px] opacity-60">
                        {user.battlesWon}x Menang Battle
                      </div>
                    </div>

                    <div className="bg-amber-500/20 text-amber-500 border border-amber-400/30 px-3 py-1 rounded-xl font-mono font-black text-xs">
                      {user.xp} XP
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
