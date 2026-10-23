"use client";

import React, { useState, useEffect } from "react";
import {
  getGamificationState,
  AVAILABLE_BADGES,
  UserGamificationState,
} from "@/lib/gamification";
import BunpouPuzzleBattleArena from "@/components/arena/BunpouPuzzleBattleArena";
import BattleRoyaleModal, { BattleMode } from "@/components/lms/BattleRoyaleModal";
import {
  Swords,
  Shield,
  Trophy,
  Flame,
  Sparkles,
  Zap,
  Users,
  Puzzle,
  Play,
  RotateCcw,
} from "lucide-react";

export default function ShinobiArenaPage() {
  const [gamerState, setGamerState] = useState<UserGamificationState | null>(null);
  const [activeTab, setActiveTab] = useState<
    "hub" | "puzzle_battle" | "duel" | "team" | "badges"
  >("puzzle_battle"); // Default to puzzle_battle to immediately showcase the new mode

  // Multiplayer Modal State
  const [isBattleModalOpen, setIsBattleModalOpen] = useState<boolean>(false);
  const [battleModalMode, setBattleModalMode] = useState<BattleMode>("1vs1");
  const [battleModalCategory, setBattleModalCategory] = useState<any>("all");
  const [customRoomCode, setCustomRoomCode] = useState<string>("");

  useEffect(() => {
    // Muat data gamifikasi saat halaman dibuka
    setGamerState(getGamificationState());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserGamificationState>;
      if (customEvent.detail) {
        setGamerState(customEvent.detail);
      }
    };

    window.addEventListener("gamification-updated", handleUpdate as EventListener);
    return () => {
      window.removeEventListener("gamification-updated", handleUpdate as EventListener);
    };
  }, []);

  if (!gamerState) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-bold">Memuat Shinobi Arena...</span>
        </div>
      </div>
    );
  }

  const openMultiplayer = (mode: BattleMode, category: string = "all") => {
    setBattleModalMode(mode);
    setBattleModalCategory(category);
    setIsBattleModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10 font-sans selection:bg-purple-600 selection:text-white arena-dark-surface">
      {/* HEADER ARENA */}
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-[#170a2c] via-[#220d3f] to-[#120824] rounded-3xl p-6 shadow-2xl border-2 border-purple-500/50 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <span className="text-4xl shadow-inner">🥷</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
                SHINOBI ARENA <span className="text-amber-400">• 大筒木クラス</span>
              </h1>
              <p className="text-purple-200 text-sm font-semibold mt-0.5">
                Pusat Latihan Tempur Kotoba, Pola Kalimat Bunpou & Simulasi JFT-Basic
              </p>
            </div>
          </div>
        </div>

        {/* STATUS KARTU PROFIL XP */}
        <div className="relative z-10 bg-slate-900/90 backdrop-blur border-2 border-purple-500/50 rounded-2xl p-4 flex items-center gap-4 w-full md:w-auto shadow-xl">
          <div className="text-3xl font-black text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]">{gamerState.rankBadge}</div>
          <div>
            <div className="text-xs text-slate-300 uppercase tracking-wider font-extrabold">
              {gamerState.rankTitle} <span className="text-amber-400 font-black">(Lv. {gamerState.level})</span>
            </div>
            <div className="text-lg font-black text-white">
              {gamerState.xp} XP{" "}
              <span className="text-xs text-emerald-400 font-bold ml-1">
                🔥 {gamerState.dailyStreak} Hari Streak
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-36 bg-slate-950 h-2.5 rounded-full mt-1.5 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${gamerState.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* NAVIGASI MENU ARENA */}
      <div className="max-w-5xl mx-auto flex flex-wrap gap-2.5 mb-8">
        <button
          onClick={() => setActiveTab("puzzle_battle")}
          className={`px-4 py-2.5 rounded-xl font-black text-xs md:text-sm transition-all flex items-center gap-2 ${
            activeTab === "puzzle_battle"
              ? "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-2 ring-amber-300 scale-[1.02]"
              : "bg-slate-900/90 text-amber-300 hover:text-white hover:bg-slate-800 border border-amber-500/40"
          }`}
        >
          🧩 Bunpou Puzzle Battle
          <span className="text-[10px] uppercase px-1.5 py-0.2 rounded-full bg-black/30 font-black">
            Baru
          </span>
        </button>

        <button
          onClick={() => setActiveTab("hub")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
            activeTab === "hub"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] ring-1 ring-purple-400/60 font-black scale-[1.02]"
              : "bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80"
          }`}
        >
          ⚡ Beranda Arena
        </button>

        <button
          onClick={() => setActiveTab("duel")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
            activeTab === "duel"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] ring-1 ring-purple-400/60 font-black scale-[1.02]"
              : "bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80"
          }`}
        >
          ⚔️ Duel 1v1 Kotoba
        </button>

        <button
          onClick={() => setActiveTab("team")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
            activeTab === "team"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] ring-1 ring-purple-400/60 font-black scale-[1.02]"
              : "bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80"
          }`}
        >
          🛡️ Team Battle Squad
        </button>

        <button
          onClick={() => setActiveTab("badges")}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
            activeTab === "badges"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] ring-1 ring-purple-400/60 font-black scale-[1.02]"
              : "bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700/80"
          }`}
        >
          🏆 Koleksi Badge ({gamerState.badges.length})
        </button>
      </div>

      {/* ==================================================================== */}
      {/* KONTEN UTAMA BERDASARKAN TAB */}
      {/* ==================================================================== */}
      <div className="max-w-5xl mx-auto">
        {/* TAB 1: BUNPOU PUZZLE BATTLE */}
        {activeTab === "puzzle_battle" && (
          <BunpouPuzzleBattleArena
            onBackToHub={() => setActiveTab("hub")}
            onOpenMultiplayerModal={() => openMultiplayer("1vs1", "bunpou_puzzle")}
          />
        )}

        {/* TAB 2: HUB / BERANDA ARENA */}
        {activeTab === "hub" && (
          <div className="space-y-6">
            {/* FEATURED BANNER: BUNPOU PUZZLE */}
            <div className="bg-gradient-to-r from-amber-950/70 via-purple-950/70 to-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Mode Unggulan Baru
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  🧩 Bunpou Puzzle Battle Arena
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Latih kecepatan menyusun kata dan partikel pola kalimat Irodori (Level A1, A2.1, A2.2)
                  dalam format pertarungan 1v1 melawan 29 shinobi rival Kelas Outsutsuki!
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-amber-300 font-semibold pt-1">
                  <span>✓ 264 Pola Kalimat Otentik</span>
                  <span>•</span>
                  <span>✓ Partikel Terpisah (は, を, に, で)</span>
                  <span>•</span>
                  <span>✓ Live HP & Jutsu Combo</span>
                </div>
              </div>

              <div className="shrink-0 z-10 w-full md:w-auto">
                <button
                  onClick={() => setActiveTab("puzzle_battle")}
                  className="w-full md:w-auto px-6 py-4 rounded-xl font-black text-stone-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-xl shadow-orange-500/30 transition flex items-center justify-center gap-2 text-base"
                >
                  <Play className="w-5 h-5 fill-current" />
                  MAIN PUZZLE BATTLE SEKARANG
                </button>
              </div>
            </div>

            {/* GRID MODE LAINNYA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* DUEL CARD */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-purple-500/50 transition-all shadow-xl">
                <div>
                  <div className="text-4xl mb-3">⚔️</div>
                  <h3 className="text-xl font-bold text-white mb-2">Mode Duel 1v1 Kotoba</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    Tantang teman sekelas secara *real-time* adu kecepatan menjawab kosakata, kanji, dan pola kalimat pilihan.
                  </p>
                </div>
                <button
                  onClick={() => openMultiplayer("1vs1")}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5"
                >
                  Mulai Duel 1v1 ›
                </button>
              </div>

              {/* SQUAD CARD */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all shadow-xl">
                <div>
                  <div className="text-4xl mb-3">🛡️</div>
                  <h3 className="text-xl font-bold text-white mb-2">Team Battle (Squad)</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    Bentuk aliansi tim kelas Outsutsuki, kumpulkan poin kolektif terbanyak untuk menguasai takhta mingguan.
                  </p>
                </div>
                <button
                  onClick={() => openMultiplayer("group")}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5"
                >
                  Masuk Squad Battle ›
                </button>
              </div>

              {/* TOURNAMENT CUP */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl">
                <div>
                  <div className="text-4xl mb-3">🏆</div>
                  <h3 className="text-xl font-bold text-white mb-2">Turnamen Knockout Cup</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                    Turnamen 8 besar knockout bracket kelas Outsutsuki! Menangkan piala dan buka avatar shinobi eksklusif.
                  </p>
                </div>
                <button
                  onClick={() => openMultiplayer("tournament")}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-1.5"
                >
                  Ikuti Turnamen Cup ›
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DUEL 1V1 SCREEN */}
        {activeTab === "duel" && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
            <div>
              <div className="text-5xl mb-2">⚔️</div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Arena Duel 1v1 Kotoba & Bunpou
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm mt-1">
                Sistem matchmaking real-time siap mempertemukan Anda dengan penantang dari 29 siswa Kelas Outsutsuki.
              </p>
            </div>

            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 max-w-md mx-auto space-y-4 shadow-xl">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Lobi Pertandingan Real-Time
              </div>
              <button
                type="button"
                onClick={() => openMultiplayer("1vs1")}
                className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-sm shadow-lg shadow-purple-600/30 transition flex items-center justify-center gap-2"
              >
                <Swords className="w-4 h-4" />
                BUAT / GABUNG LOBI DUEL (REAL-TIME)
              </button>

              <div className="relative flex items-center justify-center py-2">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-950 px-3 text-[11px] text-slate-500 uppercase font-mono">
                  Atau Mode Solo Speedrun
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("puzzle_battle")}
                className="w-full py-3 rounded-xl bg-amber-600/30 hover:bg-amber-600/40 border border-amber-500/40 text-amber-300 font-bold text-xs transition flex items-center justify-center gap-2"
              >
                🧩 Buka Mode Bunpou Puzzle Battle
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: TEAM BATTLE SQUAD */}
        {activeTab === "team" && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl">
            <div>
              <div className="text-5xl mb-2">🛡️</div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Team Battle (Squad Outsutsuki)
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm mt-1">
                29 siswa dibagi menjadi faksi shinobi untuk menguji kekompakan penguasaan materi Irodori secara real-time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="p-5 bg-slate-950 border border-indigo-500/30 rounded-xl text-left shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-indigo-400 text-lg">⚡ Faksi チーム雷 (Team Kaminari)</h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold">14 Shinobi</span>
                </div>
                <p className="text-xs text-slate-400">Total XP Tim: 3,450 XP</p>
              </div>

              <div className="p-5 bg-slate-950 border border-purple-500/30 rounded-xl text-left shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-purple-400 text-lg">🔥 Faksi チーム炎 (Team Honoo)</h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold">15 Shinobi</span>
                </div>
                <p className="text-xs text-slate-400">Total XP Tim: 3,890 XP</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => openMultiplayer("group")}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition inline-flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Mulai Pertempuran Faksi (Multiplayer Room)
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: BADGES COLLECTION */}
        {activeTab === "badges" && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center justify-center gap-2">
                🏆 Koleksi Badge Shinobi
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Lencana kehormatan yang berhasil Anda buka dari misi harian, battle arena, dan ujian simulasi JFT.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AVAILABLE_BADGES.map((b) => {
                const isUnlocked = gamerState.badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
                      isUnlocked
                        ? "bg-slate-950 border-amber-500/40 text-white shadow-lg shadow-amber-500/10"
                        : "bg-slate-950/40 border-slate-800/50 text-slate-600 grayscale"
                    }`}
                  >
                    <div className="text-4xl">{b.icon}</div>
                    <div>
                      <div className="font-bold text-sm">{b.name}</div>
                      <div className="text-xs text-slate-400">{b.desc}</div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider">
                        {isUnlocked ? (
                          <span className="text-emerald-400">✔ Terbuka</span>
                        ) : (
                          <span className="text-slate-600">🔒 Terkunci</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MULTIPLAYER / TOURNAMENT ROYALE MODAL */}
      <BattleRoyaleModal
        isOpen={isBattleModalOpen}
        onClose={() => setIsBattleModalOpen(false)}
        initialMode={battleModalMode}
        initialCategory={battleModalCategory}
      />
    </div>
  );
}
