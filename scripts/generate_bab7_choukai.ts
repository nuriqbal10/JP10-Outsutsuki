import { Document, Packer, Paragraph, TextRun } from 'docx';
import fs from 'fs';
import path from 'path';

// Bab 7 Choukai Questions: 20 items
// Distribution: 5 a, 5 b, 5 c, 5 d = 20
const choukaiData = [
  // Audio 1: Z_[07-01]_kiku1.mp3 (Gas tenken) - 2 soal
  {
    num: 1,
    audio: 'audio/shokyu2/Z_[07-01]_kiku1.mp3',
    script: 'Ａ：すみません。この紙、ポストにあったんですけど、何ですか？\nＢ：ああ、ガス点検のお知らせですね。\nＡ：ガスてんけん？ 何ですか？\nＢ：ガス会社の人が家に来て、ガスをチェックするんですよ。\nＡ：いつですか？\nＢ：ああ、来週の月曜日の14時から15時の間ですね。\nＡ：どうすればいいですか？\nＢ：その間は、家にいてください。15分ぐらいで終わりますから。\nＡ：わかりました。ありがとうございます。',
    q: '【質問】 この人は、来週の月曜日にどうしなければなりませんか。',
    options: ['*a) 14時から15時の間、家にいる', 'b) ガス会社に電話する', 'c) 自分でガス器具を点検する', 'd) 郵便ポストを確認する'],
    key: 'a'
  },
  {
    num: 2,
    audio: 'audio/shokyu2/Z_[07-01]_kiku1.mp3',
    script: '（同上スクリプト）',
    q: '【質問】 ガスの点検にはどのくらい時間がかかりますか。',
    options: ['a) 1時間', '*b) 15分ぐらい', 'c) 30分ぐらい', 'd) 半日'],
    key: 'b'
  },
  // Audio 2: Z_[07-02]_kiku2.mp3 (Kifu) - 2 soal
  {
    num: 3,
    audio: 'audio/shokyu2/Z_[07-02]_kiku2.mp3',
    script: 'Ａ：あのう、すみません。この封筒と手紙、何ですか？\nＢ：ああ、お祭りの寄付のお願いですね。\nＡ：きふ？ 何ですか、それ？\nＢ：もうすぐ、夏祭りがあるんですよ。そのお祭りのために、1人500円、お金を払うんです。\nＡ：お金……、あのう、どうやって払いますか？\nＢ：えっと、この封筒に500円入れて、ここに名前と住所を書いて、お祭りのとき持って行くんです。\nＡ：へー、そうなんですか。みんな、払いますか？\nＢ：寄付ですから、払いたい人だけでいいですよ。\nＡ：わかりました。',
    q: '【質問】 お金はどうやって払いますか。',
    options: ['a) 銀行から振り込む', 'b) 自治会長の家に持って行く', '*c) 封筒に名前と住所を書いてお祭りの時に持って行く', 'd) ポストに入れて送る'],
    key: 'c'
  },
  {
    num: 4,
    audio: 'audio/shokyu2/Z_[07-02]_kiku2.mp3',
    script: '（同上スクリプト）',
    q: '【質問】 この寄付金は、だれが払いますか。',
    options: ['a) 町内のすべての人', 'b) 会社の人だけ', 'c) お祭りの役員だけ', '*d) 払いたい人だけ'],
    key: 'd'
  },
  // Audio 3: Z_[07-03]_kiku3.mp3 (Hanabi taikai) - 2 soal
  {
    num: 5,
    audio: 'audio/shokyu2/Z_[07-03]_kiku3.mp3',
    script: 'Ａ：あのう、土曜日の夜、町で花火大会があると聞きました。場所はどこですか？\nＢ：中央海岸。ここから歩いて15分ぐらいだけど、わかる？\nＡ：あ、はい。\nＢ：7時に始まって、1時間ぐらいだと思うよ。\nＡ：わかりました。雨のときは、どうなりますか？\nＢ：雨が降ったら、日曜日にやるよ。日曜日も雨だったら中止だけど。\nＡ：そうですか。',
    q: '【質問】 土曜日に雨が降ったら、花火大会はどうなりますか。',
    options: ['*a) 日曜日にやる', 'b) 来週に延期する', 'c) すぐに中止になる', 'd) 体育館でやる'],
    key: 'a'
  },
  {
    num: 6,
    audio: 'audio/shokyu2/Z_[07-03]_kiku3.mp3',
    script: '（同上スクリプト）',
    q: '【質問】 花火大会はどこで何時から始まりますか。',
    options: ['a) 駅前の広場で午後6時', '*b) 中央海岸で午後7時', 'c) 市民センターで午後7時半', 'd) 公民館で午後8時'],
    key: 'b'
  },
  // Audio 4: Z_[07-04]_kiku4.mp3 (Flea market) - 2 soal
  {
    num: 7,
    audio: 'audio/shokyu2/Z_[07-04]_kiku4.mp3',
    script: 'Ａ：あのう、市役所でフリーマーケットがあるそうですね。\nＢ：ええ。毎月、第2土曜日に、市役所の広場でやってますよ。\nＡ：第2土曜日？\nＢ：月の2回目の土曜日。今月は14日でしたから、次は来月ですね。\nＡ：ああ、来月の第2土曜日ですね。あのう、どんなものを売ってますか？\nＢ：服が多いけど、食器とか、おもちゃとか、いろいろあると思いますよ。\nＡ：天気が悪かったら、どうなりますか？\nＢ：雨が降ったら、中のホールでやります。\nＡ：ありがとうございます。行ってみます。',
    q: '【質問】 天気が悪くて雨が降ったら、フリーマーケットはどうなりますか。',
    options: ['a) 翌日に延期される', 'b) 中止になる', '*c) 市役所の中のホールでやる', 'd) 駐車場でやる'],
    key: 'c'
  },
  {
    num: 8,
    audio: 'audio/shokyu2/Z_[07-04]_kiku4.mp3',
    script: '（同上スクリプト）',
    q: '【質問】 フリーマーケットでは主にどのようなものが売られていますか。',
    options: ['a) 新車や家電製品', 'b) 地元で獲れた魚', 'c) 高価な骨董品や美術品', '*d) 服や食器、おもちゃなど'],
    key: 'd'
  },
  // Audio 5: Z_[07-06]_kiku1.mp3 (Radio: Piano Concert) - 2 soal
  {
    num: 9,
    audio: 'audio/shokyu2/Z_[07-06]_kiku1.mp3',
    script: 'さくら市民センターからお知らせします。\n7月14日、日曜日、さくら市民センターの「ひかりホール」において、「ピアノの夕べ 山田えみ ふるさとコンサート」が開催されます。\n入場券は、市役所、および、さくら市民センターで販売中です。\n皆様のご来場をお待ちしています。',
    q: '【質問】 「ピアノの夕べ コンサート」はどこで開催されますか。',
    options: ['*a) さくら市民センターの「ひかりホール」', 'b) 中央海岸のステージ', 'c) 道の駅うらら', 'd) さくら小学校体育館'],
    key: 'a'
  },
  {
    num: 10,
    audio: 'audio/shokyu2/Z_[07-06]_kiku1.mp3',
    script: '（同上スクリプト）',
    q: '【質問】 コンサートの入場券はどこで買うことができますか。',
    options: ['a) 駅前のコンビニ', '*b) 市役所および市民センター', 'c) 当日会場の入口のみ', 'd) 郵便局'],
    key: 'b'
  },
  // Audio 6: Z_[07-07]_kiku2.mp3 (Radio: Shima-odori renshuu) - 2 soal
  {
    num: 11,
    audio: 'audio/shokyu2/Z_[07-07]_kiku2.mp3',
    script: '公民館からのお知らせです。\n明日、4月16日、水曜日、19時から、公民館において、「島踊り」の練習が行われます。\nどなたでも見学できます。お気軽にお越しください。',
    q: '【質問】 「島踊り」の練習はいつありますか。',
    options: ['a) 明日の午前10時から', 'b) 今週の日曜日の午後1時から', '*c) 明日、水曜日の19時から', 'd) 来週の土曜日の夜7時から'],
    key: 'c'
  },
  {
    num: 12,
    audio: 'audio/shokyu2/Z_[07-07]_kiku2.mp3',
    script: '（同上スクリプト）',
    q: '【質問】 この練習にはだれが見学に来ることができますか。',
    options: ['a) 申し込みをした住民だけ', 'b) 島の出身者だけ', 'c) 大人の女性だけ', '*d) どなたでも見学できる'],
    key: 'd'
  },
  // Audio 7: Z_[07-08]_kiku3.mp3 (Radio: Michi-no-eki Furusato Matsuri) - 2 soal
  {
    num: 13,
    audio: 'audio/shokyu2/Z_[07-08]_kiku3.mp3',
    script: '本日、午後1時から「道の駅うらら」において、「ふるさとまつり」が開かれます。\n午後7時30分からは、花火大会が予定されています。\n皆様お誘い合わせの上、お出かけください。',
    q: '【質問】 「ふるさとまつり」は本日何時から開かれますか。',
    options: ['*a) 午後1時から', 'b) 午前9時から', 'c) 正午12時から', 'd) 午後7時30分から'],
    key: 'a'
  },
  {
    num: 14,
    audio: 'audio/shokyu2/Z_[07-08]_kiku3.mp3',
    script: '（同上スクリプト）',
    q: '【質問】 午後7時30分からは何が予定されていますか。',
    options: ['a) カラオケ大会', '*b) 花火大会', 'c) 盆踊り大会', 'd) ブラスバンド演奏'],
    key: 'b'
  },
  // Audio 8: Z_[07-09]_kiku4.mp3 (Radio: Natsu Yasai Hanbaikai) - 2 soal
  {
    num: 15,
    audio: 'audio/shokyu2/Z_[07-09]_kiku4.mp3',
    script: '町役場からお知らせします。\n明日、7月28日、日曜日、午前8時30分から、「あおぞら広場」において、夏野菜の販売会が行われます。\n地元の農家が生産した新鮮な野菜を販売します。皆様のお越しをお待ちしています。',
    q: '【質問】 夏野菜の販売会はどこで行われますか。',
    options: ['a) 道の駅のレストラン', 'b) さくら小学校の校庭', '*c) 「あおぞら広場」', 'd) 公民館のホール'],
    key: 'c'
  },
  {
    num: 16,
    audio: 'audio/shokyu2/Z_[07-09]_kiku4.mp3',
    script: '（同上スクリプト）',
    q: '【質問】 どんな野菜が販売されますか。',
    options: ['a) 外国から輸入した珍しい野菜', 'b) スーパーの売れ残りの野菜', 'c) 冷凍の加工野菜', '*d) 地元の農家が作った新鮮な野菜'],
    key: 'd'
  },
  // Audio 9: Z_[07-11]_kaiwa.mp3 (Bon-odori) - 4 soal
  {
    num: 17,
    audio: 'audio/shokyu2/Z_[07-11]_kaiwa.mp3',
    script: '杉村：ジーナさん、ラウラさん、今度の土曜日、盆踊りがありますけど、知ってますか？\nジーナ：ぼんおどり？ 何ですか？\n杉村：日本のお祭りです。輪になって、音楽に合わせて、みんなで踊るんですよ。\nラウラ：ああ、見たことあります。行ってみたいです。\n杉村：踊りたい人は、だれでも参加できますよ。いっしょにどうですか？\nジーナ：でも、私、一度もやったことないです。\n杉村：簡単だから、だれでも踊れますよ。それに、わからなかったら教えるから、だいじょうぶ。\nジーナ：じゃあ、行ってみます。何を着て行ったらいいですか？\n杉村：何でもいいですよ。あ、でも、娘たちの浴衣があるから、貸しましょうか？\nラウラ：うれしい！\nジーナ：でも、1人で着られますか？\n杉村：私が手伝うから、だいじょうぶ。盆踊りの前に、うちで浴衣を着てから行きましょう。\nジーナ：何時に行ったらいいですか？\n杉村：じゃあ、うちに5時に来て。\nラウラ：わかりました。ありがとうございます。\n杉村：2人は、お酒、飲めますか？\nジーナ：はい、だいじょうぶです。\nラウラ：私は少しだけ。\n杉村：じゃあ、盆踊りが終わったら、いっしょに居酒屋に行きましょう。',
    q: '【質問】 ジーナさんとラウラさんは、浴衣をどうしますか。',
    options: ['*a) 杉村さんの娘の浴衣を借りる', 'b) デパートで新しく買う', 'c) 着ないで普通の服で行く', 'd) インターネットで注文する'],
    key: 'a'
  },
  {
    num: 18,
    audio: 'audio/shokyu2/Z_[07-11]_kaiwa.mp3',
    script: '（同上スクリプト）',
    q: '【質問】 二人は何時にどこへ行きますか。',
    options: ['a) 4時に駅前', '*b) 5時に杉村さんの家', 'c) 6時に会場の広場', 'd) 7時に居酒屋'],
    key: 'b'
  },
  {
    num: 19,
    audio: 'audio/shokyu2/Z_[07-11]_kaiwa.mp3',
    script: '（同上スクリプト）',
    q: '【質問】 浴衣はだれが着せますか。',
    options: ['a) 二人が自分で着る', 'b) 着付けの先生を呼ぶ', '*c) 杉村さんが手伝う', 'd) 居酒屋の人に着せてもらう'],
    key: 'c'
  },
  {
    num: 20,
    audio: 'audio/shokyu2/Z_[07-11]_kaiwa.mp3',
    script: '（同上スクリプト）',
    q: '【質問】 盆踊りが終わった後、みんなで何をしますか。',
    options: ['a) 花火を見に行く', 'b) そのまま家に帰る', 'c) 公民館を掃除する', '*d) いっしょに居酒屋に行く'],
    key: 'd'
  }
];

async function createDocx() {
  const children: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: '【JFT-Basic A2】第7課 聴解（ちょうかい） 練習問題（20問）',
          bold: true,
          size: 28,
        }),
      ],
    }),
    new Paragraph({ text: '' }),
    new Paragraph({
      children: [
        new TextRun({
          text: '音声を聞いて、質問に答えてください。正しい答えを、ひとつ選んでください。',
          size: 22,
        }),
      ],
    }),
    new Paragraph({ text: '' }),
  ];

  choukaiData.forEach((item) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${item.num}. 【Kode Audio: ${item.audio.split('/').pop()}】`,
            bold: true,
            size: 24,
          }),
        ],
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `【スクリプト】\n${item.script}`,
            size: 20,
            color: '555555',
          }),
        ],
      })
    );
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: item.q,
            bold: true,
            size: 24,
          }),
        ],
      })
    );
    item.options.forEach((opt) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: opt,
              size: 24,
            }),
          ],
        })
      );
    });
    children.push(new Paragraph({ text: '' }));
  });

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.resolve('..', 'Bank Soal JFT-Basic A2/Bab 07/Latihan_JFT_A2_Bab7_Choukai.docx');
  fs.writeFileSync(outPath, buffer);
  console.log('✅ Berhasil membuat:', outPath);
}

createDocx();
