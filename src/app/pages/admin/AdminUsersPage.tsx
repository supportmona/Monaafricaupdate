import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  LayoutDashboard,
  BarChart3,
  Settings,
  UserPlus,
  AlertCircle,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country?: string;
  city?: string;
  status: "active" | "suspended" | "deleted";
  membership_type: "free" | "cercle";
  created_at: string;
  last_activity: string;
  profile_completed: boolean;
}

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    cercleMembers: 0
  });

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [searchQuery, filterType, filterStatus]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (filterType !== 'all') params.append('membershipType', filterType);

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/admin/users-sql?${params.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setUsers(result.users || []);
        console.log('✅ Utilisateurs chargés:', result.users.length);
      } else {
        console.error('❌ Erreur chargement utilisateurs:', result.error);
      }
    } catch (error) {
      console.error('❌ Erreur chargement utilisateurs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/admin/users-sql/stats`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.stats);
        }
      }
    } catch (error) {
      console.error('❌ Erreur chargement stats:', error);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || user.membership_type === filterType;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getAccountTypeBadge = (type: User["membership_type"]) => {
    switch (type) {
      case "free":
        return <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Membre</span>;
      case "cercle":
        return <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Expert</span>;
    }
  };

  const getStatusBadge = (status: User["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Actif
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
            <Ban className="w-3 h-3" />
            Suspendu
          </span>
        );
      case "deleted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" />
            Supprimé
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#A68B6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1A1A1A]/60">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="w-10 h-10 hover:bg-[#F5F1ED] rounded-full flex items-center justify-center transition-colors"
              >
                <LayoutDashboard className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <div>
                <h1 className="text-lg font-serif text-[#1A1A1A]">Gestion Utilisateurs</h1>
                <p className="text-xs text-[#1A1A1A]/60">{filteredUsers.length} utilisateurs</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <Users className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-2xl font-light text-[#1A1A1A]">{stats.total}</p>
            <p className="text-xs text-[#1A1A1A]/60">Total</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-2xl font-light text-[#1A1A1A]">{stats.active}</p>
            <p className="text-xs text-[#1A1A1A]/60">Actifs</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <UserPlus className="w-6 h-6 text-blue-600 mb-2" />
            <p className="text-2xl font-light text-[#1A1A1A]">{stats.cercleMembers}</p>
            <p className="text-xs text-[#1A1A1A]/60">Membres Cercle</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 border border-[#D4C5B9]"
          >
            <Activity className="w-6 h-6 text-purple-600 mb-2" />
            <p className="text-2xl font-light text-[#1A1A1A]">{stats.suspended}</p>
            <p className="text-xs text-[#1A1A1A]/60">Suspendus</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 border border-[#D4C5B9]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-[#D4C5B9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]/50"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-[#D4C5B9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]/50"
            >
              <option value="all">Tous les types</option>
              <option value="free">Membres</option>
              <option value="cercle">Experts</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-[#D4C5B9] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]/50"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="suspended">Suspendus</option>
              <option value="deleted">Supprimés</option>
            </select>
            <button className="px-4 py-3 border border-[#D4C5B9] rounded-2xl hover:bg-[#F5F1ED] transition-colors flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exporter
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-[#D4C5B9] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F1ED]">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-medium text-[#1A1A1A]/60 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-[#1A1A1A]/60 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-[#1A1A1A]/60 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-[#1A1A1A]/60 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-[#1A1A1A]/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-[#D4C5B9] hover:bg-[#F5F1ED]/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#A68B6F] to-[#D4A574] rounded-full flex items-center justify-center text-white font-medium">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium text-[#1A1A1A]">{user.name}</p>
                          <p className="text-sm text-[#1A1A1A]/60 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {user.city}, {user.country}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1 text-sm text-[#1A1A1A]/70">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">{getAccountTypeBadge(user.membership_type)}</td>
                    <td className="py-4 px-6">{getStatusBadge(user.status)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors" title="Voir détails">
                          <Eye className="w-4 h-4 text-[#1A1A1A]/60" />
                        </button>
                        <button className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-[#1A1A1A]/40" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-12 text-center">
              <AlertCircle className="w-12 h-12 text-[#1A1A1A]/20 mx-auto mb-4" />
              <p className="text-[#1A1A1A]/60">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>
      </main>

      {/* Navigation Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] safe-area-inset-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-xs">Dashboard</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-[#1A1A1A]">
              <div className="w-10 h-10 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium">Utilisateurs</span>
            </button>
            <button
              onClick={() => navigate("/admin/analytics")}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Analytics</span>
            </button>
            <button
              onClick={() => navigate("/admin/settings")}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs">Paramètres</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="h-20"></div>
    </div>
  );
}