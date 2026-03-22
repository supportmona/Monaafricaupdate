import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  Building2,
  UserCheck,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  FileText,
  AlertCircle,
  Star,
  BookOpen,
  Video,
  X,
} from "lucide-react";

interface Expert {
  id: string;
  name: string;
  email: string;
  specialty: string;
  location: string;
  phone: string;
  status: "pending_validation" | "pending_documents" | "approved" | "rejected" | "suspended";
  submittedDate: string;
  validatedDate?: string;
  consultations: number;
  rating: number;
  bio?: string;
  certifications?: string[];
  languages?: string[];
}

export default function RHExpertsPage() {
  const navigate = useNavigate();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadExperts();
  }, []);

  const loadExperts = async () => {
    setIsLoading(true);
    try {
      // TODO: Remplacer par appel API réel
      const mockExperts: Expert[] = [
        {
          id: "1",
          name: "Dr. Aïcha Traoré",
          email: "aicha.traore@monafrica.net",
          specialty: "Psychologie Clinique",
          location: "Abidjan",
          phone: "+225 700 123 456",
          status: "pending_validation",
          submittedDate: "2025-02-10",
          consultations: 0,
          rating: 0,
          bio: "Spécialisée en thérapie cognitivo-comportementale avec 8 ans d'expérience",
          certifications: ["Psychologue Clinicienne", "Thérapie TCC", "Master en Psychologie"],
          languages: ["Français", "Anglais", "Bambara"],
        },
        {
          id: "2",
          name: "Dr. Mohamed Diop",
          email: "mohamed.diop@monafrica.net",
          specialty: "Thérapie de Couple",
          location: "Dakar",
          phone: "+221 770 234 567",
          status: "approved",
          submittedDate: "2025-02-08",
          validatedDate: "2025-02-09",
          consultations: 23,
          rating: 4.8,
          bio: "Expert en thérapie de couple et familiale, 12 ans d'expérience",
          certifications: ["Thérapeute Familial", "Médiateur Conjugal", "Doctorat en Psychologie"],
          languages: ["Français", "Wolof", "Anglais"],
        },
        {
          id: "3",
          name: "Dr. Grace Okoro",
          email: "grace.okoro@monafrica.net",
          specialty: "Thérapie Familiale",
          location: "Kinshasa",
          phone: "+243 900 345 678",
          status: "pending_documents",
          submittedDate: "2025-02-06",
          consultations: 0,
          rating: 0,
          bio: "Thérapeute familiale spécialisée dans les conflits intergénérationnels",
          certifications: ["Thérapeute Systémique", "Master Psychologie Familiale"],
          languages: ["Français", "Lingala", "Anglais"],
        },
        {
          id: "4",
          name: "Dr. Kofi Mensah",
          email: "kofi.mensah@monafrica.net",
          specialty: "Psychologie du Travail",
          location: "Abidjan",
          phone: "+225 700 456 789",
          status: "approved",
          submittedDate: "2025-01-20",
          validatedDate: "2025-01-22",
          consultations: 45,
          rating: 4.9,
          bio: "Spécialiste du burnout et de la santé mentale en entreprise",
          certifications: ["Psychologue du Travail", "Coach Professionnel", "Master RH"],
          languages: ["Français", "Anglais", "Akan"],
        },
        {
          id: "5",
          name: "Dr. Fatou Sow",
          email: "fatou.sow@monafrica.net",
          specialty: "Psychiatrie Générale",
          location: "Dakar",
          phone: "+221 770 567 890",
          status: "approved",
          submittedDate: "2025-01-15",
          validatedDate: "2025-01-17",
          consultations: 67,
          rating: 4.7,
          bio: "Psychiatre avec expertise en troubles anxieux et dépression",
          certifications: ["Médecin Psychiatre", "Doctorat en Médecine", "Spécialité Psychiatrie"],
          languages: ["Français", "Wolof", "Anglais"],
        },
        {
          id: "6",
          name: "Dr. Emmanuel Kaba",
          email: "emmanuel.kaba@monafrica.net",
          specialty: "Psychologie de l'Enfant",
          location: "Kinshasa",
          phone: "+243 900 678 901",
          status: "rejected",
          submittedDate: "2025-02-05",
          consultations: 0,
          rating: 0,
          bio: "Psychologue pour enfants et adolescents",
          certifications: ["Psychologue Clinicien"],
          languages: ["Français", "Lingala"],
        },
      ];

      setExperts(mockExperts);
    } catch (error) {
      console.error("Erreur chargement experts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateExpert = async (expertId: string) => {
    // TODO: Appel API validation
    console.log("Valider expert:", expertId);
    setExperts(prev =>
      prev.map(e =>
        e.id === expertId
          ? { ...e, status: "approved", validatedDate: new Date().toISOString().split("T")[0] }
          : e
      )
    );
  };

  const handleRejectExpert = async (expertId: string) => {
    // TODO: Appel API rejet
    console.log("Rejeter expert:", expertId);
    setExperts(prev =>
      prev.map(e => (e.id === expertId ? { ...e, status: "rejected" } : e))
    );
  };

  const filteredExperts = experts.filter((expert) => {
    const matchesSearch =
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || expert.status === filterStatus;
    const matchesLocation = filterLocation === "all" || expert.location === filterLocation;
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const stats = {
    total: experts.length,
    pending: experts.filter((e) => e.status === "pending_validation" || e.status === "pending_documents").length,
    approved: experts.filter((e) => e.status === "approved").length,
    rejected: experts.filter((e) => e.status === "rejected").length,
  };

  const getStatusBadge = (status: Expert["status"]) => {
    switch (status) {
      case "pending_validation":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">
            <AlertCircle className="w-3 h-3" />
            En attente validation
          </span>
        );
      case "pending_documents":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">
            <FileText className="w-3 h-3" />
            Documents manquants
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Validé
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" />
            Rejeté
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Suspendu
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-anthracite/60">Chargement des experts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige">
      {/* Header */}
      <div className="bg-white border-b border-anthracite/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/rh/dashboard")}
                className="p-2 hover:bg-beige rounded-full transition-colors"
              >
                <Building2 className="w-6 h-6 text-anthracite" />
              </button>
              <div>
                <h1 className="text-2xl font-serif text-anthracite">
                  Gestion des <span className="text-terracotta italic">Experts</span>
                </h1>
                <p className="text-xs text-anthracite/60">Validation et suivi des professionnels</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-anthracite/5"
          >
            <UserCheck className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-3xl font-serif text-anthracite">{stats.total}</p>
            <p className="text-sm text-anthracite/60">Total experts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-anthracite/5"
          >
            <AlertCircle className="w-8 h-8 text-yellow-500 mb-2" />
            <p className="text-3xl font-serif text-anthracite">{stats.pending}</p>
            <p className="text-sm text-anthracite/60">En attente</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-anthracite/5"
          >
            <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-3xl font-serif text-anthracite">{stats.approved}</p>
            <p className="text-sm text-anthracite/60">Validés</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-anthracite/5"
          >
            <XCircle className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-3xl font-serif text-anthracite">{stats.rejected}</p>
            <p className="text-sm text-anthracite/60">Rejetés</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-anthracite/5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-anthracite/40" />
              <input
                type="text"
                placeholder="Rechercher un expert..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-anthracite/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-anthracite/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/50"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending_validation">En attente validation</option>
              <option value="pending_documents">Documents manquants</option>
              <option value="approved">Validés</option>
              <option value="rejected">Rejetés</option>
            </select>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-4 py-3 border border-anthracite/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/50"
            >
              <option value="all">Toutes les villes</option>
              <option value="Kinshasa">Kinshasa</option>
              <option value="Dakar">Dakar</option>
              <option value="Abidjan">Abidjan</option>
            </select>
          </div>
        </div>

        {/* Experts List */}
        <div className="space-y-4">
          {filteredExperts.map((expert, index) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-anthracite/5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-gold rounded-2xl flex items-center justify-center text-white text-xl font-medium">
                    {expert.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-serif text-anthracite mb-1">{expert.name}</h3>
                        <p className="text-sm text-anthracite/60 mb-2">{expert.specialty}</p>
                      </div>
                      {getStatusBadge(expert.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-anthracite/70">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {expert.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {expert.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {expert.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Postulé le {expert.submittedDate}
                      </div>
                    </div>
                    {expert.status === "approved" && (
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Video className="w-4 h-4 text-terracotta" />
                          <span>{expert.consultations} consultations</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-gold fill-gold" />
                          <span>{expert.rating}/5</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedExpert(expert);
                      setShowDetailModal(true);
                    }}
                    className="p-2 hover:bg-beige rounded-lg transition-colors"
                    title="Voir détails"
                  >
                    <Eye className="w-5 h-5 text-anthracite/60" />
                  </button>
                  {expert.status === "pending_validation" && (
                    <>
                      <button
                        onClick={() => handleValidateExpert(expert.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        Valider
                      </button>
                      <button
                        onClick={() => handleRejectExpert(expert.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm font-medium"
                      >
                        Rejeter
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredExperts.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center border border-anthracite/5">
            <UserCheck className="w-12 h-12 text-anthracite/20 mx-auto mb-4" />
            <p className="text-anthracite/60">Aucun expert trouvé</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedExpert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-serif text-anthracite mb-1">{selectedExpert.name}</h2>
                  <p className="text-anthracite/60">{selectedExpert.specialty}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-beige rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-anthracite/60 mb-2">BIO</h3>
                  <p className="text-anthracite">{selectedExpert.bio}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-anthracite/60 mb-2">CERTIFICATIONS</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExpert.certifications?.map((cert, i) => (
                      <span key={i} className="px-3 py-1 bg-beige rounded-full text-sm">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-anthracite/60 mb-2">LANGUES</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExpert.languages?.map((lang, i) => (
                      <span key={i} className="px-3 py-1 bg-beige rounded-full text-sm">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
