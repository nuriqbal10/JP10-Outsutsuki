import Link from "next/link";
import { ArrowLeft, Sparkles, BookOpen } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function KanjiStudioPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-[var(--text-body)]">
      <header className="clay-card rounded-none border-x-0 border-t-0 border-b border-current/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-amber-500 hover:text-amber-400 transition">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Portal
        </Link>
        <h1 className="text-sm sm:text-base font-extrabold text-[var(--text-heading)] flex items-center gap-2">
          ✍️ Studio Huruf Kanji IRODORI (A1 • A2.1 • A2.2)
        </h1>
        <div className="flex items-center gap-2">
          <ThemeSwitcher compact />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 flex-1 flex flex-col gap-6 w-full">
        {/* BANNER */}
        <div className="clay-card rounded-3xl p-6 sm:p-8 border border-purple-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 3 Jenjang Lengkap (A1 • A2.1 • A2.2)
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--text-heading)]">Studio Master Huruf Kanji IRODORI</h2>
            <p className="text-xs sm:text-sm opacity-80 mt-1 max-w-xl leading-relaxed">
              Dilengkapi lembar latihan kisi-kisi (20-Grid Box), animasi goresan huruf (Stroke Order SVG), kartu flashcard 3D kanji, kuis interaktif, dan lembar print-out A4 presisi.
            </p>
          </div>
          <a
            href="/kanji-studio/index.html"
            target="_blank"
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 transition whitespace-nowrap"
          >
            Buka Fullscreen Studio ↗
          </a>
        </div>

        {/* EMBEDDED IFRAME OF THE MASTER KANJI STUDIO */}
        <div className="clay-card rounded-3xl border border-current/10 overflow-hidden shadow-xl flex-1 min-h-[850px]">
          <iframe
            src="/kanji-studio/index.html"
            className="w-full h-full min-h-[850px] border-none bg-white"
            title="Studio Master Huruf Kanji IRODORI"
          />
        </div>
      </main>
    </div>
  );
}
