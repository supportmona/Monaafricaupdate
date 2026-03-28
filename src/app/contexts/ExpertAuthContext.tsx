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

  // ✅ FIX : Au chargement, on restaure la session depuis localStorage
  // On ne supprime PLUS les tokens existants — c'était ça le bug
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = localStorage.getItem("expert_access_token");
        const storedUser = localStorage.getItem("expert_user");
        const storedProfile = localStorage.getItem("expert_profile");

        // Pas de token stocké → pas de session, on arrête là
        if (!storedToken) {
          setLoading(false);
          return;
        }

        // Restauration immédiate depuis le cache pour éviter le flash de redirection
        if (storedUser && storedProfile) {
          try {
            setUser(JSON.parse(storedUser));
            setProfile(JSON.parse(storedProfile));
            setAccessToken(storedToken);
          } catch {
            // JSON corrompu → on nettoie et on vérifie via API
          }
        }

        // Vérification de la validité du token en arrière-plan
        const response = await fetch(`${serverUrl}/expert/session`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          // Token expiré ou invalide → nettoyage silencieux
          localStorage.removeItem("expert_access_token");
          localStorage.removeItem("expert_user");
          localStorage.removeItem("expert_profile");
          setAccessToken(null);
          setUser(null);
          setProfile(null);
        } else {
          const data = await response.json();
          if (data.success && data.data) {
            // Mise à jour avec les données fraîches du serveur
            setUser(data.data.user);
            setProfile(data.data.profile);
            setAccessToken(storedToken);
            // Rafraîchir le cache
            localStorage.setItem("expert_user", JSON.stringify(data.data.user));
            localStorage.setItem("expert_profile", JSON.stringify(data.data.profile));
          }
        }
      } catch {
        // Erreur réseau → on garde la session en cache, on ne déconnecte pas
        // L'expert pourra continuer en mode dégradé
        console.warn("⚠️ Impossible de vérifier la session expert (réseau?)");
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();

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
        throw new Error(data.error || "Erreur lors de la connexion");
      }

      if (data.success && data.data) {
        const { session, user: userData, profile: profileData } = data.data;

        setUser(userData);
        setProfile(profileData);
        setAccessToken(session.access_token);

        localStorage.setItem("expert_access_token", session.access_token);
        localStorage.setItem("expert_user", JSON.stringify(userData));
        localStorage.setItem("expert_profile", JSON.stringify(profileData));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de la connexion";
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
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
    } finally {
      setUser(null);
      setProfile(null);
      setAccessToken(null);
      localStorage.removeItem("expert_access_token");
      localStorage.removeItem("expert_user");
      localStorage.removeItem("expert_profile");
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    const storedToken = localStorage.getItem("expert_access_token");
    if (!storedToken) return;

    try {
      const response = await fetch(`${serverUrl}/expert/session`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        localStorage.removeItem("expert_access_token");
        localStorage.removeItem("expert_user");
        localStorage.removeItem("expert_profile");
        setAccessToken(null);
        setUser(null);
        setProfile(null);
        return;
      }

      const data = await response.json();
      if (data.success && data.data) {
        setUser(data.data.user);
        setProfile(data.data.profile);
        setAccessToken(storedToken);
      }
    } catch {
      console.warn("Impossible de rafraîchir la session");
    }
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
