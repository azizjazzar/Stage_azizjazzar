/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-dark': '#050817',
        'custom-purple': '#8f5ffc',
        'custom-gray': '#828096',
        'custom-text-gray': '#a7a5bb',
        'custom-card-gray': "#383e56",
        'custom-header': "#151030", 
        'custom-text': "#7d7898", 
        'custom-new': "#202938",
        'custom-low': "#151030", 
        'custom-theni': "#110d24",
      },
    },
  },
  plugins: [],
};
