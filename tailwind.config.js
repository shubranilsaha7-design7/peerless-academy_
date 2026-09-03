/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: { keyframes: { shake: { '0%, 100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-10px)' }, '75%': { transform: 'translateX(10px)' } } }, animation: { shake: 'shake 0.4s ease-in-out' }, colors: { obsidian: '#090D16' },},
  },
  plugins: [],
};
