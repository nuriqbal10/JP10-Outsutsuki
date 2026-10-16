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
    titleJa: "第1課「私のこと」",
    titleId: "Tentang Diriku",
    topic: "Perkenalan Diri, Asal Daerah & Kehidupan di Jepang",
    pdfUrl: "/modul/bab1.pdf",
    slidesUrl: "https://docs.google.com/presentation/d/e/2PACX-1vQLGyJ9sXk4h_UE1wHemR7Kp8_CH4YxnxFkHSpY25gvnRDJnwgbuz40g2FJM0TLRKvpjtsJfeshP3_o/embed?start=false&loop=false&delayms=3000",
    canDoList: [
      "Can-do 1: Mampu memperkenalkan diri secara lebih rinci (asal, pengalaman di Jepang, pekerjaan/keahlian).",
      "Can-do 2: Mampu menanyakan dan menceritakan kesan pertama serta pengalaman tinggal di Jepang.",
      "Can-do 3: Mampu memahami profil singkat rekan kerja di papan pengumuman perusahaan.",
      "Can-do 4: Mampu menuliskan profil singkat diri sendiri untuk forum atau perkenalan komunitas."
    ],
    keyVocabCategories: [
      {
        category: "Asal & Pengalaman",
        items: [
          { ja: "出身 (しゅっしん)", id: "Asal daerah/negara" },
          { ja: "専門 (せんもん)", id: "Bidang keahlian / spesialisasi" },
          { ja: "慣れる (なれる)", id: "Terbiasa / beradaptasi" },
          { ja: "暮らし (くらし)", id: "Kehidupan sehari-hari" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "Vた＋ばかりです",
        meaning: "Baru saja melakukan...",
        explanation: "Menyatakan bahwa suatu perbuatan baru saja terjadi atau waktu yang berlalu masih terasa sangat baru bagi pembicara.",
        examples: [
          { ja: "先週、日本に来たばかりです。", romaji: "Senshuu, Nihon ni kita bakari desu.", id: "Saya baru saja datang ke Jepang minggu lalu." },
          { ja: "仕事を始めたばかりで、まだ慣れていません。", romaji: "Shigoto o hajimeta bakari de, mada narete imasen.", id: "Saya baru mulai bekerja, jadi belum terbiasa." }
        ]
      },
      {
        pattern: "Vて＋います (Keadaan saat ini)",
        meaning: "Sedang / berada dalam keadaan...",
        explanation: "Menyatakan status tempat tinggal, status pernikahan, atau pekerjaan yang sedang dijalani.",
        examples: [
          { ja: "工場の寮に住んでいます。", romaji: "Koujou no ryou ni sunde imasu.", id: "Saya tinggal di asrama pabrik." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Kesan Pertama & Etiket Perkenalan di Perusahaan Jepang",
        content: "Di tempat kerja Jepang (職場), membungkuk (お辞儀 - Ojigi) dengan sudut 30-45 derajat saat menyebutkan nama dan bidang keahlian meninggalkan kesan profesional dan sopan."
      }
    ]
  },

  2: {
    chapter: 2,
    titleJa: "第2課「どんな人ですか」",
    titleId: "Orang yang Seperti Apakah Dia?",
    topic: "Ciri Fisik, Karakter Orang & Pakaian Kerja",
    pdfUrl: "/modul/bab2.pdf",
    canDoList: [
      "Can-do 5: Mampu mendeskripsikan penampilan fisik dan gaya berpakaian rekan kerja.",
      "Can-do 6: Mampu menjelaskan sifat atau karakter seseorang (rajin, ramah, pendiam).",
      "Can-do 7: Mampu mendengarkan deskripsi ciri-ciri seseorang dan mengidentifikasinya dalam kelompok.",
      "Can-do 8: Mampu membaca artikel profil pendek tentang tokoh atau rekan teladan."
    ],
    keyVocabCategories: [
      {
        category: "Sifat & Karakter",
        items: [
          { ja: "まじめ（な）", id: "Rajin / tekun / bersungguh-sungguh" },
          { ja: "親切（な）(しんせつ)", id: "Ramah / baik hati" },
          { ja: "明るい (あかるい)", id: "Ceria / periang" },
          { ja: "おとなしい", id: "Pendiam / tenang" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "Kata Sifat (tanpa -i/-na)＋そう（な／です）",
        meaning: "Kelihatannya / tampaknya...",
        explanation: "Menyatakan dugaan atau penilaian sekilas berdasarkan penampilan visual yang dilihat.",
        examples: [
          { ja: "あの人はとてもまじめそうな人ですね。", romaji: "Ano hito wa totemo majimesou na hito desu ne.", id: "Orang itu kelihatannya orang yang sangat tekun ya." },
          { ja: "優しそうな先輩で、安心しました。", romaji: "Yasashisou na senpai de, anshin shimashita.", id: "Senior yang kelihatannya ramah, jadi saya merasa lega." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Penilaian Karakter di Tempat Kerja Jepang",
        content: "Sifat 'まじめ' (majime - tekun/bertanggung jawab) adalah sifat yang paling dihargai oleh atasan dan rekan kerja di Jepang."
      }
    ]
  },

  3: {
    chapter: 3,
    titleJa: "第3課「おすすめは何ですか」",
    titleId: "Apa Rekomendasinya?",
    topic: "Restoran, Menu Makanan, Alergi & Reservasi",
    pdfUrl: "/modul/bab3.pdf",
    canDoList: [
      "Can-do 9: Mampu menanyakan rekomendasi menu makanan di restoran atau warung makan.",
      "Can-do 10: Mampu menyampaikan pantangan makanan atau alergi (halal, vegetarian, alergi kacang/seafood).",
      "Can-do 11: Mampu memesan makanan dan melakukan reservasi meja sederhana.",
      "Can-do 12: Mampu membaca daftar menu dan label bahan makanan pada kemasan."
    ],
    keyVocabCategories: [
      {
        category: "Restoran & Makanan",
        items: [
          { ja: "おすすめ", id: "Rekomendasi" },
          { ja: "アレルギー", id: "Alergi" },
          { ja: "豚肉 (ぶたにく)", id: "Daging babi" },
          { ja: "禁煙席 (きんえんせき)", id: "Area bebas rokok" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "～が入っていますか (～ ga haitte imasu ka)",
        meaning: "Apakah mengandung / ada bahan...?",
        explanation: "Digunakan untuk menanyakan kandungan bahan makanan demi memastikan kehalalan atau menghindari alergi.",
        examples: [
          { ja: "この料理に豚肉が入っていますか？", romaji: "Kono ryouri ni butaniku ga haitte imasu ka?", id: "Apakah masakan ini mengandung daging babi?" }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Konfirmasi Alergi & Halal di Jepang",
        content: "Restoran di Jepang kini semakin memahami kebutuhan diet khusus (アレルギー表示). Jangan ragu menanyakan bahan makanan ke pelayan (店員)."
      }
    ]
  },

  4: {
    chapter: 4,
    titleJa: "第4課「何時からですか」",
    titleId: "Dari Jam Berapa?",
    topic: "Jam Kerja, Lembur, Jadwal & Janji Temu",
    pdfUrl: "/modul/bab4.pdf",
    canDoList: [
      "Can-do 13: Mampu menanyakan dan memahami jam kerja, sistem shift, dan waktu istirahat pabrik.",
      "Can-do 14: Mampu mengonfirmasi kesediaan jam lembur (残業 - zangyou).",
      "Can-do 15: Mampu membuat dan menyepakati janji temu dengan rekan kerja atau dokter.",
      "Can-do 16: Mampu membaca tabel jadwal shift kerja bulanan (勤務表)."
    ],
    keyVocabCategories: [
      {
        category: "Jadwal & Shift Kerja",
        items: [
          { ja: "残業 (ざんぎょう)", id: "Lembur" },
          { ja: "早番 (はやばん)", id: "Shift pagi" },
          { ja: "遅番 (おそばん)", id: "Shift siang/sore" },
          { ja: "夜勤 (やきん)", id: "Shift malam" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "Waktu＋までに",
        meaning: "Paling lambat sebelum / sampai dengan batas...",
        explanation: "Menyatakan batas akhir (deadline) suatu tindakan harus sudah selesai dilakukan.",
        examples: [
          { ja: "明日の午後5時までにレポートを出してください。", romaji: "Ashita no gogo goji made ni repooto o dashite kudasai.", id: "Kumpulkan laporan paling lambat jam 5 sore besok." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Ketepatan Waktu (5分前行動)",
        content: "Di dunia kerja Jepang, tiba 5-10 menit sebelum jam kerja dimulai (5分前行動) adalah norma etika dasar."
      }
    ]
  },

  5: {
    chapter: 5,
    titleJa: "第5課「安全第一」",
    titleId: "Utamakan Keselamatan (Safety First)",
    topic: "Aturan Pabrik, Keselamatan Kerja & Prosedur K3",
    pdfUrl: "/modul/bab5.pdf",
    canDoList: [
      "Can-do 17: Mampu memahami rambu keselamatan dan peringatan bahaya di pabrik/tempat kerja.",
      "Can-do 18: Mampu memahami instruksi larangan keselamatan dan keharusan memakai APD.",
      "Can-do 19: Mampu melaporkan kondisi darurat atau kerusakan alat kerja kepada pengawas.",
      "Can-do 20: Mampu membaca checklist inspeksi keselamatan 5S (Seiri, Seiton, Seisou, Seiketsu, Shitsuke)."
    ],
    keyVocabCategories: [
      {
        category: "K3 & APD Pabrik",
        items: [
          { ja: "ヘルメット", id: "Helm keselamatan" },
          { ja: "安全靴 (あんぜんぐつ)", id: "Sepatu keselamatan (safety shoes)" },
          { ja: "危険 (きけん)", id: "Bahaya" },
          { ja: "整理整頓 (せいりせいとん)", id: "Ringkas & Rapi (5S)" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "Vない＋でください",
        meaning: "Tolong jangan...",
        explanation: "Digunakan untuk memberikan instruksi larangan demi keselamatan kerja.",
        examples: [
          { ja: "機械が動いている間は、触らないでください。", romaji: "Kikai ga ugoite iru aida wa, sawaranaide kudasai.", id: "Selama mesin beroperasi, tolong jangan disentuh." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Gerakan Shisa Kanko (指差呼称)",
        content: "Pekerja di Jepang menunjuk sambil menyebut nama objek (Pointing and Calling) untuk memverifikasi saklar atau kondisi aman."
      }
    ]
  },

  6: {
    chapter: 6,
    titleJa: "第6課「どうやって行きますか」",
    titleId: "Bagaimana Cara Perginya?",
    topic: "Transportasi, Tiket Kereta & Rute Perjalanan",
    pdfUrl: "/modul/bab6.pdf",
    canDoList: [
      "Can-do 21: Mampu menanyakan rute dan transportasi tercepat/termurah menuju destinasi.",
      "Can-do 22: Mampu memahami pengumuman transit dan pergantian kereta (乗り換え - norikae).",
      "Can-do 23: Mampu membeli tiket kereta atau mengisi saldo kartu IC (Suica/Pasmo).",
      "Can-do 24: Mampu membaca peta jaringan kereta dan papan petunjuk peron."
    ],
    keyVocabCategories: [
      {
        category: "Kereta & Navigasi",
        items: [
          { ja: "乗り換え (のりかえ)", id: "Pindah / transit kereta" },
          { ja: "各駅停車 (かくえきていしゃ)", id: "Kereta lokal (berhenti di tiap stasiun)" },
          { ja: "特急 (とっきゅう)", id: "Kereta ekspres terbatas" },
          { ja: "運賃 (うんちん)", id: "Tarif perjalanan" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "Tempat＋に行くには、どうやって行けばいいですか",
        meaning: "Untuk pergi ke..., sebaiknya bagaimana caranya?",
        explanation: "Digunakan untuk meminta petunjuk rute terbaik dari stasiun atau lokasi awal.",
        examples: [
          { ja: "市役所に行くには、何番のバスに乗ればいいですか？", romaji: "Shiyakusho ni iku ni wa, nanban no basu ni noreba ii desu ka?", id: "Untuk ke kantor walikota, sebaiknya naik bus nomor berapa?" }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Etiket di Dalam Kereta Jepang",
        content: "Di kereta Jepang, telepon genggam wajib diatur ke mode hening (マナーモード) dan berbicara di telepon dilarang demi kenyamanan bersama."
      }
    ]
  },

  7: {
    chapter: 7,
    titleJa: "第7課「雨が降ったら、ホールでやります」",
    titleId: "Kalau Hujan Turun, Kita Adakan di Aula",
    topic: "Festival Komunitas, Cuaca & Partisipasi Acara",
    pdfUrl: "/modul/bab7.pdf",
    canDoList: [
      "Can-do 25: Mampu memahami pengumuman perubahan rencana acara akibat kondisi cuaca.",
      "Can-do 26: Mampu menanyakan syarat keikutsertaan atau pendaftaran kegiatan warga setempat.",
      "Can-do 27: Mampu meminta izin atau mengonfirmasi aturan membawa barang pada kegiatan.",
      "Can-do 28: Mampu membaca selebaran pengumuman lomba atau festival lingkungan sekitar."
    ],
    keyVocabCategories: [
      {
        category: "Acara Komunitas",
        items: [
          { ja: "催し物 (もよおしもの)", id: "Kegiatan / pertunjukan" },
          { ja: "雨天決行 (うてんけっこう)", id: "Tetap berlangsung meski hujan" },
          { ja: "雨天中止 (うてんちゅうし)", id: "Dibatalkan jika hujan" },
          { ja: "参加費 (さんかひ)", id: "Biaya pendaftaran" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "Vたら / A-i かったら / A-na・N だったら",
        meaning: "Jika / Kalau...",
        explanation: "Menyatakan pengandaian kondisional. Jika kondisi di depan terjadi, maka tindakan di kalimat belakang akan dilaksanakan.",
        examples: [
          { ja: "雨が降ったら、ホールでやります。", romaji: "Ame ga futtara, hooru de yarimasu.", id: "Kalau hujan turun, kita adakan di aula." },
          { ja: "時間がなかったら、無理しなくてもいいですよ。", romaji: "Jikan ga nakattara, muri shinakutemo ii desu yo.", id: "Kalau tidak ada waktu, tidak usah dipaksakan ya." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Komunitas Lingkungan (町内会・自治会)",
        content: "Kegiatan gotong royong dan festival warga sangat membantu pekerja migran berbaur dan mendapat relasi akrab dengan warga lokal Jepang."
      }
    ]
  },

  8: {
    chapter: 8,
    titleJa: "第8課「屋台はどこかわかりますか？」",
    titleId: "Tahukah Anda di Mana Stan Makanan Berada?",
    topic: "Festival Budaya, Lokasi Stan & Denah Acara",
    pdfUrl: "/modul/bab8.pdf",
    canDoList: [
      "Can-do 32: Mampu membaca denah festival/bazar dan menemukan letak stan, panggung, dan fasilitas umum.",
      "Can-do 33: Mampu menanyakan lokasi stan atau kegiatan tertentu kepada petugas informasi festival.",
      "Can-do 34: Mampu memahami penjelasan arah dan lokasi yang menggunakan kata penunjuk ruang (突き当たり、右手、奥).",
      "Can-do 35: Mampu memahami instruksi dan larangan tata tertib festival (dilarang merokok, membuang sampah pada tempatnya)."
    ],
    keyVocabCategories: [
      {
        category: "Festival & Stan",
        items: [
          { ja: "屋台 (やたい)", id: "Stan / warung tenda festival" },
          { ja: "ステージ", id: "Panggung pertunjukan" },
          { ja: "観光案内 (かんこうあんない)", id: "Pusat informasi wisata" },
          { ja: "本部 (ほんぶ)", id: "Kantor pusat panitia festival" }
        ]
      },
      {
        category: "Arah & Lokasi",
        items: [
          { ja: "突き当たり (つきあたり)", id: "Ujung jalan / mentok" },
          { ja: "右手 (みぎて)", id: "Sisi sebelah kanan" },
          { ja: "左手 (ひだりて)", id: "Sisi sebelah kiri" },
          { ja: "奥 (おく)", id: "Bagian dalam / paling ujung" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "[Kalimat Tanya]＋かわかりますか (～ ka wakarimasu ka)",
        meaning: "Tahukah Anda / Apakah Anda tahu di mana...?",
        explanation: "Digunakan untuk menanyakan informasi secara santun dan ramah kepada orang lain atau petugas.",
        examples: [
          { ja: "すみません、屋台はどこかわかりますか？", romaji: "Sumimasen, yatai wa doko ka wakarimasu ka?", id: "Permisi, tahukah Anda di mana stan-stan makanan berada?" },
          { ja: "次のイベントは何時からかわかりますか？", romaji: "Tsugi no ibento wa nanji kara ka wakarimasu ka?", id: "Apakah Anda tahu jam berapa acara berikutnya dimulai?" }
        ]
      },
      {
        pattern: "KB＋はご遠慮ください (～ wa go-enryo kudasai)",
        meaning: "Dimohon untuk tidak / dilarang...",
        explanation: "Ungkapan sopan formal yang sering tertera pada papan petunjuk atau pengumuman festival untuk melarang suatu hal.",
        examples: [
          { ja: "会場内での喫煙はご遠慮ください。", romaji: "Kaijounai de no kitsuen wa go-enryo kudasai.", id: "Dimohon untuk tidak merokok di dalam area festival." },
          { ja: "フラッシュ撮影はご遠慮ください。", romaji: "Furasshu satsuei wa go-enryo kudasai.", id: "Dimohon tidak menggunakan lampu kilat (flash) saat memotret." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Budaya Matsuri (お祭り) & Pemilahan Sampah",
        content: "Festival Jepang sangat terkenal dengan stan makanan (屋台) seperti takoyaki dan yakisoba. Pengunjung diwajibkan membawa pulang sampah atau membuangnya ke tempat sampah terpilah (分別ごみ箱)."
      }
    ]
  },

  9: {
    chapter: 9,
    titleJa: "第9課「成人の日は、何をするんですか？」",
    titleId: "Pada Hari Kedewasaan, Apa yang Biasanya Dilakukan?",
    topic: "Hari Libur Nasional, Perayaan Tradisional & Budaya Jepang",
    pdfUrl: "/modul/bab9.pdf",
    canDoList: [
      "Can-do 36: Mampu menanyakan dan menjelaskan arti atau kegiatan pada hari libur nasional Jepang (成人の日, お正月, 七五三, こどもの日).",
      "Can-do 37: Mampu menjelaskan hari raya penting di negara asal (Idul Fitri, Hari Kemerdekaan) dengan kalimat sederhana.",
      "Can-do 38: Mampu mendengarkan dan memahami penjelasan singkat tentang tradisi tahun baru atau festival budaya Jepang.",
      "Can-do 39: Mampu membaca jadwal kalender libur dan pengumuman kegiatan peringatan hari besar."
    ],
    keyVocabCategories: [
      {
        category: "Hari Besar & Tradisi Jepang",
        items: [
          { ja: "成人の日 (せいじんのひ)", id: "Hari Kedewasaan (Senin kedua Januari)" },
          { ja: "お正月 (おしょうがつ)", id: "Tahun Baru Jepang" },
          { ja: "初詣 (はつもうで)", id: "Ziarah kuil pertama di awal tahun" },
          { ja: "七五三 (しちごさん)", id: "Festival perayaan anak usia 3, 5, dan 7 tahun" },
          { ja: "お盆 (おぼん)", id: "Festival mengenang leluhur (pertengahan Agustus)" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "[Bentuk Biasa / KB・KS-na な]＋んです（か）",
        meaning: "Mengapa / Menjelaskan alasan atau latar belakang...",
        explanation: "Digunakan ketika ingin meminta penjelasan rinci mengenai suatu kebiasaan atau perayaan yang membuat pembicara penasaran.",
        examples: [
          { ja: "成人の日は、何をするんですか？", romaji: "Seijin no hi wa, nani o surun desu ka?", id: "Pada Hari Kedewasaan, apa yang biasanya dilakukan?" },
          { ja: "20歳になった若者がきれいな着物を着て式典に出るんです。", romaji: "Hatasuchi ni natta wakamono ga kirei na kimono o kite shikiten ni derun desu.", id: "Pemuda yang genap berusia 20 tahun mengenakan kimono indah dan menghadiri upacara kedewasaan." }
        ]
      },
      {
        pattern: "Vたり、Vたりします",
        meaning: "Melakukan kegiatan A, kegiatan B, dan sebagainya...",
        explanation: "Menyebutkan contoh beberapa kegiatan perayaan tanpa harus menyebutkan seluruhnya secara urut waktu.",
        examples: [
          { ja: "お正月は神社にお参りに行ったり、おせち料理を食べたりします。", romaji: "Oshougatsu wa jinja ni omairi ni ittari, osechi ryouri o tabetari shimasu.", id: "Saat tahun baru, kami pergi berdoa ke kuil, makan masakan Osechi, dan sebagainya." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Perayaan Hari Kedewasaan (成人の日)",
        content: "Di Jepang, mereka yang telah berusia dewasa merayakannya dengan upacara resmi di balai kota. Wanita muda umumnya mengenakan furisode (振袖) dan pria mengenakan jas atau hakama."
      }
    ]
  },

  10: {
    chapter: 10,
    titleJa: "第10課「どんな服を着て行けばいいですか？」",
    titleId: "Pakaian Seperti Apa yang Sebaiknya Saya Kenakan?",
    topic: "Tata Cara Berpakaian, Etiket Upacara & Kebiasaan Sosial",
    pdfUrl: "/modul/bab10.pdf",
    canDoList: [
      "Can-do 40: Mampu menanyakan etiket berpakaian dan barang yang harus dibawa untuk menghadiri upacara pernikahan atau pemakaman.",
      "Can-do 41: Mampu memberi dan menerima saran tentang tata krama sosial dan etiket bertamu di Jepang.",
      "Can-do 42: Mampu memahami penjelasan tradisi sumbangan uang duka (香典) dan amplop sumbangan (ご祝儀).",
      "Can-do 43: Mampu membaca petunjuk etiket dan aturan pakaian pada undangan acara resmi."
    ],
    keyVocabCategories: [
      {
        category: "Upacara & Tata Krama",
        items: [
          { ja: "お葬式 (おそうしき)", id: "Upacara pemakaman" },
          { ja: "結婚式 (けっこんしき)", id: "Upacara pernikahan" },
          { ja: "香典 (こうでん)", id: "Uang duka cita" },
          { ja: "ご祝儀 (ごしゅうぎ)", id: "Uang ucapan selamat (pernikahan)" },
          { ja: "喪服 (もふく)", id: "Pakaian duka (hitam polos)" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "Vば＋いいですか (Kata Kerja Bentuk Pengandaian -ba ii desu ka)",
        meaning: "Sebaiknya bagaimana saya...?",
        explanation: "Digunakan untuk meminta petunjuk atau nasihat kepada orang yang lebih berpengalaman saat merasa ragu.",
        examples: [
          { ja: "お葬式には、どんな服を着て行けばいいですか？", romaji: "Osoushiki ni wa, donna fuku o kite ikeba ii desu ka?", id: "Untuk menghadiri pemakaman, pakaian seperti apa yang sebaiknya saya kenakan?" },
          { ja: "黒いスーツを着て行けばいいですよ。", romaji: "Kuroi suutsu o kite ikeba ii desu yo.", id: "Sebaiknya kamu mengenakan setelan jas hitam." }
        ]
      },
      {
        pattern: "Vたほうがいいです / Vないほうがいいです",
        meaning: "Lebih baik melakukan... / Lebih baik tidak melakukan...",
        explanation: "Memberikan rekomendasi atau saran yang kuat mengenai hal yang patut atau tidak patut dilakukan.",
        examples: [
          { ja: "香典袋には、新札は入れないほうがいいですよ。", romaji: "Koudenbukuro ni wa, shinsatsu wa irenai hou ga ii desu yo.", id: "Untuk amplop duka, lebih baik tidak memasukkan uang kertas yang baru dicetak." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Perbedaan Uang Amplop Duka (香典) dan Pernikahan (ご祝儀)",
        content: "Pada uang duka (香典), gunakan uang kertas yang sudah beredar (bukan uang cetak baru licin) untuk melambangkan bahwa duka cita terjadi secara tak terduga. Sebaliknya pada pernikahan (ご祝儀), wajib menggunakan uang kertas baru mulus."
      }
    ]
  },

  11: {
    chapter: 11,
    titleJa: "第11課「ポイントカードを忘れてしまいました」",
    titleId: "Saya Tidak Sengaja Ketinggalan Kartu Poin",
    topic: "Belanja di Toko, Ukuran Pakaian & Kejadian Tak Terduga",
    pdfUrl: "/modul/bab11.pdf",
    canDoList: [
      "Can-do 44: Mampu menanyakan ketersediaan ukuran atau warna lain saat berbelanja pakaian dan sepatu.",
      "Can-do 45: Mampu meminta izin mencoba pakaian di kamar pas (fitting room) secara sopan.",
      "Can-do 46: Mampu menjelaskan kejadian tak terduga atau kekhilafan (lupa bawa kartu poin, tertinggal barang).",
      "Can-do 47: Mampu memahami syarat penukaran atau pengembalian barang (返品・交換)."
    ],
    keyVocabCategories: [
      {
        category: "Belanja & Ukuran",
        items: [
          { ja: "試着室 (しちゃくしつ)", id: "Kamar pas (fitting room)" },
          { ja: "サイズ", id: "Ukuran (S, M, L, LL)" },
          { ja: "返品 (へんぴん)", id: "Pengembalian barang / retur" },
          { ja: "交換 (こうかん)", id: "Penukaran barang" },
          { ja: "レシート", id: "Struk belanja" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "Vて＋みてもいいですか",
        meaning: "Bolehkah saya mencoba...?",
        explanation: "Digunakan saat meminta izin mencoba memakai pakaian atau mencicipi makanan sebelum memutuskan membeli.",
        examples: [
          { ja: "このシャツを着てみてもいいですか？", romaji: "Kono shatsu o kite mite mo ii desu ka?", id: "Bolehkah saya mencoba memakai kemeja ini?" }
        ]
      },
      {
        pattern: "Vて＋しまいました",
        meaning: "Terlanjur / tidak sengaja melakukan... (dengan rasa penyesalan)",
        explanation: "Menyatakan perbuatan yang terjadi di luar kendali atau kekhilafan yang disesali oleh pembicara.",
        examples: [
          { ja: "すみません、ポイントカードを家に忘れてしまいました。", romaji: "Sumimasen, pointo kaado o ie ni wasurete shimaimashita.", id: "Maaf, kartu poin saya tertinggal di rumah." },
          { ja: "買った服のサイズを間違えてしまいました。", romaji: "Katta fuku no saizu o machigaete shimaimashita.", id: "Saya keliru memilih ukuran baju yang sudah saya beli." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Etiket Mencoba Pakaian di Jepang",
        content: "Saat mencoba pakaian di kamar pas Jepang, pengunjung diminta melepas alas kaki dan bagi wanita disarankan memakai penutup wajah (フェイスカバー) agar riasan tidak mengotori baju baru."
      }
    ]
  },

  12: {
    chapter: 12,
    titleJa: "第12課「このボタンを押すと、エコモードに変わります」",
    titleId: "Kalau Tombol Ini Ditekan, Akan Berubah ke Mode Hemat",
    topic: "Pengoperasian Alat Elektronik, Tombol Fungsi & Rumah Tangga",
    pdfUrl: "/modul/bab12.pdf",
    canDoList: [
      "Can-do 48: Mampu membaca dan memahami label tombol pada alat elektronik rumah tangga (炊飯器、電子レンジ、洗濯機).",
      "Can-do 49: Mampu bertanya dan memahami cara pengoperasian mesin atau peralatan kantor (mesin fotokopi).",
      "Can-do 50: Mampu menjelaskan fungsi tombol atau akibat otomatis dari menekan tombol tertentu (～と、～).",
      "Can-do 51: Mampu memahami petunjuk penanganan masalah dasar atau mode hemat energi (エコモード)."
    ],
    keyVocabCategories: [
      {
        category: "Peralatan Rumah Tangga",
        items: [
          { ja: "炊飯器 (すいはんき)", id: "Penanak nasi (rice cooker)" },
          { ja: "電子レンジ (でんしレンジ)", id: "Oven microwave" },
          { ja: "洗濯機 (せんたくき)", id: "Mesin cuci" },
          { ja: "掃除機 (そうじき)", id: "Penyedot debu (vacuum cleaner)" }
        ]
      },
      {
        category: "Tombol Pengoperasian",
        items: [
          { ja: "電源 (でんげん)", id: "Tombol daya (Power ON/OFF)" },
          { ja: "スタート", id: "Mulai" },
          { ja: "取消 (とりけし)", id: "Batal / Reset" },
          { ja: "エコモード", id: "Mode hemat energi" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "V(Kamus)＋と、[Akibat Pasti/Otomatis]",
        meaning: "Jika / Kalau [Aksi Dilakukan], maka otomatis...",
        explanation: "Digunakan untuk menjelaskan cara kerja mesin di mana satu tindakan selalu menghasilkan reaksi tertentu secara alami atau otomatis.",
        examples: [
          { ja: "このボタンを押すと、エコモードに変わります。", romaji: "Kono botan o osu to, eko moodo ni kawarimasu.", id: "Kalau tombol ini ditekan, mesin otomatis beralih ke mode hemat energi." },
          { ja: "右に回すと、温度が上がります。", romaji: "Migi ni mawasu to, ondo ga agarimasu.", id: "Kalau diputar ke kanan, suhunya akan naik." }
        ]
      },
      {
        pattern: "V(Akar -masu)＋方 (～かた - kata)",
        meaning: "Cara melakukan...",
        explanation: "Menyatakan metode atau prosedur melakukan suatu aktivitas.",
        examples: [
          { ja: "すみません、この洗濯機の使い方を教えてください。", romaji: "Sumimasen, kono sentakuki no tsukaikata o oshiete kudasai.", id: "Permisi, tolong ajarkan cara menggunakan mesin cuci ini." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Peralatan Elektronik Multifungsi di Jepang",
        content: "Alat elektronik rumah tangga di Jepang memiliki banyak mode khusus (seperti mode hemat 'エコ', mode cuci cepat 'おいそぎ', atau mode nasi pulen '炊き分け'). Memahami tombol dasar sangat mempermudah kehidupan sehari-hari."
      }
    ]
  },
  13: {
    chapter: 13,
    titleJa: "第13課「いろいろな資料を展示してあります」",
    titleId: "Fasilitas Publik & Pelayanan Kota",
    topic: "公共施設と利用案内／利用ルールと設備",
    pdfUrl: "/modul/bab13.pdf",
    canDoList: [
      "Can-do 52: Mampu memahami penjelasan mengenai fasilitas umum (perpustakaan, museum seni, balai kota) dan apa saja yang dapat dilakukan di sana.",
      "Can-do 53: Mampu menanyakan informasi dan mengajukan permohonan penggunaan fasilitas atau kartu perpustakaan di loket pelayanan.",
      "Can-do 54: Mampu membaca pengumuman panduan operasional, jam buka, hari libur (休館日), dan tata tertib fasilitas umum."
    ],
    keyVocabCategories: [
      {
        category: "Fasilitas Umum & Ruangan",
        items: [
          { ja: "市役所 (しやくしょ)", id: "Balai kota / kantor pemerintah kota" },
          { ja: "図書館 (としょかん)", id: "Perpustakaan" },
          { ja: "美術館 (びじゅつかん)", id: "Museum seni" },
          { ja: "展示室 (てんじしつ)", id: "Ruang pameran / display" }
        ]
      },
      {
        category: "Operasional & Aturan",
        items: [
          { ja: "休館日 (きゅうかんび)", id: "Hari libur tutup fasilitas" },
          { ja: "入館料 (にゅうかんりょう)", id: "Biaya tiket masuk" },
          { ja: "貸出 (かしだし)", id: "Peminjaman buku/barang" },
          { ja: "禁煙 (きんえん)", id: "Dilarang merokok" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "V(て形)＋あります",
        meaning: "Sengaja disiapkan / dalam keadaan terpasang...",
        explanation: "Menyatakan kondisi atau hasil perbuatan yang sengaja disiapkan oleh seseorang untuk tujuan tertentu.",
        examples: [
          { ja: "壁に利用案内のポスターが貼ってあります。", romaji: "Kabe ni riyou annai no posutaa ga hatte arimasu.", id: "Di dinding telah tertempel poster petunjuk penggunaan." },
          { ja: "いろいろな資料を展示してあります。", romaji: "Iroirona shiryou o tenji shite arimasu.", id: "Berbagai materi dan arsip sengaja dipamerkan." }
        ]
      },
      {
        pattern: "V(て形)＋みてください",
        meaning: "Silakan coba lakukan...",
        explanation: "Digunakan untuk merekomendasikan seseorang mencoba mengunjungi atau menikmati suatu tempat/fasilitas.",
        examples: [
          { ja: "とても綺麗な庭園ですから、ぜひ一度行ってみてください。", romaji: "Totemo kirei na teien desu kara, zehi ichido itte mite kudasai.", id: "Karena tamannya sangat indah, silakan coba berkunjung sekali ke sana." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Pusat Layanan Warga (Kominkan / Shimin Center)",
        content: "Di setiap kota di Jepang terdapat Kominkan (balai warga) dan perpustakaan publik yang menyediakan ruang belajar gratis, kelas bahasa Jepang bagi warga asing, serta berbagai kegiatan komunitas ramah biaya."
      }
    ]
  },
  14: {
    chapter: 14,
    titleJa: "第14課「髪をもう少し短くしてください」",
    titleId: "Memanfaatkan Layanan Jasa",
    topic: "店舗サービスの利用／美容院・クリーニング・宅配便",
    pdfUrl: "/modul/bab14.pdf",
    canDoList: [
      "Can-do 55: Mampu menyampaikan keinginan potongan dan gaya rambut kepada kapster salon (美容院).",
      "Can-do 56: Mampu menitipkan pakaian di laundry (クリーニング) dan mengonfirmasi tanggal/jam siap diambil.",
      "Can-do 57: Mampu mengirimkan paket melalui kurir kilat (宅配便) dan mengisi formulir pengiriman."
    ],
    keyVocabCategories: [
      {
        category: "Salon & Perawatan",
        items: [
          { ja: "美容院 (びよういん)", id: "Salon kecantikan / pangkas rambut" },
          { ja: "前髪 (まえがみ)", id: "Poni rambut" },
          { ja: "短くする (みじかくする)", id: "Memendekkan" },
          { ja: "染める (そめる)", id: "Mewarnai / mengecat rambut" }
        ]
      },
      {
        category: "Laundry & Ekspedisi",
        items: [
          { ja: "クリーニング", id: "Laundry / dry cleaning" },
          { ja: "シミ", id: "Noda pada pakaian" },
          { ja: "仕上がり (しあがり)", id: "Waktu selesai / siap diambil" },
          { ja: "宅配便 (たくはいびん)", id: "Kurir pengiriman paket kilat" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "～を ［Kata Sifat-I: ～く］／［Kata Sifat-Na: ～に］ します",
        meaning: "Membuat / mengubah kondisi menjadi...",
        explanation: "Digunakan saat meminta orang lain mengubah suatu keadaan sesuai kehendak kita.",
        examples: [
          { ja: "髪をもう少し短くしてください。", romaji: "Kami o mou sukoshi mijikaku shite kudasai.", id: "Tolong potong rambut saya sedikit lebih pendek." },
          { ja: "部屋をきれいにしました。", romaji: "Heya o kirei ni shimashita.", id: "Saya telah membersihkan kamar." }
        ]
      },
      {
        pattern: "V(て形)＋もらえますか／いただけますか",
        meaning: "Bisakah Anda tolong lakukan...",
        explanation: "Ungkapan permohonan sopan kepada staf layanan pelanggan.",
        examples: [
          { ja: "このシミを落としてもらえますか。", romaji: "Kono shimi o otoshite moraemasu ka.", id: "Bisakah tolong hilangkan noda ini?" }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Pelayanan Prima (Omotenashi) Salon & Kurir Jepang",
        content: "Salon di Jepang sangat detail dalam memastikan kenyamanan pelanggan (mulai dari suhu air keramas hingga pertanyaan titik yang gatal). Kurir kilat (Takkyubin) juga memiliki sistem penentuan slot jam pengantaran yang sangat tepat waktu."
      }
    ]
  },
  15: {
    chapter: 15,
    titleJa: "第15課「ゴミを減らすために、マイバッグを持っています」",
    titleId: "Lingkungan & Gaya Hidup Eco",
    topic: "環境保護とごみの分別ルール／エコな暮らしの習慣",
    pdfUrl: "/modul/bab15.pdf",
    canDoList: [
      "Can-do 58: Mampu memahami jadwal dan aturan ketat pemilahan sampah di lingkungan tempat tinggal Jepang.",
      "Can-do 59: Mampu menceritakan kebiasaan ramah lingkungan sehari-hari (mengurangi plastik, hemat listrik/air).",
      "Can-do 60: Mampu memahami pengumuman pasar loak (freemarket), daur ulang, atau penanganan barang bekas."
    ],
    keyVocabCategories: [
      {
        category: "Kategori Sampah Jepang",
        items: [
          { ja: "燃えるゴミ (もえるごみ)", id: "Sampah yang bisa dibakar (organik/kertas)" },
          { ja: "燃えないゴミ (もえないごみ)", id: "Sampah tidak bisa dibakar (logam/gelas)" },
          { ja: "資源ゴミ (しげんごみ)", id: "Sampah daur ulang (botol PET, kaleng)" },
          { ja: "粗大ゴミ (そだいごみ)", id: "Sampah besar (kasur, perabot, sepeda)" }
        ]
      },
      {
        category: "Aksi Ramah Lingkungan",
        items: [
          { ja: "分別 (ぶんべつ)", id: "Pemilahan sampah" },
          { ja: "マイバッグ", id: "Tas belanja kain ramah lingkungan" },
          { ja: "リサイクル", id: "Daur ulang" },
          { ja: "節電 (せつでん)", id: "Penghematan daya listrik" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "V(Kamus)＋ために、～",
        meaning: "Demi / Untuk tujuan [Aksi Sadar]...",
        explanation: "Menyatakan tujuan utama dari tindakan yang dilakukan dengan sengaja.",
        examples: [
          { ja: "ゴミを減らすために、マイバッグを持っています。", romaji: "Gomi o herasu tame ni, mai baggu o motte imasu.", id: "Demi mengurangi sampah, saya selalu membawa tas belanja sendiri." }
        ]
      },
      {
        pattern: "V(ない形)＋ようにしています",
        meaning: "Berusaha membiasakan diri untuk tidak...",
        explanation: "Menyatakan kebiasaan atau upaya sadar yang rutin dipraktikkan.",
        examples: [
          { ja: "電気をつけっぱなしにしないようにしています。", romaji: "Denki o tsukeppanashi ni shinai you ni shite imasu.", id: "Saya berusaha agar tidak membiarkan lampu menyala terus-menerus." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Konsep Mottainai & Pemilahan Sampah Jepang",
        content: "Masyarakat Jepang memegang teguh filosofi 'Mottainai' (menghargai sumber daya dan menghindari kemubaziran). Pemilahan sampah adalah kewajiban sosial yang sangat penting bagi warga asing yang tinggal di perumahan Jepang."
      }
    ]
  },
  16: {
    chapter: 16,
    titleJa: "第16課「地震が起きたら、どうすればいいですか？」",
    titleId: "Mitigasi Bencana & Keselamatan",
    topic: "自然災害への備えと緊急行動／防災訓練と避難",
    pdfUrl: "/modul/bab16.pdf",
    canDoList: [
      "Can-do 61: Mampu memahami alarm gempa dini (緊急地震速報) dan siaran radio darurat pemerintah.",
      "Can-do 62: Mampu merespons dan menanyakan instruksi penyelamatan diri saat gempa bumi, topan, atau kebakaran.",
      "Can-do 63: Mampu membaca peta jalur evakuasi (Hazard Map) dan menemukan lokasi posko pengungsian terdekat."
    ],
    keyVocabCategories: [
      {
        category: "Bencana Alam & Peringatan",
        items: [
          { ja: "地震 (じしん)", id: "Gempa bumi" },
          { ja: "震度 (しんど)", id: "Skala getaran gempa (Shindo)" },
          { ja: "津波 (つなみ)", id: "Gelombang tsunami" },
          { ja: "台風 (たいふう)", id: "Angin badai topan" }
        ]
      },
      {
        category: "Evakuasi & Logistik Darurat",
        items: [
          { ja: "避難所 (ひなんじょ)", id: "Tempat evakuasi darurat (sekolah, gedung serbaguna)" },
          { ja: "非常口 (ひじょうぐち)", id: "Pintu keluar darurat" },
          { ja: "懐中電灯 (かいちゅうでんとう)", id: "Lampu senter baterai" },
          { ja: "停電 (ていでん)", id: "Mati aliran listrik" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "V(たら)／N(なら)、～てください",
        meaning: "Jika / Kalau [Kondisi Darurat Terjadi], lakukanlah...",
        explanation: "Digunakan untuk memberikan instruksi keselamatan segera saat kondisi tertentu terjadi.",
        examples: [
          { ja: "地震が起きたら、机の下に入って頭を守ってください。", romaji: "Jishin ga okitara, tsukue no shita ni haitte atama o mamotte kudasai.", id: "Kalau gempa terjadi, masuklah ke bawah meja dan lindungi kepala Anda." }
        ]
      },
      {
        pattern: "V(て形)＋はいけません",
        meaning: "Dilarang keras melakukan...",
        explanation: "Larangan tegas menyangkut bahaya keselamatan jiwa.",
        examples: [
          { ja: "火事のときはエレベーターを使ってはいけません。", romaji: "Kaji no toki wa erebeetaa o tsukatte wa ikemasen.", id: "Saat kebakaran dilarang keras menggunakan lift." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Bousai (Kesiapsiagaan Bencana) di Jepang",
        content: "Setiap gedung dan asrama di Jepang rutin menggelar pelatihan mitigasi bencana (防災訓練 - Bousai Kunren). Pastikan selalu mengetahui letak tangga darurat dan menyimpan tas siaga bencana (非常持ち出し袋) di dekat pintu keluar."
      }
    ]
  },
  17: {
    chapter: 17,
    titleJa: "第17課「日本語が前より話せるようになりました」",
    titleId: "Pertumbuhan & Perubahan Diri",
    topic: "日本生活での自己成長／過去と現在の比較",
    pdfUrl: "/modul/bab17.pdf",
    canDoList: [
      "Can-do 64: Mampu menceritakan perubahan kemampuan bahasa Jepang dan adaptasi kehidupan dibanding awal tiba.",
      "Can-do 65: Mampu menyimak dan memahami cerita rekan mengenai perjuangan serta perkembangan dirinya.",
      "Can-do 66: Mampu membaca esai refleksi atau pesan perpisahan rekan kerja yang menyelesaikan program magang."
    ],
    keyVocabCategories: [
      {
        category: "Perkembangan & Kemampuan",
        items: [
          { ja: "成長 (せいちょう)", id: "Pertumbuhan / perkembangan" },
          { ja: "上達する (じょうたつする)", id: "Meningkat kemampuannya" },
          { ja: "慣れる (なれる)", id: "Menjadi terbiasa / adaptasi" },
          { ja: "自信 (じしん)", id: "Rasa percaya diri" }
        ]
      },
      {
        category: "Refleksi Pengalaman",
        items: [
          { ja: "苦労 (くろう)", id: "Jerih payah / perjuangan" },
          { ja: "思い出 (おもいで)", id: "Kenangan berkesan" },
          { ja: "親切 (しんせつ)", id: "Kebaikan hati" },
          { ja: "振り返る (ふりかえる)", id: "Merenungkan masa lalu" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "V(Kamus/Bentuk Bisa)＋ようになりました",
        meaning: "Sudah menjadi bisa / terbiasa melakukan...",
        explanation: "Menyatakan perubahan kemampuan atau kebiasaan dari yang sebelumnya tidak bisa menjadi bisa.",
        examples: [
          { ja: "日本語が前より話せるようになりました。", romaji: "Nihongo ga mae yori hanaseru you ni narimashita.", id: "Saya sudah menjadi lebih bisa berbicara bahasa Jepang dibanding dulu." },
          { ja: "納豆が食べられるようになりました。", romaji: "Nattou ga taberareru you ni narimashita.", id: "Saya sekarang sudah bisa makan natto." }
        ]
      },
      {
        pattern: "V(て形)＋よかったです",
        meaning: "Syukurlah / Beruntung sekali bahwa...",
        explanation: "Menyatakan rasa syukur dan kepuasan atas pengalaman yang telah dijalani.",
        examples: [
          { ja: "日本に来て本当によかったです。", romaji: "Nihon ni kite hontou ni yokatta desu.", id: "Saya sangat bersyukur telah datang ke Jepang." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Perkembangan Kemandirian Peserta di Jepang",
        content: "Tinggal mandiri di Jepang tidak hanya meningkatkan kemahiran berbahasa, tetapi juga membentuk etos kerja profesional (5S, Hou-Ren-So), kedisiplinan waktu, serta kematangan mental peserta pelatihan."
      }
    ]
  },
  18: {
    chapter: 18,
    titleJa: "第18課「将来、自分の会社を作ろうと思っています」",
    titleId: "Impian & Rencana Masa Depan",
    topic: "これからの目標と人生設計／修了と次へのステップ",
    pdfUrl: "/modul/bab18.pdf",
    canDoList: [
      "Can-do 67: Mampu menyampaikan rencana karir masa depan, mimpi wirausaha, atau ujian Tokutei Ginou beserta alasannya.",
      "Can-do 68: Mampu mendengarkan rencana impian rekan, saling menyemangati, dan bertukar harapan.",
      "Can-do 69: Mampu membaca artikel dan pesan kelulusan mengenai alumni yang sukses berkarir di Jepang atau tanah air."
    ],
    keyVocabCategories: [
      {
        category: "Masa Depan & Karir",
        items: [
          { ja: "将来 (しょうらい)", id: "Masa depan" },
          { ja: "夢 (ゆめ)", id: "Cita-cita / impian" },
          { ja: "特定技能 (とくていぎのう)", id: "Specified Skilled Worker (SSW)" },
          { ja: "起業する (きぎょうする)", id: "Membuka usaha / bisnis mandiri" }
        ]
      },
      {
        category: "Target & Kelulusan",
        items: [
          { ja: "合格する (ごうかくする)", id: "Lulus ujian" },
          { ja: "目標 (もくひょう)", id: "Sasaran / target capaian" },
          { ja: "応援する (おうえんする)", id: "Mendukung / memberi semangat" },
          { ja: "修了 (しゅうりょう)", id: "Penyelesaian / tamat program" }
        ]
      }
    ],
    grammarPoints: [
      {
        pattern: "V(意向形 - Ikoukei)＋と思っています",
        meaning: "Berniat / Berencana untuk [Sudah Dipikirkan Sejak Lama]...",
        explanation: "Menyatakan niat masa depan yang sudah dipikirkan dan direncanakan oleh pembicara.",
        examples: [
          { ja: "将来、自分の会社を作ろうと思っています。", romaji: "Shourai, jibun no kaisha o tsukurou to omotte imasu.", id: "Di masa depan, saya berniat mendirikan perusahaan sendiri." },
          { ja: "国へ帰ったら、日本語を教えようと思っています。", romaji: "Kuni e kaettara, nihongo o oshieyou to omotte imasu.", id: "Kalau pulang ke tanah air, saya berniat mengajar bahasa Jepang." }
        ]
      },
      {
        pattern: "V(Kamus)＋つもりです",
        meaning: "Berencana / Bermaksud pasti untuk...",
        explanation: "Menyatakan kepastian rencana atau keputusan tegas yang hendak diambil.",
        examples: [
          { ja: "特定技能試験に合格して、あと5年間日本で働くつもりです。", romaji: "Tokutei ginou shiken ni goukaku shite, ato gonenkan Nihon de hataraku tsumori desu.", id: "Saya berencana lulus ujian Tokutei Ginou dan bekerja di Jepang 5 tahun lagi." }
        ]
      }
    ],
    cultureNotes: [
      {
        title: "Kelulusan Level A2 & Peluang Karir Masa Depan",
        content: "Menyelesaikan Irodori 初級2 (Bab 1–18) menandai kesiapan penuh peserta untuk menghadapi ujian JFT-Basic A2 atau JLPT N4, membuka jalan menuju status visa Pekerja Berketerampilan Spesifik (Tokutei Ginou / SSW) di Jepang."
      }
    ]
  }
};

