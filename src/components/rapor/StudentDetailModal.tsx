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
  levelTitle: string;
  onClose: () => void;
}

export default function StudentDetailModal({
  student,
  classPilarAvg,
  levelTitle,
  onClose,
}: StudentDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "chapters" | "exams">("overview");

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
                <span className="text-xs font-mono opacity-70">
                  Absen #{student.no} • {levelTitle}
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
              <h4 className="text-xs font-black uppercase tracking-wider opacity-80">
                Nilai Harian Bab 1 s.d. 18 (Dai-Test & Tugas)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-current/15 opacity-70 text-[10.5px] uppercase">
                      <th className="py-2.5 px-3">Bab</th>
                      <th className="py-2.5 px-3 text-center">文字・語彙 (24)</th>
                      <th className="py-2.5 px-3 text-center">会話 (24)</th>
                      <th className="py-2.5 px-3 text-center">聴解 (24)</th>
                      <th className="py-2.5 px-3 text-center">読解 (28)</th>
                      <th className="py-2.5 px-3 text-center font-bold">Dai-Test (100)</th>
                      <th className="py-2.5 px-3 text-center">漢字</th>
                      <th className="py-2.5 px-3 text-center">言葉</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.harian.map((h) => {
                      const dt = h.daiTesuto || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
                      return (
                        <tr key={h.chapter} className="border-b border-current/10 hover:bg-black/5 dark:hover:bg-white/5 transition font-mono">
                          <td className="py-2.5 px-3 font-sans font-bold text-amber-500">
                            第{h.chapter}課
                          </td>
                          <td className="py-2.5 px-3 text-center">{dt.mojiGoi}</td>
                          <td className="py-2.5 px-3 text-center">{dt.kaiwa}</td>
                          <td className="py-2.5 px-3 text-center">{dt.choukai}</td>
                          <td className="py-2.5 px-3 text-center">{dt.dokkai}</td>
                          <td className="py-2.5 px-3 text-center font-black text-amber-500">
                            {dt.total > 0 ? dt.total : "-"}
                          </td>
                          <td className="py-2.5 px-3 text-center">{h.kanji > 0 ? h.kanji : "-"}</td>
                          <td className="py-2.5 px-3 text-center">{h.kotoba > 0 ? h.kotoba : "-"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "exams" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="clay-card p-5 rounded-2xl border border-current/10 space-y-3">
                <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Ujian 1 (Bab 1–6)
                </span>
                <h4 className="font-bold text-sm">復習テスト 1</h4>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between"><span>Moji-Goi (48):</span> <span>{student.fukushuu1?.test.mojiGoi || 0}</span></div>
                  <div className="flex justify-between"><span>Kaiwa (48):</span> <span>{student.fukushuu1?.test.kaiwa || 0}</span></div>
                  <div className="flex justify-between"><span>Choukai (66):</span> <span>{student.fukushuu1?.test.choukai || 0}</span></div>
                  <div className="flex justify-between"><span>Dokkai (88):</span> <span>{student.fukushuu1?.test.dokkai || 0}</span></div>
                  <div className="pt-2 border-t border-current/10 flex justify-between font-black text-amber-500 text-sm">
                    <span>Total (250):</span> <span>{student.fukushuu1?.test.total || 0}</span>
                  </div>
                </div>
              </div>

              <div className="clay-card p-5 rounded-2xl border border-current/10 space-y-3">
                <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Ujian 2 (Bab 7–12)
                </span>
                <h4 className="font-bold text-sm">復習テスト 2</h4>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between"><span>Moji-Goi (48):</span> <span>{student.fukushuu2?.test.mojiGoi || 0}</span></div>
                  <div className="flex justify-between"><span>Kaiwa (48):</span> <span>{student.fukushuu2?.test.kaiwa || 0}</span></div>
                  <div className="flex justify-between"><span>Choukai (66):</span> <span>{student.fukushuu2?.test.choukai || 0}</span></div>
                  <div className="flex justify-between"><span>Dokkai (88):</span> <span>{student.fukushuu2?.test.dokkai || 0}</span></div>
                  <div className="pt-2 border-t border-current/10 flex justify-between font-black text-amber-500 text-sm">
                    <span>Total (250):</span> <span>{student.fukushuu2?.test.total || 0}</span>
                  </div>
                </div>
              </div>

              <div className="clay-card p-5 rounded-2xl border border-current/10 space-y-3">
                <span className="text-[10px] font-black uppercase text-amber-500 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Ujian 3 (Bab 13–18)
                </span>
                <h4 className="font-bold text-sm">復習テスト 3</h4>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between"><span>Moji-Goi (48):</span> <span>{student.fukushuu3?.test.mojiGoi || 0}</span></div>
                  <div className="flex justify-between"><span>Kaiwa (48):</span> <span>{student.fukushuu3?.test.kaiwa || 0}</span></div>
                  <div className="flex justify-between"><span>Choukai (66):</span> <span>{student.fukushuu3?.test.choukai || 0}</span></div>
                  <div className="flex justify-between"><span>Dokkai (88):</span> <span>{student.fukushuu3?.test.dokkai || 0}</span></div>
                  <div className="pt-2 border-t border-current/10 flex justify-between font-black text-amber-500 text-sm">
                    <span>Total (250):</span> <span>{student.fukushuu3?.test.total || 0}</span>
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
