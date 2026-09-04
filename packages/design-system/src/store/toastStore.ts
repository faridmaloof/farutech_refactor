import { create } from 'zustand';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title?: string;
  message: string;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export interface ToastState {
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  updateToast: (id: string, updates: Partial<ToastNotification>) => void;
  notify: {
    success: (message: string, title?: string, duration?: number, position?: ToastNotification['position']) => string;
    error: (message: string, title?: string, duration?: number, position?: ToastNotification['position']) => string;
    warning: (message: string, title?: string, duration?: number, position?: ToastNotification['position']) => string;
    info: (message: string, title?: string, duration?: number, position?: ToastNotification['position']) => string;
    loading: (message: string, title?: string, position?: ToastNotification['position']) => string;
  };
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (toast: Omit<ToastNotification, 'id'>): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastNotification = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
      position: toast.position ?? 'top-right',
    };

    set((state) => ({ toasts: [...state.toasts, newToast] }));
    return id;
  },

  removeToast: (id: string) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  updateToast: (id: string, updates: Partial<ToastNotification>) => {
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  notify: {
    success: (message: string, title?: string, duration?: number, position?: ToastNotification['position']) =>
      get().addToast({ type: 'success', title, message, duration, position }),
    error: (message: string, title?: string, duration?: number, position?: ToastNotification['position']) =>
      get().addToast({ type: 'error', title, message, duration, position }),
    warning: (message: string, title?: string, duration?: number, position?: ToastNotification['position']) =>
      get().addToast({ type: 'warning', title, message, duration, position }),
    info: (message: string, title?: string, duration?: number, position?: ToastNotification['position']) =>
      get().addToast({ type: 'info', title, message, duration, position }),
    loading: (message: string, title?: string, position?: ToastNotification['position']) =>
      get().addToast({ type: 'loading', title, message, duration: 0, position }),
  },
}));

export default useToastStore;
