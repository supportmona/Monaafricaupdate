import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { Search, Filter, BookOpen, Video, Headphones, FileText, Download, Bookmark, Clock, TrendingUp, Crown, Info, Activity, Calendar, Lock } from "lucide-react";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import { bibliothequeResources, type BibliothequeResource } from "@/data/bibliothequeResources";

type ResourceType = "articles" | "videos" | "podcasts";

export default function MemberResourcesPage() {
  const { user, isAuthenticated } = useMemberAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | ResourceType>("all");
  const [selectedAccess, setSelectedAccess] = useState<"all" | "free" | "members">("all");
  const [showBookmarked, setShowBookmarked] = useState(false);

  const isFree = user?.plan === "free" || !isAuthenticated;
  const isCercleMona = user?.plan === "cercle-mona";

  // Tout le monde voit tout le catalogue
  const availableResources = bibliothequeResources;

  const filteredResources = availableResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "all" || resource.category === selectedType;
    const matchesAccess = selectedAccess === "all" || 
                         (selectedAccess === "free" && resource.isFree) ||
                         (selectedAccess === "members" && !resource.isFree);
    return matchesSearch && matchesType && matchesAccess;
  });

  const handleResourceClick = (resourceId: string, isFreeResource: boolean) => {
    // Si contenu membres et plan Free, rediriger vers /pricing
    if (!isFreeResource && isFree) {
      navigate("/member/upgrade");
    } else {
      // Sinon, aller à la page détail
      navigate(`/member/resources/${resourceId}`);
    }
  };

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case "articles":
        return <FileText className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "videos":
        return <Video className="w-4 h-4 sm:w-5 sm:h-5" />;
      case "podcasts":
        return <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getTypeLabel = (type: ResourceType) => {
    switch (type) {
      case "articles":
        return "Article";
      case "videos":
        return "Vidéo";
      case "podcasts":
        return "Podcast";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link 
                to="/member/dashboard" 
                className="text-xs sm:text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] mb-2 inline-block"
              >
                ← Retour au tableau de bord
              </Link>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-[#1A1A1A]">
                Bibliothèque de <span className="font-serif italic">Ressources</span>
              </h1>
              <p className="text-sm sm:text-base text-[#1A1A1A]/60 mt-1">
                Explorez nos contenus pour votre bien-être mental
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isFree && (
                <Link
                  to="/member/upgrade"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4A574] to-[#A68B6F] text-white rounded-full hover:shadow-lg transition-all text-sm font-medium"
                >
                  <Crown className="w-4 h-4" />
                  Rejoindre le Cercle M.O.N.A
                </Link>
              )}
              {isCercleMona && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4A574] to-[#A68B6F] text-white rounded-full text-sm font-medium">
                  <Crown className="w-4 h-4" />
                  Membre Cercle M.O.N.A
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 pb-24">
        
        {/* Message d'information selon le plan */}
        {isFree && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 mb-6"
          >
            <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-900">
                <strong>Plan Free.</strong> Vous pouvez consulter les ressources gratuites. 
                Les contenus marqués "Cercle M.O.N.A" nécessitent un abonnement pour être consultés.
              </p>
              <Link
                to="/member/upgrade"
                className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-800 mt-2 underline"
              >
                Voir les tarifs Cercle M.O.N.A
              </Link>
            </div>
          </motion.div>
        )}

        {/* Stats rapides */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#D4C5B9] rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-[#A68B6F]" />
              <p className="text-xs text-[#1A1A1A]/60">Ressources</p>
            </div>
            <p className="text-2xl font-light text-[#1A1A1A]">{availableResources.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-[#D4C5B9] rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-5 h-5 text-[#A68B6F]" />
              <p className="text-xs text-[#1A1A1A]/60">Vidéos</p>
            </div>
            <p className="text-2xl font-light text-[#1A1A1A]">
              {availableResources.filter(r => r.category === "videos").length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-[#D4C5B9] rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-[#A68B6F]" />
              <p className="text-xs text-[#1A1A1A]/60">Articles</p>
            </div>
            <p className="text-2xl font-light text-[#1A1A1A]">
              {availableResources.filter(r => r.category === "articles").length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-[#D4C5B9] rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="w-5 h-5 text-[#A68B6F]" />
              <p className="text-xs text-[#1A1A1A]/60">Podcasts</p>
            </div>
            <p className="text-2xl font-light text-[#1A1A1A]">
              {availableResources.filter(r => r.category === "podcasts").length}
            </p>
          </motion.div>
        </div>

        {/* Recherche et filtres */}
        <div className="bg-white border border-[#D4C5B9] rounded-2xl p-4 sm:p-6 mb-6">
          <div className="space-y-4">
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
              <input
                type="text"
                placeholder="Rechercher dans la bibliothèque..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F5F1ED] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
              />
            </div>

            {/* Filtres Type */}
            <div>
              <p className="text-xs font-medium text-[#1A1A1A]/60 mb-2">TYPE DE CONTENU</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === "all"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#F5F1ED] text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setSelectedType("articles")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === "articles"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#F5F1ED] text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Articles
                </button>
                <button
                  onClick={() => setSelectedType("videos")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === "videos"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#F5F1ED] text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  <Video className="w-4 h-4" />
                  Vidéos
                </button>
                <button
                  onClick={() => setSelectedType("podcasts")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === "podcasts"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#F5F1ED] text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  <Headphones className="w-4 h-4" />
                  Podcasts
                </button>
              </div>
            </div>

            {/* Filtres Accès - Disponibles pour tous */}
            <div>
              <p className="text-xs font-medium text-[#1A1A1A]/60 mb-2">ACCÈS</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedAccess("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedAccess === "all"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#F5F1ED] text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setSelectedAccess("free")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedAccess === "free"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#F5F1ED] text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  Gratuit
                </button>
                <button
                  onClick={() => setSelectedAccess("members")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedAccess === "members"
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-[#F5F1ED] text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  Cercle M.O.N.A
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Grille de ressources */}
        {filteredResources.length === 0 ? (
          <div className="bg-white border border-[#D4C5B9] rounded-3xl p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-[#F5F1ED] rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-[#1A1A1A]/40" />
            </div>
            <h3 className="text-xl sm:text-2xl font-serif text-[#1A1A1A] mb-2">
              Aucune ressource trouvée
            </h3>
            <p className="text-sm sm:text-base text-[#1A1A1A]/60">
              Modifiez vos critères de recherche pour explorer d'autres contenus.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleResourceClick(resource.id, resource.isFree)}
                className="bg-white border border-[#D4C5B9] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] flex items-center justify-center relative">
                  <div className="text-white">
                    {getTypeIcon(resource.category as ResourceType)}
                  </div>
                  {!resource.isFree && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-[#D4A574] to-[#A68B6F] text-white text-xs rounded-full flex items-center gap-1 font-semibold">
                      <Crown className="w-3 h-3" />
                      Cercle M.O.N.A
                    </div>
                  )}
                  {resource.isFree && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full font-semibold">
                      Gratuit
                    </div>
                  )}
                  {/* Indicateur de verrouillage pour plan Free */}
                  {!resource.isFree && isFree && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                        <Lock className="w-6 h-6 text-[#1A1A1A]" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[#A68B6F] uppercase tracking-wider">
                      {resource.category}
                    </span>
                  </div>

                  <h3 className="text-base font-medium text-[#1A1A1A] mb-2 line-clamp-2 group-hover:text-[#A68B6F] transition-colors">
                    {resource.title}
                  </h3>

                  <p className="text-sm text-[#1A1A1A]/60 mb-3 line-clamp-2">
                    {resource.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-[#1A1A1A]/60 mb-3">
                    <span>{resource.author}</span>
                    <div className="flex items-center gap-3">
                      {resource.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {resource.duration}
                        </span>
                      )}
                      {resource.readTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {resource.readTime}
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="w-full py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2A2A2A] transition-colors text-sm font-medium">
                    {!resource.isFree && isFree ? "Voir les tarifs" : "Consulter"}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Navigation PWA Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] safe-area-inset-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Link
              to="/member/dashboard"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-xs">Accueil</span>
            </Link>
            <Link
              to="/member/consultations"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xs">Consultations</span>
            </Link>
            <Link
              to="/member/health-passport"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs">Passeport</span>
            </Link>
            <Link
              to="/member/resources"
              className="flex flex-col items-center gap-1 text-[#1A1A1A]"
            >
              <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium">Ressources</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}