import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import Card from '../../../components/common/Card';
import InventoryStatCard from '../components/InventoryStatCard';
import InventoryFilters from '../components/InventoryFilters';
import InventoryTable from '../components/InventoryTable';
import AddItemModal from '../components/AddItemModal';
import EditItemModal from '../components/EditItemModal';
import {
  mockInventoryStats,
  mockInventoryCategories,
  mockStockStatuses,
  mockInventoryItems,
} from '../data/mockInventoryData';

export const InventoryPage = () => {
  const [items, setItems] = useState(mockInventoryItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [selectedStatus, setSelectedStatus] = useState('All stock status');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Filter items based on search and selected dropdowns
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search matches title, code (ISBN/SKU), or category
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Category matches
      const matchesCategory =
        selectedCategory === 'All categories' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      // Stock status matches
      const matchesStatus =
        selectedStatus === 'All stock status' ||
        item.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [items, searchQuery, selectedCategory, selectedStatus]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All categories');
    setSelectedStatus('All stock status');
  };

  const handleAddItem = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
  };

  const handleSaveEditItem = (updatedItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
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
      subtitle="248 titles tracked across 6 categories"
      headerActions={headerActions}
    >
      <div className="space-y-6">
        {/* Top 4 Inventory Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InventoryStatCard
            title="Total titles"
            value={mockInventoryStats.totalTitles}
            variant="default"
          />
          <InventoryStatCard
            title="Inventory value"
            value={mockInventoryStats.inventoryValue}
            variant="default"
          />
          <InventoryStatCard
            title="Low stock"
            value={mockInventoryStats.lowStock}
            variant="amber"
          />
          <InventoryStatCard
            title="Out of stock"
            value={mockInventoryStats.outOfStock}
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

      {/* Edit Item In-UI Modal (Replaces browser alert popup) */}
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
