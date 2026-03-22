import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { MapPin, Star, Sparkles, ExternalLink, Phone, Mail, ChevronLeft, Activity, Waves, Leaf, UtensilsCrossed, Bed, Sunrise, Car, Wifi } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export default function CasaDelToroPage() {
  const images = [
    "https://images.unsplash.com/photo-1602002418082-a4443e081dd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  ];

  const amenities = [
    { icon: Activity, label: "Équitation & Balades à cheval" },
    { icon: Waves, label: "Piscine à débordement" },
    { icon: Leaf, label: "Jardins tropicaux" },
    { icon: UtensilsCrossed, label: "Restaurant gastronomique" },
    { icon: Bed, label: "12 Suites de luxe" },
    { icon: Sunrise, label: "Vue panoramique" },
    { icon: Car, label: "Parking privé" },
    { icon: Wifi, label: "WiFi haut débit" },
  ];

  const activities = [
    { name: "Cours d'équitation privé", duration: "1h30", price: "Sur demande" },
    { name: "Balade à cheval au coucher du soleil", duration: "2h", price: "Sur demande" },
    { name: "Massage en plein air", duration: "1h", price: "Sur demande" },
    { name: "Dîner romantique sous les étoiles", duration: "Soirée", price: "Sur demande" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Bouton Retour */}
      <div className="pt-24 sm:pt-28 pb-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/cercle"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-terracotta transition-colors duration-200 font-sans"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Retour au Cercle</span>
          </Link>
        </div>
      </div>

      {/* Hero Image avec Gallery */}
      <section className="bg-white pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Image principale */}
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={images[0]}
                alt="Casa Del Toro"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-terracotta/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-sm font-sans text-white">Escapades</span>
              </div>
            </div>

            {/* Images secondaires */}
            <div className="hidden lg:grid grid-rows-2 gap-4">
              {images.slice(1).map((img, idx) => (
                <div key={idx} className="relative h-full rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src={img}
                    alt={`Casa Del Toro ${idx + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contenu Principal */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Colonne Principale */}
            <div className="lg:col-span-2 space-y-8">
              {/* En-tête */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-2">
                      Casa Del Toro
                    </h1>
                    <p className="text-lg text-terracotta font-sans mb-2">Luxury Ranch</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-sans">Saly, Sénégal</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gold/10 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <span className="text-sm font-sans font-semibold text-gold">4.9</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-beige/20 text-foreground rounded-full text-sm font-sans">
                    Équitation
                  </span>
                  <span className="px-3 py-1.5 bg-beige/20 text-foreground rounded-full text-sm font-sans">
                    Nature
                  </span>
                  <span className="px-3 py-1.5 bg-beige/20 text-foreground rounded-full text-sm font-sans">
                    Piscine
                  </span>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-serif text-anthracite mb-4">À propos</h2>
                <div className="space-y-4 text-foreground font-sans leading-relaxed">
                  <p>
                    Nichée au cœur de la Petite Côte sénégalaise, Casa Del Toro est bien plus qu'un simple
                    hôtel : c'est une hacienda authentique où le luxe rencontre la nature. Dans un cadre
                    verdoyant de 5 hectares, cette propriété exclusive allie le charme d'un ranch équestre
                    à l'élégance d'une retraite de bien-être.
                  </p>
                  <p>
                    Chaque suite a été pensée pour offrir un confort optimal tout en préservant l'authenticité
                    des lieux. Les matériaux nobles (bois, pierre naturelle, textiles artisanaux) créent une
                    atmosphère chaleureuse et apaisante.
                  </p>
                  <p>
                    L'expérience équestre est au cœur de Casa Del Toro : que vous soyez cavalier débutant ou
                    confirmé, les moniteurs diplômés vous accompagnent dans des balades inoubliables sur la
                    plage ou à travers les sentiers bordés de baobabs.
                  </p>
                </div>
              </motion.div>

              {/* Équipements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-serif text-anthracite mb-4">Équipements & Services</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm font-sans text-foreground">
                      <amenity.icon className="w-4 h-4" />
                      <span>{amenity.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Activités */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-serif text-anthracite mb-4">Activités Proposées</h2>
                <div className="space-y-3">
                  {activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-beige/10 rounded-lg border border-beige/30"
                    >
                      <div>
                        <p className="font-sans font-semibold text-foreground">{activity.name}</p>
                        <p className="text-sm text-muted-foreground font-sans">{activity.duration}</p>
                      </div>
                      <span className="text-sm font-sans text-terracotta">{activity.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Réservation */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-28 bg-white border-2 border-beige/30 rounded-2xl p-6 space-y-6"
              >
                {/* Avantage M.O.N.A */}
                <div className="bg-gradient-to-br from-gold/10 to-terracotta/10 border-2 border-gold/20 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="w-6 h-6 text-gold flex-shrink-0" />
                    <div>
                      <p className="font-sans font-bold text-anthracite mb-1">Avantage Membre M.O.N.A</p>
                      <p className="text-sm font-sans text-foreground">
                        Surclassement offert + Cocktail de bienvenue
                      </p>
                    </div>
                  </div>
                </div>

                {/* Prix indicatif */}
                <div className="border-t border-beige/30 pt-6">
                  <p className="text-sm text-muted-foreground font-sans mb-2">À partir de</p>
                  <p className="text-3xl font-serif text-anthracite mb-1">150 000 FCFA</p>
                  <p className="text-sm text-muted-foreground font-sans">par nuit</p>
                </div>

                {/* Bouton CTA Principal */}
                <a
                  href="https://casadeltoro.sn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl font-sans"
                >
                  <span>Réserver sur le site officiel</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Contact */}
                <div className="space-y-3">
                  <button className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border-2 border-beige text-anthracite rounded-lg hover:bg-beige/10 transition-all duration-200 font-sans">
                    <Phone className="w-4 h-4" />
                    <span>Appeler</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border-2 border-beige text-anthracite rounded-lg hover:bg-beige/10 transition-all duration-200 font-sans">
                    <Mail className="w-4 h-4" />
                    <span>Envoyer un message</span>
                  </button>
                </div>

                {/* Info */}
                <div className="border-t border-beige/30 pt-6">
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                    Réservation directe avec notre partenaire. Mentionnez votre statut de Membre M.O.N.A
                    lors de votre réservation pour bénéficier des avantages exclusifs.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}