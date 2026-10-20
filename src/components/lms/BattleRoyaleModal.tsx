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
  BookOpen,
  Filter,
  Layers,
  HelpCircle,
  Send,
  Bell,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { addXp } from "@/lib/gamification";
import { advanceDailyQuest } from "@/lib/dailyQuests";
import { sfx } from "@/lib/soundEffects";
import {
  generateBattleQuestions,
  VocabCategory,
  VocabLevel,
  BattleQuestion,
} from "@/data/battleQuestionBank";
import {
  DEFAULT_AVATARS,
  EXCLUSIVE_TOURNAMENT_AVATARS,
  TOURNAMENT_REWARD_TIERS,
  getTournamentUnlockStatus,
} from "@/data/tournamentRewards";

export type BattleMode = "1vs1" | "group" | "all_members" | "tournament";

interface Participant {
  email: string;
  name: string;
  avatar: string;
  team?: "shinobi" | "samurai";
  joinedAt: number;
  score: number;
  hp: number;
  isReady: boolean;
  rematchVote?: boolean;
}

interface RoomData {
  id: string;
  mode: BattleMode;
  roomCode: string;
  requiredCount: number;
  status: "waiting" | "countdown" | "in_battle" | "finished";
  countdownSeconds: number;
  topicLevel: VocabLevel;
  topicChapter: number;
  topicCategory: VocabCategory;
  participants: Participant[];
  questions?: BattleQuestion[];
  battleLog?: string[];
  updatedAt: number;
}

interface OnlineStudent {
  email: string;
  name: string;
  avatar: string;
  status: string;
  currentRoomCode?: string | null;
  lastSeen: number;
}

interface PendingInvite {
  id: string;
  fromEmail: string;
  fromName: string;
  fromAvatar: string;
  toEmail: string;
  roomCode: string;
  status: string;
  createdAt: number;
}

const AVATAR_OPTIONS = [
  { emoji: "🥷", label: "Shinobi" },
  { emoji: "⚔️", label: "Samurai" },
  { emoji: "🦊", label: "Kitsune" },
  { emoji: "⚡", label: "Raikiri" },
  { emoji: "🌸", label: "Kunoichi" },
  { emoji: "🐲", label: "Ryu" },
];

const CATEGORY_OPTIONS: { key: VocabCategory; label: string; icon: string }[] = [
  { key: "all", label: "Acak / Semua Kategori", icon: "🎲" },
  { key: "noun", label: "Kata Benda (Meishi - N)", icon: "📦" },
  { key: "adj", label: "Kata Sifat (Keiyoushi - i & na)", icon: "✨" },
  { key: "verb1", label: "Kata Kerja Gol. 1 (Godan - V1)", icon: "🏃" },
  { key: "verb2", label: "Kata Kerja Gol. 2 (Ichidan - V2)", icon: "🚶" },
  { key: "verb3", label: "Kata Kerja Gol. 3 (Suru / Fukisoku)", icon: "⚡" },
];

// RUMUS SKOR KAHOOT: Semakin cepat sisa waktu, semakin besar poin tambahan (maksimal 1000 poin)
function calculateKahootScore(isCorrect: boolean, timeLeftSeconds: number, maxTimeSeconds: number = 8): number {
  if (!isCorrect) return 0;
  if (timeLeftSeconds <= 0) return 500; // Poin dasar jika benar di detik terakhir

  const timeRatio = timeLeftSeconds / maxTimeSeconds;
  // 500 poin dasar + hingga 500 poin bonus kecepatan
  return Math.round(500 + (500 * timeRatio));
}

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

  // Topic & Category Customization State
  const [topicLevel, setTopicLevel] = useState<VocabLevel>("A2.2");
  const [topicChapter, setTopicChapter] = useState<number>(0);
  const [topicCategory, setTopicCategory] = useState<VocabCategory>("all");

  // Identity State
  const [myEmail, setMyEmail] = useState<string>("");
  const [myName, setMyName] = useState<string>("");
  const [myAvatar, setMyAvatar] = useState<string>("🥷");
  const [myTeam, setMyTeam] = useState<"shinobi" | "samurai">("shinobi");
  const [isJoined, setIsJoined] = useState(false);
  const [isMyReady, setIsMyReady] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Online Presence & Direct Challenges
  const [onlineStudents, setOnlineStudents] = useState<OnlineStudent[]>([]);
  const [pendingInvite, setPendingInvite] = useState<PendingInvite | null>(null);
  const [inviteNotification, setInviteNotification] = useState<string | null>(null);

  // Tournament Stats & Unlocks
  const [tournamentWins, setTournamentWins] = useState<number>(0);
  const [showTournamentShowcase, setShowTournamentShowcase] = useState(false);

  // Battle State
  const [battleState, setBattleState] = useState<"lobby" | "countdown" | "in_battle" | "victory" | "defeat">("lobby");
  const [countdownNum, setCountdownNum] = useState(5);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<BattleQuestion[]>([]);
  const [timeLeft, setTimeLeft] = useState(8);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [activeCombatants, setActiveCombatants] = useState<Participant[]>([]);

  const lastSeenUpdatedAtRef = useRef<number>(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const presenceIntervalRef = useRef<NodeJS.Timeout | null>(null);
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

  // Fetch tournament stats for the user
  useEffect(() => {
    if (!myEmail) return;
    fetch(`/api/battle-history?email=${encodeURIComponent(myEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.leaderboard)) {
          const found = data.leaderboard.find(
            (e: any) => e.email?.toLowerCase() === myEmail.toLowerCase()
          );
          if (found && typeof found.tournamentWins === "number") {
            setTournamentWins(found.tournamentWins);
          }
        }
      })
      .catch(() => {});
  }, [myEmail, isOpen]);

  // Active room code resolving
  const currentActiveRoomCode = isUsingCustomRoom && customRoomCode.trim() ? customRoomCode.trim().toUpperCase() : "";

  // 1. PRESENCE HEARTBEAT & INVITATION CHECK LOOP
  useEffect(() => {
    if (!myEmail) return;

    const sendHeartbeat = async () => {
      try {
        await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "heartbeat",
            email: myEmail,
            name: myName,
            avatar: myAvatar,
            status: battleState === "in_battle" ? "in_battle" : isJoined ? "in_lobby" : "online",
            roomCode: currentActiveRoomCode || null,
          }),
        });
      } catch (e) { }
    };

    const fetchPresence = async () => {
      try {
        const res = await fetch(`/api/presence?email=${encodeURIComponent(myEmail)}`, { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success) {
          if (Array.isArray(data.onlineUsers)) {
            setOnlineStudents(data.onlineUsers.filter((u: OnlineStudent) => u.email.toLowerCase() !== myEmail.toLowerCase()));
          }
          if (data.pendingInvite) {
            setPendingInvite(data.pendingInvite);
          } else {
            setPendingInvite(null);
          }
        }
      } catch (e) { }
    };

    sendHeartbeat();
    fetchPresence();

    presenceIntervalRef.current = setInterval(() => {
      sendHeartbeat();
      fetchPresence();
    }, 5000);

    return () => {
      if (presenceIntervalRef.current) clearInterval(presenceIntervalRef.current);
    };
  }, [myEmail, myName, myAvatar, battleState, isJoined, currentActiveRoomCode]);

  // 2. POLL LOBBY STATUS
  const fetchLobbyStatus = async (targetMode: BattleMode, roomCodeParam?: string, forceFull: boolean = false) => {
    try {
      const activeCode = roomCodeParam !== undefined ? roomCodeParam : currentActiveRoomCode;
      const since = forceFull ? 0 : lastSeenUpdatedAtRef.current;
      const url = `/api/battle-lobby?mode=${targetMode}&roomCode=${encodeURIComponent(activeCode)}&since=${since}&email=${encodeURIComponent(myEmail)}`;

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();

      if (!data.success) return;
      if (data.changed === false) return;

      if (data.room) {
        setRoom(data.room);
        lastSeenUpdatedAtRef.current = data.room.updatedAt || Date.now();

        if (data.room.topicLevel) setTopicLevel(data.room.topicLevel);
        if (typeof data.room.topicChapter === "number") setTopicChapter(data.room.topicChapter);
        if (data.room.topicCategory) setTopicCategory(data.room.topicCategory);

        const meInRoom = data.room.participants.find((p: Participant) => p.email.toLowerCase() === myEmail.toLowerCase());
        if (meInRoom) {
          setIsJoined(true);
          setIsMyReady(meInRoom.isReady);
          if (meInRoom.team) setMyTeam(meInRoom.team);
          if (meInRoom.avatar) setMyAvatar(meInRoom.avatar);

          if (
            data.room.status === "countdown" &&
            (battleState === "lobby" || battleState === "victory" || battleState === "defeat") &&
            meInRoom.isReady
          ) {
            triggerLobbyCountdown(data.room);
          }

          if (battleState === "in_battle" && Array.isArray(data.room.participants)) {
            setActiveCombatants(data.room.participants);
            if (Array.isArray(data.room.battleLog) && data.room.battleLog.length > 0) {
              setBattleLog(data.room.battleLog);
            }
          }
        } else {
          if (battleState !== "victory" && battleState !== "defeat") {
            setIsJoined(false);
            setIsMyReady(false);
          }
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

    lastSeenUpdatedAtRef.current = 0;
    fetchLobbyStatus(mode, currentActiveRoomCode, true);

    pollIntervalRef.current = setInterval(() => {
      fetchLobbyStatus(mode, currentActiveRoomCode);
    }, battleState === "in_battle" ? 1200 : 2000);

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
    lastSeenUpdatedAtRef.current = 0;
    fetchLobbyStatus(newMode, currentActiveRoomCode, true);
  };

  // Topic Filters update
  const handleUpdateTopic = async (newLevel: VocabLevel, newChapter: number, newCategory: VocabCategory) => {
    setTopicLevel(newLevel);
    setTopicChapter(newChapter);
    setTopicCategory(newCategory);

    try {
      await fetch("/api/battle-lobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set_topic",
          mode,
          roomCode: currentActiveRoomCode,
          topicLevel: newLevel,
          topicChapter: newChapter,
          topicCategory: newCategory,
        }),
      });
      fetchLobbyStatus(mode, currentActiveRoomCode, true);
    } catch (e) { }
  };

  // Join Lobby
  const handleJoinLobby = async (targetCodeOverride?: string) => {
    if (!myEmail.trim()) {
      setActionError("Masukkan email akun Anda untuk bergabung.");
      return;
    }

    setLoadingAction(true);
    setActionError(null);

    const activeCode = targetCodeOverride !== undefined ? targetCodeOverride : currentActiveRoomCode;
    const resolvedName = myName.trim() || myEmail.split("@")[0].toUpperCase();

    try {
      const res = await fetch("/api/battle-lobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "join",
          mode,
          roomCode: activeCode,
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
      lastSeenUpdatedAtRef.current = data.room?.updatedAt || Date.now();
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
      lastSeenUpdatedAtRef.current = 0;
      fetchLobbyStatus(mode, currentActiveRoomCode, true);
    } catch (e) { }
  };

  // Ready Toggle
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
        lastSeenUpdatedAtRef.current = data.room.updatedAt || Date.now();
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

  // Team Selection
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
        fetchLobbyStatus(mode, currentActiveRoomCode, true);
      } catch (e) { }
    }
  };

  // Avatar Selection
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
        fetchLobbyStatus(mode, currentActiveRoomCode, true);
      } catch (e) { }
    }
  };

  // Challenge Student
  const handleChallengeStudent = async (targetStudent: OnlineStudent) => {
    const randomCode = `DUEL${Math.floor(100 + Math.random() * 900)}`;
    setIsUsingCustomRoom(true);
    setCustomRoomCode(randomCode);

    try {
      setInviteNotification(`Mengirim tantangan duel ke ${targetStudent.name}...`);
      await fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_invite",
          email: myEmail,
          name: myName,
          avatar: myAvatar,
          toEmail: targetStudent.email,
          targetRoomCode: randomCode,
        }),
      });

      await handleJoinLobby(randomCode);
      sfx.playSlash();
      setTimeout(() => setInviteNotification(null), 5000);
    } catch (e) {
      setActionError("Gagal mengirim undangan duel.");
    }
  };

  // Accept Invite
  const handleAcceptInvite = async () => {
    if (!pendingInvite) return;
    const targetRoom = pendingInvite.roomCode;
    setIsUsingCustomRoom(true);
    setCustomRoomCode(targetRoom);

    try {
      await fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "respond_invite",
          email: myEmail,
          inviteId: pendingInvite.id,
          response: "accepted",
        }),
      });

      setPendingInvite(null);
      await handleJoinLobby(targetRoom);
      sfx.playVictory();
    } catch (e) { }
  };

  const handleDeclineInvite = async () => {
    if (!pendingInvite) return;
    try {
      await fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "respond_invite",
          email: myEmail,
          inviteId: pendingInvite.id,
          response: "declined",
        }),
      });
      setPendingInvite(null);
    } catch (e) { }
  };

  // Countdown & Match Start
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
        startMatch(currentRoom);
      }
    }, 1000);
  };

  const startMatch = (currentRoom: RoomData) => {
    let questions = currentRoom.questions && currentRoom.questions.length > 0 ? currentRoom.questions : [];
    if (questions.length === 0) {
      questions = generateBattleQuestions({
        level: currentRoom.topicLevel || topicLevel,
        chapter: currentRoom.topicChapter !== undefined ? currentRoom.topicChapter : topicChapter,
        category: currentRoom.topicCategory || topicCategory,
        count: 5,
      });
    }

    setShuffledQuestions(questions);
    setCurrentQIndex(0);
    setTimeLeft(8);
    setSelectedAnswer(null);

    const topicLabel = `[${currentRoom.topicLevel || "A2.2"} • ${currentRoom.topicChapter ? `Bab ${currentRoom.topicChapter}` : "Semua Bab"
      } • ${currentRoom.topicCategory?.toUpperCase() || "ACAK"}]`;

    setBattleLog(
      currentRoom.battleLog && currentRoom.battleLog.length > 0
        ? currentRoom.battleLog
        : [`🔥 PERTANDINGAN DIMULAI! Topik: ${topicLabel}`]
    );
    setBattleState("in_battle");
    sfx.playBlast();
  };

  // Question Timer
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
    // Hitung poin gaya Kahoot berdasarkan sisa detik (timeLeft)
    const earnedPts = calculateKahootScore(isCorrect, timeLeft, 8);
    const dmg = chosen === "__TIMEOUT__" || !isCorrect ? 30 : 0;

    // 1. Instantly update local client state
    setActiveCombatants((prev) => {
      return prev.map((c) => {
        const isMe = c.email.toLowerCase() === myEmail.toLowerCase();
        if (isMe) {
          const hp = isCorrect ? c.hp : Math.max(0, c.hp - dmg);
          const score = c.score + earnedPts;
          return { ...c, hp, score };
        }
        return c;
      });
    });

    const localLog = isCorrect
      ? `⚔️ Anda BENAR! (+${earnedPts} PTS)`
      : `💥 Anda ${chosen === "__TIMEOUT__" ? "KEHABISAN WAKTU" : "SALAH JAWAB"}! (-30 HP)`;
    setBattleLog((prev) => [localLog, ...prev].slice(0, 8));

    // 2. Kirim giliran ke server
    try {
      fetch("/api/battle-lobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_turn",
          mode,
          roomCode: currentActiveRoomCode,
          email: myEmail,
          isCorrect,
          chosenAnswer: chosen,
          questionIndex: currentQIndex,
          earnedScore: earnedPts,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.room) {
            setRoom(data.room);
            if (Array.isArray(data.room.participants)) {
              setActiveCombatants(data.room.participants);
            }
            if (Array.isArray(data.room.battleLog) && data.room.battleLog.length > 0) {
              setBattleLog(data.room.battleLog);
            }
          }
        });
    } catch (e) { }

    setTimeout(() => {
      checkBattleOver();
    }, 1200);
  };

  const notifyMatchFinished = async () => {
    try {
      await fetch("/api/battle-lobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "finish_match",
          mode,
          roomCode: currentActiveRoomCode,
          email: myEmail,
        }),
      });
      fetchLobbyStatus(mode, currentActiveRoomCode, true);
    } catch (e) { }
  };

  const handleRequestRematch = async () => {
    setLoadingAction(true);
    setActionError(null);
    try {
      const res = await fetch("/api/battle-lobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "request_rematch",
          mode,
          roomCode: currentActiveRoomCode,
          email: myEmail,
        }),
      });
      const data = await res.json();
      if (data.success && data.room) {
        setRoom(data.room);
        lastSeenUpdatedAtRef.current = data.room.updatedAt || Date.now();
        sfx.playCorrect();
        if (data.room.status === "countdown") {
          triggerLobbyCountdown(data.room);
        }
      }
    } catch (e) {
      setActionError("Gagal mengajukan rematch.");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleReturnToLobby = async () => {
    setLoadingAction(true);
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
    } catch (e) { }
    setIsJoined(false);
    setIsMyReady(false);
    setBattleState("lobby");
    lastSeenUpdatedAtRef.current = 0;
    setLoadingAction(false);
    sfx.playTick();
    fetchLobbyStatus(mode, currentActiveRoomCode, true);
  };

  const handleCloseModal = async () => {
    if (isJoined) {
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
      } catch (e) { }
    }
    setIsJoined(false);
    setIsMyReady(false);
    setBattleState("lobby");
    onClose();
  };

  // PERBAIKAN UTAMA: Logika Pemenang & Skor Akurat
  const checkBattleOver = () => {
    const me = activeCombatants.find((c) => c.email.toLowerCase() === myEmail.toLowerCase());
    const others = activeCombatants.filter((c) => c.email.toLowerCase() !== myEmail.toLowerCase());
    const othersAlive = others.filter((c) => c.hp > 0).length;

    // Jika HP habis atau soal sudah habis, tentukan pemenang berdasarkan skor tertinggi & sisa HP
    if ((me && me.hp <= 0) || othersAlive === 0 || currentQIndex + 1 >= shuffledQuestions.length) {
      // Urutkan peserta berdasarkan Skor tertinggi, lalu sisa HP tertinggi
      const sortedCombatants = [...activeCombatants].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.hp - a.hp;
      });

      const winner = sortedCombatants[0];
      const isIWinner = winner && winner.email.toLowerCase() === myEmail.toLowerCase();

      if (isIWinner && me && me.hp > 0) {
        setBattleState("victory");
        sfx.playVictory();
        const earnedXp = mode === "tournament" ? 350 : mode === "all_members" ? 150 : mode === "group" ? 120 : 90;
        addXp(earnedXp, mode === "tournament" ? "Juara Turnamen Otsutsuki Cup" : `Battle Royale Member (${mode})`);
        advanceDailyQuest("battle", 1);
        if (mode === "tournament") {
          setTournamentWins((prev) => prev + 1);
        }
      } else {
        setBattleState("defeat");
        sfx.playEliminated();
      }
      notifyMatchFinished();
      return;
    }

    setCurrentQIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setTimeLeft(8);
  };

  if (!isOpen) return null;

  const currentQ = shuffledQuestions[currentQIndex];
  const requiredQuota = mode === "1vs1" ? 2 : mode === "tournament" ? 3 : mode === "group" ? 4 : 6;
  const currentParticipants = room?.participants || [];
  const slotsLeft = Math.max(0, requiredQuota - currentParticipants.length);
  const allParticipantsReady =
    currentParticipants.length >= requiredQuota &&
    currentParticipants.every((p) => p.isReady);

  const meInRoom = currentParticipants.find((p) => p.email.toLowerCase() === myEmail.toLowerCase());
  const isRoomOccupiedByOthers =
    !meInRoom && (room?.status === "in_battle" || room?.status === "countdown");

  const p1 = activeCombatants[0] || currentParticipants[0];
  const p2 = activeCombatants[1] || currentParticipants[1];
  const isSameTeamConfrontation = p1 && p2 && p1.team && p2.team && p1.team === p2.team;
  const meCombatant = activeCombatants.find((c) => c.email.toLowerCase() === myEmail.toLowerCase());
  const rivalCombatant = activeCombatants.find((c) => c.email.toLowerCase() !== myEmail.toLowerCase());
  const scoreDifference = (meCombatant?.score || 0) - (rivalCombatant?.score || 0);

  const myParticipant = currentParticipants.find((p) => p.email.toLowerCase() === myEmail.toLowerCase());
  const rivalParticipants = currentParticipants.filter((p) => p.email.toLowerCase() !== myEmail.toLowerCase());
  const myRematchVote = myParticipant?.rematchVote === true;
  const rivalRematchVote = rivalParticipants.length > 0 && rivalParticipants.every((p) => p.rematchVote === true);
  const rivalLeft = isJoined && currentParticipants.length < (mode === "1vs1" ? 2 : mode === "tournament" ? 3 : mode === "group" ? 4 : 6);
  const rematchAgreedCount = currentParticipants.filter((p) => p.rematchVote).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5">
      <div className="clay-card rounded-3xl p-5 sm:p-8 max-w-2xl w-full border border-rose-500/40 relative shadow-2xl flex flex-col gap-6 animate-in zoom-in-95 max-h-[94vh] overflow-y-auto custom-scrollbar">
        {/* CLOSE BUTTON */}
        <button
          onClick={handleCloseModal}
          className="absolute right-5 top-5 p-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:opacity-100 opacity-60 transition"
          title="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* INCOMING CHALLENGE MODAL */}
        {pendingInvite && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-900/90 to-amber-900/90 border-2 border-amber-400 text-white shadow-2xl animate-bounce flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center text-3xl font-black shadow">
                {pendingInvite.fromAvatar || "🥷"}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Tantangan Duel Masuk!
                </span>
                <h4 className="text-sm font-black">{pendingInvite.fromName} Menantang Anda!</h4>
                <p className="text-[11px] opacity-80 font-mono">Kode Room: #{pendingInvite.roomCode}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleAcceptInvite}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Terima & Tanding
              </button>
              <button
                onClick={handleDeclineInvite}
                className="px-3 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-stone-300 font-bold text-xs"
              >
                Tolak
              </button>
            </div>
          </div>
        )}

        {inviteNotification && (
          <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-400 text-blue-300 text-xs font-bold flex items-center gap-2">
            <Radio className="w-4 h-4 animate-ping" /> {inviteNotification}
          </div>
        )}

        {/* LOBBY STATE */}
        {battleState === "lobby" && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 border-b border-current/10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 text-white flex items-center justify-center shadow-lg shrink-0">
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black">Lobi Battle Royale Real-Member</h2>
                  <span className="text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Radio className="w-3 h-3 animate-pulse" /> Live Arena
                  </span>
                </div>
                <p className="text-xs opacity-75 mt-0.5">
                  Tantang siswa online dengan sistem skor Kahoot (kecepatan menjawab menentukan poin bonus)!
                </p>
              </div>
            </div>

            {/* RADAR SISWA ONLINE */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-400">
                  <Radio className="w-4 h-4 animate-pulse" /> Siswa Online di Akademi ({onlineStudents.length})
                </div>
                <span className="text-[10px] font-mono text-emerald-400 opacity-80">Klik untuk ajak duel</span>
              </div>

              {onlineStudents.length === 0 ? (
                <div className="text-center py-2 text-xs opacity-60">Belum ada siswa lain yang online saat ini.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto custom-scrollbar">
                  {onlineStudents.map((stu) => (
                    <div
                      key={stu.email}
                      className="p-2.5 rounded-xl bg-black/10 dark:bg-white/5 border border-current/10 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-xl">{stu.avatar}</span>
                        <div className="overflow-hidden">
                          <div className="text-xs font-black truncate">{stu.name}</div>
                          <span className="text-[9px] font-mono text-emerald-400">Online</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleChallengeStudent(stu)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0"
                      >
                        <Swords className="w-3 h-3" /> Ajak Duel
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* IDENTITAS AKUN */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-500">
                <UserCheck className="w-4 h-4" /> Identitas Akun Siswa
              </div>
              {user ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/10 dark:bg-black/30 border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-xl font-black">
                      {myAvatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-black">{myName || "Siswa Terdaftar"}</h4>
                      <p className="text-[11px] opacity-70 font-mono">{myEmail}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={myName}
                    onChange={(e) => setMyName(e.target.value)}
                    placeholder="Nama lengkap..."
                    className="w-full p-2.5 rounded-xl border border-current/20 bg-white dark:bg-stone-900 text-xs font-bold"
                  />
                  <input
                    type="email"
                    value={myEmail}
                    onChange={(e) => setMyEmail(e.target.value)}
                    placeholder="Email siswa..."
                    className="w-full p-2.5 rounded-xl border border-current/20 bg-white dark:bg-stone-900 text-xs font-mono font-bold"
                  />
                </div>
              )}
            </div>

            {/* KUSTOMISASI SOAL */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-500">
                <Filter className="w-4 h-4" /> Kustomisasi Soal Pertandingan
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <select
                  disabled={isJoined}
                  value={topicLevel}
                  onChange={(e) => handleUpdateTopic(e.target.value as VocabLevel, topicChapter, topicCategory)}
                  className="w-full p-2 rounded-xl border border-current/20 bg-white dark:bg-stone-900 text-xs font-bold"
                >
                  <option value="A2.2">Level A2.2</option>
                  <option value="A2.1">Level A2.1</option>
                  <option value="A1">Level A1</option>
                </select>
                <select
                  disabled={isJoined}
                  value={topicChapter}
                  onChange={(e) => handleUpdateTopic(topicLevel, parseInt(e.target.value, 10), topicCategory)}
                  className="w-full p-2 rounded-xl border border-current/20 bg-white dark:bg-stone-900 text-xs font-bold"
                >
                  <option value={0}>Semua Bab (1 - 18)</option>
                  {Array.from({ length: 18 }, (_, i) => i + 1).map((ch) => (
                    <option key={ch} value={ch}>Bab {ch}</option>
                  ))}
                </select>
                <select
                  disabled={isJoined}
                  value={topicCategory}
                  onChange={(e) => handleUpdateTopic(topicLevel, topicChapter, e.target.value as VocabCategory)}
                  className="w-full p-2 rounded-xl border border-current/20 bg-white dark:bg-stone-900 text-xs font-bold"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.key} value={cat.key}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* AVATAR & ROOM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase opacity-75">
                    Pilih Avatar ({tournamentWins}x Juara 🏆)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTournamentShowcase(true)}
                    className="text-[10px] font-black text-amber-500 hover:underline flex items-center gap-1"
                  >
                    <Trophy className="w-3 h-3" /> Hadiah Turnamen
                  </button>
                </div>

                {/* DEFAULT & EXCLUSIVE AVATARS */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 custom-scrollbar">
                  {/* Default Avatars */}
                  {DEFAULT_AVATARS.map((av) => (
                    <button
                      key={av.emoji}
                      onClick={() => handleSelectAvatar(av.emoji)}
                      title={av.label}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 transition ${
                        myAvatar === av.emoji
                          ? "bg-amber-500 text-black scale-110 shadow-md ring-2 ring-amber-300"
                          : "bg-black/5 dark:bg-white/5 opacity-75 hover:opacity-100"
                      }`}
                    >
                      {av.emoji}
                    </button>
                  ))}

                  {/* Separator */}
                  <div className="w-[1px] h-6 bg-current/20 shrink-0 mx-0.5" />

                  {/* Exclusive Tournament Avatars */}
                  {EXCLUSIVE_TOURNAMENT_AVATARS.map((av) => {
                    const isUnlocked = getTournamentUnlockStatus(tournamentWins).isAvatarUnlocked(av.emoji);
                    return (
                      <button
                        key={av.emoji}
                        disabled={!isUnlocked}
                        onClick={() => isUnlocked && handleSelectAvatar(av.emoji)}
                        title={isUnlocked ? `${av.label} (Terbuka!)` : `🔒 Terkunci: Butuh ${av.winsRequired}x Juara Turnamen`}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 relative transition ${
                          myAvatar === av.emoji
                            ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black scale-110 shadow-lg ring-2 ring-amber-400"
                            : isUnlocked
                            ? "bg-amber-500/20 border border-amber-400/40 opacity-90 hover:opacity-100 hover:scale-105"
                            : "bg-black/10 dark:bg-white/5 opacity-30 cursor-not-allowed grayscale"
                        }`}
                      >
                        {av.emoji}
                        {!isUnlocked && (
                          <span className="absolute -bottom-1 -right-1 text-[9px] bg-black/80 rounded-full px-0.5">
                            🔒
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase opacity-75">Kode Room</span>
                  <button
                    onClick={() => setIsUsingCustomRoom(!isUsingCustomRoom)}
                    className="text-[10px] font-bold text-amber-500 hover:underline"
                  >
                    {isUsingCustomRoom ? "Pakai Lobi Umum" : "Pakai Kode Khusus"}
                  </button>
                </div>
                {isUsingCustomRoom && (
                  <input
                    type="text"
                    value={customRoomCode}
                    onChange={(e) => setCustomRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))}
                    placeholder="Contoh: DUEL01"
                    className="w-full p-2 rounded-xl border border-amber-500/40 bg-white dark:bg-stone-900 text-xs font-mono font-black uppercase"
                  />
                )}
              </div>
            </div>

            {/* MODE SELECTION */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-black/10 dark:bg-white/5 border">
              <button
                onClick={() => handleSelectMode("1vs1")}
                className={`py-2 px-2.5 rounded-xl text-xs font-black transition ${mode === "1vs1" ? "bg-rose-500 text-white" : "opacity-70"}`}
              >
                ⚔️ 1 vs 1 Duel
              </button>
              <button
                onClick={() => handleSelectMode("group")}
                className={`py-2 px-2.5 rounded-xl text-xs font-black transition ${mode === "group" ? "bg-indigo-600 text-white" : "opacity-70"}`}
              >
                🛡️ 2 vs 2 Tim
              </button>
              <button
                onClick={() => handleSelectMode("all_members")}
                className={`py-2 px-2.5 rounded-xl text-xs font-black transition ${mode === "all_members" ? "bg-amber-500 text-stone-950" : "opacity-70"}`}
              >
                👑 Survival
              </button>
              <button
                onClick={() => handleSelectMode("tournament")}
                className={`py-2 px-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                  mode === "tournament"
                    ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 shadow-md font-black ring-2 ring-amber-300"
                    : "opacity-80 text-amber-500 hover:opacity-100"
                }`}
              >
                🏆 Turnamen (3P)
              </button>
            </div>

            {/* TOURNAMENT BANNER IF TOURNAMENT MODE IS ACTIVE */}
            {mode === "tournament" && (
              <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl animate-bounce">🏆</span>
                  <div>
                    <h5 className="text-xs font-black text-amber-500 flex items-center gap-1.5">
                      Turnamen Otsutsuki Cup (3 Peserta • 8 Soal Championship)
                    </h5>
                    <p className="text-[10px] opacity-75">
                      3 peserta bersaing langsung memperebutkan 1 Trofi Juara & membuka avatar eksklusif bertingkat!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTournamentShowcase(true)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-amber-500 text-stone-950 shrink-0 hover:scale-105 transition"
                >
                  Hadiah
                </button>
              </div>
            )}

            {/* JOIN & READY BUTTONS */}
            {!isJoined ? (
              <button
                disabled={loadingAction || !myEmail.trim()}
                onClick={() => handleJoinLobby()}
                className="clay-btn-gold py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                {loadingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                Masuk ke Lobi Pertandingan
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-black">{myName} (Di Lobi)</h4>
                </div>
                <button
                  disabled={loadingAction}
                  onClick={handleToggleReady}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 ${isMyReady ? "bg-emerald-500 text-white" : "clay-btn-gold"
                    }`}
                >
                  {isMyReady ? <CheckCircle2 className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                  {isMyReady ? "SIAP! (Batal)" : "SAYA SIAP!"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* COUNTDOWN STATE */}
        {battleState === "countdown" && (
          <div className="py-8 flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-rose-600/20 border-2 border-rose-500 text-rose-500 flex items-center justify-center text-4xl font-black font-mono animate-pulse">
              {countdownNum}
            </div>
            <p className="text-xs opacity-75">Bersiap menghadapi duel Kahoot kosakatamu!</p>
          </div>
        )}

        {/* IN BATTLE STATE */}
        {battleState === "in_battle" && currentQ && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-black uppercase text-amber-500">
                Ronde {currentQIndex + 1} / {shuffledQuestions.length}
              </span>
              <div className={`px-3 py-1 rounded-xl font-mono font-black text-sm ${timeLeft <= 3 ? "bg-rose-500 text-white animate-bounce" : "bg-black/10 dark:bg-white/10"}`}>
                <Clock className="w-4 h-4 inline mr-1" /> {timeLeft}s
              </div>
            </div>

            {/* COMBATANTS HP */}
            <div className="grid grid-cols-2 gap-2.5">
              {activeCombatants.map((c) => {
                const isMe = c.email.toLowerCase() === myEmail.toLowerCase();
                return (
                  <div key={c.email} className={`p-2.5 rounded-xl border flex flex-col gap-1 ${isMe ? "bg-amber-500/15 border-amber-400" : "bg-black/10"}`}>
                    <div className="flex justify-between text-xs font-black">
                      <span>{c.avatar} {c.name.split(" ")[0]}</span>
                      <span className="text-amber-400 font-mono">{c.score} PTS</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* QUESTION */}
            <div className="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border text-center">
              <span className="text-[10px] font-black uppercase text-amber-500">Tentukan Arti Kosakata</span>
              <h3 className="text-2xl sm:text-3xl font-black mt-1">{currentQ.ja}</h3>
              {currentQ.yomi && <span className="text-xs font-mono text-amber-400 block mt-1">{currentQ.yomi}</span>}
            </div>

            {/* OPTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleUserAnswer(opt)}
                  className="clay-btn p-3.5 rounded-xl text-xs font-bold text-left transition"
                >
                  <span className="font-mono text-amber-400 mr-2 font-black">{String.fromCharCode(65 + idx)}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VICTORY & DEFEAT STATE */}
        {(battleState === "victory" || battleState === "defeat") && (
          <div className="text-center py-4 flex flex-col items-center gap-5">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl ${battleState === "victory" ? "bg-amber-500/20 text-amber-400 border animate-bounce" : "bg-rose-500/20 text-rose-500 border"}`}>
              {battleState === "victory" ? (mode === "tournament" ? "🏆" : "👑") : "💀"}
            </div>

            {mode === "tournament" && battleState === "victory" ? (
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent animate-pulse">
                  JUARA TURNAMEN OTSUTSUKI CUP!
                </h2>
                <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/50 max-w-sm w-full flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> Total Piala Turnamen Anda
                    </span>
                    <span className="text-xs font-black font-mono bg-amber-500 text-stone-950 px-2 py-0.5 rounded-lg">
                      {tournamentWins}x Juara 🏆
                    </span>
                  </div>
                  <p className="text-[11px] opacity-80 text-left">
                    Selamat! Trofi kejuaraan telah disimpan di database Neon! Cek avatar & badge eksklusif baru yang berhasil Anda unlock!
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowTournamentShowcase(true)}
                    className="text-xs font-black text-amber-400 hover:underline flex items-center justify-center gap-1 pt-1.5 border-t border-amber-400/20"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Buka Galeri Hadiah Eksklusif
                  </button>
                </div>
              </div>
            ) : (
              <h2 className="text-2xl font-black">{battleState === "victory" ? "CHAMPION ARENA!" : "Kekalahan Duel"}</h2>
            )}

            <div className="flex gap-3 w-full max-w-sm">
              <button
                onClick={handleRequestRematch}
                className="flex-1 clay-btn-gold py-2.5 rounded-xl font-black text-xs uppercase"
              >
                <RotateCcw className="w-4 h-4 inline mr-1" /> Rematch
              </button>
              <button
                onClick={handleReturnToLobby}
                className="flex-1 clay-btn py-2.5 rounded-xl font-bold text-xs"
              >
                <LogOut className="w-4 h-4 inline mr-1" /> Lobi
              </button>
            </div>
          </div>
        )}

        {/* TOURNAMENT REWARDS MODAL OVERLAY */}
        {showTournamentShowcase && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-5">
            <div className="clay-card rounded-3xl p-5 sm:p-7 max-w-lg w-full border border-amber-500/50 shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between border-b border-current/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">🏆</span>
                  <div>
                    <h3 className="text-base font-black text-amber-500">
                      Penghargaan Eksklusif Turnamen
                    </h3>
                    <p className="text-[11px] opacity-75">
                      Raih kemenangan turnamen bertingkat untuk membuka seluruh avatar & badge legendaris!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTournamentShowcase(false)}
                  className="p-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:opacity-100 opacity-60 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CURRENT USER TOURNAMENT PROGRESS */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-black uppercase opacity-75">Koleksi Trofi Anda</div>
                  <div className="text-base font-black text-amber-500 flex items-center gap-1.5 mt-0.5">
                    <Trophy className="w-4 h-4" /> {tournamentWins}x Juara Turnamen
                  </div>
                  <div className="text-[10px] opacity-75 mt-0.5">
                    Gelar: <span className="font-bold text-amber-400">{getTournamentUnlockStatus(tournamentWins).currentTitle}</span>
                  </div>
                </div>
                {getTournamentUnlockStatus(tournamentWins).nextTier ? (
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-emerald-400">
                      {getTournamentUnlockStatus(tournamentWins).winsToNextTier}x Menang Lagi
                    </span>
                    <div className="text-[10px] opacity-60">
                      Menuju {getTournamentUnlockStatus(tournamentWins).nextTier?.tierName}
                    </div>
                  </div>
                ) : (
                  <div className="text-right text-[10px] font-bold text-purple-400">
                    Tier Tertinggi Tercapai! 🌌
                  </div>
                )}
              </div>

              {/* REWARD TIERS LIST */}
              <div className="space-y-3">
                {TOURNAMENT_REWARD_TIERS.map((tier) => {
                  const isUnlocked = tournamentWins >= tier.winsRequired;
                  return (
                    <div
                      key={tier.tierNumber}
                      className={`p-3.5 rounded-2xl border transition flex flex-col gap-2.5 ${
                        isUnlocked
                          ? "bg-amber-500/10 border-amber-500/40"
                          : "bg-black/5 dark:bg-white/5 border-current/10 opacity-70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tier.badge.icon}</span>
                          <div>
                            <h4 className="text-xs font-black flex items-center gap-1.5">
                              <span>Tier {tier.tierNumber}: {tier.tierName}</span>
                              {isUnlocked && (
                                <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded">
                                  TERBUKA
                                </span>
                              )}
                            </h4>
                            <p className="text-[10px] opacity-70">
                              Syarat: {tier.winsRequired}x Kemenangan Turnamen
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-black font-mono px-2 py-0.5 rounded-lg bg-black/10 dark:bg-white/10">
                          {tier.winsRequired}x 🏆
                        </span>
                      </div>

                      {/* AVATARS UNLOCKED IN THIS TIER */}
                      <div className="pt-2 border-t border-current/10 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold opacity-75">Avatar:</span>
                          <div className="flex items-center gap-1.5">
                            {tier.avatars.map((av) => (
                              <span
                                key={av.emoji}
                                title={`${av.label} - ${av.desc}`}
                                className={`text-xl p-1 rounded-lg ${
                                  isUnlocked ? "bg-amber-500/20" : "grayscale opacity-40"
                                }`}
                              >
                                {av.emoji}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* BADGE */}
                        <div className="flex items-center gap-1.5 text-right">
                          <span className="text-[10px] font-bold opacity-75">Badge:</span>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${
                              isUnlocked
                                ? "bg-amber-500/20 border-amber-400 text-amber-400"
                                : "bg-black/10 border-current/10 opacity-50"
                            }`}
                          >
                            {tier.badge.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowTournamentShowcase(false)}
                className="clay-btn-gold py-2.5 rounded-xl text-xs font-black uppercase"
              >
                Tutup Galeri
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}