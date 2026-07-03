import { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from 'firebase/firestore';

const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const appId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

const getUserDocPath = (uid) => `artifacts/${appId}/users/${uid}/profile/main`;
const getOrdersPath  = () => `artifacts/${appId}/public/data/orders`;

export const useAuth = () => {
  const [user, setUser]           = useState(null);   // Firebase user object
  const [profile, setProfile]     = useState(null);   // Firestore profile data
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError]   = useState('');

  // ── init ────────────────────────────────────────────────────
  const app  = getApps().length ? getApps()[0] : initializeApp(FIREBASE_CONFIG);
  const auth = getAuth(app);
  const db   = getFirestore(app);

  // ── listen to auth state (পারসিস্টেন্স ফিক্স) ─────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      // ফিক্স: ইউজার থাকতে হবে এবং সে যেন সাময়িক গেস্ট (Anonymous) না হয়
      if (firebaseUser && !firebaseUser.isAnonymous) {
        setUser(firebaseUser);
        await loadProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setProfile(null);
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, [auth]);

  // ── load Firestore profile ──────────────────────────────────
  const loadProfile = async (uid) => {
    try {
      const ref  = doc(db, getUserDocPath(uid));
      const snap = await getDoc(ref);
      if (snap.exists()) setProfile(snap.data());
    } catch (e) {
      console.error('Profile load error:', e);
    }
  };

  // ── create / merge profile doc ──────────────────────────────
  const upsertProfile = async (uid, data) => {
    const ref = doc(db, getUserDocPath(uid));
    await setDoc(ref, data, { merge: true });
    setProfile((prev) => ({ ...prev, ...data }));
  };

  // ── REGISTER with email ─────────────────────────────────────
  const register = async ({ name, email, password }) => {
    setAuthError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await upsertProfile(cred.user.uid, {
        name, email,
        phone: '', location: '', block: '', road: '', house: '',
        createdAt: new Date().toISOString(),
      });
      return { success: true };
    } catch (e) {
      const msg = friendlyError(e.code);
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ── LOGIN with email ────────────────────────────────────────
  const login = async ({ email, password }) => {
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e) {
      const msg = friendlyError(e.code);
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ── LOGIN with Google (সেশন ও মডেল ক্লোজ ফিক্সড) ───────────────────────────────────────
  const loginWithGoogle = async () => {
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const u = cred.user;
      
      const ref  = doc(db, getUserDocPath(u.uid));
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await upsertProfile(u.uid, {
          name: u.displayName || '',
          email: u.email || '',
          phone: '', location: '', block: '', road: '', house: '',
          createdAt: new Date().toISOString(),
        });
      } else {
        await loadProfile(u.uid);
      }

      // সেশন জ্যাম ক্লিয়ার করতে এবং ফ্রন্টএন্ড মডেল ইনস্ট্যান্ট সরাতে পেজ অটো-রিলোড হবে
      window.location.reload(); 
      return { success: true };
    } catch (e) {
      const msg = friendlyError(e.code);
      setAuthError(msg);
      return { success: false, error: msg };
    }
  };

  // ── LOGOUT ──────────────────────────────────────────────────
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  // ── UPDATE profile ──────────────────────────────────────────
  const updateProfileData = async (data) => {
    if (!user) return;
    try {
      await upsertProfile(user.uid, data);
      if (data.name) await updateProfile(user, { displayName: data.name });
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // ── FETCH user's past orders ─────────────────────────────────
  const fetchMyOrders = async () => {
    if (!user) return [];
    try {
      const q = query(
        collection(db, getOrdersPath()),
        where('userId', '==', user.uid),
        orderBy('receivedAt', 'desc')
      );
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.error('fetchMyOrders error:', e);
      return [];
    }
  };

  return {
    user,
    profile,
    authLoading,
    authError,
    setAuthError,
    register,
    login,
    loginWithGoogle,
    logout,
    updateProfileData,
    fetchMyOrders,
    loadProfile,
  };
};

// ── friendly Bengali error messages ────────────────────────────
const friendlyError = (code) => {
  const map = {
    'auth/email-already-in-use'  : 'এই email টি আগেই ব্যবহার হয়েছে।',
    'auth/invalid-email'         : 'সঠিক email দিন।',
    'auth/weak-password'         : 'Password কমপক্ষে ৬ অক্ষর হতে হবে।',
    'auth/user-not-found'        : 'এই email এ কোনো account নেই।',
    'auth/wrong-password'        : 'Password ভুল হয়েছে।',
    'auth/popup-closed-by-user'  : 'Google login বন্ধ হয়ে গেছে।',
    'auth/network-request-failed': 'Internet connection চেক করুন।',
    'auth/too-many-requests'     : 'অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।',
  };
  return map[code] || 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।';
};