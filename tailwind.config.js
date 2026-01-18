/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    fontFamily: {
      itim: ["Itim", "sans-serif"],
    },
    extend: {
      colors: {
        primary: {
          200: "#763091",
          100: "#8A60C5",
          300: "#5B23BB",
        },
        light: {
          100: "#1E2124",
          200: "#1E2124",
          background: "#FFFFFF"
        },
        dark: {
          100: "#D3D4D5",
          200: "#A1A3A7",
          800: "#292c30",
          background: "#1E2124"
        }
      }
    }
  },
  plugins: [],
  corePlugins: {
    backgroundOpacity: true,
  }
}