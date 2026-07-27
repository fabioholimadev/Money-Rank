import { useState, useEffect } from 'react';
import {
  AccountCircle,
  Edit,
  Check,
  Close,
  MonetizationOn,
  Groups,
  EmailOutlined,
  Warning,
  Person,
  PhotoCamera
} from '@mui/icons-material';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// ─── Inline Toast ──────────────────────────────────────────────────────────────
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
      className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-sm shadow-xl text-sm font-semibold max-w-[90vw] ${colors}`}
    >
      {type === 'success' ? (
        <Check sx={{ fontSize: 18 }} className="shrink-0" />
      ) : (
        <Warning sx={{ fontSize: 18 }} className="shrink-0" />
      )}
      <span className="leading-snug">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity shrink-0">
        <Close sx={{ fontSize: 16 }} />
      </button>
    </div>
  );
}

// ─── InfoCard ──────────────────────────────────────────────────────────────────
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

// ─── Perfil ────────────────────────────────────────────────────────────────────
export default function Perfil() {
  const { aluno, updateAluno, loading: contextLoading } = useAuth();

  // ── State ──────────────────────────────────────────────────────────────────
  const [displayName, setDisplayName]   = useState(aluno?.nome ?? '');
  const userEmail = aluno?.email ?? '';
  const [avatarPreview, setAvatarPreview] = useState(aluno?.avatar_url ?? null);
  const [avatarFile, setAvatarFile]     = useState(null);
  const [isUpdating, setIsUpdating]     = useState(false);
  const [toast, setToast]               = useState(null);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showToast = (message, type = 'success') => setToast({ message, type });
  const hideToast = () => setToast(null);

  const handleAvatarChange = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // ── UPDATE: Salvar nome e foto ─────────────────────────────────────────────
  const handleUpdateProfile = async () => {
    // Guard: sessão pode ter expirado durante uso mobile em background
    if (!aluno?.id) {
      showToast('Sessão inválida. Recarregue a página e tente novamente.', 'error');
      return;
    }

    const trimmed = displayName.trim();
    if (!trimmed) {
      showToast('O nome não pode ficar vazio.', 'error');
      return;
    }
    if (trimmed === (aluno.nome ?? '') && !avatarFile) {
      showToast('Nenhuma alteração detectada.', 'error');
      return;
    }

    setIsUpdating(true);
    try {
      // 1. Upload da foto (se existir)
      let newAvatarUrl = aluno?.avatar_url ?? null;
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop() ?? 'jpg';
        const filePath = `${aluno.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw new Error(`Erro no upload da foto: ${uploadError.message}`);

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        // Anexa timestamp para forçar reload da imagem em cache
        newAvatarUrl = urlData?.publicUrl
          ? `${urlData.publicUrl}?t=${Date.now()}`
          : newAvatarUrl;
      }

      // 2. Actualizar tabela 'alunos'
      const { error: updateError } = await supabase
        .from('alunos')
        .update({ nome: trimmed, avatar_url: newAvatarUrl })
        .eq('id', aluno.id);

      if (updateError) throw new Error(`Erro ao salvar: ${updateError.message}`);

      // 3. Actualizar o snapshot do perfil no contexto
      updateAluno({
        nome: trimmed,
        avatar_url: newAvatarUrl,
      });

      setAvatarFile(null);
      showToast('Perfil actualizado com sucesso! ✓');

    } catch (err) {
      console.error('[Perfil] handleUpdateProfile:', err);
      showToast(
        err?.message || 'Erro inesperado ao actualizar o perfil. Tente novamente.',
        'error'
      );
    } finally {
      // Sempre desbloqueia o botão, independentemente do caminho de erro
      setIsUpdating(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (contextLoading || !aluno) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-slate-400 text-sm tracking-widest uppercase">Carregando</p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-2xl mx-auto px-5 py-8 flex flex-col gap-8">

        {/* ── HEADER ────────────────────────────────────────────────────── */}
        <header>
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400/70">
            Meu Perfil
          </span>
          <h1 className="text-3xl font-black tracking-tighter mt-0.5 text-white">
            Configurações
          </h1>
        </header>

        {/* ── AVATAR BLOCK ──────────────────────────────────────────────── */}
        <section className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-7 flex items-center gap-5">
          <div className="relative group cursor-pointer">
            <input
              type="file"
              hidden
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload" className="cursor-pointer block">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/50"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                  <AccountCircle sx={{ fontSize: 48 }} className="text-amber-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PhotoCamera className="text-white" />
              </div>
            </label>
          </div>

          <div>
            <p className="text-xl font-black tracking-tight">{aluno.nome ?? '—'}</p>
            <p className="text-slate-500 text-xs mt-0.5 uppercase tracking-widest">
              {aluno.is_admin ? 'Administrador' : 'Estudante'}
            </p>
          </div>
        </section>

        {/* ── INFO CARDS ────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-4">
            Informações da Conta
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoCard
              icon={<EmailOutlined sx={{ fontSize: 20 }} />}
              label="E-mail"
              value={userEmail || 'Carregando…'}
            />
            <InfoCard
              icon={<MonetizationOn sx={{ fontSize: 20 }} />}
              label="Saldo de CapiCoins"
              value={`${aluno.capicoins ?? 0} CapiCoins`}
              accent="text-amber-400"
            />
            <InfoCard
              icon={<Groups sx={{ fontSize: 20 }} />}
              label="Turma"
              value={aluno.turma || 'Sem turma'}
            />
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

        {/* ── UPDATE DISPLAY NAME ───────────────────────────────────────── */}
        <section className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-3xl p-7">
          <div className="flex items-center gap-2 mb-5">
            <Edit sx={{ fontSize: 18 }} className="text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-slate-300">
              Alterar Dados
            </h2>
          </div>

          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isUpdating && handleUpdateProfile()}
              disabled={isUpdating}
              maxLength={40}
              placeholder="Seu nome de exibição"
              className="flex-1 bg-slate-900 text-white border border-zinc-700 rounded-xl py-2.5 px-4 focus:outline-none focus:border-amber-400 disabled:opacity-50 transition-colors text-sm"
            />
            <button
              onClick={handleUpdateProfile}
              disabled={
                isUpdating ||
                (!avatarFile && displayName.trim() === (aluno.nome ?? ''))
              }
              className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-slate-950 font-extrabold text-sm transition-all ${
                isUpdating || (!avatarFile && displayName.trim() === (aluno.nome ?? ''))
                  ? 'bg-amber-400/50 cursor-not-allowed'
                  : 'bg-amber-400 hover:bg-amber-500 shadow-lg shadow-amber-400/20 active:scale-95'
              }`}
            >
              {isUpdating ? (
                <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              ) : (
                <Check sx={{ fontSize: 18 }} />
              )}
              {isUpdating ? 'Salvando…' : 'Salvar Alterações'}
            </button>
          </div>
          <p className="text-slate-600 text-xs mt-3">
            O seu novo nome ou foto aparecerão no ranking imediatamente.
          </p>
        </section>

        {/* ── ACCOUNT MIGRATION NOTICE ───────────────────────────────────── */}
        <section className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-7">
          <div className="flex items-center gap-2 mb-2">
            <Warning sx={{ fontSize: 18 }} className="text-amber-400" />
            <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-amber-400">
              Gestão da Conta
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            A exclusão de conta ficará disponível novamente após a migração
            completa para o Firebase Auth.
          </p>
        </section>

      </div>
    </div>
  );
}
