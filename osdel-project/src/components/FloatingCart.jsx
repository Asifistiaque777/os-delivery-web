import React, { useMemo } from 'react';
import { getAuth } from 'firebase/auth'; // ← সরাসরি লাইভ ফায়ারবেস চেক করার জন্য

/* =====================================================
    🛒 FLOATING CART (FIXED ROUTING 🎯)
    Confirm Order → LoginPage (not logged in)
                  → CheckoutPage (logged in)
===================================================== */
const FloatingCart = ({
  cart,
  totalAmount,
  updateCartQuantity,
  setPage,
  showCart,
  setShowCart,
  onConfirmOrder, // ← App.jsx থেকে আসা ১০০% ওয়াটারপ্রুফ গ্লোবাল হ্যান্ডলার
}) => {
  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  // বুলেপ্রুফ সিঙ্ক লজিক: কোনো স্টেট ডিলের ওপর ভরসা না করে সরাসরি রিয়েল-টাইম কোর চেক
  const handleConfirmOrder = () => {
    setShowCart(false);
    
    const currentUser = getAuth().currentUser;

    // ইউজার যদি সাকসেসফুলি লগইন থাকে এবং সে অ্যানোনিমাস/গেস্ট না হয়
    if (currentUser && !currentUser.isAnonymous) {
      setPage('Checkout');
    } else {
      setPage('Login');
    }
  };

  /* ── Floating Button ── */
  const CartButton = () => (
    <button
      onClick={() => setShowCart(true)}
      className="
        fixed bottom-6 right-6 md:bottom-10 md:right-12 z-50
        w-14 h-14 md:w-16 md:h-16 rounded-none
        flex items-center justify-center
        bg-slate-900 border-2 border-green-500
        shadow-[0_0_30px_rgba(34,197,94,0.4)] md:shadow-[0_0_50px_rgba(34,197,94,0.4)]
        hover:shadow-[0_0_70px_rgba(34,197,94,0.6)]
        hover:scale-110 active:scale-95
        transition-all duration-500 group
      "
      style={{ animation: 'float-bob 4s ease-in-out infinite' }}
    >
      <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 md:h-10 md:w-10 text-green-500 group-hover:rotate-12 transition-transform duration-300"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>

      {totalItems > 0 && (
        <span className="
          absolute -top-3 -right-3 md:-top-4 md:-right-4
          h-8 min-w-[32px] md:h-10 md:min-w-[40px] px-2
          bg-green-500 text-slate-900
          text-sm md:text-lg font-black italic
          flex items-center justify-center
          shadow-[0_5px_15px_rgba(0,0,0,0.4)]
          border-2 border-slate-900
        ">
          {totalItems}
        </span>
      )}
    </button>
  );

  /* ── Cart Drawer ── */
  const CartDrawer = () => {
    const currentUser = getAuth().currentUser;
    const isUserLoggedIn = currentUser && !currentUser.isAnonymous;

    return (
      <div className={`fixed inset-0 z-[100] flex justify-end transform transition-all duration-700 ${showCart ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-slate-950/95 backdrop-blur-md transition-opacity duration-500 ${showCart ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setShowCart(false)}
        />

        <div className={`relative w-[85%] sm:w-full max-w-md h-full bg-[#0a0a0a] border-l-2 border-green-500/30 shadow-[-30px_0_60px_rgba(0,0,0,0.8)] flex flex-col transform transition-transform duration-500 ease-out ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>

          {/* Header */}
          <div className="p-6 md:p-8 flex justify-between items-center bg-gradient-to-r from-green-500/10 to-transparent border-b border-white/5">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-2 h-8 md:w-3 md:h-10 bg-green-500 shadow-[0_0_20px_#22c55e]" />
              <div>
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter italic text-white leading-none">
                  Elite <span className="text-green-500">Cart</span>
                </h2>
                <p className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">
                  Oriental Street Delivery
                </p>
              </div>
            </div>
            <button
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-white hover:bg-red-600 transition-all font-black text-xl border border-white/10"
              onClick={() => setShowCart(false)}
            >✕</button>
          </div>

          {/* Items */}
          <div className="flex-grow overflow-y-auto p-5 md:p-8 space-y-4 md:space-y-6 no-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-6xl md:text-8xl mb-4 opacity-20 grayscale">🛒</div>
                <p className="text-xl md:text-2xl font-black uppercase tracking-widest text-green-500 opacity-50 italic">Empty</p>
              </div>
            ) : (
              cart.map(item => {
                const hasDiscount = item.discount > 0;
                const originalUnitPrice = item.price / (1 - (item.discount || 0) / 100);
                return (
                  <div key={item.id} className="relative group bg-white/5 p-4 md:p-6 border-l-4 border-transparent hover:border-green-500 transition-all">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <div className="max-w-[70%]">
                        <h3 className="font-black text-sm md:text-xl uppercase tracking-tight text-white group-hover:text-green-400 transition-colors leading-tight">
                          {item.name}
                        </h3>
                        {hasDiscount && (
                          <span className="inline-block mt-1 bg-red-500 text-white text-[8px] md:text-[9px] font-black px-1.5 py-0.5 uppercase italic">
                            Saving {item.discount}%
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-black text-lg md:text-2xl text-green-500 italic leading-none">
                          ৳{item.price * item.quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-widest">
                          ৳{item.price} Each
                        </span>
                        {hasDiscount && (
                          <span className="text-[8px] md:text-[10px] text-gray-600 line-through font-bold">
                            ৳{Math.floor(originalUnitPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 md:gap-6 bg-black border border-white/10 p-0.5 md:p-1">
                        <button
                          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-red-600 transition-all font-black text-xl text-white"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        >-</button>
                        <span className="w-4 md:w-6 text-center font-black text-lg md:text-2xl text-green-500">
                          {item.quantity}
                        </span>
                        <button
                          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-green-500 hover:text-slate-900 transition-all font-black text-xl text-white"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        >+</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-6 md:p-10 border-t-2 border-green-500/20 bg-black shadow-[0_-15px_30px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-end mb-6 md:mb-10">
              <div>
                <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-1 text-left">
                  Total Bill Payable
                </p>
                <h3 className="text-3xl md:text-5xl font-black text-green-500 italic tracking-tighter drop-shadow-[0_0_20px_rgba(34,197,94,0.4)] text-left">
                  {totalAmount} <span className="text-sm md:text-xl not-italic uppercase tracking-normal">TK</span>
                </h3>
              </div>
            </div>

            <button
              className="w-full py-5 md:py-7 bg-green-500 text-slate-950 font-black text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.5em] hover:bg-white transition-all shadow-[0_10px_20px_rgba(34,197,94,0.3)] active:scale-95 disabled:opacity-50 disabled:grayscale"
              disabled={cart.length === 0}
              onClick={handleConfirmOrder}
            >
              Confirm Order ➔
            </button>

            {/* Login hint —not logged in হলে */}
            {!isUserLoggedIn && cart.length > 0 && (
              <p className="text-center text-[9px] font-black text-gray-600 uppercase tracking-widest mt-3">
                You'll be asked to login or continue as guest
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes float-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <CartButton />
      <CartDrawer />
    </>
  );
};

export default FloatingCart;