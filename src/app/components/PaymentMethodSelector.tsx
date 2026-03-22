import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CreditCard, Smartphone, Loader } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useNavigate } from "react-router";

interface PaymentMethodSelectorProps {
  planId: string;
  planName: string;
  amount: number;
  currency: "XOF" | "USD";
  onClose: () => void;
}

type PaymentMethod = "stripe" | "wave" | "orange";

export default function PaymentMethodSelector({
  planId,
  planName,
  amount,
  currency,
  onClose,
}: PaymentMethodSelectorProps) {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!selectedMethod) return;

    try {
      setProcessing(true);
      const token = localStorage.getItem("mona_member_token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (selectedMethod === "stripe") {
        // Stripe payment
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/payment/stripe/create-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
              "X-User-Token": token,
            },
            body: JSON.stringify({
              planId,
              currency,
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          // Redirect to Stripe checkout
          window.location.href = data.data.url;
        } else {
          alert(data.error || "Erreur lors du paiement");
        }
      } else if (selectedMethod === "wave") {
        // Wave payment
        if (!phoneNumber) {
          alert("Veuillez entrer votre numéro de téléphone");
          return;
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/payment/wave/initiate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
              "X-User-Token": token,
            },
            body: JSON.stringify({
              planId,
              phoneNumber,
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          // Redirect to Wave payment URL
          window.location.href = data.data.waveUrl;
        } else {
          alert(data.error || "Erreur lors du paiement");
        }
      } else if (selectedMethod === "orange") {
        // Orange Money payment
        if (!phoneNumber) {
          alert("Veuillez entrer votre numéro de téléphone");
          return;
        }

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/payment/orange/initiate`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
              "X-User-Token": token,
            },
            body: JSON.stringify({
              planId,
              phoneNumber,
              country: "SN", // Can be dynamic
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          // Redirect to Orange Money payment URL
          window.location.href = data.data.paymentUrl;
        } else {
          alert(data.error || "Erreur lors du paiement");
        }
      }
    } catch (error) {
      console.error("Erreur paiement:", error);
      alert("Une erreur est survenue");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-serif text-[#1A1A1A]">
              Méthode de paiement
            </h2>
            <p className="text-sm text-[#1A1A1A]/60 mt-1">
              {planName} - {currency === "XOF" ? `${amount.toLocaleString()} XOF` : `$${amount}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#1A1A1A]/60" />
          </button>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          {/* Stripe (Card) */}
          <button
            onClick={() => setSelectedMethod("stripe")}
            className={`w-full p-4 border-2 rounded-xl transition-all ${
              selectedMethod === "stripe"
                ? "border-[#A68B6F] bg-[#A68B6F]/5"
                : "border-[#D4C5B9] hover:border-[#A68B6F]/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === "stripe"
                    ? "border-[#A68B6F]"
                    : "border-[#D4C5B9]"
                }`}
              >
                {selectedMethod === "stripe" && (
                  <div className="w-2.5 h-2.5 bg-[#A68B6F] rounded-full" />
                )}
              </div>
              <CreditCard className="w-5 h-5 text-[#1A1A1A]/60" />
              <div className="flex-1 text-left">
                <p className="font-medium text-[#1A1A1A]">Carte bancaire</p>
                <p className="text-xs text-[#1A1A1A]/60">
                  Visa, Mastercard, American Express
                </p>
              </div>
            </div>
          </button>

          {/* Wave (Mobile Money Senegal) - Only for XOF */}
          {currency === "XOF" && (
            <button
              onClick={() => setSelectedMethod("wave")}
              className={`w-full p-4 border-2 rounded-xl transition-all ${
                selectedMethod === "wave"
                  ? "border-[#A68B6F] bg-[#A68B6F]/5"
                  : "border-[#D4C5B9] hover:border-[#A68B6F]/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === "wave"
                      ? "border-[#A68B6F]"
                      : "border-[#D4C5B9]"
                  }`}
                >
                  {selectedMethod === "wave" && (
                    <div className="w-2.5 h-2.5 bg-[#A68B6F] rounded-full" />
                  )}
                </div>
                <Smartphone className="w-5 h-5 text-[#1A1A1A]/60" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-[#1A1A1A]">Wave</p>
                  <p className="text-xs text-[#1A1A1A]/60">Mobile Money Sénégal</p>
                </div>
              </div>
            </button>
          )}

          {/* Orange Money - Only for XOF */}
          {currency === "XOF" && (
            <button
              onClick={() => setSelectedMethod("orange")}
              className={`w-full p-4 border-2 rounded-xl transition-all ${
                selectedMethod === "orange"
                  ? "border-[#A68B6F] bg-[#A68B6F]/5"
                  : "border-[#D4C5B9] hover:border-[#A68B6F]/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === "orange"
                      ? "border-[#A68B6F]"
                      : "border-[#D4C5B9]"
                  }`}
                >
                  {selectedMethod === "orange" && (
                    <div className="w-2.5 h-2.5 bg-[#A68B6F] rounded-full" />
                  )}
                </div>
                <Smartphone className="w-5 h-5 text-[#1A1A1A]/60" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-[#1A1A1A]">Orange Money</p>
                  <p className="text-xs text-[#1A1A1A]/60">
                    Sénégal, Côte d'Ivoire, Mali...
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Phone Number Input (for Wave and Orange) */}
        <AnimatePresence>
          {(selectedMethod === "wave" || selectedMethod === "orange") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={
                  selectedMethod === "wave"
                    ? "+221 XX XXX XX XX"
                    : "+XXX XX XXX XX XX"
                }
                className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={!selectedMethod || processing}
          className="w-full py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Traitement...
            </>
          ) : (
            <>Payer {currency === "XOF" ? `${amount.toLocaleString()} XOF` : `$${amount}`}</>
          )}
        </button>

        {/* Security Note */}
        <p className="text-xs text-center text-[#1A1A1A]/60 mt-4">
          Paiement sécurisé. Vos données sont protégées.
        </p>
      </motion.div>
    </div>
  );
}
