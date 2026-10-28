"use client";

export const runtime = "edge";

import { useEffect, useState, useMemo } from "react";
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
  Flag,
  AlertTriangle,
  FileText,
  Keyboard,
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

// 4 Seksi Standar Resmi Prometric / The Japan Foundation JFT-Basic
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

  // Fitur Prometric: Mark / Flag for Review (マーク / 後で見直す)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // Fitur Prometric: Section Review Modal (セクション終了確認モーダル)
  const [showSectionReviewModal, setShowSectionReviewModal] = useState<boolean>(false);

  // Regulasi Audio Choukai (Max 2x putar per audio sesuai standar resmi Prometric JFT)
  const [audioPlayCounts, setAudioPlayCounts] = useState<Record<number, number>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Panel Drawer Navigasi Soal (Grid Palette Popup)
  const [showNavGrid, setShowNavGrid] = useState<boolean>(false);

  // Modal Bantuan Pintasan Keyboard
  const [showKeyboardHelp, setShowKeyboardHelp] = useState<boolean>(false);

  // Timer Custom Setting
  const [customMinutes, setCustomMinutes] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(3600);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showTimerModal, setShowTimerModal] = useState<boolean>(false);

  // Mode Guru Inline Editing
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [teacherToken, setTeacherToken] = useState<string>("");
  const [teacherPassInput, setTeacherPassInput] = useState<string>("");
  const [showTeacherAuthModal, setShowTeacherAuthModal] = useState<boolean>(false);
  const [isVerifyingTeacher, setIsVerifyingTeacher] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<Partial<Question>>({});
  const [savingEdit, setSavingEdit] = useState<boolean>(false);
  const [submittingExam, setSubmittingExam] = useState<boolean>(false);

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

  const toggleFlag = (qId: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  // Resolusi Audio URL dengan Fallback Cerdas (Mendukung Bab 1-18 & Chapter 0 Mock Test)
  const resolveAudioUrl = (audioUrl: string | null, fallbackChapter: number) => {
    if (!audioUrl) return "";
    if (audioUrl.startsWith("http://") || audioUrl.startsWith("https://") || audioUrl.startsWith("/lkpd/")) {
      return audioUrl;
    }
    const filename = audioUrl.split("/").pop() || "";
    const match = filename.match(/Z_\[?(\d{1,2})-\d{1,2}\]?/);
    const chNum = match ? parseInt(match[1], 10) : fallbackChapter;
    const formattedFilename = filename.startsWith("Z_") && !filename.startsWith("Z_[")
      ? filename.replace(/^Z_(\d{2})-(\d{2})_/, "Z_[$1-$2]_")
      : filename;
    return `/lkpd/bab${chNum}/audio/${formattedFilename}`;
  };

  // Navigasi Seksi & Pembukaan Review Modal
  const openSectionReview = () => {
    setShowSectionReviewModal(true);
  };

  const proceedNextSection = () => {
    setShowSectionReviewModal(false);
    if (currentSectionIndex < SECTIONS.length - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      setCurrentQIndex(0);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmittingExam(true);
      setShowSectionReviewModal(false);
      // Evaluasi ujian server-side secara aman dan catat ke database
      const res = await fetch("/api/exam-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter,
          studentName: "Peserta CBT",
          answersJson: userAnswers,
          startedAt: new Date(Date.now() - (customMinutes * 60 - timeLeft) * 1000).toISOString(),
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const { verifiedCorrectCount, totalQuestions, answerKeys } = json.data;
        setScore(verifiedCorrectCount !== undefined ? verifiedCorrectCount : 0);

        // Buka kunci jawaban dan penjelasan dari server untuk review siswa
        if (answerKeys) {
          setAllQuestions((prev) =>
            prev.map((q) => {
              const keyInfo = answerKeys[q.id];
              if (keyInfo) {
                return {
                  ...q,
                  answerKey: keyInfo.answerKey,
                  explanation: keyInfo.explanation || q.explanation,
                };
              }
              return q;
            })
          );
        }
      } else {
        // Fallback jika terjadi kegagalan jaringan
        let localCorrect = 0;
        allQuestions.forEach((q) => {
          if (q.answerKey && userAnswers[q.id]?.toLowerCase() === q.answerKey.toLowerCase()) {
            localCorrect++;
          }
        });
        setScore(localCorrect);
      }
    } catch (err) {
      console.error("Gagal mengirim sesi ujian ke server:", err);
      let localCorrect = 0;
      allQuestions.forEach((q) => {
        if (q.answerKey && userAnswers[q.id]?.toLowerCase() === q.answerKey.toLowerCase()) {
          localCorrect++;
        }
      });
      setScore(localCorrect);
    } finally {
      setSubmittingExam(false);
      setIsSubmitted(true);
    }
  };

  // Kontrol Audio Choukai (Maksimal 2 kali putar sesuai Prometric JFT)
  const handleAudioPlay = (qId: number) => {
    const currentPlays = audioPlayCounts[qId] || 0;
    if (currentPlays >= 2) return;
    setAudioPlayCounts((prev) => ({ ...prev, [qId]: currentPlays + 1 }));
    setIsPlayingAudio(true);
  };

  const handleAudioEnded = () => {
    setIsPlayingAudio(false);
  };

  // Mode Guru Auth via Server Verification
  const handleTeacherLogin = async () => {
    if (!teacherPassInput) {
      alert("Silakan masukkan kata sandi guru.");
      return;
    }

    try {
      setIsVerifyingTeacher(true);
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: teacherPassInput }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.token) {
        setTeacherToken(data.token);
        setIsTeacherMode(true);
        setShowTeacherAuthModal(false);
        setTeacherPassInput("");

        const qRes = await fetch(`/api/questions?chapter=${chapter}&includeAnswers=true`, {
          headers: { "x-admin-key": data.token },
        });
        const qData = await qRes.json();
        if (qData.success && qData.data.length > 0) {
          setAllQuestions(qData.data);
        }
      } else {
        alert(data.error || "Kata sandi guru salah. Silakan coba lagi.");
      }
    } catch (err: any) {
      alert("Gagal memverifikasi kata sandi guru: " + err.message);
    } finally {
      setIsVerifyingTeacher(false);
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

  // Keyboard Shortcuts (Pintasan Tombol Prometric Standard)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (showTimerModal || showTeacherAuthModal || isEditing || showSectionReviewModal) return;
      if (!currentQ || isSubmitted) return;

      const key = e.key.toLowerCase();
      if (key === "1" || key === "a") {
        handleSelectOption(currentQ.id, "a");
      } else if (key === "2" || key === "b") {
        handleSelectOption(currentQ.id, "b");
      } else if (key === "3" || key === "c") {
        handleSelectOption(currentQ.id, "c");
      } else if (key === "4" || key === "d") {
        if (currentQ.optionD) {
          handleSelectOption(currentQ.id, "d");
        }
      } else if (key === "arrowright" || key === "n") {
        if (currentQIndex < sectionQuestions.length - 1) {
          setCurrentQIndex((prev) => prev + 1);
        }
      } else if (key === "arrowleft" || key === "p") {
        if (currentQIndex > 0) {
          setCurrentQIndex((prev) => prev - 1);
        }
      } else if (key === "m" || key === "f") {
        toggleFlag(currentQ.id);
      } else if (key === "g") {
        setShowNavGrid((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    currentQ,
    currentQIndex,
    sectionQuestions.length,
    isSubmitted,
    showTimerModal,
    showTeacherAuthModal,
    isEditing,
    showSectionReviewModal,
  ]);

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
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": teacherToken,
        },
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

  // Audio Status Helper
  const audioPlayCount = currentQ ? audioPlayCounts[currentQ.id] || 0 : 0;
  const isAudioLimitReached = audioPlayCount >= 2;

  // Cek apakah stimulus teks harus ditampilkan (Khusus Dokkai, disembunyikan pada Choukai)
  const isDokkai = currentSection.id === "dokkai";
  const isChoukai = currentSection.id === "choukai";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#1a080d]">
        <div className="clay-card p-8 flex flex-col items-center gap-4 text-rose-200">
          <RefreshCw className="w-10 h-10 animate-spin text-rose-400" />
          <p className="font-extrabold text-sm tracking-wide">Menyiapkan Simulator CBT Resmi JFT-Basic...</p>
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
          setFlaggedQuestions({});
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
    <div className="min-h-screen flex flex-col font-sans text-[var(--text-body)] select-none pb-12">
      {/* ========================================================
          1. HEADER JFT-SIMULATION (CLAYMORPHISM LUXURY BURGUNDY)
          ======================================================== */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#25060e]/90 border-b border-rose-950/60 px-4 sm:px-8 py-3 shadow-2xl">
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

          {/* Sisi Kanan: Bantuan Keyboard, Theme Switcher, Mode Guru & Tombol Selesaikan */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowKeyboardHelp(true)}
              title="Pintasan Keyboard (Shortcuts)"
              className="p-1.5 rounded-lg bg-[#330812] hover:bg-[#4a0d1b] text-rose-300/80 hover:text-white border border-rose-900/50 transition hidden md:flex items-center justify-center"
            >
              <Keyboard className="w-4 h-4 text-amber-300/80" />
            </button>

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
                onClick={openSectionReview}
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
              const flaggedSec = allQuestions.filter((q) => q.section === sec.id && !!flaggedQuestions[q.id]).length;

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
                  {flaggedSec > 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] text-amber-400 font-black">
                      <Flag className="w-2.5 h-2.5 fill-amber-400" /> {flaggedSec}
                    </span>
                  )}
                  {answeredSec === totalSec && totalSec > 0 && (
                    <Check className="w-3 h-3 text-emerald-400 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tombol Review Seksi & Drawer Palette Grid */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={openSectionReview}
              className="clay-nav-pill px-3 py-1.5 bg-[#380a15] hover:bg-[#4d0c1c] text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5"
              title="Tinjau Ringkasan Seksi Ini"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ringkasan Seksi</span>
            </button>

            <button
              onClick={() => setShowNavGrid(!showNavGrid)}
              className="clay-btn px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5"
              title="Buka Lembar Daftar Nomor Soal (Shortcut: G)"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Daftar Soal</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. MAIN TEST CONTAINER
          ======================================================== */}
      <main className="max-w-6xl mx-auto w-full flex-1 p-4 sm:p-6 flex flex-col gap-6 mt-2">
        {/* POPUP DRAWER PALETTE NOMOR SOAL */}
        {showNavGrid && (
          <div className="clay-card p-6 border border-rose-400/30 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
              <div>
                <h4 className="font-black text-sm text-amber-300 uppercase tracking-wider flex items-center gap-2">
                  <Grid className="w-4 h-4" /> Navigasi Butir Soal • {currentSection.label}
                </h4>
                <p className="text-[11px] text-rose-300/70 mt-0.5">
                  Klik nomor soal di bawah untuk langsung berpindah ke butir soal tersebut.
                </p>
              </div>
              <button
                onClick={() => setShowNavGrid(false)}
                className="text-rose-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Indikator Status Warna Legenda */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-rose-200/80 bg-[#1c050b] p-2.5 rounded-xl border border-rose-950">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#5c1124] border border-emerald-500/40 inline-block" />
                <span>Terjawab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-[#330812] border border-rose-900/50 inline-block" />
                <span>Belum Dijawab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-amber-500/30 border border-amber-400 flex items-center justify-center text-[8px] text-amber-300">
                  <Flag className="w-2 h-2 fill-amber-400" />
                </span>
                <span>Ditandai untuk Review (Mark)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-rose-600 ring-2 ring-amber-400 inline-block" />
                <span>Sedang Dibuka</span>
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 gap-2 max-h-56 overflow-y-auto p-1">
              {sectionQuestions.map((q, idx) => {
                const isAnswered = !!userAnswers[q.id];
                const isCurrent = idx === currentQIndex;
                const isFlagged = !!flaggedQuestions[q.id];
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
                    className={`h-9 rounded-xl border text-xs font-bold transition flex items-center justify-center relative ${btnStyle}`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center shadow">
                        <Flag className="w-2 h-2 fill-rose-950 text-rose-950" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* LEMBAR SOAL UTAMA (CLAYMORPHISM LUXURY CARD) */}
        {currentQ ? (
          <div className="flex flex-col gap-6">
            {/* JIKA SEKSI DOKKAI: SPLIT-SCREEN 2 KOLOM (BACAAN DI KIRI, SOAL DI KANAN) */}
            {isDokkai && currentQ.stimulusText ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* KOLOM KIRI: STIMULUS BACAAN (WACANA DOKKAI) */}
                <div className="lg:col-span-6 clay-card p-6 sm:p-8 border border-rose-400/20 shadow-2xl flex flex-col gap-4 sticky lg:top-20 max-h-[calc(100vh-140px)] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-[var(--clay-border)] pb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-400" /> 本文 (Teks Bacaan Dokkai)
                    </span>
                    <span className="text-[11px] font-bold text-rose-300/70">
                      Baca cermat wacana berikut
                    </span>
                  </div>

                  <div className="clay-card-light p-6 text-slate-900 font-medium text-sm sm:text-base leading-relaxed whitespace-pre-line border border-rose-200/50 shadow-inner rounded-2xl bg-[#fffaf5]">
                    {currentQ.stimulusText}
                  </div>

                  {currentQ.imageR2Url && (
                    <div className="flex flex-col items-center justify-center p-3 bg-[#2b0811] border border-rose-900/40 rounded-2xl shadow-inner mt-2">
                      <img
                        src={currentQ.imageR2Url}
                        alt="Ilustrasi Bacaan"
                        className="max-h-60 object-contain rounded-xl shadow-lg border border-rose-800/40 bg-white p-2"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* KOLOM KANAN: BUTIR SOAL & PILIHAN JAWABAN */}
                <div className="lg:col-span-6 clay-card p-6 sm:p-8 flex flex-col gap-6 relative border border-rose-400/20 shadow-2xl">
                  {/* Sub-header Soal & Tombol Flag */}
                  <div className="flex items-center justify-between border-b border-[var(--clay-border)] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                        {currentSection.name} • Butir #{currentQ.questionNumber}
                      </span>
                      <span className="text-xs font-bold text-[var(--text-muted)] font-mono">
                        {currentQIndex + 1}/{sectionQuestions.length}
                      </span>
                    </div>

                    {/* Tombol Mark / Flag for Review */}
                    <button
                      onClick={() => toggleFlag(currentQ.id)}
                      title="Tandai butir ini untuk ditinjau nanti (Shortcut: M atau F)"
                      className={`clay-nav-pill px-3 py-1 text-xs font-black transition flex items-center gap-1.5 border ${
                        flaggedQuestions[currentQ.id]
                          ? "bg-amber-400 text-rose-950 border-amber-300 shadow-md ring-1 ring-amber-400"
                          : "bg-[#330812] text-amber-300/80 hover:text-amber-300 border-rose-900/50 hover:bg-[#4a0d1b]"
                      }`}
                    >
                      <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[currentQ.id] ? "fill-rose-950" : ""}`} />
                      <span>{flaggedQuestions[currentQ.id] ? "マーク済 (Ditandai)" : "マーク (Tandai)"}</span>
                    </button>
                  </div>

                  {/* Teks Pertanyaan */}
                  <div className="text-base sm:text-lg font-black leading-relaxed whitespace-pre-line cbt-question-text">
                    {currentQ.questionText}
                  </div>

                  {/* Pilihan Jawaban */}
                  <div className="flex flex-col gap-3.5 pt-2">
                    {options.map((opt) => {
                      const isSelected = userAnswers[currentQ.id]?.toLowerCase() === opt.letter;
                      const isCorrect = isSubmitted && currentQ.answerKey.toLowerCase() === opt.letter;
                      const isWrong = isSubmitted && isSelected && !isCorrect;

                      let optClass = "bg-[#330812] border-rose-900/40 text-white font-medium hover:bg-[#4a0d1b] hover:border-rose-500/50";
                      if (isSelected && !isSubmitted) {
                        optClass = "bg-gradient-to-r from-rose-700 to-rose-800 text-white border-amber-400 shadow-xl ring-2 ring-amber-400/40 scale-[1.01]";
                      } else if (isCorrect) {
                        optClass = "bg-emerald-600/90 text-white border-emerald-400 ring-2 ring-emerald-400 shadow-lg";
                      } else if (isWrong) {
                        optClass = "bg-rose-950 text-white border-rose-500 ring-2 ring-rose-500";
                      }

                      return (
                        <button
                          key={opt.letter}
                          onClick={() => handleSelectOption(currentQ.id, opt.letter)}
                          className={`w-full text-left p-4 rounded-2xl border text-sm font-semibold transition flex items-center justify-between gap-4 ${optClass}`}
                        >
                          <div className="flex items-center gap-3.5">
                            <span className="w-8 h-8 rounded-xl bg-black/40 border border-white/20 text-white flex items-center justify-center font-black text-xs uppercase shrink-0 shadow-inner">
                              {opt.letter}
                            </span>
                            <span className="whitespace-pre-line leading-relaxed text-white font-semibold">{opt.text}</span>
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

                  {/* Navigasi Soal Bawah */}
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--clay-border)]">
                    <button
                      onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentQIndex === 0}
                      className="clay-nav-pill px-5 py-2.5 bg-[#330812] border border-rose-900/50 text-white font-bold text-xs hover:bg-[#4a0d1b] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1.5"
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
              </div>
            ) : (
              /* SEKSI MOJI-GOI, KAIWA-HYOUGEN & CHOUKAI (FULL WIDTH LUXURY CARD) */
              <div className="clay-card p-6 sm:p-10 flex flex-col gap-6 relative border border-rose-400/20 shadow-2xl">
                {/* Sub-header Soal & Tombol Flag */}
                <div className="flex items-center justify-between border-b border-[var(--clay-border)] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                      {currentSection.name} • Butir #{currentQ.questionNumber}
                    </span>
                    <span className="text-xs font-bold text-[var(--text-muted)] font-mono">
                      Soal {currentQIndex + 1} dari {sectionQuestions.length}
                    </span>
                  </div>

                  {/* Tombol Mark / Flag for Review */}
                  <button
                    onClick={() => toggleFlag(currentQ.id)}
                    title="Tandai butir ini untuk ditinjau nanti (Shortcut: M atau F)"
                    className={`clay-nav-pill px-3.5 py-1.5 text-xs font-black transition flex items-center gap-1.5 border ${
                      flaggedQuestions[currentQ.id]
                        ? "bg-amber-400 text-rose-950 border-amber-300 shadow-md ring-1 ring-amber-400"
                        : "bg-[#330812] text-amber-300/80 hover:text-amber-300 border-rose-900/50 hover:bg-[#4a0d1b]"
                    }`}
                  >
                    <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[currentQ.id] ? "fill-rose-950" : ""}`} />
                    <span>{flaggedQuestions[currentQ.id] ? "マーク済 (Ditandai)" : "マーク (Tandai)"}</span>
                  </button>
                </div>

                {/* KHUSUS CHOUKAI: PERINGATAN RESMI PROMETRIC (NASKAH DIRAHASIAKAN SELAMA UJIAN) */}
                {isChoukai && (
                  <div className="clay-card-light p-3.5 text-slate-900 text-xs font-bold flex items-center gap-2 bg-[#fffdf0] border border-amber-300/80 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      【聴解試験】音声をよく聴いて質問に答えてください。(Transkrip audio dirahasiakan selama ujian dan akan tampil pada Lembar Evaluasi).
                    </span>
                  </div>
                )}

                {/* AUDIO CONTROLLER (CHOUKAI - STANDAR RESMI MAKSIMAL 2 KALI PUTAR) */}
                {currentQ.audioR2Url && (
                  <div className="clay-card p-5 border border-rose-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-[#2c0812] to-[#3a0b18]">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-lg ${
                        isPlayingAudio
                          ? "bg-gradient-to-br from-amber-400 to-amber-600 animate-pulse"
                          : isAudioLimitReached
                          ? "bg-gray-700 text-gray-400"
                          : "bg-gradient-to-br from-rose-500 to-rose-700"
                      }`}>
                        <Volume2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white flex items-center gap-2">
                          <span>音声再生 (Audio Menyimak)</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            isAudioLimitReached
                              ? "bg-rose-950/80 text-rose-300 border-rose-800"
                              : audioPlayCount === 1
                              ? "bg-sky-950/80 text-sky-300 border-sky-800"
                              : "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                          }`}>
                            {audioPlayCount === 0 && "未再生 (2 Kesempatan)"}
                            {audioPlayCount === 1 && (isPlayingAudio ? "1回目再生中..." : "1回再生済 (Sisa 1x)")}
                            {audioPlayCount >= 2 && "再生完了 (2/2 - Maksimal)"}
                          </span>
                        </div>
                        <div className="text-[11px] text-rose-200/80 font-medium mt-1">
                          {isAudioLimitReached
                            ? "⚠️ Batas maksimal putar audio tercapai (2 kali sesuai standar JFT)."
                            : `Anda dapat memutar audio sebanyak ${2 - audioPlayCount} kali lagi.`}
                        </div>
                      </div>
                    </div>

                    <audio
                      controls
                      src={resolveAudioUrl(currentQ.audioR2Url, currentQ.chapter)}
                      onError={(e) => {
                        const target = e.currentTarget;
                        const filename = currentQ.audioR2Url?.split("/").pop() || "";
                        const match = filename.match(/Z_\[?(\d{1,2})-\d{1,2}\]?/);
                        const chNum = match ? parseInt(match[1], 10) : currentQ.chapter;
                        const formattedFilename = filename.startsWith("Z_") && !filename.startsWith("Z_[")
                          ? filename.replace(/^Z_(\d{2})-(\d{2})_/, "Z_[$1-$2]_")
                          : filename;
                        const localSrc = `/lkpd/bab${chNum}/audio/${formattedFilename}`;
                        if (!target.src.endsWith(localSrc)) {
                          target.src = localSrc;
                        }
                      }}
                      onPlay={(e) => {
                        if (isAudioLimitReached) {
                          e.currentTarget.pause();
                          alert("Batas maksimal mendengarkan audio untuk butir soal ini adalah 2 kali (Regulasi Resmi Prometric JFT-Basic).");
                          return;
                        }
                        handleAudioPlay(currentQ.id);
                      }}
                      onEnded={handleAudioEnded}
                      className="w-full sm:w-64 h-10 rounded-xl outline-none"
                      preload="metadata"
                    >
                      Browser Anda tidak mendukung elemen audio.
                    </audio>
                  </div>
                )}

                {/* GAMBAR ILUSTRASI RESMI JFT */}
                {currentQ.imageR2Url && (
                  <div className="flex flex-col items-center justify-center p-4 bg-[#2b0811] border border-rose-900/40 rounded-2xl shadow-inner">
                    <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
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

                {/* TEKS SOAL (DENGAN WHITE-SPACE PRE-LINE SESUAI ENTER/NEWLINE ASLI) */}
                <div className="text-base sm:text-lg font-black leading-relaxed whitespace-pre-line cbt-question-text">
                  {currentQ.questionText}
                </div>

                {/* DAFTAR OPSI JAWABAN (A, B, C, D) */}
                <div className="flex flex-col gap-3.5 pt-2">
                  {options.map((opt) => {
                    const isSelected = userAnswers[currentQ.id]?.toLowerCase() === opt.letter;
                    const isCorrect = isSubmitted && currentQ.answerKey.toLowerCase() === opt.letter;
                    const isWrong = isSubmitted && isSelected && !isCorrect;

                    let optClass = "bg-[#330812] border-rose-900/40 text-white font-medium hover:bg-[#4a0d1b] hover:border-rose-500/50";
                    if (isSelected && !isSubmitted) {
                      optClass = "bg-gradient-to-r from-rose-700 to-rose-800 text-white border-amber-400 shadow-xl ring-2 ring-amber-400/40 scale-[1.01]";
                    } else if (isCorrect) {
                      optClass = "bg-emerald-600/90 text-white border-emerald-400 ring-2 ring-emerald-400 shadow-lg";
                    } else if (isWrong) {
                      optClass = "bg-rose-950 text-white border-rose-500 ring-2 ring-rose-500";
                    }

                    return (
                      <button
                        key={opt.letter}
                        onClick={() => handleSelectOption(currentQ.id, opt.letter)}
                        className={`w-full text-left p-4 rounded-2xl border text-sm font-semibold transition flex items-center justify-between gap-4 ${optClass}`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="w-8 h-8 rounded-xl bg-black/40 border border-white/20 text-white flex items-center justify-center font-black text-xs uppercase shrink-0 shadow-inner">
                            {opt.letter}
                          </span>
                          <span className="whitespace-pre-line leading-relaxed text-white font-semibold">{opt.text}</span>
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

                {/* NAVIGASI SEBELUMNYA / SELANJUTNYA */}
                <div className="flex items-center justify-between pt-4 border-t border-[var(--clay-border)]">
                  <button
                    onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                    disabled={currentQIndex === 0}
                    className="clay-nav-pill px-5 py-2.5 bg-[#330812] border border-rose-900/50 text-white font-bold text-xs hover:bg-[#4a0d1b] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1.5"
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
            )}
          </div>
        ) : null}
      </main>

      {/* ========================================================
          4. MODAL REVIEW SEKSI RESMI (SECTION REVIEW SCREEN)
          ======================================================== */}
      {showSectionReviewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="clay-card p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col gap-6 border border-rose-400/30">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-4">
              <div>
                <h3 className="font-black text-amber-300 text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" /> Ringkasan Status • {currentSection.name}: {currentSection.label}
                </h3>
                <p className="text-xs text-rose-300/80 mt-1">
                  {currentSection.desc}
                </p>
              </div>
              <button
                onClick={() => setShowSectionReviewModal(false)}
                className="text-rose-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Statistik Ringkasan Seksi */}
            {(() => {
              const totalSec = sectionQuestions.length;
              const answeredSec = sectionQuestions.filter((q) => !!userAnswers[q.id]).length;
              const unansweredSec = totalSec - answeredSec;
              const flaggedSec = sectionQuestions.filter((q) => !!flaggedQuestions[q.id]).length;

              return (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="clay-card p-3.5 border border-rose-900/60 flex flex-col items-center text-center">
                      <span className="text-[11px] font-bold text-rose-300/80">Total Soal</span>
                      <span className="text-xl font-black text-white mt-1">{totalSec}</span>
                    </div>
                    <div className="clay-card p-3.5 border border-emerald-500/40 bg-emerald-950/20 flex flex-col items-center text-center">
                      <span className="text-[11px] font-bold text-emerald-400">Terjawab</span>
                      <span className="text-xl font-black text-emerald-300 mt-1">{answeredSec}</span>
                    </div>
                    <div className={`clay-card p-3.5 border flex flex-col items-center text-center ${
                      unansweredSec > 0 ? "border-amber-500/50 bg-amber-950/30" : "border-rose-900/60"
                    }`}>
                      <span className={`text-[11px] font-bold ${unansweredSec > 0 ? "text-amber-300" : "text-rose-300/80"}`}>
                        Belum Dijawab
                      </span>
                      <span className={`text-xl font-black mt-1 ${unansweredSec > 0 ? "text-amber-400" : "text-white"}`}>
                        {unansweredSec}
                      </span>
                    </div>
                    <div className="clay-card p-3.5 border border-amber-400/40 bg-amber-950/20 flex flex-col items-center text-center">
                      <span className="text-[11px] font-bold text-amber-400">Ditandai (Mark)</span>
                      <span className="text-xl font-black text-amber-300 mt-1">{flaggedSec}</span>
                    </div>
                  </div>

                  {unansweredSec > 0 && (
                    <div className="clay-card-light p-3.5 bg-[#fff8e7] border border-amber-400/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-950 font-medium">
                      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-amber-900">Perhatian:</span> Masih ada <strong>{unansweredSec} butir soal</strong> yang belum Anda jawab pada seksi ini. Pada tes Prometric JFT-Basic resmi, jawaban kosong bernilai 0. Pastikan Anda memeriksa kembali sebelum melanjutkan.
                      </div>
                    </div>
                  )}

                  {/* Grid Daftar Soal dengan Status Langsung */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                      Daftar Butir & Status Jawaban:
                    </span>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-1">
                      {sectionQuestions.map((q, idx) => {
                        const isAnswered = !!userAnswers[q.id];
                        const isFlagged = !!flaggedQuestions[q.id];

                        let cellClass = isAnswered
                          ? "bg-[#5c1124] text-emerald-300 border-emerald-500/40"
                          : "bg-[#25060e] text-rose-400/70 border-rose-900/50";

                        return (
                          <button
                            key={q.id}
                            onClick={() => {
                              setCurrentQIndex(idx);
                              setShowSectionReviewModal(false);
                            }}
                            className={`h-9 rounded-xl border text-xs font-bold transition flex items-center justify-center relative hover:scale-105 ${cellClass}`}
                            title={`Soal #${idx + 1}: ${isAnswered ? `Terjawab (${userAnswers[q.id].toUpperCase()})` : "Belum dijawab"}${isFlagged ? " • Ditandai" : ""}`}
                          >
                            <span>{idx + 1}</span>
                            {isFlagged && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center shadow">
                                <Flag className="w-2 h-2 fill-rose-950 text-rose-950" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--clay-border)]">
              <button
                onClick={() => setShowSectionReviewModal(false)}
                className="clay-nav-pill px-5 py-2.5 bg-[#330812] hover:bg-[#4a0d1b] text-white font-bold text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Kembali Periksa Soal
              </button>

              <button
                onClick={proceedNextSection}
                disabled={submittingExam}
                className="clay-btn px-6 py-2.5 rounded-full text-white font-black text-xs shadow-xl flex items-center gap-1.5"
              >
                {currentSectionIndex === SECTIONS.length - 1 ? (
                  submittingExam ? "Menilai Ujian..." : "Kirim & Akhiri Ujian Sekarang ✓"
                ) : (
                  <>Lanjut ke {SECTIONS[currentSectionIndex + 1].label} ➔</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          5. MODAL PINTASAN KEYBOARD (KEYBOARD SHORTCUTS HELP)
          ======================================================== */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="clay-card p-6 sm:p-8 max-w-md w-full shadow-2xl flex flex-col gap-5 border border-rose-400/30">
            <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
              <h3 className="font-black text-amber-300 text-base flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-amber-400" /> Pintasan Keyboard CBT
              </h3>
              <button onClick={() => setShowKeyboardHelp(false)} className="text-rose-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-rose-200/80 leading-relaxed">
              Anda dapat mengoperasikan simulasi CBT ini layaknya ujian komputer resmi tanpa mouse:
            </p>

            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#25060e] border border-rose-900/40">
                <span className="text-white font-medium">Pilih Opsi A / B / C / D</span>
                <span className="font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-rose-800">
                  A / B / C / D atau 1 / 2 / 3 / 4
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#25060e] border border-rose-900/40">
                <span className="text-white font-medium">Soal Berikutnya</span>
                <span className="font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-rose-800">
                  ➔ (Panah Kanan) atau N
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#25060e] border border-rose-900/40">
                <span className="text-white font-medium">Soal Sebelumnya</span>
                <span className="font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-rose-800">
                  ⬅ (Panah Kiri) atau P
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#25060e] border border-rose-900/40">
                <span className="text-white font-medium">Tandai Soal (Mark / Flag)</span>
                <span className="font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-rose-800">
                  M atau F
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#25060e] border border-rose-900/40">
                <span className="text-white font-medium">Buka / Tutup Daftar Soal</span>
                <span className="font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-rose-800">
                  G
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowKeyboardHelp(false)}
              className="w-full py-2.5 clay-btn rounded-xl text-xs font-black"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          6. MODAL SETTING TIMER
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

            <p className="text-xs text-[var(--text-body)] opacity-90 leading-relaxed">
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
                      : "bg-[#330812] text-white border-rose-900/50 hover:bg-[#4a0d1b]"
                  }`}
                >
                  {mins} Menit
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--clay-border)] text-xs">
              <span className="font-bold text-[var(--text-heading)]">Status Timer:</span>
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
          7. MODAL LOGIN GURU (TEACHER AUTH)
          ======================================================== */}
      {showTeacherAuthModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="clay-card p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col gap-5 border border-rose-400/30">
            <div className="flex items-center justify-between border-b border-[var(--clay-border)] pb-3">
              <h3 className="font-black text-amber-300 text-base flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" /> Login Guru / Pengajar
              </h3>
              <button onClick={() => setShowTeacherAuthModal(false)} className="text-rose-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-body)] opacity-90 leading-relaxed">
              Masukkan kata sandi guru / pengajar untuk mengaktifkan editing langsung.
            </p>

            <input
              type="password"
              placeholder="Masukkan kata sandi guru..."
              value={teacherPassInput}
              onChange={(e) => setTeacherPassInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTeacherLogin()}
              className="w-full px-4 py-3 rounded-xl bg-[#25060e] border border-rose-800/60 text-sm font-semibold text-white outline-none focus:border-amber-400"
              autoFocus
            />

            <button
              onClick={handleTeacherLogin}
              disabled={isVerifyingTeacher}
              className="w-full py-3 clay-btn rounded-xl text-xs font-black shadow-lg disabled:opacity-50"
            >
              {isVerifyingTeacher ? "Memverifikasi..." : "Masuk Mode Guru"}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          8. MODAL EDIT SOAL (TEACHER INLINE EDITOR)
          ======================================================== */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="clay-card p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col gap-5 border border-rose-400/40">
            <div className="flex items-center justify-between border-b border-[var(--clay-border)] pb-3">
              <h3 className="font-black text-amber-300 text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" /> Edit Butir Soal #{currentQ.questionNumber} ({currentQ.section.toUpperCase()})
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-rose-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs font-bold text-[var(--text-heading)]">
              {/* Teks Soal */}
              <div>
                <label className="mb-1 block text-amber-300">Teks Soal / Pertanyaan:</label>
                <textarea
                  rows={3}
                  value={editForm.questionText || ""}
                  onChange={(e) => setEditForm({ ...editForm, questionText: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#25060e] border border-rose-800 text-sm font-medium text-white outline-none focus:border-amber-400 whitespace-pre-line"
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
                  className="w-full p-2.5 rounded-xl bg-[#25060e] border border-rose-800 font-mono text-xs text-white outline-none focus:border-amber-400"
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
                  className="w-full p-2.5 rounded-xl bg-[#25060e] border border-rose-800 font-mono text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* Stimulus */}
              <div>
                <label className="mb-1 block">Stimulus / Wacana Bacaan (Dokkai) / Transkrip:</label>
                <textarea
                  rows={3}
                  value={editForm.stimulusText || ""}
                  onChange={(e) => setEditForm({ ...editForm, stimulusText: e.target.value })}
                  className="w-full p-3 rounded-xl bg-[#25060e] border border-rose-800 text-xs font-medium text-white outline-none focus:border-amber-400 whitespace-pre-line"
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
                    className="w-full p-2.5 rounded-xl bg-[#25060e] border border-rose-800 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block">Opsi B:</label>
                  <input
                    type="text"
                    value={editForm.optionB || ""}
                    onChange={(e) => setEditForm({ ...editForm, optionB: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#25060e] border border-rose-800 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block">Opsi C:</label>
                  <input
                    type="text"
                    value={editForm.optionC || ""}
                    onChange={(e) => setEditForm({ ...editForm, optionC: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#25060e] border border-rose-800 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block">Opsi D:</label>
                  <input
                    type="text"
                    value={editForm.optionD || ""}
                    onChange={(e) => setEditForm({ ...editForm, optionD: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#25060e] border border-rose-800 text-xs text-white outline-none focus:border-amber-400"
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

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--clay-border)]">
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl bg-[#330812] text-white font-bold text-xs hover:bg-[#4a0d1b]"
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
