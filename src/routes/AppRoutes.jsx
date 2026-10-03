import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import SignupPage from '../features/auth/pages/SignupPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/register" element={<SignupPage />} />

        {/* Dashboard & App Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Placeholder Routes navigating back to dashboard for now */}
        <Route path="/reports" element={<DashboardPage />} />
        <Route path="/inventory" element={<DashboardPage />} />
        <Route path="/print-jobs" element={<DashboardPage />} />
        <Route path="/orders" element={<DashboardPage />} />
        <Route path="/billing" element={<DashboardPage />} />
        <Route path="/customers" element={<DashboardPage />} />
        <Route path="/suppliers" element={<DashboardPage />} />
        <Route path="/rate-card" element={<DashboardPage />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
