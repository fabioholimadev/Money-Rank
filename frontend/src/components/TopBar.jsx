import HomeRounded from '@mui/icons-material/HomeRounded';
import MapRounded from '@mui/icons-material/MapRounded';
import EmojiEventsRounded from '@mui/icons-material/EmojiEventsRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import SchoolRounded from '@mui/icons-material/SchoolRounded';
import LocalFireDepartmentRounded from '@mui/icons-material/LocalFireDepartmentRounded';
import MonetizationOnRounded from '@mui/icons-material/MonetizationOnRounded';
import StarRounded from '@mui/icons-material/StarRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import MenuOpenRounded from '@mui/icons-material/MenuOpenRounded';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getProfileRole, USER_ROLES } from '../lib/roleAccess';
import { BrandMark, BrandWordmark } from './BrandIdentity';

const STUDENT_ITEMS = [
  { label: 'Início', to: '/student', Icon: HomeRounded },
  { label: 'Trilha', to: '/trilha', Icon: MapRounded },
  { label: 'Ranking', to: '/ranking', Icon: EmojiEventsRounded },
  { label: 'Perfil', to: '/perfil', Icon: PersonRounded },
];

const TEACHER_ITEMS = [
  { label: 'Visão da turma', to: '/professor', Icon: SchoolRounded },
];

function formatCompact(value) {
  const number = Number(value) || 0;
  if (number < 1000) return String(number);
  return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`;
}

function isCurrentPath(pathname, target) {
  if (target === '/student' || target === '/professor') return pathname === target;
  return pathname === target || pathname.startsWith(`${target}/`);
}

function Brand({ homePath, collapsed = false, onToggle }) {
  return (
    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
      <button
        type="button"
        onClick={onToggle}
        className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#58cc02] text-sm font-black text-[#13210f] shadow-[0_4px_0_#46a302] transition-transform active:translate-y-1 active:shadow-none"
        aria-label={collapsed ? 'Abrir barra lateral' : 'Recolher barra lateral'}
        aria-expanded={!collapsed}
        title={collapsed ? 'Abrir menu' : 'Recolher menu'}
      >
        <BrandMark className="h-11 w-11" alt="" />
        <MenuOpenRounded className={`absolute -bottom-2 -right-2 rounded-full border-2 border-[#131f24] bg-[#49c0f8] p-0.5 text-[#10252d] transition-transform ${collapsed ? 'rotate-180' : ''}`} sx={{ fontSize: 19 }} />
      </button>
      {!collapsed && (
        <Link to={homePath} className="rounded-xl focus-visible:outline-offset-4">
          <BrandWordmark className="h-7 w-auto" />
        </Link>
      )}
    </div>
  );
}

export default function TopBar({ collapsed = false, onToggle }) {
  const { aluno, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (!aluno) return null;

  const role = getProfileRole(aluno);
  const isTeacher = role === USER_ROLES.TEACHER;
  const items = isTeacher ? TEACHER_ITEMS : STUDENT_ITEMS;
  const homePath = isTeacher ? '/professor' : '/student';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Não foi possível encerrar a sessão:', error);
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b-2 border-[#37464f] bg-[#131f24]/95 px-4 backdrop-blur lg:hidden">
        <Link to={homePath} className="flex items-center gap-3 rounded-2xl">
          <BrandMark className="h-10 w-10" />
          <BrandWordmark className="hidden h-6 w-auto min-[390px]:block" />
        </Link>
        {!isTeacher && (
          <div className="flex items-center gap-3" aria-label="Resumo do progresso">
            <span className="flex items-center gap-1 font-black text-[#ffc800]">
              <LocalFireDepartmentRounded sx={{ fontSize: 20 }} />
              {formatCompact(aluno.streak_atual)}
            </span>
            <span className="flex items-center gap-1 font-black text-[#58cc02]">
              <MonetizationOnRounded sx={{ fontSize: 20 }} />
              {formatCompact(aluno.capicoins)}
            </span>
          </div>
        )}
      </header>

      <aside className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r-2 border-[#37464f] bg-[#131f24] py-7 transition-[width,padding] duration-300 lg:flex ${collapsed ? 'w-[5.75rem] px-3' : 'w-[17.5rem] px-5'}`}>
        <Brand homePath={homePath} collapsed={collapsed} onToggle={onToggle} />
        <nav className="mt-10 flex flex-col gap-2" aria-label={isTeacher ? 'Área do professor' : 'Área do estudante'}>
          {items.map(({ label, to, Icon }) => {
            const active = isCurrentPath(pathname, to);
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? 'page' : undefined}
                title={collapsed ? label : undefined}
                className={`flex min-h-14 items-center rounded-2xl border-2 text-sm font-black uppercase tracking-wide transition-colors ${collapsed ? 'justify-center px-2' : 'gap-4 px-4'} ${
                  active
                    ? 'border-[#49c0f8] bg-[#1f2d33] text-[#49c0f8]'
                    : 'border-transparent text-[#f1f7fb] hover:bg-[#1f2d33]'
                }`}
              >
                <Icon sx={{ fontSize: 27 }} aria-hidden="true" />
                {!collapsed && label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          {!isTeacher && !collapsed && (
            <div className="grid grid-cols-3 gap-2" aria-label="Resumo do progresso">
              <span className="flex min-h-11 items-center justify-center gap-1 rounded-xl border-2 border-[#37464f] bg-[#17262c] font-black text-[#ffc800]" title="Sequência">
                <LocalFireDepartmentRounded sx={{ fontSize: 20 }} /> {formatCompact(aluno.streak_atual)}
              </span>
              <span className="flex min-h-11 items-center justify-center gap-1 rounded-xl border-2 border-[#37464f] bg-[#17262c] font-black text-[#58cc02]" title="CapiCoins">
                <MonetizationOnRounded sx={{ fontSize: 20 }} /> {formatCompact(aluno.capicoins)}
              </span>
              <span className="flex min-h-11 items-center justify-center gap-1 rounded-xl border-2 border-[#37464f] bg-[#17262c] font-black text-[#49c0f8]" title="Fase">
                <StarRounded sx={{ fontSize: 19 }} /> {aluno.fase_atual ?? 0}
              </span>
            </div>
          )}

          {!collapsed && <div className="rounded-2xl border-2 border-[#37464f] bg-[#17262c] p-3">
            <p className="truncate text-sm font-black text-white">{aluno.nome_preferido || aluno.displayName || 'Money Rank'}</p>
            <p className="mt-0.5 text-xs font-bold text-[#a5b7c2]">{isTeacher ? 'Professor' : aluno.turma || 'Estudante'}</p>
          </div>}

          <button type="button" onClick={handleLogout} title="Sair" className={`flex min-h-12 w-full items-center rounded-2xl font-black text-[#a5b7c2] transition-colors hover:bg-[#1f2d33] hover:text-[#ff4b4b] ${collapsed ? 'justify-center px-2' : 'gap-3 px-4'}`}>
            <LogoutRounded aria-hidden="true" /> {!collapsed && 'Sair'}
          </button>
        </div>
      </aside>
    </>
  );
}
