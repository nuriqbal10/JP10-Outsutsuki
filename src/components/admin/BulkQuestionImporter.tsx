"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Sparkles,
  Layers,
  Save,
  RotateCcw,
  Check,
  FileSpreadsheet,
} from "lucide-react";

interface ParsedQuestionItem {
  questionNumber?: number;
  questionText: string;
  stimulusText?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD?: string;
  answerKey: string;
  hasDetectedKey: boolean;
  formatDetected: string;
}

interface BulkQuestionImporterProps {
  onSuccess: () => void;
  defaultChapter?: number;
  defaultSection?: string;
}

export default function BulkQuestionImporter({
  onSuccess,
  defaultChapter = 1,
  defaultSection = "moji_goi",
}: BulkQuestionImporterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [targetChapter, setTargetChapter] = useState<number>(defaultChapter);
  const [targetSection, setTargetSection] = useState<string>(defaultSection);

  // Result State
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestionItem[]>([]);
  const [formatDetected, setFormatDetected] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      await processFile(selected);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      await processFile(dropped);
    }
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setParsing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setParsedQuestions([]);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("/api/questions/import", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success) {
        setParsedQuestions(json.questions);
        setFormatDetected(json.formatDetected);
      } else {
        setErrorMessage(json.error || "Gagal memproses berkas.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Terjadi kesalahan jaringan saat memproses berkas.");
    } finally {
      setParsing(false);
    }
  };

  const handleKeyChange = (index: number, newKey: string) => {
    setParsedQuestions((prev) =>
      prev.map((q, idx) => (idx === index ? { ...q, answerKey: newKey.toLowerCase(), hasDetectedKey: true } : q))
    );
  };

  const handleSaveToDatabase = async () => {
    if (parsedQuestions.length === 0) return;
    setSaving(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/questions/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter: targetChapter,
          section: targetSection,
          items: parsedQuestions,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMessage(`Berhasil menyimpan ${json.totalInserted} butir soal ke database Neon!`);
        setParsedQuestions([]);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onSuccess();
      } else {
        setErrorMessage(json.error || "Gagal menyimpan soal ke database.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Terjadi kesalahan jaringan saat menyimpan ke database.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-amber-50">
      {/* 1. DROPZONE & TARGET SETTINGS */}
      <div className="clay-card rounded-2xl p-6 border border-rose-950/80 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-950/60 pb-4">
          <div>
            <h3 className="text-base font-black text-amber-100 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-amber-400" />
              Universal Question Bulk Importer
            </h3>
            <p className="text-xs text-rose-300/70 mt-1">
              Mendukung: <strong>Word (.docx) ber-Highlight</strong>, <strong>Blackboard (.txt)</strong>, <strong>Aiken (.txt)</strong>, dan <strong>Excel (.csv)</strong>.
            </p>
          </div>

          {/* TARGET SELECTION */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-rose-300">Target Bab:</span>
              <select
                value={targetChapter}
                onChange={(e) => setTargetChapter(parseInt(e.target.value, 10))}
                className="p-2 rounded-xl bg-[#1A050D] border border-rose-900/60 text-xs font-bold text-amber-200 outline-none cursor-pointer focus:border-amber-400"
              >
                <option value={0}>Fukushuu (Ujian Akbar)</option>
                {Array.from({ length: 18 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    第{n}課 (Bab {n < 10 ? `0${n}` : n})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-rose-300">Seksi Soal:</span>
              <select
                value={targetSection}
                onChange={(e) => setTargetSection(e.target.value)}
                className="p-2 rounded-xl bg-[#1A050D] border border-rose-900/60 text-xs font-bold text-amber-200 outline-none cursor-pointer focus:border-amber-400"
              >
                <option value="moji_goi">文字・語彙 (Moji Goi)</option>
                <option value="kaiwa_hyougen">会話・表現 (Kaiwa)</option>
                <option value="choukai">聴解 (Choukai Audio)</option>
                <option value="dokkai">読解 (Dokkai Wacana)</option>
              </select>
            </div>
          </div>
        </div>

        {/* DRAG AND DROP ZONE */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-rose-900/80 hover:border-amber-400/80 bg-[#1A050D]/60 hover:bg-[#250713]/80 p-8 rounded-2xl text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.txt,.csv"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center group-hover:scale-110 transition shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <span className="text-sm font-black text-amber-200 block">
              Tarik & Lepas Dokumen Word (.docx), Blackboard (.txt), atau CSV di Sini
            </span>
            <span className="text-xs text-rose-300/60 mt-1 block">
              Atau klik untuk memilih berkas dari komputer Anda
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[10px] uppercase font-bold tracking-wider text-amber-400/80 bg-black/40 px-3 py-1 rounded-full border border-amber-500/20">
            <span>Word Highlight</span> • <span>Blackboard Tab-Delimited</span> • <span>Aiken Text</span> • <span>Excel CSV</span>
          </div>
        </div>

        {/* FEEDBACK STATUS */}
        {parsing && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4" /> Membaca dokumen dan mendeteksi kunci jawaban ber-highlight...
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs font-bold text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* 2. LIVE VERIFICATION TABLE (IF QUESTIONS PARSED) */}
      {parsedQuestions.length > 0 && (
        <div className="clay-card rounded-2xl p-6 border border-rose-950/80 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-rose-950/60 pb-3">
            <div>
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider block">
                Hasil Deteksi: {parsedQuestions.length} Butir Soal Siap Impor
              </span>
              <span className="text-[11px] text-rose-300/70">
                Format Terdeteksi: <strong className="text-emerald-400">{formatDetected}</strong> • Target:{" "}
                <strong>第{targetChapter}課 • {targetSection}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setParsedQuestions([])}
                className="clay-btn px-4 py-2 rounded-xl text-xs font-bold text-rose-300 hover:text-white transition"
              >
                Batal
              </button>
              <button
                disabled={saving}
                onClick={handleSaveToDatabase}
                className="clay-btn-gold px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition"
              >
                {saving ? (
                  <>Menyimpan...</>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Simpan Semua ke Database Neon
                  </>
                )}
              </button>
            </div>
          </div>

          {/* LIST ITEM PREVIEW */}
          <div className="flex flex-col gap-3 max-h-[550px] overflow-y-auto pr-1">
            {parsedQuestions.map((q, idx) => (
              <div
                key={idx}
                className="bg-[#240610] p-4 rounded-xl border border-rose-950/80 flex flex-col gap-2.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-amber-400 bg-black/40 px-2 py-0.5 rounded">
                    Soal #{idx + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-rose-300/80">Kunci Jawaban:</span>
                    <select
                      value={q.answerKey.toUpperCase()}
                      onChange={(e) => handleKeyChange(idx, e.target.value)}
                      className={`px-2 py-0.5 rounded text-[11px] font-black outline-none ${
                        q.hasDetectedKey
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                          : "bg-amber-950 text-amber-300 border border-amber-500/40 animate-pulse"
                      }`}
                    >
                      <option value="A">Kunci: A</option>
                      <option value="B">Kunci: B</option>
                      <option value="C">Kunci: C</option>
                      <option value="D">Kunci: D</option>
                    </select>
                  </div>
                </div>

                <div className="font-semibold text-rose-100 whitespace-pre-line leading-relaxed">
                  {q.questionText}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 pt-2 border-t border-rose-950/60 text-slate-200">
                  <div className={q.answerKey.toLowerCase() === "a" ? "text-emerald-300 font-bold bg-emerald-950/30 p-1.5 rounded" : "p-1.5"}>
                    A. {q.optionA}
                  </div>
                  <div className={q.answerKey.toLowerCase() === "b" ? "text-emerald-300 font-bold bg-emerald-950/30 p-1.5 rounded" : "p-1.5"}>
                    B. {q.optionB}
                  </div>
                  <div className={q.answerKey.toLowerCase() === "c" ? "text-emerald-300 font-bold bg-emerald-950/30 p-1.5 rounded" : "p-1.5"}>
                    C. {q.optionC}
                  </div>
                  {q.optionD && (
                    <div className={q.answerKey.toLowerCase() === "d" ? "text-emerald-300 font-bold bg-emerald-950/30 p-1.5 rounded" : "p-1.5"}>
                      D. {q.optionD}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
