import FooterSection from "@/app/components/FooterSection";
import { Shield, Check } from "lucide-react";
import NavigationBar from "@/app/components/NavigationBar";

export default function GDPRPage() {
  const rights = [
    {
      title: "Droit d'Accès",
      description: "Vous pouvez demander une copie de toutes vos données personnelles que nous détenons.",
    },
    {
      title: "Droit de Rectification",
      description: "Vous pouvez corriger vos données inexactes ou incomplètes à tout moment.",
    },
    {
      title: "Droit à l'Effacement",
      description: "Vous pouvez demander la suppression de vos données personnelles (sous réserve de nos obligations légales).",
    },
    {
      title: "Droit à la Portabilité",
      description: "Vous pouvez recevoir vos données dans un format structuré et les transférer à un autre service.",
    },
    {
      title: "Droit d'Opposition",
      description: "Vous pouvez vous opposer au traitement de vos données à des fins de marketing ou de profilage.",
    },
    {
      title: "Droit à la Limitation",
      description: "Vous pouvez demander la limitation du traitement de vos données dans certaines circonstances.",
    },
  ];

  const measures = [
    "Chiffrement de bout en bout (E2E) pour toutes les communications médicales",
    "Hébergement sécurisé avec certifications internationales (conformité FHIR)",
    "Audits de sécurité réguliers par des tiers indépendants",
    "Formation continue de notre équipe aux bonnes pratiques RGPD",
    "Procédures strictes de contrôle d'accès aux dossiers médicaux",
    "Plan de réponse aux incidents de sécurité",
    "Pseudonymisation et anonymisation des données de santé pour les statistiques",
    "Protection spéciale des prescriptions médicales et ordonnances",
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-beige/10 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 text-terracotta mx-auto mb-6" />
            <h1 className="text-5xl lg:text-6xl font-serif text-anthracite mb-6">
              Conformité <span className="text-terracotta">RGPD</span>
            </h1>
            <p className="text-xl text-muted-foreground font-sans max-w-3xl mx-auto">
              M.O.N.A est entièrement conforme au Règlement Général sur la Protection
              des Données (RGPD) et aux réglementations locales africaines.
            </p>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-serif text-anthracite text-center mb-12">
            Vos Droits RGPD
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rights.map((right, idx) => (
              <div
                key={idx}
                className="p-6 bg-gradient-to-b from-beige/5 to-transparent rounded-2xl border border-beige/30"
              >
                <div className="mb-4 inline-flex p-2 bg-terracotta/10 rounded-lg">
                  <Check className="w-6 h-6 text-terracotta" />
                </div>
                <h3 className="text-xl font-serif text-anthracite mb-3">{right.title}</h3>
                <p className="text-sm text-muted-foreground font-sans">{right.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-beige/30 p-8 lg:p-12">
            <h2 className="text-3xl font-serif text-anthracite mb-6 text-center">
              Nos Mesures de Sécurité
            </h2>
            <p className="text-muted-foreground font-sans mb-8 text-center">
              M.O.N.A met en œuvre des mesures techniques et organisationnelles
              robustes pour protéger vos données :
            </p>
            <ul className="space-y-4">
              {measures.map((measure, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-terracotta flex-shrink-0 mt-0.5" />
                  <span className="text-foreground font-sans">{measure}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exercise Rights */}
          <div className="mt-12 bg-gradient-to-r from-beige/20 to-terracotta/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-serif text-anthracite mb-4">
              Exercer Vos Droits
            </h3>
            <p className="text-muted-foreground mb-6 font-sans max-w-2xl mx-auto">
              Pour exercer l'un de vos droits RGPD, contactez notre délégué à la protection
              des données ou utilisez les options disponibles dans votre espace membre.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:dpo@monafrica.net"
                className="px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-sans"
              >
                Contacter le DPO
              </a>
              <a
                href="#"
                className="px-8 py-3 bg-white border-2 border-beige text-anthracite rounded-lg hover:bg-beige/10 transition-all duration-200 font-sans"
              >
                Mon espace membre
              </a>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}