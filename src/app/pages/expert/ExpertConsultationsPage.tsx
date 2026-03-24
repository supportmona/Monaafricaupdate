import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Calendar, Clock, Video, User, ArrowLeft } from "lucide-react";
import { useExpertAuth } from "../../contexts/ExpertAuthContext";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

export default function ExpertConsultationsPage() {
  const { accessToken } = useExpertAuth();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/consultations`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
              "X-Expert-Token": accessToken || "",
            },
          }
        );
        const data = await res.json();
        setConsultations(data.data || []);
      } catch (e) {
        setConsultations([]);
      } finally {
        setLoading(false);
      }
    };
    if (accessToken) fetchConsultations();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F1ED]">
        <span className="text-[#A68B6F] text-lg">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header esthétique avec flèche retour */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-white border border-[#D4C5B9] hover:bg-[#F5F1ED] transition-colors"
            aria-label="Retour"
          >
            <ArrowLeft className="w-5 h-5 text-[#A68B6F]" />
          </button>
          <h1 className="text-3xl font-serif text-[#1A1A1A]">Mes consultations</h1>
        </div>

        {consultations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-10 text-center border border-[#D4C5B9] shadow-sm"
          >
            <Calendar className="w-12 h-12 mx-auto mb-4 text-[#A68B6F]/40" />
            <p className="text-[#1A1A1A]/60 text-lg">Aucune consultation à venir</p>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {consultations.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between border border-[#D4C5B9] shadow-sm gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#A68B6F]/10 rounded-full flex items-center justify-center">
                    <User className="w-7 h-7 text-[#A68B6F]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1A1A1A] text-lg">{c.memberName}</p>
                    <p className="text-sm text-[#1A1A1A]/60">{c.reason}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="flex items-center gap-2 text-sm text-[#1A1A1A]/80">
                    <Calendar className="w-4 h-4" /> {c.date}
                    <Clock className="w-4 h-4 ml-3" /> {c.time}
                  </span>
                  {c.status === "scheduled" && (
                    <Link
                      to={`/expert/consultation-room/${c.id}`}
                      className="px-4 py-2 rounded-full bg-[#A68B6F] text-white text-xs font-semibold shadow hover:bg-[#8A7159] transition-colors mt-2"
                    >
                      Rejoindre
                    </Link>
                  )}
                  {c.status === "completed" && (
                    <span className="text-xs text-green-600 font-semibold mt-2">Terminée</span>
                  )}
                  {c.status === "cancelled" && (
                    <span className="text-xs text-red-500 font-semibold mt-2">Annulée</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
