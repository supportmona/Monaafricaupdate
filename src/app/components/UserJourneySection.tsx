import { motion } from "motion/react";
import { Users, Shield, Activity } from "lucide-react";

export default function UserJourneySection() {
  const journeySteps = [
    {
      icon: Users,
      title: "Smart Matching",
      description: "Algorithme culturel intelligent",
    },
    {
      icon: Shield,
      title: "Passeport FHIR",
      description: "Données chiffrées end-to-end",
    },
    {
      icon: Activity,
      title: "Suivi Offline-First",
      description: "Progression & accessibilité totale",
    },
  ];

  return (
    <section className="py-6 sm:py-8 lg:py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-5 sm:mb-6 lg:mb-8"
        >
          <h2 className="text-lg sm:text-xl lg:text-2xl font-serif text-anthracite mb-2">
            Une approche <span className="text-terracotta">sur mesure</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-2xl mx-auto px-4">
            Technologie de pointe et compréhension culturelle unique
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center p-4 sm:p-5 bg-beige/5 rounded-xl border border-beige/30 hover:border-terracotta/30 transition-all duration-300"
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-terracotta mx-auto mb-2 sm:mb-3" />
                <h3 className="text-sm sm:text-base font-serif text-anthracite mb-1">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-sans">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}