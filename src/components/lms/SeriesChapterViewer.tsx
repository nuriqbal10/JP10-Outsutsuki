"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  FileText,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Layers,
  GraduationCap,
  Play,
  RotateCcw,
  Check,
  Copy,
  Puzzle,
  Share2,
  Search,
  Edit3,
  Printer,
  Target,
  HelpCircle,
  User,
  Send,
  AlertCircle,
  Menu,
  PanelLeft,
  ExternalLink,
  Download,
  Compass,
} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LmsSidebar from "@/components/lms/LmsSidebar";
import { getChapterInfo, getCourseById } from "@/data/coursesCatalog";
import rawBunpouData from "@/data/bunpouData.json";
import { BunpouItem } from "@/types/bunpou";
import { playNativeJapaneseAudio } from "@/lib/nativeVoiceEngine";
import {
  A1_CBT_QUESTIONS,
  A21_CBT_QUESTIONS,
  SERIES_LKPD_CATALOG,
  SeriesQuestionItem,
  SeriesLkpdData,
} from "@/data/seriesModulesData";

interface SeriesChapterViewerProps {
  courseId: "irodori-a1" | "irodori-a2-1";
  chapterNum: number;
}

interface VocabItem {
  id: number;
  chapter: number;
  midashi: string;
  yomi: string;
  accent: string | null;
  romaji: string | null;
  idArti: string;
  enMeaning: string | null;
  pos: string | null;
  info: string | null;
  audioR2Url: string | null;
}

export default function SeriesChapterViewer({
  courseId,
  chapterNum,
}: SeriesChapterViewerProps) {
  const rawCourse = getCourseById(courseId);
  const course = rawCourse || {
    id: courseId,
    title: courseId === "irodori-a1" ? "Irodori A1 Starter" : "Irodori A2.1 Elementary 1",
    subTitle: "Bahasa Jepang untuk Kehidupan",
    level: courseId === "irodori-a1" ? "入門 (A1)" : "初級1 (A2.1)",
    levelCode: (courseId === "irodori-a1" ? "a1" : "a2-1") as "a1" | "a2-1",
    href: `/lms/${courseId}`,
    badge: courseId === "irodori-a1" ? "Dasar A1" : "Dasar A2.1",
    badgeColor: courseId === "irodori-a1" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-sky-500/20 text-sky-400 border-sky-500/30",
    chaptersCount: 18,
  };

  const rawChapter = getChapterInfo(courseId, chapterNum);
  const chapter = rawChapter || {
    num: chapterNum,
    title: `Bab ${chapterNum}`,
    subTitle: `Materi Pelajaran ${chapterNum}`,
    topic: "Komunikasi dan Kehidupan Kerja di Jepang",
    canDo: `Mampu memahami dan menerapkan ungkapan praktis pada Bab ${chapterNum}.`,
    grammarPoints: ["Ungkapan dasar"],
    vocabCount: 65,
  };

  // Sidebar LMS State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // 4 PILAR TAB ALA MOODLE PERSIS A2.2
  const [activeTab, setActiveTab] = useState<"modul" | "kotoba" | "lkpd" | "latihan">("modul");
  const [viewMode, setViewMode] = useState<"pdf" | "summary">("pdf");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  // Database Kosakata State
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [vocabLoading, setVocabLoading] = useState(true);
  const [searchVocab, setSearchVocab] = useState("");

  // Kuis Interaktif State
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  // LKPD Form State
  const [studentName, setStudentName] = useState("Peserta Didik");
  const [studentClass, setStudentClass] = useState("Otsutsuki Class");
  const [lkpdDrillAnswers, setLkpdDrillAnswers] = useState<Record<number, string>>({});
  const [lkpdSavedNotice, setLkpdSavedNotice] = useState(false);

  // Filter grammar points for this level and chapter
  const levelCode = course?.levelCode || "a1";
  const chapterBunpou = useMemo(() => {
    return (rawBunpouData as BunpouItem[]).filter(
      (b) => b.level === levelCode && b.lesson === chapterNum
    );
  }, [levelCode, chapterNum]);

  // PDF URL for official Irodori textbook
  const pdfUrl =
    courseId === "irodori-a1"
      ? `/modul/a1/bab${chapterNum}.pdf`
      : `/modul/a2-1/bab${chapterNum}.pdf`;

  // Fetch real vocabularies from Database
  useEffect(() => {
    async function loadVocabularies() {
      try {
        setVocabLoading(true);
        const dbLevelParam = levelCode === "a1" ? "入門" : "初級1";
        const res = await fetch(`/api/vocabularies?chapter=${chapterNum}&level=${encodeURIComponent(dbLevelParam)}`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setVocabList(json.data);
        } else {
          setVocabList([]);
        }
      } catch (err) {
        console.error("Gagal memuat kosakata:", err);
      } finally {
        setVocabLoading(false);
      }
    }
    loadVocabularies();
  }, [levelCode, chapterNum]);

  // Load Saved Identity
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("irodori_student_name");
      const savedClass = localStorage.getItem("irodori_student_class");
      if (savedName) setStudentName(savedName);
      if (savedClass) setStudentClass(savedClass);
    }
  }, []);

  const speak = (text: string, index?: number) => {
    if (typeof index === "number") {
      setPlayingIndex(index);
    }
    playNativeJapaneseAudio(text, {
      rate: 0.92,
      onStart: () => {
        if (typeof index === "number") setPlayingIndex(index);
      },
      onEnd: () => {
        if (typeof index === "number") setPlayingIndex(null);
      },
      onError: () => {
        if (typeof index === "number") setPlayingIndex(null);
      },
    });
  };

  const handleCopy = (item: BunpouItem) => {
    const text = `【${item.levelJapanese} - Bab ${item.lesson}】 ${item.pattern}\nArti: ${item.meaning || ""}\nRumus: ${item.formulaDetailed || item.pattern}\nContoh:\n${item.example}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSaveLkpd = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("irodori_student_name", studentName);
      localStorage.setItem("irodori_student_class", studentClass);
      localStorage.setItem(`lkpd_${levelCode}_bab${chapterNum}`, JSON.stringify(lkpdDrillAnswers));
      setLkpdSavedNotice(true);
      setTimeout(() => setLkpdSavedNotice(false), 3000);
    }
  };

  const handlePrintLkpd = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Filtered Vocabularies
  const filteredVocab = useMemo(() => {
    if (!searchVocab.trim()) return vocabList;
    const q = searchVocab.toLowerCase();
    return vocabList.filter(
      (v) =>
        v.midashi.toLowerCase().includes(q) ||
        v.yomi.toLowerCase().includes(q) ||
        v.idArti.toLowerCase().includes(q) ||
        (v.romaji && v.romaji.toLowerCase().includes(q))
    );
  }, [vocabList, searchVocab]);

  // CBT questions for this chapter
  const rawQuestions =
    courseId === "irodori-a1"
      ? A1_CBT_QUESTIONS[chapterNum]
      : A21_CBT_QUESTIONS[chapterNum];

  const chapterQuestions: SeriesQuestionItem[] =
    rawQuestions && rawQuestions.length > 0
      ? rawQuestions
      : [
          {
            id: 9901,
            chapter: chapterNum,
            section: "moji_goi",
            questionNumber: 1,
            questionText: `Bagaimanakah penulisan dan pelafalan kosakata inti pada Bab ${chapterNum} (${chapter.title})?`,
            optionA: chapter.title,
            optionB: chapter.subTitle,
            optionC: "わかりません",
            optionD: "失礼します",
            answerKey: "A",
            explanation: `Pilihan A adalah judul resmi dari Bab ${chapterNum}: ${chapter.title}.`,
          },
          {
            id: 9902,
            chapter: chapterNum,
            section: "kaiwa_hyougen",
            questionNumber: 2,
            questionText: `Pilihlah ungkapan percakapan yang sesuai dengan situasi kerja pada topik: "${chapter.topic}"!`,
            optionA: chapter.grammarPoints[0] || "よろしくお願いします",
            optionB: "さようなら",
            optionC: "いいえ、ちがいます",
            optionD: "おやすみなさい",
            answerKey: "A",
            explanation: `Pola tata bahasa utama yang diajarkan pada bab ini adalah: ${chapter.grammarPoints[0] || "ungkapan santun"}.`,
          },
          {
            id: 9903,
            chapter: chapterNum,
            section: "choukai",
            questionNumber: 3,
            questionText: "Dengarkan audio berikut! Pilihlah kalimat yang dilafalkan penutur:",
            audioText: chapter.title,
            optionA: chapter.title,
            optionB: "おはようございます",
            optionC: "ありがとうございます",
            optionD: "おつかれさまでした",
            answerKey: "A",
            explanation: `Audio melafalkan ungkapan: ${chapter.title}.`,
          },
          {
            id: 9904,
            chapter: chapterNum,
            section: "dokkai",
            questionNumber: 4,
            stimulusText: `【掲示板・Papan Pengumuman Bab ${chapterNum}】\nテーマ：${chapter.title}\n${chapter.canDo}`,
            questionText: `Berdasarkan teks pengumuman di atas, target capaian Can-Do apakah yang dilatih?`,
            optionA: chapter.canDo.slice(0, 50) + "...",
            optionB: "Tidak ada target yang ditentukan",
            optionC: "Hanya untuk siswa tingkat mahir",
            optionD: "Instruksi tidak lengkap",
            answerKey: "A",
            explanation: `Target Can-Do resmi bab ini adalah: ${chapter.canDo}.`,
          },
        ];

  // LKPD data for this chapter
  const lkpdData: SeriesLkpdData =
    SERIES_LKPD_CATALOG[courseId]?.[chapterNum] || {
      chapter: chapterNum,
      level: levelCode as "a1" | "a2-1",
      titleJa: `第${chapterNum}課「${chapter.title}」`,
      titleId: chapter.subTitle,
      topic: chapter.topic,
      canDoObjectives: [
        chapter.canDo,
        "Mampu menggunakan pola tata bahasa bab ini dalam komunikasi kerja di Jepang.",
        "Mampu memahami instruksi lisan dan membaca informasi otentik terkait.",
        "Mampu mengenali huruf dan kosakata tematik pada papan pengumuman/lingkungan kerja.",
      ],
      kanaOrKanjiDrill: [
        {
          character: levelCode === "a1" ? "日" : "本",
          reading: levelCode === "a1" ? "にち / ひ" : "ほん",
          meaning: levelCode === "a1" ? "Hari / Matahari" : "Buku / Asal",
          sampleWord: levelCode === "a1" ? "日本 (Nihon)" : "日本語 (Nihongo)",
        },
      ],
      grammarDrill: [
        {
          prompt: `Gunakan pola kalimat utama Bab ${chapterNum} untuk membuat satu kalimat lengkap.`,
          pattern: chapter.grammarPoints[0] || "Pola Kalimat Dasar",
          sampleAnswer: `例：${chapter.title}。`,
        },
      ],
      translationDrill: [
        {
          ja: chapter.title,
          id: chapter.subTitle,
          situation: "Percakapan pengantar bab",
        },
      ],
      reflectionPrompts: [
        `Apakah Anda sudah menguasai target: "${chapter.canDo}"? Tuliskan hal yang sudah dipahami dan hal yang masih perlu dilatih!`,
      ],
    };

  // Score calculation for CBT Quiz
  const quizScore = useMemo(() => {
    let correct = 0;
    chapterQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.answerKey) {
        correct++;
      }
    });
    return {
      correct,
      total: chapterQuestions.length,
      percentage: Math.round((correct / chapterQuestions.length) * 100),
    };
  }, [chapterQuestions, userAnswers]);

  return (
    <div className="flex min-h-screen font-sans text-[var(--text-body)]">
      {/* ========================================================
          1. SIDEBAR NAVIGASI LMS OUTSUTSUKI RESMI
          ======================================================== */}
      <LmsSidebar
        currentChapter={chapterNum}
        courseLevel={levelCode as "a1" | "a2-1" | "a2-2"}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* ========================================================
          2. MAIN CONTENT AREA DENGAN TOP BAR LENGKAP
          ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* HEADER BAR */}
        <header className="clay-card border-b border-black/10 dark:border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md rounded-none">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-black/5 dark:bg-black/40 border border-current/20 hover:scale-105 transition"
              title="Buka Menu"
            >
              <Menu className="w-5 h-5 text-amber-500" />
            </button>

            {/* Desktop collapse toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/5 dark:bg-black/40 border border-current/20 hover:scale-105 transition text-xs font-bold"
              title={sidebarOpen ? "Perlebar Area Baca (Sembunyikan Sidebar)" : "Buka Navigasi Bab"}
            >
              <PanelLeft className="w-4 h-4 text-amber-500" />
              <span className="hidden xl:inline">{sidebarOpen ? "Perlebar Baca" : "Menu Bab"}</span>
            </button>

            <Link
              href={course.href}
              className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider opacity-80 hover:opacity-100 transition uppercase ml-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-500" /> <span className="hidden sm:inline">Silabus</span>
            </Link>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold tracking-wide truncate ml-2">
              <span className="truncate">第{chapterNum}課 • {chapter.title}</span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 hidden md:inline shrink-0">
                大筒木クラス
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ThemeSwitcher />
            <Link
              href="/cbt"
              className="clay-btn-gold px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-1 shadow-md hover:scale-105 shrink-0"
            >
              Ujian CBT <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* 4 PILAR TAB NAVIGATION ALA MOODLE (PERSIS A2.2) */}
        <div className="clay-card border-b border-black/10 dark:border-white/10 px-4 sm:px-6 py-3 sticky top-[65px] z-20 backdrop-blur-md rounded-none">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
              <button
                onClick={() => setActiveTab("modul")}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shrink-0 ${
                  activeTab === "modul"
                    ? "bg-amber-600 text-white shadow-lg border border-amber-300"
                    : "clay-btn opacity-85 hover:opacity-100"
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-200" />
                1. Modul Slide & Materi
              </button>
              <button
                onClick={() => setActiveTab("kotoba")}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shrink-0 ${
                  activeTab === "kotoba"
                    ? "bg-amber-600 text-white shadow-lg border border-amber-300"
                    : "clay-btn opacity-85 hover:opacity-100"
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-200" />
                2. Kotoba Irodori ({vocabList.length || chapter.vocabCount})
              </button>
              <button
                onClick={() => setActiveTab("lkpd")}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shrink-0 ${
                  activeTab === "lkpd"
                    ? "bg-amber-600 text-white shadow-lg border border-amber-300"
                    : "clay-btn opacity-85 hover:opacity-100"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                3. LKPD Lembar Kerja Siswa
              </button>
              <button
                onClick={() => setActiveTab("latihan")}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shrink-0 ${
                  activeTab === "latihan"
                    ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 border border-amber-400"
                    : "clay-btn text-rose-200/80 hover:text-white"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                4. Latihan Kuis CBT ({chapterQuestions.length})
              </button>
            </div>
            <div className="hidden sm:block text-xs font-bold text-rose-300/70 truncate max-w-xs">
              {chapter.topic}
            </div>
          </div>
        </div>

        {/* MAIN CONTAINER CONTENT */}
        <main className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col gap-6 w-full">
          {/* ========================================================
              TAB 1: MODUL RESMI IRODORI (PDF VIEWER & RANGKUMAN BUNPOU)
              ======================================================== */}
          {activeTab === "modul" && (
            <div className="flex flex-col gap-6 font-sans">
              {/* HEADER MODUL PEMBELAJARAN RESMI */}
              <div className="clay-card rounded-3xl p-6 sm:p-8 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rose-950/80 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner">
                      <BookOpen className="w-6 h-6 stroke-[2.5]" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-[#24060E] px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          MODUL PEMBELAJARAN IRODORI RESMI
                        </span>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          Level {course.level} (The Japan Foundation)
                        </span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-black text-amber-100 mt-1">
                        第{chapterNum}課「{chapter.title}」• {chapter.topic || chapter.subTitle}
                      </h2>
                    </div>
                  </div>

                  {/* Mode Switcher & Quick Actions */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-[#1B050E] p-1 rounded-2xl border border-rose-900/60 shadow-inner">
                      <button
                        onClick={() => setViewMode("pdf")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                          viewMode === "pdf"
                            ? "bg-rose-700 text-white shadow-md border border-amber-400/50"
                            : "text-rose-200/80 hover:text-white"
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Buku PDF Asli</span>
                      </button>
                      <button
                        onClick={() => setViewMode("summary")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                          viewMode === "summary"
                            ? "bg-rose-700 text-white shadow-md border border-amber-400/50"
                            : "text-rose-200/80 hover:text-white"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Rangkuman Tata Bahasa</span>
                      </button>
                    </div>

                    <a
                      href={pdfUrl}
                      download={`Irodori_${course.level}_Bab_${chapterNum}.pdf`}
                      className="clay-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-rose-900/40 hover:scale-105 transition"
                      title="Unduh PDF Resmi Bab ini"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Unduh PDF</span>
                    </a>

                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="clay-btn-gold px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:scale-105 transition"
                      title="Buka PDF di tab baru layar penuh"
                    >
                      <span>Layar Penuh</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Target Capaian Pembelajaran (Can-Do) */}
                <div className="p-4 rounded-2xl bg-[#1C050E] border border-rose-900/40 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Target Capaian Pembelajaran (Can-do Irodori Bab {chapterNum}):</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-white/95 leading-relaxed">
                    {lkpdData.canDoObjectives.slice(0, 4).map((cando, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-[#280814]/80 p-2.5 rounded-xl border border-rose-950/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{cando}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* VIEW MODE: PDF ASLI TERSEMAT */}
              {viewMode === "pdf" ? (
                <div className="clay-card rounded-3xl p-3 sm:p-5 border border-rose-950/80 shadow-2xl flex flex-col gap-3">
                  <div className="flex items-center justify-between px-2 text-xs text-amber-200 font-bold border-b border-rose-950/60 pb-2">
                    <span className="flex items-center gap-1.5 text-amber-200">
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      Buku Teks Resmi: Irodori Nihongo de Seikatsu {course.level} (Bab {chapterNum})
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      * Dilengkapi ilustrasi warna, teks kanji berfurigana, dan dialog otentik
                    </span>
                  </div>

                  <div className="w-full rounded-2xl overflow-hidden border border-rose-900/50 shadow-inner bg-[#100308] h-[900px] sm:h-[1100px]">
                    <iframe
                      src={`${pdfUrl}#toolbar=1`}
                      title={`Modul PDF Bab ${chapterNum}`}
                      className="w-full h-full border-0 rounded-2xl"
                    />
                  </div>
                </div>
              ) : (
                /* VIEW MODE: RANGKUMAN TATA BAHASA BUNPOU */
                <div className="flex flex-col gap-6">
                  <div className="clay-card rounded-3xl p-6 sm:p-8 border border-rose-950/80 flex flex-col gap-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-950/60 pb-4">
                      <div className="flex items-center gap-2.5">
                        <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Layers className="w-5 h-5" />
                        </span>
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-amber-100">
                            IRODORI文法リスト • Tata Bahasa Bab {chapterNum}
                          </h3>
                          <p className="text-xs text-rose-300/80 mt-0.5">
                            Disinkronkan 100% dengan Database Pola Resmi Irodori (The Japan Foundation)
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/bunpou?level=${levelCode}&lesson=${chapterNum}`}
                        className="clay-btn-gold px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md hover:scale-105 transition"
                      >
                        <Puzzle className="w-3.5 h-3.5" />
                        <span>Arena Bunpou</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Bunpou Cards List */}
                    {chapterBunpou.length === 0 ? (
                      <div className="p-8 text-center flex flex-col items-center gap-3 bg-[#1C050E] rounded-2xl border border-rose-900/40">
                        <Sparkles className="w-8 h-8 text-amber-400" />
                        <p className="text-sm font-bold text-amber-100">
                          Fondasi Huruf & Fonetik Bahasa Jepang (Bab {chapterNum})
                        </p>
                        <p className="text-xs text-rose-200/80 max-w-lg leading-relaxed">
                          Bab ini merupakan fondasi pengenalan huruf Hiragana, Katakana, dan pengucapan vokal serta salam etiket kerja. Silakan gunakan buku PDF utama pada tab sebelah untuk panduan visual dan audio resmi.
                        </p>
                        <button
                          onClick={() => setViewMode("pdf")}
                          className="clay-btn-gold px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider mt-2"
                        >
                          Buka Buku PDF Asli
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-5">
                        {chapterBunpou.map((item, idx) => (
                          <div
                            key={item.id}
                            className="bg-[#240610] p-5 sm:p-6 rounded-2xl border border-rose-950/80 flex flex-col gap-4 shadow-md"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                                  {item.num || idx + 1}
                                </span>
                                <div>
                                  <h4 className="text-base sm:text-lg font-black text-amber-100">
                                    {item.pattern}
                                  </h4>
                                  {item.meaning && (
                                    <p className="text-xs sm:text-sm font-semibold text-amber-400 mt-0.5">
                                      Arti: {item.meaning}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => handleCopy(item)}
                                className="p-1.5 rounded-lg text-rose-300 hover:text-white hover:bg-white/5 transition"
                                title="Salin Pola"
                              >
                                {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                              </button>
                            </div>

                            {item.formulaDetailed && (
                              <div className="p-3.5 rounded-xl bg-[#1A050D] border border-rose-900/60 text-xs sm:text-sm leading-relaxed">
                                <span className="font-bold text-amber-400 block mb-1">Rumus Pembentukan:</span>
                                <span className="font-mono text-white/90 whitespace-pre-line">{item.formulaDetailed}</span>
                              </div>
                            )}

                            {item.usageRule && (
                              <div className="text-xs text-rose-200/90 leading-relaxed bg-[#1F0712] p-3 rounded-xl border border-rose-900/40">
                                <strong className="text-amber-400 block mb-0.5">Penjelasan Penggunaan:</strong>
                                <p>{item.usageRule}</p>
                              </div>
                            )}

                            <div className="space-y-2 pt-2 border-t border-rose-950/80">
                              <div className="text-[11px] font-black uppercase tracking-wider text-rose-300/80 flex items-center justify-between">
                                <span>Contoh Kalimat (例文):</span>
                                <span className="text-[10px]">Klik ikon suara untuk pelafalan native Tokyo</span>
                              </div>
                              <div className="p-3 rounded-xl bg-[#1A050D] border border-rose-900/60 flex items-start justify-between gap-3">
                                <p className="text-sm sm:text-base font-bold text-amber-50 whitespace-pre-line leading-relaxed">
                                  {item.example}
                                </p>
                                <button
                                  onClick={() => speak(item.example, idx)}
                                  className="p-2 rounded-xl bg-amber-500/20 text-amber-400 hover:scale-105 transition shrink-0"
                                  title="Putar Audio Native Tokyo"
                                >
                                  <Volume2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 2: KOTOBA IRODORI (DATABASE RESMI KOSAKATA)
              ======================================================== */}
          {activeTab === "kotoba" && (
            <div className="flex flex-col gap-6">
              <div className="clay-card rounded-3xl p-6 sm:p-8 border border-rose-950/80 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-950/60 pb-4">
                  <div>
                    <span className="text-[11px] font-black uppercase text-amber-400 bg-amber-950/80 border border-amber-500/30 px-3 py-1 rounded-lg">
                      Database Master Kosakata
                    </span>
                    <h3 className="font-black text-amber-100 text-xl mt-3">
                      Daftar Kotoba • 第{chapterNum}課 ({vocabList.length} Kosakata)
                    </h3>
                    <p className="text-xs text-rose-200/70 mt-1">
                      Lengkap dengan Kanji, Furigana, Part of Speech, dan Arti Bahasa Indonesia.
                    </p>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchVocab}
                      onChange={(e) => setSearchVocab(e.target.value)}
                      placeholder="Cari kata / arti..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#1A050D] border border-rose-900/60 text-xs text-amber-100 placeholder-rose-400/50 outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                {/* Vocab Cards List */}
                {vocabLoading ? (
                  <div className="p-12 text-center text-xs font-bold text-rose-300 animate-pulse">
                    Memuat daftar kosakata dari database Neon...
                  </div>
                ) : filteredVocab.length === 0 ? (
                  <div className="p-8 text-center text-xs opacity-60">
                    Tidak ditemukan kosakata yang cocok dengan kata kunci "{searchVocab}".
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {filteredVocab.map((v) => (
                      <div
                        key={v.id}
                        className="bg-[#240610] hover:bg-[#320817] p-4 rounded-2xl border border-rose-950/80 hover:border-amber-500/30 transition flex items-center justify-between gap-4 group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-amber-100 text-base">{v.midashi}</span>
                            <span className="text-xs text-amber-400/80 font-mono">【{v.yomi}】</span>
                            {v.pos && (
                              <span className="text-[10px] font-bold text-rose-300/60 bg-black/30 px-2 py-0.5 rounded-md border border-rose-950/40">
                                {v.pos}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-rose-200/90 mt-1.5 font-medium leading-relaxed">
                            {v.idArti}
                          </div>
                        </div>

                        <button
                          onClick={() => speak(v.midashi || v.yomi)}
                          className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-stone-950 transition shrink-0 group-hover:scale-105"
                          title="Dengarkan Pelafalan Asli"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: LEMBAR KERJA PESERTA DIDIK (LKPD) OTENTIK JF
              ======================================================== */}
          {activeTab === "lkpd" && (
            <div className="flex flex-col gap-6">
              <div className="clay-card rounded-3xl p-6 sm:p-8 border border-rose-950/80 flex flex-col gap-6 print:border-none print:shadow-none">
                {/* LKPD Header Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-950/60 pb-4">
                  <div>
                    <span className="text-[11px] font-black uppercase text-amber-400 bg-amber-950/80 border border-amber-500/30 px-3 py-1 rounded-lg">
                      Lembar Kerja Peserta Didik (LKPD)
                    </span>
                    <h3 className="font-black text-amber-100 text-xl mt-3">
                      {lkpdData.titleJa} • {lkpdData.titleId}
                    </h3>
                    <p className="text-xs text-rose-200/70 mt-1">
                      Standar kurikulum The Japan Foundation • Dilengkapi target Can-Do dan drill mandiri.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 print:hidden">
                    <button
                      onClick={handleSaveLkpd}
                      className="clay-btn px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Simpan Jawaban</span>
                    </button>
                    <button
                      onClick={handlePrintLkpd}
                      className="clay-btn-gold px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:scale-105 transition"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Cetak A4</span>
                    </button>
                  </div>
                </div>

                {lkpdSavedNotice && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    Jawaban LKPD berhasil disimpan di browser Anda!
                  </div>
                )}

                {/* IDENTITAS SISWA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#1C050E] border border-rose-900/40">
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-amber-300 block mb-1">
                      Nama Peserta Didik:
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#240610] border border-rose-950/80 text-xs text-amber-100 outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-amber-300 block mb-1">
                      Kelas / Rombel:
                    </label>
                    <input
                      type="text"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#240610] border border-rose-950/80 text-xs text-amber-100 outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* SEKSI A: TARGET CAPAIAN CAN-DO */}
                <div className="space-y-3">
                  <h4 className="font-black text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Bagian 1: Target Capaian Can-Do (キャンドゥ)
                  </h4>
                  <div className="space-y-2">
                    {lkpdData.canDoObjectives.map((obj, i) => (
                      <label key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#1F060F] border border-rose-950/60 text-xs cursor-pointer hover:bg-[#2A0815] transition">
                        <input type="checkbox" className="mt-0.5 rounded text-amber-500 focus:ring-0" defaultChecked />
                        <span className="text-white/90 leading-relaxed">{obj}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* SEKSI B: DRILL PENULISAN KARAKTER */}
                <div className="space-y-3">
                  <h4 className="font-black text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Bagian 2: Latihan Menulis Karakter & Kosakata Inti
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lkpdData.kanaOrKanjiDrill.map((k, i) => (
                      <div key={i} className="p-4 rounded-xl bg-[#1F060F] border border-rose-950/60 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-[#100308] border border-amber-500/40 flex items-center justify-center text-2xl font-black text-amber-400">
                          {k.character}
                        </div>
                        <div className="text-xs space-y-0.5">
                          <p className="font-bold text-amber-100">Cara Baca: <span className="font-mono text-amber-400">{k.reading}</span></p>
                          <p className="text-rose-200/80">Makna: {k.meaning}</p>
                          <p className="text-[11px] text-emerald-400 font-mono">Contoh: {k.sampleWord}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SEKSI C: DRILL TATA BAHASA APLIKATIF */}
                <div className="space-y-3">
                  <h4 className="font-black text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-amber-400" />
                    Bagian 3: Latihan Pola Kalimat Aplikatif
                  </h4>
                  {lkpdData.grammarDrill.map((g, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#1F060F] border border-rose-950/60 space-y-2 text-xs">
                      <p className="font-bold text-amber-100">{g.prompt}</p>
                      <span className="text-[10px] font-mono text-rose-300/80 block">Pola: {g.pattern}</span>
                      <textarea
                        rows={2}
                        value={lkpdDrillAnswers[i] || ""}
                        onChange={(e) => setLkpdDrillAnswers({ ...lkpdDrillAnswers, [i]: e.target.value })}
                        placeholder="Tuliskan kalimat Anda dalam bahasa Jepang..."
                        className="w-full p-2.5 rounded-xl bg-[#15040B] border border-rose-900/60 text-xs text-amber-100 outline-none focus:border-amber-400"
                      />
                      <p className="text-[11px] text-emerald-400 font-medium">
                        <span className="font-semibold text-emerald-400">Contoh Acuan:</span> {g.sampleAnswer}
                      </p>
                    </div>
                  ))}
                </div>

                {/* SEKSI D: REFLEKSI DIRI SISWA */}
                <div className="space-y-3">
                  <h4 className="font-black text-sm text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Bagian 4: Lembar Refleksi Diri (ふりかえり)
                  </h4>
                  <div className="p-4 rounded-xl bg-[#1F060F] border border-rose-950/60 space-y-2 text-xs">
                    <p className="font-bold text-amber-100">{lkpdData.reflectionPrompts[0]}</p>
                    <textarea
                      rows={3}
                      placeholder="Tuliskan catatan pencapaian dan kata/pola yang paling berkesan..."
                      className="w-full p-2.5 rounded-xl bg-[#15040B] border border-rose-900/60 text-xs text-amber-100 outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 4: LATIHAN SOAL KUIS CBT 4 SEKSI STANDAR PROMETRIC
              ======================================================== */}
          {activeTab === "latihan" && (
            <div className="flex flex-col gap-6">
              <div className="clay-card rounded-3xl p-6 sm:p-8 border border-rose-950/80 flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-950/60 pb-4">
                  <div>
                    <span className="text-[11px] font-black uppercase text-rose-400 bg-rose-950/80 border border-rose-500/30 px-3 py-1 rounded-lg">
                      Simulasi CBT 4 Seksi Standar JFT-Basic
                    </span>
                    <h3 className="font-black text-amber-100 text-xl mt-3">
                      Latihan Ujian Bab {chapterNum} • Moji, Kaiwa, Choukai, Dokkai
                    </h3>
                    <p className="text-xs text-rose-200/70 mt-1">
                      Verifikasi langsung pemahaman Anda sebelum melangkah ke bab berikutnya.
                    </p>
                  </div>

                  {submittedQuiz && (
                    <div className="p-3 rounded-2xl bg-[#100308] border border-amber-500/40 text-center">
                      <span className="text-[10px] font-black uppercase text-amber-400 block">Skor Latihan</span>
                      <span className="text-2xl font-black text-amber-100">
                        {quizScore.percentage}% ({quizScore.correct}/{quizScore.total})
                      </span>
                    </div>
                  )}
                </div>

                {/* Questions List */}
                <div className="space-y-6">
                  {chapterQuestions.map((q, idx) => {
                    const isSelected = userAnswers[q.id];
                    const isAnswered = submittedQuiz;
                    const isCorrect = isAnswered && userAnswers[q.id] === q.answerKey;

                    return (
                      <div
                        key={q.id}
                        className={`p-5 rounded-2xl border transition ${
                          !isAnswered
                            ? "bg-[#240610] border-rose-950/80"
                            : isCorrect
                            ? "bg-emerald-950/30 border-emerald-500/40"
                            : "bg-rose-950/30 border-rose-500/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#100308] border border-rose-900/60 text-amber-400">
                            Seksi: {q.section.replace("_", " ").toUpperCase()} • No. {idx + 1}
                          </span>
                          {q.audioText && (
                            <button
                              onClick={() => speak(q.audioText || "")}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 hover:scale-105 text-xs font-bold flex items-center gap-1 transition"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              Putar Audio
                            </button>
                          )}
                        </div>

                        {q.stimulusText && (
                          <div className="p-3.5 rounded-xl bg-[#15040B] border border-rose-900/60 text-xs text-white/90 whitespace-pre-line mb-3 font-mono">
                            {q.stimulusText}
                          </div>
                        )}

                        <p className="font-bold text-sm sm:text-base text-amber-100 whitespace-pre-line mb-4">
                          {q.questionText}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {[
                            { key: "A", text: q.optionA },
                            { key: "B", text: q.optionB },
                            { key: "C", text: q.optionC },
                            ...(q.optionD ? [{ key: "D", text: q.optionD }] : []),
                          ].map((opt) => {
                            const isChosen = userAnswers[q.id] === opt.key;
                            let btnStyle = "bg-[#18050E] border-rose-900/40 text-rose-100/90 hover:border-amber-400/50";
                            if (isChosen) {
                              btnStyle = "bg-amber-600 text-white border-amber-300 font-bold shadow-md";
                            }
                            if (isAnswered) {
                              if (opt.key === q.answerKey) {
                                btnStyle = "bg-emerald-600 text-white border-emerald-300 font-bold shadow-md";
                              } else if (isChosen && !isCorrect) {
                                btnStyle = "bg-rose-700 text-white border-rose-300";
                              }
                            }

                            return (
                              <button
                                key={opt.key}
                                onClick={() => setUserAnswers({ ...userAnswers, [q.id]: opt.key })}
                                className={`p-3 rounded-xl border text-xs sm:text-sm text-left flex items-start gap-2.5 transition ${btnStyle}`}
                              >
                                <span className="w-5 h-5 rounded-md bg-black/30 font-black text-[11px] flex items-center justify-center shrink-0">
                                  {opt.key}
                                </span>
                                <span className="flex-1 leading-snug">{opt.text}</span>
                              </button>
                            );
                          })}
                        </div>

                        {isAnswered && (
                          <div className="mt-4 pt-3 border-t border-current/15 text-xs space-y-1">
                            <p className="font-bold text-emerald-400">
                              Kunci Jawaban: {q.answerKey}
                            </p>
                            <p className="text-white/80 leading-relaxed">
                              Pembahasan: {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit Quiz Action */}
                <div className="pt-4 border-t border-rose-950/80 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-rose-300/80">
                    Dijawab: {Object.keys(userAnswers).length} dari {chapterQuestions.length} Soal
                  </span>
                  <div className="flex items-center gap-2">
                    {submittedQuiz ? (
                      <button
                        onClick={() => {
                          setUserAnswers({});
                          setSubmittedQuiz(false);
                        }}
                        className="clay-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Ulangi Latihan
                      </button>
                    ) : (
                      <button
                        onClick={() => setSubmittedQuiz(true)}
                        className="clay-btn-gold px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg hover:scale-105 transition"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Periksa Jawaban Sekarang
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
