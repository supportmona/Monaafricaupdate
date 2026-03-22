import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Palmtree, Mountain, Waves, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function MindPassEscapesSection() {
  const escapes = [
    {
      name: "Casa Del Toro",
      location: "Sénégal",
      description: "Villa d'exception face à l'océan Atlantique",
      icon: Waves,
      features: ["Spa privé", "Chef personnel", "Yoga & Méditation"],
    },
    {
      name: "Ranch de Saly",
      location: "Sénégal",
      description: "Retraite équestre dans un cadre naturel préservé",
      icon: Mountain,
      features: ["Équitation", "Nature immersion", "Massages bien-être"],
    },
    {
      name: "Oasis du Sahel",
      location: "À venir",
      description: "Nouvelles destinations en cours de sélection",
      icon: Palmtree,
      features: ["Exclusivité", "Luxe discret", "Ressourcement total"],
    },
  ];

  return (
    <section id="escapes" className="py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full mb-3 sm:mb-4"
          >
            <Palmtree className="w-3 h-3 sm:w-4 sm:h-4 text-terracotta" />
            <span className="text-xs sm:text-sm text-terracotta font-sans">Destinations Wellness</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif text-anthracite mb-3 sm:mb-4 px-2"
          >
            M.O.N.A <span className="text-terracotta">Escapes</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm lg:text-base text-muted-foreground font-sans max-w-3xl mx-auto px-4"
          >
            Évadez-vous vers des destinations d'exception soigneusement sélectionnées pour
            votre ressourcement complet. Des retraites wellness alliant luxe discret et
            reconnexion à soi.
          </motion.p>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative h-48 sm:h-64 lg:h-80 rounded-xl overflow-hidden mb-6 sm:mb-8 lg:mb-10"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1765988299249-07da710ecb27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXRyZWF0JTIwZGVzdGluYXRpb258ZW58MXx8fHwxNzY5Mzc1MzQyfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Luxury Retreat"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 lg:bottom-6 lg:left-6 text-white">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-serif mb-1">Votre sanctuaire privé</h3>
            <p className="text-xs sm:text-sm text-white/90 font-sans">Où le luxe rencontre la sérénité</p>
          </div>
        </motion.div>

        {/* Escapes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {escapes.map((escape, idx) => {
            const Icon = escape.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group relative bg-gradient-to-b from-beige/5 to-transparent rounded-xl sm:rounded-2xl border border-beige/30 p-4 sm:p-5 lg:p-6 hover:border-terracotta/30 hover:shadow-xl transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-4 sm:mb-6 inline-flex p-2.5 sm:p-3 bg-terracotta/10 rounded-lg sm:rounded-xl">
                  <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-terracotta" />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl lg:text-2xl font-serif text-anthracite mb-1 sm:mb-2">{escape.name}</h3>
                <p className="text-xs sm:text-sm text-gold mb-3 sm:mb-4 font-sans flex items-center gap-1">
                  <Mountain className="w-3 h-3 sm:w-4 sm:h-4" />
                  {escape.location}
                </p>
                <p className="text-sm sm:text-base text-muted-foreground font-sans mb-4 sm:mb-6">{escape.description}</p>

                <Link
                  to="/cercle"
                  className="block w-full px-4 py-2 sm:py-2.5 border-2 border-terracotta text-terracotta rounded-lg hover:bg-terracotta hover:text-white transition-all duration-200 text-sm sm:text-base font-sans text-center"
                >
                  Découvrir
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}