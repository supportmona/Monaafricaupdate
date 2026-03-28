import { useState } from "react";
import ExpertLayout from "@/app/components/ExpertLayout";
import { FileText, Stethoscope, Brain, ChevronRight, Heart } from "lucide-react";
import { useNavigate } from "react-router";

type TemplateCategory = "prescription" | "careplan" | "certificate" | "report" | "referral";
type SpecialtyType = "mental_health" | "primary_care";

interface Template {
  id: string;
  type: TemplateCategory;
  category: SpecialtyType;
  name: string;
  description: string;
}

const TEMPLATES: Template[] = [
  // Ordonnances
  {
    id: "prescription_mental_health",
    type: "prescription",
    category: "mental_health",
    name: "Ordonnance - Santé mentale",
    description: "Template d'ordonnance pour traitements psychiatriques"
  },
  {
    id: "prescription_primary_care",
    type: "prescription",
    category: "primary_care",
    name: "Ordonnance - Soins primaires",
    description: "Template d'ordonnance pour soins médicaux généraux"
  },
  // Plans de soins
  {
    id: "careplan_mental_health",
    type: "careplan",
    category: "mental_health",
    name: "Plan de soins - Santé mentale",
    description: "Plan de soins structuré pour suivi psychiatrique/psychologique"
  },
  {
    id: "careplan_primary_care",
    type: "careplan",
    category: "primary_care",
    name: "Plan de soins - Soins primaires",
    description: "Plan de soins pour pathologie médicale générale"
  },
  // Certificats médicaux
  {
    id: "certificate_mental_health",
    type: "certificate",
    category: "mental_health",
    name: "Certificat médical - Santé mentale",
    description: "Certificat pour arrêt de travail ou aptitude psychologique"
  },
  {
    id: "certificate_primary_care",
    type: "certificate",
    category: "primary_care",
    name: "Certificat médical - Soins primaires",
    description: "Certificat médical standard pour justificatif ou arrêt de travail"
  },
  // Comptes-rendus
  {
    id: "report_mental_health",
    type: "report",
    category: "mental_health",
    name: "Compte-rendu - Santé mentale",
    description: "Compte-rendu détaillé de consultation psychiatrique/psychologique"
  },
  {
    id: "report_primary_care",
    type: "report",
    category: "primary_care",
    name: "Compte-rendu - Soins primaires",
    description: "Compte-rendu de consultation médicale générale"
  },
  // Lettres de liaison
  {
    id: "referral_mental_health",
    type: "referral",
    category: "mental_health",
    name: "Lettre de liaison - Santé mentale",
    description: "Lettre de liaison vers confrère ou structure spécialisée"
  },
  {
    id: "referral_primary_care",
    type: "referral",
    category: "primary_care",
    name: "Lettre de liaison - Soins primaires",
    description: "Lettre de liaison médicale vers spécialiste"
  }
];

const TEMPLATE_TYPES = [
  { id: "prescription" as TemplateCategory, name: "Ordonnances", icon: FileText },
  { id: "careplan" as TemplateCategory, name: "Plans de soins", icon: Heart },
  { id: "certificate" as TemplateCategory, name: "Certificats", icon: FileText },
  { id: "report" as TemplateCategory, name: "Comptes-rendus", icon: FileText },
  { id: "referral" as TemplateCategory, name: "Lettres de liaison", icon: FileText }
];

export default function ExpertDocumentsPage() {
  const [selectedType, setSelectedType] = useState<TemplateCategory | "all">("all");
  const navigate = useNavigate();

  const filteredTemplates = selectedType === "all" 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.type === selectedType);

  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.type]) {
      acc[template.type] = [];
    }
    acc[template.type].push(template);
    return acc;
  }, {} as Record<TemplateCategory, Template[]>);

  const getTemplateTypeInfo = (type: TemplateCategory) => {
    return TEMPLATE_TYPES.find(t => t.id === type);
  };

  const handleTemplateClick = (template: Template) => {
    if (template.type === "prescription") {
      navigate("/expert/prescription-template");
    } else if (template.type === "careplan") {
      navigate("/expert/care-plan");
    } else if (template.type === "certificate") {
      navigate("/expert/medical-certificate");
    } else if (template.type === "report") {
      navigate("/expert/medical-report");
    } else if (template.type === "referral") {
      navigate("/expert/referral-letter");
    }
  };

  return (
    <ExpertLayout title="Documents">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif text-[#1A1A1A]">Documents cliniques</h1>
            <p className="text-[#1A1A1A]/60 mt-2">
              10 documents essentiels pour votre pratique clinique
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-[#F5F1ED] rounded-full">
              <p className="text-sm text-[#1A1A1A]/60">
                <span className="font-semibold text-[#1A1A1A]">{TEMPLATES.length}</span> documents disponibles
              </p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              selectedType === "all"
                ? "bg-[#1A1A1A] text-white"
                : "bg-[#F5F1ED] text-[#1A1A1A]/70 hover:bg-[#E5DDD5]"
            }`}
          >
            Tous les documents
          </button>
          {TEMPLATE_TYPES.map((type) => {
            const Icon = type.icon;
            const count = TEMPLATES.filter(t => t.type === type.id).length;
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                  selectedType === type.id
                    ? "bg-[#1A1A1A] text-white"
                    : "bg-[#F5F1ED] text-[#1A1A1A]/70 hover:bg-[#E5DDD5]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.name}
                <span className={`text-xs ${
                  selectedType === type.id ? "text-white/60" : "text-[#1A1A1A]/40"
                }`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* Templates groupés par type */}
        <div className="space-y-8">
          {Object.entries(groupedTemplates).map(([type, templates]) => {
            const typeInfo = getTemplateTypeInfo(type as TemplateCategory);
            if (!typeInfo) return null;

            const Icon = typeInfo.icon;

            return (
              <div key={type} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1A1A1A] rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-[#1A1A1A]">{typeInfo.name}</h2>
                    <p className="text-sm text-[#1A1A1A]/60">{templates.length} documents</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateClick(template)}
                      className="bg-white border border-[#D4C5B9] rounded-2xl p-6 hover:shadow-lg transition-all text-left group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {template.category === "mental_health" ? (
                            <div className="w-10 h-10 bg-[#A68B6F]/10 rounded-xl flex items-center justify-center">
                              <Brain className="w-5 h-5 text-[#A68B6F]" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-[#B85C50]/10 rounded-xl flex items-center justify-center">
                              <Stethoscope className="w-5 h-5 text-[#B85C50]" />
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#1A1A1A]/30 group-hover:text-[#1A1A1A] transition-colors" />
                      </div>

                      <h3 className="text-lg font-medium text-[#1A1A1A] mb-2">
                        {template.name}
                      </h3>
                      <p className="text-sm text-[#1A1A1A]/60 leading-relaxed">
                        {template.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-[#D4C5B9] flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wider text-[#1A1A1A]/40">
                          {template.category === "mental_health" ? "Santé mentale" : "Soins primaires"}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info card */}
        <div className="bg-[#F5F1ED] rounded-2xl p-6 border border-[#D4C5B9]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#A68B6F] rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#1A1A1A] mb-2">
                À propos des documents
              </h3>
              <p className="text-sm text-[#1A1A1A]/70 leading-relaxed mb-4">
                Ces 10 documents essentiels couvrent les besoins cliniques fondamentaux en santé mentale et soins primaires. Chaque document est conçu selon les standards médicaux africains et internationaux.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-[#1A1A1A]/60">
                  <Brain className="w-4 h-4 text-[#A68B6F]" />
                  <span>5 documents santé mentale</span>
                </div>
                <div className="flex items-center gap-2 text-[#1A1A1A]/60">
                  <Stethoscope className="w-4 h-4 text-[#B85C50]" />
                  <span>5 documents soins primaires</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
}