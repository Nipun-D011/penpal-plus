import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('penpal_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Helper to normalize role names
  const normalizeRole = (role, email = '') => {
    if (!role) {
      const lower = email.toLowerCase();
      if (lower.includes('sarasavi') || lower.includes('supplier') || lower.includes('paper')) {
        return 'Supplier';
      }
      if (lower.includes('kumari') || lower.includes('customer') || lower.includes('stannes') || lower.includes('nimal')) {
        return 'Customer';
      }
      if (lower.includes('staff')) {
        return 'Staff';
      }
      return 'Owner / Admin';
    }
    const r = role.toLowerCase();
    if (r === 'owner' || r.includes('admin')) return 'Owner / Admin';
    if (r === 'staff') return 'Staff';
    if (r === 'customer') return 'Customer';
    if (r === 'supplier') return 'Supplier';
    return role;
  };

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          let userData;
          if (userSnap.exists()) {
            const data = userSnap.data();
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: data.fullName || firebaseUser.displayName || 'Pen Pal Plus User',
              role: normalizeRole(data.role, firebaseUser.email),
              phoneNumber: data.phoneNumber || '',
              businessName: data.businessName || '',
            };
          } else {
            // Document doesn't exist yet (e.g. Google Sign-in first time)
            const role = normalizeRole(null, firebaseUser.email);
            const name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name,
              role,
            };
            await setDoc(userDocRef, {
              ...userData,
              createdAt: serverTimestamp(),
            });
          }

          setUser(userData);
          localStorage.setItem('penpal_user', JSON.stringify(userData));
        } catch (error) {
          console.error('Error fetching Firestore user profile:', error);
          // Fallback user state from Firebase Auth
          const fallbackData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            role: normalizeRole(null, firebaseUser.email),
          };
          setUser(fallbackData);
          localStorage.setItem('penpal_user', JSON.stringify(fallbackData));
        }
      } else {
        setUser(null);
        localStorage.removeItem('penpal_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Firebase Sign Up with Firestore profile creation
  const signup = async (formData) => {
    setLoading(true);
    try {
      const email = formData.email.trim();
      const password = formData.password;
      const role = normalizeRole(formData.accountType || formData.role, email);
      const fullName = formData.fullName?.trim() || 'User';

      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Update display name in Firebase Auth
      await updateProfile(firebaseUser, {
        displayName: fullName,
      });

      // 3. Create user record in Firestore "users" collection
      const userDocData = {
        uid: firebaseUser.uid,
        email,
        fullName,
        phoneNumber: formData.phoneNumber || '',
        businessName: formData.businessName || '',
        role,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userDocData);

      const sessionUser = {
        uid: firebaseUser.uid,
        email,
        name: fullName,
        role,
        phoneNumber: formData.phoneNumber || '',
        businessName: formData.businessName || '',
      };

      setUser(sessionUser);
      localStorage.setItem('penpal_user', JSON.stringify(sessionUser));
      return sessionUser;
    } finally {
      setLoading(false);
    }
  };

  // Firebase Sign In
  const login = async (credentials) => {
    setLoading(true);
    try {
      const email = (credentials.identifier || credentials.email || '').trim();
      const password = credentials.password || 'password123';

      let userCredential;
      try {
        // Attempt standard Firebase Auth sign-in
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (authError) {
        // Auto-provision demo accounts on-the-fly for seamless testing
        const isDemo =
          email === 'aravinda@penpalplus.lk' ||
          email === 'kumari.fonseka@gmail.com' ||
          email === 'orders@sarasavi.lk';

        if (
          isDemo &&
          (authError.code === 'auth/user-not-found' ||
            authError.code === 'auth/invalid-credential' ||
            authError.code === 'auth/invalid-login-credentials')
        ) {
          // Create the demo account in Firebase Auth
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const demoName =
            email === 'aravinda@penpalplus.lk'
              ? 'Aravinda Perera'
              : email === 'kumari.fonseka@gmail.com'
              ? 'Kumari Fonseka'
              : 'Sarasavi Wholesalers';
          const demoRole = normalizeRole(null, email);

          await updateProfile(userCredential.user, { displayName: demoName });
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            email,
            fullName: demoName,
            role: demoRole,
            createdAt: serverTimestamp(),
          });
        } else {
          // Re-throw formatted error
          throw authError;
        }
      }

      const firebaseUser = userCredential.user;

      // Fetch or build user profile
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userDocRef);

      let userData;
      if (userSnap.exists()) {
        const data = userSnap.data();
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: data.fullName || firebaseUser.displayName || 'Pen Pal Plus User',
          role: normalizeRole(data.role, firebaseUser.email),
          phoneNumber: data.phoneNumber || '',
          businessName: data.businessName || '',
        };
      } else {
        const role = normalizeRole(credentials.role || credentials.accountType, firebaseUser.email);
        const name = credentials.fullName || firebaseUser.displayName || firebaseUser.email?.split('@')[0];
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name,
          role,
        };
        await setDoc(userDocRef, { ...userData, createdAt: serverTimestamp() });
      }

      setUser(userData);
      localStorage.setItem('penpal_user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  // Firebase Google Sign In
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = userCredential.user;

      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userDocRef);

      let userData;
      if (userSnap.exists()) {
        const data = userSnap.data();
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: data.fullName || firebaseUser.displayName,
          role: normalizeRole(data.role, firebaseUser.email),
        };
      } else {
        const role = normalizeRole(null, firebaseUser.email);
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          role,
        };
        await setDoc(userDocRef, { ...userData, createdAt: serverTimestamp() });
      }

      setUser(userData);
      localStorage.setItem('penpal_user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  // Firebase Sign Out
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('penpal_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
