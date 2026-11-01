"use client";

import React from "react";

interface RubyTextProps {
  text: string;
  showFurigana?: boolean;
  className?: string;
  rubyClassName?: string;
}

/**
 * Komponen pembantu untuk menampilkan teks kanji Jepang dengan anotasi Furigana.
 * Mendukung format: [漢字|かんじ]
 * Contoh: "[立入禁止|たちいりきんし]の[看板|かんばん]"
 * Jika showFurigana = false, teks kana furigana disembunyikan untuk simulasi ujian realistik JFT-A2 / N4.
 */
export default function RubyText({
  text,
  showFurigana = true,
  className = "",
  rubyClassName = "text-[10px] text-amber-300 select-none",
}: RubyTextProps) {
  if (!text) return null;

  // Regex mencari pola [kanji|kana]
  const pattern = /\[([^\|\]]+)\|([^\]]+)\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    const [fullMatch, kanji, kana] = match;
    const matchIndex = match.index;

    // Masukkan teks sebelum pola jika ada
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    if (showFurigana) {
      parts.push(
        <ruby key={`ruby-${matchIndex}`} className="inline-flex flex-col items-center leading-tight mx-0.5 align-bottom">
          <span className="font-semibold">{kanji}</span>
          <rt className={rubyClassName}>{kana}</rt>
        </ruby>
      );
    } else {
      parts.push(
        <span key={`kanji-${matchIndex}`} className="font-semibold">
          {kanji}
        </span>
      );
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  // Masukkan sisa teks setelah match terakhir
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}
