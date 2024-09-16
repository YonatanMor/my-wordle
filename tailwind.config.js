/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        rotate: "spin 0.5s linear forwards",
      },
      keyframes: {
        spin: {
          from: { transform: "rotateX(0deg)" },
          to: { transform: "rotateX(180deg) scaleY(-1)" },
        },
      },
    },
  },
  plugins: [],
};
