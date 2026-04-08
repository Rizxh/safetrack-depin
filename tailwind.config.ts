import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        teal: {
          50: "#E1F5EE",
          100: "#9FE1CB",
          200: "#5DCAA5",
          400: "#1D9E75",
          600: "#0F6E56",
          800: "#085041",
          900: "#04342C",
        },
        surface: {
          primary: "#ffffff",
          secondary: "#f8f8f6",
          tertiary: "#f1efea",
        },
        ink: {
          primary: "#1a1a18",
          secondary: "#5f5e5a",
          muted: "#9c9a92",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
};

export default config;
