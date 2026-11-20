import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const INVENTORY_COLLECTION = 'inventory';

/**
 * Calculates stock status and badge variant based on quantity and reorder level
 */
export const calculateStockStatus = (stock, reorderLevel) => {
  const numStock = Number(stock) || 0;
  const numReorder = Number(reorderLevel) || 0;

  if (numStock <= 0) {
    return { status: 'Out of stock', statusVariant: 'out' };
  }
  if (numStock <= numReorder) {
    return { status: 'Low stock', statusVariant: 'low' };
  }
  return { status: 'In stock', statusVariant: 'in-stock' };
};

/**
 * Subscribes to real-time inventory updates from Firestore
 */
export const subscribeToInventory = (onUpdate, onError) => {
  try {
    const q = query(collection(db, INVENTORY_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        onUpdate(items);
      },
      (error) => {
        console.error('Error in inventory real-time listener:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to subscribe to inventory:', error);
    if (onError) onError(error);
    return () => {};
  }
};

/**
 * Fetches all inventory items once
 */
export const getInventoryItems = async () => {
  try {
    const snapshot = await getDocs(collection(db, INVENTORY_COLLECTION));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

/**
 * Adds a new item to Firestore
 */
export const addInventoryItem = async (itemData) => {
  try {
    const { status, statusVariant } = calculateStockStatus(
      itemData.stock,
      itemData.reorderLevel
    );

    const docRef = await addDoc(collection(db, INVENTORY_COLLECTION), {
      ...itemData,
      status: itemData.status || status,
      statusVariant: itemData.statusVariant || statusVariant,
      initial: itemData.initial || itemData.title?.charAt(0).toUpperCase() || 'P',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: docRef.id, ...itemData, status, statusVariant };
  } catch (error) {
    console.error('Error adding inventory item:', error);
    throw error;
  }
};

/**
 * Updates an existing item in Firestore
 */
export const updateInventoryItem = async (id, updatedData) => {
  try {
    const { status, statusVariant } = calculateStockStatus(
      updatedData.stock,
      updatedData.reorderLevel
    );

    const docRef = doc(db, INVENTORY_COLLECTION, id);
    const payload = {
      ...updatedData,
      status: updatedData.status || status,
      statusVariant: updatedData.statusVariant || statusVariant,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, payload);
    return { id, ...payload };
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};

/**
 * Deletes an item from Firestore
 */
export const deleteInventoryItem = async (id) => {
  try {
    await deleteDoc(doc(db, INVENTORY_COLLECTION, id));
    return id;
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
};
