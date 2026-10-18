"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Flame,
  Award,
  Zap,
  Trophy,
  Play,
  RotateCcw,
  CheckCircle2,
  X,
  Swords,
} from "lucide-react";
import {
  getGamificationState,
  addXp,
  UserGamificationState,
  AVAILABLE_BADGES,
} from "@/lib/gamification";

const KOTOBA_BANK = [
  { ja: "出身 (しゅっしん)", id: "Asal daerah / negara", options: ["Asal daerah / negara", "Pekerjaan", "Hobi", "Sekolah"] },
  { ja: "専門 (せんもん)", id: "Bidang spesialisasi", options: ["Bidang spesialisasi", "Asrama", "Pabrik", "Gaji"] },
  { ja: "安全第一 (あんぜんだいいち)", id: "Utamakan keselamatan K3", options: ["Utamakan keselamatan K3", "Kerja lembur", "Waktu istirahat", "Aturan kebersihan"] },
  { ja: "残業 (ざんぎょう)", id: "Kerja lembur", options: ["Kerja lembur", "Shift malam", "Hari libur", "Tepat waktu"] },
  { ja: "避難所 (ひなんじょ)", id: "Tempat evakuasi darurat", options: ["Tempat evakuasi darurat", "Halte bus", "Rumah sakit", "Kantor polisi"] },
  { ja: "分別 (ぶんべつ)", id: "Pemilahan sampah", options: ["Pemilahan sampah", "Daur ulang", "Penghematan listrik", "Pembakaran sampah"] },
  { ja: "マイバッグ", id: "Tas belanja ramah lingkungan", options: ["Tas belanja ramah lingkungan", "Tas ransel kerja", "Kantong plastik", "Kotak bekal"] },
  { ja: "美容院 (びよういん)", id: "Salon pangkas rambut", options: ["Salon pangkas rambut", "Rumah sakit", "Dry cleaning", "Toko pakaian"] },
  { ja: "展示室 (てんじしつ)", id: "Ruang pameran / museum", options: ["Ruang pameran / museum", "Ruang meeting", "Perpustakaan", "Kantin"] },
  { ja: "前髪 (まえがみ)", id: "Poni rambut", options: ["Poni rambut", "Rambut pendek", "Cat rambut", "Gaya rambut"] },
  { ja: "特定技能 (とくていぎのう)", id: "Pekerja Berketerampilan Spesifik (SSW)", options: ["Pekerja Berketerampilan Spesifik (SSW)", "Pemagang teknis", "Pelajar asing", "Karyawan tetap"] },
  { ja: "地震 (じしん)", id: "Gempa bumi", options: ["Gempa bumi", "Angin topan", "Banjir", "Kebakaran"] },
  { ja: "休館日 (きゅうかんび)", id: "Hari libur tutup fasilitas", options: ["Hari libur tutup fasilitas", "Jam operasional", "Biaya masuk", "Jadwal pameran"] },
  { ja: "粗大ゴミ (そだいごみ)", id: "Sampah ukuran besar / perabot", options: ["Sampah ukuran besar / perabot", "Sampah organik", "Botol plastik", "Kaleng minuman"] },
  { ja: "将来 (しょうらい)", id: "Masa depan / cita-cita", options: ["Masa depan / cita-cita", "Masa lalu", "Pengalaman kerja", "Rencana tahun depan"] },
];

export default function GamificationBanner() {
  const [state, setState] = useState<UserGamificationState | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);

  // Minigame State
  const [activeQuestions, setActiveQuestions] = useState(KOTOBA_BANK.slice(0, 5));
  const [qIndex, setQIndex] = useState(0);
  const [gameScore, setGameScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    setState(getGamificationState());

    const handleUpdate = (e: any) => {
      setState(e.detail);
    };

    window.addEventListener("gamification-updated", handleUpdate);
    return () => window.removeEventListener("gamification-updated", handleUpdate);
  }, []);

  if (!state) return null;

  const handleStartGame = () => {
    const shuffled = [...KOTOBA_BANK].sort(() => 0.5 - Math.random()).slice(0, 5);
    setActiveQuestions(shuffled);
    setQIndex(0);
    setGameScore(0);
    setGameFinished(false);
    setSelectedAns(null);
    setIsCorrect(null);
    setShowGameModal(true);
  };

  const handleAnswer = (chosen: string) => {
    if (selectedAns !== null) return;
    setSelectedAns(chosen);

    const currentQ = activeQuestions[qIndex];
    const correct = chosen === currentQ.id;
    setIsCorrect(correct);

    if (correct) {
      setGameScore((prev) => prev + 1);
    }

    setTimeout(() => {
      if (qIndex + 1 < activeQuestions.length) {
        setQIndex((prev) => prev + 1);
        setSelectedAns(null);
        setIsCorrect(null);
      } else {
        setGameFinished(true);
        // Award XP
        const earnedXp = (gameScore + (correct ? 1 : 0)) * 15;
        if (earnedXp > 0) {
          addXp(earnedXp, "Kotoba Speed Match");
        }
      }
    }, 900);
  };

  return (
    <>
      <div className="clay-card rounded-3xl p-5 sm:p-6 border border-amber-500/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        {/* Glow Background */}
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT: RANK & LEVEL INFO */}
        <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex flex-col items-center justify-center shadow-lg border-2 border-amber-300 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-tighter leading-none opacity-80">LEVEL</span>
            <span className="text-xl font-black leading-none mt-0.5">{state.level}</span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-400/30 px-2.5 py-0.5 rounded-lg">
                {state.rankBadge}
              </span>
              <span className="text-xs font-black text-rose-500 dark:text-rose-400 flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                <Flame className="w-3.5 h-3.5 fill-current animate-bounce" /> {state.dailyStreak} Hari Streak
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black mt-1">
              {state.rankTitle}
            </h3>

            {/* XP PROGRESS BAR */}
            <div className="w-full sm:w-64 mt-2">
              <div className="flex justify-between text-[10px] font-bold opacity-75 mb-1">
                <span>{state.xp} XP</span>
                <span>Target: {state.nextLevelXp} XP</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden p-0.5 border border-current/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-500"
                  style={{ width: `${state.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: BADGES & MINI-GAME TRIGGER */}
        <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto justify-between sm:justify-end">
          {/* BADGES PREVIEW */}
          <div className="flex items-center -space-x-1.5" title="Badge yang sudah kamu buka!">
            {state.badges.map((bId) => {
              const b = AVAILABLE_BADGES.find((x) => x.id === bId);
              if (!b) return null;
              return (
                <span
                  key={bId}
                  className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-sm shadow cursor-pointer hover:scale-125 transition"
                  title={`${b.name} (${b.desc})`}
                >
                  {b.icon}
                </span>
              );
            })}
          </div>

          <button
            onClick={handleStartGame}
            className="clay-btn-gold px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:scale-105 transition"
          >
            <Swords className="w-4 h-4" />
            Kotoba Reflex Game
          </button>
        </div>
      </div>

      {/* MODAL MINIGAME KOTOBA REFLEX */}
      {showGameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="clay-card rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-amber-400/40 relative shadow-2xl flex flex-col gap-6 animate-in zoom-in-95">
            <button
              onClick={() => setShowGameModal(false)}
              className="absolute right-5 top-5 p-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:opacity-100 opacity-60 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!gameFinished ? (
              <>
                <div className="flex items-center justify-between border-b border-current/10 pb-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-500">
                    <Zap className="w-4 h-4 fill-current" /> Kotoba Speed Match • Soal {qIndex + 1}/{activeQuestions.length}
                  </div>
                  <span className="text-xs font-bold font-mono">Skor: {gameScore}</span>
                </div>

                <div className="text-center py-4 bg-black/5 dark:bg-black/30 rounded-2xl border border-current/10">
                  <span className="text-xs font-bold opacity-60 block uppercase">Pilih Terjemahan yang Tepat:</span>
                  <h4 className="text-2xl font-black mt-2 text-amber-500">
                    {activeQuestions[qIndex].ja}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeQuestions[qIndex].options.map((opt, idx) => {
                    let btnClass = "clay-btn p-3.5 rounded-xl text-xs font-bold text-left transition";
                    if (selectedAns) {
                      if (opt === activeQuestions[qIndex].id) {
                        btnClass = "bg-emerald-600 text-white p-3.5 rounded-xl text-xs font-bold text-left shadow-lg scale-[1.02]";
                      } else if (opt === selectedAns) {
                        btnClass = "bg-rose-600 text-white p-3.5 rounded-xl text-xs font-bold text-left";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={selectedAns !== null}
                        onClick={() => handleAnswer(opt)}
                        className={btnClass}
                      >
                        <span className="font-mono text-amber-400 mr-2">{String.fromCharCode(65 + idx)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-6 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-400/50 flex items-center justify-center text-4xl shadow-inner">
                  🎉
                </div>
                <div>
                  <h3 className="text-2xl font-black">Latihan Selesai!</h3>
                  <p className="text-xs opacity-80 mt-1">
                    Kamu berhasil menjawab {gameScore} dari {activeQuestions.length} soal dengan benar!
                  </p>
                  <div className="inline-block mt-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-black uppercase">
                    +{gameScore * 15} XP Ditambahkan ke Akun Anda!
                  </div>
                </div>

                <button
                  onClick={() => setShowGameModal(false)}
                  className="clay-btn-gold px-8 py-3 rounded-xl font-black text-xs uppercase tracking-wider mt-2 shadow-lg hover:scale-105 transition"
                >
                  Tutup & Lanjutkan Belajar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
