export interface SeriesQuestionItem {
  id: number;
  chapter: number;
  section: "moji_goi" | "kaiwa_hyougen" | "choukai" | "dokkai";
  questionNumber: number;
  questionText: string;
  stimulusText?: string;
  audioText?: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD?: string;
  answerKey: string;
  explanation: string;
}

export interface SeriesLkpdData {
  chapter: number;
  level: "a1" | "a2-1";
  titleJa: string;
  titleId: string;
  topic: string;
  canDoObjectives: string[];
  kanaOrKanjiDrill: {
    character: string;
    reading: string;
    meaning: string;
    sampleWord: string;
  }[];
  grammarDrill: {
    prompt: string;
    pattern: string;
    sampleAnswer: string;
  }[];
  translationDrill: {
    ja: string;
    id: string;
    situation: string;
  }[];
  reflectionPrompts: string[];
}

// Generate authentic CBT questions for A1 chapters (Bab 1 - 18)
export const A1_CBT_QUESTIONS: Record<number, SeriesQuestionItem[]> = {
  1: [
    {
      id: 10101,
      chapter: 1,
      section: "moji_goi",
      questionNumber: 1,
      questionText: "Bagaimana cara membaca huruf hiragana berikut ini?\n「あさ」",
      optionA: "asa",
      optionB: "isi",
      optionC: "oso",
      optionD: "usa",
      answerKey: "A",
      explanation: "Huruf あ (a) dan さ (sa) dibaca 'asa' yang bermakna pagi hari."
    },
    {
      id: 10102,
      chapter: 1,
      section: "moji_goi",
      questionNumber: 2,
      questionText: "Pilihlah penulisan katakana yang benar untuk kata serapan 'Kamera'!",
      optionA: "カメラ",
      optionB: "コメラ",
      optionC: "カモラ",
      optionD: "キメラ",
      answerKey: "A",
      explanation: "Kamera dalam katakana ditulis カメラ (ka-me-ra)."
    },
    {
      id: 10103,
      chapter: 1,
      section: "kaiwa_hyougen",
      questionNumber: 3,
      questionText: "A: おはようございます。\nB: （　　　　　）。",
      optionA: "おはようございます",
      optionB: "さようなら",
      optionC: "失礼します",
      optionD: "すみません",
      answerKey: "A",
      explanation: "Salam 'Ohayou gozaimasu' (Selamat pagi) dibalas dengan ucapan yang sama."
    },
    {
      id: 10104,
      chapter: 1,
      section: "choukai",
      questionNumber: 4,
      questionText: "Dengarkan audio berikut! Huruf apakah yang diucapkan oleh penutur?",
      audioText: "あいうえお",
      optionA: "A - I - U - E - O",
      optionB: "Ka - Ki - Ku - Ke - Ko",
      optionC: "Sa - Shi - Su - Se - So",
      optionD: "Ta - Chi - Tsu - Te - To",
      answerKey: "A",
      explanation: "Audio melafalkan deret vokal utama bahasa Jepang: a-i-u-e-o."
    },
    {
      id: 10105,
      chapter: 1,
      section: "dokkai",
      questionNumber: 5,
      stimulusText: "【教室の掲示】\nひらがな　テスト：あした　９じ",
      questionText: "Kapan tes hiragana akan dilaksanakan berdasarkan pengumuman di atas?",
      optionA: "Besok jam 9",
      optionB: "Hari ini jam 9",
      optionC: "Besok jam 10",
      optionD: "Lusa jam 8",
      answerKey: "A",
      explanation: "あした (ashita = besok) ９じ (ku-ji = jam 9)."
    }
  ],
  2: [
    {
      id: 10201,
      chapter: 2,
      section: "moji_goi",
      questionNumber: 1,
      questionText: "Pilihlah arti yang tepat dari ungkapan sapaan 「こんにちは」!",
      optionA: "Selamat siang / Halo",
      optionB: "Selamat malam",
      optionC: "Selamat tinggal",
      optionD: "Terima kasih",
      answerKey: "A",
      explanation: "Konnichiwa digunakan sebagai salam di siang hari atau sapaan umum."
    },
    {
      id: 10202,
      chapter: 2,
      section: "kaiwa_hyougen",
      questionNumber: 2,
      questionText: "Saat rekan kerja membantu Anda mengangkat barang di pabrik, apa yang Anda ucapkan?",
      optionA: "ありがとうございます",
      optionB: "おやすみなさい",
      optionC: "はじめまして",
      optionD: "ごちそうさまでした",
      answerKey: "A",
      explanation: "Arigatou gozaimasu digunakan untuk menyatakan rasa terima kasih."
    },
    {
      id: 10203,
      chapter: 2,
      section: "choukai",
      questionNumber: 3,
      questionText: "Dengarkan audio berikut! Ungkapan apakah yang diucapkan saat berpamitan pulang kerja?",
      audioText: "おつかれさまでした。おさきにしつれいします。",
      optionA: "Otsukaresama deshita. Osaki ni shitsurei shimasu.",
      optionB: "Itadakimasu. Gochisousama deshita.",
      optionC: "Konnichiwa. Genki desu ka.",
      optionD: "Gomen kudasai. Sayounara.",
      answerKey: "A",
      explanation: "Etiket kerja di Jepang saat pulang lebih dulu adalah 'Osaki ni shitsurei shimasu'."
    },
    {
      id: 10204,
      chapter: 2,
      section: "dokkai",
      questionNumber: 4,
      stimulusText: "【クラスのあいさつ】\nじゅぎょうの　あと：\nせんせい「また　らいしゅう」\nがくせい「しつれいします」",
      questionText: "Kapan pertemuan kelas berikutnya akan diadakan?",
      optionA: "Minggu depan (らいしゅう)",
      optionB: "Besok lusa",
      optionC: "Bulan depan",
      optionD: "Hari ini",
      answerKey: "A",
      explanation: "また らいしゅう (mata raishuu) berarti 'sampai jumpa minggu depan'."
    }
  ],
  3: [
    {
      id: 10301,
      chapter: 3,
      section: "moji_goi",
      questionNumber: 1,
      questionText: "Pilihlah kosakata yang bermakna 'Indonesia' dalam katakana!",
      optionA: "インドネシア",
      optionB: "マレーシア",
      optionC: "フィリピン",
      optionD: "タイランド",
      answerKey: "A",
      explanation: "Negara Indonesia ditulis dalam katakana sebagai インドネシア."
    },
    {
      id: 10302,
      chapter: 3,
      section: "kaiwa_hyougen",
      questionNumber: 2,
      questionText: "A: はじめまして。アグスです。インドネシアから来ました。\nB: （　　　　　）。",
      optionA: "田中です。よろしくお願いします。",
      optionB: "いいえ、ちがいます。",
      optionC: "さようなら。",
      optionD: "どういたしまして。",
      answerKey: "A",
      explanation: "Respons perkenalan awal adalah menyebutkan nama diri dan diikuti 'Yoroshiku onegaishimasu'."
    },
    {
      id: 10303,
      chapter: 3,
      section: "choukai",
      questionNumber: 3,
      questionText: "Dengarkan audio berikut! Dari negara manakah penutur berasal?",
      audioText: "はじめまして、マリアです。フィリピンからきました。どうぞよろしくおねがいします。",
      optionA: "Filipina (フィリピン)",
      optionB: "Vietnam (ベトナム)",
      optionC: "Jepang (にほん)",
      optionD: "Indonesia (インドネシア)",
      answerKey: "A",
      explanation: "Penutur menyatakan 'Firipin kara kimashita' (berasal dari Filipina)."
    },
    {
      id: 10304,
      chapter: 3,
      section: "dokkai",
      questionNumber: 4,
      stimulusText: "【名刺・Kartu Nama】\n大筒木工業（株）\n研修生：リツキ・プラタマ\n出身：バンドン（インドネシア）",
      questionText: "Siapakah nama pekerja magang pada kartu nama tersebut dan dari mana asalnya?",
      optionA: "Rizki Pratama dari Bandung",
      optionB: "Agus Santoso dari Jakarta",
      optionC: "Maria dari Manila",
      optionD: "Tanaka dari Tokyo",
      answerKey: "A",
      explanation: "Tertulis: リツキ・プラタマ (Rizki Pratama), 出身: バンドン (Bandung)."
    }
  ]
};

// Generate authentic CBT questions for A2.1 chapters (Bab 1 - 18)
export const A21_CBT_QUESTIONS: Record<number, SeriesQuestionItem[]> = {
  1: [
    {
      id: 20101,
      chapter: 1,
      section: "moji_goi",
      questionNumber: 1,
      questionText: "Pilihlah cara baca kanji yang digarisbawahi:「私の【同僚】は親切です。」",
      optionA: "どうりょう (douryou)",
      optionB: "ともだち (tomodachi)",
      optionC: "じょうし (joushi)",
      optionD: "せんぱい (senpai)",
      answerKey: "A",
      explanation: "Kanji 同僚 dibaca どうりょう (douryou) yang bermakna rekan sekerja."
    },
    {
      id: 20102,
      chapter: 1,
      section: "kaiwa_hyougen",
      questionNumber: 2,
      questionText: "A: 田中さん、今週末、いっしょに映画を見に行きませんか。\nB: ああ、今週末はちょっと（　　　　　）。",
      optionA: "都合が悪いです",
      optionB: "行きましょう",
      optionC: "暇です",
      optionD: "うれしいです",
      answerKey: "A",
      explanation: "Untuk menolak ajakan secara halus, orang Jepang menggunakan ungkapan 'Tsugou ga warui desu' (Jadwal saya sedang kurang pas)."
    },
    {
      id: 20103,
      chapter: 1,
      section: "choukai",
      questionNumber: 3,
      questionText: "Dengarkan audio berikut! Kegiatan apakah yang diajak oleh pembicara?",
      audioText: "土曜日にみんなでバーベキューをしませんか。お肉や野菜もたくさん用意しますよ。",
      optionA: "Barbekyu bersama pada hari Sabtu",
      optionB: "Pergi menonton bioskop",
      optionC: "Belanja ke supermarket",
      optionD: "Bermain sepak bola di taman",
      answerKey: "A",
      explanation: "Pembicara mengajak 'doyoubi ni baabekyuu o shimasen ka'."
    },
    {
      id: 20104,
      chapter: 1,
      section: "dokkai",
      questionNumber: 4,
      stimulusText: "【社内チャット】\n大筒木：みなさん、来週の水曜日の夜、新入社員の歓迎会を開きます。場所は駅前の居酒屋です。参加できる人は月曜日までに連絡してください。",
      questionText: "Kapan batas akhir konfirmasi keikutsertaan acara pesta penyambutan?",
      optionA: "Hari Senin (月曜日までに)",
      optionB: "Hari Rabu (水曜日)",
      optionC: "Hari Selasa",
      optionD: "Minggu malam",
      answerKey: "A",
      explanation: "Tertulis jelas: 'Getsuyoubi made ni renraku shite kudasai'."
    }
  ],
  2: [
    {
      id: 20201,
      chapter: 2,
      section: "moji_goi",
      questionNumber: 1,
      questionText: "Pilihlah kanji yang tepat untuk kata sifat 'segar / ceria' (akarui):",
      optionA: "明るい",
      optionB: "暗い",
      optionC: "高い",
      optionD: "早い",
      answerKey: "A",
      explanation: "Kanji 明るい dibaca akarui yang bermakna ceria, terang, atau ramah."
    },
    {
      id: 20202,
      chapter: 2,
      section: "kaiwa_hyougen",
      questionNumber: 2,
      questionText: "A: スミスさんはどんな人ですか。\nB: いつも笑顔で、とても（　　　　　）人ですよ。",
      optionA: "親切な",
      optionB: "静かな",
      optionC: "冷たい",
      optionD: "怖い",
      answerKey: "A",
      explanation: "Pasangan dari 'selalu tersenyum' (egao) adalah orang yang ramah/baik hati (shinsetsu na hito)."
    },
    {
      id: 20203,
      chapter: 2,
      section: "choukai",
      questionNumber: 3,
      questionText: "Dengarkan deskripsi ciri-ciri orang pada audio berikut! Orang manakah yang dimaksud?",
      audioText: "あそこで青い作業着を着て、メガネをかけている人が鈴木主任です。",
      optionA: "Orang yang memakai pakaian kerja biru dan berkacamata",
      optionB: "Orang yang memakai helm kuning dan celana hitam",
      optionC: "Orang berambut pendek tanpa kacamata",
      optionD: "Orang yang membawa map merah",
      answerKey: "A",
      explanation: "'Aoi sagyougi o kite' (memakai seragam kerja biru), 'megane o kakete iru' (memakai kacamata)."
    },
    {
      id: 20204,
      chapter: 2,
      section: "dokkai",
      questionNumber: 4,
      stimulusText: "【掲示板・職場紹介】\n今月のMVPスタッフ：アリさん（入社1年目）\n性格：まじめで丁寧。仕事が早くて正確です。\n趣味：休みの日に日本の山に登ること。",
      questionText: "Apa kepribadian dan kebiasaan Ali saat hari libur?",
      optionA: "Rajin dan teliti, hobinya mendaki gunung di Jepang saat libur",
      optionB: "Pendiam, hobinya memasak makanan pedas",
      optionC: "Santai, hobinya bermain game",
      optionD: "Cepat marah saat jam lembur",
      answerKey: "A",
      explanation: "性格: まじめで丁寧 (rajin & sopan/teliti), 趣味: 日本の山に登ること (mendaki gunung)."
    }
  ]
};

// Authentic LKPD Worksheet Data for Irodori A1 & A2.1
export const SERIES_LKPD_CATALOG: Record<string, Record<number, SeriesLkpdData>> = {
  "irodori-a1": {
    1: {
      chapter: 1,
      level: "a1",
      titleJa: "第1課「ひらがな・カタカナ」",
      titleId: "Sistem Huruf & Fonetik Dasar Bahasa Jepang",
      topic: "Pengenalan Bunyi Vokal Dasar, Dakuon, Handakuon & Sapaan Awal",
      canDoObjectives: [
        "Mampu mengenali dan membaca huruf Hiragana & Katakana dasar.",
        "Mampu melafalkan 5 vokal dasar Jepang (A - I - U - E - O) dengan artikulasi jernih.",
        "Mampu membedakan bunyi panjang (chouon) dan bunyi dobel (sokuon)."
      ],
      kanaOrKanjiDrill: [
        { character: "あ", reading: "a", meaning: "vokal A", sampleWord: "朝 (asa - pagi)" },
        { character: "い", reading: "i", meaning: "vokal I", sampleWord: "家 (ie - rumah)" },
        { character: "う", reading: "u", meaning: "vokal U", sampleWord: "海 (umi - laut)" },
        { character: "え", reading: "e", meaning: "vokal E", sampleWord: "駅 (eki - stasiun)" },
        { character: "お", reading: "o", meaning: "vokal O", sampleWord: "お金 (okane - uang)" }
      ],
      grammarDrill: [
        {
          prompt: "Tuliskan salam saat tiba di pabrik pagi hari:",
          pattern: "おはようございます",
          sampleAnswer: "おはようございます (Selamat pagi)."
        },
        {
          prompt: "Tuliskan ungkapan pamit pulang kerja:",
          pattern: "おつかれさまでした",
          sampleAnswer: "おつかれさまでした (Terima kasih atas kerja kerasnya)."
        }
      ],
      translationDrill: [
        { ja: "はじめまして", id: "Senang bertemu dengan Anda (awal perkenalan)", situation: "Bertemu pertama kali di asrama/pabrik" },
        { ja: "ありがとうございます", id: "Terima kasih banyak", situation: "Diberi bantuan oleh instruktur" }
      ],
      reflectionPrompts: [
        "Huruf hiragana mana yang paling menantang untuk Anda tulis dengan urutan goresan benar?",
        "Apakah Anda sudah bisa melafalkan perbedaan vokal pendek dan vokal panjang?"
      ]
    },
    2: {
      chapter: 2,
      level: "a1",
      titleJa: "第2課「こんにちは」",
      titleId: "Salam & Ungkapan Sehari-hari di Tempat Kerja & Asrama",
      topic: "Etiket Menyapa, Berpamitan, Meminta Maaf & Berterima Kasih",
      canDoObjectives: [
        "Mampu menyapa instruktur dan rekan kerja sesuai waktu (pagi, siang, malam).",
        "Mampu menyampaikan ucapan terima kasih dan permohonan maaf dengan sopan.",
        "Mampu merespons sapaan orang lain di lingkungan kerja."
      ],
      kanaOrKanjiDrill: [
        { character: "か", reading: "ka", meaning: "suku kata Ka", sampleWord: "川 (kawa - sungai)" },
        { character: "き", reading: "ki", meaning: "suku kata Ki", sampleWord: "木 (ki - pohon)" },
        { character: "く", reading: "ku", meaning: "suku kata Ku", sampleWord: "車 (kuruma - mobil)" },
        { character: "け", reading: "ke", meaning: "suku kata Ke", sampleWord: "毛 (ke - rambut/bulu)" },
        { character: "こ", reading: "ko", meaning: "suku kata Ko", sampleWord: "声 (koe - suara)" }
      ],
      grammarDrill: [
        {
          prompt: "Lengkapi dialog: A: すみません。 B: （　　　　）。",
          pattern: "いいえ / どういたしまして",
          sampleAnswer: "いいえ、大丈夫ですよ。"
        }
      ],
      translationDrill: [
        { ja: "失礼します", id: "Permisi (saat masuk ruangan atau izin pamit)", situation: "Masuk ke ruang pimpinan" }
      ],
      reflectionPrompts: [
        "Sudahkah Anda mempraktikkan sapaan Konnichiwa dan Otsukaresama dengan rekan sekelas?"
      ]
    }
  },
  "irodori-a2-1": {
    1: {
      chapter: 1,
      level: "a2-1",
      titleJa: "第1課「休みの日は何をしていますか」",
      titleId: "Kegiatan di Hari Libur, Hobi & Mengajak Rekan",
      topic: "Menceritakan Hobi, Waktu Luang & Etiket Mengajak / Merespons Ajakan",
      canDoObjectives: [
        "Mampu menceritakan kegiatan yang biasa dilakukan saat hari libur kerja.",
        "Mampu mengajak rekan kerja untuk pergi beraktivitas bersama (〜ませんか／〜ましょう).",
        "Mampu menerima ajakan atau menolak secara halus tanpa menyinggung perasaan lawan bicara."
      ],
      kanaOrKanjiDrill: [
        { character: "休", reading: "やす（む）/ キュウ", meaning: "Istirahat / Libur", sampleWord: "休日 (kyuujitsu - hari libur)" },
        { character: "見", reading: "み（る）/ ケン", meaning: "Melihat / Menonton", sampleWord: "見学 (kengaku - studi banding)" },
        { character: "友", reading: "とも / ユウ", meaning: "Teman", sampleWord: "友達 (tomodachi - sahabat)" },
        { character: "行", reading: "い（く）/ コウ", meaning: "Pergi", sampleWord: "旅行 (ryokou - berwisata)" }
      ],
      grammarDrill: [
        {
          prompt: "Ubah kata kerja 'makan' (食べます) menjadi bentuk ajakan sopan:",
          pattern: "V-ませんか",
          sampleAnswer: "いっしょに昼ごはんを食べませんか。"
        },
        {
          prompt: "Tolak ajakan rekan untuk nonton konser hari Minggu dengan sopan:",
          pattern: "日曜日、ちょっと都合が悪くて…",
          sampleAnswer: "日曜日はちょっと用事があって、都合が悪いです。"
        }
      ],
      translationDrill: [
        { ja: "今週末、買い物に行きませんか。", id: "Maukah Anda pergi berbelanja bersama akhir pekan ini?", situation: "Mengajak teman asrama ke mall" },
        { ja: "ぜひ、いっしょに行きましょう。", id: "Tentu saja, mari kita pergi bersama!", situation: "Menerima ajakan dengan antusias" }
      ],
      reflectionPrompts: [
        "Bagaimana cara Anda menolak ajakan orang Jepang agar terdengar sopan dan tidak kaku?",
        "Kosakata hobi apa yang paling sering Anda gunakan dalam percakapan nyata?"
      ]
    }
  }
};
