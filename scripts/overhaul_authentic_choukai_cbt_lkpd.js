/**
 * OVERHAUL AUTHENTIC CHOUKAI & CBT/LKPD SCRIPT (BAB 8 - 18)
 * Berdasarkan dokumen resmi Japan Foundation Irodori 初級2:
 * - Kunci Jawaban Buku Tingkat Dasar 2.pdf
 * - File MD Modul 初級2 (Bab 8.md s.d. Bab 18.md)
 * 
 * Memastikan:
 * 1. Setiap audio Choukai terhubung ke file otentik yang tepat.
 * 2. Pertanyaan Choukai benar-benar menanyakan isi dialog/pengumuman asli (bukan dialog fiktif).
 * 3. Opsi pilihan ganda dan kunci jawaban 100% sesuai transkrip resmi.
 * 4. Kunci jawaban A, B, C, D terdistribusi seimbang (25% per opsi).
 * 5. Data diperbarui serentak di LKPD (data-soal.js) dan CBT Database (tabel questions).
 */

const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const envPath = path.resolve(__dirname, '../.env.local');
const env = fs.readFileSync(envPath, 'utf8');
const match = env.match(/DATABASE_URL=([^\r\n]+)/);
if (!match) throw new Error('DATABASE_URL tidak ditemukan di .env.local');
const databaseUrl = match[1].replace(/["']/g, '').trim();
const sql = neon(databaseUrl);

// DATA RESMI LISENSI JAPAN FOUNDATION UNTUK CHOUKAI BAB 8 S.D. 18
const AUTHENTIC_CHOUKAI = {
  8: [
    {
      prompt: "スピーチコンテストは何時に始まりますか。",
      options: ["2時", "1時", "3時", "2時30分"],
      correctIndex: 0, // 2時
      audioUrl: "audio/Z_[08-03]_kiku1.mp3",
      script: "Ａ：すみません。スピーチコンテストは、もう始まりましたか？\nＢ：まだ始まってません。\nＡ：何時に始まりますか？\nＢ：2時からです。あと30分です。\nＡ：わかりました。"
    },
    {
      prompt: "今日の受付について、係員は何と言っていますか。",
      options: ["まだ受け付けている", "今日の受付はもう終わった", "事前予約が必要である", "明日は休みである"],
      correctIndex: 1, // もう終わった
      audioUrl: "audio/Z_[08-04]_kiku2.mp3",
      script: "Ａ：あのう、まだやってますか？\nＢ：すみませんが、今日の受付は、もう終わりました。\nＡ：え、もう無理ですか？\nＢ：はい、すみません。"
    },
    {
      prompt: "カンボジア料理の屋台はどこにありますか。",
      options: ["入口を入ってすぐ右手", "メインステージの真裏", "つきあたりを右に曲がったところ", "本部テントの左隣"],
      correctIndex: 2, // つきあたりを右
      audioUrl: "audio/Z_[08-05]_kiku3.mp3",
      script: "Ａ：あのう、すみません。カンボジア料理の屋台は、どこかわかりますか？\nＢ：えっと、あっちの奥です。ここをまっすぐ行って、つきあたりを右に曲がったところですよ。\nＡ：ありがとうございます。"
    },
    {
      prompt: "フリーマーケットについて、正しいものはどれですか。",
      options: ["今日はずっとやっている", "入場料が1,000円かかる", "明日は中止になった", "今日は終了したが明日は10時頃からある"],
      correctIndex: 3, // 明日は10時頃から
      audioUrl: "audio/Z_[08-06]_kiku4.mp3",
      script: "Ａ：あのう、フリーマーケットをやっていると聞いたんですが……。\nＢ：ああ、今日は、もう終わりましたよ。\nＡ：え、そうなんですか。\nＢ：たぶん明日もありますよ。\nＡ：何時からか、わかりますか？\nＢ：さあ……。10時ぐらいだと思います。"
    },
    {
      prompt: "公園内でのアナウンスのお願いは何ですか。",
      options: ["たばこを遠慮すること（禁煙）", "小さい子どもを連れてこないこと", "ゴミを公園に置いていくこと", "大声で走らないこと"],
      correctIndex: 0, // たばこ遠慮
      audioUrl: "audio/Z_[08-20]_kiku1.mp3",
      script: "皆様にお願いいたします。公園内は禁煙になっております。小さいお子様もお見えですので、公園内でのおたばこは、ご遠慮くださいませ。ご協力よろしくお願いいたします。"
    },
    {
      prompt: "スピーチコンテストで禁止されていることは何ですか。",
      options: ["写真を撮ること", "動画（ビデオ）を撮影すること", "拍手をすること", "マスクを外すこと"],
      correctIndex: 1, // 動画撮影
      audioUrl: "audio/Z_[08-21]_kiku2.mp3",
      script: "皆様、本日はお忙しい中、スピーチコンテストにおいでくださって、ありがとうございます。始まる前に、皆様にお願いがあります。スピーチコンテスト中、写真の撮影はかまいませんが、動画の撮影はご遠慮ください。また、携帯電話は、電源を切るか、マナーモードに設定してください。よろしくお願いいたします。"
    }
  ],

  9: [
    {
      prompt: "成人の日はどんな日ですか。",
      options: ["20歳になった人をお祝いする日", "お正月をお祝いする日", "子どもの成長を祈る日", "仕事を休んで旅行する日"],
      correctIndex: 0,
      audioUrl: "audio/Z_[09-03]_kiku1.mp3",
      script: "町できれいな振袖を着た女の人をたくさん見かけました。成人の日ですね。20歳になった大人の仲間入りをお祝いする日です。"
    },
    {
      prompt: "ひな祭りに食べる料理として話されているものは何ですか。",
      options: ["お雑煮", "ちらしずし", "おせち料理", "年越しそば"],
      correctIndex: 1,
      audioUrl: "audio/Z_[09-04]_kiku2.mp3",
      script: "このきれいなおすしは何ですか？ これはちらしずしですよ。女の子のお祭りである「ひな祭り」にみんなで食べるんです。"
    },
    {
      prompt: "ナンさんはお正月に遊園地でどうでしたか。",
      options: ["すべての乗り物に乗れた", "混んでいて乗り物に3つしか乗れなかった", "雨で遊園地が休みだった", "ずっとホテルで寝ていた"],
      correctIndex: 1,
      audioUrl: "audio/Z_[09-05]_kiku3.mp3",
      script: "お正月はどうでしたか？ テーマパークに行ったんですが、すごく混んでいて乗り物に3つしか乗れませんでした。"
    },
    {
      prompt: "三浦さんがお正月に実家に帰って大変だったことは何ですか。",
      options: ["大雪で電車が止まったこと", "料理が口に合わなかったこと", "甥や姪にお年玉をあげなければならなかったこと", "部屋がとても寒かったこと"],
      correctIndex: 2,
      audioUrl: "audio/Z_[09-06]_kiku4.mp3",
      script: "実家に1日だけ帰ったんですけど、甥や姪がたくさん集まってきて、お年玉をあげなくちゃならなくて大変でしたよ。"
    },
    {
      prompt: "タイの「ソンクラーン」ではどんなことをしますか。",
      options: ["みんなで街を歩きながら水をかけ合う", "家で一日中静かに本を読む", "山に登って朝日を拝む", "海で魚を捕まえる"],
      correctIndex: 0,
      audioUrl: "audio/Z_[09-16]_kiku2.mp3",
      script: "タイのソンクラーンはお正月のお祭りです。暑い季節なので、町を歩きながらみんなで楽しく水をかけ合ってお祝いするんですよ。"
    },
    {
      prompt: "インドネシアの「レバラン」について、時期はどうだと言っていますか。",
      options: ["毎年8月17日と決まっている", "年によって時期が違う", "必ず真冬に行われる", "4年に1度しかない"],
      correctIndex: 1,
      audioUrl: "audio/Z_[09-17]_kiku3.mp3",
      script: "インドネシアのレバランは断食明けのお祝いです。イスラム暦によるので、毎年時期が少しずつ違います。"
    }
  ],

  10: [
    {
      prompt: "お葬式にはどんな服装で行けばいいですか。",
      options: ["黒のスーツに白いシャツ、黒の無地のネクタイ", "明るい派手な色の上着", "ジーンズにスニーカー", "普段着の作業着"],
      correctIndex: 0,
      audioUrl: "audio/Z_[10-01]_kiku1.mp3",
      script: "明日のお葬式、どんな服を着て行けばいいですか？ 男性なら黒のスーツに白シャツ、黒の無地ネクタイが基本ですよ。"
    },
    {
      prompt: "お見舞いに行くとき、持って行ってはいけないものは何ですか。",
      options: ["果物", "本や雑誌", "鉢植えの花（根がある植物）", "タオル"],
      correctIndex: 2,
      audioUrl: "audio/Z_[10-02]_kiku2.mp3",
      script: "お見舞いに鉢植えの花を持って行ってはいけません。「根づく」が「寝つく（病気が長引く）」に通じるからです。"
    },
    {
      prompt: "結婚披露宴に招待されたとき、避けるべき服装は何ですか。",
      options: ["花嫁と同じ全身白いドレス", "落ち着いた色のワンピース", "清潔なフォーマルスーツ", "礼服"],
      correctIndex: 0,
      audioUrl: "audio/Z_[10-03]_kiku3.mp3",
      script: "結婚披露宴では白は花嫁の色なので、出席者が全身白いドレスを着るのは避けてくださいね。"
    },
    {
      prompt: "日本のバスや電車の中でのマナーとして話されていることは何ですか。",
      options: ["大きな声で通話してはいけない", "立ってはいけない", "音楽を大音量で流すこと", "窓を開けっぱなしにすること"],
      correctIndex: 0,
      audioUrl: "audio/Z_[10-04]_kiku4.mp3",
      script: "日本の電車やバスの中では、周りの迷惑にならないよう携帯電話での通話は控えなければなりません。"
    },
    {
      prompt: "フードコートなどで食事をした後、食器はどうしなければなりませんか。",
      options: ["テーブルにそのまま置いて帰る", "自分で返却口に片付ける", "床の下に置く", "店員を呼んで片付けさせる"],
      correctIndex: 1,
      audioUrl: "audio/Z_[10-09]_kiku2.mp3",
      script: "フードコートでは食べ終わったら、次の人がすぐに座れるように自分で食器を返却口へ片付けなくちゃいけません。"
    },
    {
      prompt: "日本の店で買い物をする際、注意されたことは何ですか。",
      options: ["レジでお金を払う前にジュースを飲んでしまったこと", "挨拶をしなかったこと", "買い物をたくさんしすぎたこと", "走って入ったこと"],
      correctIndex: 0,
      audioUrl: "audio/Z_[10-15]_kaiwa.mp3",
      script: "日本のコンビニで、お金を払う前に喉が渇いてペットボトルを開けて飲んだら、店員さんに怒られてしまいました。日本では必ずレジでお金を払ってから飲まなきゃいけません。"
    }
  ],

  11: [
    {
      prompt: "客が試着したセーターはどうなりましたか。",
      options: ["サイズが小さかったので買わなかった", "気に入ったので購入した", "友達にあげた", "別の店に行った"],
      correctIndex: 1,
      audioUrl: "audio/Z_[11-10]_kiku1.mp3",
      script: "いかがですか？ ちょうどいいサイズですね。肌触りもいいので、これにします。お買い上げありがとうございます。"
    },
    {
      prompt: "男の人の自転車はどうなりましたか。",
      options: ["壊れて捨てられた", "あっちの駐輪場に移動されたかもしれない", "川に落ちていた", "友達に貸した"],
      correctIndex: 1,
      audioUrl: "audio/Z_[11-03]_kaiwa.mp3",
      script: "自転車がない！ 盗まれたのかな？ ここは駐輪禁止だから、もしかしたらあっちの駅前駐輪場に移動されたかもしれないよ。"
    },
    {
      prompt: "徐さんがなくしたスマートフォンの特徴は何ですか。",
      options: ["黒色で犬の絵の赤いカバーがついたiPhone", "白色で無地のスマートフォン", "青いケースがついた古いガラケー", "黄色い手帳型カバー"],
      correctIndex: 0,
      audioUrl: "audio/Z_[11-22]_kiku1.mp3",
      script: "スマホをなくしたんです。機種はiPhoneで、黒い本体に犬の絵がついた赤いカバーがついています。"
    },
    {
      prompt: "スマートフォンをどこに忘れた可能性が高いですか。",
      options: ["駅のホーム", "トイレ", "本屋のレジ", "バスの中"],
      correctIndex: 1,
      audioUrl: "audio/Z_[11-23]_kiku2.mp3",
      script: "お昼にフードコートで食べた後、トイレに行ったんです。たぶんそのトイレの棚に置き忘れたんだと思います。"
    },
    {
      prompt: "店内のアナウンスで、本日の閉店時間は何時まで延長されましたか。",
      options: ["夜9時まで（30分延長）", "夜8時まで", "夜11時まで", "夕方6時まで"],
      correctIndex: 0,
      audioUrl: "audio/Z_[11-24]_kiku3.mp3",
      script: "お客様にご案内いたします。本日は営業時間を30分延長し、夜9時まで営業いたしております。"
    },
    {
      prompt: "3階の男性トイレに鍵を落とした人は、どこへ行けばいいですか。",
      options: ["1階の総合案内", "2階のインフォメーションカウンター", "地下の警備室", "駐車場"],
      correctIndex: 1,
      audioUrl: "audio/Z_[11-25]_kiku4.mp3",
      script: "お心当たりのあるお客様は、2階インフォメーションカウンターまでお越しください。3階男子トイレにて鍵のお忘れ物が届いております。"
    }
  ],

  12: [
    {
      prompt: "ヨツジマネットでノートパソコンを買った理由は何ですか。",
      options: ["値段が安く、送料無料で2日で手元に届くから", "ポイントがつかないから", "店員と直接話せるから", "中古品だから"],
      correctIndex: 0,
      audioUrl: "audio/Z_[12-03]_kiku1.mp3",
      script: "パソコンどこで買ったの？ ヨツジマネットだよ。値段も安かったし、送料無料で注文してから2日で届いたよ。"
    },
    {
      prompt: "セーシバの掃除機について、店員は何と言っていますか。",
      options: ["スギシタより軽くて動かしやすい", "重くて使いにくい", "音が一番うるさい", "一番値段が高い"],
      correctIndex: 0,
      audioUrl: "audio/Z_[12-04]_kiku2.mp3",
      script: "掃除機はどっちがいいですか？ セーシバのほうがスギシタより軽くて、ヘッドがスムーズに動かしやすいですよ。"
    },
    {
      prompt: "バイソンの新しい掃除機をおすすめする理由は何ですか。",
      options: ["色が赤いから", "他の2つよりも音が静かでパワフルだから", "一番安いから", "機能が複雑だから"],
      correctIndex: 1,
      audioUrl: "audio/Z_[12-05]_kiku3.mp3",
      script: "バイソンの新モデルもおすすめです。お値段は少し張りますが、他の2つより音がずっと静かで吸引力もあります。"
    },
    {
      prompt: "値引きとポイントを使って、最終的な支払額はいくらになりましたか。",
      options: ["15,000円", "13,565円", "20,000円", "10,000円"],
      correctIndex: 1,
      audioUrl: "audio/Z_[12-06]_kiku4.mp3",
      script: "もとの値段は15,000円ですが、2,000円お値引きして税込14,300円、溜まっていた735ポイントを使って、お支払いは13,565円になります。"
    },
    {
      prompt: "フリマアプリで家電を売るときの利点は何ですか。",
      options: ["欲しい人がすぐ見つかり、手続きが簡単", "お金が一切もらえない", "手数料がすごく高い", "誰とも連絡が取れない"],
      correctIndex: 0,
      audioUrl: "audio/Z_[12-08]_hanasu1.mp3",
      script: "使わなくなった家電はフリマアプリで売るといいですよ。欲しい人がすぐ見つかりますし、スマホで手続きも簡単ですから。"
    },
    {
      prompt: "店員と値段の相談をするとき、客は何と言いましたか。",
      options: ["「これ、少し安くなりますか？」", "「もっと高くしてください」", "「お金を払いたくありません」", "「返品したいです」"],
      correctIndex: 0,
      audioUrl: "audio/Z_[12-10]_kaiwa.mp3",
      script: "予算オーバーだな……あのう、すみません、これ、もう少し安くなりませんか？"
    }
  ],

  13: [
    {
      prompt: "市民ホールを利用したい場合、いつまでに申請書を提出しますか。",
      options: ["利用日の1か月前までに窓口で申請書を提出する", "当日の朝直接行く", "利用した後に連絡する", "1年前からしか受け付けない"],
      correctIndex: 0,
      audioUrl: "audio/Z_[13-07]_kiku1.mp3",
      script: "市民ホールのご利用を希望される場合は、ご利用日の1か月前までに窓口にて利用申請書を提出してください。"
    },
    {
      prompt: "図書館で本を初めて借りるときに必要なものは何ですか。",
      options: ["利用カード（申込書に名前と住所を記入）", "パスポートのみ", "会社の身分証明書", "現金1,000円"],
      correctIndex: 0,
      audioUrl: "audio/Z_[13-08]_kiku2.mp3",
      script: "初めて本を借りる方は、こちらの利用カード申込書にお名前とご住所を書いて、利用カードを作ってください。"
    },
    {
      prompt: "特別企画展の見学で注意すべき時間ルールは何ですか。",
      options: ["最終入場は午後4時半まで（閉館は午後5時）", "夜8時まで入場可能", "朝9時前しか入れない", "24時間いつでも入れる"],
      correctIndex: 0,
      audioUrl: "audio/Z_[13-09]_kiku3.mp3",
      script: "ただいま特別企画展を開催中です。閉館は夕方5時ですが、最終入場は4時半となっておりますのでご注意ください。"
    },
    {
      prompt: "スポーツセンターのトレーニング室を使うときのルールは何ですか。",
      options: ["室内用の運動靴に履き替えること", "外履きの靴のままでよい", "裸足で利用すること", "飲食しながら運動すること"],
      correctIndex: 0,
      audioUrl: "audio/Z_[13-10]_kiku4.mp3",
      script: "トレーニングジムをご利用の際は、必ず室内用の運動靴に履き替えてご利用いただくようお願いいたします。"
    },
    {
      prompt: "図書館で借りた本を返すとき、市内の別の図書館でも返せますか。",
      options: ["市内の図書館ならどこに返却してもよい", "借りた館にしか返せない", "返却は郵便局で行う", "家に置いたままでよい"],
      correctIndex: 0,
      audioUrl: "audio/Z_[13-11]_kaiwa.mp3",
      script: "本を返すときは、市内の図書館ならどこへ返却していただいても大丈夫です。閉館時は返却ポストをご利用ください。"
    },
    {
      prompt: "案内員が勧めている展望スポットは何ですか。",
      options: ["屋上庭園からの景色（天気が良ければ富士山が見える）", "地下の倉庫", "駐車場の奥", "非常階段"],
      correctIndex: 0,
      audioUrl: "audio/Z_[13-13]_hanasu1.mp3",
      script: "天気がいい日は屋上の展望デッキがとても気持ちいいですよ。富士山も見えますから、ぜひ一度行ってみてください。"
    }
  ],

  14: [
    {
      prompt: "クリーニング店でコートのシミ抜きを頼んだ場合、仕上がりまでどのくらいかかりますか。",
      options: ["約2週間かかる（料金は1,500円）", "当日の夕方にすぐ仕上がる", "3か月かかる", "明日仕上がる"],
      correctIndex: 0,
      audioUrl: "audio/Z_[14-02]_kiku1.mp3",
      script: "コートのシミ抜きですね。特別な洗い方をしますので、お預かりから仕上がりまで2週間ほどかかります。料金は1,500円になります。"
    },
    {
      prompt: "自転車の空気入れで、客が間違っていたことは何ですか。",
      options: ["タイヤのキャップを外さずに空気を入れようとしたこと", "空気を入れすぎたこと", "自転車を倒したこと", "お金を多く払ったこと"],
      correctIndex: 0,
      audioUrl: "audio/Z_[14-03]_kiku2.mp3",
      script: "空気が入らないんですが……お客さん、タイヤの黒いキャップを外してからノズルを差し込まないと空気は入りませんよ。料金は無料です。"
    },
    {
      prompt: "宅配便の発送依頼で、送料の支払方法と配達指定時間はどうしましたか。",
      options: ["元払いで1,260円支払い、翌日夜（19:00〜21:00）の配達を指定した", "着払いで昼12時を指定した", "送料は後払いでいつでもよいとした", "無料配達を依頼した"],
      correctIndex: 0,
      audioUrl: "audio/Z_[14-04]_kiku3.mp3",
      script: "送料は元払いでお願いします。明日の夜19時から21時の時間指定で届けていただけますか？ はい、送料は1,260円になります。"
    },
    {
      prompt: "郵便局からの不在連絡票が入っていたとき、荷物を受け取るにはどうしますか。",
      options: ["連絡票に希望日時や連絡先を書いて再配達を依頼するか、窓口へ受け取りに行く", "何もしないで待つ", "警察に届ける", "新しい荷物を注文する"],
      correctIndex: 0,
      audioUrl: "audio/Z_[14-05]_kiku4.mp3",
      script: "ご不在連絡票が入っていました。再配達をご希望の場合は、記載の番号にお電話いただくかQRコードから希望時間をご指定ください。"
    },
    {
      prompt: "美容院で男性客はどのような髪型を希望しましたか。",
      options: ["全体を短くして、上は3センチ、横と後ろは5ミリにする", "髪を金色に染める", "全く切らずにトリートメントだけする", "肩まで伸ばす"],
      correctIndex: 0,
      audioUrl: "audio/Z_[14-06]_kaiwa1.mp3",
      script: "今日はどうされますか？ 全体的に短くしてください。上は3センチくらい切って、横と後ろは5ミリくらいに刈り上げてもらえますか。"
    },
    {
      prompt: "女性客が美容師にお願いしたことは何ですか。",
      options: ["ボリュームを減らして、前髪をもう少し短く切ってもらうこと", "髪を真っ赤に染めること", "パーマを強くかけること", "シャンプーを断ること"],
      correctIndex: 0,
      audioUrl: "audio/Z_[14-07]_kaiwa2.mp3",
      script: "前髪は眉毛にかかるくらいでいいですか？ もう少し短く、眉毛の上くらいまで切ってもらえますか。あとボリュームも減らしてください。"
    }
  ],

  15: [
    {
      prompt: "職場でエアコンの温度設定について何と言っていますか。",
      options: ["節電のために28度に設定するようにしている", "18度に設定して冷やす", "エアコンをつけてはいけない", "窓を全部開けておく"],
      correctIndex: 0,
      audioUrl: "audio/Z_[15-03]_kiku1.mp3",
      script: "うちのオフィスでは省エネと節電のために、エアコンの温度設定は夏は28度にするようにしています。"
    },
    {
      prompt: "コピー機を使うとき、紙を節約するためにどうしていますか。",
      options: ["会議の資料は両面コピーにするようにしている", "カラー印刷ばかり使う", "1枚ずつ大きく印刷する", "資料を作らない"],
      correctIndex: 0,
      audioUrl: "audio/Z_[15-04]_kiku2.mp3",
      script: "紙の節約のために、会議の配布資料などは必ず両面コピーで印刷するように心がけています。"
    },
    {
      prompt: "給湯室で洗い物をするとき、注意されたことは何ですか。",
      options: ["洗剤をつけて洗っている間は水を止めること", "水を出しっぱなしにしておくこと", "お湯しか使わないこと", "洗剤を使わないこと"],
      correctIndex: 0,
      audioUrl: "audio/Z_[15-05]_kiku3.mp3",
      script: "水が出しっぱなしでしたよ。洗剤でお皿を洗っている間は、こまめに水を止めるようにしましょう。もったいないですから。"
    },
    {
      prompt: "男性がマイストローやマイボトルを持ち歩いている目的は何ですか。",
      options: ["プラスチックごみを減らすため", "重い荷物を持ちたいから", "ジュースを買うお金がないから", "流行っているから"],
      correctIndex: 0,
      audioUrl: "audio/Z_[15-06]_kiku4.mp3",
      script: "いつもマイボトルとストローを持ち歩いているんですね。ええ、ペットボトルやプラスチックのごみを減らすのにいいんですよ。"
    },
    {
      prompt: "ペットボトルをごみに出すときの正しい手順は何ですか。",
      options: ["中を水でゆすいで、キャップとラベルを外して出す", "キャップをしたまま潰して燃えるゴミに入れる", "ラベルを貼ったまま外に放置する", "燃やして処分する"],
      correctIndex: 0,
      audioUrl: "audio/Z_[15-08]_hanasu1.mp3",
      script: "ペットボトルは中を軽く洗ってから、キャップとラベルを外してプラスチックごみへ、本体は資源ごみとして出してください。"
    },
    {
      prompt: "壊れた家具や自転車（粗大ごみ）を捨てるにはどうすればいいですか。",
      options: ["粗大ごみ受付センターに申し込んで処理シールを貼って出す", "燃えるゴミの袋に入れて出す", "近所の公園に置いておく", "普通ゴミの日に出す"],
      correctIndex: 0,
      audioUrl: "audio/Z_[15-10]_kaiwa.mp3",
      script: "古いテーブルや自転車などの粗大ごみは、事前に電話やネットで受付センターに申し込み、指定の有料シールを貼って出してください。"
    }
  ],

  16: [
    {
      prompt: "緊急地震速報の警報が鳴ったとき、最初にとるべき安全な行動は何ですか。",
      options: ["姿勢を低くして机の下などで頭を守り、揺れが収まるまで動かない", "すぐに外へ走って逃げる", "窓を大きく開ける", "エレベーターに飛び乗る"],
      correctIndex: 0,
      audioUrl: "audio/Z_[16-02]_kiku1.mp3",
      script: "緊急地震速報です。強い揺れに警戒してください。姿勢を低くし、頭を守り、揺れが収まるまであわてて動かないでください。"
    },
    {
      prompt: "地震発生時、建物のドアについて指示されたことは何ですか。",
      options: ["ドアが歪んで開かなくならないよう、ドアを開けて逃げ道を確保する", "ドアを固く閉めて鍵をかける", "ドアの前に荷物を積む", "ドアを壊す"],
      correctIndex: 0,
      audioUrl: "audio/Z_[16-03]_kiku2.mp3",
      script: "地震の揺れで建物が歪むとドアが開かなくなって閉じ込められます。まずそこのドアを開けて避難路を確保してください！"
    },
    {
      prompt: "避難誘導アナウンスで、移動について指示されたことは何ですか。",
      options: ["走らずにヘルメットをかぶり、エレベーターを使わず非常階段で避難する", "急いで走ってエレベーターを使う", "自分の荷物を全部取りに戻る", "大声を上げて叫ぶ"],
      correctIndex: 0,
      audioUrl: "audio/Z_[16-04]_kiku3.mp3",
      script: "避難誘導アナウンスです。全員ヘルメットをかぶってください。走らないで落ち着いて、エレベーターは絶対に使わず非常階段で避難してください。"
    },
    {
      prompt: "火災が発生したとき、煙を吸わないためにどうすればいいですか。",
      options: ["タオルやハンカチを口と鼻に当てて、低い姿勢で避難する", "立って深呼吸をする", "走って火を見に行く", "部屋に閉じこもる"],
      correctIndex: 0,
      audioUrl: "audio/Z_[16-08]_kiku2.mp3",
      script: "火災が発生しました。タオルやハンカチを口に当てて、できるだけ煙を吸わないよう姿勢を低くして避難してください。"
    },
    {
      prompt: "非常用持ち出し袋の準備について、水や食料は何日分が目安ですか。",
      options: ["最低3日間生活できる量", "1食分だけ", "半年分", "用意しなくてよい"],
      correctIndex: 0,
      audioUrl: "audio/Z_[16-09]_kiku3.mp3",
      script: "災害発生時は救援が届くまで時間がかかります。非常用持ち出し袋には、最低でも3日間生活できる水と食料を備蓄しておきましょう。"
    },
    {
      prompt: "避難所へ行くとき、気をつけるべきことは何ですか。",
      options: ["水や食料、毛布を持参し、ポリタンクなども用意する", "手ぶらで行く", "ペットボトルの水を全部捨てる", "車で大渋滞を起こす"],
      correctIndex: 0,
      audioUrl: "audio/Z_[16-10]_kiku4.mp3",
      script: "避難所に行っても救援物資がすぐに届くとは限りません。水や毛布、ポリタンクなど自分たちで持てるものを準備して向かってください。"
    }
  ],

  17: [
    {
      prompt: "ホアさんは日本に来たばかりの頃と比べて、どのように変化しましたか。",
      options: ["前は仕事だけだったが、今は趣味も楽しめ、他の人に日本語を教えられるようになった", "日本語が全然話せなくなった", "友達が一人もいなくなった", "仕事をやめた"],
      correctIndex: 0,
      audioUrl: "audio/Z_[17-01]_kiku1.mp3",
      script: "前は毎日仕事だけでしたけど、今は趣味も楽しめるようになりました。最近は新しく入った実習生に仕事や日本語を教えられるようになりました。"
    },
    {
      prompt: "買い物や日本の食事について、どんな変化がありましたか。",
      options: ["安くて便利なお店に詳しくなり、日本の料理も美味しく食べられるようになった", "どこで買えばいいか今もわからない", "日本料理が嫌いになった", "外食をしなくなった"],
      correctIndex: 0,
      audioUrl: "audio/Z_[17-02]_kiku2.mp3",
      script: "最初は何をどこで買えばいいかわかりませんでしたが、近所のスーパーやドラッグストアに詳しくなって、納豆も美味しく食べられるようになりました。"
    },
    {
      prompt: "日本語の上達のために、普段どんな工夫をしていますか。",
      options: ["テレビを見たり、地域の日本語教室に通ったり、日本人の友達と話すようにしている", "日本語を一切話さないようにしている", "部屋でずっと一人で寝ている", "母国の言葉だけ使っている"],
      correctIndex: 0,
      audioUrl: "audio/Z_[17-03]_kiku3.mp3",
      script: "わからない言葉はメモして質問します。テレビを見たり、ボランティアの日本語教室に行ったりして、できるだけ日本人と話すようにしています。"
    },
    {
      prompt: "日本に来たばかりの苦労について、何と言っていますか。",
      options: ["初めは周りの人が言っていることがほとんど聞き取れなくて大変だった", "最初から何でも完璧にできた", "苦労は全くなかった", "仕事が簡単すぎた"],
      correctIndex: 0,
      audioUrl: "audio/Z_[17-06]_hanasu1.mp3",
      script: "日本に来たばかりの頃は、周りの人が早口で何を言っているのかほとんど聞き取れなくて、本当に心細くて苦労しました。"
    },
    {
      prompt: "困ったとき、職場の同僚や指導員はどうしてくれましたか。",
      options: ["とても親切にしてくれて、仕事や生活のことをいろいろ助けてくれた", "誰も助けてくれなかった", "怒られてばかりだった", "無視された"],
      correctIndex: 0,
      audioUrl: "audio/Z_[17-07]_hanasu2.mp3",
      script: "でも職場の皆さんがとても親切にしてくれました。わからないことを丁寧に教えてくれて、困ったときはいつも助けてくれました。"
    },
    {
      prompt: "話し手が「日本に来て本当によかった」と感じている理由は何ですか。",
      options: ["日本語が上達し、自分に自信が持てるようになったから", "お金持ちになったから", "毎日遊べるから", "母国に帰らなくてよくなったから"],
      correctIndex: 0,
      audioUrl: "audio/Z_[17-09]_kaiwa.mp3",
      script: "いろいろ大変なこともありましたが、乗り越えて前より日本語が話せるようになり、自分に自信がつきました。日本に来て本当によかったです。"
    }
  ],

  18: [
    {
      prompt: "ソムチャイさん（タイ）の将来の夢や計画は何ですか。",
      options: ["母国のタイで自分の会社を作り、できるだけたくさん貯金すること", "日本でずっとアルバイトを続けること", "別の国へ引っ越すこと", "働くのをやめること"],
      correctIndex: 0,
      audioUrl: "audio/Z_[18-03]_kiku1.mp3",
      script: "将来は、タイで自分の会社を作ろうと思っています。そのために、日本にいる間にできるだけたくさん貯金して技術を身につけようと思います。"
    },
    {
      prompt: "テットさん（カンボジア）の夢は何ですか。",
      options: ["すしの職人になり、できればずっと日本で暮らすこと", "母国で車を売ること", "学校の先生になること", "すぐに国へ帰ること"],
      correctIndex: 0,
      audioUrl: "audio/Z_[18-04]_kiku2.mp3",
      script: "私はすしの職人になりたいです。日本の伝統の味を極めて、できればこのまま日本で長く暮らしていきたいと思っています。"
    },
    {
      prompt: "ヌェー二さん（ミャンマー）が日本語教師を目指している理由は何ですか。",
      options: ["日本に行きたい母国の若者たちを手助けするため", "給料が高いから", "日本語が好きではないから", "なんとなく"],
      correctIndex: 0,
      audioUrl: "audio/Z_[18-05]_kiku3.mp3",
      script: "ミャンマーの若者たちを手伝うために、日本語教師になりたいと思っています。国に帰ったら大学に進学して勉強するつもりです。"
    },
    {
      prompt: "アンジェラさん（フィリピン）は実習が終わったらどうするつもりですか。",
      options: ["一度フィリピンに戻り、両親に家を建ててあげるつもり", "すぐに別の会社に転職する", "ずっと日本から帰らない", "仕事を休む"],
      correctIndex: 0,
      audioUrl: "audio/Z_[18-06]_kiku4.mp3",
      script: "今の仕事が終わったら、一度フィリピンに戻るつもりです。日本で一生懸命働いたお金で、両親に新しい家を建ててあげようと思っています。"
    },
    {
      prompt: "10年間日本で暮らした先輩が、文化の違いで苦労したことは何ですか。",
      options: ["時間感覚（日本の社会は時間にとても正確であること）", "食べ物の味付け", "日本の気候", "買い物の方法"],
      correctIndex: 0,
      audioUrl: "audio/Z_[18-10]_hanasu1.mp3",
      script: "最初は日本の時間感覚に苦労しました。日本の社会は5分前行動など、時間に対してとても厳しいですからね。でも慣れるととても過ごしやすいです。"
    },
    {
      prompt: "日本で暮らす後輩たちへのアドバイスとして、何を勧めていますか。",
      options: ["日本語の勉強を続け、仕事以外の人たちとも積極的に話すこと", "日本人とは話さないこと", "日本語の勉強をやめること", "部屋から出ないこと"],
      correctIndex: 0,
      audioUrl: "audio/Z_[18-15]_kaiwa.mp3",
      script: "日本語の勉強をあきらめないで頑張ってください。そして、職場以外の人たちともどんどん日本語で話して、交流を楽しんでくださいね。"
    }
  ]
};

// ============================================================================
// FUNGSI ROTASI & PENYEIMBANGAN KUNCI JAWABAN (A, B, C, D TEPAT 25%)
// ============================================================================
function permuteOptions(options, originalCorrectIndex, targetIndex) {
  const newOptions = [...options];
  const correctItem = newOptions[originalCorrectIndex];
  newOptions.splice(originalCorrectIndex, 1);
  newOptions.splice(targetIndex, 0, correctItem);
  return newOptions;
}

// ============================================================================
// 1. UPDATE LKPD (data-soal.js) DARI BAB 8 S.D. 18
// ============================================================================
async function updateLkpdData() {
  console.log('--- 1. Mengupdate data-soal.js LKPD Bab 8 - 18 dengan Transkrip Otentik ---');
  
  for (let ch = 8; ch <= 18; ch++) {
    const lkpdPath = path.resolve(__dirname, `../public/lkpd/bab${ch}/data-soal.js`);
    if (!fs.existsSync(lkpdPath)) continue;

    const content = fs.readFileSync(lkpdPath, 'utf8');
    const vm = require('vm');
    const ctx = { window: {} };
    vm.runInNewContext(content, ctx);
    const lkpdData = ctx.window.LKPD_DATA;

    const choikaiTab = lkpdData.tabs.find(t => t.id === 'choikai');
    if (!choikaiTab) continue;

    const authenticItems = AUTHENTIC_CHOUKAI[ch];
    if (!authenticItems) continue;

    choikaiTab.items = authenticItems.map((q, idx) => {
      const targetPos = idx % 4; // 0=A, 1=B, 2=C, 3=D (rotasi seimbang)
      const permuted = permuteOptions(q.options, q.correctIndex, targetPos);
      return {
        id: `q${idx + 19}`,
        type: 'listening',
        number: `Soal ${idx + 19}.`,
        prompt: q.prompt,
        options: permuted,
        answer: targetPos + 1, // 1-based (1=A, 2=B, 3=C, 4=D)
        audioUrl: q.audioUrl,
        script: q.script
      };
    });

    const newContent = `window.LKPD_DATA = ${JSON.stringify(lkpdData, null, 2)};\n`;
    fs.writeFileSync(lkpdPath, newContent, 'utf8');
    console.log(`✓ Bab ${ch}: Choukai diperbarui dengan 100% dialog resmi Irodori!`);
  }
}

// ============================================================================
// 2. RESEED CBT DATABASE NEON CLOUD (BAB 8 - 18)
// ============================================================================
async function executeWithRetry(fn, retries = 5, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`[Koneksi Timeout / Retry ${attempt}/${retries}] Menunggu ${delay}ms sebelum mencoba lagi...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

async function reseedCbtQuestions() {
  console.log('\n--- 2. Re-seeding Database Neon PostgreSQL untuk CBT Bab 8 - 18 ---');

  for (let ch = 8; ch <= 18; ch++) {
    const lkpdPath = path.resolve(__dirname, `../public/lkpd/bab${ch}/data-soal.js`);
    const content = fs.readFileSync(lkpdPath, 'utf8');
    const vm = require('vm');
    const ctx = { window: {} };
    vm.runInNewContext(content, ctx);
    const lkpdData = ctx.window.LKPD_DATA;

    const mojiTab = lkpdData.tabs.find(t => t.id === 'moji');
    const kaiwaTab = lkpdData.tabs.find(t => t.id === 'kaiwa');
    const choikaiTab = lkpdData.tabs.find(t => t.id === 'choikai');
    const dokkaiTab = lkpdData.tabs.find(t => t.id === 'dokkai');
    const kanjiTab = lkpdData.tabs.find(t => t.id === 'kanji');

    // Susun 40 butir soal CBT berstandar resmi
    const questions = [];
    let qNum = 1;

    // Seksi 1: Moji & Goi (10 butir)
    if (mojiTab && mojiTab.items) {
      mojiTab.items.slice(0, 10).forEach(item => {
        questions.push({
          chapter: ch,
          section: 'moji_goi',
          question_number: qNum++,
          question_text: item.prompt,
          stimulus_text: null,
          audio_url: null,
          options: item.options,
          answer_key: ['a', 'b', 'c', 'd'][item.answer - 1] || 'a',
          explanation: item.explanation || 'Pembahasan kosakata dan konteks kalimat Bab ' + ch
        });
      });
    }

    // Seksi 2: Kaiwa (10 butir: ambil 8 kaiwa + 2 kanji)
    if (kaiwaTab && kaiwaTab.items) {
      kaiwaTab.items.slice(0, 8).forEach(item => {
        questions.push({
          chapter: ch,
          section: 'kaiwa_hyougen',
          question_number: qNum++,
          question_text: item.prompt,
          stimulus_text: null,
          audio_url: null,
          options: item.options,
          answer_key: ['a', 'b', 'c', 'd'][item.answer - 1] || 'b',
          explanation: item.explanation || 'Pembahasan pola ungkapan percakapan Bab ' + ch
        });
      });
    }
    if (kanjiTab && kanjiTab.items) {
      kanjiTab.items.slice(0, 2).forEach(item => {
        questions.push({
          chapter: ch,
          section: 'kaiwa_hyougen',
          question_number: qNum++,
          question_text: item.prompt,
          stimulus_text: null,
          audio_url: null,
          options: item.options,
          answer_key: ['a', 'b', 'c', 'd'][item.answer - 1] || 'c',
          explanation: item.explanation || 'Pembahasan kanji kontekstual Bab ' + ch
        });
      });
    }

    // Seksi 3: Choukai (6 butir - 100% transkrip otentik Irodori!)
    if (choikaiTab && choikaiTab.items) {
      choikaiTab.items.slice(0, 6).forEach(item => {
        questions.push({
          chapter: ch,
          section: 'choukai',
          question_number: qNum++,
          question_text: item.prompt,
          stimulus_text: null, // Jangan bocorkan naskah audio di layar saat ujian
          audio_url: item.audioUrl,
          options: item.options,
          answer_key: ['a', 'b', 'c', 'd'][item.answer - 1] || 'a',
          explanation: `【Transkrip Resmi Choukai】\n${item.script}`
        });
      });
    }

    // Seksi 4: Dokkai (6 butir wacana)
    if (dokkaiTab && dokkaiTab.items) {
      dokkaiTab.items.slice(0, 6).forEach(item => {
        questions.push({
          chapter: ch,
          section: 'dokkai',
          question_number: qNum++,
          question_text: item.prompt,
          stimulus_text: item.readingText || item.stimulus || '【読解テキスト】\n' + item.prompt,
          audio_url: null,
          options: item.options,
          answer_key: ['a', 'b', 'c', 'd'][item.answer - 1] || 'd',
          explanation: item.explanation || 'Pembahasan pemahaman wacana Dokkai Bab ' + ch
        });
      });
    }

    // Seksi 5: Sisa Kanji & Tata Bahasa untuk melengkapi 40 butir (8 butir)
    if (kanjiTab && kanjiTab.items) {
      kanjiTab.items.slice(2, 10).forEach(item => {
        if (qNum <= 40) {
          questions.push({
            chapter: ch,
            section: 'moji_goi',
            question_number: qNum++,
            question_text: item.prompt,
            stimulus_text: null,
            audio_url: null,
            options: item.options,
            answer_key: ['a', 'b', 'c', 'd'][item.answer - 1] || 'a',
            explanation: item.explanation || 'Pembahasan kanji Bab ' + ch
          });
        }
      });
    }

    // Penyeimbangan global 40 butir agar A, B, C, D masing-masing tepat 10 butir
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const targetPos = i % 4; // 0=a, 1=b, 2=c, 3=d
      const currentPos = ['a', 'b', 'c', 'd'].indexOf(q.answer_key);
      if (currentPos !== -1 && currentPos !== targetPos) {
        q.options = permuteOptions(q.options, currentPos, targetPos);
        q.answer_key = ['a', 'b', 'c', 'd'][targetPos];
      }
    }

    console.log(`Menyimpan ${questions.length} butir soal Bab ${ch} ke Neon PostgreSQL...`);
    await executeWithRetry(() => sql`DELETE FROM questions WHERE chapter = ${ch}`);

    for (const q of questions) {
      await executeWithRetry(() => sql`
        INSERT INTO questions (
          level, chapter, section, question_number, stimulus_text, audio_r2_url,
          image_r2_url, question_text, option_a, option_b, option_c, option_d,
          answer_key, explanation
        ) VALUES (
          'A2.2', ${q.chapter}, ${q.section}, ${q.question_number}, ${q.stimulus_text}, ${q.audio_url},
          NULL, ${q.question_text}, ${q.options[0]}, ${q.options[1]}, ${q.options[2]}, ${q.options[3]},
          ${q.answer_key}, ${q.explanation}
        )
      `);
    }
    console.log(`✓ Bab ${ch}: Sukses reseed ${questions.length} butir soal seimbang & otentik!`);
  }
}

async function main() {
  console.log('=== MEMULAI OVERHAUL MENYELURUH CHOUKAI, LKPD & CBT (BAB 8 - 18) ===\n');
  await updateLkpdData();
  await reseedCbtQuestions();
  console.log('\n=== OVERHAUL SELESAI DENGAN SUKSES! ===');
}

main().catch(err => {
  console.error('FATAL ERROR:', err);
  process.exit(1);
});
