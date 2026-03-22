import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { Globe, Target, TrendingUp, Zap, MapPin, Building2, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export default function VisionAfricaFirstPage() {
  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-gold/20 via-beige/10 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-6"
          >
            <span className="text-xs font-sans font-bold text-gold uppercase tracking-wider">
              Vision Africa-First
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-anthracite mb-6 tracking-tight leading-tight"
          >
            Conçu pour l'Afrique, <span className="italic">par l'Afrique</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-anthracite/70 font-sans max-w-3xl mx-auto leading-relaxed"
          >
            M.O.N.A place l'Afrique au centre de sa stratégie. Nous ne sommes pas une 
            adaptation d'un modèle occidental, mais une innovation pensée dès le départ 
            pour répondre aux besoins spécifiques du continent.
          </motion.p>
        </div>
      </section>

      {/* L'Afrique au centre */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
              <span className="text-xs font-sans font-bold text-terracotta uppercase tracking-wider">
                Notre positionnement
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
              Pourquoi <span className="italic">Africa-First</span> ?
            </h2>
            <p className="text-lg text-anthracite/70 font-sans max-w-3xl mx-auto leading-relaxed">
              Trop souvent, les solutions de santé en Afrique sont des copies de modèles 
              étrangers inadaptés. M.O.N.A adopte une approche radicalement différente.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-beige/30 to-beige/10 p-8 rounded-2xl border-l-4 border-terracotta">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-anthracite mb-2">Conçu d'abord pour l'Afrique</h3>
                  <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                    Nos technologies, processus et programmes sont développés en tenant 
                    compte des infrastructures, cultures et besoins africains dès la 
                    première ligne de code.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-beige/30 to-beige/10 p-8 rounded-2xl border-l-4 border-gold">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-anthracite mb-2">Leadership africain</h3>
                  <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                    Notre équipe dirigeante et nos experts sont majoritairement africains 
                    ou issus de la diaspora, garantissant une compréhension authentique 
                    des réalités locales.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-beige/30 to-beige/10 p-8 rounded-2xl border-l-4 border-terracotta">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-anthracite mb-2">Croissance organique</h3>
                  <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                    Notre expansion suit les dynamiques économiques africaines, en 
                    commençant par les capitales stratégiques : Kinshasa, Dakar, Abidjan.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-beige/30 to-beige/10 p-8 rounded-2xl border-l-4 border-gold">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-anthracite mb-2">Innovation locale</h3>
                  <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                    Nous développons nos propres solutions (Passeport Santé FHIR, Mental 
                    Score) plutôt que d'importer des technologies inadaptées.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Expansion Pan-Africaine */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-20"
      >
        <div className="flex items-center gap-3 mb-8">
          <Globe className="w-8 h-8 text-gold" />
          <h2 className="text-3xl md:text-4xl font-serif text-anthracite italic">
            Une vision pan-africaine
          </h2>
        </div>

        <p className="text-lg text-anthracite/80 font-sans leading-relaxed mb-12">
          M.O.N.A ne limite pas son ambition à quelques capitales. Notre vision est d'offrir 
          une infrastructure de santé mentale premium accessible à toute l'Afrique francophone 
          et au-delà. Avec notre technologie Offline-First et notre modèle de tarification 
          adapté, nous créons un écosystème qui s'étend naturellement à mesure que la demande 
          se manifeste.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Coeur stratégique */}
          <div className="bg-gradient-to-br from-terracotta/10 to-gold/5 p-8 rounded-2xl shadow-lg border-2 border-terracotta/20">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-terracotta" />
              <h3 className="text-xl font-serif text-anthracite">Hubs stratégiques initiaux</h3>
            </div>
            <p className="text-base text-anthracite/80 font-sans leading-relaxed mb-4">
              Nous établissons nos premiers centres d'excellence à <strong>Kinshasa</strong>, 
              <strong> Dakar</strong> et <strong>Abidjan</strong>, trois métropoles 
              qui représentent la diversité et le dynamisme de l'Afrique francophone.
            </p>
            <div className="bg-white/50 p-4 rounded-xl mt-4">
              <p className="text-sm text-anthracite/70 font-sans italic">
                Ces hubs serviront de modèles reproductibles pour une expansion organique 
                à travers le continent.
              </p>
            </div>
          </div>

          {/* Expansion ouverte */}
          <div className="bg-gradient-to-br from-gold/10 to-beige/5 p-8 rounded-2xl shadow-lg border-2 border-gold/20">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-gold" />
              <h3 className="text-xl font-serif text-anthracite">Croissance pan-africaine</h3>
            </div>
            <p className="text-base text-anthracite/80 font-sans leading-relaxed mb-4">
              Notre infrastructure digitale permet une expansion rapide vers 
              <strong> Libreville</strong>, <strong>Brazzaville</strong>, 
              <strong> Douala</strong>, <strong>Lagos</strong>, <strong>Accra</strong>, 
              <strong> Nairobi</strong> et bien au-delà.
            </p>
            <div className="bg-white/50 p-4 rounded-xl mt-4">
              <p className="text-sm text-anthracite/70 font-sans italic">
                Chaque nouveau marché renforce notre réseau d'experts et enrichit 
                notre compréhension des nuances culturelles africaines.
              </p>
            </div>
          </div>
        </div>

        {/* Valeurs clés */}
        <div className="bg-anthracite text-white p-8 md:p-12 rounded-2xl">
          <h3 className="text-2xl font-serif mb-6 italic">Notre approche d'expansion</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="w-12 h-12 bg-terracotta/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-terracotta" />
              </div>
              <h4 className="text-lg font-sans font-semibold mb-2">Organique</h4>
              <p className="text-sm text-white/80 font-sans leading-relaxed">
                Nous nous développons là où les besoins sont les plus pressants, 
                guidés par la demande réelle plutôt que par un calendrier arbitraire.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-gold" />
              </div>
              <h4 className="text-lg font-sans font-semibold mb-2">Adaptative</h4>
              <p className="text-sm text-white/80 font-sans leading-relaxed">
                Chaque marché apporte ses spécificités. Nous adaptons notre offre 
                tout en maintenant l'excellence de notre standard de soins.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 bg-beige/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-beige" />
              </div>
              <h4 className="text-lg font-sans font-semibold mb-2">Durable</h4>
              <p className="text-sm text-white/80 font-sans leading-relaxed">
                Notre croissance repose sur des partenariats locaux solides et 
                un engagement envers la formation continue de nos experts.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Les piliers de notre vision */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
              <span className="text-xs font-sans font-bold text-terracotta uppercase tracking-wider">
                Nos engagements
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
              Les piliers de notre <span className="italic">vision</span>
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-beige/20 to-white p-8 rounded-xl border border-beige/30">
              <h3 className="text-2xl font-serif text-anthracite mb-3">
                1. Excellence sans compromis
              </h3>
              <p className="text-anthracite/70 font-sans leading-relaxed">
                Nous refusons de baisser nos standards sous prétexte que "c'est pour 
                l'Afrique". Nos membres méritent le meilleur, et nous le leur offrons.
              </p>
            </div>

            <div className="bg-gradient-to-r from-beige/20 to-white p-8 rounded-xl border border-beige/30">
              <h3 className="text-2xl font-serif text-anthracite mb-3">
                2. Accessibilité financière
              </h3>
              <p className="text-anthracite/70 font-sans leading-relaxed">
                Excellence ne signifie pas inaccessible. Nos tarifs sont pensés pour les 
                réalités économiques africaines, avec des options de paiement mobile et 
                des programmes entreprises.
              </p>
            </div>

            <div className="bg-gradient-to-r from-beige/20 to-white p-8 rounded-xl border border-beige/30">
              <h3 className="text-2xl font-serif text-anthracite mb-3">
                3. Souveraineté des données
              </h3>
              <p className="text-anthracite/70 font-sans leading-relaxed">
                Vos données de santé restent sur le continent, hébergées dans des 
                datacenters africains conformes aux réglementations locales de protection 
                des données.
              </p>
            </div>

            <div className="bg-gradient-to-r from-beige/20 to-white p-8 rounded-xl border border-beige/30">
              <h3 className="text-2xl font-serif text-anthracite mb-3">
                4. Création d'emplois locaux
              </h3>
              <p className="text-anthracite/70 font-sans leading-relaxed">
                Nous privilégions l'embauche de talents africains : thérapeutes, 
                développeurs, équipes commerciales. M.O.N.A est un employeur africain fier.
              </p>
            </div>

            <div className="bg-gradient-to-r from-beige/20 to-white p-8 rounded-xl border border-beige/30">
              <h3 className="text-2xl font-serif text-anthracite mb-3">
                5. Partenariats locaux
              </h3>
              <p className="text-anthracite/70 font-sans leading-relaxed">
                Notre réseau "Le Cercle" est composé d'établissements africains premium 
                (spas, studios de fitness, retraites wellness) que nous aidons à se 
                développer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gold via-gold to-gold/90 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
            Rejoignez le mouvement <span className="italic">Africa-First</span>
          </h2>
          <p className="text-xl text-white/90 font-sans mb-8 leading-relaxed">
            Ensemble, élevons les standards de santé mentale et de bien-être sur le continent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/onboarding"
              className="px-8 py-4 bg-white text-gold rounded-full hover:bg-white/90 transition-all duration-200 font-sans font-semibold shadow-xl"
            >
              Devenir Membre
            </a>
            <a
              href="/partenariats"
              className="px-8 py-4 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all duration-200 font-sans font-semibold shadow-xl"
            >
              Devenir Partenaire
            </a>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}