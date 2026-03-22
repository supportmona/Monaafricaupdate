import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useB2BAuth } from "@/app/contexts/B2BAuthContext";
import {
  ArrowLeft,
  Building2,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Bell,
  CreditCard,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Key,
  Lock,
  UserPlus,
  Trash2
} from "lucide-react";

export default function CompanySettingsPage() {
  const { user } = useB2BAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Company info
  const [companyInfo, setCompanyInfo] = useState({
    name: user?.companyName || "",
    industry: "",
    size: user?.employeeCount?.toString() || "",
    website: "",
    address: "",
    city: "",
    country: "Côte d'Ivoire",
    phone: "",
    email: user?.email || "",
  });

  // HR Contacts
  const [hrContacts, setHrContacts] = useState([
    {
      id: "1",
      name: "Responsable RH principal",
      email: "",
      phone: "",
      role: "Administrateur"
    }
  ]);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    newEmployee: true,
    consultationBooked: true,
    monthlyReport: true,
    alertAtRisk: true,
    productUpdates: false,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    anonymizeData: true,
    shareDepartmentStats: true,
    allowResearch: false,
  });

  const handleSave = async () => {
    setSaving(true);
    
    // Simuler une sauvegarde
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  };

  const addHRContact = () => {
    setHrContacts([
      ...hrContacts,
      {
        id: Date.now().toString(),
        name: "",
        email: "",
        phone: "",
        role: "Gestionnaire"
      }
    ]);
  };

  const removeHRContact = (id: string) => {
    if (hrContacts.length > 1) {
      setHrContacts(hrContacts.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#1A1A1A] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link
                to="/company/dashboard"
                className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
              </Link>
              <div>
                <h1 className="text-2xl font-serif italic text-[#1A1A1A]">
                  Paramètres
                </h1>
                <p className="text-sm text-[#1A1A1A]/60">
                  Configuration de votre compte entreprise
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving || saved}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-all font-medium disabled:opacity-50 shadow-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Enregistré
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Informations entreprise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border-2 border-[#D4C5B9]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#A68B6F]/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#A68B6F]" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-[#1A1A1A]">
                Informations de l'entreprise
              </h2>
              <p className="text-sm text-[#1A1A1A]/60">
                Détails généraux de votre organisation
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Nom de l'entreprise *
              </label>
              <input
                type="text"
                value={companyInfo.name}
                onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                className="w-full px-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Secteur d'activité
              </label>
              <select
                value={companyInfo.industry}
                onChange={(e) => setCompanyInfo({...companyInfo, industry: e.target.value})}
                className="w-full px-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all cursor-pointer"
              >
                <option value="">Sélectionner...</option>
                <option value="tech">Technologie</option>
                <option value="finance">Finance & Banque</option>
                <option value="health">Santé</option>
                <option value="education">Éducation</option>
                <option value="retail">Commerce</option>
                <option value="manufacturing">Industrie</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Taille de l'entreprise
              </label>
              <input
                type="number"
                value={companyInfo.size}
                onChange={(e) => setCompanyInfo({...companyInfo, size: e.target.value})}
                className="w-full px-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                placeholder="Nombre d'employés"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Site web
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                <input
                  type="url"
                  value={companyInfo.website}
                  onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Email principal
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                <input
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                <input
                  type="tel"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Adresse
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-[#1A1A1A]/40" />
                <input
                  type="text"
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                  placeholder="Rue, quartier..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Ville
              </label>
              <input
                type="text"
                value={companyInfo.city}
                onChange={(e) => setCompanyInfo({...companyInfo, city: e.target.value})}
                className="w-full px-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Pays
              </label>
              <select
                value={companyInfo.country}
                onChange={(e) => setCompanyInfo({...companyInfo, country: e.target.value})}
                className="w-full px-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all cursor-pointer"
              >
                <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                <option value="Sénégal">Sénégal</option>
                <option value="RD Congo">RD Congo</option>
                <option value="Cameroun">Cameroun</option>
                <option value="Bénin">Bénin</option>
                <option value="Togo">Togo</option>
                <option value="Mali">Mali</option>
                <option value="Burkina Faso">Burkina Faso</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Contacts RH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-8 border-2 border-[#D4C5B9]"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#A68B6F]/10 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-[#A68B6F]" />
              </div>
              <div>
                <h2 className="text-xl font-serif text-[#1A1A1A]">
                  Contacts RH
                </h2>
                <p className="text-sm text-[#1A1A1A]/60">
                  Personnes de contact pour la gestion du programme
                </p>
              </div>
            </div>
            
            <button
              onClick={addHRContact}
              className="flex items-center gap-2 px-4 py-2 border-2 border-[#A68B6F] text-[#A68B6F] rounded-full hover:bg-[#A68B6F] hover:text-white transition-all font-medium"
            >
              <UserPlus className="w-4 h-4" />
              Ajouter
            </button>
          </div>

          <div className="space-y-4">
            {hrContacts.map((contact, index) => (
              <div key={contact.id} className="grid sm:grid-cols-4 gap-4 p-4 bg-[#F5F1ED] rounded-2xl">
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => {
                    const newContacts = [...hrContacts];
                    newContacts[index].name = e.target.value;
                    setHrContacts(newContacts);
                  }}
                  placeholder="Nom complet"
                  className="px-4 py-2 bg-white rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                />
                
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => {
                    const newContacts = [...hrContacts];
                    newContacts[index].email = e.target.value;
                    setHrContacts(newContacts);
                  }}
                  placeholder="Email"
                  className="px-4 py-2 bg-white rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                />
                
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => {
                    const newContacts = [...hrContacts];
                    newContacts[index].phone = e.target.value;
                    setHrContacts(newContacts);
                  }}
                  placeholder="Téléphone"
                  className="px-4 py-2 bg-white rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                />

                <div className="flex items-center gap-2">
                  <select
                    value={contact.role}
                    onChange={(e) => {
                      const newContacts = [...hrContacts];
                      newContacts[index].role = e.target.value;
                      setHrContacts(newContacts);
                    }}
                    className="flex-1 px-4 py-2 bg-white rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all cursor-pointer"
                  >
                    <option value="Administrateur">Administrateur</option>
                    <option value="Gestionnaire">Gestionnaire</option>
                    <option value="Lecture seule">Lecture seule</option>
                  </select>
                  
                  {hrContacts.length > 1 && (
                    <button
                      onClick={() => removeHRContact(contact.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 border-2 border-[#D4C5B9]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#A68B6F]/10 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-[#A68B6F]" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-[#1A1A1A]">
                Notifications
              </h2>
              <p className="text-sm text-[#1A1A1A]/60">
                Gérer vos préférences de notifications
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries({
              newEmployee: "Nouvel employé inscrit",
              consultationBooked: "Nouvelle consultation réservée",
              monthlyReport: "Rapport mensuel automatique",
              alertAtRisk: "Alerte employé à risque",
              productUpdates: "Mises à jour produit M.O.N.A",
            }).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-2xl cursor-pointer hover:bg-[#D4C5B9]/30 transition-colors"
              >
                <span className="text-sm text-[#1A1A1A]">{label}</span>
                <input
                  type="checkbox"
                  checked={notifications[key as keyof typeof notifications]}
                  onChange={(e) => setNotifications({
                    ...notifications,
                    [key]: e.target.checked
                  })}
                  className="w-5 h-5 rounded border-2 border-[#A68B6F] text-[#A68B6F] focus:ring-2 focus:ring-[#A68B6F]/20 cursor-pointer"
                />
              </label>
            ))}
          </div>
        </motion.div>

        {/* Confidentialité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-8 border-2 border-[#D4C5B9]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#A68B6F]/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#A68B6F]" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-[#1A1A1A]">
                Confidentialité & RGPD
              </h2>
              <p className="text-sm text-[#1A1A1A]/60">
                Paramètres de confidentialité des données
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 bg-[#F5F1ED] rounded-2xl cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.anonymizeData}
                onChange={(e) => setPrivacy({...privacy, anonymizeData: e.target.checked})}
                className="mt-0.5 w-5 h-5 rounded border-2 border-[#A68B6F] text-[#A68B6F] focus:ring-2 focus:ring-[#A68B6F]/20 cursor-pointer"
              />
              <div>
                <p className="text-sm font-medium text-[#1A1A1A] mb-1">
                  Anonymiser les données employés
                </p>
                <p className="text-xs text-[#1A1A1A]/60">
                  Les rapports n'afficheront que des données agrégées sans identité
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 bg-[#F5F1ED] rounded-2xl cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.shareDepartmentStats}
                onChange={(e) => setPrivacy({...privacy, shareDepartmentStats: e.target.checked})}
                className="mt-0.5 w-5 h-5 rounded border-2 border-[#A68B6F] text-[#A68B6F] focus:ring-2 focus:ring-[#A68B6F]/20 cursor-pointer"
              />
              <div>
                <p className="text-sm font-medium text-[#1A1A1A] mb-1">
                  Partager les statistiques par département
                </p>
                <p className="text-xs text-[#1A1A1A]/60">
                  Permet de visualiser les tendances par département
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 bg-[#F5F1ED] rounded-2xl cursor-pointer">
              <input
                type="checkbox"
                checked={privacy.allowResearch}
                onChange={(e) => setPrivacy({...privacy, allowResearch: e.target.checked})}
                className="mt-0.5 w-5 h-5 rounded border-2 border-[#A68B6F] text-[#A68B6F] focus:ring-2 focus:ring-[#A68B6F]/20 cursor-pointer"
              />
              <div>
                <p className="text-sm font-medium text-[#1A1A1A] mb-1">
                  Contribuer à la recherche M.O.N.A
                </p>
                <p className="text-xs text-[#1A1A1A]/60">
                  Données anonymisées utilisées pour améliorer nos services
                </p>
              </div>
            </label>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <p className="text-sm text-blue-900">
              <Lock className="w-4 h-4 inline mr-2" />
              Toutes vos données sont chiffrées end-to-end et conformes au RGPD
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
