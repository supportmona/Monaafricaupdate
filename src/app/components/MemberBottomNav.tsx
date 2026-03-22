import { Home, Calendar, Heart, BookOpen, MessageCircle } from "lucide-react";
import { Link, useLocation } from "react-router";

export default function MemberBottomNav() {
  const location = useLocation();
  
  const navItems = [
    {
      icon: Home,
      label: "Accueil",
      path: "/member/dashboard",
    },
    {
      icon: Calendar,
      label: "Consultations",
      path: "/member/consultations",
    },
    {
      icon: Heart,
      label: "Passeport",
      path: "/member/health-passport",
    },
    {
      icon: BookOpen,
      label: "Ressources",
      path: "/member/resources",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      path: "/member/messages",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] z-50 safe-area-bottom">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around h-16 sm:h-18">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  active
                    ? "text-[#A68B6F]"
                    : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]/80"
                }`}
              >
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    active ? "stroke-[2.5]" : "stroke-[2]"
                  }`}
                />
                <span
                  className={`text-[10px] sm:text-xs font-sans ${
                    active ? "font-semibold" : "font-medium"
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#A68B6F] rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
