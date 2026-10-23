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

export interface TournamentMatchState {
  id: string; // "qf_1", "qf_2", "qf_3", "qf_4", "sf_1", "sf_2", "final"
  round: "qf" | "sf" | "final";
  matchLabel: string;
  p1: Participant;
  p2: Participant;
  score1: number;
  score2: number;
  winnerEmail?: string | null;
  winner?: Participant | null;
  status: "pending" | "in_battle" | "finished";
}

interface Participant {
  email: string;
  name: string;
  avatar: string;
  team?: "shinobi" | "samurai";
  joinedAt: number;
  score: number;
  hp: number;
  isReady: boolean;
  isHost?: boolean;
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
  { key: "bunpou_puzzle", label: "Puzzle Pola Kalimat (IRODORI 文法)", icon: "🧩" },
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

  const timeRatio = Math.max(0, Math.min(1, timeLeftSeconds / maxTimeSeconds));
  // 500 poin dasar + hingga 500 poin bonus kecepatan
  return Math.round(500 + (500 * timeRatio));
}

function getQuestionTimeLimit(category?: string, question?: BattleQuestion): number {
  return category === "bunpou_puzzle" || question?.pos === "bunpou_puzzle" ? 30 : 8;
}

export default function BattleRoyaleModal({
  isOpen,
  onClose,
  initialMode = "1vs1",
  initialCategory,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: BattleMode;
  initialCategory?: VocabCategory;
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
  const [topicCategory, setTopicCategory] = useState<VocabCategory>(initialCategory || "all");

  useEffect(() => {
    if (initialCategory) {
      setTopicCategory(initialCategory);
    }
  }, [initialCategory]);

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
  const [tournamentBracket, setTournamentBracket] = useState<TournamentMatchState[] | null>(null);
  const [currentTournamentRound, setCurrentTournamentRound] = useState<"qf" | "sf" | "final">("qf");
  const [showBracketModal, setShowBracketModal] = useState<boolean>(false);
  const [tournamentChampion, setTournamentChampion] = useState<Participant | null>(null);
  const [tournamentRoundModal, setTournamentRoundModal] = useState<{
    show: boolean;
    type: "advancing" | "eliminated";
    roundWon: "qf" | "sf";
    myScore: number;
    oppScore: number;
    opponentName: string;
    nextOpponent?: Participant;
  } | null>(null);

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
            if (mode !== "tournament") {
              setActiveCombatants(data.room.participants);
            }
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

  // Start Battle (Room Master Only)
  const handleStartBattle = async () => {
    setLoadingAction(true);
    setActionError(null);
    try {
      const res = await fetch("/api/battle-lobby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start_battle",
          mode,
          roomCode: currentActiveRoomCode,
          email: myEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setActionError(data.error || "Gagal memulai pertandingan.");
        sfx.playWrong();
        return;
      }

      if (data.room) {
        setRoom(data.room);
        lastSeenUpdatedAtRef.current = data.room.updatedAt || Date.now();
        if (data.room.status === "countdown") {
          triggerLobbyCountdown(data.room);
        }
      }
    } catch (e: any) {
      setActionError("Gagal menghubungi server untuk memulai duel.");
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

  const initTournamentBracket = (participantsList: Participant[]) => {
    const pool = [...participantsList];
    const botRoster = [
      { name: "Sasuke Uchiha", avatar: "⚡" },
      { name: "Kakashi Hatake", avatar: "🥷" },
      { name: "Itachi Uchiha", avatar: "🦅" },
      { name: "Minato Namikaze", avatar: "🦊" },
      { name: "Hinata Hyuuga", avatar: "🌸" },
      { name: "Gaara Sabaku", avatar: "🌪️" },
      { name: "Shikamaru Nara", avatar: "♟️" },
      { name: "Jiraiya Sensei", avatar: "🐸" },
    ];

    let bIdx = 0;
    while (pool.length < 8) {
      const bot = botRoster[bIdx % botRoster.length];
      pool.push({
        email: `bot_${bIdx + 1}@shinobi.otsutsuki`,
        name: bot.name,
        avatar: bot.avatar,
        joinedAt: Date.now(),
        score: 0,
        hp: 100,
        isReady: true,
        isHost: false,
      });
      bIdx++;
    }

    // Acak peserta untuk pasangan 1 vs 1 (CUP Bracket)
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const qfMatches: TournamentMatchState[] = [
      {
        id: "qf_1",
        round: "qf",
        matchLabel: "Babak 8 Besar #1",
        p1: shuffled[0],
        p2: shuffled[1],
        score1: 0,
        score2: 0,
        status: "in_battle",
      },
      {
        id: "qf_2",
        round: "qf",
        matchLabel: "Babak 8 Besar #2",
        p1: shuffled[2],
        p2: shuffled[3],
        score1: 0,
        score2: 0,
        status: "in_battle",
      },
      {
        id: "qf_3",
        round: "qf",
        matchLabel: "Babak 8 Besar #3",
        p1: shuffled[4],
        p2: shuffled[5],
        score1: 0,
        score2: 0,
        status: "in_battle",
      },
      {
        id: "qf_4",
        round: "qf",
        matchLabel: "Babak 8 Besar #4",
        p1: shuffled[6],
        p2: shuffled[7],
        score1: 0,
        score2: 0,
        status: "in_battle",
      },
    ];

    const sfMatches: TournamentMatchState[] = [
      {
        id: "sf_1",
        round: "sf",
        matchLabel: "Semifinal #1",
        p1: { name: "Pemenang QF 1", avatar: "⏳", email: "pending_sf1_1", joinedAt: 0, score: 0, hp: 100, isReady: false },
        p2: { name: "Pemenang QF 2", avatar: "⏳", email: "pending_sf1_2", joinedAt: 0, score: 0, hp: 100, isReady: false },
        score1: 0,
        score2: 0,
        status: "pending",
      },
      {
        id: "sf_2",
        round: "sf",
        matchLabel: "Semifinal #2",
        p1: { name: "Pemenang QF 3", avatar: "⏳", email: "pending_sf2_1", joinedAt: 0, score: 0, hp: 100, isReady: false },
        p2: { name: "Pemenang QF 4", avatar: "⏳", email: "pending_sf2_2", joinedAt: 0, score: 0, hp: 100, isReady: false },
        score1: 0,
        score2: 0,
        status: "pending",
      },
    ];

    const finalMatch: TournamentMatchState = {
      id: "final",
      round: "final",
      matchLabel: "Grand Final 🏆",
      p1: { name: "Finalis 1", avatar: "👑", email: "pending_f_1", joinedAt: 0, score: 0, hp: 100, isReady: false },
      p2: { name: "Finalis 2", avatar: "👑", email: "pending_f_2", joinedAt: 0, score: 0, hp: 100, isReady: false },
      score1: 0,
      score2: 0,
      status: "pending",
    };

    const initialBracket = [...qfMatches, ...sfMatches, finalMatch];
    setTournamentBracket(initialBracket);
    setCurrentTournamentRound("qf");
    setTournamentChampion(null);

    // Cari pertandingan user di QF
    const myMatch = qfMatches.find(
      (m) =>
        m.p1.email.toLowerCase() === myEmail.toLowerCase() ||
        m.p2.email.toLowerCase() === myEmail.toLowerCase()
    ) || qfMatches[0];

    const opp = myMatch.p1.email.toLowerCase() === myEmail.toLowerCase() ? myMatch.p2 : myMatch.p1;
    const meP = myMatch.p1.email.toLowerCase() === myEmail.toLowerCase() ? myMatch.p1 : myMatch.p2;

    setActiveCombatants([
      { ...meP, hp: 100, score: 0 },
      { ...opp, hp: 100, score: 0 },
    ]);
  };

  const startNextTournamentRound = () => {
    if (!tournamentRoundModal || !tournamentBracket) return;
    const nextRound: "sf" | "final" = tournamentRoundModal.roundWon === "qf" ? "sf" : "final";
    setCurrentTournamentRound(nextRound);
    setTournamentRoundModal(null);

    // Buat soal baru untuk babak berikutnya
    const freshQuestions = generateBattleQuestions({
      level: topicLevel,
      chapter: topicChapter,
      category: topicCategory,
      count: 5,
    });
    setShuffledQuestions(freshQuestions);
    setCurrentQIndex(0);
    const roundLimit = getQuestionTimeLimit(topicCategory, freshQuestions[0]);
    setTimeLeft(roundLimit);
    setSelectedAnswer(null);

    // Set combatants untuk match baru user
    const nextMatch = tournamentBracket.find(
      (m) =>
        m.round === nextRound &&
        (m.p1.email.toLowerCase() === myEmail.toLowerCase() ||
          m.p2.email.toLowerCase() === myEmail.toLowerCase())
    );

    if (nextMatch) {
      const opp = nextMatch.p1.email.toLowerCase() === myEmail.toLowerCase() ? nextMatch.p2 : nextMatch.p1;
      const mePart = nextMatch.p1.email.toLowerCase() === myEmail.toLowerCase() ? nextMatch.p1 : nextMatch.p2;
      setActiveCombatants([
        { ...mePart, hp: 100, score: 0 },
        { ...opp, hp: 100, score: 0 },
      ]);
    }
    setBattleState("in_battle");
    sfx.playBlast();
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
    const roundLimit = getQuestionTimeLimit(currentRoom.topicCategory || topicCategory, questions[0]);
    setTimeLeft(roundLimit);
    setSelectedAnswer(null);

    if (mode === "tournament") {
      initTournamentBracket(currentRoom.participants);
    }

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
    const currentQ = shuffledQuestions[currentQIndex];
    const currentLimit = getQuestionTimeLimit(topicCategory, currentQ);
    const earnedPts = calculateKahootScore(isCorrect, timeLeft, currentLimit);
    const dmg = chosen === "__TIMEOUT__" || !isCorrect ? 30 : 0;

    // 1. Instantly update local client state
    setActiveCombatants((prev) => {
      return prev.map((c) => {
        const isMe = c.email.toLowerCase() === myEmail.toLowerCase();
        if (isMe) {
          const hp = isCorrect ? c.hp : Math.max(0, c.hp - dmg);
          const score = c.score + earnedPts;
          return { ...c, hp, score };
        } else {
          if (mode === "tournament") {
            const oppCorrect = Math.random() < 0.65;
            const oppPts = oppCorrect ? Math.round(500 + Math.random() * 350) : 0;
            const oppDmg = oppCorrect ? 0 : 25;
            return {
              ...c,
              hp: Math.max(0, c.hp - oppDmg),
              score: c.score + oppPts,
            };
          }
          return c;
        }
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
            if (mode !== "tournament" && Array.isArray(data.room.participants)) {
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
    setTournamentBracket(null);
    setTournamentRoundModal(null);
    setTournamentChampion(null);
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
    setTournamentBracket(null);
    setTournamentRoundModal(null);
    setTournamentChampion(null);
    onClose();
  };

  // Logika Pertandingan Cup & Penentuan Pemenang
  const checkBattleOver = () => {
    const me = activeCombatants.find((c) => c.email.toLowerCase() === myEmail.toLowerCase());
    const others = activeCombatants.filter((c) => c.email.toLowerCase() !== myEmail.toLowerCase());
    const othersAlive = others.filter((c) => c.hp > 0).length;

    // CUP TOURNAMENT BRACKET LOGIC: 8 Besar -> Semifinal -> Grand Final
    if (mode === "tournament" && tournamentBracket) {
      if ((me && me.hp <= 0) || othersAlive === 0 || currentQIndex + 1 >= shuffledQuestions.length) {
        const mePart = activeCombatants.find((c) => c.email.toLowerCase() === myEmail.toLowerCase()) || activeCombatants[0];
        const oppPart = activeCombatants.find((c) => c.email.toLowerCase() !== myEmail.toLowerCase()) || activeCombatants[1];

        const didIWin = (mePart?.score || 0) >= (oppPart?.score || 0) && (mePart?.hp || 0) > 0;
        const updatedBracket = [...tournamentBracket];

        if (currentTournamentRound === "qf") {
          const qf1 = updatedBracket.find((m) => m.id === "qf_1")!;
          const qf2 = updatedBracket.find((m) => m.id === "qf_2")!;
          const qf3 = updatedBracket.find((m) => m.id === "qf_3")!;
          const qf4 = updatedBracket.find((m) => m.id === "qf_4")!;

          [qf1, qf2, qf3, qf4].forEach((m) => {
            if (m.p1.email.toLowerCase() === myEmail.toLowerCase()) {
              m.score1 = mePart.score;
              m.score2 = oppPart.score;
              m.winner = didIWin ? m.p1 : m.p2;
            } else if (m.p2.email.toLowerCase() === myEmail.toLowerCase()) {
              m.score1 = oppPart.score;
              m.score2 = mePart.score;
              m.winner = didIWin ? m.p2 : m.p1;
            } else {
              const s1 = Math.floor(Math.random() * 3 + 2) * 500;
              const s2 = Math.floor(Math.random() * 3 + 1) * 500;
              m.score1 = s1;
              m.score2 = s2;
              m.winner = s1 >= s2 ? m.p1 : m.p2;
            }
            m.status = "finished";
          });

          const sf1 = updatedBracket.find((m) => m.id === "sf_1")!;
          const sf2 = updatedBracket.find((m) => m.id === "sf_2")!;
          sf1.p1 = qf1.winner!;
          sf1.p2 = qf2.winner!;
          sf1.status = "in_battle";

          sf2.p1 = qf3.winner!;
          sf2.p2 = qf4.winner!;
          sf2.status = "in_battle";

          setTournamentBracket(updatedBracket);

          if (didIWin) {
            sfx.playVictory();
            const mySf = [sf1, sf2].find(
              (m) =>
                m.p1.email.toLowerCase() === myEmail.toLowerCase() ||
                m.p2.email.toLowerCase() === myEmail.toLowerCase()
            )!;
            const nextOpp = mySf.p1.email.toLowerCase() === myEmail.toLowerCase() ? mySf.p2 : mySf.p1;

            setTournamentRoundModal({
              show: true,
              type: "advancing",
              roundWon: "qf",
              myScore: mePart.score,
              oppScore: oppPart.score,
              opponentName: oppPart.name,
              nextOpponent: nextOpp,
            });
          } else {
            sfx.playEliminated();
            setTournamentRoundModal({
              show: true,
              type: "eliminated",
              roundWon: "qf",
              myScore: mePart.score,
              oppScore: oppPart.score,
              opponentName: oppPart.name,
            });
          }
          return;
        }

        if (currentTournamentRound === "sf") {
          const sf1 = updatedBracket.find((m) => m.id === "sf_1")!;
          const sf2 = updatedBracket.find((m) => m.id === "sf_2")!;

          [sf1, sf2].forEach((m) => {
            if (m.p1.email.toLowerCase() === myEmail.toLowerCase()) {
              m.score1 = mePart.score;
              m.score2 = oppPart.score;
              m.winner = didIWin ? m.p1 : m.p2;
            } else if (m.p2.email.toLowerCase() === myEmail.toLowerCase()) {
              m.score1 = oppPart.score;
              m.score2 = mePart.score;
              m.winner = didIWin ? m.p2 : m.p1;
            } else {
              const s1 = Math.floor(Math.random() * 3 + 2) * 500;
              const s2 = Math.floor(Math.random() * 3 + 1) * 500;
              m.score1 = s1;
              m.score2 = s2;
              m.winner = s1 >= s2 ? m.p1 : m.p2;
            }
            m.status = "finished";
          });

          const finalM = updatedBracket.find((m) => m.id === "final")!;
          finalM.p1 = sf1.winner!;
          finalM.p2 = sf2.winner!;
          finalM.status = "in_battle";

          setTournamentBracket(updatedBracket);

          if (didIWin) {
            sfx.playVictory();
            const nextOpp = finalM.p1.email.toLowerCase() === myEmail.toLowerCase() ? finalM.p2 : finalM.p1;
            setTournamentRoundModal({
              show: true,
              type: "advancing",
              roundWon: "sf",
              myScore: mePart.score,
              oppScore: oppPart.score,
              opponentName: oppPart.name,
              nextOpponent: nextOpp,
            });
          } else {
            sfx.playEliminated();
            setTournamentRoundModal({
              show: true,
              type: "eliminated",
              roundWon: "sf",
              myScore: mePart.score,
              oppScore: oppPart.score,
              opponentName: oppPart.name,
            });
          }
          return;
        }

        if (currentTournamentRound === "final") {
          const finalM = updatedBracket.find((m) => m.id === "final")!;
          if (finalM.p1.email.toLowerCase() === myEmail.toLowerCase()) {
            finalM.score1 = mePart.score;
            finalM.score2 = oppPart.score;
            finalM.winner = didIWin ? finalM.p1 : finalM.p2;
          } else {
            finalM.score1 = oppPart.score;
            finalM.score2 = mePart.score;
            finalM.winner = didIWin ? finalM.p2 : finalM.p1;
          }
          finalM.status = "finished";
          setTournamentBracket(updatedBracket);
          setTournamentChampion(finalM.winner || null);

          if (didIWin) {
            setBattleState("victory");
            sfx.playVictory();
            addXp(500, "Juara Turnamen Otsutsuki Cup (CUP Champion)");
            advanceDailyQuest("battle", 1);
            setTournamentWins((prev) => prev + 1);
          } else {
            setBattleState("defeat");
            sfx.playEliminated();
          }
          notifyMatchFinished();
          return;
        }
      }
    }

    // Standard Modes (1v1, Group, Survival)
    if ((me && me.hp <= 0) || othersAlive === 0 || currentQIndex + 1 >= shuffledQuestions.length) {
      const sortedCombatants = [...activeCombatants].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.hp - a.hp;
      });

      const winner = sortedCombatants[0];
      const isIWinner = winner && winner.email.toLowerCase() === myEmail.toLowerCase();

      if (isIWinner && me && me.hp > 0) {
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
    const nextQ = shuffledQuestions[currentQIndex + 1];
    const nextLimit = getQuestionTimeLimit(topicCategory, nextQ);
    setTimeLeft(nextLimit);
  };

  if (!isOpen) return null;

  const currentQ = shuffledQuestions[currentQIndex];
  const requiredQuota = mode === "1vs1" ? 2 : mode === "group" ? 4 : mode === "tournament" ? 8 : 6;
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
  const rivalLeft = isJoined && currentParticipants.length < (mode === "1vs1" ? 2 : mode === "group" ? 4 : mode === "tournament" ? 8 : 6);
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
                🏆 Turnamen (8P)
              </button>
            </div>

            {/* TOURNAMENT BANNER IF TOURNAMENT MODE IS ACTIVE */}
            {mode === "tournament" && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl animate-bounce">🏆</span>
                  <div>
                    <h5 className="text-xs font-black text-amber-500 flex items-center gap-1.5">
                      Turnamen Cup 8 Peserta (Sistem Gugur: 8 Besar ➔ Semifinal ➔ Final)
                    </h5>
                    <p className="text-[10px] opacity-75">
                      2 orang bertemu acak tiap babak, pemenang melaju ke Semifinal & Grand Final perebutan Trofi Juara!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowBracketModal(true)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:scale-105 transition flex items-center gap-1"
                  >
                    🏆 Bagan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTournamentShowcase(true)}
                    className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase bg-amber-500 text-stone-950 hover:scale-105 transition"
                  >
                    Hadiah
                  </button>
                </div>
              </div>
            )}

            {/* JOIN & ROOM LOBBY ROSTER */}
            {!isJoined ? (
              <div className="flex flex-col gap-3">
                {room && room.participants.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="font-bold opacity-80">Peserta di Ruangan ({room.participants.length}/{room.requiredCount}):</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-amber-500">
                      <div className="flex -space-x-2">
                        {room.participants.slice(0, 5).map((p, i) => (
                          <span
                            key={i}
                            className="inline-block text-lg bg-black/10 dark:bg-stone-800 rounded-full px-1 border border-current/20"
                            title={`${p.name} ${p.isHost ? "(Room Master 👑)" : ""}`}
                          >
                            {p.avatar}
                          </span>
                        ))}
                      </div>
                      {room.participants.length > 5 && (
                        <span className="text-[10px] opacity-75">+{room.participants.length - 5}</span>
                      )}
                    </div>
                  </div>
                )}
                <button
                  disabled={loadingAction || !myEmail.trim()}
                  onClick={() => handleJoinLobby()}
                  className="clay-btn-gold py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition"
                >
                  {loadingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                  Masuk ke Lobi Pertandingan
                </button>
              </div>
            ) : (() => {
              const roomParticipants = room?.participants || [];
              const meParticipant = roomParticipants.find((p) => p.email.toLowerCase() === myEmail.toLowerCase());
              const isMeHost = !!meParticipant?.isHost;
              const hostParticipant = roomParticipants.find((p) => p.isHost) || roomParticipants[0];
              const requiredQuota = room?.requiredCount || (mode === "1vs1" ? 2 : mode === "group" ? 4 : mode === "tournament" ? 8 : 6);
              const readyCount = roomParticipants.filter((p) => p.isReady).length;
              const canStart = isMeHost && roomParticipants.length >= 2 && roomParticipants.every((p) => p.isReady);
              const emptySlotsCount = Math.max(0, requiredQuota - roomParticipants.length);

              return (
                <div className="flex flex-col gap-4 p-4 rounded-3xl bg-black/5 dark:bg-white/5 border border-amber-500/30">
                  {/* LOBBY HEADER */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-current/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-lg shrink-0">
                        {mode === "tournament" ? "🏆" : mode === "group" ? "🛡️" : mode === "1vs1" ? "⚔️" : "👑"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-sm font-black tracking-wide">
                            {mode === "tournament" ? "Lobi Turnamen (8 Peserta)" : mode === "group" ? "Lobi Tim 2v2" : mode === "1vs1" ? "Lobi Duel 1v1" : "Lobi Survival"}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                            {room?.roomCode || currentActiveRoomCode || "UMUM"}
                          </span>
                        </div>
                        <p className="text-[10px] opacity-75 mt-0.5">
                          Room Master: <strong className="text-amber-500 font-black">👑 {hostParticipant?.name || "Memuat..."}</strong> {isMeHost && "(Anda)"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 rounded-xl bg-black/10 dark:bg-white/10 text-[11px] font-mono font-black flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-500" />
                        <span>{roomParticipants.length}/{requiredQuota} Peserta</span>
                      </div>
                      <div className={`px-3 py-1 rounded-xl text-[11px] font-mono font-black flex items-center gap-1.5 ${
                        readyCount === roomParticipants.length && roomParticipants.length >= 2
                          ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 animate-pulse"
                          : "bg-amber-500/15 text-amber-500"
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{readyCount}/{roomParticipants.length} Siap</span>
                      </div>
                    </div>
                  </div>

                  {/* PARTICIPANTS ROSTER GRID */}
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase opacity-75 flex items-center gap-1">
                        Daftar Peserta di Ruangan Ini
                      </span>
                      <span className="text-[10px] font-mono opacity-60">
                        {canStart ? "✅ Siap dimulai oleh Room Master" : "Semua harus SIAP untuk memulai"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {roomParticipants.map((p, idx) => {
                        const isSelf = p.email.toLowerCase() === myEmail.toLowerCase();
                        return (
                          <div
                            key={p.email || idx}
                            className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                              isSelf
                                ? "bg-amber-500/15 border-amber-500/60 shadow-sm ring-1 ring-amber-400/40"
                                : "bg-black/5 dark:bg-white/5 border-current/10"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative">
                                <span className="text-2xl">{p.avatar}</span>
                                {p.isHost && (
                                  <span className="absolute -top-2 -right-1.5 text-xs animate-bounce" title="Room Master (Host)">
                                    👑
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-black truncate max-w-[120px] sm:max-w-[140px]">
                                    {p.name}
                                  </span>
                                  {isSelf && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500 text-stone-950 font-black uppercase">
                                      Anda
                                    </span>
                                  )}
                                  {p.isHost && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black uppercase flex items-center gap-0.5 shadow-sm">
                                      👑 Master
                                    </span>
                                  )}
                                </div>
                                {p.team && (
                                  <span className="text-[10px] opacity-70 block capitalize">
                                    Tim {p.team}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* STATUS BADGE */}
                            <div>
                              {p.isReady ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase bg-emerald-500 text-white shadow-sm shadow-emerald-500/30">
                                  <CheckCircle2 className="w-3 h-3" /> SIAP
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase bg-stone-500/15 text-stone-600 dark:text-stone-400 border border-current/20">
                                  <Clock className="w-3 h-3 animate-spin" /> BELUM
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* EMPTY SLOTS */}
                      {Array.from({ length: emptySlotsCount }).map((_, emptyIdx) => (
                        <div
                          key={`empty-${emptyIdx}`}
                          className="p-3 rounded-2xl border border-dashed border-current/20 bg-black/5 dark:bg-white/[0.02] flex items-center justify-between opacity-60"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl border border-dashed border-current/30 flex items-center justify-center text-xs font-mono opacity-50">
                              #{roomParticipants.length + emptyIdx + 1}
                            </div>
                            <span className="text-xs font-medium italic opacity-70">
                              Slot Kosong #{roomParticipants.length + emptyIdx + 1}...
                            </span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded-lg bg-black/10 dark:bg-white/10 font-mono">
                            Tersedia
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CONTROLS ROW */}
                  <div className="pt-2 flex flex-col gap-3">
                    {/* PLAYER'S OWN READY TOGGLE & LEAVE BUTTON */}
                    <div className="flex items-center gap-2">
                      <button
                        disabled={loadingAction}
                        onClick={handleToggleReady}
                        className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition ${
                          isMyReady
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30"
                            : "clay-btn-gold"
                        }`}
                      >
                        {loadingAction ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isMyReady ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                        {isMyReady ? "✅ STATUS: SIAP (Klik Batal)" : "⚡ SAYA SIAP! (READY)"}
                      </button>

                      <button
                        disabled={loadingAction}
                        onClick={handleLeaveLobby}
                        title="Keluar dari Lobi"
                        className="py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 transition"
                      >
                        <LogOut className="w-4 h-4" /> Keluar
                      </button>
                    </div>

                    {/* ROOM MASTER CONTROLS vs PARTICIPANT STATUS */}
                    {isMeHost ? (
                      <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-500 flex items-center gap-1.5">
                            👑 Kontrol Room Master
                          </span>
                          <span className="text-[10px] font-mono font-bold opacity-75">
                            {canStart ? "🟢 Siap Dimulai" : "🟡 Menunggu Syarat"}
                          </span>
                        </div>

                        {!canStart && (
                          <p className="text-[11px] opacity-80 leading-relaxed">
                            {roomParticipants.length < 2
                              ? "⚠️ Minimal harus ada 2 peserta di dalam ruangan agar Room Master dapat memulai pertandingan."
                              : `⚠️ Pertandingan belum bisa dimulai. Masih ada peserta yang BELUM SIAP (${
                                  roomParticipants.filter((p) => !p.isReady).map((p) => p.name).join(", ")
                                }).`}
                          </p>
                        )}

                        <button
                          disabled={!canStart || loadingAction}
                          onClick={handleStartBattle}
                          className={`py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg ${
                            canStart
                              ? "bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-black ring-2 ring-amber-300 hover:scale-[1.02] cursor-pointer animate-pulse"
                              : "bg-black/10 dark:bg-white/10 text-stone-400 dark:text-stone-500 cursor-not-allowed border border-current/10"
                          }`}
                        >
                          {loadingAction ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Crown className="w-4 h-4" />
                          )}
                          {canStart ? "👑 MULAI PERTANDINGAN SEKARANG!" : "👑 Mulai Pertandingan (Tunggu Semua Siap)"}
                        </button>
                      </div>
                    ) : (
                      /* NON-HOST STATUS MESSAGE */
                      <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/10 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg animate-spin">⏳</span>
                          <div>
                            <p className="font-bold">
                              {roomParticipants.length >= 2 && roomParticipants.every((p) => p.isReady)
                                ? `Semua peserta sudah siap! Menunggu Room Master (${hostParticipant?.name || "Host"}) memulai pertandingan...`
                                : `Menunggu seluruh peserta berstatus SIAP (${readyCount}/${roomParticipants.length} Siap)...`}
                            </p>
                            <p className="text-[10px] opacity-70 mt-0.5">Pertandingan hanya dapat dimulai oleh Room Master (👑).</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
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
            <div className="flex items-center justify-between border-b border-current/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-500">
                  {mode === "tournament"
                    ? `🏆 CUP • ${
                        currentTournamentRound === "qf"
                          ? "BABAK 8 BESAR"
                          : currentTournamentRound === "sf"
                          ? "SEMIFINAL"
                          : "GRAND FINAL"
                      } (Soal ${currentQIndex + 1}/${shuffledQuestions.length})`
                    : `Ronde ${currentQIndex + 1} / ${shuffledQuestions.length}`}
                </span>
                {mode === "tournament" && (
                  <button
                    type="button"
                    onClick={() => setShowBracketModal(true)}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30 hover:scale-105 transition flex items-center gap-1"
                  >
                    🏆 Bagan
                  </button>
                )}
              </div>
              <div className={`px-3 py-1 rounded-xl font-mono font-black text-sm ${timeLeft <= 3 ? "bg-rose-500 text-white animate-bounce" : "bg-black/10 dark:bg-white/10"}`}>
                <Clock className="w-4 h-4 inline mr-1" /> {timeLeft}s
              </div>
            </div>

            {/* COMBATANTS HP */}
            <div className="grid grid-cols-2 gap-2.5">
              {activeCombatants.slice(0, 2).map((c) => {
                const isMe = c.email.toLowerCase() === myEmail.toLowerCase();
                return (
                  <div
                    key={c.email}
                    className={`p-2.5 rounded-2xl border flex flex-col gap-1.5 transition ${
                      isMe ? "bg-amber-500/15 border-amber-400 shadow-sm" : "bg-black/10 dark:bg-white/5 border-current/10"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-black">
                      <span className="truncate max-w-[120px] flex items-center gap-1">
                        <span>{c.avatar}</span> {c.name.split(" ")[0]} {isMe && "(Anda)"}
                      </span>
                      <span className="text-amber-400 font-mono text-[11px]">{c.score} PTS</span>
                    </div>
                    {/* HP Bar */}
                    <div className="w-full bg-black/20 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          c.hp > 50 ? "bg-emerald-500" : c.hp > 25 ? "bg-amber-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${Math.max(0, Math.min(100, c.hp))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* QUESTION - JFT STANDARD FORMAT (TANPA ROMAJI) */}
            <div className="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border text-center flex flex-col items-center gap-1.5 shadow-sm">
              <span className="text-[11px] font-black uppercase text-amber-500 tracking-wider px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
                {currentQ.prompt ||
                  (currentQ.questionType === "kanji_to_yomi"
                    ? "Pilih Cara Baca (Yomikata) Kanji:"
                    : currentQ.questionType === "hiragana_to_kanji"
                    ? "Pilih Kanji yang Tepat:"
                    : "Tentukan Arti Bahasa Indonesia:")}
              </span>
              <h3 className="text-3xl sm:text-4xl font-black mt-2 tracking-wide font-japanese">
                {currentQ.display || currentQ.ja}
              </h3>
              {currentQ.subDisplay && (
                <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20 mt-1">
                  {currentQ.pos === "bunpou_puzzle" ? `【Rumus: ${currentQ.subDisplay}】` : `【よみ: ${currentQ.subDisplay}】`}
                </span>
              )}
            </div>

            {/* OPTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleUserAnswer(opt)}
                  className={`clay-btn p-3.5 rounded-xl text-xs sm:text-sm font-bold text-left transition flex items-center justify-between ${
                    selectedAnswer === opt
                      ? opt === currentQ.correct
                        ? "bg-emerald-500/30 border-emerald-400 text-emerald-300"
                        : "bg-rose-500/30 border-rose-400 text-rose-300"
                      : selectedAnswer !== null && opt === currentQ.correct
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-400 animate-pulse"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-amber-400 font-black shrink-0 w-6 h-6 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-japanese tracking-wide text-sm truncate">{opt}</span>
                  </div>
                  {selectedAnswer !== null && opt === currentQ.correct && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
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

        {/* TOURNAMENT CUP BRACKET MODAL */}
        {showBracketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-stone-900 border border-amber-500/50 rounded-3xl w-full max-w-4xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl animate-bounce">🏆</span>
                  <div>
                    <h3 className="text-base font-black text-amber-500 flex items-center gap-1.5">
                      Bagan Turnamen Otsutsuki Cup (8 Peserta)
                    </h3>
                    <p className="text-[11px] opacity-70">
                      Sistem Gugur Klasik: Babak 8 Besar ➔ Semifinal ➔ Grand Final
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBracketModal(false)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Bracket Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2">
                {/* Column 1: Babak 8 Besar */}
                <div className="flex flex-col gap-3">
                  <div className="text-center py-1.5 px-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs font-black uppercase text-amber-400">
                    ⚔️ 8 Besar (QF)
                  </div>
                  {(tournamentBracket?.filter((m) => m.round === "qf") || []).map((m, idx) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-2xl border flex flex-col gap-1.5 ${
                        m.status === "in_battle"
                          ? "bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-400/40"
                          : "bg-black/20 border-white/10"
                      }`}
                    >
                      <span className="text-[9px] font-mono opacity-60 uppercase">Match {idx + 1}</span>
                      {/* Player 1 */}
                      <div className={`flex items-center justify-between text-xs p-1.5 rounded-lg ${
                        m.winner?.email === m.p1.email ? "bg-emerald-500/20 font-black text-emerald-400" : ""
                      }`}>
                        <span className="truncate max-w-[120px] flex items-center gap-1">
                          <span>{m.p1.avatar}</span> {m.p1.name} {m.p1.email.toLowerCase() === myEmail.toLowerCase() && "(Anda)"}
                        </span>
                        <span className="font-mono text-[10px]">{m.status === "finished" ? `${m.score1}p` : ""}</span>
                      </div>
                      {/* Player 2 */}
                      <div className={`flex items-center justify-between text-xs p-1.5 rounded-lg ${
                        m.winner?.email === m.p2.email ? "bg-emerald-500/20 font-black text-emerald-400" : ""
                      }`}>
                        <span className="truncate max-w-[120px] flex items-center gap-1">
                          <span>{m.p2.avatar}</span> {m.p2.name} {m.p2.email.toLowerCase() === myEmail.toLowerCase() && "(Anda)"}
                        </span>
                        <span className="font-mono text-[10px]">{m.status === "finished" ? `${m.score2}p` : ""}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Column 2: Semifinal */}
                <div className="flex flex-col gap-3 md:justify-around">
                  <div className="text-center py-1.5 px-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-xs font-black uppercase text-indigo-400">
                    🛡️ Semifinal (SF)
                  </div>
                  {(tournamentBracket?.filter((m) => m.round === "sf") || []).map((m, idx) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-2xl border flex flex-col gap-1.5 ${
                        m.status === "in_battle"
                          ? "bg-indigo-500/15 border-indigo-500/60 ring-1 ring-indigo-400/40"
                          : "bg-black/20 border-white/10"
                      }`}
                    >
                      <span className="text-[9px] font-mono opacity-60 uppercase">SF #{idx + 1}</span>
                      {/* Player 1 */}
                      <div className={`flex items-center justify-between text-xs p-1.5 rounded-lg ${
                        m.winner?.email === m.p1.email ? "bg-emerald-500/20 font-black text-emerald-400" : ""
                      }`}>
                        <span className="truncate max-w-[120px] flex items-center gap-1">
                          <span>{m.p1.avatar}</span> {m.p1.name} {m.p1.email.toLowerCase() === myEmail.toLowerCase() && "(Anda)"}
                        </span>
                        <span className="font-mono text-[10px]">{m.status === "finished" ? `${m.score1}p` : ""}</span>
                      </div>
                      {/* Player 2 */}
                      <div className={`flex items-center justify-between text-xs p-1.5 rounded-lg ${
                        m.winner?.email === m.p2.email ? "bg-emerald-500/20 font-black text-emerald-400" : ""
                      }`}>
                        <span className="truncate max-w-[120px] flex items-center gap-1">
                          <span>{m.p2.avatar}</span> {m.p2.name} {m.p2.email.toLowerCase() === myEmail.toLowerCase() && "(Anda)"}
                        </span>
                        <span className="font-mono text-[10px]">{m.status === "finished" ? `${m.score2}p` : ""}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Column 3: Grand Final */}
                <div className="flex flex-col gap-3 md:justify-center">
                  <div className="text-center py-1.5 px-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs font-black uppercase text-amber-300">
                    👑 Grand Final
                  </div>
                  {(() => {
                    const finalM = tournamentBracket?.find((m) => m.round === "final");
                    if (!finalM) return null;
                    return (
                      <div
                        className={`p-3.5 rounded-2xl border flex flex-col gap-2 ${
                          finalM.status === "in_battle"
                            ? "bg-amber-500/20 border-amber-400 shadow-lg ring-2 ring-amber-400/50"
                            : "bg-black/20 border-white/10"
                        }`}
                      >
                        <span className="text-[9px] font-mono text-amber-400 uppercase font-black">Perebutan Gelar</span>
                        {/* Finalist 1 */}
                        <div className={`flex items-center justify-between text-xs p-2 rounded-xl ${
                          finalM.winner?.email === finalM.p1.email ? "bg-amber-500/30 font-black text-amber-300" : ""
                        }`}>
                          <span className="truncate max-w-[120px] flex items-center gap-1.5 font-bold">
                            <span>{finalM.p1.avatar}</span> {finalM.p1.name} {finalM.p1.email.toLowerCase() === myEmail.toLowerCase() && "(Anda)"}
                          </span>
                          <span className="font-mono text-xs">{finalM.status === "finished" ? `${finalM.score1}p` : ""}</span>
                        </div>
                        {/* Finalist 2 */}
                        <div className={`flex items-center justify-between text-xs p-2 rounded-xl ${
                          finalM.winner?.email === finalM.p2.email ? "bg-amber-500/30 font-black text-amber-300" : ""
                        }`}>
                          <span className="truncate max-w-[120px] flex items-center gap-1.5 font-bold">
                            <span>{finalM.p2.avatar}</span> {finalM.p2.name} {finalM.p2.email.toLowerCase() === myEmail.toLowerCase() && "(Anda)"}
                          </span>
                          <span className="font-mono text-xs">{finalM.status === "finished" ? `${finalM.score2}p` : ""}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Column 4: Champion Trophy Card */}
                <div className="flex flex-col gap-3 md:justify-center">
                  <div className="text-center py-1.5 px-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 text-xs font-black uppercase shadow-md">
                    🏆 Trofi Juara
                  </div>
                  <div className="p-4 rounded-3xl bg-gradient-to-b from-amber-500/20 to-yellow-500/10 border-2 border-amber-400/60 flex flex-col items-center justify-center text-center gap-2">
                    <span className="text-4xl animate-bounce">🏆</span>
                    {tournamentChampion ? (
                      <div className="flex flex-col items-center">
                        <span className="text-2xl">{tournamentChampion.avatar}</span>
                        <span className="text-sm font-black text-amber-400 mt-1">{tournamentChampion.name}</span>
                        <span className="text-[10px] uppercase font-bold text-emerald-400">Pemenang Otsutsuki Cup!</span>
                      </div>
                    ) : (
                      <div className="opacity-60 text-xs italic">
                        Menunggu pemenang Grand Final...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowBracketModal(false)}
                  className="clay-btn-gold px-4 py-2 rounded-xl text-xs font-black uppercase"
                >
                  Tutup Bagan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOURNAMENT ROUND ADVANCEMENT / ELIMINATION MODAL */}
        {tournamentRoundModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
            <div className="bg-stone-900 border border-amber-500/50 rounded-3xl max-w-md w-full p-6 text-center flex flex-col items-center gap-4 shadow-2xl">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                tournamentRoundModal.type === "advancing" ? "bg-amber-500/20 text-amber-400 border border-amber-400/50 animate-bounce" : "bg-rose-500/20 text-rose-400 border border-rose-400/50"
              }`}>
                {tournamentRoundModal.type === "advancing" ? "⚔️" : "💀"}
              </div>

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-black uppercase tracking-wide">
                  {tournamentRoundModal.type === "advancing"
                    ? `🎉 MENANG DI ${tournamentRoundModal.roundWon === "qf" ? "BABAK 8 BESAR!" : "BABAK SEMIFINAL!"}`
                    : `GUGUR DI ${tournamentRoundModal.roundWon === "qf" ? "BABAK 8 BESAR" : "BABAK SEMIFINAL"}`}
                </h3>
                <p className="text-xs opacity-75">
                  Skor: <strong>Anda ({tournamentRoundModal.myScore} PTS)</strong> vs <strong>{tournamentRoundModal.opponentName} ({tournamentRoundModal.oppScore} PTS)</strong>
                </p>
              </div>

              {tournamentRoundModal.type === "advancing" && tournamentRoundModal.nextOpponent && (
                <div className="w-full p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="text-left text-xs">
                    <span className="text-[10px] font-black uppercase text-amber-400 block">Lawan di {tournamentRoundModal.roundWon === "qf" ? "Semifinal" : "Grand Final"}:</span>
                    <span className="font-bold flex items-center gap-1.5 mt-0.5">
                      <span>{tournamentRoundModal.nextOpponent.avatar}</span> {tournamentRoundModal.nextOpponent.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-400 uppercase px-2 py-1 rounded-lg bg-black/30">
                    {tournamentRoundModal.roundWon === "qf" ? "SF" : "FINAL"}
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-2">
                <button
                  type="button"
                  onClick={() => setShowBracketModal(true)}
                  className="flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition"
                >
                  🏆 Lihat Bagan
                </button>

                {tournamentRoundModal.type === "advancing" ? (
                  <button
                    type="button"
                    onClick={startNextTournamentRound}
                    className="flex-1 clay-btn-gold py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                  >
                    Lanjut Tanding ➔
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setTournamentRoundModal(null);
                      setBattleState("defeat");
                    }}
                    className="flex-1 py-3 px-4 rounded-xl text-xs font-bold uppercase bg-stone-800 hover:bg-stone-700 transition"
                  >
                    Selesai
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}