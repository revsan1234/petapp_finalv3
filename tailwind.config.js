/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-green": "#9ea794",
        "bg-pink": "#df88b4",
        accent: "#AA336A",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        heading: ["Fredoka", "sans-serif"],
      },
    },
  },
  plugins: [],
};
