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
  KeyRound,
  Check,
  LogIn,
  User as UserIcon,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { addXp } from "@/lib/gamification";
import { advanceDailyQuest } from "@/lib/dailyQuests";
import { sfx } from "@/lib/soundEffects";

export type BattleMode = "1vs1" | "group" | "all_members";

interface Participant {
  email: string;
  name: string;
  avatar: string;
  team?: "shinobi" | "samurai";
  joinedAt: number;
  score: number;
  hp: number;
  isReady: boolean;
}

interface RoomData {
  id: string;
  mode: BattleMode;
  roomCode: string;
  requiredCount: number;
  status: "waiting" | "countdown" | "in_battle" | "finished";
  countdownSeconds: number;
  participants: Participant[];
}

interface BattleQuestion {
  ja: string;
  romaji?: string;
  correct: string;
  options: string[];
}

const AVATAR_OPTIONS = [
  { emoji: "🥷", label: "Shinobi" },
  { emoji: "⚔️", label: "Samurai" },
  { emoji: "🦊", label: "Kitsune" },
  { emoji: "⚡", label: "Raikiri" },
  { emoji: "🌸", label: "Kunoichi" },
  { emoji: "🐲", label: "Ryu" },
];

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
  { ja: "非常口 (ひじょうぐち)", romaji: "hijouguchi", correct: "Pintu keluar darurat", options: ["Pintu keluar darurat", "Pintu gerbang utama", "Pintu gudang", "Pintu lift"] },
  { ja: "賞味期限 (しょうみきげん)", romaji: "shoumikigen", correct: "Batas tanggal terbaik konsumsi", options: ["Batas tanggal terbaik konsumsi", "Tanggal pembuatan", "Harga diskon", "Berat bersih"] },
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
  const { user, isLoaded } = useUser();

  // Mode & Room State
  const [mode, setMode] = useState<BattleMode>(initialMode);
  const [customRoomCode, setCustomRoomCode] = useState<string>("");
  const [isUsingCustomRoom, setIsUsingCustomRoom] = useState<boolean>(false);
  const [room, setRoom] = useState<RoomData | null>(null);

  // Identity State
  const [myEmail, setMyEmail] = useState<string>("");
  const [myName, setMyName] = useState<string>("");
  const [myAvatar, setMyAvatar] = useState<string>("🥷");
  const [myTeam, setMyTeam] = useState<"shinobi" | "samurai">("shinobi");
  const [isJoined, setIsJoined] = useState(false);
  const [isMyReady, setIsMyReady] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

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

  // Auto-detect logged in user from Clerk or local storage
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (user) {
      const clerkEmail = user.primaryEmailAddress?.emailAddress || "";
      const clerkName = user.fullName || user.firstName || user.username || "";
      if (clerkEmail) {
        setMyEmail(clerkEmail);
        localStorage.setItem("irodori_user_email", clerkEmail);
      }
      if (clerkName) {
        setMyName(clerkName);
        localStorage.setItem("irodori_user_name", clerkName);
      }
    } else {
      const savedEmail = localStorage.getItem("irodori_user_email") || "";
      const savedName = localStorage.getItem("irodori_user_name") || "";
      if (savedEmail) setMyEmail(savedEmail);
      if (savedName) setMyName(savedName);
    }
  }, [user, isLoaded]);

  // Active room code resolving
  const currentActiveRoomCode = isUsingCustomRoom && customRoomCode.trim() ? customRoomCode.trim().toUpperCase() : "";

  // Poll Lobby Status from /api/battle-lobby
  const fetchLobbyStatus = async (targetMode: BattleMode, roomCodeParam?: string) => {
    try {
      const activeCode = roomCodeParam !== undefined ? roomCodeParam : currentActiveRoomCode;
      const url = `/api/battle-lobby?mode=${targetMode}&roomCode=${encodeURIComponent(activeCode)}&email=${encodeURIComponent(myEmail)}`;
      const res = await fetch(url);
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.room) {
        setRoom(data.room);

        // Sync user's ready status from room
        const meInRoom = data.room.participants.find((p: Participant) => p.email.toLowerCase() === myEmail.toLowerCase());
        if (meInRoom) {
          setIsJoined(true);
          setIsMyReady(meInRoom.isReady);
          if (meInRoom.team) setMyTeam(meInRoom.team);
          if (meInRoom.avatar) setMyAvatar(meInRoom.avatar);
        } else {
          setIsJoined(false);
          setIsMyReady(false);
        }

        // Trigger countdown if room countdown started
        if (data.room.status === "countdown" && battleState === "lobby") {
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

    fetchLobbyStatus(mode, currentActiveRoomCode);
    pollIntervalRef.current = setInterval(() => {
      if (battleState === "lobby") {
        fetchLobbyStatus(mode, currentActiveRoomCode);
      }
    }, 2000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isOpen, mode, battleState, myEmail, isUsingCustomRoom, customRoomCode]);

  // Mode Selection
  const handleSelectMode = (newMode: BattleMode) => {
    if (isJoined) handleLeaveLobby();
    setMode(newMode);
    setBattleState("lobby");
    setIsJoined(false);
    setIsMyReady(false);
    fetchLobbyStatus(newMode, currentActiveRoomCode);
  };

  // Join Lobby as current user
  const handleJoinLobby = async () => {
    if (!myEmail.trim()) {
      setActionError("Masukkan email akun Anda untuk bergabung.");
      return;
    }

    setLoadingAction(true);
    setActionError(null);

    const resolvedName = myName.trim() || myEmail.split("@")[0].toUpperCase();

    try {
      const res = await fetch("/api/battle-lobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "join",
          mode,
          roomCode: currentActiveRoomCode,
          email: myEmail.trim().toLowerCase(),
          name: resolvedName,
          avatar: myAvatar,
          team: myTeam,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setActionError(data.error || "Gagal bergabung ke lobi.");
        setLoadingAction(false);
        return;
      }

      setRoom(data.room);
      setIsJoined(true);
      setIsMyReady(false);
      localStorage.setItem("irodori_user_email", myEmail.trim().toLowerCase());
      localStorage.setItem("irodori_user_name", resolvedName);
      sfx.playCorrect();
    } catch (e: any) {
      setActionError("Koneksi gagal. Silakan coba lagi.");
    } finally {
      setLoadingAction(false);
    }
  };

  // Leave Lobby
  const handleLeaveLobby = async () => {
    try {
      await fetch("/api/battle-lobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "leave",
          mode,
          roomCode: currentActiveRoomCode,
          email: myEmail,
        }),
      });
      setIsJoined(false);
      setIsMyReady(false);
      fetchLobbyStatus(mode, currentActiveRoomCode);
    } catch (e) {}
  };

  // Student determines their own ready status
  const handleToggleReady = async () => {
    setLoadingAction(true);
    setActionError(null);
    try {
      const nextReady = !isMyReady;
      const res = await fetch("/api/battle-lobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle_ready",
          mode,
          roomCode: currentActiveRoomCode,
          email: myEmail,
          isReady: nextReady,
        }),
      });

      const data = await res.json();
      if (data.success && data.room) {
        setRoom(data.room);
        setIsMyReady(nextReady);
        if (nextReady) {
          sfx.playCorrect();
        } else {
          sfx.playTick();
        }

        if (data.room.status === "countdown") {
          triggerLobbyCountdown(data.room);
        }
      }
    } catch (e) {
      setActionError("Gagal memperbarui status kesiapan.");
    } finally {
      setLoadingAction(false);
    }
  };

  // Student determines their own team
  const handleSelectTeam = async (team: "shinobi" | "samurai") => {
    setMyTeam(team);
    if (isJoined) {
      try {
        await fetch("/api/battle-lobby", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "choose_team",
            mode,
            roomCode: currentActiveRoomCode,
            email: myEmail,
            team,
          }),
        });
        fetchLobbyStatus(mode, currentActiveRoomCode);
      } catch (e) {}
    }
  };

  // Student determines their own avatar
  const handleSelectAvatar = async (avatar: string) => {
    setMyAvatar(avatar);
    if (isJoined) {
      try {
        await fetch("/api/battle-lobby", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "choose_avatar",
            mode,
            roomCode: currentActiveRoomCode,
            email: myEmail,
            avatar,
          }),
        });
        fetchLobbyStatus(mode, currentActiveRoomCode);
      } catch (e) {}
    }
  };

  // Countdown when Kuota Terpenuhi & Semua Peserta SIAP
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
    setBattleLog([`🔥 PERTANDINGAN DIMULAI! Seluruh peserta telah konfirmasi SIAP!`]);
    setBattleState("in_battle");
    sfx.playBlast();
  };

  // Question Timer Loop
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
        const isMe = c.email.toLowerCase() === myEmail.toLowerCase();
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
          // Live rival simulated reaction
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
    const me = activeCombatants.find((c) => c.email.toLowerCase() === myEmail.toLowerCase());
    const others = activeCombatants.filter((c) => c.email.toLowerCase() !== myEmail.toLowerCase());
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
  const allParticipantsReady =
    currentParticipants.length >= requiredQuota &&
    currentParticipants.every((p) => p.isReady);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5">
      <div className="clay-card rounded-3xl p-5 sm:p-8 max-w-2xl w-full border border-rose-500/40 relative shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 max-h-[94vh] overflow-y-auto custom-scrollbar">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:opacity-100 opacity-60 transition"
          title="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================= STEP 1: LOBBY & PRE-MATCH ================= */}
        {battleState === "lobby" && (
          <div className="flex flex-col gap-5">
            {/* HEADER */}
            <div className="flex items-center gap-3 border-b border-current/10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shrink-0">
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black">Lobi Battle Royale Real-Member</h2>
                  <span className="text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" /> Akun Siswa Mandiri
                  </span>
                </div>
                <p className="text-xs opacity-75 mt-0.5">
                  Setiap siswa masuk dengan akunnya sendiri dan menentukan sendiri mode, avatar, kubu tim, serta konfirmasi kesiapan tanding.
                </p>
              </div>
            </div>

            {/* 1. IDENTITAS AKUN LOGIN (OTENTIKASI SISWA) */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-500">
                  <UserCheck className="w-4 h-4" />
                  {user ? "Akun Login Terverifikasi (Clerk SSO)" : "Identitas Siswa (Akun Mandiri)"}
                </div>
                {user && (
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Logged In
                  </span>
                )}
              </div>

              {user ? (
                // Tampilan Siswa yang sudah login di Portal / Clerk
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/10 dark:bg-black/30 border border-current/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-xl font-black">
                      {myAvatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-black flex items-center gap-1.5">
                        {myName || "Siswa Terdaftar"}
                      </h4>
                      <p className="text-[11px] opacity-70 font-mono">{myEmail}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg">
                    Akun Aktif Anda
                  </span>
                </div>
              ) : (
                // Siswa menentukan sendiri email & namanya (input mandiri, BUKAN comot dropdown teman)
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] uppercase font-black opacity-70 block mb-1">Nama Lengkap Siswa</label>
                    <input
                      type="text"
                      disabled={isJoined}
                      value={myName}
                      onChange={(e) => setMyName(e.target.value)}
                      placeholder="Masukkan nama Anda..."
                      className="w-full p-2.5 rounded-xl border border-current/20 bg-white dark:bg-stone-900 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black opacity-70 block mb-1">Email Resmi Siswa</label>
                    <input
                      type="email"
                      disabled={isJoined}
                      value={myEmail}
                      onChange={(e) => setMyEmail(e.target.value)}
                      placeholder="email.siswa@irodori.outsutsuki.sch.id"
                      className="w-full p-2.5 rounded-xl border border-current/20 bg-white dark:bg-stone-900 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. SISWA MENENTUKAN SENDIRI: AVATAR & ROOM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Avatar Selector */}
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase opacity-75">Tentukan Avatar Shinobi Anda</span>
                <div className="flex items-center justify-between gap-1">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av.emoji}
                      onClick={() => handleSelectAvatar(av.emoji)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition ${
                        myAvatar === av.emoji
                          ? "bg-amber-500 text-black scale-110 shadow-md ring-2 ring-amber-400"
                          : "hover:bg-black/10 dark:hover:bg-white/10 opacity-70"
                      }`}
                      title={av.label}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Code Customizer */}
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase opacity-75">Tentukan Room / Lobi</span>
                  <button
                    onClick={() => {
                      setIsUsingCustomRoom(!isUsingCustomRoom);
                      if (isJoined) handleLeaveLobby();
                    }}
                    className="text-[10px] font-bold text-amber-500 hover:underline flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    {isUsingCustomRoom ? "Gunakan Lobi Umum" : "Pakai Kode Room Khusus"}
                  </button>
                </div>

                {isUsingCustomRoom ? (
                  <input
                    type="text"
                    disabled={isJoined}
                    value={customRoomCode}
                    onChange={(e) => setCustomRoomCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: A22-DUEL / LPK-99"
                    className="p-2 rounded-xl border border-amber-500/40 bg-white dark:bg-stone-900 text-xs font-mono font-black uppercase"
                  />
                ) : (
                  <div className="text-xs font-bold py-1.5 opacity-80 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                    Lobi Publik Bersama (Semua Siswa Terdaftar)
                  </div>
                )}
              </div>
            </div>

            {/* 3. MODE SELECTION TABS */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black uppercase opacity-75">Pilih Mode Pertandingan</span>
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
            </div>

            {/* OPSI PILIH TIM JIKA MODE GROUP 2vs2 */}
            {mode === "group" && (
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-indigo-400">
                  Tentukan Kubu Anda Sendiri (Tim 2 vs 2)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSelectTeam("shinobi")}
                    className={`p-2.5 rounded-xl border font-black text-xs flex items-center justify-center gap-2 transition ${
                      myTeam === "shinobi"
                        ? "bg-blue-600 text-white border-blue-400 shadow-md ring-2 ring-blue-300"
                        : "bg-black/10 dark:bg-white/5 border-current/10 opacity-70"
                    }`}
                  >
                    <span>🥷</span> Tim Shinobi (Biru)
                  </button>
                  <button
                    onClick={() => handleSelectTeam("samurai")}
                    className={`p-2.5 rounded-xl border font-black text-xs flex items-center justify-center gap-2 transition ${
                      myTeam === "samurai"
                        ? "bg-rose-600 text-white border-rose-400 shadow-md ring-2 ring-rose-300"
                        : "bg-black/10 dark:bg-white/5 border-current/10 opacity-70"
                    }`}
                  >
                    <span>⚔️</span> Tim Samurai (Merah)
                  </button>
                </div>
              </div>
            )}

            {/* 4. ACTIONS BAR: MASUK LOBI / SAYA SIAP */}
            {!isJoined ? (
              <div className="flex flex-col gap-2">
                <button
                  disabled={loadingAction || !myEmail.trim()}
                  onClick={handleJoinLobby}
                  className="clay-btn-gold py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 hover:scale-[1.01] transition"
                >
                  {loadingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  Masuk ke Lobi Pertandingan
                </button>
                {actionError && (
                  <div className="text-xs text-rose-500 font-bold flex items-center gap-1 justify-center">
                    <AlertCircle className="w-3.5 h-3.5" /> {actionError}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-2xl shadow">
                    {myAvatar}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-500">Anda Berada di Lobi</span>
                    <h4 className="text-sm font-black">{myName}</h4>
                    <span className="text-[11px] font-mono opacity-70">
                      {mode === "group" ? `Kubu: Tim ${myTeam.toUpperCase()}` : `Room: ${room?.roomCode || mode}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* TOMBOL SISWA MENENTUKAN SENDIRI STATUS SIAP */}
                  <button
                    disabled={loadingAction}
                    onClick={handleToggleReady}
                    className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                      isMyReady
                        ? "bg-emerald-500 text-white shadow-lg ring-2 ring-emerald-300"
                        : "clay-btn-gold shadow-md hover:scale-105"
                    }`}
                  >
                    {isMyReady ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> ANDA SUDAH SIAP! (Batal)
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" /> SAYA SIAP BERTANDING!
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleLeaveLobby}
                    className="clay-btn px-3 py-2.5 rounded-xl text-xs font-bold text-rose-500 hover:text-rose-400"
                    title="Keluar Lobi"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            )}

            {/* 5. WAITING ROOM HUD & REAL-TIME PESERTA */}
            <div className="p-5 rounded-3xl bg-black/5 dark:bg-black/30 border border-current/10 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-current/10 pb-3 gap-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase">
                  <Users className="w-4 h-4 text-amber-500" />
                  Peserta Terkumpul: <span className="text-amber-500">{currentParticipants.length}</span> / {requiredQuota}
                  <span className="text-[11px] font-mono opacity-60 ml-1">
                    (Room: {room?.roomCode || mode.toUpperCase()})
                  </span>
                </div>
                <div>
                  {slotsLeft === 0 ? (
                    allParticipantsReady ? (
                      <span className="text-[11px] font-mono font-black text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-md animate-pulse">
                        SEMUA SIAP! Memulai Pertandingan...
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-md">
                        Menunggu Semua Peserta Menekan "SIAP"
                      </span>
                    )
                  ) : (
                    <span className="text-[11px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-md">
                      Kurang {slotsLeft} Member Lagi
                    </span>
                  )}
                </div>
              </div>

              {/* PARTICIPANTS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({ length: requiredQuota }).map((_, idx) => {
                  const p = currentParticipants[idx];
                  if (p) {
                    const isMe = p.email.toLowerCase() === myEmail.toLowerCase();
                    return (
                      <div
                        key={p.email}
                        className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                          isMe
                            ? "bg-amber-500/15 border-amber-400 ring-1 ring-amber-400/50 shadow"
                            : "bg-black/10 dark:bg-white/5 border-current/10"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className="text-2xl">{p.avatar || "🥷"}</span>
                          <div className="overflow-hidden">
                            <div className="text-xs font-black truncate flex items-center gap-1">
                              {p.name} {isMe && <span className="text-[10px] text-amber-500 font-mono">(Anda)</span>}
                            </div>
                            <span className="text-[10px] font-mono opacity-70 truncate block">
                              {p.team ? `Tim ${p.team}` : p.email.split("@")[0]}
                            </span>
                          </div>
                        </div>

                        <div>
                          {p.isReady ? (
                            <span className="text-[10px] font-mono text-emerald-400 font-black bg-emerald-500/15 px-2 py-0.5 rounded flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> SIAP
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded flex items-center gap-0.5">
                              <Clock className="w-3 h-3 animate-spin" /> Menunggu
                            </span>
                          )}
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
                      <span className="text-xs font-bold text-stone-400 animate-pulse">Menunggu Peserta...</span>
                    </div>
                  );
                })}
              </div>

              {/* PETUNJUK MULTIPLAYER */}
              <div className="text-[11px] opacity-75 text-center mt-1">
                💡 Bagikan kode room <span className="font-mono font-bold text-amber-400">{room?.roomCode || mode.toUpperCase()}</span> ke teman sekelas Anda. Siswa yang bersangkutan membuka link ini di perangkat masing-masing untuk bertanding bersama!
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: COUNTDOWN ABA-ABA 5 DETIK ================= */}
        {battleState === "countdown" && (
          <div className="py-12 flex flex-col items-center justify-center gap-6 text-center animate-in zoom-in-95">
            <div className="w-24 h-24 rounded-full bg-rose-600/20 border-2 border-rose-500 text-rose-500 flex items-center justify-center text-5xl font-black font-mono shadow-2xl animate-pulse">
              {countdownNum}
            </div>

            <div>
              <span className="text-xs font-black uppercase text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                Aba-aba Pertandingan
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-3">SEMUA SISWA TELAH SIAP!</h2>
              <p className="text-xs opacity-75 mt-1 max-w-sm">
                Ronde 1 akan segera dimulai. Konsentrasi penuh pada kanji dan arti kosakata!
              </p>
            </div>

            <div className="flex items-center gap-3">
              {activeCombatants.map((c) => (
                <div key={c.email} className="flex flex-col items-center gap-1">
                  <span className="text-2xl">{c.avatar}</span>
                  <span className="text-[10px] font-mono font-bold opacity-80">{c.name.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 3: ARENA PERTANDINGAN AKTIF ================= */}
        {battleState === "in_battle" && currentQ && (
          <div className="flex flex-col gap-5 animate-in fade-in">
            {/* TOP ARENA HUD */}
            <div className="flex items-center justify-between border-b border-current/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-500">
                  Ronde {currentQIndex + 1} / {shuffledQuestions.length}
                </span>
                <span className="text-[11px] font-mono opacity-50">• {mode.toUpperCase()}</span>
              </div>

              {/* TIMER HITUNG MUNDUR */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-black text-sm transition ${
                  timeLeft <= 3 ? "bg-rose-500 text-white animate-bounce shadow-md" : "bg-black/10 dark:bg-white/10"
                }`}
              >
                <Clock className="w-4 h-4" /> {timeLeft}s
              </div>
            </div>

            {/* COMBATANTS HP STATUS BARS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {activeCombatants.map((c) => {
                const isMe = c.email.toLowerCase() === myEmail.toLowerCase();
                const hpPercent = Math.max(0, c.hp);
                return (
                  <div
                    key={c.email}
                    className={`p-2.5 rounded-xl border flex flex-col gap-1.5 transition ${
                      c.hp <= 0
                        ? "opacity-35 grayscale bg-rose-950/20 border-rose-500/20"
                        : isMe
                        ? "bg-amber-500/15 border-amber-400 shadow"
                        : "bg-black/10 dark:bg-white/5 border-current/10"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black truncate flex items-center gap-1">
                        {c.avatar} {c.name.split(" ")[0]}
                      </span>
                      <span className="font-mono text-[10px] font-bold text-amber-400">{c.score} PTS</span>
                    </div>

                    {/* HP Bar */}
                    <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden relative">
                      <div
                        className={`h-full transition-all duration-300 ${
                          hpPercent > 50 ? "bg-emerald-500" : hpPercent > 20 ? "bg-amber-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${hpPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* QUESTION DISPLAY */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-black/5 to-black/15 dark:from-white/5 dark:to-white/10 border border-current/15 text-center flex flex-col items-center justify-center gap-2 shadow-inner">
              <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider">
                Tentukan Arti Kosakata
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-wide">{currentQ.ja}</h3>
              {currentQ.romaji && (
                <span className="text-xs font-mono opacity-60">[{currentQ.romaji}]</span>
              )}
            </div>

            {/* OPTIONS BUTTONS */}
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
