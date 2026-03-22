import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { Calendar, Clock, Video, Phone, MessageSquare, Plus, Filter, Search, CheckCircle2, XCircle, AlertCircle, Loader2, Info, Activity, FileText, BookOpen } from "lucide-react";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";

type ConsultationStatus = "scheduled" | "completed" | "cancelled";
type ConsultationType = "online" | "in-person";

interface Consultation {
  id: string;
  expertId: string;
  expertName?: string;
  date: string;
  time: string;
  consultationType: ConsultationType;
  status: ConsultationStatus;
  memberName?: string;
  memberEmail?: string;
  memberPhone?: string;
  reason?: string;
}

export default function MemberConsultationsPage() {
  const { user } = useMemberAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | ConsultationStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const token = localStorage.getItem("mona_member_token");
      if (!token) {
        setLoading(false);
        return;
      }

      console.log("🔑 Consultations - Token:", token ? `${token.substring(0, 20)}...` : "AUCUN");
      console.log("🔑 Consultations - publicAnonKey:", publicAnonKey ? `${publicAnonKey.substring(0, 20)}...` : "AUCUN");

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/consultations`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setConsultations(data.data || []);
      }
    } catch (error) {
      console.error("Erreur chargement consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const matchesFilter = filter === "all" || consultation.status === filter;
    const matchesSearch = 
      (consultation.expertName?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (consultation.reason?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const upcomingConsultations = consultations.filter(c => c.status === "scheduled");
  const completedConsultations = consultations.filter(c => c.status === "completed");
  const cancelledConsultations = consultations.filter(c => c.status === "cancelled");

  const getStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            À venir
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Complétée
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" />
            Annulée
          </span>
        );
    }
  };

  const getTypeIcon = (type: ConsultationType) => {
    if (type === "online") {
      return <Video className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
    return <Phone className="w-4 h-4 sm:w-5 sm:h-5" />;
  };

  const getInitials = (name?: string) => {
    if (!name) return "EX";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#A68B6F] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link 
                to="/member/dashboard" 
                className="text-xs sm:text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] mb-2 inline-block"
              >
                ← Retour au tableau de bord
              </Link>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#1A1A1A]">
                Mes <span className="font-serif italic">Consultations</span>
              </h1>
              <p className="text-sm sm:text-base text-[#1A1A1A]/60 mt-1">
                Gérez vos rendez-vous avec nos experts
              </p>
            </div>
            <Link
              to="/member/booking"
              className="bg-[#1A1A1A] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-medium text-sm sm:text-base hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Nouvelle consultation
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pb-24">
        
        {/* Bandeau d'information */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 mb-6"
        >
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-900">
              <strong>Vos consultations personnelles.</strong> Seules vos consultations sont affichées ici. 
              Réservez votre première consultation pour commencer votre suivi avec nos experts.
            </p>
            <Link 
              to="/member/test-consultation"
              className="inline-block mt-2 text-sm text-blue-700 hover:text-blue-900 underline font-medium"
            >
              Ou créer une consultation de test →
            </Link>
          </div>
        </motion.div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-[#D4C5B9] rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-[#1A1A1A]/60">À venir</p>
                <p className="text-2xl font-light text-[#1A1A1A]">{upcomingConsultations.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-[#D4C5B9] rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-[#1A1A1A]/60">Complétées</p>
                <p className="text-2xl font-light text-[#1A1A1A]">{completedConsultations.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-[#D4C5B9] rounded-2xl p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#A68B6F]/10 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#A68B6F]" />
              </div>
              <div>
                <p className="text-xs text-[#1A1A1A]/60">Total</p>
                <p className="text-2xl font-light text-[#1A1A1A]">{consultations.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recherche et filtres */}
        {consultations.length > 0 && (
          <div className="bg-white border border-[#D4C5B9] rounded-2xl p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Barre de recherche */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                <input
                  type="text"
                  placeholder="Rechercher par expert ou motif..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F1ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                />
              </div>

              {/* Filtres */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "all"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#F5F1ED] text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilter("scheduled")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "scheduled"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#F5F1ED] text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  À venir
                </button>
                <button
                  onClick={() => setFilter("completed")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "completed"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#F5F1ED] text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  Complétées
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liste des consultations */}
        {filteredConsultations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#D4C5B9] rounded-3xl p-8 sm:p-12 text-center"
          >
            <div className="w-20 h-20 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-[#1A1A1A]/40" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-[#1A1A1A] mb-2">
              Aucune consultation
            </h3>
            <p className="text-sm sm:text-base text-[#1A1A1A]/60 mb-6 max-w-md mx-auto">
              {consultations.length === 0 
                ? "Vous n'avez pas encore de consultation programmée. Réservez votre première consultation avec un de nos experts."
                : "Aucune consultation ne correspond à vos critères de recherche."}
            </p>
            {consultations.length === 0 && (
              <Link
                to="/member/booking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Réserver une consultation
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredConsultations.map((consultation, index) => (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-[#D4C5B9] rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Avatar expert */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white font-medium text-lg flex-shrink-0">
                    {getInitials(consultation.expertName)}
                  </div>

                  {/* Informations */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-base sm:text-lg font-medium text-[#1A1A1A] mb-1">
                          {consultation.expertName || "Expert"}
                        </h3>
                        {consultation.reason && (
                          <p className="text-sm text-[#1A1A1A]/60 mb-2">
                            {consultation.reason}
                          </p>
                        )}
                      </div>
                      {getStatusBadge(consultation.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#1A1A1A]/80">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(consultation.date).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{consultation.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(consultation.consultationType)}
                        <span className="capitalize">
                          {consultation.consultationType === "online" ? "Vidéo" : "Présentiel"}
                        </span>
                      </div>
                    </div>

                    {consultation.status === "scheduled" && (
                      <div className="mt-4 flex gap-2">
                        {consultation.consultationType === "online" ? (
                          <Link
                            to={`/member/consultation-room/${consultation.id}`}
                            className="px-4 sm:px-6 py-2.5 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-all text-sm font-medium inline-flex items-center gap-2"
                          >
                            <Video className="w-4 h-4" />
                            Rejoindre la consultation
                          </Link>
                        ) : (
                          <button className="px-4 sm:px-6 py-2.5 bg-[#F5F0EB] text-[#1A1A1A] rounded-full hover:bg-[#D4C5B9] transition-all text-sm font-medium">
                            Voir les détails
                          </button>
                        )}
                        <button className="px-4 py-2.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors text-sm font-medium">
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Navigation PWA Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] safe-area-inset-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              to="/member/dashboard"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs">Accueil</span>
            </Link>
            <Link
              to="/member/consultations"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]"
            >
              <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium">Consultations</span>
            </Link>
            <Link
              to="/member/health-passport"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs">Passeport</span>
            </Link>
            <Link
              to="/member/resources"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs">Ressources</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}