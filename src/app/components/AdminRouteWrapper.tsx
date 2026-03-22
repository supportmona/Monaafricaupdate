import AdminProtectedRoute from './AdminProtectedRoute';

interface AdminRouteWrapperProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export default function AdminRouteWrapper({ children, requiredPermissions }: AdminRouteWrapperProps) {
  return (
    <AdminProtectedRoute requiredPermissions={requiredPermissions}>
      {children}
    </AdminProtectedRoute>
  );
}
