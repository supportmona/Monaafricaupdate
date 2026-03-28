import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ExpertLayout from "@/app/components/ExpertLayout";
import { projectId } from "/utils/supabase/info";
import {
  Clock, Save, Check, AlertCircle, ChevronDown, ChevronUp,
  Info, Plus, X, Trash2, BanIcon,
} from "lucide-react";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81`;

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
  const h = Math.floor(i / 2) + 7;
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
}).filter((_, i) => i <= 24);

interface DaySchedule { enabled: boolean; start: string; end: string; }
type Schedule = Record<string, DaySchedule>;

interface BlockedSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}

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
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockForm, setBlockForm] = useState({ date: "", startTime: "", endTime: "", reason: "" });
  const [blocking, setBlocking] = useState(false);

  const token = localStorage.getItem("expert_access_token");

  // ── Charger disponibilités + créneaux bloqués ─────────────────────────────
  useEffect(() => {
    const load = async () => {
      if (!token) { setLoading(false); return; }
      try {
        // Nouvelles routes booking (table SQL)
        const res = await fetch(`${API_BASE}/booking/expert/slots`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            const newSchedule = { ...defaultSchedule };
            Object.keys(newSchedule).forEach(k => newSchedule[k].enabled = false);
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
          }
        }

        // Créneaux bloqués (ancien système KV)
        const blocksRes = await fetch(`${API_BASE}/expert/availability/blocks`, {
          headers: { "X-Expert-Token": token },
        });
        if (blocksRes.ok) {
          const blocksData = await blocksRes.json();
          setBlockedSlots(blocksData.data || []);
        }
      } catch (e) {
        console.error("Erreur chargement disponibilités:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Sauvegarder les disponibilités ────────────────────────────────────────
  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      const slots = DAYS.map(day => ({
        day_of_week: day.index,
        start_time: schedule[day.key].start + ":00",
        end_time: schedule[day.key].end + ":00",
        is_available: schedule[day.key].enabled,
      }));

      const res = await fetch(`${API_BASE}/booking/expert/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slots }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de la sauvegarde");
      }

      // Aussi sauvegarder dans l'ancien système KV pour compatibilité
      const oldSchedule: Record<string, any[]> = {};
      DAYS.forEach(day => {
        oldSchedule[day.key] = schedule[day.key].enabled
          ? [{ start: schedule[day.key].start, end: schedule[day.key].end }]
          : [];
      });
      await fetch(`${API_BASE}/expert/availability/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Expert-Token": token },
        body: JSON.stringify({ schedule: oldSchedule }),
      }).catch(() => {});

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  // ── Bloquer un créneau ────────────────────────────────────────────────────
  const handleBlockSlot = async () => {
    if (!token || !blockForm.date || !blockForm.startTime || !blockForm.endTime) return;
    setBlocking(true);
    try {
      const res = await fetch(`${API_BASE}/expert/availability/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Expert-Token": token },
        body: JSON.stringify(blockForm),
      });
      if (res.ok) {
        const json = await res.json();
        // Recharger les bloqués
        const blocksRes = await fetch(`${API_BASE}/expert/availability/blocks`, {
          headers: { "X-Expert-Token": token },
        });
        if (blocksRes.ok) {
          const data = await blocksRes.json();
          setBlockedSlots(data.data || []);
        }
        setShowBlockModal(false);
        setBlockForm({ date: "", startTime: "", endTime: "", reason: "" });
      }
    } catch (e) {
      console.error("Erreur blocage:", e);
    } finally {
      setBlocking(false);
    }
  };

  // ── Débloquer un créneau ──────────────────────────────────────────────────
  const handleUnblock = async (blockId: string) => {
    if (!token) return;
    try {
      await fetch(`${API_BASE}/expert/availability/block/${blockId}`, {
        method: "DELETE",
        headers: { "X-Expert-Token": token },
      });
      setBlockedSlots(prev => prev.filter(b => b.id !== blockId));
    } catch (e) {
      console.error("Erreur déblocage:", e);
    }
  };

  const toggleDay = (dayKey: string) => setSchedule(prev => ({
    ...prev, [dayKey]: { ...prev[dayKey], enabled: !prev[dayKey].enabled },
  }));

  const updateTime = (dayKey: string, field: "start" | "end", value: string) => setSchedule(prev => ({
    ...prev, [dayKey]: { ...prev[dayKey], [field]: value },
  }));

  const enabledCount = Object.values(schedule).filter(d => d.enabled).length;
  const totalHours = Object.values(schedule).filter(d => d.enabled).reduce((acc, d) => {
    const [sh, sm] = d.start.split(":").map(Number);
    const [eh, em] = d.end.split(":").map(Number);
    return acc + ((eh * 60 + em) - (sh * 60 + sm)) / 60;
  }, 0);

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
              {enabledCount} jour{enabledCount !== 1 ? "s" : ""} actif{enabledCount !== 1 ? "s" : ""} · {totalHours}h par semaine
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowBlockModal(true)}
              className="flex items-center gap-2 px-5 py-3 border border-[#D4C5B9] text-[#1A1A1A] rounded-full text-sm hover:bg-[#F5F1ED] transition-colors">
              <BanIcon className="w-4 h-4 text-red-400" />
              Bloquer un créneau
            </button>
            <button onClick={handleSave} disabled={saving}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                saved ? "bg-green-500 text-white" : "bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]"
              } disabled:opacity-50`}>
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saving ? "Sauvegarde..." : saved ? "Sauvegardé !" : "Sauvegarder"}
            </button>
          </div>
        </motion.div>

        {/* Info banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#F5F1ED] border border-[#D4C5B9] rounded-2xl p-4">
          <button onClick={() => setShowInfo(!showInfo)} className="flex items-center justify-between w-full text-left">
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
              <p>• Utilisez "Bloquer un créneau" pour des absences ponctuelles (congés, formation, etc.).</p>
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
              <motion.div key={day.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={`bg-white rounded-2xl border transition-all ${
                  dayData.enabled ? "border-[#A68B6F]/40 shadow-sm" : "border-[#D4C5B9]"
                }`}>
                <div className="flex items-center gap-4 p-4">
                  <button onClick={() => toggleDay(day.key)}
                    className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
                      dayData.enabled ? "bg-[#A68B6F]" : "bg-[#D4C5B9]"
                    }`}>
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      dayData.enabled ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                  <span className={`w-24 text-sm font-medium flex-shrink-0 ${
                    dayData.enabled ? "text-[#1A1A1A]" : "text-[#1A1A1A]/40"
                  }`}>{day.label}</span>
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

        {/* Créneaux bloqués */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-[#D4C5B9] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider">
              Créneaux bloqués ({blockedSlots.length})
            </h3>
            <button onClick={() => setShowBlockModal(true)}
              className="flex items-center gap-1.5 text-xs text-[#A68B6F] hover:underline">
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
          </div>
          {blockedSlots.length === 0 ? (
            <p className="text-sm text-[#1A1A1A]/40 text-center py-4">Aucun créneau bloqué</p>
          ) : (
            <div className="space-y-2">
              {blockedSlots.map(block => (
                <div key={block.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {new Date(block.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                    <p className="text-xs text-[#1A1A1A]/60">{block.startTime} → {block.endTime}</p>
                    {block.reason && <p className="text-xs text-red-600 mt-0.5">{block.reason}</p>}
                  </div>
                  <button onClick={() => handleUnblock(block.id)}
                    className="p-2 hover:bg-red-100 rounded-full transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Résumé */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-[#D4C5B9] p-6">
          <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">Résumé hebdomadaire</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F5F1ED] rounded-xl p-4 text-center">
              <p className="text-2xl font-light text-[#A68B6F]">{enabledCount}</p>
              <p className="text-xs text-[#1A1A1A]/60 mt-1">Jours disponibles</p>
            </div>
            <div className="bg-[#F5F1ED] rounded-xl p-4 text-center">
              <p className="text-2xl font-light text-[#A68B6F]">{totalHours}h</p>
              <p className="text-xs text-[#1A1A1A]/60 mt-1">Créneaux / semaine</p>
            </div>
          </div>
        </motion.div>

        {/* Bouton sauvegarder bas */}
        <div className="flex justify-end pb-6">
          <button onClick={handleSave} disabled={saving}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium transition-all ${
              saved ? "bg-green-500 text-white" : "bg-[#1A1A1A] text-white hover:bg-[#2A2A2A]"
            } disabled:opacity-50`}>
            {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? "Sauvegarde..." : saved ? "Sauvegardé !" : "Sauvegarder les disponibilités"}
          </button>
        </div>
      </div>

      {/* Modal Bloquer un créneau */}
      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-[#1A1A1A]">Bloquer un créneau</h2>
                <button onClick={() => setShowBlockModal(false)} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                  <X className="w-5 h-5 text-[#1A1A1A]" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Date</label>
                  <input type="date" value={blockForm.date}
                    onChange={e => setBlockForm({ ...blockForm, date: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Début</label>
                    <input type="time" value={blockForm.startTime}
                      onChange={e => setBlockForm({ ...blockForm, startTime: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Fin</label>
                    <input type="time" value={blockForm.endTime}
                      onChange={e => setBlockForm({ ...blockForm, endTime: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Raison (optionnel)</label>
                  <input type="text" value={blockForm.reason}
                    onChange={e => setBlockForm({ ...blockForm, reason: e.target.value })}
                    placeholder="Ex: Congés, Formation, Réunion..."
                    className="w-full px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F] placeholder:text-[#1A1A1A]/40" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowBlockModal(false)}
                  className="flex-1 py-3 border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#F5F1ED] transition-colors">
                  Annuler
                </button>
                <button onClick={handleBlockSlot}
                  disabled={blocking || !blockForm.date || !blockForm.startTime || !blockForm.endTime}
                  className="flex-1 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {blocking ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <BanIcon className="w-4 h-4" />}
                  Bloquer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ExpertLayout>
  );
}

// Composant Save icon manquant dans lucide — on utilise Clock comme fallback
function Save({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  );
}
