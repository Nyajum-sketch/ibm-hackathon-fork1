/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-cream': '#FBE4D8',
        'bg-cream-dark': '#F5DABF',
        'bg-base': '#190019',
        'bg-surface': '#2B124C',
        'bg-elevated': '#522B5B',
        'brand-dark': '#190019',
        'brand-purple': '#2B124C',
        'brand-plum': '#522B5B',
        'brand-mauve': '#854F6C',
        'brand-rose': '#DFB6B2',
        'brand-cream': '#FBE4D8',
        'accent-bordo': '#6C151E',
        'accent-forest': '#0F3D3A',
        'text-primary': '#FBE4D8',
        'text-secondary': '#DFB6B2',
        'text-muted': '#854F6C',
        'border-subtle': '#522B5B',
        'border-bold': '#DFB6B2',
        'success': '#0F3D3A',
        'warning': '#854F6C',
        'danger': '#6C151E',
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px #000000',
        'neo': '3px 3px 0px #000000',
        'neo-lg': '5px 5px 0px #000000',
        'neo-xl': '8px 8px 0px #000000',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Syne"', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'waveform': 'waveform 1.2s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        'waveform': {
          '0%, 100%': { transform: 'scaleY(0.2)' },
          '50%': { transform: 'scaleY(1)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
