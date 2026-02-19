import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SponsorRoutes from './routes/SponsorRoutes';
import LoginPage from './pages/public/Auth/Login/Login';
import RegisterPage from './pages/public/Auth/Register/Register';
import HomePage from './pages/public/Home/Home';
import AdminRoutes from './routes/AdminRoutes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Sponsor Routes */}
        <Route path="/sponsor/*" element={<SponsorRoutes />} />
         <Route path="/admin/*" element={<AdminRoutes />} />
        
        {/* Redirect root to login (or you can keep it as sponsor dashboard) */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;