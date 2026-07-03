import React from "react";
import { motion } from "framer-motion";
import { FaTag } from "react-icons/fa";
import { getMenuAvailability } from "../utils/constants";

/* =====================================================
    🔥 DISCOUNT PRODUCT CARD (Single Card)
===================================================== */
const DiscountProductCard = ({ item, addToCart }) => {
  const discountedPrice = Math.floor(item.price - (item.price * item.discount) / 100);
  const availability = getMenuAvailability(item.category);
  const isUnavailable = item.isStockOut || !availability.available;

  return (
    <motion.div
      className="min-w-[200px] md:min-w-[240px] bg-white border border-gray-100 rounded-none p-4 shadow-md snap-start group relative flex flex-col"
    >
      {/* Discount Badge */}
      {!isUnavailable && (
        <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-none uppercase italic shadow-lg">
          {item.discount}% OFF
        </div>
      )}

      {/* Image */}
      <div className="w-full h-40 bg-gray-50 rounded-none mb-4 overflow-hidden flex items-center justify-center p-4 relative">
        <img
          src={item.imageURL || "https://placehold.co/400"}
          className={`w-full h-full object-contain transition-transform duration-500 ${
            !isUnavailable ? "group-hover:scale-110" : "opacity-80"
          }`}
          alt={item.name}
        />
        {isUnavailable && (
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 uppercase rounded-none rotate-[-5deg] shadow-xl border border-white/20">
              {item.isStockOut ? "Out of Stock" : "Currently Closed"}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <h4
        className={`text-[13px] font-black uppercase tracking-tighter line-clamp-1 mb-2 ${
          isUnavailable ? "text-slate-500" : "text-slate-800"
        }`}
      >
        {item.name}
      </h4>

      <div className="flex items-end gap-2 mb-4">
        <span
          className={`text-lg font-black leading-none ${
            isUnavailable ? "text-slate-400" : "text-green-600"
          }`}
        >
          ৳{discountedPrice}
        </span>
        <span className="text-xs font-bold text-slate-300 line-through leading-none">
          ৳{item.price}
        </span>
      </div>

      {/* Button */}
      <div className="mt-auto">
        {isUnavailable ? (
          <div className="w-full py-3 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-none text-center border border-slate-200">
            {item.isStockOut ? "Restocking" : "Closed"}
          </div>
        ) : (
          <button
            onClick={() => addToCart({ ...item, price: discountedPrice })}
            className="w-full py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-none hover:bg-green-500 transition-all shadow-lg active:scale-95"
          >
            Add To Cart +
          </button>
        )}
      </div>
    </motion.div>
  );
};

/* =====================================================
    🔥 DISCOUNT SECTION (Full Section with Header + Scrollable Row)
===================================================== */
const DiscountSection = ({ discountedProducts, addToCart }) => {
  if (!discountedProducts || discountedProducts.length === 0) return null;

  return (
    <div className="mt-20">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-500 text-white rounded-none shadow-lg shadow-red-200">
          <FaTag size={20} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
            Hot Discounts.
          </h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Limited time offers just for you
          </p>
        </div>
      </div>

      {/* Scrollable Cards Row */}
      <div
        className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#ef4444 #fef2f2" }}
      >
        {discountedProducts.map((item) => (
          <DiscountProductCard key={item.id} item={item} addToCart={addToCart} />
        ))}
      </div>

      <style>{`
        .discount-scroll::-webkit-scrollbar {
          height: 5px;
        }
        .discount-scroll::-webkit-scrollbar-track {
          background: #fef2f2;
          border-radius: 99px;
        }
        .discount-scroll::-webkit-scrollbar-thumb {
          background: #ef4444;
          border-radius: 99px;
        }
      `}</style>
    </div>
  );
};

export { DiscountProductCard };
export default DiscountSection;