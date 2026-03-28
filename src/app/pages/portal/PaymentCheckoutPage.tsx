import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { CreditCard, Smartphone, Loader2, Check, X, ArrowLeft } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function PaymentCheckoutPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<"card" | "mobile-money">("card");

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/checkout-sessions/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSession(data.data);
      } else {
        setError("Session de paiement introuvable");
      }
    } catch (error) {
      console.error("Erreur chargement session:", error);
      setError("Impossible de charger la session de paiement");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      setError(null);

      const token = localStorage.getItem("mona_member_token");
      if (!token) {
        setError("Vous devez être connecté");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/subscriptions/confirm-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
          },
          body: JSON.stringify({
            sessionId,
            paymentMethod: selectedMethod === "card" ? "card" : "mobile-money",
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Rediriger vers la page de confirmation
        navigate("/payment/success");
      } else {
        setError(data.error || "Erreur lors du paiement");
      }
    } catch (error) {
      console.error("Erreur paiement:", error);
      setError("Une erreur est survenue lors du paiement");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#A68B6F] animate-spin" />
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#D4C5B9]">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-serif text-[#1A1A1A] text-center mb-2">
            Erreur
          </h2>
          <p className="text-[#1A1A1A]/60 text-center mb-6">{error}</p>
          <button
            onClick={() => navigate("/member/dashboard")}
            className="w-full bg-[#1A1A1A] text-white rounded-full py-3 px-6 font-medium hover:bg-[#2A2A2A] transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  const planNames = {
    essentiel: "Essentiel",
    premium: "Premium",
    excellence: "Excellence",
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate("/pricing")}
          className="flex items-center gap-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Résumé commande */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4C5B9] h-fit"
          >
            <div className="mb-6">
              <p className="text-xs tracking-[0.2em] uppercase text-[#1A1A1A]/60 font-medium mb-2">
                RÉSUMÉ DE VOTRE COMMANDE
              </p>
              <div className="w-16 h-[1px] bg-[#1A1A1A]" />
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-serif text-[#1A1A1A] mb-1">
                    Formule {planNames[session?.planKey as keyof typeof planNames] || session?.planKey}
                  </h3>
                  <p className="text-sm text-[#1A1A1A]/60">
                    Abonnement mensuel
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D4C5B9]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#1A1A1A]/60">Montant</span>
                  <span className="text-[#1A1A1A]">
                    {session?.amount?.toLocaleString()} {session?.currency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#1A1A1A]/60">TVA</span>
                  <span className="text-[#1A1A1A]">Incluse</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D4C5B9]">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-serif text-[#1A1A1A]">
                    Total
                  </span>
                  <span className="text-2xl font-serif text-[#1A1A1A]">
                    {session?.amount?.toLocaleString()} {session?.currency}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F1ED] rounded-2xl p-4">
              <p className="text-xs text-[#1A1A1A]/60">
                Votre abonnement sera renouvelé automatiquement chaque mois. Vous pouvez annuler à tout moment depuis votre profil.
              </p>
            </div>
          </motion.div>

          {/* Formulaire paiement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4C5B9]"
          >
            <div className="mb-6">
              <p className="text-xs tracking-[0.2em] uppercase text-[#1A1A1A]/60 font-medium mb-2">
                MÉTHODE DE PAIEMENT
              </p>
              <div className="w-16 h-[1px] bg-[#1A1A1A]" />
            </div>

            {/* Sélection méthode */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setSelectedMethod("card")}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                  selectedMethod === "card"
                    ? "border-[#A68B6F] bg-[#A68B6F]/5"
                    : "border-[#D4C5B9] hover:border-[#A68B6F]/50"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === "card"
                      ? "border-[#A68B6F]"
                      : "border-[#D4C5B9]"
                  }`}
                >
                  {selectedMethod === "card" && (
                    <div className="w-3 h-3 bg-[#A68B6F] rounded-full" />
                  )}
                </div>
                <CreditCard className="w-5 h-5 text-[#1A1A1A]" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    Carte bancaire
                  </p>
                  <p className="text-xs text-[#1A1A1A]/60">
                    Visa, Mastercard
                  </p>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod("mobile-money")}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                  selectedMethod === "mobile-money"
                    ? "border-[#A68B6F] bg-[#A68B6F]/5"
                    : "border-[#D4C5B9] hover:border-[#A68B6F]/50"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === "mobile-money"
                      ? "border-[#A68B6F]"
                      : "border-[#D4C5B9]"
                  }`}
                >
                  {selectedMethod === "mobile-money" && (
                    <div className="w-3 h-3 bg-[#A68B6F] rounded-full" />
                  )}
                </div>
                <Smartphone className="w-5 h-5 text-[#1A1A1A]" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    Mobile Money
                  </p>
                  <p className="text-xs text-[#1A1A1A]/60">
                    Wave, Orange Money
                  </p>
                </div>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Bouton paiement */}
            <button
              onClick={handlePayment}
              disabled={processing}
              className="w-full bg-[#1A1A1A] text-white rounded-full py-4 px-6 font-medium hover:bg-[#2A2A2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Confirmer le paiement
                </>
              )}
            </button>

            <p className="text-xs text-[#1A1A1A]/60 text-center mt-4">
              Paiement sécurisé. Vos données sont protégées.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
