import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Calendar,
  Users,
  FileText,
  Video,
  Clock,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Upload,
  Download,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function ExpertDashboardPage() {
  const [expertProfile, setExpertProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    todayConsultations: 0,
    weekConsultations: 0,
    totalPatients: 0,
    pendingDocuments: 0,
  });
  const [upcomingConsultations, setUpcomingConsultations] = useState<any[]>([]);
  const [recentPatients, setRecentPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem("mona_expert_token");
      if (!token) return;

      // Get expert profile
      const profileRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/profile`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token,
          },
        }
      );

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setExpertProfile(profileData.data);
      }

      // Get patients list
      const patientsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/patients/list`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token,
          },
        }
      );

      if (patientsRes.ok) {
        const patientsData = await patientsRes.json();
        const patients = patientsData.data || [];
        setRecentPatients(patients.slice(0, 5));
        
        setStats(prev => ({
          ...prev,
          totalPatients: patients.length,
        }));
      }

      // Fetch real upcoming consultations for this expert
      const consultationsRes = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/consultations`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token,
          },
        }
      );

      if (consultationsRes.ok) {
        const consultationsData = await consultationsRes.json();
        const consultations = consultationsData.data || [];
        setUpcomingConsultations(
          consultations.filter((c: any) => c.status === "scheduled")
        );
        // Calculate stats
        const today = new Date().toISOString().split("T")[0];
        const todayConsults = consultations.filter((c: any) => c.date === today).length;
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekConsults = consultations.filter((c: any) => {
          const cDate = new Date(c.date);
          return cDate >= weekStart;
        }).length;
        setStats(prev => ({
          ...prev,
          todayConsultations: todayConsults,
          weekConsultations: weekConsults,
        }));
      }

    } catch (error) {
      console.error("Erreur chargement dashboard expert:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("mona_expert_token");
    window.location.href = "/expert/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#A68B6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1A1A1A]/60">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-[#1A1A1A]">
                Portail Expert
              </h1>
              <p className="text-sm text-[#1A1A1A]/60 mt-1">
                Bienvenue, Dr. {expertProfile?.firstName || "Expert"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
                <Bell className="w-5 h-5 text-[#1A1A1A]/60" />
              </button>
              <Link
                to="/expert/settings"
                className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
              >
                <Settings className="w-5 h-5 text-[#1A1A1A]/60" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#A68B6F]/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#A68B6F]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60">
                Aujourd'hui
              </span>
            </div>
            <p className="text-3xl font-serif text-[#1A1A1A] mb-1">
              {stats.todayConsultations}
            </p>
            <p className="text-sm text-[#1A1A1A]/60">Consultations</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#C1694F]/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#C1694F]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60">
                Cette semaine
              </span>
            </div>
            <p className="text-3xl font-serif text-[#1A1A1A] mb-1">
              {stats.weekConsultations}
            </p>
            <p className="text-sm text-[#1A1A1A]/60">Consultations</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60">
                Total
              </span>
            </div>
            <p className="text-3xl font-serif text-[#1A1A1A] mb-1">
              {stats.totalPatients}
            </p>
            <p className="text-sm text-[#1A1A1A]/60">Patients</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-500" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60">
                Documents
              </span>
            </div>
            <p className="text-3xl font-serif text-[#1A1A1A] mb-1">
              {stats.pendingDocuments}
            </p>
            <p className="text-sm text-[#1A1A1A]/60">En attente</p>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-[#D4C5B9] mb-8"
        >
          <h2 className="text-lg font-serif text-[#1A1A1A] mb-4">
            Actions rapides
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/expert/patients"
              className="flex flex-col items-center gap-3 p-4 hover:bg-[#F5F1ED] rounded-xl transition-colors group"
            >
              <div className="w-14 h-14 bg-[#A68B6F]/10 rounded-full flex items-center justify-center group-hover:bg-[#A68B6F] transition-colors">
                <Users className="w-7 h-7 text-[#A68B6F] group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-[#1A1A1A]">
                Mes patients
              </span>
            </Link>

            <Link
              to="/expert/calendar"
              className="flex flex-col items-center gap-3 p-4 hover:bg-[#F5F1ED] rounded-xl transition-colors group"
            >
              <div className="w-14 h-14 bg-[#C1694F]/10 rounded-full flex items-center justify-center group-hover:bg-[#C1694F] transition-colors">
                <Calendar className="w-7 h-7 text-[#C1694F] group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-[#1A1A1A]">
                Calendrier
              </span>
            </Link>

            <Link
              to="/expert/documents"
              className="flex flex-col items-center gap-3 p-4 hover:bg-[#F5F1ED] rounded-xl transition-colors group"
            >
              <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-colors">
                <FileText className="w-7 h-7 text-green-500 group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-[#1A1A1A]">
                Documents
              </span>
            </Link>

            <Link
              to="/expert/consultations"
              className="flex flex-col items-center gap-3 p-4 hover:bg-[#F5F1ED] rounded-xl transition-colors group"
            >
              <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <Video className="w-7 h-7 text-blue-500 group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-medium text-[#1A1A1A]">
                Consultations
              </span>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Consultations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-serif text-[#1A1A1A]">
                Consultations à venir
              </h2>
              <Link
                to="/expert/consultations"
                className="text-sm text-[#A68B6F] hover:text-[#8A7159] transition-colors"
              >
                Voir tout
              </Link>
            </div>

            {upcomingConsultations.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-[#1A1A1A]/20 mx-auto mb-3" />
                <p className="text-sm text-[#1A1A1A]/60">
                  Aucune consultation programmée
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#A68B6F] rounded-full flex items-center justify-center text-white font-semibold">
                        {consultation.patientName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#1A1A1A]">
                          {consultation.patientName}
                        </p>
                        <p className="text-sm text-[#1A1A1A]/60">
                          {consultation.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#1A1A1A]">
                        {consultation.time}
                      </p>
                      <Link
                        to={`/expert/consultation-room/${consultation.id}`}
                        className="text-xs text-[#A68B6F] hover:text-[#8A7159] transition-colors"
                      >
                        Rejoindre
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Recent Patients */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-serif text-[#1A1A1A]">
                Patients récents
              </h2>
              <Link
                to="/expert/patients"
                className="text-sm text-[#A68B6F] hover:text-[#8A7159] transition-colors"
              >
                Voir tout
              </Link>
            </div>

            {recentPatients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-[#1A1A1A]/20 mx-auto mb-3" />
                <p className="text-sm text-[#1A1A1A]/60">
                  Aucun patient pour le moment
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <Link
                    key={patient.id}
                    to={`/expert/patients/${patient.id}`}
                    className="flex items-center justify-between p-3 hover:bg-[#F5F1ED] rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#A68B6F] to-[#C1694F] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {patient.name?.charAt(0) || "P"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A1A]">
                          {patient.name}
                        </p>
                        <p className="text-xs text-[#1A1A1A]/60">
                          {patient.consultationsCount} consultation
                          {patient.consultationsCount > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <FileText className="w-4 h-4 text-[#1A1A1A]/40 group-hover:text-[#A68B6F] transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
