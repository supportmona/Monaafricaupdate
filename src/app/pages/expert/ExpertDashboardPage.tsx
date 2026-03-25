import ExpertLayout from "@/app/components/ExpertLayout";
import { Calendar, Users, FileText, Video, TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router";

export default function ExpertDashboardPage() {
  // Données mockées
  const stats = [
    { label: "AUJOURD'HUI", value: 0, desc: "Consultations", icon: Calendar },
    { label: "CETTE SEMAINE", value: 0, desc: "Consultations", icon: TrendingUp },
    { label: "TOTAL", value: 0, desc: "Patients", icon: Users },
    { label: "DOCUMENTS", value: 0, desc: "En attente", icon: FileText },
  ];
  const actions = [
    { label: "Mes patients", icon: Users, to: "/expert/patients" },
    { label: "Calendrier", icon: Calendar, to: "/expert/agenda" },
    { label: "Documents", icon: FileText, to: "/expert/medical-records" },
    { label: "Consultations", icon: Video, to: "/expert/agenda" },
  ];

  return (
    <ExpertLayout title="Portail Expert">
      <div className="space-y-10">
        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-[#E8E0D8] flex flex-col items-center shadow-sm">
              <div className="w-12 h-12 mb-2 rounded-full flex items-center justify-center bg-[#F5F1ED]">
                <stat.icon className="w-6 h-6 text-[#A68B6F]" />
              </div>
              <div className="text-xs text-[#A68B6F] font-semibold mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-[#1A1A1A] mb-1">{stat.value}</div>
              <div className="text-xs text-[#1A1A1A]/60">{stat.desc}</div>
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E0D8]">
          <h2 className="text-lg font-serif font-semibold mb-6 text-[#1A1A1A]">Actions rapides</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {actions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-[#F5F1ED] transition-colors"
              >
                <action.icon className="w-8 h-8 text-[#A68B6F]" />
                <span className="text-sm font-medium text-[#1A1A1A]">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Consultations à venir & Patients récents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E8E0D8] flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-semibold text-[#1A1A1A]">Consultations à venir</h2>
              <Link to="/expert/agenda" className="text-xs text-[#A68B6F] hover:underline">Voir tout</Link>
            </div>
            <div className="flex flex-col items-center justify-center h-32 text-[#A68B6F]/60">
              <Clock className="w-8 h-8 mb-2" />
              <span>Aucune consultation programmée</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#E8E0D8] flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-semibold text-[#1A1A1A]">Patients récents</h2>
              <Link to="/expert/patients" className="text-xs text-[#A68B6F] hover:underline">Voir tout</Link>
            </div>
            <div className="flex flex-col items-center justify-center h-32 text-[#A68B6F]/60">
              <Users className="w-8 h-8 mb-2" />
              <span>Aucun patient récent</span>
            </div>
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
}
