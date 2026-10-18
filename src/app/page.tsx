"use client";

export const runtime = "edge";

import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { BookOpen, Sparkles, Award, ArrowRight, ShieldCheck, Database, Cloud, Layers, CheckCircle2, Trophy } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import GamificationBanner from "@/components/lms/GamificationBanner";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 clay-card rounded-none border-x-0 border-t-0 border-b border-black/10 dark:border-white/10 px-6 py-3.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 p-1 rounded-xl bg-white dark:bg-stone-800 flex items-center justify-center border-2 border-amber-500/60 shadow-md shrink-0">
              <img
                src="/logo_outsutsuki.png"
                alt="Logo Outsutsuki"
                className="w-full h-full object-contain filter dark:invert"
              />
            </div>
            <div>
              <h1 className="font-extrabold tracking-tight text-lg flex items-center gap-2">
                OUTSUTSUKI PORTAL <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-current/20 bg-black/5 dark:bg-white/10">大筒木クラス</span>
              </h1>
              <p className="text-xs opacity-70 font-medium">Platform Eksklusif Irodori A2.2 & Persiapan JFT-Basic</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeSwitcher />
            <Link
              href="/rapor"
              className="text-xs font-bold px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:scale-105 transition flex items-center gap-1.5 shadow-sm"
            >
              <Trophy className="w-3.5 h-3.5" />
              Rapor Kelas
            </Link>
            <Link
              href="/admin"
              className="text-xs font-bold px-3 py-1.5 rounded-full border border-current/20 bg-black/5 dark:bg-white/10 hover:scale-105 transition flex items-center gap-1.5"
            >
              Portal Guru
            </Link>
            <SignedOut>
              <Link
                href="/sign-in"
                className="text-xs font-bold px-4 py-2 rounded-full border border-current/20 bg-black/5 dark:bg-white/10 hover:scale-105 transition shadow-sm"
              >
                Masuk
              </Link>
              <Link
                href="/sign-up"
                className="clay-btn-gold text-xs font-bold px-4 py-2 rounded-full transition shadow-md"
              >
                Daftar Akun
              </Link>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold opacity-80 hidden sm:inline-block">Siswa Outsutsuki</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 py-10 flex-1 flex flex-col gap-10 w-full">
        <section className="clay-card rounded-3xl p-8 sm:p-12 border border-current/10 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 text-xs font-semibold mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Eksklusif Kelas Outsutsuki • Kurikulum Irodori 初級2
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Portal Pembelajaran Bahasa Jepang <span className="text-amber-600 dark:text-amber-400">Kelas Outsutsuki</span>
            </h2>
            <p className="mt-4 opacity-85 text-sm sm:text-base leading-relaxed">
              Platform belajar resmi khusus siswa <strong>Kelas Outsutsuki</strong> untuk menguasai materi <strong>Irodori A2.2</strong>, mengerjakan 18 bab LKPD terstandar, menyimak audio otentik, dan mengikuti simulasi ujian JFT-Basic A2.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/rapor"
                className="clay-btn-gold px-6 py-3 rounded-full font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition inline-flex items-center gap-2"
              >
                🏆 Rapor Kelas Outsutsuki <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/lms"
                className="clay-btn px-6 py-3 rounded-full font-black text-sm shadow-md hover:scale-105 active:scale-95 transition inline-flex items-center gap-2"
              >
                🎓 Buka LMS Bab (1–18) <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cbt"
                className="px-6 py-3 rounded-full border border-current/20 bg-black/5 dark:bg-white/10 font-bold text-sm shadow-sm hover:scale-105 transition inline-flex items-center gap-2"
              >
                📝 Latihan CBT
              </Link>
              <Link
                href="/flashcard"
                className="px-6 py-3 rounded-full border border-current/20 bg-black/5 dark:bg-white/10 font-bold text-sm shadow-sm hover:scale-105 transition inline-flex items-center gap-2"
              >
                🎴 Flashcard 3D
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center relative z-10 shrink-0">
            <div className="relative p-2 rounded-3xl bg-gradient-to-br from-amber-500/30 via-rose-900/40 to-black/80 border-2 border-amber-500/50 shadow-2xl">
              <img
                src="/outsutsuki-crest.jpg"
                alt="Emblem Outsutsuki"
                className="w-56 h-56 sm:w-64 sm:h-64 object-cover rounded-2xl shadow-inner"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 border border-amber-400/50 px-4 py-1 rounded-full text-[11px] font-black text-amber-300 tracking-wider uppercase whitespace-nowrap shadow-lg">
                大筒木クラス専用
              </div>
            </div>
          </div>
        </section>

        {/* GAMIFICATION BASE (LEVEL, XP, STREAK & KOTOBA MINIGAME) */}
        <GamificationBanner />

        {/* SPOTLIGHT: RAPOR & RANKING OUTSUTSUKI */}
        <section className="clay-card p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 shrink-0 shadow-lg">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-[11px] font-black text-amber-500 uppercase tracking-widest mb-1.5">
                大筒木成績表 • 28 Siswa Resmi
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Rapor Kelas Outsutsuki & Radar Kompetensi 5 Pilar
              </h2>
              <p className="text-xs sm:text-sm opacity-75 mt-1 max-w-2xl leading-relaxed">
                Pantau leaderboard 28 siswa, grafik radar kompetensi (Moji-Goi, Kaiwa, Choukai, Dokkai, Kanji), animasi balapan nilai (Bar Chart Race Bab 1–18), dan cetak lembar rapor resmi berstandar CEFR/JF.
              </p>
            </div>
          </div>
          <Link
            href="/rapor"
            className="clay-btn-gold px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition inline-flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            Buka Rapor Lengkap ›
          </Link>
        </section>

        {/* 4 CORE MODULES GRID */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: CBT Simulation */}
          <div className="clay-card p-6 rounded-2xl border border-current/10 shadow-md flex flex-col justify-between gap-4 hover:-translate-y-1 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg">Simulasi CBT JFT-Basic</h3>
              <p className="text-xs opacity-75 mt-2 leading-relaxed">
                Ujian simulasi dengan timer resmi, audio Choukai, dan teks Dokkai autentik format 4 sub-tes.
              </p>
            </div>
            <Link href="/cbt" className="text-xs font-black text-amber-500 hover:underline flex items-center gap-1">
              Jalankan Simulasi ›
            </Link>
          </div>

          {/* Card 2: 3D Flashcard */}
          <div className="clay-card p-6 rounded-2xl border border-current/10 shadow-md flex flex-col justify-between gap-4 hover:-translate-y-1 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg">Flashcard Kosakata 3D</h3>
              <p className="text-xs opacity-75 mt-2 leading-relaxed">
                Kartu bolak-balik 3D dengan audio pelafalan asli, sistem Spaced Repetition (SRS), dan kuis kilat.
              </p>
            </div>
            <Link href="/flashcard" className="text-xs font-black text-amber-500 hover:underline flex items-center gap-1">
              Buka Flashcard ›
            </Link>
          </div>

          {/* Card 3: Kanji Studio */}
          <div className="clay-card p-6 rounded-2xl border border-current/10 shadow-md flex flex-col justify-between gap-4 hover:-translate-y-1 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg">Studio Huruf Kanji</h3>
              <p className="text-xs opacity-75 mt-2 leading-relaxed">
                Animasi urutan goresan (Stroke Order), latihan kotak 20-grid, dan lembar print-out A4 presisi.
              </p>
            </div>
            <Link href="/kanji" className="text-xs font-black text-amber-500 hover:underline flex items-center gap-1">
              Masuk Studio Kanji ›
            </Link>
          </div>

          {/* Card 4: Modul LMS & LKPD */}
          <div className="clay-card p-6 rounded-2xl border border-current/10 shadow-md flex flex-col justify-between gap-4 hover:-translate-y-1 transition">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg">Modul LMS & LKPD</h3>
              <p className="text-xs opacity-75 mt-2 leading-relaxed">
                Buku modul resmi PDF, audio otentik The Japan Foundation, dan lembar kerja peserta didik (LKPD) Bab 1 s.d. 18.
              </p>
            </div>
            <Link href="/lms" className="text-xs font-black text-amber-500 hover:underline flex items-center gap-1">
              Buka Modul Bab ›
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="clay-card rounded-none border-x-0 border-b-0 border-t border-black/10 dark:border-white/10 py-6 text-center text-xs opacity-60">
        <p>OUTSUTSUKI PORTAL • Irodori JFT-Basic A2 Curriculum Standards • 大筒木クラス</p>
      </footer>
    </div>
  );
}
