import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const ORDERS_COLLECTION = 'orders';

/**
 * Maps status string to numerical step index (1-4)
 */
export const getStatusStep = (status) => {
  switch (status?.toLowerCase()) {
    case 'new':
      return 1;
    case 'processing':
      return 2;
    case 'ready':
      return 3;
    case 'delivered':
      return 4;
    default:
      return 1;
  }
};

/**
 * Subscribes to real-time customer orders from Cloud Firestore
 */
export const subscribeToOrders = (onUpdate, onError) => {
  try {
    const q = query(collection(db, ORDERS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        onUpdate(orders);
      },
      (error) => {
        console.error('Error in customer orders real-time subscription:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to subscribe to customer orders:', error);
    if (onError) onError(error);
    return () => {};
  }
};

/**
 * Fetches all customer orders once
 */
export const getOrders = async () => {
  try {
    const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }
};

/**
 * Creates a new customer order in Firestore
 */
export const createOrder = async (orderData) => {
  try {
    const orderId = orderData.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);

    const statusStep = orderData.statusStep || getStatusStep(orderData.status || 'New');

    const payload = {
      ...orderData,
      id: orderId,
      status: orderData.status || 'New',
      statusStep,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(orderRef, payload);
    return payload;
  } catch (error) {
    console.error('Error creating customer order:', error);
    throw error;
  }
};

/**
 * Updates an order status and step progression in Firestore
 */
export const updateOrderStatus = async (orderId, newStatus, newStep) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const statusStep = newStep || getStatusStep(newStatus);

    await updateDoc(orderRef, {
      status: newStatus,
      statusStep,
      updatedAt: serverTimestamp(),
    });
    return { orderId, status: newStatus, statusStep };
  } catch (error) {
    console.error('Error updating order status in Firestore:', error);
    throw error;
  }
};

/**
 * Deletes a customer order from Firestore
 */
export const deleteOrder = async (orderId) => {
  try {
    await deleteDoc(doc(db, ORDERS_COLLECTION, orderId));
    return orderId;
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};
