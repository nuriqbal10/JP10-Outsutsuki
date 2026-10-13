"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Award,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Printer,
  ChevronDown,
  ChevronUp,
  Volume2,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Check,
  X,
  FileText,
  Clock,
  Layers,
  HelpCircle,
} from "lucide-react";

export interface Question {
  id: number;
  level: string;
  chapter: number;
  section: string;
  questionNumber: number;
  stimulusText: string | null;
  audioR2Url: string | null;
  imageR2Url: string | null;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string | null;
  answerKey: string;
  explanation: string | null;
}

interface ScoreReportProps {
  chapter: number;
  questions: Question[];
  userAnswers: Record<number, string>;
  timeSpentSeconds?: number;
  onRetake: () => void;
}

const SECTION_META: Record<
  string,
  { label: string; nameJa: string; num: number; desc: string }
> = {
  moji_goi: {
    num: 1,
    label: "Moji & Goi",
    nameJa: "文字・語彙",
    desc: "Huruf & Kosakata",
  },
  kaiwa_hyougen: {
    num: 2,
    label: "Kaiwa & Hyougen",
    nameJa: "会話・表現",
    desc: "Percakapan & Tata Bahasa",
  },
  choukai: {
    num: 3,
    label: "Choukai",
    nameJa: "聴解",
    desc: "Mendengarkan Audio",
  },
  dokkai: {
    num: 4,
    label: "Dokkai",
    nameJa: "読解",
    desc: "Pemahaman Membaca",
  },
};

export default function ScoreReport({
  chapter,
  questions,
  userAnswers,
  timeSpentSeconds = 0,
  onRetake,
}: ScoreReportProps) {
  const [filter, setFilter] = useState<string>("all");
  const [savedToDb, setSavedToDb] = useState<boolean>(false);
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);

  // Perhitungan Skor Resmi Standar JFT-Basic A2
  const results = useMemo(() => {
    let totalCorrect = 0;
    const sections = {
      moji_goi: { correct: 0, total: 0 },
      kaiwa_hyougen: { correct: 0, total: 0 },
      choukai: { correct: 0, total: 0 },
      dokkai: { correct: 0, total: 0 },
    };

    questions.forEach((q) => {
      const secKey = q.section as keyof typeof sections;
      if (sections[secKey]) {
        sections[secKey].total++;
      }
      const isCorrect =
        userAnswers[q.id]?.toLowerCase() === q.answerKey.toLowerCase();
      if (isCorrect) {
        totalCorrect++;
        if (sections[secKey]) {
          sections[secKey].correct++;
        }
      }
    });

    const totalQuestions = questions.length || 1;
    const percentage = Math.round((totalCorrect / totalQuestions) * 100);
    // Skala resmi JFT-Basic A2 adalah 250 poin, batas kelulusan 200 poin (80%)
    const scaledScore = Math.round((totalCorrect / totalQuestions) * 250);
    const isPassed = scaledScore >= 200; // atau percentage >= 80

    return {
      totalQuestions,
      totalCorrect,
      totalWrong: questions.length - totalCorrect,
      percentage,
      scaledScore,
      isPassed,
      sections,
    };
  }, [questions, userAnswers]);

  // Simpan otomatis ke Database Neon saat komponen dimuat
  useEffect(() => {
    async function persistResult() {
      try {
        const res = await fetch("/api/exam-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentName: "Peserta CBT Irodori",
            examType: chapter === 0 ? "fukushuu_cbt" : "chapter_cbt",
            chapter,
            totalScore: results.scaledScore,
            maxScore: 250,
            scoreMojiGoi: results.sections.moji_goi.correct,
            scoreKaiwa: results.sections.kaiwa_hyougen.correct,
            scoreChoukai: results.sections.choukai.correct,
            scoreDokkai: results.sections.dokkai.correct,
            isPassed: results.isPassed,
            answersJson: userAnswers,
          }),
        });
        const json = await res.json();
        if (json.success) {
          setSavedToDb(true);
        }
      } catch (err) {
        console.error("Gagal menyimpan hasil ujian:", err);
      }
    }
    persistResult();
  }, [chapter, results, userAnswers]);

  // Filter daftar soal pembahasan
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const isCorrect =
        userAnswers[q.id]?.toLowerCase() === q.answerKey.toLowerCase();
      if (filter === "wrong") return !isCorrect;
      if (filter === "correct") return isCorrect;
      if (filter === "moji_goi") return q.section === "moji_goi";
      if (filter === "kaiwa_hyougen") return q.section === "kaiwa_hyougen";
      if (filter === "choukai") return q.section === "choukai";
      if (filter === "dokkai") return q.section === "dokkai";
      return true;
    });
  }, [questions, userAnswers, filter]);

  // Audio Playback untuk Review
  const playAudio = (url: string) => {
    if (activeAudioUrl === url) {
      setActiveAudioUrl(null);
    } else {
      setActiveAudioUrl(url);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} menit ${secs} detik`;
  };

  return (
    <div className="min-h-screen font-sans text-rose-50 pb-20 selection:bg-amber-400 selection:text-black">
      {/* ========================================================
          1. HEADER ATAS (NAVIGASI & AKSI HASIL)
          ======================================================== */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#25060e]/90 border-b border-rose-950/60 px-4 sm:px-8 py-3.5 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/cbt"
              className="clay-nav-pill px-3 py-1.5 bg-[#420d1a] hover:bg-[#5c1124] text-rose-300 hover:text-white text-xs font-black transition border border-rose-900/40"
            >
              ← Daftar Ujian
            </Link>
            <div className="h-4 w-px bg-rose-900/40 hidden sm:block" />
            <div>
              <h1 className="text-sm font-black text-amber-200">
                判定結果・スコアレポート (Laporan Hasil Ujian)
              </h1>
              <p className="text-[11px] text-rose-300/70">
                {chapter === 0 ? "Fukushuu 1 (Bab 01–06)" : `Irodori A2.2 • 第${chapter}課`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => window.print()}
              className="clay-nav-pill px-3 py-1.5 bg-[#380a15] hover:bg-[#4d0e1e] text-xs font-bold text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition"
              title="Cetak Sertifikat / Lembar Hasil"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cetak Hasil</span>
            </button>

            <button
              onClick={onRetake}
              className="clay-nav-pill px-3 py-1.5 bg-[#380a15] hover:bg-[#4d0e1e] text-xs font-bold text-rose-200 border border-rose-800/40 flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Ulangi Tes</span>
            </button>

            <Link
              href={`/lms/irodori-a2-2/bab/${chapter || 1}`}
              className="clay-btn-gold px-4 py-1.5 rounded-full text-xs font-black shadow-lg flex items-center gap-1 hover:scale-105 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ke Modul LMS</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-8 flex flex-col gap-8">
        {/* ========================================================
            2. HERO SERTIFIKAT HASIL UJIAN (CLAYMORPHISM LUXURY)
            ======================================================== */}
        <section className="clay-card rounded-3xl p-6 sm:p-10 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col gap-6">
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/15 via-rose-600/10 to-transparent blur-3xl rounded-full pointer-events-none" />

          {/* Top Banner Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-950/80 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Standar Resmi JFT-Basic A2 (国際交流基金)
              </span>
              {savedToDb && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  ✓ Tersimpan di Database LMS
                </span>
              )}
            </div>
            <div className="text-[11px] font-bold text-rose-300/60 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Selesai pada: {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>

          {/* Main Verdict & Score Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sisi Kiri: Status Kelulusan (合格 / 不合格) */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex flex-col items-center justify-center p-3 shrink-0 shadow-2xl border-2 transition ${
                  results.isPassed
                    ? "bg-gradient-to-br from-amber-500/30 via-emerald-900/40 to-[#2A0713] border-amber-400/80 shadow-amber-500/20"
                    : "bg-gradient-to-br from-rose-900/40 via-red-950/60 to-[#2A0713] border-rose-500/60 shadow-rose-950"
                }`}
              >
                <Award
                  className={`w-12 h-12 sm:w-14 sm:h-14 mb-1 ${
                    results.isPassed ? "text-amber-400" : "text-rose-400"
                  }`}
                />
                <span
                  className={`text-lg sm:text-xl font-black tracking-widest ${
                    results.isPassed ? "text-amber-200" : "text-rose-200"
                  }`}
                >
                  {results.isPassed ? "合格" : "不合格"}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-rose-300/80">
                  {results.isPassed ? "LULUS" : "TIDAK LULUS"}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span
                    className={`text-2xl sm:text-3xl font-black ${
                      results.isPassed ? "text-amber-300" : "text-rose-200"
                    }`}
                  >
                    {results.isPassed
                      ? "Selamat! Anda Lulus Simulasi A2"
                      : "Perlu Latihan Tambahan"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed max-w-lg">
                  {results.isPassed
                    ? `Perolehan skor Anda memenuhi kriteria kelulusan resmi Japan Foundation Test for Basic Japanese (JFT-Basic) level A2 dan siap untuk visa kerja Tokutei Ginou (特定技能).`
                    : `Skor Anda belum mencapai ambang batas kelulusan 200 poin (80%). Silakan pelajari kembali modul materi kosakata, audio percakapan, dan tata bahasa bab ini.`}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="px-3 py-1 rounded-xl bg-[#1C050E] border border-rose-900/60 text-xs font-bold text-amber-200">
                    Standar CEFR: <strong className="text-amber-400">{results.isPassed ? "A2 (Tercapai)" : "A1 (Perlu Penguatan)"}</strong>
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-[#1C050E] border border-rose-900/60 text-xs font-bold text-rose-300">
                    Passing Grade: <strong className="text-rose-100">200 / 250 (80%)</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Sisi Kanan: Metrik Skor Besar */}
            <div className="lg:col-span-5 flex flex-col gap-3 p-5 rounded-2xl bg-[#1B040D]/90 border border-rose-950/80 shadow-inner">
              <div className="flex items-center justify-between border-b border-rose-950/60 pb-3">
                <span className="text-xs font-bold text-rose-300/70">
                  Skor Resmi JFT-Basic (Skala 250):
                </span>
                <span className="text-3xl sm:text-4xl font-black font-mono text-amber-300 tracking-tight">
                  {results.scaledScore}{" "}
                  <span className="text-xs text-rose-400/70 font-sans font-normal">/ 250</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 text-center">
                <div className="p-2.5 rounded-xl bg-[#280712] border border-rose-900/40">
                  <span className="text-[10px] font-bold text-rose-300/70 block uppercase">
                    Akurasi Jawaban
                  </span>
                  <span className="text-lg font-black text-amber-200 mt-0.5 block">
                    {results.percentage}%
                  </span>
                  <span className="text-[10px] text-rose-400/80">
                    ({results.totalCorrect} dari {results.totalQuestions} Benar)
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-[#280712] border border-rose-900/40">
                  <span className="text-[10px] font-bold text-rose-300/70 block uppercase">
                    Jawaban Salah / Kosong
                  </span>
                  <span className="text-lg font-black text-rose-300 mt-0.5 block">
                    {results.totalWrong}
                  </span>
                  <span className="text-[10px] text-rose-400/80">
                    Soal Perlu Evaluasi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            3. BREAKDOWN SKOR 4 SUB-TES (SEKSI RESMI JFT-BASIC)
            ======================================================== */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-amber-200 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" />
              Rincian Performa 4 Sub-Tes (各セクション得点)
            </h2>
            <span className="text-xs text-rose-300/60">
              Bobot terbagi rata ke 4 seksi ujian
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(SECTION_META).map(([key, meta]) => {
              const sec = results.sections[key as keyof typeof results.sections] || { correct: 0, total: 0 };
              const secTotal = sec.total || 1;
              const secPct = Math.round((sec.correct / secTotal) * 100);
              const secScaled = Math.round((sec.correct / secTotal) * 62.5); // 250 / 4 = 62.5 poin per seksi
              const isGood = secPct >= 80;

              return (
                <div
                  key={key}
                  className="clay-card rounded-2xl p-4 border border-rose-900/50 flex flex-col justify-between gap-3 shadow-lg hover:border-amber-500/40 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-400/80 tracking-wider">
                        Section {meta.num}
                      </span>
                      <h3 className="text-sm font-black text-amber-100">{meta.label}</h3>
                      <p className="text-[10px] text-rose-300/60">{meta.nameJa} • {meta.desc}</p>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        isGood
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/40"
                          : "bg-rose-950/80 text-rose-300 border-rose-800/40"
                      }`}
                    >
                      {secPct}%
                    </span>
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between text-xs font-bold text-rose-200 mb-1.5">
                      <span>Benar: {sec.correct}/{sec.total}</span>
                      <span className="font-mono text-amber-300">{secScaled} / 62.5 pt</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-[#1C050E] overflow-hidden border border-rose-950">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          isGood
                            ? "bg-gradient-to-r from-amber-500 to-emerald-400"
                            : "bg-gradient-to-r from-rose-600 to-amber-500"
                        }`}
                        style={{ width: `${secPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================
            4. EVALUASI & REKOMENDASI BELAJAR (FEEDBACK DIAGNOSTIK)
            ======================================================== */}
        <section className="clay-card rounded-2xl p-6 border border-rose-950/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-black text-amber-200">
                Catatan Evaluasi Guru & Langkah Selanjutnya
              </h3>
              <p className="text-xs text-rose-200/80 leading-relaxed max-w-2xl">
                {results.sections.choukai.correct < results.sections.choukai.total * 0.75
                  ? "Perhatian: Nilai Choukai (Mendengar) Anda masih memerlukan perhatian lebih. Dengarkan kembali audio Kotoba & percakapan Bab ini secara berulang."
                  : results.sections.dokkai.correct < results.sections.dokkai.total * 0.75
                  ? "Perhatian: Nilai Dokkai (Membaca) Anda masih memerlukan pembiasaan wacana praktis, poster, dan email bahasa Jepang."
                  : "Luar biasa! Penguasaan materi Anda di seluruh sub-tes seimbang dan sangat matang untuk menghadapi ujian JFT-Basic resmi."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
            <Link
              href={`/lms/irodori-a2-2/bab/${chapter || 1}`}
              className="clay-btn px-4 py-2 rounded-xl text-xs font-black shadow flex items-center gap-1.5 hover:scale-105 transition"
            >
              <span>Pelajari Ulang Bab {chapter}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* ========================================================
            5. TINJAUAN & PEMBAHASAN SOAL LENGKAP (REVIEW ACCORDION)
            ======================================================== */}
        <section className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-950/80 pb-4">
            <div>
              <h2 className="text-base font-black text-amber-200 flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                Lembar Pembahasan & Jawaban (問題の解説と復習)
              </h2>
              <p className="text-xs text-rose-300/60 mt-0.5">
                Periksa butir soal, pilihan Anda, kunci jawaban yang benar, serta penjelasan maknanya.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
                  filter === "all"
                    ? "bg-amber-400 text-rose-950 border-amber-300 font-black shadow"
                    : "bg-[#25060e] text-rose-300/80 border-rose-900/50 hover:text-white"
                }`}
              >
                Semua ({questions.length})
              </button>
              <button
                onClick={() => setFilter("wrong")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
                  filter === "wrong"
                    ? "bg-rose-700 text-white border-rose-500 font-black shadow"
                    : "bg-[#25060e] text-rose-300/80 border-rose-900/50 hover:text-rose-200"
                }`}
              >
                Salah Saja ({results.totalWrong})
              </button>
              <button
                onClick={() => setFilter("correct")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
                  filter === "correct"
                    ? "bg-emerald-800 text-white border-emerald-500 font-black shadow"
                    : "bg-[#25060e] text-rose-300/80 border-rose-900/50 hover:text-emerald-300"
                }`}
              >
                Benar ({results.totalCorrect})
              </button>
              <button
                onClick={() => setFilter("choukai")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
                  filter === "choukai"
                    ? "bg-amber-400 text-rose-950 border-amber-300 font-black shadow"
                    : "bg-[#25060e] text-rose-300/80 border-rose-900/50 hover:text-white"
                }`}
              >
                Choukai (Audio)
              </button>
              <button
                onClick={() => setFilter("dokkai")}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
                  filter === "dokkai"
                    ? "bg-amber-400 text-rose-950 border-amber-300 font-black shadow"
                    : "bg-[#25060e] text-rose-300/80 border-rose-900/50 hover:text-white"
                }`}
              >
                Dokkai (Wacana)
              </button>
            </div>
          </div>

          {/* List Soal Pembahasan */}
          <div className="flex flex-col gap-5">
            {filteredQuestions.length === 0 ? (
              <div className="clay-card rounded-2xl p-8 text-center text-rose-300/60 font-bold text-xs">
                Tidak ada butir soal dalam filter ini.
              </div>
            ) : (
              filteredQuestions.map((q, idx) => {
                const userChoice = userAnswers[q.id]?.toLowerCase();
                const isCorrect = userChoice === q.answerKey.toLowerCase();
                const secMeta = SECTION_META[q.section] || {
                  num: 0,
                  label: q.section,
                  nameJa: "",
                };

                const optionsList = [
                  { letter: "a", text: q.optionA },
                  { letter: "b", text: q.optionB },
                  { letter: "c", text: q.optionC },
                  ...(q.optionD ? [{ letter: "d", text: q.optionD }] : []),
                ];

                return (
                  <article
                    key={q.id}
                    className={`clay-card rounded-2xl p-5 sm:p-7 border transition flex flex-col gap-4 shadow-lg ${
                      isCorrect
                        ? "border-emerald-500/30 hover:border-emerald-500/60"
                        : "border-rose-700/50 hover:border-rose-600"
                    }`}
                  >
                    {/* Header Item Soal */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-950/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#1C050E] border border-rose-900/60 font-mono font-black text-xs text-amber-300 flex items-center justify-center">
                          {q.questionNumber || idx + 1}
                        </span>
                        <span className="text-xs font-bold text-amber-200/90">
                          Section {secMeta.num}: {secMeta.label}
                        </span>
                      </div>

                      {/* Status Benar / Salah */}
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <span className="px-3 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-black flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            正解 (Jawaban Benar)
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-rose-950/90 border border-rose-600/50 text-rose-300 text-xs font-black flex items-center gap-1.5">
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                            不正解 (Jawaban Salah)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Audio Player Choukai (Bisa didengar ulang sepuasnya untuk belajar) */}
                    {q.audioR2Url && (
                      <div className="p-3.5 rounded-xl bg-[#1C050E] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <Volume2 className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-bold text-amber-200">
                            Audio Menyimak (聴解音声):
                          </span>
                        </div>
                        <audio
                          controls
                          src={q.audioR2Url}
                          className="w-full sm:w-80 h-9 rounded-lg"
                        />
                      </div>
                    )}

                    {/* Gambar Ilustrasi / Denah Dokkai */}
                    {q.imageR2Url && (
                      <div className="flex justify-center p-3 rounded-xl bg-[#15030A] border border-rose-950/60">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={q.imageR2Url}
                          alt="Ilustrasi Soal"
                          className="max-h-60 rounded-lg object-contain shadow-md"
                        />
                      </div>
                    )}

                    {/* Wacana Stimulus / Dialog */}
                    {q.stimulusText && (
                      <div className="p-4 rounded-xl bg-[#1C050E]/80 border border-rose-900/40 text-xs text-rose-100 font-medium whitespace-pre-line leading-relaxed">
                        {q.stimulusText}
                      </div>
                    )}

                    {/* Teks Pertanyaan */}
                    <div className="text-sm font-bold text-amber-100 whitespace-pre-line leading-relaxed">
                      {q.questionText}
                    </div>

                    {/* Pilihan Opsi Jawaban */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {optionsList.map((opt) => {
                        const isThisUserChoice = userChoice === opt.letter;
                        const isThisKey = q.answerKey.toLowerCase() === opt.letter;

                        let style = "bg-[#1F060F] border-rose-950 text-rose-200/80";
                        if (isThisKey) {
                          // Kunci jawaban benar (Hijau zamrud / Emas)
                          style = "bg-emerald-950/70 border-emerald-500/60 text-emerald-200 font-bold shadow-md ring-1 ring-emerald-500/30";
                        } else if (isThisUserChoice && !isCorrect) {
                          // Pilihan salah siswa (Merah)
                          style = "bg-rose-950/70 border-rose-700 text-rose-200 line-through";
                        }

                        return (
                          <div
                            key={opt.letter}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition ${style}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-5 h-5 rounded-md bg-black/40 font-mono font-black text-[11px] uppercase flex items-center justify-center shrink-0">
                                {opt.letter}
                              </span>
                              <span>{opt.text}</span>
                            </div>

                            <div className="shrink-0 flex items-center gap-1 text-[11px] font-bold">
                              {isThisKey && (
                                <span className="text-emerald-400 flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> Kunci
                                </span>
                              )}
                              {isThisUserChoice && !isThisKey && (
                                <span className="text-rose-400 flex items-center gap-1">
                                  <X className="w-3.5 h-3.5" /> Pilihan Anda
                                </span>
                              )}
                              {isThisUserChoice && isThisKey && (
                                <span className="text-emerald-400 text-[10px]">
                                  (Pilihan Anda)
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Kotak Pembahasan & Terjemahan (解説) */}
                    {q.explanation && (
                      <div className="mt-2 p-4 rounded-xl bg-gradient-to-r from-[#280712] to-[#1C050E] border border-amber-500/30 flex flex-col gap-1.5">
                        <span className="text-[11px] font-black uppercase text-amber-300 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                          Penjelasan & Pembahasan (解説):
                        </span>
                        <p className="text-xs text-rose-100 font-medium whitespace-pre-line leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
        </section>

        {/* ========================================================
            6. FOOTER AKSI
            ======================================================== */}
        <div className="clay-card rounded-2xl p-6 border border-rose-950/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-rose-300/80">
            Ingin mengulang simulasi ini untuk meningkatkan skor?
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onRetake}
              className="clay-nav-pill px-5 py-2.5 bg-[#380a15] hover:bg-[#4d0e1e] text-xs font-bold text-rose-200 border border-rose-800/40 flex items-center gap-2 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>Ulangi Simulasi CBT</span>
            </button>
            <Link
              href={`/lms/irodori-a2-2/bab/${chapter || 1}`}
              className="clay-btn-gold px-6 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 hover:scale-105 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kembali ke Modul LMS</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
