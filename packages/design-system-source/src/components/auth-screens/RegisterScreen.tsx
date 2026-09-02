import React, { useState } from 'react';

export interface RegisterScreenProps {
  onSubmit: (data: RegisterFormData) => void | Promise<void>;
  onLoginClick?: () => void;
  logoUrl?: string;
  brandName?: string;
  termsUrl?: string;
  privacyUrl?: string;
  className?: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

/**
 * RegisterScreen - Pantalla de registro reutilizable
 * 
 * Características:
 * - Psicología del color aplicada (gradientes verdes para confianza y crecimiento)
 * - Validación en tiempo real
 * - Diseño responsive con sidebar decorativo
 * - Totalmente configurable vía props
 * - Sin backend embebido (recibe callbacks)
 */
export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onSubmit,
  onLoginClick,
  logoUrl,
  brandName = 'Farutech',
  termsUrl = '#',
  privacyUrl = '#',
  className = '',
}) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Limpiar error al empezar a escribir
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className={`register-screen ${className}`}>
      <style>{`
        .register-screen {
          min-height: 100vh;
          display: flex;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .register-screen__sidebar {
          flex: 1;
          background: linear-gradient(135deg, var(--color-primary-600, #10b981) 0%, var(--color-primary-800, #059669) 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .register-screen__sidebar::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: pulse 15s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.1) rotate(5deg); }
        }

        .register-screen__sidebar-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .register-screen__sidebar-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .register-screen__sidebar-text {
          font-size: 1.125rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .register-screen__form-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: white;
        }

        .register-screen__form-wrapper {
          width: 100%;
          max-width: 450px;
        }

        .register-screen__header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .register-screen__logo {
          width: 60px;
          height: 60px;
          margin-bottom: 1rem;
          object-fit: contain;
        }

        .register-screen__title {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--color-gray-900, #111827);
          margin-bottom: 0.5rem;
        }

        .register-screen__subtitle {
          color: var(--color-gray-600, #4b5563);
          font-size: 0.95rem;
        }

        .register-screen__form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .register-screen__field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .register-screen__label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-gray-700, #374151);
        }

        .register-screen__input {
          padding: 0.75rem 1rem;
          border: 2px solid var(--color-gray-200, #e5e7eb);
          border-radius: var(--radius-md, 0.375rem);
          font-size: 1rem;
          transition: all 0.2s ease;
          outline: none;
        }

        .register-screen__input:focus {
          border-color: var(--color-primary-500, #10b981);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .register-screen__input--error {
          border-color: var(--color-error, #ef4444);
        }

        .register-screen__error {
          color: var(--color-error, #ef4444);
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .register-screen__checkbox-field {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .register-screen__checkbox {
          margin-top: 0.25rem;
          width: 1rem;
          height: 1rem;
          accent-color: var(--color-primary-600, #10b981);
        }

        .register-screen__checkbox-label {
          font-size: 0.875rem;
          color: var(--color-gray-600, #4b5563);
          line-height: 1.4;
        }

        .register-screen__checkbox-label a {
          color: var(--color-primary-600, #10b981);
          text-decoration: none;
          font-weight: 600;
        }

        .register-screen__checkbox-label a:hover {
          text-decoration: underline;
        }

        .register-screen__submit {
          padding: 0.875rem 1.5rem;
          background: linear-gradient(135deg, var(--color-primary-600, #10b981) 0%, var(--color-primary-700, #059669) 100%);
          color: white;
          border: none;
          border-radius: var(--radius-md, 0.375rem);
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.3);
        }

        .register-screen__submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 8px -1px rgba(16, 185, 129, 0.4);
        }

        .register-screen__submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .register-screen__login {
          text-align: center;
          margin-top: 1.5rem;
          color: var(--color-gray-600, #4b5563);
          font-size: 0.95rem;
        }

        .register-screen__login a {
          color: var(--color-primary-600, #10b981);
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
        }

        .register-screen__login a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .register-screen__sidebar {
            display: none;
          }
        }
      `}</style>

      {/* Sidebar decorativo */}
      <div className="register-screen__sidebar">
        <div className="register-screen__sidebar-content">
          <h2 className="register-screen__sidebar-title">Únete a Farutech</h2>
          <p className="register-screen__sidebar-text">
            Accede a herramientas poderosas para gestionar tu negocio,<br />
            leads y oportunidades en un solo lugar.
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="register-screen__form-container">
        <div className="register-screen__form-wrapper">
          <div className="register-screen__header">
            {logoUrl && (
              <img src={logoUrl} alt={brandName} className="register-screen__logo" />
            )}
            <h1 className="register-screen__title">Crear cuenta</h1>
            <p className="register-screen__subtitle">
              Completa el formulario para registrarte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="register-screen__form">
            {/* Nombre */}
            <div className="register-screen__field">
              <label htmlFor="name" className="register-screen__label">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`register-screen__input ${errors.name ? 'register-screen__input--error' : ''}`}
                placeholder="Juan Pérez"
                autoComplete="name"
              />
              {errors.name && (
                <span className="register-screen__error">{errors.name}</span>
              )}
            </div>

            {/* Email */}
            <div className="register-screen__field">
              <label htmlFor="email" className="register-screen__label">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`register-screen__input ${errors.email ? 'register-screen__input--error' : ''}`}
                placeholder="juan@empresa.com"
                autoComplete="email"
              />
              {errors.email && (
                <span className="register-screen__error">{errors.email}</span>
              )}
            </div>

            {/* Contraseña */}
            <div className="register-screen__field">
              <label htmlFor="password" className="register-screen__label">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`register-screen__input ${errors.password ? 'register-screen__input--error' : ''}`}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />
              {errors.password && (
                <span className="register-screen__error">{errors.password}</span>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div className="register-screen__field">
              <label htmlFor="confirmPassword" className="register-screen__label">
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`register-screen__input ${errors.confirmPassword ? 'register-screen__input--error' : ''}`}
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <span className="register-screen__error">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Términos y condiciones */}
            <div className="register-screen__checkbox-field">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="register-screen__checkbox"
              />
              <label htmlFor="acceptTerms" className="register-screen__checkbox-label">
                Acepto los{' '}
                <a href={termsUrl} target="_blank" rel="noopener noreferrer">
                  términos y condiciones
                </a>{' '}
                y la{' '}
                <a href={privacyUrl} target="_blank" rel="noopener noreferrer">
                  política de privacidad
                </a>
              </label>
            </div>
            {errors.acceptTerms && (
              <span className="register-screen__error">{errors.acceptTerms}</span>
            )}

            {/* Botón submit */}
            <button
              type="submit"
              className="register-screen__submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          {/* Link a login */}
          {onLoginClick && (
            <div className="register-screen__login">
              ¿Ya tienes una cuenta?{' '}
              <span onClick={onLoginClick}>Iniciar sesión</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
