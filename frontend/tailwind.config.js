/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          yellow: '#FFE600',
          pink: '#FF3388',
          cyan: '#00F0FF',
          purple: '#7B2CBF',
          orange: '#FF6B35',
          lime: '#CCFF00',
          blue: '#2563EB',
          bg: '#FAF7EE',
          dark: '#121212',
          card: '#FFFFFF',
          gray: '#F0EFE9',
          muted: '#525252',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Syne"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Courier Prime"', 'monospace'],
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px #121212',
        'retro-sm': '2px 2px 0px 0px #121212',
        'retro-lg': '6px 6px 0px 0px #121212',
        'retro-xl': '8px 8px 0px 0px #121212',
        'retro-hover': '2px 2px 0px 0px #121212',
        'retro-pink': '4px 4px 0px 0px #FF3388',
        'retro-cyan': '4px 4px 0px 0px #00F0FF',
        'retro-yellow': '4px 4px 0px 0px #FFE600',
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 8px rgba(255, 51, 136, 0.8))' },
          '50%': { opacity: 0.7, filter: 'drop-shadow(0 0 2px rgba(255, 51, 136, 0.3))' },
        }
      }
    },
  },
  plugins: [],
}
