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
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";

interface ExpertSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { name: "Tableau de bord", path: "/expert/dashboard", icon: LayoutDashboard },
  { name: "Agenda", path: "/expert/agenda", icon: Calendar },
  { name: "Disponibilités", path: "/expert/availability", icon: Clock },
  { name: "Patients", path: "/expert/patients", icon: Users },
  { name: "Documents & Dossiers", path: "/expert/documents", icon: FileText },
  { name: "Messages", path: "/expert/messages", icon: MessageSquare },
  { name: "Paramètres", path: "/expert/settings", icon: Settings },
];

export default function ExpertSidebar({
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
}: ExpertSidebarProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/expert/documents") {
      return location.pathname === "/expert/documents" ||
             location.pathname.startsWith("/expert/medical-records");
    }
    return location.pathname === path;
  };

  return (
    <>
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

      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-[#D4C5B9] z-50 transition-all duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "lg:w-20" : "lg:w-80"}
          w-80
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`border-b border-[#D4C5B9] flex items-center justify-between transition-all duration-300 ${collapsed ? "p-4 justify-center" : "p-6"}`}>
            {!collapsed && (
              <div>
                <h1 className="text-2xl font-serif text-[#1A1A1A]">M.O.N.A</h1>
                <p className="text-xs text-[#1A1A1A]/60 mt-1">Portail Expert</p>
              </div>
            )}
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
            <button onClick={onToggleCollapse} className="hidden lg:flex p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors" title={collapsed ? "Ouvrir la sidebar" : "Réduire la sidebar"}>
              {collapsed ? <ChevronRight className="w-5 h-5 text-[#1A1A1A]/60" /> : <ChevronLeft className="w-5 h-5 text-[#1A1A1A]/60" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors
                    ${collapsed ? "justify-center" : ""}
                    ${active ? "bg-[#1A1A1A] text-white" : "text-[#1A1A1A]/70 hover:bg-[#F5F1ED] hover:text-[#1A1A1A]"}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Help section */}
          {!collapsed && (
            <div className="p-4 border-t border-[#D4C5B9]">
              <div className="bg-[#F5F1ED] rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#A68B6F] rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A] mb-1">Besoin d'aide ?</p>
                    <p className="text-xs text-[#1A1A1A]/60 mb-3">Support technique disponible 24/7</p>
                    <a href="mailto:support@monafrica.net" className="text-xs text-[#A68B6F] hover:underline">Contacter le support</a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="p-3 border-t border-[#D4C5B9] flex justify-center">
              <a href="mailto:support@monafrica.net" title="Contacter le support" className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                <HelpCircle className="w-5 h-5 text-[#A68B6F]" />
              </a>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
