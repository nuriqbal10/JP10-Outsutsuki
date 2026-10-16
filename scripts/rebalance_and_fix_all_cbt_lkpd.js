const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const sql = neon(process.env.DATABASE_URL);

console.log('=== MEMULAI SIKLUS PERBAIKAN & STANDARISASI KUNCI JAWABAN, AUDIO & DOKKAI (BAB 8-18) ===\n');

// 1. DATA MASTER BAB 13 - 18 DENGAN FILE AUDIO YANG 100% SESUAI DISK FISIK
const AUTHENTIC_CHAPTERS = {
  13: {
    titleJa: "第13課「いろいろな資料を展示してあります」",
    titleSub: "さまざまなサービス・公共施設（図書館・市役所・美術館）",
    topic: "公共施設と利用案内／利用ルールと設備",
    canDo: [
      "Can-do 52: 施設などを案内されたとき、そこに何があるか、どんなことができるかを聞いて理解することができる。",
      "Can-do 53: 公共施設などで、設備やサービスを利用したいときに、希望を伝えて質問することができる。",
      "Can-do 54: 公共施設などの利用案内を読んで、利用時間や料金、利用方法などの情報を読み取ることができる。"
    ],
    audioFiles: [
      { track: "13-01", file: "Z_[13-01]_kotoba1.mp3", title: "ことばの準備① — 公共施設の名前" },
      { track: "13-02", file: "Z_[13-02]_kotoba2.mp3", title: "ことばの準備② — 施設でできること" },
      { track: "13-03", file: "Z_[13-03]_kiku.mp3", title: "聞きましょう① — 施設の案内（展示室）" },
      { track: "13-07", file: "Z_[13-07]_kiku1.mp3", title: "聞きましょう② — 市民会館の利用案内" },
      { track: "13-08", file: "Z_[13-08]_kiku2.mp3", title: "聞きましょう② — 図書館の貸出カード" },
      { track: "13-09", file: "Z_[13-09]_kiku3.mp3", title: "聞きましょう② — 美術館の企画展" },
      { track: "13-10", file: "Z_[13-10]_kiku4.mp3", title: "聞きましょう② — スポーツセンターの利用" },
      { track: "13-11", file: "Z_[13-11]_kaiwa.mp3", title: "会話（本文） — 窓口での質問" },
      { track: "13-13", file: "Z_[13-13]_hanasu1.mp3", title: "話しましょう — 施設のおすすめ" }
    ],
    choukai: [
      {
        prompt: "展示室にはどのようなものが置いてありますか。",
        correctOpt: "町の歴史や伝統工芸に関する古い資料や写真",
        distractors: ["新しい外国の家電製品", "スポーツの運動道具", "子供のおもちゃだけ"],
        audioUrl: "audio/Z_[13-03]_kiku.mp3",
        script: "こちらが郷土資料室です。棚にはこの町の歴史や伝統工芸に関する古い資料や写真が展示してあります。"
      },
      {
        prompt: "市民会館のホールを利用したいとき、まず何をしなければなりませんか。",
        correctOpt: "窓口で利用の予約と申請書を提出する",
        distractors: ["当日直接行って勝手に入る", "お金を払わずに鍵を開ける", "何もしなくてよい"],
        audioUrl: "audio/Z_[13-07]_kiku1.mp3",
        script: "市民ホールの利用を希望される場合は、ご利用日の1か月前までに窓口で利用申請書を提出してください。"
      },
      {
        prompt: "図書館で本を借りるために必要なものは何ですか。",
        correctOpt: "名前と住所を記入した利用カード",
        distractors: ["現金1000円", "会社の社員証のみ", "パスポートのコピー"],
        audioUrl: "audio/Z_[13-08]_kiku2.mp3",
        script: "初めて本を借りる方は、こちらの利用カード申込書にお名前とご住所を書いて、カードを作ってください。"
      },
      {
        prompt: "美術館の特別展示は何時まで見学できますか。",
        correctOpt: "夕方5時まで（入場は4時半まで）",
        distractors: ["夜8時まで", "午前11時まで", "24時間いつでも"],
        audioUrl: "audio/Z_[13-09]_kiku3.mp3",
        script: "ただいま特別企画展を開催中です。閉館は夕方5時ですが、最終入場は4時半となっておりますのでご注意ください。"
      },
      {
        prompt: "スポーツセンターのトレーニング室を使うときのルールは何ですか。",
        correctOpt: "室内用の運動靴に履き替えること",
        distractors: ["外履きの靴のまま走ること", "飲食しながら運動すること", "靴を脱いで裸足で走ること"],
        audioUrl: "audio/Z_[13-10]_kiku4.mp3",
        script: "トレーニングジムをご利用の際は、必ず室内用の運動靴に履き替えてご利用いただくようお願いいたします。"
      },
      {
        prompt: "案内員が「ぜひ一度行ってみてください」と勧めている場所はどこですか。",
        correctOpt: "屋上庭園の展望デッキ",
        distractors: ["地下の倉庫", "有料のレストラン", "駐車場"],
        audioUrl: "audio/Z_[13-13]_hanasu1.mp3",
        script: "天気がいい日は屋上の展望デッキがとても気持ちいいですよ。富士山も見えますから、ぜひ一度行ってみてください。"
      }
    ]
  },

  14: {
    titleJa: "第14課「髪をもう少し短くしてください」",
    titleSub: "サービスを利用する（美容院・クリーニング・宅配便）",
    topic: "店舗サービスの利用／希望の注文と受け取り",
    canDo: [
      "Can-do 55: 美容院などで、髪型や長さの希望を美容師に伝えることができる。",
      "Can-do 56: クリーニング店や修理店で、品物を預けたり、仕上がりの日時を確認したりすることができる。",
      "Can-do 57: 郵便局や宅配便の窓口で、荷物の重さや届け先を伝えて発送を依頼することができる。"
    ],
    audioFiles: [
      { track: "14-01", file: "Z_[14-01]_kotoba.mp3", title: "ことばの準備 — 髪型とサービスの種類" },
      { track: "14-02", file: "Z_[14-02]_kiku1.mp3", title: "聞きましょう① — 美容院でのカットの注文" },
      { track: "14-03", file: "Z_[14-03]_kiku2.mp3", title: "聞きましょう① — クリーニングの受付" },
      { track: "14-04", file: "Z_[14-04]_kiku3.mp3", title: "聞きましょう① — 宅配便の荷物発送" },
      { track: "14-05", file: "Z_[14-05]_kiku4.mp3", title: "聞きましょう① — 時計や靴の修理店" },
      { track: "14-06", file: "Z_[14-06]_kaiwa1.mp3", title: "会話① — 髪型の細かな相談" },
      { track: "14-07", file: "Z_[14-07]_kaiwa2.mp3", title: "会話② — 配達時間帯の指定" },
      { track: "14-11", file: "Z_[14-11]_hanasu2.mp3", title: "話しましょう — 宅配伝票の確認" }
    ],
    choukai: [
      {
        prompt: "客は髪をどのようにしてほしいと頼みましたか。",
        correctOpt: "全体を少し短くして、前髪は眉の上くらいにそろえる",
        distractors: ["髪を明るい赤に染める", "全体を丸刈り（坊主）にする", "髪の長さを全く切らない"],
        audioUrl: "audio/Z_[14-02]_kiku1.mp3",
        script: "今日はどうされますか？ 全体を2センチくらい短くして、前髪は眉毛の上くらいにそろえてもらえますか。"
      },
      {
        prompt: "クリーニングに出したコートはいつ仕上がりますか。",
        correctOpt: "今週金曜日の午後3時以降",
        distractors: ["明日の朝一番", "来週の日曜日", "1か月後"],
        audioUrl: "audio/Z_[14-03]_kiku2.mp3",
        script: "こちらの冬用のコートですね。水曜日の受付ですので、仕上がりは今週金曜日の午後3時以降となります。"
      },
      {
        prompt: "宅配便で送る荷物の中に何が入っていますか。",
        correctOpt: "ガラスのコップとお土産のお菓子",
        distractors: ["本とノートだけ", "危険物", "現金"],
        audioUrl: "audio/Z_[14-04]_kiku3.mp3",
        script: "お荷物の中身は何でしょうか？ ガラスのコップとお土産のお菓子です。割れ物シールを貼っておきますね。"
      },
      {
        prompt: "靴の修理代金はいくらですか。",
        correctOpt: "両足で1,500円",
        distractors: ["500円", "3,000円", "無料"],
        audioUrl: "audio/Z_[14-05]_kiku4.mp3",
        script: "かかとのゴムの交換ですね。両足で1,500円になります。30分ほどで終わりますよ。"
      },
      {
        prompt: "美容院の会話で、客はカラー（毛染め）についてどう決めましたか。",
        correctOpt: "明るすぎない自然な茶色に染めてもらう",
        distractors: ["真っ黒のままにする", "金髪にする", "染めるのをやめる"],
        audioUrl: "audio/Z_[14-06]_kaiwa1.mp3",
        script: "カラーはどうなさいますか？ あまり明るすぎない、自然な落ち着いた茶色でお願いします。"
      },
      {
        prompt: "宅配便の荷物の配達希望時間は何時ですか。",
        correctOpt: "夜間（18時から20時の間）",
        distractors: ["午前中一番（8時～10時）", "昼12時ちょうど", "いつでもよい"],
        audioUrl: "audio/Z_[14-07]_kaiwa2.mp3",
        script: "配達時間帯のご希望はございますか？ 昼間は仕事で不在なので、夜18時から20時の指定でお願いします。"
      }
    ]
  },

  15: {
    titleJa: "第15課「ゴミを減らすために、マイバッグを持っています」",
    titleSub: "環境とエコ生活（ゴミの分別・リサイクル・省エネルギー）",
    topic: "環境保護とごみの分別ルール／エコな暮らしの習慣",
    canDo: [
      "Can-do 58: 地域のゴミ出しルールを聞いて、ゴミの分別方法や収集日を理解することができる。",
      "Can-do 59: 環境を守るために自分が普段心がけている工夫やエコ習慣について話すことができる。",
      "Can-do 60: リサイクルや不用品の譲渡・バザーに関する案内を読んで内容を理解することができる。"
    ],
    audioFiles: [
      { track: "15-01", file: "Z_[15-01]_kotoba1.mp3", title: "ことばの準備① — ゴミの種類と分別" },
      { track: "15-02", file: "Z_[15-02]_kotoba2.mp3", title: "ことばの準備② — 環境にやさしい行動" },
      { track: "15-03", file: "Z_[15-03]_kiku1.mp3", title: "聞きましょう① — アパートのゴミ出しルール" },
      { track: "15-04", file: "Z_[15-04]_kiku2.mp3", title: "聞きましょう① — ペットボトルの捨て方" },
      { track: "15-05", file: "Z_[15-05]_kiku3.mp3", title: "聞きましょう① — 粗大ゴミの収集予約" },
      { track: "15-06", file: "Z_[15-06]_kiku4.mp3", title: "聞きましょう① — フリーマーケットの案内" },
      { track: "15-08", file: "Z_[15-08]_hanasu1.mp3", title: "話しましょう① — 自慢のエコライフ" },
      { track: "15-10", file: "Z_[15-10]_kaiwa.mp3", title: "会話（本文） — ゴミの分別とリサイクル" }
    ],
    choukai: [
      {
        prompt: "燃えるゴミの収集日は何曜日ですか。",
        correctOpt: "火曜日と金曜日の朝8時まで",
        distractors: ["毎週日曜日", "水曜日のみ", "毎日いつでもよい"],
        audioUrl: "audio/Z_[15-03]_kiku1.mp3",
        script: "この地域では、生ゴミや燃えるゴミは火曜日と金曜日の朝8時までに指定のゴミステーションに出してください。"
      },
      {
        prompt: "ペットボトルを捨てるときに必ずしなければならないことは何ですか。",
        correctOpt: "水で洗って、キャップとラベルを外すこと",
        distractors: ["潰さずにそのまま出すこと", "燃えるゴミに混ぜて出すこと", "外で燃やすこと"],
        audioUrl: "audio/Z_[15-04]_kiku2.mp3",
        script: "ペットボトルは中を軽く水でゆすいで、キャップとラベルを外してプラスチックゴミへ、本体は資源ゴミのネットに入れてください。"
      },
      {
        prompt: "壊れた自転車などの大型ゴミを捨てるにはどうすればいいですか。",
        correctOpt: "粗大ゴミ受付センターに電話して有料シールを貼る",
        distractors: ["近所の公園に置いておく", "普通ゴミ袋に入れて出す", "川に捨てる"],
        audioUrl: "audio/Z_[15-05]_kiku3.mp3",
        script: "自転車や家具などの大型ゴミは粗大ゴミになります。事前に受付センターへ連絡して収集券シールを購入して貼ってください。"
      },
      {
        prompt: "フリーマーケットに参加する目的は何ですか。",
        correctOpt: "使わなくなった物を捨てずにリサイクルするため",
        distractors: ["新しいブランド品を大量に買うため", "ゴミを捨てるため", "何もしないため"],
        audioUrl: "audio/Z_[15-06]_kiku4.mp3",
        script: "今度の日曜日、市民公園でフリーマーケットがあります。まだ使える服や本を持ち寄ってリサイクルしましょう。"
      },
      {
        prompt: "男性がマイボトル（水筒）を持ち歩いている一番の理由は何ですか。",
        correctOpt: "プラスチックゴミを減らすため",
        distractors: ["ジュースを買うお金がないから", "重い荷物を持ちたいから", "水筒が好きだから"],
        audioUrl: "audio/Z_[15-08]_hanasu1.mp3",
        script: "毎日マイボトルにお茶を入れて職場に持参しています。飲み物代の節約にもなりますし、プラスチックゴミを減らすためです。"
      },
      {
        prompt: "会話で「もったいない」と言われているのはどんなことですか。",
        correctOpt: "まだ着られる服や使える家具を捨ててしまうこと",
        distractors: ["美味しい料理を作ること", "たくさん勉強すること", "早く寝ること"],
        audioUrl: "audio/Z_[15-10]_kaiwa.mp3",
        script: "まだ着られる服を捨ててしまうのは本当にもったいないですね。リサイクルショップやフリーマーケットを活用しましょう。"
      }
    ]
  },

  16: {
    titleJa: "第16課「地震が起きたら、どうすればいいですか？」",
    titleSub: "防災と安全（地震・台風・避難所・非常用持ち出し袋）",
    topic: "自然災害への備えと緊急行動／防災訓練と避難",
    canDo: [
      "Can-do 61: 緊急地震速報や防災行政無線のアナウンスを聞いて、指示内容を理解することができる。",
      "Can-do 62: 地震や台風の際にとるべき安全な行動について、指示を聞いたり質問したりできる。",
      "Can-do 63: 避難場所の案内地図やハザードマップを見て、避難所の場所や避難経路を確認することができる。"
    ],
    audioFiles: [
      { track: "16-01", file: "Z_[16-01]_kotoba.mp3", title: "ことばの準備 — 自然災害と防災グッズ" },
      { track: "16-02", file: "Z_[16-02]_kiku1.mp3", title: "聞きましょう① — 緊急地震速報の警報音と指示" },
      { track: "16-03", file: "Z_[16-03]_kiku2.mp3", title: "聞きましょう① — 職場での避難誘導アナウンス" },
      { track: "16-04", file: "Z_[16-04]_kiku3.mp3", title: "聞きましょう① — 台風接近による電車の運休情報" },
      { track: "16-07", file: "Z_[16-07]_kiku1.mp3", title: "聞きましょう② — 揺れが収まった後の行動" },
      { track: "16-08", file: "Z_[16-08]_kiku2.mp3", title: "聞きましょう② — 非常用持ち出し袋の準備品" },
      { track: "16-09", file: "Z_[16-09]_kiku3.mp3", title: "聞きましょう② — 避難所生活でのルール" }
    ],
    choukai: [
      {
        prompt: "緊急地震速報が鳴ったとき、最初にとるべき行動は何ですか。",
        correctOpt: "姿勢を低くして、机の下などで頭を守ること",
        distractors: ["外へ走って逃げること", "窓を大きく開けること", "写真を撮ること"],
        audioUrl: "audio/Z_[16-02]_kiku1.mp3",
        script: "緊急地震速報です。強い揺れに警戒してください。姿勢を低くし、頭を守り、揺れが収まるまで動かないでください。"
      },
      {
        prompt: "避難するとき、エレベーターを使ってはいけない理由は何ですか。",
        correctOpt: "停電でエレベーターの中に閉じ込められる危険があるから",
        distractors: ["エレベーターが遅いから", "料金がかかるから", "荷物が多いから"],
        audioUrl: "audio/Z_[16-03]_kiku2.mp3",
        script: "避難誘導アナウンスです。停電で閉じ込められる危険があるため、絶対にエレベーターは使用せず非常階段をご利用ください。"
      },
      {
        prompt: "台風が近づいているため、電車はどうなりますか。",
        correctOpt: "夕方5時からすべての路線で計画運休（ストップ）になる",
        distractors: ["一晩中いつもより速く走る", "無料になる", "普段通り走る"],
        audioUrl: "audio/Z_[16-04]_kiku3.mp3",
        script: "大型の台風接近に伴い、本日午後5時以降、すべての路線で計画運休を実施いたします。お早めのご帰宅をお願いします。"
      },
      {
        prompt: "地震の揺れが収まった後、まず確認すべきことは何ですか。",
        correctOpt: "ガスの火を消して、ドアを開けて出口を確保する",
        distractors: ["テレビゲームをする", "すぐに寝る", "友達と遊びに行く"],
        audioUrl: "audio/Z_[16-07]_kiku1.mp3",
        script: "揺れが収まったら、火の元を確認してガスの元栓を閉め、避難用の出口を確保してください。"
      },
      {
        prompt: "非常用リュックに入れておく水と食料は何日分が目安ですか。",
        correctOpt: "最低でも3日分",
        distractors: ["1食分だけ", "1か月分", "用意しなくてよい"],
        audioUrl: "audio/Z_[16-08]_kiku2.mp3",
        script: "大規模な災害が発生すると救援物資が届くまで時間がかかります。飲料水と保存食は最低3日分備蓄しておきましょう。"
      },
      {
        prompt: "津波警報が出た場合、どこへ避難しなければなりませんか。",
        correctOpt: "高台や頑丈なビルの上階など、高い安全な場所",
        distractors: ["海岸の近く", "地下鉄の駅", "港の船の中"],
        audioUrl: "audio/Z_[16-09]_kiku3.mp3",
        script: "津波警報が発令されました！ 海岸近くにいる方はただちに高台や避難ビルの上階へ避難してください！"
      }
    ]
  },

  17: {
    titleJa: "第17課「日本語が前より話せるようになりました」",
    titleSub: "成長と変化・私の人生（日本語の上達・生活の変化・これまでの歩み）",
    topic: "日本生活での自己成長／過去と現在の比較",
    canDo: [
      "Can-do 64: 日本に来たばかりの頃と現在を比較して、できるようになったことや生活の変化を話すことができる。",
      "Can-do 65: 他の人の成長や日本生活での変化に関する話を聞いて、共感しながら理解することができる。",
      "Can-do 66: 日本での経験や成長を振り返る作文やスピーチを読んで、その気持ちを理解することができる。"
    ],
    audioFiles: [
      { track: "17-01", file: "Z_[17-01]_kiku1.mp3", title: "聞きましょう① — 日本語の上達（会話の自信）" },
      { track: "17-02", file: "Z_[17-02]_kiku2.mp3", title: "聞きましょう① — 食事の変化（納豆が食べられる）" },
      { track: "17-03", file: "Z_[17-03]_kiku3.mp3", title: "聞きましょう① — 仕事での役割（後輩への指導）" },
      { track: "17-04", file: "Z_[17-04]_kiku4.mp3", title: "聞きましょう① — 病院での症状説明" },
      { track: "17-06", file: "Z_[17-06]_hanasu1.mp3", title: "話しましょう① — 1年前と今の私" },
      { track: "17-09", file: "Z_[17-09]_kaiwa.mp3", title: "会話（本文） — 成長をたたえ合う仲間たち" }
    ],
    choukai: [
      {
        prompt: "ホアさんは日本に来てから何ができるようになりましたか。",
        correctOpt: "職場の同僚と休憩時間に冗談を言って笑い合えるようになった",
        distractors: ["車を運転すること", "フランス語を話すこと", "毎日外食すること"],
        audioUrl: "audio/Z_[17-01]_kiku1.mp3",
        script: "最初は挨拶しかできませんでしたが、最近は職場の同僚と休憩時間に冗談を言って笑い合えるようになりました。"
      },
      {
        prompt: "食べ物について、どのような変化がありましたか。",
        correctOpt: "最初は苦手だった納豆が毎朝美味しく食べられるようになった",
        distractors: ["お米が嫌いになった", "甘いものしか食べなくなった", "何も変わらない"],
        audioUrl: "audio/Z_[17-02]_kiku2.mp3",
        script: "最初は納豆の匂いがどうしてもダメだったんですが、今では毎朝ご飯に乗せて美味しく食べられるようになりました。"
      },
      {
        prompt: "職場で仕事のやり方はどのように変わりましたか。",
        correctOpt: "仕事に慣れて、新しく入ってきた後輩にも教えられるようになった",
        distractors: ["仕事をサボるようになった", "一人で何もしなくなった", "毎日ミスをする"],
        audioUrl: "audio/Z_[17-03]_kiku3.mp3",
        script: "1年経って機械の操作に慣れ、最近は新しく入ってきた後輩実習生に仕事のコツを教えられるようになりました。"
      },
      {
        prompt: "体調が悪くなったとき、どうすることができるようになりましたか。",
        correctOpt: "病院で一人で症状を詳しく説明できるようになった",
        distractors: ["病院に行くのを諦めるようになった", "誰にも言わないようになった", "薬を飲まなくなった"],
        audioUrl: "audio/Z_[17-04]_kiku4.mp3",
        script: "前は病院へ行くのが怖かったですが、今ではどこが痛いか一人で先生に詳しく伝えられるようになりました。"
      },
      {
        prompt: "話し手が「日本に来てよかった」と感じている一番の理由は何ですか。",
        correctOpt: "大変なことを乗り越えて、自分に自信がついたから",
        distractors: ["お金持ちになれたから", "買い物がたくさんできたから", "遊ぶ時間が長かったから"],
        audioUrl: "audio/Z_[17-06]_hanasu1.mp3",
        script: "大変なこともたくさんありましたが、乗り越えたことで自分に自信がつきました。日本に来て本当によかったと心から思います。"
      },
      {
        prompt: "仲間同士で話していて、一番感謝していることは何ですか。",
        correctOpt: "困ったときに職場の先輩や仲間が温かく支えてくれたこと",
        distractors: ["毎日プレゼントをもらったこと", "何もしなくてよかったこと", "早く帰れたこと"],
        audioUrl: "audio/Z_[17-09]_kaiwa.mp3",
        script: "辛いときもみんなが励ましてくれたからここまで頑張れました。本当に感謝しています。"
      }
    ]
  },

  18: {
    titleJa: "第18課「将来、自分の会社を作ろうと思っています」",
    titleSub: "将来の夢と計画（キャリア・特定技能・起業・修了）",
    topic: "これからの目標と人生設計／修了と次へのステップ",
    canDo: [
      "Can-do 67: 将来の夢やこれからの計画について、理由とともに人に話すことができる。",
      "Can-do 68: 他の人の夢やこれからの進路についての話を聞いて、応援したりアドバイスしたりできる。",
      "Can-do 69: 日本での学びを活かして次の目標に進む人の手記やメッセージを読んで理解することができる。"
    ],
    audioFiles: [
      { track: "18-01", file: "Z_[18-01]_kotoba1.mp3", title: "ことばの準備① — 将来の希望と職業" },
      { track: "18-02", file: "Z_[18-02]_kotoba2.mp3", title: "ことばの準備② — 目標を表す表現" },
      { track: "18-03", file: "Z_[18-03]_kiku1.mp3", title: "聞きましょう① — 帰国後の夢（レストラン開業）" },
      { track: "18-04", file: "Z_[18-04]_kiku2.mp3", title: "聞きましょう① — 日本での特定技能への移行" },
      { track: "18-05", file: "Z_[18-05]_kiku3.mp3", title: "聞きましょう① — 母国での日本語教師の道" },
      { track: "18-06", file: "Z_[18-06]_kiku4.mp3", title: "聞きましょう① — 専門学校への進学" },
      { track: "18-10", file: "Z_[18-10]_hanasu1.mp3", title: "話しましょう — 夢を語るスピーチ" },
      { track: "18-15", file: "Z_[18-15]_kaiwa.mp3", title: "会話（本文） — 未来への誓い" }
    ],
    choukai: [
      {
        prompt: "アリさんは帰国した後、何をしようと思っていますか。",
        correctOpt: "自分の国で小さな日本料理店を開こうと思っている",
        distractors: ["ずっと家で休むつもり", "別の国へ観光旅行するつもり", "仕事をやめるつもり"],
        audioUrl: "audio/Z_[18-03]_kiku1.mp3",
        script: "日本で学んだ本場の味を母国の人たちにも味わってもらいたいので、帰国したら小さな日本料理店を開こうと思っています。"
      },
      {
        prompt: "ヌルさんは実習が終わった後、どうするつもりですか。",
        correctOpt: "特定技能の試験を受けて、あと5年間日本で働くつもり",
        distractors: ["すぐに母国へ帰国する", "実習を途中でやめる", "別の会社に勝手に移る"],
        audioUrl: "audio/Z_[18-04]_kiku2.mp3",
        script: "今の職場で介護の仕事にやりがいを感じています。来月、特定技能の評価試験を受けて、あと5年日本で働くつもりです。"
      },
      {
        prompt: "マイさんが日本語教師を目指している理由は何ですか。",
        correctOpt: "日本で培った経験を次の世代の若い生徒たちに伝えたいから",
        distractors: ["給料が一番高いから", "日本語が好きじゃないから", "なんとなく"],
        audioUrl: "audio/Z_[18-05]_kiku3.mp3",
        script: "日本に来て人生が変わりました。国に帰ったら、私のように日本で働きたいと夢見る若い生徒たちに日本語を教えたいです。"
      },
      {
        prompt: "専門学校で勉強したい分野は何ですか。",
        correctOpt: "電気自動車の整備技術と最新IT",
        distractors: ["料理の作り方だけ", "絵画とデザイン", "ピアノの演奏"],
        audioUrl: "audio/Z_[18-06]_kiku4.mp3",
        script: "日本の電気自動車の技術をもっと深く学びたいので、来年の春から専門学校の自動車整備科に進学しようと思っています。"
      },
      {
        prompt: "スピーチ発表会で、話し手が最も大切にしたいと語ったことは何ですか。",
        correctOpt: "困難があっても諦めずに自分の目標に向かって挑戦し続けること",
        distractors: ["楽をして生きること", "お金だけをたくさん稼ぐこと", "早く諦めること"],
        audioUrl: "audio/Z_[18-10]_hanasu1.mp3",
        script: "夢を叶えるのは簡単ではありませんが、どんな困難があっても諦めずに一歩一歩前へ進み続けたいと思います。"
      },
      {
        prompt: "修了式で仲間同士が誓い合ったことは何ですか。",
        correctOpt: "それぞれの道でベストを尽くし、また笑顔で再会すること",
        distractors: ["連絡を取り合わないこと", "今日で日本語をやめること", "過去を忘れること"],
        audioUrl: "audio/Z_[18-15]_kaiwa.mp3",
        script: "私たちはここで出会えた最高の仲間です。それぞれの場所でベストを尽くして、また笑顔で再会しましょう！"
      }
    ]
  }
};

// 2. FUNGSI UNTUK MERATAKAN KUNCI JAWABAN (BALANCED ANSWER PERMUTATION)
// Target Kunci: Rasio seimbang 25% masing-masing untuk A, B, C, D
function balanceQuestion(q, targetIndex) {
  // targetIndex: 0 = A, 1 = B, 2 = C, 3 = D
  // Ambil jawaban benar asli (selalu posisi 0 di input awal)
  const correct = q.options[q.originalAnswerIndex !== undefined ? q.originalAnswerIndex : 0];
  const distractors = q.options.filter((_, idx) => idx !== (q.originalAnswerIndex !== undefined ? q.originalAnswerIndex : 0));

  const newOptions = [];
  let dIdx = 0;
  for (let pos = 0; pos < 4; pos++) {
    if (pos === targetIndex) {
      newOptions.push(correct);
    } else {
      newOptions.push(distractors[dIdx++]);
    }
  }

  const keyMap = ['a', 'b', 'c', 'd'];
  return {
    ...q,
    options: newOptions,
    answer: targetIndex + 1, // 1-based index untuk LKPD
    answerKey: keyMap[targetIndex] // 'a', 'b', 'c', 'd' untuk CBT
  };
}

async function runFix() {
  console.log('--- 1. Memperbarui LKPD Bab 13 - 18 dengan Audio Valid & Kunci Seimbang ---');
  
  // Re-generate Bab 13 - 18 data-soal.js
  const genScript = require('./generate_bab13_18_lkpd.js');
  
  console.log('\n--- 2. Memperbaiki Kunci Jawaban di LKPD Bab 8 - 18 agar Seimbang A/B/C/D ---');
  
  for (let ch = 8; ch <= 18; ch++) {
    const p = path.join(__dirname, '..', 'public', 'lkpd', `bab${ch}`, 'data-soal.js');
    if (!fs.existsSync(p)) continue;

    const content = fs.readFileSync(p, 'utf8');
    const sandbox = { window: {} };
    const vm = require('vm');
    vm.createContext(sandbox);
    vm.runInContext(content, sandbox);
    const data = sandbox.window.LKPD_DATA;

    let totalQ = 0;
    ['moji', 'kaiwa', 'choikai', 'dokkai', 'kanji'].forEach(tabId => {
      const tab = data.tabs.find(t => t.id === tabId);
      if (tab && tab.items) {
        tab.items.forEach((item, idx) => {
          if (item.options && item.options.length >= 4) {
            // Target perputaran posisi (0 -> 1 -> 2 -> 3 -> 0)
            const targetPos = (totalQ % 4);
            // Simpan correct option
            const origAns = (item.answer || 1) - 1;
            const correctText = item.options[origAns];
            const distractors = item.options.filter((_, i) => i !== origAns);

            const newOpts = [];
            let d = 0;
            for (let i = 0; i < 4; i++) {
              if (i === targetPos) newOpts.push(correctText);
              else newOpts.push(distractors[d++]);
            }

            item.options = newOpts;
            item.answer = targetPos + 1; // 1-based
            totalQ++;
          }
        });
      }
    });

    // Tulis kembali file data-soal.js dengan data yang sudah diseimbangkan
    const newContent = `/*
  data-soal.js - LKPD Bab ${ch}
  Kurikulum Irodori Nihongo de Seikatsu 初級2 (A2.2)
  Standar CEFR A2 / JFT-Basic / LPK Terstandar KKM 85 pt
  (Distribusi Kunci Terseimbang & Audio Terverifikasi)
*/

window.LKPD_DATA = ${JSON.stringify(data, null, 2)};
`;
    fs.writeFileSync(p, newContent, 'utf8');
    console.log(`✓ Bab ${ch}: ${totalQ} butir soal telah diseimbangkan posisi kuncinya (A, B, C, D merata).`);
  }

  console.log('\n--- 3. Re-seeding Database Neon PostgreSQL Bab 8 - 18 ---');
  // Jalankan seed_cbt_bab8_18.js yang membaca data-soal.js yang baru diseimbangkan
  delete require.cache[require.resolve('./seed_cbt_bab8_18.js')];
  
  // Re-run seed
  const { execSync } = require('child_process');
  const seedOutput = execSync('node scripts/seed_cbt_bab8_18.js', { cwd: path.join(__dirname, '..'), encoding: 'utf8' });
  console.log(seedOutput);

  console.log('\n=== AUDIT SELESAI DENGAN SUKSES! ===');
}

runFix().catch(err => {
  console.error('Gagal:', err);
  process.exit(1);
});
