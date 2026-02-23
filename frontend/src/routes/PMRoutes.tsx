// ============== PMRoutes.tsx ==============
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PMWorkspace from '../PMWorkspace/PMWorkspace';

const PMRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Default redirect to PM dashboard */}
      <Route path="/" element={<Navigate to="/pm/dashboard" replace />} />
      
      {/* Main dashboard */}
      <Route path="/dashboard" element={<PMWorkspace />} />
      
      {/* Resolution Queue - renders inside PMWorkspace's main content area */}
      <Route path="/duplications" element={<PMWorkspace />} />
      <Route path="/duplications/:conflictId" element={<PMWorkspace />} />
      <Route path="/duplications/resolved" element={<PMWorkspace />} />
      
       <Route path="/financial" element={<PMWorkspace />} />
      <Route path="/financial/review/:reviewId" element={<PMWorkspace />} />
      
        <Route path="/notifications" element={<PMWorkspace />} />
      <Route path="/notifications/:notificationId" element={<PMWorkspace />} />
      
      {/* Settings */}
      <Route path="/settings" element={<PMWorkspace />} />
      <Route path="/settings/general" element={<PMWorkspace />} />
      
      {/* Profile */}
      <Route path="/profile" element={<PMWorkspace />} />
      <Route path="/profile/edit" element={<PMWorkspace />} />
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/pm/dashboard" replace />} />
    </Routes>
  );
};

export default PMRoutes;