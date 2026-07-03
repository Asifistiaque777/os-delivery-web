import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SUBCATEGORIES, CATEGORIES } from "../utils/constants";
import { FaChevronLeft, FaHome } from "react-icons/fa";

import DiscountSection from "../components/DiscountSection";

const SubCategoryPage = ({
  activeCategory,
  setActiveSubCategory,
  setPage,
  menuItems,
  addToCart,
}) => {
  const [selectedMainSub, setSelectedMainSub] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const mainSubs = SUBCATEGORIES[activeCategory] || [];
  const currentCategoryData = CATEGORIES.find((c) => c.name === activeCategory);

  const banners = [
    {
      id: 1,
      text: "Exquisite Oriental",
      sub: "Experience the authentic essence of Asian fusion prepared by elite chefs.",
      bgImage: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=1400&q=80",
      gradient: "from-black/90 via-black/40 to-transparent",
    },
    {
      id: 2,
      text: "Farm Fresh Produce",
      sub: "Organic vegetables and hand-picked fruits delivered straight from the farm.",
      bgImage: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1400&q=80",
      gradient: "from-green-950/90 via-black/40 to-transparent",
    },
    {
      id: 3,
      text: "Essential Healthcare",
      sub: "24/7 emergency medicine delivery to your doorstep with priority care.",
      bgImage: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&w=1400&q=80",
      gradient: "from-blue-950/90 via-black/40 to-transparent",
    },
    {
      id: 4,
      text: "Gourmet Burgers",
      sub: "Flame-grilled wagyu beef patties layered with artisanal cheese and secret sauces.",
      bgImage: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1400&q=80",
      gradient: "from-orange-950/90 via-black/40 to-transparent",
    },
    {
      id: 5,
      text: "Pantry Essentials",
      sub: "Stock up your kitchen with premium staples and high-quality daily groceries.",
      bgImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80",
      gradient: "from-stone-900/95 via-black/30 to-transparent",
    },
    {
      id: 6,
      text: "Wellness & Care",
      sub: "Luxury personal care and hygiene products delivered for your daily routine.",
      bgImage: "https://images.unsplash.com/photo-1576091160550-2173dad99901?auto=format&fit=crop&w=1400&q=80",
      gradient: "from-purple-950/90 via-black/40 to-transparent",
    },
    {
      id: 7,
      text: "Artisan Pizza Night",
      sub: "Wood-fired crusts topped with the freshest Italian ingredients and herbs.",
      bgImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=80",
      gradient: "from-red-950/80 via-black/40 to-transparent",
    },
  ];

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((s) => (s + 1) % banners.length),
      5000
    );
    return () => clearInterval(timer);
  }, [banners.length]);

  const discountedProducts = useMemo(
    () =>
      (menuItems || []).filter(
        (item) => item.category === activeCategory && item.discount > 0
      ),
    [menuItems, activeCategory]
  );

  const displayItems = selectedMainSub ? selectedMainSub.nestedSubs : mainSubs;
  const currentTitle = selectedMainSub
    ? selectedMainSub.title
    : currentCategoryData?.title;

  return (
    <div className="min-h-screen bg-white pb-32 font-sans">

      {/* PREMIUM BANNER CAROUSEL */}
      <div className="max-w-7xl mx-auto mb-12 relative overflow-hidden h-64 md:h-96 shadow-2xl group">
        <AnimatePresence mode="wait">
          {banners.map(
            (banner, index) =>
              index === currentSlide && (
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <img
                    src={banner.bgImage}
                    className="w-full h-full object-cover"
                    alt="Banner"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} z-10`}
                  />
                  <div className="absolute inset-0 z-20 flex flex-col justify-center px-10 md:px-20 text-white">
                    <motion.span
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="inline-block px-4 py-1 bg-green-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6 w-fit"
                    >
                      Special Offer
                    </motion.span>
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-none mb-4">
                      {banner.text}
                    </h2>
                    <p className="text-white/80 text-sm md:text-xl font-bold max-w-lg leading-relaxed">
                      {banner.sub}
                    </p>
                  </div>
                </motion.div>
              )
          )}
        </AnimatePresence>

        <div className="absolute bottom-8 left-10 md:left-20 z-30 flex gap-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1 transition-all duration-500 ${
                i === currentSlide ? "w-16 bg-green-500" : "w-8 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* TITLE SECTION */}
        <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-6">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
            {currentTitle}
            <span className="text-green-500 not-italic">.</span>
          </h2>
          <button
            onClick={() => setPage("Home")}
            className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center hover:bg-green-500 transition-all shadow-lg active:scale-90 rounded-full"
          >
            <FaHome size={22} />
          </button>
        </div>

        {/* SUB CATEGORY CARDS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 mb-24 px-2 md:px-0">
          {displayItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (!selectedMainSub && item.nestedSubs?.length > 0)
                  setSelectedMainSub(item);
                else {
                  setActiveSubCategory(item.name);
                  setPage("ItemList");
                }
              }}
              className="relative group cursor-pointer perspective-1000"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-[30px] md:rounded-[45px] blur opacity-10 group-hover:opacity-50 transition duration-500 animate-tilt" />

              <div className="relative bg-white/90 backdrop-blur-xl border border-white/50 p-6 md:p-10 flex flex-col items-center justify-center rounded-[30px] md:rounded-[40px] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden h-full">
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-green-100/40 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-emerald-100/40 rounded-full blur-2xl" />

                <div className="relative mb-4 md:mb-8">
                  <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-slate-50 to-white rounded-[25px] md:rounded-[35px] shadow-[6px_6px_12px_#d1d1d1,-6px_-6px_12px_#ffffff] flex items-center justify-center group-hover:bg-green-500 transition-all duration-500 overflow-hidden">
                    <span className="text-4xl md:text-6xl z-10 filter drop-shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                      {item.icon}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>

                <div className="text-center relative z-10">
                  <h3 className="text-[10px] md:text-sm font-black text-slate-900 uppercase tracking-[0.15em] md:tracking-[0.3em] group-hover:text-green-600 transition-colors duration-300 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="hidden md:block text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-widest opacity-60">
                    Premium Selection
                  </p>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50 overflow-hidden">
                  <motion.div className="h-full bg-green-500 w-0 group-hover:w-full transition-all duration-700 ease-in-out" />
                </div>

                <div className="absolute top-4 right-4 md:top-6 md:right-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-[10px] md:text-xs">➔</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DISCOUNT SECTION — আলাদা component */}
        <DiscountSection
          discountedProducts={discountedProducts}
          addToCart={addToCart}
        />

        {/* BACK NAVIGATION */}
        {selectedMainSub && (
          <div className="flex justify-center mt-20">
            <button
              className="px-12 py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.4em] hover:bg-green-500 transition-all shadow-2xl flex items-center gap-4 rounded-full"
              onClick={() => setSelectedMainSub(null)}
            >
              <FaChevronLeft /> Back to {currentCategoryData?.title}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes tilt {
          0%, 100% { transform: rotate(-0.5deg); }
          50% { transform: rotate(0.5deg); }
        }
        .animate-tilt { animation: tilt 3s linear infinite; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default SubCategoryPage;