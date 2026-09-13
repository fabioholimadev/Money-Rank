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
    <div className="rounded-3xl border border-[#37464f] bg-[#17262c] p-5 shadow-sm transition-all hover:border-[#58cc02]/30 hover:shadow-md">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[#58cc02]">{icon}</span>
        <span className="text-xs font-black uppercase tracking-wider text-[#a5b7c2]">
          {label}
        </span>
      </div>
      <p className={`truncate text-base font-black ${accent}`}>{value}</p>
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
          className="h-10 w-10 animate-spin rounded-full border-4 border-[#58cc02] border-t-transparent"
          role="status"
        />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-8 text-[#F8F8F8]">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'radial-gradient(#58cc02 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <header className="relative">
        <span className="text-xs font-black uppercase tracking-[0.25em] text-[#58cc02]">
          Meu Perfil
        </span>
        <h1 className="mt-1 text-3xl sm:text-4xl font-black tracking-tight text-white">
          Configurações da Conta
        </h1>
      </header>

      {/* ── CARD PRINCIPAL DE IDENTIFICAÇÃO ─────────────────────────── */}
      <section className="relative flex items-center gap-5 rounded-3xl border border-[#37464f] bg-[#1f2d33] p-6 sm:p-7 shadow-xl">
        <div className="relative">
          <ProfileAvatar
            avatarId={aluno.avatar_id}
            className="border-2 border-[#58cc02] shadow-[0_0_20px_rgba(93,214,44,0.25)]"
            name={aluno.nome}
            photoUrl={aluno.avatar_url}
            size="lg"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xl sm:text-2xl font-black tracking-tight text-white">
            {aluno.nome}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#58cc02]/10 border border-[#58cc02]/30 text-[#58cc02]">
              {aluno.turma || '3º DSA'}
            </span>
            <span className="text-xs text-[#78909c]">•</span>
            <span className="text-xs font-bold text-[#a5b7c2]">
              {aluno.is_admin ? 'Professor / Orientador' : 'Estudante'}
            </span>
          </div>
        </div>
      </section>

      {/* ── INFORMAÇÕES DA CONTA ────────────────────────────────────── */}
      <section className="relative">
        <h2 className="mb-4 text-xs font-black uppercase tracking-[0.25em] text-[#a5b7c2]">
          Dados Cadastrais
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <InfoCard
            icon={<EmailOutlined sx={{ fontSize: 20 }} />}
            label="E-mail Google"
            value={aluno.email}
          />
          <InfoCard
            accent="text-[#58cc02]"
            icon={<MonetizationOn sx={{ fontSize: 20 }} />}
            label="Saldo em Carteira"
            value={`${(aluno.capicoins ?? 0).toLocaleString('pt-BR')} CapiCoins`}
          />
          <InfoCard
            icon={<GroupsOutlined sx={{ fontSize: 20 }} />}
            label="Turma Atual"
            value={aluno.turma || 'Não definida'}
          />
        </div>
      </section>

      {/* ── FORMULÁRIO DE EDIÇÃO ────────────────────────────────────── */}
      <section className="relative rounded-3xl border border-[#37464f] bg-[#1f2d33] p-6 sm:p-8 shadow-xl">
        <div className="mb-6">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#58cc02]">
            Alterar Dados
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#a5b7c2]">
            Atualize seu nome preferido, turma escolar ou selecione um novo avatar profissional.
          </p>
        </div>

        {successMessage && (
          <div
            className="mb-5 flex items-center gap-2 rounded-2xl border border-[#58cc02]/40 bg-[#58cc02]/10 px-4 py-3 text-sm font-bold text-[#58cc02]"
            role="status"
          >
            <Check sx={{ fontSize: 20 }} />
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

      {/* ── AUDITORIA CAPI BANK ─────────────────────────────────────── */}
      <section className="relative rounded-3xl border border-[#58cc02]/20 bg-[#1f2d33] p-6 shadow-sm">
        <p className="text-xs sm:text-sm leading-relaxed text-[#a5b7c2]">
          Seu perfil e seu histórico de transações são auditados pelo{' '}
          <strong className="text-white">Capi Bank</strong> com integridade transacional garantida para a competição.
        </p>
      </section>
    </div>
  );
}
