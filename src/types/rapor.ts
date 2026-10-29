export interface DaiTesutoScores {
  mojiGoi: number;
  kaiwa: number;
  choukai: number;
  dokkai: number;
  total: number;
}

export interface ChapterScoreItem {
  chapter: number;
  daiTesuto: DaiTesutoScores;
  kanji: number;
  kotoba: number;
  honyaku: number;
}

export interface FukushuuExamItem {
  test: {
    mojiGoi: number;
    kaiwa: number;
    choukai: number;
    dokkai: number;
    total: number;
  };
  kanji: number;
  kotoba: number;
  honyaku: number;
}

export interface StudentBadge {
  icon: string;
  name: string;
}

export interface StudentAverages {
  daiTest?: number;
  mojiGoi?: number;
  kaiwa?: number;
  choukai?: number;
  dokkai?: number;
  kanji?: number;
  kotoba?: number;
  honyaku?: number;
}

export interface StudentSummary {
  completedBabs?: number;
  totalBabs?: number;
  compositeScore?: number;
}

export interface StudentRaporItem {
  no: number;
  nim?: string;
  name: string;
  avatarColor: string;
  xp?: number;
  playerLevel?: string;
  badges?: any[];
  rank?: number;
  harian: any[];
  fukushuu1?: FukushuuExamItem;
  fukushuu2?: FukushuuExamItem;
  fukushuu3?: FukushuuExamItem;
  finalExam?: FukushuuExamItem;
  averages?: StudentAverages;
  summary?: StudentSummary;
  compositeScore?: number;
  grade?: string;
  strongestAspect?: string;
  weakestAspect?: string;
  senseiNote?: string;
  senseiRecommendation?: string;
  pilar?: {
    mojiGoi: number;
    kaiwa: number;
    choukai: number;
    dokkai: number;
    kanji: number;
  };
}

export interface ChapterClassAverage {
  chapter: number;
  average: number;
  studentCount: number;
}

export interface ClassSummary {
  average?: number;
  classAverage?: number;
  highest?: number;
  studentCount?: number;
  activeCount?: number;
}

export interface LevelRaporData {
  key: string;
  title: string;
  sub: string;
  students: StudentRaporItem[];
  rankedStudents?: StudentRaporItem[];
  classSummary?: ClassSummary;
  chapterClassAverages?: ChapterClassAverage[];
  classPilarAvg?: {
    mojiGoi: number;
    kaiwa: number;
    choukai: number;
    dokkai: number;
    kanji: number;
  };
  classRawSectionAvg?: {
    mojiGoi: number;
    kaiwa: number;
    choukai: number;
    dokkai: number;
    kanji: number;
    kotoba: number;
    honyaku: number;
  };
  classFinalExamAvg?: {
    mojiGoi: number;
    kaiwa: number;
    choukai: number;
    dokkai: number;
    total: number;
    kanji: number;
    pctMoji: number;
    pctKaiwa: number;
    pctChoukai: number;
    pctDokkai: number;
    passCount: number;
    totalStudents: number;
    passRate: number;
    weakestSection?: { id: string; name: string; pct: number; avg: number; max: number };
    strongestSection?: { id: string; name: string; pct: number; avg: number; max: number };
  };
}

export interface MasterRaporData {
  levels: {
    A1: LevelRaporData;
    A21: LevelRaporData;
    A22: LevelRaporData;
  };
}
