"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Home,
  Award,
  Layers,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  FileText,
  User,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Trophy, Swords,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import ThemeSwitcher from "@/components/ThemeSwitcher";

interface LmsSidebarProps {
  currentChapter?: number;
  isOpen: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const CHAPTERS = [
  { num: 1, title: "私のこと", topic: "Perkenalan Diri & Kehidupan di Jepang" },
  { num: 2, title: "どんな人ですか", topic: "Ciri Fisik & Karakter Orang" },
  { num: 3, title: "おすすめは何ですか", topic: "Restoran, Menu & Alergi" },
  { num: 4, title: "何時からですか", topic: "Jam Kerja & Shift Pabrik" },
  { num: 5, title: "安全第一", topic: "Aturan Pabrik & K3" },
  { num: 6, title: "どうやって行きますか", topic: "Transportasi & Tiket Kereta" },
  { num: 7, title: "雨が降ったら、ホールでやります", topic: "Festival Komunitas & Cuaca" },
  { num: 8, title: "屋台はどこかわかりますか？", topic: "Denah Festival & Petunjuk Arah" },
  { num: 9, title: "成人の日は、何をするんですか？", topic: "Hari Libur Nasional & Budaya" },
  { num: 10, title: "どんな服を着て行けばいいですか？", topic: "Etiket Berpakaian & Upacara" },
  { num: 11, title: "ポイントカードを忘れてしまいました", topic: "Belanja & Penyesalan" },
  { num: 12, title: "このボタンを押すと、エコモードに変わります", topic: "Peralatan Elektronik & Mesin" },
  { num: 13, title: "いろいろな資料を展示してあります", topic: "Fasilitas Umum & Balai Kota" },
  { num: 14, title: "髪をもう少し短くしてください", topic: "Layanan Jasa, Salon & Kurir" },
  { num: 15, title: "ゴミを減らすために、マイバッグを持っています", topic: "Pemilahan Sampah & Gaya Hidup Eco" },
  { num: 16, title: "地震が起きたら、どうすればいいですか？", topic: "Mitigasi Bencana & Keselamatan" },
  { num: 17, title: "日本語が前より話せるようになりました", topic: "Perkembangan Diri & Adaptasi" },
  { num: 18, title: "将来、自分の会社を作ろうと思っています", topic: "Rencana Masa Depan & Karir" },
];

export default function LmsSidebar({
  currentChapter,
  isOpen,
  onToggle,
  isMobileOpen,
  onMobileClose,
}: LmsSidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const [studentName, setStudentName] = useState<string>("Siswa Outsutsuki");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("irodori_student_name");
      if (user?.fullName || user?.firstName) {
        setStudentName(user.fullName || user.firstName || "Siswa Outsutsuki");
      } else if (savedName) {
        setStudentName(savedName);
      }
    }
  }, [user]);

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between clay-card rounded-none border-y-0 border-l-0 border-r border-current/10">
      {/* 1. BRAND HEADER SIDEBAR */}
      <div className="p-4 border-b border-current/10 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 p-1 rounded-xl bg-white dark:bg-stone-800 flex items-center justify-center border border-amber-400/50 shadow-md shrink-0 group-hover:scale-105 transition">
            <img
              src="/logo_outsutsuki.png"
              alt="Logo Outsutsuki"
              className="w-full h-full object-contain filter dark:invert"
            />
          </div>
          {isOpen && (
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight leading-none group-hover:text-amber-500 transition">
                OUTSUTSUKI LMS
              </span>
              <span className="text-[10px] text-amber-500 font-bold mt-1 tracking-wider uppercase">
                大筒木クラス • A2.2
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggle}
          className="hidden lg:flex p-1.5 rounded-lg bg-black/5 dark:bg-black/40 hover:scale-105 border border-current/10 transition"
          title={isOpen ? "Lipat Sidebar (Maksimalkan Layar)" : "Buka Sidebar"}
        >
          {isOpen ? <ChevronLeft className="w-4 h-4 text-amber-500" /> : <ChevronRight className="w-4 h-4 text-amber-500" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1.5 rounded-lg bg-black/5 dark:bg-black/40 hover:scale-105 border border-current/10 transition"
        >
          <X className="w-5 h-5 text-amber-500" />
        </button>
      </div>

      {/* 2. DAFTAR BAB & MENU NAVIGASI (SCROLLABLE) */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-5 custom-scrollbar">
        {/* Menu Utama */}
        <div className="flex flex-col gap-1">
          {isOpen && (
            <span className="px-3 text-[10px] font-black uppercase tracking-wider text-rose-400/60 mb-1">
              Menu Utama
            </span>
          )}

          <Link
            href="/lms/irodori-a2-2"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              pathname === "/lms/irodori-a2-2"
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/40 shadow-sm"
                : "opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
            title="Katalog Silabus Kursus"
          >
            <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
            {isOpen && <span>Silabus Bab (1–18)</span>}
          </Link>

          <Link
            href="/arena"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              pathname === "/arena"
                ? "bg-purple-600/20 text-purple-400 border border-purple-500/40 shadow-sm"
                : "opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
            title="Shinobi Arena Bunpou & Kotoba Battle"
          >
            <Swords className="w-4 h-4 text-purple-400 shrink-0" />
            {isOpen && <span>Shinobi Arena (文法バトル)</span>}
          </Link>

          <Link
            href="/cbt"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition"
            title="Simulasi Ujian CBT JFT-Basic"
          >
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            {isOpen && <span>Simulasi CBT JFT</span>}
          </Link>

          <Link
            href="/rapor"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
              pathname === "/rapor"
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/40 shadow-sm"
                : "opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
            }`}
            title="Rapor & Statistik Kelas Outsutsuki"
          >
            <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
            {isOpen && <span>Rapor Kelas (成績表)</span>}
          </Link>

          <Link
            href="/flashcard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition"
            title="Flashcard Kosakata Irodori"
          >
            <Layers className="w-4 h-4 text-amber-500 shrink-0" />
            {isOpen && <span>Flashcard Kosakata</span>}
          </Link>
        </div>

        {/* Daftar Bab Irodori A2.2 */}
        <div className="flex flex-col gap-1">
          {isOpen && (
            <div className="px-3 flex items-center justify-between text-[10px] font-black uppercase tracking-wider opacity-60 mb-1">
              <span>Modul Bab Irodori</span>
              <span className="text-amber-500">12 Bab</span>
            </div>
          )}

          <div className="flex flex-col gap-1">
            {CHAPTERS.map((bab) => {
              const isActive = currentChapter === bab.num;
              return (
                <Link
                  key={bab.num}
                  href={`/lms/irodori-a2-2/bab/${bab.num}`}
                  onClick={onMobileClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition group text-left ${
                    isActive
                      ? "bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-300 font-bold shadow-sm"
                      : "opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                  title={`第${bab.num}課: ${bab.title}`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0 border ${
                      isActive
                        ? "bg-amber-500 text-stone-950 border-amber-300 shadow"
                        : "bg-black/5 dark:bg-black/40 border border-current/15"
                    }`}
                  >
                    {bab.num}
                  </span>

                  {isOpen && (
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs truncate font-extrabold group-hover:text-amber-500 transition">
                        第{bab.num}課 {bab.title}
                      </span>
                      <span className="text-[10px] opacity-60 truncate">
                        {bab.topic}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. PROFIL SISWA & THEME SWITCHER (FOOTER SIDEBAR) */}
      <div className="p-3 border-t border-current/10 bg-black/5 dark:bg-black/30 shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <ThemeSwitcher compact={!isOpen} />
        </div>

        <div className="flex items-center gap-3 p-2 rounded-xl bg-black/5 dark:bg-black/40 border border-current/10">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-500 shrink-0">
            <User className="w-4 h-4" />
          </div>
          {isOpen && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-black truncate">
                {studentName}
              </span>
              <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Kelas: outsutsuki
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 ease-in-out sticky top-0 h-screen z-30 ${
          isOpen ? "w-64" : "w-18"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* MOBILE DRAWER (SLIDE-OVER) */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
          />
          {/* Drawer Content */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
