import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ArrowLeft, Smartphone, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function MobileMoneyPage() {
  const steps = [
    {
      number: "01",
      title: "Sélectionnez votre formule",
      content: "Choisissez la séance unique ou l'abonnement qui vous convient sur notre page Tarifs."
    },
    {
      number: "02",
      title: "Cliquez sur 'Réserver' ou 'Commencer'",
      content: "Vous serez redirigé vers notre page de paiement sécurisée propulsée par CinetPay."
    },
    {
      number: "03",
      title: "Choisissez 'Mobile Money'",
      content: "Sélectionnez votre opérateur parmi Orange Money, MTN MoMo, Moov Money ou Airtel Money."
    },
    {
      number: "04",
      title: "Entrez votre numéro de téléphone",
      content: "Saisissez le numéro de téléphone associé à votre compte Mobile Money (format international recommandé)."
    },
    {
      number: "05",
      title: "Validez sur votre téléphone",
      content: "Vous recevrez une notification push ou un message USSD. Entrez votre code PIN Mobile Money pour confirmer le paiement."
    },
    {
      number: "06",
      title: "Confirmation instantanée",
      content: "Une fois le paiement validé, vous recevrez une confirmation par email et SMS. Votre compte est immédiatement activé."
    }
  ];

  const providers = [
    {
      name: "Orange Money",
      code: "#144#",
      countries: "Côte d'Ivoire, Sénégal, Mali, Burkina Faso, Niger, RDC, etc."
    },
    {
      name: "MTN MoMo",
      code: "*170#",
      countries: "Cameroun, Bénin, Guinée, Ghana, Côte d'Ivoire, etc."
    },
    {
      name: "Moov Money",
      code: "#303#",
      countries: "Togo, Bénin, Côte d'Ivoire, etc."
    },
    {
      name: "Airtel Money",
      code: "*126#",
      countries: "RDC, Zambie, Malawi, etc."
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
              Comment payer par Mobile Money ?
            </h1>
            <p className="text-lg text-muted-foreground font-sans">
              Le Mobile Money est le moyen de paiement le plus simple et le plus rapide pour accéder à M.O.N.A. Voici comment procéder étape par étape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-anthracite mb-8">
            Processus de paiement
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

      {/* Providers */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif text-anthracite mb-4">
              Opérateurs supportés
            </h2>
            <p className="text-base text-muted-foreground font-sans mb-8">
              M.O.N.A accepte tous les principaux opérateurs Mobile Money en Afrique francophone.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {providers.map((provider, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-beige/10 to-gold/5 border border-beige/30 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Smartphone className="w-6 h-6 text-gold" />
                    <h3 className="text-xl font-serif text-anthracite">
                      {provider.name}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-anthracite/80 font-sans">
                      <span className="font-semibold">Code USSD :</span> {provider.code}
                    </p>
                    <p className="text-sm text-muted-foreground font-sans">
                      {provider.countries}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-12 bg-gradient-to-br from-gold/5 via-beige/10 to-terracotta/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-serif text-anthracite mb-6 flex items-center gap-3">
              <CheckCircle className="w-7 h-7 text-terracotta" />
              Conseils pour un paiement réussi
            </h3>
            <div className="space-y-4">
              <div className="bg-white border border-beige/30 rounded-xl p-6">
                <h4 className="text-lg font-serif text-anthracite mb-2">
                  Vérifiez votre solde
                </h4>
                <p className="text-base text-muted-foreground font-sans">
                  Assurez-vous d'avoir suffisamment de crédit sur votre compte Mobile Money avant de lancer le paiement.
                </p>
              </div>
              <div className="bg-white border border-beige/30 rounded-xl p-6">
                <h4 className="text-lg font-serif text-anthracite mb-2">
                  Gardez votre téléphone à portée
                </h4>
                <p className="text-base text-muted-foreground font-sans">
                  Vous recevrez une notification push ou un message USSD que vous devrez valider rapidement (généralement sous 3 minutes).
                </p>
              </div>
              <div className="bg-white border border-beige/30 rounded-xl p-6">
                <h4 className="text-lg font-serif text-anthracite mb-2">
                  Utilisez le bon format de numéro
                </h4>
                <p className="text-base text-muted-foreground font-sans">
                  Privilégiez le format international (ex: +225 07 XX XX XX XX pour la Côte d'Ivoire) pour éviter les erreurs.
                </p>
              </div>
              <div className="bg-white border border-beige/30 rounded-xl p-6">
                <h4 className="text-lg font-serif text-anthracite mb-2">
                  Vérifiez le montant
                </h4>
                <p className="text-base text-muted-foreground font-sans">
                  Avant de valider avec votre code PIN, assurez-vous que le montant affiché correspond à votre achat.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-serif text-anthracite mb-6 flex items-center gap-3">
              <AlertCircle className="w-7 h-7 text-gold" />
              En cas de problème
            </h3>
            <div className="bg-gradient-to-br from-anthracite/5 via-beige/10 to-gold/5 border border-beige/30 rounded-2xl p-8">
              <p className="text-base text-muted-foreground font-sans leading-relaxed mb-6">
                Si votre paiement échoue ou si vous ne recevez pas la notification de confirmation :
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">1.</span>
                  <span className="text-base text-anthracite font-sans">
                    Vérifiez que votre compte Mobile Money est actif et que vous avez suffisamment de crédit
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">2.</span>
                  <span className="text-base text-anthracite font-sans">
                    Assurez-vous que vous avez une bonne connexion réseau
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">3.</span>
                  <span className="text-base text-anthracite font-sans">
                    Attendez quelques minutes, parfois les notifications arrivent avec un léger délai
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">4.</span>
                  <span className="text-base text-anthracite font-sans">
                    Contactez notre support 24/7 via le chat ou à support@monafrica.net
                  </span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-terracotta/5 border border-terracotta/20 rounded-lg">
                <p className="text-sm text-anthracite/80 font-sans">
                  Important : Si le montant a été débité de votre compte mais que vous n'avez pas reçu de confirmation, ne renouvelez pas le paiement. Contactez directement notre support avec votre numéro de transaction.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              to="/tarifs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl group"
            >
              Choisir ma formule
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
              to="/help/moyens-paiement"
              className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group"
            >
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">
                Quels moyens de paiement acceptez-vous ?
              </h3>
              <p className="text-sm text-muted-foreground font-sans">
                Découvrez tous les modes de paiement disponibles.
              </p>
            </Link>
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
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
