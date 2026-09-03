import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function RequireAuth() {
  const token = localStorage.getItem("intranet_token");
  return token ? <Outlet /> : <Navigate to="/intranet/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/intranet/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/intranet" element={<Navigate to="/intranet/dashboard" replace />} />
        <Route path="/intranet/dashboard" element={<DashboardPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/intranet" replace />} />
    </Routes>
  );
}
