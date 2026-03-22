import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface MemberUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  memberSince: string;
  plan: 'free' | 'cercle-mona';
}

interface MemberAuthContextType {
  user: MemberUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  updateUser: (updates: Partial<MemberUser>) => void;
}

const MemberAuthContext = createContext<MemberAuthContextType | undefined>(undefined);

export function MemberAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MemberUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('mona_member_user');
    const storedToken = localStorage.getItem('mona_member_token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Valider que le token n'est pas expiré et correspond à l'userId
        try {
          const parts = storedToken.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            const tokenUserId = payload.sub;
            const tokenExp = payload.exp;
            
            console.log("🔍 Validation token au chargement:", {
              userIdStored: parsedUser.id,
              userIdToken: tokenUserId,
              correspond: parsedUser.id === tokenUserId,
              exp: tokenExp ? new Date(tokenExp * 1000).toISOString() : "NON DÉFINI",
              expired: tokenExp && tokenExp * 1000 < Date.now()
            });
            
            // Vérifier que l'userId correspond
            if (tokenUserId !== parsedUser.id) {
              console.error("❌ MISMATCH: userId stocké ne correspond pas au token JWT");
              console.error("   localStorage userId:", parsedUser.id);
              console.error("   JWT sub:", tokenUserId);
              // Nettoyer les données corrompues
              localStorage.removeItem('mona_member_user');
              localStorage.removeItem('mona_member_token');
              setLoading(false);
              return;
            }
            
            // Vérifier l'expiration
            if (tokenExp && tokenExp * 1000 < Date.now()) {
              console.warn("⚠️ Token expiré, déconnexion automatique");
              localStorage.removeItem('mona_member_user');
              localStorage.removeItem('mona_member_token');
              setLoading(false);
              return;
            }
          }
        } catch (tokenError) {
          console.error("❌ Erreur validation token:", tokenError);
          localStorage.removeItem('mona_member_user');
          localStorage.removeItem('mona_member_token');
          setLoading(false);
          return;
        }
        
        setUser(parsedUser);
        console.log("✅ Session restaurée pour userId:", parsedUser.id);
      } catch (e) {
        console.error("❌ Erreur parsing user data:", e);
        localStorage.removeItem('mona_member_user');
        localStorage.removeItem('mona_member_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      console.log('[Frontend] Tentative de connexion pour:', email);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      
      console.log('[Frontend] Réponse du serveur:', {
        ok: response.ok,
        status: response.status,
        hasError: !!data.error,
        hasData: !!data.data
      });

      if (!response.ok || data.error) {
        const errorMessage = data.error || 'Email ou mot de passe incorrect';
        console.error('[Frontend] Erreur de connexion:', errorMessage);
        setError(errorMessage);
        setLoading(false);
        return false;
      }

      // Vérification de la structure de la réponse
      if (!data.data || !data.data.user || !data.data.session) {
        console.error('[Frontend] Réponse invalide du serveur:', data);
        setError('Erreur serveur: réponse invalide');
        setLoading(false);
        return false;
      }

      // Authentification réussie
      const memberUser: MemberUser = {
        id: data.data.user.id,
        email: data.data.user.email,
        name: data.data.profile.name,
        avatar: data.data.profile.avatar,
        memberSince: new Date(data.data.profile.memberSince).toLocaleDateString('fr-FR', { 
          month: 'long', 
          year: 'numeric' 
        }),
        plan: data.data.profile.plan || 'free'
      };

      const accessToken = data.data.session.access_token;
      
      console.log('[Frontend] Token reçu:', accessToken ? `${accessToken.substring(0, 30)}...` : 'AUCUN');
      console.log('[Frontend] Token est un JWT?', accessToken && accessToken.split('.').length === 3);
      
      // Validation stricte du token JWT
      if (!accessToken || accessToken.split('.').length !== 3) {
        console.error('[Frontend] TOKEN INVALIDE REÇU DU BACKEND');
        console.error('   Type:', typeof accessToken);
        console.error('   Valeur:', accessToken);
        console.error('   Parties:', accessToken ? accessToken.split('.').length : 0);
        setError('Erreur d\'authentification: token invalide');
        setLoading(false);
        return false;
      }

      setUser(memberUser);
      localStorage.setItem('mona_member_user', JSON.stringify(memberUser));
      localStorage.setItem('mona_member_token', accessToken);
      console.log('[Frontend] Connexion réussie pour:', memberUser.name);
      setLoading(false);
      return true;

    } catch (err) {
      console.error('[Frontend] Exception:', err);
      const errorMsg = err instanceof Error ? err.message : 'Une erreur est survenue lors de la connexion';
      console.error('Erreur de connexion:', errorMsg);
      setError('Impossible de se connecter au serveur. Veuillez réessayer.');
      setLoading(false);
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      const data = await response.json();

      // ✅ Gérer les erreurs (409, 400, 500, etc.)
      if (!response.ok) {
        console.error('❌ Erreur HTTP:', response.status, data);
        setError(data.error || 'Une erreur est survenue lors de l\'inscription');
        setLoading(false);
        return false;
      }

      // ✅ Gérer les réponses avec propriété error (même si status 200)
      if (data.error) {
        console.error('❌ Erreur dans la réponse:', data.error);
        setError(data.error);
        setLoading(false);
        return false;
      }

      // ✅ Vérifier que les données sont complètes avant de continuer
      if (!data.data || !data.data.user || !data.data.session || !data.data.profile) {
        console.error('❌ Données incomplètes reçues du serveur:', data);
        setError('Erreur serveur: données incomplètes');
        setLoading(false);
        return false;
      }

      // Inscription réussie
      const memberUser: MemberUser = {
        id: data.data.user.id,
        email: data.data.user.email,
        name: data.data.profile.name,
        avatar: data.data.profile.avatar,
        memberSince: new Date(data.data.profile.memberSince).toLocaleDateString('fr-FR', { 
          month: 'long', 
          year: 'numeric' 
        }),
        plan: data.data.profile.plan || 'free'
      };

      setUser(memberUser);
      localStorage.setItem('mona_member_user', JSON.stringify(memberUser));
      localStorage.setItem('mona_member_token', data.data.session.access_token);
      setLoading(false);
      return true;

    } catch (err) {
      console.error('Erreur inscription membre:', err);
      setError('Une erreur est survenue lors de l\'inscription');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mona_member_user');
    localStorage.removeItem('mona_member_token');
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const updateUser = (updates: Partial<MemberUser>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('mona_member_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <MemberAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        signup,
        logout,
        clearError,
        updateUser
      }}
    >
      {children}
    </MemberAuthContext.Provider>
  );
}

export function useMemberAuth() {
  const context = useContext(MemberAuthContext);
  if (context === undefined) {
    throw new Error('useMemberAuth must be used within a MemberAuthProvider');
  }
  return context;
}