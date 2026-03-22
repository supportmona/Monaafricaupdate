import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  Building,
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  Settings,
  Bell,
  Search,
  Download,
  Filter,
  BarChart3,
  Activity,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserPlus,
  CreditCard,
  FileText,
  Award,
  ChevronRight,
  TrendingDown,
  Minus,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function EntrepriseDashboardPage() {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<"XOF" | "USD">("XOF");
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simuler le chargement des données entreprise
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // TODO: Remplacer par l'appel API réel
      setTimeout(() => {
        setStats({
          totalEmployees: 247,
          activeUsers: 189,
          consultationsThisMonth: 43,
          creditsRemaining: 156,
          wellbeingScore: 7.8,
          alerts: 3,
        });
        setIsLoading(false);
      }, 1000);
    };
    loadData();
  }, []);

  const formatPrice = (priceXOF: number, priceUSD: number) => {
    if (currency === "XOF") {
      return `${priceXOF.toLocaleString("fr-FR")} XOF`;
    }
    return `$${priceUSD.toLocaleString("en-US")}`;
  };

  const mainStats = [
    {
      label: "Collaborateurs inscrits",
      value: stats?.activeUsers || 0,
      total: stats?.totalEmployees || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      trend: "+12 ce mois",
      trendDirection: "up",
    },
    {
      label: "Consultations ce mois",
      value: stats?.consultationsThisMonth || 0,
      icon: Calendar,
      color: "from-terracotta to-red-500",
      trend: "+8 vs. mois dernier",
      trendDirection: "up",
    },
    {
      label: "Crédits disponibles",
      value: stats?.creditsRemaining || 0,
      icon: CreditCard,
      color: "from-gold to-yellow-600",
      trend: "156 / 200",
      trendDirection: "neutral",
    },
    {
      label: "Score bien-être moyen",
      value: stats?.wellbeingScore?.toFixed(1) || "0.0",
      icon: Heart,
      color: "from-green-500 to-green-600",
      trend: "+0.3 ce mois",
      trendDirection: "up",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "consultation",
      user: "Collaborateur A.",
      action: "Consultation planifiée",
      date: "2025-02-11 14:30",
      status: "scheduled",
    },
    {
      id: 2,
      type: "signup",
      user: "Collaborateur B.",
      action: "Nouvel inscrit",
      date: "2025-02-11 10:15",
      status: "completed",
    },
    {
      id: 3,
      type: "consultation",
      user: "Collaborateur C.",
      action: "Consultation terminée",
      date: "2025-02-10 16:00",
      status: "completed",
    },
    {
      id: 4,
      type: "alert",
      user: "Département Marketing",
      action: "Signal bien-être en baisse",
      date: "2025-02-10 09:00",
      status: "alert",
    },
  ];

  const departmentStats = [
    { name: "Tech & Produit", employees: 45, activeUsers: 38, score: 8.2, trend: "up" },
    { name: "Marketing & Comm", employees: 32, activeUsers: 28, score: 7.5, trend: "down" },
    { name: "Ventes", employees: 58, activeUsers: 47, score: 7.9, trend: "up" },
    { name: "Operations", employees: 41, activeUsers: 35, score: 8.0, trend: "neutral" },
    { name: "Finance", employees: 28, activeUsers: 22, score: 7.6, trend: "up" },
    { name: "RH", employees: 15, activeUsers: 13, score: 8.3, trend: "up" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-anthracite/60">Chargement de votre espace entreprise...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige">
      {/* Header */}
      <div className="bg-white border-b border-anthracite/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta to-gold rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-serif text-anthracite">
                  Entreprise <span className="text-terracotta italic">Dashboard</span>
                </h1>
                <p className="text-xs text-anthracite/60">SafariCom Congo SARL</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Currency Toggle */}
              <div className="flex items-center gap-2 bg-beige rounded-full p-1">
                <button
                  onClick={() => setCurrency("XOF")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    currency === "XOF"
                      ? "bg-white text-anthracite shadow-sm"
                      : "text-anthracite/50 hover:text-anthracite"
                  }`}
                >
                  XOF
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    currency === "USD"
                      ? "bg-white text-anthracite shadow-sm"
                      : "text-anthracite/50 hover:text-anthracite"
                  }`}
                >
                  USD
                </button>
              </div>
              <button className="relative p-2.5 hover:bg-beige rounded-full transition-colors">
                <Bell className="w-5 h-5 text-anthracite" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta rounded-full"></span>
              </button>
              <button
                onClick={() => navigate("/entreprise/settings")}
                className="p-2.5 hover:bg-beige rounded-full transition-colors"
              >
                <Settings className="w-5 h-5 text-anthracite" />
              </button>
              <div className="h-8 w-px bg-anthracite/10"></div>
              <button
                onClick={() => navigate("/entreprise/login")}
                className="text-sm text-anthracite/70 hover:text-anthracite transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-anthracite/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-6">
            {[
              { id: "dashboard", label: "Vue d'ensemble", icon: BarChart3 },
              { id: "employees", label: "Collaborateurs", icon: Users },
              { id: "consultations", label: "Consultations", icon: Calendar },
              { id: "analytics", label: "Analytics", icon: Activity },
              { id: "billing", label: "Facturation", icon: CreditCard },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(`/entreprise/${tab.id}`)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-all ${
                  tab.id === "dashboard"
                    ? "border-terracotta text-anthracite"
                    : "border-transparent text-anthracite/50 hover:text-anthracite hover:border-anthracite/20"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Banner */}
        {stats?.alerts > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-900">
                  {stats.alerts} signaux nécessitent votre attention
                </p>
                <p className="text-xs text-yellow-700 mt-0.5">
                  Certains départements montrent une baisse du bien-être
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/entreprise/analytics")}
              className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-full hover:bg-yellow-700 transition-colors"
            >
              Voir les détails
            </button>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-anthracite/5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.trendDirection === "up" && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </span>
                )}
                {stat.trendDirection === "down" && (
                  <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">
                    <TrendingDown className="w-3 h-3" />
                    {stat.trend}
                  </span>
                )}
              </div>
              <p className="text-3xl font-serif text-anthracite mb-1">
                {stat.value}
                {stat.total && <span className="text-lg text-anthracite/40">/{stat.total}</span>}
              </p>
              <p className="text-sm text-anthracite/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Département Stats */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-anthracite/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-anthracite">Bien-être par département</h2>
              <button className="text-sm text-terracotta hover:underline flex items-center gap-1">
                Rapport complet
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 border border-anthracite/10 rounded-xl hover:bg-beige/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-anthracite">{dept.name}</h3>
                      <p className="text-sm text-anthracite/60 mt-0.5">
                        {dept.activeUsers}/{dept.employees} actifs
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-serif text-anthracite">{dept.score}</p>
                        <p className="text-xs text-anthracite/50">Score</p>
                      </div>
                      {dept.trend === "up" && <TrendingUp className="w-5 h-5 text-green-500" />}
                      {dept.trend === "down" && <TrendingDown className="w-5 h-5 text-red-500" />}
                      {dept.trend === "neutral" && <Minus className="w-5 h-5 text-anthracite/30" />}
                    </div>
                  </div>
                  <div className="w-full bg-anthracite/5 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-terracotta to-gold rounded-full transition-all"
                      style={{ width: `${(dept.activeUsers / dept.employees) * 100}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-2xl shadow-sm border border-anthracite/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-anthracite">Activité récente</h2>
              <button className="text-sm text-terracotta hover:underline">Tout voir</button>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="pb-3 border-b border-anthracite/5 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-anthracite">{activity.user}</p>
                      <p className="text-xs text-anthracite/60 mt-0.5">{activity.action}</p>
                    </div>
                    {activity.status === "completed" && (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    )}
                    {activity.status === "scheduled" && (
                      <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                    {activity.status === "alert" && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-anthracite/40">{activity.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <button
            onClick={() => navigate("/entreprise/employees")}
            className="bg-white p-6 rounded-2xl border border-anthracite/10 hover:border-terracotta hover:shadow-md transition-all text-left group"
          >
            <UserPlus className="w-8 h-8 text-terracotta mb-3" />
            <h3 className="text-lg font-serif text-anthracite mb-1 group-hover:text-terracotta transition-colors">
              Inviter des collaborateurs
            </h3>
            <p className="text-sm text-anthracite/60">
              Ajoutez de nouveaux membres à votre programme bien-être
            </p>
          </button>

          <button
            onClick={() => navigate("/entreprise/analytics")}
            className="bg-white p-6 rounded-2xl border border-anthracite/10 hover:border-terracotta hover:shadow-md transition-all text-left group"
          >
            <FileText className="w-8 h-8 text-terracotta mb-3" />
            <h3 className="text-lg font-serif text-anthracite mb-1 group-hover:text-terracotta transition-colors">
              Rapports mensuels
            </h3>
            <p className="text-sm text-anthracite/60">
              Consultez les analytics détaillés de vos équipes
            </p>
          </button>

          <button
            onClick={() => navigate("/entreprise/billing")}
            className="bg-white p-6 rounded-2xl border border-anthracite/10 hover:border-terracotta hover:shadow-md transition-all text-left group"
          >
            <CreditCard className="w-8 h-8 text-terracotta mb-3" />
            <h3 className="text-lg font-serif text-anthracite mb-1 group-hover:text-terracotta transition-colors">
              Gérer les crédits
            </h3>
            <p className="text-sm text-anthracite/60">
              Recharger ou redistribuer vos crédits consultations
            </p>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
