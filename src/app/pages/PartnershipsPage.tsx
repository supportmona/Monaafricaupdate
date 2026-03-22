import FooterSection from "@/app/components/FooterSection";
import { Handshake, Building2, Sparkles, TrendingUp } from "lucide-react";
import NavigationBar from "@/app/components/NavigationBar";

export default function PartnershipsPage() {
  const partnerTypes = [
    {
      icon: Building2,
      title: "Entreprises & Organisations",
      description: "Intégrez M.O.N.A dans votre package bien-être employés",
      benefits: ["Tarifs préférentiels", "Déploiement sur mesure", "Formation des équipes"],
    },
    {
      icon: Sparkles,
      title: "Studios & Spas",
      description: "Rejoignez le réseau premium du Cercle M.O.N.A",
      benefits: ["Visibilité accrue", "Clientèle qualifiée", "Commission attractive"],
    },
    {
      icon: TrendingUp,
      title: "Investisseurs & Fondations",
      description: "Soutenez l'innovation en santé mentale en Afrique",
      benefits: ["Impact social mesurable", "Croissance rapide", "Vision long terme"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-beige/10 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl font-serif text-anthracite mb-6">
              <span className="text-terracotta">Partenariats</span> Stratégiques
            </h1>
            <p className="text-xl text-muted-foreground font-sans max-w-3xl mx-auto">
              Construisons ensemble l'avenir de la santé mentale en Afrique.
              Découvrez nos opportunités de collaboration à fort impact.
            </p>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {partnerTypes.map((type, idx) => {
              const Icon = type.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-2xl border border-beige/30 hover:border-terracotta/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="mb-6 inline-flex p-4 bg-terracotta/10 rounded-xl">
                    <Icon className="w-8 h-8 text-terracotta" />
                  </div>
                  <h3 className="text-2xl font-serif text-anthracite mb-4">{type.title}</h3>
                  <p className="text-muted-foreground font-sans mb-6">{type.description}</p>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, bidx) => (
                      <li key={bidx} className="flex items-center gap-2 text-sm font-sans">
                        <div className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-r from-beige/20 to-terracotta/10 rounded-2xl p-12 text-center">
            <Handshake className="w-16 h-16 text-terracotta mx-auto mb-6" />
            <h2 className="text-3xl font-serif text-anthracite mb-4">
              Devenons Partenaires
            </h2>
            <p className="text-lg text-muted-foreground mb-8 font-sans max-w-2xl mx-auto">
              Contactez notre équipe partenariats pour discuter des opportunités
              de collaboration adaptées à votre organisation.
            </p>
            <button className="px-8 py-4 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl font-sans">
              Nous contacter
            </button>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}