import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Menu, User, Settings, LogOut, ChevronDown, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ExpertSidebar from "./ExpertSidebar";
import { useExpertAuth } from "@/app/contexts/ExpertAuthContext";

// Layout principal pour l'interface expert
interface ExpertLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function ExpertLayout({ children, title }: ExpertLayoutProps) {
  const navigate = useNavigate();
  const { user, profile } = useExpertAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Affiche la sidebar dès le premier rendu sur desktop, mais la laisse refermable
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  const getInitials = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }
    if (user?.user_metadata?.firstName && user?.user_metadata?.lastName) {
      return `${user.user_metadata.firstName[0]}${user.user_metadata.lastName[0]}`.toUpperCase();
    }
    return "EX";
  };

  const expertData = {
    name: profile 
      ? `${profile.firstName} ${profile.lastName}` 
      : user?.user_metadata 
        ? `${user.user_metadata.firstName} ${user.user_metadata.lastName}`
        : "Expert",
    specialty: profile?.specialty || user?.user_metadata?.specialty || "Spécialité",
    avatar: getInitials(),
    email: user?.email || profile?.email || "expert@monafrica.net"
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
    localStorage.removeItem("mona_expert_token");
    navigate('/expert/login');
  };

  // Gère l'ouverture/fermeture automatique du menu sur desktop au resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F1ED] flex">
      {/* Sidebar toujours visible sur desktop, hamburger sur mobile */}
      <ExpertSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 lg:ml-80 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-[#D4C5B9] sticky top-0 z-30">
          <div className="h-16 px-6 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-[#1A1A1A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h1 className="text-lg font-serif text-[#1A1A1A]">{title}</h1>
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}