"use client";

import React, { useState, useEffect } from "react";
import {
  getGamificationState,
  AVAILABLE_BADGES,
  UserGamificationState,
} from "@/lib/gamification";
import BunpouPuzzleBattleArena from "@/components/arena/BunpouPuzzleBattleArena";
import GuessPictureGame from "@/components/arena/GuessPictureGame";
import ShinobiAdventureGame from "@/components/arena/ShinobiAdventureGame";
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
  AlertCircle,
  Lock,
  Layers,
  UserCheck,
  User,
  BarChart2,
  TrendingUp,
  Award,
  Eye,
  Target,
  Compass,
} from "lucide-react";

export default function ShinobiArenaPage() {
  const [gamerState, setGamerState] = useState<UserGamificationState | null>(null);

  // Active game router: null = Game Selection Catalog Hub, 'bunpou_puzzle' = In-place game
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<"all" | "bunpou" | "kotoba" | "multiplayer">("all");
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

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
      badge: "10 RONDE • 10 HP / HIT",
      badgeColor: "bg-amber-400 text-stone-950",
      icon: "🧩",
      cardBorder: "border-amber-500/40 hover:border-amber-400",
      glowBg: "from-amber-950/40 via-purple-950/30 to-slate-900",
      buttonColor: "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]",
      desc: "Susun potongan kosakata dan partikel pola kalimat Irodori (A1, A2.1, A2.2) dengan lobi cek kesiapan (Ready), 10 ronde resmi, dan 10 HP damage.",
      features: ["264 Pola Kalimat Otentik", "Lobi Konfirmasi Ready", "10 Ronde Resmi (10 HP/Hit)"],
      tags: ["Solo vs Rival", "Lobi Ready Check", "Refleksi Review"],
      onPlay: () => setSelectedGame("bunpou_puzzle"),
      isComingSoon: false,
    },
    {
      id: "guess_picture",
      title: "Tebak Gambar & Rambu K3",
      jpTitle: "写真・標識クイズ",
      category: "kotoba",
      badge: "BARU • K3 & DOKKAI",
      badgeColor: "bg-emerald-400 text-stone-950",
      icon: "🔍",
      cardBorder: "border-emerald-500/40 hover:border-emerald-400",
      glowBg: "from-emerald-950/40 via-slate-900 to-slate-900",
      buttonColor: "bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400 text-stone-950 shadow-[0_0_20px_rgba(52,211,153,0.4)]",
      desc: "Uji ketajaman membaca rambu keselamatan kerja pabrik (安全第一, 火気厳禁), fasilitas umum darurat (非常口), dan kuliner otentik Irodori A2.2.",
      features: ["Rambu Pabrik & K3 Nyata", "Audio Pelafalan Otentik", "Penjelasan Situasi Kerja"],
      tags: ["Tebak Gambar", "Dokkai & Kanji", "K3 Jepang"],
      onPlay: () => setSelectedGame("guess_picture"),
      isComingSoon: false,
    },
    {
      id: "shinobi_adventure",
      title: "Shinobi Adventure: Irodori Quest",
      jpTitle: "忍の道・総合冒険録",
      category: "bunpou",
      badge: "BARU • STORY MODE",
      badgeColor: "bg-indigo-400 text-stone-950",
      icon: "🗺️",
      cardBorder: "border-indigo-500/40 hover:border-indigo-400",
      glowBg: "from-indigo-950/40 via-purple-950/30 to-slate-900",
      buttonColor: "bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]",
      desc: "Mode petualangan eksplorasi komprehensif mengintegrasikan seluruh elemen Irodori A2.2: Tokyo Dojo, Lini Pabrik Aichi, Izakaya, Stasiun Shinkansen, dan Rumah Sakit.",
      features: ["5 Wilayah Skenario Nyata", "Dialog Interaktif Sensei", "Integrasi Komprehensif A2.2"],
      tags: ["Story Mode", "Kompilasi Seluruh Materi", "HP & Quest Rewards"],
      onPlay: () => setSelectedGame("shinobi_adventure"),
      isComingSoon: false,
    },
    {
      id: "kotoba_blitz",
      title: "Kotoba Blitz 1 vs 1",
      jpTitle: "言葉速撃・真剣勝負",
      category: "kotoba",
      badge: "15 SOAL / MATCH",
      badgeColor: "bg-rose-500 text-white",
      icon: "⚔️",
      cardBorder: "border-rose-500/40 hover:border-rose-400",
      glowBg: "from-rose-950/40 via-slate-900 to-slate-900",
      buttonColor: "bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]",
      desc: "Duel adu kecepatan menjawab 15 soal kosakata, kanji, dan arti bahasa Indonesia ala sistem Kahoot. Jawaban tercepat mendapat bonus poin!",
      features: ["15 Soal Per Pertandingan", "Matchmaking Teman Sekelas", "Sistem Skor Kahoot"],
      tags: ["1 vs 1 Realtime", "15 Soal Cepat", "Kanji & Kotoba"],
      onPlay: () => openMultiplayer("1vs1"),
      isComingSoon: false,
    },
    {
      id: "tournament_cup",
      title: "Otsutsuki Knockout Cup",
      jpTitle: "大筒木杯・天下一武道会",
      category: "multiplayer",
      badge: "PODIUM JUARA 1, 2, 3",
      badgeColor: "bg-yellow-400 text-stone-950",
      icon: "🏆",
      cardBorder: "border-yellow-500/50 hover:border-yellow-400",
      glowBg: "from-yellow-950/40 via-purple-950/30 to-slate-900",
      buttonColor: "bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-stone-950 shadow-[0_0_20px_rgba(250,204,21,0.5)]",
      desc: "Turnamen sistem gugur 8 peserta! Melaju dari 8 Besar, Semifinal, hingga Grand Final dengan hadiah podium Juara 1 (500 XP), Juara 2 (300 XP), dan Juara 3 (150 XP).",
      features: ["Podium Juara 1, 2, 3 Resmi", "Layar Tunggu & Ready Babak", "Badge Juara di Profil User"],
      tags: ["8 Pemain", "Sistem Gugur", "Trofi 1, 2, 3"],
      onPlay: () => openMultiplayer("tournament"),
      isComingSoon: false,
    },
    {
      id: "team_battle",
      title: "Team Squad Battle (2v2)",
      jpTitle: "忍連合・チーム対抗戦",
      category: "multiplayer",
      badge: "CUSTOM NAMA SQUAD",
      badgeColor: "bg-indigo-500 text-white",
      icon: "🛡️",
      cardBorder: "border-indigo-500/40 hover:border-indigo-400",
      glowBg: "from-indigo-950/40 via-slate-900 to-slate-900",
      buttonColor: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]",
      desc: "Pilih kubu Tim Shinobi atau Tim Samurai dan kustomisasi nama skuad Anda. Pilih kategori soal kuis spesifik (Bunpou, Kotoba, Kanji, Choukai) untuk duel 2v2.",
      features: ["Kustomisasi Nama Skuad", "Pilihan Kategori Soal", "Team Combo Multiplier"],
      tags: ["2 vs 2 Tim", "Kustom Nama Tim", "Filter Kategori"],
      onPlay: () => openMultiplayer("group"),
      isComingSoon: false,
    },
    {
      id: "survival_royale",
      title: "Survival Battle Royale",
      jpTitle: "大筒木サバイバル戦",
      category: "multiplayer",
      badge: "FLEKSIBEL 2-6 PEMAIN",
      badgeColor: "bg-orange-500 text-stone-950",
      icon: "👑",
      cardBorder: "border-orange-500/40 hover:border-orange-400",
      glowBg: "from-orange-950/40 via-slate-900 to-slate-900",
      buttonColor: "bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]",
      desc: "Pertarungan fleksibel 2 hingga 6 pemain dengan 3 stage kesulitan bertingkat: Stage 1 Kosakata, Stage 2 Kanji & Makna, Stage 3 Bunpou & Sudden Death!",
      features: ["Fleksibel 2 - 6 Pemain", "Multi-Stage Bertahap (Kotoba-Kanji-Bunpou)", "Sudden Death & Timer Cepat"],
      tags: ["2-6 Pemain", "Multi-Stage", "Gelar Penyintas"],
      onPlay: () => openMultiplayer("all_members"),
      isComingSoon: false,
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

      {/* Mount Game Tebak Gambar Otentik Irodori */}
      {selectedGame === "guess_picture" && (
        <div className="max-w-5xl mx-auto space-y-6">
          <GuessPictureGame onBack={() => setSelectedGame(null)} />
        </div>
      )}

      {/* Mount Game Shinobi Adventure Quest */}
      {selectedGame === "shinobi_adventure" && (
        <div className="max-w-5xl mx-auto space-y-6">
          <ShinobiAdventureGame onBack={() => setSelectedGame(null)} />
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

              <div className="flex items-center gap-1.5 ml-2">
                {/* Tombol Profil & Winrate */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition text-xs font-bold flex flex-col items-center"
                  title="Buka Profil & Statistik Winrate"
                >
                  <UserCheck className="w-4 h-4 text-amber-400 mb-0.5" />
                  <span className="text-[10px]">Profil & WR</span>
                </button>

                {/* Tombol Cek Badge */}
                <button
                  onClick={() => setShowBadgesModal(true)}
                  className="p-2.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-amber-300 transition text-xs font-bold flex flex-col items-center"
                  title="Buka Koleksi Lencana"
                >
                  <Trophy className="w-4 h-4 text-amber-400 mb-0.5" />
                  <span className="text-[10px]">{gamerState.badges.length} Badge</span>
                </button>
              </div>
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

      {/* ==================================================================== */}
      {/* 4. MODAL PROFIL USER & ANALISIS WINRATE / 5 PILAR */}
      {/* ==================================================================== */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative shadow-2xl space-y-6">
            {/* Header Profil */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 p-0.5 shadow-lg flex items-center justify-center text-3xl">
                  🥷
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">Profil Shinobi Tempur</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-400 text-stone-950">
                      {gamerState.rankTitle}
                    </span>
                  </div>
                  <p className="text-xs text-purple-200 mt-0.5 font-medium">
                    {gamerState.rankBadge} • Level {gamerState.level} ({gamerState.xp} XP)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                ✕ Tutup
              </button>
            </div>

            {/* WINRATE & MATCH STATISTICS */}
            {(() => {
              const stats = gamerState.battleStats || {
                totalMatches: 0,
                wins: 0,
                losses: 0,
                winRate: 0,
                podiums: { first: 0, second: 0, third: 0 },
                pillars: { mojiGoi: 70, bunpou: 65, dokkai: 60, choukai: 75, kanji: 55 },
                strengths: ["Kosakata Percakapan (Kaiwa Kotoba)", "Pengenalan Audio Choukai A2"],
                weaknesses: ["Karakter Kanji N4/A2.2", "Pola Kalimat Bertingkat (Bunpou)"],
              };

              return (
                <div className="space-y-6">
                  {/* METRICS CARDS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-[11px] text-slate-400 font-bold uppercase">Total Tanding</div>
                      <div className="text-2xl font-black text-white font-mono mt-0.5">{stats.totalMatches}</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-[11px] text-slate-400 font-bold uppercase">Menang / Kalah</div>
                      <div className="text-2xl font-black text-white font-mono mt-0.5">
                        <span className="text-emerald-400">{stats.wins}W</span> / <span className="text-rose-400">{stats.losses}L</span>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-950 border border-amber-500/40">
                      <div className="text-[11px] text-amber-400 font-bold uppercase">Winrate Rasio</div>
                      <div className="text-2xl font-black text-amber-300 font-mono mt-0.5">{stats.winRate}%</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="text-[11px] text-slate-400 font-bold uppercase">Podium Turnamen</div>
                      <div className="text-lg font-black text-white mt-1 flex items-center justify-center gap-1.5">
                        <span title="Juara 1 Emas">🥇{stats.podiums?.first || 0}</span>
                        <span title="Juara 2 Perak">🥈{stats.podiums?.second || 0}</span>
                        <span title="Juara 3 Perunggu">🥉{stats.podiums?.third || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* 5-PILLAR RADAR BARS (KELEBIHAN & KEKURANGAN) */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-purple-400" />
                        <h4 className="text-xs font-black uppercase text-white tracking-wider">
                          Analisis 5 Pilar Kemampuan Bahasa Jepang
                        </h4>
                      </div>
                      <span className="text-[10px] text-purple-300 font-bold">Evaluasi Otentik A2.2</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: "Moji-Goi (Kosakata Otentik)", key: "mojiGoi", value: stats.pillars?.mojiGoi || 70, icon: "📖" },
                        { label: "Bunpou (Tata Bahasa & Pola)", key: "bunpou", value: stats.pillars?.bunpou || 65, icon: "🧩" },
                        { label: "Dokkai (Rambu K3 & Teks)", key: "dokkai", value: stats.pillars?.dokkai || 60, icon: "🔍" },
                        { label: "Choukai (Percakapan Audio)", key: "choukai", value: stats.pillars?.choukai || 75, icon: "🎧" },
                        { label: "Kanji (Karakter N4 / A2)", key: "kanji", value: stats.pillars?.kanji || 55, icon: "🈸" },
                      ].map((pillar) => (
                        <div key={pillar.key} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-300 flex items-center gap-1.5">
                              <span>{pillar.icon}</span> {pillar.label}
                            </span>
                            <span className={`font-mono font-black ${
                              pillar.value >= 75 ? "text-emerald-400" : pillar.value >= 60 ? "text-amber-400" : "text-rose-400"
                            }`}>
                              {pillar.value}% {pillar.value >= 75 ? "• Sangat Kuat" : pillar.value >= 60 ? "• Cukup" : "• Perlu Latihan"}
                            </span>
                          </div>
                          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${
                                pillar.value >= 75
                                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                                  : pillar.value >= 60
                                  ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                  : "bg-gradient-to-r from-rose-500 to-red-400"
                              }`}
                              style={{ width: `${pillar.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* STRENGTHS & WEAKNESSES ACTIONABLE FEEDBACK */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 uppercase">
                        <CheckCircle2 className="w-4 h-4" /> Kelebihan Utama Anda:
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                        {stats.strengths.map((str, i) => (
                          <li key={i} className="leading-relaxed">{str}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-black text-rose-400 uppercase">
                        <AlertCircle className="w-4 h-4" /> Area Peningkatan / Latihan:
                      </div>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                        {stats.weaknesses.map((w, i) => (
                          <li key={i} className="leading-relaxed">{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
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
