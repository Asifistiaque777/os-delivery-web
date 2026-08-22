import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMotorcycle, FaClock, FaBox, FaWhatsapp, FaTimes, FaChevronRight } from 'react-icons/fa';

// ── 💬 ফুল ডিটেইলস সহ হোয়াটসঅ্যাপ মেসেজ জেনারেটর ──
const generateLiveWhatsAppLink = (order) => {
  if (!order || !order.id) return '#';
  const baseUrl = "https://wa.me/8801566056148"; // আপনার অফিসিয়াল লাইন
  
  const itemsText = order.items
    ?.map(item => `• ${item.name} (x${item.quantity}) - ৳${item.price * item.quantity}`)
    .join('\n') || '';

  const text = `Hello Oriental Street, I want to track my active Order.\n\n` +
               `*Order ID:* #${order.id.toUpperCase()}\n` +
               `*Status:* ${order.status === 'taken' ? 'On The Way 🏍️' : 'Preparing 🍳'}\n\n` +
               `*Items Details:*\n${itemsText}\n\n` +
               `*Total Amount:* ৳${order.totalAmount}`;

  return `${baseUrl}?text=${encodeURIComponent(text)}`;
};

const FloatingCountdown = ({ orders, userId, page }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeTriggers, setTimeTriggers] = useState({});
  const constraintsRef = useRef(null);

  // ── 🔒 ফিল্টার: কাস্টমারের একটিভ অর্ডারসমূহ ──
  const activeOrders = useMemo(() => {
    if (!orders || !userId || page === 'OrderSuccess' || page.toLowerCase().includes('admin') || page.toLowerCase().includes('rider')) {
      return [];
    }
    return orders.filter(o => o.userId === userId && (o.status === 'received' || o.status === 'taken'));
  }, [orders, userId, page]);

  // ── 🔄 প্রতি সেকেন্ডে লাইভ টাইম হিসাব করা ──
  useEffect(() => {
    if (activeOrders.length === 0) return;

    const calculateAllTimes = () => {
      const now = Date.now();
      const newTriggers = {};

      activeOrders.forEach(order => {
        const baseTimeSeconds = order.receivedAt?.seconds;
        if (!baseTimeSeconds) return;

        const durationMinutes = order.deliveryDuration || 30;
        const targetTime = (baseTimeSeconds * 1000) + (durationMinutes * 60 * 1000);
        const difference = targetTime - now;

        if (difference <= 0) {
          newTriggers[order.id] = 'Arriving! ⏳';
        } else {
          const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((difference % (1000 * 60)) / 1000);
          newTriggers[order.id] = `${mins}:${secs < 10 ? '0' : ''}${secs} Mins`;
        }
      });

      setTimeTriggers(newTriggers);
    };

    calculateAllTimes();
    const interval = setInterval(calculateAllTimes, 1000);
    return () => clearInterval(interval);
  }, [activeOrders]);

  const handleOrderClick = (order) => {
    const link = generateLiveWhatsAppLink(order);
    if (link && link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  if (activeOrders.length === 0) return null;

  return (
    <>
      {/* ── Invisible Fullscreen Container for Drag Boundaries ── */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-[999990]" />

      {/* ── 🟢 ১০০% মুভেবল/ড্রাগেবল লাইভ ট্র্যাক বাটন (সবকিছুর ওপরে থাকবে) ── */}
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95, cursor: 'grabbing' }}
        className="fixed bottom-6 left-6 pointer-events-auto cursor-grab z-[999995]"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="h-14 px-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-full flex items-center gap-3 shadow-[0_15px_40px_rgba(34,197,94,0.45)] relative border-2 border-green-500 overflow-hidden group select-none"
        >
          {/* ব্যাকগ্রাউন্ড লাইভ নিয়ন গ্লো এনিমেশন */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500/10 via-transparent to-green-500/10 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
          
          {/* রানিং অর্ডারের লাল ব্যাজ কাউন্ট */}
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-rose-600 text-white font-black text-[10px] w-5.5 h-5.5 rounded-full flex items-center justify-center border border-slate-950 shadow-md">
            {activeOrders.length}
          </span>
          
          {/* রাইডার সাইকেল আইকন */}
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-slate-950 shrink-0 shadow-md">
            <FaMotorcycle size={16} className="animate-pulse" />
          </div>

          {/* টেক্সট প্যানেল */}
          <div className="text-left pr-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-green-400 leading-none">Track Live</p>
            <p className="text-xs font-black font-mono tracking-tight text-white mt-1 flex items-center gap-1 tabular-nums">
              <FaClock size={10} className="text-slate-400" />
              {timeTriggers[activeOrders[0]?.id] || 'Sync...'}
            </p>
          </div>
        </button>
      </motion.div>

      {/* ── 📦 মেগা প্রিমিয়াম ড্রয়ার পপআপ ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* ব্যাকড্রপ শ্যাডো */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999998]"
            />

            {/* ড্রয়ার কন্টেইনার */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950 border-t-4 border-green-500 rounded-t-[36px] shadow-[0_-15px_50px_rgba(0,0,0,0.9)] p-6 z-[999999] text-white font-sans max-h-[82vh] flex flex-col"
            >
              {/* ড্রয়ার হেডার */}
              <div className="flex justify-between items-center pb-5 border-b border-slate-900 shrink-0">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                    <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                      Live Order Tracker
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Currently processing {activeOrders.length} active delivery</p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              {/* রানিং অর্ডার সমূহের স্ক্রোলযোগ্য মেগা লিস্ট */}
              <div className="flex-1 overflow-y-auto py-5 space-y-4 no-scrollbar">
                {activeOrders.map((order) => (
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    key={order.id}
                    onClick={() => handleOrderClick(order)}
                    className="bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between gap-4 cursor-pointer hover:border-green-500/40 transition-all group shadow-inner"
                  >
                    <div className="flex items-center gap-3.5 min-w-0 flex-1 text-left">
                      <div className="w-12 h-12 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-green-400 shrink-0 group-hover:bg-green-500 group-hover:text-slate-950 transition-all shadow-md">
                        {order.status === 'taken' ? <FaMotorcycle size={20} className="animate-bounce" /> : <FaBox size={18} />}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-white font-mono tracking-wide">#{order.id.substring(0, 8).toUpperCase()}</h4>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                            order.status === 'taken' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {order.status === 'taken' ? 'On Way 🏍️' : 'Preparing 🍳'}
                          </span>
                        </div>
                        
                        <p className="text-xs text-slate-400 truncate mt-1.5 font-medium">
                          {order.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-3 flex-wrap">
                          <div className="flex items-center gap-1.5 text-xs font-black text-green-400 font-mono bg-green-500/5 px-2.5 py-1 rounded-xl border border-green-500/10 tabular-nums">
                            <FaClock size={11} className="animate-pulse" />
                            <span>{timeTriggers[order.id] || 'Syncing...'}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-300 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
                            ৳{order.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-11 h-11 bg-[#25D366] text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-500/10 shrink-0 transition-transform active:scale-90 group-hover:scale-105">
                      <FaWhatsapp size={20} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ড্রয়ার ফুটার */}
              <div className="pt-3 text-center text-[10px] text-slate-500 border-t border-slate-900 tracking-widest uppercase font-black shrink-0 flex items-center justify-center gap-1">
                Click an order card to track live on WhatsApp <FaChevronRight size={6} className="rotate-180" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingCountdown;