import { useEffect, useCallback } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { differenceInMinutes, isPast, parseISO } from 'date-fns';

interface Consultation {
  id: string;
  expertName: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
}

export function useConsultationReminders(consultations: Consultation[]) {
  const { addNotification, preferences } = useNotifications();

  // Convertir le timing de rappel en minutes
  const getReminderMinutes = useCallback(() => {
    switch (preferences.reminderTiming) {
      case '15min': return 15;
      case '30min': return 30;
      case '1hour': return 60;
      case '24hours': return 1440;
      default: return 60;
    }
  }, [preferences.reminderTiming]);

  const checkReminders = useCallback(() => {
    if (!preferences.consultationReminders) return;

    const now = new Date();
    const reminderMinutes = getReminderMinutes();

    consultations.forEach(consultation => {
      if (consultation.status !== 'scheduled' && consultation.status !== 'confirmed') return;

      try {
        // Combiner date et heure
        const consultationDateTime = parseISO(`${consultation.date}T${consultation.time}`);
        
        // Vérifier si la consultation est dans le futur
        if (isPast(consultationDateTime)) return;

        const minutesUntil = differenceInMinutes(consultationDateTime, now);

        // Créer une clé unique pour éviter les doublons
        const reminderKey = `reminder_${consultation.id}_${reminderMinutes}`;
        const sentReminders = JSON.parse(localStorage.getItem('sent_reminders') || '[]');

        // Si le rappel a déjà été envoyé, ne pas le renvoyer
        if (sentReminders.includes(reminderKey)) return;

        // Envoyer le rappel si c'est le bon moment (avec une marge de 1 minute)
        if (minutesUntil <= reminderMinutes && minutesUntil > reminderMinutes - 1) {
          let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
          let timeDescription = '';

          if (minutesUntil <= 15) {
            priority = 'urgent';
            timeDescription = `dans ${minutesUntil} minutes`;
          } else if (minutesUntil <= 30) {
            priority = 'high';
            timeDescription = `dans ${minutesUntil} minutes`;
          } else if (minutesUntil <= 60) {
            priority = 'medium';
            timeDescription = 'dans moins d\'une heure';
          } else {
            priority = 'low';
            const hours = Math.floor(minutesUntil / 60);
            timeDescription = `dans ${hours} heure${hours > 1 ? 's' : ''}`;
          }

          addNotification({
            type: 'consultation_reminder',
            priority,
            title: 'Consultation à venir',
            message: `Votre consultation avec ${consultation.expertName} commence ${timeDescription}`,
            actionUrl: `/membre/consultations/${consultation.id}`,
            actionLabel: 'Rejoindre',
            metadata: {
              consultationId: consultation.id,
              expertName: consultation.expertName,
              consultationDate: consultation.date,
              consultationTime: consultation.time,
            },
          });

          // Marquer le rappel comme envoyé
          sentReminders.push(reminderKey);
          localStorage.setItem('sent_reminders', JSON.stringify(sentReminders));
        }

        // Rappel supplémentaire à 5 minutes pour les consultations urgentes
        if (minutesUntil <= 5 && minutesUntil > 4) {
          const urgentKey = `urgent_${consultation.id}_5min`;
          if (!sentReminders.includes(urgentKey)) {
            addNotification({
              type: 'consultation_started',
              priority: 'urgent',
              title: 'Consultation imminente',
              message: `Votre consultation avec ${consultation.expertName} commence dans 5 minutes`,
              actionUrl: `/membre/consultations/${consultation.id}`,
              actionLabel: 'Rejoindre maintenant',
              metadata: {
                consultationId: consultation.id,
                expertName: consultation.expertName,
                consultationDate: consultation.date,
                consultationTime: consultation.time,
              },
            });

            sentReminders.push(urgentKey);
            localStorage.setItem('sent_reminders', JSON.stringify(sentReminders));
          }
        }
      } catch (error) {
        console.error('Erreur lors du traitement du rappel:', error);
      }
    });
  }, [consultations, preferences, addNotification, getReminderMinutes]);

  // Vérifier les rappels toutes les minutes
  useEffect(() => {
    checkReminders();
    const interval = setInterval(checkReminders, 60000); // Vérifier chaque minute

    return () => clearInterval(interval);
  }, [checkReminders]);

  // Nettoyer les rappels envoyés pour les consultations passées (1x par jour)
  useEffect(() => {
    const cleanupOldReminders = () => {
      const sentReminders = JSON.parse(localStorage.getItem('sent_reminders') || '[]');
      const now = new Date();
      
      const validReminders = sentReminders.filter((key: string) => {
        const consultationId = key.split('_')[1];
        const consultation = consultations.find(c => c.id === consultationId);
        
        if (!consultation) return false;
        
        try {
          const consultationDateTime = parseISO(`${consultation.date}T${consultation.time}`);
          return !isPast(consultationDateTime);
        } catch {
          return false;
        }
      });

      localStorage.setItem('sent_reminders', JSON.stringify(validReminders));
    };

    cleanupOldReminders();
    const interval = setInterval(cleanupOldReminders, 86400000); // 24 heures

    return () => clearInterval(interval);
  }, [consultations]);
}
