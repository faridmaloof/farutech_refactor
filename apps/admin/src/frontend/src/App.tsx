import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { LoginScreen } from "@farutech/design-system/auth-screens";
import { MainLayout } from "@farutech/design-system/components/layout";

// Páginas Admin
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLeadsPage from "./pages/AdminLeadsPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import NewslettersPage from "./pages/NewslettersPage";

function RequireAuth() {
  const token = localStorage.getItem("admin_token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <MainLayout>
            <AdminDashboardPage />
          </MainLayout>
        } />
        <Route path="/leads" element={
          <MainLayout>
            <AdminLeadsPage />
          </MainLayout>
        } />
        <Route path="/settings" element={
          <MainLayout>
            <AdminSettingsPage />
          </MainLayout>
        } />
        <Route path="/newsletters" element={
          <MainLayout>
            <NewslettersPage />
          </MainLayout>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
