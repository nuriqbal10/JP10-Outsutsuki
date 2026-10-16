"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Trophy,
  Search,
  Filter,
  BarChart2,
  Award,
  BookOpen,
  CheckCircle2,
  Printer,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileText,
  User,
  Users,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { LevelRaporData, StudentRaporItem } from "@/types/rapor";
import OfficialReportPrintModal from "@/components/rapor/OfficialReportPrintModal";
import StudentDetailModal from "@/components/rapor/StudentDetailModal";
import BarRaceView from "@/components/rapor/BarRaceView";
import DiagnosticMatrixView from "@/components/rapor/DiagnosticMatrixView";
import masterRaporData from "@/data/raporMasterData.json";

export default function RaporDashboardPage() {
  const [selectedLevel, setSelectedLevel] = useState<"A1" | "A21" | "A22">("A22");
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "grandprix" | "heatmap" | "feedback" | "portal">("overview");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Instant State
  const [raporData, setRaporData] = useState<LevelRaporData | null>(() => {
    const raw = (masterRaporData as any).levels.A22;
    if (!raw) return null;
    const ranked = [...raw.students].sort((a: any, b: any) => {
      const scoreA = a.compositeScore ?? a.summary?.compositeScore ?? 0;
      const scoreB = b.compositeScore ?? b.summary?.compositeScore ?? 0;
      return scoreB - scoreA;
    });
    return {
      ...raw,
      rankedStudents: ranked,
    };
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("all");

  // Modal State
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentRaporItem | null>(null);
  const [selectedStudentForPrint, setSelectedStudentForPrint] = useState<StudentRaporItem | null>(null);

  // Student Portal State
  const [portalStudentId, setPortalStudentId] = useState<number>(1);

  // KKM Setting State (disinkronkan dengan localStorage)
  const [kkm, setKkm] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("outsutsuki_kkm");
        if (saved && !isNaN(Number(saved))) return Number(saved);
      } catch {}
    }
    return 85;
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem("outsutsuki_kkm");
        if (saved && !isNaN(Number(saved))) setKkm(Number(saved));
      } catch {}
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Fetch data saat ganti level
  useEffect(() => {
    async function fetchRapor() {
      try {
        setLoading(true);
        const res = await fetch(`/api/rapor?level=${selectedLevel}`);
        const json = await res.json();
        if (json.success) {
          setRaporData(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat data rapor:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRapor();
  }, [selectedLevel]);

  // Filter siswa
  const filteredStudents = (raporData?.rankedStudents || []).filter((s) => {
    const matchName = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGrade = selectedGrade === "all" || s.grade === selectedGrade;
    return matchName && matchGrade;
  });

  const top3 = (raporData?.rankedStudents || []).slice(0, 3);
  const portalStudent = (raporData?.students || []).find((s) => s.no === portalStudentId) || raporData?.students[0];

  const viewTitles = {
    overview: "Ikhtisar & Ringkasan Eksekutif (統括概要)",
    students: "Buku Nilai Akademik (成績一覧表 - 28 Siswa)",
    grandprix: "Dinamika Progres Nilai (進捗推移 - 18 Bab)",
    heatmap: "Matriks Diagnostik 18 Bab (達成度マトリックス)",
    feedback: "Catatan & Evaluasi Shihan (師範講評)",
    portal: "Portal Individual Siswa (個別成績照会)",
  };

  const levelTitles = {
    A1: "Tingkat Dasar (入門 A1)",
    A21: "Tingkat Lanjutan 1 (初級1 A2.1)",
    A22: "Tingkat Lanjutan 2 (初級2 A2.2)",
  };

  const navItems = [
    { id: "overview", label: "Ringkasan Eksekutif", sub: "Statistik & Podium Juara", icon: BarChart2 },
    { id: "students", label: "Buku Nilai (28 Siswa)", sub: "Rekap Nilai Komulatif", icon: Users },
    { id: "grandprix", label: "Dinamika Progres Nilai", sub: "Kemajuan Bab 1 s.d. 18", icon: TrendingUp },
    { id: "heatmap", label: "Matriks Diagnostik Bab", sub: "Evaluasi Ketuntasan Bab", icon: SlidersHorizontal },
    { id: "feedback", label: "Catatan & Evaluasi Shihan", sub: "Rekomendasi Individual", icon: Award },
    { id: "portal", label: "Portal Individual Siswa", sub: "Cetak Rapor Per Siswa", icon: User },
  ];

  const levelOptions = [
    { id: "A1", label: "入門 A1", name: "Tingkat Dasar (A1)" },
    { id: "A21", label: "初級1 A2.1", name: "Tingkat Lanjutan 1 (A2.1)" },
    { id: "A22", label: "初級2 A2.2", name: "Tingkat Lanjutan 2 (A2.2)" },
  ];

  return (
    <div className="min-h-screen flex font-sans relative selection:bg-amber-500/20 selection:text-amber-800 dark:selection:text-amber-200">
      {/* ========================================================
          1. DESKTOP SIDEBAR NAVIGATOR (CLAYMORPHISM LUXURY)
          ======================================================== */}
      <aside className="hidden lg:flex w-72 flex-col shrink-0 sticky top-0 h-screen clay-sidebar p-5 justify-between z-40 overflow-y-auto">
        <div className="space-y-6">
          {/* Identitas Brand Klan Outsutsuki */}
          <Link
            href="/"
            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition group"
            title="Kembali ke Beranda Portal"
          >
            <div className="w-11 h-11 p-1 rounded-xl bg-white dark:bg-stone-900 border border-current/15 flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <img
                src="/logo_outsutsuki.png"
                alt="Emblem Klan Otsutsuki"
                className="w-full h-full object-contain filter dark:invert"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-wide uppercase font-serif">
                  Ōtsutsuki
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  大筒木
                </span>
              </div>
              <p className="text-[10px] opacity-70 font-medium">Sistem Evaluasi Akademik</p>
            </div>
          </Link>

          {/* Level Switcher (Segmented Clay Pills) */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60 px-2 block">
              Tingkat Kurikulum
            </span>
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-current/10">
              {levelOptions.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id as any)}
                  className={`py-1.5 rounded-lg text-[11px] font-extrabold transition cursor-pointer text-center ${
                    selectedLevel === lvl.id
                      ? "bg-amber-500 text-stone-950 shadow-sm"
                      : "opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {lvl.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Navigasi Utama Panel Rapor */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60 px-2 block">
              Navigator Analisis
            </span>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`clay-nav-btn ${isActive ? "clay-nav-btn-active" : ""}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-500" : "opacity-70"}`} />
                    <div className="text-left flex-1 min-w-0">
                      <span className="block truncate leading-tight">{item.label}</span>
                      <span className="block text-[10px] opacity-60 truncate font-normal">{item.sub}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Modul Akademik Terpadu */}
          <div className="space-y-1.5 pt-2 border-t border-current/10">
            <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60 px-2 block">
              Modul Akademik Terpadu
            </span>
            <div className="space-y-0.5">
              <Link
                href="/lms/irodori-a2-2"
                className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-500" /> LMS Silabus 12 Bab
                </span>
                <ChevronRight className="w-3 h-3 opacity-40" />
              </Link>
              <Link
                href="/cbt"
                className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" /> Simulasi CBT JFT
                </span>
                <ChevronRight className="w-3 h-3 opacity-40" />
              </Link>
              <Link
                href="/kanji"
                className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-amber-500" /> Studio Huruf Kanji
                </span>
                <ChevronRight className="w-3 h-3 opacity-40" />
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-current/10 space-y-3">
          <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold text-xs flex items-center justify-center border border-amber-500/30 shrink-0">
              伊
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-extrabold truncate">イクバル先生</div>
              <div className="text-[10px] opacity-60 truncate">Shihan Penanggung Jawab</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <ThemeSwitcher compact={false} />
            {top3[0] && (
              <button
                onClick={() => setSelectedStudentForPrint(top3[0])}
                className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-400 border border-amber-500/30 transition cursor-pointer"
                title="Cetak Rapor Resmi Juara I"
              >
                <Printer className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================
          MOBILE DRAWER SIDEBAR (TAMPIL DI LAYAR HP/TABLET)
          ======================================================== */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full clay-sidebar p-5 flex flex-col justify-between z-10 overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-2.5"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  <div className="w-9 h-9 p-1 rounded-xl bg-white dark:bg-stone-900 border border-current/15 flex items-center justify-center shadow-sm">
                    <img
                      src="/logo_outsutsuki.png"
                      alt="Logo Outsutsuki"
                      className="w-full h-full object-contain filter dark:invert"
                    />
                  </div>
                  <div>
                    <span className="font-extrabold text-sm uppercase">Ōtsutsuki</span>
                    <p className="text-[9px] opacity-60">Sistem Evaluasi Rapor</p>
                  </div>
                </Link>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg opacity-70 hover:opacity-100 bg-black/5 dark:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Level Switcher */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60 px-1 block">
                  Pilih Tingkat Kurikulum
                </span>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-current/10">
                  {levelOptions.map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => {
                        setSelectedLevel(lvl.id as any);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`py-1.5 rounded-lg text-[10px] font-bold text-center ${
                        selectedLevel === lvl.id
                          ? "bg-amber-500 text-stone-950 font-black shadow-xs"
                          : "opacity-75"
                      }`}
                    >
                      {lvl.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Nav Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60 px-1 block">
                  Menu Utama
                </span>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`clay-nav-btn ${isActive ? "clay-nav-btn-active" : ""}`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-500" : "opacity-70"}`} />
                      <div className="text-left flex-1 min-w-0">
                        <span className="block truncate">{item.label}</span>
                        <span className="block text-[10px] opacity-60 font-normal">{item.sub}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Modul Shortcuts */}
              <div className="space-y-1 pt-3 border-t border-current/10">
                <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60 px-1 block">
                  Modul Portal
                </span>
                <Link
                  href="/lms/irodori-a2-2"
                  className="block p-2 rounded-xl text-xs font-semibold opacity-75 hover:opacity-100"
                >
                  LMS Silabus &amp; LKPD
                </Link>
                <Link
                  href="/cbt"
                  className="block p-2 rounded-xl text-xs font-semibold opacity-75 hover:opacity-100"
                >
                  Simulasi Ujian CBT
                </Link>
                <Link
                  href="/kanji"
                  className="block p-2 rounded-xl text-xs font-semibold opacity-75 hover:opacity-100"
                >
                  Studio Huruf Kanji
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-current/10 flex items-center justify-between">
              <ThemeSwitcher compact={false} />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN CONTENT AREA (WRAPPER SISI KANAN)
          ======================================================== */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* TOP BAR / COMMAND HEADER */}
        <header className="sticky top-0 z-30 px-4 sm:px-8 py-3 w-full border-b border-current/10 backdrop-blur-xl bg-black/5 dark:bg-black/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Hamburger Button untuk Mobile */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-black/5 dark:bg-white/10 border border-current/15 hover:scale-105 transition"
              title="Buka Menu Navigator"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Tampilan Aktif */}
            <div>
              <div className="flex items-center gap-2 text-[11px] opacity-70">
                <span>Ōtsutsuki Academia</span>
                <span>›</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  {selectedLevel === "A22" ? "初級2 A2.2" : selectedLevel === "A21" ? "初級1 A2.1" : "入門 A1"}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight font-serif truncate max-w-xs sm:max-w-md">
                {viewTitles[activeTab]}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Badges Indikator Kelas */}
            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-current/10 font-medium">
                Rata-Rata: <strong className="text-amber-600 dark:text-amber-400">{raporData?.classSummary?.classAverage || 73.8}</strong>
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                Ketuntasan: 100%
              </span>
            </div>

            {/* Quick Print Button */}
            {top3[0] && (
              <button
                onClick={() => setSelectedStudentForPrint(top3[0])}
                className="clay-btn-gold hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                title="Cetak Laporan Hasil Belajar Siswa Peringkat I"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Rapor</span>
              </button>
            )}

            <ThemeSwitcher />
          </div>
        </header>

        {/* Mobile Quick-Scroll Pill Bar */}
        <div className="lg:hidden px-4 py-2 border-b border-current/10 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs bg-black/5 dark:bg-black/20">
          {navItems.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveTab(m.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                activeTab === m.id
                  ? "bg-amber-500 text-stone-950 shadow-xs"
                  : "bg-black/5 dark:bg-white/10 opacity-75"
              }`}
            >
              {m.label.split(" ")[0]}
            </button>
          ))}
        </div>

      {/* ========================================================
          2. KONTEN UTAMA DASHBOARD
          ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 flex-1 w-full">
        {/* HERO BANNER EKSEKUTIF KLAN OUTSUTSUKI */}
        <section className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 relative overflow-hidden shadow-xl">
          {/* Watermark Lambang Otsutsuki Halus */}
          <svg className="watermark-ootsutsuki opacity-[0.03] dark:opacity-[0.06]" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 3" />
            <path d="M 50 16 C 30 16 16 31 16 50 C 16 69 30 84 50 84 C 36 73 32 49 43 31 C 47 23 49 18 50 16 Z" />
            <circle cx="68" cy="34" r="4" />
            <circle cx="76" cy="50" r="4" />
            <circle cx="68" cy="66" r="4" />
          </svg>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  {levelTitles[selectedLevel]}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold opacity-70 bg-black/5 dark:bg-white/10 border border-current/10">
                  Total Terdaftar: 28 Peserta Didik Resmi
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-serif">
                Laporan Kemajuan Akademik Kelas Outsutsuki
              </h1>
              <p className="text-xs sm:text-sm opacity-75 leading-relaxed">
                Evaluasi komprehensif penguasaan 4 aspek kompetensi (Moji-Goi, Kaiwa, Choukai, Dokkai) dan Kanji praktis berstandar Japan Foundation CEFR/JF.
              </p>

              {/* 3 Indikator Utama Eksekutif */}
              <div className="grid grid-cols-3 gap-3 pt-3 max-w-lg">
                <div className="clay-card-compact p-3.5 rounded-2xl text-center">
                  <span className="text-[11px] opacity-70 block font-medium">Rata-Rata Kelas</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5 block">
                    {raporData?.classSummary?.classAverage || 73.8}
                  </span>
                  <span className="text-[10px] opacity-60">Skala 100 pt</span>
                </div>
                <div className="clay-card-compact p-3.5 rounded-2xl text-center">
                  <span className="text-[11px] opacity-70 block font-medium">Ketuntasan KKM</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    100%
                  </span>
                  <span className="text-[10px] opacity-60">28 / 28 Siswa</span>
                </div>
                <div className="clay-card-compact p-3.5 rounded-2xl text-center">
                  <span className="text-[11px] opacity-70 block font-medium">Skor Tertinggi</span>
                  <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5 block">
                    {top3[0]?.compositeScore || 94.0}
                  </span>
                  <span className="text-[10px] opacity-60">Peringkat Kehormatan</span>
                </div>
              </div>
            </div>

            {/* Kartu Ringkasan Standar Pengesahan Akademik */}
            <div className="clay-card-compact p-5 rounded-2xl max-w-sm w-full space-y-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/40 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">Pengesahan Kurikulum Resmi</h4>
                  <span className="text-[10px] opacity-60">Klan Outsutsuki • 大筒木一族</span>
                </div>
              </div>
              <p className="text-[11px] opacity-75 leading-normal">
                Nilai akhir dikalkulasi dari rata-rata harian 18 bab (40%), ujian berkala Fukushuu 1 s.d. 3 (30%), serta ujian komprehensif akhir (30%).
              </p>
              <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                <span className="opacity-70">Instruktur Penanggung Jawab:</span>
                <strong className="text-amber-600 dark:text-amber-400">イクバル先生</strong>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            PANEL 1: RINGKASAN EKSEKUTIF & PLAKAT KEHORMATAN (OVERVIEW)
            ======================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Plakat Kehormatan 3 Besar (Honor Roll - 優秀賞) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold tracking-tight font-serif flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    Plakat Kehormatan Akademik (優秀賞)
                  </h2>
                  <p className="text-xs opacity-70 mt-0.5">
                    Tiga peringkat tertinggi berdasarkan pencapaian akumulatif seluruh komponen ujian
                  </p>
                </div>
                <span className="text-xs font-semibold opacity-60 hidden sm:inline-block">
                  Standar Akreditasi Klan Outsutsuki
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-2">
                {/* Peringkat II (Perak / 次席) */}
                {top3[1] && (
                  <div
                    onClick={() => setSelectedStudentForPrint(top3[1])}
                    className="clay-podium-2 order-2 md:order-1 p-6 rounded-3xl text-center relative cursor-pointer hover:scale-[1.02] transition shadow-md group"
                    title="Klik untuk membuka lembar rapor resmi"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center mx-auto mb-3 border border-slate-300 dark:border-slate-700">
                      II
                    </div>
                    <div className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-base text-white bg-slate-700 shadow-sm">
                      {top3[1].name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Peringkat Kedua (次席)
                    </span>
                    <h3 className="font-bold text-base truncate mt-0.5 group-hover:text-amber-500 transition">
                      {top3[1].name}
                    </h3>
                    <p className="text-xs opacity-60">Nomor Absen #{top3[1].no}</p>

                    <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-bold">
                      <span>Nilai Akhir: <strong className="text-blue-600 dark:text-blue-400">{top3[1].compositeScore}</strong></span>
                      <span>•</span>
                      <span>Grade {top3[1].grade}</span>
                    </div>

                    <div className="mt-3 text-[11px] font-bold opacity-70 group-hover:opacity-100 flex items-center justify-center gap-1 transition">
                      <Printer className="w-3.5 h-3.5" /> Buka Lembar Rapor A4
                    </div>
                  </div>
                )}

                {/* Peringkat I (Emas / 首位 - Paling Utama) */}
                {top3[0] && (
                  <div
                    onClick={() => setSelectedStudentForPrint(top3[0])}
                    className="clay-podium-1 order-1 md:order-2 p-7 rounded-3xl text-center relative cursor-pointer hover:scale-[1.03] transition shadow-xl group -mt-2"
                    title="Klik untuk membuka lembar rapor resmi"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500 text-stone-950 font-black text-sm flex items-center justify-center mx-auto mb-3 shadow-md">
                      I
                    </div>
                    <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center font-black text-lg text-stone-950 bg-gradient-to-tr from-amber-400 to-amber-200 border-2 border-amber-300 shadow-md">
                      {top3[0].name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 block">
                      Juara Kehormatan Utama (首位)
                    </span>
                    <h3 className="font-extrabold text-lg truncate mt-0.5 group-hover:text-amber-500 transition">
                      {top3[0].name}
                    </h3>
                    <p className="text-xs opacity-60">Nomor Absen #{top3[0].no}</p>

                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-xs font-black text-amber-700 dark:text-amber-300 border border-amber-500/30">
                      <span>Nilai Akhir: <strong className="text-sm">{top3[0].compositeScore}</strong></span>
                      <span>•</span>
                      <span>Grade {top3[0].grade} (Istimewa)</span>
                    </div>

                    <div className="mt-3.5 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1.5 underline">
                      <Printer className="w-4 h-4" /> Cetak Dokumen Rapor Resmi A4
                    </div>
                  </div>
                )}

                {/* Peringkat III (Perunggu / 三席) */}
                {top3[2] && (
                  <div
                    onClick={() => setSelectedStudentForPrint(top3[2])}
                    className="clay-podium-3 order-3 p-6 rounded-3xl text-center relative cursor-pointer hover:scale-[1.02] transition shadow-md group"
                    title="Klik untuk membuka lembar rapor resmi"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold text-xs flex items-center justify-center mx-auto mb-3 border border-amber-700/40">
                      III
                    </div>
                    <div className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-base text-white bg-amber-800 shadow-sm">
                      {top3[2].name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
                      Peringkat Ketiga (三席)
                    </span>
                    <h3 className="font-bold text-base truncate mt-0.5 group-hover:text-amber-500 transition">
                      {top3[2].name}
                    </h3>
                    <p className="text-xs opacity-60">Nomor Absen #{top3[2].no}</p>

                    <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-bold">
                      <span>Nilai Akhir: <strong className="text-blue-600 dark:text-blue-400">{top3[2].compositeScore}</strong></span>
                      <span>•</span>
                      <span>Grade {top3[2].grade}</span>
                    </div>

                    <div className="mt-3 text-[11px] font-bold opacity-70 group-hover:opacity-100 flex items-center justify-center gap-1 transition">
                      <Printer className="w-3.5 h-3.5" /> Buka Lembar Rapor A4
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {/* ========================================================
            PANEL 2: BUKU NILAI LENGKAP (TABEL 28 SISWA)
            ======================================================== */}
        {activeTab === "students" && (
          <div className="space-y-4">
            {/* Toolbar Pencarian & Filter Grade */}
            <div className="clay-card-compact p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  type="text"
                  placeholder="Cari nama peserta didik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-stone-900 border border-current/15 text-xs font-medium outline-none focus:border-amber-500 transition"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs font-medium opacity-70 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filter Predikat:
                </span>
                {["all", "A", "B", "C", "D"].map((grd) => (
                  <button
                    key={grd}
                    onClick={() => setSelectedGrade(grd)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      selectedGrade === grd
                        ? "bg-amber-500 text-stone-950 shadow-xs"
                        : "bg-black/5 dark:bg-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {grd === "all" ? "Semua" : `Grade ${grd}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Tabel Administrasi Nilai Siswa */}
            <div className="clay-card p-2 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-current/10 bg-black/5 dark:bg-white/5 opacity-80 font-bold uppercase text-[10px] tracking-wider">
                      <th className="p-3 text-center w-14">Peringkat</th>
                      <th className="p-3">Nama Lengkap Siswa</th>
                      <th className="p-3 text-center w-20">Absen</th>
                      <th className="p-3 text-center w-28">Nilai Komulatif</th>
                      <th className="p-3 text-center w-24">Predikat</th>
                      <th className="p-3 text-center w-36">Penguasaan 4 Aspek</th>
                      <th className="p-3 text-center w-40">Dokumen Rapor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-current/10 font-medium">
                    {filteredStudents.map((st) => (
                      <tr key={st.no} className="hover:bg-amber-500/5 transition">
                        <td className="p-3 text-center">
                          <span
                            className={`w-7 h-7 rounded-lg inline-flex items-center justify-center font-bold text-xs ${
                              st.rank === 1
                                ? "bg-amber-500 text-stone-950 font-black shadow-xs"
                                : st.rank === 2
                                ? "bg-slate-300 text-slate-900"
                                : st.rank === 3
                                ? "bg-amber-700 text-amber-100"
                                : "bg-black/5 dark:bg-white/10 opacity-75"
                            }`}
                          >
                            #{st.rank}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-black/10 dark:bg-white/10 font-bold text-xs flex items-center justify-center shrink-0">
                              {st.name.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="font-bold text-sm">{st.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center opacity-70 font-mono">#{st.no}</td>
                        <td className="p-3 text-center font-bold text-sm text-blue-600 dark:text-blue-400">
                          {st.compositeScore}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                              st.grade === "A"
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : st.grade === "B"
                                ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                                : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                            }`}
                          >
                            Grade {st.grade}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1 text-[10px] opacity-75">
                            <span title="Moji-Goi">M:{st.averages?.mojiGoi || 0}</span>
                            <span>•</span>
                            <span title="Kaiwa">K:{st.averages?.kaiwa || 0}</span>
                            <span>•</span>
                            <span title="Choukai">C:{st.averages?.choukai || 0}</span>
                            <span>•</span>
                            <span title="Dokkai">D:{st.averages?.dokkai || 0}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedStudentForPrint(st)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-bold text-[11px] border border-amber-500/30 flex items-center gap-1 transition cursor-pointer"
                              title="Buka & Cetak Lembar Rapor A4"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Cetak A4</span>
                            </button>
                            <button
                              onClick={() => setSelectedStudentForDetail(st)}
                              className="px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 font-medium text-[11px] transition cursor-pointer"
                              title="Lihat Rincian Harian 18 Bab"
                            >
                              <span>Detail</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            PANEL 3: DINAMIKA PROGRES NILAI (BAR CHART RACE)
            ======================================================== */}
        {activeTab === "grandprix" && (
          <div className="space-y-4">
            <div className="clay-card p-6 rounded-3xl border border-current/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <h3 className="text-base font-bold tracking-tight font-serif flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-amber-500" />
                  Visualisasi Dinamika Progres Nilai Bab 1 s.d. 18
                </h3>
                <p className="text-xs opacity-70 mt-0.5">
                  Lacak grafik perkembangan akumulasi nilai kompetensi siswa dari bab pertama hingga bab terakhir
                </p>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">
                Data Lengkap 18 Bab
              </span>
            </div>

            <BarRaceView students={raporData?.students || []} />
          </div>
        )}

        {/* ========================================================
            PANEL 4: MATRIKS DIAGNOSTIK 18 BAB (4 POIN + CHECKPOINTS + SHIKEN 1 BUKU)
            ======================================================== */}
        {activeTab === "heatmap" && (
          <DiagnosticMatrixView
            levelData={raporData}
            onOpenStudentDetail={(student) => setSelectedStudentForDetail(student)}
          />
        )}

        {/* ========================================================
            PANEL 5: CATATAN & EVALUASI SHIHAN
            ======================================================== */}
        {activeTab === "feedback" && (
          <div className="space-y-4">
            <div className="clay-card p-6 rounded-3xl border border-current/10 flex items-center justify-between shadow-lg">
              <div>
                <h3 className="text-base font-bold tracking-tight font-serif flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  Catatan Evaluasi &amp; Rekomendasi Instruktur Shihan
                </h3>
                <p className="text-xs opacity-70 mt-0.5">
                  Rekomendasi individual dari pengajar untuk persiapan sertifikasi JFT-Basic A2
                </p>
              </div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Pengajar: イクバル先生
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(raporData?.rankedStudents || []).map((st) => (
                <div key={st.no} className="clay-card-compact p-5 rounded-2xl border border-current/10 space-y-2.5 shadow-sm hover:scale-[1.01] transition">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">#{st.rank} {st.name}</span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      Grade {st.grade}
                    </span>
                  </div>
                  <p className="text-xs opacity-75 italic leading-relaxed">
                    &quot;{st.senseiNote || "Peserta didik menunjukkan disiplin tinggi dalam pengerjaan lembar kerja dan memahami tata bahasa praktis dengan baik."}&quot;
                  </p>
                  <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[11px]">
                    <span className="opacity-70 font-medium">Fokus: Simulasi Ujian JFT Choukai</span>
                    <button
                      onClick={() => setSelectedStudentForPrint(st)}
                      className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> Cetak Rapor A4
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            PANEL 6: PORTAL INDIVIDUAL SISWA (PER SISWA)
            ======================================================== */}
        {activeTab === "portal" && portalStudent && (() => {
          const score = portalStudent.compositeScore ?? portalStudent.summary?.compositeScore ?? 0;
          const rawGrade = (portalStudent.grade || "").split(" ")[0].toUpperCase();
          const effectiveGrade = rawGrade || (score >= 85 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "D");

          const isPassed = score >= kkm;
          const isWarning = score >= Math.max(40, kkm - 15) && score < kkm;

          // Grade badge styling & text
          let gradeBadgeColor = "bg-rose-500/15 text-rose-500 border-rose-500/30";
          let gradeText = `Grade ${effectiveGrade} (Perlu Remedial)`;
          if (effectiveGrade === "A") {
            gradeBadgeColor = "bg-emerald-500/15 text-emerald-500 border-emerald-500/30";
            gradeText = `Grade A (Sangat Memuaskan - Tuntas KKM)`;
          } else if (effectiveGrade === "B") {
            gradeBadgeColor = isPassed
              ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
              : "bg-amber-500/15 text-amber-500 border-amber-500/30";
            gradeText = isPassed
              ? `Grade B (Baik - Memenuhi KKM)`
              : `Grade B (Lulus Bersyarat / Perlu Pemantapan)`;
          } else if (effectiveGrade === "C") {
            gradeBadgeColor = "bg-amber-500/15 text-amber-500 border-amber-500/30";
            gradeText = `Grade C (Cukup - Belum Tuntas KKM)`;
          }

          // Score color
          const scoreColor = isPassed
            ? "text-emerald-500"
            : isWarning
            ? "text-amber-500"
            : "text-rose-500";

          // Status Penguasaan Kompetensi Sesuai Regulasi KKM
          let statusIcon = <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />;
          let statusTitle = "Belum Memenuhi Syarat Kelulusan";
          let statusSubtitle = `Nilai akumulatif (${score} pt) di bawah batas KKM (${kkm} pt). Wajib bimbingan intensif & remedial.`;
          let statusContainerClass = "text-rose-500";

          if (isPassed) {
            statusIcon = <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />;
            statusTitle = "Siap Mengikuti Ujian JFT-Basic A2";
            statusSubtitle = `Target KKM ${kkm} pt terpenuhi. Kompetensi Kurikulum Irodori JF CEFR A2 tuntas.`;
            statusContainerClass = "text-emerald-500";
          } else if (isWarning) {
            statusIcon = <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />;
            statusTitle = "Pemantapan Pra-Ujian Diperlukan";
            statusSubtitle = `Mendekati standar KKM (${kkm} pt). Direkomendasikan simulasi tryout CBT tambahan.`;
            statusContainerClass = "text-amber-500";
          }

          return (
            <div className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                    Pencarian Rapor Individual Siswa
                  </span>
                  <h2 className="text-xl font-bold font-serif mt-0.5 text-[var(--text-heading)]">
                    Lembar Laporan Hasil Belajar Peserta Didik
                  </h2>
                </div>
                <div className="flex items-center gap-2.5">
                  <select
                    value={portalStudentId}
                    onChange={(e) => setPortalStudentId(parseInt(e.target.value, 10))}
                    className="p-2.5 rounded-xl bg-[var(--background)] border border-current/20 text-xs font-bold text-[var(--text-heading)] outline-none cursor-pointer shadow-sm"
                  >
                    {(raporData?.students || []).map((st) => (
                      <option key={st.no} value={st.no} className="bg-stone-900 text-white">
                        #{st.no} - {st.name} (Peringkat #{st.rank || st.no})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => setSelectedStudentForPrint(portalStudent)}
                    className="clay-btn-gold px-4 py-2 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Cetak Lembar Rapor A4
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Card 1: Profil & Predikat */}
                <div className="clay-card-compact p-5 rounded-2xl border border-current/10 text-center flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full mb-2 bg-gradient-to-br from-stone-800 to-stone-900 text-amber-400 font-black text-lg flex items-center justify-center shadow-md border-2 border-amber-500/40">
                    {portalStudent.name.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-base text-[var(--text-heading)]">{portalStudent.name}</h3>
                  <p className="text-xs opacity-70 text-[var(--text-body)]">
                    Peringkat Kelas #{portalStudent.rank || portalStudent.no}
                  </p>
                  <span className={`inline-block mt-2.5 px-3 py-1 rounded-full text-xs font-bold border ${gradeBadgeColor}`}>
                    {gradeText}
                  </span>
                </div>

                {/* Card 2: Nilai Akumulatif & KKM */}
                <div className="clay-card-compact p-5 rounded-2xl border border-current/10 flex flex-col justify-between">
                  <span className="text-xs opacity-70 font-bold uppercase tracking-wider text-[var(--text-heading)]">
                    Nilai Akumulatif Komprehensif
                  </span>
                  <div className="my-2">
                    <span className={`text-4xl font-black ${scoreColor}`}>
                      {score}
                    </span>
                    <span className="text-sm opacity-60 font-mono ml-1.5 text-[var(--text-body)]">/ 100 pt</span>
                  </div>
                  <p className="text-[11px] opacity-75 text-[var(--text-body)] font-medium">
                    Batas kelulusan minimum KKM: <strong className="text-amber-500 font-mono">{kkm}.00 pt</strong>
                  </p>
                </div>

                {/* Card 3: Status Penguasaan Kompetensi Sesuai Regulasi */}
                <div className="clay-card-compact p-5 rounded-2xl border border-current/10 flex flex-col justify-between">
                  <span className="text-xs opacity-70 font-bold uppercase tracking-wider text-[var(--text-heading)]">
                    Status Penguasaan Kompetensi
                  </span>
                  <div className={`flex items-center gap-2.5 my-2 ${statusContainerClass}`}>
                    {statusIcon}
                    <span className="text-base font-extrabold leading-tight">{statusTitle}</span>
                  </div>
                  <p className="text-[11px] opacity-75 text-[var(--text-body)] leading-relaxed">{statusSubtitle}</p>
                </div>
              </div>
            </div>
          );
        })()}
      </main>
      </div>

      {/* ========================================================
          MODAL CETAK LEMBAR RAPOR RESMI A4 (OFFICIAL PRINT MODAL)
          ======================================================== */}
      <OfficialReportPrintModal
        isOpen={Boolean(selectedStudentForPrint)}
        onClose={() => setSelectedStudentForPrint(null)}
        student={selectedStudentForPrint}
        levelData={raporData}
      />

      {/* ========================================================
          MODAL DRILLDOWN DETAIL BAB SISWA
          ======================================================== */}
      <StudentDetailModal
        student={selectedStudentForDetail}
        classPilarAvg={
          raporData?.classPilarAvg || {
            mojiGoi: 70,
            kaiwa: 70,
            choukai: 75,
            dokkai: 65,
            kanji: 60,
          }
        }
        levelTitle={`${raporData?.title || ""} ${raporData?.sub || ""}`}
        onClose={() => setSelectedStudentForDetail(null)}
      />
    </div>
  );
}
