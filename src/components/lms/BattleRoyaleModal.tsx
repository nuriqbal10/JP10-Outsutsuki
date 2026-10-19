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
      } catch (e) {}
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
      } catch (e) {}
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

  // 2. POLL LOBBY STATUS (PREVENTS PAGE CLASH: Only joins match if user is in room)
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

        // Check user identity in room
        const meInRoom = data.room.participants.find((p: Participant) => p.email.toLowerCase() === myEmail.toLowerCase());
        if (meInRoom) {
          setIsJoined(true);
          setIsMyReady(meInRoom.isReady);
          if (meInRoom.team) setMyTeam(meInRoom.team);
          if (meInRoom.avatar) setMyAvatar(meInRoom.avatar);

          // CRITICAL: Start countdown if room is in countdown (either from lobby start OR agreed rematch)
          if (
            data.room.status === "countdown" &&
            (battleState === "lobby" || battleState === "victory" || battleState === "defeat") &&
            meInRoom.isReady
          ) {
            triggerLobbyCountdown(data.room);
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
      // Poll in lobby, and also in victory/defeat to listen for opponent rematch or exit
      if (battleState === "lobby" || battleState === "victory" || battleState === "defeat") {
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
    } catch (e) {}
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
    } catch (e) {}
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
      } catch (e) {}
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
      } catch (e) {}
    }
  };

  // 3. SEND DIRECT CHALLENGE TO ONLINE FRIEND
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

      // Join the duel room immediately
      await handleJoinLobby(randomCode);
      sfx.playSlash();
      setTimeout(() => setInviteNotification(null), 5000);
    } catch (e) {
      setActionError("Gagal mengirim undangan duel.");
    }
  };

  // 4. ACCEPT INCOMING CHALLENGE
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
    } catch (e) {}
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
    } catch (e) {}
  };

  // 5. START COUNTDOWN & MATCH
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
    const questions = generateBattleQuestions({
      level: currentRoom.topicLevel || topicLevel,
      chapter: currentRoom.topicChapter !== undefined ? currentRoom.topicChapter : topicChapter,
      category: currentRoom.topicCategory || topicCategory,
      count: 5,
    });

    setShuffledQuestions(questions);
    setCurrentQIndex(0);
    setTimeLeft(8);
    setSelectedAnswer(null);

    const topicLabel = `[${currentRoom.topicLevel || "A2.2"} • ${
      currentRoom.topicChapter ? `Bab ${currentRoom.topicChapter}` : "Semua Bab"
    } • ${currentRoom.topicCategory?.toUpperCase() || "ACAK"}]`;

    setBattleLog([`🔥 PERTANDINGAN DIMULAI! Topik: ${topicLabel}`]);
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
    } catch (e) {}
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

  const handleCancelRematch = async () => {
    setLoadingAction(true);
    try {
      await fetch("/api/battle-lobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel_rematch",
          mode,
          roomCode: currentActiveRoomCode,
          email: myEmail,
        }),
      });
      fetchLobbyStatus(mode, currentActiveRoomCode, true);
    } catch (e) {} finally {
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
    } catch (e) {}
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
      } catch (e) {}
    }
    setIsJoined(false);
    setIsMyReady(false);
    setBattleState("lobby");
    onClose();
  };

  const checkBattleOver = () => {
    const me = activeCombatants.find((c) => c.email.toLowerCase() === myEmail.toLowerCase());
    const others = activeCombatants.filter((c) => c.email.toLowerCase() !== myEmail.toLowerCase());
    const othersAlive = others.filter((c) => c.hp > 0).length;

    if (me && me.hp <= 0) {
      setBattleState("defeat");
      sfx.playEliminated();
      notifyMatchFinished();
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
      notifyMatchFinished();
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

  // Check if room is busy with another ongoing battle and user is NOT a participant
  const meInRoom = currentParticipants.find((p) => p.email.toLowerCase() === myEmail.toLowerCase());
  const isRoomOccupiedByOthers =
    !meInRoom && (room?.status === "in_battle" || room?.status === "countdown");

  // HEAD TO HEAD CALCULATION
  const p1 = activeCombatants[0] || currentParticipants[0];
  const p2 = activeCombatants[1] || currentParticipants[1];
  const isSameTeamConfrontation = p1 && p2 && p1.team && p2.team && p1.team === p2.team;
  const meCombatant = activeCombatants.find((c) => c.email.toLowerCase() === myEmail.toLowerCase());
  const rivalCombatant = activeCombatants.find((c) => c.email.toLowerCase() !== myEmail.toLowerCase());
  const scoreDifference = (meCombatant?.score || 0) - (rivalCombatant?.score || 0);

  // REMATCH CALCULATIONS (Keduanya harus setuju)
  const myParticipant = currentParticipants.find((p) => p.email.toLowerCase() === myEmail.toLowerCase());
  const rivalParticipants = currentParticipants.filter((p) => p.email.toLowerCase() !== myEmail.toLowerCase());
  const myRematchVote = myParticipant?.rematchVote === true;
  const rivalRematchVote = rivalParticipants.length > 0 && rivalParticipants.every((p) => p.rematchVote === true);
  const rivalLeft = isJoined && currentParticipants.length < (mode === "1vs1" ? 2 : mode === "group" ? 4 : 6);
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

        {/* ================= INCOMING CHALLENGE MODAL (Direct Invite Alert) ================= */}
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

        {/* TOAST NOTIFIKASI UNDANGAN */}
        {inviteNotification && (
          <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-400 text-blue-300 text-xs font-bold flex items-center gap-2">
            <Radio className="w-4 h-4 animate-ping" /> {inviteNotification}
          </div>
        )}

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
                    <Radio className="w-3 h-3 animate-pulse" /> Live Arena
                  </span>
                </div>
                <p className="text-xs opacity-75 mt-0.5">
                  Tantang siswa yang sedang online, tentukan materi soal, dan tanding Head-to-Head secara real-time!
                </p>
              </div>
            </div>

            {/* PERINGATAN BILA ROOM SEDANG DIPAKAI ORANG LAIN */}
            {isRoomOccupiedByOthers && (
              <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
                  <div>
                    <h4 className="text-xs font-black text-rose-500 uppercase">Room Ini Sedang Berlangsung</h4>
                    <p className="text-[11px] opacity-80">
                      Ada anggota lain yang sedang bertanding di room ini. Gunakan kode room khusus untuk bertanding berdua!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newCode = `DUEL${Math.floor(100 + Math.random() * 900)}`;
                    setIsUsingCustomRoom(true);
                    setCustomRoomCode(newCode);
                    lastSeenUpdatedAtRef.current = 0;
                    fetchLobbyStatus(mode, newCode, true);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500 text-white font-black text-xs uppercase tracking-wider shrink-0 hover:bg-rose-400"
                >
                  Buat Room Baru
                </button>
              </div>
            )}

            {/* 1. RADAR SISWA ONLINE SAAT INI (GAME FRIEND INVITATION) */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-400">
                  <Radio className="w-4 h-4 animate-pulse" /> Siswa Online di Akademi ({onlineStudents.length})
                </div>
                <span className="text-[10px] font-mono text-emerald-400 opacity-80">Klik untuk langsung ajak duel</span>
              </div>

              {onlineStudents.length === 0 ? (
                <div className="text-center py-2 text-xs opacity-60 font-sans">
                  Belum ada siswa lain yang online saat ini. Bagikan link web ke teman sekelas Anda!
                </div>
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
                          <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
                            {stu.status === "in_battle" ? "Sedang Tanding" : stu.status === "in_lobby" ? "Di Lobi" : "Online"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleChallengeStudent(stu)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 transition"
                      >
                        <Swords className="w-3 h-3" /> Ajak Duel
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. IDENTITAS AKUN LOGIN (OTENTIKASI SISWA) */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-500">
                  <UserCheck className="w-4 h-4" />
                  {user ? "Akun Terverifikasi (Clerk SSO)" : "Identitas Akun Siswa Mandiri"}
                </div>
                {user && (
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Logged In
                  </span>
                )}
              </div>

              {user ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/10 dark:bg-black/30 border border-current/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-xl font-black">
                      {myAvatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-black">{myName || "Siswa Terdaftar"}</h4>
                      <p className="text-[11px] opacity-70 font-mono">{myEmail}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg">
                    Akun Anda
                  </span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] uppercase font-black opacity-70 block mb-1">Nama Siswa</label>
                    <input
                      type="text"
                      disabled={isJoined}
                      value={myName}
                      onChange={(e) => setMyName(e.target.value)}
                      placeholder="Nama lengkap Anda..."
                      className="w-full p-2.5 rounded-xl border border-current/20 bg-white dark:bg-stone-900 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black opacity-70 block mb-1">Email Resmi</label>
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

            {/* 3. KUSTOMISASI SOAL: LEVEL, BAB, & KATEGORI KATA */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-500">
                  <Filter className="w-4 h-4" /> Kustomisasi Soal Pertandingan
                </div>
                <span className="text-[10px] font-mono opacity-70">
                  Bank Soal: 4.245 Kosakata Irodori
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] uppercase font-black opacity-75 block mb-1">Level Materi</label>
                  <select
                    disabled={isJoined}
                    value={topicLevel}
                    onChange={(e) => handleUpdateTopic(e.target.value as VocabLevel, topicChapter, topicCategory)}
                    className="w-full p-2 rounded-xl border border-current/20 bg-white dark:bg-stone-900 text-xs font-bold font-sans"
                  >
                    <option value="A2.2">Level A2.2 (Target Saat Ini)</option>
                    <option value="A2.1">Level A2.1 (Dasar 1)</option>
                    <option value="A1">Level A1 (Pemula)</option>
                    <option value="all">Semua Level (Campuran)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black opacity-75 block mb-1">Pilihan Bab</label>
                  <select
                    disabled={isJoined}
                    value={topicChapter}
                    onChange={(e) => handleUpdateTopic(topicLevel, parseInt(e.target.value, 10), topicCategory)}
                    className="w-full p-2 rounded-xl border border-current/20 bg-white dark:bg-stone-900 text-xs font-bold font-sans"
                  >
                    <option value={0}>Semua Bab (Bab 1 - 18 Acak)</option>
                    {Array.from({ length: 18 }, (_, i) => i + 1).map((ch) => (
                      <option key={ch} value={ch}>
                        Bab {ch} (課 {ch})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-black opacity-75 block mb-1">Kategori Kelas Kata</label>
                  <select
                    disabled={isJoined}
                    value={topicCategory}
                    onChange={(e) => handleUpdateTopic(topicLevel, topicChapter, e.target.value as VocabCategory)}
                    className="w-full p-2 rounded-xl border border-current/20 bg-white dark:bg-stone-900 text-xs font-bold font-sans"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 4. AVATAR & ROOM SELECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase opacity-75">Tentukan Avatar Shinobi</span>
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
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        disabled={isJoined}
                        value={customRoomCode}
                        onChange={(e) => setCustomRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            lastSeenUpdatedAtRef.current = 0;
                            fetchLobbyStatus(mode, customRoomCode.trim().toUpperCase(), true);
                          }
                        }}
                        placeholder="Ketik Kode: A22 / DUEL01"
                        className="flex-1 p-2 rounded-xl border border-amber-500/40 bg-white dark:bg-stone-900 text-xs font-mono font-black uppercase"
                      />
                      <button
                        type="button"
                        disabled={isJoined || !customRoomCode.trim()}
                        onClick={() => {
                          lastSeenUpdatedAtRef.current = 0;
                          fetchLobbyStatus(mode, customRoomCode.trim().toUpperCase(), true);
                        }}
                        className="px-3 py-2 rounded-xl bg-amber-500 text-stone-950 text-[10px] font-black uppercase disabled:opacity-50 hover:bg-amber-400 transition"
                      >
                        Cari Room
                      </button>
                    </div>
                    {customRoomCode.trim() && (
                      <span className="text-[10px] font-mono text-amber-500 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Target Room: #{customRoomCode.trim().toUpperCase()}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-xs font-bold py-1.5 opacity-80 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                    Lobi Publik Bersama (Semua Siswa)
                  </div>
                )}
              </div>
            </div>

            {/* 5. MODE SELECTION TABS */}
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

            {/* OPSI PILIH TIM */}
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

            {/* 6. ACTIONS BAR: MASUK LOBI / SAYA SIAP */}
            {!isJoined ? (
              <div className="flex flex-col gap-2">
                <button
                  disabled={loadingAction || !myEmail.trim() || isRoomOccupiedByOthers}
                  onClick={() => handleJoinLobby()}
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
                      {mode === "group" ? `Kubu: Tim ${myTeam.toUpperCase()}` : `Room: #${room?.roomCode || mode}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
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

            {/* 7. WAITING ROOM HUD & REAL-TIME PESERTA */}
            <div className="p-5 rounded-3xl bg-black/5 dark:bg-black/30 border border-current/10 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-current/10 pb-3 gap-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase">
                  <Users className="w-4 h-4 text-amber-500" />
                  Peserta Terkumpul: <span className="text-amber-500">{currentParticipants.length}</span> / {requiredQuota}
                  <span className="text-[11px] font-mono opacity-60 ml-1">
                    (Room: #{room?.roomCode || mode.toUpperCase()})
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

              {/* PETUNJUK */}
              <div className="text-[11px] opacity-75 text-center mt-1">
                💡 Bagikan kode room <span className="font-mono font-bold text-amber-400">#{room?.roomCode || mode.toUpperCase()}</span> ke teman Anda, atau klik tombol <b>Ajak Duel</b> pada radar siswa online di atas!
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: COUNTDOWN & HEAD TO HEAD DERBY SHOWCASE ================= */}
        {battleState === "countdown" && (
          <div className="py-8 flex flex-col items-center justify-center gap-6 text-center animate-in zoom-in-95">
            {/* HEAD TO HEAD BANNER */}
            <div className="w-full p-4 rounded-3xl bg-gradient-to-r from-rose-950/60 via-amber-950/40 to-blue-950/60 border border-amber-500/40 flex flex-col items-center gap-4 shadow-xl">
              <span className="text-xs font-black uppercase text-amber-400 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500 animate-bounce" />
                {isSameTeamConfrontation
                  ? `DERBY HEAD TO HEAD (SESAMA TIM ${p1?.team?.toUpperCase()})`
                  : "HEAD TO HEAD CONFRONTATION"}
              </span>

              {/* VERSUS MATCHUP CARD */}
              <div className="flex items-center justify-around w-full gap-2">
                {/* FIGHTER 1 */}
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center text-3xl shadow-lg">
                    {p1?.avatar || "🥷"}
                  </div>
                  <h4 className="text-sm font-black truncate max-w-[120px]">{p1?.name || "Player 1"}</h4>
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                    Tim {p1?.team || "Shinobi"}
                  </span>
                </div>

                {/* CENTER VS EMBLEM */}
                <div className="flex flex-col items-center gap-1 shrink-0 px-2">
                  <div className="w-12 h-12 rounded-full bg-rose-600 border-2 border-amber-300 text-white flex items-center justify-center font-black text-lg shadow-xl animate-pulse">
                    VS
                  </div>
                  <span className="text-[9px] font-mono font-bold opacity-75">1 ON 1 DUEL</span>
                </div>

                {/* FIGHTER 2 */}
                <div className="flex flex-col items-center gap-1.5 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-3xl shadow-lg">
                    {p2?.avatar || "⚔️"}
                  </div>
                  <h4 className="text-sm font-black truncate max-w-[120px]">{p2?.name || "Player 2"}</h4>
                  <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">
                    Tim {p2?.team || "Samurai"}
                  </span>
                </div>
              </div>

              {isSameTeamConfrontation && (
                <div className="text-[11px] font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-xl">
                  ⚔️ Pertarungan Sesama Saudara Seperguruan! Buktikan siapa ninja terhebat di kelas!
                </div>
              )}
            </div>

            {/* COUNTDOWN TIMER */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full bg-rose-600/20 border-2 border-rose-500 text-rose-500 flex items-center justify-center text-4xl font-black font-mono shadow-2xl animate-pulse">
                {countdownNum}
              </div>
              <p className="text-xs opacity-75">Ronde 1 akan segera dimulai. Bersiaplah!</p>
            </div>
          </div>
        )}

        {/* ================= STEP 3: ARENA PERTANDINGAN AKTIF ================= */}
        {battleState === "in_battle" && currentQ && (
          <div className="flex flex-col gap-5 animate-in fade-in">
            {/* HEAD TO HEAD LIVE SCORE TRACKER */}
            {meCombatant && rivalCombatant && (
              <div className="p-3 rounded-2xl bg-black/20 border border-current/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meCombatant.avatar}</span>
                  <span className="font-bold truncate max-w-[90px]">{meCombatant.name.split(" ")[0]} (Anda)</span>
                  <span className="font-mono text-amber-400 font-black">{meCombatant.score} PTS</span>
                </div>

                <div className="text-[10px] font-black uppercase text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                  {scoreDifference === 0
                    ? "SKOR IMBANG ⚔️"
                    : scoreDifference > 0
                    ? `+${scoreDifference} UNGGUL 🔥`
                    : `${scoreDifference} TERTINGGAL ⚠️`}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-amber-400 font-black">{rivalCombatant.score} PTS</span>
                  <span className="font-bold truncate max-w-[90px]">{rivalCombatant.name.split(" ")[0]}</span>
                  <span className="text-lg">{rivalCombatant.avatar}</span>
                </div>
              </div>
            )}

            {/* TOP ARENA HUD */}
            <div className="flex items-center justify-between border-b border-current/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-500">
                  Ronde {currentQIndex + 1} / {shuffledQuestions.length}
                </span>
                <span className="text-[11px] font-mono opacity-50">• {mode.toUpperCase()}</span>
                {currentQ.level && (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                    {currentQ.level} Bab {currentQ.chapter}
                  </span>
                )}
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
              {currentQ.yomi && currentQ.yomi !== currentQ.ja && (
                <span className="text-xs font-mono opacity-80 text-amber-400">{currentQ.yomi}</span>
              )}
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

        {/* ================= STEP 4 & 5: RESULTS SCREEN (VICTORY & DEFEAT) ================= */}
        {(battleState === "victory" || battleState === "defeat") && (
          <div className="text-center py-4 flex flex-col items-center gap-5 animate-in zoom-in-95">
            {/* BADGE & TITLE */}
            <div className="flex flex-col items-center gap-2">
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-2xl ${
                  battleState === "victory"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-400/50 animate-bounce"
                    : "bg-rose-500/20 text-rose-500 border border-rose-500/50"
                }`}
              >
                {battleState === "victory" ? "👑" : "💀"}
              </div>

              <span
                className={`text-[11px] font-black uppercase px-3 py-1 rounded-full border ${
                  battleState === "victory"
                    ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                    : "text-rose-400 bg-rose-500/10 border-rose-500/30"
                }`}
              >
                {battleState === "victory" ? "Kemenangan Mutlak! • 1 Match Selesai" : "Gugur di Medan Laga • 1 Match Selesai"}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black">
                {battleState === "victory" ? "CHAMPION ARENA!" : "Kekalahan Duel"}
              </h2>

              <p className="text-xs opacity-75 max-w-md">
                {battleState === "victory"
                  ? "Selamat! Anda memenangkan duel Head-to-Head 1 match ini dengan gemilang!"
                  : "Lawan Anda berhasil memimpin skor pada match ini. Tingkatkan hafalan kosakata Anda!"}
              </p>

              {battleState === "victory" && (
                <div className="inline-block mt-1 px-4 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
                  +{mode === "all_members" ? 150 : mode === "group" ? 120 : 90} XP Ditambahkan ke Akun!
                </div>
              )}
            </div>

            {/* COMBATANTS FINAL SCORE SUMMARY CARD */}
            <div className="w-full max-w-lg p-3.5 rounded-2xl bg-black/10 dark:bg-white/5 border border-current/10 flex flex-col gap-2">
              <div className="text-[10px] font-black uppercase tracking-wider opacity-60 text-center">
                Ringkasan Skor Akhir 1 Match
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Me */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col items-center gap-1">
                  <span className="text-2xl">{myAvatar}</span>
                  <span className="text-xs font-black truncate max-w-full">
                    {myName || myEmail.split("@")[0]} (Anda)
                  </span>
                  <span className="text-base font-black font-mono text-amber-400">
                    {meCombatant?.score || 0} PTS
                  </span>
                  <span className="text-[10px] font-mono opacity-70">
                    Sisa HP: {Math.max(0, meCombatant?.hp || 0)}%
                  </span>
                </div>

                {/* Rival */}
                <div className="p-3 rounded-xl bg-black/20 dark:bg-black/40 border border-current/10 flex flex-col items-center gap-1">
                  <span className="text-2xl">{rivalCombatant?.avatar || "⚔️"}</span>
                  <span className="text-xs font-black truncate max-w-full">
                    {rivalCombatant?.name || "Lawan"}
                  </span>
                  <span className="text-base font-black font-mono text-amber-400">
                    {rivalCombatant?.score || 0} PTS
                  </span>
                  <span className="text-[10px] font-mono opacity-70">
                    Sisa HP: {Math.max(0, rivalCombatant?.hp || 0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* REMATCH CONSENT & AGREEMENT BOX (Keduanya Harus Setuju) */}
            <div className="w-full max-w-lg flex flex-col gap-3">
              {actionError && (
                <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" /> {actionError}
                </div>
              )}

              {/* KONDISI 1: Lawan telah keluar / meninggalkan arena */}
              {rivalLeft ? (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2">
                  <p className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Lawan telah meninggalkan arena atau kembali ke lobi.
                  </p>
                  <p className="text-[11px] opacity-75">
                    Match telah selesai. Silakan kembali ke lobi untuk memilih lawan atau bab materi lain.
                  </p>
                  <button
                    onClick={handleReturnToLobby}
                    disabled={loadingAction}
                    className="clay-btn-gold w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow"
                  >
                    <LogOut className="w-4 h-4" /> Kembali ke Lobi Utama
                  </button>
                </div>
              ) : myRematchVote && !rivalRematchVote ? (
                /* KONDISI 2: Anda sudah meminta rematch, sedang menunggu konfirmasi lawan */
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-purple-950/60 border border-amber-400/40 text-center space-y-3 animate-pulse">
                  <div className="flex items-center justify-center gap-2 text-xs font-black text-amber-300">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menunggu Persetujuan Lawan ({rematchAgreedCount}/{room?.requiredCount || 2} Setuju)
                  </div>
                  <p className="text-[11px] opacity-80">
                    Permintaan rematch telah terkirim. Pertandingan ulang akan dimulai otomatis begitu lawan menekan tombol setuju.
                  </p>
                  <button
                    onClick={handleReturnToLobby}
                    disabled={loadingAction}
                    className="clay-btn w-full py-2 rounded-xl text-xs font-bold opacity-80 hover:opacity-100 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Batal & Kembali ke Lobi
                  </button>
                </div>
              ) : rivalRematchVote && !myRematchVote ? (
                /* KONDISI 3: Lawan mengajak rematch, meminta persetujuan Anda */
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-teal-950/70 border-2 border-emerald-400 text-center space-y-3 shadow-xl animate-bounce">
                  <div className="flex items-center justify-center gap-2 text-xs font-black text-emerald-300 uppercase tracking-wide">
                    <Swords className="w-4 h-4" /> Lawan Mengajak Rematch! (1/2 Setuju)
                  </div>
                  <p className="text-xs font-medium text-stone-200">
                    <span className="font-bold text-amber-300">{rivalCombatant?.name || "Lawan"}</span> ingin bertanding ulang 1 match lagi. Apakah Anda setuju?
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <button
                      onClick={handleRequestRematch}
                      disabled={loadingAction}
                      className="w-full sm:flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition hover:scale-105"
                    >
                      {loadingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Setuju & Mulai Rematch!
                    </button>
                    <button
                      onClick={handleReturnToLobby}
                      disabled={loadingAction}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-black/40 hover:bg-black/60 text-stone-300 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Tolak & Kembali
                    </button>
                  </div>
                </div>
              ) : (
                /* KONDISI 4: Belum ada yang meminta rematch - tampilkan opsi Minta Rematch & Kembali ke Lobi */
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleRequestRematch}
                      disabled={loadingAction}
                      className="w-full sm:flex-1 clay-btn-gold py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition"
                    >
                      {loadingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                      Minta Rematch (Tanding Ulang)
                    </button>
                    <button
                      onClick={handleReturnToLobby}
                      disabled={loadingAction}
                      className="w-full sm:flex-1 clay-btn py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Kembali ke Lobi
                    </button>
                  </div>
                  <p className="text-[10px] opacity-65 text-center">
                    💡 Match selesai (1 match). Jika memilih Rematch, kedua siswa harus sama-sama setuju sebelum match baru dimulai.
                  </p>
                </div>
              )}
            </div>

            {/* TUTUP ARENA */}
            <div className="pt-2">
              <button
                onClick={handleCloseModal}
                className="text-xs opacity-60 hover:opacity-100 transition underline underline-offset-4 flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5" /> Tutup Arena
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
