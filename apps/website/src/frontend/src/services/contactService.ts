/**
 * Contact API Service
 * Handles all communication with the contact endpoint
 */

import { API_BASE_URL } from '../lib/api';

const REQUEST_TIMEOUT = 15000; // 15 seconds

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  service_interest: string;
  budget_range?: string;
  project_timeline?: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  lead_id?: number;
  lead_score?: number;
  lead_quality?: string;
  message?: string;
  errors?: Record<string, string>;
}

export interface ContactFormErrors {
  [key: string]: string;
}

/**
 * Creates an AbortController with timeout
 */
function createTimeoutController(timeoutMs: number): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
}

/**
 * Validates contact form data on client side
 * This is for UX only - backend validation is authoritative
 */
export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'El nombre es requerido';
  } else if (data.name.trim().length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres';
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'El email es requerido';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email inválido';
  }

  if (data.phone && data.phone.trim().length > 0) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(data.phone)) {
      errors.phone = 'Teléfono inválido';
    }
  }

  if (!data.service_interest || data.service_interest.trim().length === 0) {
    errors.service_interest = 'Debe seleccionar un servicio';
  }

  if (!data.message || data.message.trim().length === 0) {
    errors.message = 'El mensaje es requerido';
  } else if (data.message.trim().length < 10) {
    errors.message = 'El mensaje debe tener al menos 10 caracteres';
  }

  // Payload size limit check (prevent oversized payloads)
  const payloadSize = new TextEncoder().encode(JSON.stringify(data)).length;
  if (payloadSize > 10000) { // 10KB limit
    errors.message = 'El mensaje es demasiado largo';
  }

  return errors;
}

/**
 * Submits contact form to backend
 * Handles timeout, errors, and response parsing
 */
export async function submitContactForm(
  data: ContactFormData,
  signal?: AbortSignal
): Promise<ContactFormResponse> {
  const controller = signal ? null : createTimeoutController(REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: signal ?? controller?.signal
    });

    const result: ContactFormResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errors: result.errors || { general: 'Error al enviar el formulario' }
      };
    }

    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        errors: { general: 'La petición excedió el tiempo límite. Por favor intenta nuevamente.' }
      };
    }

    return {
      success: false,
      errors: { general: 'Error de conexión. Por favor verifica tu conexión e intenta nuevamente.' }
    };
  } finally {
    if (controller) {
      controller.abort();
    }
  }
}
