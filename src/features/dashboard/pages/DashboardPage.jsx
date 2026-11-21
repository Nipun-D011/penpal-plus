import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import MetricCard from '../components/MetricCard';
import SalesOverviewChart from '../components/SalesOverviewChart';
import PrintJobStatusCard from '../components/PrintJobStatusCard';
import RecentOrdersTable from '../components/RecentOrdersTable';
import LowStockAlerts from '../components/LowStockAlerts';
import {
  mockDashboardMetrics,
  mockWeeklySalesData,
  mockPrintJobStatus,
  mockRecentOrders,
  mockLowStockAlerts,
} from '../data/mockDashboardData';
import { calculateDashboardMetrics } from '../../../services/dashboardService';
import { subscribeToInvoices } from '../../../services/billingService';
import { subscribeToInventory } from '../../../services/inventoryService';
import { subscribeToPrintJobs } from '../../../services/printJobService';
import { subscribeToOrders } from '../../../services/orderService';

export const DashboardPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [printJobs, setPrintJobs] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);

  // Subscribe to live Firestore collections
  useEffect(() => {
    const unsubInvoices = subscribeToInvoices((data) => setInvoices(data || []));
    const unsubInventory = subscribeToInventory((data) => setInventory(data || []));
    const unsubJobs = subscribeToPrintJobs((data) => setPrintJobs(data || []));
    const unsubOrders = subscribeToOrders((data) => setOrders(data || []));

    return () => {
      unsubInvoices();
      unsubInventory();
      unsubJobs();
      unsubOrders();
    };
  }, []);

  // Compute live dashboard metrics
  const liveData = useMemo(() => {
    const hasData =
      invoices.length > 0 ||
      printJobs.length > 0 ||
      inventory.length > 0 ||
      orders.length > 0;

    if (!hasData) {
      return {
        metrics: mockDashboardMetrics,
        weeklySalesData: mockWeeklySalesData,
        printJobStatus: mockPrintJobStatus,
        recentOrders: mockRecentOrders,
        lowStockAlerts: mockLowStockAlerts,
      };
    }

    const calculated = calculateDashboardMetrics({
      invoices,
      printJobs,
      inventory,
      orders,
    });

    return {
      metrics: calculated.metrics || mockDashboardMetrics,
      weeklySalesData: calculated.weeklySalesData || mockWeeklySalesData,
      printJobStatus: calculated.printJobStatus || mockPrintJobStatus,
      recentOrders: calculated.recentOrders || mockRecentOrders,
      lowStockAlerts: calculated.lowStockAlerts || mockLowStockAlerts,
    };
  }, [invoices, printJobs, inventory, orders]);

  // Formatted current date
  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <DashboardLayout
      title="Dashboard"
      subtitle={`${todayFormatted} · Overview of today's shop activity`}
    >
      <div className="space-y-6">
        {/* Top 4 KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Today's sales"
            value={liveData.metrics.todaySales.amount}
            subtext={liveData.metrics.todaySales.subtext}
            trendType="positive"
            iconType="sales"
          />
          <MetricCard
            title="Active print jobs"
            value={liveData.metrics.activePrintJobs.count}
            subtext={liveData.metrics.activePrintJobs.subtext}
            trendType="neutral"
            iconType="printer"
          />
          <MetricCard
            title="Low stock items"
            value={liveData.metrics.lowStockItems.count}
            subtext={liveData.metrics.lowStockItems.subtext}
            trendType="alert"
            iconType="alert"
          />
          <MetricCard
            title="Pending orders"
            value={liveData.metrics.pendingOrders.count}
            subtext={liveData.metrics.pendingOrders.subtext}
            trendType="neutral"
            iconType="orders"
          />
        </div>

        {/* Middle Section: Weekly Sales Overview & Print Job Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-7 xl:col-span-8">
            <SalesOverviewChart data={liveData.weeklySalesData} />
          </div>
          <div className="lg:col-span-5 xl:col-span-4">
            <PrintJobStatusCard statuses={liveData.printJobStatus} />
          </div>
        </div>

        {/* Bottom Section: Recent Orders & Low Stock Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-7 xl:col-span-7">
            <RecentOrdersTable orders={liveData.recentOrders} />
          </div>
          <div className="lg:col-span-5 xl:col-span-5">
            <LowStockAlerts items={liveData.lowStockAlerts} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
