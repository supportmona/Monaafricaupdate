import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Mail, Eye, EyeOff, UserCog, AlertCircle, Loader2 } from 'lucide-react';
import { useExpertAuth } from '@/app/contexts/ExpertAuthContext';
import NavigationBar from '@/app/components/NavigationBar';

export default function PortalExpertPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useExpertAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTestCredentials, setShowTestCredentials] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Nettoyer les espaces invisibles
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();
      
      await login(cleanEmail, cleanPassword);
      navigate('/expert/dashboard');
    } catch (err) {
      console.error('Erreur de connexion:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillTestCredentials = () => {
    setEmail('demo.expert@monafrica.net');
    setPassword('Expert2025!');
    setShowTestCredentials(false);
  };

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center px-4 py-8 sm:py-12 pt-20 sm:pt-24">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-terracotta to-terracotta/80 rounded-2xl mb-4 shadow-lg">
              <UserCog className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-anthracite mb-2">
              Portail Expert
            </h1>
            <p className="text-sm sm:text-base text-anthracite/60 font-sans px-4">
              Connectez-vous à votre espace professionnel
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
                    Email : demo.expert@monafrica.net<br/>
                    Mot de passe : Expert2025!
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
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 border border-beige/20">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-sans font-medium text-anthracite mb-2">
                  Adresse email professionnelle
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-anthracite/40 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dr.nom@monafrica.net"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent font-sans"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-sans font-medium text-anthracite mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-anthracite/40 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border border-beige/40 rounded-xl focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all font-sans text-anthracite"
                    placeholder="••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-anthracite/40 hover:text-anthracite transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              {/* Erreur */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-anthracite text-white py-2.5 sm:py-3 rounded-full font-sans font-medium text-sm sm:text-base hover:bg-anthracite/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {(isSubmitting || loading) ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            {/* Liens utiles */}
            <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-beige/30">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm">
                <a href="/expert-space" className="text-terracotta hover:text-terracotta/80 transition-colors font-sans">
                  Devenir expert M.O.N.A
                </a>
                <a href="/help" className="text-anthracite/60 hover:text-anthracite transition-colors font-sans">
                  Besoin d'aide ?
                </a>
              </div>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs sm:text-sm text-anthracite/60 font-sans px-4">
              Vous n'avez pas encore de compte ?{' '}
              <a href="/expert-space" className="text-terracotta hover:text-terracotta/80 transition-colors font-medium">
                Rejoignez notre réseau
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}