"use client";

import React, { useState, useMemo } from "react";
import {
  Award,
  Zap,
  Target,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  Flame,
  Volume2,
  FileText,
  UserCheck,
  Search,
  Star,
  MessageSquare,
  Headphones,
} from "lucide-react";
import { StudentRaporItem, LevelRaporData } from "@/types/rapor";

interface StudentPersonaViewProps {
  students: StudentRaporItem[];
  levelData: LevelRaporData | null;
  kkm: number;
  onOpenPrintModal: (student: StudentRaporItem) => void;
  onOpenDetailModal: (student: StudentRaporItem) => void;
  onNavigateToTab?: (tab: any) => void;
}

export default function StudentPersonaView({
  students,
  levelData,
  kkm,
  onOpenPrintModal,
  onOpenDetailModal,
  onNavigateToTab,
}: StudentPersonaViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentNo, setSelectedStudentNo] = useState<number>(students[0]?.no || 1);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({
    task1: true,
    task2: false,
    task3: false,
  });

  // Cari atau pilih siswa aktif
  const activeStudent = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const found = students.find(
        (s) =>
          (s.nim && s.nim.toLowerCase().includes(q)) ||
          s.name.toLowerCase().includes(q) ||
          String(s.no) === q
      );
      if (found) return found;
    }
    return students.find((s) => s.no === selectedStudentNo) || students[0];
  }, [students, searchQuery, selectedStudentNo]);

  if (!activeStudent) return null;

  // Skor Komposit
  const score = activeStudent.compositeScore ?? activeStudent.summary?.compositeScore ?? 0;
  
  // Proyeksi Prometric JFT (Skala 250 pt: 250 * score / 100)
  const jftScore = Math.round((250 * score) / 100);
  const jftTarget = 200; // Standar Kelulusan Prometric JFT-Basic A2
  const distanceToTarget = jftTarget - jftScore;
  const isJftPassed = jftScore >= jftTarget;

  // Analisis 4 Aspek Siswa
  const moji = activeStudent.averages?.mojiGoi || 0;
  const kaiwa = activeStudent.averages?.kaiwa || 0;
  const choukai = activeStudent.averages?.choukai || 0;
  const dokkai = activeStudent.averages?.dokkai || 0;

  const mojiPct = Math.round((moji / 24) * 100);
  const kaiwaPct = Math.round((kaiwa / 24) * 100);
  const choukaiPct = Math.round((choukai / 24) * 100);
  const dokkaiPct = Math.round((dokkai / 28) * 100);

  // Cari Aspek Terkuat & Terlemah
  const sections = [
    { name: "Moji-Goi (Kosakata)", pct: mojiPct, val: moji, max: 24, icon: BookOpen },
    { name: "Kaiwa (Percakapan)", pct: kaiwaPct, val: kaiwa, max: 24, icon: MessageSquare },
    { name: "Choukai (Pendengaran)", pct: choukaiPct, val: choukai, max: 24, icon: Headphones },
    { name: "Dokkai (Pemahaman Bacaan)", pct: dokkaiPct, val: dokkai, max: 28, icon: FileText },
  ];
  const sortedSections = [...sections].sort((a, b) => b.pct - a.pct);
  const strongest = sortedSections[0];
  const weakest = sortedSections[sortedSections.length - 1];

  // Gelar Ninja Otsutsuki Berdasarkan Skor
  const ninjaTitle =
    score >= 90
      ? { title: "Jonin Elit Klan Otsutsuki (大筒木上忍)", rank: "S-Class", badge: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30" }
      : score >= 80
      ? { title: "Chunin Senior Tangguh (大筒木中忍)", rank: "A-Class", badge: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" }
      : score >= 70
      ? { title: "Genin Potensial Berbakat (大筒木下忍)", rank: "B-Class", badge: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30" }
      : { title: "Akademi Ninja Dalam Penggemblengan (修業生)", rank: "Trainee", badge: "bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30" };

  const toggleTask = (key: string) => {
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-200">
      {/* 1. STUDENT IDENTITY BANNER */}
      <div className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 bg-gradient-to-br from-amber-500/10 via-black/5 to-transparent relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-500 text-stone-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
              {activeStudent.name.charAt(0)}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${ninjaTitle.badge}`}>
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  {ninjaTitle.title}
                </span>
                <span className="text-xs opacity-60 font-mono font-semibold">
                  NIM: {activeStudent.nim || `#${activeStudent.no}`}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-serif tracking-tight">
                {activeStudent.name}
              </h1>
              <p className="text-xs opacity-75">
                Ksatria Bahasa Jepang Kelas Outsutsuki • Angkatan A2.2 • Kursi No. {activeStudent.no}
              </p>
            </div>
          </div>

          {/* Quick Actions & Student Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="Cari NIM / Nama Siswa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-current/10 w-full sm:w-48 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <select
              value={activeStudent.no}
              onChange={(e) => {
                setSelectedStudentNo(Number(e.target.value));
                setSearchQuery("");
              }}
              className="px-3 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-current/10 font-bold cursor-pointer"
            >
              {students.map((st) => (
                <option key={st.no} value={st.no}>
                  #{st.no} - {st.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => onOpenPrintModal(activeStudent)}
              className="clay-btn-gold px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Cetak Rapor Saya
            </button>
          </div>
        </div>
      </div>

      {/* 2. JFT TARGET RADAR (DISTANCE TO 200 PTS) */}
      <div className="clay-card p-6 sm:p-8 rounded-3xl border border-current/10 relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
              <Target className="w-4 h-4" /> Radar Target Prometric JFT-Basic A2 (250 Poin)
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-serif">
              Status Jarak Menuju Kelulusan Resmi Jepang
            </h2>
          </div>
          <div className="text-right">
            <div className="text-3xl sm:text-4xl font-black font-serif text-amber-600 dark:text-amber-400">
              {jftScore} <span className="text-base font-normal opacity-60">/ 250 pt</span>
            </div>
            <div className="text-xs font-bold opacity-75">
              Skor Proyeksi Ujian Prometric
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2">
          <div className="relative w-full h-5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
            {/* Target 200 pt Marker */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
              style={{ left: `${(200 / 250) * 100}%` }}
              title="Garis Kelulusan Prometric (200 Poin)"
            />
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isJftPassed
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                  : "bg-gradient-to-r from-amber-500 to-rose-400"
              }`}
              style={{ width: `${Math.min(100, (jftScore / 250) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] font-bold opacity-70">
            <span>0 pt (Mulai)</span>
            <span className="text-rose-500 dark:text-rose-400 flex items-center gap-1 font-black">
              ★ Ambang Lulus Prometric: 200 pt (80%)
            </span>
            <span>250 pt (Sempurna)</span>
          </div>
        </div>

        {/* Status Callout Box */}
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
            isJftPassed
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              : "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300"
          }`}
        >
          {isJftPassed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <Flame className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm">
              {isJftPassed
                ? "Hebat! Kamu Sudah Berada di Zona Aman Lulus JFT-Basic A2!"
                : `Semangat! Kamu Hanya Butuh ${distanceToTarget} Poin Lagi Menuju Kelulusan!`}
            </h4>
            <p className="text-xs opacity-85 leading-relaxed">
              {isJftPassed
                ? `Proyeksimu saat ini (${jftScore} pt) telah melampaui batas minimum kelulusan 200 poin resmi Jepang. Terus asah ketajaman pendengaran dan pertahankan performamu hingga hari H!`
                : `Nilaimu saat ini (${jftScore} pt) sudah sangat dekat dengan standar 200 pt. Dengan memperbaiki sektor ${weakest.name} sebesar +${Math.ceil(distanceToTarget / 2.5)}% pada latihan mendatang, kamu dipastikan lolos dengan gemilang!`}
            </p>
          </div>
        </div>
      </div>

      {/* 3. DUAL CARD: KEKUATAN UTAMA & AREA DRILLING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kartu Kekuatan Utama */}
        <div className="clay-card p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
              <Zap className="w-4 h-4" /> Kekuatan Supermu (長所・得意分野)
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <strongest.icon className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black">{strongest.name}</h3>
            <p className="text-xs opacity-75">
              Pencapaian: <strong className="text-emerald-600 dark:text-emerald-400">{strongest.pct}%</strong> ({strongest.val} dari {strongest.max} poin)
            </p>
          </div>
          <p className="text-xs opacity-80 leading-relaxed">
            Ini adalah senjata andalanmu! Refleks dan pemahamanmu di sektor ini di atas rata-rata kelas. Jadikan modal utama untuk mengumpulkan poin maksimal saat ujian sesungguhnya.
          </p>
          <div className="pt-2 border-t border-emerald-500/20 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> Predikat: Master {strongest.name.split(" ")[0]}
          </div>
        </div>

        {/* Kartu Area Latihan Keras */}
        <div className="clay-card p-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-amber-600 dark:text-amber-400">
              <Flame className="w-4 h-4" /> Area Asah Tambahan (弱点克服・鍛錬課題)
            </div>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <weakest.icon className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black">{weakest.name}</h3>
            <p className="text-xs opacity-75">
              Pencapaian: <strong className="text-amber-600 dark:text-amber-400">{weakest.pct}%</strong> ({weakest.val} dari {weakest.max} poin)
            </p>
          </div>
          <p className="text-xs opacity-80 leading-relaxed">
            Jangan khawatir! Ini adalah kesempatan terbesarmu untuk mendongkrak total nilai. Alokasikan 20 menit ekstra setiap hari untuk latihan membaca cepat atau review kosakata terkait.
          </p>
          <div className="pt-2 border-t border-amber-500/20 text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" /> Target Peningkatan: Naikkan ke ≥ 85%
          </div>
        </div>
      </div>

      {/* 4. CAN-DO CHECKLIST & TO-DO LIST BELAJAR MANDIRI */}
      <div className="clay-card p-6 rounded-3xl border border-current/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-500" />
              To-Do List Mandiri & Target Can-do Pekan Ini
            </h3>
            <p className="text-xs opacity-60">
              Selesaikan misi-misi harian di bawah ini untuk mengunci kelulusan 100%!
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-current/10">
            {Object.values(completedTasks).filter(Boolean).length} / 3 Selesai
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {[
            {
              id: "task1",
              title: "Shadowing Audio Choukai (20 Menit)",
              desc: "Dengarkan rekaman percakapan Bab 10–11 tanpa melihat naskah, lalu tirukan intonasi penutur asli Jepang.",
              badge: "Pendengaran",
            },
            {
              id: "task2",
              title: "Latihan Membaca Cepat Naskah Dokkai Kerja",
              desc: "Baca email / formulir izin kantor Jepang dalam waktu 3 menit, lalu jawab pertanyaan inti siapa, kapan, dan di mana.",
              badge: "Pemahaman Bacaan",
            },
            {
              id: "task3",
              title: "Review Ulang 15 Kanji Kunci Bab 11 & 12",
              desc: "Tuliskan Onyomi dan Kunyomi kanji penting yang berkaitan dengan tempat kerja dan petunjuk arah jalan.",
              badge: "Kanji & Kosakata",
            },
          ].map((t) => {
            const isDone = !!completedTasks[t.id];
            return (
              <div
                key={t.id}
                onClick={() => toggleTask(t.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
                  isDone
                    ? "bg-black/5 dark:bg-white/5 border-current/10 opacity-70"
                    : "bg-amber-500/5 border-amber-500/30 hover:bg-amber-500/10"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition ${
                    isDone
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-current/30"
                  }`}
                >
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-extrabold text-xs ${isDone ? "line-through opacity-70" : ""}`}>
                      {t.title}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 font-bold opacity-60">
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-75 leading-relaxed">{t.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
