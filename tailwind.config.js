/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/app/**/*.{js,ts,jsx,tsx}", "components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    backgroundColor: (theme) => ({
      ...theme("colors"),
      primary: "#1E1E1E",
      secondary: "#EBEBEB",
    }),
    textColor: (theme) => ({
      ...theme("colors"),
      primary: "#1E1E1E",
      secondary: "#EBEBEB",
      tertiary: "#A9A9A9",
      fourtary: "#7DF39D",
      "primary-light": "#EBEBEB",
      "secondary-light": "#171717",
      "teriary-light": "#606060",
    }),

    extend: {
      fontFamily: {
        custom: ["WixMadeForDisplay", "sans-serif"],
      },
    },
  },
  plugins: [],
};
