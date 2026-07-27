import { useCallback, useState } from 'react';
import Check from '@mui/icons-material/Check';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import ProfileAvatar from '../components/ProfileAvatar';
import ProfileForm from '../components/ProfileForm';
import { useAuth } from '../contexts/AuthContext';

function InfoCard({ icon, label, value, accent = 'text-white' }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 backdrop-blur-sm transition hover:border-zinc-700">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-slate-500">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
          {label}
        </span>
      </div>
      <p className={`truncate text-sm font-semibold ${accent}`}>{value}</p>
    </div>
  );
}

export default function Perfil() {
  const { aluno, saveProfile, loading } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = useCallback(
    async (profile) => {
      await saveProfile(profile);
      setSuccessMessage('Perfil atualizado com sucesso.');
    },
    [saveProfile]
  );

  if (loading || !aluno) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div
          aria-label="Carregando perfil"
          className="h-10 w-10 animate-spin rounded-full border-4 border-amber-400 border-t-transparent"
          role="status"
        />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-8 text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <header className="relative">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400/70">
          Meu Perfil
        </span>
        <h1 className="mt-0.5 text-3xl font-black tracking-tighter">
          Configurações
        </h1>
      </header>

      <section className="relative flex items-center gap-5 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-7 backdrop-blur-sm">
        <ProfileAvatar
          avatarId={aluno.avatar_id}
          name={aluno.nome}
          photoUrl={aluno.avatar_url}
          size="lg"
        />
        <div className="min-w-0">
          <p className="truncate text-xl font-black tracking-tight">
            {aluno.nome}
          </p>
          <p className="mt-1 truncate text-xs uppercase tracking-widest text-slate-500">
            {aluno.turma} · {aluno.is_admin ? 'Professor' : 'Estudante'}
          </p>
        </div>
      </section>

      <section className="relative">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
          Informações da conta
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoCard
            icon={<EmailOutlined sx={{ fontSize: 20 }} />}
            label="E-mail"
            value={aluno.email}
          />
          <InfoCard
            accent="text-amber-400"
            icon={<MonetizationOn sx={{ fontSize: 20 }} />}
            label="Saldo"
            value={`${aluno.capicoins ?? 0} CapiCoins`}
          />
          <InfoCard
            icon={<GroupsOutlined sx={{ fontSize: 20 }} />}
            label="Turma"
            value={aluno.turma}
          />
        </div>
      </section>

      <section className="relative rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 backdrop-blur-sm sm:p-7">
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">
            Alterar dados
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            Atualize o nome, a turma ou o avatar exibidos no jogo.
          </p>
        </div>

        {successMessage && (
          <div
            className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
            role="status"
          >
            <Check sx={{ fontSize: 19 }} />
            {successMessage}
          </div>
        )}

        <ProfileForm
          initialProfile={aluno}
          onSubmit={handleSave}
          requireChanges
          submitLabel="Salvar alterações"
        />
      </section>

      <section className="relative rounded-3xl border border-amber-400/20 bg-amber-400/5 p-6">
        <p className="text-sm leading-relaxed text-slate-400">
          A sincronização de turma, avatar e progresso entre dispositivos será
          ativada nas próximas tasks com o Firebase SQL Connect.
        </p>
      </section>
    </div>
  );
}
