"use client";

import React from "react";

interface RadarChartSVGProps {
  data: {
    mojiGoi: number;   // 0 - 100
    kaiwa: number;     // 0 - 100
    choukai: number;   // 0 - 100
    dokkai: number;    // 0 - 100
    kanji: number;     // 0 - 100
  };
  compareData?: {
    mojiGoi: number;
    kaiwa: number;
    choukai: number;
    dokkai: number;
    kanji: number;
  };
  size?: number;
  label?: string;
  compareLabel?: string;
}

export default function RadarChartSVG({
  data,
  compareData,
  size = 320,
  label = "Siswa",
  compareLabel = "Rata-rata Kelas",
}: RadarChartSVGProps) {
  const center = size / 2;
  const radius = size * 0.38;

  const categories = [
    { key: "mojiGoi", name: "文字・語彙", sub: "Moji-Goi" },
    { key: "kaiwa", name: "会話・表現", sub: "Kaiwa" },
    { key: "choukai", name: "聴解", sub: "Choukai" },
    { key: "dokkai", name: "読解", sub: "Dokkai" },
    { key: "kanji", name: "漢字", sub: "Kanji" },
  ];

  const totalPoints = categories.length;

  const getCoordinates = (index: number, value: number, maxVal = 100) => {
    const angle = (Math.PI * 2 / totalPoints) * index - Math.PI / 2;
    const r = (Math.max(0, Math.min(value, maxVal)) / maxVal) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate web rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Polygon points for primary data
  const primaryPoints = categories.map((cat, idx) => {
    const val = (data as any)[cat.key] || 0;
    const pt = getCoordinates(idx, val);
    return `${pt.x},${pt.y}`;
  }).join(" ");

  // Polygon points for compare data (if provided)
  const comparePoints = compareData
    ? categories.map((cat, idx) => {
        const val = (compareData as any)[cat.key] || 0;
        const pt = getCoordinates(idx, val);
        return `${pt.x},${pt.y}`;
      }).join(" ")
    : null;

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible select-none"
      >
        {/* Background web rings */}
        {rings.map((ring, ringIdx) => {
          const ringPoints = categories.map((_, idx) => {
            const pt = getCoordinates(idx, ring * 100);
            return `${pt.x},${pt.y}`;
          }).join(" ");

          return (
            <polygon
              key={ringIdx}
              points={ringPoints}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.12}
              strokeWidth={1}
              strokeDasharray={ringIdx < 4 ? "3,3" : "none"}
            />
          );
        })}

        {/* Axes lines from center to perimeter */}
        {categories.map((_, idx) => {
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

        {/* Compare Polygon (Kelas - Garis Putus-putus Abu/Kuning) */}
        {comparePoints && (
          <polygon
            points={comparePoints}
            fill="currentColor"
            fillOpacity={0.06}
            stroke="#94a3b8"
            strokeWidth={1.75}
            strokeDasharray="4,4"
          />
        )}

        {/* Primary Data Polygon (Siswa / Indikator Utama) */}
        <polygon
          points={primaryPoints}
          fill="rgba(245, 158, 11, 0.25)"
          stroke="#f59e0b"
          strokeWidth={2.5}
        />

        {/* Dots on vertices */}
        {categories.map((cat, idx) => {
          const val = (data as any)[cat.key] || 0;
          const pt = getCoordinates(idx, val);
          return (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r={4}
              fill="#f59e0b"
              stroke="#ffffff"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Labels on outer perimeter */}
        {categories.map((cat, idx) => {
          const angle = (Math.PI * 2 / totalPoints) * idx - Math.PI / 2;
          const labelDist = radius + 24;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);
          const val = (data as any)[cat.key] || 0;

          return (
            <g key={idx} transform={`translate(${lx}, ${ly})`}>
              <text
                textAnchor="middle"
                dominantBaseline="central"
                className="font-bold fill-current text-[11px]"
              >
                {cat.name}
              </text>
              <text
                y={14}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[9.5px] fill-amber-500 font-mono font-black"
              >
                {val}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-[11px] font-bold">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm" />
          <span>{label}</span>
        </div>
        {compareData && (
          <div className="flex items-center gap-1.5 opacity-70">
            <span className="w-3 h-1 border-t-2 border-dashed border-slate-400 inline-block" />
            <span>{compareLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
