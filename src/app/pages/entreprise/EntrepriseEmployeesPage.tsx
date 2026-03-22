import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import {
  Building,
  Users,
  Search,
  Filter,
  Download,
  UserPlus,
  Mail,
  Send,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MoreVertical,
  TrendingUp,
  Heart,
  Calendar,
  Activity,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: "invited" | "active" | "inactive";
  invitedDate: string;
  activatedDate?: string;
  consultations: number;
  wellbeingScore?: number;
  lastActivity?: string;
}

export default function EntrepriseEmployeesPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteDepartment, setInviteDepartment] = useState("");
  const [invitePosition, setInvitePosition] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      // TODO: Remplacer par appel API réel
      const mockEmployees: Employee[] = [
        {
          id: "1",
          name: "Alice Koné",
          email: "alice.kone@safaricom.cd",
          department: "Tech & Produit",
          position: "Product Manager",
          status: "active",
          invitedDate: "2025-01-10",
          activatedDate: "2025-01-11",
          consultations: 3,
          wellbeingScore: 8.2,
          lastActivity: "2025-02-09",
        },
        {
          id: "2",
          name: "Bernard Mutombo",
          email: "bernard.mutombo@safaricom.cd",
          department: "Marketing & Comm",
          position: "Marketing Lead",
          status: "active",
          invitedDate: "2025-01-10",
          activatedDate: "2025-01-12",
          consultations: 5,
          wellbeingScore: 7.8,
          lastActivity: "2025-02-10",
        },
        {
          id: "3",
          name: "Chantal Dibala",
          email: "chantal.dibala@safaricom.cd",
          department: "Ventes",
          position: "Sales Manager",
          status: "invited",
          invitedDate: "2025-02-01",
          consultations: 0,
        },
        {
          id: "4",
          name: "David Mukendi",
          email: "david.mukendi@safaricom.cd",
          department: "Operations",
          position: "Operations Manager",
          status: "active",
          invitedDate: "2025-01-15",
          activatedDate: "2025-01-16",
          consultations: 2,
          wellbeingScore: 8.5,
          lastActivity: "2025-02-08",
        },
        {
          id: "5",
          name: "Emma Tshisekedi",
          email: "emma.tshisekedi@safaricom.cd",
          department: "RH",
          position: "HR Business Partner",
          status: "active",
          invitedDate: "2025-01-10",
          activatedDate: "2025-01-11",
          consultations: 4,
          wellbeingScore: 9.1,
          lastActivity: "2025-02-11",
        },
      ];

      setEmployees(mockEmployees);
    } catch (error) {
      console.error("Erreur chargement collaborateurs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Appel API pour inviter
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: inviteName,
      email: inviteEmail,
      department: inviteDepartment,
      position: invitePosition,
      status: "invited",
      invitedDate: new Date().toISOString().split("T")[0],
      consultations: 0,
    };

    setEmployees([...employees, newEmployee]);
    setShowInviteModal(false);
    setInviteEmail("");
    setInviteName("");
    setInviteDepartment("");
    setInvitePosition("");
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || emp.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || emp.status === filterStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === "active").length,
    invited: employees.filter((e) => e.status === "invited").length,
    avgScore: employees.filter((e) => e.wellbeingScore).reduce((sum, e) => sum + (e.wellbeingScore || 0), 0) / employees.filter((e) => e.wellbeingScore).length || 0,
  };

  const departments = ["Tech & Produit", "Marketing & Comm", "Ventes", "Operations", "RH", "Finance"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-anthracite/60">Chargement des collaborateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige">
      {/* Header */}
      <div className="bg-white border-b border-anthracite/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/entreprise/dashboard")}
                className="p-2 hover:bg-beige rounded-full transition-colors"
              >
                <Building className="w-6 h-6 text-anthracite" />
              </button>
              <div>
                <h1 className="text-2xl font-serif text-anthracite">
                  Gestion des <span className="text-terracotta italic">Collaborateurs</span>
                </h1>
                <p className="text-xs text-anthracite/60">Invitations et suivi des équipes</p>
              </div>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              Inviter des collaborateurs
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-anthracite/5"
          >
            <Users className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-3xl font-serif text-anthracite">{stats.total}</p>
            <p className="text-sm text-anthracite/60">Total collaborateurs</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-anthracite/5"
          >
            <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-3xl font-serif text-anthracite">{stats.active}</p>
            <p className="text-sm text-anthracite/60">Actifs</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-anthracite/5"
          >
            <Clock className="w-8 h-8 text-yellow-500 mb-2" />
            <p className="text-3xl font-serif text-anthracite">{stats.invited}</p>
            <p className="text-sm text-anthracite/60">Invitations en attente</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-anthracite/5"
          >
            <Heart className="w-8 h-8 text-terracotta mb-2" />
            <p className="text-3xl font-serif text-anthracite">{stats.avgScore.toFixed(1)}</p>
            <p className="text-sm text-anthracite/60">Score bien-être moyen</p>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 mb-6 border border-anthracite/5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-anthracite/40" />
              <input
                type="text"
                placeholder="Rechercher un collaborateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-anthracite/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/50"
              />
            </div>
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-4 py-3 border border-anthracite/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/50"
            >
              <option value="all">Tous les départements</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-anthracite/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/50"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="invited">Invités</option>
              <option value="inactive">Inactifs</option>
            </select>
            <button className="px-4 py-3 border border-anthracite/20 rounded-2xl hover:bg-beige transition-colors flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exporter
            </button>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-2xl border border-anthracite/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige/50">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Collaborateur
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Poste
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Consultations
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Bien-être
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp, index) => (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-anthracite/5 hover:bg-beige/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-gold rounded-full flex items-center justify-center text-white font-medium">
                          {emp.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium text-anthracite">{emp.name}</p>
                          <p className="text-sm text-anthracite/60">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-anthracite">{emp.department}</td>
                    <td className="py-4 px-6 text-sm text-anthracite">{emp.position}</td>
                    <td className="py-4 px-6 text-sm text-anthracite">{emp.consultations}</td>
                    <td className="py-4 px-6">
                      {emp.wellbeingScore ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-anthracite/10 rounded-full h-2 w-20 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-terracotta to-gold rounded-full"
                              style={{ width: `${(emp.wellbeingScore / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-anthracite">{emp.wellbeingScore}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-anthracite/40">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {emp.status === "active" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          Actif
                        </span>
                      )}
                      {emp.status === "invited" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">
                          <Clock className="w-3 h-3" />
                          Invité
                        </span>
                      )}
                      {emp.status === "inactive" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-full">
                          <XCircle className="w-3 h-3" />
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-beige rounded-lg transition-colors" title="Voir détails">
                          <Eye className="w-4 h-4 text-anthracite/60" />
                        </button>
                        <button className="p-2 hover:bg-beige rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-anthracite/40" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-serif text-anthracite mb-1">Inviter un collaborateur</h2>
                  <p className="text-sm text-anthracite/60">Ajoutez un nouveau membre à M.O.N.A</p>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 hover:bg-beige rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleInviteEmployee} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Jean Dupont"
                    required
                    className="w-full px-4 py-3 border border-anthracite/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">Email professionnel</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="jean.dupont@safaricom.cd"
                    required
                    className="w-full px-4 py-3 border border-anthracite/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">Département</label>
                  <select
                    value={inviteDepartment}
                    onChange={(e) => setInviteDepartment(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-anthracite/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                  >
                    <option value="">Sélectionner...</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">Poste</label>
                  <input
                    type="text"
                    value={invitePosition}
                    onChange={(e) => setInvitePosition(e.target.value)}
                    placeholder="Manager"
                    required
                    className="w-full px-4 py-3 border border-anthracite/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-anthracite text-white py-3.5 rounded-full font-medium hover:bg-anthracite/90 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Envoyer l'invitation
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
