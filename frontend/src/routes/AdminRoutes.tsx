import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/admin/Dashboard/SystemAdminDashboard';


const AdminRoutes: React.FC = () => {


  return (
    <Routes>
      {/* Default redirect to admin dashboard */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      
      {/* Main dashboard */}
      <Route path="/dashboard" element={<AdminDashboard />} />
      
      {/* User Management */}
      <Route path="/users" element={<AdminDashboard />} />
      <Route path="/users/:userId" element={<AdminDashboard />} />
      <Route path="/users/create" element={<AdminDashboard />} />
      <Route path="/users/roles" element={<AdminDashboard />} />
      
      {/* Account Authorization */}
      <Route path="/authorizations" element={<AdminDashboard />} />
      <Route path="/authorizations/pending" element={<AdminDashboard />} />
      <Route path="/authorizations/approved" element={<AdminDashboard />} />
      <Route path="/authorizations/rejected" element={<AdminDashboard />} />
      
      {/* Child Submissions */}
      <Route path="/child-submissions" element={<AdminDashboard />} />
      <Route path="/child-submissions/pending" element={<AdminDashboard />} />
      <Route path="/child-submissions/:childId" element={<AdminDashboard />} />
      <Route path="/child-submissions/approved" element={<AdminDashboard />} />
      
      {/* Duplication Conflicts */}
      <Route path="/duplications" element={<AdminDashboard />} />
      <Route path="/duplications/:conflictId" element={<AdminDashboard />} />
      <Route path="/duplications/resolved" element={<AdminDashboard />} />
      
      {/* Audit Logs */}
      <Route path="/audit-logs" element={<AdminDashboard />} />
      <Route path="/audit-logs/:logId" element={<AdminDashboard />} />
      <Route path="/audit-logs/security" element={<AdminDashboard />} />
      
      {/* System Settings */}
      <Route path="/settings" element={<AdminDashboard />} />
      <Route path="/settings/general" element={<AdminDashboard />} />
      <Route path="/settings/security" element={<AdminDashboard />} />
      <Route path="/settings/notifications" element={<AdminDashboard />} />
      <Route path="/settings/backup" element={<AdminDashboard />} />
      
      {/* Reports */}
      <Route path="/reports" element={<AdminDashboard />} />
      <Route path="/reports/users" element={<AdminDashboard />} />
      <Route path="/reports/children" element={<AdminDashboard />} />
      <Route path="/reports/sponsorships" element={<AdminDashboard />} />
      <Route path="/reports/audit" element={<AdminDashboard />} />
      
      {/* Profile */}
      <Route path="/profile" element={<AdminDashboard />} />
      <Route path="/profile/edit" element={<AdminDashboard />} />
      <Route path="/profile/security" element={<AdminDashboard />} />
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;