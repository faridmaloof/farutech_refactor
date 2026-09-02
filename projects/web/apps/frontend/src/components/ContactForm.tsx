import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../lib/api';
import { services } from '../content/servicesData';

// Types
interface FormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  service_interest: string;
  budget_range?: string;
  project_timeline?: string;
  message: string;
  privacy_accepted: boolean;
  website_url?: string; // Honeypot field
}

interface FormErrors {
  [key: string]: string;
}

interface SubmissionResult {
  success: boolean;
  lead_id?: number;
  lead_score?: number;
  lead_quality?: string;
  message?: string;
  errors?: FormErrors;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    service_interest: '',
    budget_range: '',
    project_timeline: '',
    message: '',
    privacy_accepted: false,
    website_url: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmissionResult | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Single source of truth for services derived from servicesData.ts
  const serviceOptions = [
    ...services.map((s) => ({
      value: s.slug,
      label: s.name.es,
    })),
    { value: 'otro', label: 'Otro' },
  ];

  const budgetOptions = [
    { value: 'less_than_1000', label: 'Menos de $1,000 USD' },
    { value: '1000-2500', label: '$1,000 - $2,500 USD' },
    { value: '2500-5000', label: '$2,500 - $5,000 USD' },
    { value: '5000-10000', label: '$5,000 - $10,000 USD' },
    { value: '10000+', label: 'Más de $10,000 USD' }
  ];

  const timelineOptions = [
    { value: 'immediate', label: 'Inmediato (menos de 1 mes)' },
    { value: '1-3_months', label: '1-3 meses' },
    { value: '3-6_months', label: '3-6 meses' },
    { value: '6+_months', label: 'Más de 6 meses' },
    { value: 'just_exploring', label: 'Solo estoy explorando opciones' }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
      if (!formData.email.trim()) {
        newErrors.email = 'El email es requerido';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      }
      if (!formData.service_interest) newErrors.service_interest = 'Selecciona un servicio de interés';
    }

    if (step === 2) {
      if (!formData.message.trim()) {
        newErrors.message = 'El mensaje es requerido';
      } else if (formData.message.trim().length < 10) {
        newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
      }
    }

    if (step === 3) {
      if (!formData.privacy_accepted) {
        newErrors.privacy_accepted = 'Debe aceptar la política de tratamiento de datos personales para continuar';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitResult(result);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          position: '',
          service_interest: '',
          budget_range: '',
          project_timeline: '',
          message: '',
          privacy_accepted: false,
          website_url: ''
        });
        setCurrentStep(1);
      } else {
        setSubmitResult({
          success: false,
          errors: result.errors || { general: result.message || 'Error al enviar el formulario' }
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        errors: { general: 'Error de conexión. Por favor intenta nuevamente.' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({ ...prev, [name]: val }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const inputClassName = (fieldName: string) =>
    `w-full px-4 py-3 rounded-lg border ${
      errors[fieldName]
        ? 'border-red-500 focus:border-red-600 focus:ring-red-500'
        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
    } bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors focus:outline-none focus:ring-2`;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              step <= currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}
          >
            {step < currentStep ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              step
            )}
          </div>
          {step < totalSteps && (
            <div
              className={`w-16 h-1 mx-2 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <>
      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        Información de Contacto
      </h3>
      
      <div className="space-y-4">
        {/* Honeypot field - hidden from humans */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            name="website_url"
            value={formData.website_url || ''}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Nombre Completo *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClassName('name')}
            placeholder="Juan Pérez"
            disabled={isSubmitting}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Email Corporativo *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClassName('email')}
            placeholder="juan@empresa.com"
            disabled={isSubmitting}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Teléfono (Opcional)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={inputClassName('phone')}
              placeholder="+57 300 123 4567"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Cargo (Opcional)
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className={inputClassName('position')}
              placeholder="CEO, CTO, Manager..."
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Empresa (Opcional)
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={inputClassName('company')}
            placeholder="Nombre de tu empresa"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="service_interest" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Servicio de Interés *
          </label>
          <select
            id="service_interest"
            name="service_interest"
            value={formData.service_interest}
            onChange={handleChange}
            className={inputClassName('service_interest')}
            disabled={isSubmitting}
          >
            <option value="">Selecciona un servicio</option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.service_interest && (
            <p className="mt-1 text-sm text-red-600">{errors.service_interest}</p>
          )}
        </div>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        Detalles del Proyecto
      </h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="budget_range" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Rango de Presupuesto (Opcional)
          </label>
          <select
            id="budget_range"
            name="budget_range"
            value={formData.budget_range}
            onChange={handleChange}
            className={inputClassName('budget_range')}
            disabled={isSubmitting}
          >
            <option value="">Selecciona un rango</option>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="project_timeline" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Timeline del Proyecto (Opcional)
          </label>
          <select
            id="project_timeline"
            name="project_timeline"
            value={formData.project_timeline}
            onChange={handleChange}
            className={inputClassName('project_timeline')}
            disabled={isSubmitting}
          >
            <option value="">Selecciona un timeline</option>
            {timelineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Cuéntanos sobre tu proyecto *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className={inputClassName('message')}
            placeholder="Describe brevemente tu proyecto, objetivos y cualquier detalle relevante..."
            disabled={isSubmitting}
          />
          {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
          <p className="mt-1 text-sm text-gray-500">
            {formData.message.length} caracteres (mínimo 10)
          </p>
        </div>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        Revisión, Consentimiento y Envío
      </h3>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Información de Contacto</h4>
          <dl className="grid grid-cols-1 gap-2 text-sm">
            <div>
              <dt className="text-gray-500">Nombre:</dt>
              <dd className="text-gray-900 dark:text-white font-medium">{formData.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Email:</dt>
              <dd className="text-gray-900 dark:text-white font-medium">{formData.email}</dd>
            </div>
            {formData.phone && (
              <div>
                <dt className="text-gray-500">Teléfono:</dt>
                <dd className="text-gray-900 dark:text-white">{formData.phone}</dd>
              </div>
            )}
            {formData.company && (
              <div>
                <dt className="text-gray-500">Empresa:</dt>
                <dd className="text-gray-900 dark:text-white">{formData.company}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Detalles del Proyecto</h4>
          <dl className="grid grid-cols-1 gap-2 text-sm">
            <div>
              <dt className="text-gray-500">Servicio de Interés:</dt>
              <dd className="text-gray-900 dark:text-white font-medium">
                {serviceOptions.find((opt) => opt.value === formData.service_interest)?.label || formData.service_interest}
              </dd>
            </div>
            {formData.budget_range && (
              <div>
                <dt className="text-gray-500">Presupuesto:</dt>
                <dd className="text-gray-900 dark:text-white">
                  {budgetOptions.find((opt) => opt.value === formData.budget_range)?.label}
                </dd>
              </div>
            )}
            {formData.project_timeline && (
              <div>
                <dt className="text-gray-500">Timeline:</dt>
                <dd className="text-gray-900 dark:text-white">
                  {timelineOptions.find((opt) => opt.value === formData.project_timeline)?.label}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Mensaje</h4>
          <p className="text-gray-900 dark:text-white text-sm whitespace-pre-wrap">
            {formData.message}
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="privacy_accepted"
            name="privacy_accepted"
            checked={formData.privacy_accepted}
            onChange={handleChange}
            className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            disabled={isSubmitting}
          />
          <label htmlFor="privacy_accepted" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            Acepto la <span className="font-semibold text-blue-600 dark:text-blue-400">política de tratamiento de datos personales</span> y autorizo a FaruTech a utilizar mis datos para responder a esta solicitud de contacto. *
          </label>
        </div>
        {errors.privacy_accepted && (
          <p className="mt-1 text-sm text-red-600 font-medium">{errors.privacy_accepted}</p>
        )}
      </div>
    </>
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {submitResult ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-2xl p-8 ${
              submitResult.success
                ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800'
            }`}
          >
            {submitResult.success ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
                  ¡Gracias por contactarnos!
                </h3>
                <p className="text-green-700 dark:text-green-400 mb-4">
                  {submitResult.message || 'Hemos recibido tu información. Nuestro equipo se pondrá en contacto contigo pronto.'}
                </p>
                <button
                  onClick={() => setSubmitResult(null)}
                  className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600 dark:text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">
                  Error al enviar el mensaje
                </h3>
                <div className="text-red-700 dark:text-red-400 mb-4">
                  {Object.entries(submitResult.errors || {}).map(([key, value]) => (
                    <p key={key} className="mb-1">
                      {value}
                    </p>
                  ))}
                </div>
                <button
                  onClick={() => setSubmitResult(null)}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Intentar nuevamente
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
          >
            {renderStepIndicator()}

            <div className="min-h-[400px]">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  ← Atrás
                </button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Continuar →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Mensaje
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
