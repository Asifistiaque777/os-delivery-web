import React from "react";
import { getMenuAvailability } from "../utils/constants";

/* =====================================================
    🛒 PRODUCT CARD (Single Card for Grid)
===================================================== */
const ProductCard = ({ item, addToCart, onCardClick }) => {
  const hasDiscount = item.discount > 0;
  const discountedPrice = hasDiscount
    ? Math.floor(item.price - (item.price * item.discount) / 100)
    : item.price;
  const availability = getMenuAvailability(item.category);

  return (
    <div
      onClick={() => onCardClick({ ...item, discountedPrice })}
      className="bg-white flex flex-col shadow-md border border-slate-100 hover:shadow-xl transition duration-300 rounded-none relative overflow-visible cursor-pointer group"
    >
      {/* Image */}
      <div className="w-full h-40 bg-slate-50 flex items-center justify-center p-2 relative overflow-hidden">
        <img
          src={item.imageURL || "https://placehold.co/400"}
          alt={item.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-none uppercase">
              {item.discount}% OFF
            </span>
          )}
          <div className="bg-green-500 px-3 py-1 rounded-none shadow text-[12px] font-black text-white">
            ৳{discountedPrice}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-[12px] font-bold text-slate-800 leading-tight mb-1">
          {item.name}
        </h3>
        {hasDiscount && (
          <p className="text-[10px] text-slate-400 line-through font-bold mb-1">
            ৳{item.price}
          </p>
        )}

        <div className="mt-auto pt-2">
          {item.isStockOut ? (
            <p className="text-[9px] font-black text-rose-500 uppercase">
              Out of stock
            </p>
          ) : availability.available ? (
            <button
              onClick={(e) => {
                e.stopPropagation(); // drawer খোলা আটকাবে
                addToCart({ ...item, price: discountedPrice });
              }}
              className="w-full py-2 bg-slate-900 text-white text-[11px] font-bold rounded-none hover:bg-green-500 transition-colors uppercase relative z-10"
            >
              Add to cart +
            </button>
          ) : (
            <p className="text-[9px] font-black text-amber-500 uppercase">
              Closed
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* =====================================================
    🗂️ PRODUCT GRID (Full Grid Section)
===================================================== */
const ProductGrid = ({ filteredItems, addToCart, onCardClick }) => {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
      {filteredItems.map((item) => (
        <ProductCard
          key={item.id}
          item={item}
          addToCart={addToCart}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  );
};

export { ProductCard };
export default ProductGrid;