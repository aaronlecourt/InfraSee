// /** @type {import('tailwindcss').Config} */
// const plugin = require('tailwindcss/plugin');

// module.exports = {
//   darkMode: ["class"],
//   content: [
//     './pages/**/*.{js,jsx}',
//     './components/**/*.{js,jsx}',
//     './app/**/*.{js,jsx}',
//     './src/**/*.{js,jsx}',
//   ],
//   theme: {
//     fontFamily: {
//       sans: ['Inter', 'sans-serif']
//     },
//     fontSize: {
//       xs: ['0.8rem', { lineHeight: '1rem', letterSpacing: '-0.01em', fontWeight: '700' }],
//       sm: ['0.87rem', { lineHeight: '1rem', letterSpacing: '-0.01em', fontWeight: '500' }],
//       base: ['1rem', { lineHeight: '1.6rem', letterSpacing: '-0.02em', fontWeight: '500' }],
//       md: ['1.2rem', { lineHeight: '1.6rem', letterSpacing: '-0.02em', fontWeight: '600' }],
//       xl: ['1.5rem', { lineHeight: '1.2rem', letterSpacing: '-0.01em', fontWeight: '800' }],
//       lg: ['1.205rem', { lineHeight: '1.25rem', letterSpacing: '-0.02em', fontWeight: '600' }],
//       '2xl': ['1.7rem', { lineHeight: '2rem', letterSpacing: '-0.02em', fontWeight: '700' }],
//       '3xl': ['1.8rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em', fontWeight: '700' }],
//       '4xl': ['2rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em', fontWeight: '700' }],
//       '5xl': ['2.2rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em', fontWeight: '700' }],
//       '6xl': ['2.5rem', { lineHeight: '2.75rem', letterSpacing: '-0.04em', fontWeight: '700' }],
//     },
//     container: {
//       center: true,
//       padding: "2rem",
//       screens: {
//         "2xl": "1400px",
//       },
//     },
//     extend: {
//       colors: {
//         border: "hsl(var(--border))",
//         input: "hsl(var(--input))",
//         ring: "hsl(var(--ring))",
//         background: "hsl(var(--background))",
//         foreground: "hsl(var(--foreground))",
//         primary: {
//           DEFAULT: "hsl(var(--primary))",
//           foreground: "hsl(var(--primary-foreground))",
//         },
//         secondary: {
//           DEFAULT: "hsl(var(--secondary))",
//           foreground: "hsl(var(--secondary-foreground))",
//         },
//         destructive: {
//           DEFAULT: "hsl(var(--destructive))",
//           foreground: "hsl(var(--destructive-foreground))",
//         },
//         muted: {
//           DEFAULT: "hsl(var(--muted))",
//           foreground: "hsl(var(--muted-foreground))",
//         },
//         accent: {
//           DEFAULT: "hsl(var(--accent))",
//           foreground: "hsl(var(--accent-foreground))",
//         },
//         popover: {
//           DEFAULT: "hsl(var(--popover))",
//           foreground: "hsl(var(--popover-foreground))",
//         },
//         card: {
//           DEFAULT: "hsl(var(--card))",
//           foreground: "hsl(var(--card-foreground))",
//         },
//       },
//       borderRadius: {
//         lg: "var(--radius)",
//         md: "calc(var(--radius) - 2px)",
//         sm: "calc(var(--radius) - 4px)",
//       },
//       keyframes: {
//         "caret-blink": {
//           "0%,70%,100%": { opacity: "1" },
//           "20%,50%": { opacity: "0" },
//         },
//         "accordion-down": {
//           from: { height: "0" },
//           to: { height: "var(--radix-accordion-content-height)" },
//         },
//         "accordion-up": {
//           from: { height: "var(--radix-accordion-content-height)" },
//           to: { height: "0" },
//         },
//       },
//       animation: {
//         "caret-blink": "caret-blink 1.25s ease-out infinite",
//         "accordion-down": "accordion-down 0.2s ease-out",
//         "accordion-up": "accordion-up 0.2s ease-out",
//       },
//     },
//   },
//   plugins: [
//     require("tailwindcss-animate"),
//   ],
// }
// tailwind.config.js
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    fontSize: {
      xs: ['0.8rem', { lineHeight: '1rem', letterSpacing: '-0.01em', fontWeight: '700' }],
      sm: ['0.87rem', { lineHeight: '1rem', letterSpacing: '-0.01em', fontWeight: '500' }],
      base: ['1rem', { lineHeight: '1.6rem', letterSpacing: '-0.02em', fontWeight: '500' }],
      md: ['1.2rem', { lineHeight: '1.6rem', letterSpacing: '-0.02em', fontWeight: '600' }],
      xl: ['1.5rem', { lineHeight: '1.2rem', letterSpacing: '-0.01em', fontWeight: '800' }],
      lg: ['1.205rem', { lineHeight: '1.25rem', letterSpacing: '-0.02em', fontWeight: '600' }],
      '2xl': ['1.7rem', { lineHeight: '2rem', letterSpacing: '-0.02em', fontWeight: '700' }],
      '3xl': ['1.8rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em', fontWeight: '700' }],
      '4xl': ['2rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em', fontWeight: '700' }],
      '5xl': ['2.2rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em', fontWeight: '700' }],
      '6xl': ['2.5rem', { lineHeight: '2.75rem', letterSpacing: '-0.04em', fontWeight: '700' }],
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};
