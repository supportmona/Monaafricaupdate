import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  Clock, 
  Bookmark, 
  Share2, 
  Download, 
  Play,
  Lock,
  Crown,
  User,
  CheckCircle,
  Activity,
  FileText,
  BookOpen,
  Calendar
} from "lucide-react";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import { getBibliothequeResourceById, type BibliothequeResource } from "@/data/bibliothequeResources";
import { getResourceContent, downloadArticle } from "@/data/resourceContent";

export default function MemberResourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useMemberAuth();
  const [resource, setResource] = useState<BibliothequeResource | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (id) {
      const foundResource = getBibliothequeResourceById(id);
      if (foundResource) {
        setResource(foundResource);
      } else {
        navigate("/member/resources");
      }
    }
  }, [id, navigate]);

  if (!resource) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#1A1A1A]/60">Chargement...</p>
        </div>
      </div>
    );
  }

  const isFree = user?.plan === "free" || !isAuthenticated;
  const isLocked = !resource.isFree && isFree;
  const htmlContent = getResourceContent(resource.id);

  const getTypeLabel = (category: string) => {
    switch (category) {
      case "articles":
        return "Article";
      case "videos":
        return "Vidéo";
      case "podcasts":
        return "Podcast";
      default:
        return category;
    }
  };

  const handleDownload = () => {
    if (resource.category === "articles" && htmlContent) {
      downloadArticle(resource.title, resource.description, htmlContent);
    }
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        {/* Header */}
        <header className="bg-white border-b border-[#D4C5B9]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              to="/member/resources"
              className="inline-flex items-center gap-2 text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la bibliothèque
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
          {/* Écran verrouillé */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#D4C5B9] rounded-3xl overflow-hidden"
          >
            {/* Image d'en-tête verrouillée */}
            <div className="relative aspect-video bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-serif mb-2">Contenu réservé</h3>
                  <p className="text-white/80 text-sm">
                    Rejoignez le Cercle M.O.N.A pour accéder à ce contenu
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Badge et catégorie */}
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#D4A574] to-[#A68B6F] text-white text-xs font-semibold rounded-full">
                  <Crown className="w-3 h-3" />
                  CERCLE M.O.N.A
                </span>
                <span className="text-xs font-medium text-[#A68B6F] uppercase tracking-wider">
                  {resource.category}
                </span>
              </div>

              {/* Titre */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#1A1A1A] mb-4">
                {resource.title}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-[#1A1A1A]/80 mb-6">
                {resource.description}
              </p>

              {/* Métadonnées */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#1A1A1A]/60 mb-8 pb-8 border-b border-[#D4C5B9]">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{resource.author}</span>
                </div>
                {resource.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{resource.duration}</span>
                  </div>
                )}
              </div>

              {/* Call to action */}
              <div className="bg-gradient-to-br from-[#F5F1ED] to-white border-2 border-[#D4A574] rounded-2xl p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4A574] to-[#A68B6F] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif text-[#1A1A1A] mb-3">
                  Rejoignez le Cercle M.O.N.A
                </h3>
                <p className="text-[#1A1A1A]/60 mb-6 max-w-md mx-auto">
                  Accédez à cette ressource et à l'ensemble de notre bibliothèque exclusive : articles approfondis, vidéos guidées et podcasts enrichissants.
                </p>

                {/* Avantages */}
                <div className="space-y-3 mb-6 text-left max-w-md mx-auto">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#1A1A1A]">
                      <strong>Contenu exclusif</strong> : Accès illimité à toutes les ressources
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#1A1A1A]">
                      <strong>Téléchargements</strong> : Consultez hors ligne quand vous voulez
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#A68B6F] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#1A1A1A]">
                      <strong>Consultations prioritaires</strong> : Réservez avec nos experts
                    </p>
                  </div>
                </div>

                <Link
                  to="/member/upgrade"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#D4A574] to-[#A68B6F] text-white rounded-full hover:shadow-lg transition-all font-medium"
                >
                  <Crown className="w-5 h-5" />
                  Voir les tarifs Cercle M.O.N.A
                </Link>
              </div>
            </div>
          </motion.div>
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

  // Contenu accessible (Plan Cercle M.O.N.A ou contenu gratuit)
  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/member/resources"
              className="inline-flex items-center gap-2 text-sm text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la bibliothèque
            </Link>
            <div className="flex items-center gap-2">
              {resource.category === "articles" && htmlContent && resource.downloadable && (
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2A2A2A] transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Télécharger</span>
                </button>
              )}
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    isBookmarked ? "fill-[#A68B6F] text-[#A68B6F]" : "text-[#1A1A1A]/60"
                  }`}
                />
              </button>
              <button className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
                <Share2 className="w-5 h-5 text-[#1A1A1A]/60" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#D4C5B9] rounded-3xl overflow-hidden"
        >
          {/* Image/Vidéo d'en-tête */}
          <div 
            className="relative aspect-video flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${resource.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#A68B6F]/80 to-[#D4C5B9]/80 flex items-center justify-center">
              {resource.category === "videos" && (
                <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-[#1A1A1A] ml-1" />
                </button>
              )}
              {resource.category === "podcasts" && (
                <div className="text-white">
                  <Play className="w-16 h-16" />
                </div>
              )}
            </div>
            {!resource.isFree && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-[#D4A574] to-[#A68B6F] text-white text-xs font-semibold rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" />
                CERCLE M.O.N.A
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 lg:p-12">
            {/* Badge type et catégorie */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-[#A68B6F] uppercase tracking-wider">
                {getTypeLabel(resource.category)}
              </span>
              {resource.tags && resource.tags.length > 0 && (
                <>
                  <span className="text-xs text-[#1A1A1A]/40">•</span>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs text-[#1A1A1A]/60">
                        {tag}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Titre */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1A1A1A] mb-6">
              {resource.title}
            </h1>

            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#1A1A1A]/60 mb-8 pb-8 border-b border-[#D4C5B9]">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium text-[#1A1A1A]">{resource.author}</span>
              </div>
              {resource.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{resource.duration}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-lg text-[#1A1A1A]/80 leading-relaxed">
                {resource.description}
              </p>
            </div>

            {/* Contenu principal */}
            <div className="prose prose-lg max-w-none text-[#1A1A1A]">
              {resource.category === "articles" && htmlContent && (
                <div 
                  className="article-content leading-relaxed space-y-6"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  style={{
                    fontSize: '1.125rem',
                    lineHeight: '1.75rem'
                  }}
                />
              )}

              {resource.category === "videos" && (
                <div className="bg-[#F5F1ED] rounded-2xl p-8 text-center">
                  <Play className="w-12 h-12 text-[#A68B6F] mx-auto mb-4" />
                  <p className="text-[#1A1A1A]/60 mb-4">
                    Lecteur vidéo intégré
                  </p>
                </div>
              )}

              {resource.category === "podcasts" && (
                <div className="bg-[#F5F1ED] rounded-2xl p-8 text-center">
                  <Play className="w-12 h-12 text-[#A68B6F] mx-auto mb-4" />
                  <p className="text-[#1A1A1A]/60 mb-4">
                    Lecteur audio intégré
                  </p>
                </div>
              )}
            </div>

            {/* Message de téléchargement pour les articles */}
            {resource.category === "articles" && htmlContent && resource.downloadable && (
              <div className="mt-8 pt-8 border-t border-[#D4C5B9]">
                <div className="bg-gradient-to-br from-[#F5F1ED] to-white border border-[#D4C5B9] rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <Download className="w-6 h-6 text-[#A68B6F] flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-[#1A1A1A] mb-2">
                        Article téléchargeable
                      </h4>
                      <p className="text-sm text-[#1A1A1A]/70 mb-4">
                        Téléchargez cet article au format .txt pour le consulter hors ligne, à tout moment.
                      </p>
                      <button
                        onClick={handleDownload}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#2A2A2A] transition-colors text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger l'article
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.article>
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