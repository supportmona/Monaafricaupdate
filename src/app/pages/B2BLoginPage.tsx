import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Building2, Lock, Mail, AlertCircle, Loader2, Monitor } from 'lucide-react';
import { useB2BAuth } from '@/app/contexts/B2BAuthContext';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import NavigationBar from '@/app/components/NavigationBar';

export default function B2BLoginPage() {
  const navigate = useNavigate();
  const { login } = useB2BAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTestCredentials, setShowTestCredentials] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        navigate('/dashboard-rh');
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestCredentials = (accountIndex: number) => {
    const testAccounts = [
      { email: 'rh@ekolo-tech.com', password: 'MonaB2B2024!' },
      { email: 'hr@bantu-finance.com', password: 'MonaB2B2024!' },
    ];
    
    setEmail(testAccounts[accountIndex].email);
    setPassword(testAccounts[accountIndex].password);
    setShowTestCredentials(false);
  };

  return (
    <>
      {/* Header M.O.N.A */}
      <NavigationBar />
      
      {/* Page de connexion avec padding-top pour éviter le header fixe */}
      <div className="min-h-screen pt-24 sm:pt-28 lg:pt-32 bg-gradient-to-br from-beige/20 via-white to-terracotta/10 flex items-center justify-center p-4 pb-8">
        <div className="w-full max-w-md">
          
          {/* Avertissement ordinateur requis - visible sur mobile/tablette */}
          <div className="lg:hidden mb-6">
            <Alert className="bg-amber-50 border-amber-200">
              <Monitor className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-sm text-amber-800">
                Ce portail nécessite un ordinateur de bureau ou portable.
              </AlertDescription>
            </Alert>
          </div>

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-terracotta rounded-2xl mb-4">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-serif text-anthracite mb-2">
              Portail Entreprise
            </h1>
            <p className="text-muted-foreground font-sans">
              Dashboard B2B / RH • M.O.N.A
            </p>
          </div>

          {/* Test Credentials Banner */}
          {showTestCredentials && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800">
                <div className="font-semibold mb-2">Comptes de démonstration :</div>
                <div className="space-y-2 text-xs">
                  <button
                    onClick={() => fillTestCredentials(0)}
                    className="block w-full text-left p-2 rounded bg-white hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium">Ekolo Tech (Multi-sites)</div>
                    <div className="text-blue-600">rh@ekolo-tech.com</div>
                  </button>
                  <button
                    onClick={() => fillTestCredentials(1)}
                    className="block w-full text-left p-2 rounded bg-white hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium">Bantu Finance (Kinshasa)</div>
                    <div className="text-blue-600">hr@bantu-finance.com</div>
                  </button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-beige/30 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-anthracite mb-2 font-sans"
                >
                  Email professionnel
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rh@entreprise.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent font-sans"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-anthracite mb-2 font-sans"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-transparent font-sans"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-terracotta text-white rounded-lg font-sans font-medium hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  'Se connecter'
                )}
              </button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <a 
                  href="#" 
                  className="text-sm text-terracotta hover:underline font-sans"
                >
                  Mot de passe oublié ?
                </a>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground font-sans">
              Vous n'avez pas encore de compte ?{' '}
              <a href="/contact" className="text-terracotta hover:underline font-medium">
                Contactez-nous
              </a>
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground font-sans">
              <a href="/confidentialite" className="hover:text-terracotta">Confidentialité</a>
              <span>•</span>
              <a href="/conditions" className="hover:text-terracotta">CGU</a>
              <span>•</span>
              <a href="/aide" className="hover:text-terracotta">Aide</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}