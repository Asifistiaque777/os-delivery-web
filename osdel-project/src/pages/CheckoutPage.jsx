import React, { useState, useMemo, useEffect } from 'react';
import { DELIVERY_AREA, generateWhatsAppLink } from '../utils/constants';
import { motion } from 'framer-motion';
import {
  FaMapMarkerAlt, FaUser, FaPhoneAlt, FaRoad, FaHome,
  FaCommentDots, FaShoppingBag, FaTruck,
  FaCheckCircle, FaChevronRight, FaEnvelope,
} from 'react-icons/fa';

const getDeliveryCharge = (block) => {
  if (!block) return 0;
  const b = block.toUpperCase().trim().charAt(0);
  if (b >= 'A' && b <= 'I') return 40;
  if (b >= 'J' && b <= 'K') return 50;
  if (b === 'L')             return 70;
  if (b >= 'M' && b <= 'N') return 100;
  return 0;
};

const CheckoutPage = ({
  cart, totalAmount, placeOrder, setPage,
  setCart, setAlert, userId, setOrderSuccessDetails,
  userProfile, // ← App.jsx থেকে আসবে (saved address auto-fill)
}) => {
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '',
    location: '', block: '', road: '', house: '', comment: '',
  });

  const [isBashundharaConfirmed, setIsBashundharaConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting]                     = useState(false);

  // ── auto-fill from saved profile ──────────────────────────
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        name    : userProfile.name     || prev.name,
        phone   : userProfile.phone    || prev.phone,
        location: userProfile.location || prev.location,
        block   : userProfile.block    || prev.block,
        road    : userProfile.road     || prev.road,
        house   : userProfile.house    || prev.house,
      }));
      // block থাকলে Bashundhara auto-confirm
      if (userProfile.block) setIsBashundharaConfirmed(true);
    }
  }, [userProfile]);

  const deliveryCharge = useMemo(() => getDeliveryCharge(formData.block), [formData.block]);
  const grandTotal     = totalAmount + deliveryCharge;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOrderPlace = async (e) => {
    e.preventDefault();
    if (cart.length === 0 || !isBashundharaConfirmed) return;
    setIsSubmitting(true);
    try {
      const orderData = {
        userId,
        customerDetails: { ...formData, deliveryCharge },
        items: cart,
        totalAmount: grandTotal,
      };
      const docRef      = await placeOrder(orderData);
      const whatsappLink = generateWhatsAppLink({ ...orderData, id: docRef.id, totalAmount: grandTotal });
      setCart([]);
      setOrderSuccessDetails({ id: docRef.id, totalAmount: grandTotal, whatsappLink });
      setPage('OrderSuccess');
    } catch {
      setAlert({ message: 'Order failed. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.phone && formData.block && isBashundharaConfirmed;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 pt-20 md:pt-28 relative overflow-hidden">
      <div className="absolute top-[-5%] right-[-5%] w-[300px] h-[300px] bg-green-100 rounded-full blur-[100px] -z-10 opacity-60" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-blue-100 rounded-full blur-[100px] -z-10 opacity-60" />

      <div className="max-w-2xl mx-auto px-4 relative z-10">

        {/* Auto-fill notice */}
        {userProfile?.block && (
          <div className="mb-4 px-5 py-3 bg-green-50 border border-green-200 rounded-2xl text-[11px] font-black text-green-700 uppercase tracking-widest">
            ✅ Saved address auto-filled — you can edit below
          </div>
        )}

        <form onSubmit={handleOrderPlace} className="space-y-6">

          {/* --- SHIPPING DETAILS --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[35px] p-6 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-100"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                <FaTruck size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Shipping Details</h3>
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Delivery Information</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormGroup label="Recipient Name" icon={<FaUser />}     name="name"  placeholder="E.g. Asif Shawon" value={formData.name}  onChange={handleChange} />
                <FormGroup label="Phone Number"   icon={<FaPhoneAlt />} name="phone" placeholder="01XXXXXXXXX"      type="tel" value={formData.phone} onChange={handleChange} />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Email Address</label>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">Optional</span>
                </div>
                <div className="relative group">
                  <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input
                    name="email" type="email"
                    placeholder="E.g. asif@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-[14px] font-bold text-gray-800 outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Area Confirmation */}
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Confirm Service Area</label>
                  {!isBashundharaConfirmed && (
                    <span className="text-[9px] font-black text-rose-500 animate-pulse uppercase tracking-tighter">* Select Here</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsBashundharaConfirmed(!isBashundharaConfirmed)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 ${
                    isBashundharaConfirmed
                      ? 'bg-green-50 border-green-500 shadow-md shadow-green-100'
                      : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isBashundharaConfirmed ? 'bg-green-500 text-white' : 'border-2 border-gray-300 bg-white'}`}>
                      {isBashundharaConfirmed && <FaCheckCircle size={14} />}
                    </div>
                    <div className="text-left">
                      <p className={`font-bold text-sm ${isBashundharaConfirmed ? 'text-green-800' : 'text-gray-600'}`}>Bashundhara R/A</p>
                      <p className="text-[10px] text-gray-400 font-medium">Click to confirm your area</p>
                    </div>
                  </div>
                  {isBashundharaConfirmed
                    ? <span className="text-[9px] font-black text-green-600 uppercase tracking-tighter">Selected</span>
                    : <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 uppercase">Select <FaChevronRight size={8} /></div>
                  }
                </button>
              </div>

              <FormGroup label="Landmark / Location" icon={<FaMapMarkerAlt />} name="location" placeholder="E.g. Near IUB" value={formData.location} onChange={handleChange} />

              {/* Block Picker */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Pick Your Block</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {['A','B','C','D','E','F','G','H','I','J','K','L','M','N'].map(b => (
                    <button
                      key={b} type="button"
                      onClick={() => setFormData({ ...formData, block: b })}
                      className={`h-12 rounded-xl font-black text-sm transition-all duration-200 border-2 ${
                        formData.block === b
                          ? 'bg-gray-900 border-gray-900 text-white shadow-lg'
                          : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <FormGroup label="Road Number" icon={<FaRoad />} name="road"  placeholder="Road 05"  value={formData.road}  onChange={handleChange} />
                <FormGroup label="House / Flat" icon={<FaHome />} name="house" placeholder="House 12" value={formData.house} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Special Instructions (Optional)</label>
                <div className="relative group">
                  <FaCommentDots className="absolute left-5 top-5 text-gray-300 group-focus-within:text-green-500 transition-colors" />
                  <textarea
                    name="comment"
                    placeholder="Anything specific for our rider?"
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-100 focus:bg-white rounded-[24px] p-5 pl-12 text-[14px] font-bold text-gray-800 outline-none transition-all min-h-[100px]"
                    onChange={handleChange}
                    value={formData.comment}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- ORDER SUMMARY --- */}
          <motion.section
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-[35px] p-6 md:p-10 text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />

            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
              <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                <FaShoppingBag className="text-green-500" /> Order Review
              </h2>
              <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black text-green-400">
                {cart.length} Items
              </span>
            </div>

            <div className="space-y-3 mb-8 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-[13px] font-bold">
                    <span className="text-green-500 mr-2">{item.quantity}x</span>{item.name}
                  </p>
                  <p className="text-sm font-black">৳{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-white/10 pt-6">
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>Subtotal</span><span>৳{totalAmount}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <span>Delivery Charge</span><span className="text-green-500">৳{deliveryCharge}</span>
              </div>
              <div className="flex justify-between items-center pt-5 border-t border-white/20 mt-4">
                <span className="text-lg font-black uppercase tracking-tight">Grand Total</span>
                <span className="text-3xl font-black text-green-500">৳{grandTotal}</span>
              </div>
            </div>

            <motion.button
              whileHover={isFormValid ? { scale: 1.02 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              disabled={isSubmitting || !isFormValid}
              type="submit"
              className={`w-full mt-8 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                !isFormValid
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : 'bg-green-500 text-white shadow-xl shadow-green-900/40'
              }`}
            >
              {isSubmitting
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : !isBashundharaConfirmed ? 'Select Area to Order' : 'Complete Order (COD) ➔'
              }
            </motion.button>
          </motion.section>
        </form>
      </div>
    </div>
  );
};

const FormGroup = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-500 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full bg-gray-50 border-2 border-transparent focus:border-green-100 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-[14px] font-bold text-gray-800 outline-none transition-all"
        required
      />
    </div>
  </div>
);

export default CheckoutPage;