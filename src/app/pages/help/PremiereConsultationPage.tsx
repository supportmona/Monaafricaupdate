import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ArrowLeft, Calendar, Clock, Video, Check, Bell } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function PremiereConsultationPage() {
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
              <Calendar className="w-4 h-4 text-terracotta" />
              <span className="text-sm font-sans font-medium text-terracotta uppercase tracking-wide">
                Démarrer avec M.O.N.A
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-anthracite mb-6">
              Comment réserver ma première consultation ?
            </h1>

            <p className="text-lg text-[#6B6B6B] font-sans leading-relaxed">
              Réserver votre première consultation est simple et rapide. Voici comment procéder pour rencontrer l'expert parfait pour vos besoins.
            </p>
          </motion.div>

          {/* Contenu */}
          <div className="space-y-12">
            {/* Étapes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-serif font-bold text-anthracite mb-6">
                Les étapes de réservation
              </h2>

              <div className="space-y-6">
                {[
                  {
                    number: "1",
                    title: "Session d'Orientation gratuite",
                    description: "Commencez par réserver votre Session d'Orientation de 15 minutes, totalement gratuite et sans engagement. Notre équipe comprendra vos besoins.",
                    icon: Video,
                    link: "/reserver"
                  },
                  {
                    number: "2",
                    title: "Smart Matching personnalisé",
                    description: "Notre algorithme analyse vos réponses et vous propose 3 experts parfaitement adaptés à votre situation, vos préférences culturelles et linguistiques.",
                    icon: Check,
                    link: "/smart-matching"
                  },
                  {
                    number: "3",
                    title: "Choisissez votre créneau",
                    description: "Parcourez les disponibilités de votre expert et sélectionnez l'heure qui vous convient le mieux. Tous les fuseaux horaires sont pris en compte.",
                    icon: Clock,
                    link: null
                  },
                  {
                    number: "4",
                    title: "Confirmez votre réservation",
                    description: "Recevez immédiatement un email de confirmation avec le lien sécurisé pour rejoindre votre séance. Des rappels automatiques vous seront envoyés.",
                    icon: Bell,
                    link: null
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
                        <p className="text-[#6B6B6B] font-sans leading-relaxed mb-3">
                          {step.description}
                        </p>
                        {step.link && (
                          <Link
                            to={step.link}
                            className="inline-flex items-center gap-2 text-sm font-sans font-medium text-terracotta hover:text-terracotta/80 transition-colors"
                          >
                            En savoir plus
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Types de consultations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-gray-200 rounded-xl p-8"
            >
              <h2 className="text-2xl font-serif font-bold text-anthracite mb-6">
                Types de consultations disponibles
              </h2>

              <div className="space-y-4">
                {[
                  {
                    type: "Session d'Orientation",
                    duration: "15 minutes",
                    price: "Gratuite",
                    description: "Découvrez M.O.N.A et déterminez vos besoins avec notre équipe"
                  },
                  {
                    type: "Consultation standard",
                    duration: "50 minutes",
                    price: "À partir de 15 000 XOF",
                    description: "Séance individuelle avec votre expert attitré"
                  },
                  {
                    type: "Consultation couple",
                    duration: "60 minutes",
                    price: "À partir de 25 000 XOF",
                    description: "Thérapie de couple avec un expert spécialisé"
                  },
                  {
                    type: "Consultation famille",
                    duration: "75 minutes",
                    price: "À partir de 35 000 XOF",
                    description: "Séance familiale pour résoudre les conflits et renforcer les liens"
                  }
                ].map((consult, idx) => (
                  <div key={idx} className="p-6 bg-beige/20 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-serif font-bold text-anthracite">
                        {consult.type}
                      </h3>
                      <span className="text-sm font-sans font-bold text-terracotta px-3 py-1 bg-white rounded-full">
                        {consult.price}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-4 h-4 text-[#6B6B6B]" />
                      <span className="text-sm font-sans text-[#6B6B6B]">
                        {consult.duration}
                      </span>
                    </div>
                    <p className="text-[#6B6B6B] font-sans text-sm leading-relaxed">
                      {consult.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Ce dont vous avez besoin */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-anthracite/5 border border-anthracite/10 rounded-xl p-8"
            >
              <h2 className="text-2xl font-serif font-bold text-anthracite mb-6">
                Ce dont vous avez besoin
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  "Une connexion internet stable",
                  "Un appareil avec caméra et micro",
                  "Un espace calme et privé",
                  "Votre compte M.O.N.A activé",
                  "Un moyen de paiement valide",
                  "15 minutes avant pour tester votre connexion"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span className="text-[#6B6B6B] font-sans leading-relaxed">
                      {item}
                    </span>
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
                    question: "Puis-je annuler ou reporter ma consultation ?",
                    answer: "Oui, vous pouvez annuler ou reporter gratuitement jusqu'à 24h avant l'heure prévue. Au-delà, des frais d'annulation peuvent s'appliquer."
                  },
                  {
                    question: "Comment se déroule la première séance ?",
                    answer: "Lors de votre première séance, votre expert prendra le temps de vous connaître, de comprendre vos besoins et d'établir un plan d'accompagnement personnalisé."
                  },
                  {
                    question: "Dois-je installer un logiciel ?",
                    answer: "Non, notre plateforme de visioconférence fonctionne directement dans votre navigateur. Aucune installation n'est nécessaire."
                  },
                  {
                    question: "Puis-je utiliser mes crédits pour réserver ?",
                    answer: "Oui, si vous avez un Pack à Crédits ou un Abonnement, vos crédits seront automatiquement utilisés lors de la réservation."
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
                Prêt à réserver votre Session d'Orientation ?
              </h3>
              <p className="text-[#6B6B6B] font-sans mb-6">
                Gratuite, sans engagement, et disponible 7j/7
              </p>
              <Link
                to="/reserver"
                className="inline-flex items-center justify-center px-8 py-4 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all duration-200 font-sans font-bold"
              >
                Réserver maintenant
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}