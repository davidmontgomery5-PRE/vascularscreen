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
        brand: {
          navy: '#133258',
          'navy-dark': '#0B1F3A',
          green: '#7BB762',
          'green-dark': '#5C9447',
          sky: '#3DB4E0',
          'sky-dark': '#1E8FBE',
          'navy-tint': '#E8EDF5',
          'green-tint': '#EEF7E8',
          'sky-tint': '#E3F4FB',
        },
      },
    },
  },
  plugins: [],
};
