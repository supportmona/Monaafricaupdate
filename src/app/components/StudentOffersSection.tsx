import { motion } from "motion/react";
import { GraduationCap, ArrowRight, Trophy, Heart, Shield } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function StudentOffersSection() {
  const advantages = [
    {
      icon: Trophy,
      title: "Classes d'Examens",
      description: "Promotions spéciales pour les étudiants en 3e et Terminale"
    },
    {
      icon: Heart,
      title: "Tous Niveaux",
      description: "Réductions exclusives pour tous les étudiants"
    },
    {
      icon: Shield,
      title: "Smart Matching",
      description: "Experts qui comprennent vos réalités académiques"
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-white via-beige/10 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-8">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full mb-4">
              <GraduationCap className="w-5 h-5 text-gold" />
              <span className="text-sm text-gold font-sans font-medium tracking-wide uppercase">Avantages Étudiants</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4">
              L'Avenir <span className="italic text-gold">n'attend pas</span>
            </h2>
            
            <p className="text-lg text-muted-foreground font-sans mb-8">
              Parce que votre santé mentale est essentielle, surtout en période d'examens.
            </p>

            {/* Advantages List - Compact Version */}
            <div className="space-y-4 mb-8">
              {advantages.map((advantage, idx) => {
                const Icon = advantage.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif text-anthracite mb-1">
                        {advantage.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-sans">
                        {advantage.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm text-muted-foreground font-sans mb-4">
                Sur présentation d'un justificatif étudiant
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/etudiants"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-anthracite rounded-full hover:bg-gold/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl group"
                >
                  Découvrir le programme
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  to="/tarifs"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-beige/50 text-anthracite rounded-full hover:bg-beige/10 transition-all duration-200 font-sans font-semibold"
                >
                  Voir les tarifs
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 relative rounded-2xl overflow-hidden shadow-2xl h-[350px] lg:h-[450px]"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1769794371055-54436b54577e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGRlc2slMjBub3RlYm9vayUyMHN0dWR5JTIwb3JnYW5pemVkfGVufDF8fHx8MTc3MDI2MDEyNXww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Espace d'études organisé"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-anthracite/30 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}