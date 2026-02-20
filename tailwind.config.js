/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        'bg-elevated': 'var(--color-bg-elevated)',
        'bg-card': 'var(--color-bg-card)',
        surface: 'var(--color-surface)',
        border: 'var(--color-border)',
        'border-hover': 'var(--color-border-hover)',
        'text-main': 'var(--color-text-main)',
        'text-muted': 'var(--color-text-muted)',
        'text-dim': 'var(--color-text-dim)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'off-white': 'var(--color-off-white)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
