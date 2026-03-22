import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Globe,
  MapPin,
  Calendar,
  LayoutDashboard,
  Settings,
} from "lucide-react";

export default function AdminAnalyticsPage() {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<"XOF" | "USD">("XOF");
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  const revenueData = {
    current: { XOF: 45678000, USD: 76130 },
    previous: { XOF: 38234000, USD: 63723 },
    growth: "+19.5%",
  };

  const userGrowth = [
    { month: "Août", users: 1245 },
    { month: "Sept", users: 1589 },
    { month: "Oct", users: 2012 },
    { month: "Nov", users: 2567 },
    { month: "Déc", users: 3245 },
    { month: "Jan", users: 4123 },
    { month: "Fév", users: 4890 },
  ];

  const geographicData = [
    { country: "RDC", users: 5678, percentage: 45.6, revenue: { XOF: 18900000, USD: 31500 } },
    { country: "Sénégal", users: 3456, percentage: 27.8, revenue: { XOF: 15300000, USD: 25500 } },
    { country: "Côte d'Ivoire", users: 2145, percentage: 17.2, revenue: { XOF: 9450000, USD: 15750 } },
    { country: "Cameroun", users: 789, percentage: 6.3, revenue: { XOF: 3780000, USD: 6300 } },
    { country: "Autres", users: 390, percentage: 3.1, revenue: { XOF: 1575000, USD: 2625 } },
  ];

  const expertPerformance = [
    { category: "Psychologie Clinique", sessions: 1234, satisfaction: 4.8 },
    { category: "Thérapie de Couple", sessions: 987, satisfaction: 4.7 },
    { category: "Psychiatrie", sessions: 756, satisfaction: 4.9 },
    { category: "Psychologie du Travail", sessions: 543, satisfaction: 4.6 },
    { category: "Thérapie Familiale", sessions: 432, satisfaction: 4.7 },
  ];

  const conversionFunnel = [
    { stage: "Visiteurs", count: 45678, percentage: 100 },
    { stage: "Inscriptions", count: 12458, percentage: 27.3 },
    { stage: "Profils complétés", count: 9876, percentage: 79.3 },
    { stage: "1ère consultation", count: 5432, percentage: 55.0 },
    { stage: "Membres actifs", count: 3456, percentage: 63.6 },
  ];

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="w-10 h-10 hover:bg-[#F5F1ED] rounded-full flex items-center justify-center transition-colors"
              >
                <LayoutDashboard className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <div>
                <h1 className="text-lg font-serif text-[#1A1A1A]">Analytics</h1>
                <p className="text-xs text-[#1A1A1A]/60">Vue d'ensemble des performances</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="inline-flex bg-white rounded-full p-1 border border-[#D4C5B9]">
                <button
                  onClick={() => setPeriod("week")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    period === "week" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
                  }`}
                >
                  Semaine
                </button>
                <button
                  onClick={() => setPeriod("month")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    period === "month" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
                  }`}
                >
                  Mois
                </button>
                <button
                  onClick={() => setPeriod("year")}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    period === "year" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
                  }`}
                >
                  Année
                </button>
              </div>
              <button
                onClick={() => setCurrency(currency === "XOF" ? "USD" : "XOF")}
                className="px-4 py-2 bg-white border border-[#D4C5B9] rounded-full text-sm font-medium hover:bg-[#F5F1ED] transition-colors"
              >
                {currency}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white"
          >
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-light mb-1">12,458</p>
            <p className="text-sm opacity-90 mb-2">Total utilisateurs</p>
            <p className="text-xs opacity-75">+18.5% vs mois dernier</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white"
          >
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-light mb-1">
              {currency === "XOF"
                ? `${(revenueData.current.XOF / 1000000).toFixed(1)}M`
                : `${(revenueData.current.USD / 1000).toFixed(0)}K`}
            </p>
            <p className="text-sm opacity-90 mb-2">Revenus {period === "month" ? "ce mois" : "cette période"}</p>
            <p className="text-xs opacity-75">{revenueData.growth}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 text-white"
          >
            <div className="flex items-center justify-between mb-3">
              <Activity className="w-8 h-8" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-light mb-1">3,456</p>
            <p className="text-sm opacity-90 mb-2">Consultations</p>
            <p className="text-xs opacity-75">+12.3%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white"
          >
            <div className="flex items-center justify-between mb-3">
              <Globe className="w-8 h-8" />
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-3xl font-light mb-1">5</p>
            <p className="text-sm opacity-90 mb-2">Pays couverts</p>
            <p className="text-xs opacity-75">Afrique francophone</p>
          </motion.div>
        </div>

        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Croissance utilisateurs</h3>

          <div className="space-y-3">
            {userGrowth.map((data, index) => {
              const maxUsers = Math.max(...userGrowth.map((d) => d.users));
              const percentage = (data.users / maxUsers) * 100;

              return (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[#1A1A1A] w-16">{data.month}</span>
                  <div className="flex-1 bg-[#F5F1ED] rounded-full h-10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-[#A68B6F] to-[#D4A574] flex items-center justify-end pr-3"
                    >
                      <span className="text-sm font-medium text-white">{data.users}</span>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Distribution géographique</h3>

          <div className="space-y-4">
            {geographicData.map((country, index) => (
              <div key={index} className="p-4 bg-[#F5F1ED] rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#A68B6F]" />
                    <span className="font-medium text-[#1A1A1A]">{country.country}</span>
                  </div>
                  <span className="text-sm text-[#1A1A1A]/60">{country.percentage}%</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#1A1A1A]/60 mb-1">Utilisateurs</p>
                    <p className="font-medium text-[#1A1A1A]">{country.users.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-[#1A1A1A]/60 mb-1">Revenus</p>
                    <p className="font-medium text-[#1A1A1A]">
                      {currency === "XOF"
                        ? `${(country.revenue.XOF / 1000000).toFixed(1)}M XOF`
                        : `${(country.revenue.USD / 1000).toFixed(0)}K USD`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Expert Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Performance par spécialité</h3>

          <div className="space-y-3">
            {expertPerformance.map((cat, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl">
                <div className="flex-1">
                  <p className="font-medium text-[#1A1A1A] mb-1">{cat.category}</p>
                  <p className="text-sm text-[#1A1A1A]/60">{cat.sessions} consultations</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#1A1A1A]/60 mb-1">Satisfaction</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < Math.floor(cat.satisfaction) ? "bg-[#D4A574]" : "bg-[#D4C5B9]"
                          }`}
                        ></div>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-[#1A1A1A]">{cat.satisfaction}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Funnel de conversion</h3>

          <div className="space-y-4">
            {conversionFunnel.map((stage, index) => {
              const width = stage.percentage;
              const isLast = index === conversionFunnel.length - 1;

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#1A1A1A]">{stage.stage}</span>
                    <span className="text-sm text-[#1A1A1A]/60">
                      {stage.count.toLocaleString()} ({stage.percentage}%)
                    </span>
                  </div>
                  <div className="bg-[#F5F1ED] rounded-full h-8 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      className={`h-full flex items-center justify-center text-xs font-medium text-white ${
                        isLast
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : "bg-gradient-to-r from-[#A68B6F] to-[#D4A574]"
                      }`}
                    >
                      {width > 20 && `${stage.percentage}%`}
                    </motion.div>
                  </div>
                  {index < conversionFunnel.length - 1 && (
                    <div className="flex items-center justify-center my-2">
                      <TrendingDown className="w-4 h-4 text-[#1A1A1A]/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </main>

      {/* Navigation Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] safe-area-inset-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs">Dashboard</span>
            </button>
            <button
              onClick={() => navigate("/admin/users")}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">Utilisateurs</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]">
              <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium">Analytics</span>
            </button>
            <button
              onClick={() => navigate("/admin/settings")}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs">Paramètres</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="h-20"></div>
    </div>
  );
}
