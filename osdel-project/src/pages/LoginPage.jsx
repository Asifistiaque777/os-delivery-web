import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaGoogle, FaArrowRight, FaChevronLeft } from 'react-icons/fa';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

/* =====================================================
    🔐 LOGIN PAGE (FIXED)
    — Email + Password login
    — Google login
    — Forgot Password (inline)
    — Continue as Guest
===================================================== */
const LoginPage = ({ useAuthData, setPage }) => {
  const { login, loginWithGoogle, authError, setAuthError, user } = useAuthData; // 👈 user অবজেক্টটি এখানে নিয়ে আসা হলো

  const [mode, setMode]               = useState('login'); // 'login' | 'forgot'
  const [form, setForm]               = useState({ email: '', password: '' });
  const [loading, setLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [resetEmail, setResetEmail]     = useState('');
  const [resetSent, setResetSent]       = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError]     = useState('');

  const auth = getAuth();

  /* ── 🔄 অটো-রিডাইরেক্ট ফিক্স ── */
  useEffect(() => {
    // ব্যাকগ্রাউন্ডে বা গুগল দিয়ে সাকসেসফুলি লগইন হওয়ামাত্র ইউজার ট্রু হবে এবং পেজ চেঞ্জ হয়ে যাবে
    if (user) {
      setPage('Checkout');
    }
  }, [user, setPage]);

  const handleChange = (e) => {
    setAuthError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ── Email login ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login({ email: form.email, password: form.password });
    setLoading(false);
    if (result.success) setPage('Checkout');
  };

  /* ── Google login ── */
  const handleGoogle = async () => {
    setGoogleLoading(true);
    const result = await loginWithGoogle();
    setGoogleLoading(false);
    if (result.success) setPage('Checkout');
  };

  /* ── Forgot password ── */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch (err) {
      const map = {
        'auth/user-not-found': 'এই email এ কোনো account নেই।',
        'auth/invalid-email' : 'সঠিক email দিন।',
      };
      setResetError(map[err.code] || 'কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setResetLoading(false);
    }
  };

  /* ── Guest continue ── */
  const handleGuestContinue = () => setPage('Checkout');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-20">

      {/* Back */}
      <button
        onClick={() => setPage('Home')}
        className="fixed top-24 left-6 flex items-center gap-2 text-[11px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors"
      >
        <FaChevronLeft size={10} /> Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-gray-100">

          <AnimatePresence mode="wait">

            {/* ══ LOGIN ══ */}
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
                    Sign In 👋
                  </h2>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    Login to continue to checkout
                  </p>
                </div>

                {/* Google */}
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={googleLoading}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all font-black text-sm text-gray-700 mb-6 disabled:opacity-50"
                >
                  {googleLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-green-500 rounded-full animate-spin" />
                  ) : (
                    <><FaGoogle className="text-red-500" size={18} /> Continue with Google</>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative group">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-500 transition-colors" size={14} />
                    <input
                      name="email" type="email" placeholder="Email Address"
                      value={form.email} onChange={handleChange} required
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-200 focus:bg-white rounded-2xl py-4 pl-10 pr-4 text-sm font-bold text-gray-800 outline-none transition-all"
                    />
                  </div>

                  <div className="relative group">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-500 transition-colors" size={14} />
                    <input
                      name="password" type="password" placeholder="Password"
                      value={form.password} onChange={handleChange} required
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-green-200 focus:bg-white rounded-2xl py-4 pl-10 pr-4 text-sm font-bold text-gray-800 outline-none transition-all"
                    />
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => { setAuthError(''); setMode('forgot'); }}
                      className="text-[11px] font-black text-gray-400 hover:text-green-600 uppercase tracking-widest transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {authError && (
                    <p className="text-[11px] text-red-500 font-black bg-red-50 px-4 py-2 rounded-xl">⚠ {authError}</p>
                  )}

                  <button
                    type="submit" disabled={loading}
                    className="w-full py-4 bg-gray-900 hover:bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading
                      ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <>Sign In <FaArrowRight size={13} /></>
                    }
                  </button>
                </form>

                <p className="text-center text-[11px] font-bold text-gray-400 mt-5">
                  New here?{' '}
                  <button
                    onClick={() => setPage('Register')}
                    className="text-green-600 font-black hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </motion.div>
            )}

            {/* ══ FORGOT PASSWORD ══ */}
            {mode === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button
                  onClick={() => { setMode('login'); setResetSent(false); setResetError(''); setResetEmail(''); }}
                  className="flex items-center gap-2 text-[11px] font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors mb-8"
                >
                  <FaChevronLeft size={10} /> Back to Login
                </button>

                <div className="mb-8">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
                    Reset Password 🔑
                  </h2>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    We'll send a reset link to your email
                  </p>
                </div>

                {resetSent ? (
                  <div className="text-center py-8">
                    <span className="text-5xl block mb-4">📧</span>
                    <p className="font-black text-gray-900 text-lg uppercase tracking-tighter">Email Sent!</p>
                    <p className="text-[11px] text-gray-400 font-bold mt-2">
                      Check your inbox at <span className="text-green-600">{resetEmail}</span>
                    </p>
                    <button
                      onClick={() => { setMode('login'); setResetSent(false); setResetEmail(''); }}
                      className="mt-6 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 transition-all"
                    >
                      Back to Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="relative group">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-green-500 transition-colors" size={14} />
                      <input
                        type="email" placeholder="Your Email Address"
                        value={resetEmail}
                        onChange={(e) => { setResetError(''); setResetEmail(e.target.value); }}
                        required
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-green-200 focus:bg-white rounded-2xl py-4 pl-10 pr-4 text-sm font-bold text-gray-800 outline-none transition-all"
                      />
                    </div>

                    {resetError && (
                      <p className="text-[11px] text-red-500 font-black bg-red-50 px-4 py-2 rounded-xl">⚠ {resetError}</p>
                    )}

                    <button
                      type="submit" disabled={resetLoading}
                      className="w-full py-4 bg-gray-900 hover:bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {resetLoading
                        ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <>Send Reset Link <FaArrowRight size={13} /></>
                      }
                    </button>
                  </form>
                )}
              </motion.div>
            )}

          </AnimatePresence>

          {/* ══ GUEST CONTINUE — সবার নিচে ══ */}
          {!resetSent && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-[10px] font-black text-gray-700 uppercase tracking-widest mb-4">
                Don't want to login?
              </p>
              <button
                onClick={handleGuestContinue}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-500 hover:border-gray-400 text-green-600 hover:text-gray-700 font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                Continue as Guest <FaArrowRight size={13} />
              </button>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;