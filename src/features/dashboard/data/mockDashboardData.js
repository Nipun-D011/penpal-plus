export const mockDashboardMetrics = {
  todaySales: {
    amount: 'Rs. 48,250',
    change: '+12% vs. yesterday',
    isPositive: true,
  },
  activePrintJobs: {
    count: 23,
    subtext: '6 due today',
  },
  lowStockItems: {
    count: 9,
    subtext: 'needs reorder',
    isAlert: true,
  },
  pendingOrders: {
    count: 14,
    subtext: '4 awaiting confirmation',
  },
};

export const mockWeeklySalesData = [
  { day: 'Mon', sales: 42000, color: '#131e36' },
  { day: 'Tue', sales: 58000, color: '#131e36' },
  { day: 'Wed', sales: 36000, color: '#131e36' },
  { day: 'Thu', sales: 68000, color: '#131e36' },
  { day: 'Fri', sales: 52000, color: '#131e36' },
  { day: 'Sat', sales: 78000, color: '#e8a838', isHighlight: true },
  { day: 'Sun', sales: 62000, color: '#131e36' },
];

export const mockPrintJobStatus = [
  { id: 'pending', label: 'Pending', count: 7, colorClass: 'bg-amber-100/70 text-amber-800 border-amber-200' },
  { id: 'prepress', label: 'Scanning / prepress', count: 4, colorClass: 'bg-blue-100/70 text-blue-700 border-blue-200' },
  { id: 'printing', label: 'Printing', count: 6, colorClass: 'bg-orange-100/70 text-orange-800 border-orange-200' },
  { id: 'ready', label: 'Ready for collection', count: 6, colorClass: 'bg-emerald-100/70 text-emerald-800 border-emerald-200' },
];

export const mockRecentOrders = [
  {
    id: 'ORD-0512',
    customer: 'Nimal Silva',
    status: 'Processing',
    statusVariant: 'processing',
    amount: 'Rs. 3,200',
  },
  {
    id: 'ORD-0511',
    customer: 'Kumari Fonseka',
    status: 'Delivered',
    statusVariant: 'delivered',
    amount: 'Rs. 1,450',
  },
  {
    id: 'ORD-0510',
    customer: "St. Anne's College",
    status: 'New',
    statusVariant: 'new',
    amount: 'Rs. 18,900',
  },
  {
    id: 'ORD-0509',
    customer: 'Ruwan Jayasuriya',
    status: 'Delivered',
    statusVariant: 'delivered',
    amount: 'Rs. 890',
  },
];

export const mockLowStockAlerts = [
  {
    id: 'item-1',
    name: 'A4 Copy Paper (Ream)',
    inStock: 6,
    reorderAt: 20,
  },
  {
    id: 'item-2',
    name: 'Grade 5 Exercise Books',
    inStock: 11,
    reorderAt: 25,
  },
  {
    id: 'item-3',
    name: 'Sinhala Dictionary – Concise Ed.',
    inStock: 4,
    reorderAt: 10,
  },
  {
    id: 'item-4',
    name: 'Toner Cartridge (HP 12A)',
    inStock: 1,
    reorderAt: 5,
  },
];
