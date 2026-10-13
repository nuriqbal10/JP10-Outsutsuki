import { Document, Packer, Paragraph, TextRun } from 'docx';
import fs from 'fs';
import path from 'path';

// Bab 7 Moji Goi Questions: 25 items
// Distribution: 6 A, 7 B, 6 C, 6 D = 25 items
const mojiGoiData = [
  // 1-4 Visual Kosakata (gambar: Z_07_1_01_keejiban, Z_07_2_01_gasutenken, Z_07_2_04_hanabitaikai, Z_07_4_01_bon-odorinisasou)
  {
    num: 1,
    q: '絵を見て、正しいことばを選んでください。［町のお知らせが貼ってある場所］',
    options: ['*a) 掲示板', 'b) 郵便ポスト', 'c) 改札口', 'd) 駐車場'],
    key: 'a'
  },
  {
    num: 2,
    q: '絵を見て、正しいことばを選んでください。［家に来てガスをチェックすること］',
    options: ['a) 水道工事', '*b) ガス点検', 'c) 防災訓練', 'd) ごみ収集'],
    key: 'b'
  },
  {
    num: 3,
    q: '絵を見て、正しいことばを選んでください。［夏の夜に海岸や川で見るイベント］',
    options: ['a) カラオケ大会', 'b) フリーマーケット', '*c) 花火大会', 'd) 避難訓練'],
    key: 'c'
  },
  {
    num: 4,
    q: '絵を見て、正しいことばを選んでください。［みんなで輪になって音楽に合わせて踊る祭り］',
    options: ['a) コンサート', 'b) ブラスバンド', 'c) マラソン大会', '*d) 盆踊り'],
    key: 'd'
  },
  // 5-7 Membaca Kanji
  {
    num: 5,
    q: '今度の土曜日、小学校の 校庭 で防災訓練があります。',
    options: ['a) たいいくかん', '*b) こうてい', 'c) ひろば', 'd) きょうしつ'],
    key: 'b'
  },
  {
    num: 6,
    q: '水道工事のため、明日の午後は 断水 します。',
    options: ['*a) だんすい', 'b) じすい', 'c) げすい', 'd) こうすい'],
    key: 'a'
  },
  {
    num: 7,
    q: '雨天の場合は、来週に 延期 します。',
    options: ['a) ちゅうし', 'b) ていき', '*c) えんき', 'd) そうき'],
    key: 'c'
  },
  // 8-9 Menulis Kanji
  {
    num: 8,
    q: 'お祭りの寄付金を ふくろ に入れて持って行きます。',
    options: ['a) 手紙', 'b) 掲示', 'c) 書類', '*d) 封筒'],
    key: 'd'
  },
  {
    num: 9,
    q: '参加したい人は、朝9時に駐車場に あつまって ください。',
    options: ['*a) 集合して', 'b) 開催して', 'c) 避難して', 'd) 出発して'],
    key: 'a'
  },
  // 10-20 Kontekstual Kalimat Rumpang
  {
    num: 10,
    q: 'ボランティアでごみを拾うときは、汚れてもいい服と（　　）を持って来てください。',
    options: ['a) 浴衣', '*b) 軍手', 'c) はっぴ', 'd) 水着'],
    key: 'b'
  },
  {
    num: 11,
    q: '水道工事のあと、水が（　　）ことがありますので、しばらく出してから使ってください。',
    options: ['a) 止まる', 'b) 減る', '*c) 濁る', 'd) 凍る'],
    key: 'c'
  },
  {
    num: 12,
    q: 'フリーマーケットは、毎月第2土曜日に市役所の（　　）でやっています。',
    options: ['a) 教室', 'b) 階段', 'c) 屋上', '*d) 広場'],
    key: 'd'
  },
  {
    num: 13,
    q: '防災訓練では、消火訓練やAEDの使い方など、様々な（　　）があります。',
    options: ['*a) 内容', 'b) 延期', 'c) 迷惑', 'd) 濁り'],
    key: 'a'
  },
  {
    num: 14,
    q: '「あのう、お祭りの寄付はみんな払いますか。」\n「寄付ですから、払いたい人（　　）でいいですよ。」',
    options: ['a) まで', '*b) だけ', 'c) より', 'd) ほど'],
    key: 'b'
  },
  {
    num: 15,
    q: '雨天の（　　）は、屋外のイベントをホールで行います。',
    options: ['a) 条件', 'b) 理由', '*c) 場合', 'd) 参加'],
    key: 'c'
  },
  {
    num: 16,
    q: '「盆踊り、参加してみたいです。何を着て行ったらいいですか。」\n「（　　）いいですよ。動きやすい服で来てください。」',
    options: ['a) いつでも', 'b) だれでも', 'c) どこでも', '*d) 何でも'],
    key: 'd'
  },
  {
    num: 17,
    q: '地域の（　　）に入ると、災害のときに避難所の情報などがスムーズに分かります。',
    options: ['*a) 自治会', 'b) 会社', 'c) 営業所', 'd) 学校'],
    key: 'a'
  },
  {
    num: 18,
    q: '「道の駅うらら」では、地元のおいしい夏野菜の（　　）が行われます。',
    options: ['a) 点検', '*b) 販売会', 'c) 訓練', 'd) 延期'],
    key: 'b'
  },
  {
    num: 19,
    q: '「ピアノの夕べ コンサート」の入場券は、市民センターで（　　）です。',
    options: ['a) 訓練中', 'b) 延期中', '*c) 販売中', 'd) 点検中'],
    key: 'c'
  },
  {
    num: 20,
    q: 'お神輿をかつぎたい人は、事前の（　　）が必要です。',
    options: ['a) 中止', 'b) 寄付', 'c) 延期', '*d) 申し込み'],
    key: 'd'
  },
  // 21-25 Tata Bahasa Bintang (★) Pola ～たら & Pasif
  {
    num: 21,
    q: '雨が　＿＿　＿＿　★　＿＿　やります。\n1: 中の　2: 降ったら　3: で　4: ホール',
    options: ['*a) 4', 'b) 1', 'c) 2', 'd) 3'], // 降ったら(2) 中の(1) ホール(4★) で(3) -> a
    key: 'a'
  },
  {
    num: 22,
    q: '明日、市民ホールに　＿＿　＿＿　★　＿＿　開催されます。\n1: コンサートが　2: おいて　3: ふるさと　4: ピアノの',
    options: ['a) 2', '*b) 1', 'c) 3', 'd) 4'], // おいて(2) ピアノの(4) ふるさと(3) コンサートが(1★) -> b
    key: 'b'
  },
  {
    num: 23,
    q: '盆踊りは簡単ですから、　＿＿　＿＿　★　＿＿　踊れますよ。\n1: でも　2: 練習　3: だれ　4: すれば',
    options: ['a) 3', 'b) 1', '*c) 4', 'd) 2'], // だれ(3) でも(1) 練習すれば(2,4) -> だれ(3) でも(1) 練習(2) すれば(4★) -> c
    key: 'c'
  },
  {
    num: 24,
    q: '何を着て　＿＿　＿＿　★　＿＿　いいですか。\n1: 行ったら　2: いいか　3: 分からないので　4: 教えて',
    options: ['a) 1', 'b) 3', 'c) 2', '*d) 3'], // 行ったら(1) いいか(2) 分からないので(3★) 教えて(4) -> d
    key: 'd'
  },
  {
    num: 25,
    q: '盆踊りが　＿＿　＿＿　★　＿＿　行きましょう。\n1: 終わったら　2: に　3: 居酒屋　4: いっしょ',
    options: ['a) 1', '*b) 3', 'c) 4', 'd) 2'], // 終わったら(1) いっしょに(4,2) 居酒屋(3★) に行きましょう -> b
    key: 'b'
  }
];

async function createDocx() {
  const children: Paragraph[] = [
    new Paragraph({
      children: [
        new TextRun({
          text: '【JFT-Basic A2】第7課 文字・語彙 練習問題（25問）',
          bold: true,
          size: 28,
        }),
      ],
    }),
    new Paragraph({ text: '' }),
  ];

  mojiGoiData.forEach((item) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${item.num}. ${item.q}`,
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
  const outPath = path.resolve('..', 'Bank Soal JFT-Basic A2/Bab 07/Latihan_JFT_A2_Bab7_Mojigoi.docx');
  fs.writeFileSync(outPath, buffer);
  console.log('✅ Berhasil membuat:', outPath);
}

createDocx();
