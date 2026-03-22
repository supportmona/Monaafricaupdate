import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface CompanyProtectedRouteProps {
  children: ReactNode;
}

export default function CompanyProtectedRoute({ children }: CompanyProtectedRouteProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier si un token company existe
    const token = localStorage.getItem("mona_company_token");
    const user = localStorage.getItem("mona_company_user");

    if (token && user) {
      setIsAuthenticated(true);
    } else {
      console.warn("⚠️ Accès non autorisé au portail entreprise - Redirection vers /entreprise/login");
      navigate("/entreprise/login", { replace: true });
    }

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#A68B6F]/30 border-t-[#A68B6F] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#1A1A1A]/60 font-sans">Vérification...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
