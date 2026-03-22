import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useB2BAuth } from "@/app/contexts/B2BAuthContext";
import {
  Bell,
  Settings,
  LogOut,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  X,
  Clock,
  Users,
  Calendar,
  Award,
  AlertCircle,
  FileText
} from "lucide-react";

interface CompanyHeaderProps {
  showBackButton?: boolean;
  title?: string;
  backTo?: string;
}

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "alert";
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: typeof Bell;
}

export function CompanyHeader({ showBackButton = false, title, backTo }: CompanyHeaderProps) {
  const { user, logout } = useB2BAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Nouvelle consultation planifiée",
      message: "Amara Diallo a réservé une séance pour demain à 14h",
      time: "Il y a 5 min",
      read: false,
      icon: Calendar
    },
    {
      id: "2",
      type: "info",
      title: "5 nouveaux employés actifs",
      message: "Vos collaborateurs ont activé leur compte M.O.N.A cette semaine",
      time: "Il y a 2h",
      read: false,
      icon: Users
    },
    {
      id: "3",
      type: "warning",
      title: "Rapport mensuel disponible",
      message: "Consultez les indicateurs de bien-être de votre entreprise",
      time: "Il y a 1 jour",
      read: true,
      icon: FileText
    },
    {
      id: "4",
      type: "success",
      title: "Score de satisfaction excellent",
      message: "Votre entreprise atteint 4.8/5 de satisfaction employés",
      time: "Il y a 2 jours",
      read: true,
      icon: Award
    }
  ]);

  const companyData = {
    name: user?.companyName || "Votre Entreprise",
    logo: user?.companyName?.substring(0, 2).toUpperCase() || "EN",
    plan: "Entreprise Premium"
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    localStorage.removeItem("mona_company_token");
    localStorage.removeItem("mona_company_user");
    navigate("/entreprise/login");
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationStyles = (type: Notification["type"]) => {
    const styles = {
      info: "bg-[#A68B6F]/10 border-[#A68B6F]/30",
      success: "bg-green-50 border-green-200",
      warning: "bg-amber-50 border-amber-200",
      alert: "bg-red-50 border-red-200"
    };
    return styles[type];
  };

  const getIconColor = (type: Notification["type"]) => {
    const colors = {
      info: "text-[#A68B6F]",
      success: "text-green-600",
      warning: "text-amber-600",
      alert: "text-red-600"
    };
    return colors[type];
  };

  return (
    <>
      <header className="bg-white border-b-2 border-[#1A1A1A] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left side */}
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Link
                  to={backTo || "/company/dashboard"}
                  className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
                </Link>
              )}
              
              {title ? (
                <h1 className="text-2xl font-serif italic text-[#1A1A1A]">{title}</h1>
              ) : (
                <>
                  <div className="w-14 h-14 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-serif text-xl font-medium">
                      {companyData.logo}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-serif italic text-[#1A1A1A]">
                        {companyData.name}
                      </h1>
                      <CheckCircle className="w-5 h-5 text-[#A68B6F]" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-[#1A1A1A] px-3 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3 text-[#D4C5B9]" />
                      <span className="text-xs font-semibold text-white tracking-wider uppercase">
                        {companyData.plan}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 hover:bg-[#F5F1ED] rounded-full transition-colors"
              >
                <Bell className="w-5 h-5 text-[#1A1A1A]" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-[#C67C5C] rounded-full flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">{unreadCount}</span>
                  </span>
                )}
              </button>
              <Link
                to="/company/settings"
                className="p-3 hover:bg-[#F5F1ED] rounded-full transition-colors"
              >
                <Settings className="w-5 h-5 text-[#1A1A1A]" />
              </Link>
              <button
                className="p-3 hover:bg-[#F5F1ED] rounded-full transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 text-[#1A1A1A]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setShowNotifications(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] p-6 border-b-2 border-[#A68B6F]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#A68B6F] rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif italic text-white">Notifications</h2>
                      {unreadCount > 0 && (
                        <p className="text-xs text-white/70">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-[#D4C5B9] hover:text-white transition-colors font-medium"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="w-16 h-16 bg-[#F5F1ED] rounded-full flex items-center justify-center mb-4">
                      <Bell className="w-8 h-8 text-[#A68B6F]/50" />
                    </div>
                    <p className="text-[#1A1A1A]/60 font-sans">Aucune notification</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {notifications.map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className={`border rounded-2xl p-4 relative ${
                            getNotificationStyles(notification.type)
                          } ${!notification.read ? "border-l-4" : ""}`}
                        >
                          {!notification.read && (
                            <div className="absolute top-4 left-4 w-2 h-2 bg-[#C67C5C] rounded-full" />
                          )}

                          <div className="flex gap-3">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${
                              notification.read ? "bg-white" : "bg-white"
                            } flex items-center justify-center border border-current/20 ${!notification.read ? "ml-4" : ""}`}>
                              <Icon className={`w-5 h-5 ${getIconColor(notification.type)}`} />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-serif text-[#1A1A1A] mb-1">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-[#1A1A1A]/70 mb-2 font-sans">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-[#1A1A1A]/50 font-sans">
                                <Clock className="w-3 h-3" />
                                {notification.time}
                              </div>
                            </div>

                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="flex-shrink-0 p-1 hover:bg-black/5 rounded-lg transition-colors self-start"
                            >
                              <X className="w-4 h-4 text-[#1A1A1A]/40" />
                            </button>
                          </div>

                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="mt-3 text-xs text-[#A68B6F] hover:text-[#1A1A1A] transition-colors font-medium"
                            >
                              Marquer comme lu
                            </button>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-[#D4C5B9] p-4 bg-[#F5F1ED]">
                <a
                  href="mailto:entreprises@monafrica.net"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-all font-medium text-sm"
                >
                  <Bell className="w-4 h-4" />
                  Contacter le support
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}