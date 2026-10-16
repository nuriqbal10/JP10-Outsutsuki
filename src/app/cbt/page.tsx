import Link from "next/link";
import { ArrowLeft, Clock, Volume2, Award, CheckCircle2, AlertCircle, FileText, ChevronRight, Sparkles, BookOpen } from "lucide-react";

export default function CbtSimulatorPage() {
  const chapters = [
    { num: 1, title: "私のこと", topic: "Perkenalan Diri & Kehidupan di Jepang", questions: 100, status: "Siap Ujian" },
    { num: 2, title: "どんな人ですか", topic: "Ciri Fisik, Karakter & Pakaian", questions: 100, status: "Siap Ujian" },
    { num: 3, title: "おすすめは何ですか", topic: "Restoran, Makanan & Reservasi", questions: 100, status: "Siap Ujian" },
    { num: 4, title: "何時からですか", topic: "Jam Kerja, Lembur & Jadwal", questions: 100, status: "Siap Ujian" },
    { num: 5, title: "安全第一", topic: "Aturan Pabrik & Keselamatan K3", questions: 95, status: "Siap Ujian" },
    { num: 6, title: "どうやって行きますか", topic: "Transportasi, Tiket & Rute", questions: 95, status: "Siap Ujian" },
    { num: 7, title: "雨が降ったら、ホールでやります", topic: "Festival & Acara Komunitas", questions: 90, status: "Siap Ujian" },
    { num: 8, title: "屋台はどこかわかりますか？", topic: "Denah Stan Festival & Posisi", questions: 40, status: "Siap Ujian" },
    { num: 9, title: "成人の日は、何をするんですか？", topic: "Hari Libur Nasional & Perayaan Jepang", questions: 40, status: "Siap Ujian" },
    { num: 10, title: "どんな服を着て行けばいいですか？", topic: "Etiket Menghadiri Acara & Pakaian", questions: 40, status: "Siap Ujian" },
    { num: 11, title: "ポイントカードを忘れてしまいました", topic: "Berbelanja, Fitting & Kasir", questions: 40, status: "Siap Ujian" },
    { num: 12, title: "このボタンを押すと、エコモードに変わります", topic: "Pengoperasian Alat Elektronik & Tombol", questions: 40, status: "Siap Ujian" },
    { num: 13, title: "いろいろな資料を展示してあります", topic: "Fasilitas Umum, Balai Kota & Galeri", questions: 40, status: "Siap Ujian" },
    { num: 14, title: "髪をもう少し短くしてください", topic: "Salon Rambut, Laundry & Kurir Paket", questions: 40, status: "Siap Ujian" },
    { num: 15, title: "ゴミを減らすために、マイバッグを持っています", topic: "Pemilahan Sampah & Gaya Hidup Eco", questions: 40, status: "Siap Ujian" },
    { num: 16, title: "地震が起きたら、どうすればいいですか？", topic: "Mitigasi Bencana & Keselamatan Jiwa", questions: 40, status: "Siap Ujian" },
    { num: 17, title: "日本語が前より話せるようになりました", topic: "Pertumbuhan Diri & Refleksi di Jepang", questions: 40, status: "Siap Ujian" },
    { num: 18, title: "将来、自分の会社を作ろうと思っています", topic: "Impian Masa Depan, Karir & SSW", questions: 40, status: "Siap Ujian" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2D0B16] via-[#1E070F] to-[#120308] text-amber-50 flex flex-col font-sans">
      {/* HEADER LUXURY BURGUNDY */}
      <header className="clay-card border-b border-rose-950/60 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black tracking-wider text-amber-200/80 hover:text-amber-300 transition uppercase">
          <ArrowLeft className="w-4 h-4 text-amber-400" /> Portal Belajar
        </Link>
        <div className="flex items-center gap-2 text-sm sm:text-base font-extrabold tracking-wide text-amber-100">
          <span className="p-1.5 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-md">
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
          </span>
          <span>Simulator Ujian JFT-Basic A2</span>
        </div>
        <div className="w-24 text-right">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400/70 border border-amber-500/20 px-2.5 py-1 rounded-full">
            CBT Real
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 flex-1 flex flex-col gap-8 w-full">
        {/* HERO BANNER CLAY BURGUNDY & GOLD */}
        <div className="clay-card rounded-3xl p-8 sm:p-10 border border-rose-900/50 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-br from-amber-500/10 to-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400/20 to-rose-500/20 border border-amber-400/30 px-3.5 py-1 rounded-full text-amber-300 text-xs font-black tracking-widest uppercase mb-3 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Standar Resmi The Japan Foundation
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 leading-tight">
              Simulasi Ujian JFT-Basic A2 Real CBT
            </h2>
            <p className="text-rose-200/80 text-sm mt-3 leading-relaxed">
              Dilengkapi 4 sub-tes berjenjang: <strong className="text-amber-200">Moji Goi</strong>, <strong className="text-amber-200">Kaiwa Hyougen</strong>, <strong className="text-amber-200">Choukai (Max 2x Audio)</strong>, dan <strong className="text-amber-200">Dokkai</strong> sesuai standar resmi ujian sesungguhnya.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full sm:w-auto">
            <Link
              href="/cbt/0"
              className="clay-btn-gold px-8 py-4 rounded-2xl font-black text-sm tracking-wider uppercase text-center shadow-xl hover:scale-105 transition"
            >
              Mulai Ujian Penuh (Fukushuu 1)
            </Link>
          </div>
        </div>

        {/* CHAPTER LIST */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-black text-amber-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              Pilih Paket Ujian per Bab (初級2)
            </h3>
            <span className="text-xs text-rose-300/70 font-semibold">Total 1.210 Butir Soal Terintegrasi</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((ch) => (
              <div 
                key={ch.num} 
                className="clay-card rounded-2xl p-6 border border-rose-950/80 flex flex-col justify-between gap-6 hover:border-amber-400/40 transition group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-amber-400 bg-amber-950/70 border border-amber-500/30 px-3 py-1 rounded-lg">
                      第{ch.num}課 (Bab 0{ch.num})
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {ch.status}
                    </span>
                  </div>
                  <h4 className="font-black text-amber-100 text-base mt-4 group-hover:text-amber-300 transition">{ch.title}</h4>
                  <p className="text-xs text-rose-200/70 mt-1.5 leading-relaxed">{ch.topic}</p>

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-rose-950/60 text-[11px] font-bold text-amber-200/80">
                    <div className="bg-[#1A050D] p-2 rounded-lg border border-rose-950/40">🔤 Moji: 25 Soal</div>
                    <div className="bg-[#1A050D] p-2 rounded-lg border border-rose-950/40">💬 Kaiwa: 25 Soal</div>
                    <div className="bg-[#1A050D] p-2 rounded-lg border border-rose-950/40">🎧 Choukai: 20 Soal</div>
                    <div className="bg-[#1A050D] p-2 rounded-lg border border-rose-950/40">📖 Dokkai: 20 Soal</div>
                  </div>
                </div>

                <Link
                  href={`/cbt/${ch.num}`}
                  className="clay-btn w-full py-3 rounded-xl font-black text-xs text-amber-200 transition flex items-center justify-center gap-2 group-hover:bg-[#5C162D] group-hover:border-amber-500/40 group-hover:text-amber-100"
                >
                  Mulai Simulasi Bab 0{ch.num} <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
                </Link>
              </div>
            ))}

            {/* FUKUSHUU 1 CARD */}
            <div className="clay-card rounded-2xl p-6 border-2 border-amber-400/50 flex flex-col justify-between gap-6 relative overflow-hidden bg-gradient-to-br from-[#4A1022] to-[#2B0813]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-300 bg-amber-950/90 border border-amber-400/40 px-3 py-1 rounded-lg">
                    Semester 1 Tryout
                  </span>
                  <span className="text-xs font-black text-amber-300 bg-amber-500/20 px-3 py-0.5 rounded-full border border-amber-400/30">
                    90 Soal Campuran
                  </span>
                </div>
                <h4 className="font-black text-amber-100 text-lg mt-4">📦 Fukushuu 1 (Bab 01–06)</h4>
                <p className="text-xs text-rose-200/80 mt-2 leading-relaxed">
                  Paket ujian simulasi lengkap gabungan dari Bab 1 sampai Bab 6 dengan komposisi standar ujian nasional JFT-Basic A2.
                </p>
              </div>
              <Link
                href="/cbt/0"
                className="clay-btn-gold w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-lg hover:scale-105"
              >
                Mulai Ujian Penuh Fukushuu 1 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
