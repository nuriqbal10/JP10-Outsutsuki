/**
 * Native Voice Engine - Japanese Studio TTS & Neural Web Speech
 *
 * Specializing in Tokyo standard pitch-accent (日本語共通語・東京式アクセント),
 * natural pedagogical cadence (0.92-0.95x rate, 1.05 pitch for vowel resonance),
 * Gemini Studio TTS backend (/api/tts), and high-fidelity browser voice fallbacks.
 */

export interface NativeVoiceOptions {
  rate?: number; // 0.92 recommended for pedagogical clarity
  pitch?: number; // 1.05 for clear Tokyo pitch accent resonance
  voiceName?: "Kore" | "Fenrir" | string; // Gemini Studio prebuilt voice
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error?: any) => void;
}

// In-memory cache for audio blob URLs (prevents redundant network trips)
const audioBlobCache = new Map<string, string>();

// Currently active playback trackers
let currentAudioElement: HTMLAudioElement | null = null;
let currentUtterance: SpeechSynthesisUtterance | null = null;

// Cached browser voice
let cachedJapaneseVoice: SpeechSynthesisVoice | null = null;
let isVoicesListenerSetup = false;

/**
 * Intelligently select the best neural / natural Japanese voice available in the client browser.
 * Priority hierarchy:
 * 1. Microsoft Nanami Online (Natural) / Keita Online (Natural)
 * 2. Google 日本語 (Chrome/Android)
 * 3. Apple Kyoko / Otoya (macOS/iOS Enhanced)
 * 4. Any Neural/Natural/Online ja-JP voice
 * 5. Desktop Japanese voices (Haruka, Ayumi, Ichiro)
 * 6. Any voice matching ja / ja-JP
 */
export function getBestJapaneseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return cachedJapaneseVoice;

  const jaVoices = voices.filter(
    (v) =>
      v.lang.toLowerCase().startsWith("ja") ||
      v.lang.toLowerCase().replace("_", "-") === "ja-jp" ||
      v.name.toLowerCase().includes("japan")
  );

  if (jaVoices.length === 0) return null;

  // 1. Prioritize Microsoft Online Natural voices (Edge / Windows 11)
  const msNatural = jaVoices.find(
    (v) =>
      v.name.includes("Nanami") &&
      (v.name.includes("Online") || v.name.includes("Natural"))
  ) || jaVoices.find(
    (v) =>
      v.name.includes("Keita") &&
      (v.name.includes("Online") || v.name.includes("Natural"))
  );
  if (msNatural) return (cachedJapaneseVoice = msNatural);

  // 2. Google 日本語 (Chrome)
  const googleJa = jaVoices.find(
    (v) =>
      v.name.includes("Google 日本語") ||
      v.name.toLowerCase().includes("google japanese")
  );
  if (googleJa) return (cachedJapaneseVoice = googleJa);

  // 3. Apple Kyoko / Otoya (macOS / iOS)
  const appleVoice = jaVoices.find(
    (v) => v.name.includes("Kyoko") || v.name.includes("Otoya")
  );
  if (appleVoice) return (cachedJapaneseVoice = appleVoice);

  // 4. Any voice with "Natural" or "Neural" in the title
  const anyNatural = jaVoices.find(
    (v) =>
      v.name.toLowerCase().includes("natural") ||
      v.name.toLowerCase().includes("neural")
  );
  if (anyNatural) return (cachedJapaneseVoice = anyNatural);

  // 5. Microsoft desktop fallback voices
  const msDesktop = jaVoices.find(
    (v) =>
      v.name.includes("Nanami") ||
      v.name.includes("Haruka") ||
      v.name.includes("Keita")
  );
  if (msDesktop) return (cachedJapaneseVoice = msDesktop);

  // 6. First available Japanese voice
  cachedJapaneseVoice = jaVoices[0];
  return cachedJapaneseVoice;
}

// Auto-warmup speech synthesis voices
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  if (window.speechSynthesis.onvoiceschanged !== undefined && !isVoicesListenerSetup) {
    window.speechSynthesis.onvoiceschanged = () => {
      getBestJapaneseVoice();
    };
    isVoicesListenerSetup = true;
  }
}

/**
 * Stops any active audio playback (both HTML5 Audio and Web Speech synthesis).
 */
export function stopNativeJapaneseAudio(): void {
  if (currentAudioElement) {
    try {
      currentAudioElement.pause();
      currentAudioElement.currentTime = 0;
    } catch {
      // Ignore abort errors
    }
    currentAudioElement = null;
  }

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore errors
    }
    currentUtterance = null;
  }
}

/**
 * Fallback synthesizer using calibrated Web Speech API
 */
function playWebSpeechFallback(
  text: string,
  options?: NativeVoiceOptions
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    options?.onError?.(new Error("Speech synthesis is not supported."));
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = options?.rate ?? 0.92;
    utterance.pitch = options?.pitch ?? 1.05;

    const bestVoice = getBestJapaneseVoice();
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onstart = () => {
      currentUtterance = utterance;
      options?.onStart?.();
    };

    utterance.onend = () => {
      if (currentUtterance === utterance) {
        currentUtterance = null;
      }
      options?.onEnd?.();
    };

    utterance.onerror = (e) => {
      if (currentUtterance === utterance) {
        currentUtterance = null;
      }
      options?.onError?.(e);
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    options?.onError?.(err);
  }
}

/**
 * Main entry point: Plays high-fidelity Japanese audio.
 * Prioritizes Gemini 3.8 Flash TTS (/api/tts), with smart in-memory blob cache,
 * and seamlessly falls back to calibrated neural Web Speech API.
 */
export async function playNativeJapaneseAudio(
  text: string,
  options?: NativeVoiceOptions
): Promise<void> {
  const cleanText = (text || "").trim();
  if (!cleanText) return;

  // Stop any currently playing audio
  stopNativeJapaneseAudio();

  const voiceName = options?.voiceName || "Kore";
  const cacheKey = `${voiceName}::${cleanText}`;

  // 1. Check in-memory Blob URL cache for instantaneous playback
  if (audioBlobCache.has(cacheKey)) {
    const cachedUrl = audioBlobCache.get(cacheKey)!;
    try {
      const audio = new Audio(cachedUrl);
      currentAudioElement = audio;
      if (options?.rate) {
        audio.playbackRate = options.rate;
      }

      audio.onplay = () => options?.onStart?.();
      audio.onended = () => {
        if (currentAudioElement === audio) {
          currentAudioElement = null;
        }
        options?.onEnd?.();
      };
      audio.onerror = (e) => {
        if (currentAudioElement === audio) {
          currentAudioElement = null;
        }
        // Fallback to Web Speech if blob has expired or failed
        playWebSpeechFallback(cleanText, options);
      };

      await audio.play();
      return;
    } catch {
      // If play was interrupted or blob invalidated, fallback to Web Speech
      playWebSpeechFallback(cleanText, options);
      return;
    }
  }

  // 2. Fetch from Gemini TTS endpoint (/api/tts)
  try {
    const response = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: cleanText,
        voice: voiceName,
      }),
    });

    if (!response.ok) {
      // Server returned fallback or error status, use calibrated browser Web Speech
      playWebSpeechFallback(cleanText, options);
      return;
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      // Response indicates fallback signal
      playWebSpeechFallback(cleanText, options);
      return;
    }

    const blob = await response.blob();
    if (blob.size < 100) {
      playWebSpeechFallback(cleanText, options);
      return;
    }

    const objectUrl = URL.createObjectURL(blob);
    audioBlobCache.set(cacheKey, objectUrl);

    const audio = new Audio(objectUrl);
    currentAudioElement = audio;
    if (options?.rate) {
      audio.playbackRate = options.rate;
    }

    audio.onplay = () => options?.onStart?.();
    audio.onended = () => {
      if (currentAudioElement === audio) {
        currentAudioElement = null;
      }
      options?.onEnd?.();
    };
    audio.onerror = () => {
      if (currentAudioElement === audio) {
        currentAudioElement = null;
      }
      playWebSpeechFallback(cleanText, options);
    };

    await audio.play();
  } catch {
    // Network offline or failed request -> instant seamless fallback
    playWebSpeechFallback(cleanText, options);
  }
}

/**
 * Preload and cache a list of Japanese expressions in memory
 */
export async function preloadNativeJapaneseAudio(
  texts: string[],
  voiceName: string = "Kore"
): Promise<void> {
  if (typeof window === "undefined") return;

  for (const text of texts) {
    const cleanText = text.trim();
    if (!cleanText) continue;
    const cacheKey = `${voiceName}::${cleanText}`;
    if (audioBlobCache.has(cacheKey)) continue;

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText, voice: voiceName }),
      });

      if (response.ok && !response.headers.get("content-type")?.includes("json")) {
        const blob = await response.blob();
        if (blob.size >= 100) {
          const url = URL.createObjectURL(blob);
          audioBlobCache.set(cacheKey, url);
        }
      }
    } catch {
      // Silently ignore prefetch errors
    }
  }
}
