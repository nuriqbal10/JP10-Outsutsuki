"use client";

import React, { useState, useMemo } from "react";
import {
  ShinobiGamePlayer,
  LeaderboardSortCategory,
  getInitialShinobiGameLeaderboard,
  sortGameLeaderboard,
} from "@/lib/shinobiGameLeaderboard";
import {
  Trophy,
  Flame,
  Swords,
  Shield,
  Zap,
  Target,
  Award,
  Crown,
  Search,
  Sparkles,
  Info,
} from "lucide-react";

interface ShinobiGameLeaderboardProps {
  currentUserName?: string;
  currentUserXp?: number;
  onClose?: () => void;
}

export default function ShinobiGameLeaderboard({
  currentUserName = "Ninja Otsutsuki (Anda)",
  currentUserXp = 0,
  onClose,
}: ShinobiGameLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<LeaderboardSortCategory>("overall");
  const [searchQuery, setSearchQuery] = useState("");

  const basePlayers = useMemo(() => {
    return getInitialShinobiGameLeaderboard(currentUserName, currentUserXp);
  }, [currentUserName, currentUserXp]);

  const sortedPlayers = useMemo(() => {
    const sorted = sortGameLeaderboard(basePlayers, activeTab);
    if (!searchQuery.trim()) return sorted;
    const q = searchQuery.toLowerCase();
    return sorted.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.nim.toLowerCase().includes(q) ||
        p.shinobiTitle.toLowerCase().includes(q) ||
        p.bestPillar.toLowerCase().includes(q)
    );
  }, [basePlayers, activeTab, searchQuery]);

  const topThree = sortedPlayers.slice(0, 3);

  return (
    <div className="space-y-6 text-stone-100 animate-in fade-in-50 duration-200">
      {/* 1. HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/60 via-stone-900 to-black p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-md">
                <Crown className="w-3.5 h-3.5" /> STANDALONE GAME LEADERBOARD
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-stone-300 text-[11px] font-bold border border-white/10">
                28 Shinobi Otsutsuki
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Papan Peringkat Arena Ninja
              <span className="text-amber-400 text-sm font-normal font-mono">
                忍の格付表
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
              Peringkat aktivitas turnamen, latihan dojo 6 pilar, pertempuran colosseum, dan akumulasi Chakra XP siswa klan Otsutsuki.
            </p>
          </div>

          {/* Alert Status Independensi Rapor */}
          <div className="p-3 rounded-2xl bg-black/50 border border-emerald-500/30 flex items-start gap-2.5 max-w-sm text-xs text-stone-300">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-400">100% Khusus Game:</span> Peringkat arena ini terpisah dari Rapor Akademis resmi sekolah. Rapor tetap dievaluasi berdasarkan rubrik kurikulum institusi.
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER TAB & PENCARIAN */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tab Kategori */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-stone-900/80 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setActiveTab("overall")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "overall"
                ? "bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 shadow-lg"
                : "text-stone-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Total Chakra XP
          </button>
          <button
            onClick={() => setActiveTab("training")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "training"
                ? "bg-gradient-to-r from-teal-400 to-emerald-500 text-stone-950 shadow-lg"
                : "text-stone-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Dojo 6 Pilar
          </button>
          <button
            onClick={() => setActiveTab("pvp")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "pvp"
                ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-lg"
                : "text-stone-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            Colosseum PvP
          </button>
          <button
            onClick={() => setActiveTab("streak")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "streak"
                ? "bg-gradient-to-r from-orange-400 to-amber-500 text-stone-950 shadow-lg"
                : "text-stone-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Win Streak
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, NIM, atau gelar..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-stone-900/80 border border-white/10 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 transition"
          />
        </div>
      </div>

      {/* 3. PODIUM 3 BESAR (HERO PODIUM) */}
      {!searchQuery && topThree.length === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Rank 2 (Silver) */}
          <div className="order-2 md:order-1 rounded-3xl border border-slate-400/30 bg-gradient-to-b from-slate-800/40 via-stone-900/60 to-black p-5 text-center flex flex-col items-center justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-2 left-3 text-2xl font-black text-slate-400">#2</div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center text-3xl shadow-lg mb-2">
              {topThree[1].avatar}
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400">{topThree[1].nim}</div>
              <h3 className="text-base font-black text-white">{topThree[1].name}</h3>
              <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-slate-400/20 text-slate-300 border border-slate-400/30 text-[11px] font-bold">
                {topThree[1].shinobiTitle} ({topThree[1].shinobiKanji})
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 w-full flex items-center justify-around text-xs">
              <div>
                <div className="text-stone-400 text-[10px]">Chakra XP</div>
                <div className="font-black text-amber-400">{topThree[1].chakraXp.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-stone-400 text-[10px]">Win Rate</div>
                <div className="font-bold text-emerald-400">{topThree[1].winRate}%</div>
              </div>
              <div>
                <div className="text-stone-400 text-[10px]">Streak</div>
                <div className="font-bold text-orange-400">{topThree[1].streak} 🔥</div>
              </div>
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="order-1 md:order-2 rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-950/60 via-stone-900 to-black p-6 text-center flex flex-col items-center justify-between shadow-[0_0_35px_rgba(245,158,11,0.25)] relative overflow-hidden -translate-y-2">
            <div className="absolute top-2 left-3 text-2xl font-black text-amber-400 flex items-center gap-1">
              <Crown className="w-6 h-6 text-amber-400 animate-bounce" /> #1
            </div>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center text-4xl shadow-2xl mb-2 ring-4 ring-amber-400/30">
              {topThree[0].avatar}
            </div>
            <div>
              <div className="text-xs font-mono text-amber-300/80">{topThree[0].nim}</div>
              <h3 className="text-lg font-black text-white">{topThree[0].name}</h3>
              <div className="inline-block mt-1 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black shadow-md">
                🏆 {topThree[0].shinobiTitle} ({topThree[0].shinobiKanji})
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-400/20 w-full flex items-center justify-around text-xs">
              <div>
                <div className="text-stone-400 text-[10px]">Chakra XP</div>
                <div className="text-sm font-black text-amber-400">{topThree[0].chakraXp.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-stone-400 text-[10px]">Win Rate</div>
                <div className="text-sm font-black text-emerald-400">{topThree[0].winRate}%</div>
              </div>
              <div>
                <div className="text-stone-400 text-[10px]">Streak</div>
                <div className="text-sm font-black text-orange-400">{topThree[0].streak} 🔥</div>
              </div>
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="order-3 md:order-3 rounded-3xl border border-amber-800/40 bg-gradient-to-b from-amber-950/20 via-stone-900/60 to-black p-5 text-center flex flex-col items-center justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-2 left-3 text-2xl font-black text-amber-700">#3</div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-900 flex items-center justify-center text-3xl shadow-lg mb-2">
              {topThree[2].avatar}
            </div>
            <div>
              <div className="text-xs font-mono text-amber-700/80">{topThree[2].nim}</div>
              <h3 className="text-base font-black text-white">{topThree[2].name}</h3>
              <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-amber-800/30 text-amber-300 border border-amber-800/40 text-[11px] font-bold">
                {topThree[2].shinobiTitle} ({topThree[2].shinobiKanji})
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 w-full flex items-center justify-around text-xs">
              <div>
                <div className="text-stone-400 text-[10px]">Chakra XP</div>
                <div className="font-black text-amber-400">{topThree[2].chakraXp.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-stone-400 text-[10px]">Win Rate</div>
                <div className="font-bold text-emerald-400">{topThree[2].winRate}%</div>
              </div>
              <div>
                <div className="text-stone-400 text-[10px]">Streak</div>
                <div className="font-bold text-orange-400">{topThree[2].streak} 🔥</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TABEL LENGKAP 28 SISWA KLON OTSUTSUKI */}
      <div className="rounded-3xl border border-white/10 bg-stone-900/80 overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/80 border-b border-white/10 text-stone-400 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 text-center w-14">Rank</th>
                <th className="py-3.5 px-4">Shinobi & NIM Resmi</th>
                <th className="py-3.5 px-4">Gelar Ninja</th>
                <th className="py-3.5 px-4">Sektor Unggulan</th>
                <th className="py-3.5 px-4 text-right">Chakra XP</th>
                <th className="py-3.5 px-4 text-center">Win Rate</th>
                <th className="py-3.5 px-4 text-center">Streak</th>
                <th className="py-3.5 px-4 text-center">Badges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sortedPlayers.map((player, index) => {
                const rankNum = index + 1;
                return (
                  <tr
                    key={player.id}
                    className={`transition hover:bg-white/5 ${
                      player.isCurrentUser
                        ? "bg-amber-500/10 border-l-4 border-l-amber-400 font-medium"
                        : ""
                    }`}
                  >
                    {/* Rank Number */}
                    <td className="py-3 px-4 text-center font-black">
                      {rankNum === 1 ? (
                        <span className="text-amber-400 text-sm">🥇 1</span>
                      ) : rankNum === 2 ? (
                        <span className="text-slate-300 text-sm">🥈 2</span>
                      ) : rankNum === 3 ? (
                        <span className="text-amber-700 text-sm">🥉 3</span>
                      ) : (
                        <span className="text-stone-400">#{rankNum}</span>
                      )}
                    </td>

                    {/* Shinobi Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          {player.avatar}
                        </span>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            {player.name}
                            {player.isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-400 text-stone-950 text-[10px] font-black">
                                ANDA
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-stone-400">
                            {player.nim}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Shinobi Title */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-stone-200">
                          {player.shinobiTitle}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {player.shinobiKanji} (Lv. {player.level})
                        </span>
                      </div>
                    </td>

                    {/* Best Pillar */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[11px] font-semibold">
                        {player.bestPillar}
                      </span>
                    </td>

                    {/* Chakra XP */}
                    <td className="py-3 px-4 text-right">
                      <div className="font-black text-amber-400 font-mono text-sm">
                        {player.chakraXp.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-stone-400">XP Chakra</div>
                    </td>

                    {/* Win Rate */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-emerald-400">
                        {player.winRate}%
                      </span>
                      <div className="text-[10px] text-stone-400">
                        {player.battlesWon}/{player.battlesPlayed} W
                      </div>
                    </td>

                    {/* Streak */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-orange-400 flex items-center justify-center gap-0.5">
                        {player.streak} <Flame className="w-3 h-3 fill-orange-400" />
                      </span>
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {player.badges.map((b, bIdx) => (
                          <span
                            key={bIdx}
                            className="w-5 h-5 rounded-full bg-stone-800 border border-white/10 flex items-center justify-center text-[10px]"
                            title={b}
                          >
                            🏅
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
