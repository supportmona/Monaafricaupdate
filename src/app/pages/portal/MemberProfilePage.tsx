import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Camera,
  Heart,
  Activity,
  Shield,
  Bell,
  CreditCard,
  LogOut,
  ChevronRight,
  Award,
  Target,
  Sparkles,
  Loader2,
  FileText,
  BookOpen,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  Lock,
  Globe,
  Download,
  Eye,
  AlertTriangle,
  Trash2,
  Smartphone,
  Check,
  X
} from "lucide-react";

export default function MemberProfilePage() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useMemberAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [consultationsCount, setConsultationsCount] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [currency, setCurrency] = useState<"XOF" | "USD">("XOF");
  const [showStudentPlans, setShowStudentPlans] = useState(false);
  
  // États pour l'édition individuelle de chaque champ
  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingDateOfBirth, setEditingDateOfBirth] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [savingField, setSavingField] = useState<string | null>(null);
  
  // Form fields pour l'édition
  const [editedName, setEditedName] = useState("");
  const [editedPhone, setEditedPhone] = useState("");
  const [editedDateOfBirth, setEditedDateOfBirth] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [saving, setSaving] = useState(false);
  
  // Settings toggles
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  // Initialiser les champs d'édition quand le profil est chargé
  useEffect(() => {
    if (profile) {
      setEditedName(user?.name || profile?.name || "");
      setEditedPhone(profile?.phone || "");
      setEditedDateOfBirth(profile?.dateOfBirth || "");
      setEditedLocation(profile?.location || "");
    }
  }, [profile, user]);

  const loadProfileData = async () => {
    try {
      const token = localStorage.getItem("mona_member_token");
      if (!token) {
        setLoading(false);
        return;
      }

      console.log("🔑 Profile - Token:", token ? `${token.substring(0, 20)}...` : "AUCUN");
      console.log("🔑 Profile - publicAnonKey:", publicAnonKey ? `${publicAnonKey.substring(0, 20)}...` : "AUCUN");
      console.log("🌐 Profile - URL:", `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/profile`);

      // Charger le profil
      const profileResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/profile`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
          },
        }
      );

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData.data);
        
        // Mettre à jour le contexte d'authentification si le nom a changé
        if (profileData.data?.name && profileData.data.name !== user?.name && updateUser) {
          updateUser({ ...user, name: profileData.data.name });
        }
        
        // Charger les préférences de notifications si disponibles
        if (profileData.data?.preferences) {
          setEmailNotifications(profileData.data.preferences.emailNotifications ?? true);
          setSmsNotifications(profileData.data.preferences.smsNotifications ?? true);
          setPushNotifications(profileData.data.preferences.pushNotifications ?? true);
          setMarketingEmails(profileData.data.preferences.marketingEmails ?? false);
          setTwoFactorAuth(profileData.data.preferences.twoFactorAuth ?? false);
        }
      }

      // Charger les consultations pour les statistiques
      const consultationsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/consultations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (consultationsResponse.ok) {
        const consultationsData = await consultationsResponse.json();
        setConsultationsCount(consultationsData.data?.length || 0);
      }

      // Charger le wallet
      await loadWalletData(token);
    } catch (error) {
      console.error("Erreur chargement profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWalletData = async (token: string) => {
    try {
      // Charger le solde du wallet
      const balanceResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/wallet/balance`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        setWalletBalance(balanceData.data?.balance || 0);
      }

      // Charger les transactions du wallet
      const transactionsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/wallet/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        setWalletTransactions(transactionsData.data || []);
      }
    } catch (error) {
      console.error("Erreur chargement wallet:", error);
    }
  };

  const handleRecharge = async () => {
    const amount = parseFloat(rechargeAmount);
    if (!amount || amount <= 0) {
      alert("Veuillez entrer un montant valide");
      return;
    }

    try {
      const token = localStorage.getItem("mona_member_token");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/wallet/recharge`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
          },
          body: JSON.stringify({ amount }),
        }
      );

      if (response.ok) {
        await loadWalletData(token!);
        setShowRechargeModal(false);
        setRechargeAmount("");
        alert("Recharge effectuée avec succès");
      } else {
        throw new Error("Erreur lors de la recharge");
      }
    } catch (error) {
      console.error("Erreur recharge:", error);
      alert("Une erreur est survenue lors de la recharge");
    }
  };

  const handleSaveNotificationPreferences = async () => {
    try {
      const token = localStorage.getItem("mona_member_token");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/profile/preferences`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
          },
          body: JSON.stringify({
            emailNotifications,
            smsNotifications,
            pushNotifications,
            marketingEmails,
            twoFactorAuth,
          }),
        }
      );

      if (response.ok) {
        alert("Préférences enregistrées avec succès");
      }
    } catch (error) {
      console.error("Erreur sauvegarde préférences:", error);
    }
  };

  const handleSaveField = async (field: string, value: string) => {
    setSavingField(field);
    try {
      const token = localStorage.getItem("mona_member_token");
      
      if (!token) {
        alert("Votre session a expiré. Veuillez vous reconnecter.");
        navigate("/portal/login");
        return;
      }
      
      console.log(`🔑 Token présent: ${token.substring(0, 20)}...`);
      console.log(`🔍 Token structure:`, {
        length: token.length,
        isJWT: token.split('.').length === 3,
        parts: token.split('.').length
      });
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
          },
          body: JSON.stringify({
            [field]: value,
          }),
        }
      );

      console.log(`📤 Sauvegarde ${field}:`, value);
      console.log("📥 Statut réponse:", response.status, response.statusText);

      if (response.ok) {
        await loadProfileData();
        
        // Mettre à jour le contexte d'authentification si c'est le nom qui a changé
        if (field === "name" && updateUser) {
          updateUser({ ...user, name: value });
        }
        
        // Réinitialiser le mode édition du champ
        if (field === "name") setEditingName(false);
        if (field === "phone") setEditingPhone(false);
        if (field === "dateOfBirth") setEditingDateOfBirth(false);
        if (field === "location") setEditingLocation(false);
        alert("Modification enregistrée avec succès");
      } else {
        const errorData = await response.json();
        console.error("❌ Erreur serveur complète:", errorData);
        console.error("❌ Status:", response.status);
        console.error("❌ Erreur type:", typeof errorData.error);
        
        // Si c'est une erreur d'authentification, rediriger vers la page de login
        if (response.status === 401) {
          const errorMessage = errorData.error || errorData.message || errorData.details || "Votre session a expiré";
          alert(`${errorMessage}\n\nVeuillez vous reconnecter.`);
          localStorage.removeItem("mona_member_token");
          localStorage.removeItem("mona_member_user");
          navigate("/portal/login");
          return;
        }
        
        alert(`Erreur: ${errorData.error || errorData.message || "Erreur lors de la mise à jour"}`);
      }
    } catch (error) {
      console.error(`Erreur sauvegarde ${field}:`, error);
      alert("Erreur lors de la mise à jour");
    } finally {
      setSavingField(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#A68B6F] animate-spin" />
      </div>
    );
  }

  const displayName = user?.name || "Membre";
  const displayEmail = user?.email || profile?.email || "";
  const displayPlan = user?.plan || profile?.plan || "free";
  const memberSince = user?.memberSince || profile?.memberSince || "";

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-serif text-[#1A1A1A]">Mon Compte</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24">
        {/* Section Avatar et Info principale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-6 sm:p-8 text-white"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white text-3xl font-medium">
                {getInitials(displayName)}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4 text-[#1A1A1A]" />
                </button>
              )}
            </div>

            {/* Info principale */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-serif mb-2">
                {displayName}
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-white/70 mb-4">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{displayEmail}</span>
                </div>
                {memberSince && (
                  <>
                    <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30"></div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Membre depuis {memberSince}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Badge Cercle M.O.N.A */}
              {displayPlan === "cercle-mona" && (
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Award className="w-4 h-4 text-[#D4A574]" />
                  <span className="text-sm font-medium">Cercle M.O.N.A</span>
                  <Sparkles className="w-4 h-4 text-[#D4A574]" />
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-2xl font-light mb-1">{consultationsCount}</p>
              <p className="text-xs text-white/60">Consultations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light mb-1">0</p>
              <p className="text-xs text-white/60">Ressources</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light mb-1">0</p>
              <p className="text-xs text-white/60">Jours actifs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light mb-1">-</p>
              <p className="text-xs text-white/60">Score Mental</p>
            </div>
          </div>
        </motion.div>

        {/* Wallet Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#D4A574] to-[#A68B6F] rounded-3xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-white/80">Mon Wallet</p>
                <h3 className="text-3xl font-serif">{walletBalance.toLocaleString()} XOF</h3>
              </div>
            </div>
            <button
              onClick={() => setShowRechargeModal(true)}
              className="bg-white text-[#1A1A1A] rounded-full p-3 hover:bg-white/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Dernières transactions */}
          {walletTransactions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-white/80 mb-3">Dernières transactions</p>
              {walletTransactions.slice(0, 3).map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === "credit" ? "bg-green-500/20" : "bg-red-500/20"
                    }`}>
                      {transaction.type === "credit" ? (
                        <ArrowDownLeft className="w-4 h-4 text-green-300" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{transaction.description || "Transaction"}</p>
                      <p className="text-xs text-white/60">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`font-medium ${
                    transaction.type === "credit" ? "text-green-300" : "text-red-300"
                  }`}>
                    {transaction.type === "credit" ? "+" : "-"}{transaction.amount.toLocaleString()} XOF
                  </p>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Informations personnelles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-4 sm:p-6 border border-[#D4C5B9]"
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="w-10 h-10 bg-[#F5F1ED] rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <h3 className="text-lg sm:text-xl font-serif text-[#1A1A1A]">
              Informations personnelles
            </h3>
          </div>

          <div className="space-y-4">
            {/* Email - non éditable */}
            <div className="flex items-start justify-between py-3 border-b border-[#D4C5B9]">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-[#1A1A1A]/60 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-[#1A1A1A]/60 mb-1">Email</p>
                  <p className="text-sm sm:text-base text-[#1A1A1A] break-words">{displayEmail}</p>
                </div>
              </div>
            </div>

            {/* Nom - éditable */}
            <div className="flex items-start justify-between py-3 border-b border-[#D4C5B9]">
              {!editingName ? (
                <>
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <User className="w-4 sm:w-5 h-4 sm:h-5 text-[#1A1A1A]/60 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-[#1A1A1A]/60 mb-1">Nom complet</p>
                      <p className="text-sm sm:text-base text-[#1A1A1A] break-words">
                        {displayName}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingName(true)}
                    className="flex-shrink-0 ml-2 sm:ml-3 text-[#A68B6F] hover:text-[#8A7159] transition-colors"
                    disabled={savingField === "name"}
                  >
                    {savingField === "name" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Edit2 className="w-4 h-4" />
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 flex-1">
                    <User className="w-5 h-5 text-[#1A1A1A]/60 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-[#1A1A1A]/60 mb-2">Nom complet</p>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder="Votre nom complet"
                        className="w-full px-3 py-2 border border-[#D4C5B9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A68B6F] text-sm"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleSaveField("name", editedName)}
                      className="text-green-600 hover:text-green-700 transition-colors"
                      disabled={savingField === "name"}
                    >
                      {savingField === "name" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingName(false);
                        setEditedName(displayName);
                      }}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      disabled={savingField === "name"}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Téléphone - éditable */}
            <div className="flex items-start justify-between py-3 border-b border-[#D4C5B9]">
              {!editingPhone ? (
                <>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-[#1A1A1A]/60 mt-0.5" />
                    <div>
                      <p className="text-sm text-[#1A1A1A]/60 mb-1">Téléphone</p>
                      <p className="text-base text-[#1A1A1A]">
                        {profile?.phone || "Non renseigné"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingPhone(true)}
                    className="flex-shrink-0 ml-3 text-[#A68B6F] hover:text-[#8A7159] transition-colors"
                    disabled={savingField === "phone"}
                  >
                    {savingField === "phone" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Edit2 className="w-4 h-4" />
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 flex-1">
                    <Phone className="w-5 h-5 text-[#1A1A1A]/60 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-[#1A1A1A]/60 mb-2">Téléphone</p>
                      <input
                        type="tel"
                        value={editedPhone}
                        onChange={(e) => setEditedPhone(e.target.value)}
                        placeholder="+243 XXX XXX XXX"
                        className="w-full px-3 py-2 border border-[#D4C5B9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A68B6F] text-sm"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleSaveField("phone", editedPhone)}
                      className="text-green-600 hover:text-green-700 transition-colors"
                      disabled={savingField === "phone"}
                    >
                      {savingField === "phone" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingPhone(false);
                        setEditedPhone(profile?.phone || "");
                      }}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      disabled={savingField === "phone"}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-start justify-between py-3 border-b border-[#D4C5B9]">
              {!editingDateOfBirth ? (
                <>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[#1A1A1A]/60 mt-0.5" />
                    <div>
                      <p className="text-sm text-[#1A1A1A]/60 mb-1">
                        Date de naissance
                      </p>
                      <p className="text-base text-[#1A1A1A]">
                        {profile?.dateOfBirth || "Non renseignée"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingDateOfBirth(true)}
                    className="flex-shrink-0 ml-3 text-[#A68B6F] hover:text-[#8A7159] transition-colors"
                    disabled={savingField === "dateOfBirth"}
                  >
                    {savingField === "dateOfBirth" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Edit2 className="w-4 h-4" />
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 flex-1">
                    <Calendar className="w-5 h-5 text-[#1A1A1A]/60 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-[#1A1A1A]/60 mb-2">
                        Date de naissance
                      </p>
                      <input
                        type="date"
                        value={editedDateOfBirth}
                        onChange={(e) => setEditedDateOfBirth(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D4C5B9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A68B6F] text-sm"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleSaveField("dateOfBirth", editedDateOfBirth)}
                      className="text-green-600 hover:text-green-700 transition-colors"
                      disabled={savingField === "dateOfBirth"}
                    >
                      {savingField === "dateOfBirth" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingDateOfBirth(false);
                        setEditedDateOfBirth(profile?.dateOfBirth || "");
                      }}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      disabled={savingField === "dateOfBirth"}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-start justify-between py-3">
              {!editingLocation ? (
                <>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#1A1A1A]/60 mt-0.5" />
                    <div>
                      <p className="text-sm text-[#1A1A1A]/60 mb-1">Localisation</p>
                      <p className="text-base text-[#1A1A1A]">
                        {profile?.location || "Non renseignée"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingLocation(true)}
                    className="flex-shrink-0 ml-3 text-[#A68B6F] hover:text-[#8A7159] transition-colors"
                    disabled={savingField === "location"}
                  >
                    {savingField === "location" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Edit2 className="w-4 h-4" />
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3 flex-1">
                    <MapPin className="w-5 h-5 text-[#1A1A1A]/60 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-[#1A1A1A]/60 mb-2">Localisation</p>
                      <select
                        value={editedLocation}
                        onChange={(e) => setEditedLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D4C5B9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A68B6F] text-sm"
                        autoFocus
                      >
                        <option value="">Sélectionner une ville</option>
                        <option value="Kinshasa">Kinshasa</option>
                        <option value="Dakar">Dakar</option>
                        <option value="Abidjan">Abidjan</option>
                        <option value="Brazzaville">Brazzaville</option>
                        <option value="Libreville">Libreville</option>
                        <option value="Douala">Douala</option>
                        <option value="Yaoundé">Yaoundé</option>
                        <option value="Bamako">Bamako</option>
                        <option value="Niamey">Niamey</option>
                        <option value="Ouagadougou">Ouagadougou</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleSaveField("location", editedLocation)}
                      className="text-green-600 hover:text-green-700 transition-colors"
                      disabled={savingField === "location"}
                    >
                      {savingField === "location" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingLocation(false);
                        setEditedLocation(profile?.location || "");
                      }}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      disabled={savingField === "location"}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Notifications Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#F5F1ED] rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <h3 className="text-xl font-serif text-[#1A1A1A]">Notifications</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-[#D4C5B9]">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#1A1A1A]/60 mt-0.5" />
                <div>
                  <p className="text-sm text-[#1A1A1A] mb-1">Email</p>
                  <p className="text-xs text-[#1A1A1A]/60">Rappels de consultations et mises à jour</p>
                </div>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className="flex-shrink-0 ml-3"
              >
                <div className={`relative w-12 h-6 rounded-full transition-colors ${
                  emailNotifications ? "bg-[#A68B6F]" : "bg-[#D4C5B9]"
                }`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    emailNotifications ? "translate-x-6" : "translate-x-0.5"
                  }`}></div>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[#D4C5B9]">
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-[#1A1A1A]/60 mt-0.5" />
                <div>
                  <p className="text-sm text-[#1A1A1A] mb-1">SMS</p>
                  <p className="text-xs text-[#1A1A1A]/60">Notifications importantes par SMS</p>
                </div>
              </div>
              <button
                onClick={() => setSmsNotifications(!smsNotifications)}
                className="flex-shrink-0 ml-3"
              >
                <div className={`relative w-12 h-6 rounded-full transition-colors ${
                  smsNotifications ? "bg-[#A68B6F]" : "bg-[#D4C5B9]"
                }`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    smsNotifications ? "translate-x-6" : "translate-x-0.5"
                  }`}></div>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-[#D4C5B9]">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-[#1A1A1A]/60 mt-0.5" />
                <div>
                  <p className="text-sm text-[#1A1A1A] mb-1">Push</p>
                  <p className="text-xs text-[#1A1A1A]/60">Notifications dans l'application</p>
                </div>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className="flex-shrink-0 ml-3"
              >
                <div className={`relative w-12 h-6 rounded-full transition-colors ${
                  pushNotifications ? "bg-[#A68B6F]" : "bg-[#D4C5B9]"
                }`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    pushNotifications ? "translate-x-6" : "translate-x-0.5"
                  }`}></div>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#1A1A1A]/60 mt-0.5" />
                <div>
                  <p className="text-sm text-[#1A1A1A] mb-1">Marketing</p>
                  <p className="text-xs text-[#1A1A1A]/60">Offres et nouveautés M.O.N.A</p>
                </div>
              </div>
              <button
                onClick={() => setMarketingEmails(!marketingEmails)}
                className="flex-shrink-0 ml-3"
              >
                <div className={`relative w-12 h-6 rounded-full transition-colors ${
                  marketingEmails ? "bg-[#A68B6F]" : "bg-[#D4C5B9]"
                }`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    marketingEmails ? "translate-x-6" : "translate-x-0.5"
                  }`}></div>
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveNotificationPreferences}
            className="mt-4 w-full bg-[#1A1A1A] text-white rounded-full py-3 font-medium hover:bg-[#2A2A2A] transition-colors"
          >
            Enregistrer les préférences
          </button>
        </motion.div>

        {/* Sécurité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#F5F1ED] rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <h3 className="text-xl font-serif text-[#1A1A1A]">Sécurité</h3>
          </div>

          <div className="space-y-2">
            <button className="w-full flex items-center justify-between py-4 hover:bg-[#F5F1ED] rounded-xl px-4 transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-[#1A1A1A]" />
                <span className="text-sm text-[#1A1A1A]">Mot de passe</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#1A1A1A]/40" />
            </button>

            <div className="flex items-center justify-between py-4 px-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#1A1A1A]" />
                <div>
                  <p className="text-sm text-[#1A1A1A]">Authentification à deux facteurs</p>
                  <p className="text-xs text-[#1A1A1A]/60">Sécurité renforcée</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                className="flex-shrink-0 ml-3"
              >
                <div className={`relative w-12 h-6 rounded-full transition-colors ${
                  twoFactorAuth ? "bg-[#A68B6F]" : "bg-[#D4C5B9]"
                }`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    twoFactorAuth ? "translate-x-6" : "translate-x-0.5"
                  }`}></div>
                </div>
              </button>
            </div>

            <button className="w-full flex items-center justify-between py-4 hover:bg-[#F5F1ED] rounded-xl px-4 transition-colors">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-[#1A1A1A]" />
                <span className="text-sm text-[#1A1A1A]">Télécharger mes données</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#1A1A1A]/40" />
            </button>
          </div>
        </motion.div>

        {/* Abonnement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-6 border border-[#D4C5B9]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#F5F1ED] rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#1A1A1A]" />
            </div>
            <h3 className="text-xl font-serif text-[#1A1A1A]">Abonnement</h3>
          </div>

          {displayPlan === "cercle-mona" ? (
            <div className="space-y-2">
              <Link
                to="/member/cercle-info"
                className="w-full flex items-center justify-between py-4 hover:bg-[#F5F1ED] rounded-xl px-4 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-[#D4A574]" />
                  <div>
                    <p className="text-sm text-[#1A1A1A] font-medium">Cercle M.O.N.A</p>
                    <p className="text-xs text-[#1A1A1A]/60">Membre premium actif</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#1A1A1A]/40" />
              </Link>

              <button className="w-full flex items-center justify-between py-4 hover:bg-[#F5F1ED] rounded-xl px-4 transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#1A1A1A]" />
                  <span className="text-sm text-[#1A1A1A]">Facturation</span>
                </div>
                <ChevronRight className="w-5 h-5 text-[#1A1A1A]/40" />
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-gradient-to-br from-[#D4A574]/10 to-[#A68B6F]/10 rounded-2xl p-5 mb-4 border border-[#D4A574]/20">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#D4A574] rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-serif text-[#1A1A1A] mb-1">
                      Plan Gratuit
                    </h4>
                    <p className="text-sm text-[#1A1A1A]/70">
                      Accès aux fonctionnalités de base
                    </p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2 text-sm text-[#1A1A1A]/80">
                    <Check className="w-4 h-4 text-[#A68B6F] mt-0.5 flex-shrink-0" />
                    <span>Consultations à la demande</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-[#1A1A1A]/80">
                    <Check className="w-4 h-4 text-[#A68B6F] mt-0.5 flex-shrink-0" />
                    <span>Ressources gratuites</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-[#1A1A1A]/80">
                    <Check className="w-4 h-4 text-[#A68B6F] mt-0.5 flex-shrink-0" />
                    <span>Passeport santé numérique</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSubscriptionModal(true)}
                className="w-full bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] text-white rounded-full py-4 px-6 font-medium hover:shadow-xl transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-[#D4A574]" />
                  <div className="text-left">
                    <p className="text-sm font-medium">Rejoindre le Cercle M.O.N.A</p>
                    <p className="text-xs text-white/70">Accès illimité et fonctionnalités premium</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Zone danger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl p-6 border border-red-200"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-serif text-[#1A1A1A]">Zone danger</h3>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-red-50 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <p className="text-sm text-[#1A1A1A] font-medium">Se déconnecter</p>
                  <p className="text-xs text-[#1A1A1A]/60">Se déconnecter de tous les appareils</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#1A1A1A]/40 group-hover:text-red-600 transition-colors" />
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-red-50 rounded-xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-600" />
                <div className="text-left">
                  <p className="text-sm text-red-600 font-medium">Supprimer mon compte</p>
                  <p className="text-xs text-[#1A1A1A]/60">Action définitive et irréversible</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#1A1A1A]/40 group-hover:text-red-600 transition-colors" />
            </button>
          </div>
        </motion.div>

        {/* Informations version */}
        <div className="text-center py-6 text-sm text-[#1A1A1A]/40">
          <p>M.O.N.A Version 1.0.0</p>
          <p className="mt-1">
            <a href="/legal" className="hover:underline">Mentions légales</a>
            {" • "}
            <a href="/confidentialite" className="hover:underline">Confidentialité</a>
            {" • "}
            <a href="/conditions" className="hover:underline">CGU</a>
          </p>
        </div>
      </main>

      {/* Modal Abonnement */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-5 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-[#D4C5B9]/30">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-[#1A1A1A] mb-1 sm:mb-2">
                  Choisissez votre formule
                </h3>
                <p className="text-xs text-[#1A1A1A]/70">
                  Tarifs transparents adaptés au marché africain.
                </p>
              </div>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#2A2A2A] transition-colors flex-shrink-0 shadow-lg"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Toggles XOF/USD et Étudiant */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
              <button
                onClick={() => setShowStudentPlans(!showStudentPlans)}
                className={`px-4 py-2.5 sm:py-2 rounded-full text-sm font-medium transition-colors ${
                  showStudentPlans
                    ? "bg-[#A68B6F] text-white"
                    : "bg-[#F5F1ED] text-[#1A1A1A] hover:bg-[#E5DED6]"
                }`}
              >
                {showStudentPlans ? "Plans Standards" : "Tarifs Étudiants"}
              </button>
              
              <div className="flex items-center justify-center gap-3">
                <span className={`text-sm font-medium ${currency === "XOF" ? "text-[#1A1A1A]" : "text-[#1A1A1A]/40"}`}>
                  XOF
                </span>
                <button
                  onClick={() => setCurrency(currency === "XOF" ? "USD" : "XOF")}
                  className="relative w-14 h-7 bg-[#D4C5B9] rounded-full transition-colors"
                >
                  <div className={`absolute top-0.5 w-6 h-6 bg-[#A68B6F] rounded-full transition-transform ${
                    currency === "USD" ? "translate-x-7" : "translate-x-0.5"
                  }`}></div>
                </button>
                <span className={`text-sm font-medium ${currency === "USD" ? "text-[#1A1A1A]" : "text-[#1A1A1A]/40"}`}>
                  USD
                </span>
              </div>
            </div>

            {/* Plans Standards */}
            {!showStudentPlans && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Plan Essentiel */}
                <div className="bg-white border-2 border-[#D4C5B9] rounded-2xl sm:rounded-3xl p-3 sm:p-4 hover:border-[#A68B6F] transition-all">
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs font-medium text-[#1A1A1A]/60 mb-2 uppercase tracking-wide">ESSENTIEL</p>
                    <p className="text-xs sm:text-sm text-[#1A1A1A]/70 mb-3 sm:mb-4">
                      Santé mentale & soins primaires de base
                    </p>
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className="text-3xl sm:text-4xl font-serif text-[#1A1A1A]">
                        {currency === "XOF" ? "35 000" : "65"}
                      </span>
                      <span className="text-xs sm:text-sm text-[#1A1A1A]/70">
                        {currency === "XOF" ? "FCFA" : "USD"}/mois
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">2 consultations vidéo/mois (psy OU médecin généraliste)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Messagerie sécurisée E2E avec votre expert</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Passeport Santé FHIR</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Auto-évaluation Score Mental</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Méditations guidées</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Accès bibliothèque de ressources</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Carte M.O.N.A Numérique</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Cercle M.O.N.A Bronze (-10%)</span>
                    </div>
                  </div>

                  <button className="w-full bg-[#F5F1ED] text-[#1A1A1A] rounded-full py-2.5 text-sm font-medium hover:bg-[#E5DED6] transition-colors relative group">
                    <span>Paiement bientôt disponible</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574]/0 via-[#D4A574]/10 to-[#D4A574]/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                  </button>
                </div>

                {/* Plan Premium */}
                <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-2xl sm:rounded-3xl p-3 sm:p-4 relative overflow-hidden border-2 border-[#D4A574] shadow-xl">
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-[#D4A574] text-white text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase">
                    Best Seller
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs font-medium text-white/60 mb-2 uppercase tracking-wide">PREMIUM</p>
                    <p className="text-xs sm:text-sm text-white/70 mb-3 sm:mb-4">
                      L'expérience complète M.O.N.A
                    </p>
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className="text-3xl sm:text-4xl font-serif text-white">
                        {currency === "XOF" ? "65 000" : "120"}
                      </span>
                      <span className="text-xs sm:text-sm text-white/70">
                        {currency === "XOF" ? "FCFA" : "USD"}/mois
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">4 consultations/mois (mixte psy + médecin)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">Smart Matching avancé</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">Messagerie illimitée prioritaire</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">Coordination de soins</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">Ateliers en ligne mensuels</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">Carte M.O.N.A Physique NFC</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">Cercle M.O.N.A Silver (-20% / -25%)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-white">1 séance spa offerte/trimestre</span>
                    </div>
                  </div>

                  <button className="w-full bg-white text-[#1A1A1A] rounded-full py-2.5 text-sm font-medium hover:bg-[#F5F1ED] transition-colors relative group">
                    <span>Paiement bientôt disponible</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#D4A574]/0 via-[#D4A574]/20 to-[#D4A574]/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                  </button>
                </div>

                {/* Plan Prestige */}
                <div className="bg-white border-2 border-[#D4A574] rounded-2xl sm:rounded-3xl p-3 sm:p-4 hover:border-[#A68B6F] transition-all relative overflow-hidden sm:col-span-2 lg:col-span-1">
                  <div className="absolute top-0 right-0 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-[#D4A574]/10 to-transparent rounded-bl-full"></div>
                  
                  <div className="mb-3 sm:mb-4 relative">
                    <p className="text-xs font-medium text-[#D4A574] mb-2 uppercase tracking-wide">PRESTIGE</p>
                    <p className="text-xs sm:text-sm text-[#1A1A1A]/70 mb-3 sm:mb-4">
                      Pour ceux qui ne transigeront jamais sur leur bien-être
                    </p>
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className="text-3xl sm:text-4xl font-serif text-[#1A1A1A]">
                        {currency === "XOF" ? "120 000" : "215"}
                      </span>
                      <span className="text-xs sm:text-sm text-[#1A1A1A]/70">
                        {currency === "XOF" ? "FCFA" : "USD"}/mois
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Consultations illimitées</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Accès psychiatre inclus</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Conciergerie santé dédiée</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Suivi 24/7</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Plan de soins personnalisé</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Carte M.O.N.A Prestige NFC</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">Cercle M.O.N.A Gold (-30%)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">1 M.O.N.A Escape/an inclus</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                      <span className="text-xs text-[#1A1A1A]">1 massage spa/mois inclus</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-[#D4A574] to-[#A68B6F] text-white rounded-full py-2.5 text-sm font-medium hover:shadow-lg transition-all relative group">
                    <span>Paiement bientôt disponible</span>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
                  </button>
                </div>
              </div>
            )}

            {/* Plans Étudiants */}
            {showStudentPlans && (
              <div>
                <div className="bg-gradient-to-r from-[#D4A574]/10 to-[#A68B6F]/10 rounded-2xl p-4 mb-6 border border-[#D4A574]/20">
                  <p className="text-sm text-[#1A1A1A] font-medium mb-1">Tarif Étudiant -50%</p>
                  <p className="text-xs text-[#1A1A1A]/70">Justificatif requis : carte étudiant valide</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Essentiel Étudiant */}
                  <div className="bg-white border-2 border-[#D4C5B9] rounded-3xl p-4 sm:p-6 hover:border-[#A68B6F] transition-all">
                    <div className="mb-4 sm:mb-6">
                      <p className="text-xs font-medium text-[#1A1A1A]/60 mb-2 uppercase tracking-wide">ESSENTIEL ÉTUDIANT</p>
                      <div className="flex items-baseline gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        <span className="text-3xl sm:text-4xl font-serif text-[#1A1A1A]">
                          {currency === "XOF" ? "17 500" : "32"}
                        </span>
                        <span className="text-xs sm:text-sm text-[#1A1A1A]/70">
                          {currency === "XOF" ? "FCFA" : "USD"}/mois
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#1A1A1A]">2 consultations/mois</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#1A1A1A]">Passeport Santé FHIR</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#1A1A1A]">Messagerie E2E</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-[#1A1A1A]">Cercle Bronze</span>
                      </div>
                    </div>

                    <button className="w-full bg-[#F5F1ED] text-[#1A1A1A] rounded-full py-2.5 text-sm font-medium hover:bg-[#E5DED6] transition-colors">
                      Paiement bientôt disponible
                    </button>
                  </div>

                  {/* Premium Étudiant */}
                  <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-2xl sm:rounded-3xl p-3 sm:p-4 relative overflow-hidden border-2 border-[#D4A574] shadow-xl">
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-[#D4A574] text-white text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase">
                      Recommandé
                    </div>

                    <div className="mb-3 sm:mb-4">
                      <p className="text-xs font-medium text-white/60 mb-2 uppercase tracking-wide">PREMIUM ÉTUDIANT</p>
                      <div className="flex items-baseline gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        <span className="text-3xl sm:text-4xl font-serif text-white">
                          {currency === "XOF" ? "32 500" : "58"}
                        </span>
                        <span className="text-xs sm:text-sm text-white/70">
                          {currency === "XOF" ? "FCFA" : "USD"}/mois
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-white">4 consultations/mois</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-white">Smart Matching</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-white">Carte physique NFC</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#D4A574] flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-white">Cercle Silver</span>
                      </div>
                    </div>

                    <button className="w-full bg-white text-[#1A1A1A] rounded-full py-2.5 text-sm font-medium hover:bg-[#F5F1ED] transition-colors">
                      Paiement bientôt disponible
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Modal Recharge Wallet */}
      {showRechargeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full"
          >
            <div className="w-12 h-12 bg-[#D4A574]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-6 h-6 text-[#D4A574]" />
            </div>

            <h3 className="text-2xl font-serif text-[#1A1A1A] text-center mb-3">
              Recharger mon wallet
            </h3>

            <p className="text-[#1A1A1A]/80 text-center mb-6">
              Entrez le montant à ajouter à votre wallet
            </p>

            <div className="mb-6">
              <label className="block text-sm text-[#1A1A1A] mb-2">
                Montant (XOF)
              </label>
              <input
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                placeholder="Ex: 10000"
                className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
              />
            </div>

            {/* Montants rapides */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[5000, 10000, 25000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setRechargeAmount(amount.toString())}
                  className="py-2 border border-[#D4C5B9] rounded-lg text-sm text-[#1A1A1A] hover:bg-[#F5F1ED] transition-colors"
                >
                  {amount.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRechargeModal(false);
                  setRechargeAmount("");
                }}
                className="flex-1 bg-[#F5F1ED] text-[#1A1A1A] rounded-full py-3 font-medium hover:bg-[#E5DED6] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleRecharge}
                className="flex-1 bg-[#A68B6F] text-white rounded-full py-3 font-medium hover:bg-[#8A7159] transition-colors"
              >
                Recharger
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de confirmation de déconnexion */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <h3 className="text-2xl font-serif text-[#1A1A1A] text-center mb-3">
              Se déconnecter ?
            </h3>

            <p className="text-[#1A1A1A]/80 text-center mb-6">
              Vous allez être déconnecté de tous les appareils. Êtes-vous sûr de vouloir continuer ?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-[#F5F1ED] text-[#1A1A1A] rounded-full py-3 font-medium hover:bg-[#E5DED6] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="flex-1 bg-red-600 text-white rounded-full py-3 font-medium hover:bg-red-700 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <h3 className="text-2xl font-serif text-[#1A1A1A] text-center mb-3">
              Supprimer votre compte ?
            </h3>

            <p className="text-[#1A1A1A]/80 text-center mb-6">
              Cette action est définitive et irréversible. Toutes vos données, consultations, ordonnances et historique seront définitivement supprimés.
            </p>

            <div className="space-y-3 mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-sm text-red-900 font-medium">Vous perdrez :</p>
              <ul className="space-y-1 text-sm text-red-800">
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Votre historique de consultations</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Votre passeport santé numérique</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Vos ordonnances et documents médicaux</span>
                </li>
                <li className="flex items-start gap-2">
                  <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Votre wallet et votre abonnement</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-[#F5F1ED] text-[#1A1A1A] rounded-full py-3 font-medium hover:bg-[#E5DED6] transition-colors"
              >
                Annuler
              </button>
              <button className="flex-1 bg-red-600 text-white rounded-full py-3 font-medium hover:bg-red-700 transition-colors">
                Supprimer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal d'édition du profil */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="w-12 h-12 bg-[#A68B6F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-[#A68B6F]" />
            </div>

            <h3 className="text-2xl font-serif text-[#1A1A1A] text-center mb-3">
              Modifier mon profil
            </h3>

            <p className="text-[#1A1A1A]/80 text-center mb-6">
              Mettez à jour vos informations personnelles
            </p>

            <div className="space-y-4">
              {/* Nom complet */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Votre nom complet"
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={editedPhone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                  placeholder="+243 XXX XXX XXX"
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                />
              </div>

              {/* Date de naissance */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Date de naissance
                </label>
                <input
                  type="date"
                  value={editedDateOfBirth}
                  onChange={(e) => setEditedDateOfBirth(e.target.value)}
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                />
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Localisation
                </label>
                <select
                  value={editedLocation}
                  onChange={(e) => setEditedLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                >
                  <option value="">Sélectionner une ville</option>
                  <option value="Kinshasa">Kinshasa</option>
                  <option value="Dakar">Dakar</option>
                  <option value="Abidjan">Abidjan</option>
                  <option value="Brazzaville">Brazzaville</option>
                  <option value="Libreville">Libreville</option>
                  <option value="Douala">Douala</option>
                  <option value="Yaoundé">Yaoundé</option>
                  <option value="Bamako">Bamako</option>
                  <option value="Niamey">Niamey</option>
                  <option value="Ouagadougou">Ouagadougou</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-[#F5F1ED] text-[#1A1A1A] rounded-full py-3 font-medium hover:bg-[#E5DED6] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  setSaving(true);
                  try {
                    const token = localStorage.getItem("mona_member_token");
                    const response = await fetch(
                      `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/profile`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                          "Authorization": `Bearer ${publicAnonKey}`,
                          "X-User-Token": token,
                        },
                        body: JSON.stringify({
                          name: editedName,
                          phone: editedPhone,
                          dateOfBirth: editedDateOfBirth,
                          location: editedLocation,
                        }),
                      }
                    );

                    console.log("📤 Requête envoyée:", {
                      name: editedName,
                      phone: editedPhone,
                      dateOfBirth: editedDateOfBirth,
                      location: editedLocation,
                    });
                    console.log("📥 Statut réponse:", response.status, response.statusText);

                    if (response.ok) {
                      await loadProfileData();
                      setIsEditing(false);
                      alert("Profil mis à jour avec succès");
                    } else {
                      const errorData = await response.json();
                      console.error("❌ Erreur serveur complète:", errorData);
                      alert(`Erreur: ${errorData.error || "Erreur lors de la mise à jour"}`);
                      throw new Error(errorData.error || "Erreur lors de la mise à jour");
                    }
                  } catch (error) {
                    console.error("Erreur sauvegarde:", error);
                    alert("Erreur lors de la mise à jour du profil");
                  } finally {
                    setSaving(false);
                  }
                }}
                className="flex-1 bg-[#A68B6F] text-white rounded-full py-3 font-medium hover:bg-[#8A7159] transition-colors flex items-center justify-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Navigation PWA Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] safe-area-inset-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              to="/member/dashboard"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs">Accueil</span>
            </Link>
            <Link
              to="/member/consultations"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs">Consultations</span>
            </Link>
            <Link
              to="/member/health-passport"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs">Passeport</span>
            </Link>
            <Link
              to="/member/profile"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]"
            >
              <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium">Compte</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}