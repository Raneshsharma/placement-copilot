import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        primary: { DEFAULT: "#f2ca50", light: "#ffe088", dark: "#c9a828", foreground: "#3c2f00" },
        accent: { DEFAULT: "#f2cc00", light: "#ffe16d", foreground: "#3a3000" },
        secondary: { DEFAULT: "#c6c6c6", light: "#e3e2e2", foreground: "#2f3131" },
        background: "#131313",
        surface: { DEFAULT: "#201f1f", dim: "#0e0e0e", bright: "#393939", variant: "#353534" },
        surfaceContainer: { DEFAULT: "#201f1f", low: "#1c1b1b", high: "#2a2a2a", highest: "#353534" },
        text: { primary: "#e5e2e1", secondary: "#99907c", tertiary: "#737783" },
        border: { DEFAULT: "#353534", variant: "#4d4635" },
        success: "#e9c349",
        warning: "#f2cc00",
        error: "#ffb4ab",
        tertiary: { DEFAULT: "#f2cc00", light: "#ffe16d" },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", ...fontFamily.sans],
        display: ["var(--font-noto-serif)", ...fontFamily.sans],
        mono: ["JetBrains Mono", ...fontFamily.mono],
      },
      borderRadius: { sm: "4px", DEFAULT: "6px", lg: "12px", xl: "16px" },
      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.3)",
        DEFAULT: "0 2px 8px rgba(0,0,0,0.4)",
        lg: "0 8px 24px rgba(0,0,0,0.5)",
        glow: "0 0 20px rgba(242,202,80,0.25)",
        "glow-sm": "0 0 12px rgba(242,202,80,0.15)",
        "glow-lg": "0 0 40px rgba(242,202,80,0.35)",
        card: "0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in": "slide-in 0.4s ease-out forwards",
        pulse: "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
