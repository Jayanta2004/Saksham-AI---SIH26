/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-obsidian": "#090D16",
        "surface-slate": "#0F172A",
        "surface": "#10131a",
        "surface-dim": "#10131a",
        "surface-bright": "#363941",
        "surface-container-lowest": "#0b0e15",
        "surface-container-low": "#191b23",
        "surface-container": "#1d2027",
        "surface-container-high": "#272a31",
        "surface-container-highest": "#32353c",
        "on-surface": "#e1e2ec",
        "on-surface-variant": "#c2c6d6",
        "glass-fill": "rgba(255, 255, 255, 0.04)",
        "glass-border": "rgba(255, 255, 255, 0.08)",
        "ai-cyan": "#06B6D4",
        "ai-purple": "#A855F7",
        "success-emerald": "#10B981",
        "warning-amber": "#F59E0B",
        "primary": "#2563EB",
        "primary-container": "#3B82F6",
        "secondary": "#7C3AED",
        "secondary-container": "#8B5CF6",
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
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        headline: ['Outfit', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-card': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01))',
        'glow-hero': 'radial-gradient(circle at 50% 30%, rgba(6, 182, 212, 0.15), transparent 70%)'
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)'
      }
    },
  },
  plugins: [],
};
