import Link from "next/link";
import { ArrowLeft, Sparkles, Layers, Volume2, CheckCircle2 } from "lucide-react";

export default function FlashcardPage() {
  return (
    <div className="min-h-screen bg-[#1c040a] flex flex-col text-rose-100">
      <header className="bg-[#24060e] border-b border-rose-900/40 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <Link href="/" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-rose-300 hover:text-amber-400 transition">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Portal
        </Link>
        <h1 className="text-xs sm:text-base font-extrabold text-rose-50 flex items-center gap-1.5 sm:gap-2">
          🎴 Studio Flashcard Kosakata IRODORI 3D
        </h1>
        <div className="w-12 sm:w-20" />
      </header>

      <main className="max-w-6xl mx-auto p-3 sm:p-6 flex-1 flex flex-col gap-4 sm:gap-6 w-full">
        <div className="clay-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-rose-800/40 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 4.245 Kosakata Resmi (A1 • A2.1 • A2.2)
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-rose-50">Studio Flashcard Interaktif 3D</h2>
            <p className="text-xs sm:text-sm text-rose-300/80 mt-1 max-w-xl">
              Dilengkapi kartu bolak-balik 3D tactile, pelafalan audio native, pelacak progres Spaced Repetition (SRS), dan kuis gamifikasi.
            </p>
          </div>
          <a
            href="/flashcard-studio/index.html"
            target="_blank"
            className="w-full sm:w-auto text-center px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-900/50 hover:scale-105 active:scale-95 transition whitespace-nowrap"
          >
            Buka Layar Penuh ↗
          </a>
        </div>

        {/* EMBEDDED IFRAME OF THE 3D STUDIO */}
        <div className="clay-card rounded-2xl sm:rounded-3xl border border-rose-900/50 overflow-hidden shadow-2xl flex-1 min-h-[580px] sm:min-h-[750px] -webkit-overflow-scrolling-touch">
          <iframe
            src="/flashcard-studio/index.html"
            className="w-full h-full min-h-[580px] sm:min-h-[750px] border-none"
            title="Studio Flashcard Kosakata IRODORI 3D"
          />
        </div>
      </main>
    </div>
  );
}
