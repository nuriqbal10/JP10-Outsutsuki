import Link from "next/link";
import { ArrowLeft, Sparkles, BookOpen } from "lucide-react";

export default function KanjiStudioPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Portal
        </Link>
        <h1 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          ✍️ Studio Huruf Kanji IRODORI (A1 • A2.1 • A2.2)
        </h1>
        <div className="w-20" />
      </header>

      <main className="max-w-7xl mx-auto p-6 flex-1 flex flex-col gap-6 w-full">
        {/* BANNER */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> 3 Jenjang Lengkap (A1 • A2.1 • A2.2)
            </div>
            <h2 className="text-2xl font-black text-slate-900">Studio Master Huruf Kanji IRODORI</h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              Dilengkapi lembar latihan kisi-kisi (20-Grid Box), animasi goresan huruf (Stroke Order SVG), kartu flashcard 3D kanji, kuis interaktif, dan lembar print-out A4 presisi.
            </p>
          </div>
          <a
            href="/kanji-studio/index.html"
            target="_blank"
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 transition whitespace-nowrap"
          >
            Buka Fullscreen Studio ↗
          </a>
        </div>

        {/* EMBEDDED IFRAME OF THE MASTER KANJI STUDIO */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg shadow-purple-500/5 flex-1 min-h-[850px]">
          <iframe
            src="/kanji-studio/index.html"
            className="w-full h-full min-h-[850px] border-none"
            title="Studio Master Huruf Kanji IRODORI"
          />
        </div>
      </main>
    </div>
  );
}
