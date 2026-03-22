import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Upload,
  FileText,
  Download,
  Trash2,
  Search,
  Filter,
  ArrowLeft,
  File,
  Image,
  FileVideo,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function ExpertDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem("mona_expert_token");
      if (!token) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/documents/list`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data || []);
      }
    } catch (error) {
      console.error("Erreur chargement documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const token = localStorage.getItem("mona_expert_token");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", "general");
      formData.append("notes", "");

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/documents/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token!,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDocuments([data.data, ...documents]);
        alert("Document uploadé avec succès");
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de l'upload");
      }
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Une erreur est survenue");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDownload = async (documentId: string) => {
    try {
      const token = localStorage.getItem("mona_expert_token");

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/documents/${documentId}/download`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token!,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        window.open(data.data.url, "_blank");
      } else {
        alert("Erreur lors du téléchargement");
      }
    } catch (error) {
      console.error("Erreur download:", error);
      alert("Une erreur est survenue");
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("mona_expert_token");

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/documents/${documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Expert-Token": token!,
          },
        }
      );

      if (response.ok) {
        setDocuments(documents.filter((d) => d.id !== documentId));
        alert("Document supprimé");
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
      alert("Une erreur est survenue");
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image className="w-6 h-6" />;
    } else if (fileType.startsWith("video/")) {
      return <FileVideo className="w-6 h-6" />;
    } else {
      return <File className="w-6 h-6" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" || doc.documentType === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#A68B6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1A1A1A]/60">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/expert/dashboard"
                className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#1A1A1A]/60" />
              </Link>
              <div>
                <h1 className="text-2xl font-serif text-[#1A1A1A]">
                  Mes documents
                </h1>
                <p className="text-sm text-[#1A1A1A]/60 mt-1">
                  {documents.length} document{documents.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-full hover:bg-[#2A2A2A] transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Upload..." : "Uploader"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 border border-[#D4C5B9] mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                <input
                  type="text"
                  placeholder="Rechercher un document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#D4C5B9] rounded-full focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#1A1A1A]/60" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 border border-[#D4C5B9] rounded-full focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent"
              >
                <option value="all">Tous les types</option>
                <option value="general">Général</option>
                <option value="prescription">Prescriptions</option>
                <option value="report">Rapports</option>
                <option value="other">Autres</option>
              </select>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-[#D4C5B9] text-center">
            <FileText className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
            <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">
              Aucun document
            </h3>
            <p className="text-sm text-[#1A1A1A]/60 mb-6">
              {searchQuery
                ? "Aucun document ne correspond à votre recherche"
                : "Commencez par uploader votre premier document"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#1A1A1A] text-white px-6 py-3 rounded-full hover:bg-[#2A2A2A] transition-colors inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Uploader un document
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 border border-[#D4C5B9] hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#A68B6F]/10 rounded-xl flex items-center justify-center text-[#A68B6F]">
                    {getFileIcon(doc.fileType)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(doc.id)}
                      className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
                      title="Télécharger"
                    >
                      <Download className="w-4 h-4 text-[#1A1A1A]/60" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 hover:bg-red-50 rounded-full transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                <h3 className="font-medium text-[#1A1A1A] mb-2 truncate">
                  {doc.fileName}
                </h3>

                <div className="space-y-1 text-sm text-[#1A1A1A]/60">
                  <p>Type: {doc.documentType}</p>
                  <p>Taille: {formatFileSize(doc.fileSize)}</p>
                  <p>
                    Uploadé le:{" "}
                    {new Date(doc.uploadedAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                {doc.notes && (
                  <p className="mt-3 text-sm text-[#1A1A1A]/80 line-clamp-2">
                    {doc.notes}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
