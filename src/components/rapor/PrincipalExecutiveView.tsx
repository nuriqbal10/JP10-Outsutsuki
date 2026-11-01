"use client";

import React, { useState, useMemo } from "react";
import {
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  ShieldCheck,
  Building2,
  FileText,
  Printer,
  ChevronRight,
  ArrowUpRight,
  Target,
  Sparkles,
  Layers,
  HelpCircle,
  Clock,
  Briefcase,
  Compass,
} from "lucide-react";
import { StudentRaporItem, LevelRaporData } from "@/types/rapor";

interface PrincipalExecutiveViewProps {
  students: StudentRaporItem[];
  levelData: LevelRaporData | null;
  kkm: number;
  selectedLevel: "A1" | "A21" | "A22";
  onSelectLevel: (lvl: "A1" | "A21" | "A22") => void;
  onOpenPrintModal: (student: StudentRaporItem) => void;
  onOpenDetailModal: (student: StudentRaporItem) => void;
  onNavigateToTab: (tab: any) => void;
}

export default function PrincipalExecutiveView({
  students,
  levelData,
  kkm,
  selectedLevel,
  onSelectLevel,
  onOpenPrintModal,
  onOpenDetailModal,
  onNavigateToTab,
}: PrincipalExecutiveViewProps) {
  const [filterPredicate, setFilterPredicate] = useState<string>("all");

  // Helper perolehan nilai siswa
  const getScore = (s: StudentRaporItem) =>
    s.compositeScore ?? s.summary?.compositeScore ?? 0;

  // Total Siswa
  const totalStudents = students.length || 28;

  // Analisis Predikat
  const predicateStats = useMemo(() => {
    let s = 0, a = 0, b = 0, c = 0, d = 0;
    students.forEach((st) => {
      const sc = getScore(st);
      if (sc >= 90) s++;
      else if (sc >= 80) a++;
      else if (sc >= 70) b++;
      else if (sc >= 60) c++;
      else d++;
    });
    return { s, a, b, c, d };
  }, [students]);

  // Kelulusan KKM & Prometric JFT (200 pt / 250 pt = 80%)
  const passedKkmCount = students.filter((s) => getScore(s) >= kkm).length;
  const kkmPct = Math.round((passedKkmCount / totalStudents) * 100);

  // Proyeksi Kelulusan Prometric JFT (200 dari 250 poin = skor rata-rata >= 80)
  const readyForJftCount = students.filter((s) => {
    const sc = getScore(s);
    return sc >= 80;
  }).length;
  const jftPct = Math.round((readyForJftCount / totalStudents) * 100);

  // Siswa Berisiko (Perlu Intervensi Manajemen)
  const atRiskStudents = useMemo(() => {
    return students
      .filter((s) => getScore(s) < kkm)
      .sort((a, b) => getScore(a) - getScore(b));
  }, [students, kkm]);

  // Rata-rata 4 Seksi Kelas
  const avgMoji = Math.round((students.reduce((acc, s) => acc + (s.averages?.mojiGoi || 0), 0) / totalStudents) * 10) / 10;
  const avgKaiwa = Math.round((students.reduce((acc, s) => acc + (s.averages?.kaiwa || 0), 0) / totalStudents) * 10) / 10;
  const avgChoukai = Math.round((students.reduce((acc, s) => acc + (s.averages?.choukai || 0), 0) / totalStudents) * 10) / 10;
  const avgDokkai = Math.round((students.reduce((acc, s) => acc + (s.averages?.dokkai || 0), 0) / totalStudents) * 10) / 10;

  // Filter siswa untuk tabel eksekutif
  const filteredList = useMemo(() => {
    if (filterPredicate === "all") return students;
    if (filterPredicate === "at_risk") return students.filter((s) => getScore(s) < kkm);
    if (filterPredicate === "jft_ready") return students.filter((s) => getScore(s) >= 80);
    return students.filter((s) => {
      const sc = getScore(s);
      if (filterPredicate === "S") return sc >= 90;
      if (filterPredicate === "A") return sc >= 80 && sc < 90;
      if (filterPredicate === "B") return sc >= 70 && sc < 80;
      if (filterPredicate === "C") return sc >= 60 && sc < 70;
      if (filterPredicate === "D") return sc < 60;
      return true;
    });
  }, [students, filterPredicate, kkm]);

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* 1. EXECUTIVE HEADER BANNER */}
      <div className="clay-card p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-black/5 to-transparent relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider border border-amber-500/30">
              <Building2 className="w-3.5 h-3.5" />
              Lensa Eksekutif & Manajemen (校長・最高責任者ビュー)
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
              Laporan Kesiapan Angkatan Otsutsuki
            </h1>
            <p className="text-xs sm:text-sm opacity-75 max-w-2xl leading-relaxed">
              Ringkasan kepatuhan mutu akademik, audit kesiapan sertifikasi Prometric JFT-Basic A2, serta kelayakan dokumen pengiriman siswa magang/kerja ke Jepang (Sending Organization Compliance).
            </p>
          </div>

          {/* Level Switcher Cepat */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 shrink-0">
            {(["A1", "A21", "A22"] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onSelectLevel(lvl)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                  selectedLevel === lvl
                    ? "bg-amber-500 text-stone-950 shadow-md font-extrabold"
                    : "opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                Level {lvl === "A21" ? "A2.1" : lvl === "A22" ? "A2.2" : "A1"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 4 STRATEGIC KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: JFT Prometric Readiness */}
        <div className="clay-card p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Kesiapan JFT-Basic A2
            </span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {jftPct}%
            </span>
            <span className="text-xs opacity-60 font-semibold">
              ({readyForJftCount}/{totalStudents} Siswa)
            </span>
          </div>
          <p className="text-[11px] opacity-75">
            Siswa diproyeksikan lulus ambang 200/250 poin resmi Prometric Jepang.
          </p>
          <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${jftPct}%` }}
            />
          </div>
        </div>

        {/* KPI 2: Kepatuhan Standar KKM */}
        <div className="clay-card p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Kepatuhan KKM ({kkm})
            </span>
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">
              {kkmPct}%
            </span>
            <span className="text-xs opacity-60 font-semibold">
              ({passedKkmCount}/{totalStudents} Tuntas)
            </span>
          </div>
          <p className="text-[11px] opacity-75">
            Tingkat ketuntasan minimum akademik standar kelas Otsutsuki saat ini.
          </p>
          <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${kkmPct}%` }}
            />
          </div>
        </div>

        {/* KPI 3: Siswa Perlu Intervensi Khusus */}
        <div className="clay-card p-5 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              At-Risk / Perlu Bimbingan
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
              {atRiskStudents.length}
            </span>
            <span className="text-xs opacity-60 font-semibold">Siswa di Bawah KKM</span>
          </div>
          <p className="text-[11px] opacity-75">
            Membutuhkan kelas bimbingan sore & drilling materi sebelum shiken akhir.
          </p>
          <button
            onClick={() => setFilterPredicate("at_risk")}
            className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            Tinjau Daftar Intervensi <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* KPI 4: Indeks Akreditasi SO / Keberangkatan */}
        <div className="clay-card p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Status Pengiriman SO
            </span>
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
              LAYAK EMAS
            </span>
            <span className="text-xs opacity-60 font-semibold">Tier 1</span>
          </div>
          <p className="text-[11px] opacity-75">
            Tingkat disiplin dan penguasaan bahasa memenuhi kriteria mitra penerima Jepang.
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-blue-600 dark:text-blue-400 font-bold">
            <CheckCircle2 className="w-3 h-3" /> Siap Wawancara User (Menyusul)
          </div>
        </div>
      </div>

      {/* 3. DISTRIBUSI PREDIKAT MUTU & 4 ASPEK KOMPETENSI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribusi Predikat Siswa */}
        <div className="clay-card p-6 rounded-3xl border border-current/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              Sebaran Predikat Akademik
            </h3>
            <span className="text-xs opacity-60">Total {totalStudents} Siswa</span>
          </div>

          <div className="space-y-3">
            {[
              { label: "S (Istimewa ≥90)", count: predicateStats.s, color: "bg-amber-500", key: "S" },
              { label: "A (Sangat Baik 80-89)", count: predicateStats.a, color: "bg-emerald-500", key: "A" },
              { label: "B (Baik 70-79)", count: predicateStats.b, color: "bg-blue-500", key: "B" },
              { label: "C (Cukup 60-69)", count: predicateStats.c, color: "bg-purple-500", key: "C" },
              { label: "D (Remedial <60)", count: predicateStats.d, color: "bg-rose-500", key: "D" },
            ].map((item) => {
              const pct = Math.round((item.count / totalStudents) * 100);
              return (
                <div
                  key={item.key}
                  onClick={() => setFilterPredicate(item.key)}
                  className={`p-2.5 rounded-xl border border-current/5 transition cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 ${
                    filterPredicate === item.key ? "ring-2 ring-amber-500 bg-amber-500/10" : ""
                  }`}
                >
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>{item.label}</span>
                    <span className="opacity-75">
                      {item.count} siswa ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Audit 4 Pilar Kompetensi Kelas */}
        <div className="clay-card p-6 rounded-3xl border border-current/10 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-500" />
                Audit Kekuatan 4 Pilar Bahasa Angkatan
              </h3>
              <p className="text-xs opacity-60">
                Tolok ukur perolehan rata-rata kelas pada masing-masing seksi ujian harian
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab("projection")}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              Simulasi Proyeksi <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Moji-Goi */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold">1. Kosakata & Huruf (文字・語彙)</span>
                <span className="font-black text-amber-600 dark:text-amber-400">{avgMoji} / 24</span>
              </div>
              <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${Math.min(100, (avgMoji / 24) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] opacity-70">
                Pondasi kuat. Penguasaan kosakata kerja dan benda harian sangat stabil.
              </p>
            </div>

            {/* Kaiwa */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold">2. Percakapan & Pola (会話・文法)</span>
                <span className="font-black text-blue-600 dark:text-blue-400">{avgKaiwa} / 24</span>
              </div>
              <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${Math.min(100, (avgKaiwa / 24) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] opacity-70">
                Kelancaran tata bahasa kerja (bentuk Te, Nai, Ta) sudah terbentuk baik.
              </p>
            </div>

            {/* Choukai */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold">3. Pendengaran Alami (聴解)</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">{avgChoukai} / 24</span>
              </div>
              <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${Math.min(100, (avgChoukai / 24) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] opacity-70">
                Kekuatan terbesar angkatan! Refleks pendengaran cepat dan akurat.
              </p>
            </div>

            {/* Dokkai */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold">4. Pemahaman Bacaan (読解)</span>
                <span className="font-black text-rose-600 dark:text-rose-400">{avgDokkai} / 28</span>
              </div>
              <div className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500"
                  style={{ width: `${Math.min(100, (avgDokkai / 28) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] opacity-70">
                Titik perhatian utama! Perlu penguatan kecepatan baca dan instruksi kerja kantor.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. TABEL DAFTAR NOMINATIF KESIAPAN SISWA (SO & PROMETRIC AUDIT) */}
      <div className="clay-card p-6 rounded-3xl border border-current/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-500" />
              Daftar Audit Nominatif Siswa ({filteredList.length} dari {totalStudents} Siswa)
            </h3>
            <p className="text-xs opacity-60">
              Digunakan untuk rapat dewan pembina, pelaporan yayasan, dan kesiapan penempatan kerja ke Jepang.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilterPredicate("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterPredicate === "all"
                  ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950"
                  : "bg-black/5 dark:bg-white/5 opacity-70"
              }`}
            >
              Semua ({totalStudents})
            </button>
            <button
              onClick={() => setFilterPredicate("jft_ready")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterPredicate === "jft_ready"
                  ? "bg-emerald-500 text-stone-950 font-black"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              Siap JFT ({readyForJftCount})
            </button>
            <button
              onClick={() => setFilterPredicate("at_risk")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterPredicate === "at_risk"
                  ? "bg-rose-500 text-white font-black"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}
            >
              Perlu Intervensi ({atRiskStudents.length})
            </button>
          </div>
        </div>

        {/* Tabel Eksekutif */}
        <div className="overflow-x-auto rounded-2xl border border-current/10">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5 font-extrabold border-b border-current/10">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Peserta Didik</th>
                <th className="py-3 px-4 w-28">NIM</th>
                <th className="py-3 px-4 w-24 text-center">Nilai Rapor</th>
                <th className="py-3 px-4 w-24 text-center">Predikat</th>
                <th className="py-3 px-4 w-36 text-center">Status JFT-A2</th>
                <th className="py-3 px-4 w-40">Rekomendasi Manajerial</th>
                <th className="py-3 px-4 w-28 text-center">Aksi Dokumen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-current/5">
              {filteredList.map((s, idx) => {
                const sc = getScore(s);
                const isJftReady = sc >= 80;
                const isPassed = sc >= kkm;

                return (
                  <tr
                    key={s.no || idx}
                    className="hover:bg-black/5 dark:hover:bg-white/5 transition"
                  >
                    <td className="py-3 px-4 text-center font-bold opacity-60">
                      {s.no}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-extrabold">{s.name}</div>
                      <div className="text-[10px] opacity-60">Kelas Outsutsuki</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold opacity-75">
                      {s.nim || `OTS-${String(s.no).padStart(3, "0")}`}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-black text-sm">{sc.toFixed(1)}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-black text-[11px] ${
                          sc >= 90
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                            : sc >= 80
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                            : sc >= 70
                            ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                            : sc >= 60
                            ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30"
                            : "bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {s.grade || (sc >= 85 ? "A" : sc >= 75 ? "B" : "C")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isJftReady ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Sangat Siap
                        </span>
                      ) : isPassed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-extrabold text-[10px] border border-amber-500/30">
                          <Clock className="w-3 h-3" /> Menuju Target
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 font-extrabold text-[10px] border border-rose-500/30">
                          <AlertTriangle className="w-3 h-3" /> Bimbingan Sore
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[11px] opacity-75">
                      {isJftReady
                        ? "Layak nominasi beasiswa magang & percepatan berkas SO."
                        : isPassed
                        ? "Pertahankan ritme Choukai & latihan Dokkai mandiri."
                        : "Wajib ikut kelas klinik sore 3x seminggu bersama Shihan."}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onOpenPrintModal(s)}
                          className="p-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 text-amber-600 dark:text-amber-400 transition cursor-pointer"
                          title="Cetak Rapor Siswa"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onOpenDetailModal(s)}
                          className="p-1.5 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 transition cursor-pointer"
                          title="Buka Lembar Detail"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
