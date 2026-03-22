import { useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export default function TestCleanup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleCleanup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/cleanup-test/${encodeURIComponent(email)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erreur lors du nettoyage');
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error('Erreur cleanup:', err);
      setError('Erreur réseau lors du nettoyage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-beige)] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-[var(--color-noir)] mb-2">
          Nettoyage Utilisateur Test
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Supprimer un utilisateur de Auth, SQL et KV Store
        </p>

        <form onSubmit={handleCleanup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email à supprimer
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aminata.diallo@gmail.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-noir)]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-noir)] text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '🧹 Nettoyage en cours...' : '🗑️ Supprimer l\'utilisateur'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">❌ {error}</p>
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium mb-2">✅ {result.message}</p>
            <div className="text-sm text-green-700 space-y-1">
              <p>• SQL: {result.cleaned.sql ? 'Supprimé' : 'Non trouvé'}</p>
              <p>• Auth: {result.cleaned.auth ? 'Supprimé' : 'Non trouvé'}</p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">🔧 Raccourcis rapides :</p>
          <div className="space-y-2">
            <button
              onClick={() => setEmail('aminata.diallo@gmail.com')}
              className="text-xs text-[var(--color-noir)] hover:underline block"
            >
              • aminata.diallo@gmail.com
            </button>
            <button
              onClick={() => setEmail('test.mona@gmail.com')}
              className="text-xs text-[var(--color-noir)] hover:underline block"
            >
              • test.mona@gmail.com
            </button>
            <button
              onClick={() => setEmail('fatou.sow@gmail.com')}
              className="text-xs text-[var(--color-noir)] hover:underline block"
            >
              • fatou.sow@gmail.com
            </button>
          </div>
        </div>

        <a
          href="/signup"
          className="mt-6 block text-center text-sm text-[var(--color-noir)] hover:underline"
        >
          ← Retour à l'inscription
        </a>
      </div>
    </div>
  );
}
