import NavigationBar from "../components/NavigationBar";
import FooterSection from "../components/FooterSection";
import { Link } from "react-router";
import { Users, Target, TrendingUp, Shield, QrCode, CreditCard, Globe } from "lucide-react";
import { motion } from "motion/react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-beige/30 via-white to-beige/10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-6"
          >
            <span className="text-xs font-sans font-bold text-gold uppercase tracking-wider">
              Notre histoire
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-anthracite mb-6 tracking-tight leading-tight"
          >
            Une <span className="italic">vision</span> pour l'Afrique
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-anthracite/70 font-sans max-w-3xl mx-auto leading-relaxed"
          >
            M.O.N.A combine les modèles d'excellence en santé mentale avec une approche 
            culturellement adaptée aux réalités africaines.
          </motion.p>
        </div>
      </section>

      {/* Le Mot de la Fondatrice */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
              <span className="text-xs font-sans font-bold text-terracotta uppercase tracking-wider">
                Le Mot de la Fondatrice
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-4 leading-tight">
              Eunice Obambi
            </h2>
            <p className="text-xl md:text-2xl text-anthracite/80 font-serif italic">
              « L'excellence mentale n'est plus un luxe, c'est votre moteur. »
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-br from-beige/20 to-beige/5 p-8 md:p-12 rounded-2xl border border-beige/30">
              <p className="text-lg text-anthracite/80 font-sans leading-relaxed mb-6">
                Originaire du Congo et formée entre Montréal et Ottawa, Eunice Obambi incarne le pont entre 
                l'innovation technologique de pointe et les besoins profonds du continent africain. 
                Son parcours au Canada lui a permis d'observer comment les leaders de la télémédecine 
                ont révolutionné l'accès aux soins par la simplicité et la coordination.
              </p>
              
              <p className="text-lg text-anthracite/80 font-sans leading-relaxed mb-6">
                Convaincue que l'Afrique mérite ce même standard d'excellence, elle a fondé 
                <span className="font-semibold text-anthracite"> M.O.N.A (Mieux-être, Optimisation & Neuro-Apaisement)</span>. 
                Sa mission ? Créer une plateforme où excellence clinique et compréhension culturelle africaine 
                se rencontrent pour offrir un accompagnement mental qui transforme réellement les vies.
              </p>
              
              <p className="text-lg text-anthracite/80 font-sans leading-relaxed">
                Aujourd'hui, M.O.N.A accompagne les leaders organisationnels et les membres à travers l'Afrique 
                vers une nouvelle ère de performance durable et de sérénité authentique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi M.O.N.A */}
      <section className="py-20 px-4 bg-gradient-to-br from-gold/5 via-beige/10 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-6">
                <span className="text-xs font-sans font-bold text-gold uppercase tracking-wider">
                  Notre Raison d'être
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
                Transformer l'accès à la <span className="italic">santé mentale</span> en Afrique
              </h2>
              <p className="text-lg text-anthracite/70 font-sans leading-relaxed mb-6">
                Pendant trop longtemps, l'excellence en santé mentale est restée inaccessible sur le continent : 
                experts rares, stigmatisation omniprésente, logistique compliquée. M.O.N.A brise ces barrières 
                grâce à une plateforme qui coordonne tout en un seul point d'accès.
              </p>
              <p className="text-lg text-anthracite/70 font-sans leading-relaxed">
                De la téléconsultation avec votre psychologue au suivi corporel avec votre nutritionniste, 
                en passant par les retraites wellness du Cercle : tout est pensé pour votre équilibre global.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-beige/30">
              <h3 className="text-2xl font-serif text-anthracite mb-6">Pourquoi "M.O.N.A" ?</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-serif text-terracotta font-bold">M</span>
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-anthracite mb-1">Mieux-être</h4>
                    <p className="text-sm text-anthracite/70">
                      Placer votre santé mentale au centre de votre épanouissement
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-serif text-gold font-bold">O</span>
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-anthracite mb-1">Optimisation</h4>
                    <p className="text-sm text-anthracite/70">
                      Maximiser votre potentiel grâce à un suivi personnalisé
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-serif text-terracotta font-bold">N</span>
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-anthracite mb-1">Neuro-Apaisement</h4>
                    <p className="text-sm text-anthracite/70">
                      Retrouver l'équilibre mental et la sérénité intérieure
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-serif text-gold font-bold">A</span>
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold text-anthracite mb-1">Afrique</h4>
                    <p className="text-sm text-anthracite/70">
                      Conçu pour le continent, par des visionnaires africains
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment nous le faisons */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
              <span className="text-xs font-sans font-bold text-terracotta uppercase tracking-wider">
                Notre Approche
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
              Standards internationaux, <span className="italic\">réalités</span> africaines
            </h2>
            <p className="text-lg text-anthracite/70 font-sans max-w-3xl mx-auto leading-relaxed">
              Nous combinons ce qui marche ailleurs avec une compréhension profonde des défis locaux.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-beige/30 to-beige/10 p-8 rounded-2xl border border-beige/30">
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="text-xl font-serif text-anthracite mb-3">Accessibilité totale</h3>
              <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                Téléconsultations flexibles, technologie Offline-First, intégration avec Orange Money, 
                M-Pesa et MTN Mobile Money pour contourner les défis logistiques et financiers.
              </p>
            </div>

            <div className="bg-gradient-to-br from-beige/30 to-beige/10 p-8 rounded-2xl border border-beige/30">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-xl font-serif text-anthracite mb-3">Confidentialité absolue</h3>
              <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                Face à la stigmatisation, nous garantissons une discrétion totale : espaces privés sécurisés, 
                chiffrement de bout en bout, et accès personnalisé via carte NFC.
              </p>
            </div>

            <div className="bg-gradient-to-br from-beige/30 to-beige/10 p-8 rounded-2xl border border-beige/30">
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="text-xl font-serif text-anthracite mb-3">Experts qualifiés</h3>
              <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                Psychologues, psychiatres, coachs et experts corporels rigoureusement sélectionnés. 
                Notre Smart Matching vous connecte à votre expert idéal en moins de 24h.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* La Promesse M.O.N.A */}
      <section className="py-20 px-4 bg-gradient-to-br from-anthracite via-anthracite to-anthracite/90 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 bg-gold/20 border border-gold/30 rounded-full mb-6">
            <span className="text-xs font-sans font-bold text-gold uppercase tracking-wider">
              Notre Engagement
            </span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
            Une expérience <span className="italic">coordonnée</span>, du premier clic au suivi long terme
          </h2>
          
          <p className="text-xl text-white/80 font-sans mb-12 leading-relaxed">
            Chaque aspect de votre parcours est pensé pour votre réussite et votre sérénité.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl text-left">
              <div className="w-12 h-12 bg-terracotta/20 rounded-full flex items-center justify-center mb-4">
                <QrCode className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="font-sans font-semibold text-lg mb-2">Passeport Santé Digital</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Vos données de santé centralisées au format FHIR : historique, consultations, 
                parcours de soins accessible partout, même offline.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl text-left">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-sans font-semibold text-lg mb-2">Mental Score évolutif</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Suivez votre progression avec un score personnalisé qui évolue avec vos consultations, 
                activités et objectifs de bien-être.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl text-left">
              <div className="w-12 h-12 bg-terracotta/20 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="font-sans font-semibold text-lg mb-2">Écosystème intégré</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Téléconsultations + Réseau Le Cercle + MindPass Escapes : tout coordonné 
                pour votre équilibre mental et corporel.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl text-left">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-sans font-semibold text-lg mb-2">Carte NFC Premium</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Accédez à votre profil santé en un tap, gérez vos rendez-vous et bénéficiez 
                d'avantages exclusifs dans Le Cercle.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <Link
              to="/onboarding"
              className="inline-block px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-xl"
            >
              Commencer mon parcours
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}