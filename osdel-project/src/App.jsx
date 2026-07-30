
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getAuth } from "firebase/auth"; // Directly check core Firebase

import { useFirebase } from "./hooks/useFirebase";
import { useAuth }     from "./hooks/useAuth";

import Header           from "./components/Header";
import Footer           from "./components/Footer";
import FloatingCart     from "./components/FloatingCart";
import FloatingCountdown from "./components/FloatingCountdown"; // Integrated countdown widget

import HomePage         from "./pages/HomePage";
import AboutPage        from "./pages/AboutPage";
import CheckoutPage     from "./pages/CheckoutPage";
import AdminPanel       from "./pages/AdminPanel";
import RiderPanel       from "./pages/RiderPanel";
import ItemListPage     from "./pages/ItemListPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import SubCategoryPage  from "./pages/SubCategoryPage";
import OrderExport      from "./pages/OrderExport";
import ProfilePage      from "./pages/ProfilePage";
import LoginPage        from "./pages/LoginPage";
import SignupPage       from "./pages/SignupPage";

import { CATEGORIES } from "./utils/constants";

/* ── Notification ── */
const NotificationAlert = ({ alert, setAlert }) => {
  useEffect(() => {
    if (!alert.message) return;
    const timer = setTimeout(() => setAlert({ message: "", type: "" }), 4000);
    return () => clearTimeout(timer);
  }, [alert.message, setAlert]);
  if (!alert.message) return null;
  return (
    <div className={`fixed top-16 left-1/2 -translate-x-1/2 max-w-sm w-full z-[9999] shadow-2xl transition-all animate-slideDown
      ${alert.type === "error" ? "alert alert-error" : "alert alert-success"}`}>
      <span className="font-bold">{alert.message}</span>
    </div>
  );
};

/* ── Gradient ── */
const getGradientClass = () => {
  const h = new Date().getHours();
  if (h >= 6  && h < 11) return "from-black via-gray-800 to-black";
  if (h >= 11 && h < 16) return "from-black via-indigo-900 to-black";
  if (h >= 16 && h < 19) return "from-black via-gray-800 to-black";
  return "from-black via-indigo-900 to-black";
};

/* ── URL helpers ── */
const parseHash = (hash) => {
  const raw = hash.replace("#", "");
  const [pagePart, category, subCategory] = raw.split("/");
  const pageMapping = {
    itemlist: "ItemList", subcategorypage: "SubCategoryPage",
    adminpanel: "AdminPanel", adminlogin: "AdminLogin",
    riderpanel: "RiderPanel", riderlogin: "RiderLogin",
    ordersuccess: "OrderSuccess", export: "export",
    about: "About", home: "Home", checkout: "Checkout",
    profile: "Profile", login: "Login",
    register: "Register",
  };
  const page = pageMapping[pagePart?.toLowerCase()] ||
    (pagePart ? pagePart.charAt(0).toUpperCase() + pagePart.slice(1) : "Home");
  return {
    page,
    category   : category    ? decodeURIComponent(category)    : null,
    subCategory: subCategory ? decodeURIComponent(subCategory) : null,
  };
};

const buildHash = (page, category, subCategory) => {
  if (page === "ItemList" && category) {
    const sub = subCategory ? `/${encodeURIComponent(subCategory)}` : "";
    return `#itemlist/${encodeURIComponent(category)}${sub}`;
  }
  if (page === "SubCategoryPage" && category)
    return `#subcategorypage/${encodeURIComponent(category)}`;
  return `#${page.toLowerCase()}`;
};

/* ══════════════════════════════════════════
    MAIN APP
══════════════════════════════════════════ */
const App = () => {
  const [page, setPage]                 = useState("Home");
  const [cart, setCart]                 = useState([]);
  const [showCart, setShowCart]         = useState(false);
  const [alert, setAlert]               = useState({ message: "", type: "" });
  const [isAdmin, setIsAdmin]           = useState(false);
  const [isRider, setIsRider]           = useState(false);
  const [gradientClass, setGradientClass]             = useState(getGradientClass());
  const [activeCategory, setActiveCategory]           = useState(CATEGORIES[0]?.name || "");
  const [activeSubCategory, setActiveSubCategory]     = useState("");
  const [searchTerm, setSearchTerm]                   = useState("");
  const [orderSuccessDetails, setOrderSuccessDetails] = useState(null);
  const [persistedOrder, setPersistedOrder]           = useState(null);
  const [isTransitioning, setIsTransitioning]         = useState(false);

  /* ── hooks ── */
  const {
    userId: anonymousUserId, loading, menuItems, orders,
    addProduct, deleteProduct, updateStockStatus, updateOrderStatus,
    updateProductPrice, updateProductDiscount,
    updateProductDescription, updateProductRecommendation,
    placeOrder,
  } = useFirebase(setAlert);

  const authData = useAuth();

  /* ── Google Analytics Hash Tracking ── */
  useEffect(() => {
    if (window.gtag) {
      window.gtag("config", "G-0QT0GT9C1B", {
        page_path: window.location.pathname + window.location.hash,
      });
    }
  }, [page]);

  /* ── changePage ── */
  const changePage = useCallback((newPage, catOverride, subOverride) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setPage(newPage);
      setIsTransitioning(false);
      setShowCart(false);
      const cat  = catOverride ?? activeCategory;
      const sub  = subOverride ?? activeSubCategory;
      window.history.pushState(
        { page: newPage, category: cat, subCategory: sub },
        "", buildHash(newPage, cat, sub)
      );
    }, 200);
  }, [activeCategory, activeSubCategory]);

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  /* ── deep link ── */
  useEffect(() => {
    const { page: initialPage, category, subCategory } = parseHash(window.location.hash);
    if (initialPage && initialPage !== "Home") {
      setPage(initialPage);
      if (category)    setActiveCategory(category);
      if (subCategory) setActiveSubCategory(subCategory);
      window.history.replaceState({ page: initialPage, category, subCategory }, "", window.location.hash);
    } else {
      window.history.replaceState({ page: "Home" }, "", "#home");
    }
    const onPopState = (e) => {
      if (e.state?.page) {
        setPage(e.state.page);
        if (e.state.category)    setActiveCategory(e.state.category);
        if (e.state.subCategory) setActiveSubCategory(e.state.subCategory);
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setGradientClass(getGradientClass()), 300000);
    return () => clearInterval(interval);
  }, []);

  /* ── cart ── */
  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    setAlert({ message: `${item.name} কার্টে যোগ হয়েছে ✅`, type: "success" });
  }, []);

  const updateCartQuantity = (id, qty) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => i.id === id ? { ...i, quantity: qty } : i)
    );
  };

  const totalAmount = useMemo(() => cart.reduce((t, i) => t + i.price * i.quantity, 0), [cart]);

  const handleSetActiveCategory    = useCallback((cat) => setActiveCategory(cat), []);
  const handleSetActiveSubCategory = useCallback((sub) => setActiveSubCategory(sub), []);

  /* ══════════════════════════════════════════
      CONFIRM ORDER — বুলেপ্রুফ লাইভ ফায়ারবেস চেক 🎯
   ══════════════════════════════════════════ */
  const handleConfirmOrder = useCallback(() => {
    setShowCart(false);
    
    // সরাসরি ফায়ারবেস কোর থেকে কারেন্ট লাইভ ইউজার অবজেক্ট তুলে আনা হলো
    const currentUser = getAuth().currentUser;

    // যদি আসল ইউজার থাকে এবং সে গেস্ট বা অ্যানোনিমাস না হয়
    if (currentUser && !currentUser.isAnonymous) {
      changePage("Checkout");
    } else {
      changePage("Login");
    }
  }, [changePage]);

  /* ── render ── */
  const renderPage = () => {
    if (loading || authData.authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <span className="loading loading-ring loading-lg text-warning" />
        </div>
      );
    }

    switch (page) {
      case "Home":
        return (
          <HomePage
            setActiveCategory={handleSetActiveCategory}
            setPage={(p) => changePage(p, activeCategory)}
            gradientClass={gradientClass}
            menuItems={menuItems}
            addToCart={addToCart}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        );

      case "SubCategoryPage":
        return (
          <SubCategoryPage
            activeCategory={activeCategory}
            activeSubCategory={activeSubCategory}
            setActiveSubCategory={handleSetActiveSubCategory}
            setPage={(p) => changePage(p, activeCategory, activeSubCategory)}
            menuItems={menuItems}
            addToCart={addToCart}
          />
        );

      case "ItemList":
        return (
          <ItemListPage
            menuItems={menuItems}
            addToCart={addToCart}
            setPage={changePage}
            activeCategory={activeCategory}
            setActiveCategory={(cat) => {
              handleSetActiveCategory(cat);
              window.history.replaceState(
                { page: "ItemList", category: cat, subCategory: activeSubCategory },
                "", buildHash("ItemList", cat, activeSubCategory)
              );
            }}
            activeSubCategory={activeSubCategory}
            setActiveSubCategory={(sub) => {
              handleSetActiveSubCategory(sub);
              window.history.replaceState(
                { page: "ItemList", category: activeCategory, subCategory: sub },
                "", buildHash("ItemList", activeCategory, sub)
              );
            }}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            gradientClass={gradientClass}
          />
        );

      case "Login":
        return (
          <LoginPage
            useAuthData={authData}
            setPage={changePage}
          />
        );

      case "Register":
        return (
          <SignupPage
            useAuthData={authData}
            setPage={changePage}
          />
        );

      case "Checkout":
        return (
          <CheckoutPage
            cart={cart}
            totalAmount={totalAmount}
            placeOrder={placeOrder}
            setPage={changePage}
            setCart={setCart}
            setAlert={setAlert}
            userId={authData.user?.uid || anonymousUserId}
            userProfile={authData.profile}
            setOrderSuccessDetails={(details) => {
              setOrderSuccessDetails(details);
              setPersistedOrder(details);
            }}
          />
        );

      case "OrderSuccess":
        return (
          <OrderSuccessPage 
            orderDetails={orderSuccessDetails} 
            setPage={changePage} 
            orders={orders}
            userId={authData.user?.uid || anonymousUserId}
          />
        );

      case "About":
        return <AboutPage />;

      case "Profile":
        return <ProfilePage useAuthData={authData} setPage={changePage} />;

      case "AdminLogin":
      case "AdminPanel":
        return (
          <AdminPanel
            setPage={changePage}
            setAlert={setAlert}
            menuItems={menuItems}
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            updateStockStatus={updateStockStatus}
            updateProductPrice={updateProductPrice}
            updateProductDiscount={updateProductDiscount}
            updateProductDescription={updateProductDescription}
            updateProductRecommendation={updateProductRecommendation}
            isAuthenticated={isAdmin}
            setIsAuthenticated={setIsAdmin}
          />
        );

      case "export":
        return <OrderExport orders={orders} loading={loading} setPage={changePage} />;

      case "RiderLogin":
      case "RiderPanel":
        return (
          <RiderPanel
            setPage={changePage}
            setAlert={setAlert}
            orders={orders}
            updateOrderStatus={updateOrderStatus}
            isAuthenticated={isRider}
            setIsAuthenticated={(status) => {
              setIsRider(status);
              if (!status) {
                // 🚪 লগআউট মারলে স্টেট রুট লেভেল থেকে ধুয়েমুছে ক্লিন করবে এবং ওল্ড সেশন রিলিজ করবে
                setIsAdmin(false);
                window.location.reload(); 
              }
            }}
          />
        );

      default:
        return (
          <HomePage
            setActiveCategory={handleSetActiveCategory}
            setPage={(p) => changePage(p, activeCategory)}
            gradientClass={gradientClass}
            menuItems={menuItems}
            addToCart={addToCart}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-warning/30">
      <Header
        setPage={changePage}
        setActiveCategory={handleSetActiveCategory}
        setActiveSubCategory={handleSetActiveSubCategory}
        useAuthData={authData}
      />

      <NotificationAlert alert={alert} setAlert={setAlert} />

      <main className={`pt-20 transition-opacity duration-200 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
        {renderPage()}
      </main>

      {/* ── ফিক্সড: হোয়াটসঅ্যাপ ট্র্যাকিং বাটনটি সরাসরি এই কাউন্টডাউন উইজেটের ভেতরেই অটো-সিঙ্ক হয়ে গেছে ── */}
      <FloatingCountdown 
        orders={orders} 
        userId={authData.user?.uid || anonymousUserId} 
        page={page} 
      />

      <FloatingCart
        cart={cart}
        totalAmount={totalAmount}
        updateCartQuantity={updateCartQuantity}
        setPage={changePage}
        showCart={showCart}
        setShowCart={setShowCart}
        onConfirmOrder={handleConfirmOrder}
      />

      <Footer setPage={changePage} userId={authData.user?.uid || anonymousUserId} />

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        .animate-slideDown { animation: slideDown 0.3s ease forwards; }
      `}</style>
    </div>
  );
};

export default App;