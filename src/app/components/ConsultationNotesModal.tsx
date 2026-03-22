import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, FileText, Send } from "lucide-react";

interface ConsultationNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes: string, recommendations: string) => Promise<void>;
  expertName: string;
  memberName: string;
  consultationDate: string;
}

export default function ConsultationNotesModal({
  isOpen,
  onClose,
  onSubmit,
  expertName,
  memberName,
  consultationDate,
}: ConsultationNotesModalProps) {
  const [notes, setNotes] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [sendToMember, setSendToMember] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!notes.trim()) {
      alert("Veuillez ajouter des notes de consultation");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(notes, recommendations);
      onClose();
    } catch (error) {
      console.error("Erreur soumission notes:", error);
      alert("Erreur lors de la sauvegarde des notes");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-50"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#D4C5B9] px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#A68B6F] to-[#C1694F] rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-serif text-[#1A1A1A]">
                      Notes de Consultation
                    </h2>
                    <p className="text-sm text-[#1A1A1A]/60">
                      {consultationDate} • {expertName} et {memberName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-[#1A1A1A]/60" />
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Info Badge */}
              <div className="bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl p-4">
                <p className="text-sm text-[#1A1A1A]/80">
                  <strong className="text-[#A68B6F]">Important :</strong> Ces notes seront automatiquement
                  envoyées au membre dans sa messagerie après la consultation. Elles serviront de résumé
                  pour le suivi médical.
                </p>
              </div>

              {/* Notes Principales */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Notes de Consultation <span className="text-[#C1694F]">*</span>
                </label>
                <p className="text-xs text-[#1A1A1A]/60 mb-3">
                  État du patient, symptômes observés, discussion principale, évolution depuis la dernière séance
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={8}
                  required
                  placeholder="Exemple :&#10;• Patient se sent mieux depuis notre dernière séance&#10;• Les exercices de respiration l'aident beaucoup&#10;• Pas de troubles du sommeil cette semaine&#10;• Discussion sur la gestion du stress au travail"
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent resize-none font-sans text-[#1A1A1A]"
                />
                <p className="text-xs text-[#1A1A1A]/40 mt-2">
                  {notes.length} caractères
                </p>
              </div>

              {/* Recommandations */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Recommandations et Suivi
                </label>
                <p className="text-xs text-[#1A1A1A]/60 mb-3">
                  Conseils, exercices à faire, plan de suivi, prochain rendez-vous
                </p>
                <textarea
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  rows={6}
                  placeholder="Exemple :&#10;✓ Continuer la méditation quotidienne (10 min/jour)&#10;✓ Limiter le temps d'écran le soir (après 20h)&#10;✓ Tenir un journal de gratitude&#10;✓ Prochain rendez-vous dans 2 semaines&#10;✓ Me contacter via messagerie en cas de besoin"
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent resize-none font-sans text-[#1A1A1A]"
                />
                <p className="text-xs text-[#1A1A1A]/40 mt-2">
                  {recommendations.length} caractères
                </p>
              </div>

              {/* Option Envoi */}
              <div className="bg-[#F5F1ED] rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendToMember}
                    onChange={(e) => setSendToMember(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-[#D4C5B9] text-[#A68B6F] focus:ring-2 focus:ring-[#A68B6F] focus:ring-offset-0"
                  />
                  <div>
                    <p className="font-medium text-[#1A1A1A]">
                      Envoyer le résumé au membre
                    </p>
                    <p className="text-sm text-[#1A1A1A]/60 mt-1">
                      Le membre recevra un message avec le résumé complet de la consultation dans sa messagerie M.O.N.A
                    </p>
                  </div>
                </label>
              </div>

              {/* Preview */}
              {(notes || recommendations) && (
                <div className="border-2 border-[#A68B6F]/20 rounded-xl p-4 bg-gradient-to-br from-[#F5F1ED] to-white">
                  <p className="text-xs font-medium text-[#A68B6F] uppercase tracking-wider mb-3">
                    Aperçu du résumé
                  </p>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm font-medium text-[#1A1A1A] mb-2">
                      📋 Résumé de votre consultation du {consultationDate}
                    </p>
                    <p className="text-xs text-[#1A1A1A]/60 mb-4">
                      👨‍⚕️ Expert : {expertName} • 👤 Membre : {memberName}
                    </p>
                    
                    {notes && (
                      <>
                        <p className="text-xs font-medium text-[#1A1A1A] mt-4 mb-2">
                          📝 NOTES DE CONSULTATION
                        </p>
                        <p className="text-xs text-[#1A1A1A]/80 whitespace-pre-wrap">
                          {notes}
                        </p>
                      </>
                    )}
                    
                    {recommendations && (
                      <>
                        <p className="text-xs font-medium text-[#1A1A1A] mt-4 mb-2">
                          RECOMMANDATIONS
                        </p>
                        <p className="text-xs text-[#1A1A1A]/80 whitespace-pre-wrap">
                          {recommendations}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4C5B9]">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-6 py-3 text-[#1A1A1A] hover:bg-[#F5F1ED] rounded-full transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !notes.trim()}
                  className="px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sauvegarde...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Terminer et Sauvegarder</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}