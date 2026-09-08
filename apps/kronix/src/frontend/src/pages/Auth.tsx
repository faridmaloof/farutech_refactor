import { useState } from 'react';
import { Clock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function LoginPage() {
  const { login, setPagina } = useApp();
  const [email, setEmail] = useState('demo@kronix.app');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, password);
    if (!success) setError('Credenciales incorrectas');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <button onClick={() => setPagina('landing')} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </button>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-display text-gradient">Kronix</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Bienvenido de vuelta</h1>
            <p className="text-gray-500 mt-1">Inicia sesión en tu cuenta</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 gradient-brand text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md"
            >
              Iniciar Sesión
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <button onClick={() => setPagina('register')} className="text-indigo-600 font-semibold hover:underline">
                Regístrate gratis
              </button>
            </p>
          </div>
          <div className="mt-6 p-4 bg-indigo-50 rounded-xl">
            <p className="text-xs text-indigo-700 font-medium mb-1">🔑 Credenciales demo:</p>
            <p className="text-xs text-indigo-600">Email: demo@kronix.app</p>
            <p className="text-xs text-indigo-600">Contraseña: demo123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { register, setPagina } = useApp();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [slug, setSlug] = useState('');
  const [negocio, setNegocio] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.match(/^[a-z0-9-]+$/)) {
      setError('El slug solo puede contener letras minúsculas, números y guiones');
      return;
    }
    register(nombre, email, password, slug, negocio);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <button onClick={() => setPagina('landing')} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </button>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-display text-gradient">Kronix</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Crea tu cuenta</h1>
            <p className="text-gray-500 mt-1">Comienza a gestionar tus reservas en minutos</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Tu nombre"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del negocio</label>
              <input
                type="text"
                value={negocio}
                onChange={e => setNegocio(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Mi Negocio"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tu URL pública</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="pl-4 text-gray-400 text-sm bg-gray-50 py-3 border-r border-gray-200">kronix.app/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s/g, '-'))}
                  className="flex-1 px-4 py-3 outline-none"
                  placeholder="tu-negocio"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 gradient-brand text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md"
            >
              Crear mi cuenta gratis
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => setPagina('login')} className="text-indigo-600 font-semibold hover:underline">
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
