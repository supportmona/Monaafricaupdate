import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  Building2,
  Users,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreVertical,
  UserPlus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  phone: string;
  status: "active" | "inactive" | "on_leave";
  joinDate: string;
  salary?: number;
  performance?: number;
  avatar?: string;
}

export default function RHTeamPage() {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Charger les membres de l'équipe
  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    setIsLoading(true);
    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/rh/team`);
      
      // Données mockées pour le prototype
      const mockData: TeamMember[] = [
        {
          id: "1",
          name: "Aminata Diallo",
          email: "aminata.diallo@monafrica.net",
          role: "Directrice Générale",
          department: "Direction",
          location: "Kinshasa",
          phone: "+243 900 123 456",
          status: "active",
          joinDate: "2023-01-15",
          salary: 8500,
          performance: 98,
        },
        {
          id: "2",
          name: "Jean-Marc Okemba",
          email: "jeanmarc.okemba@monafrica.net",
          role: "Directeur Technique",
          department: "Tech & Produit",
          location: "Kinshasa",
          phone: "+243 900 234 567",
          status: "active",
          joinDate: "2023-02-01",
          salary: 7200,
          performance: 95,
        },
        {
          id: "3",
          name: "Fatoumata Koné",
          email: "fatoumata.kone@monafrica.net",
          role: "Responsable RH",
          department: "Ressources Humaines",
          location: "Abidjan",
          phone: "+225 700 345 678",
          status: "active",
          joinDate: "2023-03-10",
          salary: 6800,
          performance: 92,
        },
        {
          id: "4",
          name: "David Mensah",
          email: "david.mensah@monafrica.net",
          role: "Lead Developer",
          department: "Tech & Produit",
          location: "Dakar",
          phone: "+221 770 456 789",
          status: "active",
          joinDate: "2023-04-05",
          salary: 6500,
          performance: 94,
        },
        {
          id: "5",
          name: "Sarah Nkosi",
          email: "sarah.nkosi@monafrica.net",
          role: "Responsable Marketing",
          department: "Marketing & Comm",
          location: "Kinshasa",
          phone: "+243 900 567 890",
          status: "active",
          joinDate: "2023-05-20",
          salary: 5800,
          performance: 89,
        },
        {
          id: "6",
          name: "Mohamed Touré",
          email: "mohamed.toure@monafrica.net",
          role: "Customer Success Manager",
          department: "Client Success",
          location: "Dakar",
          phone: "+221 770 678 901",
          status: "active",
          joinDate: "2023-06-12",
          salary: 5200,
          performance: 91,
        },
        {
          id: "7",
          name: "Grace Okoro",
          email: "grace.okoro@monafrica.net",
          role: "Senior Designer",
          department: "Design",
          location: "Kinshasa",
          phone: "+243 900 789 012",
          status: "on_leave",
          joinDate: "2023-07-08",
          salary: 5500,
          performance: 87,
        },
        {
          id: "8",
          name: "Ibrahim Camara",
          email: "ibrahim.camara@monafrica.net",
          role: "Backend Developer",
          department: "Tech & Produit",
          location: "Abidjan",
          phone: "+225 700 890 123",
          status: "active",
          joinDate: "2023-08-15",
          salary: 5800,
          performance: 93,
        },
      ];

      setTeamMembers(mockData);
    } catch (error) {
      console.error("Erreur chargement équipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrer les membres
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || member.department === filterDepartment;
    const matchesLocation = filterLocation === "all" || member.location === filterLocation;
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  // Stats
  const stats = {
    total: teamMembers.length,
    active: teamMembers.filter((m) => m.status === "active").length,
    onLeave: teamMembers.filter((m) => m.status === "on_leave").length,
    avgPerformance: Math.round(
      teamMembers.reduce((sum, m) => sum + (m.performance || 0), 0) / teamMembers.length
    ),
  };

  const departments = ["Direction", "Tech & Produit", "Ressources Humaines", "Marketing & Comm", "Client Success", "Design"];
  const locations = ["Kinshasa", "Dakar", "Abidjan"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-anthracite/60">Chargement de l'équipe...</p>
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
                onClick={() => navigate("/rh/dashboard")}
                className="p-2 hover:bg-beige rounded-full transition-colors"
              >
                <Building2 className="w-6 h-6 text-anthracite" />
              </button>
              <div>
                <h1 className="text-2xl font-serif text-anthracite">
                  Équipe <span className="text-terracotta italic">M.O.N.A</span>
                </h1>
                <p className="text-xs text-anthracite/60">Gestion des collaborateurs</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all shadow-lg"
            >
              <UserPlus className="w-4 h-4" />
              Nouveau collaborateur
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 border border-anthracite/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-serif text-anthracite">{stats.total}</p>
            <p className="text-sm text-anthracite/60">Collaborateurs total</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 border border-anthracite/5"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-serif text-anthracite">{stats.active}</p>
            <p className="text-sm text-anthracite/60">Actifs</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-anthracite/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
            <p className="text-3xl font-serif text-anthracite">{stats.onLeave}</p>
            <p className="text-sm text-anthracite/60">En congé</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-6 border border-anthracite/5"
          >
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-gold" />
            </div>
            <p className="text-3xl font-serif text-anthracite">{stats.avgPerformance}%</p>
            <p className="text-sm text-anthracite/60">Performance moyenne</p>
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
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-4 py-3 border border-anthracite/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-terracotta/50"
            >
              <option value="all">Toutes les villes</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <button className="px-4 py-3 border border-anthracite/20 rounded-2xl hover:bg-beige transition-colors flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exporter
            </button>
          </div>
        </div>

        {/* Team Members Table */}
        <div className="bg-white rounded-2xl border border-anthracite/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige/50">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Collaborateur
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Localisation
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Performance
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
                {filteredMembers.map((member, index) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-anthracite/5 hover:bg-beige/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-terracotta to-gold rounded-full flex items-center justify-center text-white font-medium">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium text-anthracite">{member.name}</p>
                          <p className="text-sm text-anthracite/60">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-anthracite">{member.role}</td>
                    <td className="py-4 px-6 text-sm text-anthracite">{member.department}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-sm text-anthracite/70">
                        <MapPin className="w-4 h-4" />
                        {member.location}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-anthracite/10 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-terracotta to-gold rounded-full"
                            style={{ width: `${member.performance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-anthracite">{member.performance}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {member.status === "active" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          Actif
                        </span>
                      )}
                      {member.status === "on_leave" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full">
                          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                          En congé
                        </span>
                      )}
                      {member.status === "inactive" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                          Inactif
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="p-2 hover:bg-beige rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4 text-anthracite/60" />
                        </button>
                        <button
                          className="p-2 hover:bg-beige rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4 text-anthracite/60" />
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

          {filteredMembers.length === 0 && (
            <div className="py-12 text-center">
              <Users className="w-12 h-12 text-anthracite/20 mx-auto mb-4" />
              <p className="text-anthracite/60">Aucun collaborateur trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
