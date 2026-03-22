import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Stethoscope,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  Calendar,
  Award,
  TrendingUp,
  Star,
  Video,
  DollarSign,
  AlertCircle,
  MoreVertical,
  Ban,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  FileText,
  ShieldCheck
} from "lucide-react";

type ExpertStatus = "all" | "verified" | "pending" | "rejected" | "suspended";

export default function AdminExpertsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ExpertStatus>("all");
  const [showActionsMenu, setShowActionsMenu] = useState<number | null>(null);
  const [currency, setCurrency] = useState<"XOF" | "USD">("XOF");

  const experts = [
    {
      id: 1,
      name: "Dr. Fatou Diop",
      avatar: "FD",
      specialty: "Psychiatre",
      email: "fatou.diop@monafrica.net",
      phone: "+221 77 123 45 67",
      status: "verified",
      rating: 4.9,
      reviews: 234,
      sessions: 456,
      joinedDate: "15 Nov 2024",
      certifications: ["Psychiatrie", "Thérapie Cognitive"],
      revenue: { XOF: 6840000, USD: 11400 },
      verificationDate: "20 Nov 2024",
      country: "Sénégal"
    },
    {
      id: 2,
      name: "Dr. Aminata Ndiaye",
      avatar: "AN",
      specialty: "Psychologue",
      email: "aminata.ndiaye@monafrica.net",
      phone: "+221 77 234 56 78",
      status: "verified",
      rating: 4.8,
      reviews: 198,
      sessions: 387,
      joinedDate: "3 Déc 2024",
      certifications: ["Psychologie Clinique", "TCC"],
      revenue: { XOF: 5805000, USD: 9675 },
      verificationDate: "10 Déc 2024",
      country: "Sénégal"
    },
    {
      id: 3,
      name: "Dr. Mamadou Sow",
      avatar: "MS",
      specialty: "Psychologue",
      email: "mamadou.sow@monafrica.net",
      phone: "+225 07 345 67 89",
      status: "pending",
      rating: 0,
      reviews: 0,
      sessions: 0,
      joinedDate: "2 Fév 2026",
      certifications: ["Psychologie", "Thérapie Familiale"],
      revenue: { XOF: 0, USD: 0 },
      verificationDate: null,
      country: "Côte d'Ivoire"
    },
    {
      id: 4,
      name: "Dr. Aissatou Ba",
      avatar: "AB",
      specialty: "Psychiatre",
      email: "aissatou.ba@monafrica.net",
      phone: "+221 77 456 78 90",
      status: "verified",
      rating: 4.7,
      reviews: 156,
      sessions: 298,
      joinedDate: "20 Déc 2024",
      certifications: ["Psychiatrie"],
      revenue: { XOF: 4470000, USD: 7450 },
      verificationDate: "28 Déc 2024",
      country: "Sénégal"
    },
    {
      id: 5,
      name: "Dr. Ibrahim Traoré",
      avatar: "IT",
      specialty: "Psychologue",
      email: "ibrahim.traore@monafrica.net",
      phone: "+223 76 567 89 01",
      status: "rejected",
      rating: 0,
      reviews: 0,
      sessions: 0,
      joinedDate: "25 Jan 2026",
      certifications: ["Psychologie"],
      revenue: { XOF: 0, USD: 0 },
      verificationDate: null,
      country: "Mali"
    }
  ];

  const stats = {
    total: 127,
    verified: 98,
    pending: 18,
    rejected: 7,
    suspended: 4,
    averageRating: 4.7,
    totalSessions: 12456,
    totalRevenue: { XOF: 186750000, USD: 311250 }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Vérifié
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            En attente
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Rejeté
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            <Ban className="w-3 h-3" />
            Suspendu
          </span>
        );
      default:
        return null;
    }
  };

  const getRatingStars = (rating: number) => {
    if (rating === 0) return <span className="text-xs text-[#1A1A1A]/40">Pas encore noté</span>;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? "text-[#D4A574] fill-[#D4A574]" : "text-gray-300"}`}
          />
        ))}
        <span className="text-xs text-[#1A1A1A] ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = searchQuery === "" || 
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === "all" || expert.status === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-serif text-[#1A1A1A]">Gestion des experts</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrency(currency === "XOF" ? "USD" : "XOF")}
                className="px-3 py-1.5 bg-white border border-[#D4C5B9] rounded-full text-xs font-medium hover:bg-[#F5F1ED] transition-colors"
              >
                {currency}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-[#D4C5B9] rounded-full text-sm hover:bg-[#F5F1ED] transition-colors">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exporter</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Total</p>
            <p className="text-2xl font-light text-[#1A1A1A]">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Vérifiés</p>
            <p className="text-2xl font-light text-green-600">{stats.verified}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <p className="text-xs text-[#1A1A1A]/60 mb-1">En attente</p>
            <p className="text-2xl font-light text-orange-600">{stats.pending}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Note moyenne</p>
            <p className="text-2xl font-light text-[#D4A574]">{stats.averageRating}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Sessions</p>
            <p className="text-2xl font-light text-blue-600">{stats.totalSessions.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Revenus</p>
            <p className="text-lg font-light text-[#1A1A1A]">
              {currency === "XOF" 
                ? (stats.totalRevenue.XOF / 1000000).toFixed(0) + "M"
                : (stats.totalRevenue.USD / 1000).toFixed(0) + "K"}
            </p>
          </motion.div>
        </div>

        {/* Recherche et filtres */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
            <input
              type="text"
              placeholder="Rechercher un expert..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#D4C5B9] rounded-full text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#A68B6F] transition-colors"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-white border border-[#D4C5B9] px-6 py-3 rounded-full text-sm text-[#1A1A1A] hover:bg-[#F5F1ED] transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </button>
        </div>

        {/* Filtres rapides */}
        <div className="inline-flex bg-white rounded-full p-1 border border-[#D4C5B9] overflow-x-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === "all" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setActiveFilter("verified")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === "verified" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
            }`}
          >
            Vérifiés
          </button>
          <button
            onClick={() => setActiveFilter("pending")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === "pending" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
            }`}
          >
            En attente
          </button>
          <button
            onClick={() => setActiveFilter("rejected")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === "rejected" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
            }`}
          >
            Rejetés
          </button>
          <button
            onClick={() => setActiveFilter("suspended")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === "suspended" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
            }`}
          >
            Suspendus
          </button>
        </div>

        {/* Liste des experts */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {filteredExperts.map((expert, index) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-5 border border-[#D4C5B9] hover:shadow-lg transition-all"
              >
                <div className="flex flex-col lg:flex-row items-start gap-4">
                  {/* Avatar et info de base */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-xl flex-shrink-0">
                      {expert.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base font-medium text-[#1A1A1A]">
                              {expert.name}
                            </h3>
                            {expert.status === "verified" && (
                              <ShieldCheck className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm text-purple-600 mb-2">{expert.specialty}</p>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            {getStatusBadge(expert.status)}
                            {getRatingStars(expert.rating)}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/60">
                              <Mail className="w-3.5 h-3.5" />
                              <span>{expert.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/60">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{expert.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Certifications */}
                      {expert.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {expert.certifications.map((cert, idx) => (
                            <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs">
                              {cert}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-[#F5F1ED] rounded-xl">
                      <Video className="w-4 h-4 text-[#1A1A1A]/60 mx-auto mb-1" />
                      <p className="text-lg font-light text-[#1A1A1A] mb-1">{expert.sessions}</p>
                      <p className="text-xs text-[#1A1A1A]/60">Sessions</p>
                    </div>

                    <div className="text-center p-3 bg-[#F5F1ED] rounded-xl">
                      <Award className="w-4 h-4 text-[#D4A574] mx-auto mb-1" />
                      <p className="text-lg font-light text-[#1A1A1A] mb-1">{expert.reviews}</p>
                      <p className="text-xs text-[#1A1A1A]/60">Avis</p>
                    </div>

                    <div className="text-center p-3 bg-[#F5F1ED] rounded-xl">
                      <DollarSign className="w-4 h-4 text-green-600 mx-auto mb-1" />
                      <p className="text-sm font-light text-[#1A1A1A] mb-1">
                        {currency === "XOF" 
                          ? (expert.revenue.XOF / 1000).toFixed(0) + "K"
                          : expert.revenue.USD.toLocaleString()}
                      </p>
                      <p className="text-xs text-[#1A1A1A]/60">{currency}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 items-start">
                    <button className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
                      <Eye className="w-4 h-4 text-[#1A1A1A]" />
                    </button>
                    <button className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
                      <Edit className="w-4 h-4 text-[#1A1A1A]" />
                    </button>
                    
                    {expert.status === "pending" && (
                      <>
                        <button className="p-2 hover:bg-green-50 rounded-full transition-colors">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-full transition-colors">
                          <XCircle className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    )}

                    <div className="relative">
                      <button
                        onClick={() => setShowActionsMenu(showActionsMenu === expert.id ? null : expert.id)}
                        className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-[#1A1A1A]" />
                      </button>

                      {showActionsMenu === expert.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-[#D4C5B9] shadow-lg z-10">
                          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F1ED] text-sm text-[#1A1A1A] transition-colors rounded-t-xl">
                            <FileText className="w-4 h-4" />
                            Voir documents
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F1ED] text-sm text-[#1A1A1A] transition-colors">
                            <Mail className="w-4 h-4" />
                            Envoyer un email
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F1ED] text-sm text-red-600 transition-colors rounded-b-xl">
                            <Ban className="w-4 h-4" />
                            Suspendre
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Détails supplémentaires */}
                <div className="mt-4 pt-4 border-t border-[#D4C5B9] flex flex-wrap items-center gap-4 text-xs text-[#1A1A1A]/60">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Inscrit le {expert.joinedDate}</span>
                  </div>
                  {expert.verificationDate && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      <span>Vérifié le {expert.verificationDate}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span>Pays : {expert.country}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* État vide */}
        {filteredExperts.length === 0 && (
          <div className="bg-white rounded-3xl p-12 border border-[#D4C5B9] text-center">
            <Stethoscope className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">
              Aucun expert trouvé
            </h3>
            <p className="text-[#1A1A1A]/60">
              Aucun expert ne correspond à vos critères de recherche.
            </p>
          </div>
        )}

      </main>

      {/* Navigation PWA Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] safe-area-inset-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-xs">Dashboard</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs">Utilisateurs</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-xs">Analytics</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
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
