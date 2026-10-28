import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface GenerateQuizRequest {
  topic?: string;
  chapter?: number;
  count?: number;
  type?: "mc" | "ox" | "mixed";
  level?: string;
  villageTheme?: string;
  apiKey?: string;
  customPrompt?: string;
}

// Bank Soal Prosedural Cerdas Irodori A2.2 (Fallback Otomatis Jika Tanpa API Key Eksternal)
const IRODORI_TOPIC_POOLS: Record<number, any[]> = {
  1: [
    {
      q: "わたしは まいにち 7じに ______。",
      type: "mc",
      options: ["おきます", "ねます", "たべます", "いきます"],
      key: "a",
      exp: "「おきます」(bangun tidur) sesuai konteks waktu pagi 7じ.",
    },
    {
      q: "「きのう、どこへ いきましたか。」「______。」",
      type: "mc",
      options: ["どこも いきませんでした", "どこへ いきます", "どこへ いきました", "どこも いきます"],
      key: "a",
      exp: "Penyangkalan total bentuk lampau: どこも いきませんでした.",
    },
    {
      q: "「あさごはん」adalah kosakata untuk makan malam.",
      type: "ox",
      options: ["⭕ Benar (Maru)", "❌ Salah (Batsu)"],
      key: "b",
      exp: "Salah. あさごはん adalah sarapan pagi. Makan malam adalah ばんごはん.",
    },
  ],
  12: [
    {
      q: "「この でんしレンジは、いくらですか。」\n「30％オフですから、______です。」",
      type: "mc",
      options: ["やすく なります", "たかく なります", "おおきく なります", "べんりに なります"],
      key: "a",
      exp: "Diskon 30% artinya harga menjadi lebih murah (やすく なります).",
    },
    {
      q: "「ポイントカードは おもちですか。」\nPelayan toko menanyakan kartu garansi barang.",
      type: "ox",
      options: ["⭕ Benar (Maru)", "❌ Salah (Batsu)"],
      key: "b",
      exp: "Salah. ポイントカード adalah kartu member / kartu poin belanja, bukan kartu garansi.",
    },
    {
      q: "この掃除機は 軽くて 音が ______ です。",
      type: "mc",
      options: ["しずか", "うるさい", "おもい", "ひろい"],
      key: "a",
      exp: "Pujian fitur vacuum cleaner: 軽くて (ringan) dan 音がしずか (suaranya tenang/hening).",
    },
    {
      q: "「セール中」artinya barang tersebut sedang tidak dijual.",
      type: "ox",
      options: ["⭕ Benar (Maru)", "❌ Salah (Batsu)"],
      key: "b",
      exp: "Salah. セール中 (seeru-chuu) artinya sedang obral / sedang dalam masa diskon.",
    },
  ],
  15: [
    {
      q: "「チェックインを おねがいします。」diucapkan saat berada di:",
      type: "mc",
      options: ["フロント (Resepsionis Hotel)", "レストラン (Restoran)", "えき (Stasiun)", "くうこう (Bandara)"],
      key: "a",
      exp: "Check-in kamar hotel diucapkan di フロント (front desk / resepsionis).",
    },
    {
      q: "おへやで Wi-Fiが ______。",
      type: "mc",
      options: ["つかえます", "たべます", "いきます", "みます"],
      key: "a",
      exp: "Bentuk potensial: Wi-Fiが つかえます (Bisa menggunakan Wi-Fi).",
    },
    {
      q: "「きんえんるーむ (禁煙ルーム)」artinya kamar khusus untuk merokok.",
      type: "ox",
      options: ["⭕ Benar (Maru)", "❌ Salah (Batsu)"],
      key: "b",
      exp: "Salah. 禁煙 (Kinen) artinya dilarang merokok (Non-smoking room).",
    },
  ],
};

// Generic Shinobi / Irodori Question Pool
const GENERIC_SHINOBI_POOL = [
  {
    q: "「よろしくお願いします」memiliki makna salam perkenalan dan kerja sama.",
    type: "ox",
    options: ["⭕ Benar (Maru)", "❌ Salah (Batsu)"],
    key: "a",
    exp: "Benar. Salam standar untuk memohon kerja sama yang baik.",
  },
  {
    q: "木ノ葉隠れの里で 火影(ほかげ)に ______ たいです。",
    type: "mc",
    options: ["なり", "たべ", "のめ", "いか"],
    key: "a",
    exp: "Pola keinginan cita-cita: [KB] に なりたいです (Ingin menjadi Hokage).",
  },
  {
    q: "「あぶないですから、______ ください。」",
    type: "mc",
    options: ["はいらないで", "はいって", "はいり", "はいろう"],
    key: "a",
    exp: "Pola larangan halus: [V-nai] + でください (Jangan masuk).",
  },
  {
    q: "「手裏剣 (しゅりけん)」dibaca sebagai 'Shuriken'.",
    type: "ox",
    options: ["⭕ Benar (Maru)", "❌ Salah (Batsu)"],
    key: "a",
    exp: "Benar. 手裏剣 dibaca しゅりけん (senjata lempar ninja).",
  },
  {
    q: "砂隠れの里の 風影 (かぜかげ)は だれですか。",
    type: "mc",
    options: ["我愛羅 (Gaara)", "ナルト (Naruto)", "サスケ (Sasuke)", "カカシ (Kakashi)"],
    key: "a",
    exp: "Kazekage dari Sunagakure adalah 我愛羅 (Gaara).",
  },
  {
    q: "「すみません、この 漢字の 読み方を ______ ください。」",
    type: "mc",
    options: ["おしえて", "たべて", "かって", "のんで"],
    key: "a",
    exp: "Pola permohonan bantuan: おしえて ください (Tolong ajarkan).",
  },
  {
    q: "「終末の谷 (しゅうまつの たに)」adalah tempat pertarungan legendaris.",
    type: "ox",
    options: ["⭕ Benar (Maru)", "❌ Salah (Batsu)"],
    key: "a",
    exp: "Benar. Lembah Akhir (Valley of the End).",
  },
];

export async function POST(req: NextRequest) {
  try {
    const body: GenerateQuizRequest = await req.json();
    const {
      topic = "Irodori A2.2 Bahasa Jepang & Dunia Shinobi",
      chapter = 12,
      count = 10,
      type = "mixed",
      level = "A2.2",
      villageTheme = "konoha",
      apiKey,
      customPrompt,
    } = body;

    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

    // JIKA ADA GEMINI API KEY: Panggil Google Gemini AI
    if (effectiveApiKey && effectiveApiKey.length > 10) {
      try {
        const systemPrompt = `Anda adalah asisten AI guru bahasa Jepang spesialis kurikulum Irodori (Japanese for Life in Japan) dan standar ujian JFT-Basic A2.
Tugas Anda adalah membuat paket soal kuis pilihan ganda dan/atau Benar-Salah (OX) interaktif ala platform game ZEP Quiz bertema Ninja Naruto.

Parameter permintaan:
- Topik / Materi: ${topic}
- Bab Irodori: Bab ${chapter}
- Level: ${level}
- Jumlah Soal: ${count} butir
- Tipe Soal: ${type} (mc = 4 pilihan, ox = benar/salah, mixed = campuran keduanya)
- Desa Ninja Arena: ${villageTheme}
${customPrompt ? `- Permintaan Khusus: ${customPrompt}` : ""}

Ketentuan format soal:
1. Soal harus komunikatif, aplikatif, dan kontekstual kehidupan sehari-hari (atau diwarnai sedikit nuansa ninja edukatif).
2. Tuliskan teks soal dalam bahasa Jepang alami (Kanji + Kana dasar A2) disertai konteks.
3. Untuk tipe 'mc': Wajib sediakan 4 pilihan (optionA, optionB, optionC, optionD). Kunci berupa salah satu dari 'a', 'b', 'c', 'd'.
4. Untuk tipe 'ox': Wajib sediakan 2 pilihan (optionA = "⭕ Benar (Maru)", optionB = "❌ Salah (Batsu)"). Kunci berupa 'a' atau 'b'.
5. Berikan penjelasan (explanation) singkat dan jelas dalam bahasa Indonesia.

Keluarkan HANYA format JSON valid tanpa tanda markdown tambahan (tanpa backtick \`\`\`json):
[
  {
    "id": 1,
    "questionText": "...",
    "type": "mc" atau "ox",
    "optionA": "...",
    "optionB": "...",
    "optionC": "...",
    "optionD": "...",
    "answerKey": "a",
    "explanation": "..."
  }
]`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${effectiveApiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json",
            },
          }),
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            const parsed = JSON.parse(candidateText.trim());
            if (Array.isArray(parsed) && parsed.length > 0) {
              return NextResponse.json({
                success: true,
                source: "gemini_ai",
                data: parsed.map((item, idx) => ({
                  ...item,
                  id: `ai_${Date.now()}_${idx + 1}`,
                  villageTheme,
                })),
              });
            }
          }
        }
      } catch (aiErr) {
        console.warn("Panggilan Gemini API gagal, beralih ke generator prosedural bawaan:", aiErr);
      }
    }

    // FALLBACK CERDAS: Generator Prosedural Irodori A2.2 Bawaan
    const specificPool = IRODORI_TOPIC_POOLS[chapter] || [];
    const combinedPool = [...specificPool, ...GENERIC_SHINOBI_POOL];

    // Filter berdasarkan type jika bukan 'mixed'
    let filteredPool = combinedPool;
    if (type === "mc") {
      filteredPool = combinedPool.filter((q) => q.type === "mc");
    } else if (type === "ox") {
      filteredPool = combinedPool.filter((q) => q.type === "ox");
    }

    if (filteredPool.length === 0) filteredPool = combinedPool;

    // Shuffle & ambil sejumlah `count`
    const shuffled = [...filteredPool].sort(() => 0.5 - Math.random());
    const selected = [];

    for (let i = 0; i < count; i++) {
      const base = shuffled[i % shuffled.length];
      selected.push({
        id: `procedural_${Date.now()}_${i + 1}`,
        questionText: `[Ronde ${i + 1}] ${base.q}`,
        type: base.type,
        optionA: base.options[0] || "Pilihan A",
        optionB: base.options[1] || "Pilihan B",
        optionC: base.options[2] || (base.type === "ox" ? "" : "Pilihan C"),
        optionD: base.options[3] || (base.type === "ox" ? "" : "Pilihan D"),
        answerKey: base.key,
        explanation: base.exp,
        villageTheme,
      });
    }

    return NextResponse.json({
      success: true,
      source: "irodori_procedural_generator",
      data: selected,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Gagal membuat soal AI: " + err.message },
      { status: 500 }
    );
  }
}
