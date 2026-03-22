import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import type { Notification, NotificationPreferences } from '../types/notification';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email: true,
  push: true,
  consultationReminders: true,
  consultationUpdates: true,
  messages: true,
  paymentUpdates: true,
  systemUpdates: false,
  reminderTiming: '1hour',
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);

  // Charger les notifications depuis le localStorage au démarrage
  useEffect(() => {
    const stored = localStorage.getItem('mona_notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(parsed.map((n: Notification) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        })));
      } catch (e) {
        console.error('Erreur lors du chargement des notifications:', e);
      }
    }

    const storedPrefs = localStorage.getItem('mona_notification_preferences');
    if (storedPrefs) {
      try {
        setPreferences(JSON.parse(storedPrefs));
      } catch (e) {
        console.error('Erreur lors du chargement des préférences:', e);
      }
    }
  }, []);

  // Sauvegarder les notifications dans le localStorage
  useEffect(() => {
    localStorage.setItem('mona_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Sauvegarder les préférences dans le localStorage
  useEffect(() => {
    localStorage.setItem('mona_notification_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Afficher le toast selon la priorité
    const toastOptions = {
      duration: notification.priority === 'urgent' ? 10000 : 5000,
      action: notification.actionUrl ? {
        label: notification.actionLabel || 'Voir',
        onClick: () => window.location.href = notification.actionUrl!,
      } : undefined,
    };

    switch (notification.priority) {
      case 'urgent':
        toast.error(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
        break;
      case 'high':
        toast.warning(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
        break;
      default:
        toast.success(notification.title, {
          description: notification.message,
          ...toastOptions,
        });
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        preferences,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        updatePreferences,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications doit être utilisé à l\'intérieur d\'un NotificationProvider');
  }
  return context;
}
