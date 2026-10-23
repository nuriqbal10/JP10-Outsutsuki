"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ArrowLeft,
  Flame,
  Clock,
  Shield,
  Eye,
  Award,
} from "lucide-react";
import { sfx } from "@/lib/soundEffects";
import { addXp, recordBattleOutcome, unlockBadge } from "@/lib/gamification";
import { advanceDailyQuest } from "@/lib/dailyQuests";

export interface PictureQuizItem {
  id: string;
  category: "k3_pabrik" | "fasilitas" | "makanan" | "situasi_kerja";
  categoryLabel: string;
  badgeColor: string;
  imageEmoji: string;
  visualSignText: string;
  visualSubtitle?: string;
  bgGradient: string;
  correctAnswer: string;
  furigana: string;
  indonesianMeaning: string;
  explanation: string;
  contextLesson: string;
  options: {
    text: string;
    furigana: string;
    meaning: string;
  }[];
}

export const PICTURE_QUIZ_DATA: PictureQuizItem[] = [
  {
    id: "sign_1",
    category: "k3_pabrik",
    categoryLabel: "K3 & Rambu Pabrik",
    badgeColor: "bg-emerald-500 text-stone-950",
    imageEmoji: "🟢",
    visualSignText: "安全第一",
    visualSubtitle: "SAFETY FIRST • ZERO ACCIDENT",
    bgGradient: "from-emerald-950 via-slate-900 to-slate-950 border-emerald-500",
    correctAnswer: "安全第一",
    furigana: "あんぜんだいいち",
    indonesianMeaning: "Utamakan Keselamatan Kerja",
    explanation: "Slogan K3 paling penting di seluruh pabrik dan proyek konstruksi Jepang, menekankan bahwa keselamatan pekerja adalah prioritas utama di atas kecepatan produksi.",
    contextLesson: "Irodori A2.2 Bab 10: Pabrik & Keselamatan Kerja",
    options: [
      { text: "安全第一", furigana: "あんぜんだいいち", meaning: "Utamakan Keselamatan Kerja" },
      { text: "火気厳禁", furigana: "かきげんきん", meaning: "Dilarang Menyalakan Api" },
      { text: "立入禁止", furigana: "たちいりきんし", meaning: "Dilarang Masuk" },
      { text: "品質第一", furigana: "ひんしつだいいち", meaning: "Utamakan Kualitas Mutu" },
    ],
  },
  {
    id: "sign_2",
    category: "fasilitas",
    categoryLabel: "Darurat & Fasilitas",
    badgeColor: "bg-green-400 text-stone-950",
    imageEmoji: "🚪🏃",
    visualSignText: "非常口",
    visualSubtitle: "EMERGENCY EXIT • 非常出口",
    bgGradient: "from-green-950 via-slate-900 to-slate-950 border-green-500",
    correctAnswer: "非常口",
    furigana: "ひじょうぐち",
    indonesianMeaning: "Pintu Darurat Keluar",
    explanation: "Rambu hijau bergambar orang berlari menuju pintu menandakan jalur evakuasi keselamatan keluar gedung jika terjadi gempa bumi atau kebakaran.",
    contextLesson: "Irodori A2.2 Bab 17: Bencana Alam & Evakuasi",
    options: [
      { text: "非常ボタン", furigana: "ひじょうボタン", meaning: "Tombol Darurat" },
      { text: "非常口", furigana: "ひじょうぐち", meaning: "Pintu Darurat Keluar" },
      { text: "避難場所", furigana: "ひなんばしょ", meaning: "Lokasi Tempat Pengungsian" },
      { text: "案内所", furigana: "あんないじょ", meaning: "Pusat Informasi Gedung" },
    ],
  },
  {
    id: "sign_3",
    category: "k3_pabrik",
    categoryLabel: "K3 & Rambu Pabrik",
    badgeColor: "bg-red-500 text-white",
    imageEmoji: "🔥🚫",
    visualSignText: "火気厳禁",
    visualSubtitle: "FLAMMABLE • NO OPEN FLAMES",
    bgGradient: "from-red-950 via-slate-900 to-slate-950 border-red-500",
    correctAnswer: "火気厳禁",
    furigana: "かきげんきん",
    indonesianMeaning: "Dilarang Menyalakan Api",
    explanation: "Peringatan keras di area penyimpanan bahan kimia, gas, bensin, atau cat agar tidak ada percikan korek api atau rokok.",
    contextLesson: "Irodori A2.2 Bab 10: Rambu Peringatan Kerja",
    options: [
      { text: "禁煙", furigana: "きんえん", meaning: "Dilarang Merokok" },
      { text: "火気厳禁", furigana: "かきげんきん", meaning: "Dilarang Menyalakan Api" },
      { text: "消火器", furigana: "しょうかき", meaning: "Tabung Pemadam Api" },
      { text: "取扱注意", furigana: "とりあつかいちゅうい", meaning: "Tangani Dengan Hati-Hati" },
    ],
  },
  {
    id: "sign_4",
    category: "k3_pabrik",
    categoryLabel: "K3 & Rambu Pabrik",
    badgeColor: "bg-amber-400 text-stone-950",
    imageEmoji: "⛑️",
    visualSignText: "ヘルメット着用",
    visualSubtitle: "WEAR HARD HAT AT ALL TIMES",
    bgGradient: "from-amber-950 via-slate-900 to-slate-950 border-amber-500",
    correctAnswer: "ヘルメット着用",
    furigana: "ヘルメットちゃくよう",
    indonesianMeaning: "Wajib Mengenakan Helm Pengaman",
    explanation: "Pemberitahuan APD (Alat Pelindung Diri) wajib memasang helm keselamatan sebelum memasuki area lini mesin bergerak atau konstruksi.",
    contextLesson: "Irodori A2.2 Bab 10: Perlengkapan Keselamatan",
    options: [
      { text: "ヘルメット着用", furigana: "ヘルメットちゃくよう", meaning: "Wajib Mengenakan Helm Pengaman" },
      { text: "安全靴着用", furigana: "あんぜんぐつちゃくよう", meaning: "Wajib Memakai Sepatu Safety" },
      { text: "マスク着用", furigana: "マスクちゃくよう", meaning: "Wajib Memakai Masker" },
      { text: "手袋禁止", furigana: "てぶくろきんし", meaning: "Dilarang Memakai Sarung Tangan" },
    ],
  },
  {
    id: "sign_5",
    category: "k3_pabrik",
    categoryLabel: "K3 & Rambu Pabrik",
    badgeColor: "bg-rose-500 text-white",
    imageEmoji: "⛔",
    visualSignText: "立入禁止",
    visualSubtitle: "DO NOT ENTER • AUTHORIZED ONLY",
    bgGradient: "from-rose-950 via-slate-900 to-slate-950 border-rose-500",
    correctAnswer: "立入禁止",
    furigana: "たちいりきんし",
    indonesianMeaning: "Dilarang Masuk (Area Terbatas)",
    explanation: "Rambu tegas melarang orang yang tidak berkepentingan masuk ke ruangan instalasi tegangan tinggi atau area bahaya.",
    contextLesson: "Irodori A2.2 Bab 10: Larangan & Peringatan",
    options: [
      { text: "駐車禁止", furigana: "ちゅうしゃきんし", meaning: "Dilarang Parkir" },
      { text: "立入禁止", furigana: "たちいりきんし", meaning: "Dilarang Masuk (Area Terbatas)" },
      { text: "通り抜け禁止", furigana: "とおりぬけきんし", meaning: "Dilarang Melintas Masuk" },
      { text: "飲食禁止", furigana: "いんしょくきんし", meaning: "Dilarang Makan & Minum" },
    ],
  },
  {
    id: "sign_6",
    category: "fasilitas",
    categoryLabel: "Fasilitas Kerja & Kantor",
    badgeColor: "bg-cyan-400 text-stone-950",
    imageEmoji: "☕🚰",
    visualSignText: "給湯室",
    visualSubtitle: "PANTRY & TEA ROOM • きゅうとうしつ",
    bgGradient: "from-cyan-950 via-slate-900 to-slate-950 border-cyan-500",
    correctAnswer: "給湯室",
    furigana: "きゅうとうしつ",
    indonesianMeaning: "Ruang Pantri / Tempat Seduh Air Panas",
    explanation: "Ruangan kecil di kantor Jepang yang menyediakan dispenser air panas, wastafel, cangkir, dan teh untuk melayani tamu atau karyawan saat istirahat.",
    contextLesson: "Irodori A1 Bab 8 & A2.1 Bab 8: Denah Kantor",
    options: [
      { text: "事務室", furigana: "じむしつ", meaning: "Ruang Tata Usaha / Kantor" },
      { text: "給湯室", furigana: "きゅうとうしつ", meaning: "Ruang Pantri / Tempat Air Panas" },
      { text: "更衣室", furigana: "こういしつ", meaning: "Ruang Ganti Pakaian" },
      { text: "喫煙所", furigana: "きつえんじょ", meaning: "Area Khusus Merokok" },
    ],
  },
  {
    id: "sign_7",
    category: "makanan",
    categoryLabel: "Kuliner & Restoran Jepang",
    badgeColor: "bg-orange-400 text-stone-950",
    imageEmoji: "🍱🍚🥣",
    visualSignText: "定食",
    visualSubtitle: "TEISHOKU • SET MENU MEAL",
    bgGradient: "from-orange-950 via-slate-900 to-slate-950 border-orange-500",
    correctAnswer: "定食",
    furigana: "ていしょく",
    indonesianMeaning: "Menu Set Lengkap (Nasi, Lauk, Sup)",
    explanation: "Paket hidangan tradisional khas restoran Jepang yang terdiri dari seporsi nasi, sup miso (miso shiru), hidangan utama (ikan/daging), dan acar sayuran.",
    contextLesson: "Irodori A2.2 Bab 5: Pemesanan Makanan",
    options: [
      { text: "単品", furigana: "たんぴん", meaning: "Menu Satuan (A La Carte)" },
      { text: "定食", furigana: "ていしょく", meaning: "Menu Set Lengkap (Nasi, Lauk, Sup)" },
      { text: "盛り合わせ", furigana: "もりあわせ", meaning: "Kombinasi Piring Campur" },
      { text: "居酒屋", furigana: "いざかや", meaning: "Kedai Minum Santai" },
    ],
  },
  {
    id: "sign_8",
    category: "situasi_kerja",
    categoryLabel: "Budaya Kerja Jepang",
    badgeColor: "bg-blue-400 text-stone-950",
    imageEmoji: "🌅📋",
    visualSignText: "朝礼",
    visualSubtitle: "MORNING ASSEMBLY • ちょうれい",
    bgGradient: "from-blue-950 via-slate-900 to-slate-950 border-blue-500",
    correctAnswer: "朝礼",
    furigana: "ちょうれい",
    indonesianMeaning: "Apel Pagi / Pertemuan Briefing Harian",
    explanation: "Pertemuan singkat 5-10 menit sebelum jam kerja dimulai, di mana supervisor mengumumkan target harian, jadwal, dan memeriksa kondisi kesehatan pekerja.",
    contextLesson: "Irodori A2.2 Bab 9: Rutinitas Kantor & Pabrik",
    options: [
      { text: "昼休み", furigana: "ひるやすみ", meaning: "Istirahat Jam Makan Siang" },
      { text: "朝礼", furigana: "ちょうれい", meaning: "Apel Pagi / Briefing Harian" },
      { text: "残業", furigana: "ざんぎょう", meaning: "Kerja Lembur Malam" },
      { text: "打ち合わせ", furigana: "うちあわせ", meaning: "Rapat Koordinasi Singkat" },
    ],
  },
  {
    id: "sign_9",
    category: "k3_pabrik",
    categoryLabel: "K3 & Rambu Pabrik",
    badgeColor: "bg-yellow-400 text-stone-950",
    imageEmoji: "⚠️👟",
    visualSignText: "足元注意",
    visualSubtitle: "WATCH YOUR STEP • CAUTION",
    bgGradient: "from-yellow-950 via-slate-900 to-slate-950 border-yellow-500",
    correctAnswer: "足元注意",
    furigana: "あしもとちゅうい",
    indonesianMeaning: "Hati-hati Melangkah / Lantai Licin",
    explanation: "Peringatan di lantai gudang atau dekat mesin di mana terdapat kabel, pipa melintang, atau cairan yang dapat menyebabkan terpeleset.",
    contextLesson: "Irodori A2.2 Bab 10: Rambu Lantai Kerja",
    options: [
      { text: "頭上注意", furigana: "ずじょうちゅうい", meaning: "Hati-hati Kepala Terbentur" },
      { text: "足元注意", furigana: "あしもとちゅうい", meaning: "Hati-hati Melangkah / Lantai Licin" },
      { text: "指差し確認", furigana: "ゆびさしかくにん", meaning: "Prosedur Tunjuk & Sebut (Point & Call)" },
      { text: "感電注意", furigana: "かんでんちゅうい", meaning: "Bahaya Tegangan Listrik" },
    ],
  },
  {
    id: "sign_10",
    category: "fasilitas",
    categoryLabel: "Pemilahan Lingkungan",
    badgeColor: "bg-teal-400 text-stone-950",
    imageEmoji: "♻️🗑️",
    visualSignText: "ゴミ分別",
    visualSubtitle: "WASTE SEPARATION • もえるゴミ / カン・ビン",
    bgGradient: "from-teal-950 via-slate-900 to-slate-950 border-teal-500",
    correctAnswer: "ゴミ分別",
    furigana: "ゴミぶんべつ",
    indonesianMeaning: "Pemilahan Sampah Organik & Daur Ulang",
    explanation: "Aturan ketat di Jepang untuk memilah sampah menjadi: sampah mudah terbakar (燃えるゴミ), sampah tidak terbakar (燃えないゴミ), kaleng & botol (カン・ビン), dan botol plastik PET (ペットボトル).",
    contextLesson: "Irodori A2.2 Bab 12: Tata Tertib Asrama & Pabrik",
    options: [
      { text: "整理整頓", furigana: "せいりせいとん", meaning: "5S: Kerapian & Penataan Barang" },
      { text: "ゴミ分別", furigana: "ゴミぶんべつ", meaning: "Pemilahan Sampah Organik & Daur Ulang" },
      { text: "清掃中", furigana: "せいそうちゅう", meaning: "Sedang Dalam Proses Pembersihan" },
      { text: "回収日", furigana: "かいしゅうび", meaning: "Jadwal Hari Pengangkutan Sampah" },
    ],
  },
];

export default function GuessPictureGame({ onBack }: { onBack: () => void }) {
  const [questions, setQuestions] = useState<PictureQuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [gameState, setGameState] = useState<"lobby" | "playing" | "result">("lobby");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and shuffle questions
  const startGame = () => {
    const shuffled = [...PICTURE_QUIZ_DATA].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setHighestCombo(0);
    setSelectedOption(null);
    setTimeLeft(15);
    setGameState("playing");
    sfx.playSlash();
  };

  const speakJapanese = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  // Timer per question (15 seconds)
  useEffect(() => {
    if (gameState !== "playing" || selectedOption !== null) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 15;
        }
        if (prev <= 4 && !isMuted) {
          sfx.playCountdownHurry();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, selectedOption, currentIndex]);

  const handleTimeout = () => {
    sfx.playWrong();
    setSelectedOption("__TIMEOUT__");
    setCombo(0);
    setTimeout(() => nextQuestion(), 2200);
  };

  const handleAnswer = (optionText: string) => {
    if (selectedOption !== null) return;
    const currentQ = questions[currentIndex];
    setSelectedOption(optionText);

    const isCorrect = optionText === currentQ.correctAnswer;
    if (isCorrect) {
      sfx.playCorrect();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (nextCombo > highestCombo) setHighestCombo(nextCombo);

      const added = 500 + timeLeft * 30 + nextCombo * 100;
      setScore((s) => s + added);
      speakJapanese(currentQ.correctAnswer);
    } else {
      sfx.playWrong();
      setCombo(0);
    }

    setTimeout(() => nextQuestion(), 2400);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(15);
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setGameState("result");
    sfx.playVictory();
    const earnedXp = Math.round(score / 20) + 100;
    addXp(earnedXp, "Tebak Gambar Otentik Irodori (写真・標識クイズ)");
    advanceDailyQuest("quiz");
    recordBattleOutcome(true, "guess_picture", { dokkai: 5, mojiGoi: 4 });
    unlockBadge("picture_detective");
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 select-none font-sans">
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-[#110724] via-[#1a0a38] to-[#0d051c] border-2 border-emerald-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-white transition"
              title="Kembali ke Hub"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 p-0.5 shadow-xl flex items-center justify-center text-2xl">
              🔍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-emerald-300 tracking-tight">
                  TEBAK GAMBAR & RAMBU IRODORI
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-emerald-400 text-stone-950">
                  Visual K3 & Dokkai
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-0.5 font-medium">
                Kuis rambu keselamatan kerja pabrik, fasilitas umum, dan kuliner otentik Jepang.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const muted = sfx.toggleMute();
                setIsMuted(muted);
              }}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* LOBBY STATE */}
      {gameState === "lobby" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-emerald-950/60 border-2 border-emerald-500/60 flex items-center justify-center text-5xl shadow-xl shadow-emerald-500/20">
            🚸
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-black text-white">Tantangan Detektif Rambu Jepang</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Uji ketajaman Anda memahami rambu K3 pabrik Jepang (安全第一, 火気厳禁, 立入禁止), fasilitas kantor (給湯室, 非常口), dan istilah kuliner sehari-hari sesuai kurikulum resmi Irodori A2.2.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="font-black text-emerald-400 mb-1">⏱️ 15 Detik / Soal</div>
              <div className="text-slate-400">Kecepatan membaca rambu visual sangat penting dalam situasi darurat kerja.</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="font-black text-amber-400 mb-1">🔥 Combo Multiplier</div>
              <div className="text-slate-400">Jawab berturut-turut tanpa salah untuk melipatgandakan perolehan skor XP.</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="font-black text-cyan-400 mb-1">💡 Penjelasan Lengkap</div>
              <div className="text-slate-400">Dilengkapi konteks penggunaan di dunia kerja Jepang dan pelafalan audio asli.</div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full max-w-md py-4 rounded-2xl font-black text-stone-950 text-base bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 hover:scale-105 active:scale-95 transition shadow-[0_0_30px_rgba(52,211,153,0.5)]"
          >
            MULAI TEBAK GAMBAR (10 SOAL OTENTIK)
          </button>
        </div>
      )}

      {/* PLAYING STATE */}
      {gameState === "playing" && currentQ && (
        <div className="space-y-5">
          {/* TOP HUD: QUESTION COUNT, TIMER, SCORE */}
          <div className="grid grid-cols-3 gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Soal:</span>
              <span className="text-sm font-black text-white font-mono">{currentIndex + 1} / {questions.length}</span>
            </div>
            <div className="text-center">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black font-mono ${
                timeLeft <= 4 ? "bg-red-500/20 text-red-400 border border-red-500 animate-ping" : "bg-emerald-500/20 text-emerald-400"
              }`}>
                <Clock className="w-3.5 h-3.5" /> {timeLeft}s
              </span>
            </div>
            <div className="text-right flex items-center justify-end gap-2">
              {combo > 1 && (
                <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg animate-bounce">
                  🔥 {combo}x
                </span>
              )}
              <span className="text-sm font-black text-amber-300 font-mono">{score} PTS</span>
            </div>
          </div>

          {/* VISUAL SIGN EMBLEM DISPLAY CARD */}
          <div className={`p-8 rounded-3xl border-2 ${currentQ.bgGradient} shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[220px]`}>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-3 shadow ${currentQ.badgeColor}`}>
              {currentQ.categoryLabel}
            </span>

            <div className="text-6xl mb-3 drop-shadow-lg">{currentQ.imageEmoji}</div>

            <h3 className="text-3xl md:text-5xl font-black text-white tracking-widest font-japanese drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              {currentQ.visualSignText}
            </h3>

            {currentQ.visualSubtitle && (
              <p className="text-xs md:text-sm font-mono tracking-widest text-slate-300 uppercase mt-2 font-black opacity-80">
                {currentQ.visualSubtitle}
              </p>
            )}

            <button
              onClick={() => speakJapanese(currentQ.correctAnswer)}
              className="mt-3 p-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/20 text-slate-200 transition flex items-center gap-1.5 text-xs font-bold"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Dengarkan Pelafalan</span>
            </button>
          </div>

          {/* 4 MULTIPLE CHOICE OPTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOption === opt.text;
              const isCorrect = opt.text === currentQ.correctAnswer;
              let btnStyle = "bg-slate-900 border-slate-800 text-slate-200 hover:border-purple-500 hover:bg-slate-850";

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20";
                } else if (isSelected) {
                  btnStyle = "bg-rose-950/80 border-rose-500 text-rose-200 shadow-lg shadow-rose-500/20";
                } else {
                  btnStyle = "opacity-40 bg-slate-950 border-slate-900 text-slate-500";
                }
              }

              return (
                <button
                  key={i}
                  disabled={selectedOption !== null}
                  onClick={() => handleAnswer(opt.text)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${btnStyle}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono opacity-60 text-amber-400">Pilihan #{i + 1}</span>
                    {selectedOption !== null && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <div className="font-japanese font-black text-lg md:text-xl text-white mt-1">
                    {opt.text}
                  </div>
                  <div className="text-[11px] text-purple-300 font-mono mt-0.5">
                    {opt.furigana}
                  </div>
                  <div className="text-xs text-slate-300 font-bold mt-2 pt-2 border-t border-white/10">
                    {opt.meaning}
                  </div>
                </button>
              );
            })}
          </div>

          {/* EXPLANATION ACCORDION (SHOWN AFTER ANSWERING) */}
          {selectedOption !== null && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>Pembahasan Situasi & Budaya Kerja:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQ.explanation}
              </p>
              <div className="text-[11px] text-purple-300 font-medium">
                📚 <strong>Referensi:</strong> {currentQ.contextLesson}
              </div>
            </div>
          )}
        </div>
      )}

      {/* RESULT SCREEN */}
      {gameState === "result" && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-5xl shadow-xl shadow-amber-500/20 animate-bounce">
            🏆
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-black text-white">Tebak Gambar Selesai!</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Penguasaan rambu visual dan kosakata kerja Anda telah dicatat ke rapor shinobi.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">Total Skor</div>
              <div className="text-xl font-black text-amber-400 font-mono">{score} PTS</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-xs text-slate-400">Combo Tertinggi</div>
              <div className="text-xl font-black text-emerald-400 font-mono">{highestCombo}x</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-400">Bonus XP</div>
              <div className="text-xl font-black text-purple-400 font-mono">+{Math.round(score / 20) + 100} XP</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={startGame}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-stone-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition"
            >
              <RotateCcw className="w-4 h-4" /> Main Lagi
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider transition"
            >
              Kembali ke Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
