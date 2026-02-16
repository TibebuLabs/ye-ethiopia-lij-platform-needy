import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SponsorDashboard from "../sponsor/Dashboard/SponsorDashboard";

const SponsorRoutes: React.FC = () => {
  // Check if user is authenticated
//   const isAuthenticated = localStorage.getItem('token') !== null;
  
  // If not authenticated, redirect to login
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sponsor/dashboard" replace />} />
      <Route path="/dashboard" element={<SponsorDashboard />} />
      <Route path="/browse-children" element={<SponsorDashboard />} />
      <Route path="/my-children" element={<SponsorDashboard />} />
      <Route path="/sponsorship-history" element={<SponsorDashboard />} />
      <Route path="/submit-child" element={<SponsorDashboard />} />
      <Route path="/submission-status" element={<SponsorDashboard />} />
      <Route path="/profile" element={<SponsorDashboard />} />
      <Route path="/settings" element={<SponsorDashboard />} />
      <Route path="*" element={<Navigate to="/sponsor/dashboard" replace />} />
    </Routes>
  );
};

export default SponsorRoutes;