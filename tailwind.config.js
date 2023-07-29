/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/app/**/*.{js,ts,jsx,tsx}","components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    backgroundColor: theme => ({
      ...theme('colors'),
      'primary': '#1E1E1E',
      'secondary': '#EBEBEB'
    }),
    textColor: theme =>({
      ...theme('colors'),
      'primary': '#1E1E1E',
      'secondary': '#EBEBEB',
      'tertiary': '#A9A9A9'
    }),

    extend: {
      fontFamily:{
        custom:['WixMadeForDisplay', 'sans']
      },
    
    },
  },
  plugins: [],
  
}
