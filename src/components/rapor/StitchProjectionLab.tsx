"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  TrendingUp,
  Target,
  User,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  BarChart2,
  Layers,
  Award,
  Zap,
  BookOpen,
  ShieldCheck,
  FileText,
  Users,
  Compass,
  HeartHandshake,
  GraduationCap,
  Building2,
  RefreshCw,
  Search,
} from "lucide-react";
import { StudentRaporItem, MasterRaporData } from "@/types/rapor";
import masterRaporDataRaw from "@/data/raporMasterData.json";

const masterRapor = masterRaporDataRaw as unknown as MasterRaporData;

interface StitchProjectionLabProps {
  students: StudentRaporItem[];
  kkm: number;
  onSelectStudentPrint?: (student: StudentRaporItem) => void;
  onSelectStudentDetail?: (student: StudentRaporItem) => void;
}

export type HabitType =
  | "high_consistent"
  | "upward_momentum"
  | "stable_medium"
  | "choukai_reliant"
  | "dokkai_vulnerable"
  | "needs_intervention";

interface LevelProjectionItem {
  student: StudentRaporItem;
  habit: {
    type: HabitType;
    label: string;
    description: string;
    badgeColor: string;
    icon: string;
  };
  // 6-Chapter Group Averages & 250 pt Review Formula: 250 * (avg / 100)
  avgBab1to6: number;
  projReview1: number;
  avgBab7to12: number;
  projReview2: number;
  avgBab13to18: number;
  projReview3: number;
  overall18Avg: number;
  projFinalExam: number;
  passPrometric: boolean;
  isCaution: boolean;
  chapterCurve: {
    chapter: number;
    score: number;
    isProjected: boolean;
  }[];
  // Analisis Kelebihan & Kekurangan
  strengths: string[];
  vulnerabilities: string[];
  // Rekomendasi Mitigasi 4 Pilar
  mitigations: {
    teacher: string;
    student: string;
    principal: string;
    parent: string;
  };
}

export default function StitchProjectionLab({
  students: currentStudents,
  kkm,
  onSelectStudentPrint,
  onSelectStudentDetail,
}: StitchProjectionLabProps) {
  // Level State: A1, A21, A22, atau trajectory
  const [activeLevel, setActiveLevel] = useState<"A22" | "A21" | "A1" | "trajectory">("A22");
  const [selectedStudentNo, setSelectedStudentNo] = useState<number>(currentStudents[0]?.no || 1);
  const [interventionDelta, setInterventionDelta] = useState<number>(0); // -10 to +15 pts
  const [activeViewMode, setActiveViewMode] = useState<"overview" | "students" | "mitigation" | "whatif">("overview");
  const [searchStudentQuery, setSearchStudentQuery] = useState("");

  // Ambil list siswa berdasarkan level yang dipilih
  const levelStudents = useMemo(() => {
    if (activeLevel === "A1") return masterRapor.levels.A1?.students || currentStudents;
    if (activeLevel === "A21") return masterRapor.levels.A21?.students || currentStudents;
    return masterRapor.levels.A22?.students || currentStudents;
  }, [activeLevel, currentStudents]);

  // Model Proyeksi & Profil Kebiasaan Siswa
  const projections: LevelProjectionItem[] = useMemo(() => {
    return levelStudents.map((st) => {
      const realScores: number[] = [];
      const realDokkaiPct: number[] = [];
      const realChoukaiPct: number[] = [];
      const realMojiPct: number[] = [];
      const realKaiwaPct: number[] = [];

      const maxChapters = 18;
      // Di A2.2 bab riil adalah bab 1-11; di A1 & A21 bab riil adalah seluruh bab yang terisi
      const realChapterCutoff = activeLevel === "A22" ? 11 : 18;

      for (let i = 0; i < maxChapters; i++) {
        const h = st.harian?.[i];
        const dt = h?.daiTesuto || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
        const tot = dt.total > 0 ? dt.total : (i < realChapterCutoff ? 55 : 0);
        
        if (i < realChapterCutoff) {
          realScores.push(tot);
          if (dt.total > 0) {
            realDokkaiPct.push((dt.dokkai / 28) * 100);
            realChoukaiPct.push((dt.choukai / 24) * 100);
            realMojiPct.push((dt.mojiGoi / 24) * 100);
            realKaiwaPct.push((dt.kaiwa / 24) * 100);
          }
        }
      }

      // 1. Group 1: Bab 1-6
      const b1to6 = realScores.slice(0, 6);
      const avgBab1to6 = b1to6.length > 0
        ? Math.round((b1to6.reduce((a, b) => a + b, 0) / b1to6.length) * 10) / 10
        : 65;
      const projReview1 = Math.round((250 * (avgBab1to6 / 100)) * 10) / 10;

      // 2. Group 2: Bab 7-12
      let avgBab7to12 = 0;
      let projBab12 = 0;

      if (activeLevel === "A22") {
        const b7to11 = realScores.slice(6, 11);
        const avgB7to11 = b7to11.length > 0
          ? b7to11.reduce((a, b) => a + b, 0) / b7to11.length
          : avgBab1to6;
        const momentum = (avgB7to11 - avgBab1to6) / 5;
        projBab12 = Math.min(98, Math.max(35, Math.round(avgB7to11 + momentum + interventionDelta)));
        avgBab7to12 = Math.round(((avgB7to11 * 5 + projBab12) / 6) * 10) / 10;
      } else {
        const b7to12 = realScores.slice(6, 12);
        avgBab7to12 = b7to12.length > 0
          ? Math.round((b7to12.reduce((a, b) => a + b, 0) / b7to12.length) * 10) / 10
          : avgBab1to6;
      }
      const projReview2 = Math.round((250 * (avgBab7to12 / 100)) * 10) / 10;

      // 3. Group 3: Bab 13-18
      let avgBab13to18 = 0;
      const projectedBab13to18: number[] = [];

      if (activeLevel === "A22") {
        let running = avgBab7to12;
        const momentum = (avgBab7to12 - avgBab1to6) / 6;
        for (let ch = 13; ch <= 18; ch++) {
          const slightFluctuation = ((st.no * 7 + ch * 11) % 9) - 4;
          const projectedVal = Math.min(
            98,
            Math.max(35, Math.round(running + momentum * 0.4 + slightFluctuation + interventionDelta))
          );
          projectedBab13to18.push(projectedVal);
          running = projectedVal;
        }
        avgBab13to18 = Math.round((projectedBab13to18.reduce((a, b) => a + b, 0) / 6) * 10) / 10;
      } else {
        const b13to18 = realScores.slice(12, 18);
        avgBab13to18 = b13to18.length > 0
          ? Math.round((b13to18.reduce((a, b) => a + b, 0) / b13to18.length) * 10) / 10
          : avgBab7to12;
      }
      const projReview3 = Math.round((250 * (avgBab13to18 / 100)) * 10) / 10;

      // 4. Overall 18 Chapters & Final Exam Projection
      let all18Scores: number[] = [];
      if (activeLevel === "A22") {
        all18Scores = [...realScores.slice(0, 11), projBab12, ...projectedBab13to18];
      } else {
        all18Scores = realScores.slice(0, 18);
        while (all18Scores.length < 18) all18Scores.push(avgBab7to12);
      }

      const overall18Avg = Math.round((all18Scores.reduce((a, b) => a + b, 0) / 18) * 10) / 10;
      const projFinalExam = Math.round((250 * (overall18Avg / 100)) * 10) / 10;

      // Deteksi Profil Kebiasaan Belajar (Habit Persona)
      const avgDokkai = realDokkaiPct.length > 0 ? realDokkaiPct.reduce((a, b) => a + b, 0) / realDokkaiPct.length : 60;
      const avgChoukai = realChoukaiPct.length > 0 ? realChoukaiPct.reduce((a, b) => a + b, 0) / realChoukaiPct.length : 60;
      const avgMoji = realMojiPct.length > 0 ? realMojiPct.reduce((a, b) => a + b, 0) / realMojiPct.length : 60;
      const avgKaiwa = realKaiwaPct.length > 0 ? realKaiwaPct.reduce((a, b) => a + b, 0) / realKaiwaPct.length : 60;

      let habit: LevelProjectionItem["habit"] = {
        type: "stable_medium",
        label: "Konsisten Stabil (中堅安定型)",
        description: "Ritme belajar konstan, membutuhkan dorongan ekstra untuk menembus ambang 200 pt.",
        badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/30",
        icon: "⚖️",
      };

      if (overall18Avg >= 80) {
        habit = {
          type: "high_consistent",
          label: "Juara Unggul Konsisten (優秀持続型)",
          description: "Penguasaan 4 aspek sangat solid, diproyeksikan lulus ujian CBT Prometric dengan skor meyakinkan.",
          badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
          icon: "👑",
        };
      } else if (avgBab7to12 > avgBab1to6 + 4) {
        habit = {
          type: "upward_momentum",
          label: "Akselerasi Cepat (急伸型)",
          description: "Tren nilai bab menengah melesat naik tajam. Potensi besar lulus jika konsistensi dipertahankan.",
          badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
          icon: "🚀",
        };
      } else if (avgDokkai < 55 && avgChoukai >= 65) {
        habit = {
          type: "dokkai_vulnerable",
          label: "Rentan di Dokkai (読解弱点型)",
          description: "Listening dan percakapan baik, namun sering kehabisan waktu pada teks bacaan panjang.",
          badgeColor: "bg-rose-500/10 text-rose-500 border-rose-500/30",
          icon: "📖",
        };
      } else if (avgChoukai > avgDokkai + 15) {
        habit = {
          type: "choukai_reliant",
          label: "Spesialis Audio (聴解得意型)",
          description: "Sangat mengandalkan nilai Choukai untuk mendongkrak total skor komulatif.",
          badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
          icon: "🎧",
        };
      } else if (overall18Avg < 60) {
        habit = {
          type: "needs_intervention",
          label: "Wajib Bimbingan Sore (要集中指導型)",
          description: "Berada dalam zona risiko tidak lulus Prometric (<170 pt). Memerlukan drill intensif.",
          badgeColor: "bg-rose-600/15 text-rose-600 border-rose-600/40",
          icon: "⚠️",
        };
      }

      // Analisis Kelebihan & Kekurangan Nyata
      const strengths: string[] = [];
      const vulnerabilities: string[] = [];

      if (avgChoukai >= 70) strengths.push(`Kecepatan respons audio Choukai (${Math.round(avgChoukai)}%) sangat andal`);
      if (avgMoji >= 75) strengths.push(`Penguasaan kosakata kerja & kata benda harian (${Math.round(avgMoji)}%) kuat`);
      if (avgKaiwa >= 70) strengths.push(`Refleks percakapan & tata bahasa kalimat (${Math.round(avgKaiwa)}%) lancar`);
      if (avgBab7to12 >= avgBab1to6) strengths.push(`Daya tahan adaptasi belajar meningkat (+${Math.round(avgBab7to12 - avgBab1to6)} pt di bab tengah)`);
      if (strengths.length === 0) strengths.push("Disiplin kehadiran ujian harian sangat terpelihara dengan baik");

      if (avgDokkai < 65) vulnerabilities.push(`Kecepatan scanning teks Dokkai (${Math.round(avgDokkai)}%) perlu dipercepat`);
      if (avgMoji < 65) vulnerabilities.push(`Retensi hafalan kanji kerja & sinonim kata kerja (${Math.round(avgMoji)}%) rawan tertukar`);
      if (avgKaiwa < 60) vulnerabilities.push(`Konjugasi bentuk Te/Nai/Ta masih memerlukan ketelitian`);
      if (projFinalExam < 200) vulnerabilities.push(`Proyeksi Ujian Akhir (${projFinalExam} pt) masih di bawah batas lulus JFT (200 pt)`);
      if (vulnerabilities.length === 0) vulnerabilities.push("Perlu menjaga stabilitas stamina saat menghadapi ujian maraton 60 menit");

      // Rencana Mitigasi 4 Pilar
      const mitigations = {
        teacher: projFinalExam >= 200
          ? "Berikan soal pengayaan tingkat lanjut dan latih strategi eliminasi cepat untuk mengunci skor sempurna 230+."
          : `Alokasikan klinik sore 3x sepekan, fokus bedah naskah Dokkai bab 7–12 dan latihan time-attack 3 menit/soal.`,
        student: projFinalExam >= 200
          ? "Pertahankan rutinitas shadowing audio 15 menit setiap pagi dan bantu teman sekelas dalam kelompok belajar."
          : `Wajibkan diri menyelesaikan latihan mandiri 20 menit per hari, serta membuat flashcard kanji yang sering salah.`,
        principal: projFinalExam >= 200
          ? "Nominasikan siswa untuk percepatan wawancara kerja mitra Jepang dan pemantauan dokumen paspor."
          : "Fasilitasi tryout CBT tambahan di lab komputer serta monitor presensi klinik bimbingan sore guru.",
        parent: projFinalExam >= 200
          ? "Berikan apresiasi atas kedisiplinan belajar dan dukung kesehatan fisik menjelang ujian resmi."
          : "Bantu memantau jam tidur anak agar tidak bergadang dan berikan dorongan semangat tanpa tekanan berlebih.",
      };

      // 18-Chapter Curve
      const chapterCurve = all18Scores.map((sc, idx) => ({
        chapter: idx + 1,
        score: sc,
        isProjected: activeLevel === "A22" ? idx >= 11 : false,
      }));

      return {
        student: st,
        habit,
        avgBab1to6,
        projReview1,
        avgBab7to12,
        projReview2,
        avgBab13to18,
        projReview3,
        overall18Avg,
        projFinalExam,
        passPrometric: projFinalExam >= 200,
        isCaution: projFinalExam >= 170 && projFinalExam < 200,
        chapterCurve,
        strengths,
        vulnerabilities,
        mitigations,
      };
    });
  }, [levelStudents, activeLevel, interventionDelta]);

  // Selected Student Profile
  const selectedProfile = useMemo(() => {
    return projections.find((p) => p.student.no === selectedStudentNo) || projections[0];
  }, [projections, selectedStudentNo]);

  // Class Aggregates
  const classAverages = useMemo(() => {
    const total = projections.length || 28;
    const avgR1 = Math.round((projections.reduce((a, b) => a + b.projReview1, 0) / total) * 10) / 10;
    const avgR2 = Math.round((projections.reduce((a, b) => a + b.projReview2, 0) / total) * 10) / 10;
    const avgR3 = Math.round((projections.reduce((a, b) => a + b.projReview3, 0) / total) * 10) / 10;
    const avgFinal = Math.round((projections.reduce((a, b) => a + b.projFinalExam, 0) / total) * 10) / 10;

    const passCount = projections.filter((p) => p.passPrometric).length;
    const cautionCount = projections.filter((p) => p.isCaution).length;
    const remedialCount = projections.filter((p) => !p.passPrometric && !p.isCaution).length;
    const passRate = Math.round((passCount / total) * 100);

    return {
      avgR1,
      avgR2,
      avgR3,
      avgFinal,
      passCount,
      cautionCount,
      remedialCount,
      passRate,
      total,
    };
  }, [projections]);

  // SVG Chart Geometry ala Google Stitch
  const chartHeight = 240;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;
  const usableWidth = 840 - paddingLeft - paddingRight;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  const getX = (ch: number) => paddingLeft + ((ch - 1) / 17) * usableWidth;
  const getY = (val: number) => paddingTop + usableHeight - (Math.max(0, Math.min(100, val)) / 100) * usableHeight;

  // Real vs Projected Division Line at Chapter 11.5
  const boundaryX = (getX(11) + getX(12)) / 2;

  // Polyline coordinates for Selected Student
  const studentPts = selectedProfile?.chapterCurve.map((pt) => ({
    x: getX(pt.chapter),
    y: getY(pt.score),
    val: pt.score,
    isProj: pt.isProjected,
    ch: pt.chapter,
  })) || [];

  const realPolyline = studentPts
    .slice(0, activeLevel === "A22" ? 11 : 18)
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  const projPolyline = activeLevel === "A22"
    ? studentPts
        .slice(10, 18)
        .map((p) => `${p.x},${p.y}`)
        .join(" ")
    : "";

  const kkmY = getY(kkm);

  return (
    <div className="space-y-6">
      {/* ========================================================
          1. GOOGLE STITCH HERO BANNER & LEVEL NAVIGATOR
          ======================================================== */}
      <section className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 relative overflow-hidden shadow-xl bg-gradient-to-br from-indigo-500/10 via-amber-500/5 to-transparent">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500 text-white shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> GOOGLE STITCH FORECASTING LAB
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-black/5 dark:bg-white/10 opacity-80 border border-current/10">
                Formula Review: 250 × (Rata-rata 6 Bab / 100)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
              Laboratorium Proyeksi Multi-Level (A1 s.d. A2.2)
            </h2>
            <p className="text-xs sm:text-sm opacity-75 leading-relaxed">
              Memodelkan perolehan nilai Bab 1–18, Review 1 (Bab 1–6), Review 2 (Bab 7–12), Review 3 (Bab 13–18), serta Ujian Akhir Buku (skala 250 pt) berbasis habit profiling dan mitigasi pedagogis 4 pilar.
            </p>
          </div>

          {/* Level Switcher (A1, A2.1, A2.2, Grand Trajectory) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <div className="p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex items-center gap-1">
              {[
                { id: "A1", label: "A1 (Dasar)" },
                { id: "A21", label: "A2.1 (Pemantapan)" },
                { id: "A22", label: "A2.2 (Siap JFT)" },
                { id: "trajectory", label: "Grand Trajectory" },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setActiveLevel(lvl.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                    activeLevel === lvl.id
                      ? "bg-indigo-500 text-white shadow-md font-extrabold"
                      : "opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-6 border-t border-current/10 mt-6 text-xs">
          {[
            { id: "overview", label: "Visual Trajectory & Profil Siswa", icon: TrendingUp },
            { id: "students", label: "Matriks Lengkap 28 Siswa (/250 pt)", icon: Layers },
            { id: "mitigation", label: "Analisis Kekurangan & Rencana Mitigasi", icon: ShieldCheck },
            { id: "whatif", label: "Simulator Skenario Kebijakan", icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeViewMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveViewMode(tab.id as any)}
                className={`px-4 py-2 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-stone-900 text-white dark:bg-white dark:text-stone-950 shadow-md"
                    : "bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          GRAND TRAJECTORY VIEW (JIKA LEVEL TRAJECTORY AKTIF)
          ======================================================== */}
      {activeLevel === "trajectory" && (
        <section className="clay-card p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-indigo-500/5 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-indigo-400 mb-1">
                <Compass className="w-4 h-4" /> Grand Trajectory Klan Otsutsuki
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-serif">
                Evolusi Perjalanan Belajar: A1 ➔ A2.1 ➔ A2.2
              </h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Evaluasi Berkelanjutan
            </span>
          </div>

          <p className="text-xs opacity-75 leading-relaxed max-w-3xl">
            Membandingkan performa kumulatif 28 siswa dari tahap pemula A1, pemantapan A2.1, hingga level siap kerja A2.2. Grafik ini menunjukkan daya resiliensi dan konsistensi siswa dalam menghadapi kurikulum standar Jepang.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
              <span className="text-[11px] font-bold uppercase opacity-60">1. Level A1 (Dasar)</span>
              <div className="text-2xl font-black text-amber-500 font-serif">
                {masterRapor.levels.A1?.classSummary?.average?.toFixed(1) || "70.2"}
              </div>
              <p className="text-[11px] opacity-70">
                Pondasi pengenalan huruf Hiragana, Katakana, dan tata bahasa dasar N5.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
              <span className="text-[11px] font-bold uppercase opacity-60">2. Level A2.1 (Pemantapan)</span>
              <div className="text-2xl font-black text-blue-500 font-serif">
                {masterRapor.levels.A21?.classSummary?.average?.toFixed(1) || "72.4"}
              </div>
              <p className="text-[11px] opacity-70">
                Pola kalimat kompleks, percakapan sehari-hari, dan kanji fungsional.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
              <span className="text-[11px] font-bold uppercase opacity-60">3. Level A2.2 (Kompetensi Kerja)</span>
              <div className="text-2xl font-black text-emerald-500 font-serif">
                {classAverages.avgFinal} pt (/250)
              </div>
              <p className="text-[11px] opacity-70">
                Target kelulusan Prometric JFT-Basic A2 dan kesiapan kerja di Jepang.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          2. VIEW: OVERVIEW DUAL-ZONE TRAJECTORY CHART & PROFIL
          ======================================================== */}
      {activeViewMode === "overview" && selectedProfile && (
        <div className="space-y-6">
          {/* Quick Metrics Bar Review 1, 2, 3 & Final Exam (/250 pt) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="clay-card p-4 rounded-2xl border border-current/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                Review 1 (Bab 1–6)
              </span>
              <div className="text-2xl font-black font-serif text-amber-600 dark:text-amber-400">
                {classAverages.avgR1} <span className="text-xs font-normal opacity-50">/ 250 pt</span>
              </div>
              <span className="text-[10px] opacity-60 block">Rata-rata 6 Bab: {Math.round((classAverages.avgR1 / 250) * 100)}%</span>
            </div>

            <div className="clay-card p-4 rounded-2xl border border-current/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                Review 2 (Bab 7–12)
              </span>
              <div className="text-2xl font-black font-serif text-blue-600 dark:text-blue-400">
                {classAverages.avgR2} <span className="text-xs font-normal opacity-50">/ 250 pt</span>
              </div>
              <span className="text-[10px] opacity-60 block">Rata-rata 6 Bab: {Math.round((classAverages.avgR2 / 250) * 100)}%</span>
            </div>

            <div className="clay-card p-4 rounded-2xl border border-current/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                Review 3 (Bab 13–18)
              </span>
              <div className="text-2xl font-black font-serif text-purple-600 dark:text-purple-400">
                {classAverages.avgR3} <span className="text-xs font-normal opacity-50">/ 250 pt</span>
              </div>
              <span className="text-[10px] opacity-60 block">Rata-rata 6 Bab: {Math.round((classAverages.avgR3 / 250) * 100)}%</span>
            </div>

            <div className="clay-card p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Ujian Akhir Prometric
              </span>
              <div className="text-2xl font-black font-serif text-emerald-600 dark:text-emerald-400">
                {classAverages.avgFinal} <span className="text-xs font-normal opacity-50">/ 250 pt</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 block">
                {classAverages.passRate}% Lolos (≥200 pt)
              </span>
            </div>
          </div>

          {/* Student Selector Bar */}
          <div className="clay-card p-4 rounded-2xl border border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 font-black text-sm flex items-center justify-center border border-indigo-500/30">
                #{selectedProfile.student.no}
              </div>
              <div>
                <h4 className="font-extrabold text-sm">{selectedProfile.student.name}</h4>
                <p className="text-[11px] opacity-60 font-mono">
                  {selectedProfile.student.nim || `#${selectedProfile.student.no}`} • {selectedProfile.habit.label}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedProfile.student.no}
                onChange={(e) => setSelectedStudentNo(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-current/10 font-bold cursor-pointer"
              >
                {projections.map((p) => (
                  <option key={p.student.no} value={p.student.no}>
                    #{p.student.no} - {p.student.name} ({p.projFinalExam} pt)
                  </option>
                ))}
              </select>

              {onSelectStudentPrint && (
                <button
                  onClick={() => onSelectStudentPrint(selectedProfile.student)}
                  className="clay-btn-gold px-3 py-1.5 rounded-xl text-xs font-bold"
                >
                  Cetak Rapor
                </button>
              )}
            </div>
          </div>

          {/* SVG Trajectory Line Chart */}
          <div className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  Kurva Trajektori Nilai 18 Bab
                </h3>
                <p className="text-xs opacity-60">
                  {activeLevel === "A22"
                    ? "Garis tegas = Bab 1–11 (Data Riil). Garis putus-putus = Bab 12–18 (Proyeksi Kebiasaan)."
                    : "Data kurva riil per bab (Bab 1–18)."}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="w-3 h-0.5 bg-indigo-500 inline-block" /> Garis Nilai Siswa
                </span>
                <span className="flex items-center gap-1.5 font-bold text-amber-500">
                  <span className="w-3 h-0.5 bg-amber-500 border-dashed border-b border-amber-500 inline-block" /> Standar KKM ({kkm})
                </span>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <svg viewBox="0 0 840 240" className="w-full h-auto min-w-[700px] text-xs select-none">
                {/* Zone Background Tint for A2.2 */}
                {activeLevel === "A22" && (
                  <>
                    <rect
                      x={paddingLeft}
                      y={paddingTop}
                      width={boundaryX - paddingLeft}
                      height={usableHeight}
                      className="fill-black/[0.02] dark:fill-white/[0.02]"
                    />
                    <rect
                      x={boundaryX}
                      y={paddingTop}
                      width={840 - paddingRight - boundaryX}
                      height={usableHeight}
                      className="fill-indigo-500/[0.05]"
                    />
                    <line
                      x1={boundaryX}
                      y1={paddingTop}
                      x2={boundaryX}
                      y2={paddingTop + usableHeight}
                      className="stroke-indigo-500/30"
                      strokeDasharray="4 4"
                      strokeWidth="1.5"
                    />
                    <text
                      x={boundaryX - 10}
                      y={paddingTop + 15}
                      textAnchor="end"
                      className="fill-current text-[10px] font-extrabold opacity-40 uppercase tracking-widest"
                    >
                      Zona Riil (Bab 1–11)
                    </text>
                    <text
                      x={boundaryX + 10}
                      y={paddingTop + 15}
                      textAnchor="start"
                      className="fill-indigo-500 text-[10px] font-black uppercase tracking-widest"
                    >
                      Zona Proyeksi (Bab 12–18)
                    </text>
                  </>
                )}

                {/* KKM Horizontal Line */}
                <line
                  x1={paddingLeft}
                  y1={kkmY}
                  x2={840 - paddingRight}
                  y2={kkmY}
                  className="stroke-amber-500/60"
                  strokeDasharray="3 3"
                  strokeWidth="1.5"
                />
                <text
                  x={840 - paddingRight + 5}
                  y={kkmY + 3}
                  className="fill-amber-500 text-[10px] font-mono font-bold"
                >
                  KKM {kkm}
                </text>

                {/* Grid X Axis & Labels */}
                {Array.from({ length: 18 }, (_, i) => i + 1).map((ch) => {
                  const x = getX(ch);
                  return (
                    <g key={ch}>
                      <line
                        x1={x}
                        y1={paddingTop}
                        x2={x}
                        y2={paddingTop + usableHeight}
                        className="stroke-current/5"
                        strokeWidth="1"
                      />
                      <text
                        x={x}
                        y={chartHeight - 15}
                        textAnchor="middle"
                        className={`text-[10px] font-bold ${
                          activeLevel === "A22" && ch >= 12 ? "fill-indigo-400 font-extrabold" : "fill-current opacity-60"
                        }`}
                      >
                        B{ch}
                      </text>
                    </g>
                  );
                })}

                {/* Real Line (Solid) */}
                {realPolyline && (
                  <polyline
                    points={realPolyline}
                    fill="none"
                    className="stroke-indigo-500"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Projected Line (Dashed) */}
                {projPolyline && (
                  <polyline
                    points={projPolyline}
                    fill="none"
                    className="stroke-indigo-400"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {studentPts.map((p) => (
                  <g key={p.ch}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={p.isProj ? 4 : 4.5}
                      className={
                        p.isProj
                          ? "fill-stone-900 dark:fill-stone-950 stroke-indigo-400"
                          : "fill-indigo-500 stroke-stone-900 dark:stroke-stone-950"
                      }
                      strokeWidth="2"
                    />
                    <text
                      x={p.x}
                      y={p.y - 8}
                      textAnchor="middle"
                      className={`text-[9px] font-mono font-bold ${
                        p.isProj ? "fill-indigo-400 font-black" : "fill-current opacity-70"
                      }`}
                    >
                      {p.val}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          3. VIEW: MATRIKS LENGKAP 28 SISWA (/250 PT)
          ======================================================== */}
      {activeViewMode === "students" && (
        <section className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-base font-serif flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                Matriks Proyeksi 28 Siswa (Formula Review 250 Poin)
              </h3>
              <p className="text-xs opacity-70">
                Formula: <code className="font-mono text-amber-500 font-bold">Review Score = 250 × (Rata-rata 6 Bab / 100)</code>
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-bold">
              Ambang Lolos Prometric: ≥200 pt
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-current/10 bg-black/5 dark:bg-white/5 opacity-80 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3 text-center w-12">No</th>
                  <th className="p-3">Nama Lengkap Siswa</th>
                  <th className="p-3">Karakteristik &amp; Kebiasaan</th>
                  <th className="p-3 text-center w-28">Review 1 (/250)</th>
                  <th className="p-3 text-center w-28">Review 2 (/250)</th>
                  <th className="p-3 text-center w-28">Review 3 (/250)</th>
                  <th className="p-3 text-center w-28">Ujian Akhir (/250)</th>
                  <th className="p-3 text-center w-32">Status Prometric</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-current/10 font-medium">
                {projections.map((prof, idx) => (
                  <tr
                    key={prof.student.no}
                    onClick={() => {
                      setSelectedStudentNo(prof.student.no);
                      setActiveViewMode("overview");
                    }}
                    className="hover:bg-indigo-500/10 cursor-pointer transition"
                  >
                    <td className="p-3 text-center font-bold opacity-60">
                      #{idx + 1}
                    </td>
                    <td className="p-3 font-bold">
                      <div className="flex items-center gap-2">
                        <span>{prof.student.name}</span>
                        <span className="text-[9px] font-mono opacity-50 px-1 py-0.5 rounded bg-black/5 dark:bg-white/5">
                          {prof.student.nim || `#${prof.student.no}`}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${prof.habit.badgeColor}`}>
                        <span>{prof.habit.label}</span>
                      </span>
                    </td>
                    <td className="p-3 text-center font-mono text-amber-600 dark:text-amber-400 font-bold">
                      {prof.projReview1} <span className="text-[10px] opacity-50">({prof.avgBab1to6}%)</span>
                    </td>
                    <td className="p-3 text-center font-mono text-blue-600 dark:text-blue-400 font-bold">
                      {prof.projReview2} <span className="text-[10px] opacity-50">({prof.avgBab7to12}%)</span>
                    </td>
                    <td className="p-3 text-center font-mono text-purple-600 dark:text-purple-400 font-bold">
                      {prof.projReview3} <span className="text-[10px] opacity-50">({prof.avgBab13to18}%)</span>
                    </td>
                    <td className="p-3 text-center font-mono font-black text-sm text-indigo-400">
                      {prof.projFinalExam}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        prof.passPrometric
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : prof.isCaution
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                          : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                      }`}>
                        {prof.passPrometric ? "✓ LOLOS" : prof.isCaution ? "⚠️ WASPADA" : "✕ REMEDIAL"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ========================================================
          4. VIEW: ANALISIS KEKURANGAN, KELEBIHAN & MITIGASI 4 PILAR
          ======================================================== */}
      {activeViewMode === "mitigation" && selectedProfile && (
        <div className="space-y-6">
          {/* Header Kontrol Pemilihan Siswa */}
          <div className="clay-card p-6 rounded-3xl border border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-amber-500 mb-1">
                <ShieldCheck className="w-4 h-4" /> Diagnostik Komprehensif Individu
              </div>
              <h3 className="text-xl font-black font-serif">
                Laporan Kelebihan, Kelemahan &amp; Mitigasi: {selectedProfile.student.name}
              </h3>
            </div>

            <select
              value={selectedProfile.student.no}
              onChange={(e) => setSelectedStudentNo(Number(e.target.value))}
              className="px-4 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-current/10 font-bold cursor-pointer shrink-0"
            >
              {projections.map((p) => (
                <option key={p.student.no} value={p.student.no}>
                  #{p.student.no} - {p.student.name}
                </option>
              ))}
            </select>
          </div>

          {/* DUA KARTU: KELEBIHAN & KEKURANGAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kelebihan Siswa */}
            <div className="clay-card p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-4 h-4" /> Kelebihan &amp; Potensi Unggulan (長所)
                </h4>
                <span className="text-xs opacity-60 font-mono">Pilar Kekuatan</span>
              </div>
              <ul className="space-y-2.5">
                {selectedProfile.strengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kekurangan / Titik Rentan Siswa */}
            <div className="clay-card p-6 rounded-3xl border border-rose-500/30 bg-rose-500/5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm flex items-center gap-2 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="w-4 h-4" /> Titik Rentan &amp; Area Perbaikan (改善点)
                </h4>
                <span className="text-xs opacity-60 font-mono">Fokus Drill</span>
              </div>
              <ul className="space-y-2.5">
                {selectedProfile.vulnerabilities.map((vul, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{vul}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* MATRIKS MITIGASI 4 PILAR PEMANGKU KEPENTINGAN */}
          <div className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 space-y-6">
            <div className="border-b border-current/10 pb-4">
              <h4 className="text-base font-extrabold font-serif flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-indigo-400" />
                Matriks Rencana Mitigasi Terintegrasi 4 Pilar
              </h4>
              <p className="text-xs opacity-70">
                Langkah konkret yang wajib diimplementasikan oleh masing-masing pihak demi menjamin 100% kelulusan JFT
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pilar 1: Guru / Sensei */}
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-500">
                  <GraduationCap className="w-4 h-4" /> 1. Mitigasi Guru / Sensei (指導方針)
                </div>
                <p className="text-xs opacity-85 leading-relaxed">
                  {selectedProfile.mitigations.teacher}
                </p>
              </div>

              {/* Pilar 2: Siswa / Murid */}
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-500">
                  <User className="w-4 h-4" /> 2. Mitigasi Siswa / Mandiri (自主学習計画)
                </div>
                <p className="text-xs opacity-85 leading-relaxed">
                  {selectedProfile.mitigations.student}
                </p>
              </div>

              {/* Pilar 3: Kepala Sekolah */}
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-blue-500">
                  <Building2 className="w-4 h-4" /> 3. Mitigasi Kepala Sekolah (学校経営支援)
                </div>
                <p className="text-xs opacity-85 leading-relaxed">
                  {selectedProfile.mitigations.principal}
                </p>
              </div>

              {/* Pilar 4: Orang Tua / Wali Murid */}
              <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-purple-500">
                  <HeartHandshake className="w-4 h-4" /> 4. Mitigasi Orang Tua / Rumah (保護者サポート)
                </div>
                <p className="text-xs opacity-85 leading-relaxed">
                  {selectedProfile.mitigations.parent}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. VIEW: SIMULATOR "WHAT-IF"
          ======================================================== */}
      {activeViewMode === "whatif" && (
        <section className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-current/10 pb-4">
            <div>
              <h3 className="font-extrabold text-base font-serif flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                Simulator Skenario Kebijakan Belajar (&quot;What-If&quot;)
              </h3>
              <p className="text-xs opacity-70">
                Uji dampak pemberian jam tambahan, drilling LKPD, atau program karantina terhadap proyeksi kelulusan ujian Prometric
              </p>
            </div>
            <button
              onClick={() => setInterventionDelta(0)}
              className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
            >
              Reset ke Normal (0 pt)
            </button>
          </div>

          {/* Slider Control ala Google Stitch */}
          <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider opacity-70">
                Tingkat Intervensi Pedagogis:
              </span>
              <span className="font-mono font-black text-base text-indigo-400">
                {interventionDelta > 0 ? `+${interventionDelta} pt` : `${interventionDelta} pt`} (Efek Belajar)
              </span>
            </div>

            <input
              type="range"
              min="-10"
              max="15"
              step="1"
              value={interventionDelta}
              onChange={(e) => setInterventionDelta(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />

            <div className="flex items-center justify-between text-[10px] opacity-60 font-mono">
              <span>-10 pt (Penurunan Disiplin)</span>
              <span>0 pt (Normal Baseline)</span>
              <span>+5 pt (Drilling Harian)</span>
              <span>+10 pt (Karantina Intensif)</span>
              <span>+15 pt (Camp Sukses 100%)</span>
            </div>
          </div>

          {/* Impact Simulation Outcomes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 text-center space-y-1">
              <span className="text-[10px] opacity-60 block font-bold uppercase tracking-wider">
                Proyeksi Rata-Rata Ujian Akhir
              </span>
              <span className="text-3xl font-black text-indigo-400 font-mono">
                {classAverages.avgFinal}
              </span>
              <span className="text-xs opacity-60 block">Skala 250 pt</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 text-center space-y-1">
              <span className="text-[10px] opacity-60 block font-bold uppercase tracking-wider">
                Tingkat Kelulusan Kelas (≥200 pt)
              </span>
              <span className="text-3xl font-black text-emerald-500 font-mono">
                {classAverages.passRate}%
              </span>
              <span className="text-xs opacity-60 block">{classAverages.passCount} dari {classAverages.total} Siswa Lolos</span>
            </div>

            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 text-center space-y-1">
              <span className="text-[10px] opacity-60 block font-bold uppercase tracking-wider">
                Siswa Dalam Zona Resiko
              </span>
              <span className="text-3xl font-black text-rose-500 font-mono">
                {classAverages.remedialCount} Siswa
              </span>
              <span className="text-xs opacity-60 block">Waspada: {classAverages.cautionCount} Siswa</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
