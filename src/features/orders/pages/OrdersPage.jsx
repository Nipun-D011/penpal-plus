import { useState, useMemo, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import OrderFilters from '../components/OrderFilters';
import OrdersTable from '../components/OrdersTable';
import OrderDetailProgressCard from '../components/OrderDetailProgressCard';
import NewOrderModal from '../components/NewOrderModal';
import { mockOrderStatusTabs, mockOrders } from '../data/mockOrderData';
import {
  subscribeToOrders,
  createOrder,
  updateOrderStatus,
} from '../../../services/orderService';

export const OrdersPage = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrderId, setSelectedOrderId] = useState(mockOrders[0]?.id || null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    const unsubscribe = subscribeToOrders(
      (firestoreOrders) => {
        if (firestoreOrders && firestoreOrders.length > 0) {
          setOrders(firestoreOrders);
        }
      },
      (error) => {
        console.error('Firestore customer orders subscription error:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filter orders based on status tab and search query
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const q = searchQuery.toLowerCase().trim();
      const id = order.id || '';
      const customer = order.customer || '';

      const matchesTab =
        activeTab === 'All' ||
        order.status?.toLowerCase() === activeTab.toLowerCase();

      const matchesSearch =
        !q ||
        id.toLowerCase().includes(q) ||
        customer.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  // Selected order details
  const selectedOrder = useMemo(() => {
    return (
      orders.find((o) => o.id === selectedOrderId) ||
      filteredOrders[0] ||
      null
    );
  }, [orders, selectedOrderId, filteredOrders]);

  const handleSelectOrder = (order) => {
    setSelectedOrderId(order.id);
  };

  const handleAddNewOrder = async (newOrder) => {
    try {
      await createOrder(newOrder);
      setSelectedOrderId(newOrder.id);
    } catch (error) {
      console.error('Failed to create order in Firestore:', error);
      setOrders((prev) => [newOrder, ...prev]);
      setSelectedOrderId(newOrder.id);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus, newStep) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus, statusStep: newStep } : o
      )
    );

    try {
      await updateOrderStatus(orderId, newStatus, newStep);
    } catch (error) {
      console.error('Failed to update order status in Firestore:', error);
    }
  };

  const headerActions = (
    <button
      type="button"
      onClick={() => setIsNewModalOpen(true)}
      className="bg-[#e8a838] hover:bg-[#d89727] text-[#131d33] font-semibold text-xs md:text-sm px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#e8a838]/50"
    >
      <Plus className="w-4 h-4 stroke-[2.5]" />
      <span>New order</span>
    </button>
  );

  return (
    <DashboardLayout
      title="Customer orders"
      subtitle="Full order history with live status tracking"
      headerActions={headerActions}
    >
      <div className="space-y-4">
        {/* Top Filters: Segmented Tabs & Search */}
        <OrderFilters
          statusTabs={mockOrderStatusTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Main Orders Table */}
        <OrdersTable
          orders={filteredOrders}
          selectedOrderId={selectedOrder?.id}
          onSelectOrder={handleSelectOrder}
        />

        {/* Bottom Order Progress & Detail Card */}
        <OrderDetailProgressCard
          order={selectedOrder}
          onUpdateStatus={handleUpdateOrderStatus}
        />
      </div>

      {/* New Order Modal Dialog */}
      <NewOrderModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAdd={handleAddNewOrder}
      />
    </DashboardLayout>
  );
};

export default OrdersPage;
