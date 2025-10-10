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
      // CAWA brand colors and GitHub-style palette
      colors: {
        'cawa': {
          'pink': '#ff0046',      // Primary brand color
          'dark': '#cc0038',      // Darker shade for hover
          'light': '#ff3366',     // Lighter shade for backgrounds
          'pale': '#ffe6ed',      // Very light for subtle backgrounds
        },
        'github': {
          'gray': {
            50: '#fafbfc',
            100: '#f6f8fa',
            200: '#e1e4e8',
            300: '#d1d5da',
            400: '#959da5',
            500: '#6a737d',
            600: '#586069',
            700: '#444d56',
            800: '#2f363d',
            900: '#24292e',
          }
        }
      },
    },
  },
  plugins: [],
}
