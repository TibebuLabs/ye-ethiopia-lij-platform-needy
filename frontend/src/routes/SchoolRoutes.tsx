// ============== SchoolRoutes.tsx ==============
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SchoolPortalDashboard from '../school/SchoolPortalDashboard';
import EnrollChild from '../school/EnrollChild';
import UpdateStatus from '../school/UpdateStatus';
import AcademicReports from '../school/AcademicReports';

const SchoolRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Default redirect to School dashboard */}
      <Route path="/" element={<Navigate to="/school/dashboard" replace />} />
      
      {/* Main dashboard */}
      <Route path="/dashboard" element={<SchoolPortalDashboard />} />
      
      {/* Enroll Child - UC-15 */}
      <Route path="/enroll" element={<EnrollChild />} />
      <Route path="/enroll/:childId" element={<EnrollChild />} />
      
      {/* Update Status - UC-16 */}
      <Route path="/update-status" element={<UpdateStatus />} />
      <Route path="/update-status/:studentId" element={<UpdateStatus />} />
      
      {/* Reports */}
      <Route path="/reports" element={<AcademicReports />} />
      <Route path="/reports/:reportId" element={<AcademicReports />} />
      
      {/* Settings */}
      <Route path="/settings" element={<SchoolPortalDashboard />} />
      <Route path="/settings/general" element={<SchoolPortalDashboard />} />
      <Route path="/settings/academic" element={<SchoolPortalDashboard />} />
      <Route path="/settings/notifications" element={<SchoolPortalDashboard />} />
      
      {/* Profile */}
      <Route path="/profile" element={<SchoolPortalDashboard />} />
      <Route path="/profile/edit" element={<SchoolPortalDashboard />} />
      <Route path="/profile/security" element={<SchoolPortalDashboard />} />
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/school/dashboard" replace />} />
    </Routes>
  );
};

export default SchoolRoutes;