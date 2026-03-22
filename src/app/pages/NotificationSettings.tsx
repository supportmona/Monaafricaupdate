import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Calendar, CreditCard, Shield, Clock, Check } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';

export function NotificationSettings() {
  const { preferences, updatePreferences } = useNotifications();
  const { t } = useLanguage();
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof typeof preferences) => {
    updatePreferences({ [key]: !preferences[key] });
    showSavedFeedback();
  };

  const handleReminderTimingChange = (timing: '15min' | '30min' | '1hour' | '24hours') => {
    updatePreferences({ reminderTiming: timing });
    showSavedFeedback();
  };

  const showSavedFeedback = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const settingSections = [
    {
      title: 'Canaux de notification',
      icon: Bell,
      settings: [
        {
          key: 'email' as const,
          label: 'Notifications par email',
          description: 'Recevoir les notifications importantes par email à @monafrica.net',
          icon: Mail,
        },
        {
          key: 'push' as const,
          label: 'Notifications push',
          description: 'Recevoir les notifications dans le navigateur',
          icon: Bell,
        },
      ],
    },
    {
      title: 'Types de notification',
      icon: MessageSquare,
      settings: [
        {
          key: 'consultationReminders' as const,
          label: 'Rappels de consultation',
          description: 'Être rappelé avant vos consultations',
          icon: Calendar,
        },
        {
          key: 'consultationUpdates' as const,
          label: 'Mises à jour de consultation',
          description: 'Confirmations, annulations et modifications',
          icon: Calendar,
        },
        {
          key: 'messages' as const,
          label: 'Messages',
          description: 'Nouveaux messages de vos experts',
          icon: MessageSquare,
        },
        {
          key: 'paymentUpdates' as const,
          label: 'Paiements',
          description: 'Confirmations de paiement et reçus',
          icon: CreditCard,
        },
        {
          key: 'systemUpdates' as const,
          label: 'Mises à jour système',
          description: 'Nouvelles fonctionnalités et maintenances',
          icon: Shield,
        },
      ],
    },
  ];

  const reminderOptions = [
    { value: '15min', label: '15 minutes avant' },
    { value: '30min', label: '30 minutes avant' },
    { value: '1hour', label: '1 heure avant' },
    { value: '24hours', label: '24 heures avant' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1EB] py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-3">Préférences de notification</h1>
          <p className="text-lg text-black/70">
            Gérez comment et quand vous souhaitez être notifié
          </p>
        </div>

        {/* Indicateur de sauvegarde */}
        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Préférences enregistrées avec succès
            </span>
          </div>
        )}

        {/* Timing des rappels */}
        {preferences.consultationReminders && (
          <div className="bg-white rounded-2xl border border-black/5 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#C67B5C]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#C67B5C]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black">Timing des rappels</h2>
                <p className="text-sm text-black/60">Quand recevoir les rappels de consultation</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {reminderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleReminderTimingChange(option.value as any)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    preferences.reminderTiming === option.value
                      ? 'border-black bg-black text-white'
                      : 'border-black/10 hover:border-black/20'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                </button>
              ))}
            </div>

            <div className="mt-4 p-4 bg-[#F5F1EB] rounded-xl">
              <p className="text-sm text-black/70">
                Un rappel supplémentaire sera envoyé 5 minutes avant chaque consultation pour vous permettre de rejoindre à temps.
              </p>
            </div>
          </div>
        )}

        {/* Sections de paramètres */}
        {settingSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-2xl border border-black/5 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-lg font-bold text-black">{section.title}</h2>
            </div>

            <div className="space-y-4">
              {section.settings.map((setting) => (
                <div
                  key={setting.key}
                  className="flex items-start justify-between p-4 rounded-xl hover:bg-[#F5F1EB] transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#F5F1EB] flex items-center justify-center flex-shrink-0">
                      <setting.icon className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-black mb-1">{setting.label}</h3>
                      <p className="text-sm text-black/60">{setting.description}</p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggle(setting.key)}
                    className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
                      preferences[setting.key] ? 'bg-black' : 'bg-black/20'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                        preferences[setting.key] ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Note de confidentialité */}
        <div className="bg-[#FFF9F3] border border-[#C67B5C]/20 rounded-2xl p-6">
          <div className="flex gap-4">
            <Shield className="w-6 h-6 text-[#C67B5C] flex-shrink-0" />
            <div>
              <h3 className="font-bold text-black mb-2">Confidentialité des données</h3>
              <p className="text-sm text-black/70 leading-relaxed">
                Vos préférences de notification sont stockées localement et de manière sécurisée. 
                M.O.N.A respecte votre vie privée et ne partagera jamais vos informations sans votre consentement explicite. 
                Les emails sont envoyés uniquement depuis @monafrica.net.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
