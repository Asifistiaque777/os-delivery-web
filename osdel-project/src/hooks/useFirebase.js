import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';

// =========================================================================
// Firebase Configuration (.env থেকে রিড করা হচ্ছে)
const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
// =========================================================================

const appId = import.meta.env.VITE_FIREBASE_PROJECT_ID; // ডাইনামিক আইডি
const initialAuthToken = null;

const getPublicCollectionPath = collectionName =>
  `artifacts/${appId}/public/data/${collectionName}`;

export const useFirebase = setAlert => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------------------------------------
  // Firebase Initialization & Authentication (গেস্ট লগইন কনফ্লিক্ট ফিক্সড)
  // -----------------------------------------------------------------------
  useEffect(() => {
    let unsubscribeAuth = () => {};

    try {
      if (!FIREBASE_CONFIG?.apiKey) {
        setAlert?.({ message: 'Firebase configuration missing.', type: 'error' });
        setLoading(false);
        setIsAuthReady(true);
        return;
      }

      const app = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestore);
      setAuth(firebaseAuth);

      unsubscribeAuth = onAuthStateChanged(firebaseAuth, async user => {
        try {
          if (user) {
            setUserId(user.uid);
          } else {
            // ফিক্স: গুগল লগইনের সময় যাতে জোর করে অ্যানোনিমাস স্টেট ট্রিপ না করে
            await signInAnonymously(firebaseAuth);
          }
        } catch (err) {
          console.error('Auth error:', err);
        } finally {
          setIsAuthReady(true);
          setLoading(false);
        }
      });

      if (initialAuthToken) {
        signInWithCustomToken(firebaseAuth, initialAuthToken).catch(() =>
          signInAnonymously(firebaseAuth)
        );
      }
    } catch (err) {
      console.error('Firebase init error:', err);
      setAlert?.({ message: 'Firebase initialization failed.', type: 'error' });
      setLoading(false);
      setIsAuthReady(true);
    }

    return () => unsubscribeAuth();
  }, [setAlert]);

  // -----------------------------------------------------------------------
  // Firestore Listeners (Products & Orders)
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (!isAuthReady || !db) return;

    const productsPath = getPublicCollectionPath('products');
    const ordersPath = getPublicCollectionPath('orders');

    const productsQuery = query(collection(db, productsPath));
    const ordersQuery = query(
      collection(db, ordersPath),
      orderBy('receivedAt', 'desc')
    );

    const unsubscribeProducts = onSnapshot(
      productsQuery,
      snapshot => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setMenuItems(
          items.sort((a, b) => (a.category || '').localeCompare(b.category || ''))
        );
      },
      error => {
        console.error('Products fetch error:', error);
        setAlert?.({ message: 'মেনু লোড করতে সমস্যা হয়েছে।', type: 'error' });
      }
    );

    const unsubscribeOrders = onSnapshot(
      ordersQuery,
      snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setOrders(list);
      },
      error => console.error('Orders fetch error:', error)
    );

    return () => {
      unsubscribeProducts();
      unsubscribeOrders();
    };
  }, [db, isAuthReady, setAlert]);

  // -----------------------------------------------------------------------
  // Firestore Write Operations (Products)
  // -----------------------------------------------------------------------
  
  const addProduct = async product => {
    if (!db) throw new Error('Database not ready');
    const productsPath = getPublicCollectionPath('products');
    const data = {
      ...product,
      price: Number(product.price),
      discount: Number(product.discount || 0),
      isStockOut: Boolean(product.isStockOut),
      isRecommended: Boolean(product.isRecommended),
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, productsPath), data);
  };

  const deleteProduct = async id => {
    if (!db) throw new Error('Database not ready');
    const productsPath = getPublicCollectionPath('products');
    await deleteDoc(doc(db, productsPath, id));
  };

  const updateStockStatus = async item => {
    if (!db) throw new Error('Database not ready');
    const productsPath = getPublicCollectionPath('products');
    await updateDoc(doc(db, productsPath, item.id), {
      isStockOut: !item.isStockOut,
    });
  };

  const updateProductPrice = async (id, newPrice) => {
    if (!db) throw new Error('Database not ready');
    const productsPath = getPublicCollectionPath('products');
    await updateDoc(doc(db, productsPath, id), {
      price: Number(newPrice),
    });
  };

  const updateProductDiscount = async (id, newDiscount) => {
    if (!db) throw new Error('Database not ready');
    const productsPath = getPublicCollectionPath('products');
    await updateDoc(doc(db, productsPath, id), {
      discount: Number(newDiscount),
    });
  };

  const updateProductDescription = async (id, newDescription) => {
    if (!db) throw new Error('Database not ready');
    const productsPath = getPublicCollectionPath('products');
    await updateDoc(doc(db, productsPath, id), {
      description: newDescription,
    });
  };

  const updateProductRecommendation = async (id, status) => {
    if (!db) throw new Error('Database not ready');
    const productsPath = getPublicCollectionPath('products');
    await updateDoc(doc(db, productsPath, id), {
      isRecommended: status,
    });
  };

  // -----------------------------------------------------------------------
  // Firestore Write Operations (Orders)
  // -----------------------------------------------------------------------

  const updateOrderStatus = async (orderId, status, extraData = {}) => {
    if (!db) throw new Error('Database not ready');
    const ordersPath = getPublicCollectionPath('orders');
    
    const updateData = { 
      status,
      ...extraData 
    };

    if (status === 'taken') updateData.pickedAt = serverTimestamp();
    if (status === 'completed') updateData.deliveredAt = serverTimestamp();

    await updateDoc(doc(db, ordersPath, orderId), updateData);
  };

  const placeOrder = async orderData => {
    if (!db) throw new Error('Database not ready');
    const ordersPath = getPublicCollectionPath('orders');
    
    const itemsWithShop = orderData.items.map(item => ({
      ...item,
      shopName: item.shopName || item.category || "Oriental Street"
    }));

    return addDoc(collection(db, ordersPath), {
      ...orderData,
      items: itemsWithShop,
      name: orderData.customerDetails?.name || "N/A",
      phone: orderData.customerDetails?.phone || "N/A",
      email: orderData.customerDetails?.email || "N/A", 
      address: orderData.customerDetails?.location || "N/A",
      status: 'received',
      receivedAt: serverTimestamp(),
      pickedAt: null,
      deliveredAt: null
    });
  };

  return {
    db,
    auth,
    userId,
    isAuthReady,
    loading,
    menuItems,
    orders,
    addProduct,
    deleteProduct,
    updateStockStatus,
    updateProductPrice,
    updateProductDiscount,
    updateProductDescription,
    updateProductRecommendation,
    updateOrderStatus,
    placeOrder,
  };
};