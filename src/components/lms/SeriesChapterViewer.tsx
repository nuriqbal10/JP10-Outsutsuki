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
} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
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
  const course = getCourseById(courseId);
  const chapter = getChapterInfo(courseId, chapterNum);

  // 4 PILAR TAB ALA MOODLE PERSIS A2.2
  const [activeTab, setActiveTab] = useState<"modul" | "kotoba" | "lkpd" | "latihan">("modul");
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
    }
    setLkpdSavedNotice(true);
    setTimeout(() => setLkpdSavedNotice(false), 3000);
  };

  if (!course || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-[var(--text-body)] font-sans">
        <div className="clay-card p-8 rounded-3xl max-w-md text-center flex flex-col gap-4">
          <h2 className="text-xl font-bold">Bab Tidak Ditemukan</h2>
          <p className="text-xs opacity-75">Bab yang Anda pilih tidak tersedia dalam katalog silabus.</p>
          <Link href="/lms" className="clay-btn py-2.5 rounded-xl text-xs font-bold">
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  const prevChapter = chapterNum > 1 ? chapterNum - 1 : null;
  const nextChapter = chapterNum < course.totalChapters ? chapterNum + 1 : null;

  // Filtered Vocabularies
  const filteredVocab = vocabList.filter(
    (v) =>
      v.midashi.toLowerCase().includes(searchVocab.toLowerCase()) ||
      v.yomi.toLowerCase().includes(searchVocab.toLowerCase()) ||
      v.idArti.toLowerCase().includes(searchVocab.toLowerCase())
  );

  // Questions for this chapter
  const rawQuestions: SeriesQuestionItem[] =
    levelCode === "a1"
      ? A1_CBT_QUESTIONS[chapterNum] || []
      : A21_CBT_QUESTIONS[chapterNum] || [];

  // Fallback realistic questions if specific chapter hasn't got custom questions yet
  const chapterQuestions: SeriesQuestionItem[] =
    rawQuestions.length > 0
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
          prompt: `Gunakan pola kalimat utama Bab ${chapterNum}: [${chapter.grammarPoints[0] || "Pola Kalimat"}]`,
          pattern: chapter.grammarPoints[0] || "Pola Kalimat",
          sampleAnswer: `Contoh penerapan: ${chapter.grammarPoints[0] || "Pola Kalimat"} dalam situasi nyata.`,
        },
      ],
      translationDrill: [
        {
          ja: chapter.title,
          id: chapter.topic,
          situation: `Situasi komunikasi pada Bab ${chapterNum}`,
        },
      ],
      reflectionPrompts: [
        `Apa kosakata atau pola kalimat paling berkesan bagi Anda di Bab ${chapterNum}?`,
        "Bagian mana yang masih memerlukan latihan ekstra dengan instruktur atau teman sekelas?",
      ],
    };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[var(--text-body)]">
      {/* 1. HEADER UTAMA */}
      <header className="clay-card rounded-none border-x-0 border-t-0 border-b border-current/10 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={course.href}
            className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider opacity-80 hover:opacity-100 transition uppercase"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Katalog {course.level}</span>
          </Link>
          <div className="h-4 w-px bg-current/15 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${course.badgeColor}`}>
              {course.badge}
            </span>
            <span className="text-xs sm:text-sm font-extrabold truncate">
              第{chapterNum}課 • {chapter.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher compact />
          <Link
            href={`/bunpou?level=${levelCode}&lesson=${chapterNum}`}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-current/15 bg-current/5 hover:bg-current/10 transition hidden md:inline-flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" /> Bunpou Explorer
          </Link>
        </div>
      </header>

      {/* 2. SUB-HEADER BANNER BAB */}
      <div className="border-b border-current/10 px-4 sm:px-6 py-4 bg-current/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold opacity-75">
              <span>{course.title}</span>
              <span>•</span>
              <span className="font-mono">Bab {chapterNum < 10 ? `0${chapterNum}` : chapterNum} ({chapter.subTitle})</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black mt-1 text-[var(--text-heading)]">
              {chapter.title}
            </h1>
            <p className="text-xs sm:text-sm opacity-80 mt-1 max-w-2xl leading-relaxed">
              {chapter.topic}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {prevChapter && (
              <Link
                href={`/lms/${courseId}/bab/${prevChapter}`}
                className="clay-nav-pill px-3 py-1.5 border border-current/15 bg-current/5 hover:bg-current/10 text-xs font-bold flex items-center gap-1"
              >
                ← Bab {prevChapter}
              </Link>
            )}
            {nextChapter && (
              <Link
                href={`/lms/${courseId}/bab/${nextChapter}`}
                className="clay-nav-pill px-3 py-1.5 border border-current/15 bg-current/5 hover:bg-current/10 text-xs font-bold flex items-center gap-1"
              >
                Bab {nextChapter} →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 3. SUB-HEADER / TAB NAVIGATION 4 PILAR ALA MOODLE (PERSIS A2.2) */}
      <div className="clay-card rounded-none border-x-0 border-t-0 border-b border-current/10 px-4 sm:px-6 py-2.5 sticky top-[57px] z-30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
            <button
              onClick={() => setActiveTab("modul")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shrink-0 ${
                activeTab === "modul"
                  ? "bg-amber-600 text-white shadow-md border border-amber-300"
                  : "bg-current/5 hover:bg-current/10 opacity-80"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-200" />
              1. Modul & Tata Bahasa ({chapterBunpou.length})
            </button>
            <button
              onClick={() => setActiveTab("kotoba")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shrink-0 ${
                activeTab === "kotoba"
                  ? "bg-amber-600 text-white shadow-md border border-amber-300"
                  : "bg-current/5 hover:bg-current/10 opacity-80"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-200" />
              2. Kotoba Irodori ({vocabList.length || chapter.vocabCount})
            </button>
            <button
              onClick={() => setActiveTab("lkpd")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shrink-0 ${
                activeTab === "lkpd"
                  ? "bg-amber-600 text-white shadow-md border border-amber-300"
                  : "bg-current/5 hover:bg-current/10 opacity-80"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-200" />
              3. LKPD Lembar Kerja Siswa
            </button>
            <button
              onClick={() => setActiveTab("latihan")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition shrink-0 ${
                activeTab === "latihan"
                  ? "bg-rose-600 text-white shadow-md border border-amber-300"
                  : "bg-current/5 hover:bg-current/10 opacity-80"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-200" />
              4. Latihan Kuis CBT ({chapterQuestions.length})
            </button>
          </div>
          <div className="hidden lg:block text-xs font-mono opacity-60">
            {course.level} • KKM 85%
          </div>
        </div>
      </div>

      {/* 4. MAIN CONTAINER CONTENT */}
      <main className="max-w-6xl mx-auto p-4 sm:p-6 flex-1 flex flex-col gap-6 w-full">
        {/* ========================================================
            TAB 1: MODUL & RANGKUMAN TATA BAHASA BUNPOU
            ======================================================== */}
        {activeTab === "modul" && (
          <div className="flex flex-col gap-6">
            {/* Can-Do Summary Card */}
            <div className="clay-card rounded-2xl p-5 border border-emerald-500/30 flex items-start gap-3 bg-emerald-500/5">
              <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <Target className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Target Capaian CEFR Japan Foundation
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-[var(--text-heading)] mt-0.5">
                  Can-Do Bab {chapterNum}: {chapter.canDo}
                </h3>
                <p className="text-xs opacity-75 mt-1">
                  Kuasai pola kalimat dan perbendaharaan kata di bawah ini untuk mencapai target komunikasi praktis.
                </p>
              </div>
            </div>

            {/* Grammar Points Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[var(--text-heading)] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  Daftar Pola Kalimat Resmi (文型リスト)
                </h3>
                <p className="text-xs opacity-75 mt-0.5">
                  Tersusun sesuai silabus resmi The Japan Foundation Irodori {course.level}.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                {chapterBunpou.length} Pola Kalimat
              </span>
            </div>

            {chapterBunpou.length === 0 ? (
              <div className="clay-card rounded-2xl p-8 text-center flex flex-col items-center gap-3">
                <Sparkles className="w-8 h-8 text-amber-500" />
                <p className="text-sm font-bold">Materi Bab {chapterNum} Fokus pada Pengenalan Huruf & Ungkapan Lisan</p>
                <p className="text-xs opacity-75 max-w-md">
                  Bab ini melatih fondasi pengucapan, fonetik vokal/konsonan, dan etiket sapaan awal sebelum masuk ke konstruksi tata bahasa formal.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => setActiveTab("kotoba")} className="clay-btn px-4 py-2 rounded-xl text-xs font-bold">
                    Buka Database Kotoba
                  </button>
                  <button onClick={() => setActiveTab("lkpd")} className="clay-btn-gold px-4 py-2 rounded-xl text-xs font-bold">
                    Buka Lembar Kerja Siswa
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {chapterBunpou.map((item, idx) => (
                  <div
                    key={item.id}
                    className="clay-card rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-current/10 flex flex-col gap-4 shadow-md relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {item.num || idx + 1}
                        </span>
                        <div>
                          <h4 className="text-base sm:text-lg font-black text-[var(--text-heading)]">
                            {item.pattern}
                          </h4>
                          {item.meaning && (
                            <p className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                              Arti: {item.meaning}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleCopy(item)}
                          className="p-1.5 rounded-lg text-current/60 hover:text-current hover:bg-current/5 transition"
                          title="Salin Pola"
                        >
                          {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Formula & Penjelasan */}
                    {item.formulaDetailed && (
                      <div className="p-3.5 rounded-xl bg-current/5 border border-current/10 text-xs sm:text-sm leading-relaxed">
                        <span className="font-bold text-amber-500 block mb-1">Rumus Pembentukan:</span>
                        <span className="font-mono whitespace-pre-line">{item.formulaDetailed}</span>
                      </div>
                    )}

                    {item.usageRule && (
                      <div className="text-xs opacity-85 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
                        <strong className="text-amber-600 dark:text-amber-400 block mb-0.5">Penjelasan Penggunaan:</strong>
                        <p>{item.usageRule}</p>
                      </div>
                    )}

                    {/* Contoh Kalimat */}
                    <div className="space-y-2 pt-2 border-t border-current/10">
                      <div className="text-[11px] font-black uppercase tracking-wider opacity-70 flex items-center justify-between">
                        <span>Contoh Kalimat (例文):</span>
                        <span className="text-[10px]">Klik ikon suara untuk mendengarkan native voice</span>
                      </div>
                      <div className="p-3 rounded-xl bg-current/5 border border-current/10 flex items-start justify-between gap-3">
                        <p className="text-sm sm:text-base font-bold whitespace-pre-line leading-relaxed">
                          {item.example}
                        </p>
                        <button
                          onClick={() => speak(item.example, idx)}
                          className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:scale-105 transition shrink-0"
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
        )}

        {/* ========================================================
            TAB 2: KOTOBA IRODORI (DATABASE RESMI JAPAN FOUNDATION)
            ======================================================== */}
        {activeTab === "kotoba" && (
          <div className="flex flex-col gap-6">
            <div className="clay-card rounded-3xl p-5 sm:p-7 border border-current/10 flex flex-col gap-5 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-current/10 pb-4">
                <div>
                  <span className="text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-lg">
                    Database Master Kosakata Irodori
                  </span>
                  <h3 className="font-black text-lg sm:text-xl text-[var(--text-heading)] mt-2">
                    Daftar Kotoba • 第{chapterNum}課 ({vocabList.length || chapter.vocabCount} Kosakata)
                  </h3>
                  <p className="text-xs opacity-75 mt-0.5">
                    Lengkap dengan Kanji/Hiragana, Cara Baca (Furigana), Romaji, dan Arti Bahasa Indonesia.
                  </p>
                </div>

                {/* SEARCH INPUT */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 opacity-50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchVocab}
                    onChange={(e) => setSearchVocab(e.target.value)}
                    placeholder="Cari kata / arti..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-current/5 border border-current/15 text-xs outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* VOCAB LISTING */}
              {vocabLoading ? (
                <div className="p-12 text-center text-xs font-bold text-amber-500 animate-pulse">
                  Menghubungkan ke database kosakata Neon...
                </div>
              ) : filteredVocab.length === 0 ? (
                <div className="p-8 text-center text-xs opacity-70">
                  {searchVocab ? "Tidak ada kosakata yang cocok dengan kata kunci." : "Memuat data kosakata bab ini..."}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredVocab.map((v) => (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-2xl bg-current/5 hover:bg-current/10 border border-current/10 transition flex items-center justify-between gap-3 group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-sm sm:text-base text-[var(--text-heading)]">{v.midashi}</span>
                          <span className="text-xs font-mono text-amber-600 dark:text-amber-400">【{v.yomi}】</span>
                          {v.pos && (
                            <span className="text-[9px] font-bold opacity-60 px-1.5 py-0.2 rounded border border-current/20">
                              {v.pos}
                            </span>
                          )}
                        </div>
                        <div className="text-xs opacity-85 mt-1 font-medium truncate">
                          {v.idArti}
                        </div>
                      </div>

                      <button
                        onClick={() => speak(v.yomi || v.midashi)}
                        className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:scale-110 active:scale-95 transition flex items-center justify-center shrink-0 shadow-xs"
                        title="Dengarkan pengucapan native"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: LKPD LEMBAR KERJA SISWA (STANDAR RESMI JF KATSUOU)
            ======================================================== */}
        {activeTab === "lkpd" && (
          <div className="flex flex-col gap-6">
            <div className="clay-card rounded-3xl p-5 sm:p-8 border border-current/10 flex flex-col gap-6 shadow-xl">
              {/* HEADER LKPD */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-current/10 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-lg">
                    Lembar Kerja Peserta Didik (LKPD) • Japan Foundation Standard
                  </span>
                  <h3 className="font-black text-lg sm:text-xl text-[var(--text-heading)] mt-2">
                    {lkpdData.titleJa}
                  </h3>
                  <p className="text-xs opacity-75 mt-0.5">
                    {lkpdData.topic}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleSaveLkpd}
                    className="clay-btn px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lkpdSavedNotice ? "Tersimpan!" : "Simpan Jawaban"}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (typeof window !== "undefined") window.print();
                    }}
                    className="clay-btn-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Cetak A4</span>
                  </button>
                </div>
              </div>

              {/* IDENTITAS SISWA */}
              <div className="p-4 rounded-2xl bg-current/5 border border-current/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold opacity-70 block mb-1">Nama Peserta Didik:</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full p-2 rounded-xl bg-current/5 border border-current/15 font-bold outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="font-bold opacity-70 block mb-1">Kelas / LPK:</label>
                  <input
                    type="text"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full p-2 rounded-xl bg-current/5 border border-current/15 font-bold outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* SEKSI A: CEKLIS CAPAIAN CAN-DO */}
              <div className="space-y-3">
                <h4 className="font-black text-sm text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  Bagian 1: Indikator Capaian Can-Do (自己評価)
                </h4>
                <div className="space-y-2">
                  {lkpdData.canDoObjectives.map((obj, i) => (
                    <label
                      key={i}
                      className="p-3 rounded-xl bg-current/5 border border-current/10 flex items-start gap-2.5 text-xs cursor-pointer hover:bg-current/10 transition"
                    >
                      <input type="checkbox" defaultChecked className="mt-0.5 rounded text-amber-500 accent-amber-500" />
                      <span className="font-medium leading-relaxed">{obj}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SEKSI B: DRILL PENULISAN HURUF KANA / KANJI */}
              <div className="space-y-3">
                <h4 className="font-black text-sm text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4" />
                  Bagian 2: Latihan Menulis Huruf ({levelCode === "a1" ? "Kana" : "Kanji"})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {lkpdData.kanaOrKanjiDrill.map((k, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-current/5 border border-current/10 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-amber-500">{k.character}</span>
                        <span className="text-xs font-mono opacity-70">Baca: {k.reading}</span>
                      </div>
                      <p className="text-xs font-bold text-[var(--text-heading)]">{k.meaning}</p>
                      <p className="text-[11px] opacity-75">Contoh: {k.sampleWord}</p>
                      <input
                        type="text"
                        placeholder="Latihan tulis di sini..."
                        className="mt-1 p-2 rounded-lg bg-current/5 border border-current/15 text-xs outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SEKSI C: DRILL POLA KALIMAT KERJA */}
              <div className="space-y-3">
                <h4 className="font-black text-sm text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  Bagian 3: Penerapan Pola Kalimat Praktis
                </h4>
                <div className="space-y-3">
                  {lkpdData.grammarDrill.map((g, i) => (
                    <div key={i} className="p-4 rounded-xl bg-current/5 border border-current/10 space-y-2 text-xs">
                      <p className="font-bold text-[var(--text-heading)]">{g.prompt}</p>
                      <span className="text-[10px] font-mono opacity-60 block">Pola: {g.pattern}</span>
                      <textarea
                        rows={2}
                        placeholder="Tuliskan kalimat Anda dalam bahasa Jepang..."
                        className="w-full p-2.5 rounded-xl bg-current/5 border border-current/15 outline-none focus:border-amber-500 text-xs"
                      />
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">Contoh Acuan:</span> {g.sampleAnswer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEKSI D: REFLEKSI DIRI SISWA */}
              <div className="space-y-3">
                <h4 className="font-black text-sm text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Bagian 4: Lembar Refleksi Diri (ふりかえり)
                </h4>
                <div className="p-4 rounded-xl bg-current/5 border border-current/10 space-y-2 text-xs">
                  <p className="font-bold opacity-80">{lkpdData.reflectionPrompts[0]}</p>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan catatan refleksi Anda..."
                    className="w-full p-2.5 rounded-xl bg-current/5 border border-current/15 outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: LATIHAN SOAL KUIS CBT (STANDAR JFT-BASIC PROMETRIC)
            ======================================================== */}
        {activeTab === "latihan" && (
          <div className="flex flex-col gap-6">
            <div className="clay-card rounded-3xl p-5 sm:p-8 border border-current/10 flex flex-col gap-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-current/10 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-500/15 border border-rose-500/30 px-3 py-1 rounded-lg">
                    Format Ujian Resmi Prometric JFT-Basic
                  </span>
                  <h3 className="font-black text-lg sm:text-xl text-[var(--text-heading)] mt-2">
                    Latihan Butir Soal CBT • 第{chapterNum}課 ({chapterQuestions.length} Soal)
                  </h3>
                  <p className="text-xs opacity-75 mt-0.5">
                    Mencakup 4 Seksi: Moji-Goi, Kaiwa-Hyougen, Choukai Audio, dan Dokkai.
                  </p>
                </div>

                <Link
                  href={`/cbt`}
                  className="clay-btn-gold px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-md hover:scale-105 shrink-0"
                >
                  Buka Simulator CBT Lengkap <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* 4 SEKSI OVERVIEW CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
                <div className="p-3 rounded-xl bg-current/5 border border-current/10">
                  <span className="text-[10px] font-bold opacity-60 block">Seksi 1</span>
                  <span className="font-black text-amber-500 block mt-0.5">文字・語彙 (Moji)</span>
                </div>
                <div className="p-3 rounded-xl bg-current/5 border border-current/10">
                  <span className="text-[10px] font-bold opacity-60 block">Seksi 2</span>
                  <span className="font-black text-emerald-500 block mt-0.5">会話・表現 (Kaiwa)</span>
                </div>
                <div className="p-3 rounded-xl bg-current/5 border border-current/10">
                  <span className="text-[10px] font-bold opacity-60 block">Seksi 3</span>
                  <span className="font-black text-purple-500 block mt-0.5">聴解 (Choukai Audio)</span>
                </div>
                <div className="p-3 rounded-xl bg-current/5 border border-current/10">
                  <span className="text-[10px] font-bold opacity-60 block">Seksi 4</span>
                  <span className="font-black text-sky-500 block mt-0.5">読解 (Dokkai Bacaan)</span>
                </div>
              </div>

              {/* SOAL INTERAKTIF */}
              <div className="space-y-4 mt-2">
                {chapterQuestions.map((q, idx) => {
                  const selectedOpt = userAnswers[q.id];
                  const isCorrect = selectedOpt === q.answerKey;

                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl bg-current/5 border border-current/10 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">
                          Soal #{idx + 1} • {q.section}
                        </span>
                        {submittedQuiz && selectedOpt && (
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${isCorrect ? "bg-emerald-500/20 text-emerald-500" : "bg-rose-500/20 text-rose-500"}`}>
                            {isCorrect ? "Benar (+1)" : "Salah"}
                          </span>
                        )}
                      </div>

                      {/* Stimulus jika ada */}
                      {q.stimulusText && (
                        <div className="p-3.5 rounded-xl bg-current/5 border border-current/10 font-mono text-xs whitespace-pre-line leading-relaxed">
                          {q.stimulusText}
                        </div>
                      )}

                      {/* Audio stimulus jika ada */}
                      {q.audioText && (
                        <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between gap-3 text-xs">
                          <span className="font-bold text-purple-600 dark:text-purple-300">
                            Audio Soal Listening:
                          </span>
                          <button
                            onClick={() => speak(q.audioText || "")}
                            className="px-3 py-1.5 rounded-xl bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 hover:scale-105 transition shadow-xs"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> Putar Audio (Maks 2x)
                          </button>
                        </div>
                      )}

                      <p className="text-xs sm:text-sm font-bold text-[var(--text-heading)] whitespace-pre-line">
                        {q.questionText}
                      </p>

                      {/* Opsi Jawaban */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {[
                          { key: "A", text: q.optionA },
                          { key: "B", text: q.optionB },
                          { key: "C", text: q.optionC },
                          ...(q.optionD ? [{ key: "D", text: q.optionD }] : []),
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => setUserAnswers((prev) => ({ ...prev, [q.id]: opt.key }))}
                            className={`p-3 rounded-xl text-left border font-semibold transition flex items-center justify-between gap-2 ${
                              selectedOpt === opt.key
                                ? "border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-300 shadow-sm"
                                : "border-current/10 bg-current/5 hover:bg-current/10"
                            }`}
                          >
                            <span>
                              <strong>{opt.key}.</strong> {opt.text}
                            </span>
                            {selectedOpt === opt.key && <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />}
                          </button>
                        ))}
                      </div>

                      {/* Penjelasan jika sudah submit */}
                      {submittedQuiz && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
                          <span className="font-bold text-amber-600 dark:text-amber-400 block">
                            Kunci Jawaban: {q.answerKey}
                          </span>
                          <p className="opacity-80 leading-relaxed">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ACTION BUTTON */}
              <div className="flex items-center justify-between gap-4 pt-2 border-t border-current/10">
                <span className="text-xs opacity-70">
                  {Object.keys(userAnswers).length} dari {chapterQuestions.length} soal terjawab
                </span>
                <button
                  onClick={() => setSubmittedQuiz(!submittedQuiz)}
                  className="clay-btn-gold px-6 py-2.5 rounded-xl text-xs font-bold shadow-md hover:scale-105 transition"
                >
                  {submittedQuiz ? "Ulangi Latihan" : "Periksa Jawaban Kuis"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
