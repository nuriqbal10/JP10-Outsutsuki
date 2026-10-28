"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  ExternalLink,
  Download,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Layers,
  Compass,
  Lightbulb,
  Volume2,
  Puzzle,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { CHAPTER_MODULES, ChapterModuleData } from "@/data/chapterModules";
import rawBunpouData from "@/data/bunpouData.json";
import { BunpouItem } from "@/types/bunpou";

interface ChapterModuleViewerProps {
  chapter: number;
  chapterTitle: string;
  chapterTopic: string;
}

export default function ChapterModuleViewer({
  chapter,
  chapterTitle,
  chapterTopic,
}: ChapterModuleViewerProps) {
  const [viewMode, setViewMode] = useState<"pdf" | "summary">("pdf");
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const moduleData: ChapterModuleData = CHAPTER_MODULES[chapter] || {
    chapter,
    titleJa: `第${chapter}課「${chapterTitle}」`,
    titleId: chapterTitle,
    topic: chapterTopic,
    pdfUrl: `/modul/bab${chapter}.pdf`,
    canDoList: [
      `Mampu memahami materi dan ungkapan percakapan praktis pada Bab ${chapter}.`,
      "Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
    ],
    keyVocabCategories: [],
    grammarPoints: [],
    cultureNotes: [],
  };

  // Filter official IRODORI文法リスト items for A2.2 this chapter
  const officialBunpouList: BunpouItem[] = (rawBunpouData as BunpouItem[]).filter(
    (b) => b.level === "a2-2" && b.lesson === chapter
  );

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      u.rate = 0.85;
      setPlayingAudio(text);
      u.onend = () => setPlayingAudio(null);
      u.onerror = () => setPlayingAudio(null);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-[var(--text-body)] font-sans">
      {/* ========================================================
          1. HEADER MODUL PEMBELAJARAN RESMI
          ======================================================== */}
      <div className="clay-card rounded-3xl p-6 sm:p-8 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-950/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner">
              <BookOpen className="w-6 h-6 stroke-[2.5]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-[#24060E] px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  MODUL PEMBELAJARAN IRODORI RESMI
                </span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Level A2.2 (The Japan Foundation)
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-amber-100 mt-1">
                {moduleData.titleJa} • {moduleData.topic}
              </h2>
            </div>
          </div>

          {/* Quick Actions & Mode Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#1B050E] p-1 rounded-2xl border border-rose-900/60 shadow-inner">
              <button
                onClick={() => setViewMode("pdf")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "pdf"
                    ? "bg-rose-600 text-white shadow"
                    : "text-rose-300/70 hover:text-white"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Buku PDF Asli</span>
              </button>
              <button
                onClick={() => setViewMode("summary")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  viewMode === "summary"
                    ? "bg-amber-600 text-white shadow"
                    : "text-rose-300/70 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rangkuman Tata Bahasa</span>
              </button>
            </div>

            <a
              href={moduleData.pdfUrl}
              download={`Irodori_A2-2_Bab${chapter}.pdf`}
              className="clay-nav-pill px-3 py-1.5 bg-[#2D0711] hover:bg-[#450B1B] text-xs font-bold text-rose-200 border border-rose-800/40 flex items-center gap-1.5 transition"
              title="Unduh file PDF modul resmi"
            >
              <Download className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Unduh PDF</span>
            </a>

            <a
              href={moduleData.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn-gold px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:scale-105 transition"
              title="Buka PDF di tab baru layar penuh"
            >
              <span>Layar Penuh</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Can-Do Targets Highlights */}
        <div className="p-4 rounded-2xl bg-[#1C050E] border border-rose-900/40 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <Compass className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Target Capaian Pembelajaran (Can-do Irodori Bab {chapter}):</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-white/95 leading-relaxed">
            {moduleData.canDoList.map((cando, idx) => (
              <div key={idx} className="flex items-start gap-2 bg-[#280814]/80 p-2.5 rounded-xl border border-rose-950/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{cando}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          2. KONTEN MODUL: VIEW MODE (PDF / RANGKUMAN TATA BAHASA)
          ======================================================== */}
      {viewMode === "pdf" ? (
        /* PDF VIEWER RESMI TERINTEGRASI */
        <div className="clay-card rounded-3xl p-3 sm:p-5 border border-rose-950/80 shadow-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between px-2 text-xs text-amber-200 font-bold border-b border-rose-950/60 pb-2">
            <span className="flex items-center gap-1.5 text-amber-200">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              Buku Teks Resmi: Irodori Nihongo de Seikatsu 初級2 (Bab {chapter})
            </span>
            <span className="text-[11px] text-[var(--text-muted)]">
              * Dilengkapi ilustrasi warna, teks kanji berfurigana, dan dialog otentik
            </span>
          </div>

          <div className="w-full rounded-2xl overflow-hidden border border-rose-900/50 shadow-inner bg-[#100308] h-[900px] sm:h-[1100px]">
            <iframe
              src={`${moduleData.pdfUrl}#toolbar=1`}
              title={`Modul PDF Bab ${chapter}`}
              className="w-full h-full border-0 rounded-2xl"
            />
          </div>
        </div>
      ) : (
        /* RANGKUMAN TATA BAHASA & CATATAN BUDAYA INTERAKTIF (IRODORI文法リスト準拠) */
        <div className="flex flex-col gap-6">
          {/* POLA TATA BAHASA INTI (BUNPOU) */}
          <div className="clay-card rounded-3xl p-6 sm:p-8 border border-rose-950/80 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-950/60 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Layers className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-100">
                    IRODORI文法リスト • Tata Bahasa Bab {chapter}
                  </h3>
                  <p className="text-xs text-rose-300/80 mt-0.5">
                    Disinkronkan 100% dengan Database Pola Resmi Irodori (The Japan Foundation)
                  </p>
                </div>
              </div>

              <Link
                href="/bunpou"
                className="clay-btn-gold px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md hover:scale-105 transition"
              >
                <Puzzle className="w-3.5 h-3.5" />
                <span>Arena Puzzle Bunpou</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* List Bunpou Items (Official from bunpouData.json) */}
            <div className="flex flex-col gap-5">
              {officialBunpouList.length > 0 ? (
                officialBunpouList.map((bp, idx) => (
                  <div
                    key={bp.id || idx}
                    className="p-5 rounded-2xl bg-[#1C050E] border border-amber-500/25 shadow-xl flex flex-col gap-4 relative overflow-hidden"
                  >
                    {/* Header Pattern */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-950/70 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs flex items-center justify-center">
                          {bp.num || `P${idx + 1}`}
                        </span>
                        <div>
                          <h4 className="font-black text-amber-100 text-base">
                            {bp.pattern}
                          </h4>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-[#2D0711] border border-rose-800/40 text-amber-300/90 font-mono text-[11px] font-bold">
                        {bp.formulaDetailed}
                      </span>
                    </div>

                    {/* Arti & Penjelasan */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-bold text-rose-400 shrink-0">Arti:</span>
                        <p className="text-xs font-semibold text-rose-100">
                          {bp.meaning}
                        </p>
                      </div>
                      {bp.usageRule && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-bold text-amber-400 shrink-0">Kaidah:</span>
                          <p className="text-xs text-rose-200/90 leading-relaxed">
                            {bp.usageRule}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Contoh Kalimat Otentik dengan Audio */}
                    <div className="flex flex-col gap-2.5 bg-[#290714] p-3.5 rounded-xl border border-rose-900/50">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                          Contoh Otentik Irodori:
                        </span>
                        <button
                          onClick={() => speak(bp.example)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition ${
                            playingAudio === bp.example
                              ? "bg-amber-500 text-black shadow"
                              : "bg-black/40 text-amber-300 hover:bg-black/60 border border-amber-500/30"
                          }`}
                          title="Dengar pelafalan bahasa Jepang asli"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{playingAudio === bp.example ? "Memutar..." : "Dengar Audio"}</span>
                        </button>
                      </div>

                      <p className="font-bold text-amber-100 text-sm leading-relaxed">
                        {bp.example}
                      </p>

                      {bp.puzzle?.translation && (
                        <p className="text-xs text-rose-200/90 border-t border-rose-950/60 pt-2 italic">
                          "{bp.puzzle.translation}"
                        </p>
                      )}
                    </div>

                    {/* Bentuk Sambungan (Connection Forms) */}
                    {bp.connectionForms && bp.connectionForms.length > 0 && (
                      <div className="flex flex-col gap-2 bg-[#200611] p-3 rounded-xl border border-rose-950/80">
                        <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                          Bentuk Sambungan (接続):
                        </span>
                        <div className="flex flex-col gap-1.5">
                          {bp.connectionForms.map((cf, cIdx) => (
                            <div key={cIdx} className="text-xs text-rose-200/80 leading-relaxed">
                              <span className="font-bold text-emerald-300 mr-1.5">
                                • [{cf.category}]
                              </span>
                              <span>{cf.rule}</span>
                              {cf.examples && cf.examples.length > 0 && (
                                <span className="text-rose-300/70 ml-1 italic">
                                  ({cf.examples.join(", ")})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Link ke Arena Latihan Pola ini */}
                    <div className="flex items-center justify-between border-t border-rose-950/60 pt-3 text-xs">
                      <span className="text-[11px] text-rose-300/60">
                        ID: {bp.id}
                      </span>
                      <Link
                        href="/bunpou"
                        className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 transition"
                      >
                        <span>Latih Pola di Bunpou Arena</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                /* Fallback jika official list belum dimuat */
                moduleData.grammarPoints.map((gp, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#1C050E] border border-amber-500/20 shadow-lg flex flex-col gap-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-950/60 pb-2">
                      <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 font-mono font-bold text-xs">
                        Pola {idx + 1}: {gp.pattern}
                      </span>
                      <span className="text-xs font-bold text-rose-300/80">
                        Arti: {gp.meaning}
                      </span>
                    </div>

                    <p className="text-xs text-rose-200/90 leading-relaxed">
                      {gp.explanation}
                    </p>

                    <div className="flex flex-col gap-2 mt-1">
                      <span className="text-[11px] font-black uppercase text-amber-400/80 tracking-wider">
                        Contoh Penggunaan Nyata:
                      </span>
                      {gp.examples.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="p-3 rounded-xl bg-[#290714] border border-rose-900/50 flex flex-col gap-1 text-xs"
                        >
                          <p className="font-bold text-amber-100 text-sm">{ex.ja}</p>
                          {ex.romaji && (
                            <p className="text-[11px] text-rose-300/70 font-mono italic">{ex.romaji}</p>
                          )}
                          <p className="text-rose-200/90">{ex.id}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* CATATAN BUDAYA & KEHIDUPAN JEPANG */}
          {moduleData.cultureNotes && moduleData.cultureNotes.length > 0 && (
            <div className="clay-card rounded-3xl p-6 sm:p-8 border border-amber-500/20 shadow-xl flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-rose-950/60 pb-3">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-black text-amber-100">
                  Tips Kehidupan & Budaya Jepang (生活の知恵)
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {moduleData.cultureNotes.map((note, nIdx) => (
                  <div
                    key={nIdx}
                    className="p-4 rounded-2xl bg-[#1C050E] border border-rose-900/40 flex flex-col gap-1.5"
                  >
                    <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                      {note.title}
                    </h4>
                    <p className="text-xs text-rose-200/90 leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
