import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ArrowLeft, CreditCard, Smartphone, Building, Check, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function MoyensPaiementPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />

      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/help"
            className="inline-flex items-center gap-2 text-sm font-sans text-[#6B6B6B] hover:text-anthracite transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Centre d'Aide
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full mb-6">
              <CreditCard className="w-4 h-4 text-gold" />
              <span className="text-sm font-sans font-medium text-gold uppercase tracking-wide">
                Paiements & Abonnements
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-anthracite mb-6">
              Quels moyens de paiement acceptez-vous ?
            </h1>

            <p className="text-lg text-[#6B6B6B] font-sans leading-relaxed">
              M.O.N.A accepte une large variété de moyens de paiement pour faciliter l'accès aux soins partout en Afrique.
            </p>
          </motion.div>

          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-serif font-bold text-anthracite mb-6">
                Moyens de paiement disponibles
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Smartphone,
                    title: "Mobile Money",
                    description: "Orange Money, MTN MoMo, Moov Money, Airtel Money",
                    available: ["Côte d'Ivoire", "Sénégal", "RDC", "Gabon", "Cameroun"],
                    recommended: true
                  },
                  {
                    icon: CreditCard,
                    title: "Cartes bancaires",
                    description: "Visa, Mastercard, American Express",
                    available: ["Tous les pays"],
                    recommended: false
                  },
                  {
                    icon: Building,
                    title: "Virement bancaire",
                    description: "Virement SEPA et international",
                    available: ["Sur demande pour les entreprises"],
                    recommended: false
                  },
                  {
                    icon: CreditCard,
                    title: "PayPal",
                    description: "Paiement sécurisé via PayPal",
                    available: ["Disponible internationalement"],
                    recommended: false
                  }
                ].map((method, idx) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-6 rounded-xl border-2 ${
                        method.recommended
                          ? "bg-gold/5 border-gold"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {method.recommended && (
                        <div className="inline-block px-3 py-1 bg-gold text-white text-xs font-sans font-bold rounded uppercase mb-4">
                          Recommandé
                        </div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-anthracite/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-anthracite" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-serif font-bold text-anthracite mb-2">
                            {method.title}
                          </h3>
                          <p className="text-sm text-[#6B6B6B] font-sans mb-3">
                            {method.description}
                          </p>
                          <div className="space-y-1">
                            {method.available.map((country, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-[#10B981]" />
                                <span className="text-xs font-sans text-[#6B6B6B]">
                                  {country}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-anthracite/5 border border-anthracite/10 rounded-xl p-8"
            >
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-anthracite flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-serif font-bold text-anthracite mb-3">
                    Sécurité des paiements
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Tous les paiements sont cryptés avec le protocole SSL/TLS",
                      "Nous ne stockons jamais vos informations bancaires",
                      "Conformité PCI DSS niveau 1 (norme bancaire internationale)",
                      "Authentification 3D Secure pour les cartes bancaires",
                      "Reçu automatique par email après chaque paiement"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                        <span className="text-[#6B6B6B] font-sans leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-serif font-bold text-anthracite mb-6">
                Questions fréquentes
              </h2>

              <div className="space-y-4">
                {[
                  {
                    question: "Puis-je payer en espèces ?",
                    answer: "Non, pour des raisons de sécurité et de traçabilité, nous n'acceptons que les paiements électroniques."
                  },
                  {
                    question: "Les paiements sont-ils en XOF ou USD ?",
                    answer: "Vous pouvez choisir votre devise (XOF ou USD). Les tarifs sont automatiquement convertis au taux du jour."
                  },
                  {
                    question: "Puis-je payer pour quelqu'un d'autre ?",
                    answer: "Oui, vous pouvez offrir des séances en entrant l'email du bénéficiaire lors du paiement."
                  }
                ].map((faq, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-serif font-bold text-anthracite mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-[#6B6B6B] font-sans leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
