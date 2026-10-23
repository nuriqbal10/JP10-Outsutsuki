"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Swords,
  Shield,
  Zap,
  Flame,
  Trophy,
  RotateCcw,
  Volume2,
  Heart,
  Skull,
  Sparkles,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Shuffle,
  VolumeX,
  Play,
  Award,
  BookOpen,
  Users,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  Radio,
  UserCheck,
  Loader2,
  HelpCircle,
} from "lucide-react";
import rawBunpouData from "@/data/bunpouData.json";
import { BunpouItem } from "@/types/bunpou";
import { sfx } from "@/lib/soundEffects";
import { addXp, getGamificationState } from "@/lib/gamification";
import { advanceDailyQuest } from "@/lib/dailyQuests";
import {
  cleanJapaneseText,
  generateBunpouPuzzleQuestions,
  BattleQuestion,
  VocabLevel,
} from "@/data/battleQuestionBank";

export interface ClassRival {
  nim: string;
  name: string;
  avatar: string;
  rank: string;
  specialJutsu: string;
}

export const CLASS_RIVALS: ClassRival[] = [
  { nim: "JP10-1804249", name: "ADIQRI IRHAN WIJAYA", avatar: "⚡", rank: "Chunin Tangkas", specialJutsu: "Raikiri Bunpou" },
  { nim: "JP10-1803765", name: "AFIKA SAZWANI", avatar: "🌸", rank: "Kunoichi Anggun", specialJutsu: "Sakura Fubuki" },
  { nim: "JP10-1804237", name: "AHMAD PEBRIANTO", avatar: "🔥", rank: "Jonin Berapi", specialJutsu: "Karyuu Endan" },
  { nim: "JP10-1804041", name: "ALDA PUTRI MAYANI", avatar: "✨", rank: "Chunin Teliti", specialJutsu: "Hikari no Yaiba" },
  { nim: "JP10-1803838", name: "ALYA RATU JUNISA", avatar: "👑", rank: "Jonin Berbakat", specialJutsu: "Joou no Mai" },
  { nim: "JP10-1803800", name: "ANGGI JULIANA", avatar: "🍃", rank: "Jonin Angin", specialJutsu: "Kamaitachi" },
  { nim: "JP10-1803445", name: "AZMI SYAUQI RAMADHAN", avatar: "🌙", rank: "Genin Cendekia", specialJutsu: "Tsukuyomi Ha" },
  { nim: "JP10-1804031", name: "EGA ALAMSYAH", avatar: "🌪️", rank: "Chunin Gesit", specialJutsu: "Rasengan Bunpou" },
  { nim: "JP10-1803811", name: "EKA RADITYA PRINGGO DHANI", avatar: "🛡️", rank: "Kenshi Tangguh", specialJutsu: "Tekkabe no Jutsu" },
  { nim: "JP10-1803780", name: "FIRLY VELISTA", avatar: "💫", rank: "Chunin Kilat", specialJutsu: "Hiraishin Giri" },
  { nim: "JP10-1803739", name: "IMAS SITI MARIAM", avatar: "🌊", rank: "Kunoichi Samudera", specialJutsu: "Suiryuudan" },
  { nim: "JP10-1804210", name: "M RAKA RAMADANI", avatar: "🐺", rank: "Chunin Serigala", specialJutsu: "Gajuu Senkou" },
  { nim: "JP10-1803820", name: "MUHAMMAD RAIHAAN RASENDRIYA", avatar: "🦅", rank: "Jonin Elang", specialJutsu: "Oowashi Tsume" },
  { nim: "JP10-1803459", name: "MUHAMMAD RIDWAN", avatar: "🎯", rank: "Kenshi Akurat", specialJutsu: "Ichigeki Hissatsu" },
  { nim: "JP10-1803349", name: "MUHAMMAD RIDWAN NURPADILAH", avatar: "🗡️", rank: "Chunin Pedang", specialJutsu: "Zankenshou" },
  { nim: "JP10-1803598", name: "NABIL NUR ILHAM", avatar: "🔮", rank: "Genin Visioner", specialJutsu: "Shinrin Meikyuu" },
  { nim: "JP10-1804183", name: "SIFA RAHMAWATI", avatar: "🌟", rank: "Kunoichi Bintang", specialJutsu: "Hoshikuzu no Jin" },
  { nim: "JP10-1804217", name: "SISKA MAELANI", avatar: "❄️", rank: "Kunoichi Es", specialJutsu: "Hyouketsu Ha" },
  { nim: "JP10-1803898", name: "SITI NURSYIFA", avatar: "💠", rank: "Chunin Kristal", specialJutsu: "Shouton Shuriken" },
  { nim: "JP10-1803803", name: "SITI RUBIATUL AWALIYAH", avatar: "🌺", rank: "Kunoichi Teratai", specialJutsu: "Renge Senpuu" },
  { nim: "JP10-1803483", name: "SOLAHUDIN", avatar: "⛰️", rank: "Batu Karang", specialJutsu: "Doryuuheki" },
  { nim: "JP10-1804233", name: "SUSI APRIANTI", avatar: "🦋", rank: "Kunoichi Kupu-Kupu", specialJutsu: "Chou no Mai" },
  { nim: "JP10-1804051", name: "TALENTA NABIL HIDAYATULLOH", avatar: "🐉", rank: "Naga Langit", specialJutsu: "Ryuusei Ken" },
  { nim: "JP10-1803951", name: "TALITA ARDELIA LUBIS", avatar: "🏹", rank: "Pemanah Senja", specialJutsu: "Hamaya Shinobi" },
  { nim: "JP10-1803682", name: "WINDA WIDYAWATI", avatar: "🕊️", rank: "Merpati Putih", specialJutsu: "Tsubasa no Kaze" },
  { nim: "JP10-1804012", name: "WISNU AIRLANGGA NATAKOESUMAH", avatar: "⚔️", rank: "Pendekar Garudeya", specialJutsu: "Garuda Senkou" },
  { nim: "JP10-1803986", name: "YUGIA MUHAMAD HANIP", avatar: "🔥", rank: "Api Abadi", specialJutsu: "Goukakyuu no Jutsu" },
  { nim: "JP10-1804232", name: "YULI YULIANTI", avatar: "🌈", rank: "Pelangi Fajar", specialJutsu: "Niji no Kekkai" },
  { nim: "JP10-1803762", name: "ZAHRA PUTRI PADILAH", avatar: "💎", rank: "Permata Suci", specialJutsu: "Kongouseki Shuriken" },
];

const JAPANESE_PARTICLES = new Set([
  "は", "が", "を", "に", "へ", "で", "と", "から", "まで", "より", "も", "か", "ね", "よ", "の"
]);

export interface MatchReflectionItem {
  round: number;
  question: BattleQuestion;
  userAssembled: string[];
  isCorrect: boolean;
  timeSpentSeconds: number;
  errorReason?: string;
}

export interface BunpouPuzzleBattleArenaProps {
  onBackToHub?: () => void;
  onOpenMultiplayerModal?: () => void;
}

export default function BunpouPuzzleBattleArena({
  onBackToHub,
  onOpenMultiplayerModal,
}: BunpouPuzzleBattleArenaProps) {
  // Arena Top Tabs: 'solo_dojo' | 'multiplayer_realtime'
  const [arenaMode, setArenaMode] = useState<"solo_dojo" | "multiplayer_realtime">("solo_dojo");

  // Game Flow States: 'lobby' | 'battle' | 'victory' | 'defeat'
  const [gameState, setGameState] = useState<"lobby" | "battle" | "victory" | "defeat">("lobby");

  // Filter & Difficulty Settings
  const [selectedLevel, setSelectedLevel] = useState<"all" | "A1" | "A2.1" | "A2.2">("all");
  const [selectedLesson, setSelectedLesson] = useState<number>(0); // 0 = all
  const [selectedRivalIndex, setSelectedRivalIndex] = useState<number>(-1); // -1 = random
  const [roundLimit, setRoundLimit] = useState<number>(5);

  // Active Combat State (Strict 30s per round)
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [rivalHp, setRivalHp] = useState<number>(100);
  const [combo, setCombo] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30); // 30s exact requirement
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAttacking, setIsAttacking] = useState<boolean>(false);
  const [isHit, setIsHit] = useState<boolean>(false);
  const [actionFx, setActionFx] = useState<string | null>(null);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);

  // Questions & Token Pools
  const [matchQuestions, setMatchQuestions] = useState<BattleQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [placedTokens, setPlacedTokens] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [activeRival, setActiveRival] = useState<ClassRival>(CLASS_RIVALS[0]);

  // Post-Match Reflection Record
  const [reflectionList, setReflectionList] = useState<MatchReflectionItem[]>([]);
  const [expandedReflectionIdx, setExpandedReflectionIdx] = useState<number | null>(null);

  // Real-Time Multiplayer Room State
  const [multiplayerRoomCode, setMultiplayerRoomCode] = useState<string>("JP10");
  const [myPlayerName, setMyPlayerName] = useState<string>("Shinobi Outsutsuki");
  const [myAvatar, setMyAvatar] = useState<string>("🥷");
  const [isRoomHost, setIsRoomHost] = useState<boolean>(false);
  const [roomParticipants, setRoomParticipants] = useState<any[]>([]);
  const [isMultiplayerWaiting, setIsMultiplayerWaiting] = useState<boolean>(false);
  const [multiplayerStatusMsg, setMultiplayerStatusMsg] = useState<string>("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const roundStartTimeRef = useRef<number>(Date.now());

  // Pronounce Japanese Sentence via Web Speech Synthesis
  const speakJapanese = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  // Trigger Anime Action FX
  const triggerActionFx = (text: string) => {
    setActionFx(text);
    setTimeout(() => setActionFx(null), 1200);
  };

  // Start Solo Challenge (Progressive Difficulty: Easy -> Hard, No Duplicates)
  const handleStartSoloBattle = () => {
    // Generate questions with progressive difficulty: Easy -> Hard, zero duplicates
    const questions = generateBunpouPuzzleQuestions({
      level: selectedLevel,
      chapter: selectedLesson,
      count: roundLimit,
    });

    if (questions.length === 0) {
      alert("Tidak ada pola kalimat untuk filter ini! Silakan ganti level atau bab.");
      return;
    }

    // Pick rival
    let rival: ClassRival;
    if (selectedRivalIndex >= 0 && selectedRivalIndex < CLASS_RIVALS.length) {
      rival = CLASS_RIVALS[selectedRivalIndex];
    } else {
      rival = CLASS_RIVALS[Math.floor(Math.random() * CLASS_RIVALS.length)];
    }
    setActiveRival(rival);

    setMatchQuestions(questions);
    setCurrentQIndex(0);
    setCurrentRound(1);
    setPlayerHp(100);
    setRivalHp(100);
    setCombo(0);
    setHighestCombo(0);
    setScore(0);
    setReflectionList([]);

    setupQuestion(questions[0]);

    setBattleLogs([
      `⚔️ DUEL DIMULAI melawan ${rival.name} (${rival.nim})!`,
      `⏱️ Waktu: 30 Detik per Soal. Susun kata dan partikel secara presisi!`,
      `📈 Tingkat kesulitan meningkat secara bertahap dari mudah hingga menantang!`,
    ]);

    setGameState("battle");
    sfx.playSlash();
    triggerActionFx("始め! HAJIME!");
  };

  const setupQuestion = (q: BattleQuestion) => {
    const tokens = q.puzzleTokens || [];
    // Shuffle tokens thoroughly
    const shuffled = [...tokens];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setAvailableTokens(shuffled);
    setPlacedTokens([]);
    setFeedback("idle");
    setTimeLeft(30); // Exactly 30 seconds requirement
    roundStartTimeRef.current = Date.now();
  };

  // 30s Countdown Timer Hook
  useEffect(() => {
    if (gameState !== "battle") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 30;
        }
        if (prev <= 5 && !isMuted) {
          sfx.playCountdownHurry();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentQIndex, matchQuestions, placedTokens, playerHp, rivalHp, combo]);

  // Handle Timeout (Rival Attacks)
  const handleTimeout = () => {
    sfx.playWrong();
    setIsHit(true);
    setTimeout(() => setIsHit(false), 700);

    const currentQ = matchQuestions[currentQIndex];
    const timeSpent = 30;

    // Record reflection
    if (currentQ) {
      setReflectionList((prev) => [
        ...prev,
        {
          round: currentRound,
          question: currentQ,
          userAssembled: placedTokens,
          isCorrect: false,
          timeSpentSeconds: timeSpent,
          errorReason: "Waktu 30 detik habis sebelum susunan kalimat sempat diserahkan.",
        },
      ]);
    }

    const dmg = 25;
    const newPlayerHp = Math.max(0, playerHp - dmg);
    setPlayerHp(newPlayerHp);
    setCombo(0);
    triggerActionFx("⏰ WAKTU HABIS!");

    setBattleLogs((prev) => [
      `⏰ Waktu habis! ${activeRival.name} melancarkan ${activeRival.specialJutsu} (-${dmg} HP)!`,
      ...prev.slice(0, 5),
    ]);

    if (newPlayerHp <= 0) {
      setTimeout(() => {
        sfx.playEliminated();
        setGameState("defeat");
      }, 800);
    } else {
      nextTurn();
    }
  };

  // Move token from pool to placed zone
  const handlePickToken = (token: string, index: number) => {
    if (feedback !== "idle") return;
    sfx.playTick();
    setAvailableTokens((prev) => prev.filter((_, i) => i !== index));
    setPlacedTokens((prev) => [...prev, token]);
  };

  // Move token from placed zone back to pool
  const handleRemoveToken = (token: string, index: number) => {
    if (feedback !== "idle") return;
    sfx.playTick();
    setPlacedTokens((prev) => prev.filter((_, i) => i !== index));
    setAvailableTokens((prev) => [...prev, token]);
  };

  // Reset tokens for current question
  const handleResetTokens = () => {
    if (feedback !== "idle") return;
    const currentQ = matchQuestions[currentQIndex];
    if (currentQ) setupQuestion(currentQ);
  };

  // Submit and Validate Sentence (Zero false negatives with thorough punctuation stripping)
  const handleSubmitSentence = () => {
    if (placedTokens.length === 0 || feedback !== "idle") return;
    const currentQ = matchQuestions[currentQIndex];
    if (!currentQ || !currentQ.puzzleSentence) return;

    const userClean = cleanJapaneseText(placedTokens.join(""));
    const correctClean = cleanJapaneseText(currentQ.puzzleSentence || "");
    const acceptable = (currentQ.acceptableSentences || [currentQ.puzzleSentence || ""]).map(cleanJapaneseText);

    const isMatch = acceptable.includes(userClean);
    const timeSpent = Math.max(1, 30 - timeLeft);

    if (isMatch) {
      // SUCCESSFUL ATTACK!
      setFeedback("correct");
      sfx.playCorrect();
      setIsAttacking(true);
      setTimeout(() => setIsAttacking(false), 700);

      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (nextCombo > highestCombo) setHighestCombo(nextCombo);

      // Damage: 30 base + combo bonus
      const dmg = Math.min(50, 30 + nextCombo * 5);
      const newRivalHp = Math.max(0, rivalHp - dmg);
      setRivalHp(newRivalHp);

      const addedScore = 600 + timeLeft * 25 + nextCombo * 100;
      setScore((s) => s + addedScore);

      triggerActionFx(nextCombo > 1 ? `🔥 ${nextCombo}x JUTSU COMBO!` : "💥 SERANGAN TEPAT!");

      setBattleLogs((prev) => [
        `💥 JUTSU BERHASIL! [${currentQ.pattern}] menghantam ${activeRival.name} (-${dmg} HP)!`,
        ...prev.slice(0, 5),
      ]);

      // Record to reflection list
      setReflectionList((prev) => [
        ...prev,
        {
          round: currentRound,
          question: currentQ,
          userAssembled: placedTokens,
          isCorrect: true,
          timeSpentSeconds: timeSpent,
        },
      ]);

      speakJapanese(currentQ.puzzleSentence);

      if (newRivalHp <= 0) {
        setTimeout(() => handleVictory(), 1200);
      } else {
        setTimeout(() => nextTurn(), 1400);
      }
    } else {
      // WRONG ASSEMBLY!
      setFeedback("wrong");
      sfx.playWrong();
      setIsHit(true);
      setTimeout(() => setIsHit(false), 700);

      setCombo(0);
      const dmg = 20;
      const newPlayerHp = Math.max(0, playerHp - dmg);
      setPlayerHp(newPlayerHp);

      triggerActionFx("🛡️ TANGKISAN RIVAL!");

      // Analyze specific error reason
      let errorReason = "Urutan kosakata atau partikel belum sesuai kaidah tata bahasa.";
      if (placedTokens.length !== (currentQ.puzzleTokens?.length || 0)) {
        errorReason = `Jumlah token belum lengkap (${placedTokens.length} dari ${currentQ.puzzleTokens?.length || 0} kata).`;
      } else {
        const lastPlaced = placedTokens[placedTokens.length - 1];
        const lastExpected = currentQ.puzzleTokens?.[currentQ.puzzleTokens.length - 1];
        if (lastPlaced !== lastExpected) {
          errorReason = `Predikat / kata kerja utama (${lastExpected}) harus diletakkan di akhir kalimat.`;
        } else {
          errorReason = `Posisi partikel penanda (seperti は, を, に, で, と) belum menempel tepat pada kata benda yang sesuai.`;
        }
      }

      setBattleLogs((prev) => [
        `❌ Susunan kata belum tepat! ${activeRival.name} melancarkan serangan balik (-${dmg} HP)!`,
        ...prev.slice(0, 5),
      ]);

      // Record to reflection list
      setReflectionList((prev) => [
        ...prev,
        {
          round: currentRound,
          question: currentQ,
          userAssembled: placedTokens,
          isCorrect: false,
          timeSpentSeconds: timeSpent,
          errorReason,
        },
      ]);

      if (newPlayerHp <= 0) {
        setTimeout(() => {
          sfx.playEliminated();
          setGameState("defeat");
        }, 1200);
      } else {
        setTimeout(() => {
          setFeedback("idle");
          handleResetTokens();
        }, 1600);
      }
    }
  };

  // Next Round / Turn
  const nextTurn = () => {
    setFeedback("idle");
    const nextIdx = currentQIndex + 1;
    if (nextIdx >= matchQuestions.length) {
      if (rivalHp <= playerHp) {
        handleVictory();
      } else {
        setGameState("defeat");
      }
      return;
    }

    setCurrentQIndex(nextIdx);
    setCurrentRound(nextIdx + 1);
    setupQuestion(matchQuestions[nextIdx]);
  };

  // Victory
  const handleVictory = () => {
    sfx.playVictory();
    const xpReward = 180 + highestCombo * 25;
    addXp(xpReward, "Kemenangan Bunpou Puzzle Shinobi Arena!");
    advanceDailyQuest("battle");
    setGameState("victory");
  };

  const currentQ = matchQuestions[currentQIndex];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none font-sans">
      {/* ==================================================================== */}
      {/* ARENA HEADER & MODE SELECTOR */}
      {/* ==================================================================== */}
      <div className="bg-gradient-to-r from-[#140726] via-[#1e0d38] to-[#120622] border-2 border-purple-500/50 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden arena-dark-surface">
        {/* Glowing Ambient Aura */}
        <div className="absolute -top-24 -left-24 w-52 h-52 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-purple-600 p-0.5 shadow-xl shadow-purple-600/40 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-2xl">
                🧩
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl md:text-2xl font-black text-amber-300 tracking-tight drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)] flex items-center gap-2">
                  SHINOBI BUNPOU PUZZLE ARENA
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-amber-400 text-stone-950 border border-amber-300 shadow-sm">
                  30s / Soal
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200 font-medium mt-0.5">
                Susun kalimat Irodori dari termudah ke tersulit • Adu kecepatan & presisi tata bahasa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const muted = sfx.toggleMute();
                setIsMuted(muted);
              }}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-slate-200 hover:text-white hover:bg-slate-800 transition shadow-md"
              title={isMuted ? "Aktifkan Audio" : "Matikan Audio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {gameState !== "lobby" && (
              <button
                onClick={() => setGameState("lobby")}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Keluar Match
              </button>
            )}
          </div>
        </div>

        {/* MODE TABS (DOJO SOLO VS REALTIME MULTIPLAYER) */}
        {gameState === "lobby" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 pt-4 border-t border-purple-500/30 relative z-10">
            <button
              type="button"
              onClick={() => setArenaMode("solo_dojo")}
              className={`py-3.5 px-4 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
                arenaMode === "solo_dojo"
                  ? "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-2 ring-amber-300 scale-[1.01]"
                  : "bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80"
              }`}
            >
              🥋 SHINOBI TRAINING DOJO (SOLO VS RIVAL)
            </button>
            <button
              type="button"
              onClick={() => {
                if (onOpenMultiplayerModal) {
                  onOpenMultiplayerModal();
                } else {
                  setArenaMode("multiplayer_realtime");
                }
              }}
              className={`py-3.5 px-4 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
                arenaMode === "multiplayer_realtime"
                  ? "bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.45)] ring-2 ring-fuchsia-400 scale-[1.01]"
                  : "bg-slate-900/90 text-purple-200 hover:text-white hover:bg-slate-800 border-2 border-purple-500/40"
              }`}
            >
              <Swords className="w-4 h-4 text-amber-300" />
              ⚔️ DUEL REAL-TIME 1v1 (SISWA OTENTIK)
            </button>
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* 1. LOBBY SCREEN (SHINOBI DOJO CONFIGURATION) */}
      {/* ==================================================================== */}
      {gameState === "lobby" && arenaMode === "solo_dojo" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-white text-base md:text-lg">
                  Konfigurasi Latihan Tempur Shinobi
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 font-bold">
                ✓ Auto Progression Easy ➔ Hard
              </span>
            </div>

            {/* LEVEL SELECTION */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1. Tingkat Irodori
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { key: "all", label: "Semua Level", sub: "A1, A2.1 & A2.2", icon: "🌐" },
                  { key: "A1", label: "Level A1", sub: "入門 Dasar", icon: "🌱" },
                  { key: "A2.1", label: "Level A2.1", sub: "初級1 Menengah", icon: "⚔️" },
                  { key: "A2.2", label: "Level A2.2", sub: "初級2 Mahir", icon: "🔥" },
                ].map((lvl) => (
                  <button
                    key={lvl.key}
                    type="button"
                    onClick={() => {
                      setSelectedLevel(lvl.key as any);
                      setSelectedLesson(0);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedLevel === lvl.key
                        ? "border-amber-500 bg-amber-950/40 text-amber-300 shadow-lg shadow-amber-900/20"
                        : "border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <div className="text-xl mb-1">{lvl.icon}</div>
                    <div className="font-bold text-xs">{lvl.label}</div>
                    <div className="text-[10px] text-slate-400">{lvl.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* CHAPTER SELECTION */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                2. Bab Pelajaran (Irodori Lesson)
              </label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(parseInt(e.target.value, 10))}
                className="w-full p-3 rounded-2xl border border-slate-700 bg-slate-950 text-white font-medium text-sm focus:outline-none focus:border-purple-500"
              >
                <option value={0}>Semua Bab (Bab 1 - 18 Diacak Tanpa Duplikasi)</option>
                {Array.from({ length: 18 }, (_, i) => i + 1).map((ch) => (
                  <option key={ch} value={ch}>
                    Bab {ch}
                  </option>
                ))}
              </select>
            </div>

            {/* RIVAL SELECTION (29 STUDENTS LIST) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                3. Pilih Penantang Rival Kelas Outsutsuki
              </label>
              <select
                value={selectedRivalIndex}
                onChange={(e) => setSelectedRivalIndex(parseInt(e.target.value, 10))}
                className="w-full p-3 rounded-2xl border border-slate-700 bg-slate-950 text-white font-medium text-sm focus:outline-none focus:border-purple-500"
              >
                <option value={-1}>🎲 Acak / Rival Otomatis (Matchmaking 29 Siswa)</option>
                {CLASS_RIVALS.map((r, idx) => (
                  <option key={r.nim} value={idx}>
                    {r.avatar} {r.name} ({r.nim}) • {r.rank}
                  </option>
                ))}
              </select>
            </div>

            {/* ROUND COUNT */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                4. Durasi Pertandingan (Jumlah Ronde)
              </label>
              <div className="flex gap-3">
                {[3, 5, 8, 10].map((rounds) => (
                  <button
                    key={rounds}
                    type="button"
                    onClick={() => setRoundLimit(rounds)}
                    className={`flex-1 py-2.5 rounded-2xl border text-xs font-black transition-all ${
                      roundLimit === rounds
                        ? "border-purple-500 bg-purple-950/60 text-purple-200 shadow-md shadow-purple-900/30"
                        : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {rounds} Ronde
                  </button>
                ))}
              </div>
            </div>

            {/* START BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartSoloBattle}
                className="w-full py-4 rounded-2xl font-black text-stone-950 text-base md:text-lg bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 hover:from-amber-300 hover:to-orange-300 shadow-xl shadow-orange-500/30 active:scale-[0.99] transition flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                MASUK SHINOBI DOJO (30 DETIK / SOAL)
              </button>
            </div>
          </div>

          {/* RIVAL SHOWCASE CARD */}
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950/60 border border-indigo-500/30 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                Kartu Shinobi Rival
              </div>

              {(() => {
                const r =
                  selectedRivalIndex >= 0 && selectedRivalIndex < CLASS_RIVALS.length
                    ? CLASS_RIVALS[selectedRivalIndex]
                    : CLASS_RIVALS[0];
                return (
                  <div className="text-center py-4">
                    <div className="w-24 h-24 mx-auto rounded-3xl bg-indigo-900/40 border-2 border-indigo-400/40 flex items-center justify-center text-5xl shadow-2xl mb-4 animate-bounce">
                      {r.avatar}
                    </div>
                    <h4 className="font-extrabold text-white text-lg">{r.name}</h4>
                    <p className="text-xs font-mono text-purple-300">{r.nim}</p>
                    <div className="inline-block mt-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/40 text-[11px] font-bold text-indigo-300">
                      Rank: {r.rank}
                    </div>

                    <div className="mt-5 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-left space-y-2">
                      <div className="text-[11px] text-slate-400">Jurus Rahasia:</div>
                      <div className="text-xs font-bold text-amber-400">⚡ {r.specialJutsu}</div>
                      <div className="text-[11px] text-slate-400 mt-2">Aturan Tempur:</div>
                      <div className="text-xs text-slate-300 leading-relaxed">
                        • 30 detik tiap ronde<br />
                        • Kalimat semakin panjang & menantang<br />
                        • Evaluasi & pembahasan komprehensif di akhir
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
              💡 <strong>Tips Master:</strong> Partikel penanda (は, を, に, で) telah diberi sorotan khusus agar mudah dikenali posisinya!
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. ACTIVE ARCADE BATTLE SCREEN (30s TIMER & CHAKRA STRIKE) */}
      {/* ==================================================================== */}
      {gameState === "battle" && currentQ && (
        <div className="space-y-6">
          {/* FLOATING ACTION FX OVERLAY */}
          {actionFx && (
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
              <div className="px-8 py-4 rounded-3xl bg-black/80 border-4 border-amber-400 text-amber-300 font-black text-2xl md:text-4xl shadow-2xl shadow-amber-500/50 animate-bounce tracking-widest uppercase">
                {actionFx}
              </div>
            </div>
          )}

          {/* COMBAT HUD: ARCADE FIGHTING STANCE */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            {/* PLAYER CHAKRA BAR */}
            <div className={`md:col-span-2 p-4 rounded-2xl border transition-all duration-300 ${isHit ? "bg-red-950/70 border-red-500 animate-pulse scale-[0.98]" : "bg-slate-950/80 border-purple-500/40"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">🥷</span>
                  <div>
                    <div className="font-extrabold text-sm text-white">Pemain (Anda)</div>
                    <div className="text-[10px] text-purple-400 font-mono">Chunin Tangkas</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-mono font-black ${playerHp <= 30 ? "text-red-400 animate-ping" : "text-emerald-400"}`}>
                    {playerHp} / 100 HP
                  </div>
                </div>
              </div>
              {/* Neon Chakra Bar */}
              <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    playerHp > 50
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/50"
                      : playerHp > 25
                      ? "bg-gradient-to-r from-amber-500 to-yellow-400 shadow-lg shadow-amber-500/50"
                      : "bg-gradient-to-r from-red-600 to-red-400 shadow-lg shadow-red-500/50"
                  }`}
                  style={{ width: `${playerHp}%` }}
                />
              </div>
            </div>

            {/* VS CENTER BADGE & 30s COUNTDOWN TIMER */}
            <div className="md:col-span-1 text-center flex flex-col items-center justify-center py-2">
              <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                <span>Ronde {currentRound} / {matchQuestions.length}</span>
              </div>

              {/* 30s Circular Timer */}
              <div
                className={`w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center font-black shadow-xl transition-all ${
                  timeLeft <= 5
                    ? "border-red-500 bg-red-950 text-red-300 animate-ping scale-110"
                    : timeLeft <= 10
                    ? "border-amber-500 bg-amber-950/80 text-amber-300"
                    : "border-purple-500 bg-purple-950/80 text-purple-200"
                }`}
              >
                <span className="text-xl leading-none">{timeLeft}</span>
                <span className="text-[9px] uppercase tracking-wider opacity-75">DETIK</span>
              </div>

              {/* Difficulty Tag */}
              <div className="mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                {currentQ.difficultyTier === "easy" ? "🌱 Mudah" : currentQ.difficultyTier === "medium" ? "⚔️ Menengah" : "🔥 Sulit"}
              </div>

              {combo > 1 && (
                <div className="mt-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-stone-950 font-black text-[10px] uppercase shadow-md animate-bounce">
                  🔥 {combo}x COMBO!
                </div>
              )}
            </div>

            {/* RIVAL CHAKRA BAR */}
            <div className={`md:col-span-2 p-4 rounded-2xl border transition-all duration-300 ${isAttacking ? "bg-red-950/70 border-red-500 animate-pulse scale-[0.98]" : "bg-slate-950/80 border-indigo-500/40"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{activeRival.avatar}</span>
                  <div>
                    <div className="font-extrabold text-sm text-white">{activeRival.name}</div>
                    <div className="text-[10px] text-indigo-400 font-mono">{activeRival.nim}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-mono font-black ${rivalHp <= 30 ? "text-red-400 animate-ping" : "text-indigo-400"}`}>
                    {rivalHp} / 100 HP
                  </div>
                </div>
              </div>
              {/* Rival Neon Chakra Bar */}
              <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    rivalHp > 50
                      ? "bg-gradient-to-r from-indigo-500 to-blue-400 shadow-lg shadow-indigo-500/50"
                      : rivalHp > 25
                      ? "bg-gradient-to-r from-amber-500 to-orange-400 shadow-lg shadow-amber-500/50"
                      : "bg-gradient-to-r from-red-600 to-red-400 shadow-lg shadow-red-500/50"
                  }`}
                  style={{ width: `${rivalHp}%` }}
                />
              </div>
            </div>
          </div>

          {/* TARGET MISSION BOX (SOAL BAHASA INDONESIA & RUMUS) */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/60 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-purple-950/90 border border-purple-500/40 text-xs font-black text-purple-300 uppercase">
                  {currentQ.level} • Bab {currentQ.chapter}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {currentQ.pattern}
                </span>
              </div>

              <button
                type="button"
                onClick={() => speakJapanese(currentQ.puzzleSentence || "")}
                className="px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-950/50 text-purple-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold"
                title="Dengarkan pelafalan bahasa Jepang otentik"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
                Dengarkan Kunci Suara
              </button>
            </div>

            {/* INDONESIAN MEANING TO ASSEMBLE */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 mb-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                Target Terjemahan Bahasa Indonesia:
              </div>
              <div className="text-lg md:text-2xl font-black text-amber-300 tracking-wide">
                "{currentQ.puzzleTranslation || currentQ.display}"
              </div>
            </div>

            {/* FORMULA CLUE */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-purple-400">Petunjuk Pola Kalimat:</span>
              <span className="font-mono bg-purple-950/60 px-2.5 py-1 rounded-lg border border-purple-500/30 text-purple-200 font-semibold">
                {currentQ.formulaDetailed || currentQ.subDisplay || currentQ.pattern}
              </span>
            </div>
          </div>

          {/* INTERACTIVE SENTENCE DROPZONE */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span>Susunan Kalimat Shinobi Anda:</span>
                <span className="text-[11px] font-normal text-slate-400">(Ketuk kata untuk membatalkan)</span>
              </label>

              <button
                type="button"
                onClick={handleResetTokens}
                disabled={placedTokens.length === 0}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 disabled:opacity-40 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Susunan
              </button>
            </div>

            {/* PLACED TOKENS CONTAINER */}
            <div
              className={`min-h-[84px] p-4 rounded-2xl border-2 border-dashed flex flex-wrap items-center gap-2.5 transition-all ${
                feedback === "correct"
                  ? "border-emerald-500 bg-emerald-950/40 shadow-lg shadow-emerald-500/20"
                  : feedback === "wrong"
                  ? "border-red-500 bg-red-950/40 shadow-lg shadow-red-500/20"
                  : placedTokens.length > 0
                  ? "border-purple-500/60 bg-slate-950/90"
                  : "border-slate-800 bg-slate-950/50"
              }`}
            >
              {placedTokens.length === 0 ? (
                <div className="text-xs text-slate-500 italic">
                  Ketuk kartu gulungan kata & partikel di bawah sesuai urutan tata bahasa yang tepat...
                </div>
              ) : (
                placedTokens.map((token, idx) => {
                  const isParticle = JAPANESE_PARTICLES.has(token);
                  return (
                    <button
                      key={`${token}-${idx}`}
                      type="button"
                      onClick={() => handleRemoveToken(token, idx)}
                      className={`px-4 py-2.5 rounded-2xl font-black text-sm md:text-base border shadow-md active:scale-95 transition-all flex items-center gap-1.5 ${
                        isParticle
                          ? "border-amber-400/60 bg-gradient-to-r from-amber-600 to-orange-600 text-stone-950 shadow-amber-500/20"
                          : "border-purple-400/60 bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-purple-600/30"
                      } hover:border-red-400 hover:from-red-600 hover:to-red-700 hover:text-white`}
                      title="Klik untuk kembalikan ke wadah kata"
                    >
                      {token}
                      {isParticle && (
                        <span className="text-[10px] px-1 py-0.2 rounded bg-black/20 text-stone-950 font-mono">
                          partikel
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {/* AVAILABLE CHAKRA SCROLL TILES (TOKEN POOL) */}
            <div className="pt-2">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Pilihan Gulungan Kata & Partikel:</span>
                <span className="text-[10px] text-amber-400 font-normal">
                  ⚡ Warna kuning = Partikel Gramatikal
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {availableTokens.map((token, idx) => {
                  const isParticle = JAPANESE_PARTICLES.has(token);
                  return (
                    <button
                      key={`${token}-${idx}`}
                      type="button"
                      onClick={() => handlePickToken(token, idx)}
                      className={`px-4 py-3 rounded-2xl font-black text-sm md:text-base border shadow-lg active:scale-95 hover:scale-105 transition-all ${
                        isParticle
                          ? "border-amber-500/60 bg-amber-950/70 text-amber-300 hover:bg-amber-900/80 shadow-amber-900/20"
                          : "border-slate-700 bg-slate-800 text-slate-100 hover:border-purple-400 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      {token}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FEEDBACK STATUS BANNER */}
            {feedback === "correct" && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>SEMPURNA! Jutsu Bunpou berhasil dieksekusi dengan dahsyat! (+Skor Kecepatan)</span>
              </div>
            )}
            {feedback === "wrong" && (
              <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/60 text-red-300 text-xs font-bold flex items-center gap-2 shadow-lg">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>Susunan kurang tepat! Kunci: {cleanJapaneseText(currentQ.puzzleSentence || "")} (Lihat penjelasan di refleksi akhir)</span>
              </div>
            )}

            {/* SUBMIT JUTSU STRIKE BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmitSentence}
                disabled={placedTokens.length === 0 || feedback !== "idle"}
                className="w-full py-4 rounded-2xl font-black text-white text-base md:text-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-purple-600/30 active:scale-[0.99] transition flex items-center justify-center gap-2"
              >
                <Swords className="w-5 h-5 text-amber-400" />
                SERANG RIVAL DENGAN JUTSU INI!
              </button>
            </div>
          </div>

          {/* COMBAT TICKER */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-xs font-mono text-slate-400 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Catatan Tempur Arena:
            </div>
            {battleLogs.slice(0, 3).map((log, idx) => (
              <div key={idx} className="truncate">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 3. VICTORY & DEFEAT SCREENS WITH POST-MATCH REFLECTION SHEET */}
      {/* ==================================================================== */}
      {(gameState === "victory" || gameState === "defeat") && (
        <div className="space-y-6">
          {/* RESULT HERO CARD */}
          <div
            className={`border-2 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden ${
              gameState === "victory"
                ? "bg-slate-900/95 border-amber-500/60 shadow-amber-500/20"
                : "bg-slate-900/95 border-red-500/60 shadow-red-500/20"
            }`}
          >
            {/* MANGA / ANIME STAMP */}
            <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl mb-4 shadow-2xl border-4 bg-slate-950">
              {gameState === "victory" ? "🏆" : "💀"}
            </div>

            <div className="space-y-1 mb-5">
              <div className="inline-block px-4 py-1 rounded-full font-mono text-xs font-black uppercase tracking-widest bg-black/40 border border-current mb-2">
                {gameState === "victory" ? "「一本！完全勝利」" : "「無念！修行不足」"}
              </div>
              <h3 className="text-2xl md:text-4xl font-black text-white">
                {gameState === "victory" ? "KEMENANGAN MUTLAK SHINOBI!" : "PERTAHANAN ANDA DITEMBUS!"}
              </h3>
              <p className="text-sm max-w-lg mx-auto text-slate-300">
                {gameState === "victory"
                  ? `Hebat! Anda berhasil menumbangkan ${activeRival.name} (${activeRival.nim}) dengan kecepatan dan ketepatan susunan tata bahasa!`
                  : `${activeRival.name} (${activeRival.nim}) berhasil mengungguli duel ini. Pelajari lembar refleksi di bawah untuk membalas dendam!`}
              </p>
            </div>

            {/* MATCH STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-6">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">Total Skor</div>
                <div className="text-xl font-black text-amber-400">{score}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">Highest Combo</div>
                <div className="text-xl font-black text-red-400">🔥 {highestCombo}x</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">Sisa HP Anda</div>
                <div className="text-xl font-black text-emerald-400">{playerHp} HP</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">XP Hadiah</div>
                <div className="text-xl font-black text-purple-400">
                  +{gameState === "victory" ? 180 + highestCombo * 25 : 30} XP
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleStartSoloBattle}
                className="px-6 py-3.5 rounded-2xl font-black bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-stone-950 shadow-xl shadow-orange-500/30 transition flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Tanding Ulang (Soal Baru & Acak)
              </button>
              <button
                type="button"
                onClick={() => setGameState("lobby")}
                className="px-6 py-3.5 rounded-2xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                Kembali ke Lobi Arena
              </button>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* REFLEKSI & PEMBAHASAN PASCA-PERTANDINGAN */}
          {/* ==================================================================== */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg md:text-xl font-black text-white">
                  📜 Lembar Refleksi & Pembahasan Tata Bahasa
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {reflectionList.filter((r) => r.isCorrect).length} dari {reflectionList.length} Soal Berhasil Dijawab Benar
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Pelajari detail kesalahan dan kunci kaidah pola kalimat di bawah ini agar kemampuan bahasa Jepang Anda semakin berkembang:
            </p>

            {/* LIST OF QUESTION REFLECTIONS */}
            <div className="space-y-4">
              {reflectionList.map((item, idx) => {
                const isExpanded = expandedReflectionIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all ${
                      item.isCorrect
                        ? "bg-slate-950/70 border-emerald-500/40"
                        : "bg-slate-950/90 border-red-500/50 shadow-lg shadow-red-950/20"
                    }`}
                  >
                    <div
                      onClick={() => setExpandedReflectionIdx(isExpanded ? null : idx)}
                      className="p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-white/5 rounded-2xl transition"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                            item.isCorrect
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                              : "bg-red-950 text-red-400 border border-red-500/40"
                          }`}
                        >
                          {item.round}
                        </span>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-white">
                              {item.question.puzzleTranslation || item.question.display}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                              {item.question.level} • Bab {item.question.chapter}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-0.5">
                            Pola: <span className="text-purple-300 font-mono">{item.question.pattern}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            item.isCorrect
                              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                              : "bg-red-950/80 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {item.isCorrect ? "✓ Benar" : "✕ Perlu Evaluasi"}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {/* EXPANDED REFLECTION DETAIL */}
                    {isExpanded && (
                      <div className="p-5 pt-0 border-t border-slate-800/80 space-y-4 text-xs mt-2">
                        {/* Comparison between Student assembly & Correct answer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3">
                          {/* Student Answer */}
                          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                            <div className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center justify-between">
                              <span>Susunan Anda:</span>
                              <span className={item.isCorrect ? "text-emerald-400" : "text-red-400"}>
                                {item.isCorrect ? "Tepat" : "Ada Kesalahan"}
                              </span>
                            </div>
                            <div className="font-bold text-sm text-slate-200">
                              {item.userAssembled.length > 0 ? item.userAssembled.join(" ") : "(Kosong / Tidak sempat susun)"}
                            </div>
                            {item.errorReason && (
                              <div className="mt-2 text-[11px] text-red-300 bg-red-950/40 p-2 rounded-lg border border-red-500/30">
                                ⚠️ <strong>Catatan:</strong> {item.errorReason}
                              </div>
                            )}
                          </div>

                          {/* Correct Answer */}
                          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30">
                            <div className="text-[11px] font-bold text-purple-300 mb-1.5 flex items-center justify-between">
                              <span>Kunci Jawaban Otentik:</span>
                              <button
                                type="button"
                                onClick={() => speakJapanese(item.question.puzzleSentence || "")}
                                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                Dengarkan
                              </button>
                            </div>
                            <div className="font-black text-sm text-amber-300">
                              {cleanJapaneseText(item.question.puzzleSentence || "")}
                            </div>
                            <div className="mt-2 text-[11px] text-purple-200">
                              Rumus: <span className="font-mono">{item.question.formulaDetailed || item.question.subDisplay || item.question.pattern}</span>
                            </div>
                          </div>
                        </div>

                        {/* Grammatical Explanation from bunpouData */}
                        {item.question.usageRule && (
                          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
                            <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                              <Info className="w-3.5 h-3.5" />
                              Penjelasan & Kaidah Tata Bahasa:
                            </div>
                            <p className="text-slate-300 leading-relaxed">
                              {item.question.usageRule}
                            </p>
                          </div>
                        )}

                        {item.question.example && (
                          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80">
                            <div className="font-bold text-slate-400 text-[11px] mb-1">
                              Contoh Pemakaian Lain:
                            </div>
                            <div className="font-mono text-slate-300 whitespace-pre-line">
                              {item.question.example}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
