import { motion } from "motion/react";
import { Sparkles, Brain, Target, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";

// Smart Matching Page
export default function SmartMatchingPage() {
  const features = [
    {
      icon: Brain,
      title: "Algorithme Intelligent",
      description: "Notre IA analyse vos besoins, préférences et historique pour identifier les experts parfaitement alignés avec vos objectifs de bien-être."
    },
    {
      icon: Target,
      title: "Précision Maximale",
      description: "Plus de 50 critères évalués pour garantir une compatibilité optimale entre vous et votre expert en santé mentale."
    },
    {
      icon: Users,
      title: "Réseau Vérifié",
      description: "Tous nos experts sont certifiés et évalués selon nos standards d'excellence. Qualifications vérifiées, approches validées."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Questionnaire Personnalisé",
      description: "Répondez à quelques questions sur vos besoins, vos préférences et vos objectifs de bien-être."
    },
    {
      number: "02",
      title: "Analyse Intelligente",
      description: "Notre algorithme analyse vos réponses et identifie les experts les plus compatibles avec votre profil."
    },
    {
      number: "03",
      title: "Recommandations",
      description: "Recevez une sélection personnalisée d'experts avec leurs spécialités, approches et disponibilités."
    },
    {
      number: "04",
      title: "Premier Rendez-vous",
      description: "Réservez directement avec l'expert de votre choix et commencez votre parcours bien-être."
    }
  ];

  const benefits = [
    "Gain de temps : trouvez le bon expert en quelques minutes",
    "Compatibilité garantie basée sur des données scientifiques",
    "Recommandations évolutives selon vos progrès",
    "Possibilité de changer d'expert si nécessaire",
    "Historique et préférences sauvegardés",
    "Confidentialité et sécurité maximales"
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
                TECHNOLOGIE INTELLIGENTE
              </p>
              <div className="w-32 h-[2px] bg-foreground mx-auto" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-foreground mb-6 leading-tight">
              Smart Matching : trouvez{" "}
              <span className="italic">votre expert idéal</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-foreground/70 font-sans mb-12 leading-relaxed">
              Notre algorithme intelligent vous met en relation avec les experts 
              les mieux adaptés à vos besoins, vos préférences et vos objectifs de bien-être.
            </p>

            <Link
              to="/onboarding/matching"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
            >
              Commencer le matching
              <ArrowRight className="w-5 h-5" />
            </Link>
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
              Comment ça <span className="italic">fonctionne</span>
            </h2>
            <p className="text-lg text-foreground/70 font-sans max-w-2xl mx-auto">
              Une technologie de pointe au service de votre bien-être mental
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-beige/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-terracotta/10 flex items-center justify-center mb-6">
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

      {/* Steps Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground mb-6">
              Le processus en <span className="italic">4 étapes</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-serif text-terracotta/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-serif text-anthracite mb-3">
                  {step.title}
                </h3>
                <p className="text-base text-muted-foreground font-sans leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-[#D4C5B9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground mb-6">
                Pourquoi choisir notre{" "}
                <span className="italic">Smart Matching</span>
              </h2>
              <p className="text-lg text-foreground/70 font-sans mb-8 leading-relaxed">
                Une approche innovante qui combine intelligence artificielle et expertise humaine 
                pour des recommandations personnalisées et pertinentes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 bg-white rounded-lg p-4 border border-beige/30"
                >
                  <CheckCircle2 className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <span className="text-base text-anthracite font-sans">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
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
              Prêt à trouver votre expert idéal ?
            </h2>
            <p className="text-lg text-white/70 font-sans mb-8">
              Le matching ne prend que 5 minutes et vous pouvez réserver votre première séance immédiatement.
            </p>
            <Link
              to="/onboarding/matching"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1A1A1A] rounded-full hover:bg-gray-100 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}