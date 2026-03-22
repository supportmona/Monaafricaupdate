import { motion } from "motion/react";
import { Heart, Calendar, CreditCard, Users, Sparkles, MessageSquare, Video, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";

// Membres Page
export default function MembresPage() {
  const [currency, setCurrency] = useState<"XOF" | "USD">("XOF");

  // Taux de conversion : 1 USD = ~585 XOF (approximatif)
  const convertPrice = (xofPrice: number) => {
    if (currency === "USD") {
      return Math.round(xofPrice / 585);
    }
    return xofPrice;
  };

  const formatPrice = (xofPrice: number) => {
    const price = convertPrice(xofPrice);
    if (currency === "USD") {
      return `$${price}`;
    }
    return `${price.toLocaleString()} XOF`;
  };

  const features = [
    {
      icon: Video,
      title: "Téléconsultations Illimitées",
      description: "Accédez à vos experts en santé mentale par vidéo, audio ou chat. Sans limite de sessions, quand vous en avez besoin."
    },
    {
      icon: Calendar,
      title: "Réservation Flexible",
      description: "Prenez rendez-vous en quelques clics, modifiez ou annulez facilement. Rappels automatiques par SMS et email."
    },
    {
      icon: FileText,
      title: "Passeport Santé Personnel",
      description: "Votre dossier médical numérique centralisé. Historique complet, documents, et suivi de progression."
    },
    {
      icon: Sparkles,
      title: "Smart Matching",
      description: "Notre algorithme intelligent vous met en relation avec les experts parfaitement alignés avec vos besoins."
    },
    {
      icon: MessageSquare,
      title: "Messagerie Sécurisée",
      description: "Échangez avec vos experts entre les séances. Questions, suivis, partage de documents en toute sécurité."
    },
    {
      icon: CreditCard,
      title: "Le Cercle M.O.N.A",
      description: "Programme de privilèges exclusifs avec réductions chez nos partenaires bien-être premium."
    }
  ];

  const plans = [
    {
      name: "Essentiel",
      price: 35000,
      period: "/mois",
      description: "L'essentiel pour débuter votre parcours",
      features: [
        "1 Téléconsultation par mois",
        "Messagerie sécurisée avec votre expert",
        "Smart Matching Culturel",
        "Passeport Santé personnel (FHIR)",
        "Accès aux ressources digitales"
      ],
      cta: "Choisir Essentiel",
      color: "terracotta"
    },
    {
      name: "Premium",
      price: 80000,
      period: "/mois",
      description: "Idéal pour un changement réel et durable",
      features: [
        "4 Téléconsultations par mois (1 par semaine)",
        "Support prioritaire 24/7",
        "Accès au Cercle M.O.N.A (Communauté & Events)",
        "Réductions sur les M.O.N.A Escapes",
        "Suivi personnalisé avancé",
        "Accès prioritaire aux experts"
      ],
      cta: "Le meilleur choix",
      color: "gold",
      popular: true
    },
    {
      name: "Entreprise",
      price: null,
      period: null,
      description: "Solutions sur mesure pour vos collaborateurs",
      features: [
        "Dashboard RH anonymisé (Rapports d'impact)",
        "Formations pour managers",
        "Accès groupé pour les employés",
        "Accompagnement organisationnel",
        "Rapports d'impact mesurables",
        "Account Manager attitré"
      ],
      cta: "Demander un devis",
      color: "anthracite"
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Santé mentale accessible",
      description: "Plus besoin d'attendre des semaines pour un rendez-vous. Consultez rapidement les meilleurs experts."
    },
    {
      icon: Users,
      title: "Réseau d'excellence",
      description: "Psychologues, psychiatres, thérapeutes et coachs certifiés et rigoureusement sélectionnés."
    },
    {
      icon: Sparkles,
      title: "Expérience premium",
      description: "Interface intuitive, rappels automatiques, et support client réactif pour une expérience fluide."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-foreground font-sans font-medium mb-3">
                POUR LES MEMBRES
              </p>
              <div className="w-32 h-[2px] bg-foreground mx-auto" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-foreground mb-6 leading-tight">
              Votre bien-être mental,{" "}
              <span className="italic">notre priorité</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-foreground/70 font-sans mb-12 leading-relaxed">
              Rejoignez M.O.N.A et bénéficiez d'un accès privilégié à un réseau d'experts 
              en santé mentale, d'outils innovants et d'une communauté bienveillante.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
              >
                Devenir membre
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/demo"
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-full hover:bg-[#1A1A1A] hover:text-white transition-all duration-200 font-sans font-semibold"
              >
                Demander une démo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-[#E8DFD6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground mb-6">
              Tout ce que vous obtenez en tant que{" "}
              <span className="italic">membre</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-beige/30 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-xl bg-terracotta/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-terracotta" />
                  </div>
                  <h3 className="text-xl font-serif text-anthracite mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-base text-muted-foreground font-sans leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground mb-6">
              Choisissez votre{" "}
              <span className="italic">formule</span>
            </h2>
            <p className="text-lg text-foreground/70 font-sans max-w-2xl mx-auto mb-8">
              Tarifs transparents adaptés au marché africain. Session d'Orientation offerte, sans engagement.
            </p>

            {/* Currency Toggle */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 bg-beige/20 rounded-full p-2 border border-beige/30 shadow-sm">
                <button
                  onClick={() => setCurrency("XOF")}
                  className={`px-6 py-2.5 rounded-full font-sans font-semibold transition-all duration-300 ${
                    currency === "XOF"
                      ? "bg-terracotta text-white shadow-lg"
                      : "text-anthracite/60 hover:text-anthracite"
                  }`}
                >
                  XOF
                </button>
                <div className="text-anthracite/30 font-sans">⇋</div>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-6 py-2.5 rounded-full font-sans font-semibold transition-all duration-300 ${
                    currency === "USD"
                      ? "bg-terracotta text-white shadow-lg"
                      : "text-anthracite/60 hover:text-anthracite"
                  }`}
                >
                  USD
                </button>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-2xl p-8 border ${
                  plan.popular
                    ? 'border-gold shadow-2xl scale-105 bg-gradient-to-br from-gold/5 to-terracotta/5'
                    : 'border-beige/30 bg-white'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-white text-sm font-sans font-semibold rounded-full">
                    Le plus populaire
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-serif text-anthracite mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  {plan.price !== null ? (
                    <>
                      <div className="text-4xl font-serif text-anthracite mb-1">
                        {formatPrice(plan.price)}
                      </div>
                      {plan.period && (
                        <div className="text-base text-muted-foreground font-sans">
                          {plan.period}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-3xl font-serif text-anthracite mb-1">
                      Sur mesure
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-anthracite font-sans">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.name === "Entreprise" ? "/demo" : "/onboarding"}
                  className={`block w-full text-center px-6 py-3 rounded-full font-sans font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-[#1A1A1A] text-white hover:bg-[#2A2A2A] shadow-lg'
                      : 'bg-transparent text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground font-sans mt-8"
          >
            Tous les plans incluent une Session d'Orientation offerte de 15 min avec un Spécialiste Dispatch. Annulation possible à tout moment.
          </motion.p>
        </div>
      </section>

      {/* Student Offers Section - Light Version */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-gold/5 via-beige/10 to-white border-y border-beige/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full mb-4">
              <CheckCircle2 className="w-5 h-5 text-gold" />
              <span className="text-sm text-gold font-sans font-semibold tracking-wide">Offres Spéciales Étudiants</span>
            </div>
            
            <h3 className="text-3xl sm:text-4xl font-serif text-anthracite mb-4">
              L'Avenir <span className="italic text-terracotta">n'attend pas</span>
            </h3>
            
            <p className="text-base text-anthracite/70 font-sans max-w-2xl mx-auto">
              Réductions exclusives pour les étudiants. Parce que votre santé mentale est essentielle.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* 3e et Terminale */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 border border-terracotta/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-serif text-anthracite mb-1">3e & Terminale</h4>
                  <p className="text-sm text-anthracite/60 font-sans">Focus Examens</p>
                </div>
                <div className="px-3 py-1 bg-terracotta/10 text-terracotta text-xs font-sans font-bold rounded-full">
                  Jusqu'à -43%
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center py-2 border-b border-beige/20">
                  <span className="text-sm font-sans text-anthracite">Séance Unique</span>
                  <div className="text-right">
                    <div className="text-base font-serif text-terracotta">{formatPrice(20000)}</div>
                    <div className="text-xs text-anthracite/40 line-through">{formatPrice(35000)}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-beige/20">
                  <span className="text-sm font-sans text-anthracite">Pack Essentiel</span>
                  <div className="text-right">
                    <div className="text-base font-serif text-terracotta">{formatPrice(25000)}/mois</div>
                    <div className="text-xs text-anthracite/40 line-through">{formatPrice(35000)}/mois</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-sans text-anthracite">Pack Premium</span>
                  <div className="text-base font-serif text-terracotta">-15%</div>
                </div>
              </div>
            </motion.div>

            {/* Autres Étudiants */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gold/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-serif text-anthracite mb-1">Autres Étudiants</h4>
                  <p className="text-sm text-anthracite/60 font-sans">Tous niveaux</p>
                </div>
                <div className="px-3 py-1 bg-gold/10 text-gold text-xs font-sans font-bold rounded-full">
                  Jusqu'à -29%
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center py-2 border-b border-beige/20">
                  <span className="text-sm font-sans text-anthracite">Séance Unique</span>
                  <div className="text-right">
                    <div className="text-base font-serif text-gold">{formatPrice(25000)}</div>
                    <div className="text-xs text-anthracite/40 line-through">{formatPrice(35000)}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-beige/20">
                  <span className="text-sm font-sans text-anthracite">Pack Essentiel</span>
                  <div className="text-right">
                    <div className="text-base font-serif text-gold">{formatPrice(30000)}/mois</div>
                    <div className="text-xs text-anthracite/40 line-through">{formatPrice(35000)}/mois</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-sans text-anthracite">Pack Premium</span>
                  <div className="text-base font-serif text-gold">-10%</div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm text-anthracite/60 font-sans mb-6">
              Sur présentation d'un justificatif étudiant (carte, certificat de scolarité)
            </p>
            
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-white rounded-full hover:bg-gold/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl group"
            >
              Obtenir mon code étudiant
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-[#D4C5B9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground mb-6">
              Pourquoi choisir{" "}
              <span className="italic">M.O.N.A</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Icon className="w-8 h-8 text-terracotta" />
                  </div>
                  <h3 className="text-xl font-serif text-anthracite mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-base text-foreground/70 font-sans leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-[#1A1A1A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-[#D4C5B9]" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-6">
              Prêt à prendre soin de votre bien-être mental ?
            </h2>
            <p className="text-lg text-white/70 font-sans mb-8">
              Rejoignez M.O.N.A dès aujourd'hui. Session d'Orientation offerte de 15 min, sans engagement.
            </p>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1A1A1A] rounded-full hover:bg-gray-100 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
            >
              Réserver ma Session d'Orientation
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}