"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Sparkles,
  Flame,
  Award,
  Zap,
  Trophy,
  Play,
  RotateCcw,
  CheckCircle2,
  X,
  Swords,
  Volume2,
  VolumeX,
  Settings,
  Clock,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import {
  getGamificationState,
  addXp,
  setGamificationLevel,
  resetGamificationState,
  UserGamificationState,
  AVAILABLE_BADGES,
  RANKS,
} from "@/lib/gamification";
import { sfx } from "@/lib/soundEffects";

interface KotobaQuestion {
  ja: string;
  romaji?: string;
  id: string; // the correct answer string
  distractors: string[]; // 3 wrong answers
}

// Master pool of Irodori A2.2 Kotoba
const MASTER_KOTOBA: KotobaQuestion[] = [
  { ja: "出身 (しゅっしん)", romaji: "shusshin", id: "Asal daerah / negara", distractors: ["Pekerjaan saat ini", "Hobi santai", "Nama sekolah"] },
  { ja: "専門 (せんもん)", romaji: "senmon", id: "Bidang spesialisasi / keahlian", distractors: ["Asrama tempat tinggal", "Pabrik industri", "Gaji bulanan"] },
  { ja: "安全第一 (あんぜんだいいち)", romaji: "anzen daiichi", id: "Utamakan keselamatan K3", distractors: ["Kerja lembur malam", "Waktu istirahat kerja", "Aturan kebersihan alat"] },
  { ja: "残業 (ざんぎょう)", romaji: "zangyou", id: "Kerja lembur", distractors: ["Shift giliran malam", "Cuti tahunan", "Tepat waktu masuk"] },
  { ja: "避難所 (ひなんじょ)", romaji: "hinanjo", id: "Tempat evakuasi darurat", distractors: ["Halte bus kota", "Pusat rumah sakit", "Kantor polisi sektor"] },
  { ja: "分別 (ぶんべつ)", romaji: "bunbetsu", id: "Pemilahan jenis sampah", distractors: ["Daur ulang limbah", "Penghematan listrik", "Pembakaran sampah"] },
  { ja: "マイバッグ", romaji: "maibaggu", id: "Tas belanja ramah lingkungan", distractors: ["Tas ransel kerja", "Kantong kresek plastik", "Kotak bekal makan"] },
  { ja: "美容院 (びよういん)", romaji: "biyouin", id: "Salon pangkas rambut / tata rias", distractors: ["Rumah sakit umum", "Tempat cuci dry cleaning", "Toko busana"] },
  { ja: "展示室 (てんじしつ)", romaji: "tenjishitsu", id: "Ruang pameran / museum", distractors: ["Ruang meeting kantor", "Perpustakaan umum", "Kantin karyawan"] },
  { ja: "前髪 (まえがみ)", romaji: "maegami", id: "Poni rambut depan", distractors: ["Potong rambut pendek", "Pewarna rambut", "Gaya rambut ikal"] },
  { ja: "特定技能 (とくていぎのう)", romaji: "tokutei ginou", id: "Pekerja Berketerampilan Spesifik (SSW)", distractors: ["Pemagang teknis (Jisshuusei)", "Pelajar mahasiswa asing", "Karyawan tetap lokal"] },
  { ja: "地震 (じしん)", romaji: "jishin", id: "Gempa bumi", distractors: ["Angin topan taifu", "Banjir bandang", "Kebakaran gedung"] },
  { ja: "休館日 (きゅうかんび)", romaji: "kyuukanbi", id: "Hari libur tutup fasilitas", distractors: ["Jam operasional buka", "Biaya tiket masuk", "Jadwal pameran khusus"] },
  { ja: "粗大ゴミ (そだいごみ)", romaji: "sodaigomi", id: "Sampah perabot / ukuran besar", distractors: ["Sampah dapur organik", "Botol plastik PET", "Kaleng aluminium"] },
  { ja: "将来 (しょうらい)", romaji: "shourai", id: "Masa depan / cita-cita", distractors: ["Masa lalu historis", "Pengalaman kerja", "Rencana tahun depan"] },
  { ja: "工場 (こうじょう)", romaji: "koujou", id: "Pabrik tempat produksi", distractors: ["Gudang penyimpanan", "Kantor cabang", "Toko swalayan"] },
  { ja: "締切 (しめきり)", romaji: "shimekiri", id: "Batas waktu / deadline", distractors: ["Awal pembukaan", "Perpanjangan jadwal", "Penundaan proyek"] },
  { ja: "体調 (たいちょう)", romaji: "taichou", id: "Kondisi fisik kesehatan", distractors: ["Suhu ruangan kerja", "Tingkat kebugaran", "Berat badan tubuh"] },
  { ja: "挨拶 (あいさつ)", romaji: "aisatsu", id: "Salam sapaan sopan", distractors: ["Pamitan pulang", "Permohonan maaf", "Ucapan terima kasih"] },
  { ja: "点検 (てんけん)", romaji: "tenken", id: "Pemeriksaan / inspeksi rutin", distractors: ["Perbaikan mesin rusak", "Pembersihan area", "Penggantian suku cadang"] },
];

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; timePerQuestion: number; xpMultiplier: number; badgeColor: string; desc: string }
> = {
  easy: {
    label: "Santai (Kantan)",
    timePerQuestion: 15,
    xpMultiplier: 1,
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    desc: "15 detik/soal • Cocok untuk pemula menghafal",
  },
  medium: {
    label: "Tantangan Ninja (Futsuu)",
    timePerQuestion: 8,
    xpMultiplier: 1.5,
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    desc: "8 detik/soal • Standar refleks JFT-Basic A2",
  },
  hard: {
    label: "Mode Outsutsuki (Muzukashii)",
    timePerQuestion: 4,
    xpMultiplier: 2.5,
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    desc: "4 detik/soal • Refleks kilat tanpa mikir!",
  },
};

interface PreparedQuestion {
  ja: string;
  romaji?: string;
  correctAnswer: string;
  shuffledOptions: string[];
}

export default function GamificationBanner() {
  const [state, setState] = useState<UserGamificationState | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Level Adjust Modal
  const [showLevelModal, setShowLevelModal] = useState(false);

  // Minigame State
  const [showGameModal, setShowGameModal] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameStarted, setGameStarted] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<PreparedQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(8);
  const [gameScore, setGameScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setState(getGamificationState());

    const handleUpdate = (e: any) => {
      setState(e.detail);
    };

    window.addEventListener("gamification-updated", handleUpdate);
    return () => window.removeEventListener("gamification-updated", handleUpdate);
  }, []);

  const toggleSound = () => {
    const next = sfx.toggleMute();
    setIsMuted(next);
  };

  // Helper to build 5 randomized questions with truly shuffled options
  const prepareRandomQuestions = (): PreparedQuestion[] => {
    const shuffledPool = [...MASTER_KOTOBA].sort(() => 0.5 - Math.random()).slice(0, 5);
    return shuffledPool.map((item) => {
      // Pick 3 distractors
      const poolDistractors = [...item.distractors];
      const allOpts = [item.id, ...poolDistractors];
      // Truly shuffle the 4 options so the correct answer lands at A, B, C, or D randomly
      const shuffledOptions = allOpts.sort(() => 0.5 - Math.random());
      return {
        ja: item.ja,
        romaji: item.romaji,
        correctAnswer: item.id,
        shuffledOptions,
      };
    });
  };

  const handleOpenGameModal = () => {
    setGameStarted(false);
    setGameFinished(false);
    setShowGameModal(true);
  };

  const handleStartGame = (diff: Difficulty) => {
    setDifficulty(diff);
    const questions = prepareRandomQuestions();
    setActiveQuestions(questions);
    setQIndex(0);
    setGameScore(0);
    setGameFinished(false);
    setSelectedAns(null);
    setIsCorrect(null);
    setTimeLeft(DIFFICULTY_CONFIG[diff].timePerQuestion);
    setGameStarted(true);
    sfx.playCorrect();
  };

  // Timer loop
  useEffect(() => {
    if (!gameStarted || gameFinished || selectedAns !== null) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired for this question -> Auto Wrong
          handleAnswerTimeout();
          return 0;
        }
        if (prev <= 4) {
          sfx.playCountdownHurry();
        } else {
          sfx.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameFinished, qIndex, selectedAns]);

  const handleAnswerTimeout = () => {
    if (selectedAns !== null) return;
    setSelectedAns("__TIMEOUT__");
    setIsCorrect(false);
    sfx.playWrong();

    setTimeout(() => {
      advanceNextQuestion(false);
    }, 1200);
  };

  const handleAnswer = (chosen: string) => {
    if (selectedAns !== null) return;
    setSelectedAns(chosen);

    const currentQ = activeQuestions[qIndex];
    const correct = chosen === currentQ.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      sfx.playCorrect();
      setGameScore((prev) => prev + 1);
    } else {
      sfx.playWrong();
    }

    setTimeout(() => {
      advanceNextQuestion(correct);
    }, 900);
  };

  const advanceNextQuestion = (lastWasCorrect: boolean) => {
    if (qIndex + 1 < activeQuestions.length) {
      setQIndex((prev) => prev + 1);
      setSelectedAns(null);
      setIsCorrect(null);
      setTimeLeft(DIFFICULTY_CONFIG[difficulty].timePerQuestion);
    } else {
      setGameFinished(true);
      sfx.playVictory();

      // Calculate total earned XP with difficulty multiplier
      const finalScore = gameScore + (lastWasCorrect ? 1 : 0);
      const earnedXp = Math.round(finalScore * 15 * DIFFICULTY_CONFIG[difficulty].xpMultiplier);
      if (earnedXp > 0) {
        addXp(earnedXp, `Kotoba Reflex Game (${difficulty})`);
      }
    }
  };

  const handleSelectLevel = (lvl: number) => {
    const updated = setGamificationLevel(lvl);
    setState(updated);
    sfx.playLevelUp();
    setShowLevelModal(false);
  };

  const handleResetProgress = () => {
    if (confirm("Reset ulang level ke Level 1 (Murid Akademi)?")) {
      const updated = resetGamificationState();
      setState(updated);
      setShowLevelModal(false);
    }
  };

  if (!state) return null;

  const currentQ = activeQuestions[qIndex];
  const maxTime = DIFFICULTY_CONFIG[difficulty].timePerQuestion;
  const timePercent = Math.max(0, Math.min(100, (timeLeft / maxTime) * 100));

  return (
    <>
      <div className="clay-card rounded-3xl p-5 sm:p-6 border border-amber-500/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        {/* Glow Background */}
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT: RANK & LEVEL INFO */}
        <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
          <button
            onClick={() => setShowLevelModal(true)}
            title="Klik untuk sesuaikan level ninja Anda!"
            className="group relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex flex-col items-center justify-center shadow-lg border-2 border-amber-300 shrink-0 hover:scale-105 transition"
          >
            <span className="text-[10px] font-black uppercase tracking-tighter leading-none opacity-80">LEVEL</span>
            <span className="text-xl font-black leading-none mt-0.5">{state.level}</span>
            <span className="absolute -bottom-1 -right-1 bg-black text-amber-400 p-0.5 rounded-full text-[9px] opacity-0 group-hover:opacity-100 transition shadow">
              <Settings className="w-3 h-3" />
            </span>
          </button>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-400/30 px-2.5 py-0.5 rounded-lg">
                {state.rankBadge}
              </span>
              <span className="text-xs font-black text-rose-500 dark:text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                <Flame className="w-3.5 h-3.5 fill-current animate-bounce" /> {state.dailyStreak} Hari Streak
              </span>
              <button
                onClick={() => setShowLevelModal(true)}
                className="text-[10px] font-bold text-amber-500 underline hover:text-amber-400 ml-1"
              >
                Ubah Level
              </button>
            </div>
            <h3 className="text-base sm:text-lg font-black mt-1">
              {state.rankTitle}
            </h3>

            {/* XP PROGRESS BAR */}
            <div className="w-full sm:w-64 mt-2">
              <div className="flex justify-between text-[10px] font-bold opacity-75 mb-1">
                <span>{state.xp} XP</span>
                <span>Target: {state.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden p-0.5 border border-current/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
                  style={{ width: `${state.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: SOUND TOGGLE, BADGES & MINI-GAME TRIGGER */}
        <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto justify-between sm:justify-end">
          {/* SOUND FX TOGGLE BUTTON */}
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-xl border transition flex items-center gap-1 text-xs font-bold ${
              isMuted
                ? "bg-stone-500/10 border-stone-500/30 text-stone-400"
                : "bg-amber-500/10 border-amber-500/30 text-amber-500"
            }`}
            title={isMuted ? "Suara Efek: Mati (Klik untuk Nyalakan)" : "Suara Efek: Aktif (Klik untuk Mute)"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>

          {/* BADGES PREVIEW */}
          <div className="flex items-center -space-x-1.5" title="Badge yang sudah kamu buka!">
            {state.badges.map((bId) => {
              const b = AVAILABLE_BADGES.find((x) => x.id === bId);
              if (!b) return null;
              return (
                <span
                  key={bId}
                  className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-sm shadow cursor-pointer hover:scale-125 transition"
                  title={`${b.name} (${b.desc})`}
                >
                  {b.icon}
                </span>
              );
            })}
          </div>

          <button
            onClick={handleOpenGameModal}
            className="clay-btn-gold px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:scale-105 transition"
          >
            <Swords className="w-4 h-4" />
            Kotoba Reflex Game
          </button>
        </div>
      </div>

      {/* MODAL 1: SESUAIKAN LEVEL GAMIFIKASI */}
      {showLevelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="clay-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-amber-400/40 relative shadow-2xl flex flex-col gap-5 animate-in zoom-in-95">
            <button
              onClick={() => setShowLevelModal(false)}
              className="absolute right-5 top-5 p-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:opacity-100 opacity-60 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-current/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black">Sesuaikan Level Ninja Kamu</h3>
                <p className="text-xs opacity-70">
                  Pilih peringkat Anda secara bebas untuk pengujian atau lompat tingkat:
                </p>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {RANKS.map((r) => {
                const isCurrent = state.level === r.level;
                return (
                  <button
                    key={r.level}
                    onClick={() => handleSelectLevel(r.level)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition ${
                      isCurrent
                        ? "bg-amber-500 text-stone-950 border-amber-300 font-black shadow-lg"
                        : "bg-black/5 dark:bg-black/20 border-current/10 hover:border-amber-400/50 hover:bg-amber-500/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${
                          isCurrent ? "bg-stone-950 text-amber-400" : "bg-amber-500/20 text-amber-500"
                        }`}
                      >
                        Lv.{r.level}
                      </div>
                      <div>
                        <div className="text-xs font-black">{r.title}</div>
                        <div className={`text-[10px] ${isCurrent ? "text-stone-800" : "opacity-60"}`}>
                          {r.badge} • Min. {r.minXp} XP
                        </div>
                      </div>
                    </div>
                    {isCurrent && <CheckCircle2 className="w-5 h-5 text-stone-950" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-current/10 flex items-center justify-between">
              <button
                onClick={handleResetProgress}
                className="text-xs text-rose-500 hover:text-rose-400 font-bold flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset ke Level 1
              </button>
              <button
                onClick={() => setShowLevelModal(false)}
                className="clay-btn px-5 py-2 rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MINIGAME KOTOBA REFLEX */}
      {showGameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="clay-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-amber-400/40 relative shadow-2xl flex flex-col gap-6 animate-in zoom-in-95">
            <button
              onClick={() => {
                setShowGameModal(false);
                setGameStarted(false);
              }}
              className="absolute right-5 top-5 p-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:opacity-100 opacity-60 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* STEP 1: PILIH TINGKAT KESULITAN SEBELUM MAIN */}
            {!gameStarted && (
              <div className="flex flex-col gap-5 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-2xl shadow-inner">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-xl font-black">Kotoba Speed Reflex</h3>
                    <p className="text-xs opacity-75">
                      Pilih tingkat kesulitan untuk menyesuaikan batas waktu per soal:
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((dKey) => {
                    const cfg = DIFFICULTY_CONFIG[dKey];
                    return (
                      <button
                        key={dKey}
                        onClick={() => handleStartGame(dKey)}
                        className="p-4 rounded-2xl border border-current/10 bg-black/5 dark:bg-black/30 hover:border-amber-400/50 hover:scale-[1.02] transition text-left flex items-center justify-between group"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${cfg.badgeColor}`}>
                              {cfg.timePerQuestion} Detik / Soal
                            </span>
                            <span className="text-[10px] font-bold text-amber-500">
                              {cfg.xpMultiplier}x XP
                            </span>
                          </div>
                          <h4 className="font-black text-sm mt-1">{cfg.label}</h4>
                          <p className="text-xs opacity-60 mt-0.5">{cfg.desc}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition text-amber-400" />
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-xs text-amber-500">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>
                    Dilengkapi efek audio nyata (Correct Ding, Wrong Buzz, & Tick Countdown) serta pengacakan posisi opsi (A/B/C/D seimbang).
                  </span>
                </div>
              </div>
            )}

            {/* STEP 2: GAMEPLAY SEDANG BERLANGSUNG */}
            {gameStarted && !gameFinished && currentQ && (
              <>
                <div className="flex items-center justify-between border-b border-current/10 pb-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-500">
                    <Zap className="w-4 h-4 fill-current" /> Soal {qIndex + 1}/{activeQuestions.length}
                    <span className="text-[10px] opacity-70 ml-1">({DIFFICULTY_CONFIG[difficulty].label})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black font-mono">Skor: {gameScore}</span>
                    <button
                      onClick={toggleSound}
                      className="p-1 rounded-lg opacity-70 hover:opacity-100"
                      title="Mute / Unmute"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                    </button>
                  </div>
                </div>

                {/* COUNTDOWN TIMER BAR */}
                <div className="w-full">
                  <div className="flex justify-between items-center text-xs font-black font-mono mb-1">
                    <span className="flex items-center gap-1 text-stone-400">
                      <Clock className="w-3.5 h-3.5" /> Sisa Waktu
                    </span>
                    <span className={timeLeft <= 3 ? "text-rose-500 animate-ping font-black" : "text-amber-400"}>
                      {timeLeft}s
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden border border-current/10">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        timeLeft <= 3 ? "bg-rose-500" : "bg-gradient-to-r from-amber-400 to-amber-600"
                      }`}
                      style={{ width: `${timePercent}%` }}
                    />
                  </div>
                </div>

                {/* QUESTION CARD */}
                <div className="text-center py-5 bg-black/5 dark:bg-black/30 rounded-2xl border border-current/10">
                  <span className="text-xs font-bold opacity-60 block uppercase tracking-wider">
                    Pilih Makna Kosakata yang Tepat:
                  </span>
                  <h4 className="text-2xl sm:text-3xl font-black mt-2 text-amber-500">
                    {currentQ.ja}
                  </h4>
                  {currentQ.romaji && (
                    <span className="text-xs opacity-60 font-mono mt-1 block">
                      [{currentQ.romaji}]
                    </span>
                  )}
                </div>

                {/* RANDOMIZED OPTIONS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentQ.shuffledOptions.map((opt, idx) => {
                    let btnClass = "clay-btn p-3.5 rounded-xl text-xs font-bold text-left transition relative";
                    if (selectedAns) {
                      if (opt === currentQ.correctAnswer) {
                        btnClass = "bg-emerald-600 text-white p-3.5 rounded-xl text-xs font-bold text-left shadow-lg scale-[1.02] border-2 border-emerald-300";
                      } else if (opt === selectedAns) {
                        btnClass = "bg-rose-600 text-white p-3.5 rounded-xl text-xs font-bold text-left border-2 border-rose-300";
                      } else {
                        btnClass = "opacity-40 clay-btn p-3.5 rounded-xl text-xs font-bold text-left";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={selectedAns !== null}
                        onClick={() => handleAnswer(opt)}
                        className={btnClass}
                      >
                        <span className="font-mono text-amber-400 mr-2 font-black">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {selectedAns === "__TIMEOUT__" && (
                  <div className="text-center text-xs font-black text-rose-500 animate-bounce">
                    ⚠️ Waktu Habis! Soal berikutnya...
                  </div>
                )}
              </>
            )}

            {/* STEP 3: HASIL AKHIR */}
            {gameStarted && gameFinished && (
              <div className="text-center py-6 flex flex-col items-center gap-4 animate-in zoom-in-95">
                <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-400/50 flex items-center justify-center text-4xl shadow-inner">
                  🏆
                </div>
                <div>
                  <h3 className="text-2xl font-black">Latihan Refleks Selesai!</h3>
                  <p className="text-xs opacity-80 mt-1">
                    Kamu berhasil menjawab <strong className="text-amber-400">{gameScore}</strong> dari {activeQuestions.length} soal dengan benar!
                  </p>
                  <div className="inline-block mt-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-black uppercase tracking-wider">
                    +{Math.round(gameScore * 15 * DIFFICULTY_CONFIG[difficulty].xpMultiplier)} XP Ditambahkan ke Akun!
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => handleStartGame(difficulty)}
                    className="clay-btn px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" /> Main Lagi
                  </button>
                  <button
                    onClick={() => {
                      setShowGameModal(false);
                      setGameStarted(false);
                    }}
                    className="clay-btn-gold px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
                  >
                    Tutup & Simpan
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
