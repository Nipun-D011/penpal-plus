import { useState, useEffect, useMemo } from 'react';
import { Download, Calendar } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import ReportKpiCards from '../components/ReportKpiCards';
import RevenueTrendChart from '../components/RevenueTrendChart';
import RevenueByCategoryCard from '../components/RevenueByCategoryCard';
import TopSellingItemsTable from '../components/TopSellingItemsTable';
import ExportReportModal from '../components/ExportReportModal';
import { mockReportsData } from '../data/mockReportsData';
import { calculateReportsMetrics } from '../../../services/dashboardService';
import { subscribeToInvoices } from '../../../services/billingService';
import { subscribeToOrders } from '../../../services/orderService';

export const ReportsPage = () => {
  const [timeframe, setTimeframe] = useState('monthly'); // 'daily' | 'monthly' | 'yearly'
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);

  // Subscribe to live invoices and orders from Firestore
  useEffect(() => {
    const unsubInvoices = subscribeToInvoices((data) => setInvoices(data || []));
    const unsubOrders = subscribeToOrders((data) => setOrders(data || []));

    return () => {
      unsubInvoices();
      unsubOrders();
    };
  }, []);

  const baseData = mockReportsData.periods[timeframe] || mockReportsData.periods.monthly;

  const currentData = useMemo(() => {
    if (invoices.length === 0 && orders.length === 0) {
      return baseData;
    }

    const calculated = calculateReportsMetrics({
      invoices,
      orders,
      timeframe,
    });

    return {
      ...baseData,
      label: calculated.label || baseData.label,
      metrics: calculated.metrics || baseData.metrics,
      topSellingItems: calculated.topSellingItems || baseData.topSellingItems,
    };
  }, [invoices, orders, timeframe, baseData]);

  const headerActions = (
    <button
      type="button"
      onClick={() => setExportModalOpen(true)}
      className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 rounded-lg px-3.5 py-2 text-xs font-semibold shadow-sm flex items-center gap-2 transition-colors cursor-pointer"
    >
      <Download className="w-3.5 h-3.5 text-slate-500" />
      <span>Export report</span>
    </button>
  );

  return (
    <DashboardLayout
      title="Sales reports & analytics"
      subtitle="Remote-accessible performance overview for the owner"
      headerActions={headerActions}
    >
      <div className="space-y-6">
        {/* Filter Bar: Segmented Timeframe Switcher & Date Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Daily / Monthly / Yearly segmented buttons */}
          <div className="inline-flex p-1 bg-slate-200/60 rounded-xl border border-slate-200/60 self-start">
            <button
              type="button"
              onClick={() => setTimeframe('daily')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'daily'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('monthly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'monthly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('yearly')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'yearly'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly
            </button>
          </div>

          {/* Current Period Label / Selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="px-3.5 py-1.5 bg-white border border-slate-200/80 rounded-lg text-xs font-medium text-slate-700 shadow-xs flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentData.label}</span>
            </div>
          </div>
        </div>

        {/* 4 KPI Metric Cards */}
        <ReportKpiCards metrics={currentData.metrics} />

        {/* Middle Section: Revenue Trend (Left) & Category Breakdown (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          <div className="lg:col-span-7 xl:col-span-7">
            <RevenueTrendChart
              data={currentData.revenueTrend}
              title={
                timeframe === 'daily'
                  ? "Today's hourly revenue"
                  : timeframe === 'yearly'
                  ? 'Revenue trend – last 6 years'
                  : 'Revenue trend – last 6 months'
              }
            />
          </div>

          <div className="lg:col-span-5 xl:col-span-5">
            <RevenueByCategoryCard categories={currentData.revenueByCategory} />
          </div>
        </div>

        {/* Bottom Section: Top Selling Items Table */}
        <div>
          <TopSellingItemsTable
            items={currentData.topSellingItems}
            title={
              timeframe === 'daily'
                ? 'Top selling items today'
                : timeframe === 'yearly'
                ? 'Top selling items this year'
                : 'Top selling items this month'
            }
          />
        </div>
      </div>

      {/* Export Report Modal */}
      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        currentPeriod={currentData.label}
      />
    </DashboardLayout>
  );
};

export default ReportsPage;
