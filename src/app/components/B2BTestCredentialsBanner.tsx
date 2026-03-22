import { Info } from 'lucide-react';

interface B2BTestCredentialsBannerProps {
  onSelectAccount: (index: number) => void;
}

export default function B2BTestCredentialsBanner({ onSelectAccount }: B2BTestCredentialsBannerProps) {
  const testAccounts = [
    {
      company: 'Ekolo Tech',
      description: 'Multi-sites (Afrique francophone)',
      employees: 113,
      email: 'rh@ekolo-tech.com',
    },
    {
      company: 'Bantu Finance',
      description: 'Kinshasa uniquement',
      employees: 87,
      email: 'hr@bantu-finance.com',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-blue-900 mb-1 font-sans">
            Comptes de démonstration disponibles
          </h3>
          <p className="text-sm text-blue-700 font-sans">
            Testez le dashboard B2B avec des données réalistes. Mot de passe : <code className="px-2 py-0.5 bg-blue-100 rounded">MonaB2B2024!</code>
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {testAccounts.map((account, idx) => (
          <button
            key={idx}
            onClick={() => onSelectAccount(idx)}
            className="text-left p-4 bg-white rounded-lg border-2 border-blue-200 hover:border-terracotta hover:shadow-md transition-all"
          >
            <div className="font-semibold text-anthracite mb-1 font-sans">{account.company}</div>
            <div className="text-xs text-muted-foreground mb-2 font-sans">{account.description}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-600 font-mono">{account.email}</span>
              <span className="px-2 py-0.5 bg-beige/30 text-anthracite text-xs rounded-full font-sans">
                {account.employees} emp.
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}