import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { motion } from "motion/react";
import { 
  Smartphone, 
  CreditCard, 
  Shield, 
  Zap, 
  Globe,
  CheckCircle2,
  ArrowRight,
  Wallet,
  Users,
  TrendingUp,
  Clock,
  Lock,
  Bell
} from "lucide-react";
import { Link } from "react-router";

export default function MobileMoneyPage() {
  const mobileMoneyProviders = [
    {
      name: "M-Pesa",
      countries: ["Kenya", "Tanzanie", "RDC"],
      color: "from-teal-200 to-teal-300"
    },
    {
      name: "Orange Money",
      countries: ["Côte d'Ivoire", "Sénégal", "Mali", "Burkina Faso"],
      color: "from-amber-200 to-amber-300"
    },
    {
      name: "MTN Mobile Money",
      countries: ["Ghana", "Ouganda", "Cameroun"],
      color: "from-orange-200 to-orange-300"
    },
    {
      name: "Airtel Money",
      countries: ["RDC", "Zambie", "Niger"],
      color: "from-purple-200 to-purple-300"
    },
    {
      name: "Wave",
      countries: ["Sénégal", "Côte d'Ivoire", "Mali"],
      color: "from-blue-300 to-blue-400"
    }
  ];

  const advantages = [
    {
      icon: Smartphone,
      title: "Sans carte bancaire",
      description: "Payez directement depuis votre téléphone mobile, sans compte bancaire nécessaire"
    },
    {
      icon: Zap,
      title: "Instantané",
      description: "Transactions validées en quelques secondes pour accéder immédiatement aux services"
    },
    {
      icon: Shield,
      title: "Sécurisé",
      description: "Protection maximale avec authentification à deux facteurs et chiffrement E2E"
    },
    {
      icon: Globe,
      title: "Pan-africain",
      description: "Support de tous les principaux opérateurs Mobile Money à travers l'Afrique francophone"
    },
    {
      icon: Lock,
      title: "Confidentiel",
      description: "Vos données de paiement ne sont jamais stockées sur nos serveurs"
    },
    {
      icon: Bell,
      title: "Notifications SMS",
      description: "Recevez une confirmation par SMS après chaque transaction réussie"
    }
  ];

  const howItWorks = [
    {
      number: "1",
      title: "Choisissez votre abonnement",
      description: "Sélectionnez le Cercle M.O.N.A ou un forfait de consultations adapté à vos besoins"
    },
    {
      number: "2",
      title: "Sélectionnez Mobile Money",
      description: "Choisissez votre opérateur parmi M-Pesa, Orange Money, MTN, Airtel Money ou Wave"
    },
    {
      number: "3",
      title: "Validez sur votre téléphone",
      description: "Composez le code USSD ou confirmez dans votre application mobile"
    },
    {
      number: "4",
      title: "Accès immédiat",
      description: "Votre abonnement est activé instantanément après confirmation du paiement"
    }
  ];

  const faqs = [
    {
      question: "Quels sont les frais de transaction Mobile Money ?",
      answer: "M.O.N.A ne prélève aucun frais supplémentaire. Seuls les frais standards de votre opérateur Mobile Money s'appliquent selon la grille tarifaire de votre pays."
    },
    {
      question: "Mon paiement Mobile Money est-il sécurisé ?",
      answer: "Absolument. Nous utilisons une infrastructure conforme aux normes PCI-DSS avec chiffrement E2E. Vos données financières ne transitent jamais par nos serveurs et sont traitées directement par votre opérateur."
    },
    {
      question: "Que faire si mon paiement échoue ?",
      answer: "Vérifiez d'abord votre solde Mobile Money. Si le problème persiste, contactez notre support à contact@monafrica.net avec votre numéro de transaction. Nous vous aiderons sous 2h maximum."
    },
    {
      question: "Puis-je annuler un paiement Mobile Money ?",
      answer: "Une fois validé sur votre téléphone, le paiement est immédiat et définitif. Pour toute demande de remboursement, consultez notre politique de remboursement ou contactez notre équipe."
    },
    {
      question: "Le Mobile Money fonctionne-t-il hors connexion ?",
      answer: "Oui ! Le paiement Mobile Money via USSD fonctionne même sans connexion internet, uniquement avec le réseau mobile GSM. Parfait pour les zones à faible connectivité."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-beige via-white to-beige/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <div className="mb-8 inline-block">
              <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-anthracite font-sans font-medium mb-3">
                PAIEMENT AFRICA-READY
              </p>
              <div className="w-32 h-[2px] bg-anthracite mx-auto" />
            </div>

            {/* Titre géant */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif text-anthracite mb-6 leading-[1.1]">
              Mobile Money pour <span className="italic">tous</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-lg sm:text-xl lg:text-2xl text-anthracite/70 font-sans mb-10 leading-relaxed max-w-3xl mx-auto">
              Accédez à une santé mentale premium sans carte bancaire. M-Pesa, Orange Money, MTN, Airtel Money et Wave acceptés.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/tarifs"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all duration-200 font-sans font-semibold text-base"
              >
                Voir les tarifs
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/help/mobile-money"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-anthracite text-anthracite rounded-full hover:bg-anthracite hover:text-white transition-all duration-200 font-sans font-semibold text-base"
              >
                Guide d'utilisation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Opérateurs supportés */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4">
              Tous vos opérateurs préférés
            </h2>
            <p className="text-lg text-anthracite/60 font-sans max-w-2xl mx-auto">
              Compatible avec les principaux services Mobile Money en Afrique francophone
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mobileMoneyProviders.map((provider, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border-2 border-beige/30 rounded-2xl p-6 hover:border-terracotta/30 hover:shadow-xl transition-all duration-300"
              >
                <h3 className="text-xl font-serif font-bold text-anthracite mb-3">
                  {provider.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {provider.countries.map((country, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-beige/30 text-anthracite/70 rounded-full text-xs font-sans"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
            
            {/* Plus à venir */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-gold/10 to-terracotta/10 border-2 border-dashed border-gold/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
            >
              <TrendingUp className="w-10 h-10 text-gold mb-3" />
              <h3 className="text-lg font-serif font-bold text-anthracite mb-2">
                Et bientôt plus
              </h3>
              <p className="text-sm text-anthracite/60 font-sans">
                Nouveaux partenariats en cours de négociation
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4">
              Pourquoi Mobile Money avec M.O.N.A
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((advantage, idx) => {
              const Icon = advantage.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-xl p-6"
                >
                  <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-terracotta" />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-anthracite mb-2">
                    {advantage.title}
                  </h3>
                  <p className="text-sm text-anthracite/70 font-sans leading-relaxed">
                    {advantage.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4">
              Comment ça marche
            </h2>
            <p className="text-lg text-anthracite/60 font-sans max-w-2xl mx-auto">
              Payer avec Mobile Money est simple, rapide et sécurisé
            </p>
          </motion.div>

          <div className="space-y-8">
            {howItWorks.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="w-14 h-14 bg-anthracite rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-serif font-bold text-2xl">
                    {step.number}
                  </span>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-serif font-bold text-anthracite mb-2">
                    {step.title}
                  </h3>
                  <p className="text-anthracite/70 font-sans leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16 bg-gradient-to-br from-anthracite via-anthracite to-anthracite/90 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Users className="w-10 h-10 text-gold mx-auto mb-4" />
              <div className="text-4xl sm:text-5xl font-serif font-bold mb-2">95%</div>
              <p className="text-white/70 font-sans">
                Des Africains ont accès au Mobile Money
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Clock className="w-10 h-10 text-gold mx-auto mb-4" />
              <div className="text-4xl sm:text-5xl font-serif font-bold mb-2">30s</div>
              <p className="text-white/70 font-sans">
                Temps moyen pour compléter un paiement
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Wallet className="w-10 h-10 text-gold mx-auto mb-4" />
              <div className="text-4xl sm:text-5xl font-serif font-bold mb-2">0 XOF</div>
              <p className="text-white/70 font-sans">
                Frais supplémentaires M.O.N.A
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4">
              Questions fréquentes
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-beige/30 rounded-xl p-6 hover:border-terracotta/30 hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg font-serif font-bold text-anthracite mb-3">
                  {faq.question}
                </h3>
                <p className="text-anthracite/70 font-sans leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center p-6 bg-beige/30 rounded-xl border border-beige/50"
          >
            <p className="text-anthracite/70 font-sans mb-4">
              D'autres questions sur Mobile Money ?
            </p>
            <Link
              to="/help/mobile-money"
              className="inline-flex items-center gap-2 text-terracotta hover:text-gold transition-colors font-sans font-medium"
            >
              Consulter le guide complet
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-br from-terracotta to-terracotta/90 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-6">
              Prêt à commencer ?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 font-sans mb-8 max-w-2xl mx-auto">
              Rejoignez des milliers de membres qui prennent soin de leur santé mentale avec Mobile Money
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-terracotta rounded-full hover:bg-white/90 transition-all duration-200 font-sans font-semibold shadow-xl"
              >
                Créer un compte
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-terracotta transition-all duration-200 font-sans font-semibold"
              >
                Contactez-nous
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}