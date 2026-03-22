import FooterSection from "@/app/components/FooterSection";
import { Shield, Lock, Eye, Database } from "lucide-react";
import NavigationBar from "@/app/components/NavigationBar";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: "Collecte des Données",
      content: "Nous collectons uniquement les informations nécessaires à la fourniture de nos services de santé mentale et de soins primaires. Vos données personnelles et médicales (antécédents, prescriptions, consultations psychologiques et médicales) sont traitées avec le plus haut niveau de confidentialité et conformément aux normes FHIR.",
    },
    {
      icon: Lock,
      title: "Sécurité & Chiffrement",
      content: "Toutes vos données sont chiffrées de bout en bout (E2E) selon les standards internationaux. Vos conversations avec les psychologues, psychiatres et médecins généralistes sont protégées par un chiffrement de niveau bancaire. Vos ordonnances et dossiers médicaux sont sécurisés dans votre passeport santé numérique.",
    },
    {
      icon: Eye,
      title: "Accès aux Données",
      content: "Vous seul et vos professionnels de santé (thérapeutes, psychiatres, médecins généralistes) ont accès à vos données médicales. M.O.N.A ne partage jamais vos informations personnelles ou médicales avec des tiers sans votre consentement explicite. Vos prescriptions médicales et données de santé restent strictement confidentielles.",
    },
    {
      icon: Shield,
      title: "Vos Droits RGPD",
      content: "Conformément au RGPD, vous avez le droit d'accéder, de modifier, de supprimer vos données ou de demander leur portabilité à tout moment via votre espace membre. Cela inclut vos dossiers médicaux, historique de consultations, prescriptions et toutes données de santé collectées.",
    },
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
              Politique de <span className="text-terracotta">Confidentialité</span>
            </h1>
            <p className="text-xl text-muted-foreground font-sans max-w-3xl mx-auto">
              Votre vie privée est notre priorité absolue. Découvrez comment nous protégeons
              vos données personnelles et médicales.
            </p>
            <p className="text-sm text-muted-foreground mt-4 font-sans">
              Dernière mise à jour : 26 Janvier 2026
            </p>
          </div>
        </div>
      </section>

      {/* Main Sections */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="space-y-8">
            {sections.map((section, idx) => {
              const Icon = section.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl border border-beige/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 p-3 bg-terracotta/10 rounded-xl">
                      <Icon className="w-6 h-6 text-terracotta" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif text-anthracite mb-4">{section.title}</h2>
                      <p className="text-muted-foreground font-sans leading-relaxed">{section.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact */}
          <div className="mt-12 bg-gradient-to-r from-beige/20 to-terracotta/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-serif text-anthracite mb-4">
              Questions sur votre confidentialité ?
            </h3>
            <p className="text-muted-foreground mb-6 font-sans">
              Notre délégué à la protection des données est à votre écoute.
            </p>
            <a
              href="mailto:privacy@monafrica.net"
              className="text-terracotta hover:underline font-sans"
            >
              privacy@monafrica.net
            </a>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}