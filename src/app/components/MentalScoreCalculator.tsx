import { useState } from "react";
import { motion } from "motion/react";
import { Brain, TrendingUp, CheckCircle2 } from "lucide-react";

export default function MentalScoreCalculator() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    "Comment évaluez-vous votre niveau de stress quotidien ?",
    "À quelle fréquence vous sentez-vous énergique ?",
    "Comment évaluez-vous la qualité de votre sommeil ?",
    "Vous sentez-vous soutenu par votre entourage ?",
    "Avez-vous des moments de détente dans votre routine ?",
  ];

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const total = answers.reduce((acc, val) => acc + val, 0);
    return Math.round((total / (questions.length * 5)) * 100);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <section id="score" className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-background to-beige/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl text-center"
          >
            <div className="mb-4 sm:mb-6">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-terracotta mx-auto mb-2 sm:mb-3" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif text-anthracite mb-2 sm:mb-3">
                Votre Score Mental
              </h2>
              <div className="text-4xl sm:text-5xl lg:text-6xl font-serif text-terracotta mb-2 sm:mb-3">
                {score}
                <span className="text-lg sm:text-xl lg:text-2xl text-muted-foreground">/100</span>
              </div>
              <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-sans mb-4 sm:mb-6 px-2">
                {score >= 80
                  ? "Excellent ! Votre équilibre mental est remarquable."
                  : score >= 60
                  ? "Bien ! Quelques ajustements peuvent améliorer votre bien-être."
                  : "Nous sommes là pour vous accompagner vers l'excellence."}
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
              <div className="flex items-start gap-2 sm:gap-3 text-left">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs sm:text-sm font-serif text-anthracite mb-0.5">Recommandations personnalisées</h4>
                  <p className="text-xs text-muted-foreground font-sans">
                    Accédez à des thérapeutes qualifiés via notre Smart Matching culturel
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 text-left">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-xs sm:text-sm font-serif text-anthracite mb-0.5">Suivi continu</h4>
                  <p className="text-xs text-muted-foreground font-sans">
                    Votre Passeport Santé sécurisé (norme FHIR) pour suivre votre évolution
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-sans text-sm sm:text-base">
                Créer mon compte
              </button>
              <button
                onClick={resetQuiz}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-beige text-anthracite rounded-lg hover:bg-beige/10 transition-all duration-200 font-sans text-sm sm:text-base"
              >
                Refaire le test
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="score" className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-background to-beige/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif text-anthracite mb-3 sm:mb-4 px-2">
            Calculez votre Score Mental
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-sans px-4">
            Un diagnostic rapide pour comprendre votre bien-être actuel
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm text-muted-foreground font-sans">
              Question {currentQuestion + 1} sur {questions.length}
            </span>
            <span className="text-xs sm:text-sm text-terracotta font-sans">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-beige/30 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
              className="h-full bg-terracotta rounded-full"
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl"
        >
          <h3 className="text-lg sm:text-xl lg:text-2xl font-serif text-anthracite mb-6 sm:mb-8 text-center px-2">
            {questions[currentQuestion]}
          </h3>

          <div className="space-y-2 sm:space-y-3">
            {[
              { label: "Très faible", score: 1 },
              { label: "Faible", score: 2 },
              { label: "Moyen", score: 3 },
              { label: "Élevé", score: 4 },
              { label: "Très élevé", score: 5 },
            ].map((option) => (
              <button
                key={option.score}
                onClick={() => handleAnswer(option.score)}
                className="w-full p-3 sm:p-4 text-left border-2 border-beige/30 rounded-lg hover:border-terracotta hover:bg-terracotta/5 transition-all duration-200 font-sans active:scale-98"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base text-anthracite">{option.label}</span>
                  <div className="flex gap-1">
                    {[...Array(option.score)].map((_, idx) => (
                      <div
                        key={idx}
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-terracotta"
                      />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}