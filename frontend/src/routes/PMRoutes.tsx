// ============== PMRoutes.tsx ==============
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PMWorkspace from '../PMWorkspace/PMWorkspace';

const PMRoutes: React.FC = () => {
  // Check if user is authenticated and has PM role
  // const isAuthenticated = localStorage.getItem('token') !== null;
  // const userRole = localStorage.getItem('userRole'); // 'project_manager' or 'pm'
  
  // If not authenticated or not PM, redirect to login
  // if (!isAuthenticated || userRole !== 'project_manager') {
  //   return <Navigate to="/login" replace />;
  // }

  return (
    <Routes>
      {/* Default redirect to PM dashboard */}
      <Route path="/" element={<Navigate to="/pm/dashboard" replace />} />
      
      {/* Main dashboard - this is the home page */}
      <Route path="/dashboard" element={<PMWorkspace />} />
      
      {/* Resolved Duplications */}
      <Route path="/duplications" element={<PMWorkspace />} />
      <Route path="/duplications/resolved" element={<PMWorkspace />} />
      <Route path="/duplications/:conflictId" element={<PMWorkspace />} />
      
      {/* Financial Documents */}
      <Route path="/financial" element={<PMWorkspace />} />
      <Route path="/financial/review/:reviewId" element={<PMWorkspace />} />
      <Route path="/financial/reports" element={<PMWorkspace />} />
      <Route path="/financial/approvals" element={<PMWorkspace />} />
      
      {/* Notifications */}
      <Route path="/notifications" element={<PMWorkspace />} />
      <Route path="/notifications/:notificationId" element={<PMWorkspace />} />
      <Route path="/notifications/settings" element={<PMWorkspace />} />
      
      {/* Sponsor Vetting */}
      <Route path="/vetting" element={<PMWorkspace />} />
      <Route path="/vetting/pending" element={<PMWorkspace />} />
      <Route path="/vetting/:sponsorId" element={<PMWorkspace />} />
      <Route path="/vetting/approved" element={<PMWorkspace />} />
      <Route path="/vetting/rejected" element={<PMWorkspace />} />
      
      {/* Child Registrations */}
      <Route path="/registrations" element={<PMWorkspace />} />
      <Route path="/registrations/pending" element={<PMWorkspace />} />
      <Route path="/registrations/:childId" element={<PMWorkspace />} />
      <Route path="/registrations/approved" element={<PMWorkspace />} />
      <Route path="/registrations/rejected" element={<PMWorkspace />} />
      
      {/* Document Management */}
      <Route path="/documents" element={<PMWorkspace />} />
      <Route path="/documents/pending" element={<PMWorkspace />} />
      <Route path="/documents/:documentId" element={<PMWorkspace />} />
      <Route path="/documents/approved" element={<PMWorkspace />} />
      
      {/* Audit Logs */}
      <Route path="/audit" element={<PMWorkspace />} />
      <Route path="/audit/:logId" element={<PMWorkspace />} />
      <Route path="/audit/security" element={<PMWorkspace />} />
      
      {/* Team Management */}
      <Route path="/team" element={<PMWorkspace />} />
      <Route path="/team/:agentId" element={<PMWorkspace />} />
      <Route path="/team/performance" element={<PMWorkspace />} />
      
      {/* Reports */}
      <Route path="/reports" element={<PMWorkspace />} />
      <Route path="/reports/registrations" element={<PMWorkspace />} />
      <Route path="/reports/vetting" element={<PMWorkspace />} />
      <Route path="/reports/financial" element={<PMWorkspace />} />
      <Route path="/reports/performance" element={<PMWorkspace />} />
      
      {/* Settings */}
      <Route path="/settings" element={<PMWorkspace />} />
      <Route path="/settings/general" element={<PMWorkspace />} />
      <Route path="/settings/notifications" element={<PMWorkspace />} />
      <Route path="/settings/team" element={<PMWorkspace />} />
      <Route path="/settings/security" element={<PMWorkspace />} />
      
      {/* Profile */}
      <Route path="/profile" element={<PMWorkspace />} />
      <Route path="/profile/edit" element={<PMWorkspace />} />
      <Route path="/profile/security" element={<PMWorkspace />} />
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/pm/dashboard" replace />} />
    </Routes>
  );
};

export default PMRoutes;