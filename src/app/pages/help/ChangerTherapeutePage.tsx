import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ArrowLeft, Users, Heart, ArrowRight, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function ChangerTherapeutePage() {
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
              Puis-je changer de thérapeute ?
            </h1>
            <p className="text-lg text-muted-foreground font-sans">
              Oui, absolument. La relation thérapeutique est au cœur du succès d'un accompagnement. Si le courant ne passe pas, vous êtes libre de changer d'expert à tout moment, sans justification et sans frais.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-8">
              <Heart className="w-8 h-8 text-terracotta" />
              <h2 className="text-3xl font-serif text-anthracite">Pourquoi changer est normal et même encouragé</h2>
            </div>
            <div className="bg-white border border-beige/30 rounded-2xl p-8 mb-8">
              <p className="text-base text-muted-foreground font-sans leading-relaxed mb-6">
                La recherche scientifique montre que la qualité de la relation entre le patient et le thérapeute est LE facteur le plus déterminant dans le succès d'une thérapie. Plus important que la méthode utilisée, plus important que l'expérience du thérapeute.
              </p>
              <p className="text-base text-anthracite font-sans leading-relaxed">
                Il est donc parfaitement normal de ne pas se sentir à l'aise avec le premier expert proposé. En moyenne, 15% de nos membres changent de thérapeute après les 2-3 premières séances. C'est sain et nous le soutenons activement.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-6">
              <Users className="w-8 h-8 text-gold" />
              <h2 className="text-3xl font-serif text-anthracite">Comment procéder</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-white border border-beige/30 rounded-xl p-6">
                <h3 className="text-xl font-serif text-anthracite mb-3">Option 1 : Demander un nouveau matching</h3>
                <p className="text-base text-muted-foreground font-sans leading-relaxed mb-4">
                  Depuis votre tableau de bord, cliquez sur "Changer d'expert" puis "Demander un nouveau matching". Nous affinerons nos recommandations en fonction de votre feedback.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-anthracite font-sans">Nouveau matching en moins de 24h</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-anthracite font-sans">3 nouvelles recommandations personnalisées</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-anthracite font-sans">Critères affinés selon votre retour</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-beige/30 rounded-xl p-6">
                <h3 className="text-xl font-serif text-anthracite mb-3">Option 2 : Choisir directement dans notre réseau</h3>
                <p className="text-base text-muted-foreground font-sans leading-relaxed mb-4">
                  Parcourez librement tous les profils de notre réseau d'experts. Filtrez par spécialité, langue, approche thérapeutique, disponibilités.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-anthracite font-sans">Plus de 150 experts disponibles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-anthracite font-sans">Profils détaillés avec vidéo de présentation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-anthracite font-sans">Avis vérifiés d'autres membres</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-beige/30 rounded-xl p-6">
                <h3 className="text-xl font-serif text-anthracite mb-3">Option 3 : Contacter notre support</h3>
                <p className="text-base text-muted-foreground font-sans leading-relaxed">
                  Nos Spécialistes Dispatch peuvent vous accompagner personnellement dans cette transition. Nous discuterons de ce qui n'a pas fonctionné et trouverons ensemble le bon profil.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-anthracite via-anthracite to-anthracite/90 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <h2 className="text-3xl font-serif mb-4">Aucun frais, aucun jugement</h2>
            <p className="text-lg text-white/80 font-sans leading-relaxed max-w-2xl mx-auto mb-8">
              Changer de thérapeute ne coûte rien et n'affecte pas votre abonnement. Vos séances restantes sont préservées. Votre Passeport Santé (FHIR) est transféré automatiquement au nouvel expert avec votre accord.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                <div className="text-4xl font-serif text-terracotta mb-2">0 €</div>
                <p className="text-sm text-white/80 font-sans">Aucun frais pour changer d'expert</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                <div className="text-4xl font-serif text-gold mb-2">24h</div>
                <p className="text-sm text-white/80 font-sans">Nouveau matching en moins de 24h</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                <div className="text-4xl font-serif text-beige mb-2">100%</div>
                <p className="text-sm text-white/80 font-sans">Continuité de votre suivi garantie</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-gradient-to-br from-terracotta/5 via-beige/10 to-gold/5 border border-beige/30 rounded-2xl p-8">
              <h3 className="text-2xl font-serif text-anthracite mb-4">Conseils pour trouver le bon match</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans">Donnez-vous 2 à 3 séances avant de décider. Le premier rendez-vous peut être timide, c'est normal.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans">Fiez-vous à votre ressenti : vous sentez-vous écouté, compris, en sécurité ?</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans">N'hésitez pas à exprimer vos attentes dès la première séance. Un bon thérapeute accueillera ce feedback positivement.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-terracotta mt-1">•</span>
                  <span className="text-base text-anthracite font-sans">Si après 3 séances le feeling n'est pas là, n'attendez pas. Changer maintenant vous fera gagner du temps et de l'énergie.</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 text-center">
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl group">
                Parler à un Spécialiste Dispatch
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
            <Link to="/help/smart-matching" className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group">
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">
                Comment fonctionne le Smart Matching ?
              </h3>
              <p className="text-sm text-muted-foreground font-sans">Comprenez notre algorithme de matching intelligent.</p>
            </Link>
            <Link to="/help/seance-en-ligne" className="p-6 bg-white hover:bg-beige/5 border border-beige/30 rounded-xl transition-all duration-200 group">
              <h3 className="text-lg font-serif text-anthracite group-hover:text-terracotta transition-colors mb-2">
                Comment se déroule une séance en ligne ?
              </h3>
              <p className="text-sm text-muted-foreground font-sans">Tout savoir sur le déroulement des consultations.</p>
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
