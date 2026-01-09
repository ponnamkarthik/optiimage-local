import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",

        surface: "hsl(var(--surface) / <alpha-value>)",
        surface2: "hsl(var(--surface2) / <alpha-value>)",
        surface3: "hsl(var(--surface3) / <alpha-value>)",

        border: "hsl(var(--border) / <alpha-value>)",
        border2: "hsl(var(--border2) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        muted2: "hsl(var(--muted2) / <alpha-value>)",

        invert: "hsl(var(--invert) / <alpha-value>)",
        invertForeground: "hsl(var(--invertForeground) / <alpha-value>)",
        invertHover: "hsl(var(--invertHover) / <alpha-value>)",

        accent: "hsl(var(--accent) / <alpha-value>)",
        accentText: "hsl(var(--accentText) / <alpha-value>)",
        accentTo: "hsl(var(--accentTo) / <alpha-value>)",

        info: "hsl(var(--info) / <alpha-value>)",
        infoText: "hsl(var(--infoText) / <alpha-value>)",

        highlight: "hsl(var(--highlight) / <alpha-value>)",
        highlightText: "hsl(var(--highlightText) / <alpha-value>)",

        danger: "hsl(var(--danger) / <alpha-value>)",
        dangerText: "hsl(var(--dangerText) / <alpha-value>)",
      },
    },
  },
  plugins: [typography, animate],
};
