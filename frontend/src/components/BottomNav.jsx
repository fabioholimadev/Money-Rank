import HomeRounded from '@mui/icons-material/HomeRounded';
import MapRounded from '@mui/icons-material/MapRounded';
import EmojiEventsRounded from '@mui/icons-material/EmojiEventsRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import SchoolRounded from '@mui/icons-material/SchoolRounded';
import EditNoteRounded from '@mui/icons-material/EditNoteRounded';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfileRole, USER_ROLES } from '../lib/roleAccess';

const STUDENT_ITEMS = [
  { label: 'Início', to: '/student', Icon: HomeRounded },
  { label: 'Trilha', to: '/trilha', Icon: MapRounded },
  { label: 'Ranking', to: '/ranking', Icon: EmojiEventsRounded },
  { label: 'Perfil', to: '/perfil', Icon: PersonRounded },
];

const TEACHER_ITEMS = [
  { label: 'Turma', to: '/professor', Icon: SchoolRounded },
  { label: 'Estúdio', to: '/professor/estudio', Icon: EditNoteRounded },
];

export default function BottomNav() {
  const { aluno } = useAuth();
  const { pathname } = useLocation();
  const items = getProfileRole(aluno) === USER_ROLES.TEACHER ? TEACHER_ITEMS : STUDENT_ITEMS;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-[#37464f] bg-[#131f24]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden" aria-label="Navegação principal">
      <div className="mx-auto flex h-[4.5rem] max-w-lg items-center justify-around px-2">
        {items.map(({ label, to, Icon }) => {
          const active = pathname === to || (to !== '/student' && to !== '/professor' && pathname.startsWith(`${to}/`));
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? 'page' : undefined}
              className={`flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[0.68rem] font-black uppercase tracking-wide transition-colors ${active ? 'text-[#49c0f8]' : 'text-[#a5b7c2]'}`}
            >
              <Icon sx={{ fontSize: 25 }} aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
