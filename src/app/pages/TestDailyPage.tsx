import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, XCircle, Loader2, PlayCircle } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function TestDailyPage() {
  const [isTestingAppointment, setIsTestingAppointment] = useState(false);
  const [isTestingRoom, setIsTestingRoom] = useState(false);
  const [isTestingConfig, setIsTestingConfig] = useState(false);
  const [appointmentResult, setAppointmentResult] = useState<any>(null);
  const [roomResult, setRoomResult] = useState<any>(null);
  const [configResult, setConfigResult] = useState<any>(null);

  const checkDailyConfig = async () => {
    try {
      setIsTestingConfig(true);
      setConfigResult(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/consultations/check-daily-config`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      setConfigResult({
        success: response.ok,
        status: response.status,
        data: data,
      });
    } catch (error: any) {
      setConfigResult({
        success: false,
        error: error.message,
      });
    } finally {
      setIsTestingConfig(false);
    }
  };

  const createTestAppointment = async () => {
    try {
      setIsTestingAppointment(true);
      setAppointmentResult(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/consultations/create-test-appointment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      const data = await response.json();

      setAppointmentResult({
        success: response.ok,
        status: response.status,
        data: data,
      });
    } catch (error: any) {
      setAppointmentResult({
        success: false,
        error: error.message,
      });
    } finally {
      setIsTestingAppointment(false);
    }
  };

  const testJoinRoom = async () => {
    try {
      setIsTestingRoom(true);
      setRoomResult(null);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/consultations/join-room`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            appointmentId: "1",
            userName: "Test User",
            userId: "expert_1",
            isExpert: true,
          }),
        }
      );

      const data = await response.json();

      setRoomResult({
        success: response.ok,
        status: response.status,
        data: data,
      });
    } catch (error: any) {
      setRoomResult({
        success: false,
        error: error.message,
      });
    } finally {
      setIsTestingRoom(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-[#D4C5B9] mb-6"
        >
          <h1 className="text-4xl font-serif italic text-[#1A1A1A] mb-2">
            Test Daily.co Integration
          </h1>
          <p className="text-[#1A1A1A]/60">
            Diagnostic de l'intégration vidéo M.O.N.A
          </p>
        </motion.div>

        {/* Test 1: Create Appointment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 border border-[#D4C5B9] mb-6"
        >
          <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
            1. Créer un rendez-vous de test
          </h2>
          <p className="text-sm text-[#1A1A1A]/60 mb-6">
            Crée un rendez-vous dans la base de données avec ID = 1
          </p>

          <button
            onClick={createTestAppointment}
            disabled={isTestingAppointment}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#1A1A1A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isTestingAppointment ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Test en cours...</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                <span>Lancer le test</span>
              </>
            )}
          </button>

          {appointmentResult && (
            <div
              className={`p-4 rounded-2xl ${
                appointmentResult.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {appointmentResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      appointmentResult.success ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {appointmentResult.success ? "Succès" : "Erreur"}
                  </p>
                  <p
                    className={`text-xs ${
                      appointmentResult.success ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Status: {appointmentResult.status || "N/A"}
                  </p>
                </div>
              </div>
              <pre className="text-xs bg-white/50 p-3 rounded-lg overflow-x-auto">
                {JSON.stringify(appointmentResult.data, null, 2)}
              </pre>
            </div>
          )}
        </motion.div>

        {/* Test 2: Join Room */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 border border-[#D4C5B9]"
        >
          <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
            2. Rejoindre la room vidéo
          </h2>
          <p className="text-sm text-[#1A1A1A]/60 mb-6">
            Teste la création de room Daily.co et la génération de token
          </p>

          <button
            onClick={testJoinRoom}
            disabled={isTestingRoom}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#1A1A1A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isTestingRoom ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Test en cours...</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                <span>Lancer le test</span>
              </>
            )}
          </button>

          {roomResult && (
            <div
              className={`p-4 rounded-2xl ${
                roomResult.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {roomResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      roomResult.success ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {roomResult.success ? "Succès" : "Erreur"}
                  </p>
                  <p
                    className={`text-xs ${
                      roomResult.success ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Status: {roomResult.status || "N/A"}
                  </p>
                </div>
              </div>
              <pre className="text-xs bg-white/50 p-3 rounded-lg overflow-x-auto">
                {JSON.stringify(roomResult.data, null, 2)}
              </pre>
            </div>
          )}
        </motion.div>

        {/* Test 3: Check Daily Config */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 border border-[#D4C5B9] mb-6"
        >
          <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
            3. Vérifier la configuration Daily.co
          </h2>
          <p className="text-sm text-[#1A1A1A]/60 mb-6">
            Vérifie que la configuration Daily.co est correctement configurée et teste la connexion réelle à l'API
          </p>

          <button
            onClick={checkDailyConfig}
            disabled={isTestingConfig}
            className="flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#1A1A1A]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {isTestingConfig ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Test en cours...</span>
              </>
            ) : (
              <>
                <PlayCircle className="w-5 h-5" />
                <span>Lancer le test</span>
              </>
            )}
          </button>

          {configResult && (
            <div
              className={`p-4 rounded-2xl ${
                configResult.success && configResult.data?.connectionTest?.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                {configResult.success && configResult.data?.connectionTest?.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      configResult.success && configResult.data?.connectionTest?.success ? "text-green-900" : "text-red-900"
                    }`}
                  >
                    {configResult.success && configResult.data?.connectionTest?.success 
                      ? "✅ Configuration valide et connexion réussie" 
                      : "❌ Problème de configuration"}
                  </p>
                  <p
                    className={`text-xs ${
                      configResult.success && configResult.data?.connectionTest?.success ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Status: {configResult.status || "N/A"}
                  </p>
                  {configResult.data?.connectionTest?.message && (
                    <p className={`text-xs mt-1 ${
                      configResult.success && configResult.data?.connectionTest?.success ? "text-green-700" : "text-red-700"
                    }`}>
                      {configResult.data.connectionTest.message}
                    </p>
                  )}
                </div>
              </div>
              <pre className="text-xs bg-white/50 p-3 rounded-lg overflow-x-auto">
                {JSON.stringify(configResult.data, null, 2)}
              </pre>
            </div>
          )}
        </motion.div>

        {/* Info box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6"
        >
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Instructions de diagnostic
          </h3>
          <ol className="text-xs text-blue-800 space-y-2 list-decimal list-inside">
            <li>Lancez d'abord le test 1 pour créer un rendez-vous</li>
            <li>Si succès, lancez le test 2 pour tester Daily.co</li>
            <li>
              Si le test 2 échoue avec "authentication-error", vérifiez que
              votre clé API Daily.co est correctement configurée dans les
              secrets Supabase
            </li>
            <li>
              Consultez les logs du serveur dans Supabase pour plus de détails
            </li>
          </ol>
        </motion.div>
      </div>
    </div>
  );
}