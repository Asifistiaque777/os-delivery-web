// CreateAccount.jsx — onSignupSuccess flow ঠিক আছে

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaRoad,
  FaHome,
  FaUserPlus,
} from 'react-icons/fa';

const CreateAccount = ({
  signup,
  updateUserProfile,
  setAlert,
  setPage,
  onSignupSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    location: '',
    block: '',
    road: '',
    house: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { name, phone, email, password, block, road, house } = formData;

    if (!name || !phone || !email || !password || !block || !road || !house) {
      return setAlert({
        message: 'সবগুলো তথ্য প্রদান করা বাধ্যতামূলক!',
        type: 'error',
      });
    }

    if (password.length < 6) {
      return setAlert({
        message: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',
        type: 'error',
      });
    }

    setIsSubmitting(true);

    try {
      // ✅ useFirebase থেকে আসা signup function
      const res = await signup(email, password);
      const uid = res.user.uid;

      const addressData = {
        block: formData.block,
        road: formData.road,
        house: formData.house,
        landmark: formData.location,
      };

      // ✅ useFirebase থেকে আসা updateUserProfile function
      await updateUserProfile(uid, {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: addressData,
        role: 'customer',
        createdAt: new Date().toISOString(),
      });

      setAlert({
        message: 'অ্যাকাউন্ট তৈরি সফল হয়েছে! এখন লগইন করে অর্ডার সম্পন্ন করুন।',
        type: 'success',
      });

      // ✅ App.jsx এর handleSignupSuccess কল হবে
      // সে postLoginTarget মনে রেখে Login পেজে নিয়ে যাবে
      setTimeout(() => {
        if (onSignupSuccess) {
          onSignupSuccess();
        } else {
          setPage('Login');
        }
      }, 1800);
    } catch (error) {
      let errorMessage = error.message;

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে।';
      }
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'সঠিক ইমেইল দিন।';
      }
      if (error.code === 'auth/weak-password') {
        errorMessage = 'পাসওয়ার্ড আরও শক্তিশালী দিন।';
      }

      setAlert({
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-32 pt-28 relative overflow-hidden">
      {/* Decorative BG */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -z-10" />

      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[45px] p-8 md:p-12 shadow-2xl border border-gray-100"
        >
          {/* Header */}
          <div className="flex items-center gap-5 mb-10 border-b pb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <FaUserPlus size={24} />
            </div>

            <div>
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                Join OS Delivery
              </h2>

              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">
                Complete all details to register
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-8">
            {/* Personal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup
                label="Full Name"
                icon={<FaUser />}
                name="name"
                placeholder="E.g. Asif Shawon"
                value={formData.name}
                onChange={handleChange}
              />

              <FormGroup
                label="Phone Number"
                icon={<FaPhoneAlt />}
                name="phone"
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormGroup
                label="Email Address"
                icon={<FaEnvelope />}
                name="email"
                type="email"
                placeholder="asif@example.com"
                value={formData.email}
                onChange={handleChange}
              />

              <FormGroup
                label="Create Password"
                icon={<FaLock />}
                name="password"
                type="password"
                placeholder="Min. 6 chars"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="pt-6 border-t border-gray-100 space-y-8">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
                <FaMapMarkerAlt className="text-red-500" />
                Delivery Address
              </h3>

              <FormGroup
                label="Landmark / Area (Optional)"
                icon={<FaMapMarkerAlt />}
                name="location"
                placeholder="E.g. Near Independent University"
                value={formData.location}
                onChange={handleChange}
                required={false}
              />

              {/* Block */}
              <div className="space-y-4">
                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">
                  Pick Your Block
                </label>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                  {['A','B','C','D','E','F','G','H','I','J','K','L','M','N'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setFormData({ ...formData, block: b })}
                      className={`h-12 rounded-xl font-black text-sm transition-all border-2 ${
                        formData.block === b
                          ? 'bg-gray-900 border-gray-900 text-white scale-105 shadow-md'
                          : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Road House */}
              <div className="grid grid-cols-2 gap-6">
                <FormGroup
                  label="Road Number"
                  icon={<FaRoad />}
                  name="road"
                  placeholder="Road 05"
                  value={formData.road}
                  onChange={handleChange}
                />

                <FormGroup
                  label="House / Flat"
                  icon={<FaHome />}
                  name="house"
                  placeholder="House 12"
                  value={formData.house}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-7 rounded-[30px] bg-blue-600 text-white font-black text-sm uppercase tracking-[0.4em] shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-4 mt-10 disabled:opacity-60"
            >
              {isSubmitting ? 'Creating Account...' : 'Create My Account ➔'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

/* ================= Reusable Input ================= */
const FormGroup = ({ label, icon, required = true, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
      {label}
    </label>

    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>

      <input
        {...props}
        required={required}
        className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-[20px] py-4 pl-12 pr-6 text-sm font-bold text-gray-800 outline-none transition-all"
      />
    </div>
  </div>
);

export default CreateAccount;