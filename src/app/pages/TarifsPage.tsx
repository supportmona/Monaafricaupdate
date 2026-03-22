import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import PaymentMethodSelector from "@/app/components/PaymentMethodSelector";
import { Check, Sparkles, ArrowRight, ChevronDown, RefreshCw, Lock, Globe, Users, Shield, Target, Database, GraduationCap, Building2, BarChart3 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";

// Page de tarification M.O.N.A
export default function TarifsPage() {
  const navigate = useNavigate();
  const [currency, setCurrency] = useState<"XOF" | "USD">("XOF");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);

  const handleSelectPlan = (planData: any) => {
    const token = localStorage.getItem("mona_member_token");
    if (!token) {
      navigate("/login");
      return;
    }
    setSelectedPlan(planData);
  };

  const formatPrice = (xofPrice: number, usdPrice: number) => {
    if (currency === "USD") {
      return `${usdPrice} USD`;
    }
    return `${xofPrice.toLocaleString()} XOF`;
  };

  // Packs à crédits
  const creditPacks = [
    {
      name: "Séance Unique",
      badge: "Flexibilité totale",
      priceXOF: 25000,
      priceUSD: 38,
      features: [
        "1 Consultation (Santé Primaire ou Mentale)",
        "Smart Matching Culturel",
        "Accès Passeport Santé (FHIR)",
        "Support par messagerie"
      ],
      cta: "Réserver ma séance",
      highlighted: false
    },
    {
      name: "Pack Essentiel",
      badge: null,
      discount: "-10%",
      priceXOF: 45000,
      priceUSD: 68,
      features: [
        "2 Consultations (Mixables + Report)",
        "Santé Primaire ou Mentale",
        "Messagerie sécurisée",
        "Smart Matching Culturel",
        "Passeport Santé (FHIR)"
      ],
      cta: "Choisir ce pack",
      highlighted: false
    },
    {
      name: "Pack Premium",
      badge: "RECOMMANDÉ",
      discount: "-20%",
      priceXOF: 100000,
      priceUSD: 152,
      features: [
        "5 Consultations (Mixables + Report)",
        "Santé Primaire ou Mentale",
        "Suivi personnalisé avancé",
        "Support prioritaire 24/7",
        "Accès ressources digitales",
        "Priorité de réservation"
      ],
      cta: "Le meilleur choix",
      highlighted: true
    },
    {
      name: "Pack Famille",
      badge: null,
      discount: "-25%",
      priceXOF: 150000,
      priceUSD: 228,
      features: [
        "8 Consultations (Partageables + Report)",
        "Santé Primaire ou Mentale",
        "Utilisables par toute la famille",
        "Gestion familiale des crédits",
        "Support prioritaire",
        "Accès au Cercle M.O.N.A"
      ],
      cta: "Protéger ma famille",
      highlighted: false
    }
  ];

  // Abonnements mensuels
  const subscriptions = [
    {
      name: "M.O.N.A Essentiel",
      priceXOF: 35000,
      priceUSD: 53,
      features: [
        "2 consultations/mois",
        "Cercle Bronze",
        "Support standard",
        "Smart Matching",
        "Passeport Santé (FHIR)"
      ],
      cta: "Choisir Essentiel",
      highlighted: false
    },
    {
      name: "M.O.N.A Premium",
      badge: "POPULAIRE",
      priceXOF: 65000,
      priceUSD: 99,
      features: [
        "4 consultations/mois",
        "Cercle Silver + Carte NFC",
        "Support 24/7",
        "Smart Matching prioritaire",
        "Passeport Santé (FHIR)",
        "Accès ressources exclusives"
      ],
      cta: "Choisir Premium",
      highlighted: true
    },
    {
      name: "M.O.N.A Prestige",
      priceXOF: 115000,
      priceUSD: 175,
      features: [
        "8 consultations/mois",
        "Cercle Gold + Conciergerie",
        "Support VIP dédié",
        "Matching instantané",
        "Passeport Santé (FHIR)",
        "Accès partenaires bien-être",
        "Tout inclus"
      ],
      cta: "Choisir Prestige",
      highlighted: false
    }
  ];

  // Offres étudiantes
  const studentOffers = [
    {
      label: "Séance Unique Santé Primaire",
      note: "Tarif standard",
      priceXOF: 25000,
      priceUSD: 38
    },
    {
      label: "Séance Unique Santé Mentale",
      badge: "PRIX SOCIAL",
      priceXOF: 18500,
      priceUSD: 28
    },
    {
      label: "Pack 5 Séances",
      discount: "-32%",
      priceXOF: 85000,
      priceUSD: 129,
      originalXOF: 125000,
      originalUSD: 190
    },
    {
      label: "Pack 10 Séances",
      discount: "-40%",
      priceXOF: 150000,
      priceUSD: 228,
      originalXOF: 250000,
      originalUSD: 380
    }
  ];

  // FAQ
  const faq = [
    {
      question: "Comment fonctionnent les crédits ?",
      answer: "Chaque pack contient un nombre de crédits correspondant à des consultations. Vos crédits sont valables 90 jours et peuvent être utilisés pour des consultations en santé mentale ou en soins primaires. Vous pouvez les utiliser à votre rythme et même les partager avec votre famille pour les packs compatibles."
    },
    {
      question: "Puis-je changer d'expert ?",
      answer: "Absolument. Si pour une raison quelconque votre expert actuel ne vous convient pas, vous pouvez demander un nouveau matching à tout moment via votre espace membre. Notre algorithme Smart Matching vous proposera un nouveau professionnel mieux adapté à vos besoins, sans frais supplémentaires."
    },
    {
      question: "Les consultations sont-elles remboursées ?",
      answer: "Cela dépend de votre mutuelle ou assurance santé. M.O.N.A travaille avec plusieurs partenaires d'assurance en Afrique francophone. Nous fournissons systématiquement une facture détaillée conforme aux standards FHIR que vous pouvez soumettre à votre assureur pour remboursement."
    },
    {
      question: "Qu'est-ce que le Cercle M.O.N.A ?",
      answer: "Le Cercle M.O.N.A est notre programme de fidélité à trois niveaux (Bronze, Silver, Gold) qui vous donne accès à des avantages exclusifs : réductions chez nos partenaires bien-être (spas, salles de sport, restaurants santé), carte membre NFC digitale, événements privés, conciergerie santé, et bien plus."
    },
    {
      question: "Comment annuler mon abonnement ?",
      answer: "Vous pouvez annuler votre abonnement à tout moment depuis votre espace membre, sans frais ni pénalité. L'annulation prend effet à la fin de votre période de facturation en cours. Vos crédits restants restent valables 90 jours après l'annulation."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavigationBar />
      
      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION HERO */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Petit tag au-dessus */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-beige/20 border border-beige/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-sm font-sans font-medium text-anthracite uppercase tracking-wide">
                Tarification transparente
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-normal text-anthracite mb-6">
              Investissez dans votre bien-être mental
            </h1>

            {/* Sous-titre */}
            <p className="text-lg md:text-xl text-[#6B6B6B] font-sans max-w-3xl mx-auto mb-8">
              Des formules adaptées à chaque besoin. Session d'Orientation offerte, évoluez à votre rythme.
            </p>

            {/* Toggle XOF/USD */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 bg-beige/20 rounded-full p-2 border border-beige/30">
                <button
                  onClick={() => setCurrency("XOF")}
                  className={`px-6 py-2.5 rounded-full font-sans font-semibold transition-all duration-300 ${
                    currency === "XOF"
                      ? "bg-anthracite text-white"
                      : "text-anthracite/60 hover:text-anthracite"
                  }`}
                >
                  XOF
                </button>
                <span className="text-anthracite/30 text-lg">⇋</span>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-6 py-2.5 rounded-full font-sans font-semibold transition-all duration-300 ${
                    currency === "USD"
                      ? "bg-anthracite text-white"
                      : "text-anthracite/60 hover:text-anthracite"
                  }`}
                >
                  USD
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION "Pourquoi choisir M.O.N.A ?" */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-beige">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-normal text-anthracite mb-4">
              Pourquoi choisir M.O.N.A ?
            </h2>
            <p className="text-lg text-[#6B6B6B] font-sans max-w-2xl mx-auto">
              Avant de choisir votre formule, découvrez ce qui nous distingue
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Colonne 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-xl"
            >
              <div className="w-14 h-14 bg-anthracite/10 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-anthracite" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-anthracite mb-4">
                La Discrétion Totale
              </h3>
              <p className="text-[#6B6B6B] font-sans leading-relaxed">
                Votre espace sécurisé, loin des regards et de la stigmatisation. Chiffrement de bout en bout, confidentialité absolue garantie.
              </p>
            </motion.div>

            {/* Colonne 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-xl"
            >
              <div className="w-14 h-14 bg-anthracite/10 rounded-full flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-anthracite" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-anthracite mb-4">
                Le Smart Matching
              </h3>
              <p className="text-[#6B6B6B] font-sans leading-relaxed">
                Gagnez du temps, nous vous trouvons l'expert qui comprend réellement votre culture et vos besoins. Match parfait en moins de 24h.
              </p>
            </motion.div>

            {/* Colonne 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-xl"
            >
              <div className="w-14 h-14 bg-anthracite/10 rounded-full flex items-center justify-center mb-6">
                <Database className="w-7 h-7 text-anthracite" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-anthracite mb-4">
                L'Écosystème Digital (FHIR)
              </h3>
              <p className="text-[#6B6B6B] font-sans leading-relaxed">
                Vos données de santé sont portables, sécurisées et interopérables selon les standards internationaux. Accès offline inclus.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION PACKS À CRÉDITS */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-normal text-anthracite mb-4">
              Packs à Crédits
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {creditPacks.map((pack, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative bg-white rounded-xl p-8 border transition-all duration-300 hover:shadow-xl ${
                  pack.highlighted
                    ? "border-[#8B7355] border-2 shadow-2xl scale-105 hover:scale-[1.06]"
                    : "border-gray-200 shadow-md hover:shadow-lg"
                }`}
              >
                {/* Badge RECOMMANDÉ */}
                {pack.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#8B7355] text-white px-4 py-1 rounded-full text-xs font-sans font-bold uppercase">
                      {pack.badge}
                    </div>
                  </div>
                )}

                {/* Badge réduction en coin */}
                {pack.discount && (
                  <div className="absolute -top-2 -right-2 bg-[#d4183d] text-white px-3 py-1 rounded-lg text-xs font-bold">
                    {pack.discount}
                  </div>
                )}

                {/* Badge flexibilité */}
                {!pack.badge && !pack.discount && idx === 0 && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-beige/30 text-anthracite text-xs font-sans font-medium rounded-full">
                      Flexibilité totale
                    </span>
                  </div>
                )}

                {/* Nom du pack */}
                <h3 className="text-2xl font-serif font-bold text-anthracite mb-2">
                  {pack.name}
                </h3>

                {/* Prix */}
                <div className={`${pack.highlighted ? 'text-5xl' : 'text-4xl'} font-serif font-bold text-anthracite mb-6`}>
                  {formatPrice(pack.priceXOF, pack.priceUSD)}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {pack.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-anthracite font-sans">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bouton */}
                <button
                  onClick={() => handleSelectPlan({
                    planKey: `credit_pack_${idx}`,
                    name: pack.name,
                    price: currency === "XOF" ? pack.priceXOF : pack.priceUSD,
                  })}
                  className={`w-full inline-flex items-center justify-center px-8 py-4 rounded-full transition-all duration-200 font-sans font-semibold ${
                    pack.highlighted
                      ? "bg-anthracite text-white hover:bg-anthracite/90"
                      : "bg-transparent border-2 border-anthracite text-anthracite hover:bg-beige"
                  }`}
                >
                  {pack.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION ABONNEMENTS MENSUELS */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-beige">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-normal text-anthracite mb-4">
              Abonnements Mensuels
            </h2>
            <p className="text-lg text-[#6B6B6B] font-sans">
              Pour un suivi régulier et des avantages maximisés
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {subscriptions.map((sub, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative bg-white rounded-xl p-8 border transition-all duration-300 hover:shadow-xl ${
                  sub.highlighted
                    ? "border-[#8B7355] border-2 shadow-2xl scale-105 hover:scale-[1.06]"
                    : "border-gray-200 shadow-md hover:shadow-lg"
                }`}
              >
                {/* Badge */}
                {sub.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#8B7355] text-white px-4 py-1 rounded-full text-xs font-sans font-bold uppercase">
                      {sub.badge}
                    </div>
                  </div>
                )}

                <h3 className="text-2xl font-serif font-bold text-anthracite mb-2">
                  {sub.name}
                </h3>

                <div className="text-4xl font-serif font-bold text-anthracite mb-1">
                  {formatPrice(sub.priceXOF, sub.priceUSD)}
                </div>
                <div className="text-sm text-[#6B6B6B] font-sans mb-6">/mois</div>

                <div className="space-y-3 mb-8">
                  {sub.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-anthracite font-sans">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSelectPlan({
                    planKey: `subscription_${idx}`,
                    name: sub.name,
                    price: currency === "XOF" ? sub.priceXOF : sub.priceUSD,
                  })}
                  className={`w-full inline-flex items-center justify-center px-8 py-4 rounded-full transition-all duration-200 font-sans font-semibold ${
                    sub.highlighted
                      ? "bg-anthracite text-white hover:bg-anthracite/90"
                      : "bg-transparent border-2 border-anthracite text-anthracite hover:bg-beige/50"
                  }`}
                >
                  {sub.cta}
                </button>
              </motion.div>
            ))}
          </div>

          {/* Note en bas */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-[#6B6B6B] font-sans"
          >
            ✓ Annulation à tout moment • ✓ Engagement mensuel flexible
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION BADGES CONFIANCE */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 mb-4">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#10B981]" />
              <span className="text-base font-sans text-anthracite font-medium">Session d'Orientation offerte</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#10B981]" />
              <span className="text-base font-sans text-anthracite font-medium">Annulation à tout moment</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-[#10B981]" />
              <span className="text-base font-sans text-anthracite font-medium">Paiements sécurisés</span>
            </div>
          </div>
          
          <div className="text-center text-sm text-[#6B6B6B] font-sans">
            Chiffrement de bout en bout • Conforme RGPD • Norme FHIR
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION "Pourquoi moins cher ?" */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-beige">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-anthracite mb-4">
              Pourquoi M.O.N.A coûte moins cher qu'une clinique classique ?
            </h2>
            <p className="text-lg text-[#6B6B6B] font-sans max-w-3xl mx-auto">
              Nous réinventons l'accès aux soins en combinant technologie et humanité
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Carte 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-8 rounded-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-anthracite/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <RefreshCw className="w-6 h-6 text-anthracite" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-anthracite mb-3">
                    Zéro Gaspillage
                  </h3>
                  <p className="text-[#6B6B6B] font-sans leading-relaxed">
                    Vos crédits non utilisés sont reportés sur le mois suivant, valables 90 jours. Contrairement aux cliniques classiques où une séance manquée est perdue.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Carte 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-anthracite/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-anthracite" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-anthracite mb-3">
                    Coffre-fort Numérique
                  </h3>
                  <p className="text-[#6B6B6B] font-sans leading-relaxed">
                    Cryptage total (E2E) de vos échanges et accès à votre Passeport Santé (FHIR). Vos données médicales vous appartiennent, portables et sécurisées.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Carte 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white p-8 rounded-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-anthracite/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-anthracite" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-anthracite mb-3">
                    Mobilité Totale
                  </h3>
                  <p className="text-[#6B6B6B] font-sans leading-relaxed">
                    Vos experts vous suivent partout : Côte d'Ivoire, Sénégal, RDC, Gabon, Cameroun, Congo. Pas besoin de changer de thérapeute à chaque déménagement.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Carte 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white p-8 rounded-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-anthracite/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-anthracite" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-anthracite mb-3">
                    Solidarité Familiale
                  </h3>
                  <p className="text-[#6B6B6B] font-sans leading-relaxed">
                    Offrez ou partagez vos séances avec vos proches en un clic. Le Pack Famille permet à toute votre famille d'accéder aux soins.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION ÉTUDIANTS */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 border border-gold/30 rounded-full mb-6">
              <GraduationCap className="w-5 h-5 text-gold" />
              <span className="text-sm font-sans font-medium text-gold uppercase tracking-wide">
                Offres Étudiantes
              </span>
            </div>
            <p className="text-base text-[#6B6B6B] font-sans">
              Sur présentation d'un justificatif étudiant valide
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            {studentOffers.map((offer, idx) => (
              <div
                key={idx}
                className={`p-6 flex items-center justify-between ${
                  idx < studentOffers.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <div>
                  <div className="text-base font-sans text-anthracite font-medium mb-1">
                    {offer.label}
                  </div>
                  {offer.note && (
                    <div className="text-sm text-[#6B6B6B] font-sans">
                      {offer.note}
                    </div>
                  )}
                  {offer.badge && (
                    <div className="inline-block mt-2 px-3 py-1 bg-terracotta/10 text-terracotta text-xs font-sans font-bold rounded uppercase">
                      {offer.badge}
                    </div>
                  )}
                  {offer.discount && (
                    <div className="inline-block mt-2 px-3 py-1 bg-[#d4183d] text-white text-xs font-bold rounded">
                      {offer.discount}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-serif font-bold text-anthracite">
                    {formatPrice(offer.priceXOF, offer.priceUSD)}
                  </div>
                  {offer.originalXOF && (
                    <div className="text-sm text-[#6B6B6B] line-through font-sans">
                      {formatPrice(offer.originalXOF, offer.originalUSD)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <Link
              to="/etudiants"
              className="inline-flex items-center gap-2 px-8 py-4 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all duration-200 font-sans font-semibold"
            >
              Découvrir le programme étudiant complet
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION ENTREPRISES */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-beige">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-anthracite mb-4">
              Solutions Entreprises
            </h2>
            <p className="text-lg text-[#6B6B6B] font-sans mb-8">
              Investissez dans votre capital humain
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full">
                <Check className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm font-sans font-medium text-anthracite">Conforme RGPD & FHIR</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full">
                <Check className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm font-sans font-medium text-anthracite">Dashboard RH Anonymisé</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full">
                <Check className="w-5 h-5 text-[#10B981]" />
                <span className="text-sm font-sans font-medium text-anthracite">ROI Impact mesurable</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-12 rounded-2xl"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-anthracite/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <BarChart3 className="w-5 h-5 text-anthracite" />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif font-bold text-anthracite mb-1">
                        Métriques de bien-être collectif
                      </h4>
                      <p className="text-[#6B6B6B] font-sans text-sm">
                        Suivez l'évolution du bien-être de vos équipes avec des indicateurs anonymisés
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-anthracite/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Shield className="w-5 h-5 text-anthracite" />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif font-bold text-anthracite mb-1">
                        Signaux d'alerte précoces
                      </h4>
                      <p className="text-[#6B6B6B] font-sans text-sm">
                        Détectez les risques psychosociaux avant qu'ils n'impactent la productivité
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-anthracite/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Database className="w-5 h-5 text-anthracite" />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif font-bold text-anthracite mb-1">
                        ROI et impact mesurable
                      </h4>
                      <p className="text-[#6B6B6B] font-sans text-sm">
                        Mesurez le retour sur investissement avec des données concrètes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-anthracite/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Lock className="w-5 h-5 text-anthracite" />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif font-bold text-anthracite mb-1">
                        Conformité RGPD et normes FHIR
                      </h4>
                      <p className="text-[#6B6B6B] font-sans text-sm">
                        Protection totale des données personnelles de vos collaborateurs
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-beige/30 rounded-xl p-8 flex items-center justify-center h-80">
                <Building2 className="w-32 h-32 text-anthracite/20" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Link
                to="/demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all duration-200 font-sans font-semibold"
              >
                Demander une démo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/business"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-anthracite text-anthracite rounded-full hover:bg-beige/50 transition-all duration-200 font-sans font-semibold"
              >
                Voir plus
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION FAQ */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-anthracite mb-4">
              Questions fréquentes
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faq.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-anthracite/30 transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-serif font-bold text-anthracite pr-4">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-anthracite flex-shrink-0 transition-transform duration-300 ${
                      openFaqIndex === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaqIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-[#6B6B6B] font-sans leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SECTION CTA FINAL */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-b from-beige to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-anthracite mb-8">
              Prêt à prendre soin de votre bien-être ?
            </h2>

            <Link
              to="/onboarding"
              className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all duration-200 font-sans font-bold text-lg shadow-2xl hover:shadow-3xl"
            >
              Commencer maintenant
              <ArrowRight className="w-6 h-6" />
            </Link>

            <p className="mt-6 text-sm text-[#6B6B6B] font-sans">
              Session d'Orientation offerte • Sans engagement
            </p>
          </motion.div>
        </div>
      </section>

      <FooterSection />

      {/* Payment Method Selector Modal */}
      {selectedPlan && (
        <PaymentMethodSelector
          planId={selectedPlan.planKey}
          planName={selectedPlan.name}
          amount={selectedPlan.price}
          currency={currency}
          onClose={() => setSelectedPlan(null)}
        />
      )}
    </div>
  );
}