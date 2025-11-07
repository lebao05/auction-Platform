// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enables dark mode via a CSS class like "dark"
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // tells Tailwind to scan these files for class names
  ],
  theme: {
    extend: {
      // You can extend default Tailwind theme here
      colors: {
        primary: "#2563eb", // custom blue
        secondary: "#64748b",
      },
    },
  },
  plugins: [],
};
