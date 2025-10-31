import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./widgets/**/*.{js,ts,jsx,tsx,mdx}",
    "./outils/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#4F46E5",
          "primary-700": "#4338CA",
          secondary: "#06B6D4",
          accent: "#F59E0B",
          success: "#10B981",
          danger: "#EF4444",
        },
      },
      boxShadow: {
        soft: "0 2px 8px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      },
      container: {
        center: true,
        padding: "2rem",
      },
    },
  },
  plugins: [],
};

export default config;

