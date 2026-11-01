"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  FileText,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  GraduationCap,
  Play,
  RotateCcw,
  Check,
  Copy,
  Puzzle,
  Share2,
} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { getChapterInfo, getCourseById } from "@/data/coursesCatalog";
import rawBunpouData from "@/data/bunpouData.json";
import { BunpouItem } from "@/types/bunpou";
import { playNativeJapaneseAudio } from "@/lib/nativeVoiceEngine";

interface SeriesChapterViewerProps {
  courseId: "irodori-a1" | "irodori-a2-1";
  chapterNum: number;
}

export default function SeriesChapterViewer({
  courseId,
  chapterNum,
}: SeriesChapterViewerProps) {
  const course = getCourseById(courseId);
  const chapter = getChapterInfo(courseId, chapterNum);

  const [activeTab, setActiveTab] = useState<"bunpou" | "cando" | "puzzle">("bunpou");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // Filter grammar points for this level and chapter
  const levelCode = course?.levelCode || "a1";
  const chapterBunpou = useMemo(() => {
    return (rawBunpouData as BunpouItem[]).filter(
      (b) => b.level === levelCode && b.lesson === chapterNum
    );
  }, [levelCode, chapterNum]);

  const speak = (text: string, index?: number) => {
    if (typeof index === "number") {
      setPlayingIndex(index);
    }
    playNativeJapaneseAudio(text, {
      rate: 0.92,
      onStart: () => {
        if (typeof index === "number") setPlayingIndex(index);
      },
      onEnd: () => {
        if (typeof index === "number") setPlayingIndex(null);
      },
      onError: () => {
        if (typeof index === "number") setPlayingIndex(null);
      },
    });
  };

  const handleCopy = (item: BunpouItem) => {
    const text = `【${item.levelJapanese} - Bab ${item.lesson}】 ${item.pattern}\nArti: ${item.meaning || ""}\nRumus: ${item.formulaDetailed || item.pattern}\nContoh:\n${item.example}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (!course || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-[var(--text-body)]">
        <div className="clay-card p-8 rounded-3xl max-w-md text-center flex flex-col gap-4">
          <h2 className="text-xl font-bold">Bab Tidak Ditemukan</h2>
          <p className="text-xs opacity-75">Bab yang Anda pilih tidak tersedia dalam katalog silabus.</p>
          <Link href="/lms" className="clay-btn py-2.5 rounded-xl text-xs font-bold">
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const prevChapter = chapterNum > 1 ? chapterNum - 1 : null;
  const nextChapter = chapterNum < course.totalChapters ? chapterNum + 1 : null;

  return (
    <div className="min-h-screen flex flex-col font-sans text-[var(--text-body)]">
      {/* 1. HEADER UTAMA */}
      <header className="clay-card rounded-none border-x-0 border-t-0 border-b border-current/10 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href={course.href}
            className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider opacity-80 hover:opacity-100 transition uppercase"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Katalog {course.level}</span>
          </Link>
          <div className="h-4 w-px bg-current/15 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${course.badgeColor}`}>
              {course.badge}
            </span>
            <span className="text-xs sm:text-sm font-extrabold truncate">
              第{chapterNum}課 • {chapter.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher compact />
          <Link
            href={`/bunpou?level=${levelCode}&lesson=${chapterNum}`}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-current/15 bg-current/5 hover:bg-current/10 transition hidden md:inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" /> Bunpou Explorer
          </Link>
        </div>
      </header>

      {/* 2. SUB-HEADER BANNER BAB */}
      <div className="border-b border-current/10 px-4 sm:px-6 py-4 bg-current/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold opacity-75">
              <span>{course.title}</span>
              <span>•</span>
              <span className="font-mono">Bab {chapterNum < 10 ? `0${chapterNum}` : chapterNum} ({chapter.subTitle})</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1 text-[var(--text-heading)]">
              {chapter.title}
            </h1>
            <p className="text-xs sm:text-sm opacity-80 mt-1 max-w-2xl">
              {chapter.topic}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {prevChapter && (
              <Link
                href={`/lms/${courseId}/bab/${prevChapter}`}
                className="clay-nav-pill px-3 py-1.5 border border-current/15 bg-current/5 hover:bg-current/10 text-xs font-bold flex items-center gap-1"
              >
                ← Bab {prevChapter}
              </Link>
            )}
            {nextChapter && (
              <Link
                href={`/lms/${courseId}/bab/${nextChapter}`}
                className="clay-nav-pill px-3 py-1.5 border border-current/15 bg-current/5 hover:bg-current/10 text-xs font-bold flex items-center gap-1"
              >
                Bab {nextChapter} →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 3. TABS NAVIGASI MOODLE */}
      <div className="clay-card rounded-none border-x-0 border-t-0 border-b border-current/10 px-4 sm:px-6 py-2.5 sticky top-[57px] z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center gap-2 sm:gap-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab("bunpou")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shrink-0 ${
              activeTab === "bunpou"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-current/5 hover:bg-current/10 opacity-80"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            1. Pola Tata Bahasa ({chapterBunpou.length})
          </button>
          <button
            onClick={() => setActiveTab("cando")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shrink-0 ${
              activeTab === "cando"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-current/5 hover:bg-current/10 opacity-80"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            2. Target Capaian (Can-Do)
          </button>
          <button
            onClick={() => setActiveTab("puzzle")}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shrink-0 ${
              activeTab === "puzzle"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-current/5 hover:bg-current/10 opacity-80"
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            3. Mini Test & Latihan
          </button>
        </div>
      </div>

      {/* 4. MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6 flex-1 flex flex-col gap-6 w-full">
        {/* TAB 1: POLA TATA BAHASA & CONTOH KALIMAT */}
        {activeTab === "bunpou" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[var(--text-heading)] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  Daftar Pola Kalimat Resmi (文型リスト)
                </h3>
                <p className="text-xs opacity-75 mt-0.5">
                  Tersusun sesuai silabus resmi Japan Foundation Irodori {course.level}.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                {chapterBunpou.length} Pola Kalimat
              </span>
            </div>

            {chapterBunpou.length === 0 ? (
              <div className="clay-card rounded-2xl p-8 text-center flex flex-col items-center gap-3">
                <Sparkles className="w-8 h-8 text-amber-500" />
                <p className="text-sm font-bold">Materi Bab {chapterNum} Fokus pada Pengenalan Huruf & Ungkapan Lisan</p>
                <p className="text-xs opacity-75 max-w-md">
                  Bab ini melatih fondasi pengucapan, fonetik vokal/konsonan, dan etiket sapaan awal sebelum masuk ke konstruksi tata bahasa formal.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Link href="/kanji" className="clay-btn px-4 py-2 rounded-xl text-xs font-bold">
                    Buka Studio Huruf
                  </Link>
                  <Link href="/flashcard" className="clay-btn-gold px-4 py-2 rounded-xl text-xs font-bold">
                    Latihan Kosakata 3D
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {chapterBunpou.map((item, idx) => (
                  <div
                    key={item.id}
                    className="clay-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-current/10 flex flex-col gap-4 shadow-md relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {item.num || idx + 1}
                        </span>
                        <div>
                          <h4 className="text-base sm:text-lg font-black text-[var(--text-heading)]">
                            {item.pattern}
                          </h4>
                          {item.meaning && (
                            <p className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                              Arti: {item.meaning}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleCopy(item)}
                          className="p-1.5 rounded-lg text-current/60 hover:text-current hover:bg-current/5 transition"
                          title="Salin Pola"
                        >
                          {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Formula & Penjelasan */}
                    {item.formulaDetailed && (
                      <div className="p-3.5 rounded-xl bg-current/5 border border-current/10 text-xs sm:text-sm leading-relaxed">
                        <span className="font-bold text-amber-500 block mb-1">Rumus Pembentukan:</span>
                        <span className="font-mono whitespace-pre-line">{item.formulaDetailed}</span>
                      </div>
                    )}

                    {item.usageRule && (
                      <div className="text-xs opacity-85 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                        <strong className="text-amber-600 dark:text-amber-400 block mb-0.5">Penjelasan Penggunaan:</strong>
                        <p>{item.usageRule}</p>
                      </div>
                    )}

                    {/* Contoh Kalimat */}
                    <div className="space-y-2 pt-2 border-t border-current/10">
                      <div className="text-[11px] font-black uppercase tracking-wider opacity-70 flex items-center justify-between">
                        <span>Contoh Kalimat (例文):</span>
                        <span className="text-[10px]">Klik ikon suara untuk mendengarkan</span>
                      </div>
                      <div className="p-3 rounded-xl bg-current/5 border border-current/10 flex items-start justify-between gap-3">
                        <p className="text-sm sm:text-base font-bold whitespace-pre-line leading-relaxed">
                          {item.example}
                        </p>
                        <button
                          onClick={() => speak(item.example, idx)}
                          className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:scale-105 transition shrink-0"
                          title="Putar Audio Pelafalan"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TARGET CAPAIAN & CAN-DO */}
        {activeTab === "cando" && (
          <div className="flex flex-col gap-6">
            <div className="clay-card rounded-3xl p-6 sm:p-8 border border-emerald-500/30 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-[var(--text-heading)]">
                    Target Capaian Pembelajaran (Can-do Checklist)
                  </h3>
                  <p className="text-xs opacity-75">
                    Standar kompetensi komunikasi CEFR Japan Foundation Bab {chapterNum}.
                  </p>
                </div>
              </div>

              <div className="mt-4 p-5 rounded-2xl bg-current/5 border border-current/10 space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-heading)]">Kemampuan Inti Bab {chapterNum}:</h4>
                    <p className="text-xs sm:text-sm opacity-85 mt-1 leading-relaxed">
                      {chapter.canDo}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div className="p-4 rounded-xl bg-current/5 border border-current/10">
                  <span className="text-[10px] font-black uppercase text-amber-500 block mb-1">Kosakata Terdaftar</span>
                  <p className="text-base font-black">{chapter.vocabCount} Kata</p>
                  <p className="text-xs opacity-70 mt-1">Kosakata praktis situasi kerja dan kehidupan.</p>
                </div>
                <div className="p-4 rounded-xl bg-current/5 border border-current/10">
                  <span className="text-[10px] font-black uppercase text-emerald-500 block mb-1">Target Nilai Kelulusan</span>
                  <p className="text-base font-black">KKM 85%</p>
                  <p className="text-xs opacity-70 mt-1">Standar evaluasi akademik resmi klan Outsutsuki.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MINI TEST & LATIHAN SOAL */}
        {activeTab === "puzzle" && (
          <div className="flex flex-col gap-6">
            <div className="clay-card rounded-3xl p-6 sm:p-8 border border-indigo-500/30 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30">
                  <Puzzle className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-[var(--text-heading)]">
                    Mini Test & Latihan Susun Kalimat (Puzzle)
                  </h3>
                  <p className="text-xs opacity-75">
                    Uji pemahaman pola kalimat Bab {chapterNum} secara interaktif.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/bunpou-test"
                  className="clay-card p-5 rounded-2xl border border-indigo-500/30 hover:scale-[1.02] transition flex flex-col justify-between gap-3 group"
                >
                  <div>
                    <span className="text-xs font-black uppercase text-indigo-500 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                      Game Puzzle Interaktif
                    </span>
                    <h4 className="font-black text-base mt-2 group-hover:text-indigo-500 transition">
                      Mini Test Puzzle Tata Bahasa
                    </h4>
                    <p className="text-xs opacity-80 mt-1">
                      Menyusun kepingan token kata menjadi kalimat sempurna sesuai kaidah tata bahasa Irodori.
                    </p>
                  </div>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    Mulai Puzzle <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>

                <Link
                  href="/cbt"
                  className="clay-card p-5 rounded-2xl border border-amber-500/30 hover:scale-[1.02] transition flex flex-col justify-between gap-3 group"
                >
                  <div>
                    <span className="text-xs font-black uppercase text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      Simulasi Standar Resmi
                    </span>
                    <h4 className="font-black text-base mt-2 group-hover:text-amber-500 transition">
                      Simulator CBT JFT-Basic
                    </h4>
                    <p className="text-xs opacity-80 mt-1">
                      Uji kemampuan 4 pilar lengkap (Moji-Goi, Kaiwa, Choukai, Dokkai) format komputer resmi.
                    </p>
                  </div>
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    Buka Simulator CBT <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
