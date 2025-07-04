/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'crater-brown': '#4A403D',
        'zorba': '#A69A90',
        'bisque': '#FFF1C1',
        'golden-glow': '#FACF7D',
        'flamenco': '#EA804C',
        'burnt-umber': '#b5473a',
        'goblin': '#3E885B',
        'isabelline': '#F2F1EC',
      },
    },
    fontFamily: {
      'montserrat': ['Montserrat', 'sans-serif'],
    }
  },
  plugins: [],
}
