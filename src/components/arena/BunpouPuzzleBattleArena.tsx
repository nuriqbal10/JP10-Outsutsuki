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
} from "lucide-react";
import rawBunpouData from "@/data/bunpouData.json";
import { BunpouItem } from "@/types/bunpou";
import { sfx } from "@/lib/soundEffects";
import { addXp, getGamificationState } from "@/lib/gamification";
import { advanceDailyQuest } from "@/lib/dailyQuests";

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

const allBunpouData: BunpouItem[] = rawBunpouData as BunpouItem[];

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export interface BunpouPuzzleBattleArenaProps {
  onBackToHub?: () => void;
  onOpenMultiplayerModal?: () => void;
}

export default function BunpouPuzzleBattleArena({
  onBackToHub,
  onOpenMultiplayerModal,
}: BunpouPuzzleBattleArenaProps) {
  // Game Flow States: 'lobby' | 'battle' | 'victory' | 'defeat'
  const [gameState, setGameState] = useState<"lobby" | "battle" | "victory" | "defeat">("lobby");

  // Lobby Filters
  const [selectedLevel, setSelectedLevel] = useState<"all" | "a1" | "a2_1" | "a2_2">("all");
  const [selectedLesson, setSelectedLesson] = useState<number>(0); // 0 = all
  const [selectedRivalIndex, setSelectedRivalIndex] = useState<number>(-1); // -1 = random
  const [roundLimit, setRoundLimit] = useState<number>(5);

  // Active Battle States
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [rivalHp, setRivalHp] = useState<number>(100);
  const [combo, setCombo] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(25);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAttacking, setIsAttacking] = useState<boolean>(false);
  const [isHit, setIsHit] = useState<boolean>(false);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);

  // Current Question
  const [activeItems, setActiveItems] = useState<BunpouItem[]>([]);
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [placedTokens, setPlacedTokens] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [activeRival, setActiveRival] = useState<ClassRival>(CLASS_RIVALS[0]);

  // Player Profile
  const [playerName, setPlayerName] = useState<string>("Shinobi Pelajar");
  const [playerRank, setPlayerRank] = useState<string>("Genin");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial gamification data
  useEffect(() => {
    const st = getGamificationState();
    if (st) {
      setPlayerRank(st.rankTitle);
    }
  }, []);

  // Filter Bunpou Pool based on criteria
  const filteredPool = useMemo(() => {
    return allBunpouData.filter((b) => {
      if (!b.puzzle || !b.puzzle.sentence) return false;
      if (selectedLevel !== "all" && b.level !== selectedLevel) return false;
      if (selectedLesson > 0 && b.lesson !== selectedLesson) return false;
      return true;
    });
  }, [selectedLevel, selectedLesson]);

  // Pronounce sentence using Web Speech API
  const speakJapanese = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  // Start Battle
  const handleStartBattle = () => {
    if (filteredPool.length === 0) {
      alert("Tidak ada pola kalimat untuk filter ini! Silakan ubah level atau bab.");
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

    // Shuffle and pick questions for the match
    const shuffled = shuffleArray(filteredPool);
    const chosen = shuffled.slice(0, Math.min(roundLimit, shuffled.length));
    setActiveItems(chosen);
    setActiveItemIndex(0);

    // Setup first question
    const firstItem = chosen[0];
    setupQuestion(firstItem);

    // Reset battle stats
    setPlayerHp(100);
    setRivalHp(100);
    setCombo(0);
    setHighestCombo(0);
    setScore(0);
    setCurrentRound(1);
    setBattleLogs([
      `⚔️ Duel dimulai melawan ${rival.name} (${rival.nim})!`,
      `🎯 Susun pola kalimat dengan benar untuk melancarkan serangan Shinobi!`,
    ]);
    setGameState("battle");

    // Audio effect
    sfx.playSlash();
  };

  const setupQuestion = (item: BunpouItem) => {
    if (!item.puzzle) return;
    const tokens = item.puzzle.shuffledTokens && item.puzzle.shuffledTokens.length > 0
      ? shuffleArray(item.puzzle.shuffledTokens)
      : shuffleArray(item.puzzle.tokens);
    setAvailableTokens(tokens);
    setPlacedTokens([]);
    setFeedback("idle");
    setTimeLeft(25);
  };

  // Countdown Timer Hook
  useEffect(() => {
    if (gameState !== "battle") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 25;
        }
        if (prev <= 5 && !isMuted) {
          sfx.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, activeItemIndex, activeItems, placedTokens, combo, playerHp, rivalHp]);

  // Handle Timeout (Rival Counterattacks!)
  const handleTimeout = () => {
    sfx.playWrong();
    setIsHit(true);
    setTimeout(() => setIsHit(false), 600);

    const dmg = 20;
    const newPlayerHp = Math.max(0, playerHp - dmg);
    setPlayerHp(newPlayerHp);
    setCombo(0);
    setBattleLogs((prev) => [
      `⏰ Waktu habis! ${activeRival.name} melancarkan ${activeRival.specialJutsu} (-${dmg} HP)!`,
      ...prev.slice(0, 5),
    ]);

    if (newPlayerHp <= 0) {
      setTimeout(() => {
        sfx.playEliminated();
        setGameState("defeat");
      }, 700);
    } else {
      nextTurn();
    }
  };

  // Move token from available pool to placed pool
  const handlePickToken = (token: string, index: number) => {
    if (feedback !== "idle") return;
    setAvailableTokens((prev) => prev.filter((_, i) => i !== index));
    setPlacedTokens((prev) => [...prev, token]);
  };

  // Move token from placed pool back to available pool
  const handleRemoveToken = (token: string, index: number) => {
    if (feedback !== "idle") return;
    setPlacedTokens((prev) => prev.filter((_, i) => i !== index));
    setAvailableTokens((prev) => [...prev, token]);
  };

  // Reset placed tokens
  const handleResetTokens = () => {
    if (feedback !== "idle") return;
    const currentItem = activeItems[activeItemIndex];
    if (currentItem && currentItem.puzzle) {
      setupQuestion(currentItem);
    }
  };

  // Check Sentence & Attack!
  const handleSubmitSentence = () => {
    if (placedTokens.length === 0 || feedback !== "idle") return;
    const currentItem = activeItems[activeItemIndex];
    if (!currentItem || !currentItem.puzzle) return;

    const assembled = placedTokens.join("");
    const correctClean = currentItem.puzzle.sentence.replace(/[。、\s]/g, "");
    const assembledClean = assembled.replace(/[。、\s]/g, "");

    const isMatch = assembledClean === correctClean;

    if (isMatch) {
      // SUCCESSFUL JUTSU ATTACK!
      setFeedback("correct");
      sfx.playCorrect();
      setIsAttacking(true);
      setTimeout(() => setIsAttacking(false), 600);

      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (nextCombo > highestCombo) setHighestCombo(nextCombo);

      // Damage formula: 30 base + combo bonus
      const dmg = Math.min(50, 30 + nextCombo * 5);
      const newRivalHp = Math.max(0, rivalHp - dmg);
      setRivalHp(newRivalHp);

      const addedScore = 500 + timeLeft * 20 + nextCombo * 50;
      setScore((s) => s + addedScore);

      setBattleLogs((prev) => [
        `💥 JUTSU BERHASIL! [${currentItem.pattern}] menghantam ${activeRival.name} (-${dmg} HP)! 🔥 ${nextCombo}x Combo`,
        ...prev.slice(0, 5),
      ]);

      // Speak correct sentence
      speakJapanese(currentItem.puzzle.sentence);

      if (newRivalHp <= 0) {
        setTimeout(() => {
          handleVictory();
        }, 1200);
      } else {
        setTimeout(() => {
          nextTurn();
        }, 1400);
      }
    } else {
      // WRONG SENTENCE! RIVAL COUNTER-ATTACKS
      setFeedback("wrong");
      sfx.playWrong();
      setIsHit(true);
      setTimeout(() => setIsHit(false), 600);

      setCombo(0);
      const dmg = 20;
      const newPlayerHp = Math.max(0, playerHp - dmg);
      setPlayerHp(newPlayerHp);

      setBattleLogs((prev) => [
        `❌ Susunan kata belum tepat! ${activeRival.name} melancarkan ${activeRival.specialJutsu} (-${dmg} HP)!`,
        ...prev.slice(0, 5),
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
        }, 1500);
      }
    }
  };

  // Next Round / Turn
  const nextTurn = () => {
    setFeedback("idle");
    const nextIdx = activeItemIndex + 1;
    if (nextIdx >= activeItems.length) {
      // All questions done! Determine winner based on HP
      if (rivalHp <= playerHp) {
        handleVictory();
      } else {
        setGameState("defeat");
      }
      return;
    }

    setActiveItemIndex(nextIdx);
    setCurrentRound(nextIdx + 1);
    setupQuestion(activeItems[nextIdx]);
  };

  // Victory Handler
  const handleVictory = () => {
    sfx.playVictory();
    const xpReward = 150 + highestCombo * 20;
    addXp(xpReward, "Kemenangan Bunpou Puzzle Shinobi Arena!");
    advanceDailyQuest("battle");
    setGameState("victory");
  };

  const currentItem = activeItems[activeItemIndex];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* ARENA TOP CONTROL BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-2xl shadow-inner">
            🧩
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
              BUNPOU PUZZLE BATTLE
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                Shinobi Mode
              </span>
            </h2>
            <p className="text-xs text-purple-300">
              Rangkai kata & partikel bahasa Jepang secara presisi untuk menumbangkan rival kelas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const muted = sfx.toggleMute();
              setIsMuted(muted);
            }}
            className="p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {onOpenMultiplayerModal && (
            <button
              onClick={onOpenMultiplayerModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-indigo-500/40 bg-indigo-950/60 text-indigo-300 hover:bg-indigo-900/80 transition flex items-center gap-1.5"
            >
              <Swords className="w-3.5 h-3.5 text-indigo-400" />
              Lobi Multiplayer Cup
            </button>
          )}

          {gameState !== "lobby" && (
            <button
              onClick={() => setGameState("lobby")}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Keluar Duel
            </button>
          )}
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 1. LOBBY SCREEN */}
      {/* ==================================================================== */}
      {gameState === "lobby" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LOBBY SETTINGS */}
          <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-white text-base md:text-lg">
                Pengaturan Arena Tempur Bunpou
              </h3>
            </div>

            {/* LEVEL SELECTION */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1. Pilih Level Irodori
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { key: "all", label: "Semua Level", sub: "A1, A2.1 & A2.2", icon: "🌐" },
                  { key: "a1", label: "Level A1", sub: "入門 Nyuumon", icon: "🌱" },
                  { key: "a2_1", label: "Level A2.1", sub: "初級1 Shokyuu 1", icon: "⚔️" },
                  { key: "a2_2", label: "Level A2.2", sub: "初級2 Shokyuu 2", icon: "🔥" },
                ].map((lvl) => (
                  <button
                    key={lvl.key}
                    type="button"
                    onClick={() => {
                      setSelectedLevel(lvl.key as any);
                      setSelectedLesson(0);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedLevel === lvl.key
                        ? "border-purple-500 bg-purple-950/60 shadow-lg shadow-purple-900/30 text-white"
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
                2. Pilih Bab Pelajaran (Irodori Lesson)
              </label>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(parseInt(e.target.value, 10))}
                className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-white font-medium text-sm focus:outline-none focus:border-purple-500"
              >
                <option value={0}>Semua Bab (Bab 1 - 18)</option>
                {Array.from({ length: 18 }, (_, i) => i + 1).map((ch) => (
                  <option key={ch} value={ch}>
                    Bab {ch} ({allBunpouData.filter((b) => (selectedLevel === "all" || b.level === selectedLevel) && b.lesson === ch).length} Pola Kalimat)
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1.5">
                Tersedia <span className="text-purple-400 font-bold">{filteredPool.length}</span> pola kalimat dengan puzzle susun kata siap uji.
              </p>
            </div>

            {/* RIVAL SELECTION */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                3. Pilih Penantang Rival Kelas Outsutsuki
              </label>
              <select
                value={selectedRivalIndex}
                onChange={(e) => setSelectedRivalIndex(parseInt(e.target.value, 10))}
                className="w-full p-3 rounded-xl border border-slate-700 bg-slate-950 text-white font-medium text-sm focus:outline-none focus:border-purple-500"
              >
                <option value={-1}>🎲 Acak / Rival Otomatis (Matchmaking)</option>
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
                {[3, 5, 10].map((rounds) => (
                  <button
                    key={rounds}
                    type="button"
                    onClick={() => setRoundLimit(rounds)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      roundLimit === rounds
                        ? "border-amber-500 bg-amber-950/50 text-amber-300"
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
                onClick={handleStartBattle}
                className="w-full py-4 rounded-xl font-black text-white text-base md:text-lg bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/30 active:scale-[0.99] transition flex items-center justify-center gap-2"
              >
                <Swords className="w-5 h-5" />
                MASUK ARENA TEMPUR BUNPOU
              </button>
            </div>
          </div>

          {/* RIVAL PREVIEW CARD */}
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950/50 border border-indigo-500/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                Profil Rival Terpilih
              </div>

              {(() => {
                const previewRival =
                  selectedRivalIndex >= 0 && selectedRivalIndex < CLASS_RIVALS.length
                    ? CLASS_RIVALS[selectedRivalIndex]
                    : CLASS_RIVALS[0];
                return (
                  <div className="text-center py-4">
                    <div className="w-24 h-24 mx-auto rounded-2xl bg-indigo-900/60 border-2 border-indigo-400/40 flex items-center justify-center text-5xl shadow-2xl mb-4 animate-bounce">
                      {previewRival.avatar}
                    </div>
                    <h4 className="font-extrabold text-white text-lg">{previewRival.name}</h4>
                    <p className="text-xs font-mono text-purple-300">{previewRival.nim}</p>
                    <div className="inline-block mt-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/40 text-[11px] font-bold text-indigo-300">
                      Rank: {previewRival.rank}
                    </div>

                    <div className="mt-5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-left">
                      <div className="text-[11px] text-slate-400">Jutsu Rahasia:</div>
                      <div className="text-xs font-bold text-amber-400">⚡ {previewRival.specialJutsu}</div>
                      <div className="text-[11px] text-slate-400 mt-2">Kelemahan:</div>
                      <div className="text-xs text-slate-300">Susunan partikel presisi & kecepatan kilat</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
              💡 <strong>Tips Shinobi:</strong> Pastikan partikel (は, を, に, で, と) berada tepat setelah kata benda yang ditargetkan!
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 2. ACTIVE BATTLE SCREEN */}
      {/* ==================================================================== */}
      {gameState === "battle" && currentItem && currentItem.puzzle && (
        <div className="space-y-6">
          {/* COMBAT HUD: PLAYER VS RIVAL */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
            {/* PLAYER CARD */}
            <div className={`md:col-span-2 p-4 rounded-xl border transition-all duration-300 ${isHit ? "bg-red-950/60 border-red-500 animate-pulse" : "bg-slate-950/70 border-purple-500/30"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🥷</span>
                  <div>
                    <div className="font-extrabold text-sm text-white">{playerName}</div>
                    <div className="text-[10px] text-purple-400">{playerRank}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-400">{playerHp} / 100 HP</div>
                </div>
              </div>
              {/* HP Bar */}
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                <div
                  className={`h-full transition-all duration-500 ${
                    playerHp > 50 ? "bg-gradient-to-r from-emerald-500 to-teal-400" : playerHp > 25 ? "bg-gradient-to-r from-amber-500 to-yellow-400" : "bg-gradient-to-r from-red-600 to-red-400"
                  }`}
                  style={{ width: `${playerHp}%` }}
                />
              </div>
            </div>

            {/* ROUND & TIMER BADGE */}
            <div className="md:col-span-1 text-center flex flex-col items-center justify-center py-2">
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                Ronde {currentRound} / {activeItems.length}
              </div>
              <div
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-black text-xl shadow-lg transition-all ${
                  timeLeft <= 5
                    ? "border-red-500 bg-red-950/80 text-red-300 animate-ping"
                    : "border-purple-500 bg-purple-950/60 text-purple-200"
                }`}
              >
                {timeLeft}s
              </div>
              {combo > 1 && (
                <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-stone-950 font-black text-[10px] uppercase shadow-md animate-bounce">
                  🔥 {combo}x COMBO!
                </div>
              )}
            </div>

            {/* RIVAL CARD */}
            <div className={`md:col-span-2 p-4 rounded-xl border transition-all duration-300 ${isAttacking ? "bg-red-950/60 border-red-500 animate-pulse" : "bg-slate-950/70 border-indigo-500/30"}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeRival.avatar}</span>
                  <div>
                    <div className="font-extrabold text-sm text-white">{activeRival.name}</div>
                    <div className="text-[10px] text-indigo-400 font-mono">{activeRival.nim}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-indigo-400">{rivalHp} / 100 HP</div>
                </div>
              </div>
              {/* Rival HP Bar */}
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                <div
                  className={`h-full transition-all duration-500 ${
                    rivalHp > 50 ? "bg-gradient-to-r from-indigo-500 to-blue-400" : rivalHp > 25 ? "bg-gradient-to-r from-amber-500 to-orange-400" : "bg-gradient-to-r from-red-600 to-red-400"
                  }`}
                  style={{ width: `${rivalHp}%` }}
                />
              </div>
            </div>
          </div>

          {/* TARGET SENTENCE DISPLAY */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/30 text-[11px] font-bold text-purple-300 uppercase">
                  {currentItem.levelJapanese} • Bab {currentItem.lesson}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {currentItem.lessonTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={() => speakJapanese(currentItem.puzzle?.sentence || "")}
                className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white transition"
                title="Dengarkan pengucapan audio bahasa Jepang"
              >
                <Volume2 className="w-4 h-4 text-purple-400" />
              </button>
            </div>

            {/* INDONESIAN MEANING (TARGET TO ASSEMBLE) */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 mb-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Target Arti Bahasa Indonesia:
              </div>
              <div className="text-base md:text-xl font-bold text-amber-300">
                "{currentItem.puzzle.translation}"
              </div>
            </div>

            {/* BUNPOU FORMULA HINT */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-purple-400">Rumus:</span>
              <span className="font-mono bg-purple-950/50 px-2 py-0.5 rounded border border-purple-500/20 text-purple-200">
                {currentItem.formulaDetailed || currentItem.pattern}
              </span>
            </div>
          </div>

          {/* PUZZLE ASSEMBLY ZONE (DROPZONE) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Susunan Kalimat Anda (Ketuk token untuk membatalkan):
              </label>
              <button
                type="button"
                onClick={handleResetTokens}
                disabled={placedTokens.length === 0}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 disabled:opacity-40 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Susunan
              </button>
            </div>

            {/* PLACED TOKENS CONTAINER */}
            <div
              className={`min-h-[72px] p-4 rounded-xl border-2 border-dashed flex flex-wrap items-center gap-2.5 transition-all ${
                feedback === "correct"
                  ? "border-emerald-500 bg-emerald-950/30"
                  : feedback === "wrong"
                  ? "border-red-500 bg-red-950/30"
                  : placedTokens.length > 0
                  ? "border-purple-500/50 bg-slate-950/80"
                  : "border-slate-800 bg-slate-950/40"
              }`}
            >
              {placedTokens.length === 0 ? (
                <div className="text-xs text-slate-500 italic">
                  Ketuk kata-kata di bawah ini sesuai urutan tata bahasa yang tepat...
                </div>
              ) : (
                placedTokens.map((token, idx) => (
                  <button
                    key={`${token}-${idx}`}
                    type="button"
                    onClick={() => handleRemoveToken(token, idx)}
                    className="px-4 py-2.5 rounded-xl font-bold text-sm md:text-base border border-purple-400/50 bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md active:scale-95 hover:border-red-400 hover:from-red-600 hover:to-red-700 transition"
                    title="Klik untuk kembalikan ke pilihan"
                  >
                    {token}
                  </button>
                ))
              )}
            </div>

            {/* AVAILABLE TOKEN POOL */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Pilihan Kata & Partikel:
              </div>
              <div className="flex flex-wrap gap-2.5">
                {availableTokens.map((token, idx) => (
                  <button
                    key={`${token}-${idx}`}
                    type="button"
                    onClick={() => handlePickToken(token, idx)}
                    className="px-4 py-2.5 rounded-xl font-bold text-sm md:text-base border border-slate-700 bg-slate-800 text-slate-100 hover:border-purple-400 hover:bg-slate-700 hover:text-white shadow-md active:scale-95 transition"
                  >
                    {token}
                  </button>
                ))}
              </div>
            </div>

            {/* FEEDBACK BANNER */}
            {feedback === "correct" && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>SEMPURNA! Jutsu Bunpou berhasil dieksekusi dengan dahsyat!</span>
              </div>
            )}
            {feedback === "wrong" && (
              <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>Kurang tepat! Kunci jawaban: {currentItem.puzzle.sentence}</span>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmitSentence}
                disabled={placedTokens.length === 0 || feedback !== "idle"}
                className="w-full py-3.5 rounded-xl font-black text-white text-base bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:scale-[0.99] transition flex items-center justify-center gap-2"
              >
                <Swords className="w-5 h-5" />
                SERANG RIVAL DENGAN JUTSU INI!
              </button>
            </div>
          </div>

          {/* BATTLE TICKER LOG */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-slate-400 space-y-1">
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
      {/* 3. VICTORY SCREEN */}
      {/* ==================================================================== */}
      {gameState === "victory" && (
        <div className="bg-slate-900/95 border border-amber-500/50 rounded-2xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-5xl shadow-2xl shadow-amber-500/30 animate-pulse">
            🏆
          </div>

          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-1">
              KEMENANGAN SHINOBI!
            </h3>
            <p className="text-amber-300 text-sm">
              Anda berhasil menumbangkan {activeRival.name} ({activeRival.nim}) dengan susunan tata bahasa sempurna!
            </p>
          </div>

          {/* MATCH STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-400">Total Skor</div>
              <div className="text-lg font-black text-amber-400">{score}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-400">Highest Combo</div>
              <div className="text-lg font-black text-red-400">🔥 {highestCombo}x</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-400">Sisa HP Anda</div>
              <div className="text-lg font-black text-emerald-400">{playerHp} HP</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] text-slate-400">XP Hadiah</div>
              <div className="text-lg font-black text-purple-400">+{150 + highestCombo * 20} XP</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleStartBattle}
              className="px-6 py-3 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Tanding Lagi
            </button>
            <button
              type="button"
              onClick={() => setGameState("lobby")}
              className="px-6 py-3 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Kembali ke Lobi Arena
            </button>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* 4. DEFEAT SCREEN */}
      {/* ==================================================================== */}
      {gameState === "defeat" && (
        <div className="bg-slate-900/95 border border-red-500/50 rounded-2xl p-8 text-center shadow-2xl space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center text-5xl shadow-2xl shadow-red-900/30">
            💀
          </div>

          <div>
            <h3 className="text-2xl md:text-3xl font-black text-red-400 mb-1">
              PERTAHANAN ANDA RUNTUH!
            </h3>
            <p className="text-slate-300 text-sm">
              {activeRival.name} ({activeRival.nim}) melancarkan {activeRival.specialJutsu} yang melumpuhkan pertahanan Anda.
            </p>
          </div>

          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Jangan berkecil hati! Pelajari kembali posisi partikel dan sambungan kata kerja di daftar modul IRODORI 文法, lalu kembali tantang rival kelas.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleStartBattle}
              className="px-6 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Coba Lagi
            </button>
            <button
              type="button"
              onClick={() => setGameState("lobby")}
              className="px-6 py-3 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              Kembali ke Lobi Arena
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
