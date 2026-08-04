import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  canProfileAccessRole,
  getHomePathForProfile,
} from '../lib/roleAccess';

export default function ProtectedRoute({
  children,
  requireCompleteProfile = true,
  requiredRole = null,
}) {
  const { user, aluno, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div
          aria-label="Verificando autenticação"
          className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"
          role="status"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        replace
        state={{ from: location }}
        to="/login"
      />
    );
  }

  if (requireCompleteProfile && !aluno?.profile_complete) {
    return (
      <Navigate
        replace
        state={{ from: location }}
        to="/completar-perfil"
      />
    );
  }

  if (!canProfileAccessRole(aluno, requiredRole)) {
    return <Navigate replace to={getHomePathForProfile(aluno)} />;
  }

  if (!requireCompleteProfile && aluno?.profile_complete) {
    return <Navigate replace to={getHomePathForProfile(aluno)} />;
  }

  return children;
}
