export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f5f2eb',
        ink: '#211d1a',
        wine: '#5d2635',
        moss: '#5f6b55',
        acid: '#d9f36a',
        line: '#ded9ce',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
