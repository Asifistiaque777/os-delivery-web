import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecommendationCard from "./RecommendationCard";

/* =====================================================
    🔍 SEARCH OVERLAY
===================================================== */
const SearchOverlay = ({ searchTerm, setSearchTerm, searchResults, addToCart }) => {
  return (
    <div className="w-full max-w-3xl relative group px-2 md:px-0">
      {/* Glow Ring */}
      <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-[28px] blur opacity-25 group-hover:opacity-50 transition duration-1000" />

      {/* Search Input Bar */}
      <div className="relative flex items-center bg-white rounded-[24px] shadow-2xl overflow-hidden border border-gray-100 z-[110]">
        <div className="pl-6 md:pl-8 text-gray-400 group-focus-within:text-green-500 transition-colors duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 md:h-7 md:w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex items-center flex-1">
          <input
            type="text"
            placeholder="Hungry? Search for your favorites..."
            className="w-full h-16 md:h-20 px-4 md:px-6 text-lg md:text-xl font-bold text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mr-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="pr-3 md:pr-4">
          <button className="bg-gray-900 text-white px-6 py-3 md:py-4 rounded-[20px] font-black text-xs md:text-sm uppercase tracking-widest hover:bg-green-500 transition-all active:scale-95">
            Search
          </button>
        </div>
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {searchTerm.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-[110%] left-0 right-0 bg-white border border-gray-100 shadow-[0_40px_80px_rgba(0,0,0,0.3)] rounded-[32px] overflow-hidden z-[200] flex flex-col max-h-[75vh]"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50 sticky top-0 z-[201]">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {searchResults.length} Items Matching "{searchTerm}"
              </span>
              <button
                onClick={() => setSearchTerm("")}
                className="text-[10px] font-black text-red-500 uppercase"
              >
                Close ✕
              </button>
            </div>

            {/* Results Grid */}
            <div className="p-4 md:p-8 overflow-y-auto no-scrollbar flex-1 bg-white">
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                  {searchResults.map((item) => (
                    <RecommendationCard
                      key={item.id}
                      item={item}
                      addToCart={addToCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white">
                  <span className="text-6xl block mb-4">🔍</span>
                  <p className="text-xl font-bold text-gray-400 italic">
                    No food found for your search.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default SearchOverlay;