import React from 'react';
import { Bell, Calendar, Mail, MessageSquare, CreditCard, AlertCircle, Check, X, Clock } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { Link } from 'react-router';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

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

export function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'Important';
      case 'medium': return 'Normal';
      default: return 'Info';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'consultation_reminder': return 'Rappel de consultation';
      case 'consultation_confirmed': return 'Consultation confirmée';
      case 'consultation_cancelled': return 'Consultation annulée';
      case 'consultation_rescheduled': return 'Consultation reprogrammée';
      case 'consultation_started': return 'Consultation démarrée';
      case 'message_received': return 'Nouveau message';
      case 'payment_confirmed': return 'Paiement confirmé';
      case 'document_shared': return 'Document partagé';
      case 'system_update': return 'Mise à jour système';
      default: return type;
    }
  };

  const groupNotificationsByDate = () => {
    const groups: { [key: string]: typeof notifications } = {};
    
    notifications.forEach(notification => {
      const date = format(notification.timestamp, 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  };

  const formatGroupDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
        return "Aujourd'hui";
      }
      if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
        return 'Hier';
      }
      return format(date, 'EEEE d MMMM yyyy', { locale: fr });
    } catch {
      return dateStr;
    }
  };

  const groupedNotifications = groupNotificationsByDate();

  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      {/* En-tête */}
      <div className="bg-white border-b border-black/5">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-black mb-2">Notifications</h1>
              <p className="text-lg text-black/60">
                {unreadCount > 0 
                  ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                  : 'Aucune notification non lue'
                }
              </p>
            </div>

            <Link
              to="/notifications/settings"
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-black/80 transition-colors font-medium"
            >
              <Bell className="w-4 h-4" />
              <span>Préférences</span>
            </Link>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="flex gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-[#F5F1EB] text-black rounded-full hover:bg-[#E8E1D5] transition-colors text-sm font-medium"
                >
                  Tout marquer comme lu
                </button>
              )}
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-[#F5F1EB] text-black rounded-full hover:bg-[#E8E1D5] transition-colors text-sm font-medium"
              >
                Tout supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 p-12 text-center">
            <Bell className="w-16 h-16 text-black/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-black mb-2">Aucune notification</h2>
            <p className="text-black/60 mb-6">
              Vous n'avez pas encore reçu de notification. Elles apparaîtront ici.
            </p>
            <Link
              to="/notifications/settings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-black/80 transition-colors font-medium"
            >
              <Bell className="w-4 h-4" />
              <span>Configurer les notifications</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedNotifications.map(([dateStr, notifications]) => (
              <div key={dateStr}>
                {/* En-tête de groupe */}
                <div className="mb-4">
                  <h2 className="text-sm font-bold text-black/40 uppercase tracking-wider">
                    {formatGroupDate(dateStr)}
                  </h2>
                </div>

                {/* Notifications du groupe */}
                <div className="space-y-3">
                  {notifications.map((notification) => {
                    const Icon = notificationIcons[notification.type];
                    
                    return (
                      <div
                        key={notification.id}
                        className={`bg-white rounded-2xl border transition-all hover:shadow-md ${
                          !notification.read 
                            ? 'border-black/10 shadow-sm' 
                            : 'border-black/5'
                        }`}
                      >
                        <div className="p-6">
                          <div className="flex gap-4">
                            {/* Icône */}
                            <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getPriorityColor(notification.priority)} bg-opacity-10 flex items-center justify-center`}>
                              <Icon className={`w-6 h-6 ${getPriorityColor(notification.priority).replace('bg-', 'text-')}`} />
                            </div>

                            {/* Contenu */}
                            <div className="flex-1 min-w-0">
                              {/* En-tête */}
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-lg font-bold text-black">{notification.title}</h3>
                                  {!notification.read && (
                                    <div className="w-2 h-2 rounded-full bg-[#C67B5C]"></div>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${getPriorityColor(notification.priority)} bg-opacity-20`}>
                                    {getPriorityLabel(notification.priority)}
                                  </span>
                                </div>
                              </div>

                              {/* Type et heure */}
                              <div className="flex items-center gap-2 text-sm text-black/40 mb-3">
                                <span>{getTypeLabel(notification.type)}</span>
                                <span>•</span>
                                <span>{format(notification.timestamp, 'HH:mm', { locale: fr })}</span>
                              </div>

                              {/* Message */}
                              <p className="text-black/70 mb-4 leading-relaxed">
                                {notification.message}
                              </p>

                              {/* Actions */}
                              <div className="flex items-center justify-between">
                                <div className="flex gap-3">
                                  {notification.actionUrl && (
                                    <Link
                                      to={notification.actionUrl}
                                      onClick={() => markAsRead(notification.id)}
                                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full hover:bg-black/80 transition-colors text-sm font-medium"
                                    >
                                      {notification.actionLabel || 'Voir'}
                                    </Link>
                                  )}
                                </div>

                                <div className="flex gap-3">
                                  {!notification.read && (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="text-sm text-black/60 hover:text-black transition-colors"
                                    >
                                      Marquer comme lu
                                    </button>
                                  )}
                                  <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className="text-sm text-black/40 hover:text-red-600 transition-colors"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
