      {/* Modal - Aperçu Template Mona */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full"
            >
              <div className="p-6 border-b border-[#D4C5B9] flex items-center justify-between">
                <h2 className="text-2xl font-serif text-[#1A1A1A]">{selectedTemplate.name}</h2>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#1A1A1A]" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-[#1A1A1A]/80 mb-4">{selectedTemplate.desc}</p>
                <div className="bg-[#F5F1ED] rounded-xl p-6 text-center">
                  <span className="text-[#A68B6F] font-semibold">Aperçu du template Mona</span>
                  <div className="mt-4 text-xs text-[#1A1A1A]/60">(Le contenu détaillé sera bientôt disponible)</div>
                </div>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="mt-8 px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors w-full"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import ExpertLayout from "@/app/components/ExpertLayout";
import {
  FileText,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  X,
  ChevronRight,
  FolderOpen,
  AlertCircle,
  CheckCircle,
  Paperclip,
  File,
  Image as ImageIcon,
  Video,
  ChevronDown,
  Brain,
  Stethoscope
} from "lucide-react";
// --- Templates Mona (Santé mentale & Soins primaires) ---
const MONA_TEMPLATES = [
  {
    category: "Santé mentale",
    color: "bg-blue-50 border-blue-200",
    icon: <Brain className="w-6 h-6 text-blue-600" />,
    templates: [
      { id: "prescription_mental_health", name: "Ordonnance Mona", desc: "Traitements psychiatriques" },
      { id: "careplan_mental_health", name: "Plan de soins Mona", desc: "Suivi psychiatrique/psychologique" },
      { id: "certificate_mental_health", name: "Certificat médical Mona", desc: "Arrêt de travail ou aptitude psychologique" },
      { id: "report_mental_health", name: "Compte-rendu Mona", desc: "Consultation psychiatrique/psychologique" },
      { id: "referral_mental_health", name: "Lettre de liaison Mona", desc: "Vers structure spécialisée" },
    ]
  },
  {
    category: "Soins primaires",
    color: "bg-green-50 border-green-200",
    icon: <Stethoscope className="w-6 h-6 text-green-600" />,
    templates: [
      { id: "prescription_primary_care", name: "Ordonnance Mona", desc: "Soins médicaux généraux" },
      { id: "careplan_primary_care", name: "Plan de soins Mona", desc: "Pathologie médicale générale" },
      { id: "certificate_primary_care", name: "Certificat médical Mona", desc: "Justificatif ou arrêt de travail" },
      { id: "report_primary_care", name: "Compte-rendu Mona", desc: "Consultation médicale générale" },
      { id: "referral_primary_care", name: "Lettre de liaison Mona", desc: "Vers spécialiste" },
    ]
  }
];

// Types
interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  recordType: "consultation" | "diagnostic" | "prescription" | "lab" | "imaging" | "other";
  title: string;
  date: string;
  status: "draft" | "finalized" | "archived";
  content: string;
  attachments: Attachment[];
  lastModified: string;
  tags: string[];
}

interface Attachment {
  id: string;
  name: string;
  type: "pdf" | "image" | "video" | "other";
  size: string;
  uploadDate: string;
}

export default function ExpertMedicalRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [tab, setTab] = useState<'templates' | 'documents'>("templates");
  const [templateCategory, setTemplateCategory] = useState<'Santé mentale' | 'Soins primaires'>("Santé mentale");
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

  // Données mockées
  const [records] = useState<MedicalRecord[]>([
    {
      id: "1",
      patientId: "1",
      patientName: "Amara Koné",
      recordType: "consultation",
      title: "Consultation initiale - Anxiété",
      date: "2026-02-05",
      status: "finalized",
      content:
        "Patient présente des symptômes d'anxiété généralisée. Anamnèse complète réalisée. Plan de traitement proposé incluant thérapie cognitivo-comportementale.",
      attachments: [
        {
          id: "a1",
          name: "Notes_consultation_05022026.pdf",
          type: "pdf",
          size: "245 KB",
          uploadDate: "2026-02-05",
        },
      ],
      lastModified: "2026-02-05",
      tags: ["Anxiété", "Première consultation"],
    },
    {
      id: "2",
      patientId: "3",
      patientName: "Grace Mbala",
      recordType: "prescription",
      title: "Ordonnance - Anxiolytiques",
      date: "2026-02-08",
      status: "finalized",
      content: "Prescription d'anxiolytiques légers. Posologie détaillée. Suivi prévu dans 2 semaines.",
      attachments: [
        {
          id: "a2",
          name: "Ordonnance_08022026.pdf",
          type: "pdf",
          size: "180 KB",
          uploadDate: "2026-02-08",
        },
      ],
      lastModified: "2026-02-08",
      tags: ["Prescription", "Anxiolytiques"],
    },
    {
      id: "3",
      patientId: "2",
      patientName: "Mamadou Diallo",
      recordType: "diagnostic",
      title: "Diagnostic - Épisode dépressif majeur",
      date: "2026-01-28",
      status: "finalized",
      content:
        "Suite à plusieurs séances, diagnostic confirmé d'épisode dépressif majeur. Plan thérapeutique établi.",
      attachments: [],
      lastModified: "2026-01-28",
      tags: ["Dépression", "Diagnostic"],
    },
    {
      id: "4",
      patientId: "1",
      patientName: "Amara Koné",
      recordType: "lab",
      title: "Résultats analyses biologiques",
      date: "2026-02-10",
      status: "draft",
      content: "En attente de validation des résultats.",
      attachments: [
        {
          id: "a3",
          name: "Resultats_labo.pdf",
          type: "pdf",
          size: "320 KB",
          uploadDate: "2026-02-10",
        },
      ],
      lastModified: "2026-02-10",
      tags: ["Laboratoire"],
    },
  ]);

  // Filtrage
  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === "all" || record.recordType === selectedType;
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Couleurs par type
  const getTypeColor = (type: string) => {
    switch (type) {
      case "consultation":
        return "bg-blue-100 text-blue-700";
      case "diagnostic":
        return "bg-purple-100 text-purple-700";
      case "prescription":
        return "bg-green-100 text-green-700";
      case "lab":
        return "bg-orange-100 text-orange-700";
      case "imaging":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "consultation":
        return "Consultation";
      case "diagnostic":
        return "Diagnostic";
      case "prescription":
        return "Ordonnance";
      case "lab":
        return "Laboratoire";
      case "imaging":
        return "Imagerie";
      default:
        return "Autre";
    }
  };

  // Couleurs par statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case "finalized":
        return "bg-green-100 text-green-700 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "finalized":
        return "FINALISÉ";
      case "draft":
        return "BROUILLON";
      case "archived":
        return "ARCHIVÉ";
      default:
        return status.toUpperCase();
    }
  };

  // Icon par type de fichier
  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <File className="w-4 h-4" />;
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      default:
        return <Paperclip className="w-4 h-4" />;
    }
  };

  return (
    <ExpertLayout title="Mes documents">
      <div className="p-6 space-y-10">
        {/* Onglets navigation */}
        <div className="flex gap-2 mb-8">
          <button
            className={`px-6 py-3 rounded-full font-semibold transition-colors ${tab === 'templates' ? 'bg-[#A68B6F] text-white' : 'bg-[#F5F1ED] text-[#1A1A1A]'}`}
            onClick={() => setTab('templates')}
          >
            Templates Mona
          </button>
          <button
            className={`px-6 py-3 rounded-full font-semibold transition-colors ${tab === 'documents' ? 'bg-[#A68B6F] text-white' : 'bg-[#F5F1ED] text-[#1A1A1A]'}`}
            onClick={() => setTab('documents')}
          >
            Documents uploadés
          </button>
        </div>

        {/* Section Templates Mona avec sous-onglets */}
        {tab === 'templates' && (
          <div>
            <div className="flex gap-2 mb-6">
              {MONA_TEMPLATES.map((cat) => (
                <button
                  key={cat.category}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${templateCategory === cat.category ? 'bg-[#A68B6F] text-white' : 'bg-[#F5F1ED] text-[#1A1A1A]'}`}
                  onClick={() => setTemplateCategory(cat.category as any)}
                >
                  {cat.category}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {MONA_TEMPLATES.find((cat) => cat.category === templateCategory)?.templates.map((tpl) => (
                <div key={tpl.id} className="rounded-2xl border bg-white p-6 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="font-medium text-[#1A1A1A]">{tpl.name}</span>
                    <span className="ml-2 text-xs text-[#1A1A1A]/60">{tpl.desc}</span>
                  </div>
                  <button
                    className="px-4 py-2 rounded-full bg-[#A68B6F] text-white text-xs font-semibold shadow hover:bg-[#8A7159] transition-colors"
                    onClick={() => setSelectedTemplate(tpl)}
                  >
                    Aperçu
                  </button>
                </div>
              ))}
            </div>
            {/* Info card */}
            <div className="bg-[#F5F1ED] rounded-2xl p-6 border border-[#D4C5B9] mt-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#A68B6F] rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#1A1A1A] mb-2">
                    À propos des templates Mona
                  </h3>
                  <p className="text-sm text-[#1A1A1A]/70 leading-relaxed mb-4">
                    Ces 10 modèles couvrent les besoins cliniques fondamentaux en santé mentale et soins primaires. Chaque document est conçu selon les standards médicaux africains et internationaux.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-[#1A1A1A]/60">
                      <Brain className="w-4 h-4 text-[#A68B6F]" />
                      <span>5 modèles santé mentale</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#1A1A1A]/60">
                      <Stethoscope className="w-4 h-4 text-[#B85C50]" />
                      <span>5 modèles soins primaires</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Documents uploadés (MedicalRecords) */}
        {tab === 'documents' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#A68B6F]/10 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#A68B6F]" />
              </div>
              <div>
                <p className="text-2xl font-light text-[#1A1A1A]">{records.length}</p>
                <p className="text-sm text-[#1A1A1A]/60">Dossiers total</p>
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
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-[#1A1A1A]">
                  {records.filter((r) => r.status === "finalized").length}
                </p>
                <p className="text-sm text-[#1A1A1A]/60">Finalisés</p>
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
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Edit className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-[#1A1A1A]">
                  {records.filter((r) => r.status === "draft").length}
                </p>
                <p className="text-sm text-[#1A1A1A]/60">Brouillons</p>
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
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Paperclip className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-light text-[#1A1A1A]">
                  {records.reduce((sum, r) => sum + r.attachments.length, 0)}
                </p>
                <p className="text-sm text-[#1A1A1A]/60">Documents joints</p>
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
                placeholder="Rechercher un dossier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Type filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
              >
                <option value="all">Tous les types</option>
                <option value="consultation">Consultations</option>
                <option value="diagnostic">Diagnostics</option>
                <option value="prescription">Ordonnances</option>
                <option value="lab">Laboratoire</option>
                <option value="imaging">Imagerie</option>
                <option value="other">Autre</option>
              </select>

              {/* Status filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-sm text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
              >
                <option value="all">Tous les statuts</option>
                <option value="finalized">Finalisés</option>
                <option value="draft">Brouillons</option>
                <option value="archived">Archivés</option>
              </select>

              {/* Upload */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full hover:bg-[#E8E0D8] transition-colors"
              >
                <Upload className="w-4 h-4 text-[#1A1A1A]" />
                <span className="text-sm text-[#1A1A1A]">Importer</span>
              </button>

              {/* Create new */}
              <Link
                to="/expert/medical-records/new"
                className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Nouveau dossier</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Records List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl border border-[#D4C5B9] overflow-hidden"
        >
          <div className="p-6 border-b border-[#D4C5B9]">
            <h2 className="text-xl font-serif text-[#1A1A1A]">
              {filteredRecords.length} dossier{filteredRecords.length > 1 ? "s" : ""}
            </h2>
          </div>

          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-10 h-10 text-[#1A1A1A]/40" />
              </div>
              <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">Aucun dossier trouvé</h3>
              <p className="text-sm text-[#1A1A1A]/60 mb-6">
                {searchTerm || selectedType !== "all" || selectedStatus !== "all"
                  ? "Essayez de modifier vos filtres"
                  : "Créez votre premier dossier médical"}
              </p>
              {!searchTerm && selectedType === "all" && selectedStatus === "all" && (
                <Link
                  to="/expert/medical-records/new"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau dossier
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-[#D4C5B9]">
              {filteredRecords.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-[#F5F1ED]/50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedRecord(record)}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 ${getTypeColor(record.recordType)} rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      <FileText className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-serif text-[#1A1A1A] mb-1">{record.title}</h3>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 ${getTypeColor(record.recordType)} rounded-full text-xs font-medium`}>
                              {getTypeLabel(record.recordType)}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(
                                record.status
                              )}`}
                            >
                              {getStatusLabel(record.status)}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#1A1A1A]/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="flex items-center gap-4 text-sm text-[#1A1A1A]/60 mb-2">
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4" />
                          <span>{record.patientName}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(record.date).toLocaleDateString("fr-FR")}</span>
                        </div>
                        {record.attachments.length > 0 && (
                          <div className="flex items-center gap-1.5">
                            <Paperclip className="w-4 h-4" />
                            <span>{record.attachments.length} fichier{record.attachments.length > 1 ? "s" : ""}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-[#1A1A1A]/70 line-clamp-2 mb-3">{record.content}</p>

                      {record.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {record.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-1 bg-[#F5F1ED] text-[#1A1A1A]/70 rounded-full text-xs">
                              {tag}
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
        )}
      </div>

      {/* Modal - Détails dossier */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-[#D4C5B9] p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${getTypeColor(selectedRecord.recordType)} rounded-xl flex items-center justify-center`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-[#1A1A1A]">{selectedRecord.title}</h2>
                    <p className="text-sm text-[#1A1A1A]/60">{getTypeLabel(selectedRecord.recordType)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#1A1A1A]" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Info */}
                <div className="bg-[#F5F1ED] rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-[#A68B6F]" />
                    <div>
                      <p className="text-xs text-[#1A1A1A]/60">Patient</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">{selectedRecord.patientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-[#A68B6F]" />
                    <div>
                      <p className="text-xs text-[#1A1A1A]/60">Date</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        {new Date(selectedRecord.date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#A68B6F]" />
                    <div>
                      <p className="text-xs text-[#1A1A1A]/60">Dernière modification</p>
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        {new Date(selectedRecord.lastModified).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3">Statut</h4>
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${getStatusColor(
                      selectedRecord.status
                    )}`}
                  >
                    {getStatusLabel(selectedRecord.status)}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3">Contenu</h4>
                  <div className="bg-[#F5F1ED] rounded-2xl p-6">
                    <p className="text-sm text-[#1A1A1A] leading-relaxed whitespace-pre-line">{selectedRecord.content}</p>
                  </div>
                </div>

                {/* Tags */}
                {selectedRecord.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecord.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-2 bg-[#A68B6F]/10 text-[#A68B6F] rounded-full text-sm border border-[#A68B6F]/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attachments */}
                {selectedRecord.attachments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3">
                      Documents joints ({selectedRecord.attachments.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedRecord.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl hover:bg-[#E8E0D8] transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#A68B6F]">
                              {getFileIcon(attachment.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#1A1A1A] truncate">{attachment.name}</p>
                              <p className="text-xs text-[#1A1A1A]/60">{attachment.size}</p>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-white rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-[#A68B6F]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 flex gap-3">
                  <Link
                    to={`/expert/medical-records/${selectedRecord.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm font-medium">Modifier</span>
                  </Link>
                  <button className="flex items-center justify-center gap-2 px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#E8E0D8] transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Télécharger</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal - Upload */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full"
            >
              <div className="p-6 border-b border-[#D4C5B9] flex items-center justify-between">
                <h2 className="text-2xl font-serif text-[#1A1A1A]">Importer un document</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#1A1A1A]" />
                </button>
              </div>

              <div className="p-6">
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-10 h-10 text-[#A68B6F]" />
                  </div>
                  <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">Upload de documents</h3>
                  <p className="text-sm text-[#1A1A1A]/60 mb-6">Cette fonctionnalité sera bientôt disponible</p>
                  <button
                    onClick={() => setShowUploadModal(false)}
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
