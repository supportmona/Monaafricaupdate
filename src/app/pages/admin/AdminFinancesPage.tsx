import { useState } from "react";
import { motion } from "motion/react";
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function AdminFinancesPage() {
  const [currency, setCurrency] = useState<"XOF" | "USD">("XOF");
  const [timeRange, setTimeRange] = useState<"month" | "quarter" | "year">("month");

  const revenueData = {
    thisMonth: { XOF: 45678000, USD: 76130 },
    lastMonth: { XOF: 38234000, USD: 63723 },
    thisYear: { XOF: 234500000, USD: 390833 },
    growth: "+19.5%",
    mrr: { XOF: 42000000, USD: 70000 }
  };

  const breakdown = {
    b2c: {
      subscriptions: { XOF: 12450000, USD: 20750 },
      consultations: { XOF: 8900000, USD: 14833 }
    },
    b2b: {
      subscriptions: { XOF: 21328000, USD: 35547 },
      consulting: { XOF: 3000000, USD: 5000 }
    }
  };

  const transactions = [
    {
      id: "TRX-2026-1234",
      type: "subscription",
      description: "Orange Sénégal - Abonnement Février",
      amount: { XOF: 3375000, USD: 5625 },
      status: "completed",
      date: "1 Fév 2026",
      method: "Carte bancaire"
    },
    {
      id: "TRX-2026-1233",
      type: "consultation",
      description: "Paiement consultation - Dr. Fatou Diop",
      amount: { XOF: 15000, USD: 25 },
      status: "completed",
      date: "5 Fév 2026",
      method: "Mobile Money"
    },
    {
      id: "TRX-2026-1232",
      type: "subscription",
      description: "Sonatel - Abonnement Février",
      amount: { XOF: 2850000, USD: 4750 },
      status: "completed",
      date: "1 Fév 2026",
      method: "Virement bancaire"
    },
    {
      id: "TRX-2026-1231",
      type: "refund",
      description: "Remboursement - Annulation consultation",
      amount: { XOF: 15000, USD: 25 },
      status: "refunded",
      date: "4 Fév 2026",
      method: "Mobile Money"
    },
    {
      id: "TRX-2026-1230",
      type: "subscription",
      description: "Membre Premium - Amara Diallo",
      amount: { XOF: 15000, USD: 25 },
      status: "pending",
      date: "5 Fév 2026",
      method: "Carte bancaire"
    }
  ];

  const paymentMethods = [
    { name: "Carte bancaire", percentage: 45, amount: { XOF: 20555100, USD: 34258 } },
    { name: "Mobile Money", percentage: 35, amount: { XOF: 15987300, USD: 26645 } },
    { name: "Virement bancaire", percentage: 20, amount: { XOF: 9135600, USD: 15226 } }
  ];

  const expertPayouts = [
    { name: "Dr. Fatou Diop", amount: { XOF: 2808000, USD: 4680 }, status: "processed" },
    { name: "Dr. Aminata Ndiaye", amount: { XOF: 2376000, USD: 3960 }, status: "processed" },
    { name: "Dr. Mamadou Sow", amount: { XOF: 2244000, USD: 3740 }, status: "pending" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Complété
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            En attente
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <ArrowDownRight className="w-3 h-3" />
            Remboursé
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "subscription":
        return <CreditCard className="w-5 h-5 text-blue-600" />;
      case "consultation":
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case "refund":
        return <ArrowDownRight className="w-5 h-5 text-orange-600" />;
      default:
        return <DollarSign className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-serif text-[#1A1A1A]">Finances</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrency(currency === "XOF" ? "USD" : "XOF")}
                className="px-4 py-2 border border-[#D4C5B9] rounded-full text-sm hover:bg-[#F5F1ED] transition-colors"
              >
                {currency}
              </button>
              <button className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#2A2A2A] transition-colors">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Exporter</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Revenus principaux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-6 sm:p-8 text-white"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                REVENUS TOTAUX
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-light">
                  {currency === "XOF" 
                    ? revenueData.thisMonth.XOF.toLocaleString() 
                    : revenueData.thisMonth.USD.toLocaleString()}
                </span>
                <span className="text-2xl text-white/60">{currency}</span>
              </div>
              <p className="text-sm text-white/80 mb-2">Ce mois</p>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-lg font-medium">{revenueData.growth}</span>
                <span className="text-sm text-white/80">vs mois dernier</span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-sm text-white/70 mb-1">MRR</p>
              <p className="text-2xl font-light">
                {currency === "XOF" 
                  ? revenueData.mrr.XOF.toLocaleString() 
                  : revenueData.mrr.USD.toLocaleString()} {currency}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/70 mb-1">Cette année</p>
              <p className="text-2xl font-light">
                {currency === "XOF" 
                  ? (revenueData.thisYear.XOF / 1000000).toFixed(1) + "M"
                  : (revenueData.thisYear.USD / 1000).toFixed(0) + "K"} {currency}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/70 mb-1">Croissance</p>
              <p className="text-2xl font-light text-green-300">{revenueData.growth}</p>
            </div>
          </div>
        </motion.div>

        {/* Répartition B2C / B2B */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* B2C */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-serif text-[#1A1A1A]">Revenus B2C</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#F5F1ED] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#1A1A1A]/60">Abonnements</span>
                  <span className="text-lg font-medium text-[#1A1A1A]">
                    {currency === "XOF" 
                      ? (breakdown.b2c.subscriptions.XOF / 1000000).toFixed(1) + "M"
                      : (breakdown.b2c.subscriptions.USD / 1000).toFixed(0) + "K"} {currency}
                  </span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: "58%" }}></div>
                </div>
              </div>

              <div className="p-4 bg-[#F5F1ED] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#1A1A1A]/60">Consultations</span>
                  <span className="text-lg font-medium text-[#1A1A1A]">
                    {currency === "XOF" 
                      ? (breakdown.b2c.consultations.XOF / 1000000).toFixed(1) + "M"
                      : (breakdown.b2c.consultations.USD / 1000).toFixed(0) + "K"} {currency}
                  </span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: "42%" }}></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* B2B */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-serif text-[#1A1A1A]">Revenus B2B</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#F5F1ED] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#1A1A1A]/60">Abonnements</span>
                  <span className="text-lg font-medium text-[#1A1A1A]">
                    {currency === "XOF" 
                      ? (breakdown.b2b.subscriptions.XOF / 1000000).toFixed(1) + "M"
                      : (breakdown.b2b.subscriptions.USD / 1000).toFixed(0) + "K"} {currency}
                  </span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "88%" }}></div>
                </div>
              </div>

              <div className="p-4 bg-[#F5F1ED] rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#1A1A1A]/60">Consulting</span>
                  <span className="text-lg font-medium text-[#1A1A1A]">
                    {currency === "XOF" 
                      ? (breakdown.b2b.consulting.XOF / 1000000).toFixed(1) + "M"
                      : (breakdown.b2b.consulting.USD / 1000).toFixed(0) + "K"} {currency}
                  </span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: "12%" }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transactions récentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif text-[#1A1A1A]">Transactions récentes</h3>
            <button className="text-sm text-[#A68B6F] hover:underline">Voir tout</button>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl hover:bg-[#E5DED6] transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] mb-1">{transaction.description}</p>
                    <div className="flex items-center gap-3 text-xs text-[#1A1A1A]/60">
                      <span>{transaction.id}</span>
                      <span>•</span>
                      <span>{transaction.date}</span>
                      <span>•</span>
                      <span>{transaction.method}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-base font-medium ${
                      transaction.type === "refund" ? "text-orange-600" : "text-green-600"
                    }`}>
                      {transaction.type === "refund" ? "-" : "+"}
                      {currency === "XOF" 
                        ? transaction.amount.XOF.toLocaleString() 
                        : transaction.amount.USD.toLocaleString()} {currency}
                    </p>
                  </div>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Méthodes de paiement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Méthodes de paiement</h3>

          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#1A1A1A]/60" />
                    <span className="text-sm text-[#1A1A1A]">{method.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {currency === "XOF" 
                        ? (method.amount.XOF / 1000000).toFixed(1) + "M"
                        : (method.amount.USD / 1000).toFixed(0) + "K"} {currency}
                    </p>
                    <p className="text-xs text-[#1A1A1A]/60">{method.percentage}%</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-[#F5F1ED] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#A68B6F] to-[#D4A574] transition-all"
                    style={{ width: `${method.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Paiements experts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif text-[#1A1A1A]">Paiements experts</h3>
            <button className="text-sm text-[#A68B6F] hover:underline">Gérer</button>
          </div>

          <div className="space-y-3">
            {expertPayouts.map((payout, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl"
              >
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A] mb-1">{payout.name}</p>
                  <p className="text-xs text-[#1A1A1A]/60">Paiement mensuel</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-base font-medium text-[#1A1A1A]">
                    {currency === "XOF" 
                      ? payout.amount.XOF.toLocaleString() 
                      : payout.amount.USD.toLocaleString()} {currency}
                  </p>
                  {payout.status === "processed" ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Traité
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      En attente
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </main>

      {/* Navigation PWA Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] safe-area-inset-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-xs">Dashboard</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs">Utilisateurs</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-xs">Analytics</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-xs">Paramètres</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="h-20"></div>
    </div>
  );
}
