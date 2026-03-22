import { useState } from "react";
import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { motion } from "motion/react";
import { 
  Award, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Search,
  Filter,
  Heart,
  Calendar,
  Shield,
  Users,
  GraduationCap,
  Globe,
  ArrowRight,
  Phone,
  Video
} from "lucide-react";
import { Link } from "react-router";

export default function ExpertsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  const experts = [
    {
      id: 1,
      name: "Dr. Amara Kamara",
      title: "Psychologue Clinicienne",
      specialties: ["Thérapie cognitive", "Gestion du stress", "Burn-out professionnel"],
      location: "Kinshasa",
      experience: "12 ans d'expérience",
      languages: ["Français", "Lingala", "Anglais"],
      image: "https://images.unsplash.com/photo-1633419798503-0b0c628f267c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwdGhlcmFwaXN0JTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5NDI1MzE3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      reviewsCount: 127,
      verified: true,
      availability: "Disponible cette semaine",
      sessionPrice: "35,000 FC",
      bio: "Spécialisée dans l'accompagnement des cadres et entrepreneurs. Approche intégrative alliant thérapies cognitivo-comportementales et techniques de mindfulness.",
      education: "PhD en Psychologie Clinique, Université de Kinshasa",
      certifications: ["Certifiée TCC", "Formation EMDR", "Supervision clinique"],
      consultationTypes: ["Présentiel", "Visio", "Téléphone"],
    },
    {
      id: 2,
      name: "Dr. Fatou Mbaye",
      title: "Psychiatre",
      specialties: ["Troubles anxieux", "Dépression", "Thérapie de couple"],
      location: "Dakar",
      experience: "15 ans d'expérience",
      languages: ["Français", "Wolof", "Anglais"],
      image: "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGZlbWFsZSUyMHBzeWNob2xvZ2lzdCUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3Njk0MjUzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 5.0,
      reviewsCount: 203,
      verified: true,
      availability: "Disponible aujourd'hui",
      sessionPrice: "45,000 XOF",
      bio: "Psychiatre spécialisée dans le traitement des troubles de l'humeur et l'accompagnement des couples. Approche empathique et culturellement adaptée.",
      education: "Doctorat en Médecine, Spécialité Psychiatrie, Université Cheikh Anta Diop",
      certifications: ["Psychiatre certifiée", "Formation systémique", "Thérapie de couple Gottman"],
      consultationTypes: ["Présentiel", "Visio"],
    },
    {
      id: 3,
      name: "Dr. Kofi Mensah",
      title: "Thérapeute en Santé Mentale",
      specialties: ["Traumatismes", "ESPT", "Développement personnel"],
      location: "Abidjan",
      experience: "10 ans d'expérience",
      languages: ["Français", "Anglais", "Baoulé"],
      image: "https://images.unsplash.com/photo-1632054229795-4097870879b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwbWFsZSUyMGRvY3RvciUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3Njk0MjU0MTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8,
      reviewsCount: 94,
      verified: true,
      availability: "Disponible demain",
      sessionPrice: "40,000 XOF",
      bio: "Expert en trauma et résilience. Accompagne les victimes de traumatismes complexes avec une approche holistique intégrant corps et esprit.",
      education: "Master en Psychologie Clinique, Université Félix Houphouët-Boigny",
      certifications: ["Certifié EMDR niveau 2", "Somatic Experiencing", "IFS Therapy"],
      consultationTypes: ["Présentiel", "Visio", "Téléphone"],
    },
    {
      id: 4,
      name: "Dr. Awa Diop",
      title: "Psychologue pour Adolescents",
      specialties: ["Thérapie familiale", "Estime de soi", "Troubles du comportement"],
      location: "Kinshasa",
      experience: "8 ans d'expérience",
      languages: ["Français", "Swahili", "Anglais"],
      image: "https://images.unsplash.com/photo-1712821125604-4ca6b1f86488?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjB0aGVyYXBpc3QlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njk0MjU0MTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      reviewsCount: 156,
      verified: true,
      availability: "Disponible cette semaine",
      sessionPrice: "30,000 FC",
      bio: "Spécialisée dans l'accompagnement des adolescents et jeunes adultes. Créer un espace sécurisant pour explorer les défis de cette période de vie.",
      education: "Master en Psychologie de l'enfant et de l'adolescent, Université de Kinshasa",
      certifications: ["Certifiée en thérapie familiale", "Formation ACT", "Play therapy"],
      consultationTypes: ["Présentiel", "Visio"],
    },
  ];

  const cities = ["all", "Toutes les villes", "Kinshasa", "Dakar", "Abidjan", "Autres villes"];
  const specialties = [
    "all",
    "Santé mentale",
    "Thérapie cognitive",
    "Gestion du stress",
    "Troubles anxieux",
    "Dépression",
    "Traumatismes",
    "Thérapie familiale",
    "Soins primaires",
    "Médecine générale",
    "Consultations générales",
  ];

  const filteredExperts = experts.filter((expert) => {
    const matchesSearch = 
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCity = selectedCity === "all" || expert.location === selectedCity;
    const matchesSpecialty = 
      selectedSpecialty === "all" || 
      expert.specialties.some(s => s === selectedSpecialty);
    
    return matchesSearch && matchesCity && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVyYXB5JTIwc2Vzc2lvbiUyMHByb2Zlc3Npb25hbHxlbnwwfHx8fDE3Mzc1NjMxODd8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Therapy professional"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/98 via-background/95 to-background" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6"
            >
              <Award className="w-4 h-4 text-terracotta" />
              <span className="text-sm text-terracotta font-sans">50+ Experts Certifiés</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif text-anthracite mb-6"
            >
              Trouvez votre <span className="text-terracotta">Professionnel de Santé</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground font-sans max-w-3xl mx-auto mb-8"
            >
              Des experts en santé mentale et des médecins généralistes rigoureusement sélectionnés qui comprennent
              votre contexte culturel et parlent votre langue.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <a
                href="#experts-list"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl font-sans"
              >
                <span>Découvrir nos experts</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/carrieres"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-beige text-anthracite rounded-lg hover:bg-beige/10 transition-all duration-300 font-sans"
              >
                <Users className="w-5 h-5" />
                <span>Vous êtes expert ? Rejoignez-nous</span>
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
          >
            {[
              { icon: Users, label: "50+ Experts", value: "Certifiés" },
              { icon: MapPin, label: "Afrique Francophone", value: "Présence régionale" },
              { icon: Star, label: "4.9/5", value: "Satisfaction" },
              { icon: Shield, label: "100%", value: "Vérifiés" },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-beige/30 text-center"
                >
                  <Icon className="w-6 h-6 text-terracotta mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground font-sans mb-1">{stat.label}</p>
                  <p className="text-base font-semibold text-anthracite font-sans">{stat.value}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Liste des experts avec filtres */}
      <section id="experts-list" className="py-16 sm:py-20 bg-gradient-to-b from-white to-beige/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif text-anthracite mb-6">
              Découvrez nos <span className="text-terracotta">Experts</span>
            </h2>
            <p className="text-lg text-muted-foreground font-sans max-w-3xl mx-auto">
              Utilisez les filtres pour trouver l'expert qui correspond parfaitement à vos besoins.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white p-6 rounded-xl border border-beige/30 mb-10">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher un expert..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm"
                />
              </div>

              {/* City filter */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm appearance-none bg-white"
                >
                  <option value="all">Toutes les villes</option>
                  {cities.filter(c => c !== "all").map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Specialty filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm appearance-none bg-white"
                >
                  <option value="all">Toutes les spécialités</option>
                  {specialties.filter(s => s !== "all").map((specialty) => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Experts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1].map((idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-beige/30 text-center relative overflow-hidden"
              >
                {/* Coming Soon Badge */}
                <div className="absolute top-4 right-4 bg-terracotta/10 text-terracotta px-3 py-1 rounded-full text-xs font-sans uppercase tracking-wider">
                  Bientôt
                </div>

                {/* Profile Placeholder */}
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-beige/50 to-terracotta/20 flex items-center justify-center">
                  <Users className="w-10 h-10 text-terracotta/40" />
                </div>

                <h3 className="text-xl font-serif text-anthracite mb-2">
                  Profil à venir
                </h3>
                <p className="text-sm text-muted-foreground font-sans mb-4">
                  Nous sélectionnons les meilleurs experts pour vous
                </p>

                {/* Placeholder Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Afrique francophone</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <GraduationCap className="w-4 h-4" />
                    <span>Expert certifié</span>
                  </div>
                </div>

                <button 
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed font-sans text-sm"
                >
                  Profil en préparation
                </button>
              </motion.div>
            ))}
          </div>

          {/* Info Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center bg-gradient-to-r from-terracotta/5 to-beige/30 border border-terracotta/20 rounded-2xl p-8"
          >
            <Calendar className="w-12 h-12 text-terracotta mx-auto mb-4" />
            <h3 className="text-xl font-serif text-anthracite mb-2">
              Nos professionnels arrivent bientôt
            </h3>
            <p className="text-sm text-muted-foreground font-sans max-w-2xl mx-auto">
              Nous finalisons actuellement la sélection et la vérification de nos experts en santé mentale et de nos médecins généralistes. 
              Vous serez notifié dès que les profils seront disponibles.
            </p>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}