module.exports = {
  content: ["./src/**/*.{html,js,tsx}",
 
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
