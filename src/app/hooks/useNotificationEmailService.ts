import { useNotifications } from '../contexts/NotificationContext';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface NotificationEmailService {
  sendConsultationEmail: (
    recipientEmail: string,
    recipientName: string,
    notificationType: 'reminder' | 'confirmed' | 'cancelled' | 'rescheduled' | 'started',
    consultationDetails: {
      expertName: string;
      date: string;
      time: string;
      duration: number;
      roomUrl?: string;
    }
  ) => Promise<boolean>;
  
  sendMessageEmail: (
    recipientEmail: string,
    recipientName: string,
    senderName: string,
    messagePreview: string
  ) => Promise<boolean>;
}

/**
 * Service pour envoyer des notifications par email
 * Utilise les préférences de notification de l'utilisateur
 */
export function useNotificationEmailService(): NotificationEmailService {
  const { preferences } = useNotifications();

  const sendConsultationEmail = async (
    recipientEmail: string,
    recipientName: string,
    notificationType: 'reminder' | 'confirmed' | 'cancelled' | 'rescheduled' | 'started',
    consultationDetails: {
      expertName: string;
      date: string;
      time: string;
      duration: number;
      roomUrl?: string;
    }
  ): Promise<boolean> => {
    // Vérifier les préférences de l'utilisateur
    if (!preferences.email) {
      console.log('Notifications email désactivées pour cet utilisateur');
      return false;
    }

    // Vérifier les préférences spécifiques
    if (notificationType === 'reminder' && !preferences.consultationReminders) {
      console.log('Rappels de consultation désactivés pour cet utilisateur');
      return false;
    }

    if (['confirmed', 'cancelled', 'rescheduled'].includes(notificationType) && !preferences.consultationUpdates) {
      console.log('Mises à jour de consultation désactivées pour cet utilisateur');
      return false;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/notifications/consultation`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            recipientEmail,
            recipientName,
            notificationType,
            consultationDetails,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Erreur lors de l\'envoi de l\'email de consultation:', error);
        return false;
      }

      console.log('Email de notification de consultation envoyé avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de consultation:', error);
      return false;
    }
  };

  const sendMessageEmail = async (
    recipientEmail: string,
    recipientName: string,
    senderName: string,
    messagePreview: string
  ): Promise<boolean> => {
    // Vérifier les préférences de l'utilisateur
    if (!preferences.email || !preferences.messages) {
      console.log('Notifications email de messages désactivées pour cet utilisateur');
      return false;
    }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/notifications/message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            recipientEmail,
            recipientName,
            senderName,
            messagePreview,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error('Erreur lors de l\'envoi de l\'email de message:', error);
        return false;
      }

      console.log('Email de notification de message envoyé avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de message:', error);
      return false;
    }
  };

  return {
    sendConsultationEmail,
    sendMessageEmail,
  };
}
