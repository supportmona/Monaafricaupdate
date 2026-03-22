/**
 * Composant de debug pour vérifier que le code à jour est bien chargé
 * Affiche un badge en bas à droite avec la version du build
 */

export default function DebugVersion() {
  const BUILD_DATE = "2026-03-16 15:30";
  const BUILD_VERSION = "v2.2-mock-data-fixed";
  
  // Uniquement en dev
  if (import.meta.env.PROD) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 text-white px-3 py-2 rounded-lg text-xs font-mono shadow-2xl border border-white/20">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <div>
          <div className="font-bold">{BUILD_VERSION}</div>
          <div className="text-white/60">{BUILD_DATE}</div>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-white/20 space-y-1">
        <div className="text-green-400">✓ Auth B2B fixed</div>
        <div className="text-green-400">✓ Mock data added</div>
        <div className="text-green-400">✓ No fetch errors</div>
        <div className="text-white/40 text-[10px]">
          Mode démonstration actif
        </div>
      </div>
    </div>
  );
}