import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowLeft, Check, Brain, Heart, Target } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import MemberHeader from "@/app/components/MemberHeader";

export default function MemberMatchingQuizTallyPage() {
  const { user } = useMemberAuth();
  const navigate = useNavigate();
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    // Charger le script Tally
    const script = document.createElement("script");
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    document.body.appendChild(script);

    // Écouter les événements de soumission Tally
    const handleTallySubmit = (event: MessageEvent) => {
      if (event.data && event.data.event === "Tally.FormSubmitted") {
        setQuizCompleted(true);
        // Enregistrer que le quiz a été complété
        localStorage.setItem("mona_quiz_completed", "true");
        
        // Rediriger vers le dashboard après 3 secondes
        setTimeout(() => {
          navigate("/member/dashboard");
        }, 3000);
      }
    };

    window.addEventListener("message", handleTallySubmit);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      window.removeEventListener("message", handleTallySubmit);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <MemberHeader title="Quiz de Matching" showBack />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

          <div className="relative">
            <Sparkles className="w-10 h-10 mb-4" />
            <h1 className="text-3xl font-serif mb-3">
              Trouvez votre expert idéal
            </h1>
            <p className="text-white/90 text-sm mb-6">
              Répondez à quelques questions pour être mis en relation avec les experts qui correspondent le mieux à vos besoins et préférences culturelles.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <Brain className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs font-medium">Smart Matching</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <Heart className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs font-medium">Culturellement adapté</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <Target className="w-6 h-6 mx-auto mb-2" />
                <p className="text-xs font-medium">Précis & Efficace</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Avantages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <h2 className="text-xl font-serif text-[#1A1A1A] mb-4">
            Pourquoi faire ce quiz ?
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#A68B6F]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-[#A68B6F]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-1">
                  Matching personnalisé
                </h3>
                <p className="text-xs text-[#1A1A1A]/60">
                  Notre algorithme analyse vos réponses pour vous recommander les experts les plus compatibles avec vos besoins.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#A68B6F]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-[#A68B6F]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-1">
                  Sensibilité culturelle
                </h3>
                <p className="text-xs text-[#1A1A1A]/60">
                  Nous prenons en compte votre contexte culturel, vos langues préférées et vos valeurs pour un accompagnement adapté.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#A68B6F]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-4 h-4 text-[#A68B6F]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-1">
                  Gain de temps
                </h3>
                <p className="text-xs text-[#1A1A1A]/60">
                  Évitez les essais-erreurs. Trouvez le bon expert dès la première consultation.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tally Embed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl overflow-hidden border border-[#D4C5B9]"
        >
          {!quizCompleted ? (
            <div className="min-h-[600px]">
              {/* Remplacez l'URL par votre formulaire Tally réel */}
              <iframe
                data-tally-src="https://tally.so/r/YOUR_FORM_ID"
                width="100%"
                height="700"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Quiz de Matching M.O.N.A"
                style={{ border: "none" }}
              ></iframe>
            </div>
          ) : (
            <div className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-serif text-[#1A1A1A] mb-3">
                Quiz complété avec succès !
              </h3>
              <p className="text-sm text-[#1A1A1A]/60 mb-6">
                Nous analysons vos réponses pour vous trouver les meilleurs experts. Vous serez redirigé vers votre tableau de bord dans quelques secondes...
              </p>
              
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-[#A68B6F] rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                <div className="w-2 h-2 bg-[#A68B6F] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-[#A68B6F] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Info confidentialité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-6 text-white"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif mb-2">
                Vos données sont protégées
              </h3>
              <p className="text-white/70 text-sm">
                Toutes vos réponses sont chiffrées de bout en bout (E2E) et ne sont jamais partagées avec des tiers. Nous utilisons ces informations uniquement pour améliorer votre matching avec nos experts.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Espacement pour la navigation bottom */}
      <div className="h-20"></div>
    </div>
  );
}
