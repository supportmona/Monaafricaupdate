import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { 
  Brain,
  Heart,
  Users,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Shield,
  Globe,
  Home,
  TrendingUp,
  Clock,
  Award
} from "lucide-react";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface QuizAnswer {
  questionId: string;
  answer: string | string[];
}

interface ExpertMatch {
  id: string;
  name: string;
  avatar: string;
  specialties: string[];
  location: string;
  background: string;
  matchScore: number;
  languages: string[];
  experience: string;
  approach: string;
}

export default function MemberMatchingQuizPage() {
  const navigate = useNavigate();
  const { user } = useMemberAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchedExperts, setMatchedExperts] = useState<ExpertMatch[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: "main_concern",
      title: "Quel est votre principal besoin ?",
      subtitle: "Sélectionnez ce qui vous préoccupe le plus en ce moment",
      type: "single",
      icon: Brain,
      options: [
        { value: "anxiety", label: "Anxiété et stress", description: "Inquiétudes excessives, tension" },
        { value: "depression", label: "Dépression", description: "Tristesse, perte d'intérêt" },
        { value: "burnout", label: "Burn-out professionnel", description: "Épuisement lié au travail" },
        { value: "grief", label: "Deuil et perte", description: "Accompagnement dans le deuil" },
        { value: "trauma", label: "Traumatisme", description: "Événements difficiles du passé" },
        { value: "relationships", label: "Relations et couple", description: "Difficultés relationnelles" },
        { value: "self_esteem", label: "Confiance en soi", description: "Estime de soi, affirmation" },
        { value: "life_transition", label: "Transition de vie", description: "Changements importants" }
      ]
    },
    {
      id: "severity",
      title: "Comment décririez-vous l'intensité de ce que vous vivez ?",
      subtitle: "Cela nous aide à trouver l'expert le mieux adapté",
      type: "single",
      icon: TrendingUp,
      options: [
        { value: "mild", label: "Léger", description: "Gêne occasionnelle, je gère au quotidien" },
        { value: "moderate", label: "Modéré", description: "Impact sur ma vie quotidienne" },
        { value: "severe", label: "Sévère", description: "Difficulté importante à fonctionner" },
        { value: "crisis", label: "Situation de crise", description: "Besoin d'aide urgente" }
      ]
    },
    {
      id: "cultural_preference",
      title: "Quelle est votre préférence culturelle ?",
      subtitle: "Nous avons des experts locaux et de la diaspora",
      type: "single",
      icon: Globe,
      options: [
        { 
          value: "local", 
          label: "Expert local", 
          description: "Basé dans mon pays, connaissance du contexte local" 
        },
        { 
          value: "diaspora", 
          label: "Expert de la diaspora", 
          description: "Formation internationale, expérience multiculturelle" 
        },
        { 
          value: "no_preference", 
          label: "Pas de préférence", 
          description: "Le plus important est la compétence" 
        }
      ]
    },
    {
      id: "location",
      title: "Où vous trouvez-vous actuellement ?",
      subtitle: "Pour vous connecter avec des experts proches de vous",
      type: "single",
      icon: MapPin,
      options: [
        { value: "abidjan", label: "Abidjan, Côte d'Ivoire", description: "Zone GMT+0" },
        { value: "dakar", label: "Dakar, Sénégal", description: "Zone GMT+0" },
        { value: "kinshasa", label: "Kinshasa, RDC", description: "Zone GMT+1" },
        { value: "other_africa", label: "Autre pays africain", description: "Préciser lors de la réservation" },
        { value: "diaspora", label: "Diaspora (Europe/Amérique)", description: "Fuseau horaire différent" }
      ]
    },
    {
      id: "therapy_experience",
      title: "Avez-vous déjà consulté un professionnel de santé mentale ?",
      subtitle: "Cela nous aide à adapter l'approche",
      type: "single",
      icon: Heart,
      options: [
        { value: "never", label: "Jamais", description: "C'est ma première fois" },
        { value: "past", label: "Oui, dans le passé", description: "Il y a plus de 6 mois" },
        { value: "current", label: "Oui, actuellement", description: "Je cherche à changer d'expert" }
      ]
    },
    {
      id: "session_preference",
      title: "Quelle fréquence de suivi préférez-vous ?",
      subtitle: "Nous proposons différents rythmes d'accompagnement",
      type: "single",
      icon: Clock,
      options: [
        { value: "weekly", label: "Hebdomadaire", description: "1 séance par semaine" },
        { value: "biweekly", label: "Bimensuel", description: "2 séances par mois" },
        { value: "monthly", label: "Mensuel", description: "1 séance par mois" },
        { value: "flexible", label: "Flexible", description: "Selon mes besoins" }
      ]
    },
    {
      id: "goals",
      title: "Quels sont vos objectifs principaux ?",
      subtitle: "Vous pouvez sélectionner plusieurs réponses",
      type: "multiple",
      icon: Award,
      options: [
        { value: "manage_symptoms", label: "Gérer mes symptômes", description: "Réduire l'anxiété, la tristesse" },
        { value: "understand_self", label: "Mieux me comprendre", description: "Explorer mes émotions et pensées" },
        { value: "develop_skills", label: "Développer des compétences", description: "Gestion du stress, communication" },
        { value: "heal_past", label: "Guérir du passé", description: "Traumatismes, blessures anciennes" },
        { value: "improve_relationships", label: "Améliorer mes relations", description: "Famille, couple, travail" },
        { value: "find_meaning", label: "Trouver du sens", description: "Réorientation de vie, spiritualité" }
      ]
    }
  ];

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    const newAnswers = answers.filter(a => a.questionId !== questionId);
    newAnswers.push({ questionId, answer });
    setAnswers(newAnswers);
  };

  const getCurrentAnswer = (questionId: string): string | string[] | undefined => {
    return answers.find(a => a.questionId === questionId)?.answer;
  };

  const canProceed = () => {
    const currentQuestion = questions[currentStep];
    const answer = getCurrentAnswer(currentQuestion.id);
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return true;
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);

    try {
      let token = localStorage.getItem("mona_member_token");
      
      // Vérifier si le token est valide (JWT avec 3 parties)
      const isValidToken = token && token.split('.').length === 3;
      
      if (!isValidToken) {
        // Token invalide, utiliser le fallback local
        console.log("💾 Sauvegarde locale du quiz (pas de token valide)");
        const quizData = {
          userId: user?.id,
          answers,
          completedAt: new Date().toISOString()
        };
        localStorage.setItem(`matching_quiz:${user?.id}`, JSON.stringify(quizData));
        
        // Calculer le matching
        const matched = calculateMatching();
        
        // Si aucun expert disponible pour le moment
        if (matched.length === 0) {
          setShowResults(true);
          setMatchedExperts([]);
        } else {
          // Si des experts sont disponibles, rediriger directement vers la réservation
          navigate("/booking");
        }
        setIsSubmitting(false);
        return;
      }

      // Sauvegarder les réponses du quiz sur le backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/matching-quiz/${user?.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token
          },
          body: JSON.stringify({ answers })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Erreur backend:", errorText);
        // Fallback: sauvegarder localement si le backend échoue
        const quizData = {
          userId: user?.id,
          answers,
          completedAt: new Date().toISOString()
        };
        localStorage.setItem(`matching_quiz:${user?.id}`, JSON.stringify(quizData));
        console.log("✅ Quiz sauvegardé localement (fallback)");
      } else {
        console.log("✅ Quiz sauvegardé sur le backend");
      }

      // Calculer le matching
      const matched = calculateMatching();
      
      // Si aucun expert disponible pour le moment
      if (matched.length === 0) {
        setShowResults(true);
        setMatchedExperts([]);
      } else {
        // Si des experts sont disponibles, rediriger directement vers la réservation
        navigate("/booking");
      }
    } catch (error) {
      console.error("Erreur lors de la soumission du quiz:", error);
      // Sauvegarder localement en cas d'erreur
      try {
        const quizData = {
          userId: user?.id,
          answers,
          completedAt: new Date().toISOString()
        };
        localStorage.setItem(`matching_quiz:${user?.id}`, JSON.stringify(quizData));
        console.log("✅ Quiz sauvegardé localement (après erreur)");
        
        // Continuer avec le matching même en cas d'erreur de sauvegarde
        const matched = calculateMatching();
        if (matched.length === 0) {
          setShowResults(true);
          setMatchedExperts([]);
        } else {
          navigate("/booking");
        }
      } catch (localError) {
        console.error("❌ Erreur sauvegarde locale:", localError);
        alert("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateMatching = (): ExpertMatch[] => {
    // Algorithme de matching basé sur les réponses
    const mainConcern = answers.find(a => a.questionId === "main_concern")?.answer as string;
    const culturalPref = answers.find(a => a.questionId === "cultural_preference")?.answer as string;
    const location = answers.find(a => a.questionId === "location")?.answer as string;

    // Base de données d'experts (en production, cela viendrait du backend)
    const allExperts: ExpertMatch[] = [
      {
        id: "expert_1",
        name: "Dr. Aminata Koné",
        avatar: "AK",
        specialties: ["Anxiété", "Burn-out", "Stress professionnel"],
        location: "Abidjan, Côte d'Ivoire",
        background: "Locale",
        matchScore: 95,
        languages: ["Français", "Baoulé"],
        experience: "12 ans d'expérience",
        approach: "Thérapie Cognitivo-Comportementale (TCC)"
      },
      {
        id: "expert_2",
        name: "Dr. Fatou Diop",
        avatar: "FD",
        specialties: ["Dépression", "Deuil", "Trauma"],
        location: "Dakar, Sénégal",
        background: "Locale",
        matchScore: 92,
        languages: ["Français", "Wolof"],
        experience: "15 ans d'expérience",
        approach: "Thérapie psychodynamique & EMDR"
      },
      {
        id: "expert_3",
        name: "Dr. Jean-Marc Nkulu",
        avatar: "JN",
        specialties: ["Relations", "Couple", "Confiance en soi"],
        location: "Kinshasa, RDC",
        background: "Local",
        matchScore: 88,
        languages: ["Français", "Lingala"],
        experience: "10 ans d'expérience",
        approach: "Thérapie systémique & humaniste"
      }
    ];

    // Filtrer et scorer en fonction des réponses
    return allExperts
      .filter(expert => {
        // Filtrer par préférence culturelle
        if (culturalPref === "local" && expert.background !== "Locale") return false;
        if (culturalPref === "diaspora" && expert.background !== "Diaspora") return false;
        
        // Filtrer par localisation si spécifique
        if (location && location !== "no_preference") {
          const locationMatch = expert.location.toLowerCase().includes(location);
          if (!locationMatch && location !== "other_africa" && location !== "diaspora") return false;
        }
        
        return true;
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  };

  const handleSelectExpert = (expertId: string) => {
    // Sauvegarder l'expert sélectionné et rediriger vers la réservation
    navigate(`/booking?expertId=${expertId}`);
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  if (showResults) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#D4C5B9] shadow-xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl font-serif text-[#1A1A1A] mb-4">
              Merci pour vos réponses
            </h1>
            
            <p className="text-lg text-[#1A1A1A]/70 mb-8 max-w-md mx-auto">
              Nous n'avons pas encore d'experts disponibles correspondant à votre profil, mais nous travaillons à agrandir notre réseau de professionnels.
            </p>

            <p className="text-base text-[#1A1A1A]/60 mb-8">
              Nous vous contacterons dès qu'un expert correspondant à vos besoins rejoindra notre plateforme.
            </p>

            <button
              onClick={() => {
                setTimeout(() => navigate("/"), 1000);
              }}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors font-medium"
            >
              Retour à l'accueil
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const CurrentIcon = currentQuestion.icon;

  return (
    <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#1A1A1A]/60">
              Question {currentStep + 1} sur {questions.length}
            </span>
            <span className="text-sm font-medium text-[#1A1A1A]">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-white rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-[#A68B6F] to-[#D4C5B9]"
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-3xl p-8 border border-[#D4C5B9] shadow-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-2xl flex items-center justify-center">
                <CurrentIcon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-serif text-[#1A1A1A] mb-1">
                  {currentQuestion.title}
                </h2>
                <p className="text-sm text-[#1A1A1A]/60">
                  {currentQuestion.subtitle}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => {
                const isSelected = currentQuestion.type === "multiple"
                  ? (getCurrentAnswer(currentQuestion.id) as string[] || []).includes(option.value)
                  : getCurrentAnswer(currentQuestion.id) === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (currentQuestion.type === "multiple") {
                        const current = (getCurrentAnswer(currentQuestion.id) as string[]) || [];
                        const newValue = current.includes(option.value)
                          ? current.filter(v => v !== option.value)
                          : [...current, option.value];
                        handleAnswer(currentQuestion.id, newValue);
                      } else {
                        handleAnswer(currentQuestion.id, option.value);
                      }
                    }}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? "border-[#A68B6F] bg-[#A68B6F]/5"
                        : "border-[#D4C5B9] hover:border-[#A68B6F]/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-[#1A1A1A] mb-1">
                          {option.label}
                        </p>
                        <p className="text-sm text-[#1A1A1A]/60">
                          {option.description}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-6 h-6 text-[#A68B6F] flex-shrink-0 ml-3" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="inline-flex items-center gap-2 px-6 py-3 text-[#1A1A1A] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Précédent
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              "Traitement..."
            ) : currentStep === questions.length - 1 ? (
              <>
                Voir mes recommandations
                <Sparkles className="w-5 h-5" />
              </>
            ) : (
              <>
                Suivant
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}