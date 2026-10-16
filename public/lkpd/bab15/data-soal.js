/*
  data-soal.js - LKPD Bab 15: 第15課「ゴミを減らすために、マイバッグを持っています」
  Kurikulum Irodori Nihongo de Seikatsu 初級2 (A2.2)
  Standar CEFR A2 / JFT-Basic / LPK Terstandar KKM 85 pt
*/

window.LKPD_DATA = {
  settings: {
    babId: "bab15",
    babTitle: "第15課「ゴミを減らすために、マイバッグを持っています」",
    subTitle: "環境とエコ生活（ゴミの分別・リサイクル・省エネルギー）",
    canDo: "Can-do 58, Can-do 59, Can-do 60",
    sessionKey: "lkpd_bab15_session_v5",
    stateKey: "lkpd_bab15_state_v5",
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
        <h2>Panduan Penggunaan LKPD Bab 15</h2>
        <div class="meta-box" style="background:#fffbeb; border:1px solid #f59e0b; padding:16px; border-radius:12px; margin-bottom:18px;">
          <p><strong>Satuan Pendidikan / LPK:</strong> LPK JP10 Outsutsuki (Standardisasi JF CEFR A2)</p>
          <p><strong>Mata Pelajaran:</strong> Bahasa Jepang (Irodori 初級2 - Bab 15)</p>
          <p><strong>Topik:</strong> 第15課「ゴミを減らすために、マイバッグを持っています」 • 環境保護とごみの分別ルール／エコな暮らしの習慣</p>
          <p><strong>Alokasi Waktu:</strong> 90 Menit (Teori, Latihan Terbimbing & Asesmen Mandiri)</p>
          <p><strong>Standar Kelulusan KKM LPK:</strong> Nilai Akhir &ge; 85.0 pt (Tuntas KKM) | Mini JFT-like &ge; 85.0 pt | Skala JFT-Basic &ge; 200/250</p>
        </div>

        <h3>A. Capaian Pembelajaran (Can-Do Irodori Bab 15):</h3>
        <ul>
          <li><strong>Can-do 58:</strong>  地域のゴミ出しルールを聞いて、ゴミの分別方法や収集日を理解することができる。</li>
          <li><strong>Can-do 59:</strong>  環境を守るために自分が普段心がけている工夫やエコ習慣について話すことができる。</li>
          <li><strong>Can-do 60:</strong>  リサイクルや不用品の譲渡・バザーに関する案内を読んで内容を理解することができる。</li>
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
        <h2>Ringkasan Materi & Tata Bahasa Bab 15</h2>
        <div class="vocab-grid">
          <div class="vocab-card" style="background:#f8fafc; border:1px solid #cbd5e1; padding:16px; border-radius:12px; margin-bottom:16px;">
            <h4 style="color:#1e3a8a; border-bottom:2px solid #3b82f6; padding-bottom:6px;">Pola Tata Bahasa Utama</h4>
            <ul>
              
                <li style="margin-bottom:12px;">
                  <strong style="color:#0f172a; font-size:1.05rem;">V［辞書形］＋ために（目的）</strong><br>
                  <span style="color:#334155;">Menyatakan tujuan utama dari suatu aksi sadar yang dilakukan.</span><br>
                  <em style="color:#047857; font-weight:bold;">Contoh: ゴミを減らすために、マイバッグを持っています。(Saya membawa tas belanja sendiri demi mengurangi sampah plastik.)</em>
                </li>
              
                <li style="margin-bottom:12px;">
                  <strong style="color:#0f172a; font-size:1.05rem;">V［ない形・ない］＋ようにしています（習慣・心がけ）</strong><br>
                  <span style="color:#334155;">Menyatakan usaha sadar yang terus diupayakan untuk tidak melakukan sesuatu.</span><br>
                  <em style="color:#047857; font-weight:bold;">Contoh: 電気をつけっぱなしにしないようにしています。(Saya berusaha membiasakan diri agar tidak membiarkan lampu menyala terus.)</em>
                </li>
              
                <li style="margin-bottom:12px;">
                  <strong style="color:#0f172a; font-size:1.05rem;">分別する (燃えるゴミ・燃えないゴミ・資源ゴミ)</strong><br>
                  <span style="color:#334155;">Aturan ketat pemilahan sampah di tempat tinggal Jepang.</span><br>
                  <em style="color:#047857; font-weight:bold;">Contoh: ペットボトルはラベルとキャップを外して捨ててください。</em>
                </li>
              
            </ul>
          </div>

          <div class="vocab-card" style="background:#f8fafc; border:1px solid #cbd5e1; padding:16px; border-radius:12px;">
            <h4 style="color:#1e3a8a; border-bottom:2px solid #3b82f6; padding-bottom:6px;">Kosakata Penting Bab 15</h4>
            <table style="width:100%; border-collapse:collapse; margin-top:8px;">
              <thead>
                <tr style="background:#e2e8f0; text-align:left;">
                  <th style="padding:8px; border:1px solid #cbd5e1;">Bahasa Jepang</th>
                  <th style="padding:8px; border:1px solid #cbd5e1;">Arti Bahasa Indonesia</th>
                </tr>
              </thead>
              <tbody>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">燃えるゴミ (もえるごみ)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Sampah yang bisa dibakar (organik/kertas)</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">燃えないゴミ (もえないごみ)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Sampah tidak bisa dibakar (kaca/logam)</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">資源ゴミ (しげんごみ)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Sampah daur ulang (botol PET, kaleng, kardus)</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">粗大ゴミ (そだいごみ)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Sampah berukuran besar (meja, kasur, sepeda)</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">分別 (ぶんべつ)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Pemilahan sampah</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">減らす (へらす)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Mengurangi</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">リサイクル</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Daur ulang</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">収集日 (しゅうしゅうび)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Hari pengangkutan sampah</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">マイバッグ</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Tas belanja ramah lingkungan sendiri</td>
                  </tr>
                
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">無駄 (むだ)</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">Sia-sia / mubazir / pemborosan</td>
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
          prompt: "「燃えるゴミ」の読み方はどれですか。",
          options: ["こうきょう", "しやくしょ", "としょかん", "びじゅつかん"],
          answer: 1
        },
        {
          id: "q2",
          type: "mcq",
          number: "Soal 2.",
          prompt: "文の（　　）脈に最も合う言葉を選んでください。<br>町のことについて相談したいので、（　　）の窓口へ行きました。",
          options: ["燃えないゴミ", "映画館", "コンビニ", "公園"],
          answer: 1
        },
        {
          id: "q3",
          type: "mcq",
          number: "Soal 3.",
          prompt: "「資源ゴミ」の意味はどれですか。",
          options: ["Sampah daur ulang (botol PET, kaleng, kardus)", "Restoran cepat saji", "Stasiun kereta", "Rumah sakit"],
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
          prompt: "「粗大ゴミ」の読み方はどれですか。",
          options: ["びじゅつかん", "たいそうかん", "ゆうびんきょく", "ぎんこう"],
          answer: 1
        },
        {
          id: "q6",
          type: "mcq",
          number: "Soal 6.",
          prompt: "「分別」の意味として最も適切なものはどれですか。",
          options: ["Pemilahan sampah", "Peralatan dapur", "Tiket bioskop", "Menu makan siang"],
          answer: 1
        },
        {
          id: "q7",
          type: "mcq",
          number: "Soal 7.",
          prompt: "「減らす」の読み方はどれですか。",
          options: ["てんじ", "あんない", "ちゅうし", "よやく"],
          answer: 1
        },
        {
          id: "q8",
          type: "mcq",
          number: "Soal 8.",
          prompt: "文の（　　）に入る言葉を選んでください。<br>施設の利用について詳しく知りたいので、（　　）をよく読みました。",
          options: ["マイバッグ", "小説", "マンガ", "レシピ"],
          answer: 1
        },
        {
          id: "q9",
          type: "mcq",
          number: "Soal 9.",
          prompt: "「リサイクル」の意味はどれですか。",
          options: ["Daur ulang", "Hari buka toko", "Hari gajian", "Hari perayaan festival"],
          answer: 1
        },
        {
          id: "q10",
          type: "mcq",
          number: "Soal 10.",
          prompt: "「収集日」の読み方はどれですか。",
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
          prompt: "燃えるゴミの収集日は何曜日ですか。",
          options: ["火曜日と金曜日の朝8時まで","毎週日曜日","水曜日のみ","毎日いつでもよい"],
          answer: 1,
          audioUrl: "audio/Z_[15-03]_kiku1.mp3",
          script: "この地域では、生ゴミや燃えるゴミは火曜日と金曜日の朝8時までに指定のゴミステーションに出してください。"
        },
        
        {
          id: "q20",
          type: "listening",
          number: "Soal 20.",
          prompt: "ペットボトルを捨てるときに必ずしなければならないことは何ですか。",
          options: ["中を水で洗って、キャップとラベルを外すこと","潰さずにそのまま捨てること","燃えるゴミに混ぜること","外で燃やすこと"],
          answer: 1,
          audioUrl: "audio/Z_[15-04]_kiku2.mp3",
          script: "ペットボトルは中を軽く水でゆすいで、キャップとラベルを外してプラスチックゴミへ、本体は資源ゴミのネットに入れてください。"
        },
        
        {
          id: "q21",
          type: "listening",
          number: "Soal 21.",
          prompt: "壊れた自転車を捨てるにはどうすればいいですか。",
          options: ["粗大ゴミ受付センターに電話して有料シールを貼る","近所の公園に置いておく","普通ゴミ袋に入れて出す","川に捨てる"],
          answer: 1,
          audioUrl: "audio/Z_[15-05]_kiku3.mp3",
          script: "自転車や家具などの大型ゴミは粗大ゴミになります。事前に受付センターへ連絡して収集券シールを購入して貼ってください。"
        },
        
        {
          id: "q22",
          type: "listening",
          number: "Soal 22.",
          prompt: "男性がマイ水筒を持ち歩いている理由は何ですか。",
          options: ["ペットボトルのゴミを減らすため","ジュースを買うお金がないから","水筒が好きだから","重い荷物を持ちたいから"],
          answer: 1,
          audioUrl: "audio/Z_[15-09]_kiku1.mp3",
          script: "毎日マイボトルにお茶を入れて職場に持参しています。飲み物代の節約にもなりますし、プラスチックゴミを減らすためです。"
        },
        
        {
          id: "q23",
          type: "listening",
          number: "Soal 23.",
          prompt: "職場で節電のために取り組んでいることは何ですか。",
          options: ["昼休みに部屋の電気を一斉に消すこと","クーラーの設定温度を18度にすること","パソコンをつけたまま帰ること","何もしない"],
          answer: 1,
          audioUrl: "audio/Z_[15-10]_kiku2.mp3",
          script: "私たちのオフィスでは省エネのために、お昼休みの1時間はフロアの照明をすべて消灯するようにしています。"
        },
        
        {
          id: "q24",
          type: "listening",
          number: "Soal 24.",
          prompt: "会話で「もったいない」と言われているのはどんなことですか。",
          options: ["まだ使える服や家具をすぐに捨ててしまうこと","料理を美味しく作ること","勉強をたくさんすること","早く寝ること"],
          answer: 1,
          audioUrl: "audio/Z_[15-11]_kaiwa.mp3",
          script: "まだ着られる服を捨ててしまうのは本当にもったいないですね。リサイクルショップやフリーマーケットを活用しましょう。"
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
        
        { id: "voc1", ja: "燃えるゴミ", idText: "Sampah yang bisa dibakar (organik/kertas)" },
        
        { id: "voc2", ja: "燃えないゴミ", idText: "Sampah tidak bisa dibakar (kaca/logam)" },
        
        { id: "voc3", ja: "資源ゴミ", idText: "Sampah daur ulang (botol PET, kaleng, kardus)" },
        
        { id: "voc4", ja: "粗大ゴミ", idText: "Sampah berukuran besar (meja, kasur, sepeda)" },
        
        { id: "voc5", ja: "分別", idText: "Pemilahan sampah" },
        
        { id: "voc6", ja: "減らす", idText: "Mengurangi" },
        
        { id: "voc7", ja: "リサイクル", idText: "Daur ulang" },
        
        { id: "voc8", ja: "収集日", idText: "Hari pengangkutan sampah" },
        
        { id: "voc9", ja: "マイバッグ", idText: "Tas belanja ramah lingkungan sendiri" },
        
        { id: "voc10", ja: "無駄", idText: "Sia-sia / mubazir / pemborosan" }
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
      label: "🎧 Bank Audio Bab 15",
      type: "audiobank",
      items: [
  {
    "track": "15-01",
    "file": "Z_[15-01]_kotoba1.mp3",
    "title": "ことばの準備① — ゴミの種類と分別"
  },
  {
    "track": "15-02",
    "file": "Z_[15-02]_kotoba2.mp3",
    "title": "ことばの準備② — 環境にやさしい行動"
  },
  {
    "track": "15-03",
    "file": "Z_[15-03]_kiku1.mp3",
    "title": "聞きましょう① — アパートのゴミ出しルール"
  },
  {
    "track": "15-04",
    "file": "Z_[15-04]_kiku2.mp3",
    "title": "聞きましょう① — ペットボトルの捨て方"
  },
  {
    "track": "15-05",
    "file": "Z_[15-05]_kiku3.mp3",
    "title": "聞きましょう① — 粗大ゴミの収集予約"
  },
  {
    "track": "15-06",
    "file": "Z_[15-06]_kiku4.mp3",
    "title": "聞きましょう① — フリーマーケットの案内"
  },
  {
    "track": "15-07",
    "file": "Z_[15-07]_katachi1.mp3",
    "title": "形に注目① — ～ために（目的）"
  },
  {
    "track": "15-08",
    "file": "Z_[15-08]_katachi2.mp3",
    "title": "形に注目② — ～ないようにする"
  },
  {
    "track": "15-09",
    "file": "Z_[15-09]_kiku1.mp3",
    "title": "聞きましょう② — 普段のエコな取り組み"
  },
  {
    "track": "15-10",
    "file": "Z_[15-10]_kiku2.mp3",
    "title": "聞きましょう② — 職場の節電と紙の削減"
  },
  {
    "track": "15-11",
    "file": "Z_[15-11]_kaiwa.mp3",
    "title": "会話（本文） — ゴミの分別についての質問"
  },
  {
    "track": "15-12",
    "file": "Z_[15-12]_hanasu1.mp3",
    "title": "話しましょう① — 自慢のエコライフ"
  },
  {
    "track": "15-13",
    "file": "Z_[15-13]_hanasu2.mp3",
    "title": "話しましょう② — 地域の清掃ボランティア"
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
        <h2>Refleksi Kemandirian Belajar Siswa (Jiko Hyouka Bab 15)</h2>
        <p>Isilah refleksi berikut secara jujur setelah menyelesaikan seluruh materi dan asesmen LKPD Bab 15.</p>

        <div class="question-card" style="background:#f8fafc; border:1px solid #cbd5e1; padding:14px; border-radius:12px; margin-bottom:12px;">
          <label><strong>1. Can-Do mana yang sudah berhasil saya kuasai dengan sangat baik pada Bab 15 ini?</strong></label>
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
