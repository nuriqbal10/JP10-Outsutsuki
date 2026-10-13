"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Trophy,
  Search,
  Filter,
  BarChart2,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Printer,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileText,
  User,
} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { LevelRaporData, StudentRaporItem } from "@/types/rapor";
import OfficialReportPrintModal from "@/components/rapor/OfficialReportPrintModal";
import StudentDetailModal from "@/components/rapor/StudentDetailModal";
import BarRaceView from "@/components/rapor/BarRaceView";
import masterRaporData from "@/data/raporMasterData.json";

export default function RaporDashboardPage() {
  const [selectedLevel, setSelectedLevel] = useState<"A1" | "A21" | "A22">("A22");
  const [activeTab, setActiveTab] = useState<"overview" | "students" | "grandprix" | "heatmap" | "feedback" | "portal">("overview");

  // State Dropdown Navigasi
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [isLevelMenuOpen, setIsLevelMenuOpen] = useState(false);
  const [isModuleMenuOpen, setIsModuleMenuOpen] = useState(false);

  const viewMenuRef = useRef<HTMLDivElement>(null);
  const levelMenuRef = useRef<HTMLDivElement>(null);
  const moduleMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (viewMenuRef.current && !viewMenuRef.current.contains(event.target as Node)) {
        setIsViewMenuOpen(false);
      }
      if (levelMenuRef.current && !levelMenuRef.current.contains(event.target as Node)) {
        setIsLevelMenuOpen(false);
      }
      if (moduleMenuRef.current && !moduleMenuRef.current.contains(event.target as Node)) {
        setIsModuleMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <div className="min-h-screen flex flex-col font-sans relative selection:bg-amber-500/20 selection:text-amber-800 dark:selection:text-amber-200">
      {/* ========================================================
          1. UNIFIED COMMAND & NAVIGATION HEADER (TERPADU SATU WADAH)
          ======================================================== */}
      <header className="sticky top-0 z-50 px-4 sm:px-8 py-3 w-full border-b border-current/10 backdrop-blur-xl bg-black/5 dark:bg-black/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Sisi Kiri: Identitas Brand Klan Outsutsuki */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="w-10 h-10 p-1.5 rounded-xl bg-white dark:bg-stone-900 border border-current/15 flex items-center justify-center shadow-sm hover:scale-105 transition"
              title="Kembali ke Beranda Portal"
            >
              <img
                src="/logo_outsutsuki.png"
                alt="Emblem Klan Otsutsuki"
                className="w-full h-full object-contain filter dark:invert"
              />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-wide uppercase font-serif">
                  Ōtsutsuki Academia
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  大筒木一族
                </span>
              </div>
              <p className="text-[11px] opacity-70">
                Sistem Evaluasi Akademik Irodori • Pembina: イクバル先生 (Iqbal-sensei)
              </p>
            </div>
          </div>

          {/* Sisi Tengah: Wadah Navigasi Terpadu (Dropdown Cluster) */}
          <div className="hidden lg:flex items-center gap-2 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-current/10">
            {/* Dropdown 1: Menu Tampilan Fitur */}
            <div className="relative" ref={viewMenuRef}>
              <button
                onClick={() => {
                  setIsViewMenuOpen(!isViewMenuOpen);
                  setIsLevelMenuOpen(false);
                  setIsModuleMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{viewTitles[activeTab].split(" ")[0]} ({activeTab === "overview" ? "Ringkasan" : activeTab === "students" ? "Buku Nilai" : activeTab === "grandprix" ? "Progres" : activeTab === "heatmap" ? "Heatmap" : activeTab === "feedback" ? "Evaluasi" : "Portal"})</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isViewMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-2xl p-2 bg-white dark:bg-stone-900 border border-current/15 shadow-2xl z-50 space-y-1 animate-in fade-in duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider opacity-50">
                    Pilih Mode Tampilan Analisis
                  </div>
                  {[
                    { id: "overview", label: "Ringkasan Eksekutif", sub: "Statistik & Podium Juara" },
                    { id: "students", label: "Buku Nilai Lengkap", sub: "Rekap Nilai 28 Siswa" },
                    { id: "grandprix", label: "Dinamika Progres Nilai", sub: "Analisis Kemajuan 18 Bab" },
                    { id: "heatmap", label: "Matriks Diagnostik Bab", sub: "Evaluasi Ketuntasan Bab" },
                    { id: "feedback", label: "Catatan & Evaluasi Shihan", sub: "Rekomendasi Individual" },
                    { id: "portal", label: "Portal Individual Siswa", sub: "Cetak Rapor Per Siswa" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setIsViewMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col transition cursor-pointer ${
                        activeTab === item.id
                          ? "bg-amber-500 text-stone-950 font-bold shadow-xs"
                          : "opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="font-bold">{item.label}</span>
                      <span className="text-[10px] opacity-70">{item.sub}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 2: Tingkat Kurikulum (Level) */}
            <div className="relative" ref={levelMenuRef}>
              <button
                onClick={() => {
                  setIsLevelMenuOpen(!isLevelMenuOpen);
                  setIsViewMenuOpen(false);
                  setIsModuleMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>{selectedLevel === "A22" ? "初級2 A2.2" : selectedLevel === "A21" ? "初級1 A2.1" : "入門 A1"}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isLevelMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-2xl p-2 bg-white dark:bg-stone-900 border border-current/15 shadow-2xl z-50 space-y-1 animate-in fade-in duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider opacity-50">
                    Tingkat Kurikulum Irodori
                  </div>
                  {[
                    { id: "A1", label: "入門 A1 (Nyuumon)", sub: "Tingkat Dasar Standar" },
                    { id: "A21", label: "初級1 A2.1 (Shokyuu 1)", sub: "Tingkat Lanjutan 1" },
                    { id: "A22", label: "初級2 A2.2 (Shokyuu 2)", sub: "Tingkat Lanjutan 2" },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => {
                        setSelectedLevel(lvl.id as any);
                        setIsLevelMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col transition cursor-pointer ${
                        selectedLevel === lvl.id
                          ? "bg-amber-500 text-stone-950 font-bold shadow-xs"
                          : "opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      <span className="font-bold">{lvl.label}</span>
                      <span className="text-[10px] opacity-70">{lvl.sub}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown 3: Modul Terkait */}
            <div className="relative" ref={moduleMenuRef}>
              <button
                onClick={() => {
                  setIsModuleMenuOpen(!isModuleMenuOpen);
                  setIsViewMenuOpen(false);
                  setIsLevelMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                <span>Modul Portal</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isModuleMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl p-2 bg-white dark:bg-stone-900 border border-current/15 shadow-2xl z-50 space-y-1 animate-in fade-in duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider opacity-50">
                    Akses Modul Akademik
                  </div>
                  <Link
                    href="/lms/irodori-a2-2"
                    className="w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition"
                  >
                    <span className="font-bold">LMS Silabus &amp; LKPD</span>
                    <span className="text-[10px] opacity-70">Materi 12 Bab Irodori</span>
                  </Link>
                  <Link
                    href="/cbt"
                    className="w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition"
                  >
                    <span className="font-bold">Simulasi Ujian CBT</span>
                    <span className="text-[10px] opacity-70">Standar Ujian JFT-Basic</span>
                  </Link>
                  <Link
                    href="/kanji"
                    className="w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition"
                  >
                    <span className="font-bold">Studio Huruf Kanji</span>
                    <span className="text-[10px] opacity-70">Stroke Order &amp; Lembar Latih</span>
                  </Link>
                  <Link
                    href="/flashcard"
                    className="w-full text-left px-3 py-2 rounded-xl text-xs flex flex-col opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition"
                  >
                    <span className="font-bold">Flashcard Kosakata</span>
                    <span className="text-[10px] opacity-70">Audio Pelafalan Asli</span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sisi Kanan: ThemeSwitcher & Navigasi Mobile */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Quick Button Cetak Rapor */}
            {top3[0] && (
              <button
                onClick={() => setSelectedStudentForPrint(top3[0])}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition cursor-pointer"
                title="Cetak Laporan Hasil Belajar Siswa Peringkat I"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Rapor</span>
              </button>
            )}

            <ThemeSwitcher />
          </div>
        </div>

        {/* Mobile Navigation Tabs (Hanya Tampil di Layar Kecil) */}
        <div className="lg:hidden mt-2 pt-2 border-t border-current/10 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none text-xs">
          {[
            { id: "overview", label: "Ringkasan" },
            { id: "students", label: "Buku Nilai" },
            { id: "grandprix", label: "Progres" },
            { id: "heatmap", label: "Matriks" },
            { id: "feedback", label: "Evaluasi" },
            { id: "portal", label: "Siswa" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveTab(m.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                activeTab === m.id
                  ? "bg-amber-500 text-stone-950 shadow-xs"
                  : "bg-black/5 dark:bg-white/10 opacity-75"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </header>

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
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 text-center">
                  <span className="text-[11px] opacity-70 block font-medium">Rata-Rata Kelas</span>
                  <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 mt-0.5 block">
                    {raporData?.classSummary?.classAverage || 73.8}
                  </span>
                  <span className="text-[10px] opacity-60">Skala 100 pt</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 text-center">
                  <span className="text-[11px] opacity-70 block font-medium">Ketuntasan KKM</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    100%
                  </span>
                  <span className="text-[10px] opacity-60">28 / 28 Siswa</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 text-center">
                  <span className="text-[11px] opacity-70 block font-medium">Skor Tertinggi</span>
                  <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5 block">
                    {top3[0]?.compositeScore || 94.0}
                  </span>
                  <span className="text-[10px] opacity-60">Peringkat Kehormatan</span>
                </div>
              </div>
            </div>

            {/* Kartu Ringkasan Standar Pengesahan Akademik */}
            <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/15 max-w-sm w-full space-y-3 shrink-0">
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
                    className="order-2 md:order-1 p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-slate-300/40 dark:border-slate-700/60 text-center relative cursor-pointer hover:border-slate-400 hover:scale-[1.02] transition shadow-md group"
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
                    className="order-1 md:order-2 p-7 rounded-2xl bg-gradient-to-b from-amber-500/15 via-transparent to-amber-500/5 border-2 border-amber-500/50 text-center relative cursor-pointer hover:scale-[1.03] transition shadow-xl group -mt-2"
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
                    className="order-3 p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-amber-700/30 dark:border-amber-700/50 text-center relative cursor-pointer hover:border-amber-600 hover:scale-[1.02] transition shadow-md group"
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
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex flex-col sm:flex-row items-center justify-between gap-3">
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
            <div className="rounded-2xl border border-current/10 overflow-hidden shadow-lg bg-white/40 dark:bg-stone-950/40">
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
            <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
            PANEL 4: MATRIKS DIAGNOSTIK 18 BAB
            ======================================================== */}
        {activeTab === "heatmap" && (
          <div className="p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-4 shadow-md">
            <div>
              <h3 className="text-base font-bold tracking-tight font-serif flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                Matriks Diagnostik Ketuntasan 18 Bab
              </h3>
              <p className="text-xs opacity-70 mt-0.5">
                Pemetaan capaian skor Dai-Test per bab untuk mendeteksi area materi yang memerlukan penguatan.
              </p>
            </div>

            <div className="overflow-x-auto border border-current/15 rounded-xl bg-white/40 dark:bg-stone-950/40">
              <table className="w-full text-center border-collapse text-[10px]">
                <thead>
                  <tr className="bg-black/10 dark:bg-white/10 font-bold opacity-80">
                    <th className="p-2 text-left pl-3 w-40">Peserta Didik</th>
                    {Array.from({ length: 18 }, (_, i) => i + 1).map((b) => (
                      <th key={b} className="p-2 w-9">Bab {b}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-current/10 font-medium">
                  {(raporData?.rankedStudents || []).map((st) => (
                    <tr key={st.no} className="hover:bg-amber-500/10">
                      <td className="p-2 text-left pl-3 truncate max-w-[150px] font-bold">
                        #{st.rank} {st.name}
                      </td>
                      {Array.from({ length: 18 }, (_, idx) => {
                        const babScore = st.harian[idx]?.daiTest?.total || 0;
                        const isPassed = babScore >= 70;
                        return (
                          <td
                            key={idx}
                            className={`p-1 font-mono ${
                              babScore === 0
                                ? "opacity-20"
                                : isPassed
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold"
                                : "bg-rose-500/15 text-rose-700 dark:text-rose-400 font-bold"
                            }`}
                          >
                            {babScore || "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            PANEL 5: CATATAN & EVALUASI SHIHAN
            ======================================================== */}
        {activeTab === "feedback" && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex items-center justify-between">
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
                <div key={st.no} className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2.5 shadow-sm">
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
        {activeTab === "portal" && portalStudent && (
          <div className="p-6 sm:p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-6 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-current/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Pencarian Rapor Individual Siswa
                </span>
                <h2 className="text-xl font-bold font-serif mt-0.5">Lembar Laporan Hasil Belajar Peserta Didik</h2>
              </div>
              <div className="flex items-center gap-2.5">
                <select
                  value={portalStudentId}
                  onChange={(e) => setPortalStudentId(parseInt(e.target.value, 10))}
                  className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-current/20 text-xs font-bold outline-none cursor-pointer"
                >
                  {(raporData?.students || []).map((st) => (
                    <option key={st.no} value={st.no}>
                      #{st.no} - {st.name} (Peringkat #{st.rank})
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
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-current/10 text-center">
                <div className="w-14 h-14 rounded-full mx-auto mb-2 bg-slate-800 text-white font-bold text-base flex items-center justify-center shadow-sm">
                  {portalStudent.name.substring(0, 2).toUpperCase()}
                </div>
                <h3 className="font-bold text-base">{portalStudent.name}</h3>
                <p className="text-xs opacity-60">Peringkat Kelas #{portalStudent.rank}</p>
                <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  Grade {portalStudent.grade} (Lulus Standar)
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-current/10 flex flex-col justify-between">
                <span className="text-xs opacity-70 font-medium">Nilai Akumulatif Komprehensif</span>
                <span className="text-3xl font-black text-amber-600 dark:text-amber-400 my-2">
                  {portalStudent.compositeScore} <span className="text-xs opacity-50 font-normal">/ 100 pt</span>
                </span>
                <p className="text-[11px] opacity-60">Batas kelulusan minimum KKM: 70.00 pt</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-current/10 flex flex-col justify-between">
                <span className="text-xs opacity-70 font-medium">Status Penguasaan Kompetensi</span>
                <div className="flex items-center gap-2 my-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-base font-bold">Siap Mengikuti Ujian JFT-Basic</span>
                </div>
                <p className="text-[11px] opacity-60">Kurikulum Irodori JF CEFR A2 Terpenuhi</p>
              </div>
            </div>
          </div>
        )}
      </main>

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
