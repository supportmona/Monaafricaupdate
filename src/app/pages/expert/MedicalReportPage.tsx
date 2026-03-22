import { useState } from "react";
import { useNavigate } from "react-router";
import ExpertLayout from "@/app/components/ExpertLayout";
import {
  FileText,
  Download,
  Printer,
  Copy,
  ArrowLeft,
  Calendar,
  User,
  Stethoscope,
  Brain,
  Check,
  Activity,
} from "lucide-react";

type ReportType = "mental_health" | "primary_care";

interface ReportForm {
  patientName: string;
  birthDate: string;
  consultationDate: string;
  consultationType: string;
  reason: string;
  history: string;
  medicalHistory: string;
  currentTreatments: string;
  psychosocialContext: string;
  clinicalExam: string;
  diagnosis: string;
  therapeuticPlan: string;
  conclusion: string;
  doctorName: string;
  // Pour soins primaires
  surgicalHistory?: string;
  allergies?: string;
  familyHistory?: string;
  vitals?: string;
  complementaryExams?: string;
}

export default function MedicalReportPage() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState<ReportType>("mental_health");
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState<ReportForm>({
    patientName: "",
    birthDate: "",
    consultationDate: new Date().toISOString().split("T")[0],
    consultationType: "Première consultation",
    reason: "",
    history: "",
    medicalHistory: "",
    currentTreatments: "",
    psychosocialContext: "",
    clinicalExam: "",
    diagnosis: "",
    therapeuticPlan: "",
    conclusion: "",
    doctorName: "Dr. Sarah Koné",
    surgicalHistory: "",
    allergies: "",
    familyHistory: "",
    vitals: "",
    complementaryExams: "",
  });

  const handleInputChange = (field: keyof ReportForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateReportContent = () => {
    if (reportType === "mental_health") {
      return `COMPTE-RENDU DE CONSULTATION PSYCHIATRIQUE/PSYCHOLOGIQUE

INFORMATIONS PATIENT
Nom : ${formData.patientName || "[NOM PATIENT]"}
Date de naissance : ${formData.birthDate || "[DATE NAISSANCE]"}
Date de consultation : ${formData.consultationDate}
Type : ${formData.consultationType}

MOTIF DE CONSULTATION
${formData.reason || "[Motif exprimé par le patient]"}

ANAMNÈSE
Antécédents psychiatriques : ${formData.medicalHistory || "[Détails]"}
Traitements en cours : ${formData.currentTreatments || "[Liste]"}
Contexte psychosocial : ${formData.psychosocialContext || "[Détails]"}

HISTOIRE DE LA MALADIE ACTUELLE
${formData.history || "[Chronologie, symptômes, facteurs déclenchants, évolution]"}

EXAMEN CLINIQUE
${formData.clinicalExam || "[Présentation, état émotionnel, cognition, pensées, risque suicidaire]"}

DIAGNOSTIC
${formData.diagnosis || "[Diagnostic principal selon CIM-11]"}

PLAN THÉRAPEUTIQUE
${formData.therapeuticPlan || "[Traitement pharmacologique, psychothérapie, suivi]"}

CONCLUSION
${formData.conclusion || "[Synthèse et pronostic]"}

${formData.doctorName}
${formData.consultationDate}`;
    } else {
      return `COMPTE-RENDU DE CONSULTATION MÉDICALE

INFORMATIONS PATIENT
Nom : ${formData.patientName || "[NOM PATIENT]"}
Date de naissance : ${formData.birthDate || "[DATE NAISSANCE]"}
Date de consultation : ${formData.consultationDate}
Type : ${formData.consultationType}

MOTIF DE CONSULTATION
${formData.reason || "[Motif principal]"}

ANAMNÈSE
Antécédents médicaux : ${formData.medicalHistory || "[Détails]"}
Antécédents chirurgicaux : ${formData.surgicalHistory || "[Détails]"}
Traitements en cours : ${formData.currentTreatments || "[Liste]"}
Allergies : ${formData.allergies || "[Liste]"}
Contexte familial : ${formData.familyHistory || "[Antécédents familiaux pertinents]"}

HISTOIRE DE LA MALADIE ACTUELLE
${formData.history || "[Chronologie des symptômes, évolution]"}

EXAMEN PHYSIQUE
Constantes : ${formData.vitals || "TA [__/__], FC [__], T° [__], SpO2 [__]"}
${formData.clinicalExam || "[Examen général et par systèmes]"}

EXAMENS COMPLÉMENTAIRES
${formData.complementaryExams || "[Résultats des examens réalisés ou prescrits]"}

DIAGNOSTIC
${formData.diagnosis || "[Diagnostic principal et diagnostics associés]"}

TRAITEMENT
${formData.therapeuticPlan || "[Prescription, mesures hygiéno-diététiques, suivi]"}

CONCLUSION
${formData.conclusion || "[Synthèse]"}

${formData.doctorName}
${formData.consultationDate}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportContent());
    alert("Compte-rendu copié dans le presse-papiers");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <ExpertLayout title="Compte-rendu">
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
              <h1 className="text-3xl font-serif text-[#1A1A1A]">Compte-rendu de consultation</h1>
              <p className="text-[#1A1A1A]/60 mt-1">
                Document détaillé de la consultation
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

        {/* Type de compte-rendu */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setReportType("mental_health")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              reportType === "mental_health"
                ? "bg-[#1A1A1A] text-white"
                : "bg-[#F5F1ED] text-[#1A1A1A]/70 hover:bg-[#E5DDD5]"
            }`}
          >
            <Brain className="w-4 h-4" />
            Santé mentale
          </button>
          <button
            onClick={() => setReportType("primary_care")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              reportType === "primary_care"
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
              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations patient
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
                      Date de consultation
                    </label>
                    <input
                      type="date"
                      value={formData.consultationDate}
                      onChange={(e) => handleInputChange("consultationDate", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Type de consultation
                    </label>
                    <select
                      value={formData.consultationType}
                      onChange={(e) => handleInputChange("consultationType", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                    >
                      <option>Première consultation</option>
                      <option>Suivi</option>
                      <option>Urgence</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Consultation
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Motif de consultation
                    </label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => handleInputChange("reason", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Motif principal de la consultation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Histoire de la maladie actuelle
                    </label>
                    <textarea
                      value={formData.history}
                      onChange={(e) => handleInputChange("history", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Chronologie, symptômes, évolution"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Anamnèse
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Antécédents médicaux
                    </label>
                    <textarea
                      value={formData.medicalHistory}
                      onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder={reportType === "mental_health" ? "Antécédents psychiatriques" : "Antécédents médicaux"}
                    />
                  </div>
                  {reportType === "primary_care" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          Antécédents chirurgicaux
                        </label>
                        <textarea
                          value={formData.surgicalHistory}
                          onChange={(e) => handleInputChange("surgicalHistory", e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          Allergies
                        </label>
                        <input
                          type="text"
                          value={formData.allergies}
                          onChange={(e) => handleInputChange("allergies", e.target.value)}
                          className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                          Contexte familial
                        </label>
                        <textarea
                          value={formData.familyHistory}
                          onChange={(e) => handleInputChange("familyHistory", e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Traitements en cours
                    </label>
                    <textarea
                      value={formData.currentTreatments}
                      onChange={(e) => handleInputChange("currentTreatments", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                    />
                  </div>
                  {reportType === "mental_health" && (
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Contexte psychosocial
                      </label>
                      <textarea
                        value={formData.psychosocialContext}
                        onChange={(e) => handleInputChange("psychosocialContext", e.target.value)}
                        rows={2}
                        className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6">
                  Examen clinique
                </h2>
                <div className="space-y-4">
                  {reportType === "primary_care" && (
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Constantes vitales
                      </label>
                      <input
                        type="text"
                        value={formData.vitals}
                        onChange={(e) => handleInputChange("vitals", e.target.value)}
                        className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                        placeholder="TA, FC, T°, SpO2"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {reportType === "mental_health" ? "État mental" : "Examen physique"}
                    </label>
                    <textarea
                      value={formData.clinicalExam}
                      onChange={(e) => handleInputChange("clinicalExam", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder={reportType === "mental_health" ? "Présentation, état émotionnel, cognition" : "Examen général et par systèmes"}
                    />
                  </div>
                  {reportType === "primary_care" && (
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Examens complémentaires
                      </label>
                      <textarea
                        value={formData.complementaryExams}
                        onChange={(e) => handleInputChange("complementaryExams", e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6">
                  Diagnostic et traitement
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Diagnostic
                    </label>
                    <textarea
                      value={formData.diagnosis}
                      onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Diagnostic principal"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Plan thérapeutique
                    </label>
                    <textarea
                      value={formData.therapeuticPlan}
                      onChange={(e) => handleInputChange("therapeuticPlan", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder={reportType === "mental_health" ? "Traitement pharmacologique, psychothérapie, suivi" : "Prescription, mesures hygiéno-diététiques, suivi"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Conclusion
                    </label>
                    <textarea
                      value={formData.conclusion}
                      onChange={(e) => handleInputChange("conclusion", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Synthèse et pronostic"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Prévisualisation */}
          <div className="bg-white border border-[#D4C5B9] rounded-2xl p-8 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-[#1A1A1A]">Aperçu du compte-rendu</h2>
              <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                <Check className="w-4 h-4 text-green-600" />
                Prêt
              </div>
            </div>
            <div className="bg-[#F5F1ED] rounded-xl p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
              <pre className="font-mono text-xs text-[#1A1A1A] whitespace-pre-wrap leading-relaxed">
                {generateReportContent()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
}
