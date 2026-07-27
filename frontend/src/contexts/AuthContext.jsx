import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const LEGACY_SESSION_KEYS = ['token', 'refresh_token', 'aluno'];

/**
 * Contexto transitório usado durante a troca do Supabase Auth pelo Firebase.
 *
 * A Task 1.1 invalida qualquer sessão antiga que ainda esteja no navegador.
 * A Task 1.2 adicionará o observador de sessão do Firebase e disponibilizará
 * novamente os dados do usuário autenticado.
 */
export function AuthProvider({ children }) {
  const [aluno, setAluno] = useState(null);

  useEffect(() => {
    LEGACY_SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
  }, []);

  const logout = () => {
    LEGACY_SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
    setAluno(null);
  };

  const updateAluno = (data) => {
    setAluno((currentAluno) =>
      currentAluno ? { ...currentAluno, ...data } : currentAluno
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user: null,
        aluno,
        loading: false,
        logout,
        updateAluno,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// O hook compartilha o arquivo com o Provider para manter a API centralizada.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }

  return context;
}

export default AuthProvider;
