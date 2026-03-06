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
        primary: {
          light: '#6366f1',
          dark: '#818cf8',
        },
        background: {
          light: '#ffffff',
          dark: '#0f172a',
        },
        surface: {
          light: '#f8fafc',
          dark: '#1e293b',
        },
        card: {
          light: '#ffffff',
          dark: '#334155',
        },
        text: {
          primary: {
            light: '#0f172a',
            dark: '#f1f5f9',
          },
          secondary: {
            light: '#64748b',
            dark: '#94a3b8',
          },
        },
        border: {
          light: '#e2e8f0',
          dark: '#475569',
        },
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [],
}
