"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Settings,
  Users,
  BookOpen,
  Layers,
  Award,
  Database,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Volume2,
  ImageIcon,
  Sparkles,
  Server,
  FileText,
  Lock,
  RotateCcw,
  ExternalLink,
  UploadCloud,
} from "lucide-react";
import BulkQuestionImporter from "@/components/admin/BulkQuestionImporter";

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

const ADMIN_TABS = [
  { id: "general", label: "General", desc: "Ikhtisar Server & Sistem LMS" },
  { id: "questions", label: "Bank Soal", desc: "Buat, Edit & Kelola Soal Ujian" },
  { id: "import", label: "Impor Soal Massal", desc: "Upload Berkas Word (.docx), Blackboard, atau Aiken" },
  { id: "lkpd", label: "Tugas LKPD", desc: "Periksa Lembar Kerja & Nilai Siswa" },
  { id: "grades", label: "Grades CBT", desc: "Rekap Nilai & Hasil Ujian Simulator" },
  { id: "courses", label: "Courses", desc: "Manajemen Silabus & Bab" },
  { id: "users", label: "Users", desc: "Siswa, Guru & Hak Akses" },
  { id: "server", label: "Server", desc: "Koneksi Database & Storage CDN" },
];

export default function SiteAdministrationPage() {
  const [activeTab, setActiveTab] = useState("questions");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminToken, setAdminToken] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [passInput, setPassInput] = useState("");

  // Bank Soal State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedSection, setSelectedSection] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal Create / Edit Question
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Question>>({
    chapter: 1,
    section: "moji_goi",
    level: "A2.2",
    questionNumber: 1,
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    answerKey: "a",
    stimulusText: "",
    imageR2Url: "",
    audioR2Url: "",
    explanation: "",
  });

  // Simple passgate for teacher / admin with secure server verification
  const handleAuth = async () => {
    if (!passInput) {
      alert("Silakan masukkan kata sandi.");
      return;
    }
    try {
      setIsAuthenticating(true);
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passInput }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setAdminToken(data.token);
        setIsAuthenticated(true);
      } else {
        alert(data.error || "Kata sandi admin/guru salah!");
      }
    } catch (err: any) {
      alert("Gagal memverifikasi kata sandi admin.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const secParam = selectedSection !== "all" ? `&section=${selectedSection}` : "";
      const res = await fetch(`/api/questions?chapter=${selectedChapter}${secParam}&includeAnswers=true`, {
        headers: adminToken ? { "x-admin-key": adminToken } : {},
      });
      const json = await res.json();
      if (json.success) {
        setQuestions(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat soal:", err);
    } finally {
      setLoading(false);
    }
  };

  // State untuk Tab Grades (Rekap Nilai)
  const [examSessionsList, setExamSessionsList] = useState<any[]>([]);
  const [loadingGrades, setLoadingGrades] = useState<boolean>(false);
  const [gradeChapterFilter, setGradeChapterFilter] = useState<string>("all");

  const fetchGrades = async () => {
    try {
      setLoadingGrades(true);
      const res = await fetch("/api/exam-sessions");
      const json = await res.json();
      if (json.success) {
        setExamSessionsList(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat rekap nilai:", err);
    } finally {
      setLoadingGrades(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuestions();
    }
  }, [selectedChapter, selectedSection, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "grades") {
      fetchGrades();
    }
  }, [activeTab, isAuthenticated]);

  // State untuk Tab LKPD (Lembar Kerja Peserta Didik)
  const [lkpdList, setLkpdList] = useState<any[]>([]);
  const [loadingLkpd, setLoadingLkpd] = useState(false);
  const [selectedLkpd, setSelectedLkpd] = useState<any | null>(null);
  const [gradeScoreInput, setGradeScoreInput] = useState<number>(85);
  const [gradeFeedbackInput, setGradeFeedbackInput] = useState<string>("");
  const [savingGrade, setSavingGrade] = useState(false);

  const fetchLkpd = async () => {
    try {
      setLoadingLkpd(true);
      const res = await fetch("/api/lkpd");
      const json = await res.json();
      if (json.success) {
        setLkpdList(json.data);
      }
    } catch (err) {
      console.error("Gagal memuat daftar LKPD:", err);
    } finally {
      setLoadingLkpd(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === "lkpd") {
      fetchLkpd();
    }
  }, [activeTab, isAuthenticated]);

  const handleOpenGradeModal = (submission: any) => {
    setSelectedLkpd(submission);
    setGradeScoreInput(submission.score ?? 85);
    setGradeFeedbackInput(submission.feedback ?? "Pekerjaan sangat baik. Penggunaan pola kalimat dan pemahaman konteks kerja sudah tepat.");
  };

  const handleSaveGrade = async () => {
    if (!selectedLkpd) return;
    try {
      setSavingGrade(true);
      const res = await fetch("/api/lkpd", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(adminToken ? { "x-admin-key": adminToken } : {}),
        },
        body: JSON.stringify({
          id: selectedLkpd.id,
          score: gradeScoreInput,
          feedback: gradeFeedbackInput,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setLkpdList((prev) =>
          prev.map((item) =>
            item.id === selectedLkpd.id
              ? { ...item, score: gradeScoreInput, feedback: gradeFeedbackInput, status: "graded" }
              : item
          )
        );
        setSelectedLkpd(null);
        alert("✅ Penilaian & Catatan Feedback berhasil disimpan untuk siswa!");
      } else {
        alert("Gagal menyimpan nilai: " + json.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSavingGrade(false);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({
      chapter: selectedChapter,
      section: selectedSection !== "all" ? selectedSection : "moji_goi",
      level: "A2.2",
      questionNumber: questions.length + 1,
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      answerKey: "a",
      stimulusText: "",
      imageR2Url: "",
      audioR2Url: "",
      explanation: "",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (q: Question) => {
    setIsEditing(true);
    setFormData(q);
    setShowModal(true);
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch("/api/questions", {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(adminToken ? { "x-admin-key": adminToken } : {}),
        },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchQuestions();
      } else {
        alert("Gagal menyimpan: " + (json.error || "Terjadi kesalahan"));
      }
    } catch (err) {
      console.error("Gagal menyimpan soal:", err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus butir soal #${id}? Tindakan ini permanen.`)) return;
    try {
      const res = await fetch(`/api/questions?id=${id}`, {
        method: "DELETE",
        headers: adminToken ? { "x-admin-key": adminToken } : {},
      });
      const json = await res.json();
      if (json.success) {
        fetchQuestions();
      } else {
        alert("Gagal menghapus soal: " + (json.error || "Terjadi kesalahan"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.optionA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.optionB.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.stimulusText && q.stimulusText.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Jika belum login admin
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2D0B16] via-[#1E070F] to-[#120308] text-amber-50 flex items-center justify-center p-6">
        <div className="clay-card rounded-3xl p-8 max-w-md w-full border border-rose-900/60 text-center flex flex-col gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-rose-600 text-stone-950 flex items-center justify-center mx-auto shadow-xl">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-amber-100">Site Administration</h2>
            <p className="text-xs text-rose-200/70 mt-1">
              Masukkan kata sandi administrator atau guru untuk mengelola bank soal dan konfigurasi LMS.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="password"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              placeholder="Masukkan Kata Sandi Administrator"
              className="p-3.5 rounded-xl bg-[#1A050D] border border-rose-900/80 text-amber-100 text-sm outline-none focus:border-amber-400 transition text-center"
            />
            <button
              onClick={handleAuth}
              disabled={isAuthenticating}
              className="clay-btn-gold py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition disabled:opacity-50"
            >
              {isAuthenticating ? "Memverifikasi..." : "Buka Panel Administrator"}
            </button>
            <Link href="/" className="text-xs text-rose-300/60 hover:text-amber-200 transition">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2D0B16] via-[#1E070F] to-[#120308] text-amber-50 flex flex-col font-sans">
      {/* 1. HEADER SITE ADMINISTRATION */}
      <header className="clay-card border-b border-rose-950/60 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-rose-950/80 text-amber-300 hover:text-white transition border border-rose-900/40"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-black text-amber-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Site administration
            </h1>
            <p className="text-[11px] text-rose-300/60">Pusat Manajemen Bank Soal & Kursus LMS</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Mode Guru Aktif
          </span>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs text-rose-300/60 hover:text-rose-100 transition"
          >
            Keluar
          </button>
        </div>
      </header>

      {/* 2. TAB NAVIGASI PERSIS STYLE MOODLE (General, Users, Courses, Grades, Server, dll) */}
      <div className="bg-[#1C050E] border-b border-rose-950/80 px-6 overflow-x-auto sticky top-[65px] z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2">
          {ADMIN_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-4 text-xs font-black uppercase tracking-wider transition relative border-b-2 whitespace-nowrap ${
                  isActive
                    ? "text-amber-300 border-amber-400 bg-amber-500/10"
                    : "text-rose-200/60 border-transparent hover:text-rose-100 hover:border-rose-800"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 flex-1 flex flex-col gap-6 w-full">
        {/* ========================================================
            TAB 2: BANK SOAL (FITUR UTAMA: BIKIN SOAL LANGSUNG DI WEB)
            ======================================================== */}
        {activeTab === "questions" && (
          <div className="flex flex-col gap-6">
            {/* SUB-HEADER TOOLBAR */}
            <div className="clay-card rounded-2xl p-5 border border-rose-950/80 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Filter Bab */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-300/80">Pilih Bab:</span>
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(parseInt(e.target.value, 10))}
                    className="p-2 rounded-xl bg-[#1A050D] border border-rose-900/60 text-xs font-bold text-amber-200 outline-none cursor-pointer focus:border-amber-400"
                  >
                    <option value={0}>Fukushuu (Ujian Akbar)</option>
                    {Array.from({ length: 18 }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        第{num}課 (Bab {num < 10 ? `0${num}` : num})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter Seksi */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-300/80">Seksi:</span>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="p-2 rounded-xl bg-[#1A050D] border border-rose-900/60 text-xs font-bold text-amber-200 outline-none cursor-pointer focus:border-amber-400"
                  >
                    <option value="all">Semua Seksi</option>
                    <option value="moji_goi">Moji & Goi (文字・語彙)</option>
                    <option value="kaiwa_hyougen">Kaiwa & Hyougen (会話・表現)</option>
                    <option value="choukai">Choukai (聴解 Audio)</option>
                    <option value="dokkai">Dokkai (読解 Wacana)</option>
                  </select>
                </div>

                {/* Search */}
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-rose-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari teks soal / opsi..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#1A050D] border border-rose-900/60 text-xs text-amber-100 placeholder-rose-400/50 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Action Buttons: Impor Massal & Buat Soal Baru */}
              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <button
                  onClick={() => setActiveTab("import")}
                  className="clay-btn px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-lg hover:scale-105 transition justify-center text-amber-300 border border-amber-500/40"
                >
                  <UploadCloud className="w-4 h-4 text-amber-400" />
                  Impor Word / Blackboard
                </button>
                <button
                  onClick={handleOpenCreate}
                  className="clay-btn-gold px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-lg hover:scale-105 transition justify-center"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  Buat Soal Baru
                </button>
              </div>
            </div>

            {/* TABEL DAFTAR SOAL */}
            <div className="clay-card rounded-2xl p-6 border border-rose-950/80 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-rose-950/60 pb-3">
                <span className="text-xs font-black text-amber-200 uppercase tracking-wider">
                  Daftar Soal Terdaftar: {filteredQuestions.length} Butir Soal
                </span>
                <span className="text-[11px] text-rose-300/60 font-mono">
                  Bab {selectedChapter} • {selectedSection}
                </span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs font-bold text-rose-300 animate-pulse">
                  Mengambil data soal dari database Neon...
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="p-12 text-center text-xs text-rose-300/70">
                  Tidak ada soal yang ditemukan pada kriteria ini. Klik "Buat Soal Baru" untuk menambahkan.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="bg-[#240610] hover:bg-[#300816] p-4 sm:p-5 rounded-2xl border border-rose-950/80 hover:border-amber-500/30 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-950/90 border border-amber-500/30 px-2.5 py-0.5 rounded-md">
                            {q.section} #{q.questionNumber}
                          </span>
                          <span className="text-[10px] font-mono text-rose-300/60">ID #{q.id}</span>
                          <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            Kunci: {q.answerKey.toUpperCase()}
                          </span>
                          {q.audioR2Url && (
                            <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Volume2 className="w-3 h-3" /> Audio
                            </span>
                          )}
                          {q.imageR2Url && (
                            <span className="text-[10px] font-bold text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" /> Gambar
                            </span>
                          )}
                        </div>

                        {q.stimulusText && (
                          <div className="text-[11px] text-rose-300/80 italic mb-2 line-clamp-2 bg-[#1A050D] p-2 rounded-lg border border-rose-950/60">
                            {q.stimulusText}
                          </div>
                        )}

                        <div className="text-sm font-black text-white whitespace-pre-line leading-relaxed">
                          {q.questionText}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-rose-950/60 text-xs text-slate-200">
                          <div className={q.answerKey === "a" ? "text-emerald-300 font-bold" : ""}>
                            A. {q.optionA}
                          </div>
                          <div className={q.answerKey === "b" ? "text-emerald-300 font-bold" : ""}>
                            B. {q.optionB}
                          </div>
                          <div className={q.answerKey === "c" ? "text-emerald-300 font-bold" : ""}>
                            C. {q.optionC}
                          </div>
                          {q.optionD && (
                            <div className={q.answerKey === "d" ? "text-emerald-300 font-bold" : ""}>
                              D. {q.optionD}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tombol Aksi: Edit & Hapus */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                        <button
                          onClick={() => handleOpenEdit(q)}
                          className="clay-btn px-3 py-2 rounded-xl text-xs font-bold text-amber-200 hover:text-white flex items-center gap-1.5 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 hover:text-rose-100 transition border border-rose-900/60"
                          title="Hapus Soal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: IMPOR SOAL MASSAL (WORD / BLACKBOARD / AIKEN / CSV)
            ======================================================== */}
        {activeTab === "import" && (
          <BulkQuestionImporter
            defaultChapter={selectedChapter}
            defaultSection={selectedSection === "all" ? "moji_goi" : selectedSection}
            adminToken={adminToken}
            onSuccess={() => {
              fetchQuestions();
              setActiveTab("questions");
            }}
          />
        )}

        {/* ========================================================
            TAB 1: GENERAL (SYSTEM OVERVIEW)
            ======================================================== */}
        {activeTab === "general" && (
          <div className="clay-card rounded-2xl p-8 border border-rose-950/80 flex flex-col gap-6">
            <h3 className="text-base font-black text-amber-200 flex items-center gap-2">
              <Server className="w-5 h-5 text-amber-400" />
              Informasi Infrastruktur & Spesifikasi LMS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#1C050E] border border-rose-950/60">
                <span className="text-xs text-rose-300/60 block">Database Serverless</span>
                <span className="text-lg font-black text-amber-200 mt-1 block">Neon PostgreSQL</span>
                <span className="text-xs text-emerald-400 mt-2 block">✓ 770 Soal & 4.245 Vocab</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#1C050E] border border-rose-950/60">
                <span className="text-xs text-rose-300/60 block">Media CDN Storage</span>
                <span className="text-lg font-black text-amber-200 mt-1 block">Supabase Storage</span>
                <span className="text-xs text-emerald-400 mt-2 block">✓ 338 Audio & Gambar Aktif</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#1C050E] border border-rose-950/60">
                <span className="text-xs text-rose-300/60 block">Frontend Framework</span>
                <span className="text-lg font-black text-amber-200 mt-1 block">Next.js 15 (App Router)</span>
                <span className="text-xs text-emerald-400 mt-2 block">✓ Claymorphism Luxury UI</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: GRADES (REKAP NILAI SISWA DARI DATABASE EXAM_SESSIONS)
            ======================================================== */}
        {activeTab === "grades" && (
          <div className="flex flex-col gap-6">
            {/* TOOLBAR GRADES */}
            <div className="clay-card rounded-2xl p-5 border border-rose-950/80 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-amber-100">Rekap Nilai Siswa & Hasil CBT</h3>
                  <p className="text-[11px] text-rose-300/70">
                    Hasil pengerjaan CBT langsung tersimpan di Cloud Database Neon
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/rapor"
                  className="clay-nav-pill px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-xs font-bold text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Rapor Outsutsuki</span>
                </Link>
                <button
                  onClick={fetchGrades}
                  disabled={loadingGrades}
                  className="clay-nav-pill px-4 py-2 bg-[#25060e] hover:bg-[#380a15] text-xs font-bold text-amber-300 border border-amber-500/30 flex items-center gap-2 transition disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${loadingGrades ? "animate-spin" : ""}`} />
                  <span>Segarkan Data</span>
                </button>
              </div>
            </div>

            {/* STATS SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#1C050E] border border-rose-950/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-rose-300/60 block">Total Sesi Ujian</span>
                  <span className="text-xl font-black text-amber-200 mt-1 block">
                    {examSessionsList.length} Sesi
                  </span>
                </div>
                <Users className="w-6 h-6 text-rose-400/40" />
              </div>

              <div className="p-4 rounded-2xl bg-[#1C050E] border border-rose-950/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-rose-300/60 block">Tingkat Kelulusan (Pass Rate)</span>
                  <span className="text-xl font-black text-emerald-400 mt-1 block">
                    {examSessionsList.length > 0
                      ? Math.round(
                          (examSessionsList.filter((s) => s.isPassed).length /
                            examSessionsList.length) *
                            100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500/40" />
              </div>

              <div className="p-4 rounded-2xl bg-[#1C050E] border border-rose-950/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-rose-300/60 block">Rata-rata Skor Peserta</span>
                  <span className="text-xl font-black text-amber-300 mt-1 block">
                    {examSessionsList.length > 0
                      ? Math.round(
                          examSessionsList.reduce((acc, curr) => acc + (curr.totalScore || 0), 0) /
                            examSessionsList.length
                        )
                      : 0}
                    {" "}<span className="text-xs text-rose-400 font-normal">/ 250 pt</span>
                  </span>
                </div>
                <Sparkles className="w-6 h-6 text-amber-400/40" />
              </div>
            </div>

            {/* DAFTAR TABEL REKAP NILAI */}
            <div className="clay-card rounded-2xl border border-rose-950/80 overflow-hidden shadow-2xl">
              {loadingGrades ? (
                <div className="p-12 text-center flex flex-col items-center justify-center gap-3 text-rose-300">
                  <RotateCcw className="w-8 h-8 animate-spin text-amber-400" />
                  <p className="text-xs font-bold">Memuat rekap data ujian...</p>
                </div>
              ) : examSessionsList.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center gap-2 text-rose-300/60">
                  <Award className="w-10 h-10 text-rose-400/40" />
                  <p className="text-sm font-bold text-rose-200">Belum Ada Sesi Ujian Diselesaikan</p>
                  <p className="text-xs max-w-sm text-rose-400/60">
                    Ketika siswa menyelesaikan ujian CBT di menu Simulasi JFT-Basic, nilainya akan otomatis terekam di sini.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#19040C] border-b border-rose-950/80 text-rose-300/70 font-black uppercase tracking-wider text-[10px]">
                        <th className="py-3.5 px-4">Waktu Ujian</th>
                        <th className="py-3.5 px-4">Nama Peserta</th>
                        <th className="py-3.5 px-4">Bab / Tipe</th>
                        <th className="py-3.5 px-4 text-center">Moji Goi</th>
                        <th className="py-3.5 px-4 text-center">Kaiwa</th>
                        <th className="py-3.5 px-4 text-center">Choukai</th>
                        <th className="py-3.5 px-4 text-center">Dokkai</th>
                        <th className="py-3.5 px-4 text-center">Total Skor JFT</th>
                        <th className="py-3.5 px-4 text-center">Hasil 判定</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-950/60">
                      {examSessionsList.map((session) => {
                        const dateFormatted = session.completedAt
                          ? new Date(session.completedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-";

                        return (
                          <tr
                            key={session.id}
                            className="hover:bg-rose-950/30 transition text-rose-100 font-medium"
                          >
                            <td className="py-3.5 px-4 font-mono text-[11px] text-rose-300/80 whitespace-nowrap">
                              {dateFormatted}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-amber-200">
                              {session.studentName || "Peserta CBT"}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#1C050E] border border-rose-900/60 text-[10px] font-bold text-rose-200">
                                {session.chapter === 0
                                  ? "Fukushuu 1"
                                  : `第${session.chapter}課 (Bab 0${session.chapter})`}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-rose-200">
                              {session.scoreMojiGoi ?? "-"}
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-rose-200">
                              {session.scoreKaiwa ?? "-"}
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-rose-200">
                              {session.scoreChoukai ?? "-"}
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-rose-200">
                              {session.scoreDokkai ?? "-"}
                            </td>
                            <td className="py-3.5 px-4 text-center font-black font-mono text-sm text-amber-300">
                              {session.totalScore}
                              <span className="text-[10px] text-rose-400 font-normal"> / 250</span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {session.isPassed ? (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-black inline-flex items-center gap-1 shadow">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  合格 (Lulus)
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-700/60 text-rose-300 text-[11px] font-black inline-flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-rose-400" />
                                  不合格 (Belum)
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: TUGAS LKPD (LEMBAR KERJA SISWA & PENILAIAN GURU)
            ======================================================== */}
        {activeTab === "lkpd" && (
          <div className="flex flex-col gap-6">
            {/* TOOLBAR LKPD */}
            <div className="clay-card rounded-2xl p-5 border border-rose-950/80 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-amber-100">Manajemen Lembar Kerja (LKPD) & Portofolio Siswa</h3>
                  <p className="text-[11px] text-rose-300/70">
                    Periksa tugas penugasan Can-Do Irodori yang dikumpulkan siswa secara interaktif
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchLkpd}
                  disabled={loadingLkpd}
                  className="clay-nav-pill px-4 py-2 bg-[#25060e] hover:bg-[#380a15] text-xs font-bold text-amber-300 border border-amber-500/30 flex items-center gap-2 transition disabled:opacity-50"
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${loadingLkpd ? "animate-spin" : ""}`} />
                  <span>Segarkan Data</span>
                </button>
              </div>
            </div>

            {/* STATS LKPD */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#1C050E] border border-rose-950/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-rose-300/60 block">Total LKPD Masuk</span>
                  <span className="text-xl font-black text-amber-200 mt-1 block">
                    {lkpdList.length} Tugas
                  </span>
                </div>
                <Users className="w-6 h-6 text-rose-400/40" />
              </div>

              <div className="p-4 rounded-2xl bg-[#1C050E] border border-rose-950/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-rose-300/60 block">Perlu Dinilai (Pending)</span>
                  <span className="text-xl font-black text-amber-400 mt-1 block">
                    {lkpdList.filter((l) => l.status !== "graded").length} Tugas
                  </span>
                </div>
                <AlertCircle className="w-6 h-6 text-amber-400/40" />
              </div>

              <div className="p-4 rounded-2xl bg-[#1C050E] border border-rose-950/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-rose-300/60 block">Selesai Dinilai & Dinilai</span>
                  <span className="text-xl font-black text-emerald-400 mt-1 block">
                    {lkpdList.filter((l) => l.status === "graded").length} Tugas
                  </span>
                </div>
                <CheckCircle2 className="w-6 h-6 text-emerald-500/40" />
              </div>
            </div>

            {/* PINTASAN AKSES LANGSUNG LKPD OTENTIK BAB 1 - 12 */}
            <div className="clay-card rounded-2xl p-5 border border-rose-950/80 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-950/60 pb-2.5">
                <span className="text-xs font-black uppercase text-amber-300 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-amber-400" />
                  Akses Langsung Simulator LKPD Bab 01 s.d. 12 (Mode Guru):
                </span>
                <span className="text-[11px] text-rose-300/70">
                  Tinjauan Kunci Jawaban & Naskah Audio
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2.5 pt-1">
                {[
                  { num: 1, title: "第1課: 私のこと" },
                  { num: 2, title: "第2課: どんな人" },
                  { num: 3, title: "第3課: おすすめ" },
                  { num: 4, title: "第4課: 何時から" },
                  { num: 5, title: "第5課: 安全第一" },
                  { num: 6, title: "第6課: どうやって" },
                  { num: 7, title: "第7課: 雨が降ったら" },
                  { num: 8, title: "第8課: 屋台はどこ" },
                  { num: 9, title: "第9課: 成人の日" },
                  { num: 10, title: "第10課: どんな服" },
                  { num: 11, title: "第11課: ポイントカード" },
                  { num: 12, title: "第12課: このボタン" },
                ].map((b) => (
                  <a
                    key={b.num}
                    href={`/lkpd/bab${b.num}/index.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-[#20050F] hover:bg-[#380a15] text-center border border-rose-900/60 hover:border-amber-400 transition flex flex-col items-center gap-1 group shadow"
                  >
                    <span className="text-xs font-black text-amber-200 group-hover:text-amber-300">
                      {b.num < 10 ? `Bab 0${b.num}` : `Bab ${b.num}`}
                    </span>
                    <span className="text-[10px] text-rose-300/70 truncate w-full" title={b.title}>
                      {b.title}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* TABEL PENGUMPULAN LKPD */}
            <div className="clay-card rounded-2xl border border-rose-950/80 overflow-hidden shadow-2xl">
              {loadingLkpd ? (
                <div className="p-12 text-center flex flex-col items-center justify-center gap-3 text-rose-300">
                  <RotateCcw className="w-8 h-8 animate-spin text-amber-400" />
                  <p className="text-xs font-bold">Memuat data penugasan LKPD...</p>
                </div>
              ) : lkpdList.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center gap-2 text-rose-300/60">
                  <FileText className="w-10 h-10 text-rose-400/40" />
                  <p className="text-sm font-bold text-rose-200">Belum Ada Pengumpulan LKPD</p>
                  <p className="text-xs max-w-sm text-rose-400/60">
                    Siswa dapat mengerjakan dan mengumpulkan LKPD langsung melalui Tab &quot;3. LKPD Lembar Kerja Siswa&quot; pada setiap Bab di Modul LMS.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#19040C] border-b border-rose-950/80 text-rose-300/70 font-black uppercase tracking-wider text-[10px]">
                        <th className="py-3.5 px-4">Waktu Penyerahan</th>
                        <th className="py-3.5 px-4">Nama Siswa</th>
                        <th className="py-3.5 px-4">Bab LKPD</th>
                        <th className="py-3.5 px-4 text-center">Status</th>
                        <th className="py-3.5 px-4 text-center">Nilai (0-100)</th>
                        <th className="py-3.5 px-4">Catatan Guru</th>
                        <th className="py-3.5 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-950/60">
                      {lkpdList.map((item) => {
                        const dateFormatted = item.submittedAt
                          ? new Date(item.submittedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-";

                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-rose-950/30 transition text-rose-100 font-medium"
                          >
                            <td className="py-3.5 px-4 font-mono text-[11px] text-rose-300/80 whitespace-nowrap">
                              {dateFormatted}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-amber-200">
                              {item.studentName}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#1C050E] border border-rose-900/60 text-[10px] font-bold text-rose-200">
                                第{item.chapter}課 (Bab 0{item.chapter})
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              {item.status === "graded" ? (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold inline-flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  Sudah Dinilai
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-bold inline-flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-amber-400" />
                                  Menunggu Nilai
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center font-black font-mono text-sm text-amber-300">
                              {item.score !== null ? `${item.score} / 100` : "-"}
                            </td>
                            <td className="py-3.5 px-4 text-rose-300/80 max-w-xs truncate">
                              {item.feedback || "-"}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => handleOpenGradeModal(item)}
                                className="clay-btn-gold px-3 py-1 rounded-xl text-[11px] font-black inline-flex items-center gap-1 shadow hover:scale-105"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Periksa & Nilai</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB LAINNYA: COURSES, USERS, SERVER (PREVIEW)
            ======================================================== */}
        {activeTab !== "questions" && activeTab !== "general" && activeTab !== "grades" && activeTab !== "lkpd" && (
          <div className="clay-card rounded-2xl p-8 border border-rose-950/80 text-center flex flex-col items-center justify-center gap-3">
            <Settings className="w-10 h-10 text-amber-400 opacity-60" />
            <h3 className="text-base font-black text-amber-100">Modul Panel {activeTab.toUpperCase()}</h3>
            <p className="text-xs text-rose-200/70 max-w-md">
              Manajemen {activeTab} terintegrasi secara otomatis dengan database Neon dan Clerk Authentication.
            </p>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL EVALUASI & PENILAIAN LKPD OLEH SENSEI
          ======================================================== */}
      {selectedLkpd && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clay-card rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-rose-400/30 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-rose-900/60 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/30">
                  Evaluasi Lembar Kerja Siswa
                </span>
                <h3 className="text-base font-black text-amber-100 mt-1">
                  {selectedLkpd.studentName} • 第{selectedLkpd.chapter}課
                </h3>
              </div>
              <button
                onClick={() => setSelectedLkpd(null)}
                className="text-rose-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Jawaban Siswa */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-black uppercase text-rose-300">
                Isi Lembar Kerja Siswa:
              </span>
              <div className="p-4 rounded-2xl bg-[#17030B] border border-rose-950/80 max-h-60 overflow-y-auto flex flex-col gap-3 text-xs">
                {selectedLkpd.answersJson && typeof selectedLkpd.answersJson === "object" ? (
                  Object.entries(selectedLkpd.answersJson).map(([key, val]) => (
                    <div key={key} className="border-b border-rose-950/60 pb-2">
                      <span className="text-[10px] font-bold text-amber-400/80 block uppercase">
                        {key === "section3_portfolio" ? "Tugas Portofolio Can-Do" : key}:
                      </span>
                      <p className="text-rose-100 font-medium whitespace-pre-line mt-0.5">
                        {String(val) || "(Kosong)"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-rose-400">Tidak ada rincian jawaban teks.</p>
                )}
              </div>
            </div>

            {/* Form Input Nilai & Feedback */}
            <div className="flex flex-col gap-4 border-t border-rose-950/60 pt-4">
              <div>
                <label className="text-xs font-bold text-rose-200 block mb-1">
                  Nilai Skor Tugas (Skala 0 - 100) *:
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={gradeScoreInput}
                  onChange={(e) => setGradeScoreInput(parseInt(e.target.value, 10) || 0)}
                  className="w-36 p-2.5 rounded-xl bg-[#1C050E] border border-rose-900/60 text-sm font-black text-amber-300 outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-rose-200 block mb-1">
                  Catatan Evaluasi & Umpan Balik Guru (Feedback) *:
                </label>
                <textarea
                  rows={3}
                  value={gradeFeedbackInput}
                  onChange={(e) => setGradeFeedbackInput(e.target.value)}
                  placeholder="Berikan apresiasi dan catatan perbaikan tata bahasa..."
                  className="w-full p-3 rounded-xl bg-[#1C050E] border border-rose-900/60 text-xs text-rose-100 outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose-950/60">
              <button
                onClick={() => setSelectedLkpd(null)}
                className="px-4 py-2 rounded-xl bg-[#25060e] text-xs font-bold text-rose-300 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleSaveGrade}
                disabled={savingGrade}
                className="clay-btn-gold px-6 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{savingGrade ? "Menyimpan Nilai..." : "Simpan Nilai & Feedback"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL INLINE EDITOR / CREATOR SOAL BARU
          ======================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clay-card rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-rose-400/30 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-rose-900/60 pb-4">
              <div>
                <h3 className="text-base font-black text-amber-200">
                  {isEditing ? `Edit Butir Soal #${formData.id}` : "Buat Butir Soal Baru"}
                </h3>
                <p className="text-xs text-rose-300/70 mt-0.5">
                  Soal yang Anda simpan akan langsung aktif di Simulator CBT & LMS.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-rose-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-rose-200 block mb-1">Bab Ujian:</label>
                  <select
                    value={formData.chapter}
                    onChange={(e) => setFormData({ ...formData, chapter: parseInt(e.target.value, 10) })}
                    className="w-full p-2.5 rounded-xl bg-[#1A050D] border border-rose-900/60 text-amber-100 font-bold outline-none"
                  >
                    <option value={0}>Fukushuu (Ujian Akbar)</option>
                    {Array.from({ length: 18 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        第{n}課 (Bab {n < 10 ? `0${n}` : n})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-rose-200 block mb-1">Sub-Tes (Seksi):</label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#1A050D] border border-rose-900/60 text-amber-100 font-bold outline-none"
                  >
                    <option value="moji_goi">1. Moji & Goi</option>
                    <option value="kaiwa_hyougen">2. Kaiwa & Hyougen</option>
                    <option value="choukai">3. Choukai (Audio)</option>
                    <option value="dokkai">4. Dokkai (Wacana)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-rose-200 block mb-1">Kunci Jawaban:</label>
                  <select
                    value={formData.answerKey}
                    onChange={(e) => setFormData({ ...formData, answerKey: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#1A050D] border border-rose-900/60 text-emerald-400 font-black uppercase outline-none"
                  >
                    <option value="a">A</option>
                    <option value="b">B</option>
                    <option value="c">C</option>
                    <option value="d">D</option>
                  </select>
                </div>
              </div>

              {/* Wacana / Stimulus / Naskah */}
              <div>
                <label className="font-bold text-rose-200 block mb-1">
                  Wacana Stimulus / Naskah Audio (Opsional untuk Dokkai / Choukai):
                </label>
                <textarea
                  rows={3}
                  value={formData.stimulusText || ""}
                  onChange={(e) => setFormData({ ...formData, stimulusText: e.target.value })}
                  placeholder="【文章 1】\n［お知らせ］\n..."
                  className="w-full p-3 rounded-xl bg-[#1A050D] border border-rose-900/60 text-amber-100 outline-none focus:border-amber-400"
                />
              </div>

              {/* Teks Soal */}
              <div>
                <label className="font-bold text-rose-200 block mb-1">Teks Pertanyaan Soal *:</label>
                <textarea
                  rows={2}
                  required
                  value={formData.questionText || ""}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  placeholder="Contoh: 絵を見て、正しいことばを選んでください。"
                  className="w-full p-3 rounded-xl bg-[#1A050D] border border-rose-900/60 text-amber-100 font-bold outline-none focus:border-amber-400"
                />
              </div>

              {/* Opsi Jawaban */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-rose-200 block mb-1">Opsi A *:</label>
                  <input
                    type="text"
                    required
                    value={formData.optionA || ""}
                    onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#1A050D] border border-rose-900/60 text-amber-100 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-rose-200 block mb-1">Opsi B *:</label>
                  <input
                    type="text"
                    required
                    value={formData.optionB || ""}
                    onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#1A050D] border border-rose-900/60 text-amber-100 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-rose-200 block mb-1">Opsi C *:</label>
                  <input
                    type="text"
                    required
                    value={formData.optionC || ""}
                    onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#1A050D] border border-rose-900/60 text-amber-100 outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-rose-200 block mb-1">Opsi D (Opsional):</label>
                  <input
                    type="text"
                    value={formData.optionD || ""}
                    onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-[#1A050D] border border-rose-900/60 text-amber-100 outline-none"
                  />
                </div>
              </div>

              {/* Link Audio & Gambar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-rose-200 block mb-1">URL Audio (Choukai):</label>
                  <input
                    type="text"
                    value={formData.audioR2Url || ""}
                    onChange={(e) => setFormData({ ...formData, audioR2Url: e.target.value })}
                    placeholder="https://.../storage/v1/object/public/.../audio.mp3"
                    className="w-full p-2.5 rounded-xl bg-[#1A050D] border border-rose-900/60 text-amber-100 outline-none text-[11px]"
                  />
                </div>
                <div>
                  <label className="font-bold text-rose-200 block mb-1">URL Gambar Ilustrasi:</label>
                  <input
                    type="text"
                    value={formData.imageR2Url || ""}
                    onChange={(e) => setFormData({ ...formData, imageR2Url: e.target.value })}
                    placeholder="https://.../storage/v1/object/public/.../image.png"
                    className="w-full p-2.5 rounded-xl bg-[#1A050D] border border-rose-900/60 text-amber-100 outline-none text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-rose-900/60">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="clay-btn px-4 py-2.5 rounded-xl text-rose-300 font-bold hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="clay-btn-gold px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Terbitkan Soal Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
