import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import NFCCardSection from "@/app/components/NFCCardSection";
import { CreditCard, Package, Plane, CheckCircle } from "lucide-react";

export default function CardPage() {
  const deliverySteps = [
    {
      icon: CreditCard,
      title: "Commande",
      description: "Souscrivez à un abonnement membre et commandez votre carte",
    },
    {
      icon: Package,
      title: "Fabrication",
      description: "Votre carte est fabriquée avec votre nom gravé à l'or",
    },
    {
      icon: Plane,
      title: "Livraison",
      description: "Réception sécurisée sous 7-10 jours à Kinshasa, Dakar ou Abidjan",
    },
    {
      icon: CheckCircle,
      title: "Activation",
      description: "Activez votre carte via l'app et profitez de tous vos privilèges",
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
              Carte <span className="text-terracotta">Membre Premium</span>
            </h1>
            <p className="text-xl text-muted-foreground font-sans max-w-3xl mx-auto">
              Votre passeport physique vers l'excellence. Une carte NFC en métal brossé or
              qui ouvre les portes de tous vos privilèges M.O.N.A
            </p>
          </div>
        </div>
      </section>

      {/* Card Section */}
      <NFCCardSection />

      {/* Delivery Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-4xl font-serif text-anthracite text-center mb-12">
            Comment obtenir votre carte ?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {deliverySteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="text-center">
                  <div className="mb-4 inline-flex p-4 bg-terracotta/10 rounded-full">
                    <Icon className="w-8 h-8 text-terracotta" />
                  </div>
                  <h3 className="text-xl font-serif text-anthracite mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground font-sans">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}