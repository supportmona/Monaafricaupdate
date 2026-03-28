import React, { createContext, useContext, useState, useEffect } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface ExpertUser {
  id: string;
  email: string;
  user_metadata: {
    role: string;
    firstName: string;
    lastName: string;
    specialty: string;
    licenseNumber: string;
    phone: string;
  };
}

interface ExpertProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  specialty: string;
  licenseNumber: string;
  phone: string;
  status: string;
  createdAt: string;
  totalConsultations: number;
  rating: number;
  languages: string[];
  availability: Record<string, unknown>;
  bio?: string;
}

interface ExpertAuthContextType {
  user: ExpertUser | null;
  profile: ExpertProfile | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const ExpertAuthContext = createContext<ExpertAuthContextType | undefined>(
  undefined
);

export function ExpertAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExpertUser | null>(null);
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81`;

  // Nettoyer l'ancien système d'authentification au chargement
  useEffect(() => {
    const cleanupOldAuth = () => {
      // Supprimer les anciennes clés obsolètes et tous les tokens
      const oldKeys = ["mona_expert_user", "expert_token", "expert_access_token", "expert_user", "expert_profile"];
      oldKeys.forEach(key => {
        localStorage.removeItem(key);
      });
    };

    cleanupOldAuth();
    setLoading(false); // Juste marquer comme chargé, pas de vérification auto
  }, []);

  // Fonction pour vérifier la session (utilisée uniquement par refreshSession)
  const checkSession = async () => {
    try {
      const storedToken = localStorage.getItem("expert_access_token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${serverUrl}/expert/session`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        // Session expirée ou invalide - nettoyage silencieux sans erreur
        localStorage.removeItem("expert_access_token");
        localStorage.removeItem("expert_user");
        localStorage.removeItem("expert_profile");
        setAccessToken(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        setUser(data.data.user);
        setProfile(data.data.profile);
        setAccessToken(storedToken);
      }
    } catch (err) {
      // Erreur silencieuse
      localStorage.removeItem("expert_access_token");
      localStorage.removeItem("expert_user");
      localStorage.removeItem("expert_profile");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Nettoyer les espaces invisibles
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();
      
      console.log(`🔐 [Frontend] Tentative de connexion pour: ${cleanEmail}`);
      console.log(`📧 [Frontend] Email envoyé (longueur: ${cleanEmail.length}):`, JSON.stringify(cleanEmail));
      console.log(`🔑 [Frontend] Mot de passe envoyé (longueur: ${cleanPassword.length}):`, JSON.stringify(cleanPassword));
      
      const response = await fetch(`${serverUrl}/expert/login`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        console.error(`❌ [Frontend] Erreur de connexion:`, data.error);
        
        throw new Error(data.error || "Erreur lors de la connexion");
      }

      if (data.success && data.data) {
        const { session, user: userData, profile: profileData } = data.data;

        console.log(`✅ [Frontend] Connexion réussie`);
        console.log(`👤 [Frontend] Utilisateur ID: ${userData.id}`);
        console.log(`📧 [Frontend] Email: ${userData.email}`);
        console.log(`🏷️ [Frontend] Rôle: ${userData.user_metadata?.role}`);
        
        if (profileData) {
          console.log(`👨‍⚕️ [Frontend] Profil: ${profileData.firstName} ${profileData.lastName}`);
          console.log(`🎯 [Frontend] Spécialité: ${profileData.specialty}`);
        } else {
          console.warn(`⚠️ [Frontend] Aucun profil trouvé pour cet utilisateur`);
        }

        setUser(userData);
        setProfile(profileData);
        setAccessToken(session.access_token);

        // Stocker dans le localStorage
        localStorage.setItem("expert_access_token", session.access_token);
        localStorage.setItem("expert_user", JSON.stringify(userData));
        localStorage.setItem("expert_profile", JSON.stringify(profileData));
        
        console.log(`💾 [Frontend] Session stockée dans localStorage`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la connexion";
      console.error(`❌ [Frontend] Exception:`, err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);

    try {
      if (accessToken) {
        await fetch(`${serverUrl}/expert/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }

      // Nettoyer l'état local
      setUser(null);
      setProfile(null);
      setAccessToken(null);

      // Nettoyer le localStorage
      localStorage.removeItem("expert_access_token");
      localStorage.removeItem("expert_user");
      localStorage.removeItem("expert_profile");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      setError("Erreur lors de la déconnexion");
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    await checkSession();
  };

  return (
    <ExpertAuthContext.Provider
      value={{
        user,
        profile,
        accessToken,
        loading,
        error,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </ExpertAuthContext.Provider>
  );
}

export function useExpertAuth() {
  const context = useContext(ExpertAuthContext);
  if (context === undefined) {
    throw new Error(
      "useExpertAuth doit être utilisé à l'intérieur d'un ExpertAuthProvider"
    );
  }
  return context;
}