import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Building2, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RHLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // TODO: Connecter à l'API d'authentification RH
      // Temporaire : vérification basique pour le prototype
      const validRHEmails = [
        "rh@monafrica.net",
        "operations@monafrica.net",
        "support@monafrica.net",
        "recrutement@monafrica.net"
      ];

      if (validRHEmails.includes(email.toLowerCase()) && password.length >= 6) {
        // Simuler la connexion réussie
        setTimeout(() => {
          navigate("/rh/dashboard");
        }, 800);
      } else {
        setError("Email ou mot de passe incorrect. Accès réservé à l'équipe M.O.N.A.");
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige via-white to-beige/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-to-br from-gold to-terracotta rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Building2 className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-serif text-anthracite mb-2">
            Portail <span className="text-terracotta italic">RH</span>
          </h1>
          <p className="text-sm font-sans uppercase tracking-wider text-anthracite/60 mb-1">
            ÉQUIPE M.O.N.A
          </p>
          <p className="text-xs text-anthracite/50">
            Ressources Humaines & Opérations
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-anthracite/5"
        >
          <form onSubmit={handleLogin} className="space-y-6">
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
                  placeholder="prenom.nom@monafrica.net"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-anthracite/20 rounded-full focus:outline-none focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta transition-all"
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
                  className="w-full pl-12 pr-12 py-3.5 border border-anthracite/20 rounded-full focus:outline-none focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta transition-all"
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
              className="w-full bg-anthracite text-white py-4 rounded-full font-medium hover:bg-anthracite/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connexion en cours...
                </span>
              ) : (
                "Accéder au portail RH"
              )}
            </button>

            {/* Help Text */}
            <p className="text-center text-sm text-anthracite/50 mt-4">
              Problème de connexion ?{" "}
              <a href="mailto:support@monafrica.net" className="text-terracotta hover:underline">
                Contacter le support IT
              </a>
            </p>
          </form>
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center space-y-2"
        >
          <p className="text-xs text-anthracite/40">
            Accès sécurisé réservé aux membres de l'équipe M.O.N.A
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-anthracite/30">
            <a href="/" className="hover:text-terracotta transition-colors">
              Retour à l'accueil
            </a>
            <span>•</span>
            <a href="/admin/login" className="hover:text-terracotta transition-colors">
              Portail Admin
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
