import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { MapPin, Star, Sparkles, ExternalLink, Phone, Mail, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

export default function MaisonAkoulaPage() {
  const images = [
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  ];

  const amenities = [
    { icon: MapPin, label: "Restaurant gastronomique" },
    { icon: MapPin, label: "Fruits de mer frais" },
    { icon: MapPin, label: "Spa avec soins locaux" },
    { icon: MapPin, label: "Piscine à débordement" },
    { icon: MapPin, label: "Excursions en bateau" },
    { icon: MapPin, label: "Pêche sportive" },
  ];

  const activities = [
    { name: "Excursion en pirogue sur la lagune", duration: "2h", price: "Sur demande" },
    { name: "Journée plage & fruits de mer", duration: "Journée", price: "Sur demande" },
    { name: "Soin Spa signature", duration: "1h30", price: "Sur demande" },
    { name: "Sortie pêche au gros", duration: "Demi-journée", price: "Sur demande" },
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
                alt="Maison d'Akoula"
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
                    alt={`Maison d'Akoula ${idx + 2}`}
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
                      Maison d'Akoula
                    </h1>
                    <p className="text-lg text-terracotta font-sans mb-2">Évasion Lagunaire</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-sans">Assinie, Côte d'Ivoire</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-gold/10 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-gold fill-gold" />
                    <span className="text-sm font-sans font-semibold text-gold">4.8</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-beige/20 text-foreground rounded-full text-sm font-sans">
                    Lagune & Mer
                  </span>
                  <span className="px-3 py-1.5 bg-beige/20 text-foreground rounded-full text-sm font-sans">
                    Gastronomie
                  </span>
                  <span className="px-3 py-1.5 bg-beige/20 text-foreground rounded-full text-sm font-sans">
                    Plage
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
                    Perchée entre lagune et océan Atlantique, la Maison d'Akoula est un joyau discret d'Assinie.
                    Cette villa d'exception offre une vue imprenable sur la lagune Aby tout en donnant accès à
                    une plage océanique préservée, accessible en quelques minutes de pirogue.
                  </p>
                  <p>
                    L'architecture contemporaine aux tons blancs et bois clair se fond dans le paysage tropical.
                    Les chambres spacieuses ouvrent sur des terrasses privées où le temps semble suspendu. La
                    piscine à débordement face à la lagune invite à la contemplation.
                  </p>
                  <p>
                    Le restaurant de la Maison d'Akoula est réputé pour ses fruits de mer d'une fraîcheur
                    exceptionnelle : langoustes, crabes, poissons grillés... préparés avec finesse par le chef
                    et ses épices locales. Un voyage gustatif inoubliable.
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

              {/* Le vrai plus */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-beige/20 to-terracotta/10 border border-beige/30 rounded-xl p-6"
              >
                <h3 className="text-xl font-serif text-anthracite mb-3">Le Vrai Plus</h3>
                <p className="text-foreground font-sans leading-relaxed">
                  La situation géographique unique entre lagune calme et océan sauvage. Vous pouvez commencer
                  votre journée par un petit-déjeuner face à la lagune, puis traverser en pirogue pour rejoindre
                  la plage océanique et ses vagues, tout en revenant déjeuner de fruits de mer fraîchement
                  pêchés. Un double visage de la nature en un seul lieu.
                </p>
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
                {/* Avantage MindPass */}
                <div className="bg-gradient-to-br from-gold/10 to-terracotta/10 border-2 border-gold/20 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="w-6 h-6 text-gold flex-shrink-0" />
                    <div>
                      <p className="font-sans font-bold text-anthracite mb-1">Avantage Membre MindPass</p>
                      <p className="text-sm font-sans text-foreground">
                        -15% sur les soins Spa
                      </p>
                    </div>
                  </div>
                </div>

                {/* Prix indicatif */}
                <div className="border-t border-beige/30 pt-6">
                  <p className="text-sm text-muted-foreground font-sans mb-2">À partir de</p>
                  <p className="text-3xl font-serif text-anthracite mb-1">120 000 FCFA</p>
                  <p className="text-sm text-muted-foreground font-sans">par nuit</p>
                </div>

                {/* Bouton CTA Principal */}
                <a
                  href="https://maisondakoula.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl font-sans"
                >
                  <span>Voir les disponibilités</span>
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
                    Réservation directe avec notre partenaire. Mentionnez votre statut de Membre MindPass
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