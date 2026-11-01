"use client";

import React, { useState, useMemo } from "react";
import {
  Heart,
  Search,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  Phone,
  MessageCircle,
  Printer,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Info,
} from "lucide-react";
import { StudentRaporItem, LevelRaporData } from "@/types/rapor";

interface ParentPortalViewProps {
  students: StudentRaporItem[];
  levelData: LevelRaporData | null;
  kkm: number;
  onOpenPrintModal: (student: StudentRaporItem) => void;
  onOpenDetailModal: (student: StudentRaporItem) => void;
}

export default function ParentPortalView({
  students,
  levelData,
  kkm,
  onOpenPrintModal,
  onOpenDetailModal,
}: ParentPortalViewProps) {
  const [searchNim, setSearchNim] = useState("");
  const [selectedStudentNo, setSelectedStudentNo] = useState<number>(students[0]?.no || 1);

  // Cari siswa berdasarkan pencarian NIM atau Nama
  const activeStudent = useMemo(() => {
    if (searchNim.trim()) {
      const q = searchNim.toLowerCase();
      const found = students.find(
        (s) =>
          (s.nim && s.nim.toLowerCase().includes(q)) ||
          s.name.toLowerCase().includes(q) ||
          String(s.no) === q
      );
      if (found) return found;
    }
    return students.find((s) => s.no === selectedStudentNo) || students[0];
  }, [students, searchNim, selectedStudentNo]);

  if (!activeStudent) return null;

  // Hitung Nilai Komulatif & Data 4 Seksi Siswa
  const score = activeStudent.compositeScore ?? activeStudent.summary?.compositeScore ?? 0;
  const isPassed = score >= kkm;
  const isWarning = score >= Math.max(40, kkm - 15) && score < kkm;

  // Analisis 4 Aspek dalam Bahasa Ramah Orang Tua
  const avgMoji = activeStudent.averages?.mojiGoi || 0;
  const avgKaiwa = activeStudent.averages?.kaiwa || 0;
  const avgChoukai = activeStudent.averages?.choukai || 0;
  const avgDokkai = activeStudent.averages?.dokkai || 0;
  const avgKanji = activeStudent.averages?.kanji || 0;

  // Deteksi Kelebihan & Area Pendampingan Anak
  const pctM = Math.round((avgMoji / 24) * 100);
  const pctK = Math.round((avgKaiwa / 24) * 100);
  const pctC = Math.round((avgChoukai / 24) * 100);
  const pctD = Math.round((avgDokkai / 28) * 100);

  const aspects = [
    {
      name: "Percakapan & Ungkapan (会話・Kaiwa)",
      desc: "Kemampuan berbicara dan merespons situasi kerja di Jepang",
      pct: pctK,
      raw: `${avgKaiwa} / 24 pt`,
    },
    {
      name: "Pendengaran (聴解・Choukai)",
      desc: "Kemampuan menyimak instruksi atasan dan pengumuman audio",
      pct: pctC,
      raw: `${avgChoukai} / 24 pt`,
    },
    {
      name: "Membaca Teks & Instruksi (読解・Dokkai)",
      desc: "Kemampuan membaca poster SOP, formulir kerja, dan rambu-rambu",
      pct: pctD,
      raw: `${avgDokkai} / 28 pt`,
    },
    {
      name: "Kosakata Kerja (文字・語彙・Moji-Goi)",
      desc: "Perbendaharaan kata kunci sehari-hari dan di tempat kerja",
      pct: pctM,
      raw: `${avgMoji} / 24 pt`,
    },
  ];

  const highestAspect = [...aspects].sort((a, b) => b.pct - a.pct)[0];
  const lowestAspect = [...aspects].sort((a, b) => a.pct - b.pct)[0];

  return (
    <div className="space-y-6">
      {/* ========================================================
          1. HEADER SAMBUTAN WALI MURID (WARM & WELCOMING)
          ======================================================== */}
      <section className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 shadow-xl bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-transparent space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-current/10 pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white shadow-sm flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-current" /> PORTAL RESMI WALI MURID
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/5 dark:bg-white/10 opacity-80 border border-current/10">
                Lembaga Pelatihan Bahasa Jepang Klan Outsutsuki
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-[var(--text-heading)]">
              Laporan Perkembangan Belajar Putra/Putri Tercinta
            </h2>
            <p className="text-xs sm:text-sm opacity-80 leading-relaxed text-[var(--text-body)]">
              Selamat datang Bapak/Ibu Wali Murid. Platform ini dirancang khusus agar keluarga di rumah dapat memantau dengan jelas kemajuan belajar, kedisiplinan, serta kesiapan ujian kerja JFT-Basic A2 ananda menuju Jepang.
            </p>
          </div>

          {/* Quick Search via NIM atau Nama */}
          <div className="clay-card-compact p-4 rounded-2xl border border-current/10 max-w-sm w-full space-y-2 shrink-0">
            <span className="text-[11px] font-extrabold opacity-70 block">
              Cari Berdasarkan NIM / Nama Anak:
            </span>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="Masukkan NIM (cth: 2026-A22-005)..."
                value={searchNim}
                onChange={(e) => setSearchNim(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-stone-900 border border-current/20 text-xs font-bold outline-none focus:border-amber-500 transition"
              />
            </div>
            <div className="flex items-center justify-between pt-1 text-[10px] opacity-60">
              <span>Atau pilih nama:</span>
              <select
                value={activeStudent.no}
                onChange={(e) => {
                  setSelectedStudentNo(Number(e.target.value));
                  setSearchNim("");
                }}
                className="bg-transparent font-bold text-amber-600 dark:text-amber-400 cursor-pointer outline-none"
              >
                {students.map((st) => (
                  <option key={st.no} value={st.no} className="bg-stone-900 text-white">
                    {st.name} (#{st.rank || st.no})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. KARTU IDENTITAS & PRESTASI ANAK
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch pt-2">
          {/* Profil Singkat Anak */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 text-center flex flex-col items-center justify-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 font-black text-xl flex items-center justify-center shadow-md border-2 border-amber-400">
              {activeStudent.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--text-heading)]">
                {activeStudent.name}
              </h3>
              <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                NIM: {activeStudent.nim || `#${activeStudent.no}`}
              </p>
              <p className="text-xs opacity-70">
                Peringkat #{activeStudent.rank || activeStudent.no} dari 28 Siswa
              </p>
            </div>

            <div className="pt-2 w-full flex items-center justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                activeStudent.grade === "A"
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : activeStudent.grade === "B"
                  ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
              }`}>
                Predikat: Grade {activeStudent.grade}
              </span>
            </div>

            <button
              onClick={() => onOpenPrintModal(activeStudent)}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-amber-400 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Cetak Lembar Rapor A4 Resmi
            </button>
          </div>

          {/* Rangkuman Nilai & Status Kelulusan untuk Keluarga */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                  Rata-Rata Nilai Akumulatif Ananda
                </span>
                <span className="text-xs font-mono opacity-70">
                  Standar Kelulusan Minimum (KKM): {kkm} pt
                </span>
              </div>
              <div className="my-2 flex items-baseline gap-2">
                <span className={`text-4xl font-black ${
                  isPassed ? "text-emerald-500" : isWarning ? "text-amber-500" : "text-rose-500"
                }`}>
                  {score}
                </span>
                <span className="text-sm opacity-60 font-mono">/ 100 Poin</span>
              </div>

              {/* Status Kelulusan dalam Bahasa Santun */}
              <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                isPassed
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                  : isWarning
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
                  : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
              }`}>
                {isPassed ? (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                ) : isWarning ? (
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div className="text-xs leading-relaxed">
                  <strong className="block text-sm font-extrabold">
                    {isPassed
                      ? "Prestasi Sangat Baik — Siap Mengikuti Ujian Sertifikasi Jepang!"
                      : isWarning
                      ? "Progres Cukup Baik — Perlu Sedikit Pemantapan Menjelang Ujian"
                      : "Memerlukan Bimbingan Ekstra & Dukungan Penuh dari Rumah"}
                  </strong>
                  <p className="opacity-85 mt-0.5">
                    {isPassed
                      ? `Ananda telah melampaui batas standar kelulusan KKM (${kkm} pt). Penguasaan kosakata dan percakapan sangat stabil.`
                      : isWarning
                      ? `Nilai ananda mendekati standar KKM (${kkm} pt). Sedikit penguatan pada latihan membaca teks akan mengunci kelulusan ananda.`
                      : `Ananda masih membutuhkan waktu pendampingan tambahan. Guru di asrama sedang memberikan bimbingan intensif agar ananda dapat mengejar target ketuntasan.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Catatan Shihan untuk Orang Tua */}
            <div className="p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                Pesan Khusus Pengajar (Shihan / イクバル先生) untuk Bapak/Ibu:
              </span>
              <p className="text-xs opacity-85 italic leading-relaxed">
                &quot;{activeStudent.senseiNote || "Ananda menunjukkan semangat juang dan sopan santun yang terpuji di kelas. Mohon doa restu dan dukungan Bapak/Ibu di rumah agar ananda tetap disiplin dan percaya diri meraih cita-cita bekerja di Jepang."}&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. PENJELASAN 4 KEMAMPUAN UTAMA (BAHASA AWAM & RAMAH)
          ======================================================== */}
      <section className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-current/10 pb-4">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight font-serif flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              Rincian Penguasaan 4 Aspek Kemampuan Ananda
            </h3>
            <p className="text-xs opacity-75 mt-0.5">
              Penjelasan sederhana mengenai apa saja yang dipelajari ananda dalam kurikulum bahasa Jepang Irodori
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-current/10 self-start sm:self-auto">
            Evaluasi Resmi Bab 1–11
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aspects.map((asp, idx) => {
            const isStrength = asp.name === highestAspect.name;
            const isNeedCare = asp.name === lowestAspect.name && asp.pct < kkm;
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border space-y-2.5 transition ${
                  isStrength
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : isNeedCare
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-black/5 dark:bg-white/5 border-current/10"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                      {asp.name}
                      {isStrength && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          ★ Terkuat
                        </span>
                      )}
                      {isNeedCare && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                          Perlu Didukung
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] opacity-75 mt-0.5">{asp.desc}</p>
                  </div>
                  <span className="font-mono font-black text-sm text-amber-600 dark:text-amber-400">
                    {asp.pct}%
                  </span>
                </div>

                <div className="w-full bg-black/10 dark:bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      asp.pct >= kkm ? "bg-emerald-500" : asp.pct >= 60 ? "bg-amber-500" : "bg-rose-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(8, asp.pct))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] opacity-70 pt-1 border-t border-current/5">
                  <span>Skor Harian: <strong>{asp.raw}</strong></span>
                  <span>Target KKM: {kkm}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips Dukungan Orang Tua di Rumah */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <span className="font-extrabold text-amber-700 dark:text-amber-300 block">
              💡 Panduan Sederhana Dukungan Orang Tua dari Rumah:
            </span>
            <p className="opacity-80 leading-relaxed">
              1. Berikan kata-kata motivasi dan apresiasi saat menelepon ananda, hindari membandingkan nilai dengan teman sekelas.<br />
              2. Ingatkan ananda untuk menjaga pola istirahat dan kesehatan agar daya ingat otak tetap prima saat belajar kanji.<br />
              3. Apabila ada kendala atau ananda merasa cemas menghadapi ujian, Bapak/Ibu dapat menghubungi pihak sekolah untuk koordinasi pendampingan konseling.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
