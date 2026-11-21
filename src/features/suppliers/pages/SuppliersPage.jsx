import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import SupplierListTable from '../components/SupplierListTable';
import AddSupplierModal from '../components/AddSupplierModal';
import SupplierDetailModal from '../components/SupplierDetailModal';
import { mockSuppliers } from '../data/mockSupplierData';
import {
  subscribeToSuppliers,
  addSupplier,
} from '../../../services/supplierService';

export const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time suppliers from Cloud Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToSuppliers(
      (liveSuppliers) => {
        if (liveSuppliers && liveSuppliers.length > 0) {
          setSuppliers(liveSuppliers);
        } else {
          setSuppliers(mockSuppliers);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to suppliers:', error);
        setSuppliers(mockSuppliers);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAddSupplier = async (newSupplier) => {
    try {
      await addSupplier(newSupplier);
    } catch (error) {
      console.error('Error adding supplier to Firestore:', error);
      setSuppliers((prev) => [newSupplier, ...prev]);
    }
  };

  const handleViewSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setIsDetailModalOpen(true);
  };

  const activeCount = suppliers.filter((s) => s.status !== 'Inactive').length;

  const headerActions = (
    <button
      type="button"
      onClick={() => setIsAddModalOpen(true)}
      className="bg-[#e8a838] hover:bg-[#d89727] text-[#131d33] font-semibold text-xs md:text-sm px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#e8a838]/50"
    >
      <Plus className="w-4 h-4 stroke-[2.5]" />
      <span>Add supplier</span>
    </button>
  );

  return (
    <DashboardLayout
      title="Suppliers"
      subtitle={`${activeCount} active suppliers · purchase & contact records`}
      headerActions={headerActions}
    >
      <div className="space-y-6">
        <SupplierListTable
          suppliers={suppliers}
          loading={loading}
          onViewSupplier={handleViewSupplier}
        />
      </div>

      {/* Add Supplier Modal */}
      <AddSupplierModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSupplier}
      />

      {/* Supplier View Details Modal */}
      <SupplierDetailModal
        supplier={selectedSupplier}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSupplier(null);
        }}
      />
    </DashboardLayout>
  );
};

export default SuppliersPage;
