/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './demo.html',
    './starter-template.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Ensure Tailwind doesn't conflict with Vuetify
  corePlugins: {
    preflight: false,
  },
  // Important to ensure Tailwind classes take precedence when needed
  important: true,
};
