import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Building, Mail, Lock, Eye, EyeOff, ArrowRight, Copy, Check } from "lucide-react";
import { useB2BAuth } from "@/app/contexts/B2BAuthContext";

export default function EntrepriseLoginPage() {
  const navigate = useNavigate();
  const { login } = useB2BAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleQuickLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        // Stocker le token pour CompanyProtectedRoute
        localStorage.setItem("mona_company_token", "demo-token-b2b");
        localStorage.setItem("mona_company_user", JSON.stringify({ email }));
        
        setTimeout(() => {
          navigate("/company/dashboard");
        }, 300);
      } else {
        setError("Email ou mot de passe incorrect. Utilisez un compte de test valide.");
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-white to-beige/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          {/* Left Column - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="max-w-lg">
              <div className="inline-block px-4 py-2 bg-terracotta/10 rounded-full mb-6">
                <p className="text-xs font-sans uppercase tracking-wider text-terracotta">
                  ESPACE ENTREPRISE
                </p>
              </div>
              <h1 className="text-5xl lg:text-6xl font-serif text-anthracite mb-6">
                Votre partenaire en <span className="text-terracotta italic">bien-être mental</span>
              </h1>
              <p className="text-lg text-anthracite/70 mb-8 leading-relaxed">
                Accédez à votre tableau de bord entreprise pour gérer vos collaborateurs, suivre les consultations et analyser le bien-être de vos équipes.
              </p>

              {/* Features List */}
              <div className="space-y-4">
                {[
                  "Dashboard RH anonymisé en temps réel",
                  "Gestion des crédits consultations",
                  "Analytics & rapports mensuels",
                  "Support dédié 24/7",
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-terracotta/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-terracotta rounded-full"></div>
                    </div>
                    <p className="text-anthracite/80">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-anthracite/5">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-gradient-to-br from-terracotta to-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <Building className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-serif text-anthracite mb-2">
                  Connexion Entreprise
                </h2>
                <p className="text-sm text-anthracite/60">
                  Accédez à votre espace de gestion
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Test Accounts Banner */}
                <div className="bg-gradient-to-r from-terracotta/10 to-gold/10 border border-terracotta/20 rounded-2xl p-4">
                  <p className="text-xs font-sans uppercase tracking-wider text-terracotta/80 mb-3">
                    COMPTES DE TEST DISPONIBLES
                  </p>
                  <div className="space-y-3 text-xs">
                    {/* Account 1 */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-medium text-anthracite">Entreprise Démo</div>
                        <div className="text-anthracite/60 font-mono text-[10px]">
                          demo.rh@monafrica.net • RH2025!
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin("demo.rh@monafrica.net", "RH2025!")}
                        className="px-3 py-1.5 bg-terracotta/20 hover:bg-terracotta/30 text-terracotta rounded-lg text-[10px] font-medium transition-colors whitespace-nowrap"
                      >
                        Utiliser
                      </button>
                    </div>
                    
                    {/* Account 2 */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-medium text-anthracite">Ekolo Tech</div>
                        <div className="text-anthracite/60 font-mono text-[10px]">
                          rh@ekolo-tech.com • MonaB2B2024!
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin("rh@ekolo-tech.com", "MonaB2B2024!")}
                        className="px-3 py-1.5 bg-terracotta/20 hover:bg-terracotta/30 text-terracotta rounded-lg text-[10px] font-medium transition-colors whitespace-nowrap"
                      >
                        Utiliser
                      </button>
                    </div>
                    
                    {/* Account 3 */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-medium text-anthracite">Bantu Finance</div>
                        <div className="text-anthracite/60 font-mono text-[10px]">
                          hr@bantu-finance.com • MonaB2B2024!
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin("hr@bantu-finance.com", "MonaB2B2024!")}
                        className="px-3 py-1.5 bg-terracotta/20 hover:bg-terracotta/30 text-terracotta rounded-lg text-[10px] font-medium transition-colors whitespace-nowrap"
                      >
                        Utiliser
                      </button>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">
                    Email professionnel
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-anthracite/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@votreentreprise.com"
                      required
                      className="w-full pl-12 pr-4 py-3.5 border border-anthracite/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-anthracite/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-12 pr-12 py-3.5 border border-anthracite/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-anthracite/40 hover:text-anthracite transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border-anthracite/20 rounded text-terracotta focus:ring-terracotta/50"
                    />
                    <span className="text-sm text-anthracite/70">Se souvenir de moi</span>
                  </label>
                  <a
                    href="/entreprise/forgot-password"
                    className="text-sm text-terracotta hover:underline"
                  >
                    Mot de passe oublié ?
                  </a>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-anthracite text-white py-4 rounded-full font-medium hover:bg-anthracite/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      Se connecter
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-anthracite/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-anthracite/50">
                    Nouveau partenaire ?
                  </span>
                </div>
              </div>

              {/* Create Account Link */}
              <div className="text-center">
                <a
                  href="/b2b"
                  className="inline-flex items-center gap-2 text-terracotta hover:underline font-medium"
                >
                  Découvrir nos offres entreprise
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Help Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center space-y-2"
            >
              <p className="text-sm text-anthracite/60">
                Besoin d'aide ?{" "}
                <a href="mailto:entreprises@monafrica.net" className="text-terracotta hover:underline">
                  Contacter notre équipe B2B
                </a>
              </p>
              <div className="flex items-center justify-center gap-3 text-xs text-anthracite/40">
                <a href="/" className="hover:text-terracotta transition-colors">
                  Accueil
                </a>
                <span>•</span>
                <a href="/b2b" className="hover:text-terracotta transition-colors">
                  Solutions B2B
                </a>
                <span>•</span>
                <a href="/contact" className="hover:text-terracotta transition-colors">
                  Contact
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}