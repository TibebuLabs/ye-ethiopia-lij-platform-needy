import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import InstitutionDashboard from '../InstitutionDashboard/InstitutionDashboard';


const InstitutionRoutes: React.FC = () => {
  // Check if user is authenticated
  // const isAuthenticated = localStorage.getItem('token') !== null;
  
  // If not authenticated, redirect to login
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/institution/dashboard" replace />} />
      <Route path="/dashboard" element={<InstitutionDashboard />} />
      <Route path="/submit-child" element={<InstitutionDashboard />} />
      <Route path="/track-status" element={<InstitutionDashboard />} />
      <Route path="/intervention-logs" element={<InstitutionDashboard />} />
      <Route path="/children" element={<InstitutionDashboard />} />
      <Route path="/reports" element={<InstitutionDashboard />} />
      <Route path="/profile" element={<InstitutionDashboard />} />
      <Route path="/settings" element={<InstitutionDashboard />} />
      <Route path="*" element={<Navigate to="/institution/dashboard" replace />} />
    </Routes>
  );
};

export default InstitutionRoutes;