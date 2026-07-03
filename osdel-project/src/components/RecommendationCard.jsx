import React from "react";
import { CATEGORIES, getMenuAvailability } from "../utils/constants";

/* =====================================================
    🌟 RECOMMENDATION CARD
===================================================== */
const RecommendationCard = ({ item, addToCart }) => {
  const itemAvailability = getMenuAvailability(item.category);
  const isUnavailable = !itemAvailability.available || item.isStockOut;

  const categoryInfo = CATEGORIES.find(
    (cat) => cat.name.toLowerCase() === item.category?.toLowerCase()
  );
  const shopName = categoryInfo ? categoryInfo.title : "Oriental Street";

  const hasDiscount = item.discount > 0;
  const discountedPrice = hasDiscount
    ? Math.floor(item.price - (item.price * item.discount) / 100)
    : item.price;

  return (
    <div className="group relative min-w-[200px] bg-white border border-gray-100 overflow-hidden transition-all duration-500 hover:border-green-500 shadow-sm hover:shadow-xl rounded-2xl">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={item.imageURL}
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
            isUnavailable ? "grayscale opacity-50" : "group-hover:scale-110"
          }`}
        />

        <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
          {hasDiscount && !isUnavailable && (
            <span className="bg-red-600 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-tighter shadow-lg">
              {item.discount}% OFF
            </span>
          )}
          <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
            ৳{discountedPrice}
          </span>
        </div>

        {isUnavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[2px]">
            <span className="bg-red-600 text-white text-[10px] font-bold px-4 py-1 rotate-[-5deg] shadow-lg">
              {item.isStockOut ? "OUT OF STOCK" : "NOT AVAILABLE"}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col items-center">
        <h4 className="font-bold text-gray-900 text-sm uppercase text-center h-10 line-clamp-2">
          {item.name}
        </h4>

        <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mt-1 opacity-70">
          {shopName}
        </p>

        {hasDiscount && !isUnavailable && (
          <p className="text-[11px] text-gray-400 line-through font-bold mt-1">
            ৳{item.price}
          </p>
        )}

        <div className="mt-4 w-full">
          {isUnavailable ? (
            <div className="text-center py-2 border border-dashed border-gray-300 rounded-lg">
              <span className="text-[10px] text-gray-400 font-bold uppercase">
                {item.isStockOut ? "Restocking Soon" : itemAvailability.message}
              </span>
            </div>
          ) : (
            <button
              onClick={() =>
                addToCart({ ...item, price: discountedPrice, shopName })
              }
              className="w-full bg-gray-900 hover:bg-green-600 text-white py-3 rounded-xl text-[11px] font-black uppercase tracking-[1px] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Add To Cart →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;