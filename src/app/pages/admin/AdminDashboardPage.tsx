import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { 
  LayoutDashboard,
  Users,
  Building2,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Video,
  Globe,
  Settings,
  BarChart3,
  ShieldCheck,
  Zap,
  LogOut,
  Bell,
} from "lucide-react";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<"XOF" | "USD">("XOF");
  const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("month");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/admin/analytics`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setAnalyticsData(result.data);
        console.log('✅ Analytics chargées:', result.data);
      } else {
        console.error('❌ Erreur analytics:', result.error);
      }
    } catch (error) {
      console.error('❌ Erreur chargement analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    navigate("/admin/login");
  };

  // Utiliser les données mockées si pas encore chargées
  const platformStats = analyticsData?.platformStats || {
    totalUsers: 0,
    totalExperts: 0,
    totalCompanies: 0,
    activeUsers: 0,
    growth: {
      users: "+0%",
      experts: "+0%",
      companies: "+0%"
    }
  };

  const revenueStats = analyticsData?.revenueStats || {
    thisMonth: { XOF: 0, USD: 0 },
    lastMonth: { XOF: 0, USD: 0 },
    thisYear: { XOF: 0, USD: 0 },
    mrr: { XOF: 0, USD: 0 },
    growth: "+0%"
  };

  const consultationStats = analyticsData?.consultationStats || {
    total: 0,
    completed: 0,
    scheduled: 0,
    cancelled: 0,
    averageDuration: 0,
    satisfactionRate: 0
  };

  const recentActivity = analyticsData?.recentActivity || [];
  const topExperts = analyticsData?.topExperts || [];
  const topCompanies = analyticsData?.topCompanies || [];
  const systemHealth = analyticsData?.systemHealth || {
    uptime: 0,
    responseTime: 0,
    activeServers: 0,
    totalServers: 0,
    apiCalls: 0,
    errors: 0
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "company": return <Building2 className="w-5 h-5 text-blue-600" />;
      case "expert": return <Stethoscope className="w-5 h-5 text-purple-600" />;
      case "payment": return <DollarSign className="w-5 h-5 text-green-600" />;
      case "user": return <Users className="w-5 h-5 text-orange-600" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#A68B6F] to-[#D4A574] rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-serif text-[#1A1A1A]">Admin M.O.N.A</h1>
                <p className="text-xs text-[#1A1A1A]/60">Tableau de bord</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex bg-white rounded-full p-1 border border-[#D4C5B9]">
                <button
                  onClick={() => setTimeRange("today")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    timeRange === "today" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
                  }`}
                >
                  Aujourd'hui
                </button>
                <button
                  onClick={() => setTimeRange("week")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    timeRange === "week" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
                  }`}
                >
                  Semaine
                </button>
                <button
                  onClick={() => setTimeRange("month")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    timeRange === "month" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
                  }`}
                >
                  Mois
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-full text-sm font-medium transition-colors"
              >
                <LogOut className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Stats principales */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border border-[#D4C5B9]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-3xl font-light text-[#1A1A1A] mb-1">{platformStats.totalUsers.toLocaleString()}</p>
            <p className="text-sm text-[#1A1A1A]/60 mb-2">Utilisateurs totaux</p>
            <p className="text-xs text-green-600">{platformStats.growth.users} ce mois</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-5 border border-[#D4C5B9]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-purple-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-3xl font-light text-[#1A1A1A] mb-1">{platformStats.totalExperts}</p>
            <p className="text-sm text-[#1A1A1A]/60 mb-2">Experts actifs</p>
            <p className="text-xs text-green-600">{platformStats.growth.experts}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 border border-[#D4C5B9]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-green-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-3xl font-light text-[#1A1A1A] mb-1">{platformStats.totalCompanies}</p>
            <p className="text-sm text-[#1A1A1A]/60 mb-2">Entreprises clientes</p>
            <p className="text-xs text-green-600">{platformStats.growth.companies}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 border border-[#D4C5B9]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-3xl font-light text-[#1A1A1A] mb-1">{platformStats.activeUsers.toLocaleString()}</p>
            <p className="text-sm text-[#1A1A1A]/60 mb-2">Utilisateurs actifs</p>
            <p className="text-xs text-[#1A1A1A]/60">{Math.round((platformStats.activeUsers / platformStats.totalUsers) * 100)}% du total</p>
          </motion.div>
        </div>

        {/* Revenus et consultations */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-6 text-white"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                  REVENUS
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-light">
                    {currency === "XOF" 
                      ? revenueStats.thisMonth.XOF.toLocaleString() 
                      : revenueStats.thisMonth.USD.toLocaleString()}
                  </span>
                  <span className="text-lg text-white/60">{currency}</span>
                </div>
                <p className="text-sm text-white/70 mb-2">Ce mois</p>
                <p className="text-sm text-green-400">{revenueStats.growth} vs mois dernier</p>
              </div>
              <button
                onClick={() => setCurrency(currency === "XOF" ? "USD" : "XOF")}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
              >
                {currency}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-sm text-white/60 mb-1">MRR</p>
                <p className="text-xl font-light">
                  {currency === "XOF" 
                    ? revenueStats.mrr.XOF.toLocaleString() 
                    : revenueStats.mrr.USD.toLocaleString()} {currency}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Cette année</p>
                <p className="text-xl font-light">
                  {currency === "XOF" 
                    ? (revenueStats.thisYear.XOF / 1000000).toFixed(1) + "M"
                    : (revenueStats.thisYear.USD / 1000).toFixed(0) + "K"} {currency}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Consultations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#A68B6F]/10 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-[#A68B6F]" />
              </div>
              <h3 className="text-xl font-serif text-[#1A1A1A]">Consultations</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-[#F5F1ED] rounded-xl">
                <p className="text-2xl font-light text-[#1A1A1A] mb-1">{consultationStats.total}</p>
                <p className="text-xs text-[#1A1A1A]/60">Total ce mois</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-2xl font-light text-green-600 mb-1">{consultationStats.completed}</p>
                <p className="text-xs text-green-700/60">Terminées</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#1A1A1A]/60">Planifiées</span>
                <span className="font-medium text-[#1A1A1A]">{consultationStats.scheduled}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#1A1A1A]/60">Durée moyenne</span>
                <span className="font-medium text-[#1A1A1A]">{consultationStats.averageDuration} min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#1A1A1A]/60">Satisfaction</span>
                <span className="font-medium text-[#1A1A1A]">{consultationStats.satisfactionRate}/5</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activité récente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Activité récente</h3>

          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 p-4 rounded-2xl border ${
                  activity.urgent
                    ? "bg-orange-50 border-orange-200"
                    : "bg-[#F5F1ED] border-[#D4C5B9]"
                }`}
              >
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1A1A] mb-1">{activity.action}</p>
                  <p className="text-sm text-[#1A1A1A]/60 mb-2">{activity.description}</p>
                  <p className="text-xs text-[#1A1A1A]/40">{activity.time}</p>
                </div>
                {activity.urgent && (
                  <span className="px-2 py-0.5 bg-orange-200 text-orange-800 rounded-full text-xs font-medium">
                    Urgent
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top performers */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top experts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
          >
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Top Experts</h3>

            <div className="space-y-3">
              {topExperts.map((expert, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">{expert.name}</p>
                      <p className="text-xs text-[#1A1A1A]/60">{expert.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#1A1A1A]">{expert.sessions} sessions</p>
                    <p className="text-xs text-[#D4A574]">
                      {currency === "XOF" 
                        ? (expert.revenue.XOF / 1000).toFixed(0) + "K"
                        : expert.revenue.USD.toLocaleString()} {currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top entreprises */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
          >
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Top Entreprises</h3>

            <div className="space-y-3">
              {topCompanies.map((company, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">{company.name}</p>
                      <p className="text-xs text-[#1A1A1A]/60">{company.employees} employés • {company.engagement}% engagement</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {currency === "XOF" 
                        ? (company.revenue.XOF / 1000000).toFixed(1) + "M"
                        : (company.revenue.USD / 1000).toFixed(0) + "K"} {currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Santé du système */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-serif text-[#1A1A1A]">Santé du système</h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Opérationnel</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-[#F5F1ED] rounded-xl">
              <p className="text-2xl font-light text-green-600 mb-1">{systemHealth.uptime}%</p>
              <p className="text-xs text-[#1A1A1A]/60">Uptime</p>
            </div>
            <div className="text-center p-3 bg-[#F5F1ED] rounded-xl">
              <p className="text-2xl font-light text-[#1A1A1A] mb-1">{systemHealth.responseTime}ms</p>
              <p className="text-xs text-[#1A1A1A]/60">Latence</p>
            </div>
            <div className="text-center p-3 bg-[#F5F1ED] rounded-xl">
              <p className="text-2xl font-light text-[#1A1A1A] mb-1">{systemHealth.activeServers}/{systemHealth.totalServers}</p>
              <p className="text-xs text-[#1A1A1A]/60">Serveurs</p>
            </div>
            <div className="text-center p-3 bg-[#F5F1ED] rounded-xl">
              <p className="text-2xl font-light text-[#1A1A1A] mb-1">{(systemHealth.apiCalls / 1000).toFixed(0)}K</p>
              <p className="text-xs text-[#1A1A1A]/60">API calls</p>
            </div>
            <div className="text-center p-3 bg-[#F5F1ED] rounded-xl">
              <p className="text-2xl font-light text-orange-600 mb-1">{systemHealth.errors}</p>
              <p className="text-xs text-[#1A1A1A]/60">Erreurs</p>
            </div>
            <div className="text-center p-3 bg-[#F5F1ED] rounded-xl">
              <p className="text-2xl font-light text-blue-600 mb-1">3</p>
              <p className="text-xs text-[#1A1A1A]/60">Régions</p>
            </div>
          </div>
        </motion.div>

      </main>

      {/* Navigation PWA Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] safe-area-inset-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button 
              onClick={() => navigate("/admin/dashboard")}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]"
            >
              <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium">Dashboard</span>
            </button>
            <button 
              onClick={() => navigate("/admin/users")}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs">Utilisateurs</span>
            </button>
            <button 
              onClick={() => navigate("/admin/analytics")}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-xs">Analytics</span>
            </button>
            <button 
              onClick={() => navigate("/admin/settings")}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-xs">Paramètres</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="h-20"></div>
    </div>
  );
}