import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import CapiMentor from './CapiMentor';

export default function Layout() {
  const { aluno } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950">
      {aluno && <TopBar />}

      {/* pt-20 = espaço da TopBar | pb-24 mobile (BottomNav), pb-8 desktop */}
      <main className="mx-auto max-w-4xl px-4 pt-20 pb-24 md:pb-8">
        <Outlet />
      </main>

      {aluno && <BottomNav />}
      {aluno && <CapiMentor />}
    </div>
  );
}
