import React, { useState } from 'react';
import { FaFacebookF, FaWhatsapp, FaEnvelope, FaChevronUp, FaUserShield, FaMotorcycle, FaInfoCircle, FaRocket } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_NAME } from '../utils/constants';

const Footer = ({ setPage, userId }) => {
  const [open, setOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-white pt-24 pb-12 overflow-hidden border-t border-gray-100">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-10 w-72 h-72 bg-green-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-blue-50 rounded-full blur-[120px] opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          
          {/* 1. Brand Section */}
          <div className="md:col-span-4 space-y-6">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex flex-col cursor-pointer" 
              onClick={() => setPage('Home')}
            >
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">
                {APP_NAME}
              </h2>
              <span className="text-xs font-black text-green-500 uppercase tracking-[0.4em] mt-2 ml-1">
                OS Delivery
              </span>
            </motion.div>
            <p className="text-gray-500 text-sm leading-relaxed font-medium max-w-sm">
              আপনার পছন্দের খাবার এবং নিত্যপ্রয়োজনীয় পণ্য নিয়ে আমরা আছি আপনার পাশে। দ্রুততম ডেলিভারি এবং সেরা সেবার নিশ্চয়তা।
            </p>
            <div className="flex gap-3">
               {[
                 { icon: <FaFacebookF />, color: 'hover:bg-blue-600', link: 'https://facebook.com/orientalstreet7' },
                 { icon: <FaWhatsapp />, color: 'hover:bg-green-500', link: 'https://wa.me/8801566056148' },
                 { icon: <FaEnvelope />, color: 'hover:bg-red-500', link: 'mailto:shawonasif40@gmail.com' }
               ].map((social, idx) => (
                 <motion.a 
                   key={idx}
                   href={social.link}
                   target="_blank"
                   whileHover={{ y: -5, scale: 1.1 }}
                   className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 ${social.color} hover:text-white transition-all shadow-sm border border-gray-100`}
                 >
                   {social.icon}
                 </motion.a>
               ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="md:col-span-2">
            <h4 className="font-black text-gray-900 uppercase text-[11px] tracking-[0.2em] mb-8">Navigation</h4>
            <ul className="space-y-4">
              <FooterLink onClick={() => setPage('Home')} icon={<FaInfoCircle size={12}/>} label="Home" />
              <FooterLink onClick={() => setPage('About')} icon={<FaInfoCircle size={12}/>} label="About Us" />
            </ul>
          </div>

          {/* 3. Portals */}
          <div className="md:col-span-3">
            <h4 className="font-black text-gray-900 uppercase text-[11px] tracking-[0.2em] mb-8">Portals</h4>
            <div className="flex flex-col gap-3">
              <PortalButton 
                onClick={() => setPage('AdminLogin')} 
                icon={<FaUserShield />} 
                label="Admin Panel" 
                color="hover:border-blue-500 hover:text-blue-600"
              />
              <PortalButton 
                onClick={() => setPage('RiderLogin')} 
                icon={<FaMotorcycle />} 
                label="Rider Portal" 
                color="hover:border-orange-500 hover:text-orange-600"
              />
            </div>
          </div>

          {/* 4. DESIGNED CONTACT SECTION */}
          <div className="md:col-span-3">
            <div className="relative p-8 bg-slate-900 rounded-[32px] overflow-hidden group shadow-2xl">
              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all duration-500" />
              
              <div className="relative z-10 space-y-6">
                <div className="space-y-2">
                  <h4 className="text-white font-black text-lg uppercase leading-tight tracking-tighter italic">
                    For Personal & <br />
                    <span className="text-green-500">Custom Order</span> <br />
                    Contact Us
                  </h4>
                  <div className="h-1.5 w-12 bg-green-500 rounded-full" />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setOpen(!open)}
                  className="w-full h-14 bg-green-500 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_10px_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-3 transition-all hover:bg-white"
                >
                  {open ? '✕ Close Menu' : (
                    <>
                      <FaRocket className="animate-pulse" />
                      Contact Now
                    </>
                  )}
                </motion.button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-3 gap-3 pt-2"
                    >
                      <ContactIcon href="https://wa.me/8801566056148" icon={<FaWhatsapp />} color="bg-green-500/20 text-green-500" />
                      <ContactIcon href="https://facebook.com/orientalstreet7" icon={<FaFacebookF />} color="bg-blue-500/20 text-blue-500" />
                      <ContactIcon href="mailto:shawonasif40@gmail.com" icon={<FaEnvelope />} color="bg-red-500/20 text-red-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
              © {new Date().getFullYear()} {APP_NAME} — Crafted with Love.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: '#10B981', color: '#fff' }}
            onClick={scrollToTop}
            className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 transition-all shadow-sm border border-gray-100"
          >
            <FaChevronUp size={14} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

/* --- Helper Components --- */

const ContactIcon = ({ href, icon, color }) => (
  <motion.a 
    href={href} 
    target="_blank"
    whileHover={{ y: -5 }}
    className={`h-12 flex items-center justify-center rounded-xl text-xl transition-all border border-white/5 ${color} hover:bg-white hover:text-slate-900`}
  >
    {icon}
  </motion.a>
);

const FooterLink = ({ onClick, icon, label }) => (
  <li>
    <button onClick={onClick} className="text-gray-500 hover:text-green-600 font-bold text-sm transition-all flex items-center gap-3 group">
      <span className="text-gray-300 group-hover:text-green-500 transition-colors">{icon}</span>
      {label}
    </button>
  </li>
);

const PortalButton = ({ onClick, icon, label, color }) => (
  <motion.button
    whileHover={{ x: 5 }}
    onClick={onClick}
    className={`w-full p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4 text-gray-500 transition-all group ${color} shadow-sm`}
  >
    <span className="text-lg group-hover:scale-110 transition-transform">{icon}</span>
    <span className="font-black text-[11px] uppercase tracking-widest">{label}</span>
  </motion.button>
);

export default Footer;             