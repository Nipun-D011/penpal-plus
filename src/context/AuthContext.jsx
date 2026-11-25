/* eslint-disable react-refresh/only-export-components */
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
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../services/firebase';

const AuthContext = createContext(null);

/**
 * Route resolution helper for roles
 * Admin / Staff -> /dashboard
 * Customer -> /portal/orders
 * Supplier -> /supplier/portal
 */
export const getRoleHomeRoute = (role) => {
  switch (role) {
    case 'Customer':
      return '/portal/orders';
    case 'Supplier':
      return '/supplier/portal';
    case 'Staff':
    case 'Admin':
    default:
      return '/dashboard';
  }
};

/**
 * Normalize role strings into canonical roles:
 * 'Admin' | 'Staff' | 'Customer' | 'Supplier'
 */
export const normalizeRole = (role, email = '') => {
  const lower = (email || '').toLowerCase().trim();

  if (role) {
    const r = role.toLowerCase().trim();
    if (r === 'admin' || r === 'owner' || r.includes('admin') || r.includes('owner')) {
      return 'Admin';
    }
    if (r === 'staff') {
      return 'Staff';
    }
    if (r === 'customer') {
      return 'Customer';
    }
    if (r === 'supplier') {
      return 'Supplier';
    }
  }

  // Schema rule: @penpalplus.lk = Admin / Staff
  if (lower.endsWith('@penpalplus.lk') || lower.includes('penpalplus.lk')) {
    if (lower.includes('staff')) {
      return 'Staff';
    }
    return 'Admin';
  }

  // Customer patterns & demo registry
  if (
    lower.includes('customer') ||
    lower.includes('kumari') ||
    lower.includes('stannes') ||
    lower.includes('nimal') ||
    lower.includes('ruwan')
  ) {
    return 'Customer';
  }

  // Supplier patterns & demo registry
  if (
    lower.includes('supplier') ||
    lower.includes('sarasavi') ||
    lower.includes('lankapaper') ||
    lower.includes('paper') ||
    lower.includes('ceylonprint')
  ) {
    return 'Supplier';
  }

  return 'Customer';
};

/**
 * Smart Role Detection from Firestore & Role Schemas:
 * 1. Checks Firestore "users" collection (by uid or email)
 * 2. Checks @penpalplus.lk domain schema -> Admin / Staff
 * 3. Checks Customer registry in Firestore ("customers" collection) -> Customer
 * 4. Checks Supplier registry in Firestore ("suppliers" collection) -> Supplier
 * 5. Falls back to normalized schema evaluation
 */
export const resolveUserRole = async (email = '', uid = null) => {
  const cleanEmail = (email || '').trim();
  const lowerEmail = cleanEmail.toLowerCase();

  // 1. Query Firestore "users" collection by uid if available
  if (uid) {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const storedRole = userSnap.data()?.role;
        if (storedRole) {
          return normalizeRole(storedRole, lowerEmail);
        }
      }
    } catch (err) {
      console.warn('Could not query users collection by uid:', err);
    }
  }

  // 2. Query Firestore "users" collection by email
  if (cleanEmail) {
    try {
      const usersQuery = query(collection(db, 'users'), where('email', '==', cleanEmail));
      const usersSnap = await getDocs(usersQuery);
      if (!usersSnap.empty) {
        const storedRole = usersSnap.docs[0].data()?.role;
        if (storedRole) {
          return normalizeRole(storedRole, lowerEmail);
        }
      }
    } catch (err) {
      console.warn('Could not query users collection by email:', err);
    }
  }

  // 3. Registered role schema: @penpalplus.lk = Admin / Staff
  if (lowerEmail.endsWith('@penpalplus.lk') || lowerEmail.includes('penpalplus.lk')) {
    if (lowerEmail.includes('staff')) {
      return 'Staff';
    }
    return 'Admin';
  }

  // 4. Check Customer registry (Firestore "customers" collection)
  if (cleanEmail) {
    try {
      const custQuery = query(collection(db, 'customers'), where('email', '==', cleanEmail));
      const custSnap = await getDocs(custQuery);
      if (!custSnap.empty) {
        return 'Customer';
      }
      if (cleanEmail !== lowerEmail) {
        const custQueryLower = query(collection(db, 'customers'), where('email', '==', lowerEmail));
        const custSnapLower = await getDocs(custQueryLower);
        if (!custSnapLower.empty) {
          return 'Customer';
        }
      }
    } catch (err) {
      console.warn('Could not query customers collection by email:', err);
    }
  }

  // 5. Check Supplier registry (Firestore "suppliers" collection)
  if (cleanEmail) {
    try {
      const suppQuery = query(collection(db, 'suppliers'), where('email', '==', cleanEmail));
      const suppSnap = await getDocs(suppQuery);
      if (!suppSnap.empty) {
        return 'Supplier';
      }
      if (cleanEmail !== lowerEmail) {
        const suppQueryLower = query(collection(db, 'suppliers'), where('email', '==', lowerEmail));
        const suppSnapLower = await getDocs(suppQueryLower);
        if (!suppSnapLower.empty) {
          return 'Supplier';
        }
      }
    } catch (err) {
      console.warn('Could not query suppliers collection by email:', err);
    }
  }

  // 6. Schema-based fallback detection
  return normalizeRole(null, lowerEmail);
};

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

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          const resolvedRole = await resolveUserRole(firebaseUser.email, firebaseUser.uid);

          let userData;
          if (userSnap.exists()) {
            const data = userSnap.data();
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: data.fullName || firebaseUser.displayName || 'Pen Pal Plus User',
              role: resolvedRole,
              phoneNumber: data.phoneNumber || '',
              businessName: data.businessName || data.companyName || '',
              companyName: data.companyName || data.businessName || '',
              contactPerson: data.contactPerson || '',
              address: data.address || '',
              category: data.category || '',
              paymentTerms: data.paymentTerms || '',
              department: data.department || '',
              designation: data.department || data.designation || '',
            };
            if (data.role !== resolvedRole) {
              await setDoc(userDocRef, { role: resolvedRole }, { merge: true });
            }
          } else {
            const name = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
            userData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name,
              role: resolvedRole,
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
          const fallbackRole = await resolveUserRole(firebaseUser.email, firebaseUser.uid);
          const fallbackData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            role: fallbackRole,
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
      const displayName =
        role === 'Supplier'
          ? (formData.companyName || formData.businessName || formData.contactPerson || fullName)
          : fullName;
      await updateProfile(firebaseUser, {
        displayName,
      });

      // 3. Create user record in Firestore "users" collection
      const userDocData = {
        uid: firebaseUser.uid,
        email,
        fullName,
        displayName,
        phoneNumber: formData.phoneNumber || '',
        businessName: formData.businessName || formData.companyName || '',
        companyName: formData.companyName || formData.businessName || '',
        contactPerson: formData.contactPerson || fullName,
        address: formData.address || '',
        category: formData.category || (role === 'Supplier' ? 'Paper & Board' : ''),
        paymentTerms: formData.paymentTerms || (role === 'Supplier' ? 'Net 30' : ''),
        department: formData.department || '',
        designation: formData.department || '',
        role,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userDocData);

      // Mirror customer in customers collection if role is Customer
      if (role === 'Customer') {
        try {
          const custDocRef = doc(db, 'customers', `cust-${firebaseUser.uid.slice(0, 8)}`);
          await setDoc(
            custDocRef,
            {
              id: `cust-${firebaseUser.uid.slice(0, 8)}`,
              name: fullName,
              email,
              phone: formData.phoneNumber || '',
              address: formData.address || '',
              city: formData.address ? formData.address.split(',').pop().trim() : 'Kurunegala',
              ordersCount: 0,
              totalSpent: 'Rs. 0',
              totalSpentFormatted: '0',
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (e) {
          console.warn('Could not mirror customer registry:', e);
        }
      }

      // Mirror supplier in suppliers collection if role is Supplier
      if (role === 'Supplier') {
        try {
          const suppDocRef = doc(db, 'suppliers', `sup-${firebaseUser.uid.slice(0, 8)}`);
          await setDoc(
            suppDocRef,
            {
              id: `sup-${firebaseUser.uid.slice(0, 8)}`,
              name: formData.companyName || formData.businessName || fullName,
              companyName: formData.companyName || formData.businessName || fullName,
              contactPerson: formData.contactPerson || fullName,
              contact: formData.contactPerson || fullName,
              phone: formData.phoneNumber || '',
              email,
              category: formData.category || 'Paper & Board',
              paymentTerms: formData.paymentTerms || 'Net 30',
              status: 'Active',
              createdAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (e) {
          console.warn('Could not mirror supplier registry:', e);
        }
      }

      const sessionUser = {
        uid: firebaseUser.uid,
        email,
        name: displayName,
        fullName,
        role,
        phoneNumber: formData.phoneNumber || '',
        businessName: formData.businessName || formData.companyName || '',
        companyName: formData.companyName || formData.businessName || '',
        contactPerson: formData.contactPerson || '',
        address: formData.address || '',
        category: formData.category || '',
        paymentTerms: formData.paymentTerms || '',
        department: formData.department || '',
        designation: formData.department || '',
      };

      setUser(sessionUser);
      localStorage.setItem('penpal_user', JSON.stringify(sessionUser));
      return sessionUser;
    } finally {
      setLoading(false);
    }
  };

  // Firebase Sign In with Smart Role Resolution
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
        const lowerEmail = email.toLowerCase();
        const isDemo =
          lowerEmail === 'aravinda@penpalplus.lk' ||
          lowerEmail === 'kumari.fonseka@gmail.com' ||
          lowerEmail === 'orders@sarasavi.lk' ||
          lowerEmail === 'staff@penpalplus.lk' ||
          lowerEmail === 'sunil@penpalplus.lk';

        if (
          isDemo &&
          (authError.code === 'auth/user-not-found' ||
            authError.code === 'auth/invalid-credential' ||
            authError.code === 'auth/invalid-login-credentials')
        ) {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const demoName =
              lowerEmail === 'aravinda@penpalplus.lk'
                ? 'Aravinda Perera'
                : lowerEmail === 'staff@penpalplus.lk' || lowerEmail === 'sunil@penpalplus.lk'
                ? 'Sunil Shantha (Staff)'
                : lowerEmail === 'kumari.fonseka@gmail.com'
                ? 'Kumari Fonseka'
                : 'Sarasavi Wholesalers';

            const demoRole = await resolveUserRole(email, userCredential.user.uid);

            await updateProfile(userCredential.user, { displayName: demoName });
            await setDoc(doc(db, 'users', userCredential.user.uid), {
              uid: userCredential.user.uid,
              email,
              fullName: demoName,
              role: demoRole,
              createdAt: serverTimestamp(),
            });
          } catch (createErr) {
            if (createErr.code === 'auth/email-already-in-use') {
              throw authError;
            }
            throw createErr;
          }
        } else {
          // Re-throw formatted error
          throw authError;
        }
      }

      const firebaseUser = userCredential.user;

      // Smart role resolution: query Firestore (users, customers, suppliers) or determine from role schema
      const resolvedRole = await resolveUserRole(firebaseUser.email || email, firebaseUser.uid);

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
          role: resolvedRole,
          phoneNumber: data.phoneNumber || '',
          businessName: data.businessName || data.companyName || '',
          companyName: data.companyName || data.businessName || '',
          contactPerson: data.contactPerson || '',
          address: data.address || '',
          category: data.category || '',
          paymentTerms: data.paymentTerms || '',
          department: data.department || '',
          designation: data.department || data.designation || '',
        };
        // Persist resolved role to Firestore if updated
        if (data.role !== resolvedRole) {
          await setDoc(userDocRef, { role: resolvedRole }, { merge: true });
        }
      } else {
        const name = credentials.fullName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name,
          role: resolvedRole,
        };
        await setDoc(userDocRef, { ...userData, createdAt: serverTimestamp() });
      }

      // Set authenticated user state with the resolved canonical role
      setUser(userData);
      localStorage.setItem('penpal_user', JSON.stringify(userData));
      return userData;
    } finally {
      setLoading(false);
    }
  };

  // Firebase Google Sign In with Smart Role Resolution
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const firebaseUser = userCredential.user;

      const resolvedRole = await resolveUserRole(firebaseUser.email, firebaseUser.uid);
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userDocRef);

      let userData;
      if (userSnap.exists()) {
        const data = userSnap.data();
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: data.fullName || firebaseUser.displayName,
          role: resolvedRole,
        };
        if (data.role !== resolvedRole) {
          await setDoc(userDocRef, { role: resolvedRole }, { merge: true });
        }
      } else {
        userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          role: resolvedRole,
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
        getRoleHomeRoute,
        resolveUserRole,
        normalizeRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
