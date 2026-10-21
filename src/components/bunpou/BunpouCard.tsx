"use client";

import React, { useState } from "react";
import { Volume2, Copy, Check, Bookmark, BookmarkCheck, BookOpen, Sparkles } from "lucide-react";
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

  const speak = (text: string, index: number) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.85;
      setIsPlaying(index);
      utterance.onend = () => setIsPlaying(null);
      utterance.onerror = () => setIsPlaying(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = () => {
    const textToCopy = `【${bunpou.levelJapanese} - Bab ${bunpou.lesson}】 ${bunpou.pattern}\nContoh:\n${bunpou.example}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const levelTheme =
    bunpou.level === "a1"
      ? {
          badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
          pill: "bg-emerald-500 text-white",
          border: "hover:border-emerald-500/40",
          formulaBg: "bg-emerald-500/5 border-emerald-500/20 text-emerald-950 dark:text-emerald-100",
        }
      : bunpou.level === "a2-1"
      ? {
          badge: "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
          pill: "bg-sky-500 text-white",
          border: "hover:border-sky-500/40",
          formulaBg: "bg-sky-500/5 border-sky-500/20 text-sky-950 dark:text-sky-100",
        }
      : {
          badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
          pill: "bg-amber-500 text-stone-950",
          border: "hover:border-amber-500/40",
          formulaBg: "bg-amber-500/5 border-amber-500/20 text-amber-950 dark:text-amber-100",
        };

  const patternLines = bunpou.pattern
    .split(/[\r\n]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const exampleLines = bunpou.example
    .split(/[\r\n]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return (
    <div
      className={`clay-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-200 flex flex-col justify-between gap-5 relative overflow-hidden group ${
        isMastered
          ? "border-emerald-500/40 bg-emerald-500/[0.02]"
          : "border-black/10 dark:border-white/10"
      } ${levelTheme.border}`}
    >
      {/* Top Bar: Level, Lesson, and Action Buttons */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Level Badge */}
          <span
            className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border shadow-xs flex items-center gap-1 ${levelTheme.badge}`}
          >
            <span>{bunpou.levelJapanese}</span>
            <span className="opacity-60 text-[10px] uppercase font-mono">
              ({bunpou.level})
            </span>
          </span>

          {/* Lesson Badge */}
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-500/10 border border-current/15 text-stone-700 dark:text-stone-300">
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
            title="Salin pola dan contoh kalimat"
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
      <div className="text-xs text-stone-500 dark:text-stone-400 font-medium -mt-2">
        Judul Bab: <span className="text-stone-800 dark:text-stone-200 font-bold">{bunpou.lessonTitle}</span>
      </div>

      {/* Pattern Formula Box */}
      <div className={`p-4 rounded-2xl border ${levelTheme.formulaBg} relative shadow-inner`}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-black tracking-wider uppercase opacity-70 flex items-center gap-1.5">
            <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs ${levelTheme.pill}`}>
              {bunpou.num || "★"}
            </span>
            <span>RUMUS POLA KALIMAT (文型)</span>
          </div>
          {isMastered && (
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <Check className="w-3 h-3" /> Dikuasai
            </span>
          )}
        </div>

        <div className="space-y-1">
          {patternLines.map((pat, idx) => (
            <div
              key={idx}
              className="text-base sm:text-lg font-black tracking-wide leading-snug font-sans break-words"
            >
              {pat}
            </div>
          ))}
        </div>
      </div>

      {/* Authentic Example Sentences (例文) */}
      {exampleLines.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 dark:text-stone-500 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Contoh Percakapan Otentik (例文):</span>
          </div>

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

      {/* Marugoto Cross-Reference Footer */}
      {bunpou.marugoto && (
        <div className="pt-3 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-stone-500 dark:text-stone-400">
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
