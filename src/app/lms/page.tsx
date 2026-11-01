"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Layers, Award, Sparkles, CheckCircle2, ChevronRight, GraduationCap, Video, FileText, HelpCircle, Swords } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { COURSES_CATALOG } from "@/data/coursesCatalog";

export default function LmsPortalPage() {
  const allCourses = [
    ...COURSES_CATALOG.map((c) => ({
      id: c.id,
      title: c.title,
      desc: c.desc,
      level: c.level,
      totalChapters: c.totalChapters,
      status: c.status,
      badge: c.badge,
      badgeColor: c.badgeColor,
      href: c.href,
      kotobaCount: c.id === "irodori-a1" ? "1.285+" : c.id === "irodori-a2-1" ? "1.190+" : "1.770+",
      quizCount: c.id === "irodori-a1" ? "410+ Soal" : c.id === "irodori-a2-1" ? "450+ Soal" : "770+ Soal",
    })),
    {
      id: "shiken-jft-a2",
      title: "Shiken JFT-Basic A2 Real Simulation (CBT Engine)",
      desc: "Simulasi Ujian Uji Kompetensi JFT-Basic A2 berstandar The Japan Foundation dengan 4 sub-tes: Moji Goi, Kaiwa Hyougen, Choukai, Dokkai.",
      level: "Tryout Ujian Resmi",
      totalChapters: 8,
      status: "Siap Ujian",
      badge: "CBT Exam",
      badgeColor: "bg-rose-600 text-white",
      href: "/cbt",
      kotobaCount: "1.210+ Soal",
      quizCount: "4 Sub-Tes",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* HEADER */}
      <header className="clay-card border-b border-black/10 dark:border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black tracking-wider opacity-80 hover:opacity-100 transition uppercase">
          <ArrowLeft className="w-4 h-4 text-amber-500" /> Portal Belajar
        </Link>
        <div className="flex items-center gap-2.5 text-sm sm:text-base font-extrabold tracking-wide">
          <span className="p-1.5 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-md">
            <GraduationCap className="w-4 h-4 stroke-[2.5]" />
          </span>
          <span>E-Learning & LMS Irodori JP</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ThemeSwitcher />
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-current/20 bg-black/5 dark:bg-white/10 hidden sm:inline-block">
            大筒木クラス
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 sm:p-8 flex-1 flex flex-col gap-8 w-full">
        {/* BANNER LMS UTAMA */}
        <div className="clay-card rounded-3xl p-8 sm:p-10 border border-current/10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 border border-amber-500/30 px-3.5 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3 shadow-inner bg-amber-500/10 text-amber-600 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5" /> Sistem Pembelajaran Mandiri Terintegrasi
            </div>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight">
              E-Learning Silabus Irodori & CBT Shiken
            </h2>
            <p className="text-sm mt-3 leading-relaxed opacity-85">
              Struktur pembelajaran modular persis seperti sistem Moodle kampus, menggabungkan <strong>Slide Modul Tata Bahasa</strong>, <strong>Database Kotoba Audio Lengkap</strong>, dan <strong>Latihan Kuis CBT</strong> dalam satu ruang belajar terpadu.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full sm:w-auto">
            <Link
              href="/lms/irodori-a2-2"
              className="clay-btn-gold px-8 py-4 rounded-2xl font-black text-sm tracking-wider uppercase text-center shadow-xl hover:scale-105 transition"
            >
              Buka Kursus Irodori A2.2
            </Link>
          </div>
        </div>

        {/* DAFTAR KURSUS (COURSE LIST) */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              Daftar Kursus & Modul Terdaftar (My Courses)
            </h3>
            <span className="text-xs opacity-70 font-semibold">Tersambung ke Neon DB</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allCourses.map((c) => (
              <div
                key={c.id}
                className="clay-card rounded-2xl p-6 sm:p-7 border border-current/10 flex flex-col justify-between gap-6 hover:scale-[1.01] transition group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border border-current/15 bg-black/5 dark:bg-white/10">
                      {c.level}
                    </span>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${c.badgeColor}`}>
                      {c.badge}
                    </span>
                  </div>

                  <h4 className="font-black text-lg mt-4 group-hover:text-amber-500 transition">
                    {c.title}
                  </h4>
                  <p className="text-xs opacity-80 mt-2 leading-relaxed">
                    {c.desc}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-current/10 text-[11px] font-bold text-center">
                    <div className="bg-black/5 dark:bg-black/40 p-2.5 rounded-xl border border-current/10">
                      <span className="block font-black text-amber-500">{c.totalChapters}</span>
                      <span className="opacity-80">Bab Modul</span>
                    </div>
                    <div className="bg-black/5 dark:bg-black/40 p-2.5 rounded-xl border border-current/10">
                      <span className="block font-black text-amber-500">{c.kotobaCount}</span>
                      <span className="opacity-80">Kotoba/Materi</span>
                    </div>
                    <div className="bg-black/5 dark:bg-black/40 p-2.5 rounded-xl border border-current/10">
                      <span className="block font-black text-emerald-500">{c.quizCount}</span>
                      <span className="opacity-80">Latihan Kuis</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={c.href}
                    className="clay-btn w-full py-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2"
                  >
                    Buka Kelas Ini <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
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
