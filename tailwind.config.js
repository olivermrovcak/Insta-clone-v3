module.exports = {
  content: ["./src/**/*.{html,js,tsx,jsx}",
 
],
  theme: {
    extend: {
     
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide")
  ],
}
