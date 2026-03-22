import { motion } from "motion/react";
import { Award, Shield, Sparkles, Wifi } from "lucide-react";
import { Link } from "react-router";

export default function NFCCardSection() {
  const cardFeatures = [
    {
      icon: Award,
      title: "Design Premium",
      description: "Carte en métal brossé or avec gravure personnalisée",
    },
    {
      icon: Wifi,
      title: "Technologie NFC",
      description: "Accès instantané à vos privilèges d'un simple geste",
    },
    {
      icon: Shield,
      title: "Sécurité Avancée",
      description: "Puce cryptée et authentification biométrique",
    },
    {
      icon: Sparkles,
      title: "Statut Exclusif",
      description: "Reconnaissance immédiate dans notre réseau partenaire",
    },
  ];

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-[#D4C5B9]"> {/* Beige foncé */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left Side - Card Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            {/* Card Mock avec effet 3D réaliste */}
            <div className="relative perspective-1000">
              {/* Ombre de la carte */}
              <div className="absolute inset-0 bg-black/30 blur-2xl transform translate-y-8 scale-95 rounded-2xl" />
              
              {/* La carte elle-même */}
              <motion.div 
                whileHover={{ y: -8, rotateX: 5, rotateY: -5 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[1.586/1] bg-gradient-to-br from-[#2A2A2A] via-[#1A1A1A] to-[#0A0A0A] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-6 sm:p-8"
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Effet de reflet métallique */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 60%, transparent 100%)',
                  }}
                />
                
                {/* Texture métal brossé */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                  }}
                />

                {/* Border doré subtil */}
                <div className="absolute inset-0 rounded-2xl border border-[#A68B6F]/20" />

                {/* Card Details */}
                <div className="relative z-10 h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      {/* Logo M.O.N.A en haut */}
                      <div>
                        <p className="text-3xl sm:text-4xl font-serif tracking-wide text-white mb-1">
                          M.O.N.A
                        </p>
                        <p className="text-[10px] text-[#D4C5B9] font-sans tracking-[0.25em] uppercase">
                          Cercle Prestige
                        </p>
                      </div>
                      
                      {/* Logo badge avec effet doré */}
                      <div 
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #D4C5B9 0%, #A68B6F 50%, #8B7355 100%)',
                          boxShadow: '0 4px 12px rgba(166, 139, 111, 0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                        }}
                      >
                        <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-[#1A1A1A] relative z-10" />
                        {/* Effet de brillance */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Section membre */}
                    <div className="mb-6">
                      <div className="inline-block px-4 py-2 rounded-full mb-4"
                        style={{
                          background: 'rgba(212, 197, 185, 0.15)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(212, 197, 185, 0.3)',
                        }}
                      >
                        <span className="text-xs sm:text-sm font-sans tracking-[0.2em] uppercase text-[#D4C5B9]">
                          Membre Exclusif
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-white/50 mb-2 font-sans tracking-wider uppercase">Membre depuis</p>
                      <p className="text-2xl sm:text-3xl font-serif text-white">Février 2026</p>
                    </div>
                    
                    <div className="flex items-end justify-between relative z-50 -mb-[15px]">
                      <div className="relative z-50">
                        <p className="text-xs text-white/80 font-sans tracking-wider mb-[8px] mt-[2px] mr-[0px] ml-[0px]">
                          Accès illimité
                        </p>
                        <div className="flex items-center gap-2 px-[0px] py-[2px] m-[0px] mx-[0px] my-[8px]">
                          <div className="w-3 h-3 rounded-full bg-[#D4C5B9]" />
                          <div className="w-3 h-3 rounded-full bg-[#A68B6F]" />
                          <div className="w-3 h-3 rounded-full bg-[#8B7355]" />
                        </div>
                      </div>
                      
                      {/* Icône NFC avec glow - Au premier plan */}
                      <div className="relative z-50">
                        <div className="absolute inset-0 bg-[#A68B6F] blur-lg opacity-50 mx-[0px] my-[-6px]" />
                        <Wifi className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4C5B9] relative z-50" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements - Lumières ambiantes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#A68B6F]/20 rounded-full blur-[80px]" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D4C5B9]/15 rounded-full blur-[60px]" />
                
                {/* Hologramme subtil */}
                <div 
                  className="absolute bottom-4 right-4 w-12 h-12 rounded-full opacity-30"
                  style={{
                    background: 'radial-gradient(circle, rgba(166,139,111,0.4) 0%, transparent 70%)',
                  }}
                />
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -top-4 -right-4 px-4 py-2 rounded-full shadow-2xl font-sans text-xs sm:text-sm font-medium"
                style={{
                  background: 'linear-gradient(135deg, #8B7355 0%, #A68B6F 100%)',
                  color: 'white',
                  boxShadow: '0 10px 25px rgba(139, 115, 85, 0.4)',
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  NFC Enabled
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <div className="mb-8">
              <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-foreground font-sans font-medium mb-3">
                VOTRE CARTE MEMBRE
              </p>
              <div className="w-24 h-[2px] bg-foreground" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif text-foreground mb-6 leading-tight">
              Une expérience{" "}
              <span className="italic">tangible</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-foreground/70 font-sans mb-8 sm:mb-10 leading-relaxed">
              Votre carte M.O.N.A en métal brossé avec technologie NFC intégrée. 
              Bien plus qu'un accessoire, c'est votre passeport vers un écosystème de bien-être premium.
            </p>

            {/* Features List */}
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {cardFeatures.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg border border-beige/30"
                  >
                    <div className="flex-shrink-0 p-2 sm:p-2.5 bg-terracotta/10 rounded-lg">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-terracotta" />
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-serif text-anthracite mb-1">{feature.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground font-sans">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Link
              to="/carte-membre"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl font-sans text-sm sm:text-base"
            >
              Commander ma carte
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}