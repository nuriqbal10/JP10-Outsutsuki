"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Search,
  Sparkles,
  Layers,
  Filter,
  CheckCircle2,
  Bookmark,
  Volume2,
  RotateCcw,
  LayoutGrid,
  List,
  Flame,
  Download,
  Share2,
  Puzzle,
  ArrowRight,
} from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import BunpouCard from "@/components/bunpou/BunpouCard";
import rawBunpouData from "@/data/bunpouData.json";
import { BunpouItem, BunpouLevelFilter } from "@/types/bunpou";

const allBunpou: BunpouItem[] = rawBunpouData as BunpouItem[];

export default function IrodoriBunpouPage() {
  const [selectedLevel, setSelectedLevel] = useState<BunpouLevelFilter>("all");
  const [selectedLesson, setSelectedLesson] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [masteredFilter, setMasteredFilter] = useState<"all" | "mastered" | "unmastered">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pageSize, setPageSize] = useState<number>(24);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Mastered patterns tracked in localStorage
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("irodori_bunpou_mastered");
      if (saved) {
        setMasteredIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load mastered bunpou from storage", e);
    }
    setIsLoaded(true);
  }, []);

  const toggleMastered = (id: string) => {
    setMasteredIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("irodori_bunpou_mastered", JSON.stringify(next));
      } catch (e) {
        console.error("Failed to save mastered bunpou to storage", e);
      }
      return next;
    });
  };

  // Available lessons based on selected level
  const availableLessons = useMemo(() => {
    let pool = allBunpou;
    if (selectedLevel !== "all") {
      pool = pool.filter((b) => b.level === selectedLevel);
    }
    const lessons = Array.from(new Set(pool.map((b) => b.lesson))).sort((a, b) => a - b);
    return lessons;
  }, [selectedLevel]);

  // Available topics based on selected level
  const availableTopics = useMemo(() => {
    let pool = allBunpou;
    if (selectedLevel !== "all") {
      pool = pool.filter((b) => b.level === selectedLevel);
    }
    const topics = Array.from(new Set(pool.map((b) => b.topic))).sort();
    return topics;
  }, [selectedLevel]);

  // Reset lesson & topic if no longer present when level switches
  useEffect(() => {
    setSelectedLesson("all");
    setSelectedTopic("all");
    setCurrentPage(1);
  }, [selectedLevel]);

  // Filtered dataset
  const filteredBunpou = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allBunpou.filter((item) => {
      // Level filter
      if (selectedLevel !== "all" && item.level !== selectedLevel) return false;

      // Lesson filter
      if (selectedLesson !== "all" && item.lesson !== Number(selectedLesson)) return false;

      // Topic filter
      if (selectedTopic !== "all" && item.topic !== selectedTopic) return false;

      // Mastered filter
      const isM = masteredIds.includes(item.id);
      if (masteredFilter === "mastered" && !isM) return false;
      if (masteredFilter === "unmastered" && isM) return false;

      // Search query (supports pattern in JP/hiragana/kanji, Indonesian meaning, formula, and related words)
      if (q) {
        const inPattern = item.pattern.toLowerCase().includes(q);
        const inMeaning = item.meaning ? item.meaning.toLowerCase().includes(q) : false;
        const inFormula = item.formulaDetailed ? item.formulaDetailed.toLowerCase().includes(q) : false;
        const inUsage = item.usageRule ? item.usageRule.toLowerCase().includes(q) : false;
        const inPuzzleTrans = item.puzzle?.translation ? item.puzzle.translation.toLowerCase().includes(q) : false;
        const inExample = item.example.toLowerCase().includes(q);
        const inTopic = item.topic.toLowerCase().includes(q);
        const inLessonTitle = item.lessonTitle.toLowerCase().includes(q);
        const inMarugoto = item.marugoto ? item.marugoto.toLowerCase().includes(q) : false;
        const inConnections = item.connectionForms
          ? item.connectionForms.some(
              (c) =>
                c.category.toLowerCase().includes(q) ||
                c.rule.toLowerCase().includes(q) ||
                c.examples.some((ex) => ex.toLowerCase().includes(q))
            )
          : false;
        const inRelated = item.relatedPatterns
          ? item.relatedPatterns.some(
              (r) =>
                r.target.toLowerCase().includes(q) ||
                r.comparison.toLowerCase().includes(q) ||
                r.relation.toLowerCase().includes(q)
            )
          : false;

        if (
          !inPattern &&
          !inMeaning &&
          !inFormula &&
          !inUsage &&
          !inPuzzleTrans &&
          !inExample &&
          !inTopic &&
          !inLessonTitle &&
          !inMarugoto &&
          !inConnections &&
          !inRelated
        ) {
          return false;
        }
      }

      return true;
    });
  }, [selectedLevel, selectedLesson, selectedTopic, masteredFilter, searchQuery, masteredIds]);

  // Reset page when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLesson, selectedTopic, masteredFilter, pageSize]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredBunpou.length / pageSize);
  const paginatedBunpou = useMemo(() => {
    if (pageSize >= 999) return filteredBunpou;
    const start = (currentPage - 1) * pageSize;
    return filteredBunpou.slice(start, start + pageSize);
  }, [filteredBunpou, currentPage, pageSize]);

  // Counts
  const countA1 = allBunpou.filter((b) => b.level === "a1").length;
  const countA21 = allBunpou.filter((b) => b.level === "a2-1").length;
  const countA22 = allBunpou.filter((b) => b.level === "a2-2").length;
  const totalMastered = masteredIds.length;
  const masteredPercentage = Math.round((totalMastered / allBunpou.length) * 100);

  const resetAllFilters = () => {
    setSelectedLevel("all");
    setSelectedLesson("all");
    setSelectedTopic("all");
    setSearchQuery("");
    setMasteredFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 clay-card rounded-none border-x-0 border-t-0 border-b border-black/10 dark:border-white/10 px-4 sm:px-6 py-3.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300 hover:text-amber-500 transition px-2.5 py-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali ke Portal</span>
            </Link>
            <div className="h-4 w-px bg-black/10 dark:bg-white/10 hidden sm:block" />
            <h1 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
              <span className="text-amber-500">📖</span>
              <span>IRODORI文法リスト</span>
              <span className="hidden md:inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                全264文型
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/bunpou-test"
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition inline-flex items-center gap-1.5 shadow-sm"
            >
              <Puzzle className="w-3.5 h-3.5" />
              <span>Mini Test Puzzle</span>
            </Link>
            <Link
              href="/kanji"
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-purple-500/40 hover:text-purple-600 dark:hover:text-purple-400 transition hidden lg:inline-flex items-center gap-1.5"
            >
              ✍️ Studio Kanji
            </Link>
            <Link
              href="/flashcard"
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-rose-500/40 hover:text-rose-600 dark:hover:text-rose-400 transition hidden lg:inline-flex items-center gap-1.5"
            >
              🎴 Kosakata 3D
            </Link>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col gap-6 w-full">
        {/* HERO BANNER */}
        <section className="clay-card rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-xl relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-transparent to-rose-500/5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 text-xs font-bold mb-3 bg-amber-500/15 text-amber-700 dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                Daftar Tata Bahasa Resmi Japan Foundation
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-stone-900 dark:text-white">
                IRODORI文法リスト <span className="text-amber-500 font-extrabold text-lg sm:text-2xl block sm:inline">（A1 • A2.1 • A2.2）</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-2 leading-relaxed">
                Kompilasi lengkap seluruh <strong>264 pola kalimat (文型)</strong> dari 3 buku resmi <em>Irodori: Bahasa Jepang untuk Hidup di Jepang</em>. Dikelompokkan per tingkatan buku, lengkap dengan rumus pola, contoh percakapan nyata ber-audio, dan catatan padanan kurikulum JF Marugoto.
              </p>

              {/* Progress Summary */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-stone-600 dark:text-stone-300">
                <div className="flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  <span>Dikuasai:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-black">
                    {totalMastered} / {allBunpou.length} ({masteredPercentage}%)
                  </span>
                </div>
                <div className="h-3 w-px bg-black/10 dark:bg-white/10" />
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Status: Siap Simulasi JFT-Basic & Ujian A2</span>
                </div>
              </div>

              {/* Arena Mini Test CTA */}
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href="/bunpou-test"
                  className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xs shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition inline-flex items-center gap-2"
                >
                  <Puzzle className="w-4 h-4" />
                  <span>🎮 Arena Mini Test & Kotoba Puzzle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Level Quick Badges */}
            <div className="flex flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
              <div className="flex-1 lg:w-56 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 uppercase">
                    入門 A1 Starter
                  </div>
                  <div className="text-base font-black text-emerald-900 dark:text-emerald-100">
                    {countA1} Pola
                  </div>
                </div>
                <span className="text-xl">🌱</span>
              </div>

              <div className="flex-1 lg:w-56 p-3 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-sky-700 dark:text-sky-300 uppercase">
                    初級1 A2.1 Elementary 1
                  </div>
                  <div className="text-base font-black text-sky-900 dark:text-sky-100">
                    {countA21} Pola
                  </div>
                </div>
                <span className="text-xl">🌊</span>
              </div>

              <div className="flex-1 lg:w-56 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 uppercase">
                    初級2 A2.2 Elementary 2
                  </div>
                  <div className="text-base font-black text-amber-900 dark:text-amber-100">
                    {countA22} Pola
                  </div>
                </div>
                <span className="text-xl">🔥</span>
              </div>
            </div>
          </div>
        </section>

        {/* BOOK TABS SELECTOR */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Tab: Semua */}
            <button
              onClick={() => setSelectedLevel("all")}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shadow-xs ${
                selectedLevel === "all"
                  ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-md scale-102"
                  : "bg-black/5 dark:bg-white/5 text-stone-600 dark:text-stone-300 hover:bg-black/10 dark:hover:bg-white/10"
              }`}
            >
              <span>Semua Buku</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/20 dark:bg-white/20">
                {allBunpou.length}
              </span>
            </button>

            {/* Tab: A1 */}
            <button
              onClick={() => setSelectedLevel("a1")}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shadow-xs ${
                selectedLevel === "a1"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25 scale-102"
                  : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20"
              }`}
            >
              <span>入門 A1 (Starter)</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/20 dark:bg-white/20">
                {countA1}
              </span>
            </button>

            {/* Tab: A2.1 */}
            <button
              onClick={() => setSelectedLevel("a2-1")}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shadow-xs ${
                selectedLevel === "a2-1"
                  ? "bg-sky-600 text-white shadow-md shadow-sky-500/25 scale-102"
                  : "bg-sky-500/10 text-sky-700 dark:text-sky-300 hover:bg-sky-500/20 border border-sky-500/20"
              }`}
            >
              <span>初級1 A2.1 (Elementary 1)</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/20 dark:bg-white/20">
                {countA21}
              </span>
            </button>

            {/* Tab: A2.2 */}
            <button
              onClick={() => setSelectedLevel("a2-2")}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 shadow-xs ${
                selectedLevel === "a2-2"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-500/25 scale-102"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/20"
              }`}
            >
              <span>初級2 A2.2 (Elementary 2)</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/20 dark:bg-white/20">
                {countA22}
              </span>
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-black/10 dark:border-white/10">
            <button
              onClick={() => setViewMode("grid")}
              title="Tampilan Grid Kartu"
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === "grid"
                  ? "bg-white dark:bg-stone-800 text-amber-500 shadow-xs"
                  : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("list")}
              title="Tampilan Daftar Ringkas"
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === "list"
                  ? "bg-white dark:bg-stone-800 text-amber-500 shadow-xs"
                  : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Tabel</span>
            </button>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS BAR */}
        <div className="clay-card p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Cari pola kalimat, arti bahasa Indonesia (contoh: sambil, harus, suka, sebelum), topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Bab / Lesson */}
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition cursor-pointer"
            >
              <option value="all">Semua Bab</option>
              {availableLessons.map((l) => (
                <option key={l} value={l}>
                  Bab {l}
                </option>
              ))}
            </select>

            {/* Filter Topik */}
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition cursor-pointer max-w-[150px] truncate"
            >
              <option value="all">Semua Topik</option>
              {availableTopics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Filter Status Hafalan */}
            <select
              value={masteredFilter}
              onChange={(e) => setMasteredFilter(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="mastered">Sudah Dikuasai</option>
              <option value="unmastered">Belum Dikuasai</option>
            </select>

            {/* Reset Filters Button */}
            {(searchQuery || selectedLesson !== "all" || selectedTopic !== "all" || masteredFilter !== "all" || selectedLevel !== "all") && (
              <button
                onClick={resetAllFilters}
                className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition flex items-center gap-1"
                title="Reset Semua Filter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* ACTIVE FILTER STATUS BAR */}
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
          <div>
            Menampilkan <strong className="text-stone-900 dark:text-stone-100 font-extrabold">{filteredBunpou.length}</strong> pola kalimat
            {selectedLevel !== "all" && (
              <span> • Buku: <strong className="text-amber-500 uppercase">{selectedLevel}</strong></span>
            )}
            {selectedLesson !== "all" && (
              <span> • Bab: <strong className="text-stone-900 dark:text-stone-100">{selectedLesson}</strong></span>
            )}
            {searchQuery && (
              <span> • Pencarian: &ldquo;{searchQuery}&rdquo;</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>Tampilkan per halaman:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-transparent font-bold text-stone-700 dark:text-stone-300 border-b border-stone-400 focus:outline-none cursor-pointer"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={999}>Semua ({filteredBunpou.length})</option>
            </select>
          </div>
        </div>

        {/* CONTENT VIEW: GRID OR LIST */}
        {filteredBunpou.length === 0 ? (
          <div className="clay-card rounded-3xl p-12 text-center border border-black/10 dark:border-white/10 flex flex-col items-center justify-center gap-3">
            <span className="text-4xl">🔍</span>
            <h3 className="text-base font-extrabold text-stone-800 dark:text-stone-200">
              Tidak ada pola kalimat yang cocok
            </h3>
            <p className="text-xs text-stone-500 max-w-sm">
              Coba sesuaikan kata kunci pencarian, ubah filter bab/topik, atau klik tombol Reset untuk melihat semua daftar.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-2 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-md hover:scale-105 transition"
            >
              Reset Filter
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedBunpou.map((item) => (
              <BunpouCard
                key={item.id}
                bunpou={item}
                isMastered={masteredIds.includes(item.id)}
                onToggleMastered={toggleMastered}
              />
            ))}
          </div>
        ) : (
          /* TABLE / LIST COMPACT VIEW */
          <div className="clay-card rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/10 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5 border-b border-black/10 dark:border-white/10 text-stone-500 dark:text-stone-400 uppercase tracking-wider font-extrabold text-[10px]">
                    <th className="p-3.5 text-center w-12">No</th>
                    <th className="p-3.5 w-24">Buku / Bab</th>
                    <th className="p-3.5 w-44">Topik & Judul Bab</th>
                    <th className="p-3.5 min-w-[220px]">Rumus Pola (文型)</th>
                    <th className="p-3.5 min-w-[260px]">Contoh Percakapan (例文)</th>
                    <th className="p-3.5 min-w-[160px]">Marugoto</th>
                    <th className="p-3.5 text-center w-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {paginatedBunpou.map((item, idx) => {
                    const isM = masteredIds.includes(item.id);
                    const rowNumber = (currentPage - 1) * pageSize + idx + 1;
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition ${
                          isM ? "bg-emerald-500/[0.03]" : ""
                        }`}
                      >
                        <td className="p-3.5 text-center font-bold text-stone-400">
                          {rowNumber}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                              item.level === "a1"
                                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                                : item.level === "a2-1"
                                ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30"
                                : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                            }`}
                          >
                            {item.levelJapanese}
                          </span>
                          <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300 mt-1">
                            Bab {item.lesson} {item.num}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-extrabold text-stone-900 dark:text-stone-100">
                            {item.topic}
                          </div>
                          <div className="text-[10px] text-stone-500 mt-0.5">
                            {item.lessonTitle}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-black text-stone-900 dark:text-stone-100 text-sm whitespace-pre-line font-sans">
                            {item.pattern}
                          </div>
                          {item.meaning && (
                            <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold mt-1 leading-snug">
                              💡 {item.meaning}
                            </div>
                          )}
                          {item.formulaDetailed && (
                            <div className="text-[10px] text-stone-500 font-mono mt-0.5 line-clamp-1">
                              {item.formulaDetailed.split(/[\r\n]+/)[0]}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5">
                          <div className="text-stone-800 dark:text-stone-200 text-xs whitespace-pre-line leading-relaxed font-semibold">
                            {item.example}
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-[10px] text-stone-500">
                          {item.marugoto || "-"}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => toggleMastered(item.id)}
                            className={`p-1.5 rounded-lg transition ${
                              isM
                                ? "text-emerald-600 bg-emerald-500/10"
                                : "text-stone-400 hover:text-amber-500 hover:bg-amber-500/10"
                            }`}
                            title={isM ? "Dikuasai" : "Tandai sudah dikuasai"}
                          >
                            {isM ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && pageSize < 999 && (
          <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-4 text-xs font-bold">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/10 dark:hover:bg-white/10 transition"
            >
              ← Halaman Sebelumnya
            </button>

            <span className="text-stone-500 dark:text-stone-400">
              Halaman <strong className="text-stone-900 dark:text-stone-100">{currentPage}</strong> dari {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/10 dark:hover:bg-white/10 transition"
            >
              Halaman Berikutnya →
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="clay-card rounded-none border-x-0 border-b-0 border-t border-black/10 dark:border-white/10 py-6 text-center text-xs opacity-60">
        <p>OUTSUTSUKI PORTAL • IRODORI文法リスト • Kurikulum JF Standard & The Japan Foundation</p>
      </footer>
    </div>
  );
}
