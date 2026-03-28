import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import ExpertLayout from "@/app/components/ExpertLayout";
import { useExpertAuth } from "@/app/contexts/ExpertAuthContext";
import {
  User, Mail, Phone, MapPin, Building, FileText,
  Bell, Lock, Globe, Save, Camera, Shield,
  CheckCircle, Eye, EyeOff, AlertCircle,
} from "lucide-react";

export default function ExpertSettingsPage() {
  const { user, profile } = useExpertAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "security">("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: profile?.firstName || user?.user_metadata?.firstName || "",
    lastName: profile?.lastName || user?.user_metadata?.lastName || "",
    email: user?.email || profile?.email || "",
    phone: profile?.phone || "",
    specialty: profile?.specialty || user?.user_metadata?.specialty || "",
    license: profile?.licenseNumber || "",
    address: profile?.address || "",
    city: profile?.city || "",
    country: profile?.country || "Côte d'Ivoire",
    bio: profile?.bio || "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAppointments: true,
    emailMessages: true,
    emailReminders: true,
    pushAppointments: true,
    pushMessages: true,
    smsReminders: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Lock },
  ];

  return (
    <ExpertLayout title="Paramètres">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-gradient-to-br from-[#A68B6F] to-[#8A7159] rounded-3xl p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-medium">
                  {formData.firstName[0]}{formData.lastName[0]}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-[#F5F1ED] transition-colors">
                  <Camera className="w-4 h-4 text-[#A68B6F]" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-serif mb-2">Dr. {formData.firstName} {formData.lastName}</h2>
                <p className="text-white/90 mb-4">{formData.specialty}</p>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Profil vérifié</span>
                  </div>
                  {formData.license && (
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-medium">N° {formData.license}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-2 border border-[#D4C5B9]">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-[#1A1A1A] text-white shadow-lg"
                      : "text-[#1A1A1A]/60 hover:bg-[#F5F1ED] hover:text-[#1A1A1A]"
                  }`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-8 border border-[#D4C5B9]">

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-serif text-[#1A1A1A] mb-6">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Prénom</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                      <input type="text" value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Nom</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                      <input type="text" value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                      <input type="email" value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Téléphone</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                      <input type="tel" value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+225 XX XX XX XX XX"
                        className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Informations professionnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Spécialité</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                      <input type="text" value={formData.specialty}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        placeholder="Ex: Psychiatre, Psychologue clinicien"
                        className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Numéro de licence</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                      <input type="text" value={formData.license}
                        onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-serif text-[#1A1A1A] mb-6">Localisation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Adresse</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 w-5 h-5 text-[#1A1A1A]/40" />
                      <input type="text" value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Ville</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                      <input type="text" value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Pays</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                      <select value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]">
                        <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                        <option value="Sénégal">Sénégal</option>
                        <option value="RDC">République Démocratique du Congo</option>
                        <option value="Cameroun">Cameroun</option>
                        <option value="Mali">Mali</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Bio professionnelle</label>
                <textarea value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  placeholder="Présentez votre parcours et votre approche thérapeutique..."
                  className="w-full px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F] resize-none" />
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-serif text-[#1A1A1A] mb-2">Notifications</h3>
                <p className="text-sm text-[#1A1A1A]/60 mb-6">Gérez vos préférences de notifications</p>
              </div>

              <div className="bg-[#F5F1ED] rounded-2xl p-6 space-y-4">
                <h4 className="text-lg font-serif text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#A68B6F]" /> Notifications par email
                </h4>
                {[
                  { key: "emailAppointments", label: "Nouveaux rendez-vous" },
                  { key: "emailMessages", label: "Nouveaux messages" },
                  { key: "emailReminders", label: "Rappels de consultations" },
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <span className="text-sm text-[#1A1A1A]">{setting.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox"
                        checked={notificationSettings[setting.key as keyof typeof notificationSettings] as boolean}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, [setting.key]: e.target.checked })}
                        className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#A68B6F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A68B6F]" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="bg-[#F5F1ED] rounded-2xl p-6 space-y-4">
                <h4 className="text-lg font-serif text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-[#A68B6F]" /> Notifications push
                </h4>
                {[
                  { key: "pushAppointments", label: "Nouveaux rendez-vous" },
                  { key: "pushMessages", label: "Nouveaux messages" },
                ].map((setting) => (
                  <div key={setting.key} className="flex items-center justify-between">
                    <span className="text-sm text-[#1A1A1A]">{setting.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox"
                        checked={notificationSettings[setting.key as keyof typeof notificationSettings] as boolean}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, [setting.key]: e.target.checked })}
                        className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#A68B6F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A68B6F]" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="bg-[#F5F1ED] rounded-2xl p-6 space-y-4">
                <h4 className="text-lg font-serif text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#A68B6F]" /> Notifications SMS
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#1A1A1A]">Rappels de consultations</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={notificationSettings.smsReminders}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, smsReminders: e.target.checked })}
                      className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#A68B6F]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A68B6F]" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-serif text-[#1A1A1A] mb-2">Sécurité et confidentialité</h3>
                <p className="text-sm text-[#1A1A1A]/60 mb-6">Protégez votre compte et vos données professionnelles</p>
              </div>

              <div className="bg-[#F5F1ED] rounded-2xl p-6 space-y-4">
                <h4 className="text-lg font-serif text-[#1A1A1A] mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#A68B6F]" /> Mot de passe
                </h4>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Mot de passe actuel</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                    <input type={showPassword ? "text" : "password"}
                      className="w-full pl-12 pr-12 py-3 bg-white border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                    <button onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[#F5F1ED] rounded transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5 text-[#1A1A1A]/40" /> : <Eye className="w-5 h-5 text-[#1A1A1A]/40" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                    <input type="password" className="w-full pl-12 pr-4 py-3 bg-white border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                    <input type="password" className="w-full pl-12 pr-4 py-3 bg-white border border-[#D4C5B9] rounded-xl text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                  </div>
                </div>
                <button className="w-full py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors">
                  Changer le mot de passe
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-blue-900 mb-2">Authentification à deux facteurs</h4>
                    <p className="text-sm text-blue-800 mb-4">Ajoutez une couche de sécurité supplémentaire à votre compte</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors">
                      Activer 2FA
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#F5F1ED] rounded-2xl p-6">
                <h4 className="text-lg font-serif text-[#1A1A1A] mb-4">Sessions actives</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">Windows · Chrome</p>
                      <p className="text-xs text-[#1A1A1A]/60">Abidjan, Côte d'Ivoire · Maintenant</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Actuelle</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save button */}
          <div className="mt-8 pt-6 border-t border-[#D4C5B9] flex items-center justify-between gap-3">
            {/* Lien vers la page disponibilités */}
            <button onClick={() => navigate("/expert/availability")}
              className="flex items-center gap-2 px-5 py-3 border border-[#D4C5B9] text-[#A68B6F] rounded-full hover:bg-[#F5F1ED] transition-colors text-sm">
              Gérer mes disponibilités →
            </button>
            <div className="flex gap-3">
              <button className="px-6 py-3 border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#F5F1ED] transition-colors">
                Annuler
              </button>
              <button onClick={handleSave} disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors disabled:opacity-50">
                {isSaving ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Enregistrement...</span></>
                ) : (
                  <><Save className="w-5 h-5" /><span>Enregistrer</span></>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </ExpertLayout>
  );
}
