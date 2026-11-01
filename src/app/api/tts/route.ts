import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// Helper to convert base64 string to Uint8Array (100% Edge runtime compatible)
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to convert raw PCM (24kHz, 16-bit, mono) into valid RIFF WAV audio (Edge compliant)
function pcmToWav(
  pcmData: Uint8Array,
  sampleRate = 24000,
  channels = 1,
  bitsPerSample = 16
): Uint8Array {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const wav = new Uint8Array(44 + pcmData.length);
  const view = new DataView(wav.buffer);

  // "RIFF"
  wav[0] = 0x52; wav[1] = 0x49; wav[2] = 0x46; wav[3] = 0x46;
  view.setUint32(4, 36 + pcmData.length, true);
  // "WAVE"
  wav[8] = 0x57; wav[9] = 0x41; wav[10] = 0x56; wav[11] = 0x45;
  // "fmt "
  wav[12] = 0x66; wav[13] = 0x6d; wav[14] = 0x74; wav[15] = 0x20;
  view.setUint32(16, 16, true); // subchunk1 size (16 for PCM)
  view.setUint16(20, 1, true);  // audio format (1 = PCM)
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  // "data"
  wav[36] = 0x64; wav[37] = 0x61; wav[38] = 0x74; wav[39] = 0x61;
  view.setUint32(40, pcmData.length, true);

  wav.set(pcmData, 44);
  return wav;
}

async function synthesizeJapaneseWithGemini(
  text: string,
  voiceName: string = "Kore",
  apiKey: string
): Promise<{ buffer: Uint8Array; contentType: string }> {
  // Pedagogical Tokyo accent prompt instruction
  const systemInstruction =
    "You are an expert native Tokyo Japanese voice announcer for the official Irodori Japanese language curriculum. " +
    "Pronounce the provided Japanese text with authentic Tokyo standard pitch accent (日本語共通語・東京式アクセント), " +
    "impeccable pedagogical cadence, natural intonation, and pristine clarity. " +
    "Speak ONLY the exact Japanese text provided. Do not speak explanations, greetings, or English translations.";

  const modelsToTry = [
    "gemini-2.0-flash",
    "gemini-2.5-flash",
  ];

  let lastError: any = null;

  // Direct Edge-compatible REST API fetch
  for (const model of modelsToTry) {
    try {
      const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const restRes = await fetch(restUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text }] }],
          systemInstruction: {
            role: "system",
            parts: [{ text: systemInstruction }],
          },
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: voiceName || "Kore",
                },
              },
            },
          },
        }),
      });

      if (restRes.ok) {
        const data = await restRes.json();
        const parts = data.candidates?.[0]?.content?.parts;
        if (parts && parts.length > 0) {
          for (const part of parts) {
            if (part.inlineData?.data) {
              const rawBytes = base64ToUint8Array(part.inlineData.data);
              const mime = part.inlineData.mimeType || "audio/pcm";

              if (mime.includes("wav") || mime.includes("mp3")) {
                return { buffer: rawBytes, contentType: mime };
              }

              const wavBytes = pcmToWav(rawBytes, 24000, 1, 16);
              return { buffer: wavBytes, contentType: "audio/wav" };
            }
          }
        }
      } else {
        const errJson = await restRes.json().catch(() => null);
        lastError = new Error(errJson?.error?.message || `HTTP ${restRes.status}`);
      }
    } catch (err: any) {
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error("Failed to synthesize audio with Gemini models");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const text: string = (body.text || "").trim();
    const voice: string = body.voice || "Kore";
    const apiKey =
      body.apiKey ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_AI_API_KEY;

    if (!text) {
      return NextResponse.json(
        { success: false, error: "Parameter 'text' diperlukan." },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          fallback: true,
          message:
            "GEMINI_API_KEY belum dikonfigurasi di environment. Silakan gunakan Web Speech fallback.",
        },
        { status: 503 }
      );
    }

    const { buffer, contentType } = await synthesizeJapaneseWithGemini(
      text,
      voice,
      apiKey
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("[TTS API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        fallback: true,
        error: error.message || "Gagal melakukan sintesis suara native.",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = (searchParams.get("text") || "").trim();
  const voice = searchParams.get("voice") || "Kore";
  const apiKey =
    searchParams.get("apiKey") ||
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_AI_API_KEY;

  if (!text) {
    return NextResponse.json(
      { success: false, error: "Query parameter 'text' diperlukan." },
      { status: 400 }
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        fallback: true,
        message:
          "GEMINI_API_KEY belum dikonfigurasi. Silakan gunakan Web Speech fallback.",
      },
      { status: 503 }
    );
  }

  try {
    const { buffer, contentType } = await synthesizeJapaneseWithGemini(
      text,
      voice,
      apiKey
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        fallback: true,
        error: error.message || "Gagal melakukan sintesis suara native.",
      },
      { status: 500 }
    );
  }
}
