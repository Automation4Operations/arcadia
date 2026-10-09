import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F0D1F",          // page background
        panel: "#1A1733",        // cards, inputs
        edge: "#2C2752",         // borders, rings
        fg: "#ECEAFF",           // primary text
        mute: "#9A94C7",         // secondary text
        arcade: { DEFAULT: "#7C5CFF", soft: "#A892FF" }, // interactive accent
        sun: "#FFC83D",          // ratings + play actions only
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
