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
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { calculateStockStatus } from './inventoryService';
import { recordCustomerPurchase } from './customerService';

const INVOICES_COLLECTION = 'invoices';
const INVENTORY_COLLECTION = 'inventory';

/**
 * Calculates the next sequential invoice number based on existing records
 */
export const generateNextInvoiceNumber = (invoices = []) => {
  let maxNum = 846;
  invoices.forEach((inv) => {
    const invId = inv.invoiceNumber || inv.id || '';
    const match = invId.match(/INV-2026-(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  });
  return `INV-2026-${String(maxNum + 1).padStart(4, '0')}`;
};

/**
 * Subscribes to real-time invoice updates from Cloud Firestore
 */
export const subscribeToInvoices = (onUpdate, onError) => {
  try {
    const q = query(collection(db, INVOICES_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const invoices = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        // Sort descending: newest on top
        invoices.sort((a, b) => {
          const timeA = a.createdAt?.toMillis
            ? a.createdAt.toMillis()
            : new Date(a.fullDate || 0).getTime() || 0;
          const timeB = b.createdAt?.toMillis
            ? b.createdAt.toMillis()
            : new Date(b.fullDate || 0).getTime() || 0;
          if (timeB !== timeA) return timeB - timeA;
          return (b.id || '').localeCompare(a.id || '');
        });

        onUpdate(invoices);
      },
      (error) => {
        console.error('Error in invoices real-time subscription:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to subscribe to invoices:', error);
    if (onError) onError(error);
    return () => {};
  }
};

/**
 * Fetches all invoices once
 */
export const getInvoices = async () => {
  try {
    const snapshot = await getDocs(collection(db, INVOICES_COLLECTION));
    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    return items.sort((a, b) => (b.id || '').localeCompare(a.id || ''));
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

/**
 * Creates an invoice in Cloud Firestore and automatically deducts sold quantities from inventory
 */
export const createInvoice = async (invoiceData) => {
  try {
    const invoiceId =
      invoiceData.invoiceNumber ||
      invoiceData.id ||
      `INV-2026-${Date.now().toString().slice(-4)}`;

    const invoiceDocRef = doc(db, INVOICES_COLLECTION, invoiceId);

    // Save the invoice document in Firestore
    const invoicePayload = {
      ...invoiceData,
      id: invoiceId,
      invoiceNumber: invoiceId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(invoiceDocRef, invoicePayload);

    // Only deduct inventory if it is not marked as a draft
    const isDraft = invoiceData.isDraft || invoiceData.status?.toLowerCase() === 'draft';
    if (!isDraft && Array.isArray(invoiceData.items) && invoiceData.items.length > 0) {
      await deductInventoryFromInvoice(invoiceData.items);
    }

    // If a customer is linked, record this purchase on their customer profile
    if (!isDraft && invoiceData.customerId) {
      await recordCustomerPurchase(invoiceData.customerId, invoicePayload);
    }

    return { id: invoiceId, ...invoicePayload };
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

/**
 * Deducts quantities of billed items from Firestore inventory documents
 */
export const deductInventoryFromInvoice = async (items) => {
  try {
    // 1. Fetch current inventory to match items by id or description
    const invSnap = await getDocs(collection(db, INVENTORY_COLLECTION));
    const inventoryList = invSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    for (const item of items) {
      const qty = Number(item.qty) || 0;
      if (qty <= 0) continue;

      // Find matching inventory document
      let matchedInv = null;

      if (item.inventoryId) {
        matchedInv = inventoryList.find((inv) => inv.id === item.inventoryId);
      }

      if (!matchedInv && item.description) {
        const itemDesc = item.description.toLowerCase().trim();
        matchedInv = inventoryList.find((inv) => {
          const invTitle = (inv.title || '').toLowerCase().trim();
          const invCode = (inv.code || '').toLowerCase().trim();
          return (
            invTitle === itemDesc ||
            invCode === itemDesc ||
            itemDesc.includes(invTitle) ||
            invTitle.includes(itemDesc)
          );
        });
      }

      // If matched, deduct stock safely using transaction
      if (matchedInv) {
        const itemDocRef = doc(db, INVENTORY_COLLECTION, matchedInv.id);
        await runTransaction(db, async (transaction) => {
          const freshDoc = await transaction.get(itemDocRef);
          if (!freshDoc.exists()) return;

          const currentData = freshDoc.data();
          const currentStock = Number(currentData.stock) || 0;
          const newStock = Math.max(0, currentStock - qty);
          const { status, statusVariant } = calculateStockStatus(
            newStock,
            currentData.reorderLevel
          );

          transaction.update(itemDocRef, {
            stock: newStock,
            status,
            statusVariant,
            updatedAt: serverTimestamp(),
          });
        });
      }
    }
  } catch (error) {
    console.error('Error deducting inventory stock:', error);
  }
};

/**
 * Updates status of an existing invoice (e.g. Paid, Pending, Overdue)
 */
export const updateInvoiceStatus = async (id, status, statusVariant = 'paid') => {
  try {
    const docRef = doc(db, INVOICES_COLLECTION, id);
    await updateDoc(docRef, {
      status,
      statusVariant,
      updatedAt: serverTimestamp(),
    });
    return { id, status, statusVariant };
  } catch (error) {
    console.error('Error updating invoice status:', error);
    throw error;
  }
};

/**
 * Deletes an invoice from Firestore
 */
export const deleteInvoice = async (id) => {
  try {
    await deleteDoc(doc(db, INVOICES_COLLECTION, id));
    return id;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};
