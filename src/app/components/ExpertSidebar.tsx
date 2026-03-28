import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare, 
  Settings,
  X,
  HelpCircle,
  ClipboardList
} from "lucide-react";

interface ExpertSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "Tableau de bord", path: "/expert/dashboard", icon: LayoutDashboard },
  { name: "Agenda", path: "/expert/agenda", icon: Calendar },
  { name: "Patients", path: "/expert/patients", icon: Users },
  { name: "Dossiers médicaux", path: "/expert/medical-records", icon: FileText },
  { name: "Documents", path: "/expert/documents", icon: ClipboardList },
  { name: "Messages", path: "/expert/messages", icon: MessageSquare },
  { name: "Paramètres", path: "/expert/settings", icon: Settings },
];

export default function ExpertSidebar({ isOpen, onClose }: ExpertSidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Overlay mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white border-r border-[#D4C5B9] z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-[#D4C5B9]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-serif text-[#1A1A1A]">M.O.N.A</h1>
                <p className="text-xs text-[#1A1A1A]/60 mt-1">Portail Expert</p>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-[#1A1A1A] text-white"
                      : "text-[#1A1A1A]/70 hover:bg-[#F5F1ED] hover:text-[#1A1A1A]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Help section */}
          <div className="p-4 border-t border-[#D4C5B9]">
            <div className="bg-[#F5F1ED] rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#A68B6F] rounded-lg flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A] mb-1">Besoin d'aide ?</p>
                  <p className="text-xs text-[#1A1A1A]/60 mb-3">
                    Support technique disponible 24/7
                  </p>
                  <a
                    href="mailto:support@monafrica.net"
                    className="text-xs text-[#A68B6F] hover:underline"
                  >
                    Contacter le support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}