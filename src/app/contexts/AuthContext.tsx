import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  specialty: string;
  license: string;
  languages: string[];
  location: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// IMPORTANT: Ce contexte est obsolète pour l'authentification expert.
// Utilisez ExpertAuthContext à la place pour les experts.
// Ce contexte est conservé uniquement pour la compatibilité avec d'anciens composants.

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Nettoyer les anciennes données de ce système obsolète au chargement
  useEffect(() => {
    const oldKey = localStorage.getItem("mona_expert_user");
    if (oldKey) {
      console.warn("⚠️ AuthContext obsolète: Nettoyage de mona_expert_user");
      localStorage.removeItem("mona_expert_user");
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Ce système de login est obsolète
    console.warn("⚠️ AuthContext.login est obsolète. Utilisez ExpertAuthContext.login à la place.");
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mona_expert_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}