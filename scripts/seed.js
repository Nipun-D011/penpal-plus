import { readFileSync } from 'fs';
import { resolve } from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// 1. Manually parse .env for Node.js environment
const parseEnv = () => {
  try {
    const envPath = resolve(process.cwd(), '.env');
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        envVars[key.trim()] = values.join('=').trim();
      }
    });
    return envVars;
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    process.exit(1);
  }
};

const env = parseEnv();

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

// 2. Initialize Firebase in Node
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Official Pen Pal Plus Starter Datasets
const inventoryItems = [
  {
    id: 'inv-1',
    initial: 'B',
    title: 'Grade 5 Exercise Book (80pg)',
    code: 'SKU EB-080-G5',
    category: 'Stationery',
    stock: 11,
    reorderLevel: 25,
    unitPrice: 'Rs. 95',
    status: 'Low stock',
    statusVariant: 'low',
  },
  {
    id: 'inv-2',
    initial: 'S',
    title: 'Sinhala Dictionary – Concise Ed.',
    code: 'ISBN 978-955-20-1122-4',
    category: 'Reference',
    stock: 4,
    reorderLevel: 10,
    unitPrice: 'Rs. 850',
    status: 'Low stock',
    statusVariant: 'warning',
  },
  {
    id: 'inv-3',
    initial: 'M',
    title: 'Madol Doova (Sinhala Novel)',
    code: 'ISBN 978-955-20-0087-7',
    category: 'Novels',
    stock: 64,
    reorderLevel: 15,
    unitPrice: 'Rs. 420',
    status: 'In stock',
    statusVariant: 'in-stock',
  },
  {
    id: 'inv-4',
    initial: 'A',
    title: 'A4 Copy Paper (Ream, 80gsm)',
    code: 'SKU PP-A4-80',
    category: 'Stationery',
    stock: 6,
    reorderLevel: 20,
    unitPrice: 'Rs. 1,050',
    status: 'Low stock',
    statusVariant: 'low',
  },
  {
    id: 'inv-5',
    initial: 'O',
    title: 'O/L Combined Mathematics Guide',
    code: 'ISBN 978-955-20-4456-1',
    category: 'School books',
    stock: 38,
    reorderLevel: 12,
    unitPrice: 'Rs. 690',
    status: 'In stock',
    statusVariant: 'in-stock',
  },
  {
    id: 'inv-6',
    initial: 'T',
    title: 'Toner Cartridge (HP 12A)',
    code: 'SKU TC-HP12A',
    category: 'Consumables',
    stock: 1,
    reorderLevel: 5,
    unitPrice: 'Rs. 6,200',
    status: 'Out of stock',
    statusVariant: 'out-of-stock',
  },
  {
    id: 'inv-7',
    initial: 'G',
    title: 'Gee Sara Gee (Songbook)',
    code: 'ISBN 978-955-20-2233-5',
    category: 'Novels',
    stock: 52,
    reorderLevel: 10,
    unitPrice: 'Rs. 380',
    status: 'In stock',
    statusVariant: 'in-stock',
  },
];

const suppliers = [
  {
    id: 'sup-1',
    name: 'Sarasavi Wholesalers',
    category: 'Books & publications',
    contact: '011 258 3390',
    email: 'orders@sarasavi.lk',
    address: 'No. 30 Stanley Tillakaratne Mawatha, Nugegoda',
    lastPurchase: '14 Aug 2026',
    totalPurchases: 'Rs. 412,000',
    outstanding: 'Rs. 38,500',
    paymentTerms: 'Credit 30 Days',
  },
  {
    id: 'sup-2',
    name: 'Lanka Paper Mills',
    category: 'Paper & consumables',
    contact: '031 222 4410',
    email: 'sales@lankapapermills.lk',
    address: 'Industrial Estate, Veyangoda',
    lastPurchase: '12 Aug 2026',
    totalPurchases: 'Rs. 268,900',
    outstanding: 'Rs. 0',
    paymentTerms: 'Cash on Delivery',
  },
  {
    id: 'sup-3',
    name: 'Ceylon Print Supplies',
    category: 'Toner & printing hardware',
    contact: '011 476 2231',
    email: 'service@ceylonprint.com',
    address: 'High Level Road, Maharagama',
    lastPurchase: '09 Aug 2026',
    totalPurchases: 'Rs. 156,400',
    outstanding: 'Rs. 12,000',
    paymentTerms: 'Credit 15 Days',
  },
  {
    id: 'sup-4',
    name: 'M.D. Stationers (Pvt) Ltd',
    category: 'Stationery',
    contact: '037 222 1187',
    email: 'mdstationers.sales@gmail.com',
    address: 'Colombo Road, Kurunegala',
    lastPurchase: '05 Aug 2026',
    totalPurchases: 'Rs. 89,750',
    outstanding: 'Rs. 0',
    paymentTerms: 'Net 30 Days',
  },
];

const rateCards = [
  { id: 'rc-1', service: 'Photocopy – black & white', unit: 'Per page', standardRate: 'Rs. 3.00', bulkRate: 'Rs. 2.50 (100+)', lastUpdated: '10 Aug 2026' },
  { id: 'rc-2', service: 'Photocopy – colour', unit: 'Per page', standardRate: 'Rs. 30.00', bulkRate: 'Rs. 25.00 (50+)', lastUpdated: '10 Aug 2026' },
  { id: 'rc-3', service: 'Spiral binding', unit: 'Per document', standardRate: 'Rs. 200.00', bulkRate: '—', lastUpdated: '15 Jul 2026' },
  { id: 'rc-4', service: 'Hard-cover binding', unit: 'Per document', standardRate: 'Rs. 1,500.00', bulkRate: '—', lastUpdated: '15 Jul 2026' },
  { id: 'rc-5', service: 'Lamination', unit: 'Per sheet (A4)', standardRate: 'Rs. 50.00', bulkRate: 'Rs. 40.00 (20+)', lastUpdated: '01 Aug 2026' },
  { id: 'rc-6', service: 'Banner printing', unit: 'Per sq. ft', standardRate: 'Rs. 300.00', bulkRate: '—', lastUpdated: '22 Jun 2026' },
  { id: 'rc-7', service: 'Business cards', unit: 'Per 100', standardRate: 'Rs. 1,500.00', bulkRate: 'Rs. 1,200.00 (500+)', lastUpdated: '10 Jul 2026' },
  { id: 'rc-8', service: 'ID card printing', unit: 'Per card', standardRate: 'Rs. 150.00', bulkRate: 'Rs. 120.00 (30+)', lastUpdated: '10 Jul 2026' },
];

async function seed() {
  console.log('\n=============================================');
  console.log('Starting Pen Pal Plus Firestore Seeding...');
  console.log(`Target Project: ${env.VITE_FIREBASE_PROJECT_ID}`);
  console.log('=============================================\n');

  try {
    // 1. Seed Inventory
    process.stdout.write('[1/3] Seeding inventory items...');
    for (const item of inventoryItems) {
      await setDoc(doc(db, 'inventory', item.id), {
        ...item,
        updatedAt: serverTimestamp(),
      });
    }
    console.log(` [DONE] (${inventoryItems.length} items seeded)`);

    // 2. Seed Suppliers
    process.stdout.write('[2/3] Seeding suppliers...');
    for (const sup of suppliers) {
      await setDoc(doc(db, 'suppliers', sup.id), {
        ...sup,
        updatedAt: serverTimestamp(),
      });
    }
    console.log(` [DONE] (${suppliers.length} suppliers seeded)`);

    // 3. Seed Rate Cards
    process.stdout.write('[3/3] Seeding printing rate cards...');
    for (const rc of rateCards) {
      await setDoc(doc(db, 'rate_cards', rc.id), {
        ...rc,
        updatedAt: serverTimestamp(),
      });
    }
    console.log(` [DONE] (${rateCards.length} rate cards seeded)`);

    console.log('\nDatabase seeding completed successfully.');
    console.log('You can check the Firebase Console under Firestore Database to view the data.\n');
    process.exit(0);
  } catch (error) {
    console.error('\n[ERROR] Seeding failed:', error);
    process.exit(1);
  }
}

seed();
