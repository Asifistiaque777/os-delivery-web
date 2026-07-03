import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, FaEnvelope, FaLock, FaPhoneAlt, 
  FaMapMarkerAlt, FaRoad, FaHome, FaChevronLeft, FaArrowRight 
} from 'react-icons/fa';

const SignupPage = ({ useAuthData, setPage }) => {
  const { register, authError, setAuthError } = useAuthData;

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    location: '', block: '', road: '', house: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAuthError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚨 রাইডার ডোমেন চুরি ঠেকানোর আলটিমেট লক! 🔒
    if (form.email.toLowerCase().endsWith('@osrider.com')) {
      setAuthError('এই ডোমেন দিয়ে সাধারণ অ্যাকাউন্ট খোলার অনুমতি আপনার নেই!');
      return;
    }

    if (!form.block) {
      setAuthError('দয়া করে আপনার বসুন্ধরা আর/এ এর ব্লক সিলেক্ট করুন।');
      return;
    }
    
    setLoading(true);
    // ১. ফায়ারবেস অথেন্টিকেশনে অ্যাকাউন্ট তৈরি
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password
    });

    if (result.success) {
      // ২. সফল হলে প্রোফাইল ডাটাবেসে সম্পূর্ণ ঠিকানা আপডেট
      await useAuthData.updateProfileData({
        name: form.name,
        phone: form.phone,
        location: form.location,
        block: form.block,
        road: form.road,
        house: form.house,
      });
      setLoading(false);
      setPage('Checkout');
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-28">
      
      {/* Back to Login */}
      <button
        onClick={() => { setAuthError(''); setPage('Login'); }}
        className="fixed top-24 left-6 flex items-center gap-2 text-[11px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors"
      >
        <FaChevronLeft size={10} /> Back to Login
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100">
          
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
              Create Account ✨
            </h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Join OS Delivery & Save your Shipping Address
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* --- ACCOUNT INFO --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Full Name" icon={<FaUser />} name="name" placeholder="Asif Shawon" value={form.name} onChange={handleChange} required />
              <FormInput label="Email Address" icon={<FaEnvelope />} name="email" type="email" placeholder="asif@example.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Password" icon={<FaLock />} name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
              <FormInput label="Phone Number" icon={<FaPhoneAlt />} name="phone" type="tel" placeholder="01XXXXXXXXX" value={form.phone} onChange={handleChange} required />
            </div>

            {/* --- ADDRESS INFO --- */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-[11px] font-black text-green-500 uppercase tracking-[0.2em] mb-4">Delivery Address (Bashundhara R/A)</p>
              
              <FormInput label="Landmark / Nearby Location" icon={<FaMapMarkerAlt />} name="location" placeholder="E.g. Near IUB / NSU" value={form.location} onChange={handleChange} required />
              
              {/* Block Picker */}
              <div className="space-y-2 mt-4">
                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Pick Your Block</label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {['A','B','C','D','E','F','G','H','I','J','K','L','M','N'].map(b => (
                    <button
                      key={b} type="button"
                      onClick={() => setForm({ ...form, block: b })}
                      className={`h-11 rounded-xl font-black text-xs transition-all duration-200 border-2 ${
                        form.block === b
                          ? 'bg-gray-900 border-gray-900 text-white shadow-lg'
                          : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <button type="button" style={{ display: 'none' }} /> {/* Form Submit জ্যাম ফিক্স */}
                <FormInput label="Road Number" icon={<FaRoad />} name="road" placeholder="Road 05" value={form.road} onChange={handleChange} required />
                <FormInput label="House / Flat / Appartment" icon={<FaHome />} name="house" placeholder="House 12, Flat 3B" value={form.house} onChange={handleChange} required />
              </div>
            </div>

            {authError && (
              <p className="text-[11px] text-red-500 font-black bg-red-50 px-4 py-2 rounded-xl">⚠ {authError}</p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-4 mt-4 bg-gray-900 hover:bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>Sign Up & Continue <FaArrowRight size={13} /></>
              }
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
};

const FormInput = ({ label, icon, ...props }) => (
  <div className="space-y-1.5 text-left">
    <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-500 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full bg-gray-50 border-2 border-transparent focus:border-green-200 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-800 outline-none transition-all"
      />
    </div>
  </div>
);

export default SignupPage;