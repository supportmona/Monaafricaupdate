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
} from "lucide-react";

type CertificateType = "mental_health" | "primary_care";

interface CertificateForm {
  patientName: string;
  birthDate: string;
  examinationDate: string;
  conclusion: string;
  duration: string;
  startDate: string;
  city: string;
  doctorName: string;
  specialty: string;
}

export default function MedicalCertificatePage() {
  const navigate = useNavigate();
  const [certificateType, setCertificateType] = useState<CertificateType>("mental_health");
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState<CertificateForm>({
    patientName: "",
    birthDate: "",
    examinationDate: new Date().toISOString().split("T")[0],
    conclusion: "",
    duration: "",
    startDate: "",
    city: "Kinshasa",
    doctorName: "Dr. Sarah Koné",
    specialty: "Psychiatrie",
  });

  const handleInputChange = (field: keyof CertificateForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateCertificateContent = () => {
    if (certificateType === "mental_health") {
      return `CERTIFICAT MÉDICAL - SANTÉ MENTALE

Je soussigné(e), ${formData.doctorName}, ${formData.specialty}, exerçant à ${formData.city}, certifie avoir examiné ce jour :

${formData.patientName || "[NOM COMPLET DU PATIENT]"}
Né(e) le : ${formData.birthDate || "[DATE DE NAISSANCE]"}

Suite à cet examen psychiatrique/psychologique, ${formData.conclusion || "[INDIQUER LA CONCLUSION : repos médical, aptitude, non contre-indication, etc.]"}

${formData.duration ? `Durée : ${formData.duration}` : "Durée : [DURÉE SI APPLICABLE]"}
${formData.startDate ? `À compter du : ${formData.startDate}` : "À compter du : [DATE SI APPLICABLE]"}

Certificat établi à la demande de l'intéressé(e) et remis en main propre pour faire valoir ce que de droit, conformément aux règles de confidentialité médicale.

Fait à ${formData.city}, le ${formData.examinationDate}

${formData.doctorName}
Signature et cachet`;
    } else {
      return `CERTIFICAT MÉDICAL

Je soussigné(e), ${formData.doctorName}, médecin, exerçant à ${formData.city}, certifie avoir examiné ce jour :

${formData.patientName || "[NOM COMPLET DU PATIENT]"}
Né(e) le : ${formData.birthDate || "[DATE DE NAISSANCE]"}

Suite à cet examen médical, ${formData.conclusion || "[INDIQUER LA CONCLUSION : repos médical, aptitude, non contre-indication, etc.]"}

${formData.duration ? `Durée : ${formData.duration}` : "Durée : [DURÉE SI APPLICABLE]"}
${formData.startDate ? `À compter du : ${formData.startDate}` : "À compter du : [DATE SI APPLICABLE]"}

Certificat établi à la demande de l'intéressé(e) et remis en main propre pour faire valoir ce que de droit.

Fait à ${formData.city}, le ${formData.examinationDate}

${formData.doctorName}
Signature et cachet`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateCertificateContent());
    alert("Certificat copié dans le presse-papiers");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <ExpertLayout title="Certificat médical">
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
              <h1 className="text-3xl font-serif text-[#1A1A1A]">Certificat médical</h1>
              <p className="text-[#1A1A1A]/60 mt-1">
                Créer un certificat pour votre patient
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

        {/* Type de certificat */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCertificateType("mental_health")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              certificateType === "mental_health"
                ? "bg-[#1A1A1A] text-white"
                : "bg-[#F5F1ED] text-[#1A1A1A]/70 hover:bg-[#E5DDD5]"
            }`}
          >
            <Brain className="w-4 h-4" />
            Santé mentale
          </button>
          <button
            onClick={() => setCertificateType("primary_care")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              certificateType === "primary_care"
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
            <div className="space-y-6">
              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informations patient
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Nom complet du patient
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
                </div>
              </div>

              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Contenu du certificat
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Date d'examen
                    </label>
                    <input
                      type="date"
                      value={formData.examinationDate}
                      onChange={(e) => handleInputChange("examinationDate", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
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
                      placeholder="Ex: repos médical est prescrit, aptitude au travail, non contre-indication, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Durée (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      placeholder="Ex: 7 jours, 2 semaines, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Date de début (optionnel)
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Informations praticien
                </h2>
                <div className="space-y-4">
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
                </div>
              </div>
            </div>
          )}

          {/* Prévisualisation */}
          <div className="bg-white border border-[#D4C5B9] rounded-2xl p-8 lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-[#1A1A1A]">Aperçu du certificat</h2>
              <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                <Check className="w-4 h-4 text-green-600" />
                Prêt à imprimer
              </div>
            </div>
            <div className="bg-[#F5F1ED] rounded-xl p-8 min-h-[600px]">
              <pre className="font-mono text-sm text-[#1A1A1A] whitespace-pre-wrap">
                {generateCertificateContent()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
}
