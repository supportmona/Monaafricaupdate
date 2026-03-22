import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function AnnulerAbonnementPage() {
  const steps = [
    {
      number: "01",
      title: "Connectez-vous à votre compte",
      content: "Accédez à votre tableau de bord M.O.N.A avec vos identifiants."
    },
    {
      number: "02",
      title: "Accédez à 'Mon abonnement'",
      content: "Dans le menu de navigation, cliquez sur 'Mon abonnement' ou 'Paramètres'."
    },
    {
      number: "03",
      title: "Cliquez sur 'Annuler l'abonnement'",
      content: "Vous trouverez ce bouton en bas de la page de gestion de votre abonnement."
    },
    {
      number: "04",
      title: "Confirmez votre décision",
      content: "Nous vous demanderons de confirmer votre annulation. Vous pouvez optionnellement nous indiquer la raison de votre départ pour nous aider à améliorer nos services."
    },
    {
      number: "05",
      title: "Recevez votre confirmation",
      content: "Vous recevrez un email de confirmation. Votre abonnement restera actif jusqu'à la fin de votre période de facturation en cours."
    }
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
            <div className="inline-block px-4 py-2 bg-gold/10 border border-gold/20 rounded-full mb-6">
              <span className="text-sm text-gold font-sans font-medium">Paiements & Abonnements</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif text-anthracite mb-6">
              Puis-je annuler mon abonnement ?
            </h1>
            <p className="text-lg text-muted-foreground font-sans">
              Oui, absolument. Chez M.O.N.A, vous êtes libre d'annuler votre abonnement à tout moment, sans frais ni pénalité. Votre bien-être est notre priorité, et nous respectons votre décision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-anthracite mb-8">
            Comment annuler votre abonnement
          </h2>
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="bg-white border border-beige/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                    <span className="text-lg font-serif text-gold font-semibold">{step.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-serif text-anthracite mb-2">
                      {step.title}
                    </h3>
                    <p className="text-base text-muted-foreground font-sans">
                      {step.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif text-anthracite mb-6">
              Ce qu'il faut savoir
            </h2>
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-terracotta/5 via-beige/10 to-gold/5 border border-beige/30 rounded-2xl p-8">
                <div className="flex items-start gap-4 mb-4">
                  <CheckCircle className="w-7 h-7 text-terracotta flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-serif text-anthracite mb-2">
                      Aucun frais d'annulation
                    </h3>
                    <p className="text-base text-muted-foreground font-sans leading-relaxed">
                      L'annulation est 100% gratuite. Nous ne facturons aucun frais, aucune pénalité. Vous ne payez que pour la période pendant laquelle vous avez utilisé le service.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gold/5 via-beige/10 to-terracotta/5 border border-beige/30 rounded-2xl p-8">
                <div className="flex items-start gap-4 mb-4">
                  <CheckCircle className="w-7 h-7 text-gold flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-serif text-anthracite mb-2">
                      Accès jusqu'à la fin de la période payée
                    </h3>
                    <p className="text-base text-muted-foreground font-sans leading-relaxed">
                      Même après l'annulation, vous conservez l'accès à tous vos avantages jusqu'à la fin de votre période de facturation en cours. Par exemple, si vous annulez le 10 du mois et que votre abonnement se renouvelle le 25, vous pourrez utiliser M.O.N.A jusqu'au 25.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-beige/10 via-anthracite/5 to-terracotta/5 border border-beige/30 rounded-2xl p-8">
                <div className="flex items-start gap-4 mb-4">
                  <CheckCircle className="w-7 h-7 text-anthracite flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-serif text-anthracite mb-2">
                      Vos données restent disponibles
                    </h3>
                    <p className="text-base text-muted-foreground font-sans leading-relaxed">
                      Votre Passeport Santé (FHIR), vos notes et votre historique restent accessibles pendant 90 jours après l'annulation. Si vous revenez, tout est exactement là où vous l'aviez laissé.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Alternatives */}
      <section className="py-12 bg-gradient-to-br from-anthracite via-anthracite to-anthracite/90 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-6">
              <RefreshCw className="w-8 h-8 text-terracotta" />
              <h2 className="text-3xl font-serif">
                Avant d'annuler, avez-vous pensé à ces alternatives ?
              </h2>
            </div>
            <p className="text-lg text-white/80 font-sans leading-relaxed mb-8">
              Nous comprenons que les circonstances évoluent. Voici quelques options qui pourraient mieux correspondre à vos besoins actuels :
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                <h3 className="text-xl font-serif mb-3">Passer à un forfait inférieur</h3>
                <p className="text-sm text-white/80 font-sans leading-relaxed">
                  Passez de Premium à Essentiel pour réduire vos coûts tout en gardant un suivi régulier. Vous pouvez changer de formule à tout moment.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                <h3 className="text-xl font-serif mb-3">Passer aux séances à l'unité</h3>
                <p className="text-sm text-white/80 font-sans leading-relaxed">
                  Annulez votre abonnement et payez uniquement quand vous avez besoin d'une consultation. Idéal pour les périodes où vous avez moins besoin d'accompagnement.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                <h3 className="text-xl font-serif mb-3">Mettre en pause temporairement</h3>
                <p className="text-sm text-white/80 font-sans leading-relaxed">
                  Vous traversez une période compliquée financièrement ? Contactez notre support pour discuter d'une pause temporaire de 1 à 3 mois.
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                <h3 className="text-xl font-serif mb-3">Changer de thérapeute</h3>
                <p className="text-sm text-white/80 font-sans leading-relaxed">
                  Le courant ne passe pas avec votre expert actuel ? Demandez un nouveau matching. C'est normal et ça arrive. La relation thérapeutique est essentielle.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl group"
              >
                Discuter avec notre équipe
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Refund Policy */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif text-anthracite mb-6">
              Politique de remboursement
            </h2>
            <div className="bg-gradient-to-br from-beige/10 via-white to-gold/5 border border-beige/30 rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                    <h3 className="text-lg font-serif text-anthracite">
                      Remboursement sous 7 jours
                    </h3>
                  </div>
                  <p className="text-base text-muted-foreground font-sans pl-8">
                    Si vous annulez dans les 7 premiers jours de votre premier abonnement et que vous n'avez pas encore utilisé de consultation, nous vous remboursons intégralement, sans question.
                  </p>
                </div>
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <XCircle className="w-5 h-5 text-anthracite/40 flex-shrink-0 mt-0.5" />
                    <h3 className="text-lg font-serif text-anthracite">
                      Pas de remboursement au prorata
                    </h3>
                  </div>
                  <p className="text-base text-muted-foreground font-sans pl-8">
                    Après 7 jours ou si vous avez déjà utilisé des consultations, nous ne remboursons pas au prorata. Cependant, votre abonnement reste actif jusqu'à la fin de la période payée.
                  </p>
                </div>
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <h3 className="text-lg font-serif text-anthracite">
                      Remboursement exceptionnel
                    </h3>
                  </div>
                  <p className="text-base text-muted-foreground font-sans pl-8">
                    Dans des cas exceptionnels (problème technique majeur, force majeure), nous étudions chaque situation au cas par cas. Contactez notre support à support@monafrica.net.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-terracotta/5 via-beige/10 to-gold/5 border border-terracotta/30 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-serif text-anthracite mb-4">
              Besoin d'aide pour prendre votre décision ?
            </h3>
            <p className="text-base text-muted-foreground font-sans mb-6 max-w-2xl mx-auto">
              Notre équipe support est disponible 24/7 pour répondre à vos questions et vous aider à trouver la meilleure solution pour votre situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
              >
                Contacter le support
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="mailto:support@monafrica.net"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-beige/50 text-anthracite rounded-full hover:bg-beige/10 transition-all duration-200 font-sans font-semibold"
              >
                support@monafrica.net
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif text-anthracite mb-6">
            Articles associés
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/help/moyens-paiement"
              className="p-6 bg-beige/5 hover:bg-beige/10 border border-beige/30 rounded-xl transition-all duration-200 group"
            >
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">
                Quels moyens de paiement acceptez-vous ?
              </h3>
              <p className="text-sm text-muted-foreground font-sans">
                Découvrez tous les modes de paiement disponibles.
              </p>
            </Link>
            <Link
              to="/tarifs"
              className="p-6 bg-beige/5 hover:bg-beige/10 border border-beige/30 rounded-xl transition-all duration-200 group"
            >
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">
                Voir nos tarifs
              </h3>
              <p className="text-sm text-muted-foreground font-sans">
                Consultez toutes nos formules et trouvez celle qui vous convient.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
