import { useState } from "react";
import { useNavigate } from "react-router";
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
  Send,
} from "lucide-react";

type ReferralType = "mental_health" | "primary_care";

interface ReferralForm {
  // Praticien émetteur
  doctorName: string;
  doctorSpecialty: string;
  doctorAddress: string;
  doctorPhone: string;
  
  // Destinataire
  recipientName: string;
  recipientSpecialty: string;
  recipientAddress: string;
  
  // Patient
  patientName: string;
  patientAge: string;
  patientBirthDate: string;
  
  // Contenu
  clinicalContext: string;
  currentSituation: string;
  currentTreatments: string;
  referralReason: string;
  specificQuestions: string;
  
  date: string;
}

export default function ReferralLetterPage() {
  const navigate = useNavigate();
  const [referralType, setReferralType] = useState<ReferralType>("mental_health");
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState<ReferralForm>({
    doctorName: "Dr. Sarah Koné",
    doctorSpecialty: "Psychiatrie",
    doctorAddress: "Cabinet médical M.O.N.A, Kinshasa",
    doctorPhone: "+243 XX XXX XXXX",
    recipientName: "",
    recipientSpecialty: "",
    recipientAddress: "",
    patientName: "",
    patientAge: "",
    patientBirthDate: "",
    clinicalContext: "",
    currentSituation: "",
    currentTreatments: "",
    referralReason: "",
    specificQuestions: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (field: keyof ReferralForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateReferralContent = () => {
    const title = referralType === "mental_health" 
      ? "LETTRE DE LIAISON - SANTÉ MENTALE" 
      : "LETTRE DE LIAISON MÉDICALE";

    return `${title}

${formData.doctorName}
${formData.doctorSpecialty}
${formData.doctorAddress}
${formData.doctorPhone}

À l'attention du ${formData.recipientName || "Dr. [NOM DESTINATAIRE]"}
${formData.recipientSpecialty || "[SPÉCIALITÉ DESTINATAIRE]"}
${formData.recipientAddress || "[ADRESSE]"}

Objet : Patient ${formData.patientName || "[NOM PATIENT]"} - ${formData.patientAge || "[AGE]"} ans

Cher confrère,

Je vous adresse ${formData.patientName ? "Monsieur/Madame " + formData.patientName : "[Monsieur/Madame] [NOM PATIENT]"}, né(e) le ${formData.patientBirthDate || "[DATE]"}, ${referralType === "mental_health" ? "que je suis actuellement pour " : "pour "}${formData.referralReason || "[MOTIF]"}.

${referralType === "mental_health" ? "CONTEXTE CLINIQUE" : "ANTÉCÉDENTS"}
${formData.clinicalContext || (referralType === "mental_health" ? "[Historique psychiatrique pertinent]" : "[Antécédents médicaux et chirurgicaux pertinents]")}

SITUATION ACTUELLE
${formData.currentSituation || (referralType === "mental_health" ? "[État actuel du patient, symptomatologie]" : "[Tableau clinique actuel, symptômes, évolution]")}

TRAITEMENT EN COURS
${formData.currentTreatments || "[Liste des traitements actuels]"}

MOTIF DE L'ADRESSAGE
Je vous adresse ce patient pour ${formData.referralReason || (referralType === "mental_health" ? "[avis spécialisé, prise en charge complémentaire, orientation vers structure adaptée, etc.]" : "[avis spécialisé, exploration complémentaire, prise en charge spécifique]")}.

${formData.specificQuestions ? `Questions spécifiques : ${formData.specificQuestions}` : "Questions spécifiques : [SI APPLICABLE]"}

Je reste à votre disposition pour tout renseignement complémentaire et vous remercie ${referralType === "mental_health" ? "de la prise en charge de ce patient" : "de votre prise en charge"}.

Confraternellement,

${formData.doctorName}
${formData.date}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReferralContent());
    alert("Lettre de liaison copiée dans le presse-papiers");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <ExpertLayout title="Lettre de liaison">
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
              <h1 className="text-3xl font-serif text-[#1A1A1A]">Lettre de liaison</h1>
              <p className="text-[#1A1A1A]/60 mt-1">
                Adresser un patient à un confrère
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

        {/* Type de lettre */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setReferralType("mental_health")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              referralType === "mental_health"
                ? "bg-[#1A1A1A] text-white"
                : "bg-[#F5F1ED] text-[#1A1A1A]/70 hover:bg-[#E5DDD5]"
            }`}
          >
            <Brain className="w-4 h-4" />
            Santé mentale
          </button>
          <button
            onClick={() => setReferralType("primary_care")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              referralType === "primary_care"
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
              {/* Informations émetteur */}
              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Vos informations
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Votre nom
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
                      value={formData.doctorSpecialty}
                      onChange={(e) => handleInputChange("doctorSpecialty", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Adresse du cabinet
                    </label>
                    <input
                      type="text"
                      value={formData.doctorAddress}
                      onChange={(e) => handleInputChange("doctorAddress", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Téléphone
                    </label>
                    <input
                      type="text"
                      value={formData.doctorPhone}
                      onChange={(e) => handleInputChange("doctorPhone", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                    />
                  </div>
                </div>
              </div>

              {/* Informations destinataire */}
              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Destinataire
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Nom du confrère
                    </label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) => handleInputChange("recipientName", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Dr. [Nom]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Spécialité
                    </label>
                    <input
                      type="text"
                      value={formData.recipientSpecialty}
                      onChange={(e) => handleInputChange("recipientSpecialty", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Ex: Cardiologie, Neurologie, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={formData.recipientAddress}
                      onChange={(e) => handleInputChange("recipientAddress", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Cabinet ou structure"
                    />
                  </div>
                </div>
              </div>

              {/* Informations patient */}
              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Patient adressé
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
                      value={formData.patientBirthDate}
                      onChange={(e) => handleInputChange("patientBirthDate", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Âge
                    </label>
                    <input
                      type="text"
                      value={formData.patientAge}
                      onChange={(e) => handleInputChange("patientAge", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Ex: 35"
                    />
                  </div>
                </div>
              </div>

              {/* Contenu clinique */}
              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Informations cliniques
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      {referralType === "mental_health" ? "Contexte clinique" : "Antécédents"}
                    </label>
                    <textarea
                      value={formData.clinicalContext}
                      onChange={(e) => handleInputChange("clinicalContext", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder={referralType === "mental_health" ? "Historique psychiatrique pertinent" : "Antécédents médicaux et chirurgicaux"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Situation actuelle
                    </label>
                    <textarea
                      value={formData.currentSituation}
                      onChange={(e) => handleInputChange("currentSituation", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder={referralType === "mental_health" ? "État actuel, symptomatologie" : "Tableau clinique actuel"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Traitements en cours
                    </label>
                    <textarea
                      value={formData.currentTreatments}
                      onChange={(e) => handleInputChange("currentTreatments", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Liste des traitements actuels"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Motif de l'adressage
                    </label>
                    <textarea
                      value={formData.referralReason}
                      onChange={(e) => handleInputChange("referralReason", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Raison de l'orientation vers ce confrère"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Questions spécifiques (optionnel)
                    </label>
                    <textarea
                      value={formData.specificQuestions}
                      onChange={(e) => handleInputChange("specificQuestions", e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Questions particulières pour le confrère"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Prévisualisation */}
          <div className="bg-white border border-[#D4C5B9] rounded-2xl p-8 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-[#1A1A1A]">Aperçu de la lettre</h2>
              <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                <Check className="w-4 h-4 text-green-600" />
                Prêt
              </div>
            </div>
            <div className="bg-[#F5F1ED] rounded-xl p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
              <pre className="font-mono text-xs text-[#1A1A1A] whitespace-pre-wrap leading-relaxed">
                {generateReferralContent()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
}
