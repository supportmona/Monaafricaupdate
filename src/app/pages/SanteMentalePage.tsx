import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { Brain, Heart, Sparkles, Users, Shield, Globe, ArrowRight, CheckCircle2, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function SanteMentalePage() {
  const features = [
    {
      icon: Brain,
      title: "Neuro-Apaisement",
      description: "Techniques avancées basées sur les neurosciences pour réduire stress et anxiété",
      color: "terracotta"
    },
    {
      icon: Sparkles,
      title: "Smart Matching",
      description: "Algorithme intelligent qui vous connecte au thérapeute parfait pour vos besoins",
      color: "gold"
    },
    {
      icon: Heart,
      title: "Approche Holistique",
      description: "Soin complet combinant psychothérapie, coaching et bien-être émotionnel",
      color: "terracotta"
    }
  ];

  const expertises = [
    {
      title: "Anxiété & Stress",
      description: "Gestion du stress chronique, crises d'angoisse, troubles anxieux",
      icon: Brain
    },
    {
      title: "Dépression",
      description: "Accompagnement pour la dépression légère à modérée",
      icon: Heart
    },
    {
      title: "Relations & Couple",
      description: "Thérapie de couple, conflits familiaux, communication",
      icon: Users
    },
    {
      title: "Traumatismes",
      description: "EMDR, traitement des traumatismes et PTSD",
      icon: Shield
    },
    {
      title: "Développement Personnel",
      description: "Confiance en soi, gestion des émotions, transitions de vie",
      icon: Sparkles
    },
    {
      title: "Burnout Professionnel",
      description: "Épuisement au travail, reconversion, équilibre vie pro/perso",
      icon: Zap
    }
  ];

  const smartMatchingSteps = [
    {
      step: "01",
      title: "Questionnaire Personnalisé",
      description: "Répondez à quelques questions sur vos besoins, vos préférences linguistiques et culturelles"
    },
    {
      step: "02",
      title: "Analyse Intelligente",
      description: "Notre algorithme analyse votre profil et identifie les experts les plus compatibles"
    },
    {
      step: "03",
      title: "Match Parfait",
      description: "Recevez 3 recommandations personnalisées avec profils détaillés et disponibilités"
    },
    {
      step: "04",
      title: "Première Séance",
      description: "Réservez en un clic avec l'expert qui vous correspond le mieux"
    }
  ];

  const benefits = [
    {
      icon: Globe,
      title: "Culturellement Adapté",
      description: "Experts formés aux réalités africaines et aux nuances culturelles locales"
    },
    {
      icon: Shield,
      title: "Confidentialité Totale",
      description: "Chiffrement E2E, anonymat garanti, aucune trace sur vos relevés bancaires"
    },
    {
      icon: Star,
      title: "Experts Certifiés",
      description: "Psychologues, psychiatres et coachs certifiés avec minimum 5 ans d'expérience"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-white via-terracotta/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
                <Brain className="w-4 h-4 text-terracotta" />
                <span className="text-sm text-terracotta font-sans font-medium uppercase tracking-wide">Santé Mentale+</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-serif text-anthracite mb-6 leading-tight">
                Votre bien-être mental, notre <span className="italic text-terracotta">expertise</span>
              </h1>
              <p className="text-xl text-muted-foreground font-sans mb-8 leading-relaxed">
                Neuro-apaisement, Smart Matching et accompagnement personnalisé. Une approche moderne de la santé mentale, pensée pour l'Afrique.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/onboarding"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
                >
                  Trouver mon expert
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/tarifs"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-beige/50 text-anthracite rounded-full hover:bg-beige/10 transition-all duration-200 font-sans font-semibold"
                >
                  Voir les tarifs
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-gradient-to-br from-beige/5 to-white border border-beige/30 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-${feature.color}/10 rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}`} />
                </div>
                <h3 className="text-2xl font-serif text-anthracite mb-4">
                  {feature.title}
                </h3>
                <p className="text-base text-muted-foreground font-sans">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Matching Process */}
      <section className="py-20 bg-gradient-to-b from-beige/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-serif text-anthracite mb-6">
              Comment fonctionne le <span className="italic text-terracotta">Smart Matching</span> ?
            </h2>
            <p className="text-xl text-muted-foreground font-sans max-w-3xl mx-auto">
              Notre algorithme intelligent vous connecte au thérapeute parfait en 4 étapes simples.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {smartMatchingSteps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative"
              >
                <div className="bg-white border border-beige/30 rounded-2xl p-6 h-full">
                  <div className="text-5xl font-serif text-terracotta/20 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-serif text-anthracite mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-sans">
                    {step.description}
                  </p>
                </div>
                {idx < smartMatchingSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-beige" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertises */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-serif text-anthracite mb-6">
              Nos domaines <span className="italic text-terracotta">d'expertise</span>
            </h2>
            <p className="text-xl text-muted-foreground font-sans max-w-3xl mx-auto">
              Nos experts couvrent un large éventail de problématiques de santé mentale.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertises.map((expertise, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-gradient-to-br from-beige/5 to-white border border-beige/30 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <expertise.icon className="w-6 h-6 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif text-anthracite mb-2">
                      {expertise.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-sans">
                      {expertise.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-b from-beige/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-serif text-anthracite mb-6">
              Pourquoi choisir <span className="italic text-terracotta">Santé Mentale+</span> ?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-white border border-beige/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <benefit.icon className="w-10 h-10 text-terracotta" />
                </div>
                <h3 className="text-xl font-serif text-anthracite mb-3">
                  {benefit.title}
                </h3>
                <p className="text-base text-muted-foreground font-sans">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Neuro-Apaisement Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-terracotta/5 via-beige/10 to-white border border-beige/30 rounded-2xl p-12"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-terracotta" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-serif text-anthracite mb-6">
                Qu'est-ce que le <span className="italic text-terracotta">Neuro-Apaisement</span> ?
              </h2>
              <p className="text-lg text-muted-foreground font-sans mb-8 max-w-3xl mx-auto">
                Une approche scientifique innovante qui combine neurosciences et thérapies traditionnelles pour un apaisement durable.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                "Techniques de respiration basées sur la science",
                "Exercices de neuroplasticité",
                "Méditation guidée et pleine conscience",
                "Régulation du système nerveux",
                "Gestion du stress chronique",
                "Amélioration du sommeil"
              ].map((technique, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-terracotta flex-shrink-0" />
                  <span className="text-base text-anthracite font-sans">{technique}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-terracotta/5 via-beige/10 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-beige/30 rounded-2xl p-12 text-center shadow-lg"
          >
            <h2 className="text-3xl lg:text-4xl font-serif text-anthracite mb-6">
              Prêt à commencer votre <span className="italic text-terracotta">parcours de bien-être</span> ?
            </h2>
            <p className="text-lg text-muted-foreground font-sans mb-8 max-w-2xl mx-auto">
              Laissez notre Smart Matching vous connecter à l'expert parfait pour vos besoins. Première séance en moins de 48h.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/onboarding"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/experts"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-beige/50 text-anthracite rounded-full hover:bg-beige/10 transition-all duration-200 font-sans font-semibold"
              >
                Découvrir nos experts
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
