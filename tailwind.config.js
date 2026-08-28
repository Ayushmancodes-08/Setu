/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#003527",
          dark: "#002117",
          container: "#064e3b",
          light: "#2b6954",
          fixed: "#b0f0d6",
          dim: "#95d3ba",
        },
        secondary: {
          DEFAULT: "#416656",
          container: "#c3ecd7",
          fixed: "#c3ecd7",
          dim: "#a8cfbc",
          dark: "#294e3f",
        },
        tertiary: {
          DEFAULT: "#442800",
          container: "#623c00",
          fixed: "#ffddb8",
          dim: "#ffb95f",
          accent: "#f69f0d",
        },
        emerald: {
          accent: "#10b981",
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        surface: {
          DEFAULT: "#fbf8ff",
          bright: "#fbf8ff",
          dim: "#dad9e3",
          low: "#f4f2fd",
          container: "#eeedf7",
          high: "#e8e7f1",
          highest: "#e3e1ec",
          lowest: "#ffffff",
          inverse: "#2f3038",
        },
        neutral: {
          "warm-white": "#fafaf9",
          "off-white": "#f5f5f4",
          "charcoal": "#1e293b",
          "slate": "#475569",
          "outline": "#707974",
          "outline-variant": "#bfc9c3",
          "on-surface": "#1a1b22",
          "on-surface-variant": "#404944",
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
          dark: "#93000a",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'ambient': '0 10px 30px -5px rgba(30, 41, 59, 0.05), 0 4px 6px -2px rgba(30, 41, 59, 0.02)',
        'ambient-lg': '0 20px 40px -10px rgba(0, 53, 39, 0.08), 0 8px 16px -4px rgba(0, 53, 39, 0.04)',
        'glow': '0 0 25px rgba(16, 185, 129, 0.25)',
        'glow-teal': '0 0 30px rgba(0, 53, 39, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
