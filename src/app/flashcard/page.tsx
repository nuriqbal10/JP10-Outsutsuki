import Link from "next/link";
import { ArrowLeft, Sparkles, Layers, Volume2, CheckCircle2 } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function FlashcardPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-[var(--text-body)]">
      <header className="clay-card rounded-none border-x-0 border-t-0 border-b border-current/10 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-500 hover:text-amber-400 transition">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Portal
        </Link>
        <h1 className="text-xs sm:text-base font-extrabold text-[var(--text-heading)] flex items-center gap-1.5 sm:gap-2">
          <Layers className="w-4 h-4 text-amber-500" />
          <span>Studio Flashcard Kosakata IRODORI 3D</span>
        </h1>
        <div className="flex items-center gap-2">
          <ThemeSwitcher compact />
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-3 sm:p-6 flex-1 flex flex-col gap-4 sm:gap-6 w-full">
        <div className="clay-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-500/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 4.245 Kosakata Resmi (A1 • A2.1 • A2.2)
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--text-heading)]">Studio Flashcard Interaktif 3D</h2>
            <p className="text-xs sm:text-sm opacity-80 mt-1 max-w-xl leading-relaxed">
              Dilengkapi kartu bolak-balik 3D tactile, pelafalan audio native, pelacak progres Spaced Repetition (SRS), dan kuis gamifikasi.
            </p>
          </div>
          <a
            href="/flashcard-studio/index.html"
            target="_blank"
            className="w-full sm:w-auto text-center px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-900/30 hover:scale-105 active:scale-95 transition whitespace-nowrap"
          >
            Buka Layar Penuh ↗
          </a>
        </div>

        {/* EMBEDDED IFRAME OF THE 3D STUDIO */}
        <div className="clay-card rounded-2xl sm:rounded-3xl border border-current/10 overflow-hidden shadow-2xl flex-1 min-h-[580px] sm:min-h-[750px] -webkit-overflow-scrolling-touch">
          <iframe
            src="/flashcard-studio/index.html"
            className="w-full h-full min-h-[580px] sm:min-h-[750px] border-none bg-stone-900"
            title="Studio Flashcard Kosakata IRODORI 3D"
          />
        </div>
      </main>
    </div>
  );
}
