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

const RATE_CARDS_COLLECTION = 'rate_cards';

/**
 * Subscribes to real-time rate card updates from Cloud Firestore
 */
export const subscribeToRateCards = (onUpdate, onError) => {
  try {
    const q = query(collection(db, RATE_CARDS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const rates = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        // Sort by id natural order or service name
        rates.sort((a, b) => {
          const numA = parseInt((a.id || '').replace(/\D/g, ''), 10);
          const numB = parseInt((b.id || '').replace(/\D/g, ''), 10);
          if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
          return (a.service || '').localeCompare(b.service || '');
        });

        onUpdate(rates);
      },
      (error) => {
        console.error('Error in rate cards real-time subscription:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to subscribe to rate cards:', error);
    if (onError) onError(error);
    return () => {};
  }
};

/**
 * Fetches all rate cards once
 */
export const getRateCards = async () => {
  try {
    const snapshot = await getDocs(collection(db, RATE_CARDS_COLLECTION));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Error fetching rate cards:', error);
    throw error;
  }
};

/**
 * Adds a new rate card service to Cloud Firestore
 */
export const addRateCard = async (rateData) => {
  try {
    const rateId = rateData.id || `rc-${Date.now()}`;
    const docRef = doc(db, RATE_CARDS_COLLECTION, rateId);

    const payload = {
      ...rateData,
      id: rateId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, payload);
    return { id: rateId, ...payload };
  } catch (error) {
    console.error('Error adding rate card:', error);
    throw error;
  }
};

/**
 * Updates an existing rate card service in Cloud Firestore
 */
export const updateRateCard = async (id, updatedData) => {
  try {
    const docRef = doc(db, RATE_CARDS_COLLECTION, id);
    const payload = {
      ...updatedData,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, payload);
    return { id, ...payload };
  } catch (error) {
    console.error('Error updating rate card:', error);
    throw error;
  }
};

/**
 * Deletes a rate card service from Cloud Firestore
 */
export const deleteRateCard = async (id) => {
  try {
    await deleteDoc(doc(db, RATE_CARDS_COLLECTION, id));
    return id;
  } catch (error) {
    console.error('Error deleting rate card:', error);
    throw error;
  }
};
