"use client";

import React, { useState, useRef, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { useTheme, THEME_OPTIONS, ThemeId } from "@/context/ThemeContext";

interface ThemeSwitcherProps {
  compact?: boolean;
}

export default function ThemeSwitcher({ compact = false }: ThemeSwitcherProps) {
  const { currentTheme, setTheme, themeConfig } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center gap-2 rounded-xl transition duration-150 border shadow-sm ${
          compact
            ? "p-2 bg-black/5 dark:bg-black/40 border-current/20 hover:scale-105"
            : "px-3 py-1.5 bg-black/5 dark:bg-black/40 border-current/20 hover:scale-[1.02]"
        }`}
        title="Ganti Tema Warna"
        aria-label="Pilih Tema"
      >
        {/* Color Dot Swatch */}
        <span
          className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/30 shadow-inner shrink-0"
          style={{ backgroundColor: themeConfig.primaryColor }}
        />
        <Palette className="w-3.5 h-3.5 text-amber-500 transition-transform group-hover:rotate-45" />

        {!compact && (
          <span className="text-xs font-bold tracking-tight hidden sm:inline">
            {themeConfig.name}
          </span>
        )}
      </button>

      {/* Clean Minimalist Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl clay-card border border-black/10 dark:border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2.5 py-1.5 border-b border-current/10 mb-1 flex items-center justify-between text-[11px] font-black uppercase tracking-wider opacity-60">
            <span>Pilih Tema</span>
            <span className="text-[10px] font-mono">Theme</span>
          </div>

          <div className="space-y-1">
            {THEME_OPTIONS.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between gap-3 text-xs font-bold ${
                    isSelected
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/40 shadow-sm"
                      : "opacity-80 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Swatch circle */}
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 dark:border-white/30 shadow-inner shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </span>

                    {/* Hanya Nama Tema Saja */}
                    <span className="truncate">
                      {theme.name}
                    </span>
                  </div>

                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
