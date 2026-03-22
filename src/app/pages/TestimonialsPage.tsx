import FooterSection from "@/app/components/FooterSection";
import { Star, Quote } from "lucide-react";
import NavigationBar from "@/app/components/NavigationBar";

export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "Marie K.",
      role: "Entrepreneuse, Kinshasa",
      rating: 5,
      text: "M.O.N.A a transformé ma vie professionnelle. Le Smart Matching m'a connectée avec une thérapeute qui comprend vraiment mes défis en tant que femme d'affaires africaine.",
      avatar: "MK",
    },
    {
      name: "Amadou D.",
      role: "Cadre RH, Dakar",
      rating: 5,
      text: "Nous avons intégré M.O.N.A dans notre entreprise. L'impact sur le bien-être de nos équipes est mesurable et le dashboard anonymisé respecte parfaitement la confidentialité.",
      avatar: "AD",
    },
    {
      name: "Sophie A.",
      role: "Étudiante, Abidjan",
      rating: 5,
      text: "Accessible même avec une connexion instable grâce au mode offline. Les tarifs sont adaptés et le support par chat m'aide vraiment entre les séances.",
      avatar: "SA",
    },
    {
      name: "Jean-Paul M.",
      role: "Directeur, Kinshasa",
      rating: 5,
      text: "Le Cercle M.O.N.A offre des privilèges exceptionnels. Les escapades wellness ont permis à mon équipe de se ressourcer dans des lieux d'exception.",
      avatar: "JPM",
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
              Témoignages <span className="text-terracotta">Authentiques</span>
            </h1>
            <p className="text-xl text-muted-foreground font-sans max-w-3xl mx-auto">
              Découvrez comment M.O.N.A transforme la vie de nos membres à travers l'Afrique.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-beige/30 hover:border-terracotta/30 hover:shadow-xl transition-all duration-300 relative"
              >
                <Quote className="w-12 h-12 text-terracotta/20 absolute top-6 right-6" />
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center">
                    <span className="text-lg font-serif text-terracotta">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-anthracite">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground font-sans">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, sidx) => (
                    <Star key={sidx} className="w-5 h-5 text-gold fill-gold" />
                  ))}
                </div>

                <p className="text-muted-foreground font-sans italic leading-relaxed">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}