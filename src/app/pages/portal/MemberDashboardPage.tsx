import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Calendar,
  Clock,
  Video,
  Heart,
  Activity,
  Target,
  BookOpen,
  MessageCircle,
  Zap,
  ArrowRight,
  Loader2,
  FileText,
  Award,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useConsultationReminders } from "@/app/hooks/useConsultationReminders";
import MemberHeader from "@/app/components/MemberHeader";

export default function MemberDashboardPage() {
  const { user } = useMemberAuth();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [currency, setCurrency] = useState<"XOF" | "USD">("XOF");
  const [showStudentPlans, setShowStudentPlans] = useState(false);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [showQuizPrompt, setShowQuizPrompt] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Activer les rappels automatiques pour les consultations
  useConsultationReminders(consultations);

  // Articles recommandés (3 articles gratuits de la bibliothèque)
  const recommendations = [
    {
      id: "comprendre-anxiete",
      category: "articles",
      title: "Comprendre l'anxiété : guide complet",
      description: "Un guide approfondi pour comprendre les mécanismes de l'anxiété et les stratégies pour la gérer au quotidien.",
      duration: "15 min de lecture",
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800",
      tags: ["Anxiété", "Gestion du stress", "Bien-être"],
      author: "M.O.N.A",
      type: "Gratuit"
    },
    {
      id: "meditation-debutants",
      category: "videos",
      title: "Méditation guidée pour débutants",
      description: "Initiez-vous à la méditation avec cette session guidée de 10 minutes, parfaite pour les débutants.",
      duration: "10 min",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
      tags: ["Méditation", "Relaxation", "Mindfulness"],
      author: "M.O.N.A",
      type: "Gratuit"
    },
    {
      id: "sommeil-sante-mentale",
      category: "articles",
      title: "Les bienfaits du sommeil sur la santé mentale",
      description: "Découvrez comment un sommeil de qualité peut transformer votre bien-être mental et émotionnel.",
      duration: "8 min de lecture",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800",
      tags: ["Sommeil", "Santé mentale", "Routines"],
      author: "M.O.N.A",
      type: "Gratuit"
    }
  ];

  useEffect(() => {
    loadConsultations();
    checkQuizCompletion();
  }, []);

  const loadConsultations = async () => {
    try {
      setError(null);

      const token = localStorage.getItem("mona_member_token");
      if (!token) {
        setLoading(false);
        return;
      }

      console.log("🔑 Dashboard - Token:", token ? `${token.substring(0, 20)}...` : "AUCUN");
      console.log("🔑 Dashboard - publicAnonKey:", publicAnonKey ? `${publicAnonKey.substring(0, 20)}...` : "AUCUN");
      console.log("🌐 Dashboard - URL:", `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/consultations`);

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
        setRetryCount(0); // Reset retry count on success
      } else if (response.status === 401) {
        // Token invalide ou expiré - ne pas afficher d'erreur, juste arrêter
        console.log("Token JWT invalide ou expiré");
        setConsultations([]);
      } else if (response.status >= 500) {
        // Erreur serveur - afficher message d'erreur
        setError("Service temporairement indisponible. Veuillez réessayer plus tard.");
      } else {
        setError("Impossible de charger vos consultations. Veuillez rafraîchir la page.");
      }
    } catch (error) {
      console.error("Erreur chargement consultations:", error);
      setError("Problème de connexion. Vérifiez votre connexion internet et réessayez.");
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  const checkQuizCompletion = async () => {
    try {
      const token = localStorage.getItem("mona_member_token");
      if (!token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/quiz-status`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setHasCompletedQuiz(data.completed || false);
        setShowQuizPrompt(!data.completed);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du quiz:", error);
    }
  };

  // Calcul des statistiques à partir des consultations réelles
  const now = new Date();
  const upcomingConsultations = consultations.filter(
    (c) => c.status === "scheduled" && new Date(c.date) > now
  );
  const completedConsultations = consultations.filter(
    (c) => c.status === "completed"
  );
  const nextAppointment = upcomingConsultations.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )[0];

  // Activité récente basée sur les consultations complétées
  const recentActivity = completedConsultations
    .slice(0, 3)
    .map((consultation) => ({
      type: "consultation",
      label: `Consultation avec ${consultation.expertName || "un expert"}`,
      date: formatRelativeDate(consultation.date),
      icon: Video,
    }));

  // Obtenir les initiales du nom
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  function formatRelativeDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Aujourd'hui";
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `${diffInDays} jours`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semaines`;
    return `${Math.floor(diffInDays / 30)} mois`;
  }

  // Mapper les noms d'icônes aux composants Lucide
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      Heart,
      Target,
      Activity,
      Zap,
      BookOpen,
      MessageCircle,
    };
    return iconMap[iconName] || Heart;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#A68B6F] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-serif text-[#1A1A1A] mb-2">
            Erreur de chargement
          </h2>
          <p className="text-[#1A1A1A]/60 mb-6">
            {error}
          </p>
          <button
            onClick={() => {
              setRetryCount(0);
              loadConsultations();
            }}
            className="bg-[#A68B6F] text-white rounded-full px-6 py-3 font-medium hover:bg-[#8B7355] transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header avec barre de navigation PWA */}
      <MemberHeader title={`Bonjour, ${user?.name.split(" ")[0] || "Membre"}`} />

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Score Mental - Carte Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            ></div>
          </div>

          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                  BIENVENUE SUR M.O.N.A
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif mb-2">
                  {user?.name || "Membre"}
                </h2>
                <p className="text-white/70 text-sm">
                  Membre depuis {user?.memberSince || "aujourd'hui"}
                </p>
              </div>
              <div className="text-right">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] flex items-center justify-center mb-2">
                  <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grille Stats */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-[#F5F1ED] rounded-full flex items-center justify-center mb-2">
                <Video className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <p className="text-2xl font-light text-[#1A1A1A] mb-1">
                {consultations.length}
              </p>
              <p className="text-xs text-[#1A1A1A]/60">Consultations</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-[#F5F1ED] rounded-full flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <p className="text-2xl font-light text-[#1A1A1A] mb-1">
                {upcomingConsultations.length}
              </p>
              <p className="text-xs text-[#1A1A1A]/60">À venir</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-[#F5F1ED] rounded-full flex items-center justify-center mb-2">
                <Activity className="w-5 h-5 text-[#1A1A1A]" />
              </div>
              <p className="text-2xl font-light text-[#1A1A1A] mb-1">
                {completedConsultations.length}
              </p>
              <p className="text-xs text-[#1A1A1A]/60">Complétées</p>
            </div>
          </motion.div>
        </div>

        {/* Quiz de Matching Prompt */}
        {!hasCompletedQuiz && user?.id && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

            <div className="relative">
              <Sparkles className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-serif mb-2">
                Trouvez votre expert idéal
              </h3>
              <p className="text-white/90 mb-6 text-sm">
                Répondez à notre quiz de matching pour être mis en relation avec les experts qui correspondent le mieux à vos besoins et préférences culturelles.
              </p>
              <Link
                to="/member/matching-quiz"
                className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] rounded-full px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Commencer le quiz
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Prochain Rendez-vous */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif text-[#1A1A1A]">
              Prochain rendez-vous
            </h2>
            <Calendar className="w-5 h-5 text-[#A68B6F]" />
          </div>

          {nextAppointment ? (
            <>
              <div className="bg-gradient-to-br from-[#A68B6F]/5 to-[#D4C5B9]/5 rounded-2xl p-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                    {nextAppointment.expertName
                      ? getInitials(nextAppointment.expertName)
                      : "EX"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] mb-1">
                      {nextAppointment.expertName || "Expert"}
                    </p>
                    <p className="text-xs text-[#1A1A1A]/60 mb-2 capitalize">
                      {nextAppointment.consultationType === "online"
                        ? "Téléconsultation"
                        : "Consultation en présentiel"}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center gap-1 text-[#1A1A1A]/80">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(nextAppointment.date).toLocaleDateString(
                            "fr-FR",
                            {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#1A1A1A]/80">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{nextAppointment.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to={`/member/consultation-room/${nextAppointment.id}`}
                className="w-full bg-[#1A1A1A] text-white rounded-full py-3 px-6 font-medium text-sm hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                Rejoindre la consultation
              </Link>

              {upcomingConsultations.length > 1 && (
                <div className="mt-4 pt-4 border-t border-[#D4C5B9]">
                  <p className="text-xs font-semibold tracking-wider uppercase text-[#1A1A1A]/60 mb-3">
                    À venir
                  </p>
                  <div className="space-y-2">
                    {upcomingConsultations.slice(1, 3).map((apt, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#F5F1ED] rounded-full flex items-center justify-center text-[#1A1A1A] text-xs font-medium">
                            {apt.expertName ? getInitials(apt.expertName) : "EX"}
                          </div>
                          <div>
                            <p className="text-sm text-[#1A1A1A]">
                              {apt.expertName || "Expert"}
                            </p>
                            <p className="text-xs text-[#1A1A1A]/60">
                              {new Date(apt.date).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                              })}{" "}
                              à {apt.time}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#1A1A1A]/40" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-[#1A1A1A]/40" />
              </div>
              <p className="text-sm text-[#1A1A1A]/60 mb-4">
                Aucun rendez-vous programmé
              </p>
              <Link
                to="/member/booking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors text-sm font-medium"
              >
                Réserver une consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.div>

        {/* Recommandations personnalisées */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif text-[#1A1A1A]">
              Recommandé pour vous
            </h2>
            <Link
              to="/member/resources"
              className="text-sm text-[#A68B6F] hover:underline"
            >
              Voir tout
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-[#A68B6F] animate-spin" />
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <Link
                  key={rec.id || index}
                  to={`/member/resource-detail/${rec.id}`}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-white rounded-2xl overflow-hidden border border-[#D4C5B9] hover:shadow-lg transition-shadow cursor-pointer group h-full"
                  >
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={rec.image}
                        alt={rec.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <span className="text-xs font-semibold tracking-wider uppercase text-white bg-[#1A1A1A]/80 backdrop-blur-sm px-2 py-1 rounded-full">
                          {rec.type}
                        </span>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-5">
                      <h3 className="text-base font-serif text-[#1A1A1A] mb-2 group-hover:text-[#A68B6F] transition-colors line-clamp-2">
                        {rec.title}
                      </h3>
                      <p className="text-sm text-[#1A1A1A]/60 mb-3 line-clamp-2">
                        {rec.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#1A1A1A]/60">
                          {rec.duration}
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#1A1A1A]/40 group-hover:text-[#A68B6F] group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-[#D4C5B9] text-center">
              <BookOpen className="w-12 h-12 text-[#1A1A1A]/40 mx-auto mb-3" />
              <p className="text-sm text-[#1A1A1A]/60">
                Aucune recommandation pour le moment
              </p>
            </div>
          )}
        </motion.div>

        {/* Activité récente */}
        {recentActivity.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
          >
            <h2 className="text-xl font-serif text-[#1A1A1A] mb-4">
              Activité récente
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-3 border-b border-[#D4C5B9] last:border-0"
                  >
                    <div className="w-10 h-10 bg-[#F5F1ED] rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#1A1A1A]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1A1A1A]">{activity.label}</p>
                      <p className="text-xs text-[#1A1A1A]/60">
                        Il y a {activity.date}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#1A1A1A]/40 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* CTA Cercle M.O.N.A */}
        {user?.plan !== "cercle-mona" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-br from-[#D4A574] to-[#A68B6F] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

            <div className="relative">
              <Award className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-serif mb-2">
                Découvrez Le Cercle M.O.N.A
              </h3>
              <p className="text-white/80 mb-4 text-sm">
                Accédez à des consultations illimitées, des ressources exclusives
                et un accompagnement personnalisé premium.
              </p>
              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="bg-white text-[#1A1A1A] rounded-full px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors inline-flex items-center gap-2"
              >
                Découvrir l'offre premium
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Navigation PWA Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] safe-area-inset-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              to="/member/dashboard"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]"
            >
              <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium">Accueil</span>
            </Link>
            <Link
              to="/member/consultations"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs">Consultations</span>
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

      {/* Modal Abonnement */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-[#D4C5B9]/30">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-[#1A1A1A] mb-1 sm:mb-2">
                  Choisissez votre formule
                </h3>
                <p className="text-xs text-[#1A1A1A]/70">
                  Tarifs transparents adaptés au marché africain.
                </p>
              </div>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#2A2A2A] transition-colors flex-shrink-0 shadow-lg"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Toggles XOF/USD et Étudiant */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <button
                onClick={() => setShowStudentPlans(!showStudentPlans)}
                className={`px-4 py-2.5 sm:py-2 rounded-full text-sm font-medium transition-colors ${
                  showStudentPlans
                    ? "bg-[#A68B6F] text-white"
                    : "bg-[#F5F1ED] text-[#1A1A1A] hover:bg-[#E5DED6]"
                }`}
              >
                {showStudentPlans ? "Plans Standards" : "Tarifs Étudiants"}
              </button>
              
              <div className="flex items-center justify-center gap-3">
                <span className={`text-sm font-medium ${currency === "XOF" ? "text-[#1A1A1A]" : "text-[#1A1A1A]/40"}`}>
                  XOF
                </span>
                <button
                  onClick={() => setCurrency(currency === "XOF" ? "USD" : "XOF")}
                  className="relative w-14 h-7 bg-[#D4C5B9] rounded-full transition-colors"
                >
                  <div className={`absolute top-0.5 w-6 h-6 bg-[#A68B6F] rounded-full transition-transform ${
                    currency === "USD" ? "translate-x-7" : "translate-x-0.5"
                  }`}></div>
                </button>
                <span className={`text-sm font-medium ${currency === "USD" ? "text-[#1A1A1A]" : "text-[#1A1A1A]/40"}`}>
                  USD
                </span>
              </div>
            </div>

            {/* Plans Standards */}
            {!showStudentPlans && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Plan Essentiel */}
                <div className="bg-white border-2 border-[#D4C5B9] rounded-2xl sm:rounded-3xl p-3 sm:p-4 hover:border-[#A68B6F] transition-all">
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs font-medium text-[#1A1A1A]/60 mb-2 uppercase tracking-wide">ESSENTIEL</p>
                    <p className="text-xs sm:text-sm text-[#1A1A1A]/70 mb-3 sm:mb-4">
                      Santé mentale & soins primaires de base
                    </p>
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className="text-3xl sm:text-4xl font-serif text-[#1A1A1A]">
                        {currency === "XOF" ? "35 000" : "65"}
                      </span>
                      <span className="text-xs sm:text-sm text-[#1A1A1A]/70">
                        {currency === "XOF" ? "FCFA" : "USD"}/mois
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">2 consultations vidéo/mois (psy OU médecin généraliste)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Messagerie sécurisée E2E avec votre expert</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Passeport Santé FHIR</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Auto-évaluation Score Mental</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Méditations guidées</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Accès bibliothèque de ressources</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Carte M.O.N.A Numérique</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Cercle M.O.N.A Bronze (-10%)</span>
                    </div>
                  </div>

                  <button className="w-full bg-[#F5F1ED] text-[#1A1A1A] rounded-full py-2.5 text-sm font-medium hover:bg-[#E5DED6] transition-colors relative group">
                    <span>Paiement bientôt disponible</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574]/0 via-[#D4A574]/10 to-[#D4A574]/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                  </button>
                </div>

                {/* Plan Premium */}
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-2xl sm:rounded-3xl p-3 sm:p-4 relative overflow-hidden border-2 border-[#D4A574] shadow-xl">
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-[#D4A574] text-white text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase">
                    Best Seller
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs font-medium text-white/60 mb-2 uppercase tracking-wide">PREMIUM</p>
                    <p className="text-xs sm:text-sm text-white/70 mb-3 sm:mb-4">
                      L'expérience complète M.O.N.A
                    </p>
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className="text-3xl sm:text-4xl font-serif text-white">
                        {currency === "XOF" ? "65 000" : "120"}
                      </span>
                      <span className="text-xs sm:text-sm text-white/70">
                        {currency === "XOF" ? "FCFA" : "USD"}/mois
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">4 consultations/mois (mixte psy + médecin)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">Smart Matching avancé</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">Messagerie illimitée prioritaire</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">Coordination de soins</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">Ateliers en ligne mensuels</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">Carte M.O.N.A Physique NFC</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">Cercle M.O.N.A Silver (-20% / -25%)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">1 séance spa offerte/trimestre</span>
                    </div>
                  </div>

                  <button className="w-full bg-white text-[#1A1A1A] rounded-full py-2.5 text-sm font-medium hover:bg-[#F5F1ED] transition-colors relative group">
                    <span>Paiement bientôt disponible</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574]/0 via-[#D4A574]/20 to-[#D4A574]/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                  </button>
                </div>

                {/* Plan Prestige */}
                <div className="bg-white border-2 border-[#D4A574] rounded-2xl sm:rounded-3xl p-3 sm:p-4 hover:border-[#A68B6F] transition-all relative overflow-hidden sm:col-span-2 lg:col-span-1">
                  <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-[#D4A574]/10 to-transparent rounded-bl-full"></div>
                  
                  <div className="mb-3 sm:mb-4 relative">
                    <p className="text-xs font-medium text-[#D4A574] mb-2 uppercase tracking-wide">PRESTIGE</p>
                    <p className="text-xs sm:text-sm text-[#1A1A1A]/70 mb-3 sm:mb-4">
                      Pour ceux qui ne transigeront jamais sur leur bien-être
                    </p>
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className="text-3xl sm:text-4xl font-serif text-[#1A1A1A]">
                        {currency === "XOF" ? "120 000" : "215"}
                      </span>
                      <span className="text-xs sm:text-sm text-[#1A1A1A]/70">
                        {currency === "XOF" ? "FCFA" : "USD"}/mois
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Consultations illimitées</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Accès psychiatre inclus</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Conciergerie santé dédiée</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Suivi 24/7</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Plan de soins personnalisé</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Carte M.O.N.A Prestige NFC</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Cercle M.O.N.A Gold (-30%)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">1 M.O.N.A Escape/an inclus</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">1 massage spa/mois inclus</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-[#D4A574] to-[#A68B6F] text-white rounded-full py-2.5 text-sm font-medium hover:shadow-lg transition-all relative group">
                    <span>Paiement bientôt disponible</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                  </button>
                </div>
              </div>
            )}

            {/* Plans Étudiants */}
            {showStudentPlans && (
              <div>
                <div className="bg-gradient-to-r from-[#D4A574]/10 to-[#A68B6F]/10 rounded-2xl p-4 mb-6 border border-[#D4A574]/20">
                  <p className="text-sm text-[#1A1A1A] font-medium mb-1">Tarif Étudiant -50%</p>
                  <p className="text-xs text-[#1A1A1A]/70">Justificatif requis : carte étudiant valide</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Essentiel Étudiant */}
                  <div className="bg-white border-2 border-[#D4C5B9] rounded-3xl p-4 sm:p-6 hover:border-[#A68B6F] transition-all">
                    <div className="mb-4 sm:mb-6">
                      <p className="text-xs font-medium text-[#1A1A1A]/60 mb-2 uppercase tracking-wide">ESSENTIEL ÉTUDIANT</p>
                      <div className="flex items-baseline gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        <span className="text-3xl sm:text-4xl font-serif text-[#1A1A1A]">
                          {currency === "XOF" ? "17 500" : "32"}
                        </span>
                        <span className="text-xs sm:text-sm text-[#1A1A1A]/70">
                          {currency === "XOF" ? "FCFA" : "USD"}/mois
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#1A1A1A]">2 consultations/mois</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#1A1A1A]">Passeport Santé FHIR</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#1A1A1A]">Messagerie E2E</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#1A1A1A]">Cercle Bronze</span>
                      </div>
                    </div>

                    <button className="w-full bg-[#F5F1ED] text-[#1A1A1A] rounded-full py-2.5 text-sm font-medium hover:bg-[#E5DED6] transition-colors">
                      Paiement bientôt disponible
                    </button>
                  </div>

                  {/* Premium Étudiant */}
                  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-2xl sm:rounded-3xl p-3 sm:p-4 relative overflow-hidden border-2 border-[#D4A574] shadow-xl">
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-[#D4A574] text-white text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase">
                      Recommandé
                    </div>

                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs font-medium text-white/60 mb-2 uppercase tracking-wide">PREMIUM ÉTUDIANT</p>
                      <div className="flex items-baseline gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        <span className="text-3xl sm:text-4xl font-serif text-white">
                          {currency === "XOF" ? "32 500" : "58"}
                        </span>
                        <span className="text-xs sm:text-sm text-white/70">
                          {currency === "XOF" ? "FCFA" : "USD"}/mois
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-white">4 consultations/mois</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-white">Smart Matching</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-white">Carte physique NFC</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-white">Cercle Silver</span>
                      </div>
                    </div>

                    <button className="w-full bg-white text-[#1A1A1A] rounded-full py-2.5 text-sm font-medium hover:bg-[#F5F1ED] transition-colors">
                      Paiement bientôt disponible
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Espacement pour la navigation bottom */}
      <div className="h-20"></div>
    </div>
  );
}