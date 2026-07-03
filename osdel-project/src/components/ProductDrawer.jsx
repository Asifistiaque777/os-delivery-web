import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";
import { getMenuAvailability } from "../utils/constants";

/* =====================================================
    📦 PRODUCT DETAIL DRAWER
===================================================== */
const ProductDrawer = ({ selectedItem, setSelectedItem, addToCart }) => {
  const availability = selectedItem
    ? getMenuAvailability(selectedItem.category)
    : null;

  return (
    <AnimatePresence>
      {selectedItem && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-[3px] z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 bg-white z-[101] rounded-t-[40px] shadow-[0_-15px_50px_rgba(0,0,0,0.2)] flex flex-col max-h-[85vh]"
          >
            {/* Drag Handle */}
            <div
              className="w-full py-4 flex justify-center active:scale-95 transition-transform"
              onClick={() => setSelectedItem(null)}
            >
              <div className="w-14 h-1.5 bg-slate-200 rounded-full" />
            </div>

            <div className="flex-grow overflow-y-auto px-6 pb-10 no-scrollbar">
              <div className="flex flex-col gap-6">

                {/* Product Info Row */}
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-[28px] p-2 flex-shrink-0 border border-slate-100 shadow-sm flex items-center justify-center">
                    <img
                      src={selectedItem.imageURL}
                      alt={selectedItem.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-green-600 uppercase tracking-[0.15em] bg-green-50 px-2 py-0.5 rounded-md">
                        {selectedItem.category}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase italic leading-tight mt-1">
                      {selectedItem.name}
                    </h2>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-slate-900">
                        ৳{selectedItem.discountedPrice}
                      </span>
                      {selectedItem.discount > 0 && (
                        <span className="text-sm font-bold text-slate-300 line-through">
                          ৳{selectedItem.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-slate-50 p-4 rounded-[24px] border border-slate-100">
                  <p className="text-slate-500 text-[11px] font-bold leading-relaxed italic">
                    {selectedItem.description ||
                      "Oriental Street guarantees fresh quality and 24/7 super-fast delivery."}
                  </p>
                </div>

                {/* Quantity + Total Bar */}
                <div className="flex items-center justify-between bg-gray-900 p-3 rounded-[32px] shadow-lg">
                  <div className="flex items-center bg-white/10 rounded-full p-1 border border-white/5">
                    {/* Minus */}
                    <button
                      onClick={() =>
                        setSelectedItem((prev) => ({
                          ...prev,
                          quantity: Math.max(1, (prev.quantity || 1) - 1),
                        }))
                      }
                      className="w-12 h-12 text-white flex items-center justify-center transition-all active:scale-75 active:bg-white/10 rounded-full"
                    >
                      <FaMinus size={12} />
                    </button>

                    {/* Count */}
                    <div className="w-12 text-center">
                      <span className="text-xl font-black text-white tabular-nums">
                        {selectedItem.quantity || 1}
                      </span>
                    </div>

                    {/* Plus */}
                    <button
                      onClick={() =>
                        setSelectedItem((prev) => ({
                          ...prev,
                          quantity: (prev.quantity || 1) + 1,
                        }))
                      }
                      className="w-12 h-12 bg-green-500 text-slate-900 rounded-full flex items-center justify-center transition-all active:scale-75 shadow-lg shadow-green-500/20"
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>

                  {/* Total */}
                  <div className="pr-4 flex flex-col items-end">
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">
                      Total Price
                    </span>
                    <span className="text-2xl font-black text-white tracking-tighter">
                      ৳{selectedItem.discountedPrice * (selectedItem.quantity || 1)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                  {!selectedItem.isStockOut && availability?.available ? (
                    <button
                      onClick={() => {
                        const qty = selectedItem.quantity || 1;
                        for (let i = 0; i < qty; i++) {
                          addToCart({
                            ...selectedItem,
                            price: selectedItem.discountedPrice,
                          });
                        }
                        setSelectedItem(null);
                      }}
                      className="w-full py-5 bg-green-500 text-slate-900 font-black text-sm uppercase tracking-[0.2em] rounded-[24px] shadow-[0_15px_30px_rgba(34,197,94,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      Confirm & Add ➔
                    </button>
                  ) : (
                    <div className="w-full py-5 bg-slate-100 text-slate-400 font-black text-xs uppercase tracking-[0.1em] rounded-[24px] text-center border border-slate-200">
                      Currently Out of Stock
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="w-full py-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] active:text-red-500 transition-colors"
                  >
                    Go Back
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductDrawer;