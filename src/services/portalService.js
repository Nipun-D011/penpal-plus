import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const CUSTOMERS_COLLECTION = 'customers';
const SUPPLIERS_COLLECTION = 'suppliers';
const ORDERS_COLLECTION = 'orders';
const PRINT_JOBS_COLLECTION = 'print_jobs';
const INVOICES_COLLECTION = 'invoices';
const PURCHASE_ORDERS_COLLECTION = 'purchase_orders';
const SUPPLIER_BILLS_COLLECTION = 'supplier_bills';

/**
 * Subscribes to real-time purchase orders for the supplier portal
 */
export const subscribeToPurchaseOrders = (onUpdate, onError) => {
  try {
    const q = query(collection(db, PURCHASE_ORDERS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const pos = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        onUpdate(pos);
      },
      (error) => {
        console.error('Error in purchase orders subscription:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to subscribe to purchase orders:', error);
    if (onError) onError(error);
    return () => {};
  }
};

/**
 * Updates a purchase order's status and timeline steps
 */
export const updatePurchaseOrderStatus = async (poId, newStatus, timeline) => {
  try {
    const docRef = doc(db, PURCHASE_ORDERS_COLLECTION, poId);
    const payload = {
      status: newStatus,
      updatedAt: serverTimestamp(),
    };
    if (timeline) {
      payload.timeline = timeline;
    }
    await updateDoc(docRef, payload);
    return { id: poId, ...payload };
  } catch (error) {
    console.error('Error updating purchase order status:', error);
    throw error;
  }
};

/**
 * Subscribes to real-time supplier bills for the supplier portal ledger
 */
export const subscribeToSupplierBills = (onUpdate, onError) => {
  try {
    const q = query(collection(db, SUPPLIER_BILLS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const bills = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        onUpdate(bills);
      },
      (error) => {
        console.error('Error in supplier bills subscription:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to subscribe to supplier bills:', error);
    if (onError) onError(error);
    return () => {};
  }
};
