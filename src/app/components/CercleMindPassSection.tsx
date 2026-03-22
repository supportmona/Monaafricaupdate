import { motion } from "motion/react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Dumbbell, Sparkles, MapPin, Star } from "lucide-react";
import { Link } from "react-router";

export default function CercleMindPassSection() {
  const privileges = [
    {
      title: "Studios de Pilates Premium",
      location: "Principales villes d'Afrique francophone",
      description: "Accès illimité aux meilleurs studios avec instructeurs certifiés",
      icon: Dumbbell,
      image:
        "https://images.unsplash.com/photo-1761971975962-9cc397e2ba2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwaWxhdGVzJTIwc3R1ZGlvJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY5Mzc1MzQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      title: "Spas d'Exception",
      location: "Principales villes d'Afrique francophone",
      description: "Soins premium et moments de détente dans des lieux d'exception",
      icon: Sparkles,
      image:
        "https://images.unsplash.com/photo-1720608595168-333998131fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbHV4dXJ5JTIwd2VsbG5lc3MlMjBjZW50ZXJ8ZW58MXx8fHwxNzY5Mzc1Mjc5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  return (
    <section id="cercle" className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white to-beige/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-3 sm:mb-4"
          >
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gold" />
            <span className="text-xs sm:text-sm text-gold font-sans">Écosystème Lifestyle Premium</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-serif text-anthracite mb-3 sm:mb-4 px-2"
          >
            Le <span className="text-terracotta">Cercle M.O.N.A</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs sm:text-sm lg:text-base text-muted-foreground font-sans max-w-3xl mx-auto px-4"
          >
            Au-delà de la thérapie, accédez à un écosystème complet de bien-être avec nos
            partenaires premium dans plusieurs villes d'Afrique francophone.
          </motion.p>
        </div>

        {/* Privileges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {privileges.map((privilege, idx) => {
            const Icon = privilege.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {/* Image Background */}
                <div className="relative h-48 sm:h-64 lg:h-80 overflow-hidden">
                  <ImageWithFallback
                    src={privilege.image}
                    alt={privilege.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-anthracite/90 via-anthracite/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-8 text-white">
                  <div className="mb-3 sm:mb-4 inline-flex p-2.5 sm:p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-serif mb-2">{privilege.title}</h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gold mb-2 sm:mb-3">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{privilege.location}</span>
                  </div>
                  <p className="text-sm sm:text-base text-white/90">{privilege.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12"
        >
          <Link
            to="/cercle"
            className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl font-sans text-sm sm:text-base"
          >
            Découvrir Le Cercle M.O.N.A
          </Link>
        </motion.div>
      </div>
    </section>
  );
}