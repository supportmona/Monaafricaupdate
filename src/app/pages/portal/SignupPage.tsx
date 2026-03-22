import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, User } from "lucide-react";
import { useNavigate } from "react-router";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, error: authError, clearError } = useMemberAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    clearError();
    setIsLoading(true);

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError("Veuillez accepter les conditions d'utilisation");
      setIsLoading(false);
      return;
    }

    try {
      const success = await signup(email, password, name);
      
      if (success) {
        // Vérifier si un MONA Score existe dans sessionStorage (depuis l'onboarding)
        const mentalScoresJson = sessionStorage.getItem('mona_mental_scores');
        
        if (mentalScoresJson) {
          try {
            const mentalScores = JSON.parse(mentalScoresJson);
            const scoresArray = Object.values(mentalScores).filter(score => typeof score === 'number' && score >= 1 && score <= 5) as number[];
            
            if (scoresArray.length > 0) {
              // Calculer le score global (même formule que OnboardingResultsPage)
              const averageScore = scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length;
              const globalScore = Math.round((averageScore / 5) * 100);
              
              console.log("📊 Sauvegarde du MONA Score après signup:", globalScore);
              
              // Récupérer le token et userId depuis localStorage (fraîchement créés par signup)
              const token = localStorage.getItem('mona_member_token');
              const userDataJson = localStorage.getItem('mona_member_user');
              
              if (token && userDataJson) {
                const userData = JSON.parse(userDataJson);
                const userId = userData.id;
                
                // Sauvegarder le score initial dans le backend
                await fetch(
                  `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/mona-score/${userId}`,
                  {
                    method: 'POST',
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${publicAnonKey}`,
                      "X-User-Token": token,
                    },
                    body: JSON.stringify({
                      assessmentType: "onboarding",
                      scoreValue: globalScore,
                      notes: "Score initial depuis l'onboarding",
                      mentalScores: mentalScores,
                    })
                  }
                );
                
                console.log("✅ MONA Score sauvegardé avec succès");
                
                // Nettoyer sessionStorage
                sessionStorage.removeItem('mona_mental_scores');
                sessionStorage.removeItem('mona_matching_answers');
              }
            }
          } catch (scoreError) {
            console.error("❌ Erreur lors de la sauvegarde du MONA Score:", scoreError);
            // Ne pas bloquer l'inscription si la sauvegarde échoue
          }
        }
        
        // Redirection vers le dashboard membre
        navigate('/member/dashboard');
      } else if (authError) {
        setError(authError);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <a href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                <span className="text-white font-serif text-xs sm:text-sm">M</span>
              </div>
              <span className="text-base sm:text-lg font-serif text-[#1A1A1A]">M.O.N.A</span>
            </a>
            <a 
              href="/login" 
              className="text-xs sm:text-sm text-[#A68B6F] hover:text-[#8A7159] transition-colors"
            >
              Se connecter
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Titre */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-[#1A1A1A] mb-2 sm:mb-3">
              Rejoignez <span className="font-serif italic">M.O.N.A</span>
            </h1>
            <p className="text-sm sm:text-base text-[#1A1A1A]/60">
              Créez votre compte pour commencer votre parcours bien-être
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D4C5B9]">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Nom complet */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#1A1A1A]/40" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#A68B6F] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#1A1A1A]/40" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#A68B6F] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#1A1A1A]/40" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#A68B6F] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirmer mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#1A1A1A]/40" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre mot de passe"
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#A68B6F] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Accepter les conditions */}
              <div>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-[#D4C5B9] text-[#A68B6F] focus:ring-[#A68B6F] focus:ring-offset-0"
                    required
                  />
                  <span className="text-xs sm:text-sm text-[#1A1A1A]/80">
                    J'accepte les{" "}
                    <a href="/conditions" className="text-[#A68B6F] hover:underline">
                      Conditions d'utilisation
                    </a>
                    {" "}et la{" "}
                    <a href="/confidentialite" className="text-[#A68B6F] hover:underline">
                      Politique de confidentialité
                    </a>
                  </span>
                </label>
              </div>

              {/* Bouton d'inscription */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A1A1A] text-white rounded-full py-2.5 sm:py-3 px-6 text-sm sm:text-base font-medium hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Création du compte en cours...</span>
                ) : (
                  <>
                    <span>Créer mon compte</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D4C5B9]"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-4 bg-white text-[#1A1A1A]/60">Ou s'inscrire avec</span>
              </div>
            </div>

            {/* Connexion sociale */}
            <div className="space-y-3">
              <button className="w-full bg-white border border-[#D4C5B9] text-[#1A1A1A] rounded-full py-2.5 sm:py-3 px-6 text-sm sm:text-base font-medium hover:bg-[#F5F1ED] transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </button>
            </div>
          </div>

          {/* Lien connexion */}
          <p className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-[#1A1A1A]/60">
            Vous avez déjà un compte ?{" "}
            <a href="/login" className="text-[#A68B6F] font-medium hover:underline">
              Se connecter
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}