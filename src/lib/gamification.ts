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
} export interface UserBattleStats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number; // percentage 0-100
  podiums: {
    first: number;
    second: number;
    third: number;
  };
  pillars: {
    mojiGoi: number; // 0-100
    bunpou: number;  // 0-100
    dokkai: number;  // 0-100
    choukai: number; // 0-100
    kanji: number;   // 0-100
  };
  strengths: string[];
  weaknesses: string[];
}

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
  battleStats?: UserBattleStats;
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
  { id: "tournament_1st", name: "大筒木杯 覇者 (Juara 1)", desc: "Menjuarai Grand Final Turnamen Otsutsuki Cup", icon: "🥇" },
  { id: "tournament_2nd", name: "大筒木杯 準優勝 (Juara 2)", desc: "Meraih posisi Runner-Up di Grand Final Otsutsuki Cup", icon: "🥈" },
  { id: "tournament_3rd", name: "大筒木杯 3位 (Juara 3)", desc: "Menembus Podium 3 Besar Turnamen Otsutsuki Cup", icon: "🥉" },
  { id: "puzzle_master", name: "文法パズル達人", desc: "Menyelesaikan 10 Ronde Bunpou Puzzle tanpa kalah", icon: "🧩" },
  { id: "picture_detective", name: "写真・標識マスター", desc: "Menebak rambu dan foto otentik Jepang dengan akurasi 100%", icon: "🔍" },
  { id: "shinobi_explorer", name: "忍の冒険者", desc: "Menuntaskan seluruh petualangan komprehensif Shinobi Quest", icon: "🗺️" },
];

const STORAGE_KEY = "irodori_gamification_state";

export const DEFAULT_BATTLE_STATS: UserBattleStats = {
  totalMatches: 0,
  wins: 0,
  losses: 0,
  winRate: 0,
  podiums: { first: 0, second: 0, third: 0 },
  pillars: {
    mojiGoi: 70,
    bunpou: 65,
    dokkai: 60,
    choukai: 75,
    kanji: 55,
  },
  strengths: ["Kosakata Percakapan (Kaiwa Kotoba)", "Pengenalan Audio Choukai A2"],
  weaknesses: ["Karakter Kanji N4/A2.2", "Pola Kalimat Bertingkat (Bunpou)"],
};

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
      battleStats: { ...DEFAULT_BATTLE_STATS },
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
        battleStats: { ...DEFAULT_BATTLE_STATS },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const state = JSON.parse(raw) as UserGamificationState;
    if (!state.battleStats) {
      state.battleStats = { ...DEFAULT_BATTLE_STATS };
    }

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


export function unlockBadge(badgeId: string): UserGamificationState {
  const current = getGamificationState();
  if (!current.badges.includes(badgeId)) {
    const updated = {
      ...current,
      badges: [...current.badges, badgeId],
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("gamification-updated", { detail: updated }));
    }
    return updated;
  }
  return current;
}

export function recordBattleOutcome(
  won: boolean,
  mode: string,
  pillarGains?: Partial<UserBattleStats["pillars"]>,
  tournamentRank?: 1 | 2 | 3
): UserGamificationState {
  const current = getGamificationState();
  const prevStats = current.battleStats || { ...DEFAULT_BATTLE_STATS };

  const totalMatches = prevStats.totalMatches + 1;
  const wins = won ? prevStats.wins + 1 : prevStats.wins;
  const losses = won ? prevStats.losses : prevStats.losses + 1;
  const winRate = Math.round((wins / totalMatches) * 100);

  const podiums = { ...prevStats.podiums };
  const badges = [...current.badges];

  if (tournamentRank === 1) {
    podiums.first += 1;
    if (!badges.includes("tournament_1st")) badges.push("tournament_1st");
  } else if (tournamentRank === 2) {
    podiums.second += 1;
    if (!badges.includes("tournament_2nd")) badges.push("tournament_2nd");
  } else if (tournamentRank === 3) {
    podiums.third += 1;
    if (!badges.includes("tournament_3rd")) badges.push("tournament_3rd");
  }

  // Adjust pillars based on gains
  const pillars = {
    mojiGoi: Math.min(100, Math.max(20, (prevStats.pillars?.mojiGoi || 70) + (pillarGains?.mojiGoi || (won ? 3 : -1)))),
    bunpou: Math.min(100, Math.max(20, (prevStats.pillars?.bunpou || 65) + (pillarGains?.bunpou || (mode.includes("bunpou") ? (won ? 4 : -2) : (won ? 1 : 0))))),
    dokkai: Math.min(100, Math.max(20, (prevStats.pillars?.dokkai || 60) + (pillarGains?.dokkai || (won ? 2 : -1)))),
    choukai: Math.min(100, Math.max(20, (prevStats.pillars?.choukai || 75) + (pillarGains?.choukai || (won ? 2 : 0)))),
    kanji: Math.min(100, Math.max(20, (prevStats.pillars?.kanji || 55) + (pillarGains?.kanji || (won ? 3 : -1)))),
  };

  // Re-calculate strengths and weaknesses dynamically
  const pillarEntries = Object.entries(pillars) as [keyof typeof pillars, number][];
  pillarEntries.sort((a, b) => b[1] - a[1]);

  const pillarLabels: Record<string, string> = {
    mojiGoi: "Kosakata Otentik (Moji-Goi)",
    bunpou: "Pola Tata Bahasa (Bunpou A2.2)",
    dokkai: "Pemahaman Teks & Rambu (Dokkai)",
    choukai: "Ketajaman Audio (Choukai)",
    kanji: "Penguasaan Kanji N4/A2",
  };

  const strengths = [
    `${pillarLabels[pillarEntries[0][0]]} (${pillarEntries[0][1]}%)`,
    `${pillarLabels[pillarEntries[1][0]]} (${pillarEntries[1][1]}%)`,
  ];

  const weaknesses = [
    `${pillarLabels[pillarEntries[4][0]]} (${pillarEntries[4][1]}%)`,
    `${pillarLabels[pillarEntries[3][0]]} (${pillarEntries[3][1]}%)`,
  ];

  const updatedStats: UserBattleStats = {
    totalMatches,
    wins,
    losses,
    winRate,
    podiums,
    pillars,
    strengths,
    weaknesses,
  };

  const updatedState: UserGamificationState = {
    ...current,
    badges,
    battleStats: updatedStats,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedState));
    window.dispatchEvent(new CustomEvent("gamification-updated", { detail: updatedState }));
  }

  return updatedState;
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
    battleStats: { ...DEFAULT_BATTLE_STATS },
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    window.dispatchEvent(new CustomEvent("gamification-updated", { detail: initial }));
  }
  return initial;
}

