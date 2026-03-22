import { useEffect, startTransition } from 'react';
import { useNavigate } from 'react-router';
import { useAdminAuth } from '@/app/contexts/AdminAuthContext';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export default function AdminProtectedRoute({ 
  children, 
  requiredPermissions = [] 
}: AdminProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      startTransition(() => {
        navigate('/admin/login', { replace: true });
      });
    }
  }, [isAuthenticated, loading, navigate]);

  // Vérifier les permissions si nécessaire
  useEffect(() => {
    if (isAuthenticated && user && requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.every(
        permission => user.permissions.includes(permission) || user.permissions.includes('all')
      );

      if (!hasPermission) {
        startTransition(() => {
          navigate('/admin/dashboard', { replace: true });
        });
      }
    }
  }, [isAuthenticated, user, requiredPermissions, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-anthracite animate-spin mx-auto mb-4" />
          <p className="text-anthracite/60 font-sans">Vérification des accès...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}