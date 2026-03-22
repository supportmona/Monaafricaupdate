import FooterSection from "@/app/components/FooterSection";
import { FileText } from "lucide-react";
import NavigationBar from "@/app/components/NavigationBar";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptation des Conditions",
      content: "En utilisant M.O.N.A, vous acceptez ces conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.",
    },
    {
      title: "2. Services Proposés",
      content: "M.O.N.A fournit une plateforme de mise en relation avec des professionnels de santé mentale et de médecine générale certifiés et agréés. Nos services incluent : consultations psychologiques, consultations psychiatriques, consultations de médecine générale, prescriptions médicales, téléconsultations sécurisées, passeport santé numérique FHIR, et accès au Cercle M.O.N.A pour les membres premium.",
    },
    {
      title: "3. Responsabilités de l'Utilisateur",
      content: "Vous vous engagez à fournir des informations médicales exactes et complètes, à respecter les professionnels de santé et les autres utilisateurs, à suivre les prescriptions médicales reçues de manière responsable, et à utiliser la plateforme conformément aux lois en vigueur à Kinshasa, Dakar et Abidjan.",
    },
    {
      title: "4. Tarifs et Paiements",
      content: "Les tarifs sont indiqués en XOF (franc CFA) et USD avec possibilité de basculer entre les devises. Les paiements peuvent être effectués par Mobile Money (Wave, Orange Money, MTN Mobile Money) ou carte bancaire. Les abonnements sont renouvelables mensuellement sauf annulation.",
    },
    {
      title: "5. Annulation et Remboursement",
      content: "Vous pouvez annuler votre abonnement à tout moment. Les remboursements sont traités selon notre politique de remboursement disponible dans le Centre d'Aide. Les séances annulées moins de 24h à l'avance ne sont pas remboursables.",
    },
    {
      title: "6. Actes Médicaux et Prescriptions",
      content: "Les actes médicaux et prescriptions délivrés par nos médecins généralistes, psychiatres et psychologues relèvent de leur responsabilité professionnelle individuelle. M.O.N.A agit uniquement comme plateforme de mise en relation. Les professionnels de santé sont tous dûment agréés dans leur pays d'exercice (RDC, Sénégal, Côte d'Ivoire).",
    },
    {
      title: "7. Propriété Intellectuelle",
      content: "Tous les contenus de M.O.N.A (logo, design, textes, algorithmes de Score Mental, etc.) sont protégés par le droit d'auteur et déposés auprès de l'OAPI. Toute reproduction non autorisée est interdite.",
    },
    {
      title: "8. Limitation de Responsabilité",
      content: "M.O.N.A agit comme intermédiaire entre vous et les professionnels de santé. Nous ne sommes pas responsables des conseils médicaux, diagnostics ou prescriptions fournis par les médecins et thérapeutes. En cas d'urgence médicale ou psychiatrique, contactez immédiatement les services d'urgence locaux (112 en RDC, 15 au Sénégal, 185 en Côte d'Ivoire).",
    },
    {
      title: "9. Modifications des CGU",
      content: "Nous nous réservons le droit de modifier ces conditions à tout moment. Vous serez notifié des changements importants par email ou via l'application. L'utilisation continue de nos services après modification constitue votre acceptation des nouvelles conditions.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-beige/10 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <FileText className="w-16 h-16 text-terracotta mx-auto mb-6" />
            <h1 className="text-5xl lg:text-6xl font-serif text-anthracite mb-6">
              Conditions Générales d'<span className="text-terracotta">Utilisation</span>
            </h1>
            <p className="text-xl text-muted-foreground font-sans max-w-3xl mx-auto">
              Veuillez lire attentivement ces conditions avant d'utiliser nos services.
            </p>
            <p className="text-sm text-muted-foreground mt-4 font-sans">
              Dernière mise à jour : 26 Janvier 2026
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-beige/30 p-8 lg:p-12">
            <div className="space-y-8">
              {sections.map((section, idx) => (
                <div key={idx}>
                  <h2 className="text-2xl font-serif text-anthracite mb-4">{section.title}</h2>
                  <p className="text-muted-foreground font-sans leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-12 pt-8 border-t border-beige/30">
              <h3 className="text-xl font-serif text-anthracite mb-4">Contact Juridique</h3>
              <p className="text-muted-foreground font-sans">
                Pour toute question concernant ces conditions générales, contactez-nous à :
                <a href="mailto:legal@monafrica.net" className="text-terracotta hover:underline ml-2">
                  legal@monafrica.net
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}