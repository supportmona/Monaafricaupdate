import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  Stethoscope, Search, Download, Eye, CheckCircle, XCircle,
  Clock, Mail, Phone, Calendar, Star, Video, DollarSign,
  AlertCircle, MoreVertical, Ban, LayoutDashboard, Users,
  BarChart3, Settings, ShieldCheck, Plus, X, Save, Loader2,
  RefreshCw,
} from "lucide-react";

const API = `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81`;

type ExpertStatus = "all" | "approved" | "pending" | "rejected";

interface Expert {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profession: string;
  specialty?: string;
  licenseNumber: string;
  status: string;
  city?: string;
  country?: string;
  submittedAt?: string;
  approvedAt?: string;
  experience?: string;
}

const emptyForm = {
  firstName: "", lastName: "", email: "", phone: "",
  profession: "Psychiatre", licenseNumber: "", city: "", country: "",
  experience: "", specialties: [] as string[], languages: ["Français"],
};

export default function AdminExpertsPage() {
  const navigate = useNavigate();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ExpertStatus>("all");
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => { loadExperts(); }, []);

  const loadExperts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/expert/applications`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        setExperts(data.data || []);
      }
    } catch (e) {
      console.error("Erreur chargement experts:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Approuver un expert ───────────────────────────────────────────────────
  const handleApprove = async (expertId: string) => {
    setActionLoading(expertId);
    try {
      const res = await fetch(`${API}/expert/application/${expertId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ status: "approved" }),
      });
      if (res.ok) {
        setExperts(prev => prev.map(e => e.id === expertId ? { ...e, status: "approved" } : e));
      }
    } catch (e) {
      console.error("Erreur approbation:", e);
    } finally {
      setActionLoading(null);
      setShowActionsMenu(null);
    }
  };

  // ── Rejeter un expert ─────────────────────────────────────────────────────
  const handleReject = async (expertId: string) => {
    setActionLoading(expertId);
    try {
      const res = await fetch(`${API}/expert/application/${expertId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (res.ok) {
        setExperts(prev => prev.map(e => e.id === expertId ? { ...e, status: "rejected" } : e));
      }
    } catch (e) {
      console.error("Erreur rejet:", e);
    } finally {
      setActionLoading(null);
      setShowActionsMenu(null);
    }
  };

  // ── Créer un expert ───────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.profession || !form.licenseNumber) {
      setCreateError("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      const res = await fetch(`${API}/expert/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ ...form, status: "approved" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowCreateModal(false);
        setForm(emptyForm);
        await loadExperts();
      } else {
        setCreateError(data.error || "Erreur lors de la création");
      }
    } catch (e) {
      setCreateError("Erreur réseau");
    } finally {
      setCreating(false);
    }
  };

  const filteredExperts = experts.filter(expert => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      `${expert.firstName} ${expert.lastName}`.toLowerCase().includes(q) ||
      expert.email?.toLowerCase().includes(q) ||
      expert.profession?.toLowerCase().includes(q);
    const matchesFilter = activeFilter === "all" || expert.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: experts.length,
    approved: experts.filter(e => e.status === "approved").length,
    pending: experts.filter(e => e.status === "pending").length,
    rejected: experts.filter(e => e.status === "rejected").length,
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
      approved: { label: "Approuvé", cls: "bg-green-100 text-green-700", icon: <CheckCircle className="w-3 h-3" /> },
      pending:  { label: "En attente", cls: "bg-orange-100 text-orange-700", icon: <Clock className="w-3 h-3" /> },
      rejected: { label: "Rejeté", cls: "bg-red-100 text-red-700", icon: <XCircle className="w-3 h-3" /> },
    };
    const s = map[status] || { label: status, cls: "bg-gray-100 text-gray-600", icon: null };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
        {s.icon}{s.label}
      </span>
    );
  };

  const inputClass = "w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F] text-sm";
  const labelClass = "block text-sm font-medium text-[#1A1A1A] mb-2";

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/admin/dashboard")}
                className="w-10 h-10 hover:bg-[#F5F1ED] rounded-full flex items-center justify-center transition-colors">
                <LayoutDashboard className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <div>
                <h1 className="text-lg font-serif text-[#1A1A1A]">Gestion des experts</h1>
                <p className="text-xs text-[#1A1A1A]/60">{filteredExperts.length} expert{filteredExperts.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadExperts} className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
                <RefreshCw className="w-5 h-5 text-[#1A1A1A]/60" />
              </button>
              <button onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#2A2A2A] transition-colors">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nouvel expert</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-[#1A1A1A]" },
            { label: "Approuvés", value: stats.approved, color: "text-green-600" },
            { label: "En attente", value: stats.pending, color: "text-orange-600" },
            { label: "Rejetés", value: stats.rejected, color: "text-red-500" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 border border-[#D4C5B9]">
              <p className="text-xs text-[#1A1A1A]/60 mb-1">{s.label}</p>
              <p className={`text-2xl font-light ${s.color}`}>{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Recherche */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
            <input type="text" placeholder="Rechercher un expert..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#D4C5B9] rounded-full text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#A68B6F] transition-colors" />
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["all", "approved", "pending", "rejected"] as ExpertStatus[]).map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === f ? "bg-[#1A1A1A] text-white" : "bg-white border border-[#D4C5B9] text-[#1A1A1A]/60 hover:bg-[#F5F1ED]"
              }`}>
              {f === "all" ? "Tous" : f === "approved" ? "Approuvés" : f === "pending" ? "En attente" : "Rejetés"}
            </button>
          ))}
        </div>

        {/* Liste */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#A68B6F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredExperts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-[#D4C5B9] text-center">
            <Stethoscope className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">Aucun expert</h3>
            <p className="text-[#1A1A1A]/60 mb-6">
              {searchQuery || activeFilter !== "all" ? "Modifiez vos filtres" : "Créez votre premier expert"}
            </p>
            {!searchQuery && activeFilter === "all" && (
              <button onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors">
                <Plus className="w-4 h-4" />Nouvel expert
              </button>
            )}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={activeFilter} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }} className="space-y-3">
              {filteredExperts.map((expert, index) => (
                <motion.div key={expert.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-white rounded-2xl p-5 border border-[#D4C5B9] hover:shadow-md transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-lg flex-shrink-0">
                        {(expert.firstName?.[0] || "?")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-base font-medium text-[#1A1A1A]">
                            {expert.firstName} {expert.lastName}
                          </h3>
                          {expert.status === "approved" && <ShieldCheck className="w-4 h-4 text-green-600" />}
                          {getStatusBadge(expert.status)}
                        </div>
                        <p className="text-sm text-purple-600 mb-2">{expert.profession}</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/60">
                            <Mail className="w-3.5 h-3.5" />{expert.email}
                          </div>
                          {expert.phone && (
                            <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/60">
                              <Phone className="w-3.5 h-3.5" />{expert.phone}
                            </div>
                          )}
                          {(expert.city || expert.country) && (
                            <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/60">
                              <span>{[expert.city, expert.country].filter(Boolean).join(", ")}</span>
                            </div>
                          )}
                        </div>
                        {expert.submittedAt && (
                          <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/40 mt-2">
                            <Calendar className="w-3.5 h-3.5" />
                            Candidature : {new Date(expert.submittedAt).toLocaleDateString("fr-FR")}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {expert.status === "pending" && (
                        <>
                          <button onClick={() => handleApprove(expert.id)} disabled={actionLoading === expert.id}
                            className="p-2 bg-green-50 hover:bg-green-100 rounded-full transition-colors" title="Approuver">
                            {actionLoading === expert.id
                              ? <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                              : <CheckCircle className="w-4 h-4 text-green-600" />}
                          </button>
                          <button onClick={() => handleReject(expert.id)} disabled={actionLoading === expert.id}
                            className="p-2 bg-red-50 hover:bg-red-100 rounded-full transition-colors" title="Rejeter">
                            <XCircle className="w-4 h-4 text-red-500" />
                          </button>
                        </>
                      )}
                      {expert.status === "approved" && (
                        <span className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs">
                          <CheckCircle className="w-3 h-3" />Approuvé
                        </span>
                      )}
                      {expert.status === "rejected" && (
                        <button onClick={() => handleApprove(expert.id)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors">
                          Réactiver
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Modal Créer un expert */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-[#D4C5B9] p-6 flex items-center justify-between z-10">
                <h2 className="text-xl font-serif text-[#1A1A1A]">Nouvel expert</h2>
                <button onClick={() => { setShowCreateModal(false); setCreateError(null); }}
                  className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                  <X className="w-5 h-5 text-[#1A1A1A]" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                {createError && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{createError}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Prénom *</label>
                    <input type="text" value={form.firstName}
                      onChange={e => setForm({ ...form, firstName: e.target.value })}
                      placeholder="Dr. Sarah" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Nom *</label>
                    <input type="text" value={form.lastName}
                      onChange={e => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Koné" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="sarah.kone@monafrica.net" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Téléphone</label>
                    <input type="text" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+225 07 00 00 00" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Profession *</label>
                    <select value={form.profession}
                      onChange={e => setForm({ ...form, profession: e.target.value })}
                      className={inputClass}>
                      <option>Psychiatre</option>
                      <option>Psychologue</option>
                      <option>Psychothérapeute</option>
                      <option>Médecin généraliste</option>
                      <option>Autre</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Numéro d'ordre / Licence *</label>
                  <input type="text" value={form.licenseNumber}
                    onChange={e => setForm({ ...form, licenseNumber: e.target.value })}
                    placeholder="PSY-2024-001" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Ville</label>
                    <input type="text" value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      placeholder="Abidjan" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Pays</label>
                    <input type="text" value={form.country}
                      onChange={e => setForm({ ...form, country: e.target.value })}
                      placeholder="Côte d'Ivoire" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Expérience</label>
                  <input type="text" value={form.experience}
                    onChange={e => setForm({ ...form, experience: e.target.value })}
                    placeholder="Ex: 10 ans en psychiatrie clinique" className={inputClass} />
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-800">
                  Un email d'invitation sera automatiquement envoyé à l'expert avec ses identifiants de connexion. Statut : approuvé par défaut.
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setShowCreateModal(false); setCreateError(null); }}
                    className="flex-1 py-3 border border-[#D4C5B9] rounded-full hover:bg-[#F5F1ED] transition-colors text-sm">
                    Annuler
                  </button>
                  <button onClick={handleCreate} disabled={creating}
                    className="flex-1 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                    {creating ? <><Loader2 className="w-4 h-4 animate-spin" />Création...</> : <><Save className="w-4 h-4" />Créer l'expert</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Nav bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {[
              { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", path: "/admin/dashboard" },
              { icon: <Users className="w-5 h-5" />, label: "Utilisateurs", path: "/admin/users" },
              { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", path: "/admin/analytics" },
              { icon: <Settings className="w-5 h-5" />, label: "Paramètres", path: "/admin/settings" },
            ].map((item, i) => (
              <button key={i} onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors">
                <div className="w-10 h-10 flex items-center justify-center">{item.icon}</div>
                <span className="text-xs">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div className="h-20" />
    </div>
  );
}
