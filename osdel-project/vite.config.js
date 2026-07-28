import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    copyPublicDir: true, // 👈 এটি নিশ্চিত করবে public ফোল্ডারের সাইলগুলো dist-এ কপি হবে
  },
})