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
        // ポケモンゲーム風カラーパレット
        pokemon: {
          blue: {
            50: "#EBF5FF",
            100: "#E1EFFE",
            200: "#C3DDFD",
            300: "#A4CAFE",
            400: "#76A9FA",
            500: "#3F83F8",
            600: "#1C64F2",
            700: "#1A56DB",
            800: "#1E429F",
            900: "#233876",
          },
          red: {
            500: "#EF4444",
            600: "#DC2626",
          },
          yellow: {
            400: "#FBBF24",
            500: "#F59E0B",
          },
        },
      },
      backgroundImage: {
        // ゲーム風グラデーション背景
        "pokemon-gradient": "linear-gradient(135deg, #1E3A8A 0%, #312E81 50%, #1E1B4B 100%)",
        "pokemon-gradient-light": "linear-gradient(135deg, #3B82F6 0%, #6366F1 50%, #4F46E5 100%)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
      },
      boxShadow: {
        "pokemon-card": "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)",
        "pokemon-button": "0 4px 14px 0 rgba(59, 130, 246, 0.4)",
        "pokemon-glow": "0 0 20px rgba(59, 130, 246, 0.3)",
      },
      borderRadius: {
        "pokemon": "1rem",
      },
    },
  },
  plugins: [],
};
export default config;
