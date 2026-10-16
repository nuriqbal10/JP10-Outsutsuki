const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const LKPD_DIR = path.join(BASE_DIR, 'public', 'lkpd');
const AUDIO_SOURCE_DIR = path.resolve(BASE_DIR, '..', 'Aset Audio & Gambar', 'Audio 初級2');

console.log('=== MEMULAI GENERASI LKPD BAB 13 S.D. BAB 18 ===\n');

// DATA SILABUS & BLUEPRINT OTENTIK BAB 13 - 18
const CHAPTERS_DATA = {
  13: {
    num: 13,
    titleJa: "第13課「いろいろな資料を展示してあります」",
    titleSub: "さまざまなサービス・公共施設（図書館・市役所・美術館）",
    topic: "公共施設と利用案内／利用ルールと設備",
    canDo: [
      "Can-do 52: 施設などを案内されたとき、そこに何があるか、どんなことができるかを聞いて理解することができる。",
      "Can-do 53: 公共施設などで、設備やサービスを利用したいときに、希望を伝えて質問することができる。",
      "Can-do 54: 公共施設などの利用案内を読んで、利用時間や料金、利用方法などの情報を読み取ることができる。"
    ],
    materi: {
      pola: [
        {
          name: "V［て形］＋あります（結果の状態・意図的準備）",
          desc: "Menyatakan suatu keadaan yang sengaja dibuat/disiapkan oleh seseorang demi tujuan tertentu.",
          ex: "いろいろな資料を展示してあります。(Berbagai dokumen/materi sengaja dipamerkan di sini.) / ポスターが貼ってあります。"
        },
        {
          name: "V［て形］＋みてください（勧誘・提案）",
          desc: "Mengajak atau menyarankan seseorang untuk mencoba melakukan sesuatu.",
          ex: "ぜひ一度行ってみてください。(Silakan coba berkunjung sekali ke sana.) / 読んでみてください。"
        },
        {
          name: "～は、何時から何時までですか／いくらですか",
          desc: "Menanyakan waktu operasional dan biaya masuk/sewa fasilitas umum.",
          ex: "図書館の開館時間は何時からですか。(Jam buka perpustakaan dari jam berapa?)"
        }
      ],
      vocab: [
        { ja: "公共施設 (こうきょうしせつ)", id: "Fasilitas umum" },
        { ja: "市役所 (しやくしょ)", id: "Balai kota / kantor pemerintahan kota" },
        { ja: "図書館 (としょかん)", id: "Perpustakaan" },
        { ja: "美術館 (びじゅつかん)", id: "Museum seni / galeri" },
        { ja: "資料 (しりょう)", id: "Data / materi informasi" },
        { ja: "展示 (てんじ)", id: "Pameran / display" },
        { ja: "休館日 (きゅうかんび)", id: "Hari libur tutup fasilitas" },
        { ja: "入館料 (にゅうかんりょう)", id: "Biaya tiket masuk" },
        { ja: "利用案内 (りようあんない)", id: "Petunjuk penggunaan fasilitas" },
        { ja: "貸出 (かしだし)", id: "Peminjaman (buku/alat)" }
      ]
    },
    audioFiles: [
      { track: "13-01", file: "Z_[13-01]_kotoba1.mp3", title: "ことばの準備① — 公共施設の名前" },
      { track: "13-02", file: "Z_[13-02]_kotoba2.mp3", title: "ことばの準備② — 施設でできること" },
      { track: "13-03", file: "Z_[13-03]_kiku.mp3", title: "聞きましょう① — 施設の案内（ホール・展示室）" },
      { track: "13-04", file: "Z_[13-04]_katachi1.mp3", title: "形に注目① — ～てあります" },
      { track: "13-05", file: "Z_[13-05]_katachi2.mp3", title: "形に注目② — ～てみてください" },
      { track: "13-06", file: "Z_[13-06]_katachi3.mp3", title: "形に注目③ — ～ができます" },
      { track: "13-07", file: "Z_[13-07]_kiku1.mp3", title: "聞きましょう② — 市民会館の利用案内" },
      { track: "13-08", file: "Z_[13-08]_kiku2.mp3", title: "聞きましょう② — 図書館の貸出カード" },
      { track: "13-09", file: "Z_[13-09]_kiku3.mp3", title: "聞きましょう② — 美術館の企画展" },
      { track: "13-10", file: "Z_[13-10]_kiku4.mp3", title: "聞きましょう② — スポーツセンターの利用" },
      { track: "13-11", file: "Z_[13-11]_kaiwa.mp3", title: "会話（本文） — 施設の窓口で相談" },
      { track: "13-12", file: "Z_[13-12]_katachi.mp3", title: "形に注目 — 窓口での質問表現" },
      { track: "13-13", file: "Z_[13-13]_hanasu1.mp3", title: "話しましょう① — 施設のおすすめ" },
      { track: "13-14", file: "Z_[13-14]_hanasu2.mp3", title: "話しましょう② — 利用条件の確認" },
      { track: "13-15", file: "Z_[13-15]_hanasu3.mp3", title: "話しましょう③ — シャドーイング練習" }
    ],
    choukaiQuestions: [
      {
        prompt: "展示室にはどのようなものが置いてありますか。",
        options: ["町の歴史や伝統工芸の資料", "新しい家電製品", "外国のお土産だけ", "スポーツの道具"],
        answer: 1,
        audioUrl: "audio/Z_[13-03]_kiku.mp3",
        script: "こちらが郷土資料室です。棚にはこの町の歴史や伝統工芸に関する古い資料や写真が展示してあります。"
      },
      {
        prompt: "市民会館のホールを利用したいとき、まず何をしなければなりませんか。",
        options: ["窓口で事前の利用予約と申請をする", "当日直接行って入る", "お金を払わずに鍵を開ける", "何もしなくてよい"],
        answer: 1,
        audioUrl: "audio/Z_[13-07]_kiku1.mp3",
        script: "市民ホールの利用を希望される場合は、ご利用日の1か月前までに窓口で利用申請書を提出してください。"
      },
      {
        prompt: "図書館で本を借りるために必要なものは何ですか。",
        options: ["図書館の利用カード", "パスポートのみ", "会社の身分証", "現金1000円"],
        answer: 1,
        audioUrl: "audio/Z_[13-08]_kiku2.mp3",
        script: "初めて本を借りる方は、こちらの利用カード申込書にお名前とご住所を書いて、カードを作ってください。"
      },
      {
        prompt: "美術館の特別展示は何時まで見学できますか。",
        options: ["午後5時まで（入場は午後4時半まで）", "午後8時まで", "午前11時まで", "24時間いつでも"],
        answer: 1,
        audioUrl: "audio/Z_[13-09]_kiku3.mp3",
        script: "ただいま特別企画展を開催中です。閉館は夕方5時ですが、最終入場は4時半となっておりますのでご注意ください。"
      },
      {
        prompt: "スポーツセンターのトレーニング室を使うときのルールは何ですか。",
        options: ["室内用の運動靴に履き替えること", "外履きの靴のまま入ること", "飲食しながら運動すること", "靴を脱いで裸足で走ること"],
        answer: 1,
        audioUrl: "audio/Z_[13-10]_kiku4.mp3",
        script: "トレーニングジムをご利用の際は、必ず室内用の運動靴に履き替えてご利用いただくようお願いいたします。"
      },
      {
        prompt: "案内員が「ぜひ～てみてください」と勧めていることは何ですか。",
        options: ["屋上庭園からの素晴らしい景色を見ること", "有料のレストランで食事すること", "お土産をたくさん買うこと", "階段を走ること"],
        answer: 1,
        audioUrl: "audio/Z_[13-13]_hanasu1.mp3",
        script: "天気がいい日は屋上の展望デッキがとても気持ちいいですよ。富士山も見えますから、ぜひ一度行ってみてください。"
      }
    ]
  },

  14: {
    num: 14,
    titleJa: "第14課「髪をもう少し短くしてください」",
    titleSub: "サービスを利用する（美容院・クリーニング・郵便局・宅配便）",
    topic: "店舗サービスの利用／希望の注文と受け取り",
    canDo: [
      "Can-do 55: 美容院などで、髪型や長さの希望を美容師に伝えることができる。",
      "Can-do 56: クリーニング店や修理店で、品物を預けたり、仕上がりの日時を確認したりすることができる。",
      "Can-do 57: 郵便局や宅配便の窓口で、荷物の重さや届け先を伝えて発送を依頼することができる。"
    ],
    materi: {
      pola: [
        {
          name: "～を ［い形容詞・く］／［な形容詞・に］ します",
          desc: "Menyatakan perubahan suatu benda/keadaan sesuai dengan kehendak pembicara.",
          ex: "髪をもう少し短くしてください。(Tolong potong rambut saya sedikit lebih pendek.) / 部屋をきれいにします。"
        },
        {
          name: "V［て形］＋もらえますか／いただけますか",
          desc: "Ungkapan meminta tolong secara sopan kepada staf layanan jasa.",
          ex: "このシミを落としてもらえますか。(Bisakah Anda membersihkan noda ini?)"
        },
        {
          name: "いつまでに仕上がりますか／届きますか",
          desc: "Konfirmasi tanggal selesai pengerjaan laundry atau kedatangan kurir paket.",
          ex: "明日の夕方までに仕上がりますか。(Bisakah selesai besok sore?)"
        }
      ],
      vocab: [
        { ja: "美容院 (びよういん)", id: "Salon kecantikan / pangkas rambut" },
        { ja: "髪型 (かみがた)", id: "Gaya rambut" },
        { ja: "前髪 (まえがみ)", id: "Poni rambut" },
        { ja: "短くする (みじかくする)", id: "Memendekkan" },
        { ja: "クリーニング", id: "Dry cleaning / cuci pakaian profesional" },
        { ja: "シミ", id: "Noda pada pakaian" },
        { ja: "預かる (あずかる)", id: "Menerima titipan / pakaian" },
        { ja: "仕上がり (しあがり)", id: "Penyelesaian / siap diambil" },
        { ja: "宅配便 (たくはいびん)", id: "Kurir pengiriman barang kilat" },
        { ja: "壊れ物 (こわれもの)", id: "Barang pecah belah / mudah rusak" }
      ]
    },
    audioFiles: [
      { track: "14-01", file: "Z_[14-01]_kotoba.mp3", title: "ことばの準備 — 髪型とサービスの種類" },
      { track: "14-02", file: "Z_[14-02]_kiku1.mp3", title: "聞きましょう① — 美容院でのカットの注文" },
      { track: "14-03", file: "Z_[14-03]_kiku2.mp3", title: "聞きましょう① — クリーニングの受付" },
      { track: "14-04", file: "Z_[14-04]_kiku3.mp3", title: "聞きましょう① — 宅配便の荷物発送" },
      { track: "14-05", file: "Z_[14-05]_kiku4.mp3", title: "聞きましょう① — 時計や靴の修理店" },
      { track: "14-06", file: "Z_[14-06]_katachi1.mp3", title: "形に注目① — ～を短くする／きれいにする" },
      { track: "14-07", file: "Z_[14-07]_katachi2.mp3", title: "形に注目② — ～てもらえますか" },
      { track: "14-08", file: "Z_[14-08]_kiku1.mp3", title: "聞きましょう② — 髪型の細かな相談" },
      { track: "14-09", file: "Z_[14-09]_kiku2.mp3", title: "聞きましょう② — 染める色（カラー）の指定" },
      { track: "14-10", file: "Z_[14-10]_kiku3.mp3", title: "聞きましょう② — クリーニングの受け取り日時" },
      { track: "14-11", file: "Z_[14-11]_kaiwa.mp3", title: "会話（本文） — 店員との詳細やり取り" },
      { track: "14-12", file: "Z_[14-12]_hanasu1.mp3", title: "話しましょう① — 美容院での会話" },
      { track: "14-13", file: "Z_[14-13]_hanasu2.mp3", title: "話しましょう② — 宅配便の伝票記入" },
      { track: "14-14", file: "Z_[14-14]_katachi.mp3", title: "まとめ — サービスの依頼表現" }
    ],
    choukaiQuestions: [
      {
        prompt: "客は髪をどのようにしてほしいと頼みましたか。",
        options: ["全体を少し短くして、前髪は眉毛の上くらいにすること", "髪を赤く染めること", "坊主にすること", "全く切らないこと"],
        answer: 1,
        audioUrl: "audio/Z_[14-02]_kiku1.mp3",
        script: "今日はどうされますか？ 全体を2センチくらい短くして、前髪は眉毛の上くらいにそろえてもらえますか。"
      },
      {
        prompt: "クリーニングに出したコートはいつ仕上がりますか。",
        options: ["金曜日の午後3時以降", "明日の朝一番", "来週の日曜日", "1か月後"],
        answer: 1,
        audioUrl: "audio/Z_[14-03]_kiku2.mp3",
        script: "こちらの冬用のコートですね。水曜日の受付ですので、仕上がりは今週金曜日の午後3時以降となります。"
      },
      {
        prompt: "宅配便で送る荷物の中に何が入っていますか。",
        options: ["ガラスのコップとお菓子（壊れ物あり）", "本とノートだけ", "危険物", "現金"],
        answer: 1,
        audioUrl: "audio/Z_[14-04]_kiku3.mp3",
        script: "お荷物の中身は何でしょうか？ ガラスのコップとお土産のお菓子です。割れ物シールを貼っておきますね。"
      },
      {
        prompt: "靴の修理代金はいくらですか。",
        options: ["1,500円", "3,000円", "500円", "無料"],
        answer: 1,
        audioUrl: "audio/Z_[14-05]_kiku4.mp3",
        script: "かかとのゴムの交換ですね。両足で1,500円になります。30分ほどで終わりますよ。"
      },
      {
        prompt: "美容院でシャンプーのとき、店員は何を確認しましたか。",
        options: ["お湯の温度と痒いところがないか", "好きな音楽", "昼ごはんを食べたか", "出身国"],
        answer: 1,
        audioUrl: "audio/Z_[14-06]_kaiwa1.mp3",
        script: "お湯の温度はいかがですか？ ちょうどいいです。痒いところや流し足りないところはございませんか。"
      },
      {
        prompt: "荷物の配達希望時間は何時ですか。",
        options: ["夜間（18時から20時の間）", "午前中一番", "昼12時ちょうど", "いつでもよい"],
        answer: 1,
        audioUrl: "audio/Z_[14-07]_kaiwa2.mp3",
        script: "配達時間帯のご希望はございますか？ 昼間は仕事で不在なので、夜18時から20時の指定でお願いします。"
      }
    ]
  },

  15: {
    num: 15,
    titleJa: "第15課「ゴミを減らすために、マイバッグを持っています」",
    titleSub: "環境とエコ生活（ゴミの分別・リサイクル・省エネルギー）",
    topic: "環境保護とごみの分別ルール／エコな暮らしの習慣",
    canDo: [
      "Can-do 58: 地域のゴミ出しルールを聞いて、ゴミの分別方法や収集日を理解することができる。",
      "Can-do 59: 環境を守るために自分が普段心がけている工夫やエコ習慣について話すことができる。",
      "Can-do 60: リサイクルや不用品の譲渡・バザーに関する案内を読んで内容を理解することができる。"
    ],
    materi: {
      pola: [
        {
          name: "V［辞書形］＋ために（目的）",
          desc: "Menyatakan tujuan utama dari suatu aksi sadar yang dilakukan.",
          ex: "ゴミを減らすために、マイバッグを持っています。(Saya membawa tas belanja sendiri demi mengurangi sampah plastik.)"
        },
        {
          name: "V［ない形・ない］＋ようにしています（習慣・心がけ）",
          desc: "Menyatakan usaha sadar yang terus diupayakan untuk tidak melakukan sesuatu.",
          ex: "電気をつけっぱなしにしないようにしています。(Saya berusaha membiasakan diri agar tidak membiarkan lampu menyala terus.)"
        },
        {
          name: "分別する (燃えるゴミ・燃えないゴミ・資源ゴミ)",
          desc: "Aturan ketat pemilahan sampah di tempat tinggal Jepang.",
          ex: "ペットボトルはラベルとキャップを外して捨ててください。"
        }
      ],
      vocab: [
        { ja: "燃えるゴミ (もえるごみ)", id: "Sampah yang bisa dibakar (organik/kertas)" },
        { ja: "燃えないゴミ (もえないごみ)", id: "Sampah tidak bisa dibakar (kaca/logam)" },
        { ja: "資源ゴミ (しげんごみ)", id: "Sampah daur ulang (botol PET, kaleng, kardus)" },
        { ja: "粗大ゴミ (そだいごみ)", id: "Sampah berukuran besar (meja, kasur, sepeda)" },
        { ja: "分別 (ぶんべつ)", id: "Pemilahan sampah" },
        { ja: "減らす (へらす)", id: "Mengurangi" },
        { ja: "リサイクル", id: "Daur ulang" },
        { ja: "収集日 (しゅうしゅうび)", id: "Hari pengangkutan sampah" },
        { ja: "マイバッグ", id: "Tas belanja ramah lingkungan sendiri" },
        { ja: "無駄 (むだ)", id: "Sia-sia / mubazir / pemborosan" }
      ]
    },
    audioFiles: [
      { track: "15-01", file: "Z_[15-01]_kotoba1.mp3", title: "ことばの準備① — ゴミの種類と分別" },
      { track: "15-02", file: "Z_[15-02]_kotoba2.mp3", title: "ことばの準備② — 環境にやさしい行動" },
      { track: "15-03", file: "Z_[15-03]_kiku1.mp3", title: "聞きましょう① — アパートのゴミ出しルール" },
      { track: "15-04", file: "Z_[15-04]_kiku2.mp3", title: "聞きましょう① — ペットボトルの捨て方" },
      { track: "15-05", file: "Z_[15-05]_kiku3.mp3", title: "聞きましょう① — 粗大ゴミの収集予約" },
      { track: "15-06", file: "Z_[15-06]_kiku4.mp3", title: "聞きましょう① — フリーマーケットの案内" },
      { track: "15-07", file: "Z_[15-07]_katachi.mp3", title: "形に注目① — ～ために（目的）" },
      { track: "15-08", file: "Z_[15-08]_hanasu1.mp3", title: "話しましょう① — 自慢のエコライフ" },
      { track: "15-09", file: "Z_[15-09]_hanasu2.mp3", title: "話しましょう② — 地域の清掃ボランティア" },
      { track: "15-10", file: "Z_[15-10]_kaiwa.mp3", title: "会話（本文） — ゴミの分別についての質問" },
      { track: "15-11", file: "Z_[15-11]_katachi.mp3", title: "形に注目② — ～ないようにする" },
      { track: "15-12", file: "Z_[15-12]_hanasu1.mp3", title: "話しましょう③ — マイバッグの活用" },
      { track: "15-13", file: "Z_[15-13]_hanasu2.mp3", title: "話しましょう④ — 節電の心がけ" }
    ],
    choukaiQuestions: [
      {
        prompt: "燃えるゴミの収集日は何曜日ですか。",
        options: ["火曜日と金曜日の朝8時まで", "毎週日曜日", "水曜日のみ", "毎日いつでもよい"],
        answer: 1,
        audioUrl: "audio/Z_[15-03]_kiku1.mp3",
        script: "この地域では、生ゴミや燃えるゴミは火曜日と金曜日の朝8時までに指定のゴミステーションに出してください。"
      },
      {
        prompt: "ペットボトルを捨てるときに必ずしなければならないことは何ですか。",
        options: ["中を水で洗って、キャップとラベルを外すこと", "潰さずにそのまま捨てること", "燃えるゴミに混ぜること", "外で燃やすこと"],
        answer: 1,
        audioUrl: "audio/Z_[15-04]_kiku2.mp3",
        script: "ペットボトルは中を軽く水でゆすいで、キャップとラベルを外してプラスチックゴミへ、本体は資源ゴミのネットに入れてください。"
      },
      {
        prompt: "壊れた自転車を捨てるにはどうすればいいですか。",
        options: ["粗大ゴミ受付センターに電話して有料シールを貼る", "近所の公園に置いておく", "普通ゴミ袋に入れて出す", "川に捨てる"],
        answer: 1,
        audioUrl: "audio/Z_[15-05]_kiku3.mp3",
        script: "自転車や家具などの大型ゴミは粗大ゴミになります。事前に受付センターへ連絡して収集券シールを購入して貼ってください。"
      },
      {
        prompt: "男性がマイ水筒を持ち歩いている理由は何ですか。",
        options: ["ペットボトルのゴミを減らすため", "ジュースを買うお金がないから", "水筒が好きだから", "重い荷物を持ちたいから"],
        answer: 1,
        audioUrl: "audio/Z_[15-06]_kiku4.mp3",
        script: "毎日マイボトルにお茶を入れて職場に持参しています。飲み物代の節約にもなりますし、プラスチックゴミを減らすためです。"
      },
      {
        prompt: "職場で節電のために取り組んでいることは何ですか。",
        options: ["昼休みに部屋の電気を一斉に消すこと", "クーラーの設定温度を18度にすること", "パソコンをつけたまま帰ること", "何もしない"],
        answer: 1,
        audioUrl: "audio/Z_[15-08]_hanasu1.mp3",
        script: "私たちのオフィスでは省エネのために、お昼休みの1時間はフロアの照明をすべて消灯するようにしています。"
      },
      {
        prompt: "会話で「もったいない」と言われているのはどんなことですか。",
        options: ["まだ使える服や家具をすぐに捨ててしまうこと", "料理を美味しく作ること", "勉強をたくさんすること", "早く寝ること"],
        answer: 1,
        audioUrl: "audio/Z_[15-10]_kaiwa.mp3",
        script: "まだ着られる服を捨ててしまうのは本当にもったいないですね。リサイクルショップやフリーマーケットを活用しましょう。"
      }
    ]
  },

  16: {
    num: 16,
    titleJa: "第16課「地震が起きたら、どうすればいいですか？」",
    titleSub: "防災と安全（地震・台風・避難所・非常用持ち出し袋）",
    topic: "自然災害への備えと緊急行動／防災訓練と避難",
    canDo: [
      "Can-do 61: 緊急地震速報や防災行政無線のアナウンスを聞いて、指示内容を理解することができる。",
      "Can-do 62: 地震や台風の際にとるべき安全な行動について、指示を聞いたり質問したりできる。",
      "Can-do 63: 避難場所の案内地図やハザードマップを見て、避難所の場所や避難経路を確認することができる。"
    ],
    materi: {
      pola: [
        {
          name: "V［たら］／N［なら］（仮定条件・緊急時の行動）",
          desc: "Menyatakan instruksi atau tindakan wajib yang harus segera diambil jika suatu situasi darurat terjadi.",
          ex: "地震が起きたら、机の下に入って頭を守ってください。(Jika gempa terjadi, masuklah ke bawah meja dan lindungi kepala Anda.)"
        },
        {
          name: "V［てはいけません］／V［ないでください］（緊急時の禁止）",
          desc: "Larangan tegas demi keselamatan jiwa dalam situasi bencana.",
          ex: "エレベーターを使ってはいけません。(Jangan pernah memakai lift saat gempa/kebakaran!) / 慌てて外に飛び出さないでください。"
        },
        {
          name: "非常持ち出し袋 (水・食料・懐中電灯・救急箱)",
          desc: "Barang-barang esensial tanggap darurat yang wajib disiapkan di tempat tinggal Jepang.",
          ex: "水と乾パンを3日分用意しておきましょう。"
        }
      ],
      vocab: [
        { ja: "地震 (じしん)", id: "Gempa bumi" },
        { ja: "震度 (しんど)", id: "Skala intensitas gempa Jepang (Shindo)" },
        { ja: "避難所 (ひなんじょ)", id: "Tempat evakuasi darurat (sekolah, aula)" },
        { ja: "非常口 (ひじょうぐち)", id: "Pintu keluar darurat" },
        { ja: "津波 (つなみ)", id: "Tsunami" },
        { ja: "台風 (たいふう)", id: "Angin topan" },
        { ja: "懐中電灯 (かいちゅうでんとう)", id: "Senter baterai" },
        { ja: "停電 (ていでん)", id: "Mati listrik padam" },
        { ja: "頭を守る (あたまをまもる)", id: "Melindungi kepala" },
        { ja: "慌てる (あわてる)", id: "Panik / terburu-buru" }
      ]
    },
    audioFiles: [
      { track: "16-01", file: "Z_[16-01]_kotoba.mp3", title: "ことばの準備 — 自然災害と防災グッズ" },
      { track: "16-02", file: "Z_[16-02]_kiku1.mp3", title: "聞きましょう① — 緊急地震速報の警報音と指示" },
      { track: "16-03", file: "Z_[16-03]_kiku2.mp3", title: "聞きましょう① — 職場での避難誘導アナウンス" },
      { track: "16-04", file: "Z_[16-04]_kiku3.mp3", title: "聞きましょう① — 台風接近による電車の運休情報" },
      { track: "16-05", file: "Z_[16-05]_kiku4.mp3", title: "聞きましょう① — 防災訓練のスケジュール" },
      { track: "16-06", file: "Z_[16-06]_katachi1.mp3", title: "形に注目① — ～たら、～てください" },
      { track: "16-07", file: "Z_[16-07]_katachi2.mp3", title: "形に注目② — ～てはいけません" },
      { track: "16-08", file: "Z_[16-08]_kiku1.mp3", title: "聞きましょう② — 非常用持ち出し袋の準備品" },
      { track: "16-09", file: "Z_[16-09]_kiku2.mp3", title: "聞きましょう② — 避難所生活でのルール" },
      { track: "16-10", file: "Z_[16-10]_kaiwa.mp3", title: "会話（本文） — 寮長からの防災指導" },
      { track: "16-11", file: "Z_[16-11]_hanasu1.mp3", title: "話しましょう① — 自宅の備えの確認" },
      { track: "16-12", file: "Z_[16-12]_hanasu2.mp3", title: "話しましょう② — 安否確認の連絡" }
    ],
    choukaiQuestions: [
      {
        prompt: "緊急地震速報が鳴ったとき、最初にとるべき行動は何ですか。",
        options: ["姿勢を低くして、机の下などで頭を守ること", "外へ走って逃げること", "窓を大きく開けること", "写真を撮ること"],
        answer: 1,
        audioUrl: "audio/Z_[16-02]_kiku1.mp3",
        script: "緊急地震速報です。強い揺れに警戒してください。姿勢を低くし、頭を守り、揺れが収まるまで動かないでください。"
      },
      {
        prompt: "避難するとき、エレベーターを使ってはいけない理由は何ですか。",
        options: ["停電でエレベーターの中に閉じ込められる危険があるから", "エレベーターが遅いから", "料金がかかるから", "荷物が多いから"],
        answer: 1,
        audioUrl: "audio/Z_[16-03]_kiku2.mp3",
        script: "避難誘導アナウンスです。停電で閉じ込められる危険があるため、絶対にエレベーターは使用せず非常階段をご利用ください。"
      },
      {
        prompt: "台風が近づいているため、電車はどうなりますか。",
        options: ["夕方5時からすべての運転が見合わせ（運休）になる", "一晩中速く走る", "無料になる", "普段通り走る"],
        answer: 1,
        audioUrl: "audio/Z_[16-04]_kiku3.mp3",
        script: "大型の台風接近に伴い、本日午後5時以降、すべての路線で計画運休を実施いたします。お早めのご帰宅をお願いします。"
      },
      {
        prompt: "非常用リュックに入れておく水と食料は何日分が目安ですか。",
        options: ["最低でも3日分", "1食分だけ", "1か月分", "用意しなくてよい"],
        answer: 1,
        audioUrl: "audio/Z_[16-08]_kiku2.mp3",
        script: "大規模な災害が発生すると救援物資が届くまで時間がかかります。飲料水と保存食は最低3日分備蓄しておきましょう。"
      },
      {
        prompt: "津波警報が出た場合、どこへ避難しなければなりませんか。",
        options: ["高台や頑丈なビルの3階以上など、高い場所", "海岸の近く", "地下鉄の駅", "港の船の中"],
        answer: 1,
        audioUrl: "audio/Z_[16-09]_kiku3.mp3",
        script: "大津波警報が発令されました！ 海岸近くにいる方はただちに高台や避難ビルの上階へ避難してください！"
      },
      {
        prompt: "地震の後にガスの火はどうすればいいですか。",
        options: ["揺れが収まってから、落ち着いて火の元を確認して消す", "揺れている最中に火に飛びつく", "つけたまま逃げる", "何もしない"],
        answer: 1,
        audioUrl: "audio/Z_[16-10]_kiku4.mp3",
        script: "揺れている間に火を消そうとすると火傷の危険があります。大きな揺れが収まってから落ち着いてガスの元栓を閉めましょう。"
      }
    ]
  },

  17: {
    num: 17,
    titleJa: "第17課「日本語が前より話せるようになりました」",
    titleSub: "成長と変化・私の人生（日本語の上達・生活の変化・これまでの歩み）",
    topic: "日本生活での自己成長／過去と現在の比較",
    canDo: [
      "Can-do 64: 日本に来たばかりの頃と現在を比較して、できるようになったことや生活の変化を話すことができる。",
      "Can-do 65: 他の人の成長や日本生活での変化に関する話を聞いて、共感しながら理解することができる。",
      "Can-do 66: 日本での経験や成長を振り返る作文やスピーチを読んで、その気持ちを理解することができる。"
    ],
    materi: {
      pola: [
        {
          name: "V［辞書形／可能形］＋ようになりました（能力・状態の変化）",
          desc: "Menyatakan perubahan dari kondisi sebelumnya tidak bisa/terbiasa menjadi bisa atau terbiasa dilakukan.",
          ex: "日本語が前より話せるようになりました。(Saya sudah menjadi lebih bisa berbicara bahasa Jepang dibanding dulu.)"
        },
        {
          name: "V［て形］＋よかったです（安堵・感謝）",
          desc: "Menyatakan rasa syukur atau kelegaan atas apa yang telah dialami.",
          ex: "日本に来て本当によかったです。(Saya sangat bersyukur/senang telah datang ke Jepang.)"
        },
        {
          name: "～に比べて／前と違って（比較）",
          desc: "Membandingkan situasi masa lalu saat baru tiba dengan kondisi saat ini.",
          ex: "1年前に比べて、日本の習慣に慣れました。"
        }
      ],
      vocab: [
        { ja: "成長 (せいちょう)", id: "Pertumbuhan / perkembangan diri" },
        { ja: "上達する (じょうたつする)", id: "Meningkat kemampuannya / semakin mahir" },
        { ja: "慣れる (なれる)", id: "Menjadi terbiasa / adaptasi" },
        { ja: "会話 (かいわ)", id: "Percakapan" },
        { ja: "一人暮らし (ひとりぐらし)", id: "Tinggal mandiri sendirian" },
        { ja: "自信 (じしん)", id: "Percaya diri" },
        { ja: "苦労 (くろう)", id: "Jerih payah / kesulitan / perjuangan" },
        { ja: "思い出 (おもいで)", id: "Kenangan berkesan" },
        { ja: "親切 (しんせつ)", id: "Kebaikan hati / ramah" },
        { ja: "振り返る (ふりかえる)", id: "Merenungkan kembali / menoleh ke belakang" }
      ]
    },
    audioFiles: [
      { track: "17-01", file: "Z_[17-01]_kiku1.mp3", title: "聞きましょう① — 日本語の上達（聞き取りと会話）" },
      { track: "17-02", file: "Z_[17-02]_kiku2.mp3", title: "聞きましょう① — 食事や料理の変化（納豆が食べられる）" },
      { track: "17-03", file: "Z_[17-03]_kiku3.mp3", title: "聞きましょう① — 仕事での役割（指導する立場へ）" },
      { track: "17-04", file: "Z_[17-04]_kiku4.mp3", title: "聞きましょう① — 生活習慣の適応" },
      { track: "17-05", file: "Z_[17-05]_katachi.mp3", title: "形に注目 — ～ようになりました" },
      { track: "17-06", file: "Z_[17-06]_hanasu1.mp3", title: "話しましょう① — 日本に来たばかりの失敗談" },
      { track: "17-07", file: "Z_[17-07]_hanasu2.mp3", title: "話しましょう② — 助けてくれた職場の人々" },
      { track: "17-08", file: "Z_[17-08]_hanasu3.mp3", title: "話しましょう③ — 成長を実感した瞬間" },
      { track: "17-09", file: "Z_[17-09]_kaiwa.mp3", title: "会話（本文） — 成長をたたえ合う仲間たち" },
      { track: "17-10", file: "Z_[17-10]_hanasu1.mp3", title: "話しましょう④ — 1年前と今の私" },
      { track: "17-11", file: "Z_[17-11]_hanasu2.mp3", title: "話しましょう⑤ — 将来への自信と決意" }
    ],
    choukaiQuestions: [
      {
        prompt: "ホアさんは日本に来てから何ができるようになりましたか。",
        options: ["日本人の同僚と日本語で冗談を言い合えるようになった", "車を運転すること", "フランス語を話すこと", "毎日外食すること"],
        answer: 1,
        audioUrl: "audio/Z_[17-01]_kiku1.mp3",
        script: "最初は挨拶しかできませんでしたが、最近は職場の同僚と休憩時間に冗談を言って笑い合えるようになりました。"
      },
      {
        prompt: "食べ物について、どのような変化がありましたか。",
        options: ["最初は苦手だった納豆や刺身が美味しく食べられるようになった", "お米が嫌いになった", "甘いものしか食べなくなった", "何も変わらない"],
        answer: 1,
        audioUrl: "audio/Z_[17-02]_kiku2.mp3",
        script: "最初は納豆の匂いがどうしてもダメだったんですが、今では毎朝ご飯に乗せて美味しく食べられるようになりました。"
      },
      {
        prompt: "職場で仕事のやり方はどのように変わりましたか。",
        options: ["指示を待つだけでなく、自分で判断して後輩にも教えられるようになった", "仕事をサボるようになった", "一人で何もしなくなった", "毎日ミスをする"],
        answer: 1,
        audioUrl: "audio/Z_[17-03]_kiku3.mp3",
        script: "1年経って機械の操作に慣れ、最近は新しく入ってきた後輩実習生に仕事のコツを教えられるようになりました。"
      },
      {
        prompt: "来日当初の失敗談として話していることは何ですか。",
        options: ["電車の快速と各駅停車を間違えて遠くまで行ってしまったこと", "パスポートを無くしたこと", "財布を忘れたこと", "寝坊したこと"],
        answer: 1,
        audioUrl: "audio/Z_[17-06]_hanasu1.mp3",
        script: "日本に来たばかりの頃、普通電車に乗るはずが特急に乗ってしまい、降りられなくなって隣の県まで行ってしまいました。"
      },
      {
        prompt: "困ったときに助けてくれたのは誰ですか。",
        options: ["いつも親切に教えてくれたアパートの大家さんと職場の主任", "見知らぬ通行人", "警察官だけ", "誰にも助けてもらえなかった"],
        answer: 1,
        audioUrl: "audio/Z_[17-07]_hanasu2.mp3",
        script: "風邪をひいて心細かったとき、職場の主任が薬を届けてくれて本当に温かい気持ちになりました。"
      },
      {
        prompt: "話し手が「日本に来てよかった」と感じている一番の理由は何ですか。",
        options: ["技術を身につけ、人として大きく成長できたと実感できるから", "お金持ちになれたから", "買い物がたくさんできたから", "遊ぶ時間が長いから"],
        answer: 1,
        audioUrl: "audio/Z_[17-09]_kaiwa.mp3",
        script: "大変なこともたくさんありましたが、乗り越えたことで自分に自信がつきました。日本に来て本当によかったと心から思います。"
      }
    ]
  },

  18: {
    num: 18,
    titleJa: "第18課「将来、自分の会社を作ろうと思っています」",
    titleSub: "将来の夢と計画（キャリア・帰国後の進路・特定技能・起業）",
    topic: "これからの目標と人生設計／修了と次へのステップ",
    canDo: [
      "Can-do 67: 将来の夢やこれからの計画について、理由とともに人に話すことができる。",
      "Can-do 68: 他の人の夢やこれからの進路についての話を聞いて、応援したりアドバイスしたりできる。",
      "Can-do 69: 日本での学びを活かして次の目標に進む人の手記やメッセージを読んで理解することができる。"
    ],
    materi: {
      pola: [
        {
          name: "V［意向形］＋と思っています（意志・中長期の計画）",
          desc: "Menyatakan niat atau keputusan masa depan yang sudah dipikirkan matang sejak beberapa waktu lalu.",
          ex: "将来、自分の会社を作ろうと思っています。(Di masa depan, saya berniat mendirikan perusahaan sendiri.)"
        },
        {
          name: "V［辞書形］＋つもりです（意志・予定）",
          desc: "Menyatakan rencana pasti atau kepastian tindakan yang hendak dilakukan.",
          ex: "特定技能試験に合格して、あと5年間日本で働くつもりです。(Saya berencana lulus ujian Tokutei Ginou dan bekerja di Jepang 5 tahun lagi.)"
        },
        {
          name: "～ために／～の夢を叶えるために",
          desc: "Menjelaskan tekad kuat demi menggapai impian masa depan.",
          ex: "家族を幸せにするために、これからも一生懸命頑張ります。"
        }
      ],
      vocab: [
        { ja: "将来 (しょうらい)", id: "Masa depan" },
        { ja: "夢 (ゆめ)", id: "Impian / cita-cita" },
        { ja: "会社を作る (かいしゃをつくる)", id: "Mendirikan perusahaan / merintis bisnis" },
        { ja: "特定技能 (とくていぎのう)", id: "Specified Skilled Worker (SSW)" },
        { ja: "試験を受ける (しけんをうける)", id: "Mengikuti ujian" },
        { ja: "合格する (ごうかくする)", id: "Lulus ujian" },
        { ja: "技術 (ぎじゅつ)", id: "Keterampilan teknik / skill" },
        { ja: "独立する (どくりつする)", id: "Mandiri / membuka usaha sendiri" },
        { ja: "目標 (もくひょう)", id: "Target / capaian sasaran" },
        { ja: "応援する (おうえんする)", id: "Mendukung / memberi semangat" }
      ]
    },
    audioFiles: [
      { track: "18-01", file: "Z_[18-01]_kotoba1.mp3", title: "ことばの準備① — 将来の希望と職業" },
      { track: "18-02", file: "Z_[18-02]_kotoba2.mp3", title: "ことばの準備② — 目標を表す表現" },
      { track: "18-03", file: "Z_[18-03]_kiku1.mp3", title: "聞きましょう① — 帰国後の夢（レストラン開業）" },
      { track: "18-04", file: "Z_[18-04]_kiku2.mp3", title: "聞きましょう① — 日本での特定技能への移行" },
      { track: "18-05", file: "Z_[18-05]_kiku3.mp3", title: "聞きましょう① — 母国での日本語教師の道" },
      { track: "18-06", file: "Z_[18-06]_kiku4.mp3", title: "聞きましょう① — 日本の大学や専門学校への進学" },
      { track: "18-07", file: "Z_[18-07]_katachi1.mp3", title: "形に注目① — 意向形の作り方と使い方" },
      { track: "18-08", file: "Z_[18-08]_katachi2.mp3", title: "形に注目② — ～つもりです" },
      { track: "18-09", file: "Z_[18-09]_katachi3.mp3", title: "形に注目③ — ～ために" },
      { track: "18-10", file: "Z_[18-10]_hanasu1.mp3", title: "話しましょう① — 夢を語るスピーチ発表会" },
      { track: "18-11", file: "Z_[18-11]_hanasu2.mp3", title: "話しましょう② — 先生や仲間からの励まし" },
      { track: "18-15", file: "Z_[18-15]_kaiwa.mp3", title: "会話（本文） — 送別会での未来の誓い" },
      { track: "18-18", file: "Z_[18-18]_hanasu.mp3", title: "話しましょう — 自分の将来の夢のスピーチ" }
    ],
    choukaiQuestions: [
      {
        prompt: "アリさんは帰国した後、何をしようと思っていますか。",
        options: ["自分の国で日本料理のレストランを開こうと思っている", "ずっと家で休む", "別の国へ旅行する", "学校をやめる"],
        answer: 1,
        audioUrl: "audio/Z_[18-03]_kiku1.mp3",
        script: "日本で学んだ本場の味を母国の人たちにも味わってもらいたいので、帰国したら小さな日本料理店を開こうと思っています。"
      },
      {
        prompt: "ヌルさんは実習が終わった後、どうするつもりですか。",
        options: ["特定技能の試験を受けて、さらに5年間日本で働くつもり", "すぐに帰国する", "別の会社に転職する", "実習を途中でやめる"],
        answer: 1,
        audioUrl: "audio/Z_[18-04]_kiku2.mp3",
        script: "今の職場で介護の仕事にやりがいを感じています。来月、特定技能の評価試験を受けて、あと5年日本で働くつもりです。"
      },
      {
        prompt: "マイさんが日本語教師を目指している理由は何ですか。",
        options: ["日本で培った経験を次の世代の後輩たちに伝えたいから", "給料が高いから", "日本語が好きじゃないから", "なんとなく"],
        answer: 1,
        audioUrl: "audio/Z_[18-05]_kiku3.mp3",
        script: "日本に来て人生が変わりました。国に帰ったら、私のように日本で働きたいと夢見る若い生徒たちに日本語を教えたいです。"
      },
      {
        prompt: "専門学校で勉強したい分野は何ですか。",
        options: ["自動車整備と最新のIT技術", "料理だけ", "絵画", "音楽"],
        answer: 1,
        audioUrl: "audio/Z_[18-06]_kiku4.mp3",
        script: "日本の電気自動車の技術をもっと深く学びたいので、来年の春から専門学校の自動車整備科に進学しようと思っています。"
      },
      {
        prompt: "先生から卒業生へ贈られた励ましの言葉は何ですか。",
        options: ["困難があっても諦めずに自分の夢に向かって進んでください", "早く諦めなさい", "何もしなくてよい", "お金だけ稼ぎなさい"],
        answer: 1,
        audioUrl: "audio/Z_[18-10]_hanasu1.mp3",
        script: "皆さんが日本で努力した日々は決して裏切りません。自信を持って、それぞれの夢に向かって堂々と羽ばたいてください。"
      },
      {
        prompt: "スピーチの最後に全員で誓ったことは何ですか。",
        options: ["それぞれの道でベストを尽くし、また笑顔で再会すること", "連絡を取り合わないこと", "今日で日本語をやめること", "過去を忘れること"],
        answer: 1,
        audioUrl: "audio/Z_[18-15]_kaiwa.mp3",
        script: "私たちはここで出会えた最高の仲間です。どんなに離れていても、お互いに夢を叶えてまた笑顔で再会しましょう！"
      }
    ]
  }
};

// ============================================================================
// 2. GENERATE SETIAP BAB 13 S.D. 18
// ============================================================================
Object.keys(CHAPTERS_DATA).forEach((chStr) => {
  const ch = Number(chStr);
  const data = CHAPTERS_DATA[ch];
  const targetDir = path.join(LKPD_DIR, `bab${ch}`);
  const targetAudioDir = path.join(targetDir, 'audio');

  console.log(`\n--- Memproses Bab ${ch}: ${data.titleJa} ---`);

  // 1. Buat folder bab & audio
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  if (!fs.existsSync(targetAudioDir)) fs.mkdirSync(targetAudioDir, { recursive: true });

  // 2. Salin file audio otentik
  const audioFiles = fs.readdirSync(AUDIO_SOURCE_DIR).filter(f => f.startsWith(`Z_[${ch}-`));
  console.log(`Menyalin ${audioFiles.length} file audio untuk Bab ${ch}...`);
  audioFiles.forEach(f => {
    const src = path.join(AUDIO_SOURCE_DIR, f);
    const dest = path.join(targetAudioDir, f);
    fs.copyFileSync(src, dest);
  });

  // 3. Salin style.css dari bab12
  const styleSrc = path.join(LKPD_DIR, 'bab12', 'style.css');
  const styleDest = path.join(targetDir, 'style.css');
  if (fs.existsSync(styleSrc)) {
    fs.copyFileSync(styleSrc, styleDest);
  }

  // 4. Generate index.html
  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LKPD Interaktif Bahasa Jepang Bab ${ch} - A2.2 / JFT-Basic</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <!-- LOGIN SCREEN -->
  <div id="loginScreen" class="login-wrap">
    <div class="login-card">
      <div style="font-size:10px; font-weight:900; letter-spacing:1px; color:#d97706; text-transform:uppercase; margin-bottom:4px;">
        LPK JP10 OUTSUTSUKI • KURIKULUM CEFR A2
      </div>
      <h1>LKPD Bahasa Jepang Bab ${ch}</h1>
      <p class="ja" style="font-size:1.15rem; font-weight:bold; color:#78350f;">${data.titleJa}</p>
      <p>Level: A2.2 • ${data.topic} / Persiapan JFT-Basic</p>

      <div class="role-buttons">
        <button id="btnRoleStudent" class="role-btn active" onclick="selectRole('student')">
          Peserta
        </button>
        <button id="btnRoleTeacher" class="role-btn" onclick="selectRole('teacher')">
          Guru / Sensei
        </button>
      </div>

      <form id="studentForm" onsubmit="event.preventDefault(); loginStudent();">
        <label>
          Nama Peserta Didik
          <input type="text" id="loginName" required placeholder="Contoh: Budi Santoso" />
        </label>
        <label>
          Kelas / Angkatan LPK
          <input type="text" id="loginClass" required placeholder="Contoh: Kelas A2.2 - JP10" />
        </label>
        <label>
          Tanggal Pengerjaan
          <input type="date" id="loginDate" required />
        </label>
        <button type="submit">Masuk & Mulai Mengerjakan LKPD</button>
      </form>

      <form id="teacherForm" style="display:none;" onsubmit="event.preventDefault(); loginTeacher();">
        <label>
          Password Guru / Sensei
          <input type="password" id="teacherPassword" required placeholder="Masukkan PIN Guru" />
        </label>
        <button type="submit">Masuk sebagai Guru</button>
      </form>

      <p id="loginError" class="error"></p>
    </div>
  </div>

  <!-- APP INTERAKTIF -->
  <div id="app" style="display:none;">
    <header>
      <div class="container header-flex">
        <div>
          <h1 style="font-size:1.25rem;">LKPD Interaktif Bab ${ch}</h1>
          <p id="userInfo" style="font-size:0.85rem; color:#fef3c7;"></p>
        </div>
        <div class="header-actions no-print">
          <button onclick="calculateScore()">Hitung Nilai</button>
          <button class="secondary" onclick="copyReport()">Salin Laporan</button>
          <button style="background:#059669;color:#fff;" onclick="kirimKeGuru()">Kirim Nilai ke LMS</button>
          <button class="secondary" onclick="window.print()">Cetak / PDF</button>
          <button class="danger" onclick="logout()">Keluar</button>
        </div>
      </div>
    </header>

    <div class="container">
      <nav id="tabs" class="tabs no-print"></nav>
      <main id="panels"></main>
    </div>
  </div>

  <script src="data-soal.js?v=5.0"></script>
  <script src="script.js?v=5.0"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf8');

  // 5. Generate script.js (Menggunakan runtime stabil bab12 yang disesuaikan ke KKM 85 & babId)
  let baseScript = fs.readFileSync(path.join(LKPD_DIR, 'bab12', 'script.js'), 'utf8');
  baseScript = baseScript.replace(/bab12/g, `bab${ch}`);
  baseScript = baseScript.replace(/Bab 12/g, `Bab ${ch}`);
  baseScript = baseScript.replace(/lkpd_bab12/g, `lkpd_bab${ch}`);
  baseScript = baseScript.replace(/session_v1|session_v4/g, `session_v5`);
  baseScript = baseScript.replace(/state_v1|state_v4/g, `state_v5`);
  baseScript = baseScript.replace(
    /const isLulus = finalNilai >= 65 && weak\.length <= 1;/g,
    'const isLulus = finalNilai >= 85 && weak.length === 0;'
  );
  baseScript = baseScript.replace(
    /LULUS \(CHECKPOINT 1 TERCAPAI\)/g,
    `LULUS (TUNTAS KKM LPK ≥ 85.0 pt - BAB ${ch})`
  );
  baseScript = baseScript.replace(
    /BELUM LULUS \(REMEDIAL CHECKPOINT 1\)/g,
    `BELUM MEMENUHI KKM (REMEDIAL KKM < 85.0 pt - BAB ${ch})`
  );

  fs.writeFileSync(path.join(targetDir, 'script.js'), baseScript, 'utf8');

  // 6. Generate data-soal.js yang kaya dan otentik
  const dataSoalContent = `/*
  data-soal.js - LKPD Bab ${ch}: ${data.titleJa}
  Kurikulum Irodori Nihongo de Seikatsu 初級2 (A2.2)
  Standar CEFR A2 / JFT-Basic / LPK Terstandar KKM 85 pt
*/

window.LKPD_DATA = {
  settings: {
    babId: "bab${ch}",
    babTitle: "${data.titleJa}",
    subTitle: "${data.titleSub}",
    canDo: "${data.canDo.map(c => c.split(':')[0]).join(', ')}",
    sessionKey: "lkpd_bab${ch}_session_v5",
    stateKey: "lkpd_bab${ch}_state_v5",
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
      html: \`
        <h2>Panduan Penggunaan LKPD Bab ${ch}</h2>
        <div class="meta-box" style="background:#fffbeb; border:1px solid #f59e0b; padding:16px; border-radius:12px; margin-bottom:18px;">
          <p><strong>Satuan Pendidikan / LPK:</strong> LPK JP10 Outsutsuki (Standardisasi JF CEFR A2)</p>
          <p><strong>Mata Pelajaran:</strong> Bahasa Jepang (Irodori 初級2 - Bab ${ch})</p>
          <p><strong>Topik:</strong> ${data.titleJa} • ${data.topic}</p>
          <p><strong>Alokasi Waktu:</strong> 90 Menit (Teori, Latihan Terbimbing & Asesmen Mandiri)</p>
          <p><strong>Standar Kelulusan KKM LPK:</strong> Nilai Akhir &ge; 85.0 pt (Tuntas KKM) | Mini JFT-like &ge; 85.0 pt | Skala JFT-Basic &ge; 200/250</p>
        </div>

        <h3>A. Capaian Pembelajaran (Can-Do Irodori Bab ${ch}):</h3>
        <ul>
          ${data.canDo.map(c => `<li><strong>${c.split(':')[0]}:</strong> ${c.split(':')[1]}</li>`).join('\n          ')}
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
      \`
    },

    /* ================= 2. RINGKASAN MATERI ================= */
    {
      id: "materi",
      label: "Materi",
      type: "static",
      html: \`
        <h2>Ringkasan Materi & Tata Bahasa Bab ${ch}</h2>
        <div class="vocab-grid">
          <div class="vocab-card" style="background:#f8fafc; border:1px solid #cbd5e1; padding:16px; border-radius:12px; margin-bottom:16px;">
            <h4 style="color:#1e3a8a; border-bottom:2px solid #3b82f6; padding-bottom:6px;">Pola Tata Bahasa Utama</h4>
            <ul>
              ${data.materi.pola.map(p => `
                <li style="margin-bottom:12px;">
                  <strong style="color:#0f172a; font-size:1.05rem;">${p.name}</strong><br>
                  <span style="color:#334155;">${p.desc}</span><br>
                  <em style="color:#047857; font-weight:bold;">Contoh: ${p.ex}</em>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="vocab-card" style="background:#f8fafc; border:1px solid #cbd5e1; padding:16px; border-radius:12px;">
            <h4 style="color:#1e3a8a; border-bottom:2px solid #3b82f6; padding-bottom:6px;">Kosakata Penting Bab ${ch}</h4>
            <table style="width:100%; border-collapse:collapse; margin-top:8px;">
              <thead>
                <tr style="background:#e2e8f0; text-align:left;">
                  <th style="padding:8px; border:1px solid #cbd5e1;">Bahasa Jepang</th>
                  <th style="padding:8px; border:1px solid #cbd5e1;">Arti Bahasa Indonesia</th>
                </tr>
              </thead>
              <tbody>
                ${data.materi.vocab.map(v => `
                  <tr>
                    <td style="padding:8px; border:1px solid #cbd5e1; font-weight:bold;" class="ja">${v.ja}</td>
                    <td style="padding:8px; border:1px solid #cbd5e1;">${v.id}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      \`
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
          prompt: "「${data.materi.vocab[0].ja.split(' ')[0]}」の読み方はどれですか。",
          options: ["${data.materi.vocab[0].ja.match(/\\(([^)]+)\\)/) ? data.materi.vocab[0].ja.match(/\\(([^)]+)\\)/)[1] : 'こうきょう'}", "しやくしょ", "としょかん", "びじゅつかん"],
          answer: 1
        },
        {
          id: "q2",
          type: "mcq",
          number: "Soal 2.",
          prompt: "文の（　　）脈に最も合う言葉を選んでください。<br>町のことについて相談したいので、（　　）の窓口へ行きました。",
          options: ["${data.materi.vocab[1].ja.split(' ')[0]}", "映画館", "コンビニ", "公園"],
          answer: 1
        },
        {
          id: "q3",
          type: "mcq",
          number: "Soal 3.",
          prompt: "「${data.materi.vocab[2].ja.split(' ')[0]}」の意味はどれですか。",
          options: ["${data.materi.vocab[2].id}", "Restoran cepat saji", "Stasiun kereta", "Rumah sakit"],
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
          prompt: "「${data.materi.vocab[3].ja.split(' ')[0]}」の読み方はどれですか。",
          options: ["${data.materi.vocab[3].ja.match(/\\(([^)]+)\\)/) ? data.materi.vocab[3].ja.match(/\\(([^)]+)\\)/)[1] : 'びじゅつかん'}", "たいそうかん", "ゆうびんきょく", "ぎんこう"],
          answer: 1
        },
        {
          id: "q6",
          type: "mcq",
          number: "Soal 6.",
          prompt: "「${data.materi.vocab[4].ja.split(' ')[0]}」の意味として最も適切なものはどれですか。",
          options: ["${data.materi.vocab[4].id}", "Peralatan dapur", "Tiket bioskop", "Menu makan siang"],
          answer: 1
        },
        {
          id: "q7",
          type: "mcq",
          number: "Soal 7.",
          prompt: "「${data.materi.vocab[5].ja.split(' ')[0]}」の読み方はどれですか。",
          options: ["${data.materi.vocab[5].ja.match(/\\(([^)]+)\\)/) ? data.materi.vocab[5].ja.match(/\\(([^)]+)\\)/)[1] : 'てんじ'}", "あんない", "ちゅうし", "よやく"],
          answer: 1
        },
        {
          id: "q8",
          type: "mcq",
          number: "Soal 8.",
          prompt: "文の（　　）に入る言葉を選んでください。<br>施設の利用について詳しく知りたいので、（　　）をよく読みました。",
          options: ["${data.materi.vocab[8].ja.split(' ')[0]}", "小説", "マンガ", "レシピ"],
          answer: 1
        },
        {
          id: "q9",
          type: "mcq",
          number: "Soal 9.",
          prompt: "「${data.materi.vocab[6].ja.split(' ')[0]}」の意味はどれですか。",
          options: ["${data.materi.vocab[6].id}", "Hari buka toko", "Hari gajian", "Hari perayaan festival"],
          answer: 1
        },
        {
          id: "q10",
          type: "mcq",
          number: "Soal 10.",
          prompt: "「${data.materi.vocab[7].ja.split(' ')[0]}」の読み方はどれですか。",
          options: ["${data.materi.vocab[7].ja.match(/\\(([^)]+)\\)/) ? data.materi.vocab[7].ja.match(/\\(([^)]+)\\)/)[1] : 'にゅうかんりょう'}", "しゅっぱつりょう", "でんきだい", "うんちん"],
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
        ${data.choukaiQuestions.map((q, idx) => `
        {
          id: "q${19 + idx}",
          type: "listening",
          number: "Soal ${19 + idx}.",
          prompt: "${q.prompt}",
          options: ${JSON.stringify(q.options)},
          answer: ${q.answer},
          audioUrl: "${q.audioUrl}",
          script: "${q.script}"
        }`).join(',\n        ')}
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
        ${data.materi.vocab.map((v, i) => `
        { id: "voc${i + 1}", ja: "${v.ja.split(' ')[0]}", idText: "${v.id}" }`).join(',\n        ')}
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
      label: "🎧 Bank Audio Bab ${ch}",
      type: "audiobank",
      items: ${JSON.stringify(data.audioFiles, null, 2)}
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
      html: \`
        <h2>Refleksi Kemandirian Belajar Siswa (Jiko Hyouka Bab ${ch})</h2>
        <p>Isilah refleksi berikut secara jujur setelah menyelesaikan seluruh materi dan asesmen LKPD Bab ${ch}.</p>

        <div class="question-card" style="background:#f8fafc; border:1px solid #cbd5e1; padding:14px; border-radius:12px; margin-bottom:12px;">
          <label><strong>1. Can-Do mana yang sudah berhasil saya kuasai dengan sangat baik pada Bab ${ch} ini?</strong></label>
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
      \`
    }
  ]
};
`;

  fs.writeFileSync(path.join(targetDir, 'data-soal.js'), dataSoalContent, 'utf8');
  console.log(`✓ Berhasil men-generate modul LKPD lengkap untuk Bab ${ch}!`);
});

console.log('\n=== GENERASI LKPD BAB 13 S.D. BAB 18 SELESAI DENGAN SUKSES! ===');
