/** @type {import('tailwindcss').Config} */
import { nextui } from '@nextui-org/react';

const defaultTheme = require('tailwindcss/defaultTheme');

const darkMode = ['class'];
const content = [
  './src/**/*.{ts,tsx}',
  './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
];
const prefix = '';
const theme = {
  extend: {
    fontFamily: {
      sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
    },

    colors: {
      'text-primary': '#1B1B1B',
      'primary-color': '#7BDA08',
    },
  },
};
const plugins = [
  require('tailwindcss-animate'),
  nextui({
    themes: {
      light: {
        colors: {
          warning: '#FCC400',
          danger: '#FF2614',
          success: '#2FC32F',
        },
      },
    },
  }),
];
export { plugins, content, darkMode, prefix, theme };
