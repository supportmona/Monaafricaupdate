import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X,
  Upload,
  Trash2,
  Save,
  Plus,
  FileText
} from "lucide-react";

// Types
export interface VitalsData {
  bloodType: string;
  height: string;
  weight: string;
  bloodPressure: string;
  lastCheckup: string;
}

export interface Allergy {
  id: string;
  name: string;
  severity: "Légère" | "Modérée" | "Sévère";
  reaction: string;
}

export interface ChronicCondition {
  id: string;
  name: string;
  diagnosedDate: string;
  treatment: string;
}

export interface Vaccination {
  id: string;
  name: string;
  date: string;
  nextDose?: string;
}

export interface MedicalDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
}

// Composant Modale Constantes Vitales
export function VitalsModal({
  isOpen,
  onClose,
  vitals,
  onSave,
  isSaving
}: {
  isOpen: boolean;
  onClose: () => void;
  vitals: VitalsData;
  onSave: (data: VitalsData) => void;
  isSaving: boolean;
}) {
  const [formData, setFormData] = useState<VitalsData>(vitals);

  useEffect(() => {
    setFormData(vitals);
  }, [vitals]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-[#D4C5B9] p-4 flex items-center justify-between rounded-t-3xl z-10">
            <h3 className="text-lg font-serif text-[#1A1A1A]">Constantes vitales</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Groupe sanguin
              </label>
              <select
                value={formData.bloodType}
                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
              >
                <option value="">Sélectionnez</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Taille (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  placeholder="170"
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="70"
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Tension artérielle
              </label>
              <input
                type="text"
                value={formData.bloodPressure}
                onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                placeholder="120/80"
                className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Date du dernier bilan
              </label>
              <input
                type="date"
                value={formData.lastCheckup}
                onChange={(e) => setFormData({ ...formData, lastCheckup: e.target.value })}
                className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#F5F1ED] transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>Enregistrement...</>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Composant Modale Allergies
export function AllergiesModal({
  isOpen,
  onClose,
  allergies,
  onSave,
  isSaving
}: {
  isOpen: boolean;
  onClose: () => void;
  allergies: Allergy[];
  onSave: (data: Allergy[]) => void;
  isSaving: boolean;
}) {
  const [localAllergies, setLocalAllergies] = useState<Allergy[]>(allergies);
  const [newAllergy, setNewAllergy] = useState({ name: "", severity: "Légère" as const, reaction: "" });

  useEffect(() => {
    setLocalAllergies(allergies);
  }, [allergies]);

  const handleAdd = () => {
    if (newAllergy.name.trim() && newAllergy.reaction.trim()) {
      setLocalAllergies([
        ...localAllergies,
        {
          id: Date.now().toString(),
          name: newAllergy.name,
          severity: newAllergy.severity,
          reaction: newAllergy.reaction
        }
      ]);
      setNewAllergy({ name: "", severity: "Légère", reaction: "" });
    }
  };

  const handleRemove = (id: string) => {
    setLocalAllergies(localAllergies.filter(a => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localAllergies);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-[#D4C5B9] p-4 flex items-center justify-between rounded-t-3xl z-10">
            <h3 className="text-lg font-serif text-[#1A1A1A]">Allergies</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {localAllergies.length > 0 && (
              <div className="space-y-2 mb-6">
                {localAllergies.map((allergy) => (
                  <div key={allergy.id} className="p-3 bg-[#F5F1ED] rounded-xl flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-[#1A1A1A] text-sm">{allergy.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          allergy.severity === "Sévère" ? "bg-red-100 text-red-700" :
                          allergy.severity === "Modérée" ? "bg-orange-100 text-orange-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {allergy.severity}
                        </span>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/60">{allergy.reaction}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(allergy.id)}
                      className="p-1 hover:bg-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-[#D4C5B9] pt-4">
              <p className="text-sm font-medium text-[#1A1A1A] mb-3">Ajouter une allergie</p>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={newAllergy.name}
                  onChange={(e) => setNewAllergy({ ...newAllergy, name: e.target.value })}
                  placeholder="Nom de l'allergie"
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                />

                <select
                  value={newAllergy.severity}
                  onChange={(e) => setNewAllergy({ ...newAllergy, severity: e.target.value as any })}
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                >
                  <option value="Légère">Légère</option>
                  <option value="Modérée">Modérée</option>
                  <option value="Sévère">Sévère</option>
                </select>

                <input
                  type="text"
                  value={newAllergy.reaction}
                  onChange={(e) => setNewAllergy({ ...newAllergy, reaction: e.target.value })}
                  placeholder="Réaction (ex: éruption cutanée)"
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                />

                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full px-4 py-3 border-2 border-dashed border-[#A68B6F] text-[#A68B6F] rounded-xl hover:bg-[#A68B6F]/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter cette allergie
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#F5F1ED] transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>Enregistrement...</>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Composant Modale Conditions Chroniques
export function ConditionsModal({
  isOpen,
  onClose,
  conditions,
  onSave,
  isSaving
}: {
  isOpen: boolean;
  onClose: () => void;
  conditions: ChronicCondition[];
  onSave: (data: ChronicCondition[]) => void;
  isSaving: boolean;
}) {
  const [localConditions, setLocalConditions] = useState<ChronicCondition[]>(conditions);
  const [newCondition, setNewCondition] = useState({ name: "", diagnosedDate: "", treatment: "" });

  useEffect(() => {
    setLocalConditions(conditions);
  }, [conditions]);

  const handleAdd = () => {
    if (newCondition.name.trim() && newCondition.diagnosedDate && newCondition.treatment.trim()) {
      setLocalConditions([
        ...localConditions,
        {
          id: Date.now().toString(),
          ...newCondition
        }
      ]);
      setNewCondition({ name: "", diagnosedDate: "", treatment: "" });
    }
  };

  const handleRemove = (id: string) => {
    setLocalConditions(localConditions.filter(c => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localConditions);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-[#D4C5B9] p-4 flex items-center justify-between rounded-t-3xl z-10">
            <h3 className="text-lg font-serif text-[#1A1A1A]">Conditions chroniques</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {localConditions.length > 0 && (
              <div className="space-y-2 mb-6">
                {localConditions.map((condition) => (
                  <div key={condition.id} className="p-3 bg-[#F5F1ED] rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-[#1A1A1A] text-sm">{condition.name}</p>
                        <p className="text-xs text-[#1A1A1A]/60 mt-1">
                          Diagnostiqué le {new Date(condition.diagnosedDate).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(condition.id)}
                        className="p-1 hover:bg-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                    <p className="text-xs text-[#1A1A1A]/60">{condition.treatment}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-[#D4C5B9] pt-4">
              <p className="text-sm font-medium text-[#1A1A1A] mb-3">Ajouter une condition</p>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={newCondition.name}
                  onChange={(e) => setNewCondition({ ...newCondition, name: e.target.value })}
                  placeholder="Nom de la condition"
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                />

                <input
                  type="date"
                  value={newCondition.diagnosedDate}
                  onChange={(e) => setNewCondition({ ...newCondition, diagnosedDate: e.target.value })}
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                />

                <input
                  type="text"
                  value={newCondition.treatment}
                  onChange={(e) => setNewCondition({ ...newCondition, treatment: e.target.value })}
                  placeholder="Traitement actuel"
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                />

                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full px-4 py-3 border-2 border-dashed border-[#A68B6F] text-[#A68B6F] rounded-xl hover:bg-[#A68B6F]/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter cette condition
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#F5F1ED] transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>Enregistrement...</>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Composant Modale Vaccinations
export function VaccinationsModal({
  isOpen,
  onClose,
  vaccinations,
  onSave,
  isSaving
}: {
  isOpen: boolean;
  onClose: () => void;
  vaccinations: Vaccination[];
  onSave: (data: Vaccination[]) => void;
  isSaving: boolean;
}) {
  const [localVaccinations, setLocalVaccinations] = useState<Vaccination[]>(vaccinations);
  const [newVaccination, setNewVaccination] = useState({ name: "", date: "", nextDose: "" });

  useEffect(() => {
    setLocalVaccinations(vaccinations);
  }, [vaccinations]);

  const handleAdd = () => {
    if (newVaccination.name.trim() && newVaccination.date) {
      setLocalVaccinations([
        ...localVaccinations,
        {
          id: Date.now().toString(),
          name: newVaccination.name,
          date: newVaccination.date,
          nextDose: newVaccination.nextDose || undefined
        }
      ]);
      setNewVaccination({ name: "", date: "", nextDose: "" });
    }
  };

  const handleRemove = (id: string) => {
    setLocalVaccinations(localVaccinations.filter(v => v.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localVaccinations);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-[#D4C5B9] p-4 flex items-center justify-between rounded-t-3xl z-10">
            <h3 className="text-lg font-serif text-[#1A1A1A]">Vaccinations</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {localVaccinations.length > 0 && (
              <div className="space-y-2 mb-6">
                {localVaccinations.map((vaccination) => (
                  <div key={vaccination.id} className="p-3 bg-[#F5F1ED] rounded-xl">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <p className="font-medium text-[#1A1A1A] text-sm">{vaccination.name}</p>
                        <p className="text-xs text-[#1A1A1A]/60">
                          {new Date(vaccination.date).toLocaleDateString("fr-FR")}
                        </p>
                        {vaccination.nextDose && (
                          <p className="text-xs text-[#A68B6F] mt-1">
                            Prochaine dose: {new Date(vaccination.nextDose).toLocaleDateString("fr-FR")}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemove(vaccination.id)}
                        className="p-1 hover:bg-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-[#D4C5B9] pt-4">
              <p className="text-sm font-medium text-[#1A1A1A] mb-3">Ajouter une vaccination</p>
              
              <div className="space-y-3">
                <input
                  type="text"
                  value={newVaccination.name}
                  onChange={(e) => setNewVaccination({ ...newVaccination, name: e.target.value })}
                  placeholder="Nom du vaccin"
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                />

                <div>
                  <label className="block text-xs text-[#1A1A1A]/60 mb-1">Date de vaccination</label>
                  <input
                    type="date"
                    value={newVaccination.date}
                    onChange={(e) => setNewVaccination({ ...newVaccination, date: e.target.value })}
                    className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#1A1A1A]/60 mb-1">Prochaine dose (optionnel)</label>
                  <input
                    type="date"
                    value={newVaccination.nextDose}
                    onChange={(e) => setNewVaccination({ ...newVaccination, nextDose: e.target.value })}
                    className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full px-4 py-3 border-2 border-dashed border-[#A68B6F] text-[#A68B6F] rounded-xl hover:bg-[#A68B6F]/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ajouter ce vaccin
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#F5F1ED] transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>Enregistrement...</>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Composant Modale Documents
export function DocumentsModal({
  isOpen,
  onClose,
  documents,
  onSave,
  isSaving
}: {
  isOpen: boolean;
  onClose: () => void;
  documents: MedicalDocument[];
  onSave: (data: MedicalDocument[]) => void;
  isSaving: boolean;
}) {
  const [localDocuments, setLocalDocuments] = useState<MedicalDocument[]>(documents);

  useEffect(() => {
    setLocalDocuments(documents);
  }, [documents]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const newDoc: MedicalDocument = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type.includes("pdf") ? "PDF" : file.type.includes("image") ? "Image" : "Document",
          uploadDate: new Date().toISOString(),
          size: `${(file.size / 1024).toFixed(0)} KB`
        };
        setLocalDocuments(prev => [...prev, newDoc]);
      });
    }
  };

  const handleRemove = (id: string) => {
    setLocalDocuments(localDocuments.filter(d => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localDocuments);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-[#D4C5B9] p-4 flex items-center justify-between rounded-t-3xl z-10">
            <h3 className="text-lg font-serif text-[#1A1A1A]">Documents médicaux</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {localDocuments.length > 0 && (
              <div className="space-y-2 mb-6">
                {localDocuments.map((doc) => (
                  <div key={doc.id} className="p-3 bg-[#F5F1ED] rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#A68B6F]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1A1A1A] text-sm">{doc.name}</p>
                        <p className="text-xs text-[#1A1A1A]/60">
                          {doc.type} • {doc.size}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(doc.id)}
                      className="p-1 hover:bg-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-[#D4C5B9] pt-4">
              <p className="text-sm font-medium text-[#1A1A1A] mb-3">Télécharger un document</p>
              
              <label className="block w-full cursor-pointer">
                <div className="w-full px-4 py-12 border-2 border-dashed border-[#A68B6F] rounded-xl hover:bg-[#A68B6F]/5 transition-colors">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-[#A68B6F] mx-auto mb-3" />
                    <p className="text-sm text-[#1A1A1A] font-medium mb-1">
                      Cliquez pour télécharger
                    </p>
                    <p className="text-xs text-[#1A1A1A]/60">
                      PDF, images, documents médicaux
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#F5F1ED] transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>Enregistrement...</>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
