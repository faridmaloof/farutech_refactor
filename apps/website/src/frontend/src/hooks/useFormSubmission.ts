import { useState, useCallback, useRef } from 'react';

interface UseFormSubmissionOptions<T, R> {
  submitFn: (data: T) => Promise<R>;
  onSuccess?: (result: R) => void;
  onError?: (error: Error) => void;
  resetOnSuccess?: boolean;
}

interface UseFormSubmissionResult<R, E extends Record<string, string>> {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: E | null;
  result: R | null;
  submit: (data: any) => Promise<void>;
  reset: () => void;
  clearError: () => void;
}

/**
 * Generic hook for handling form submission with loading, error, and success states
 * Prevents double-submission and provides consistent error handling
 */
export function useFormSubmission<T, R, E extends Record<string, string> = Record<string, string>>(
  options: UseFormSubmissionOptions<T, R>
): UseFormSubmissionResult<R, E> {
  const { submitFn, onSuccess, onError, resetOnSuccess = true } = options;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<E | null>(null);
  const [result, setResult] = useState<R | null>(null);
  
  // Use ref to prevent race conditions
  const abortControllerRef = useRef<AbortController | null>(null);

  const submit = useCallback(async (data: T) => {
    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    setIsSubmitting(true);
    setError(null);
    setResult(null);
    setIsSuccess(false);

    try {
      const response = await submitFn(data);
      
      setResult(response);
      setIsSuccess(true);
      
      if (onSuccess) {
        onSuccess(response);
      }

      if (resetOnSuccess) {
        // Reset will be called by parent if needed
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }

      const errorObj = err as any;
      const errorResponse = (errorObj.errors || { 
        general: 'Ocurrió un error inesperado. Por favor intenta nuevamente.' 
      }) as E;

      setError(errorResponse);
      
      if (onError) {
        onError(err as Error);
      }
    } finally {
      setIsSubmitting(false);
      abortControllerRef.current = null;
    }
  }, [isSubmitting, submitFn, onSuccess, onError, resetOnSuccess]);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setIsSuccess(false);
    setError(null);
    setResult(null);
    
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isSubmitting,
    isSuccess,
    error,
    result,
    submit,
    reset,
    clearError
  };
}
