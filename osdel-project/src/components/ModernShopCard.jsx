import React, { useState, useEffect } from "react";
import { getMenuAvailability } from "../utils/constants";

/* =====================================================
    🎨 MODERN SHOP CARD
===================================================== */
const ModernShopCard = ({ category, onSelect, onNavigate }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const totalImages = category.images?.length || 0;
  const availability = getMenuAvailability(category.name);

  useEffect(() => {
    if (totalImages <= 1) return;
    const timer = setInterval(
      () => setImgIdx((prev) => (prev + 1) % totalImages),
      4000
    );
    return () => clearInterval(timer);
  }, [totalImages]);

  return (
    <div
      onClick={() => {
        onSelect(category.name);
        onNavigate("SubCategoryPage");
      }}
      className="min-w-[190px] md:min-w-[300px] bg-white rounded-[15px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group flex-shrink-0 snap-start"
    >
      <div className="h-32 md:h-48 overflow-hidden relative">
        <img
          src={category.images?.[imgIdx]}
          alt={category.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-0.5 rounded-full text-[7px] md:text-[9px] font-black shadow-lg ${
              availability.available
                ? "bg-green-500 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {availability.available ? "OPEN" : "CLOSED"}
          </span>
        </div>
      </div>
      <div className="p-3 md:p-5">
        <h3 className="text-[12px] md:text-lg font-black text-gray-800 tracking-tight uppercase line-clamp-1">
          {category.title}
        </h3>
        <p className="text-[9px] md:text-xs text-gray-500 leading-relaxed line-clamp-2 mt-1">
          {category.description}
        </p>
      </div>
    </div>
  );
};

export default ModernShopCard;