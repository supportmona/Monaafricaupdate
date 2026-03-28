import { useState, useEffect } from "react";
import { motion } from "motion/react";
import ExpertLayout from "@/app/components/ExpertLayout";
import {
  Clock, Save, Check, AlertCircle, ChevronDown, ChevronUp, Info,
} from "lucide-react";

const API_BASE = "https://nvjcbmzhkfdhxlmqurjn.supabase.co/functions/v1/make-server-6378cc81";

const DAYS = [
  { key: "monday",    label: "Lundi",    index: 1 },
  { key: "tuesday",   label: "Mardi",    index: 2 },
  { key: "wednesday", label: "Mercredi", index: 3 },
  { key: "thursday",  label: "Jeudi",    index: 4 },
  { key: "friday",    label: "Vendredi", index: 5 },
  { key: "saturday",  label: "Samedi",   index: 6 },
  { key: "sunday",    label: "Dimanche", index: 0 },
];

const TIME_SLOTS = Array.from({ length: 25 }, (_, i) => {
  const h = Math.floor(i / 2) + 7; // 07:00 → 19:00
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
}).filter((_, i) => i <= 24);

interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

type Schedule = Record<string, DaySchedule>;

const defaultSchedule: Schedule = {
  monday:    { enabled: true,  start: "09:00", end: "17:00" },
  tuesday:   { enabled: true,  start: "09:00", end: "17:00" },
  wednesday: { enabled: true,  start: "09:00", end: "17:00" },
  thursday:  { enabled: true,  start: "09:00", end: "17:00" },
  friday:    { enabled: true,  start: "09:00", end: "17:00" },
  saturday:  { enabled: false, start: "09:00", end: "13:00" },
  sunday:    { enabled: false, start: "09:00", end: "13:00" },
};

export default function ExpertAvailabilityPage() {
  const [schedule, setSchedule] = useState<Schedule>(defaultSchedule);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const token = localStorage.getItem("expert_access_token");

  // ── Charger les disponibilités existantes ──────────────────────────────────
  useEffect(() => {
    const load = async () => {
      if (!token) { setLoading(false); return; }
      try {
        // Essayer d'abord les nouvelles routes booking (table SQL)
        const res = await fetch(`${API_BASE}/booking/expert/slots`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            // Convertir format DB → format UI
            const newSchedule = { ...defaultSchedule };
            // Désactiver tous les jours d'abord
            Object.keys(newSchedule).forEach(k => newSchedule[k].enabled = false);
            // Activer les jours avec des créneaux
            json.data.forEach((slot: any) => {
              const day = DAYS.find(d => d.index === slot.day_of_week);
              if (day) {
                newSchedule[day.key] = {
                  enabled: slot.is_available,
                  start: slot.start_time.substring(0, 5),
                  end: slot.end_time.substring(0, 5),
                };
              }
            });
            setSchedule(newSchedule);
            setLoading(false);
            return;
          }
        }

        // Fallback : ancien système KV
        const resOld = await fetch(`${API_BASE}/expert/availability/schedule`, {
          headers: { "X-Expert-Token": token },
        });
        if (resOld.ok) {
          const jsonOld = await resOld.json();
          if (jsonOld.data?.schedule) {
            const old = jsonOld.data.schedule;
            const newSchedule = { ...defaultSchedule };
            Object.keys(old).forEach(key => {
              if (old[key]?.length > 0) {
                newSchedule[key] = { enabled: true, start: old[key][0].start, end: old[key][0].end };
              } else {
                newSchedule[key] = { ...newSchedule[key], enabled: false };
              }
            });
            setSchedule(newSchedule);
          }
        }
      } catch (e) {
        console.error("Erreur chargement disponibilités:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Sauvegarder ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setError(null);

    try {
      // Convertir format UI → format API booking (table SQL)
      const slots = DAYS.map(day => ({
        day_of_week: day.index,
        start_time: schedule[day.key].start + ":00",
        end_time: schedule[day.key].end + ":00",
        is_available: schedule[day.key].enabled,
      }));

      const res = await fetch(`${API_BASE}/booking/expert/slots`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slots }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de la sauvegarde");
      }

      // Aussi sauvegarder dans l'ancien système KV pour compatibilité
      const oldSchedule: Record<string, { start: string; end: string }[]> = {};
      DAYS.forEach(day => {
        oldSchedule[day.key] = schedule[day.key].enabled
          ? [{ start: schedule[day.key].start, end: schedule[day.key].end }]
          : [];
      });

      await fetch(`${API_BASE}/expert/availability/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Expert-Token": token,
        },
        body: JSON.stringify({ schedule: oldSchedule }),
      }).catch(() => {}); // Silencieux si ça échoue

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (dayKey: string) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], enabled: !prev[dayKey].enabled },
    }));
  };

  const updateTime = (dayKey: string, field: "start" | "end", value: string) => {
    setSchedule(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value },
    }));
  };

  const enabledCount = Object.values(schedule).filter(d => d.enabled).length;

  if (loading) {
    return (
      <ExpertLayout title="Disponibilités">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-[#A68B6F] border-t-transparent rounded-full animate-spin" />
        </div>
      </ExpertLayout>
    );
  }

  return (
    <ExpertLayout title="Disponibilités">
      <div className="p-6 space-y-6 max-w-3xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-serif text-[#1A1A1A]">Mes disponibilités</h1>
            <p className="text-sm text-[#1A1A1A]/60 mt-1">
              {enabledCount} jour{enabledCount !== 1 ? "s" : ""} actif{enabledCount !== 1 ? "s" : ""} par semaine
            </p>
          </div>
          <button onClick={handleSave} disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
              saved
                ? "bg-green-500 text-white"
                : "bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]"
            } disabled:opacity-50`}>
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              <Check className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Sauvegarde..." : saved ? "Sauvegardé !" : "Sauvegarder"}
          </button>
        </motion.div>

        {/* Info banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#F5F1ED] border border-[#D4C5B9] rounded-2xl p-4">
          <button onClick={() => setShowInfo(!showInfo)}
            className="flex items-center justify-between w-full text-left">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#A68B6F]" />
              <span className="text-sm font-medium text-[#1A1A1A]">Comment ça fonctionne ?</span>
            </div>
            {showInfo ? <ChevronUp className="w-4 h-4 text-[#1A1A1A]/40" /> : <ChevronDown className="w-4 h-4 text-[#1A1A1A]/40" />}
          </button>
          {showInfo && (
            <div className="mt-3 text-sm text-[#1A1A1A]/70 space-y-1">
              <p>• Les créneaux que vous définissez ici seront visibles par les membres pour prendre rendez-vous.</p>
              <p>• Chaque créneau d'une heure sera proposé dans la plage horaire choisie.</p>
              <p>• Les rendez-vous déjà confirmés restent valides même si vous modifiez vos disponibilités.</p>
              <p>• La salle vidéo Daily.co est créée automatiquement à la confirmation d'un RDV.</p>
            </div>
          )}
        </motion.div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Planning par jour */}
        <div className="space-y-3">
          {DAYS.map((day, i) => {
            const dayData = schedule[day.key];
            return (
              <motion.div key={day.key}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={`bg-white rounded-2xl border transition-all ${
                  dayData.enabled ? "border-[#A68B6F]/40 shadow-sm" : "border-[#D4C5B9]"
                }`}>
                <div className="flex items-center gap-4 p-4">

                  {/* Toggle */}
                  <button onClick={() => toggleDay(day.key)}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                      dayData.enabled ? "bg-[#A68B6F]" : "bg-[#D4C5B9]"
                    }`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      dayData.enabled ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>

                  {/* Jour */}
                  <span className={`w-24 text-sm font-medium flex-shrink-0 ${
                    dayData.enabled ? "text-[#1A1A1A]" : "text-[#1A1A1A]/40"
                  }`}>
                    {day.label}
                  </span>

                  {/* Horaires */}
                  {dayData.enabled ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Clock className="w-4 h-4 text-[#A68B6F] flex-shrink-0" />
                      <select value={dayData.start} onChange={e => updateTime(day.key, "start", e.target.value)}
                        className="px-3 py-1.5 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]">
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <span className="text-sm text-[#1A1A1A]/60">→</span>
                      <select value={dayData.end} onChange={e => updateTime(day.key, "end", e.target.value)}
                        className="px-3 py-1.5 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]">
                        {TIME_SLOTS.filter(t => t > dayData.start).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <span className="text-xs text-[#1A1A1A]/40 ml-1">
                        {(() => {
                          const [sh, sm] = dayData.start.split(":").map(Number);
                          const [eh, em] = dayData.end.split(":").map(Number);
                          const diff = (eh * 60 + em) - (sh * 60 + sm);
                          return `${diff / 60}h · ${diff / 60} créneaux`;
                        })()}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-[#1A1A1A]/40 italic">Indisponible</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Résumé */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-[#D4C5B9] p-6">
          <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">Résumé hebdomadaire</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F5F1ED] rounded-xl p-4 text-center">
              <p className="text-2xl font-light text-[#A68B6F]">{enabledCount}</p>
              <p className="text-xs text-[#1A1A1A]/60 mt-1">Jours disponibles</p>
            </div>
            <div className="bg-[#F5F1ED] rounded-xl p-4 text-center">
              <p className="text-2xl font-light text-[#A68B6F]">
                {Object.values(schedule).filter(d => d.enabled).reduce((acc, d) => {
                  const [sh, sm] = d.start.split(":").map(Number);
                  const [eh, em] = d.end.split(":").map(Number);
                  return acc + ((eh * 60 + em) - (sh * 60 + sm)) / 60;
                }, 0)}h
              </p>
              <p className="text-xs text-[#1A1A1A]/60 mt-1">Créneaux / semaine</p>
            </div>
          </div>
        </motion.div>

        {/* Bouton sauvegarder en bas */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="flex justify-end pb-6">
          <button onClick={handleSave} disabled={saving}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium transition-all ${
              saved ? "bg-green-500 text-white" : "bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]"
            } disabled:opacity-50`}>
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? "Sauvegarde..." : saved ? "Sauvegardé !" : "Sauvegarder les disponibilités"}
          </button>
        </motion.div>

      </div>
    </ExpertLayout>
  );
}
