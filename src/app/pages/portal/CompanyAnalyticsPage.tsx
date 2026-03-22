import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useB2BAuth } from "@/app/contexts/B2BAuthContext";
import { CompanyHeader } from "@/app/components/CompanyHeader";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Heart,
  Activity,
  ArrowLeft,
  Download,
  ChevronDown,
  Loader2
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface Analytics {
  overview: {
    totalEmployees: number;
    activeUsers: number;
    totalConsultations: number;
    averageSatisfaction: number;
  };
  departments: Record<string, {
    employees: number;
    consultations: number;
    activeUsers: number;
  }>;
  monthly: Array<{
    month: string;
    consultations: number;
    satisfaction: number;
  }>;
  topConcerns: Array<{
    label: string;
    count: number;
    percentage: number;
  }>;
}

export default function CompanyAnalyticsPage() {
  const { user } = useB2BAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"3months" | "6months" | "1year">("3months");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const token = localStorage.getItem("mona_company_token");
      if (!token) {
        setLoading(false);
        return;
      }

      // MODE DÉMO : Générer des analytics fictives
      const generateMockAnalytics = () => {
        const departments = ["Tech", "RH", "Finance", "Marketing", "Opérations"];
        const concerns = [
          { label: "Stress au travail", count: 45 },
          { label: "Anxiété", count: 38 },
          { label: "Burn-out", count: 28 },
          { label: "Relations professionnelles", count: 22 },
          { label: "Équilibre vie pro/perso", count: 19 }
        ];

        const deptAnalytics: Record<string, any> = {};
        departments.forEach((dept, i) => {
          deptAnalytics[dept] = {
            employees: Math.floor(Math.random() * 20) + 10,
            consultations: Math.floor(Math.random() * 30) + 15,
            activeUsers: Math.floor(Math.random() * 15) + 8
          };
        });

        const monthlyData = [];
        const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
        for (let i = 0; i < 6; i++) {
          monthlyData.push({
            month: months[i],
            consultations: Math.floor(Math.random() * 50) + 30,
            nouveauxUtilisateurs: Math.floor(Math.random() * 15) + 5
          });
        }

        return {
          departments: deptAnalytics,
          topConcerns: concerns,
          monthlyTrends: monthlyData,
          overallSatisfaction: 4.6,
          totalConsultationsMonth: 87,
          averageWellbeing: 78
        };
      };

      // Simuler latence réseau
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setAnalytics(generateMockAnalytics());

      /* CODE API POUR PRODUCTION :
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/company/analytics`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Company-Token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
      */
    } catch (error) {
      console.error("Erreur chargement analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#A68B6F", "#C9A884", "#D4C5B9", "#8A7159", "#C67C5C"];

  const departmentData = analytics ? Object.entries(analytics.departments).map(([name, data]) => ({
    name,
    employees: data.employees,
    consultations: data.consultations,
    activeUsers: data.activeUsers,
  })) : [];

  const concernsData = analytics?.topConcerns.map((concern) => ({
    name: concern.label,
    value: concern.count,
  })) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#A68B6F] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <CompanyHeader
        showBackButton
        title="Analytics"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Employés inscrits",
              value: analytics?.overview.totalEmployees || 0,
              change: "+12%",
              trend: "up",
              icon: Users,
              color: "from-[#A68B6F] to-[#8A7159]"
            },
            {
              label: "Utilisateurs actifs",
              value: analytics?.overview.activeUsers || 0,
              change: "+8%",
              trend: "up",
              icon: Heart,
              color: "from-green-500 to-green-600"
            },
            {
              label: "Consultations",
              value: analytics?.overview.totalConsultations || 0,
              change: "+23%",
              trend: "up",
              icon: Calendar,
              color: "from-blue-500 to-blue-600"
            },
            {
              label: "Satisfaction moyenne",
              value: `${analytics?.overview.averageSatisfaction || 0}/5`,
              change: "+0.3",
              trend: "up",
              icon: Activity,
              color: "from-[#C67C5C] to-[#A86F5E]"
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border-2 border-[#D4C5B9]"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-light text-[#1A1A1A] mb-2">{stat.value}</p>
              <p className="text-sm text-[#1A1A1A]/60 mb-2">{stat.label}</p>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {stat.change} vs mois dernier
              </div>
            </motion.div>
          ))}
        </div>

        {/* Évolution mensuelle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 border-2 border-[#D4C5B9]"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-serif italic text-[#1A1A1A] mb-2">
                Évolution mensuelle
              </h2>
              <p className="text-sm text-[#1A1A1A]/60">
                Consultations et satisfaction sur les 3 derniers mois
              </p>
            </div>
            
            <div className="flex gap-2 bg-[#F5F1ED] p-1 rounded-full">
              {["3months", "6months", "1year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    timeRange === range
                      ? "bg-[#1A1A1A] text-white"
                      : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  {range === "3months" ? "3 mois" : range === "6months" ? "6 mois" : "1 an"}
                </button>
              ))}
            </div>
          </div>

          {analytics?.monthly && analytics.monthly.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D4C5B9" />
                <XAxis 
                  dataKey="month" 
                  stroke="#1A1A1A" 
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#1A1A1A" style={{ fontSize: "12px" }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "white", 
                    border: "2px solid #D4C5B9",
                    borderRadius: "12px",
                    padding: "12px"
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="consultations" 
                  stroke="#A68B6F" 
                  strokeWidth={3}
                  name="Consultations"
                  dot={{ fill: "#A68B6F", r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="satisfaction" 
                  stroke="#C67C5C" 
                  strokeWidth={3}
                  name="Satisfaction (sur 5)"
                  dot={{ fill: "#C67C5C", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-[#1A1A1A]/60">
              Données insuffisantes pour afficher le graphique
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Analytics par département */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-3xl p-8 border-2 border-[#D4C5B9]"
          >
            <h2 className="text-2xl font-serif italic text-[#1A1A1A] mb-6">
              Analytics par département
            </h2>

            {departmentData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D4C5B9" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#1A1A1A"
                    style={{ fontSize: "11px" }}
                  />
                  <YAxis stroke="#1A1A1A" style={{ fontSize: "12px" }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "white", 
                      border: "2px solid #D4C5B9",
                      borderRadius: "12px",
                      padding: "12px"
                    }}
                  />
                  <Legend />
                  <Bar dataKey="employees" fill="#A68B6F" name="Employés" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="activeUsers" fill="#C9A884" name="Actifs" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="consultations" fill="#D4C5B9" name="Consultations" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
                <p className="text-[#1A1A1A]/60">
                  Aucune donnée par département disponible
                </p>
              </div>
            )}
          </motion.div>

          {/* Préoccupations principales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-3xl p-8 border-2 border-[#D4C5B9]"
          >
            <h2 className="text-2xl font-serif italic text-[#1A1A1A] mb-6">
              Préoccupations principales
            </h2>

            {concernsData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={concernsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {concernsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-6 space-y-3">
                  {analytics?.topConcerns.map((concern, index) => (
                    <div key={concern.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm text-[#1A1A1A]">{concern.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-[#1A1A1A]">
                          {concern.count}
                        </span>
                        <span className="text-xs text-[#1A1A1A]/60">
                          ({concern.percentage}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
                <p className="text-[#1A1A1A]/60">
                  Aucune préoccupation rapportée
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Impact & ROI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-8 text-white"
        >
          <h2 className="text-3xl font-serif italic mb-8">
            Impact du programme M.O.N.A
          </h2>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
              <p className="text-4xl font-light mb-2">+23%</p>
              <p className="text-white/70 text-sm">Productivité</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <TrendingUp className="w-8 h-8 text-blue-400 mb-4" />
              <p className="text-4xl font-light mb-2">-35%</p>
              <p className="text-white/70 text-sm">Absentéisme</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Activity className="w-8 h-8 text-[#D4C5B9] mb-4" />
              <p className="text-4xl font-light mb-2">4.7/5</p>
              <p className="text-white/70 text-sm">Satisfaction employés</p>
            </div>
          </div>

          <p className="mt-6 text-white/70 text-sm">
            Moyenne basée sur nos clients entreprises en Afrique francophone
          </p>
        </motion.div>
      </main>
    </div>
  );
}