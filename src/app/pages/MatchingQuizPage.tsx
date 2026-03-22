import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  ChevronRight, 
  ChevronLeft, 
  Users, 
  Heart, 
  MessageCircle, 
  Sparkles, 
  MapPin, 
  Wind, 
  Target, 
  Users2, 
  Sprout, 
  Star,
  UserCircle,
  Circle,
  Flower,
  Zap,
  Scale,
  Brain,
  X,
  Globe,
  Plane,
  Hand
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MatchingAnswers {
  objectif?: string;
  genre?: string;
  style?: string;
  spiritualite?: string;
  contexte?: string;
}

const matchingQuestions = [
  {
    id: 'objectif',
    title: 'Votre objectif principal',
    description: 'Sur quoi souhaitez-vous travailler en priorité ?',
    icon: Heart,
    options: [
      { value: 'stress', label: 'Stress & Anxiété', icon: Wind, color: 'text-blue-600' },
      { value: 'productivite', label: 'Productivité & Performance', icon: Target, color: 'text-gold' },
      { value: 'relations', label: 'Relations & Couple', icon: Users2, color: 'text-rose-600' },
      { value: 'trauma', label: 'Trauma & Passé', icon: Sprout, color: 'text-green-600' },
      { value: 'developpement', label: 'Développement Personnel', icon: Star, color: 'text-amber-600' },
    ],
  },
  {
    id: 'genre',
    title: 'Préférence de genre',
    description: 'Quel est le genre de l\'expert avec qui vous seriez le plus à l\'aise ?',
    icon: Users,
    options: [
      { value: 'homme', label: 'Homme', icon: UserCircle, color: 'text-anthracite' },
      { value: 'femme', label: 'Femme', icon: UserCircle, color: 'text-anthracite' },
      { value: 'indifferent', label: 'Peu importe', icon: Circle, color: 'text-anthracite' },
    ],
  },
  {
    id: 'style',
    title: 'Style de communication',
    description: 'Quelle approche vous correspond le mieux ?',
    icon: MessageCircle,
    options: [
      { value: 'douceur', label: 'Douceur & Écoute', icon: Flower, color: 'text-pink-500', description: 'Empathie, écoute active, approche douce' },
      { value: 'action', label: 'Action & Coaching', icon: Zap, color: 'text-terracotta', description: 'Solutions concrètes, challenge, motivation' },
      { value: 'equilibre', label: 'Équilibre des deux', icon: Scale, color: 'text-teal-600', description: 'Mix d\'écoute et d\'action' },
    ],
  },
  {
    id: 'spiritualite',
    title: 'Dimension spirituelle',
    description: 'Quelle approche spirituelle préférez-vous ?',
    icon: Sparkles,
    options: [
      { value: 'laique', label: 'Approche Laïque', icon: Brain, color: 'text-purple-600', description: 'Scientifique et clinique' },
      { value: 'chretienne', label: 'Sensibilité Chrétienne', icon: X, color: 'text-blue-700', description: 'Intégration de la foi chrétienne' },
      { value: 'musulmane', label: 'Sensibilité Musulmane', icon: Circle, color: 'text-green-700', description: 'Intégration de la foi musulmane' },
      { value: 'traditions', label: 'Traditions Africaines', icon: Globe, color: 'text-amber-700', description: 'Sagesses ancestrales africaines' },
      { value: 'ouvert', label: 'Ouvert à tout', icon: Heart, color: 'text-rose-500', description: 'Approche inclusive et flexible' },
    ],
  },
  {
    id: 'contexte',
    title: 'Contexte culturel',
    description: 'Quel background culturel de l\'expert vous parle le plus ?',
    icon: MapPin,
    options: [
      { value: 'local', label: 'Expert Local/Culturel', icon: MapPin, color: 'text-terracotta', description: 'Ancré dans le contexte africain' },
      { value: 'expat', label: 'Expert Expat/Occidental', icon: Globe, color: 'text-blue-600', description: 'Perspective internationale' },
      { value: 'diaspora', label: 'Expert Diaspora', icon: Plane, color: 'text-purple-600', description: 'Double culture africaine/occidentale' },
      { value: 'indifferent', label: 'Peu importe', icon: Hand, color: 'text-anthracite', description: 'Compétence avant tout' },
    ],
  },
];

export default function MatchingQuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Essayer de récupérer depuis location.state OU sessionStorage
  const mentalScoresFromState = location.state?.mentalScores || {};
  const mentalScoresFromStorage = sessionStorage.getItem('mona_mental_scores');
  const mentalScores = Object.keys(mentalScoresFromState).length > 0 
    ? mentalScoresFromState 
    : mentalScoresFromStorage 
      ? JSON.parse(mentalScoresFromStorage)
      : {};

  // Debug : vérifier que les scores sont bien reçus
  console.log('📊 MatchingQuizPage - Scores reçus depuis OnboardingPage:', mentalScores);
  console.log('📊 Nombre de dimensions:', Object.keys(mentalScores).length);

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<MatchingAnswers>({});

  const currentQuestion = matchingQuestions[currentStep];
  const progress = ((currentStep + 1) / matchingQuestions.length) * 100;
  const IconComponent = currentQuestion.icon;

  const handleAnswerSelect = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentStep < matchingQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Dernière étape -> passer aux résultats
      console.log('✅ MatchingQuizPage - Envoi vers Results:');
      console.log('  - Mental Scores:', mentalScores);
      console.log('  - Matching Answers:', answers);
      
      // Sauvegarder dans sessionStorage
      sessionStorage.setItem('mona_matching_answers', JSON.stringify(answers));
      
      navigate('/onboarding/results', { 
        state: { 
          mentalScores,
          matchingAnswers: answers 
        } 
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      // Retour au Mental Score
      navigate('/onboarding');
    }
  };

  const canProceed = answers[currentQuestion.id as keyof MatchingAnswers] !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gold/20 via-white to-beige/20 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header avec progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" />
              <span className="text-sm text-muted-foreground">
                Matching Culturel - Question {currentStep + 1} sur {matchingQuestions.length}
              </span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground hover:text-anthracite transition-colors"
            >
              Quitter
            </button>
          </div>
          
          {/* Barre de progression */}
          <div className="w-full h-2 bg-beige/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold to-terracotta"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Carte principale */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-beige/20"
          >
            {/* Icône & Titre */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold/10 rounded-2xl mb-4">
                <IconComponent className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-3xl sm:text-4xl text-anthracite mb-3">
                {currentQuestion.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {currentQuestion.description}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id as keyof MatchingAnswers] === option.value;
                const OptionIcon = option.icon;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswerSelect(currentQuestion.id, option.value)}
                    className={`
                      w-full p-5 rounded-xl border-2 text-left
                      transition-all duration-200
                      ${isSelected
                        ? 'bg-terracotta/5 border-terracotta shadow-md'
                        : 'bg-white border-beige/40 hover:border-gold/50 hover:bg-gold/5'
                      }
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-beige/30 rounded-lg">
                        <OptionIcon className={`w-5 h-5 ${option.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-sans text-lg text-anthracite">
                            {option.label}
                          </h3>
                          {isSelected && (
                            <div className="w-5 h-5 bg-terracotta rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          )}
                        </div>
                        {option.description && (
                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-beige/20">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-5 py-3 rounded-lg font-sans text-anthracite hover:bg-beige/20 transition-all duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
                Retour
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-lg font-sans
                  transition-all duration-200 shadow-md
                  ${canProceed
                    ? 'bg-terracotta text-white hover:bg-terracotta/90'
                    : 'bg-beige/30 text-muted-foreground cursor-not-allowed'
                  }
                `}
              >
                {currentStep === matchingQuestions.length - 1 ? 'Voir mes résultats' : 'Suivant'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicateurs de progression (points) */}
        <div className="flex justify-center gap-2 mt-6">
          {matchingQuestions.map((_, index) => (
            <div
              key={index}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === currentStep
                  ? 'bg-terracotta w-8'
                  : answers[matchingQuestions[index].id as keyof MatchingAnswers]
                  ? 'bg-gold'
                  : 'bg-beige/40'
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}