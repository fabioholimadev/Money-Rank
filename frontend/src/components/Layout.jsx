import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfileRole, USER_ROLES } from '../lib/roleAccess';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import CapiMentor from './CapiMentor';

export default function Layout() {
  const { aluno } = useAuth();
  const isStudent = getProfileRole(aluno) === USER_ROLES.STUDENT;

  return (
    <div className="min-h-screen bg-[#131f24] text-[#f1f7fb]">
      {aluno && <TopBar />}
      <main className="min-h-screen px-4 pb-28 pt-20 sm:px-6 lg:ml-[17.5rem] lg:px-8 lg:pb-12 lg:pt-8">
        <div className="mx-auto w-full max-w-[1180px]">
          <Outlet />
        </div>
      </main>
      {aluno && <BottomNav />}
      {aluno && isStudent && <CapiMentor />}
    </div>
  );
}
