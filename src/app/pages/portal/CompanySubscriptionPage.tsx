import { useState } from "react";
import { motion } from "motion/react";
import { 
  CreditCard,
  Download,
  Calendar,
  Users,
  Check,
  Crown,
  Zap,
  Shield,
  TrendingUp,
  FileText,
  AlertCircle,
  ChevronRight,
  Activity,
  BarChart3,
  Settings
} from "lucide-react";

export default function CompanySubscriptionPage() {
  const [currency, setCurrency] = useState<"XOF" | "USD">("XOF");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  const subscription = {
    plan: "Entreprise Premium",
    status: "active",
    seats: 450,
    usedSeats: 287,
    renewalDate: "28 Février 2026",
    startDate: "28 Janvier 2025",
    features: [
      "Consultations illimitées",
      "Tous les experts disponibles",
      "Analytics RH avancés",
      "Support prioritaire 24/7",
      "API & Intégrations",
      "Formation équipe RH",
      "Rapports personnalisés",
      "Manager dédié"
    ]
  };

  const pricing = {
    monthly: {
      perSeat: { XOF: 7500, USD: 12.5 },
      total: { XOF: 3375000, USD: 5625 }
    },
    annual: {
      perSeat: { XOF: 75000, USD: 125 },
      total: { XOF: 33750000, USD: 56250 },
      savings: { XOF: 6750000, USD: 11250 }
    }
  };

  const invoices = [
    {
      id: "INV-2026-02",
      date: "1 Février 2026",
      amount: { XOF: 3375000, USD: 5625 },
      status: "paid",
      period: "Février 2026"
    },
    {
      id: "INV-2026-01",
      date: "1 Janvier 2026",
      amount: { XOF: 3375000, USD: 5625 },
      status: "paid",
      period: "Janvier 2026"
    },
    {
      id: "INV-2025-12",
      date: "1 Décembre 2025",
      amount: { XOF: 3375000, USD: 5625 },
      status: "paid",
      period: "Décembre 2025"
    }
  ];

  const plans = [
    {
      name: "Essentiel",
      description: "Pour les petites équipes",
      price: { XOF: 5000, USD: 8.33 },
      features: [
        "10 consultations/mois",
        "Experts certifiés",
        "Support email",
        "Analytics de base"
      ],
      current: false
    },
    {
      name: "Professionnel",
      description: "Pour équipes en croissance",
      price: { XOF: 6500, USD: 10.83 },
      features: [
        "25 consultations/mois",
        "Tous les experts",
        "Support prioritaire",
        "Analytics avancés",
        "Rapports mensuels"
      ],
      current: false
    },
    {
      name: "Entreprise Premium",
      description: "Solution complète",
      price: { XOF: 7500, USD: 12.5 },
      features: [
        "Consultations illimitées",
        "Support 24/7",
        "Analytics personnalisés",
        "API & Intégrations",
        "Manager dédié"
      ],
      current: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-serif text-[#1A1A1A]">Abonnement</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Plan actuel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-6 sm:p-8 text-white"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                <Crown className="w-3.5 h-3.5" />
                PLAN ACTUEL
              </div>
              <h2 className="text-3xl font-serif mb-2">{subscription.plan}</h2>
              <p className="text-white/70">Actif depuis {subscription.startDate}</p>
            </div>
            <button
              onClick={() => setCurrency(currency === "XOF" ? "USD" : "XOF")}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition-colors"
            >
              {currency}
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <Users className="w-6 h-6 mb-2 text-white/80" />
              <p className="text-2xl font-light mb-1">
                {subscription.usedSeats}/{subscription.seats}
              </p>
              <p className="text-sm text-white/70">Licences utilisées</p>
            </div>

            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <Calendar className="w-6 h-6 mb-2 text-white/80" />
              <p className="text-2xl font-light mb-1">
                {currency === "XOF" 
                  ? pricing.monthly.total.XOF.toLocaleString() 
                  : pricing.monthly.total.USD.toLocaleString()}
              </p>
              <p className="text-sm text-white/70">{currency}/mois</p>
            </div>

            <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <TrendingUp className="w-6 h-6 mb-2 text-green-400" />
              <p className="text-2xl font-light mb-1">64%</p>
              <p className="text-sm text-white/70">Taux d'engagement</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-white/70 mb-1">Prochain renouvellement</p>
            <p className="text-lg font-medium">{subscription.renewalDate}</p>
          </div>
        </motion.div>

        {/* Utilisation des licences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <h3 className="text-xl font-serif text-[#1A1A1A] mb-4">Utilisation des licences</h3>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#1A1A1A]">
                {subscription.usedSeats} licences actives sur {subscription.seats}
              </span>
              <span className="text-sm text-[#1A1A1A]/60">
                {Math.round((subscription.usedSeats / subscription.seats) * 100)}%
              </span>
            </div>
            <div className="w-full h-3 bg-[#F5F1ED] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#A68B6F] to-[#D4A574] transition-all"
                style={{ width: `${(subscription.usedSeats / subscription.seats) * 100}%` }}
              ></div>
            </div>
          </div>

          <p className="text-sm text-[#1A1A1A]/60">
            {subscription.seats - subscription.usedSeats} licences disponibles
          </p>

          <button className="w-full mt-4 bg-[#F5F1ED] hover:bg-[#E5DED6] text-[#1A1A1A] rounded-full py-3 font-medium transition-colors">
            Ajouter des licences
          </button>
        </motion.div>

        {/* Fonctionnalités incluses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Fonctionnalités incluses</h3>
          
          <div className="grid sm:grid-cols-2 gap-3">
            {subscription.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-[#F5F1ED] rounded-xl">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm text-[#1A1A1A]">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Changer de plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Autres plans disponibles</h3>
          
          <div className="grid sm:grid-cols-3 gap-4">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  plan.current
                    ? "border-[#A68B6F] bg-[#A68B6F]/5"
                    : "border-[#D4C5B9] hover:border-[#A68B6F]/50"
                }`}
              >
                <h4 className="text-lg font-medium text-[#1A1A1A] mb-1">{plan.name}</h4>
                <p className="text-xs text-[#1A1A1A]/60 mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-light text-[#1A1A1A]">
                      {currency === "XOF" 
                        ? plan.price.XOF.toLocaleString() 
                        : plan.price.USD}
                    </span>
                    <span className="text-sm text-[#1A1A1A]/60">{currency}</span>
                  </div>
                  <p className="text-xs text-[#1A1A1A]/60">par licence/mois</p>
                </div>

                <ul className="space-y-2 mb-4">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-xs text-[#1A1A1A]">
                      <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.current ? (
                  <div className="w-full bg-[#A68B6F] text-white rounded-full py-2 text-sm font-medium text-center">
                    Plan actuel
                  </div>
                ) : (
                  <button className="w-full bg-[#F5F1ED] hover:bg-[#E5DED6] text-[#1A1A1A] rounded-full py-2 text-sm font-medium transition-colors">
                    Choisir ce plan
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Historique de facturation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-serif text-[#1A1A1A]">Historique de facturation</h3>
            <button className="text-sm text-[#A68B6F] hover:underline">Voir tout</button>
          </div>

          <div className="space-y-3">
            {invoices.map((invoice, index) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl hover:bg-[#E5DED6] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#1A1A1A]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A] mb-1">{invoice.id}</p>
                    <p className="text-xs text-[#1A1A1A]/60">{invoice.period}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-[#1A1A1A]">
                      {currency === "XOF" 
                        ? invoice.amount.XOF.toLocaleString() 
                        : invoice.amount.USD.toLocaleString()} {currency}
                    </p>
                    <p className="text-xs text-[#1A1A1A]/60">{invoice.date}</p>
                  </div>
                  <button className="p-2 hover:bg-white rounded-full transition-colors">
                    <Download className="w-4 h-4 text-[#1A1A1A]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Moyens de paiement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Moyen de paiement</h3>
          
          <div className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#1A1A1A]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#1A1A1A] mb-1">Carte Visa •••• 4242</p>
                <p className="text-xs text-[#1A1A1A]/60">Expire 12/2027</p>
              </div>
            </div>
            <button className="text-sm text-[#A68B6F] hover:underline">Modifier</button>
          </div>
        </motion.div>

      </main>

      {/* Navigation PWA Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] safe-area-inset-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs">Accueil</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs">Employés</span>
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
