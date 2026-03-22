import { motion } from "motion/react";
import { FileHeart, Shield, Clock, Share2, Lock, ChartLine, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";

// Passeport Santé Page
export default function PasseportSantePage() {
  const features = [
    {
      icon: FileHeart,
      title: "Dossier Médical Unifié",
      description: "Centralisez tous vos documents de santé mentale : bilans, prescriptions, comptes-rendus de séances en un seul endroit sécurisé."
    },
    {
      icon: ChartLine,
      title: "Suivi de Progression",
      description: "Visualisez votre évolution avec des graphiques intuitifs. Suivez vos objectifs, vos progrès et vos accomplissements."
    },
    {
      icon: Lock,
      title: "Sécurité Maximale",
      description: "Cryptage de bout en bout, conformité RGPD et HIPAA. Vos données de santé sont protégées au plus haut niveau."
    },
    {
      icon: Share2,
      title: "Partage Contrôlé",
      description: "Partagez vos informations avec vos experts M.O.N.A en un clic. Vous gardez toujours le contrôle total."
    },
    {
      icon: Clock,
      title: "Historique Complet",
      description: "Accédez à tout moment à l'historique de vos consultations, traitements et recommandations personnalisées."
    },
    {
      icon: Shield,
      title: "Accès d'Urgence",
      description: "En cas d'urgence, vos informations vitales sont accessibles rapidement par les professionnels de santé autorisés."
    }
  ];

  const sections = [
    {
      title: "Informations Personnelles",
      items: ["Données démographiques", "Contacts d'urgence", "Assurance santé", "Allergies et contre-indications"]
    },
    {
      title: "Historique Médical",
      items: ["Antécédents médicaux", "Traitements en cours", "Diagnostics antérieurs", "Chirurgies et hospitalisations"]
    },
    {
      title: "Suivi Bien-Être",
      items: ["Évolution du score mental", "Objectifs de bien-être", "Habitudes et routines", "Facteurs de stress"]
    },
    {
      title: "Documents",
      items: ["Ordonnances", "Comptes-rendus de séances", "Bilans psychologiques", "Certificats médicaux"]
    }
  ];

  const benefits = [
    "Continuité des soins optimisée entre vos différents experts",
    "Gain de temps lors des consultations",
    "Meilleure prise de décision médicale basée sur votre historique complet",
    "Évitez de répéter votre histoire à chaque nouvelle consultation",
    "Détection proactive des interactions médicamenteuses",
    "Exportation possible de vos données à tout moment"
  ];

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-foreground font-sans font-medium mb-3">
                SANTÉ CONNECTÉE
              </p>
              <div className="w-32 h-[2px] bg-foreground mx-auto" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-foreground mb-6 leading-tight">
              Votre Passeport Santé{" "}
              <span className="italic">personnalisé</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-foreground/70 font-sans mb-12 leading-relaxed">
              Un dossier médical numérique sécurisé qui centralise votre parcours de bien-être. 
              Accessible 24/7, partageable avec vos experts, toujours à jour.
            </p>

            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
            >
              Créer mon passeport
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 lg:py-32 bg-[#E8DFD6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground mb-6">
              Tout ce dont vous avez besoin,{" "}
              <span className="italic">en un seul endroit</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-beige/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-terracotta/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-terracotta" />
                  </div>
                  <h3 className="text-xl font-serif text-anthracite mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-base text-muted-foreground font-sans leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sections Overview */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground mb-6">
              Structure de votre{" "}
              <span className="italic">passeport</span>
            </h2>
            <p className="text-lg text-foreground/70 font-sans max-w-2xl mx-auto">
              Un dossier organisé en sections logiques pour un accès rapide à toutes vos informations
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-gold/5 to-terracotta/5 rounded-2xl p-8 border border-beige/30"
              >
                <h3 className="text-2xl font-serif text-anthracite mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                      <span className="text-base text-muted-foreground font-sans">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 bg-[#D4C5B9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground mb-6">
                Les avantages d'un dossier{" "}
                <span className="italic">centralisé</span>
              </h2>
              <p className="text-lg text-foreground/70 font-sans mb-8 leading-relaxed">
                Votre Passeport Santé transforme la façon dont vous gérez votre bien-être mental. 
                Plus de documents perdus, plus d'informations manquantes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 bg-white rounded-lg p-4 border border-beige/30"
                >
                  <CheckCircle2 className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <span className="text-base text-anthracite font-sans">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Shield className="w-16 h-16 mx-auto mb-6 text-terracotta" />
            <h2 className="text-3xl sm:text-4xl font-serif text-foreground mb-6">
              Vos données sont <span className="italic">protégées</span>
            </h2>
            <p className="text-lg text-foreground/70 font-sans mb-8 leading-relaxed">
              Nous utilisons les mêmes standards de sécurité que les institutions bancaires. 
              Cryptage de bout en bout (E2E), authentification à deux facteurs, et conformité 
              totale avec le RGPD et les réglementations internationales de santé.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground font-sans">
              <span className="px-4 py-2 bg-beige/30 rounded-full">🔒 Cryptage AES-256</span>
              <span className="px-4 py-2 bg-beige/30 rounded-full">✓ Certifié RGPD</span>
              <span className="px-4 py-2 bg-beige/30 rounded-full">🇨🇦 Hébergé au Canada</span>
              <span className="px-4 py-2 bg-beige/30 rounded-full">🛡️ Audit de sécurité annuel</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-[#1A1A1A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <FileHeart className="w-16 h-16 mx-auto mb-6 text-[#D4C5B9]" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-6">
              Créez votre Passeport Santé dès aujourd'hui
            </h2>
            <p className="text-lg text-white/70 font-sans mb-8">
              Rejoignez les milliers de membres qui ont déjà centralisé leur parcours de bien-être.
            </p>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1A1A1A] rounded-full hover:bg-gray-100 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}