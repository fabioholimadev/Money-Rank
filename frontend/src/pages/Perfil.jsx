import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AccountCircle,
  Edit,
  Check,
  Close,
  ArrowBack,
  MonetizationOn,
  Groups,
  EmailOutlined,
  DeleteForever,
  Warning,
  Person,
} from '@mui/icons-material';

const API_BASE = 'http://localhost:3000';

// ─── Inline Toast ─────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors =
    type === 'success'
      ? 'bg-amber-400/10 border-amber-400/40 text-amber-300'
      : 'bg-red-500/10 border-red-500/40 text-red-400';

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-sm shadow-xl text-sm font-semibold animate-fade-in ${colors}`}
    >
      {type === 'success' ? (
        <Check sx={{ fontSize: 18 }} />
      ) : (
        <Warning sx={{ fontSize: 18 }} />
      )}
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
        <Close sx={{ fontSize: 16 }} />
      </button>
    </div>
  );
}

export default function Perfil() {
  const navigate = useNavigate();

  // ── State ─────────────────────────────────────────────────────────────────
  const [aluno, setAluno] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState(null); // { message, type }

  // ── Helpers ───────────────────────────────────────────────────────────────
  const showToast = (message, type = 'success') => setToast({ message, type });
  const hideToast = () => setToast(null);

  const getToken = () => localStorage.getItem('token');

  // ── READ: load student data from localStorage ─────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem('aluno');
    if (!raw) {
      navigate('/login');
      return;
    }
    try {
      const data = JSON.parse(raw);
      setAluno(data);
      setDisplayName(data.nome ?? '');
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  // ── UPDATE: update display name via backend ───────────────────────────────
  const handleUpdateName = async () => {
    const trimmed = displayName.trim();
    if (!trimmed) {
      showToast('O nome não pode ficar vazio.', 'error');
      return;
    }
    if (trimmed === aluno.nome) {
      showToast('Nenhuma alteração detectada.', 'error');
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch(`${API_BASE}/api/game/update-profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ nome: trimmed }),
      });

      const json = await res.json();

      if (!res.ok) {
        showToast(json.error || 'Erro ao atualizar nome.', 'error');
        return;
      }

      // Persist updated name locally
      const updated = { ...aluno, nome: trimmed };
      setAluno(updated);
      localStorage.setItem('aluno', JSON.stringify(updated));
      showToast('Nome atualizado com sucesso!');
    } catch {
      showToast('Não foi possível conectar ao servidor.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  // ── DELETE: delete account via backend, clear session, redirect ───────────
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      '⚠️ Tem certeza? Esta ação é irreversível.\n\nTodos os seus dados, CapiCoins e progresso serão apagados permanentemente.'
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/account`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        showToast(json.error || 'Erro ao excluir a conta.', 'error');
        setIsDeleting(false);
        return;
      }

      // Sign out: clear all local state and redirect
      localStorage.clear();
      navigate('/');
    } catch {
      showToast('Não foi possível conectar ao servidor.', 'error');
      setIsDeleting(false);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────
  if (!aluno) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm tracking-widest uppercase">Carregando</p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* Subtle grid background (matches app design) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-2xl mx-auto px-5 py-8 flex flex-col gap-8">

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400/70">
              Meu Perfil
            </span>
            <h1 className="text-3xl font-black tracking-tighter mt-0.5">
              MONEY<span className="text-amber-400">RANK</span>
            </h1>
          </div>

          <Link
            to="/student"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-400 text-sm font-semibold hover:border-amber-400/50 hover:text-amber-400 hover:bg-amber-400/5 transition-all"
          >
            <ArrowBack sx={{ fontSize: 18 }} />
            Voltar
          </Link>
        </header>

        {/* ── AVATAR BLOCK ────────────────────────────────────────────────── */}
        <section className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-7 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
            <AccountCircle sx={{ fontSize: 40 }} className="text-amber-400" />
          </div>
          <div>
            <p className="text-xl font-black tracking-tight">{aluno.nome}</p>
            <p className="text-slate-500 text-xs mt-0.5 uppercase tracking-widest">
              {aluno.is_admin ? 'Administrador' : 'Estudante'}
            </p>
          </div>
        </section>

        {/* ── INFO CARDS ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">
            Informações da Conta
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Email */}
            <InfoCard
              icon={<EmailOutlined sx={{ fontSize: 20 }} />}
              label="E-mail"
              value={aluno.email ?? '—'}
            />

            {/* CapiCoins */}
            <InfoCard
              icon={<MonetizationOn sx={{ fontSize: 20 }} />}
              label="Saldo de CapiCoins"
              value={`${aluno.capicoins ?? 0} CapiCoins`}
              accent="text-amber-400"
            />

            {/* Team / Equipe */}
            <InfoCard
              icon={<Groups sx={{ fontSize: 20 }} />}
              label="Equipe"
              value={aluno.equipe ?? 'Sem equipe'}
            />

            {/* Member since */}
            <InfoCard
              icon={<Person sx={{ fontSize: 20 }} />}
              label="Membro desde"
              value={
                aluno.created_at
                  ? new Date(aluno.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '—'
              }
            />
          </div>
        </section>

        {/* ── UPDATE DISPLAY NAME ─────────────────────────────────────────── */}
        <section className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-7">
          <div className="flex items-center gap-2 mb-5">
            <Edit sx={{ fontSize: 18 }} className="text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">
              Alterar Nome de Exibição
            </h2>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdateName()}
              disabled={isUpdating}
              maxLength={40}
              placeholder="Seu nome de exibição"
              className="flex-1 bg-slate-900 text-white border border-zinc-700 rounded-xl py-2.5 px-4 focus:outline-none focus:border-amber-400 disabled:opacity-50 transition-colors text-sm"
            />
            <button
              onClick={handleUpdateName}
              disabled={isUpdating}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-950 font-extrabold text-sm transition-all ${
                isUpdating
                  ? 'bg-amber-400/50 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-500 shadow-lg shadow-amber-400/20 active:scale-95'
              }`}
            >
              {isUpdating ? (
                <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              ) : (
                <Check sx={{ fontSize: 18 }} />
              )}
              {isUpdating ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
          <p className="text-slate-600 text-xs mt-3">
            Este é o nome que aparece no ranking e no dashboard.
          </p>
        </section>

        {/* ── DANGER ZONE ─────────────────────────────────────────────────── */}
        <section className="border border-red-500/25 rounded-3xl p-7 bg-red-950/10">
          <div className="flex items-center gap-2 mb-2">
            <Warning sx={{ fontSize: 18 }} className="text-red-400" />
            <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-red-400">
              Zona de Perigo
            </h2>
          </div>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            A exclusão da conta é <span className="text-red-300 font-semibold">permanente e irreversível</span>.
            Todo o seu progresso, CapiCoins e dados serão apagados imediatamente.
          </p>

          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-sm transition-all ${
              isDeleting
                ? 'bg-red-600/50 text-white/50 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 active:scale-95'
            }`}
          >
            {isDeleting ? (
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <DeleteForever sx={{ fontSize: 18 }} />
            )}
            {isDeleting ? 'Excluindo…' : 'Excluir Minha Conta'}
          </button>
        </section>

      </div>
    </div>
  );
}

// ── Small reusable info card ─────────────────────────────────────────────────
function InfoCard({ icon, label, value, accent = 'text-white' }) {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-slate-500">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>
      </div>
      <p className={`text-sm font-semibold truncate ${accent}`}>{value}</p>
    </div>
  );
}