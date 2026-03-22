import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, error: authError, clearError } = useMemberAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTestCredentials, setShowTestCredentials] = useState(true);

  const fillTestCredentials = () => {
    setEmail('amara.diallo@gmail.com');
    setPassword('Test1234!');
    setShowTestCredentials(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    clearError();
    setIsLoading(true);

    // Nettoyer les espaces dans l'email et le mot de passe
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // Validation basique
    if (!cleanEmail || !cleanPassword) {
      setError("Veuillez remplir tous les champs");
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(cleanEmail, cleanPassword);
      
      if (success) {
        // Redirection vers le dashboard membre
        navigate('/member/dashboard');
      } else if (authError) {
        setError(authError);
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion");
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
              href="/signup" 
              className="text-xs sm:text-sm text-[#A68B6F] hover:text-[#8A7159] transition-colors"
            >
              Créer un compte
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
              Bienvenue sur <span className="font-serif italic">M.O.N.A</span>
            </h1>
            <p className="text-sm sm:text-base text-[#1A1A1A]/60">
              Connectez-vous pour accéder à votre espace membre
            </p>
          </div>

          {/* Bannière de test */}
          {showTestCredentials && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gold/10 border border-gold/30 rounded-xl">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] sm:text-xs font-sans font-bold text-gold uppercase tracking-wide mb-1 sm:mb-2">
                    Compte de Démonstration
                  </p>
                  <p className="text-xs sm:text-sm text-anthracite/70 mb-2 sm:mb-3 font-sans">
                    Email : amara.diallo@gmail.com<br/>
                    Mot de passe : Test1234!
                  </p>
                  <button
                    onClick={fillTestCredentials}
                    className="text-[10px] sm:text-xs font-sans font-bold text-terracotta hover:text-terracotta/80 transition-colors uppercase tracking-wide"
                  >
                    Remplir automatiquement
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#D4C5B9]">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                    placeholder="••••••••"
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

              {/* Se souvenir et mot de passe oublié */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D4C5B9] text-[#A68B6F] focus:ring-[#A68B6F] focus:ring-offset-0"
                  />
                  <span className="text-xs sm:text-sm text-[#1A1A1A]/80">Se souvenir de moi</span>
                </label>
                <a href="/forgot-password" className="text-xs sm:text-sm text-[#A68B6F] hover:underline">
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1A1A1A] text-white rounded-full py-2.5 sm:py-3 px-6 text-sm sm:text-base font-medium hover:bg-[#2A2A2A] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>Connexion en cours...</span>
                ) : (
                  <>
                    <span>Se connecter</span>
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
                <span className="px-4 bg-white text-[#1A1A1A]/60">Ou continuer avec</span>
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

          {/* Lien inscription */}
          <p className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-[#1A1A1A]/60">
            Vous n'avez pas de compte ?{" "}
            <a href="/signup" className="text-[#A68B6F] font-medium hover:underline">
              Créer un compte
            </a>
          </p>

          {/* Liens légaux */}
          <p className="text-center mt-3 sm:mt-4 text-[10px] sm:text-xs text-[#1A1A1A]/40 px-4">
            En vous connectant, vous acceptez nos{" "}
            <a href="/conditions" className="hover:underline">Conditions d'utilisation</a>
            {" "}et notre{" "}
            <a href="/confidentialite" className="hover:underline">Politique de confidentialité</a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}