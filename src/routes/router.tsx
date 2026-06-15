import { createBrowserRouter, Navigate } from "react-router-dom";

import LoginPage from "../pages/login";
import DashboardPage from "../pages/dashboard";
import EmployeePage from "../pages/employee";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employees",
    element: (
      <ProtectedRoute>
        <EmployeePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);