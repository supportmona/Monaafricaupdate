import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import ExpertLayout from "@/app/components/ExpertLayout";
import { useExpertAuth } from "@/app/contexts/ExpertAuthContext";
import {
  ArrowLeft, Copy, Printer, FileText, Check, Plus, X,
  Brain, Stethoscope, Target, Activity, AlertCircle,
  TrendingUp, Calendar, Trash2,
} from "lucide-react";

type PlanType = "mental_health" | "primary_care";

interface Objective {
  title: string;
  description: string;
  targetDate: string;
  priority: "high" | "medium" | "low";
}

interface Intervention {
  type: "psychotherapy" | "medication" | "lifestyle" | "followup";
  description: string;
  frequency: string;
  duration: string;
}

interface CarePlanForm {
  patientName: string;
  birthDate: string;
  diagnosis: string;
  startDate: string;
  reviewDate: string;
  objectives: Objective[];
  interventions: Intervention[];
  generalNotes: string;
  doctorName: string;
  specialty: string;
  city: string;
}

const emptyObjective = (): Objective => ({ title: "", description: "", targetDate: "", priority: "medium" });
const emptyIntervention = (): Intervention => ({ type: "psychotherapy", description: "", frequency: "", duration: "" });

const INTERVENTION_LABELS: Record<string, string> = {
  psychotherapy: "Psychothérapie",
  medication: "Médication",
  lifestyle: "Mode de vie",
  followup: "Suivi",
};

export default function CarePlanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useExpertAuth();

  const [planType, setPlanType] = useState<PlanType>("mental_health");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState<CarePlanForm>({
    patientName: "",
    birthDate: "",
    diagnosis: "",
    startDate: new Date().toISOString().split("T")[0],
    reviewDate: "",
    objectives: [emptyObjective()],
    interventions: [emptyIntervention()],
    generalNotes: "",
    doctorName: profile?.firstName && profile?.lastName ? `Dr. ${profile.firstName} ${profile.lastName}` : "Dr. Sarah Koné",
    specialty: profile?.specialty || "Psychiatrie",
    city: "Kinshasa",
  });

  // Pré-remplir si on vient d'un dossier patient
  useEffect(() => {
    if (location.state) {
      const { patientName, birthDate } = location.state as any;
      setForm(prev => ({
        ...prev,
        patientName: patientName || prev.patientName,
        birthDate: birthDate || prev.birthDate,
      }));
    }
  }, [location.state]);

  const update = (field: keyof CarePlanForm, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  // Objectifs
  const addObjective = () => update("objectives", [...form.objectives, emptyObjective()]);
  const removeObjective = (i: number) => update("objectives", form.objectives.filter((_, idx) => idx !== i));
  const updateObjective = (i: number, field: keyof Objective, value: string) => {
    const next = [...form.objectives];
    next[i] = { ...next[i], [field]: value };
    update("objectives", next);
  };

  // Interventions
  const addIntervention = () => update("interventions", [...form.interventions, emptyIntervention()]);
  const removeIntervention = (i: number) => update("interventions", form.interventions.filter((_, idx) => idx !== i));
  const updateIntervention = (i: number, field: keyof Intervention, value: string) => {
    const next = [...form.interventions];
    next[i] = { ...next[i], [field]: value };
    update("interventions", next);
  };

  // Génère le texte d'aperçu
  const generateContent = () => {
    const typeLabel = planType === "mental_health" ? "SANTÉ MENTALE" : "SOINS PRIMAIRES";
    const objectivesText = form.objectives.map((o, i) =>
      `  ${i + 1}. ${o.title || "[OBJECTIF]"}
     Priorité : ${o.priority === "high" ? "Haute" : o.priority === "medium" ? "Moyenne" : "Faible"}
     ${o.description ? `Description : ${o.description}` : ""}
     ${o.targetDate ? `Date cible : ${new Date(o.targetDate).toLocaleDateString("fr-FR")}` : ""}`
    ).join("\n\n");

    const interventionsText = form.interventions.map((v, i) =>
      `  ${i + 1}. [${INTERVENTION_LABELS[v.type]}] ${v.description || "[DESCRIPTION]"}
     Fréquence : ${v.frequency || "[FRÉQUENCE]"}
     Durée : ${v.duration || "[DURÉE]"}`
    ).join("\n\n");

    return `PLAN DE SOINS — ${typeLabel}

${form.doctorName}
${form.specialty}
${form.city}

Date de début : ${form.startDate || "[DATE DÉBUT]"}
${form.reviewDate ? `Révision prévue : ${new Date(form.reviewDate).toLocaleDateString("fr-FR")}` : ""}

─────────────────────────────
PATIENT
Nom : ${form.patientName || "[NOM PATIENT]"}
${form.birthDate ? `Date de naissance : ${new Date(form.birthDate).toLocaleDateString("fr-FR")}` : ""}

─────────────────────────────
DIAGNOSTIC
${form.diagnosis || "[DIAGNOSTIC]"}

─────────────────────────────
OBJECTIFS THÉRAPEUTIQUES (${form.objectives.length})

${objectivesText}

─────────────────────────────
INTERVENTIONS (${form.interventions.length})

${interventionsText}

${form.generalNotes ? `─────────────────────────────
NOTES GÉNÉRALES
${form.generalNotes}` : ""}

─────────────────────────────
${form.doctorName}
Signature et cachet`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass = "w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F] bg-white text-[#1A1A1A] text-sm";
  const labelClass = "block text-sm font-medium text-[#1A1A1A] mb-2";

  return (
    <ExpertLayout title="Plan de soins">
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/expert/documents")}
              className="p-2 hover:bg-[#F5F1ED] rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
            </button>
            <div>
              <h1 className="text-3xl font-serif text-[#1A1A1A]">Plan de soins</h1>
              <p className="text-[#1A1A1A]/60 mt-1">Définir les objectifs et interventions thérapeutiques</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy}
              className="px-4 py-2 bg-white border border-[#D4C5B9] rounded-full hover:bg-[#F5F1ED] transition-colors flex items-center gap-2">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm font-medium">{copied ? "Copié !" : "Copier"}</span>
            </button>
            <button onClick={() => window.print()}
              className="px-4 py-2 bg-white border border-[#D4C5B9] rounded-full hover:bg-[#F5F1ED] transition-colors flex items-center gap-2">
              <Printer className="w-4 h-4" />
              <span className="text-sm font-medium">Imprimer</span>
            </button>
          </div>
        </div>

        {/* Type */}
        <div className="flex items-center gap-3">
          <button onClick={() => setPlanType("mental_health")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${planType === "mental_health" ? "bg-[#1A1A1A] text-white" : "bg-[#F5F1ED] text-[#1A1A1A]/70 hover:bg-[#E5DDD5]"}`}>
            <Brain className="w-4 h-4" />Santé mentale
          </button>
          <button onClick={() => setPlanType("primary_care")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${planType === "primary_care" ? "bg-[#1A1A1A] text-white" : "bg-[#F5F1ED] text-[#1A1A1A]/70 hover:bg-[#E5DDD5]"}`}>
            <Stethoscope className="w-4 h-4" />Soins primaires
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── FORMULAIRE ── */}
          <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">

            {/* Patient */}
            <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-serif text-[#1A1A1A] flex items-center gap-2">
                <FileText className="w-5 h-5" />Patient
              </h2>
              <div>
                <label className={labelClass}>Nom du patient</label>
                <input type="text" value={form.patientName}
                  onChange={e => update("patientName", e.target.value)}
                  placeholder="Ex: Marie Dupont" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Date de naissance</label>
                <input type="date" value={form.birthDate}
                  onChange={e => update("birthDate", e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Diagnostic</label>
                <textarea value={form.diagnosis}
                  onChange={e => update("diagnosis", e.target.value)}
                  rows={2} placeholder="Ex: Trouble anxieux généralisé (F41.1)"
                  className={inputClass + " resize-none"} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Date de début</label>
                  <input type="date" value={form.startDate}
                    onChange={e => update("startDate", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Révision prévue</label>
                  <input type="date" value={form.reviewDate}
                    onChange={e => update("reviewDate", e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>

            {/* Objectifs */}
            <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif text-[#1A1A1A] flex items-center gap-2">
                  <Target className="w-5 h-5" />Objectifs ({form.objectives.length})
                </h2>
                <button onClick={addObjective}
                  className="px-3 py-2 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />Ajouter
                </button>
              </div>
              <div className="space-y-4">
                {form.objectives.map((obj, i) => (
                  <div key={i} className="bg-[#F5F1ED] rounded-xl p-4 space-y-3 relative">
                    {form.objectives.length > 1 && (
                      <button onClick={() => removeObjective(i)}
                        className="absolute top-3 right-3 p-1 hover:bg-white rounded-lg transition-colors">
                        <X className="w-4 h-4 text-[#1A1A1A]/50" />
                      </button>
                    )}
                    <div className="pr-8">
                      <label className={labelClass}>Objectif {i + 1}</label>
                      <input type="text" value={obj.title}
                        onChange={e => updateObjective(i, "title", e.target.value)}
                        placeholder="Ex: Réduction des symptômes d'anxiété"
                        className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea value={obj.description}
                        onChange={e => updateObjective(i, "description", e.target.value)}
                        rows={2} placeholder="Ex: Diminuer l'intensité des crises de 50%"
                        className={inputClass + " resize-none"} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Priorité</label>
                        <select value={obj.priority}
                          onChange={e => updateObjective(i, "priority", e.target.value)}
                          className={inputClass}>
                          <option value="high">Haute</option>
                          <option value="medium">Moyenne</option>
                          <option value="low">Faible</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Date cible</label>
                        <input type="date" value={obj.targetDate}
                          onChange={e => updateObjective(i, "targetDate", e.target.value)}
                          className={inputClass} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interventions */}
            <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif text-[#1A1A1A] flex items-center gap-2">
                  <Activity className="w-5 h-5" />Interventions ({form.interventions.length})
                </h2>
                <button onClick={addIntervention}
                  className="px-3 py-2 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />Ajouter
                </button>
              </div>
              <div className="space-y-4">
                {form.interventions.map((inter, i) => (
                  <div key={i} className="bg-[#F5F1ED] rounded-xl p-4 space-y-3 relative">
                    {form.interventions.length > 1 && (
                      <button onClick={() => removeIntervention(i)}
                        className="absolute top-3 right-3 p-1 hover:bg-white rounded-lg transition-colors">
                        <X className="w-4 h-4 text-[#1A1A1A]/50" />
                      </button>
                    )}
                    <div className="pr-8">
                      <label className={labelClass}>Type</label>
                      <select value={inter.type}
                        onChange={e => updateIntervention(i, "type", e.target.value)}
                        className={inputClass}>
                        <option value="psychotherapy">Psychothérapie</option>
                        <option value="medication">Médication</option>
                        <option value="lifestyle">Mode de vie</option>
                        <option value="followup">Suivi</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Description</label>
                      <input type="text" value={inter.description}
                        onChange={e => updateIntervention(i, "description", e.target.value)}
                        placeholder="Ex: Thérapie cognitivo-comportementale (TCC)"
                        className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Fréquence</label>
                        <input type="text" value={inter.frequency}
                          onChange={e => updateIntervention(i, "frequency", e.target.value)}
                          placeholder="Ex: 1x/semaine" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Durée</label>
                        <input type="text" value={inter.duration}
                          onChange={e => updateIntervention(i, "duration", e.target.value)}
                          placeholder="Ex: 12 semaines" className={inputClass} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes + Praticien */}
            <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-serif text-[#1A1A1A]">Notes générales</h2>
              <textarea value={form.generalNotes}
                onChange={e => update("generalNotes", e.target.value)}
                rows={3} placeholder="Observations, contre-indications, contexte..."
                className={inputClass + " resize-none"} />
            </div>

            <div className="bg-white border border-[#D4C5B9] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-serif text-[#1A1A1A]">Praticien</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Nom</label>
                  <input type="text" value={form.doctorName}
                    onChange={e => update("doctorName", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Spécialité</label>
                  <input type="text" value={form.specialty}
                    onChange={e => update("specialty", e.target.value)} className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Ville</label>
                  <input type="text" value={form.city}
                    onChange={e => update("city", e.target.value)} className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* ── APERÇU ── */}
          <div className="bg-white border border-[#D4C5B9] rounded-2xl p-8 sticky top-6 self-start">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-[#1A1A1A]">Aperçu du plan</h2>
              <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                <Check className="w-4 h-4 text-green-600" />Prêt
              </div>
            </div>
            <div className="bg-[#F5F1ED] rounded-xl p-6 max-h-[calc(100vh-300px)] overflow-y-auto">
              <pre className="font-mono text-xs text-[#1A1A1A] whitespace-pre-wrap leading-relaxed">
                {generateContent()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </ExpertLayout>
  );
}
