import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, ArrowRight, AlertCircle, Loader2, UserPlus } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useExpertAuth } from "@/app/contexts/ExpertAuthContext";

export default function ExpertLoginPage() {
  const navigate = useNavigate();
  const { login } = useExpertAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/expert/dashboard");
    } catch (err: any) {
      setError(err.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  // Remplir les champs avec le compte démo
  const fillDemoCredentials = async () => {
    setLoading(true);
    setError("");

    try {
      // Initialiser le compte démo côté serveur
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/init-demo`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Remplir les champs avec les credentials
        setEmail(result.credentials.email);
        setPassword(result.credentials.password);
      } else {
        setError(result.error || "Erreur initialisation compte démo");
      }
    } catch (err: any) {
      setError("Erreur technique lors de l'initialisation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-serif text-[#1A1A1A]">M.O.N.A</h1>
          </Link>
          <p className="text-sm text-[#1A1A1A]/60 mt-2">Portail Expert</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#D4C5B9]">
          <h2 className="text-2xl font-serif text-[#1A1A1A] mb-2">Connexion</h2>
          <p className="text-sm text-[#1A1A1A]/60 mb-8">
            Accédez à votre espace professionnel
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-900">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Email professionnel
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent"
                  placeholder="expert@monafrica.net"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-[#D4C5B9]" />
                <span className="text-[#1A1A1A]/60">Se souvenir de moi</span>
              </label>
              <Link
                to="/expert/forgot-password"
                className="text-[#A68B6F] hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white rounded-full py-3 font-medium hover:bg-[#2A2A2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
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

          {/* Bouton Compte Démo */}
          <div className="mt-6">
            <button
              onClick={fillDemoCredentials}
              disabled={loading}
              className="w-full bg-[#A68B6F] text-white rounded-full py-3 font-medium hover:bg-[#8A7159] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Créer et utiliser un compte démo
                </>
              )}
            </button>
            <p className="text-xs text-center text-[#1A1A1A]/50 mt-2">
              Dr. Sarah Koné - Psychiatre
            </p>
            <p className="text-xs text-center text-[#1A1A1A]/60 mt-1 font-mono">
              demo.expert@monafrica.net / Expert2025!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[#1A1A1A]/40">
            Plateforme sécurisée et conforme aux normes de confidentialité médicale
          </p>
        </div>
      </motion.div>
    </div>
  );
}