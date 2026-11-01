"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Layers, Award, Sparkles, CheckCircle2, ChevronRight, GraduationCap, Video, FileText, HelpCircle, Volume2, Puzzle } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { IRODORI_A21_CHAPTERS } from "@/data/coursesCatalog";

export default function IrodoriA21CoursePage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-[var(--text-body)]">
      {/* HEADER */}
      <header className="clay-card rounded-none border-x-0 border-t-0 border-b border-current/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <Link href="/lms" className="inline-flex items-center gap-2 text-xs font-black tracking-wider opacity-80 hover:opacity-100 transition uppercase">
          <ArrowLeft className="w-4 h-4 text-sky-500" /> Katalog Kursus
        </Link>
        <div className="flex items-center gap-2.5 text-sm sm:text-base font-extrabold tracking-wide">
          <span className="p-1.5 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-md">
            <GraduationCap className="w-4 h-4 stroke-[2.5]" />
          </span>
          <span>Silabus Irodori A2.1 • Tingkat Lanjutan 1 (初級1)</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher compact />
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/15 text-sky-600 dark:text-sky-300 hidden sm:inline-block">
            18 Bab Lengkap
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 sm:p-8 flex-1 flex flex-col gap-8 w-full">
        {/* COURSE OVERVIEW BANNER */}
        <div className="clay-card rounded-3xl p-8 border border-sky-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden bg-gradient-to-br from-sky-500/10 via-transparent to-blue-500/5">
          <div className="flex items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white flex items-center justify-center font-black text-2xl shadow-xl shrink-0 hidden sm:flex border border-sky-400/40">
              A2.1
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-sky-700 dark:text-sky-300 bg-sky-500/15 border border-sky-500/30 px-3 py-1 rounded-lg">
                  Level Lanjutan 1 (初級1 - Elementary 1)
                </span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  Standar The Japan Foundation
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mt-2.5 text-[var(--text-heading)]">
                Irodori Bahasa Jepang untuk Kehidupan A2.1
              </h2>
              <p className="opacity-85 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
                Kelanjutan tata bahasa praktis percakapan kerja, kehidupan bermasyarakat, situasi musim ekstrem, petunjuk arah jalan ke kantor pos, koordinasi keterlambatan, izin sakit/cuti, hingga etiket memberi hadiah.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <Link
              href="/bunpou?level=a2-1"
              className="clay-btn px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-center"
            >
              95 Pola Bunpou A2.1
            </Link>
          </div>
        </div>

        {/* CHAPTER LIST */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black flex items-center gap-2 text-[var(--text-heading)]">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
              Daftar Bab & Silabus Pembelajaran A2.1 (18 Bab)
            </h3>
            <span className="text-xs opacity-70">Pilih salah satu bab untuk membuka modul</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {IRODORI_A21_CHAPTERS.map((ch) => (
              <div
                key={ch.num}
                className="clay-card rounded-2xl p-6 border border-current/10 flex flex-col justify-between gap-6 hover:scale-[1.01] transition group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-sky-700 dark:text-sky-300 bg-sky-500/10 border border-sky-500/30 px-3 py-1 rounded-lg">
                      第{ch.num}課 (Bab {ch.num < 10 ? `0${ch.num}` : ch.num})
                    </span>
                    <span className="text-xs font-bold opacity-60 font-mono">
                      {ch.subTitle}
                    </span>
                  </div>

                  <h4 className="font-black text-lg mt-3 group-hover:text-sky-500 transition text-[var(--text-heading)]">
                    {ch.title}
                  </h4>
                  <p className="text-xs opacity-80 mt-1 leading-relaxed">
                    {ch.topic}
                  </p>

                  <div className="mt-2 text-[11px] font-semibold text-sky-600 dark:text-sky-400">
                    🎯 Can-Do: {ch.canDo}
                  </div>

                  {/* 3 PILAR PEMBELAJARAN PER BAB */}
                  <div className="mt-4 pt-4 border-t border-current/10 flex flex-col gap-2 text-xs">
                    <div className="flex items-center gap-2 opacity-85">
                      <FileText className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span><strong>Pola Tata Bahasa:</strong> {ch.grammarPoints.join(" • ")}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-85">
                      <Volume2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      <span><strong>Kosakata Terdaftar:</strong> {ch.vocabCount} Kosakata Terdaftar</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-85">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span><strong>Latihan Mandiri:</strong> {ch.quizCount} Butir Soal per Bab</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Link
                    href={`/lms/irodori-a2-1/bab/${ch.num}`}
                    className="clay-btn flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-center transition shadow-md hover:scale-[1.02]"
                  >
                    Buka Modul Bab {ch.num < 10 ? `0${ch.num}` : ch.num}
                  </Link>
                  <Link
                    href={`/bunpou?level=a2-1&lesson=${ch.num}`}
                    className="clay-card-compact px-4 py-3 rounded-xl font-bold text-xs transition flex items-center gap-1 border border-current/15 hover:border-sky-500"
                    title="Buka daftar pola tata bahasa bab ini"
                  >
                    Bunpou <ChevronRight className="w-3.5 h-3.5 text-sky-500" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
