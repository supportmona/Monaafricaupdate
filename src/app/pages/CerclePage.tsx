import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { useState } from "react";
import { Shield, Award, CheckCircle, Sparkles, Activity, Waves, Target, Users, QrCode, Calendar, Bell, CreditCard, Globe, Mail } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

interface PlaceholderCategory {
  id: string;
  label: string;
  icon: any;
  color: string;
  comingSoon: string;
  description: string;
  advantages: string[];
  emailPlaceholder: string;
}

export default function CerclePage() {
  const [activeFilter, setActiveFilter] = useState("tout-voir");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [subscribedCategories, setSubscribedCategories] = useState<string[]>([]);

  const filters = [
    { id: "tout-voir", label: "Tout voir", icon: Sparkles },
    { id: "sante-equilibre", label: "Santé & Équilibre", icon: Activity },
    { id: "sanctuaires", label: "Sanctuaires", icon: Waves },
    { id: "performance", label: "Performance", icon: Target },
    { id: "privileges", label: "Privilèges VIP", icon: Users }
  ];

  const placeholderCategories: Record<string, PlaceholderCategory> = {
    "sante-equilibre": {
      id: "sante-equilibre",
      label: "Santé & Équilibre",
      icon: Activity,
      color: "terracotta",
      comingSoon: "Mars 2026",
      description: "Accès prioritaire aux téléconsultations avec nos experts en santé mentale, suivi personnalisé de votre Mental Score, et programmes de bien-être sur-mesure.",
      advantages: [
        "Téléconsultations 24/7 avec experts certifiés",
        "Suivi Mental Score en temps réel via l'app",
        "Programmes de méditation guidée personnalisés",
        "Thérapie cognitive comportementale (TCC)",
        "Accès aux groupes de soutien communautaires"
      ],
      emailPlaceholder: "votre@email.com"
    },
    "sanctuaires": {
      id: "sanctuaires",
      label: "Sanctuaires",
      icon: Waves,
      color: "gold",
      comingSoon: "Avril 2026",
      description: "Notre sélection rigoureuse de spas, retraites wellness et espaces de neuro-apaisement à travers l'Afrique, audités selon le Standard M.O.N.A.",
      advantages: [
        "-15% sur tous les soins de neuro-apaisement",
        "Accès VIP aux espaces privatifs",
        "Réservation prioritaire via votre Passeport Santé",
        "Programmes de retraite wellness exclusifs",
        "Hammam et soins signature inclus"
      ],
      emailPlaceholder: "votre@email.com"
    },
    "performance": {
      id: "performance",
      label: "Performance",
      icon: Target,
      color: "terracotta",
      comingSoon: "Mai 2026",
      description: "Salles de sport premium, coaching personnalisé et programmes d'entraînement conçus pour optimiser votre bien-être physique et mental.",
      advantages: [
        "Accès à notre réseau de studios Pilates & Reformer",
        "Coaching privé avec professionnels certifiés",
        "-20% sur les carnets de séances",
        "Plans d'entraînement personnalisés via l'app",
        "Suivi de progression intégré au Mental Score"
      ],
      emailPlaceholder: "votre@email.com"
    },
    "privileges": {
      id: "privileges",
      label: "Privilèges VIP",
      icon: Users,
      color: "gold",
      comingSoon: "Mars 2026",
      description: "Expériences lifestyle premium, accès exclusifs et tarifs membres dans notre réseau d'établissements partenaires sélectionnés.",
      advantages: [
        "Surclassements automatiques dans les hôtels partenaires",
        "Événements exclusifs réservés aux membres",
        "Tarifs préférentiels négociés sur tous les services",
        "Conciergerie dédiée accessible via WhatsApp",
        "Accès prioritaire aux nouvelles expériences du Cercle"
      ],
      emailPlaceholder: "votre@email.com"
    }
  };

  // Pour l'instant, aucun partenaire réel (simulation)
  const partners: any[] = [];

  const handleSubscribe = (categoryId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (notificationEmail && !subscribedCategories.includes(categoryId)) {
      setSubscribedCategories([...subscribedCategories, categoryId]);
      setNotificationEmail("");
      // Ici, vous pourriez envoyer l'email à votre backend
      console.log(`Subscribed ${notificationEmail} to ${categoryId}`);
    }
  };

  const getFilteredContent = () => {
    if (activeFilter === "tout-voir") {
      return Object.values(placeholderCategories);
    }
    
    const category = placeholderCategories[activeFilter];
    return category ? [category] : [];
  };

  const filteredContent = getFilteredContent();

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 bg-gradient-to-br from-beige/30 via-white to-beige/10">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 bg-gold/10 border border-gold/20 rounded-full mb-6"
          >
            <span className="text-xs font-sans font-bold text-gold uppercase tracking-wider">
              Le Cercle M.O.N.A
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif text-anthracite mb-6 tracking-tight leading-tight"
          >
            Un écosystème de <span className="italic">privilèges</span> wellness
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-anthracite/70 font-sans max-w-3xl mx-auto leading-relaxed mb-8"
          >
            Une application unique pour simplifier l'accès à vos programmes de santé 
            et de lifestyle premium à travers l'Afrique.
          </motion.p>

          {/* Barre de Filtres */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
          >
            {filters.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-sm whitespace-nowrap transition-all duration-200
                    ${
                      isActive
                        ? "bg-terracotta text-white shadow-lg"
                        : "bg-white border border-beige/30 text-anthracite hover:border-terracotta/30 hover:bg-beige/10"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Le Standard M.O.N.A Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6">
              <span className="text-xs font-sans font-bold text-terracotta uppercase tracking-wider">
                Le Standard M.O.N.A
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
              L'excellence comme seul critère
            </h2>
            <p className="text-lg text-anthracite/70 font-sans max-w-3xl mx-auto leading-relaxed">
              Chaque établissement du Cercle est rigoureusement audité pour répondre 
              à nos critères de neuro-apaisement et d'excellence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-beige/10 p-8 rounded-2xl border-l-4 border-terracotta">
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="text-xl font-serif text-anthracite mb-3">Audit rigoureux</h3>
              <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                Chaque partenaire est évalué sur 47 critères incluant l'hygiène, 
                la qualité du service, l'approche holistique et le respect de 
                l'environnement.
              </p>
            </div>

            <div className="bg-beige/10 p-8 rounded-2xl border-l-4 border-gold">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-xl font-serif text-anthracite mb-3">Certification M.O.N.A</h3>
              <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                Seuls les établissements répondant à notre standard de neuro-apaisement 
                reçoivent la certification M.O.N.A, gage d'une expérience premium.
              </p>
            </div>

            <div className="bg-beige/10 p-8 rounded-2xl border-l-4 border-terracotta">
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="text-xl font-serif text-anthracite mb-3">Suivi continu</h3>
              <p className="text-anthracite/70 font-sans text-sm leading-relaxed">
                Des évaluations trimestrielles et le feedback de nos membres assurent 
                le maintien des standards d'excellence dans le temps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder Cards Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-beige/5 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredContent.map((category) => {
              const Icon = category.icon;
              const isSubscribed = subscribedCategories.includes(category.id);
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border-2 border-beige/20 rounded-2xl p-8 hover:border-terracotta/30 hover:shadow-xl transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 bg-${category.color}/10 rounded-full flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 text-${category.color}`} />
                    </div>
                    <div className="bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5">
                      <span className="text-xs font-sans text-gold font-bold uppercase tracking-wide">
                        {category.comingSoon}
                      </span>
                    </div>
                  </div>

                  {/* Titre */}
                  <h3 className="text-3xl font-serif text-anthracite mb-4">
                    Bientôt : {category.label}
                  </h3>

                  {/* Description */}
                  <p className="text-anthracite/70 font-sans leading-relaxed mb-6">
                    {category.description}
                  </p>

                  {/* Avantages */}
                  <div className="mb-6">
                    <h4 className="text-sm font-sans font-bold text-anthracite mb-3 uppercase tracking-wide">
                      Vos futurs privilèges
                    </h4>
                    <ul className="space-y-2">
                      {category.advantages.map((advantage, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-terracotta flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-anthracite/80 font-sans">{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Point d'accès unique */}
                  <div className="bg-gradient-to-r from-gold/5 to-terracotta/5 border border-gold/20 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <QrCode className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-sm font-sans font-semibold text-anthracite mb-1">
                          Un seul identifiant M.O.N.A
                        </h5>
                        <p className="text-xs text-anthracite/70 font-sans leading-relaxed">
                          Tous ces services seront accessibles avec votre Passeport Santé unique. 
                          Une seule connexion, une seule app, tous vos avantages.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Formulaire de notification */}
                  {!isSubscribed ? (
                    <form onSubmit={(e) => handleSubscribe(category.id, e)} className="space-y-3">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-anthracite/40" />
                        <input
                          type="email"
                          required
                          value={notificationEmail}
                          onChange={(e) => setNotificationEmail(e.target.value)}
                          placeholder={category.emailPlaceholder}
                          className="w-full pl-11 pr-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta transition-colors font-sans text-sm"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold"
                      >
                        <Bell className="w-4 h-4" />
                        <span>Être informé de l'ouverture</span>
                      </button>
                    </form>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-sans text-green-800 font-semibold">
                        Vous serez notifié lors de l'ouverture !
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Passeport Santé - L'outil qui débloque */}
      <section className="py-20 px-4 bg-gradient-to-br from-anthracite via-anthracite to-anthracite/90 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1.5 bg-gold/20 border border-gold/30 rounded-full mb-6">
                <span className="text-xs font-sans font-bold text-gold uppercase tracking-wider">
                  Technologie M.O.N.A
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
                Votre Passeport Santé FHIR
              </h2>
              <p className="text-lg text-white/80 font-sans leading-relaxed mb-8">
                Un QR Code unique qui débloque tous vos privilèges au fur et à mesure 
                de l'expansion du réseau M.O.N.A à travers l'Afrique.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-terracotta/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold mb-1">Identification instantanée</h4>
                    <p className="text-sm text-white/70">
                      Présentez votre QR Code dans tous les établissements du Cercle
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold mb-1">Paiement simplifié</h4>
                    <p className="text-sm text-white/70">
                      Vos avantages sont appliqués automatiquement
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-terracotta/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-terracotta" />
                  </div>
                  <div>
                    <h4 className="font-sans font-semibold mb-1">Extension continue</h4>
                    <p className="text-sm text-white/70">
                      De nouveaux partenaires rejoignent le réseau chaque mois
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to="/passeport-sante"
                className="inline-block px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-xl"
              >
                Découvrir le Passeport Santé
              </Link>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <div className="bg-white rounded-xl p-6">
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 bg-gradient-to-br from-beige/30 to-beige/10 rounded-xl flex items-center justify-center mb-4 border-2 border-beige/20">
                    <QrCode className="w-24 h-24 text-anthracite/70" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-anthracite/50 font-sans mb-1">Votre identifiant unique</p>
                    <p className="font-mono text-anthracite/70 text-xs">MONA-CD-KIN-2026-XXXX</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-xs text-white/60 font-sans">
                  Votre carte virtuelle M.O.N.A
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pour les Membres vs Pour les RH */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-anthracite mb-6 leading-tight">
              Une plateforme pour tous
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pour les Membres */}
            <div className="bg-gradient-to-br from-beige/20 to-beige/5 p-8 rounded-2xl border border-beige/30">
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="text-2xl font-serif text-anthracite mb-4">Pour les Membres</h3>
              <p className="text-anthracite/70 font-sans leading-relaxed mb-6">
                Une application commune qui simplifie l'accès à tous vos programmes de 
                santé mentale, wellness et lifestyle.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-anthracite/80 font-sans">
                    Réservations centralisées pour tous vos soins
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-anthracite/80 font-sans">
                    Suivi de votre parcours bien-être via Mental Score
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-anthracite/80 font-sans">
                    Avantages exclusifs négociés pour vous
                  </span>
                </li>
              </ul>
              <Link
                to="/membres"
                className="mt-6 inline-block px-6 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans text-sm font-semibold"
              >
                En savoir plus
              </Link>
            </div>

            {/* Pour les Leaders RH */}
            <div className="bg-gradient-to-br from-gold/10 to-gold/5 p-8 rounded-2xl border border-gold/30">
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-2xl font-serif text-anthracite mb-4">Pour les Leaders RH</h3>
              <p className="text-anthracite/70 font-sans leading-relaxed mb-6">
                Un système modulable où vous pouvez activer ou désactiver des catégories 
                d'avantages selon les besoins de vos employés.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-anthracite/80 font-sans">
                    Contrôle granulaire des programmes accessibles
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-anthracite/80 font-sans">
                    Reporting détaillé sur l'utilisation et l'impact
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-anthracite/80 font-sans">
                    Budget maîtrisé avec facturation mensuelle unifiée
                  </span>
                </li>
              </ul>
              <Link
                to="/business"
                className="mt-6 inline-block px-6 py-3 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all duration-200 font-sans text-sm font-semibold"
              >
                Solutions entreprises
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Rejoindre l'écosystème */}
      <section className="py-20 px-4 bg-gradient-to-br from-terracotta via-terracotta to-terracotta/90 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
            Rejoignez l'écosystème M.O.N.A
          </h2>
          <p className="text-xl text-white/90 font-sans mb-8 leading-relaxed">
            Vous êtes un établissement premium qui partage notre vision de l'excellence 
            et du bien-être ? Élevez les attentes en matière de santé mentale et de lifestyle 
            en rejoignant notre réseau.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/partenariats"
              className="px-8 py-4 bg-white text-terracotta rounded-full hover:bg-white/90 transition-all duration-200 font-sans font-semibold shadow-xl"
            >
              Devenir Partenaire
            </Link>
            <Link
              to="/onboarding"
              className="px-8 py-4 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all duration-200 font-sans font-semibold shadow-xl"
            >
              Devenir Membre
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}