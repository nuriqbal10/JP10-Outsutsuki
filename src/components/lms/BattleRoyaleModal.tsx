"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Swords,
  Users,
  Crown,
  Shield,
  Zap,
  Flame,
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Trophy,
  Heart,
  Skull,
  Radio,
  Clock,
  ArrowRight,
  ShieldAlert,
  Mail,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { addXp } from "@/lib/gamification";
import { advanceDailyQuest } from "@/lib/dailyQuests";
import { sfx } from "@/lib/soundEffects";

export type BattleMode = "1vs1" | "group" | "all_members";

interface Participant {
  email: string;
  name: string;
  avatar: string;
  joinedAt: number;
  score: number;
  hp: number;
  isReady: boolean;
}

interface RoomData {
  id: string;
  mode: BattleMode;
  requiredCount: number;
  status: "waiting" | "countdown" | "in_battle" | "finished";
  countdownSeconds: number;
  participants: Participant[];
}

interface EnrolledMember {
  name: string;
  email: string;
  avatar: string;
}

interface BattleQuestion {
  ja: string;
  romaji?: string;
  correct: string;
  options: string[];
}

const BATTLE_QUESTIONS: BattleQuestion[] = [
  { ja: "残業 (ざんぎょう)", romaji: "zangyou", correct: "Kerja lembur", options: ["Kerja lembur", "Shift malam", "Cuti tahunan", "Tepat waktu"] },
  { ja: "避難所 (ひなんじょ)", romaji: "hinanjo", correct: "Tempat evakuasi darurat", options: ["Tempat evakuasi darurat", "Halte bus", "Rumah sakit", "Kantor polisi"] },
  { ja: "分別 (ぶんべつ)", romaji: "bunbetsu", correct: "Pemilahan jenis sampah", options: ["Pemilahan jenis sampah", "Daur ulang", "Penghematan listrik", "Pembakaran sampah"] },
  { ja: "安全第一 (あんぜんだいいち)", romaji: "anzen daiichi", correct: "Utamakan keselamatan K3", options: ["Utamakan keselamatan K3", "Kerja cepat", "Waktu santai", "Aturan pakaian"] },
  { ja: "特定技能 (とくていぎのう)", romaji: "tokutei ginou", correct: "Pekerja Berketerampilan Spesifik (SSW)", options: ["Pekerja Berketerampilan Spesifik (SSW)", "Pelajar asing", "Turis", "Magang teknis"] },
  { ja: "体調 (たいちょう)", romaji: "taichou", correct: "Kondisi fisik kesehatan", options: ["Kondisi fisik kesehatan", "Suhu ruangan", "Berat barang", "Jadwal meeting"] },
  { ja: "締切 (しめきり)", romaji: "shimekiri", correct: "Batas waktu / deadline", options: ["Batas waktu / deadline", "Awal pembukaan", "Libur kerja", "Gaji bulanan"] },
  { ja: "粗大ゴミ (そだいごみ)", romaji: "sodaigomi", correct: "Sampah perabot / ukuran besar", options: ["Sampah perabot / ukuran besar", "Sampah dapur", "Botol plastik", "Kaleng minuman"] },
  { ja: "美容院 (びよういん)", romaji: "biyouin", correct: "Salon pangkas rambut", options: ["Salon pangkas rambut", "Rumah sakit", "Dry cleaning", "Toko pakaian"] },
  { ja: "点検 (てんけん)", romaji: "tenken", correct: "Pemeriksaan / inspeksi rutin", options: ["Pemeriksaan / inspeksi rutin", "Perbaikan mesin", "Pembersihan lantai", "Penggantian ban"] },
];

export default function BattleRoyaleModal({
  isOpen,
  onClose,
  initialMode = "1vs1",
}: {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: BattleMode;
}) {
  const [mode, setMode] = useState<BattleMode>(initialMode);
  const [room, setRoom] = useState<RoomData | null>(null);
  const [enrolledMembers, setEnrolledMembers] = useState<EnrolledMember[]>([]);

  // User Identity from Email
  const [myEmail, setMyEmail] = useState<string>("");
  const [myName, setMyName] = useState<string>("");
  const [isJoined, setIsJoined] = useState(false);
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Battle State
  const [battleState, setBattleState] = useState<"lobby" | "countdown" | "in_battle" | "victory" | "defeat">("lobby");
  const [countdownNum, setCountdownNum] = useState(5);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<BattleQuestion[]>([]);
  const [timeLeft, setTimeLeft] = useState(8);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [activeCombatants, setActiveCombatants] = useState<Participant[]>([]);

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved member email from storage if available
  useEffect(() => {
    const savedEmail = localStorage.getItem("irodori_user_email") || "";
    const savedName = localStorage.getItem("irodori_user_name") || "";
    if (savedEmail) setMyEmail(savedEmail);
    if (savedName) setMyName(savedName);
  }, []);

  // Poll Lobby Status from /api/battle-lobby
  const fetchLobbyStatus = async (targetMode: BattleMode) => {
    try {
      const res = await fetch(`/api/battle-lobby?mode=${targetMode}&email=${encodeURIComponent(myEmail)}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success) {
        setRoom(data.room);
        if (data.enrolledMembers && enrolledMembers.length === 0) {
          setEnrolledMembers(data.enrolledMembers);
        }

        // If room is filled and countdown begins
        if (data.room.status === "countdown" && battleState === "lobby" && isJoined) {
          triggerLobbyCountdown(data.room);
        }
      }
    } catch (e) {
      console.error("Lobby fetch error:", e);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      return;
    }

    fetchLobbyStatus(mode);
    pollIntervalRef.current = setInterval(() => {
      if (battleState === "lobby") {
        fetchLobbyStatus(mode);
      }
    }, 2000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isOpen, mode, battleState, myEmail, isJoined]);

  // Handle Mode Switch
  const handleSelectMode = (newMode: BattleMode) => {
    setMode(newMode);
    setBattleState("lobby");
    setIsJoined(false);
    fetchLobbyStatus(newMode);
  };

  // Join Lobby with Enrolled Email
  const handleJoinLobby = async (emailToJoin: string, nameToJoin?: string) => {
    if (!emailToJoin.trim()) {
      setJoinError("Pilih atau masukkan email member terdaftar Anda.");
      return;
    }

    setLoadingJoin(true);
    setJoinError(null);

    const resolvedName = nameToJoin || myName || emailToJoin.split("@")[0].toUpperCase();

    try {
      const res = await fetch("/api/battle-lobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "join",
          mode,
          email: emailToJoin.trim().toLowerCase(),
          name: resolvedName,
          avatar: "🥷",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setJoinError(data.error || "Gagal bergabung ke lobi.");
        setLoadingJoin(false);
        return;
      }

      setRoom(data.room);
      setIsJoined(true);
      setMyEmail(emailToJoin.trim().toLowerCase());
      setMyName(resolvedName);
      localStorage.setItem("irodori_user_email", emailToJoin.trim().toLowerCase());
      localStorage.setItem("irodori_user_name", resolvedName);
      sfx.playCorrect();

      // Check if this join fulfills the quota
      if (data.room.participants.length >= data.room.requiredCount) {
        triggerLobbyCountdown(data.room);
      }
    } catch (e: any) {
      setJoinError("Koneksi gagal. Coba lagi.");
    } finally {
      setLoadingJoin(false);
    }
  };

  const handleLeaveLobby = async () => {
    try {
      await fetch("/api/battle-lobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "leave", mode, email: myEmail }),
      });
      setIsJoined(false);
      fetchLobbyStatus(mode);
    } catch (e) {}
  };

  // Countdown when Kuota Terpenuhi
  const triggerLobbyCountdown = (currentRoom: RoomData) => {
    setBattleState("countdown");
    setCountdownNum(5);
    setActiveCombatants(currentRoom.participants.map((p) => ({ ...p, hp: 100, score: 0 })));

    let counter = 5;
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    countdownTimerRef.current = setInterval(() => {
      counter -= 1;
      setCountdownNum(counter);
      sfx.playTick();

      if (counter <= 0) {
        clearInterval(countdownTimerRef.current!);
        startMatch(currentRoom.participants);
      }
    }, 1000);
  };

  const startMatch = (participants: Participant[]) => {
    const questions = [...BATTLE_QUESTIONS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .map((q) => ({
        ...q,
        options: [...q.options].sort(() => 0.5 - Math.random()),
      }));

    setShuffledQuestions(questions);
    setCurrentQIndex(0);
    setTimeLeft(8);
    setSelectedAnswer(null);
    setBattleLog([`🔥 KUOTA TERPENUHI! ${participants.length} Member Resmi Bertanding!`]);
    setBattleState("in_battle");
    sfx.playBlast();
  };

  // Turn Timer Loop in Battle
  useEffect(() => {
    if (battleState !== "in_battle" || selectedAnswer !== null) {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
      return;
    }

    questionTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleUserAnswer("__TIMEOUT__");
          return 0;
        }
        if (prev <= 3) {
          sfx.playCountdownHurry();
        } else {
          sfx.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, [battleState, currentQIndex, selectedAnswer]);

  const handleUserAnswer = (chosen: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(chosen);

    const q = shuffledQuestions[currentQIndex];
    const isCorrect = chosen === q.correct;

    if (isCorrect) {
      sfx.playSlash();
    } else {
      sfx.playWrong();
    }

    setTimeout(() => {
      resolveTurn(isCorrect, chosen);
    }, 800);
  };

  const resolveTurn = (isCorrect: boolean, chosen: string) => {
    const newLogs: string[] = [];

    setActiveCombatants((prev) => {
      return prev.map((c) => {
        const isMe = c.email === myEmail;
        let hp = c.hp;
        let score = c.score;

        if (isMe) {
          if (isCorrect) {
            score += 20;
            newLogs.push(`⚔️ Anda menjawab BENAR! Serangan Taijutsu menghantam lawan!`);
          } else {
            hp = Math.max(0, hp - (chosen === "__TIMEOUT__" ? 30 : 25));
            newLogs.push(`💥 Anda ${chosen === "__TIMEOUT__" ? "KEHABISAN WAKTU" : "SALAH JAWAB"}! Menerima -25 HP.`);
          }
        } else {
          // Live rival simulated reaction based on difficulty
          const rivalCorrect = Math.random() < 0.6;
          if (rivalCorrect) {
            score += 20;
          } else {
            hp = Math.max(0, hp - 35);
            if (hp === 0) {
              sfx.playEliminated();
              newLogs.push(`💀 [${c.name}] Tereliminasi dari arena!`);
            }
          }
        }

        return { ...c, hp, score };
      });
    });

    setBattleLog((prev) => [...newLogs, ...prev].slice(0, 6));

    setTimeout(() => {
      checkBattleOver();
    }, 1200);
  };

  const checkBattleOver = () => {
    const me = activeCombatants.find((c) => c.email === myEmail);
    const others = activeCombatants.filter((c) => c.email !== myEmail);
    const othersAlive = others.filter((c) => c.hp > 0).length;

    if (me && me.hp <= 0) {
      setBattleState("defeat");
      sfx.playEliminated();
      return;
    }

    if (othersAlive === 0 || currentQIndex + 1 >= shuffledQuestions.length) {
      const myScore = me?.score || 0;
      const highestOther = Math.max(...others.map((o) => o.score), 0);

      if (myScore >= highestOther && me && me.hp > 0) {
        setBattleState("victory");
        sfx.playVictory();
        const earnedXp = mode === "all_members" ? 150 : mode === "group" ? 120 : 90;
        addXp(earnedXp, `Battle Royale Member (${mode})`);
        advanceDailyQuest("battle", 1);
      } else {
        setBattleState("defeat");
        sfx.playEliminated();
      }
      return;
    }

    setCurrentQIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setTimeLeft(8);
  };

  if (!isOpen) return null;

  const currentQ = shuffledQuestions[currentQIndex];
  const requiredQuota = mode === "1vs1" ? 2 : mode === "group" ? 4 : 6;
  const currentParticipants = room?.participants || [];
  const slotsLeft = Math.max(0, requiredQuota - currentParticipants.length);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5">
      <div className="clay-card rounded-3xl p-5 sm:p-8 max-w-2xl w-full border border-rose-500/40 relative shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto custom-scrollbar">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:opacity-100 opacity-60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= STEP 1: LOBBY & KUOTA ANGGOTA ================= */}
        {battleState === "lobby" && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 border-b border-current/10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shrink-0">
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black">Lobi Battle Royale Member</h2>
                  <span className="text-[10px] font-black uppercase bg-rose-500/10 text-rose-500 border border-rose-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" /> Real Member
                  </span>
                </div>
                <p className="text-xs opacity-75 mt-0.5">
                  Khusus member terdaftar di database email. Pertandingan otomatis dimulai saat kuota terpenuhi!
                </p>
              </div>
            </div>

            {/* MODE SELECTION TABS */}
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-black/10 dark:bg-white/5 border border-current/10">
              <button
                onClick={() => handleSelectMode("1vs1")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  mode === "1vs1" ? "bg-rose-500 text-white shadow-md" : "hover:bg-black/5 opacity-70"
                }`}
              >
                <span>⚔️</span> Duel 1 vs 1 (2 Kuota)
              </button>
              <button
                onClick={() => handleSelectMode("group")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  mode === "group" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-black/5 opacity-70"
                }`}
              >
                <span>🛡️</span> Tim 2 vs 2 (4 Kuota)
              </button>
              <button
                onClick={() => handleSelectMode("all_members")}
                className={`py-2 px-3 rounded-xl text-xs font-black transition flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  mode === "all_members" ? "bg-amber-500 text-stone-950 shadow-md" : "hover:bg-black/5 opacity-70"
                }`}
              >
                <span>👑</span> Survival (6 Kuota)
              </button>
            </div>

            {/* MEMBER IDENTITY BAR (SELECT OR ENTER ENROLLED EMAIL) */}
            {!isJoined ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-black text-amber-500 uppercase">
                  <Mail className="w-4 h-4" /> Masuk Sebagai Member Terdaftar
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <select
                      value={myEmail}
                      onChange={(e) => {
                        const sel = enrolledMembers.find((m) => m.email === e.target.value);
                        setMyEmail(e.target.value);
                        if (sel) setMyName(sel.name);
                      }}
                      className="w-full p-2.5 rounded-xl border border-current/20 bg-white dark:bg-stone-900 text-xs font-bold font-sans"
                    >
                      <option value="">-- Pilih Nama Siswa Terdaftar (Kelas A2.2) --</option>
                      {enrolledMembers.map((m, idx) => (
                        <option key={idx} value={m.email}>
                          {m.name} ({m.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    disabled={loadingJoin || !myEmail}
                    onClick={() => handleJoinLobby(myEmail, myName)}
                    className="clay-btn-gold px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    {loadingJoin ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                    Masuk Lobi
                  </button>
                </div>

                {joinError && (
                  <div className="text-xs text-rose-500 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {joinError}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg shadow">
                    🥷
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-500">Anda Siap di Lobi</span>
                    <h4 className="text-sm font-black">{myName}</h4>
                    <p className="text-[11px] opacity-70 font-mono">{myEmail}</p>
                  </div>
                </div>

                <button
                  onClick={handleLeaveLobby}
                  className="clay-btn px-4 py-2 rounded-xl text-xs font-bold text-rose-500 hover:text-rose-400"
                >
                  Keluar Lobi
                </button>
              </div>
            )}

            {/* WAITING ROOM HUD & KUOTA INDICATOR */}
            <div className="p-5 rounded-3xl bg-black/5 dark:bg-black/30 border border-current/10 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-current/10 pb-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase">
                  <Users className="w-4 h-4 text-amber-500" />
                  Peserta Terkumpul: <span className="text-amber-500">{currentParticipants.length}</span> / {requiredQuota}
                </div>
                <span className="text-[11px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-md">
                  {slotsLeft === 0 ? "KUOTA LENGKAP! Menyiapkan Pertandingan..." : `Kurang ${slotsLeft} Member Lagi`}
                </span>
              </div>

              {/* PARTICIPANTS AVATAR CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Array.from({ length: requiredQuota }).map((_, idx) => {
                  const p = currentParticipants[idx];
                  if (p) {
                    const isMe = p.email === myEmail;
                    return (
                      <div
                        key={p.email}
                        className={`p-3 rounded-2xl border transition flex items-center gap-3 ${
                          isMe
                            ? "bg-amber-500/15 border-amber-400 ring-1 ring-amber-400/50 shadow"
                            : "bg-black/10 dark:bg-white/5 border-current/10"
                        }`}
                      >
                        <span className="text-2xl">{p.avatar || "🥷"}</span>
                        <div className="overflow-hidden">
                          <div className="text-xs font-black truncate">{p.name}</div>
                          <span className="text-[9px] font-mono text-emerald-500 font-bold flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> SIAP
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // Empty Slot
                  return (
                    <div
                      key={`empty_${idx}`}
                      className="p-3 rounded-2xl border border-dashed border-current/20 flex items-center justify-center gap-2 opacity-50 bg-black/5"
                    >
                      <span className="text-xs font-bold text-stone-400 animate-pulse">Menunggu Siswa...</span>
                    </div>
                  );
                })}
              </div>

              {/* HELPER INFO */}
              <div className="text-[11px] opacity-75 text-center mt-1">
                💡 Buka link web ini di tab/perangkat teman sekelas Anda dengan email siswa berbeda untuk langsung tanding bersama secara otomatis.
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: COUNTDOWN SCREEN (ABA-ABA SEBELUM MULAI) ================= */}
        {battleState === "countdown" && (
          <div className="text-center py-10 flex flex-col items-center gap-6 animate-in zoom-in-90">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-rose-500/20 text-rose-500 border border-rose-500/40 text-xs font-black uppercase tracking-widest animate-pulse">
              <Zap className="w-4 h-4 fill-current" /> Kuota Terpenuhi • Bersiap!
            </div>

            <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-rose-500 to-amber-500 text-stone-950 flex items-center justify-center text-6xl font-black shadow-2xl border-4 border-amber-300 animate-bounce">
              {countdownNum}
            </div>

            <div>
              <h3 className="text-2xl font-black">Pertandingan Dimulai Dalam Hitungan Detik!</h3>
              <p className="text-xs opacity-75 mt-1 max-w-md">
                Posisikan jari Anda pada pilihan jawaban. Kecepatan dan ketepatan kosakata Anda menentukan kemenangan!
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP 3: IN BATTLE ARENA ================= */}
        {battleState === "in_battle" && currentQ && (
          <div className="flex flex-col gap-5">
            {/* TOP ARENA HEADER */}
            <div className="flex items-center justify-between border-b border-current/10 pb-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-rose-500">
                <Radio className="w-4 h-4 animate-pulse" />
                Mode: {mode === "1vs1" ? "Duel 1 vs 1" : mode === "group" ? "Tim 2 vs 2" : "Survival 6 Member"}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono font-black text-amber-400">
                Ronde {currentQIndex + 1}/{shuffledQuestions.length}
              </div>
            </div>

            {/* COMBATANTS HP STATUS HUD */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {activeCombatants.map((c) => {
                const isMe = c.email === myEmail;
                const hpPercent = Math.max(0, Math.min(100, c.hp));
                const isDead = c.hp <= 0;

                return (
                  <div
                    key={c.email}
                    className={`p-2.5 rounded-2xl border transition relative ${
                      isDead
                        ? "opacity-35 bg-stone-900 border-stone-800 grayscale"
                        : isMe
                        ? "bg-amber-500/15 border-amber-400 shadow-md ring-1 ring-amber-400"
                        : "bg-black/5 dark:bg-black/30 border-current/10"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 text-xs font-black">
                      <div className="flex items-center gap-1.5 truncate">
                        <span>{c.avatar || "🥷"}</span>
                        <span className="truncate">{c.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-amber-400 font-bold">{c.score}pts</span>
                    </div>

                    {/* HP BAR */}
                    <div className="w-full mt-2">
                      <div className="flex justify-between text-[9px] font-bold opacity-70 mb-0.5">
                        <span className="flex items-center gap-0.5">
                          {isDead ? <Skull className="w-2.5 h-2.5 text-rose-500" /> : <Heart className="w-2.5 h-2.5 text-rose-500 fill-current" />}
                          HP
                        </span>
                        <span>{c.hp}/100</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-black/20 dark:bg-white/10 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            c.hp <= 30 ? "bg-rose-500" : "bg-gradient-to-r from-emerald-400 to-emerald-600"
                          }`}
                          style={{ width: `${hpPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TIMER BAR */}
            <div className="w-full">
              <div className="flex justify-between items-center text-xs font-black font-mono mb-1">
                <span className="flex items-center gap-1 text-stone-400">
                  <Clock className="w-3.5 h-3.5" /> Sisa Waktu Serangan
                </span>
                <span className={timeLeft <= 3 ? "text-rose-500 animate-ping font-black text-sm" : "text-amber-400"}>
                  {timeLeft}s
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden border border-current/10">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    timeLeft <= 3 ? "bg-rose-500" : "bg-gradient-to-r from-rose-500 to-amber-500"
                  }`}
                  style={{ width: `${(timeLeft / 8) * 100}%` }}
                />
              </div>
            </div>

            {/* QUESTION CARD */}
            <div className="text-center py-5 bg-black/5 dark:bg-black/40 rounded-2xl border border-current/10">
              <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                Target Kosakata:
              </span>
              <h3 className="text-2xl sm:text-3xl font-black mt-2 text-rose-500">
                {currentQ.ja}
              </h3>
              {currentQ.romaji && (
                <span className="text-xs opacity-60 font-mono mt-0.5 block">
                  [{currentQ.romaji}]
                </span>
              )}
            </div>

            {/* OPTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((opt, idx) => {
                let btnClass = "clay-btn p-3.5 rounded-xl text-xs font-bold text-left transition relative";
                if (selectedAnswer) {
                  if (opt === currentQ.correct) {
                    btnClass = "bg-emerald-600 text-white p-3.5 rounded-xl text-xs font-bold text-left shadow-lg scale-[1.02] border-2 border-emerald-300";
                  } else if (opt === selectedAnswer) {
                    btnClass = "bg-rose-600 text-white p-3.5 rounded-xl text-xs font-bold text-left border-2 border-rose-300";
                  } else {
                    btnClass = "opacity-35 clay-btn p-3.5 rounded-xl text-xs font-bold text-left";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedAnswer !== null}
                    onClick={() => handleUserAnswer(opt)}
                    className={btnClass}
                  >
                    <span className="font-mono text-amber-400 mr-2 font-black">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* LIVE BATTLE LOG FEED */}
            <div className="p-3 rounded-2xl bg-black/10 dark:bg-black/50 border border-current/10 max-h-24 overflow-y-auto space-y-1 text-[11px] font-mono custom-scrollbar">
              {battleLog.map((log, i) => (
                <div key={i} className="opacity-80">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 4: VICTORY SCREEN ================= */}
        {battleState === "victory" && (
          <div className="text-center py-6 flex flex-col items-center gap-4 animate-in zoom-in-95">
            <div className="w-24 h-24 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-400/50 flex items-center justify-center text-5xl shadow-2xl animate-bounce">
              👑
            </div>
            <div>
              <span className="text-xs font-black uppercase text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                Kemenangan Mutlak!
              </span>
              <h2 className="text-3xl font-black mt-2">CHAMPION ARENA!</h2>
              <p className="text-xs opacity-75 mt-1 max-w-md">
                Selamat! Anda berhasil mengalahkan seluruh peserta terdaftar di arena ini.
              </p>
              <div className="inline-block mt-3 px-5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-black uppercase tracking-wider">
                +{mode === "all_members" ? 150 : mode === "group" ? 120 : 90} XP Ditambahkan ke Akun!
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setBattleState("lobby")}
                className="clay-btn px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Mode Lain
              </button>
              <button
                onClick={onClose}
                className="clay-btn-gold px-7 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
              >
                Tutup Arena
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: DEFEAT SCREEN ================= */}
        {battleState === "defeat" && (
          <div className="text-center py-6 flex flex-col items-center gap-4 animate-in zoom-in-95">
            <div className="w-24 h-24 rounded-3xl bg-rose-500/20 text-rose-500 border border-rose-500/50 flex items-center justify-center text-5xl shadow-2xl">
              💀
            </div>
            <div>
              <span className="text-xs font-black uppercase text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30">
                Tereliminasi
              </span>
              <h2 className="text-3xl font-black mt-2">Gugur di Medan Laga!</h2>
              <p className="text-xs opacity-75 mt-1 max-w-md">
                HP Anda terkuras habis oleh serangan peserta lain. Tingkatkan ketepatan kosakata Anda dan coba lagi!
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => setBattleState("lobby")}
                className="clay-btn px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Masuk Lobi Baru
              </button>
              <button
                onClick={onClose}
                className="clay-btn-gold px-7 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
              >
                Tutup Arena
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
