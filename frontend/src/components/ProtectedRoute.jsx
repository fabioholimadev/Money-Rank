import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { aluno, loading } = useAuth();

  if (loading) return null;
  if (!aluno) return <Navigate to="/login" replace />;
  return children;
}
