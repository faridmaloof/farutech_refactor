import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LoginScreen } from "@farutech/design-system/auth-screens";
import { MainLayout } from "@farutech/design-system/components/layout";

// Páginas Admin (pendientes de migrar al Design System)
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
      <Route path="/admin/login" element={<LoginScreen />} />
      <Route element={<RequireAuth />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={
          <MainLayout>
            <AdminDashboardPage />
          </MainLayout>
        } />
        <Route path="/admin/leads" element={
          <MainLayout>
            <AdminLeadsPage />
          </MainLayout>
        } />
        <Route path="/admin/settings" element={
          <MainLayout>
            <AdminSettingsPage />
          </MainLayout>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
