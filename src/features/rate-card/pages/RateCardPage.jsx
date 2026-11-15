import { useState } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import RateCardTable from '../components/RateCardTable';
import AddRateModal from '../components/AddRateModal';
import EditRateModal from '../components/EditRateModal';
import { initialRateCardData } from '../data/mockRateCardData';

export const RateCardPage = () => {
  const [rates, setRates] = useState(initialRateCardData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAddRate = (newRate) => {
    setRates((prev) => [newRate, ...prev]);
  };

  const handleUpdateRate = (updatedRate) => {
    setRates((prev) =>
      prev.map((item) => (item.id === updatedRate.id ? updatedRate : item))
    );
  };

  const handleDeleteRate = (rateId) => {
    setRates((prev) => prev.filter((item) => item.id !== rateId));
  };

  const headerActions = (
    <button
      type="button"
      onClick={() => setIsAddModalOpen(true)}
      className="bg-[#dfa84a] hover:bg-[#c9933b] text-[#131d33] font-semibold text-xs rounded-lg px-4 py-2.5 flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
    >
      <Plus className="w-4 h-4 stroke-[2.5]" />
      <span>Add rate</span>
    </button>
  );

  return (
    <DashboardLayout
      title="Printing rate card"
      subtitle="Standardized, fixed pricing applied automatically to every job"
      headerActions={headerActions}
    >
      <div className="space-y-6">
        <RateCardTable
          rates={rates}
          onEditRate={(item) => setEditingItem(item)}
        />
      </div>

      {/* Add Rate Modal */}
      <AddRateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddRate}
      />

      {/* Edit Rate Modal */}
      <EditRateModal
        isOpen={Boolean(editingItem)}
        rateItem={editingItem}
        onClose={() => setEditingItem(null)}
        onUpdate={handleUpdateRate}
        onDelete={handleDeleteRate}
      />
    </DashboardLayout>
  );
};

export default RateCardPage;
