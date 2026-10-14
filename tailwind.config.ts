import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090B10",          // Deep cyber-obsidian background
        panel: "#121621",        // Elevated slate card/surface
        edge: "#22293A",         // Crisp metallic border
        fg: "#F3F6FC",           // Crisp white-ice text
        mute: "#8A94A8",         // Muted steel label text
        arcade: {
          DEFAULT: "#00E5FF",    // Electric cyan accent
          soft: "#66F0FF",
        },
        sun: "#CCFF00",          // Neon volt action & highlight
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;