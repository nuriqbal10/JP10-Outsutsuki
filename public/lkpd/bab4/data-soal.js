/*
  data-soal.js
  LKPD Bahasa Jepang Bab 4 | しょうゆをつけないで食べてください
  Level: A2.2 / Persiapan JFT-Basic / LPK
  Topik: レストランで (Di Restoran / Rekomendasi & Cara Makan)
  
  PENTING:
  - Folder 'audio/' berisi file Z_[04-01]_... s.d. Z_[04-30]_....mp3 lengkap
  - Password Guru PIN: sensei123
*/

window.LKPD_DATA = {
  settings: {
    // Hash Password Guru (PIN: sensei123 via salt lkpd_bab4::v1::)
    teacherPasswordHash: "a505847fbf8d8ba4c8668ca2679549eb15a822e69972641f97487b8e8bf80c65",
    sessionKey: "lkpd_bab4_session_v1",
    stateKey: "lkpd_bab4_state_v1",
    listeningPlayCount: 2,
    showListeningControls: false,
    babId: "bab4"
  },

  tabs: [
    {
      id: "panduan",
      label: "Panduan",
      type: "static",
      html: `
        <h2>Panduan LKPD Bab 4</h2>
        <div class="note">
          LKPD ini disusun berdasarkan materi <strong>Irodori Dasar 2 (A2.2) Bab 4: 「しょうゆをつけないで食べてください」</strong> 
          dan diselaraskan dengan standar kompetensi <strong>CEFR A2 / JFT-Basic</strong> untuk kebutuhan peserta pelatihan LPK / calon Pekerja Berketerampilan Spesifik (SSW).
        </div>

        <h3>A. Tujuan Pembelajaran</h3>
        <p>Setelah menyelesaikan LKPD Bab 4 ini, peserta didik diharapkan mampu:</p>
        <ol>
          <li>Memahami penjelasan lisan mengenai restoran yang direkomendasikan serta karakteristik khasnya (harga, porsi, lokasi, menu).</li>
          <li>Memahami dan menggunakan instruksi cara menyantap makanan Jepang/dunia (mencelupkan bumbu, menaburkan garam, mengupas, menggulung temaki-zushi, urutan makan shabu-shabu).</li>
          <li>Menyampaikan larangan kasual dengan bentuk <em>～ちゃだめ</em> dan menyatakan urutan aksi dengan <em>～てから</em>.</li>
          <li>Memperkenalkan makanan tradisional dari negara sendiri dengan membandingkan kemiripannya dengan masakan Jepang/dunia (<em>～に似ています</em>).</li>
          <li>Membaca dan menganalisis ulasan kuliner online (reviu internet) mengenai rasa, harga, porsi, dan waktu pelayanan restoran.</li>
          <li>Menguasai kosakata bumbu dapur, metode memasak, dan kanji fungsional Bab 4.</li>
          <li>Menerjemahkan kalimat kerja dan etika makan menggunakan pola tata bahasa Bab 4 secara tepat.</li>
        </ol>

        <h3>B. Can-do Statements Setara A2 / JFT-Basic</h3>
        <table>
          <tr><th>No</th><th>Can-do Statement</th><th>Kompetensi Teruji</th></tr>
          <tr><td>Can-do 14</td><td>おすすめの飲食店についての紹介を聞いて、店の特徴を理解することができる。</td><td>Mendengarkan rekomendasi restoran dan memahami ciri khasnya.</td></tr>
          <tr><td>Can-do 15</td><td>料理の食べ方の説明を聞いて、理解することができる。</td><td>Memahami penjelasan instruksi cara menyantap suatu hidangan.</td></tr>
          <tr><td>Can-do 16</td><td>料理の食べ方について、質問したり、質問に答えたりすることができる。</td><td>Melakukan tanya jawab praktis mengenai cara makan dan bumbu pendamping.</td></tr>
          <tr><td>Can-do 17</td><td>自分の国の料理について、料理の特徴、材料、食べ方などを、簡単に紹介することができる。</td><td>Memperkenalkan masakan negara sendiri (Gado-gado, dll.) secara sederhana.</td></tr>
          <tr><td>Can-do 18</td><td>飲食店についてのネットの口コミを読んで、味や値段などの情報を読み取ることができる。</td><td>Membaca ulasan internet restoran terkait rasa, porsi, dan harga.</td></tr>
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
        <h2>Rangkuman Materi Bab 4</h2>
        <div class="note">
          Tema Utama: <strong>レストランで (Di Restoran / Rekomendasi &amp; Etika Menyantap Masakan)</strong>
        </div>

        <h3>1. Kosakata Bumbu &amp; Cara Memasak</h3>
        <table>
          <tr><th>Kategori</th><th>Kosakata Jepang</th><th>Arti Bahasa Indonesia</th></tr>
          <tr><td rowspan="4"><strong>Aksi Menyantap</strong></td><td>つける (tsukeru)</td><td>Mencelupkan (saus/kuah)</td></tr>
          <tr><td>かける (kakeru)</td><td>Menuangkan / menaburkan saus di atas makanan</td></tr>
          <tr><td>混ぜる (mazeru)</td><td>Mengaduk / mencampur</td></tr>
          <tr><td>巻く (maku) / むく (muku)</td><td>Menggulung (temaki-zushi) / Mengupas (kulit ubi/buah)</td></tr>
          <tr><td rowspan="4"><strong>Bumbu Dapur</strong></td><td>塩 (shio) / 砂糖 (satou)</td><td>Garam / Gula</td></tr>
          <tr><td>しょうゆ (shouyu) / つゆ (tsuyu)</td><td>Kecap asin Jepang / Kuah kaldu celup (tempura/soba)</td></tr>
          <tr><td>たれ (tare) / ポン酢 (ponzu)</td><td>Saus cocol pekat / Saus cuka lemon (shabu-shabu)</td></tr>
          <tr><td>油 (abura) / スパイス (supaisu)</td><td>Minyak goreng / Rempah-rempah</td></tr>
          <tr><td rowspan="4"><strong>Cara Memasak</strong></td><td>切る (kiru) / 焼く (yaku)</td><td>Memotong / Memanggang (daging, ikan)</td></tr>
          <tr><td>煮る (niru) / ゆでる (yuderu)</td><td>Merebus dalam bumbu pekat / Merebus dalam air/kaldu</td></tr>
          <tr><td>蒸す (musu) / 揚げる (ageru)</td><td>Mengukus (momo/bakpao) / Menggoreng banyak minyak</td></tr>
          <tr><td>いためる (itameru)</td><td>Menumis</td></tr>
        </table>

        <h3>2. Pola Kalimat Kunci (Tata Bahasa)</h3>
        <div class="grammar-box">
          <h4>➊ N なら、～ (Kalau N, rekomendasi yang tepat adalah...)</h4>
          <p>Digunakan untuk merespons pertanyaan dengan mengutip kata kunci dari lawan bicara untuk memberikan saran terbaik.</p>
          <p class="ja">例：おいしいラーメン屋なら、あそこの「千歩」がいちばんおいしいよ。（安くて量も多いよ。）</p>
        </div>

        <div class="grammar-box">
          <h4>➋ V-て / V-ないで、～ (Melakukan aksi dengan / tanpa keadaan tertentu)</h4>
          <p>Menjelaskan cara makan sesuatu dengan menggunakan atau tanpa menggunakan bumbu tertentu.</p>
          <p class="ja">例：このシュウマイは味がついていますから、しょうゆをつけないで食べてください。</p>
          <p class="ja">例：天ぷらは、つゆにつけて食べてください。エビは塩をかけて食べてください。</p>
        </div>

        <div class="grammar-box">
          <h4>➌ V-ちゃだめです (Tidak boleh melakukan... [Larangan kasual])</h4>
          <p>Bentuk percakapan lisan akrab dari <em>～てはだめです</em>. Jika verba berakhiran -de (seperti nonde), menjadi <em>～じゃだめ</em>.</p>
          <p class="ja">例：一度に、そんなにたくさんお肉を入れちゃだめですよ。（しゃぶしゃぶ）</p>
          <p class="ja">例：これはもう古いから、食べちゃだめです。</p>
        </div>

        <div class="grammar-box">
          <h4>➍ V-てから、～ (Setelah melakukan V, baru lakukan aksi berikutnya)</h4>
          <p>Menyatakan urutan langkah atau proses memasak/makan yang jelas.</p>
          <p class="ja">例：お肉と野菜を食べてから、うどんを入れましょう。（しゃぶしゃぶのシメ）</p>
        </div>

        <div class="grammar-box">
          <h4>➎ S1 が、S2 (Kalimat 1, TETAPI Kalimat 2 [Ragam formal / tulis])</h4>
          <p>Konjungsi pertentangan untuk ulasan atau tulisan resmi (setara dengan <em>～けど</em> pada ragam lisan percakapan).</p>
          <p class="ja">例：お店は新しくてきれいですが、お昼は混んでいます。</p>
          <p class="ja">例：味もボリュームも満足ですが、ちょっと時間がかかります。</p>
        </div>
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
          prompt: "料理の味付けに使う「白くてしょっぱい調味料」は何ですか。",
          options: ["砂糖", "塩", "油", "こしょう"],
          answer: 2
        },
        {
          id: "q2",
          type: "mcq",
          number: "Soal 2.",
          prompt: "サラダにドレッシングを上から（   ）食べます。",
          options: ["つけて", "まぜて", "かけて", "むいて"],
          answer: 3
        },
        {
          id: "q3",
          type: "mcq",
          number: "Soal 3.",
          prompt: "焼きいもは、あつい（   ）をむいて食べます。",
          options: ["皮", "骨", "油", "皿"],
          answer: 1
        },
        {
          id: "q4",
          type: "mcq",
          number: "Soal 4.",
          prompt: "小麦粉をつけて、油で（   ）料理は「天ぷら」です。",
          options: ["ゆでる", "揚げる", "蒸す", "煮る"],
          answer: 2
        },
        {
          id: "q5",
          type: "mcq",
          number: "Soal 5.",
          prompt: "しゃぶしゃぶを食べるとき、さっぱりしたレモンや酢の（   ）につけます。",
          options: ["ソース", "ポン酢", "砂糖", "マヨネーズ"],
          answer: 2
        },
        {
          id: "q6",
          type: "mcq",
          number: "Soal 6.",
          prompt: "「安くておいしい店を知りませんか？」「安い店（   ）、駅前の定食屋がいいよ。」",
          options: ["から", "でも", "なら", "ほど"],
          answer: 3
        },
        {
          id: "q7",
          type: "mcq",
          number: "Soal 7.",
          prompt: "このギョーザは味がついていますから、たれを（   ）そのままどうぞ。",
          options: ["つけないで", "つけて", "つけると", "つけちゃ"],
          answer: 1
        },
        {
          id: "q8",
          type: "mcq",
          number: "Soal 8.",
          prompt: "スープが熱いから、いっぺんに全部（   ）だめだよ。",
          options: ["飲んで", "飲んじゃ", "飲まない", "飲むなら"],
          answer: 2
        },
        {
          id: "q9",
          type: "mcq",
          number: "Soal 9.",
          prompt: "お肉をよく（   ）から、野菜を入れてください。",
          options: ["焼いて", "焼くなら", "焼かないで", "焼いちゃ"],
          answer: 1
        },
        {
          id: "q10",
          type: "mcq",
          number: "Soal 10.",
          prompt: "正しい文になるように ★ に入る番号を選んでください。<br>「お店は［ 1. ですが ］［ 2. 新しくて ］［ ★ ］［ 3. お昼は ］［ 4. きれい ］混んでいます。」",
          options: ["1. ですが", "2. 新しくて", "3. お昼は", "4. きれい"],
          answer: 1
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
          prompt: "Ａ「今度、彼女と食事に行きたいんですけど、どこかいい店ありませんか？」<br>Ｂ「それなら、最近できた『みさきカフェ』はどう？ 女性に人気で（   ）。」",
          options: [
            "デザートがすごくおいしいよ",
            "油で揚げてありますよ",
            "皮をむかないで食べるよ",
            "しょうゆをかけちゃだめだよ"
          ],
          answer: 1
        },
        {
          id: "q12",
          type: "mcq",
          number: "Soal 12.",
          prompt: "Ａ「この土地の郷土料理が食べたいんですが、おすすめはありますか？」<br>Ｂ「この近くだと『平兵衛』ですね。（   ）がおいしいし、歩いて10分です。」",
          options: [
            "とりの天ぷら",
            "ベトナム料理",
            "ブラジルの豆料理",
            "固い中華菓子"
          ],
          answer: 1
        },
        {
          id: "q13",
          type: "mcq",
          number: "Soal 13.",
          prompt: "店員「天ぷら、お待たせしました。こちらの野菜はつゆにつけて、エビは（   ）食べてください。」",
          options: [
            "塩をかけて",
            "皮をむいて",
            "全部混ぜて",
            "うどんを入れて"
          ],
          answer: 1
        },
        {
          id: "q14",
          type: "mcq",
          number: "Soal 14.",
          prompt: "手巻きずしの食べ方として正しい説明はどれですか。",
          options: [
            "油で揚げてからタレをかける",
            "のりの上にご飯と刺身をのせて、巻いて食べる",
            "沸騰したお湯の中で2、3回振る",
            "皮をむかないでそのままかじる"
          ],
          answer: 2
        },
        {
          id: "q15",
          type: "mcq",
          number: "Soal 15.",
          prompt: "初めてしゃぶしゃぶを食べる同僚に、食べ方をたずねる表現はどれですか。",
          options: [
            "どうやって食べるんですか？",
            "何で食べないんですか？",
            "どこで食べるつもりですか？",
            "いつ食べ終わるんですか？"
          ],
          answer: 1
        },
        {
          id: "q16",
          type: "mcq",
          number: "Soal 16.",
          prompt: "先輩「しゃぶしゃぶのたれは、（   ）があります。両方試してみて。」",
          options: [
            "ポン酢とごまだれ",
            "砂糖と塩",
            "ソースとケチャップ",
            "ワサビとマヨネーズ"
          ],
          answer: 1
        },
        {
          id: "q17",
          type: "mcq",
          number: "Soal 17.",
          prompt: "後輩「もう、うどんを入れてもいいですか？」<br>先輩「うどんは（   ）。お肉と野菜を食べてからにしましょう。」",
          options: [
            "すぐ入れてください",
            "まだ入れちゃだめだよ",
            "たくさん入れたほうがいいよ",
            "入れなくてもいいよ"
          ],
          answer: 2
        },
        {
          id: "q18",
          type: "mcq",
          number: "Soal 18.",
          prompt: "外国の友達に自国の料理を説明するとき、「見た目や作り方が似ている」と伝える表現はどれですか。",
          options: [
            "日本のギョーザに似ています",
            "日本のギョーザより安いです",
            "日本のギョーザを食べちゃだめです",
            "日本のギョーザと同じ名前です"
          ],
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
          prompt: "質問：男の人がおすすめしているラーメン屋「千歩」の特徴は何ですか。",
          options: [
            "高くて本格的な味",
            "安くて量が多い",
            "デザートが有名",
            "駅からバスで30分"
          ],
          answer: 2,
          audioUrl: "audio/Z_[04-01]_kiku1.mp3",
          script: "Ａ：おいしいラーメンが食べたいんですけど、どこがいいですか？<br>Ｂ：うーん、おれのおすすめは「千歩」かなあ。<br>Ａ：あ、あの商店街にある赤い看板のお店ですか？<br>Ｂ：そうそう。ラーメンなら、あそこがいちばんおいしいよ。安いし、量も多いし。<br>Ａ：じゃあ、今度行ってみます。"
        },
        {
          id: "q20",
          type: "listening",
          number: "Soal 20.",
          prompt: "質問：新しくできた「みさきカフェ」について、正しいものはどれですか。",
          options: [
            "男性客ばかりで混んでいる",
            "きれいだし、デザートがすごくおいしい",
            "ラーメンの種類が多い",
            "場所がわからないので行けない"
          ],
          answer: 2,
          audioUrl: "audio/Z_[04-02]_kiku2.mp3",
          script: "Ａ：今度、彼女と食事に行きたいんですけど、この辺で、どこかいい店、ありませんか？<br>Ｂ：そうねえ……。それなら、最近、新しくできた「みさきカフェ」はどう？ 女性にすごく人気があるよ。<br>Ａ：どんな店ですか？<br>Ｂ：きれいだし、デザートがすごくおいしいよ。<br>Ａ：へー。どこにありますか？<br>Ｂ：待って。じゃあ、今、地図送るね。"
        },
        {
          id: "q21",
          type: "listening",
          number: "Soal 21.",
          prompt: "質問：ベトナム料理の店「花」はどんな店ですか。",
          options: [
            "ベトナム人の夫婦がやっていて本物の味が食べられる",
            "この町にあってすぐに行ける",
            "とても辛くて食べられない",
            "ファストフードのチェーン店"
          ],
          answer: 1,
          audioUrl: "audio/Z_[04-03]_kiku3.mp3",
          script: "Ａ：あのう、このあたりにベトナム料理のお店、ないですか？<br>Ｂ：う－ん、この町にはないですけど、もみじ町にありますよ。「花」っていう店で、ベトナム人の夫婦がやっていて、本物のベトナム料理が食べられるそうです。<br>Ａ：へー、そうなんですか！ 知りませんでした。今度行ってみます。"
        },
        {
          id: "q22",
          type: "listening",
          number: "Soal 22.",
          prompt: "質問：郷土料理の店「平兵衛」へはどうやって行きますか。",
          options: [
            "ここから歩いて10分ぐらい",
            "バスに乗って1時間",
            "電車で2駅先",
            "車でしか行けない"
          ],
          answer: 1,
          audioUrl: "audio/Z_[04-04]_kiku4.mp3",
          script: "Ａ：すみません。この土地の料理が食べたいんですが、この近くに、おすすめの店がありますか？<br>Ｂ：そうですね。この近くだと、「平兵衛」がおすすめです。とりの天ぷらがおいしいし、ほかにもいろいろなメニューがありますよ。<br>Ａ：それ、どこですか？<br>Ｂ：ここから歩いて10分ぐらいです。地図、ありますよ。<br>Ａ：わかりました。ありがとうございます。"
        },
        {
          id: "q23",
          type: "listening",
          number: "Soal 23.",
          prompt: "質問：店員は「混ぜそば」をどうやって食べるように言いましたか。",
          options: [
            "よく混ぜて食べる",
            "お湯を注いで食べる",
            "しょうゆをたっぷりかける",
            "冷ましてから食べる"
          ],
          answer: 1,
          audioUrl: "audio/Z_[04-08]_kiku1.mp3",
          script: "Ａ：混ぜそば、お待たせしました！ よく混ぜて食べてください。<br>Ｂ：はい。"
        },
        {
          id: "q24",
          type: "listening",
          number: "Soal 24.",
          prompt: "質問：エビの天ぷらは、どうやって食べますか。",
          options: [
            "つゆにつけて食べる",
            "つゆにつけないで、塩をかけて食べる",
            "皮をむいてそのまま食べる",
            "しょうゆをかけて食べる"
          ],
          answer: 2,
          audioUrl: "audio/Z_[04-10]_kiku3.mp3",
          script: "Ａ：こちらの野菜の天ぷらは、つゆにつけて食べてください。エビはつゆにつけないで、塩をかけて食べてください。<br>Ｂ：はい。"
        },
        {
          id: "q25",
          type: "listening",
          number: "Soal 25.",
          prompt: "質問：新井さんが説明したしゃぶしゃぶの注意点として、正しいものはどれですか。",
          options: [
            "一度にたくさんお肉を入れてはいけない",
            "スープに強い味があるからタレはいらない",
            "最初からうどんを鍋に入れる",
            "お肉は30分間じっくり煮込む"
          ],
          answer: 1,
          audioUrl: "audio/Z_[04-16]_kaiwa.mp3",
          script: "ドゥック：お肉、もう入れてもいいですか？<br>新井：どうぞ。あ！ 一度に、そんなにたくさんお肉を入れちゃだめですよ。<br>ドゥック：え、そうなんですか？ どうやって食べるんですか？<br>新井：しゃぶしゃぶは、お肉を1枚ずつ取って、お湯の中で、こうやって2、3回しゃぶしゃぶってするんですよ。<br>新井：あ、スープには味がありませんから、たれをつけて食べてください。ポン酢とごまだれがあります。<br>フン：うどんを入れてもいいですか？<br>新井：うどんは、まだ入れちゃだめ。お肉と野菜を食べてから、入れましょう。"
        },
        {
          id: "q26",
          type: "listening",
          number: "Soal 26.",
          prompt: "質問：インドネシアの「ガドガド」はどんな料理だと説明されていますか。",
          options: [
            "豚肉を油で揚げたお菓子",
            "ゆでた野菜やゆで卵に甘辛いピーナッツソースをかけるサラダ",
            "小麦粉を蒸して作ったギョーザのような主食",
            "とても固い牛肉のスープ"
          ],
          answer: 2,
          audioUrl: "audio/Z_[04-28]_kiku3.mp3",
          script: "これはインドネシアのガドガドというサラダです。ゆでた野菜やゆで卵などが入っています。ピーナッツのソースをかけて食べます。このソースは甘辛いです。"
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
            <div class="review-box">
              <h3>グルメ口コミサイト：いろどり食堂 ★4.0 (374件)</h3>
              <p><strong>① Shiori Aso ★★★★★</strong><br>友だちと二人で行きました。ミックスフライ定食をたのみました。とてもおいしかったですが、私には量が多かったです…</p>
              <p><strong>② 浅野武史 ★★★★★</strong><br>料理はどれもおいしいです。煮込みハンバーグ定食がオススメ。ごはんのおかわり自由です！！</p>
              <p><strong>③ moon_keiko_0917 ★★★★★</strong><br>安くておいしい定食屋さん。お店は新しくてきれいですが、お昼は混んでいます。12時前に行くことをおすすめします。</p>
              <p><strong>④ Atsushi Iwase ★★★★★</strong><br>味もボリュームも満足ですが…おばちゃん一人でやっているので、ちょっと時間がかかります。</p>
              <p><strong>⑤ Yuta Kawashima ★★★★★</strong><br>定食は600～700円で食べられます。とってもリーズナブル。大好きな店の一つです。</p>
            </div>
          `,
          prompt: "【問1】「いろどり食堂」について、全体的な評判として最も適切なものはどれですか。",
          options: [
            "味がおいしく、値段も手頃で量が多いと評判が良い",
            "値段がとても高くて高級な料理店である",
            "料理がまずくてだれも行かない店である",
            "店が古くて汚いので注意が必要である"
          ],
          answer: 1
        },
        {
          id: "q28",
          type: "mcq",
          number: "Soal 28.",
          prompt: "【問2】口コミ①のShioriさんと口コミ④のAtsushiさんの共通する意見は何ですか。",
          options: [
            "料理の量（ボリューム）が多い",
            "料理がとてもまずい",
            "値段が高すぎること",
            "駅から遠くて不便なこと"
          ],
          answer: 1
        },
        {
          id: "q29",
          type: "mcq",
          number: "Soal 29.",
          prompt: "【問3】口コミ③のKeikoさんは、何時頃にお店に行くことをすすめていますか。",
          options: [
            "12時前",
            "午後2時過ぎ",
            "夜の8時",
            "いつでも空いている"
          ],
          answer: 1
        },
        {
          id: "q30",
          type: "mcq",
          number: "Soal 30.",
          prompt: "【問4】口コミ④のAtsushiさんが挙げている「少し不便な点」は何ですか。",
          options: [
            "ワンオペ（一人）でやっているので、料理が出てくるまでに時間がかかる",
            "ご飯が冷たいこと",
            "駐車場がないこと",
            "おばちゃんがとても怒りっぽいこと"
          ],
          answer: 1
        },
        {
          id: "q31",
          type: "mcq",
          number: "Soal 31.",
          prompt: "【問5】口コミ⑤の「とってもリーズナブル」とはどのような意味ですか。",
          options: [
            "価格が手頃で納得できる安さであること",
            "とても高価であること",
            "味がまずいこと",
            "予約ができないこと"
          ],
          answer: 1
        },
        {
          id: "q32",
          type: "mcq",
          number: "Soal 32.",
          prompt: "【問6】口コミ②の「ごはんのおかわり自由」とはどういう意味ですか。",
          options: [
            "ご飯を何杯でも無料で追加できる",
            "ご飯を自分で持ってこなければならない",
            "ご飯を残してはいけない",
            "ご飯の代わりにパンを選ぶ"
          ],
          answer: 1
        }
      ]
    },

    {
      id: "kanji",
      label: "5. Kanji",
      type: "questions",
      items: [
        {
          id: "k33",
          type: "mcq",
          number: "Soal 33.",
          prompt: "「塩」の正しい読み方はどれですか。<br>例文：お湯に（塩）を入れてゆでます。",
          options: ["しお", "あぶら", "さとう", "す"],
          answer: 1
        },
        {
          id: "k34",
          type: "mcq",
          number: "Soal 34.",
          prompt: "「油」の正しい読み方はどれですか。<br>例文：このお菓子は、（油）で揚げてつくります。",
          options: ["あぶら", "みず", "ゆ", "しお"],
          answer: 1
        },
        {
          id: "k35",
          type: "mcq",
          number: "Soal 35.",
          prompt: "「量」の正しい読み方はどれですか。<br>例文：私には（量）が多かったです。",
          options: ["りょう", "あじ", "ねだん", "かず"],
          answer: 1
        },
        {
          id: "k36",
          type: "mcq",
          number: "Soal 36.",
          prompt: "「食べ方」の正しい読み方はどれですか。<br>例文：この料理の（食べ方）を教えてください。",
          options: ["たべかた", "たべほう", "しょくほう", "たべがた"],
          answer: 1
        },
        {
          id: "k37",
          type: "mcq",
          number: "Soal 37.",
          prompt: "「満足」の正しい読み方はどれですか。<br>例文：味も量も（満足）です。",
          options: ["まんぞく", "まんそく", "ぶそく", "みたし"],
          answer: 1
        },
        {
          id: "k38",
          type: "mcq",
          number: "Soal 38.",
          prompt: "「切る」の正しい読み方はどれですか。<br>例文：まず、野菜を（切って）ください。",
          options: ["きって", "かって", "にって", "とって"],
          answer: 1
        },
        {
          id: "k39",
          type: "mcq",
          number: "Soal 39.",
          prompt: "「焼く」の正しい読み方はどれですか。<br>例文：魚をフライパンで（焼きます）。",
          options: ["やきます", "にます", "あげます", "むします"],
          answer: 1
        },
        {
          id: "k40",
          type: "mcq",
          number: "Soal 40.",
          prompt: "「入れる」の正しい読み方はどれですか。<br>例文：うどんを鍋に（入れましょう）。",
          options: ["いれましょう", "はいりましょう", "だしましょう", "おきましょう"],
          answer: 1
        }
      ]
    },

    {
      id: "kosakata",
      label: "6. Kosakata",
      type: "questions",
      items: [
        { id: "v41", type: "vocab", number: "41.", prompt: "saus cocolan kental (yakiniku/shabu-shabu)", accepted: ["たれ", "tare", "タレ"] },
        { id: "v42", type: "vocab", number: "42.", prompt: "saus kuah celup kaldu (tempura/soba)", accepted: ["つゆ", "tsuyu", "ツユ"] },
        { id: "v43", type: "vocab", number: "43.", prompt: "mengaduk / mencampur rata", accepted: ["混ぜる", "まぜる", "mazeru"] },
        { id: "v44", type: "vocab", number: "44.", prompt: "mencelupkan ke saus", accepted: ["つける", "tsukeru"] },
        { id: "v45", type: "vocab", number: "45.", prompt: "menuangkan / menaburkan saus di atas makanan", accepted: ["かける", "kakeru"] },
        { id: "v46", type: "vocab", number: "46.", prompt: "menggulung (sushi)", accepted: ["巻く", "まく", "maku"] },
        { id: "v47", type: "vocab", number: "47.", prompt: "mengupas kulit (ubi/buah)", accepted: ["むく", "muku"] },
        { id: "v48", type: "vocab", number: "48.", prompt: "mengukus (makanan)", accepted: ["蒸す", "むす", "musu"] },
        { id: "v49", type: "vocab", number: "49.", prompt: "menggoreng dengan banyak minyak", accepted: ["揚げる", "あげる", "ageru"] },
        { id: "v50", type: "vocab", number: "50.", prompt: "porsi banyak / mengenyangkan (katakana)", accepted: ["ボリューム", "boryuumu", "boryumu"] }
      ]
    },

    {
      id: "terjemahan",
      label: "7. Terjemahan",
      type: "questions",
      items: [
        {
          id: "tr1",
          type: "translation",
          number: "Soal T1.",
          prompt: "Jangan celupkan ke shoyu, silakan makan begitu saja.",
          sample: "しょうゆをつけないで、そのまま食べてください。"
        },
        {
          id: "tr2",
          type: "translation",
          number: "Soal T2.",
          prompt: "Kalau restoran ramen yang enak, kedai 'Sempo' di sana yang paling enak.",
          sample: "おいしいラーメン屋なら、あそこの「千歩」がいちばんおいしいよ。"
        },
        {
          id: "tr3",
          type: "translation",
          number: "Soal T3.",
          prompt: "Jangan masukkan daging sebanyak itu sekaligus.",
          sample: "一度に、そんなにたくさんお肉を入れちゃだめですよ。"
        },
        {
          id: "tr4",
          type: "translation",
          number: "Soal T4.",
          prompt: "Mari kita masukkan udon setelah selesai memakan daging dan sayur.",
          sample: "お肉と野菜を食べてから、うどんを入れましょう。"
        },
        {
          id: "tr5",
          type: "translation",
          number: "Soal T5.",
          prompt: "Restoran itu baru dan bersih, tetapi pada jam makan siang sangat ramai/penuh.",
          sample: "あのお店は新しくてきれいですが、お昼は混んでいます。"
        }
      ]
    },

    {
      id: "bankaudio",
      label: "🎧 Bank Audio Bab 4",
      type: "audiobank",
      items: [
        { track: "04-01", file: "Z_[04-01]_kiku1.mp3", title: "聞きましょう① — ラーメン：千歩（安くて量が多い）" },
        { track: "04-02", file: "Z_[04-02]_kiku2.mp3", title: "聞きましょう① — 彼女と食事：みさきカフェ（デザート）" },
        { track: "04-03", file: "Z_[04-03]_kiku3.mp3", title: "聞きましょう① — ベトナム料理：花（本物の味）" },
        { track: "04-04", file: "Z_[04-04]_kiku4.mp3", title: "聞きましょう① — 郷土料理：平兵衛（とり天／歩いて10分）" },
        { track: "04-05", file: "Z_[04-05]_katachi.mp3", title: "形に注目 — ～なら" },
        { track: "04-06", file: "Z_[04-06]_kotoba1.mp3", title: "ことばの準備 — 食べ方（つける・まぜる・かける・いれる）" },
        { track: "04-07", file: "Z_[04-07]_kotoba2.mp3", title: "ことばの準備 — 食べ方（選ぶ a–g）" },
        { track: "04-08", file: "Z_[04-08]_kiku1.mp3", title: "聞きましょう② — 混ぜそば（よく混ぜて）" },
        { track: "04-09", file: "Z_[04-09]_kiku2.mp3", title: "聞きましょう② — シュウマイ（味付き／しょうゆつけない）" },
        { track: "04-10", file: "Z_[04-10]_kiku3.mp3", title: "聞きましょう② — 天ぷら（野菜＝つゆ／エビ＝塩）" },
        { track: "04-11", file: "Z_[04-11]_kiku4.mp3", title: "聞きましょう② — トマト（何もかけない／そのまま）" },
        { track: "04-12", file: "Z_[04-12]_kiku5.mp3", title: "聞きましょう② — 手巻きずし（ご飯と刺身のせて巻く）" },
        { track: "04-13", file: "Z_[04-13]_kiku6.mp3", title: "聞きましょう② — 焼きいも（皮をむかないで）" },
        { track: "04-14", file: "Z_[04-14]_kiku7.mp3", title: "聞きましょう② — コーヒー（砂糖○／ミルク×）" },
        { track: "04-15", file: "Z_[04-15]_katachi.mp3", title: "形に注目 — ～て／～ないで" },
        { track: "04-16", file: "Z_[04-16]_kaiwa.mp3", title: "聞きましょう（会話本文） — しゃぶしゃぶの食べ方" },
        { track: "04-17", file: "Z_[04-17]_katachi.mp3", title: "形に注目 — ～ちゃだめ／～てから" },
        { track: "04-18", file: "Z_[04-18]_hanasu1-1.mp3", title: "話しましょう — どうやって食べるんですか？①" },
        { track: "04-19", file: "Z_[04-19]_hanasu1-2.mp3", title: "話しましょう — どうやって食べるんですか？②" },
        { track: "04-20", file: "Z_[04-20]_hanasu2.mp3", title: "話しましょう — たれはどれがいいですか？" },
        { track: "04-21", file: "Z_[04-21]_hanasu3.mp3", title: "話しましょう — うどんを入れてもいいですか？" },
        { track: "04-22", file: "Z_[04-22]_kotoba1-1.mp3", title: "ことばの準備 — 調味料（砂糖・塩・こしょう・スパイス・油）" },
        { track: "04-23", file: "Z_[04-23]_kotoba1-2.mp3", title: "ことばの準備 — 調理法（切る・焼く・煮る・ゆでる・蒸す・揚げる）" },
        { track: "04-24", file: "Z_[04-24]_kotoba2-1.mp3", title: "ことばの準備 — 各国の料理（選ぶ a–g）" },
        { track: "04-25", file: "Z_[04-25]_kotoba2-2.mp3", title: "ことばの準備 — 各国の料理（確認）" },
        { track: "04-26", file: "Z_[04-26]_kiku1.mp3", title: "各国の料理紹介 — フェイジョアーダ（ブラジル／豆と肉を煮る）" },
        { track: "04-27", file: "Z_[04-27]_kiku2.mp3", title: "各国の料理紹介 — モモ（ネパール／蒸す／ギョーザに似ている）" },
        { track: "04-28", file: "Z_[04-28]_kiku3.mp3", title: "各国の料理紹介 — ガドガド（インドネシア／ピーナッツソース）" },
        { track: "04-29", file: "Z_[04-29]_kiku4.mp3", title: "各国の料理紹介 — 麻花／マーホア（中国／油で揚げるお菓子）" },
        { track: "04-30", file: "Z_[04-30]_hanasu.mp3", title: "話しましょう — 自国の料理を紹介する（シャドーイング）" }
      ]
    },

    {
      id: "hasil",
      label: "Hasil & Umpan Balik",
      type: "result"
    },

    {
      id: "refleksi",
      label: "Refleksi",
      type: "static",
      html: `
        <h2>Refleksi Peserta Didik</h2>
        <p>Isilah refleksi diri berikut ini dengan jujur setelah menyelesaikan seluruh bagian LKPD Bab 4.</p>

        <div class="question-card">
          <label><strong>1. Bagian mana dari Bab 4 yang paling saya kuasai dan pahami dengan baik?</strong></label>
          <textarea id="ref1" rows="2" placeholder="Contoh: Menjelaskan cara makan shabu-shabu, kosakata bumbu dapur..."></textarea>
        </div>

        <div class="question-card">
          <label><strong>2. Bagian mana yang menurut saya masih sulit atau perlu diulang?</strong></label>
          <textarea id="ref2" rows="2" placeholder="Contoh: Membedakan cara baca kanji tertentu, menangkap detail choukai..."></textarea>
        </div>

        <div class="question-card">
          <label><strong>3. Kosakata atau ungkapan bumbu/kuliner apa yang baru saya hafal hari ini?</strong></label>
          <textarea id="ref3" rows="2" placeholder="Contoh: ポン酢 (ponzu), つゆ (tsuyu), 混ぜる (mazeru)..."></textarea>
        </div>

        <div class="question-card">
          <label><strong>4. Kanji mana yang paling menantang untuk diingat cara baca atau artinya?</strong></label>
          <textarea id="ref4" rows="2" placeholder="Contoh: 満足 (manzoku), 油 (abura), 量 (ryou)..."></textarea>
        </div>

        <div class="question-card">
          <label><strong>5. Pola kalimat mana yang perlu saya latih lebih sering dalam percakapan kerja?</strong></label>
          <textarea id="ref5" rows="2" placeholder="Contoh: ～ちゃだめです, ～てから..."></textarea>
        </div>

        <div class="question-card">
          <label><strong>6. Apa langkah konkret yang akan saya lakukan untuk memperkuat kelemahan saya?</strong></label>
          <textarea id="ref6" rows="3" placeholder="Contoh: Mendengarkan Bank Audio Bab 4 secara berulang dan latihan shadowing mandiri..."></textarea>
        </div>
      `
    }
  ]
};
