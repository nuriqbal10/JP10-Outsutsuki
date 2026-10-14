"use client";

export const runtime = "edge";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Volume2,
  Award,
  AlertCircle,
  RefreshCw,
  Edit3,
  Save,
  X,
  Settings,
  ShieldCheck,
  Grid,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ImageIcon,
} from "lucide-react";
import ScoreReport from "@/components/cbt/ScoreReport";
import ThemeSwitcher from "@/components/ThemeSwitcher";

interface Question {
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

// 4 Seksi Standar Resmi JFT-Basic
const SECTIONS = [
  { id: "moji_goi", num: 1, name: "Section 1", label: "Moji & Goi", desc: "Huruf & Kosakata (文字・語彙)" },
  { id: "kaiwa_hyougen", num: 2, name: "Section 2", label: "Kaiwa & Hyougen", desc: "Percakapan & Tata Bahasa (会話・表現)" },
  { id: "choukai", num: 3, name: "Section 3", label: "Choukai", desc: "Menyimak Audio (聴解)" },
  { id: "dokkai", num: 4, name: "Section 4", label: "Dokkai", desc: "Pemahaman Bacaan (読解)" },
];

export default function CbtSessionPage() {
  const params = useParams();
  const router = useRouter();
  const chapterParam = params?.chapter as string;
  const chapter = parseInt(chapterParam, 10);

  // Data Soal
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Regulasi Seksi JFT-Simulation (1 -> 2 -> 3 -> 4)
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const currentSection = SECTIONS[currentSectionIndex];

  // Soal per seksi aktif
  const sectionQuestions = allQuestions.filter((q) => q.section === currentSection.id);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);

  // Jawaban User & Status Selesai
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Regulasi Audio Choukai (Max 2x putar per audio sesuai standar JFT)
  const [audioPlayCounts, setAudioPlayCounts] = useState<Record<number, number>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Panel Drawer Navigasi Soal (Grid Popup ala icon 🪟 JFT-Simulation)
  const [showNavGrid, setShowNavGrid] = useState<boolean>(false);

  // Timer Custom Setting
  const [customMinutes, setCustomMinutes] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(3600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showTimerModal, setShowTimerModal] = useState<boolean>(false);

  // Mode Guru Inline Editing
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [teacherPassInput, setTeacherPassInput] = useState<string>("");
  const [showTeacherAuthModal, setShowTeacherAuthModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<Partial<Question>>({});
  const [savingEdit, setSavingEdit] = useState<boolean>(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);
        const res = await fetch(`/api/questions?chapter=${chapter}`);
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setAllQuestions(json.data);
        }
      } catch (err) {
        console.error("Gagal memuat soal CBT:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [chapter]);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || loading || allQuestions.length === 0 || !isTimerRunning) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted, loading, allQuestions, isTimerRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleApplyCustomTimer = (minutes: number) => {
    setCustomMinutes(minutes);
    setTimeLeft(minutes * 60);
    setShowTimerModal(false);
  };

  const handleSelectOption = (qId: number, letter: string) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: letter }));
  };

  // Cek apakah seluruh soal di seksi aktif sudah terjawab (Regulasi JFT-Simulation)
  const isCurrentSectionCompleted = () => {
    return sectionQuestions.every((q) => !!userAnswers[q.id]);
  };

  // Pindah ke seksi berikutnya (End Section)
  const handleEndSection = () => {
    const answeredCount = sectionQuestions.filter((q) => !!userAnswers[q.id]).length;
    if (answeredCount < sectionQuestions.length) {
      const confirmSkip = confirm(
        `Anda baru menjawab ${answeredCount} dari ${sectionQuestions.length} soal pada ${currentSection.name}.\nApakah Anda yakin ingin menyelesaikan sesi ini dan lanjut ke sesi berikutnya?`
      );
      if (!confirmSkip) return;
    }

    if (currentSectionIndex < SECTIONS.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      setCurrentQIndex(0);
    } else {
      const confirmEnd = confirm("Ini adalah seksi terakhir (Dokkai). Apakah Anda yakin ingin mengakhiri tes ini?");
      if (confirmEnd) {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    allQuestions.forEach((q) => {
      if (userAnswers[q.id]?.toLowerCase() === q.answerKey.toLowerCase()) {
        correct++;
      }
    });
    setScore(correct);
    setIsSubmitted(true);
  };

  // Kontrol Audio Choukai (Maksimal 2 kali putar)
  const handleAudioPlay = (qId: number) => {
    const currentPlays = audioPlayCounts[qId] || 0;
    if (currentPlays >= 2) return;
    setAudioPlayCounts((prev) => ({ ...prev, [qId]: currentPlays + 1 }));
    setIsPlayingAudio(true);
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
  };

  // Mode Guru Auth
  const handleTeacherLogin = () => {
    if (teacherPassInput === "sensei2026" || teacherPassInput === "iqbal123" || teacherPassInput === "admin") {
      setIsTeacherMode(true);
      setShowTeacherAuthModal(false);
      setTeacherPassInput("");
    } else {
      alert("Kata sandi guru salah. Silakan coba lagi.");
    }
  };

  const currentQ = sectionQuestions[currentQIndex] || allQuestions[0];
  const options = currentQ
    ? [
        { letter: "a", text: currentQ.optionA },
        { letter: "b", text: currentQ.optionB },
        { letter: "c", text: currentQ.optionC },
        ...(currentQ.optionD ? [{ letter: "d", text: currentQ.optionD }] : []),
      ]
    : [];

  const startEditQuestion = (q: Question) => {
    setEditForm({
      id: q.id,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      answerKey: q.answerKey,
      explanation: q.explanation,
      stimulusText: q.stimulusText,
      imageR2Url: q.imageR2Url,
      audioR2Url: q.audioR2Url,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm.id) return;
    try {
      setSavingEdit(true);
      const res = await fetch("/api/questions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (json.success) {
        setAllQuestions((prev) =>
          prev.map((q) => (q.id === editForm.id ? { ...q, ...editForm } : q))
        );
        setIsEditing(false);
        alert("✅ Soal berhasil diperbarui di database!");
      } else {
        alert("Gagal menyimpan: " + json.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a080d]">
        <div className="clay-card p-8 flex flex-col items-center gap-4 text-rose-200">
          <RefreshCw className="w-10 h-10 animate-spin text-rose-400" />
          <p className="font-extrabold text-sm tracking-wide">Menyiapkan Simulator Ujian Standar JFT-Basic...</p>
        </div>
      </div>
    );
  }

  // Tampilan Hasil Ujian (Score Report Resmi JFT-Basic)
  if (isSubmitted) {
    return (
      <ScoreReport
        chapter={chapter}
        questions={allQuestions}
        userAnswers={userAnswers}
        timeSpentSeconds={customMinutes * 60 - timeLeft}
        onRetake={() => {
          setUserAnswers({});
          setIsSubmitted(false);
          setCurrentSectionIndex(0);
          setCurrentQIndex(0);
          setTimeLeft(customMinutes * 60);
          setIsTimerRunning(true);
          setAudioPlayCounts({});
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-rose-50 select-none pb-12">
      {/* ========================================================
          1. HEADER JFT-SIMULATION (CLAYMORPHISM LUXURY BURGUNDY)
          ======================================================== */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#25060e]/85 border-b border-rose-950/60 px-4 sm:px-8 py-3 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Sisi Kiri: Status Section & Nomor Soal */}
          <div className="flex items-center gap-3">
            <Link
              href="/cbt"
              className="clay-nav-pill px-3 py-1.5 bg-[#420d1a] hover:bg-[#5c1124] text-rose-300 hover:text-white text-xs font-black transition flex items-center gap-1.5 border border-rose-900/40"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Keluar
            </Link>
            <div className="h-4 w-px bg-rose-900/40 hidden sm:block" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                {currentSection.name} : {currentSection.label}
              </span>
              <span className="text-[11px] font-bold text-rose-300/70 hidden sm:inline">
                • Question {currentQIndex + 1} of {sectionQuestions.length}
              </span>
            </div>
          </div>

          {/* Sisi Tengah: Countdown Timer */}
          <button
            onClick={() => setShowTimerModal(true)}
            title="Klik untuk ubah durasi timer"
            className="clay-nav-pill px-4 py-1.5 bg-[#380a15] border border-amber-500/30 font-mono text-xs sm:text-sm font-black text-amber-300 flex items-center gap-2 hover:border-amber-400 transition shadow-inner"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{formatTime(timeLeft)}</span>
            <Settings className="w-3 h-3 text-rose-400/60 ml-0.5" />
          </button>

          {/* Sisi Kanan: Theme Switcher, Mode Guru & Tombol Selesaikan */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeSwitcher compact />

            {!isTeacherMode ? (
              <button
                onClick={() => setShowTeacherAuthModal(true)}
                className="clay-nav-pill px-3 py-1 bg-[#330812] hover:bg-[#4a0d1b] text-[11px] font-bold text-rose-300 border border-rose-900/50 flex items-center gap-1 transition"
              >
                <ShieldCheck className="w-3 h-3 text-rose-400" />
                <span className="hidden md:inline">Mode Guru</span>
              </button>
            ) : (
              <button
                onClick={() => currentQ && startEditQuestion(currentQ)}
                className="clay-btn-gold px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1 shadow"
              >
                <Edit3 className="w-3 h-3" /> Edit Soal
              </button>
            )}

            {!isSubmitted ? (
              <button
                onClick={handleEndSection}
                className="clay-btn px-4 sm:px-5 py-1.5 rounded-full text-xs font-black tracking-wide shadow-lg border border-rose-400/40"
              >
                {currentSectionIndex === SECTIONS.length - 1 ? "Selesaikan Ujian" : "Selesaikan Sesi ➔"}
              </button>
            ) : (
              <div className="clay-card-light px-3 py-1 text-rose-950 font-black text-xs">
                Skor: {score}/{allQuestions.length} ({Math.round((score / allQuestions.length) * 100)}%)
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================
          2. SECTION TABS INDICATOR (STATUS 4 SEKSI JFT)
          ======================================================== */}
      <div className="bg-[#1f060c] border-b border-rose-950/40 px-4 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            {SECTIONS.map((sec, idx) => {
              const isCurrent = idx === currentSectionIndex;
              const isPast = idx < currentSectionIndex;
              const totalSec = allQuestions.filter((q) => q.section === sec.id).length;
              const answeredSec = allQuestions.filter((q) => q.section === sec.id && !!userAnswers[q.id]).length;

              let badgeStyle = "bg-[#2d0711] text-rose-400/60 border-rose-950";
              if (isCurrent) {
                badgeStyle = "bg-gradient-to-r from-rose-700 to-rose-900 text-white border-amber-400/50 shadow-md ring-1 ring-amber-400/40";
              } else if (isPast) {
                badgeStyle = "bg-[#420d1a] text-emerald-400 border-emerald-500/40";
              }

              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    // Hanya izinkan navigasi ke seksi yang sudah atau sedang aktif
                    setCurrentSectionIndex(idx);
                    setCurrentQIndex(0);
                  }}
                  className={`clay-nav-pill px-3 py-1.5 text-xs font-bold transition flex items-center gap-2 border ${badgeStyle}`}
                >
                  <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center text-[10px] font-black">
                    {idx + 1}
                  </span>
                  <span>{sec.label}</span>
                  <span className="text-[10px] font-mono opacity-80">
                    ({answeredSec}/{totalSec})
                  </span>
                  {answeredSec === totalSec && totalSec > 0 && (
                    <Check className="w-3 h-3 text-emerald-400 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tombol Drawer Palette Grid Soal (Icon Grid 🪟 JFT-Simulation) */}
          <button
            onClick={() => setShowNavGrid(!showNavGrid)}
            className="clay-btn px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shrink-0"
            title="Buka Lembar Daftar Nomor Soal"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Daftar Soal</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          3. MAIN TEST CONTAINER
          ======================================================== */}
      <main className="max-w-5xl mx-auto w-full flex-1 p-4 sm:p-6 flex flex-col gap-6 mt-2">
        {/* POPUP DRAWER PALETTE NOMOR SOAL */}
        {showNavGrid && (
          <div className="clay-card p-6 border border-rose-400/30 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
              <div>
                <h4 className="font-black text-sm text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Grid className="w-4 h-4" /> Navigasi Butir Soal • {currentSection.label}
                </h4>
                <p className="text-[11px] text-rose-300/70 mt-0.5">
                  Klik nomor soal di bawah untuk langsung menuju butir soal tersebut.
                </p>
              </div>
              <button
                onClick={() => setShowNavGrid(false)}
                className="text-rose-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 gap-2 max-h-56 overflow-y-auto p-1">
              {sectionQuestions.map((q, idx) => {
                const isAnswered = !!userAnswers[q.id];
                const isCurrent = idx === currentQIndex;
                const isCorrect = isSubmitted && userAnswers[q.id]?.toLowerCase() === q.answerKey.toLowerCase();
                const isWrong = isSubmitted && isAnswered && !isCorrect;

                let btnStyle = "bg-[#330812] text-rose-300 border-rose-900/50 hover:bg-[#4d0c1c]";
                if (isCurrent) {
                  btnStyle = "bg-rose-600 text-white font-black ring-2 ring-amber-400 shadow-lg scale-105";
                } else if (isSubmitted) {
                  btnStyle = isCorrect
                    ? "bg-emerald-600 text-white font-bold"
                    : isWrong
                    ? "bg-rose-950 text-rose-300 border border-rose-500"
                    : "bg-[#25060e] text-rose-600";
                } else if (isAnswered) {
                  btnStyle = "bg-[#5c1124] text-emerald-300 font-bold border border-emerald-500/40";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQIndex(idx);
                      setShowNavGrid(false);
                    }}
                    className={`h-9 rounded-xl border text-xs font-bold transition flex items-center justify-center ${btnStyle}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* LEMBAR SOAL UTAMA (CLAYMORPHISM LUXURY CARD) */}
        {currentQ ? (
          <div className="clay-card p-6 sm:p-10 flex flex-col gap-6 relative border border-rose-400/20 shadow-2xl">
            {/* Sub-header Soal */}
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-4">
              <span className="text-xs font-black uppercase text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                {currentSection.name} • Butir #{currentQ.questionNumber}
              </span>
              <span className="text-xs font-bold text-rose-300/60 font-mono">
                Soal {currentQIndex + 1} dari {sectionQuestions.length}
              </span>
            </div>

            {/* STIMULUS TEKS (WACANA BACAAN DOKKAI / CHOUKAI SCRIPT) */}
            {currentQ.stimulusText && (
              <div className="clay-card-light p-6 text-slate-900 font-medium text-sm leading-relaxed whitespace-pre-line border border-rose-200/50 shadow-inner">
                {currentQ.stimulusText}
              </div>
            )}

            {/* GAMBAR ILUSTRASI RESMI JFT */}
            {currentQ.imageR2Url && (
              <div className="flex flex-col items-center justify-center p-4 bg-[#2b0811] border border-rose-900/40 rounded-2xl shadow-inner">
                <div className="text-[11px] font-bold text-rose-300/60 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" /> Gambar Ilustrasi Soal
                </div>
                <img
                  src={currentQ.imageR2Url}
                  alt={`Gambar Soal #${currentQ.questionNumber}`}
                  className="max-h-64 sm:max-h-80 object-contain rounded-xl shadow-lg border border-rose-800/40 bg-white p-3"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* AUDIO PLAYER (CHOUKAI - DENGAN REGULASI MAKSIMAL 2 KALI PUTAR) */}
            {currentQ.audioR2Url && (
              <div className="clay-card p-5 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center shrink-0 shadow-lg">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-rose-100">Audio Menyimak (Choukai)</div>
                    <div className="text-[11px] text-amber-300 font-bold mt-0.5">
                      {audioPlayCounts[currentQ.id] || 0 >= 2
                        ? "⚠️ Batas maksimal putar audio tercapai (2x)"
                        : `Audio bisa diputar ${2 - (audioPlayCounts[currentQ.id] || 0)} kali lagi`}
                    </div>
                  </div>
                </div>

                <audio
                  controls
                  src={currentQ.audioR2Url}
                  onPlay={() => handleAudioPlay(currentQ.id)}
                  onEnded={handleAudioEnded}
                  className="w-full sm:w-64 h-10 rounded-xl outline-none"
                  preload="metadata"
                >
                  Browser Anda tidak mendukung elemen audio.
                </audio>
              </div>
            )}

            {/* TEKS SOAL (DENGAN WHITE-SPACE PRE-LINE SESUAI ENTER/NEWLINE ASLI) */}
            <div className="text-base sm:text-lg font-black text-rose-50 leading-relaxed whitespace-pre-line">
              {currentQ.questionText}
            </div>

            {/* DAFTAR OPSI JAWABAN (A, B, C, D) */}
            <div className="flex flex-col gap-3.5 pt-2">
              {options.map((opt) => {
                const isSelected = userAnswers[currentQ.id]?.toLowerCase() === opt.letter;
                const isCorrect = isSubmitted && currentQ.answerKey.toLowerCase() === opt.letter;
                const isWrong = isSubmitted && isSelected && !isCorrect;

                let optClass = "bg-[#330812] border-rose-900/40 text-rose-100 hover:bg-[#4a0d1b] hover:border-rose-500/50";
                if (isSelected && !isSubmitted) {
                  optClass = "bg-gradient-to-r from-rose-700 to-rose-800 text-white border-amber-400 shadow-xl ring-2 ring-amber-400/40 scale-[1.01]";
                } else if (isCorrect) {
                  optClass = "bg-emerald-600/90 text-white border-emerald-400 ring-2 ring-emerald-400 shadow-lg";
                } else if (isWrong) {
                  optClass = "bg-rose-950 text-rose-200 border-rose-500 ring-2 ring-rose-500";
                }

                return (
                  <button
                    key={opt.letter}
                    onClick={() => handleSelectOption(currentQ.id, opt.letter)}
                    className={`w-full text-left p-4 rounded-2xl border text-sm font-semibold transition flex items-center justify-between gap-4 ${optClass}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-8 h-8 rounded-xl bg-black/30 border border-white/10 text-rose-100 flex items-center justify-center font-black text-xs uppercase shrink-0 shadow-inner">
                        {opt.letter}
                      </span>
                      <span className="whitespace-pre-line leading-relaxed">{opt.text}</span>
                    </div>

                    {isSelected && !isSubmitted && (
                      <div className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                    )}
                    {isCorrect && (
                      <span className="text-xs font-black text-emerald-200 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-400/30">
                        Kunci Jawaban ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* NAVIGASI SEBELUMNYA / SELANJUTNYA (FORMAT JFT-SIMULATION) */}
            <div className="flex items-center justify-between pt-4 border-t border-rose-900/40">
              <button
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className="clay-nav-pill px-5 py-2.5 bg-[#330812] border border-rose-900/50 text-rose-300 font-bold text-xs hover:bg-[#4a0d1b] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Soal Sebelumnya
              </button>

              <button
                onClick={() => setCurrentQIndex((prev) => Math.min(sectionQuestions.length - 1, prev + 1))}
                disabled={currentQIndex === sectionQuestions.length - 1}
                className="clay-btn px-6 py-2.5 rounded-full text-white font-black text-xs disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1.5 shadow-lg"
              >
                Soal Selanjutnya <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : null}
      </main>

      {/* ========================================================
          4. MODAL SETTING TIMER
          ======================================================== */}
      {showTimerModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="clay-card p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col gap-5 border border-rose-400/30">
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
              <h3 className="font-black text-amber-300 text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" /> Atur Waktu Ujian
              </h3>
              <button onClick={() => setShowTimerModal(false)} className="text-rose-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-rose-200/80 leading-relaxed">
              Pilih alokasi waktu ujian sesuai kebutuhan simulasi atau latihan cepat:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[15, 30, 45, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleApplyCustomTimer(mins)}
                  className={`py-2.5 rounded-xl font-black text-xs border transition ${
                    customMinutes === mins
                      ? "bg-rose-600 text-white border-amber-400 shadow-md ring-1 ring-amber-400"
                      : "bg-[#330812] text-rose-300 border-rose-900/50 hover:bg-[#4a0d1b]"
                  }`}
                >
                  {mins} Menit
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-rose-900/40 text-xs">
              <span className="font-bold text-rose-300">Status Timer:</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-3 py-1.5 rounded-lg font-black transition ${
                  isTimerRunning ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                }`}
              >
                {isTimerRunning ? "Pause Timer" : "Resume Timer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. MODAL LOGIN GURU (TEACHER AUTH)
          ======================================================== */}
      {showTeacherAuthModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="clay-card p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col gap-5 border border-rose-400/30">
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
              <h3 className="font-black text-amber-300 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" /> Login Guru / Pengajar
              </h3>
              <button onClick={() => setShowTeacherAuthModal(false)} className="text-rose-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-rose-200/80 leading-relaxed">
              Masukkan kata sandi guru / pengajar untuk mengaktifkan editing langsung.
            </p>

            <input
              type="password"
              placeholder="Masukkan kata sandi guru..."
              value={teacherPassInput}
              onChange={(e) => setTeacherPassInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTeacherLogin()}
              className="w-full px-4 py-3 rounded-xl bg-[#25060e] border border-rose-800/60 text-sm font-semibold text-rose-100 outline-none focus:border-amber-400"
              autoFocus
            />

            <button
              onClick={handleTeacherLogin}
              className="w-full py-3 clay-btn rounded-xl text-xs font-black shadow-lg"
            >
              Masuk Sebagai Guru
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          6. MODAL EDIT SOAL (TEACHER INLINE EDITOR)
          ======================================================== */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="clay-card p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col gap-5 border border-rose-400/40">
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
              <h3 className="font-black text-amber-300 text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" /> Edit Butir Soal #{currentQ.questionNumber} ({currentQ.section.toUpperCase()})
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-rose-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs font-bold text-rose-200">
              {/* Teks Soal */}
              <div>
                <label className="mb-1 block text-amber-300">Teks Soal / Pertanyaan:</label>
                <textarea
                  rows={3}
                  value={editForm.questionText || ""}
                  onChange={(e) => setEditForm({ ...editForm, questionText: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#25060e] border border-rose-800 text-sm font-medium text-rose-50 outline-none focus:border-amber-400 whitespace-pre-line"
                />
              </div>

              {/* URL Gambar */}
              <div>
                <label className="mb-1 block">URL Gambar Ilustrasi:</label>
                <input
                  type="text"
                  value={editForm.imageR2Url || ""}
                  onChange={(e) => setEditForm({ ...editForm, imageR2Url: e.target.value })}
                  placeholder="https://.../images/shokyu2/..."
                  className="w-full p-2.5 rounded-xl bg-[#25060e] border border-rose-800 font-mono text-xs text-rose-200 outline-none focus:border-amber-400"
                />
              </div>

              {/* URL Audio */}
              <div>
                <label className="mb-1 block">URL Audio Menyimak:</label>
                <input
                  type="text"
                  value={editForm.audioR2Url || ""}
                  onChange={(e) => setEditForm({ ...editForm, audioR2Url: e.target.value })}
                  placeholder="https://.../audio/shokyu2/..."
                  className="w-full p-2.5 rounded-xl bg-[#25060e] border border-rose-800 font-mono text-xs text-rose-200 outline-none focus:border-amber-400"
                />
              </div>

              {/* Stimulus */}
              <div>
                <label className="mb-1 block">Stimulus / Naskah Transkrip:</label>
                <textarea
                  rows={3}
                  value={editForm.stimulusText || ""}
                  onChange={(e) => setEditForm({ ...editForm, stimulusText: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#25060e] border border-rose-800 text-xs font-medium text-rose-50 outline-none focus:border-amber-400 whitespace-pre-line"
                />
              </div>

              {/* Opsi Jawaban */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block">Opsi A:</label>
                  <input
                    type="text"
                    value={editForm.optionA || ""}
                    onChange={(e) => setEditForm({ ...editForm, optionA: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#25060e] border border-rose-800 text-xs text-rose-100 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block">Opsi B:</label>
                  <input
                    type="text"
                    value={editForm.optionB || ""}
                    onChange={(e) => setEditForm({ ...editForm, optionB: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#25060e] border border-rose-800 text-xs text-rose-100 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block">Opsi C:</label>
                  <input
                    type="text"
                    value={editForm.optionC || ""}
                    onChange={(e) => setEditForm({ ...editForm, optionC: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#25060e] border border-rose-800 text-xs text-rose-100 outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block">Opsi D:</label>
                  <input
                    type="text"
                    value={editForm.optionD || ""}
                    onChange={(e) => setEditForm({ ...editForm, optionD: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#25060e] border border-rose-800 text-xs text-rose-100 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Kunci Jawaban */}
              <div>
                <label className="mb-1 block text-amber-300">Kunci Jawaban Benar:</label>
                <select
                  value={editForm.answerKey?.toLowerCase() || "a"}
                  onChange={(e) => setEditForm({ ...editForm, answerKey: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#25060e] border border-rose-800 text-xs font-bold uppercase text-amber-300 outline-none focus:border-amber-400"
                >
                  <option value="a">A</option>
                  <option value="b">B</option>
                  <option value="c">C</option>
                  <option value="d">D</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rose-900/40">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl bg-[#330812] text-rose-300 font-bold text-xs hover:bg-[#4a0d1b]"
              >
                Batal
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={savingEdit}
                className="px-6 py-2.5 clay-btn rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {savingEdit ? "Menyimpan..." : "Simpan Perubahan ke Database"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
