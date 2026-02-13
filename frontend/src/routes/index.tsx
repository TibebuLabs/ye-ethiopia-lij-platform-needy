// ==================== routes/index.tsx ====================
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import HomePage from "../pages/public/Home/Home";
import LoginPage from "../pages/public/Auth/Login/Login";
import RegisterPage from "../pages/public/Auth/Register/Register";
import SponsorDashboard from "../sponsor/Dashboard/SponsorDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/sponsor-dashboard",
    element: <SponsorDashboard />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};