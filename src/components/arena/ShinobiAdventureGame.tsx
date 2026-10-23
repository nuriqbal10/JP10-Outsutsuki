"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Compass,
  Sparkles,
  Swords,
  Shield,
  Heart,
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  Flame,
  ChevronRight,
} from "lucide-react";
import { sfx } from "@/lib/soundEffects";
import { addXp, recordBattleOutcome, unlockBadge } from "@/lib/gamification";
import { advanceDailyQuest } from "@/lib/dailyQuests";

export interface AdventureStage {
  id: number;
  name: string;
  jpName: string;
  icon: string;
  locationName: string;
  desc: string;
  npcName: string;
  npcAvatar: string;
  dialogueIntro: string;
  contextPillar: string;
  question: {
    prompt: string;
    scenario: string;
    correctIndex: number;
    options: {
      japanese: string;
      romaji: string;
      indonesian: string;
    }[];
    explanation: string;
    grammarFormula: string;
  };
}

export const ADVENTURE_STAGES: AdventureStage[] = [
  {
    id: 1,
    name: "Dojo Pelatihan Tokyo",
    jpName: "東京道場 • 挨拶と自己紹介",
    icon: "🥋",
    locationName: "Tokyo Headquarters, Shinjuku",
    desc: "Memulai hari pertama kerja di perusahaan Jepang. Pahami tata krama salam (aisatsu) dan cara memperkenalkan diri secara sopan kepada atasan.",
    npcName: "Yamamoto Sensei",
    npcAvatar: "👴",
    dialogueIntro: "Selamat datang di divisi kami! Di tempat kerja Jepang, cara menyapa rekan dan atasan saat pertama kali bertemu menentukan kesan profesionalitas Anda.",
    contextPillar: "Pillar: Percakapan Santun (Keigo & Aisatsu)",
    question: {
      prompt: "Saat pertama kali diperkenalkan kepada rekan kerja satu divisi di kantor, ungkapan apa yang paling tepat dan sopan untuk menutup perkenalan diri?",
      scenario: "Situasi: Hari pertama orientasi kerja di kantor Tokyo.",
      correctIndex: 1,
      options: [
        { japanese: "じゃあ、また明日ね！", romaji: "Jaa, mata ashita ne!", indonesian: "Sampai jumpa besok, ya! (Terlalu santai/informal)" },
        { japanese: "どうぞよろしくお願いします。", romaji: "Douzo yoroshiku onegaishimasu.", indonesian: "Mohon bimbingan dan kerja samanya. (Sopan & standar profesional)" },
        { japanese: "お先に失礼します。", romaji: "Osaki ni shitsureeshimasu.", indonesian: "Saya permisi pulang duluan. (Ungkapan saat pulang kantor)" },
        { japanese: "お疲れ様でした。", romaji: "Otsukaresama deshita.", indonesian: "Terima kasih atas kerja kerasnya. (Setelah selesai tugas)" },
      ],
      explanation: "「どうぞよろしくお願いします」adalah salam standar wajib dalam perkenalan kerja untuk memohon kerja sama yang baik dengan rekan kerja dan atasan.",
      grammarFormula: "Nama + と申します (Tomoushimasu) + どうぞよろしくお願いします",
    },
  },
  {
    id: 2,
    name: "Lini Pabrik Industri Aichi",
    jpName: "愛知工場ライン • 安全確認と指示",
    icon: "⚙️",
    locationName: "Aichi Automotive Plant, Toyota City",
    desc: "Menghadapi instruksi mesin perakitan dan keselamatan kerja. Pahami pola perintah izin, larangan, dan prosedur darurat K3.",
    npcName: "Kuroda Shunin (Supervisor)",
    npcAvatar: "👷",
    dialogueIntro: "Perhatian! Mesin pres ini berbahaya. Sebelum tombol hijau ditekan, Anda harus memastikan tangan Anda tidak berada di dalam area cetakan!",
    contextPillar: "Pillar: Instruksi Kerja & K3 (〜てはいけません / 〜てください)",
    question: {
      prompt: "Supervisor memberi peringatan keras agar pekerja TIDAK menyentuh tuas mesin saat lampu merah menyala. Kalimat mana yang menyatakan LARANGAN mutlak tersebut?",
      scenario: "Situasi: Mesin hidrolik sedang dalam siklus pemanasan bersuhu tinggi.",
      correctIndex: 2,
      options: [
        { japanese: "レバーを触ってもいいです。", romaji: "Rebaa o sawattemo ii desu.", indonesian: "Boleh menyentuh tuas mesin. (Izin)" },
        { japanese: "レバーを触らなければなりません。", romaji: "Rebaa o sawaranakereba narimasen.", indonesian: "Harus menyentuh tuas mesin. (Keharusan)" },
        { japanese: "絶対にレバーに触ってはいけません。", romaji: "Zettai ni rebaa ni sawatte wa ikemasen.", indonesian: "Sama sekali tidak boleh menyentuh tuas mesin! (Larangan K3)" },
        { japanese: "レバーを触ったほうがいいです。", romaji: "Rebaa o sawatta hou ga ii desu.", indonesian: "Sebaiknya menyentuh tuas mesin. (Saran)" },
      ],
      explanation: "Pola bentuk『〜てはいけません』digunakan untuk menyatakan larangan keras (prohibition), sering dikombinasikan dengan kata「絶対に (zettai ni - mutlak/sama sekali)」di lingkungan pabrik.",
      grammarFormula: "Kata Kerja bentuk Te + はいけません (Te wa ikemasen)",
    },
  },
  {
    id: 3,
    name: "Izakaya & Kedai Shokudou",
    jpName: "居酒屋食堂 • 注文とおすすめ",
    icon: "🍶",
    locationName: "Shinbashi Izakaya District, Tokyo",
    desc: "Bergabung dalam acara makan malam santai (nomikai) bersama rekan kerja. Pelajari cara menanyakan rekomendasi dan memesan porsi makanan.",
    npcName: "Okami-san (Pemilik Kedai)",
    npcAvatar: "👩",
    dialogueIntro: "Irasshaimase! Malam ini ada menu ikan segar dan yakitori bakar. Mau pesan apa untuk pembuka bersama teman-teman?",
    contextPillar: "Pillar: Pemesanan Makanan & Rekomendasi (〜にします / おすすめ)",
    question: {
      prompt: "Anda ingin menanyakan hidangan apa yang paling direkomendasikan di restoran ini, dan memutuskan memesan menu set tempura. Pilihan mana yang tepat?",
      scenario: "Situasi: Membaca daftar menu makanan bersama rekan kerja.",
      correctIndex: 0,
      options: [
        { japanese: "おすすめは何ですか？天ぷら定食にします。", romaji: "Osusume wa nan desu ka? Tenpura teishoku ni shimasu.", indonesian: "Apa rekomendasi terbaik di sini? Saya pilih menu set tempura." },
        { japanese: "天ぷらは高いですか？食べたくないです。", romaji: "Tenpura wa takai desu ka? Tabetakunai desu.", indonesian: "Apakah tempura mahal? Saya tidak mau makan." },
        { japanese: "天ぷら定食を食べたことがあります。", romaji: "Tenpura teishoku o tabeta koto ga arimasu.", indonesian: "Saya pernah makan menu set tempura. (Pengalaman)" },
        { japanese: "天ぷらを残してください。", romaji: "Tenpura o nokoshite kudasai.", indonesian: "Tolong sisakan tempura untuk saya." },
      ],
      explanation: "「おすすめは何ですか」digunakan untuk meminta saran rekomendasi pelayan, dan「[Kata Benda] にします」adalah pola standar untuk menyatakan keputusan pilihan pesanan.",
      grammarFormula: "Kata Benda + にします (Ni shimasu - Saya memutuskan memilih...)",
    },
  },
  {
    id: 4,
    name: "Stasiun Shinkansen Kyoto",
    jpName: "新幹線京都駅 • 道案内と切符",
    icon: "🚅",
    locationName: "JR Kyoto Station, Central Gate",
    desc: "Melakukan perjalanan dinas ke wilayah Kansai. Navigasikan peron stasiun, pembelian tiket shinkansen, dan bertanya arah kepada petugas loket.",
    npcName: "Eki-in (Petugas Stasiun)",
    npcAvatar: "👨‍✈️",
    dialogueIntro: "Tiket kereta cepat tujuan Osaka dan Hiroshima tersedia di loket Midori no Madoguchi. Ada yang bisa saya bantu untuk jadwal keberangkatan?",
    contextPillar: "Pillar: Transportasi & Petunjuk Arah (何番線 / 〜で行けますか)",
    question: {
      prompt: "Anda ingin memastikan kereta Shinkansen tujuan Osaka berangkat dari peron nomor berapa. Bagaimana cara menanyakannya dengan benar?",
      scenario: "Situasi: Di depan papan jadwal elektronik peron stasiun besar.",
      correctIndex: 3,
      options: [
        { japanese: "大阪駅はどこにありますか？", romaji: "Oosaka-eki wa doko ni arimasu ka?", indonesian: "Stasiun Osaka ada di mana? (Menanyakan lokasi kota)" },
        { japanese: "新幹線は何時に到着しますか？", romaji: "Shinkansen wa nanji ni touchakushimasu ka?", indonesian: "Shinkansen tiba jam berapa? (Menanyakan kedatangan)" },
        { japanese: "切符をなくしてしまいました。", romaji: "Kippu o nakushite shimaimashita.", indonesian: "Saya tidak sengaja menghilangkan tiket. (Masalah tiket)" },
        { japanese: "大阪行きは何番線から出ますか？", romaji: "Oosaka-yuki wa nan-ban-sen kara demasu ka?", indonesian: "Tujuan Osaka berangkat dari peron nomor berapa? (Tepat & akurat)" },
      ],
      explanation: "「〜行き (yuki)」berarti 'tujuan...', dan「何番線 (nan-ban-sen)」adalah kata tanya untuk menanyakan nomor peron keberangkatan kereta.",
      grammarFormula: "Tempat + 行き (yuki) + は何番線から出ますか (wa nan-ban-sen kara demasu ka)",
    },
  },
  {
    id: 5,
    name: "Klinik & Apotek Sakura",
    jpName: "さくら総合クリニック • 症状説明と薬",
    icon: "🏥",
    locationName: "Sakura Medical Clinic, Osaka",
    desc: "Tiba-tiba mengalami demam dan pusing setelah bekerja. Jelaskan gejala sakit kepada dokter dan pahami petunjuk minum obat dari apoteker.",
    npcName: "Dr. Hayashi (Dokter Umum)",
    npcAvatar: "🩺",
    dialogueIntro: "Konnichiwa. Wajah Anda terlihat pucat. Boleh ceritakan sejak kapan Anda merasa tidak enak badan dan apa saja gejalanya?",
    contextPillar: "Pillar: Kesehatan & Gejala Medis (〜て、〜ので / 頭が痛い)",
    question: {
      prompt: "Anda ingin menjelaskan bahwa sejak kemarin demam dan kepala terasa sakit, sehingga hari ini ingin meminta surat istirahat dokter.",
      scenario: "Situasi: Konsultasi di ruang periksa dokter.",
      correctIndex: 1,
      options: [
        { japanese: "薬を飲んだので、元気になりました。", romaji: "Kusuri o nonda node, genki ni narimashita.", indonesian: "Karena sudah minum obat, saya sudah sehat bugar." },
        { japanese: "昨日から熱があって、頭も痛いんです。", romaji: "Kinou kara netsu ga atte, atama mo itai n desu.", indonesian: "Sejak kemarin demam, dan kepala saya juga sakit. (Menjelaskan gejala)" },
        { japanese: "風邪をひかないように気をつけています。", romaji: "Kaze o hikanai you ni ki o tsukete imasu.", indonesian: "Saya berhati-hati agar tidak masuk angin." },
        { japanese: "病院へ行く必要はありません。", romaji: "Byouin e iku hitsuyou wa arimasen.", indonesian: "Tidak perlu pergi ke rumah sakit." },
      ],
      explanation: "Pola『〜んです (n desu)』digunakan untuk memberikan penjelasan/latar belakang kondisi fisik kepada dokter secara alami.",
      grammarFormula: "Gejala 1 (Te-form) + Gejala 2 + んです (n desu)",
    },
  },
];

export default function ShinobiAdventureGame({ onBack }: { onBack: () => void }) {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [score, setScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameState, setGameState] = useState<"map" | "dialogue" | "quiz" | "stage_clear" | "game_over" | "all_clear">("map");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const currentStage = ADVENTURE_STAGES[currentStageIndex];

  const speakJapanese = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ja-JP";
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const handleSelectStage = (index: number) => {
    setCurrentStageIndex(index);
    setSelectedAnswer(null);
    setGameState("dialogue");
    sfx.playTick();
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    const isCorrect = index === currentStage.question.correctIndex;
    if (isCorrect) {
      sfx.playCorrect();
      setScore((s) => s + 800);
      speakJapanese(currentStage.question.options[index].japanese);
      setTimeout(() => {
        if (currentStageIndex + 1 >= ADVENTURE_STAGES.length) {
          handleAllClear();
        } else {
          setGameState("stage_clear");
        }
      }, 2500);
    } else {
      sfx.playWrong();
      const newHp = Math.max(0, playerHp - 25);
      setPlayerHp(newHp);

      if (newHp <= 0) {
        setTimeout(() => {
          sfx.playEliminated();
          recordBattleOutcome(false, "adventure");
          setGameState("game_over");
        }, 2000);
      }
    }
  };

  const handleNextStage = () => {
    setSelectedAnswer(null);
    setCurrentStageIndex((prev) => prev + 1);
    setGameState("dialogue");
    sfx.playSlash();
  };

  const handleAllClear = () => {
    sfx.playVictory();
    addXp(350, "Menyelesaikan Seluruh Petualangan Shinobi Quest (Irodori A2.2)");
    advanceDailyQuest("battle");
    recordBattleOutcome(true, "adventure", { bunpou: 5, mojiGoi: 5, dokkai: 5, choukai: 5, kanji: 5 });
    unlockBadge("shinobi_explorer");
    setGameState("all_clear");
  };

  const handleRestart = () => {
    setCurrentStageIndex(0);
    setPlayerHp(100);
    setScore(0);
    setSelectedAnswer(null);
    setGameState("map");
    sfx.playTick();
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 select-none font-sans">
      {/* HEADER BAR */}
      <div className="bg-gradient-to-r from-[#170a2c] via-[#240e44] to-[#120824] border-2 border-indigo-500/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-white transition"
              title="Kembali ke Lobi Arcade"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-xl flex items-center justify-center text-2xl">
              🗺️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-amber-300 tracking-tight">
                  SHINOBI ADVENTURE: IRODORI QUEST
                </h2>
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase rounded-full bg-indigo-500 text-white">
                  Story Mode A2.2
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-0.5 font-medium">
                Petualangan eksplorasi komprehensif mengintegrasikan tata bahasa, kosakata, K3 pabrik, dan etika Jepang.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Player HP */}
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3.5 py-1.5 rounded-xl">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <div className="text-xs font-black text-white">{playerHp} HP</div>
              <div className="w-20 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="bg-gradient-to-r from-rose-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${playerHp}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => {
                const muted = sfx.toggleMute();
                setIsMuted(muted);
              }}
              className="p-2 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* 1. INTERACTIVE WORLD MAP SCREEN */}
      {gameState === "map" && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white">
                  Peta Wilayah Petualangan Jepang (5 Destinasi Utama)
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-bold">
                ✓ Progresif 5 Skenario Nyata
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {ADVENTURE_STAGES.map((stg, idx) => {
                const isCompleted = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const isLocked = idx > currentStageIndex;

                return (
                  <div
                    key={stg.id}
                    onClick={() => {
                      if (!isLocked) handleSelectStage(idx);
                    }}
                    className={`p-5 rounded-3xl border-2 transition-all relative flex flex-col justify-between ${
                      isCurrent
                        ? "bg-gradient-to-b from-indigo-950/60 to-purple-950/40 border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02] cursor-pointer"
                        : isCompleted
                        ? "bg-slate-950/80 border-emerald-500/50 cursor-pointer"
                        : "bg-slate-950/40 border-slate-800/60 opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-3xl p-2 rounded-2xl bg-slate-900 border border-slate-700 shadow-inner">
                          {stg.icon}
                        </span>
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            TERSELESAIKAN ✔
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-stone-950 animate-pulse">
                            TAHAP AKTIF
                          </span>
                        )}
                        {isLocked && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-500">
                            TERKUNCI 🔒
                          </span>
                        )}
                      </div>

                      <div className="text-xs font-mono text-purple-300 font-black">
                        Stage #{stg.id}
                      </div>
                      <h4 className="text-base font-black text-white mt-0.5">
                        {stg.name}
                      </h4>
                      <p className="text-[11px] font-japanese font-bold text-slate-400 mt-0.5">
                        {stg.jpName}
                      </p>

                      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed line-clamp-3">
                        {stg.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-400 text-[11px] truncate max-w-[140px]">
                        {stg.locationName}
                      </span>
                      {!isLocked && (
                        <span className="text-amber-400 flex items-center gap-1">
                          Masuk ➔
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. DIALOGUE SCREEN */}
      {gameState === "dialogue" && currentStage && (
        <div className="bg-slate-900/90 border-2 border-indigo-500/50 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentStage.icon}</span>
              <div>
                <h3 className="text-lg font-black text-white">
                  {currentStage.name} ({currentStage.jpName})
                </h3>
                <span className="text-xs text-indigo-400 font-bold">{currentStage.locationName}</span>
              </div>
            </div>
            <button
              onClick={() => setGameState("map")}
              className="text-xs text-slate-400 hover:text-white underline"
            >
              Lihat Peta
            </button>
          </div>

          {/* NPC DIALOGUE BOX */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-purple-500/40 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
            <div className="w-20 h-20 rounded-2xl bg-purple-950 border border-purple-400 flex items-center justify-center text-4xl shadow-inner shrink-0">
              {currentStage.npcAvatar}
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="text-xs font-black text-amber-400 uppercase tracking-wide">
                {currentStage.npcName} Berbicara:
              </div>
              <p className="text-sm md:text-base text-slate-200 leading-relaxed font-medium">
                &ldquo;{currentStage.dialogueIntro}&rdquo;
              </p>
              <div className="text-xs text-purple-300 font-bold pt-1">
                🎯 {currentStage.contextPillar}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                setGameState("quiz");
                sfx.playSlash();
              }}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 text-stone-950 font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-105 transition"
            >
              <span>TERIMA TANTANGAN TATA BAHASA</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. SCENARIO QUIZ SCREEN */}
      {gameState === "quiz" && currentStage && (
        <div className="bg-slate-900/90 border-2 border-indigo-500/50 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Stage #{currentStage.id} • {currentStage.name}
            </span>
            <span className="text-xs font-bold text-amber-400 font-mono">
              Skor: {score} PTS
            </span>
          </div>

          {/* QUESTION PROMPT */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-xs font-mono text-purple-400 font-black uppercase">
              {currentStage.question.scenario}
            </div>
            <h3 className="text-base md:text-lg font-black text-white leading-relaxed">
              {currentStage.question.prompt}
            </h3>
          </div>

          {/* 4 CHOICES */}
          <div className="grid grid-cols-1 gap-3">
            {currentStage.question.options.map((opt, i) => {
              const isSelected = selectedAnswer === i;
              const isCorrect = i === currentStage.question.correctIndex;
              let style = "bg-slate-950 border-slate-800 text-slate-200 hover:border-purple-500";

              if (selectedAnswer !== null) {
                if (isCorrect) {
                  style = "bg-emerald-950/80 border-emerald-400 text-emerald-100 shadow-lg shadow-emerald-500/20";
                } else if (isSelected) {
                  style = "bg-rose-950/80 border-rose-500 text-rose-100 shadow-lg shadow-rose-500/20";
                } else {
                  style = "opacity-40 bg-slate-950 border-slate-900 text-slate-500";
                }
              }

              return (
                <button
                  key={i}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleAnswer(i)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between gap-4 ${style}`}
                >
                  <div className="space-y-1">
                    <div className="text-base md:text-lg font-black text-white font-japanese flex items-center gap-2">
                      <span>{opt.japanese}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakJapanese(opt.japanese);
                        }}
                        className="p-1 rounded-lg bg-black/40 hover:bg-black/80 text-amber-400"
                        title="Dengarkan Audio"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs font-mono text-purple-300">
                      {opt.romaji}
                    </div>
                    <div className="text-xs text-slate-300 font-medium">
                      {opt.indonesian}
                    </div>
                  </div>

                  {selectedAnswer !== null && isCorrect && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* EXPLANATION AFTER ANSWERING */}
          {selectedAnswer !== null && (
            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/40 space-y-2 animate-fade-in">
              <div className="text-xs font-black text-amber-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Pola Tata Bahasa & Pembahasan Kaidah:</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {currentStage.question.explanation}
              </p>
              <div className="text-xs font-mono text-purple-300 font-bold">
                Formula: {currentStage.question.grammarFormula}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. STAGE CLEAR SCREEN */}
      {gameState === "stage_clear" && (
        <div className="bg-slate-900/90 border-2 border-emerald-500/50 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-4xl shadow-xl shadow-emerald-500/20 animate-bounce">
            🎉
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">Stage #{currentStage.id} Dituntaskan!</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Anda berhasil menyelesaikan tantangan di {currentStage.name} ({currentStage.locationName}).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={handleNextStage}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400 text-stone-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition"
            >
              <span>LANJUT KE STAGE #{currentStageIndex + 2}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* 5. ALL CLEAR (GAME VICTORY) */}
      {gameState === "all_clear" && (
        <div className="bg-slate-900/90 border-2 border-amber-400 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-5xl shadow-xl shadow-amber-500/20 animate-bounce">
            👑
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl md:text-3xl font-black text-amber-300">
              PENJELAJAH IRODORI LEGENDARIS!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Selamat! Anda telah menyelesaikan seluruh 5 stage skenario otentik Jepang. Penguasaan tata bahasa, etika kantor, rambu K3 pabrik, dan percakapan medis Anda resmi diakui!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 max-w-sm mx-auto text-xs text-amber-400 font-bold flex items-center justify-center gap-2">
            <Award className="w-5 h-5" />
            <span>Badge Terbuka: 🗺️ Penjelajah Dunia Irodori (+350 XP)</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={handleRestart}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-stone-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition"
            >
              <RotateCcw className="w-4 h-4" /> Ulangi Petualangan
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider transition"
            >
              Kembali ke Lobi Arcade
            </button>
          </div>
        </div>
      )}

      {/* 6. GAME OVER */}
      {gameState === "game_over" && (
        <div className="bg-slate-900/90 border-2 border-rose-500 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-4xl shadow-xl shadow-rose-500/20">
            💀
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">Chakra Shinobi Habis!</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              HP Anda mencapai 0 karena beberapa kesalahan fatal dalam kaidah bahasa dan instruksi kerja.
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg mx-auto hover:scale-105 transition"
          >
            <RotateCcw className="w-4 h-4" /> Coba Lagi dari Awal
          </button>
        </div>
      )}
    </div>
  );
}
