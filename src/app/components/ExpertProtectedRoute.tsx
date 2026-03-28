import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import { useExpertAuth } from "@/app/contexts/ExpertAuthContext";

interface ExpertProtectedRouteProps {
  children: ReactNode;
}

export default function ExpertProtectedRoute({ children }: ExpertProtectedRouteProps) {
  const { user, loading } = useExpertAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      console.warn("⚠️ Accès non autorisé au portail expert - Redirection vers /expert/login");
      navigate("/expert/login", { replace: true });
    }
  }, [user, loading, navigate]);

  // Pendant la vérification de session → loader
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

  // Pas connecté → null (useEffect gère la redirection)
  if (!user) {
    return null;
  }

  // Connecté → on affiche
  return <>{children}</>;
}
