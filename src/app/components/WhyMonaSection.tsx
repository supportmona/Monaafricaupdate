import { motion } from "motion/react";
import { FileHeart, Clock, Users, ShieldCheck } from "lucide-react";

export default function WhyMonaSection() {
  const advantages = [
    {
      icon: FileHeart,
      title: "Le Dossier qui vous suit",
      description: "En clinique classique, si vous changez de ville ou de pays, vos dossiers restent dans un tiroir. Avec M.O.N.A, votre Passeport Santé (FHIR) est dans votre poche. C'est votre propriété, pas celle de l'hôpital.",
      color: "terracotta"
    },
    {
      icon: Clock,
      title: "La Fin de l'Attente",
      description: "Pas de salle d'attente bondée pendant 3h. Le rendez-vous est immédiat ou programmé selon votre agenda.",
      color: "gold"
    },
    {
      icon: Users,
      title: "La Coordination, pas seulement la Consultation",
      description: "Un médecin classique vous voit, vous donne une ordonnance et vous oublie. M.O.N.A coordonne : votre expert suit l'évolution, vérifie si le traitement marche et ajuste en temps réel via la messagerie sécurisée.",
      color: "terracotta"
    },
    {
      icon: ShieldCheck,
      title: "La Confidentialité Totale (E2E)",
      description: "Dans beaucoup de contextes locaux, la discrétion sur la santé (surtout mentale ou sexuelle) est vitale. Le cryptage de M.O.N.A garantit que personne, à part votre médecin, ne verra vos données.",
      color: "gold"
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-beige/50 to-beige/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="mb-6">
            <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-foreground font-sans font-medium mb-3">
              POURQUOI CHOISIR M.O.N.A
            </p>
            <div className="w-24 h-[2px] bg-foreground mx-auto" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4">
            Ce qui nous <span className="italic text-terracotta">distingue</span>
          </h2>
          <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto">
            Une révolution dans votre parcours de soins, pensée pour l'Afrique d'aujourd'hui
          </p>
        </motion.div>

        {/* Timeline horizontale sur desktop */}
        <div className="hidden lg:block relative">
          {/* Ligne de connexion */}
          <div className="absolute top-16 left-0 right-0 h-[2px] bg-gradient-to-r from-terracotta/20 via-gold/40 to-terracotta/20" />
          
          <div className="grid grid-cols-4 gap-6">
            {advantages.map((advantage, idx) => {
              const Icon = advantage.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                  className="relative"
                >
                  {/* Numéro de l'étape */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 + 0.2, type: "spring", stiffness: 200 }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full border-2 border-terracotta/30 flex items-center justify-center shadow-lg z-10"
                  >
                    <span className="text-lg font-serif text-terracotta font-bold">{idx + 1}</span>
                  </motion.div>

                  {/* Carte */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-beige/40 hover:border-terracotta/40 mt-10"
                  >
                    <motion.div
                      className={`w-14 h-14 bg-${advantage.color}/10 rounded-xl flex items-center justify-center mb-4 mx-auto`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className={`w-7 h-7 text-${advantage.color}`} />
                    </motion.div>
                    
                    <h3 className="text-lg font-serif text-anthracite mb-3 text-center">
                      {advantage.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground font-sans leading-relaxed text-center">
                      {advantage.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Version mobile/tablette - Grille classique */}
        <div className="lg:hidden grid md:grid-cols-2 gap-6">
          {advantages.map((advantage, idx) => {
            const Icon = advantage.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-beige/40"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-serif text-terracotta font-bold">{idx + 1}</span>
                  </div>
                  <div className={`w-12 h-12 bg-${advantage.color}/10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 text-${advantage.color}`} />
                  </div>
                </div>
                
                <h3 className="text-xl font-serif text-anthracite mb-3">
                  {advantage.title}
                </h3>
                
                <p className="text-base text-muted-foreground font-sans leading-relaxed">
                  {advantage.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}