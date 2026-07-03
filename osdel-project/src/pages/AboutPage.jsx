import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaEnvelope, FaCode, FaRocket, FaAward, FaLaptopCode, FaUserTie } from 'react-icons/fa';

const AboutPage = () => {
  // Co-Founders List
  const founders = [
    { name: 'ABU SAYEM', role: 'Co-Founder', info: 'NSU [BBA]', image: '/founder_a.jpg' },
    { name: 'ASIF ISTIAQUE SHAWON', role: 'Co-Founder', info: 'AIUB [CSE]', image: '/founder_b.jpg' },
    { name: 'MD RIDWANUZZAMAN', role: 'Co-Founder', info: 'AIUB [CSE]', image: '/founder_c.jpg' },
  ];

  // Lead Developer Highlight
  const developer = {
    name: 'ASIF ISTIAQUE SHAWON',
    role: 'Lead Full-Stack Developer',
    info: 'AIUB [CSE]',
    bio: 'The architect behind OS Delivery’s digital ecosystem. Currently engineering a seamless mobile application and an advanced real-time order tracking system to enhance user experience.',
    email: 'asifistiaque32@gmail.com',
    image: '/developer.jpg' // Fixed correct image
  };

  return (
    <div className="min-h-screen bg-white pb-32 pt-40">
      
      {/* --- SECTION 1: HERO --- */}
      <section className="max-w-7xl mx-auto px-6 mb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em] border-b-2 border-green-500 pb-2">
            Revolutionizing Delivery
          </span>
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-6">
          WE ARE <span className="text-green-500">OS DELIVERY.</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-gray-500 text-lg font-medium leading-relaxed">
          United by a shared goal to bring innovation and happiness to every doorstep through technology and dedicated service.
        </p>
      </section>

      {/* --- SECTION 2: CO-FOUNDERS (Simple & Professional) --- */}
      <section className="max-w-7xl mx-auto px-6 mb-48">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {founders.map((person, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="group text-center"
            >
              {/* Image with simple border hover */}
              <div className="relative mb-8 inline-block">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-gray-50 group-hover:border-green-500 transition-all duration-500 shadow-sm">
                  <img 
                    src={person.image} 
                    className="w-full h-full object-cover" 
                    alt={person.name} 
                  />
                </div>
              </div>

              {/* Minimalist Text */}
              <div className="space-y-1">
                <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">{person.role}</p>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                  {person.name}
                </h3>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-tight">{person.info}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SECTION 3: DEVELOPER SPOTLIGHT (Luxury Tech Style) --- */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden bg-gray-900 rounded-[60px] p-8 md:p-20 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-green-500/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Image Container */}
            <motion.div 
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -50 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-green-500 rounded-[48px] rotate-3 scale-105 opacity-20" />
              <img 
                src={developer.image} 
                className="relative z-10 w-full aspect-square object-cover rounded-[48px] shadow-2xl border-4 border-gray-800 transition-all duration-1000" 
                alt="Lead Developer" 
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl z-20 hidden md:block">
                <FaLaptopCode className="text-gray-900 text-3xl" />
              </div>
            </motion.div>

            {/* Right: Technical Content */}
            <div className="text-left space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-green-400 text-[10px] font-black uppercase tracking-[0.3em]">
                <FaCode /> Technology & Innovation
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                THE <span className="text-green-500">DEVELOPER.</span>
              </h2>

              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white uppercase">{developer.name}</h3>
                <p className="text-gray-400 text-lg leading-relaxed font-medium">
                  {developer.bio}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                  <FaAward className="text-green-500 mx-auto mb-3 text-2xl" />
                  <p className="text-white font-black text-[10px] uppercase tracking-widest">Quality Focus</p>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 text-center">
                  <FaRocket className="text-blue-400 mx-auto mb-3 text-2xl" />
                  <p className="text-white font-black text-[10px] uppercase tracking-widest">Speed Optimization</p>
                </div>
              </div>

              <motion.a 
                href={`mailto:${developer.email}`}
                whileHover={{ scale: 1.05 }}
                className="inline-block w-full text-center md:w-auto px-12 py-5 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-green-500/20 transition-all"
              >
                Contact Developer
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: FOOTER NOTE --- */}
      <section className="mt-32 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[1em] text-gray-500">
          Crafting Excellence for OS Delivery
        </p>
      </section>

    </div>
  );
};

export default AboutPage;