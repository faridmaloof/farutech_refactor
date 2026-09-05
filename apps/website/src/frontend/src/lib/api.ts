/**
 * Punto de entrada único al backend.
 *
 * El backend se sirve en su propio dominio (api.farutech.local) y las rutas
 * NO llevan prefijo /api (el dominio ya implica API). Configurable por ambiente
 * vía VITE_API_URL (se inyecta en el build desde docker compose).
 */
export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) || '';

/** Endpoint base para los formularios del sitio (contacto / newsletter). */
export const API_PUBLIC_BASE: string = API_BASE_URL;