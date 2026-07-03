import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser, FaTimes, FaGoogle } from 'react-icons/fa';

/* =====================================================
    🔐 AUTH MODAL — Login / Register (RIDER BLOCK FIXED)
===================================================== */
const AuthModal = ({ isOpen, onClose, useAuth }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, register, loginWithGoogle, authError, setAuthError } = useAuth;

  const handleChange = (e) => {
    setAuthError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚨 রাইডার বাস্টার সিকিউরিটি গার্ড লক 🔒
    if (form.email.toLowerCase().endsWith('@osrider.com')) {
      setAuthError('রাইডাররা কাস্টমার প্যানেলে প্রবেশ করতে পারবেন না। দয়া করে রাইডার ড্যাশবোর্ড ব্যবহার করুন।');
      return;
    }

    setLoading(true);
    const result = mode === 'login'
      ? await login({ email: form.email, password: form.password })
      : await register({ name: form.name, email: form.email, password: form.password });
    setLoading(false);
    if (result.success) onClose();
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const result = await loginWithGoogle();
    setGoogleLoading(false);
    if (result.success) onClose();
  };

  const switchMode = () => {
    setAuthError('');
    setForm({ name: '', email: '', password: '' });
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-[10001] px-4"
          >
            <div className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl relative">

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all"
              >
                <FaTimes size={14} />
              </button>

              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
                  {mode === 'login' ? 'Welcome Back 👋' : 'Create Account ✨'}
                </h2>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {mode === 'login' ? 'Sign in to your account' : 'Join OS Delivery today'}
                </p>
              </div>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all font-black text-sm text-gray-700 mb-6 disabled:opacity-50"
              >
                {googleLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
                ) : (
                  <>
                    <FaGoogle className="text-red-500" size={18} />
                    Continue with Google
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">or</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-500 transition-colors" size={14} />
                    <input
                      name="name"
                      type="text"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-200 focus:bg-white rounded-2xl py-4 pl-10 pr-4 text-sm font-bold text-gray-800 outline-none transition-all"
                    />
                  </div>
                )}

                <div className="relative group">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-500 transition-colors" size={14} />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-200 focus:bg-white rounded-2xl py-4 pl-10 pr-4 text-sm font-bold text-gray-800 outline-none transition-all"
                  />
                </div>

                <div className="relative group">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-500 transition-colors" size={14} />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border-2 border-transparent focus:border-green-200 focus:bg-white rounded-2xl py-4 pl-10 pr-4 text-sm font-bold text-gray-800 outline-none transition-all"
                  />
                </div>

                {authError && (
                  <p className="text-[11px] text-red-500 font-black bg-red-50 px-4 py-2 rounded-xl">
                    ⚠ {authError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gray-900 hover:bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    mode === 'login' ? 'Sign In ➔' : 'Create Account ➔'
                  )}
                </button>
              </form>

              {/* Switch mode */}
              <p className="text-center text-[11px] font-bold text-gray-400 mt-6">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <button
                  onClick={switchMode}
                  className="text-green-600 font-black ml-1 hover:underline"
                >
                  {mode === 'login' ? 'Register' : 'Login'}
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;