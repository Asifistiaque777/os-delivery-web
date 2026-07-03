import React, { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CATEGORIES, SUBCATEGORIES, getMenuAvailability } from "../utils/constants";

import ProductGrid from "../components/ProductGrid";
import ProductDrawer from "../components/ProductDrawer";

const ItemListPage = ({
  menuItems,
  addToCart,
  setPage,
  activeCategory,
  setActiveCategory,
  activeSubCategory,
  setActiveSubCategory,
  searchTerm,
  setSearchTerm,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  const banners = [
    { id: 1, text: "Exquisite Oriental", sub: "Authentic Asian fusion prepared by top chefs.", bgImage: "https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=1400&q=80", gradient: "from-black/90 via-black/40 to-transparent" },
    { id: 2, text: "Farm Fresh Produce", sub: "Organic vegetables and fruits delivered straight from the farm.", bgImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80", gradient: "from-green-950/90 via-black/40 to-transparent" },
    { id: 3, text: "Essential Healthcare", sub: "24/7 medicine delivery to your doorstep, when you need it most.", bgImage: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=1400&q=80", gradient: "from-blue-950/90 via-black/40 to-transparent" },
    { id: 4, text: "Gourmet Burgers", sub: "Handcrafted patties with artisanal cheese and secret sauces.", bgImage: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1400&q=80", gradient: "from-orange-950/90 via-black/40 to-transparent" },
    { id: 5, text: "Daily Grocery Pantry", sub: "Stock up on premium staples and everyday essentials.", bgImage: "https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=1400&q=80", gradient: "from-stone-900/95 via-black/30 to-transparent" },
    { id: 6, text: "Personal Care Kit", sub: "Luxury skincare and wellness products for your daily routine.", bgImage: "https://images.unsplash.com/photo-1576091160550-2173dad99901?auto=format&fit=crop&w=1400&q=80", gradient: "from-purple-950/90 via-black/40 to-transparent" },
    { id: 7, text: "Artisan Pizza Night", sub: "Wood-fired perfection with the freshest premium toppings.", bgImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1400&q=80", gradient: "from-red-950/80 via-black/40 to-transparent" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    if (!activeSubCategory) {
      const firstSub = SUBCATEGORIES[activeCategory]?.[0]?.name || "";
      setActiveSubCategory(firstSub);
    }
  }, [activeCategory, activeSubCategory, setActiveSubCategory]);

  const currentCategory = CATEGORIES.find((c) => c.name === activeCategory);
  const currentCategoryTitle = currentCategory?.title || "Menu";
  const availableSubCategories = SUBCATEGORIES[activeCategory] || [];

  const filteredItems = useMemo(() => {
    const lower = searchTerm.toLowerCase().trim();
    return menuItems
      .filter((item) => item.category === activeCategory)
      .filter((item) =>
        lower
          ? item.name.toLowerCase().includes(lower)
          : !activeSubCategory || item.subCategory === activeSubCategory
      );
  }, [menuItems, activeCategory, activeSubCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-20 px-3 pb-24 font-sans relative">

      {/* HERO BANNER */}
      <div className="max-w-6xl mx-auto mb-12 relative overflow-hidden h-64 md:h-80 shadow-2xl group">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out
              ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110 pointer-events-none"}`}
          >
            <img
              src={banner.bgImage}
              alt={banner.text}
              className={`w-full h-full object-cover transition-transform duration-[5000ms] ${index === currentSlide ? "scale-110" : "scale-100"}`}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} z-10`} />
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-10 md:px-16 text-white">
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={index === currentSlide ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1 bg-green-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                  Special Offer
                </span>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none mb-3">
                  {banner.text}
                </h2>
                <p className="text-white/80 text-sm md:text-xl font-bold max-w-md leading-snug">
                  {banner.sub}
                </p>
                <button className="mt-8 px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all shadow-xl">
                  Order Now ➔
                </button>
              </motion.div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-10 md:left-16 z-30 flex gap-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-500 ${i === currentSlide ? "w-16 bg-green-500" : "w-8 bg-white/30 hover:bg-white/60"}`}
            />
          ))}
        </div>
      </div>

      {/* TITLE + SEARCH */}
      <div className="max-w-4xl mx-auto mb-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            {currentCategoryTitle}
            <span className="text-green-500 not-italic">.</span>
          </h2>
          <button
            onClick={() => setPage("Home")}
            className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center hover:bg-green-500 transition-all duration-300 shadow-md active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>
        <div className="relative flex items-center bg-white border border-slate-200 shadow-lg overflow-hidden transition-all duration-300 focus-within:border-green-500 rounded-xl">
          <div className="pl-4 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search items..."
            className="w-full h-12 md:h-14 px-4 text-base font-bold text-slate-800 focus:outline-none bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="pr-1.5">
            <button className="bg-slate-900 text-white px-6 h-9 md:h-11 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-green-600 transition-all rounded-lg">
              Find
            </button>
          </div>
        </div>
      </div>

      {/* STICKY SUBCATEGORY TABS */}
      {availableSubCategories.length > 0 && !searchTerm && (
        <div className="sticky top-14 md:top-20 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-2 md:px-4">
            <div className="flex flex-nowrap md:flex-wrap items-center md:justify-center gap-2 md:gap-5 overflow-x-auto py-5 md:py-7 custom-scrollbar snap-x snap-mandatory">
              {availableSubCategories.map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => setActiveSubCategory(sub.name)}
                  className={`
                    relative flex flex-col items-center justify-center 
                    min-w-[90px] md:min-w-[130px] 
                    px-3 py-4 md:px-5 md:py-6 
                    rounded-[24px] transition-all duration-500 
                    border-2 snap-center group
                    ${activeSubCategory === sub.name
                      ? "bg-slate-950 border-green-500 shadow-[0_15px_30px_rgba(34,197,94,0.3)] -translate-y-1.5 scale-105 z-20"
                      : "bg-white border-slate-50 text-slate-400 hover:border-green-500/30"
                    }
                  `}
                >
                  <div className={`
                    text-2xl md:text-4xl mb-2 transition-all duration-500
                    ${activeSubCategory === sub.name
                      ? "scale-110 brightness-125 drop-shadow-[0_0_10px_rgba(34,197,94,1)] rotate-6"
                      : "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"
                    }
                  `}>
                    {sub.icon}
                  </div>
                  <span className={`
                    text-[9px] md:text-[13px] font-black uppercase tracking-wider leading-none text-center
                    ${activeSubCategory === sub.name ? "text-green-500" : "text-slate-700"}
                  `}>
                    {sub.title}
                  </span>
                  {activeSubCategory === sub.name && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_15px_#22c55e]"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT GRID — আলাদা component */}
      <ProductGrid
        filteredItems={filteredItems}
        addToCart={addToCart}
        onCardClick={setSelectedItem}
      />

      {/* PRODUCT DRAWER — আলাদা component */}
      <ProductDrawer
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        addToCart={addToCart}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        @media (max-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar { height: 5px; }
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 20px;
          margin-inline: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to right, #22c55e, #10b981);
          border-radius: 20px;
          border: 2px solid #f8fafc;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.4);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #16a34a;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #22c55e #f8fafc;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.05); }
        }
        .animate-slow-zoom { animation: slow-zoom 10s linear infinite alternate; }
      `}</style>
    </div>
  );
};

export default ItemListPage;