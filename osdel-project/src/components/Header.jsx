import React, { useState, useEffect, useMemo } from 'react';
import { SUBCATEGORIES, CATEGORIES, WHATSAPP_NUMBER } from '../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';
import { getAuth, signOut } from 'firebase/auth'; // অফিশিয়াল ফায়ারবেস সাইনআউট

const Header = ({ setPage, setActiveCategory, setActiveSubCategory, useAuthData }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // 📲 PWA Install Prompt States
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const { user, logout } = useAuthData;

  /* ── 📲 PWA বাটন হ্যান্ডলার ও স্ট্যান্ডঅ্যালোন চেক ── */
  useEffect(() => {
    // ১. অ্যাপটি অলরেডি ইনস্টল করা অবস্থায় ওপেন হয়েছে কিনা তা চেক
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone === true || 
        document.referrer.includes('android-app://');

      if (isStandaloneMode) {
        setIsInstalled(true);
      }
    };

    checkStandalone();

    // ডিসপ্লে মোড রানটাইমে পরিবর্তন হলে লিসেন করা
    const matchDisplay = window.matchMedia('(display-mode: standalone)');
    const handleDisplayChange = (evt) => {
      if (evt.matches) setIsInstalled(true);
    };
    matchDisplay.addEventListener('change', handleDisplayChange);

    // ২. ব্রাউজারে ইনস্টল ইভেন্ট ধরা
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // সফলভাবে ইনস্টল হয়ে গেলে বাটন ভ্যানিশ
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      matchDisplay.removeEventListener('change', handleDisplayChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      alert("অ্যাপটি ইনস্টল করতে ব্রাউজারের ওপরের থ্রি-ডট (⋮) মেনুতে চাপ দিয়ে 'Install app' অথবা 'Add to Home Screen' সিলেক্ট করুন।");
    }
  };

  /* ── 🔄 পপ-আপ চিরতরে আটকানোর এবং রাইডার বাস্টার লজিক (রাইডার পেজ এক্সেপশন ফিক্সড 🎯) ── */
  useEffect(() => {
    if (user) {
      const isAtRiderPage = window.location.hash.toLowerCase().includes('rider');

      if (user.email && user.email.toLowerCase().endsWith('@osrider.com')) {
        if (!isAtRiderPage) {
          const auth = getAuth();
          signOut(auth);
          alert('রাইডাররা কাস্টমার প্যানেলে প্রবেশ করতে পারবেন না। দয়া করে রাইডার ড্যাশবোর্ড ব্যবহার করুন।');
          setShowAuthModal(false);
          return;
        }
      }
      
      setShowAuthModal(false);
    }
  }, [user]);

  const allSubCategories = useMemo(() => {
    let subs = [];
    Object.keys(SUBCATEGORIES).forEach(cat => {
      SUBCATEGORIES[cat].forEach(sub => {
        subs.push({ ...sub, category: cat });
      });
    });
    return subs;
  }, []);

  const handleSubCategoryClick = (sub) => {
    setActiveCategory(sub.category);
    setActiveSubCategory(sub.name);
    setPage('ItemList');
    setIsDrawerOpen(false);
  };

  const handleStoreClick = (store) => {
    setActiveCategory(store.name);
    setActiveSubCategory('');
    setPage('SubCategoryPage');
    setIsDrawerOpen(false);
  };

  // Profile icon — logged in হলে initial, না হলে icon
  const ProfileButton = () => {
    if (user && !user.email?.toLowerCase().endsWith('@osrider.com')) {
      const initial = (user.displayName || user.email || '?').charAt(0).toUpperCase();
      return (
        <button
          onClick={() => setPage('Profile')}
          className="w-10 h-10 rounded-2xl bg-green-500 text-white font-black text-sm flex items-center justify-center hover:bg-green-600 transition-all shadow-md shadow-green-200"
          title="My Profile"
        >
          {initial}
        </button>
      );
    }
    return (
      <button
        onClick={() => setShowAuthModal(true)}
        className="w-10 h-10 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
        title="Login"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>
    );
  };

  return (
    <>
      {/* --- HEADER BAR --- */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-[999] bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex flex-col cursor-pointer" onClick={() => setPage('Home')}>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter leading-none">Oriental Street - OS Rush</h1>
            <span className="text-[10px] font-bold text-green-500 tracking-[0.3em] uppercase ml-1">OS Delivery</span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* 📲 PREMIUM MODERN INSTALL APP BUTTON (অ্যাপ ইনস্টল থাকলে দেখাবে না) */}
            {!isInstalled && (
              <motion.button
                whileHover={{ y: -1, scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleInstallClick}
                className="group relative flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-sm hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/10 transition-all cursor-pointer"
                title="Install OS Rush App"
              >
                {/* নিয়ন গ্রিন আইকন ব্যাজ */}
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-slate-950 shadow-inner">
                  <motion.svg
                    animate={{ y: [0, -1.5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="w-3.5 h-3.5 text-slate-950 stroke-[2.5]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </motion.svg>
                </div>

                {/* টেক্সট ও লাইভ পালস ডট */}
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-200 group-hover:text-white transition-colors">
                    Install App
                  </span>
                  <span className="relative flex h-1.5 w-1.5 ml-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                </div>
              </motion.button>
            )}

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gray-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-green-600 transition-all flex items-center gap-2"
            >
              <span className="text-lg">☰</span>
              <span className="hidden sm:inline">Categories</span>
            </button>
            <button
              onClick={() => setPage('Home')}
              className="px-4 py-2.5 text-gray-600 text-[11px] font-black uppercase tracking-widest hover:text-green-600 transition-colors hidden sm:block"
            >
              Home
            </button>
            <button
              onClick={() => setPage('About')}
              className="px-4 py-2.5 text-gray-600 text-[11px] font-black uppercase tracking-widest hover:text-green-600 transition-colors hidden sm:block"
            >
              About Us
            </button>

            {/* 👤 PROFILE / LOGIN BUTTON */}
            <ProfileButton />
          </div>
        </div>
      </motion.header>

      {/* --- AUTH MODAL --- */}
      {showAuthModal && !user && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          useAuth={useAuthData}
        />
      )}

      {/* --- SIDE DRAWER --- */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-[360px] bg-white z-[9999] shadow-2xl flex flex-col"
            >
              <div className="p-8 flex justify-between items-center border-b border-gray-50">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Explore</h2>
                  <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Fast & Fresh Delivery</p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                  Direct Sub-Categories
                </p>
                {allSubCategories.map(sub => (
                  <motion.button
                    key={sub.name + sub.category}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubCategoryClick(sub)}
                    className="w-full flex items-center gap-5 p-4 rounded-[24px] bg-white border border-gray-100 hover:border-green-500 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-green-50 transition-colors">
                      {sub.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-black text-gray-900 uppercase text-sm group-hover:text-green-600 transition-colors">{sub.name}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Browse Items →</p>
                    </div>
                  </motion.button>
                ))}

                <div className="mt-10 pt-8 border-t border-gray-100">
                  <p className="text-[11px] font-black text-gray-900 uppercase tracking-[0.2em] mb-4 ml-2">
                    Browse by Store Type
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {CATEGORIES.map(store => (
                      <button
                        key={store.name}
                        onClick={() => handleStoreClick(store)}
                        className="px-4 py-4 bg-gray-50 text-slate-900 hover:bg-green-500 hover:text-white rounded-2xl text-[10px] font-black uppercase transition-all text-center border border-transparent"
                      >
                        {store.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-50 bg-gray-50/50">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-green-200 hover:bg-green-600 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  Need Help? 💬
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;