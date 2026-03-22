// Système de gestion des devises pour M.O.N.A
// Adapté aux marchés africains : Kinshasa, Dakar, Abidjan

export type CurrencyCode = 'USD' | 'XOF' | 'XAF' | 'CDF';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  decimals: number;
}

export interface CityPreferences {
  city: string;
  country: string;
  primaryCurrency: CurrencyCode;
  secondaryCurrency?: CurrencyCode;
}

// Définition des devises disponibles
export const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Dollar américain',
    locale: 'en-US',
    decimals: 2,
  },
  XOF: {
    code: 'XOF',
    symbol: 'CFA',
    name: 'Franc CFA (UEMOA)',
    locale: 'fr-FR',
    decimals: 0,
  },
  XAF: {
    code: 'XAF',
    symbol: 'FCFA',
    name: 'Franc CFA (CEMAC)',
    locale: 'fr-FR',
    decimals: 0,
  },
  CDF: {
    code: 'CDF',
    symbol: 'FC',
    name: 'Franc congolais',
    locale: 'fr-CD',
    decimals: 0,
  },
};

// Préférences de devises par ville M.O.N.A
export const CITY_PREFERENCES: Record<string, CityPreferences> = {
  kinshasa: {
    city: 'Kinshasa',
    country: 'RD Congo',
    primaryCurrency: 'USD', // USD est principalement utilisé
    secondaryCurrency: 'CDF',
  },
  dakar: {
    city: 'Dakar',
    country: 'Sénégal',
    primaryCurrency: 'XOF',
    secondaryCurrency: 'USD',
  },
  abidjan: {
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    primaryCurrency: 'XOF',
    secondaryCurrency: 'USD',
  },
};

// Taux de change (mis à jour périodiquement)
// Base : 1 USD = X unités de devise
const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  XOF: 600, // 1 USD ≈ 600 XOF (fixe)
  XAF: 600, // 1 USD ≈ 600 XAF (fixe)
  CDF: 2800, // 1 USD ≈ 2800 CDF (variable)
};

/**
 * Convertit un montant d'une devise à une autre
 */
export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number {
  if (fromCurrency === toCurrency) return amount;

  // Convertir d'abord en USD
  const amountInUSD = amount / EXCHANGE_RATES[fromCurrency];
  
  // Puis convertir dans la devise cible
  const convertedAmount = amountInUSD * EXCHANGE_RATES[toCurrency];

  // Arrondir selon les décimales de la devise cible
  const decimals = CURRENCIES[toCurrency].decimals;
  return Math.round(convertedAmount * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Formate un montant selon la devise
 */
export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode,
  options?: {
    showSymbol?: boolean;
    showCode?: boolean;
    compact?: boolean;
  }
): string {
  const currency = CURRENCIES[currencyCode];
  const { showSymbol = true, showCode = false, compact = false } = options || {};

  // Format compact pour grands nombres (25K au lieu de 25,000)
  if (compact && amount >= 1000) {
    const compactValue = amount >= 1000000 
      ? `${(amount / 1000000).toFixed(1)}M`
      : `${(amount / 1000).toFixed(0)}K`;
    
    if (showSymbol) {
      return `${compactValue} ${currency.symbol}`;
    }
    return compactValue;
  }

  // Formatage standard
  const formatter = new Intl.NumberFormat(currency.locale, {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  });

  const formattedAmount = formatter.format(amount);

  // Construction du résultat
  let result = formattedAmount;
  
  if (showSymbol && showCode) {
    result = `${formattedAmount} ${currency.code}`;
  } else if (showSymbol) {
    // Pour CFA, placer le symbole après
    if (currencyCode === 'XOF' || currencyCode === 'XAF') {
      result = `${formattedAmount} ${currency.symbol}`;
    } else {
      result = `${currency.symbol}${formattedAmount}`;
    }
  } else if (showCode) {
    result = `${formattedAmount} ${currency.code}`;
  }

  return result;
}

/**
 * Détermine la devise préférée basée sur la localisation
 */
export function getPreferredCurrency(location?: string): CurrencyCode {
  if (!location) return 'USD';

  const locationLower = location.toLowerCase();

  if (locationLower.includes('kinshasa') || locationLower.includes('congo')) {
    return 'USD';
  }
  if (locationLower.includes('dakar') || locationLower.includes('sénégal')) {
    return 'XOF';
  }
  if (locationLower.includes('abidjan') || locationLower.includes('côte')) {
    return 'XOF';
  }

  return 'USD'; // Défaut
}

/**
 * Obtient les informations de devise pour une ville
 */
export function getCityPreferences(cityName: string): CityPreferences | null {
  const cityKey = cityName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return CITY_PREFERENCES[cityKey] || null;
}

/**
 * Convertit un montant dans toutes les devises principales
 */
export function convertToAllCurrencies(
  amount: number,
  fromCurrency: CurrencyCode
): Record<CurrencyCode, number> {
  return {
    USD: convertCurrency(amount, fromCurrency, 'USD'),
    XOF: convertCurrency(amount, fromCurrency, 'XOF'),
    XAF: convertCurrency(amount, fromCurrency, 'XAF'),
    CDF: convertCurrency(amount, fromCurrency, 'CDF'),
  };
}

/**
 * Prix de base des abonnements M.O.N.A en USD
 */
export const SUBSCRIPTION_PRICES_USD = {
  essentiel: 42, // ~25,000 XOF
  premium: 75, // ~45,000 XOF
  excellence: 125, // ~75,000 XOF
};

/**
 * Obtient le prix d'un abonnement dans la devise spécifiée
 */
export function getSubscriptionPrice(
  plan: keyof typeof SUBSCRIPTION_PRICES_USD,
  currency: CurrencyCode
): number {
  const priceUSD = SUBSCRIPTION_PRICES_USD[plan];
  return convertCurrency(priceUSD, 'USD', currency);
}
