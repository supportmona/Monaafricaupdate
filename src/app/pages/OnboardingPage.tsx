import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Zap, 
  Moon, 
  Target, 
  Brain, 
  Users, 
  Heart, 
  Award, 
  Scale 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Les 8 dimensions du Mental Score
const mentalScoreDimensions = [
  {
    id: 'energie',
    title: 'Énergie & Vitalité',
    description: 'Comment vous sentez-vous physiquement au quotidien ?',
    icon: Zap,
    color: 'text-terracotta',
  },
  {
    id: 'sommeil',
    title: 'Sommeil & Repos',
    description: 'La qualité de votre sommeil et votre capacité à récupérer',
    icon: Moon,
    color: 'text-blue-600',
  },
  {
    id: 'concentration',
    title: 'Concentration & Focus',
    description: 'Votre capacité à rester concentré sur vos tâches',
    icon: Target,
    color: 'text-gold',
  },
  {
    id: 'emotions',
    title: 'Gestion Émotionnelle',
    description: 'Votre stabilité et régulation émotionnelle',
    icon: Brain,
    color: 'text-purple-600',
  },
  {
    id: 'relations',
    title: 'Relations & Social',
    description: 'La qualité de vos interactions et connexions',
    icon: Users,
    color: 'text-green-600',
  },
  {
    id: 'stress',
    title: 'Stress & Anxiété',
    description: 'Votre niveau de stress et d\'anxiété au quotidien',
    icon: Heart,
    color: 'text-rose-600',
  },
  {
    id: 'accomplissement',
    title: 'Accomplissement & Sens',
    description: 'Votre sentiment d\'épanouissement et de progression',
    icon: Award,
    color: 'text-amber-600',
  },
  {
    id: 'equilibre',
    title: 'Équilibre Vie Pro/Perso',
    description: 'L\'harmonie entre vos différentes sphères de vie',
    icon: Scale,
    color: 'text-teal-600',
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);

  const currentDimension = mentalScoreDimensions[currentStep];
  const progress = ((currentStep + 1) / mentalScoreDimensions.length) * 100;
  const IconComponent = currentDimension.icon;

  const handleScoreSelect = (dimensionId: string, score: number) => {
    setScores({ ...scores, [dimensionId]: score });
  };

  const handleNext = () => {
    if (currentStep < mentalScoreDimensions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Dernière étape -> passer au Quiz de Matching
      console.log('✅ OnboardingPage - Envoi des scores vers Matching:', scores);
      console.log('✅ Nombre de dimensions complétées:', Object.keys(scores).length);
      
      // Sauvegarder dans sessionStorage pour éviter la perte de données
      sessionStorage.setItem('mona_mental_scores', JSON.stringify(scores));
      
      navigate('/onboarding/matching', { state: { mentalScores: scores } });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = scores[currentDimension.id] !== undefined;

  const scoreLabels = [
    'Très faible',
    'Faible',
    'Moyen',
    'Bon',
    'Excellent'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige/20 via-white to-terracotta/10 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header avec progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              <span className="text-sm text-muted-foreground">
                Question {currentStep + 1} sur {mentalScoreDimensions.length}
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
              className="h-full bg-gradient-to-r from-terracotta to-gold"
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-beige/20"
          >
            {/* Icône & Titre */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-beige/20 rounded-2xl mb-4">
                <IconComponent className={`w-10 h-10 ${currentDimension.color}`} />
              </div>
              <h2 className="text-3xl sm:text-4xl text-anthracite mb-3">
                {currentDimension.title}
              </h2>
              <p className="text-lg text-muted-foreground">
                {currentDimension.description}
              </p>
            </div>

            {/* Échelle de notation 1-5 */}
            <div className="mb-8">
              <p className="text-center text-sm text-muted-foreground mb-6">
                Sélectionnez votre niveau actuel
              </p>
              
              <div className="flex justify-center gap-3 sm:gap-4 mb-4">
                {[1, 2, 3, 4, 5].map((score) => {
                  const isSelected = scores[currentDimension.id] === score;
                  const isHovered = hoveredScore === score;
                  
                  return (
                    <button
                      key={score}
                      onClick={() => handleScoreSelect(currentDimension.id, score)}
                      onMouseEnter={() => setHoveredScore(score)}
                      onMouseLeave={() => setHoveredScore(null)}
                      className={`
                        w-14 h-14 sm:w-16 sm:h-16 rounded-xl font-sans text-lg sm:text-xl
                        transition-all duration-200 border-2
                        ${isSelected
                          ? 'bg-terracotta text-white border-terracotta shadow-lg scale-110'
                          : isHovered
                          ? 'bg-gold/20 border-gold text-anthracite scale-105'
                          : 'bg-white border-beige/40 text-anthracite hover:border-gold/50'
                        }
                      `}
                    >
                      {score}
                    </button>
                  );
                })}
              </div>

              {/* Labels des scores */}
              <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>{scoreLabels[0]}</span>
                <span>{scoreLabels[4]}</span>
              </div>

              {/* Label dynamique au survol */}
              {hoveredScore && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center mt-3 text-sm text-anthracite font-medium"
                >
                  {scoreLabels[hoveredScore - 1]}
                </motion.div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-beige/20">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-lg font-sans
                  transition-all duration-200
                  ${currentStep === 0
                    ? 'opacity-0 pointer-events-none'
                    : 'text-anthracite hover:bg-beige/20'
                  }
                `}
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
                {currentStep === mentalScoreDimensions.length - 1 ? 'Continuer' : 'Suivant'}
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicateurs de progression (points) */}
        <div className="flex justify-center gap-2 mt-6">
          {mentalScoreDimensions.map((_, index) => (
            <div
              key={index}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${index === currentStep
                  ? 'bg-terracotta w-8'
                  : scores[mentalScoreDimensions[index].id]
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