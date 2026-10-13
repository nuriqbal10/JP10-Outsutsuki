/*
  data-soal.js
  LKPD Bahasa Jepang Bab 3 | アレルギーがあるので、食べられないんです
  Level: A2 / Persiapan JFT-Basic / LPK
  Topik: Restoran, membaca menu, pantangan makanan/alergi, memesan, reservasi telepon, kupon
  
  PENTING: 
  - Pastikan folder 'audio/' berisi file Z_[03-01]_... s.d. Z_[03-20]_....mp3
  - Ganti teacherPasswordHash dengan hash hasil generateTeacherHash('PasswordAnda')
*/

window.LKPD_DATA = {
  settings: {
    // Hash Password Guru (PIN: sensei123 via salt lkpd_bab3::v1::)
    teacherPasswordHash: "f4eaa6d1ab64db17941a38d40801e40dd291f8495cd40620ac25156be8c152d2", 
    
    // Kunci penyimpanan unik untuk Bab 3 agar tidak tertukar dengan Bab 1 & 2
    sessionKey: "lkpd_bab3_session_v1",
    stateKey:   "lkpd_bab3_state_v1",
    
    listeningPlayCount: 2,      // Audio diputar otomatis 2x
    showListeningControls: false, // false = mode ujian (player sembunyi), true = mode latihan
    
    babId: "bab3"               // Identitas untuk routing ke Google Sheets
  },

  tabs: [
    /* ================= PANDUAN ================= */
    {
      id: "panduan",
      label: "Panduan",
      type: "static",
      html: `
        <h2>Panduan LKPD Bab 3</h2>
        <div class="note">
          LKPD ini disusun berdasarkan materi <strong>Irodori Shokyū 2 – Bab 3「アレルギーがあるので、食べられないんです」</strong>,
          diselaraskan dengan kemampuan <strong>CEFR A2 / JFT-Basic</strong>.
        </div>

        <h3>A. Tujuan Pembelajaran</h3>
        <ol>
          <li>Mampu membaca menu serta memahami nama makanan, harga, isi layanan (大盛り, おかわり自由), dsb.</li>
          <li>Mampu memberi tahu orang yang makan bersama atau pelayan restoran mengenai makanan/minuman yang tidak dapat dikonsumsi beserta alasannya.</li>
          <li>Mampu menyatakan pilihan tempat duduk atau pesanan kepada pelayan saat berada di restoran.</li>
          <li>Mampu membuat reservasi di restoran melalui telepon.</li>
          <li>Mampu menemukan informasi penting dari kupon/voucher restoran.</li>
          <li>Menguasai kosakata & kanji seputar restoran, bahan makanan, dan tata krama makan di Jepang.</li>
          <li>Menerjemahkan kalimat pendek dengan pola ～ので（alasan）, ～よね（konfirmasi）, Nで～（pilihan）, ～のはNです（penekanan）.</li>
        </ol>

        <h3>B. Can-do Statements Setara A2</h3>
        <table>
          <tr><th>No</th><th>Can-do Statement</th></tr>
          <tr><td>1</td><td>Saya dapat membaca menu restoran Jepang dan menghitung total harga pesanan.</td></tr>
          <tr><td>2</td><td>Saya dapat mengatakan “わさび抜きでお願いします” atau menjelaskan alasan alergi/pantangan agama.</td></tr>
          <tr><td>3</td><td>Saya dapat memilih meja/tatami dan memesan porsi nasi (大盛り/普通) kepada pelayan.</td></tr>
          <tr><td>4</td><td>Saya dapat menelepon restoran untuk reservasi (tanggal, jam, jumlah orang, nama).</td></tr>
          <tr><td>5</td><td>Saya dapat memahami syarat dan masa berlaku sebuah kupon diskon restoran.</td></tr>
        </table>

        <h3>C. Struktur Asesmen</h3>
        <table>
          <tr><th>Bagian</th><th>Jumlah</th><th>Fungsi</th></tr>
          <tr><td>Mini JFT-like (文字・語彙, 会話表現, 聴解, 読解)</td><td>30 soal</td><td>Kesiapan format JFT-Basic</td></tr>
          <tr><td>Kanji</td><td>10 soal</td><td>Pendukung 文字・語彙</td></tr>
          <tr><td>Kosakata</td><td>10 soal</td><td>Pendukung ungkapan Bab 3</td></tr>
          <tr><td>Terjemahan</td><td>5 soal</td><td>Penguatan pola kalimat Bab 3</td></tr>
          <tr><td>Bank Audio</td><td>20 track</td><td>Latihan/shadowing mandiri</td></tr>
        </table>

        <h3>D. Standar Kelulusan Internal LPK</h3>
        <table>
          <tr><th>Kriteria</th><th>Standar</th></tr>
          <tr><td>Nilai Akhir Bab</td><td>≥ 75</td></tr>
          <tr><td>Ujian Bab / Mini JFT-like</td><td>≥ 70</td></tr>
          <tr><td>Kanji</td><td>≥ 70</td></tr>
          <tr><td>Kosakata</td><td>≥ 70</td></tr>
          <tr><td>Terjemahan</td><td>≥ 60</td></tr>
          <tr><td>Minimum per section JFT-like</td><td>≥ 60%</td></tr>
        </table>

        <div class="warning">
          <strong>Penting:</strong> Skor kesiapan JFT-Basic hanya dihitung dari 4 section resmi.
          Kanji, Kosakata, Terjemahan adalah komponen pendukung LPK.
        </div>
      `
    },

    /* ================= MATERI ================= */
    {
      id: "materi",
      label: "Materi",
      type: "static",
      html: `
        <h2>Ringkasan Materi Bab 3「アレルギーがあるので、食べられないんです」</h2>

        <h3>1. Kosakata Penting — Menu & Istilah Restoran</h3>
        <table>
          <tr><th>Bahasa Jepang</th><th>Bacaan</th><th>Arti</th></tr>
          <tr><td class="ja">定食</td><td class="ja">ていしょく</td><td>menu paket (nasi + sup + lauk)</td></tr>
          <tr><td class="ja">日替わり</td><td class="ja">ひがわり</td><td>menu ganti tiap hari</td></tr>
          <tr><td class="ja">大盛り</td><td class="ja">おおもり</td><td>porsi besar (+50 yen biasanya)</td></tr>
          <tr><td class="ja">おかわり自由</td><td class="ja">—</td><td>tambah sepuasnya (gratis)</td></tr>
          <tr><td class="ja">平日のみ</td><td class="ja">へいじつのみ</td><td>hanya hari kerja (Senin–Jumat)</td></tr>
          <tr><td class="ja">カウンター</td><td class="ja">—</td><td>kursi konter/bar</td></tr>
          <tr><td class="ja">座敷</td><td class="ja">ざしき</td><td>ruang tatami (duduk di lantai)</td></tr>
          <tr><td class="ja">禁煙</td><td class="ja">きんえん</td><td>bebas asap rokok</td></tr>
          <tr><td class="ja">会計／レジ</td><td class="ja">かいけい</td><td>kasir / pembayaran</td></tr>
          <tr><td class="ja">クーポン</td><td class="ja">—</td><td>voucher/kupon</td></tr>
          <tr><td class="ja">有効期限</td><td class="ja">ゆうこうきげん</td><td>masa berlaku kupon</td></tr>
          <tr><td class="ja">半額</td><td class="ja">はんがく</td><td>setengah harga</td></tr>
        </table>

        <h3>2. Kosakata Penting — Bahan Makanan & Pantangan</h3>
        <table>
          <tr><th>Bahasa Jepang</th><th>Arti</th></tr>
          <tr><td class="ja">肉（豚肉・牛肉）</td><td>daging (babi/sapi)</td></tr>
          <tr><td class="ja">魚／生の魚</td><td>ikan / ikan mentah</td></tr>
          <tr><td class="ja">エビ・カニ</td><td>udang · kepiting</td></tr>
          <tr><td class="ja">卵</td><td>telur</td></tr>
          <tr><td class="ja">ナッツ</td><td>kacang-kacangan</td></tr>
          <tr><td class="ja">わさび</td><td>sambal Jepang (pedas menusuk hidung)</td></tr>
          <tr><td class="ja">ねぎ</td><td>daun bawang</td></tr>
          <tr><td class="ja">みりん</td><td>bumbu masak manis (alkohol beras)</td></tr>
          <tr><td class="ja">牛乳</td><td>susu sapi</td></tr>
          <tr><td class="ja">お酒</td><td>alkohol</td></tr>
          <tr><td class="ja">ベジタリアン</td><td>vegetarian</td></tr>
          <tr><td class="ja">アレルギー</td><td>alergi</td></tr>
          <tr><td class="ja">宗教上の理由</td><td>alasan agama</td></tr>
          <tr><td class="ja">苦手</td><td>tidak suka / tidak bisa makan</td></tr>
          <tr><td class="ja">抜き</td><td>tanpa ~ (例: わさび抜き)</td></tr>
        </table>

        <h3>3. Tata Bahasa Utama Bab 3</h3>

        <details open>
          <summary class="ja">① S1 ので、S2 (menyatakan alasan halus)</summary>
          <p>Alasan pribadi/penolakan lebih sopan pakai 「ので」 daripada 「から」.</p>
          <p class="ja">例：ベジタリアンなので、肉とか魚はだめなんです。</p>
          <p class="ja">例：今日は自転車で来たので、飲めないんです。</p>
          <p class="ja">例：アレルギーがあるので、食べられないんです。</p>
        </details>

        <details>
          <summary class="ja">② S よね？ (konfirmasi dugaan)</summary>
          <p>Pembicara menduga sesuatu benar, lalu mengonfirmasi ke lawan bicara.</p>
          <p class="ja">例：おすし、わさび、入ってますよね。（= seharusnya ada wasabi kan ya?）</p>
          <p class="ja">例：定食のご飯は、おかわりできますよね。</p>
        </details>

        <details>
          <summary class="ja">③ N で～（menyatakan pilihan）</summary>
          <p>Menjawab pertanyaan pilihan (meja/tatami, porsi, dll.) dengan partikel で.</p>
          <p class="ja">例：テーブルでお願いします。</p>
          <p class="ja">例：普通で大丈夫です。 / じゃあ、それで。</p>
        </details>

        <details>
          <summary class="ja">④ ～のは、N です (menyoroti info baru)</summary>
          <p>Penjelasan diletakkan sebelum ～のは, lalu N sebagai jawaban/fokus baru.</p>
          <p class="ja">例：人気があるのは、お刺身定食です。</p>
          <p class="ja">例：この店でおいしいのは、親子丼ですよ。</p>
        </details>

        <details>
          <summary class="ja">⑤ Ungkapan Pelayan (Keigo sederhana)</summary>
          <table>
            <tr><th>Pelayan bilang</th><th>Arti</th></tr>
            <tr><td class="ja">ご注文、お決まりですか？</td><td>Sudah siap pesan?</td></tr>
            <tr><td class="ja">ご飯の量は、どうなさいますか？</td><td>Porsinya mau bagaimana?</td></tr>
            <tr><td class="ja">いつお持ちしますか？</td><td>Minumannya kapan disajikan?</td></tr>
            <tr><td class="ja">以上でよろしいですか？</td><td>Sudah semuanya?</td></tr>
            <tr><td class="ja">ご一緒でよろしいですか？</td><td>Dibayar bareng/sekaligus?</td></tr>
          </table>
        </details>
      `
    },

    /* ================= 1. 文字・語彙 ================= */
    {
      id: "moji",
      label: "1. 文字・語彙",
      type: "questions",
      items: [
        {
          id: "q1", type: "mcq", number: "Soal 1.",
          prompt: "定食には、（   ）とみそ汁がつきます。",
          options: ["パン", "ごはん", "パスタ", "サラダ"],
          answer: 2
        },
        {
          id: "q2", type: "mcq", number: "Soal 2.",
          prompt: "「日替わり」の意味はどれですか。",
          options: ["毎週変わる", "毎日メニューが変わる", "土日だけ使える", "予約が必要"],
          answer: 2
        },
        {
          id: "q3", type: "mcq", number: "Soal 3.",
          prompt: "ごはん大盛りにすると、（   ）円かかります。",
          options: ["０", "５０", "１５０", "４８０"],
          answer: 2
        },
        {
          id: "q4", type: "mcq", number: "Soal 4.",
          prompt: "「わさび抜き」で注文するとき、何が入っていませんか。",
          options: ["しょうゆ", "わさび", "のり", "ごはん"],
          answer: 2
        },
        {
          id: "q5", type: "mcq", number: "Soal 5.",
          prompt: "「アレルギーがあるので、食べられないんです。」ここで「アレルギー」の意味はどれですか。",
          options: ["suka banget", "tubuh menolak bahan tertentu", "diet", "lapar parah"],
          answer: 2
        },
        {
          id: "q6", type: "mcq", number: "Soal 6.",
          prompt: "レストランの「カウンター」はどこですか。",
          options: ["ruang tatami", "kursi menghadap dapur/meja panjang", "kasir", "toilet"],
          answer: 2
        },
        {
          id: "q7", type: "mcq", number: "Soal 7.",
          prompt: "「会計」の読み方はどれですか。",
          options: ["かいけい", "あかい", "ぞうけい", "ろけい"],
          answer: 1
        },
        {
          id: "q8", type: "mcq", number: "Soal 8.",
          prompt: "クーポンの「有効期限」は何を表していますか。",
          options: ["harga kupon", "batas waktu kupon bisa dipakai", "nama restoran", "jumlah orang"],
          answer: 2
        },
        {
          id: "q9", type: "mcq", number: "Soal 9.",
          prompt: "「ベジタリアン」という人の食事はどれですか。",
          options: ["肉と魚を食べる", "野菜中心で肉や魚を食べない", " hanya minum susu", "makan semua tanpa aturan"],
          answer: 2
        },
        {
          id: "q10", type: "mcq", number: "Soal 10.",
          prompt: "「おかわり自由」の意味として最も適切なのはどれですか。",
          options: ["harus bayar lagi setiap tambah", "boleh minta tambah berkali-kali gratis", "tidak boleh tambah", "hanya sekali sehari"],
          answer: 2
        }
      ]
    },

    /* ================= 2. 会話表現 ================= */
    {
      id: "kaiwa",
      label: "2. 会話表現",
      type: "questions",
      items: [
        {
          id: "q11", type: "mcq", number: "Soal 11.",
          prompt: "店員：「お客様、何名様ですか。」<br>あなた：「＿＿＿。」",
          options: [
            "はい、大丈夫です。",
            "２人です。",
            "テーブルでお願いします。",
            "お会計をお願いします。"
          ],
          answer: 2
        },
        {
          id: "q12", type: "mcq", number: "Soal 12.",
          prompt: "店員：「テーブルと座敷がございますが……。」<br>あなた：「＿＿＿。」",
          options: [
            "いいえ、結構です。",
            "テーブルでお願いします。",
            "２人です。",
            "おすすめです。"
          ],
          answer: 2
        },
        {
          id: "q13", type: "mcq", number: "Soal 13.",
          prompt: "友達：「ここのお刺身、おいしいよ。どう？」<br>あなた：「すみません。私、ベジタリアン＿＿＿、肉とか魚はだめなんです。」",
          options: ["から", "ので", "けど", "ても"],
          answer: 2
        },
        {
          id: "q14", type: "mcq", number: "Soal 14.",
          prompt: "店員：「おすすめは何ですか。」<br>店員：「そうですね……人気がある＿＿＿、お刺身定食です。」",
          options: ["のは", "こと", "もの", "ため"],
          answer: 1
        },
        {
          id: "q15", type: "mcq", number: "Soal 15.",
          prompt: "Ａ：「おすし、わさび、入ってます＿＿＿。」<br>Ｂ：「あ、わさび抜きもできますよ。」",
          options: ["かな", "でしょう", "よね", "はず"],
          answer: 3
        },
        {
          id: "q16", type: "mcq", number: "Soal 16.",
          prompt: "店員：「ご注文、お決まりですか。」<br>あなた：「あのー、おすすめは何ですか。」<br>店員：「ミックスフライ定食はいかがでしょうか。」<br>あなた：「じゃあ、＿＿＿。」",
          options: ["それで行きます", "それで", "そうです", "わかりました"],
          answer: 2
        },
        {
          id: "q17", type: "mcq", number: "Soal 17.",
          prompt: "店員：「ご飯の量は、どうなさいますか。」<br>あなた：「＿＿＿。」",
          options: [
            "はい、そうです。",
            "普通で大丈夫です。",
            "２人です。",
            "ありがとうございます。"
          ],
          answer: 2
        },
        {
          id: "q18", type: "mcq", number: "Soal 18.",
          prompt: "石井：「お会計、お願いします。」<br>店員：「ご一緒でよろしいですか。」<br>シハー：「＿＿＿。」",
          options: [
            "はい、結構です。",
            "別々でお願いします。",
            "テーブルでお願いします。",
            "先にお願いします。"
          ],
          answer: 2
        }
      ]
    },

    /* ================= 3. 聴解 (sinkron audio asli) ================= */
    {
      id: "choikai",
      label: "3. 聴解",
      type: "questions",
      items: [
        {
          id: "q19", type: "listening", number: "Soal 19.",
          prompt: "女の人は何が食べられませんか。",
          options: ["わさび", "肉と魚", "エビ", "卵"],
          answer: 2,
          audioUrl: "audio/Z_[03-03]_kiku1.mp3",
          script: "Ａ：何食べる？ ここのお刺身、おいしいよ。Ｂ：私、ベジタリアンなので、肉とか魚はだめなんです。Ａ：じゃあ、豆腐料理は大丈夫？ Ｂ：はい、大丈夫です。"
        },
        {
          id: "q20", type: "listening", number: "Soal 20.",
          prompt: "男の人はなぜビールを飲みませんか。",
          options: [
            "啤酒が好きではない",
            "今日は自転車で来たから",
            "アレルギーがあるから",
            "宗教上の理由で"
          ],
          answer: 2,
          audioUrl: "audio/Z_[03-04]_kiku2.mp3",
          script: "Ａ：じゃあ、先に飲み物、注文しましょう。ビールでいいですか？ Ｂ：あの、今日は自転車で来たので、飲めないんです。Ａ：そっかそっか。ソフトドリンクのメニューはここですよ。Ｂ：そうですね……。じゃあ、ウーロン茶、お願いします。"
        },
        {
          id: "q21", type: "listening", number: "Soal 21.",
          prompt: "女の人は何が食べられませんか。その理由はなんですか。",
          options: [
            "エビ／苦手だから",
            "エビ／アレルギーがあるから",
            "カニ／ベジタリアンだから",
            "卵／宗教上の理由で"
          ],
          answer: 2,
          audioUrl: "audio/Z_[03-05]_kiku3.mp3",
          script: "Ａ：あれ？ エビ、食べないんですか？ Ｂ：あ……はい。アレルギーがあるので、食べられないんです。よかったら、どうぞ。Ａ：そうですか。ほかの料理は大丈夫ですか？ Ｂ：ええ。おいしいです。"
        },
        {
          id: "q22", type: "listening", number: "Soal 22.",
          prompt: "客はどうお願いしましたか。",
          options: [
            "わさびをたくさん入れてほしい",
            "わさび抜きにしてほしい",
            "お寿司をやめてほしい",
            "別の料理に変えてほしい"
          ],
          answer: 2,
          audioUrl: "audio/Z_[03-06]_kiku4.mp3",
          script: "Ａ：すみません、おすし、わさび、入ってますよね。苦手なんです。Ｂ：あ、わさび抜きもできますよ。Ａ：じゃあ、わさび抜きでお願いします。Ｂ：かしこまりました。"
        },
        {
          id: "q23", type: "listening", number: "Soal 23.",
          prompt: "客はなぜ豚肉を入れてはいけないと言いましたか。",
          options: ["苦手だから", "アレルギーがあるから", "宗教上の理由で", "ベジタリアンだから"],
          answer: 3,
          audioUrl: "audio/Z_[03-07]_kiku5.mp3",
          script: "Ａ：あの、お好み焼きに豚肉、入ってますか？ Ｂ：はい。Ａ：すみませんが、宗教上の理由で食べられないので、入れないでください。Ｂ：わかりました。"
        },
        {
          id: "q24", type: "listening", number: "Soal 24.",
          prompt: "石井さんは何を注文しましたか。",
          options: [
            "ミックスフライ定食・ご飯大盛り",
            "お刺身定食・ご飯大盛り",
            "お刺身定食・ご飯普通",
            "焼き魚定食・アイスコーヒー"
          ],
          answer: 2,
          audioUrl: "audio/Z_[03-14]_kaiwa.mp3",
          script: "店員：ご注文、お決まりですか？ 石井：あのー、おすすめは何ですか？ 店員：そうですね……人気があるのは、お刺身定食です。石井：じゃあ、それにします。ご飯大盛りにできますか？ 店員：はい。お刺身定食、ご飯大盛りですね？ 石井：はい。 シハー：私は生の魚が苦手なんですが……ほかに何がありますか？ 店員：そうですねえ、フライなどはいかがですか？ ミックスフライ定食がおすすめです。シハー：じゃあ、それで。店員：ご飯の量は、どうなさいますか？ シハー：普通で大丈夫です。あと、アイスコーヒーもお願いします。店員：いつお持ちしますか？ シハー：先にお願いします。店員：はい。ミックスフライ定食、ご飯普通、アイスコーヒーを先に。以上でよろしいですか？ 石井・シハー：はい。"
        }
      ]
    },

    /* ================= 4. 読解 ================= */
    {
      id: "dokkai",
      label: "4. 読解",
      type: "questions",
      items: [
        {
          id: "q25", type: "mcq", number: "Soal 25.",
          passage: "【メニュー】<br>カレーライス ¥480 ／ ラーメン ¥480<br>かつ丼 ¥630 ／ 親子丼 ¥580<br>うどん ¥450 ／ そば ¥450<br>・定食にはごはんとみそ汁がつきます。<br>・ごはん大盛り ＋50円<br>・みそ汁 おかわり自由（平日のみ）<br>・食後のお飲み物 150円（コーヒー・紅茶 ホット/アイス）",
          prompt: "平日に、親子丼（¥580）＋ごはん大盛り（＋50円）＋食後のコーヒー（150円）を注文すると、いくらになりますか。",
          options: ["¥730", "¥780", "¥830", "¥980"],
          answer: 2
        },
        {
          id: "q26", type: "mcq", number: "Soal 26.",
          passage: "同じメニューを見て：<br>土曜日にみそ汁をおかわりしようとしたら、店員は何と言う可能性が高いですか。",
          prompt: "みそ汁のおかわりができる条件はどれですか。",
          options: ["いつでも自由", "平日のみ", "定食のみ", "大盛りを頼んだ人だけ"],
          answer: 2
        },
        {
          id: "q27", type: "mcq", number: "Soal 27.",
          passage: "【クーポン券】<br>本レストランにてご利用いただけます。<br>お一人様一回限り。<br>他の割引との併用はできません。<br>有効期限：２０２６年１２月３１日まで<br>提示方法：会計時にスタッフへご提示ください。",
          prompt: "このクーポンについて正しいものはどれですか。",
          options: [
            "どの店でも使える",
            "何度も繰り返し使える",
            "他の割引と一緒に使える",
            "会計の時に見せる必要がある"
          ],
          answer: 4
        },
        {
          id: "q28", type: "mcq", number: "Soal 28.",
          passage: "ナットさんの予約メモ：<br>店名：レストランきりん<br>日時：来週の水曜日（９日）１９時<br>人数：６人<br>名前：ナット<br>電話：090-1234-5678",
          prompt: "店の人が最後に確認した内容として正しい組み合わせはどれですか。",
          options: [
            "火曜日・５人・ナイトウ",
            "水曜日・６人・ナット",
            "木曜日・６人・ナット",
            "水曜日・７人・ナット"
          ],
          answer: 2
        },
        {
          id: "q29", type: "mcq", number: "Soal 29.",
          passage: "ナットさんが名前を説明するとき、「カタカナで、『なにぬねの』のナ、小さいツ、『たちつてと』のトです」と言いました。",
          prompt: "この説明から分かる「ナット」の正しい表記はどれですか。",
          options: ["なっと", "ナット", "ナイト", "ナウト"],
          answer: 2
        },
        {
          id: "q30", type: "mcq", number: "Soal 30.",
          passage: "和食レストランでのマナー：<br>・入口で人数と禁煙かどうか、テーブルか座敷かを聞かれます。<br>・注文後、店員が「以上でよろしいですか」と確認します。<br>・会計はレジまたはテーブルで行います。<br>・複数人の場合、「ご一緒」か「別々」かを聞かれます。<br>※日本ではチップの習慣はありません。",
          prompt: "この記事について、正しいものはどれですか。",
          options: [
            "必ずレジで払わなければならない",
            "日本では食事の後にお金を置くのが礼儀である",
            "支払いは一緒にするか別々にするかを選べる",
            "座席の種類は選べない"
          ],
          answer: 3
        }
      ]
    },

    /* ================= 5. Kanji ================= */
    {
      id: "kanji",
      label: "5. Kanji",
      type: "questions",
      items: [
        { id: "q31", type: "mcq", number: "Soal 31.", prompt: "「注」を含む「注文」の読み方はどれですか。", options: ["ちゅうもん", "しゅもん", "つうもん", "じゅうもん"], answer: 1 },
        { id: "q32", type: "mcq", number: "Soal 32.", prompt: "「会」を含む「会計」の読み方はどれですか。", options: ["かいけい", "あいせい", "かいせい", "あいてい"], answer: 1 },
        { id: "q33", type: "mcq", number: "Soal 33.", prompt: "「予」を含む「予約」の読み方はどれですか。", options: ["よやく", "よわく", "よやぐ", "ゆやく"], answer: 1 },
        { id: "q34", type: "mcq", number: "Soal 34.", prompt: "「禁」を含む「禁煙」の意味はどれですか。", options: ["boleh merokok", "dilarang merokok", "zona merokok", "rokok gratis"], answer: 2 },
        { id: "q35", type: "mcq", number: "Soal 35.", prompt: "「自」を含む「自由」の読み方はどれですか。", options: ["じゆう", "じゆ", "しゆう", "ずゆう"], answer: 1 },
        { id: "q36", type: "mcq", number: "Soal 36.", prompt: "「生」を含む「生の魚」の「生」の読み方はどれですか。", options: ["せい", "なま", "いき", "しょう"], answer: 2 },
        { id: "q37", type: "mcq", number: "Soal 37.", prompt: "「牛」を含む「牛乳」の読み方はどれですか。", options: ["ぎゅうにゅう", "うしちち", "ぎゅうあめ", "こうにゅう"], answer: 1 },
        { id: "q38", type: "mcq", number: "Soal 38.", prompt: "「電」を含む「電話番号」の読み方はどれですか。", options: ["でんわばんごう", "でんぱばんごう", "てんわばんごう", "でんわばんこう"], answer: 1 },
        { id: "q39", type: "mcq", number: "Soal 39.", prompt: "「样」(様) を含む「お客様」の読み方はどれですか。", options: ["おきゃくさま", "おきゃくさん", "かたさま", "きゃくど"], answer: 1 },
        { id: "q40", type: "mcq", number: "Soal 40.", prompt: "「理」を含む「理由」の読み方はどれですか。", options: ["りゆう", "りそう", "りじ", "わけ"], answer: 1 }
      ]
    },

    /* ================= 6. Kosakata ================= */
    {
      id: "kosakata",
      label: "6. Kosakata",
      type: "questions",
      items: [
        { id: "k41", type: "vocab", number: "41.", prompt: "menu paket", accepted: ["定食", "ていしょく", "teishoku"] },
        { id: "k42", type: "vocab", number: "42.", prompt: "porsi besar", accepted: ["大盛り", "おおもり", "oomori", "omori"] },
        { id: "k43", type: "vocab", number: "43.", prompt: "tambah sepuasnya", accepted: ["おかわり自由", "おかわりじゆう", "okawari jiyuu"] },
        { id: "k44", type: "vocab", number: "44.", prompt: "ruang tatami", accepted: ["座敷", "ざしき", "zashiki"] },
        { id: "k45", type: "vocab", number: "45.", prompt: "kasir / pembayaran", accepted: ["会計", "かいけい", "kaikei", "レジ", "reji"] },
        { id: "k46", type: "vocab", number: "46.", prompt: "reservasi", accepted: ["予約", "よやく", "yoyaku"] },
        { id: "k47", type: "vocab", number: "47.", prompt: "voucher/kupon", accepted: ["クーポン", "kuupon", "kuppn", "kupon"] },
        { id: "k48", type: "vocab", number: "48.", prompt: "tanpa wasabi", accepted: ["わさび抜き", "wasabi nuki", "sabihinuki", "サビ抜き"] },
        { id: "k49", type: "vocab", number: "49.", prompt: "tidak suka / tidak bisa makan", accepted: ["苦手", "にがて", "nigate"] },
        { id: "k50", type: "vocab", number: "50.", prompt: "alasan", accepted: ["理由", "りゆう", "riyuu", "riyu"] }
      ]
    },

    /* ================= 7. Terjemahan ================= */
    {
      id: "terjemahan",
      label: "7. Terjemahan",
      type: "questions",
      items: [
        {
          id: "tr1", type: "translation", number: "Soal T1.",
          prompt: "Saya vegetarian, jadi daging dan ikan tidak bisa saya makan.",
          sample: "ベジタリアンなので、肉とか魚はだめなんです。"
        },
        {
          id: "tr2", type: "translation", number: "Soal T2.",
          prompt: "Permisi, sushi-nya pakai wasabi, kan ya? Saya tidak bisa makan itu.",
          sample: "すみません、おすし、わさび、入ってますよね。苦手なんです。"
        },
        {
          id: "tr3", type: "translation", number: "Soal T3.",
          prompt: "Tolong buatkan tanpa wasabi.",
          sample: "わさび抜きでお願いします。"
        },
        {
          id: "tr4", type: "translation", number: "Soal T4.",
          prompt: "Menu yang paling populer adalah sashimi teishoku.",
          sample: "人気があるのは、お刺身定食です。"
        },
        {
          id: "tr5", type: "translation", number: "Soal T5.",
          prompt: "Saya ingin melakukan reservasi untuk hari Rabu tanggal 9 pukul 7 malam, 6 orang.",
          sample: "来週の水曜日（９日）、１９時に６人で予約したいんですけど。"
        }
      ]
    },

    /* ================= BANK AUDIO ================= */
    {
      id: "bankaudio",
      label: "🎧 Bank Audio Bab 3",
      type: "audiobank",
      items: [
        { track: "03-01", file: "Z_[03-01]_kotoba1.mp3", title: "ことばの準備 — a–k (bahan makanan & pantangan)" },
        { track: "03-02", file: "Z_[03-02]_kotoba2.mp3", title: "ことばの準備 (memilih a–k sambil mendengar)" },
        { track: "03-03", file: "Z_[03-03]_kiku1.mp3", title: "聞きましょう① — ベジタリアン（肉と魚だめ）" },
        { track: "03-04", file: "Z_[03-04]_kiku2.mp3", title: "聞きましょう① — 自転車で来たので飲めない" },
        { track: "03-05", file: "Z_[03-05]_kiku3.mp3", title: "聞きましょう① — エビアレルギー" },
        { track: "03-06", file: "Z_[03-06]_kiku4.mp3", title: "聞きましょう① — わさび苦手→抜き" },
        { track: "03-07", file: "Z_[03-07]_kiku5.mp3", title: "聞きましょう① — 宗教上の理由で豚肉NG" },
        { track: "03-08", file: "Z_[03-08]_katachi.mp3", title: "形に注目 — ～ので / ～よね" },
        { track: "03-09", file: "Z_[03-09]_hanasu1-1.mp3", title: "話しましょう①-1 — menolak tawaran teman" },
        { track: "03-10", file: "Z_[03-10]_hanasu1-2.mp3", title: "話しましょう①-2 — melanjutkan role play" },
        { track: "03-11", file: "Z_[03-11]_hanasu2-1.mp3", title: "話しましょう②-1 — meminta tanpa bahan tertentu" },
        { track: "03-12", file: "Z_[03-12]_hanasu2-2.mp3", title: "話しましょう②-2 — melanjutkan role play" },
        { track: "03-13", file: "Z_[03-13]_kotoba.mp3", title: "ことばの準備 — interior restoran (counter/zashiki/reji/kin'en)" },
        { track: "03-14", file: "Z_[03-14]_kaiwa.mp3", title: "聞きましょう（本文）— Siha & Ishii pesan di restoran" },
        { track: "03-15", file: "Z_[03-15]_katachi.mp3", title: "形に注目 — Nで～ / ～のはNです" },
        { track: "03-16", file: "Z_[03-16]_hanasu1.mp3", title: "話しましょう① — masuk restoran & pilih kursi" },
        { track: "03-17", file: "Z_[03-17]_hanasu2.mp3", title: "話しましょう② — memesan makanan" },
        { track: "03-18", file: "Z_[03-18]_hanasu3.mp3", title: "話しましょう③ — membayar di kasir" },
        { track: "03-19", file: "Z_[03-19]_kaiwa.mp3", title: "聞きましょう（本文）— Nat reservasi telepon" },
        { track: "03-20", file: "Z_[03-20]_hanasu.mp3", title: "話しましょう — role play reservasi telepon" }
      ]
    },

    /* ================= HASIL ================= */
    { id: "hasil", label: "Hasil & Umpan Balik", type: "result" },

    /* ================= REFLEKSI ================= */
    {
      id: "refleksi",
      label: "Refleksi",
      type: "static",
      html: `
        <h2>Refleksi Peserta Didik</h2>
        <div class="question-card"><label><strong>1. Bagian mana yang paling saya kuasai?</strong></label><textarea id="ref1" rows="2"></textarea></div>
        <div class="question-card"><label><strong>2. Bagian mana yang masih sulit?</strong></label><textarea id="ref2" rows="2"></textarea></div>
        <div class="question-card"><label><strong>3. Kosakata restoran apa yang belum saya hafal?</strong></label><textarea id="ref3" rows="2"></textarea></div>
        <div class="question-card"><label><strong>4. Bagaimana cara saya menolak makanan dengan sopan dalam bahasa Jepang?</strong></label><textarea id="ref4" rows="2"></textarea></div>
        <div class="question-card"><label><strong>5. Pola kalimat apa yang masih sering salah? (～ので / ～よね / Nで / ～のは)</strong></label><textarea id="ref5" rows="2"></textarea></div>
        <div class="question-card"><label><strong>6. Apa yang akan saya lakukan untuk memperbaiki kelemahan saya?</strong></label><textarea id="ref6" rows="3"></textarea></div>
      `
    }
  ]
};