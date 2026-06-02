import { Link, useLocation } from 'react-router-dom';
import { Home, Map, EmojiEvents, Person } from '@mui/icons-material';

const ITENS = [
  { label: 'Home',    to: '/student',  Icon: Home         },
  { label: 'Trilha',  to: '/trilha',   Icon: Map          },
  { label: 'Ranking', to: '/ranking',  Icon: EmojiEvents  },
  { label: 'Perfil',  to: '/perfil',   Icon: Person       },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-900 border-t border-zinc-800 pb-safe">
      <div className="max-w-md mx-auto h-16 flex justify-around items-center">
        {ITENS.map(({ label, to, Icon }) => {
          const ativo = pathname === to || pathname.startsWith(to + '/');
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 transition-all ${
                ativo ? 'text-amber-400 scale-110' : 'text-slate-500'
              }`}
            >
              <Icon sx={{ fontSize: 22 }} />
              <span className="text-[10px] font-semibold leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
