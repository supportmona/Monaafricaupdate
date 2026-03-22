import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { CheckCircle, Download, ArrowRight, Mail } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const waveId = searchParams.get("wave_id");
    const orangeOrder = searchParams.get("orange_order");

    if (sessionId) {
      verifyStripePayment(sessionId);
    } else if (waveId) {
      verifyWavePayment(waveId);
    } else if (orangeOrder) {
      verifyOrangePayment(orangeOrder);
    }
  }, [searchParams]);

  const verifyStripePayment = async (sessionId: string) => {
    try {
      const token = localStorage.getItem("mona_member_token");
      
      // Wait a bit for webhook to process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/subscriptions/active`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token!,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.data);
      }
    } catch (error) {
      console.error("Erreur vérification paiement:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyWavePayment = async (checkoutId: string) => {
    try {
      const token = localStorage.getItem("mona_member_token");
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/payment/wave/status/${checkoutId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token!,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTransaction(data.data.transaction);
      }
    } catch (error) {
      console.error("Erreur vérification Wave:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOrangePayment = async (orderId: string) => {
    try {
      const token = localStorage.getItem("mona_member_token");
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/payment/orange/status/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token!,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTransaction(data.data.transaction);
      }
    } catch (error) {
      console.error("Erreur vérification Orange Money:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    if (!transaction?.id) return;

    try {
      const token = localStorage.getItem("mona_member_token");
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/invoices/${transaction.id}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token!,
          },
        }
      );

      if (response.ok) {
        const html = await response.text();
        const blob = new Blob([html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `facture-mona-${transaction.id}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur téléchargement facture:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#A68B6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1A1A1A]/60">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 md:p-12 max-w-2xl w-full text-center border border-[#D4C5B9]"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-serif text-[#1A1A1A] mb-4"
        >
          Paiement réussi
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-[#1A1A1A]/60 mb-8"
        >
          Bienvenue au Cercle M.O.N.A ! Votre abonnement est maintenant actif.
        </motion.p>

        {/* Subscription Details */}
        {subscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#F5F1ED] rounded-2xl p-6 mb-8 text-left"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[#1A1A1A]/60 mb-1">Plan</p>
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  {subscription.planName}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 mb-1">Montant</p>
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  {subscription.currency === "XOF"
                    ? `${subscription.amount.toLocaleString()} XOF`
                    : `$${subscription.amount}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 mb-1">Date de début</p>
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  {new Date(subscription.startDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#1A1A1A]/60 mb-1">Date de fin</p>
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  {new Date(subscription.endDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Confirmation Email Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-left"
        >
          <Mail className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[#1A1A1A] font-medium mb-1">
              Email de confirmation envoyé
            </p>
            <p className="text-xs text-[#1A1A1A]/60">
              Vous recevrez un email de confirmation à l'adresse associée à votre compte.
            </p>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          {transaction && (
            <button
              onClick={downloadInvoice}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-[#D4C5B9] rounded-full hover:bg-[#F5F1ED] transition-colors"
            >
              <Download className="w-4 h-4" />
              Télécharger la facture
            </button>
          )}
          <Link
            to="/member/dashboard"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors"
          >
            Accéder au portail
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-8 border-t border-[#D4C5B9]"
        >
          <h3 className="text-sm font-semibold text-[#1A1A1A] mb-4">
            Prochaines étapes
          </h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#A68B6F] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                1
              </div>
              <p className="text-sm text-[#1A1A1A]/60">
                Complétez votre profil dans les paramètres
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#A68B6F] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                2
              </div>
              <p className="text-sm text-[#1A1A1A]/60">
                Prenez rendez-vous avec un expert en santé mentale
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#A68B6F] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </div>
              <p className="text-sm text-[#1A1A1A]/60">
                Explorez nos ressources exclusives pour membres
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
