/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/app/**/*.{js,ts,jsx,tsx}", "components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    backgroundColor: (theme) => ({
      ...theme("colors"),
      primary: "#171717",
      secondary: "#EBEBEB",
      navprimary: "#171717",
      navsecondary: "#EBEBEB",
      fourtary: "#7DF39D",
    }),
    textColor: (theme) => ({
      ...theme("colors"),
      primary: "#171717",
      secondary: "#EBEBEB",
      tertiary: "#A9A9A9",
      fourtary: "#7DF39D",
      fiftary: "#606060",
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
