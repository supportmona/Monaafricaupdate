import { useState } from "react";
import { motion } from "motion/react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation de l'email
    if (!email) {
      setError("Veuillez saisir votre adresse email");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez saisir une adresse email valide");
      setIsLoading(false);
      return;
    }

    try {
      // Simuler l'envoi d'un email de réinitialisation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En production, cela ferait un appel à l'API backend pour envoyer l'email
      // const response = await fetch(
      //   `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/forgot-password`,
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       Authorization: `Bearer ${publicAnonKey}`,
      //     },
      //     body: JSON.stringify({ email }),
      //   }
      // );

      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
            <Link 
              to="/login" 
              className="text-xs sm:text-sm text-[#A68B6F] hover:text-[#8A7159] transition-colors"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {!success ? (
            <div className="bg-white rounded-2xl border border-[#D4C5B9] p-6 sm:p-8 shadow-sm">
              {/* Titre */}
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-serif text-[#1A1A1A] mb-2 sm:mb-3">
                  Mot de passe oublié
                </h1>
                <p className="text-xs sm:text-sm text-[#1A1A1A]/60">
                  Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe
                </p>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-[#1A1A1A] mb-1.5 sm:mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#1A1A1A]/40" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@exemple.com"
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-[#FAF8F5] border border-[#D4C5B9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent transition-all"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Message d'erreur */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-red-800">{error}</p>
                  </motion.div>
                )}

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1A1A1A] text-white py-3 sm:py-3.5 rounded-full font-sans font-medium text-sm sm:text-base hover:bg-[#2A2A2A] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Envoi en cours...
                    </span>
                  ) : (
                    "Envoyer le lien de réinitialisation"
                  )}
                </button>
              </form>

              {/* Lien de retour */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#A68B6F] hover:text-[#8A7159] transition-colors"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  Retour à la connexion
                </Link>
              </div>
            </div>
          ) : (
            /* Message de succès */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl border border-[#D4C5B9] p-6 sm:p-8 shadow-sm"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-4 sm:mb-6">
                  <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
                </div>
                
                <h2 className="text-xl sm:text-2xl font-serif text-[#1A1A1A] mb-2 sm:mb-3">
                  Email envoyé avec succès
                </h2>
                
                <p className="text-xs sm:text-sm text-[#1A1A1A]/70 mb-6 sm:mb-8 max-w-sm mx-auto">
                  Nous avons envoyé un lien de réinitialisation à <strong className="text-[#1A1A1A]">{email}</strong>. 
                  Veuillez vérifier votre boîte de réception et suivre les instructions.
                </p>

                <div className="space-y-3 sm:space-y-4">
                  <Link
                    to="/login"
                    className="block w-full bg-[#1A1A1A] text-white py-2.5 sm:py-3 rounded-full font-sans font-medium text-sm sm:text-base hover:bg-[#2A2A2A] transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    Retour à la connexion
                  </Link>
                  
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                    className="block w-full text-[#A68B6F] py-2.5 sm:py-3 rounded-full font-sans font-medium text-sm sm:text-base hover:text-[#8A7159] transition-colors"
                  >
                    Renvoyer un email
                  </button>
                </div>
              </div>

              {/* Note */}
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-[#D4C5B9]">
                <p className="text-[10px] sm:text-xs text-[#1A1A1A]/50 text-center">
                  Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam ou contactez notre support à{" "}
                  <a href="mailto:support@monafrica.net" className="text-[#A68B6F] hover:underline">
                    support@monafrica.net
                  </a>
                </p>
              </div>
            </motion.div>
          )}

          {/* Aide */}
          <div className="mt-6 text-center">
            <p className="text-[10px] sm:text-xs text-[#1A1A1A]/40">
              Besoin d'aide ?{" "}
              <a href="/contact" className="text-[#A68B6F] hover:underline">
                Contactez notre support
              </a>
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#D4C5B9] py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] sm:text-xs text-[#1A1A1A]/40">
            2026 M.O.N.A. Tous droits réservés.{" "}
            <a href="/confidentialite" className="hover:underline">Politique de confidentialité</a>
            {" "}·{" "}
            <a href="/conditions" className="hover:underline">Conditions d'utilisation</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
