import { motion } from "motion/react";
import { Brain, Stethoscope, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function ServicesOverviewSection() {
  const services = [
    {
      icon: Brain,
      title: "Santé Mentale",
      description: "Psychologues, psychothérapeutes et accompagnement personnalisé pour votre bien-être mental.",
      link: "/sante-mentale",
      color: "terracotta"
    },
    {
      icon: Stethoscope,
      title: "Soins Primaires",
      description: "Médecins généralistes disponibles pour vos consultations de santé générale.",
      link: "/soins-primaires",
      color: "gold"
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-white border-t border-beige/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="mb-6">
            <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-foreground font-sans font-medium mb-3">
              NOS PROGRAMMES DE SOINS
            </p>
            <div className="w-24 h-[2px] bg-foreground mx-auto" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4">
            Santé Mentale <span className="italic text-terracotta">&</span> Soins Primaires
          </h2>
          <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
            Une approche complète pour votre santé et votre bien-être
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  to={service.link}
                  className="block group h-full"
                >
                  <div className="h-full bg-white border border-beige/30 rounded-2xl p-8 hover:shadow-xl hover:border-terracotta/30 transition-all duration-300">
                    <div className={`w-16 h-16 bg-${service.color}/10 rounded-2xl flex items-center justify-center mb-6`}>
                      <Icon className={`w-8 h-8 text-${service.color}`} />
                    </div>
                    
                    <h3 className="text-2xl font-serif text-anthracite mb-3">
                      {service.title}
                    </h3>
                    
                    <p className="text-base text-muted-foreground font-sans mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="inline-flex items-center gap-2 text-terracotta font-sans font-semibold group-hover:gap-3 transition-all duration-200">
                      En savoir plus
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
