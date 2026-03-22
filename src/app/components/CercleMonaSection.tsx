import { motion } from "motion/react";
import { Dumbbell, Sparkles, Heart, Shield, Gift, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function CercleMonaSection() {
  const privileges = [
    {
      icon: Heart,
      title: "Santé & Bien-Être",
      description: "Réductions chez nos pharmacies, laboratoires et centres de santé partenaires"
    },
    {
      icon: Dumbbell,
      title: "Fitness & Wellness",
      description: "Tarifs préférentiels dans nos studios de yoga, pilates, spas et centres de méditation"
    },
    {
      icon: Sparkles,
      title: "M.O.N.A Escapes",
      description: "Invitations aux retraites wellness dans des destinations d'exception"
    },
    {
      icon: Shield,
      title: "Support Dédié",
      description: "Conciergerie santé personnalisée et coordination de vos soins"
    },
    {
      icon: Gift,
      title: "Expériences Uniques",
      description: "Ateliers avec nos experts et événements réservés aux membres"
    },
    {
      icon: TrendingUp,
      title: "Évolution Continue",
      description: "Avantages qui grandissent avec votre parcours bien-être"
    }
  ];

  return (
    <section id="cercle" className="py-20 lg:py-32 bg-white"> {/* Blanc */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="mb-8">
            <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-foreground font-sans font-medium mb-3">
              ÉCOSYSTÈME PREMIUM
            </p>
            <div className="w-32 h-[2px] bg-foreground mx-auto" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif text-foreground mb-6 leading-tight">
            Le Cercle M.O.N.A : un{" "}
            <span className="italic">style de vie</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-foreground/70 font-sans max-w-3xl mx-auto leading-relaxed">
            Une communauté qui transforme votre rapport au bien-être. Des avantages pensés pour votre équilibre, sans compromis.
          </p>
        </motion.div>

        {/* Privileges Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {privileges.map((privilege, idx) => {
            const Icon = privilege.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-beige/30 hover:border-gold/30 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gold/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-7 h-7 text-gold" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-serif text-anthracite mb-3">
                  {privilege.title}
                </h3>

                {/* Description */}
                <p className="text-base text-muted-foreground font-sans leading-relaxed">
                  {privilege.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-gold/10 via-terracotta/5 to-beige/10 rounded-2xl overflow-hidden border border-gold/20"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-[350px] lg:h-auto min-h-[400px]">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1767358270276-80e702873be2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwemVuJTIwc3RvbmVzJTIwcGVhY2VmdWwlMjB3ZWxsbmVzc3xlbnwxfHx8fDE3NzAyNjAxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Bien-être et équilibre"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 lg:to-transparent" />
            </div>

            {/* Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-3xl lg:text-4xl font-serif text-anthracite mb-4">
                Un réseau qui grandit avec vous
              </h3>
              <p className="text-lg text-muted-foreground font-sans mb-8 leading-relaxed">
                Bien plus qu'un programme de fidélité : un écosystème conçu pour accompagner 
                votre transformation. Vos avantages évoluent naturellement avec votre parcours.
              </p>

              {/* Benefits */}
              <div className="space-y-3 mb-8">
                {[
                  "Actif dès votre première consultation",
                  "Sans frais d'inscription",
                  "Nouveaux partenaires chaque mois",
                  "Bénéfices croissants selon votre utilisation"
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-terracotta" />
                    </div>
                    <span className="text-base text-anthracite font-sans">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                to="/cercle"
                className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl group w-fit"
              >
                Découvrir Le Cercle
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground font-sans">
            Le réseau de partenaires s'enrichit constamment. 
            <Link to="/cercle" className="text-terracotta hover:underline ml-1">
              Voir tous les avantages →
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}