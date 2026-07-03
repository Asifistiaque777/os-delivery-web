import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaUser, FaPhoneAlt, FaMapMarkerAlt, FaRoad, FaHome,
  FaEdit, FaSave, FaTimes, FaShoppingBag, FaSignOutAlt,
  FaCheckCircle, FaClock, FaMotorcycle, FaBox, FaSpinner
} from 'react-icons/fa';

/* ── Order Status Badge ─────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    received  : { label: 'Received',   color: 'bg-blue-100 text-blue-700',   icon: <FaBox size={10} /> },
    taken     : { label: 'On The Way', color: 'bg-yellow-100 text-yellow-700', icon: <FaMotorcycle size={10} /> },
    completed : { label: 'Delivered',  color: 'bg-green-100 text-green-700',  icon: <FaCheckCircle size={10} /> },
  };
  const s = map[status] || { label: status, color: 'bg-gray-100 text-gray-600', icon: <FaClock size={10} /> };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${s.color}`}>
      {s.icon} {s.label}
    </span>
  );
};

/* =====================================================
    👤 PROFILE PAGE (100% CHECKOUT PAGE MATCHED)
===================================================== */
const ProfilePage = ({ useAuthData, setPage }) => {
  const { user, profile, logout, updateProfileData, fetchMyOrders } = useAuthData;

  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [orders, setOrders]       = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [saveMsg, setSaveMsg]     = useState('');

  // Form State (Hoveho Checkout form-data fields matched)
  const [form, setForm] = useState({
    name: '', phone: '', location: '', block: '', road: '', house: '',
  });

  // Populate data safely
  useEffect(() => {
    if (profile || user) {
      setForm({
        name    : profile?.name    || user?.displayName || '',
        phone   : profile?.phone   || '',
        location: profile?.location || '',
        block   : profile?.block   || '',
        road    : profile?.road    || '',
        house   : profile?.house   || '',
      });
    }
  }, [profile, user]);

  // Fetch orders
  useEffect(() => {
    const getOrders = async () => {
      try {
        setOrdersLoading(true);
        const data = await fetchMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };
    if (user) getOrders();
  }, [user]);

  const recentOrders = orders.filter(o => o.status === 'received' || o.status === 'taken');
  const pastOrders   = orders.filter(o => o.status === 'completed');

  const handleSave = async () => {
    if (editing && !form.block) {
      alert('দয়া করে আপনার বসুন্ধরা আর/এ এর ব্লক সিলেক্ট করুন।');
      return;
    }
    setSaving(true);
    const result = await updateProfileData(form);
    setSaving(false);
    if (result.success) {
      setEditing(false);
      setSaveMsg('Profile updated successfully ✅');
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  const handleLogout = async () => {
    await logout();
    setPage('Home');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 pt-24 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Avatar + Name ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex items-center gap-6"
        >
          <div className="w-20 h-20 rounded-3xl bg-gray-900 flex items-center justify-center text-white text-3xl font-black flex-shrink-0">
            {(form.name || user?.displayName || user?.email || '?').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-left">
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">
              {form.name || user?.displayName || 'OS Customer'}
            </h2>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all shadow-sm"
          >
            <FaSignOutAlt /> Logout
          </button>
        </motion.div>

        {/* ── Saved Address (Form matched with Checkout Details) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="text-left">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Shipping Address</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Auto-fill at checkout</p>
            </div>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-md"
              >
                <FaEdit size={12} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all"
                >
                  <FaTimes size={13} />
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-green-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all disabled:opacity-50 shadow-md"
                >
                  {saving ? <FaSpinner className="animate-spin" /> : <><FaSave size={12} /> Save</>}
                </button>
              </div>
            )}
          </div>

          {saveMsg && (
            <p className="text-[11px] text-green-600 font-black bg-green-50 px-4 py-2 rounded-xl mb-4 text-left">
              {saveMsg}
            </p>
          )}

          <div className="space-y-5 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recipient / Full Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Recipient Name</label>
                <div className="relative"><FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="E.g. Asif Shawon" disabled={!editing} className={`w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-800 border-2 outline-none transition-all ${editing ? 'bg-gray-50 border-green-200 focus:border-green-400 focus:bg-white' : 'bg-gray-50/50 border-transparent text-gray-500'}`} />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative"><FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} type="tel" placeholder="01XXXXXXXXX" disabled={!editing} className={`w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-800 border-2 outline-none transition-all ${editing ? 'bg-gray-50 border-green-200 focus:border-green-400 focus:bg-white' : 'bg-gray-50/50 border-transparent text-gray-500'}`} />
                </div>
              </div>
            </div>

            {/* Landmark / Location */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Landmark / Location</label>
              <div className="relative"><FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="E.g. Near IUB" disabled={!editing} className={`w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-800 border-2 outline-none transition-all ${editing ? 'bg-gray-50 border-green-200 focus:border-green-400 focus:bg-white' : 'bg-gray-50/50 border-transparent text-gray-500'}`} />
              </div>
            </div>

            {/* Block Picker (100% Checkout Page Logic Matched 🎯) */}
            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Pick Your Block</label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {['A','B','C','D','E','F','G','H','I','J','K','L','M','N'].map(b => (
                  <button
                    key={b} type="button"
                    disabled={!editing}
                    onClick={() => setForm({ ...form, block: b })}
                    className={`h-11 rounded-xl font-black text-xs transition-all duration-200 border-2 ${
                      form.block === b
                        ? 'bg-gray-900 border-gray-900 text-white shadow-md'
                        : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100 disabled:hover:bg-gray-50'
                    } ${!editing && 'cursor-default opacity-70'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Road Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Road Number</label>
                <div className="relative"><FaRoad className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  <input value={form.road} onChange={e => setForm({...form, road: e.target.value})} placeholder="Road 05" disabled={!editing} className={`w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-800 border-2 outline-none transition-all ${editing ? 'bg-gray-50 border-green-200 focus:border-green-400 focus:bg-white' : 'bg-gray-50/50 border-transparent text-gray-500'}`} />
                </div>
              </div>

              {/* House / Flat */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">House / Flat</label>
                <div className="relative"><FaHome className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                  <input value={form.house} onChange={e => setForm({...form, house: e.target.value})} placeholder="House 12" disabled={!editing} className={`w-full rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-gray-800 border-2 outline-none transition-all ${editing ? 'bg-gray-50 border-green-200 focus:border-green-400 focus:bg-white' : 'bg-gray-50/50 border-transparent text-gray-500'}`} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 🔴 RECENT ORDERS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 text-left"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center text-white animate-pulse">
              <FaMotorcycle size={16} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Recent Orders</h3>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Live order tracking</p>
            </div>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-6"><FaSpinner className="animate-spin text-green-500 text-xl" /></div>
          ) : recentOrders.length === 0 ? (
            <p className="text-gray-400 font-bold text-xs text-center py-4">No active orders right now 🚚</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map(order => (
                <div key={order.id} className="p-5 rounded-[24px] border-2 border-green-100 bg-green-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <span className="bg-green-500 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest animate-bounce inline-block mb-1">Live</span>
                    <p className="text-xs font-black text-gray-800 uppercase">Order #{order.id.substring(0, 8)}</p>
                    <p className="text-[11px] text-gray-500 font-bold mt-1">Total Items: {(order.items || []).length}</p>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <StatusBadge status={order.status} />
                    <span className="text-xl font-black text-gray-900">৳{order.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── 🛍️ PAST ORDERS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 text-left"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
              <FaShoppingBag size={16} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Past Orders</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Your order history</p>
            </div>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-6"><FaSpinner className="animate-spin text-gray-400 text-xl" /></div>
          ) : pastOrders.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400 font-bold text-xs">No completed orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastOrders.map((order) => {
                const date = order.receivedAt?.toDate?.()
                  ? order.receivedAt.toDate().toLocaleDateString('bn-BD')
                  : '—';
                return (
                  <div key={order.id} className="p-5 rounded-[24px] border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Order #{order.id.substring(0, 8)}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5">{date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.status} />
                        <span className="text-lg font-black text-gray-900">৳{order.totalAmount}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {(order.items || []).slice(0, 3).map((item, i) => (
                        <p key={i} className="text-[11px] text-gray-500 font-bold">
                          <span className="text-green-500 mr-1">{item.quantity}x</span> {item.name}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default ProfilePage;