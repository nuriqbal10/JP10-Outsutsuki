import Link from "next/link";
import { ArrowLeft, Sparkles, Layers, Volume2, CheckCircle2 } from "lucide-react";

export default function FlashcardPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Portal
        </Link>
        <h1 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          🎴 Studio Flashcard Kosakata IRODORI 3D
        </h1>
        <div className="w-20" />
      </header>

      <main className="max-w-6xl mx-auto p-6 flex-1 flex flex-col gap-6 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-pink-50 text-pink-600 border border-pink-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> 4.245 Kosakata Resmi (A1 • A2.1 • A2.2)
            </div>
            <h2 className="text-2xl font-black text-slate-900">Studio Flashcard Interaktif 3D</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Dilengkapi kartu bolak-balik 3D, sintesis suara Jepang native, pelacak progres Spaced Repetition (SRS), dan kuis gamifikasi.
            </p>
          </div>
          <a
            href="/flashcard-studio/index.html"
            target="_blank"
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 hover:scale-105 active:scale-95 transition whitespace-nowrap"
          >
            Buka Fullscreen Studio ↗
          </a>
        </div>

        {/* EMBEDDED IFRAME OF THE 3D STUDIO */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg shadow-indigo-500/5 flex-1 min-h-[750px]">
          <iframe
            src="/flashcard-studio/index.html"
            className="w-full h-full min-h-[750px] border-none"
            title="Studio Flashcard Kosakata IRODORI 3D"
          />
        </div>
      </main>
    </div>
  );
}
