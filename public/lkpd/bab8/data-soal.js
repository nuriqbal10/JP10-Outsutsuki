/*
  data-soal.js - LKPD Bab 8: 屋台はどこかわかりますか？
  Kurikulum Irodori Nihongo de Seikatsu 初級2 (A2.2)
  Standar CEFR A2 / JFT-Basic / LPK Terstandar
*/

window.LKPD_DATA = {
  settings: {
    babId: "bab8",
    babTitle: "第8課 屋台はどこかわかりますか？",
    subTitle: "Festival Budaya, Lokasi Stand & Denah Acara",
    canDo: "Can-do 32, 33, 34, 35",
    sessionKey: "lkpd_bab8_session_v4",
    stateKey: "lkpd_bab8_state_v4",
    teacherPasswordHash: "afa4624d9eaee45ee04fdd75dc4449419e08db5278e0e45474724a59c1e731e3",
    listeningPlayCount: 2,
    showListeningControls: false
  },

  tabs: [
    /* ================= 1. PANDUAN ================= */
    {
      id: "panduan",
      label: "Panduan",
      type: "static",
      html: `
        <h2>Panduan Penggunaan LKPD Bab 8</h2>
        <div class="meta-box">
          <p><strong>Mata Pelajaran:</strong> Bahasa Jepang (Irodori 初級2 - Bab 8)</p>
          <p><strong>Topik:</strong> 屋台はどこかわかりますか？ (Festival Budaya, Lokasi Stan & Denah Acara)</p>
          <p><strong>Target Kelulusan:</strong> Nilai Akhir &ge; 75.0 | Mini JFT-like &ge; 70.0 | Indikasi Skala JFT-Basic &ge; 200/250</p>
        </div>
        <h3>Kompetensi Can-Do Irodori Bab 8:</h3>
        <ul>
          <li><strong>Can-do 32:</strong> Mampu menanyakan dan menjelaskan denah stan atau fasilitas di festival komunitas/budaya (～はどこですか／～はどこかわかりますか).</li>
          <li><strong>Can-do 33:</strong> Mampu memahami letak fasilitas berdasarkan denah festival menggunakan kata arah (右手、左手、突き当たり、奥).</li>
          <li><strong>Can-do 34:</strong> Mampu menanyakan dan memahami aturan partisipasi acara/kegiatan seperti larangan berfoto atau makan di tempat tertentu.</li>
          <li><strong>Can-do 35:</strong> Mampu membaca pamflet panduan denah dan jadwal pertunjukan festival internasional.</li>
        </ul>
        <div class="note-box">
          <strong>Perhatian:</strong> Kerjakan seluruh butir soal secara mandiri. Bagian Terjemahan akan diperiksa dan dinilai langsung oleh Sensei.
        </div>
      `
    },

    /* ================= 2. RINGKASAN MATERI ================= */
    {
      id: "materi",
      label: "Materi",
      type: "static",
      html: `
        <h2>Ringkasan Materi & Tata Bahasa Bab 8</h2>
        <div class="vocab-grid">
          <div class="vocab-card">
            <h4>Pola Tata Bahasa Utama</h4>
            <ul>
              <li><strong>Pola 1: [Kalimat Tanya / Kata Tanya]＋か、わかりますか</strong><br>
              Menanyakan informasi tidak langsung secara sopan. Contoh: 屋台はどこかわかりますか？ (Apakah Anda tahu di mana stan makanan?) / 何時に始まるか知っていますか？</li>
              <li><strong>Pola 2: [Kata Penunjuk Arah & Posisi]</strong><br>
              突き当たり (ujung jalan/mentok), 右手／左手 (sebelah kanan/kiri), 奥 (bagian paling dalam), 手前 (sebelah sini/depan).</li>
              <li><strong>Pola 3: ～はご遠慮ください／～禁止</strong><br>
              Ungkapan sopan untuk larangan atau imbauan tidak melakukan sesuatu. Contoh: 撮影はご遠慮ください (Mohon untuk tidak mengambil foto/video).</li>
            </ul>
          </div>
          <div class="vocab-card">
            <h4>Kosakata Kunci Festival & Denah</h4>
            <ul>
              <li><strong>屋台 (やたい):</strong> Stan makanan / kedai kaki lima</li>
              <li><strong>ステージ (すてーじ):</strong> Panggung pertunjukan</li>
              <li><strong>スピーチコンテスト:</strong> Lomba pidato bahasa Jepang</li>
              <li><strong>案内所／受付 (あんないじょ／うけつけ):</strong> Pusat informasi / meja resepsionis</li>
              <li><strong>禁止 (きんし) / 遠慮 (えんりょ):</strong> Larangan / menahan diri untuk tidak melakukan</li>
            </ul>
          </div>
        </div>
      `
    },

    /* ================= 3. MOJI-GOI ================= */
    {
      id: "moji",
      label: "1. 文字・語彙",
      type: "questions",
      items: [
        {
          id: "q1",
          type: "mcq",
          number: "Soal 1.",
          prompt: "お祭りで焼きそばやたこ焼きを売っている（　　）がたくさん並んでいます。",
          options: ["屋台", "事務室", "更衣室", "倉庫"],
          answer: 1
        },
        {
          id: "q2",
          type: "mcq",
          number: "Soal 2.",
          prompt: "廊下の（　　）を右に曲がると、トイレがあります。",
          options: ["手前", "突き当たり", "真ん中", "裏"],
          answer: 2
        },
        {
          id: "q3",
          type: "mcq",
          number: "Soal 3.",
          prompt: "ステージの（　　）に案内所があります。すぐに見えますよ。",
          options: ["右手", "右足", "右耳", "右目"],
          answer: 1
        },
        {
          id: "q4",
          type: "mcq",
          number: "Soal 4.",
          prompt: "館内での写真の（　　）はご遠慮ください。",
          options: ["撮影", "案内", "見学", "修理"],
          answer: 1
        },
        {
          id: "q5",
          type: "mcq",
          number: "Soal 5.",
          prompt: "「奥」の読み方はどれですか。",
          options: ["おく", "まえ", "よこ", "した"],
          answer: 1
        },
        {
          id: "q6",
          type: "mcq",
          number: "Soal 6.",
          prompt: "「手前」の読み方はどれですか。",
          options: ["てまえ", "てぜん", "しゅぜん", "しゅまえ"],
          answer: 1
        },
        {
          id: "q7",
          type: "mcq",
          number: "Soal 7.",
          prompt: "「禁止」の意味として最も適切なものはどれですか。",
          options: ["してはいけないこと", "してもいいこと", "急いですること", "手伝うこと"],
          answer: 1
        },
        {
          id: "q8",
          type: "mcq",
          number: "Soal 8.",
          prompt: "「遠慮」の意味はどれですか。",
          options: ["控えること・しないでおくこと", "大声で話すこと", "早く食べること", "お金を払うこと"],
          answer: 1
        },
        {
          id: "q9",
          type: "mcq",
          number: "Soal 9.",
          prompt: "フェスティバルの（　　）でパンフレットをもらいました。",
          options: ["受付", "喫煙所", "更衣室", "駐車場"],
          answer: 1
        },
        {
          id: "q10",
          type: "mcq",
          number: "Soal 10.",
          prompt: "「入場無料」の意味はどれですか。",
          options: ["お金を払わずに入れる", "入るのにお金が必要", "関係者以外は入れない", "予約が必要"],
          answer: 1
        }
      ]
    },

    /* ================= 4. KAIWA HYOUGEN ================= */
    {
      id: "kaiwa",
      label: "2. 会話表現",
      type: "questions",
      items: [
        {
          id: "q11",
          type: "mcq",
          number: "Soal 11.",
          prompt: "A：「すみません、トイレはどこかわかりますか。」<br>B：「＿＿＿。」",
          options: [
            "あそこの突き当たりを左に曲がったところにありますよ。",
            "はい、トイレに行きたいです。",
            "昨日行きました。",
            "とてもきれいでした。"
          ],
          answer: 1
        },
        {
          id: "q12",
          type: "mcq",
          number: "Soal 12.",
          prompt: "A：「スピーチコンテストは何時から始まるか知っていますか。」<br>B：「＿＿＿。」",
          options: [
            "パンフレットによると、午後1時からだそうですよ。",
            "スピーチが好きです。",
            "会場は市民ホールです。",
            "上手でしたよ。"
          ],
          answer: 1
        },
        {
          id: "q13",
          type: "mcq",
          number: "Soal 13.",
          prompt: "A：「ここで写真を撮ってもいいですか。」<br>B：「すみません、フラッシュ撮影は（　　）。」",
          options: ["ご遠慮ください", "おねがいします", "結構ですよ", "大丈夫です"],
          answer: 1
        },
        {
          id: "q14",
          type: "mcq",
          number: "Soal 14.",
          prompt: "A：「インドネシアの屋台はどこですか。」<br>B：「ステージの（　　）に並んでいますよ。」",
          options: ["右手の方", "右足の方", "右目の方", "右耳の方"],
          answer: 1
        },
        {
          id: "q15",
          type: "mcq",
          number: "Soal 15.",
          prompt: "A：「体験コーナーに参加したいんですが、予約は必要ですか。」<br>B：「＿＿＿。」",
          options: [
            "いいえ、予約がなくても参加できますよ。",
            "はい、予約はできません。",
            "予約は終わりました。",
            "お金を払いました。"
          ],
          answer: 1
        },
        {
          id: "q16",
          type: "mcq",
          number: "Soal 16.",
          prompt: "A：「この建物の中でたばこを吸ってもいいですか。」<br>B：「館内はすべて（　　）ですので、外の喫煙所をご利用ください。」",
          options: ["禁煙", "喫煙", "飲食", "撮影"],
          answer: 1
        },
        {
          id: "q17",
          type: "mcq",
          number: "Soal 17.",
          prompt: "A：「会場へはどうやって行けばいいですか。」<br>B：「駅から無料のシャトルバスが（　　）よ。」",
          options: ["出ています", "歩いています", "止まっています", "買っています"],
          answer: 1
        },
        {
          id: "q18",
          type: "mcq",
          number: "Soal 18.",
          prompt: "A：「迷子センターはどこですか。」<br>B：「あそこの本部テントの（　　）です。」",
          options: ["となり", "まんなか", "うえ", "なか"],
          answer: 1
        }
      ]
    },

    /* ================= 5. CHOUKAI ================= */
    {
      id: "choikai",
      label: "3. 聴解",
      type: "questions",
      items: [
        {
          id: "q19",
          type: "listening",
          number: "Soal 19.",
          prompt: "屋台の場所はどこですか。",
          options: ["ステージの右手", "ステージの左手奥", "メインゲートのすぐ前", "本部テントの裏"],
          answer: 2,
          audioUrl: "audio/Z_[08-03]_kiku1.mp3",
          script: "すみません、屋台はどこかわかりますか？ 屋台はですね、あの大きなステージの左手奥の広場に並んでいますよ。"
        },
        {
          id: "q20",
          type: "listening",
          number: "Soal 20.",
          prompt: "案内所はどこにありますか。",
          options: ["入口を入ってすぐ右手", "突き当たりを左", "ステージの真裏", "駐車場の横"],
          answer: 1,
          audioUrl: "audio/Z_[08-04]_kiku2.mp3",
          script: "案内所はどこですか？ メインの入口を入ってすぐ右手にあります。パンフレットもそこで配っています。"
        },
        {
          id: "q21",
          type: "listening",
          number: "Soal 21.",
          prompt: "スピーチコンテストは何時から始まりますか。",
          options: ["午前10時", "午前11時30分", "午後1時", "午後2時30分"],
          answer: 3,
          audioUrl: "audio/Z_[08-05]_kiku3.mp3",
          script: "スピーチコンテストは何時からか知っていますか？ ええと、プログラムを見ると、午後1時からメインホールで始まります。"
        },
        {
          id: "q22",
          type: "listening",
          number: "Soal 22.",
          prompt: "会場内で禁止されていることは何ですか。",
          options: ["フラッシュ撮影", "ペットボトルの持ち込み", "拍手", "マスクの着用"],
          answer: 1,
          audioUrl: "audio/Z_[08-06]_kiku4.mp3",
          script: "お客様にお願い申し上げます。ステージでの発表中、フラッシュ撮影はご遠慮ください。"
        },
        {
          id: "q23",
          type: "listening",
          number: "Soal 23.",
          prompt: "男の人はこれからどこへ行きますか。",
          options: ["民族衣装の体験コーナー", "屋台の焼きそば屋", "喫煙所", "駅のバス停"],
          answer: 1,
          audioUrl: "audio/Z_[08-20]_kiku1.mp3",
          script: "あっちで民族衣装を着る体験ができるみたいだよ。本当？面白そう！行ってみよう。"
        },
        {
          id: "q24",
          type: "listening",
          number: "Soal 24.",
          prompt: "迷子のお子さんはどこで保護されていますか。",
          options: ["本部テント", "救護室", "警備室", "正面玄関"],
          answer: 1,
          audioUrl: "audio/Z_[08-21]_kiku2.mp3",
          script: "迷子のお知らせです。青いTシャツを着た男の子を本部テントでお預かりしております。"
        }
      ]
    },

    /* ================= 6. DOKKAI ================= */
    {
      id: "dokkai",
      label: "4. 読解",
      type: "questions",
      items: [
        {
          id: "q25",
          type: "mcq",
          number: "Soal 25.",
          passage: "【国際交流フェスティバル案内】<br>日時：10月15日（日）10:00～16:00<br>場所：市民公園（入場無料）<br>※飲食エリアはステージ左手です。ごみは必ず分別してごみ箱へ捨ててください。<br>※ペットを連れての入場はご遠慮ください。",
          prompt: "ペットを連れてフェスティバルに入ることができますか。",
          options: ["入ることはできない", "小型犬なら入ってもいい", "午後からなら入れる", "チケットを買えば入れる"],
          answer: 1
        },
        {
          id: "q26",
          type: "mcq",
          number: "Soal 26.",
          prompt: "飲食エリアは会場のどこにありますか。",
          options: ["ステージの左手", "市民公園の外", "メインステージの上", "ごみ箱の隣"],
          answer: 1
        },
        {
          id: "q27",
          type: "mcq",
          number: "Soal 27.",
          passage: "【ワークショップ：折り紙体験】<br>時間：第1回 11:00～ / 第2回 14:00～（各回30分）<br>定員：各回先着15名（予約不要）<br>参加費：無料<br>場所：テントC（中央広場突き当たり）",
          prompt: "折り紙体験に参加したい人はどうすればいいですか。",
          options: [
            "予約は不要で、先着15名に入れば参加できる",
            "前日までに電話で予約しなければならない",
            "参加費として500円払う必要がある",
            "朝10時にテントCに行かなければならない"
          ],
          answer: 1
        },
        {
          id: "q28",
          type: "mcq",
          number: "Soal 28.",
          prompt: "折り紙体験が行われる場所はどこですか。",
          options: ["中央広場の突き当たりにあるテントC", "メインホールのステージ", "市民公園の入口", "飲食エリアの奥"],
          answer: 1
        },
        {
          id: "q29",
          type: "mcq",
          number: "Soal 29.",
          passage: "【注意事項】<br>館内は全館禁煙です。喫煙は屋外の指定喫煙所をご利用ください。また、展示物の破損を防ぐため、作品には手を触れないようお願いいたします。",
          prompt: "館内でのルールについて正しいものはどれですか。",
          options: [
            "展示物には触れてはいけない",
            "館内のどこでもたばこが吸える",
            "展示物は自由に持って帰ってよい",
            "屋外の喫煙所もすべて禁煙である"
          ],
          answer: 1
        },
        {
          id: "q30",
          type: "mcq",
          number: "Soal 30.",
          prompt: "たばこを吸いたいときはどこへ行けばいいですか。",
          options: ["屋外の指定喫煙所", "館内のトイレ", "展示室の奥", "中央広場の手前"],
          answer: 1
        }
      ]
    },

    /* ================= 7. KANJI ================= */
    {
      id: "kanji",
      label: "5. 漢字",
      type: "questions",
      items: [
        { id: "k1", type: "mcq", number: "Kanji 1.", prompt: "「上」の読み方はどれですか。", options: ["うえ", "した", "なか", "よこ"], answer: 1 },
        { id: "k2", type: "mcq", number: "Kanji 2.", prompt: "「下」の読み方はどれですか。", options: ["した", "うえ", "そと", "まえ"], answer: 1 },
        { id: "k3", type: "mcq", number: "Kanji 3.", prompt: "「中」の読み方はどれですか。", options: ["なか", "あいだ", "うしろ", "となり"], answer: 1 },
        { id: "k4", type: "mcq", number: "Kanji 4.", prompt: "「右」の読み方はどれですか。", options: ["みぎ", "ひだり", "きた", "みなみ"], answer: 1 },
        { id: "k5", type: "mcq", number: "Kanji 5.", prompt: "「左」の読み方はどれですか。", options: ["ひだり", "みぎ", "ひがし", "にし"], answer: 1 },
        { id: "k6", type: "mcq", number: "Kanji 6.", prompt: "「入口」の読み方はどれですか。", options: ["いりぐち", "でぐち", "かいこう", "にゅうもん"], answer: 1 },
        { id: "k7", type: "mcq", number: "Kanji 7.", prompt: "「出口」の読み方はどれですか。", options: ["でぐち", "いりぐち", "もん", "ひきだし"], answer: 1 },
        { id: "k8", type: "mcq", number: "Kanji 8.", prompt: "「禁止」の読み方はどれですか。", options: ["きんし", "ちゅうし", "ていし", "はいし"], answer: 1 },
        { id: "k9", type: "mcq", number: "Kanji 9.", prompt: "「受付」の読み方はどれですか。", options: ["うけつけ", "あんない", "かいけい", "といあわせ"], answer: 1 },
        { id: "k10", type: "mcq", number: "Kanji 10.", prompt: "「写真」の読み方はどれですか。", options: ["しゃしん", "えいが", "きょうしつ", "としょかん"], answer: 1 }
      ]
    },

    /* ================= 8. KOSAKATA ================= */
    {
      id: "kosakata",
      label: "6. 語彙",
      type: "questions",
      items: [
        { id: "v1", type: "vocab", number: "Goi 1.", prompt: "Warung / Kedai Kaki Lima : （　　　　）", answer: "屋台" },
        { id: "v2", type: "vocab", number: "Goi 2.", prompt: "Panggung pertunjukan : （　　　　）", answer: "ステージ" },
        { id: "v3", type: "vocab", number: "Goi 3.", prompt: "Ujung jalan / Mentok : （　　　　）", answer: "突き当たり" },
        { id: "v4", type: "vocab", number: "Goi 4.", prompt: "Sebelah kanan : （　　　　）", answer: "右手" },
        { id: "v5", type: "vocab", number: "Goi 5.", prompt: "Sebelah kiri : （　　　　）", answer: "左手" },
        { id: "v6", type: "vocab", number: "Goi 6.", prompt: "Bagian paling dalam : （　　　　）", answer: "奥" },
        { id: "v7", type: "vocab", number: "Goi 7.", prompt: "Sebelah sini / Bagian depan : （　　　　）", answer: "手前" },
        { id: "v8", type: "vocab", number: "Goi 8.", prompt: "Dilarang / Larangan : （　　　　）", answer: "禁止" },
        { id: "v9", type: "vocab", number: "Goi 9.", prompt: "Pusat informasi : （　　　　）", answer: "案内所" },
        { id: "v10", type: "vocab", number: "Goi 10.", prompt: "Pengambilan foto / Pemotretan : （　　　　）", answer: "撮影" }
      ]
    },

    /* ================= 9. TERJEMAHAN ================= */
    {
      id: "terjemahan",
      label: "7. 翻訳",
      type: "questions",
      items: [
        {
          id: "t1",
          type: "translation",
          number: "Terjemahan 1.",
          prompt: "Apakah Anda tahu di mana stan makanan (kedai) berada?",
          sample: "屋台はどこかわかりますか？ (atau: 屋台がどこにあるか知っていますか？)"
        },
        {
          id: "t2",
          type: "translation",
          number: "Terjemahan 2.",
          prompt: "Kalau belok kiri di ujung jalan itu, ada toilet.",
          sample: "あそこの突き当たりを左に曲がると、トイレがあります。"
        },
        {
          id: "t3",
          type: "translation",
          number: "Terjemahan 3.",
          prompt: "Mohon untuk tidak mengambil foto atau video di dalam ruangan ini.",
          sample: "館内での写真や動画の撮影はご遠慮ください。"
        },
        {
          id: "t4",
          type: "translation",
          number: "Terjemahan 4.",
          prompt: "Stan makanan Indonesia berjejer di sebelah kanan panggung.",
          sample: "インドネシアの屋台はステージの右手に並んでいます。"
        },
        {
          id: "t5",
          type: "translation",
          number: "Terjemahan 5.",
          prompt: "Apakah Anda tahu jam berapa lomba pidato dimulai?",
          sample: "スピーチコンテストは何時に始まるか知っていますか？"
        }
      ]
    },

    /* ================= 10. AUDIO BANK ================= */
    {
      id: "audiobank",
      label: "Bank Audio",
      type: "audiobank",
      items: [
        { track: "08-01", title: "Kotoba: Kosakata Denah & Arah 1", audioUrl: "audio/Z_[08-01]_kotoba1.mp3" },
        { track: "08-02", title: "Kotoba: Kosakata Fasilitas Festival 2", audioUrl: "audio/Z_[08-02]_kotoba2.mp3" },
        { track: "08-03", title: "Kiku 1: Lokasi Stand Makanan", audioUrl: "audio/Z_[08-03]_kiku1.mp3" },
        { track: "08-04", title: "Kiku 2: Lokasi Meja Informasi", audioUrl: "audio/Z_[08-04]_kiku2.mp3" },
        { track: "08-05", title: "Kiku 3: Jadwal Lomba Pidato", audioUrl: "audio/Z_[08-05]_kiku3.mp3" },
        { track: "08-06", title: "Kiku 4: Pengumuman Larangan Foto", audioUrl: "audio/Z_[08-06]_kiku4.mp3" },
        { track: "08-07", title: "Katachi 1: Pola Tanya Tak Langsung ～かわかりますか", audioUrl: "audio/Z_[08-07]_katachi1.mp3" },
        { track: "08-08", title: "Katachi 2: Pola Larangan Sopan ～ご遠慮ください", audioUrl: "audio/Z_[08-08]_katachi2.mp3" },
        { track: "08-14", title: "Kaiwa: Menanyakan Lokasi di Festival", audioUrl: "audio/Z_[08-14]_kaiwa.mp3" },
        { track: "08-20", title: "Kiku Tambahan 1: Pengalaman Budaya", audioUrl: "audio/Z_[08-20]_kiku1.mp3" },
        { track: "08-21", title: "Kiku Tambahan 2: Pengumuman Anak Hilang", audioUrl: "audio/Z_[08-21]_kiku2.mp3" }
      ]
    },

    /* ================= 11. HASIL ================= */
    {
      id: "hasil",
      label: "Hasil & Feedback",
      type: "result"
    },

    /* ================= 12. REFLEKSI ================= */
    {
      id: "refleksi",
      label: "Refleksi",
      type: "static",
      html: `
        <h2>Refleksi Belajar Peserta Didik (Bab 8)</h2>
        <div class="note-box">
          Isilah lembar refleksi ini secara jujur untuk mengukur pemahaman materi denah acara dan aturan festival di Jepang.
        </div>
        <div class="question-card">
          <p class="prompt">1. Saya dapat menanyakan denah lokasi atau stan di festival (屋台はどこかわかりますか):</p>
          <div class="options">
            <label><input type="radio" name="ref1" value="3"> Sangat Mampu (Sangat Paham)</label>
            <label><input type="radio" name="ref1" value="2"> Cukup Mampu (Perlu sedikit bantuan)</label>
            <label><input type="radio" name="ref1" value="1"> Belum Mampu (Perlu bimbingan intensif)</label>
          </div>
        </div>
        <div class="question-card">
          <p class="prompt">2. Saya memahami petunjuk arah seperti 突き当たり, 右手, 左手, dan 奥:</p>
          <div class="options">
            <label><input type="radio" name="ref2" value="3"> Sangat Mampu</label>
            <label><input type="radio" name="ref2" value="2"> Cukup Mampu</label>
            <label><input type="radio" name="ref2" value="1"> Belum Mampu</label>
          </div>
        </div>
        <div class="question-card">
          <p class="prompt">3. Catatan Refleksi Mandiri & Pertanyaan ke Sensei:</p>
          <textarea rows="3" style="width:100%; border-radius:10px; border:1px solid #ccc; padding:8px;" placeholder="Tulis hal yang paling berkesan atau bagian yang masih membingungkan..."></textarea>
        </div>
      `
    }
  ]
};
