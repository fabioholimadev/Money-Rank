import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({
  children,
  requireCompleteProfile = true,
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

  if (!requireCompleteProfile && aluno?.profile_complete) {
    return <Navigate replace to="/student" />;
  }

  return children;
}
