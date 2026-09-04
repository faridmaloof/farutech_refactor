import { useState, useEffect, FormEvent } from 'react';
import { API_BASE_URL } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  is_active: boolean;
  email_verified_at: string | null;
  last_login_at: string | null;
}

interface Settings {
  registration_enabled: boolean;
  allowed_domains: string | null;
  require_email_confirmation: boolean;
  session_ttl_hours: number;
  max_login_attempts: number;
}

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
  'Content-Type': 'application/json',
});

export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'viewer' });

  useEffect(() => {
    const load = async () => {
      try {
        const [sRes, uRes] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/settings`, { headers: authHeaders() }),
          fetch(`${API_BASE_URL}/admin/users`, { headers: authHeaders() }),
        ]);
        if (sRes.status === 401 || uRes.status === 401) {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('auth_user');
          navigate('/admin/login', { replace: true });
          return;
        }
        if (!sRes.ok || !uRes.ok) throw new Error('Error al cargar configuraciÃ³n');
        setSettings((await sRes.json()).data);
        setUsers((await uRes.json()).data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de conexiÃ³n');
      }
    };
    load();
  }, [navigate]);

  const saveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.status === 401) { navigate('/admin/login', { replace: true }); return; }
      if (!res.ok) throw new Error(data.message || 'Error al guardar');
      setSettings(data.data);
      setMessage('ConfiguraciÃ³n guardada');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexiÃ³n');
    }
  };

  const createUser = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(''); setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al crear usuario');
      setUsers((prev) => [...prev, data.data]);
      setNewUser({ name: '', email: '', password: '', role: 'viewer' });
      setMessage('Usuario creado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexiÃ³n');
    }
  };

  const toggleActive = async (u: UserRow) => {
    try {
      const res = await fetch(`/api/admin/users/${u.id}/status`, {
        method: 'PATCH', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error');
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, is_active: data.data.is_active } : x)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexiÃ³n');
    }
  };

  if (!settings) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ConfiguraciÃ³n</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">ParÃ¡metros generales y gestiÃ³n de usuarios</p>
        </div>

        {(message || error) && (
          <div className={`rounded-md p-4 text-sm ${error ? 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200' : 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200'}`}>
            {error || message}
          </div>
        )}

        {/* ParÃ¡metros generales */}
        <form onSubmit={saveSettings} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">ParÃ¡metros generales</h2>

          <label className="flex items-center gap-3">
            <input type="checkbox" checked={settings.registration_enabled}
              onChange={(e) => setSettings({ ...settings, registration_enabled: e.target.checked })}
              className="h-4 w-4" />
            <span className="text-gray-900 dark:text-white">Permitir crear nuevos usuarios (registro)</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" checked={settings.require_email_confirmation}
              onChange={(e) => setSettings({ ...settings, require_email_confirmation: e.target.checked })}
              className="h-4 w-4" />
            <span className="text-gray-900 dark:text-white">Exigir confirmaciÃ³n de correo antes del login</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Dominios de correo permitidos (separados por coma; vacÃ­o = todos)
            </label>
            <input type="text" value={settings.allowed_domains ?? ''}
              onChange={(e) => setSettings({ ...settings, allowed_domains: e.target.value })}
              placeholder="farutech.com, gmail.com"
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">TTL de sesiÃ³n (horas)</label>
              <input type="number" min={1} max={168} value={settings.session_ttl_hours}
                onChange={(e) => setSettings({ ...settings, session_ttl_hours: Number(e.target.value) })}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Intentos de login permitidos</label>
              <input type="number" min={3} max={20} value={settings.max_login_attempts}
                onChange={(e) => setSettings({ ...settings, max_login_attempts: Number(e.target.value) })}
                className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            </div>
          </div>

          <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">
            Guardar configuraciÃ³n
          </button>
        </form>


        {/* Alta de usuario (condicionada por registration_enabled) */}
        <form onSubmit={createUser} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Crear usuario</h2>
          {!settings.registration_enabled && (
            <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-3 text-sm text-yellow-800 dark:text-yellow-200">
              La creaciÃ³n de usuarios estÃ¡ deshabilitada en parÃ¡metros generales.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required placeholder="Nombre" value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              disabled={!settings.registration_enabled}
              className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            <input required type="email" placeholder="Correo" value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              disabled={!settings.registration_enabled}
              className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            <input required type="password" minLength={8} placeholder="ContraseÃ±a (mÃ­n. 8)" value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              disabled={!settings.registration_enabled}
              className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white" />
            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              disabled={!settings.registration_enabled}
              className="rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              <option value="viewer">viewer</option>
              <option value="editor">editor</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <button type="submit" disabled={!settings.registration_enabled}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Crear usuario
          </button>
        </form>

        {/* Listado de usuarios */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Nombre</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Rol</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Verificado</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Activo</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{u.id}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.role}</td>
                  <td className="px-4 py-3">{u.email_verified_at ? 'âœ…' : 'â€”'}</td>
                  <td className="px-4 py-3">{u.is_active ? 'âœ…' : 'ðŸš«'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(u)} type="button"
                      className="text-sm px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                      {u.is_active ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <a href="/admin/dashboard" className="inline-block text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
          â† Volver al dashboard
        </a>
      </div>
    </div>
  );
}

