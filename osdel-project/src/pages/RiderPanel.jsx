import React, { useState, useEffect } from 'react';
import { generateWhatsAppLink } from '../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'; 
import { 
  FaMotorcycle, FaBox, FaCheckCircle, FaWhatsapp, 
  FaMapMarkerAlt, FaUser, FaPhoneAlt, 
  FaListUl, FaSignOutAlt, FaDirections,
  FaPlus, FaMinus, FaLock, FaEnvelope
} from 'react-icons/fa';

const formatTime = (timestamp) => {
  if (!timestamp || !timestamp.seconds) return '--:--';
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true });
};

// ── 🕒 রিয়েল-টাইম অর্ডার কাউন্টডাউন (NEW এবং ACTIVE দুই সেকশনেই 'receivedAt' থেকে শুরু) ──
const LiveRiderCounter = ({ order, onAdjustTime }) => {
  const [remainingText, setRemainingText] = useState('');

  useEffect(() => {
    const calculateRemaining = () => {
      const baseTimeSeconds = order.receivedAt?.seconds;
      if (!baseTimeSeconds) {
        setRemainingText('--:-- Mins');
        return;
      }

      const currentTotalDuration = order.deliveryDuration || 30;
      const elapsedMilliseconds = Date.now() - (baseTimeSeconds * 1000);
      const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
      const totalAllocatedSeconds = currentTotalDuration * 60;
      
      const remainingSeconds = totalAllocatedSeconds - elapsedSeconds;

      if (remainingSeconds <= 0) {
        setRemainingText('Delayed / Arriving! ⏳');
        return;
      }

      const mins = Math.floor(remainingSeconds / 60);
      const secs = remainingSeconds % 60;
      setRemainingText(`${mins}:${secs < 10 ? '0' : ''}${secs} Mins Left`);
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [order]);

  return (
    <div className="mb-4 flex items-center justify-between bg-green-50/60 border border-green-100 p-3 rounded-xl">
      <div className="text-left">
        <p className="text-[8px] font-black text-green-700 uppercase tracking-wider">Live Delivery Counter</p>
        <h4 className="text-sm font-black text-slate-900 font-mono tabular-nums">{remainingText}</h4>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onAdjustTime(order, -5)}
          className="w-9 h-9 bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-slate-800 active:scale-95 transition-all font-bold"
        >
          <FaMinus size={10} />
        </button>
        <button 
          onClick={() => onAdjustTime(order, 5)}
          className="w-9 h-9 bg-green-500 text-slate-950 rounded-lg flex items-center justify-center hover:bg-green-600 active:scale-95 transition-all font-bold"
        >
          <FaPlus size={10} />
        </button>
      </div>
    </div>
  );
};

/* =========================================================================
    🏍️ MAIN RIDER PANEL COMPONENT (REAL TIME SESSION FIX ✅)
=========================================================================== */
const RiderPanel = ({ orders, updateOrderStatus, setAlert, setPage, isAuthenticated, setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('received');
  const [activeRider, setActiveRider] = useState(null); // 👈 লাইভ রাইডার স্টেট লক

  const auth = getAuth();

  // ── 🔄 ফায়ারবেস রিয়েল-টাইম অথ সেশন ট্র্যাকার হুক ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email?.toLowerCase().endsWith('@osrider.com')) {
        setActiveRider(user);
        setIsAuthenticated(true);
      } else {
        setActiveRider(null);
      }
    });
    return () => unsubscribe();
  }, [auth, setIsAuthenticated]);

  // ── 🔐 রাইডার লগইন হ্যান্ডলার ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(false);
    
    if (!email.toLowerCase().endsWith('@osrider.com')) {
      setError('অ্যাক্সেস রিফিউজড! আপনি এই প্যানেলের অনুমোদিত রাইডার নন।');
      return;
    }

    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, password);
      setActiveRider(res.user);
      setIsAuthenticated(true);
      setAlert({ message: 'রাইডার প্যানেলে স্বাগতম! ✅', type: 'success' });
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('ভুল ইমেইল অথবা পাসওয়ার্ড! আবার চেষ্টা করুন।');
      } else {
        setError('লগইন ব্যর্থ হয়েছে। ইন্টারনেট চেক করুন।');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── 🚪 লগআউট হ্যান্ডলার ──
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveRider(null);
      setIsAuthenticated(false); 
      setEmail('');
      setPassword('');
      setFilter('received'); 
    } catch (err) {
      console.error(err);
    }
  };

  // ── 🎯 অর্ডার স্ট্যাটাস ও রাইডার ক্রেডেনশিয়াল লকিং ──
  const handleUpdateStatus = async (order, newStatus) => {
    try {
      const timeField = newStatus === 'taken' ? 'pickedAt' : 'deliveredAt';
      const extraData = { [timeField]: new Date() };
      
      if (newStatus === 'taken' && activeRider) {
        extraData.deliveryDuration = order.deliveryDuration || 30;
        extraData.riderId = activeRider.uid;
        // ফিক্স: ইমেইল স্প্লিট করে আসল রাইডারের নাম নিখুঁতভাবে ডাটাবেসে পুশ করা হলো
        extraData.riderName = activeRider.displayName || activeRider.email?.split('@')[0].toUpperCase() || 'RIDER';
      }

      await updateOrderStatus(order.id, newStatus, extraData);
      setAlert({ message: `অর্ডার আপডেট হয়েছে: ${newStatus === 'taken' ? 'ACTIVE' : 'COMPLETED'}`, type: 'success' });
    } catch (error) {
      setAlert({ message: 'আপডেট ব্যর্থ হয়েছে!', type: 'error' });
    }
  };

  // ── ⏱️ টাইম অ্যাডজাস্টমেন্ট ফিক্স (receivedAt এর সাথে সিঙ্কড) ──
  const handleAdjustTime = async (order, change) => {
    try {
      const baseTimeSeconds = order.receivedAt?.seconds;
      if (!baseTimeSeconds) return;

      const elapsedMilliseconds = Date.now() - (baseTimeSeconds * 1000);
      const elapsedMinutes = Math.floor(elapsedMilliseconds / (1000 * 60));
      const currentTotalDuration = order.deliveryDuration || 30;
      const currentRemainingTime = currentTotalDuration - elapsedMinutes;
      const newRemainingTime = currentRemainingTime + change;

      const calculatedDuration = elapsedMinutes + Math.max(5, newRemainingTime);
      
      await updateOrderStatus(order.id, order.status, {
        deliveryDuration: calculatedDuration
      });
      
      setAlert({ message: `ডেলিভারি টাইম অ্যাডজাস্ট করা হয়েছে!`, type: 'success' });
    } catch (err) {
      setAlert({ message: 'সময় আপডেট ব্যর্থ হয়েছে!', type: 'error' });
    }
  };

  // ── 🔒 রাইডারদের ব্যক্তিগত ফিল্টারিং লজিক ──
  const filteredOrders = orders.filter(order => {
    if (filter === 'received') {
      return order.status === 'received';
    } else {
      return order.status === filter && order.riderId === activeRider?.uid;
    }
  });

  if (!isAuthenticated || !activeRider) { 
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-xl text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-green-500/20">
            <FaMotorcycle size={28} className="text-green-500" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-1">Rider Login</h2>
          <p className="text-[10px] text-slate-500 mb-6 tracking-widest uppercase font-bold">Secure Delivery Portal</p>
          
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div className="relative group">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-500 transition-colors" size={14} />
              <input
                type="email"
                placeholder="Rider Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-white font-medium outline-none focus:border-green-500 transition-colors"
              />
            </div>

            <div className="relative group">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-green-500 transition-colors" size={14} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-white font-medium outline-none focus:border-green-500 transition-colors"
              />
            </div>

            {error && <p className="text-red-500 font-bold text-xs text-center bg-red-500/10 py-2 rounded-xl border border-red-500/20">⚠ {error}</p>}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-green-500 text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> : 'Access Panel →'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 pt-20 md:pt-24 px-2 sm:px-4 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6 bg-slate-900 p-4 sm:p-6 rounded-2xl shadow-md border-b-4 border-green-500">
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase italic">
              Rider <span className="text-green-500">Dashboard</span>
            </h2>
            <p className="text-[9px] font-bold text-green-400 uppercase tracking-wider mt-0.5">
              Online: {activeRider?.email?.split('@')[0].toUpperCase()} 🟢
            </p>
          </div>
          <button 
            className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-red-500 hover:text-white transition-colors" 
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { id: 'received', label: 'New', icon: <FaBox /> },
            { id: 'taken', label: 'Active', icon: <FaMotorcycle /> },
            { id: 'completed', label: 'Done', icon: <FaCheckCircle /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all border ${
                filter === tab.id 
                  ? 'bg-slate-900 border-slate-900 text-green-500 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* List of Orders */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredOrders.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-slate-300"
              >
                <FaBox size={40} className="mx-auto mb-2 opacity-60" />
                <p className="font-bold uppercase tracking-wider text-[11px]">No orders found</p>
              </motion.div>
            ) : (
              filteredOrders.map((order) => (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm relative overflow-hidden"
                >
                  {/* Order ID & Title */}
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                    <div className="text-left">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md text-[9px] font-bold font-mono">#{order.id.substring(0, 8).toUpperCase()}</span>
                      <h3 className="text-sm font-black text-slate-900 uppercase mt-1 tracking-tight">Order Details</h3>
                    </div>
                    {order.riderName && (
                      <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tight">
                        🏍️ Rider: {order.riderName}
                      </span>
                    )}
                  </div>

                  {/* TIME DISPLAY GRID */}
                  <div className="grid grid-cols-3 gap-1.5 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Received</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{formatTime(order.receivedAt)}</p>
                    </div>
                    <div className="border-x border-slate-200">
                      <p className="text-[8px] font-black text-green-600 uppercase tracking-wider">Picked</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{formatTime(order.pickedAt)}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-blue-600 uppercase tracking-wider">Delivered</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{formatTime(order.deliveredAt)}</p>
                    </div>
                  </div>

                  {/* ⏱️ LIVE TIME CONTROLLER (NEW & ACTIVE দুই ট্যাবেই লাইভ থাকবে) */}
                  {(order.status === 'received' || order.status === 'taken') && (
                    <LiveRiderCounter order={order} onAdjustTime={handleAdjustTime} />
                  )}

                  {/* Contact & Location Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
                    <a 
                      href={`tel:${order.customerDetails?.phone}`}
                      className="bg-slate-900 p-3.5 rounded-xl text-white active:scale-[0.99] transition-all block text-left"
                    >
                      <div className="flex items-center gap-1.5 mb-0.5 opacity-60">
                        <FaUser size={10} />
                        <span className="text-[8px] font-black uppercase tracking-wider">Customer</span>
                      </div>
                      <p className="text-base font-black tracking-tight mb-2 truncate">{order.customerDetails?.name}</p>
                      <div className="flex items-center justify-between bg-white/10 p-2 rounded-lg text-xs font-mono font-bold">
                        <span>{order.customerDetails?.phone}</span>
                        <FaPhoneAlt size={10} className="text-green-400 shrink-0 ml-2" />
                      </div>
                    </a>

                    <div className="bg-slate-100 border border-slate-200/60 p-3.5 rounded-xl text-left">
                      <div className="flex items-center gap-1.5 mb-1 text-slate-500">
                        <FaMapMarkerAlt size={10} />
                        <span className="text-[8px] font-black uppercase tracking-wider">Address</span>
                      </div>
                      <p className="text-sm font-black text-slate-900 tracking-tight leading-tight uppercase">
                        BLOCK {order.customerDetails?.block}, R-{order.customerDetails?.road}, H-{order.customerDetails?.house}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-[8px] font-black text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-md w-fit uppercase">
                        <FaDirections /> {order.customerDetails?.location}
                      </div>
                    </div>
                  </div>

                  {/* Payment Collection Bar */}
                  <div className="mb-3 bg-slate-900 p-3 rounded-xl flex justify-between items-center text-white">
                    <div className="text-left">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Payment Method</p>
                      <h4 className="text-xs font-black uppercase tracking-tight text-green-400">Cash On Delivery</h4>
                    </div>
                    <span className="text-xl font-black text-white">৳{order.totalAmount}</span>
                  </div>

                  {/* Items Checklist Section */}
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl mb-4 text-left">
                    <div className="flex items-center gap-2 mb-2.5 border-b border-slate-200/60 pb-1.5">
                      <FaListUl className="text-slate-700 text-xs" />
                      <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Items Checklist</h4>
                    </div>
                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1 no-scrollbar">
                      {order.items?.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-xs border-b border-slate-200/40 pb-2 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 truncate mr-3">
                            <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded text-[10px] font-black shrink-0">x{item.quantity}</span>
                            <div className="truncate">
                              <p className="font-bold text-slate-800 truncate uppercase tracking-tight">{item.name}</p>
                              {item.shopName && <p className="text-[8px] font-black text-green-600 uppercase">Shop: {item.shopName}</p>}
                            </div>
                          </div>
                          <span className="font-bold text-slate-700 shrink-0">৳{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {order.customerDetails?.comment && (
                      <div className="mt-3 p-2 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
                        <p className="text-[7px] font-black text-amber-700 uppercase tracking-wider">Instruction:</p>
                        <p className="text-xs font-medium text-slate-700 italic mt-0.5">"{order.customerDetails?.comment}"</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {order.status === 'received' && (
                      <button 
                        className="flex-1 py-3 bg-green-500 text-slate-950 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-green-600 active:scale-[0.98] transition-all text-center shadow-md shadow-green-500/10" 
                        onClick={() => handleUpdateStatus(order, 'taken')}
                      >
                        Accept PickUp
                      </button>
                    )}
                    {order.status === 'taken' && (
                      <button 
                        className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-black active:scale-[0.98] transition-all text-center" 
                        onClick={() => handleUpdateStatus(order, 'completed')}
                      >
                        Finish Delivery
                      </button>
                    )}
                    <button 
                      className="px-4 py-3 bg-white border border-green-500 text-green-500 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shrink-0"
                      onClick={() => window.open(generateWhatsAppLink(order, true), '_blank')}
                    >
                      <FaWhatsapp size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RiderPanel;