import { useState } from 'react';
import { Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function AdminLoginTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    const results: any[] = [];

    // Test 1: Login sans code 2FA (devrait demander 2FA)
    try {
      const response1 = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-6378cc81/admin/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email: 'admin@monafrica.net',
            password: 'MonaAdmin2024!'
          }),
        }
      );
      const result1 = await response1.json();
      
      results.push({
        test: 'Test 1: Login sans 2FA',
        expected: '2FA_REQUIRED',
        actual: result1.error,
        success: result1.error === '2FA_REQUIRED',
        details: result1
      });
    } catch (err: any) {
      results.push({
        test: 'Test 1: Login sans 2FA',
        expected: '2FA_REQUIRED',
        actual: 'ERROR',
        success: false,
        details: err.message
      });
    }

    // Test 2: Login avec mauvais code 2FA
    try {
      const response2 = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-6378cc81/admin/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email: 'admin@monafrica.net',
            password: 'MonaAdmin2024!',
            code2FA: '000000'
          }),
        }
      );
      const result2 = await response2.json();
      
      results.push({
        test: 'Test 2: Login avec mauvais code 2FA',
        expected: 'Code de vérification incorrect',
        actual: result2.error,
        success: result2.error === 'Code de vérification incorrect',
        details: result2
      });
    } catch (err: any) {
      results.push({
        test: 'Test 2: Login avec mauvais code 2FA',
        expected: 'Code de vérification incorrect',
        actual: 'ERROR',
        success: false,
        details: err.message
      });
    }

    // Test 3: Login avec bon code 2FA
    try {
      const response3 = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-6378cc81/admin/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email: 'admin@monafrica.net',
            password: 'MonaAdmin2024!',
            code2FA: '202601'
          }),
        }
      );
      const result3 = await response3.json();
      
      results.push({
        test: 'Test 3: Login avec bon code 2FA',
        expected: 'success: true',
        actual: result3.success ? 'success: true' : result3.error,
        success: result3.success === true,
        details: result3
      });
    } catch (err: any) {
      results.push({
        test: 'Test 3: Login avec bon code 2FA',
        expected: 'success: true',
        actual: 'ERROR',
        success: false,
        details: err.message
      });
    }

    // Test 4: Login avec mauvais password
    try {
      const response4 = await fetch(
        `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/make-server-6378cc81/admin/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email: 'admin@monafrica.net',
            password: 'MauvaisPassword'
          }),
        }
      );
      const result4 = await response4.json();
      
      results.push({
        test: 'Test 4: Login avec mauvais password',
        expected: 'Email ou mot de passe incorrect',
        actual: result4.error,
        success: result4.error === 'Email ou mot de passe incorrect',
        details: result4
      });
    } catch (err: any) {
      results.push({
        test: 'Test 4: Login avec mauvais password',
        expected: 'Email ou mot de passe incorrect',
        actual: 'ERROR',
        success: false,
        details: err.message
      });
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const allTestsPassed = testResults.length > 0 && testResults.every(r => r.success);

  return (
    <div className="min-h-screen bg-gradient-to-br from-anthracite via-anthracite/95 to-anthracite p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-terracotta to-gold rounded-2xl mb-4 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-serif text-white mb-2">
            Test de Connexion Admin 2FA
          </h1>
          <p className="text-base text-white/70 font-sans">
            Vérification du flux d'authentification à deux facteurs
          </p>
        </div>

        {/* Identifiants de test */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-serif text-white mb-4">Identifiants de Test</h2>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">Email:</span>
              <span className="text-gold">admin@monafrica.net</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Password:</span>
              <span className="text-gold">MonaAdmin2024!</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Code 2FA:</span>
              <span className="text-gold">202601</span>
            </div>
          </div>
        </div>

        {/* Bouton de lancement */}
        <div className="mb-6 text-center">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="bg-gradient-to-r from-terracotta to-gold text-white px-8 py-3 rounded-full font-sans font-medium text-base hover:shadow-lg hover:shadow-terracotta/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Tests en cours...' : 'Lancer les Tests'}
          </button>
        </div>

        {/* Résultats */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            {/* Status global */}
            <div className={`p-6 rounded-2xl border-2 ${
              allTestsPassed 
                ? 'bg-green-500/20 border-green-500/40' 
                : 'bg-red-500/20 border-red-500/40'
            }`}>
              <div className="flex items-center gap-3">
                {allTestsPassed ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-400" />
                )}
                <div>
                  <h3 className="text-xl font-serif text-white">
                    {allTestsPassed ? 'Tous les tests sont passés !' : 'Certains tests ont échoué'}
                  </h3>
                  <p className="text-sm text-white/70 font-sans">
                    {testResults.filter(r => r.success).length} / {testResults.length} tests réussis
                  </p>
                </div>
              </div>
            </div>

            {/* Détails des tests */}
            {testResults.map((result, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20"
              >
                <div className="flex items-start gap-4">
                  {result.success ? (
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-sans font-medium text-white mb-2">
                      {result.test}
                    </h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex gap-2">
                        <span className="text-white/70">Attendu:</span>
                        <span className="text-gold font-mono">{result.expected}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-white/70">Reçu:</span>
                        <span className={`font-mono ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                          {result.actual}
                        </span>
                      </div>
                    </div>
                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs text-white/50 hover:text-white/70 transition-colors">
                        Détails de la réponse
                      </summary>
                      <pre className="mt-2 p-3 bg-black/30 rounded text-xs text-white/80 overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              </div>
            ))}

            {/* Guide suivant */}
            {allTestsPassed && (
              <div className="bg-blue-500/20 border border-blue-500/40 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-sans font-medium text-white mb-2">
                      Tests Backend Réussis !
                    </h4>
                    <p className="text-sm text-white/80 font-sans leading-relaxed mb-3">
                      Le backend fonctionne correctement. Vous pouvez maintenant tester l'interface de connexion.
                    </p>
                    <a
                      href="/admin/login"
                      className="inline-block bg-gradient-to-r from-terracotta to-gold text-white px-6 py-2 rounded-full font-sans font-medium text-sm hover:shadow-lg transition-all"
                    >
                      Tester l'Interface de Connexion
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
