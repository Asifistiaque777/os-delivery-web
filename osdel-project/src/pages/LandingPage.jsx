import React, { useMemo } from 'react';

const LandingPage = ({ shops, enterShop, menuItems }) => {
  const recommendations = useMemo(() => {
    return menuItems.filter(i => !i.isStockOut).sort(() => 0.5 - Math.random()).slice(0, 10);
  }, [menuItems]);

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black text-warning">বসুন্ধরার সেরা সব খাবার</h1>
        <p className="text-gray-400">আপনার প্রিয় শপ থেকে অর্ডার করুন মুহূর্তেই</p>
      </div>

      {/* Shop Grid */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
           🏪 আমাদের শপসমূহ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map(shop => (
            <div 
              key={shop.id} 
              onClick={() => enterShop(shop)}
              className="card bg-gray-900 border border-gray-800 hover:border-warning cursor-pointer transition-all overflow-hidden"
            >
              <figure className="h-44">
                <img src={shop.bannerURL || 'https://placehold.co/600x400/111827/white?text=OSD'} alt={shop.name} className="w-full h-full object-cover" />
              </figure>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{shop.name}</h3>
                  <p className="text-xs text-gray-500">{shop.address || 'বসুন্ধরা আবাসিক এলাকা'}</p>
                </div>
                <button className="btn btn-warning btn-sm">অর্ডার</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ⬇️ রিকমেন্ডেশন (X-Axis Scroll) ⬇️ */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-warning px-2">আপনার জন্য রিকমেন্ডেশন ✨</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide px-2">
          {recommendations.map(item => (
            <div key={item.id} className="min-w-[180px] bg-gray-900 rounded-2xl p-3 border border-gray-800 flex-shrink-0">
              <img src={item.imageURL} alt={item.name} className="w-full h-28 object-cover rounded-xl mb-2" />
              <h4 className="font-bold text-sm truncate">{item.name}</h4>
              <p className="text-warning font-black text-sm">৳ {item.price}</p>
              <p className="text-[9px] text-gray-500 uppercase mt-1 italic">{item.shopName}</p>
            </div> 
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;