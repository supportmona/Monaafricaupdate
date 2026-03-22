import { useState } from "react";
import { motion } from "motion/react";
import { 
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Image,
  Video,
  Headphones,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Tag
} from "lucide-react";

type ContentType = "all" | "articles" | "videos" | "audios" | "guides";
type ContentStatus = "published" | "draft" | "archived";

export default function AdminContentPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ContentType>("all");

  const contents = [
    {
      id: 1,
      title: "Gérer son stress au travail",
      type: "article",
      category: "Stress & Anxiété",
      access: "Gratuit",
      status: "published",
      views: 1247,
      downloads: 345,
      publishedDate: "15 Jan 2026",
      author: "Dr. Fatou Diop"
    },
    {
      id: 2,
      title: "Méditation guidée de 10 minutes",
      type: "audio",
      category: "Méditation",
      access: "Membres",
      status: "published",
      views: 892,
      downloads: 234,
      publishedDate: "10 Jan 2026",
      author: "Dr. Aminata Ndiaye"
    },
    {
      id: 3,
      title: "Comment améliorer son sommeil",
      type: "video",
      category: "Sommeil",
      access: "Gratuit",
      status: "published",
      views: 2134,
      downloads: 0,
      publishedDate: "5 Jan 2026",
      author: "Dr. Mamadou Sow"
    },
    {
      id: 4,
      title: "Guide complet de la thérapie cognitive",
      type: "guide",
      category: "Thérapie",
      access: "Membres",
      status: "draft",
      views: 0,
      downloads: 0,
      publishedDate: "Brouillon",
      author: "Dr. Fatou Diop"
    },
    {
      id: 5,
      title: "Exercices de respiration",
      type: "article",
      category: "Bien-être",
      access: "Gratuit",
      status: "published",
      views: 1567,
      downloads: 678,
      publishedDate: "20 Jan 2026",
      author: "Dr. Aminata Ndiaye"
    }
  ];

  const stats = {
    total: 127,
    articles: 45,
    videos: 23,
    audios: 34,
    guides: 25,
    published: 98,
    drafts: 18,
    totalViews: 45678,
    totalDownloads: 12345
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "video":
        return <Video className="w-5 h-5 text-purple-600" />;
      case "audio":
        return <Headphones className="w-5 h-5 text-green-600" />;
      case "guide":
        return <FileText className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: ContentStatus) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Publié
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            <Clock className="w-3 h-3" />
            Brouillon
          </span>
        );
      case "archived":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Archivé
          </span>
        );
    }
  };

  const getAccessBadge = (access: string) => {
    if (access === "Membres") {
      return <span className="px-2 py-0.5 bg-[#D4A574]/20 text-[#D4A574] rounded-full text-xs font-medium">Membres</span>;
    }
    return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Gratuit</span>;
  };

  const filteredContents = contents.filter(content => {
    const matchesSearch = searchQuery === "" || 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === "all" || 
      (activeFilter === "articles" && content.type === "article") ||
      (activeFilter === "videos" && content.type === "video") ||
      (activeFilter === "audios" && content.type === "audio") ||
      (activeFilter === "guides" && content.type === "guide");
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-lg font-serif text-[#1A1A1A]">Gestion des contenus</h1>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#2A2A2A] transition-colors">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nouveau contenu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Total</p>
            <p className="text-2xl font-light text-[#1A1A1A]">{stats.total}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Articles</p>
            <p className="text-2xl font-light text-blue-600">{stats.articles}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Vidéos</p>
            <p className="text-2xl font-light text-purple-600">{stats.videos}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Audios</p>
            <p className="text-2xl font-light text-green-600">{stats.audios}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Vues</p>
            <p className="text-2xl font-light text-[#1A1A1A]">{stats.totalViews.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <p className="text-xs text-[#1A1A1A]/60 mb-1">Téléch.</p>
            <p className="text-2xl font-light text-[#1A1A1A]">{stats.totalDownloads.toLocaleString()}</p>
          </motion.div>
        </div>

        {/* Recherche */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
            <input
              type="text"
              placeholder="Rechercher un contenu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#D4C5B9] rounded-full text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#A68B6F] transition-colors"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-white border border-[#D4C5B9] px-6 py-3 rounded-full text-sm text-[#1A1A1A] hover:bg-[#F5F1ED] transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </button>
        </div>

        {/* Filtres rapides */}
        <div className="inline-flex bg-white rounded-full p-1 border border-[#D4C5B9] overflow-x-auto">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === "all" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setActiveFilter("articles")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === "articles" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
            }`}
          >
            Articles
          </button>
          <button
            onClick={() => setActiveFilter("videos")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === "videos" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
            }`}
          >
            Vidéos
          </button>
          <button
            onClick={() => setActiveFilter("audios")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === "audios" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
            }`}
          >
            Audios
          </button>
          <button
            onClick={() => setActiveFilter("guides")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeFilter === "guides" ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/60"
            }`}
          >
            Guides
          </button>
        </div>

        {/* Liste des contenus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {filteredContents.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-5 border border-[#D4C5B9] hover:shadow-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row items-start gap-4">
                {/* Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-[#F5F1ED] rounded-xl flex items-center justify-center flex-shrink-0">
                    {getTypeIcon(content.type)}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base font-medium text-[#1A1A1A] mb-2">
                      {content.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {getStatusBadge(content.status)}
                      {getAccessBadge(content.access)}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F5F1ED] text-[#1A1A1A]/80 rounded-full text-xs">
                        <Tag className="w-3 h-3" />
                        {content.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#1A1A1A]/60">
                      <span>Par {content.author}</span>
                      <span>•</span>
                      <span>{content.publishedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4">
                  <div className="text-center p-3 bg-[#F5F1ED] rounded-xl">
                    <Eye className="w-4 h-4 text-[#1A1A1A]/60 mx-auto mb-1" />
                    <p className="text-lg font-light text-[#1A1A1A] mb-1">{content.views.toLocaleString()}</p>
                    <p className="text-xs text-[#1A1A1A]/60">Vues</p>
                  </div>

                  {content.downloads > 0 && (
                    <div className="text-center p-3 bg-[#F5F1ED] rounded-xl">
                      <Download className="w-4 h-4 text-[#1A1A1A]/60 mx-auto mb-1" />
                      <p className="text-lg font-light text-[#1A1A1A] mb-1">{content.downloads.toLocaleString()}</p>
                      <p className="text-xs text-[#1A1A1A]/60">Téléch.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-[#D4C5B9] flex gap-2">
                <button className="flex-1 bg-[#F5F1ED] hover:bg-[#E5DED6] text-[#1A1A1A] rounded-full py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Eye className="w-4 h-4" />
                  Prévisualiser
                </button>
                <button className="flex-1 bg-[#F5F1ED] hover:bg-[#E5DED6] text-[#1A1A1A] rounded-full py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                <button className="px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-full py-2 text-sm font-medium transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </main>

      {/* Navigation PWA Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] safe-area-inset-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-xs">Dashboard</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs">Utilisateurs</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-xs">Analytics</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
              <div className="w-10 h-10 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-xs">Paramètres</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="h-20"></div>
    </div>
  );
}
