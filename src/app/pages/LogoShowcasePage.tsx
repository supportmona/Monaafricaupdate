import { Logo, LogoSVG, LogoIcon } from "@/app/components/Logo";

export default function LogoShowcasePage() {
  return (
    <div className="min-h-screen bg-background py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-serif text-anthracite mb-4">
            Logos M.O.N.A
          </h1>
          <p className="text-lg text-muted-foreground">
            Déclinaisons du logo de la plateforme
          </p>
        </div>

        <div className="space-y-16">
          {/* Logo principal - Tailles */}
          <section className="bg-white rounded-xl p-8 border border-beige/30">
            <h2 className="text-2xl font-serif text-anthracite mb-6">
              Logo principal - Variantes de taille
            </h2>
            <div className="space-y-8">
              <div className="flex items-center gap-8 flex-wrap">
                <div className="flex flex-col items-center gap-3">
                  <Logo size="sm" />
                  <span className="text-xs text-muted-foreground">Small</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Logo size="md" />
                  <span className="text-xs text-muted-foreground">Medium (défaut)</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Logo size="lg" />
                  <span className="text-xs text-muted-foreground">Large</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Logo size="xl" />
                  <span className="text-xs text-muted-foreground">Extra Large</span>
                </div>
              </div>
            </div>
          </section>

          {/* Logo avec tagline */}
          <section className="bg-white rounded-xl p-8 border border-beige/30">
            <h2 className="text-2xl font-serif text-anthracite mb-6">
              Logo avec tagline
            </h2>
            <div className="space-y-8">
              <div className="flex items-center gap-12 flex-wrap">
                <Logo size="md" showTagline />
                <Logo size="lg" showTagline />
                <Logo size="xl" showTagline />
              </div>
            </div>
          </section>

          {/* Variantes de couleur */}
          <section className="space-y-6">
            <h2 className="text-2xl font-serif text-anthracite mb-6">
              Variantes de couleur
            </h2>
            
            {/* Variante par défaut */}
            <div className="bg-white rounded-xl p-8 border border-beige/30">
              <div className="mb-3 text-sm font-medium text-anthracite">Défaut</div>
              <Logo size="lg" showTagline />
            </div>

            {/* Variante blanche */}
            <div className="bg-anthracite rounded-xl p-8">
              <div className="mb-3 text-sm font-medium text-white">Blanc (pour fonds sombres)</div>
              <Logo size="lg" variant="white" showTagline />
            </div>

            {/* Variante or */}
            <div className="bg-beige/30 rounded-xl p-8">
              <div className="mb-3 text-sm font-medium text-anthracite">Or</div>
              <Logo size="lg" variant="gold" showTagline />
            </div>

            {/* Variante compacte */}
            <div className="bg-white rounded-xl p-8 border border-beige/30">
              <div className="mb-3 text-sm font-medium text-anthracite">Compact (sans points)</div>
              <Logo variant="compact" size="lg" />
            </div>
          </section>

          {/* Logo SVG */}
          <section className="bg-white rounded-xl p-8 border border-beige/30">
            <h2 className="text-2xl font-serif text-anthracite mb-6">
              Version SVG (pour export)
            </h2>
            <div className="space-y-6">
              <div className="flex items-center gap-8 flex-wrap">
                <div className="flex flex-col items-center gap-3">
                  <LogoSVG variant="default" width={120} height={40} />
                  <span className="text-xs text-muted-foreground">Défaut</span>
                </div>
                <div className="flex flex-col items-center gap-3 bg-anthracite p-4 rounded-lg">
                  <LogoSVG variant="white" width={120} height={40} />
                  <span className="text-xs text-white">Blanc</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <LogoSVG variant="gold" width={120} height={40} />
                  <span className="text-xs text-muted-foreground">Or</span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="mb-3 text-sm font-medium text-anthracite">Avec tagline</div>
                <LogoSVG variant="default" width={200} height={60} showTagline />
              </div>
            </div>
          </section>

          {/* Icône seule */}
          <section className="bg-white rounded-xl p-8 border border-beige/30">
            <h2 className="text-2xl font-serif text-anthracite mb-6">
              Icône circulaire (pour favicon, app icon)
            </h2>
            <div className="flex items-center gap-8 flex-wrap">
              <div className="flex flex-col items-center gap-3">
                <LogoIcon size={40} variant="default" />
                <span className="text-xs text-muted-foreground">40px</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <LogoIcon size={64} variant="default" />
                <span className="text-xs text-muted-foreground">64px</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <LogoIcon size={96} variant="default" />
                <span className="text-xs text-muted-foreground">96px</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <LogoIcon size={64} variant="white" />
                <span className="text-xs text-muted-foreground">Blanc</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <LogoIcon size={64} variant="gold" />
                <span className="text-xs text-muted-foreground">Or</span>
              </div>
            </div>
          </section>

          {/* Exemples d'utilisation */}
          <section className="bg-beige/20 rounded-xl p-8">
            <h2 className="text-2xl font-serif text-anthracite mb-6">
              Exemples d'utilisation dans le code
            </h2>
            <div className="space-y-4 font-mono text-sm">
              <div className="bg-white rounded-lg p-4 border border-beige/30">
                <div className="text-xs text-muted-foreground mb-2">Logo par défaut</div>
                <code className="text-anthracite">&lt;Logo /&gt;</code>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-beige/30">
                <div className="text-xs text-muted-foreground mb-2">Logo blanc avec tagline</div>
                <code className="text-anthracite">&lt;Logo variant="white" size="lg" showTagline /&gt;</code>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-beige/30">
                <div className="text-xs text-muted-foreground mb-2">Logo compact</div>
                <code className="text-anthracite">&lt;Logo variant="compact" size="sm" /&gt;</code>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-beige/30">
                <div className="text-xs text-muted-foreground mb-2">Icône</div>
                <code className="text-anthracite">&lt;LogoIcon size={"{"}64{"}"} variant="default" /&gt;</code>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
