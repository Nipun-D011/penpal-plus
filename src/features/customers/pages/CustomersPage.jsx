import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import CustomerListTable from '../components/CustomerListTable';
import CustomerProfilePanel from '../components/CustomerProfilePanel';
import AddCustomerModal from '../components/AddCustomerModal';
import { mockCustomers } from '../data/mockCustomerData';

export const CustomersPage = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState(mockCustomers[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return customers;

    return customers.filter(
      (cust) =>
        cust.name.toLowerCase().includes(q) ||
        cust.phone.toLowerCase().includes(q) ||
        (cust.city && cust.city.toLowerCase().includes(q))
    );
  }, [customers, searchQuery]);

  // Find currently selected customer
  const selectedCustomer = useMemo(() => {
    return (
      customers.find((c) => c.id === selectedCustomerId) ||
      filteredCustomers[0] ||
      null
    );
  }, [customers, selectedCustomerId, filteredCustomers]);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomerId(customer.id);
  };

  const handleAddCustomer = (newCustomer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    setSelectedCustomerId(newCustomer.id);
  };

  const headerActions = (
    <button
      type="button"
      onClick={() => setIsAddModalOpen(true)}
      className="bg-[#e8a838] hover:bg-[#d89727] text-[#131d33] font-semibold text-xs md:text-sm px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#e8a838]/50"
    >
      <Plus className="w-4 h-4 stroke-[2.5]" />
      <span>Add customer</span>
    </button>
  );

  return (
    <DashboardLayout
      title="Customers"
      subtitle="312 profiles · centralized purchase history"
      headerActions={headerActions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Side: Customer List Table */}
        <div className="lg:col-span-7 xl:col-span-8">
          <CustomerListTable
            customers={filteredCustomers}
            selectedCustomerId={selectedCustomer?.id}
            onSelectCustomer={handleSelectCustomer}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {/* Right Side: Selected Customer Profile Panel */}
        <div className="lg:col-span-5 xl:col-span-4">
          <CustomerProfilePanel customer={selectedCustomer} />
        </div>
      </div>

      {/* Add Customer Dialog Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCustomer}
      />
    </DashboardLayout>
  );
};

export default CustomersPage;
