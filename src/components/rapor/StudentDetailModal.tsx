"use client";

import React, { useState } from "react";
import { X, Award, Printer, BookOpen, CheckCircle2, ChevronRight, User, Sparkles, AlertCircle } from "lucide-react";
import { StudentRaporItem } from "@/types/rapor";
import RadarChartSVG from "./RadarChartSVG";

interface StudentDetailModalProps {
  student: StudentRaporItem | null;
  classPilarAvg: {
    mojiGoi: number;
    kaiwa: number;
    choukai: number;
    dokkai: number;
    kanji: number;
  };
  classFinalExamAvg?: {
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
  levelTitle: string;
  onClose: () => void;
}

export default function StudentDetailModal({
  student,
  classPilarAvg,
  classFinalExamAvg,
  levelTitle,
  onClose,
}: StudentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "chapters" | "exams">("overview");
  const kkm = typeof window !== "undefined" ? Number(localStorage.getItem("outsutsuki_kkm")) || 85 : 85;

  if (!student) return null;

  // 5 Pilar Siswa
  const validDai = student.harian.filter((h) => h.daiTesuto && h.daiTesuto.total > 0);
  let sumMoji = 0, sumKaiwa = 0, sumChoukai = 0, sumDokkai = 0;
  if (validDai.length > 0) {
    validDai.forEach((h) => {
      sumMoji += (h.daiTesuto.mojiGoi / 24) * 100;
      sumKaiwa += (h.daiTesuto.kaiwa / 24) * 100;
      sumChoukai += (h.daiTesuto.choukai / 24) * 100;
      sumDokkai += (h.daiTesuto.dokkai / 28) * 100;
    });
  }

  const validKanji = student.harian.filter((h) => h.kanji > 0);
  const avgKanji = validKanji.length > 0
    ? validKanji.reduce((acc, cur) => acc + cur.kanji, 0) / validKanji.length
    : 0;

  const studentPilar = {
    mojiGoi: validDai.length > 0 ? Math.min(100, Math.round(sumMoji / validDai.length)) : 0,
    kaiwa: validDai.length > 0 ? Math.min(100, Math.round(sumKaiwa / validDai.length)) : 0,
    choukai: validDai.length > 0 ? Math.min(100, Math.round(sumChoukai / validDai.length)) : 0,
    dokkai: validDai.length > 0 ? Math.min(100, Math.round(sumDokkai / validDai.length)) : 0,
    kanji: Math.min(100, Math.round(avgKanji)),
  };

  const pilarList = [
    { label: "文字・語彙 (Moji-Goi)", val: studentPilar.mojiGoi, avg: classPilarAvg.mojiGoi },
    { label: "会話・表現 (Kaiwa)", val: studentPilar.kaiwa, avg: classPilarAvg.kaiwa },
    { label: "聴解 (Choukai)", val: studentPilar.choukai, avg: classPilarAvg.choukai },
    { label: "読解 (Dokkai)", val: studentPilar.dokkai, avg: classPilarAvg.dokkai },
    { label: "漢字 (Kanji)", val: studentPilar.kanji, avg: classPilarAvg.kanji },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
      <div className="clay-card w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-current/15 rounded-3xl">
        {/* HEADER MODAL */}
        <div className="p-4 sm:p-6 border-b border-current/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${student.avatarColor || "from-amber-400 to-amber-600"} text-stone-950 font-black text-lg flex items-center justify-center shadow-md border-2 border-white/40`}>
              {student.no}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  {student.playerLevel || "Ninja Outsutsuki"}
                </span>
                <span className="text-xs font-mono font-bold text-amber-500">
                  {student.nim ? `NIM: ${student.nim}` : `Absen #${student.no}`}
                </span>
                <span className="text-xs font-mono opacity-60">
                  • {levelTitle}
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight mt-0.5">
                {student.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-current/20 bg-black/5 dark:bg-white/10 hover:scale-105 transition flex items-center gap-1.5 text-xs font-bold"
              title="Cetak Lembar Rapor Siswa"
            >
              <Printer className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Cetak PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-current/20 bg-black/5 dark:bg-white/10 hover:scale-105 transition"
              title="Tutup"
            >
              <X className="w-5 h-5 opacity-70" />
            </button>
          </div>
        </div>

        {/* TAB BUTTONS */}
        <div className="px-6 pt-3 border-b border-current/10 flex gap-4 shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === "overview"
                ? "border-amber-500 text-amber-500"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            📊 Ikhtisar & Radar Kompetensi
          </button>
          <button
            onClick={() => setActiveTab("chapters")}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === "chapters"
                ? "border-amber-500 text-amber-500"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            📖 Riwayat Nilai 18 Bab
          </button>
          <button
            onClick={() => setActiveTab("exams")}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === "exams"
                ? "border-amber-500 text-amber-500"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            🎯 Ujian Berkala (復習試験)
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="clay-card p-3.5 rounded-2xl border border-current/10 text-center">
                  <span className="text-[10px] uppercase font-bold opacity-70 block">Skor Komposit</span>
                  <span className="text-2xl font-black text-amber-500 font-mono">
                    {student.compositeScore || 0}
                  </span>
                </div>
                <div className="clay-card p-3.5 rounded-2xl border border-current/10 text-center">
                  <span className="text-[10px] uppercase font-bold opacity-70 block">Predikat Grade</span>
                  <span className="text-2xl font-black text-emerald-500">
                    {student.grade || "B"}
                  </span>
                </div>
                <div className="clay-card p-3.5 rounded-2xl border border-current/10 text-center">
                  <span className="text-[10px] uppercase font-bold opacity-70 block">Poin Pengalaman</span>
                  <span className="text-2xl font-black text-amber-500 font-mono">
                    {student.xp || 480} XP
                  </span>
                </div>
                <div className="clay-card p-3.5 rounded-2xl border border-current/10 text-center">
                  <span className="text-[10px] uppercase font-bold opacity-70 block">Bab Diselesaikan</span>
                  <span className="text-2xl font-black font-mono">
                    {validDai.length} / 18
                  </span>
                </div>
              </div>

              {/* Radar & Detail 5 Pilar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="clay-card p-5 rounded-2xl border border-current/10 flex flex-col items-center">
                  <h4 className="text-xs font-black uppercase tracking-wider mb-2 opacity-80">
                    Profil Radar 5 Kompetensi Irodori
                  </h4>
                  <RadarChartSVG
                    data={studentPilar}
                    compareData={classPilarAvg}
                    size={280}
                    label={student.name.split(" ")[0]}
                    compareLabel="Rata-rata Kelas"
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider opacity-80">
                    Perbandingan 5 Pilar terhadap Kelas
                  </h4>
                  {pilarList.map((p, idx) => {
                    const diff = p.val - p.avg;
                    return (
                      <div key={idx} className="clay-card p-3 rounded-xl border border-current/10 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>{p.label}</span>
                          <span className="font-mono text-amber-500">{p.val}% (Kelas: {p.avg}%)</span>
                        </div>
                        <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2 overflow-hidden flex">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${p.val}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-bold block ${diff >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                          {diff >= 0 ? `▲ +${diff}% di atas rata-rata kelas` : `▼ ${diff}% perlu peningkatan`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Catatan Evaluasi Guru */}
              <div className="clay-card p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5">
                <div className="flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <Sparkles className="w-4 h-4" /> Catatan Pedagogis Pengajar (イクバル先生)
                </div>
                <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                  Ananda <strong>{student.name}</strong> menunjukkan penguasaan yang sangat baik pada aspek{" "}
                  <strong>
                    {studentPilar.dokkai >= studentPilar.choukai ? "Pemahaman Bacaan (読解)" : "Menyimak Audio (聴解)"}
                  </strong>
                  . Disarankan untuk terus memperbanyak latihan kanji harian dan kosakata percakapan agar konsistensi nilai tetap terjaga hingga simulasi akhir JFT-Basic.
                </p>
              </div>
            </div>
          )}

          {activeTab === "chapters" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider opacity-80">
                    Matriks Diagnostik Bab 1 s.d. 18 &amp; Checkpoints Evaluasi
                  </h4>
                  <p className="text-[11px] opacity-70">
                    Pemetaan 4 Poin: 1. Shiken (Moji-Goi, Kaiwa, Choukai, Dokkai), 2. Kanji, 3. Kotoba, 4. Honyaku
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 font-bold border border-amber-500/30">
                  18 Bab + 3 Checkpoint + Shiken Buku
                </span>
              </div>
              <div className="overflow-x-auto border border-current/15 rounded-2xl bg-white/30 dark:bg-stone-950/40 p-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-current/15 opacity-80 text-[10px] uppercase font-bold bg-black/5 dark:bg-white/5">
                      <th className="py-2.5 px-3">Unit / Ujian</th>
                      <th className="py-2.5 px-2 text-center text-blue-500">文字語彙 (24)</th>
                      <th className="py-2.5 px-2 text-center text-cyan-500">会話 (24)</th>
                      <th className="py-2.5 px-2 text-center text-emerald-500">聴解 (24)</th>
                      <th className="py-2.5 px-2 text-center text-purple-500">読解 (28)</th>
                      <th className="py-2.5 px-2 text-center font-black text-amber-500">Total Shiken</th>
                      <th className="py-2.5 px-2 text-center text-rose-500">2. 漢字</th>
                      <th className="py-2.5 px-2 text-center text-amber-500">3. 言葉</th>
                      <th className="py-2.5 px-2 text-center text-teal-500">4. 翻訳</th>
                      <th className="py-2.5 px-3 min-w-[140px]">Diagnosa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-current/10 font-mono text-[11px]">
                    {Array.from({ length: 18 }, (_, idx) => {
                      const chapterNum = idx + 1;
                      const h = student.harian?.[idx];
                      const dt = h?.daiTesuto || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
                      const kanji = typeof h?.kanji === "number" ? h.kanji : 0;
                      const kotoba = typeof h?.kotoba === "number" ? h.kotoba : 0;
                      const honyaku = typeof h?.honyaku === "number" ? h.honyaku : 0;

                      const defs: string[] = [];
                      if (dt.total > 0) {
                        if (((dt.dokkai / 28) * 100) < kkm) defs.push("Dokkai");
                        if (((dt.choukai / 24) * 100) < kkm) defs.push("Choukai");
                        if (((dt.kaiwa / 24) * 100) < kkm) defs.push("Kaiwa");
                        if (((dt.mojiGoi / 24) * 100) < kkm) defs.push("Moji");
                      }
                      if (kanji > 0 && kanji < kkm) defs.push("Kanji");
                      if (kotoba > 0 && kotoba < kkm) defs.push("Kotoba");
                      if (honyaku > 0 && honyaku < kkm) defs.push("Honyaku");

                      const rowsToRender = [];

                      // Render Chapter Row
                      rowsToRender.push(
                        <tr key={`ch-${chapterNum}`} className="border-b border-current/10 hover:bg-black/5 dark:hover:bg-white/5 transition">
                          <td className="py-2 px-3 font-sans font-bold text-amber-500">
                            第{chapterNum}課
                          </td>
                          <td className="py-2 px-2 text-center">{dt.mojiGoi > 0 ? dt.mojiGoi : "-"}</td>
                          <td className="py-2 px-2 text-center">{dt.kaiwa > 0 ? dt.kaiwa : "-"}</td>
                          <td className="py-2 px-2 text-center">{dt.choukai > 0 ? dt.choukai : "-"}</td>
                          <td className="py-2 px-2 text-center">{dt.dokkai > 0 ? dt.dokkai : "-"}</td>
                          <td className="py-2 px-2 text-center font-black">
                            {dt.total > 0 ? (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] ${dt.total >= kkm ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
                                {dt.total}
                              </span>
                            ) : "-"}
                          </td>
                          <td className="py-2 px-2 text-center">{kanji > 0 ? kanji : "-"}</td>
                          <td className="py-2 px-2 text-center">{kotoba > 0 ? kotoba : "-"}</td>
                          <td className="py-2 px-2 text-center">{honyaku > 0 ? honyaku : "-"}</td>
                          <td className="py-2 px-3 font-sans text-[10.5px]">
                            {defs.length > 0 ? (
                              <span className="text-rose-500 font-bold">⚠️ Lemah: {defs.join(", ")}</span>
                            ) : dt.total >= kkm ? (
                              <span className="text-emerald-500 font-bold">✅ Tuntas (≥{kkm}%)</span>
                            ) : (
                              <span className="opacity-40">-</span>
                            )}
                          </td>
                        </tr>
                      );

                      // Checkpoint 1 setelah Bab 6
                      if (chapterNum === 6) {
                        const cp = student.fukushuu1;
                        const t = cp?.test || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
                        rowsToRender.push(
                          <tr key="cp-1" className="bg-amber-500/15 font-bold border-y-2 border-amber-500/30">
                            <td className="py-2 px-3 font-sans font-black text-amber-600 dark:text-amber-400">
                              🎖️ Checkpoint 1 (Bab 1–6)
                            </td>
                            <td className="py-2 px-2 text-center">{t.mojiGoi || "-"}</td>
                            <td className="py-2 px-2 text-center">{t.kaiwa || "-"}</td>
                            <td className="py-2 px-2 text-center">{t.choukai || "-"}</td>
                            <td className="py-2 px-2 text-center">{t.dokkai || "-"}</td>
                            <td className="py-2 px-2 text-center font-black text-amber-500">
                              {t.total > 0 ? `${t.total}/250` : "-"}
                            </td>
                            <td className="py-2 px-2 text-center">{cp?.kanji || "-"}</td>
                            <td className="py-2 px-2 text-center">{cp?.kotoba || "-"}</td>
                            <td className="py-2 px-2 text-center">{cp?.honyaku || "-"}</td>
                            <td className="py-2 px-3 font-sans text-[10.5px] font-bold text-amber-600 dark:text-amber-400">
                              {t.total > 0 ? "Evaluasi Checkpoint 1" : "Belum diuji"}
                            </td>
                          </tr>
                        );
                      }

                      // Checkpoint 2 setelah Bab 12
                      if (chapterNum === 12) {
                        const cp = student.fukushuu2;
                        const t = cp?.test || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
                        rowsToRender.push(
                          <tr key="cp-2" className="bg-amber-500/15 font-bold border-y-2 border-amber-500/30">
                            <td className="py-2 px-3 font-sans font-black text-amber-600 dark:text-amber-400">
                              🎖️ Checkpoint 2 (Bab 7–12)
                            </td>
                            <td className="py-2 px-2 text-center">{t.mojiGoi || "-"}</td>
                            <td className="py-2 px-2 text-center">{t.kaiwa || "-"}</td>
                            <td className="py-2 px-2 text-center">{t.choukai || "-"}</td>
                            <td className="py-2 px-2 text-center">{t.dokkai || "-"}</td>
                            <td className="py-2 px-2 text-center font-black text-amber-500">
                              {t.total > 0 ? `${t.total}/250` : "-"}
                            </td>
                            <td className="py-2 px-2 text-center">{cp?.kanji || "-"}</td>
                            <td className="py-2 px-2 text-center">{cp?.kotoba || "-"}</td>
                            <td className="py-2 px-2 text-center">{cp?.honyaku || "-"}</td>
                            <td className="py-2 px-3 font-sans text-[10.5px] font-bold text-amber-600 dark:text-amber-400">
                              {t.total > 0 ? "Evaluasi Checkpoint 2" : "Belum diuji"}
                            </td>
                          </tr>
                        );
                      }

                      // Checkpoint 3 setelah Bab 18
                      if (chapterNum === 18) {
                        const cp = student.fukushuu3;
                        const t = cp?.test || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
                        rowsToRender.push(
                          <tr key="cp-3" className="bg-amber-500/15 font-bold border-y-2 border-amber-500/30">
                            <td className="py-2 px-3 font-sans font-black text-amber-600 dark:text-amber-400">
                              🎖️ Checkpoint 3 (Bab 13–18)
                            </td>
                            <td className="py-2 px-2 text-center">{t.mojiGoi || "-"}</td>
                            <td className="py-2 px-2 text-center">{t.kaiwa || "-"}</td>
                            <td className="py-2 px-2 text-center">{t.choukai || "-"}</td>
                            <td className="py-2 px-2 text-center">{t.dokkai || "-"}</td>
                            <td className="py-2 px-2 text-center font-black text-amber-500">
                              {t.total > 0 ? `${t.total}/250` : "-"}
                            </td>
                            <td className="py-2 px-2 text-center">{cp?.kanji || "-"}</td>
                            <td className="py-2 px-2 text-center">{cp?.kotoba || "-"}</td>
                            <td className="py-2 px-2 text-center">{cp?.honyaku || "-"}</td>
                            <td className="py-2 px-3 font-sans text-[10.5px] font-bold text-amber-600 dark:text-amber-400">
                              {t.total > 0 ? "Evaluasi Checkpoint 3" : "Belum diuji"}
                            </td>
                          </tr>
                        );

                        // Shiken 1 Buku (Final Exam)
                        const fn = student.finalExam;
                        const fnTest = fn?.test || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
                        rowsToRender.push(
                          <tr key="final-exam" className="bg-purple-500/20 font-black border-y-2 border-purple-500/40">
                            <td className="py-2.5 px-3 font-sans font-black text-purple-600 dark:text-purple-300">
                              👑 Shiken 1 Buku (Full Book)
                            </td>
                            <td className="py-2 px-2 text-center">{fnTest.mojiGoi || "-"}</td>
                            <td className="py-2 px-2 text-center">{fnTest.kaiwa || "-"}</td>
                            <td className="py-2 px-2 text-center">{fnTest.choukai || "-"}</td>
                            <td className="py-2 px-2 text-center">{fnTest.dokkai || "-"}</td>
                            <td className="py-2 px-2 text-center font-black text-purple-500">
                              {fnTest.total > 0 ? `${fnTest.total}/250` : "-"}
                            </td>
                            <td className="py-2 px-2 text-center">{fn?.kanji || "-"}</td>
                            <td className="py-2 px-2 text-center">{fn?.kotoba || "-"}</td>
                            <td className="py-2 px-2 text-center">{fn?.honyaku || "-"}</td>
                            <td className="py-2 px-3 font-sans text-[10.5px] font-black text-purple-600 dark:text-purple-300">
                              {fnTest.total > 0 ? "Ujian Akhir Buku Tuntas" : "Belum ditempuh"}
                            </td>
                          </tr>
                        );
                      }

                      return rowsToRender;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "exams" && (
            <div className="space-y-6">
              {/* SPOTLIGHT KHUSUS: SHIKEN 1 BUKU (総括終了試験 - UJIAN AKHIR KOMPREHENSIF) */}
              {(() => {
                const fn = student.finalExam;
                const fnTest = fn?.test || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
                const isPassedJft = (fnTest.total || 0) >= 200;
                const isWarningJft = (fnTest.total || 0) >= 170 && !isPassedJft;
                const cAvg = classFinalExamAvg || {
                  mojiGoi: 30.4,
                  kaiwa: 29.8,
                  choukai: 42.1,
                  dokkai: 51.5,
                  total: 153.8,
                  pctMoji: 63,
                  pctKaiwa: 62,
                  pctChoukai: 64,
                  pctDokkai: 59,
                };

                const sectionsBreakdown = [
                  {
                    id: "mojiGoi",
                    name: "Seksi 1: 文字・語彙",
                    sub: "Huruf & Kosakata",
                    score: fnTest.mojiGoi || 0,
                    max: 48,
                    avg: cAvg.mojiGoi,
                    pct: Math.round(((fnTest.mojiGoi || 0) / 48) * 100),
                    avgPct: cAvg.pctMoji,
                  },
                  {
                    id: "kaiwa",
                    name: "Seksi 2: 会話・表現",
                    sub: "Percakapan & Tata Bahasa",
                    score: fnTest.kaiwa || 0,
                    max: 48,
                    avg: cAvg.kaiwa,
                    pct: Math.round(((fnTest.kaiwa || 0) / 48) * 100),
                    avgPct: cAvg.pctKaiwa,
                  },
                  {
                    id: "choukai",
                    name: "Seksi 3: 聴解",
                    sub: "Menyimak Audio Percakapan",
                    score: fnTest.choukai || 0,
                    max: 66,
                    avg: cAvg.choukai,
                    pct: Math.round(((fnTest.choukai || 0) / 66) * 100),
                    avgPct: cAvg.pctChoukai,
                  },
                  {
                    id: "dokkai",
                    name: "Seksi 4: 読解",
                    sub: "Pemahaman Membaca Wacana",
                    score: fnTest.dokkai || 0,
                    max: 88,
                    avg: cAvg.dokkai,
                    pct: Math.round(((fnTest.dokkai || 0) / 88) * 100),
                    avgPct: cAvg.pctDokkai,
                  },
                ];

                return (
                  <div className="clay-card p-6 sm:p-7 rounded-3xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-950/20 via-black/10 to-amber-950/20 shadow-2xl space-y-5">
                    {/* Header Pembedahan Shiken Akhir */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-500/30 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-500 text-white shadow-md">
                            👑 SHIKEN 1 BUKU (総括終了試験)
                          </span>
                          <span className="text-[11px] font-bold text-amber-500 uppercase px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30">
                            Wajib Dibedah • Shiken Akhir
                          </span>
                        </div>
                        <h3 className="text-base sm:text-xl font-black mt-1 text-purple-600 dark:text-purple-300">
                          Audit Komprehensif 4 Seksi Ujian Akhir JFT-Basic A2 (Skala 250 Poin)
                        </h3>
                        <p className="text-xs opacity-75 mt-0.5">
                          Standar kelulusan Prometric / The Japan Foundation: <strong>≥ 200 / 250 pt (80%)</strong>.
                        </p>
                      </div>

                      {/* Total Score Badge */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold opacity-70 block">Total Skor Akhir</span>
                          <div className="text-2xl sm:text-3xl font-black font-mono text-purple-600 dark:text-purple-300">
                            {fnTest.total || 0} <span className="text-xs text-current/60">/ 250 pt</span>
                          </div>
                          <span className="text-[10px] opacity-75">
                            Rata-Rata Kelas: <strong>{cAvg.total} pt</strong>
                          </span>
                        </div>
                        <div className={`px-3 py-2 rounded-2xl text-xs font-black flex items-center gap-1 border shadow ${
                          isPassedJft
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/40"
                            : isWarningJft
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40"
                            : "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/40"
                        }`}>
                          {isPassedJft ? "✓ LULUS JFT" : isWarningJft ? "⚠️ WASPADA" : "✕ REMEDIAL"}
                        </div>
                      </div>
                    </div>

                    {/* 4 Seksi Breakdown Prometric (Bedah Mendalam) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {sectionsBreakdown.map((sec) => {
                        const diff = sec.score - sec.avg;
                        const isUnderAvg = diff < 0;
                        return (
                          <div
                            key={sec.id}
                            className={`clay-card p-4 rounded-2xl border transition space-y-2.5 ${
                              isUnderAvg ? "border-rose-500/40 bg-rose-500/5" : "border-purple-500/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-black text-xs text-purple-600 dark:text-purple-300 truncate">
                                {sec.name}
                              </span>
                              <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
                                Max {sec.max}
                              </span>
                            </div>
                            <span className="text-[11px] opacity-70 block truncate">{sec.sub}</span>

                            <div className="flex items-baseline justify-between pt-1">
                              <div>
                                <span className="text-xl font-black font-mono text-amber-500">
                                  {sec.score}
                                </span>
                                <span className="text-xs opacity-60 font-mono"> / {sec.max} pt</span>
                              </div>
                              <span className="text-xs font-bold font-mono">
                                {sec.pct}%
                              </span>
                            </div>

                            {/* Bar Progres Siswa vs Rata-Rata Kelas */}
                            <div className="space-y-1">
                              <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2 overflow-hidden flex relative">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    sec.pct >= 80 ? "bg-emerald-500" : sec.pct >= 60 ? "bg-amber-500" : "bg-rose-500"
                                  }`}
                                  style={{ width: `${Math.min(100, sec.pct)}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-[10px] font-mono opacity-75">
                                <span>Rata-Rata Kelas:</span>
                                <strong className="text-purple-500">{sec.avg} pt ({sec.avgPct}%)</strong>
                              </div>
                            </div>

                            <div className={`text-[10px] font-bold ${diff >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                              {diff >= 0 ? `▲ +${diff.toFixed(1)} di atas kelas` : `▼ ${Math.abs(diff).toFixed(1)} di bawah kelas (WAJIB DIBEDAH)`}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Evaluasi Tambahan: Kanji, Kotoba, Honyaku di Shiken Akhir */}
                    <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="opacity-70 font-medium">Kanji Shiken Akhir:</span>
                        <strong className="font-mono text-amber-500">{fn?.kanji || 0} / 100 pt</strong>
                      </div>
                      <div className="flex justify-between items-center border-x border-current/10 px-3">
                        <span className="opacity-70 font-medium">Kotoba Shiken Akhir:</span>
                        <strong className="font-mono text-amber-500">{fn?.kotoba || 0} / 100 pt</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="opacity-70 font-medium">Honyaku Shiken Akhir:</span>
                        <strong className="font-mono text-amber-500">{fn?.honyaku || 0} / 100 pt</strong>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* 3 CHECKPOINT EVALUASI BERKALA (BAB 1-6, BAB 7-12, BAB 13-18) */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider opacity-80">
                  Ujian Evaluasi Berkala Per 6 Bab (復習テスト 1, 2, 3)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Checkpoint 1 */}
                  <div className="clay-card p-5 rounded-2xl border border-current/10 space-y-3">
                    <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      Checkpoint 1 (Bab 1–6)
                    </span>
                    <h4 className="font-bold text-sm">復習テスト 1</h4>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between"><span>1. Moji-Goi (48):</span> <span>{student.fukushuu1?.test.mojiGoi || 0}</span></div>
                      <div className="flex justify-between"><span>1. Kaiwa (48):</span> <span>{student.fukushuu1?.test.kaiwa || 0}</span></div>
                      <div className="flex justify-between"><span>1. Choukai (66):</span> <span>{student.fukushuu1?.test.choukai || 0}</span></div>
                      <div className="flex justify-between"><span>1. Dokkai (88):</span> <span>{student.fukushuu1?.test.dokkai || 0}</span></div>
                      <div className="flex justify-between font-bold text-amber-500"><span>Total Shiken:</span> <span>{student.fukushuu1?.test.total || 0} / 250</span></div>
                      <div className="pt-1.5 border-t border-current/10 flex justify-between"><span>2. Kanji:</span> <span>{student.fukushuu1?.kanji || 0}</span></div>
                      <div className="flex justify-between"><span>3. Kotoba:</span> <span>{student.fukushuu1?.kotoba || 0}</span></div>
                      <div className="flex justify-between"><span>4. Honyaku:</span> <span>{student.fukushuu1?.honyaku || 0}</span></div>
                    </div>
                  </div>

                  {/* Checkpoint 2 */}
                  <div className="clay-card p-5 rounded-2xl border border-current/10 space-y-3">
                    <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      Checkpoint 2 (Bab 7–12)
                    </span>
                    <h4 className="font-bold text-sm">復習テスト 2</h4>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between"><span>1. Moji-Goi (48):</span> <span>{student.fukushuu2?.test.mojiGoi || 0}</span></div>
                      <div className="flex justify-between"><span>1. Kaiwa (48):</span> <span>{student.fukushuu2?.test.kaiwa || 0}</span></div>
                      <div className="flex justify-between"><span>1. Choukai (66):</span> <span>{student.fukushuu2?.test.choukai || 0}</span></div>
                      <div className="flex justify-between"><span>1. Dokkai (88):</span> <span>{student.fukushuu2?.test.dokkai || 0}</span></div>
                      <div className="flex justify-between font-bold text-amber-500"><span>Total Shiken:</span> <span>{student.fukushuu2?.test.total || 0} / 250</span></div>
                      <div className="pt-1.5 border-t border-current/10 flex justify-between"><span>2. Kanji:</span> <span>{student.fukushuu2?.kanji || 0}</span></div>
                      <div className="flex justify-between"><span>3. Kotoba:</span> <span>{student.fukushuu2?.kotoba || 0}</span></div>
                      <div className="flex justify-between"><span>4. Honyaku:</span> <span>{student.fukushuu2?.honyaku || 0}</span></div>
                    </div>
                  </div>

                  {/* Checkpoint 3 */}
                  <div className="clay-card p-5 rounded-2xl border border-current/10 space-y-3">
                    <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      Checkpoint 3 (Bab 13–18)
                    </span>
                    <h4 className="font-bold text-sm">復習テスト 3</h4>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between"><span>1. Moji-Goi (48):</span> <span>{student.fukushuu3?.test.mojiGoi || 0}</span></div>
                      <div className="flex justify-between"><span>1. Kaiwa (48):</span> <span>{student.fukushuu3?.test.kaiwa || 0}</span></div>
                      <div className="flex justify-between"><span>1. Choukai (66):</span> <span>{student.fukushuu3?.test.choukai || 0}</span></div>
                      <div className="flex justify-between"><span>1. Dokkai (88):</span> <span>{student.fukushuu3?.test.dokkai || 0}</span></div>
                      <div className="flex justify-between font-bold text-amber-500"><span>Total Shiken:</span> <span>{student.fukushuu3?.test.total || 0} / 250</span></div>
                      <div className="pt-1.5 border-t border-current/10 flex justify-between"><span>2. Kanji:</span> <span>{student.fukushuu3?.kanji || 0}</span></div>
                      <div className="flex justify-between"><span>3. Kotoba:</span> <span>{student.fukushuu3?.kotoba || 0}</span></div>
                      <div className="flex justify-between"><span>4. Honyaku:</span> <span>{student.fukushuu3?.honyaku || 0}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
