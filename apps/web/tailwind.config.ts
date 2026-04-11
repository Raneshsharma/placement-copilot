import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  theme: {
    extend: {
      colors: {
        // ── Sovereign Careerist Palette ──────────────────────────
        // Primary: Deep Navy — high-authority, trust
        primary: {
          DEFAULT: "#003178",
          light: "#004a9e",
          dark: "#001f4d",
          container: "#d4e4ff",
          on: "#ffffff",
          onContainer: "#001a3a",
        },
        // Secondary: Cyan — AI layer, fluid, modern
        secondary: {
          DEFAULT: "#006879",
          light: "#0096b0",
          dark: "#003d47",
          container: "#c2e9fc",
          on: "#ffffff",
          onContainer: "#001f28",
        },
        // Tertiary: Emerald — success, growth, conversion
        tertiary: {
          DEFAULT: "#003e14",
          light: "#006b26",
          dark: "#00270a",
          container: "#b4f2c2",
          on: "#ffffff",
          onContainer: "#001f0a",
        },
        // Surface stack (The Stacking Principle — no borders)
        surface: "#f9f9ff",
        "surface-dim": "#f1f3ff",
        "surface-container-low": "#f1f3ff",
        "surface-container-mid": "#f5f6ff",
        "surface-container-high": "#eceef7",
        "surface-container-highest": "#ffffff",
        // Text hierarchy
        "on-surface": "#141b2c",
        "on-surface-variant": "#434652",
        "on-surface-disabled": "#a0a4b0",
        // Outlines & borders (use at 15% opacity only)
        "outline-default": "#797a86",
        "outline-variant": "rgba(121,122,134,0.15)",
        // Status
        success: { DEFAULT: "#2ad760", light: "#64ef94", dark: "#1a9a3f" },
        warning: { DEFAULT: "#f59e0b", light: "#fcd34d", dark: "#b45309" },
        error: { DEFAULT: "#dc2626", light: "#f87171", dark: "#991b1b" },
        // Canvas layers
        background: "#f9f9ff",
        inverse: "#141b2c",
        "inverse-on": "#f9f9ff",
        // Scrim (for modals/overlays)
        scrim: "rgba(20,27,44,0.32)",
        // ── Legacy aliases (backward compat) ──────────────────
        accent: {
          DEFAULT: "#006879",
          light: "#0096b0",
          on: "#ffffff",
          foreground: "#001f28",
        },
        text: {
          primary: "#141b2c",
          secondary: "#434652",
          tertiary: "#a0a4b0",
        },
        surfaceContainer: {
          DEFAULT: "#f1f3ff",
          low: "#f1f3ff",
          mid: "#f5f6ff",
          high: "#eceef7",
          highest: "#ffffff",
        },
        border: {
          DEFAULT: "rgba(121,122,134,0.15)",
          variant: "rgba(121,122,134,0.15)",
        },
        // Warm Onboarding Palette
        warm: {
          bg: "#FAFAF5",
          surface: "#FFFFFF",
          primary: "#D97706",
          "primary-hover": "#B45309",
          "primary-light": "#FEF3C7",
          text: {
            primary: "#1C1917",
            secondary: "#57534E",
            muted: "#A8A29E",
          },
          border: "#E7E5E4",
          "border-hover": "#D97706",
          error: "#D97706",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        display: ["var(--font-manrope)", ...fontFamily.sans],
        mono: ["JetBrains Mono", ...fontFamily.mono],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "full": "9999px",
      },
      boxShadow: {
        // Ambient shadows — tinted with on_surface at 6% opacity
        "ambient-sm": "0 4px 16px rgba(20,27,44,0.06)",
        DEFAULT: "0 8px 24px rgba(20,27,44,0.08), 0 2px 8px rgba(20,27,44,0.04)",
        "ambient-lg": "0 16px 48px rgba(20,27,44,0.10), 0 4px 16px rgba(20,27,44,0.06)",
        "ambient-xl": "0 24px 64px rgba(20,27,44,0.14), 0 8px 24px rgba(20,27,44,0.08)",
        // Glassmorphism — surface-container-lowest at 70% + 20px blur
        glass: "0 8px 32px rgba(20,27,44,0.06), 0 0 0 1px rgba(121,122,134,0.10)",
        // Glow (primary — for CTAs and highlights)
        glow: "0 0 20px rgba(0,49,120,0.20)",
        "glow-sm": "0 0 12px rgba(0,49,120,0.12)",
        "glow-lg": "0 0 40px rgba(0,49,120,0.28)",
        // Emerald glow (success)
        "glow-success": "0 0 20px rgba(42,215,96,0.20)",
        // Cyan glow (secondary)
        "glow-secondary": "0 0 20px rgba(0,104,121,0.20)",
        // Hero gradient background
        "hero-gradient": "linear-gradient(135deg, #003178 0%, #004a9e 50%, #006879 100%)",
        // Warm card shadows
        "warm-card": "0 4px 24px rgba(0,0,0,0.06)",
        "warm-card-hover": "0 8px 32px rgba(0,0,0,0.10)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,49,120,0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(0,49,120,0.30)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in-left": "slide-in-left 0.4s ease-out forwards",
        "slide-in-right": "slide-in-right 0.4s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #003178 0%, #004a9e 50%, #006879 100%)",
        "surface-shimmer": "linear-gradient(90deg, #f1f3ff 0%, #eceef7 50%, #f1f3ff 100%)",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
