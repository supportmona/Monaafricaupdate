import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { useB2BAuth } from "@/app/contexts/B2BAuthContext";
import { CompanyHeader } from "@/app/components/CompanyHeader";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  UserCheck,
  UserX,
  ArrowLeft,
  Download,
  Upload,
  Filter,
  X,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";

interface Employee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  department?: string;
  position?: string;
  joinedDate: string;
  status: "active" | "invited" | "inactive";
  consultationsCount?: number;
}

export default function CompanyEmployeesPage() {
  const { user } = useB2BAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "invited" | "inactive">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  
  // Form state
  const [newEmployee, setNewEmployee] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    department: "",
    position: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const token = localStorage.getItem("mona_company_token");
      if (!token) {
        setLoading(false);
        return;
      }

      // MODE DÉMO : Générer des employés fictifs
      const generateMockEmployees = (): Employee[] => {
        const departments = ["Tech", "RH", "Finance", "Marketing", "Opérations"];
        const positions = ["Manager", "Développeur", "Analyste", "Coordinateur", "Directeur"];
        const firstNames = ["Amara", "Kofi", "Nala", "Kwame", "Zuri", "Mamadou", "Aïcha", "Youssef", "Fatou", "Omar"];
        const lastNames = ["Diallo", "Mensah", "Nkosi", "Ba", "Kamara", "Toure", "Sy", "Keita", "Sow", "Kone"];
        
        const count = user?.employeeCount || 15;
        const mockEmployees: Employee[] = [];
        
        for (let i = 0; i < count; i++) {
          const firstName = firstNames[i % firstNames.length];
          const lastName = lastNames[i % lastNames.length];
          const status = i < count * 0.7 ? "active" : i < count * 0.85 ? "invited" : "inactive";
          
          mockEmployees.push({
            id: `emp-${i + 1}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${user?.companyName?.toLowerCase().replace(/\s+/g, '-') || 'company'}.com`,
            firstName,
            lastName,
            phone: `+243 ${900 + i} ${100 + i} ${200 + i}`,
            department: departments[i % departments.length],
            position: positions[i % positions.length],
            joinedDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
            status: status as "active" | "invited" | "inactive",
            consultationsCount: status === "active" ? Math.floor(Math.random() * 8) : 0
          });
        }
        
        return mockEmployees;
      };

      // Simuler latence réseau
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setEmployees(generateMockEmployees());

      /* CODE API POUR PRODUCTION :
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/company/employees`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Company-Token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees || []);
      }
      */
    } catch (error) {
      console.error("Erreur chargement employés:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const token = localStorage.getItem("mona_company_token");
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/company/employees/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-Company-Token": token || "",
          },
          body: JSON.stringify(newEmployee),
        }
      );

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowAddModal(false);
          setSubmitSuccess(false);
          setNewEmployee({
            email: "",
            firstName: "",
            lastName: "",
            phone: "",
            department: "",
            position: ""
          });
          loadEmployees();
        }, 1500);
      } else {
        const error = await response.json();
        setSubmitError(error.error || "Erreur lors de l'ajout");
      }
    } catch (error) {
      setSubmitError("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || emp.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === "active").length,
    invited: employees.filter(e => e.status === "invited").length,
    inactive: employees.filter(e => e.status === "inactive").length,
  };

  const getStatusBadge = (status: Employee["status"]) => {
    const styles = {
      active: "bg-green-100 text-green-700 border-green-200",
      invited: "bg-blue-100 text-blue-700 border-blue-200",
      inactive: "bg-gray-100 text-gray-700 border-gray-200",
    };

    const labels = {
      active: "Actif",
      invited: "Invité",
      inactive: "Inactif",
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <CompanyHeader
        showBackButton
        title="Gestion des employés"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Stats cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total", value: stats.total, color: "from-[#A68B6F] to-[#8A7159]" },
            { label: "Actifs", value: stats.active, color: "from-green-500 to-green-600" },
            { label: "Invités", value: stats.invited, color: "from-blue-500 to-blue-600" },
            { label: "Inactifs", value: stats.inactive, color: "from-gray-400 to-gray-500" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 border-2 border-[#D4C5B9]"
            >
              <p className="text-3xl font-light text-[#1A1A1A] mb-2">{stat.value}</p>
              <p className="text-sm text-[#1A1A1A]/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-4 border-2 border-[#D4C5B9] flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un employé..."
              className="w-full pl-12 pr-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#1A1A1A]/40" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all cursor-pointer font-medium"
            >
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="invited">Invités</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
        </motion.div>

        {/* Employees list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl border-2 border-[#D4C5B9] overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#A68B6F] animate-spin" />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
              <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">
                {searchQuery || filterStatus !== "all" ? "Aucun résultat" : "Aucun employé"}
              </h3>
              <p className="text-[#1A1A1A]/60 mb-6">
                {searchQuery || filterStatus !== "all" 
                  ? "Essayez de modifier vos critères de recherche"
                  : "Commencez par ajouter vos premiers employés"}
              </p>
              {!searchQuery && filterStatus === "all" && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-all font-medium inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter un employé
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#D4C5B9]">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#1A1A1A]/60 uppercase tracking-wider">
                      Employé
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#1A1A1A]/60 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#1A1A1A]/60 uppercase tracking-wider">
                      Département
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#1A1A1A]/60 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#1A1A1A]/60 uppercase tracking-wider">
                      Consultations
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-[#1A1A1A]/60 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4C5B9]">
                  {filteredEmployees.map((employee, index) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-[#F5F1ED] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white font-medium">
                            {employee.firstName[0]}{employee.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-[#1A1A1A]">
                              {employee.firstName} {employee.lastName}
                            </p>
                            <p className="text-xs text-[#1A1A1A]/60">
                              {employee.position || "Employé"}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-[#1A1A1A]">
                            <Mail className="w-3.5 h-3.5 text-[#1A1A1A]/40" />
                            {employee.email}
                          </div>
                          {employee.phone && (
                            <div className="flex items-center gap-2 text-sm text-[#1A1A1A]">
                              <Phone className="w-3.5 h-3.5 text-[#1A1A1A]/40" />
                              {employee.phone}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-[#1A1A1A]">
                          {employee.department || "Non assigné"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        {getStatusBadge(employee.status)}
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-[#1A1A1A]">
                          {employee.consultationsCount || 0}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
                          <MoreVertical className="w-4 h-4 text-[#1A1A1A]" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      {/* Modal Ajouter employé */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !submitting && setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif italic text-[#1A1A1A]">
                  Ajouter un employé
                </h2>
                <button
                  onClick={() => !submitting && setShowAddModal(false)}
                  className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
                  disabled={submitting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-serif text-[#1A1A1A] mb-2">
                    Employé ajouté !
                  </h3>
                  <p className="text-[#1A1A1A]/60">
                    Un email d'invitation a été envoyé
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAddEmployee} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={newEmployee.firstName}
                        onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={newEmployee.lastName}
                        onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Email professionnel *
                    </label>
                    <input
                      type="email"
                      required
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      className="w-full px-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                      disabled={submitting}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Département
                      </label>
                      <input
                        type="text"
                        value={newEmployee.department}
                        onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                        disabled={submitting}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Poste
                      </label>
                      <input
                        type="text"
                        value={newEmployee.position}
                        onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                        className="w-full px-4 py-3 bg-[#F5F1ED] rounded-xl border-2 border-transparent focus:border-[#A68B6F] outline-none transition-all"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p className="text-sm">{submitError}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-4 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Ajout en cours...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Ajouter l'employé
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}