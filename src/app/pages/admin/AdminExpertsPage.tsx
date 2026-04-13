import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  Stethoscope, Search, CheckCircle, XCircle, Clock, Mail, Phone,
  Calendar, AlertCircle, LayoutDashboard, Users, BarChart3, Settings,
  ShieldCheck, Plus, X, Save, Loader2, RefreshCw, Eye, FileText,
  Download, MapPin, Award, Globe, BookOpen, ChevronDown, ChevronUp,
  Send, KeyRound,
} from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────

const API         = `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81`;
const APPROVE_FN  = `https://${projectId}.supabase.co/functions/v1/approve-expert`;

type ExpertStatus = "all" | "approved" | "pending" | "rejected";

interface ExpertFile { name: string; size: number; type: string; data: string; }
interface Expert {
  id: string; firstName: string; lastName: string; email: string; phone: string;
  profession: string; specialty?: string; licenseNumber: string; status: string;
  city?: string; country?: string; submittedAt?: string; experience?: string;
  diplomas?: string; specialties?: string; languages?: string; availability?: string;
  motivation?: string; linkedin?: string;
  generatedEmail?: string;
  tempPassword?: string;  // affiché si SMTP échoue
  files?: { cv?: ExpertFile; diplomas?: ExpertFile; certifications?: ExpertFile; };
}

const emptyForm = {
  firstName: "", lastName: "", email: "", phone: "",
  profession: "Psychiatre", licenseNumber: "", city: "", country: "",
  experience: "", specialties: [] as string[], languages: ["Français"],
};

const fmtSize = (b: number) =>
  b < 1024 ? b + " B" : b < 1048576 ? (b / 1024).toFixed(1) + " KB" : (b / 1048576).toFixed(1) + " MB";

// ─── Composant ────────────────────────────────────────────────────────────────

export default function AdminExpertsPage() {
  const navigate = useNavigate();
  const [experts,               setExperts]               = useState<Expert[]>([]);
  const [isLoading,             setIsLoading]             = useState(true);
  const [searchQuery,           setSearchQuery]           = useState("");
  const [activeFilter,          setActiveFilter]          = useState<ExpertStatus>("all");
  const [showCreateModal,       setShowCreateModal]       = useState(false);
  const [selectedExpert,        setSelectedExpert]        = useState<Expert | null>(null);
  const [expandedMotivation,    setExpandedMotivation]    = useState(false);
  const [form,                  setForm]                  = useState(emptyForm);
  const [creating,              setCreating]              = useState(false);
  const [createError,           setCreateError]           = useState<string | null>(null);
  const [actionLoading,         setActionLoading]         = useState<string | null>(null);
  const [actionFeedback,        setActionFeedback]        = useState<{ id: string; type: "success" | "error"; msg: string } | null>(null);
  const [rejectReason,          setRejectReason]          = useState("");
  const [showRejectInput,       setShowRejectInput]       = useState<string | null>(null); // expert id

  useEffect(() => { loadExperts(); }, []);

  // ── Chargement ──────────────────────────────────────────────────────────────

  const loadExperts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/expert/applications`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (res.ok) { const d = await res.json(); setExperts(d.data || []); }
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  // ── Action centrale : appel à approve-expert Edge Function ─────────────────
  // C'est ici que se passe toute la magie :
  //   1. Génère l'email prenom.nom@monafrica.net
  //   2. Génère le mot de passe temporaire sécurisé
  //   3. Crée le compte Supabase Auth
  //   4. Met à jour la table experts
  //   5. Envoie l'email via Resend (approbation ou rejet)

  const callApproveFunction = async (
    expertId: string,
    action: "approve" | "reject",
    reason?: string
  ): Promise<{
    success: boolean;
    generatedEmail?: string;
    tempPassword?: string;   // disponible si SMTP a échoué
    emailSent?: boolean;
    error?: string;
  }> => {
    const res = await fetch(APPROVE_FN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${publicAnonKey}`,
        apikey: publicAnonKey,
      },
      body: JSON.stringify({ expert_id: expertId, action, reason }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return { success: false, error: data.error ?? `Erreur HTTP ${res.status}` };
    }

    return {
      success:        true,
      generatedEmail: data.generated_email,
      tempPassword:   data.temp_password,
      emailSent:      data.email_sent,
    };
  };

  // ── Approbation ─────────────────────────────────────────────────────────────

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    setActionFeedback(null);
    try {
      const result = await callApproveFunction(id, "approve");

      if (result.success) {
        setExperts(prev =>
          prev.map(e =>
            e.id === id
              ? { ...e, status: "approved", generatedEmail: result.generatedEmail, tempPassword: result.tempPassword }
              : e
          )
        );
        setSelectedExpert(prev =>
          prev?.id === id
            ? { ...prev, status: "approved", generatedEmail: result.generatedEmail, tempPassword: result.tempPassword }
            : prev
        );
        const msg = result.emailSent
          ? `✓ Approuvé · Email envoyé à ${result.generatedEmail}`
          : `✓ Approuvé · Copiez les identifiants : ${result.generatedEmail} / ${result.tempPassword}`;
        setActionFeedback({ id, type: "success", msg });
      } else {
        setActionFeedback({ id, type: "error", msg: result.error ?? "Erreur inconnue" });
      }
    } catch (e) {
      setActionFeedback({ id, type: "error", msg: "Erreur réseau — vérifiez que l'Edge Function approve-expert est déployée" });
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Rejet ───────────────────────────────────────────────────────────────────

  const handleReject = async (id: string, reason?: string) => {
    setActionLoading(id);
    setActionFeedback(null);
    setShowRejectInput(null);
    try {
      const result = await callApproveFunction(id, "reject", reason);

      if (result.success) {
        setExperts(prev => prev.map(e => e.id === id ? { ...e, status: "rejected" } : e));
        setSelectedExpert(prev => prev?.id === id ? { ...prev, status: "rejected" } : prev);
        setActionFeedback({ id, type: "success", msg: "✓ Rejeté · Email de notification envoyé" });
      } else {
        setActionFeedback({ id, type: "error", msg: result.error ?? "Erreur inconnue" });
      }
    } catch (e) {
      setActionFeedback({ id, type: "error", msg: "Erreur réseau" });
      console.error(e);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Créer expert manuellement ────────────────────────────────────────────────

  const handleCreate = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.profession || !form.licenseNumber) {
      setCreateError("Veuillez remplir tous les champs obligatoires."); return;
    }
    setCreating(true); setCreateError(null);
    try {
      const res = await fetch(`${API}/expert/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ ...form, status: "approved" }),
      });
      const d = await res.json();
      if (res.ok && d.success) {
        setShowCreateModal(false); setForm(emptyForm); await loadExperts();
      } else {
        setCreateError(d.error || "Erreur lors de la création");
      }
    } catch { setCreateError("Erreur réseau"); } finally { setCreating(false); }
  };

  const downloadFile = (file: ExpertFile) => {
    const a = document.createElement("a"); a.href = file.data; a.download = file.name; a.click();
  };

  // ── Filtrage ─────────────────────────────────────────────────────────────────

  const filtered = experts.filter(e => {
    const q = searchQuery.toLowerCase();
    return (
      (!searchQuery ||
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.profession?.toLowerCase().includes(q))
      && (activeFilter === "all" || e.status === activeFilter)
    );
  });

  const stats = {
    total:    experts.length,
    approved: experts.filter(e => e.status === "approved").length,
    pending:  experts.filter(e => e.status === "pending").length,
    rejected: experts.filter(e => e.status === "rejected").length,
  };

  // ── Helpers UI ───────────────────────────────────────────────────────────────

  const badge = (status: string) => {
    const m: Record<string, { l: string; c: string; i: React.ReactNode }> = {
      approved: { l: "Approuvé",   c: "bg-green-100 text-green-700",  i: <CheckCircle className="w-3 h-3" /> },
      pending:  { l: "En attente", c: "bg-orange-100 text-orange-700", i: <Clock className="w-3 h-3" /> },
      rejected: { l: "Rejeté",     c: "bg-red-100 text-red-700",      i: <XCircle className="w-3 h-3" /> },
    };
    const s = m[status] || { l: status, c: "bg-gray-100 text-gray-600", i: null };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.c}`}>
        {s.i}{s.l}
      </span>
    );
  };

  const iC = "w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F] text-sm";
  const lC = "block text-sm font-medium text-[#1A1A1A] mb-2";

  // ── Rendu ────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F5F1ED]">

      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/admin/dashboard")} className="w-10 h-10 hover:bg-[#F5F1ED] rounded-full flex items-center justify-center transition-colors">
                <LayoutDashboard className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <div>
                <h1 className="text-lg font-serif text-[#1A1A1A]">Gestion des experts</h1>
                <p className="text-xs text-[#1A1A1A]/60">{filtered.length} expert{filtered.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadExperts} className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
                <RefreshCw className="w-5 h-5 text-[#1A1A1A]/60" />
              </button>
              <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-[#1A1A1A] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#2A2A2A] transition-colors">
                <Plus className="w-4 h-4" /><span className="hidden sm:inline">Nouvel expert</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { l: "Total",      v: stats.total,    c: "text-[#1A1A1A]"   },
            { l: "Approuvés",  v: stats.approved, c: "text-green-600"   },
            { l: "En attente", v: stats.pending,  c: "text-orange-600"  },
            { l: "Rejetés",    v: stats.rejected, c: "text-red-500"     },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 border border-[#D4C5B9]">
              <p className="text-xs text-[#1A1A1A]/60 mb-1">{s.l}</p>
              <p className={`text-2xl font-light ${s.c}`}>{s.v}</p>
            </motion.div>
          ))}
        </div>

        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
          <input type="text" placeholder="Rechercher un expert..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#D4C5B9] rounded-full text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#A68B6F] transition-colors" />
        </div>

        {/* Filtres */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["all", "approved", "pending", "rejected"] as ExpertStatus[]).map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeFilter === f ? "bg-[#1A1A1A] text-white" : "bg-white border border-[#D4C5B9] text-[#1A1A1A]/60 hover:bg-[#F5F1ED]"}`}>
              {f === "all" ? "Tous" : f === "approved" ? "Approuvés" : f === "pending" ? "En attente" : "Rejetés"}
            </button>
          ))}
        </div>

        {/* Liste */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#A68B6F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-[#D4C5B9] text-center">
            <Stethoscope className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
            <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">Aucun expert</h3>
            <p className="text-[#1A1A1A]/60">{searchQuery || activeFilter !== "all" ? "Modifiez vos filtres" : "Aucune candidature pour le moment"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((expert, i) => (
              <motion.div key={expert.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl border border-[#D4C5B9] hover:shadow-md transition-all overflow-hidden">

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                        {expert.firstName?.[0] || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-base font-medium text-[#1A1A1A]">{expert.firstName} {expert.lastName}</h3>
                          {expert.status === "approved" && <ShieldCheck className="w-4 h-4 text-green-600" />}
                          {badge(expert.status)}
                        </div>
                        <p className="text-sm text-[#A68B6F] mb-2">{expert.profession}</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/60"><Mail className="w-3.5 h-3.5" />{expert.email}</div>
                          {expert.generatedEmail && (
                            <div className="flex items-center gap-2 text-xs text-green-700 font-medium">
                              <KeyRound className="w-3.5 h-3.5" />
                              Compte créé : {expert.generatedEmail}
                            </div>
                          )}
                          {expert.phone && <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/60"><Phone className="w-3.5 h-3.5" />{expert.phone}</div>}
                          {expert.city && <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/60"><MapPin className="w-3.5 h-3.5" />{expert.city}</div>}
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {expert.files?.cv            && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs flex items-center gap-1"><FileText className="w-3 h-3" />CV</span>}
                          {expert.files?.diplomas      && <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-xs flex items-center gap-1"><Award className="w-3 h-3" />Diplômes</span>}
                          {expert.files?.certifications && <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs flex items-center gap-1"><BookOpen className="w-3 h-3" />Certif.</span>}
                          {expert.submittedAt          && <span className="text-xs text-[#1A1A1A]/40 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(expert.submittedAt).toLocaleDateString("fr-FR")}</span>}
                        </div>
                      </div>
                    </div>

                    {/* Actions rapides */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => { setSelectedExpert(expert); setExpandedMotivation(false); }}
                        className="p-2 bg-[#F5F1ED] hover:bg-[#E8E0D8] rounded-full transition-colors" title="Voir le dossier">
                        <Eye className="w-4 h-4 text-[#1A1A1A]/60" />
                      </button>

                      {expert.status === "pending" && (
                        <>
                          <button onClick={() => handleApprove(expert.id)} disabled={actionLoading === expert.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-full text-xs font-medium transition-colors disabled:opacity-50"
                            title="Approuver et envoyer les identifiants">
                            {actionLoading === expert.id
                              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              : <Send className="w-3.5 h-3.5" />}
                            Approuver
                          </button>
                          <button
                            onClick={() => setShowRejectInput(showRejectInput === expert.id ? null : expert.id)}
                            disabled={actionLoading === expert.id}
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

                  {/* Champ motif de rejet (inline) */}
                  <AnimatePresence>
                    {showRejectInput === expert.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-[#D4C5B9]">
                        <p className="text-xs font-medium text-[#1A1A1A] mb-2">Motif du rejet (optionnel, inclus dans l'email)</p>
                        <textarea
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          placeholder="Ex : Documents incomplets, licence non vérifiable…"
                          rows={2}
                          className="w-full px-3 py-2 border border-[#D4C5B9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A68B6F] resize-none mb-2"
                        />
                        <div className="flex gap-2">
                          <button onClick={() => { handleReject(expert.id, rejectReason || undefined); setRejectReason(""); }}
                            className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors">
                            <XCircle className="w-4 h-4" />Confirmer le rejet
                          </button>
                          <button onClick={() => { setShowRejectInput(null); setRejectReason(""); }}
                            className="px-4 py-2 border border-[#D4C5B9] rounded-full text-sm hover:bg-[#F5F1ED] transition-colors">
                            Annuler
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Feedback action */}
                  <AnimatePresence>
                    {actionFeedback?.id === expert.id && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`mt-3 px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 ${
                          actionFeedback.type === "success"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                        {actionFeedback.type === "success"
                          ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                        {actionFeedback.msg}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* ── Modal dossier complet ── */}
      <AnimatePresence>
        {selectedExpert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-[#D4C5B9] p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white text-lg font-medium">
                    {selectedExpert.firstName?.[0]}
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-[#1A1A1A]">{selectedExpert.firstName} {selectedExpert.lastName}</h2>
                    <div className="flex items-center gap-2 mt-0.5">{badge(selectedExpert.status)}</div>
                  </div>
                </div>
                <button onClick={() => setSelectedExpert(null)} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Identifiants générés */}
                {selectedExpert.generatedEmail && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
                    <KeyRound className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-green-800">Compte expert créé</p>
                      <p className="text-sm text-green-700 mt-1">Email : <strong>{selectedExpert.generatedEmail}</strong></p>
                      {selectedExpert.tempPassword ? (
                        <>
                          <p className="text-sm text-green-700">Mdp : <strong className="font-mono">{selectedExpert.tempPassword}</strong></p>
                          <p className="text-xs text-amber-600 mt-1 font-medium">⚠ Email non envoyé — transmettez ces identifiants manuellement.</p>
                        </>
                      ) : (
                        <p className="text-xs text-green-600 mt-1">Mot de passe temporaire envoyé par email.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Infos */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: <Stethoscope className="w-4 h-4 text-[#A68B6F]" />, l: "Profession", v: selectedExpert.profession },
                    { icon: <Mail className="w-4 h-4 text-[#A68B6F]" />,        l: "Email",      v: selectedExpert.email },
                    { icon: <Phone className="w-4 h-4 text-[#A68B6F]" />,       l: "Téléphone",  v: selectedExpert.phone || "—" },
                    { icon: <MapPin className="w-4 h-4 text-[#A68B6F]" />,      l: "Ville",      v: selectedExpert.city || "—" },
                    { icon: <Award className="w-4 h-4 text-[#A68B6F]" />,       l: "N° Licence", v: selectedExpert.licenseNumber || "—" },
                    { icon: <Calendar className="w-4 h-4 text-[#A68B6F]" />,    l: "Expérience", v: selectedExpert.experience || "—" },
                  ].map((item, i) => (
                    <div key={i} className="bg-[#F5F1ED] rounded-xl p-3 flex items-start gap-2">
                      {item.icon}
                      <div><p className="text-xs text-[#1A1A1A]/50">{item.l}</p><p className="text-sm text-[#1A1A1A] font-medium">{item.v}</p></div>
                    </div>
                  ))}
                </div>

                {selectedExpert.specialties && <div className="bg-[#F5F1ED] rounded-xl p-4"><p className="text-xs text-[#1A1A1A]/50 mb-1">Spécialités</p><p className="text-sm text-[#1A1A1A]">{selectedExpert.specialties}</p></div>}
                {selectedExpert.languages    && <div className="bg-[#F5F1ED] rounded-xl p-4"><p className="text-xs text-[#1A1A1A]/50 mb-1 flex items-center gap-1"><Globe className="w-3 h-3" />Langues</p><p className="text-sm text-[#1A1A1A]">{selectedExpert.languages}</p></div>}
                {selectedExpert.diplomas     && <div className="bg-[#F5F1ED] rounded-xl p-4"><p className="text-xs text-[#1A1A1A]/50 mb-1">Diplômes & formations</p><p className="text-sm text-[#1A1A1A] whitespace-pre-wrap">{selectedExpert.diplomas}</p></div>}

                {selectedExpert.motivation && (
                  <div className="bg-[#F5F1ED] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[#1A1A1A]/50">Lettre de motivation</p>
                      <button onClick={() => setExpandedMotivation(!expandedMotivation)} className="flex items-center gap-1 text-xs text-[#A68B6F]">
                        {expandedMotivation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {expandedMotivation ? "Réduire" : "Voir tout"}
                      </button>
                    </div>
                    <p className={`text-sm text-[#1A1A1A] ${expandedMotivation ? "" : "line-clamp-3"}`}>{selectedExpert.motivation}</p>
                  </div>
                )}

                {/* Documents */}
                {selectedExpert.files && Object.values(selectedExpert.files).some(Boolean) ? (
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-3">Documents joints</h3>
                    <div className="space-y-2">
                      {selectedExpert.files.cv && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                          <div className="flex items-center gap-3"><FileText className="w-5 h-5 text-blue-600" /><div><p className="text-sm font-medium text-[#1A1A1A]">CV</p><p className="text-xs text-[#1A1A1A]/60">{selectedExpert.files.cv.name} · {fmtSize(selectedExpert.files.cv.size)}</p></div></div>
                          <button onClick={() => downloadFile(selectedExpert.files!.cv!)} className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"><Download className="w-4 h-4 text-blue-600" /></button>
                        </div>
                      )}
                      {selectedExpert.files.diplomas && (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                          <div className="flex items-center gap-3"><Award className="w-5 h-5 text-green-600" /><div><p className="text-sm font-medium text-[#1A1A1A]">Diplômes</p><p className="text-xs text-[#1A1A1A]/60">{selectedExpert.files.diplomas.name} · {fmtSize(selectedExpert.files.diplomas.size)}</p></div></div>
                          <button onClick={() => downloadFile(selectedExpert.files!.diplomas!)} className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors"><Download className="w-4 h-4 text-green-600" /></button>
                        </div>
                      )}
                      {selectedExpert.files.certifications && (
                        <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-100 rounded-xl">
                          <div className="flex items-center gap-3"><BookOpen className="w-5 h-5 text-purple-600" /><div><p className="text-sm font-medium text-[#1A1A1A]">Certifications</p><p className="text-xs text-[#1A1A1A]/60">{selectedExpert.files.certifications.name} · {fmtSize(selectedExpert.files.certifications.size)}</p></div></div>
                          <button onClick={() => downloadFile(selectedExpert.files!.certifications!)} className="p-2 bg-purple-100 hover:bg-purple-200 rounded-full transition-colors"><Download className="w-4 h-4 text-purple-600" /></button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-sm text-[#1A1A1A]/40 py-4">Aucun document joint</p>
                )}

                {/* ── Actions dans le modal ── */}
                {selectedExpert.status === "pending" && (
                  <div className="space-y-3 pt-2">
                    <button onClick={() => handleApprove(selectedExpert.id)} disabled={actionLoading === selectedExpert.id}
                      className="w-full py-3.5 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                      {actionLoading === selectedExpert.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Send className="w-4 h-4" />}
                      Approuver — générer compte & envoyer l'email
                    </button>

                    {/* Rejet avec motif depuis le modal */}
                    <div className="border border-[#D4C5B9] rounded-2xl p-4 space-y-3">
                      <p className="text-sm font-medium text-[#1A1A1A]">Rejeter la candidature</p>
                      <textarea
                        value={rejectReason}
                        onChange={e => setRejectReason(e.target.value)}
                        placeholder="Motif optionnel — sera inclus dans l'email de notification"
                        rows={2}
                        className="w-full px-3 py-2 border border-[#D4C5B9] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                      />
                      <button
                        onClick={() => { handleReject(selectedExpert.id, rejectReason || undefined); setRejectReason(""); }}
                        disabled={actionLoading === selectedExpert.id}
                        className="w-full py-3 bg-red-50 text-red-600 border border-red-200 rounded-full hover:bg-red-100 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                        <XCircle className="w-4 h-4" />Envoyer le rejet
                      </button>
                    </div>

                    {/* Feedback dans le modal */}
                    <AnimatePresence>
                      {actionFeedback?.id === selectedExpert.id && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className={`px-4 py-3 rounded-xl text-sm flex items-center gap-2 ${
                            actionFeedback.type === "success"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}>
                          {actionFeedback.type === "success"
                            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                          {actionFeedback.msg}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {selectedExpert.status === "rejected" && (
                  <button onClick={() => handleApprove(selectedExpert.id)}
                    className="w-full py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors text-sm font-medium">
                    Réactiver — générer compte & envoyer l'email
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Modal créer expert ── */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-[#D4C5B9] p-6 flex items-center justify-between z-10">
                <h2 className="text-xl font-serif text-[#1A1A1A]">Nouvel expert</h2>
                <button onClick={() => { setShowCreateModal(false); setCreateError(null); }} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                {createError && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700">{createError}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lC}>Prénom *</label><input type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="Sarah" className={iC} /></div>
                  <div><label className={lC}>Nom *</label><input type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Koné" className={iC} /></div>
                </div>
                <div><label className={lC}>Email de candidature *</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="sarah.kone@gmail.com" className={iC} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lC}>Téléphone</label><input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+225 07 00 00 00" className={iC} /></div>
                  <div><label className={lC}>Profession *</label>
                    <select value={form.profession} onChange={e => setForm({ ...form, profession: e.target.value })} className={iC}>
                      <option>Psychiatre</option><option>Psychologue</option><option>Psychothérapeute</option><option>Médecin généraliste</option><option>Autre</option>
                    </select>
                  </div>
                </div>
                <div><label className={lC}>N° Ordre / Licence *</label><input type="text" value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} placeholder="PSY-2024-001" className={iC} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={lC}>Ville</label><input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Abidjan" className={iC} /></div>
                  <div><label className={lC}>Pays</label><input type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="Côte d'Ivoire" className={iC} /></div>
                </div>
                <div><label className={lC}>Expérience</label><input type="text" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="Ex: 10 ans en psychiatrie clinique" className={iC} /></div>
                <div className="bg-[#F5F1ED] border border-[#D4C5B9] rounded-xl p-4 text-xs text-[#1A1A1A]/70">
                  L'email <strong>prenom.nom@monafrica.net</strong> et le mot de passe temporaire seront générés et envoyés automatiquement via l'Edge Function <code>approve-expert</code>.
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setShowCreateModal(false); setCreateError(null); }} className="flex-1 py-3 border border-[#D4C5B9] rounded-full hover:bg-[#F5F1ED] transition-colors text-sm">Annuler</button>
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

      {/* Navigation PWA */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {[
              { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard",    path: "/admin/dashboard" },
              { icon: <Users className="w-5 h-5" />,          label: "Utilisateurs", path: "/admin/users" },
              { icon: <BarChart3 className="w-5 h-5" />,      label: "Analytics",    path: "/admin/analytics" },
              { icon: <Settings className="w-5 h-5" />,       label: "Paramètres",   path: "/admin/settings" },
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
