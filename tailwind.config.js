/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#EEF0FF",
          100: "#D8DCFF",
          200: "#B1B7FF",
          300: "#8A92FF",
          400: "#636DFF",
          500: "#2E33D4", // main blue
          600: "#2429AD",
          700: "#1B1F87",
          800: "#121560",
          900: "#090C3A",
        },
        accent: "#FF8800",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
