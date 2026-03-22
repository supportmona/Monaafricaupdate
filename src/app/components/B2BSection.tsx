import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function B2BSection() {
  const stats = [
    { value: "Conforme", label: "RGPD & FHIR" },
    { value: "Dashboard", label: "RH Anonymisé" },
    { value: "ROI", label: "Impact mesurable" },
  ];

  return (
    <section id="business" className="py-20 lg:py-32 bg-anthracite text-white"> {/* Noir - reste comme avant */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-white/90 font-sans font-medium mb-3">
              SOLUTIONS ENTREPRISES
            </p>
            <div className="w-32 h-[2px] bg-terracotta mx-auto" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif mb-6 leading-tight"
          >
            Investissez dans{" "}
            <span className="italic text-terracotta">votre capital humain</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg lg:text-xl text-white/80 font-sans max-w-3xl mx-auto leading-relaxed"
          >
            Une solution B2B complète avec Dashboard RH anonymisé, 
            confidentialité garantie et impact mesurable sur la performance.
          </motion.p>
        </div>

        {/* Stats - Grille 3 colonnes ultra-compacte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8 lg:mb-10"
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-2 sm:p-3 lg:p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
            >
              <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif text-terracotta mb-0.5 sm:mb-1 break-words">{stat.value}</div>
              <div className="text-[9px] sm:text-[10px] lg:text-xs text-white/70 font-sans leading-tight break-words">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 border border-white/10"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif mb-3 sm:mb-4">
              Dashboard RH <span className="text-terracotta">Anonymisé</span>
            </h3>
            <p className="text-sm sm:text-base text-white/70 mb-4 sm:mb-6 font-sans leading-relaxed">
              Suivez le bien-être de vos équipes avec des données agrégées et anonymisées.
              Respect total de la confidentialité de chaque employé.
            </p>
            <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              {[
                "Métriques de bien-être collectif",
                "Signaux d'alerte précoces",
                "ROI et impact mesurable",
                "Conformité RGPD et normes FHIR",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/80 font-sans justify-center">
                  <div className="w-1.5 h-1.5 bg-terracotta rounded-full flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl font-sans text-sm sm:text-base"
              >
                Demander une démo
              </Link>
              <Link
                to="/b2b"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/5 border border-white/20 text-white rounded-lg hover:bg-white/10 hover:border-terracotta/50 transition-all duration-200 font-sans text-sm sm:text-base"
              >
                <span>Voir plus</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}