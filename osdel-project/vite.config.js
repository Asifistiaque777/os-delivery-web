import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    copyPublicDir: true, // 👈 public ফোল্ডারের ফাইলগুলো সরাসরি dist-এ কপি করবে
    chunkSizeWarningLimit: 1000, // 👈 ৫০০ KB ওয়ার্নিং মিটিয়ে ১০০০ KB করা হলো
    rollupOptions: {
      output: {
        // 🚀 বড় লাইব্রেরিগুলোকে আলাদা বান্ডেলে ভাগ করে লোডিং স্পিড বহুগুণ বাড়াবে
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'motion-vendor': ['framer-motion']
        }
      }
    }
  }
})