import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import ExpertLayout from "@/app/components/ExpertLayout";
import {
  FileText,
  Download,
  Printer,
  Copy,
  ArrowLeft,
  User,
  Stethoscope,
  Brain,
  Check,
  Pill,
  Plus,
  X,
} from "lucide-react";

type PrescriptionType = "mental_health" | "primary_care";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionForm {
  patientName: string;
  birthDate: string;
  prescriptionDate: string;
  medications: Medication[];
  generalInstructions: string;
  warnings: string;
  doctorName: string;
  specialty: string;
  licenseNumber: string;
  city: string;
}

export default function PrescriptionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [prescriptionType, setPrescriptionType] = useState<PrescriptionType>("mental_health");
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState<PrescriptionForm>({
    patientName: "",
    birthDate: "",
    prescriptionDate: new Date().toISOString().split("T")[0],
    medications: [
      { name: "", dosage: "", frequency: "", duration: "", instructions: "" }
    ],
    generalInstructions: "",
    warnings: "",
    doctorName: "Dr. Sarah Koné",
    specialty: "Psychiatrie",
    licenseNumber: "",
    city: "Kinshasa",
  });

  // Pré-remplir les données si on vient du dossier médical
  useEffect(() => {
    if (location.state) {
      const { patientName, birthDate } = location.state as any;
      setFormData(prev => ({
        ...prev,
        patientName: patientName || prev.patientName,
        birthDate: birthDate || prev.birthDate,
      }));
    }
  }, [location.state]);

  const handleInputChange = (field: keyof PrescriptionForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    const newMedications = [...formData.medications];
    newMedications[index] = { ...newMedications[index], [field]: value };
    setFormData(prev => ({ ...prev, medications: newMedications }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }]
    }));
  };

  const removeMedication = (index: number) => {
    if (formData.medications.length > 1) {
      setFormData(prev => ({
        ...prev,
        medications: prev.medications.filter((_, i) => i !== index)
      }));
    }
  };

  const generatePrescriptionContent = () => {
    return `ORDONNANCE ${prescriptionType === "mental_health" ? "- SANTÉ MENTALE" : "MÉDICALE"}

${formData.doctorName}
${formData.specialty}
${formData.licenseNumber ? `N° Ordre : ${formData.licenseNumber}` : ""}
${formData.city}

Date : ${formData.prescriptionDate}

PATIENT
Nom : ${formData.patientName || "[NOM PATIENT]"}
Date de naissance : ${formData.birthDate || "[DATE NAISSANCE]"}

PRESCRIPTION

${formData.medications.map((med, index) => {
  if (!med.name) return `${index + 1}. [MÉDICAMENT] - [DOSAGE]
   Fréquence : [FRÉQUENCE]
   Durée : [DURÉE]
   ${med.instructions ? `Instructions : ${med.instructions}` : "Instructions : [INSTRUCTIONS]"}`;
  
  return `${index + 1}. ${med.name} ${med.dosage || "[DOSAGE]"}
   Fréquence : ${med.frequency || "[FRÉQUENCE]"}
   Durée : ${med.duration || "[DURÉE]"}
   ${med.instructions ? `Instructions : ${med.instructions}` : ""}`;
}).join("\n\n")}

${formData.generalInstructions ? `INSTRUCTIONS GÉNÉRALES
${formData.generalInstructions}` : ""}

${formData.warnings ? `MISES EN GARDE
${formData.warnings}` : ""}

${prescriptionType === "mental_health" ? "Cette ordonnance doit être présentée dans les 72 heures." : ""}

${formData.doctorName}
Signature et cachet`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePrescriptionContent());
    alert("Ordonnance copiée dans le presse-papiers");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <ExpertLayout title="Ordonnance">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/expert/documents")}
              className="p-2 hover:bg-[#F5F1ED] rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
            </button>
            <div>
              <h1 className="text-3xl font-serif text-[#1A1A1A]">Ordonnance</h1>
              <p className="text-[#1A1A1A]/60 mt-1">
                Prescrire des médicaments à votre patient
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-white border border-[#D4C5B9] rounded-full hover:bg-[#F5F1ED] transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span className="text-sm font-medium">Copier</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white border border-[#D4C5B9] rounded-full hover:bg-[#F5F1ED] transition-colors flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span className="text-sm font-medium">Imprimer</span>
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-[#1A1A1A] text-white rounded-full hover:bg-[#1A1A1A]/90 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">
                {showPreview ? "Éditer" : "Prévisualiser"}
              </span>
            </button>
          </div>
        </div>

        {/* Type d'ordonnance */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPrescriptionType("mental_health")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              prescriptionType === "mental_health"
                ? "bg-[#1A1A1A] text-white"
                : "bg-[#F5F1ED] text-[#1A1A1A]/70 hover:bg-[#E5DDD5]"
            }`}
          >
            <Brain className="w-4 h-4" />
            Santé mentale
          </button>
          <button
            onClick={() => setPrescriptionType("primary_care")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              prescriptionType === "primary_care"
                ? "bg-[#1A1A1A] text-white"
                : "bg-[#F5F1ED] text-[#1A1A1A]/70 hover:bg-[#E5DDD5]"
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            Soins primaires
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulaire */}
          {!showPreview && (
            <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
              {/* Informations patient */}
              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Patient
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Nom du patient
                    </label>
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange("patientName", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Ex: Jean Dupont"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange("birthDate", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Date de l'ordonnance
                    </label>
                    <input
                      type="date"
                      value={formData.prescriptionDate}
                      onChange={(e) => handleInputChange("prescriptionDate", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                    />
                  </div>
                </div>
              </div>

              {/* Médicaments */}
              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-serif text-[#1A1A1A] flex items-center gap-2">
                    <Pill className="w-5 h-5" />
                    Médicaments ({formData.medications.length})
                  </h2>
                  <button
                    onClick={addMedication}
                    className="px-3 py-2 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors flex items-center gap-2 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
                <div className="space-y-6">
                  {formData.medications.map((med, index) => (
                    <div key={index} className="bg-[#F5F1ED] rounded-xl p-4 space-y-4 relative">
                      {formData.medications.length > 1 && (
                        <button
                          onClick={() => removeMedication(index)}
                          className="absolute top-4 right-4 p-1 hover:bg-white rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4 text-[#1A1A1A]/60" />
                        </button>
                      )}
                      <div className="pr-8">
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          Médicament {index + 1}
                        </label>
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                          className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                          placeholder="Ex: Sertraline"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            Dosage
                          </label>
                          <input
                            type="text"
                            value={med.dosage}
                            onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                            className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                            placeholder="Ex: 50mg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                            Fréquence
                          </label>
                          <input
                            type="text"
                            value={med.frequency}
                            onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                            className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                            placeholder="Ex: 1x/jour"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          Durée
                        </label>
                        <input
                          type="text"
                          value={med.duration}
                          onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                          className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                          placeholder="Ex: 4 semaines"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          Instructions
                        </label>
                        <textarea
                          value={med.instructions}
                          onChange={(e) => handleMedicationChange(index, "instructions", e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                          placeholder="Ex: À prendre le matin pendant le repas"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions et avertissements */}
              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Instructions et mises en garde
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Instructions générales
                    </label>
                    <textarea
                      value={formData.generalInstructions}
                      onChange={(e) => handleInputChange("generalInstructions", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Ex: À prendre avec de l'eau, éviter l'alcool, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Mises en garde
                    </label>
                    <textarea
                      value={formData.warnings}
                      onChange={(e) => handleInputChange("warnings", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Ex: Ne pas arrêter brutalement, contre-indications, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Informations praticien */}
              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6">
                  Informations praticien
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Nom du praticien
                    </label>
                    <input
                      type="text"
                      value={formData.doctorName}
                      onChange={(e) => handleInputChange("doctorName", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Spécialité
                    </label>
                    <input
                      type="text"
                      value={formData.specialty}
                      onChange={(e) => handleInputChange("specialty", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Numéro d'ordre (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Ville
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Prévisualisation */}
          <div className="bg-white border border-[#D4C5B9] rounded-2xl p-8 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-[#1A1A1A]">Aperçu de l'ordonnance</h2>
              <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                <Check className="w-4 h-4 text-green-600" />
                Prêt
              </div>
            </div>
            <div className="bg-[#F5F1ED] rounded-xl p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
              <pre className="font-mono text-xs text-[#1A1A1A] whitespace-pre-wrap leading-relaxed">
                {generatePrescriptionContent()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
}