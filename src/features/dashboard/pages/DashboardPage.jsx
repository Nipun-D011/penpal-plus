import React from 'react';
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

export const DashboardPage = () => {
  return (
    <DashboardLayout
      title="Dashboard"
      subtitle="Wednesday, 19 August 2026 · Overview of today's shop activity"
    >
      <div className="space-y-6">
        {/* Top 4 KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Today's sales"
            value={mockDashboardMetrics.todaySales.amount}
            subtext="12% vs. yesterday"
            trendType="positive"
            iconType="sales"
          />
          <MetricCard
            title="Active print jobs"
            value={mockDashboardMetrics.activePrintJobs.count}
            subtext={mockDashboardMetrics.activePrintJobs.subtext}
            trendType="neutral"
            iconType="printer"
          />
          <MetricCard
            title="Low stock items"
            value={mockDashboardMetrics.lowStockItems.count}
            subtext="needs reorder"
            trendType="alert"
            iconType="alert"
          />
          <MetricCard
            title="Pending orders"
            value={mockDashboardMetrics.pendingOrders.count}
            subtext={mockDashboardMetrics.pendingOrders.subtext}
            trendType="neutral"
            iconType="orders"
          />
        </div>

        {/* Middle Section: Weekly Sales Overview & Print Job Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-7 xl:col-span-8">
            <SalesOverviewChart data={mockWeeklySalesData} />
          </div>
          <div className="lg:col-span-5 xl:col-span-4">
            <PrintJobStatusCard statuses={mockPrintJobStatus} />
          </div>
        </div>

        {/* Bottom Section: Recent Orders & Low Stock Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-7 xl:col-span-7">
            <RecentOrdersTable orders={mockRecentOrders} />
          </div>
          <div className="lg:col-span-5 xl:col-span-5">
            <LowStockAlerts items={mockLowStockAlerts} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
