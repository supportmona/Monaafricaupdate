import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import ExpertLayout from "@/app/components/ExpertLayout";
import {
  ClipboardList, Search, Plus, Calendar, User, Target,
  CheckCircle, Clock, Edit, Download, X, ChevronRight,
  AlertCircle, Activity, TrendingUp, Flag,
} from "lucide-react";

interface CarePlan {
  id: string;
  patientId: string;
  patientName: string;
  diagnosis: string;
  startDate: string;
  reviewDate: string;
  status: "active" | "completed" | "onhold" | "cancelled";
  progress: number;
  objectives: Objective[];
  interventions: Intervention[];
  lastUpdate: string;
}

interface Objective {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: "pending" | "inprogress" | "completed";
  priority: "low" | "medium" | "high";
}

interface Intervention {
  id: string;
  type: "psychotherapy" | "medication" | "lifestyle" | "followup";
  description: string;
  frequency: string;
  duration: string;
}

export default function CarePlanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPlan, setSelectedPlan] = useState<CarePlan | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // ✅ Données vides — les vrais plans viendront de l'API
  const [carePlans] = useState<CarePlan[]>([]);

  const filteredPlans = carePlans.filter((plan) => {
    const matchesSearch =
      plan.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || plan.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => ({
    active: "bg-green-100 text-green-700 border-green-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
    onhold: "bg-yellow-100 text-yellow-700 border-yellow-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
  }[status] || "bg-gray-100 text-gray-700 border-gray-200");

  const getStatusLabel = (status: string) => ({
    active: "EN COURS", completed: "TERMINÉ", onhold: "EN PAUSE", cancelled: "ANNULÉ",
  }[status] || status.toUpperCase());

  const getPriorityColor = (priority: string) => ({
    high: "bg-red-100 text-red-700",
    medium: "bg-orange-100 text-orange-700",
    low: "bg-green-100 text-green-700",
  }[priority] || "bg-gray-100 text-gray-700");

  const getObjectiveStatusColor = (status: string) => ({
    completed: "bg-green-100 text-green-700",
    inprogress: "bg-blue-100 text-blue-700",
    pending: "bg-gray-100 text-gray-700",
  }[status] || "bg-gray-100 text-gray-700");

  const getInterventionIcon = (type: string) => ({
    psychotherapy: <Activity className="w-5 h-5" />,
    medication: <AlertCircle className="w-5 h-5" />,
    lifestyle: <TrendingUp className="w-5 h-5" />,
    followup: <Calendar className="w-5 h-5" />,
  }[type] || <ClipboardList className="w-5 h-5" />);

  const getInterventionLabel = (type: string) => ({
    psychotherapy: "Psychothérapie",
    medication: "Médication",
    lifestyle: "Mode de vie",
    followup: "Suivi",
  }[type] || "Autre");

  const totalObjectives = carePlans.reduce((sum, p) => sum + p.objectives.length, 0);
  const totalCompleted = carePlans.reduce((sum, p) => sum + p.objectives.filter(o => o.status === "completed").length, 0);
  const avgProgress = carePlans.length > 0 ? Math.round(carePlans.reduce((sum, p) => sum + p.progress, 0) / carePlans.length) : 0;

  return (
    <ExpertLayout title="Plans de soins">
      <div className="p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <ClipboardList className="w-6 h-6 text-[#A68B6F]" />, bg: "bg-[#A68B6F]/10", value: carePlans.length, label: "Plans actifs" },
            { icon: <Target className="w-6 h-6 text-green-600" />, bg: "bg-green-100", value: totalObjectives, label: "Objectifs" },
            { icon: <CheckCircle className="w-6 h-6 text-blue-600" />, bg: "bg-blue-100", value: totalCompleted, label: "Complétés" },
            { icon: <TrendingUp className="w-6 h-6 text-orange-600" />, bg: "bg-orange-100", value: `${avgProgress}%`, label: "Progression moy." },
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
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
              <input type="text" placeholder="Rechercher un plan de soins..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
            </div>
            <div className="flex items-center gap-3">
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]">
                <option value="all">Tous les statuts</option>
                <option value="active">En cours</option>
                <option value="completed">Terminés</option>
                <option value="onhold">En pause</option>
                <option value="cancelled">Annulés</option>
              </select>
              <button onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Nouveau plan</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Plans List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="space-y-4">
          {filteredPlans.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-[#D4C5B9] text-center">
              <div className="w-20 h-20 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-10 h-10 text-[#1A1A1A]/40" />
              </div>
              <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">Aucun plan de soins</h3>
              <p className="text-sm text-[#1A1A1A]/60 mb-6">
                {searchTerm || selectedStatus !== "all"
                  ? "Essayez de modifier vos filtres"
                  : "Créez votre premier plan de soins personnalisé"}
              </p>
              {!searchTerm && selectedStatus === "all" && (
                <button onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors">
                  <Plus className="w-4 h-4" />
                  Nouveau plan
                </button>
              )}
            </div>
          ) : (
            filteredPlans.map((plan, index) => (
              <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-3xl border border-[#D4C5B9] overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => setSelectedPlan(plan)}>
                <div className="p-6 border-b border-[#D4C5B9]">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                        {plan.patientName[0]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-serif text-[#1A1A1A] mb-1">{plan.patientName}</h3>
                        <p className="text-sm text-[#1A1A1A]/70 mb-2">{plan.diagnosis}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(plan.status)}`}>
                            {getStatusLabel(plan.status)}
                          </span>
                          <span className="text-xs text-[#1A1A1A]/60">
                            Début : {new Date(plan.startDate).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-[#1A1A1A]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#1A1A1A]">Progression globale</span>
                      <span className="text-sm font-semibold text-[#A68B6F]">{plan.progress}%</span>
                    </div>
                    <div className="h-3 bg-[#F5F1ED] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#A68B6F] to-[#8A7159] rounded-full transition-all"
                        style={{ width: `${plan.progress}%` }} />
                    </div>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-[#A68B6F]" />Objectifs ({plan.objectives.length})
                    </h4>
                    <div className="space-y-2">
                      {plan.objectives.slice(0, 3).map(obj => (
                        <div key={obj.id} className="flex items-start gap-2">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${obj.status === "completed" ? "bg-green-500" : obj.status === "inprogress" ? "bg-blue-500" : "bg-gray-300"}`} />
                          <p className="text-sm text-[#1A1A1A]/70 line-clamp-1">{obj.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#A68B6F]" />Interventions ({plan.interventions.length})
                    </h4>
                    <div className="space-y-2">
                      {plan.interventions.slice(0, 3).map(inter => (
                        <div key={inter.id} className="flex items-start gap-2">
                          <div className="text-[#A68B6F] mt-0.5">{getInterventionIcon(inter.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#1A1A1A]/70 line-clamp-1">{inter.description}</p>
                            <p className="text-xs text-[#1A1A1A]/50">{inter.frequency}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="px-6 py-4 bg-[#F5F1ED]/50 border-t border-[#D4C5B9] flex items-center justify-between text-xs text-[#1A1A1A]/60">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Dernière mise à jour : {new Date(plan.lastUpdate).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Révision : {new Date(plan.reviewDate).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Modal - Détails plan */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-[#D4C5B9] p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white text-xl font-medium">
                    {selectedPlan.patientName[0]}
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif text-[#1A1A1A]">Plan de soins</h2>
                    <p className="text-sm text-[#1A1A1A]/60">{selectedPlan.patientName}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedPlan(null)} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                  <X className="w-5 h-5 text-[#1A1A1A]" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-[#F5F1ED] rounded-2xl p-6 space-y-4">
                  <div>
                    <p className="text-xs text-[#1A1A1A]/60 mb-1">Diagnostic</p>
                    <p className="text-base font-serif text-[#1A1A1A]">{selectedPlan.diagnosis}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-[#1A1A1A]/60 mb-1">Date de début</p>
                      <p className="text-sm text-[#1A1A1A]">{new Date(selectedPlan.startDate).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#1A1A1A]/60 mb-1">Révision prévue</p>
                      <p className="text-sm text-[#1A1A1A]">{new Date(selectedPlan.reviewDate).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#1A1A1A]/60 mb-1">Statut</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(selectedPlan.status)}`}>
                        {getStatusLabel(selectedPlan.status)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3">Progression globale</h4>
                  <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-serif text-[#1A1A1A]">Avancement du plan</span>
                      <span className="text-3xl font-light text-[#A68B6F]">{selectedPlan.progress}%</span>
                    </div>
                    <div className="h-4 bg-[#F5F1ED] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#A68B6F] to-[#8A7159] rounded-full transition-all" style={{ width: `${selectedPlan.progress}%` }} />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#A68B6F]" />Objectifs thérapeutiques ({selectedPlan.objectives.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedPlan.objectives.map(obj => (
                      <div key={obj.id} className="bg-white border border-[#D4C5B9] rounded-2xl p-5">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h5 className="text-base font-serif text-[#1A1A1A] mb-1">{obj.title}</h5>
                            <p className="text-sm text-[#1A1A1A]/70">{obj.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 ${getPriorityColor(obj.priority)} rounded-full text-xs font-medium`}>
                              {obj.priority === "high" ? "Prioritaire" : obj.priority === "medium" ? "Moyen" : "Faible"}
                            </span>
                            <span className={`px-2 py-1 ${getObjectiveStatusColor(obj.status)} rounded-full text-xs font-medium`}>
                              {obj.status === "completed" ? "Complété" : obj.status === "inprogress" ? "En cours" : "À faire"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/60">
                          <Flag className="w-3.5 h-3.5" />
                          <span>Date cible : {new Date(obj.targetDate).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#A68B6F]" />Interventions thérapeutiques ({selectedPlan.interventions.length})
                  </h4>
                  <div className="space-y-3">
                    {selectedPlan.interventions.map(inter => (
                      <div key={inter.id} className="bg-[#F5F1ED] rounded-2xl p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#A68B6F] flex-shrink-0">
                            {getInterventionIcon(inter.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[#A68B6F] mb-1">{getInterventionLabel(inter.type)}</p>
                            <p className="text-base text-[#1A1A1A]">{inter.description}</p>
                            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                              <div>
                                <p className="text-xs text-[#1A1A1A]/60 mb-1">Fréquence</p>
                                <p className="text-[#1A1A1A]">{inter.frequency}</p>
                              </div>
                              <div>
                                <p className="text-xs text-[#1A1A1A]/60 mb-1">Durée</p>
                                <p className="text-[#1A1A1A]">{inter.duration}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors">
                    <Edit className="w-4 h-4" /><span className="text-sm font-medium">Modifier le plan</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#E8E0D8] transition-colors">
                    <Download className="w-4 h-4" /><span className="text-sm font-medium">Exporter</span>
                  </button>
                  <Link to={`/expert/patients/${selectedPlan.patientId}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#E8E0D8] transition-colors">
                    <User className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal - Créer plan */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full">
              <div className="p-6 border-b border-[#D4C5B9] flex items-center justify-between">
                <h2 className="text-2xl font-serif text-[#1A1A1A]">Nouveau plan de soins</h2>
                <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                  <X className="w-5 h-5 text-[#1A1A1A]" />
                </button>
              </div>
              <div className="p-6 text-center py-12">
                <div className="w-20 h-20 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-10 h-10 text-[#A68B6F]" />
                </div>
                <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">Créateur de plan de soins</h3>
                <p className="text-sm text-[#1A1A1A]/60 mb-6">Cette fonctionnalité sera bientôt disponible</p>
                <button onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors">
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ExpertLayout>
  );
}
