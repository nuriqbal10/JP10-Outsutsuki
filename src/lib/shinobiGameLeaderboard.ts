// Standalone Shinobi Game Leaderboard System (100% Terpisah dari Rapor Akademis Resmi)
// Papan peringkat khusus aktivitas game, duel arcade, dojo training, dan arena ninja

export interface ShinobiGamePlayer {
  id: string;
  nim: string;
  name: string;
  avatar: string;
  chakraXp: number;
  level: number;
  shinobiTitle: string;
  shinobiKanji: string;
  winRate: number; // 0 - 100%
  battlesPlayed: number;
  battlesWon: number;
  streak: number;
  trainingScore: number;
  bestPillar: "Choukai" | "Kotoba 5S" | "Bunpou" | "Kanji & Kana" | "Dokkai" | "Partikel Drill";
  badges: string[];
  isCurrentUser?: boolean;
}

// 28 Nama & NIM Resmi Klan Otsutsuki
export const OTSUTSUKI_28_STUDENTS = [
  { no: 1, nim: "JP10-1804249", name: "ADIQRI IRHAN WIJAYA", avatar: "⚡", basePillar: "Choukai" as const },
  { no: 2, nim: "JP10-1803765", name: "AFIKA SAZWANI", avatar: "🌸", basePillar: "Kotoba 5S" as const },
  { no: 3, nim: "JP10-1804041", name: "ALDA PUTRI MAYANI", avatar: "🌙", basePillar: "Bunpou" as const },
  { no: 4, nim: "JP10-1803838", name: "ALYA RATU JUNISA", avatar: "🦊", basePillar: "Dokkai" as const },
  { no: 5, nim: "JP10-1803800", name: "ANGGI JULIANA", avatar: "🍃", basePillar: "Kanji & Kana" as const },
  { no: 6, nim: "JP10-1803445", name: "AZMI SYAUQI RAMADHAN", avatar: "🔥", basePillar: "Partikel Drill" as const },
  { no: 7, nim: "JP10-1804031", name: "EGA ALAMSYAH", avatar: "🌪️", basePillar: "Choukai" as const },
  { no: 8, nim: "JP10-1803811", name: "EKA RADITYA PRINGGO DHANI", avatar: "🦅", basePillar: "Bunpou" as const },
  { no: 9, nim: "JP10-1803780", name: "FIRLY VELISTA", avatar: "🌺", basePillar: "Kotoba 5S" as const },
  { no: 10, nim: "JP10-1803739", name: "IMAS SITI MARIAM", avatar: "🪷", basePillar: "Dokkai" as const },
  { no: 11, nim: "JP10-1804210", name: "M RAKA RAMADANI", avatar: "🐯", basePillar: "Choukai" as const },
  { no: 12, nim: "JP10-1803820", name: "MUHAMMAD RAIHAAN RASENDRIYA", avatar: "⚔️", basePillar: "Partikel Drill" as const },
  { no: 13, nim: "JP10-1803459", name: "MUHAMMAD RIDWAN", avatar: "🐉", basePillar: "Kanji & Kana" as const },
  { no: 14, nim: "JP10-1803349", name: "MUHAMMAD RIDWAN NURPADILAH", avatar: "🛡️", basePillar: "Bunpou" as const },
  { no: 15, nim: "JP10-1803598", name: "NABIL NUR ILHAM", avatar: "🐺", basePillar: "Kotoba 5S" as const },
  { no: 16, nim: "JP10-1804183", name: "SIFA RAHMAWATI", avatar: "🎋", basePillar: "Dokkai" as const },
  { no: 17, nim: "JP10-1804217", name: "SISKA MAELANI", avatar: "🌟", basePillar: "Choukai" as const },
  { no: 18, nim: "JP10-1803898", name: "SITI NURSYIFA", avatar: "🦋", basePillar: "Kanji & Kana" as const },
  { no: 19, nim: "JP10-1803803", name: "SITI RUBIATUL AWALIYAH", avatar: "☀️", basePillar: "Bunpou" as const },
  { no: 20, nim: "JP10-1803483", name: "SOLAHUDIN", avatar: "🏹", basePillar: "Partikel Drill" as const },
  { no: 21, nim: "JP10-1804233", name: "SUSI APRIANTI", avatar: "💮", basePillar: "Kotoba 5S" as const },
  { no: 22, nim: "JP10-1804051", name: "TALENTA NABIL HIDAYATULLOH", avatar: "🔮", basePillar: "Dokkai" as const },
  { no: 23, nim: "JP10-1803951", name: "TALITA ARDELIA LUBIS", avatar: "🌷", basePillar: "Choukai" as const },
  { no: 24, nim: "JP10-1803682", name: "WINDA WIDYAWATI", avatar: "💠", basePillar: "Kanji & Kana" as const },
  { no: 25, nim: "JP10-1804012", name: "WISNU AIRLANGGA NATAKOESUMAH", avatar: "🔱", basePillar: "Bunpou" as const },
  { no: 26, nim: "JP10-1803986", name: "YUGIA MUHAMAD HANIP", avatar: "🎯", basePillar: "Partikel Drill" as const },
  { no: 27, nim: "JP10-1804232", name: "YULI YULIANTI", avatar: "🌿", basePillar: "Kotoba 5S" as const },
  { no: 28, nim: "JP10-1803762", name: "ZAHRA PUTRI PADILAH", avatar: "✨", basePillar: "Dokkai" as const },
];

function getTitleByXp(xp: number): { title: string; kanji: string; level: number } {
  if (xp >= 6000) return { title: "Sannin Legendaris", kanji: "伝説の三忍", level: 9 };
  if (xp >= 4500) return { title: "Anbu Otsutsuki", kanji: "暗部 • 守護者", level: 8 };
  if (xp >= 3200) return { title: "Jonin Kelas Atas", kanji: "上忍 • 実践会話", level: 7 };
  if (xp >= 2200) return { title: "Tokubetsu Jonin", kanji: "特別上忍 • 聴解マスター", level: 6 };
  if (xp >= 1400) return { title: "Chunin Elit", kanji: "中忍 • 文法エキスパート", level: 5 };
  if (xp >= 800) return { title: "Chunin Taktis", kanji: "中忍 • 語彙マスター", level: 4 };
  if (xp >= 400) return { title: "Genin Tangguh", kanji: "下忍 • 中級", level: 3 };
  if (xp >= 150) return { title: "Genin Pemula", kanji: "下忍 • 初級", level: 2 };
  return { title: "Murid Akademi", kanji: "アカデミー生", level: 1 };
}

// Generate base gaming leaderboard data (deterministik berdasarkan index agar konsisten)
export function getInitialShinobiGameLeaderboard(currentUserName = "", currentUserXp = 0): ShinobiGamePlayer[] {
  const seedMultiplier = [
    3450, 3120, 2890, 2670, 2540, 2380, 2210, 2050, 1920, 1810,
    1730, 1620, 1540, 1480, 1390, 1310, 1240, 1170, 1080, 990,
    910, 840, 760, 690, 610, 530, 460, 390
  ];

  return OTSUTSUKI_28_STUDENTS.map((st, idx) => {
    const baseXp = seedMultiplier[idx] || 500;
    const { title, kanji, level } = getTitleByXp(baseXp);
    const battlesPlayed = Math.floor(baseXp / 65) + 12;
    const winRate = Math.min(96, Math.max(55, Math.round(92 - idx * 1.3)));
    const battlesWon = Math.round((battlesPlayed * winRate) / 100);
    const streak = Math.max(1, Math.min(18, Math.round(15 - idx * 0.4)));
    const trainingScore = Math.round(baseXp * 0.85);

    const isCurrent = currentUserName && (
      st.name.toLowerCase() === currentUserName.toLowerCase() ||
      st.nim.toLowerCase() === currentUserName.toLowerCase()
    );

    const finalXp = isCurrent && currentUserXp > 0 ? currentUserXp : baseXp;
    const finalRankMeta = getTitleByXp(finalXp);

    const badges = ["first_step"];
    if (finalXp >= 1000) badges.push("kotoba_master");
    if (finalXp >= 2000) badges.push("puzzle_master");
    if (finalXp >= 3000) badges.push("choukai_sniper");

    return {
      id: `shinobi_${st.nim}`,
      nim: st.nim,
      name: st.name,
      avatar: st.avatar,
      chakraXp: finalXp,
      level: finalRankMeta.level,
      shinobiTitle: finalRankMeta.title,
      shinobiKanji: finalRankMeta.kanji,
      winRate,
      battlesPlayed,
      battlesWon,
      streak,
      trainingScore,
      bestPillar: st.basePillar,
      badges,
      isCurrentUser: !!isCurrent,
    };
  });
}

export type LeaderboardSortCategory = "overall" | "training" | "pvp" | "streak";

export function sortGameLeaderboard(players: ShinobiGamePlayer[], category: LeaderboardSortCategory): ShinobiGamePlayer[] {
  const copy = [...players];
  switch (category) {
    case "overall":
      return copy.sort((a, b) => b.chakraXp - a.chakraXp);
    case "training":
      return copy.sort((a, b) => b.trainingScore - a.trainingScore);
    case "pvp":
      return copy.sort((a, b) => (b.winRate * b.battlesWon) - (a.winRate * a.battlesWon));
    case "streak":
      return copy.sort((a, b) => b.streak - a.streak);
    default:
      return copy.sort((a, b) => b.chakraXp - a.chakraXp);
  }
}
