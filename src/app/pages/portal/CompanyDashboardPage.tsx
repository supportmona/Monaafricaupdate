import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { useB2BAuth } from "@/app/contexts/B2BAuthContext";
import { CompanyHeader } from "@/app/components/CompanyHeader";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { 
  Building2,
  Users,
  TrendingUp,
  Activity,
  Heart,
  Calendar,
  Shield,
  CheckCircle,
  Award,
  BarChart3,
  ArrowRight,
  Bell,
  Settings,
  ChevronRight,
  Sparkles,
  Target,
  Clock,
  LogOut
} from "lucide-react";

interface CompanyStats {
  totalEmployees: number;
  activeUsers: number;
  totalConsultations: number;
  thisMonthConsultations: number;
  averageSatisfaction: number;
  wellbeingScore: number;
}

export default function CompanyDashboardPage() {
  const { user, logout } = useB2BAuth();
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<"XOF" | "USD">("XOF");
  const [stats, setStats] = useState<CompanyStats>({
    totalEmployees: 0,
    activeUsers: 0,
    totalConsultations: 0,
    thisMonthConsultations: 0,
    averageSatisfaction: 0,
    wellbeingScore: 0,
  });
  const [loading, setLoading] = useState(true);

  const companyData = {
    name: user?.companyName || "Votre Entreprise",
    logo: user?.companyName?.substring(0, 2).toUpperCase() || "EN",
    plan: "Entreprise Premium",
    since: "2025"
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("mona_company_token");
    localStorage.removeItem("mona_company_user");
    navigate("/entreprise/login");
  };

  useEffect(() => {
    loadCompanyStats();
  }, []);

  const loadCompanyStats = async () => {
    try {
      const token = localStorage.getItem("mona_company_token");
      if (!token) {
        setLoading(false);
        return;
      }

      // MODE DÉMO : Utiliser des données mockées au lieu de l'API
      // En production, décommenter le code API ci-dessous
      
      // Données de démonstration basées sur l'entreprise
      const mockStats = {
        totalEmployees: user?.employeeCount || 50,
        activeUsers: Math.floor((user?.employeeCount || 50) * 0.68), // 68% d'utilisateurs actifs
        totalConsultations: Math.floor((user?.employeeCount || 50) * 2.3), // ~2.3 consultations par employé
        thisMonthConsultations: Math.floor((user?.employeeCount || 50) * 0.4), // 40% ce mois
        averageSatisfaction: 4.6,
        wellbeingScore: 78
      };

      // Simuler une latence réseau
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setStats(mockStats);

      /* CODE API POUR PRODUCTION :
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/company/stats`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Company-Token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
      */
    } catch (error) {
      console.error("Erreur chargement stats:", error);
      // En cas d'erreur, utiliser des valeurs par défaut
      setStats({
        totalEmployees: user?.employeeCount || 0,
        activeUsers: 0,
        totalConsultations: 0,
        thisMonthConsultations: 0,
        averageSatisfaction: 0,
        wellbeingScore: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: Users,
      label: "Gérer les employés",
      description: "Ajouter ou retirer des employés",
      href: "/company/employees",
      color: "from-[#A68B6F] to-[#8A7159]"
    },
    {
      icon: Calendar,
      label: "Consultations",
      description: "Voir toutes les consultations",
      href: "/company/consultations",
      color: "from-[#C9A884] to-[#A68B6F]"
    },
    {
      icon: BarChart3,
      label: "Analytics",
      description: "Rapports détaillés",
      href: "/company/analytics",
      color: "from-[#D4C5B9] to-[#C9A884]"
    },
    {
      icon: Settings,
      label: "Paramètres",
      description: "Configuration entreprise",
      href: "/company/settings",
      color: "from-[#1A1A1A] to-[#2A2A2A]"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Confidentialité garantie",
      description: "Données chiffrées E2E selon RGPD"
    },
    {
      icon: Heart,
      title: "Bien-être mesuré",
      description: "Scores anonymisés en temps réel"
    },
    {
      icon: Award,
      title: "Experts certifiés",
      description: "Psychologues et psychiatres africains"
    },
    {
      icon: Target,
      title: "ROI prouvé",
      description: "Productivité +23%, absentéisme -35%"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header Premium */}
      <CompanyHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden"
        >
          {/* Pattern background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
            }} />
          </div>

          <div className="relative">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-4xl sm:text-5xl font-serif italic mb-3">
                  Tableau de bord
                </h2>
                <p className="text-white/70 text-lg">
                  Vue d'ensemble de votre programme de bien-être
                </p>
              </div>
              
              {/* Toggle devise */}
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full p-1 border border-white/20">
                <button
                  onClick={() => setCurrency("XOF")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    currency === "XOF"
                      ? "bg-white text-[#1A1A1A] shadow-lg"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  XOF
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    currency === "USD"
                      ? "bg-white text-[#1A1A1A] shadow-lg"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  USD
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Users className="w-8 h-8 text-[#D4C5B9] mb-4" />
                <p className="text-4xl font-light mb-2">{stats.totalEmployees}</p>
                <p className="text-white/60 text-sm">Employés inscrits</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Activity className="w-8 h-8 text-[#D4C5B9] mb-4" />
                <p className="text-4xl font-light mb-2">{stats.activeUsers}</p>
                <p className="text-white/60 text-sm">Utilisateurs actifs</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Calendar className="w-8 h-8 text-[#D4C5B9] mb-4" />
                <p className="text-4xl font-light mb-2">{stats.thisMonthConsultations}</p>
                <p className="text-white/60 text-sm">Consultations ce mois</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Heart className="w-8 h-8 text-[#D4C5B9] mb-4" />
                <p className="text-4xl font-light mb-2">
                  {stats.wellbeingScore > 0 ? `${stats.wellbeingScore}/100` : "N/A"}
                </p>
                <p className="text-white/60 text-sm">Score bien-être moyen</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions rapides */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={action.href}
                className="group block bg-white rounded-2xl p-6 border-2 border-[#D4C5B9] hover:border-[#A68B6F] transition-all hover:shadow-xl"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-serif text-lg text-[#1A1A1A] mb-2 group-hover:text-[#A68B6F] transition-colors">
                  {action.label}
                </h3>
                <p className="text-sm text-[#1A1A1A]/60 mb-3">
                  {action.description}
                </p>
                <div className="flex items-center gap-2 text-[#A68B6F] text-sm font-medium">
                  Accéder
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* État vide avec CTA */}
        {stats.totalEmployees === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-12 text-center border-2 border-[#D4C5B9]"
          >
            <div className="max-w-2xl mx-auto">
              <div className="w-20 h-20 bg-[#A68B6F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-[#A68B6F]" />
              </div>
              
              <h2 className="text-3xl font-serif italic text-[#1A1A1A] mb-4">
                Bienvenue dans votre espace entreprise
              </h2>
              
              <p className="text-[#1A1A1A]/70 text-lg mb-8 leading-relaxed">
                Commencez par ajouter vos employés pour qu'ils puissent bénéficier 
                de consultations en santé mentale avec nos experts certifiés.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/company/employees"
                  className="px-8 py-4 bg-[#1A1A1A] text-white rounded-full font-medium hover:bg-[#2A2A2A] transition-all inline-flex items-center gap-2 shadow-lg"
                >
                  <Users className="w-5 h-5" />
                  Ajouter des employés
                </Link>
                
                <Link
                  to="/company/settings"
                  className="px-8 py-4 bg-white text-[#1A1A1A] rounded-full font-medium border-2 border-[#1A1A1A] hover:bg-[#F5F1ED] transition-all inline-flex items-center gap-2"
                >
                  <Settings className="w-5 h-5" />
                  Configuration
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Avantages programme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-8 border-2 border-[#D4C5B9]"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif italic text-[#1A1A1A] mb-3">
              Votre programme de bien-être M.O.N.A
            </h2>
            <p className="text-[#1A1A1A]/60 max-w-2xl mx-auto">
              Une solution complète pensée pour l'Afrique francophone
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-[#A68B6F]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-[#A68B6F]" />
                </div>
                <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-[#1A1A1A]/60">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-[#A68B6F] to-[#C9A884] rounded-3xl p-8 text-white"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-serif italic mb-2">
                Besoin d'aide pour démarrer ?
              </h3>
              <p className="text-white/90">
                Notre équipe est là pour vous accompagner dans la mise en place
              </p>
            </div>
            <a
              href="mailto:entreprises@monafrica.net"
              className="px-8 py-4 bg-white text-[#1A1A1A] rounded-full font-medium hover:bg-[#F5F1ED] transition-all whitespace-nowrap"
            >
              Contacter le support
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
}