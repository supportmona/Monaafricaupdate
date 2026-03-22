import { motion } from "motion/react";
import { AlertCircle, Key, Video, CheckCircle, ExternalLink } from "lucide-react";

export default function DailySetupPage() {
  return (
    <div className="min-h-screen bg-[#F5F0EB] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-[#D4C5B9] mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-2xl flex items-center justify-center">
              <Video className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-serif italic text-[#1A1A1A] mb-1">
                Configuration Daily.co
              </h1>
              <p className="text-[#1A1A1A]/60">
                Guide de configuration de la téléconsultation
              </p>
            </div>
          </div>
        </motion.div>

        {/* Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-red-900 mb-2">
                Configuration Daily.co requise
              </h3>
              <p className="text-sm text-red-800 mb-4">
                Pour que les téléconsultations fonctionnent, vous devez configurer votre clé API Daily.co. 
                Si vous rencontrez une erreur "authentication-error", cela signifie que la clé API n'est pas 
                configurée ou n'est pas valide.
              </p>
              <div className="bg-red-100 rounded-lg p-3 text-xs text-red-800 font-mono">
                Erreur typique: "authentication-error" lors de la création de rooms vidéo
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 border border-[#D4C5B9] mb-6"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-serif text-[#1A1A1A] mb-3">
                Vérifier votre compte Daily.co
              </h2>
              <p className="text-[#1A1A1A]/70 mb-4">
                Vous devez avoir un compte Daily.co actif pour utiliser la
                téléconsultation.
              </p>
              <a
                href="https://dashboard.daily.co/login"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F5F0EB] hover:bg-[#D4C5B9] rounded-full transition-colors"
              >
                <span className="text-[#1A1A1A] font-medium">
                  Se connecter à Daily.co
                </span>
                <ExternalLink className="w-4 h-4 text-[#1A1A1A]" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Step 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 border border-[#D4C5B9] mb-6"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-serif text-[#1A1A1A] mb-3">
                Récupérer votre clé API
              </h2>
              <p className="text-[#1A1A1A]/70 mb-4">
                Accédez à votre tableau de bord Daily.co pour récupérer votre
                clé API.
              </p>

              <div className="bg-[#F5F0EB] rounded-2xl p-6 mb-4">
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-3 flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Instructions
                </h3>
                <ol className="space-y-2 text-sm text-[#1A1A1A]/70">
                  <li className="flex gap-2">
                    <span className="font-medium">1.</span>
                    <span>
                      Connectez-vous à{" "}
                      <a
                        href="https://dashboard.daily.co"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#A68B6F] hover:underline"
                      >
                        dashboard.daily.co
                      </a>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">2.</span>
                    <span>Allez dans "Developers" puis "API Keys"</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">3.</span>
                    <span>
                      Créez une nouvelle clé API ou copiez votre clé existante
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium">4.</span>
                    <span>
                      La clé ressemble à ceci :{" "}
                      <code className="px-2 py-1 bg-white rounded text-xs font-mono">
                        a20193f70dd0d7158fc06d4954457e1c...
                      </code>
                    </span>
                  </li>
                </ol>
              </div>

              <a
                href="https://dashboard.daily.co/developers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white rounded-full transition-colors"
              >
                <Key className="w-4 h-4" />
                <span>Accéder aux clés API</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Step 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-8 border border-[#D4C5B9] mb-6"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 bg-[#1A1A1A] text-white rounded-full flex items-center justify-center font-medium flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-serif text-[#1A1A1A] mb-3">
                Configurer le domaine Daily.co
              </h2>
              <p className="text-[#1A1A1A]/70 mb-4">
                Votre domaine Daily.co est utilisé pour créer les URLs de
                consultation.
              </p>

              <div className="bg-[#F5F0EB] rounded-2xl p-6">
                <p className="text-sm text-[#1A1A1A]/70 mb-3">
                  Votre domaine actuel configuré :
                </p>
                <div className="bg-white rounded-lg p-4 font-mono text-sm">
                  migrmona.daily.co
                </div>
                <p className="text-xs text-[#1A1A1A]/60 mt-3">
                  Ce domaine est automatiquement créé avec votre compte
                  Daily.co. Si vous voulez utiliser un domaine personnalisé,
                  vous pouvez le configurer dans votre tableau de bord Daily.co.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step 4 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-green-50 border border-green-200 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-lg font-medium text-green-900 mb-2">
                Prochaines étapes
              </h3>
              <ol className="text-sm text-green-800 space-y-2 list-decimal list-inside">
                <li>
                  Assurez-vous que votre clé API Daily.co est correctement
                  configurée dans les secrets Supabase sous le nom{" "}
                  <code className="px-2 py-0.5 bg-green-100 rounded text-xs font-mono">
                    DAILY_API_KEY
                  </code>
                </li>
                <li>
                  Vérifiez que le domaine est configuré sous{" "}
                  <code className="px-2 py-0.5 bg-green-100 rounded text-xs font-mono">
                    DAILY_DOMAIN
                  </code>
                </li>
                <li>
                  Accédez à{" "}
                  <a
                    href="/test-daily"
                    className="text-green-700 hover:underline font-medium"
                  >
                    /test-daily
                  </a>{" "}
                  pour tester la configuration
                </li>
                <li>
                  Si le problème persiste, contactez le support Daily.co pour
                  vérifier que votre compte est actif et que votre clé API est
                  valide
                </li>
              </ol>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4 mt-6"
        >
          <a
            href="/test-daily"
            className="flex-1 px-6 py-4 bg-[#1A1A1A] hover:bg-[#1A1A1A]/90 text-white rounded-full text-center font-medium transition-colors"
          >
            Tester la configuration
          </a>
          <a
            href="https://docs.daily.co/reference/rest-api/your-domain"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-6 py-4 bg-[#F5F0EB] hover:bg-[#D4C5B9] text-[#1A1A1A] rounded-full text-center font-medium transition-colors inline-flex items-center justify-center gap-2"
          >
            Documentation Daily.co
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}