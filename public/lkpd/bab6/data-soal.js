/*
  data-soal.js
  LKPD Bahasa Jepang Bab 6 | いろいろなところに行けて、よかったです
  Level: A2.2 / Persiapan JFT-Basic / LPK (CHECKPOINT 1 EVALUASI)
  Topik: 旅行に行こう (Ayo Berwisata / Pengalaman & Transportasi Kereta)
  Sumber Kurikulum Otentik: IRODORI A2.2 (初級2) Bab 6 & Kanji Irodori Resmi
  
  PENTING:
  - Folder 'audio/' berisi file Z_[06-01]_... s.d. Z_[06-18]_....mp3 lengkap
  - Password Guru PIN: sensei123
*/

window.LKPD_DATA = {
  settings: {
    // Hash Password Guru (PIN: sensei123 via salt lkpd_bab6::v1::)
    teacherPasswordHash: "5eb1d4c01d60a45c906e5d1f8f8f683363af16f2544711ffed967ab67fa9841c",
    sessionKey: "lkpd_bab6_session_v1",
    stateKey: "lkpd_bab6_state_v1",
    listeningPlayCount: 2,
    showListeningControls: false,
    babId: "bab6"
  },

  tabs: [
    {
      id: "panduan",
      label: "Panduan",
      type: "static",
      html: `
        <div class="note guide-box">
          <h2 style="margin-top:0; color:#1d1d1f; font-weight:800; font-size:1.35rem;">
            🗺️ Bab 6: いろいろなところに行けて、よかったです (Senang Bisa Pergi ke Berbagai Tempat)
          </h2>
          <p style="font-size:0.95rem; line-height:1.6; color:#424245;">
            Selamat datang di <strong>Bab 6 &amp; Checkpoint 1 Evaluasi Komprehensif</strong>. 
            Materi ini berfokus pada kemampuan berbahasa Jepang dalam konteks berwisata di Jepang, membaca tiket transportasi Shinkansen, memahami pengumuman stasiun, menyampaikan rencana perjalanan, serta menceritakan kesan liburan yang berkesan maupun hal yang disayangkan.
          </p>

          <h3 style="font-size:1.05rem; margin-top:16px; margin-bottom:8px; color:#1d1d1f;">🎯 Target Kompetensi (Can-do Irodori A2.2 Bab 6)</h3>
          <ul style="padding-left:20px; line-height:1.7; font-size:0.9rem; color:#333;">
            <li><strong>Can-do 23 (切符・掲示):</strong> Mampu menemukan dan membaca informasi penting yang dibutuhkan pada tiket Shinkansen, tanda petunjuk di dalam kereta, serta papan pengumuman stasiun (出発地, 行き先, 到着時間, 指定席, 自由席).</li>
            <li><strong>Can-do 24 (旅行の計画):</strong> Mampu menyatakan dan menanyakan rencana perjalanan wisata kepada rekan kerja atau teman menggunakan pola <em>〜つもりです</em> dan durasi <em>〜泊〜日</em>.</li>
            <li><strong>Can-do 25 (車内・駅のアナウンス):</strong> Mampu menyimak dan memahami informasi kedatangan stasiun, nomor jalur transfer, serta kendala perjalanan akibat kecelakaan (<em>人身事故</em>) atau kerusakan sinyal (<em>信号故障</em>).</li>
            <li><strong>Can-do 26 (旅行の感想):</strong> Mampu menceritakan kesan pengalaman wisata secara sederhana: kegiatan yang dilakukan (<em>〜たり、〜たりしました</em>), rasa senang/bersyukur (<em>〜てよかったです</em>), serta hal yang disayangkan (<em>〜なくて残念でした</em>).</li>
          </ul>

          <h3 style="font-size:1.05rem; margin-top:16px; margin-bottom:8px; color:#1d1d1f;">🏁 Struktur Evaluasi Checkpoint 1 (Bab 1–6)</h3>
          <p style="font-size:0.9rem; line-height:1.6; color:#555;">
            Sebagai bab penutup Topik 3 sekaligus tonggak <strong>Checkpoint 1</strong>, evaluasi LKPD Bab 6 mencakup:
          </p>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px; margin-top:8px;">
            <div style="background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:10px;">
              <strong style="color:#059669;">1. Ujian Mini JFT-Like (32 Soal)</strong>
              <div style="font-size:0.8rem; color:#666;">Moji (10), Kaiwa (8), Choukai (8), Dokkai (6) &bull; Bobot Rapor 60%</div>
            </div>
            <div style="background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:10px;">
              <strong style="color:#2563eb;">2. Drill 14 Kanji Otentik</strong>
              <div style="font-size:0.8rem; color:#666;">8 Soal Pilihan Ganda &bull; Bobot Rapor 15%</div>
            </div>
            <div style="background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:10px;">
              <strong style="color:#7c3aed;">3. Drill Kosakata Kritis</strong>
              <div style="font-size:0.8rem; color:#666;">10 Soal Isian Bebas &bull; Bobot Rapor 15%</div>
            </div>
            <div style="background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:10px;">
              <strong style="color:#ea580c;">4. Praktik Terjemahan Guru</strong>
              <div style="font-size:0.8rem; color:#666;">5 Soal Esai Rubrik 0–4 &bull; Bobot Rapor 10%</div>
            </div>
          </div>
        </div>
      `
    },

    {
      id: "materi",
      label: "Materi",
      type: "static",
      html: `
        <h2>Ringkasan Materi Bab 6「いろいろなところに行けて、よかったです」</h2>
        <div class="note">
          Tema Utama: <strong>旅行に行こう (Ayo Berwisata / Rencana Perjalanan, Tiket Transportasi Kereta &amp; Refleksi Kesan Wisata)</strong><br>
          Standar: <strong>Can-do Irodori A2.2 (初級2) Bab 6 / Persiapan JFT-Basic &amp; Evaluasi Checkpoint 1 LPK</strong>
        </div>

        <h3>1. Tata Bahasa Kunci (文法ノート)</h3>

        <div class="grammar-box">
          <h4>➊ V-るつもりです / V-ないつもりです ＜Rencana Perjalanan Spesifik＞</h4>
          <p>Digunakan untuk menyatakan rencana atau jadwal konkret yang telah dipikirkan untuk dilakukan (atau tidak dilakukan) pada saat liburan/perjalanan. Pola ini lebih terencana dan pasti dibandingkan sekadar keinginan umum (<em>〜たいです</em>).</p>
          <ul>
            <li><strong>Bentuk Positif:</strong> Verba Bentuk Kamus (辞書形) + <strong>つもりです</strong></li>
            <li><strong>Bentuk Negatif:</strong> Verba Bentuk Nai (ナイ形) + <strong>つもりです</strong></li>
          </ul>
          <p class="ja">例：明日は、中禅寺湖に行くつもりです。（Besok saya berencana pergi ke Danau Chuzenji.）</p>
          <p class="ja">例：Ａ「連休はどうしますか？」 Ｂ「友達と京都に行くつもりです。」（Liburan panjang mau ke mana? Berencana pergi ke Kyoto bersama teman.）</p>
          <p class="ja">例：時間がないので、神社には行かないつもりです。（Karena tidak ada waktu, saya berencana tidak mengunjungi kuil.）</p>
        </div>

        <div class="grammar-box">
          <h4>➋ V-（られ）て、よかったです ／ V-（られ）なくて、残念でした ＜Kesan Terlaksana vs Disayangkan＞</h4>
          <p>Digunakan untuk menyampaikan kesan atas suatu pengalaman setelah menyebutkan alasan berupa hal yang dapat dilakukan (berhasil) atau tidak dapat dilakukan (gagal terwujud). Pola ini sering dipadukan dengan <strong>verba bentuk potensial (可能形)</strong>.</p>
          <ul>
            <li><strong>Berhasil Terlaksana (Positif):</strong> Bentuk Potensial Te-form (〜て) + <strong>よかったです / 楽しかったです / 感動しました</strong></li>
            <li><strong>Gagal / Tidak Terlaksana (Negatif):</strong> Bentuk Potensial Nakute-form (〜なくて) + <strong>残念でした</strong></li>
          </ul>
          <p class="ja">例：いろいろなところに行けて、よかったです。（Senang sekali karena bisa pergi ke berbagai tempat.）</p>
          <p class="ja">例：きれいな夕日が見られて、感動しました。（Saya sangat terkesan karena bisa melihat pemandangan matahari terbenam yang indah.）</p>
          <p class="ja">例：ショーが見られなくて、残念でした。（Sayang sekali saya tidak bisa menonton pertunjukannya.）</p>
          <p class="ja">例：海に行きましたが、水が冷たくて泳げなくて、残念でした。（Pergi ke laut, tetapi airnya masih dingin sehingga tidak bisa berenang, sayang sekali.）</p>
        </div>

        <div class="grammar-box">
          <h4>➌ S1 し、S2 し、～ ＜Menyebutkan Deretan Alasan / Kelebihan dengan Bentuk Potensial＞</h4>
          <p>Digunakan untuk menyebutkan beberapa alasan atau nilai plus dari suatu destinasi atau kegiatan wisata. Menggunakan verba bentuk biasa (普通形), khususnya bentuk potensial lampau (〜た) maupun non-lampau.</p>
          <p class="ja">例：海で泳げたし、船に乗れたし、楽しかったです。（Sangat menyenangkan karena bisa berenang di laut dan juga bisa naik kapal.）</p>
          <p class="ja">例：温泉にも入れたし、ゆっくりできたし、よかったです。（Senang sekali karena bisa berendam air panas dan bisa bersantai rileks.）</p>
          <p class="ja">例：沖縄、いいですよね。海で泳げるし、おいしいものも食べられるし。（Okinawa bagus ya. Bisa berenang di laut dan juga bisa mencicipi aneka makanan lezat.）</p>
        </div>

        <div class="grammar-box">
          <h4>➍ V-る / V-ている / V-た ＋ とき、～ ＜Keterangan Waktu Peristiwa Saat Berwisata＞</h4>
          <p>Menyatakan waktu terjadinya suatu peristiwa dengan nuansa temporal yang berbeda berdasarkan bentuk verba sebelum kata <strong>とき</strong>:</p>
          <ul>
            <li><strong>V-ているとき：</strong> Peristiwa terjadi saat aksi V sedang berlangsung di tengah-tengah perjalanan.<br>
              <span class="ja">例：道を歩いているとき、リスを見ました。（Saya melihat tupai ketika sedang berjalan di jalan.）</span><br>
              <span class="ja">例：富士山に登っているとき、空が晴れました。（Langit menjadi cerah ketika saya sedang mendaki Gunung Fuji.）</span>
            </li>
            <li><strong>V-るとき：</strong> Peristiwa terjadi sesaat <em>sebelum</em> aksi V dilakukan.<br>
              <span class="ja">例：富士山に行くとき、バスに乗りました。（Saya naik bus ketika hendak berangkat ke Gunung Fuji.）</span>
            </li>
            <li><strong>V-たとき：</strong> Peristiwa terjadi sesaat <em>setelah</em> aksi V selesai dilakukan.<br>
              <span class="ja">例：家に着いたとき、疲れて動けませんでした。（Saat sudah tiba di rumah, saya kelelahan dan tidak bisa bergerak.）</span><br>
              <span class="ja">例：ウミネコが近くに来たとき、ちょっとこわかったです。（Saat burung camar datang mendekat, saya agak takut.）</span>
            </li>
          </ul>
        </div>

        <div class="grammar-box">
          <h4>➎ 【Orang】と【Jumlah Orang】で ＜Partner &amp; Jumlah Orang Termasuk Diri Sendiri＞</h4>
          <p>Menyatakan dengan siapa dan berapa total peserta yang melakukan perjalanan bersama. Angka jumlah orang pada pola ini <strong>mencakup diri pembicara</strong>.</p>
          <p class="ja">例：友だちと2人でハウステンボスに行って来ました。（Saya pergi ke Huis Ten Bosch berdua bersama teman saya. <em>*Teman 1 orang + saya = 2 orang</em>）</p>
          <p class="ja">例：今度、今田さんとバイさんと3人で日帰り旅行に行きます。（Lain kali, saya, Imada-san, dan Bai-san bertiga akan pergi wisata sehari pulang-pergi.）</p>
        </div>

        <h3>2. Kosakata Penting Kontekstual Bab 6</h3>

        <h4>A. Tiket &amp; Transportasi Shinkansen / Kereta (切符・新幹線・駅)</h4>
        <table>
          <tr><th>Bahasa Jepang</th><th>Bacaan Kana</th><th>Arti Bahasa Indonesia</th></tr>
          <tr><td class="ja">切符</td><td class="ja">きっぷ</td><td>Tiket perjalanan / karcis kereta</td></tr>
          <tr><td class="ja">出発地</td><td class="ja">しゅっぱつち</td><td>Stasiun / kota keberangkatan</td></tr>
          <tr><td class="ja">行き先</td><td class="ja">いきさき</td><td>Stasiun / kota tujuan</td></tr>
          <tr><td class="ja">出発時間／発車</td><td class="ja">しゅっぱつじかん／はっしゃ</td><td>Waktu keberangkatan kereta</td></tr>
          <tr><td class="ja">到着時間</td><td class="ja">とうちゃくじかん</td><td>Waktu tiba di stasiun tujuan</td></tr>
          <tr><td class="ja">～発／～着</td><td class="ja">～はつ／～ちゃく</td><td>Berangkat pada ~ / Tiba pada ~</td></tr>
          <tr><td class="ja">指定席</td><td class="ja">していせき</td><td>Kursi dengan reservasi nomor kursi</td></tr>
          <tr><td class="ja">自由席</td><td class="ja">じゆうせき</td><td>Kursi bebas tanpa reservasi</td></tr>
          <tr><td class="ja">禁煙席</td><td class="ja">きんえんせき</td><td>Kursi area dilarang merokok</td></tr>
          <tr><td class="ja">グリーン車</td><td class="ja">グリーンしゃ</td><td>Gerbong eksekutif / kelas utama (Green Car)</td></tr>
          <tr><td class="ja">～号車</td><td class="ja">～ごうしゃ</td><td>Gerbong nomor ~</td></tr>
          <tr><td class="ja">乗車券</td><td class="ja">じょうしゃけん</td><td>Tiket tarif dasar jarak tempuh (ongkos perjalanan)</td></tr>
          <tr><td class="ja">特急券</td><td class="ja">とっきゅうけん</td><td>Tiket tambahan ekspres / Shinkansen</td></tr>
          <tr><td class="ja">料金</td><td class="ja">りょうきん</td><td>Biaya / tarif total tiket</td></tr>
          <tr><td class="ja">窓口／自動券売機</td><td class="ja">まどぐち／じどうけんばいき</td><td>Loket stasiun (Midori no Madoguchi) / Mesin tiket otomatis</td></tr>
        </table>

        <h4>B. Pengumuman Stasiun &amp; Kendala Perjalanan (車内・駅アナウンス・トラブル)</h4>
        <table>
          <tr><th>Bahasa Jepang</th><th>Bacaan Kana</th><th>Arti Bahasa Indonesia</th></tr>
          <tr><td class="ja">まもなく到着いたします</td><td class="ja">まもなく とうちゃく いたします</td><td>Sebentar lagi akan tiba (ragam formal pengumuman)</td></tr>
          <tr><td class="ja">お出口は右側／左側です</td><td class="ja">おでぐちは みぎがわ／ひだりがわ です</td><td>Pintu keluar berada di sebelah kanan / kiri</td></tr>
          <tr><td class="ja">～線はお乗り換えです</td><td class="ja">～せんは おのりかえ です</td><td>Penumpang jurusan ~ silakan transit/pindah kereta</td></tr>
          <tr><td class="ja">～番線</td><td class="ja">～ばんせん</td><td>Peron jalur rel nomor ~</td></tr>
          <tr><td class="ja">遅れ</td><td class="ja">おくれ</td><td>Keterlambatan kereta</td></tr>
          <tr><td class="ja">運転見合わせ</td><td class="ja">うんてんみあわせ</td><td>Penundaan sementara perjalanan kereta</td></tr>
          <tr><td class="ja">運転再開</td><td class="ja">うんてんさいかい</td><td>Pengoperasian kembali jadwal kereta</td></tr>
          <tr><td class="ja">信号故障</td><td class="ja">しんごうこしょう</td><td>Kerusakan sistem persinyalan kereta</td></tr>
          <tr><td class="ja">人身事故</td><td class="ja">じんしんじこ</td><td>Kecelakaan orang/penumpang pada lintasan rel</td></tr>
          <tr><td class="ja">悪天候</td><td class="ja">あくてんこう</td><td>Cuaca buruk (badai, salju tebal, topan)</td></tr>
          <tr><td class="ja">～のため</td><td class="ja">～のため</td><td>Dikarenakan / oleh karena (ragam formal pengumuman)</td></tr>
        </table>

        <h4>C. Aktivitas Wisata &amp; Ungkapan Kesan (旅行の活動・感想・文化)</h4>
        <table>
          <tr><th>Bahasa Jepang</th><th>Bacaan Kana</th><th>Arti Bahasa Indonesia</th></tr>
          <tr><td class="ja">～泊～日</td><td class="ja">～はく～か</td><td>Durasi menginap (misal: 1泊2日 / いっぱくふつか, 2泊3日 / にはくみっか)</td></tr>
          <tr><td class="ja">日帰り</td><td class="ja">ひがえり</td><td>Wisata PP (pergi-pulang di hari yang sama tanpa menginap)</td></tr>
          <tr><td class="ja">予定</td><td class="ja">よてい</td><td>Rencana / agenda kegiatan</td></tr>
          <tr><td class="ja">週末／連休</td><td class="ja">しゅうまつ／れんきゅう</td><td>Akhir pekan (Sabtu-Minggu) / Libur panjang berurutan</td></tr>
          <tr><td class="ja">景色</td><td class="ja">けしき</td><td>Pemandangan alam / panorama</td></tr>
          <tr><td class="ja">夕日</td><td class="ja">ゆうひ</td><td>Matahari terbenam / senja</td></tr>
          <tr><td class="ja">イルミネーション</td><td class="ja">—</td><td>Pencahayaan lampu hias malam (festival cahaya)</td></tr>
          <tr><td class="ja">名物</td><td class="ja">めいぶつ</td><td>Makanan atau cinderamata khas daerah</td></tr>
          <tr><td class="ja">お土産</td><td class="ja">おみやげ</td><td>Oleh-oleh untuk keluarga / rekan kerja</td></tr>
          <tr><td class="ja">感動した</td><td class="ja">かんどうした</td><td>Sangat terkesan / terharu kagum</td></tr>
          <tr><td class="ja">残念でした</td><td class="ja">ざんねんでした</td><td>Sangat disayangkan / kecewa tidak terlaksana</td></tr>
          <tr><td class="ja">ゆっくりできた</td><td class="ja">—</td><td>Bisa bersantai dan melepas lelah</td></tr>
        </table>

        <h3>3. Pengetahuan Budaya &amp; Sistem Tiket Kereta Jepang</h3>
        <div class="note">
          <p><strong>Dua Jenis Tiket Wajib Shinkansen:</strong></p>
          <ol>
            <li><strong>乗車券 (Jooshaken):</strong> Tiket dasar untuk berpindah tempat dari stasiun asal ke stasiun tujuan (ongkos jarak).</li>
            <li><strong>特急券 (Tokkyuuken):</strong> Tiket tambahan khusus untuk menaiki kereta super cepat (Shinkansen atau Limited Express).
              <ul>
                <li><strong>指定席 (Shiteiseki):</strong> Kursi sudah dipesan dengan nomor gerbong dan nomor kursi sebelum naik kereta. Pasti mendapat kursi walau stasiun sangat padat.</li>
                <li><strong>自由席 (Jiyuuseki):</strong> Kursi bebas di gerbong tanpa reservasi (biasanya gerbong 1–3 atau 1–5). Harganya lebih terjangkau, namun jika kereta penuh harus bersedia berdiri.</li>
                <li><strong>グリーン車 (Green Car):</strong> Gerbong kelas eksekutif dengan kursi yang lebih luas, leg room ekstra lega, dan fasilitas berkelas tinggi.</li>
              </ul>
            </li>
          </ol>
          <p><strong>Destinasi Wisata Otentik Bab 6:</strong></p>
          <ul>
            <li><strong>大阪 (Osaka):</strong> Terkenal dengan Istana Osaka (大阪城), menara Tsutenkaku (通天閣), kawasan Dotonbori, dan kuliner khas kushikatsu serta takoyaki.</li>
            <li><strong>日光 (Nikko):</strong> Kompleks kuil bersejarah Toshogu (東照宮), panorama Danau Chuzenji (中禅寺湖), dan keindahan alam pegunungan di Prefektur Tochigi.</li>
            <li><strong>ハウステンボス (Huis Ten Bosch):</strong> Taman hiburan bernuansa kota Belanda di Nagasaki dengan kincir angin, kanal, taman bunga, serta pertunjukan festival cahaya lampu malam (イルミネーション).</li>
            <li><strong>浄土ヶ浜 (Jodogahama):</strong> Pantai bebatuan putih indah di Prefektur Iwate, terkenal dengan pemandangan burung camar (ウミネコ) dan perahu wisata.</li>
            <li><strong>高尾山 (Gunung Takao):</strong> Destinasi hiking populer di Tokyo bagian barat yang dapat ditempuh hanya 1 jam dengan kereta dari pusat kota.</li>
          </ul>
        </div>
      `
    },

    {
      id: "moji",
      label: "1. 文字・語彙",
      type: "questions",
      items: [
        {
          id: "q01",
          type: "mcq",
          number: "Soal 1.",
          prompt: "新幹線の切符で、電車が出発する駅のことを（　　）と言います。",
          options: ["出発地（しゅっぱつち）", "行き先（いきさき）", "到着地（とうちゃくち）", "経由地（けいゆち）"],
          answer: 1,
          hint: "Stasiun tempat kereta memulai perjalanan (keberangkatan)."
        },
        {
          id: "q02",
          type: "mcq",
          number: "Soal 2.",
          prompt: "新幹線であらかじめ座る場所を予約してある席は、（　　）です。",
          options: ["自由席（じゆうせき）", "指定席（していせき）", "優先席（ゆうせんせき）", "禁煙席（きんえんせき）"],
          answer: 2,
          hint: "Tempat duduk yang sudah direservasi sebelumnya."
        },
        {
          id: "q03",
          type: "mcq",
          number: "Soal 3.",
          prompt: "予約をしなくても、空いている席に自由に座れる車両の席は（　　）です。",
          options: ["指定席", "自由席", "グリーン席", "指定車両"],
          answer: 2,
          hint: "Kursi tanpa reservasi pada gerbong tertentu."
        },
        {
          id: "q04",
          type: "mcq",
          number: "Soal 4.",
          prompt: "列車が目的地の駅に着く時間のことは、（　　）です。",
          options: ["出発時間", "到着時間", "乗車時間", "発車時間"],
          answer: 2,
          hint: "Waktu kedatangan di stasiun tujuan."
        },
        {
          id: "q05",
          type: "mcq",
          number: "Soal 5.",
          prompt: "事故や悪天候のため、電車の運行を一時的に止めることを運転（　　）と言います。",
          options: ["再開（さいかい）", "見合わせ（みあわせ）", "開始（かいし）", "延長（えんちょう）"],
          answer: 2,
          hint: "Istilah penundaan perjalanan kereta (unten miawase)."
        },
        {
          id: "q06",
          type: "mcq",
          number: "Soal 6.",
          prompt: "駅のアナウンスで「信号の（　　）のため、電車が遅れております」と聞こえました。",
          options: ["故障（こしょう）", "成功（せいこう）", "完成（かんせい）", "修理（しゅうり）"],
          answer: 1,
          hint: "Kerusakan pada sistem sinyal kereta."
        },
        {
          id: "q07",
          type: "mcq",
          number: "Soal 7.",
          prompt: "旅行から帰った後、職場の同僚に配るお菓子などを（　　）と言います。",
          options: ["お土産（おみやげ）", "お弁当（おべんとう）", "お薬（おくすり）", "お小遣い（おこづかい）"],
          answer: 1,
          hint: "Oleh-oleh khas wisata."
        },
        {
          id: "q08",
          type: "mcq",
          number: "Soal 8.",
          prompt: "土曜日と日曜日を合わせて休む日のことを（　　）と言います。",
          options: ["月末（げつまつ）", "週末（しゅうまつ）", "平日（へいじつ）", "年末（ねんまつ）"],
          answer: 2,
          hint: "Akhir pekan (sabtu dan minggu)."
        },
        {
          id: "q09",
          type: "mcq",
          number: "Soal 9.",
          prompt: "山の頂上から見下ろす街の（　　）が、とてもきれいでした。",
          options: ["空気", "景色（けしき）", "天気", "季節"],
          answer: 2,
          hint: "Pemandangan alam / panorama."
        },
        {
          id: "q10",
          type: "mcq",
          number: "Soal 10.",
          prompt: "来週の連休の（　　）を立てて、新幹線の切符を買いました。",
          options: ["予定（よてい）", "約束（やくそく）", "理由（りゆう）", "感想（かんそう）"],
          answer: 1,
          hint: "Rencana perjalanan / jadwal."
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
          prompt: "Ａ「今度の連休はどうするの？」<br>Ｂ「友達と京都へ（　　）つもりです。」",
          options: ["行く", "行った", "行きます", "行かない"],
          answer: 1,
          hint: "Pola menyatakan rencana: Bentuk Kamus + つもりです"
        },
        {
          id: "q12",
          type: "mcq",
          number: "Soal 12.",
          prompt: "大阪では串カツを食べ（　　）、あべのハルカスに登っ（　　）しました。",
          options: ["て／て", "たり／たり", "たら／たら", "る／る"],
          answer: 2,
          hint: "Pola menyebutkan beberapa contoh kegiatan: 〜たり、〜たりしました"
        },
        {
          id: "q13",
          type: "mcq",
          number: "Soal 13.",
          prompt: "Ａ「今回の旅行はどうでしたか？」<br>Ｂ「いろいろな場所に行（　　）、本当によかったです。」",
          options: ["って", "けて", "かないで", "ったら"],
          answer: 2,
          hint: "Pola rasa bersyukur/senang: bentuk potensial (te-form) + よかったです (ikete yokatta desu)"
        },
        {
          id: "q14",
          type: "mcq",
          number: "Soal 14.",
          prompt: "海に行きましたが、まだ水が冷たくて泳げ（　　）、残念でした。",
          options: ["なくて", "ないで", "なかって", "ず"],
          answer: 1,
          hint: "Pola menyatakan hal yang disayangkan: bentuk negatif te-form (〜なくて) + 残念でした"
        },
        {
          id: "q15",
          type: "mcq",
          number: "Soal 15.",
          prompt: "アナウンス「まもなく岡山に到着（　　）。お出口は左側です。」",
          options: ["いたします", "します", "なさいます", "おります"],
          answer: 1,
          hint: "Bentuk keigo pengumuman resmi transportasi: 到着いたします"
        },
        {
          id: "q16",
          type: "mcq",
          number: "Soal 16.",
          prompt: "駅のアナウンス「人身事故の（　　）、京浜東北線は運転を見合わせております。」",
          options: ["から", "ため", "ので", "のに"],
          answer: 2,
          hint: "Kata penghubung formal alasan/sebab dalam pengumuman: 名詞 + のため"
        },
        {
          id: "q17",
          type: "mcq",
          number: "Soal 17.",
          prompt: "今回はゆっくり観光したいので、２（　　）３日の旅行を申し込みました。",
          options: ["泊（はく）", "夜（よる）", "回（かい）", "日（ひ）"],
          answer: 1,
          hint: "Satuan menginap dalam wisata: 2泊3日 (nihaku mikka)"
        },
        {
          id: "q18",
          type: "mcq",
          number: "Soal 18.",
          prompt: "乗客「すみません、さいたま新都心に行きたいんですが…」<br>駅員「埼京線なら（　　）よ。8番線から乗ってください。」",
          options: ["動いています", "止まっています", "遅れています", "ありません"],
          answer: 1,
          hint: "Penjelasan petugas stasiun bahwa jalur Saikyo beroperasi (bergerak/berjalan lancar)."
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
          prompt: "音声（アナウンス 1）を聞いて答えてください。特急サンダーバード19号金沢行きの「自由席」は何号車ですか。",
          audioUrl: "audio/Z_[06-05]_kiku1.mp3",
          playCount: 2,
          options: [
            "1号車",
            "2号車、3号車、4号車",
            "5号車、6号車、7号車",
            "8号車、9号車"
          ],
          answer: 3,
          script: "アナウンス 1: 11時42分発 特急サンダーバード19号 金沢行きは、11番乗り場から発車します。列車は9両で到着します。前から9号車、8号車の順でいちばん後ろが1号車です。自由席は5号車、6号車、7号車、指定席は2号車、3号車、4号車、8号車、9号車、グリーン席は1号車です。"
        },
        {
          id: "q20",
          type: "listening",
          number: "Soal 20.",
          prompt: "音声（アナウンス 2）を聞いて答えてください。列車が岡山駅に着いたとき、出口は何側ですか。",
          audioUrl: "audio/Z_[06-06]_kiku2.mp3",
          playCount: 2,
          options: [
            "右側",
            "左側",
            "両側",
            "前側"
          ],
          answer: 2,
          script: "アナウンス 2: ご乗車ありがとうございました。あと3分ほどで岡山です。お出口は左側、22番線に着きます。乗り換えのご案内をいたします。新幹線、各駅に止まります「こだま729号」博多行き、7時50分、着きました同じホーム、向かい側、21番線中ほどへお越しください。山陽線倉敷方面福山行き、7時57分、2番線..."
        },
        {
          id: "q21",
          type: "listening",
          number: "Soal 21.",
          prompt: "音声（会話 1）を聞いて答えてください。高知行きの電車が遅れている原因は何ですか。",
          audioUrl: "audio/Z_[06-07]_kiku1.mp3",
          playCount: 2,
          options: [
            "大雨のため",
            "信号故障のため",
            "人身事故のため",
            "停電のため"
          ],
          answer: 2,
          script: "アナウンス：お客様にお知らせいたします。当駅13時9分発、高知行きは、信号故障のため、約30分遅れて運転を行っております。Ａ：あのう、すみません。今のアナウンス、何て言ってましたか？ Ｂ：えっと、電車が30分遅れるそうですよ。信号故障だって。信号が壊れたんですよ。"
        },
        {
          id: "q22",
          type: "listening",
          number: "Soal 22.",
          prompt: "音声（会話 2）を聞いて答えてください。駅員はさいたま新都心へ行きたい乗客に、何番線からどの電車に乗るよう案内しましたか。",
          audioUrl: "audio/Z_[06-08]_kiku2.mp3",
          playCount: 2,
          options: [
            "2番線から京浜東北線",
            "8番線から埼京線",
            "5番線から宇都宮線",
            "11番線から高崎線"
          ],
          answer: 2,
          script: "アナウンス：浦和駅と赤羽駅の間で発生した人身事故の影響で、京浜東北線などは全線で運転を見合わせています。大宮方面へお越しのお客様は埼京線をご利用ください。乗客：すみません、さいたま新都心に行きたいんですけど… 駅員：埼京線の北与野駅から歩けますよ。8番線から乗ってください。"
        },
        {
          id: "q23",
          type: "listening",
          number: "Soal 23.",
          prompt: "音声（感想 1）を聞いて答えてください。男の人は大阪で何をしましたか。",
          audioUrl: "audio/Z_[06-10]_kiku1.mp3",
          playCount: 2,
          options: [
            "串カツやたこ焼きを食べて、あべのハルカスに登った",
            "海で泳いだり、魚釣りをしたりした",
            "山に登ってリスの写真を撮った",
            "オランダの花畑でイルミネーションを見た"
          ],
          answer: 1,
          script: "Ａ：これ、お菓子、どうぞ。大阪のお土産です。 Ｂ：ありがとうございます。大阪はどうでしたか？ Ａ：すごく楽しかったですよ。串カツを食べたり、たこ焼きを食べたりしました。あべのハルカスにも登ったんですよ。 Ｂ：へえ、よかったですね。"
        },
        {
          id: "q24",
          type: "listening",
          number: "Soal 24.",
          prompt: "音声（感想 2）を聞いて答えてください。女の人が浄土ヶ浜で「残念だった」と言っていることは何ですか。",
          audioUrl: "audio/Z_[06-11]_kiku2.mp3",
          playCount: 2,
          options: [
            "船に乗れなかったこと",
            "雨が降って景色が見えなかったこと",
            "まだ水が冷たくて海で泳げなかったこと",
            "鳥にパンをあげられなかったこと"
          ],
          answer: 3,
          script: "Ａ：週末は何をしてたの？ Ｂ：友達と浄土ヶ浜へ行ったの。海がすごくきれいで、船に乗ったり、鳥にパンをあげたりして、楽しかったよ。 Ａ：海で泳いだ？ Ｂ：ううん、まだ水が冷たくて、泳げなくて残念だった。でも気持ちよかったよ。"
        },
        {
          id: "q25",
          type: "listening",
          number: "Soal 25.",
          prompt: "音声（感想 3）を聞いて答えてください。男の人はどうして高尾山を歩いて登りましたか。",
          audioUrl: "audio/Z_[06-12]_kiku3.mp3",
          playCount: 2,
          options: [
            "ケーブルカーが故障していたから",
            "ケーブルカーがすごく混んでいたから",
            "最初から歩く予定だったから",
            "電車の時間に遅れたから"
          ],
          answer: 2,
          script: "Ａ：週末、高尾山に行ったんです。 Ｂ：へー、どうでしたか？ Ａ：ケーブルカーがすごく混んでいて、歩いて登ったんです。途中でリスを見たりして楽しかったんですが、すごく疲れました。 Ｂ：でも、山頂からの景色はきれいだったでしょう？ Ａ：はい、景色がとてもきれいで、登ってよかったです。"
        },
        {
          id: "q26",
          type: "listening",
          number: "Soal 26.",
          prompt: "音声（感想 4）を聞いて答えてください。女の人は長崎のハウステンボスで何ができなかったと残念がっていますか。",
          audioUrl: "audio/Z_[06-13]_kiku4.mp3",
          playCount: 2,
          options: [
            "きれいな花畑を見ること",
            "イルミネーションを見ること",
            "時間が合わなくてショーを見ること",
            "素敵なホテルに泊まること"
          ],
          answer: 3,
          script: "Ａ：連休はどうだった？どこか行った？ Ｂ：はい、長崎のハウステンボスへ行きました。オランダの町並みやきれいな花畑を見たり、夜はイルミネーションを見たりしました。感動しました。 Ａ：ショーは見られた？ Ｂ：時間が合わなくて、ショーは見られなくて残念でした。でもホテルもすてきで、本当によかったです。"
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
            <div style="background:#f8fafc; border:2px dashed #94a3b8; border-radius:12px; padding:14px; font-family:monospace; line-height:1.7;">
              <strong>【新幹線指定席特急券・乗車券】</strong><br>
              区間：［東京］&nbsp;&rarr;&nbsp;［新大阪］<br>
              乗車日：8月10日&nbsp;&nbsp;のぞみ 25号<br>
              時間：東京発 10:00&nbsp;&nbsp;&rarr;&nbsp;&nbsp;新大阪着 12:30<br>
              座席：<strong>7号車 12番 A席</strong>（指定席・禁煙）<br>
              料金：合計 14,720円（運賃 8,910円 / 特急料金 5,810円）
            </div>
          `,
          prompt: "この切符を買った乗客は、東京駅を何時に出発しますか。",
          options: ["8時10分", "10時00分", "12時30分", "14時70分"],
          answer: 2,
          hint: "Perhatikan bagian '東京発' pada tiket."
        },
        {
          id: "q28",
          type: "mcq",
          number: "Soal 28.",
          prompt: "この切符に書かれている乗客の座席番号はどれですか。",
          options: ["25号車 10番 A席", "7号車 12番 A席", "8号車 10番 A席", "12号車 7番 A席"],
          answer: 2,
          hint: "Perhatikan bagian '座席' pada tiket."
        },
        {
          id: "q29",
          type: "mcq",
          number: "Soal 29.",
          prompt: "この新幹線の座席の種類について、正しいものはどれですか。",
          options: [
            "予約が要らない自由席である",
            "タバコが吸える喫煙席である",
            "事前に予約された禁煙の指定席である",
            "グリーン車のエグゼクティブ席である"
          ],
          answer: 3,
          hint: "Lihat keterangan '(指定席・禁煙)' pada tiket."
        },
        {
          id: "q30",
          type: "mcq",
          number: "Soal 30.",
          passage: `
            <div style="background:#fff; border:1px solid #cbd5e1; border-radius:12px; padding:14px; line-height:1.8;">
              <strong>【新幹線の切符の買い方と注意点】</strong><br>
              新幹線の切符は、JRの駅の窓口や自動券売機、インターネットなどで買うことができます。新幹線に乗るには「乗車券」と「特急券」の2種類の切符が必要です。特急券には「指定席券」と「自由席券」があります。指定席券はあらかじめ座席を確保できるので安心ですが、自由席券より少し高くなります。<br>
              新幹線の切符は、<strong>乗車日の1か月前の午前10時から発売</strong>されます。ゴールデンウィークや年末年始などの連休はすぐに指定席が満席になりますので、旅行の予定が決まったら早めに予約したほうがいいです。
            </div>
          `,
          prompt: "新幹線に乗るときに必ず必要な切符の組み合わせは何ですか。",
          options: [
            "乗車券と入場券",
            "乗車券と特急券",
            "定期券と回数券",
            "自由席券と指定席券"
          ],
          answer: 2,
          hint: "Perhatikan kalimat kedua pada paragraf pertama."
        },
        {
          id: "q31",
          type: "mcq",
          number: "Soal 31.",
          prompt: "新幹線の切符は、いつから買うことができますか。",
          options: [
            "乗車日の半年前から",
            "乗車日の1か月前の午前10時から",
            "乗車当日の朝7時から",
            "乗車日の1週間前の午後5時から"
          ],
          answer: 2,
          hint: "Perhatikan kalimat pertama pada paragraf kedua."
        },
        {
          id: "q32",
          type: "mcq",
          number: "Soal 32.",
          prompt: "文章の内容と合っているものはどれですか。",
          options: [
            "自由席券は指定席券よりも値段が高い。",
            "連休の時期は指定席が満席になりやすいので、早めの予約が推奨されている。",
            "新幹線の切符は駅の窓口でしか買うことができない。",
            "インターネットで買うときは前日にしか予約できない。"
          ],
          answer: 2,
          hint: "Lihat himbauan pada akhir teks."
        }
      ]
    },

    {
      id: "kanji",
      label: "5. Kanji",
      type: "questions",
      items: [
        {
          id: "q33",
          type: "mcq",
          number: "Soal 33.",
          prompt: "新幹線の【指定席】の切符を買いました。（下線部の読み方はどれですか）",
          options: ["していせき", "じゆうせき", "とっきゅうせき", "よていせき"],
          answer: 1,
          hint: "Kanji 指 (shi) + 定 (tei) + 席 (seki) = shiteiseki"
        },
        {
          id: "q34",
          type: "mcq",
          number: "Soal 34.",
          prompt: "人身【事故】の影響で、電車が止まっています。（下線部の読み方はどれですか）",
          options: ["じこ", "こうじ", "しごと", "こしょう"],
          answer: 1,
          hint: "Kanji 事 (ji) + 故 (ko) = jiko (kecelakaan)"
        },
        {
          id: "q35",
          type: "mcq",
          number: "Soal 35.",
          prompt: "信号の【故障】のため、運転を見合わせます。（下線部の読み方はどれですか）",
          options: ["こしょう", "じこ", "ふしょう", "しょうがい"],
          answer: 1,
          hint: "Kanji 故 (ko) + 障 (shou) = koshou (kerusakan mesin/alat)"
        },
        {
          id: "q36",
          type: "mcq",
          number: "Soal 36.",
          prompt: "まもなく次の駅に【到着】いたします。（下線部の読み方はどれですか）",
          options: ["とうちゃく", "はっしゃ", "しゅっぱつ", "ちゃくせき"],
          answer: 1,
          hint: "Kanji 到 (tou) + 着 (chaku) = touchaku (tiba/sampai)"
        },
        {
          id: "q37",
          type: "mcq",
          number: "Soal 37.",
          prompt: "【週末】に家族と温泉旅行に行きました。（下線部の読み方はどれですか）",
          options: ["しゅうまつ", "げつまつ", "ねんまつ", "こんしゅう"],
          answer: 1,
          hint: "Kanji 週 (shuu) + 末 (matsu) = shuumatsu (akhir pekan)"
        },
        {
          id: "q38",
          type: "mcq",
          number: "Soal 38.",
          prompt: "水が冷たかったので、海で【泳ぐ】ことができませんでした。（下線部の読み方はどれですか）",
          options: ["およぐ", "あるく", "のぼる", "はしる"],
          answer: 1,
          hint: "Kanji 泳 (oyo-gu) = berenang"
        },
        {
          id: "q39",
          type: "mcq",
          number: "Soal 39.",
          prompt: "京都の有名なお寺を【観光】しました。（下線部の読み方はどれですか）",
          options: ["かんこう", "りょこう", "けんがく", "あんない"],
          answer: 1,
          hint: "Kanji 観 (kan) + 光 (kou) = kankou (wisata/pariwisata)"
        },
        {
          id: "q40",
          type: "mcq",
          number: "Soal 40.",
          prompt: "飛行機に乗るため、成田【空港】へ向かいました。（下線部の読み方はどれですか）",
          options: ["くうこう", "みなと", "えき", "こうくう"],
          answer: 1,
          hint: "Kanji 空 (kuu) + 港 (kou) = kuukou (bandara)"
        }
      ]
    },

    {
      id: "kosakata",
      label: "6. Kosakata",
      type: "questions",
      items: [
        {
          id: "v01",
          type: "vocab",
          number: "Drill 1.",
          prompt: "Stasiun tempat kereta memulai perjalanan / keberangkatan (tulis hiragana atau kanji):",
          accepted: ["しゅっぱつ", "出発", "しゅっぱつち", "出発地", "shuppatsu", "shuppatsuchi"]
        },
        {
          id: "v02",
          type: "vocab",
          number: "Drill 2.",
          prompt: "Waktu kedatangan di stasiun tujuan (tulis hiragana atau kanji):",
          accepted: ["とうちゃく", "到着", "とうちゃくじかん", "到着時間", "touchaku", "touchakujikan"]
        },
        {
          id: "v03",
          type: "vocab",
          number: "Drill 3.",
          prompt: "Tempat duduk yang sudah dipesan / reservasi (tulis hiragana atau kanji):",
          accepted: ["していせき", "指定席", "shiteiseki"]
        },
        {
          id: "v04",
          type: "vocab",
          number: "Drill 4.",
          prompt: "Tempat duduk bebas tanpa reservasi (tulis hiragana atau kanji):",
          accepted: ["じゆうせき", "自由席", "jiyuuseki", "jiyuseki"]
        },
        {
          id: "v05",
          type: "vocab",
          number: "Drill 5.",
          prompt: "Kecelakaan (misal pada jalur kereta) (tulis hiragana atau kanji):",
          accepted: ["じこ", "事故", "jiko"]
        },
        {
          id: "v06",
          type: "vocab",
          number: "Drill 6.",
          prompt: "Kerusakan mekanik / sinyal (tulis hiragana atau kanji):",
          accepted: ["こしょう", "故障", "koshou", "kosho"]
        },
        {
          id: "v07",
          type: "vocab",
          number: "Drill 7.",
          prompt: "Oleh-oleh khas wisata (tulis hiragana atau kanji):",
          accepted: ["おみやげ", "お土産", "omiyage"]
        },
        {
          id: "v08",
          type: "vocab",
          number: "Drill 8.",
          prompt: "Liburan beruntun / libur panjang (tulis hiragana atau kanji):",
          accepted: ["れんきゅう", "連休", "renkyuu", "renkyu"]
        },
        {
          id: "v09",
          type: "vocab",
          number: "Drill 9.",
          prompt: "Pemandangan alam / pemandangan indah (tulis hiragana atau kanji):",
          accepted: ["けしき", "景色", "keshiki"]
        },
        {
          id: "v10",
          type: "vocab",
          number: "Drill 10.",
          prompt: "Rencana / agenda (tulis hiragana atau kanji):",
          accepted: ["よてい", "予定", "yotei"]
        }
      ]
    },

    {
      id: "terjemahan",
      label: "7. Terjemahan",
      type: "questions",
      items: [
        {
          id: "tr01",
          type: "translation",
          number: "Terjemahan 1.",
          prompt: "Terjemahkan ke dalam bahasa Jepang:<br><em>'Saya berencana pergi ke Osaka selama 3 hari 2 malam naik Shinkansen.'</em>",
          modelAnswer: "新幹線で2泊3日で大阪へ行くつもりです。（しんかんせんでにはくみっかでおおさかへいくつもりです）"
        },
        {
          id: "tr02",
          type: "translation",
          number: "Terjemahan 2.",
          prompt: "Terjemahkan ke dalam bahasa Jepang:<br><em>'Cuacanya bagus, senang sekali bisa pergi ke berbagai tempat.'</em>",
          modelAnswer: "天気がよくて、いろいろな場所に行けてよかったです。（てんきがよくて、いろいろなところにいけてよかったです）"
        },
        {
          id: "tr03",
          type: "translation",
          number: "Terjemahan 3.",
          prompt: "Terjemahkan ke dalam bahasa Jepang:<br><em>'Sayang sekali airnya masih dingin sehingga tidak bisa berenang di laut.'</em>",
          modelAnswer: "まだ水が冷たくて、海で泳げなくて残念でした。（まだみずがつめたくて、うみでおよげなくてざんねんでした）"
        },
        {
          id: "tr04",
          type: "translation",
          number: "Terjemahan 4.",
          prompt: "Terjemahkan ke dalam bahasa Jepang:<br><em>'Akibat kerusakan sinyal, kereta terlambat sekitar 30 menit.'</em>",
          modelAnswer: "信号故障のため、電車が約30分遅れております。（しんごうこしょうのため、でんしゃがやくさんじゅっぷんおくれています）"
        },
        {
          id: "tr05",
          type: "translation",
          number: "Terjemahan 5.",
          prompt: "Terjemahkan ke dalam bahasa Jepang (Pengumuman resmi):<br><em>'Kereta akan segera tiba di stasiun. Pintu keluar berada di sebelah kiri.'</em>",
          modelAnswer: "まもなく駅に到着いたします。お出口は左側です。（まもなくえきにとうちゃくいたします。おでぐちはひだりがわです）"
        }
      ]
    },

    {
      id: "audiobank",
      label: "Bank Audio",
      type: "audiobank",
      items: [
        { track: "Track 01", file: "Z_[06-05]_kiku1.mp3", title: "アナウンス 1: 特急サンダーバード金沢行き案内 (Gerbong Bebas & Reservasi)" },
        { track: "Track 02", file: "Z_[06-06]_kiku2.mp3", title: "アナウンス 2: 新幹線岡山駅到着・乗り換え案内 (Pintu Keluar & Jalur Transfer)" },
        { track: "Track 03", file: "Z_[06-07]_kiku1.mp3", title: "会話 1: 信号故障による列車の遅延アナウンスと確認 (Kerusakan Sinyal)" },
        { track: "Track 04", file: "Z_[06-08]_kiku2.mp3", title: "会話 2: 人身事故による運転見合わせと埼京線案内 (Pengalihan Rute)" },
        { track: "Track 05", file: "Z_[06-10]_kiku1.mp3", title: "旅行の感想 1: 大阪旅行（串カツ・たこ焼き・あべのハルカス）" },
        { track: "Track 06", file: "Z_[06-11]_kiku2.mp3", title: "旅行の感想 2: 浄土ヶ浜（遊覧船・鳥の餌付け・海で泳げず残念）" },
        { track: "Track 07", file: "Z_[06-12]_kiku3.mp3", title: "旅行の感想 3: 高尾山ハイキング（混雑・徒歩登山・山頂の絶景）" },
        { track: "Track 08", file: "Z_[06-13]_kiku4.mp3", title: "旅行の感想 4: ハウステンボス（花畑・イルミネーション・ショー見られず）" }
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
        <h2>Refleksi Pembelajaran Bab 6 &amp; Checkpoint 1</h2>
        <div class="note">
          Luangkan waktu untuk merefleksikan pencapaian belajar Anda pada materi <strong>Bab 6: 「いろいろなところに行けて、よかったです」</strong> dan target kompetensi <strong>Checkpoint 1 (Bab 1–6)</strong>.
        </div>

        <h3>Evaluasi Mandiri Can-do (Irodori A2.2 Bab 6)</h3>
        <table>
          <tr>
            <th>Can-do Bab 6</th>
            <th>Pernyataan Kompetensi</th>
            <th>Tingkat Pemahaman</th>
          </tr>
          <tr>
            <td><strong>Can-do 23</strong></td>
            <td>Saya dapat menemukan dan membaca informasi penting pada tiket Shinkansen, petunjuk gerbong, dan papan stasiun (出発地, 行き先, 到着時間, 指定席, 自由席).</td>
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
            <td><strong>Can-do 24</strong></td>
            <td>Saya dapat menyatakan dan menanyakan rencana perjalanan wisata kepada rekan kerja atau teman (pola ～つもりです dan durasi ～泊～日).</td>
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
            <td><strong>Can-do 25</strong></td>
            <td>Saya dapat menyimak dan memahami pengumuman stasiun/kereta tentang waktu kedatangan, jalur transfer, serta kendala operasional (人身事故, 信号故障).</td>
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
            <td><strong>Can-do 26</strong></td>
            <td>Saya dapat menceritakan kesan pengalaman wisata secara sederhana: aktivitas yang dilakukan (～たり～たり), rasa bersyukur/senang (～てよかったです), dan hal yang disayangkan (～なくて残念でした).</td>
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

        <h3>Catatan Refleksi Pribadi Siswa</h3>
        <textarea id="catatanRefleksi" style="width:100%;height:120px;border-radius:12px;border:1px solid #ccc;padding:12px;font-family:inherit;font-size:0.95rem;" placeholder="Tuliskan materi yang paling Anda sukai atau tantangan yang dihadapi pada Bab 6 / Checkpoint 1 ini..."></textarea>
      `
    }
  ]
};
