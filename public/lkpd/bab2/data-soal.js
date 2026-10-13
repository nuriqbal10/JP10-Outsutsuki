/*
  data-soal.js
  LKPD Bahasa Jepang Bab 2 | まじめそうな人ですね
  Level: A2 / Persiapan JFT-Basic / LPK
  Topik: ciri fisik orang, sifat/appearance, selebriti favorit, wawancara tokoh
*/

window.LKPD_DATA = {
  settings: {
    teacherPasswordHash: "08539cbdb6a79e9777f9b0fc249078f1890a2492047011a0626eb1c416e7aada",          // tempel hash dari generateTeacherHash('PasswordAnda')
    sessionKey: "lkpd_bab2_session_v1",
    stateKey:   "lkpd_bab2_state_v1",
    listeningPlayCount: 2,
    showListeningControls: false,      // true untuk latihan bebas; false untuk mini test
    babId: "bab2" 
  },

  tabs: [
    /* ================= PANDUAN ================= */
    {
      id: "panduan",
      label: "Panduan",
      type: "static",
      html: `
        <h2>Panduan LKPD Bab 2</h2>
        <div class="note">
          LKPD ini disusun berdasarkan materi <strong>Irodori Shokyū 2 – Bab 2「まじめそうな人ですね」</strong>,
          diselaraskan dengan kemampuan <strong>CEFR A2 / JFT-Basic</strong>.
        </div>

        <h3>A. Tujuan Pembelajaran</h3>
        <ol>
          <li>Memahami dan menggunakan ungkapan untuk mencari/mengidentifikasi seseorang berdasarkan ciri fisik.</li>
          <li>Mampu menjelaskan penampilan atau karakter orang yang sedang tidak berada di tempat.</li>
          <li>Memahami percakapan tentang penyanyi/aktor favorit beserta alasan menyukainya.</li>
          <li>Membaca artikel wawancara sederhana tentang perkenalan seseorang.</li>
          <li>Menguasai kosakata & kanji ciri fisik, pakaian, warna, dan kata sifat kepribadian Bab 2.</li>
          <li>Menerjemahkan kalimat pendek dengan pola ～ている＋人、N1はN2が～です、～そうです、～し、～。</li>
        </ol>

        <h3>B. Can-do Statements Setara A2</h3>
        <table>
          <tr><th>No</th><th>Can-do Statement</th></tr>
          <tr><td>1</td><td>Saya dapat bertanya “どの人ですか？” dan menjawab dengan ciri fisik/pakaian.</td></tr>
          <tr><td>2</td><td>Saya dapat menjelaskan seseorang yang ada di foto atau yang tidak hadir (“見た目は…だけど、本当は…”).</td></tr>
          <tr><td>3</td><td>Saya dapat menyatakan kesan terhadap penampilan seseorang (“～そうですね”).</td></tr>
          <tr><td>4</td><td>Saya dapat menyebutkan alasan menyukai artis favorit (“～だし、～です”).</td></tr>
          <tr><td>5</td><td>Saya dapat memahami artikel wawancara sederhana tentang seorang tokoh.</td></tr>
        </table>

        <h3>C. Struktur Asesmen</h3>
        <table>
          <tr><th>Bagian</th><th>Jumlah</th><th>Fungsi</th></tr>
          <tr><td>Mini JFT-like (文字・語彙, 会話表現, 聴解, 読解)</td><td>30 soal</td><td>Kesiapan format JFT-Basic</td></tr>
          <tr><td>Kanji</td><td>10 soal</td><td>Pendukung 文字・語彙</td></tr>
          <tr><td>Kosakata</td><td>10 soal</td><td>Pendukung ungkapan Bab 2</td></tr>
          <tr><td>Terjemahan</td><td>5 soal</td><td>Penguatan pola kalimat Bab 2</td></tr>
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
        <h2>Ringkasan Materi Bab 2「まじめそうな人ですね」</h2>

        <h3>1. Kosakata Penting — Ciri Fisik & Pakaian</h3>
        <table>
          <tr><th>Bahasa Jepang</th><th>Bacaan</th><th>Arti</th></tr>
          <tr><td class="ja">髪が長い</td><td class="ja">かみがながい</td><td>rambut panjang</td></tr>
          <tr><td class="ja">髪が短い</td><td class="ja">かみがみじかい</td><td>rambut pendek</td></tr>
          <tr><td class="ja">背が高い</td><td class="ja">せがたかい</td><td>tubuh tinggi</td></tr>
          <tr><td class="ja">座っている</td><td class="ja">すわっている</td><td>duduk</td></tr>
          <tr><td class="ja">立っている</td><td class="ja">たっている</td><td>berdiri</td></tr>
          <tr><td class="ja">帽子をかぶっている</td><td class="ja">ぼうしをかぶっている</td><td>mengenakan topi</td></tr>
          <tr><td class="ja">ワンピースを着ている</td><td class="ja">—</td><td>mengenakan dress</td></tr>
          <tr><td class="ja">シャツを着ている</td><td class="ja">—</td><td>mengenakan kemeja</td></tr>
          <tr><td class="ja">ズボンをはいている</td><td class="ja">—</td><td>mengenakan celana</td></tr>
          <tr><td class="ja">靴をはいている</td><td class="ja">くつをはいている</td><td>mengenakan sepatu</td></tr>
          <tr><td class="ja">メガネをかけている</td><td class="ja">—</td><td>mengenakan kacamata</td></tr>
          <tr><td class="ja">ネクタイをしている</td><td class="ja">—</td><td>mengenakan dasi</td></tr>
          <tr><td class="ja">ピアスをしている</td><td class="ja">—</td><td>memakai anting tindik</td></tr>
          <tr><td class="ja">ひげをはやしている</td><td class="ja">—</td><td>berjanggut</td></tr>
          <tr><td class="ja">赤い／白い／黄色い／青い／黒い</td><td class="ja">あかい／しろい／きいろい／あおい／くろい</td><td>warna merah/putih/kuning/biru/hitam</td></tr>
        </table>

        <h3>2. Kosakata Penting — Kepribadian & Penampilan</h3>
        <table>
          <tr><th>Bahasa Jepang</th><th>Arti</th></tr>
          <tr><td class="ja">やさしい</td><td>baim/hati lembut</td></tr>
          <tr><td class="ja">きびしい</td><td>tegas/keras</td></tr>
          <tr><td class="ja">こわい</td><td>seram/takut</td></tr>
          <tr><td class="ja">おもしろい</td><td>lucu/menarik</td></tr>
          <tr><td class="ja">かわいい</td><td>imut/manis</td></tr>
          <tr><td class="ja">忙しい</td><td>sibuk</td></tr>
          <tr><td class="ja">まじめ（な）</td><td>serius/rajin</td></tr>
          <tr><td class="ja">元気（な）</td><td>sehat/ceria</td></tr>
          <tr><td class="ja">明るい</td><td>ceria/terang</td></tr>
          <tr><td class="ja">見た目</td><td>penampilan luar</td></tr>
          <tr><td class="ja">心配（な）</td><td>khawatir</td></tr>
        </table>

        <h3>3. Tata Bahasa Utama Bab 2</h3>

        <details open>
          <summary class="ja">① N1 は N2 が A-いです／A-な です (ciri fisik)</summary>
          <p>N1 = orang, N2 = bagian tubuh. Menjelaskan ciri fisik seseorang.</p>
          <p class="ja">例：江口さんは、髪が短いです。／加藤さんは、いちばん背が高いです。</p>
          <p>Bisa juga jadi frasa penjelas nomina: 「髪が短い人」「背が高い人」.</p>
        </details>

        <details>
          <summary class="ja">② V-ている ＋ 人 (sedang melakukan / mengenakan)</summary>
          <p>Menjelaskan kondisi saat ini atau atribut yang dikenakan.</p>
          <p class="ja">例：ナインさんは、帽子をかぶっている人です。</p>
          <p class="ja">例：加藤さんは、あそこでコピーをしている人です。</p>
        </details>

        <details>
          <summary class="ja">③ A-そうです (kesan dari penampilan)</summary>
          <p>Menyatakan kesan/impression berdasarkan apa yang dilihat.</p>
          <p class="ja">例：まじめそうな人ですね。／元気がなさそうですね。</p>
          <p>Sering dipadankan kontras: 「写真は～そうですけど、本当は～です。」</p>
        </details>

        <details>
          <summary class="ja">④ S し、S し、S です (menyebutkan beberapa alasan)</summary>
          <p>Memberikan dua atau lebih alasan/kesan sekaligus.</p>
          <p class="ja">例：安室奈美恵が好きです。かっこいいし、歌もダンスも上手だし。</p>
          <p class="ja">例：三船敏郎は、演技が上手だし、本当にかっこいいです。</p>
        </details>

        <details>
          <summary class="ja">⑤ よ / ね (partikel akhir)</summary>
          <p>「よ」= menyampaikan info baru/peringatan. 「ね」= konfirmasi/empati.</p>
          <p class="ja">例：あの髪が短くて、ひげをはやしてる人ですよ。（informasi baru）</p>
          <p class="ja">例：あの人ですね。ありがとうございます。（konfirmasi）</p>
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
          prompt: "あの（   ）をかぶっている人が、田中さんです。",
          options: ["靴", "帽子", "メガネ", "ネクタイ"],
          answer: 2
        },
        {
          id: "q2", type: "mcq", number: "Soal 2.",
          prompt: "山本さんの弟は、とても（   ）です。身長が１８０センチあります。",
          options: ["短い", "低い", "高い", "丸い"],
          answer: 3
        },
        {
          id: "q3", type: "mcq", number: "Soal 3.",
          prompt: "写真の女の子はとても（   ）ですね。赤ちゃんらしいです。",
          options: ["怖い", "厳しい", "かわいい", "忙しい"],
          answer: 3
        },
        {
          id: "q4", type: "mcq", number: "Soal 4.",
          prompt: "「髪」の読み方はどれですか。",
          options: ["かみ", "かわ", "かば", "かも"],
          answer: 1
        },
        {
          id: "q5", type: "mcq", number: "Soal 5.",
          prompt: "「背中」の意味として最も適切なのはどれですか。",
          options: ["bagian depan badan", "bagian belakang badan", "kepala", "kaki"],
          answer: 2
        },
        {
          id: "q6", type: "mcq", number: "Soal 6.",
          prompt: "あの人は、いつも笑っていて、（   ）人です。",
          options: ["暗い", "厳しい", "明るい", "怖い"],
          answer: 3
        },
        {
          id: "q7", type: "mcq", number: "Soal 7.",
          prompt: "「ひげを（   ）している人は、誰ですか。」",
          options: ["生や", "履", "着", "掛"],
          answer: 1
        },
        {
          id: "q8", type: "mcq", number: "Soal 8.",
          prompt: "「見た目」の意味はどれですか。",
          options: ["suara", "penampilan luar", "kepribadian", "umur"],
          answer: 2
        },
        {
          id: "q9", type: "mcq", number: "Soal 9.",
          prompt: "息子は毎日遅くまで仕事をしていて、最近とても（   ）ですね。",
          options: ["暇", "忙しい", "静か", "元気"],
          answer: 2
        },
        {
          id: "q10", type: "mcq", number: "Soal 10.",
          prompt: "「心配」の読み方はどれですか。",
          options: ["しんぱい", "しんはい", "ちんぱい", "じんぱい"],
          answer: 1
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
          prompt: "Ａ：すみません、佐藤さんはどの人ですか。<br>Ｂ：＿＿＿。",
          options: [
            "いいえ、私は佐藤ではありません。",
            "あそこで、電話をしている人ですよ。",
            "佐藤さんは会社に行きました。",
            "これは佐藤さんの鞄です。"
          ],
          answer: 2
        },
        {
          id: "q12", type: "mcq", number: "Soal 12.",
          prompt: "Ａ：その写真、だれですか。<br>Ｂ：恋人です。<br>Ａ：＿＿＿。<br>Ｂ：写真はそうですけど、本当はおもしろい人ですよ。",
          options: [
            "まじめそうな人ですね",
            "はい、わかりました",
            "ありがとうございます",
            "どこにありますか"
          ],
          answer: 1
        },
        {
          id: "q13", type: "mcq", number: "Soal 13.",
          prompt: "Ａ：小林さんは、どんな人ですか。<br>Ｂ：見た目は怖そうだけど、＿＿＿人だよ。",
          options: [
            "やさしい",
            "きびしい",
            "うるさい",
            "つまらない"
          ],
          answer: 1
        },
        {
          id: "q14", type: "mcq", number: "Soal 14.",
          prompt: "Ａ：好きな歌手はいますか。<br>Ｂ：はい。宇多田ヒカルさんが好きです。＿＿＿。",
          options: [
            "歌が上手だし、かっこいいし。",
            "歌は下手ですけど。",
            "彼女は引退しました。",
            "私は歌手ではありません。"
          ],
          answer: 1
        },
        {
          id: "q15", type: "mcq", number: "Soal 15.",
          prompt: "Ａ：孫が生まれたんですって。<br>Ｂ：＿＿＿！おめでとうございます。",
          options: [
            "へー、そうですか",
            "それは大変でしたね",
            "まあ、元気がなさそうですね",
            "あら、それは残念でした"
          ],
          answer: 1
        },
        {
          id: "q16", type: "mcq", number: "Soal 16.",
          prompt: "Ａ：あの赤いジャンパーの人が、加藤さんですか。<br>Ｂ：＿＿＿。あそこにいますよ。",
          options: [
            "いいえ、違います",
            "はい、そうです",
            "わかりません",
            "もう帰りました"
          ],
          answer: 2
        },
        {
          id: "q17", type: "mcq", number: "Soal 17.",
          prompt: "Ａ：小川さん、最近どうですか。<br>Ｂ：毎日遅くまで仕事で、＿＿＿ですね。<br>Ａ：そうですか。心配ですね。",
          options: [
            "忙しそう",
            "楽しそう",
            "おいしそう",
            "安そう"
          ],
          answer: 1
        },
        {
          id: "q18", type: "mcq", number: "Soal 18.",
          prompt: "Ａ：三船敏郎を知っていますか。<br>Ｂ：はい。＿＿＿俳優ですよ。<br>Ａ：へー、そうなんだ。",
          options: [
            "日本ではあまり有名じゃない",
            "世界中にファンがたくさんいる",
            "今はもう生きていません",
            "歌が上手です"
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
          prompt: "加藤さんはどんな人ですか。",
          options: [
            "あそこでコピーをしている人",
            "髪が短くて、ひげをはやしている人",
            "座って本を読んでいる人",
            "帽子をかぶっている人"
          ],
          answer: 1,
          audioUrl: "audio/Z_[02-03]_kiku1.mp3",
          script: "Ａ：あのう、すみません。加藤さん、いますか？Ｂ：加藤さん？ああ、あそこにいますよ。Ａ：え、どの人ですか？Ｂ：ほら、あそこで、コピーをしてる人です。Ａ：ああ、わかりました。ありがとうございます。"
        },
        {
          id: "q20", type: "listening", number: "Soal 20.",
          prompt: "江口さんはどんな人ですか。",
          options: [
            "背が高い人",
            "髪が長くて、メガネをかけている人",
            "髪が短くて、ひげをはやしている人",
            "ズボンをはいている人"
          ],
          answer: 3,
          audioUrl: "audio/Z_[02-04]_kiku2.mp3",
          script: "Ａ：すみません。江口さんはどの人ですか？Ｂ：あの髪が短くて、ひげをはやしてる人です。Ａ：ああ、わかりました。"
        },
        {
          id: "q21", type: "listening", number: "Soal 21.",
          prompt: "原さんは何をしていますか。",
          options: ["コピーをしています", "本を読んでいます", "電話をしています", "歩いていました"],
          answer: 2,
          audioUrl: "audio/Z_[02-05]_kiku3.mp3",
          script: "Ａ：原さん、いますか？Ｂ：ああ、座って、本を読んでる人ですよ。Ａ：ああ、あの男の人ですね。Ｂ：ええ。"
        },
        {
          id: "q22", type: "listening", number: "Soal 22.",
          prompt: "ナインさんはどんな服装ですか。",
          options: [
            "赤いジャンパーと帽子",
            "白いシャツとネクタイ",
            "黒いワンピース",
            "青いズボンとメガネ"
          ],
          answer: 1,
          audioUrl: "audio/Z_[02-06]_kiku4.mp3",
          script: "Ａ：あのう、ナインさんはどの人ですか？Ｂ：ナインさん？あの帽子をかぶってる人ですよ。Ａ：ああ、あの赤いジャンパーの人ですね。Ｂ：そうです。"
        },
        {
          id: "q23", type: "listening", number: "Soal 23.",
          prompt: "村田さんはどんな人だと話していますか。",
          options: [
            "いつもやさしい人",
            "見た目は怖そうだけど、やさしい人",
            "仕事のときは、とても楽しい人",
            "最近、とても忙しい人"
          ],
          answer: 2,
          audioUrl: "audio/Z_[02-13]_kiku3.mp3",
          script: "Ａ：今度、主任になった村田さん、どんな人ですか？Ｂ：見た目はこわそうだけど、やさしい人だよ。Ａ：そうなんですか。Ｂ：でも、仕事のときは、きびしいけどね。Ａ：えー！"
        },
        {
          id: "q24", type: "listening", number: "Soal 24.",
          prompt: "マイクさんは、なぜ三船敏郎が好きになりましたか。",
          options: [
            "テレビで歌っているのを見たから",
            "映画祭で『七人の侍』を見たから",
            "友達が教えてくれたから",
            "CDを買ったから"
          ],
          answer: 2,
          audioUrl: "audio/Z_[02-18]_kaiwa.mp3",
          script: "増田：蔡さん、日本の歌手、だれか知ってる？蔡：私は安室奈美恵が好きです。増田：へー。でも、引退したよね。蔡：はい。でも、今でも好きです。かっこいいし、歌もダンスも上手だし。増田：そうだね。マイク：安室奈美恵は、アジアではとても有名なんですよ。蔡：私は、テレビで見て、好きになりました。増田：へー、そうなんだ。マイクさんは、だれか好きな歌手、いる？マイク：歌手じゃないですけど、ぼくは三船敏郎が好きです。増田：えっ、三船敏郎！？すごいね。蔡：それ、だれですか？マイク：日本の有名な俳優です。増田：そんな古い人、よく知ってるね。マイク：はい。好きになったきっかけは、日本映画祭で『七人の侍』という映画を見たことです。演技が上手だし、本当にかっこいいです。蔡：そうなんですか。マイク：今でも、世界中にファンがたくさんいますよ。"
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
          passage: "【インタビュー記事】<br>モウさん（ミャンマー出身）<br>Ｑ：ヤンゴンはどんなところですか。<br>Ａ：ミャンマーでいちばん大きい町です。金色のパゴダがきれいです。静かな町ですけど、最近は観光客が増えています。<br>Ｑ：日本語はどこで勉強しましたか。<br>Ａ：日本に来る前に、ヤンゴンで２年間勉強しました。今は週に３回、交流協会のクラスで勉強しています。",
          prompt: "モウさんは、日本で日本語をどのように勉強していますか。",
          options: [
            "毎日、大学で勉強しています",
            "週に３回、交流協会で勉強しています",
            "ヤンゴンでしか勉強していません",
            "今は勉強していません"
          ],
          answer: 2
        },
        {
          id: "q26", type: "mcq", number: "Soal 26.",
          passage: "【同じ記事より】<br>Ｑ：好きなことは何ですか。<br>Ａ：ハイキングすることです。ミャンマーでは、時々、友達と山に登ったり、写真を撮ったりしました。<br>Ｑ：日本では、どんなことがしたいですか。<br>Ａ：仕事を早くしたいです。友達を作りたいです。いろいろな所へ行って、日本のことを知りたいです。できれば、富士山に登りたいです。",
          prompt: "モウさんが日本でやりたいこととして<b>書かれていない</b>ものはどれですか。",
          options: ["仕事を早く始める", "友達を作る", "富士山に登る", "歌手になる"],
          answer: 4
        },
        {
          id: "q27", type: "mcq", number: "Soal 27.",
          passage: "Ａ：あのう、すみません。鈴木さんはいますか。<br>Ｂ：鈴木さん？ あそこにいますよ。髪の長くて、ワンピースを着ている人です。<br>Ａ：ああ、あの赤い傘を持っている人ですね。<br>Ｂ：そうです。今日、雨ですから、みんな傘を持ってきています。",
          prompt: "鈴木さんはどんな格好をしていますか。",
          options: [
            "髪が短くて、ズボンをはいている",
            "髪が長くて、ワンピースを着ている",
            "帽子をかぶって、コートを着ている",
            "メガネをかけて、ネクタイをしている"
          ],
          answer: 2
        },
        {
          id: "q28", type: "mcq", number: "Soal 28.",
          passage: "私の兄は、見た目はとても厳しそうです。いつも無表情で、あまり笑いませ ん。でも、本当はとてもやさしい人です。子供のころ、毎晩、私に絵本を読んでくれました。仕事では厳しいけど、家では優しい人だと思います。",
          prompt: "筆者の兄について、正しいものはどれですか。",
          options: [
            "見た目も性格も厳しい",
            "見た目は優しそうだが、実は厳しい",
            "見た目は厳しそうだが、本当はやさしい",
            "家では全く笑わない"
          ],
          answer: 3
        },
        {
          id: "q29", type: "mcq", number: "Soal 29.",
          passage: "Ａ：山田さん、最近どうですか。<br>Ｂ：仕事が忙しくて、全然眠れないんです。<br>Ａ：それは大変ですね。でも、顔色が悪そうですよ。少し休んだ方がいいんじゃない。<br>Ｂ：ありがとう。来週、ちょっと休暇を取ろうと思っています。",
          prompt: "Ａは山田さんに何を勧めていますか。",
          options: ["もっと働くこと", "休むこと", "引っ越すこと", "転職すること"],
          answer: 2
        },
        {
          id: "q30", type: "mcq", number: "Soal 30.",
          passage: "安室奈美恵は、沖縄出身の歌手です。１９９２年にデビューして、２０１８年に引退しました。歌だけでなく、ダンスやファッションも注目されました。１９９０年代には、彼女のファッションを真似る若者が多く、「アムラー」と呼ばれました。代表曲に『ＣＡＮ　ＹＯＵ　ＣＥＬＥＢＲＡＴＥ？』『Ｈｅｒｏ』などがあり、ミリオンセラーも多数あります。引退した後も、多くのファンがいます。",
          prompt: "この記事について、正しいものはどれですか。",
          options: [
            "安室奈美恵は今も活動している",
            "彼女は歌手だけで、ダンスはしない",
            "１９９０年代に彼女のファッションを真似る若者が多かった",
            "彼女は東京出身である"
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
        { id: "q31", type: "mcq", number: "Soal 31.", prompt: "「写」の読み方はどれですか。", options: ["しゃ", "しや", "せ", "そ"], answer: 1 },
        { id: "q32", type: "mcq", number: "Soal 32.", prompt: "「真」を含む言葉「写真」の意味はどれですか。", options: ["gambar/foto", "surat", "buku", "peta"], answer: 1 },
        { id: "q33", type: "mcq", number: "Soal 33.", prompt: "「長」の訓読みはどれですか。", options: ["ながい", "ちょう", "たかい", "みじかい"], answer: 1 },
        { id: "q34", type: "mcq", number: "Soal 34.", prompt: "「短」の訓読みはどれですか。", options: ["みじかい", "ながい", "ちいさい", "たかい"], answer: 1 },
        { id: "q35", type: "mcq", number: "Soal 35.", prompt: "「着」を含む「着る」の意味はどれですか。", options: ["mengenakan (atasan/dress)", "memakai (sepatu/celana)", "menggendong", "memegang"], answer: 1 },
        { id: "q36", type: "mcq", number: "Soal 36.", prompt: "「立」の訓読みはどれですか。", options: ["たつ", "すわる", "あるく", "走る"], answer: 1 },
        { id: "q37", type: "mcq", number: "Soal 37.", prompt: "「明」を含む「明るい」の意味はどれですか。", options: ["ceria/terang", "gelap", "pendiam", "marah"], answer: 1 },
        { id: "q38", type: "mcq", number: "Soal 38.", prompt: "「泣」を含む「泣く」の意味はどれですか。", options: ["menangis", "tertawa", "tidur", "makan"], answer: 1 },
        { id: "q39", type: "mcq", number: "Soal 39.", prompt: "「歌」の音読みはどれですか。", options: ["か", "うた", "しょう", "ふ"], answer: 1 },
        { id: "q40", type: "mcq", number: "Soal 40.", prompt: "「手」を含む「上手」の意味はどれですか。", options: ["pandai/hebat", "buruk", "cepat", "lama"], answer: 1 }
      ]
    },

    /* ================= 6. Kosakata ================= */
    {
      id: "kosakata",
      label: "6. Kosakata",
      type: "questions",
      items: [
        { id: "k41", type: "vocab", number: "41.", prompt: "topi", accepted: ["帽子", "ぼうし", "boushi"] },
        { id: "k42", type: "vocab", number: "42.", prompt: "kacamata", accepted: ["メガネ", "めがね", "megane"] },
        { id: "k43", type: "vocab", number: "43.", prompt: "dasi", accepted: ["ネクタイ", "nekutai"] },
        { id: "k44", type: "vocab", number: "44.", prompt: "rambut", accepted: ["髪", "かみ", "kami"] },
        { id: "k45", type: "vocab", number: "45.", prompt: "janggut/kumis", accepted: ["ひげ", "hige"] },
        { id: "k46", type: "vocab", number: "46.", prompt: "penampilan luar", accepted: ["見た目", "みた目", "みため", "mitame"] },
        { id: "k47", type: "vocab", number: "47.", prompt: "serius/rajin", accepted: ["まじめ", "真面目", "majime"] },
        { id: "k48", type: "vocab", number: "48.", prompt: "sibuk", accepted: ["忙しい", "いそがしい", "isogashii"] },
        { id: "k49", type: "vocab", number: "49.", prompt: "cerita/riang", accepted: ["明るい", "akaruii", "akurui", "akarui"] },
        { id: "k50", type: "vocab", number: "50.", prompt: "khawatir", accepted: ["心配", "しんぱい", "shinpai"] }
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
          prompt: "Orang yang mengenakan topi itu, Pak Naing.",
          sample: "帽子をかぶっている人が、ナインさんです。"
        },
        {
          id: "tr2", type: "translation", number: "Soal T2.",
          prompt: "Eguchi adalah orang yang berambut pendek dan berjanggut.",
          sample: "江口さんは、髪が短くて、ひげをはやしている人です。"
        },
        {
          id: "tr3", type: "translation", number: "Soal T3.",
          prompt: "Di foto terlihat serius, tapi sebenarnya dia orang yang lucu.",
          sample: "写真はまじめそうですけど、本当はおもしろい人です。"
        },
        {
          id: "tr4", type: "translation", number: "Soal T4.",
          prompt: "Saya suka Amuro Namie. Dia keren, dan pandai menyanyi serta menari.",
          sample: "私は安室奈美恵が好きです。かっこいいし、歌もダンスも上手だし。"
        },
        {
          id: "tr5", type: "translation", number: "Soal T5.",
          prompt: "Alasan saya mulai menyukai Mifune Toshiro adalah karena menonton film «Seven Samurai».",
          sample: "三船敏郎が好きになったきっかけは、『七人の侍』という映画を見たことです。"
        }
      ]
    },

    /* ================= BANK AUDIO ================= */
    {
      id: "bankaudio",
      label: "🎧 Bank Audio Bab 2",
      type: "audiobank",
      items: [
        { track: "02-01", file: "Z_[02-01]_kotoba1.mp3", title: "ことばの準備 — a–c (ciri fisik dasar)" },
        { track: "02-02", file: "Z_[02-02]_kotoba2.mp3", title: "ことばの準備 (選ぶ a–n/o + warna o–s)" },
        { track: "02-03", file: "Z_[02-03]_kiku1.mp3", title: "聞きましょう① — 加藤（コピーをしている人）" },
        { track: "02-04", file: "Z_[02-04]_kiku2.mp3", title: "聞きましょう① — 江口（髪が短くて、ひげ）" },
        { track: "02-05", file: "Z_[02-05]_kiku3.mp3", title: "聞きましょう① — 原（座って本を読む人）" },
        { track: "02-06", file: "Z_[02-06]_kiku4.mp3", title: "聞きましょう① — ナイン（帽子＋赤いジャンパー）" },
        { track: "02-07", file: "Z_[02-07]_katachi1.mp3", title: "形に注目① — N1はN2が～です / V-ている＋人" },
        { track: "02-08", file: "Z_[02-08]_katachi2.mp3", title: "形に注目② — よ / ね" },
        { track: "02-09", file: "Z_[02-09]_hanasu1.mp3", title: "話しましょう① — model menjelaskan orang" },
        { track: "02-10", file: "Z_[02-10]_hanasu2.mp3", title: "話しましょう② — role play mencari orang" },
        { track: "02-11", file: "Z_[02-11]_kiku1.mp3", title: "聞きましょう — 恋人（まじめそう→本当はおもしろい）" },
        { track: "02-12", file: "Z_[02-12]_kiku2.mp3", title: "聞きましょう — 孫が生まれた（元気そうな赤ちゃん）" },
        { track: "02-13", file: "Z_[02-13]_kiku3.mp3", title: "聞きましょう — 村田（見た目怖い→やさしい）" },
        { track: "02-14", file: "Z_[02-14]_kiku4.mp3", title: "聞きましょう — 小川（忙しそう／心配）" },
        { track: "02-15", file: "Z_[02-15]_katachi.mp3", title: "形に注目 — ～そうだ（kesan penampilan）" },
        { track: "02-16", file: "Z_[02-16]_hanasu1.mp3", title: "話しましょう① — membicarakan orang di foto" },
        { track: "02-17", file: "Z_[02-17]_hanasu2.mp3", title: "話しましょう② — membicarakan orang yang tidak hadir" },
        { track: "02-18", file: "Z_[02-18]_kaiwa.mp3", title: "聞きましょう（本文）— 安室奈美恵／三船敏郎" },
        { track: "02-19", file: "Z_[02-19]_katachi.mp3", title: "形に注目 — ～し、～（alasan jamak）" },
        { track: "02-20", file: "Z_[02-20]_hanasu.mp3", title: "話しましょう — menceritakan artis favorit" }
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
        <div class="question-card"><label><strong>3. Kosakata ciri fisik apa yang belum saya hafal?</strong></label><textarea id="ref3" rows="2"></textarea></div>
        <div class="question-card"><label><strong>4. Kanji apa yang masih sulit dibaca?</strong></label><textarea id="ref4" rows="2"></textarea></div>
        <div class="question-card"><label><strong>5. Pola kalimat apa yang masih sering salah? (～ている人 / ～そうです / ～し)</strong></label><textarea id="ref5" rows="2"></textarea></div>
        <div class="question-card"><label><strong>6. Apa yang akan saya lakukan untuk memperbaiki kelemahan saya?</strong></label><textarea id="ref6" rows="3"></textarea></div>
      `
    }
  ]
};
