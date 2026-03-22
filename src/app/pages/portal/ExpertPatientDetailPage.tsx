import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Phone,
  Mail,
  MapPin,
  User,
  Clock,
  Video,
  Save,
  Edit,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function ExpertPatientDetailPage() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesForm, setNotesForm] = useState({
    notes: "",
    diagnosis: "",
    recommendations: "",
    nextSteps: "",
  });
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    loadPatientDetails();
  }, [patientId]);

  const loadPatientDetails = async () => {
    try {
      const token = localStorage.getItem("mona_expert_token");
      if (!token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/patients/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPatient(data.data.profile);
        setConsultations(data.data.consultations || []);
      }
    } catch (error) {
      console.error("Erreur chargement détails patient:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConsultation = (consultation: any) => {
    setSelectedConsultation(consultation);
    if (consultation.notes) {
      setNotesForm({
        notes: consultation.notes.notes || "",
        diagnosis: consultation.notes.diagnosis || "",
        recommendations: consultation.notes.recommendations || "",
        nextSteps: consultation.notes.nextSteps || "",
      });
    } else {
      setNotesForm({
        notes: "",
        diagnosis: "",
        recommendations: "",
        nextSteps: "",
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedConsultation) return;

    try {
      setSavingNotes(true);
      const token = localStorage.getItem("mona_expert_token");

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/patients/${patientId}/consultations/${selectedConsultation.id}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token!,
          },
          body: JSON.stringify(notesForm),
        }
      );

      if (response.ok) {
        alert("Notes enregistrées avec succès");
        setEditingNotes(false);
        loadPatientDetails();
      } else {
        alert("Erreur lors de l'enregistrement");
      }
    } catch (error) {
      console.error("Erreur sauvegarde notes:", error);
      alert("Une erreur est survenue");
    } finally {
      setSavingNotes(false);
    }
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

  if (!patient) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
          <p className="text-[#1A1A1A]/60">Patient non trouvé</p>
          <Link
            to="/expert/patients"
            className="text-[#A68B6F] hover:text-[#8A7159] mt-4 inline-block"
          >
            Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/expert/patients"
              className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1A1A1A]/60" />
            </Link>
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#A68B6F] to-[#C1694F] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                {patient.name?.charAt(0) || "P"}
              </div>
              <div>
                <h1 className="text-2xl font-serif text-[#1A1A1A]">
                  {patient.name || "Patient"}
                </h1>
                <p className="text-sm text-[#1A1A1A]/60 mt-1">
                  {consultations.length} consultation
                  {consultations.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
            >
              <h2 className="text-lg font-serif text-[#1A1A1A] mb-4">
                Informations
              </h2>
              <div className="space-y-4">
                {patient.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-5 h-5 text-[#1A1A1A]/40" />
                    <span className="text-[#1A1A1A]">{patient.email}</span>
                  </div>
                )}
                {patient.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-5 h-5 text-[#1A1A1A]/40" />
                    <span className="text-[#1A1A1A]">{patient.phone}</span>
                  </div>
                )}
                {patient.dateOfBirth && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-5 h-5 text-[#1A1A1A]/40" />
                    <span className="text-[#1A1A1A]">
                      {new Date(patient.dateOfBirth).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                )}
                {patient.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-5 h-5 text-[#1A1A1A]/40" />
                    <span className="text-[#1A1A1A]">{patient.location}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Consultations List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
            >
              <h2 className="text-lg font-serif text-[#1A1A1A] mb-4">
                Historique consultations
              </h2>
              {consultations.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-[#1A1A1A]/20 mx-auto mb-3" />
                  <p className="text-sm text-[#1A1A1A]/60">
                    Aucune consultation
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {consultations.map((consultation) => (
                    <button
                      key={consultation.id}
                      onClick={() => handleSelectConsultation(consultation)}
                      className={`w-full text-left p-3 rounded-xl transition-colors ${
                        selectedConsultation?.id === consultation.id
                          ? "bg-[#A68B6F] text-white"
                          : "bg-[#F5F1ED] hover:bg-[#E5DED6]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {new Date(consultation.date).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                      <p
                        className={`text-xs ${
                          selectedConsultation?.id === consultation.id
                            ? "text-white/80"
                            : "text-[#1A1A1A]/60"
                        }`}
                      >
                        {consultation.reason || "Consultation"}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Consultation Details & Notes */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
            >
              {!selectedConsultation ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
                  <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">
                    Sélectionnez une consultation
                  </h3>
                  <p className="text-sm text-[#1A1A1A]/60">
                    Choisissez une consultation pour voir et modifier les notes
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-serif text-[#1A1A1A] mb-1">
                        Notes de consultation
                      </h2>
                      <p className="text-sm text-[#1A1A1A]/60">
                        {new Date(selectedConsultation.date).toLocaleDateString(
                          "fr-FR",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    {!editingNotes ? (
                      <button
                        onClick={() => setEditingNotes(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingNotes(false)}
                          className="px-4 py-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSaveNotes}
                          disabled={savingNotes}
                          className="flex items-center gap-2 px-4 py-2 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors disabled:opacity-50"
                        >
                          <Save className="w-4 h-4" />
                          {savingNotes ? "Enregistrement..." : "Enregistrer"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Notes générales */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Notes générales
                      </label>
                      {editingNotes ? (
                        <textarea
                          value={notesForm.notes}
                          onChange={(e) =>
                            setNotesForm({ ...notesForm, notes: e.target.value })
                          }
                          rows={4}
                          className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent"
                          placeholder="Notes de la consultation..."
                        />
                      ) : (
                        <p className="text-sm text-[#1A1A1A] whitespace-pre-wrap bg-[#F5F1ED] p-4 rounded-xl">
                          {notesForm.notes || "Aucune note"}
                        </p>
                      )}
                    </div>

                    {/* Diagnostic */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Diagnostic
                      </label>
                      {editingNotes ? (
                        <textarea
                          value={notesForm.diagnosis}
                          onChange={(e) =>
                            setNotesForm({
                              ...notesForm,
                              diagnosis: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent"
                          placeholder="Diagnostic établi..."
                        />
                      ) : (
                        <p className="text-sm text-[#1A1A1A] whitespace-pre-wrap bg-[#F5F1ED] p-4 rounded-xl">
                          {notesForm.diagnosis || "Aucun diagnostic"}
                        </p>
                      )}
                    </div>

                    {/* Recommandations */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Recommandations
                      </label>
                      {editingNotes ? (
                        <textarea
                          value={notesForm.recommendations}
                          onChange={(e) =>
                            setNotesForm({
                              ...notesForm,
                              recommendations: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent"
                          placeholder="Recommandations pour le patient..."
                        />
                      ) : (
                        <p className="text-sm text-[#1A1A1A] whitespace-pre-wrap bg-[#F5F1ED] p-4 rounded-xl">
                          {notesForm.recommendations || "Aucune recommandation"}
                        </p>
                      )}
                    </div>

                    {/* Prochaines étapes */}
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Prochaines étapes
                      </label>
                      {editingNotes ? (
                        <textarea
                          value={notesForm.nextSteps}
                          onChange={(e) =>
                            setNotesForm({
                              ...notesForm,
                              nextSteps: e.target.value,
                            })
                          }
                          rows={3}
                          className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent"
                          placeholder="Plan de suivi..."
                        />
                      ) : (
                        <p className="text-sm text-[#1A1A1A] whitespace-pre-wrap bg-[#F5F1ED] p-4 rounded-xl">
                          {notesForm.nextSteps || "Aucun plan de suivi"}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
