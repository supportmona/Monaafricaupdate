import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super-admin' | 'content-manager' | 'support-manager' | 'finance-manager';
  permissions: string[];
  avatar?: string;
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, code2FA?: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('mona_admin_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('mona_admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, code2FA?: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/admin/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, code2FA }),
        }
      );

      const result = await response.json();

      console.log('📥 Réponse du serveur:', result);

      // Si le serveur retourne success: false avec 2FA_REQUIRED
      if (!result.success && result.error === '2FA_REQUIRED') {
        console.log('🔐 Code 2FA requis');
        setError('2FA_REQUIRED');
        setLoading(false);
        return false;
      }

      // Autres erreurs
      if (!response.ok || !result.success) {
        console.error('❌ Erreur de connexion admin:', result.error);
        setError(result.error || 'Erreur de connexion');
        setLoading(false);
        return false;
      }

      if (!result.data) {
        setError('Données de connexion manquantes');
        setLoading(false);
        return false;
      }

      // Mapper les données du backend vers le format AdminUser
      const userData = result.data.user;
      const adminUser: AdminUser = {
        id: userData.id,
        email: userData.email,
        name: userData.user_metadata.name,
        role: userData.user_metadata.role === 'super_admin' ? 'super-admin' : 'content-manager',
        permissions: userData.user_metadata.role === 'super_admin' ? ['all'] : [],
        avatar: undefined
      };

      // Sauvegarder l'utilisateur et le token
      setUser(adminUser);
      localStorage.setItem('mona_admin_user', JSON.stringify(adminUser));
      localStorage.setItem('mona_admin_token', result.data.session.access_token);
      
      console.log('✅ Admin connecté avec succès');
      setLoading(false);
      return true;

    } catch (err) {
      console.error('❌ Erreur lors de la connexion admin:', err);
      setError('Une erreur est survenue lors de la connexion');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mona_admin_user');
    localStorage.removeItem('mona_admin_token');
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}