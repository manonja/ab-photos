import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ['Lexend', ...defaultTheme.fontFamily.sans],
        anton: ['Anton', 'sans-serif' ]
      },
      transitionProperty: {
        'opacity': 'opacity',
        'all': 'opacity, filter, transform',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
      transitionTimingFunction: {
        'out': 'cubic-bezier(0.0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'ease-out-cubic': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
      },
      blur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      scale: {
        '101': '1.01',
        '102': '1.02',
        '103': '1.03',
        '105': '1.05',
        '110': '1.10',
      },
    },
  },
  plugins: [],
};
export default config;
