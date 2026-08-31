/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        govblue: {
          950: '#050B18',
          900: '#0A1329',
          850: '#0F1D3D',
          800: '#162850',
          700: '#223C73',
          600: '#1E40AF',
          500: '#2563EB',
          400: '#3B82F6',
          300: '#60A5FA'
        },
        amberaccent: {
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        'glow-hero': 'radial-gradient(circle at 50% 30%, rgba(37, 99, 235, 0.15), transparent 70%)'
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.4)',
        'glow-orange': '0 0 25px -5px rgba(249, 115, 22, 0.4)'
      }
    },
  },
  plugins: [],
};
