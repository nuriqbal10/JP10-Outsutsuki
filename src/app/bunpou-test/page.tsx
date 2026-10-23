"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Puzzle,
  RotateCcw,
  Check,
  CheckCircle2,
  XCircle,
  Volume2,
  Lightbulb,
  ArrowRight,
  Flame,
  Trophy,
  Layers,
  GitCompare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import rawBunpouData from "@/data/bunpouData.json";
import { BunpouItem, BunpouLevelFilter } from "@/types/bunpou";

const allBunpou: BunpouItem[] = rawBunpouData as BunpouItem[];

export default function BunpouTestPage() {
  const [selectedLevel, setSelectedLevel] = useState<BunpouLevelFilter>("all");
  const [selectedLesson, setSelectedLesson] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Gamification stats
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);

  // Filtered pool of questions
  const filteredItems = useMemo(() => {
    return allBunpou.filter((item) => {
      if (selectedLevel !== "all" && item.level !== selectedLevel) return false;
      if (selectedLesson !== "all" && item.lesson !== Number(selectedLesson)) return false;
      return true;
    });
  }, [selectedLevel, selectedLesson]);

  // Read URL search query safely on client mount without triggering SSR de-opt
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const targetId = params.get("id");
      if (targetId) {
        const idx = filteredItems.findIndex((b) => b.id === targetId);
        if (idx !== -1) {
          setCurrentIndex(idx);
        } else {
          const globalIdx = allBunpou.findIndex((b) => b.id === targetId);
          if (globalIdx !== -1) {
            setSelectedLevel("all");
            setSelectedLesson("all");
            setCurrentIndex(globalIdx);
          }
        }
      }
    }
  }, [filteredItems]);

  const currentItem: BunpouItem = filteredItems[currentIndex] || allBunpou[0];
  const puzzle = currentItem?.puzzle;

  // Puzzle State
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [puzzleStatus, setPuzzleStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showReference, setShowReference] = useState<boolean>(false);

  // Initialize/shuffle puzzle tokens whenever currentItem changes
  useEffect(() => {
    if (puzzle && puzzle.tokens) {
      const shuf = [...(puzzle.shuffledTokens || puzzle.tokens)];
      // Extra shuffle on client
      for (let i = shuf.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuf[i], shuf[j]] = [shuf[j], shuf[i]];
      }
      setAvailableTokens(shuf);
      setSelectedTokens([]);
      setPuzzleStatus("idle");
      setShowHint(false);
    }
  }, [currentItem?.id]);

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectToken = (token: string, index: number) => {
    const newAvail = [...availableTokens];
    newAvail.splice(index, 1);
    setAvailableTokens(newAvail);
    setSelectedTokens([...selectedTokens, token]);
    setPuzzleStatus("idle");
  };

  const handleUnselectToken = (token: string, index: number) => {
    const newSel = [...selectedTokens];
    newSel.splice(index, 1);
    setSelectedTokens(newSel);
    setAvailableTokens([...availableTokens, token]);
    setPuzzleStatus("idle");
  };

  const handleCheck = () => {
    if (!puzzle) return;
    const constructed = selectedTokens.join("").replace(/[、。！？\s]/g, "");
    const target = puzzle.sentence.replace(/[、。！？\s]/g, "");

    if (constructed === target) {
      setPuzzleStatus("correct");
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
      setCompletedCount((prev) => prev + 1);
      speak(puzzle.sentence);
    } else {
      setPuzzleStatus("incorrect");
      setStreak(0);
    }
  };

  const handleReset = () => {
    if (!puzzle) return;
    const shuf = [...puzzle.tokens];
    for (let i = shuf.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuf[i], shuf[j]] = [shuf[j], shuf[i]];
    }
    setAvailableTokens(shuf);
    setSelectedTokens([]);
    setPuzzleStatus("idle");
    setShowHint(false);
  };

  const handleRevealSolution = () => {
    if (!puzzle) return;
    setSelectedTokens([...puzzle.tokens]);
    setAvailableTokens([]);
    setPuzzleStatus("correct");
    setShowHint(true);
    speak(puzzle.sentence);
  };

  const handleNextQuestion = () => {
    if (currentIndex < filteredItems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredItems.length - 1);
    }
  };

  const availableLessons = useMemo(() => {
    let pool = allBunpou;
    if (selectedLevel !== "all") {
      pool = pool.filter((b) => b.level === selectedLevel);
    }
    return Array.from(new Set(pool.map((b) => b.lesson))).sort((a, b) => a - b);
  }, [selectedLevel]);

  const levelColor =
    currentItem.level === "a1"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
      : currentItem.level === "a2-1"
      ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30"
      : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 clay-card rounded-none border-x-0 border-t-0 border-b border-black/10 dark:border-white/10 px-4 sm:px-6 py-3.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/bunpou"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300 hover:text-amber-500 transition px-2.5 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Bunpou</span>
            </Link>
            <div className="h-4 w-px bg-black/10 dark:bg-white/10 hidden sm:block" />
            <h1 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
              <span className="text-indigo-500">🧩</span>
              <span>Mini Test: Kotoba Puzzle</span>
              <span className="hidden md:inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                Latihan Merangkai Kalimat
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* BODY CONTENT */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col gap-6 w-full">
        {/* TOP GAMIFICATION BAR */}
        <div className="clay-card p-4 rounded-2xl border border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400">
              <Trophy className="w-4 h-4" />
              <span>Skor: {score} XP</span>
            </div>

            <div className="h-4 w-px bg-black/10 dark:bg-white/10" />

            <div className="flex items-center gap-1 text-xs font-black text-rose-500">
              <Flame className="w-4 h-4 animate-bounce" />
              <span>Streak: {streak}x</span>
            </div>

            <div className="h-4 w-px bg-black/10 dark:bg-white/10 hidden sm:block" />

            <div className="text-xs font-bold text-stone-500 hidden sm:block">
              Selesai: {completedCount} Soal
            </div>
          </div>

          {/* PROGRESS PILL */}
          <div className="text-xs font-bold text-stone-600 dark:text-stone-300">
            Soal <strong className="text-stone-900 dark:text-stone-100">{currentIndex + 1}</strong> dari {filteredItems.length}
          </div>
        </div>

        {/* FILTER CONTROLS */}
        <div className="clay-card p-3.5 sm:p-4 rounded-2xl border border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value as any);
                setSelectedLesson("all");
                setCurrentIndex(0);
              }}
              className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              <option value="all">Semua Buku (264)</option>
              <option value="a1">入門 A1 (82)</option>
              <option value="a2-1">初級1 A2.1 (95)</option>
              <option value="a2-2">初級2 A2.2 (87)</option>
            </select>

            {/* Lesson Filter */}
            <select
              value={selectedLesson}
              onChange={(e) => {
                setSelectedLesson(e.target.value);
                setCurrentIndex(0);
              }}
              className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
            >
              <option value="all">Semua Bab</option>
              {availableLessons.map((l) => (
                <option key={l} value={l}>
                  Bab {l}
                </option>
              ))}
            </select>
          </div>

          {/* Jump Directly to Pattern */}
          <select
            value={currentItem.id}
            onChange={(e) => {
              const idx = filteredItems.findIndex((b) => b.id === e.target.value);
              if (idx !== -1) setCurrentIndex(idx);
            }}
            className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer max-w-[220px] truncate"
          >
            {filteredItems.map((b, i) => (
              <option key={b.id} value={b.id}>
                {i + 1}. [{b.levelJapanese} Bab {b.lesson}] {b.pattern.split(/[\r\n]+/)[0]}
              </option>
            ))}
          </select>
        </div>

        {/* MAIN TEST CARD */}
        <div className="clay-card p-5 sm:p-8 rounded-3xl border border-indigo-500/30 shadow-xl space-y-6 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5">
          {/* Pattern Information Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 dark:border-white/10 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-xs ${levelColor}`}>
                {currentItem.levelJapanese} ({currentItem.level.toUpperCase()})
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-stone-500/10 border border-current/15 text-stone-700 dark:text-stone-300">
                第{currentItem.lesson}課 • Bab {currentItem.lesson} {currentItem.num}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-stone-200/50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400">
                {currentItem.topic}
              </span>
            </div>

            <Link
              href={`/bunpou#${currentItem.id}`}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              Lihat di Daftar Bunpou ›
            </Link>
          </div>

          {/* Pola Kalimat & Arti */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
              Pola Tata Bahasa Yang Diuji:
            </div>
            <div className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white font-sans">
              {currentItem.pattern.split(/[\r\n]+/)[0]}
            </div>
            {currentItem.meaning && (
              <div className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400">
                💡 {currentItem.meaning}
              </div>
            )}
          </div>

          {/* Target Translation / Meaning of Puzzle */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-1">
            <div className="text-[11px] font-black uppercase text-indigo-700 dark:text-indigo-300 tracking-wider flex items-center justify-between">
              <span>Target Arti Kalimat:</span>
              <span className="text-[10px] text-stone-500 font-normal">
                Susun kata & partikel di bawah agar membentuk kalimat ini
              </span>
            </div>
            <div className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100">
              &ldquo;{puzzle?.translation}&rdquo;
            </div>
          </div>

          {/* USER ASSEMBLED SENTENCE DROPZONE */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
              <span>Susunan Kalimat Anda:</span>
              {selectedTokens.length > 0 && (
                <span className="text-[10px] text-stone-400">
                  (Klik kepingan untuk membatalkan)
                </span>
              )}
            </div>

            <div
              className={`min-h-[70px] sm:min-h-[80px] p-3 sm:p-4 rounded-2xl border flex flex-wrap items-center gap-2 transition ${
                puzzleStatus === "correct"
                  ? "bg-emerald-500/10 border-emerald-500/50 ring-2 ring-emerald-500/30 shadow-md shadow-emerald-500/10"
                  : puzzleStatus === "incorrect"
                  ? "bg-rose-500/10 border-rose-500/50 ring-2 ring-rose-500/30"
                  : "bg-white dark:bg-stone-900/90 border-indigo-500/30 shadow-inner"
              }`}
            >
              {selectedTokens.length === 0 ? (
                <span className="text-stone-400 text-xs sm:text-sm italic mx-auto">
                  Ketuk kepingan kata & partikel di bawah untuk menyusun kalimat...
                </span>
              ) : (
                selectedTokens.map((tok, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUnselectToken(tok, idx)}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-rose-600 text-white font-extrabold text-sm sm:text-base shadow-sm hover:scale-105 active:scale-95 transition flex items-center gap-1.5 group/chip animate-in fade-in zoom-in-95 duration-150"
                    title="Klik untuk kembalikan ke tumpukan"
                  >
                    <span>{tok}</span>
                    <span className="text-xs opacity-70 group-hover/chip:opacity-100">✕</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* FEEDBACK STATUS ALERT */}
          {puzzleStatus === "correct" && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                <span>🎉 Luar Biasa! Susunan kalimat tepat dan sempurna! (+10 XP)</span>
              </div>
              <button
                onClick={() => puzzle && speak(puzzle.sentence)}
                className="p-2 rounded-xl bg-emerald-500 text-white hover:scale-105 transition shrink-0"
                title="Dengarkan pelafalan audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          )}

          {puzzleStatus === "incorrect" && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center gap-2 text-xs sm:text-sm font-black text-rose-700 dark:text-rose-300 animate-in fade-in shake">
              <XCircle className="w-5 h-5 shrink-0 text-rose-500" />
              <span>Susunan masih belum pas. Perhatikan posisi partikel dan kata kerjanya!</span>
            </div>
          )}

          {/* POOL OF SCRAMBLED WORDS & PARTICLES */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
              <span>Kepingan Kata & Partikel ({availableTokens.length}):</span>
              <span className="text-[10px] text-stone-400">
                Setiap kata dan partikel telah dipisahkan
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 min-h-[50px] p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
              {availableTokens.map((tok, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectToken(tok, idx)}
                  className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-extrabold text-sm sm:text-base border border-stone-200 dark:border-stone-700 shadow-sm hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:scale-105 active:scale-95 transition"
                >
                  {tok}
                </button>
              ))}
              {availableTokens.length === 0 && selectedTokens.length > 0 && (
                <span className="text-xs text-stone-400 italic mx-auto">
                  Semua kepingan sudah dirangkai. Klik tombol &ldquo;Cek Susunan&rdquo; di bawah!
                </span>
              )}
            </div>
          </div>

          {/* ACTION CONTROLS BUTTONS */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCheck}
                disabled={selectedTokens.length === 0}
                className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 transition flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Cek Susunan
              </button>

              <button
                onClick={handleReset}
                className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition"
                title="Acak Ulang Kepingan Kata"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleRevealSolution}
                className="px-3.5 py-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 font-bold text-xs transition"
                title="Bantuan susunan yang benar"
              >
                Lihat Kunci
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevQuestion}
                className="px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-stone-700 dark:text-stone-200 font-extrabold text-xs transition"
              >
                ← Sebelumnya
              </button>
              <button
                onClick={handleNextQuestion}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs shadow-md transition flex items-center gap-1.5"
              >
                <span>Soal Berikutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* PEDAGOGICAL REFERENCE: KATA YANG BISA DIGUNAKAN & POLA TERKAIT */}
        <div className="clay-card p-4 sm:p-5 rounded-3xl border border-black/10 dark:border-white/10 shadow-sm space-y-4">
          <button
            onClick={() => setShowReference(!showReference)}
            className="w-full flex items-center justify-between text-left transition group"
          >
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Layers className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-extrabold text-xs sm:text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <span>Pedoman Belajar: Kata Yang Bisa Digunakan & Pola Terkait</span>
                </h3>
                <p className="text-[11px] text-stone-500">
                  Lihat variasi kata/sambungan bentuk dan perbandingan dengan pola serupa
                </p>
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-black/5 dark:bg-white/5 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200">
              {showReference ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </button>

          {showReference && (
            <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-4 animate-in fade-in duration-200">
              {/* Connection Forms */}
              {currentItem.connectionForms && currentItem.connectionForms.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Kata yang bisa digunakan (Variasi Bentuk):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentItem.connectionForms.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 space-y-1.5"
                      >
                        <div className="font-black text-xs text-indigo-700 dark:text-indigo-300">
                          {item.category}
                        </div>
                        <div className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                          {item.rule}
                        </div>
                        {item.examples && item.examples.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.examples.map((ex, exIdx) => (
                              <span
                                key={exIdx}
                                className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-stone-800 border border-black/5 dark:border-white/10 text-stone-800 dark:text-stone-200"
                              >
                                {ex}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Patterns */}
              {currentItem.relatedPatterns && currentItem.relatedPatterns.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>Keterkaitan Pola Lain & Komparasi Perbedaan:</span>
                  </div>
                  <div className="space-y-2">
                    {currentItem.relatedPatterns.map((rel, idx) => {
                      const badgeBg =
                        rel.relation === "serupa"
                          ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30"
                          : rel.relation === "lawan"
                          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30"
                          : rel.relation === "dasar"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                          : rel.relation === "lanjutan"
                          ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";

                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-1"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <span className="font-extrabold text-xs text-stone-900 dark:text-stone-100">
                              {rel.target}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${badgeBg}`}
                            >
                              {rel.relation}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                            {rel.comparison}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="clay-card rounded-none border-x-0 border-b-0 border-t border-black/10 dark:border-white/10 py-6 text-center text-xs opacity-60">
        <p>OUTSUTSUKI PORTAL • IRODORI文法リスト • Mini Test & Kotoba Puzzle Arena</p>
      </footer>
    </div>
  );
}
