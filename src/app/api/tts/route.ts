import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

// Helper to convert raw PCM (24kHz, 16-bit, mono) into valid RIFF WAV audio
function pcmToWav(
  pcmBuffer: Buffer,
  sampleRate = 24000,
  channels = 1,
  bitsPerSample = 16
): Buffer {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16); // subchunk1 size (16 for PCM)
  header.writeUInt16LE(1, 20); // audio format (1 = PCM)
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([header, pcmBuffer]);
}

async function synthesizeJapaneseWithGemini(
  text: string,
  voiceName: string = "Kore",
  apiKey: string
): Promise<{ buffer: Buffer; contentType: string }> {
  // Pedagogical Tokyo accent prompt instruction
  const systemInstruction =
    "You are an expert native Tokyo Japanese voice announcer for the official Irodori Japanese language curriculum. " +
    "Pronounce the provided Japanese text with authentic Tokyo standard pitch accent (日本語共通語・東京式アクセント), " +
    "impeccable pedagogical cadence, natural intonation, and pristine clarity. " +
    "Speak ONLY the exact Japanese text provided. Do not speak explanations, greetings, or English translations.";

  const modelsToTry = [
    "gemini-3.8-flash-tts",
    "gemini-2.0-flash",
    "gemini-2.5-flash",
  ];

  const ai = new GoogleGenAI({ apiKey });

  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: text,
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voiceName || "Kore",
              },
            },
          },
          systemInstruction,
        },
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (parts && parts.length > 0) {
        for (const part of parts) {
          // Check for inlineData
          if (part.inlineData && part.inlineData.data) {
            const rawBuffer = Buffer.from(part.inlineData.data, "base64");
            const mime = part.inlineData.mimeType || "audio/pcm";

            if (mime.includes("wav") || mime.includes("mp3")) {
              return { buffer: rawBuffer, contentType: mime };
            }

            // Raw PCM -> Wrap with 44-byte WAV header (24kHz 16-bit mono)
            const wavBuffer = pcmToWav(rawBuffer, 24000, 1, 16);
            return { buffer: wavBuffer, contentType: "audio/wav" };
          }
        }
      }
    } catch (err: any) {
      lastError = err;
      // Try next model if model not found
      continue;
    }
  }

  // If SDK attempts failed, fallback to direct REST call if applicable
  try {
    const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
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
            const rawBuffer = Buffer.from(part.inlineData.data, "base64");
            const mime = part.inlineData.mimeType || "audio/pcm";
            if (mime.includes("wav") || mime.includes("mp3")) {
              return { buffer: rawBuffer, contentType: mime };
            }
            const wavBuffer = pcmToWav(rawBuffer, 24000, 1, 16);
            return { buffer: wavBuffer, contentType: "audio/wav" };
          }
        }
      }
    }
  } catch (restErr: any) {
    lastError = restErr;
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
