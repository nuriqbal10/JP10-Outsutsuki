export interface DailyQuest {
  id: string;
  title: string;
  desc: string;
  rewardXp: number;
  rewardScrolls: number; // Ninja scrolls for gacha/honor
  target: number;
  current: number;
  isCompleted: boolean;
  category: "flashcard" | "quiz" | "battle" | "study";
  icon: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  rankTitle: string;
  level: number;
  xp: number;
  streak: number;
  battlesWon: number;
  badge: string;
  isCurrentUser?: boolean;
}

const QUESTS_STORAGE_KEY = "irodori_daily_quests_state";

export function getDailyQuests(): DailyQuest[] {
  const today = new Date().toISOString().split("T")[0];

  const defaultQuests: DailyQuest[] = [
    {
      id: "q_flashcard",
      title: "Hafalan Kilat Kotoba",
      desc: "Buka dan pelajari 10 kartu di Studio Flashcard",
      rewardXp: 40,
      rewardScrolls: 1,
      target: 10,
      current: 0,
      isCompleted: false,
      category: "flashcard",
      icon: "🎴",
    },
    {
      id: "q_reflex",
      title: "Latihan Refleks Ninja",
      desc: "Selesaikan 1 sesi Kotoba Reflex Game",
      rewardXp: 50,
      rewardScrolls: 1,
      target: 1,
      current: 0,
      isCompleted: false,
      category: "quiz",
      icon: "⚡",
    },
    {
      id: "q_battle",
      title: "Ujian Bertarung (PvP Arena)",
      desc: "Menangkan 1 pertandingan di Battle Royale Arena",
      rewardXp: 80,
      rewardScrolls: 2,
      target: 1,
      current: 0,
      isCompleted: false,
      category: "battle",
      icon: "⚔️",
    },
    {
      id: "q_streak",
      title: "Disiplin Shinobi Harian",
      desc: "Pertahankan streak belajar harian aktif",
      rewardXp: 30,
      rewardScrolls: 1,
      target: 1,
      current: 1,
      isCompleted: true,
      category: "study",
      icon: "🔥",
    },
  ];

  if (typeof window === "undefined") return defaultQuests;

  try {
    const raw = localStorage.getItem(QUESTS_STORAGE_KEY);
    if (!raw) {
      saveDailyQuests(defaultQuests, today);
      return defaultQuests;
    }

    const parsed = JSON.parse(raw);
    if (parsed.date !== today) {
      // New day -> Reset quests progress
      saveDailyQuests(defaultQuests, today);
      return defaultQuests;
    }

    return parsed.quests;
  } catch (e) {
    return defaultQuests;
  }
}

export function saveDailyQuests(quests: DailyQuest[], dateStr?: string) {
  if (typeof window === "undefined") return;
  const today = dateStr || new Date().toISOString().split("T")[0];
  localStorage.setItem(QUESTS_STORAGE_KEY, JSON.stringify({ date: today, quests }));
  window.dispatchEvent(new CustomEvent("daily-quests-updated", { detail: quests }));
}

export function advanceDailyQuest(category: DailyQuest["category"], amount = 1): { completedJustNow: boolean; rewardXp: number } {
  const quests = getDailyQuests();
  let completedJustNow = false;
  let rewardXp = 0;

  const updated = quests.map((q) => {
    if (q.category === category && !q.isCompleted) {
      const nextVal = Math.min(q.target, q.current + amount);
      const isDone = nextVal >= q.target;
      if (isDone && !q.isCompleted) {
        completedJustNow = true;
        rewardXp += q.rewardXp;
      }
      return { ...q, current: nextVal, isCompleted: isDone };
    }
    return q;
  });

  saveDailyQuests(updated);
  return { completedJustNow, rewardXp };
}

// Master Clan & Class Leaderboard - Cleaned Version
export function getLeaderboardData(currentUserName: string, currentUserXp: number, currentUserLevel: number): LeaderboardUser[] {
  // Array tester dikosongkan agar papan peringkat bersih
  const defaultPeers: LeaderboardUser[] = [];

  // Inject current user
  const userEntry: LeaderboardUser = {
    id: "current_user",
    name: currentUserName || "Ninja Otsutsuki (Anda)",
    avatar: "👑",
    rankTitle: currentUserLevel >= 5 ? "Chunin Elit" : "Murid Akademi",
    level: currentUserLevel,
    xp: currentUserXp,
    streak: Math.max(1, Math.min(30, Math.floor(currentUserXp / 200))),
    battlesWon: Math.max(0, Math.floor(currentUserXp / 150)),
    badge: "アカデミー生",
    isCurrentUser: true,
  };

  const combined = [...defaultPeers, userEntry];
  return combined.sort((a, b) => b.xp - a.xp);
}
