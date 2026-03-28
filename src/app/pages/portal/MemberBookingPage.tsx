import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, Clock, Video, Phone, MapPin, ChevronLeft,
  ChevronRight, Check, Sparkles, User, AlertCircle, X,
} from "lucide-react";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import MemberHeader from "@/app/components/MemberHeader";

const API_BASE = "https://nvjcbmzhkfdhxlmqurjn.supabase.co/functions/v1/make-server-6378cc81";

// Expert démo — plus tard ce sera une liste dynamique
const DEMO_EXPERT = {
  id: "240c1151-d695-4425-bbb0-74182fdd6415",
  name: "Dr. Sarah Koné",
  specialty: "Psychiatre",
  hourly_rate_xof: 25000,
  hourly_rate_usd: 40,
};

type Step = "type" | "date" | "slot" | "confirm" | "done";
type ConsultType = "video" | "phone";

interface Slot { time: string; available: boolean; }

function getDaysInMonth(year: number, month: number) {
  const days = [];
  const firstDay = new Date(year, month, 1).getDay(); // 0=dim
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Ajuster pour commencer lundi
  const startPad = firstDay === 0 ? 6 : firstDay - 1;
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
  return days;
}

export default function MemberBookingPage() {
  const { user } = useMemberAuth();
  const token = localStorage.getItem("member_access_token") || localStorage.getItem("user_token");

  const [step, setStep] = useState<Step>("type");
  const [consultType, setConsultType] = useState<ConsultType>("video");
  const [reason, setReason] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const monthDays = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Charger les créneaux quand une date est sélectionnée
  useEffect(() => {
    if (!selectedDate) return;
    const load = async () => {
      setLoadingSlots(true);
      setSlots([]);
      setSelectedSlot(null);
      setError(null);
      try {
        const dateStr = selectedDate.toISOString().split("T")[0];
        const res = await fetch(
          `${API_BASE}/booking/experts/${DEMO_EXPERT.id}/available-slots?date=${dateStr}`,
          { headers: { "Content-Type": "application/json" } }
        );
        const json = await res.json();
        if (json.success) setSlots(json.data || []);
        else setError("Impossible de charger les créneaux");
      } catch {
        setError("Erreur réseau");
      } finally {
        setLoadingSlots(false);
      }
    };
    load();
  }, [selectedDate]);

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot || !token) return;
    setBooking(true);
    setError(null);
    try {
      const [h, m] = selectedSlot.split(":").map(Number);
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(h, m, 0, 0);

      const res = await fetch(`${API_BASE}/booking/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          expert_id: DEMO_EXPERT.id,
          scheduled_at: scheduledAt.toISOString(),
          duration_minutes: 60,
          type: consultType,
          reason,
          currency: "XOF",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setBookingResult(json.data);
        setStep("done");
      } else {
        setError(json.error || "Erreur lors de la réservation");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setBooking(false);
    }
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const isToday = (d: Date) => d.toDateString() === new Date().toDateString();
  const isPast = (d: Date) => d < today;
  const isSelected = (d: Date) => selectedDate?.toDateString() === d.toDateString();
  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

  const stepIndex = { type: 0, date: 1, slot: 2, confirm: 3, done: 4 };
  const steps = ["Type", "Date", "Créneau", "Confirmer"];

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <MemberHeader title="Réserver une consultation" showBack />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#A68B6F] to-[#8A7159] rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
          <div className="relative">
            <Sparkles className="w-8 h-8 mb-3" />
            <h1 className="text-2xl font-serif mb-2">Réserver une consultation</h1>
            <p className="text-white/80 text-sm">avec {DEMO_EXPERT.name} · {DEMO_EXPERT.specialty}</p>
          </div>
        </motion.div>

        {/* Stepper */}
        {step !== "done" && (
          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 transition-all ${
                  i < stepIndex[step] ? "bg-[#A68B6F] text-white" :
                  i === stepIndex[step] ? "bg-[#1A1A1A] text-white" :
                  "bg-[#D4C5B9] text-[#1A1A1A]/40"
                }`}>
                  {i < stepIndex[step] ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${i === stepIndex[step] ? "text-[#1A1A1A] font-medium" : "text-[#1A1A1A]/40"}`}>{s}</span>
                {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < stepIndex[step] ? "bg-[#A68B6F]" : "bg-[#D4C5B9]"}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4 text-red-400" /></button>
          </div>
        )}

        {/* ── ÉTAPE 1 : Type de consultation ── */}
        <AnimatePresence mode="wait">
          {step === "type" && (
            <motion.div key="type" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-6 border border-[#D4C5B9] space-y-4">
              <h2 className="text-xl font-serif text-[#1A1A1A]">Type de consultation</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([
                  { id: "video", label: "Vidéo", icon: <Video className="w-6 h-6" />, desc: "Consultation vidéo sécurisée" },
                  { id: "phone", label: "Téléphone", icon: <Phone className="w-6 h-6" />, desc: "Appel téléphonique" },
                  { id: "inperson", label: "Présentiel", icon: <MapPin className="w-6 h-6" />, desc: "En cabinet" },
                ] as const).map(t => (
                  <button key={t.id} onClick={() => setConsultType(t.id as ConsultType)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                      consultType === t.id ? "border-[#A68B6F] bg-[#F5F1ED]" : "border-[#D4C5B9] hover:border-[#A68B6F]/50"
                    }`}>
                    {consultType === t.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-[#A68B6F] rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <div className="text-[#A68B6F] mb-2">{t.icon}</div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{t.label}</p>
                    <p className="text-xs text-[#1A1A1A]/60 mt-1">{t.desc}</p>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Motif de la consultation</label>
                <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
                  placeholder="Décrivez brièvement la raison de votre consultation..."
                  className="w-full px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F] resize-none placeholder:text-[#1A1A1A]/40" />
              </div>

              <div className="bg-[#F5F1ED] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">Durée · 60 minutes</p>
                  <p className="text-xs text-[#1A1A1A]/60 mt-0.5">
                    {DEMO_EXPERT.hourly_rate_xof.toLocaleString("fr-FR")} XOF · {DEMO_EXPERT.hourly_rate_usd} USD
                  </p>
                </div>
                <button onClick={() => setStep("date")}
                  className="px-6 py-3 bg-[#1A1A1A] text-white rounded-full text-sm font-medium hover:bg-[#2A2A2A] transition-colors">
                  Suivant →
                </button>
              </div>
            </motion.div>
          )}

          {/* ── ÉTAPE 2 : Calendrier ── */}
          {step === "date" && (
            <motion.div key="date" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-6 border border-[#D4C5B9] space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif text-[#1A1A1A]">Choisissez une date</h2>
                <button onClick={() => setStep("type")} className="text-sm text-[#A68B6F] hover:underline">← Retour</button>
              </div>

              {/* Navigation mois */}
              <div className="flex items-center justify-between">
                <button onClick={prevMonth} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-base font-medium text-[#1A1A1A] capitalize">
                  {currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                </span>
                <button onClick={nextMonth} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 text-center">
                {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
                  <div key={i} className="py-2 text-xs font-medium text-[#1A1A1A]/40">{d}</div>
                ))}
              </div>

              {/* Grille calendrier */}
              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((date, i) => {
                  if (!date) return <div key={i} />;
                  const past = isPast(date);
                  const weekend = isWeekend(date);
                  const disabled = past || weekend;
                  return (
                    <button key={i} disabled={disabled}
                      onClick={() => { setSelectedDate(date); setStep("slot"); }}
                      className={`aspect-square rounded-xl text-sm transition-all flex items-center justify-center ${
                        isSelected(date) ? "bg-[#1A1A1A] text-white" :
                        isToday(date) ? "bg-[#A68B6F]/20 text-[#A68B6F] font-semibold" :
                        disabled ? "text-[#1A1A1A]/20 cursor-not-allowed" :
                        "hover:bg-[#F5F1ED] text-[#1A1A1A]"
                      }`}>
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-[#1A1A1A]/50 text-center">Les week-ends ne sont pas disponibles</p>
            </motion.div>
          )}

          {/* ── ÉTAPE 3 : Créneaux ── */}
          {step === "slot" && (
            <motion.div key="slot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-6 border border-[#D4C5B9] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif text-[#1A1A1A]">Choisissez un créneau</h2>
                  <p className="text-sm text-[#1A1A1A]/60 mt-1 capitalize">
                    {selectedDate?.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                </div>
                <button onClick={() => setStep("date")} className="text-sm text-[#A68B6F] hover:underline">← Retour</button>
              </div>

              {loadingSlots ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-[#A68B6F] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-[#1A1A1A]/20 mx-auto mb-3" />
                  <p className="text-sm text-[#1A1A1A]/60">Aucun créneau disponible ce jour</p>
                  <button onClick={() => setStep("date")} className="mt-4 text-sm text-[#A68B6F] hover:underline">
                    Choisir une autre date
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map(slot => (
                    <button key={slot.time} disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                      className={`py-3 rounded-xl text-sm font-medium transition-all ${
                        selectedSlot === slot.time ? "bg-[#1A1A1A] text-white" :
                        !slot.available ? "bg-[#F5F1ED] text-[#1A1A1A]/30 cursor-not-allowed line-through" :
                        "bg-[#F5F1ED] text-[#1A1A1A] hover:bg-[#A68B6F]/10 hover:text-[#A68B6F]"
                      }`}>
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}

              {selectedSlot && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between bg-[#F5F1ED] rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#A68B6F]" />
                    <span className="text-sm font-medium text-[#1A1A1A]">{selectedSlot} · 60 min</span>
                  </div>
                  <button onClick={() => setStep("confirm")}
                    className="px-6 py-2.5 bg-[#1A1A1A] text-white rounded-full text-sm font-medium hover:bg-[#2A2A2A] transition-colors">
                    Confirmer →
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── ÉTAPE 4 : Confirmation ── */}
          {step === "confirm" && (
            <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-6 border border-[#D4C5B9] space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-serif text-[#1A1A1A]">Récapitulatif</h2>
                <button onClick={() => setStep("slot")} className="text-sm text-[#A68B6F] hover:underline">← Retour</button>
              </div>

              <div className="bg-[#F5F1ED] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white font-medium">
                    SK
                  </div>
                  <div>
                    <p className="font-serif text-[#1A1A1A]">{DEMO_EXPERT.name}</p>
                    <p className="text-sm text-[#1A1A1A]/60">{DEMO_EXPERT.specialty}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-[#1A1A1A]/60 mb-1">Date</p>
                    <p className="font-medium text-[#1A1A1A] capitalize">
                      {selectedDate?.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-[#1A1A1A]/60 mb-1">Heure</p>
                    <p className="font-medium text-[#1A1A1A]">{selectedSlot} · 60 min</p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-[#1A1A1A]/60 mb-1">Type</p>
                    <p className="font-medium text-[#1A1A1A]">
                      {consultType === "video" ? "🎥 Vidéo" : consultType === "phone" ? "📞 Téléphone" : "📍 Présentiel"}
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-[#1A1A1A]/60 mb-1">Tarif</p>
                    <p className="font-medium text-[#1A1A1A]">{DEMO_EXPERT.hourly_rate_xof.toLocaleString("fr-FR")} XOF</p>
                  </div>
                </div>

                {reason && (
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-[#1A1A1A]/60 mb-1">Motif</p>
                    <p className="text-sm text-[#1A1A1A]">{reason}</p>
                  </div>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-800 space-y-1.5">
                <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" /><span>Confirmation par email après validation de l'expert</span></div>
                <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" /><span>Annulation possible jusqu'à 2h avant</span></div>
                <div className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" /><span>Lien vidéo envoyé à la confirmation</span></div>
              </div>

              <button onClick={handleBook} disabled={booking}
                className="w-full py-4 bg-[#1A1A1A] text-white rounded-full font-medium hover:bg-[#2A2A2A] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {booking ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Réservation en cours...</span></>
                ) : (
                  <><Calendar className="w-5 h-5" /><span>Confirmer la réservation</span></>
                )}
              </button>
            </motion.div>
          )}

          {/* ── ÉTAPE 5 : Succès ── */}
          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 border border-[#D4C5B9] text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-[#1A1A1A] mb-2">Demande envoyée !</h2>
                <p className="text-sm text-[#1A1A1A]/60">
                  Votre demande est en attente de confirmation par {DEMO_EXPERT.name}.
                  Vous recevrez une notification dès qu'elle sera acceptée.
                </p>
              </div>

              <div className="bg-[#F5F1ED] rounded-2xl p-5 text-left space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-[#A68B6F]" />
                  <span className="text-[#1A1A1A]">{DEMO_EXPERT.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-[#A68B6F]" />
                  <span className="text-[#1A1A1A] capitalize">
                    {selectedDate?.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })} à {selectedSlot}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-[#A68B6F]" />
                  <span className="text-[#1A1A1A]">En attente de confirmation</span>
                </div>
              </div>

              <div className="flex gap-3">
                <a href="/member/consultations"
                  className="flex-1 py-3 bg-[#1A1A1A] text-white rounded-full text-sm font-medium hover:bg-[#2A2A2A] transition-colors text-center">
                  Voir mes consultations
                </a>
                <a href="/member/dashboard"
                  className="flex-1 py-3 border border-[#D4C5B9] text-[#1A1A1A] rounded-full text-sm font-medium hover:bg-[#F5F1ED] transition-colors text-center">
                  Tableau de bord
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-20" />
      </main>
    </div>
  );
}
