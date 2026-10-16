"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeId = "burgundy" | "jade" | "obsidian" | "plum" | "ivory" | "milk";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  nameJa: string;
  desc: string;
  primaryColor: string;
  accentColor: string;
  fontName: string;
  fontBadge: string;
  isLight?: boolean;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "burgundy",
    name: "Imperial Burgundy",
    nameJa: "緋牡丹 (Hibotan)",
    desc: "Klasik, prestisius & agung khas klan Outsutsuki",
    primaryColor: "#5c1124",
    accentColor: "#f59e0b",
    fontName: "Cinzel Imperial & Noto Serif JP",
    fontBadge: "Imperial Roman",
  },
  {
    id: "milk",
    name: "Pure Milk Luxury",
    nameJa: "白無垢 (Shiromuku)",
    desc: "Dominan putih susu murni, ultra bersih, mewah & kontras tajam",
    primaryColor: "#ffffff",
    accentColor: "#b45309",
    fontName: "Plus Jakarta Sans & BIZ UDPGothic",
    fontBadge: "Pure Minimalist",
    isLight: true,
  },
  {
    id: "jade",
    name: "Moonlit Jade",
    nameJa: "翡翠 (Hisui)",
    desc: "Batu giok menyejukkan, sangat ramah di mata untuk membaca",
    primaryColor: "#0d2b24",
    accentColor: "#10b981",
    fontName: "Outfit Modern & Noto Sans JP",
    fontBadge: "Zen Clean",
  },
  {
    id: "obsidian",
    name: "Obsidian Moonlight",
    nameJa: "白夜 (Byakuya)",
    desc: "Sapphire slate & perak bulan, jernih di malam hari",
    primaryColor: "#161f2e",
    accentColor: "#38bdf8",
    fontName: "Space Grotesk & Platinum Sans",
    fontBadge: "Lunar Minimalist",
  },
  {
    id: "plum",
    name: "Kyoto Royal Plum",
    nameJa: "紫苑 (Shion)",
    desc: "Anggun & lembut, sutra kaisar Kyoto berpadu rose gold",
    primaryColor: "#2a083b",
    accentColor: "#f472b6",
    fontName: "Cormorant Garamond & Shion Calligraphy",
    fontBadge: "Kyoto Aristocrat",
  },
  {
    id: "ivory",
    name: "Royal Washi",
    nameJa: "和紙 (Washi)",
    desc: "Mode perkamen hangat, lembut layaknya kertas buku klasik",
    primaryColor: "#f5efe6",
    accentColor: "#b45309",
    fontName: "Lora Classic & Japanese Washi Book",
    fontBadge: "Royal Library",
    isLight: true,
  },
];

interface ThemeContextType {
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  themeConfig: ThemeOption;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: "burgundy",
  setTheme: () => {},
  themeConfig: THEME_OPTIONS[0],
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeId>("burgundy");
  const [mounted, setMounted] = useState(false);

  const applyThemeToDOM = (theme: ThemeId) => {
    const isLight = theme === "milk" || theme === "ivory";
    document.documentElement.setAttribute("data-theme", theme);
    if (isLight) {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("outsutsuki_theme") as ThemeId;
      if (saved && THEME_OPTIONS.some((t) => t.id === saved)) {
        setCurrentTheme(saved);
        applyThemeToDOM(saved);
      } else {
        applyThemeToDOM("burgundy");
      }
    } catch {
      applyThemeToDOM("burgundy");
    }
    setMounted(true);
  }, []);

  const setTheme = (theme: ThemeId) => {
    setCurrentTheme(theme);
    try {
      localStorage.setItem("outsutsuki_theme", theme);
      applyThemeToDOM(theme);
    } catch {
      // ignore
    }
  };

  const themeConfig =
    THEME_OPTIONS.find((t) => t.id === currentTheme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themeConfig }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
