import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LocalFireDepartment,
  MonetizationOn,
  Star,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITENS = [
  { label: 'Home',    to: '/student'  },
  { label: 'Trilha',  to: '/trilha'   },
  { label: 'Ranking', to: '/ranking'  },
  { label: 'Perfil',  to: '/perfil'   },
];

/** Formata números grandes de forma compacta: 1500 → "1.5k", 999 → "999" */
function fmtNum(n) {
  const num = Number(n) || 0;
  if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}k`;
  return String(num);
}

export default function TopBar() {
  const { aluno, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (!aluno) return null;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Não foi possível encerrar a sessão:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-slate-950 border-b border-zinc-800">
      <div className="mx-auto max-w-6xl h-full px-3 sm:px-4 flex items-center justify-between gap-2">

        {/* ── Logo ──────────────────────────────────────────────────────── */}
        <Link to="/student" className="flex items-center gap-1.5 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-400 flex items-center justify-center">
            <span className="text-slate-950 font-black text-[10px] sm:text-xs">MR</span>
          </div>
          <span className="hidden sm:block font-black tracking-tighter text-white text-base sm:text-lg">
            MONEY<span className="text-amber-400">RANK</span>
          </span>
        </Link>

        {/* ── Nav horizontal — apenas desktop ───────────────────────────── */}
        <nav className="hidden md:flex items-center gap-0.5">
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
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

          {/* Streak */}
          <div className="flex items-center gap-0.5 shrink-0">
            <LocalFireDepartment sx={{ fontSize: 15 }} className="text-orange-400" />
            <span className="text-[11px] sm:text-sm font-black text-white tabular-nums">
              {fmtNum(aluno.streak_atual)}
            </span>
          </div>

          {/* CapiCoins */}
          <div className="flex items-center gap-0.5 shrink-0">
            <MonetizationOn sx={{ fontSize: 15 }} className="text-amber-400" />
            <span className="text-[11px] sm:text-sm font-black text-white tabular-nums">
              {fmtNum(aluno.capicoins)}
            </span>
          </div>

          {/* Fase — sempre visível em qualquer tamanho de ecrã */}
          <div className="flex items-center gap-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-1.5 sm:px-2.5 py-0.5 shrink-0">
            <Star sx={{ fontSize: 11 }} className="text-emerald-400" />
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-400 leading-none tabular-nums">
              {/* Mobile: "F3" | Tablet+: "Fase 3" */}
              <span className="sm:hidden">F{aluno.fase_atual ?? 1}</span>
              <span className="hidden sm:inline">Fase {aluno.fase_atual ?? 1}</span>
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            aria-label="Sair"
            className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs font-semibold hover:border-red-500/50 hover:text-red-400 transition-all shrink-0"
          >
            <Logout sx={{ fontSize: 14 }} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>

      </div>
    </header>
  );
}
