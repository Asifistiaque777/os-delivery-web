import React, { useState, useEffect } from "react";
import { MOTTO } from "../utils/constants";

/* =====================================================
    🎬 HERO BANNER — Auto-sliding background only
    Search is handled separately in HomePage
===================================================== */
const HeroBanner = ({ searchTerm, children }) => {
  const heroSlides = [
    {
      title: "Fresh & Fast Delivery 🌿",
      img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1400",
    },
    {
      title: "Your Cravings, Delivered! 🍔",
      img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1400",
    },
    {
      title: "Groceries Made Easy! 🛒",
      img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1400",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const itv = setInterval(
      () => setCurrentSlide((s) => (s + 1) % heroSlides.length),
      5000
    );
    return () => clearInterval(itv);
  }, [heroSlides.length]);

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-visible bg-black">
      {/* Background Slides */}
      {heroSlides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === currentSlide ? "opacity-60" : "opacity-0"
          }`}
        >
          <img
            src={slide.img}
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
            alt="Hero"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />

      {/* Content */}
      <div className="relative z-[100] h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-8xl font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
          {searchTerm ? "Finding Best Deals..." : heroSlides[currentSlide].title}
        </h1>
        <p className="text-white/90 text-lg md:text-xl font-medium mb-10 italic">
          "{MOTTO}"
        </p>
        {/* Search bar injected from parent via children */}
        {children}
      </div>

      <style jsx>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slow-zoom 10s linear infinite alternate;
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;