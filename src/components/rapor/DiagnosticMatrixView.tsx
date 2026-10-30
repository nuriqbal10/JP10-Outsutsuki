"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  User,
  Layers,
  Award,
  ChevronRight,
  Printer,
  Sparkles,
  BookOpen,
  Volume2,
  PenTool,
  MessageSquare,
  Languages,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { StudentRaporItem, LevelRaporData } from "@/types/rapor";
import ChapterProgressChartAndRecommendations from "./ChapterProgressChartAndRecommendations";

interface DiagnosticMatrixViewProps {
  levelData: LevelRaporData | null;
  onOpenStudentDetail?: (student: StudentRaporItem) => void;
  onNavigateToProjection?: () => void;
}

type AspectFilter =
  | "all"
  | "mojiGoi"
  | "kaiwa"
  | "choukai"
  | "dokkai"
  | "shikenTotal"
  | "kanji"
  | "kotoba"
  | "honyaku";

interface ChapterDiagnosticRow {
  key: string;
  label: string;
  subLabel: string;
  isCheckpoint: boolean;
  isFinal: boolean;
  chapterNum?: number;
  checkpointNum?: number;
  // Point 1: Shiken 4 Sections
  shiken: {
    mojiGoi: number;
    maxMojiGoi: number;
    kaiwa: number;
    maxKaiwa: number;
    choukai: number;
    maxChoukai: number;
    dokkai: number;
    maxDokkai: number;
    total: number;
    maxTotal: number;
  };
  // Point 2: Kanji
  kanji: number;
  // Point 3: Kotoba
  kotoba: number;
  // Point 4: Honyaku
  honyaku: number;
  // Analysis
  deficiencies: string[];
  status: "perfect" | "passed" | "warning" | "danger" | "empty";
  recommendation: string;
}

export default function DiagnosticMatrixView({
  levelData,
  onOpenStudentDetail,
  onNavigateToProjection,
}: DiagnosticMatrixViewProps) {
  const [viewMode, setViewMode] = useState<"class" | "individual">("class");
  const [aspectFilter, setAspectFilter] = useState<AspectFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentNo, setSelectedStudentNo] = useState<number>(() => {
    return levelData?.rankedStudents?.[0]?.no ?? levelData?.students?.[0]?.no ?? 1;
  });

  // State Standar KKM (Default 85% sesuai kriteria Sensei, tersimpan di localStorage)
  const [kkm, setKkm] = useState<number>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("outsutsuki_kkm");
        if (saved && !isNaN(Number(saved))) return Number(saved);
      } catch {}
    }
    return 85;
  });

  const handleSetKkm = (val: number) => {
    const clamped = Math.max(50, Math.min(100, val));
    setKkm(clamped);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("outsutsuki_kkm", String(clamped));
      } catch {}
    }
  };

  const students = useMemo(() => {
    return levelData?.rankedStudents || levelData?.students || [];
  }, [levelData]);

  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const q = searchQuery.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.nim && s.nim.toLowerCase().includes(q)) ||
        String(s.no).includes(q) ||
        (s.playerLevel && s.playerLevel.toLowerCase().includes(q))
    );
  }, [students, searchQuery]);

  const selectedStudent = useMemo(() => {
    return students.find((s) => s.no === selectedStudentNo) || students[0] || null;
  }, [students, selectedStudentNo]);

  // Helper untuk mengekstrak data 4 poin per bab / checkpoint untuk siswa berdasarkan KKM aktif
  const buildStudentRows = (student: StudentRaporItem): ChapterDiagnosticRow[] => {
    const rows: ChapterDiagnosticRow[] = [];
    const warningThreshold = Math.max(40, kkm - 15);

    // Bab 1 s.d. 18
    for (let i = 0; i < 18; i++) {
      const chapterNum = i + 1;
      const h = student.harian?.[i];
      const dt = h?.daiTesuto || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
      const kanji = typeof h?.kanji === "number" ? h.kanji : 0;
      const kotoba = typeof h?.kotoba === "number" ? h.kotoba : 0;
      const honyaku = typeof h?.honyaku === "number" ? h.honyaku : 0;

      // Hitung persentase seksi shiken harian (bobot 24, 24, 24, 28)
      const pMoji = (dt.mojiGoi / 24) * 100;
      const pKaiwa = (dt.kaiwa / 24) * 100;
      const pChoukai = (dt.choukai / 24) * 100;
      const pDokkai = (dt.dokkai / 28) * 100;

      const deficiencies: string[] = [];
      const isFilled = dt.total > 0 || kanji > 0 || kotoba > 0 || honyaku > 0;

      if (isFilled) {
        if (pDokkai < kkm && dt.total > 0) deficiencies.push(`Dokkai (${dt.dokkai}/28 - ${Math.round(pDokkai)}%)`);
        if (pChoukai < kkm && dt.total > 0) deficiencies.push(`Choukai (${dt.choukai}/24 - ${Math.round(pChoukai)}%)`);
        if (pKaiwa < kkm && dt.total > 0) deficiencies.push(`Kaiwa (${dt.kaiwa}/24 - ${Math.round(pKaiwa)}%)`);
        if (pMoji < kkm && dt.total > 0) deficiencies.push(`Moji-Goi (${dt.mojiGoi}/24 - ${Math.round(pMoji)}%)`);
        if (kanji > 0 && kanji < kkm) deficiencies.push(`Kanji (${kanji} pt)`);
        if (kotoba > 0 && kotoba < kkm) deficiencies.push(`Kotoba (${kotoba} pt)`);
        if (honyaku > 0 && honyaku < kkm) deficiencies.push(`Honyaku (${honyaku} pt)`);
      }

      let status: ChapterDiagnosticRow["status"] = "empty";
      if (!isFilled) {
        status = "empty";
      } else if (deficiencies.length === 0 && dt.total >= kkm) {
        status = "perfect";
      } else if (deficiencies.length === 0 && dt.total >= warningThreshold) {
        status = "passed";
      } else if (deficiencies.length <= 2) {
        status = "warning";
      } else {
        status = "danger";
      }

      let recommendation = `Performa tuntas di atas standar KKM (${kkm}%).`;
      if (!isFilled) {
        recommendation = "Materi belum diujikan / data belum terekam.";
      } else if (deficiencies.length > 0) {
        recommendation = `Target KKM ${kkm}%: Fokus penguatan pada ${deficiencies.slice(0, 2).join(", ")}.`;
      }
      if (!isFilled) {
        recommendation = "Materi belum diujikan / data belum terekam.";
      } else if (deficiencies.length > 0) {
        recommendation = `Fokus penguatan pada: ${deficiencies.slice(0, 2).join(", ")}.`;
      }

      rows.push({
        key: `bab-${chapterNum}`,
        label: `Bab ${chapterNum}`,
        subLabel: `第${chapterNum}課`,
        isCheckpoint: false,
        isFinal: false,
        chapterNum,
        shiken: {
          mojiGoi: dt.mojiGoi,
          maxMojiGoi: 24,
          kaiwa: dt.kaiwa,
          maxKaiwa: 24,
          choukai: dt.choukai,
          maxChoukai: 24,
          dokkai: dt.dokkai,
          maxDokkai: 28,
          total: dt.total,
          maxTotal: 100,
        },
        kanji,
        kotoba,
        honyaku,
        deficiencies,
        status,
        recommendation,
      });

      // Sisipkan Checkpoint 1 setelah Bab 6
      if (chapterNum === 6) {
        const cp1 = student.fukushuu1;
        const test = cp1?.test || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
        const cpDef: string[] = [];
        const isCpFilled = (test.total || 0) > 0 || (cp1?.kanji || 0) > 0;
        if (isCpFilled) {
          const pDok = (test.dokkai / 88) * 100;
          const pCho = (test.choukai / 66) * 100;
          const pKai = (test.kaiwa / 48) * 100;
          const pMoj = (test.mojiGoi / 48) * 100;
          if (pDok < kkm && test.total > 0) cpDef.push(`Dokkai (${test.dokkai}/88 - ${Math.round(pDok)}%)`);
          if (pCho < kkm && test.total > 0) cpDef.push(`Choukai (${test.choukai}/66 - ${Math.round(pCho)}%)`);
          if (pKai < kkm && test.total > 0) cpDef.push(`Kaiwa (${test.kaiwa}/48 - ${Math.round(pKai)}%)`);
          if (pMoj < kkm && test.total > 0) cpDef.push(`Moji-Goi (${test.mojiGoi}/48 - ${Math.round(pMoj)}%)`);
          if ((cp1?.kanji || 0) > 0 && (cp1?.kanji || 0) < kkm) cpDef.push(`Kanji (${cp1?.kanji} pt)`);
          if ((cp1?.kotoba || 0) > 0 && (cp1?.kotoba || 0) < kkm) cpDef.push(`Kotoba (${cp1?.kotoba} pt)`);
          if ((cp1?.honyaku || 0) > 0 && (cp1?.honyaku || 0) < kkm) cpDef.push(`Honyaku (${cp1?.honyaku} pt)`);
        }
        rows.push({
          key: "checkpoint-1",
          label: "Checkpoint 1 (Bab 1–6)",
          subLabel: "復習テスト 1",
          isCheckpoint: true,
          isFinal: false,
          checkpointNum: 1,
          shiken: {
            mojiGoi: test.mojiGoi || 0,
            maxMojiGoi: 48,
            kaiwa: test.kaiwa || 0,
            maxKaiwa: 48,
            choukai: test.choukai || 0,
            maxChoukai: 66,
            dokkai: test.dokkai || 0,
            maxDokkai: 88,
            total: test.total || 0,
            maxTotal: 250,
          },
          kanji: cp1?.kanji || 0,
          kotoba: cp1?.kotoba || 0,
          honyaku: cp1?.honyaku || 0,
          deficiencies: cpDef,
          status: !isCpFilled ? "empty" : cpDef.length === 0 ? "passed" : "warning",
          recommendation: !isCpFilled
            ? "Ujian Checkpoint 1 belum ditempuh."
            : cpDef.length > 0
            ? `Target KKM ${kkm}%: Perlu remediasi di ${cpDef.join(", ")}.`
            : `Kompetensi Bab 1 s.d. 6 tuntas di atas KKM ${kkm}%.`,
        });
      }

      // Sisipkan Checkpoint 2 setelah Bab 12
      if (chapterNum === 12) {
        const cp2 = student.fukushuu2;
        const test = cp2?.test || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
        const cpDef: string[] = [];
        const isCpFilled = (test.total || 0) > 0 || (cp2?.kanji || 0) > 0;
        if (isCpFilled) {
          const pDok = (test.dokkai / 88) * 100;
          const pCho = (test.choukai / 66) * 100;
          const pKai = (test.kaiwa / 48) * 100;
          const pMoj = (test.mojiGoi / 48) * 100;
          if (pDok < kkm && test.total > 0) cpDef.push(`Dokkai (${test.dokkai}/88 - ${Math.round(pDok)}%)`);
          if (pCho < kkm && test.total > 0) cpDef.push(`Choukai (${test.choukai}/66 - ${Math.round(pCho)}%)`);
          if (pKai < kkm && test.total > 0) cpDef.push(`Kaiwa (${test.kaiwa}/48 - ${Math.round(pKai)}%)`);
          if (pMoj < kkm && test.total > 0) cpDef.push(`Moji-Goi (${test.mojiGoi}/48 - ${Math.round(pMoj)}%)`);
          if ((cp2?.kanji || 0) > 0 && (cp2?.kanji || 0) < kkm) cpDef.push(`Kanji (${cp2?.kanji} pt)`);
          if ((cp2?.kotoba || 0) > 0 && (cp2?.kotoba || 0) < kkm) cpDef.push(`Kotoba (${cp2?.kotoba} pt)`);
          if ((cp2?.honyaku || 0) > 0 && (cp2?.honyaku || 0) < kkm) cpDef.push(`Honyaku (${cp2?.honyaku} pt)`);
        }
        rows.push({
          key: "checkpoint-2",
          label: "Checkpoint 2 (Bab 7–12)",
          subLabel: "復習テスト 2",
          isCheckpoint: true,
          isFinal: false,
          checkpointNum: 2,
          shiken: {
            mojiGoi: test.mojiGoi || 0,
            maxMojiGoi: 48,
            kaiwa: test.kaiwa || 0,
            maxKaiwa: 48,
            choukai: test.choukai || 0,
            maxChoukai: 66,
            dokkai: test.dokkai || 0,
            maxDokkai: 88,
            total: test.total || 0,
            maxTotal: 250,
          },
          kanji: cp2?.kanji || 0,
          kotoba: cp2?.kotoba || 0,
          honyaku: cp2?.honyaku || 0,
          deficiencies: cpDef,
          status: !isCpFilled ? "empty" : cpDef.length === 0 ? "passed" : "warning",
          recommendation: !isCpFilled
            ? "Ujian Checkpoint 2 belum ditempuh."
            : cpDef.length > 0
            ? `Target KKM ${kkm}%: Perlu remediasi di ${cpDef.join(", ")}.`
            : `Kompetensi Bab 7 s.d. 12 tuntas di atas KKM ${kkm}%.`,
        });
      }

      // Sisipkan Checkpoint 3 setelah Bab 18
      if (chapterNum === 18) {
        const cp3 = student.fukushuu3;
        const test = cp3?.test || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
        const cpDef: string[] = [];
        const isCpFilled = (test.total || 0) > 0 || (cp3?.kanji || 0) > 0;
        if (isCpFilled) {
          const pDok = (test.dokkai / 88) * 100;
          const pCho = (test.choukai / 66) * 100;
          const pKai = (test.kaiwa / 48) * 100;
          const pMoj = (test.mojiGoi / 48) * 100;
          if (pDok < kkm && test.total > 0) cpDef.push(`Dokkai (${test.dokkai}/88 - ${Math.round(pDok)}%)`);
          if (pCho < kkm && test.total > 0) cpDef.push(`Choukai (${test.choukai}/66 - ${Math.round(pCho)}%)`);
          if (pKai < kkm && test.total > 0) cpDef.push(`Kaiwa (${test.kaiwa}/48 - ${Math.round(pKai)}%)`);
          if (pMoj < kkm && test.total > 0) cpDef.push(`Moji-Goi (${test.mojiGoi}/48 - ${Math.round(pMoj)}%)`);
          if ((cp3?.kanji || 0) > 0 && (cp3?.kanji || 0) < kkm) cpDef.push(`Kanji (${cp3?.kanji} pt)`);
          if ((cp3?.kotoba || 0) > 0 && (cp3?.kotoba || 0) < kkm) cpDef.push(`Kotoba (${cp3?.kotoba} pt)`);
          if ((cp3?.honyaku || 0) > 0 && (cp3?.honyaku || 0) < kkm) cpDef.push(`Honyaku (${cp3?.honyaku} pt)`);
        }
        rows.push({
          key: "checkpoint-3",
          label: "Checkpoint 3 (Bab 13–18)",
          subLabel: "復習テスト 3",
          isCheckpoint: true,
          isFinal: false,
          checkpointNum: 3,
          shiken: {
            mojiGoi: test.mojiGoi || 0,
            maxMojiGoi: 48,
            kaiwa: test.kaiwa || 0,
            maxKaiwa: 48,
            choukai: test.choukai || 0,
            maxChoukai: 66,
            dokkai: test.dokkai || 0,
            maxDokkai: 88,
            total: test.total || 0,
            maxTotal: 250,
          },
          kanji: cp3?.kanji || 0,
          kotoba: cp3?.kotoba || 0,
          honyaku: cp3?.honyaku || 0,
          deficiencies: cpDef,
          status: !isCpFilled ? "empty" : cpDef.length === 0 ? "passed" : "warning",
          recommendation: !isCpFilled
            ? "Ujian Checkpoint 3 belum ditempuh."
            : cpDef.length > 0
            ? `Target KKM ${kkm}%: Perlu remediasi di ${cpDef.join(", ")}.`
            : `Kompetensi Bab 13 s.d. 18 tuntas di atas KKM ${kkm}%.`,
        });

        // Sisipkan Shiken 1 Buku (Final Exam) di baris terakhir
        const fn = student.finalExam;
        const fnTest = fn?.test || { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
        const fnDef: string[] = [];
        const isFnFilled = (fnTest.total || 0) > 0 || (fn?.kanji || 0) > 0;
        if (isFnFilled) {
          const pDok = (fnTest.dokkai / 88) * 100;
          const pCho = (fnTest.choukai / 66) * 100;
          const pKai = (fnTest.kaiwa / 48) * 100;
          const pMoj = (fnTest.mojiGoi / 48) * 100;
          if (pDok < kkm && fnTest.total > 0) fnDef.push(`Dokkai (${fnTest.dokkai}/88 - ${Math.round(pDok)}%)`);
          if (pCho < kkm && fnTest.total > 0) fnDef.push(`Choukai (${fnTest.choukai}/66 - ${Math.round(pCho)}%)`);
          if (pKai < kkm && fnTest.total > 0) fnDef.push(`Kaiwa (${fnTest.kaiwa}/48 - ${Math.round(pKai)}%)`);
          if (pMoj < kkm && fnTest.total > 0) fnDef.push(`Moji-Goi (${fnTest.mojiGoi}/48 - ${Math.round(pMoj)}%)`);
          if ((fn?.kanji || 0) > 0 && (fn?.kanji || 0) < kkm) fnDef.push(`Kanji (${fn?.kanji} pt)`);
          if ((fn?.kotoba || 0) > 0 && (fn?.kotoba || 0) < kkm) fnDef.push(`Kotoba (${fn?.kotoba} pt)`);
          if ((fn?.honyaku || 0) > 0 && (fn?.honyaku || 0) < kkm) fnDef.push(`Honyaku (${fn?.honyaku} pt)`);
        }
        rows.push({
          key: "shiken-1-buku",
          label: "Shiken 1 Buku (Full Book)",
          subLabel: "総括終了試験 (全18課)",
          isCheckpoint: false,
          isFinal: true,
          shiken: {
            mojiGoi: fnTest.mojiGoi || 0,
            maxMojiGoi: 48,
            kaiwa: fnTest.kaiwa || 0,
            maxKaiwa: 48,
            choukai: fnTest.choukai || 0,
            maxChoukai: 66,
            dokkai: fnTest.dokkai || 0,
            maxDokkai: 88,
            total: fnTest.total || 0,
            maxTotal: 250,
          },
          kanji: fn?.kanji || 0,
          kotoba: fn?.kotoba || 0,
          honyaku: fn?.honyaku || 0,
          deficiencies: fnDef,
          status: !isFnFilled ? "empty" : fnDef.length === 0 ? "perfect" : "warning",
          recommendation: !isFnFilled
            ? "Ujian komprehensif 1 buku belum ditempuh."
            : fnDef.length > 0
            ? `Target KKM ${kkm}%: Kekurangan pada aspek ${fnDef.join(", ")}.`
            : `Selamat! Seluruh aspek 1 buku tuntas di atas KKM ${kkm}% dan siap mengikuti ujian resmi JFT-Basic A2.`,
        });
      }
    }

    return rows;
  };

  const currentStudentRows = useMemo(() => {
    if (!selectedStudent) return [];
    return buildStudentRows(selectedStudent);
  }, [selectedStudent, kkm]);

  // Analisis keseluruhan kekurangan siswa terpilih
  const studentOverallDeficiencies = useMemo(() => {
    if (!selectedStudent) return { weakestSection: "-", count: 0, items: [] as string[] };
    const counter: Record<string, number> = {
      Dokkai: 0,
      Choukai: 0,
      Kaiwa: 0,
      "Moji-Goi": 0,
      Kanji: 0,
      Kotoba: 0,
      Honyaku: 0,
    };

    currentStudentRows.forEach((r) => {
      r.deficiencies.forEach((d) => {
        if (d.includes("Dokkai")) counter["Dokkai"]++;
        else if (d.includes("Choukai")) counter["Choukai"]++;
        else if (d.includes("Kaiwa")) counter["Kaiwa"]++;
        else if (d.includes("Moji-Goi")) counter["Moji-Goi"]++;
        else if (d.includes("Kanji")) counter["Kanji"]++;
        else if (d.includes("Kotoba")) counter["Kotoba"]++;
        else if (d.includes("Honyaku")) counter["Honyaku"]++;
      });
    });

    const sorted = Object.entries(counter).sort((a, b) => b[1] - a[1]);
    const topWeak = sorted[0];

    const weakItems = sorted
      .filter(([, count]) => count > 0)
      .map(([name, count]) => `${name} (${count} bab belum tuntas)`);

    return {
      weakestSection: topWeak && topWeak[1] > 0 ? topWeak[0] : "Semua Aspek Tuntas",
      count: topWeak ? topWeak[1] : 0,
      items: weakItems,
    };
  }, [selectedStudent, currentStudentRows]);

  // Helper untuk mendapatkan nilai aspek berdasarkan filter di tabel kelas
  const getAspectValue = (
    student: StudentRaporItem,
    type: "bab" | "cp1" | "cp2" | "cp3" | "final",
    indexOrNum?: number
  ): { val: number; max: number; isFilled: boolean } => {
    let dt = { mojiGoi: 0, kaiwa: 0, choukai: 0, dokkai: 0, total: 0 };
    let kanji = 0, kotoba = 0, honyaku = 0;
    let maxTotal = 100, maxMoji = 24, maxKaiwa = 24, maxChoukai = 24, maxDokkai = 28;

    if (type === "bab" && typeof indexOrNum === "number") {
      const h = student.harian?.[indexOrNum];
      dt = h?.daiTesuto || dt;
      kanji = h?.kanji || 0;
      kotoba = h?.kotoba || 0;
      honyaku = h?.honyaku || 0;
    } else if (type === "cp1") {
      const cp = student.fukushuu1;
      dt = cp?.test || dt;
      kanji = cp?.kanji || 0;
      kotoba = cp?.kotoba || 0;
      honyaku = cp?.honyaku || 0;
      maxTotal = 250; maxMoji = 48; maxKaiwa = 48; maxChoukai = 66; maxDokkai = 88;
    } else if (type === "cp2") {
      const cp = student.fukushuu2;
      dt = cp?.test || dt;
      kanji = cp?.kanji || 0;
      kotoba = cp?.kotoba || 0;
      honyaku = cp?.honyaku || 0;
      maxTotal = 250; maxMoji = 48; maxKaiwa = 48; maxChoukai = 66; maxDokkai = 88;
    } else if (type === "cp3") {
      const cp = student.fukushuu3;
      dt = cp?.test || dt;
      kanji = cp?.kanji || 0;
      kotoba = cp?.kotoba || 0;
      honyaku = cp?.honyaku || 0;
      maxTotal = 250; maxMoji = 48; maxKaiwa = 48; maxChoukai = 66; maxDokkai = 88;
    } else if (type === "final") {
      const fn = student.finalExam;
      dt = fn?.test || dt;
      kanji = fn?.kanji || 0;
      kotoba = fn?.kotoba || 0;
      honyaku = fn?.honyaku || 0;
      maxTotal = 250; maxMoji = 48; maxKaiwa = 48; maxChoukai = 66; maxDokkai = 88;
    }

    const isFilled = dt.total > 0 || kanji > 0 || kotoba > 0 || honyaku > 0;

    switch (aspectFilter) {
      case "mojiGoi":
        return { val: dt.mojiGoi, max: maxMoji, isFilled };
      case "kaiwa":
        return { val: dt.kaiwa, max: maxKaiwa, isFilled };
      case "choukai":
        return { val: dt.choukai, max: maxChoukai, isFilled };
      case "dokkai":
        return { val: dt.dokkai, max: maxDokkai, isFilled };
      case "shikenTotal":
        return { val: dt.total, max: maxTotal, isFilled };
      case "kanji":
        return { val: kanji, max: 100, isFilled: kanji > 0 };
      case "kotoba":
        return { val: kotoba, max: 100, isFilled: kotoba > 0 };
      case "honyaku":
        return { val: honyaku, max: 100, isFilled: honyaku > 0 };
      case "all":
      default:
        return { val: dt.total, max: maxTotal, isFilled };
    }
  };

  const aspectTitles: Record<AspectFilter, { label: string; icon: any; color: string }> = {
    all: { label: "Semua Poin (Skor Shiken)", icon: Layers, color: "text-amber-500" },
    mojiGoi: { label: "1. Seksi Moji-Goi (文字・語彙)", icon: BookOpen, color: "text-blue-500" },
    kaiwa: { label: "1. Seksi Kaiwa-Hyogen (会話・表現)", icon: MessageSquare, color: "text-cyan-500" },
    choukai: { label: "1. Seksi Choukai (聴解)", icon: Volume2, color: "text-emerald-500" },
    dokkai: { label: "1. Seksi Dokkai (読解)", icon: FileText, color: "text-purple-500" },
    shikenTotal: { label: "1. Total Shiken Bab (試験合計)", icon: Award, color: "text-amber-500" },
    kanji: { label: "2. Kanji Harian (漢字)", icon: PenTool, color: "text-rose-500" },
    kotoba: { label: "3. Kotoba / Kosakata (言葉)", icon: BookOpen, color: "text-orange-500" },
    honyaku: { label: "4. Honyaku / Terjemahan (翻訳)", icon: Languages, color: "text-teal-500" },
  };

  // Perhitungan Rata-Rata Kelas & Status Ketercapaian Per Kolom Matriks
  const classColumnStats = useMemo(() => {
    const getColStat = (type: "bab" | "cp1" | "cp2" | "cp3" | "final", idx?: number) => {
      let sum = 0, filledCount = 0, passCount = 0;
      students.forEach((s) => {
        const { val, max, isFilled } = getAspectValue(s, type, idx);
        if (isFilled && val > 0) {
          sum += val;
          filledCount++;
          const pct = max > 0 ? (val / max) * 100 : 0;
          if (pct >= kkm) passCount++;
        }
      });
      if (filledCount === 0) {
        return { avg: "-", passRate: "-", status: "empty" as const };
      }
      const avg = Math.round((sum / filledCount) * 10) / 10;
      const passRate = Math.round((passCount / filledCount) * 100);
      const status: "passed" | "warning" | "danger" | "empty" =
        passRate >= 70 ? "passed" : passRate >= 40 ? "warning" : "danger";
      return { avg, passRate, status };
    };

    const babStats = Array.from({ length: 18 }, (_, i) => getColStat("bab", i));
    const cp1 = getColStat("cp1");
    const cp2 = getColStat("cp2");
    const cp3 = getColStat("cp3");
    const finalExam = getColStat("final");

    return { babStats, cp1, cp2, cp3, finalExam };
  }, [students, kkm, aspectFilter]);

  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <div className="clay-card p-6 rounded-3xl border border-current/10 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400">
                Pilar Evaluasi Kurikulum Irodori JFT-Basic A2
              </span>
              <span className="text-xs font-mono opacity-70">
                Total 18 Bab + 3 Checkpoints + 1 Shiken Buku
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black tracking-tight font-serif flex items-center gap-2.5 mt-1">
              <SlidersHorizontal className="w-6 h-6 text-amber-500" />
              Matriks Diagnostik Ketuntasan 4 Poin Utama
            </h3>
            <p className="text-xs sm:text-sm opacity-75 mt-0.5 max-w-3xl leading-relaxed">
              Instrumen diagnostik komprehensif untuk memetakan capaian dan mendeteksi titik kekurangan siswa pada{" "}
              <strong>1. Shiken Bab (Moji-Goi, Kaiwa, Choukai, Dokkai)</strong>, <strong>2. Kanji</strong>,{" "}
              <strong>3. Kotoba</strong>, dan <strong>4. Honyaku</strong> beserta{" "}
              <strong>Checkpoint 1–6, 7–12, 13–18 &amp; Shiken 1 Buku</strong>.
            </p>
          </div>

          {/* VIEW MODE TOGGLE BUTTONS */}
          <div className="flex items-center bg-black/5 dark:bg-white/5 p-1.5 rounded-2xl border border-current/10 shrink-0 self-start lg:self-center">
            <button
              onClick={() => setViewMode("class")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                viewMode === "class"
                  ? "bg-amber-500 text-stone-950 shadow-md scale-102"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Layers className="w-4 h-4" />
              Matriks Kelas (18 Bab)
            </button>
            <button
              onClick={() => setViewMode("individual")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                viewMode === "individual"
                  ? "bg-amber-500 text-stone-950 shadow-md scale-102"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <User className="w-4 h-4" />
              Detail Diagnostik Siswa
            </button>
            {onNavigateToProjection && (
              <button
                onClick={onNavigateToProjection}
                className="ml-2 px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500 hover:text-white cursor-pointer shadow-xs"
                title="Buka Laboratorium Proyeksi Stitch (Simulasi 250 pt per 6 Bab)"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulasi Proyeksi Stitch →</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 POIN LEGEND BADGES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-current/10 text-xs">
          <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/25 text-blue-400 flex items-center justify-center font-black text-xs">
              1
            </div>
            <div>
              <p className="font-black text-[11px] text-blue-400">Shiken Bab (4 Seksi)</p>
              <p className="text-[10px] opacity-80 text-[var(--text-body)]">Moji-Goi, Kaiwa, Choukai, Dokkai</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-500/25 text-rose-400 flex items-center justify-center font-black text-xs">
              2
            </div>
            <div>
              <p className="font-black text-[11px] text-rose-400">Kanji (漢字)</p>
              <p className="text-[10px] opacity-80 text-[var(--text-body)]">Goresan &amp; Arti Huruf Kanji</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/25 text-amber-400 flex items-center justify-center font-black text-xs">
              3
            </div>
            <div>
              <p className="font-black text-[11px] text-amber-400">Kotoba (言葉)</p>
              <p className="text-[10px] opacity-80 text-[var(--text-body)]">Penguasaan Kosakata Tema</p>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500/25 text-teal-400 flex items-center justify-center font-black text-xs">
              4
            </div>
            <div>
              <p className="font-black text-[11px] text-teal-400">Honyaku (翻訳)</p>
              <p className="text-[10px] opacity-80 text-[var(--text-body)]">Ketepatan Alih Bahasa</p>
            </div>
          </div>
        </div>

        {/* KKM SETTING CONTROL BAR (SENSI ADJUSTABLE) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-current/10">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-500 flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[var(--text-heading)]">
                  Standar KKM Sensei:
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black font-mono text-xs shadow-md">
                  {kkm}%
                </span>
              </div>
              <p className="text-[10px] opacity-75 text-[var(--text-body)]">
                Ambang batas kelulusan &amp; deteksi kekurangan otomatis (Tersimpan otomatis)
              </p>
            </div>
          </div>

          {/* Quick Presets & Stepper */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold opacity-70 mr-1 text-[var(--text-body)]">Pilihan KKM:</span>
            {[70, 75, 80, 85, 90].map((preset) => (
              <button
                key={preset}
                onClick={() => handleSetKkm(preset)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-black transition border ${
                  kkm === preset
                    ? "bg-amber-500 text-stone-950 border-amber-400 shadow-sm scale-105"
                    : "bg-black/10 dark:bg-white/10 hover:bg-black/20 text-[var(--text-heading)] border-current/10 opacity-70 hover:opacity-100"
                }`}
                title={`Atur KKM ke ${preset}%`}
              >
                {preset}%
              </button>
            ))}

            <div className="flex items-center ml-1 border border-current/20 rounded-xl overflow-hidden bg-black/15 shadow-inner">
              <button
                onClick={() => handleSetKkm(kkm - 1)}
                className="px-2.5 py-1 hover:bg-amber-500/20 text-xs font-black transition text-[var(--text-heading)] active:scale-95"
                title="Kurangi KKM 1%"
              >
                -
              </button>
              <span className="px-2 text-xs font-mono font-black text-amber-500">{kkm}%</span>
              <button
                onClick={() => handleSetKkm(kkm + 1)}
                className="px-2.5 py-1 hover:bg-amber-500/20 text-xs font-black transition text-[var(--text-heading)] active:scale-95"
                title="Tambah KKM 1%"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================================
          MODE A: MATRIKS KELAS (HEATMAP GRID)
          ========================================================== */}
      {viewMode === "class" && (
        <div className="space-y-4">
          {/* TOOLBAR FILTER ASPEK & SEARCH */}
          <div className="clay-card p-4 rounded-2xl border border-current/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Filter Aspek Dropdown / Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
              <span className="text-xs font-black uppercase tracking-wider opacity-60 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Filter Aspek:
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {(
                  [
                    "all",
                    "mojiGoi",
                    "kaiwa",
                    "choukai",
                    "dokkai",
                    "shikenTotal",
                    "kanji",
                    "kotoba",
                    "honyaku",
                  ] as AspectFilter[]
                ).map((af) => {
                  const info = aspectTitles[af];
                  return (
                    <button
                      key={af}
                      onClick={() => setAspectFilter(af)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 border ${
                        aspectFilter === af
                          ? "bg-amber-500 text-stone-950 border-amber-400 shadow-sm"
                          : "border-current/10 bg-black/5 dark:bg-white/5 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <info.icon className="w-3.5 h-3.5" />
                      {info.label.split(" (")[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pencarian Siswa */}
            <div className="relative shrink-0 w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                placeholder="Cari nama peserta didik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border border-current/20 bg-black/15 text-[var(--text-heading)] placeholder:opacity-50 focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* TABEL MATRIKS DIAGNOSTIK KELAS */}
          <div className="clay-card p-4 sm:p-5 rounded-3xl border border-current/10 shadow-xl overflow-hidden space-y-3">
            <div className="flex items-center justify-between text-xs font-bold opacity-90 px-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Tuntas (≥{kkm}%)
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block ml-2" /> Waspada ({Math.max(40, kkm - 15)}–{kkm - 1}%)
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block ml-2" /> Defisit (&lt;{Math.max(40, kkm - 15)}%)
              </div>
              <p className="text-[11px] opacity-80 hidden sm:block">
                Klik baris siswa untuk membuka diagnostik individual detail
              </p>
            </div>

            <div className="overflow-x-auto border border-current/20 rounded-2xl bg-black/20 p-1">
              <table className="w-full text-center border-collapse text-[10px]">
                <thead>
                  <tr className="bg-black/30 font-bold opacity-90 text-[10px]">
                    <th className="p-2.5 text-left pl-3 sticky left-0 z-20 diagnostic-sticky-cell border-r border-current/20 min-w-[150px] shadow-md font-bold">
                      Peserta Didik ({filteredStudents.length})
                    </th>

                    {/* Bab 1-6 */}
                    {Array.from({ length: 6 }, (_, i) => i + 1).map((b) => (
                      <th key={b} className="p-1.5 w-8 font-mono">B{b}</th>
                    ))}

                    {/* Checkpoint 1 (Bab 1-6) */}
                    <th className="p-1.5 min-w-[50px] bg-amber-500/25 text-amber-300 font-black border-x border-amber-500/40">
                      CP 1-6
                    </th>

                    {/* Bab 7-12 */}
                    {Array.from({ length: 6 }, (_, i) => i + 7).map((b) => (
                      <th key={b} className="p-1.5 w-8 font-mono">B{b}</th>
                    ))}

                    {/* Checkpoint 2 (Bab 7-12) */}
                    <th className="p-1.5 min-w-[50px] bg-amber-500/25 text-amber-300 font-black border-x border-amber-500/40">
                      CP 7-12
                    </th>

                    {/* Bab 13-18 */}
                    {Array.from({ length: 6 }, (_, i) => i + 13).map((b) => (
                      <th key={b} className="p-1.5 w-8 font-mono">B{b}</th>
                    ))}

                    {/* Checkpoint 3 (Bab 13-18) */}
                    <th className="p-1.5 min-w-[50px] bg-amber-500/25 text-amber-300 font-black border-x border-amber-500/40">
                      CP 13-18
                    </th>

                    {/* Shiken 1 Buku */}
                    <th className="p-1.5 min-w-[60px] bg-purple-500/30 text-purple-200 font-black border-l border-purple-500/40">
                      SHIKEN BUKU
                    </th>

                    {/* Action */}
                    <th className="p-1.5 w-10">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-current/10 font-medium">
                  {filteredStudents.map((st) => (
                    <tr
                      key={st.no}
                      onClick={() => {
                        setSelectedStudentNo(st.no);
                        setViewMode("individual");
                      }}
                      className="hover:bg-amber-500/15 cursor-pointer transition group"
                    >
                      {/* Nama Siswa (Sticky Cell Berlatar Tema & Teks Kontras Tinggi) */}
                      <td className="p-2 text-left pl-3 sticky left-0 z-10 diagnostic-sticky-cell border-r border-current/20 font-bold group-hover:bg-amber-500/25 transition shadow-md">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] flex items-center justify-center font-mono shrink-0 font-black">
                            {st.rank || st.no}
                          </span>
                          <span className="truncate max-w-[125px] diagnostic-student-name font-black text-xs" title={st.name}>
                            {st.name}
                          </span>
                        </div>
                      </td>

                      {/* Bab 1-6 */}
                      {Array.from({ length: 6 }, (_, idx) => {
                        const { val, max, isFilled } = getAspectValue(st, "bab", idx);
                        const pct = max > 0 ? (val / max) * 100 : 0;
                        const isPassed = pct >= kkm;
                        const isWarning = pct >= Math.max(40, kkm - 15) && pct < kkm;
                        return (
                          <td key={idx} className="p-1 text-center font-mono">
                            {isFilled ? (
                              <span
                                className={`inline-block w-7 py-0.5 rounded text-[10px] font-black ${
                                  isPassed
                                    ? "bg-emerald-600 text-white"
                                    : isWarning
                                    ? "bg-amber-500 text-stone-950 font-black"
                                    : "bg-rose-600 text-white"
                                }`}
                                title={`Bab ${idx + 1}: ${val}/${max} (${Math.round(pct)}%) - KKM: ${kkm}%`}
                              >
                                {val}
                              </span>
                            ) : (
                              <span className="text-stone-400 dark:text-stone-500 text-[10px]">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Checkpoint 1 (Bab 1-6) */}
                      {(() => {
                        const { val, max, isFilled } = getAspectValue(st, "cp1");
                        const pct = max > 0 ? (val / max) * 100 : 0;
                        const isPassed = pct >= kkm;
                        const isWarning = pct >= Math.max(40, kkm - 15) && pct < kkm;
                        return (
                          <td className="p-1 text-center font-mono bg-amber-500/10 border-x border-amber-500/20 font-black">
                            {isFilled ? (
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black ${
                                  isPassed
                                    ? "bg-amber-500 text-stone-950"
                                    : isWarning
                                    ? "bg-amber-600/90 text-white"
                                    : "bg-rose-600 text-white"
                                }`}
                                title={`Checkpoint 1 (Bab 1-6): ${val}/${max} (${Math.round(pct)}%) - KKM: ${kkm}%`}
                              >
                                {val}
                              </span>
                            ) : (
                              <span className="text-stone-400 opacity-60">-</span>
                            )}
                          </td>
                        );
                      })()}

                      {/* Bab 7-12 */}
                      {Array.from({ length: 6 }, (_, idx) => {
                        const chapterIdx = idx + 6;
                        const { val, max, isFilled } = getAspectValue(st, "bab", chapterIdx);
                        const pct = max > 0 ? (val / max) * 100 : 0;
                        const isPassed = pct >= kkm;
                        const isWarning = pct >= Math.max(40, kkm - 15) && pct < kkm;
                        return (
                          <td key={chapterIdx} className="p-1 text-center font-mono">
                            {isFilled ? (
                              <span
                                className={`inline-block w-7 py-0.5 rounded text-[10px] font-black ${
                                  isPassed
                                    ? "bg-emerald-600 text-white"
                                    : isWarning
                                    ? "bg-amber-500 text-stone-950 font-black"
                                    : "bg-rose-600 text-white"
                                }`}
                                title={`Bab ${chapterIdx + 1}: ${val}/${max} (${Math.round(pct)}%) - KKM: ${kkm}%`}
                              >
                                {val}
                              </span>
                            ) : (
                              <span className="text-stone-400 dark:text-stone-500 text-[10px]">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Checkpoint 2 (Bab 7-12) */}
                      {(() => {
                        const { val, max, isFilled } = getAspectValue(st, "cp2");
                        const pct = max > 0 ? (val / max) * 100 : 0;
                        const isPassed = pct >= kkm;
                        const isWarning = pct >= Math.max(40, kkm - 15) && pct < kkm;
                        return (
                          <td className="p-1 text-center font-mono bg-amber-500/10 border-x border-amber-500/20 font-black">
                            {isFilled ? (
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black ${
                                  isPassed
                                    ? "bg-amber-500 text-stone-950"
                                    : isWarning
                                    ? "bg-amber-600/90 text-white"
                                    : "bg-rose-600 text-white"
                                }`}
                                title={`Checkpoint 2 (Bab 7-12): ${val}/${max} (${Math.round(pct)}%) - KKM: ${kkm}%`}
                              >
                                {val}
                              </span>
                            ) : (
                              <span className="text-stone-400 opacity-60">-</span>
                            )}
                          </td>
                        );
                      })()}

                      {/* Bab 13-18 */}
                      {Array.from({ length: 6 }, (_, idx) => {
                        const chapterIdx = idx + 12;
                        const { val, max, isFilled } = getAspectValue(st, "bab", chapterIdx);
                        const pct = max > 0 ? (val / max) * 100 : 0;
                        const isPassed = pct >= kkm;
                        const isWarning = pct >= Math.max(40, kkm - 15) && pct < kkm;
                        return (
                          <td key={chapterIdx} className="p-1 text-center font-mono">
                            {isFilled ? (
                              <span
                                className={`inline-block w-7 py-0.5 rounded text-[10px] font-black ${
                                  isPassed
                                    ? "bg-emerald-600 text-white"
                                    : isWarning
                                    ? "bg-amber-500 text-stone-950 font-black"
                                    : "bg-rose-600 text-white"
                                }`}
                                title={`Bab ${chapterIdx + 1}: ${val}/${max} (${Math.round(pct)}%) - KKM: ${kkm}%`}
                              >
                                {val}
                              </span>
                            ) : (
                              <span className="text-stone-400 dark:text-stone-500 text-[10px]">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Checkpoint 3 (Bab 13-18) */}
                      {(() => {
                        const { val, max, isFilled } = getAspectValue(st, "cp3");
                        const pct = max > 0 ? (val / max) * 100 : 0;
                        const isPassed = pct >= kkm;
                        const isWarning = pct >= Math.max(40, kkm - 15) && pct < kkm;
                        return (
                          <td className="p-1 text-center font-mono bg-amber-500/10 border-x border-amber-500/20 font-black">
                            {isFilled ? (
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black ${
                                  isPassed
                                    ? "bg-amber-500 text-stone-950"
                                    : isWarning
                                    ? "bg-amber-600/90 text-white"
                                    : "bg-rose-600 text-white"
                                }`}
                                title={`Checkpoint 3 (Bab 13-18): ${val}/${max} (${Math.round(pct)}%) - KKM: ${kkm}%`}
                              >
                                {val}
                              </span>
                            ) : (
                              <span className="text-stone-400 opacity-60">-</span>
                            )}
                          </td>
                        );
                      })()}

                      {/* Shiken 1 Buku */}
                      {(() => {
                        const { val, max, isFilled } = getAspectValue(st, "final");
                        const pct = max > 0 ? (val / max) * 100 : 0;
                        const isPassed = pct >= kkm;
                        const isWarning = pct >= Math.max(40, kkm - 15) && pct < kkm;
                        return (
                          <td className="p-1 text-center font-mono bg-purple-500/10 border-l border-purple-500/20 font-black">
                            {isFilled ? (
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${
                                  isPassed
                                    ? "bg-purple-600 text-white"
                                    : isWarning
                                    ? "bg-purple-800/80 text-white"
                                    : "bg-rose-600 text-white"
                                }`}
                                title={`Shiken 1 Buku (Final): ${val}/${max} (${Math.round(pct)}%) - KKM: ${kkm}%`}
                              >
                                {val}
                              </span>
                            ) : (
                              <span className="text-stone-400 opacity-60">-</span>
                            )}
                          </td>
                        );
                      })()}

                      {/* Action Button */}
                      <td className="p-1 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudentNo(st.no);
                            setViewMode("individual");
                          }}
                          className="p-1 rounded-lg hover:bg-amber-500 hover:text-stone-950 transition opacity-60 hover:opacity-100"
                          title="Lihat Diagnostik Lengkap Siswa"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot className="border-t-2 border-amber-500/30 font-bold bg-amber-500/5 divide-y divide-current/10">
                  {/* Row 1: Rata-Rata Kelas */}
                  <tr className="bg-amber-500/10 font-extrabold text-amber-700 dark:text-amber-300">
                    <td className="p-2 text-left pl-3 sticky left-0 z-10 diagnostic-sticky-cell border-r border-current/20 font-black text-xs shadow-md">
                      🏛️ Rata-Rata Kelas
                    </td>
                    {/* Bab 1-6 */}
                    {classColumnStats.babStats.slice(0, 6).map((st, idx) => (
                      <td key={idx} className="p-1 text-center font-mono text-[10px] font-black text-amber-600 dark:text-amber-400">
                        {st.avg}
                      </td>
                    ))}
                    {/* CP1 */}
                    <td className="p-1 text-center font-mono text-[10px] font-black bg-amber-500/20 text-stone-950 dark:text-amber-300 border-x border-amber-500/30">
                      {classColumnStats.cp1.avg}
                    </td>
                    {/* Bab 7-12 */}
                    {classColumnStats.babStats.slice(6, 12).map((st, idx) => (
                      <td key={idx + 6} className="p-1 text-center font-mono text-[10px] font-black text-amber-600 dark:text-amber-400">
                        {st.avg}
                      </td>
                    ))}
                    {/* CP2 */}
                    <td className="p-1 text-center font-mono text-[10px] font-black bg-amber-500/20 text-stone-950 dark:text-amber-300 border-x border-amber-500/30">
                      {classColumnStats.cp2.avg}
                    </td>
                    {/* Bab 13-18 */}
                    {classColumnStats.babStats.slice(12, 18).map((st, idx) => (
                      <td key={idx + 12} className="p-1 text-center font-mono text-[10px] font-black text-amber-600 dark:text-amber-400">
                        {st.avg}
                      </td>
                    ))}
                    {/* CP3 */}
                    <td className="p-1 text-center font-mono text-[10px] font-black bg-amber-500/20 text-stone-950 dark:text-amber-300 border-x border-amber-500/30">
                      {classColumnStats.cp3.avg}
                    </td>
                    {/* Final */}
                    <td className="p-1 text-center font-mono text-[10.5px] font-black bg-purple-500/20 text-purple-700 dark:text-purple-300 border-l border-purple-500/30">
                      {classColumnStats.finalExam.avg}
                    </td>
                    <td className="p-1 text-center text-[9px] opacity-60">AVG</td>
                  </tr>

                  {/* Row 2: % Ketuntasan KKM */}
                  <tr className="text-[10px]">
                    <td className="p-2 text-left pl-3 sticky left-0 z-10 diagnostic-sticky-cell border-r border-current/20 font-bold shadow-md">
                      🎯 % Tuntas (≥{kkm}%)
                    </td>
                    {/* Bab 1-6 */}
                    {classColumnStats.babStats.slice(0, 6).map((st, idx) => (
                      <td key={idx} className={`p-1 text-center font-mono font-bold ${st.status === "empty" ? "opacity-30" : st.passRate >= 70 ? "text-emerald-500" : st.passRate >= 40 ? "text-amber-500" : "text-rose-500"}`}>
                        {st.status === "empty" ? "-" : `${st.passRate}%`}
                      </td>
                    ))}
                    {/* CP1 */}
                    <td className="p-1 text-center font-mono font-bold bg-amber-500/15 border-x border-amber-500/30">
                      {classColumnStats.cp1.status === "empty" ? "-" : `${classColumnStats.cp1.passRate}%`}
                    </td>
                    {/* Bab 7-12 */}
                    {classColumnStats.babStats.slice(6, 12).map((st, idx) => (
                      <td key={idx + 6} className={`p-1 text-center font-mono font-bold ${st.status === "empty" ? "opacity-30" : st.passRate >= 70 ? "text-emerald-500" : st.passRate >= 40 ? "text-amber-500" : "text-rose-500"}`}>
                        {st.status === "empty" ? "-" : `${st.passRate}%`}
                      </td>
                    ))}
                    {/* CP2 */}
                    <td className="p-1 text-center font-mono font-bold bg-amber-500/15 border-x border-amber-500/30">
                      {classColumnStats.cp2.status === "empty" ? "-" : `${classColumnStats.cp2.passRate}%`}
                    </td>
                    {/* Bab 13-18 */}
                    {classColumnStats.babStats.slice(12, 18).map((st, idx) => (
                      <td key={idx + 12} className={`p-1 text-center font-mono font-bold ${st.status === "empty" ? "opacity-30" : st.passRate >= 70 ? "text-emerald-500" : st.passRate >= 40 ? "text-amber-500" : "text-rose-500"}`}>
                        {st.status === "empty" ? "-" : `${st.passRate}%`}
                      </td>
                    ))}
                    {/* CP3 */}
                    <td className="p-1 text-center font-mono font-bold bg-amber-500/15 border-x border-amber-500/30">
                      {classColumnStats.cp3.status === "empty" ? "-" : `${classColumnStats.cp3.passRate}%`}
                    </td>
                    {/* Final */}
                    <td className="p-1 text-center font-mono font-bold bg-purple-500/15 border-l border-purple-500/30">
                      {classColumnStats.finalExam.status === "empty" ? "-" : `${classColumnStats.finalExam.passRate}%`}
                    </td>
                    <td className="p-1 text-center text-[9px] opacity-60">%</td>
                  </tr>

                  {/* Row 3: Status Ketercapaian */}
                  <tr className="text-[9px]">
                    <td className="p-2 text-left pl-3 sticky left-0 z-10 diagnostic-sticky-cell border-r border-current/20 font-bold shadow-md">
                      Status Ketercapaian
                    </td>
                    {/* Bab 1-6 */}
                    {classColumnStats.babStats.slice(0, 6).map((st, idx) => (
                      <td key={idx} className="p-1 text-center">
                        {st.status === "empty" ? (
                          <span className="opacity-30 font-mono text-[9px]">-</span>
                        ) : (
                          <span className={`inline-block w-4 h-4 rounded-full text-[8px] font-black leading-4 text-center ${
                            st.status === "passed" ? "bg-emerald-500 text-white" : st.status === "warning" ? "bg-amber-500 text-stone-950" : "bg-rose-500 text-white"
                          }`} title={`Bab ${idx + 1}: ${st.status === "passed" ? "Tuntas KKM" : st.status === "warning" ? "Waspada" : "Kritis"}`}>
                            {st.status === "passed" ? "✓" : st.status === "warning" ? "!" : "✕"}
                          </span>
                        )}
                      </td>
                    ))}
                    {/* CP1 */}
                    <td className="p-1 text-center bg-amber-500/15 border-x border-amber-500/30">
                      {classColumnStats.cp1.status === "empty" ? (
                        <span className="opacity-30 font-mono text-[9px]">-</span>
                      ) : (
                        <span className={`inline-block w-4 h-4 rounded-full text-[8px] font-black leading-4 text-center ${
                          classColumnStats.cp1.status === "passed" ? "bg-emerald-500 text-white" : classColumnStats.cp1.status === "warning" ? "bg-amber-500 text-stone-950" : "bg-rose-500 text-white"
                        }`}>
                          {classColumnStats.cp1.status === "passed" ? "✓" : "!"}
                        </span>
                      )}
                    </td>
                    {/* Bab 7-12 */}
                    {classColumnStats.babStats.slice(6, 12).map((st, idx) => (
                      <td key={idx + 6} className="p-1 text-center">
                        {st.status === "empty" ? (
                          <span className="opacity-30 font-mono text-[9px]">-</span>
                        ) : (
                          <span className={`inline-block w-4 h-4 rounded-full text-[8px] font-black leading-4 text-center ${
                            st.status === "passed" ? "bg-emerald-500 text-white" : st.status === "warning" ? "bg-amber-500 text-stone-950" : "bg-rose-500 text-white"
                          }`} title={`Bab ${idx + 7}: ${st.status === "passed" ? "Tuntas KKM" : st.status === "warning" ? "Waspada" : "Kritis"}`}>
                            {st.status === "passed" ? "✓" : st.status === "warning" ? "!" : "✕"}
                          </span>
                        )}
                      </td>
                    ))}
                    {/* CP2 */}
                    <td className="p-1 text-center bg-amber-500/15 border-x border-amber-500/30">
                      {classColumnStats.cp2.status === "empty" ? (
                        <span className="opacity-30 font-mono text-[9px]">-</span>
                      ) : (
                        <span className={`inline-block w-4 h-4 rounded-full text-[8px] font-black leading-4 text-center ${
                          classColumnStats.cp2.status === "passed" ? "bg-emerald-500 text-white" : classColumnStats.cp2.status === "warning" ? "bg-amber-500 text-stone-950" : "bg-rose-500 text-white"
                        }`}>
                          {classColumnStats.cp2.status === "passed" ? "✓" : "!"}
                        </span>
                      )}
                    </td>
                    {/* Bab 13-18 */}
                    {classColumnStats.babStats.slice(12, 18).map((st, idx) => (
                      <td key={idx + 12} className="p-1 text-center">
                        {st.status === "empty" ? (
                          <span className="opacity-30 font-mono text-[9px]">-</span>
                        ) : (
                          <span className={`inline-block w-4 h-4 rounded-full text-[8px] font-black leading-4 text-center ${
                            st.status === "passed" ? "bg-emerald-500 text-white" : st.status === "warning" ? "bg-amber-500 text-stone-950" : "bg-rose-500 text-white"
                          }`} title={`Bab ${idx + 13}: ${st.status === "passed" ? "Tuntas KKM" : st.status === "warning" ? "Waspada" : "Kritis"}`}>
                            {st.status === "passed" ? "✓" : st.status === "warning" ? "!" : "✕"}
                          </span>
                        )}
                      </td>
                    ))}
                    {/* CP3 */}
                    <td className="p-1 text-center bg-amber-500/15 border-x border-amber-500/30">
                      {classColumnStats.cp3.status === "empty" ? (
                        <span className="opacity-30 font-mono text-[9px]">-</span>
                      ) : (
                        <span className={`inline-block w-4 h-4 rounded-full text-[8px] font-black leading-4 text-center ${
                          classColumnStats.cp3.status === "passed" ? "bg-emerald-500 text-white" : classColumnStats.cp3.status === "warning" ? "bg-amber-500 text-stone-950" : "bg-rose-500 text-white"
                        }`}>
                          {classColumnStats.cp3.status === "passed" ? "✓" : "!"}
                        </span>
                      )}
                    </td>
                    {/* Final */}
                    <td className="p-1 text-center bg-purple-500/15 border-l border-purple-500/30">
                      {classColumnStats.finalExam.status === "empty" ? (
                        <span className="opacity-30 font-mono text-[9px]">-</span>
                      ) : (
                        <span className={`inline-block w-4 h-4 rounded-full text-[8px] font-black leading-4 text-center ${
                          classColumnStats.finalExam.status === "passed" ? "bg-emerald-500 text-white" : classColumnStats.finalExam.status === "warning" ? "bg-amber-500 text-stone-950" : "bg-rose-500 text-white"
                        }`}>
                          {classColumnStats.finalExam.status === "passed" ? "✓" : "!"}
                        </span>
                      )}
                    </td>
                    <td className="p-1 text-center text-[9px] opacity-60">Status</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          MODE B: DIAGNOSTIK DETAIL SISWA (INDIVIDUAL DEEP-DIVE)
          ========================================================== */}
      {viewMode === "individual" && selectedStudent && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* STUDENT SELECTOR & SUMMARY TOP BAR */}
          <div className="clay-card p-6 rounded-3xl border border-current/10 shadow-xl space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                    selectedStudent.avatarColor || "from-amber-400 to-amber-600"
                  } text-stone-950 font-black text-xl flex items-center justify-center shadow-lg border-2 border-white/40 shrink-0`}
                >
                  {selectedStudent.no}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400">
                      Rank #{selectedStudent.rank || selectedStudent.no} • Skor Komposit:{" "}
                      {selectedStudent.compositeScore ?? selectedStudent.summary?.compositeScore ?? 0}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-500">
                      {selectedStudent.nim ? `NIM: ${selectedStudent.nim}` : `Absen #${selectedStudent.no}`}
                    </span>
                    <span className="text-xs font-mono opacity-70">
                      • Predikat: {selectedStudent.grade || "B"}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                    {selectedStudent.name}
                  </h3>
                </div>
              </div>

              {/* Ganti Siswa Dropdown */}
              <div className="flex items-center gap-2 self-start lg:self-center">
                <label className="text-xs font-bold opacity-70 whitespace-nowrap">
                  Pilih Peserta Didik:
                </label>
                <select
                  value={selectedStudentNo}
                  onChange={(e) => setSelectedStudentNo(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl text-xs font-bold border border-current/20 bg-[var(--background)] text-[var(--text-heading)] focus:outline-hidden focus:border-amber-500"
                >
                  {students.map((st) => (
                    <option key={st.no} value={st.no} className="bg-stone-900 text-white">
                      {st.nim ? `${st.nim} - ${st.name}` : `#{st.rank || st.no} - ${st.name}`} ({st.grade || "B"})
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => onOpenStudentDetail && onOpenStudentDetail(selectedStudent)}
                  className="px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-stone-950 transition text-xs font-bold flex items-center gap-1.5"
                  title="Buka Modal Profil & Rapor Resmi"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Profil Rapor
                </button>
              </div>
            </div>

            {/* DIAGNOSTIC HIGHLIGHT CARDS (KELEMAHAN & KEKUATAN) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-current/10">
              {/* Card 1: Kekurangan Utama */}
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black text-rose-400">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10.5px]">
                    <AlertTriangle className="w-4 h-4 text-rose-400" /> Area Kekurangan Utama
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-300 text-[10px] font-mono font-bold">
                    Prioritas Remedial
                  </span>
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-[var(--text-heading)]">
                  {studentOverallDeficiencies.weakestSection}
                </h4>
                <p className="text-xs opacity-80 leading-relaxed text-[var(--text-body)]">
                  {studentOverallDeficiencies.items.length > 0
                    ? studentOverallDeficiencies.items.slice(0, 2).join(", ")
                    : "Tidak terdeteksi kelemahan kritis. Seluruh materi berada di atas standar tuntas."}
                </p>
              </div>

              {/* Card 2: Kekuatan Utama */}
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black text-emerald-400">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10.5px]">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Area Unggulan (Kekuatan)
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 text-[10px] font-mono font-bold">
                    Tuntas Tinggi
                  </span>
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-[var(--text-heading)]">
                  {selectedStudent.pilar && selectedStudent.pilar.dokkai >= selectedStudent.pilar.choukai
                    ? "Pemahaman Bacaan (Dokkai)"
                    : "Menyimak Audio (Choukai)"}
                </h4>
                <p className="text-xs opacity-80 leading-relaxed text-[var(--text-body)]">
                  Konsisten meraih poin tinggi pada tugas listening dan dialog percakapan situasional.
                </p>
              </div>

              {/* Card 3: Evaluasi Checkpoint & Ujian Akhir */}
              <div className="p-4 rounded-2xl bg-purple-500/15 border border-purple-500/30 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-black text-purple-300">
                  <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10.5px]">
                    <Award className="w-4 h-4 text-purple-300" /> Kesiapan Sertifikasi A2
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/25 text-purple-200 text-[10px] font-mono font-bold">
                    JFT-Basic Standard
                  </span>
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-[var(--text-heading)]">
                  {selectedStudent.grade === "A"
                    ? "Sangat Siap (A - 優秀)"
                    : selectedStudent.grade === "B"
                    ? "Siap Bersyarat (B - 良好)"
                    : "Perlu Pemantapan (C/D)"}
                </h4>
                <p className="text-xs opacity-80 leading-relaxed text-[var(--text-body)]">
                  {selectedStudent.grade === "A"
                    ? "Memiliki modalitas seimbang untuk kelulusan Ujian Resmi JFT-Basic A2."
                    : "Direkomendasikan memperkuat latihan kecepatan membaca wacana sebelum ujian resmi."}
                </p>
              </div>
            </div>
          </div>

          {/* TABEL DIAGNOSTIK DETAIL BAB 1 s.d. 18 + CHECKPOINTS + SHIKEN 1 BUKU */}
          <div className="clay-card p-4 sm:p-6 rounded-3xl border border-current/10 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-current/10 pb-3">
              <div>
                <h4 className="text-base font-bold font-serif flex items-center gap-2 text-[var(--text-heading)]">
                  <FileText className="w-4 h-4 text-amber-500" />
                  Rincian Diagnostik Per Bab &amp; Checkpoint
                </h4>
                <p className="text-xs opacity-75 mt-0.5 text-[var(--text-body)]">
                  Tabel pemetaan detail 4 seksi Shiken, Kanji, Kotoba, Honyaku beserta titik evaluasi kekurangan.
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-black/15 border border-current/15 text-[var(--text-heading)]">
                Total 22 Baris Evaluasi
              </span>
            </div>

            <div className="overflow-x-auto border border-current/20 rounded-2xl bg-black/20">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-current/20 bg-black/30 opacity-90 text-[10.5px] uppercase font-bold text-[var(--text-heading)]">
                    <th className="py-3 px-3 min-w-[140px]">Bab / Ujian</th>
                    {/* Seksi Shiken */}
                    <th className="py-3 px-2 text-center text-blue-400">
                      Moji-Goi (24/48)
                    </th>
                    <th className="py-3 px-2 text-center text-cyan-400">
                      Kaiwa (24/48)
                    </th>
                    <th className="py-3 px-2 text-center text-emerald-400">
                      Choukai (24/66)
                    </th>
                    <th className="py-3 px-2 text-center text-purple-300">
                      Dokkai (28/88)
                    </th>
                    <th className="py-3 px-2 text-center font-black text-amber-400">
                      Total Shiken
                    </th>
                    {/* 3 Aspek Lainnya */}
                    <th className="py-3 px-2 text-center text-rose-400 font-bold">
                      2. Kanji
                    </th>
                    <th className="py-3 px-2 text-center text-amber-400 font-bold">
                      3. Kotoba
                    </th>
                    <th className="py-3 px-2 text-center text-teal-400 font-bold">
                      4. Honyaku
                    </th>
                    {/* Diagnosa Kekurangan */}
                    <th className="py-3 px-3 min-w-[220px]">Diagnosa Kekurangan &amp; Catatan</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-current/10 font-mono text-[11px]">
                  {currentStudentRows.map((row) => {
                    const isCp = row.isCheckpoint;
                    const isFn = row.isFinal;
                    return (
                      <tr
                        key={row.key}
                        className={`transition ${
                          isFn
                            ? "bg-purple-500/15 font-black hover:bg-purple-500/25"
                            : isCp
                            ? "bg-amber-500/10 font-bold hover:bg-amber-500/20"
                            : "hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        {/* Kolom Bab / Ujian */}
                        <td className="py-2.5 px-3 font-sans">
                          <div className="flex items-center gap-1.5">
                            {isFn ? (
                              <Award className="w-4 h-4 text-purple-500 shrink-0" />
                            ) : isCp ? (
                              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            ) : (
                              <span className="w-2 h-2 rounded-full bg-stone-400 shrink-0" />
                            )}
                            <div>
                              <span
                                className={`font-bold block ${
                                  isFn
                                    ? "text-purple-600 dark:text-purple-400 font-black text-xs"
                                    : isCp
                                    ? "text-amber-600 dark:text-amber-400 font-black text-xs"
                                    : ""
                                }`}
                              >
                                {row.label}
                              </span>
                              <span className="text-[9.5px] opacity-60 font-mono">
                                {row.subLabel}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Moji-Goi */}
                        <td className="py-2 px-2 text-center">
                          <span
                            className={
                              row.shiken.mojiGoi > 0 &&
                              row.shiken.mojiGoi < (row.shiken.maxMojiGoi * kkm) / 100
                                ? "text-rose-500 font-black"
                                : ""
                            }
                          >
                            {row.shiken.mojiGoi > 0 ? row.shiken.mojiGoi : "-"}
                          </span>
                        </td>

                        {/* Kaiwa */}
                        <td className="py-2 px-2 text-center">
                          <span
                            className={
                              row.shiken.kaiwa > 0 &&
                              row.shiken.kaiwa < (row.shiken.maxKaiwa * kkm) / 100
                                ? "text-rose-500 font-black"
                                : ""
                            }
                          >
                            {row.shiken.kaiwa > 0 ? row.shiken.kaiwa : "-"}
                          </span>
                        </td>

                        {/* Choukai */}
                        <td className="py-2 px-2 text-center">
                          <span
                            className={
                              row.shiken.choukai > 0 &&
                              row.shiken.choukai < (row.shiken.maxChoukai * kkm) / 100
                                ? "text-rose-500 font-black"
                                : ""
                            }
                          >
                            {row.shiken.choukai > 0 ? row.shiken.choukai : "-"}
                          </span>
                        </td>

                        {/* Dokkai */}
                        <td className="py-2 px-2 text-center">
                          <span
                            className={
                              row.shiken.dokkai > 0 &&
                              row.shiken.dokkai < (row.shiken.maxDokkai * kkm) / 100
                                ? "text-rose-500 font-black"
                                : ""
                            }
                          >
                            {row.shiken.dokkai > 0 ? row.shiken.dokkai : "-"}
                          </span>
                        </td>

                        {/* Total Shiken */}
                        <td className="py-2 px-2 text-center font-black">
                          {row.shiken.total > 0 ? (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10.5px] ${
                                row.shiken.total >= (row.shiken.maxTotal * kkm) / 100
                                  ? "bg-emerald-600 text-white"
                                  : "bg-rose-600 text-white"
                              }`}
                            >
                              {row.shiken.total}
                            </span>
                          ) : (
                            <span className="opacity-40">-</span>
                          )}
                        </td>

                        {/* Kanji */}
                        <td className="py-2 px-2 text-center font-bold">
                          {row.kanji > 0 ? (
                            <span
                              className={
                                row.kanji < kkm ? "text-rose-500 font-black" : "text-emerald-500"
                              }
                            >
                              {row.kanji}
                            </span>
                          ) : (
                            <span className="opacity-40">-</span>
                          )}
                        </td>

                        {/* Kotoba */}
                        <td className="py-2 px-2 text-center font-bold">
                          {row.kotoba > 0 ? (
                            <span
                              className={
                                row.kotoba < kkm ? "text-rose-500 font-black" : "text-emerald-500"
                              }
                            >
                              {row.kotoba}
                            </span>
                          ) : (
                            <span className="opacity-40">-</span>
                          )}
                        </td>

                        {/* Honyaku */}
                        <td className="py-2 px-2 text-center font-bold">
                          {row.honyaku > 0 ? (
                            <span
                              className={
                                row.honyaku < kkm ? "text-rose-500 font-black" : "text-emerald-500"
                              }
                            >
                              {row.honyaku}
                            </span>
                          ) : (
                            <span className="opacity-40">-</span>
                          )}
                        </td>

                        {/* Diagnosa Kekurangan & Catatan */}
                        <td className="py-2 px-3 font-sans text-xs">
                          {row.deficiencies.length > 0 ? (
                            <div className="flex items-start gap-1.5 text-rose-600 dark:text-rose-400">
                              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              <div className="leading-tight">
                                <span className="font-bold text-[10.5px]">
                                  Kekurangan: {row.deficiencies.join(", ")}
                                </span>
                              </div>
                            </div>
                          ) : row.status === "passed" || row.status === "perfect" ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span className="text-[10.5px] font-bold">
                                {row.status === "perfect" ? "Tuntas Sempurna" : "Tuntas KKM"}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10.5px] opacity-50 italic">
                              Belum ada catatan ujian
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          GRAFIK KEMAJUAN BAB & REKOMENDASI PERBAIKAN PEDAGOGIS
          ======================================================== */}
      <ChapterProgressChartAndRecommendations
        students={students}
        kkm={kkm}
        selectedStudentNo={selectedStudentNo}
        onSelectStudent={(no) => setSelectedStudentNo(no)}
        onOpenStudentDetail={onOpenStudentDetail}
      />
    </div>
  );
}
