import { Badge } from "@/app/components/ui/badge";
import { CurrencyCode, CURRENCIES } from "@/app/utils/currency";

interface CurrencyBadgeProps {
  currency: CurrencyCode;
  className?: string;
}

/**
 * Badge affichant une devise avec son code et symbole
 * Avec couleurs adaptées à la palette M.O.N.A
 */
export default function CurrencyBadge({ currency, className = "" }: CurrencyBadgeProps) {
  const currencyInfo = CURRENCIES[currency];

  // Couleurs adaptées à la palette M.O.N.A
  const colorClasses: Record<CurrencyCode, string> = {
    USD: "bg-gold/20 text-gold-dark border-gold/30",
    XOF: "bg-terracotta/20 text-terracotta border-terracotta/30",
    XAF: "bg-beige/40 text-anthracite border-beige",
    CDF: "bg-anthracite/10 text-anthracite border-anthracite/20",
  };

  return (
    <Badge 
      variant="outline" 
      className={`font-sans text-xs ${colorClasses[currency]} ${className}`}
    >
      {currencyInfo.symbol} {currency}
    </Badge>
  );
}
