import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ArrowLeft, Video, Clock, CheckCircle, Wifi, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function SeanceEnLignePage() {
  const beforeSession = [
    "Vous recevrez un lien de visioconférence sécurisé par email et SMS 1h avant votre séance",
    "Assurez-vous d'avoir une connexion internet stable (4G ou Wi-Fi)",
    "Trouvez un endroit calme et privé où vous ne serez pas dérangé",
    "Préparez de quoi noter si vous le souhaitez",
    "Testez votre caméra et micro 5 minutes avant le début"
  ];

  const duringSession = [
    "Cliquez sur le lien reçu quelques minutes avant l'heure prévue",
    "Vous entrerez dans une salle d'attente virtuelle sécurisée",
    "Votre thérapeute vous accueillera à l'heure exacte",
    "La séance dure 50 minutes, comme une consultation en cabinet",
    "Tout ce qui se dit reste strictement confidentiel et chiffré de bout en bout",
    "Vous pouvez activer ou désactiver votre caméra selon votre confort"
  ];

  const afterSession = [
    "Des notes thérapeutiques sont automatiquement ajoutées à votre Passeport Santé (FHIR)",
    "Vous recevez un résumé et les recommandations de votre expert par email",
    "Vous pouvez envoyer des messages à votre thérapeute via notre messagerie sécurisée",
    "La prochaine séance peut être réservée directement depuis votre tableau de bord"
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <section className="pt-32 pb-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/help" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-terracotta transition-colors font-sans">
            <ArrowLeft className="w-4 h-4" />
            Retour au Centre d'Aide
          </Link>
        </div>
      </section>

      <section className="pb-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-block px-4 py-2 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
              <span className="text-sm text-terracotta font-sans font-medium">Consultations</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif text-anthracite mb-6">
              Comment se déroule une séance en ligne ?
            </h1>
            <p className="text-lg text-muted-foreground font-sans">
              Les consultations en ligne offrent la même qualité qu'une séance en cabinet, avec plus de flexibilité. Voici tout ce que vous devez savoir pour bien vous préparer.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-6">
              <Clock className="w-8 h-8 text-terracotta" />
              <h2 className="text-3xl font-serif text-anthracite">Avant la séance</h2>
            </div>
            <div className="bg-white border border-beige/30 rounded-2xl p-8">
              <ul className="space-y-4">
                {beforeSession.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                    <span className="text-base text-anthracite font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-6">
              <Video className="w-8 h-8 text-gold" />
              <h2 className="text-3xl font-serif text-anthracite">Pendant la séance</h2>
            </div>
            <div className="bg-white border border-beige/30 rounded-2xl p-8">
              <ul className="space-y-4">
                {duringSession.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-base text-anthracite font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-6">
              <CheckCircle className="w-8 h-8 text-anthracite" />
              <h2 className="text-3xl font-serif text-anthracite">Après la séance</h2>
            </div>
            <div className="bg-white border border-beige/30 rounded-2xl p-8">
              <ul className="space-y-4">
                {afterSession.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-anthracite flex-shrink-0 mt-0.5" />
                    <span className="text-base text-anthracite font-sans">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-gradient-to-br from-terracotta/5 via-beige/10 to-gold/5 border border-beige/30 rounded-2xl p-8">
              <div className="flex items-start gap-4 mb-6">
                <Wifi className="w-8 h-8 text-terracotta flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-serif text-anthracite mb-3">Problème de connexion ?</h3>
                  <p className="text-base text-muted-foreground font-sans leading-relaxed mb-4">
                    Si vous rencontrez un problème technique pendant la séance :
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <span className="text-terracotta mt-1">•</span>
                      <span className="text-sm text-anthracite font-sans">Vérifiez votre connexion internet et rechargez la page</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-terracotta mt-1">•</span>
                      <span className="text-sm text-anthracite font-sans">Contactez immédiatement le support via le chat (icône en bas à droite)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-terracotta mt-1">•</span>
                      <span className="text-sm text-anthracite font-sans">Si la séance est interrompue plus de 10 minutes, elle sera automatiquement reportée sans frais</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Link to="/onboarding" className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl group">
                Réserver ma première séance
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif text-anthracite mb-6">Articles associés</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/help/premiere-consultation" className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group">
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">
                Comment réserver ma première consultation ?
              </h3>
              <p className="text-sm text-muted-foreground font-sans">Réservez votre première séance en quelques clics.</p>
            </Link>
            <Link to="/help/urgence" className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group">
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">
                Que faire en cas d'urgence ?
              </h3>
              <p className="text-sm text-muted-foreground font-sans">Trouvez de l'aide immédiate 24/7.</p>
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
