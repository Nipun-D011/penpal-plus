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

const PRINT_JOBS_COLLECTION = 'print_jobs';

/**
 * Subscribes to real-time updates for print jobs from Cloud Firestore
 */
export const subscribeToPrintJobs = (onUpdate, onError) => {
  try {
    const q = query(collection(db, PRINT_JOBS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const jobs = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        onUpdate(jobs);
      },
      (error) => {
        console.error('Error in print jobs real-time subscription:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to subscribe to print jobs:', error);
    if (onError) onError(error);
    return () => {};
  }
};

/**
 * Fetches all print jobs once
 */
export const getPrintJobs = async () => {
  try {
    const snapshot = await getDocs(collection(db, PRINT_JOBS_COLLECTION));
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error('Error fetching print jobs:', error);
    throw error;
  }
};

/**
 * Creates a new print job in Firestore
 */
export const createPrintJob = async (jobData) => {
  try {
    const jobId = jobData.id || `PP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const jobRef = doc(db, PRINT_JOBS_COLLECTION, jobId);

    const payload = {
      ...jobData,
      id: jobId,
      status: jobData.status || 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(jobRef, payload);
    return payload;
  } catch (error) {
    console.error('Error creating print job:', error);
    throw error;
  }
};

/**
 * Updates the status of an existing print job (e.g. dragging across Kanban columns)
 */
export const updatePrintJobStatus = async (jobId, newStatus) => {
  try {
    const jobRef = doc(db, PRINT_JOBS_COLLECTION, jobId);
    await updateDoc(jobRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
    return { jobId, status: newStatus };
  } catch (error) {
    console.error('Error updating print job status:', error);
    throw error;
  }
};

/**
 * Deletes a print job from Firestore
 */
export const deletePrintJob = async (jobId) => {
  try {
    await deleteDoc(doc(db, PRINT_JOBS_COLLECTION, jobId));
    return jobId;
  } catch (error) {
    console.error('Error deleting print job:', error);
    throw error;
  }
};
