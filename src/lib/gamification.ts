export interface UserGamificationState {
  xp: number;
  level: number;
  rankTitle: string;
  rankBadge: string;
  nextLevelXp: number;
  progressPercent: number;
  dailyStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  badges: string[];
}

export const RANKS = [
  { level: 1, title: "Murid Akademi", badge: "アカデミー生", minXp: 0, maxXp: 150 },
  { level: 2, title: "Genin Pemula", badge: "下忍 • 初級", minXp: 150, maxXp: 400 },
  { level: 3, title: "Genin Tangguh", badge: "下忍 • 中級", minXp: 400, maxXp: 800 },
  { level: 4, title: "Chunin Taktis", badge: "中忍 • 語彙マスター", minXp: 800, maxXp: 1400 },
  { level: 5, title: "Chunin Elit", badge: "中忍 • 文法エキスパート", minXp: 1400, maxXp: 2200 },
  { level: 6, title: "Tokubetsu Jonin", badge: "特別上忍 • 聴解マスター", minXp: 2200, maxXp: 3200 },
  { level: 7, title: "Jonin Kelas Atas", badge: "上忍 • 実践会話", minXp: 3200, maxXp: 4500 },
  { level: 8, title: "Anbu Otsutsuki", badge: "暗部 • 守護者", minXp: 4500, maxXp: 6000 },
  { level: 9, title: "Sannin Legendaris", badge: "伝説の三忍", minXp: 6000, maxXp: 8000 },
  { level: 10, title: "Master Otsutsuki (大筒木)", badge: "大筒木神 • JFT A2 合格者", minXp: 8000, maxXp: 10000 },
];

export const AVAILABLE_BADGES = [
  { id: "first_step", name: "初めの一歩", desc: "Membuka modul pertama", icon: "🌱" },
  { id: "kotoba_master", name: "語彙達人", desc: "Mempelajari 50+ Kotoba", icon: "📖" },
  { id: "streak_3", name: "三日坊主克服", desc: "Belajar 3 hari berturut-turut", icon: "🔥" },
  { id: "streak_7", name: "一週間連続", desc: "Belajar 7 hari berturut-turut", icon: "⚡" },
  { id: "choukai_sniper", name: "聴解スナイパー", desc: "Skor Choukai 100% pada simulasi", icon: "🎧" },
  { id: "lkpd_hero", name: "課題マスター", desc: "Menyelesaikan lembar LKPD", icon: "✍️" },
  { id: "cbt_champion", name: "CBT合格戦士", desc: "Lulus Ujian CBT nilai di atas 200", icon: "🏆" },
];

const STORAGE_KEY = "irodori_gamification_state";

export function getGamificationState(): UserGamificationState {
  if (typeof window === "undefined") {
    return {
      xp: 120,
      level: 1,
      rankTitle: "Murid Akademi",
      rankBadge: "アカデミー生",
      nextLevelXp: 150,
      progressPercent: 80,
      dailyStreak: 1,
      lastActiveDate: new Date().toISOString().split("T")[0],
      badges: ["first_step"],
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toISOString().split("T")[0];

    if (!raw) {
      const initial: UserGamificationState = {
        xp: 120,
        level: 1,
        rankTitle: "Murid Akademi",
        rankBadge: "アカデミー生",
        nextLevelXp: 150,
        progressPercent: 80,
        dailyStreak: 1,
        lastActiveDate: today,
        badges: ["first_step"],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const state = JSON.parse(raw) as UserGamificationState;

    // Check streak logic
    const lastDate = state.lastActiveDate;
    if (lastDate) {
      const last = new Date(lastDate);
      const curr = new Date(today);
      const diffTime = Math.abs(curr.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Yesterday -> today, maintain & ready to increment if active
      } else if (diffDays > 1) {
        // Broken streak
        state.dailyStreak = 1;
      }
    }

    return calculateRank(state);
  } catch (e) {
    return {
      xp: 100,
      level: 1,
      rankTitle: "Murid Akademi",
      rankBadge: "アカデミー生",
      nextLevelXp: 150,
      progressPercent: 66,
      dailyStreak: 1,
      lastActiveDate: new Date().toISOString().split("T")[0],
      badges: ["first_step"],
    };
  }
}

export function addXp(amount: number, reason?: string): UserGamificationState {
  const current = getGamificationState();
  const today = new Date().toISOString().split("T")[0];

  // Update streak if first time today
  let streak = current.dailyStreak;
  if (current.lastActiveDate !== today) {
    const last = new Date(current.lastActiveDate);
    const curr = new Date(today);
    const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else {
      streak = 1;
    }
  }

  const updated: UserGamificationState = {
    ...current,
    xp: current.xp + amount,
    dailyStreak: streak,
    lastActiveDate: today,
  };

  // Check badges unlock
  const badges = [...updated.badges];
  if (updated.dailyStreak >= 3 && !badges.includes("streak_3")) badges.push("streak_3");
  if (updated.dailyStreak >= 7 && !badges.includes("streak_7")) badges.push("streak_7");
  if (updated.xp >= 500 && !badges.includes("kotoba_master")) badges.push("kotoba_master");
  updated.badges = badges;

  const finalState = calculateRank(updated);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalState));
    // Trigger custom event so reactive UI banners update immediately
    window.dispatchEvent(new CustomEvent("gamification-updated", { detail: finalState }));
  }

  return finalState;
}

function calculateRank(state: UserGamificationState): UserGamificationState {
  const xp = state.xp;
  let currentRank = RANKS[0];

  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXp) {
      currentRank = RANKS[i];
      break;
    }
  }

  const range = currentRank.maxXp - currentRank.minXp;
  const currentProgress = xp - currentRank.minXp;
  const percent = Math.min(100, Math.max(0, Math.round((currentProgress / range) * 100)));

  return {
    ...state,
    level: currentRank.level,
    rankTitle: currentRank.title,
    rankBadge: currentRank.badge,
    nextLevelXp: currentRank.maxXp,
    progressPercent: percent,
  };
}
