/*
  data-soal.js - LKPD Bab 9: 成人の日は、何をするんですか？
  Kurikulum Irodori Nihongo de Seikatsu 初級2 (A2.2)
  Standar CEFR A2 / JFT-Basic / LPK Terstandar
*/

window.LKPD_DATA = {
  settings: {
    babId: "bab9",
    babTitle: "第9課 成人の日は、何をするんですか？",
    subTitle: "Hari Libur Nasional, Perayaan Tradisional & Budaya Jepang",
    canDo: "Can-do 36, 37, 38, 39",
    sessionKey: "lkpd_bab9_session_v4",
    stateKey: "lkpd_bab9_state_v4",
    teacherPasswordHash: "9eab78c22ff53b059700b0262c5fb5c121312417a779a4c118b25d77ba7ee00b",
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
        <h2>Panduan Penggunaan LKPD Bab 9</h2>
        <div class="meta-box">
          <p><strong>Mata Pelajaran:</strong> Bahasa Jepang (Irodori 初級2 - Bab 9)</p>
          <p><strong>Topik:</strong> 成人の日は、何をするんですか？ (Hari Libur Nasional, Perayaan Tradisional & Budaya)</p>
          <p><strong>Target Kelulusan:</strong> Nilai Akhir &ge; 85.0 (Tuntas KKM) | Mini JFT-like &ge; 85.0 | Indikasi Skala JFT-Basic &ge; 200/250</p>
        </div>
        <h3>Kompetensi Can-Do Irodori Bab 9:</h3>
        <ul>
          <li><strong>Can-do 36:</strong> Mampu menanyakan dan menjelaskan arti atau kegiatan pada hari libur nasional Jepang (成人の日, お正月, 七五三, こどもの日).</li>
          <li><strong>Can-do 37:</strong> Mampu menjelaskan hari raya atau perayaan penting di negara asal (seperti Idul Fitri, Hari Kemerdekaan, dsb.) dengan ungkapan sederhana.</li>
          <li><strong>Can-do 38:</strong> Mampu mendengarkan dan memahami penjelasan singkat tentang tradisi tahun baru atau festival budaya Jepang.</li>
          <li><strong>Can-do 39:</strong> Mampu membaca informasi jadwal kalender libur dan pengumuman kegiatan peringatan hari besar.</li>
        </ul>
      `
    },

    /* ================= 2. RINGKASAN MATERI ================= */
    {
      id: "materi",
      label: "Materi",
      type: "static",
      html: `
        <h2>Ringkasan Materi & Tata Bahasa Bab 9</h2>
        <div class="vocab-grid">
          <div class="vocab-card">
            <h4>Pola Tata Bahasa Utama</h4>
            <ul>
              <li><strong>Pola 1: [Bentuk Biasa / Kata Benda]＋んです（か）</strong><br>
              Digunakan untuk menanyakan penjelasan, alasan, atau latar belakang suatu tradisi secara ramah. Contoh: 成人の日は何をするんですか？ (Pada Hari Kedewasaan, apa yang biasanya dilakukan?)</li>
              <li><strong>Pola 2: [Kegiatan A]＋たり、[Kegiatan B]＋たりします</strong><br>
              Menyebutkan contoh beberapa kegiatan dari banyak kegiatan. Contoh: 家族でお祈りに行ったり、ごちそうを食べたりします。</li>
              <li><strong>Pola 3: ～をお祝いします／～を祈ります</strong><br>
              Merayakan / mendoakan. Contoh: 子どもの成長をお祝いします (Merayakan pertumbuhan anak-anak).</li>
            </ul>
          </div>
          <div class="vocab-card">
            <h4>Hari Libur Tradisional Jepang</h4>
            <ul>
              <li><strong>お正月 (おしょうがつ):</strong> Tahun Baru (1 Januari), makan osechi,初詣.</li>
              <li><strong>成人の日 (せいじんのひ):</strong> Hari Kedewasaan (Senin ke-2 Januari, usia 20 tahun memakai kimono).</li>
              <li><strong>ひな祭り (ひなまつり):</strong> Festival Boneka Anak Perempuan (3 Maret).</li>
              <li><strong>こどもの日 (こどものひ):</strong> Hari Anak (5 Mei, memasang koinobori).</li>
              <li><strong>七五三 (しちごさん):</strong> Perayaan anak usia 7, 5, 3 tahun mendoakan kesehatan di kuil.</li>
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
          prompt: "20歳になった若者の成長を祝う日本の祝日は（　　）です。",
          options: ["成人の日", "こどもの日", "海の日", "山の日"],
          answer: 1
        },
        {
          id: "q2",
          type: "mcq",
          number: "Soal 2.",
          prompt: "お正月には、家族みんなで（　　）を食べたり、初詣に行ったりします。",
          options: ["おせち料理", "カレーライス", "ケーキ", "バーベキュー"],
          answer: 1
        },
        {
          id: "q3",
          type: "mcq",
          number: "Soal 3.",
          prompt: "お正月に子どもたちはお年玉を（　　）。",
          options: ["もらいます", "あげます", "捨てます", "洗います"],
          answer: 1
        },
        {
          id: "q4",
          type: "mcq",
          number: "Soal 4.",
          prompt: "「祝う」の読み方はどれですか。",
          options: ["いわう", "ねがう", "いのる", "うたう"],
          answer: 1
        },
        {
          id: "q5",
          type: "mcq",
          number: "Soal 5.",
          prompt: "「初詣」の読み方はどれですか。",
          options: ["はつもうで", "しょもうで", "はつまいり", "しょまいり"],
          answer: 1
        },
        {
          id: "q6",
          type: "mcq",
          number: "Soal 6.",
          prompt: "「特別」の意味として最も適切なものはどれですか。",
          options: ["普通とは違っていること", "いつもと同じこと", "値段が安いこと", "早く終わること"],
          answer: 1
        },
        {
          id: "q7",
          type: "mcq",
          number: "Soal 7.",
          prompt: "「祈る」の意味はどれですか。",
          options: ["神様などに願いを届けること", "おいしいご飯を作ること", "速く走ること", "服を買いに行くこと"],
          answer: 1
        },
        {
          id: "q8",
          type: "mcq",
          number: "Soal 8.",
          prompt: "日本では3月3日に女の子のための（　　）があります。",
          options: ["ひな祭り", "花火大会", "七夕", "節分"],
          answer: 1
        },
        {
          id: "q9",
          type: "mcq",
          number: "Soal 9.",
          prompt: "5月5日のこどもの日には、空に魚の形の（　　）を飾ります。",
          options: ["こいのぼり", "ちょうちん", "かみなり", "うちわ"],
          answer: 1
        },
        {
          id: "q10",
          type: "mcq",
          number: "Soal 10.",
          prompt: "「伝統」の読み方はどれですか。",
          options: ["でんとう", "でんき", "でんわ", "でんせつ"],
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
          prompt: "A：「きれいな着物を着ている人が多いですね。今日は何の日ですか。」<br>B：「＿＿＿。」",
          options: [
            "成人の日なんですよ。大人の仲間入りをお祝いする日です。",
            "はい、着物を買いました。",
            "昨日雨が降りました。",
            "何もしません。"
          ],
          answer: 1
        },
        {
          id: "q12",
          type: "mcq",
          number: "Soal 12.",
          prompt: "A：「インドネシアの断食明けのお祭りでは何をするんですか。」<br>B：「＿＿＿。」",
          options: [
            "家族みんなでお祈りをしたり、特別なお菓子を食べたりしますよ。",
            "断食は好きではありません。",
            "お腹がいっぱいです。",
            "日本に来たばかりです。"
          ],
          answer: 1
        },
        {
          id: "q13",
          type: "mcq",
          number: "Soal 13.",
          prompt: "A：「お正月休みは国へ帰るんですか。」<br>B：「いいえ、チケットが高い（　　）、日本で過ごします。」",
          options: ["ので", "のに", "からに", "たら"],
          answer: 1
        },
        {
          id: "q14",
          type: "mcq",
          number: "Soal 14.",
          prompt: "A：「七五三ってどんなお祭りなんですか。」<br>B：「子どもの健康と無事な成長を（　　）行事ですよ。」",
          options: ["祈る", "やめる", "忘れる", "捨てる"],
          answer: 1
        },
        {
          id: "q15",
          type: "mcq",
          number: "Soal 15.",
          prompt: "A：「お正月は何をして過ごしましたか。」<br>B：「近くの神社へお参りに（　　）、家でゆっくり休んだりしました。」",
          options: ["行ったり", "行って", "行くと", "行けば"],
          answer: 1
        },
        {
          id: "q16",
          type: "mcq",
          number: "Soal 16.",
          prompt: "A：「あけましておめでとうございます！」<br>B：「＿＿＿。」",
          options: [
            "おめでとうございます！今年もよろしくお願いします。",
            "どういたしまして。",
            "ごちそうさまでした。",
            "お大事にしてください。"
          ],
          answer: 1
        },
        {
          id: "q17",
          type: "mcq",
          number: "Soal 17.",
          prompt: "A：「クリスマスにはどんなものを食べるんですか。」<br>B：「日本ではチキンやケーキを食べる人が（　　）ですよ。」",
          options: ["多い", "少ない", "短い", "安い"],
          answer: 1
        },
        {
          id: "q18",
          type: "mcq",
          number: "Soal 18.",
          prompt: "A：「その人形はいつ片付けるんですか。」<br>B：「ひな祭りが（　　）すぐに片付けますよ。」",
          options: ["終わったら", "終わる前に", "終わらなくて", "終わらないで"],
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
          prompt: "今日は何の日について話していますか。",
          options: ["成人の日", "お正月", "子どもの日", "七五三"],
          answer: 1,
          audioUrl: "audio/Z_[09-03]_kiku1.mp3",
          script: "町できれいな振袖を着た女の人をたくさん見かけました。成人の日ですね。大人の仲間入りをお祝いする日です。"
        },
        {
          id: "q20",
          type: "listening",
          number: "Soal 20.",
          prompt: "日本の正月で必ず行うことは何ですか。",
          options: ["初詣に行く", "海で泳ぐ", "花火を打ち上げる", "山に登る"],
          answer: 1,
          audioUrl: "audio/Z_[09-04]_kiku2.mp3",
          script: "お正月は1月1日に家族で神社へ初詣に行きます。新しい1年がいい年になるようにお祈りします。"
        },
        {
          id: "q21",
          type: "listening",
          number: "Soal 21.",
          prompt: "外国の友達の国では正月に何をしますか。",
          options: ["家族が集まって特別な料理を食べる", "1人で静かに寝る", "会社で仕事をする", "断食をする"],
          answer: 1,
          audioUrl: "audio/Z_[09-05]_kiku3.mp3",
          script: "私の国でも新年には親戚みんなが集まって、ごちそうを食べたり歌ったりして楽しくお祝いします。"
        },
        {
          id: "q22",
          type: "listening",
          number: "Soal 22.",
          prompt: "こどもの日には何を飾りますか。",
          options: ["こいのぼり", "ひな人形", "門松", "クリスマスツリー"],
          answer: 1,
          audioUrl: "audio/Z_[09-06]_kiku4.mp3",
          script: "5月5日はこどもの日です。子どもが元気に大きく育つように、庭やベランダにこいのぼりを飾ります。"
        },
        {
          id: "q23",
          type: "listening",
          number: "Soal 23.",
          prompt: "女の人はお正月休みに何をしましたか。",
          options: ["家でテレビを見たり料理を作ったりした", "海外旅行に行った", "ずっと会社で残業した", "病院に入院した"],
          answer: 1,
          audioUrl: "audio/Z_[09-15]_kiku1.mp3",
          script: "正月休みはどうでしたか？ どこも混んでいたので、家でテレビを見たり美味しいおせちを食べたりしてのんびり過ごしました。"
        },
        {
          id: "q24",
          type: "listening",
          number: "Soal 24.",
          prompt: "男の人は年末年始に何を予定していますか。",
          options: ["故郷の実家に帰省する", "東京でホテルに泊まる", "アルバイトをする", "引越しをする"],
          answer: 1,
          audioUrl: "audio/Z_[09-16]_kiku2.mp3",
          script: "年末年始は久しぶりに田舎の実家に帰る予定です。両親や地元の友達に会ってきます。"
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
          passage: "【成人の日のつどい ご案内】<br>日時：1月第2月曜日 10:30～12:00（受付 9:45～）<br>会場：市民文化会館大ホール<br>対象：平成18年4月2日～平成19年4月1日生まれの市民<br>※参加証（ハガキ）を必ずご持参ください。<br>※会場内での飲酒・危険物の持ち込みは固くお断りします。",
          prompt: "式典に参加するために必ず持っていくものは何ですか。",
          options: ["参加証（ハガキ）", "パスポート", "住民票", "卒業アルバム"],
          answer: 1
        },
        {
          id: "q26",
          type: "mcq",
          number: "Soal 26.",
          prompt: "式典会場内で禁止されている行為はどれですか。",
          options: ["飲酒や危険物の持ち込み", "着物を着ること", "家族と一緒に来ること", "写真を撮ること"],
          answer: 1
        },
        {
          id: "q27",
          type: "mcq",
          number: "Soal 27.",
          passage: "【年末年始の市役所窓口休業のお知らせ】<br>12月29日（金）から1月3日（水）まで、市役所の窓口業務はお休みとなります。出生届や死亡届などの緊急の届出は、地下警備室にて24時間受け付けます。",
          prompt: "市役所の通常窓口が休業する期間はいつですか。",
          options: ["12月29日から1月3日まで", "1月1日だけ", "12月25日から12月31日まで", "1年中休みなし"],
          answer: 1
        },
        {
          id: "q28",
          type: "mcq",
          number: "Soal 28.",
          prompt: "休業期間中に緊急の届出をしたい場合、どこへ行けばいいですか。",
          options: ["市役所の地下警備室", "市民病院", "警察署", "郵便局"],
          answer: 1
        },
        {
          id: "q29",
          type: "mcq",
          number: "Soal 29.",
          passage: "【日本の行事カレンダー：7月7日 七夕】<br>七夕（たなばた）の夜には、短冊（たんざく）という色とりどりの細長い紙に願い事を書いて、笹（ささ）の葉に飾りつけます。天の川の織姫と彦星が一年に一度だけ出会える日とされています。",
          prompt: "七夕の日に短冊に書くものは何ですか。",
          options: ["願い事", "反省の言葉", "買い物のメモ", "家族の名前だけ"],
          answer: 1
        },
        {
          id: "q30",
          type: "mcq",
          number: "Soal 30.",
          prompt: "短冊はどこに飾りますか。",
          options: ["笹の葉", "玄関のドア", "神棚の奥", "仏壇の中"],
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
        { id: "k1", type: "mcq", number: "Kanji 1.", prompt: "「朝」の読み方はどれですか。", options: ["あさ", "ひる", "よる", "ばん"], answer: 1 },
        { id: "k2", type: "mcq", number: "Kanji 2.", prompt: "「今」の読み方はどれですか。", options: ["いま", "まえ", "あと", "さき"], answer: 1 },
        { id: "k3", type: "mcq", number: "Kanji 3.", prompt: "「映画」の読み方はどれですか。", options: ["えいが", "まんが", "しゃしん", "えほん"], answer: 1 },
        { id: "k4", type: "mcq", number: "Kanji 4.", prompt: "「音楽」の読み方はどれですか。", options: ["おんがく", "えいが", "どくしょ", "りょこう"], answer: 1 },
        { id: "k5", type: "mcq", number: "Kanji 5.", prompt: "「行く」の読み方はどれですか。", options: ["いく", "くる", "かえる", "たつ"], answer: 1 },
        { id: "k6", type: "mcq", number: "Kanji 6.", prompt: "「聞く」の読み方はどれですか。", options: ["きく", "みる", "いう", "かく"], answer: 1 },
        { id: "k7", type: "mcq", number: "Kanji 7.", prompt: "「正月」の読み方はどれですか。", options: ["しょうがつ", "せいげつ", "しょうげつ", "ただつき"], answer: 1 },
        { id: "k8", type: "mcq", number: "Kanji 8.", prompt: "「祝う」の読み方はどれですか。", options: ["いわう", "いのる", "ねがう", "よろこぶ"], answer: 1 },
        { id: "k9", type: "mcq", number: "Kanji 9.", prompt: "「成人」の読み方はどれですか。", options: ["せいじん", "おとな", "せいにん", "じょうにん"], answer: 1 },
        { id: "k10", type: "mcq", number: "Kanji 10.", prompt: "「伝統」の読み方はどれですか。", options: ["でんとう", "でんき", "でんわ", "でんせつ"], answer: 1 }
      ]
    },

    /* ================= 8. KOSAKATA ================= */
    {
      id: "kosakata",
      label: "6. 語彙",
      type: "questions",
      items: [
        { id: "v1", type: "vocab", number: "Goi 1.", prompt: "Hari Tahun Baru : （　　　　）", answer: "お正月" },
        { id: "v2", type: "vocab", number: "Goi 2.", prompt: "Hari Kedewasaan : （　　　　）", answer: "成人の日" },
        { id: "v3", type: "vocab", number: "Goi 3.", prompt: "Merayakan : （　　　　）", answer: "祝う" },
        { id: "v4", type: "vocab", number: "Goi 4.", prompt: "Mendoakan : （　　　　）", answer: "祈る" },
        { id: "v5", type: "vocab", number: "Goi 5.", prompt: "Festival Boneka Anak Perempuan : （　　　　）", answer: "ひな祭り" },
        { id: "v6", type: "vocab", number: "Goi 6.", prompt: "Hari Libur Nasional : （　　　　）", answer: "祝日" },
        { id: "v7", type: "vocab", number: "Goi 7.", prompt: "Kunjungan pertama ke kuil di awal tahun : （　　　　）", answer: "初詣" },
        { id: "v8", type: "vocab", number: "Goi 8.", prompt: "Tradisi : （　　　　）", answer: "伝統" },
        { id: "v9", type: "vocab", number: "Goi 9.", prompt: "Uang hadiah tahun baru untuk anak-anak : （　　　　）", answer: "お年玉" },
        { id: "v10", type: "vocab", number: "Goi 10.", prompt: "Masakan khas tahun baru Jepang : （　　　　）", answer: "おせち料理" }
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
          prompt: "Pada Hari Kedewasaan, apa yang biasanya dilakukan orang Jepang?",
          sample: "成人の日には、日本の人は何をするんですか？"
        },
        {
          id: "t2",
          type: "translation",
          number: "Terjemahan 2.",
          prompt: "Saat hari raya, kami pergi berdoa bersama keluarga dan makan hidangan istimewa.",
          sample: "お祭りの日には、家族でお祈りに行ったり、特別なごちそうを食べたりします。"
        },
        {
          id: "t3",
          type: "translation",
          number: "Terjemahan 3.",
          prompt: "Di Jepang, ada perayaan untuk mendoakan pertumbuhan dan kesehatan anak-anak.",
          sample: "日本では、子どもの健康と無事な成長をお祝いする行事があります。"
        },
        {
          id: "t4",
          type: "translation",
          number: "Terjemahan 4.",
          prompt: "Karena tiket pesawat mahal, saya menghabiskan liburan tahun baru di Jepang.",
          sample: "飛行機のチケットが高いので、正月休みは日本で過ごします。"
        },
        {
          id: "t5",
          type: "translation",
          number: "Terjemahan 5.",
          prompt: "Selamat Tahun Baru! Mohon bantuannya juga di tahun ini.",
          sample: "あけましておめでとうございます！今年もよろしくお願いします。"
        }
      ]
    },

    /* ================= 10. AUDIO BANK ================= */
    {
      id: "audiobank",
      label: "Bank Audio",
      type: "audiobank",
      items: [
        { track: "09-01", title: "Kotoba: Hari Libur & Tradisi Jepang 1", audioUrl: "audio/Z_[09-01]_kotoba1.mp3" },
        { track: "09-02", title: "Kotoba: Kosakata Perayaan Tradisional 2", audioUrl: "audio/Z_[09-02]_kotoba2.mp3" },
        { track: "09-03", title: "Kiku 1: Penjelasan Hari Kedewasaan", audioUrl: "audio/Z_[09-03]_kiku1.mp3" },
        { track: "09-04", title: "Kiku 2: Tradisi Tahun Baru (初詣)", audioUrl: "audio/Z_[09-04]_kiku2.mp3" },
        { track: "09-05", title: "Kiku 3: Perayaan di Negara Asal", audioUrl: "audio/Z_[09-05]_kiku3.mp3" },
        { track: "09-06", title: "Kiku 4: Festival Anak (こどもの日)", audioUrl: "audio/Z_[09-06]_kiku4.mp3" },
        { track: "09-07", title: "Katachi: Pola Kalimat ～んです／～たり～たり", audioUrl: "audio/Z_[09-07]_katachi.mp3" },
        { track: "09-08", title: "Kaiwa: Percakapan Tradisi & Hari Libur", audioUrl: "audio/Z_[09-08]_kaiwa.mp3" },
        { track: "09-15", title: "Kiku Tambahan 1: Libur Akhir Tahun", audioUrl: "audio/Z_[09-15]_kiku1.mp3" },
        { track: "09-16", title: "Kiku Tambahan 2: Rencana Pulang Kampung", audioUrl: "audio/Z_[09-16]_kiku2.mp3" }
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
        <h2>Refleksi Belajar Peserta Didik (Bab 9)</h2>
        <div class="note-box">
          Isilah lembar refleksi ini secara jujur untuk mengukur pemahaman tentang hari besar dan budaya di Jepang.
        </div>
        <div class="question-card">
          <p class="prompt">1. Saya dapat menanyakan makna atau kegiatan perayaan hari besar Jepang (～は何をするんですか):</p>
          <div class="options">
            <label><input type="radio" name="ref1" value="3"> Sangat Mampu</label>
            <label><input type="radio" name="ref1" value="2"> Cukup Mampu</label>
            <label><input type="radio" name="ref1" value="1"> Belum Mampu</label>
          </div>
        </div>
        <div class="question-card">
          <p class="prompt">2. Saya dapat menceritakan hari libur atau tradisi di negara asal saya dengan pola ～たり～たりします:</p>
          <div class="options">
            <label><input type="radio" name="ref2" value="3"> Sangat Mampu</label>
            <label><input type="radio" name="ref2" value="2"> Cukup Mampu</label>
            <label><input type="radio" name="ref2" value="1"> Belum Mampu</label>
          </div>
        </div>
        <div class="question-card">
          <p class="prompt">3. Catatan Refleksi Mandiri & Pertanyaan ke Sensei:</p>
          <textarea rows="3" style="width:100%; border-radius:10px; border:1px solid #ccc; padding:8px;" placeholder="Tuliskan pengalaman atau bagian materi yang ingin dipelajari lebih dalam..."></textarea>
        </div>
      `
    }
  ]
};
