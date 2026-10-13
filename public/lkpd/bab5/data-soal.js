/*
  data-soal.js
  LKPD Bahasa Jepang Bab 5 | 早く予約したほうがいいですよ
  Level: A2.2 / Persiapan JFT-Basic / LPK
  Topik: 旅行に行こう (Ayo Berwisata / Rekomendasi & Persiapan Wisata)
  
  PENTING:
  - Folder 'audio/' berisi file Z_[05-01]_... s.d. Z_[05-22]_....mp3 lengkap
  - Password Guru PIN: sensei123
*/

window.LKPD_DATA = {
  settings: {
    // Hash Password Guru (PIN: sensei123 via salt lkpd_bab5::v1::)
    teacherPasswordHash: "d36c9f5416fde28976c0666da1f6f2044ebe584c473f55093f9f5049bc1323dd",
    sessionKey: "lkpd_bab5_session_v1",
    stateKey: "lkpd_bab5_state_v1",
    listeningPlayCount: 2,
    showListeningControls: false,
    babId: "bab5"
  },

  tabs: [
    {
      id: "panduan",
      label: "Panduan",
      type: "static",
      html: `
        <h2>Panduan LKPD Bab 5</h2>
        <div class="note">
          LKPD ini disusun berdasarkan materi <strong>Irodori Dasar 2 (A2.2) Bab 5: 「早く予約したほうがいいですよ」</strong> 
          dan diselaraskan dengan standar kompetensi <strong>CEFR A2 / JFT-Basic</strong> untuk kebutuhan peserta pelatihan LPK / calon Pekerja Berketerampilan Spesifik (SSW/Tokutei Ginou).
        </div>

        <h3>A. Tujuan Pembelajaran</h3>
        <p>Setelah menyelesaikan LKPD Bab 5 ini, peserta didik diharapkan mampu:</p>
        <ol>
          <li>Memahami penjelasan lisan pengenalan destinasi wisata di Jepang (Hokkaido, Tokyo, Okinawa, Kyoto, Nikko, Nara, Toyama, Nagano) mengenai daya tarik alam, kuliner, dan aktivitas yang dapat dilakukan (bentuk potensial <em>～（られ）ます</em>).</li>
          <li>Meminta dan memberikan rekomendasi/saran perjalanan wisata menggunakan pola <em>～たらいいですか</em> serta memberi saran dengan <em>～たほうがいいですよ</em> (sebaiknya melakukan) dan <em>～ないほうがいいですよ</em> (sebaiknya tidak melakukan).</li>
          <li>Membaca dan menganalisis ulasan perjalanan wisata online (reviu internet mengenai Danau Kawaguchi / Gunung Fuji) terkait hal-hal positif dan negatif yang dialami wisatawan.</li>
          <li>Menguasai kosakata fungsional terkait pariwisata, penginapan tradisional, persiapan perlengkapan, dan kanji dasar Bab 5.</li>
          <li>Menerjemahkan kalimat instruksi, rekomendasi, dan persiapan wisata secara tepat sesuai kaidah tata bahasa Jepang setara JFT-Basic A2.</li>
        </ol>

        <h3>B. Can-do Statements Setara A2 / JFT-Basic</h3>
        <table>
          <tr><th>No</th><th>Can-do Statement</th><th>Kompetensi Teruji</th></tr>
          <tr><td>Can-do 19</td><td>日本の観光地についての簡単な紹介を聞いて、そこがどんなところか、何ができるかなどを理解することができる。</td><td>Mendengarkan pengenalan tempat wisata di Jepang dan memahami suasana serta hal yang bisa dilakukan di sana.</td></tr>
          <tr><td>Can-do 20</td><td>観光地や旅行先について、アドバイスを求めたり、アドバイスしたりすることができる。</td><td>Meminta dan memberikan saran/rekomendasi terkait destinasi wisata, penginapan, dan persiapan.</td></tr>
          <tr><td>Can-do 21</td><td>観光地を訪れた人のネットの口コミを読んで、どんなところか、何がよかったか／よくなかったかなどを理解することができる。</td><td>Membaca ulasan internet mengenai destinasi wisata dan memahami aspek positif serta negatif yang dialami.</td></tr>
        </table>

        <h3>C. Kriteria Kelulusan &amp; Bobot Penilaian LPK</h3>
        <p>Penilaian kelulusan diselaraskan dengan standar kelulusan tes formatif LPK JP10 Outsutsuki:</p>
        <ul>
          <li><strong>Nilai ≥ 80%</strong>: Sangat Siap Ujian JFT-Basic (A2 Kompeten).</li>
          <li><strong>Nilai 65% – 79%</strong>: Cukup / Perlu Penguatan pada aspek tertentu.</li>
          <li><strong>Nilai &lt; 65%</strong>: Wajib Remedial &amp; Shadowing Mandiri pada Bank Audio.</li>
        </ul>
      `
    },

    {
      id: "materi",
      label: "Materi",
      type: "static",
      html: `
        <h2>Rangkuman Materi Bab 5</h2>
        <div class="note">
          Tema Utama: <strong>旅行に行こう (Ayo Berwisata / Rekomendasi &amp; Persiapan Wisata)</strong>
        </div>

        <h3>1. Tata Bahasa Kunci (文法)</h3>
        <div class="grammar-box">
          <h4>➊ V-（られ）ます ＜Bentuk Potensial / 可能形＞</h4>
          <p>Digunakan untuk menyatakan kemampuan atau hal yang dapat dilakukan pada tempat/situasi tertentu. Partikel objek <strong>を</strong> umumnya berganti menjadi <strong>が</strong>.</p>
          <ul>
            <li><strong>Golongan 1 (U -> E + Ru):</strong> 泳ぐ → 泳げる (oyogeru), 遊ぶ → 遊べる (asoberu), 買う → 買える (kaeru), 行く → 行ける (ikeru)</li>
            <li><strong>Golongan 2 (-ru -> -rareru):</strong> 食べる → 食べられる (taberareru), 見る → 見られる (mirareru)</li>
            <li><strong>Golongan 3 (Irreguler):</strong> する → できる (dekiru), 来る → 来られる (korareru)</li>
          </ul>
          <p class="ja">例：北海道では、新鮮なカニやウニが食べられますよ。</p>
          <p class="ja">例：沖縄は暖かいから、春から秋まで泳げますよ。</p>
          <p class="ja">例：京都はお寺や神社がたくさん見られますよ。</p>
        </div>

        <div class="grammar-box">
          <h4>➋ ～たらいいですか (Meminta Rekomendasi / Saran)</h4>
          <p>Digunakan ketika meminta saran dari orang yang berpengalaman atau mengetahui informasi tentang destinasi tertentu.</p>
          <p class="ja">例：今度、日光に行くんですけど、何で行ったらいいですか？（電車で行けますよ。）</p>
          <p class="ja">例：奈良に行くんですけど、どんなところに泊まったらいいですか？（民宿がおすすめだよ。）</p>
          <p class="ja">例：富山では、何を食べたらいいですか？（やっぱりおすしですね。）</p>
        </div>

        <div class="grammar-box">
          <h4>➌ V-たほうがいいですよ (Memberi Saran Positif / Sebaiknya Melakukan)</h4>
          <p>Digunakan untuk memberikan saran atau anjuran tindakan yang bijak/terbaik.</p>
          <p class="ja">例：人気がある民宿だから、早く予約したほうがいいですよ。</p>
          <p class="ja">例：山の上は寒いですから、厚い上着を持って行ったほうがいいですよ。</p>
          <p class="ja">例：帽子と手袋は、自分で買って持って行ったほうがいいですよ。</p>
        </div>

        <div class="grammar-box">
          <h4>➍ V-ないほうがいいですよ (Memberi Saran Negatif / Sebaiknya Tidak Melakukan)</h4>
          <p>Digunakan untuk menyarankan lawan bicara agar menghindari tindakan tertentu karena alasan tertentu (misal: antrean panjang/macet).</p>
          <p class="ja">例：日曜日はすごく混みますから、行かないほうがいいですよ。</p>
        </div>

        <h3>2. Kosakata Destinasi &amp; Suasana Wisata</h3>
        <table>
          <tr><th>Kosakata Jepang</th><th>Romaji</th><th>Arti Bahasa Indonesia</th></tr>
          <tr><td>自然が豊か（な）</td><td>shizen ga yutaka (na)</td><td>Alamnya asri / kaya akan panorama alam</td></tr>
          <tr><td>海がきれい（な）</td><td>umi ga kirei (na)</td><td>Lautnya indah / jernih</td></tr>
          <tr><td>食べ物がおいしい</td><td>tabemono ga oishii</td><td>Makanannya lezat</td></tr>
          <tr><td>暖かい</td><td>atatakai</td><td>Hangat (iklim/cuaca)</td></tr>
          <tr><td>古い町</td><td>furui machi</td><td>Kota bersejarah / kota tua</td></tr>
          <tr><td>人が多い／混んでいる</td><td>hito ga ooi / konde iru</td><td>Banyak orang / ramai padat</td></tr>
          <tr><td>遊ぶところが多い</td><td>asobu tokoro ga ooi</td><td>Banyak tempat hiburan/rekreasi</td></tr>
          <tr><td>観光客に人気がある</td><td>kankoukyaku ni ninki ga aru</td><td>Populer di kalangan wisatawan</td></tr>
          <tr><td>旅館 (りょかん)</td><td>ryokan</td><td>Penginapan tradisional khas Jepang</td></tr>
          <tr><td>民宿 (みんしゅく)</td><td>minshuku</td><td>Penginapan keluarga sederhana</td></tr>
          <tr><td>露天風呂 (ろてんぶろ)</td><td>rotenburo</td><td>Pemandian air panas terbuka / luar ruangan</td></tr>
          <tr><td>水族館 (すいぞくかん)</td><td>suizokukan</td><td>Akuarium raksasa / Sea World</td></tr>
          <tr><td>日帰り (ひがえり)</td><td>higaeri</td><td>Wisata PP (pergi-pulang tanpa menginap)</td></tr>
        </table>
      `
    },

    {
      id: "moji",
      label: "1. 文字・語彙",
      type: "questions",
      items: [
        {
          id: "q1",
          type: "mcq",
          number: "Soal 1.",
          prompt: "海や湖で人を乗せて動く乗り物は何ですか。",
          options: ["電車", "飛行機", "船", "自転車"],
          answer: 3
        },
        {
          id: "q2",
          type: "mcq",
          number: "Soal 2.",
          prompt: "冬の寒いときやスキーのときに手に着けるものは何ですか。",
          options: ["帽子", "水着", "手袋", "靴下"],
          answer: 3
        },
        {
          id: "q3",
          type: "mcq",
          number: "Soal 3.",
          prompt: "湖と富士山がいっしょに（   ）、すごくきれいだって聞きましたよ。",
          options: ["読めて", "行けて", "見られて", "着られて"],
          answer: 3
        },
        {
          id: "q4",
          type: "mcq",
          number: "Soal 4.",
          prompt: "山の上は寒いですから、厚い上着を（   ）行ったほうがいいですよ。",
          options: ["乗って", "持って", "入って", "脱いで"],
          answer: 2
        },
        {
          id: "q5",
          type: "mcq",
          number: "Soal 5.",
          prompt: "なんじに「出発」しますか。下線部の読み方を選んでください。",
          options: ["しゅっぱつ", "しっぱつ", "しゅっぱあつ", "しゅはつ"],
          answer: 1
        },
        {
          id: "q6",
          type: "mcq",
          number: "Soal 6.",
          prompt: "「自転車」をかりて、サイクリングをしました。下線部の読み方を選んでください。",
          options: ["じてんさ", "じてんしゃ", "じでんしゃ", "じでんさ"],
          answer: 2
        },
        {
          id: "q7",
          type: "mcq",
          number: "Soal 7.",
          prompt: "りょこうの「計画」をたてています。下線部の読み方を選んでください。",
          options: ["けかく", "けかあく", "けいかく", "けいか"],
          answer: 3
        },
        {
          id: "q8",
          type: "mcq",
          number: "Soal 8.",
          prompt: "とうきょうは、電車や地下鉄などの（   ）がべんりです。",
          options: ["温泉", "交通", "写真", "自然"],
          answer: 2
        },
        {
          id: "q9",
          type: "mcq",
          number: "Soal 9.",
          prompt: "日本の畳や温泉がある伝統的な（   ）にとまってみたいです。",
          options: ["旅館", "自然", "先輩", "空港"],
          answer: 1
        },
        {
          id: "q10",
          type: "mcq",
          number: "Soal 10.",
          prompt: "正しい文になるように ★ に入る番号を選んでください。<br>「沖縄は［ 1. 暖かいから ］［ 2. 春から ］［ ★ ］［ 3. 泳げます ］［ 4. 秋まで ］よ。」",
          options: ["1. 暖かいから", "2. 春から", "3. 泳げます", "4. 秋まで"],
          answer: 4
        }
      ]
    },

    {
      id: "kaiwa",
      label: "2. 会話表現",
      type: "questions",
      items: [
        {
          id: "q11",
          type: "mcq",
          number: "Soal 11.",
          prompt: "A: いつか沖縄に行ってみたいんです。海がきれいですよね。<br>B: ええ、きれいですよ。それに暖かいから、春から秋まで（   ）よ。",
          options: ["泳ぎます", "泳ぎません", "泳ぎたいです", "泳げます"],
          answer: 4
        },
        {
          id: "q12",
          type: "mcq",
          number: "Soal 12.",
          prompt: "A: 大阪はどんな場所ですか？<br>B: にぎやかで、食べ物が（   ）。",
          options: ["おいしいところです", "おいしいでしょう", "おいしいかもしれません", "おいしいですから"],
          answer: 1
        },
        {
          id: "q13",
          type: "mcq",
          number: "Soal 13.",
          prompt: "A: どうやって行きますか？<br>B: バスで行けますよ。友達が安くて便利だ（   ）。<br>A: じゃあ、バスで行きましょう。",
          options: ["って言っていました", "って聞きました", "でしょう", "かもしれません"],
          answer: 1
        },
        {
          id: "q14",
          type: "mcq",
          number: "Soal 14.",
          prompt: "A: 今度、奈良に旅行に行くんrectけど、（   ア   ）ところに（   イ   ）いいですか？<br>B: 民宿がおすすめだよ。",
          options: ["ア：いつ　イ：泊まっても", "ア：何の　イ：泊まらないほうが", "ア：どんな　イ：泊まったら", "ア：どこ　イ：泊まったほうが"],
          answer: 3
        },
        {
          id: "q15",
          type: "mcq",
          number: "Soal 15.",
          prompt: "A: 「さか寿司」ですね。行ってみます。<br>B: でも、できれば、日曜日は（   ）いいですよ。人が多いですから。",
          options: ["行ったら", "行かなくても", "行かないほうが", "行っても"],
          answer: 3
        },
        {
          id: "q16",
          type: "mcq",
          number: "Soal 16.",
          prompt: "A: 自転車を借りて、サイクリングしませんか？<br>B: （   ）……。私、自転車乗れないんです……。",
          options: ["ごめんなさい", "ありがとうございます", "いいですね", "どうですか"],
          answer: 1
        },
        {
          id: "q17",
          type: "mcq",
          number: "Soal 17.",
          prompt: "A: スキー場に行くんですけど、何を準備したらいいですか？<br>B: スキー板とかウェアは借りられるけど、帽子と手袋は自分で（   ）いいよ。",
          options: ["買ったら", "買ったほうが", "買わないほうが", "買っても"],
          answer: 2
        },
        {
          id: "q18",
          type: "mcq",
          number: "Soal 18.",
          prompt: "A: 日光に紅葉を見に行くんrectけど、何で行ったらいいですか？<br>B: 浅草から（   ）行けますよ。電車が一番便利です。",
          options: ["電車で", "船で", "飛行機で", "徒歩で"],
          answer: 1
        }
      ]
    },

    {
      id: "choikai",
      label: "3. 聴解",
      type: "questions",
      items: [
        {
          id: "q19",
          type: "listening",
          number: "Soal 19.",
          prompt: "音声を聞いて答えてください。北海道について、何ができると言っていますか。",
          audioUrl: "audio/Z_[05-03]_kiku1.mp3",
          playCount: 2,
          options: ["お寺や神社を見る", "新鮮なカニやウニを食べる", "きれいな魚を見る", "一日中遊ぶ"],
          answer: 2,
          script: "Ａ：昨日、テレビで北海道の番組を見たんです。きれいなところですね。 Ｂ：ええ。自然も豊かだし、食べ物もおいしいし、とてもいいところですよ。 Ａ：へー。 Ｂ：特に魚がおいしくて、新鮮なカニとかウニとか食べられますよ。 Ａ：えー、いいですね。いつか行ってみたいです。"
        },
        {
          id: "q20",
          type: "listening",
          number: "Soal 20.",
          prompt: "音声を聞いて答えてください。東京について、何ができると言っていますか。",
          audioUrl: "audio/Z_[05-04]_kiku2.mp3",
          playCount: 2,
          options: ["お寺や神社を見る", "新鮮なカニやウニを食べる", "きれいな魚を見る", "一日中遊ぶ"],
          answer: 4,
          script: "Ａ：太田さん、前に東京に住んでいたそうですね。どんなところですか？ Ｂ：うーん、やっぱり人が多いよね。電車も混んでいて、ラッシュのときはすごく大変だよ。 Ａ：そうですか。 Ｂ：でも、遊ぶところがいろいろあるから、一日中遊べるよ。 Ａ：へー、いいなあ。"
        },
        {
          id: "q21",
          type: "listening",
          number: "Soal 21.",
          prompt: "音声を聞いて答えてください。沖縄はどんなところだと言っていますか。",
          audioUrl: "audio/Z_[05-05]_kiku3.mp3",
          playCount: 2,
          options: ["歴史がある古い町", "海がきれいで暖かいところ", "食べ物が安くておいしい町", "電車が混んでいる町"],
          answer: 2,
          script: "Ａ：いつか沖縄に行ってみたいんです。海がきれいですよね。 Ｂ：ええ、きれいですよ。それに温かいから、春から秋まで泳げますよ。シュノーケリングもできますし。 Ａ：そうなんですか。 Ｂ：あと、大きい水族館があって、きれいな魚が見られますよ。 Ａ：行きたいですね。"
        },
        {
          id: "q22",
          type: "listening",
          number: "Soal 22.",
          prompt: "音声を聞いて答えてください。京都はどんなところだと言っていますか。",
          audioUrl: "audio/Z_[05-06]_kiku4.mp3",
          playCount: 2,
          options: ["古い町でお寺や神社がたくさん見られる", "海が近くて魚がおいしい", "スキー場がたくさんある", "外国人が少なくて静かな町"],
          answer: 1,
          script: "Ａ：北村さん、京都はどんなところですか？一度行ってみたいんです。 Ｂ：そうだなあ、古い町で、お寺とか神社がたくさん見られるよ。 Ａ：そうですか。 Ｂ：あと、いろいろな日本のお土産が買えるし、海外からの観光客にもすごく人気があるよね。 Ａ：そうですよね。"
        },
        {
          id: "q23",
          type: "listening",
          number: "Soal 23.",
          prompt: "音声を聞いて答えてください。日光旅行について、どんなアドバイスをしていますか。",
          audioUrl: "audio/Z_[05-15]_kiku1.mp3",
          playCount: 2,
          options: ["車で行ったほうがいい", "厚い上着を持って行ったほうがいい", "早くホテルを予約したほうがいい", "日曜日に行ったほうがいい"],
          answer: 2,
          script: "日光は山の上で寒くなりますから、厚い上着を持って行ったほうがいいですよ。"
        },
        {
          id: "q24",
          type: "listening",
          number: "Soal 24.",
          prompt: "音声を聞いて答えてください。奈良旅行の宿について、どんなアドバイスをしていますか。",
          audioUrl: "audio/Z_[05-16]_kiku2.mp3",
          playCount: 2,
          options: ["民宿を早く予約したほうがいい", "高級ホテルに泊まったほうがいい", "自転車を買ったほうがいい", "春に行ったほうがいい"],
          answer: 1,
          script: "奈良の民宿は人気がありますから、早く予約したほうがいいですよ。"
        },
        {
          id: "q25",
          type: "listening",
          number: "Soal 25.",
          prompt: "音声を聞いて答えてください。富山のおすし屋「さか寿司」について、何と言っていますか。",
          audioUrl: "audio/Z_[05-17]_kiku3.mp3",
          playCount: 2,
          options: ["値段がとても高い", "日曜日はすごく混むから行かないほうがいい", "回転ずしだからおいしくない", "予約ができない"],
          answer: 2,
          script: "Ａ：今度、富山に行くんrectけど、和田さん、くわしいですよね。Ｂ：ええ、富山はやっぱりおすしですね。「さか寿司」という店は本当においしいですよ。でも、できれば日曜日は行かないほうがいいですよ。日曜日すごく混むんですよ。"
        },
        {
          id: "q26",
          type: "listening",
          number: "Soal 26.",
          prompt: "音声を聞いて答えてください。長野へスキーに行く準備について、何と言っていますか。",
          audioUrl: "audio/Z_[05-18]_kiku4.mp3",
          playCount: 2,
          options: ["スキー板とウェアは自分で買ったほうがいい", "帽子と手袋は自分で買って持って行ったほうがいい", "何も持っていかないほうがいい", "暖かい服を着ないほうがいい"],
          answer: 2,
          script: "スキー板やウェアはスキー場で借りられるけど、帽子と手袋は自分で買って持って行ったほうがいいと思うよ。"
        }
      ]
    },

    {
      id: "dokkai",
      label: "4. 読解",
      type: "questions",
      items: [
        {
          id: "q27",
          type: "mcq",
          number: "Soal 27.",
          passage: `
            <strong>【河口湖の口コミ（旅行サイトより）】</strong><br><br>
            <strong>あやのさん（女性／20代） ⭐⭐⭐⭐</strong><br>
            「日帰りで河口湖へ行きました。天気がよくて、湖の向こうに富士山がとてもきれいに見えました！ボートに乗ったり、湖のそばのレストランでおいしいほうとうを食べたりして、大満足でした。でも、ロープウェイは観光客が多すぎて、並ぶ時間が長くて乗れませんでした。次は平日に行きたいです。」<br><br>
            <strong>sajiさん（男性／30代） ⭐⭐⭐⭐</strong><br>
            「温泉旅館に1泊しました。露天風呂から富士山が見えて最高でした！オルゴール美術館にも寄って、とても楽しかったです。ただ、2日目は曇っていて富士山がまったく見えなくて、いい写真が撮れなかったのが残念でした。山の天気は変わりやすいので、事前に天気をよく調べたほうがいいですね。」
          `,
          prompt: "あやのさんが「よかった」と言っていることは何ですか。",
          options: ["富士山がきれいに見えたこと", "ロープウェイに乗ったこと", "露天風呂に入ったこと", "2泊してのんびりしたこと"],
          answer: 1
        },
        {
          id: "q28",
          type: "mcq",
          number: "Soal 28.",
          prompt: "あやのさんが「よくなかった（残念だった）」と言っていることは何ですか。",
          options: ["レストランが休みだった", "ボートに乗れなかった", "人が多くてロープウェイに乗れなかった", "雨が降って寒かった"],
          answer: 3
        },
        {
          id: "q29",
          type: "mcq",
          number: "Soal 29.",
          prompt: "sajiさんが「よかった」と言っていることは何ですか。",
          options: ["ロープウェイからの景色", "露天風呂に入って富士山が見えたこと", "ボートに乗ったこと", "おいしいほうとうを食べたこと"],
          answer: 2
        },
        {
          id: "q30",
          type: "mcq",
          number: "Soal 30.",
          prompt: "sajiさんが「よくなかった（残念だった）」と言っていることは何ですか。",
          options: ["旅館の食事が口に合わなかった", "曇っていて富士山が見えず写真が撮れなかった", "オルゴール美術館が閉まっていた", "露天風呂がぬるかった"],
          answer: 2
        },
        {
          id: "q31",
          type: "mcq",
          number: "Soal 31.",
          prompt: "この2人の口コミを読んで、河口湖へ行く人へのアドバイスとして最も適切なものはどれですか。",
          options: ["ロープウェイに乗るなら、混雑するので時間に余裕を持ったほうがいい", "河口湖周辺には温泉がないので日帰りにしたほうがいい", "富士山はいつでもはっきり見えるので天気を調べる必要はない", "平日はレストランがすべて閉まるので日曜日に行ったほうがいい"],
          answer: 1
        },
        {
          id: "q32",
          type: "mcq",
          number: "Soal 32.",
          prompt: "2人の旅行のタイプについて正しい記述はどれですか。",
          options: ["あやのさんは泊まりで、sajiさんは日帰りで行った", "あやのさんは日帰りで、sajiさんは温泉旅館に1泊した", "2人ともロープウェイに乗ることができた", "2人とも富士山をまったく見ることができなかった"],
          answer: 2
        }
      ]
    },

    {
      id: "kanji",
      label: "5. 漢字",
      type: "questions",
      items: [
        {
          id: "k33",
          type: "mcq",
          number: "Soal 33.",
          prompt: "「自然」の正しい読み方はどれですか。",
          options: ["しぜん", "じぜん", "しぜ", "じねん"],
          answer: 1
        },
        {
          id: "k34",
          type: "mcq",
          number: "Soal 34.",
          prompt: "「交通」の正しい読み方はどれですか。",
          options: ["こうつう", "こつう", "きょうつう", "こうとう"],
          answer: 1
        },
        {
          id: "k35",
          type: "mcq",
          number: "Soal 35.",
          prompt: "「出発」の正しい読み方はどれですか。",
          options: ["しゅっぱつ", "しっぱつ", "しゅつはつ", "しゅはつ"],
          answer: 1
        },
        {
          id: "k36",
          type: "mcq",
          number: "Soal 36.",
          prompt: "「計画」の正しい読み方はどれですか。",
          options: ["けいかく", "けいかん", "けかく", "けいかっく"],
          answer: 1
        },
        {
          id: "k37",
          type: "mcq",
          number: "Soal 37.",
          prompt: "「自転車」の正しい読み方はどれですか。",
          options: ["じてんしゃ", "じでんしゃ", "じてんさ", "じでんさ"],
          answer: 1
        },
        {
          id: "k38",
          type: "mcq",
          number: "Soal 38.",
          prompt: "「旅館」の正しい読み方はどれですか。",
          options: ["りょかん", "りょがん", "りょうかん", "ろかん"],
          answer: 1
        },
        {
          id: "k39",
          type: "mcq",
          number: "Soal 39.",
          prompt: "「遊ぶ」の正しい読み方はどれですか。",
          options: ["あそぶ", "はこぶ", "えらぶ", "よろこぶ"],
          answer: 1
        },
        {
          id: "k40",
          type: "mcq",
          number: "Soal 40.",
          prompt: "「調べる」の正しい読み方はどれですか。",
          options: ["しらべる", "ならべる", "くらべる", "たべる"],
          answer: 1
        }
      ]
    },

    {
      id: "kosakata",
      label: "6. 語彙・ドリル",
      type: "questions",
      items: [
        { id: "v41", type: "vocab", number: "41.", prompt: "pemandangan alam / alam sekitar", accepted: ["自然", "しぜん", "shizen"] },
        { id: "v42", type: "vocab", number: "42.", prompt: "penginapan tradisional khas Jepang", accepted: ["旅館", "りょかん", "ryokan"] },
        { id: "v43", type: "vocab", number: "43.", prompt: "pemandian air panas luar ruangan", accepted: ["露天風呂", "ろてんぶろ", "rotenburo"] },
        { id: "v44", type: "vocab", number: "44.", prompt: "akuarium raksasa / Sea World", accepted: ["水族館", "すいぞくかん", "suizokukan"] },
        { id: "v45", type: "vocab", number: "45.", prompt: "pemesanan tempat / reservasi", accepted: ["予約", "よやく", "yoyaku"] },
        { id: "v46", type: "vocab", number: "46.", prompt: "berangkat / keberangkatan", accepted: ["出発", "しゅっぱつ", "shuppatsu"] },
        { id: "v47", type: "vocab", number: "47.", prompt: "snorkeling / selam permukaan air", accepted: ["シュノーケリング", "shunookeringu", "snorkeling", "snorkling"] },
        { id: "v48", type: "vocab", number: "48.", prompt: "pakaian hangat / jaket luar", accepted: ["上着", "うわぎ", "uwagi"] },
        { id: "v49", type: "vocab", number: "49.", prompt: "sarung tangan musim dingin", accepted: ["手袋", "てぶくろ", "tebukuro"] },
        { id: "v50", type: "vocab", number: "50.", prompt: "wisata satu hari pulang-pergi (tanpa menginap)", accepted: ["日帰り", "ひがえり", "higaeri"] }
      ]
    },

    {
      id: "terjemahan",
      label: "7. 翻訳",
      type: "questions",
      items: [
        {
          id: "tr1",
          type: "translation",
          number: "Soal 51.",
          source: "Karena Okinawa hangat, kita bisa berenang dari musim semi sampai musim gugur.",
          hint: "Gunakan kata kerja potensial 泳げます dan partikel から.",
          modelAnswer: "沖縄は暖かいから、春から秋まで泳げますよ。"
        },
        {
          id: "tr2",
          type: "translation",
          number: "Soal 52.",
          source: "Sebaiknya cepat lakukan reservasi (penginapan).",
          hint: "Gunakan pola saran positif ～たほうがいいですよ.",
          modelAnswer: "早く予約したほうがいいですよ。"
        },
        {
          id: "tr3",
          type: "translation",
          number: "Soal 53.",
          source: "Karena hari Minggu sangat ramai, sebaiknya jangan pergi.",
          hint: "Gunakan pola saran negatif ～ないほうがいいですよ dan alasan から.",
          modelAnswer: "日曜日はすごく混みますから、行かないほうがいいですよ。"
        },
        {
          id: "tr4",
          type: "translation",
          number: "Soal 54.",
          source: "Saya mau pergi ke Nara, sebaiknya menginap di tempat yang seperti apa?",
          hint: "Gunakan pola meminta saran ～たらいいですか.",
          modelAnswer: "奈良に旅行に行くんrectけど、どんなところに泊まったらいいですか？"
        },
        {
          id: "tr5",
          type: "translation",
          number: "Soal 55.",
          source: "Karena di atas gunung dingin, sebaiknya bawa pakaian hangat.",
          hint: "Bawa baju hangat = 上着を持って行く + ほうがいいですよ.",
          modelAnswer: "山の上は寒いですから、厚い上着を持って行ったほうがいいですよ。"
        }
      ]
    },

    {
      id: "bankaudio",
      label: "Bank Audio",
      type: "audiobank",
      items: [
        { id: "ba01", title: "Z_[05-01] Kosakata 1 - Karakteristik Tempat Wisata", file: "audio/Z_[05-01]_kotoba1.mp3", desc: "自然が豊か、海がきれい、食べ物がおいしい、暖かい、古い町、人が多い、遊ぶところが多い、観光客に人気がある" },
        { id: "ba02", title: "Z_[05-02] Kosakata 2 - Latihan Pilihan Kata a-h", file: "audio/Z_[05-02]_kotoba2.mp3", desc: "Pengulangan dan pemadanan karakteristik suasana tempat wisata." },
        { id: "ba03", title: "Z_[05-03] Percakapan 1 - Hokkaido (Alam & Seafood)", file: "audio/Z_[05-03]_kiku1.mp3", desc: "Mendengarkan keindahan alam Hokkaido dan menikmati kepiting serta bulu babi segar." },
        { id: "ba04", title: "Z_[05-04] Percakapan 2 - Tokyo (Kota Ramai & Rekreasi)", file: "audio/Z_[05-04]_kiku2.mp3", desc: "Tokyo yang ramai, jam sibuk kereta, serta berbagai wahana rekreasi seharian penuh." },
        { id: "ba05", title: "Z_[05-05] Percakapan 3 - Okinawa (Laut & Snorkeling)", file: "audio/Z_[05-05]_kiku3.mp3", desc: "Okinawa yang hangat, berenang musim semi hingga musim gugur, dan akuarium raksasa." },
        { id: "ba06", title: "Z_[05-06] Percakapan 4 - Kyoto (Kota Kuno Bersejarah)", file: "audio/Z_[05-06]_kiku4.mp3", desc: "Kuil bersejarah, belanja oleh-oleh khas Jepang, dan daya tarik wisatawan mancanegara." },
        { id: "ba07", title: "Z_[05-07] Bentuk Tata Bahasa - Bentuk Potensial (可能形)", file: "audio/Z_[05-07]_katachi.mp3", desc: "Pola pembentukan verba potensial: 食べられる、泳げる、遊べる、見られる、買える." },
        { id: "ba08", title: "Z_[05-08] Percakapan Komprehensif Destinasi Wisata", file: "audio/Z_[05-08]_kaiwa.mp3", desc: "Percakapan lengkap saling bertukar informasi mengenai destinasi liburan impian di Jepang." },
        { id: "ba09", title: "Z_[05-09] Latihan Bentuk Ungkapan Kemampuan", file: "audio/Z_[05-09]_katachi.mp3", desc: "Latihan konjugasi lisan verba potensial." },
        { id: "ba10", title: "Z_[05-10] Praktik Berbicara 1 - Tanya Jawab Kemampuan Wisata", file: "audio/Z_[05-10]_hanasu1.mp3", desc: "Praktik dialog menanyakan apa yang bisa dinikmati di destinasi wisata." },
        { id: "ba11", title: "Z_[05-11] Praktik Berbicara 2 - Variasi Jawaban Wisata", file: "audio/Z_[05-11]_hanasu2.mp3", desc: "Variasi respons mengenai keistimewaan tempat wisata." },
        { id: "ba12", title: "Z_[05-12] Praktik Berbicara 3 - Roleplay Rekomendasi", file: "audio/Z_[05-12]_hanasu3.mp3", desc: "Roleplay saling merekomendasikan tempat liburan." },
        { id: "ba13", title: "Z_[05-13] Kosakata 3 - Destinasi Wisata & Aktivitas", file: "audio/Z_[05-13]_kotoba1.mp3", desc: "Nikko (Koyo), Nara (Kuil & Rusa), Toyama (Sushi), Nagano (Ski)." },
        { id: "ba14", title: "Z_[05-14] Kosakata 4 - Transportasi & Perlengkapan Liburan", file: "audio/Z_[05-14]_kotoba2.mp3", desc: "Kereta, bus cepat, penginapan tradisional, perlengkapan musim dingin." },
        { id: "ba15", title: "Z_[05-15] Percakapan Saran 1 - Nikko & Baju Hangat", file: "audio/Z_[05-15]_kiku1.mp3", desc: "Rekomendasi naik kereta dan membawa jaket tebal saat melihat pemandangan musim gugur di Nikko." },
        { id: "ba16", title: "Z_[05-16] Percakapan Saran 2 - Nara & Reservasi Penginapan", file: "audio/Z_[05-16]_kiku2.mp3", desc: "Saran memesan penginapan minshuku lebih awal karena sangat diminati wisatawan." },
        { id: "ba17", title: "Z_[05-17] Percakapan Saran 3 - Toyama & Menghindari Hari Minggu", file: "audio/Z_[05-17]_kiku3.mp3", desc: "Saran menikmati sushi lezat di Toyama tetapi menghindari hari Minggu karena antrean panjang." },
        { id: "ba18", title: "Z_[05-18] Percakapan Saran 4 - Nagano & Perlengkapan Ski", file: "audio/Z_[05-18]_kiku4.mp3", desc: "Perlengkapan ski: papan seluncur bisa disewa, namun topi dan sarung tangan disarankan beli sendiri." },
        { id: "ba19", title: "Z_[05-19] Bentuk Tata Bahasa - Pola Saran (たほうがいい／ないほうがいい)", file: "audio/Z_[05-19]_katachi.mp3", desc: "Pola memberi anjuran dan larangan halus dalam berwisata." },
        { id: "ba20", title: "Z_[05-20] Praktik Berbicara Saran 1", file: "audio/Z_[05-20]_hanasu1.mp3", desc: "Latihan menanyakan dan memberikan saran transportasi." },
        { id: "ba21", title: "Z_[05-21] Praktik Berbicara Saran 2", file: "audio/Z_[05-21]_hanasu2.mp3", desc: "Latihan menanyakan dan memberikan saran penginapan." },
        { id: "ba22", title: "Z_[05-22] Praktik Berbicara Saran 3", file: "audio/Z_[05-22]_hanasu3.mp3", desc: "Latihan menanyakan dan memberikan saran persiapan perlengkapan." }
      ]
    },

    {
      id: "hasil",
      label: "Hasil & Nilai",
      type: "result"
    },

    {
      id: "refleksi",
      label: "Refleksi",
      type: "static",
      html: `
        <h2>Refleksi Pembelajaran Bab 5</h2>
        <div class="note">
          Luangkan waktu untuk merefleksikan pencapaian belajar Anda pada materi <strong>Bab 5: 「早く予約したほうがいいですよ」</strong>.
        </div>

        <h3>Evaluasi Mandiri Can-do</h3>
        <table>
          <tr>
            <th>Can-do Bab 5</th>
            <th>Pernyataan Kompetensi</th>
            <th>Tingkat Pemahaman</th>
          </tr>
          <tr>
            <td><strong>Can-do 19</strong></td>
            <td>Saya dapat memahami penjelasan lisan tentang destinasi wisata di Jepang serta kegiatan yang bisa dilakukan di sana (bentuk potensial).</td>
            <td>
              <select class="form-select">
                <option value="">-- Pilih --</option>
                <option value="3">⭐⭐⭐ Sangat Mampu</option>
                <option value="2">⭐⭐ Cukup Mampu</option>
                <option value="1">⭐ Masih Perlu Latihan</option>
              </select>
            </td>
          </tr>
          <tr>
            <td><strong>Can-do 20</strong></td>
            <td>Saya dapat meminta dan memberikan saran/rekomendasi perjalanan wisata (pola ～たらいいですか, ～たほうがいい, ～ないほうがいい).</td>
            <td>
              <select class="form-select">
                <option value="">-- Pilih --</option>
                <option value="3">⭐⭐⭐ Sangat Mampu</option>
                <option value="2">⭐⭐ Cukup Mampu</option>
                <option value="1">⭐ Masih Perlu Latihan</option>
              </select>
            </td>
          </tr>
          <tr>
            <td><strong>Can-do 21</strong></td>
            <td>Saya dapat membaca ulasan wisata online di Jepang dan memahami hal positif serta negatif yang dialami wisatawan.</td>
            <td>
              <select class="form-select">
                <option value="">-- Pilih --</option>
                <option value="3">⭐⭐⭐ Sangat Mampu</option>
                <option value="2">⭐⭐ Cukup Mampu</option>
                <option value="1">⭐ Masih Perlu Latihan</option>
              </select>
            </td>
          </tr>
        </table>

        <h3>Catatan Refleksi Pribadi</h3>
        <textarea id="catatanRefleksi" style="width:100%;height:120px;border-radius:12px;border:1px solid #ccc;padding:12px;font-family:inherit;font-size:0.95rem;" placeholder="Tuliskan materi yang paling menyenangkan atau hal yang masih sulit Anda pahami di Bab 5 ini..."></textarea>
      `
    }
  ]
};
