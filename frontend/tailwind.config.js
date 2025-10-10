/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './public/index.html',
    './src/**/*.{js,ts,jsx,tsx,html}',
  ],
  theme: {
    extend: {
      // Mobile-first breakpoints optimized for climbing competition app
      // Per spec: 320px-768px mobile screens
      screens: {
        'xs': '320px',  // Extra small phones
        'sm': '480px',  // Small phones
        'md': '640px',  // Medium phones / small tablets
        'lg': '768px',  // Large phones / tablets
        'xl': '1024px', // Desktop (admin interface)
      },
      // Competition-specific color palette
      colors: {
        // Keep Tailwind defaults but can extend here
      },
    },
  },
  plugins: [],
}
