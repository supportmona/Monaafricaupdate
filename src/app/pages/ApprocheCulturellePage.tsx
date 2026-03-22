import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { Heart, Users, Globe, Brain, Shield, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export default function ApprocheCulturellePage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-beige/30 via-white to-beige/10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6"
          >
            <span className="text-xs font-sans font-bold text-terracotta uppercase tracking-wider">
              Approche culturelle
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-anthracite mb-6 tracking-tight leading-tight"
          >
            Ancré dans nos <span className="italic">réalités</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-anthracite/70 font-sans max-w-3xl mx-auto leading-relaxed"
          >
            M.O.N.A reconnaît que la santé mentale ne peut être standardisée. 
            Notre approche respecte les nuances culturelles, familiales et spirituelles 
            qui façonnent l'identité africaine.
          </motion.p>
        </div>
      </section>

      {/* Comprendre les réalités africaines */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-6">
              <span className="text-xs font-sans font-bold text-gold uppercase tracking-wider">
                Nos fondations
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
              Comprendre les <span className="italic">réalités</span> africaines
            </h2>
            <p className="text-lg text-anthracite/70 font-sans max-w-3xl mx-auto leading-relaxed">
              Notre plateforme est conçue pour naviguer les complexités culturelles 
              et sociales spécifiques au continent africain.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-beige/30 to-beige/10 p-8 rounded-2xl border border-beige/30">
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="text-xl font-serif text-anthracite mb-3">Briser la stigmatisation</h3>
              <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                Dans de nombreuses communautés africaines, parler de santé mentale reste 
                tabou. M.O.N.A offre un espace sûr, confidentiel et sans jugement pour 
                amorcer cette conversation essentielle.
              </p>
            </div>

            <div className="bg-gradient-to-br from-beige/30 to-beige/10 p-8 rounded-2xl border border-beige/30">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-xl font-serif text-anthracite mb-3">L'importance de la communauté</h3>
              <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                Nous comprenons que la famille et la communauté jouent un rôle central. 
                Nos programmes incluent des options de thérapie familiale et des groupes 
                de soutien communautaires.
              </p>
            </div>

            <div className="bg-gradient-to-br from-beige/30 to-beige/10 p-8 rounded-2xl border border-beige/30">
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="text-xl font-serif text-anthracite mb-3">Spiritualité et bien-être</h3>
              <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                La dimension spirituelle est intégrée dans notre approche holistique, 
                respectant les croyances et pratiques qui guident nos membres au quotidien.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experts qui vous comprennent */}
      <section className="py-20 px-4 bg-gradient-to-br from-gold/5 via-beige/10 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
                <span className="text-xs font-sans font-bold text-terracotta uppercase tracking-wider">
                  Expertise locale
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
                Des experts qui <span className="italic">vous comprennent</span>
              </h2>
              <p className="text-lg text-anthracite/70 font-sans leading-relaxed mb-6">
                Notre réseau d'experts est composé de professionnels africains et de la 
                diaspora qui maîtrisent les nuances culturelles, linguistiques et sociales 
                de chaque marché.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <span className="text-anthracite/80 font-sans text-sm">
                    Consultations disponibles en français, anglais, lingala, wolof et autres langues locales
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <span className="text-anthracite/80 font-sans text-sm">
                    Compréhension approfondie des dynamiques familiales africaines
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <span className="text-anthracite/80 font-sans text-sm">
                    Respect des valeurs traditionnelles et modernes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <span className="text-anthracite/80 font-sans text-sm">
                    Formation continue sur les enjeux culturels spécifiques
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-beige/30">
              <Brain className="w-16 h-16 text-gold mx-auto mb-6" />
              <h3 className="text-2xl font-serif text-anthracite text-center mb-4">
                Matching culturellement adapté
              </h3>
              <p className="text-anthracite/70 font-sans text-center leading-relaxed mb-6">
                Notre algorithme Smart Matching prend en compte non seulement vos 
                symptômes, mais aussi votre contexte culturel, linguistique et familial 
                pour vous jumeler à l'expert le plus adapté.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-beige/20">
                  <span className="text-sm font-sans text-anthracite/70">Langue préférée</span>
                  <span className="text-sm font-sans font-semibold text-anthracite">Match 100%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-beige/20">
                  <span className="text-sm font-sans text-anthracite/70">Contexte familial</span>
                  <span className="text-sm font-sans font-semibold text-anthracite">Analysé</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-beige/20">
                  <span className="text-sm font-sans text-anthracite/70">Background culturel</span>
                  <span className="text-sm font-sans font-semibold text-anthracite">Priorisé</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm font-sans text-anthracite/70">Sensibilités spirituelles</span>
                  <span className="text-sm font-sans font-semibold text-anthracite">Respectées</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Défis spécifiques abordés */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-6">
              <span className="text-xs font-sans font-bold text-gold uppercase tracking-wider">
                Défis locaux
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
              Des solutions pour vos <span className="italic">défis quotidiens</span>
            </h2>
            <p className="text-lg text-anthracite/70 font-sans max-w-3xl mx-auto leading-relaxed">
              M.O.N.A s'adapte aux réalités infrastructurelles, économiques et sociales 
              du continent africain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-terracotta/5 to-terracotta/10 p-6 rounded-xl border border-terracotta/20">
              <h3 className="text-lg font-serif text-anthracite mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-terracotta" />
                Accessibilité géographique
              </h3>
              <p className="text-sm text-anthracite/70 font-sans leading-relaxed">
                Téléconsultations disponibles pour contourner le trafic intense de Kinshasa, 
                Abidjan ou Dakar. Plus besoin de perdre 3 heures dans les embouteillages.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gold/5 to-gold/10 p-6 rounded-xl border border-gold/20">
              <h3 className="text-lg font-serif text-anthracite mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold" />
                Confidentialité renforcée
              </h3>
              <p className="text-sm text-anthracite/70 font-sans leading-relaxed">
                Espaces de consultation privés et sécurisés. Vos sessions restent 
                totalement confidentielles, protégées par le RGPD africain.
              </p>
            </div>

            <div className="bg-gradient-to-br from-terracotta/5 to-terracotta/10 p-6 rounded-xl border border-terracotta/20">
              <h3 className="text-lg font-serif text-anthracite mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-terracotta" />
                Pression sociale
              </h3>
              <p className="text-sm text-anthracite/70 font-sans leading-relaxed">
                Accompagnement pour naviguer les attentes familiales, pressions 
                communautaires et obligations sociales tout en préservant votre bien-être.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gold/5 to-gold/10 p-6 rounded-xl border border-gold/20">
              <h3 className="text-lg font-serif text-anthracite mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-gold" />
                Flexibilité financière
              </h3>
              <p className="text-sm text-anthracite/70 font-sans leading-relaxed">
                Paiements via Orange Money, M-Pesa, MTN Mobile Money. Options de 
                paiement échelonné pour rendre nos services accessibles à tous.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-terracotta via-terracotta to-terracotta/90 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
            Un soin qui vous <span className="italic">ressemble</span>
          </h2>
          <p className="text-xl text-white/90 font-sans mb-8 leading-relaxed">
            Rejoignez une plateforme qui respecte votre identité culturelle tout en 
            vous offrant les meilleurs standards de santé mentale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/onboarding"
              className="px-8 py-4 bg-white text-terracotta rounded-full hover:bg-white/90 transition-all duration-200 font-sans font-semibold shadow-xl"
            >
              Commencer mon parcours
            </a>
            <a
              href="/experts"
              className="px-8 py-4 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all duration-200 font-sans font-semibold shadow-xl"
            >
              Découvrir nos experts
            </a>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
