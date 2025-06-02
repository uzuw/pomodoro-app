import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        spaceMono: ['var(--font-space-mono)', 'monospace'],
        vt323: ['var(--font-vt323)', 'monospace'],
        minecraft: ['"Minecraft"', 'sans-serif'],
      },
      colors: {
    lavender: "#e9d5ff",
    softPurple: "#c084fc",
    caféBrown: "#5e2a84",
  },
    },
  },
  plugins: [],
};

export default config;
