/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
