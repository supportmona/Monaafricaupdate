import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { 
  User,
  Settings,
  LogOut,
  ChevronDown,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { NotificationPanel } from "./NotificationPanel";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";

interface MemberHeaderProps {
  title: string;
  action?: React.ReactNode;
}

export default function MemberHeader({ title, action }: MemberHeaderProps) {
  const navigate = useNavigate();
  const { user } = useMemberAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Obtenir les initiales du nom
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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

  const handleLogout = () => {
    localStorage.removeItem("mona_member_token");
    navigate('/portal/login');
  };

  return (
    <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center">
              <span className="text-white font-serif text-sm">
                {user ? getInitials(user.name) : "M"}
              </span>
            </div>
            <div>
              <h1 className="text-lg font-serif text-[#1A1A1A]">
                {title}
              </h1>
              <p className="text-xs text-[#1A1A1A]/60 capitalize">
                {user?.plan === "cercle-mona" ? "Cercle M.O.N.A" : "Plan Gratuit"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {action && <div>{action}</div>}
            
            {/* Notifications avec NotificationPanel intégré */}
            <NotificationPanel />
            
            {/* Messages */}
            <button
              onClick={() => navigate("/member/messages")}
              className="relative p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-[#1A1A1A]" />
            </button>

            {/* Profile Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 hover:bg-[#F5F1ED] rounded-full pr-3 pl-1 py-1 transition-colors cursor-pointer"
                type="button"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user ? getInitials(user.name) : "M"}
                </div>
                <span className="text-sm text-[#1A1A1A] hidden sm:inline">
                  {user?.name.split(" ")[0] || "Membre"}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#1A1A1A]/60 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#D4C5B9] overflow-hidden"
                  >
                    {/* Profile Info */}
                    <div className="p-4 border-b border-[#D4C5B9]">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white font-medium">
                          {user ? getInitials(user.name) : "M"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1A1A1A] truncate">
                            {user?.name || "Membre"}
                          </p>
                          <p className="text-xs text-[#1A1A1A]/60 truncate capitalize">
                            {user?.plan === "cercle-mona" ? "Cercle M.O.N.A" : "Plan Gratuit"}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-[#1A1A1A]/60 truncate">
                        {user?.email || "membre@monafrica.net"}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          navigate('/member/profile');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#1A1A1A] hover:bg-[#F5F1ED] transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Mon compte</span>
                      </button>
                    </div>

                    {/* Logout */}
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
      </div>
    </header>
  );
}