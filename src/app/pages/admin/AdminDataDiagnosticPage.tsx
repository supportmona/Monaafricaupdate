import { useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react";

/**
 * PAGE DE DIAGNOSTIC DES DONNÉES ADMIN
 * 
 * Cette page vérifie que le dashboard admin reçoit bien les vraies données
 * depuis la base de données Supabase.
 */
export default function AdminDataDiagnosticPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostic = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔍 Démarrage du diagnostic des données admin...');

      // 1. Test de connexion à l'API
      console.log('📡 Test de connexion à l\'API...');
      const healthResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/health`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );

      if (!healthResponse.ok) {
        throw new Error(`API non disponible: ${healthResponse.status}`);
      }

      // 2. Récupération des analytics
      console.log('📊 Récupération des analytics admin...');
      const analyticsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/admin/analytics`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!analyticsResponse.ok) {
        const errorText = await analyticsResponse.text();
        throw new Error(`Erreur analytics: ${analyticsResponse.status} - ${errorText}`);
      }

      const analyticsData = await analyticsResponse.json();
      console.log('✅ Analytics récupérées:', analyticsData);

      // 3. Analyse des données
      const analysis = {
        api: {
          status: 'ok',
          message: 'API accessible'
        },
        analytics: {
          status: analyticsData.success ? 'ok' : 'error',
          message: analyticsData.success ? 'Analytics chargées' : 'Erreur chargement'
        },
        data: {
          users: analyticsData.data?.platformStats?.totalUsers || 0,
          experts: analyticsData.data?.platformStats?.totalExperts || 0,
          companies: analyticsData.data?.platformStats?.totalCompanies || 0,
          consultations: analyticsData.data?.consultationStats?.total || 0,
          revenueXOF: analyticsData.data?.revenueStats?.thisMonth?.XOF || 0,
          revenueUSD: analyticsData.data?.revenueStats?.thisMonth?.USD || 0,
          mrrXOF: analyticsData.data?.revenueStats?.mrr?.XOF || 0,
          topExperts: analyticsData.data?.topExperts?.length || 0,
          topCompanies: analyticsData.data?.topCompanies?.length || 0,
          recentActivity: analyticsData.data?.recentActivity?.length || 0
        },
        warnings: [] as string[],
        errors: [] as string[]
      };

      // Vérifications
      if (analysis.data.users === 0) {
        analysis.warnings.push('Aucun utilisateur dans la base de données');
      }
      if (analysis.data.experts === 0) {
        analysis.warnings.push('Aucun expert dans la base de données');
      }
      if (analysis.data.companies === 0) {
        analysis.warnings.push('Aucune entreprise dans la base de données');
      }
      if (analysis.data.consultations === 0) {
        analysis.warnings.push('Aucune consultation dans la base de données');
      }
      if (analysis.data.revenueXOF === 0 && analysis.data.revenueUSD === 0) {
        analysis.warnings.push('Aucun revenu enregistré ce mois');
      }

      // Déterminer le statut global
      let globalStatus: 'success' | 'warning' | 'error';
      if (analysis.errors.length > 0) {
        globalStatus = 'error';
      } else if (analysis.warnings.length > 0) {
        globalStatus = 'warning';
      } else {
        globalStatus = 'success';
      }

      setDiagnosticResults({
        ...analysis,
        globalStatus,
        timestamp: new Date().toISOString()
      });

      console.log('✅ Diagnostic terminé:', analysis);

    } catch (err: any) {
      console.error('❌ Erreur diagnostic:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 mb-6 border border-[#D4C5B9]">
          <h1 className="text-3xl font-serif text-[#1A1A1A] mb-2">
            Diagnostic des Données Admin
          </h1>
          <p className="text-[#1A1A1A]/60 mb-6">
            Vérifiez que votre dashboard admin reçoit bien les vraies données depuis Supabase
          </p>

          <button
            onClick={runDiagnostic}
            disabled={isLoading}
            className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white rounded-full font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Diagnostic en cours...' : 'Lancer le diagnostic'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-medium text-red-900 mb-1">Erreur</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {diagnosticResults && (
          <>
            {/* Status global */}
            <div className={`rounded-3xl p-6 mb-6 border ${
              diagnosticResults.globalStatus === 'success'
                ? 'bg-green-50 border-green-200'
                : diagnosticResults.globalStatus === 'warning'
                ? 'bg-orange-50 border-orange-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(diagnosticResults.globalStatus)}
                <h2 className="text-xl font-serif text-[#1A1A1A]">
                  {diagnosticResults.globalStatus === 'success'
                    ? '✅ Tout fonctionne correctement !'
                    : diagnosticResults.globalStatus === 'warning'
                    ? '⚠️ Attention : Base de données vide'
                    : '❌ Erreurs détectées'}
                </h2>
              </div>

              {diagnosticResults.globalStatus === 'success' && (
                <p className="text-[#1A1A1A]/70">
                  Votre dashboard admin récupère bien les vraies données depuis Supabase.
                </p>
              )}

              {diagnosticResults.globalStatus === 'warning' && (
                <div className="space-y-2">
                  <p className="text-[#1A1A1A]/70">
                    Le système fonctionne mais certaines données sont manquantes :
                  </p>
                  <ul className="list-disc list-inside text-[#1A1A1A]/60 space-y-1">
                    {diagnosticResults.warnings.map((warning: string, i: number) => (
                      <li key={i}>{warning}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-[#1A1A1A]/50 mt-4">
                    💡 Astuce : Exécutez le fichier /supabase/migrations/TEST_DATA.sql dans votre dashboard Supabase pour insérer des données de test.
                  </p>
                </div>
              )}
            </div>

            {/* Détails des données */}
            <div className="bg-white rounded-3xl p-6 mb-6 border border-[#D4C5B9]">
              <h3 className="text-xl font-serif text-[#1A1A1A] mb-4">Données récupérées</h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#F5F1ED] rounded-xl">
                  <p className="text-sm text-[#1A1A1A]/60 mb-1">Utilisateurs</p>
                  <p className="text-2xl font-light text-[#1A1A1A]">
                    {diagnosticResults.data.users.toLocaleString()}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F1ED] rounded-xl">
                  <p className="text-sm text-[#1A1A1A]/60 mb-1">Experts</p>
                  <p className="text-2xl font-light text-[#1A1A1A]">
                    {diagnosticResults.data.experts}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F1ED] rounded-xl">
                  <p className="text-sm text-[#1A1A1A]/60 mb-1">Entreprises</p>
                  <p className="text-2xl font-light text-[#1A1A1A]">
                    {diagnosticResults.data.companies}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F1ED] rounded-xl">
                  <p className="text-sm text-[#1A1A1A]/60 mb-1">Consultations</p>
                  <p className="text-2xl font-light text-[#1A1A1A]">
                    {diagnosticResults.data.consultations}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F1ED] rounded-xl">
                  <p className="text-sm text-[#1A1A1A]/60 mb-1">Revenus ce mois (XOF)</p>
                  <p className="text-2xl font-light text-[#1A1A1A]">
                    {diagnosticResults.data.revenueXOF.toLocaleString()}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F1ED] rounded-xl">
                  <p className="text-sm text-[#1A1A1A]/60 mb-1">MRR (XOF)</p>
                  <p className="text-2xl font-light text-[#1A1A1A]">
                    {diagnosticResults.data.mrrXOF.toLocaleString()}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F1ED] rounded-xl">
                  <p className="text-sm text-[#1A1A1A]/60 mb-1">Top Experts</p>
                  <p className="text-2xl font-light text-[#1A1A1A]">
                    {diagnosticResults.data.topExperts}
                  </p>
                </div>

                <div className="p-4 bg-[#F5F1ED] rounded-xl">
                  <p className="text-sm text-[#1A1A1A]/60 mb-1">Top Entreprises</p>
                  <p className="text-2xl font-light text-[#1A1A1A]">
                    {diagnosticResults.data.topCompanies}
                  </p>
                </div>
              </div>
            </div>

            {/* Statut des services */}
            <div className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
              <h3 className="text-xl font-serif text-[#1A1A1A] mb-4">Statut des services</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#F5F1ED] rounded-xl">
                  <span className="text-[#1A1A1A]/70">API Supabase</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(diagnosticResults.api.status)}
                    <span className="text-sm font-medium text-[#1A1A1A]">
                      {diagnosticResults.api.message}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#F5F1ED] rounded-xl">
                  <span className="text-[#1A1A1A]/70">Analytics Admin</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(diagnosticResults.analytics.status)}
                    <span className="text-sm font-medium text-[#1A1A1A]">
                      {diagnosticResults.analytics.message}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#1A1A1A]/40 mt-4">
                Diagnostic effectué le {new Date(diagnosticResults.timestamp).toLocaleString('fr-FR')}
              </p>
            </div>
          </>
        )}

        {/* Instructions */}
        {!diagnosticResults && !isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Instructions</h3>
            <ol className="list-decimal list-inside text-blue-700 space-y-2">
              <li>Cliquez sur "Lancer le diagnostic" pour vérifier la connexion aux données</li>
              <li>Le système va tester l'API et récupérer les analytics</li>
              <li>Vous verrez le nombre d'enregistrements dans chaque table</li>
              <li>Si des données sont manquantes, exécutez TEST_DATA.sql dans Supabase</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
