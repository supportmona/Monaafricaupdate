import { motion } from "motion/react";
import { Award, Shield, Heart, Brain, Stethoscope } from "lucide-react";
import { Link } from "react-router";

export default function ExpertsSection() {
  const domains = [
    {
      icon: Brain,
      title: "Psychologues & Psychiatres",
      description: "Thérapie, diagnostic et traitement des troubles mentaux avec suivi médical et approche culturellement adaptée"
    },
    {
      icon: Stethoscope,
      title: "Médecins Généralistes",
      description: "Consultations générales, prévention et suivi de votre santé physique"
    },
    {
      icon: Award,
      title: "Coachs Certifiés",
      description: "Développement personnel et professionnel, gestion du stress et performance"
    },
    {
      icon: Shield,
      title: "Thérapeutes Spécialisés",
      description: "Traumatismes, troubles du sommeil, addictions et bien-être holistique"
    }
  ];

  const qualityStandards = [
    "Diplômes vérifiés et certifications valides",
    "Inscription auprès d'ordres professionnels",
    "Formation continue obligatoire",
    "Sensibilité culturelle africaine",
    "Supervision clinique régulière"
  ];

  return (
    <section id="experts" className="py-20 lg:py-32 bg-[#E8DFD6]"> {/* Beige moyen */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-foreground font-sans font-medium mb-3">
              NOTRE ÉQUIPE
            </p>
            <div className="w-24 h-[2px] bg-foreground mx-auto" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif text-foreground mb-6 leading-tight"
          >
            Des professionnels qui vous{" "}
            <span className="italic">comprennent vraiment</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg lg:text-xl text-foreground/70 font-sans max-w-2xl mx-auto leading-relaxed"
          >
            Une équipe multidisciplinaire certifiée, rigoureusement sélectionnée pour votre santé intégrée
          </motion.p>
        </div>

        {/* Domaines d'expertise */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {domains.map((area, idx) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-beige/30 hover:border-terracotta/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-terracotta/10 flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-terracotta" />
                </div>
                <h3 className="text-lg font-serif text-anthracite mb-2">
                  {area.title}
                </h3>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                  {area.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Standards de qualité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-beige/10 to-gold/5 rounded-2xl p-8 sm:p-10 border border-beige/30 mb-8"
        >
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-terracotta" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-serif text-anthracite mb-2">
                Nos standards d'excellence
              </h3>
              <p className="text-base text-muted-foreground font-sans">
                Chaque expert M.O.N.A répond à des critères rigoureux
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {qualityStandards.map((standard, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-terracotta" />
                </div>
                <span className="text-sm text-anthracite font-sans">{standard}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-base text-muted-foreground font-sans mb-6">
            Notre algorithme de Smart Matching vous connecte automatiquement avec l'expert le plus adapté à votre profil
          </p>
          <Link
            to="/onboarding"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
          >
            Trouver mon expert
          </Link>
        </motion.div>
      </div>
    </section>
  );
}