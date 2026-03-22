import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Activity, Brain, TrendingUp, Calendar, FileText, Plus, Download, Share2, Lock, AlertCircle } from "lucide-react";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";

interface HealthMetric {
  id: string;
  category: "mental" | "physical" | "emotional";
  label: string;
  value: number;
  max: number;
  unit: string;
  trend: "up" | "down" | "stable";
  lastUpdated: string;
}

interface MedicalRecord {
  id: string;
  type: "consultation" | "prescription" | "test" | "note";
  title: string;
  date: string;
  expert: string;
  summary: string;
}

const MOCK_HEALTH_METRICS: HealthMetric[] = [
  {
    id: "metric-001",
    category: "mental",
    label: "Bien-être Mental",
    value: 72,
    max: 100,
    unit: "%",
    trend: "up",
    lastUpdated: "2026-02-05"
  },
  {
    id: "metric-002",
    category: "emotional",
    label: "Gestion du Stress",
    value: 65,
    max: 100,
    unit: "%",
    trend: "stable",
    lastUpdated: "2026-02-05"
  },
  {
    id: "metric-003",
    category: "physical",
    label: "Qualité du Sommeil",
    value: 7.5,
    max: 10,
    unit: "h",
    trend: "up",
    lastUpdated: "2026-02-04"
  },
  {
    id: "metric-004",
    category: "mental",
    label: "Humeur Générale",
    value: 78,
    max: 100,
    unit: "%",
    trend: "up",
    lastUpdated: "2026-02-05"
  }
];

const MOCK_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: "record-001",
    type: "consultation",
    title: "Évaluation initiale - Gestion du stress",
    date: "2026-02-08",
    expert: "Dr. Jean-Baptiste Ndiaye",
    summary: "Patient présente des symptômes de stress lié au travail. Recommandation de techniques de relaxation et suivi mensuel."
  },
  {
    id: "record-002",
    type: "prescription",
    title: "Prescription - Compléments alimentaires",
    date: "2026-02-08",
    expert: "Dr. Jean-Baptiste Ndiaye",
    summary: "Vitamine D3 1000 UI - 1 comprimé par jour pendant 3 mois"
  },
  {
    id: "record-003",
    type: "note",
    title: "Notes personnelles - Journal d'humeur",
    date: "2026-02-04",
    expert: "Auto-évaluation",
    summary: "Meilleure semaine depuis le début du suivi. Pratique régulière de la méditation."
  }
];

export default function MemberPassportPage() {
  const { user } = useMemberAuth();
  const [selectedTab, setSelectedTab] = useState<"overview" | "records" | "metrics">("overview");

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mental":
        return <Brain className="w-5 h-5" />;
      case "physical":
        return <Activity className="w-5 h-5" />;
      case "emotional":
        return <Heart className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "mental":
        return "from-blue-500 to-indigo-500";
      case "physical":
        return "from-green-500 to-emerald-500";
      case "emotional":
        return "from-pink-500 to-rose-500";
      default:
        return "from-terracotta to-gold";
    }
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case "consultation":
        return "💬";
      case "prescription":
        return "💊";
      case "test":
        return "🔬";
      case "note":
        return "📝";
      default:
        return "📄";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <a href="/member/dashboard" className="text-xs sm:text-sm text-anthracite/60 hover:text-anthracite mb-2 inline-block">
                ← Retour au tableau de bord
              </a>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-anthracite">
                Mon <span className="font-serif italic">Passeport Santé</span>
              </h1>
              <p className="text-sm sm:text-base text-anthracite/60 mt-1">
                Votre dossier médical personnel et sécurisé
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button className="bg-white border border-[#D4C5B9] text-anthracite px-4 py-2.5 rounded-full font-sans font-medium text-sm hover:bg-[#F5F1ED] transition-colors flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Partager</span>
              </button>
              <button className="bg-white border border-[#D4C5B9] text-anthracite px-4 py-2.5 rounded-full font-sans font-medium text-sm hover:bg-[#F5F1ED] transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exporter</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Bannière de sécurité */}
        <div className="bg-gradient-to-r from-terracotta/10 to-gold/10 border border-gold/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/20 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-medium text-anthracite mb-1">
                Données Sécurisées et Confidentielles
              </h3>
              <p className="text-xs sm:text-sm text-anthracite/70">
                Votre passeport santé est chiffré de bout en bout. Seuls vous et les professionnels que vous autorisez peuvent y accéder. Conforme RGPD et réglementations africaines.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-[#D4C5B9] mb-6 sm:mb-8 overflow-hidden">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setSelectedTab("overview")}
              className={`flex-1 min-w-[120px] px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-colors border-b-2 ${
                selectedTab === "overview"
                  ? "border-terracotta text-terracotta bg-terracotta/5"
                  : "border-transparent text-anthracite/60 hover:text-anthracite hover:bg-[#F5F1ED]"
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setSelectedTab("metrics")}
              className={`flex-1 min-w-[120px] px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-colors border-b-2 ${
                selectedTab === "metrics"
                  ? "border-terracotta text-terracotta bg-terracotta/5"
                  : "border-transparent text-anthracite/60 hover:text-anthracite hover:bg-[#F5F1ED]"
              }`}
            >
              Indicateurs
            </button>
            <button
              onClick={() => setSelectedTab("records")}
              className={`flex-1 min-w-[120px] px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-colors border-b-2 ${
                selectedTab === "records"
                  ? "border-terracotta text-terracotta bg-terracotta/5"
                  : "border-transparent text-anthracite/60 hover:text-anthracite hover:bg-[#F5F1ED]"
              }`}
            >
              Dossier médical
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        {selectedTab === "overview" && (
          <div className="space-y-6 sm:space-y-8">
            {/* Métriques principales */}
            <div>
              <h2 className="text-xl sm:text-2xl font-light text-anthracite mb-4 sm:mb-6">
                Indicateurs de Santé
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {MOCK_HEALTH_METRICS.map((metric, index) => (
                  <motion.div
                    key={metric.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#D4C5B9]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${getCategoryColor(metric.category)} rounded-full flex items-center justify-center text-white`}>
                        {getCategoryIcon(metric.category)}
                      </div>
                      {metric.trend === "up" && (
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                      )}
                    </div>
                    <h3 className="text-xs sm:text-sm text-anthracite/60 mb-2">
                      {metric.label}
                    </h3>
                    <p className="text-2xl sm:text-3xl font-light text-anthracite mb-1">
                      {metric.value}{metric.unit}
                    </p>
                    <p className="text-[10px] sm:text-xs text-anthracite/40">
                      Mis à jour le {new Date(metric.lastUpdated).toLocaleDateString("fr-FR")}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dernières entrées */}
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-light text-anthracite">
                  Dernières Entrées
                </h2>
                <button className="text-sm text-terracotta hover:underline">
                  Voir tout
                </button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {MOCK_MEDICAL_RECORDS.slice(0, 3).map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 sm:p-6 border border-[#D4C5B9] hover:border-terracotta transition-colors"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      <div className="flex-shrink-0 text-2xl sm:text-3xl">
                        {getRecordIcon(record.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-medium text-anthracite mb-1">
                          {record.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-anthracite/60 mb-2">
                          {record.expert} • {new Date(record.date).toLocaleDateString("fr-FR")}
                        </p>
                        <p className="text-xs sm:text-sm text-anthracite/80">
                          {record.summary}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === "metrics" && (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {MOCK_HEALTH_METRICS.map((metric, index) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-[#D4C5B9]"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-light text-anthracite mb-1">
                        {metric.label}
                      </h3>
                      <p className="text-xs sm:text-sm text-anthracite/60">
                        {metric.category === "mental" ? "Santé Mentale" : metric.category === "physical" ? "Santé Physique" : "Santé Émotionnelle"}
                      </p>
                    </div>
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${getCategoryColor(metric.category)} rounded-full flex items-center justify-center text-white`}>
                      {getCategoryIcon(metric.category)}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl sm:text-4xl font-light text-anthracite">
                        {metric.value}
                      </span>
                      <span className="text-lg sm:text-xl text-anthracite/60">
                        {metric.unit}
                      </span>
                      <span className="text-sm text-anthracite/40">
                        / {metric.max}{metric.unit}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F5F1ED] rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getCategoryColor(metric.category)} transition-all duration-500`}
                        style={{ width: `${(metric.value / metric.max) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-anthracite/60">
                      Mis à jour le {new Date(metric.lastUpdated).toLocaleDateString("fr-FR")}
                    </span>
                    {metric.trend === "up" && (
                      <span className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        En amélioration
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full bg-[#F5F1ED] text-anthracite border-2 border-dashed border-[#D4C5B9] rounded-xl sm:rounded-2xl p-6 sm:p-8 hover:bg-white hover:border-terracotta transition-colors">
              <Plus className="w-8 h-8 sm:w-10 sm:h-10 text-anthracite/40 mx-auto mb-3" />
              <p className="text-sm sm:text-base font-medium text-anthracite/60">
                Ajouter un nouvel indicateur
              </p>
            </button>
          </div>
        )}

        {selectedTab === "records" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-end">
              <button className="bg-anthracite text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-sans font-medium text-sm sm:text-base hover:bg-anthracite/90 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Nouvelle entrée
              </button>
            </div>

            {MOCK_MEDICAL_RECORDS.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-[#D4C5B9] hover:border-terracotta transition-colors"
              >
                <div className="flex gap-4 sm:gap-6">
                  <div className="flex-shrink-0 text-3xl sm:text-4xl">
                    {getRecordIcon(record.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-light text-anthracite mb-1">
                          {record.title}
                        </h3>
                        <p className="text-sm text-anthracite/60">
                          {record.expert}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-anthracite/60">
                        <Calendar className="w-4 h-4" />
                        {new Date(record.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-anthracite/80 mb-4">
                      {record.summary}
                    </p>
                    <div className="flex gap-2 sm:gap-3">
                      <button className="bg-[#F5F1ED] text-anthracite px-4 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-[#D4C5B9] transition-colors">
                        Voir détails
                      </button>
                      <button className="bg-[#F5F1ED] text-anthracite px-4 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-[#D4C5B9] transition-colors">
                        Télécharger
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
