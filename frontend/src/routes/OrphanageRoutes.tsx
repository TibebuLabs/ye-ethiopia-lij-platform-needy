import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import OrphanageDashboard from '../orphanages/OrphanageDashboard';

const OrphanageRoutes: React.FC = () => {
  // Check if user is authenticated
  // const isAuthenticated = localStorage.getItem('token') !== null;
  
  // If not authenticated, redirect to login
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/orphanage/dashboard" replace />} />
      
      {/* Main routes matching sidebar navigation */}
      <Route path="/dashboard" element={<OrphanageDashboard />} />
      <Route path="/submit-child" element={<OrphanageDashboard />} />
      <Route path="/submission-status" element={<OrphanageDashboard />} />
      <Route path="/intervention-log" element={<OrphanageDashboard />} />
      <Route path="/children-list" element={<OrphanageDashboard />} />
      
      {/* Additional routes (can be added later) */}
      <Route path="/profile" element={<OrphanageDashboard />} />
      <Route path="/settings" element={<OrphanageDashboard />} />
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/orphanage/dashboard" replace />} />
    </Routes>
  );
};

export default OrphanageRoutes;