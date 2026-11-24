import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import SignupPage from '../features/auth/pages/SignupPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import InventoryPage from '../features/inventory/pages/InventoryPage';
import CustomersPage from '../features/customers/pages/CustomersPage';
import SuppliersPage from '../features/suppliers/pages/SuppliersPage';
import BillingPage from '../features/billing/pages/BillingPage';
import PrintJobsPage from '../features/print-jobs/pages/PrintJobsPage';
import OrdersPage from '../features/orders/pages/OrdersPage';
import CustomerPortalPage from '../features/customer-portal/pages/CustomerPortalPage';
import SupplierPortalPage from '../features/supplier-portal/pages/SupplierPortalPage';
import ReportsPage from '../features/reports/pages/ReportsPage';
import RateCardPage from '../features/rate-card/pages/RateCardPage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth, getRoleHomeRoute } from '../context/AuthContext';

const RootRedirect = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-8 h-8 border-4 border-[#131d33] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={getRoleHomeRoute(user?.role)} replace />;
  }

  return <Navigate to="/login" replace />;
};

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Initial Entry Route */}
        <Route path="/" element={<RootRedirect />} />

        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<SignupPage />} />

        {/* Protected Dashboard & Operations Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
              <InventoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/print-jobs"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
              <PrintJobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
              <BillingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
              <CustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
              <SuppliersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rate-card"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
              <RateCardPage />
            </ProtectedRoute>
          }
        />

        {/* Customer Portal Routes */}
        <Route
          path="/portal"
          element={<Navigate to="/portal/orders" replace />}
        />
        <Route
          path="/portal/orders"
          element={
            <ProtectedRoute allowedRoles={['Customer', 'Admin', 'Staff']}>
              <CustomerPortalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portal/invoices"
          element={
            <ProtectedRoute allowedRoles={['Customer', 'Admin', 'Staff']}>
              <CustomerPortalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portal/profile"
          element={
            <ProtectedRoute allowedRoles={['Customer', 'Admin', 'Staff']}>
              <CustomerPortalPage />
            </ProtectedRoute>
          }
        />

        {/* Supplier Portal Routes */}
        <Route
          path="/supplier"
          element={<Navigate to="/supplier/portal" replace />}
        />
        <Route
          path="/supplier/portal"
          element={
            <ProtectedRoute allowedRoles={['Supplier', 'Admin']}>
              <SupplierPortalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/purchase-orders"
          element={
            <ProtectedRoute allowedRoles={['Supplier', 'Admin']}>
              <SupplierPortalPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier/bills"
          element={
            <ProtectedRoute allowedRoles={['Supplier', 'Admin']}>
              <SupplierPortalPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
