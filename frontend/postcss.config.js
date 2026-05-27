// ============================================
// FILE: frontend/postcss.config.js
// ============================================

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Processes Tailwind CSS directives (@tailwind base, etc.)
    tailwindcss: {},
    // Adds vendor prefixes (e.g., -webkit-, -ms-) for cross-browser support
    autoprefixer: {},
  },
};

export default config;
