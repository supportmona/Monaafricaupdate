import { motion } from "motion/react";
import { BookOpen, Video, Headphones, FileText, Search, Filter, ArrowRight, Clock, Star, Download, Lock } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { bibliothequeResources } from "@/data/bibliothequeResources";

export default function BibliotequePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeAccessFilter, setActiveAccessFilter] = useState("all"); // Nouveau filtre

  const categories = [
    { id: "all", label: "Tout", icon: BookOpen },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "videos", label: "Vidéos", icon: Video },
    { id: "podcasts", label: "Podcasts", icon: Headphones },
  ];

  const accessFilters = [
    { id: "all", label: "Tout" },
    { id: "free", label: "Gratuit" },
    { id: "members", label: "Membres" },
  ];

  const resources = bibliothequeResources;

  const filteredResources = resources.filter(r => {
    // Filtre par catégorie
    const categoryMatch = activeCategory === "all" || r.category === activeCategory;
    
    // Filtre par type d'accès
    const accessMatch = 
      activeAccessFilter === "all" || 
      (activeAccessFilter === "free" && r.isFree) ||
      (activeAccessFilter === "members" && !r.isFree);
    
    return categoryMatch && accessMatch;
  });

  const featuredResources = resources.filter(r => r.featured);

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pb-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-foreground font-sans font-medium mb-3">
                BIBLIOTHÈQUE DE RESSOURCES
              </p>
              <div className="w-32 h-[2px] bg-foreground mx-auto" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif text-foreground mb-6 leading-tight">
              Cultivez votre{" "}
              <span className="italic">bien-être mental</span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-foreground/70 font-sans mb-12 leading-relaxed">
              Explorez notre bibliothèque de contenus premium : articles approfondis, vidéos guidées, 
              podcasts inspirants et outils pratiques pour votre parcours bien-être.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher des ressources..."
                  className="w-full pl-12 pr-4 py-4 rounded-full border border-beige/50 focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all font-sans"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 bg-[#E8DFD6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-gold" />
              <h2 className="text-3xl font-serif text-foreground">
                Ressources <span className="italic">à la une</span>
              </h2>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredResources.map((resource, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={`/bibliotheque/${resource.id}`} className="block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={resource.image} 
                        alt={resource.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <div className="px-3 py-1 bg-terracotta text-white text-xs font-sans font-semibold rounded-full uppercase">
                          À la une
                        </div>
                        <div className={`px-3 py-1 text-xs font-sans font-bold rounded-full uppercase tracking-wide ${
                          resource.isFree 
                            ? 'bg-gold text-white' 
                            : 'bg-anthracite text-white flex items-center gap-1'
                        }`}>
                          {resource.isFree ? 'GRATUIT' : (
                            <>
                              <Lock className="w-3 h-3" />
                              MEMBRES
                            </>
                          )}
                        </div>
                      </div>
                      {/* Badge Téléchargeable */}
                      {resource.downloadable && (
                        <div className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-all cursor-pointer group/download">
                          <Download className="w-4 h-4 text-anthracite group-hover/download:text-terracotta transition-colors" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans mb-3">
                        <Clock className="w-4 h-4" />
                        <span>{resource.duration}</span>
                      </div>
                      <h3 className="text-2xl font-serif text-anthracite mb-3 group-hover:text-terracotta transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-base text-muted-foreground font-sans mb-4 leading-relaxed">
                        {resource.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {resource.tags.map((tag, tagIdx) => (
                          <span 
                            key={tagIdx}
                            className="px-3 py-1 bg-beige/30 text-anthracite text-xs font-sans rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground font-sans">
                          Par {resource.author}
                        </span>
                        <ArrowRight className="w-5 h-5 text-terracotta group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white sticky top-0 z-10 border-b border-beige/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-sans font-medium transition-all whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-[#1A1A1A] text-white'
                        : 'bg-beige/20 text-anthracite hover:bg-beige/40'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-anthracite font-sans hover:text-terracotta transition-colors">
              <Filter className="w-4 h-4" />
              Filtres
            </button>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Access Filter */}
          <div className="mb-8 flex items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground font-sans">Afficher :</span>
            <div className="flex gap-2">
              {accessFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveAccessFilter(filter.id)}
                  className={`px-5 py-2 rounded-full font-sans font-medium text-sm transition-all ${
                    activeAccessFilter === filter.id
                      ? 'bg-terracotta text-white shadow-md'
                      : 'bg-beige/30 text-anthracite hover:bg-beige/50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource, idx) => (
              <Link key={idx} to={`/bibliotheque/${resource.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (idx % 9) * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden border border-beige/30 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={resource.image} 
                      alt={resource.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Badge Gratuit/Membres */}
                    <div className={`absolute top-4 left-4 px-3 py-1 text-xs font-sans font-bold rounded-full uppercase tracking-wide ${
                      resource.isFree 
                        ? 'bg-gold text-white' 
                        : 'bg-anthracite text-white flex items-center gap-1'
                    }`}>
                      {resource.isFree ? 'GRATUIT' : (
                        <>
                          <Lock className="w-3 h-3" />
                          MEMBRES
                        </>
                      )}
                    </div>
                    {/* Badge Téléchargeable */}
                    {resource.downloadable && (
                      <div className="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-all cursor-pointer group/download">
                        <Download className="w-4 h-4 text-anthracite group-hover/download:text-terracotta transition-colors" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-sans mb-3">
                      <Clock className="w-4 h-4" />
                      <span>{resource.duration}</span>
                    </div>
                    <h3 className="text-xl font-serif text-anthracite mb-2 group-hover:text-terracotta transition-colors line-clamp-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-sans mb-4 leading-relaxed line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-sans">
                        {resource.author}
                      </span>
                      <ArrowRight className="w-4 h-4 text-terracotta group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-[#1A1A1A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-[#D4C5B9]" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-6">
              Accédez à encore plus de ressources
            </h2>
            <p className="text-lg text-white/70 font-sans mb-8">
              Devenez membre M.O.N.A pour débloquer notre bibliothèque complète de contenus exclusifs.
            </p>
            <Link
              to="/membres"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1A1A1A] rounded-full hover:bg-gray-100 transition-all duration-200 font-sans font-semibold shadow-lg hover:shadow-xl"
            >
              Découvrir les avantages membres
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}