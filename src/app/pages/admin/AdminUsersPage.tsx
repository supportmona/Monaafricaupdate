import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  Users, Search, Download, Eye, Ban, CheckCircle, XCircle,
  MoreVertical, Mail, Phone, MapPin, Calendar, Activity,
  LayoutDashboard, BarChart3, Settings, UserPlus, AlertCircle,
  RefreshCw, Loader2, X, Shield,
} from "lucide-react";

const API = `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81`;

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  status: "active" | "suspended" | "deleted";
  membership_type: "free" | "cercle";
  created_at: string;
  last_activity?: string;
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({ total: 0, active: 0, suspended: 0, cercleMembers: 0 });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadUsers(); loadStats(); }, [searchQuery, filterType, filterStatus]);

  const loadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (filterStatus !== "all") params.append("status", filterStatus);
      if (filterType !== "all") params.append("membershipType", filterType);
      params.append("limit", "100");

      const res = await fetch(`${API}/admin/users-sql?${params}`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        setError("Impossible de charger les utilisateurs");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetch(`${API}/admin/users-sql/stats`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) setStats(data.stats);
      }
    } catch {}
  };

  const handleSuspend = async (userId: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`${API}/admin/users-sql/${userId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ reason: "Suspendu par l'administrateur" }),
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: "suspended" } : u));
        setStats(prev => ({ ...prev, active: prev.active - 1, suspended: prev.suspended + 1 }));
      }
    } catch {} finally {
      setActionLoading(null);
      setOpenMenu(null);
    }
  };

  const handleReactivate = async (userId: string) => {
    setActionLoading(userId);
    try {
      const res = await fetch(`${API}/admin/users-sql/${userId}/reactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: "active" } : u));
        setStats(prev => ({ ...prev, active: prev.active + 1, suspended: prev.suspended - 1 }));
      }
    } catch {} finally {
      setActionLoading(null);
      setOpenMenu(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Supprimer définitivement cet utilisateur ?")) return;
    setActionLoading(userId);
    try {
      const res = await fetch(`${API}/admin/users-sql/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        setStats(prev => ({ ...prev, total: prev.total - 1 }));
      }
    } catch {} finally {
      setActionLoading(null);
      setOpenMenu(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
      active:    { label: "Actif",     cls: "bg-green-100 text-green-700", icon: <CheckCircle className="w-3 h-3" /> },
      suspended: { label: "Suspendu",  cls: "bg-red-100 text-red-700",     icon: <Ban className="w-3 h-3" /> },
      deleted:   { label: "Supprimé",  cls: "bg-gray-100 text-gray-600",   icon: <XCircle className="w-3 h-3" /> },
    };
    const s = map[status] || map.deleted;
    return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>{s.icon}{s.label}</span>;
  };

  const getTypeBadge = (type: string) => (
    type === "cercle"
      ? <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Cercle</span>
      : <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Membre</span>
  );

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate("/admin/dashboard")}
                className="w-10 h-10 hover:bg-[#F5F1ED] rounded-full flex items-center justify-center transition-colors">
                <LayoutDashboard className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <div>
                <h1 className="text-lg font-serif text-[#1A1A1A]">Gestion Utilisateurs</h1>
                <p className="text-xs text-[#1A1A1A]/60">{stats.total} membres au total</p>
              </div>
            </div>
            <button onClick={() => { loadUsers(); loadStats(); }}
              className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
              <RefreshCw className="w-5 h-5 text-[#1A1A1A]/60" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Users className="w-6 h-6 text-blue-600" />, value: stats.total, label: "Total" },
            { icon: <CheckCircle className="w-6 h-6 text-green-600" />, value: stats.active, label: "Actifs" },
            { icon: <UserPlus className="w-6 h-6 text-purple-600" />, value: stats.cercleMembers, label: "Cercle" },
            { icon: <Activity className="w-6 h-6 text-red-500" />, value: stats.suspended, label: "Suspendus" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-4 border border-[#D4C5B9]">
              {s.icon}
              <p className="text-2xl font-light text-[#1A1A1A] mt-2">{s.value}</p>
              <p className="text-xs text-[#1A1A1A]/60">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white rounded-2xl p-4 border border-[#D4C5B9]">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
              <input type="text" placeholder="Rechercher par nom ou email..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-[#D4C5B9] rounded-full focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              className="px-4 py-3 border border-[#D4C5B9] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#A68B6F]">
              <option value="all">Tous les types</option>
              <option value="free">Membres</option>
              <option value="cercle">Cercle</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-[#D4C5B9] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#A68B6F]">
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="suspended">Suspendus</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#A68B6F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-[#D4C5B9] text-center">
            <AlertCircle className="w-12 h-12 text-[#1A1A1A]/20 mx-auto mb-4" />
            <p className="text-[#1A1A1A]/60">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#D4C5B9] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F5F1ED]">
                  <tr>
                    {["Utilisateur", "Contact", "Type", "Statut", "Inscrit le", "Actions"].map(h => (
                      <th key={h} className="text-left py-4 px-6 text-xs font-medium text-[#1A1A1A]/60 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="border-b border-[#D4C5B9] hover:bg-[#F5F1ED]/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#A68B6F] to-[#D4A574] rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                            {(user.name || "?")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-[#1A1A1A]">{user.name || "—"}</p>
                            {(user.city || user.country) && (
                              <p className="text-xs text-[#1A1A1A]/60 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {[user.city, user.country].filter(Boolean).join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1 text-sm text-[#1A1A1A]/70">
                          <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{user.email}</div>
                          {user.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{user.phone}</div>}
                        </div>
                      </td>
                      <td className="py-4 px-6">{getTypeBadge(user.membership_type)}</td>
                      <td className="py-4 px-6">{getStatusBadge(user.status)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-xs text-[#1A1A1A]/60">
                          <Calendar className="w-3.5 h-3.5" />
                          {user.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : "—"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="relative">
                          <button onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                            disabled={actionLoading === user.id}
                            className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                            {actionLoading === user.id
                              ? <Loader2 className="w-4 h-4 animate-spin text-[#A68B6F]" />
                              : <MoreVertical className="w-4 h-4 text-[#1A1A1A]/60" />}
                          </button>
                          {openMenu === user.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-[#D4C5B9] shadow-lg z-20">
                              <button onClick={() => setSelectedUser(user)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F1ED] text-sm text-[#1A1A1A] transition-colors rounded-t-xl">
                                <Eye className="w-4 h-4" />Voir détails
                              </button>
                              {user.status === "active" ? (
                                <button onClick={() => handleSuspend(user.id)}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-red-600 transition-colors">
                                  <Ban className="w-4 h-4" />Suspendre
                                </button>
                              ) : (
                                <button onClick={() => handleReactivate(user.id)}
                                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-sm text-green-600 transition-colors">
                                  <CheckCircle className="w-4 h-4" />Réactiver
                                </button>
                              )}
                              <button onClick={() => handleDelete(user.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-sm text-red-600 transition-colors rounded-b-xl border-t border-[#D4C5B9]">
                                <XCircle className="w-4 h-4" />Supprimer
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal détails user */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-[#1A1A1A]">Détails membre</h2>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[#F5F1ED] rounded-2xl">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#A68B6F] to-[#D4A574] rounded-full flex items-center justify-center text-white text-xl font-medium">
                    {(selectedUser.name || "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-serif text-[#1A1A1A] text-lg">{selectedUser.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(selectedUser.status)}
                      {getTypeBadge(selectedUser.membership_type)}
                    </div>
                  </div>
                </div>
                {[
                  { icon: <Mail className="w-4 h-4 text-[#A68B6F]" />, label: "Email", value: selectedUser.email },
                  { icon: <Phone className="w-4 h-4 text-[#A68B6F]" />, label: "Téléphone", value: selectedUser.phone || "—" },
                  { icon: <MapPin className="w-4 h-4 text-[#A68B6F]" />, label: "Localisation", value: [selectedUser.city, selectedUser.country].filter(Boolean).join(", ") || "—" },
                  { icon: <Calendar className="w-4 h-4 text-[#A68B6F]" />, label: "Inscrit le", value: selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#F5F1ED] rounded-xl">
                    {item.icon}
                    <div>
                      <p className="text-xs text-[#1A1A1A]/60">{item.label}</p>
                      <p className="text-sm text-[#1A1A1A]">{item.value}</p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3 pt-2">
                  {selectedUser.status === "active" ? (
                    <button onClick={() => { handleSuspend(selectedUser.id); setSelectedUser(null); }}
                      className="flex-1 py-3 bg-red-50 text-red-600 border border-red-200 rounded-full text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                      <Ban className="w-4 h-4" />Suspendre
                    </button>
                  ) : (
                    <button onClick={() => { handleReactivate(selectedUser.id); setSelectedUser(null); }}
                      className="flex-1 py-3 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />Réactiver
                    </button>
                  )}
                  <button onClick={() => setSelectedUser(null)}
                    className="flex-1 py-3 border border-[#D4C5B9] rounded-full text-sm hover:bg-[#F5F1ED] transition-colors">
                    Fermer
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            {[
              { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", path: "/admin/dashboard" },
              { icon: <Users className="w-5 h-5" />, label: "Utilisateurs", path: "/admin/users", active: true },
              { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics", path: "/admin/analytics" },
              { icon: <Settings className="w-5 h-5" />, label: "Paramètres", path: "/admin/settings" },
            ].map((item, i) => (
              <button key={i} onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 transition-colors ${(item as any).active ? "text-[#1A1A1A]" : "text-[#1A1A1A]/60 hover:text-[#1A1A1A]"}`}>
                {(item as any).active
                  ? <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white">{item.icon}</div>
                  : <div className="w-10 h-10 flex items-center justify-center">{item.icon}</div>}
                <span className={`text-xs ${(item as any).active ? "font-medium" : ""}`}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div className="h-20" />
    </div>
  );
}
