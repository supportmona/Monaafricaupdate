import { useState, useEffect, startTransition } from 'react';
import { useNavigate } from 'react-router';
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { useAdminAuth } from '@/app/contexts/AdminAuthContext';
import { motion } from 'motion/react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, error, clearError } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code2FA, setCode2FA] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    const success = await login(email, password);
    
    setIsSubmitting(false);
    
    if (success) {
      startTransition(() => {
        navigate('/admin/dashboard');
      });
    }
    // Si l'erreur est 2FA_REQUIRED, on passe à l'étape 2FA
    // Note: on doit attendre un cycle de rendu pour que l'erreur soit mise à jour
  };

  // Effet pour détecter quand le 2FA est requis
  useEffect(() => {
    console.log('📊 État actuel - error:', error, '- step:', step);
    if (error === '2FA_REQUIRED' && step === 'credentials') {
      console.log('🔄 Passage à l\'étape 2FA');
      setStep('2fa');
      clearError(); // Clear pour ne pas afficher l'erreur sur l'écran 2FA
    }
  }, [error, step, clearError]);

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();

    console.log('🔐 Soumission du code 2FA:', code2FA);
    const success = await login(email, password, code2FA);
    
    setIsSubmitting(false);
    
    if (success) {
      console.log('✅ 2FA validé, redirection...');
      startTransition(() => {
        navigate('/admin/dashboard');
      });
    } else {
      console.error('❌ Code 2FA invalide');
      // L'erreur sera affichée par le contexte
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-anthracite via-anthracite/95 to-anthracite flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-terracotta to-gold rounded-2xl mb-4 shadow-2xl">
            <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white mb-2">
            Portail Administrateur
          </h1>
          <p className="text-sm sm:text-base text-white/70 font-sans px-4">
            Accès sécurisé réservé aux administrateurs M.O.N.A
          </p>
        </motion.div>

        {/* Formulaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20"
        >
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 sm:space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-sans font-medium text-white mb-2">
                  Adresse email administrateur
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all font-sans text-white placeholder:text-white/40"
                    placeholder="admin@monafrica.net"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-sans font-medium text-white mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all font-sans text-white placeholder:text-white/40"
                    placeholder="••••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>

              {/* Erreur */}
              {error && error !== '2FA_REQUIRED' && (
                <div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/40 rounded-xl flex items-start gap-2 sm:gap-3">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-red-200 font-sans">{error}</p>
                </div>
              )}

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-terracotta to-gold text-white py-2.5 sm:py-3 rounded-full font-sans font-medium text-sm sm:text-base hover:shadow-lg hover:shadow-terracotta/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  'Continuer'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handle2FASubmit} className="space-y-4 sm:space-y-6">
              {/* En-tête 2FA */}
              <div className="text-center pb-4 border-b border-white/20">
                <KeyRound className="w-10 h-10 sm:w-12 sm:h-12 text-gold mx-auto mb-3" />
                <h2 className="text-xl sm:text-2xl font-serif text-white mb-2">
                  Authentification à deux facteurs
                </h2>
                <p className="text-xs sm:text-sm text-white/70 font-sans">
                  Entrez le code de vérification à 6 chiffres
                </p>
              </div>

              {/* Code 2FA */}
              <div>
                <label htmlFor="code2fa" className="block text-xs sm:text-sm font-sans font-medium text-white mb-2">
                  Code de vérification
                </label>
                <input
                  id="code2fa"
                  type="text"
                  value={code2FA}
                  onChange={(e) => setCode2FA(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 sm:py-4 text-xl sm:text-2xl text-center bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-terracotta focus:border-transparent transition-all font-mono text-white placeholder:text-white/40 tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              {/* Erreur */}
              {error && error !== '2FA_REQUIRED' && (
                <div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/40 rounded-xl flex items-start gap-2 sm:gap-3">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-red-200 font-sans">{error}</p>
                </div>
              )}

              {/* Boutons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials');
                    setCode2FA('');
                    clearError();
                  }}
                  className="flex-1 bg-white/10 text-white py-2.5 sm:py-3 rounded-full font-sans font-medium text-sm sm:text-base hover:bg-white/20 transition-all"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || code2FA.length !== 6}
                  className="flex-1 bg-gradient-to-r from-terracotta to-gold text-white py-2.5 sm:py-3 rounded-full font-sans font-medium text-sm sm:text-base hover:shadow-lg hover:shadow-terracotta/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    'Vérifier et se connecter'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Sécurité info */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-white/80 font-sans leading-relaxed">
                  Connexion sécurisée avec authentification à deux facteurs (2FA). 
                  Toutes les actions sont enregistrées et surveillées.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lien retour */}
        <div className="mt-4 sm:mt-6 text-center">
          <a 
            href="/" 
            className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors font-sans"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}