/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand': '#00a9e0', // Màu xanh Hạo yêu cầu
      },
      borderRadius: {
        'ws-outer': '10px',
        'ws-card': '7px',
        'ws-input': '4px',
        'ws-small': '2px',
      }
    },
  },
  plugins: [],
}