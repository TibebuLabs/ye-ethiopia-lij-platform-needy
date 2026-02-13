// ==================== routes/AppRoutes.tsx ====================
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// FIXED: Use correct relative paths (starting with ../ to go up one level from routes folder)
import HomePage from '../pages/public/Home/Home';
import LoginPage from '../pages/public/Auth/Login/Login';
import RegisterPage from '../pages/public/Auth/Register/Register';
import SponsorDashboard from '../sponsor/Dashboard/SponsorDashboard';

// Simple auth check
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Private Routes */}
        <Route
          path="/sponsor-dashboard"
          element={
            <PrivateRoute>
              <SponsorDashboard />
            </PrivateRoute>
          }
        />
        
        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};