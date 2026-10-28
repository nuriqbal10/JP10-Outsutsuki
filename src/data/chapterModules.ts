export interface GrammarPoint {
  pattern: string;
  meaning: string;
  explanation: string;
  examples: {
    ja: string;
    romaji: string;
    id: string;
  }[];
}

export interface ChapterModuleData {
  chapter: number;
  titleJa: string;
  titleId: string;
  topic: string;
  pdfUrl: string;
  slidesUrl?: string;
  canDoList: string[];
  keyVocabCategories: {
    category: string;
    items: { ja: string; id: string; note?: string }[];
  }[];
  grammarPoints: GrammarPoint[];
  cultureNotes: {
    title: string;
    content: string;
  }[];
}

export const CHAPTER_MODULES: Record<number, ChapterModuleData> = {
  1: {
    chapter: 1,
    titleJa: "第1課「先週、日本に来たばかりです」",
    titleId: "Baru Saja Tiba di Jepang Minggu Lalu",
    topic: "私の周りの人たち・職場での自己紹介と生活の様子",
    pdfUrl: "/modul/bab1.pdf",
    canDoList: [
          "Can-do 1: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 1.",
          "Can-do 2: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 3: Mampu membaca teks praktis dan instruksi otentik pada Bab 1.",
          "Can-do 4: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ N1というN2",
                "meaning": "Menyebutkan nama benda atau orang yang belum tentu diketahui oleh lawan bicara ('[N2] yang bernama / disebut [N1]')",
                "explanation": "[Kata Benda 1 (Nama Spesifik)] という [Kata Benda 2 (Kategori)] — N1 adalah nama unik/sebutan (misal nama makanan, kota, orang), diikuti という lalu N2 sebagai kategori umumnya.",
                "examples": [
                      {
                            "ja": "ホアは「花」という意味です。",
                            "romaji": "",
                            "id": "Ini adalah bunga yang disebut Sakura."
                      },
                      {
                            "ja": "これは桜という花です",
                            "romaji": "",
                            "id": "Ini adalah bunga yang disebut Sakura."
                      }
                ]
          },
          {
                "pattern": "❷ V-たばかりです",
                "meaning": "Menyatakan bahwa suatu aktivitas baru saja terjadi beberapa saat yang lalu menurut perasaan pembicara ('Baru saja...')",
                "explanation": "[Kata Kerja Bentuk-Ta] ばかりです — Kata kerja diubah ke bentuk lampau biasa (ta-kei) + ばかりです.",
                "examples": [
                      {
                            "ja": "先週、日本に来たばかりです。",
                            "romaji": "",
                            "id": "Saya baru saja tiba di Jepang."
                      },
                      {
                            "ja": "私は日本に来たばかりです",
                            "romaji": "",
                            "id": "Saya baru saja tiba di Jepang."
                      }
                ]
          },
          {
                "pattern": "❸ V-ていました",
                "meaning": "Menyatakan kegiatan yang sedang berlangsung di masa lampau atau rutinitas masa lalu ('Dulu sedang/rutin melakukan...')",
                "explanation": "[Kata Kerja Bentuk-Te] いました — Bentuk lampau dari 〜ています, yaitu 〜ていました.",
                "examples": [
                      {
                            "ja": "ベトナムでは、ホテルで働いていました。",
                            "romaji": "",
                            "id": "Dulu saya mengajar bahasa Inggris di negara asal."
                      },
                      {
                            "ja": "国で英語を教えていました",
                            "romaji": "",
                            "id": "Dulu saya mengajar bahasa Inggris di negara asal."
                      }
                ]
          },
          {
                "pattern": "❹ それ／そこ　＜文脈指示＞",
                "meaning": "Merujuk kembali pada topik atau tempat yang baru saja disebutkan oleh lawan bicara",
                "explanation": "Kata Tunjuk Konteks Percakapan (それ／そこ ＜文脈指示＞) — それ dan そこ digunakan untuk mengacu pada hal yang telah diangkat dalam alur dialog.",
                "examples": [
                      {
                            "ja": "ジャワ島に、ジョグジャカルタという大きい町があります。ウォノソボは、そこから、バスで4時間ぐらいです。",
                            "romaji": "",
                            "id": "Saya juga pernah pergi ke tempat itu."
                      },
                      {
                            "ja": "私もそこへ行ったことがあります",
                            "romaji": "",
                            "id": "Saya juga pernah pergi ke tempat itu."
                      }
                ]
          },
          {
                "pattern": "❺ ～て、～\r\n～から、～\r\n～けど、～\r\n＜2つの文を1つにする＞",
                "meaning": "Menggabungkan dua klausa menjadi satu kalimat yang utuh dan mengalir",
                "explanation": "Penggabungan Dua Kalimat: 〜て (urutan) ／ 〜から (alasan) ／ 〜けど (kontras) — Pilih partikel sambung sesuai hubungan logika: urutan kronologis (て), sebab-akibat (から), atau kontras/pengantar (けど).",
                "examples": [
                      {
                            "ja": "お茶の畑がたくさんあって、のんびりしています。\r\nウランバートルは首都だから、都会ですよ。\r\n首都ではないけど、とてもにぎやかです。",
                            "romaji": "",
                            "id": "Saya memakan makanan yang murah dan lezat."
                      },
                      {
                            "ja": "安くて美味しい料理を食べました",
                            "romaji": "",
                            "id": "Saya memakan makanan yang murah dan lezat."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 1",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  2: {
    chapter: 2,
    titleJa: "第2課「まじめそうな人ですね」",
    titleId: "Orangnya Kelihatan Rajin ya",
    topic: "私の周りの人たち・外見・服装と性格の特徴",
    pdfUrl: "/modul/bab2.pdf",
    canDoList: [
          "Can-do 5: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 2.",
          "Can-do 6: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 7: Mampu membaca teks praktis dan instruksi otentik pada Bab 2.",
          "Can-do 8: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ N1はN2が ナA-です／イA-いです　②",
                "meaning": "Mendeskripsikan ciri fisik atau penampilan seseorang (mata besar, rambut panjang, perawakan tinggi)",
                "explanation": "[Kata Benda 1] は [Kata Benda 2] が [Kata Sifat] ② — Orang yang digambarkan ditandai topik は, bagian tubuh spesifik ditandai partikel が.",
                "examples": [
                      {
                            "ja": "江口さんは、髪が短いです。",
                            "romaji": "",
                            "id": "Tanaka-san badannya tinggi."
                      },
                      {
                            "ja": "田中さんは背が高いです",
                            "romaji": "",
                            "id": "Tanaka-san badannya tinggi."
                      }
                ]
          },
          {
                "pattern": "❷ V-ている＋人",
                "meaning": "Mengidentifikasi atau menerangkan orang berdasarkan apa yang sedang ia kenakan atau lakukan ('Orang yang sedang...')",
                "explanation": "[Kata Kerja Bentuk-Te います] + 人 — Frasa 〜ている diletakkan tepat di depan kata 人 (hito) untuk memodifikasi orang tersebut.",
                "examples": [
                      {
                            "ja": "ナインさんは、帽子をかぶっている人です。\r\n加藤さんは、あそこで、コピーをしている人です。",
                            "romaji": "",
                            "id": "Orang yang memakai kacamata adalah Yamada-san."
                      },
                      {
                            "ja": "眼鏡をかけている人が山田さんです",
                            "romaji": "",
                            "id": "Orang yang memakai kacamata adalah Yamada-san."
                      }
                ]
          },
          {
                "pattern": "❸ Sよ",
                "meaning": "Memberikan informasi baru yang belum diketahui oleh lawan bicara secara ramah ('Lho / kok / nih')",
                "explanation": "[Kalimat] よ — Partikel よ di akhir tuturan memberi tahu lawan bicara mengenai fakta penting.",
                "examples": [
                      {
                            "ja": "原さんは、座って、本を読んでる人ですよ。",
                            "romaji": "",
                            "id": "Besok kita kumpul pagi-pagi lho."
                      },
                      {
                            "ja": "明日は早く集合するよ",
                            "romaji": "",
                            "id": "Besok kita kumpul pagi-pagi lho."
                      }
                ]
          },
          {
                "pattern": "❹ Sし、～",
                "meaning": "Menyebutkan satu dari beberapa alasan atau kelebihan pendukung ('Lagipula... dan...')",
                "explanation": "[Kalimat Bentuk Biasa] し、〜 — Bentuk biasa + し untuk merangkai alasan yang searah.",
                "examples": [
                      {
                            "ja": "三船敏郎は、演技が上手だし、本当にかっこいいです。",
                            "romaji": "",
                            "id": "Toko ini murah, lagipula masakannya enak."
                      },
                      {
                            "ja": "この店は安いし美味しいです",
                            "romaji": "",
                            "id": "Toko ini murah, lagipula masakannya enak."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 2",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  3: {
    chapter: 3,
    titleJa: "第3課「アレルギーがあるので、食べられないんです」",
    titleId: "Karena Punya Alergi, Saya Tidak Bisa Memakannya",
    topic: "レストランで・料理の注文・味の好みとアレルギー",
    pdfUrl: "/modul/bab3.pdf",
    canDoList: [
          "Can-do 9: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 3.",
          "Can-do 10: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 11: Mampu membaca teks praktis dan instruksi otentik pada Bab 3.",
          "Can-do 12: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ S1ので、S2",
                "meaning": "Menyatakan alasan objektif yang sopan dan terdengar wajar ('Karena / berhubung...')",
                "explanation": "[Kalimat Bentuk Biasa] ので、〜 — Lebih halus dan objektif daripada から. Untuk kata sifat-na dan kata benda ditambah な + ので.",
                "examples": [
                      {
                            "ja": "今日は自転車で来たので、飲めないんです。",
                            "romaji": "",
                            "id": "Berhubung ada urusan, saya mohon pamit lebih dulu."
                      },
                      {
                            "ja": "用事があるのでお先に失礼します",
                            "romaji": "",
                            "id": "Berhubung ada urusan, saya mohon pamit lebih dulu."
                      }
                ]
          },
          {
                "pattern": "❷ Sよね",
                "meaning": "Meminta konfirmasi empati atas hal yang dirasakan bersama ('Iya kan ya?')",
                "explanation": "[Kalimat] よね — Kombinasi よ (penegasan) dan ね (empati) untuk meminta persetujuan hangat.",
                "examples": [
                      {
                            "ja": "おすし、わさび、入ってますよね。",
                            "romaji": "",
                            "id": "Masakan ini benar-benar pedas kan ya?"
                      },
                      {
                            "ja": "この料理は本当に辛いよね",
                            "romaji": "",
                            "id": "Masakan ini benar-benar pedas kan ya?"
                      }
                ]
          },
          {
                "pattern": "❸ Nで～",
                "meaning": "Menyatakan batasan cakupan, kategori, atau kuantitas total",
                "explanation": "[Kata Benda] で〜 — Partikel で membatasi lingkup perbandingan atau batas kategori (misal: 一人で, 全部で).",
                "examples": [
                      {
                            "ja": "A：テーブルと座敷がございますが…。　\r\nB：テーブルでお願いします。",
                            "romaji": "",
                            "id": "Semuanya menjadi seribu yen."
                      },
                      {
                            "ja": "全部で千円になります",
                            "romaji": "",
                            "id": "Semuanya menjadi seribu yen."
                      }
                ]
          },
          {
                "pattern": "❹ ナA-な／イA-い／V-る のは、Nです",
                "meaning": "Memberikan penekanan fokus informasi pada kata benda di akhir kalimat ('Yang ... adalah [N]')",
                "explanation": "[Kata Sifat-na な / Sifat-i / V-ru] のは、[Kata Benda] です — Anak kalimat diubah menjadi frasa subjek dengan のは, lalu fokus utama diletakkan di akhir sebelum です.",
                "examples": [
                      {
                            "ja": "人気があるのは、お刺身定食です。",
                            "romaji": "",
                            "id": "Yang paling berharga adalah kesehatan."
                      },
                      {
                            "ja": "一番大切なのは健康です",
                            "romaji": "",
                            "id": "Yang paling berharga adalah kesehatan."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 3",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  4: {
    chapter: 4,
    titleJa: "第4課「しょうゆをつけないで食べてください」",
    titleId: "Silakan Santap Tanpa Menggunakan Kecap Asin",
    topic: "レストランで・食べ方・マナーと料理の楽しみ方",
    pdfUrl: "/modul/bab4.pdf",
    canDoList: [
          "Can-do 13: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 4.",
          "Can-do 14: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 15: Mampu membaca teks praktis dan instruksi otentik pada Bab 4.",
          "Can-do 16: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ Nなら、～",
                "meaning": "Menanggapi topik usulan lawan bicara dan memberikan rekomendasi khusus ('Kalau bicara tentang [N], maka...')",
                "explanation": "[Kata Benda / Topik] なら、〜 — Kata benda langsung ditambah なら tanpa partikel lain, diikuti usulan atau saran terbaik.",
                "examples": [
                      {
                            "ja": "A：この近くに、おすすめの店がありますか？\r\nB：この近くなら、「平兵衛」がおすすめです。",
                            "romaji": "",
                            "id": "Kalau masakan Jepang, sushi sangat direkomendasikan."
                      },
                      {
                            "ja": "日本料理なら寿司がおすすめです",
                            "romaji": "",
                            "id": "Kalau masakan Jepang, sushi sangat direkomendasikan."
                      }
                ]
          },
          {
                "pattern": "❷ V-て、～　＜方法＞",
                "meaning": "Menyatakan cara, metode, atau sarana dalam melakukan suatu perbuatan ('Dengan cara melakukan V')",
                "explanation": "[Kata Kerja Bentuk-Te]、〜 ＜方法＞ — Bentuk-Te berfungsi menerangkan bagaimana tindakan utama di belakangnya dikerjakan.",
                "examples": [
                      {
                            "ja": "こちらの野菜の天ぷらは、つゆにつけて食べてください。",
                            "romaji": "",
                            "id": "Saya pergi ke sekolah dengan cara berjalan kaki."
                      },
                      {
                            "ja": "歩いて学校へ通っています",
                            "romaji": "",
                            "id": "Saya pergi ke sekolah dengan cara berjalan kaki."
                      }
                ]
          },
          {
                "pattern": "V-ないで、～　＜方法＞",
                "meaning": "Melakukan suatu tindakan utama tanpa melakukan perbuatan lain yang sewajarnya dilakukan ('Tanpa melakukan V')",
                "explanation": "[Kata Kerja Bentuk-Nai] で、〜 ＜方法＞ — Kata kerja bentuk-Nai + で (contoh: 朝ごはんを食べないで出かけました).",
                "examples": [
                      {
                            "ja": "エビはつゆにつけないで、塩をかけて食べてください。",
                            "romaji": "",
                            "id": "Saya bepergian keluar tanpa membawa payung."
                      },
                      {
                            "ja": "傘を持たないで出かけました",
                            "romaji": "",
                            "id": "Saya bepergian keluar tanpa membawa payung."
                      }
                ]
          },
          {
                "pattern": "❸ V-ちゃだめです",
                "meaning": "Menyatakan larangan santai/akrab dalam kehidupan sehari-hari ('Tidak boleh / jangan...')",
                "explanation": "[Kata Kerja Bentuk-Te buang て + ちゃ] だめです — Bentuk-Te diubah: て -> ちゃだめ, で -> じゃだめ. Larangan akrab.",
                "examples": [
                      {
                            "ja": "一度に、そんなにたくさんお肉を入れちゃだめですよ。",
                            "romaji": "",
                            "id": "Tidak boleh membuang sampah di sini."
                      },
                      {
                            "ja": "ここでゴミを捨てちゃだめです",
                            "romaji": "",
                            "id": "Tidak boleh membuang sampah di sini."
                      }
                ]
          },
          {
                "pattern": "❹ V-てから、 ～",
                "meaning": "Menyatakan urutan pasti: tindakan kedua baru dimulai setelah tindakan pertama selesai sempurna ('Setelah... barulah...')",
                "explanation": "[Kata Kerja Bentuk-Te] から、〜 — Kata kerja bentuk-Te + から menekankan selesainya aksi pertama sebelum melangkah ke aksi kedua.",
                "examples": [
                      {
                            "ja": "うどんは、お肉と野菜を食べてから、入れましょう。",
                            "romaji": "",
                            "id": "Setelah mencuci tangan, barulah makan nasi."
                      },
                      {
                            "ja": "手を洗ってからご飯を食べます",
                            "romaji": "",
                            "id": "Setelah mencuci tangan, barulah makan nasi."
                      }
                ]
          },
          {
                "pattern": "❺ S1が、S2",
                "meaning": "Menghubungkan dua kalimat secara kontras atau sebagai pembuka tuturan yang halus ('Tetapi... / ...namun...')",
                "explanation": "[Kalimat 1] が、[Kalimat 2] — Partikel が diletakkan di akhir klausa pertama dalam ragam bahasa sopan formal.",
                "examples": [
                      {
                            "ja": "お店は新しくてきれいですが、お昼は混んでいます。",
                            "romaji": "",
                            "id": "Mohon maaf sebelumnya, nama Anda siapa?"
                      },
                      {
                            "ja": "失礼ですがお名前は何ですか",
                            "romaji": "",
                            "id": "Mohon maaf sebelumnya, nama Anda siapa?"
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 4",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  5: {
    chapter: 5,
    titleJa: "第5課「早く予約したほうがいいですよ」",
    titleId: "Sebaiknya Cepat Lakukan Reservasi",
    topic: "旅行に行こう・おすすめ観光地と予約の手続き",
    pdfUrl: "/modul/bab5.pdf",
    canDoList: [
          "Can-do 17: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 5.",
          "Can-do 18: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 19: Mampu membaca teks praktis dan instruksi otentik pada Bab 5.",
          "Can-do 20: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ V-（られ）ます　＜可能形①＞",
                "meaning": "Menyatakan kesanggupan fisik atau keahlian diri untuk melakukan perbuatan ('Bisa / mampu...')",
                "explanation": "[Kata Kerja Bentuk Potensial (可能形)] ます ① — Gol 1: u -> eru (飲む -> 飲める). Gol 2: ru -> rareru (食べる -> 食べられる). Partikel objek を biasanya berubah menjadi が.",
                "examples": [
                      {
                            "ja": "新鮮なカニとかウニとか食べられますよ。",
                            "romaji": "",
                            "id": "Saya bisa membaca surat kabar bahasa Jepang."
                      },
                      {
                            "ja": "私は日本語の新聞が読めます",
                            "romaji": "",
                            "id": "Saya bisa membaca surat kabar bahasa Jepang."
                      }
                ]
          },
          {
                "pattern": "❷ ～ところ",
                "meaning": "Menunjukkan tahapan momentum tindakan: tepat sebelum mulai (る), sedang berlangsung (ている), atau baru saja selesai (た)",
                "explanation": "[Kata Kerja Bentuk Kamus/Te-iru/Ta] ところ — るところ (baru mau mulai), ているところ (sedang di tengah aksi), たところ (baru saja rampung).",
                "examples": [
                      {
                            "ja": "遊べるところはありますか？",
                            "romaji": "",
                            "id": "Saya baru saja mau berangkat keluar sekarang."
                      },
                      {
                            "ja": "今から出かけるところです",
                            "romaji": "",
                            "id": "Saya baru saja mau berangkat keluar sekarang."
                      }
                ]
          },
          {
                "pattern": "❸ S（普通形） って聞きました\r\nS（普通形） って言っていました",
                "meaning": "Menyampaikan informasi kabar burung dalam percakapan akrab santai ('Katanya dengar-dengar...')",
                "explanation": "[Kalimat Bentuk Biasa] って 聞きました ／ って 言っていました — Partikel って adalah bentuk santai lisan dari と.",
                "examples": [
                      {
                            "ja": "うどんがおいしいって聞きました。\r\nバスが安くて便利だって先輩が言ってました。",
                            "romaji": "",
                            "id": "Dengar-dengar Yamada-san bulan depan akan menikah."
                      },
                      {
                            "ja": "山田さんは来月結婚するって聞きました",
                            "romaji": "",
                            "id": "Dengar-dengar Yamada-san bulan depan akan menikah."
                      }
                ]
          },
          {
                "pattern": "❹ 【疑問詞】V-たらいいですか？",
                "meaning": "Meminta saran atau petunjuk solusi kepada orang lain saat bingung ('Sebaiknya apa/bagaimana yang harus saya lakukan?')",
                "explanation": "[Kata Tanya] [Kata Kerja Bentuk-Tara] いいですか？ — Kata tanya (seperti どう, どこ, 何) + kata kerja bentuk-Tara + いいですか.",
                "examples": [
                      {
                            "ja": "日光に行くんですけど、何で行ったらいいですか？",
                            "romaji": "",
                            "id": "Sebaiknya saya membeli tiket di mana ya?"
                      },
                      {
                            "ja": "どこで切符を買ったらいいですか",
                            "romaji": "",
                            "id": "Sebaiknya saya membeli tiket di mana ya?"
                      }
                ]
          },
          {
                "pattern": "❺ V-たほうがいいです",
                "meaning": "Memberikan nasihat atau rekomendasi positif yang tegas ('Lebih baik / sebaiknya kamu melakukan...')",
                "explanation": "[Kata Kerja Bentuk-Ta] ほうが いいです — Kata kerja harus dalam bentuk lampau biasa (ta-kei) + ほうが いいです.",
                "examples": [
                      {
                            "ja": "厚い上着を持って行ったほうがいいですよ。",
                            "romaji": "",
                            "id": "Sebaiknya kamu minum obat lalu tidur lebih awal."
                      },
                      {
                            "ja": "薬を飲んで早く寝たほうがいいです",
                            "romaji": "",
                            "id": "Sebaiknya kamu minum obat lalu tidur lebih awal."
                      }
                ]
          },
          {
                "pattern": "V-ないほうがいいです",
                "meaning": "Memberikan peringatan atau nasihat agar tidak melakukan hal buruk ('Sebaiknya jangan melakukan...')",
                "explanation": "[Kata Kerja Bentuk-Nai] ほうが いいです — Kata kerja dalam bentuk negatif-Nai + ほうが いいです.",
                "examples": [
                      {
                            "ja": "できれば、日曜日は行かないほうがいいですよ。",
                            "romaji": "",
                            "id": "Sebaiknya jangan memaksakan diri."
                      },
                      {
                            "ja": "無理をしないほうがいいです",
                            "romaji": "",
                            "id": "Sebaiknya jangan memaksakan diri."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 5",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  6: {
    chapter: 6,
    titleJa: "第6課「いろいろなところに行けて、よかったです」",
    titleId: "Senang Sekali Bisa Pergi ke Berbagai Tempat",
    topic: "旅行に行こう・旅の感想と体験の振り返り",
    pdfUrl: "/modul/bab6.pdf",
    canDoList: [
          "Can-do 21: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 6.",
          "Can-do 22: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 23: Mampu membaca teks praktis dan instruksi otentik pada Bab 6.",
          "Can-do 24: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ V-るつもりです",
                "meaning": "Menyatakan niat atau rencana pasti yang sudah diputuskan dalam hati ('Berencana / berniat untuk...')",
                "explanation": "[Kata Kerja Bentuk Kamus] つもりです — Kata kerja bentuk kamus + つもりです (tsumori desu).",
                "examples": [
                      {
                            "ja": "明日は、中禅寺湖に行くつもりです。",
                            "romaji": "",
                            "id": "Saya berniat melakukan perjalanan ke Jepang tahun depan."
                      },
                      {
                            "ja": "来年日本へ旅行するつもりです",
                            "romaji": "",
                            "id": "Saya berniat melakukan perjalanan ke Jepang tahun depan."
                      }
                ]
          },
          {
                "pattern": "❷ V-（られ）て、～",
                "meaning": "Menyatakan perasaan lega atau senang karena sanggup melakukan sesuatu",
                "explanation": "[Kata Kerja Potensial Bentuk-Te]、〜 — Kata kerja bentuk potensial diubah ke bentuk-Te (misal: 買えてよかったです).",
                "examples": [
                      {
                            "ja": "いろいろなところに行けて、よかったです。",
                            "romaji": "",
                            "id": "Bisa membeli tiket, saya sangat gembira."
                      },
                      {
                            "ja": "チケットが買えてとても嬉しいです",
                            "romaji": "",
                            "id": "Bisa membeli tiket, saya sangat gembira."
                      }
                ]
          },
          {
                "pattern": "V-（られ）なくて、～",
                "meaning": "Menyatakan kekecewaan atau kendala karena tidak mampu melakukan sesuatu ('Karena tidak bisa...')",
                "explanation": "[Kata Kerja Potensial Bentuk-Nakute]、〜 — Bentuk negatif potensial (-nai) diubah ke bentuk-Te penyambung (-nakute).",
                "examples": [
                      {
                            "ja": "ショーが見られなくて、残念でした。",
                            "romaji": "",
                            "id": "Karena tidak ada waktu, saya tidak bisa pergi."
                      },
                      {
                            "ja": "時間がなくて行けませんでした",
                            "romaji": "",
                            "id": "Karena tidak ada waktu, saya tidak bisa pergi."
                      }
                ]
          },
          {
                "pattern": "❸ S1し、S2し、～",
                "meaning": "Menyebutkan dua atau lebih alasan atau keunggulan secara berurutan ('Sudah... ditambah lagi...')",
                "explanation": "[Kalimat 1] し、[Kalimat 2] し、〜 — Menyambung beberapa klausul kalimat biasa dengan akhiran し.",
                "examples": [
                      {
                            "ja": "海で泳げたし、船に乗れたし、楽しかったです。",
                            "romaji": "",
                            "id": "Kamarnya terang, tenang, dan praktis."
                      },
                      {
                            "ja": "部屋は明るいし静かだし便利です",
                            "romaji": "",
                            "id": "Kamarnya terang, tenang, dan praktis."
                      }
                ]
          },
          {
                "pattern": "❹ V-る／V-ている／V-た とき、～",
                "meaning": "Membedakan ketepatan waktu sebelum aksi selesai (る), saat aksi berlangsung (ている), atau sesudah aksi selesai (た)",
                "explanation": "[Kata Kerja Bentuk Kamus / Te-iru / Ta] とき、〜 — Contoh: 日本へ行くとき (sebelum sampai di Jepang), 日本へ行ったとき (setelah tiba di Jepang).",
                "examples": [
                      {
                            "ja": "道を歩いているとき、リスを見ました。\r\nウミネコが近くに来たとき、ちょっとこわかったです。",
                            "romaji": "",
                            "id": "Saat hendak berangkat ke Jepang, saya membeli kamera."
                      },
                      {
                            "ja": "日本へ行くときカメラを買いました",
                            "romaji": "",
                            "id": "Saat hendak berangkat ke Jepang, saya membeli kamera."
                      }
                ]
          },
          {
                "pattern": "❺ 【人】と【人数】で",
                "meaning": "Menyatakan jumlah total orang yang bersama-sama melakukan aktivitas ('Bersama [orang] ber-[jumlah]')",
                "explanation": "[Orang] と [Jumlah Orang] で — Partikel と menandai teman, dan jumlah orang diakhiri partikel で (misal: 家族と三人で).",
                "examples": [
                      {
                            "ja": "友だちと2人でハウステンボスに行って来ました。",
                            "romaji": "",
                            "id": "Saya berwisata ke Kyoto berdua bersama teman."
                      },
                      {
                            "ja": "友達と二人で京都を旅行しました",
                            "romaji": "",
                            "id": "Saya berwisata ke Kyoto berdua bersama teman."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 6",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  7: {
    chapter: 7,
    titleJa: "第7課「雨が降ったら、ホールでやります」",
    titleId: "Kalau Hujan, Acaranya Diadakan di Aula",
    topic: "地域のイベント・天気と催し物の開催案内",
    pdfUrl: "/modul/bab7.pdf",
    canDoList: [
          "Can-do 25: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 7.",
          "Can-do 26: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 27: Mampu membaca teks praktis dan instruksi otentik pada Bab 7.",
          "Can-do 28: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ ～たら、～",
                "meaning": "Menyatakan kondisi pengandaian atau urutan waktu di masa depan ('Kalau / setelah... terjadi')",
                "explanation": "[Bentuk Lampau Biasa] ら、〜 — Kata kerja bentuk-Ta + ら (contoh: 終わったら, 雨が降ったら).",
                "examples": [
                      {
                            "ja": "雨が降ったら、盆踊りは日曜日にやるよ。\r\n盆踊りが終わったら、いっしょに居酒屋に行きましょう。",
                            "romaji": "",
                            "id": "Kalau pekerjaan sudah selesai, saya akan menelepon."
                      },
                      {
                            "ja": "仕事が終わったら電話します",
                            "romaji": "",
                            "id": "Kalau pekerjaan sudah selesai, saya akan menelepon."
                      }
                ]
          },
          {
                "pattern": "❷ V-（ら）れます　＜受身①＞",
                "meaning": "Menyatakan subjek dikenai tindakan langsung oleh orang lain ('Di... / terkena perbuatan...')",
                "explanation": "[Kata Kerja Bentuk Pasif (受身形)] ます ① — Gol 1: u -> areru (褒める -> 褒められる, 叱る -> 叱られる). Pelaku ditandai partikel に.",
                "examples": [
                      {
                            "ja": "7月14日、「ひかりホール」において、コンサートが開催されます。",
                            "romaji": "",
                            "id": "Saya dipuji oleh guru."
                      },
                      {
                            "ja": "私は先生に褒められました",
                            "romaji": "",
                            "id": "Saya dipuji oleh guru."
                      }
                ]
          },
          {
                "pattern": "❸ V-（られ）ます　＜可能形②＞",
                "meaning": "Menyatakan ketersediaan situasi atau fasilitas yang memungkinkan suatu hal dapat dilakukan",
                "explanation": "[Kata Kerja Potensial (可能形)] ます ② — Menyatakan bahwa kondisi tempat/situasi mengizinkan sesuatu untuk terwujud.",
                "examples": [
                      {
                            "ja": "盆踊りは簡単だから、だれでも踊れますよ。",
                            "romaji": "",
                            "id": "Di depan stasiun bisa meminjam sepeda."
                      },
                      {
                            "ja": "駅前で自転車が借りられます",
                            "romaji": "",
                            "id": "Di depan stasiun bisa meminjam sepeda."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 7",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  8: {
    chapter: 8,
    titleJa: "第8課「屋台はどこかわかりますか？」",
    titleId: "Tahukah Anda di Mana Stan Festival Berada?",
    topic: "地域のイベント・お祭りの屋台と道案内",
    pdfUrl: "/modul/bab8.pdf",
    canDoList: [
          "Can-do 29: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 8.",
          "Can-do 30: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 31: Mampu membaca teks praktis dan instruksi otentik pada Bab 8.",
          "Can-do 32: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ もうV-ました",
                "meaning": "Menyatakan konfirmasi bahwa suatu hal telah rampung dikerjakan ('Sudah...')",
                "explanation": "もう [Kata Kerja Bentuk-Mashita] — Sering digunakan untuk menjawab pertanyaan 'もう〜ましたか？'.",
                "examples": [
                      {
                            "ja": "A：スピーチコンテストは、もう始まりましたか？",
                            "romaji": "",
                            "id": "PR saya sudah selesai."
                      },
                      {
                            "ja": "宿題はもう終わりました",
                            "romaji": "",
                            "id": "PR saya sudah selesai."
                      }
                ]
          },
          {
                "pattern": "まだV-て（い）ません",
                "meaning": "Menyatakan bahwa suatu aktivitas belum terlaksana sampai saat ini ('Masih belum...')",
                "explanation": "まだ [Kata Kerja Bentuk-Te] いません — Kata keterangan まだ (mada) dipadukan dengan bentuk 〜ていません.",
                "examples": [
                      {
                            "ja": "B:まだ始まってません。",
                            "romaji": "",
                            "id": "Saya masih belum makan siang."
                      },
                      {
                            "ja": "私はまだ昼ご飯を食べていません",
                            "romaji": "",
                            "id": "Saya masih belum makan siang."
                      }
                ]
          },
          {
                "pattern": "❷ まだV-ます",
                "meaning": "Menyatakan bahwa suatu perbuatan atau kondisi masih terus berlanjut hingga sekarang ('Masih...')",
                "explanation": "まだ [Kata Kerja Bentuk Positif] — まだ diikuti kata kerja positif menyatakan kelangsungan aksi (misal: まだ働きます = Masih akan bekerja).",
                "examples": [
                      {
                            "ja": "イベント、まだやってますか？",
                            "romaji": "",
                            "id": "Di luar masih turun hujan."
                      },
                      {
                            "ja": "外はまだ雨が降っています",
                            "romaji": "",
                            "id": "Di luar masih turun hujan."
                      }
                ]
          },
          {
                "pattern": "❸ 【疑問詞】＋S（普通形）か、～",
                "meaning": "Menyematkan kalimat tanya sebagai klausa di dalam kalimat utama ('Apakah/kapan... tidak tahu')",
                "explanation": "[Kata Tanya] ＋ [Kalimat Bentuk Biasa] か、〜 — Kata tanya + klausa bentuk biasa + partikel か.",
                "examples": [
                      {
                            "ja": "明日のフリーマーケットは、何時からか、わかりますか？",
                            "romaji": "",
                            "id": "Apakah Anda tahu jam berapa acaranya dimulai?"
                      },
                      {
                            "ja": "何時に始まるか知っていますか",
                            "romaji": "",
                            "id": "Apakah Anda tahu jam berapa acaranya dimulai?"
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 8",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  9: {
    chapter: 9,
    titleJa: "第9課「成人の日は、何をするんですか？」",
    titleId: "Pada Hari Kedewasaan, Apa yang Biasanya Dilakukan?",
    topic: "年中行事とマナー・日本の伝統行事とお祝い",
    pdfUrl: "/modul/bab9.pdf",
    canDoList: [
          "Can-do 33: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 9.",
          "Can-do 34: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 35: Mampu membaca teks praktis dan instruksi otentik pada Bab 9.",
          "Can-do 36: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ ～んですか？",
                "meaning": "Menanyakan konfirmasi dengan rasa ingin tahu atau meminta penjelasan atas hal yang dilihat ('Apakah benar bahwa...?')",
                "explanation": "[Kalimat Bentuk Biasa] んですか？ — Bentuk biasa + んですか. Memberi nuansa perhatian atau kepedulian terhadap lawan bicara.",
                "examples": [
                      {
                            "ja": "成人の日は、何をするんですか？",
                            "romaji": "",
                            "id": "Mau bepergian ke mana gerangan?"
                      },
                      {
                            "ja": "どこへ出かけるんですか",
                            "romaji": "",
                            "id": "Mau bepergian ke mana gerangan?"
                      }
                ]
          },
          {
                "pattern": "❷ Nしか+否定文",
                "meaning": "Menyatakan keterbatasan bahwa hanya ada objek itu saja dan merasa kurang ('Hanya... saja')",
                "explanation": "[Kata Benda] しか ＋ [Kata Kerja Bentuk Negatif] — Partikel しか selalu berpasangan dengan bentuk kata kerja negatif di belakangnya.",
                "examples": [
                      {
                            "ja": "乗り物に3つしか乗れませんでした。",
                            "romaji": "",
                            "id": "Di dompet hanya ada seribu yen saja."
                      },
                      {
                            "ja": "財布に千円しかありません",
                            "romaji": "",
                            "id": "Di dompet hanya ada seribu yen saja."
                      }
                ]
          },
          {
                "pattern": "❸ Nだけ",
                "meaning": "Menyatakan pembatasan secara netral tanpa nuansa keluhan ('Hanya / cuma...')",
                "explanation": "[Kata Benda] だけ — Berbeda dengan しか, partikel だけ berpasangan dengan predikat positif.",
                "examples": [
                      {
                            "ja": "今年は、1日だけ実家に帰りました。",
                            "romaji": "",
                            "id": "Tolong tunggu lima menit saja."
                      },
                      {
                            "ja": "五分だけ待ってください",
                            "romaji": "",
                            "id": "Tolong tunggu lima menit saja."
                      }
                ]
          },
          {
                "pattern": "❹ V-たりして、～",
                "meaning": "Menyebutkan contoh kemungkinan perilaku atau kejadian santai ('Seperti misalnya...')",
                "explanation": "[Kata Kerja Bentuk-Ta] りして、〜 — Bentuk 〜たりして memberi kesan fleksibel atau dugaan santai.",
                "examples": [
                      {
                            "ja": "友だちといっしょに買い物をしたりして、楽しかったです。",
                            "romaji": "",
                            "id": "Saat libur saya kadang memasak makanan."
                      },
                      {
                            "ja": "休日は料理を作ったりしています",
                            "romaji": "",
                            "id": "Saat libur saya kadang memasak makanan."
                      }
                ]
          },
          {
                "pattern": "❺ V-なくちゃならない",
                "meaning": "Menyatakan keharusan atau kewajiban mendesak dalam percakapan akrab ('Harus / perlu...')",
                "explanation": "[Kata Kerja Bentuk-Nai buang ない + なくちゃならない] — Bentuk percakapan lisan dari 〜なければならない.",
                "examples": [
                      {
                            "ja": "甥や姪にお年玉をあげなくちゃならないし、大変でした。",
                            "romaji": "",
                            "id": "Besok saya harus bangun pagi-pagi."
                      },
                      {
                            "ja": "明日は早く起きなくちゃならない",
                            "romaji": "",
                            "id": "Besok saya harus bangun pagi-pagi."
                      }
                ]
          },
          {
                "pattern": "❻ V-れます　＜可能形③＞",
                "meaning": "Bentuk potensial santai lisan modern pada Golongan 2 (menghilangkan ら: 食べれる)",
                "explanation": "[Kata Kerja Bentuk Potensial Pendek (ら抜き)] ます ③ — Banyak digunakan dalam percakapan santai kawula muda dan kehidupan sehari-hari.",
                "examples": [
                      {
                            "ja": "DVDもたくさん見れました。\r\n久しぶりに、実家の母の料理を食べれてよかったです。",
                            "romaji": "",
                            "id": "Saya bisa makan natto."
                      },
                      {
                            "ja": "私は納豆が食べれます",
                            "romaji": "",
                            "id": "Saya bisa makan natto."
                      }
                ]
          },
          {
                "pattern": "❼ S（普通形）+人が～\r\nS（普通形）+人も～",
                "meaning": "Menyebutkan keberadaan kelompok orang yang melakukan perbuatan tertentu ('Ada orang yang...')",
                "explanation": "[Klausa Bentuk Biasa] + 人が〜 ／ 人も〜 — Klausa bentuk biasa menerangkan subjek 人 (orang).",
                "examples": [
                      {
                            "ja": "春節は、田舎に帰る人が多いです。\r\n最近では、海外に旅行する人もいます。",
                            "romaji": "",
                            "id": "Ada orang yang sedang tidur di dalam kereta."
                      },
                      {
                            "ja": "電車で寝ている人がいます",
                            "romaji": "",
                            "id": "Ada orang yang sedang tidur di dalam kereta."
                      }
                ]
          },
          {
                "pattern": "❽ V-ながら、～",
                "meaning": "Melakukan dua kegiatan sekaligus secara simultan dalam satu kurun waktu yang sama ('Sambil...')",
                "explanation": "[Kata Kerja Bentuk Masu buang ます] ながら、〜 — Stem Masu + ながら. Tindakan utama diletakkan di kalimat kedua setelah ながら.",
                "examples": [
                      {
                            "ja": "ソンクラーンは、町を歩きながら、みんなで水をかけ合います。",
                            "romaji": "",
                            "id": "Saya belajar sambil mendengarkan musik."
                      },
                      {
                            "ja": "音楽を聴きながら勉強します",
                            "romaji": "",
                            "id": "Saya belajar sambil mendengarkan musik."
                      }
                ]
          },
          {
                "pattern": "❾ Nによって",
                "meaning": "Menyatakan keberagaman, perbedaan, atau ketergantungan pada faktor tertentu ('Bergantung pada / berbeda sesuai...')",
                "explanation": "[Kata Benda] によって — Kata benda langsung ditambah によって (ni yotte).",
                "examples": [
                      {
                            "ja": "レバランは、年によって違います。",
                            "romaji": "",
                            "id": "Kebudayaan berbeda-beda tergantung pada negaranya."
                      },
                      {
                            "ja": "文化は国によって違います",
                            "romaji": "",
                            "id": "Kebudayaan berbeda-beda tergantung pada negaranya."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 9",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  10: {
    chapter: 10,
    titleJa: "第10課「どんな服を着て行けばいいですか？」",
    titleId: "Pakaian Seperti Apa yang Sebaiknya Dikenakan?",
    topic: "年中行事とマナー・冠婚葬祭とマナー",
    pdfUrl: "/modul/bab10.pdf",
    canDoList: [
          "Can-do 37: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 10.",
          "Can-do 38: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 39: Mampu membaca teks praktis dan instruksi otentik pada Bab 10.",
          "Can-do 40: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ 【疑問詞】V-ばいいですか？",
                "meaning": "Menanyakan petunjuk atau tata cara penyelesaian masalah yang paling tepat ('Sebaiknya apa/bagaimana yang saya lakukan?')",
                "explanation": "[Kata Tanya] [Kata Kerja Bentuk-Ba] いいですか？ — Kata kerja bentuk pengandaian-ba (ば形) + いいですか.",
                "examples": [
                      {
                            "ja": "お葬式には、何を持っていけばいいですか？",
                            "romaji": "",
                            "id": "Sebaiknya apa yang harus saya lakukan?"
                      },
                      {
                            "ja": "どうすればいいですか",
                            "romaji": "",
                            "id": "Sebaiknya apa yang harus saya lakukan?"
                      }
                ]
          },
          {
                "pattern": "❷ V-てはいけません／だめです\r\nVちゃいけません／だめです",
                "meaning": "Menyatakan larangan keras sesuai peraturan keselamatan kerja atau norma publik ('Dilarang keras / tidak boleh...')",
                "explanation": "[Kata Kerja Bentuk-Te] は いけません ／ だめです — Bentuk-Te + はいけません (formal hukum/aturan) atau だめです (percakapan langsung).",
                "examples": [
                      {
                            "ja": "信号が赤のときは、横断歩道を渡ってはいけませんよ。\r\nバスの中では、話しちゃだめだよね。",
                            "romaji": "",
                            "id": "Dilarang merokok di sini."
                      },
                      {
                            "ja": "ここでタバコを吸ってはいけません",
                            "romaji": "",
                            "id": "Dilarang merokok di sini."
                      }
                ]
          },
          {
                "pattern": "❸ V-なくちゃ",
                "meaning": "Menyatakan keharusan mendesak yang disadari sendiri dalam tuturan akrab ('Harus...')",
                "explanation": "[Kata Kerja Bentuk-Nai buang ない + なくちゃ] — Bentuk singkat akrab dari 〜なくてはならない.",
                "examples": [
                      {
                            "ja": "食器は自分で片付けなくちゃ。",
                            "romaji": "",
                            "id": "Saya harus membersihkan kamar."
                      },
                      {
                            "ja": "部屋を掃除しなくちゃ",
                            "romaji": "",
                            "id": "Saya harus membersihkan kamar."
                      }
                ]
          },
          {
                "pattern": "❹ V-るように、～",
                "meaning": "Menyatakan tujuan atau kondisi ideal yang diupayakan agar dapat terwujud ('Agar / supaya...')",
                "explanation": "[Kata Kerja Bentuk Kamus] ように、〜 — Kata kerja bentuk kamus (biasanya potensial atau tanpa kehendak) + ように, diikuti usaha nyata.",
                "examples": [
                      {
                            "ja": "次の人がすぐに席に座れるように、食器を片付けます。",
                            "romaji": "",
                            "id": "Saya berlatih setiap hari agar dapat berbicara bahasa Jepang dengan lancar."
                      },
                      {
                            "ja": "日本語が上手に話せるように毎日練習します",
                            "romaji": "",
                            "id": "Saya berlatih setiap hari agar dapat berbicara bahasa Jepang dengan lancar."
                      }
                ]
          },
          {
                "pattern": "V-ないように、～",
                "meaning": "Menyatakan upaya kehati-hatian agar suatu hal buruk tidak terjadi ('Agar / supaya tidak...')",
                "explanation": "[Kata Kerja Bentuk-Nai] ように、〜 — Kata kerja bentuk negatif-Nai + ように, diikuti tindakan preventif.",
                "examples": [
                      {
                            "ja": "トイレがつまらないように、紙はごみ箱に捨てます。",
                            "romaji": "",
                            "id": "Saya memakai pakaian hangat agar tidak masuk angin."
                      },
                      {
                            "ja": "風邪を引かないように暖かい服を着ます",
                            "romaji": "",
                            "id": "Saya memakai pakaian hangat agar tidak masuk angin."
                      }
                ]
          },
          {
                "pattern": "❺ V-（ら）れます　＜受身②＞",
                "meaning": "Menyatakan situasi di mana seseorang merasa terganggu atau dirugikan oleh perbuatan orang lain (Pasif Gangguan / 迷惑受身)",
                "explanation": "[Kata Kerja Bentuk Pasif (受身形)] ます ② — Menyatakan penderitaan yang dialami akibat aksi orang lain (contoh: 雨に降られました = Kehujanan).",
                "examples": [
                      {
                            "ja": "お店の店長さんに、「今度から気をつけて」と注意されました。",
                            "romaji": "",
                            "id": "Saat pulang saya kehujanan di jalan."
                      },
                      {
                            "ja": "帰りに雨に降られました",
                            "romaji": "",
                            "id": "Saat pulang saya kehujanan di jalan."
                      }
                ]
          },
          {
                "pattern": "❻ S（普通形）の？",
                "meaning": "Menanyakan alasan atau meminta konfirmasi santai dengan nada ramah kepada teman akrab",
                "explanation": "[Kalimat Bentuk Biasa] の？ — Bentuk biasa diakhiri partikel の dengan intonasi naik. Bentuk santai dari んですか.",
                "examples": [
                      {
                            "ja": "お金を払わないで、ジュース飲んだの？",
                            "romaji": "",
                            "id": "Apakah besok kamu juga pergi bekerja?"
                      },
                      {
                            "ja": "明日も仕事に行くの",
                            "romaji": "",
                            "id": "Apakah besok kamu juga pergi bekerja?"
                      }
                ]
          },
          {
                "pattern": "❼ V-なきゃ",
                "meaning": "Menyatakan keharusan mendesak secara kasual untuk mengingatkan diri sendiri ('Harus...')",
                "explanation": "[Kata Kerja Bentuk-Nai buang ない + なきゃ] — Singkatan percakapan akrab dari 〜なければならない.",
                "examples": [
                      {
                            "ja": "ちゃんとお金を払ってから飲まなきゃ。",
                            "romaji": "",
                            "id": "Saya harus segera pulang."
                      },
                      {
                            "ja": "私は早く帰らなきゃ",
                            "romaji": "",
                            "id": "Saya harus segera pulang."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 10",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  11: {
    chapter: 11,
    titleJa: "第11課「ポイントカードを忘れてしまいました」",
    titleId: "Saya Tidak Sengaja Ketinggalan Kartu Poin",
    topic: "上手な買い物・買い物とトラブル・試着とサイズ",
    pdfUrl: "/modul/bab11.pdf",
    canDoList: [
          "Can-do 41: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 11.",
          "Can-do 42: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 43: Mampu membaca teks praktis dan instruksi otentik pada Bab 11.",
          "Can-do 44: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ V-てみてもいいですか？",
                "meaning": "Meminta izin secara sangat sopan untuk mencoba sesuatu terlebih dahulu ('Bolehkah saya mencoba untuk...?')",
                "explanation": "[Kata Kerja Bentuk-Te] みても いいですか？ — Kombinasi bentuk coba (てみる) dan izin (てもいいですか).",
                "examples": [
                      {
                            "ja": "このセーター、着てみてもいいですか？",
                            "romaji": "",
                            "id": "Bolehkah saya mencoba memakai baju ini?"
                      },
                      {
                            "ja": "この服を着てみてもいいですか",
                            "romaji": "",
                            "id": "Bolehkah saya mencoba memakai baju ini?"
                      }
                ]
          },
          {
                "pattern": "❷ ナA-／イA- すぎます",
                "meaning": "Menyatakan bahwa kualitas atau sifat tersebut berlebihan dan berdampak negatif ('Terlalu...')",
                "explanation": "[Kata Sifat buang い/な] すぎます — Sifat-i buang 'い', sifat-na buang 'な' + すぎます.",
                "examples": [
                      {
                            "ja": "この色はちょっと派手すぎます。",
                            "romaji": "",
                            "id": "Sepatu ini sedikit terlalu besar."
                      },
                      {
                            "ja": "この靴は少し大きすぎます",
                            "romaji": "",
                            "id": "Sepatu ini sedikit terlalu besar."
                      }
                ]
          },
          {
                "pattern": "イA-すぎます",
                "meaning": "Menyatakan rasa pedas, manis, mahal, atau panas yang melampaui toleransi diri",
                "explanation": "[Kata Sifat-i buang い] すぎます — Kata sifat-i buang 'い' + すぎます.",
                "examples": [
                      {
                            "ja": "このジャケットは高すぎます。",
                            "romaji": "",
                            "id": "Sup ini terlalu panas."
                      },
                      {
                            "ja": "このスープは熱すぎます",
                            "romaji": "",
                            "id": "Sup ini terlalu panas."
                      }
                ]
          },
          {
                "pattern": "❸ ナA-な／イA-い の",
                "meaning": "Menggantikan kata benda yang sudah dipahami bersama dengan pronomina 'の' ('Yang [sifat]')",
                "explanation": "[Kata Sifat-na な / Kata Sifat-i] の — の berfungsi sebagai kata ganti orang/benda (pronoun) agar tidak mengulang nama benda berkali-kali.",
                "examples": [
                      {
                            "ja": "もうちょっと大きいの、ありますか？",
                            "romaji": "",
                            "id": "Apakah ada yang ukurannya lebih kecil?"
                      },
                      {
                            "ja": "もっと小さいのはありますか",
                            "romaji": "",
                            "id": "Apakah ada yang ukurannya lebih kecil?"
                      }
                ]
          },
          {
                "pattern": "❹ NをV-(ら)れます　＜受身③＞",
                "meaning": "Menyatakan bahwa barang milik pembicara dirusak atau dikenai perbuatan yang merugikan oleh orang lain",
                "explanation": "[Orang] に [Barang] を [Kata Kerja Pasif] ③ — Subjek utama (saya) merasa dirugikan karena barang kepemilikannya disentuh/diambil.",
                "examples": [
                      {
                            "ja": "（私は）自転車を盗まれました。",
                            "romaji": "",
                            "id": "Kaki saya terinjak di dalam kereta."
                      },
                      {
                            "ja": "電車で足を踏まれました",
                            "romaji": "",
                            "id": "Kaki saya terinjak di dalam kereta."
                      }
                ]
          },
          {
                "pattern": "❺ S（普通形）かもしれません",
                "meaning": "Menyatakan kemungkinan terjadinya sesuatu sekitar 50% ('Mungkin / bisa jadi...')",
                "explanation": "[Kalimat Bentuk Biasa] かもしれません — Bentuk biasa + かもしれません. Kata sifat-na dan kata benda tanpa 'だ'.",
                "examples": [
                      {
                            "ja": "もしかしたら、バッグをとられたかもしれません。",
                            "romaji": "",
                            "id": "Besok mungkin akan turun hujan."
                      },
                      {
                            "ja": "明日は雨が降るかもしれません",
                            "romaji": "",
                            "id": "Besok mungkin akan turun hujan."
                      }
                ]
          },
          {
                "pattern": "❻ V-てしまいました",
                "meaning": "Menyatakan penyesalan atas keteledoran atau hal yang terlanjur terjadi di luar kendali ('Terlanjur / tidak sengaja...')",
                "explanation": "[Kata Kerja Bentuk-Te] しまいました — Kata kerja bentuk-Te + しまいました.",
                "examples": [
                      {
                            "ja": "ポイントカード、忘れてしまいました。",
                            "romaji": "",
                            "id": "Saya terlanjur menjatuhkan dompet entah di mana."
                      },
                      {
                            "ja": "財布をどこかに落としてしまいました",
                            "romaji": "",
                            "id": "Saya terlanjur menjatuhkan dompet entah di mana."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 11",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  12: {
    chapter: 12,
    titleJa: "第12課「こっちの店のほうが安いですね」",
    titleId: "Toko yang Sebelah Sini Lebih Murah ya",
    topic: "上手な買い物・商品の比較・使いやすさと配送",
    pdfUrl: "/modul/bab12.pdf",
    canDoList: [
          "Can-do 48: Mampu membaca ulasan barang belanjaan dan batas waktu pengiriman (手元に届くまで).",
          "Can-do 49: Mampu membandingkan dua barang elektronik/rumah tangga dan menyatakan mana yang lebih mudah/sulit digunakan (～やすい／～にくい).",
          "Can-do 50: Mampu menanyakan perbandingan antara dua pilihan produk di toko (どちら／どっちが～か).",
          "Can-do 51: Mampu menyatakan produk mana yang lebih unggul (（N1より）N2のほうが～)."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ V-るまで、～",
                "meaning": "Menyatakan batas waktu berlangsungnya tindakan sampai kejadian berikutnya tiba ('Sampai...')",
                "explanation": "[Kata Kerja Bentuk Kamus] まで、〜 — Kata kerja bentuk kamus + まで.",
                "examples": [
                      {
                            "ja": "手元に届くまで、2日しかかかりませんでした。",
                            "romaji": "",
                            "id": "Saya menunggu di bangku sampai busnya tiba."
                      },
                      {
                            "ja": "バスが来るまでベンチで待ちます",
                            "romaji": "",
                            "id": "Saya menunggu di bangku sampai busnya tiba."
                      }
                ]
          },
          {
                "pattern": "❷ V-にくいです",
                "meaning": "Menyatakan bahwa suatu aktivitas sulit dilakukan atau membawa rasa tidak nyaman ('Sulit / sukar...')",
                "explanation": "[Kata Kerja Bentuk Masu buang ます] にくいです — Stem Masu + にくいです (nikui desu).",
                "examples": [
                      {
                            "ja": "この掃除機は、重くて、使いにくいですね。",
                            "romaji": "",
                            "id": "Pulpen ini agak sulit dipakai menulis."
                      },
                      {
                            "ja": "このペンは少し書きにくいです",
                            "romaji": "",
                            "id": "Pulpen ini agak sulit dipakai menulis."
                      }
                ]
          },
          {
                "pattern": "V-やすいです",
                "meaning": "Menyatakan bahwa suatu aktivitas mudah dikerjakan atau menyenangkan ('Mudah / gampang...')",
                "explanation": "[Kata Kerja Bentuk Masu buang ます] やすいです — Stem Masu + やすいです (yasui desu).",
                "examples": [
                      {
                            "ja": "トーシマの掃除機のほうが動かしやすいですよ。",
                            "romaji": "",
                            "id": "Obat ini kecil sehingga mudah diminum."
                      },
                      {
                            "ja": "この薬は小さくて飲みやすいです",
                            "romaji": "",
                            "id": "Obat ini kecil sehingga mudah diminum."
                      }
                ]
          },
          {
                "pattern": "❸ N1とN2（と）、どちら／どっちが～か？",
                "meaning": "Menanyakan perbandingan kualitas antara dua opsi secara sopan ('Antara N1 dan N2, mana yang lebih...')",
                "explanation": "[N1] と [N2] （と）、どちら／どっち が 〜か？ — どちら (formal) atau どっち (santai) dipadukan dengan partikel が.",
                "examples": [
                      {
                            "ja": "どっちが使いやすいですか？",
                            "romaji": "",
                            "id": "Antara udon dan soba, mana yang lebih Anda sukai?"
                      },
                      {
                            "ja": "うどんとそばとどちらが好きですか",
                            "romaji": "",
                            "id": "Antara udon dan soba, mana yang lebih Anda sukai?"
                      }
                ]
          },
          {
                "pattern": "（N1より）N2のほうが～",
                "meaning": "Menyatakan bahwa N2 lebih unggul daripada N1 dalam aspek tertentu ('N2 lebih ... daripada N1')",
                "explanation": "（[Kata Benda 1] より） [Kata Benda 2] の ほうが 〜 — Pembanding ditandai より (daripada), dan pilihan utama ditandai の ほうが.",
                "examples": [
                      {
                            "ja": "トーシマの方がミツバシより軽くて、動かしやすいですよ。",
                            "romaji": "",
                            "id": "Kereta lebih cepat daripada bus."
                      },
                      {
                            "ja": "バスより電車のほうが速いです",
                            "romaji": "",
                            "id": "Kereta lebih cepat daripada bus."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 12",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  13: {
    chapter: 13,
    titleJa: "第13課「いろいろな資料を展示してあります」",
    titleId: "Berbagai Materi Dipamerkan di Sana",
    topic: "さまざまなサービス・公共施設と利用案内",
    pdfUrl: "/modul/bab13.pdf",
    canDoList: [
          "Can-do 49: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 13.",
          "Can-do 50: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 51: Mampu membaca teks praktis dan instruksi otentik pada Bab 13.",
          "Can-do 52: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ V-（ら）れます　＜受身④＞",
                "meaning": "Menyatakan fakta sejarah, penciptaan karya, atau peristiwa umum tanpa menyebut orang secara spesifik",
                "explanation": "[Kata Kerja Pasif (受身形)] ます ④ — Objek karya/gedung ditandai topik は atau partikel が (contoh: このビルは去年建てられました).",
                "examples": [
                      {
                            "ja": "この建物は、2年前に建てられました。",
                            "romaji": "",
                            "id": "Kuil ini dibangun pada zaman dahulu."
                      },
                      {
                            "ja": "このお寺は昔建てられました",
                            "romaji": "",
                            "id": "Kuil ini dibangun pada zaman dahulu."
                      }
                ]
          },
          {
                "pattern": "❷ V-てあります",
                "meaning": "Menyatakan kondisi benda yang sengaja dipersiapkan oleh seseorang demi tujuan tertentu ('Telah dipasang / disiapkan')",
                "explanation": "[Kata Kerja Transitif Bentuk-Te] あります — Kata kerja transitif diubah ke bentuk-Te + あります. Objek ditandai partikel が.",
                "examples": [
                      {
                            "ja": "昔、使われた道具とか、いろいろな資料を展示してあります。",
                            "romaji": "",
                            "id": "Di dinding telah digantungkan kalender."
                      },
                      {
                            "ja": "壁にカレンダーが掛けてあります",
                            "romaji": "",
                            "id": "Di dinding telah digantungkan kalender."
                      }
                ]
          },
          {
                "pattern": "❸ N1だけじゃなくて、N2も～",
                "meaning": "Menyatakan cakupan tambahan ('Bukan hanya N1 saja, melainkan N2 juga...')",
                "explanation": "[Kata Benda 1] だけじゃなくて、[Kata Benda 2] も〜 — だけじゃなくて menghubungkan dua hal kumulatif yang sama-sama berlaku.",
                "examples": [
                      {
                            "ja": "本だけじゃなくて、CDとか、DVDもただで借りられます。",
                            "romaji": "",
                            "id": "Bukan hanya bahasa Inggris, saya juga bisa berbicara bahasa Jepang."
                      },
                      {
                            "ja": "英語だけじゃなくて日本語も話せます",
                            "romaji": "",
                            "id": "Bukan hanya bahasa Inggris, saya juga bisa berbicara bahasa Jepang."
                      }
                ]
          },
          {
                "pattern": "❹ Nなら、～",
                "meaning": "Menyarankan opsi paling ideal berdasarkan kondisi kriteria tertentu",
                "explanation": "[Kata Benda] なら、〜 — Kata benda langsung ditambah なら.",
                "examples": [
                      {
                            "ja": "返却は、市内の図書館なら、どこに返してもいいです。",
                            "romaji": "",
                            "id": "Kalau pemandian air panas onsen, Kusatsu adalah yang paling terkenal."
                      },
                      {
                            "ja": "温泉なら草津が一番有名です",
                            "romaji": "",
                            "id": "Kalau pemandian air panas onsen, Kusatsu adalah yang paling terkenal."
                      }
                ]
          },
          {
                "pattern": "❺ 【疑問詞】V-ても、～",
                "meaning": "Menyatakan keteguhan hasil tanpa terpengaruh oleh kondisi apa pun ('Bagaimanapun / ke mana pun... tetap...')",
                "explanation": "[Kata Tanya] [Kata Kerja Bentuk-Te] も、〜 — Kata tanya + bentuk-Te + も (misal: 何度聞いても, どこへ行っても).",
                "examples": [
                      {
                            "ja": "返却は、市内の図書館なら、どこに返してもいいです。",
                            "romaji": "",
                            "id": "Berapa kali pun saya berlatih, tetap belum bisa mahir."
                      },
                      {
                            "ja": "何度練習しても上手にできません",
                            "romaji": "",
                            "id": "Berapa kali pun saya berlatih, tetap belum bisa mahir."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 13",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  14: {
    chapter: 14,
    titleJa: "第14課「前髪は、もう少し短く切ってもらえますか？」",
    titleId: "Bisa Tolong Potong Poni Sedikit Lebih Pendek?",
    topic: "さまざまなサービス・美容院と宅配サービス",
    pdfUrl: "/modul/bab14.pdf",
    canDoList: [
          "Can-do 53: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 14.",
          "Can-do 54: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 55: Mampu membaca teks praktis dan instruksi otentik pada Bab 14.",
          "Can-do 56: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ ナA-に／イA-く V",
                "meaning": "Mengubah kata sifat menjadi kata keterangan cara (adverbia) untuk menerangkan kata kerja ('Secara / dengan...')",
                "explanation": "[Kata Sifat-na に] ／ [Kata Sifat-i buang い + く] [Kata Kerja] — Sifat-na + に, sifat-i buang 'い' + く lalu diikuti kata kerja (contoh: 早く起きる, きれいに書く).",
                "examples": [
                      {
                            "ja": "全体的に短く切ってください。",
                            "romaji": "",
                            "id": "Tolong tulis nama dengan ukuran besar."
                      },
                      {
                            "ja": "名前を大きく書いてください",
                            "romaji": "",
                            "id": "Tolong tulis nama dengan ukuran besar."
                      }
                ]
          },
          {
                "pattern": "❷ Nのために、～",
                "meaning": "Menyatakan tujuan utama atau demi kemaslahatan seseorang ('Demi / untuk tujuan...')",
                "explanation": "[Kata Benda] の ために、〜 — Kata benda disambung partikel の sebelum ために.",
                "examples": [
                      {
                            "ja": "外国の方のために、いろいろなサービスがあります。",
                            "romaji": "",
                            "id": "Demi kesehatan saya berolahraga setiap hari."
                      },
                      {
                            "ja": "健康のために毎日運動します",
                            "romaji": "",
                            "id": "Demi kesehatan saya berolahraga setiap hari."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 14",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  15: {
    chapter: 15,
    titleJa: "第15課「会議室の電気がついたままでした」",
    titleId: "Lampu Ruang Rapat Masih Dibiarkan Menyala",
    topic: "自然と環境・省エネルギーと日常の注意",
    pdfUrl: "/modul/bab15.pdf",
    canDoList: [
          "Can-do 57: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 15.",
          "Can-do 58: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 59: Mampu membaca teks praktis dan instruksi otentik pada Bab 15.",
          "Can-do 60: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ V-たままです",
                "meaning": "Menyatakan membiarkan suatu kondisi tetap berlangsung tanpa mengembalikannya ke posisi semula ('Dalam keadaan terbiar...')",
                "explanation": "[Kata Kerja Bentuk-Ta] まま です — Kata kerja bentuk lampau ta-kei + ままで (contoh: エアコンをつけたまま寝ました).",
                "examples": [
                      {
                            "ja": "会議室の電気がついたままでしたよ。",
                            "romaji": "",
                            "id": "Saya terlanjur tidur dalam keadaan jendela tetap terbuka."
                      },
                      {
                            "ja": "窓を開けたまま寝てしまいました",
                            "romaji": "",
                            "id": "Saya terlanjur tidur dalam keadaan jendela tetap terbuka."
                      }
                ]
          },
          {
                "pattern": "❷ V-るのにいいです",
                "meaning": "Menyatakan kegunaan, fungsi, atau efektivitas suatu benda untuk tujuan perbuatan tertentu ('Bagus / cocok untuk...')",
                "explanation": "[Kata Kerja Bentuk Kamus] のに いいです — Kata kerja bentuk kamus dinominalkan dengan のに lalu diikuti kata evaluasi seperti いい, 便利.",
                "examples": [
                      {
                            "ja": "マイストローは、ごみを減らすのにいいんですよ。",
                            "romaji": "",
                            "id": "Tas ini bagus untuk dipakai pergi bepergian wisata."
                      },
                      {
                            "ja": "このカバンは旅行に行くのにいいです",
                            "romaji": "",
                            "id": "Tas ini bagus untuk dipakai pergi bepergian wisata."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 15",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  16: {
    chapter: 16,
    titleJa: "第16課「地震が来ても、あわてて動かないでください」",
    titleId: "Meski Terjadi Gempa, Jangan Panik dan Bergerak Gegabah",
    topic: "自然と環境・防災と緊急時の対応",
    pdfUrl: "/modul/bab16.pdf",
    canDoList: [
          "Can-do 61: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 16.",
          "Can-do 62: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 63: Mampu membaca teks praktis dan instruksi otentik pada Bab 16.",
          "Can-do 64: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ V(命令形）　\r\nV-るな（禁止の命令形）",
                "meaning": "Instruksi darurat, rambu pabrik, atau aba-aba keselamatan di lingkungan kerja pabrik / proyek ('Harus segera... / Jangan...!')",
                "explanation": "Bentuk Perintah Tegas (命令形) & Bentuk Larangan (禁止形：V-るな) — Gol 1 e-dan (止まれ), Gol 2 ro (止めろ). Bentuk larangan: kamus + な (触るな).",
                "examples": [
                      {
                            "ja": "急げ。こっちに集まれ。\r\n走るな。",
                            "romaji": "",
                            "id": "Karena berbahaya, berhenti di sini!"
                      },
                      {
                            "ja": "危ないからここで止まれ",
                            "romaji": "",
                            "id": "Karena berbahaya, berhenti di sini!"
                      }
                ]
          },
          {
                "pattern": "❷ V-ないようにしてください",
                "meaning": "Memberikan instruksi kebiasaan atau petunjuk disiplin preventif secara sopan ('Tolong usahakan untuk tidak...')",
                "explanation": "[Kata Kerja Bentuk-Nai] ように して ください — Kata kerja bentuk-Nai + ように してください.",
                "examples": [
                      {
                            "ja": "できるだけ煙を吸わないようにしてください。",
                            "romaji": "",
                            "id": "Tolong usahakan agar tidak terlambat."
                      },
                      {
                            "ja": "遅刻しないようにしてください",
                            "romaji": "",
                            "id": "Tolong usahakan agar tidak terlambat."
                      }
                ]
          },
          {
                "pattern": "❸ V-（られ）なくなります",
                "meaning": "Menyatakan perubahan hilangnya kemampuan yang sebelumnya bisa dilakukan ('Menjadi tidak bisa lagi...')",
                "explanation": "[Kata Kerja Potensial Negatif] なくなります — Potensial negatif (-nai) buang 'い' + くなります.",
                "examples": [
                      {
                            "ja": "ドアが開かなくなると、外に逃げられなくなります。",
                            "romaji": "",
                            "id": "Karena sibuk, saya menjadi tidak bisa bermain lagi."
                      },
                      {
                            "ja": "忙しくて遊べなくなりました",
                            "romaji": "",
                            "id": "Karena sibuk, saya menjadi tidak bisa bermain lagi."
                      }
                ]
          },
          {
                "pattern": "❹ Sても、～",
                "meaning": "Menyatakan kondisi pengandaian konsesif yang berlawanan dengan hasil lumrah ('Meskipun / walaupun... tetap...')",
                "explanation": "[Kalimat Bentuk-Te] も、〜 — Bentuk-Te + も (kata sifat-i: 寒くても, kata benda/sifat-na: でも).",
                "examples": [
                      {
                            "ja": "大きな地震が来ても、あわてて動かないでください。",
                            "romaji": "",
                            "id": "Meskipun hujan turun, pertandingan tetap diadakan."
                      },
                      {
                            "ja": "雨が降っても試合はあります",
                            "romaji": "",
                            "id": "Meskipun hujan turun, pertandingan tetap diadakan."
                      }
                ]
          },
          {
                "pattern": "❺ V（普通形）かどうか、～",
                "meaning": "Menyatakan kebimbangan atas kepastian benar atau tidaknya suatu hal ('Apakah ... atau tidak')",
                "explanation": "[Kalimat Bentuk Biasa] かどうか、〜 — Bentuk biasa + かどうか, sering diikuti kata kerja periksa/konfirmasi (調べます, 聞きます).",
                "examples": [
                      {
                            "ja": "店が開いているかどうか、わからないけど…。",
                            "romaji": "",
                            "id": "Saya tidak tahu apakah besok cerah atau tidak."
                      },
                      {
                            "ja": "明日晴れるかどうか分かりません",
                            "romaji": "",
                            "id": "Saya tidak tahu apakah besok cerah atau tidak."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 16",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  17: {
    chapter: 17,
    titleJa: "第17課「日本語が前より話せるようになりました」",
    titleId: "Sekarang Saya Sudah Lebih Bisa Berbahasa Jepang",
    topic: "私の人生・成長と変化・日本語の上達",
    pdfUrl: "/modul/bab17.pdf",
    canDoList: [
          "Can-do 65: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 17.",
          "Can-do 66: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 67: Mampu membaca teks praktis dan instruksi otentik pada Bab 17.",
          "Can-do 68: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ V-（られ）るように なりました",
                "meaning": "Menyatakan perkembangan keterampilan diri yang kini telah mampu dikuasai berkat latihan ('Kini telah menjadi bisa...')",
                "explanation": "[Kata Kerja Potensial Bentuk Kamus] ように なりました — Kata kerja bentuk potensial (jisho-kei) + ように なりました.",
                "examples": [
                      {
                            "ja": "最近は、ほかの人にお店の情報を教えられるようになりました。",
                            "romaji": "",
                            "id": "Kini saya sudah bisa berbicara di telepon dalam bahasa Jepang."
                      },
                      {
                            "ja": "日本語で電話ができるようになりました",
                            "romaji": "",
                            "id": "Kini saya sudah bisa berbicara di telepon dalam bahasa Jepang."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 17",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

  18: {
    chapter: 18,
    titleJa: "第18課「将来、自分の会社を作ろうと思います」",
    titleId: "Di Masa Depan, Saya Berniat Mendirikan Perusahaan Sendiri",
    topic: "私の人生・将来の夢と計画・キャリア形成",
    pdfUrl: "/modul/bab18.pdf",
    canDoList: [
          "Can-do 69: Mampu memahami materi dan ungkapan percakapan praktis pada Bab 18.",
          "Can-do 70: Mampu menggunakan pola kalimat inti dalam situasi kehidupan kerja sehari-hari di Jepang.",
          "Can-do 71: Mampu membaca teks praktis dan instruksi otentik pada Bab 18.",
          "Can-do 72: Mampu berkomunikasi aktif sesuai standar CEFR A2 / JFT-Basic."
    ],
    keyVocabCategories: [],
    grammarPoints: [
          {
                "pattern": "❶ V-（よ）うと思います／思っています",
                "meaning": "Menyatakan rencana atau kehendak pribadi yang hendak diwujudkan ('Saya bermaksud / berencana...')",
                "explanation": "[Kata Kerja Bentuk Ajakan (意志形)] と 思います ／ 思っています — Kata kerja bentuk kehendak/ishikei (Gol 1: o-dan + u, Gol 2: you) + と 思っています.",
                "examples": [
                      {
                            "ja": "将来は、タイで、自分の会社を作ろうと思います。",
                            "romaji": "",
                            "id": "Saya berencana pulang ke tanah air tahun depan."
                      },
                      {
                            "ja": "来年国へ帰ろうと思っています",
                            "romaji": "",
                            "id": "Saya berencana pulang ke tanah air tahun depan."
                      }
                ]
          },
          {
                "pattern": "❷ V-るために、～",
                "meaning": "Menyatakan tekad kuat melakukan suatu perbuatan demi meraih cita-cita ('Demi / untuk tujuan melakukan...')",
                "explanation": "[Kata Kerja Bentuk Kamus] ために、〜 — Kata kerja bentuk kamus + ために. Kedua klausa dikendalikan oleh subjek berkehendak sama.",
                "examples": [
                      {
                            "ja": "日本に住むために、もっと日本語をがんばろうと思います。",
                            "romaji": "",
                            "id": "Saya belajar setiap hari demi bekerja di Jepang."
                      },
                      {
                            "ja": "日本で働くために毎日勉強しています",
                            "romaji": "",
                            "id": "Saya belajar setiap hari demi bekerja di Jepang."
                      }
                ]
          },
          {
                "pattern": "❸ V-てあげます",
                "meaning": "Melakukan suatu kebaikan atau bantuan tindakan demi orang lain ('Melakukan kebaikan V untuk orang lain')",
                "explanation": "[Kata Kerja Bentuk-Te] あげます — Kata kerja bentuk-Te + あげます. Pihak penerima jasa ditandai partikel に.",
                "examples": [
                      {
                            "ja": "両親に、家を建ててあげるつもりです。",
                            "romaji": "",
                            "id": "Saya membawakan barang bawaan teman sebagai bantuan."
                      },
                      {
                            "ja": "友達の荷物を持ってあげました",
                            "romaji": "",
                            "id": "Saya membawakan barang bawaan teman sebagai bantuan."
                      }
                ]
          },
          {
                "pattern": "❹ V-てもらいます",
                "meaning": "Menerima budi baik atau pertolongan tindakan dari orang lain ('Mendapat bantuan tindakan dari...')",
                "explanation": "[Kata Kerja Bentuk-Te] もらいます — Pelaku yang memberi jasa ditandai dengan partikel に.",
                "examples": [
                      {
                            "ja": "JF工業のみなさんには、とても親切にしてもらいました。",
                            "romaji": "",
                            "id": "Saya dibantu dikoreksi karangan karangannya oleh guru."
                      },
                      {
                            "ja": "先生に作文を直してもらいました",
                            "romaji": "",
                            "id": "Saya dibantu dikoreksi karangan karangannya oleh guru."
                      }
                ]
          },
          {
                "pattern": "❺ V-てくれます",
                "meaning": "Orang lain dengan sukarela melakukan kebaikan atau bantuan tindakan kepada saya atau keluarga saya",
                "explanation": "[Kata Kerja Bentuk-Te] くれます — Pelaku pertolongan ditandai partikel が. Kata kerja くれます khusus aksi yang mengarah ke pihak pembicara.",
                "examples": [
                      {
                            "ja": "山内さんは、私にたくさん、日本語を教えてくれました。",
                            "romaji": "",
                            "id": "Senior dengan senang hati membantu pekerjaan saya."
                      },
                      {
                            "ja": "先輩が仕事を手伝ってくれました",
                            "romaji": "",
                            "id": "Senior dengan senang hati membantu pekerjaan saya."
                      }
                ]
          }
    ],
    cultureNotes: [
      {
        title: "Tips Budaya & Kehidupan Bab 18",
        content: "Materi otentik Irodori Nihongo de Seikatsu A2.2 (The Japan Foundation) yang menekankan pemahaman konteks sosial dan komunikasi praktis di Jepang."
      }
    ]
  },

};
