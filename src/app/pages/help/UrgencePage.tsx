import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ArrowLeft, AlertTriangle, Phone, MessageSquare, Hospital, Clock } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function UrgencePage() {
  const emergencyNumbers = [
    { country: "Côte d'Ivoire", number: "185", service: "Pompiers & Urgences" },
    { country: "Sénégal", number: "15 ou 800 00 50 50", service: "SAMU" },
    { country: "RDC (Kinshasa)", number: "+243 81 055 5555", service: "SAMU" },
    { country: "Cameroun", number: "119", service: "Urgences Médicales" },
    { country: "Mali", number: "15", service: "SAMU" },
    { country: "Bénin", number: "166", service: "Urgences" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <section className="pt-32 pb-8 bg-gradient-to-b from-red-50 to-white">
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
            <div className="inline-block px-4 py-2 bg-red-100 border border-red-200 rounded-full mb-6">
              <span className="text-sm text-red-700 font-sans font-medium">Urgence</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif text-anthracite mb-6">
              Que faire en cas d'urgence ?
            </h1>
            <p className="text-lg text-muted-foreground font-sans">
              M.O.N.A n'est pas un service d'urgence psychiatrique. Si vous ou quelqu'un de votre entourage êtes en détresse immédiate, suivez ces recommandations.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-red-50/30 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 mb-12">
              <div className="flex items-start gap-4 mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-serif text-anthracite mb-3">Danger immédiat : appelez les urgences</h2>
                  <p className="text-base text-anthracite font-sans leading-relaxed mb-4">
                    Si vous êtes en danger immédiat (pensées suicidaires avec plan précis, crise psychotique, violence imminente), contactez immédiatement les services d'urgence de votre pays ou rendez-vous aux urgences psychiatriques de l'hôpital le plus proche.
                  </p>
                  <p className="text-sm text-red-700 font-sans font-semibold">
                    Ne restez pas seul. Appelez un proche ou les secours maintenant.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-6">
              <Phone className="w-8 h-8 text-terracotta" />
              <h2 className="text-3xl font-serif text-anthracite">Numéros d'urgence par pays</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {emergencyNumbers.map((item, idx) => (
                <div key={idx} className="bg-white border border-beige/30 rounded-xl p-6">
                  <h3 className="text-lg font-serif text-anthracite mb-2">{item.country}</h3>
                  <div className="text-2xl font-serif text-terracotta mb-1">{item.number}</div>
                  <p className="text-sm text-muted-foreground font-sans">{item.service}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-6">
              <MessageSquare className="w-8 h-8 text-gold" />
              <h2 className="text-3xl font-serif text-anthracite">Lignes d'écoute spécialisées</h2>
            </div>
            <div className="space-y-4 mb-12">
              <div className="bg-gradient-to-br from-gold/10 via-beige/10 to-terracotta/5 border border-gold/30 rounded-xl p-6">
                <h3 className="text-xl font-serif text-anthracite mb-3">SOS Écoute (Côte d'Ivoire)</h3>
                <p className="text-base text-anthracite font-sans mb-2">+225 27 21 25 69 00</p>
                <p className="text-sm text-muted-foreground font-sans">Écoute psychologique 24/7 pour prévention du suicide</p>
              </div>
              <div className="bg-gradient-to-br from-gold/10 via-beige/10 to-terracotta/5 border border-gold/30 rounded-xl p-6">
                <h3 className="text-xl font-serif text-anthracite mb-3">SOS Détresse (Sénégal)</h3>
                <p className="text-base text-anthracite font-sans mb-2">800 00 12 34</p>
                <p className="text-sm text-muted-foreground font-sans">Service d'écoute et de soutien psychologique gratuit</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-6">
              <Hospital className="w-8 h-8 text-anthracite" />
              <h2 className="text-3xl font-serif text-anthracite">Hôpitaux avec service psychiatrique</h2>
            </div>
            <div className="bg-white border border-beige/30 rounded-2xl p-8 mb-12">
              <p className="text-base text-muted-foreground font-sans leading-relaxed mb-6">
                Voici quelques hôpitaux de référence avec service psychiatrique d'urgence dans les principales villes :
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans"><strong>Abidjan :</strong> CHU de Cocody, CHU de Yopougon</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans"><strong>Dakar :</strong> Hôpital Fann (Service de psychiatrie), Hôpital Principal de Dakar</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans"><strong>Kinshasa :</strong> Cliniques Ngaliema, Hôpital du Cinquantenaire</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans"><strong>Yaoundé :</strong> Hôpital Central de Yaoundé</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-terracotta/5 via-beige/10 to-gold/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-6">
              <Clock className="w-8 h-8 text-terracotta" />
              <h2 className="text-3xl font-serif text-anthracite">Et M.O.N.A dans tout ça ?</h2>
            </div>
            <div className="bg-white border border-beige/30 rounded-2xl p-8">
              <p className="text-base text-anthracite font-sans leading-relaxed mb-6">
                M.O.N.A est une plateforme de consultation en santé mentale pour un accompagnement régulier et préventif. Nous ne sommes pas équipés pour gérer les urgences psychiatriques qui nécessitent une intervention immédiate.
              </p>
              <h3 className="text-xl font-serif text-anthracite mb-4">Cependant, nous pouvons vous aider dans ces situations :</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans"><strong>Détresse non urgente :</strong> Si vous traversez une mauvaise période mais n'êtes pas en danger immédiat, contactez votre thérapeute M.O.N.A via la messagerie sécurisée. Il vous répondra sous 24h.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans"><strong>Séance d'urgence :</strong> Si vous êtes membre Premium, vous avez accès à des créneaux d'urgence sous 48h maximum.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans"><strong>Après une crise :</strong> Une fois la situation stabilisée par les urgences, nos experts peuvent assurer votre suivi post-crise.</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-gradient-to-br from-anthracite/5 via-beige/10 to-gold/5 border border-beige/30 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-serif text-anthracite mb-4">Prendre soin de vous est une priorité</h3>
              <p className="text-base text-muted-foreground font-sans mb-6 max-w-2xl mx-auto">
                Si vous ressentez fréquemment des pensées sombres ou de la détresse, un accompagnement régulier avec M.O.N.A peut vous aider à prévenir les crises futures.
              </p>
              <Link to="/onboarding" className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl">
                Commencer mon suivi
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-serif text-anthracite mb-6">Articles associés</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link to="/help/seance-en-ligne" className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group">
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">
                Comment se déroule une séance en ligne ?
              </h3>
              <p className="text-sm text-muted-foreground font-sans">Tout savoir sur vos consultations M.O.N.A.</p>
            </Link>
            <Link to="/help/premiere-consultation" className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group">
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">
                Comment réserver ma première consultation ?
              </h3>
              <p className="text-sm text-muted-foreground font-sans">Commencez votre parcours en quelques clics.</p>
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
