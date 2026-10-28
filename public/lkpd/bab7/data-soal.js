/*
  data-soal.js
  LKPD Bahasa Jepang Bab 7 | 雨が降ったら、ホールでやります
  Level: A2.2 / Persiapan JFT-Basic / LPK
  Topik: 地域のイベント (Acara Komunitas, Festival Warga & Cuaca)
  Sumber Kurikulum: Irodori Shokyuu 2 (初級2) Bab 7 & Standar CEFR A2
*/

window.LKPD_DATA = {
  settings: {
    teacherPasswordHash: "6b40c7ab79085611a42cd12be96f26e4696734ff4d7ed831606f8322f8583bb6",
    sessionKey: "lkpd_bab7_session_v1",
    stateKey: "lkpd_bab7_state_v1",
    listeningPlayCount: 2,
    showListeningControls: false,
    babId: "bab7"
  },

  tabs: [
    /* ================= 1. PANDUAN ================= */
    {
      id: "panduan",
      label: "Panduan",
      type: "static",
      html: `
        <div class="note guide-box">
          <h2>Panduan LKPD Bab 7</h2>
          <p>
            LKPD ini disusun berdasarkan materi <strong>Irodori Shokyū 2 – Bab 7「雨が降ったら、ホールでやります」</strong>,
            diselaraskan dengan standar capaian kompetensi <strong>CEFR A2 / JFT-Basic</strong> untuk kebutuhan pembelajaran dan LPK.
          </p>
        </div>

        <h3>A. Tujuan Pembelajaran</h3>
        <p>Setelah menyelesaikan lembar kerja ini, peserta didik diharapkan mampu:</p>
        <ol>
          <li>Membaca dan memahami informasi utama dari papan pengumuman wilayah (掲示板) atau kotak pos (郵便受け) mengenai kegiatan warga.</li>
          <li>Memahami perubahan jadwal atau lokasi acara akibat kondisi cuaca (雨天中止・雨天延期・ホールでやります).</li>
          <li>Mengajak atau menyampaikan keikutsertaan dalam kegiatan gotong royong dan festival lingkungan.</li>
          <li>Bertanya dan mengonfirmasi barang bawaan, pakaian kerja, serta waktu berkumpul (持ち物・集合時間).</li>
          <li>Menguasai penggunaan bentuk pengandaian <strong>～たら</strong> dan pola kondisi <strong>～場合</strong>.</li>
          <li>Menguasai kosakata penting dan kanji tema kegiatan komunitas Bab 7.</li>
        </ol>

        <h3>B. Can-do Statements Resmi Irodori A2.2</h3>
        <table>
          <thead>
            <tr><th>No</th><th>Can-do Statement</th></tr>
          </thead>
          <tbody>
            <tr><td>Can-do 28</td><td>Saya dapat membaca papan pengumuman lingkungan untuk mengetahui jenis acara, tanggal, dan tempat berkumpul.</td></tr>
            <tr><td>Can-do 29</td><td>Saya dapat memahami pengumuman tentang apa yang akan dilakukan jika hari hujan (雨天の場合).</td></tr>
            <tr><td>Can-do 30</td><td>Saya dapat berbicara tentang apakah saya akan berpartisipasi dalam suatu kegiatan warga atau tidak.</td></tr>
            <tr><td>Can-do 31</td><td>Saya dapat bertanya tentang perlengkapan yang harus dibawa dan pakaian yang sesuai untuk kegiatan.</td></tr>
          </tbody>
        </table>

        <h3>C. Struktur Asesmen LKPD Bab 7</h3>
        <table>
          <thead>
            <tr><th>Bagian</th><th>Jumlah Soal</th><th>Fungsi Pembelajaran</th></tr>
          </thead>
          <tbody>
            <tr><td>Mini JFT-like (文字・語彙, 会話表現, 聴解, 読解)</td><td>30 Soal</td><td>Mengukur kesiapan standar ujian JFT-Basic A2</td></tr>
            <tr><td>Kanji Bab 7</td><td>10 Soal</td><td>Penguasaan membaca & makna kanji tema cuaca/kegiatan</td></tr>
            <tr><td>Kosakata Bab 7</td><td>10 Soal</td><td>Penguatan leksikal kegiatan sosial kemasyarakatan</td></tr>
            <tr><td>Terjemahan Kalimat</td><td>5 Soal</td><td>Penerapan pola kalimat pengandaian ～たら & ～場合</td></tr>
          </tbody>
        </table>

        <h3>D. Standar Kelulusan Internal LPK</h3>
        <table>
          <thead>
            <tr><th>Komponen Evaluasi</th><th>Passing Grade</th></tr>
          </thead>
          <tbody>
            <tr><td>Nilai Akhir Keseluruhan LKPD</td><td>≥ 85 (Tuntas KKM) Poin</td></tr>
            <tr><td>Bagian Mini JFT-like (4 Seksi)</td><td>≥ 85%</td></tr>
            <tr><td>Bagian Kanji & Kosakata</td><td>≥ 85 Poin</td></tr>
            <tr><td>Bagian Terjemahan</td><td>≥ 60 Poin</td></tr>
          </tbody>
        </table>

        <h3>E. Petunjuk Pengerjaan</h3>
        <ol>
          <li>Pilih masuk sebagai <strong>Peserta</strong> dan lengkapi Nama, Kelas, serta Tanggal.</li>
          <li>Guru dapat masuk ke mode <strong>Guru</strong> untuk membuka kunci jawaban dan naskah audio.</li>
          <li>Pada bagian 聴解, klik tombol <strong>Putar Audio</strong>. Audio otomatis diputar sesuai standar listening.</li>
          <li>Klik <strong>Hitung Nilai</strong> di akhir pengerjaan untuk melihat skor evaluasi dan analisis kelemahan.</li>
        </ol>
      `
    },

    /* ================= 2. MATERI ================= */
    {
      id: "materi",
      label: "Materi",
      type: "static",
      html: `
        <h2>Ringkasan Materi Bab 7</h2>

        <h3>1. Kosakata Kunci (地域のイベントと天気)</h3>
        <table>
          <thead>
            <tr><th>Bahasa Jepang</th><th>Cara Baca</th><th>Arti Bahasa Indonesia</th></tr>
          </thead>
          <tbody>
            <tr><td class="ja">掲示板</td><td class="ja">けいじばん</td><td>papan pengumuman warga</td></tr>
            <tr><td class="ja">お祭り</td><td class="ja">おまつり</td><td>festival tradisional</td></tr>
            <tr><td class="ja">行事</td><td class="ja">ぎょうじ</td><td>acara / agenda kegiatan</td></tr>
            <tr><td class="ja">参加する</td><td class="ja">さんかする</td><td>berpartisipasi / ikut serta</td></tr>
            <tr><td class="ja">ボランティア</td><td class="ja">ボランティア</td><td>kegiatan relawan / sukarelawan</td></tr>
            <tr><td class="ja">ごみ拾い</td><td class="ja">ごみひろい</td><td>memungut / membersihkan sampah</td></tr>
            <tr><td class="ja">避難訓練</td><td class="ja">ひなんくんれん</td><td>latihan evakuasi bencana (gempa/kebakaran)</td></tr>
            <tr><td class="ja">断水</td><td class="ja">だんすい</td><td>pemadaman / penghentian aliran air</td></tr>
            <tr><td class="ja">雨天</td><td class="ja">うてん</td><td>cuaca hujan / hari hujan</td></tr>
            <tr><td class="ja">延期</td><td class="ja">えんき</td><td>ditunda ke waktu lain</td></tr>
            <tr><td class="ja">中止</td><td class="ja">ちゅうし</td><td>dibatalkan</td></tr>
            <tr><td class="ja">決行</td><td class="ja">けっこう</td><td>tetap dilaksanakan (meski hujan)</td></tr>
            <tr><td class="ja">集合</td><td class="ja">しゅうごう</td><td>berkumpul di tempat yang ditentukan</td></tr>
            <tr><td class="ja">持ち物</td><td class="ja">もちもの</td><td>barang / perlengkapan bawaan</td></tr>
            <tr><td class="ja">軍手</td><td class="ja">ぐんて</td><td>sarung tangan kerja kain rajut</td></tr>
          </tbody>
        </table>

        <h3>2. Tata Bahasa Inti Bab 7</h3>

        <details open>
          <summary class="ja">① V-たら (Pengandaian / Jika... Maka...)</summary>
          <p>Digunakan untuk menyatakan suatu peristiwa atau tindakan bersyarat yang akan dilakukan setelah kondisi pertama terpenuhi.</p>
          <p class="ja">例：雨が<strong>降ったら</strong>、ホールでやります。(Jika hujan turun, kita laksanakan di aula.)</p>
          <p class="ja">例：仕事が<strong>終わったら</strong>、公園に行きましょう。(Jika pekerjaan sudah selesai, mari pergi ke taman.)</p>
        </details>

        <details>
          <summary class="ja">② N の場合（ばあい） (Dalam Kasus / Kondisi...)</summary>
          <p>Digunakan dalam bahasa formal atau pengumuman tertulis untuk menyatakan kondisi tertentu.</p>
          <p class="ja">例：雨天の<strong>場合</strong>、来週の日曜日に延期します。(Dalam hal cuaca hujan, ditunda hingga hari Minggu depan.)</p>
          <p class="ja">例：火事の<strong>場合</strong>、エレベーターを使わないでください。(Dalam kasus kebakaran, jangan gunakan lift.)</p>
        </details>

        <details>
          <summary class="ja">③ V-てもいいです／なくてもいいです (Izin & Keringanan)</summary>
          <p>Menyatakan bahwa suatu kondisi boleh terjadi atau sesuatu tidak wajib dilakukan.</p>
          <p class="ja">例：汚れてもいい服を着てきてください。(Silakan kenakan pakaian yang boleh kotor.)</p>
          <p class="ja">例：お金は払わなくてもいいです。(Tidak perlu membayar uang partisipasi.)</p>
        </details>

        <details>
          <summary class="ja">④ Istilah Khusus Cuaca pada Pengumuman Jepang</summary>
          <table>
            <thead>
              <tr><th>Istilah</th><th>Arti</th><th>Penjelasan</th></tr>
            </thead>
            <tbody>
              <tr><td class="ja">雨天中止（うてんちゅうし）</td><td>Batal jika hujan</td><td>Acara sama sekali tidak diadakan jika cuaca hujan</td></tr>
              <tr><td class="ja">雨天延期（うてんえんき）</td><td>Ditunda jika hujan</td><td>Acara digeser ke hari/minggu berikutnya</td></tr>
              <tr><td class="ja">雨天決行（うてんけっこう）</td><td>Tetap berlangsung</td><td>Acara tetap diadakan meski turun hujan (biasanya dipindah ke dalam gedung)</td></tr>
            </tbody>
          </table>
        </details>
      `
    },

    /* ================= 3. MOJI & GOI ================= */
    {
      id: "moji",
      label: "1. 文字・語彙",
      type: "questions",
      items: [
        {
          id: "q1",
          type: "mcq",
          number: "Soal 1.",
          prompt: "アパートの（　　）にお祭りの案内が貼ってありました。",
          options: ["郵便受け", "掲示板", "玄関", "ホール"],
          answer: 2
        },
        {
          id: "q2",
          type: "mcq",
          number: "Soal 2.",
          prompt: "今度の日曜日、海岸でごみ（　　）のボランティアがあります。",
          options: ["捨て", "拾い", "洗い", "焼き"],
          answer: 2
        },
        {
          id: "q3",
          type: "mcq",
          number: "Soal 3.",
          prompt: "明日は工事のために、午後1時から（　　）になります。水が出ません。",
          options: ["停電", "火事", "断水", "地震"],
          answer: 3
        },
        {
          id: "q4",
          type: "mcq",
          number: "Soal 4.",
          prompt: "雨天の（　　）、バーベキュー大会は来週に延期します。",
          options: ["とき", "場合", "あいだ", "あと"],
          answer: 2
        },
        {
          id: "q5",
          type: "mcq",
          number: "Soal 5.",
          prompt: "作業をするときは、手を保護するために（　　）をはめてください。",
          options: ["くつ下", "軍手", "タオル", "ぼうし"],
          answer: 2
        },
        {
          id: "q6",
          type: "mcq",
          number: "Soal 6.",
          prompt: "「避難訓練」の読み方はどれですか。",
          options: ["ひなんくんれん", "しなんくんれん", "ひなんれんしゅう", "しなんれんしゅう"],
          answer: 1
        },
        {
          id: "q7",
          type: "mcq",
          number: "Soal 7.",
          prompt: "「延期」の読み方はどれですか。",
          options: ["ちゅうし", "えんき", "けっこう", "さいかい"],
          answer: 2
        },
        {
          id: "q8",
          type: "mcq",
          number: "Soal 8.",
          prompt: "「中止」の意味として最も適切なのはどれですか。",
          options: ["予定どおり行うこと", "別の日に変えること", "やめること・取り消すこと", "時間を早くすること"],
          answer: 3
        },
        {
          id: "q9",
          type: "mcq",
          number: "Soal 9.",
          prompt: "「集合」の意味はどれですか。",
          options: ["1か所に集まること", "家に帰ること", "別れること", "走ること"],
          answer: 1
        },
        {
          id: "q10",
          type: "mcq",
          number: "Soal 10.",
          prompt: "「雨天決行」の意味はどれですか。",
          options: ["雨が降ったらやめる", "雨が降ってもそのまま行う", "雨が降ったら延期する", "晴れたら中止する"],
          answer: 2
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
          prompt: "同僚：「今度の日曜日の防災訓練、参加しますか。」<br>あなた：「＿＿＿。」",
          options: [
            "はい、仕事がなければ参加したいです。",
            "いいえ、訓練は中止になりました。",
            "はい、避難所ではありません。",
            "いいえ、雨が降っています。"
          ],
          answer: 1
        },
        {
          id: "q12",
          type: "mcq",
          number: "Soal 12.",
          prompt: "A：「もし雨が降ったら、お祭りはどうなりますか。」<br>B：「＿＿＿。」",
          options: [
            "雨が降ったら、ホールでやりますよ。",
            "雨が降る前に終わりました。",
            "雨は好きではありません。",
            "はい、晴れると思います。"
          ],
          answer: 1
        },
        {
          id: "q13",
          type: "mcq",
          number: "Soal 13.",
          prompt: "A：「海岸清掃の持ち物は何ですか。」<br>B：「＿＿＿。」",
          options: [
            "軍手とタオルを持ってきてください。",
            "海で泳いでもいいです。",
            "日曜日の朝9時です。",
            "駐車場に集合です。"
          ],
          answer: 1
        },
        {
          id: "q14",
          type: "mcq",
          number: "Soal 14.",
          prompt: "A：「どんな服で行けばいいですか。」<br>B：「＿＿＿。」",
          options: [
            "汚れてもいい、動きやすい服がいいですよ。",
            "スーツを着なければなりません。",
            "服は持っていきません。",
            "何も着なくてもいいです。"
          ],
          answer: 1
        },
        {
          id: "q15",
          type: "mcq",
          number: "Soal 15.",
          prompt: "A：「ごみ拾いは何時までですか。」<br>B：「＿＿＿。」",
          options: [
            "だいたい2時間ぐらいで終わりますよ。",
            "9時に始まります。",
            "やしが浜駐車場です。",
            "雨が降ったらやります。"
          ],
          answer: 1
        },
        {
          id: "q16",
          type: "mcq",
          number: "Soal 16.",
          prompt: "A：「おみこしを（　　）ことがありますか。」<br>B：「いいえ、一度もありません。やってみたいです。」",
          options: ["かついだ", "かつぐ", "かついで", "かついだら"],
          answer: 1
        },
        {
          id: "q17",
          type: "mcq",
          number: "Soal 17.",
          prompt: "A：「参加費はいくらですか。」<br>B：「無料ですから、（　　）いいですよ。」",
          options: ["払わなくても", "払っても", "払ったら", "払うので"],
          answer: 1
        },
        {
          id: "q18",
          type: "mcq",
          number: "Soal 18.",
          prompt: "掲示板に「雨天順延」と書いてありました。これはどういう意味ですか。",
          options: ["雨が降ったら中止する", "雨が降ったら次の日に延ばす", "雨でもそのままやる", "雨の日は室内でやる"],
          answer: 2
        }
      ]
    },

    /* ================= 5. CHOUKAI (LISTENING) ================= */
    {
      id: "choikai",
      label: "3. 聴解",
      type: "questions",
      items: [
        {
          id: "q19",
          type: "listening",
          number: "Soal 19.",
          prompt: "このお知らせは何のイベントについてですか。",
          options: ["お祭りのおみこし", "海岸のごみ拾いボランティア", "防災訓練", "断水のお知らせ"],
          answer: 2,
          audioUrl: "audio/Z_[07-01]_kiku1.mp3",
          script: "海岸のごみ拾いボランティアのお知らせです。やしが浜の海岸をみんなできれいにしましょう。"
        },
        {
          id: "q20",
          type: "listening",
          number: "Soal 20.",
          prompt: "雨が降った場合、イベントはどうなりますか。",
          options: ["中止になる", "次の日に延期される", "ホールの中で行われる", "予定どおり行われる"],
          answer: 2,
          audioUrl: "audio/Z_[07-02]_kiku2.mp3",
          script: "集合は土曜日の朝9時です。雨天の場合は、日曜日に延期します。"
        },
        {
          id: "q21",
          type: "listening",
          number: "Soal 21.",
          prompt: "持参しなければならないものは何ですか。",
          options: ["軍手と帽子", "傘と長靴", "お弁当と水筒", "ごみ袋とハサミ"],
          answer: 1,
          audioUrl: "audio/Z_[07-03]_kiku3.mp3",
          script: "持ち物は、軍手と帽子、それから汚れてもいい服で来てください。ごみ袋はこちらで用意します。"
        },
        {
          id: "q22",
          type: "listening",
          number: "Soal 22.",
          prompt: "男の人はお祭りに参加しますか。",
          options: ["参加する", "参加しない", "まだわからない", "午後から行く"],
          answer: 1,
          audioUrl: "audio/Z_[07-04]_kiku4.mp3",
          script: "今週末の市民祭り、一緒に行かない？ うん、いいね！おみこし担いでみたいんだ。"
        },
        {
          id: "q23",
          type: "listening",
          number: "Soal 23.",
          prompt: "雨が降ったら、どこでイベントを行いますか。",
          options: ["公園の広場", "市民ホールの室内", "小学校の体育館", "公民館の駐車場"],
          answer: 2,
          audioUrl: "audio/Z_[07-06]_kiku1.mp3",
          script: "晴れたら中央公園の広場でやりますが、雨が降ったら市民ホールの中でやります。"
        },
        {
          id: "q24",
          type: "listening",
          number: "Soal 24.",
          prompt: "会話の2人は何について話していますか。",
          options: ["断水の時間と水の準備", "避難訓練の集合場所", "お祭りの衣装", "電車の時刻表"],
          answer: 1,
          audioUrl: "audio/Z_[07-11]_kaiwa.mp3",
          script: "掲示板見た？ 明日の午後、水道の工事で水が出ないらしいよ。お風呂に水をためておこう。"
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
          passage: "【海岸清掃ボランティアのお知らせ】<br>日時：6月8日（土）午前9：00集合<br>集合場所：やしが浜駐車場<br>※作業時間は2時間程度です。<br>※雨天の場合、6月9日（日）に延期します。<br>持ち物：軍手、ぼうし、汚れてもいい服",
          image: "images/dokkai_visual_1.svg",
          prompt: "6月8日に雨が降ったら、どうなりますか。",
          options: ["中止になる", "市民ホールでやる", "6月9日に行う", "午前中だけやる"],
          answer: 3
        },
        {
          id: "q26",
          type: "mcq",
          number: "Soal 26.",
          passage: "【地域の防災訓練のお知らせ】<br>日時：10月15日（日）10:00～12:00<br>場所：第一小学校グラウンド（雨天決行：雨の場合は体育館）<br>内容：消火器の使い方、煙体験、非常食の配布<br>参加費：無料（申し込み不要です）",
          prompt: "雨が降った場合、どこで訓練をしますか。",
          options: ["グラウンド", "体育館", "公民館", "自宅"],
          answer: 2
        },
        {
          id: "q27",
          type: "mcq",
          number: "Soal 27.",
          passage: "【断水のお知らせ】<br>水道管の点検・修理工事のため、以下の時間帯に水が出なくなります。<br>日時：7月20日（木）13:00 ～ 16:00<br>対象地域：緑町1丁目～3丁目<br>※事前に飲用水や生活用水をポリタンク等に確保してください。",
          prompt: "水が出なくなるのは何時間ですか。",
          options: ["1時間", "2時間", "3時間", "4時間"],
          answer: 3
        },
        {
          id: "q28",
          type: "mcq",
          number: "Soal 28.",
          passage: "【夏祭りボランティア募集】<br>8月2日（土）の夏祭りで、かき氷と焼きそばの屋台を手伝ってくれる方を募集します。<br>時間：15:00～20:00<br>特典：Tシャツ支給、お祭りチケット1000円分プレゼント！<br>締切：7月25日までに自治会事務所へご連絡ください。",
          prompt: "ボランティアに参加すると、何がもらえますか。",
          options: ["現金5000円", "Tシャツとお祭りチケット", "かき氷機", "消火器"],
          answer: 2
        },
        {
          id: "q29",
          type: "mcq",
          number: "Soal 29.",
          passage: "田中さんへ<br>今度の日曜日のバーベキュー大会ですが、天気予報によると雨の確率が80％です。<br>雨が降ったら、駅前のレストランでの食事会に変更します。<br>集合時間は変わらず11時です。<br>よろしくお願いします。<br>山田",
          prompt: "雨が降ったら、どこで集まりますか。",
          options: ["河原のバーベキュー場", "駅前のレストラン", "田中さんの家", "会社"],
          answer: 2
        },
        {
          id: "q30",
          type: "mcq",
          number: "Soal 30.",
          passage: "【フリーマーケット出店者へのお願い】<br>当日は朝8時までに荷物を搬入してください。<br>雨天中止です。中止の場合は、当日の朝6時にホームページでお知らせします。<br>ごみは必ず各自で持ち帰ってください。",
          prompt: "中止かどうかの確認はどうやって行いますか。",
          options: ["電話で問い合わせる", "ホームページを見る", "市役所に行く", "手紙を待つ"],
          answer: 2
        }
      ]
    },

    /* ================= 7. KANJI ================= */
    {
      id: "kanji",
      label: "5. Kanji",
      type: "questions",
      items: [
        { id: "q31", type: "mcq", number: "Soal 31.", prompt: "「雨」の読み方はどれですか。", options: ["ゆき", "あめ", "かぜ", "くも"], answer: 2 },
        { id: "q32", type: "mcq", number: "Soal 32.", prompt: "「降る」の読み方はどれですか。", options: ["ふる", "のぼる", "とおる", "わたる"], answer: 1 },
        { id: "q33", type: "mcq", number: "Soal 33.", prompt: "「集合」の読み方はどれですか。", options: ["しゅうごう", "じゅうごう", "しゅうかい", "しゅうご"], answer: 1 },
        { id: "q34", type: "mcq", number: "Soal 34.", prompt: "「会場」の読み方はどれですか。", options: ["かいじょう", "えいじょう", "かいば", "かいじょ"], answer: 1 },
        { id: "q35", type: "mcq", number: "Soal 35.", prompt: "「持つ」の読み方はどれですか。", options: ["まつ", "もつ", "かつ", "たつ"], answer: 2 },
        { id: "q36", type: "mcq", number: "Soal 36.", prompt: "「参加」の読み方はどれですか。", options: ["さんか", "しんか", "さんこう", "ざんか"], answer: 1 },
        { id: "q37", type: "mcq", number: "Soal 37.", prompt: "「始まる」の読み方はどれですか。", options: ["おわる", "はじまる", "あつまる", "とまる"], answer: 2 },
        { id: "q38", type: "mcq", number: "Soal 38.", prompt: "「終わる」の読み方はどれですか。", options: ["はじまる", "おわる", "かわる", "とおる"], answer: 2 },
        { id: "q39", type: "mcq", number: "Soal 39.", prompt: "「服」の読み方はどれですか。", options: ["ふく", "ぼう", "くつ", "て"], answer: 1 },
        { id: "q40", type: "mcq", number: "Soal 40.", prompt: "「訓練」の「訓」の読み方はどれですか。", options: ["くん", "れん", "きん", "かん"], answer: 1 }
      ]
    },

    /* ================= 8. KOSAKATA ================= */
    {
      id: "kosakata",
      label: "6. Kosakata",
      type: "questions",
      items: [
        { id: "k41", type: "vocab", number: "41.", prompt: "papan pengumuman", accepted: ["掲示板", "けいじばん", "keijiban"] },
        { id: "k42", type: "vocab", number: "42.", prompt: "festival", accepted: ["お祭り", "おまつり", "祭り", "まつり", "omatsuri", "matsuri"] },
        { id: "k43", type: "vocab", number: "43.", prompt: "ikut serta / berpartisipasi", accepted: ["参加", "参加する", "さんか", "さんかする", "sanka", "sankasuru"] },
        { id: "k44", type: "vocab", number: "44.", prompt: "relawan / sukarelawan", accepted: ["ボランティア", "ぼらんてぃあ", "borantia"] },
        { id: "k45", type: "vocab", number: "45.", prompt: "memungut sampah", accepted: ["ごみ拾い", "ゴミ拾い", "ごみひろい", "gomihiroi"] },
        { id: "k46", type: "vocab", number: "46.", prompt: "pemadaman air", accepted: ["断水", "だんすい", "dansui"] },
        { id: "k47", type: "vocab", number: "47.", prompt: "sarung tangan kerja kain", accepted: ["軍手", "ぐんて", "gunte"] },
        { id: "k48", type: "vocab", number: "48.", prompt: "barang bawaan", accepted: ["持ち物", "もちもの", "mochimono"] },
        { id: "k49", type: "vocab", number: "49.", prompt: "ditunda", accepted: ["延期", "えんき", "enki"] },
        { id: "k50", type: "vocab", number: "50.", prompt: "dibatalkan", accepted: ["中止", "ちゅうし", "chuushi", "chushi"] }
      ]
    },

    /* ================= 9. TERJEMAHAN ================= */
    {
      id: "terjemahan",
      label: "7. Terjemahan",
      type: "questions",
      items: [
        {
          id: "tr1",
          type: "translation",
          number: "Soal T1.",
          prompt: "Jika turun hujan, acaranya akan dilaksanakan di dalam aula.",
          sample: "雨が降ったら、ホールでやります。"
        },
        {
          id: "tr2",
          type: "translation",
          number: "Soal T2.",
          prompt: "Dalam hal cuaca hujan, kegiatan ini akan ditunda hingga hari Minggu depan.",
          sample: "雨天の場合、来週の日曜日に延期します。"
        },
        {
          id: "tr3",
          type: "translation",
          number: "Soal T3.",
          prompt: "Silakan datang dengan mengenakan pakaian yang boleh kotor.",
          sample: "汚れてもいい服を着てきてください。"
        },
        {
          id: "tr4",
          type: "translation",
          number: "Soal T4.",
          prompt: "Jika pekerjaan sudah selesai, mari kita pergi ke festival bersama-sama.",
          sample: "仕事が終わったら、一緒にお祭りに行きましょう。"
        },
        {
          id: "tr5",
          type: "translation",
          number: "Soal T5.",
          prompt: "Karena partisipasi gratis, Anda tidak perlu membayar uang.",
          sample: "参加は無料ですから、お金は払わなくてもいいです。"
        }
      ]
    },

    /* ================= 10. BANK AUDIO ================= */
    {
      id: "bankaudio",
      label: "🎧 Bank Audio Bab 7",
      type: "audiobank",
      items: [
        { track: "07-01", file: "Z_[07-01]_kiku1.mp3", title: "聞きましょう① — ごみ拾いボランティアのお知らせ" },
        { track: "07-02", file: "Z_[07-02]_kiku2.mp3", title: "聞きましょう① — 集合と雨天延期の案内" },
        { track: "07-03", file: "Z_[07-03]_kiku3.mp3", title: "聞きましょう① — 持ち物（軍手・帽子・服装）" },
        { track: "07-04", file: "Z_[07-04]_kiku4.mp3", title: "聞きましょう① — お祭りの参加とおみこし" },
        { track: "07-05", file: "Z_[07-05]_katachi.mp3", title: "形に注目 — ～たら／～場合" },
        { track: "07-06", file: "Z_[07-06]_kiku1.mp3", title: "聞きましょう② — 雨天時の会場変更（ホール）" },
        { track: "07-07", file: "Z_[07-07]_kiku2.mp3", title: "聞きましょう② — 避難訓練の案内" },
        { track: "07-08", file: "Z_[07-08]_kiku3.mp3", title: "聞きましょう② — 断水の時間と注意" },
        { track: "07-09", file: "Z_[07-09]_kiku4.mp3", title: "聞きましょう② — 夏祭り屋台の手伝い" },
        { track: "07-10", file: "Z_[07-10]_katachi.mp3", title: "言葉の確認 — 地域のイベント語彙" },
        { track: "07-11", file: "Z_[07-11]_kaiwa.mp3", title: "会話本文 — 断水と水の準備" },
        { track: "07-12", file: "Z_[07-12]_katachi.mp3", title: "文法整理 — 条件表現 ～たら" },
        { track: "07-13", file: "Z_[07-13]_hanasu1.mp3", title: "話しましょう① — 行事への参加確認" },
        { track: "07-14", file: "Z_[07-14]_hanasu2.mp3", title: "話しましょう② — 持ち物の質問" },
        { track: "07-15", file: "Z_[07-15]_hanasu3.mp3", title: "話しましょう③ — シャドーイング練習" }
      ]
    },

    /* ================= 11. HASIL ================= */
    {
      id: "hasil",
      label: "Hasil & Umpan Balik",
      type: "result"
    },

    /* ================= 12. REFLEKSI ================= */
    {
      id: "refleksi",
      label: "Refleksi",
      type: "static",
      html: `
        <h2>Refleksi Peserta Didik Bab 7</h2>
        <p>Isilah refleksi berikut secara jujur setelah menyelesaikan seluruh bagian LKPD Bab 7.</p>

        <div class="question-card">
          <label><strong>1. Bagian mana yang paling saya kuasai pada Bab 7?</strong></label>
          <textarea id="ref1" rows="2" placeholder="Contoh: Memahami bentuk ～たら atau membaca pengumuman warga..."></textarea>
        </div>

        <div class="question-card">
          <label><strong>2. Bagian mana yang masih terasa sulit?</strong></label>
          <textarea id="ref2" rows="2" placeholder="Contoh: Soal Choukai nomor 22 atau kosakata resmi pengumuman..."></textarea>
        </div>

        <div class="question-card">
          <label><strong>3. Kosakata apa yang baru saya hafal pada bab ini?</strong></label>
          <textarea id="ref3" rows="2" placeholder="Contoh: 断水 (dansui), 軍手 (gunte), 雨天中止..."></textarea>
        </div>

        <div class="question-card">
          <label><strong>4. Kanji apa yang masih perlu saya latih penulisannya?</strong></label>
          <textarea id="ref4" rows="2" placeholder="Contoh: 降る、集合、会場..."></textarea>
        </div>

        <div class="question-card">
          <label><strong>5. Apakah saya sudah bisa memahami pengumuman jika terjadi penundaan acara karena hujan?</strong></label>
          <textarea id="ref5" rows="2" placeholder="Tuliskan pemahaman Anda tentang pola ～たら dan 雨天の場合..."></textarea>
        </div>

        <div class="question-card">
          <label><strong>6. Rencana belajar saya untuk memperkuat penguasaan materi Bab 7:</strong></label>
          <textarea id="ref6" rows="3" placeholder="Contoh: Mendengarkan ulang Bank Audio track 07-06 dan 07-11 sambil shadowing..."></textarea>
        </div>
      `
    }
  ]
};
