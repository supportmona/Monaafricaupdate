import { ExternalLink, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Link } from "react-router";

export default function ResendConfigGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-beige/5 to-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-terracotta/20 to-gold/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-terracotta" />
          </div>
          <h1 className="text-4xl font-serif text-anthracite mb-3">
            Guide de Configuration Resend
          </h1>
          <p className="text-lg text-anthracite/60 font-sans">
            Configuration complète pour envoyer des emails depuis monafrica.net
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-8 p-6 bg-gradient-to-r from-gold/10 to-gold/5 rounded-2xl border-2 border-gold/30">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-anthracite mb-2">
                ⚠️ Important à savoir
              </h3>
              <ul className="space-y-2 text-sm text-anthracite/70 font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>
                    <strong>IONOS n'a pas besoin de clé API</strong> - IONOS est
                    seulement votre hébergeur DNS
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>
                    <strong>RESEND a besoin d'une clé API</strong> - C'est le
                    service qui envoie les emails
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  <span>
                    Les changements DNS peuvent prendre{" "}
                    <strong>24-48 heures</strong> pour se propager
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Step 1: Resend Account */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg border border-beige/30 overflow-hidden">
          <div className="bg-gradient-to-r from-terracotta to-gold p-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                1
              </span>
              Créer un compte Resend
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-anthracite/80 mb-3">
                  Allez sur{" "}
                  <a
                    href="https://resend.com/signup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terracotta hover:underline font-medium inline-flex items-center gap-1"
                  >
                    resend.com/signup
                    <ExternalLink className="w-3 h-3" />
                  </a>{" "}
                  et créez un compte gratuit
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-anthracite/80">
                  Le plan gratuit permet <strong>100 emails/jour</strong> et{" "}
                  <strong>3 000 emails/mois</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Add Domain */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg border border-beige/30 overflow-hidden">
          <div className="bg-gradient-to-r from-terracotta to-gold p-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                2
              </span>
              Ajouter le domaine monafrica.net
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-anthracite/80 mb-2">
                  Dans Resend, allez sur{" "}
                  <a
                    href="https://resend.com/domains"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terracotta hover:underline font-medium inline-flex items-center gap-1"
                  >
                    Domains
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-anthracite/80">
                  Cliquez sur <strong>"Add Domain"</strong> et entrez{" "}
                  <code className="px-2 py-1 bg-beige/20 rounded text-sm">
                    monafrica.net
                  </code>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-anthracite/80">
                  Resend va vous donner des enregistrements DNS à ajouter (notez-les
                  !)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Get API Key */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg border border-beige/30 overflow-hidden">
          <div className="bg-gradient-to-r from-terracotta to-gold p-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                3
              </span>
              Obtenir la clé API Resend
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-anthracite/80 mb-2">
                  Dans Resend, allez sur{" "}
                  <a
                    href="https://resend.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terracotta hover:underline font-medium inline-flex items-center gap-1"
                  >
                    API Keys
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-anthracite/80">
                  Cliquez sur <strong>"Create API Key"</strong>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-anthracite/80">
                  Donnez un nom (ex: "MONA Production") et sélectionnez{" "}
                  <strong>"Sending access"</strong>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-anthracite/80 mb-2">
                  <strong>Copiez immédiatement la clé</strong> (elle commence par{" "}
                  <code className="px-2 py-1 bg-beige/20 rounded text-sm">
                    re_...
                  </code>
                  )
                </p>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                  <p className="text-sm text-red-800 font-sans">
                    ⚠️ Vous ne pourrez plus voir cette clé après ! Sauvegardez-la
                    immédiatement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Add to Supabase */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg border border-beige/30 overflow-hidden">
          <div className="bg-gradient-to-r from-terracotta to-gold p-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                4
              </span>
              Configurer la clé dans Figma Make
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-anthracite/80">
                  La clé <code className="px-2 py-1 bg-beige/20 rounded text-sm">RESEND_API_KEY</code> est déjà dans votre liste de secrets Supabase
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-anthracite/80">
                  Vérifiez qu'elle contient bien votre clé Resend (re_...)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step 5: Configure DNS */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg border border-beige/30 overflow-hidden">
          <div className="bg-gradient-to-r from-terracotta to-gold p-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                5
              </span>
              Configurer les DNS dans IONOS
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900 font-sans">
                  <strong>Délai de propagation :</strong> 24-48 heures. Soyez
                  patient !
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-anthracite mb-3 text-lg">
                Enregistrements à ajouter :
              </h3>

              <div className="space-y-4">
                {/* SPF Record */}
                <div className="p-4 bg-beige/10 rounded-xl border border-beige/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-terracotta/20 text-terracotta text-xs font-bold rounded">
                      TXT
                    </span>
                    <span className="text-sm font-semibold text-anthracite">
                      Enregistrement SPF
                    </span>
                  </div>
                  <div className="space-y-2 text-sm font-sans">
                    <div className="flex gap-2">
                      <span className="text-anthracite/60 w-20">Nom:</span>
                      <code className="px-2 py-1 bg-white rounded flex-1">@</code>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-anthracite/60 w-20">Valeur:</span>
                      <code className="px-2 py-1 bg-white rounded flex-1 text-xs">
                        (Copiez depuis Resend Dashboard)
                      </code>
                    </div>
                  </div>
                </div>

                {/* DKIM Record */}
                <div className="p-4 bg-beige/10 rounded-xl border border-beige/30">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-terracotta/20 text-terracotta text-xs font-bold rounded">
                      CNAME
                    </span>
                    <span className="text-sm font-semibold text-anthracite">
                      Enregistrement DKIM
                    </span>
                  </div>
                  <div className="space-y-2 text-sm font-sans">
                    <div className="flex gap-2">
                      <span className="text-anthracite/60 w-20">Nom:</span>
                      <code className="px-2 py-1 bg-white rounded flex-1">
                        resend._domainkey
                      </code>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-anthracite/60 w-20">Valeur:</span>
                      <code className="px-2 py-1 bg-white rounded flex-1 text-xs">
                        (Copiez depuis Resend Dashboard)
                      </code>
                    </div>
                  </div>
                </div>

                {/* DMARC Record (optional but recommended) */}
                <div className="p-4 bg-beige/10 rounded-xl border border-beige/30 opacity-60">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-gold/20 text-gold text-xs font-bold rounded">
                      TXT
                    </span>
                    <span className="text-sm font-semibold text-anthracite">
                      Enregistrement DMARC (optionnel)
                    </span>
                  </div>
                  <div className="space-y-2 text-sm font-sans">
                    <div className="flex gap-2">
                      <span className="text-anthracite/60 w-20">Nom:</span>
                      <code className="px-2 py-1 bg-white rounded flex-1">
                        _dmarc
                      </code>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-anthracite/60 w-20">Valeur:</span>
                      <code className="px-2 py-1 bg-white rounded flex-1 text-xs">
                        (Copiez depuis Resend Dashboard si disponible)
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-gold/10 to-transparent rounded-xl border border-gold/20">
              <h4 className="font-semibold text-anthracite mb-2">
                📝 Comment ajouter dans IONOS :
              </h4>
              <ol className="space-y-2 text-sm text-anthracite/70 font-sans list-decimal list-inside">
                <li>Connectez-vous à votre compte IONOS</li>
                <li>
                  Allez dans <strong>Domaines & SSL</strong>
                </li>
                <li>
                  Sélectionnez <strong>monafrica.net</strong>
                </li>
                <li>
                  Cliquez sur <strong>DNS</strong> ou{" "}
                  <strong>Gérer les DNS</strong>
                </li>
                <li>
                  Ajoutez chaque enregistrement avec les valeurs exactes de Resend
                </li>
                <li>
                  Sauvegardez et attendez 24-48h pour la propagation
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Step 6: Verify & Test */}
        <div className="mb-6 bg-white rounded-2xl shadow-lg border border-beige/30 overflow-hidden">
          <div className="bg-gradient-to-r from-terracotta to-gold p-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">
                6
              </span>
              Vérifier et tester
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-anthracite/80">
                  Retournez sur Resend Dashboard et vérifiez que le domaine affiche{" "}
                  <strong className="text-green-600">✓ Verified</strong>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-sans text-anthracite/80 mb-3">
                  Testez l'envoi d'emails :
                </p>
                <Link
                  to="/test-email"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-terracotta to-gold text-white rounded-lg hover:shadow-lg hover:shadow-terracotta/20 transition-all font-medium"
                >
                  <Mail className="w-4 h-4" />
                  Tester l'envoi d'emails
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Email Addresses */}
        <div className="mb-12 bg-white rounded-2xl shadow-lg border border-beige/30 p-6">
          <h3 className="text-lg font-semibold text-anthracite mb-4">
            📧 Adresses email M.O.N.A configurées
          </h3>
          <div className="space-y-3 text-sm font-sans">
            <div className="flex items-center gap-3 p-3 bg-beige/10 rounded-lg">
              <div className="w-2 h-2 bg-terracotta rounded-full"></div>
              <div className="flex-1">
                <code className="font-semibold">noreply@monafrica.net</code>
                <p className="text-anthracite/60 text-xs mt-1">
                  Emails automatiques (bienvenue, notifications)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-beige/10 rounded-lg">
              <div className="w-2 h-2 bg-terracotta rounded-full"></div>
              <div className="flex-1">
                <code className="font-semibold">contact@monafrica.net</code>
                <p className="text-anthracite/60 text-xs mt-1">
                  Messages non-techniques (partenariats, commercial)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-beige/10 rounded-lg">
              <div className="w-2 h-2 bg-terracotta rounded-full"></div>
              <div className="flex-1">
                <code className="font-semibold">support@monafrica.net</code>
                <p className="text-anthracite/60 text-xs mt-1">
                  Support technique (bugs, assistance)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-anthracite/60 hover:text-terracotta transition-colors font-sans"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
