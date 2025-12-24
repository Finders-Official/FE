// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        Orange: {
          900: "#2F1004",
          800: "#5D1F09",
          700: "#8C2F0D",
          600: "#BB3F11",
          500: "#E94E16",
          400: "#EE7244",
          300: "#F29573",
          200: "#F6B8A2",
          100: "#FBDCD0",
        },
        Neutral: {
          1000: "#000000",
          900: "#131313",
          875: "#222222",
          850: "#303030",
          800: "#3D3D3D",
          750: "#4A4A4A",
          700: "#575757",
          600: "#707070",
          500: "#8A8A8A",
          400: "#A3A3A3",
          300: "#BDBDBD",
          200: "#D6D6D6",
          100: "#F0F0F0",
          0: "#FBFBFB",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "ui-sans-serif",
          "system-ui",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
