import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import {
  Building2,
  Users,
  UserCheck,
  Calendar,
  TrendingUp,
  Bell,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Plus,
  FileText,
  DollarSign,
  Target,
  Award,
  Activity,
} from "lucide-react";

export default function RHDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Stats RH
  const stats = [
    {
      label: "Équipe totale",
      value: "47",
      change: "+3 ce mois",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Experts actifs",
      value: "124",
      change: "+12 ce mois",
      trend: "up",
      icon: UserCheck,
      color: "from-terracotta to-red-500",
    },
    {
      label: "Recrutements",
      value: "8",
      change: "5 en cours",
      trend: "neutral",
      icon: Briefcase,
      color: "from-gold to-yellow-600",
    },
    {
      label: "Taux de rétention",
      value: "94%",
      change: "+2% vs. T4",
      trend: "up",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
    },
  ];

  // Membres de l'équipe
  const teamMembers = [
    {
      id: 1,
      name: "Aminata Diallo",
      role: "Directrice Générale",
      department: "Direction",
      email: "aminata.diallo@monafrica.net",
      phone: "+243 900 123 456",
      location: "Kinshasa",
      status: "active",
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Jean-Marc Okemba",
      role: "Directeur Technique",
      department: "Tech & Produit",
      email: "jeanmarc.okemba@monafrica.net",
      phone: "+243 900 234 567",
      location: "Kinshasa",
      status: "active",
      joinDate: "2023-02-01",
    },
    {
      id: 3,
      name: "Fatoumata Koné",
      role: "Responsable RH",
      department: "Ressources Humaines",
      email: "fatoumata.kone@monafrica.net",
      phone: "+225 700 345 678",
      location: "Abidjan",
      status: "active",
      joinDate: "2023-03-10",
    },
    {
      id: 4,
      name: "David Mensah",
      role: "Lead Developer",
      department: "Tech & Produit",
      email: "david.mensah@monafrica.net",
      phone: "+221 770 456 789",
      location: "Dakar",
      status: "active",
      joinDate: "2023-04-05",
    },
    {
      id: 5,
      name: "Sarah Nkosi",
      role: "Responsable Marketing",
      department: "Marketing & Comm",
      email: "sarah.nkosi@monafrica.net",
      phone: "+243 900 567 890",
      location: "Kinshasa",
      status: "active",
      joinDate: "2023-05-20",
    },
  ];

  // Experts récents
  const recentExperts = [
    {
      id: 1,
      name: "Dr. Aïcha Traoré",
      specialty: "Psychologie Clinique",
      status: "pending_validation",
      submittedDate: "2025-02-10",
    },
    {
      id: 2,
      name: "Dr. Mohamed Diop",
      specialty: "Thérapie de Couple",
      status: "approved",
      submittedDate: "2025-02-08",
    },
    {
      id: 3,
      name: "Dr. Grace Okoro",
      specialty: "Thérapie Familiale",
      status: "pending_documents",
      submittedDate: "2025-02-06",
    },
  ];

  // Tâches RH urgentes
  const urgentTasks = [
    {
      id: 1,
      title: "Valider dossier Dr. Traoré",
      priority: "high",
      dueDate: "2025-02-12",
      assignedTo: "Fatoumata Koné",
    },
    {
      id: 2,
      title: "Entretien développeur senior",
      priority: "high",
      dueDate: "2025-02-13",
      assignedTo: "Jean-Marc Okemba",
    },
    {
      id: 3,
      title: "Renouvellement contrat consultant",
      priority: "medium",
      dueDate: "2025-02-15",
      assignedTo: "Fatoumata Koné",
    },
  ];

  return (
    <div className="min-h-screen bg-beige">
      {/* Header */}
      <div className="bg-white border-b border-anthracite/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-terracotta rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-serif text-anthracite">
                    Portail <span className="text-terracotta italic">RH</span>
                  </h1>
                  <p className="text-xs font-sans uppercase tracking-wider text-anthracite/60">
                    ÉQUIPE M.O.N.A
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 hover:bg-beige rounded-full transition-colors">
                <Bell className="w-5 h-5 text-anthracite" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-terracotta rounded-full"></span>
              </button>
              <button
                onClick={() => navigate("/rh/login")}
                className="px-4 py-2 text-sm text-anthracite/70 hover:text-anthracite transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-anthracite/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {[
              { id: "overview", label: "Vue d'ensemble", icon: Activity },
              { id: "team", label: "Équipe M.O.N.A", icon: Users },
              { id: "experts", label: "Experts", icon: UserCheck },
              { id: "recruitment", label: "Recrutement", icon: Briefcase },
              { id: "performance", label: "Performance", icon: Target },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? "border-terracotta text-anthracite"
                    : "border-transparent text-anthracite/50 hover:text-anthracite hover:border-anthracite/20"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-anthracite/5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.trend === "up" && (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    ↑ {stat.change}
                  </span>
                )}
              </div>
              <p className="text-3xl font-serif text-anthracite mb-1">{stat.value}</p>
              <p className="text-sm text-anthracite/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tâches urgentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-anthracite/5 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-anthracite">Tâches prioritaires</h2>
              <button className="text-sm text-terracotta hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Nouvelle tâche
              </button>
            </div>
            <div className="space-y-4">
              {urgentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 border border-anthracite/10 rounded-xl hover:bg-beige/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      task.priority === "high" ? "bg-red-500" : "bg-yellow-500"
                    }`}></div>
                    <div>
                      <p className="font-medium text-anthracite">{task.title}</p>
                      <p className="text-sm text-anthracite/60 mt-1">
                        Assigné à {task.assignedTo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-anthracite/50">Échéance</p>
                      <p className="text-sm font-medium text-anthracite">{task.dueDate}</p>
                    </div>
                    <button className="p-2 hover:bg-beige rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-anthracite/40" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Experts récents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-anthracite/5 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-anthracite">Experts récents</h2>
              <button
                onClick={() => navigate("/admin/experts")}
                className="text-sm text-terracotta hover:underline"
              >
                Tout voir
              </button>
            </div>
            <div className="space-y-4">
              {recentExperts.map((expert) => (
                <div key={expert.id} className="p-4 border border-anthracite/10 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-anthracite">{expert.name}</p>
                    {expert.status === "pending_validation" && (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                    {expert.status === "approved" && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-anthracite/60 mb-2">{expert.specialty}</p>
                  <p className="text-xs text-anthracite/40">{expert.submittedDate}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Équipe M.O.N.A */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white rounded-2xl shadow-sm border border-anthracite/5 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif text-anthracite">Équipe M.O.N.A</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-anthracite/40" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-anthracite/20 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/50"
                />
              </div>
              <button className="p-2 border border-anthracite/20 rounded-full hover:bg-beige transition-colors">
                <Filter className="w-4 h-4 text-anthracite" />
              </button>
              <button className="p-2 border border-anthracite/20 rounded-full hover:bg-beige transition-colors">
                <Download className="w-4 h-4 text-anthracite" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-anthracite/10">
                  <th className="text-left py-3 px-4 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Localisation
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-anthracite/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-anthracite/5 hover:bg-beige/30 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-anthracite">{member.name}</p>
                        <p className="text-sm text-anthracite/60">{member.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-anthracite">{member.role}</td>
                    <td className="py-4 px-4 text-sm text-anthracite">{member.department}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-sm text-anthracite/70">
                        <MapPin className="w-3.5 h-3.5" />
                        {member.location}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Actif
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="p-2 hover:bg-beige rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-anthracite/40" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
