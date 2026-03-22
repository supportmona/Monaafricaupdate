import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Award,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Target,
  ArrowRight
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface MonaScoreData {
  currentScore: number | null;
  previousScore: number | null;
  trend: "up" | "down" | "stable";
  lastUpdate: string;
  lastAssessmentDate?: string;
  weeklyAssessments: number;
  expertFeedback: number;
  isInitial?: boolean;
  hasNeverBeenAssessed?: boolean;
  milestone?: {
    title: string;
    description: string;
    reward?: string;
  };
}

interface RetakeEligibility {
  canRetake: boolean;
  reason: string;
  message: string;
  subscriptionType: string;
  lastAssessmentDate?: string;
  nextAvailableDate?: string;
}

interface MonaScoreWidgetProps {
  userId: string;
  compact?: boolean;
}

export default function MonaScoreWidget({ userId, compact = false }: MonaScoreWidgetProps) {
  const [scoreData, setScoreData] = useState<MonaScoreData | null>(null);
  const [retakeEligibility, setRetakeEligibility] = useState<RetakeEligibility | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  // Charger les données du score
  useEffect(() => {
    loadScoreData();
    
    // DEBUG: Exposer une fonction globale pour réinitialiser le score
    if (typeof window !== 'undefined') {
      (window as any).resetMonaScore = async () => {
        const token = localStorage.getItem("mona_member_token");
        if (!token) {
          console.error("❌ Non authentifié");
          return;
        }
        
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/mona-score/${userId}/reset`,
            {
              method: 'DELETE',
              headers: {
                "Authorization": `Bearer ${publicAnonKey}`,
                "X-User-Token": token,
              },
            }
          );
          
          if (response.ok) {
            console.log("✅ Score réinitialisé avec succès");
            window.location.reload();
          } else {
            console.error("❌ Erreur:", await response.text());
          }
        } catch (error) {
          console.error("❌ Erreur:", error);
        }
      };
      
      console.log("💡 Pour réinitialiser le score, tapez: resetMonaScore()");
    }
  }, [userId]);

  const loadScoreData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Vérifier que l'userId existe
      if (!userId || userId === "") {
        console.log("🟡 MONA Score - userId vide, attente...");
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem("mona_member_token");
      if (!token) {
        setError("Non authentifié");
        setLoading(false);
        return;
      }

      console.log("🔵 MONA Score - Loading for userId:", userId);
      console.log("🔵 MONA Score - Token:", token ? `${token.substring(0, 20)}...` : "AUCUN");

      // Décoder le JWT pour vérifier l'userId
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          console.log("🔵 MONA Score - JWT payload userId (sub):", payload.sub);
          console.log("🔵 MONA Score - Comparaison:", {
            userIdProp: userId,
            jwtSub: payload.sub,
            correspond: userId === payload.sub
          });
          
          if (payload.sub !== userId) {
            console.warn("⚠️ MISMATCH: userId prop ne correspond pas au JWT sub!");
            console.warn("   userId prop:", userId);
            console.warn("   JWT sub:", payload.sub);
          }
        }
      } catch (e) {
        console.error("🔴 Impossible de décoder le JWT:", e);
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/mona-score/${userId}`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
          },
        }
      );

      console.log("🔵 MONA Score - Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔴 MONA Score - Error response:", errorText);
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log("🔵 MONA Score - Result:", result);

      if (result.success && result.data) {
        setScoreData(result.data);
        setRetakeEligibility(result.retakeEligibility);
        
        console.log("🔵 MONA Score Data reçue:", {
          currentScore: result.data.currentScore,
          hasNeverBeenAssessed: result.data.hasNeverBeenAssessed,
          isInitial: result.data.isInitial
        });
      } else {
        throw new Error("Données invalides reçues du serveur");
      }
      
      // Charger l'éligibilité au retest si un score existe
      if (result.data && result.data.currentScore !== null && !result.data.hasNeverBeenAssessed) {
        await loadRetakeEligibility();
      }
    } catch (err) {
      console.error("🔴 Erreur chargement MONA Score:", err);
      setError(err instanceof Error ? err.message : "Impossible de charger le score");
    } finally {
      setLoading(false);
    }
  };

  const loadRetakeEligibility = async () => {
    try {
      const token = localStorage.getItem("mona_member_token");
      if (!token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/mona-score/${userId}/can-retake`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRetakeEligibility(result);
          console.log("🔵 Éligibilité au retest:", result);
        }
      }
    } catch (err) {
      console.error("🔴 Erreur chargement éligibilité retest:", err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#D4C5B9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#A68B6F] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-[#1A1A1A]/60">Chargement du score...</p>
        </div>
      </div>
    );
  }

  if (error || !scoreData) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-[#D4C5B9]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-sm text-[#1A1A1A]/60">{error || "Aucune donnée disponible"}</p>
        </div>
      </div>
    );
  }

  // État initial : Première évaluation
  if (scoreData.currentScore === null || scoreData.hasNeverBeenAssessed) {
    return (
      <div className="bg-gradient-to-br from-white to-[#F5F1ED] rounded-3xl p-6 sm:p-8 border border-[#D4C5B9] shadow-lg">
        <div className="text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-20 h-20 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Target className="w-10 h-10 text-white" />
          </motion.div>

          {/* Title */}
          <h3 className="text-2xl font-serif text-[#1A1A1A] mb-3">
            Découvrez votre MONA Score
          </h3>
          
          {/* Description */}
          <p className="text-[#1A1A1A]/70 mb-6 max-w-md mx-auto">
            Le MONA Score est votre indicateur personnel de santé mentale. Il évolue avec vous grâce à vos auto-évaluations et aux retours de votre expert.
          </p>

          {/* Benefits */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-[#D4C5B9]">
              <CheckCircle className="w-6 h-6 text-[#A68B6F] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#1A1A1A] mb-1">Suivi visuel</p>
              <p className="text-xs text-[#1A1A1A]/60">Visualisez votre progression en temps réel</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-[#D4C5B9]">
              <TrendingUp className="w-6 h-6 text-[#A68B6F] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#1A1A1A] mb-1">Évolution claire</p>
              <p className="text-xs text-[#1A1A1A]/60">Comprenez vos tendances</p>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-[#D4C5B9]">
              <Award className="w-6 h-6 text-[#A68B6F] mx-auto mb-2" />
              <p className="text-sm font-medium text-[#1A1A1A] mb-1">Objectifs atteints</p>
              <p className="text-xs text-[#1A1A1A]/60">Célébrez vos victoires</p>
            </div>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = "/onboarding"}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors font-medium"
          >
            Calculez votre score
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {/* Info */}
          <p className="mt-6 text-xs text-[#1A1A1A]/60">
            Durée estimée : 5 à 10 minutes
          </p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return { bg: "bg-green-500", text: "text-green-700", ring: "ring-green-500/20" };
    if (score >= 50) return { bg: "bg-orange-500", text: "text-orange-700", ring: "ring-orange-500/20" };
    return { bg: "bg-red-500", text: "text-red-700", ring: "ring-red-500/20" };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return { label: "Bon", description: "Vous êtes sur la bonne voie" };
    if (score >= 50) return { label: "Modéré", description: "Continuez vos efforts" };
    return { label: "Attention", description: "Besoin de soutien supplémentaire" };
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return "Excellence";
    if (score >= 70) return "Bon équilibre";
    if (score >= 50) return "Modéré";
    return "Besoin d'attention";
  };

  const colors = getScoreColor(scoreData.currentScore || 0);
  const { label, description } = getScoreLabel(scoreData.currentScore || 0);
  const scoreDiff = scoreData.currentScore !== null && scoreData.previousScore !== null ? scoreData.currentScore - scoreData.previousScore : 0;

  // Calculer le pourcentage pour le cercle
  const circumference = 2 * Math.PI * 54; // rayon de 54
  const offset = circumference - (scoreData.currentScore || 0) / 100 * circumference;

  if (compact) {
    return (
      <div className="bg-white rounded-2xl p-4 border border-[#D4C5B9]">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#F5F1ED"
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke={colors.bg.replace("bg-", "")}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: `0 ${2 * Math.PI * 28}` }}
                animate={{ 
                  strokeDasharray: `${(scoreData.currentScore || 0) / 100 * (2 * Math.PI * 28)} ${2 * Math.PI * 28}` 
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={colors.bg.replace("bg-", "stroke-")}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-[#1A1A1A]">
                {scoreData.currentScore}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-[#1A1A1A]">MONA Score</p>
              {scoreData.trend === "up" && (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-medium">+{scoreDiff}</span>
                </div>
              )}
              {scoreData.trend === "down" && (
                <div className="flex items-center gap-1 text-red-600">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-xs font-medium">{scoreDiff}</span>
                </div>
              )}
            </div>
            <p className="text-xs text-[#1A1A1A]/60">{description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-[#F5F1ED] rounded-3xl p-6 sm:p-8 border border-[#D4C5B9] shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-serif text-[#1A1A1A]">MONA Score</h3>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-1 hover:bg-white rounded-full transition-colors"
            >
              <Info className="w-4 h-4 text-[#1A1A1A]/60" />
            </button>
          </div>
          <p className="text-sm text-[#1A1A1A]/60">
            Votre score de santé mentale
          </p>
        </div>
        
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${colors.bg} bg-opacity-10 ${colors.text} rounded-full text-xs font-semibold`}>
          {scoreData.trend === "up" && <TrendingUp className="w-4 h-4" />}
          {scoreData.trend === "down" && <TrendingDown className="w-4 h-4" />}
          {scoreData.trend === "stable" && <Minus className="w-4 h-4" />}
          {getScoreLevel(scoreData.currentScore || 0)}
        </div>
      </div>

      {/* Info Alert */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm text-blue-900">
              <p className="font-medium mb-1">Comment est calculé le MONA Score ?</p>
              <p className="text-blue-800">
                Votre score est basé sur vos auto-évaluations hebdomadaires et les retours cliniques de votre expert. 
                Il évolue en temps réel pour refléter votre bien-être mental.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Score Circle */}
      <div className="flex items-center justify-center mb-8">
        <div className="relative">
          <svg className="w-48 h-48 sm:w-56 sm:h-56 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="112"
              cy="112"
              r="54"
              stroke="#F5F1ED"
              strokeWidth="12"
              fill="none"
              className="sm:r-[64]"
            />
            {/* Progress circle */}
            <motion.circle
              cx="112"
              cy="112"
              r="54"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeDasharray={circumference}
              className={`${colors.bg.replace("bg-", "text-")} sm:r-[64]`}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-center"
            >
              <div className="text-5xl sm:text-6xl font-bold text-[#1A1A1A] mb-1">
                {scoreData.currentScore}
              </div>
              <div className="text-sm text-[#1A1A1A]/60">sur 100</div>
            </motion.div>
          </div>

          {/* Floating trend indicator */}
          {scoreData.trend !== "stable" && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1, type: "spring" }}
              className={`absolute -top-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center ${
                scoreData.trend === "up" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <div className="text-white text-center">
                {scoreData.trend === "up" && (
                  <>
                    <TrendingUp className="w-5 h-5 mx-auto" />
                    <div className="text-xs font-bold">+{scoreDiff}</div>
                  </>
                )}
                {scoreData.trend === "down" && (
                  <>
                    <TrendingDown className="w-5 h-5 mx-auto" />
                    <div className="text-xs font-bold">{scoreDiff}</div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className={`text-center mb-6 p-4 ${colors.bg} bg-opacity-10 rounded-2xl`}>
        <p className={`text-lg font-semibold ${colors.text} mb-1`}>
          {label}
        </p>
        <p className="text-sm text-[#1A1A1A]/70">
          {description}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-[#D4C5B9]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-[#A68B6F]" />
            <p className="text-xs text-[#1A1A1A]/60">Auto-évaluations</p>
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">
            {scoreData.weeklyAssessments}
          </p>
          <p className="text-xs text-[#1A1A1A]/60">cette semaine</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#D4C5B9]">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-[#A68B6F]" />
            <p className="text-xs text-[#1A1A1A]/60">Retours experts</p>
          </div>
          <p className="text-2xl font-bold text-[#1A1A1A]">
            {scoreData.expertFeedback}
          </p>
          <p className="text-xs text-[#1A1A1A]/60">ce mois-ci</p>
        </div>
      </div>

      {/* Milestone Alert */}
      {scoreData.milestone && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#A68B6F] to-[#D4C5B9] rounded-2xl p-4 text-white"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold mb-1">{scoreData.milestone.title}</p>
              <p className="text-sm text-white/90 mb-2">
                {scoreData.milestone.description}
              </p>
              {scoreData.milestone.reward && (
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                  <Award className="w-4 h-4" />
                  {scoreData.milestone.reward}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Low Score Alert */}
      {scoreData.currentScore < 50 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-red-900 mb-1">
                Besoin de soutien supplémentaire
              </p>
              <p className="text-sm text-red-800 mb-3">
                Votre score indique que vous pourriez bénéficier d'un accompagnement renforcé.
              </p>
              <button className="text-sm font-medium text-red-700 hover:text-red-800 underline">
                Parler à la coordination
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Retake Test Section */}
      {retakeEligibility && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          {retakeEligibility.canRetake ? (
            <div className="bg-[#A68B6F]/10 border border-[#A68B6F]/30 rounded-2xl p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-[#1A1A1A] mb-1">
                    Prêt pour une nouvelle évaluation ?
                  </p>
                  <p className="text-sm text-[#1A1A1A]/70">
                    {retakeEligibility.subscriptionType === "free" 
                      ? "Test mensuel disponible" 
                      : "Test quotidien disponible"}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.location.href = "/onboarding"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors font-medium"
                >
                  Refaire le test
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 mb-1">
                    {retakeEligibility.message}
                  </p>
                  <p className="text-sm text-amber-800 mb-2">
                    {retakeEligibility.subscriptionType === "free" 
                      ? "Les membres gratuits peuvent passer le test 1 fois par mois." 
                      : "Les membres avec abonnement peuvent passer le test 1 fois toutes les 24h."}
                  </p>
                  {retakeEligibility.nextAvailableDate && (
                    <p className="text-xs text-amber-700">
                      Prochain test disponible le{" "}
                      {new Date(retakeEligibility.nextAvailableDate).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Last Update */}
      <div className="mt-6 pt-4 border-t border-[#D4C5B9] text-center">
        <p className="text-xs text-[#1A1A1A]/60">
          Dernière mise à jour : {new Date(scoreData.lastUpdate).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </p>
      </div>
    </div>
  );
}