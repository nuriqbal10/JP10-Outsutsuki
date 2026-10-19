"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Swords,
  Users,
  Crown,
  Shield,
  Zap,
  Flame,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Trophy,
  Heart,
  Skull,
  Radio,
  Clock,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { addXp } from "@/lib/gamification";
import { advanceDailyQuest } from "@/lib/dailyQuests";
import { sfx } from "@/lib/soundEffects";

export type BattleMode = "1vs1" | "group" | "all_members";

interface Combatant {
  id: string;
  name: string;
  avatar: string;
  maxHp: number;
  hp: number;
  team?: "shinobi" | "samurai";
  isUser?: boolean;
  isEliminated: boolean;
  score: number;
  lastAction?: string;
}

interface BattleQuestion {
  ja: string;
  romaji?: string;
  correct: string;
  options: string[];
}

const BATTLE_QUESTIONS: BattleQuestion[] = [
  { ja: "残業 (ざんぎょう)", romaji: "zangyou", correct: "Kerja lembur", options: ["Kerja lembur", "Shift malam", "Cuti tahunan", "Tepat waktu"] },
  { ja: "避難所 (ひなんじょ)", romaji: "hinanjo", correct: "Tempat evakuasi darurat", options: ["Tempat evakuasi darurat", "Halte bus", "Rumah sakit", "Kantor polisi"] },
  { ja: "分別 (ぶんべつ)", romaji: "bunbetsu", correct: "Pemilahan jenis sampah", options: ["Pemilahan jenis sampah", "Daur ulang", "Penghematan listrik", "Pembakaran sampah"] },
  { ja: "安全第一 (あんぜんだいいち)", romaji: "anzen daiichi", correct: "Utamakan keselamatan K3", options: ["Utamakan keselamatan K3", "Kerja cepat", "Waktu santai", "Aturan pakaian"] },
  { ja: "特定技能 (とくていぎのう)", romaji: "tokutei ginou", correct: "Pekerja Berketerampilan Spesifik (SSW)", options: ["Pekerja Berketerampilan Spesifik (SSW)", "Pelajar asing", "Turis", "Magang teknis"] },
  { ja: "体調 (たいちょう)", romaji: "taichou", correct: "Kondisi fisik kesehatan", options: ["Kondisi fisik kesehatan", "Suhu ruangan", "Berat barang", "Jadwal meeting"] },
  { ja: "締切 (しめきり)", romaji: "shimekiri", correct: "Batas waktu / deadline", options: ["Batas waktu / deadline", "Awal pembukaan", "Libur kerja", "Gaji bulanan"] },
  { ja: "粗大ゴミ (そだいごみ)", romaji: "sodaigomi", correct: "Sampah perabot / ukuran besar", options: ["Sampah perabot / ukuran besar", "Sampah dapur", "Botol plastik", "Kaleng minuman"] },
  { ja: "美容院 (びよういん)", romaji: "biyouin", correct: "Salon pangkas rambut", options: ["Salon pangkas rambut", "Rumah sakit", "Dry cleaning", "Toko pakaian"] },
  { ja: "点検 (てんけん)", romaji: "tenken", correct: "Pemeriksaan / inspeksi rutin", options: ["Pemeriksaan / inspeksi rutin", "Perbaikan mesin", "Pembersihan lantai", "Penggantian ban"] },
];

export default function BattleRoyaleModal({
  isOpen,
  onClose,
  initialMode = "1vs1",
}: {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: BattleMode;
}) {
  const [mode, setMode] = useState<BattleMode>(initialMode);
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [battleState, setBattleState] = useState<"lobby" | "in_battle" | "victory" | "defeat">("lobby");
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<BattleQuestion[]>([]);
  const [timeLeft, setTimeLeft] = useState(8);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Initialize combatants based on mode
  const setupCombatants = (selectedMode: BattleMode) => {
    if (selectedMode === "1vs1") {
      return [
        { id: "user", name: "Anda (Shinobi)", avatar: "🥷", maxHp: 100, hp: 100, isUser: true, isEliminated: false, score: 0 },
        { id: "rival", name: "Kenji Rival (Tokutei A2)", avatar: "👺", maxHp: 100, hp: 100, isEliminated: false, score: 0 },
      ];
    } else if (selectedMode === "group") {
      return [
        // Team Shinobi
        { id: "user", name: "Anda (Leader)", avatar: "👑", maxHp: 100, hp: 100, team: "shinobi" as const, isUser: true, isEliminated: false, score: 0 },
        { id: "ally1", name: "Rizky (SSW Kaigo)", avatar: "🌸", maxHp: 100, hp: 100, team: "shinobi" as const, isEliminated: false, score: 0 },
        // Team Samurai
        { id: "enemy1", name: "Yamada Sensei", avatar: "⚔️", maxHp: 100, hp: 100, team: "samurai" as const, isEliminated: false, score: 0 },
        { id: "enemy2", name: "Takeshi Bot", avatar: "🛡️", maxHp: 100, hp: 100, team: "samurai" as const, isEliminated: false, score: 0 },
      ];
    } else {
      // all_members: 6-player Battle Royale (Survival)
      return [
        { id: "user", name: "Anda (Shinobi)", avatar: "👑", maxHp: 100, hp: 100, isUser: true, isEliminated: false, score: 0 },
        { id: "p1", name: "Siti Rahma", avatar: "🦊", maxHp: 100, hp: 100, isEliminated: false, score: 0 },
        { id: "p2", name: "Budi Santoso", avatar: "⚡", maxHp: 100, hp: 100, isEliminated: false, score: 0 },
        { id: "p3", name: "Dewi Lestari", avatar: "🍃", maxHp: 100, hp: 100, isEliminated: false, score: 0 },
        { id: "p4", name: "Ahmad Fauzi", avatar: "🦅", maxHp: 100, hp: 100, isEliminated: false, score: 0 },
        { id: "p5", name: "Ryu Hazuki", avatar: "🔥", maxHp: 100, hp: 100, isEliminated: false, score: 0 },
      ];
    }
  };

  const handleStartBattle = (selectedMode: BattleMode) => {
    setMode(selectedMode);
    const readyCombatants = setupCombatants(selectedMode);
    setCombatants(readyCombatants);

    const questions = [...BATTLE_QUESTIONS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((q) => ({
        ...q,
        options: [...q.options].sort(() => 0.5 - Math.random()),
      }));

    setShuffledQuestions(questions);
    setCurrentQIndex(0);
    setTimeLeft(8);
    setSelectedAnswer(null);
    setBattleLog([`🔥 Pertandingan Mode ${selectedMode.toUpperCase()} Dimulai! Kalahkan lawanmu dengan ketepatan kosakata!`]);
    setBattleState("in_battle");
    sfx.playBlast();
  };

  // Turn timer loop
  useEffect(() => {
    if (battleState !== "in_battle" || selectedAnswer !== null) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleUserAnswer("__TIMEOUT__");
          return 0;
        }
        if (prev <= 3) {
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
  }, [battleState, currentQIndex, selectedAnswer]);

  const handleUserAnswer = (chosen: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(chosen);

    const q = shuffledQuestions[currentQIndex];
    const userIsCorrect = chosen === q.correct;

    if (userIsCorrect) {
      sfx.playSlash();
    } else {
      sfx.playWrong();
    }

    // Process Bot Turns & Damage Calculation
    setTimeout(() => {
      resolveTurnResults(userIsCorrect, chosen);
    }, 800);
  };

  const resolveTurnResults = (userIsCorrect: boolean, chosen: string) => {
    const q = shuffledQuestions[currentQIndex];
    const newLogs: string[] = [];

    setCombatants((prevCombatants) => {
      let updated = prevCombatants.map((c) => ({ ...c }));
      const user = updated.find((c) => c.isUser);

      if (user && !user.isEliminated) {
        if (userIsCorrect) {
          user.score += 20;
          newLogs.push(`⚔️ Anda menjawab BENAR! Melancarkan serangan Taijutsu (-35 HP lawan).`);
        } else {
          user.hp = Math.max(0, user.hp - (chosen === "__TIMEOUT__" ? 30 : 25));
          if (user.hp === 0) user.isEliminated = true;
          newLogs.push(`💥 Anda ${chosen === "__TIMEOUT__" ? "KEHABISAN WAKTU" : "SALAH JAWAB"}! Menerima serangan (-${chosen === "__TIMEOUT__" ? 30 : 25} HP).`);
        }
      }

      // Bots logic
      updated.forEach((c) => {
        if (c.isUser || c.isEliminated) return;
        // Bots have ~65% correct rate
        const botCorrect = Math.random() < 0.65;
        if (botCorrect) {
          c.score += 20;
          // In 1vs1, bot attacks user if user was wrong
          if (mode === "1vs1" && !userIsCorrect && user && !user.isEliminated) {
            user.hp = Math.max(0, user.hp - 15);
            if (user.hp === 0) user.isEliminated = true;
          }
        } else {
          // Bot takes damage from user's correct answer
          if (userIsCorrect) {
            const damage = mode === "all_members" ? 40 : 35;
            c.hp = Math.max(0, c.hp - damage);
            if (c.hp === 0) {
              c.isEliminated = true;
              sfx.playEliminated();
              newLogs.push(`💀 [${c.name}] Tereliminasi dari arena!`);
            }
          }
        }
      });

      return updated;
    });

    setBattleLog((prev) => [...newLogs, ...prev].slice(0, 6));

    // Next question or end battle
    setTimeout(() => {
      checkBattleOver();
    }, 1200);
  };

  const checkBattleOver = () => {
    const user = combatants.find((c) => c.isUser);
    const enemies = combatants.filter((c) => !c.isUser);
    const enemiesAlive = enemies.filter((c) => !c.isEliminated).length;

    if (user?.isEliminated) {
      setBattleState("defeat");
      sfx.playEliminated();
      return;
    }

    if (enemiesAlive === 0 || currentQIndex + 1 >= shuffledQuestions.length) {
      // User survived or completed all questions
      const userScore = user?.score || 0;
      const highestEnemy = Math.max(...enemies.map((e) => e.score), 0);

      if (userScore >= highestEnemy && !user?.isEliminated) {
        setBattleState("victory");
        sfx.playVictory();
        const earnedXp = mode === "all_members" ? 150 : mode === "group" ? 120 : 90;
        addXp(earnedXp, `Battle Royale (${mode})`);
        advanceDailyQuest("battle", 1);
      } else {
        setBattleState("defeat");
        sfx.playEliminated();
      }
      return;
    }

    // Advance to next question
    setCurrentQIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setTimeLeft(8);
  };

  if (!isOpen) return null;

  const currentQ = shuffledQuestions[currentQIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5">
      <div className="clay-card rounded-3xl p-5 sm:p-8 max-w-2xl w-full border border-rose-500/40 relative shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:opacity-100 opacity-60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= STEP 1: LOBBY ARENA ================= */}
        {battleState === "lobby" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-current/10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg">
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black">Battle Royale Shinobi Arena</h2>
                <p className="text-xs opacity-75">
                  Tanding kemampuan kosakata Jepang secara interaktif & menangkan kehormatan ninja!
                </p>
              </div>
            </div>

            {/* MODE SELECTOR TILES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1 vs 1 */}
              <button
                onClick={() => handleStartBattle("1vs1")}
                className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/15 hover:border-rose-500 hover:scale-105 transition text-left flex flex-col justify-between gap-3 group shadow"
              >
                <div>
                  <div className="text-2xl">⚔️</div>
                  <h3 className="font-black text-sm mt-2 text-rose-500">Duel 1 vs 1</h3>
                  <p className="text-[11px] opacity-70 mt-1">Tanding langsung melawan rival sekelas dalam 5 ronde cepat.</p>
                </div>
                <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md inline-block self-start">
                  +90 XP Reward
                </span>
              </button>

              {/* Group Battle */}
              <button
                onClick={() => handleStartBattle("group")}
                className="p-4 rounded-2xl border border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/15 hover:border-indigo-500 hover:scale-105 transition text-left flex flex-col justify-between gap-3 group shadow"
              >
                <div>
                  <div className="text-2xl">🛡️</div>
                  <h3 className="font-black text-sm mt-2 text-indigo-400">Tim Shinobi vs Samurai</h3>
                  <p className="text-[11px] opacity-70 mt-1">Bertarung bersama rekan tim 2 vs 2 memperebutkan skor kelompok.</p>
                </div>
                <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md inline-block self-start">
                  +120 XP Reward
                </span>
              </button>

              {/* All Members Survival */}
              <button
                onClick={() => handleStartBattle("all_members")}
                className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15 hover:border-amber-500 hover:scale-105 transition text-left flex flex-col justify-between gap-3 group shadow"
              >
                <div>
                  <div className="text-2xl">👑</div>
                  <h3 className="font-black text-sm mt-2 text-amber-500">Survival Seluruh Kelas</h3>
                  <p className="text-[11px] opacity-70 mt-1">6 Shinobi masuk, hanya 1 yang bertahan hingga akhir sebagai Juara!</p>
                </div>
                <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md inline-block self-start">
                  +150 XP Champion
                </span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/5 dark:bg-black/30 border border-current/10 text-xs flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Aturan Arena:</strong> Jawab dengan cepat & tepat. Jawaban benar menyerang lawan (-35 HP), jawaban salah atau waktu habis mengurangi HP kamu. Bertahanlah sampai akhir!
              </span>
            </div>
          </div>
        )}

        {/* ================= STEP 2: IN BATTLE ARENA ================= */}
        {battleState === "in_battle" && currentQ && (
          <div className="flex flex-col gap-5">
            {/* TOP ARENA HEADER */}
            <div className="flex items-center justify-between border-b border-current/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-rose-500">
                <Radio className="w-4 h-4 animate-pulse" />
                Mode: {mode === "1vs1" ? "Duel 1 vs 1" : mode === "group" ? "Tim Shinobi 2 vs 2" : "Survival 6 Member"}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-black text-amber-400">
                Ronde {currentQIndex + 1}/{shuffledQuestions.length}
              </div>
            </div>

            {/* COMBATANTS HP STATUS HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {combatants.map((c) => {
                const hpPercent = Math.max(0, Math.min(100, (c.hp / c.maxHp) * 100));
                return (
                  <div
                    key={c.id}
                    className={`p-2.5 rounded-2xl border transition relative ${
                      c.isEliminated
                        ? "opacity-35 bg-stone-900 border-stone-800 grayscale"
                        : c.isUser
                        ? "bg-amber-500/10 border-amber-400/50 shadow-md ring-1 ring-amber-400"
                        : "bg-black/5 dark:bg-black/30 border-current/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-xs font-black">
                      <div className="flex items-center gap-1.5 truncate">
                        <span>{c.avatar}</span>
                        <span className="truncate">{c.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-amber-400 font-bold">{c.score}pts</span>
                    </div>

                    {/* HP BAR */}
                    <div className="w-full mt-2">
                      <div className="flex justify-between text-[9px] font-bold opacity-70 mb-0.5">
                        <span className="flex items-center gap-0.5">
                          {c.isEliminated ? <Skull className="w-2.5 h-2.5 text-rose-500" /> : <Heart className="w-2.5 h-2.5 text-rose-500 fill-current" />}
                          HP
                        </span>
                        <span>{c.hp}/{c.maxHp}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-black/20 dark:bg-white/10 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            c.hp <= 30 ? "bg-rose-500" : "bg-gradient-to-r from-emerald-400 to-emerald-600"
                          }`}
                          style={{ width: `${hpPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TIMER BAR */}
            <div className="w-full">
              <div className="flex justify-between items-center text-xs font-black font-mono mb-1">
                <span className="flex items-center gap-1 text-stone-400">
                  <Clock className="w-3.5 h-3.5" /> Sisa Waktu Bertindak
                </span>
                <span className={timeLeft <= 3 ? "text-rose-500 animate-ping font-black text-sm" : "text-amber-400"}>
                  {timeLeft}s
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden border border-current/10">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    timeLeft <= 3 ? "bg-rose-500" : "bg-gradient-to-r from-rose-500 to-amber-500"
                  }`}
                  style={{ width: `${(timeLeft / 8) * 100}%` }}
                />
              </div>
            </div>

            {/* QUESTION CARD */}
            <div className="text-center py-5 bg-black/5 dark:bg-black/40 rounded-2xl border border-current/10">
              <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                Target Serangan Kosakata:
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-2 text-rose-500">
                {currentQ.ja}
              </h3>
              {currentQ.romaji && (
                <span className="text-xs opacity-60 font-mono mt-0.5 block">
                  [{currentQ.romaji}]
                </span>
              )}
            </div>

            {/* OPTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((opt, idx) => {
                let btnClass = "clay-btn p-3.5 rounded-xl text-xs font-bold text-left transition relative";
                if (selectedAnswer) {
                  if (opt === currentQ.correct) {
                    btnClass = "bg-emerald-600 text-white p-3.5 rounded-xl text-xs font-bold text-left shadow-lg scale-[1.02] border-2 border-emerald-300";
                  } else if (opt === selectedAnswer) {
                    btnClass = "bg-rose-600 text-white p-3.5 rounded-xl text-xs font-bold text-left border-2 border-rose-300";
                  } else {
                    btnClass = "opacity-35 clay-btn p-3.5 rounded-xl text-xs font-bold text-left";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleUserAnswer(opt)}
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

            {/* LIVE BATTLE LOG FEED */}
            <div className="p-3 rounded-2xl bg-black/10 dark:bg-black/50 border border-current/10 max-h-24 overflow-y-auto space-y-1 text-[11px] font-mono custom-scrollbar">
              {battleLog.map((log, i) => (
                <div key={i} className="opacity-80">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 3: VICTORY SCREEN ================= */}
        {battleState === "victory" && (
          <div className="text-center py-6 flex flex-col items-center gap-4 animate-in zoom-in-95">
            <div className="w-24 h-24 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-400/50 flex items-center justify-center text-5xl shadow-2xl animate-bounce">
              👑
            </div>
            <div>
              <span className="text-xs font-black uppercase text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                Kemenangan Mutlak!
              </span>
              <h2 className="text-3xl font-black mt-2">CHAMPION ARENA!</h2>
              <p className="text-xs opacity-75 mt-1 max-w-md">
                Selamat! Anda berhasil menumbangkan semua rival dan mengamankan gelar Ninja Terunggul di arena ini.
              </p>
              <div className="inline-block mt-3 px-5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-black uppercase tracking-wider">
                +{mode === "all_members" ? 150 : mode === "group" ? 120 : 90} XP Ditambahkan & Misi Harian Selesai!
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setBattleState("lobby")}
                className="clay-btn px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Mode Lain
              </button>
              <button
                onClick={onClose}
                className="clay-btn-gold px-7 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: DEFEAT SCREEN ================= */}
        {battleState === "defeat" && (
          <div className="text-center py-6 flex flex-col items-center gap-4 animate-in zoom-in-95">
            <div className="w-24 h-24 rounded-3xl bg-rose-500/20 text-rose-500 border border-rose-500/50 flex items-center justify-center text-5xl shadow-2xl">
              💀
            </div>
            <div>
              <span className="text-xs font-black uppercase text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30">
                Tereliminasi
              </span>
              <h2 className="text-3xl font-black mt-2">Jatuh di Medan Laga!</h2>
              <p className="text-xs opacity-75 mt-1 max-w-md">
                HP Anda terkuras habis oleh serangan lawan. Jangan menyerah, asah kembali kosakata Irodori dan balas kekalahanmu!
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => handleStartBattle(mode)}
                className="clay-btn px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Coba Lagi
              </button>
              <button
                onClick={onClose}
                className="clay-btn-gold px-7 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
              >
                Tutup Arena
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
