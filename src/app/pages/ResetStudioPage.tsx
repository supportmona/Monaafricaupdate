import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { MapPin, Star, Sparkles, ExternalLink, Phone, Mail, ChevronLeft, Clock } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Activity, Coffee, User, Bath, Leaf, Thermometer, Smartphone, Music } from "lucide-react";

export default function ResetStudioPage() {
  const images = [
    "https://images.unsplash.com/photo-1764726331220-b323be2b57b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxhdGVzJTIwc3R1ZGlvJTIwZW1wdHklMjBpbnRlcmlvcnxlbnwxfHx8fDE3Njk0NDQ1NDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1636990628724-cb59f83326d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwc3R1ZGlvJTIwZW1wdHklMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2OTQ0NDU0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwc3R1ZGlvJTIwZW1wdHklMjBzcGFjZXxlbnwxfHx8fDE3Njk0NDQ1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  ];

  const amenities = [
    { icon: Activity, label: "Machines Reformer professionnelles" },
    { icon: Coffee, label: "Bar à jus detox maison" },
    { icon: User, label: "Coaching privé personnalisé" },
    { icon: Bath, label: "Vestiaires luxueux avec douches" },
    { icon: Leaf, label: "Produits bio & naturels" },
    { icon: Thermometer, label: "Climatisation performante" },
    { icon: Smartphone, label: "Réservation en ligne" },
    { icon: Music, label: "Ambiance musicale soignée" },
  ];

  const classes = [
    {
      name: "Reformer Débutant",
      duration: "50 min",
      price: "15 000 FCFA",
      description: "Introduction au Pilates sur machine Reformer",
    },
    {
      name: "Reformer Intermédiaire",
      duration: "50 min",
      price: "15 000 FCFA",
      description: "Séance dynamique pour renforcer et sculpter",
    },
    {
      name: "Private Session",
      duration: "50 min",
      price: "35 000 FCFA",
      description: "Coaching 100% personnalisé en tête-à-tête",
    },
    {
      name: "Duo Session",
      duration: "50 min",
      price: "25 000 FCFA/pers",
      description: "Séance privée à deux (amis, couple)",
    },
  ];

  const schedule = [
    { day: "Lundi - Vendredi", hours: "6h30 - 21h00" },
    { day: "Samedi", hours: "8h00 - 18h00" },
    { day: "Dimanche", hours: "9h00 - 14h00" },
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
                alt="RESET Studio"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-terracotta/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="text-sm font-sans text-white">Pilates & Sport</span>
              </div>
            </div>

            {/* Images secondaires */}
            <div className="hidden lg:grid grid-rows-2 gap-4">
              {images.slice(1).map((img, idx) => (
                <div key={idx} className="relative h-full rounded-2xl overflow-hidden">
                  <ImageWithFallback
                    src={img}
                    alt={`RESET Studio ${idx + 2}`}
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
                      RESET Studio
                    </h1>
                    <p className="text-lg text-terracotta font-sans mb-2">Pilates Reformer & Wellness</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-sans">Gombe, Kinshasa, RDC</span>
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
                    Reformer
                  </span>
                  <span className="px-3 py-1.5 bg-beige/20 text-foreground rounded-full text-sm font-sans">
                    Bar à Jus
                  </span>
                  <span className="px-3 py-1.5 bg-beige/20 text-foreground rounded-full text-sm font-sans">
                    Coaching Privé
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
                    RESET Studio est le premier studio de Pilates Reformer haut de gamme de Kinshasa. Situé
                    dans le quartier chic de la Gombe, ce studio boutique offre une expérience wellness complète
                    dans un cadre épuré aux tons blancs, beiges et bois clair.
                  </p>
                  <p>
                    Les machines Reformer professionnelles Balanced Body (importées des États-Unis) permettent
                    un travail musculaire profond en douceur. Chaque cours est limité à 6 participants maximum
                    pour garantir un suivi personnalisé optimal par des coachs certifiés internationalement.
                  </p>
                  <p>
                    Après votre séance, prolongez le moment cocooning au bar à jus où sont préparés des
                    smoothies detox, des eaux infusées et des collations saines. L'atmosphère zen et la
                    playlist soigneusement sélectionnée font de RESET un véritable sanctuaire urbain.
                  </p>
                </div>
              </motion.div>

              {/* Le vrai plus */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-beige/20 to-terracotta/10 border border-beige/30 rounded-xl p-6"
              >
                <h3 className="text-xl font-serif text-anthracite mb-3">Le Vrai Plus</h3>
                <p className="text-foreground font-sans leading-relaxed">
                  L'ambiance cocooning exclusive et l'attention portée aux détails. Des serviettes chaudes
                  rafraîchissantes après chaque séance, des produits de douche bio, un vestiaire qui sent bon,
                  et surtout des coachs qui prennent vraiment le temps de corriger vos postures. Ici, pas
                  d'effet de masse : vous êtes vu, accompagné, chouchouté.
                </p>
              </motion.div>

              {/* Équipements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
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

              {/* Cours & Tarifs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-serif text-anthracite mb-4">Cours & Tarifs</h2>
                <div className="space-y-3">
                  {classes.map((classItem, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-beige/10 rounded-lg border border-beige/30"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-sans font-semibold text-foreground text-lg">{classItem.name}</p>
                          <p className="text-sm text-muted-foreground font-sans">{classItem.duration}</p>
                        </div>
                        <span className="text-lg font-sans font-semibold text-terracotta">{classItem.price}</span>
                      </div>
                      <p className="text-sm text-foreground font-sans">{classItem.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Horaires */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-serif text-anthracite mb-4">Horaires d'ouverture</h2>
                <div className="space-y-3">
                  {schedule.map((slot, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-white border border-beige/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-terracotta" />
                        <span className="font-sans text-foreground">{slot.day}</span>
                      </div>
                      <span className="font-sans font-semibold text-anthracite">{slot.hours}</span>
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
                {/* Avantage MindPass */}
                <div className="bg-gradient-to-br from-gold/10 to-terracotta/10 border-2 border-gold/20 rounded-xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="w-6 h-6 text-gold flex-shrink-0" />
                    <div>
                      <p className="font-sans font-bold text-anthracite mb-1">Avantage Membre MindPass</p>
                      <p className="text-sm font-sans text-foreground">
                        1 Séance Reformer achetée = 1 Séance offerte
                      </p>
                    </div>
                  </div>
                </div>

                {/* Formules */}
                <div className="border-t border-beige/30 pt-6 space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground font-sans mb-1">Séance à l'unité</p>
                    <p className="text-2xl font-serif text-anthracite">15 000 FCFA</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-sans mb-1">Carnet 10 séances</p>
                    <p className="text-2xl font-serif text-anthracite">130 000 FCFA</p>
                    <p className="text-xs text-terracotta font-sans">Économisez 20 000 FCFA</p>
                  </div>
                </div>

                {/* Bouton CTA Principal */}
                <a
                  href="https://reset-studio.cd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl font-sans"
                >
                  <span>Réserver mon tapis</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Contact */}
                <div className="space-y-3">
                  <button className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border-2 border-beige text-anthracite rounded-lg hover:bg-beige/10 transition-all duration-200 font-sans">
                    <Phone className="w-4 h-4" />
                    <span>Appeler le studio</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border-2 border-beige text-anthracite rounded-lg hover:bg-beige/10 transition-all duration-200 font-sans">
                    <Mail className="w-4 h-4" />
                    <span>Envoyer un message</span>
                  </button>
                </div>

                {/* Info */}
                <div className="border-t border-beige/30 pt-6">
                  <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                    Présentez votre carte MindPass (physique ou digitale) lors de votre première visite
                    pour activer votre avantage membre.
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