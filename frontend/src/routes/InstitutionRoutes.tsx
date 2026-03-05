// InstitutionRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import InstitutionDashboard from '../relignbased-institu/InstitutionDashboard/InstitutionDashboard';

const InstitutionRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/institution/dashboard" replace />} />
      <Route path="/dashboard" element={<InstitutionDashboard />} />
      <Route path="/submit-child" element={<InstitutionDashboard />} />
      <Route path="/submission-status" element={<InstitutionDashboard />} />
      <Route path="/intervention-logs" element={<InstitutionDashboard />} />
      <Route path="/profile" element={<InstitutionDashboard />} />
      <Route path="/settings" element={<InstitutionDashboard />} />
      <Route path="*" element={<Navigate to="/institution/dashboard" replace />} />
    </Routes>
  );
};

export default InstitutionRoutes;