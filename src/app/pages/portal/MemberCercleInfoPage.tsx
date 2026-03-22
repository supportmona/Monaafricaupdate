import { Link } from "react-router";
import { ArrowLeft, Crown, Check, Sparkles, Users, BookOpen, Video, Shield } from "lucide-react";
import { motion } from "motion/react";
import MemberHeader from "@/app/components/MemberHeader";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";

export default function MemberCercleInfoPage() {
  const { user } = useMemberAuth();

  const benefits = [
    {
      icon: Video,
      title: "Consultations illimitées",
      description: "Accédez à autant de séances que nécessaire avec nos experts en santé mentale"
    },
    {
      icon: BookOpen,
      title: "Bibliothèque exclusive",
      description: "Plus de 200 ressources premium : articles, vidéos, méditations guidées"
    },
    {
      icon: Users,
      title: "Smart Matching culturel",
      description: "Algorithme avancé pour vous connecter avec l'expert le plus adapté"
    },
    {
      icon: Shield,
      title: "Suivi personnalisé",
      description: "Passeport Santé FHIR, notes privées et historique sécurisé"
    }
  ];

  const features = [
    "Consultations vidéo illimitées en santé mentale",
    "Accès complet à la bibliothèque de ressources",
    "Smart Matching culturel avec nos experts",
    "Passeport Santé FHIR sécurisé",
    "Support prioritaire 7j/7",
    "Webinaires et ateliers exclusifs mensuels",
    "Tarifs préférentiels chez nos partenaires",
    "Outils de bien-être et méditations guidées",
    "Communauté privée de membres",
    "Accès anticipé aux nouvelles fonctionnalités"
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
          className="bg-gradient-to-br from-[#D4A574] to-[#A68B6F] rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#1A1A1A]/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-10 h-10" />
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold">
                Cercle M.O.N.A
              </h1>
            </div>

            <p className="text-xl sm:text-2xl font-sans mb-8 max-w-3xl">
              L'abonnement premium qui transforme votre parcours de santé mentale avec un accès illimité à nos experts et ressources exclusives
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/member/upgrade"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#A68B6F] rounded-full hover:bg-white/90 transition-all font-sans font-semibold shadow-xl"
              >
                <Sparkles className="w-5 h-5" />
                Rejoindre le Cercle
              </Link>
              <Link
                to="/member/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-[#A68B6F] transition-all font-sans font-semibold"
              >
                Retour au tableau de bord
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Bénéfices principaux */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-serif text-anthracite mb-8 text-center">
            Ce que vous obtenez
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-[#F5F1ED] hover:border-[#A68B6F]/30 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 bg-[#A68B6F]/10 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#A68B6F]" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-anthracite mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-anthracite/70 font-sans leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Liste complète des fonctionnalités */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-8 border border-[#F5F1ED] mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-serif text-anthracite mb-8 text-center">
            Tout ce qui est inclus
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                <span className="text-anthracite/80 font-sans">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tarification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#F5F1ED] to-white rounded-2xl p-8 border-2 border-[#A68B6F]/20 mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-serif text-anthracite mb-3">
              Un tarif simple et transparent
            </h2>
            <p className="text-anthracite/60 font-sans">
              Aucun frais caché, aucun engagement de durée
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 border-2 border-[#A68B6F] text-center mb-6">
              <div className="mb-6">
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <span className="text-5xl font-serif font-bold text-anthracite">60 000</span>
                  <span className="text-xl text-anthracite/60">XOF/mois</span>
                </div>
                <div className="flex items-baseline justify-center gap-2 text-anthracite/60">
                  <span className="text-2xl font-serif">100</span>
                  <span>USD/mois</span>
                </div>
              </div>

              <Link
                to="/member/upgrade"
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-all font-sans font-semibold shadow-lg"
              >
                <Crown className="w-5 h-5" />
                Rejoindre maintenant
              </Link>
            </div>

            <div className="text-center space-y-2 text-sm text-anthracite/60 font-sans">
              <p>Annulation possible à tout moment</p>
              <p>Aucun engagement de durée minimale</p>
              <p>Facturation mensuelle automatique</p>
            </div>
          </div>
        </motion.div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-serif text-anthracite mb-4">
            Prêt à rejoindre le Cercle M.O.N.A ?
          </h2>
          <p className="text-anthracite/70 font-sans mb-6 max-w-2xl mx-auto">
            Transformez votre parcours de santé mentale avec un accès illimité à nos experts et ressources premium
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/member/upgrade"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-all font-sans font-semibold shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Commencer maintenant
            </Link>
            <Link
              to="/member/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-anthracite text-anthracite rounded-full hover:bg-anthracite hover:text-white transition-all font-sans font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au tableau de bord
            </Link>
          </div>
        </motion.div>
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
