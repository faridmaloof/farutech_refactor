import { useState, useEffect, FormEvent } from 'react';
import { API_BASE_URL } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';


interface Policy {
  registration_enabled: boolean;
  require_email_confirmation: boolean;
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [policy, setPolicy] = useState<Policy | null>(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    fetch(`${API_BASE_URL}/settings/public`)
      .then((r) => r.json())
      .then(setPolicy)
      .catch(() => setPolicy({ registration_enabled: false, require_email_confirmation: false }));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Error en el registro');

        setMode('login');
        setInfo(
          data.requires_confirmation
            ? 'Cuenta creada. Revisa tu correo para confirmarla antes de iniciar sesiÃ³n.'
            : 'Cuenta creada correctamente. Ya puedes iniciar sesiÃ³n.',
        );
        return;
      }

      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error en autenticaciÃ³n');
      }

      // Guardar token y usuario
      localStorage.setItem('admin_token', data.token);

      // Redirigir al dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexiÃ³n');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Panel de AdministraciÃ³n
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {mode === 'login'
              ? 'Ingresa tus credenciales para continuar'
              : 'Crea una nueva cuenta'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="text-sm text-red-800 dark:text-red-200">{error}</div>
            </div>
          )}
          {info && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
              <div className="text-sm text-green-800 dark:text-green-200">{info}</div>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            {mode === 'register' && (
              <div>
                <label htmlFor="name" className="sr-only">Nombre</label>
                <input id="name" name="name" type="text" required value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Nombre completo" />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="sr-only">Correo electrÃ³nico</label>
              <input id="email-address" name="email" type="email" autoComplete="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  mode === 'login' ? 'rounded-t-md' : ''
                }`}
                placeholder="Correo electrÃ³nico" />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">ContraseÃ±a</label>
              <input id="password" name="password" type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={mode === 'register' ? 8 : undefined}
                required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-800 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder={mode === 'login' ? 'ContraseÃ±a' : 'ContraseÃ±a (mÃ­nimo 8 caracteres)'} />
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Procesando...' : mode === 'login' ? 'Iniciar SesiÃ³n' : 'Crear Cuenta'}
            </button>
          </div>

          {policy?.registration_enabled && (
            <div className="text-center">
              <button type="button"
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setInfo(''); }}
                className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                {mode === 'login' ? 'Â¿No tienes cuenta? RegÃ­strate' : 'Ya tengo cuenta. Iniciar sesiÃ³n'}
              </button>
            </div>
          )}

          <div className="text-center">
            <Link to="/" className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Volver al sitio principal
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

