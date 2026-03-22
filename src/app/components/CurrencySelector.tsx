import { DollarSign } from 'lucide-react';
import { CURRENCIES, CurrencyCode } from '@/app/utils/currency';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

interface CurrencySelectorProps {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
  className?: string;
  compact?: boolean;
}

export default function CurrencySelector({
  value,
  onChange,
  className = '',
  compact = false,
}: CurrencySelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger 
        className={`${compact ? 'w-32' : 'w-48'} ${className}`}
        aria-label="Sélectionner la devise"
      >
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-terracotta" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="USD">
          <div className="flex flex-col items-start">
            <span className="font-medium">{CURRENCIES.USD.symbol} {CURRENCIES.USD.code}</span>
            {!compact && <span className="text-xs text-muted-foreground">{CURRENCIES.USD.name}</span>}
          </div>
        </SelectItem>
        <SelectItem value="XOF">
          <div className="flex flex-col items-start">
            <span className="font-medium">{CURRENCIES.XOF.symbol} XOF</span>
            {!compact && <span className="text-xs text-muted-foreground">Dakar, Abidjan</span>}
          </div>
        </SelectItem>
        <SelectItem value="XAF">
          <div className="flex flex-col items-start">
            <span className="font-medium">{CURRENCIES.XAF.symbol} XAF</span>
            {!compact && <span className="text-xs text-muted-foreground">Franc CFA CEMAC</span>}
          </div>
        </SelectItem>
        <SelectItem value="CDF">
          <div className="flex flex-col items-start">
            <span className="font-medium">{CURRENCIES.CDF.symbol} CDF</span>
            {!compact && <span className="text-xs text-muted-foreground">Franc congolais</span>}
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
