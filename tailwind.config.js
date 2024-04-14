/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["public/*.html"],
  theme: {
    extend: {},
  },
  plugins: [],
  variants: {
    extend: {
      display: ['group-hover'], // Enable group-hover for display property
    },
  },
}

