import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        maroon: {
          900: "#5C0F1E",
          700: "#7A1526",
          600: "#8C1D2B",
          50: "#FCE9E9",
        },
        gold: {
          700: "#9C7A1F",
          600: "#B8912A",
          500: "#C9A227",
          300: "#E4C878",
          100: "#F3E4B8",
        },
        ivory: {
          50: "#FBF7EE",
          100: "#F5EEDD",
          200: "#EFE4CB",
        },
        sage: {
          700: "#3C5640",
          600: "#4C6B4F",
          500: "#5B7F5E",
          100: "#E4EDE2",
        },
        navy: {
          700: "#2C3E52",
          500: "#3F5771",
        },
        ink: {
          900: "#2A2119",
          700: "#4A3F34",
          500: "#6B5F52",
          300: "#9C917F",
        },
        border: "#E6DCC8",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "Inter", "ui-sans-serif", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
      },
      boxShadow: {
        card: "0 12px 32px rgba(42,33,25,.14)",
        button: "0 8px 20px rgba(92,15,30,.25)",
      },
    },
  },
  plugins: [],
};

export default config;
