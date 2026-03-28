import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  BarChart3, TrendingUp, TrendingDown, Users, DollarSign,
  Activity, Globe, MapPin, LayoutDashboard, Settings,
  RefreshCw, AlertCircle, Loader2,
} from "lucide-react";

const API = `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81`;

export default function AdminAnalyticsPage() {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<"XOF" | "USD">("XOF");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => { loadAnalytics(); }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [analyticsRes, usersRes] = await Promise.all([
        fetch(`${API}/admin/analytics`, { headers: { Authorization: `Bearer ${publicAnonKey}` } }),
        fetch(`${API}/admin/users-sql/stats`, { headers: { Authorization: `Bearer ${publicAnonKey}` } }),
      ]);

      const analytics = analyticsRes.ok ? await analyticsRes.json() : null;
      const users = usersRes.ok ? await usersRes.json() : null;

      setData({
        platform: analytics?.data?.platformStats || null,
        revenue: analytics?.data?.revenueStats || null,
        consultations: analytics?.data?.consultationStats || null,
        topExperts: analytics?.data?.topExperts || [],
        topCompanies: analytics?.data?.topCompanies || [],
        recentActivity: analytics?.data?.recentActivity || [],
        userStats: users?.success ? users.stats : null,
      });
    } catch {
      setError("Erreur lors du chargement des analytics");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#A68B6F] animate-spin mx-auto mb-3" />
          <p className="text-[#1A1A1A]/60 text-sm">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  const platform = data?.platform;
  const revenue = data?.revenue;
  const consultations = data?.consultations;
  const userStats = data?.userStats;

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/admin/dashboard")}
                className="w-10 h-10 hover:bg-[#F5F1ED] rounded-full flex items-center justify-center transition-colors">
                <LayoutDashboard className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <div>
                <h1 className="text-lg font-serif text-[#1A1A1A]">Analytics</h1>
                <p className="text-xs text-[#1A1A1A]/60">Données réelles de la plateforme</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrency(currency === "XOF" ? "USD" : "XOF")}
                className="px-4 py-2 border border-[#D4C5B9] bg-white rounded-full text-sm font-medium hover:bg-[#F5F1ED] transition-colors">
                {currency}
              </button>
              <button onClick={loadAnalytics} className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
                <RefreshCw className="w-5 h-5 text-[#1A1A1A]/60" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* KPIs réels */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: <Users className="w-8 h-8" />, bg: "from-blue-500 to-blue-600",
              value: platform?.totalUsers || userStats?.total || 0,
              label: "Membres", sub: `${platform?.activeUsers || userStats?.active || 0} actifs`,
            },
            {
              icon: <DollarSign className="w-8 h-8" />, bg: "from-green-500 to-green-600",
              value: revenue
                ? currency === "XOF"
                  ? `${(revenue.thisMonth?.XOF / 1000 || 0).toFixed(0)}K XOF`
                  : `${(revenue.thisMonth?.USD || 0).toFixed(0)} USD`
                : "—",
              label: "Revenus ce mois", sub: revenue?.growth || "Pas de données",
            },
            {
              icon: <Activity className="w-8 h-8" />, bg: "from-purple-500 to-purple-600",
              value: consultations?.total || 0,
              label: "Consultations", sub: `${consultations?.completed || 0} terminées`,
            },
            {
              icon: <Globe className="w-8 h-8" />, bg: "from-orange-500 to-orange-600",
              value: platform?.totalExperts || 0,
              label: "Experts", sub: "Approuvés",
            },
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`bg-gradient-to-br ${kpi.bg} rounded-2xl p-5 text-white`}>
              <div className="flex items-center justify-between mb-3">
                {kpi.icon}
                <TrendingUp className="w-5 h-5 opacity-70" />
              </div>
              <p className="text-3xl font-light mb-1">{kpi.value}</p>
              <p className="text-sm opacity-90 mb-1">{kpi.label}</p>
              <p className="text-xs opacity-70">{kpi.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats utilisateurs détaillées */}
        {userStats && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Répartition des membres</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total membres", value: userStats.total, color: "text-[#1A1A1A]", bg: "bg-[#F5F1ED]" },
                { label: "Actifs", value: userStats.active, color: "text-green-600", bg: "bg-green-50" },
                { label: "Suspendus", value: userStats.suspended, color: "text-red-500", bg: "bg-red-50" },
                { label: "Membres Cercle", value: userStats.cercleMembers, color: "text-purple-600", bg: "bg-purple-50" },
              ].map((s, i) => (
                <div key={i} className={`${s.bg} rounded-2xl p-5 text-center`}>
                  <p className={`text-3xl font-light ${s.color} mb-1`}>{s.value}</p>
                  <p className="text-xs text-[#1A1A1A]/60">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Revenus */}
        {revenue && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-6 text-white">
            <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
              Revenus
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-white/60 mb-1">Ce mois</p>
                <p className="text-3xl font-light">
                  {currency === "XOF"
                    ? (revenue.thisMonth?.XOF || 0).toLocaleString("fr-FR")
                    : (revenue.thisMonth?.USD || 0).toLocaleString()} {currency}
                </p>
                <p className="text-sm text-green-400 mt-1">{revenue.growth || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">MRR</p>
                <p className="text-3xl font-light">
                  {currency === "XOF"
                    ? (revenue.mrr?.XOF || 0).toLocaleString("fr-FR")
                    : (revenue.mrr?.USD || 0).toLocaleString()} {currency}
                </p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Cette année</p>
                <p className="text-3xl font-light">
                  {currency === "XOF"
                    ? `${((revenue.thisYear?.XOF || 0) / 1000000).toFixed(1)}M`
                    : `${((revenue.thisYear?.USD || 0) / 1000).toFixed(0)}K`} {currency}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Consultations */}
        {consultations && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Consultations</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total", value: consultations.total || 0, color: "text-[#1A1A1A]" },
                { label: "Terminées", value: consultations.completed || 0, color: "text-green-600" },
                { label: "Planifiées", value: consultations.scheduled || 0, color: "text-blue-600" },
                { label: "Annulées", value: consultations.cancelled || 0, color: "text-red-500" },
              ].map((s, i) => (
                <div key={i} className="bg-[#F5F1ED] rounded-2xl p-4 text-center">
                  <p className={`text-2xl font-light ${s.color} mb-1`}>{s.value}</p>
                  <p className="text-xs text-[#1A1A1A]/60">{s.label}</p>
                </div>
              ))}
            </div>
            {consultations.satisfactionRate > 0 && (
              <div className="mt-4 p-4 bg-[#F5F1ED] rounded-2xl flex items-center justify-between">
                <span className="text-sm text-[#1A1A1A]/60">Satisfaction moyenne</span>
                <span className="text-lg font-light text-[#A68B6F]">{consultations.satisfactionRate} / 5</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Top experts */}
        {data?.topExperts?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-4">Top Experts</h3>
            <div className="space-y-3">
              {data.topExperts.map((expert: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">{expert.name}</p>
                      <p className="text-xs text-[#1A1A1A]/60">{expert.specialty}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#1A1A1A]">{expert.sessions} sessions</p>
                    <p className="text-xs text-[#A68B6F]">
                      {currency === "XOF"
                        ? `${((expert.revenue?.XOF || 0) / 1000).toFixed(0)}K XOF`
                        : `${expert.revenue?.USD || 0} USD`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Activité récente */}
        {data?.recentActivity?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-4">Activité récente</h3>
            <div className="space-y-3">
              {data.recentActivity.map((activity: any, i: number) => (
                <div key={i} className={`p-4 rounded-2xl border ${activity.urgent ? "bg-orange-50 border-orange-200" : "bg-[#F5F1ED] border-[#D4C5B9]"}`}>
                  <p className="text-sm font-medium text-[#1A1A1A]">{activity.action}</p>
                  <p className="text-xs text-[#1A1A1A]/60 mt-1">{activity.description}</p>
                  <p className="text-xs text-[#1A1A1A]/40 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Message si pas de données */}
        {!platform && !userStats && !revenue && !isLoading && (
          <div className="bg-white rounded-3xl p-12 border border-[#D4C5B9] text-center">
            <BarChart3 className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">Pas encore de données</h3>
            <p className="text-sm text-[#1A1A1A]/60">
              Les analytics apparaîtront dès que des membres et des consultations seront enregistrés.
            </p>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {[
              { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", path: "/admin/dashboard" },
              { icon: <Users className="w-5 h-5" />, label: "Utilisateurs", path: "/admin/users" },
              { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", path: "/admin/analytics", active: true },
              { icon: <Settings className="w-5 h-5" />, label: "Paramètres", path: "/admin/settings" },
            ].map((item, i) => (
              <button key={i} onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 transition-colors ${(item as any).active ? "text-[#1A1A1A]" : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"}`}>
                {(item as any).active
                  ? <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white">{item.icon}</div>
                  : <div className="w-10 h-10 flex items-center justify-center">{item.icon}</div>}
                <span className={`text-xs ${(item as any).active ? "font-medium" : ""}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div className="h-20" />
    </div>
  );
}
