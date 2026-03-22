import { useState } from "react";
import { Clock, Plus, X, Save, CheckCircle2, Loader2, CalendarDays } from "lucide-react";

interface WeeklyAvailability {
  enabled: boolean;
  timeSlots: { start: string; end: string }[];
}

interface WeeklySchedule {
  monday: WeeklyAvailability;
  tuesday: WeeklyAvailability;
  wednesday: WeeklyAvailability;
  thursday: WeeklyAvailability;
  friday: WeeklyAvailability;
  saturday: WeeklyAvailability;
  sunday: WeeklyAvailability;
}

interface WeeklyScheduleEditorProps {
  schedule: WeeklySchedule;
  onScheduleChange: (schedule: WeeklySchedule) => void;
  onSave: () => Promise<void>;
  saving?: boolean;
  saved?: boolean;
}

const DAYS = [
  { key: "monday" as keyof WeeklySchedule, label: "Lundi" },
  { key: "tuesday" as keyof WeeklySchedule, label: "Mardi" },
  { key: "wednesday" as keyof WeeklySchedule, label: "Mercredi" },
  { key: "thursday" as keyof WeeklySchedule, label: "Jeudi" },
  { key: "friday" as keyof WeeklySchedule, label: "Vendredi" },
  { key: "saturday" as keyof WeeklySchedule, label: "Samedi" },
  { key: "sunday" as keyof WeeklySchedule, label: "Dimanche" },
];

export default function WeeklyScheduleEditor({
  schedule,
  onScheduleChange,
  onSave,
  saving = false,
  saved = false,
}: WeeklyScheduleEditorProps) {
  const [expanded, setExpanded] = useState(true);

  const toggleDay = (day: keyof WeeklySchedule) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        enabled: !schedule[day].enabled,
        timeSlots: schedule[day].timeSlots.length === 0 && !schedule[day].enabled
          ? [{ start: "09:00", end: "17:00" }]
          : schedule[day].timeSlots,
      },
    };
    onScheduleChange(newSchedule);
  };

  const addTimeSlot = (day: keyof WeeklySchedule) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: [...schedule[day].timeSlots, { start: "09:00", end: "17:00" }],
      },
    };
    onScheduleChange(newSchedule);
  };

  const removeTimeSlot = (day: keyof WeeklySchedule, index: number) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: schedule[day].timeSlots.filter((_, i) => i !== index),
      },
    };
    onScheduleChange(newSchedule);
  };

  const updateTimeSlot = (
    day: keyof WeeklySchedule,
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        timeSlots: schedule[day].timeSlots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ),
      },
    };
    onScheduleChange(newSchedule);
  };

  return (
    <div className="bg-white rounded-xl border border-beige/30 overflow-hidden shadow-sm">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-beige/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-terracotta/20 to-gold/10 rounded-xl flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-terracotta" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-serif text-anthracite">
              Disponibilités Hebdomadaires Récurrentes
            </h3>
            <p className="text-sm text-anthracite/60">
              Définissez vos créneaux de disponibilité par défaut pour chaque jour de la semaine
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Enregistré</span>
            </div>
          )}
          <svg
            className={`w-5 h-5 text-anthracite/40 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Content */}
      {expanded && (
        <div className="border-t border-beige/30">
          <div className="p-6 space-y-4">
            {DAYS.map((day) => {
              const daySchedule = schedule[day.key];
              return (
                <div
                  key={day.key}
                  className="border border-beige/30 rounded-xl overflow-hidden"
                >
                  {/* Day Header */}
                  <div
                    className={`flex items-center justify-between p-4 ${
                      daySchedule.enabled ? "bg-gradient-to-r from-terracotta/5 to-gold/5" : "bg-beige/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={daySchedule.enabled}
                        onChange={() => toggleDay(day.key)}
                        className="w-5 h-5 text-terracotta border-beige/30 rounded focus:ring-2 focus:ring-terracotta/20"
                      />
                      <span className="font-medium text-anthracite">{day.label}</span>
                    </div>
                    {daySchedule.enabled && (
                      <button
                        onClick={() => addTimeSlot(day.key)}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm text-terracotta hover:bg-terracotta/10 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un créneau
                      </button>
                    )}
                  </div>

                  {/* Time Slots */}
                  {daySchedule.enabled && daySchedule.timeSlots.length > 0 && (
                    <div className="p-4 space-y-3 bg-white">
                      {daySchedule.timeSlots.map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-beige/10 rounded-lg"
                        >
                          <Clock className="w-4 h-4 text-anthracite/50 flex-shrink-0" />
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="time"
                              value={slot.start}
                              onChange={(e) =>
                                updateTimeSlot(day.key, index, "start", e.target.value)
                              }
                              className="px-3 py-2 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/20 text-sm"
                            />
                            <span className="text-anthracite/50">à</span>
                            <input
                              type="time"
                              value={slot.end}
                              onChange={(e) =>
                                updateTimeSlot(day.key, index, "end", e.target.value)
                              }
                              className="px-3 py-2 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/20 text-sm"
                            />
                          </div>
                          {daySchedule.timeSlots.length > 1 && (
                            <button
                              onClick={() => removeTimeSlot(day.key, index)}
                              className="p-2 text-red-600/60 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty state */}
                  {daySchedule.enabled && daySchedule.timeSlots.length === 0 && (
                    <div className="p-4 text-center text-sm text-anthracite/50 bg-white">
                      Aucun créneau défini. Cliquez sur "Ajouter un créneau" pour commencer.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-beige/30 p-4 bg-beige/5 flex items-center justify-between">
            <p className="text-sm text-anthracite/60">
              Ces disponibilités seront appliquées automatiquement chaque semaine
            </p>
            <button
              onClick={onSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-br from-terracotta/70 to-gold/60 text-white rounded-lg hover:shadow-lg hover:shadow-terracotta/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Enregistrer les disponibilités
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
