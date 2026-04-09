import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        primary: { DEFAULT: "#0D7377", light: "#E8F6F6", dark: "#095456", foreground: "#FFFFFF" },
        accent: { DEFAULT: "#FF6B35", light: "#FFF0EB", foreground: "#FFFFFF" },
        secondary: { DEFAULT: "#7C6BB2", light: "#F0EDF7", foreground: "#FFFFFF" },
        background: "#FAFAF8",
        surface: "#FFFFFF",
        surfaceAlt: "#F4F4F2",
        text: { primary: "#1A1A2E", secondary: "#5C5C6D", tertiary: "#9B9BAA" },
        border: "#E8E8E6",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", ...fontFamily.sans],
        display: ["var(--font-plus-jakarta)", ...fontFamily.sans],
        mono: ["JetBrains Mono", ...fontFamily.mono],
      },
      borderRadius: { sm: "6px", DEFAULT: "10px", lg: "16px", xl: "24px" },
      boxShadow: {
        sm: "0 1px 2px rgba(26,26,46,0.05)",
        DEFAULT: "0 4px 12px rgba(26,26,46,0.08)",
        lg: "0 8px 24px rgba(26,26,46,0.12)",
        glow: "0 0 0 3px rgba(13,115,119,0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
