"use client";

export const runtime = "edge";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  FileText,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Layers,
  GraduationCap,
  Play,
  Edit3,
  Menu,
  PanelLeft,
  Search,
} from "lucide-react";
import LkpdWorksheet from "@/components/lms/LkpdWorksheet";
import ChapterModuleViewer from "@/components/lms/ChapterModuleViewer";
import LmsSidebar from "@/components/lms/LmsSidebar";
import ThemeSwitcher from "@/components/ThemeSwitcher";

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

interface QuestionItem {
  id: number;
  questionNumber: number;
  section: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string | null;
  answerKey: string;
}

const CHAPTER_METADATA: Record<number, { title: string; topic: string; slidesEmbed?: string; driveEmbed?: string }> = {
  1: {
    title: "私のこと",
    topic: "Perkenalan Diri, Asal Daerah & Kehidupan di Jepang",
    slidesEmbed: "https://docs.google.com/presentation/d/e/2PACX-1vQLGyJ9sXk4h_UE1wHemR7Kp8_CH4YxnxFkHSpY25gvnRDJnwgbuz40g2FJM0TLRKvpjtsJfeshP3_o/embed?start=false&loop=false&delayms=3000",
    driveEmbed: "https://drive.google.com/file/d/1IFTn1P6Qrtgm2sNOPqB1jxneEM1fvcEU/preview",
  },
  2: {
    title: "どんな人ですか",
    topic: "Ciri Fisik, Karakter Orang & Pakaian Kerja",
  },
  3: {
    title: "おすすめは何ですか",
    topic: "Restoran, Menu Makanan, Alergi & Reservasi",
  },
  4: {
    title: "何時からですか",
    topic: "Jam Kerja, Lembur, Jadwal & Janji Temu",
  },
  5: {
    title: "安全第一",
    topic: "Aturan Pabrik, Keselamatan Kerja & Prosedur K3",
  },
  6: {
    title: "どうやって行きますか",
    topic: "Transportasi, Tiket Kereta & Rute Perjalanan",
  },
  7: {
    title: "雨が降ったら、ホールでやります",
    topic: "Festival Komunitas, Cuaca & Partisipasi Acara",
  },
  8: {
    title: "屋台はどこかわかりますか？",
    topic: "Festival Budaya, Lokasi Stan & Denah Acara",
  },
  9: {
    title: "成人の日は、何をするんですか？",
    topic: "Hari Libur Nasional, Perayaan Tradisional & Budaya Jepang",
  },
  10: {
    title: "どんな服を着て行けばいいですか？",
    topic: "Tata Cara Berpakaian, Etiket Upacara & Kebiasaan Sosial",
  },
  11: {
    title: "ポイントカードを忘れてしまいました",
    topic: "Belanja di Toko, Ukuran Pakaian & Kejadian Tak Terduga",
  },
  12: {
    title: "このボタンを押すと、エコモードに変わります",
    topic: "Pengoperasian Alat Elektronik, Tombol Fungsi & Rumah Tangga",
  },
  13: {
    title: "いろいろな資料を展示してあります",
    topic: "Fasilitas Umum, Balai Kota & Aturan Peminjaman",
  },
  14: {
    title: "髪をもう少し短くしてください",
    topic: "Layanan Jasa Publik, Salon Pangkas Rambut & Kurir Paket",
  },
  15: {
    title: "ゴミを減らすために、マイバッグを持っています",
    topic: "Lingkungan Hidup, Pemilahan Sampah & Gaya Hidup Eco",
  },
  16: {
    title: "地震が起きたら、どうすればいいですか？",
    topic: "Mitigasi Bencana Alam, Peringatan Gempa Dini & Keselamatan",
  },
  17: {
    title: "日本語が前より話せるようになりました",
    topic: "Pertumbuhan Diri, Refleksi di Jepang & Peningkatan Kemampuan",
  },
  18: {
    title: "将来、自分の会社を作ろうと思っています",
    topic: "Rencana Masa Depan, Karir Tokutei Ginou & Kelulusan A2",
  },
};

export default function LmsBabLearningPage() {
  const params = useParams();
  const babNum = parseInt(params?.chapterNum as string, 10) || 1;
  const meta = CHAPTER_METADATA[babNum] || { title: `第${babNum}課`, topic: "Pembelajaran Irodori A2.2" };

  // Tab: 'modul' (Slide/Grammar), 'kotoba' (Vocabulary), 'lkpd' (Worksheet), 'latihan' (Quiz Overview)
  const [activeTab, setActiveTab] = useState<"modul" | "kotoba" | "lkpd" | "latihan">("modul");

  // Vocab State
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [vocabLoading, setVocabLoading] = useState(true);
  const [searchVocab, setSearchVocab] = useState("");

  // Questions Preview State
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);

  // Audio Speech synthesis fallback for vocab pronunciation
  const speakWord = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    async function loadBabData() {
      try {
        setVocabLoading(true);
        const resVocab = await fetch(`/api/vocabularies?chapter=${babNum}&level=初級2`);
        const jsonVocab = await resVocab.json();
        if (jsonVocab.success) {
          setVocabList(jsonVocab.data);
        }

        setQuestionsLoading(true);
        const resQ = await fetch(`/api/questions?chapter=${babNum}`);
        const jsonQ = await resQ.json();
        if (jsonQ.success) {
          setQuestions(jsonQ.data);
        }
      } catch (err) {
        console.error("Gagal memuat data bab:", err);
      } finally {
        setVocabLoading(false);
        setQuestionsLoading(false);
      }
    }
    loadBabData();
  }, [babNum]);

  // Sidebar State (Opsi A)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const filteredVocab = vocabList.filter(
    (v) =>
      v.midashi.toLowerCase().includes(searchVocab.toLowerCase()) ||
      v.yomi.toLowerCase().includes(searchVocab.toLowerCase()) ||
      v.idArti.toLowerCase().includes(searchVocab.toLowerCase())
  );

  return (
    <div className="min-h-screen flex font-sans">
      {/* SIDEBAR OPSI A */}
      <LmsSidebar
        currentChapter={babNum}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* HEADER */}
        <header className="clay-card border-b border-black/10 dark:border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2 sm:gap-3">
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
              href="/lms/irodori-a2-2"
              className="inline-flex items-center gap-1.5 text-xs font-black tracking-wider opacity-80 hover:opacity-100 transition uppercase ml-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-500" /> <span className="hidden sm:inline">Silabus</span>
            </Link>

            <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold tracking-wide truncate ml-2">
              <span className="truncate">第{babNum}課 • {meta.title}</span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 hidden md:inline shrink-0">
                大筒木クラス
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Link
              href={`/cbt/${babNum}`}
              className="clay-btn-gold px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-1 shadow-md hover:scale-105 shrink-0"
            >
              Ujian CBT <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

      {/* SUB-HEADER / TAB NAVIGATION ALA MOODLE */}
      <div className="clay-card border-b border-black/10 dark:border-white/10 px-6 py-3 sticky top-[65px] z-20 backdrop-blur-md rounded-none">
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
              2. Kotoba Irodori ({vocabList.length})
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
              4. Latihan Kuis CBT ({questions.length})
            </button>
          </div>
          <div className="hidden sm:block text-xs font-bold text-rose-300/70">
            {meta.topic}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto p-6 sm:p-8 flex-1 flex flex-col gap-6 w-full">
        {/* ========================================================
            TAB 1: MODUL RESMI IRODORI (PDF VIEWER & RANGKUMAN BUNPOU)
            ======================================================== */}
        {activeTab === "modul" && (
          <ChapterModuleViewer
            chapter={babNum}
            chapterTitle={meta.title}
            chapterTopic={meta.topic}
          />
        )}

        {/* ========================================================
            TAB 2: KOTOBA IRODORI (DATABASE 1.770 KOSAKATA LENGKAP)
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
                    Daftar Kotoba • 第{babNum}課 ({vocabList.length} Kosakata)
                  </h3>
                  <p className="text-xs text-rose-200/70 mt-1">
                    Lengkap dengan Kanji, Furigana, Part of Speech, dan Arti Bahasa Indonesia.
                  </p>
                </div>

                {/* SEARCH BAR */}
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

              {/* DAFTAR KOTOBA TABLE / CARDS */}
              {vocabLoading ? (
                <div className="p-12 text-center text-xs font-bold text-rose-300 animate-pulse">
                  Memuat daftar kosakata dari database Neon...
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

                      {/* TOMBOL SUARA AUDIO */}
                      <button
                        onClick={() => speakWord(v.yomi || v.midashi)}
                        className="w-9 h-9 rounded-xl clay-btn flex items-center justify-center text-amber-300 hover:text-white shrink-0 group-hover:scale-110 transition shadow-md"
                        title="Dengarkan pengucapan native"
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
            TAB 3: LKPD (LEMBAR KERJA PESERTA DIDIK INTERAKTIF)
            ======================================================== */}
        {activeTab === "lkpd" && (
          <LkpdWorksheet
            chapter={babNum}
            chapterTitle={meta.title}
            chapterTopic={meta.topic}
          />
        )}

        {/* ========================================================
            TAB 4: LATIHAN KUIS CBT PER BAB
            ======================================================== */}
        {activeTab === "latihan" && (
          <div className="flex flex-col gap-6">
            <div className="clay-card rounded-3xl p-6 sm:p-8 border border-rose-950/80 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-950/60 pb-4">
                <div>
                  <span className="text-[11px] font-black uppercase text-amber-400 bg-amber-950/80 border border-amber-500/30 px-3 py-1 rounded-lg">
                    Evaluasi & Ujian Bab
                  </span>
                  <h3 className="font-black text-amber-100 text-xl mt-3">
                    Latihan Soal CBT • 第{babNum}課 ({questions.length} Butir Soal)
                  </h3>
                  <p className="text-xs text-rose-200/70 mt-1">
                    Format resmi JFT-Basic A2 dengan regulasi 4 seksi dan audio listening otentik.
                  </p>
                </div>

                <Link
                  href={`/cbt/${babNum}`}
                  className="clay-btn-gold px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition shadow-xl hover:scale-105 shrink-0"
                >
                  Mulai Simulasi Penuh CBT Bab {babNum < 10 ? `0${babNum}` : babNum}
                </Link>
              </div>

              {/* OVERVIEW SECTIONS IN THIS CHAPTER */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="bg-[#1C050E] p-4 rounded-xl border border-rose-950/60 text-center">
                  <span className="text-[11px] font-bold text-rose-300/70 block">Section 1</span>
                  <span className="font-black text-amber-200 text-sm mt-0.5 block">文字・語彙 (Moji)</span>
                  <span className="text-xs font-mono text-amber-400 mt-1 block">25 Soal</span>
                </div>
                <div className="bg-[#1C050E] p-4 rounded-xl border border-rose-950/60 text-center">
                  <span className="text-[11px] font-bold text-rose-300/70 block">Section 2</span>
                  <span className="font-black text-amber-200 text-sm mt-0.5 block">会話・表現 (Kaiwa)</span>
                  <span className="text-xs font-mono text-amber-400 mt-1 block">25 Soal</span>
                </div>
                <div className="bg-[#1C050E] p-4 rounded-xl border border-rose-950/60 text-center">
                  <span className="text-[11px] font-bold text-rose-300/70 block">Section 3</span>
                  <span className="font-black text-amber-200 text-sm mt-0.5 block">聴解 (Choukai Audio)</span>
                  <span className="text-xs font-mono text-amber-400 mt-1 block">
                    {questions.filter((q) => q.section === "choukai").length || 20} Soal
                  </span>
                </div>
                <div className="bg-[#1C050E] p-4 rounded-xl border border-rose-950/60 text-center">
                  <span className="text-[11px] font-bold text-rose-300/70 block">Section 4</span>
                  <span className="font-black text-amber-200 text-sm mt-0.5 block">読解 (Dokkai Bacaan)</span>
                  <span className="text-xs font-mono text-amber-400 mt-1 block">
                    {questions.filter((q) => q.section === "dokkai").length || 20} Soal
                  </span>
                </div>
              </div>

              {/* PREVIEW SAMPLE QUESTIONS */}
              <div className="flex flex-col gap-3 mt-2">
                <h4 className="font-black text-xs text-amber-300 uppercase tracking-wider">
                  Contoh Butir Soal Terdaftar di Bab Ini:
                </h4>
                {questions.slice(0, 5).map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-[#240610] p-4 rounded-xl border border-rose-950/60 flex items-start justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-amber-400 uppercase text-[10px] bg-black/40 px-2 py-0.5 rounded">
                          {q.section} #{q.questionNumber}
                        </span>
                      </div>
                      <div className="font-semibold text-rose-100 whitespace-pre-line leading-relaxed">
                        {q.questionText}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PREV / NEXT CHAPTER NAVIGATION FOOTER */}
        <div className="clay-card rounded-2xl p-4 border border-current/10 flex items-center justify-between gap-4 mt-6">
          {babNum > 1 ? (
            <Link
              href={`/lms/irodori-a2-2/bab/${babNum - 1}`}
              className="clay-btn px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition"
            >
              <ArrowLeft className="w-4 h-4 text-amber-500" />
              Bab {babNum - 1}
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/lms/irodori-a2-2"
            className="text-xs font-extrabold uppercase tracking-wider opacity-70 hover:opacity-100 transition hidden sm:inline"
          >
            Kembali ke Silabus A2.2
          </Link>

          {babNum < 18 ? (
            <Link
              href={`/lms/irodori-a2-2/bab/${babNum + 1}`}
              className="clay-btn-gold px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition"
            >
              Bab {babNum + 1}
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/cbt/0"
              className="clay-btn-gold px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition"
            >
              Ujian Akhir (Fukushuu)
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </main>
      </div>
    </div>
  );
}
