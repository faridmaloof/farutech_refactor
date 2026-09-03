import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

export interface UseNotificationReturn {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  notify: {
    success: (message: string, title?: string, duration?: number) => string;
    error: (message: string, title?: string, duration?: number) => string;
    warning: (message: string, title?: string, duration?: number) => string;
    info: (message: string, title?: string, duration?: number) => string;
  };
}

export function useNotification(): UseNotificationReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const notify = {
    success: (message: string, title?: string, duration?: number) =>
      addNotification({ type: 'success', title, message, duration }),
    error: (message: string, title?: string, duration?: number) =>
      addNotification({ type: 'error', title, message, duration }),
    warning: (message: string, title?: string, duration?: number) =>
      addNotification({ type: 'warning', title, message, duration }),
    info: (message: string, title?: string, duration?: number) =>
      addNotification({ type: 'info', title, message, duration }),
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    notify,
  };
}

export default useNotification;
