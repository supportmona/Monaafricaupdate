import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import ExpertLayout from "@/app/components/ExpertLayout";
import {
  ArrowLeft,
  User,
  Calendar,
  FileText,
  Edit,
  Download,
  Plus,
  Clock,
  Paperclip,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  File,
  Image as ImageIcon,
} from "lucide-react";

export default function ExpertMedicalRecordDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(
    "Patient consulté pour suivi de thérapie cognitivo-comportementale (TCC) pour trouble anxieux généralisé.\n\nÉVOLUTION DEPUIS DERNIÈRE CONSULTATION :\n- Diminution notable de la fréquence des crises d'anxiété (de 5-6/semaine à 2-3/semaine)\n- Amélioration du sommeil : 6-7h continues vs 4-5h précédemment\n- Utilisation régulière des techniques de respiration apprises\n- Meilleure gestion des pensées intrusives\n\nOBSERVATIONS CLINIQUES :\n- Patient plus détendu lors de l'entretien\n- Expression faciale apaisée\n- Discours fluide et cohérent\n- Conscience accrue des déclencheurs d'anxiété\n\nTRAVAIL THÉRAPEUTIQUE DE LA SÉANCE :\n1. Restructuration cognitive des pensées catastrophiques\n2. Exercices d'exposition graduelle aux situations anxiogènes\n3. Révision du journal de pensées automatiques\n4. Pratique de la pleine conscience (15 minutes guidées)\n\nPLAN THÉRAPEUTIQUE :\n- Poursuivre TCC hebdomadaire (4 séances restantes)\n- Intensifier exercices d'exposition\n- Maintenir traitement médicamenteux (Alprazolam 0.25mg 2x/jour)\n- Révision du plan dans 2 semaines\n\nOBJECTIFS POUR PROCHAINE SÉANCE :\n- Exposition à situation évitée (transport en commun)\n- Consolidation des acquis\n- Évaluation possibilité de réduction médicamenteuse"
  );

  // Données mockées
  const record = {
    id: id || "1",
    patientId: "1",
    patientName: "Amara Koné",
    patientAge: 41,
    recordType: "consultation",
    title: "Consultation de suivi - TCC pour anxiété",
    date: "2026-02-05",
    status: "finalized",
    lastModified: "2026-02-05",
    tags: ["Anxiété", "TCC", "Suivi thérapeutique"],
    attachments: [
      {
        id: "a1",
        name: "Notes_consultation_05022026.pdf",
        type: "pdf",
        size: "245 KB",
        uploadDate: "2026-02-05",
      },
      {
        id: "a2",
        name: "Journal_pensees_patient.pdf",
        type: "pdf",
        size: "180 KB",
        uploadDate: "2026-02-05",
      },
      {
        id: "a3",
        name: "Echelle_anxiete_HAM-A.pdf",
        type: "pdf",
        size: "120 KB",
        uploadDate: "2026-02-05",
      },
    ],
  };

  const handleSave = () => {
    setIsEditing(false);
    // Logique de sauvegarde ici
  };

  const handleCreatePrescription = () => {
    // Naviguer vers la page d'ordonnance avec les infos du patient pré-remplies
    navigate("/expert/prescription-template", {
      state: {
        patientName: record.patientName,
        patientAge: record.patientAge,
        birthDate: "", // À calculer depuis l'âge si nécessaire
      },
    });
  };

  const handleAddToCarePlan = () => {
    // Naviguer vers la page de plan de soins avec les infos du patient
    navigate("/expert/care-plan", {
      state: {
        patientName: record.patientName,
        patientAge: record.patientAge,
        fromRecord: true,
        recordContent: content,
      },
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "consultation":
        return "bg-blue-100 text-blue-700";
      case "diagnostic":
        return "bg-purple-100 text-purple-700";
      case "prescription":
        return "bg-green-100 text-green-700";
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
      default:
        return "Autre";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finalized":
        return "bg-green-100 text-green-700 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <File className="w-5 h-5" />;
      case "image":
        return <ImageIcon className="w-5 h-5" />;
      default:
        return <Paperclip className="w-5 h-5" />;
    }
  };

  return (
    <ExpertLayout title="Dossier médical">
      <div className="p-6 space-y-6">
        {/* Back button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link
            to="/expert/medical-records"
            className="inline-flex items-center gap-2 text-[#A68B6F] hover:text-[#8A7159] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour aux dossiers</span>
          </Link>
        </motion.div>

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-[#D4C5B9]"
        >
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-start gap-4 flex-1">
              <div className={`w-16 h-16 ${getTypeColor(record.recordType)} rounded-2xl flex items-center justify-center`}>
                <FileText className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 ${getTypeColor(record.recordType)} rounded-full text-xs font-medium`}>
                    {getTypeLabel(record.recordType)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(record.status)}`}
                  >
                    {record.status === "finalized" ? "FINALISÉ" : "BROUILLON"}
                  </span>
                </div>
                <h1 className="text-3xl font-serif text-[#1A1A1A] mb-3">{record.title}</h1>
                <div className="flex items-center gap-4 text-sm text-[#1A1A1A]/60">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{record.patientName}, {record.patientAge} ans</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(record.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      Modifié le {new Date(record.lastModified).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F5F1ED] border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#E8E0D8] transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm font-medium">Modifier</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#F5F1ED] border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#E8E0D8] transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Exporter</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span className="text-sm font-medium">Enregistrer</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-sm font-medium">Annuler</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tags */}
          {record.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {record.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-[#A68B6F]/10 text-[#A68B6F] rounded-full text-sm border border-[#A68B6F]/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {/* Patient info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#A68B6F] to-[#8A7159] rounded-3xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm mb-1">Patient</p>
              <h3 className="text-2xl font-serif mb-1">{record.patientName}</h3>
              <p className="text-white/90 text-sm">{record.patientAge} ans</p>
            </div>
            <Link
              to={`/expert/patients`}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-medium transition-colors"
            >
              Voir le profil
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Content editor */}
            <div className="bg-white rounded-3xl p-8 border border-[#D4C5B9]">
              <h2 className="text-xl font-serif text-[#1A1A1A] mb-6">Contenu du dossier</h2>

              {isEditing ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[600px] p-6 bg-[#F5F1ED] border border-[#D4C5B9] rounded-2xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F] font-mono text-sm leading-relaxed resize-y"
                  placeholder="Saisir les notes de consultation..."
                />
              ) : (
                <div className="prose prose-sm max-w-none">
                  <div className="bg-[#F5F1ED] rounded-2xl p-6">
                    <pre className="whitespace-pre-wrap text-sm text-[#1A1A1A] leading-relaxed font-sans">
                      {content}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Quick actions */}
            {!isEditing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleCreatePrescription}
                  className="flex items-center gap-3 p-4 bg-white border border-[#D4C5B9] rounded-2xl hover:bg-[#F5F1ED] transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">Créer une ordonnance</p>
                    <p className="text-xs text-[#1A1A1A]/60">À partir de ce dossier</p>
                  </div>
                </button>

                <button
                  onClick={handleAddToCarePlan}
                  className="flex items-center gap-3 p-4 bg-white border border-[#D4C5B9] rounded-2xl hover:bg-[#F5F1ED] transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">Ajouter au plan de soins</p>
                    <p className="text-xs text-[#1A1A1A]/60">Mise à jour du plan</p>
                  </div>
                </button>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Attachments */}
            <div className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif text-[#1A1A1A]">Documents joints</h3>
                <button className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                  <Plus className="w-4 h-4 text-[#1A1A1A]" />
                </button>
              </div>

              {record.attachments.length === 0 ? (
                <div className="text-center py-8">
                  <Paperclip className="w-10 h-10 text-[#1A1A1A]/40 mx-auto mb-2" />
                  <p className="text-sm text-[#1A1A1A]/60">Aucun document</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {record.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center gap-3 p-3 bg-[#F5F1ED] rounded-xl hover:bg-[#E8E0D8] transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-[#A68B6F]">
                        {getFileIcon(attachment.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A1A] truncate">{attachment.name}</p>
                        <p className="text-xs text-[#1A1A1A]/60">{attachment.size}</p>
                      </div>
                      <button className="p-1.5 hover:bg-white rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-[#A68B6F]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
              <h3 className="text-lg font-serif text-[#1A1A1A] mb-4">Historique</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1A1A1A]">Dossier finalisé</p>
                    <p className="text-xs text-[#1A1A1A]/60">
                      {new Date(record.lastModified).toLocaleDateString("fr-FR")} à 14:30
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Edit className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1A1A1A]">Dernière modification</p>
                    <p className="text-xs text-[#1A1A1A]/60">
                      {new Date(record.lastModified).toLocaleDateString("fr-FR")} à 14:15
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Plus className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1A1A1A]">Dossier créé</p>
                    <p className="text-xs text-[#1A1A1A]/60">
                      {new Date(record.date).toLocaleDateString("fr-FR")} à 09:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Confidentialité</p>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    Ce dossier est strictement confidentiel et protégé par le secret médical. Accès réservé aux
                    professionnels autorisés.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ExpertLayout>
  );
}