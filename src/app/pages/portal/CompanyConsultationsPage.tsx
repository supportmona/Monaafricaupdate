import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useB2BAuth } from "@/app/contexts/B2BAuthContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  Calendar,
  ArrowLeft,
  Search,
  Filter,
  Clock,
  User,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Download,
  TrendingUp,
  Heart
} from "lucide-react";

interface Consultation {
  id: string;
  employee: {
    name: string;
    email: string;
    department?: string;
  };
  expert: {
    name: string;
    specialty: string;
  };
  date: string;
  time: string;
  duration: number;
  type: string;
  status: "completed" | "scheduled" | "cancelled";
  satisfaction?: number;
  concerns?: string[];
}

export default function CompanyConsultationsPage() {
  const { user } = useB2BAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "scheduled" | "cancelled">("all");

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      const token = localStorage.getItem("mona_company_token");
      if (!token) {
        setLoading(false);
        return;
      }

      // MODE DÉMO : Générer des consultations fictives
      const generateMockConsultations = (): Consultation[] => {
        const firstNames = ["Amara", "Kofi", "Nala", "Kwame", "Zuri", "Mamadou"];
        const lastNames = ["Diallo", "Mensah", "Nkosi", "Ba", "Kamara", "Toure"];
        const expertNames = ["Dr. Fatou Sow", "Dr. Youssef Keita", "Dr. Aïcha Touré", "Dr. Omar Kone"];
        const departments = ["Tech", "RH", "Finance", "Marketing"];
        const concerns = ["Stress au travail", "Anxiété", "Burn-out", "Relations pro"];
        const statuses: Array<"completed" | "scheduled" | "in-progress" | "cancelled"> = ["completed", "completed", "scheduled", "in-progress"];
        
        const count = Math.min((user?.employeeCount || 50) * 0.4, 20); // 40% ont consulté, max 20 pour la démo
        const mockConsultations: Consultation[] = [];
        
        for (let i = 0; i < count; i++) {
          const status = statuses[i % statuses.length];
          const date = new Date();
          date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // Dans les 60 derniers jours
          
          mockConsultations.push({
            id: `cons-${i + 1}`,
            employee: {
              id: `emp-${i + 1}`,
              name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
              email: `employee${i + 1}@company.com`,
              department: departments[i % departments.length]
            },
            expert: {
              id: `exp-${i % 4}`,
              name: expertNames[i % expertNames.length],
              specialty: "Psychologue"
            },
            date: date.toISOString(),
            duration: 45,
            status,
            concern: concerns[i % concerns.length],
            satisfaction: status === "completed" ? (Math.floor(Math.random() * 2) + 4) : undefined, // 4 ou 5
            isAnonymized: true
          });
        }
        
        return mockConsultations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      };

      // Simuler latence réseau
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setConsultations(generateMockConsultations());

      /* CODE API POUR PRODUCTION :
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/company/consultations`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Company-Token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setConsultations(data.consultations || []);
      }
      */
    } catch (error) {
      console.error("Erreur chargement consultations:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultations = consultations.filter(c => {
    const matchesSearch = 
      c.employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.employee.department?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || c.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: consultations.length,
    completed: consultations.filter(c => c.status === "completed").length,
    scheduled: consultations.filter(c => c.status === "scheduled").length,
    cancelled: consultations.filter(c => c.status === "cancelled").length,
    averageSatisfaction: consultations.filter(c => c.satisfaction).length > 0
      ? Math.round(consultations.reduce((sum, c) => sum + (c.satisfaction || 0), 0) / consultations.filter(c => c.satisfaction).length)
      : 0,
  };

  const getStatusBadge = (status: Consultation["status"]) => {
    const styles = {
      completed: "bg-green-100 text-green-700 border-green-200",
      scheduled: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    };

    const labels = {
      completed: "Terminée",
      scheduled: "Planifiée",
      cancelled: "Annulée",
    };

    const icons = {
      completed: CheckCircle,
      scheduled: Clock,
      cancelled: XCircle,
    };

    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${styles[status]}`}>
        <Icon className="w-3.5 h-3.5" />
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#1A1A1A] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link
                to="/company/dashboard"
                className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
              </Link>
              <div>
                <h1 className="text-2xl font-serif italic text-[#1A1A1A]">
                  Consultations
                </h1>
                <p className="text-sm text-[#1A1A1A]/60">
                  Historique des séances de vos employés
                </p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-6 py-2.5 border-2 border-[#1A1A1A] text-[#1A1A1A] rounded-full hover:bg-[#1A1A1A] hover:text-white transition-all font-medium">
              <Download className="w-4 h-4" />
              Exporter
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: "Total", value: stats.total, icon: Calendar, color: "from-[#A68B6F] to-[#8A7159]" },
            { label: "Terminées", value: stats.completed, icon: CheckCircle, color: "from-green-500 to-green-600" },
            { label: "Planifiées", value: stats.scheduled, icon: Clock, color: "from-blue-500 to-blue-600" },
            { label: "Annulées", value: stats.cancelled, icon: XCircle, color: "from-red-500 to-red-600" },
            { label: "Satisfaction", value: `${stats.averageSatisfaction}/5`, icon: Heart, color: "from-[#C67C5C] to-[#A86F5E]" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border-2 border-[#D4C5B9]"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-light text-[#1A1A1A] mb-1">{stat.value}</p>
              <p className="text-xs text-[#1A1A1A]/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-4 border-2 border-[#D4C5B9] flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par employé, expert, département..."
              className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#1A1A1A]/40" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all cursor-pointer font-medium"
            >
              <option value="all">Tous les statuts</option>
              <option value="completed">Terminées</option>
              <option value="scheduled">Planifiées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>
        </motion.div>

        {/* Consultations List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl border-2 border-[#D4C5B9] overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#A68B6F] animate-spin" />
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">
                {searchQuery || filterStatus !== "all" ? "Aucun résultat" : "Aucune consultation"}
              </h3>
              <p className="text-[#1A1A1A]/60">
                {searchQuery || filterStatus !== "all" 
                  ? "Essayez de modifier vos critères de recherche"
                  : "Les consultations de vos employés apparaîtront ici"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#D4C5B9]">
              {filteredConsultations.map((consultation, index) => (
                <motion.div
                  key={consultation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-[#F5F1ED] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                          {consultation.employee.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-serif text-lg text-[#1A1A1A]">
                              {consultation.employee.name}
                            </h3>
                            {getStatusBadge(consultation.status)}
                          </div>
                          
                          <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-[#1A1A1A]/70">
                              <User className="w-4 h-4" />
                              <span>{consultation.expert.name} • {consultation.expert.specialty}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-[#1A1A1A]/70">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(consultation.date).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric"
                                })}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-[#1A1A1A]/70">
                              <Clock className="w-4 h-4" />
                              <span>{consultation.time} • {consultation.duration} min</span>
                            </div>

                            {consultation.employee.department && (
                              <div className="flex items-center gap-2 text-[#1A1A1A]/70">
                                <span className="w-2 h-2 rounded-full bg-[#A68B6F]" />
                                <span>{consultation.employee.department}</span>
                              </div>
                            )}
                          </div>

                          {consultation.satisfaction && (
                            <div className="mt-3 inline-flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                              <Heart className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-700">
                                Satisfaction : {consultation.satisfaction}/5
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {consultation.status === "scheduled" && (
                      <button className="px-6 py-2.5 border-2 border-[#A68B6F] text-[#A68B6F] rounded-full hover:bg-[#A68B6F] hover:text-white transition-all font-medium whitespace-nowrap">
                        <Video className="w-4 h-4 inline mr-2" />
                        Rejoindre
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Info confidentialité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">
                Confidentialité et RGPD
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                Les détails médicaux et les contenus des consultations restent strictement confidentiels 
                et ne sont jamais partagés avec l'entreprise. Seules les statistiques anonymisées et 
                agrégées sont accessibles pour mesurer l'impact du programme de bien-être.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}