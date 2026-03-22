import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { ArrowLeft, Download, FileText, Calendar, CreditCard } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function InvoicesPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const token = localStorage.getItem("mona_member_token");
      if (!token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/transactions`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.data || []);
      }
    } catch (error) {
      console.error("Erreur chargement transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (transactionId: string) => {
    try {
      const token = localStorage.getItem("mona_member_token");
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/invoices/${transactionId}`,
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
        a.download = `facture-mona-${transactionId}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Erreur téléchargement facture:", error);
      alert("Erreur lors du téléchargement");
    }
  };

  const getPaymentMethodLabel = (method: string): string => {
    const labels: any = {
      stripe_card: "Carte bancaire",
      wave_mobile_money: "Wave Mobile Money",
      orange_money: "Orange Money",
      wallet: "Portefeuille M.O.N.A",
    };
    return labels[method] || method;
  };

  const getPaymentMethodIcon = (method: string) => {
    return <CreditCard className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#A68B6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1A1A1A]/60">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/member/dashboard"
              className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1A1A1A]/60" />
            </Link>
            <div>
              <h1 className="text-2xl font-serif text-[#1A1A1A]">
                Mes factures
              </h1>
              <p className="text-sm text-[#1A1A1A]/60 mt-1">
                Historique de vos paiements
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {transactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center border border-[#D4C5B9]"
          >
            <FileText className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
            <h2 className="text-xl font-serif text-[#1A1A1A] mb-2">
              Aucune facture
            </h2>
            <p className="text-sm text-[#1A1A1A]/60 mb-6">
              Vos factures apparaîtront ici après votre premier paiement.
            </p>
            <Link
              to="/pricing"
              className="inline-block px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors"
            >
              Voir les plans
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 border border-[#D4C5B9] hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Invoice Number */}
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-[#A68B6F]" />
                      <span className="text-sm font-semibold text-[#A68B6F]">
                        INV-MONA-{new Date(transaction.createdAt).getFullYear()}-
                        {transaction.id.substring(0, 8).toUpperCase()}
                      </span>
                    </div>

                    {/* Description */}
                    <h3 className="text-lg font-medium text-[#1A1A1A] mb-2">
                      {transaction.description || "Abonnement M.O.N.A"}
                    </h3>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                        <Calendar className="w-4 h-4" />
                        {new Date(transaction.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
                        {getPaymentMethodIcon(transaction.method)}
                        {getPaymentMethodLabel(transaction.method)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status === "completed"
                            ? "Payé"
                            : transaction.status === "pending"
                            ? "En attente"
                            : "Échoué"}
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-2xl font-bold text-[#1A1A1A]">
                      {transaction.currency === "XOF"
                        ? `${transaction.amount.toLocaleString("fr-FR")} XOF`
                        : `$${transaction.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}`}
                    </div>
                  </div>

                  {/* Download Button */}
                  {transaction.status === "completed" && (
                    <button
                      onClick={() => downloadInvoice(transaction.id)}
                      className="ml-4 flex items-center gap-2 px-4 py-2 bg-[#F5F1ED] hover:bg-[#D4C5B9] rounded-full transition-colors text-sm font-medium text-[#1A1A1A]"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Télécharger</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
