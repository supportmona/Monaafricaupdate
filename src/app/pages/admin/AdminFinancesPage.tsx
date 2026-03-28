import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  DollarSign, TrendingUp, Download, CreditCard, CheckCircle,
  Clock, ArrowDownRight, LayoutDashboard, Users, BarChart3,
  Settings, RefreshCw, AlertCircle, Loader2, Calendar,
} from "lucide-react";

const API = `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81`;

export default function AdminFinancesPage() {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<"XOF" | "USD">("XOF");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadFinances(); }, []);

  const loadFinances = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/analytics`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.data || null);
      } else {
        setError("Impossible de charger les données financières");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#A68B6F] animate-spin mx-auto mb-3" />
          <p className="text-[#1A1A1A]/60 text-sm">Chargement des finances...</p>
        </div>
      </div>
    );
  }

  const revenue = data?.revenueStats;
  const consultations = data?.consultationStats;
  const topExperts = data?.topExperts || [];

  const noData = !revenue && !consultations;

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
                <h1 className="text-lg font-serif text-[#1A1A1A]">Finances</h1>
                <p className="text-xs text-[#1A1A1A]/60">Données réelles</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrency(currency === "XOF" ? "USD" : "XOF")}
                className="px-4 py-2 border border-[#D4C5B9] bg-white rounded-full text-sm font-medium hover:bg-[#F5F1ED] transition-colors">
                {currency}
              </button>
              <button onClick={loadFinances} className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
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

        {noData ? (
          <div className="bg-white rounded-3xl p-12 border border-[#D4C5B9] text-center">
            <DollarSign className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">Pas encore de données financières</h3>
            <p className="text-sm text-[#1A1A1A]/60">
              Les données apparaîtront dès que des paiements seront enregistrés sur la plateforme.
            </p>
          </div>
        ) : (
          <>
            {/* Revenus principaux */}
            {revenue && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 sm:p-8 text-white">
                <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-4">
                  Revenus totaux
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-light">
                    {currency === "XOF"
                      ? (revenue.thisMonth?.XOF || 0).toLocaleString("fr-FR")
                      : (revenue.thisMonth?.USD || 0).toLocaleString()}
                  </span>
                  <span className="text-2xl text-white/60">{currency}</span>
                </div>
                <p className="text-sm text-white/80 mb-2">Ce mois</p>
                {revenue.growth && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-lg font-medium">{revenue.growth}</span>
                    <span className="text-sm text-white/80">vs mois dernier</span>
                  </div>
                )}
                <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 mt-4">
                  <div>
                    <p className="text-sm text-white/70 mb-1">MRR</p>
                    <p className="text-2xl font-light">
                      {currency === "XOF"
                        ? (revenue.mrr?.XOF || 0).toLocaleString("fr-FR")
                        : (revenue.mrr?.USD || 0).toLocaleString()} {currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70 mb-1">Cette année</p>
                    <p className="text-2xl font-light">
                      {currency === "XOF"
                        ? `${((revenue.thisYear?.XOF || 0) / 1000000).toFixed(1)}M`
                        : `${((revenue.thisYear?.USD || 0) / 1000).toFixed(0)}K`} {currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70 mb-1">Mois précédent</p>
                    <p className="text-2xl font-light">
                      {currency === "XOF"
                        ? `${((revenue.lastMonth?.XOF || 0) / 1000).toFixed(0)}K`
                        : `${revenue.lastMonth?.USD || 0}`} {currency}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Stats consultations */}
            {consultations && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
                <h3 className="text-xl font-serif text-[#1A1A1A] mb-4">Consultations & revenus associés</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Total consultations", value: consultations.total || 0, color: "text-[#1A1A1A]" },
                    { label: "Terminées (payées)", value: consultations.completed || 0, color: "text-green-600" },
                    { label: "En attente", value: consultations.scheduled || 0, color: "text-blue-600" },
                    { label: "Durée moyenne", value: `${consultations.averageDuration || 0} min`, color: "text-[#A68B6F]" },
                  ].map((s, i) => (
                    <div key={i} className="bg-[#F5F1ED] rounded-2xl p-4 text-center">
                      <p className={`text-2xl font-light ${s.color} mb-1`}>{s.value}</p>
                      <p className="text-xs text-[#1A1A1A]/60">{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Paiements experts */}
            {topExperts.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-serif text-[#1A1A1A]">Revenus par expert</h3>
                </div>
                <div className="space-y-3">
                  {topExperts.map((expert: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A]">{expert.name}</p>
                          <p className="text-xs text-[#1A1A1A]/60">{expert.sessions} sessions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-[#1A1A1A]">
                          {currency === "XOF"
                            ? `${((expert.revenue?.XOF || 0) / 1000).toFixed(0)}K XOF`
                            : `${expert.revenue?.USD || 0} USD`}
                        </p>
                        <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Actif</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Info intégration paiements */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Intégration paiements</p>
                  <p className="text-xs text-blue-700">
                    Les paiements Stripe et Flutterwave sont en cours d'intégration. 
                    Les transactions apparaîtront ici automatiquement une fois configurés.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {[
              { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", path: "/admin/dashboard" },
              { icon: <Users className="w-5 h-5" />, label: "Utilisateurs", path: "/admin/users" },
              { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", path: "/admin/analytics" },
              { icon: <Settings className="w-5 h-5" />, label: "Paramètres", path: "/admin/settings" },
            ].map((item, i) => (
              <button key={i} onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
                <div className="w-10 h-10 flex items-center justify-center">{item.icon}</div>
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div className="h-20" />
    </div>
  );
}
