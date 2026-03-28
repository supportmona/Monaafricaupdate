import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ExpertLayout from "@/app/components/ExpertLayout";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  Video,
  MapPin,
  Phone,
  Mail,
  X,
  Edit,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  duration: number;
  type: "video" | "inperson" | "phone";
  status: "confirmed" | "pending" | "cancelled" | "completed";
  reason: string;
  notes?: string;
}

export default function ExpertAgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("week");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");

  // ✅ Agenda vide — les vrais RDV viendront de l'API booking
  const [appointments] = useState<Appointment[]>([]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const getWeekDays = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const monthDays = getDaysInMonth(currentDate);
  const weekDays = getWeekDays(new Date(currentDate));

  const getAppointmentsForDay = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((apt) => {
      return apt.date === dateStr && (filterType === "all" || apt.type === filterType);
    });
  };

  const previousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const previousWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 7); setCurrentDate(d); };
  const nextWeek = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 7); setCurrentDate(d); };
  const goToday = () => setCurrentDate(new Date());

  const getTypeColor = (type: string) => ({
    video: "bg-blue-100 text-blue-700 border-blue-200",
    inperson: "bg-green-100 text-green-700 border-green-200",
    phone: "bg-purple-100 text-purple-700 border-purple-200",
  }[type] || "bg-gray-100 text-gray-700 border-gray-200");

  const getTypeIcon = (type: string) => ({
    video: <Video className="w-4 h-4" />,
    inperson: <MapPin className="w-4 h-4" />,
    phone: <Phone className="w-4 h-4" />,
  }[type] || <Calendar className="w-4 h-4" />);

  const getTypeLabel = (type: string) => ({
    video: "Visio", inperson: "Présentiel", phone: "Téléphone",
  }[type] || type);

  const getStatusColor = (status: string) => ({
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-gray-100 text-gray-700",
  }[status] || "bg-gray-100 text-gray-700");

  const getStatusLabel = (status: string) => ({
    confirmed: "Confirmé", pending: "En attente",
    cancelled: "Annulé", completed: "Terminé",
  }[status] || status);

  const isToday = (date: Date | null) => {
    if (!date) return false;
    const t = new Date();
    return date.getDate() === t.getDate() && date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear();
  };

  const isSameMonth = (date: Date | null) => date ? date.getMonth() === currentDate.getMonth() : false;

  const EmptyDay = () => (
    <div className="flex flex-col items-center justify-center h-full py-8 text-center">
      <Clock className="w-8 h-8 text-[#1A1A1A]/20 mx-auto mb-2" />
      <p className="text-xs text-[#1A1A1A]/40">Aucun RDV</p>
    </div>
  );

  return (
    <ExpertLayout title="Agenda">
      <div className="p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Calendar className="w-6 h-6 text-blue-600" />, bg: "bg-blue-100", value: appointments.filter(a => a.date === new Date().toISOString().split("T")[0]).length, label: "Aujourd'hui" },
            { icon: <Check className="w-6 h-6 text-green-600" />, bg: "bg-green-100", value: appointments.filter(a => a.status === "confirmed").length, label: "Confirmés" },
            { icon: <AlertCircle className="w-6 h-6 text-yellow-600" />, bg: "bg-yellow-100", value: appointments.filter(a => a.status === "pending").length, label: "En attente" },
            { icon: <Video className="w-6 h-6 text-purple-600" />, bg: "bg-purple-100", value: appointments.filter(a => a.type === "video").length, label: "Visioconférences" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-[#D4C5B9]">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.bg} rounded-full flex items-center justify-center`}>{stat.icon}</div>
                <div>
                  <p className="text-2xl font-light text-[#1A1A1A]">{stat.value}</p>
                  <p className="text-sm text-[#1A1A1A]/60">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-[#D4C5B9]">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={viewMode === "month" ? previousMonth : previousWeek} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <h2 className="text-lg font-serif text-[#1A1A1A] min-w-[200px] text-center">
                {currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
              </h2>
              <button onClick={viewMode === "month" ? nextMonth : nextWeek} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <button onClick={goToday} className="px-4 py-2 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-sm text-[#1A1A1A] hover:bg-[#E8E0D8] transition-colors">
                Aujourd'hui
              </button>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="inline-flex items-center bg-[#F5F1ED] rounded-full p-1 border border-[#D4C5B9]">
                {(["day", "week", "month"] as const).map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${viewMode === mode ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"}`}>
                    {mode === "day" ? "Jour" : mode === "week" ? "Semaine" : "Mois"}
                  </button>
                ))}
              </div>
              <select value={filterType} onChange={e => setFilterType(e.target.value)}
                className="px-4 py-2 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]">
                <option value="all">Tous les types</option>
                <option value="video">Visioconférence</option>
                <option value="inperson">Présentiel</option>
                <option value="phone">Téléphone</option>
              </select>
              <button onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-2 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Nouveau RDV</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Vue Semaine */}
        {viewMode === "week" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl border border-[#D4C5B9] overflow-hidden">
            <div className="grid grid-cols-7 border-b border-[#D4C5B9]">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, index) => {
                const date = weekDays[index];
                const todayCheck = isToday(date);
                return (
                  <div key={day} className={`p-4 text-center border-r border-[#D4C5B9] last:border-r-0 ${todayCheck ? "bg-[#A68B6F]/10" : ""}`}>
                    <p className="text-xs text-[#1A1A1A]/60 mb-1">{day}</p>
                    <p className={`text-lg font-light ${todayCheck ? "text-[#A68B6F] font-semibold" : "text-[#1A1A1A]"}`}>{date.getDate()}</p>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-7">
              {weekDays.map((date, index) => {
                const dayApts = getAppointmentsForDay(date);
                return (
                  <div key={index} className={`min-h-[300px] p-3 border-r border-[#D4C5B9] last:border-r-0 ${isToday(date) ? "bg-[#F5F1ED]/50" : ""}`}>
                    {dayApts.length === 0 ? null : (
                      <div className="space-y-2">
                        {dayApts.map(apt => (
                          <button key={apt.id} onClick={() => setSelectedAppointment(apt)}
                            className={`w-full text-left p-3 rounded-xl border transition-all hover:shadow-md ${getTypeColor(apt.type)}`}>
                            <div className="flex items-center gap-2 mb-1">{getTypeIcon(apt.type)}<span className="text-xs font-semibold">{apt.time}</span></div>
                            <p className="text-sm font-medium line-clamp-1">{apt.patientName}</p>
                            <p className="text-xs opacity-80 line-clamp-1">{apt.reason}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Vue Mois */}
        {viewMode === "month" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl border border-[#D4C5B9] overflow-hidden">
            <div className="grid grid-cols-7 border-b border-[#D4C5B9]">
              {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map(day => (
                <div key={day} className="p-4 text-center border-r border-[#D4C5B9] last:border-r-0">
                  <p className="text-sm font-medium text-[#1A1A1A]/60">{day}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {monthDays.map((date, index) => {
                const dayApts = date ? getAppointmentsForDay(date) : [];
                const todayCheck = date ? isToday(date) : false;
                const sameMonth = date ? isSameMonth(date) : false;
                return (
                  <div key={index} className={`min-h-[120px] p-2 border-r border-b border-[#D4C5B9] ${todayCheck ? "bg-[#A68B6F]/10" : ""} ${!sameMonth ? "bg-[#F5F1ED]/30" : ""}`}>
                    {date && (
                      <>
                        <p className={`text-sm mb-2 ${todayCheck ? "text-[#A68B6F] font-semibold" : sameMonth ? "text-[#1A1A1A]" : "text-[#1A1A1A]/40"}`}>{date.getDate()}</p>
                        <div className="space-y-1">
                          {dayApts.slice(0, 2).map(apt => (
                            <button key={apt.id} onClick={() => setSelectedAppointment(apt)}
                              className={`w-full text-left px-2 py-1 rounded text-xs truncate ${getTypeColor(apt.type)}`}>
                              {apt.time} - {apt.patientName}
                            </button>
                          ))}
                          {dayApts.length > 2 && <p className="text-xs text-[#A68B6F] font-medium px-2">+{dayApts.length - 2}</p>}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Vue Jour */}
        {viewMode === "day" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl border border-[#D4C5B9] p-6">
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">
              {currentDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </h3>
            {getAppointmentsForDay(currentDate).length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-[#1A1A1A]/40" />
                </div>
                <p className="text-sm text-[#1A1A1A]/60">Aucun rendez-vous ce jour</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getAppointmentsForDay(currentDate).map(apt => (
                  <button key={apt.id} onClick={() => setSelectedAppointment(apt)}
                    className={`w-full text-left p-6 rounded-2xl border transition-all hover:shadow-lg ${getTypeColor(apt.type)}`}>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center">{getTypeIcon(apt.type)}</div>
                        <div><p className="font-semibold text-lg">{apt.time}</p><p className="text-sm opacity-80">{apt.duration} minutes</p></div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>{getStatusLabel(apt.status)}</span>
                    </div>
                    <h4 className="text-xl font-serif mb-2">{apt.patientName}</h4>
                    <p className="text-sm mb-3">{apt.reason}</p>
                    {apt.notes && <div className="pt-3 border-t border-current/20"><p className="text-sm opacity-80">{apt.notes}</p></div>}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modal détails RDV */}
      <AnimatePresence>
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-[#D4C5B9] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${getTypeColor(selectedAppointment.type)} rounded-xl flex items-center justify-center`}>{getTypeIcon(selectedAppointment.type)}</div>
                  <div><h2 className="text-xl font-serif text-[#1A1A1A]">Détails du rendez-vous</h2><p className="text-sm text-[#1A1A1A]/60">{getTypeLabel(selectedAppointment.type)}</p></div>
                </div>
                <button onClick={() => setSelectedAppointment(null)} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"><X className="w-5 h-5 text-[#1A1A1A]" /></button>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-[#F5F1ED] rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-3"><User className="w-5 h-5 text-[#A68B6F]" /><span className="text-base text-[#1A1A1A]">{selectedAppointment.patientName}</span></div>
                  <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-[#A68B6F]" /><span className="text-sm">{selectedAppointment.patientEmail}</span></div>
                  <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-[#A68B6F]" /><span className="text-sm">{selectedAppointment.patientPhone}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-[#D4C5B9] rounded-2xl p-4"><p className="text-xs text-[#1A1A1A]/60 mb-1">Date</p><p className="text-sm font-medium">{new Date(selectedAppointment.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p></div>
                  <div className="bg-white border border-[#D4C5B9] rounded-2xl p-4"><p className="text-xs text-[#1A1A1A]/60 mb-1">Heure</p><p className="text-sm font-medium">{selectedAppointment.time}</p></div>
                  <div className="bg-white border border-[#D4C5B9] rounded-2xl p-4"><p className="text-xs text-[#1A1A1A]/60 mb-1">Durée</p><p className="text-sm font-medium">{selectedAppointment.duration} min</p></div>
                  <div className="bg-white border border-[#D4C5B9] rounded-2xl p-4"><p className="text-xs text-[#1A1A1A]/60 mb-1">Statut</p><span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedAppointment.status)}`}>{getStatusLabel(selectedAppointment.status)}</span></div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4"><p className="text-sm text-blue-900">{selectedAppointment.reason}</p></div>
                {selectedAppointment.notes && <div className="bg-[#F5F1ED] rounded-2xl p-4"><p className="text-sm text-[#1A1A1A]">{selectedAppointment.notes}</p></div>}
                <div className="pt-4 flex gap-3">
                  {selectedAppointment.type === "video" && selectedAppointment.status === "confirmed" && (
                    <a href={`/expert/consultation-room/${selectedAppointment.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors">
                      <Video className="w-4 h-4" /><span className="text-sm font-medium">Démarrer</span>
                    </a>
                  )}
                  <button className="flex items-center gap-2 px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full hover:bg-[#E8E0D8] transition-colors">
                    <Edit className="w-4 h-4" /><span className="text-sm">Modifier</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-full hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal créer RDV */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full">
              <div className="p-6 border-b border-[#D4C5B9] flex items-center justify-between">
                <h2 className="text-2xl font-serif text-[#1A1A1A]">Nouveau rendez-vous</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"><X className="w-5 h-5 text-[#1A1A1A]" /></button>
              </div>
              <div className="p-6 text-center py-12">
                <div className="w-20 h-20 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-10 h-10 text-[#A68B6F]" />
                </div>
                <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">Planification de rendez-vous</h3>
                <p className="text-sm text-[#1A1A1A]/60 mb-6">Intégration Cal.com disponible pour la gestion des rendez-vous</p>
                <button onClick={() => setShowCreateModal(false)} className="px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors">Fermer</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ExpertLayout>
  );
}
