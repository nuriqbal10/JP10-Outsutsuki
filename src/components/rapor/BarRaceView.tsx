"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, FastForward, Award, ChevronRight, ChevronLeft } from "lucide-react";
import { StudentRaporItem } from "@/types/rapor";

interface BarRaceViewProps {
  students: StudentRaporItem[];
}

export default function BarRaceView({ students }: BarRaceViewProps) {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1000); // 1 detik per bab

  // Hitung skor kumulatif siswa sampai bab tertentu
  const getStudentScoreAtChapter = (student: StudentRaporItem, ch: number) => {
    let sum = 0;
    for (let i = 0; i < ch; i++) {
      const h = student.harian[i];
      if (h && h.daiTesuto && h.daiTesuto.total > 0) {
        sum += h.daiTesuto.total;
      }
    }
    return sum;
  };

  // Buat data ranking di bab saat ini (Top 10)
  const currentStandings = students.map((s) => {
    const score = getStudentScoreAtChapter(s, currentChapter);
    return {
      no: s.no,
      name: s.name,
      avatarColor: s.avatarColor || "from-amber-400 to-amber-600",
      score,
    };
  })
  .sort((a, b) => b.score - a.score);

  const topStudents = currentStandings.slice(0, 10);
  const maxScore = Math.max(...topStudents.map((s) => s.score), 100);

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentChapter((prev) => {
          if (prev >= 18) {
            setIsPlaying(false);
            return 18;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed]);

  return (
    <div className="clay-card rounded-3xl p-5 sm:p-8 border border-current/10 space-y-6">
      {/* HEADER BAR RACE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-current/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400">
              Flourish Style Bar Race
            </span>
            <span className="text-xs font-mono font-bold text-amber-500">
              Bab {currentChapter} dari 18
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black mt-1">
            Balapan Akumulasi Skor Siswa (第1課〜第18課)
          </h3>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentChapter((prev) => Math.max(1, prev - 1))}
            className="p-2 rounded-xl border border-current/20 bg-black/5 dark:bg-white/10 hover:scale-105 transition"
            title="Bab Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="clay-btn-gold px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-2 shadow-md hover:scale-105 transition"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Jeda
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> {currentChapter >= 18 ? "Mulai Ulang" : "Putar Balapan"}
              </>
            )}
          </button>

          <button
            onClick={() => setCurrentChapter((prev) => Math.min(18, prev + 1))}
            className="p-2 rounded-xl border border-current/20 bg-black/5 dark:bg-white/10 hover:scale-105 transition"
            title="Bab Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setCurrentChapter(1);
              setIsPlaying(false);
            }}
            className="p-2 rounded-xl border border-current/20 bg-black/5 dark:bg-white/10 hover:scale-105 transition"
            title="Reset ke Bab 1"
          >
            <RotateCcw className="w-4 h-4 opacity-70" />
          </button>
        </div>
      </div>

      {/* SCRUBBER SLIDER */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-bold font-mono opacity-70">
          <span>Bab 1 (Mulai)</span>
          <span className="text-amber-500">Saat Ini: Bab {currentChapter}</span>
          <span>Bab 18 (Selesai)</span>
        </div>
        <input
          type="range"
          min={1}
          max={18}
          value={currentChapter}
          onChange={(e) => setCurrentChapter(parseInt(e.target.value, 10))}
          className="w-full h-2.5 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
      </div>

      {/* RACE BARS */}
      <div className="space-y-2.5 pt-2">
        {topStudents.map((s, idx) => {
          const widthPercent = Math.max(8, (s.score / maxScore) * 100);
          return (
            <div key={s.no} className="flex items-center gap-3 group">
              <span className="w-6 text-xs font-black font-mono text-right opacity-60">
                #{idx + 1}
              </span>

              <div className="flex-1 relative flex items-center h-9">
                <div
                  className="h-full rounded-xl transition-all duration-500 flex items-center justify-between px-3 text-white shadow-sm border border-white/20"
                  style={{
                    width: `${widthPercent}%`,
                    background:
                      idx === 0
                        ? "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)"
                        : idx === 1
                        ? "linear-gradient(90deg, #94a3b8 0%, #64748b 100%)"
                        : idx === 2
                        ? "linear-gradient(90deg, #b45309 0%, #78350f 100%)"
                        : "linear-gradient(90deg, #6366f1 0%, #4338ca 100%)",
                  }}
                >
                  <span className="text-xs font-bold truncate pr-2 drop-shadow-sm">
                    {s.name}
                  </span>
                  <span className="text-xs font-mono font-black drop-shadow-sm shrink-0">
                    {s.score} pt
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
