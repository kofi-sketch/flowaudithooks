import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // CRM Dark Theme Colors
        crm: {
          bg: {
            primary: '#1a1a1a',
            secondary: '#2a2a2a',
            card: '#2d2d2d',
            hover: '#3a3a3a',
          },
          border: {
            default: '#353535',
            accent: '#404040',
          },
          text: {
            primary: '#ffffff',
            secondary: '#a0a0a0',
            muted: '#6b6b6b',
          },
        },
        // Keep slate for backwards compatibility
        slate: {
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
      keyframes: {
        "slide-up": {
          from: {
            opacity: "0",
            transform: "translateY(10px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "scale-in": {
          from: {
            opacity: "0",
            transform: "scale(0.95)",
          },
          to: {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
      boxShadow: {
        "crm-sm": "0 2px 4px rgba(0, 0, 0, 0.3)",
        "crm-md": "0 2px 8px rgba(0, 0, 0, 0.3)",
        "crm-lg": "0 4px 16px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
