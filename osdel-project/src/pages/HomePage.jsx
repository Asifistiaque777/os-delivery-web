import React, { useMemo } from "react";
import { CATEGORIES } from "../utils/constants";
import { motion } from "framer-motion";

import RecommendationCard from "../components/RecommendationCard";
import ModernShopCard from "../components/ModernShopCard";
import SearchOverlay from "../components/SearchOverlay";
import HeroBanner from "../components/HeroBanner";
import PromoBanner, { BottomBanner } from "../components/PromoBanner";

/* =====================================================
    🚀 MAIN HOMEPAGE

    Layout order:
    1. HeroBanner  ← hero image slider + motto + Search inside
    2. Feature Cards  ← Rocket Delivery, Fresh Guaranteed, Support Local
    3. PromoBanner  ← continuous scrolling promo ticker
    4. Recommended Items
    5. Shop Sections (Oriental / Restaurant / Emergency)
    6. BottomBanner
===================================================== */
const HomePage = ({
  setActiveCategory,
  setPage,
  menuItems = [],
  addToCart,
  searchTerm = "",
  setSearchTerm,
}) => {
  const sections = useMemo(
    () => ({
      oriental: CATEGORIES.filter((c) => c.type === "oriental"),
      restaurant: CATEGORIES.filter((c) => c.type === "restaurant"),
      emergency: CATEGORIES.filter((c) => c.type === "emergency"),
    }),
    []
  );

  const recommendedItems = useMemo(
    () => menuItems.filter((item) => item.isRecommended && !item.isStockOut),
    [menuItems]
  );

  const searchResults = useMemo(() => {
    const query = searchTerm?.trim().toLowerCase();
    if (!query) return [];
    return menuItems.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
    );
  }, [menuItems, searchTerm]);

  return (
    <div className="min-h-screen bg-white text-gray-800 pb-32">

      {/* ① HERO BANNER — search bar is passed as children so it sits inside the hero */}
      <HeroBanner searchTerm={searchTerm}>
        <SearchOverlay
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchResults={searchResults}
          addToCart={addToCart}
        />
      </HeroBanner>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ② FEATURE CARDS — Rocket Delivery, Fresh Guaranteed, Support Local */}
        {!searchTerm && (
          <section className="max-w-6xl mx-auto px-6 -mt-12 relative z-30 mb-20 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4"
            >
              {/* Rocket Delivery */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative bg-white rounded-[32px] p-6 shadow-xl shadow-gray-100/50 border border-gray-100 flex items-center gap-5 overflow-hidden transition-all duration-300 cursor-pointer"
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-50 rounded-full blur-2xl group-hover:bg-green-100 transition-colors duration-500" />
                <div className="relative z-10 w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:bg-green-500 transition-all duration-500 shadow-lg shadow-gray-200">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round" />
                    <path opacity="0.3" d="M5 13L13 3V11H21L13 21V13H5Z" fill="#22C55E" className="group-hover:fill-white" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter leading-tight">
                    Rocket <span className="text-green-500 italic">Delivery</span>
                  </h3>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">
                    Cashback over <span className="text-gray-900">৳999 orders</span>
                  </p>
                </div>
              </motion.div>

              {/* Fresh Guaranteed */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ delay: 0.1 }}
                className="group relative bg-white rounded-[32px] p-6 shadow-xl shadow-gray-100/50 border border-gray-100 flex items-center gap-5 overflow-hidden transition-all duration-300 cursor-pointer"
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-yellow-50 rounded-full blur-2xl group-hover:bg-yellow-100 transition-colors duration-500" />
                <div className="relative z-10 w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:bg-yellow-400 transition-all duration-500 shadow-lg shadow-gray-200">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
                    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path opacity="0.4" d="M9 12L11 14L15 10" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter leading-tight">
                    Fresh <span className="text-yellow-600 italic">Guaranteed</span>
                  </h3>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">
                    Quality Assured Everytime
                  </p>
                </div>
              </motion.div>

              {/* Support Local */}
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ delay: 0.2 }}
                className="group relative bg-white rounded-[32px] p-6 shadow-xl shadow-gray-100/50 border border-gray-100 flex items-center gap-5 overflow-hidden transition-all duration-300 cursor-pointer"
              >
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-red-50 rounded-full blur-2xl group-hover:bg-red-100 transition-colors duration-500" />
                <div className="relative z-10 w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:bg-red-500 transition-all duration-500 shadow-lg shadow-gray-200">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none">
                    <path d="M3 9L12 3L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path opacity="0.4" d="M9 21V12H15V21" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <h3 className="font-black text-gray-900 text-sm uppercase tracking-tighter leading-tight">
                    Support <span className="text-red-500 italic">Local</span>
                  </h3>
                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">
                    Bashundhara R/A
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </section>
        )}
      </div>

      {/* ③ PROMO TICKER — full width, outside max-w container */}
      {!searchTerm && <PromoBanner />}

      {/* REST OF CONTENT */}
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {!searchTerm && (
          <>
            {/* ④ Recommended Items */}
            {recommendedItems.length > 0 && (
              <section className="mb-24 mt-4">
                <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tighter uppercase">
                  🌟 Top Picks For You
                </h2>
                <div
                  className="flex overflow-x-auto gap-6 pb-4 custom-scrollbar"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "#22c55e #f1f5f9" }}
                >
                  {recommendedItems.map((item) => (
                    <RecommendationCard key={item.id} item={item} addToCart={addToCart} />
                  ))}
                </div>
              </section>
            )}

            {/* ⑤ SHOP SECTIONS */}
            <div className="space-y-32">

              {/* Oriental Street */}
              <section className="mb-16 md:mb-24">
                <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-6 md:mb-10 tracking-tighter border-l-8 border-green-500 pl-4 md:pl-6 uppercase">
                  🍜 Oriental Street Special
                </h2>
                <div
                  className="grid grid-rows-2 grid-flow-col gap-3 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory custom-scrollbar"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "#22c55e #f1f5f9" }}
                >
                  {sections.oriental.map((cat) => (
                    <ModernShopCard
                      key={cat.name}
                      category={cat}
                      onSelect={setActiveCategory}
                      onNavigate={setPage}
                    />
                  ))}
                </div>
              </section>

              {/* Popular Restaurants */}
              <section className="mb-16 md:mb-24">
                <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-6 md:mb-10 tracking-tighter border-l-8 border-orange-500 pl-4 md:pl-6 uppercase">
                  🍽️ Popular Restaurant
                </h2>
                <div
                  className="grid grid-rows-2 grid-flow-col gap-3 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory custom-scrollbar"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "#f97316 #fff7ed" }}
                >
                  {sections.restaurant.map((cat) => (
                    <ModernShopCard
                      key={cat.name}
                      category={cat}
                      onSelect={setActiveCategory}
                      onNavigate={setPage}
                    />
                  ))}
                </div>
              </section>

              {/* Emergency Supplies */}
              <section className="mb-16 md:mb-24">
                <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-6 md:mb-10 tracking-tighter border-l-8 border-blue-500 pl-4 md:pl-6 uppercase">
                  🛒 Emergency Supplies
                </h2>
                <div
                  className="grid grid-rows-2 grid-flow-col gap-3 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory custom-scrollbar"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "#3b82f6 #eff6ff" }}
                >
                  {sections.emergency.map((cat) => (
                    <ModernShopCard
                      key={cat.name}
                      category={cat}
                      onSelect={setActiveCategory}
                      onNavigate={setPage}
                    />
                  ))}
                </div>
              </section>

              {/* ⑥ BOTTOM DECORATIVE BANNER */}
              <BottomBanner />

            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { border-radius: 99px; }
      `}</style>
    </div>
  );
};

export default HomePage;