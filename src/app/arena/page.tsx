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
  Crown,
  Gamepad2,
  Clock,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Layers,
} from "lucide-react";

export default function ShinobiArenaPage() {
  const [gamerState, setGamerState] = useState<UserGamificationState | null>(null);

  // Active game router: null = Game Selection Catalog Hub, 'bunpou_puzzle' = In-place game
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "bunpou" | "kotoba" | "multiplayer">("all");
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);

  // Multiplayer Modal State
  const [isBattleModalOpen, setIsBattleModalOpen] = useState<boolean>(false);
  const [battleModalMode, setBattleModalMode] = useState<BattleMode>("1vs1");
  const [battleModalCategory, setBattleModalCategory] = useState<any>("all");

  useEffect(() => {
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
          <span className="font-bold">Memuat Shinobi Arcade Arena...</span>
        </div>
      </div>
    );
  }

  const openMultiplayer = (mode: BattleMode, category: any = "all") => {
    setBattleModalMode(mode);
    setBattleModalCategory(category);
    setIsBattleModalOpen(true);
  };

  // ============================================================================
  // DEFINISI KATALOG GAME ARCADE (MODULAR & SANGAT MUDAH DIKEMBANGKAN)
  // ============================================================================
  const ARCADE_GAMES = [
    {
      id: "bunpou_puzzle",
      title: "Bunpou Sentence Puzzle",
      jpTitle: "文法パズル・修羅の道",
      category: "bunpou",
      badge: "BARU & POPULER",
      badgeColor: "bg-amber-400 text-stone-950",
      icon: "🧩",
      cardBorder: "border-amber-500/40 hover:border-amber-400",
      glowBg: "from-amber-950/40 via-purple-950/30 to-slate-900",
      buttonColor: "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]",
      desc: "Susun potongan kosakata dan partikel pola kalimat Irodori (Level A1, A2.1, A2.2) dengan timer 30s dan dynamic difficulty.",
      features: ["264 Pola Kalimat Otentik", "Partikel Terpisah (は, を, に, で)", "Solo Dojo & 1v1 Real-Time"],
      tags: ["Solo vs Rival", "1v1 Duel", "Refleksi Review"],
      onPlay: () => setSelectedGame("bunpou_puzzle"),
      isComingSoon: false,
    },
    {
      id: "kotoba_blitz",
      title: "Kotoba Blitz 1 vs 1",
      jpTitle: "言葉速撃・真剣勝負",
      category: "kotoba",
      badge: "DUEL CEPAT",
      badgeColor: "bg-rose-500 text-white",
      icon: "⚔️",
      cardBorder: "border-rose-500/40 hover:border-rose-400",
      glowBg: "from-rose-950/40 via-slate-900 to-slate-900",
      buttonColor: "bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]",
      desc: "Duel adu kecepatan menjawab kosakata, kanji, dan arti bahasa Indonesia ala sistem Kahoot. Jawaban tercepat mendapat bonus poin!",
      features: ["Matchmaking Teman Sekelas", "Sistem Skor Kahoot", "HP & Serangan Jutsu"],
      tags: ["1 vs 1 Realtime", "Audio Choukai", "Kanji & Kotoba"],
      onPlay: () => openMultiplayer("1vs1"),
      isComingSoon: false,
    },
    {
      id: "tournament_cup",
      title: "Otsutsuki Knockout Cup",
      jpTitle: "大筒木杯・天下一武道会",
      category: "multiplayer",
      badge: "CHAMPIONSHIP",
      badgeColor: "bg-yellow-400 text-stone-950",
      icon: "🏆",
      cardBorder: "border-yellow-500/50 hover:border-yellow-400",
      glowBg: "from-yellow-950/40 via-purple-950/30 to-slate-900",
      buttonColor: "bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-stone-950 shadow-[0_0_20px_rgba(250,204,21,0.5)]",
      desc: "Turnamen sistem gugur 8 peserta kelas Outsutsuki! Melaju dari 8 Besar, Semifinal, hingga Grand Final untuk mengangkat Trofi Juara.",
      features: ["Bagan Turnamen Realtime", "Hadiah Trofi Permanen", "Unlock Avatar Eksklusif"],
      tags: ["8 Pemain", "Sistem Gugur", "Trofi & Gelar"],
      onPlay: () => openMultiplayer("tournament"),
      isComingSoon: false,
    },
    {
      id: "team_battle",
      title: "Team Squad Battle (2v2)",
      jpTitle: "忍連合・チーム対抗戦",
      category: "multiplayer",
      badge: "CO-OP FACTION",
      badgeColor: "bg-indigo-500 text-white",
      icon: "🛡️",
      cardBorder: "border-indigo-500/40 hover:border-indigo-400",
      glowBg: "from-indigo-950/40 via-slate-900 to-slate-900",
      buttonColor: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]",
      desc: "Bentuk faksi 2 vs 2 bersama teman sekelas. Gabungkan serangan dan pertahankan HP tim dari gempuran lawan secara kompak.",
      features: ["Faksi Kaminari vs Honoo", "Shared Team HP", "Leaderboard Faksi Mingguan"],
      tags: ["2 vs 2 Tim", "Kerja Sama", "Aliansi Shinobi"],
      onPlay: () => openMultiplayer("group"),
      isComingSoon: false,
    },
    {
      id: "survival_royale",
      title: "Survival Battle Royale",
      jpTitle: "大筒木サバイバル戦",
      category: "multiplayer",
      badge: "SURVIVAL",
      badgeColor: "bg-orange-500 text-stone-950",
      icon: "👑",
      cardBorder: "border-orange-500/40 hover:border-orange-400",
      glowBg: "from-orange-950/40 via-slate-900 to-slate-900",
      buttonColor: "bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]",
      desc: "Pertarungan bebas eliminasi 4-6 pemain di satu arena. Bertahan dari ronde demi ronde soal kecepatan tinggi hingga tersisa satu juara!",
      features: ["Multiplayer 4-6 Orang", "Eliminasi Bertahap", "Sudden-Death Round"],
      tags: ["Free-For-All", "Kecepatan Refleks", "Gelar Penyintas"],
      onPlay: () => openMultiplayer("all_members"),
      isComingSoon: false,
    },
    {
      id: "kanji_slash",
      title: "Kanji Ninja Slash",
      jpTitle: "漢字一閃・反射神経",
      category: "kotoba",
      badge: "SEGERA HADIR",
      badgeColor: "bg-slate-700 text-slate-300",
      icon: "🥷",
      cardBorder: "border-slate-800/80 opacity-75",
      glowBg: "from-slate-900/60 to-slate-950",
      buttonColor: "bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700",
      desc: "Game refleks menebas kanji yang tepat berdasarkan bunyi yomi dan arti konteks pekerjaan sebelum jatuh menyentuh tanah.",
      features: ["Blade Combo Multiplier", "Onyomi & Kunyomi Drill", "Refleks Kecepatan Tangan"],
      tags: ["Refleks Arcade", "Level N4/A2", "Dalam Pengembangan"],
      onPlay: () => alert("Game Kanji Ninja Slash sedang dalam tahap akhir pengembangan!"),
      isComingSoon: true,
    },
  ];

  const filteredGames = ARCADE_GAMES.filter((g) => {
    if (categoryFilter === "all") return true;
    if (categoryFilter === "bunpou") return g.category === "bunpou";
    if (categoryFilter === "kotoba") return g.category === "kotoba";
    if (categoryFilter === "multiplayer") return g.category === "multiplayer";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-purple-600 selection:text-white arena-dark-surface">
      {/* ==================================================================== */}
      {/* 1. JIKA SEDANG MEMILIH GAME TERTENTU (IN-PLACE RUNNER) */}
      {/* ==================================================================== */}
      {selectedGame === "bunpou_puzzle" && (
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Top Bar Kembali ke Lobi Arcade */}
          <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl shadow-xl backdrop-blur">
            <button
              onClick={() => setSelectedGame(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs transition flex items-center gap-2 border border-slate-700 hover:border-amber-400"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Kembali ke Lobi Arcade</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <span className="text-amber-400 font-black">{gamerState.rankBadge} {gamerState.rankTitle}</span>
              <span className="opacity-40">•</span>
              <span className="font-mono text-emerald-400">{gamerState.xp} XP</span>
            </div>
          </div>

          {/* Mount Game Bunpou Puzzle */}
          <BunpouPuzzleBattleArena
            onBackToHub={() => setSelectedGame(null)}
            onOpenMultiplayerModal={() => openMultiplayer("1vs1", "bunpou_puzzle")}
          />
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. JIKA DI LOBI UTAMA (KATALOG NETFLIX/STEAM ARCADE HUB) */}
      {/* ==================================================================== */}
      {selectedGame === null && (
        <div className="max-w-6xl mx-auto space-y-8">
          {/* HEADER ARENA & PROFIL STATUS SHINOBI */}
          <div className="bg-gradient-to-r from-[#170a2c] via-[#220d3f] to-[#120824] rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-purple-500/50 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur relative overflow-hidden">
            {/* Glow Aura */}
            <div className="absolute -top-16 -left-16 w-56 h-56 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3.5">
                <span className="text-4xl md:text-5xl shadow-inner">🥷</span>
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2 drop-shadow-[0_2px_12px_rgba(245,158,11,0.5)]">
                    SHINOBI ARCADE HUB <span className="text-amber-400">• 大筒木闘技場</span>
                  </h1>
                  <p className="text-purple-200 text-sm font-semibold mt-1">
                    Semua game latihan pola kalimat, duel kosakata, dan turnamen resmi kelas dalam 1 arena terpusat.
                  </p>
                </div>
              </div>
            </div>

            {/* STATUS KARTU PROFIL XP */}
            <div className="relative z-10 bg-slate-900/90 backdrop-blur border-2 border-purple-500/50 rounded-2xl p-4 flex items-center gap-4 w-full md:w-auto shadow-xl">
              <div className="text-3xl font-black text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]">
                {gamerState.rankBadge}
              </div>
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
                <div className="w-40 bg-slate-950 h-2.5 rounded-full mt-1.5 overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 h-full transition-all duration-500"
                    style={{ width: `${gamerState.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Tombol Cek Badge */}
              <button
                onClick={() => setShowBadgesModal(true)}
                className="ml-2 p-2.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-amber-300 transition text-xs font-bold flex flex-col items-center"
                title="Buka Koleksi Lencana"
              >
                <Trophy className="w-4 h-4 text-amber-400 mb-0.5" />
                <span className="text-[10px]">{gamerState.badges.length} Badge</span>
              </button>
            </div>
          </div>

          {/* SPOTLIGHT HERO: FEATURED GAME OF THE DAY */}
          <div className="bg-gradient-to-r from-[#200938] via-[#150a28] to-[#0d0718] border-2 border-amber-500/50 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-3 z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-black uppercase tracking-wider shadow">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                Mode Unggulan Terkini
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                🧩 Bunpou Sentence Puzzle Battle (A1, A2.1 & A2.2)
              </h2>
              <p className="text-slate-200 text-sm leading-relaxed font-medium">
                Tantang diri Anda menyusun kata dan partikel pola kalimat Irodori otentik dari termudah hingga tersulit.
                Pilih bertanding solo melawan AI Sensei Bot atau adu kecepatan realtime 1v1 melawan teman sekelas!
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-amber-300 font-bold pt-1">
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-amber-500/30">✓ 264 Pola Kalimat Lengkap</span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-amber-500/30">✓ 1.056 Varian Alami</span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-amber-500/30">✓ Timer 30 Detik & Refleksi Pembahasan</span>
              </div>
            </div>

            <div className="shrink-0 z-10 w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={() => setSelectedGame("bunpou_puzzle")}
                className="px-8 py-4 rounded-2xl font-black text-stone-950 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:from-amber-300 hover:to-orange-300 shadow-[0_0_30px_rgba(245,158,11,0.5)] ring-2 ring-amber-300 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 text-base"
              >
                <Play className="w-5 h-5 fill-current" />
                MAINKAN SEKARANG (SOLO & 1v1)
              </button>
            </div>
          </div>

          {/* FILTER KATEGORI GAME ARCADE */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-amber-400" />
                Pilih Mode Game Pertandingan
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Pilih format battle yang ingin Anda mainkan bersama shinobi kelas.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === "all"
                    ? "bg-purple-600 text-white shadow font-black"
                    : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                Semua Game ({ARCADE_GAMES.length})
              </button>
              <button
                onClick={() => setCategoryFilter("bunpou")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === "bunpou"
                    ? "bg-purple-600 text-white shadow font-black"
                    : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                Pola Kalimat (Bunpou)
              </button>
              <button
                onClick={() => setCategoryFilter("kotoba")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === "kotoba"
                    ? "bg-purple-600 text-white shadow font-black"
                    : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                Kosakata & Kanji
              </button>
              <button
                onClick={() => setCategoryFilter("multiplayer")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  categoryFilter === "multiplayer"
                    ? "bg-purple-600 text-white shadow font-black"
                    : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                Multiplayer & Turnamen
              </button>
            </div>
          </div>

          {/* GRID KATALOG GAME ARCADE */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className={`bg-gradient-to-b ${game.glowBg} border-2 ${game.cardBorder} rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:-translate-y-1 relative group overflow-hidden`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">
                      {game.icon}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm ${game.badgeColor}`}>
                      {game.badge}
                    </span>
                  </div>

                  {/* Title & JP Title */}
                  <h4 className="text-lg md:text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                    {game.title}
                  </h4>
                  <p className="text-[11px] font-japanese font-bold text-slate-400 mt-0.5">
                    {game.jpTitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-300 font-medium mt-3 leading-relaxed">
                    {game.desc}
                  </p>

                  {/* Features List */}
                  <div className="my-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                    {game.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="pt-2">
                  <button
                    disabled={game.isComingSoon}
                    onClick={game.onPlay}
                    className={`w-full py-3.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${game.buttonColor}`}
                  >
                    {game.isComingSoon ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>SEGERA HADIR</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>MAINKAN SEKARANG</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* KOLEKSI BADGE BANNER */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl font-black border border-amber-500/30 shrink-0">
                🏆
              </div>
              <div>
                <h4 className="text-base font-black text-white">
                  Koleksi Lencana Kehormatan Shinobi ({gamerState.badges.length}/{AVAILABLE_BADGES.length} Terbuka)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Setiap kemenangan di arena, streak belajar, dan turnamen akan membuka lencana prestisius di rapor Anda.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowBadgesModal(true)}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 hover:border-amber-400 transition whitespace-nowrap"
            >
              Lihat Semua Lencana ›
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. MODAL KOLEKSI BADGE */}
      {/* ==================================================================== */}
      {showBadgesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="bg-slate-900 border-2 border-purple-500/60 rounded-3xl p-6 max-w-3xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar relative shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="text-3xl">🏆</span>
                <div>
                  <h3 className="text-xl font-black text-white">Koleksi Lencana Shinobi Akademi</h3>
                  <p className="text-xs text-slate-400">Total {gamerState.badges.length} dari {AVAILABLE_BADGES.length} lencana berhasil dibuka</p>
                </div>
              </div>
              <button
                onClick={() => setShowBadgesModal(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                ✕ Tutup
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {AVAILABLE_BADGES.map((b) => {
                const isUnlocked = gamerState.badges.includes(b.id);
                return (
                  <div
                    key={b.id}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                      isUnlocked
                        ? "bg-slate-950 border-amber-500/40 text-white shadow-lg shadow-amber-500/10"
                        : "bg-slate-950/50 border-slate-800/60 text-slate-600 grayscale"
                    }`}
                  >
                    <div className="text-3xl shrink-0">{b.icon}</div>
                    <div className="min-w-0">
                      <div className="font-black text-xs truncate">{b.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{b.desc}</div>
                      <div className="mt-1 text-[9px] font-black uppercase">
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
        </div>
      )}

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
