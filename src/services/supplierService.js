import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const SUPPLIERS_COLLECTION = 'suppliers';

/**
 * Subscribes to real-time supplier updates from Cloud Firestore
 */
export const subscribeToSuppliers = (onUpdate, onError) => {
  try {
    const q = query(collection(db, SUPPLIERS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const suppliers = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        // Sort: active first, then alphabetically by name
        suppliers.sort((a, b) => {
          if (a.status === 'Active' && b.status !== 'Active') return -1;
          if (b.status === 'Active' && a.status !== 'Active') return 1;
          return (a.name || '').localeCompare(b.name || '');
        });

        onUpdate(suppliers);
      },
      (error) => {
        console.error('Error in suppliers real-time subscription:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to subscribe to suppliers:', error);
    if (onError) onError(error);
    return () => {};
  }
};

/**
 * Fetches all suppliers once
 */
export const getSuppliers = async () => {
  try {
    const snapshot = await getDocs(collection(db, SUPPLIERS_COLLECTION));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

/**
 * Adds a new supplier to Cloud Firestore
 */
export const addSupplier = async (supplierData) => {
  try {
    const supplierId = supplierData.id || `sup-${Date.now()}`;
    const docRef = doc(db, SUPPLIERS_COLLECTION, supplierId);

    const payload = {
      ...supplierData,
      id: supplierId,
      status: supplierData.status || 'Active',
      totalPurchases: supplierData.totalPurchases || 'Rs. 0',
      totalPurchasesRaw: Number(supplierData.totalPurchasesRaw) || 0,
      outstanding: supplierData.outstanding || 'Rs. 0',
      outstandingRaw: Number(supplierData.outstandingRaw) || 0,
      recentOrders: supplierData.recentOrders || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, payload);
    return { id: supplierId, ...payload };
  } catch (error) {
    console.error('Error adding supplier:', error);
    throw error;
  }
};

/**
 * Updates an existing supplier profile
 */
export const updateSupplier = async (id, updatedData) => {
  try {
    const docRef = doc(db, SUPPLIERS_COLLECTION, id);
    const payload = {
      ...updatedData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, payload);
    return { id, ...payload };
  } catch (error) {
    console.error('Error updating supplier:', error);
    throw error;
  }
};

/**
 * Deletes a supplier from Cloud Firestore
 */
export const deleteSupplier = async (id) => {
  try {
    await deleteDoc(doc(db, SUPPLIERS_COLLECTION, id));
    return id;
  } catch (error) {
    console.error('Error deleting supplier:', error);
    throw error;
  }
};
