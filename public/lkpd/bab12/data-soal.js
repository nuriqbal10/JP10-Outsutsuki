/*
  data-soal.js - LKPD Bab 12: このボタンを押すと、エコモードに変わります
  Kurikulum Irodori Nihongo de Seikatsu 初級2 (A2.2)
  Standar CEFR A2 / JFT-Basic / LPK Terstandar
*/

window.LKPD_DATA = {
  settings: {
    babId: "bab12",
    babTitle: "第12課 このボタンを押すと、エコモードに変わります",
    subTitle: "Pengoperasian Alat Elektronik, Tombol Fungsi & Rumah Tangga",
    canDo: "Can-do 48, 49, 50, 51",
    sessionKey: "lkpd_bab12_session_v4",
    stateKey: "lkpd_bab12_state_v4",
    teacherPasswordHash: "9396f41310103ff22b5203e0b698a8517fe84f42a031cccdc0508dda25198187",
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
        <h2>Panduan Penggunaan LKPD Bab 12</h2>
        <div class="meta-box">
          <p><strong>Mata Pelajaran:</strong> Bahasa Jepang (Irodori 初級2 - Bab 12)</p>
          <p><strong>Topik:</strong> このボタンを押すと、エコモードに変わります (Pengoperasian Alat Elektronik & Tombol Fungsi)</p>
          <p><strong>Target Kelulusan:</strong> Nilai Akhir &ge; 85.0 (Tuntas KKM) | Mini JFT-like &ge; 85.0 | Indikasi Skala JFT-Basic &ge; 200/250</p>
        </div>
        <h3>Kompetensi Can-Do Irodori Bab 12:</h3>
        <ul>
          <li><strong>Can-do 48:</strong> Mampu memahami penjelasan cara menggunakan peralatan listrik rumah tangga (mesin cuci, rice cooker, microwave, AC, vacuum cleaner).</li>
          <li><strong>Can-do 49:</strong> Mampu menanyakan dan menjelaskan fungsi tombol kontrol menggunakan pola syarat alami (V［辞書形］＋と、～).</li>
          <li><strong>Can-do 50:</strong> Mampu menanyakan keunggulan produk elektronik di toko dan memilih mode hemat energi (エコモード).</li>
          <li><strong>Can-do 51:</strong> Mampu membaca instruksi manual singkat dan label peringatan keselamatan pada alat elektronik Jepang.</li>
        </ul>
      `
    },

    /* ================= 2. RINGKASAN MATERI ================= */
    {
      id: "materi",
      label: "Materi",
      type: "static",
      html: `
        <h2>Ringkasan Materi & Tata Bahasa Bab 12</h2>
        <div class="vocab-grid">
          <div class="vocab-card">
            <h4>Pola Tata Bahasa Utama</h4>
            <ul>
              <li><strong>Pola 1: V［辞書形］＋と、～（確定条件・自然な結果・機械操作）</strong><br>
              Menyatakan jika melakukan aksi tertentu (misalnya menekan tombol), maka secara otomatis terjadi hasil tertentu. Contoh: このボタンを押すと、エコモードに変わります (Jika menekan tombol ini, akan berganti ke mode hemat daya) / 水が出ます。</li>
              <li><strong>Pola 2: ～方（使い方・操作方法）</strong><br>
              Cara melakukan sesuatu. Contoh: 電子レンジの使い方を教えてください (Tolong ajari saya cara memakai microwave ini) / 洗濯機の動かし方。</li>
              <li><strong>Pola 3: ～ようにしてください（注意喚起）</strong><br>
              Imbauan keselamatan operasional. Contoh: 濡れた手でプラグを触らないようにしてください (Usahakan jangan menyentuh colokan listrik dengan tangan basah).</li>
            </ul>
          </div>
          <div class="vocab-card">
            <h4>Nama Alat Elektronik & Tombol Fungsi</h4>
            <ul>
              <li><strong>炊飯器 (すいはんき):</strong> Rice cooker / penanak nasi (炊飯、保温、早炊き)</li>
              <li><strong>電子レンジ (でんしれんじ):</strong> Microwave oven (温め、解凍)</li>
              <li><strong>洗濯機 (せんたくき):</strong> Mesin cuci (標準、脱水、すすぎ)</li>
              <li><strong>掃除機 (そうじき):</strong> Vacuum cleaner / penyedot debu (強、弱、エコモード)</li>
              <li><strong>冷蔵庫 (れいぞうこ):</strong> Kulkas / lemari es (冷蔵、冷凍)</li>
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
          prompt: "ご飯を炊くときに使う家電製品は（　　）です。",
          options: ["炊飯器", "洗濯機", "掃除機", "アイロン"],
          answer: 1
        },
        {
          id: "q2",
          type: "mcq",
          number: "Soal 2.",
          prompt: "冷たいお弁当を（　　）で温めました。",
          options: ["電子レンジ", "冷蔵庫", "扇風機", "ストーブ"],
          answer: 1
        },
        {
          id: "q3",
          type: "mcq",
          number: "Soal 3.",
          prompt: "この（　　）を押すと、水が止まります。",
          options: ["ボタン", "ドア", "窓", "机"],
          answer: 1
        },
        {
          id: "q4",
          type: "mcq",
          number: "Soal 4.",
          prompt: "「押す」の読み方はどれですか。",
          options: ["おす", "ひく", "まわす", "とめる"],
          answer: 1
        },
        {
          id: "q5",
          type: "mcq",
          number: "Soal 5.",
          prompt: "「回す」の読み方はどれですか。",
          options: ["まわす", "おす", "うごかす", "あける"],
          answer: 1
        },
        {
          id: "q6",
          type: "mcq",
          number: "Soal 6.",
          prompt: "「エコモード」の意味として最も適切なものはどれですか。",
          options: ["電気やエネルギーの消費を抑えて節電するモード", "一番強い力で動かすモード", "音を大きくするモード", "音楽を流す機能"],
          answer: 1
        },
        {
          id: "q7",
          type: "mcq",
          number: "Soal 7.",
          prompt: "「解凍」の意味はどれですか。",
          options: ["凍った食品を溶かして元の状態に戻すこと", "お湯を沸かすこと", "服を乾かすこと", "部屋を冷やすこと"],
          answer: 1
        },
        {
          id: "q8",
          type: "mcq",
          number: "Soal 8.",
          prompt: "部屋のほこりを吸い取るために（　　）をかけました。",
          options: ["掃除機", "ドライヤー", "ポット", "扇風機"],
          answer: 1
        },
        {
          id: "q9",
          type: "mcq",
          number: "Soal 9.",
          prompt: "「電源」の読み方はどれですか。",
          options: ["でんげん", "でんき", "でんち", "でんわ"],
          answer: 1
        },
        {
          id: "q10",
          type: "mcq",
          number: "Soal 10.",
          prompt: "エアコンのリモコンで「冷房」から「暖房」に（　　）ました。",
          options: ["切り替え", "押し", "回し", "消し"],
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
          prompt: "A：「この炊飯器の使い方を教えてくれませんか。」<br>B：「お米と水を入れたら、このスタートボタンを（　　）いいですよ。」",
          options: ["押せば", "押したら", "押すと", "押して"],
          answer: 1
        },
        {
          id: "q12",
          type: "mcq",
          number: "Soal 12.",
          prompt: "A：「このつまみを右に（　　）、温度が上がりますよ。」<br>B：「わかりました、やってみます。」",
          options: ["回すと", "押すと", "引くと", "切ると"],
          answer: 1
        },
        {
          id: "q13",
          type: "mcq",
          number: "Soal 13.",
          prompt: "A：「冷凍のお肉を温めたいときは、どのボタンですか。」<br>B：「この『（　　）』ボタンを押してください。」",
          options: ["解凍", "保温", "早炊き", "脱水"],
          answer: 1
        },
        {
          id: "q14",
          type: "mcq",
          number: "Soal 14.",
          prompt: "A：「この掃除機、とても静かですね。」<br>B：「ええ、エコモードに（　　）、音も静かで電気代も安くなりますよ。」",
          options: ["すると", "したら", "すれば", "しても"],
          answer: 1
        },
        {
          id: "q15",
          type: "mcq",
          number: "Soal 15.",
          prompt: "A：「洗濯機が途中で止まってしまいました。どうしてですか。」<br>B：「フタがちゃんと（　　）ないと、動かないようになっていますよ。」",
          options: ["閉まって", "開いて", "壊れて", "汚れて"],
          answer: 1
        },
        {
          id: "q16",
          type: "mcq",
          number: "Soal 16.",
          prompt: "店員：「こちらの商品は最新型で、省エネ性能がとても（　　）ですよ。」<br>客：「そうですか、これにします。」",
          options: ["高い", "安い", "低い", "重い"],
          answer: 1
        },
        {
          id: "q17",
          type: "mcq",
          number: "Soal 17.",
          prompt: "A：「アイロンを使った後はどうすればいいですか。」<br>B：「必ずプラグをコンセントから（　　）おいてくださいね。」",
          options: ["抜いて", "差して", "切って", "押して"],
          answer: 1
        },
        {
          id: "q18",
          type: "mcq",
          number: "Soal 18.",
          prompt: "A：「タイマーをセットしたいんですが。」<br>B：「この時計のマークを押してから、時間を（　　）ください。」",
          options: ["選んで", "消して", "壊して", "捨てて"],
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
          prompt: "洗濯機を動かすにはどのボタンを押せばいいですか。",
          options: ["緑のスタートボタン", "赤の電源ボタン", "黄色のコースボタン", "青のストップボタン"],
          answer: 1,
          audioUrl: "audio/Z_[12-03]_kiku1.mp3",
          script: "洗濯機の動かし方教えて。まず洗剤を入れてフタを閉めるでしょ。そしたらこの緑のスタートボタンを押すだけで自動で始まるよ。"
        },
        {
          id: "q20",
          type: "listening",
          number: "Soal 20.",
          prompt: "お弁当を温める時間は何分に設定しますか。",
          options: ["1分30秒", "3分", "5分", "30秒"],
          answer: 1,
          audioUrl: "audio/Z_[12-04]_kiku2.mp3",
          script: "このお弁当、レンジで何分温めればいいかな？ 500ワットなら1分30秒って書いてあるよ。あたためボタンを押して時間を合わせよう。"
        },
        {
          id: "q21",
          type: "listening",
          number: "Soal 21.",
          prompt: "このボタンを押すと何が変わりますか。",
          options: ["エコモードに変わる", "電源が切れる", "水が出る", "警報が鳴る"],
          answer: 1,
          audioUrl: "audio/Z_[12-05]_kiku3.mp3",
          script: "この葉っぱのマークのボタンは何？ それを押すとエコモードに変わって、電気を節約しながら運転してくれるんだよ。"
        },
        {
          id: "q22",
          type: "listening",
          number: "Soal 22.",
          prompt: "ご飯を急いで炊きたいときはどのモードにしますか。",
          options: ["早炊き（はやだき）", "普通炊き", "玄米モード", "おかゆモード"],
          answer: 1,
          audioUrl: "audio/Z_[12-06]_kiku4.mp3",
          script: "もうすぐ夕飯だから急いでご飯炊きたいんだけど。じゃあメニューボタンで『早炊き』を選んでスタートを押すと、20分で炊けるよ。"
        },
        {
          id: "q23",
          type: "listening",
          number: "Soal 23.",
          prompt: "店員がおすすめしている掃除機の特徴は何ですか。",
          options: ["軽くてコードレスでバッテリーが長持ちする", "とても重いがゴミがたくさん入る", "価格が一番高い", "水洗いできない"],
          answer: 1,
          audioUrl: "audio/Z_[12-10]_kaiwa.mp3",
          script: "こちらの掃除機はコードレスで本体が1.2キロと非常に軽く、バッテリーも最長40分持ちますので一番人気がございます。"
        },
        {
          id: "q24",
          type: "listening",
          number: "Soal 24.",
          prompt: "使用上の注意として言われたことは何ですか。",
          options: ["濡れた手で触らないこと", "毎日水洗いすること", "高いところから落とすこと", "ずっと電源を入れっぱなしにすること"],
          answer: 1,
          audioUrl: "audio/Z_[12-13]_hanasu.mp3",
          script: "感電の危険がありますので、濡れた手でプラグを抜き差ししないようにしてください。"
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
          passage: "【電子レンジ取扱説明書：使用上のご注意】<br>●アルミホイルや金属製の食器は絶対に入れないでください。火花が出て火災の原因になります。<br>●生卵を殻のまま加熱しないでください。破裂する危険があります。<br>●使用後は庫内の汚れを固く絞った布で拭き取ってください。",
          prompt: "電子レンジに入れてはいけないものはどれですか。",
          options: ["金属製の食器やアルミホイル", "耐熱ガラスの皿", "陶器のマグカップ", "電子レンジ専用の容器"],
          answer: 1
        },
        {
          id: "q26",
          type: "mcq",
          number: "Soal 26.",
          prompt: "生卵をそのまま温めるとどうなる危険がありますか。",
          options: ["破裂する危険がある", "冷たくなる", "色が変わる", "何も起きない"],
          answer: 1
        },
        {
          id: "q27",
          type: "mcq",
          number: "Soal 27.",
          passage: "【全自動洗濯機：エラー表示一覧】<br>【E01】給水エラー：水道の蛇口が開いているか確認してください。<br>【E02】排水エラー：排水ホースが折れ曲がっていないか確認してください。<br>【E03】ドアロックエラー：上ブタがしっかり閉まっているか確認してください。",
          prompt: "エラー表示「E02」が出たときは何をチェックすればいいですか。",
          options: [
            "排水ホースが折れ曲がっていないか",
            "水道の蛇口が開いているか",
            "上ブタが閉まっているか",
            "洗剤が入っているか"
          ],
          answer: 1
        },
        {
          id: "q28",
          type: "mcq",
          number: "Soal 28.",
          prompt: "上ブタが開いたままのときに表示されるエラーはどれですか。",
          options: ["E03", "E01", "E02", "E99"],
          answer: 1
        },
        {
          id: "q29",
          type: "mcq",
          number: "Soal 29.",
          passage: "【エアコンの節電ポイント】<br>夏の冷房設定温度は「28℃」を目安にしましょう。設定温度を1℃上げるだけで約10％の節電になります。また、扇風機やサーキュレーターを併用して風を循環させると、体感温度が涼しく感じられます。2週間に1回はフィルターを清掃してください。",
          prompt: "夏の冷房で推奨されている目安温度は何℃ですか。",
          options: ["28℃", "20℃", "18℃", "32℃"],
          answer: 1
        },
        {
          id: "q30",
          type: "mcq",
          number: "Soal 30.",
          prompt: "エアコンのフィルターはどのくらいの頻度で掃除することが推奨されていますか。",
          options: ["2週間に1回", "毎食後", "1年に1回", "掃除は不要"],
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
        { id: "k1", type: "mcq", number: "Kanji 1.", prompt: "「押す」の読み方はどれですか。", options: ["おす", "ひく", "とめる", "だす"], answer: 1 },
        { id: "k2", type: "mcq", number: "Kanji 2.", prompt: "「回す」の読み方はどれですか。", options: ["まわす", "うごかす", "おす", "まがる"], answer: 1 },
        { id: "k3", type: "mcq", number: "Kanji 3.", prompt: "「電気」の読み方はどれですか。", options: ["でんき", "でんしゃ", "でんわ", "てんき"], answer: 1 },
        { id: "k4", type: "mcq", number: "Kanji 4.", prompt: "「掃除」の読み方はどれですか。", options: ["そうじ", "せんたく", "りょうり", "さんぽ"], answer: 1 },
        { id: "k5", type: "mcq", number: "Kanji 5.", prompt: "「使う」の読み方はどれですか。", options: ["つかう", "つくる", "つづける", "つたえる"], answer: 1 },
        { id: "k6", type: "mcq", number: "Kanji 6.", prompt: "「開ける」の読み方はどれですか。", options: ["あける", "しめる", "つける", "けす"], answer: 1 },
        { id: "k7", type: "mcq", number: "Kanji 7.", prompt: "「閉める」の読み方はどれですか。", options: ["しめる", "あける", "とめる", "きめる"], answer: 1 },
        { id: "k8", type: "mcq", number: "Kanji 8.", prompt: "「温める」の読み方はどれですか。", options: ["あたためる", "つめたくする", "ひやす", "わかす"], answer: 1 },
        { id: "k9", type: "mcq", number: "Kanji 9.", prompt: "「止まる」の読み方はどれですか。", options: ["とまる", "うごく", "はしる", "あがる"], answer: 1 },
        { id: "k10", type: "mcq", number: "Kanji 10.", prompt: "「強」の読み方はどれですか。", options: ["つよい／きょう", "よわい", "たかい", "おもい"], answer: 1 }
      ]
    },

    /* ================= 8. KOSAKATA ================= */
    {
      id: "kosakata",
      label: "6. 語彙",
      type: "questions",
      items: [
        { id: "v1", type: "vocab", number: "Goi 1.", prompt: "Rice cooker / Penanak nasi : （　　　　）", answer: "炊飯器" },
        { id: "v2", type: "vocab", number: "Goi 2.", prompt: "Microwave oven : （　　　　）", answer: "電子レンジ" },
        { id: "v3", type: "vocab", number: "Goi 3.", prompt: "Mesin cuci : （　　　　）", answer: "洗濯機" },
        { id: "v4", type: "vocab", number: "Goi 4.", prompt: "Vacuum cleaner : （　　　　）", answer: "掃除機" },
        { id: "v5", type: "vocab", number: "Goi 5.", prompt: "Tombol kontrol : （　　　　）", answer: "ボタン" },
        { id: "v6", type: "vocab", number: "Goi 6.", prompt: "Menekan : （　　　　）", answer: "押す" },
        { id: "v7", type: "vocab", number: "Goi 7.", prompt: "Memutar : （　　　　）", answer: "回す" },
        { id: "v8", type: "vocab", number: "Goi 8.", prompt: "Mode hemat daya / hemat energi : （　　　　）", answer: "エコモード" },
        { id: "v9", type: "vocab", number: "Goi 9.", prompt: "Peralatan elektronik rumah tangga : （　　　　）", answer: "電気製品" },
        { id: "v10", type: "vocab", number: "Goi 10.", prompt: "Mencairkan makanan beku : （　　　　）", answer: "解凍" }
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
          prompt: "Jika Anda menekan tombol ini, mode akan berganti ke eco mode (hemat daya).",
          sample: "このボタンを押すと、エコモードに変わります。"
        },
        {
          id: "t2",
          type: "translation",
          number: "Terjemahan 2.",
          prompt: "Bisa tolong ajari saya cara memakai mesin cuci ini?",
          sample: "この洗濯機の使い方を教えてくれませんか？"
        },
        {
          id: "t3",
          type: "translation",
          number: "Terjemahan 3.",
          prompt: "Jika memutar kenop ini ke kanan, suhu panasnya akan naik.",
          sample: "このつまみを右に回すと、温度が上がります。"
        },
        {
          id: "t4",
          type: "translation",
          number: "Terjemahan 4.",
          prompt: "Usahakan jangan menyentuh colokan listrik dengan tangan yang basah.",
          sample: "濡れた手でプラグを触らないようにしてください。"
        },
        {
          id: "t5",
          type: "translation",
          number: "Terjemahan 5.",
          prompt: "Jika memilih mode masak cepat (hayadaki), nasi akan matang dalam 20 menit.",
          sample: "「早炊き」を選ぶと、20分でご飯が炊けます。"
        }
      ]
    },

    /* ================= 10. AUDIO BANK ================= */
    {
      id: "audiobank",
      label: "Bank Audio",
      type: "audiobank",
      items: [
        { track: "12-01", title: "Kotoba: Alat Elektronik Rumah Tangga 1", audioUrl: "audio/Z_[12-01]_kotoba1.mp3" },
        { track: "12-02", title: "Kotoba: Tombol & Operasional Mesin 2", audioUrl: "audio/Z_[12-02]_kotoba2.mp3" },
        { track: "12-03", title: "Kiku 1: Pengoperasian Mesin Cuci", audioUrl: "audio/Z_[12-03]_kiku1.mp3" },
        { track: "12-04", title: "Kiku 2: Menyetel Waktu Microwave", audioUrl: "audio/Z_[12-04]_kiku2.mp3" },
        { track: "12-05", title: "Kiku 3: Tombol Eco Mode", audioUrl: "audio/Z_[12-05]_kiku3.mp3" },
        { track: "12-06", title: "Kiku 4: Mode Cepat Rice Cooker", audioUrl: "audio/Z_[12-06]_kiku4.mp3" },
        { track: "12-07", title: "Katachi: Pola Kondisional Operasional V［辞書形］＋と", audioUrl: "audio/Z_[12-07]_katachi.mp3" },
        { track: "12-10", title: "Kaiwa: Penjelasan Fitur di Toko Elektronik", audioUrl: "audio/Z_[12-10]_kaiwa.mp3" },
        { track: "12-13", title: "Hanasu: Peringatan Keselamatan Listrik", audioUrl: "audio/Z_[12-13]_hanasu.mp3" }
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
        <h2>Refleksi Belajar Peserta Didik (Bab 12)</h2>
        <div class="note-box">
          Isilah lembar refleksi ini secara mandiri mengenai penggunaan peralatan rumah tangga di Jepang.
        </div>
        <div class="question-card">
          <p class="prompt">1. Saya dapat memahami penjelasan cara mengoperasikan alat elektronik rumah tangga:</p>
          <div class="options">
            <label><input type="radio" name="ref1" value="3"> Sangat Mampu</label>
            <label><input type="radio" name="ref1" value="2"> Cukup Mampu</label>
            <label><input type="radio" name="ref1" value="1"> Belum Mampu</label>
          </div>
        </div>
        <div class="question-card">
          <p class="prompt">2. Saya dapat menjelaskan fungsi tombol atau akibat alami dengan pola V［辞書形］＋と、～:</p>
          <div class="options">
            <label><input type="radio" name="ref2" value="3"> Sangat Mampu</label>
            <label><input type="radio" name="ref2" value="2"> Cukup Mampu</label>
            <label><input type="radio" name="ref2" value="1"> Belum Mampu</label>
          </div>
        </div>
        <div class="question-card">
          <p class="prompt">3. Catatan Refleksi Mandiri & Pertanyaan ke Sensei:</p>
          <textarea rows="3" style="width:100%; border-radius:10px; border:1px solid #ccc; padding:8px;" placeholder="Tuliskan pengalaman atau kendala yang dihadapi..."></textarea>
        </div>
      `
    }
  ]
};
