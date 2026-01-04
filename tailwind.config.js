
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pearl: '#f8f5ec',
        gold: '#ffd700',
        'dark-bg': '#020202',
        'dark-surface': '#080808',
        'warm-grey': '#b6b0a0',
        'aether-blue': '#6d28d9',
        'aether-violet': '#4c1d95',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        minerva: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
