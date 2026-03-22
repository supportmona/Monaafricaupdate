import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { Video, Phone, MessageSquare, FileText, Users, Clock, Shield, Globe, ArrowRight, CheckCircle2, Stethoscope } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function SoinsPrimairesPage() {
  const features = [
    {
      icon: Video,
      title: "Consultation par vidéo",
      description: "Échangez en face à face avec votre médecin généraliste depuis chez vous"
    },
    {
      icon: Phone,
      title: "Consultation par appel",
      description: "Besoin de rapidité ? Appelez directement pour un diagnostic immédiat"
    },
    {
      icon: MessageSquare,
      title: "Consultation par chat",
      description: "Préférez l'écrit ? Posez vos questions par message sécurisé"
    }
  ];

  const services = [
    {
      icon: FileText,
      title: "Gestion des Ordonnances",
      description: "Renouvellement numérique sécurisé via le Passeport Santé FHIR",
      benefits: [
        "Renouvellement automatique de vos ordonnances courantes",
        "Stockage sécurisé dans votre Passeport Santé FHIR",
        "Historique complet accessible (Soutien 24/7 possible)",
        "Accès permanent à toutes vos prescriptions médicales"
      ]
    },
    {
      icon: Users,
      title: "Orientation Spécialisée",
      description: "Références directes vers des experts si le cas médical le nécessite",
      benefits: [
        "Recommandations personnalisées selon vos besoins",
        "Réseau de spécialistes vérifiés et qualifiés",
        "Transfert automatique de votre dossier médical",
        "Suivi coordonné entre généraliste et spécialiste"
      ]
    },
    {
      icon: Clock,
      title: "Consultation Immédiate",
      description: "Choix entre vidéo, appel ou chat pour une commodité totale",
      benefits: [
        "Soutien 24/7 possible partout en Afrique",
        "Réponse en moins de 15 minutes",
        "Aucune attente, aucun déplacement",
        "Même niveau de qualité qu'un cabinet physique"
      ]
    }
  ];

  const advantages = [
    {
      icon: Globe,
      title: "Service Multilingue",
      description: "Consultez dans votre langue : français, anglais, lingala, wolof, et plus encore"
    },
    {
      icon: Shield,
      title: "Confidentialité Garantie",
      description: "Toutes vos données médicales sont protégées par chiffrement E2E"
    },
    {
      icon: Stethoscope,
      title: "Médecins Qualifiés",
      description: "Tous nos généralistes sont diplômés et enregistrés auprès des ordres médicaux"
    }
  ];

  const useCases = [
    "Rhume, grippe ou symptômes légers",
    "Renouvellement d'ordonnances chroniques",
    "Conseils de santé générale",
    "Suivi de grossesse",
    "Infections courantes",
    "Douleurs musculaires ou articulaires",
    "Problèmes digestifs",
    "Santé sexuelle et contraception"
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-white via-beige/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
                <Stethoscope className="w-4 h-4 text-terracotta" />
                <span className="text-sm text-terracotta font-sans font-medium uppercase tracking-wide">Soins Primaires</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-serif text-anthracite mb-6 leading-tight">
                Votre médecin généraliste, <span className="italic text-terracotta">partout en Afrique</span>
              </h1>
              <p className="text-xl text-muted-foreground font-sans mb-8 leading-relaxed">
                Un service de médecine générale multilingue (Soutien 24/7 possible), accessible par vidéo, appel ou chat. Pour tous vos besoins de santé du quotidien.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/onboarding"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
                >
                  Consulter maintenant
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/tarifs"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-beige/50 text-anthracite rounded-full hover:bg-beige/10 transition-all duration-200 font-sans font-semibold"
                >
                  Voir les tarifs
                </Link>
              </div>
            </motion.div>

            {/* Illustration des modes de consultation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid gap-4"
            >
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-beige/30 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-terracotta" />
                    </div>
                    <div>
                      <h3 className="text-lg font-serif text-anthracite mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground font-sans">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Détaillés */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-serif text-anthracite mb-6">
              Trois piliers pour votre <span className="italic text-terracotta">santé au quotidien</span>
            </h2>
            <p className="text-xl text-muted-foreground font-sans max-w-3xl mx-auto">
              Nos Soins Primaires couvrent l'essentiel de vos besoins médicaux avec une approche complète et moderne.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-gradient-to-br from-beige/5 to-white border border-beige/30 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-terracotta/10 rounded-2xl flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-terracotta" />
                </div>
                <h3 className="text-2xl font-serif text-anthracite mb-4">
                  {service.title}
                </h3>
                <p className="text-base text-muted-foreground font-sans mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.benefits.map((benefit, benefitIdx) => (
                    <li key={benefitIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-anthracite font-sans">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-20 bg-gradient-to-b from-beige/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-serif text-anthracite mb-6">
              Pourquoi choisir nos <span className="italic text-terracotta">Soins Primaires</span> ?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {advantages.map((advantage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-white border border-beige/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <advantage.icon className="w-10 h-10 text-terracotta" />
                </div>
                <h3 className="text-xl font-serif text-anthracite mb-3">
                  {advantage.title}
                </h3>
                <p className="text-base text-muted-foreground font-sans">
                  {advantage.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cas d'usage */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-serif text-anthracite mb-6">
              Quand consulter nos <span className="italic text-terracotta">médecins généralistes</span> ?
            </h2>
            <p className="text-xl text-muted-foreground font-sans">
              Nos médecins traitent une large gamme de problèmes de santé courants.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {useCases.map((useCase, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-beige/5 border border-beige/20 rounded-xl"
              >
                <CheckCircle2 className="w-5 h-5 text-terracotta flex-shrink-0" />
                <span className="text-base text-anthracite font-sans">{useCase}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-terracotta/5 via-beige/10 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-beige/30 rounded-2xl p-12 text-center shadow-lg"
          >
            <h2 className="text-3xl lg:text-4xl font-serif text-anthracite mb-6">
              Consultez un médecin généraliste <span className="italic text-terracotta">dès maintenant</span>
            </h2>
            <p className="text-lg text-muted-foreground font-sans mb-8 max-w-2xl mx-auto">
              Soutien 24/7 possible, dans votre langue, où que vous soyez en Afrique. Choisissez votre mode de consultation préféré.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/onboarding"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
              >
                Commencer une consultation
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/help"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-beige/50 text-anthracite rounded-full hover:bg-beige/10 transition-all duration-200 font-sans font-semibold"
              >
                En savoir plus
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}