import React, { useState } from 'react';
import { useFirebase } from '../hooks/useFirebase'; 
import { FaDownload, FaFileCsv, FaLock, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { EXPORT_PASSCODE } from '../utils/constants';

const OrderExport = () => {
  const { orders, loading } = useFirebase();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === EXPORT_PASSCODE) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('ভুল পাসকোড! আবার চেষ্টা করুন।');
    }
  };

  const downloadCSV = () => {
    const filteredOrders = orders.filter(order => {
      if (!startDate || !endDate) return true;
      const orderDate = order.receivedAt?.toDate ? 
        order.receivedAt.toDate().toISOString().split('T')[0] : 
        new Date(order.date).toISOString().split('T')[0];
      return orderDate >= startDate && orderDate <= endDate;
    });

    if (filteredOrders.length === 0) {
      alert("এই তারিখে কোনো অর্ডার পাওয়া যায়নি!");
      return;
    }

    const headers = [
      "Order ID", "Customer Name", "Phone", "Email", 
      "Area/Landmark", "Block", "Road", "House", 
      "Special Instructions", "Items (with Shop Name)", "Total Amount", "Status", "Date"
    ];
    
    const csvRows = filteredOrders.map(order => {
      const name = order.name || order.customerDetails?.name || "N/A";
      const phone = order.phone || order.customerDetails?.phone || "N/A";
      const email = order.email || order.customerDetails?.email || "N/A";
      const location = order.address || order.customerDetails?.location || "N/A";
      const block = order.block || order.customerDetails?.block || "N/A";
      const road = order.road || order.customerDetails?.road || "N/A";
      const house = order.house || order.customerDetails?.house || "N/A";
      const comment = order.comment || order.customerDetails?.comment || "No Instruction";
      
      const orderDate = order.receivedAt?.toDate ? 
        order.receivedAt.toDate().toLocaleString('en-GB') : 
        (order.date || 'N/A');

      // --- আইটেম লিস্টের সাথে শপ নেম যোগ করা হয়েছে ---
      const itemsFormatted = order.items?.map(i => 
        `${i.name} (x${i.quantity}) [Shop: ${i.shopName || 'N/A'}]`
      ).join(' | ') || 'No Items';

      return [
        `"${order.id}"`,
        `"${name.replace(/"/g, '""')}"`,
        `'${phone}`, 
        `"${email}"`,
        `"${location.replace(/,/g, ' ').replace(/"/g, '""')}"`,
        `"${block}"`,
        `"${road}"`,
        `"${house}"`,
        `"${comment.replace(/,/g, ' ').replace(/"/g, '""')}"`,
        `"${itemsFormatted}"`, // এখানে এখন শপ নেম দেখাবে
        order.totalAmount || 0,
        order.status || 'received',
        `"${orderDate}"`
      ];
    });

    const csvContent = [headers, ...csvRows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' }); 
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `OS_Full_Report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <span className="loading loading-bars loading-lg text-green-500"></span>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6">
        <div className="w-full max-w-md bg-white border-[6px] border-slate-900 shadow-[20px_20px_0px_#22c55e] p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 border-4 border-green-500 shadow-xl">
              <FaLock className="text-3xl text-green-500" />
            </div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">SECURE ACCESS</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Authorized Personnel Only</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
               <input 
                type="password" 
                placeholder="ENTER PASSCODE" 
                className="w-full border-4 border-slate-900 p-5 outline-none focus:border-green-500 font-black text-center text-2xl tracking-[0.3em] bg-gray-50 text-slate-900 placeholder-slate-300 transition-all"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-600 text-xs font-black text-center uppercase tracking-tighter animate-bounce">{error}</p>}
            <button type="submit" className="w-full bg-slate-900 text-white py-6 font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg active:scale-95 text-lg">
              UNLOCK DATABASE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto bg-white border-[6px] border-slate-900 shadow-[30px_30px_0px_#22c55e] p-8 md:p-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div>
            <h1 className="text-6xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
              EXPORT <span className="text-green-500">REPORT</span>
            </h1>
            <div className="h-3 w-48 bg-slate-900 mt-4 rounded-full"></div>
          </div>
          <button 
            onClick={() => setIsAuthenticated(false)} 
            className="flex items-center gap-2 text-xs font-black uppercase bg-red-50 text-red-600 border-2 border-red-200 px-6 py-3 hover:bg-red-600 hover:text-white transition-all rounded-xl"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black uppercase text-slate-600 tracking-[0.2em]">
              <FaCalendarAlt className="text-green-500" /> Start Date
            </label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border-4 border-slate-900 p-5 focus:bg-green-50 outline-none font-black text-xl text-slate-900 shadow-[8px_8px_0px_#e2e8f0] focus:shadow-none transition-all"
            />
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-black uppercase text-slate-600 tracking-[0.2em]">
              <FaCalendarAlt className="text-red-500" /> End Date
            </label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border-4 border-slate-900 p-5 focus:bg-red-50 outline-none font-black text-xl text-slate-900 shadow-[8px_8px_0px_#e2e8f0] focus:shadow-none transition-all"
            />
          </div>
        </div>

        <button 
          onClick={downloadCSV}
          className="w-full bg-slate-900 text-white py-10 flex flex-col items-center justify-center gap-2 hover:bg-green-600 transition-all duration-500 group shadow-[0_20px_40px_rgba(0,0,0,0.2)] active:scale-95 border-b-8 border-slate-950"
        >
          <FaDownload className="text-4xl group-hover:animate-bounce mb-2" />
          <span className="text-2xl font-black uppercase tracking-[0.3em] italic">Generate Detailed Sheet</span>
          <span className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Format: CSV (MS EXCEL READY)</span>
        </button>

        <div className="mt-20 flex flex-col md:flex-row justify-between items-center text-slate-500 font-black text-xs uppercase tracking-[0.2em] border-t-4 border-slate-100 pt-10 gap-4">
          <div className="flex items-center gap-3 bg-slate-100 px-6 py-3 rounded-full border-2 border-slate-200">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span>Database: {orders.length} Records Found</span>
          </div>
          <div className="italic opacity-70">Generated at {new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  );
};

export default OrderExport;