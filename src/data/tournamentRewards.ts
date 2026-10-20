export interface TournamentRewardTier {
  winsRequired: number;
  tierNumber: number;
  tierName: string;
  badge: {
    id: string;
    name: string;
    japaneseName: string;
    icon: string;
    desc: string;
  };
  avatars: {
    emoji: string;
    label: string;
    desc: string;
  }[];
  title: string;
  borderStyle: string;
  badgeColor: string;
}

export const TOURNAMENT_REWARD_TIERS: TournamentRewardTier[] = [
  {
    winsRequired: 1,
    tierNumber: 1,
    tierName: "Juara Perdana (Chunin)",
    badge: {
      id: "tournament_champ_1",
      name: "Chunin Tournament Winner",
      japaneseName: "中忍選抜王者",
      icon: "🥉",
      desc: "Menjuarai 1x Turnamen Resmi Otsutsuki",
    },
    avatars: [
      { emoji: "🥋", label: "Sensei Turnamen", desc: "Instruktur Beladiri Pemenang Turnamen" },
      { emoji: "🦅", label: "Garuda Shinobi", desc: "Mata Elang Pemburu Kemenangan" },
    ],
    title: "Jawara Turnamen Otsutsuki",
    borderStyle: "border-amber-600/60 ring-2 ring-amber-600/30",
    badgeColor: "from-amber-700 to-amber-900 text-amber-200",
  },
  {
    winsRequired: 3,
    tierNumber: 2,
    tierName: "Dominator Arena (Jonin)",
    badge: {
      id: "tournament_champ_3",
      name: "Dominator Arena",
      japaneseName: "闘技場の覇者",
      icon: "🥈",
      desc: "Mendominasi 3x Turnamen Tanpa Ragu",
    },
    avatars: [
      { emoji: "🐉", label: "Naga Emas Otsutsuki", desc: "Naga Emas Pelindung Turnamen" },
      { emoji: "🔱", label: "Poseidon Shinobi", desc: "Tombak Trisula Penakluk Rintangan" },
    ],
    title: "Master Turnamen Tak Terkalahkan",
    borderStyle: "border-cyan-400 ring-2 ring-cyan-400/40 shadow-cyan-400/20",
    badgeColor: "from-cyan-600 to-blue-800 text-cyan-200",
  },
  {
    winsRequired: 5,
    tierNumber: 3,
    tierName: "Kage Legendaris Turnamen",
    badge: {
      id: "tournament_champ_5",
      name: "Kage Legenda Turnamen",
      japaneseName: "伝説の影王者",
      icon: "🥇",
      desc: "Diakui sebagai Kage Turnamen Resmi 5x",
    },
    avatars: [
      { emoji: "👹", label: "Susano'o Abadi", desc: "Armor Spiritual Tempur Penghancur Lawan" },
      { emoji: "👑", label: "Kaisar Shinobi", desc: "Mahkota Keemasan Penguasa Papan Turnamen" },
    ],
    title: "Pahlawan Perang Klan Otsutsuki",
    borderStyle: "border-yellow-400 ring-2 ring-yellow-400/60 shadow-yellow-400/30",
    badgeColor: "from-amber-400 to-yellow-600 text-stone-950 font-black",
  },
  {
    winsRequired: 10,
    tierNumber: 4,
    tierName: "Dewa Tertinggi Turnamen (Six Paths)",
    badge: {
      id: "tournament_champ_10",
      name: "Dewa Turnamen Tertinggi",
      japaneseName: "六道大筒木神",
      icon: "💎",
      desc: "Pencapaian Tertinggi 10x Juara Turnamen Otsutsuki",
    },
    avatars: [
      { emoji: "🌌", label: "Dewa Otsutsuki Ascended", desc: "Kekuatan Kosmik Six Paths Tertinggi" },
      { emoji: "☄️", label: "Chibaku Tensei", desc: "Daya Gravitasi Penakluk Seluruh Rival" },
    ],
    title: "Supreme God of Otsutsuki",
    borderStyle: "border-purple-400 ring-4 ring-purple-500/50 shadow-purple-500/50 animate-pulse",
    badgeColor: "from-purple-600 via-pink-600 to-indigo-800 text-white font-black",
  },
];

export const EXCLUSIVE_TOURNAMENT_AVATARS = TOURNAMENT_REWARD_TIERS.flatMap((tier) =>
  tier.avatars.map((avatar) => ({
    ...avatar,
    winsRequired: tier.winsRequired,
    tierName: tier.tierName,
    badge: tier.badge,
  }))
);

export const DEFAULT_AVATARS = [
  { emoji: "🥷", label: "Shinobi" },
  { emoji: "⚔️", label: "Samurai" },
  { emoji: "🦊", label: "Kitsune" },
  { emoji: "⚡", label: "Raikiri" },
  { emoji: "🌸", label: "Kunoichi" },
  { emoji: "🐲", label: "Ryu" },
];

export function getTournamentUnlockStatus(tournamentWins: number) {
  const safeWins = Math.max(0, tournamentWins || 0);
  const unlockedTiers = TOURNAMENT_REWARD_TIERS.filter((t) => safeWins >= t.winsRequired);
  const unlockedAvatars = new Set<string>([
    ...DEFAULT_AVATARS.map((a) => a.emoji),
    ...unlockedTiers.flatMap((t) => t.avatars.map((a) => a.emoji)),
  ]);
  const unlockedBadges = unlockedTiers.map((t) => t.badge);

  const highestTier = unlockedTiers[unlockedTiers.length - 1];
  const currentTitle = highestTier ? highestTier.title : "Peserta Turnamen Baru";

  const nextTier = TOURNAMENT_REWARD_TIERS.find((t) => safeWins < t.winsRequired);
  const winsToNextTier = nextTier ? nextTier.winsRequired - safeWins : 0;

  return {
    tournamentWins: safeWins,
    unlockedTiers,
    unlockedAvatars,
    unlockedBadges,
    currentTitle,
    nextTier,
    winsToNextTier,
    isAvatarUnlocked: (emoji: string) => unlockedAvatars.has(emoji),
    getAvatarRequirement: (emoji: string) =>
      EXCLUSIVE_TOURNAMENT_AVATARS.find((a) => a.emoji === emoji),
  };
}
