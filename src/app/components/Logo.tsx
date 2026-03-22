import { Link } from "react-router";

interface LogoProps {
  variant?: "default" | "white" | "gold" | "compact";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
}

export function Logo({ 
  variant = "default", 
  size = "md", 
  showTagline = false,
  className = "" 
}: LogoProps) {
  const sizes = {
    sm: { text: "text-xl", tagline: "text-[10px]", spacing: "gap-1" },
    md: { text: "text-2xl", tagline: "text-xs", spacing: "gap-1.5" },
    lg: { text: "text-4xl", tagline: "text-sm", spacing: "gap-2" },
    xl: { text: "text-5xl", tagline: "text-base", spacing: "gap-3" },
  };

  const variants = {
    default: {
      logo: "text-anthracite",
      accent: "text-terracotta",
      tagline: "text-muted-foreground",
    },
    white: {
      logo: "text-white",
      accent: "text-white/90",
      tagline: "text-white/70",
    },
    gold: {
      logo: "text-gold",
      accent: "text-terracotta",
      tagline: "text-gold/70",
    },
    compact: {
      logo: "text-anthracite",
      accent: "text-terracotta",
      tagline: "text-muted-foreground",
    },
  };

  const sizeConfig = sizes[size];
  const variantConfig = variants[variant];

  if (variant === "compact") {
    return (
      <Link to="/" className={`inline-flex items-center ${className}`}>
        <div className={`font-serif font-bold ${sizeConfig.text} ${variantConfig.logo} tracking-wide`}>
          M.O.N.A
        </div>
      </Link>
    );
  }

  return (
    <Link to="/" className={`inline-flex flex-col ${sizeConfig.spacing} ${className}`}>
      <div className={`font-serif font-bold ${sizeConfig.text} ${variantConfig.logo} tracking-wide flex items-center`}>
        <span>M</span>
        <span className={variantConfig.accent}>.</span>
        <span>O</span>
        <span className={variantConfig.accent}>.</span>
        <span>N</span>
        <span className={variantConfig.accent}>.</span>
        <span>A</span>
      </div>
      {showTagline && (
        <div className={`${sizeConfig.tagline} ${variantConfig.tagline} tracking-[0.2em] uppercase font-light -mt-1`}>
          Mieux-être · Optimisation · Neuro-Apaisement
        </div>
      )}
    </Link>
  );
}

// Version SVG du logo pour usage avancé
export function LogoSVG({ 
  variant = "default",
  width = 120,
  height = 40,
  showTagline = false 
}: { 
  variant?: "default" | "white" | "gold";
  width?: number;
  height?: number;
  showTagline?: boolean;
}) {
  const colors = {
    default: {
      main: "#333333",
      accent: "#c77a5a",
      tagline: "#6b7280",
    },
    white: {
      main: "#ffffff",
      accent: "#ffffff",
      tagline: "rgba(255, 255, 255, 0.7)",
    },
    gold: {
      main: "#b8a079",
      accent: "#c77a5a",
      tagline: "rgba(184, 160, 121, 0.7)",
    },
  };

  const colorConfig = colors[variant];

  return (
    <svg
      width={width}
      height={showTagline ? height + 20 : height}
      viewBox={`0 0 ${width} ${showTagline ? height + 20 : height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Logo principal M.O.N.A */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Playfair Display, serif"
        fontSize="28"
        fontWeight="700"
        letterSpacing="2"
        fill={colorConfig.main}
      >
        M
        <tspan fill={colorConfig.accent}>.</tspan>
        O
        <tspan fill={colorConfig.accent}>.</tspan>
        N
        <tspan fill={colorConfig.accent}>.</tspan>
        A
      </text>

      {/* Tagline optionnel */}
      {showTagline && (
        <text
          x="50%"
          y={height + 10}
          dominantBaseline="middle"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="8"
          fontWeight="300"
          letterSpacing="2"
          fill={colorConfig.tagline}
          style={{ textTransform: 'uppercase' }}
        >
          Mieux-être · Optimisation · Neuro-Apaisement
        </text>
      )}
    </svg>
  );
}

// Version icône seule (pour favicon, etc.)
export function LogoIcon({ 
  size = 40,
  variant = "default" 
}: { 
  size?: number;
  variant?: "default" | "white" | "gold";
}) {
  const colors = {
    default: {
      bg: "#c77a5a",
      text: "#ffffff",
    },
    white: {
      bg: "#ffffff",
      text: "#333333",
    },
    gold: {
      bg: "#b8a079",
      text: "#ffffff",
    },
  };

  const colorConfig = colors[variant];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cercle de fond */}
      <circle cx="20" cy="20" r="20" fill={colorConfig.bg} />
      
      {/* Lettre M stylisée */}
      <text
        x="20"
        y="26"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Playfair Display, serif"
        fontSize="20"
        fontWeight="700"
        fill={colorConfig.text}
      >
        M
      </text>
      
      {/* Point décoratif */}
      <circle cx="20" cy="10" r="2" fill={colorConfig.text} opacity="0.7" />
    </svg>
  );
}