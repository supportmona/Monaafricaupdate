import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Users,
  Search,
  ArrowLeft,
  Calendar,
  FileText,
  ChevronRight,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function ExpertPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const token = localStorage.getItem("mona_expert_token");
      if (!token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/patients/list`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPatients(data.data || []);
      }
    } catch (error) {
      console.error("Erreur chargement patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <div className="flex items-center gap-4">
              <Link
                to="/expert/dashboard"
                className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#1A1A1A]/60" />
              </Link>
              <div>
                <h1 className="text-2xl font-serif text-[#1A1A1A]">
                  Mes patients
                </h1>
                <p className="text-sm text-[#1A1A1A]/60 mt-1">
                  {patients.length} patient{patients.length > 1 ? "s" : ""} au total
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="bg-white rounded-2xl p-6 border border-[#D4C5B9] mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
            <input
              type="text"
              placeholder="Rechercher un patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#D4C5B9] rounded-full focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent"
            />
          </div>
        </div>

        {/* Patients List */}
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-[#D4C5B9] text-center">
            <Users className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
            <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">
              {searchQuery ? "Aucun patient trouvé" : "Aucun patient"}
            </h3>
            <p className="text-sm text-[#1A1A1A]/60">
              {searchQuery
                ? "Essayez une autre recherche"
                : "Les patients apparaîtront ici après votre première consultation"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#D4C5B9] overflow-hidden">
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/expert/patients/${patient.id}`}
                  className="flex items-center justify-between p-6 hover:bg-[#F5F1ED] transition-colors border-b border-[#D4C5B9] last:border-b-0 group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#A68B6F] to-[#C1694F] rounded-full flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
                      {patient.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[#1A1A1A] mb-1 truncate">
                        {patient.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-[#1A1A1A]/60">
                        {patient.email && (
                          <span className="truncate">{patient.email}</span>
                        )}
                        {patient.phone && (
                          <span className="hidden sm:inline">{patient.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="flex items-center gap-2 text-sm text-[#1A1A1A] mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {patient.consultationsCount} consultation
                          {patient.consultationsCount > 1 ? "s" : ""}
                        </span>
                      </div>
                      {patient.lastConsultation && (
                        <p className="text-xs text-[#1A1A1A]/60">
                          Dernière:{" "}
                          {new Date(patient.lastConsultation).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#1A1A1A]/40 group-hover:text-[#A68B6F] transition-colors flex-shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
