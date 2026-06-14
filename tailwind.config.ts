import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand tokens extracted from the original site CSS.
        forneria: {
          red: "#df1b2d", // primary brand red (menu, links, titles)
          "red-bright": "#e93232", // accents / arrows / icons
          "red-dark": "#c50c0c", // top bar / darker red
          maroon: "#8e0c19", // app blocks / dark red base
          gold: "#f7c868", // gold accent on dark bands
          pizza: "#cf2f31", // pizza product names
          "gray-text": "#575757", // section title gray
          gray: "#f2f2f2", // light section background
          dark: "#232323", // footer background
          black: "#232323", // dark text / surfaces
        },
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "var(--font-roboto)", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
