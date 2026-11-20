import { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/common/Card';
import InventoryStatCard from '../components/InventoryStatCard';
import InventoryFilters from '../components/InventoryFilters';
import InventoryTable from '../components/InventoryTable';
import AddItemModal from '../components/AddItemModal';
import EditItemModal from '../components/EditItemModal';
import {
  mockInventoryCategories,
  mockStockStatuses,
  mockInventoryItems,
} from '../data/mockInventoryData';
import {
  subscribeToInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from '../../../services/inventoryService';

export const InventoryPage = () => {
  const [items, setItems] = useState(mockInventoryItems);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [selectedStatus, setSelectedStatus] = useState('All stock status');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    const unsubscribe = subscribeToInventory(
      (firestoreItems) => {
        if (firestoreItems && firestoreItems.length > 0) {
          setItems(firestoreItems);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Compute live statistics dynamically from items
  const liveStats = useMemo(() => {
    const totalTitles = items.length;
    let totalValRaw = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    items.forEach((item) => {
      const stock = Number(item.stock) || 0;
      const reorder = Number(item.reorderLevel) || 0;
      const priceRaw =
        typeof item.unitPrice === 'number'
          ? item.unitPrice
          : parseInt(String(item.unitPrice || '0').replace(/[^0-9]/g, ''), 10) || 0;

      totalValRaw += stock * priceRaw;

      if (stock === 0) {
        outOfStockCount++;
      } else if (stock <= reorder) {
        lowStockCount++;
      }
    });

    const formattedValue =
      totalValRaw >= 1000000
        ? `Rs. ${(totalValRaw / 1000000).toFixed(2)}M`
        : totalValRaw >= 1000
        ? `Rs. ${(totalValRaw / 1000).toFixed(1)}K`
        : `Rs. ${totalValRaw.toLocaleString()}`;

    return {
      totalTitles,
      inventoryValue: formattedValue,
      lowStock: lowStockCount,
      outOfStock: outOfStockCount,
    };
  }, [items]);

  // Filter items based on search and selected dropdowns
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const title = item.title || '';
      const code = item.code || '';
      const category = item.category || '';
      const status = item.status || '';

      const matchesSearch =
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All categories' ||
        category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesStatus =
        selectedStatus === 'All stock status' ||
        status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchQuery, selectedCategory, selectedStatus]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All categories');
    setSelectedStatus('All stock status');
  };

  // Add Item to Firestore
  const handleAddItem = async (newItem) => {
    try {
      await addInventoryItem(newItem);
    } catch (error) {
      console.error('Failed to add item to Firestore:', error);
      setItems((prev) => [newItem, ...prev]);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  // Save Edit Item to Firestore
  const handleSaveEditItem = async (updatedItem) => {
    try {
      await updateInventoryItem(updatedItem.id, updatedItem);
    } catch (error) {
      console.error('Failed to update item in Firestore:', error);
      setItems((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    }
    setEditingItem(null);
  };

  // Delete Item from Firestore
  const handleDeleteItem = async (itemId) => {
    try {
      await deleteInventoryItem(itemId);
    } catch (error) {
      console.error('Failed to delete item from Firestore:', error);
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    }
    setEditingItem(null);
  };

  const headerActions = (
    <button
      type="button"
      onClick={() => setIsAddModalOpen(true)}
      className="bg-[#e8a838] hover:bg-[#d89727] text-[#131d33] font-semibold text-xs md:text-sm px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#e8a838]/50"
    >
      <Plus className="w-4 h-4 stroke-[2.5]" />
      <span>Add new item</span>
    </button>
  );

  return (
    <DashboardLayout
      title="Inventory"
      subtitle={`${liveStats.totalTitles} titles tracked across categories`}
      headerActions={headerActions}
    >
      <div className="space-y-6">
        {/* Top 4 Inventory Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InventoryStatCard
            title="Total titles"
            value={liveStats.totalTitles}
            variant="default"
          />
          <InventoryStatCard
            title="Inventory value"
            value={liveStats.inventoryValue}
            variant="default"
          />
          <InventoryStatCard
            title="Low stock"
            value={liveStats.lowStock}
            variant="amber"
          />
          <InventoryStatCard
            title="Out of stock"
            value={liveStats.outOfStock}
            variant="red"
          />
        </div>

        {/* Main Inventory Card with Filters & Table */}
        <Card className="p-5 md:p-6 shadow-sm">
          {/* Filters Bar */}
          <InventoryFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            categories={mockInventoryCategories}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            statuses={mockStockStatuses}
            onResetFilters={handleResetFilters}
          />

          {/* Items Table */}
          <InventoryTable
            items={filteredItems}
            onEdit={handleEditItem}
          />
        </Card>
      </div>

      {/* Add New Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
        categories={mockInventoryCategories}
      />

      {/* Edit Item In-UI Modal */}
      <EditItemModal
        isOpen={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEditItem}
        onDelete={handleDeleteItem}
        categories={mockInventoryCategories}
      />
    </DashboardLayout>
  );
};

export default InventoryPage;
