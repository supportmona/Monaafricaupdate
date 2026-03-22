export type NotificationType = 
  | 'consultation_reminder'
  | 'consultation_confirmed'
  | 'consultation_cancelled'
  | 'consultation_rescheduled'
  | 'consultation_started'
  | 'message_received'
  | 'payment_confirmed'
  | 'document_shared'
  | 'system_update';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    consultationId?: string;
    expertId?: string;
    expertName?: string;
    consultationDate?: string;
    consultationTime?: string;
    [key: string]: string | undefined;
  };
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  consultationReminders: boolean;
  consultationUpdates: boolean;
  messages: boolean;
  paymentUpdates: boolean;
  systemUpdates: boolean;
  reminderTiming: '15min' | '30min' | '1hour' | '24hours';
}
