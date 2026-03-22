import { motion } from "motion/react";
import { Link } from "react-router";
import { Check, ArrowRight, Download } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full border border-[#D4C5B9]"
      >
        {/* Icône de succès */}
        <div className="w-20 h-20 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </div>

        {/* Message principal */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1A1A1A] mb-3">
            Paiement confirmé
          </h1>
          <p className="text-lg text-[#1A1A1A]/70 mb-2">
            Votre abonnement a été activé avec succès
          </p>
          <p className="text-sm text-[#1A1A1A]/60">
            Un email de confirmation vous a été envoyé
          </p>
        </div>

        {/* Détails */}
        <div className="bg-[#F5F1ED] rounded-2xl p-6 mb-6">
          <h3 className="text-sm tracking-[0.2em] uppercase text-[#1A1A1A]/60 font-medium mb-4">
            PROCHAINES ÉTAPES
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#A68B6F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  Explorez le Cercle M.O.N.A
                </p>
                <p className="text-xs text-[#1A1A1A]/60">
                  Accédez aux ressources exclusives et contenus premium
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#A68B6F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  Réservez votre première consultation
                </p>
                <p className="text-xs text-[#1A1A1A]/60">
                  Trouvez l'expert qui vous correspond
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#A68B6F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  Personnalisez votre expérience
                </p>
                <p className="text-xs text-[#1A1A1A]/60">
                  Complétez votre profil et vos préférences
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/member/dashboard"
            className="w-full bg-[#1A1A1A] text-white rounded-full py-4 px-6 font-medium hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2"
          >
            Accéder au tableau de bord
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/member/resources"
            className="w-full bg-white border-2 border-[#D4C5B9] text-[#1A1A1A] rounded-full py-4 px-6 font-medium hover:bg-[#F5F1ED] transition-colors flex items-center justify-center gap-2"
          >
            Explorer les ressources
          </Link>
        </div>

        {/* Facture */}
        <div className="mt-6 pt-6 border-t border-[#D4C5B9] text-center">
          <button className="text-sm text-[#A68B6F] hover:underline inline-flex items-center gap-2">
            <Download className="w-4 h-4" />
            Télécharger la facture
          </button>
        </div>
      </motion.div>
    </div>
  );
}
