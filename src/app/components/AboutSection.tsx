import { motion, AnimatePresence } from "motion/react";
import { Globe, Heart, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function AboutSection() {
  const pillars = [
    {
      icon: Globe,
      title: "Innovation Mondiale, Résonance Africaine",
      description:
        "Née au Canada, M.O.N.A déploie son infrastructure stratégiquement à travers les grands pôles économiques du continent pour offrir une technologie de pointe adaptée aux réalités locales.",
      color: "terracotta",
    },
    {
      icon: Heart,
      title: "Santé Sans Compromis",
      description:
        "Nous croyons que des soins de qualité ne doivent pas être un privilège réservé à quelques-uns. M.O.N.A démocratise l'accès à des experts certifiés en santé mentale et en soins primaires.",
      color: "gold",
    },
    {
      icon: Shield,
      title: "Respect de Votre Identité",
      description:
        "Votre contexte culturel, vos valeurs spirituelles, votre langue maternelle : nous matchons des experts qui vous comprennent vraiment, pas juste des algorithmes froids.",
      color: "beige",
    },
  ];

  const [currentPillar, setCurrentPillar] = useState(0);

  const handlePrevPillar = () => {
    setCurrentPillar((prev) => (prev > 0 ? prev - 1 : pillars.length - 1));
  };

  const handleNextPillar = () => {
    setCurrentPillar((prev) => (prev < pillars.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="about" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="mb-8">
            <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-foreground font-sans font-medium mb-3">
              NOTRE APPROCHE
            </p>
            <div className="w-24 h-[2px] bg-foreground mx-auto" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif text-foreground mb-6 leading-tight">
            L'innovation mondiale,{" "}
            <span className="italic">l'ancrage local</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-foreground/70 font-sans max-w-3xl mx-auto leading-relaxed">
            M.O.N.A combine la technologie de pointe avec une compréhension profonde des réalités africaines.
          </p>
        </motion.div>

        {/* Pillars Carousel - Mobile and Tablet only */}
        <div className="block lg:hidden relative mb-12 sm:mb-16">
          <div className="relative max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {(() => {
                const pillar = pillars[currentPillar];
                const Icon = pillar.icon;
                return (
                  <motion.div
                    key={currentPillar}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <div className="relative h-full p-6 sm:p-8 bg-white rounded-2xl border border-beige/30 hover:border-terracotta/30 transition-all duration-300 hover:shadow-xl">
                      {/* Gradient Background on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-beige/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Icon */}
                      <div className="relative mb-4 inline-flex p-3 bg-beige/20 rounded-xl">
                        <Icon className={`w-6 h-6 sm:w-7 sm:h-7 text-${pillar.color}`} />
                      </div>

                      {/* Content */}
                      <h3 className="relative text-lg sm:text-xl font-serif text-anthracite mb-3">
                        {pillar.title}
                      </h3>
                      <p className="relative text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevPillar}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 bg-white border border-beige/30 hover:border-terracotta/30 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Pilier précédent"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-anthracite" />
            </button>
            <button
              onClick={handleNextPillar}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 bg-white border border-beige/30 hover:border-terracotta/30 rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Pilier suivant"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-anthracite" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {pillars.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPillar(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentPillar
                      ? "bg-terracotta w-8"
                      : "bg-beige/40 hover:bg-beige/60"
                  }`}
                  aria-label={`Aller au pilier ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pillars Grid - Desktop only */}
        <div className="hidden lg:grid grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="group"
              >
                <div className="relative h-full p-6 sm:p-8 bg-white rounded-2xl border border-beige/30 hover:border-terracotta/30 transition-all duration-300 hover:shadow-xl">
                  {/* Gradient Background on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-beige/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Icon */}
                  <div className="relative mb-4 inline-flex p-3 bg-beige/20 rounded-xl">
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 text-${pillar.color}`} />
                  </div>

                  {/* Content */}
                  <h3 className="relative text-lg sm:text-xl font-serif text-anthracite mb-3">
                    {pillar.title}
                  </h3>
                  <p className="relative text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}