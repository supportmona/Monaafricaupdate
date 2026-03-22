import { motion } from "motion/react";
import { Link } from "react-router";
import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/carousel.css";
import {
  GraduationCap,
  Clock,
  Users,
  Shield,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Calendar,
  BookOpen,
  Heart,
  Sparkles,
  Zap,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import NavigationBar from "../components/NavigationBar";
import FooterSection from "../components/FooterSection";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import { useNavigate } from "react-router";

// Custom arrow components for react-slick
const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="slick-arrow slick-prev"
      aria-label="Previous"
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  );
};

const CustomNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="slick-arrow slick-next"
      aria-label="Next"
    >
      <ChevronRight className="w-6 h-6" />
    </button>
  );
};

export default function Students() {
  const [currency, setCurrency] = useState<"XOF" | "USD">("XOF");

  const stats = [
    { number: "26%", label: "d'économie" },
    { number: "24/7", label: "Disponibilité" },
    { number: "100+", label: "Experts certifiés" },
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Tarifs Adaptés",
      description:
        "45% de réduction avec carte étudiante valide.",
      color: "from-terracotta/20 to-terracotta/5",
      iconBg: "bg-terracotta/10",
      iconColor: "text-terracotta",
    },
    {
      icon: Clock,
      title: "Horaires Flexibles",
      description:
        "Séances entre vos cours, le soir ou le weekend.",
      color: "from-gold/20 to-gold/5",
      iconBg: "bg-gold/10",
      iconColor: "text-gold",
    },
    {
      icon: Users,
      title: "Experts Spécialisés",
      description:
        "Psychologues formés aux défis étudiants.",
      color: "from-beige to-beige/5",
      iconBg: "bg-beige/50",
      iconColor: "text-anthracite",
    },
    {
      icon: Shield,
      title: "100% Confidentiel",
      description:
        "Vos consultations restent privées.",
      color: "from-terracotta/20 to-terracotta/5",
      iconBg: "bg-terracotta/10",
      iconColor: "text-terracotta",
    },
  ];

  const pricingTiers = [
    {
      name: "Séance Unique",
      subtitle: "Santé Mentale",
      priceXOF: "18,500",
      priceUSD: "35",
      duration: "45 min",
      features: [
        "1 séance de 45 minutes",
        "Consultation santé mentale",
        "Choix de l'expert",
        "Notes de séance",
        "Support 24/7",
      ],
      cta: "Réserver maintenant",
      featured: false,
      badge: "PRIX SOCIAL",
      gradient: "from-beige/50 to-white",
      borderColor: "border-beige/30",
    },
    {
      name: "Pack 5 Séances",
      priceXOF: "85,000",
      priceUSD: "155",
      originalPriceXOF: "125,000",
      originalPriceUSD: "225",
      features: [
        "5 séances au choix",
        "Santé primaire ou mentale",
        "Suivi personnalisé",
        "Report possible",
        "Priorité de réservation",
      ],
      cta: "Choisir ce pack",
      featured: true,
      badge: "LE PLUS POPULAIRE",
      discount: "-32%",
      gradient: "from-terracotta/10 via-gold/5 to-white",
      borderColor: "border-terracotta",
    },
    {
      name: "Pack 10 Séances",
      priceXOF: "150,000",
      priceUSD: "270",
      originalPriceXOF: "250,000",
      originalPriceUSD: "450",
      features: [
        "10 séances au choix",
        "Santé primaire ou mentale",
        "Suivi approfondi",
        "Report flexible",
        "Accès ressources premium",
      ],
      cta: "Obtenir le pack",
      featured: false,
      discount: "-40%",
      gradient: "from-gold/30 to-white",
      borderColor: "border-gold/30",
    },
  ];

  const verificationSteps = [
    {
      number: "01",
      title: "Créez votre compte",
      description: "Inscrivez-vous gratuitement en 2 minutes avec votre email étudiant.",
      icon: Sparkles,
      color: "from-terracotta to-terracotta/80",
    },
    {
      number: "02",
      title: "Vérifiez votre statut",
      description:
        "Téléchargez une photo de votre carte étudiante valide ou un certificat de scolarité.",
      icon: Zap,
      color: "from-gold to-gold/80",
    },
    {
      number: "03",
      title: "Profitez des avantages",
      description: "Une fois validé, votre réduction s'applique automatiquement.",
      icon: Star,
      color: "from-terracotta/80 to-gold",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Floating Background Shapes */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-terracotta/10 to-gold/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, -30, 0],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-gradient-to-tl from-gold/15 to-beige/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-r from-terracotta/5 to-gold/5 rounded-full blur-2xl"
        />
      </div>

      <NavigationBar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-terracotta/20 via-gold/20 to-terracotta/20 rounded-full mb-6 backdrop-blur-sm border border-terracotta/20">
                  <GraduationCap className="w-5 h-5 text-terracotta" />
                  <span className="text-xs tracking-[0.2em] uppercase text-terracotta font-sans font-bold">
                    PROGRAMME ÉTUDIANT
                  </span>
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-terracotta via-gold to-terracotta rounded-full mb-6" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-anthracite mb-6 leading-tight"
              >
                Votre bien-être,{" "}
                <span className="italic bg-gradient-to-r from-terracotta to-gold bg-clip-text text-transparent">
                  priorité absolue
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg sm:text-xl text-muted-foreground font-sans mb-8 leading-relaxed"
              >
                Études exigeantes, pression financière, adaptation à un nouvel environnement.
                M.O.N.A comprend les défis uniques de la vie étudiante et vous accompagne avec
                des tarifs sociaux adaptés à votre réalité.
              </motion.p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 rounded-2xl bg-gradient-to-br from-beige/30 to-white border border-beige/20 backdrop-blur-sm"
                  >
                    <div className="text-3xl lg:text-4xl font-serif bg-gradient-to-r from-terracotta to-gold bg-clip-text text-transparent mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  to="/onboarding"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-terracotta to-gold text-white rounded-full hover:shadow-2xl transition-all duration-300 font-sans font-semibold shadow-lg group"
                >
                  Réserver une consultation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#tarifs"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-anthracite border-2 border-anthracite rounded-full hover:bg-anthracite hover:text-white transition-all duration-300 font-sans font-semibold"
                >
                  Voir les tarifs
                </a>
              </motion.div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] lg:h-[600px] border-4 border-white">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1769794371055-54436b54577e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib29rcyUyMGRlc2slMjBub3RlYm9vayUyMHN0dWR5JTIwb3JnYW5pemVkfGVufDF8fHx8MTc3MDI2MDEyNXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Étudiant concentré"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-anthracite/60 via-transparent to-transparent" />
                
                {/* Floating Badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-6 right-6 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-sans font-semibold text-anthracite">Disponible 24/7</span>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Shapes */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-terracotta/30 to-gold/30 rounded-full blur-xl"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-tl from-gold/40 to-terracotta/20 rounded-full blur-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-16 lg:py-20 bg-gradient-to-b from-white via-beige/5 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="mb-6">
              <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase bg-gradient-to-r from-terracotta to-gold bg-clip-text text-transparent font-sans font-bold mb-3">
                VOS AVANTAGES
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-terracotta via-gold to-terracotta rounded-full mx-auto" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4 leading-tight">
              Un accompagnement{" "}
              <span className="italic bg-gradient-to-r from-terracotta to-gold bg-clip-text text-transparent">
                pensé pour vous
              </span>
            </h2>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="relative"
                >
                  <div className={`relative p-6 bg-gradient-to-br ${benefit.color} rounded-2xl border border-beige/30 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden h-full`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50" />

                    <div className={`relative mb-4 inline-flex p-3 ${benefit.iconBg} rounded-xl transition-transform duration-300 w-fit`}>
                      <Icon className={`w-6 h-6 ${benefit.iconColor}`} />
                    </div>

                    <h3 className="relative text-lg font-serif text-anthracite mb-2">
                      {benefit.title}
                    </h3>
                    <p className="relative text-sm text-muted-foreground font-sans leading-relaxed">
                      {benefit.description}
                    </p>

                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gold/20 to-transparent rounded-bl-full opacity-50" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tarifs" className="relative py-20 lg:py-32 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-beige/20 via-white to-gold/10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="mb-8">
              <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase bg-gradient-to-r from-terracotta to-gold bg-clip-text text-transparent font-sans font-bold mb-3">
                TARIFS ÉTUDIANTS
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-terracotta via-gold to-terracotta rounded-full mx-auto" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-6 leading-tight">
              Des tarifs qui{" "}
              <span className="italic bg-gradient-to-r from-terracotta to-gold bg-clip-text text-transparent">
                respectent votre budget
              </span>
            </h2>
            <p className="text-lg text-muted-foreground font-sans max-w-3xl mx-auto mb-8">
              Tarifs étudiants pour la santé mentale et packs avantageux mixables santé primaire ou mentale.
            </p>

            {/* Currency Toggle */}
            <div className="inline-flex items-center gap-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-beige/30">
              <button
                onClick={() => setCurrency("XOF")}
                className={`px-8 py-3 rounded-full font-sans font-semibold transition-all duration-300 ${
                  currency === "XOF"
                    ? "bg-gradient-to-r from-terracotta to-gold text-white shadow-lg scale-105"
                    : "text-anthracite hover:bg-beige/30"
                }`}
              >
                XOF
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`px-8 py-3 rounded-full font-sans font-semibold transition-all duration-300 ${
                  currency === "USD"
                    ? "bg-gradient-to-r from-terracotta to-gold text-white shadow-lg scale-105"
                    : "text-anthracite hover:bg-beige/30"
                }`}
              >
                USD
              </button>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
            {pricingTiers.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -12, scale: 1.02 }}
                className={`relative ${tier.featured ? "md:-mt-4" : ""}`}
              >
                {tier.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
                  >
                    <div className="px-5 py-2 bg-gradient-to-r from-terracotta to-gold text-white text-[10px] tracking-[0.15em] uppercase font-sans font-bold rounded-full shadow-xl">
                      {tier.badge}
                    </div>
                  </motion.div>
                )}

                <div
                  className={`relative h-full p-8 bg-gradient-to-br ${tier.gradient} rounded-3xl border-2 transition-all duration-500 ${
                    tier.featured
                      ? `${tier.borderColor} shadow-2xl`
                      : `${tier.borderColor} hover:border-terracotta/50 hover:shadow-xl`
                  } overflow-hidden`}
                >
                  {/* Animated Gradient Overlay */}
                  {tier.featured && (
                    <motion.div
                      className="absolute inset-0 opacity-30"
                      animate={{
                        background: [
                          "radial-gradient(circle at 0% 0%, rgba(198, 124, 78, 0.2) 0%, transparent 50%)",
                          "radial-gradient(circle at 100% 100%, rgba(198, 124, 78, 0.2) 0%, transparent 50%)",
                          "radial-gradient(circle at 0% 0%, rgba(198, 124, 78, 0.2) 0%, transparent 50%)",
                        ],
                      }}
                      transition={{ duration: 5, repeat: Infinity }}
                    />
                  )}

                  <div className="relative">
                    <h3 className="text-2xl font-serif text-anthracite mb-2">{tier.name}</h3>
                    {tier.subtitle && (
                      <p className="text-sm text-muted-foreground font-sans mb-4">{tier.subtitle}</p>
                    )}

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={`text-5xl font-serif ${tier.featured ? 'bg-gradient-to-r from-terracotta to-gold bg-clip-text text-transparent' : 'text-anthracite'}`}>
                          {currency === "XOF" ? tier.priceXOF : tier.priceUSD}
                        </span>
                        <span className="text-lg text-muted-foreground font-sans">
                          {currency === "XOF" ? "XOF" : "USD"}
                        </span>
                      </div>
                      {tier.duration && (
                        <p className="text-sm text-muted-foreground font-sans mb-2">{tier.duration}</p>
                      )}
                      {tier.originalPriceXOF && (
                        <div className="flex items-center gap-2">
                          <span className="text-base text-muted-foreground line-through font-sans">
                            {currency === "XOF" ? tier.originalPriceXOF : tier.originalPriceUSD}{" "}
                            {currency === "XOF" ? "XOF" : "USD"}
                          </span>
                          <span className="px-3 py-1 bg-gradient-to-r from-terracotta to-gold text-white text-xs font-sans font-bold rounded-full">
                            {tier.discount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {tier.features.map((feature, fIdx) => (
                        <motion.li
                          key={fIdx}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.6 + fIdx * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${tier.featured ? 'text-terracotta' : 'text-gold'}`} />
                          <span className="text-base text-muted-foreground font-sans">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      to="/onboarding"
                      className={`block w-full text-center px-6 py-4 rounded-full font-sans font-semibold transition-all duration-300 ${
                        tier.featured
                          ? "bg-gradient-to-r from-terracotta to-gold text-white hover:shadow-2xl scale-105"
                          : "bg-anthracite text-white hover:bg-anthracite/90 hover:shadow-lg"
                      }`}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Special Focus Examens Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 rounded-full mb-4 backdrop-blur-sm border border-gold/30"
              >
                <Heart className="w-5 h-5 text-gold" />
                <span className="text-xs tracking-[0.2em] uppercase text-gold font-sans font-bold">
                  SPÉCIAL FOCUS EXAMENS
                </span>
              </motion.div>
              <h3 className="text-3xl sm:text-4xl font-serif text-anthracite mb-3">
                Pour réussir sans craquer
              </h3>
              <p className="text-lg text-muted-foreground font-sans">
                Un trimestre de sérénité
              </p>
            </div>

            {/* Focus Examen Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-gold/10 via-beige/10 to-gold/5 rounded-3xl border-2 border-gold/40 p-8 shadow-2xl relative overflow-hidden"
            >
              {/* Animated Background Pattern */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    "radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.2) 0%, transparent 50%)",
                    "radial-gradient(circle at 100% 100%, rgba(212, 175, 55, 0.2) 0%, transparent 50%)",
                    "radial-gradient(circle at 0% 0%, rgba(212, 175, 55, 0.2) 0%, transparent 50%)",
                  ],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* Left: Title & Description */}
                <div className="flex-1">
                  <h4 className="text-2xl font-serif text-anthracite mb-3">
                    Pack Focus Examen
                  </h4>
                  <p className="text-base text-muted-foreground font-sans mb-4">
                    3 Séances (2 Mentale + 1 Primaire)
                  </p>
                  <div className="space-y-3">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground font-sans">
                        Un prix psychologique "rond" et accessible pour un trimestre décisif
                      </span>
                    </motion.div>
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground font-sans">
                        Accès prioritaire au Dispatcher pour les urgences de révisions
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Right: Price & CTA */}
                <div className="flex flex-col items-center md:items-end gap-4">
                  <div className="text-center md:text-right">
                    <div className="flex items-baseline gap-2 justify-center md:justify-end mb-1">
                      <span className="text-6xl font-serif bg-gradient-to-r from-gold to-gold/70 bg-clip-text text-transparent">
                        {currency === "XOF" ? "40,000" : "70"}
                      </span>
                      <span className="text-xl text-muted-foreground font-sans">
                        {currency === "XOF" ? "XOF" : "USD"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground font-sans">
                      Pour 3 séances mixtes
                    </p>
                  </div>
                  <Link
                    to="/booking"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-gold/80 text-white rounded-full hover:shadow-2xl transition-all duration-300 font-sans font-semibold shadow-lg group"
                  >
                    Réserver maintenant
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-muted-foreground font-sans mt-8"
          >
            Tous les tarifs étudiants nécessitent une carte étudiante valide ou un certificat de scolarité.
          </motion.p>
        </div>
      </section>

      {/* Verification Process */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-b from-white via-beige/10 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="mb-8">
              <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase bg-gradient-to-r from-terracotta to-gold bg-clip-text text-transparent font-sans font-bold mb-3">
                COMMENT ÇA MARCHE
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-terracotta via-gold to-terracotta rounded-full mx-auto" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-6 leading-tight">
              Activez votre réduction en{" "}
              <span className="italic bg-gradient-to-r from-terracotta to-gold bg-clip-text text-transparent">
                3 étapes simples
              </span>
            </h2>
          </motion.div>

          {/* Steps */}
          <div className="max-w-4xl mx-auto">
            {verificationSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {idx < verificationSteps.length - 1 && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + idx * 0.2 }}
                      className="absolute left-[34px] top-[80px] w-[3px] h-[calc(100%+2rem)] bg-gradient-to-b from-terracotta via-gold to-terracotta rounded-full origin-top"
                    />
                  )}

                  <div className="flex gap-6 mb-12">
                    {/* Number Circle */}
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`relative flex-shrink-0 w-[70px] h-[70px] rounded-2xl bg-gradient-to-br ${step.color} flex flex-col items-center justify-center shadow-xl overflow-hidden`}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <Icon className="w-6 h-6 text-white mb-1" />
                      <span className="text-sm font-serif text-white">{step.number}</span>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex-1 pt-2"
                    >
                      <h3 className="text-2xl font-serif text-anthracite mb-3">{step.title}</h3>
                      <p className="text-lg text-muted-foreground font-sans leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
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
            className="text-center mt-12"
          >
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-terracotta to-gold text-white rounded-full hover:shadow-2xl transition-all duration-300 font-sans font-semibold text-lg shadow-lg group"
            >
              Créer mon compte étudiant
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-beige/30 via-beige/10 to-white" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-serif text-anthracite mb-4">
              Des questions sur le programme étudiant ?
            </h2>
            <p className="text-lg text-muted-foreground font-sans mb-8">
              Notre équipe est là pour vous aider. Contactez-nous par email ou via notre chatbot.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:contact@monafrica.net"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-anthracite border-2 border-anthracite rounded-full hover:bg-anthracite hover:text-white transition-all duration-300 font-sans font-semibold shadow-lg"
              >
                Nous contacter
              </a>
              <Link
                to="/aide"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-terracotta to-gold text-white rounded-full hover:shadow-2xl transition-all duration-300 font-sans font-semibold shadow-lg"
              >
                Voir la FAQ
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}