import { Info } from "lucide-react";
import { CurrencyCode, formatCurrency, getCityPreferences } from "@/app/utils/currency";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";
import CurrencyBadge from "@/app/components/CurrencyBadge";

interface SmartCurrencyDisplayProps {
  amount: number;
  currency: CurrencyCode;
  location?: string;
  showBadge?: boolean;
  showTooltip?: boolean;
  className?: string;
}

/**
 * Composant d'affichage intelligent de devise
 * Affiche le montant dans la devise appropriée selon la localisation
 * Avec tooltip informatif sur les préférences de devise par ville
 */
export default function SmartCurrencyDisplay({
  amount,
  currency,
  location,
  showBadge = false,
  showTooltip = true,
  className = "",
}: SmartCurrencyDisplayProps) {
  const formattedAmount = formatCurrency(amount, currency, { showSymbol: true, compact: true });

  // Obtenir les préférences de devise pour la ville
  let cityInfo = null;
  if (location) {
    const cityName = location.split(',')[0].trim();
    cityInfo = getCityPreferences(cityName);
  }

  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-semibold">{formattedAmount}</span>
      {showBadge && <CurrencyBadge currency={currency} />}
      {showTooltip && cityInfo && (
        <Info className="w-4 h-4 text-muted-foreground cursor-help" />
      )}
    </div>
  );

  if (showTooltip && cityInfo) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <div className="space-y-2">
              <div className="font-semibold">{cityInfo.city}, {cityInfo.country}</div>
              <div className="text-xs">
                <div>Devise principale : <span className="font-medium">{cityInfo.primaryCurrency}</span></div>
                {cityInfo.secondaryCurrency && (
                  <div>Devise secondaire : <span className="font-medium">{cityInfo.secondaryCurrency}</span></div>
                )}
              </div>
              {cityInfo.city === "Kinshasa" && (
                <div className="text-xs text-muted-foreground italic mt-2">
                  USD principalement utilisé à Kinshasa pour les transactions commerciales
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}