import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { Wifi, WifiOff, RefreshCw, Database, Smartphone, Cloud, CheckCircle, Zap, Clock } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function OfflineFirstPage() {
  const features = [
    {
      icon: WifiOff,
      title: "Mode hors ligne intégral",
      description: "Accédez à votre passeport santé, consultez vos rendez-vous et utilisez les outils de bien-être même sans connexion internet."
    },
    {
      icon: RefreshCw,
      title: "Synchronisation automatique",
      description: "Dès que la connexion revient, toutes vos données sont synchronisées en arrière-plan sans interruption de votre expérience."
    },
    {
      icon: Database,
      title: "Cache intelligent",
      description: "L'application stocke localement les données essentielles sur votre appareil pour un accès instantané, même hors ligne."
    },
    {
      icon: Clock,
      title: "Consultation sans interruption",
      description: "Vos séances de thérapie par chat ou vidéo continuent même en cas de coupure réseau temporaire."
    }
  ];

  const useCases = [
    {
      title: "Dans les transports",
      description: "Consultez votre passeport santé et préparez vos questions pour votre prochain rendez-vous pendant vos déplacements, même sans 4G.",
      icon: Smartphone
    },
    {
      title: "Zones rurales",
      description: "Les membres vivant dans des zones avec une connectivité limitée bénéficient de la même expérience premium que ceux en ville.",
      icon: Wifi
    },
    {
      title: "Coupures de courant",
      description: "Les délestages fréquents n'affectent plus vos consultations. La synchronisation reprend automatiquement.",
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-terracotta/10 via-beige/5 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6"
          >
            <span className="text-xs font-sans font-bold text-terracotta uppercase tracking-wider">
              Offline-First
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-anthracite mb-6 tracking-tight leading-tight"
          >
            Toujours accessible, <span className="italic">même hors ligne</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-anthracite/70 font-sans max-w-3xl mx-auto leading-relaxed"
          >
            En Afrique, la connectivité internet est imprévisible. M.O.N.A a développé une 
            architecture Offline-First qui garantit une expérience fluide et ininterrompue, 
            que vous soyez en ligne ou non.
          </motion.p>
        </div>
      </section>

      {/* Le défi africain */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-6">
              <span className="text-xs font-sans font-bold text-gold uppercase tracking-wider">
                Le contexte africain
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
              Comprendre le <span className="italic">défi</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-beige/30 to-beige/10 p-8 rounded-2xl border-l-4 border-terracotta">
              <h3 className="text-2xl font-serif text-anthracite mb-4">Connectivité instable</h3>
              <p className="text-anthracite/70 font-sans leading-relaxed mb-4">
                Les réseaux mobiles africains offrent souvent des débits variables et des 
                coupures fréquentes, même dans les grandes villes. Les délestages électriques 
                réguliers affectent également les antennes relais.
              </p>
              <div className="bg-white/70 p-4 rounded-xl">
                <p className="text-sm text-anthracite/80 font-sans italic">
                  40% des utilisateurs africains font face à des interruptions de connexion 
                  quotidiennes, selon GSMA Mobile Economy 2024.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-beige/30 to-beige/10 p-8 rounded-2xl border-l-4 border-gold">
              <h3 className="text-2xl font-serif text-anthracite mb-4">Bande passante limitée</h3>
              <p className="text-anthracite/70 font-sans leading-relaxed mb-4">
                Même lorsque la connexion est présente, les débits 3G/4G sont souvent 
                insuffisants pour des applications gourmandes en données. Les forfaits data 
                restent chers par rapport aux revenus moyens.
              </p>
              <div className="bg-white/70 p-4 rounded-xl">
                <p className="text-sm text-anthracite/80 font-sans italic">
                  Le coût moyen d'1 Go de data représente 3 à 5% du revenu mensuel moyen 
                  dans plusieurs pays africains.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-terracotta/5 to-gold/5 p-8 rounded-2xl border-2 border-terracotta/20">
            <h3 className="text-2xl font-serif text-anthracite mb-4 text-center">
              Notre réponse : <span className="italic">Offline-First</span>
            </h3>
            <p className="text-lg text-anthracite/80 font-sans leading-relaxed text-center max-w-4xl mx-auto">
              Plutôt que de considérer le mode hors ligne comme une limitation, nous en avons 
              fait la base de notre architecture. M.O.N.A fonctionne d'abord sans connexion, 
              puis se synchronise intelligemment quand le réseau est disponible.
            </p>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="py-20 px-4 bg-gradient-to-br from-beige/20 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
              <span className="text-xs font-sans font-bold text-terracotta uppercase tracking-wider">
                Fonctionnalités clés
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
              Comment ça <span className="italic">fonctionne</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-beige/30 hover:border-terracotta/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-terracotta/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-7 h-7 text-terracotta" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-anthracite mb-3">{feature.title}</h3>
                    <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cas d'usage */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-6">
              <span className="text-xs font-sans font-bold text-gold uppercase tracking-wider">
                Cas d'usage
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
              Toujours à vos <span className="italic">côtés</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-beige/20 to-white p-8 rounded-2xl border-2 border-beige/30"
              >
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-6">
                  <useCase.icon className="w-6 h-6 text-terracotta" />
                </div>
                <h3 className="text-xl font-serif text-anthracite mb-3">{useCase.title}</h3>
                <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                  {useCase.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture technique */}
      <section className="py-20 px-4 bg-gradient-to-br from-anthracite to-anthracite/90 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 rounded-full mb-6">
              <span className="text-xs font-sans font-bold text-white uppercase tracking-wider">
                Architecture technique
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Une technologie <span className="italic">robuste</span>
            </h2>
            <p className="text-xl text-white/80 font-sans max-w-3xl mx-auto leading-relaxed">
              Notre architecture Offline-First repose sur des technologies éprouvées et des 
              standards industriels pour garantir fiabilité et performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-terracotta/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Database className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <h3 className="text-xl font-sans font-semibold mb-2">Stockage local chiffré</h3>
                  <p className="text-sm text-white/80 font-sans leading-relaxed">
                    Les données sensibles sont stockées de manière sécurisée sur votre appareil 
                    avec un chiffrement AES-256. Rien ne transite en clair.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Cloud className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-sans font-semibold mb-2">Synchronisation delta</h3>
                  <p className="text-sm text-white/80 font-sans leading-relaxed">
                    Seules les modifications sont transmises lors de la synchronisation, 
                    réduisant drastiquement la consommation de données mobiles.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-terracotta/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <h3 className="text-xl font-sans font-semibold mb-2">Gestion des conflits</h3>
                  <p className="text-sm text-white/80 font-sans leading-relaxed">
                    Si des modifications sont effectuées simultanément hors ligne et en ligne, 
                    notre système résout intelligemment les conflits.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Wifi className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-sans font-semibold mb-2">Détection réseau intelligente</h3>
                  <p className="text-sm text-white/80 font-sans leading-relaxed">
                    L'application détecte automatiquement la qualité de votre connexion et 
                    ajuste ses stratégies de synchronisation en conséquence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages pour vous */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
              <span className="text-xs font-sans font-bold text-terracotta uppercase tracking-wider">
                Vos avantages
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
              Ce que cela change <span className="italic">pour vous</span>
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-beige/20 to-white p-8 rounded-xl border border-beige/30 flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-terracotta flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-serif text-anthracite mb-2">Zéro interruption</h3>
                <p className="text-anthracite/70 font-sans leading-relaxed">
                  Vos sessions thérapeutiques, consultations et exercices de bien-être ne sont 
                  jamais interrompus par un problème réseau. Votre bien-être mental passe avant tout.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-beige/20 to-white p-8 rounded-xl border border-beige/30 flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-terracotta flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-serif text-anthracite mb-2">Économie de data</h3>
                <p className="text-anthracite/70 font-sans leading-relaxed">
                  Notre système de synchronisation intelligente minimise la consommation de données. 
                  Vous gardez le contrôle de vos forfaits mobiles tout en bénéficiant d'une expérience complète.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-beige/20 to-white p-8 rounded-xl border border-beige/30 flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-terracotta flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-serif text-anthracite mb-2">Accès instantané</h3>
                <p className="text-anthracite/70 font-sans leading-relaxed">
                  Vos informations de santé, rendez-vous et outils thérapeutiques sont disponibles 
                  instantanément, sans temps de chargement. Même en zone blanche.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-terracotta via-terracotta to-terracotta/90 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
            Découvrez M.O.N.A <span className="italic">en action</span>
          </h2>
          <p className="text-xl text-white/90 font-sans mb-8 leading-relaxed">
            Testez notre plateforme Offline-First et vivez une expérience de santé mentale 
            sans compromis, même avec une connexion instable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demo"
              className="px-8 py-4 bg-white text-terracotta rounded-full hover:bg-white/90 transition-all duration-200 font-sans font-semibold shadow-xl"
            >
              Demander une démo
            </Link>
            <Link
              to="/africa-ready"
              className="px-8 py-4 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all duration-200 font-sans font-semibold shadow-xl"
            >
              Retour Africa-Ready
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
