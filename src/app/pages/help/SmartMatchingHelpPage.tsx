import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ArrowLeft, Brain, Heart, Globe, Zap, Check, Star } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function SmartMatchingHelpPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />

      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Link
            to="/help"
            className="inline-flex items-center gap-2 text-sm font-sans text-[#6B6B6B] hover:text-anthracite transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Centre d'Aide
          </Link>

          {/* Titre */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 rounded-full mb-6">
              <Brain className="w-4 h-4 text-terracotta" />
              <span className="text-sm font-sans font-medium text-terracotta uppercase tracking-wide">
                Démarrer avec M.O.N.A
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-anthracite mb-6">
              Comment fonctionne le Smart Matching ?
            </h1>

            <p className="text-lg text-[#6B6B6B] font-sans leading-relaxed">
              Notre algorithme intelligent vous connecte avec les experts les plus adaptés à votre situation unique, en tenant compte de multiples facteurs culturels, linguistiques et thérapeutiques.
            </p>
          </motion.div>

          {/* Contenu */}
          <div className="space-y-12">
            {/* Comment ça marche */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-serif font-bold text-anthracite mb-6">
                Comment ça marche ?
              </h2>

              <div className="space-y-6">
                {[
                  {
                    number: "1",
                    title: "Répondez au questionnaire",
                    description: "Partagez vos besoins, préférences linguistiques, culturelles et vos attentes thérapeutiques en quelques minutes seulement.",
                    icon: Heart
                  },
                  {
                    number: "2",
                    title: "L'algorithme analyse",
                    description: "Notre IA croise vos réponses avec les profils de nos 200+ experts pour identifier les meilleurs matchs possibles.",
                    icon: Brain
                  },
                  {
                    number: "3",
                    title: "Recevez 3 recommandations",
                    description: "Découvrez 3 experts parfaitement adaptés avec leurs spécialités, disponibilités et avis clients vérifiés.",
                    icon: Star
                  },
                  {
                    number: "4",
                    title: "Choisissez et réservez",
                    description: "Sélectionnez l'expert qui vous inspire le plus confiance et réservez votre première séance en un clic.",
                    icon: Check
                  }
                ].map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4 p-6 bg-beige/20 rounded-xl">
                      <div className="w-12 h-12 bg-anthracite rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-serif font-bold text-xl">
                          {step.number}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-5 h-5 text-terracotta" />
                          <h3 className="text-lg font-serif font-bold text-anthracite">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-[#6B6B6B] font-sans leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Critères de matching */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-xl p-8"
            >
              <h2 className="text-2xl font-serif font-bold text-anthracite mb-6">
                Les critères de matching
              </h2>

              <div className="space-y-6">
                {[
                  {
                    icon: Heart,
                    title: "Besoins thérapeutiques",
                    items: [
                      "Type de problématique (anxiété, dépression, stress...)",
                      "Approche thérapeutique préférée (TCC, psychodynamique...)",
                      "Objectifs personnels et attentes"
                    ]
                  },
                  {
                    icon: Globe,
                    title: "Préférences culturelles",
                    items: [
                      "Langue(s) parlée(s) et niveau de confort",
                      "Origine culturelle et sensibilités",
                      "Pratiques religieuses ou spirituelles"
                    ]
                  },
                  {
                    icon: Zap,
                    title: "Compatibilité personnelle",
                    items: [
                      "Style de communication (directif, non-directif)",
                      "Genre de l'expert si important pour vous",
                      "Expérience avec votre type de situation"
                    ]
                  }
                ].map((category, idx) => {
                  const Icon = category.icon;
                  return (
                    <div key={idx} className="p-6 bg-beige/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-anthracite/10 rounded-full flex items-center justify-center">
                          <Icon className="w-5 h-5 text-anthracite" />
                        </div>
                        <h3 className="text-lg font-serif font-bold text-anthracite">
                          {category.title}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {category.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-3">
                            <Check className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-1" />
                            <span className="text-[#6B6B6B] font-sans text-sm leading-relaxed">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Pourquoi c'est efficace */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-anthracite/5 border border-anthracite/10 rounded-xl p-8"
            >
              <h2 className="text-2xl font-serif font-bold text-anthracite mb-6">
                Pourquoi le Smart Matching est efficace
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    stat: "87%",
                    label: "De taux de satisfaction dès la première séance"
                  },
                  {
                    stat: "3x",
                    label: "Plus de chances de succès thérapeutique"
                  },
                  {
                    stat: "92%",
                    label: "Poursuivent avec l'expert recommandé"
                  },
                  {
                    stat: "200+",
                    label: "Experts vérifiés dans notre réseau"
                  }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl text-center">
                    <div className="text-4xl font-serif font-bold text-terracotta mb-2">
                      {stat.stat}
                    </div>
                    <div className="text-sm font-sans text-[#6B6B6B]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* FAQ */}
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
                    question: "Puis-je refaire le questionnaire ?",
                    answer: "Oui, vous pouvez refaire le questionnaire à tout moment depuis votre espace membre pour obtenir de nouvelles recommandations."
                  },
                  {
                    question: "Que faire si aucun expert ne me convient ?",
                    answer: "Contactez notre équipe via le chat. Nous pourrons affiner manuellement votre recherche et vous proposer d'autres experts adaptés."
                  },
                  {
                    question: "Puis-je changer d'expert après avoir commencé ?",
                    answer: "Absolument. La relation thérapeutique est essentielle. Si le courant ne passe pas, nous trouverons un autre expert sans frais supplémentaires."
                  },
                  {
                    question: "Le matching est-il vraiment basé sur l'IA ?",
                    answer: "Oui, notre algorithme utilise le machine learning et analyse des milliers de variables pour optimiser chaque recommandation. Il s'améliore continuellement."
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

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-beige/30 rounded-xl p-8 text-center"
            >
              <h3 className="text-2xl font-serif font-bold text-anthracite mb-4">
                Découvrez votre expert idéal
              </h3>
              <p className="text-[#6B6B6B] font-sans mb-6">
                Le questionnaire ne prend que 5 minutes
              </p>
              <Link
                to="/matching-quiz"
                className="inline-flex items-center justify-center px-8 py-4 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all duration-200 font-sans font-bold"
              >
                Commencer le Smart Matching
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
