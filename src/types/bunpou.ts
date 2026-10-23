export interface BunpouPuzzle {
  sentence: string;
  translation: string;
  tokens: string[];
  shuffledTokens?: string[];
}

export interface BunpouConnectionForm {
  category: string;
  rule: string;
  examples: string[];
}

export interface BunpouRelatedPattern {
  target: string;
  relation: "serupa" | "lawan" | "perbedaan" | "dasar" | "lanjutan";
  comparison: string;
}

export interface BunpouItem {
  id: string;
  level: "a1" | "a2-1" | "a2-2";
  levelJapanese: "入門" | "初級1" | "初級2";
  lesson: number;
  topic: string;
  lessonTitle: string;
  num: string;
  pattern: string;
  example: string;
  marugoto: string;
  formulaDetailed?: string;
  meaning?: string;
  usageRule?: string;
  connectionForms?: BunpouConnectionForm[];
  relatedPatterns?: BunpouRelatedPattern[];
  puzzle?: BunpouPuzzle;
}

export type BunpouLevelFilter = "all" | "a1" | "a2-1" | "a2-2";
