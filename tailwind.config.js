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
        'burnt-umber': '#B5473A',
        'goblin': '#3E885B',
        'isabelline': '#F2F1EC',
        'heather-feather': '#252525',
        'grayish-cyan': '#92B4A7',
        'grayish-yellow': '#BDC4A7',
        'light-grayish-yellow': '#F3F9D2',
        'dark-grayish-red': '#93827F'
      },
      keyframes: {
        ripple: {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)' },
          '50%': { transform: 'translate(-50%, -50%) scale(.9)' }
        },
      },
      animation: {
        ripple: 'ripple 2s ease infinite',
      },
    },
    fontFamily: {
      'montserrat': ['Montserrat', 'sans-serif'],
    }
  },
  plugins: [],
}
