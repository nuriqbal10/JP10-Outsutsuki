"use client";

import React, { useState } from "react";
import {
  BarChart2,
  PieChart,
  Target,
  Trophy,
  Award,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
  Activity,
  Layers,
} from "lucide-react";
import { StudentRaporItem } from "@/types/rapor";

interface ClassOverviewVisualsProps {
  allStudents: StudentRaporItem[];
  kkm: number;
  classPilarAvg: {
    mojiGoi: number;
    kaiwa: number;
    choukai: number;
    dokkai: number;
    kanji: number;
  };
  classRawSectionAvg: {
    mojiGoi: number;
    kaiwa: number;
    choukai: number;
    dokkai: number;
    kanji: number;
  };
  calculatedClassAvg: string;
}

export default function ClassOverviewVisuals({
  allStudents,
  kkm,
  classPilarAvg,
  classRawSectionAvg,
  calculatedClassAvg,
}: ClassOverviewVisualsProps) {
  const [activeVisualTab, setActiveVisualTab] = useState<"radar" | "bars" | "distribution">("radar");
  const [hoveredPillar, setHoveredPillar] = useState<string | null>(null);

  // Top Student untuk pembanding Radar
  const topStudent = [...allStudents].sort((a, b) => (b.compositeScore || 0) - (a.compositeScore || 0))[0];
  const topPilar = topStudent?.pilar || {
    mojiGoi: Math.round(((topStudent?.averages?.mojiGoi || 0) / 24) * 100),
    kaiwa: Math.round(((topStudent?.averages?.kaiwa || 0) / 24) * 100),
    choukai: Math.round(((topStudent?.averages?.choukai || 0) / 24) * 100),
    dokkai: Math.round(((topStudent?.averages?.dokkai || 0) / 28) * 100),
    kanji: topStudent?.averages?.kanji || 0,
  };

  // Hitung Distribusi Predikat
  const gradeDistribution = {
    A: allStudents.filter((s) => s.grade === "A").length,
    B: allStudents.filter((s) => s.grade === "B").length,
    C: allStudents.filter((s) => s.grade === "C").length,
    D: allStudents.filter((s) => s.grade === "D").length,
  };
  const totalStudents = allStudents.length || 28;

  // Hitung Distribusi Skor Rentang
  const scoreRanges = [
    { label: "90 - 100 pt (Istimewa)", count: allStudents.filter((s) => (s.compositeScore || 0) >= 90).length, color: "bg-emerald-500", text: "text-emerald-500" },
    { label: "80 - 89 pt (Baik Sekali)", count: allStudents.filter((s) => (s.compositeScore || 0) >= 80 && (s.compositeScore || 0) < 90).length, color: "bg-blue-500", text: "text-blue-500" },
    { label: "70 - 79 pt (Memadai)", count: allStudents.filter((s) => (s.compositeScore || 0) >= 70 && (s.compositeScore || 0) < 80).length, color: "bg-amber-500", text: "text-amber-500" },
    { label: "< 70 pt (Perlu Bimbingan)", count: allStudents.filter((s) => (s.compositeScore || 0) < 70).length, color: "bg-rose-500", text: "text-rose-500" },
  ];

  // Top 5 Siswa vs Rata-Rata Kelas
  const top5Students = [...allStudents]
    .sort((a, b) => (b.compositeScore || 0) - (a.compositeScore || 0))
    .slice(0, 5);

  // Definisi 5 Pilar untuk Radar & Bar Charts
  const pillars = [
    { key: "mojiGoi", name: "文字・語彙", label: "Moji-Goi", maxRaw: 24, classVal: classPilarAvg.mojiGoi, rawVal: classRawSectionAvg.mojiGoi, topVal: topPilar.mojiGoi },
    { key: "kaiwa", name: "会話・表現", label: "Kaiwa", maxRaw: 24, classVal: classPilarAvg.kaiwa, rawVal: classRawSectionAvg.kaiwa, topVal: topPilar.kaiwa },
    { key: "choukai", name: "聴解", label: "Choukai", maxRaw: 24, classVal: classPilarAvg.choukai, rawVal: classRawSectionAvg.choukai, topVal: topPilar.choukai },
    { key: "dokkai", name: "読解", label: "Dokkai", maxRaw: 28, classVal: classPilarAvg.dokkai, rawVal: classRawSectionAvg.dokkai, topVal: topPilar.dokkai },
    { key: "kanji", name: "漢字", label: "Kanji", maxRaw: 100, classVal: classPilarAvg.kanji, rawVal: classRawSectionAvg.kanji, topVal: topPilar.kanji },
  ];

  // Radar Chart Calculations
  const radarSize = 340;
  const center = radarSize / 2;
  const radius = radarSize * 0.38;
  const totalPoints = pillars.length;

  const getCoordinates = (index: number, val: number, max = 100) => {
    const angle = (Math.PI * 2 / totalPoints) * index - Math.PI / 2;
    const r = (Math.max(0, Math.min(val, max)) / max) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const rings = [0.25, 0.5, 0.75, 1.0];

  // Points for Class Avg polygon
  const classPoints = pillars.map((p, idx) => {
    const pt = getCoordinates(idx, p.classVal);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  // Points for KKM polygon (dashed)
  const kkmPoints = pillars.map((_, idx) => {
    const pt = getCoordinates(idx, kkm);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  // Points for Top Performer polygon
  const topPoints = pillars.map((p, idx) => {
    const pt = getCoordinates(idx, p.topVal);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  // Donut Chart calculations
  const donutSize = 180;
  const donutCenter = donutSize / 2;
  const donutRadius = 65;
  const donutStrokeWidth = 24;
  const circumference = 2 * Math.PI * donutRadius;

  const gradeSlices = [
    { grade: "A", count: gradeDistribution.A, color: "#10b981", label: "Grade A (≥85)" },
    { grade: "B", count: gradeDistribution.B, color: "#3b82f6", label: "Grade B (70-84)" },
    { grade: "C", count: gradeDistribution.C, color: "#f59e0b", label: "Grade C (55-69)" },
    { grade: "D", count: gradeDistribution.D, color: "#f43f5e", label: "Grade D (<55)" },
  ];

  let accumulatedPercent = 0;
  const donutSegments = gradeSlices.map((slice) => {
    const percent = slice.count / (totalStudents || 1);
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;
    return {
      ...slice,
      percent: Math.round(percent * 100),
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <section className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 space-y-6 shadow-xl relative overflow-hidden">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-current/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400">
              Visual Analytics Suite
            </span>
            <span className="text-xs font-mono font-bold opacity-70">
              Analisis Komparatif 5 Aspek Kompetensi
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight font-serif mt-1 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" />
            Dasbor Visual Komparasi Akademik Kelas
          </h3>
          <p className="text-xs opacity-75 mt-0.5 max-w-2xl">
            Grafik komparasi interaktif antara rata-rata kelas, standar batas KKM ({kkm} pt), dan profil capaian siswa berprestasi tertinggi.
          </p>
        </div>

        {/* TAB CONTROLLER */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 self-start lg:self-auto">
          <button
            onClick={() => setActiveVisualTab("radar")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeVisualTab === "radar"
                ? "bg-amber-500 text-stone-950 shadow-sm"
                : "opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Radar Pilar</span>
          </button>
          <button
            onClick={() => setActiveVisualTab("bars")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeVisualTab === "bars"
                ? "bg-amber-500 text-stone-950 shadow-sm"
                : "opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Komparasi Bar</span>
          </button>
          <button
            onClick={() => setActiveVisualTab("distribution")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeVisualTab === "distribution"
                ? "bg-amber-500 text-stone-950 shadow-sm"
                : "opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Distribusi Nilai</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          VIEW 1: RADAR CHART 5 PILAR (KELAS VS KKM VS TOP 1)
          ======================================================== */}
      {activeVisualTab === "radar" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Radar Chart SVG */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative py-2">
            <svg
              width={radarSize}
              height={radarSize}
              viewBox={`0 0 ${radarSize} ${radarSize}`}
              className="overflow-visible select-none drop-shadow-md"
            >
              {/* Background Web Rings */}
              {rings.map((ring, rIdx) => {
                const ringPts = pillars.map((_, idx) => {
                  const pt = getCoordinates(idx, ring * 100);
                  return `${pt.x},${pt.y}`;
                }).join(" ");
                return (
                  <polygon
                    key={rIdx}
                    points={ringPts}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity={0.12}
                    strokeWidth={1}
                    strokeDasharray={rIdx < 3 ? "3,3" : "none"}
                  />
                );
              })}

              {/* Axis lines */}
              {pillars.map((_, idx) => {
                const pt = getCoordinates(idx, 100);
                return (
                  <line
                    key={idx}
                    x1={center}
                    y1={center}
                    x2={pt.x}
                    y2={pt.y}
                    stroke="currentColor"
                    strokeOpacity={0.15}
                    strokeWidth={1}
                  />
                );
              })}

              {/* Top Performer Polygon (Emerald/Gold Tint) */}
              <polygon
                points={topPoints}
                fill="rgba(16, 185, 129, 0.12)"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="4,4"
              />

              {/* KKM Polygon (Rose/Dashed line) */}
              <polygon
                points={kkmPoints}
                fill="none"
                stroke="#f43f5e"
                strokeWidth={1.5}
                strokeDasharray="3,3"
                strokeOpacity={0.75}
              />

              {/* Class Average Polygon (Amber glowing) */}
              <polygon
                points={classPoints}
                fill="rgba(245, 158, 11, 0.25)"
                stroke="#f59e0b"
                strokeWidth={2.5}
                className="transition-all duration-300"
              />

              {/* Data points for Class Average */}
              {pillars.map((p, idx) => {
                const pt = getCoordinates(idx, p.classVal);
                const isHovered = hoveredPillar === p.key;
                return (
                  <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredPillar(p.key)} onMouseLeave={() => setHoveredPillar(null)}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7 : 4.5}
                      fill="#f59e0b"
                      stroke="#fff"
                      strokeWidth={2}
                      className="transition-all duration-200"
                    />
                  </g>
                );
              })}

              {/* Labels on Periphery */}
              {pillars.map((p, idx) => {
                const labelPt = getCoordinates(idx, 118);
                const isHovered = hoveredPillar === p.key;
                return (
                  <g
                    key={idx}
                    className="cursor-pointer transition-transform"
                    onMouseEnter={() => setHoveredPillar(p.key)}
                    onMouseLeave={() => setHoveredPillar(null)}
                  >
                    <text
                      x={labelPt.x}
                      y={labelPt.y - 4}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[11px] font-extrabold fill-current ${
                        isHovered ? "fill-amber-500 font-black" : "opacity-90"
                      }`}
                    >
                      {p.name}
                    </text>
                    <text
                      x={labelPt.x}
                      y={labelPt.y + 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[9px] font-mono fill-current ${
                        isHovered ? "fill-amber-500 font-bold" : "opacity-60"
                      }`}
                    >
                      {p.classVal}% ({p.rawVal}/{p.maxRaw})
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Legend Interactive */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                <span className="font-bold">🏛️ Rata-Rata Kelas ({calculatedClassAvg} pt)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-rose-500 rounded-full" />
                <span className="font-medium opacity-80">🎯 Regulasi KKM ({kkm}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 bg-emerald-500 border border-emerald-400 border-dashed" />
                <span className="font-medium opacity-80">👑 Juara 1 ({topStudent?.name?.split(" ")[0]} - {topStudent?.compositeScore} pt)</span>
              </div>
            </div>
          </div>

          {/* Radar Diagnostic Explanations */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                  Ringkasan Morfologi Radar
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">
                  5 Dimensi
                </span>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">
                Grafik jaring laba-laba memperlihatkan keseimbangan kompetensi kelas. Pilar yang menyusut ke dalam menunjukkan area yang butuh remediasi massal.
              </p>
            </div>

            {/* List 5 Pillars with gap against KKM */}
            <div className="space-y-1.5">
              {pillars.map((p) => {
                const gap = p.classVal - kkm;
                const isPassed = gap >= 0;
                return (
                  <div
                    key={p.key}
                    onMouseEnter={() => setHoveredPillar(p.key)}
                    onMouseLeave={() => setHoveredPillar(null)}
                    className={`p-2.5 rounded-xl border transition flex items-center justify-between text-xs cursor-pointer ${
                      hoveredPillar === p.key
                        ? "bg-amber-500/15 border-amber-500/40 shadow-xs"
                        : "bg-black/5 dark:bg-white/5 border-current/10 hover:bg-black/10 dark:hover:bg-white/10"
                    }`}
                  >
                    <div>
                      <span className="font-extrabold">{p.name} ({p.label})</span>
                      <span className="block text-[10px] opacity-60">
                        Skor Mentah: {p.rawVal} / {p.maxRaw}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-black text-sm">{p.classVal}%</span>
                      <span className={`block text-[10px] font-bold ${isPassed ? "text-emerald-500" : "text-rose-500"}`}>
                        {isPassed ? `+${gap}% di atas KKM` : `${gap}% di bawah KKM`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 2: GROUPED COMPARATIVE BAR CHART (KELAS VS KKM VS MAX)
          ======================================================== */}
      {activeVisualTab === "bars" && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-extrabold text-sm block">Komparasi Batang: Rata-Rata Kelas vs Target Standar KKM ({kkm}%)</span>
              <p className="opacity-70 text-[11px]">
                Bilah emas merepresentasikan rata-rata penguasaan kelas saat ini, sedangkan garis putus-putus merah menandakan ambang batas kelulusan KKM.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-3.5 h-3.5 rounded bg-amber-500" />
                <span>Kelas</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-3.5 h-3.5 rounded bg-slate-300 dark:bg-slate-700" />
                <span>Maksimum</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold">
                <span className="w-3 h-0.5 bg-rose-500" />
                <span>KKM {kkm}%</span>
              </div>
            </div>
          </div>

          {/* 5 Pillar Horizontal Comparison Bars */}
          <div className="space-y-4">
            {pillars.map((p) => {
              const gap = p.classVal - kkm;
              const isPassed = gap >= 0;
              return (
                <div key={p.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm">{p.name}</span>
                      <span className="text-[11px] opacity-70">({p.label})</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 opacity-70">
                        Rata-rata: {p.rawVal} / {p.maxRaw} pt
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-black text-sm text-amber-600 dark:text-amber-400">
                        {p.classVal}%
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPassed
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                      }`}>
                        {isPassed ? `✓ Tuntas (+${gap}%)` : `✕ Kurang (${gap}%)`}
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar with KKM line */}
                  <div className="relative h-6 w-full bg-black/10 dark:bg-white/10 rounded-xl overflow-hidden p-0.5">
                    {/* Fill Bar */}
                    <div
                      className={`h-full rounded-lg transition-all duration-500 relative flex items-center justify-end pr-2 text-[10px] font-bold text-stone-950 ${
                        isPassed ? "bg-gradient-to-r from-amber-500 to-amber-400" : "bg-gradient-to-r from-amber-600 to-rose-500"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(10, p.classVal))}%` }}
                    >
                      <span>{p.classVal}%</span>
                    </div>

                    {/* KKM Threshold Marker Line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
                      style={{ left: `${kkm}%` }}
                      title={`Target KKM: ${kkm}%`}
                    >
                      <div className="absolute -top-1 -left-1 w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top 5 Students Comparison Benchmarking */}
          <div className="pt-4 border-t border-current/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  5 Siswa Teratas vs Garis Rata-Rata Kelas ({calculatedClassAvg} pt)
                </h4>
                <p className="text-[11px] opacity-70">
                  Visualisasi keunggulan nilai individu terhadap baseline rata-rata kelas
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {top5Students.map((st, idx) => {
                const score = st.compositeScore || 0;
                const diff = (score - parseFloat(calculatedClassAvg)).toFixed(1);
                return (
                  <div key={st.no} className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-1.5 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-black text-[10px] flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                        +{diff} pt
                      </span>
                    </div>
                    <span className="font-extrabold text-xs block truncate" title={st.name}>
                      {st.name}
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-black text-amber-600 dark:text-amber-400">
                        {score}
                      </span>
                      <span className="text-[10px] opacity-60">Grade {st.grade}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VIEW 3: DISTRIBUSI PREDIKAT & RENTANG NILAI (DONUT & HISTOGRAM)
          ======================================================== */}
      {activeVisualTab === "distribution" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Donut Chart SVG */}
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
                {donutSegments.map((seg, idx) => (
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
                <span className="text-3xl font-black">{totalStudents}</span>
                <span className="text-[10px] opacity-60 font-extrabold uppercase tracking-wider">
                  Siswa
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs w-full max-w-xs">
              {donutSegments.map((seg, idx) => (
                <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-black/5 dark:bg-white/5 border border-current/5">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <div className="min-w-0 flex-1">
                    <span className="font-extrabold text-[11px] block">{seg.label}</span>
                    <span className="text-[10px] opacity-70">{seg.count} Siswa ({seg.percent}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Histogram / Score Bracket Spectrum */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Spektrum Sebaran Rentang Nilai Siswa
              </h4>
              <p className="text-xs opacity-75 mt-0.5">
                Pemetaan 28 siswa berdasarkan kelompok interval nilai akhir komulatif
              </p>
            </div>

            <div className="space-y-3">
              {scoreRanges.map((range, idx) => {
                const pct = Math.round((range.count / (totalStudents || 1)) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold">{range.label}</span>
                      <span className="font-mono font-bold">
                        {range.count} Siswa <span className="opacity-60">({pct}%)</span>
                      </span>
                    </div>

                    <div className="h-4 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${range.color}`}
                        style={{ width: `${Math.max(4, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* KKM Pass-Rate Barometer */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Barometer Ketuntasan KKM (≥{kkm} pt)
                </span>
                <span className="font-black text-sm text-amber-600 dark:text-amber-400 font-mono">
                  {Math.round((allStudents.filter((s) => (s.compositeScore || 0) >= kkm).length / (totalStudents || 1)) * 100)}%
                </span>
              </div>
              <p className="text-[11px] opacity-75 leading-relaxed">
                {allStudents.filter((s) => (s.compositeScore || 0) >= kkm).length} dari {totalStudents} peserta didik telah mencapai standar kompetensi kelulusan minimal. Siswa di bawah {kkm} pt dijadwalkan untuk pendampingan mandiri melalui latihan CBT interaktif.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
