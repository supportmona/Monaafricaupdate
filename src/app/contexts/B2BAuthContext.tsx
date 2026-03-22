import { createContext, useContext, useState, ReactNode } from 'react';

interface B2BUser {
  email: string;
  companyName: string;
  companyId: string;
  role: 'admin' | 'hr-manager' | 'viewer';
  employeeCount: number;
  locations: string[];
}

interface B2BAuthContextType {
  user: B2BUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const B2BAuthContext = createContext<B2BAuthContextType | undefined>(undefined);

/**
 * COMPTES DE TEST TEMPORAIRES
 * Ces comptes sont uniquement utilisés pour la démonstration.
 * En production, chaque entreprise ne voit que ses propres données via l'API.
 * Aucun mélange de données entre entreprises n'est possible.
 */
// Comptes de test pour démonstration
const TEST_B2B_ACCOUNTS = [
  {
    email: 'demo.rh@monafrica.net',
    password: 'RH2025!',
    companyName: 'Entreprise Démo',
    companyId: 'demo-001',
    role: 'admin' as const,
    employeeCount: 50,
    locations: ['Kinshasa', 'Dakar', 'Abidjan'],
  },
  {
    email: 'rh@ekolo-tech.com',
    password: 'MonaB2B2024!',
    companyName: 'Ekolo Tech',
    companyId: 'ekolo-001',
    role: 'admin' as const,
    employeeCount: 113,
    locations: ['Kinshasa', 'Dakar', 'Abidjan'],
  },
  {
    email: 'hr@bantu-finance.com',
    password: 'MonaB2B2024!',
    companyName: 'Bantu Finance',
    companyId: 'bantu-002',
    role: 'hr-manager' as const,
    employeeCount: 87,
    locations: ['Kinshasa'],
  },
];

export function B2BAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<B2BUser | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simuler une latence réseau
    await new Promise(resolve => setTimeout(resolve, 800));

    const account = TEST_B2B_ACCOUNTS.find(
      acc => acc.email === email && acc.password === password
    );

    if (account) {
      const { password: _, ...userWithoutPassword } = account;
      setUser(userWithoutPassword);
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <B2BAuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user, 
        login, 
        logout 
      }}
    >
      {children}
    </B2BAuthContext.Provider>
  );
}

export function useB2BAuth() {
  const context = useContext(B2BAuthContext);
  if (context === undefined) {
    throw new Error('useB2BAuth must be used within a B2BAuthProvider');
  }
  return context;
}