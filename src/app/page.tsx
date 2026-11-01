"use client";

export const runtime = "edge";

import React from "react";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import {
  BookOpen,
  Trophy,
  Swords,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Building2,
  Users,
  Heart,
  ChevronRight,
  Target,
  Sparkles,
  Layers,
  Award,
  Zap,
} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-800 dark:selection:text-amber-200">
      {/* ========================================================
          1. HEADER NAVIGASI BERSIH & ADAPTIF TERHADAP 6 TEMA
          ======================================================== */}
      <header className="sticky top-0 z-50 clay-card rounded-none border-x-0 border-t-0 border-b border-current/10 px-4 sm:px-8 py-3.5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Identitas Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 p-1 rounded-xl bg-white dark:bg-stone-900 border border-current/15 flex items-center justify-center shadow-md group-hover:scale-105 transition shrink-0">
              <img
                src="/logo_outsutsuki.png"
                alt="Logo Outsutsuki"
                className="w-full h-full object-contain filter dark:invert"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-wide uppercase font-serif">
                  Ōtsutsuki Portal
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  大筒木クラス
                </span>
              </div>
              <p className="text-[11px] opacity-70 font-medium hidden sm:block">
                Platform Pembelajaran &amp; Evaluasi Akademik Irodori A2.2
              </p>
            </div>
          </Link>

          {/* Navigasi Utama Terpadu */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-black/5 dark:bg-white/5 border border-current/10 text-xs font-bold">
            <Link
              href="/lms"
              className="px-3 py-1.5 rounded-full opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>LMS Silabus</span>
            </Link>
            <Link
              href="/bunpou"
              className="px-3 py-1.5 rounded-full opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition flex items-center gap-1.5"
            >
              <span>📖 Bunpou</span>
            </Link>
            <Link
              href="/kanji"
              className="px-3 py-1.5 rounded-full opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition flex items-center gap-1.5"
            >
              <span>✍️ Kanji</span>
            </Link>
            <Link
              href="/flashcard"
              className="px-3 py-1.5 rounded-full opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition flex items-center gap-1.5"
            >
              <span>🎴 Kotoba 3D</span>
            </Link>
            <Link
              href="/rapor"
              className="px-3 py-1.5 rounded-full opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Rapor Kelas</span>
            </Link>
            <Link
              href="/arena"
              className="px-3 py-1.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 hover:scale-105 transition flex items-center gap-1.5 font-black"
            >
              <Swords className="w-3.5 h-3.5 text-purple-500" />
              <span>Shinobi Arena</span>
            </Link>
          </nav>

          {/* Sisi Kanan: Theme Switcher, Portal Guru & Akun */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher />

            <Link
              href="/admin"
              className="hidden lg:inline-flex text-xs font-bold px-3 py-1.5 rounded-xl border border-current/15 bg-black/5 dark:bg-white/5 hover:scale-105 transition"
            >
              Portal Guru
            </Link>

            <SignedOut>
              <Link
                href="/sign-in"
                className="text-xs font-bold px-3.5 py-1.5 rounded-xl border border-current/15 hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                Masuk
              </Link>
              <Link
                href="/sign-up"
                className="clay-btn-gold text-xs font-black px-4 py-1.5 rounded-xl transition shadow-md"
              >
                Daftar
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold opacity-80 hidden xl:inline-block">Siswa Otsutsuki</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        </div>
      </header>

      {/* ========================================================
          2. MAIN CONTENT AREA
          ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-12 flex-1 flex flex-col gap-10 sm:gap-14 w-full">
        {/* ======================================================
            HERO SECTION: FOKUS, PRESTISIUS & HIERARKI DUAL CTA
            ====================================================== */}
        <section className="clay-card rounded-3xl p-6 sm:p-10 md:p-12 border border-current/10 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl relative z-10 space-y-4">
            {/* Tagline Akreditasi Resmi */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Standard: The Japan Foundation • Kurikulum Irodori 初級2 (A2.2)
            </div>

            {/* Judul Utama */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight font-serif">
              Portal Pembelajaran &amp; Evaluasi Akademik Bahasa Jepang{" "}
              <span className="text-amber-600 dark:text-amber-400">Kelas Outsutsuki</span>
            </h1>

            {/* Deskripsi Lugas */}
            <p className="opacity-80 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Pusat ekosistem resmi siswa <strong>Kelas Outsutsuki</strong> untuk menguasai silabus <strong>Irodori A2.2</strong>, mengerjakan 18 bab LKPD terstandar, menyimak audio otentik, dan memantau kemajuan akademik menuju kelulusan <strong>JFT-Basic A2</strong>.
            </p>

            {/* DUAL CALL TO ACTION: HIERARKI SANGAT JELAS */}
            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              {/* Primary CTA: Buka Rapor Kelas */}
              <Link
                href="/rapor"
                className="clay-btn-gold px-7 py-3.5 rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition inline-flex items-center gap-2.5 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                <span>Buka Rapor Akademik Kelas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Secondary CTA: Buka LMS Silabus */}
              <Link
                href="/lms"
                className="px-6 py-3.5 rounded-2xl border border-current/20 bg-black/5 dark:bg-white/10 font-bold text-sm hover:scale-105 active:scale-95 transition inline-flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <span>Mulai Belajar di LMS (Bab 1–18)</span>
              </Link>

              {/* Tertiary Accent: Shinobi Arena */}
              <Link
                href="/arena"
                className="px-5 py-3.5 rounded-2xl border border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold text-sm hover:scale-105 transition inline-flex items-center gap-2 cursor-pointer"
              >
                <Swords className="w-4 h-4 text-purple-500" />
                <span>Shinobi Arena (Dojo N4)</span>
              </Link>
            </div>
          </div>

          {/* Sisi Kanan: Emblem Resmi Outsutsuki */}
          <div className="flex flex-col items-center justify-center relative z-10 shrink-0">
            <div className="relative p-2.5 rounded-3xl bg-gradient-to-br from-amber-500/20 via-black/20 to-black/60 border-2 border-amber-500/40 shadow-2xl">
              <img
                src="/outsutsuki-crest.jpg"
                alt="Emblem Outsutsuki"
                className="w-52 h-52 sm:w-64 sm:h-64 object-cover rounded-2xl shadow-inner"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/85 border border-amber-400/50 px-4 py-1 rounded-full text-[11px] font-black text-amber-300 tracking-wider uppercase whitespace-nowrap shadow-lg">
                大筒木クラス専用 • A2.2
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            3. CLASS METRICS STRIP (INDIKATOR UTAMA KELAS)
            ====================================================== */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="clay-card p-4 sm:p-5 rounded-2xl border border-current/10 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0 font-black">
              28
            </div>
            <div>
              <div className="text-sm font-black">Siswa Resmi</div>
              <div className="text-[11px] opacity-70">NIM JP10-180xxxx</div>
            </div>
          </div>

          <div className="clay-card p-4 sm:p-5 rounded-2xl border border-current/10 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0 font-black">
              18
            </div>
            <div>
              <div className="text-sm font-black">Bab Silabus LKPD</div>
              <div className="text-[11px] opacity-70">Irodori Shokyu 2</div>
            </div>
          </div>

          <div className="clay-card p-4 sm:p-5 rounded-2xl border border-current/10 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-500 shrink-0 font-black">
              85%
            </div>
            <div>
              <div className="text-sm font-black">Standar KKM Kelas</div>
              <div className="text-[11px] opacity-70">Evaluasi Ketuntasan</div>
            </div>
          </div>

          <div className="clay-card p-4 sm:p-5 rounded-2xl border border-current/10 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-500 shrink-0 font-black">
              200
            </div>
            <div>
              <div className="text-sm font-black">Target JFT / 250 pt</div>
              <div className="text-[11px] opacity-70">Kesiapan Kerja Prometric</div>
            </div>
          </div>
        </section>

        {/* ======================================================
            4. SHOWCASE 3 GERBANG UTAMA (BENTO GRID HIERARKI JELAS)
            ====================================================== */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-current/10 pb-3">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-amber-500">
                PONDASI PLATFORM
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-serif tracking-tight">
                Tiga Gerbang Utama Layanan Terpadu
              </h2>
            </div>
            <p className="text-xs opacity-70 max-w-md">
              Pilih pilar yang sesuai dengan agenda belajar, evaluasi nilai resmi, atau latihan mandiri Anda hari ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Gerbang 1: Portal Akademik & LMS Silabus */}
            <div className="clay-card p-6 sm:p-7 rounded-3xl border border-current/10 shadow-xl flex flex-col justify-between transition hover:-translate-y-1 relative group overflow-hidden">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  GERBANG 1 • KURIKULUM RESMI
                </span>
                <h3 className="text-lg font-black mt-2.5">
                  Portal Akademik &amp; LMS Silabus
                </h3>
                <p className="text-xs opacity-75 mt-2 leading-relaxed">
                  Akses lengkap 3 tingkatan resmi Japan Foundation (A1, A2.1, A2.2) total 54 Bab modul terintegrasi, audio penutur asli JF, lembar LKPD, Studio Huruf Kanji, dan Flashcard 3D.
                </p>

                <div className="mt-4 pt-3 border-t border-current/10 space-y-1.5 text-xs opacity-80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Silabus 3 Tingkat (A1 • A2.1 • A2.2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Latihan Huruf Kanji &amp; Flashcard SRS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Simulasi Ujian CBT Format Resmi</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/lms"
                  className="w-full py-3 px-4 rounded-xl border border-current/20 bg-black/5 dark:bg-white/10 hover:bg-amber-500 hover:text-stone-950 font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <span>Buka Silabus Bab 1–18</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Gerbang 2: Eksekutif Rapor & Evaluasi Terpadu */}
            <div className="clay-card p-6 sm:p-7 rounded-3xl border-2 border-amber-500/50 shadow-2xl flex flex-col justify-between transition hover:-translate-y-1 relative group overflow-hidden bg-gradient-to-b from-amber-500/5 via-transparent to-transparent">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition font-black">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 shadow-sm">
                  GERBANG 2 • PRESTASI RESMI
                </span>
                <h3 className="text-lg font-black mt-2.5">
                  Rapor Kelas &amp; Proyeksi Stitch
                </h3>
                <p className="text-xs opacity-75 mt-2 leading-relaxed">
                  Buku nilai akademik 28 siswa klan Outsutsuki dengan NIM resmi (`JP10-180xxxx`), radar kompetensi 5 pilar, matriks diagnostik 18 bab, dan forecasting nilai ujian akhir 250 pt.
                </p>

                <div className="mt-4 pt-3 border-t border-current/10 space-y-1.5 text-xs opacity-80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>4 Persona: Guru, Kepsek, Siswa, Wali</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Radar Grafik 5 Pilar &amp; Bar Race Nilai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Cetak Lembar Rapor Resmi Prestisius</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/rapor"
                  className="clay-btn-gold w-full py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
                >
                  <span>Masuk Ruang Rapor Kelas</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Gerbang 3: Shinobi Arcade & Dojo N4 */}
            <div className="clay-card p-6 sm:p-7 rounded-3xl border border-purple-500/40 shadow-xl flex flex-col justify-between transition hover:-translate-y-1 relative group overflow-hidden bg-gradient-to-b from-purple-500/5 via-transparent to-transparent">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition">
                  <Swords className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                  GERBANG 3 • GAMIFIKASI &amp; DOJO
                </span>
                <h3 className="text-lg font-black mt-2.5">
                  Shinobi Arcade &amp; Dojo N4
                </h3>
                <p className="text-xs opacity-75 mt-2 leading-relaxed">
                  Latihan mandiri 6 sektor kompetensi N4 / JFT-A2 (Choukai s/d Dokkai), Bunpou Sentence Puzzle 264 pola kalimat, ZEP Virtual 2D, dan Leaderboard Game 28 Siswa (100% terpisah dari rapor).
                </p>

                <div className="mt-4 pt-3 border-t border-current/10 space-y-1.5 text-xs opacity-80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Dojo 6 Sektor N4 &amp; Furigana Toggle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Leaderboard Khusus Game Non-Akademik</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Colosseum PvP &amp; Audio Synthesizer</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/arena"
                  className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
                >
                  <span>Masuk Shinobi Arena</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            5. FASILITAS & STUDIO BELAJAR MANDIRI (KOTOBA, KANJI, BUNPOU, CBT)
            ====================================================== */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-current/10 pb-3">
            <div>
              <span className="text-[10px] font-black tracking-widest uppercase text-amber-500">
                SARANA PEMBELAJARAN TERINTEGRASI
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-serif tracking-tight">
                Studio &amp; Laboratorium Belajar Mandiri
              </h2>
            </div>
            <p className="text-xs opacity-70 max-w-md">
              Akses cepat instrumen penguasaan huruf, perbendaharaan kata, kaidah tata bahasa, dan simulasi ujian komputer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Card 1: Bunpou */}
            <Link
              href="/bunpou"
              className="clay-card p-5 rounded-2xl border border-current/10 hover:border-amber-500/50 hover:scale-[1.02] transition flex flex-col justify-between gap-4 group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 group-hover:scale-110 transition text-lg">
                    📖
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    264 Pola Kalimat
                  </span>
                </div>
                <h3 className="font-black text-base group-hover:text-amber-500 transition">
                  Pustaka Tata Bahasa Bunpou
                </h3>
                <p className="text-xs opacity-75 mt-1.5 leading-relaxed">
                  Daftar rumus resmi Japan Foundation (A1, A2.1, A2.2) dengan arti bahasa Indonesia, contoh kalimat, dan audio pelafalan.
                </p>
              </div>
              <div className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1 pt-2 border-t border-current/10">
                <span>Buka Bunpou List</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Card 2: Kanji */}
            <Link
              href="/kanji"
              className="clay-card p-5 rounded-2xl border border-current/10 hover:border-purple-500/50 hover:scale-[1.02] transition flex flex-col justify-between gap-4 group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-500 group-hover:scale-110 transition text-lg">
                    ✍️
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                    Animasi Stroke Order
                  </span>
                </div>
                <h3 className="font-black text-base group-hover:text-purple-500 transition">
                  Studio Master Huruf Kanji
                </h3>
                <p className="text-xs opacity-75 mt-1.5 leading-relaxed">
                  Lembar kisi-kisi (20-Grid Box), animasi urutan goresan stroke SVG, dan lembar print-out latihan menulis kanji presisi A4.
                </p>
              </div>
              <div className="text-xs font-black text-purple-600 dark:text-purple-400 flex items-center gap-1 pt-2 border-t border-current/10">
                <span>Buka Studio Kanji</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Card 3: Kotoba 3D Flashcard */}
            <Link
              href="/flashcard"
              className="clay-card p-5 rounded-2xl border border-current/10 hover:border-rose-500/50 hover:scale-[1.02] transition flex flex-col justify-between gap-4 group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 group-hover:scale-110 transition text-lg">
                    🎴
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    4.245 Kosakata 3D
                  </span>
                </div>
                <h3 className="font-black text-base group-hover:text-rose-500 transition">
                  Studio Kotoba Flashcard 3D
                </h3>
                <p className="text-xs opacity-75 mt-1.5 leading-relaxed">
                  Kartu bolak-balik interaktif 3D tactile, pelafalan audio native Jepang, dan pelacak pengulangan berjarak (SRS Algorithm).
                </p>
              </div>
              <div className="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-1 pt-2 border-t border-current/10">
                <span>Mulai Flashcard 3D</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </Link>

            {/* Card 4: CBT Simulator */}
            <Link
              href="/cbt"
              className="clay-card p-5 rounded-2xl border border-current/10 hover:border-emerald-500/50 hover:scale-[1.02] transition flex flex-col justify-between gap-4 group shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition text-lg">
                    💻
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    1.210 Butir Soal
                  </span>
                </div>
                <h3 className="font-black text-base group-hover:text-emerald-500 transition">
                  Simulator CBT JFT-Basic
                </h3>
                <p className="text-xs opacity-75 mt-1.5 leading-relaxed">
                  Simulasi 4 sub-tes berstandar Prometric: Moji-Goi, Kaiwa-Hyougen, Choukai (audio max 2x), dan Dokkai dengan timer presisi.
                </p>
              </div>
              <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-2 border-t border-current/10">
                <span>Buka Simulator CBT</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          </div>
        </section>

        {/* ======================================================
            6. PANDUAN MULTI-STAKEHOLDER (4 PERAN PENGGUNA)
            ====================================================== */}
        <section className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                PANDUAN PENGGUNA
              </span>
              <h3 className="text-lg sm:text-xl font-black font-serif">
                Akses Disesuaikan untuk Setiap Pihak
              </h3>
            </div>
            <p className="text-xs opacity-70">
              Navigasi intuitif dirancang khusus untuk kenyamanan murid, guru, pimpinan, dan orang tua.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Persona Siswa */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold">Peserta Didik</h4>
              <p className="text-xs opacity-75 leading-relaxed">
                Pelajari materi bab harian, unduh lembar LKPD, dan latih kesiapan JFT di dojo mandiri.
              </p>
              <Link href="/lms" className="text-xs font-bold text-amber-500 hover:underline inline-flex items-center gap-1 pt-1">
                Buka Modul ›
              </Link>
            </div>

            {/* Persona Guru */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold">Sensei &amp; Guru</h4>
              <p className="text-xs opacity-75 leading-relaxed">
                Evaluasi nilai per bab, pantau ketuntasan KKM 85%, dan cetak lembar rapor resmi siswa.
              </p>
              <Link href="/rapor" className="text-xs font-bold text-blue-500 hover:underline inline-flex items-center gap-1 pt-1">
                Buku Nilai ›
              </Link>
            </div>

            {/* Persona Kepala Sekolah */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-500 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold">Kepala Sekolah</h4>
              <p className="text-xs opacity-75 leading-relaxed">
                Tinjau ringkasan eksekutif, analisis gap 5 pilar, dan proyeksi kelulusan JFT kelas.
              </p>
              <Link href="/rapor" className="text-xs font-bold text-purple-500 hover:underline inline-flex items-center gap-1 pt-1">
                Lensa Eksekutif ›
              </Link>
            </div>

            {/* Persona Wali Murid */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-500 flex items-center justify-center font-bold">
                <Heart className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold">Wali Murid</h4>
              <p className="text-xs opacity-75 leading-relaxed">
                Pantau pencapaian putra/putri tercinta dengan bahasa yang ramah dan apresiatif.
              </p>
              <Link href="/rapor" className="text-xs font-bold text-rose-500 hover:underline inline-flex items-center gap-1 pt-1">
                Portal Keluarga ›
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================
          6. FOOTER RESMI BERSIH
          ======================================================== */}
      <footer className="clay-card rounded-none border-x-0 border-b-0 border-t border-current/10 py-6 text-center text-xs opacity-70">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-bold">
            OUTSUTSUKI ACADEMIA • Platform Pembelajaran &amp; Evaluasi Bahasa Jepang
          </p>
          <p className="text-[11px] opacity-60">
            Standard: The Japan Foundation (Irodori 初級2 / A2.2) • JF Standard for Japanese-Language Education • 大筒木クラス
          </p>
        </div>
      </footer>
    </div>
  );
}
