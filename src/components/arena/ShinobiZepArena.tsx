"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Swords,
  Shield,
  Heart,
  Clock,
  Trophy,
  Flame,
  Sparkles,
  Zap,
  RotateCcw,
  ArrowLeft,
  Users,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ParsedQuestion } from "@/lib/quizParsers";
import { VillageEnvironment, VILLAGE_ENVIRONMENTS } from "./ShinobiQuizCreatorStudio";
import { addXp, unlockBadge } from "@/lib/gamification";
import { sfx } from "@/lib/soundEffects";

interface ShinobiZepArenaProps {
  questions: ParsedQuestion[];
  village: VillageEnvironment;
  roundsCount?: number;
  hpDamage?: number;
  timeLimit?: number;
  onExit: () => void;
}

interface ShinobiAvatar {
  id: string;
  name: string;
  avatarIcon: string;
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  hp: number;
  isAlive: boolean;
  isBot: boolean;
  targetX?: number;
  targetY?: number;
}

export default function ShinobiZepArena({
  questions,
  village,
  roundsCount = 10,
  hpDamage = 10,
  timeLimit = 15,
  onExit,
}: ShinobiZepArenaProps) {
  // Game State
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [phase, setPhase] = useState<"reading" | "countdown" | "jutsu_strike" | "round_result" | "game_over" | "victory">("reading");
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [userHp, setUserHp] = useState<number>(100);
  const [score, setScore] = useState<number>(0);

  // Player & Bots Coordinates
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [bots, setBots] = useState<ShinobiAvatar[]>([]);

  // Current Question
  const activeQuestions = questions.slice(0, roundsCount);
  const currentQ = activeQuestions[currentRoundIdx] || activeQuestions[0];
  const isOx = currentQ?.type === "ox";

  // Jutsu Attack Visual Effect Trigger
  const [strikeActive, setStrikeActive] = useState<boolean>(false);
  const [strikeResult, setStrikeResult] = useState<{ isPlayerCorrect: boolean; correctZone: string } | null>(null);

  // Arena Ref
  const arenaRef = useRef<HTMLDivElement>(null);

  // Inisialisasi Shinobi Bots (Rival dari Desa Ninja)
  useEffect(() => {
    const initialBots: ShinobiAvatar[] = [
      { id: "bot_1", name: "Sasuke", avatarIcon: "🦅", x: 40, y: 40, hp: 100, isAlive: true, isBot: true },
      { id: "bot_2", name: "Sakura", avatarIcon: "🌸", x: 60, y: 40, hp: 100, isAlive: true, isBot: true },
      { id: "bot_3", name: "Kakashi", avatarIcon: "⚡", x: 40, y: 60, hp: 100, isAlive: true, isBot: true },
      { id: "bot_4", name: "Shikamaru", avatarIcon: "♟️", x: 60, y: 60, hp: 100, isAlive: true, isBot: true },
      { id: "bot_5", name: "Gaara", avatarIcon: "⏳", x: 50, y: 35, hp: 100, isAlive: true, isBot: true },
    ];
    setBots(initialBots);
  }, [village]);

  // Keyboard Movement Listener (W, A, S, D & Tombol Panah)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === "game_over" || phase === "victory") return;

      const step = 4; // step movement percentage
      const key = e.key.toLowerCase();

      setPlayerPos((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (key === "arrowup" || key === "w") newY = Math.max(8, prev.y - step);
        if (key === "arrowdown" || key === "s") newY = Math.min(92, prev.y + step);
        if (key === "arrowleft" || key === "a") newX = Math.max(8, prev.x - step);
        if (key === "arrowright" || key === "d") newX = Math.min(92, prev.x + step);

        return { x: newX, y: newY };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase]);

  // Mouse / Touch Tap-to-Move
  const handleArenaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (phase === "game_over" || phase === "victory") return;
    if (!arenaRef.current) return;

    const rect = arenaRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setPlayerPos({
      x: Math.max(8, Math.min(92, clickX)),
      y: Math.max(8, Math.min(92, clickY)),
    });
  };

  // Hitung di zona mana pemain / bot berada
  const getZone = (x: number, y: number, isOxMode: boolean) => {
    if (isOxMode) {
      // Split kiri (O) dan kanan (X)
      return x < 50 ? "a" : "b";
    } else {
      // 4 Kuadran
      // A = Kiri Atas (Utara)
      // B = Kanan Atas (Timur)
      // C = Kiri Bawah (Selatan)
      // D = Kanan Bawah (Barat)
      if (x < 50 && y < 50) return "a";
      if (x >= 50 && y < 50) return "b";
      if (x < 50 && y >= 50) return "c";
      return "d";
    }
  };

  // Timer Countdown Per Ronde
  useEffect(() => {
    if (phase !== "countdown") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          executeJutsuStrike();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // Bot Random Movement AI
  useEffect(() => {
    if (phase !== "countdown") return;

    const botInterval = setInterval(() => {
      setBots((prevBots) =>
        prevBots.map((bot) => {
          if (!bot.isAlive) return bot;

          // Kecerdasan bot: 70% peluang menuju zona benar, 30% random
          const isSmart = Math.random() < 0.75;
          let targetX = bot.x;
          let targetY = bot.y;

          if (isSmart && currentQ) {
            const correctKey = currentQ.answerKey;
            if (isOx) {
              targetX = correctKey === "a" ? 25 + Math.random() * 20 : 75 + Math.random() * 20;
              targetY = 20 + Math.random() * 60;
            } else {
              if (correctKey === "a") { targetX = 25; targetY = 25; }
              else if (correctKey === "b") { targetX = 75; targetY = 25; }
              else if (correctKey === "c") { targetX = 25; targetY = 75; }
              else { targetX = 75; targetY = 75; }
            }
          } else {
            targetX = Math.max(15, Math.min(85, bot.x + (Math.random() * 30 - 15)));
            targetY = Math.max(15, Math.min(85, bot.y + (Math.random() * 30 - 15)));
          }

          return { ...bot, x: targetX, y: targetY };
        })
      );
    }, 1200);

    return () => clearInterval(botInterval);
  }, [phase, currentQ, isOx]);

  // Memulai Ronde Baru
  const startRound = (roundIdx: number) => {
    if (roundIdx >= activeQuestions.length) {
      // Victory!
      setPhase("victory");
      addXp(200);
      unlockBadge("arena_champion");
      sfx.playVictory();
      return;
    }

    setCurrentRoundIdx(roundIdx);
    setTimeLeft(timeLimit);
    setStrikeActive(false);
    setStrikeResult(null);

    // Kembalikan posisi awal ninja ke tengah arena
    setPlayerPos({ x: 50, y: 55 });
    setBots((prev) =>
      prev.map((b) => ({
        ...b,
        x: 40 + Math.random() * 20,
        y: 40 + Math.random() * 20,
      }))
    );

    setPhase("countdown");
  };

  // Saat pertama kali load
  useEffect(() => {
    startRound(0);
  }, []);

  // Eksekusi Serangan Jutsu Desa saat Waktu Habis
  const executeJutsuStrike = () => {
    setPhase("jutsu_strike");
    setStrikeActive(true);
    sfx.playBlast();

    const playerZone = getZone(playerPos.x, playerPos.y, isOx);
    const correctZone = currentQ.answerKey;
    const isPlayerCorrect = playerZone === correctZone;

    setStrikeResult({ isPlayerCorrect, correctZone });

    // Update HP Player
    if (isPlayerCorrect) {
      setScore((prev) => prev + 10);
      sfx.playCorrect();
    } else {
      setUserHp((prev) => Math.max(0, prev - hpDamage));
      sfx.playWrong();
    }

    // Update HP Bots
    setBots((prevBots) =>
      prevBots.map((bot) => {
        if (!bot.isAlive) return bot;
        const botZone = getZone(bot.x, bot.y, isOx);
        const isBotCorrect = botZone === correctZone;
        const newHp = isBotCorrect ? bot.hp : Math.max(0, bot.hp - hpDamage);
        return {
          ...bot,
          hp: newHp,
          isAlive: newHp > 0,
        };
      })
    );

    // Cek Game Over atau lanjut ronde setelah jeda visual
    setTimeout(() => {
      setUserHp((currentHp) => {
        if (currentHp <= 0) {
          setPhase("game_over");
        } else {
          setPhase("round_result");
        }
        return currentHp;
      });
    }, 2800);
  };

  const handleNextRound = () => {
    startRound(currentRoundIdx + 1);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col font-sans select-none overflow-hidden ${village.bgGradient} text-white`}>
      {/* ========================================================
          1. HEADER ATAS (STATUS DESA, HP, RONDE & TIMER)
          ======================================================== */}
      <header className="px-4 py-3 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-20">
        {/* Kiri: Nama Desa & Tombol Keluar */}
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-rose-300 hover:text-white transition flex items-center gap-1 text-xs font-black"
          >
            <ArrowLeft className="w-4 h-4" /> Keluar
          </button>
          <div className="h-4 w-px bg-white/20" />
          <div>
            <div className="text-xs font-black text-amber-300 flex items-center gap-1.5">
              <span>{village.name}</span>
              <span className="text-[10px] text-white/70 font-normal">({village.jpName})</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-bold">{village.element}</div>
          </div>
        </div>

        {/* Tengah: Timer & Ronde */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-white/70 uppercase">Ronde</span>
            <span className="text-sm font-black text-amber-300">
              {currentRoundIdx + 1} / {activeQuestions.length}
            </span>
          </div>

          <div className={`px-4 py-1.5 rounded-2xl border font-mono text-base font-black flex items-center gap-2 shadow-inner ${
            timeLeft <= 3 ? "bg-rose-600 text-white animate-pulse border-amber-300" : "bg-black/50 border-amber-400/40 text-amber-300"
          }`}>
            <Clock className="w-4 h-4" />
            <span>00:{timeLeft.toString().padStart(2, "0")}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-white/70 uppercase">Skor</span>
            <span className="text-sm font-black text-emerald-300">{score}</span>
          </div>
        </div>

        {/* Kanan: HP Bar Peserta */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <div className="text-xs font-black text-white flex items-center gap-1">
              <Heart className={`w-3.5 h-3.5 fill-rose-500 text-rose-500 ${userHp <= 20 ? "animate-ping" : ""}`} />
              <span>Chakra HP: {userHp}/100</span>
            </div>
            <div className="w-32 h-2.5 bg-black/60 rounded-full border border-white/20 overflow-hidden mt-1 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  userHp > 50 ? "bg-gradient-to-r from-emerald-500 to-green-400" : userHp > 20 ? "bg-amber-400" : "bg-rose-600 animate-pulse"
                }`}
                style={{ width: `${userHp}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          2. BANNER PERTANYAAN RESMI
          ======================================================== */}
      {currentQ && (
        <div className="px-4 py-2.5 bg-black/80 border-b border-amber-400/30 text-center z-10 shadow-lg flex flex-col items-center justify-center">
          <span className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
            {isOx ? "⛩️ ARENA CLASH: GERBANG BENAR (O) vs SALAH (X)" : "⛩️ ARENA 4 GERBANG PENJURU (A / B / C / D)"}
          </span>
          <h3 className="text-sm sm:text-base font-black text-white mt-0.5 max-w-3xl leading-snug">
            {currentQ.questionText}
          </h3>
        </div>
      )}

      {/* ========================================================
          3. CANVAS ARENA 2D VIRTUAL (ZEP CLONE INTERAKTIF)
          ======================================================== */}
      <div
        ref={arenaRef}
        onClick={handleArenaClick}
        className="flex-1 relative overflow-hidden cursor-crosshair select-none bg-[#090b10] border-4 border-amber-900/60 m-2 sm:m-4 rounded-3xl shadow-2xl"
      >
        {/* GRID PEMBAGI ZONA JAWABAN */}
        {isOx ? (
          /* MODE O / X (KIRI = O, KANAN = X) */
          <div className="absolute inset-0 grid grid-cols-2">
            {/* Sisi Kiri: O (Maru / Benar) */}
            <div className={`p-4 flex flex-col items-center justify-between border-r-4 border-dashed border-white/30 transition-all duration-700 ${
              strikeActive && currentQ.answerKey !== "a"
                ? "bg-rose-950/90 shadow-[inset_0_0_80px_rgba(244,63,94,0.8)]"
                : strikeActive && currentQ.answerKey === "a"
                ? "bg-emerald-950/90 shadow-[inset_0_0_80px_rgba(16,185,129,0.8)] ring-4 ring-emerald-400"
                : "bg-emerald-950/20 hover:bg-emerald-950/30"
            }`}>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-black text-xs">
                <span>⭕ GERBANG O (BENAR)</span>
              </div>
              <div className="text-center font-black text-sm text-white/90 bg-black/60 px-4 py-2 rounded-2xl border border-emerald-500/30 max-w-xs shadow-lg">
                {currentQ.optionA}
              </div>
              <div className="text-emerald-400/20 font-black text-8xl select-none pointer-events-none">O</div>
            </div>

            {/* Sisi Kanan: X (Batsu / Salah) */}
            <div className={`p-4 flex flex-col items-center justify-between transition-all duration-700 ${
              strikeActive && currentQ.answerKey !== "b"
                ? "bg-rose-950/90 shadow-[inset_0_0_80px_rgba(244,63,94,0.8)]"
                : strikeActive && currentQ.answerKey === "b"
                ? "bg-emerald-950/90 shadow-[inset_0_0_80px_rgba(16,185,129,0.8)] ring-4 ring-emerald-400"
                : "bg-rose-950/20 hover:bg-rose-950/30"
            }`}>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 font-black text-xs">
                <span>❌ GERBANG X (SALAH)</span>
              </div>
              <div className="text-center font-black text-sm text-white/90 bg-black/60 px-4 py-2 rounded-2xl border border-rose-500/30 max-w-xs shadow-lg">
                {currentQ.optionB}
              </div>
              <div className="text-rose-400/20 font-black text-8xl select-none pointer-events-none">X</div>
            </div>
          </div>
        ) : (
          /* MODE 4 GERBANG (A / B / C / D) */
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
            {/* Kuadran A (Kiri Atas / Gerbang Utara) */}
            <div className={`p-4 border-r-2 border-b-2 border-white/20 flex flex-col justify-between transition-all duration-700 ${
              strikeActive && currentQ.answerKey !== "a"
                ? "bg-rose-950/90 shadow-[inset_0_0_60px_rgba(244,63,94,0.8)]"
                : strikeActive && currentQ.answerKey === "a"
                ? "bg-emerald-950/90 shadow-[inset_0_0_60px_rgba(16,185,129,0.8)] ring-4 ring-emerald-400"
                : "bg-black/30 hover:bg-black/40"
            }`}>
              <span className="font-black text-xs text-amber-300 px-2 py-0.5 rounded bg-black/50 border border-amber-400/40 w-fit">
                [A] GERBANG UTARA
              </span>
              <div className="font-bold text-xs text-white bg-black/60 p-2 rounded-xl border border-white/10 max-w-xs">
                {currentQ.optionA}
              </div>
            </div>

            {/* Kuadran B (Kanan Atas / Gerbang Timur) */}
            <div className={`p-4 border-b-2 border-white/20 flex flex-col justify-between items-end transition-all duration-700 ${
              strikeActive && currentQ.answerKey !== "b"
                ? "bg-rose-950/90 shadow-[inset_0_0_60px_rgba(244,63,94,0.8)]"
                : strikeActive && currentQ.answerKey === "b"
                ? "bg-emerald-950/90 shadow-[inset_0_0_60px_rgba(16,185,129,0.8)] ring-4 ring-emerald-400"
                : "bg-black/30 hover:bg-black/40"
            }`}>
              <span className="font-black text-xs text-amber-300 px-2 py-0.5 rounded bg-black/50 border border-amber-400/40 w-fit">
                [B] GERBANG TIMUR
              </span>
              <div className="font-bold text-xs text-white bg-black/60 p-2 rounded-xl border border-white/10 max-w-xs text-right">
                {currentQ.optionB}
              </div>
            </div>

            {/* Kuadran C (Kiri Bawah / Gerbang Selatan) */}
            <div className={`p-4 border-r-2 border-white/20 flex flex-col justify-between transition-all duration-700 ${
              strikeActive && currentQ.answerKey !== "c"
                ? "bg-rose-950/90 shadow-[inset_0_0_60px_rgba(244,63,94,0.8)]"
                : strikeActive && currentQ.answerKey === "c"
                ? "bg-emerald-950/90 shadow-[inset_0_0_60px_rgba(16,185,129,0.8)] ring-4 ring-emerald-400"
                : "bg-black/30 hover:bg-black/40"
            }`}>
              <div className="font-bold text-xs text-white bg-black/60 p-2 rounded-xl border border-white/10 max-w-xs">
                {currentQ.optionC || "Pilihan C"}
              </div>
              <span className="font-black text-xs text-amber-300 px-2 py-0.5 rounded bg-black/50 border border-amber-400/40 w-fit">
                [C] GERBANG SELATAN
              </span>
            </div>

            {/* Kuadran D (Kanan Bawah / Gerbang Barat) */}
            <div className={`p-4 flex flex-col justify-between items-end transition-all duration-700 ${
              strikeActive && currentQ.answerKey !== "d"
                ? "bg-rose-950/90 shadow-[inset_0_0_60px_rgba(244,63,94,0.8)]"
                : strikeActive && currentQ.answerKey === "d"
                ? "bg-emerald-950/90 shadow-[inset_0_0_60px_rgba(16,185,129,0.8)] ring-4 ring-emerald-400"
                : "bg-black/30 hover:bg-black/40"
            }`}>
              <div className="font-bold text-xs text-white bg-black/60 p-2 rounded-xl border border-white/10 max-w-xs text-right">
                {currentQ.optionD || "Pilihan D"}
              </div>
              <span className="font-black text-xs text-amber-300 px-2 py-0.5 rounded bg-black/50 border border-amber-400/40 w-fit">
                [D] GERBANG BARAT
              </span>
            </div>
          </div>
        )}

        {/* LINGKARAN TENGAH (NEUTRAL ZONE / CHUUNIN ARENA LOGO) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full border-2 border-white/10 flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-16 h-16 rounded-full border border-amber-400/30 flex items-center justify-center text-amber-300/40 font-black text-xs">
            忍
          </div>
        </div>

        {/* EFEK SERANGAN JUTSU DESA SAAT WAKTU HABIS */}
        {strikeActive && (
          <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center animate-in zoom-in-75 duration-300">
            <div className="p-4 rounded-3xl bg-black/80 border-2 border-amber-400 shadow-2xl flex flex-col items-center text-center gap-1.5 animate-bounce">
              <span className="text-sm font-black text-amber-300 uppercase tracking-widest flex items-center gap-2">
                <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
                {village.jutsuName} AKTIF!
              </span>
              <span className="text-xs text-white/90 font-bold max-w-md">
                {village.jutsuDesc}
              </span>
              <div className={`mt-2 px-4 py-1 rounded-full text-xs font-black ${
                strikeResult?.isPlayerCorrect ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
              }`}>
                {strikeResult?.isPlayerCorrect
                  ? "✓ Anda Berdiri di Zona Aman (+10 Poin!)"
                  : `⚠️ Anda Terkena Serangan Jutsu (-${hpDamage} HP!)`}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            AVATAR SHINOBI BOTS
            ======================================================== */}
        {bots.map((bot) => {
          if (!bot.isAlive) return null;
          return (
            <div
              key={bot.id}
              className="absolute transition-all duration-700 ease-out z-10 flex flex-col items-center pointer-events-none"
              style={{ left: `${bot.x}%`, top: `${bot.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-black/70 text-amber-300 border border-white/20 whitespace-nowrap shadow">
                {bot.name} ({bot.hp}HP)
              </span>
              <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-amber-400 flex items-center justify-center text-lg shadow-lg">
                {bot.avatarIcon}
              </div>
            </div>
          );
        })}

        {/* ========================================================
            AVATAR UTAMA PEMAIN (PLAYER NINJA)
            ======================================================== */}
        <div
          className="absolute transition-all duration-150 ease-out z-20 flex flex-col items-center pointer-events-none"
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-stone-950 shadow-md whitespace-nowrap">
            <span>YOU (Shinobi)</span>
          </div>
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-600 to-amber-500 border-2 border-white flex items-center justify-center text-xl shadow-[0_0_15px_#f59e0b] animate-pulse">
            🥷
          </div>
          {/* Target Shadow */}
          <div className="w-8 h-2 rounded-full bg-black/50 blur-[2px] mt-0.5" />
        </div>
      </div>

      {/* ========================================================
          4. FOOTER: CONTROLLER & PANDUAN KONTROL
          ======================================================== */}
      <footer className="px-4 py-2.5 bg-black/70 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/80 z-20">
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-300">🎮 Kontrol Gerak:</span>
          <span>Gunakan <strong>WASD / Tombol Panah</strong> atau <strong>Klik Langsung pada Zona</strong> di layar untuk berpindah.</span>
        </div>

        {/* Virtual On-screen D-Pad untuk Mobile */}
        <div className="flex items-center gap-1.5 sm:hidden">
          <button
            onClick={() => setPlayerPos((prev) => ({ ...prev, y: Math.max(8, prev.y - 8) }))}
            className="w-8 h-8 rounded-lg bg-white/20 font-black"
          >
            ▲
          </button>
          <button
            onClick={() => setPlayerPos((prev) => ({ ...prev, x: Math.max(8, prev.x - 8) }))}
            className="w-8 h-8 rounded-lg bg-white/20 font-black"
          >
            ◀
          </button>
          <button
            onClick={() => setPlayerPos((prev) => ({ ...prev, y: Math.min(92, prev.y + 8) }))}
            className="w-8 h-8 rounded-lg bg-white/20 font-black"
          >
            ▼
          </button>
          <button
            onClick={() => setPlayerPos((prev) => ({ ...prev, x: Math.min(92, prev.x + 8) }))}
            className="w-8 h-8 rounded-lg bg-white/20 font-black"
          >
            ▶
          </button>
        </div>
      </footer>

      {/* ========================================================
          MODAL: ROUND RESULT (JEDA ANTAR RONDE)
          ======================================================== */}
      {phase === "round_result" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="clay-card p-6 sm:p-8 max-w-md w-full border border-amber-400/40 shadow-2xl flex flex-col gap-4 text-center bg-[#1c060d]">
            <h3 className="text-lg font-black text-amber-300 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Hasil Ronde #{currentRoundIdx + 1}
            </h3>

            <div className={`p-4 rounded-2xl border ${
              strikeResult?.isPlayerCorrect ? "bg-emerald-950/60 border-emerald-500" : "bg-rose-950/60 border-rose-500"
            }`}>
              <div className="text-sm font-black text-white">
                {strikeResult?.isPlayerCorrect ? "✅ Jawaban Anda Tepat!" : "❌ Anda Berdiri di Zona yang Salah!"}
              </div>
              <div className="text-xs text-amber-300 font-bold mt-1">
                Kunci Jawaban Benar: Zona {strikeResult?.correctZone.toUpperCase()}
              </div>
              {currentQ.explanation && (
                <p className="text-xs text-rose-200/90 mt-2 font-medium leading-relaxed">
                  {currentQ.explanation}
                </p>
              )}
            </div>

            <button
              onClick={handleNextRound}
              className="w-full py-3 clay-btn-gold rounded-xl font-black text-xs text-stone-950 shadow-lg uppercase tracking-wider"
            >
              Lanjut ke Ronde #{currentRoundIdx + 2} ➔
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: GAME OVER (CHAKRA HP HABIS)
          ======================================================== */}
      {phase === "game_over" && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="clay-card p-6 sm:p-8 max-w-md w-full border border-rose-500 shadow-2xl flex flex-col items-center text-center gap-4 bg-[#23050c]">
            <div className="w-16 h-16 rounded-full bg-rose-600/30 border border-rose-500 flex items-center justify-center text-3xl">
              💀
            </div>
            <h2 className="text-xl font-black text-rose-400">Shinobi Gugur di Medan Laga!</h2>
            <p className="text-xs text-rose-200/90 leading-relaxed">
              Chakra HP Anda habis akibat serangan jutsu {village.name}. Terus berlatih agar mampu menembus ujian Chuunin!
            </p>
            <div className="p-3 rounded-xl bg-black/50 border border-rose-900 w-full text-xs font-bold text-white flex justify-between">
              <span>Ronde Bertahan: {currentRoundIdx + 1}/{activeQuestions.length}</span>
              <span>Skor Akhir: {score}</span>
            </div>
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => {
                  setUserHp(100);
                  setScore(0);
                  startRound(0);
                }}
                className="flex-1 py-3 clay-btn rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Ulangi Arena
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: VICTORY (BERTAHAN HINGGA AKHIR)
          ======================================================== */}
      {phase === "victory" && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="clay-card p-6 sm:p-8 max-w-md w-full border border-amber-400 shadow-2xl flex flex-col items-center text-center gap-4 bg-gradient-to-b from-[#2a0b14] to-[#1c050b]">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center text-4xl shadow-xl animate-bounce">
              👑
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-300">SELAMAT! ANDA JUARA ARENA SHINOBI!</h2>
              <p className="text-xs text-emerald-400 font-bold mt-1">
                Lulus Bertahan Melintasi {activeQuestions.length} Ronde di {village.name}!
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-black/60 border border-amber-400/40 w-full flex flex-col gap-2 text-xs">
              <div className="flex justify-between font-bold text-white">
                <span>Total Skor Diperoleh:</span>
                <span className="text-amber-300 font-black">{score}</span>
              </div>
              <div className="flex justify-between font-bold text-white">
                <span>Sisa Chakra HP:</span>
                <span className="text-emerald-400 font-black">{userHp}%</span>
              </div>
              <div className="flex justify-between font-bold text-white">
                <span>Bonus XP Diberikan:</span>
                <span className="text-amber-400 font-black">+200 XP Shinobi</span>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => {
                  setUserHp(100);
                  setScore(0);
                  startRound(0);
                }}
                className="flex-1 py-3 clay-btn-gold rounded-xl font-black text-xs text-stone-950 shadow-lg flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Main Lagi
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs"
              >
                Kembali ke Hub
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
