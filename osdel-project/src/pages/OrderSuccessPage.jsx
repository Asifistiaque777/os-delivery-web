import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaWhatsapp, FaHome, FaClock, FaTruck, FaMoneyBillWave, FaMobileAlt, FaPhoneAlt } from 'react-icons/fa';
import { generateWhatsAppLink } from '../utils/constants'; // ওস মেইন ডোমেন লিংক জেনারেটর

const OrderSuccessPage = ({ orderDetails, setPage, orders, userId }) => {
  
  // ফলব্যাক মেকানিজম: স্টেট হারিয়ে গেলে ডাটাবেসের সর্বশেষ অর্ডার আইডি ট্র্যাকিংয়ে ব্যবহার হবে
  const fallbackOrder = useMemo(() => {
    if (!orders || !userId) return null;
    const userOrders = orders.filter(o => o.userId === userId);
    return userOrders.length > 0 ? userOrders[0] : null;
  }, [orders, userId]);

  const displayId = orderDetails?.id || fallbackOrder?.id || '';
  
  const displayWhatsAppLink = useMemo(() => {
    if (orderDetails?.whatsappLink) return orderDetails.whatsappLink;
    if (fallbackOrder) return generateWhatsAppLink(fallbackOrder, false);
    return '#';
  }, [orderDetails, fallbackOrder]);

  const displayAmount = orderDetails?.totalAmount || fallbackOrder?.totalAmount || 0;

  // যদি ডাটাবেস বা স্টেট কোথাও কোনো ডাটা না থাকে তখনই হোমপেজে রিডাইরেক্ট করবে
  useEffect(() => {
    if (!orderDetails && !fallbackOrder && orders && orders.length > 0) {
      const timer = setTimeout(() => setPage('Home'), 1000);
      return () => clearTimeout(timer);
    }
  }, [orderDetails, fallbackOrder, orders, setPage]);

  const [timeLeft, setTimeLeft] = useState('30:00 Mins');

  useEffect(() => {
    const activeTarget = fallbackOrder || orders?.find(o => o.id === displayId);
    if (!activeTarget) return;

    const durationMinutes = activeTarget.deliveryDuration || 30;
    const baseTime = activeTarget.pickedAt?.seconds || activeTarget.receivedAt?.seconds;
    
    if (!baseTime) return;

    const calculateTime = () => {
      const targetTime = (baseTime * 1000) + (durationMinutes * 60 * 1000);
      const difference = targetTime - Date.now();

      if (difference <= 0) {
        setTimeLeft('Arriving Any Minute! ⏳');
        return;
      }

      const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((difference % (1000 * 60)) / 1000);
      setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs} Mins`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [fallbackOrder, orders, displayId]);

  if (!displayId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <span className="loading loading-ring loading-lg text-success" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-white relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-[100px] opacity-60 -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-60 -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-white border border-gray-100 rounded-[50px] p-10 md:p-14 text-center shadow-2xl shadow-green-100/50 relative"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} className="flex justify-center mb-8">
          <div className="relative">
            <FaCheckCircle className="text-8xl text-green-500 shadow-2xl" />
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-green-500 rounded-full -z-10" />
          </div>
        </motion.div>

        <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-4 uppercase italic">
          ORDER <span className="text-green-500">SUCCESS!</span>
        </h2>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gray-900 text-white p-6 rounded-[35px] mb-6 flex flex-col items-center gap-2 shadow-2xl border-b-4 border-green-500">
          <div className="flex items-center gap-3 text-green-400 font-black text-[10px] uppercase tracking-[0.3em]">
            <FaClock className="animate-pulse" /> Express Delivery Track
          </div>
          <p className="text-xl font-black leading-tight">
            Your parcel will arrive in <span className="text-green-500 underline underline-offset-4 tabular-nums">{timeLeft}</span>! 🚀
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-green-50 border-2 border-green-200 p-6 rounded-[35px] mb-10 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <FaTruck /> Payment Options At Doorstep
            </p>
            <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-green-600">
                  <FaMoneyBillWave size={20} />
                </div>
                <span className="text-[9px] font-black uppercase text-gray-600">Cash</span>
              </div>
              <div className="h-8 w-[1px] bg-green-200" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 bg-[#D81B60] rounded-full flex items-center justify-center shadow-md text-white">
                  <FaMobileAlt size={20} />
                </div>
                <span className="text-[9px] font-black uppercase text-gray-600">bKash</span>
              </div>
            </div>
            <p className="text-xs font-bold text-gray-700 mt-4 px-4 leading-relaxed uppercase tracking-tighter">
              আপনি পার্সেল রিসিভ করার সময় <span className="text-green-600">Cash</span> অথবা <span className="text-[#D81B60]">bKash</span>—যেকোনো ভাবেই পেমেন্ট করতে পারবেন।
            </p>
          </div>
        </motion.div>

        <div className="space-y-4 mb-10 text-left bg-gray-50 p-6 rounded-[30px] border border-gray-100">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</span>
            <span className="text-xs font-mono font-bold text-gray-900 break-all ml-4 italic">#{displayId.substring(0, 12)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount to Pay</span>
            <span className="text-2xl font-black text-gray-900 tracking-tighter">৳{displayAmount}</span>
          </div>
        </div>

        <div className="space-y-4">
          <motion.a href={displayWhatsAppLink} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full flex items-center justify-center gap-3 py-6 bg-green-500 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-green-200 hover:bg-green-600 transition-all">
            <FaWhatsapp size={20} /> Track Order on WhatsApp
          </motion.a>

          <motion.a href="tel:01566056148" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full flex items-center justify-center gap-3 py-6 bg-gray-900 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all">
            <FaPhoneAlt size={16} className="animate-bounce" /> Call For Urgent Inquiry
          </motion.a>

          <button onClick={() => setPage('Home')} className="w-full flex items-center justify-center gap-3 py-6 bg-white text-gray-400 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] border-2 border-gray-100 hover:bg-gray-50 transition-all">
            <FaHome size={18} /> Return Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;