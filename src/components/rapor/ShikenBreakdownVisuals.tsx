"use client";

import React, { useState } from "react";
import {
  Target,
  BarChart2,
  PieChart,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Layers,
  ArrowRight,
  Printer,
} from "lucide-react";
import { StudentRaporItem } from "@/types/rapor";

interface ShikenBreakdownVisualsProps {
  allStudents: StudentRaporItem[];
  classFinalExamAvg: {
    mojiGoi: number;
    kaiwa: number;
    choukai: number;
    dokkai: number;
    total: number;
    kanji: number;
    pctMoji: number;
    pctKaiwa: number;
    pctChoukai: number;
    pctDokkai: number;
    passCount: number;
    totalStudents: number;
    passRate: number;
  };
  onSelectStudentPrint?: (student: StudentRaporItem) => void;
  onSelectStudentDetail?: (student: StudentRaporItem) => void;
}

export default function ShikenBreakdownVisuals({
  allStudents,
  classFinalExamAvg,
  onSelectStudentPrint,
  onSelectStudentDetail,
}: ShikenBreakdownVisualsProps) {
  const [selectedZone, setSelectedZone] = useState<"all" | "pass" | "caution" | "remedial">("all");
  const [activeVisualMode, setActiveVisualMode] = useState<"sections" | "zones" | "weights">("sections");

  // Filter students based on Final Exam zones
  const studentsWithExam = allStudents.map((s) => {
    const tot = s.finalExam?.test?.total || 0;
    const isPass = tot >= 200;
    const isCaution = tot >= 170 && tot < 200;
    const isRemedial = tot < 170;
    const zone: "pass" | "caution" | "remedial" = isPass ? "pass" : isCaution ? "caution" : "remedial";
    return { ...s, examTotal: tot, zone };
  });

  const passStudents = studentsWithExam.filter((s) => s.zone === "pass");
  const cautionStudents = studentsWithExam.filter((s) => s.zone === "caution");
  const remedialStudents = studentsWithExam.filter((s) => s.zone === "remedial");

  const filteredStudents = selectedZone === "all"
    ? studentsWithExam
    : studentsWithExam.filter((s) => s.zone === selectedZone);

  // 4 Sections Prometric Data
  const sections = [
    {
      key: "mojiGoi",
      name: "文字・語彙 (Moji-Goi)",
      short: "Moji-Goi",
      color: "#f59e0b",
      barBg: "from-amber-500 to-amber-400",
      avg: classFinalExamAvg.mojiGoi,
      max: 48,
      passTarget: 38.4, // 80%
      pct: classFinalExamAvg.pctMoji,
      weightPct: 19.2,
      soal: 12,
      pointPerSoal: 4,
    },
    {
      key: "kaiwa",
      name: "会話・表現 (Kaiwa/Hyougen)",
      short: "Kaiwa",
      color: "#3b82f6",
      barBg: "from-blue-500 to-blue-400",
      avg: classFinalExamAvg.kaiwa,
      max: 48,
      passTarget: 38.4, // 80%
      pct: classFinalExamAvg.pctKaiwa,
      weightPct: 19.2,
      soal: 12,
      pointPerSoal: 4,
    },
    {
      key: "choukai",
      name: "聴解 (Choukai)",
      short: "Choukai",
      color: "#a855f7",
      barBg: "from-purple-500 to-purple-400",
      avg: classFinalExamAvg.choukai,
      max: 66,
      passTarget: 52.8, // 80%
      pct: classFinalExamAvg.pctChoukai,
      weightPct: 26.4,
      soal: 11,
      pointPerSoal: 6,
    },
    {
      key: "dokkai",
      name: "読解 (Dokkai)",
      short: "Dokkai",
      color: "#f43f5e",
      barBg: "from-rose-500 to-rose-400",
      avg: classFinalExamAvg.dokkai,
      max: 88,
      passTarget: 70.4, // 80%
      pct: classFinalExamAvg.pctDokkai,
      weightPct: 35.2,
      soal: 11,
      pointPerSoal: 8,
    },
  ];

  // Donut weights
  const donutSize = 170;
  const donutCenter = donutSize / 2;
  const donutRadius = 60;
  const donutStrokeWidth = 22;
  const circumference = 2 * Math.PI * donutRadius;

  let accumulatedPercent = 0;
  const weightSegments = sections.map((sec) => {
    const percent = sec.weightPct / 100;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;
    return {
      ...sec,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <section className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 space-y-6 shadow-xl relative overflow-hidden">
      {/* HEADER VISUAL SHIKEN */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-current/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-rose-500/40 bg-rose-500/15 text-rose-600 dark:text-rose-400">
              Prometric Exam Diagnostic
            </span>
            <span className="text-xs font-mono font-bold opacity-70">
              Standar 250 Poin JFT-Basic A2
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight font-serif mt-1 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-500" />
            Dasbor Visual Komparasi 4 Seksi Ujian Akhir
          </h3>
          <p className="text-xs opacity-75 mt-0.5 max-w-2xl">
            Visualisasi perbandingan pencapaian rata-rata kelas terhadap garis ambang kelulusan resmi Japan Foundation (80% / 200 pt).
          </p>
        </div>

        {/* MODE SWITCHER */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 self-start lg:self-auto">
          <button
            onClick={() => setActiveVisualMode("sections")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeVisualMode === "sections"
                ? "bg-amber-500 text-stone-950 shadow-sm"
                : "opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>4 Seksi vs Target 80%</span>
          </button>
          <button
            onClick={() => setActiveVisualMode("zones")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeVisualMode === "zones"
                ? "bg-amber-500 text-stone-950 shadow-sm"
                : "opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Spektrum Zona Siswa</span>
          </button>
          <button
            onClick={() => setActiveVisualMode("weights")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeVisualMode === "weights"
                ? "bg-amber-500 text-stone-950 shadow-sm"
                : "opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Bobot Soal &amp; Poin</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          MODE 1: 4 SECTIONS COMPARATIVE PROGRESS BARS (VS 80% PASS THRESHOLD)
          ======================================================== */}
      {activeVisualMode === "sections" && (
        <div className="space-y-6">
          {/* Executive Summary Bar Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {sections.map((sec) => {
              const gap = (sec.avg - sec.passTarget).toFixed(1);
              const isPassing = sec.avg >= sec.passTarget;
              return (
                <div key={sec.key} className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[11px] truncate">{sec.short}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-bold">
                      {sec.weightPct}% Bobot
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-black" style={{ color: sec.color }}>
                        {sec.avg}
                      </span>
                      <span className="text-[10px] opacity-60 ml-1">/ {sec.max} pt</span>
                    </div>
                    <span className="font-mono font-bold text-xs">
                      {sec.pct}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-current/5">
                    <span className="opacity-70">Target 80%: {sec.passTarget} pt</span>
                    <span className={isPassing ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                      {isPassing ? `+${gap} pt` : `${gap} pt`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4 Section Detailed Visual Comparison Chart */}
          <div className="space-y-4 pt-2">
            {sections.map((sec) => {
              const pctOfMax = Math.round((sec.avg / sec.max) * 100);
              const isPassing = sec.avg >= sec.passTarget;
              return (
                <div key={sec.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm">{sec.name}</span>
                      <span className="text-[10px] font-mono opacity-70">
                        {sec.soal} Soal × {sec.pointPerSoal} pt = {sec.max} Poin Maksimal
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-black text-sm" style={{ color: sec.color }}>
                        {sec.avg} pt ({pctOfMax}%)
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPassing
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      }`}>
                        {isPassing ? "✓ Lulus Seksi" : "✕ Di Bawah Ambang 80%"}
                      </span>
                    </div>
                  </div>

                  {/* Dual Bar Graphic with 80% Benchmark Line */}
                  <div className="relative h-7 w-full bg-black/10 dark:bg-white/10 rounded-xl overflow-hidden p-0.5">
                    {/* Fill Bar */}
                    <div
                      className={`h-full rounded-lg transition-all duration-500 relative flex items-center justify-end pr-2 text-[10px] font-black text-white bg-gradient-to-r ${sec.barBg}`}
                      style={{ width: `${Math.min(100, Math.max(12, pctOfMax))}%` }}
                    >
                      <span>{sec.avg} / {sec.max} pt</span>
                    </div>

                    {/* 80% Passing Target Line Marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-emerald-500 z-10"
                      style={{ left: `80%` }}
                      title="Ambang Kelulusan Resmi: 80%"
                    >
                      <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] opacity-60">
                    <span>0 pt</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Garis Kelulusan 80% ({sec.passTarget} pt)</span>
                    <span>100% ({sec.max} pt)</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Strategic Insight Callout */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-extrabold text-amber-700 dark:text-amber-300 block">
                Insight Strategis Shihan: Mengapa Dokkai &amp; Choukai Menjadi Kunci Kelulusan 100%?
              </span>
              <p className="opacity-80 leading-relaxed">
                Total poin dari <strong>読解 (Dokkai - 88 pt)</strong> dan <strong>聴解 (Choukai - 66 pt)</strong> adalah <strong>154 poin (61.6%)</strong>. Meskipun seorang siswa memperoleh nilai sempurna di Moji-Goi (48 pt) dan Kaiwa (48 pt), total keduanya hanya 96 pt—masih jauh di bawah ambang 200 pt. Oleh karena itu, penguatan teknik skimming teks Dokkai dan konsentrasi audio Choukai adalah faktor pembeda utama untuk menjamin 100% kelulusan JFT-Basic A2.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 2: STUDENT SPECTRUM ZONES (LULUS VS WASPADA VS REMEDIAL)
          ======================================================== */}
      {activeVisualMode === "zones" && (
        <div className="space-y-6">
          {/* Zone Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Zone Lulus */}
            <div
              onClick={() => setSelectedZone(selectedZone === "pass" ? "all" : "pass")}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                selectedZone === "pass"
                  ? "bg-emerald-500/20 border-emerald-500 shadow-md scale-[1.02]"
                  : "bg-black/5 dark:bg-white/5 border-current/10 hover:border-emerald-500/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  ZONA AMAN (LULUS PROMETRIC)
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="my-1.5 flex items-baseline justify-between">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {passStudents.length} Siswa
                </span>
                <span className="text-xs font-mono font-bold opacity-70">
                  {Math.round((passStudents.length / (allStudents.length || 1)) * 100)}%
                </span>
              </div>
              <span className="text-[10px] opacity-70 block">
                Skor total $\ge 200$ dari 250 pt. Siap mengikuti ujian resmi.
              </span>
            </div>

            {/* Zone Waspada */}
            <div
              onClick={() => setSelectedZone(selectedZone === "caution" ? "all" : "caution")}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                selectedZone === "caution"
                  ? "bg-amber-500/20 border-amber-500 shadow-md scale-[1.02]"
                  : "bg-black/5 dark:bg-white/5 border-current/10 hover:border-amber-500/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  ZONA WASPADA (BORDERLINE)
                </span>
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="my-1.5 flex items-baseline justify-between">
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {cautionStudents.length} Siswa
                </span>
                <span className="text-xs font-mono font-bold opacity-70">
                  {Math.round((cautionStudents.length / (allStudents.length || 1)) * 100)}%
                </span>
              </div>
              <span className="text-[10px] opacity-70 block">
                Skor 170 - 199 pt. Berpotensi lulus jika memperkuat Dokkai.
              </span>
            </div>

            {/* Zone Remedial */}
            <div
              onClick={() => setSelectedZone(selectedZone === "remedial" ? "all" : "remedial")}
              className={`p-4 rounded-2xl border transition cursor-pointer ${
                selectedZone === "remedial"
                  ? "bg-rose-500/20 border-rose-500 shadow-md scale-[1.02]"
                  : "bg-black/5 dark:bg-white/5 border-current/10 hover:border-rose-500/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  ZONA REMEDIAL (RISIKO TINGGI)
                </span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="my-1.5 flex items-baseline justify-between">
                <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
                  {remedialStudents.length} Siswa
                </span>
                <span className="text-xs font-mono font-bold opacity-70">
                  {Math.round((remedialStudents.length / (allStudents.length || 1)) * 100)}%
                </span>
              </div>
              <span className="text-[10px] opacity-70 block">
                Skor &lt; 170 pt. Wajib mengikuti program karantina materi.
              </span>
            </div>
          </div>

          {/* Interactive Filter Status Bar */}
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-extrabold opacity-75">
              Menampilkan {filteredStudents.length} Siswa ({selectedZone === "all" ? "Seluruh Kelas" : `Filter Zona: ${selectedZone.toUpperCase()}`})
            </span>
            {selectedZone !== "all" && (
              <button
                onClick={() => setSelectedZone("all")}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
              >
                Reset Filter (Tampilkan Semua)
              </button>
            )}
          </div>

          {/* List of Students in Selected Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredStudents.map((st) => {
              const fe = st.finalExam?.test || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
              return (
                <div key={st.no} className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2 hover:scale-[1.01] transition">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs truncate max-w-[140px]">{st.name}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      st.zone === "pass"
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : st.zone === "caution"
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                        : "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                    }`}>
                      {st.examTotal} pt
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-center">
                    <div className="p-1 rounded bg-black/5 dark:bg-white/5">
                      <span className="opacity-50 block">M</span>
                      <span className="font-bold">{fe.mojiGoi}</span>
                    </div>
                    <div className="p-1 rounded bg-black/5 dark:bg-white/5">
                      <span className="opacity-50 block">K</span>
                      <span className="font-bold">{fe.kaiwa}</span>
                    </div>
                    <div className="p-1 rounded bg-black/5 dark:bg-white/5">
                      <span className="opacity-50 block">C</span>
                      <span className="font-bold">{fe.choukai}</span>
                    </div>
                    <div className="p-1 rounded bg-black/5 dark:bg-white/5">
                      <span className="opacity-50 block">D</span>
                      <span className="font-bold">{fe.dokkai}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-current/5 text-[10px]">
                    <span className="font-mono opacity-50">{st.nim || `#${st.no}`}</span>
                    <button
                      onClick={() => onSelectStudentDetail && onSelectStudentDetail(st)}
                      className="text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
                    >
                      Detail Siswa →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          MODE 3: EXAM WEIGHTS & SECTION ARCHITECTURE (DONUT)
          ======================================================== */}
      {activeVisualMode === "weights" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Donut Weight SVG */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center py-2">
            <div className="relative">
              <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`} className="select-none">
                <circle
                  cx={donutCenter}
                  cy={donutCenter}
                  r={donutRadius}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  strokeWidth={donutStrokeWidth}
                />
                {weightSegments.map((seg, idx) => (
                  <circle
                    key={idx}
                    cx={donutCenter}
                    cy={donutCenter}
                    r={donutRadius}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={donutStrokeWidth}
                    strokeDasharray={seg.strokeDasharray}
                    strokeDashoffset={seg.strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 hover:opacity-80 cursor-pointer"
                    transform={`rotate(-90 ${donutCenter} ${donutCenter})`}
                  />
                ))}
              </svg>

              {/* Center Donut Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-2xl font-black">250</span>
                <span className="text-[9px] opacity-60 font-extrabold uppercase tracking-wider">
                  Poin Maksimal
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs w-full max-w-xs">
              {sections.map((sec, idx) => (
                <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-current/5">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: sec.color }} />
                  <div className="min-w-0 flex-1">
                    <span className="font-extrabold text-[11px] block">{sec.short}</span>
                    <span className="text-[10px] opacity-70">{sec.max} pt ({sec.weightPct}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Breakdown Table & Explanation */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Spesifikasi Bobot Ujian Standar Prometric JFT-Basic A2
              </h4>
              <p className="text-xs opacity-75 mt-0.5">
                Struktur distribusi poin dan jumlah butir soal per seksi ujian
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-sm block">1. 文字・語彙 (Moji-Goi)</span>
                  <span className="text-[11px] opacity-70">12 butir soal × 4 poin/soal</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-black text-amber-500">48 Poin</span>
                  <span className="block text-[10px] opacity-60">Bobot 19.2%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-sm block">2. 会話・表現 (Kaiwa/Hyougen)</span>
                  <span className="text-[11px] opacity-70">12 butir soal × 4 poin/soal</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-black text-blue-500">48 Poin</span>
                  <span className="block text-[10px] opacity-60">Bobot 19.2%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-sm block">3. 聴解 (Choukai)</span>
                  <span className="text-[11px] opacity-70">11 butir soal × 6 poin/soal</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-black text-purple-500">66 Poin</span>
                  <span className="block text-[10px] opacity-60">Bobot 26.4%</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-sm block">4. 読解 (Dokkai)</span>
                  <span className="text-[11px] opacity-70">11 butir soal × 8 poin/soal</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-black text-rose-500">88 Poin</span>
                  <span className="block text-[10px] opacity-60">Bobot 35.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
