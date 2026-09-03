import { useCallback } from 'react';
import usePushNotificationStore from '../store/pushNotificationStore';

export interface UsePushNotificationReturn {
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    icon?: string;
    badge?: number;
    timestamp: Date;
    read: boolean;
    onClick?: () => void;
    action?: {
      label: string;
      onClick: () => void;
    };
  }>;
  unreadCount: number;
  addNotification: (notification: Omit<UsePushNotificationReturn['notifications'][0], 'id' | 'timestamp' | 'read'>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  getUnreadNotifications: () => UsePushNotificationReturn['notifications'];
  getRecentNotifications: (limit?: number) => UsePushNotificationReturn['notifications'];
  requestPermission: () => Promise<void>;
}

export function usePushNotification(): UsePushNotificationReturn {
  const {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    getUnreadNotifications,
    getRecentNotifications,
  } = usePushNotificationStore();

  const requestPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    getUnreadNotifications,
    getRecentNotifications,
    requestPermission,
  };
}

export default usePushNotification;
