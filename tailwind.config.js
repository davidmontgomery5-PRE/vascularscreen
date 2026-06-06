/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        verdict: {
          green: '#15803d',
          yellow: '#b45309',
          red: '#b91c1c',
        },
      },
    },
  },
  plugins: [],
};
