/**
 * Newsletter API Service
 * Handles all communication with the newsletter subscription endpoint
 */

import { API_BASE_URL } from '../lib/api';

const REQUEST_TIMEOUT = 10000; // 10 seconds

export interface NewsletterFormData {
  email: string;
}

export interface NewsletterFormResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}

export interface NewsletterFormErrors {
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
 * Validates newsletter form data on client side
 * This is for UX only - backend validation is authoritative
 */
export function validateNewsletterForm(data: NewsletterFormData): NewsletterFormErrors {
  const errors: NewsletterFormErrors = {};

  if (!data.email || data.email.trim().length === 0) {
    errors.email = 'El email es requerido';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email inválido';
  }

  return errors;
}

/**
 * Subscribes to newsletter
 * Handles timeout, errors, and response parsing
 */
export async function subscribeToNewsletter(
  data: NewsletterFormData,
  signal?: AbortSignal
): Promise<NewsletterFormResponse> {
  const controller = signal ? null : createTimeoutController(REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(`${API_BASE_URL}/newsletter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: data.email.trim(),
        source: 'website'
      }),
      signal: signal ?? controller?.signal
    });

    const result: NewsletterFormResponse = await response.json();

    if (!response.ok) {
      return {
        success: false,
        errors: result.errors || { general: 'Error al suscribirse' }
      };
    }

    return result;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        errors: { general: 'La petición excedió el tiempo límite. Por favor intenta más tarde.' }
      };
    }

    return {
      success: false,
      errors: { general: 'Error de conexión. Por favor intenta más tarde.' }
    };
  } finally {
    if (controller) {
      controller.abort();
    }
  }
}
