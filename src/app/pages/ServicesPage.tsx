import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { Brain, Video, MessageCircle, Calendar, Shield, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export default function ServicesPage() {
  const services = [
    {
      icon: Video,
      title: "Consultations en Visioconférence",
      description: "Séances confidentielles avec nos experts certifiés, où que vous soyez",
      features: ["HD sécurisé", "Enregistrement chiffré", "Transcription IA"],
    },
    {
      icon: MessageCircle,
      title: "Chat Thérapeutique",
      description: "Échangez par message avec votre thérapeute entre les séances",
      features: ["Réponse sous 24h", "Historique sécurisé", "Mode urgent"],
    },
    {
      icon: Brain,
      title: "Outils d'Auto-Évaluation",
      description: "Suivez votre évolution avec nos questionnaires validés scientifiquement",
      features: ["Scores personnalisés", "Graphiques d'évolution", "Recommandations IA"],
    },
    {
      icon: Calendar,
      title: "Planification Intelligente",
      description: "Réservez facilement vos séances selon vos disponibilités",
      features: ["Rappels automatiques", "Synchronisation calendrier", "Reprogrammation facile"],
    },
    {
      icon: Shield,
      title: "Passeport Santé Numérique",
      description: "Vos données médicales sécurisées selon la norme FHIR internationale",
      features: ["Chiffrement E2E", "Conforme RGPD", "Portabilité complète"],
    },
    {
      icon: Zap,
      title: "Support d'Urgence",
      description: "Accès prioritaire en cas de crise ou besoin urgent",
      features: ["Ligne d'écoute 24/7", "Intervention rapide", "Suivi post-crise"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero - Compact */}
      <section className="pt-24 sm:pt-28 pb-8 sm:pb-12 bg-gradient-to-b from-beige/10 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-3 sm:mb-4">
              Nos <span className="text-terracotta">Services</span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-sans max-w-3xl mx-auto px-4">
              Une gamme complète de services de santé mentale adaptés à vos besoins,
              disponibles dans plusieurs villes d'Afrique francophone.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid - Compact */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl border border-beige/30 hover:border-terracotta/30 hover:shadow-xl transition-all duration-300"
                >
                  <div className="mb-3 sm:mb-4 inline-flex p-2.5 sm:p-3 bg-terracotta/10 rounded-lg">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-terracotta" />
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-serif text-anthracite mb-2 sm:mb-3">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans mb-3 sm:mb-4">{service.description}</p>
                  <ul className="space-y-1 sm:space-y-1.5">
                    {service.features.map((feature, fidx) => (
                      <li key={fidx} className="flex items-center gap-2 text-xs sm:text-sm font-sans">
                        <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-terracotta flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-8 sm:mt-12 text-center">
            <Link 
              to="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl font-sans text-sm sm:text-base"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}