import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import scrollbar from 'tailwind-scrollbar';

export default defineConfig({
  plugins: [
    tailwindcss(),
    scrollbar(),
  ],
})