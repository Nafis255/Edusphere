/** @type {import('tailwindcss').Config} */
const config = {
  // 2. Ini memberitahu Tailwind di mana file Anda
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  // 3. Sisa konfigurasi
  theme: {
    extend: {
      // (Kita bisa tambahkan ekstensi tema di sini nanti)
    },
  },
  plugins: [],
};

export default config;