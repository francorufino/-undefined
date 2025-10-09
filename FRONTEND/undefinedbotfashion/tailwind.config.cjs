/**@type {import('tailwindcss').Config}*/
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        myBlack: "#012326",
        myGreen: "#05f2db", 
        myPink: "#f205cb",
        myWhite: "#f7f7f7",
        myDarkerGreen: "#025373",
        myDarkerPink: "#d9048e",
      },
      backgroundImage: (theme) => ({
        "gradient-greenpink": "linear-gradient(90deg, #05f2db 0%, #f205cb 100%)",
        "mobile-home": "url('./assests/HomePageGraphic.png)"
      }),
      fontFamily: {
        bodonimoda: ["Bodoni Moda", "serif"], 
        monserrat: ["Montserrat", "sans-serif"], 
        bitcount: ["Bitcount Prop Single Ink", "sans-serif"],
      },
      content: {
        evolvetext: "url('./assets/Evolvetext.png')",
        abstractwaves: "url('./assets/AbstractWaves.png')",
        sparkes: "url('./assets/Sparkes.png')",
        circles: "url('./assets/Circles.png')",
      },
      screens: {
        xs: "480px",
        sm: "768px",
        md: "1060px",
      },
      boxShadow: {
        custom: "0 4px 6px rgba(0, 0, 0, 0.1)", 
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};