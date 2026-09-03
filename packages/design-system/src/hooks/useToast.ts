import useToastStore from '../store/toastStore';

export interface UseToastReturn {
  toasts: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info' | 'loading';
    title?: string;
    message: string;
    duration?: number;
    position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
  }>;
  addToast: (toast: Omit<UseToastReturn['toasts'][0], 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  updateToast: (id: string, updates: Partial<UseToastReturn['toasts'][0]>) => void;
  notify: {
    success: (message: string, title?: string, duration?: number, position?: UseToastReturn['toasts'][0]['position']) => string;
    error: (message: string, title?: string, duration?: number, position?: UseToastReturn['toasts'][0]['position']) => string;
    warning: (message: string, title?: string, duration?: number, position?: UseToastReturn['toasts'][0]['position']) => string;
    info: (message: string, title?: string, duration?: number, position?: UseToastReturn['toasts'][0]['position']) => string;
    loading: (message: string, title?: string, position?: UseToastReturn['toasts'][0]['position']) => string;
  };
}

export function useToast(): UseToastReturn {
  const { toasts, addToast, removeToast, clearToasts, updateToast, notify } = useToastStore();

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    updateToast,
    notify,
  };
}

export default useToast;
