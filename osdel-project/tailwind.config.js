import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundSize: {
        'gradient-large': '300% 300%',
      },
      animation: {
        'gradient-move': 'gradientShift 12s ease infinite',
      },
      keyframes: {
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  // ⬇️ plugins: [require('daisyui')] এই সিনট্যাক্সটি ঠিক আছে
  plugins: [require('daisyui')], 
  daisyui: {
    themes: [
      {
        osdelAnimatedDark: {
          "primary": "#10b981",
          "secondary": "#a855f7",
          "accent": "#f43f5e",
          "neutral": "#1f2937",
          "base-100": "#111827", 
          "info": "#3abff8",
          "success": "#36d399",
          
          // ⬇️ ফিক্স: warning কালারটিকে সাদা করা হলো (#FFFFFF)
          "warning": "#FFFFFF", 
          // ⬇️ ফিক্স: warning এর ওপরের টেক্সট কালো করা হলো (#000000)
          "warning-content": "#000000", 
          
          "error": "#f87272",
        },
      },
    ],
    // ⬇️ নিশ্চিত করুন: darkTheme এর মান অবশ্যই কাস্টম থিমের নামের সাথে মিলতে হবে।
    darkTheme: "osdelAnimatedDark",
  },
}