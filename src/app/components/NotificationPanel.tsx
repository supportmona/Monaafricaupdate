import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Clock, Calendar, MessageSquare, CreditCard, AlertCircle } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router';

const notificationIcons = {
  consultation_reminder: Calendar,
  consultation_confirmed: Check,
  consultation_cancelled: X,
  consultation_rescheduled: Calendar,
  consultation_started: Clock,
  message_received: MessageSquare,
  payment_confirmed: CreditCard,
  document_shared: Clock,
  system_update: AlertCircle,
};

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const { t } = useLanguage();

  // Fermer le panneau quand on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="relative">
      {/* Bouton Bell avec badge */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-[#F5F1EB] transition-colors duration-200"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-black" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#C67B5C] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Panneau de notifications */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-black/5 z-50"
        >
          {/* En-tête */}
          <div className="px-6 py-4 border-b border-black/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-black">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#F5F1EB] rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filtres et actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                    filter === 'all'
                      ? 'bg-black text-white'
                      : 'bg-[#F5F1EB] text-black hover:bg-[#E8E1D5]'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                    filter === 'unread'
                      ? 'bg-black text-white'
                      : 'bg-[#F5F1EB] text-black hover:bg-[#E8E1D5]'
                  }`}
                >
                  Non lues ({unreadCount})
                </button>
              </div>

              {notifications.length > 0 && (
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="p-1.5 hover:bg-[#F5F1EB] rounded-full transition-colors"
                      title="Tout marquer comme lu"
                    >
                      <CheckCheck className="w-4 h-4 text-black" />
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="p-1.5 hover:bg-[#F5F1EB] rounded-full transition-colors"
                    title="Tout supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-black" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Liste des notifications */}
          <div className="max-h-[500px] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Bell className="w-12 h-12 text-black/20 mx-auto mb-3" />
                <p className="text-sm text-black/40">
                  {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-black/5">
                {filteredNotifications.map((notification) => {
                  const Icon = notificationIcons[notification.type];
                  
                  return (
                    <div
                      key={notification.id}
                      className={`px-6 py-4 hover:bg-[#F5F1EB] transition-colors ${
                        !notification.read ? 'bg-[#FFF9F3]' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Icône */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getPriorityColor(notification.priority)} bg-opacity-10 flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${getPriorityColor(notification.priority).replace('bg-', 'text-')}`} />
                        </div>

                        {/* Contenu */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="text-sm font-bold text-black">{notification.title}</h4>
                            {!notification.read && (
                              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#C67B5C] ml-2"></div>
                            )}
                          </div>
                          
                          <p className="text-sm text-black/70 mb-2">{notification.message}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-black/40">
                              {formatDistance(notification.timestamp, new Date(), {
                                addSuffix: true,
                                locale: fr,
                              })}
                            </span>

                            <div className="flex gap-2">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-black/60 hover:text-black transition-colors"
                                >
                                  Marquer lu
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="text-xs text-black/40 hover:text-red-600 transition-colors"
                              >
                                Supprimer
                              </button>
                            </div>
                          </div>

                          {notification.actionUrl && (
                            <Link
                              to={notification.actionUrl}
                              onClick={() => {
                                markAsRead(notification.id);
                                setIsOpen(false);
                              }}
                              className="inline-block mt-3 text-xs font-medium px-4 py-2 bg-black text-white rounded-full hover:bg-black/80 transition-colors"
                            >
                              {notification.actionLabel || 'Voir'}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-6 py-3 border-t border-black/5">
              <Link
                to="/member/dashboard"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm font-medium text-black hover:text-black/70 transition-colors"
              >
                Voir toutes les notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}