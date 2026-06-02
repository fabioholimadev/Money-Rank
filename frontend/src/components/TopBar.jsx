import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LocalFireDepartment,
  MonetizationOn,
  Star,
  Dashboard,
  Map,
  EmojiEvents,
  Person,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const NAV_ITENS = [
  { label: 'Home',    to: '/student'  },
  { label: 'Trilha',  to: '/trilha'   },
  { label: 'Ranking', to: '/ranking'  },
  { label: 'Perfil',  to: '/perfil'   },
];

export default function TopBar() {
  const { aluno, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (!aluno) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-slate-950 border-b border-zinc-800">
      <div className="mx-auto max-w-6xl h-full px-4 flex items-center justify-between gap-4">

        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <Link to="/student" className="flex items-center gap-2 shrink-0">
          {/* Placeholder de logo — substitua por <img src="..." /> quando tiver o ficheiro */}
          <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center">
            <span className="text-slate-950 font-black text-xs">MR</span>
          </div>
          <span className="hidden sm:block font-black tracking-tighter text-white text-lg">
            MONEY<span className="text-amber-400">RANK</span>
          </span>
        </Link>

        {/* ── Nav horizontal — apenas desktop ───────────────────────────── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITENS.map(({ label, to }) => {
            const ativo = pathname === to || pathname.startsWith(to + '/');
            return (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  ativo
                    ? 'bg-amber-400/10 text-amber-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Status + Logout ───────────────────────────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Streak */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <LocalFireDepartment sx={{ fontSize: 16 }} className="text-orange-400" />
            <span className="text-xs sm:text-sm font-black text-white">{aluno.streak_atual ?? 0}</span>
          </div>

          {/* CapiCoins */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <MonetizationOn sx={{ fontSize: 16 }} className="text-amber-400" />
            <span className="text-xs sm:text-sm font-black text-white">{aluno.capicoins ?? 0}</span>
          </div>

          {/* Fase — sempre visível, compacto no mobile */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-1.5 sm:px-2.5 py-0.5">
            <Star sx={{ fontSize: 12 }} className="text-emerald-400" />
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 leading-none">
              {/* Mobile: só o número | Desktop: "Fase N" */}
              <span className="sm:hidden">{aluno.fase_atual ?? 1}</span>
              <span className="hidden sm:inline">Fase {aluno.fase_atual ?? 1}</span>
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            aria-label="Sair"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs font-semibold hover:border-red-500/50 hover:text-red-400 transition-all"
          >
            <Logout sx={{ fontSize: 14 }} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>

      </div>
    </header>
  );
}
