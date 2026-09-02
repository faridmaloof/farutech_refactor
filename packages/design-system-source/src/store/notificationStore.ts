import { create } from 'zustand'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  type: NotificationType
  message: string
  title?: string
  duration?: number
}

interface NotificationState {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: Notification = { id, ...notification }
    set((state) => ({ notifications: [...state.notifications, newNotification] }))
    
    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      }, notification.duration || 5000)
    }
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearAll: () => set({ notifications: [] }),
}))

export const notify = {
  success: (message: string, title?: string) =>
    useNotificationStore.getState().addNotification({
      type: 'success',
      message,
      title,
    }),
  error: (message: string, title?: string) =>
    useNotificationStore.getState().addNotification({
      type: 'error',
      message,
      title,
    }),
  warning: (message: string, title?: string) =>
    useNotificationStore.getState().addNotification({
      type: 'warning',
      message,
      title,
    }),
  info: (message: string, title?: string) =>
    useNotificationStore.getState().addNotification({
      type: 'info',
      message,
      title,
    }),
}
