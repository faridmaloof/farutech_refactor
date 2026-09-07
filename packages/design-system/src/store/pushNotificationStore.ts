import { create } from 'zustand';

export interface PushNotificationItem {
  id: string;
  title: string;
  message: string;
  icon?: string;
  badge?: string;
  timestamp: Date;
  read: boolean;
  onClick?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface PushNotificationState {
  notifications: PushNotificationItem[];
  unreadCount: number;
  addNotification: (notification: Omit<PushNotificationItem, 'id' | 'timestamp' | 'read'>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  getUnreadNotifications: () => PushNotificationItem[];
  getRecentNotifications: (limit?: number) => PushNotificationItem[];
}

export const usePushNotificationStore = create<PushNotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification: Omit<PushNotificationItem, 'id' | 'timestamp' | 'read'>): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: PushNotificationItem = {
      ...notification,
      id,
      timestamp: new Date(),
      read: false,
    };

    set((state) => {
      const updatedNotifications = [newNotification, ...state.notifications];
      const unreadCount = updatedNotifications.filter((n) => !n.read).length;
      return {
        notifications: updatedNotifications,
        unreadCount,
      };
    });

    // Request browser notification permission and show native notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: notification.icon,
        badge: notification.badge,
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: notification.icon,
            badge: notification.badge,
          });
        }
      });
    }

    return id;
  },

  removeNotification: (id: string) => {
    set((state) => {
      const updatedNotifications = state.notifications.filter((n) => n.id !== id);
      const unreadCount = updatedNotifications.filter((n) => !n.read).length;
      return {
        notifications: updatedNotifications,
        unreadCount,
      };
    });
  },

  markAsRead: (id: string) => {
    set((state) => {
      const updatedNotifications = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      const unreadCount = updatedNotifications.filter((n) => !n.read).length;
      return {
        notifications: updatedNotifications,
        unreadCount,
      };
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0,
    });
  },

  getUnreadNotifications: () => {
    return get().notifications.filter((n) => !n.read);
  },

  getRecentNotifications: (limit = 10) => {
    return get().notifications.slice(0, limit);
  },
}));

export default usePushNotificationStore;
