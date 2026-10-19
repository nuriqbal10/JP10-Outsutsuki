"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Layers, Award, Sparkles, CheckCircle2, ChevronRight, GraduationCap, Video, FileText, HelpCircle } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import GamificationBanner from "@/components/lms/GamificationBanner";
import DailyQuestsLeaderboardSection from "@/components/lms/DailyQuestsLeaderboardSection";

export default function LmsPortalPage() {
  const courses = [
    {
      id: "irodori-a2-2",
      title: "Irodori Bahasa Jepang untuk Kehidupan A2.2 (初級2)",
      desc: "Kurikulum resmi The Japan Foundation tingkat A2.2 (Bab 1 s.d. 18). Dilengkapi modul slide tata bahasa, daftar kotoba berakar kata, dan kuis latihan format CBT.",
      level: "A2.2 (Elementary 2)",
      totalChapters: 18,
      status: "Aktif & Tersedia",
      badge: "Utama",
      badgeColor: "bg-amber-400 text-stone-950",
      href: "/lms/irodori-a2-2",
      chapters: [
        { num: 1, title: "私のこと", topic: "Perkenalan Diri & Kehidupan di Jepang" },
        { num: 2, title: "どんな人ですか", topic: "Ciri Fisik, Karakter & Pakaian" },
        { num: 3, title: "おすすめは何ですか", topic: "Restoran, Makanan & Reservasi" },
        { num: 4, title: "何時からですか", topic: "Jam Kerja, Lembur & Jadwal" },
        { num: 5, title: "安全第一", topic: "Aturan Pabrik & Keselamatan K3" },
        { num: 6, title: "どうやって行きますか", topic: "Transportasi, Tiket & Rute" },
        { num: 7, title: "雨が降ったら、ホールでやります", topic: "Festival & Acara Komunitas" },
        { num: 8, title: "屋台はどこかわかりますか？", topic: "Denah Stan Festival & Posisi" },
        { num: 9, title: "成人の日は、何をするんですか？", topic: "Hari Libur Nasional & Perayaan Jepang" },
        { num: 10, title: "どんな服を着て行けばいいですか？", topic: "Etiket Menghadiri Acara & Pakaian" },
        { num: 11, title: "ポイントカードを忘れてしまいました", topic: "Berbelanja, Fitting & Kasir" },
        { num: 12, title: "このボタンを押すと、エコモードに変わります", topic: "Pengoperasian Alat Elektronik & Tombol" },
        { num: 13, title: "いろいろな資料を展示してあります", topic: "Fasilitas Umum, Balai Kota & Galeri" },
        { num: 14, title: "髪をもう少し短くしてください", topic: "Salon Rambut, Laundry & Kurir Paket" },
        { num: 15, title: "ゴミを減らすために、マイバッグを持っています", topic: "Pemilahan Sampah & Gaya Hidup Eco" },
        { num: 16, title: "地震が起きたら、どうすればいいですか？", topic: "Mitigasi Bencana & Keselamatan Jiwa" },
        { num: 17, title: "日本語が前より話せるようになりました", topic: "Pertumbuhan Diri & Refleksi di Jepang" },
        { num: 18, title: "将来、自分の会社を作ろうと思っています", topic: "Impian Masa Depan, Karir & SSW" },
      ]
    },
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
      chapters: []
    },
    {
      id: "irodori-a1",
      title: "Irodori A1 - Pemula (入門)",
      desc: "Dasar-dasar percakapan bahasa Jepang sehari-hari untuk pekerja migran dan pemelajar pemula (1.285 kosakata master).",
      level: "A1 (Starter)",
      totalChapters: 18,
      status: "Arsip Silabus",
      badge: "Dasar",
      badgeColor: "bg-stone-700 text-amber-200",
      href: "#",
      chapters: []
    },
    {
      id: "irodori-a2-1",
      title: "Irodori A2.1 - Tingkat Menengah Pertama (初級1)",
      desc: "Kelanjutan tata bahasa praktis percakapan kerja, kehidupan bermasyarakat, dan belanja (1.190 kosakata master).",
      level: "A2.1 (Elementary 1)",
      totalChapters: 18,
      status: "Arsip Silabus",
      badge: "Lanjutan",
      badgeColor: "bg-stone-700 text-amber-200",
      href: "#",
      chapters: []
    }
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

        {/* GAMIFICATION BASE (LEVEL, XP, STREAK & KOTOBA MINIGAME & BATTLE ROYALE) */}
        <GamificationBanner />

        {/* DAILY QUESTS & CLASS LEADERBOARD SECTION */}
        <DailyQuestsLeaderboardSection />

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
            {courses.map((c) => (
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
                      <span className="block font-black text-amber-500">1.770+</span>
                      <span className="opacity-80">Kotoba</span>
                    </div>
                    <div className="bg-black/5 dark:bg-black/40 p-2.5 rounded-xl border border-current/10">
                      <span className="block font-black text-emerald-500">770+</span>
                      <span className="opacity-80">Soal CBT</span>
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
