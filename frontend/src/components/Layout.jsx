import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfileRole, USER_ROLES } from '../lib/roleAccess';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import CapiMentor from './CapiMentor';

export default function Layout() {
  const { aluno } = useAuth();
  const isStudent = getProfileRole(aluno) === USER_ROLES.STUDENT;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem('money-rank-sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('money-rank-sidebar-collapsed', String(sidebarCollapsed));
    } catch {
      // A navegação continua funcional mesmo com armazenamento indisponível.
    }
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-[#131f24] text-[#f1f7fb]">
      {aluno && (
        <TopBar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((current) => !current)}
        />
      )}
      <main className={`min-h-screen px-4 pb-28 pt-20 transition-[margin] duration-300 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8 ${sidebarCollapsed ? 'lg:ml-[5.75rem]' : 'lg:ml-[17.5rem]'}`}>
        <div className="mx-auto w-full max-w-[1180px]">
          <Outlet />
        </div>
      </main>
      {aluno && <BottomNav />}
      {aluno && isStudent && <CapiMentor />}
    </div>
  );
}
