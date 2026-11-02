"use client";

import React, { useState, useEffect } from "react";
import {
  getGamificationState,
  AVAILABLE_BADGES,
  UserGamificationState,
  addXp,
} from "@/lib/gamification";
import soundFX from "@/lib/soundEffects";
import { getDailyQuests, DailyQuest, advanceDailyQuest } from "@/lib/dailyQuests";
import ShinobiGameLeaderboard from "@/components/arena/ShinobiGameLeaderboard";
import BunpouPuzzleBattleArena from "@/components/arena/BunpouPuzzleBattleArena";
import GuessPictureGame from "@/components/arena/GuessPictureGame";
import ShinobiAdventureGame from "@/components/arena/ShinobiAdventureGame";
import ShinobiZepArena from "@/components/arena/ShinobiZepArena";
import ShinobiQuizCreatorStudio, { VillageEnvironment, VILLAGE_ENVIRONMENTS } from "@/components/arena/ShinobiQuizCreatorStudio";
import ShinobiTrainingArena, { TrainingCategory } from "@/components/arena/ShinobiTrainingArena";
import { ParsedQuestion } from "@/lib/quizParsers";
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
  Volume2,
  VolumeX,
  X,
  Scroll,
  BookOpen,
  FileText,
} from "lucide-react";

function getBadgeIcon(badgeId: string) {
  switch (badgeId) {
    case "first_step": return <Sparkles className="w-5 h-5 text-emerald-400" />;
    case "kotoba_master": return <BookOpen className="w-5 h-5 text-blue-400" />;
    case "streak_3": return <Flame className="w-5 h-5 text-orange-400" />;
    case "streak_7": return <Zap className="w-5 h-5 text-amber-400" />;
    case "choukai_sniper": return <Volume2 className="w-5 h-5 text-sky-400" />;
    case "lkpd_hero": return <FileText className="w-5 h-5 text-indigo-400" />;
    case "cbt_champion": return <Trophy className="w-5 h-5 text-yellow-400" />;
    case "tournament_1st": return <Award className="w-5 h-5 text-amber-300" />;
    case "tournament_2nd": return <Award className="w-5 h-5 text-slate-300" />;
    case "tournament_3rd": return <Shield className="w-5 h-5 text-amber-600" />;
    case "puzzle_master": return <Layers className="w-5 h-5 text-purple-400" />;
    case "picture_detective": return <Eye className="w-5 h-5 text-cyan-400" />;
    case "shinobi_explorer": return <Compass className="w-5 h-5 text-teal-400" />;
    default: return <Sparkles className="w-5 h-5 text-amber-400" />;
  }
}

export default function ShinobiArenaPage() {
  const [gamerState, setGamerState] = useState<UserGamificationState | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [dailyQuests, setDailyQuests] = useState<DailyQuest[]>([]);

  // Active game router: null = Game Selection Catalog Hub, 'training_arena' = In-place training
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [trainingCategory, setTrainingCategory] = useState<TrainingCategory>("choukai");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "training" | "bunpou" | "kotoba" | "multiplayer">("all");
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);

  // Multiplayer Modal State
  const [isBattleModalOpen, setIsBattleModalOpen] = useState<boolean>(false);
  const [battleModalMode, setBattleModalMode] = useState<BattleMode>("1vs1");
  const [battleModalCategory, setBattleModalCategory] = useState<any>("all");

  // Shinobi ZEP Quiz & Creator Studio State
  const [showCreatorStudio, setShowCreatorStudio] = useState<boolean>(false);
  const [customZepQuestions, setCustomZepQuestions] = useState<ParsedQuestion[]>([]);
  const [customZepVillage, setCustomZepVillage] = useState<VillageEnvironment>(VILLAGE_ENVIRONMENTS[0]);
  const [customZepRounds, setCustomZepRounds] = useState<number>(10);
  const [customZepHpDamage, setCustomZepHpDamage] = useState<number>(10);
  const [customZepTimeLimit, setCustomZepTimeLimit] = useState<number>(15);

  useEffect(() => {
    setGamerState(getGamificationState());
    setIsMuted(soundFX.getMuted());
    setDailyQuests(getDailyQuests());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<UserGamificationState>;
      if (customEvent.detail) {
        setGamerState(customEvent.detail);
      }
    };

    const handleAudioToggled = (e: Event) => {
      const customEvent = e as CustomEvent<{ isMuted: boolean }>;
      if (customEvent.detail) {
        setIsMuted(customEvent.detail.isMuted);
      }
    };

    const handleQuestsUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<DailyQuest[]>;
      if (customEvent.detail) {
        setDailyQuests(customEvent.detail);
      }
    };

    window.addEventListener("gamification-updated", handleUpdate as EventListener);
    window.addEventListener("shinobi-audio-toggled", handleAudioToggled as EventListener);
    window.addEventListener("daily-quests-updated", handleQuestsUpdated as EventListener);

    return () => {
      window.removeEventListener("gamification-updated", handleUpdate as EventListener);
      window.removeEventListener("shinobi-audio-toggled", handleAudioToggled as EventListener);
      window.removeEventListener("daily-quests-updated", handleQuestsUpdated as EventListener);
    };
  }, []);

  const handleToggleMute = () => {
    const next = soundFX.toggleMute();
    setIsMuted(next);
  };

  const handleClaimQuest = (questId: string, xp: number) => {
    soundFX.playTaiko();
    addXp(xp, `Klaim Misi Harian: ${questId}`);
    setDailyQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, current: q.target, isCompleted: true } : q))
    );
  };

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
  // DEFINISI 4 GERBANG GAME UTAMA (KONSOLIDASI HERO PORTALS)
  // ============================================================================
  const ARCADE_GAMES = [
    {
      id: "shinobi_training_ground",
      title: "Shinobi Training Ground: Dojo 6 Pilar N4 / JFT-A2",
      jpTitle: "忍の修練場：六大部門総合道場",
      category: "training",
      badge: "6 SEKTOR • CHOUKAI S/D DOKKAI",
      badgeColor: "bg-gradient-to-r from-emerald-400 to-teal-400 text-stone-950 font-black",
      icon: "🥋",
      cardBorder: "border-teal-400/80 hover:border-teal-300 shadow-[0_0_30px_rgba(20,184,166,0.35)]",
      glowBg: "from-teal-950/80 via-emerald-950/40 to-slate-900",
      buttonColor: "bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-stone-950 font-black shadow-lg",
      desc: "Dojo latihan mandiri terintegrasi mengasah 6 sektor kompetensi resmi: Choukai (Audio Jepang), Kosakata Kerja 5S, Kanji & Rambu K3, Pola Bunpou, Partikel Drill, dan Dokkai Dokumen Kantor setara N4 & JFT-Basic A2.",
      features: [
        "Audio Percakapan Penutur Asli Berstandar Prometric",
        "Partikel Drill Sniper (に/で/を/が/へ/と)",
        "Dokkai Rambu Darurat & Email Etika Kerja Hou-Ren-So",
      ],
      subChips: [
        { id: "choukai", label: "🎧 Choukai", icon: "🎧" },
        { id: "kotoba", label: "📖 Kotoba 5S", icon: "📖" },
        { id: "kanji_kana", label: "🈳 Kanji & Kana", icon: "🈳" },
        { id: "bunpou", label: "🎋 Bunpou", icon: "🎋" },
        { id: "partikel", label: "⚡ Partikel Drill", icon: "⚡" },
        { id: "dokkai", label: "📜 Dokkai", icon: "📜" },
      ],
      tags: ["Choukai", "Partikel Drill", "Kanji & Dokkai", "N4 / JFT-A2"],
      onPlay: (cat?: TrainingCategory) => {
        setTrainingCategory(cat || "choukai");
        setSelectedGame("training_arena");
      },
      isComingSoon: false,
    },
    {
      id: "bunpou_puzzle",
      title: "Bunpou Sentence Puzzle Battle Arena",
      jpTitle: "文法パズル・修羅の道",
      category: "bunpou",
      badge: "264 POLA KALIMAT • 10 HP / HIT",
      badgeColor: "bg-amber-400 text-stone-950 font-black",
      icon: "🧩",
      cardBorder: "border-amber-500/70 hover:border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]",
      glowBg: "from-amber-950/60 via-purple-950/40 to-slate-900",
      buttonColor: "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 font-black shadow-lg",
      desc: "Susun serpihan kata dan partikel pola tata bahasa Irodori (A1, A2.1, A2.2) dengan lobi cek kesiapan (Ready), 10 ronde resmi, timer berdetak, combo multiplier, dan 10 HP jutsu damage.",
      features: [
        "264 Pola Kalimat Otentik & 1.056 Varian Alami",
        "Lobi Ready Check & Refleksi Pembahasan Shihan",
        "Mode Solo vs AI Sensei Bot atau 1v1 Realtime",
      ],
      tags: ["Solo vs Rival", "Lobi Ready Check", "Refleksi Review", "10 Ronde"],
      onPlay: () => setSelectedGame("bunpou_puzzle"),
      isComingSoon: false,
    },
    {
      id: "shinobi_zep_arena",
      title: "Shinobi ZEP Virtual 2D: Ujian 6 Desa Ninja",
      jpTitle: "忍・ZEPアリーナ：六里の試練",
      category: "multiplayer",
      badge: "ZEP CLONE • 6 DESA NARUTO • AI STUDIO",
      badgeColor: "bg-gradient-to-r from-amber-400 to-rose-500 text-stone-950 font-black",
      icon: "⛩️",
      cardBorder: "border-amber-400 hover:border-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.35)]",
      glowBg: "from-rose-950/60 via-amber-950/40 to-slate-900",
      buttonColor: "bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 text-stone-950 font-black shadow-lg",
      desc: "Mekanisme ZEP Quiz bertema 6 Desa Ninja Naruto! Gerakkan avatar ninja fisik ke Gerbang Desa (A/B/C/D) atau Gerbang O/X sebelum serangan jutsu jatuh. Dilengkapi AI Generator & Impor Word / ZIP.",
      features: [
        "Avatar Gerak Virtual (WASD / D-Pad Cross Mobile)",
        "6 Arena Desa Ninja Naruto (Konoha, Kiri, Kumo, Iwa, Suna, Ame)",
        "AI Quiz Generator & Impor Bank Soal Word / ZIP",
      ],
      tags: ["ZEP Clone", "6 Desa Naruto", "AI Quiz Generator", "D-Pad Cross"],
      onPlay: () => setShowCreatorStudio(true),
      isComingSoon: false,
    },
    {
      id: "multiplayer_colosseum",
      title: "Multiplayer Colosseum: PvP & Knockout Cup",
      jpTitle: "大筒木コロシアム・天下一武道会",
      category: "multiplayer",
      badge: "1V1 • 2V2 SQUAD • ROYALE 2-6",
      badgeColor: "bg-gradient-to-r from-rose-500 to-yellow-400 text-stone-950 font-black",
      icon: "⚔️",
      cardBorder: "border-rose-500/80 hover:border-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.35)]",
      glowBg: "from-rose-950/70 via-purple-950/40 to-slate-900",
      buttonColor: "bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 text-stone-950 font-black shadow-lg",
      desc: "Panggung pertempuran realtime klan Otsutsuki! Bertanding cepat 1v1 (Kotoba Blitz), Perang Skuad 2v2 (Shinobi vs Samurai), Turnamen Knockout Cup 8 peserta berhadiah podium, hingga Survival Royale fleksibel 2-6 pemain.",
      features: [
        "Room Code & Matchmaking Siswa Kelas Otsutsuki",
        "Podium Juara 1, 2, 3 Resmi & Trofi Profil",
        "Sistem Skor Kecepatan Jawab ala Kahoot",
      ],
      tags: ["1v1 Kotoba Blitz", "Knockout Cup", "2v2 Squad", "Survival 2-6"],
      onPlay: () => openMultiplayer("1vs1"),
      isComingSoon: false,
    },
  ];

  // Minigame Klasik Tambahan
  const CLASSIC_MINIGAMES = [
    {
      id: "guess_picture",
      title: "Tebak Gambar & Rambu K3 Jepang",
      jpTitle: "写真・標識クイズ",
      icon: "🔍",
      desc: "Uji ketajaman membaca rambu keselamatan kerja pabrik (安全第一, 火気厳禁, 非常口) dan foto otentik Jepang.",
      onPlay: () => setSelectedGame("guess_picture"),
    },
    {
      id: "shinobi_adventure",
      title: "Shinobi Adventure: Irodori Quest",
      jpTitle: "忍の道・総合冒険録",
      icon: "🗺️",
      desc: "Petualangan RPG cerita eksplorasi komprehensif mengintegrasikan seluruh elemen situasi nyata Irodori A2.2.",
      onPlay: () => setSelectedGame("shinobi_adventure"),
    },
  ];

  const filteredGames = ARCADE_GAMES.filter((g) => {
    if (categoryFilter === "all") return true;
    if (categoryFilter === "training") return g.category === "training";
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
      {/* Mount Game Shinobi Training Arena (6 Sektor N4/JFT A2) */}
      {selectedGame === "training_arena" && (
        <div className="max-w-5xl mx-auto space-y-6">
          <ShinobiTrainingArena
            onBackToHub={() => setSelectedGame(null)}
            initialCategory={trainingCategory}
          />
        </div>
      )}

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

      {/* Mount Game Shinobi ZEP Arena (2D Avatar Canvas) */}
      {selectedGame === "shinobi_zep_arena" && (
        <ShinobiZepArena
          questions={customZepQuestions}
          village={customZepVillage}
          roundsCount={customZepRounds}
          hpDamage={customZepHpDamage}
          timeLimit={customZepTimeLimit}
          onExit={() => setSelectedGame(null)}
        />
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

              <div className="flex flex-wrap items-center gap-1.5 ml-2">
                {/* Tombol Global Sound Mute/Unmute */}
                <button
                  onClick={handleToggleMute}
                  className={`p-2.5 rounded-xl border transition text-xs font-bold flex flex-col items-center cursor-pointer shadow-md ${
                    isMuted
                      ? "bg-rose-950/80 border-rose-500/50 text-rose-300 hover:bg-rose-900"
                      : "bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900"
                  }`}
                  title={isMuted ? "Suara Game Dinonaktifkan (Klik untuk Unmute)" : "Suara Game Aktif (Klik untuk Mute)"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 mb-0.5" /> : <Volume2 className="w-4 h-4 mb-0.5" />}
                  <span className="text-[10px] font-black">{isMuted ? "Muted" : "Sound"}</span>
                </button>

                {/* Tombol Papan Peringkat Game Standalone */}
                <button
                  onClick={() => setShowLeaderboardModal(true)}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:brightness-110 text-stone-950 transition text-xs font-black flex flex-col items-center shadow-lg border border-amber-300 cursor-pointer"
                  title="Buka Papan Peringkat Khusus Game 28 Siswa Klan Otsutsuki"
                >
                  <Crown className="w-4 h-4 fill-stone-950 mb-0.5" />
                  <span className="text-[10px]">Rank Game</span>
                </button>

                {/* Tombol Studio Kuis AI & Word/ZIP */}
                <button
                  onClick={() => setShowCreatorStudio(true)}
                  className="p-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 border border-purple-400/50 text-purple-200 transition text-xs font-black flex flex-col items-center shadow-md cursor-pointer"
                  title="Buka Shinobi Quiz Studio (AI Generator & Impor Word/ZIP)"
                >
                  <Sparkles className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px] whitespace-nowrap">Studio AI</span>
                </button>

                {/* Tombol Profil & Winrate */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition text-xs font-bold flex flex-col items-center cursor-pointer"
                  title="Buka Profil & Statistik Winrate"
                >
                  <UserCheck className="w-4 h-4 text-amber-400 mb-0.5" />
                  <span className="text-[10px]">Profil & WR</span>
                </button>

                {/* Tombol Cek Badge */}
                <button
                  onClick={() => setShowBadgesModal(true)}
                  className="p-2.5 rounded-xl bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-amber-300 transition text-xs font-bold flex flex-col items-center cursor-pointer"
                  title="Buka Koleksi Lencana"
                >
                  <Trophy className="w-4 h-4 text-amber-400 mb-0.5" />
                  <span className="text-[10px]">{gamerState.badges.length} Badge</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================
              WIDGET DAILY QUESTS SHINOBI (MISI HARIAN BERHADIAH)
              ======================================================== */}
          <div className="bg-gradient-to-r from-stone-900/90 via-slate-900/90 to-black rounded-3xl p-5 md:p-6 border border-white/10 shadow-xl backdrop-blur space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-inner">
                  <Scroll className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    Misi Shinobi Harian • 毎日の任務
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                      Reset Setiap Hari
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Selesaikan misi harian untuk menambah Chakra XP dan mengumpulkan Gulungan Ninja.
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono font-bold text-amber-400 self-start sm:self-auto">
                Tuntas: {dailyQuests.filter((q) => q.isCompleted).length} / {dailyQuests.length} Misi
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {dailyQuests.map((quest) => (
                <div
                  key={quest.id}
                  className={`p-3.5 rounded-2xl border transition flex flex-col justify-between ${
                    quest.isCompleted
                      ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                      : "bg-black/40 border-white/10 text-stone-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">{quest.icon}</span>
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        +{quest.rewardXp} XP • 📜 {quest.rewardScrolls}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-tight">
                      {quest.title}
                    </h4>
                    <p className="text-[11px] text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {quest.desc}
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-white/5">
                    <div className="flex items-center justify-between text-[10px] mb-1 font-mono">
                      <span className="text-stone-400">Progres</span>
                      <span className={quest.isCompleted ? "text-emerald-400 font-bold" : "text-stone-300"}>
                        {quest.current}/{quest.target}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-white/10">
                      <div
                        className={`h-full transition-all duration-300 ${
                          quest.isCompleted
                            ? "bg-emerald-400"
                            : "bg-gradient-to-r from-amber-400 to-orange-400"
                        }`}
                        style={{ width: `${Math.min(100, (quest.current / quest.target) * 100)}%` }}
                      />
                    </div>

                    {quest.isCompleted ? (
                      <div className="mt-2 text-center py-1 text-[10px] font-black text-emerald-400 uppercase tracking-wider bg-emerald-500/10 rounded-lg border border-emerald-500/30 flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Misi Tuntas
                      </div>
                    ) : quest.current >= quest.target ? (
                      <button
                        onClick={() => handleClaimQuest(quest.id, quest.rewardXp)}
                        className="mt-2 w-full py-1 text-[10px] font-black text-stone-950 uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 rounded-lg shadow-md cursor-pointer transition"
                      >
                        Klaim Hadiah (+{quest.rewardXp} XP)
                      </button>
                    ) : (
                      <div className="mt-2 text-center py-1 text-[10px] font-semibold text-stone-500">
                        Sedang Berjalan...
                      </div>
                    )}
                  </div>
                </div>
              ))}
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

          {/* SECTION HEADER: 4 GERBANG GAME UTAMA */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider">
                  4 GERBANG UTAMA
                </span>
                <span className="text-xs text-stone-400 font-mono">四代門</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <Gamepad2 className="w-6 h-6 text-amber-400" />
                Pusat Arena Pertandingan &amp; Latihan Terpadu
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Pilih gerbang spesifik: Dojo Latihan 6 Pilar, Bunpou Puzzle, ZEP Virtual 2D, atau Colosseum Realtime.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === "all"
                    ? "bg-amber-400 text-stone-950 shadow font-black"
                    : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                Semua Gerbang
              </button>
              <button
                onClick={() => setCategoryFilter("training")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === "training"
                    ? "bg-teal-500 text-stone-950 shadow font-black ring-2 ring-teal-400"
                    : "bg-teal-950/40 text-teal-300 hover:text-white border border-teal-500/30"
                }`}
              >
                🥋 Dojo Training (N4/JFT-A2)
              </button>
              <button
                onClick={() => setCategoryFilter("bunpou")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === "bunpou"
                    ? "bg-amber-500 text-stone-950 shadow font-black"
                    : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                🧩 Bunpou Puzzle
              </button>
              <button
                onClick={() => setCategoryFilter("multiplayer")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  categoryFilter === "multiplayer"
                    ? "bg-rose-500 text-white shadow font-black"
                    : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
                }`}
              >
                ⚔️ ZEP &amp; Colosseum
              </button>
            </div>
          </div>

          {/* GRID 4 GERBANG GAME UTAMA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className={`bg-gradient-to-b ${game.glowBg} border-2 ${game.cardBorder} rounded-3xl p-6 md:p-7 flex flex-col justify-between transition-all duration-300 shadow-2xl hover:-translate-y-1 relative group overflow-hidden`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl p-3 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">
                      {game.icon}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${game.badgeColor}`}>
                      {game.badge}
                    </span>
                  </div>

                  {/* Title & JP Title */}
                  <h4 className="text-xl md:text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                    {game.title}
                  </h4>
                  <p className="text-xs font-japanese font-bold text-slate-400 mt-1">
                    {game.jpTitle}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-200 font-medium mt-3 leading-relaxed">
                    {game.desc}
                  </p>

                  {/* Sub-Chips Sektor Cepat Khusus Training Ground */}
                  {game.subChips && (
                    <div className="mt-4 pt-3 border-t border-teal-500/20">
                      <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 block mb-2">
                        Pilih Cepat Sektor Latihan:
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {game.subChips.map((chip) => (
                          <button
                            key={chip.id}
                            onClick={() => {
                              setTrainingCategory(chip.id as TrainingCategory);
                              setSelectedGame("training_arena");
                            }}
                            className="p-2 rounded-xl bg-teal-500/10 hover:bg-teal-400 hover:text-stone-950 border border-teal-500/30 text-[11px] font-bold text-teal-200 text-center transition cursor-pointer"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features List */}
                  <div className="my-4 pt-3 border-t border-slate-800/80 space-y-2">
                    {game.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="pt-3">
                  <button
                    disabled={game.isComingSoon}
                    onClick={() => game.onPlay()}
                    className={`w-full py-4 px-5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${game.buttonColor}`}
                  >
                    {game.isComingSoon ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>SEGERA HADIR</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>MASUK KE GERBANG GAME</span>
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION: MINIGAME & PETUALANGAN KLASIK TAMBAHAN */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Koleksi Minigame &amp; Petualangan Klasik
                </h4>
                <p className="text-xs text-stone-400">
                  Game eksplorasi sampingan untuk mengasah memori visual dan membaca kanji rambu darurat.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CLASSIC_MINIGAMES.map((mini) => (
                <div
                  key={mini.id}
                  className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/50 transition flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                      {mini.icon}
                    </span>
                    <div>
                      <h5 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {mini.title}
                      </h5>
                      <p className="text-[10px] font-japanese text-stone-400">
                        {mini.jpTitle}
                      </p>
                      <p className="text-[11px] text-stone-300 mt-1 line-clamp-1">
                        {mini.desc}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={mini.onPlay}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-amber-400 hover:text-stone-950 text-white font-bold text-xs transition shrink-0 cursor-pointer"
                  >
                    Mainkan
                  </button>
                </div>
              ))}
            </div>
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
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 hover:border-amber-400 transition whitespace-nowrap cursor-pointer"
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
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/60 flex items-center justify-center shrink-0">{getBadgeIcon(b.id)}</div>
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

      {/* SHINOBI QUIZ CREATOR STUDIO MODAL (AI GENERATOR & WORD/ZIP IMPORT) */}
      {showCreatorStudio && (
        <ShinobiQuizCreatorStudio
          onStartGame={(questions, village, rounds, damage, time) => {
            setCustomZepQuestions(questions);
            setCustomZepVillage(village);
            setCustomZepRounds(rounds);
            setCustomZepHpDamage(damage);
            setCustomZepTimeLimit(time);
            setShowCreatorStudio(false);
            setSelectedGame("shinobi_zep_arena");
          }}
          onClose={() => setShowCreatorStudio(false)}
        />
      )}

      {/* SHINOBI GAME LEADERBOARD MODAL (STANDALONE 28 SISWA KLAN OTSUTSUKI) */}
      {showLeaderboardModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative max-w-5xl w-full bg-stone-950 border border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            {/* Tombol Tutup Modal */}
            <button
              onClick={() => setShowLeaderboardModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition z-20 cursor-pointer"
              aria-label="Tutup Papan Peringkat"
            >
              <X className="w-5 h-5" />
            </button>

            <ShinobiGameLeaderboard
              currentUserName="Ninja Otsutsuki (Anda)"
              currentUserXp={gamerState.xp}
              onClose={() => setShowLeaderboardModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
