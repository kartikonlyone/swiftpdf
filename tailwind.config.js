/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#004D40",
          dark: "#00332B",
          light: "#0B6B5C",
          tint: "#E7F2EF"
        },
        accent: {
          DEFAULT: "#9C6B1F",
          light: "#F3E6CE"
        },
        ink: "#161B1A",
        paper: "#FAFAF8"
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui"]
      },
      borderRadius: {
        card: "10px"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
