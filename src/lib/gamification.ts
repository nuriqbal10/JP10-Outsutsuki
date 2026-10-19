function calculateRank(state: UserGamificationState): UserGamificationState {
  let rankTitle = "Murid Akademi";
  let rankBadge = "アカデミー生";
  let level = 1;

  if (state.xp >= 4000) {
    level = 7;
    rankTitle = "Jonin Kelas Atas";
    rankBadge = "上忍";
  } else if (state.xp >= 3000) {
    level = 6;
    rankTitle = "Tokubetsu Jonin";
    rankBadge = "特別上忍";
  } else if (state.xp >= 2000) {
    level = 5;
    rankTitle = "Chunin Elit";
    rankBadge = "中忍";
  } else if (state.xp >= 1200) {
    level = 4;
    rankTitle = "Chunin Taktis";
    rankBadge = "中忍";
  } else if (state.xp >= 700) {
    level = 3;
    rankTitle = "Genin Tangguh";
    rankBadge = "下忍";
  } else if (state.xp >= 300) {
    level = 2;
    rankTitle = "Genin Pemula";
    rankBadge = "下忍";
  }

  const nextLevelXp = level * 600;
  const prevLevelXp = (level - 1) * 600;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((state.xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100))
  );

  return {
    ...state,
    level,
    rankTitle,
    rankBadge,
    progressPercent,
  };
} export interface UserGamificationState {
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

  // Update streak jika pertama kali hari ini
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

  // Cek pembukaan badge
  const badges = [...updated.badges];
  if (updated.dailyStreak >= 3 && !badges.includes("streak_3")) badges.push("streak_3");
  if (updated.dailyStreak >= 7 && !badges.includes("streak_7")) badges.push("streak_7");
  if (updated.xp >= 500 && !badges.includes("kotoba_master")) badges.push("kotoba_master");
  updated.badges = badges;

  const finalState = calculateRank(updated);

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalState));
    // Picu custom event agar UI banner reaktif langsung terbarui
    window.dispatchEvent(new CustomEvent("gamification-updated", { detail: finalState }));

    // Sinkronisasi otomatis ke Database Pusat melalui API
    fetch("/api/student-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "student@ootsutsuki.class", // Bisa disesuaikan dengan email siswa yang sedang login
        name: "Siswa Ootsutsuki",
        xp: finalState.xp,
        level: finalState.level,
      }),
    }).catch((err) => console.error("Gagal menyinkronkan XP ke database:", err));
  }

  return finalState;
}

export function setGamificationLevel(targetLevel: number): UserGamificationState {
  const current = getGamificationState();
  const clamped = Math.max(1, Math.min(10, targetLevel));
  const targetRank = RANKS.find((r) => r.level === clamped) || RANKS[0];

  // Set XP to minXp of that level + 20%
  const bonusXp = Math.round((targetRank.maxXp - targetRank.minXp) * 0.2);
  const newXp = targetRank.minXp + bonusXp;

  const updated: UserGamificationState = {
    ...current,
    xp: newXp,
  };

  const finalState = calculateRank(updated);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalState));
    window.dispatchEvent(new CustomEvent("gamification-updated", { detail: finalState }));
  }
  return finalState;
}

export function resetGamificationState(): UserGamificationState {
  const initial: UserGamificationState = {
    xp: 0,
    level: 1,
    rankTitle: RANKS[0].title,
    rankBadge: RANKS[0].badge,
    nextLevelXp: RANKS[0].maxXp,
    progressPercent: 0,
    dailyStreak: 1,
    lastActiveDate: new Date().toISOString().split("T")[0],
    badges: ["first_step"],
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    window.dispatchEvent(new CustomEvent("gamification-updated", { detail: initial }));
  }
  return initial;
}

