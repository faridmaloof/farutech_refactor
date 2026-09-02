/**
 * RegisterScreen - Componente reutilizable de registro
 * 
 * @example
 * ```tsx
 * <RegisterScreen
 *   onSubmit={async (data) => {
 *     const response = await fetch('/api/register', { ... })
 *     return response.json()
 *   }}
 *   onLogin={() => navigate('/login')}
 *   logoUrl="/logo.png"
 *   brandName="Mi Aplicación"
 * />
 * ```
 */

import { useState, FormEvent } from 'react'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { Button, Input, Checkbox, Alert } from '../components/ui'

export interface RegisterScreenProps {
  /** Callback que recibe los datos del registro y retorna Promise con el resultado */
  onSubmit: (data: { 
    name: string
    email: string
    password: string
    confirmPassword: string
    phone?: string
    company?: string
    acceptTerms: boolean
  }) => Promise<{ success: boolean; error?: string }>
  /** Callback cuando el usuario quiere iniciar sesión */
  onLogin?: () => void
  /** URL del logo de la marca */
  logoUrl?: string
  /** Nombre de la marca */
  brandName?: string
  /** Texto del botón de registro */
  submitButtonText?: string
  /** Campos adicionales requeridos */
  requirePhone?: boolean
  requireCompany?: boolean
  /** URL de términos y condiciones */
  termsUrl?: string
  /** Mensaje de éxito después del registro */
  successMessage?: string
}

/**
 * Pantalla de registro reutilizable con psicología del color aplicada
 * - Gradientes verdes para confianza y crecimiento
 * - Validación en tiempo real
 * - Diseño responsive con sidebar decorativo
 */
export function RegisterScreen({
  onSubmit,
  onLogin,
  logoUrl,
  brandName = 'Farutech',
  submitButtonText = 'Crear cuenta',
  requirePhone = false,
  requireCompany = false,
  termsUrl = '/terms',
  successMessage = '¡Cuenta creada exitosamente! Redirigiendo...',
}: RegisterScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    company: '',
    acceptTerms: false,
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateForm = () => {
    const errors: string[] = []

    if (!formData.name.trim()) errors.push('El nombre es requerido')
    if (!formData.email.trim()) {
      errors.push('El email es requerido')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push('El email no es válido')
    }
    if (!formData.password) {
      errors.push('La contraseña es requerida')
    } else if (formData.password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres')
    }
    if (formData.password !== formData.confirmPassword) {
      errors.push('Las contraseñas no coinciden')
    }
    if (requirePhone && !formData.phone.trim()) {
      errors.push('El teléfono es requerido')
    }
    if (requireCompany && !formData.company?.trim()) {
      errors.push('La empresa es requerida')
    }
    if (!formData.acceptTerms) {
      errors.push('Debes aceptar los términos y condiciones')
    }

    return errors
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '))
      return
    }

    setIsLoading(true)
    try {
      const result = await onSubmit(formData)
      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          // El padre puede manejar la redirección
        }, 2000)
      } else {
        setError(result.error || 'Error al crear la cuenta')
      }
    } catch (err) {
      setError('Error de conexión. Intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    const labels = ['Débil', 'Regular', 'Buena', 'Fuerte']
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
    
    return {
      strength,
      label: labels[strength] || 'Débil',
      color: colors[strength] || 'bg-red-500'
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen flex">
      {/* Sidebar decorativo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Elementos decorativos */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="h-16 mb-6" />
            ) : (
              <SparklesIcon className="h-16 w-16 mb-6" />
            )}
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Únete a {brandName}
          </h1>
          <p className="text-xl text-emerald-100 mb-8 max-w-md">
            Gestiona tus leads, automatiza tu marketing y haz crecer tu negocio con nuestra plataforma todo-en-uno.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-lg">Gestión de Leads avanzada</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-lg">Automatización de Marketing</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-lg">Reportes y Analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Área principal */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Header móvil */}
          <div className="lg:hidden text-center mb-8">
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="h-12 mx-auto mb-4" />
            ) : (
              <SparklesIcon className="h-12 w-12 mx-auto mb-4 text-emerald-600" />
            )}
            <h2 className="text-2xl font-bold text-gray-900">Crear cuenta en {brandName}</h2>
          </div>

          {/* Mensaje de éxito */}
          {success && (
            <Alert variant="success" title="¡Éxito!">
              {successMessage}
            </Alert>
          )}

          {/* Error general */}
          {error && (
            <Alert 
              variant="error" 
              title="Error en el registro"
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {/* Formulario */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Nombre completo */}
              <Input
                id="name"
                name="name"
                type="text"
                label="Nombre completo"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                onBlur={() => handleBlur('name')}
                placeholder="Juan Pérez"
                required
                error={touched.name && !formData.name.trim() ? 'El nombre es requerido' : undefined}
              />

              {/* Email */}
              <Input
                id="email"
                name="email"
                type="email"
                label="Correo electrónico"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                onBlur={() => handleBlur('email')}
                placeholder="juan@empresa.com"
                required
                error={
                  touched.email && !formData.email.trim() ? 'El email es requerido' :
                  touched.email && !/\S+@\S+\.\S+/.test(formData.email) ? 'El email no es válido' : undefined
                }
              />

              {/* Teléfono (opcional) */}
              {requirePhone && (
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Teléfono"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  onBlur={() => handleBlur('phone')}
                  placeholder="+57 300 123 4567"
                  required
                />
              )}

              {/* Empresa (opcional) */}
              {requireCompany && (
                <Input
                  id="company"
                  name="company"
                  type="text"
                  label="Empresa"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  onBlur={() => handleBlur('company')}
                  placeholder="Mi Empresa S.A.S."
                  required
                />
              )}

              {/* Contraseña */}
              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="Contraseña"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  onBlur={() => handleBlur('password')}
                  placeholder="••••••••"
                  required
                  error={
                    touched.password && !formData.password ? 'La contraseña es requerida' :
                    touched.password && formData.password.length < 8 ? 'Mínimo 8 caracteres' : undefined
                  }
                />
                
                {/* Indicador de fortaleza */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Fortaleza de la contraseña</span>
                      <span className={`font-medium ${
                        passwordStrength.strength <= 1 ? 'text-red-600' :
                        passwordStrength.strength === 2 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      {[0, 1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level < passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirmar contraseña */}
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                label="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="••••••••"
                required
                error={
                  touched.confirmPassword && formData.confirmPassword !== formData.password 
                    ? 'Las contraseñas no coinciden' 
                    : undefined
                }
              />
            </div>

            {/* Términos y condiciones */}
            <div className="flex items-start">
              <Checkbox
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                label="Acepto los términos y condiciones y la política de privacidad"
              />
              <div className="ml-2 text-sm">
                <a href={termsUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-500 font-medium">
                  Ver términos
                </a>
              </div>
            </div>

            {/* Botón de registro */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creando cuenta...' : submitButtonText}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={onLogin}
                className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
              >
                Iniciar sesión
              </button>
            </p>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-center text-gray-500 mt-8">
            Al registrarte, aceptas nuestros términos de servicio y política de privacidad.
            Tus datos están protegidos con encriptación de grado bancario.
          </p>
        </div>
      </div>
    </div>
  )
}
