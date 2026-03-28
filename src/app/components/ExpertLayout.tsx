import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Menu, User, Settings, LogOut, ChevronDown, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ExpertSidebar from "./ExpertSidebar";
import { useExpertAuth } from "@/app/contexts/ExpertAuthContext";

interface ExpertLayoutProps {
  children: React.ReactNode;
  title: string;
}

function cleanName(firstName: string, lastName: string): string {
  const clean = (s: string) => s.replace(/^(Dr\.?\s*)+/i, "").trim();
  return `Dr. ${clean(firstName)} ${clean(lastName)}`.trim();
}

export default function ExpertLayout({ children, title }: ExpertLayoutProps) {
  const navigate = useNavigate();
  const { user, profile, logout } = useExpertAuth();

  // Mobile drawer
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Desktop collapse — persisté dans localStorage
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("expert_sidebar_collapsed") === "true";
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const firstName = profile?.firstName || user?.user_metadata?.firstName || "";
  const lastName = profile?.lastName || user?.user_metadata?.lastName || "";
  const specialty = profile?.specialty || user?.user_metadata?.specialty || "Spécialiste";
  const email = user?.email || profile?.email || "expert@monafrica.net";

  const displayName = firstName || lastName
    ? cleanName(firstName, lastName)
    : "Expert";

  const getInitials = () => {
    const f = firstName.replace(/^(Dr\.?\s*)+/i, "").trim();
    const l = lastName.replace(/^(Dr\.?\s*)+/i, "").trim();
    if (f && l) return `${f[0]}${l[0]}`.toUpperCase();
    return "EX";
  };

  const handleToggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("expert_sidebar_collapsed", String(next));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/expert/login");
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED] flex">
      {/* Sidebar */}
      <ExpertSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main content — marge qui s'adapte au collapse */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-80"}`}>
        {/* Header */}
        <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-30">
          <div className="h-16 px-6 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <h1 className="text-lg font-serif text-[#1A1A1A]">{title}</h1>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-[#1A1A1A]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 hover:bg-[#F5F1ED] rounded-full pr-3 pl-1 py-1 transition-colors"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {getInitials()}
                  </div>
                  <span className="text-sm text-[#1A1A1A] hidden sm:inline">
                    {displayName}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#1A1A1A]/60 transition-transform ${showProfileMenu ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#D4C5B9] overflow-hidden"
                    >
                      <div className="p-4 border-b border-[#D4C5B9]">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white font-medium">
                            {getInitials()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#1A1A1A] truncate">{displayName}</p>
                            <p className="text-xs text-[#1A1A1A]/60 truncate">{specialty}</p>
                          </div>
                        </div>
                        <p className="text-xs text-[#1A1A1A]/60 truncate">{email}</p>
                      </div>

                      <div className="py-2">
                        <button
                          onClick={() => { setShowProfileMenu(false); navigate("/expert/settings"); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] hover:bg-[#F5F1ED] transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Mon profil</span>
                        </button>
                        <button
                          onClick={() => { setShowProfileMenu(false); navigate("/expert/settings"); }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] hover:bg-[#F5F1ED] transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Paramètres</span>
                        </button>
                      </div>

                      <div className="border-t border-[#D4C5B9] py-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Se déconnecter</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
