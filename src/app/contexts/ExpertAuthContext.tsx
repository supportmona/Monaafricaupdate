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
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const ExpertAuthContext = createContext<ExpertAuthContextType | undefined>(undefined);

export function ExpertAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExpertUser | null>(null);
  const [profile, setProfile] = useState<ExpertProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81`;

  // isAuthenticated dérivé de user — jamais de désynchronisation
  const isAuthenticated = !!user;

  const clearSession = () => {
    setUser(null);
    setProfile(null);
    setAccessToken(null);
    localStorage.removeItem("expert_access_token");
    localStorage.removeItem("expert_user");
    localStorage.removeItem("expert_profile");
  };

  // Au chargement : restaure la session depuis localStorage sans jamais
  // supprimer le token avant de l'avoir vérifié
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = localStorage.getItem("expert_access_token");
        const storedUser = localStorage.getItem("expert_user");
        const storedProfile = localStorage.getItem("expert_profile");

        if (!storedToken) {
          setLoading(false);
          return;
        }

        // Restauration immédiate depuis cache → évite le flash de redirection
        if (storedUser && storedProfile) {
          try {
            setUser(JSON.parse(storedUser));
            setProfile(JSON.parse(storedProfile));
            setAccessToken(storedToken);
          } catch {
            // JSON corrompu → on continue
          }
        }

        // Vérification en arrière-plan
        try {
          const response = await fetch(`${serverUrl}/expert/session`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          });

          if (response.status === 401) {
            // Token expiré → déconnexion propre
            clearSession();
          } else if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
              setUser(data.data.user);
              setProfile(data.data.profile);
              setAccessToken(storedToken);
              localStorage.setItem("expert_user", JSON.stringify(data.data.user));
              localStorage.setItem("expert_profile", JSON.stringify(data.data.profile));
            }
          }
          // 500 ou autre → on garde la session en cache
        } catch {
          // Erreur réseau → session conservée, pas de déconnexion forcée
          console.warn("⚠️ Vérification session impossible (réseau) — session conservée");
        }
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
        throw new Error(data.error || "Identifiants incorrects");
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
      const errorMessage = err instanceof Error ? err.message : "Erreur de connexion";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
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
    } catch {
      console.error("Erreur lors de la déconnexion");
    } finally {
      clearSession();
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
        clearSession();
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
        isAuthenticated,
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
    throw new Error("useExpertAuth doit être utilisé à l'intérieur d'un ExpertAuthProvider");
  }
  return context;
}
