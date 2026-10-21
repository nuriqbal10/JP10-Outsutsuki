"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Volume2,
  Copy,
  Check,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Puzzle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Settings2,
} from "lucide-react";
import { BunpouItem } from "@/types/bunpou";

interface BunpouCardProps {
  bunpou: BunpouItem;
  isMastered: boolean;
  onToggleMastered: (id: string) => void;
}

export default function BunpouCard({
  bunpou,
  isMastered,
  onToggleMastered,
}: BunpouCardProps) {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [showUsageDetail, setShowUsageDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<"examples" | "puzzle">("examples");

  // Sentence Scramble Puzzle State
  const puzzle = bunpou.puzzle;
  const initialAvailableTokens = useMemo(() => {
    if (!puzzle) return [];
    if (puzzle.shuffledTokens && puzzle.shuffledTokens.length > 0) {
      return [...puzzle.shuffledTokens];
    }
    return [...puzzle.tokens];
  }, [puzzle]);

  const [availableTokens, setAvailableTokens] = useState<string[]>(initialAvailableTokens);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [puzzleStatus, setPuzzleStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [showHint, setShowHint] = useState(false);

  // Reset puzzle when bunpou changes
  useEffect(() => {
    if (puzzle) {
      const shuf = [...(puzzle.shuffledTokens || puzzle.tokens)];
      setAvailableTokens(shuf);
      setSelectedTokens([]);
      setPuzzleStatus("idle");
      setShowHint(false);
    }
  }, [bunpou.id]);

  const speak = (text: string, index?: number) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      if (typeof index === "number") {
        setIsPlaying(index);
        utterance.onend = () => setIsPlaying(null);
        utterance.onerror = () => setIsPlaying(null);
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = () => {
    const textToCopy = `【${bunpou.levelJapanese} - Bab ${bunpou.lesson}】 ${bunpou.pattern}\nArti: ${bunpou.meaning || ""}\nRumus: ${bunpou.formulaDetailed || bunpou.pattern}\nContoh:\n${bunpou.example}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Puzzle handlers
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

  const handleCheckPuzzle = () => {
    if (!puzzle) return;
    const constructed = selectedTokens.join("").replace(/[、。！？\s]/g, "");
    const target = puzzle.sentence.replace(/[、。！？\s]/g, "");

    if (constructed === target) {
      setPuzzleStatus("correct");
      // Play native audio TTS on success
      speak(puzzle.sentence);
    } else {
      setPuzzleStatus("incorrect");
    }
  };

  const handleResetPuzzle = () => {
    if (!puzzle) return;
    // Shuffle again
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

  const levelTheme =
    bunpou.level === "a1"
      ? {
          badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
          pill: "bg-emerald-500 text-white",
          border: "hover:border-emerald-500/40",
          formulaBg: "bg-emerald-500/5 border-emerald-500/20 text-emerald-950 dark:text-emerald-100",
          accentText: "text-emerald-600 dark:text-emerald-400",
        }
      : bunpou.level === "a2-1"
      ? {
          badge: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
          pill: "bg-sky-500 text-white",
          border: "hover:border-sky-500/40",
          formulaBg: "bg-sky-500/5 border-sky-500/20 text-sky-950 dark:text-sky-100",
          accentText: "text-sky-600 dark:text-sky-400",
        }
      : {
          badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
          pill: "bg-amber-500 text-stone-950",
          border: "hover:border-amber-500/40",
          formulaBg: "bg-amber-500/5 border-amber-500/20 text-amber-950 dark:text-amber-100",
          accentText: "text-amber-600 dark:text-amber-400",
        };

  const patternLines = bunpou.pattern
    .split(/[\r\n]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const formulaDetailLines = (bunpou.formulaDetailed || "")
    .split(/[\r\n]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const exampleLines = bunpou.example
    .split(/[\r\n]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return (
    <div
      className={`clay-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-200 flex flex-col justify-between gap-4 relative overflow-hidden group shadow-md ${
        isMastered
          ? "border-emerald-500/40 bg-emerald-500/[0.02]"
          : "border-black/10 dark:border-white/10"
      } ${levelTheme.border}`}
    >
      {/* 1. TOP BAR: LEVEL, BAB, TOPIK & ACTIONS */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Level Badge */}
          <span
            className={`text-[10px] sm:text-[11px] font-black px-2.5 py-0.5 rounded-full border shadow-xs flex items-center gap-1 ${levelTheme.badge}`}
          >
            <span>{bunpou.levelJapanese}</span>
            <span className="opacity-60 text-[9px] uppercase font-mono">
              ({bunpou.level})
            </span>
          </span>

          {/* Lesson Badge */}
          <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-500/10 border border-current/15 text-stone-700 dark:text-stone-300">
            第{bunpou.lesson}課 • Bab {bunpou.lesson}
          </span>

          {/* Topic Badge */}
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-200/50 dark:bg-stone-800/60 text-stone-600 dark:text-stone-400">
            {bunpou.topic}
          </span>
        </div>

        {/* Mastered & Copy Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopy}
            title="Salin seluruh info pola kalimat ini"
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onToggleMastered(bunpou.id)}
            title={
              isMastered ? "Tandai belum dikuasai" : "Tandai sudah dikuasai"
            }
            className={`p-1.5 rounded-lg transition ${
              isMastered
                ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                : "text-stone-400 hover:text-amber-500 hover:bg-amber-500/10"
            }`}
          >
            {isMastered ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Lesson Title */}
      <div className="text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium -mt-1">
        Judul Bab:{" "}
        <span className="text-stone-800 dark:text-stone-200 font-bold">
          {bunpou.lessonTitle}
        </span>
      </div>

      {/* 2. RUMUS POLA KALIMAT (文型) */}
      <div
        className={`p-4 rounded-2xl border ${levelTheme.formulaBg} relative shadow-inner space-y-2`}
      >
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-black tracking-wider uppercase opacity-75 flex items-center gap-1.5">
            <span
              className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs ${levelTheme.pill}`}
            >
              {bunpou.num || "★"}
            </span>
            <span>1. RUMUS POLA KALIMAT (文型)</span>
          </div>
          {isMastered && (
            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <Check className="w-3 h-3" /> Dikuasai
            </span>
          )}
        </div>

        {/* Pattern Native */}
        <div className="space-y-1">
          {patternLines.map((pat, idx) => (
            <div
              key={idx}
              className="text-base sm:text-lg font-black tracking-wide leading-snug font-sans break-words text-stone-900 dark:text-stone-100"
            >
              {pat}
            </div>
          ))}
        </div>

        {/* Detailed Breakdown of Symbols */}
        {formulaDetailLines.length > 0 && (
          <div className="pt-2 border-t border-black/10 dark:border-white/10 text-[11px] space-y-1 font-mono text-stone-600 dark:text-stone-300">
            <div className="text-[10px] font-bold text-stone-400 dark:text-stone-500 uppercase font-sans">
              Detail Komponen Rumus:
            </div>
            {formulaDetailLines.map((line, idx) => (
              <div key={idx} className="bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. ARTI & FUNGSI DALAM BAHASA INDONESIA */}
      {bunpou.meaning && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
          <div className="text-[10px] font-black tracking-wider uppercase text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>2. ARTI & FUNGSI (Bahasa Indonesia):</span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-stone-800 dark:text-stone-100 leading-snug">
            {bunpou.meaning}
          </div>
        </div>
      )}

      {/* 4. CARA MEMAKAI, CARA MEMBUAT & SYARAT BENTUK */}
      {bunpou.usageRule && (
        <div className="rounded-xl border border-black/10 dark:border-white/10 overflow-hidden bg-black/[0.02] dark:bg-white/[0.02]">
          <button
            onClick={() => setShowUsageDetail(!showUsageDetail)}
            className="w-full p-3 flex items-center justify-between text-left text-[11px] font-extrabold text-stone-700 dark:text-stone-200 hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-sky-500" />
              <span>3. CARA MEMAKAI, CARA MEMBUAT & SYARAT BENTUK:</span>
            </div>
            {showUsageDetail ? (
              <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            )}
          </button>

          {showUsageDetail && (
            <div className="p-3.5 pt-0 text-xs text-stone-600 dark:text-stone-300 leading-relaxed border-t border-black/5 dark:border-white/5 space-y-2">
              <p className="font-medium bg-white/50 dark:bg-stone-900/50 p-2.5 rounded-lg border border-black/5 dark:border-white/5">
                {bunpou.usageRule}
              </p>
              <div className="text-[10px] text-stone-400">
                💡 <em>Tips Ujian JFT:</em> Perhatikan bentuk kata kerja/sifat yang mendahului pola untuk menghindari distraktor pada soal Dokkai dan Moji-Goi.
              </div>
            </div>
          )}
        </div>
      )}

      {/* TABS SELECTOR: CONTOH KALIMAT vs PUZZLE MERANGKAI */}
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-1.5 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("examples")}
            className={`text-xs font-black pb-1 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "examples"
                ? "border-amber-500 text-stone-900 dark:text-stone-100"
                : "border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Contoh Otentik (例文)</span>
          </button>

          <button
            onClick={() => setActiveTab("puzzle")}
            className={`text-xs font-black pb-1 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "puzzle"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
            }`}
          >
            <Puzzle className="w-3.5 h-3.5 text-indigo-500" />
            <span>🧩 Latihan Puzzle Kalimat</span>
          </button>
        </div>

        {activeTab === "puzzle" && (
          <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-md">
            Susun Kata
          </span>
        )}
      </div>

      {/* CONTENT TAB: 1) CONTOH PERCAKAPAN (例文) */}
      {activeTab === "examples" && (
        <div className="space-y-2">
          <div className="space-y-1.5">
            {exampleLines.map((line, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 flex items-start justify-between gap-3 hover:border-black/10 dark:hover:border-white/10 transition"
              >
                <div className="text-xs sm:text-sm font-semibold leading-relaxed text-stone-800 dark:text-stone-200">
                  {line}
                </div>
                <button
                  onClick={() => speak(line, idx)}
                  className={`p-1.5 rounded-lg shrink-0 transition ${
                    isPlaying === idx
                      ? "bg-amber-500 text-stone-950 scale-110 shadow-md animate-pulse"
                      : "text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                  }`}
                  title="Dengarkan pelafalan audio (Native TTS)"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONTENT TAB: 2) LATIHAN MERANGKAI KALIMAT PUZZLE (KOTOBA PUZZLE) */}
      {activeTab === "puzzle" && puzzle && (
        <div className="space-y-3 p-3.5 rounded-2xl bg-indigo-500/[0.04] border border-indigo-500/20">
          {/* Puzzle Target Meaning */}
          <div>
            <div className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center justify-between">
              <span>Target Arti Kalimat:</span>
              <span className="text-[9px] text-stone-400 font-normal">
                Klik kepingan untuk susun/batal
              </span>
            </div>
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200 mt-0.5">
              &ldquo;{puzzle.translation}&rdquo;
            </div>
          </div>

          {/* User's Assembled Sentence Slot (Dropzone) */}
          <div
            className={`min-h-[50px] p-2.5 rounded-xl border flex flex-wrap items-center gap-1.5 transition ${
              puzzleStatus === "correct"
                ? "bg-emerald-500/10 border-emerald-500/40 ring-2 ring-emerald-500/30"
                : puzzleStatus === "incorrect"
                ? "bg-rose-500/10 border-rose-500/40 ring-2 ring-rose-500/30"
                : "bg-white dark:bg-stone-900 border-indigo-500/25"
            }`}
          >
            {selectedTokens.length === 0 ? (
              <span className="text-stone-400 text-[11px] italic">
                Klik kepingan kata di bawah untuk merangkai ke sini...
              </span>
            ) : (
              selectedTokens.map((tok, idx) => (
                <button
                  key={idx}
                  onClick={() => handleUnselectToken(tok, idx)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-xs hover:bg-rose-600 transition flex items-center gap-1 group/chip animate-in fade-in zoom-in-95 duration-150"
                  title="Klik untuk kembalikan ke tumpukan acak"
                >
                  <span>{tok}</span>
                  <span className="text-[10px] opacity-70 group-hover/chip:opacity-100">✕</span>
                </button>
              ))
            )}
          </div>

          {/* Feedback Status */}
          {puzzleStatus === "correct" && (
            <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-between gap-1 bg-emerald-500/15 p-2 rounded-lg border border-emerald-500/30">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                🎉 Luar Biasa! Kalimat tersusun sempurna!
              </span>
              <button
                onClick={() => speak(puzzle.sentence)}
                className="p-1 rounded-md bg-emerald-500 text-white hover:scale-105 transition"
                title="Dengarkan pelafalan kalimat yang benar"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {puzzleStatus === "incorrect" && (
            <div className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5 bg-rose-500/15 p-2 rounded-lg border border-rose-500/30">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>Susunan masih belum pas. Perhatikan rumus dan urutannya!</span>
            </div>
          )}

          {/* Pool of Scrambled / Available Tokens */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Kepingan Kata Acak ({availableTokens.length}):
            </div>
            <div className="flex flex-wrap items-center gap-1.5 min-h-[36px]">
              {availableTokens.map((tok, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectToken(tok, idx)}
                  className="px-2.5 py-1 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-100 font-bold text-xs border border-stone-300 dark:border-stone-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:scale-105 active:scale-95 transition shadow-2xs"
                  title="Klik untuk masukkan ke susunan"
                >
                  {tok}
                </button>
              ))}
              {availableTokens.length === 0 && selectedTokens.length > 0 && (
                <span className="text-[10px] text-stone-400 italic">
                  Semua kepingan sudah dimasukkan. Tekan &ldquo;Cek Susunan&rdquo;.
                </span>
              )}
            </div>
          </div>

          {/* Puzzle Action Controls */}
          <div className="flex items-center justify-between pt-1 border-t border-black/10 dark:border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCheckPuzzle}
                disabled={selectedTokens.length === 0}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-extrabold text-xs shadow-md transition flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                Cek Susunan
              </button>

              <button
                onClick={handleResetPuzzle}
                className="p-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition"
                title="Acak ulang kepingan kata"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleRevealSolution}
              className="text-[11px] font-bold text-stone-400 hover:text-indigo-500 transition underline underline-offset-2"
            >
              Lihat Kunci
            </button>
          </div>
        </div>
      )}

      {/* 5. MARUGOTO CROSS-REFERENCE FOOTER */}
      {bunpou.marugoto && (
        <div className="pt-2.5 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-stone-500 dark:text-stone-400">
          <span className="font-medium opacity-75">
            Padanan Kurikulum JF Marugoto:
          </span>
          <span className="font-semibold text-stone-700 dark:text-stone-300 break-words font-mono text-[10px]">
            {bunpou.marugoto}
          </span>
        </div>
      )}
    </div>
  );
}
