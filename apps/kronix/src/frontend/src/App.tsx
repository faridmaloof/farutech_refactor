import { AppProvider, useApp } from './context/AppContext';
import Landing from './pages/Landing';
import { LoginPage, RegisterPage } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import PublicBooking from './pages/PublicBooking';

function AppContent() {
  const { pagina, isAuthenticated } = useApp();

  switch (pagina) {
    case 'landing':
      return <Landing />;
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'dashboard':
    case 'servicios':
    case 'asesores':
    case 'reservas':
    case 'calendario':
    case 'configuracion':
      return isAuthenticated ? <Dashboard /> : <LoginPage />;
    case 'public-booking':
      return <PublicBooking />;
    default:
      return <Landing />;
  }
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
