import { Info, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { CITY_PREFERENCES, CURRENCIES } from "@/app/utils/currency";

/**
 * Panneau informatif sur les devises utilisées par M.O.N.A
 * selon les différentes villes africaines
 */
export default function CurrencyInfoPanel() {
  return (
    <Card className="border-beige/30 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-anthracite">
          <Info className="w-5 h-5 text-terracotta" />
          Devises par localisation
        </CardTitle>
        <CardDescription>
          M.O.N.A s'adapte aux préférences de paiement locales
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.values(CITY_PREFERENCES).map((cityPref, idx) => (
          <div 
            key={idx} 
            className="flex items-start gap-3 p-3 rounded-lg bg-beige/10 hover:bg-beige/20 transition-colors"
          >
            <MapPin className="w-4 h-4 text-terracotta mt-1 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-anthracite text-sm">
                {cityPref.city}, {cityPref.country}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <span className="font-medium">Principale : </span>
                {CURRENCIES[cityPref.primaryCurrency].name} ({cityPref.primaryCurrency})
              </div>
              {cityPref.secondaryCurrency && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Secondaire : </span>
                  {CURRENCIES[cityPref.secondaryCurrency].name} ({cityPref.secondaryCurrency})
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="mt-4 pt-4 border-t border-beige/30">
          <div className="text-xs text-muted-foreground space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-terracotta">•</span>
              <span>USD principalement accepté à Kinshasa pour les transactions commerciales</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-terracotta">•</span>
              <span>XOF (Franc CFA) utilisé à Dakar et Abidjan dans l'espace UEMOA</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-terracotta">•</span>
              <span>Paiements Mobile Money acceptés : Wave, Orange Money, M-Pesa</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
