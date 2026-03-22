import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ArrowLeft, WifiOff, BookOpen, Heart, Activity, MessageSquare, Calendar, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function FonctionnalitesOfflinePage() {
  const features = [
    { icon: BookOpen, title: "Passeport Santé (FHIR)", desc: "Consultez tout votre historique médical, notes de séances, diagnostics et recommandations." },
    { icon: Heart, title: "Exercices de bien-être", desc: "Méditations guidées, exercices de respiration, techniques de relaxation téléchargés." },
    { icon: Activity, title: "Journal personnel", desc: "Écrivez dans votre journal de bord, suivez votre humeur, vos émotions et vos progrès." },
    { icon: MessageSquare, title: "Messages (lecture)", desc: "Lisez vos anciennes conversations avec votre thérapeute (impossible d'en envoyer de nouveaux offline)." },
    { icon: BookOpen, title: "Bibliothèque", desc: "Accédez aux articles, guides et ressources que vous avez téléchargés au préalable." },
    { icon: Calendar, title: "Calendrier", desc: "Consultez vos rendez-vous à venir (impossible d'en réserver de nouveaux offline)." }
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
            <div className="inline-block px-4 py-2 bg-beige/20 border border-beige/30 rounded-full mb-6">
              <span className="text-sm text-beige font-sans font-medium">Application Mobile</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif text-anthracite mb-6">
              Quelles fonctionnalités offline ?
            </h1>
            <p className="text-lg text-muted-foreground font-sans">
              M.O.N.A reste fonctionnelle même sans connexion internet. Découvrez tout ce que vous pouvez faire hors ligne pour prendre soin de votre bien-être mental partout.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-8">
              <WifiOff className="w-10 h-10 text-terracotta" />
              <h2 className="text-3xl font-serif text-anthracite">Fonctionnalités disponibles sans connexion</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: idx * 0.1 }} 
                  className="bg-white border border-beige/30 rounded-xl p-6 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-beige/10 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-beige" />
                  </div>
                  <h3 className="text-xl font-serif text-anthracite mb-2">{feature.title}</h3>
                  <p className="text-base text-muted-foreground font-sans">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-gradient-to-br from-gold/10 via-beige/10 to-terracotta/5 border border-gold/30 rounded-2xl p-8">
              <h3 className="text-2xl font-serif text-anthracite mb-4">Comment préparer votre usage offline</h3>
              <p className="text-base text-muted-foreground font-sans leading-relaxed mb-6">
                Pour profiter au maximum des fonctionnalités hors ligne, voici ce que nous recommandons :
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">1.</span>
                  <span className="text-base text-anthracite font-sans">
                    <strong>Téléchargez vos favoris :</strong> Depuis la Bibliothèque, marquez vos articles préférés pour un téléchargement automatique
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">2.</span>
                  <span className="text-base text-anthracite font-sans">
                    <strong>Synchronisez régulièrement :</strong> Ouvrez l'app en Wi-Fi au moins une fois par semaine pour mettre à jour vos données
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">3.</span>
                  <span className="text-base text-anthracite font-sans">
                    <strong>Activez le téléchargement auto :</strong> Dans Paramètres {'>'} Mode Offline, activez la synchronisation automatique en Wi-Fi
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">4.</span>
                  <span className="text-base text-anthracite font-sans">
                    <strong>Gérez votre espace :</strong> Les contenus offline prennent environ 50-150 MB selon vos téléchargements
                  </span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-terracotta/5 via-beige/10 to-gold/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-serif text-anthracite mb-6">Ce qui nécessite une connexion</h2>
            <div className="bg-white border border-beige/30 rounded-2xl p-8">
              <p className="text-base text-muted-foreground font-sans mb-6">
                Certaines fonctionnalités ne peuvent fonctionner qu'avec une connexion internet :
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-anthracite/40 mt-1">•</span>
                  <span className="text-base text-anthracite font-sans">
                    Téléconsultations vidéo (nécessite au minimum une 3G stable)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-anthracite/40 mt-1">•</span>
                  <span className="text-base text-anthracite font-sans">
                    Envoyer de nouveaux messages à votre thérapeute
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-anthracite/40 mt-1">•</span>
                  <span className="text-base text-anthracite font-sans">
                    Réserver ou modifier un rendez-vous
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-anthracite/40 mt-1">•</span>
                  <span className="text-base text-anthracite font-sans">
                    Accéder aux nouveaux contenus de la Bibliothèque
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-anthracite/40 mt-1">•</span>
                  <span className="text-base text-anthracite font-sans">
                    Synchroniser les modifications faites offline vers le cloud
                  </span>
                </li>
              </ul>
              <div className="mt-6 p-4 bg-beige/10 rounded-lg">
                <p className="text-sm text-anthracite/80 font-sans">
                  Les actions effectuées offline (journal, notes) se synchroniseront automatiquement dès que vous retrouverez une connexion.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-gradient-to-br from-anthracite/5 via-beige/10 to-gold/5 border border-beige/30 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-serif text-anthracite mb-4">Conçu pour l'Afrique</h3>
              <p className="text-base text-muted-foreground font-sans mb-6 max-w-2xl mx-auto">
                Nous savons que la connectivité peut être instable. C'est pourquoi M.O.N.A est optimisée pour fonctionner avec une bande passante minimale et offrir une expérience fluide même hors ligne.
              </p>
              <Link to="/help/telecharger-app" className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl group">
                Télécharger l'application
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
            <Link to="/help/fonctionnement-offline" className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group">
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">
                L'app fonctionne-t-elle hors ligne ?
              </h3>
              <p className="text-sm text-muted-foreground font-sans">
                Vue d'ensemble du mode offline de M.O.N.A.
              </p>
            </Link>
            <Link to="/help/telecharger-app" className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group">
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">
                Comment télécharger l'application ?
              </h3>
              <p className="text-sm text-muted-foreground font-sans">
                Installez M.O.N.A sur votre téléphone.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
