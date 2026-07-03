import React, { useMemo } from "react";
import { motion } from "framer-motion";

/* =====================================================
    📢 PROMO TICKER — Continuous auto-scrolling banners
===================================================== */
const PromoBanner = () => {
  const discountBanners = useMemo(
    () => [
      {
        id: 1,
        title: "Flash Sale! ⚡",
        subtitle: "Up to 50% OFF on Gourmet Foods!",
        tag: "RESTAURANT",
        bgImage:
          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
        overlay: "from-black/90 via-black/40 to-transparent",
      },
      {
        id: 2,
        title: "Fresh Groceries 🎉",
        subtitle: "Daily Essentials at Your Doorstep",
        tag: "GROCERY",
        bgImage:
          "https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=1200&q=80",
        overlay: "from-green-950/90 via-green-900/40 to-transparent",
      },
      {
        id: 3,
        title: "Health Care 💊",
        subtitle: "Instant Medicine Delivery 24/7",
        tag: "PHARMACY",
        bgImage:
          "https://images.unsplash.com/photo-1576091160550-2173dad99901?auto=format&fit=crop&w=1200&q=80",
        overlay: "from-blue-950/90 via-blue-900/40 to-transparent",
      },
      {
        id: 4,
        title: "Late Night Craving? 🌙",
        subtitle: "Open till 4 AM. Warm food delivered fast!",
        tag: "NIGHT OWL",
        bgImage:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
        overlay: "from-purple-950/95 via-indigo-900/50 to-transparent",
      },
    ],
    []
  );

  return (
    <section className="relative w-full overflow-hidden py-10">
      <motion.div
        className="flex gap-8 px-6"
        animate={{ x: [0, -1500] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        style={{ width: "max-content" }}
      >
        {[...discountBanners, ...discountBanners].map((banner, index) => (
          <div
            key={index}
            className="relative min-w-[340px] md:min-w-[500px] h-64 overflow-hidden shadow-2xl group cursor-pointer"
          >
            <img
              src={banner.bgImage}
              alt={banner.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-r ${banner.overlay} z-10`}
            />
            <div className="relative z-20 h-full p-10 flex flex-col justify-center items-start text-white">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black mb-4 uppercase">
                {banner.tag}
              </span>
              <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight mb-2">
                {banner.title}
              </h2>
              <p className="text-sm opacity-80">{banner.subtitle}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

/* =====================================================
    🖼️ BOTTOM DECORATIVE BANNER
===================================================== */
export const BottomBanner = () => (
  <div className="relative h-80 flex flex-col items-center justify-center overflow-hidden shadow-2xl mb-20 group">
    <img
      src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80"
      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
      alt="Footer Banner"
    />
    <div className="absolute inset-0 bg-black/60 z-10" />
    <div className="relative z-20 text-center text-white px-6">
      <h2 className="text-5xl md:text-7xl font-black italic mb-3 uppercase tracking-tighter">
        Cooking up <span className="text-yellow-500">happiness!</span>
      </h2>
      <p className="text-xl font-bold opacity-80">
        Delicious meals, right at your doorstep.
      </p>
    </div>
  </div>
);

export default PromoBanner;