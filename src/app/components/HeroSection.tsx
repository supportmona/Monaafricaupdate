import { ArrowRight, Play, User, Sparkles, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 bg-[rgb(245,241,237)]"> {/* Beige clair au lieu de blanc */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Colonne Gauche - Contenu */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            {/* Badge avec ligne comme Dialogue */}
            <div className="mb-8">
              <p className="text-[11px] sm:text-xs lg:text-sm tracking-[0.2em] uppercase text-foreground font-sans font-medium mb-3">
                LA SANTÉ INTÉGRÉE, C'EST LE STANDARD. EXIGEZ L'EXCELLENCE.
              </p>
              <div className="w-32 h-[2px] bg-foreground" />
            </div>

            {/* Titre principal - Très grand comme Dialogue */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-serif text-foreground mb-6 leading-[1.1]">
              Le bien-être total que mérite <span className="italic">chaque membre</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-base sm:text-lg lg:text-xl text-foreground/80 font-sans mb-10 leading-relaxed max-w-xl">
              La plateforme M.O.N.A combine l'excellence clinique avec une approche culturellement adaptée pour l'Afrique francophone. Smart Matching, Passeport Santé FHIR et infrastructure Offline-First.
            </p>

            {/* CTAs - Style Dialogue (noir + texte avec flèche) */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link
                to="/reserver"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background rounded-full hover:bg-foreground/90 transition-all duration-200 font-sans font-semibold text-base"
              >
                Réserver votre consultation gratuite
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/experts"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-foreground text-foreground rounded-full hover:bg-foreground hover:text-background transition-all duration-200 font-sans font-semibold text-base"
              >
                Découvrir nos experts
              </Link>
            </div>
          </motion.div>

          {/* Colonne Droite - Mockup App */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Mockup principal */}
            <div className="relative w-full max-w-md mx-auto">
              {/* Cadre du téléphone */}
              <div className="relative bg-white rounded-[3rem] shadow-2xl border-8 border-anthracite p-4">
                {/* Encoche */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-anthracite rounded-b-3xl z-20" />
                
                {/* Écran de l'app */}
                <div className="relative bg-background rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                  {/* Header de l'app */}
                  <div className="bg-white px-6 py-6 border-b border-beige/20">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-serif text-anthracite">M.O.N.A</h2>
                      <div className="w-10 h-10 rounded-full bg-beige/50 flex items-center justify-center">
                        <User className="w-5 h-5 text-anthracite" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-sans">Bienvenue</p>
                    <p className="text-2xl font-serif text-anthracite mt-1">Amara Diallo</p>
                  </div>

                  {/* Score Mental Card */}
                  <div className="px-6 py-6">
                    <div className="bg-gradient-to-br from-terracotta to-terracotta/80 rounded-2xl p-6 text-white shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-sans opacity-90">Votre Score Mental</span>
                        <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-sans">Aujourd'hui</span>
                      </div>
                      <div className="text-5xl font-serif mb-2">--/100</div>
                      <div className="text-sm opacity-90">Commencez votre évaluation</div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <div className="bg-white rounded-xl p-4 border border-beige/20 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                          <Sparkles className="w-5 h-5 text-gold" />
                        </div>
                        <div className="text-sm font-sans text-anthracite font-medium">Méditation</div>
                        <div className="text-xs text-muted-foreground font-sans">Guidée</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-beige/20 shadow-sm">
                        <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center mb-3">
                          <MessageCircle className="w-5 h-5 text-terracotta" />
                        </div>
                        <div className="text-sm font-sans text-anthracite font-medium">Consultation</div>
                        <div className="text-xs text-muted-foreground font-sans">Réserver</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Éléments décoratifs subtils */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 w-20 h-20 bg-gold/10 rounded-full backdrop-blur-sm"
              />
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-terracotta/10 rounded-full backdrop-blur-sm"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}