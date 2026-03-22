import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ArrowLeft, Brain, Users, Target, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function SmartMatchingPage() {
  const howItWorks = [
    {
      icon: Brain,
      title: "Analyse de vos besoins",
      content: "Lors de votre inscription et de votre Session d'Orientation, nous recueillons des informations sur vos besoins spécifiques, vos préférences linguistiques, culturelles et vos objectifs thérapeutiques."
    },
    {
      icon: Target,
      title: "Algorithme de matching intelligent",
      content: "Notre algorithme propriétaire analyse plus de 50 critères pour vous proposer les 3 experts les plus adaptés à votre profil. Nous prenons en compte l'expérience, les spécialités, les langues parlées et la sensibilité culturelle."
    },
    {
      icon: Users,
      title: "Validation humaine",
      content: "Un Spécialiste Dispatch expert révise chaque matching pour garantir la pertinence. Nous ne laissons rien au hasard pour assurer la meilleure compatibilité possible."
    },
    {
      icon: Sparkles,
      title: "Résultat en moins de 24h",
      content: "Vous recevez vos recommandations personnalisées avec le profil détaillé de chaque expert suggéré. Vous choisissez librement celui avec qui vous souhaitez commencer votre parcours."
    }
  ];

  const criterias = [
    "Spécialité thérapeutique (anxiété, dépression, trauma, etc.)",
    "Langues parlées (français, anglais, lingala, wolof, etc.)",
    "Contexte culturel et sensibilité aux enjeux africains",
    "Approche thérapeutique (TCC, psychanalyse, EMDR, etc.)",
    "Disponibilité et fuseaux horaires",
    "Expérience avec des profils similaires au vôtre",
    "Genre du thérapeute (si vous avez une préférence)",
    "Évaluations et retours des autres membres"
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Breadcrumb */}
      <section className="pt-32 pb-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/help"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-terracotta transition-colors font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Centre d'Aide
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <section className="pb-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
              <span className="text-sm text-terracotta font-sans font-medium">Démarrer avec M.O.N.A</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif text-anthracite mb-6">
              Comment fonctionne le Smart Matching ?
            </h1>
            <p className="text-lg text-muted-foreground font-sans">
              Notre système de Smart Matching vous connecte avec l'expert idéal en combinant intelligence artificielle et expertise humaine. Découvrez comment nous garantissons le meilleur match possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-anthracite mb-8">
            Le processus en 4 étapes
          </h2>
          <div className="space-y-8">
            {howItWorks.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white border border-beige/30 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-terracotta/10 rounded-full flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-terracotta" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-serif text-anthracite mb-3">
                      {step.title}
                    </h3>
                    <p className="text-base text-muted-foreground font-sans leading-relaxed">
                      {step.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Criterias */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif text-anthracite mb-4">
              Critères pris en compte
            </h2>
            <p className="text-base text-muted-foreground font-sans mb-8">
              Notre algorithme analyse plus de 50 points de données pour vous proposer le match parfait. Voici les principaux critères :
            </p>
            <div className="bg-gradient-to-br from-beige/10 via-white to-terracotta/5 border border-beige/30 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {criterias.map((criteria, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-terracotta rounded-full mt-2 flex-shrink-0" />
                    <span className="text-base text-anthracite font-sans">
                      {criteria}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-12 bg-gradient-to-br from-anthracite via-anthracite to-anthracite/90 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif mb-6">
              Pourquoi le matching est-il si important ?
            </h2>
            <p className="text-lg text-white/80 font-sans leading-relaxed mb-8">
              La recherche scientifique montre que la qualité de la relation thérapeutique est le facteur le plus déterminant dans le succès d'une thérapie. Un bon matching augmente de 3x vos chances d'atteindre vos objectifs thérapeutiques.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                <div className="text-4xl font-serif text-terracotta mb-2">85%</div>
                <p className="text-sm text-white/80 font-sans">
                  Des membres trouvent leur expert idéal dès la première recommandation
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                <div className="text-4xl font-serif text-gold mb-2">24h</div>
                <p className="text-sm text-white/80 font-sans">
                  Délai moyen pour recevoir vos recommandations personnalisées
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                <div className="text-4xl font-serif text-beige mb-2">3</div>
                <p className="text-sm text-white/80 font-sans">
                  Experts recommandés parmi lesquels vous pouvez choisir librement
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Flexibility */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gold/10 via-beige/10 to-terracotta/5 border border-gold/30 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-serif text-anthracite mb-4">
              Vous gardez toujours le contrôle
            </h3>
            <p className="text-base text-muted-foreground font-sans leading-relaxed mb-6">
              Le Smart Matching est une recommandation, jamais une obligation. Vous êtes libre de :
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-terracotta mt-1">•</span>
                <span className="text-base text-muted-foreground font-sans">
                  Choisir parmi les 3 experts recommandés
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-terracotta mt-1">•</span>
                <span className="text-base text-muted-foreground font-sans">
                  Consulter tous les profils de notre réseau d'experts
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-terracotta mt-1">•</span>
                <span className="text-base text-muted-foreground font-sans">
                  Changer d'expert à tout moment si le feeling ne passe pas
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-terracotta mt-1">•</span>
                <span className="text-base text-muted-foreground font-sans">
                  Demander un nouveau matching avec des critères affinés
                </span>
              </li>
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl group"
            >
              Découvrir mon expert idéal
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-20 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif text-anthracite mb-6">
            Articles associés
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/help/premiere-consultation"
              className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group"
            >
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">
                Comment réserver ma première consultation ?
              </h3>
              <p className="text-sm text-muted-foreground font-sans">
                Réservez votre première séance en quelques clics.
              </p>
            </Link>
            <Link
              to="/help/changer-therapeute"
              className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group"
            >
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">
                Puis-je changer de thérapeute ?
              </h3>
              <p className="text-sm text-muted-foreground font-sans">
                Découvrez comment changer d'expert si nécessaire.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
