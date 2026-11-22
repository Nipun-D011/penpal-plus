import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const CUSTOMERS_COLLECTION = 'customers';

/**
 * Subscribes to real-time customer updates from Cloud Firestore
 */
export const subscribeToCustomers = (onUpdate, onError) => {
  try {
    const q = query(collection(db, CUSTOMERS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const customers = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        // Sort: newest created or updated first, fallback to name
        customers.sort((a, b) => {
          const timeA = a.createdAt?.toMillis
            ? a.createdAt.toMillis()
            : (a.id || '').localeCompare(b.id || '');
          const timeB = b.createdAt?.toMillis
            ? b.createdAt.toMillis()
            : 0;
          if (timeB && timeA && timeB !== timeA) return timeB - timeA;
          return (a.name || '').localeCompare(b.name || '');
        });

        onUpdate(customers);
      },
      (error) => {
        console.error('Error in customers real-time subscription:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to subscribe to customers:', error);
    if (onError) onError(error);
    return () => {};
  }
};

/**
 * Fetches all customers once
 */
export const getCustomers = async () => {
  try {
    const snapshot = await getDocs(collection(db, CUSTOMERS_COLLECTION));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

/**
 * Adds a new customer to Cloud Firestore
 */
export const addCustomer = async (customerData) => {
  try {
    const customerId = customerData.id || `cust-${Date.now()}`;
    const docRef = doc(db, CUSTOMERS_COLLECTION, customerId);

    const payload = {
      ...customerData,
      id: customerId,
      ordersCount: customerData.ordersCount || 0,
      totalSpent: customerData.totalSpent || 'Rs. 0',
      totalSpentFormatted: customerData.totalSpentFormatted || '0',
      purchaseHistory: customerData.purchaseHistory || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, payload);
    return { id: customerId, ...payload };
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

/**
 * Updates an existing customer profile
 */
export const updateCustomer = async (id, updatedData) => {
  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, id);
    const payload = {
      ...updatedData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, payload);
    return { id, ...payload };
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

/**
 * Deletes a customer profile from Cloud Firestore
 */
export const deleteCustomer = async (id) => {
  try {
    await deleteDoc(doc(db, CUSTOMERS_COLLECTION, id));
    return id;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

/**
 * Records a completed invoice/purchase against a customer's profile
 */
export const recordCustomerPurchase = async (customerId, invoice) => {
  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, customerId);
    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(docRef);
      if (!snap.exists()) return;

      const current = snap.data();
      const currentOrders = Number(current.ordersCount) || 0;
      const history = current.purchaseHistory || [];

      // Extract numeric amount from invoice
      const invoiceAmt = Number(invoice.numericAmount || invoice.totalDue || 0);
      const rawCurrentSpent = Number(
        String(current.totalSpent || '0').replace(/[^0-9.]/g, '')
      ) || 0;
      const newTotalSpent = rawCurrentSpent + invoiceAmt;

      const formattedTotal =
        newTotalSpent >= 1000
          ? `${(newTotalSpent / 1000).toFixed(1)}K`
          : `${newTotalSpent}`;

      const newHistoryItem = {
        id: invoice.invoiceNumber || invoice.id,
        date: invoice.date || 'Today',
        amount: invoice.amount || `Rs. ${invoiceAmt.toLocaleString()}`,
      };

      transaction.update(docRef, {
        ordersCount: currentOrders + 1,
        totalSpent: `Rs. ${newTotalSpent.toLocaleString()}`,
        totalSpentFormatted: formattedTotal,
        lastVisit: invoice.date || 'Today',
        purchaseHistory: [newHistoryItem, ...history.slice(0, 9)], // keep 10 most recent
        updatedAt: serverTimestamp(),
      });
    });
  } catch (error) {
    console.error(`Failed to record purchase for customer ${customerId}:`, error);
  }
};
