"use client";

import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sliders,
  Flame,
  Shield,
  Layers,
  Wand2,
  X,
  Eye,
  Check,
  Zap,
  Globe,
  Settings,
  HelpCircle,
  FileArchive,
} from "lucide-react";
import { ParsedQuestion, parseWordDocx, parseBlackboardZip, parseRawTextQuestions } from "@/lib/quizParsers";

export interface VillageEnvironment {
  id: "konoha" | "suna" | "kiri" | "kumo" | "iwa" | "shuumatsu";
  name: string;
  jpName: string;
  desc: string;
  accentColor: string;
  bgGradient: string;
  jutsuName: string;
  jutsuDesc: string;
  element: string;
}

export const VILLAGE_ENVIRONMENTS: VillageEnvironment[] = [
  {
    id: "konoha",
    name: "Konohagakure (Desa Daun)",
    jpName: "木ノ葉隠れの里",
    desc: "Hutan Kematian & Arena Ujian Chuunin kayu klasik yang legendaris.",
    accentColor: "from-emerald-600 to-green-700",
    bgGradient: "bg-[#0b1c11]",
    jutsuName: "Katon: Goukakyuu no Jutsu (火遁・豪火球の術)",
    jutsuDesc: "Semburan bola api membara membakar zona jawaban yang salah!",
    element: "🍃 Elemen Daun & Kayu",
  },
  {
    id: "suna",
    name: "Sunagakure (Desa Pasir)",
    jpName: "砂隠れの里",
    desc: "Lembah gurun pasir tandus dengan terpaan badai angin kencang.",
    accentColor: "from-amber-600 to-yellow-700",
    bgGradient: "bg-[#211504]",
    jutsuName: "Sabaku Kyuu (砂縛柩)",
    jutsuDesc: "Jebakan pasir hisap mengurung dan menelan shinobi yang salah!",
    element: "⏳ Elemen Pasir & Angin",
  },
  {
    id: "kiri",
    name: "Kirigakure (Desa Kabut)",
    jpName: "霧隠れの里",
    desc: "Jembatan besar di atas danau luas diselimuti kabut tebal pembunuh.",
    accentColor: "from-cyan-600 to-blue-800",
    bgGradient: "bg-[#071724]",
    jutsuName: "Suiton: Daibakufu no Jutsu (水遁・大瀑布の術)",
    jutsuDesc: "Pusaran air bah raksasa menyapu bersih area yang tidak tepat!",
    element: "🌊 Elemen Air & Kabut",
  },
  {
    id: "kumo",
    name: "Kumogakure (Desa Awan)",
    jpName: "雲隠れの里",
    desc: "Puncak tebing curam di atas awan tinggi dengan kilatan petir.",
    accentColor: "from-purple-600 to-indigo-800",
    bgGradient: "bg-[#180a24]",
    jutsuName: "Raiton: Ikazuchi (雷遁・雷)",
    jutsuDesc: "Sambaran petir ungu berkekuatan tinggi menghantam zona salah!",
    element: "⚡ Elemen Petir & Awan",
  },
  {
    id: "iwa",
    name: "Iwagakure (Desa Batu)",
    jpName: "岩隠れの里",
    desc: "Ngarai bebatuan cadas terjal dengan benteng pertahanan tanah liat.",
    accentColor: "from-amber-800 to-stone-800",
    bgGradient: "bg-[#1f1510]",
    jutsuName: "Doton: Doryuuheki (土遁・土流壁)",
    jutsuDesc: "Reruntuhan dinding batu cadas menimpa shinobi di zona salah!",
    element: "🪨 Elemen Tanah & Cadas",
  },
  {
    id: "shuumatsu",
    name: "Shūmatsu no Tani (Lembah Akhir)",
    jpName: "終末の谷",
    desc: "Arena duel bersejarah di antara patung Madara Uchiha & Hashirama Senju.",
    accentColor: "from-rose-600 to-purple-900",
    bgGradient: "bg-[#240612]",
    jutsuName: "Shinra Tensei & Rasengan Clash",
    jutsuDesc: "Ledakan chakra dahsyat melenyapkan zona yang salah sepenuhnya!",
    element: "⚔️ Arena Puncak Finalis",
  },
];

interface ShinobiQuizCreatorStudioProps {
  onStartGame: (questions: ParsedQuestion[], village: VillageEnvironment, rounds: number, hpDamage: number, timeLimit: number) => void;
  onClose: () => void;
}

export default function ShinobiQuizCreatorStudio({ onStartGame, onClose }: ShinobiQuizCreatorStudioProps) {
  // Tabs: 'ai' | 'import' | 'manual' | 'settings'
  const [activeTab, setActiveTab] = useState<"ai" | "import" | "manual" | "settings">("ai");

  // Selected Village
  const [selectedVillage, setSelectedVillage] = useState<VillageEnvironment>(VILLAGE_ENVIRONMENTS[0]);

  // Game Rules
  const [roundsCount, setRoundsCount] = useState<number>(10);
  const [hpDamage, setHpDamage] = useState<number>(10);
  const [timeLimit, setTimeLimit] = useState<number>(15);

  // Active Questions List
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);

  // AI Generator Form State
  const [aiTopic, setAiTopic] = useState<string>("Irodori A2.2 Bab 12 - Berbelanja Elektronik & Menawar Harga");
  const [aiChapter, setAiChapter] = useState<number>(12);
  const [aiCount, setAiCount] = useState<number>(10);
  const [aiType, setAiType] = useState<"mc" | "ox" | "mixed">("mixed");
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Document Import State
  const [rawTextImport, setRawTextImport] = useState<string>("");
  const [isParsingDoc, setIsParsingDoc] = useState<boolean>(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  // Manual Form State
  const [manualQ, setManualQ] = useState<string>("");
  const [manualType, setManualType] = useState<"mc" | "ox">("mc");
  const [manualA, setManualA] = useState<string>("");
  const [manualB, setManualB] = useState<string>("");
  const [manualC, setManualC] = useState<string>("");
  const [manualD, setManualD] = useState<string>("");
  const [manualKey, setManualKey] = useState<"a" | "b" | "c" | "d">("a");
  const [manualExp, setManualExp] = useState<string>("");

  // ============================================================================
  // HANDLER: AI GENERATOR
  // ============================================================================
  const handleGenerateAi = async () => {
    try {
      setIsGeneratingAi(true);
      setAiError(null);

      const res = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          chapter: aiChapter,
          count: aiCount,
          type: aiType,
          villageTheme: selectedVillage.id,
          customPrompt: aiPrompt,
        }),
      });

      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setQuestions(json.data);
        setImportNotice(`✨ Berhasil mengenerate ${json.data.length} butir soal via AI Assistant!`);
      } else {
        setAiError(json.error || "Gagal mengenerate soal.");
      }
    } catch (err: any) {
      setAiError("Terjadi kesalahan: " + err.message);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // ============================================================================
  // HANDLER: DOKUMEN WORD (.DOCX) & BLACKBOARD ZIP (.ZIP)
  // ============================================================================
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsParsingDoc(true);
      setImportNotice(null);
      const arrayBuffer = await file.arrayBuffer();

      if (file.name.endsWith(".docx")) {
        const parsed = await parseWordDocx(arrayBuffer);
        if (parsed.length > 0) {
          setQuestions((prev) => [...prev, ...parsed]);
          setImportNotice(`✅ Berhasil mengekstrak ${parsed.length} soal dari dokumen Word (${file.name})!`);
        } else {
          setImportNotice("⚠️ Tidak ditemukan pola soal yang valid dalam dokumen Word tersebut.");
        }
      } else if (file.name.endsWith(".zip")) {
        const parsed = await parseBlackboardZip(arrayBuffer);
        if (parsed.length > 0) {
          setQuestions((prev) => [...prev, ...parsed]);
          setImportNotice(`✅ Berhasil mengekstrak ${parsed.length} soal dari paket Blackboard ZIP (${file.name})!`);
        } else {
          setImportNotice("⚠️ Tidak dapat mengekstrak soal Blackboard dari berkas ZIP tersebut.");
        }
      } else if (file.name.endsWith(".txt") || file.name.endsWith(".csv")) {
        const text = await file.text();
        const parsed = parseRawTextQuestions(text);
        if (parsed.length > 0) {
          setQuestions((prev) => [...prev, ...parsed]);
          setImportNotice(`✅ Berhasil mengekstrak ${parsed.length} soal dari file teks (${file.name})!`);
        }
      } else {
        alert("Format file belum didukung. Harap upload .docx, .zip (Blackboard), atau .txt");
      }
    } catch (err: any) {
      alert("Gagal membaca file: " + err.message);
    } finally {
      setIsParsingDoc(false);
      e.target.value = "";
    }
  };

  const handleParseRawText = () => {
    if (!rawTextImport.trim()) return;
    const parsed = parseRawTextQuestions(rawTextImport);
    if (parsed.length > 0) {
      setQuestions((prev) => [...prev, ...parsed]);
      setImportNotice(`✅ Berhasil mem-parsing ${parsed.length} soal dari teks!`);
      setRawTextImport("");
    } else {
      alert("Tidak ditemukan pola soal (misal: 1. Soal... A. Opsi... Kunci: A).");
    }
  };

  // ============================================================================
  // HANDLER: TAMBAH SOAL MANUAL
  // ============================================================================
  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQ.trim() || !manualA.trim() || !manualB.trim()) {
      alert("Harap isi pertanyaan dan minimal Opsi A & B.");
      return;
    }

    const newQ: ParsedQuestion = {
      id: `manual_${Date.now()}`,
      questionText: manualQ.trim(),
      type: manualType,
      optionA: manualA.trim(),
      optionB: manualB.trim(),
      optionC: manualType === "ox" ? "" : manualC.trim() || "Pilihan C",
      optionD: manualType === "ox" ? "" : manualD.trim() || "Pilihan D",
      answerKey: manualKey,
      explanation: manualExp.trim() || undefined,
      villageTheme: selectedVillage.id,
    };

    setQuestions((prev) => [...prev, newQ]);
    setManualQ("");
    setManualA("");
    setManualB("");
    setManualC("");
    setManualD("");
    setManualExp("");
  };

  const handleDeleteQuestion = (id: string | number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleLaunchArena = () => {
    if (questions.length === 0) {
      alert("Silakan buat atau impor soal terlebih dahulu!");
      return;
    }
    onStartGame(questions, selectedVillage, roundsCount, hpDamage, timeLimit);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="clay-card max-w-5xl w-full my-auto flex flex-col max-h-[92vh] overflow-hidden border border-rose-500/40 shadow-2xl bg-[#1a070e]">
        {/* HEADER STUDIO */}
        <div className="p-5 sm:p-6 border-b border-rose-900/50 flex items-center justify-between bg-gradient-to-r from-[#2c0812] to-[#3a0d1b]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-600 text-stone-950 flex items-center justify-center font-black shadow-lg">
              <Wand2 className="w-6 h-6 text-stone-950" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-2">
                Shinobi Quiz Studio & Arena Maker
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  ZEP Clone Engine
                </span>
              </h2>
              <p className="text-xs text-rose-300/80">
                Buat kuis otomatis dengan AI, impor Word / Blackboard ZIP, dan atur arena desa ninja Naruto.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-900/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY UTAMA: 2 KOLOM (KIRI = BUILDER / TABS, KANAN = DAFTAR SOAL & DESA) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* KOLOM KIRI (7/12): BUILDER TABS */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* TAB SELECTOR */}
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-[#25060e] border border-rose-900/50 text-xs font-black">
              <button
                onClick={() => setActiveTab("ai")}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === "ai"
                    ? "bg-gradient-to-r from-amber-500 to-rose-600 text-stone-950 shadow-md"
                    : "text-rose-300 hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Generator
              </button>
              <button
                onClick={() => setActiveTab("import")}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === "import"
                    ? "bg-gradient-to-r from-amber-500 to-rose-600 text-stone-950 shadow-md"
                    : "text-rose-300 hover:text-white"
                }`}
              >
                <FileArchive className="w-3.5 h-3.5" /> Word / ZIP
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === "manual"
                    ? "bg-gradient-to-r from-amber-500 to-rose-600 text-stone-950 shadow-md"
                    : "text-rose-300 hover:text-white"
                }`}
              >
                <Plus className="w-3.5 h-3.5" /> Manual
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
                  activeTab === "settings"
                    ? "bg-gradient-to-r from-amber-500 to-rose-600 text-stone-950 shadow-md"
                    : "text-rose-300 hover:text-white"
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> Desa & Rules
              </button>
            </div>

            {/* NOTIFIKASI / STATUS */}
            {importNotice && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 font-bold flex items-center justify-between">
                <span>{importNotice}</span>
                <button onClick={() => setImportNotice(null)} className="text-emerald-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* TAB 1: AI ASSISTANT GENERATOR */}
            {activeTab === "ai" && (
              <div className="clay-card p-5 border border-amber-500/30 flex flex-col gap-4 bg-gradient-to-br from-[#2a0913] to-[#340c17]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase text-amber-300">
                      AI Shinobi Quiz Generator (Like ZEP AI)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                    Otomatis 1-Klik
                  </span>
                </div>

                <div className="flex flex-col gap-3 text-xs">
                  <div>
                    <label className="font-bold text-rose-200 mb-1 block">Topik / Materi Pelajaran:</label>
                    <input
                      type="text"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder="Contoh: Bab 12 - Diskon & Belanja Elektronik..."
                      className="w-full p-2.5 rounded-xl bg-[#1a050a] border border-rose-900 text-white font-medium outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="font-bold text-rose-200 mb-1 block">Bab Irodori:</label>
                      <select
                        value={aiChapter}
                        onChange={(e) => setAiChapter(parseInt(e.target.value, 10))}
                        className="w-full p-2.5 rounded-xl bg-[#1a050a] border border-rose-900 text-white font-bold outline-none focus:border-amber-400"
                      >
                        {Array.from({ length: 18 }, (_, i) => i + 1).map((ch) => (
                          <option key={ch} value={ch}>
                            Bab {ch}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-rose-200 mb-1 block">Jumlah Soal:</label>
                      <select
                        value={aiCount}
                        onChange={(e) => setAiCount(parseInt(e.target.value, 10))}
                        className="w-full p-2.5 rounded-xl bg-[#1a050a] border border-rose-900 text-white font-bold outline-none focus:border-amber-400"
                      >
                        <option value={5}>5 Soal</option>
                        <option value={10}>10 Soal (Standar)</option>
                        <option value={15}>15 Soal</option>
                        <option value={20}>20 Soal</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-rose-200 mb-1 block">Tipe Arena:</label>
                      <select
                        value={aiType}
                        onChange={(e) => setAiType(e.target.value as any)}
                        className="w-full p-2.5 rounded-xl bg-[#1a050a] border border-rose-900 text-white font-bold outline-none focus:border-amber-400"
                      >
                        <option value="mixed">Campuran (MC + OX)</option>
                        <option value="mc">4 Gerbang (A/B/C/D)</option>
                        <option value="ox">Arena O / X (Benar/Salah)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-rose-200 mb-1 block">Instruksi Khusus (Opsional):</label>
                    <textarea
                      rows={2}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Contoh: Fokuskan pada kanji harga, pola ~yasuku narimasu, dan dialog tawar menawar..."
                      className="w-full p-2 rounded-xl bg-[#1a050a] border border-rose-900 text-white font-medium outline-none focus:border-amber-400 text-xs"
                    />
                  </div>

                  {aiError && (
                    <div className="p-2.5 bg-rose-950/60 border border-rose-500 rounded-xl text-rose-300 font-bold text-xs">
                      {aiError}
                    </div>
                  )}

                  <button
                    onClick={handleGenerateAi}
                    disabled={isGeneratingAi}
                    className="w-full py-3 clay-btn-gold rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-2 mt-1 disabled:opacity-50 text-stone-950"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isGeneratingAi ? "Sedang Mengenerate Soal dengan AI..." : "⚡ Generate Soal Otomatis Sekarang"}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: IMPOR BERKAS WORD (.DOCX) & BLACKBOARD ZIP (.ZIP) */}
            {activeTab === "import" && (
              <div className="clay-card p-5 border border-rose-500/30 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
                    <FileArchive className="w-4 h-4 text-amber-400" /> Impor Berkas Word & Blackboard
                  </span>
                  <span className="text-[10px] text-rose-300/80">Support .docx, .zip, .txt</span>
                </div>

                {/* Upload File Zone */}
                <label className="border-2 border-dashed border-rose-800/80 hover:border-amber-400/80 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#20050c] transition hover:bg-[#280811]">
                  <Upload className="w-8 h-8 text-amber-400 animate-bounce" />
                  <span className="text-xs font-black text-white">
                    Klik untuk Mengunggah Berkas Soal
                  </span>
                  <span className="text-[11px] text-rose-300/70 text-center">
                    Mendukung berkas <strong>Microsoft Word (.docx)</strong> dan <strong>Blackboard Pool (.zip)</strong>
                  </span>
                  <input
                    type="file"
                    accept=".docx,.zip,.txt,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isParsingDoc}
                  />
                  {isParsingDoc && (
                    <span className="text-xs text-amber-300 font-bold mt-2">Mengekstrak soal...</span>
                  )}
                </label>

                {/* Tempel Teks Langsung */}
                <div className="flex flex-col gap-2 pt-2 border-t border-rose-900/40">
                  <label className="text-xs font-bold text-rose-200">
                    Atau Tempel (Copy-Paste) Teks Soal Langsung:
                  </label>
                  <textarea
                    rows={4}
                    value={rawTextImport}
                    onChange={(e) => setRawTextImport(e.target.value)}
                    placeholder={"1. わたしは まいにち 7じに ______。\nA. おきます\nB. ねます\nC. いきます\nD. たべます\nKunci: A"}
                    className="w-full p-3 rounded-xl bg-[#1a050a] border border-rose-900 text-white font-mono text-xs outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleParseRawText}
                    className="py-2.5 clay-btn rounded-xl font-black text-xs shadow-md"
                  >
                    📥 Ekstrak Soal dari Teks yang Ditempel
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: INPUT SOAL MANUAL */}
            {activeTab === "manual" && (
              <form onSubmit={handleAddManual} className="clay-card p-5 border border-rose-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-300">
                    ✍️ Buat Butir Soal Baru Secara Manual
                  </span>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={manualType === "mc"}
                        onChange={() => setManualType("mc")}
                        name="qtype"
                      />
                      <span>4 Gerbang (MC)</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        checked={manualType === "ox"}
                        onChange={() => setManualType("ox")}
                        name="qtype"
                      />
                      <span>Arena O / X</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-rose-200 mb-1 block">Pertanyaan:</label>
                  <input
                    type="text"
                    value={manualQ}
                    onChange={(e) => setManualQ(e.target.value)}
                    placeholder="Masukkan pertanyaan atau kalimat rumpang..."
                    className="w-full p-2.5 rounded-xl bg-[#1a050a] border border-rose-900 text-white text-xs font-medium outline-none focus:border-amber-400"
                    required
                  />
                </div>

                {manualType === "mc" ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-amber-300 mb-1 block">Opsi A (Utara):</label>
                      <input
                        type="text"
                        value={manualA}
                        onChange={(e) => setManualA(e.target.value)}
                        className="w-full p-2 rounded-xl bg-[#1a050a] border border-rose-900 text-white text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-amber-300 mb-1 block">Opsi B (Timur):</label>
                      <input
                        type="text"
                        value={manualB}
                        onChange={(e) => setManualB(e.target.value)}
                        className="w-full p-2 rounded-xl bg-[#1a050a] border border-rose-900 text-white text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-amber-300 mb-1 block">Opsi C (Selatan):</label>
                      <input
                        type="text"
                        value={manualC}
                        onChange={(e) => setManualC(e.target.value)}
                        className="w-full p-2 rounded-xl bg-[#1a050a] border border-rose-900 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-amber-300 mb-1 block">Opsi D (Barat):</label>
                      <input
                        type="text"
                        value={manualD}
                        onChange={(e) => setManualD(e.target.value)}
                        className="w-full p-2 rounded-xl bg-[#1a050a] border border-rose-900 text-white text-xs"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] font-bold text-emerald-300 mb-1 block">Zona O (Kiri):</label>
                      <input
                        type="text"
                        value={manualA || "⭕ Benar (Maru)"}
                        onChange={(e) => setManualA(e.target.value)}
                        className="w-full p-2 rounded-xl bg-[#1a050a] border border-rose-900 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-rose-300 mb-1 block">Zona X (Kanan):</label>
                      <input
                        type="text"
                        value={manualB || "❌ Salah (Batsu)"}
                        onChange={(e) => setManualB(e.target.value)}
                        className="w-full p-2 rounded-xl bg-[#1a050a] border border-rose-900 text-white text-xs"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-amber-300 mb-1 block">Kunci Jawaban:</label>
                    <select
                      value={manualKey}
                      onChange={(e) => setManualKey(e.target.value as any)}
                      className="w-full p-2 rounded-xl bg-[#1a050a] border border-rose-900 text-white font-bold"
                    >
                      <option value="a">A {manualType === "ox" ? "(O / Benar)" : ""}</option>
                      <option value="b">B {manualType === "ox" ? "(X / Salah)" : ""}</option>
                      {manualType === "mc" && <option value="c">C</option>}
                      {manualType === "mc" && <option value="d">D</option>}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-rose-200 mb-1 block">Penjelasan (Opsional):</label>
                    <input
                      type="text"
                      value={manualExp}
                      onChange={(e) => setManualExp(e.target.value)}
                      placeholder="Alasan jawaban benar..."
                      className="w-full p-2 rounded-xl bg-[#1a050a] border border-rose-900 text-white text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 clay-btn rounded-xl font-black text-xs shadow-md mt-1"
                >
                  ➕ Simpan Butir Soal ke Daftar
                </button>
              </form>
            )}

            {/* TAB 4: PILIHAN DESA & REGULASI PERTANDINGAN */}
            {activeTab === "settings" && (
              <div className="clay-card p-5 border border-rose-500/30 flex flex-col gap-4">
                <span className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-400" /> Regulasi Pertandingan & Arena
                </span>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-rose-200 mb-1 block">Jumlah Ronde:</label>
                    <input
                      type="number"
                      value={roundsCount}
                      onChange={(e) => setRoundsCount(Math.max(1, parseInt(e.target.value, 10) || 10))}
                      min={1}
                      max={30}
                      className="w-full p-2.5 rounded-xl bg-[#1a050a] border border-rose-900 text-white font-bold"
                    />
                    <span className="text-[10px] text-rose-300/70 mt-0.5 block">Default 10 Ronde</span>
                  </div>

                  <div>
                    <label className="font-bold text-rose-200 mb-1 block">Pengurangan HP / Hit:</label>
                    <input
                      type="number"
                      value={hpDamage}
                      onChange={(e) => setHpDamage(Math.max(1, parseInt(e.target.value, 10) || 10))}
                      min={5}
                      max={50}
                      className="w-full p-2.5 rounded-xl bg-[#1a050a] border border-rose-900 text-white font-bold"
                    />
                    <span className="text-[10px] text-rose-300/70 mt-0.5 block">Default 10 HP / Salah</span>
                  </div>

                  <div>
                    <label className="font-bold text-rose-200 mb-1 block">Waktu Berpindah:</label>
                    <select
                      value={timeLimit}
                      onChange={(e) => setTimeLimit(parseInt(e.target.value, 10))}
                      className="w-full p-2.5 rounded-xl bg-[#1a050a] border border-rose-900 text-white font-bold"
                    >
                      <option value={10}>10 Detik (Cepat)</option>
                      <option value={15}>15 Detik (Ideal)</option>
                      <option value={20}>20 Detik</option>
                      <option value={30}>30 Detik (Santai)</option>
                    </select>
                    <span className="text-[10px] text-rose-300/70 mt-0.5 block">Timer per butir soal</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KOLOM KANAN (5/12): PEMILIHAN ARENA DESA & PREVIEW SOAL */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* PILIHAN ARENA 6 DESA NINJA */}
            <div className="clay-card p-4 border border-rose-400/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-amber-400" /> Pilih Arena Desa Naruto
                </span>
                <span className="text-[10px] text-rose-300/80 font-bold">{selectedVillage.jpName}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {VILLAGE_ENVIRONMENTS.map((v) => {
                  const isSelected = selectedVillage.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVillage(v)}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                        isSelected
                          ? "bg-gradient-to-r from-rose-700 to-rose-900 border-amber-400 ring-2 ring-amber-400/50 shadow-lg"
                          : "bg-[#25060e] border-rose-900/60 hover:bg-[#340c17]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs text-white">{v.name.split(" ")[0]}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                      </div>
                      <span className="text-[10px] text-rose-200/80 line-clamp-1">{v.element}</span>
                    </button>
                  );
                })}
              </div>

              {/* Box Preview Desa Aktif */}
              <div className={`p-3 rounded-xl border border-rose-800/60 ${selectedVillage.bgGradient} flex flex-col gap-1`}>
                <span className="text-xs font-black text-amber-300">
                  {selectedVillage.name} ({selectedVillage.jpName})
                </span>
                <p className="text-[11px] text-rose-100/90 leading-tight">
                  {selectedVillage.desc}
                </p>
                <div className="text-[10px] font-bold text-amber-400 mt-1">
                  ⚡ Serangan: {selectedVillage.jutsuName}
                </div>
              </div>
            </div>

            {/* DAFTAR SOAL TERKUMPUL */}
            <div className="clay-card p-4 border border-rose-400/30 flex-1 flex flex-col gap-3 min-h-[220px]">
              <div className="flex items-center justify-between border-b border-rose-900/40 pb-2">
                <span className="text-xs font-black uppercase text-amber-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" /> Gulungan Soal ({questions.length} Butir)
                </span>
                {questions.length > 0 && (
                  <button
                    onClick={() => setQuestions([])}
                    className="text-[10px] font-bold text-rose-400 hover:text-white"
                  >
                    Kosongkan
                  </button>
                )}
              </div>

              {questions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-rose-300/60">
                  <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-xs font-bold">Belum ada soal.</p>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    Gunakan <strong>AI Generator</strong> atau <strong>Impor Word / ZIP</strong> di samping.
                  </p>
                </div>
              ) : (
                <div className="flex-1 max-h-56 overflow-y-auto flex flex-col gap-2 pr-1">
                  {questions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="p-2.5 rounded-xl bg-[#20050c] border border-rose-900/50 flex items-start justify-between gap-2 text-xs"
                    >
                      <div className="flex-1">
                        <div className="font-bold text-white line-clamp-1">
                          #{idx + 1}. {q.questionText}
                        </div>
                        <div className="text-[10px] text-amber-300/80 mt-0.5 flex items-center gap-2">
                          <span className="uppercase px-1.5 py-0.2 rounded bg-black/40 border border-rose-900">
                            {q.type.toUpperCase()}
                          </span>
                          <span>Kunci: {q.answerKey.toUpperCase()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="text-rose-400 hover:text-white p-1"
                        title="Hapus soal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* TOMBOL LUNCURKAN ARENA GAME */}
              <button
                onClick={handleLaunchArena}
                disabled={questions.length === 0}
                className="w-full py-3.5 clay-btn-gold rounded-xl font-black text-xs shadow-xl flex items-center justify-center gap-2 text-stone-950 disabled:opacity-40 disabled:cursor-not-allowed uppercase tracking-wider"
              >
                <Flame className="w-4 h-4 fill-stone-950" />
                Luncurkan Shinobi ZEP Arena ➔
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
