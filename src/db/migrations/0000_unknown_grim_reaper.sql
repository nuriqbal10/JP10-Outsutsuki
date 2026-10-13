CREATE TABLE "exam_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"exam_type" varchar(50) NOT NULL,
	"chapter" integer,
	"total_score" integer DEFAULT 0,
	"max_score" integer DEFAULT 250,
	"score_moji_goi" integer DEFAULT 0,
	"score_kaiwa" integer DEFAULT 0,
	"score_choukai" integer DEFAULT 0,
	"score_dokkai" integer DEFAULT 0,
	"is_passed" boolean DEFAULT false,
	"answers_json" jsonb,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" varchar(20) DEFAULT 'A2.2' NOT NULL,
	"chapter" integer NOT NULL,
	"section" varchar(50) NOT NULL,
	"question_number" integer NOT NULL,
	"stimulus_text" text,
	"audio_r2_url" text,
	"image_r2_url" text,
	"question_text" text NOT NULL,
	"option_a" text NOT NULL,
	"option_b" text NOT NULL,
	"option_c" text NOT NULL,
	"option_d" text,
	"answer_key" varchar(5) NOT NULL,
	"explanation" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_vocab_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"vocab_id" integer NOT NULL,
	"status" varchar(20) DEFAULT 'new' NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"next_review_date" timestamp,
	"last_reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"clerk_id" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"role" varchar(50) DEFAULT 'student' NOT NULL,
	"target_exam_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "vocabularies" (
	"id" serial PRIMARY KEY NOT NULL,
	"level" varchar(20) NOT NULL,
	"chapter" integer NOT NULL,
	"midashi" varchar(255) NOT NULL,
	"yomi" varchar(255) NOT NULL,
	"accent" varchar(100),
	"romaji" varchar(150),
	"id_arti" text NOT NULL,
	"en_meaning" text,
	"pos" varchar(50) DEFAULT 'N',
	"info" text,
	"audio_r2_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exam_sessions" ADD CONSTRAINT "exam_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_vocab_progress" ADD CONSTRAINT "user_vocab_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_vocab_progress" ADD CONSTRAINT "user_vocab_progress_vocab_id_vocabularies_id_fk" FOREIGN KEY ("vocab_id") REFERENCES "public"."vocabularies"("id") ON DELETE cascade ON UPDATE no action;