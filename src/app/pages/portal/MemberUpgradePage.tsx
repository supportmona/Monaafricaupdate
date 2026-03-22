import { Link } from "react-router";
import { ArrowLeft, Crown, Check, Sparkles, Heart, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import MemberHeader from "@/app/components/MemberHeader";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";

export default function MemberUpgradePage() {
  const { user } = useMemberAuth();

  const cercleFeatures = [
    "Consultations illimitées en santé mentale",
    "Accès complet à la bibliothèque exclusive",
    "Smart Matching culturel premium",
    "Suivi personnalisé et notes privées",
    "Passeport Santé FHIR sécurisé",
    "Support prioritaire 7j/7",
    "Webinaires et ateliers exclusifs",
    "Tarifs préférentiels partenaires"
  ];

  const consultationPacks = [
    {
      name: "Séance Unique",
      consultations: 1,
      price: { xof: "25 000", usd: "38" },
      description: "Flexibilité totale",
      discount: null,
      popular: false
    },
    {
      name: "Pack Essentiel",
      consultations: 2,
      price: { xof: "45 000", usd: "68" },
      description: "Mixables + Report",
      discount: "-10%",
      popular: false
    },
    {
      name: "Pack Premium",
      consultations: 5,
      price: { xof: "100 000", usd: "152" },
      description: "Le meilleur choix",
      discount: "-20%",
      popular: true
    },
    {
      name: "Pack Famille",
      consultations: 8,
      price: { xof: "150 000", usd: "228" },
      description: "Partageables en famille",
      discount: "-25%",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <MemberHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Retour */}
        <Link
          to="/member/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au tableau de bord
        </Link>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block mb-4">
            <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-anthracite font-sans font-medium mb-3">
              PASSEZ AU NIVEAU SUPÉRIEUR
            </p>
            <div className="w-24 h-[2px] bg-anthracite mx-auto" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-anthracite mb-6">
            Choisissez votre <span className="italic">formule</span>
          </h1>

          <p className="text-lg text-anthracite/70 font-sans max-w-2xl mx-auto">
            Accédez à une santé mentale premium avec nos abonnements et packs de consultations
          </p>
        </motion.div>

        {/* Cercle M.O.N.A */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-gradient-to-br from-[#D4A574] to-[#A68B6F] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1A1A1A]/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="w-8 h-8" />
                <h2 className="text-3xl sm:text-4xl font-serif font-bold">Cercle M.O.N.A</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-serif font-bold">60 000</span>
                      <span className="text-xl">XOF/mois</span>
                    </div>
                    <div className="flex items-baseline gap-2 text-white/80">
                      <span className="text-2xl font-serif">100</span>
                      <span>USD/mois</span>
                    </div>
                  </div>

                  <Link
                    to="/member/subscription"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#A68B6F] rounded-full hover:bg-white/90 transition-all font-sans font-semibold shadow-xl"
                  >
                    <Sparkles className="w-5 h-5" />
                    Rejoindre le Cercle
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {cercleFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="text-sm font-sans">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <Heart className="w-6 h-6 flex-shrink-0" />
                <p className="text-sm font-sans">
                  Engagement sans durée minimale. Annulation à tout moment.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Packs de consultations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-serif text-anthracite mb-3">
              Ou optez pour un pack de consultations
            </h2>
            <p className="text-anthracite/60 font-sans">
              Aucun abonnement, payez uniquement ce dont vous avez besoin
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {consultationPacks.map((pack, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-2xl p-6 border-2 ${
                  pack.popular
                    ? "border-[#A68B6F] shadow-xl"
                    : "border-[#F5F1ED]"
                } relative`}
              >
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#A68B6F] text-white px-4 py-1 rounded-full text-xs font-sans font-medium">
                    LE PLUS CHOISI
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-serif font-bold text-anthracite mb-2">
                    {pack.name}
                  </h3>
                  <p className="text-sm text-anthracite/60 font-sans mb-4">
                    {pack.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline justify-center gap-2 mb-1">
                      <span className="text-4xl font-serif font-bold text-anthracite">
                        {pack.price.xof}
                      </span>
                      <span className="text-anthracite/60">XOF</span>
                    </div>
                    <div className="text-anthracite/50 text-sm">
                      {pack.price.usd} USD
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-6 text-[#A68B6F]">
                    <Zap className="w-5 h-5" />
                    <span className="font-sans font-medium">
                      {pack.consultations} consultations
                    </span>
                  </div>
                </div>

                <Link
                  to="/member/booking"
                  className={`w-full inline-flex items-center justify-center px-6 py-3 rounded-full font-sans font-medium transition-all ${
                    pack.popular
                      ? "bg-[#A68B6F] text-white hover:bg-[#8A7159]"
                      : "bg-anthracite text-white hover:bg-anthracite/90"
                  }`}
                >
                  Choisir ce pack
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Avantages comparatifs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 border border-[#F5F1ED]"
        >
          <h3 className="text-2xl font-serif font-bold text-anthracite mb-6 text-center">
            Pourquoi choisir le Cercle M.O.N.A ?
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#A68B6F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-[#A68B6F]" />
              </div>
              <h4 className="font-serif font-bold text-anthracite mb-2">
                Économies garanties
              </h4>
              <p className="text-sm text-anthracite/70 font-sans">
                Jusqu'à 40% d'économies par rapport aux packs de consultations
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#A68B6F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-[#A68B6F]" />
              </div>
              <h4 className="font-serif font-bold text-anthracite mb-2">
                Accès illimité
              </h4>
              <p className="text-sm text-anthracite/70 font-sans">
                Consultations illimitées et bibliothèque complète de ressources
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#A68B6F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-[#A68B6F]" />
              </div>
              <h4 className="font-serif font-bold text-anthracite mb-2">
                Flexibilité totale
              </h4>
              <p className="text-sm text-anthracite/70 font-sans">
                Aucun engagement, annulation possible à tout moment
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA de retour */}
        <div className="mt-8 text-center">
          <Link
            to="/member/dashboard"
            className="inline-flex items-center gap-2 text-[#A68B6F] hover:text-[#8A7159] transition-colors font-sans"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>
        </div>
      </div>

      {/* Navigation mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#F5F1ED] z-40">
        <div className="flex items-center justify-around py-3">
          <Link
            to="/member/dashboard"
            className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-xs font-sans">Retour</span>
          </Link>
        </div>
      </div>
    </div>
  );
}