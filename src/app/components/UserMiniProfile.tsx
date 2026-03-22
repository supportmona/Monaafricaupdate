import { User, Circle } from "lucide-react";

interface UserMiniProfileProps {
  name: string;
  role: "admin" | "expert" | "member" | "staff";
  isOnline?: boolean;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
  showStatus?: boolean;
}

const roleConfig = {
  admin: {
    label: "Admin",
    bgColor: "from-red-100 to-red-50",
    textColor: "text-red-700",
    badgeColor: "bg-red-100 text-red-700 border-red-200",
  },
  expert: {
    label: "Expert",
    bgColor: "from-terracotta/40 to-gold/30",
    textColor: "text-terracotta",
    badgeColor: "bg-terracotta/10 text-terracotta border-terracotta/20",
  },
  member: {
    label: "Membre",
    bgColor: "from-gold/40 to-beige/40",
    textColor: "text-gold",
    badgeColor: "bg-gold/10 text-gold border-gold/20",
  },
  staff: {
    label: "Staff",
    bgColor: "from-beige/50 to-gold/20",
    textColor: "text-anthracite",
    badgeColor: "bg-beige/20 text-anthracite border-beige/30",
  },
};

const sizeConfig = {
  sm: {
    avatar: "w-8 h-8",
    text: "text-xs",
    badge: "text-xs px-2 py-0.5",
    statusDot: "w-2 h-2",
  },
  md: {
    avatar: "w-10 h-10",
    text: "text-sm",
    badge: "text-xs px-2 py-0.5",
    statusDot: "w-3 h-3",
  },
  lg: {
    avatar: "w-12 h-12",
    text: "text-base",
    badge: "text-sm px-3 py-1",
    statusDot: "w-3 h-3",
  },
};

export default function UserMiniProfile({
  name,
  role,
  isOnline = false,
  avatarUrl,
  size = "md",
  showStatus = true,
}: UserMiniProfileProps) {
  const config = roleConfig[role];
  const sizes = sizeConfig[size];
  
  // Générer initiales
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className={`${sizes.avatar} rounded-full object-cover`}
          />
        ) : (
          <div
            className={`${sizes.avatar} bg-gradient-to-br ${config.bgColor} rounded-full flex items-center justify-center`}
          >
            <span className={`${config.textColor} font-bold ${sizes.text}`}>
              {initials}
            </span>
          </div>
        )}
        
        {/* Indicateur de statut en ligne */}
        {showStatus && (
          <div
            className={`absolute -bottom-0.5 -right-0.5 ${sizes.statusDot} rounded-full border-2 border-white ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`${sizes.text} font-medium text-anthracite truncate`}>
          {name}
        </p>
        <span
          className={`inline-block ${sizes.badge} rounded-full border ${config.badgeColor} font-medium`}
        >
          {config.label}
        </span>
      </div>
    </div>
  );
}
