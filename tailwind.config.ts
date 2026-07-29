import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Burgundy matte core
        burgundy: {
          950: "#210509", // near-black burgundy — page background
          900: "#2E0A12",
          800: "#43101E", // matte surface
          700: "#5A1626", // raised surface / borders
          600: "#7A1F31",
          500: "#9C2A3D",
        },
        // Leopard / gold accents
        gold: {
          300: "#E8CE9C",
          400: "#D9B67E",
          500: "#B8935A", // primary accent
          600: "#8F6E3F",
        },
        leopard: {
          spot: "#2A170F",
          base: "#C9A46E",
        },
        ivory: "#F3E9DC",
        bone: "#EFE3D0",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
      },
      boxShadow: {
        matte: "0 8px 30px -12px rgba(0,0,0,0.6)",
        glow: "0 0 0 1px rgba(184,147,90,0.35), 0 8px 24px -8px rgba(184,147,90,0.25)",
      },
      backgroundImage: {
        "burgundy-grain":
          "radial-gradient(circle at 20% 20%, rgba(184,147,90,0.06), transparent 40%), radial-gradient(circle at 80% 60%, rgba(184,147,90,0.05), transparent 45%)",
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out both",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
