
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pearl: 'var(--pearl)',
        gold: 'var(--gold)',
        'dark-bg': 'var(--dark-bg)',
        'dark-surface': 'var(--dark-surface)',
        'warm-grey': 'var(--warm-grey)',
        'aether-blue': 'var(--aether-blue)',
        'aether-violet': 'var(--aether-violet)',
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
