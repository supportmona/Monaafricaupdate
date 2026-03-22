import { useState } from "react";
import { Mail, Send, CheckCircle, XCircle, Loader2, BookOpen } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { Link } from "react-router";

export default function TestEmailPage() {
  const [testEmail, setTestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    details?: any;
  } | null>(null);

  const testContactEmail = async () => {
    if (!testEmail || !testEmail.includes("@")) {
      alert("Veuillez entrer une adresse email valide");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      console.log("🧪 Test d'envoi email vers:", testEmail);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/contact/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            name: "Test M.O.N.A",
            email: testEmail,
            phone: "+243 81 234 5678",
            subject: "Test de configuration Resend",
            message: "Ceci est un email de test pour vérifier la configuration Resend avec IONOS.\n\nSi vous recevez cet email, la configuration fonctionne correctement !",
            category: "test",
          }),
        }
      );

      const data = await response.json();

      console.log("📥 Réponse serveur:", data);

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: "✅ Email envoyé avec succès ! Vérifiez votre boîte de réception.",
          details: data,
        });
      } else {
        setResult({
          success: false,
          message: `❌ Erreur: ${data.error || "Échec de l'envoi"}`,
          details: data,
        });
      }
    } catch (error: any) {
      console.error("❌ Erreur lors du test:", error);
      setResult({
        success: false,
        message: `❌ Erreur de connexion: ${error.message}`,
        details: { error: error.message },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-beige/5 to-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-beige/30 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-terracotta/20 to-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-terracotta" />
            </div>
            <h1 className="text-3xl font-serif text-anthracite mb-2">
              Test Configuration Email
            </h1>
            <p className="text-anthracite/60 font-sans">
              Vérifiez la connexion Resend + IONOS
            </p>
          </div>

          {/* Configuration Info */}
          <div className="mb-6 p-4 bg-beige/10 rounded-xl border border-beige/30">
            <h3 className="text-sm font-semibold text-anthracite mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-gold" />
              Configuration attendue
            </h3>
            <div className="space-y-2 text-sm text-anthracite/70 font-sans">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-terracotta rounded-full"></div>
                <span>De: noreply@monafrica.net</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-terracotta rounded-full"></div>
                <span>Vers: contact@monafrica.net (notification)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-terracotta rounded-full"></div>
                <span>Vers: {testEmail || "votre email"} (confirmation)</span>
              </div>
            </div>
          </div>

          {/* Test Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-anthracite/70 mb-2">
                Email de test (où recevoir la confirmation)
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="votre-email@exemple.com"
                className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/30 font-sans"
              />
              <p className="text-xs text-anthracite/50 mt-2 font-sans">
                Vous recevrez 1 email de confirmation à cette adresse
              </p>
            </div>

            <button
              onClick={testContactEmail}
              disabled={loading || !testEmail}
              className="w-full px-6 py-3 bg-gradient-to-br from-terracotta to-gold text-white rounded-lg hover:shadow-lg hover:shadow-terracotta/20 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Envoyer un email de test
                </>
              )}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div
              className={`p-4 rounded-xl border ${
                result.success
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-medium font-sans mb-2 ${
                      result.success ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {result.message}
                  </p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-anthracite/60 hover:text-anthracite">
                        Voir les détails techniques
                      </summary>
                      <pre className="mt-2 p-3 bg-white rounded border border-anthracite/10 text-xs overflow-auto max-h-48">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-gradient-to-r from-beige/10 to-transparent rounded-xl border border-beige/30">
            <h3 className="text-sm font-semibold text-anthracite mb-3">
              📋 Que vérifier ?
            </h3>
            <ul className="space-y-2 text-sm text-anthracite/70 font-sans">
              <li className="flex items-start gap-2">
                <span className="text-terracotta font-bold">1.</span>
                <span>
                  Vérifiez que RESEND_API_KEY est configuré dans Supabase
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terracotta font-bold">2.</span>
                <span>
                  Vérifiez les enregistrements DNS IONOS (SPF, DKIM, DMARC)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terracotta font-bold">3.</span>
                <span>
                  Vérifiez dans Resend Dashboard si le domaine est vérifié
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terracotta font-bold">4.</span>
                <span>Consultez les logs du serveur dans la console</span>
              </li>
            </ul>
          </div>

          {/* DNS Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-gold/5 to-transparent rounded-xl border border-gold/20">
            <h3 className="text-sm font-semibold text-anthracite mb-3">
              🔧 Enregistrements DNS requis dans IONOS
            </h3>
            <div className="space-y-3 text-xs font-mono">
              <div className="p-2 bg-white rounded border border-beige/30">
                <div className="text-anthracite/50 mb-1">Type: TXT</div>
                <div className="text-anthracite">
                  Nom: @ ou monafrica.net
                </div>
                <div className="text-anthracite break-all">
                  Valeur: (fournie par Resend)
                </div>
              </div>
              <div className="p-2 bg-white rounded border border-beige/30">
                <div className="text-anthracite/50 mb-1">Type: CNAME</div>
                <div className="text-anthracite">
                  Nom: resend._domainkey
                </div>
                <div className="text-anthracite break-all">
                  Valeur: (fournie par Resend)
                </div>
              </div>
            </div>
            
            <Link
              to="/help"
              className="mt-4 inline-flex items-center gap-2 text-sm text-terracotta hover:text-gold transition-colors font-sans"
            >
              <BookOpen className="w-4 h-4" />
              Voir le guide complet de configuration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}