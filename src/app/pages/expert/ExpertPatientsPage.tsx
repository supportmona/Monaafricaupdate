import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import ExpertLayout from "@/app/components/ExpertLayout";
import {
  Search,
  Filter,
  UserPlus,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Clock,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  X,
  AlertCircle,
  Users,
  TrendingUp,
  Activity,
  ChevronDown,
} from "lucide-react";

// Types
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "M" | "F" | "Autre";
  address: string;
  city: string;
  lastConsultation: string;
  nextAppointment?: string;
  totalConsultations: number;
  medicalConditions: string[];
  status: "active" | "inactive";
  urgency: "normale" | "suivie" | "urgente";
}

export default function ExpertPatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "active" | "inactive" | "urgent">("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Données mockées
  const [patients] = useState<Patient[]>([
    {
      id: "1",
      firstName: "Amara",
      lastName: "Koné",
      email: "amara.kone@email.com",
      phone: "+225 07 12 34 56 78",
      dateOfBirth: "1985-03-15",
      gender: "F",
      address: "Cocody, Rue des Jardins",
      city: "Abidjan",
      lastConsultation: "2026-02-05",
      nextAppointment: "2026-02-15",
      totalConsultations: 8,
      medicalConditions: ["Anxiété", "Insomnie"],
      status: "active",
      urgency: "suivie",
    },
    {
      id: "2",
      firstName: "Mamadou",
      lastName: "Diallo",
      email: "mamadou.diallo@email.com",
      phone: "+221 77 123 45 67",
      dateOfBirth: "1992-07-22",
      gender: "M",
      address: "Plateau, Avenue Roume",
      city: "Dakar",
      lastConsultation: "2026-01-28",
      totalConsultations: 3,
      medicalConditions: ["Dépression"],
      status: "active",
      urgency: "normale",
    },
    {
      id: "3",
      firstName: "Grace",
      lastName: "Mbala",
      email: "grace.mbala@email.com",
      phone: "+243 81 234 56 78",
      dateOfBirth: "1988-11-10",
      gender: "F",
      address: "Gombe, Avenue Lukusa",
      city: "Kinshasa",
      lastConsultation: "2026-02-08",
      nextAppointment: "2026-02-12",
      totalConsultations: 15,
      medicalConditions: ["Stress post-traumatique", "Anxiété"],
      status: "active",
      urgency: "urgente",
    },
  ]);

  // Filtrage
  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === "all" ||
      (selectedFilter === "active" && patient.status === "active") ||
      (selectedFilter === "inactive" && patient.status === "inactive") ||
      (selectedFilter === "urgent" && patient.urgency === "urgente");

    return matchesSearch && matchesFilter;
  });

  // Calculer l'âge
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Couleurs par urgence
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "urgente":
        return "bg-red-100 text-red-700 border-red-200";
      case "suivie":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case "urgente":
        return "URGENT";
      case "suivie":
        return "SUIVI";
      default:
        return "NORMAL";
    }
  };

  return (
    <ExpertLayout title="Mes patients">
      <div className="p-6 space-y-6">
        {/* Stats rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#A68B6F]/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-[#A68B6F]" />
              </div>
              <div>
                <p className="text-2xl font-light text-[#1A1A1A]">{patients.length}</p>
                <p className="text-sm text-[#1A1A1A]/60">Patients total</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-[#1A1A1A]">
                  {patients.filter((p) => p.status === "active").length}
                </p>
                <p className="text-sm text-[#1A1A1A]/60">Patients actifs</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-[#1A1A1A]">
                  {patients.filter((p) => p.urgency === "suivie").length}
                </p>
                <p className="text-sm text-[#1A1A1A]/60">Suivi rapproché</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-[#1A1A1A]">
                  {patients.filter((p) => p.urgency === "urgente").length}
                </p>
                <p className="text-sm text-[#1A1A1A]/60">Cas urgents</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
              <input
                type="text"
                placeholder="Rechercher un patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Filter */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-2 px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full hover:bg-[#E8E0D8] transition-colors"
                >
                  <Filter className="w-4 h-4 text-[#1A1A1A]" />
                  <span className="text-sm text-[#1A1A1A]">Filtrer</span>
                  <ChevronDown className="w-4 h-4 text-[#1A1A1A]/60" />
                </button>

                <AnimatePresence>
                  {showFilterMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#D4C5B9] overflow-hidden z-10"
                    >
                      {[
                        { value: "all", label: "Tous les patients" },
                        { value: "active", label: "Actifs uniquement" },
                        { value: "inactive", label: "Inactifs" },
                        { value: "urgent", label: "Cas urgents" },
                      ].map((filter) => (
                        <button
                          key={filter.value}
                          onClick={() => {
                            setSelectedFilter(filter.value as typeof selectedFilter);
                            setShowFilterMenu(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                            selectedFilter === filter.value
                              ? "bg-[#A68B6F] text-white"
                              : "text-[#1A1A1A] hover:bg-[#F5F1ED]"
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Add patient */}
              <button
                onClick={() => setShowAddPatient(true)}
                className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span className="text-sm font-medium">Ajouter</span>
              </button>
            </div>
          </div>

          {/* Active filter badge */}
          {selectedFilter !== "all" && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-[#1A1A1A]/60">Filtre actif :</span>
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#A68B6F]/10 text-[#A68B6F] rounded-full text-xs font-medium">
                {selectedFilter === "active" && "Actifs uniquement"}
                {selectedFilter === "inactive" && "Inactifs"}
                {selectedFilter === "urgent" && "Cas urgents"}
                <button onClick={() => setSelectedFilter("all")}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
        </motion.div>

        {/* Patients List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl border border-[#D4C5B9] overflow-hidden"
        >
          <div className="p-6 border-b border-[#D4C5B9]">
            <h2 className="text-xl font-serif text-[#1A1A1A]">
              {filteredPatients.length} patient{filteredPatients.length > 1 ? "s" : ""}
            </h2>
          </div>

          {filteredPatients.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-[#1A1A1A]/40" />
              </div>
              <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">Aucun patient trouvé</h3>
              <p className="text-sm text-[#1A1A1A]/60 mb-6">
                {searchTerm
                  ? "Essayez de modifier vos critères de recherche"
                  : "Commencez par ajouter votre premier patient"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowAddPatient(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Ajouter un patient
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[#D4C5B9]">
              {filteredPatients.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-[#F5F1ED]/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                      {patient.firstName[0]}
                      {patient.lastName[0]}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="text-lg font-serif text-[#1A1A1A] mb-1">
                            {patient.firstName} {patient.lastName}
                          </h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getUrgencyColor(
                                patient.urgency
                              )}`}
                            >
                              {getUrgencyLabel(patient.urgency)}
                            </span>
                            <span className="text-xs text-[#1A1A1A]/60">
                              {calculateAge(patient.dateOfBirth)} ans • {patient.gender === "M" ? "Homme" : patient.gender === "F" ? "Femme" : "Autre"}
                            </span>
                          </div>
                        </div>

                        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded-lg transition-all">
                          <MoreVertical className="w-4 h-4 text-[#1A1A1A]" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-[#1A1A1A]/60">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{patient.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1A1A1A]/60">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#1A1A1A]/60">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>{patient.city}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-[#1A1A1A]/60">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            Dernière consultation :{" "}
                            {new Date(patient.lastConsultation).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        {patient.nextAppointment && (
                          <div className="flex items-center gap-1.5 text-[#A68B6F]">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              Prochain RDV : {new Date(patient.nextAppointment).toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                        )}
                      </div>

                      {patient.medicalConditions.length > 0 && (
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          {patient.medicalConditions.map((condition, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-[#F5F1ED] text-[#1A1A1A]/70 rounded-full text-xs"
                            >
                              {condition}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal - Détails patient */}
      <AnimatePresence>
        {selectedPatient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-[#D4C5B9] p-6 flex items-center justify-between">
                <h2 className="text-2xl font-serif text-[#1A1A1A]">Fiche patient</h2>
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#1A1A1A]" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Identity */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white text-2xl font-medium">
                    {selectedPatient.firstName[0]}
                    {selectedPatient.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif text-[#1A1A1A] mb-2">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(
                          selectedPatient.urgency
                        )}`}
                      >
                        {getUrgencyLabel(selectedPatient.urgency)}
                      </span>
                      <span className="text-sm text-[#1A1A1A]/60">
                        {calculateAge(selectedPatient.dateOfBirth)} ans •{" "}
                        {selectedPatient.gender === "M" ? "Homme" : selectedPatient.gender === "F" ? "Femme" : "Autre"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div className="bg-[#F5F1ED] rounded-2xl p-6 space-y-3">
                  <h4 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">
                    Informations de contact
                  </h4>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#A68B6F]" />
                    <span className="text-sm text-[#1A1A1A]">{selectedPatient.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#A68B6F]" />
                    <span className="text-sm text-[#1A1A1A]">{selectedPatient.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#A68B6F]" />
                    <span className="text-sm text-[#1A1A1A]">
                      {selectedPatient.address}, {selectedPatient.city}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F5F1ED] rounded-2xl p-4">
                    <p className="text-2xl font-light text-[#1A1A1A] mb-1">
                      {selectedPatient.totalConsultations}
                    </p>
                    <p className="text-xs text-[#1A1A1A]/60">Consultations</p>
                  </div>
                  <div className="bg-[#F5F1ED] rounded-2xl p-4">
                    <p className="text-2xl font-light text-[#1A1A1A] mb-1">
                      {new Date(selectedPatient.lastConsultation).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="text-xs text-[#1A1A1A]/60">Dernière visite</p>
                  </div>
                </div>

                {/* Medical conditions */}
                {selectedPatient.medicalConditions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3">
                      Conditions médicales
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.medicalConditions.map((condition, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-2 bg-[#A68B6F]/10 text-[#A68B6F] rounded-full text-sm border border-[#A68B6F]/20"
                        >
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 flex gap-3">
                  <Link
                    to={`/expert/medical-records/${selectedPatient.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">Dossier médical</span>
                  </Link>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#E8E0D8] transition-colors">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Planifier</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal - Ajouter patient */}
      <AnimatePresence>
        {showAddPatient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-[#D4C5B9] p-6 flex items-center justify-between">
                <h2 className="text-2xl font-serif text-[#1A1A1A]">Nouveau patient</h2>
                <button
                  onClick={() => setShowAddPatient(false)}
                  className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#1A1A1A]" />
                </button>
              </div>

              <div className="p-6">
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-10 h-10 text-[#A68B6F]" />
                  </div>
                  <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">
                    Formulaire d'ajout de patient
                  </h3>
                  <p className="text-sm text-[#1A1A1A]/60 mb-6">
                    Cette fonctionnalité sera bientôt disponible
                  </p>
                  <button
                    onClick={() => setShowAddPatient(false)}
                    className="px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ExpertLayout>
  );
}
