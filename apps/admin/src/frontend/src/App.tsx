import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLeadsPage from "./pages/AdminLeadsPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";

function RequireAuth() {
  const token = localStorage.getItem("admin_token");
  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/leads" element={<AdminLeadsPage />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
