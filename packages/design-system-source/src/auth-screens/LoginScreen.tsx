/**
 * LoginScreen - Componente reutilizable de autenticación
 * 
 * @example
 * ```tsx
 * <LoginScreen
 *   onSubmit={async (credentials) => {
 *     const response = await fetch('/api/login', { ... })
 *     return response.json()
 *   }}
 *   onForgotPassword={() => navigate('/forgot-password')}
 *   onRegister={() => navigate('/register')}
 *   logoUrl="/logo.png"
 *   brandName="Mi Aplicación"
 * />
 * ```
 */

import { useState, FormEvent } from 'react'
import { UserIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { Button, Input, Checkbox, Alert } from '../ui'

export interface LoginScreenProps {
  /** Callback que recibe email/password y retorna Promise con el resultado del login */
  onSubmit: (credentials: { email: string; password: string; remember: boolean }) => Promise<{ success: boolean; error?: string }>
  /** Callback cuando el usuario hace clic en "Olvidé mi contraseña" */
  onForgotPassword?: () => void
  /** Callback cuando el usuario quiere registrarse */
  onRegister?: () => void
  /** URL del logo de la marca */
  logoUrl?: string
  /** Nombre de la marca */
  brandName?: string
  /** Descripción opcional debajo del nombre de la marca */
  description?: string
  /** Texto personalizado para el checkbox de recordar */
  rememberLabel?: string
  /** Si debe mostrar la opción de registrarse */
  showRegister?: boolean
  /** Loading state externo (opcional, si no se usa el interno del componente) */
  isLoading?: boolean
}

export function LoginScreen({
  onSubmit,
  onForgotPassword,
  onRegister,
  logoUrl = '/logo.png',
  brandName = 'Admin Panel',
  description = 'Ingresa tus credenciales para continuar',
  rememberLabel = 'Recordarme',
  showRegister = false,
  isLoading: externalIsLoading,
}: LoginScreenProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSubmittingValue = externalIsLoading ?? isSubmitting

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const result = await onSubmit({
        email: formData.email,
        password: formData.password,
        remember: formData.remember,
      })

      if (!result.success && result.error) {
        setError(result.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Logo and branding */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-600/30 ring-4 ring-primary-200 dark:ring-primary-900/50 transform group-hover:scale-105 transition-all duration-300">
                  <img
                    src={logoUrl}
                    alt={`${brandName} Logo`}
                    className="w-14 h-14 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/logo.png'
                    }}
                  />
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
              {brandName}
            </h1>
            <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-1 flex items-center justify-center gap-2">
              <SparklesIcon className="h-5 w-5" />
              Acceso
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              {description}
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Error alert */}
            {error && (
              <Alert variant="error" title="Error de autenticación">
                {error}
              </Alert>
            )}

            <div className="space-y-4">
              {/* Email input */}
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                label="Correo electrónico"
                placeholder="tu@email.com"
                icon={<UserIcon className="h-5 w-5" />}
                iconPosition="left"
              />

              {/* Password input */}
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                label="Contraseña"
                placeholder="••••••••"
                showPasswordToggle={true}
              />
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  label={rememberLabel}
                />
              </div>

              {onForgotPassword && (
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isSubmittingValue}
              fullWidth
              size="lg"
              className="group"
            >
              {isSubmittingValue ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Iniciar sesión
                  <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              )}
            </Button>

            {/* Register link */}
            {showRegister && onRegister && (
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ¿No tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={onRegister}
                    className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors duration-200"
                  >
                    Regístrate aquí
                  </button>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Right side - Decorative gradient (hidden on mobile) */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="max-w-md text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Bienvenido de nuevo</h2>
            <p className="text-primary-100 text-lg">
              Accede a tu panel de administración para gestionar todos los aspectos de tu aplicación
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
