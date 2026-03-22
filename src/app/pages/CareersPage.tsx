import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { motion } from "motion/react";
import { 
  Sparkles,
  TrendingUp,
  Brain,
  Globe,
  Clock,
  Shield,
  Users,
  Briefcase,
  ArrowRight,
  Award,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwd29ya2luZyUyMHByb2Zlc3Npb25hbHxlbnwwfHx8fDE3Mzc1NjMxODd8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Professional team"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/98 via-background/95 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm text-gold font-sans">Carrières M.O.N.A</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif text-anthracite mb-6"
            >
              Rejoignez l'<span className="text-terracotta">Excellence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground font-sans mb-8"
            >
              Développez votre pratique avec M.O.N.A : la première plateforme panafricaine 
              qui unit technologie de pointe et excellence clinique pour transformer 
              la santé mentale en Afrique.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/opportunities"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl font-sans"
              >
                <span>Voir les opportunités</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/postuler"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-beige text-anthracite rounded-lg hover:bg-beige/10 transition-all duration-300 font-sans"
              >
                <span>Postuler maintenant</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pourquoi rejoindre M.O.N.A */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-6"
            >
              Pourquoi rejoindre <span className="text-terracotta">M.O.N.A</span> ?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground font-sans max-w-3xl mx-auto"
            >
              Développez votre pratique avec des outils premium, un réseau d'excellence 
              et une rémunération attractive.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: TrendingUp,
                title: "Rémunération attractive",
                description: "70% des honoraires vous reviennent. Paiements sécurisés et ponctuels via Mobile Money.",
              },
              {
                icon: Brain,
                title: "Outils professionnels",
                description: "Agenda intelligent, dossiers FHIR, téléconsultation HD, formation continue incluse.",
              },
              {
                icon: Globe,
                title: "Réseau panafricain",
                description: "Accédez à une base de membres qualifiés à Kinshasa, Dakar et Abidjan.",
              },
              {
                icon: Clock,
                title: "Flexibilité totale",
                description: "Gérez votre emploi du temps, vos tarifs et vos modalités de consultation.",
              },
              {
                icon: Shield,
                title: "Protection juridique",
                description: "Assurance RC professionnelle incluse et conformité RGPD garantie.",
              },
              {
                icon: Users,
                title: "Supervision & Peer support",
                description: "Groupes de supervision mensuels et communauté d'experts bienveillante.",
              },
            ].map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-xl border border-beige/30 hover:border-terracotta/30 hover:shadow-lg transition-all duration-300"
                >
                  <Icon className="w-8 h-8 text-terracotta mb-4" />
                  <h3 className="text-xl font-serif text-anthracite mb-3">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Processus de recrutement */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-serif text-anthracite mb-6"
            >
              Notre <span className="text-terracotta">Processus de sélection</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground font-sans max-w-3xl mx-auto"
            >
              Un processus rigoureux en 4 étapes pour garantir l'excellence clinique 
              et la qualité de l'accompagnement offert à nos membres.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              {
                step: "01",
                title: "Candidature",
                description: "Soumettez votre CV, diplômes et attestations. Vérification des antécédents.",
              },
              {
                step: "02",
                title: "Entretien",
                description: "Entretien vidéo avec notre équipe clinique. Évaluation de votre approche thérapeutique.",
              },
              {
                step: "03",
                title: "Vérifications",
                description: "Validation des diplômes, certifications et références professionnelles.",
              },
              {
                step: "04",
                title: "Onboarding",
                description: "Formation aux outils M.O.N.A, signature du contrat et activation de votre profil.",
              },
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <div className="bg-beige/10 p-6 rounded-xl border border-beige/30 h-full">
                  <div className="text-4xl font-serif text-terracotta/30 mb-4">{step.step}</div>
                  <h3 className="text-xl font-serif text-anthracite mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-beige/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}