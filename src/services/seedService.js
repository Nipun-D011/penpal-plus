import { doc, setDoc, serverTimestamp, collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from './firebase';
import { mockInventoryItems } from '../features/inventory/data/mockInventoryData';
import { mockSuppliers } from '../features/suppliers/data/mockSupplierData';
import { mockOrders } from '../features/orders/data/mockOrderData';
import { mockPrintJobs } from '../features/print-jobs/data/mockPrintJobData';
import { mockSupplierPurchaseOrders, mockSupplierBills } from '../features/supplier-portal/data/mockSupplierPortalData';

export const mockRateCards = [
  { id: 'rc-1', service: 'Photocopy – black & white', unit: 'Per page', standardRate: 'Rs. 3.00', bulkRate: 'Rs. 2.50 (100+)', lastUpdated: '10 Aug 2026' },
  { id: 'rc-2', service: 'Photocopy – colour', unit: 'Per page', standardRate: 'Rs. 30.00', bulkRate: 'Rs. 25.00 (50+)', lastUpdated: '10 Aug 2026' },
  { id: 'rc-3', service: 'Spiral binding', unit: 'Per document', standardRate: 'Rs. 200.00', bulkRate: '—', lastUpdated: '15 Jul 2026' },
  { id: 'rc-4', service: 'Hard-cover binding', unit: 'Per document', standardRate: 'Rs. 1,500.00', bulkRate: '—', lastUpdated: '15 Jul 2026' },
  { id: 'rc-5', service: 'Lamination', unit: 'Per sheet (A4)', standardRate: 'Rs. 50.00', bulkRate: 'Rs. 40.00 (20+)', lastUpdated: '01 Aug 2026' },
  { id: 'rc-6', service: 'Banner printing', unit: 'Per sq. ft', standardRate: 'Rs. 300.00', bulkRate: '—', lastUpdated: '22 Jun 2026' },
  { id: 'rc-7', service: 'Business cards', unit: 'Per 100', standardRate: 'Rs. 1,500.00', bulkRate: 'Rs. 1,200.00 (500+)', lastUpdated: '10 Jul 2026' },
  { id: 'rc-8', service: 'ID card printing', unit: 'Per card', standardRate: 'Rs. 150.00', bulkRate: 'Rs. 120.00 (30+)', lastUpdated: '10 Jul 2026' },
];

/**
 * Checks if the inventory collection is empty
 */
export const isDatabaseEmpty = async () => {
  try {
    const q = query(collection(db, 'inventory'), limit(1));
    const snap = await getDocs(q);
    return snap.empty;
  } catch (error) {
    console.error('Error checking database status:', error);
    return false;
  }
};

/**
 * Seeds Firestore with complete Pen Pal Plus datasets
 */
export const seedFirestoreDatabase = async (onProgress = () => {}) => {
  try {
    onProgress('Seeding inventory items...');
    for (const item of mockInventoryItems) {
      await setDoc(doc(db, 'inventory', item.id), {
        ...item,
        updatedAt: serverTimestamp(),
      });
    }

    onProgress('Seeding suppliers...');
    for (const sup of mockSuppliers) {
      await setDoc(doc(db, 'suppliers', sup.id), {
        ...sup,
        updatedAt: serverTimestamp(),
      });
    }

    onProgress('Seeding printing rate cards...');
    for (const rc of mockRateCards) {
      await setDoc(doc(db, 'rate_cards', rc.id), {
        ...rc,
        updatedAt: serverTimestamp(),
      });
    }

    onProgress('Seeding customer orders...');
    for (const order of mockOrders) {
      await setDoc(doc(db, 'orders', order.id), {
        ...order,
        createdAt: serverTimestamp(),
      });
    }

    onProgress('Seeding print jobs...');
    for (const job of mockPrintJobs) {
      await setDoc(doc(db, 'print_jobs', job.id), {
        ...job,
        createdAt: serverTimestamp(),
      });
    }

    onProgress('Seeding purchase orders & vendor bills...');
    for (const po of mockSupplierPurchaseOrders) {
      await setDoc(doc(db, 'purchase_orders', po.id), {
        ...po,
        createdAt: serverTimestamp(),
      });
    }
    for (const bill of mockSupplierBills) {
      await setDoc(doc(db, 'supplier_bills', bill.id), {
        ...bill,
        createdAt: serverTimestamp(),
      });
    }

    onProgress('Database seeding complete!');
    return { success: true };
  } catch (error) {
    console.error('Error seeding Firestore database:', error);
    throw error;
  }
};
