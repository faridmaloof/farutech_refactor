/**
 * Punto de entrada único al backend para Admin Panel.
 *
 * El backend se sirve en su propio dominio (api.farutech.local) y las rutas
 * NO llevan prefijo /api (el dominio ya implica API). Configurable por ambiente
 * vía VITE_API_URL (se inyecta en el build desde docker compose).
 */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) || 'http://api.farutech.local';

/**
 * Helper para hacer requests con autenticación Sanctum.
 * Agrega automáticamente el token desde localStorage y maneja errores 401.
 */
interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> {
  const { requiresAuth = true, headers = {}, ...restConfig } = config;
  
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (requiresAuth) {
    const token = localStorage.getItem('admin_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...restConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  });

  // Manejar 401 - Token inválido o expirado
  if (response.status === 401 && requiresAuth) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
    throw new Error('Sesión expirada. Redirigiendo al login...');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
  }

  return data;
}

// Métodos helper para operaciones comunes
export const api = {
  get: <T>(endpoint: string, requiresAuth = true) => 
    apiRequest<T>(endpoint, { method: 'GET', requiresAuth }),
  
  post: <T>(endpoint: string, body: unknown, requiresAuth = true) => 
    apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(body), requiresAuth }),
  
  put: <T>(endpoint: string, body: unknown, requiresAuth = true) => 
    apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), requiresAuth }),
  
  delete: <T>(endpoint: string, requiresAuth = true) => 
    apiRequest<T>(endpoint, { method: 'DELETE', requiresAuth }),
};
