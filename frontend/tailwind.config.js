// frontend/tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#0b0b0b',
        'muted': '#111316',
        'accent': '#D7263D',
        'accent-2': '#FFC857',
        'soft': '#94A3B8'
      },
      fontFamily: {
        heading: ['"Bebas Neue"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 8px 30px rgba(215,38,61,0.12)'
      }
    }
  },
  plugins: [],
}