import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import BrowseChildren from './pages/BrowseChildren'
import ChildDetail from './pages/ChildDetail'
import ChildrenList from './pages/ChildrenList'
import RegisterChild from './pages/RegisterChild'
import MySponsorships from './pages/MySponsorships'
import AcademicReports from './pages/AcademicReports'
import Interventions from './pages/Interventions'
import Notifications from './pages/Notifications'
import Organizations from './pages/Organizations'
import OrgReports from './pages/OrgReports'
import MyOrganization from './pages/MyOrganization'
import Users from './pages/Users'
import Profile from './pages/Profile'
import DuplicationAlerts from './pages/DuplicationAlerts'
import Enrollments from './pages/Enrollments'
import UpdateAcademicStatus from './pages/UpdateAcademicStatus'
import AcademicPerformanceReport from './pages/AcademicPerformanceReport'
import SchoolProfile from './pages/SchoolProfile'
import GovernmentReports from './pages/GovernmentReports'
import Schools from './pages/Schools'
import SponsorshipVerification from './pages/SponsorshipVerification'
import FinancialDocuments from './pages/FinancialDocuments'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import PMRegistrations from './pages/PMRegistrations'

// Inner component so we can access useAuth inside AuthProvider
function AppRoutes() {
  const { user } = useAuth()
  return (
    <NotificationProvider enabled={!!user}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/browse" element={<BrowseChildren />} />
          <Route path="/children" element={<ChildrenList />} />
          <Route path="/children/register" element={<RegisterChild />} />
          <Route path="/children/:id" element={<ChildDetail />} />
          <Route path="/my-sponsorships" element={<MySponsorships />} />
          <Route path="/academic-reports" element={<AcademicReports />} />
          <Route path="/interventions" element={<Interventions />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/org-reports" element={<OrgReports />} />
          <Route path="/my-organization" element={<MyOrganization />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<OrgReports />} />
          <Route path="/duplication-alerts" element={<DuplicationAlerts />} />
          <Route path="/enrollments" element={<Enrollments />} />
          <Route path="/academic-status" element={<UpdateAcademicStatus />} />
          <Route path="/performance-report" element={<AcademicPerformanceReport />} />
          <Route path="/school-profile" element={<SchoolProfile />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/gov-reports" element={<GovernmentReports />} />
          <Route path="/sponsorship-verification" element={<SponsorshipVerification />} />
          <Route path="/financial-documents" element={<FinancialDocuments />} />
          <Route path="/registrations" element={<PMRegistrations />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NotificationProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontFamily: 'Poppins, sans-serif', fontSize: '14px' },
        }}
      />
      <AppRoutes />
    </AuthProvider>
  )
}
