import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CATEGORIES, SUBCATEGORIES, ADMIN_PASSCODE } from '../utils/constants';

// ── Upload config ─────────────────────────────────────────────
// Dev এ localhost:5173 থেকে full URL লাগবে, production এ relative
const UPLOAD_ENDPOINT = import.meta.env.DEV
  ? 'https://osdelivery.shop/upload.php'
  : '/upload.php';

const UPLOAD_SECRET = 'OSDEL_UPLOAD_2025';
// ─────────────────────────────────────────────────────────────

/* =====================================================
    📸 IMAGE UPLOAD FIELD
===================================================== */
const ImageUploadField = ({ value, onChange }) => {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value || '');

  useEffect(() => { setPreview(value || ''); }, [value]);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('শুধু image file upload করুন।');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size ৫ MB এর বেশি হবে না।');
      return;
    }

    setError('');
    setUploading(true);
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('secret', UPLOAD_SECRET);

      const res = await fetch(UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData,
        credentials: 'omit',
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      if (data.success) {
        onChange(data.url);
        setPreview(data.url);
        setError('');
      } else {
        setError(data.error || 'Upload failed');
        setPreview('');
        onChange('');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(`Connect হয়নি: ${err.message}`);
      setPreview('');
      onChange('');
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative flex flex-col items-center justify-center
          rounded-2xl border-2 border-dashed cursor-pointer
          transition-all duration-300 overflow-hidden
          ${uploading
            ? 'border-yellow-500 bg-yellow-500/5 cursor-wait'
            : 'border-gray-700 bg-gray-800 hover:border-green-500 hover:bg-green-500/5'
          }
          ${preview ? 'h-32' : 'h-24'}
        `}
      >
        {preview ? (
          <>
            <img src={preview} alt="preview" className="w-full h-full object-contain p-2" />
            {!uploading && (
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px] font-black uppercase tracking-widest">
                  Change Image
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <span className="text-3xl">{uploading ? '⏳' : '📸'}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {uploading ? 'Uploading...' : 'Click or drag image here'}
            </span>
            <span className="text-[9px] text-gray-600 font-bold">
              JPG, PNG, WEBP · Max 5MB
            </span>
          </div>
        )}

        {uploading && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700">
            <div className="h-full bg-yellow-500 animate-pulse w-2/3 rounded-full" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-[10px] text-red-400 font-black">⚠ {error}</p>
      )}
      {value && !error && (
        <p className="text-[9px] text-green-600 font-bold truncate">✅ {value}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
};

/* =====================================================
    🛠️ ADMIN PANEL
===================================================== */
const AdminPanel = ({
  menuItems = [],
  addProduct,
  deleteProduct,
  updateStockStatus,
  updateProductRecommendation,
  updateProductPrice,
  updateProductDiscount,
  updateProductDescription,
  setAlert,
  setPage,
}) => {
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    discount: 0,
    description: '',
    category: CATEGORIES[0].name,
    subCategory: SUBCATEGORIES[CATEGORIES[0].name]?.[0]?.name || '',
    imageURL: '',
    isStockOut: false,
    isRecommended: false,
  });

  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const subs = SUBCATEGORIES[newItem.category];
    setNewItem(prev => ({ ...prev, subCategory: subs?.[0]?.name || '' }));
  }, [newItem.category]);

  const filteredItems = useMemo(() =>
    menuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    ), [menuItems, searchTerm]);

  const groupedItems = useMemo(() =>
    CATEGORIES.reduce((acc, cat) => {
      const items = filteredItems.filter(item => item.category === cat.name);
      if (items.length > 0) acc[cat.name] = { title: cat.title, items };
      return acc;
    }, {}), [filteredItems]);

  const handleLogin = e => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) setIsAuthenticated(true);
    else setLoginError('Wrong Passcode!');
  };

  const handleAddProduct = async e => {
    e.preventDefault();
    if (!newItem.imageURL) {
      setAlert({ message: 'একটি image upload করুন।', type: 'error' });
      return;
    }
    setIsAdding(true);
    try {
      await addProduct({
        ...newItem,
        price: Number(newItem.price),
        discount: Number(newItem.discount || 0),
      });
      setNewItem({
        name: '', price: '', discount: 0, description: '',
        category: CATEGORIES[0].name,
        subCategory: SUBCATEGORIES[CATEGORIES[0].name]?.[0]?.name || '',
        imageURL: '', isStockOut: false, isRecommended: false,
      });
      setAlert({ message: 'Item Added Successfully!', type: 'success' });
    } catch {
      setAlert({ message: 'Failed to add item.', type: 'error' });
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditPrice = async (item) => {
    const val = window.prompt(`${item.name} এর নতুন দাম:`, item.price);
    if (!val || isNaN(val)) return;
    try {
      await updateProductPrice(item.id, Number(val));
      setAlert({ message: 'Price Updated!', type: 'success' });
    } catch { setAlert({ message: 'Failed.', type: 'error' }); }
  };

  const handleEditDiscount = async (item) => {
    const val = window.prompt(`${item.name} এর ডিসকাউন্ট (%):`, item.discount || 0);
    if (val === null || isNaN(val)) return;
    try {
      await updateProductDiscount(item.id, Number(val));
      setAlert({ message: 'Discount Updated!', type: 'success' });
    } catch { setAlert({ message: 'Failed.', type: 'error' }); }
  };

  const handleEditDescription = async (item) => {
    const val = window.prompt(`${item.name} এর ডেসক্রিপশন:`, item.description || '');
    if (val === null) return;
    try {
      await updateProductDescription(item.id, val);
      setAlert({ message: 'Description Updated!', type: 'success' });
    } catch { setAlert({ message: 'Failed.', type: 'error' }); }
  };

  /* ── Login Screen ── */
  if (!isAuthenticated) {
    return (
      <div className="py-20 bg-gray-950 min-h-screen flex items-center justify-center text-white px-4">
        <div className="w-full max-w-md bg-gray-900 p-8 rounded-[32px] border border-gray-800 shadow-2xl">
          <h2 className="text-3xl font-black text-center mb-6 text-warning uppercase italic tracking-tighter">
            Admin Access
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Passcode"
              className="input input-bordered w-full bg-gray-800 border-none"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              required
            />
            {loginError && (
              <p className="text-error text-center text-xs font-bold">{loginError}</p>
            )}
            <button type="submit" className="btn btn-warning btn-block rounded-2xl font-black">
              LOGIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Main Panel ── */
  return (
    <div className="py-24 px-4 bg-gray-950 min-h-screen text-white pb-40">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h2 className="text-3xl font-black text-warning uppercase italic tracking-tighter">
            Admin Panel
          </h2>
          <div className="flex gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="🔍 Search items..."
              className="input input-bordered bg-gray-900 border-gray-800 w-full md:w-64 rounded-xl"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-error btn-circle" onClick={() => setIsAuthenticated(false)}>✕</button>
          </div>
        </div>

        {/* ── Add New Item ── */}
        <div className="mb-16 p-8 bg-gray-900 rounded-[40px] border border-gray-800 shadow-xl">
          <h3 className="text-xl font-black mb-6 text-green-500 uppercase">✨ Add New Item</h3>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <input type="text" placeholder="Item Name"
              className="input bg-gray-800 border-none rounded-2xl font-bold"
              value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })}
              required />

            <input type="number" placeholder="Price (৳)"
              className="input bg-gray-800 border-none rounded-2xl font-bold"
              value={newItem.price}
              onChange={e => setNewItem({ ...newItem, price: e.target.value })}
              required />

            <input type="number" placeholder="Discount (%)"
              className="input bg-gray-800 border-none rounded-2xl font-bold text-red-400"
              value={newItem.discount}
              onChange={e => setNewItem({ ...newItem, discount: e.target.value })} />

            <select className="select bg-gray-800 border-none rounded-2xl font-bold"
              value={newItem.category}
              onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
              {CATEGORIES.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.title}</option>
              ))}
            </select>

            <select className="select bg-gray-800 border-none rounded-2xl font-bold text-green-500"
              value={newItem.subCategory}
              onChange={e => setNewItem({ ...newItem, subCategory: e.target.value })}>
              {SUBCATEGORIES[newItem.category]?.map(sub => (
                <option key={sub.name} value={sub.name}>{sub.icon} {sub.title}</option>
              ))}
            </select>

            {/* 📸 IMAGE UPLOAD */}
            <ImageUploadField
              value={newItem.imageURL}
              onChange={(url) => setNewItem({ ...newItem, imageURL: url })}
            />

            <textarea placeholder="Product Description"
              className="textarea bg-gray-800 border-none rounded-2xl md:col-span-2 h-24 font-bold"
              value={newItem.description}
              onChange={e => setNewItem({ ...newItem, description: e.target.value })} />

            <div className="flex gap-2">
              <label className="flex flex-1 items-center justify-center gap-2 bg-gray-800 rounded-2xl cursor-pointer py-3">
                <input type="checkbox" className="checkbox checkbox-error checkbox-sm"
                  checked={newItem.isStockOut}
                  onChange={e => setNewItem({ ...newItem, isStockOut: e.target.checked })} />
                <span className="text-[10px] font-black uppercase">Stock Out</span>
              </label>
              <label className="flex flex-1 items-center justify-center gap-2 bg-gray-800 rounded-2xl cursor-pointer py-3">
                <input type="checkbox" className="checkbox checkbox-warning checkbox-sm"
                  checked={newItem.isRecommended}
                  onChange={e => setNewItem({ ...newItem, isRecommended: e.target.checked })} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Recommended</span>
              </label>
            </div>

            <button type="submit"
              disabled={isAdding || !newItem.imageURL}
              className="btn btn-warning rounded-2xl font-black md:col-span-3 text-lg py-4 disabled:opacity-50">
              {isAdding ? 'ADDING TO MENU...' : 'ADD PRODUCT NOW ➔'}
            </button>
          </form>
        </div>

        {/* ── Menu List ── */}
        <div className="space-y-12">
          {Object.keys(groupedItems).map(catKey => (
            <div key={catKey} className="space-y-4">
              <h3 className="text-xl font-black text-gray-400 border-l-4 border-warning pl-4 uppercase tracking-widest flex items-center gap-2">
                <span>📂 Store: {groupedItems[catKey].title}</span>
                <span className="bg-gray-800 text-[10px] px-2 py-1 rounded-full">
                  {groupedItems[catKey].items.length} Items
                </span>
              </h3>
              <div className="overflow-x-auto bg-gray-900 rounded-[32px] border border-gray-800">
                <table className="table w-full">
                  <thead className="bg-gray-800/50 text-gray-500 uppercase text-[10px]">
                    <tr>
                      <th>Product Info</th>
                      <th>Price & Discount</th>
                      <th className="text-center">Stock</th>
                      <th className="text-center">Recommend</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedItems[catKey].items.map(item => (
                      <tr key={item.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-all">
                        <td>
                          <div className="flex items-center gap-4">
                            <img
                              src={item.imageURL || 'https://placehold.co/40x40'}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-800"
                              alt=""
                            />
                            <div className="max-w-[200px]">
                              <p className="font-black text-sm text-white uppercase tracking-tighter">{item.name}</p>
                              <p className="text-[10px] text-gray-500 font-bold uppercase truncate">{item.subCategory}</p>
                              <button onClick={() => handleEditDescription(item)}
                                className="text-[9px] text-blue-400 underline font-black uppercase mt-1 block">
                                Edit Description 📝
                              </button>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flex flex-col gap-1">
                            <button onClick={() => handleEditPrice(item)}
                              className="text-left font-black text-warning hover:underline text-lg">
                              ৳{item.price} ✏️
                            </button>
                            <button onClick={() => handleEditDiscount(item)}
                              className="text-left text-[11px] font-black text-red-400 hover:underline uppercase bg-red-400/10 px-2 py-0.5 rounded w-fit">
                              {item.discount || 0}% OFF 🏷️
                            </button>
                          </div>
                        </td>
                        <td className="text-center">
                          <button onClick={() => updateStockStatus(item)}
                            className={`btn btn-xs rounded-lg font-black ${item.isStockOut ? 'btn-error' : 'btn-success'}`}>
                            {item.isStockOut ? 'OUT' : 'IN'}
                          </button>
                        </td>
                        <td className="text-center">
                          <button onClick={() => updateProductRecommendation(item.id, !item.isRecommended)}
                            className={`btn btn-xs rounded-lg font-black ${item.isRecommended ? 'btn-warning shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'btn-ghost'}`}>
                            {item.isRecommended ? '🌟 Yes' : 'No'}
                          </button>
                        </td>
                        <td className="text-center">
                          <button onClick={() => deleteProduct(item.id)}
                            className="btn btn-xs btn-ghost text-error font-black hover:bg-error/10">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* ── Export ── */}
        <div className="mt-20 p-10 bg-gray-900 rounded-[40px] border-4 border-dashed border-gray-800 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">📊</span>
          </div>
          <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2">
            Order Database <span className="text-green-500">Analytics</span>
          </h3>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8 max-w-sm">
            Download your entire sales history and order reports in CSV format.
          </p>
          <button onClick={() => setPage('export')}
            className="btn btn-lg bg-green-500 hover:bg-green-600 border-none text-slate-900 font-black px-12 rounded-2xl shadow-[0_10px_30px_rgba(34,197,94,0.3)] group">
            <span className="mr-2 group-hover:scale-125 transition-transform inline-block">📥</span>
            GENERATE & EXPORT ORDERS
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;