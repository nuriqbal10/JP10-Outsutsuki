import { pgTable, serial, text, varchar, integer, boolean, timestamp, jsonb, bigint } from "drizzle-orm/pg-core";

// ==============================================================================
// 1. USERS & PROFILES (Synced from Clerk Webhooks)
// ==============================================================================
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Using Clerk user ID or UUID
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  role: varchar("role", { length: 50 }).default("student").notNull(), // 'student', 'teacher', 'admin'
  targetExamDate: timestamp("target_exam_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ==============================================================================
// 2. MASTER VOCABULARY (4,245 Words across A1, A2.1, A2.2)
// ==============================================================================
export const vocabularies = pgTable("vocabularies", {
  id: serial("id").primaryKey(),
  level: varchar("level", { length: 20 }).notNull(), // 'A1', 'A2.1', 'A2.2'
  chapter: integer("chapter").notNull(), // 1 to 18
  midashi: varchar("midashi", { length: 255 }).notNull(), // Kanji / Standard representation
  yomi: varchar("yomi", { length: 255 }).notNull(), // Kana / Furigana
  accent: varchar("accent", { length: 100 }), // Pitch accent text
  romaji: varchar("romaji", { length: 150 }),
  idArti: text("id_arti").notNull(), // Indonesian translation
  enMeaning: text("en_meaning"),
  pos: varchar("pos", { length: 50 }).default("N"), // N, V［1］, V［2］, V［3］, イA, ナA, Exp
  info: text("info"), // Supplementary / cultural notes
  audioR2Url: text("audio_r2_url"), // Cloudflare R2 audio URL
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==============================================================================
// 3. USER VOCABULARY PROGRESS (Spaced Repetition System / SRS)
// ==============================================================================
export const userVocabProgress = pgTable("user_vocab_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  vocabId: integer("vocab_id").references(() => vocabularies.id, { onDelete: "cascade" }).notNull(),
  status: varchar("status", { length: 20 }).default("new").notNull(), // 'new', 'learning', 'memorized'
  reviewCount: integer("review_count").default(0).notNull(),
  nextReviewDate: timestamp("next_review_date"),
  lastReviewedAt: timestamp("last_reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==============================================================================
// 4. JFT-BASIC A2 QUESTION BANK (CBT Standard)
// ==============================================================================
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  level: varchar("level", { length: 20 }).default("A2.2").notNull(),
  chapter: integer("chapter").notNull(), // 0 for Fukushuu, 1 to 18 for Bab
  section: varchar("section", { length: 50 }).notNull(), // 'moji_goi', 'kaiwa_hyougen', 'choukai', 'dokkai'
  questionNumber: integer("question_number").notNull(),
  stimulusText: text("stimulus_text"), // Text stimulus or conversation
  audioR2Url: text("audio_r2_url"), // Cloudflare R2 audio URL for Choukai
  imageR2Url: text("image_r2_url"), // Cloudflare R2 image URL for Dokkai / Moji
  questionText: text("question_text").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d"), // Nullable for authentic 3-option CBT items
  answerKey: varchar("answer_key", { length: 5 }).notNull(), // 'a', 'b', 'c', 'd'
  explanation: text("explanation"), // Detailed explanation & Indonesian translation
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ==============================================================================
// 5. EXAM SESSIONS & CBT SIMULATOR RESULTS
// ==============================================================================
export const examSessions = pgTable("exam_sessions", {
  id: text("id").primaryKey(), // UUID
  userId: text("user_id"), // Optional Clerk user ID or Guest
  studentName: text("student_name"), // Nama peserta
  examType: varchar("exam_type", { length: 50 }).notNull(), // 'chapter_practice', 'fukushuu_cbt', 'full_simulation'
  chapter: integer("chapter"),
  totalScore: integer("total_score").default(0),
  maxScore: integer("max_score").default(250),
  scoreMojiGoi: integer("score_moji_goi").default(0),
  scoreKaiwa: integer("score_kaiwa").default(0),
  scoreChoukai: integer("score_choukai").default(0),
  scoreDokkai: integer("score_dokkai").default(0),
  isPassed: boolean("is_passed").default(false),
  answersJson: jsonb("answers_json"), // Recorded answers
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// ==============================================================================
// 6. LKPD (LEMBAR KERJA PESERTA DIDIK) SUBMISSIONS & ASSIGNMENTS
// ==============================================================================
export const lkpdSubmissions = pgTable("lkpd_submissions", {
  id: text("id").primaryKey(), // UUID
  userId: text("user_id"), // Optional user ID or Guest
  studentName: text("student_name").notNull(),
  chapter: integer("chapter").notNull(),
  answersJson: jsonb("answers_json").notNull(), // Form responses / tasks
  fileAttachmentUrl: text("file_attachment_url"), // Optional uploaded file / link
  status: varchar("status", { length: 20 }).default("submitted").notNull(), // 'draft', 'submitted', 'graded'
  score: integer("score"), // 0 - 100
  feedback: text("feedback"), // Catatan / evaluasi dari Sensei
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  gradedAt: timestamp("graded_at"),
});

// ==============================================================================
// 7. MULTIPLAYER BATTLE ROYALE ROOMS (Cross-Instance Real-Time Sync)
// ==============================================================================
export const battleRooms = pgTable("battle_rooms", {
  id: text("id").primaryKey(),
  mode: text("mode").notNull(),
  roomCode: text("room_code").notNull(),
  requiredCount: integer("required_count").notNull(),
  status: text("status").notNull(),
  countdownSeconds: integer("countdown_seconds").notNull(),
  topicLevel: text("topic_level").notNull(),
  topicChapter: integer("topic_chapter").notNull(),
  topicCategory: text("topic_category").notNull(),
  participants: jsonb("participants").notNull(),
  updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Vocabulary = typeof vocabularies.$inferSelect;
export type NewVocabulary = typeof vocabularies.$inferInsert;
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type ExamSession = typeof examSessions.$inferSelect;
export type NewExamSession = typeof examSessions.$inferInsert;
export type LkpdSubmission = typeof lkpdSubmissions.$inferSelect;
export type NewLkpdSubmission = typeof lkpdSubmissions.$inferInsert;
export type BattleRoomEntity = typeof battleRooms.$inferSelect;
export type NewBattleRoomEntity = typeof battleRooms.$inferInsert;

