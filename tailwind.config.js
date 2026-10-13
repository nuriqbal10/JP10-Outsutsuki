/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
          light: "#e0e7ff",
          dark: "#3730a3",
        },
        irodori: {
          pink: "#ec4899",
          blue: "#0284c7",
          purple: "#8b5cf6",
          green: "#10b981",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        japanese: ["var(--font-kyokasho)", "sans-serif"],
      },
      boxShadow: {
        clay: "0 16px 36px -8px rgba(99, 102, 241, 0.12), 0 6px 16px -4px rgba(0, 0, 0, 0.04)",
        "clay-pill": "0 6px 16px rgba(99, 102, 241, 0.08), inset 0 2px 0 rgba(255, 255, 255, 0.95)",
        "clay-in": "inset 2px 2px 6px rgba(0, 0, 0, 0.06), inset -2px -2px 6px rgba(255, 255, 255, 0.9)",
      },
    },
  },
  plugins: [],
};
