import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  Crown,
  Calendar,
  CreditCard,
  Loader2,
  ArrowRight,
  Check,
  AlertTriangle,
  X,
  ChevronLeft,
} from "lucide-react";

export default function MemberSubscriptionPage() {
  const navigate = useNavigate();
  const { user } = useMemberAuth();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("mona_member_token");
      if (!token) {
        setLoading(false);
        return;
      }

      // Charger l'abonnement actuel
      const subResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/subscriptions/current`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
          },
        }
      );

      if (subResponse.ok) {
        const subData = await subResponse.json();
        setSubscription(subData.data);
      }

      // Charger l'historique des transactions
      const txResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/subscriptions/transactions`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
          },
        }
      );

      if (txResponse.ok) {
        const txData = await txResponse.json();
        setTransactions(txData.data || []);
      }
    } catch (error) {
      console.error("Erreur chargement abonnement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setCanceling(true);
      const token = localStorage.getItem("mona_member_token");
      if (!token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/subscriptions/cancel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
          },
        }
      );

      if (response.ok) {
        setShowCancelModal(false);
        await loadSubscriptionData();
        alert("Abonnement annulé avec succès");
      } else {
        const data = await response.json();
        alert(data.error || "Erreur lors de l'annulation");
      }
    } catch (error) {
      console.error("Erreur annulation:", error);
      alert("Une erreur est survenue");
    } finally {
      setCanceling(false);
    }
  };

  const getPlanName = (planKey: string) => {
    const names: Record<string, string> = {
      essentiel: "Essentiel",
      premium: "Premium",
      excellence: "Excellence",
      free: "Gratuit",
    };
    return names[planKey] || planKey;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: "Actif",
      canceled: "Annulé",
      expired: "Expiré",
      pending: "En attente",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      canceled: "bg-red-100 text-red-700",
      expired: "bg-gray-100 text-gray-700",
      pending: "bg-yellow-100 text-yellow-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#A68B6F] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate("/member/profile")}
          className="flex items-center gap-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour au profil
        </button>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-[#1A1A1A] mb-2">
            Mon abonnement
          </h1>
          <p className="text-[#1A1A1A]/60">
            Gérez votre abonnement et consultez votre historique de paiement
          </p>
        </div>

        {/* Abonnement actuel */}
        {subscription ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4C5B9] mb-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-6 h-6 text-[#A68B6F]" />
                  <h2 className="text-2xl font-serif text-[#1A1A1A]">
                    Formule {getPlanName(subscription.planKey)}
                  </h2>
                </div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    subscription.status
                  )}`}
                >
                  {getStatusLabel(subscription.status)}
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-serif text-[#1A1A1A]">
                  {subscription.amount?.toLocaleString()} {subscription.currency}
                </p>
                <p className="text-sm text-[#1A1A1A]/60">par mois</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#1A1A1A]/60" />
                <div>
                  <p className="text-xs text-[#1A1A1A]/60">Date de début</p>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {new Date(subscription.startDate).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#1A1A1A]/60" />
                <div>
                  <p className="text-xs text-[#1A1A1A]/60">Prochain paiement</p>
                  <p className="text-sm font-medium text-[#1A1A1A]">
                    {new Date(subscription.endDate).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {subscription.status === "active" && (
                <>
                  <Link
                    to="/member/upgrade"
                    className="flex-1 bg-[#A68B6F] text-white rounded-full py-3 px-6 font-medium hover:bg-[#8A7159] transition-colors text-center flex items-center justify-center gap-2"
                  >
                    Changer de formule
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex-1 bg-white border-2 border-[#D4C5B9] text-[#1A1A1A] rounded-full py-3 px-6 font-medium hover:bg-[#F5F1ED] transition-colors"
                  >
                    Annuler l'abonnement
                  </button>
                </>
              )}
              {subscription.status === "canceled" && (
                <Link
                  to="/member/upgrade"
                  className="w-full bg-[#1A1A1A] text-white rounded-full py-3 px-6 font-medium hover:bg-[#2A2A2A] transition-colors text-center flex items-center justify-center gap-2"
                >
                  Réactiver mon abonnement
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-3xl p-8 text-white text-center mb-6"
          >
            <Crown className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-serif mb-2">
              Rejoignez le Cercle M.O.N.A
            </h2>
            <p className="text-white/80 mb-6">
              Accédez à des consultations illimitées et des ressources exclusives
            </p>
            <Link
              to="/member/upgrade"
              className="inline-flex items-center gap-2 bg-white text-[#1A1A1A] rounded-full px-8 py-3 font-medium hover:bg-white/90 transition-colors"
            >
              Découvrir les formules
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}

        {/* Historique des transactions */}
        {transactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4C5B9]"
          >
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-5 h-5 text-[#A68B6F]" />
              <h3 className="text-xl font-serif text-[#1A1A1A]">
                Historique des paiements
              </h3>
            </div>

            <div className="space-y-3">
              {transactions.map((tx, index) => (
                <div
                  key={tx.id || index}
                  className="flex items-center justify-between py-4 border-b border-[#D4C5B9] last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#F5F1ED] rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#A68B6F]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">
                        Abonnement {getPlanName(tx.planKey)}
                      </p>
                      <p className="text-xs text-[#1A1A1A]/60">
                        {new Date(tx.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {tx.amount?.toLocaleString()} {tx.currency}
                    </p>
                    <p className="text-xs text-green-600">Payé</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal de confirmation annulation */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full"
          >
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            <h3 className="text-2xl font-serif text-[#1A1A1A] text-center mb-2">
              Annuler votre abonnement ?
            </h3>
            <p className="text-[#1A1A1A]/60 text-center mb-6">
              Vous perdrez l'accès aux avantages premium à la fin de la période
              en cours. Cette action est irréversible.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleCancelSubscription}
                disabled={canceling}
                className="w-full bg-red-500 text-white rounded-full py-3 px-6 font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {canceling ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Annulation...
                  </>
                ) : (
                  "Confirmer l'annulation"
                )}
              </button>
              <button
                onClick={() => setShowCancelModal(false)}
                disabled={canceling}
                className="w-full bg-white border-2 border-[#D4C5B9] text-[#1A1A1A] rounded-full py-3 px-6 font-medium hover:bg-[#F5F1ED] transition-colors disabled:opacity-50"
              >
                Conserver mon abonnement
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
