/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#e11d48",

          secondary: "#3D3B40",

          accent: "#0081b7",

          neutral: "#010101",

          "base-100": "#f7fafc",

          info: "#0098cf",

          success: "#00af8c",

          warning: "#ffc500",

          error: "#d90034",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
