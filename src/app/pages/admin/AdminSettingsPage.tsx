import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  Settings,
  User,
  Lock,
  Bell,
  Globe,
  DollarSign,
  Shield,
  Mail,
  Database,
  Zap,
  LayoutDashboard,
  Users,
  BarChart3,
  Save,
  LogOut,
  Key,
  Webhook,
} from "lucide-react";

export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "platform" | "integrations">("profile");

  // Profile settings
  const [adminName, setAdminName] = useState("Super Admin M.O.N.A");
  const [adminEmail, setAdminEmail] = useState("admin@monafrica.net");

  // Platform settings
  const [platformName, setPlatformName] = useState("M.O.N.A");
  const [supportEmail, setSupportEmail] = useState("support@monafrica.net");
  const [defaultCurrency, setDefaultCurrency] = useState<"XOF" | "USD">("XOF");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newUserAlerts, setNewUserAlerts] = useState(true);
  const [expertValidationAlerts, setExpertValidationAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);

  const handleSave = () => {
    // TODO: API call to save settings
    console.log("Saving settings...");
    alert("Paramètres sauvegardés avec succès");
  };

  const handleLogout = () => {
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="w-10 h-10 hover:bg-[#F5F1ED] rounded-full flex items-center justify-center transition-colors"
              >
                <LayoutDashboard className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <div>
                <h1 className="text-lg font-serif text-[#1A1A1A]">Paramètres</h1>
                <p className="text-xs text-[#1A1A1A]/60">Configuration plateforme</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 border border-[#D4C5B9] space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === "profile"
                    ? "bg-[#1A1A1A] text-white"
                    : "text-[#1A1A1A]/60 hover:bg-[#F5F1ED]"
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">Profil</span>
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === "security"
                    ? "bg-[#1A1A1A] text-white"
                    : "text-[#1A1A1A]/60 hover:bg-[#F5F1ED]"
                }`}
              >
                <Lock className="w-5 h-5" />
                <span className="text-sm font-medium">Sécurité</span>
              </button>

              <button
                onClick={() => setActiveTab("platform")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === "platform"
                    ? "bg-[#1A1A1A] text-white"
                    : "text-[#1A1A1A]/60 hover:bg-[#F5F1ED]"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Plateforme</span>
              </button>

              <button
                onClick={() => setActiveTab("integrations")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === "integrations"
                    ? "bg-[#1A1A1A] text-white"
                    : "text-[#1A1A1A]/60 hover:bg-[#F5F1ED]"
                }`}
              >
                <Webhook className="w-5 h-5" />
                <span className="text-sm font-medium">Intégrations</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
                  <h2 className="text-xl font-serif text-[#1A1A1A] mb-6">Profil Administrateur</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Nom complet</label>
                      <input
                        type="text"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="w-full px-4 py-3 border border-[#D4C5B9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email</label>
                      <input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-[#D4C5B9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]/50"
                      />
                    </div>

                    <div className="pt-4">
                      <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-[#A68B6F]" />
                            <span className="text-sm text-[#1A1A1A]">Notifications par email</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            className="w-5 h-5 rounded border-[#D4C5B9]"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-[#A68B6F]" />
                            <span className="text-sm text-[#1A1A1A]">Nouveaux utilisateurs</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={newUserAlerts}
                            onChange={(e) => setNewUserAlerts(e.target.checked)}
                            className="w-5 h-5 rounded border-[#D4C5B9]"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-[#A68B6F]" />
                            <span className="text-sm text-[#1A1A1A]">Validation experts</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={expertValidationAlerts}
                            onChange={(e) => setExpertValidationAlerts(e.target.checked)}
                            className="w-5 h-5 rounded border-[#D4C5B9]"
                          />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl cursor-pointer">
                          <div className="flex items-center gap-3">
                            <DollarSign className="w-5 h-5 text-[#A68B6F]" />
                            <span className="text-sm text-[#1A1A1A]">Paiements</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={paymentAlerts}
                            onChange={(e) => setPaymentAlerts(e.target.checked)}
                            className="w-5 h-5 rounded border-[#D4C5B9]"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-full font-medium hover:bg-[#2A2A2A] transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Sauvegarder les modifications
                </button>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
                  <h2 className="text-xl font-serif text-[#1A1A1A] mb-6">Sécurité & Accès</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Mot de passe actuel
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-[#D4C5B9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-[#D4C5B9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Confirmer nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-3 border border-[#D4C5B9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]/50"
                      />
                    </div>

                    <div className="pt-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                      <div className="flex items-start gap-3">
                        <Key className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 mb-1">
                            Authentification à deux facteurs
                          </p>
                          <p className="text-xs text-blue-700">
                            Ajoutez une couche de sécurité supplémentaire à votre compte
                          </p>
                          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-medium hover:bg-blue-700 transition-colors">
                            Activer 2FA
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-full font-medium hover:bg-[#2A2A2A] transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Mettre à jour le mot de passe
                </button>
              </motion.div>
            )}

            {/* Platform Tab */}
            {activeTab === "platform" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
                  <h2 className="text-xl font-serif text-[#1A1A1A] mb-6">Configuration Plateforme</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Nom de la plateforme
                      </label>
                      <input
                        type="text"
                        value={platformName}
                        onChange={(e) => setPlatformName(e.target.value)}
                        className="w-full px-4 py-3 border border-[#D4C5B9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Email de support
                      </label>
                      <input
                        type="email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-[#D4C5B9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Devise par défaut
                      </label>
                      <select
                        value={defaultCurrency}
                        onChange={(e) => setDefaultCurrency(e.target.value as "XOF" | "USD")}
                        className="w-full px-4 py-3 border border-[#D4C5B9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]/50"
                      >
                        <option value="XOF">XOF (Franc CFA)</option>
                        <option value="USD">USD (Dollar)</option>
                      </select>
                    </div>

                    <div className="pt-4">
                      <label className="flex items-center justify-between p-4 bg-orange-50 rounded-xl cursor-pointer border border-orange-200">
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="text-sm font-medium text-orange-900">Mode maintenance</p>
                            <p className="text-xs text-orange-700">Désactiver temporairement la plateforme</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={maintenanceMode}
                          onChange={(e) => setMaintenanceMode(e.target.checked)}
                          className="w-5 h-5 rounded border-orange-300"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full bg-[#1A1A1A] text-white py-3.5 rounded-full font-medium hover:bg-[#2A2A2A] transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Sauvegarder les paramètres
                </button>
              </motion.div>
            )}

            {/* Integrations Tab */}
            {activeTab === "integrations" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-3xl p-6 border border-[#D4C5B9]">
                  <h2 className="text-xl font-serif text-[#1A1A1A] mb-6">Intégrations & API</h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-[#F5F1ED] rounded-2xl border border-[#D4C5B9]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Database className="w-6 h-6 text-[#A68B6F]" />
                          <div>
                            <p className="font-medium text-[#1A1A1A]">Supabase</p>
                            <p className="text-xs text-[#1A1A1A]/60">Base de données et authentification</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          Connecté
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-[#F5F1ED] rounded-2xl border border-[#D4C5B9]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-6 h-6 text-[#A68B6F]" />
                          <div>
                            <p className="font-medium text-[#1A1A1A]">Resend</p>
                            <p className="text-xs text-[#1A1A1A]/60">Service d'envoi d'emails</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          Connecté
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-[#F5F1ED] rounded-2xl border border-[#D4C5B9]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Zap className="w-6 h-6 text-[#A68B6F]" />
                          <div>
                            <p className="font-medium text-[#1A1A1A]">Daily.co</p>
                            <p className="text-xs text-[#1A1A1A]/60">Vidéo consultations</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          Connecté
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <h3 className="text-sm font-medium text-[#1A1A1A] mb-3">Clés API</h3>
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Clé API publique</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 bg-white rounded-lg text-xs font-mono border border-gray-200">
                            pk_live_••••••••••••••••
                          </code>
                          <button className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-xs font-medium transition-colors">
                            Copier
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* Navigation Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] safe-area-inset-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs">Dashboard</span>
            </button>
            <button
              onClick={() => navigate("/admin/users")}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <Users className="w-5 h-5" />
              <span className="text-xs">Utilisateurs</span>
            </button>
            <button
              onClick={() => navigate("/admin/analytics")}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Analytics</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]">
              <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium">Paramètres</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="h-20"></div>
    </div>
  );
}
