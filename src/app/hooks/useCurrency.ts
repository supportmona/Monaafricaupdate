import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { CurrencyCode, getPreferredCurrency } from '@/app/utils/currency';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Initialiser avec USD par défaut ou depuis localStorage
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mona-preferred-currency');
      return (saved as CurrencyCode) || 'USD';
    }
    return 'USD';
  });

  // Sauvegarder dans localStorage quand la devise change
  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mona-preferred-currency', newCurrency);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

/**
 * Hook pour accéder et modifier la devise courante
 */
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

/**
 * Hook pour détecter automatiquement la devise préférée depuis la géolocalisation
 */
export function useAutoDetectCurrency() {
  const { setCurrency } = useCurrency();

  useEffect(() => {
    // Vérifier si une devise est déjà sauvegardée
    const savedCurrency = localStorage.getItem('mona-preferred-currency');
    if (savedCurrency) return; // Ne pas écraser une préférence explicite

    // Tenter de détecter depuis le fuseau horaire ou la langue
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;

    if (timezone.includes('Kinshasa') || language.includes('CD')) {
      setCurrency('USD');
    } else if (timezone.includes('Dakar') || language.includes('SN')) {
      setCurrency('XOF');
    } else if (timezone.includes('Abidjan') || language.includes('CI')) {
      setCurrency('XOF');
    }
  }, [setCurrency]);
}
