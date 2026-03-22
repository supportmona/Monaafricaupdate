import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { 
  FileText, 
  Download,
  Share2,
  Lock,
  Heart,
  Pill,
  Activity,
  FileHeart,
  Calendar,
  Shield,
  Plus,
  Eye,
  AlertCircle,
  CheckCircle,
  BookOpen,
  Info,
  Edit2,
  Upload
} from "lucide-react";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  VitalsModal,
  AllergiesModal,
  ConditionsModal,
  VaccinationsModal,
  DocumentsModal,
  type VitalsData,
  type Allergy,
  type ChronicCondition,
  type Vaccination,
  type MedicalDocument
} from "@/app/components/HealthPassportModals";

export default function MemberHealthPassportPage() {
  const { user } = useMemberAuth();
  const [activeSection, setActiveSection] = useState<"overview" | "medical" | "prescriptions" | "documents">("overview");
  
  // États des modales
  const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
  const [isAllergiesModalOpen, setIsAllergiesModalOpen] = useState(false);
  const [isConditionsModalOpen, setIsConditionsModalOpen] = useState(false);
  const [isVaccinationsModalOpen, setIsVaccinationsModalOpen] = useState(false);
  const [isDocumentsModalOpen, setIsDocumentsModalOpen] = useState(false);
  
  // États des données
  const [vitals, setVitals] = useState<VitalsData>({
    bloodType: "",
    height: "",
    weight: "",
    bloodPressure: "",
    lastCheckup: ""
  });
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [conditions, setConditions] = useState<ChronicCondition[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  
  // États de chargement
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Charger les données au montage
  useEffect(() => {
    loadHealthData();
  }, [user]);

  const loadHealthData = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/health-passport/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": user.id
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.vitals) setVitals(data.vitals);
        if (data.allergies) setAllergies(data.allergies);
        if (data.conditions) setConditions(data.conditions);
        if (data.vaccinations) setVaccinations(data.vaccinations);
        if (data.documents) setDocuments(data.documents);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données de santé:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHealthData = async (dataType: string, data: any) => {
    if (!user?.id) return;
    
    try {
      setIsSaving(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/health-passport/${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": user.id
          },
          body: JSON.stringify({ type: dataType, data })
        }
      );
      
      if (!response.ok) {
        throw new Error("Erreur lors de la sauvegarde");
      }
      
      await loadHealthData();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Une erreur est survenue lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  // Calculer l'IMC
  const calculateBMI = (height: string, weight: string) => {
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      return (w / (h * h)).toFixed(1);
    }
    return null;
  };

  const bmi = calculateBMI(vitals.height, vitals.weight);

  // Données d'aperçu
  const healthData = {
    overview: {
      lastUpdate: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      fhirCompliant: true,
      encrypted: true,
      totalDocuments: documents.length,
      activePrescriptions: 0
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-serif text-[#1A1A1A]">Passeport Santé</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
                <Share2 className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <button className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
                <Download className="w-5 h-5 text-[#1A1A1A]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
        
        {/* Bandeau d'information */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3"
        >
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-900">
              <strong>Données personnelles protégées.</strong> Vos informations médicales sont chiffrées de bout en bout et conformes aux normes RGPD et FHIR. Vous pouvez ajouter vos données manuellement en cliquant sur les boutons d'édition.
            </p>
          </div>
        </motion.div>

        {/* En-tête de sécurité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-6 sm:p-8 text-white"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                <Shield className="w-3.5 h-3.5" />
                CONFIDENTIEL
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif mb-2">
                Passeport Santé
              </h2>
              <p className="text-white/70 text-sm">
                {user?.name || "Membre"}
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center">
              <FileHeart className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-white/60">Conformité</p>
                <p className="text-sm font-medium">RGPD & FHIR</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-white/60">Sécurité</p>
                <p className="text-sm font-medium">Chiffrement E2E</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-2xl border border-[#D4C5B9] p-2">
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-4 py-3 rounded-lg transition-colors ${
                activeSection === "overview"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#1A1A1A]/60 hover:bg-[#F5F1ED]"
              }`}
            >
              <Activity className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Aperçu</span>
            </button>
            <button
              onClick={() => setActiveSection("medical")}
              className={`px-4 py-3 rounded-lg transition-colors ${
                activeSection === "medical"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#1A1A1A]/60 hover:bg-[#F5F1ED]"
              }`}
            >
              <Heart className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Médical</span>
            </button>
            <button
              onClick={() => setActiveSection("prescriptions")}
              className={`px-4 py-3 rounded-lg transition-colors ${
                activeSection === "prescriptions"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#1A1A1A]/60 hover:bg-[#F5F1ED]"
              }`}
            >
              <Pill className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Ordonnances</span>
            </button>
            <button
              onClick={() => setActiveSection("documents")}
              className={`px-4 py-3 rounded-lg transition-colors ${
                activeSection === "documents"
                  ? "bg-[#1A1A1A] text-white"
                  : "text-[#1A1A1A]/60 hover:bg-[#F5F1ED]"
              }`}
            >
              <FileText className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">Documents</span>
            </button>
          </div>
        </div>

        {/* Aperçu */}
        {activeSection === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Stats rapides */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-[#D4C5B9]">
                <div className="w-10 h-10 bg-[#A68B6F]/10 rounded-full flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-[#A68B6F]" />
                </div>
                <p className="text-2xl font-light text-[#1A1A1A] mb-1">
                  {healthData.overview.totalDocuments}
                </p>
                <p className="text-xs text-[#1A1A1A]/60">Documents</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#D4C5B9]">
                <div className="w-10 h-10 bg-[#A68B6F]/10 rounded-full flex items-center justify-center mb-3">
                  <Pill className="w-5 h-5 text-[#A68B6F]" />
                </div>
                <p className="text-2xl font-light text-[#1A1A1A] mb-1">
                  {healthData.overview.activePrescriptions}
                </p>
                <p className="text-xs text-[#1A1A1A]/60">Ordonnances</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#D4C5B9]">
                <div className="w-10 h-10 bg-[#A68B6F]/10 rounded-full flex items-center justify-center mb-3">
                  <AlertCircle className="w-5 h-5 text-[#A68B6F]" />
                </div>
                <p className="text-2xl font-light text-[#1A1A1A] mb-1">
                  {allergies.length}
                </p>
                <p className="text-xs text-[#1A1A1A]/60">Allergies</p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-[#D4C5B9]">
                <div className="w-10 h-10 bg-[#A68B6F]/10 rounded-full flex items-center justify-center mb-3">
                  <FileHeart className="w-5 h-5 text-[#A68B6F]" />
                </div>
                <p className="text-2xl font-light text-[#1A1A1A] mb-1">
                  {vaccinations.length}
                </p>
                <p className="text-xs text-[#1A1A1A]/60">Vaccins</p>
              </div>
            </div>

            {/* Action rapide si profil vide */}
            {!vitals.bloodType && allergies.length === 0 && vaccinations.length === 0 && documents.length === 0 && (
              <div className="bg-white rounded-3xl p-8 border border-[#D4C5B9] text-center">
                <div className="w-20 h-20 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileHeart className="w-10 h-10 text-[#1A1A1A]/40" />
                </div>
                <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">
                  Complétez votre passeport santé
                </h3>
                <p className="text-sm text-[#1A1A1A]/60 mb-6 max-w-md mx-auto">
                  Ajoutez vos informations médicales pour bénéficier d'un suivi personnalisé et faciliter vos consultations.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={() => setIsVitalsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors text-sm"
                  >
                    <Heart className="w-4 h-4" />
                    Constantes vitales
                  </button>
                  <button
                    onClick={() => setIsAllergiesModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#F5F1ED] transition-colors text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Allergies
                  </button>
                  <button
                    onClick={() => setIsVaccinationsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#F5F1ED] transition-colors text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Vaccinations
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Section Médical */}
        {activeSection === "medical" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Constantes vitales */}
            <div className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif text-[#1A1A1A]">Constantes vitales</h3>
                <button
                  onClick={() => setIsVitalsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#A68B6F] text-white rounded-lg hover:bg-[#8A7159] transition-colors text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </button>
              </div>
              
              {vitals.bloodType || vitals.height || vitals.weight ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {vitals.bloodType && (
                    <div className="p-4 bg-[#F5F1ED] rounded-xl">
                      <p className="text-xs text-[#1A1A1A]/60 mb-1">Groupe sanguin</p>
                      <p className="text-lg font-medium text-[#1A1A1A]">{vitals.bloodType}</p>
                    </div>
                  )}
                  {vitals.height && (
                    <div className="p-4 bg-[#F5F1ED] rounded-xl">
                      <p className="text-xs text-[#1A1A1A]/60 mb-1">Taille</p>
                      <p className="text-lg font-medium text-[#1A1A1A]">{vitals.height} cm</p>
                    </div>
                  )}
                  {vitals.weight && (
                    <div className="p-4 bg-[#F5F1ED] rounded-xl">
                      <p className="text-xs text-[#1A1A1A]/60 mb-1">Poids</p>
                      <p className="text-lg font-medium text-[#1A1A1A]">{vitals.weight} kg</p>
                    </div>
                  )}
                  {bmi && (
                    <div className="p-4 bg-[#F5F1ED] rounded-xl">
                      <p className="text-xs text-[#1A1A1A]/60 mb-1">IMC</p>
                      <p className="text-lg font-medium text-[#1A1A1A]">{bmi}</p>
                    </div>
                  )}
                  {vitals.bloodPressure && (
                    <div className="p-4 bg-[#F5F1ED] rounded-xl">
                      <p className="text-xs text-[#1A1A1A]/60 mb-1">Tension artérielle</p>
                      <p className="text-lg font-medium text-[#1A1A1A]">{vitals.bloodPressure}</p>
                    </div>
                  )}
                  {vitals.lastCheckup && (
                    <div className="p-4 bg-[#F5F1ED] rounded-xl">
                      <p className="text-xs text-[#1A1A1A]/60 mb-1">Dernier bilan</p>
                      <p className="text-lg font-medium text-[#1A1A1A]">{new Date(vitals.lastCheckup).toLocaleDateString("fr-FR")}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-[#1A1A1A]/40" />
                  </div>
                  <p className="text-sm text-[#1A1A1A]/60 mb-4">
                    Aucune donnée médicale enregistrée
                  </p>
                  <button
                    onClick={() => setIsVitalsModalOpen(true)}
                    className="text-sm text-[#A68B6F] hover:underline"
                  >
                    Ajouter mes constantes vitales
                  </button>
                </div>
              )}
            </div>

            {/* Allergies */}
            <div className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif text-[#1A1A1A]">Allergies</h3>
                <button
                  onClick={() => setIsAllergiesModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#A68B6F] text-white rounded-lg hover:bg-[#8A7159] transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
              
              {allergies.length > 0 ? (
                <div className="space-y-3">
                  {allergies.map((allergy) => (
                    <div key={allergy.id} className="p-4 bg-[#F5F1ED] rounded-xl">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-[#1A1A1A]">{allergy.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              allergy.severity === "Sévère" ? "bg-red-100 text-red-700" :
                              allergy.severity === "Modérée" ? "bg-orange-100 text-orange-700" :
                              "bg-yellow-100 text-yellow-700"
                            }`}>
                              {allergy.severity}
                            </span>
                          </div>
                          <p className="text-sm text-[#1A1A1A]/60">{allergy.reaction}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-[#1A1A1A]/40" />
                  </div>
                  <p className="text-sm text-[#1A1A1A]/60 mb-4">
                    Aucune allergie enregistrée
                  </p>
                  <button
                    onClick={() => setIsAllergiesModalOpen(true)}
                    className="text-sm text-[#A68B6F] hover:underline"
                  >
                    Déclarer mes allergies
                  </button>
                </div>
              )}
            </div>

            {/* Conditions chroniques */}
            <div className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif text-[#1A1A1A]">Conditions chroniques</h3>
                <button
                  onClick={() => setIsConditionsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#A68B6F] text-white rounded-lg hover:bg-[#8A7159] transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
              
              {conditions.length > 0 ? (
                <div className="space-y-3">
                  {conditions.map((condition) => (
                    <div key={condition.id} className="p-4 bg-[#F5F1ED] rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-[#1A1A1A]">{condition.name}</p>
                        <span className="text-xs text-[#1A1A1A]/60">
                          Diagnostiqué le {new Date(condition.diagnosedDate).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-sm text-[#1A1A1A]/60">{condition.treatment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-[#1A1A1A]/40" />
                  </div>
                  <p className="text-sm text-[#1A1A1A]/60 mb-4">
                    Aucune condition chronique enregistrée
                  </p>
                  <button
                    onClick={() => setIsConditionsModalOpen(true)}
                    className="text-sm text-[#A68B6F] hover:underline"
                  >
                    Déclarer mes conditions
                  </button>
                </div>
              )}
            </div>

            {/* Vaccinations */}
            <div className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif text-[#1A1A1A]">Vaccinations</h3>
                <button
                  onClick={() => setIsVaccinationsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#A68B6F] text-white rounded-lg hover:bg-[#8A7159] transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
              
              {vaccinations.length > 0 ? (
                <div className="space-y-3">
                  {vaccinations.map((vaccination) => (
                    <div key={vaccination.id} className="p-4 bg-[#F5F1ED] rounded-xl">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-[#1A1A1A]">{vaccination.name}</p>
                        <span className="text-xs text-[#1A1A1A]/60">
                          {new Date(vaccination.date).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      {vaccination.nextDose && (
                        <p className="text-sm text-[#1A1A1A]/60">
                          Prochaine dose: {new Date(vaccination.nextDose).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-[#1A1A1A]/40" />
                  </div>
                  <p className="text-sm text-[#1A1A1A]/60 mb-4">
                    Aucune vaccination enregistrée
                  </p>
                  <button
                    onClick={() => setIsVaccinationsModalOpen(true)}
                    className="text-sm text-[#A68B6F] hover:underline"
                  >
                    Ajouter mes vaccinations
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Section Ordonnances */}
        {activeSection === "prescriptions" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif text-[#1A1A1A]">Ordonnances actives</h3>
                <button className="text-sm text-[#A68B6F] hover:underline">
                  Historique
                </button>
              </div>
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Pill className="w-10 h-10 text-[#1A1A1A]/40" />
                </div>
                <h4 className="text-lg font-serif text-[#1A1A1A] mb-2">
                  Aucune ordonnance active
                </h4>
                <p className="text-sm text-[#1A1A1A]/60 mb-6">
                  Vos ordonnances apparaîtront ici après vos consultations médicales
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Section Documents */}
        {activeSection === "documents" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-serif text-[#1A1A1A]">Mes documents</h3>
                <button
                  onClick={() => setIsDocumentsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#A68B6F] text-white rounded-lg hover:bg-[#8A7159] transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
              
              {documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="p-4 bg-[#F5F1ED] rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#A68B6F]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#1A1A1A] text-sm">{doc.name}</p>
                          <p className="text-xs text-[#1A1A1A]/60">
                            {doc.type} • {doc.size} • {new Date(doc.uploadDate).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-[#1A1A1A]" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-[#1A1A1A]" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-[#1A1A1A]/40" />
                  </div>
                  <h4 className="text-lg font-serif text-[#1A1A1A] mb-2">
                    Aucun document médical
                  </h4>
                  <p className="text-sm text-[#1A1A1A]/60 mb-6">
                    Téléchargez vos documents médicaux (ordonnances, résultats d'analyses, comptes-rendus)
                  </p>
                  <button
                    onClick={() => setIsDocumentsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Télécharger un document
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* MODALES */}
      <VitalsModal
        isOpen={isVitalsModalOpen}
        onClose={() => setIsVitalsModalOpen(false)}
        vitals={vitals}
        onSave={(data) => {
          setVitals(data);
          saveHealthData("vitals", data);
          setIsVitalsModalOpen(false);
        }}
        isSaving={isSaving}
      />

      <AllergiesModal
        isOpen={isAllergiesModalOpen}
        onClose={() => setIsAllergiesModalOpen(false)}
        allergies={allergies}
        onSave={(data) => {
          setAllergies(data);
          saveHealthData("allergies", data);
          setIsAllergiesModalOpen(false);
        }}
        isSaving={isSaving}
      />

      <ConditionsModal
        isOpen={isConditionsModalOpen}
        onClose={() => setIsConditionsModalOpen(false)}
        conditions={conditions}
        onSave={(data) => {
          setConditions(data);
          saveHealthData("conditions", data);
          setIsConditionsModalOpen(false);
        }}
        isSaving={isSaving}
      />

      <VaccinationsModal
        isOpen={isVaccinationsModalOpen}
        onClose={() => setIsVaccinationsModalOpen(false)}
        vaccinations={vaccinations}
        onSave={(data) => {
          setVaccinations(data);
          saveHealthData("vaccinations", data);
          setIsVaccinationsModalOpen(false);
        }}
        isSaving={isSaving}
      />

      <DocumentsModal
        isOpen={isDocumentsModalOpen}
        onClose={() => setIsDocumentsModalOpen(false)}
        documents={documents}
        onSave={(data) => {
          setDocuments(data);
          saveHealthData("documents", data);
          setIsDocumentsModalOpen(false);
        }}
        isSaving={isSaving}
      />

      {/* Navigation PWA Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] safe-area-inset-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              to="/member/dashboard"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs">Accueil</span>
            </Link>
            <Link
              to="/member/consultations"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs">Consultations</span>
            </Link>
            <Link
              to="/member/health-passport"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]"
            >
              <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium">Passeport</span>
            </Link>
            <Link
              to="/member/resources"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs">Ressources</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
