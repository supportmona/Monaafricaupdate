import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Edit,
  Trash2,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const DAYS_OF_WEEK = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const DAYS_MAP: any = {
  Lundi: "monday",
  Mardi: "tuesday",
  Mercredi: "wednesday",
  Jeudi: "thursday",
  Vendredi: "friday",
  Samedi: "saturday",
  Dimanche: "sunday",
};

export default function ExpertCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState<any>({});
  const [blockedSlots, setBlockedSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [timeSlots, setTimeSlots] = useState([{ start: "09:00", end: "17:00" }]);
  const [blockForm, setBlockForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
  });

  useEffect(() => {
    loadCalendarData();
  }, []);

  const loadCalendarData = async () => {
    try {
      const token = localStorage.getItem("mona_expert_token");
      if (!token) return;

      // Get schedule
      const scheduleRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/availability/schedule`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token,
          },
        }
      );

      if (scheduleRes.ok) {
        const data = await scheduleRes.json();
        setSchedule(data.data.schedule || {});
      }

      // Get blocked slots
      const blocksRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/availability/blocks`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token,
          },
        }
      );

      if (blocksRes.ok) {
        const data = await blocksRes.json();
        setBlockedSlots(data.data || []);
      }
    } catch (error) {
      console.error("Erreur chargement calendrier:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      const token = localStorage.getItem("mona_expert_token");
      
      const newSchedule = { ...schedule };
      newSchedule[DAYS_MAP[selectedDay]] = timeSlots;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/availability/schedule`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token!,
          },
          body: JSON.stringify({ schedule: newSchedule }),
        }
      );

      if (response.ok) {
        setSchedule(newSchedule);
        setShowScheduleModal(false);
        alert("Horaires enregistrés");
      }
    } catch (error) {
      console.error("Erreur sauvegarde horaires:", error);
      alert("Une erreur est survenue");
    }
  };

  const handleBlockSlot = async () => {
    try {
      const token = localStorage.getItem("mona_expert_token");

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/availability/block`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token!,
          },
          body: JSON.stringify(blockForm),
        }
      );

      if (response.ok) {
        loadCalendarData();
        setShowBlockModal(false);
        setBlockForm({ date: "", startTime: "", endTime: "", reason: "" });
        alert("Créneau bloqué");
      }
    } catch (error) {
      console.error("Erreur blocage créneau:", error);
      alert("Une erreur est survenue");
    }
  };

  const handleUnblock = async (blockId: string) => {
    if (!confirm("Débloquer ce créneau ?")) return;

    try {
      const token = localStorage.getItem("mona_expert_token");

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/availability/block/${blockId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token!,
          },
        }
      );

      if (response.ok) {
        setBlockedSlots(blockedSlots.filter((b) => b.id !== blockId));
        alert("Créneau débloqué");
      }
    } catch (error) {
      console.error("Erreur déblocage:", error);
      alert("Une erreur est survenue");
    }
  };

  const openScheduleModal = (day: string) => {
    setSelectedDay(day);
    const dayKey = DAYS_MAP[day];
    setTimeSlots(schedule[dayKey] || [{ start: "09:00", end: "17:00" }]);
    setShowScheduleModal(true);
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { start: "09:00", end: "17:00" }]);
  };

  const removeTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const updateTimeSlot = (index: number, field: string, value: string) => {
    const newSlots = [...timeSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    setTimeSlots(newSlots);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startPadding = (firstDay.getDay() + 6) % 7; // Monday = 0

    // Add padding
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Add days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateBlocked = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return blockedSlots.some((block) => block.date === dateStr);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#A68B6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1A1A1A]/60">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/expert/dashboard"
                className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#1A1A1A]/60" />
              </Link>
              <div>
                <h1 className="text-2xl font-serif text-[#1A1A1A]">
                  Mon calendrier
                </h1>
                <p className="text-sm text-[#1A1A1A]/60 mt-1">
                  Gérez vos disponibilités
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBlockModal(true)}
              className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-full hover:bg-[#2A2A2A] transition-colors"
            >
              <Clock className="w-4 h-4" />
              Bloquer un créneau
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Schedule */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
            >
              <h2 className="text-lg font-serif text-[#1A1A1A] mb-4">
                Horaires hebdomadaires
              </h2>
              <div className="space-y-3">
                {DAYS_OF_WEEK.map((day) => {
                  const dayKey = DAYS_MAP[day];
                  const daySchedule = schedule[dayKey] || [];
                  
                  return (
                    <button
                      key={day}
                      onClick={() => openScheduleModal(day)}
                      className="w-full text-left p-3 hover:bg-[#F5F1ED] rounded-xl transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1A1A1A]">
                          {day}
                        </span>
                        <div className="flex items-center gap-2">
                          {daySchedule.length === 0 ? (
                            <span className="text-xs text-[#1A1A1A]/40">
                              Fermé
                            </span>
                          ) : (
                            <span className="text-xs text-[#A68B6F]">
                              {daySchedule.length} créneau{daySchedule.length > 1 ? "x" : ""}
                            </span>
                          )}
                          <Edit className="w-4 h-4 text-[#1A1A1A]/40 group-hover:text-[#A68B6F] transition-colors" />
                        </div>
                      </div>
                      {daySchedule.length > 0 && (
                        <div className="mt-1 text-xs text-[#1A1A1A]/60">
                          {daySchedule.map((slot: any, i: number) => (
                            <span key={i}>
                              {slot.start} - {slot.end}
                              {i < daySchedule.length - 1 && ", "}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Blocked Slots */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-[#D4C5B9] mt-6"
            >
              <h2 className="text-lg font-serif text-[#1A1A1A] mb-4">
                Créneaux bloqués
              </h2>
              {blockedSlots.length === 0 ? (
                <p className="text-sm text-[#1A1A1A]/60 text-center py-4">
                  Aucun créneau bloqué
                </p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {blockedSlots.map((block) => (
                    <div
                      key={block.id}
                      className="p-3 bg-red-50 rounded-xl border border-red-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1A1A1A]">
                            {new Date(block.date).toLocaleDateString("fr-FR")}
                          </p>
                          <p className="text-xs text-[#1A1A1A]/60 mt-1">
                            {block.startTime} - {block.endTime}
                          </p>
                          {block.reason && (
                            <p className="text-xs text-[#1A1A1A]/80 mt-1">
                              {block.reason}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleUnblock(block.id)}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Monthly Calendar */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-[#1A1A1A]">
                  {currentDate.toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-[#1A1A1A]/60" />
                  </button>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-[#1A1A1A]/60" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {["L", "M", "M", "J", "V", "S", "D"].map((day, i) => (
                  <div
                    key={i}
                    className="text-center text-xs font-semibold text-[#1A1A1A]/60 py-2"
                  >
                    {day}
                  </div>
                ))}

                {/* Calendar days */}
                {getDaysInMonth().map((date, i) => {
                  if (!date) {
                    return <div key={`empty-${i}`} className="aspect-square" />;
                  }

                  const isToday = date.toDateString() === new Date().toDateString();
                  const isBlocked = isDateBlocked(date);
                  const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                  return (
                    <div
                      key={i}
                      className={`aspect-square p-1 rounded-lg border transition-colors ${
                        isToday
                          ? "border-[#A68B6F] bg-[#A68B6F]/10"
                          : isBlocked
                          ? "border-red-200 bg-red-50"
                          : isPast
                          ? "border-[#D4C5B9] bg-[#F5F1ED]/50"
                          : "border-[#D4C5B9] hover:bg-[#F5F1ED]"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span
                          className={`text-sm ${
                            isToday
                              ? "font-bold text-[#A68B6F]"
                              : isPast
                              ? "text-[#1A1A1A]/30"
                              : "text-[#1A1A1A]"
                          }`}
                        >
                          {date.getDate()}
                        </span>
                        {isBlocked && (
                          <X className="w-3 h-3 text-red-500 mt-1" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-[#1A1A1A]">
                Horaires du {selectedDay}
              </h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#1A1A1A]/60" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-[#F5F1ED] rounded-xl"
                >
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[#1A1A1A]/60 mb-1">
                        Début
                      </label>
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) =>
                          updateTimeSlot(index, "start", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-[#D4C5B9] rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-[#1A1A1A]/60 mb-1">
                        Fin
                      </label>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) =>
                          updateTimeSlot(index, "end", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-[#D4C5B9] rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  {timeSlots.length > 1 && (
                    <button
                      onClick={() => removeTimeSlot(index)}
                      className="p-2 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addTimeSlot}
              className="w-full mb-6 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#D4C5B9] rounded-xl hover:border-[#A68B6F] hover:bg-[#F5F1ED] transition-colors text-sm text-[#1A1A1A]/60"
            >
              <Plus className="w-4 h-4" />
              Ajouter un créneau
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 py-3 border border-[#D4C5B9] rounded-full hover:bg-[#F5F1ED] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveSchedule}
                className="flex-1 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Enregistrer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-[#1A1A1A]">
                Bloquer un créneau
              </h2>
              <button
                onClick={() => setShowBlockModal(false)}
                className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#1A1A1A]/60" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={blockForm.date}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    Début
                  </label>
                  <input
                    type="time"
                    value={blockForm.startTime}
                    onChange={(e) =>
                      setBlockForm({ ...blockForm, startTime: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    Fin
                  </label>
                  <input
                    type="time"
                    value={blockForm.endTime}
                    onChange={(e) =>
                      setBlockForm({ ...blockForm, endTime: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Raison (optionnel)
                </label>
                <input
                  type="text"
                  value={blockForm.reason}
                  onChange={(e) =>
                    setBlockForm({ ...blockForm, reason: e.target.value })
                  }
                  placeholder="Ex: Congés, Formation..."
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBlockModal(false)}
                className="flex-1 py-3 border border-[#D4C5B9] rounded-full hover:bg-[#F5F1ED] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleBlockSlot}
                disabled={
                  !blockForm.date ||
                  !blockForm.startTime ||
                  !blockForm.endTime
                }
                className="flex-1 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Bloquer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
