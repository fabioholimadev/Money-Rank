import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [aluno, setAluno] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('aluno');
    const t = localStorage.getItem('token');
    if (raw) {
      try {
        setAluno(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to parse aluno from localStorage', e);
      }
    }
    if (t) setToken(t);
    setLoading(false);
  }, []);

  const login = (data) => {
    if (!data) return;
    if (data.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
    if (data.aluno) {
      localStorage.setItem('aluno', JSON.stringify(data.aluno));
      setAluno(data.aluno);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('aluno');
    setAluno(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ aluno, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
