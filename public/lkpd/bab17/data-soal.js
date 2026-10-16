/*
  data-soal.js - LKPD Bab 17: 第17課「日本語が前より話せるようになりました」
  Kurikulum Irodori Nihongo de Seikatsu 初級2 (A2.2)
  Standar CEFR A2 / JFT-Basic / LPK Terstandar KKM 85 pt
*/

window.LKPD_DATA = {
  settings: {
    babId: "bab17",
    babTitle: "第17課「日本語が前より話せるようになりました」",
    subTitle: "成長と変化・私の人生（日本語の上達・生活の変化・これまでの歩み）",
    canDo: "Can-do 64, Can-do 65, Can-do 66",
    sessionKey: "lkpd_bab17_session_v5",
    stateKey: "lkpd_bab17_state_v5",
    teacherPasswordHash: "9396f41310103ff22b5203e0b698a8517fe84f42a031cccdc0508dda25198187",
    listeningPlayCount: 2,
    showListeningControls: false
  },

  tabs: [
    /* ================= 1. PANDUAN RESMI ================= */
    {
      id: "panduan",
      label: "Panduan",
      type: "static",
      html: `
        <h2>Panduan Penggunaan LKPD Bab 17</h2>
        <div class="meta-box" style="background:#fffbeb; border:1px solid #f59e0b; padding:16px; border-radius:12px; margin-bottom:18px;">
          <p><strong>Satuan Pendidikan / LPK:</strong> LPK JP10 Outsutsuki (Standardisasi JF CEFR A2)</p>
          <p><strong>Mata Pelajaran:</strong> Bahasa Jepang (Irodori 初級2 - Bab 17)</p>
          <p><strong>Topik:</strong> 第17課「日本語が前より話せるようになりました」 • 日本生活での自己成長／過去と現在の比較</p>
          <p><strong>Alokasi Waktu:</strong> 90 Menit (Teori, Latihan Terbimbing & Asesmen Mandiri)</p>
          <p><strong>Standar Kelulusan KKM LPK:</strong> Nilai Akhir &ge; 85.0 pt (Tuntas KKM) | Mini JFT-like &ge; 85.0 pt | Skala JFT-Basic &ge; 200/250</p>
        </div>

        <h3>A. Capaian Pembelajaran (Can-Do Irodori Bab 17):</h3>
        <ul>
          <li><strong>Can-do 64:</strong>  日本に来たばかりの頃と現在を比較して、できるようになったことや生活の変化を話すことができる。</li>
          <li><strong>Can-do 65:</strong>  他の人の成長や日本生活での変化に関する話を聞いて、共感しながら理解することができる。</li>
          <li><strong>Can-do 66:</strong>  日本での経験や成長を振り返る作文やスピーチを読んで、その気持ちを理解することができる。</li>
        </ul>

        <h3>B. Struktur Kegiatan Pembelajaran LKPD:</h3>
        <ol>
          <li><strong>Materi & Tata Bahasa:</strong> Mempelajari ringkasan pola kalimat, kosakata fungsional, dan etika komunikasi Jepang.</li>
          <li><strong>Ujian Mini JFT-Basic (30 Butir):</strong>
            <ul>
              <li>Seksi 1: 文字・語彙 (10 Soal - Pemahaman Huruf Kanji & Kosakata)</li>
              <li>Seksi 2: 会話表現 (8 Soal - Respon Percakapan & Ungkapan Kontekstual)</li>
              <li>Seksi 3: 聴解 (6 Soal - Menyimak Audio Otentik Penutur Asli Studio)</li>
              <li>Seksi 4: 読解 (6 Soal - Membaca Teks Pengumuman & Dokumen Praktis)</li>
            </ul>
          </li>
          <li><strong>Suplemen Penguatan Kompetensi:</strong> Latihan 10 Kanji Dasar, 10 Kosakata Kunci, dan 5 Kalimat Terjemahan.</li>
          <li><strong>Bank Audio Otentik:</strong> Dilengkapi akses pemutaran seluruh rekaman studio penutur asli Jepang bab ini.</li>
          <li><strong>Refleksi Diri (Jiko Hyouka):</strong> Lembar evaluasi kemandirian belajar peserta didik.</li>
        </ol>
      `
    },

    /* ================= 2. RINGKASAN MATERI ================= */
    {
      id: "materi",
      label: "Materi",
      type: "static",
      html: `
        <h2>Ringkasan Materi & Tata Bahasa Bab 17</h2>
        <div class="vocab-grid">
          <div class="vocab-card" style="background:#f8fafc; border:1px solid #cbd5e1; padding:16px; border-radius:12px; margin-bottom:16px;">
            <h4 style="color:#1e3a8a; border-bottom:2px solid #3b82f6; padding-bottom:6px;">Pola Tata Bahasa Utama</h4>
            <ul>
              
                <li style="margin-bottom:12px;">
                  <strong style="color:#0f172a; font-size:1.05rem;">V［辞書形／可能形］＋ようになりました（能力・状態の変化）</strong><br>
                  <span style="color:#334155;">Menyatakan perubahan dari kondisi sebelumnya tidak bisa/terbiasa menjadi bisa atau terbiasa dilakukan.</span><br>
                  <em style="color:#047857; font-weight:bold;">Contoh: 日本語が前より話せるようになりました。(Saya sudah menjadi lebih bisa berbicara bahasa Jepang dibanding dulu.)</em>
                </li>
              
                <li style="margin-bottom:12px;">
                  <strong style="color:#0f172a; font-size:1.05rem;">V［て形］＋よかったです（安堵・感謝）</strong><br>
                  <span style="color:#334155;">Menyatakan rasa syukur atau kelegaan atas apa yang telah dialami.</span><br>
                  <em style="color:#047857; font-weight:bold;">Contoh: 日本に来て本当によかったです。(Saya sangat bersyukur/senang telah datang ke Jepang.)</em>
                </li>
              
                <li style="margin-bottom:12px;">
                  <strong style="color:#0f172a; font-size:1.05rem;">～に比べて／前と違って（比較）</strong><br>
                  <span style="color:#334155;">Membandingkan situasi masa lalu saat baru tiba dengan kondisi saat ini.</span><br>
                  <em style="color:#047857; font-weight:bold;">Contoh: 1年前に比べて、日本の習慣に慣れました。</em>
                </li>
              
            </ul>
          </div>

          <div class="vocab-card" style="background:#f8fafc; border:1px solid #cbd5e1; padding:16px; border-radius:12px;">
            <h4 style="color:#1e3a8a; border-bottom:2px solid #3b82f6; padding-bottom:6px;">Kosakata Penting Bab 17</h4>
            <table style="width:100%; border-collapse:collapse; margin-top:8px;">
              <thead>
                <tr style="background:#e2e8f0; text-align:left;">
                  <th style="padding:8px; border:1px solid #cbd5e1;">Bahasa Jepang</th>
                  <th style="padding:8px; border:1px solid #cbd5e1;">Arti Bahasa Indonesia</th>
                </tr>
              </thead>
              <tbody>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">成長 (せいちょう)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Pertumbuhan / perkembangan diri</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">上達する (じょうたつする)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Meningkat kemampuannya / semakin mahir</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">慣れる (なれる)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Menjadi terbiasa / adaptasi</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">会話 (かいわ)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Percakapan</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">一人暮らし (ひとりぐらし)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Tinggal mandiri sendirian</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">自信 (じしん)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Percaya diri</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">苦労 (くろう)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Jerih payah / kesulitan / perjuangan</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">思い出 (おもいで)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Kenangan berkesan</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">親切 (しんせつ)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Kebaikan hati / ramah</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">振り返る (ふりかえる)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Merenungkan kembali / menoleh ke belakang</td>
                  </tr>
                
              </tbody>
            </table>
          </div>
        </div>
      `
    },

    /* ================= 3. MOJI-GOI (10 SOAL) ================= */
    {
      id: "moji",
      label: "1. 文字・語彙",
      type: "questions",
      items: [
        {
          id: "q1",
          type: "mcq",
          number: "Soal 1.",
          prompt: "「成長」の読み方はどれですか。",
          options: ["こうきょう", "しやくしょ", "としょかん", "びじゅつかん"],
          answer: 1
        },
        {
          id: "q2",
          type: "mcq",
          number: "Soal 2.",
          prompt: "文の（　　）脈に最も合う言葉を選んでください。<br>町のことについて相談したいので、（　　）の窓口へ行きました。",
          options: ["上達する", "映画館", "コンビニ", "公園"],
          answer: 1
        },
        {
          id: "q3",
          type: "mcq",
          number: "Soal 3.",
          prompt: "「慣れる」の意味はどれですか。",
          options: ["Menjadi terbiasa / adaptasi", "Restoran cepat saji", "Stasiun kereta", "Rumah sakit"],
          answer: 1
        },
        {
          id: "q4",
          type: "mcq",
          number: "Soal 4.",
          prompt: "文の（　　）に入る適切な語彙を選んでください。<br>壁に利用案内のポスターが（　　）あります。",
          options: ["貼って", "食べて", "飲んで", "寝て"],
          answer: 1
        },
        {
          id: "q5",
          type: "mcq",
          number: "Soal 5.",
          prompt: "「会話」の読み方はどれですか。",
          options: ["びじゅつかん", "たいそうかん", "ゆうびんきょく", "ぎんこう"],
          answer: 1
        },
        {
          id: "q6",
          type: "mcq",
          number: "Soal 6.",
          prompt: "「一人暮らし」の意味として最も適切なものはどれですか。",
          options: ["Tinggal mandiri sendirian", "Peralatan dapur", "Tiket bioskop", "Menu makan siang"],
          answer: 1
        },
        {
          id: "q7",
          type: "mcq",
          number: "Soal 7.",
          prompt: "「自信」の読み方はどれですか。",
          options: ["てんじ", "あんない", "ちゅうし", "よやく"],
          answer: 1
        },
        {
          id: "q8",
          type: "mcq",
          number: "Soal 8.",
          prompt: "文の（　　）に入る言葉を選んでください。<br>施設の利用について詳しく知りたいので、（　　）をよく読みました。",
          options: ["親切", "小説", "マンガ", "レシピ"],
          answer: 1
        },
        {
          id: "q9",
          type: "mcq",
          number: "Soal 9.",
          prompt: "「苦労」の意味はどれですか。",
          options: ["Jerih payah / kesulitan / perjuangan", "Hari buka toko", "Hari gajian", "Hari perayaan festival"],
          answer: 1
        },
        {
          id: "q10",
          type: "mcq",
          number: "Soal 10.",
          prompt: "「思い出」の読み方はどれですか。",
          options: ["にゅうかんりょう", "しゅっぱつりょう", "でんきだい", "うんちん"],
          answer: 1
        }
      ]
    },

    /* ================= 4. KAIWA HYOUGEN (8 SOAL) ================= */
    {
      id: "kaiwa",
      label: "2. 会話表現",
      type: "questions",
      items: [
        {
          id: "q11",
          type: "mcq",
          number: "Soal 11.",
          prompt: "A：「すみません、こちらの展示室に入ってもいいですか。」<br>B：「はい、どうぞ。（　　）自由にご覧ください。」",
          options: ["中に入って", "外に出て", "入らないで", "帰って"],
          answer: 1
        },
        {
          id: "q12",
          type: "mcq",
          number: "Soal 12.",
          prompt: "A：「このパンフレット、もらってもいいですか。」<br>B：「ええ、そちらに並べて（　　）ので、ご自由にお持ち帰りください。」",
          options: ["あります", "います", "みます", "おきます"],
          answer: 1
        },
        {
          id: "q13",
          type: "mcq",
          number: "Soal 13.",
          prompt: "A：「週末、どこかおすすめの場所はありますか。」<br>B：「新しい市民ギャラリーがオープンしましたよ。ぜひ一度（　　）みてください。」",
          options: ["行って", "行かないで", "帰って", "やめて"],
          answer: 1
        },
        {
          id: "q14",
          type: "mcq",
          number: "Soal 14.",
          prompt: "A：「こちらの施設は何時から何時まで利用できますか。」<br>B：「午前9時から午後5時（　　）となっております。」",
          options: ["まで", "から", "より", "ほど"],
          answer: 1
        },
        {
          id: "q15",
          type: "mcq",
          number: "Soal 15.",
          prompt: "A：「利用カードを作りたいんですが、何が必要ですか。」<br>B：「身分証明書を見せて（　　）ますか。」",
          options: ["いただけ", "あげ", "くれ", "みせ"],
          answer: 1
        },
        {
          id: "q16",
          type: "mcq",
          number: "Soal 16.",
          prompt: "窓口：「何かお困りですか。」<br>客：「はい、この部屋の予約の仕方を（　　）んですが。」",
          options: ["教えてほしい", "忘れてほしい", "言わないでほしい", "怒ってほしい"],
          answer: 1
        },
        {
          id: "q17",
          type: "mcq",
          number: "Soal 17.",
          prompt: "A：「館内での写真撮影はできますか。」<br>B：「申し訳ございません。特別展示室での撮影は（　　）おります。」",
          options: ["ご遠慮いただいて", "おすすめして", "大歓迎して", "お願いして"],
          answer: 1
        },
        {
          id: "q18",
          type: "mcq",
          number: "Soal 18.",
          prompt: "A：「今日は案内してくださって、ありがとうございました。」<br>B：「いいえ、またいつでもお気軽に（　　）ください。」",
          options: ["お越し", "お帰り", "お休み", "お怒り"],
          answer: 1
        }
      ]
    },

    /* ================= 5. CHOUKAI (6 SOAL AUDIO OTENTIK) ================= */
    {
      id: "choikai",
      label: "3. 聴解",
      type: "questions",
      items: [
        
        {
          id: "q19",
          type: "listening",
          number: "Soal 19.",
          prompt: "ホアさんは日本に来てから何ができるようになりましたか。",
          options: ["日本人の同僚と日本語で冗談を言い合えるようになった","車を運転すること","フランス語を話すこと","毎日外食すること"],
          answer: 1,
          audioUrl: "audio/Z_[17-01]_kiku1.mp3",
          script: "最初は挨拶しかできませんでしたが、最近は職場の同僚と休憩時間に冗談を言って笑い合えるようになりました。"
        },
        
        {
          id: "q20",
          type: "listening",
          number: "Soal 20.",
          prompt: "食べ物について、どのような変化がありましたか。",
          options: ["最初は苦手だった納豆や刺身が美味しく食べられるようになった","お米が嫌いになった","甘いものしか食べなくなった","何も変わらない"],
          answer: 1,
          audioUrl: "audio/Z_[17-02]_kiku2.mp3",
          script: "最初は納豆の匂いがどうしてもダメだったんですが、今では毎朝ご飯に乗せて美味しく食べられるようになりました。"
        },
        
        {
          id: "q21",
          type: "listening",
          number: "Soal 21.",
          prompt: "職場で仕事のやり方はどのように変わりましたか。",
          options: ["指示を待つだけでなく、自分で判断して後輩にも教えられるようになった","仕事をサボるようになった","一人で何もしなくなった","毎日ミスをする"],
          answer: 1,
          audioUrl: "audio/Z_[17-03]_kiku3.mp3",
          script: "1年経って機械の操作に慣れ、最近は新しく入ってきた後輩実習生に仕事のコツを教えられるようになりました。"
        },
        
        {
          id: "q22",
          type: "listening",
          number: "Soal 22.",
          prompt: "来日当初の失敗談として話していることは何ですか。",
          options: ["電車の快速と各駅停車を間違えて遠くまで行ってしまったこと","パスポートを無くしたこと","財布を忘れたこと","寝坊したこと"],
          answer: 1,
          audioUrl: "audio/Z_[17-06]_kiku1.mp3",
          script: "日本に来たばかりの頃、普通電車に乗るはずが特急に乗ってしまい、降りられなくなって隣の県まで行ってしまいました。"
        },
        
        {
          id: "q23",
          type: "listening",
          number: "Soal 23.",
          prompt: "困ったときに助けてくれたのは誰ですか。",
          options: ["いつも親切に教えてくれたアパートの大家さんと職場の主任","見知らぬ通行人","警察官だけ","誰にも助けてもらえなかった"],
          answer: 1,
          audioUrl: "audio/Z_[17-07]_kiku2.mp3",
          script: "風邪をひいて心細かったとき、職場の主任が薬を届けてくれて本当に温かい気持ちになりました。"
        },
        
        {
          id: "q24",
          type: "listening",
          number: "Soal 24.",
          prompt: "話し手が「日本に来てよかった」と感じている一番の理由は何ですか。",
          options: ["技術を身につけ、人として大きく成長できたと実感できるから","お金持ちになれたから","買い物がたくさんできたから","遊ぶ時間が長いから"],
          answer: 1,
          audioUrl: "audio/Z_[17-10]_hanasu1.mp3",
          script: "大変なこともたくさんありましたが、乗り越えたことで自分に自信がつきました。日本に来て本当によかったと心から思います。"
        }
      ]
    },

    /* ================= 6. DOKKAI (6 SOAL) ================= */
    {
      id: "dokkai",
      label: "4. 読解",
      type: "questions",
      items: [
        {
          id: "q25",
          type: "mcq",
          number: "Soal 25.",
          passage: "【市民センター利用案内】<br>●開館時間：午前9:00～午後9:00<br>●休館日：毎週月曜日（祝日の場合は翌平日）および年末年始（12月29日～1月3日）<br>●会議室やホールの予約は利用日の2か月前の初日から受け付けます。<br>●館内は全館禁煙です。ゴミは各自でお持ち帰りください。",
          prompt: "市民センターの休館日はいつですか。",
          options: ["毎週月曜日（祝日の場合は翌平日）と年末年始", "毎週日曜日", "年中無休", "毎週水曜日"],
          answer: 1
        },
        {
          id: "q26",
          type: "mcq",
          number: "Soal 26.",
          prompt: "会議室を予約したい場合、いつから申し込むことができますか。",
          options: ["利用する日の2か月前の初日から", "利用する当日のみ", "半年前から", "いつでも自由に使える"],
          answer: 1
        },
        {
          id: "q27",
          type: "mcq",
          number: "Soal 27.",
          prompt: "利用者が守らなければならないルールとして書かれていることはどれですか。",
          options: ["館内は全館禁煙で、ゴミは持ち帰ること", "ゴミを廊下に捨てること", "タバコをどこでも吸えること", "大声で歌うこと"],
          answer: 1
        },
        {
          id: "q28",
          type: "mcq",
          number: "Soal 28.",
          passage: "【市立図書館からのお知らせ】<br>●本の貸出冊数は1人10冊まで、期間は2週間です。<br>●返却が遅れると、新しい本の貸出ができなくなる場合があります。<br>●学習コーナーではパソコンの持ち込みが可能ですが、音の出る機器のご使用はご遠慮ください。",
          prompt: "本は何冊まで、何日間借りることができますか。",
          options: ["1人10冊まで、2週間借りられる", "1人1冊のみ、1日だけ", "何冊でも無制限、1年間", "5冊まで、3日間"],
          answer: 1
        },
        {
          id: "q29",
          type: "mcq",
          number: "Soal 29.",
          prompt: "学習コーナーでパソコンを使うとき、どのような注意が必要ですか。",
          options: ["音が出る設定や機器の使用は控えること", "必ず大音量で音楽を流すこと", "パソコンを使ってはいけないこと", "飲食しながら騒ぐこと"],
          answer: 1
        },
        {
          id: "q30",
          type: "mcq",
          number: "Soal 30.",
          prompt: "返却期限を過ぎて本を返さない場合、どうなりますか。",
          options: ["新しい本の貸出ができなくなる場合がある", "罰金1万円を払う", "図書館に入れなくなる", "警察に通報される"],
          answer: 1
        }
      ]
    },

    /* ================= 7. KANJI (10 SOAL) ================= */
    {
      id: "kanji",
      label: "Kanji",
      type: "questions",
      items: [
        { id: "k1", type: "mcq", number: "Kanji 1.", prompt: "「町」の正しい読み方はどれですか。", options: ["まち", "むら", "いえ", "みち"], answer: 1 },
        { id: "k2", type: "mcq", number: "Kanji 2.", prompt: "「利用」の正しい読み方はどれですか。", options: ["りよう", "しよう", "きよう", "さよう"], answer: 1 },
        { id: "k3", type: "mcq", number: "Kanji 3.", prompt: "「案内」の正しい読み方はどれですか。", options: ["あんない", "べんきょう", "れんしゅう", "しゅくだい"], answer: 1 },
        { id: "k4", type: "mcq", number: "Kanji 4.", prompt: "「市民」の正しい読み方はどれですか。", options: ["しみん", "こくみん", "じんみん", "のうみん"], answer: 1 },
        { id: "k5", type: "mcq", number: "Kanji 5.", prompt: "「窓口」の正しい読み方はどれですか。", options: ["まどぐち", "いりぐち", "でぐち", "かいさつ"], answer: 1 },
        { id: "k6", type: "mcq", number: "Kanji 6.", prompt: "「資料」の正しい読み方はどれですか。", options: ["しりょう", "ざいりょう", "きゅうりょう", "むりょう"], answer: 1 },
        { id: "k7", type: "mcq", number: "Kanji 7.", prompt: "「無料」の正しい読み方はどれですか。", options: ["むりょう", "ゆうりょう", "きゅうりょう", "りょうきん"], answer: 1 },
        { id: "k8", type: "mcq", number: "Kanji 8.", prompt: "「予約」の正しい読み方はどれですか。", options: ["よやく", "やくそく", "けいやく", "よてい"], answer: 1 },
        { id: "k9", type: "mcq", number: "Kanji 9.", prompt: "「受付」の正しい読み方はどれですか。", options: ["うけつけ", "ひきうけ", "うけとり", "そうふ"], answer: 1 },
        { id: "k10", type: "mcq", number: "Kanji 10.", prompt: "「説明」の正しい読み方はどれですか。", options: ["せつめい", "しょうめい", "はつめい", "ぶんめい"], answer: 1 }
      ]
    },

    /* ================= 8. KOSAKATA (10 SOAL) ================= */
    {
      id: "kosakata",
      label: "Kosakata",
      type: "matching",
      items: [
        
        { id: "voc1", ja: "成長", idText: "Pertumbuhan / perkembangan diri" },
        
        { id: "voc2", ja: "上達する", idText: "Meningkat kemampuannya / semakin mahir" },
        
        { id: "voc3", ja: "慣れる", idText: "Menjadi terbiasa / adaptasi" },
        
        { id: "voc4", ja: "会話", idText: "Percakapan" },
        
        { id: "voc5", ja: "一人暮らし", idText: "Tinggal mandiri sendirian" },
        
        { id: "voc6", ja: "自信", idText: "Percaya diri" },
        
        { id: "voc7", ja: "苦労", idText: "Jerih payah / kesulitan / perjuangan" },
        
        { id: "voc8", ja: "思い出", idText: "Kenangan berkesan" },
        
        { id: "voc9", ja: "親切", idText: "Kebaikan hati / ramah" },
        
        { id: "voc10", ja: "振り返る", idText: "Merenungkan kembali / menoleh ke belakang" }
      ]
    },

    /* ================= 9. TERJEMAHAN (5 SOAL) ================= */
    {
      id: "terjemahan",
      label: "Terjemahan",
      type: "questions",
      items: [
        {
          id: "tr1",
          type: "translation",
          number: "Soal T1.",
          prompt: "Berbagai materi dan foto dipamerkan di ruang pameran.",
          sample: "展示室にいろいろな資料や写真が展示してあります。"
        },
        {
          id: "tr2",
          type: "translation",
          number: "Soal T2.",
          prompt: "Silakan coba berkunjung ke perpustakaan kota sekali.",
          sample: "ぜひ一度、市立図書館へ行ってみてください。"
        },
        {
          id: "tr3",
          type: "translation",
          number: "Soal T3.",
          prompt: "Dari jam berapa sampai jam berapa fasilitas ini dibuka?",
          sample: "この施設は何時から何時まで開いていますか。"
        },
        {
          id: "tr4",
          type: "translation",
          number: "Soal T4.",
          prompt: "Bisakah Anda mengajarkan cara meminjam buku di sini?",
          sample: "ここで本を借りる方法を教えていただけますか。"
        },
        {
          id: "tr5",
          type: "translation",
          number: "Soal T5.",
          prompt: "Dilarang merokok dan buanglah sampah di rumah masing-masing.",
          sample: "全館禁煙ですので、ゴミは各自でお持ち帰りください。"
        }
      ]
    },

    /* ================= 10. BANK AUDIO OTENTIK ================= */
    {
      id: "bankaudio",
      label: "🎧 Bank Audio Bab 17",
      type: "audiobank",
      items: [
  {
    "track": "17-01",
    "file": "Z_[17-01]_kiku1.mp3",
    "title": "聞きましょう① — 日本語の上達（聞き取りと会話）"
  },
  {
    "track": "17-02",
    "file": "Z_[17-02]_kiku2.mp3",
    "title": "聞きましょう① — 食事や料理の変化（納豆が食べられる）"
  },
  {
    "track": "17-03",
    "file": "Z_[17-03]_kiku3.mp3",
    "title": "聞きましょう① — 仕事での役割（指導する立場へ）"
  },
  {
    "track": "17-04",
    "file": "Z_[17-04]_katachi1.mp3",
    "title": "形に注目① — ～ようになりました"
  },
  {
    "track": "17-05",
    "file": "Z_[17-05]_katachi2.mp3",
    "title": "形に注目② — ～なくなりました"
  },
  {
    "track": "17-06",
    "file": "Z_[17-06]_kiku1.mp3",
    "title": "聞きましょう② — 日本に来たばかりの失敗談"
  },
  {
    "track": "17-07",
    "file": "Z_[17-07]_kiku2.mp3",
    "title": "聞きましょう② — 助けてくれた職場の人々"
  },
  {
    "track": "17-08",
    "file": "Z_[17-08]_kaiwa.mp3",
    "title": "会話（本文） — 成長をたたえ合う仲間たち"
  },
  {
    "track": "17-09",
    "file": "Z_[17-09]_katachi.mp3",
    "title": "まとめ — 変化を伝える表現"
  },
  {
    "track": "17-10",
    "file": "Z_[17-10]_hanasu1.mp3",
    "title": "話しましょう① — 1年前と今の私"
  },
  {
    "track": "17-11",
    "file": "Z_[17-11]_hanasu2.mp3",
    "title": "話しましょう② — 将来への自信と決意"
  }
]
    },

    /* ================= 11. HASIL & UMPAN BALIK ================= */
    {
      id: "hasil",
      label: "Hasil & Umpan Balik",
      type: "result"
    },

    /* ================= 12. REFLEKSI PESERTA DIDIK ================= */
    {
      id: "refleksi",
      label: "Refleksi",
      type: "static",
      html: `
        <h2>Refleksi Kemandirian Belajar Siswa (Jiko Hyouka Bab 17)</h2>
        <p>Isilah refleksi berikut secara jujur setelah menyelesaikan seluruh materi dan asesmen LKPD Bab 17.</p>

        <div class="question-card" style="background:#f8fafc; border:1px solid #cbd5e1; padding:14px; border-radius:12px; margin-bottom:12px;">
          <label><strong>1. Can-Do mana yang sudah berhasil saya kuasai dengan sangat baik pada Bab 17 ini?</strong></label>
          <textarea id="ref1" rows="2" style="width:100%; margin-top:6px; border-radius:8px; padding:8px; border:1px solid #cbd5e1;"></textarea>
        </div>

        <div class="question-card" style="background:#f8fafc; border:1px solid #cbd5e1; padding:14px; border-radius:12px; margin-bottom:12px;">
          <label><strong>2. Pada bagian mana (Moji-Goi, Percakapan, Menyimak Audio, atau Membaca Teks) saya masih memerlukan latihan tambahan?</strong></label>
          <textarea id="ref2" rows="2" style="width:100%; margin-top:6px; border-radius:8px; padding:8px; border:1px solid #cbd5e1;"></textarea>
        </div>

        <div class="question-card" style="background:#f8fafc; border:1px solid #cbd5e1; padding:14px; border-radius:12px; margin-bottom:12px;">
          <label><strong>3. Kosakata atau kanji baru apa saja yang paling berkesan dan ingin saya terapkan dalam kehidupan kerja di Jepang?</strong></label>
          <textarea id="ref3" rows="2" style="width:100%; margin-top:6px; border-radius:8px; padding:8px; border:1px solid #cbd5e1;"></textarea>
        </div>

        <div class="question-card" style="background:#f8fafc; border:1px solid #cbd5e1; padding:14px; border-radius:12px; margin-bottom:12px;">
          <label><strong>4. Komitmen saya untuk mencapai ketuntasan KKM 85 pt pada evaluasi diagnostik berikutnya:</strong></label>
          <textarea id="ref4" rows="2" style="width:100%; margin-top:6px; border-radius:8px; padding:8px; border:1px solid #cbd5e1;"></textarea>
        </div>
      `
    }
  ]
};
