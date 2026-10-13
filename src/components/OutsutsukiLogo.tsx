import React from "react";

interface OutsutsukiLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function OutsutsukiLogo({ size = "md", className = "" }: OutsutsukiLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#2D0814] via-[#1E040D] to-[#120207] border border-amber-500/40 shadow-xl overflow-hidden shrink-0 ${currentSize} ${className}`}
      title="Emblem Eksklusif Kelas Outsutsuki (大筒木)"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-radial-gradient from-amber-500/20 via-transparent to-transparent pointer-events-none" />

      {/* SVG Otsutsuki Clan Crest */}
      <svg
        viewBox="0 0 100 100"
        className="w-[82%] h-[82%] drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Circular Aura */}
        <circle cx="50" cy="50" r="44" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
        <circle cx="50" cy="50" r="39" stroke="#fda4af" strokeWidth="1" opacity="0.4" />

        {/* Otsutsuki Crown / Twin Horns Silhouettes */}
        <path
          d="M26 38 C 22 18, 38 12, 44 26 C 41 22, 32 24, 30 36 Z"
          fill="url(#hornGradLeft)"
        />
        <path
          d="M74 38 C 78 18, 62 12, 56 26 C 59 22, 68 24, 70 36 Z"
          fill="url(#hornGradRight)"
        />

        {/* Central Otsutsuki Sun / Rinnegan Concentric Circles */}
        <circle cx="50" cy="50" r="19" fill="#140208" stroke="#fbbf24" strokeWidth="2" />
        <circle cx="50" cy="50" r="13" stroke="#f43f5e" strokeWidth="1.5" opacity="0.8" />
        <circle cx="50" cy="50" r="7" stroke="#fbbf24" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="3" fill="#ffffff" />

        {/* Magatama accents (Top, Bottom Left, Bottom Right) */}
        <circle cx="50" cy="24" r="2.5" fill="#fbbf24" />
        <circle cx="28" cy="64" r="2.5" fill="#fbbf24" />
        <circle cx="72" cy="64" r="2.5" fill="#fbbf24" />

        {/* Bottom Lotus / Clan Base */}
        <path
          d="M34 76 C 44 71, 56 71, 66 76 C 58 83, 42 83, 34 76 Z"
          fill="#fbbf24"
          opacity="0.9"
        />

        <defs>
          <linearGradient id="hornGradLeft" x1="24" y1="14" x2="44" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="0.6" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#e11d48" />
          </linearGradient>
          <linearGradient id="hornGradRight" x1="76" y1="14" x2="56" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="0.6" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#e11d48" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
