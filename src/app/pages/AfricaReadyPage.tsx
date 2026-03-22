import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { Wifi, CreditCard, Shield, Zap, Globe, Smartphone, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function AfricaReadyPage() {
  const piliers = [
    {
      icon: Wifi,
      title: "Offline-First",
      color: "terracotta",
      description: "Synchronisation intelligente qui fonctionne même sans connexion stable",
      link: "/offline-first",
      features: [
        "Mode hors ligne intégral",
        "Synchronisation automatique",
        "Cache intelligent des données",
        "Consultation sans interruption"
      ]
    },
    {
      icon: CreditCard,
      title: "Mobile Money",
      color: "gold",
      description: "Paiements mobiles intégrés adaptés aux réalités africaines",
      link: "/mobile-money",
      features: [
        "Orange Money, M-Pesa, Airtel Money",
        "Paiements en devises locales",
        "Transactions instantanées",
        "Zéro frais cachés"
      ]
    },
    {
      icon: Shield,
      title: "Chiffrement E2E",
      color: "anthracite",
      description: "Sécurité de niveau bancaire pour protéger vos données de santé",
      link: "/chiffrement-e2e",
      features: [
        "Chiffrement de bout en bout",
        "Hébergement en Afrique",
        "Conformité RGPD africain",
        "Anonymisation garantie"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-terracotta/10 via-gold/5 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6"
          >
            <span className="text-xs font-sans font-bold text-terracotta uppercase tracking-wider">
              Africa-Ready
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-anthracite mb-6 tracking-tight leading-tight"
          >
            Une infrastructure <span className="italic">pensée pour l'Afrique</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-anthracite/70 font-sans max-w-3xl mx-auto leading-relaxed"
          >
            M.O.N.A a développé trois piliers technologiques majeurs pour offrir une expérience 
            de santé mentale premium adaptée aux réalités du continent : connectivité variable, 
            systèmes de paiement locaux et protection maximale des données sensibles.
          </motion.p>
        </div>
      </section>

      {/* Les 3 Piliers */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-6">
              <span className="text-xs font-sans font-bold text-gold uppercase tracking-wider">
                Les 3 piliers technologiques
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
              Excellence technique <span className="italic">pour l'Afrique</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {piliers.map((pilier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-beige/20 to-white p-8 rounded-2xl border-2 border-beige/30 hover:border-terracotta/30 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 bg-${pilier.color}/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <pilier.icon className={`w-7 h-7 text-${pilier.color}`} />
                </div>

                <h3 className="text-2xl font-serif text-anthracite mb-4">{pilier.title}</h3>
                <p className="text-anthracite/70 font-sans text-sm leading-relaxed mb-6">
                  {pilier.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {pilier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-sans text-anthracite/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={pilier.link}
                  className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-terracotta hover:text-terracotta/80 transition-colors duration-200"
                >
                  En savoir plus
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi Africa-Ready */}
      <section className="py-20 px-4 bg-gradient-to-br from-beige/20 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
              <span className="text-xs font-sans font-bold text-terracotta uppercase tracking-wider">
                Notre engagement
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
              Pourquoi <span className="italic">Africa-Ready</span> ?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-beige/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-anthracite mb-2">Connectivité variable</h3>
                  <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                    Les réseaux africains sont imprévisibles. Notre architecture Offline-First 
                    garantit que vos sessions thérapeutiques ne soient jamais interrompues par 
                    une coupure de connexion.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-beige/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-anthracite mb-2">Mobile-First</h3>
                  <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                    Plus de 80% des africains accèdent à internet via mobile. Notre plateforme 
                    est optimisée pour offrir une expérience parfaite sur smartphone, même avec 
                    une bande passante limitée.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-beige/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-anthracite mb-2">Paiements locaux</h3>
                  <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                    Les cartes bancaires restent rares. Notre intégration native avec Orange Money, 
                    M-Pesa et Airtel Money permet à chacun de payer facilement en devises locales.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-beige/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-anthracite mb-2">Souveraineté des données</h3>
                  <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                    Vos données de santé restent en Afrique, hébergées dans des datacenters 
                    conformes aux réglementations locales. Nous refusons que les données de 
                    santé africaines soient stockées à l'étranger.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* L'avantage compétitif */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-anthracite to-anthracite/90 text-white p-12 rounded-2xl">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-8">
                <Zap className="w-10 h-10 text-gold" />
                <h2 className="text-3xl md:text-4xl font-serif italic">
                  L'avantage M.O.N.A
                </h2>
              </div>
              <p className="text-xl text-white/90 font-sans leading-relaxed mb-8">
                Là où d'autres plateformes importent des solutions occidentales inadaptées, 
                M.O.N.A a construit une infrastructure de zéro spécifiquement pour l'Afrique. 
                Chaque ligne de code, chaque décision d'architecture tient compte des réalités 
                du continent.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-4xl font-serif text-gold mb-2">100%</div>
                  <div className="text-sm font-sans text-white/80">Fonctionnel hors ligne</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-4xl font-serif text-gold mb-2">15+</div>
                  <div className="text-sm font-sans text-white/80">Moyens de paiement mobiles</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <div className="text-4xl font-serif text-gold mb-2">256-bit</div>
                  <div className="text-sm font-sans text-white/80">Chiffrement de niveau militaire</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-terracotta via-terracotta to-terracotta/90 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
            Découvrez chaque pilier <span className="italic">en détail</span>
          </h2>
          <p className="text-xl text-white/90 font-sans mb-8 leading-relaxed">
            Explorez comment notre technologie Africa-Ready transforme l'accès à la santé mentale premium sur le continent.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              to="/offline-first"
              className="px-6 py-4 bg-white text-terracotta rounded-full hover:bg-white/90 transition-all duration-200 font-sans font-semibold shadow-xl"
            >
              Offline-First
            </Link>
            <Link
              to="/mobile-money"
              className="px-6 py-4 bg-white text-terracotta rounded-full hover:bg-white/90 transition-all duration-200 font-sans font-semibold shadow-xl"
            >
              Mobile Money
            </Link>
            <Link
              to="/chiffrement-e2e"
              className="px-6 py-4 bg-white text-terracotta rounded-full hover:bg-white/90 transition-all duration-200 font-sans font-semibold shadow-xl"
            >
              Chiffrement E2E
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
