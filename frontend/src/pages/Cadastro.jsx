import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// ─── Password rules ────────────────────────────────────────────────────────────
// Min 8 chars · 1 uppercase · 1 lowercase · 1 digit · 1 special (@#$%&)
function validarSenha(senha) {
  const erros = [];
  if (senha.length < 8)          erros.push('pelo menos 8 caracteres');
  if (!/[A-Z]/.test(senha))      erros.push('1 letra maiúscula');
  if (!/[a-z]/.test(senha))      erros.push('1 letra minúscula');
  if (!/\d/.test(senha))         erros.push('1 número');
  if (!/[@#$%&]/.test(senha))    erros.push('1 caractere especial (@, #, $, %, &)');
  return erros; // empty array = valid
}

// ─── Accepted avatar MIME types ───────────────────────────────────────────────
const AVATAR_ACCEPT = 'image/jpeg,image/jpg,image/png';
const MAX_AVATAR_MB = 2;

export default function Cadastro() {
  const navigate = useNavigate();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [nome,             setNome]             = useState('');
  const [email,            setEmail]            = useState('');
  const [password,         setPassword]         = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [avatarFile,       setAvatarFile]       = useState(null);   // File | null
  const [avatarPreview,    setAvatarPreview]    = useState(null);   // object URL | null
  const [errorMessages,    setErrorMessages]    = useState([]);
  const [successMessage,   setSuccessMessage]   = useState('');
  const [loading,          setLoading]          = useState(false);
  const [loadingStep,      setLoadingStep]      = useState('');     // granular feedback

  const fileInputRef = useRef(null);

  // ── Avatar file picker handler ──────────────────────────────────────────────
  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Client-side type guard
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setErrorMessages(['Avatar: somente arquivos .jpg, .jpeg ou .png são aceitos.']);
      return;
    }
    if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
      setErrorMessages([`Avatar: o arquivo não pode ultrapassar ${MAX_AVATAR_MB} MB.`]);
      return;
    }

    // Revoke previous object URL to avoid memory leaks
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrorMessages([]);
  };

  // ── Full form validation ────────────────────────────────────────────────────
  const validarFormulario = () => {
    const erros = [];

    if (!nome.trim())
      erros.push('Nome de Exibição é obrigatório.');

    if (!email.trim())
      erros.push('E-mail é obrigatório.');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      erros.push('E-mail inválido.');

    if (!password) {
      erros.push('Senha é obrigatória.');
    } else {
      const senhaErros = validarSenha(password);
      if (senhaErros.length > 0)
        erros.push(`Senha fraca — inclua: ${senhaErros.join(', ')}.`);
    }

    if (!turmaSelecionada)
      erros.push('Selecione sua turma.');

    if (!avatarFile)
      erros.push('Escolha uma foto de perfil (avatar).');

    return erros;
  };

  // ── Registration flow ───────────────────────────────────────────────────────
  // Steps:
  //  1. supabase.auth.signUp()           → creates auth user, returns user.id
  //  2. supabase.storage.upload()        → uploads avatar to "avatars" bucket
  //  3. supabase.storage.getPublicUrl()  → gets the CDN URL
  //  4. supabase.from('alunos').insert() → creates profile row with avatar_url
  //  5. navigate('/student')
  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMessages([]);
    setSuccessMessage('');

    const erros = validarFormulario();
    if (erros.length > 0) {
      setErrorMessages(erros);
      return;
    }

    setLoading(true);

    try {
      // ── Step 1: Create auth user ──────────────────────────────────────────
      setLoadingStep('Criando conta…');

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (authError) {
        setErrorMessages([traduzirErroSupabase(authError.message)]);
        return;
      }

      const userId = authData?.user?.id;
      if (!userId) {
        setErrorMessages(['Não foi possível obter o ID do usuário. Tente novamente.']);
        return;
      }

      // ── Step 2: Upload avatar ─────────────────────────────────────────────
      setLoadingStep('Enviando avatar…');

      const ext      = avatarFile.name.split('.').pop().toLowerCase();
      const filePath = `${userId}.${ext}`;  // e.g. "uuid.jpg" — unique per user

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          contentType: avatarFile.type,
          upsert: true, // safe to re-run if previous attempt half-succeeded
        });

      if (uploadError) {
        setErrorMessages([`Erro ao enviar avatar: ${uploadError.message}`]);
        return;
      }

      // ── Step 3: Get public URL ────────────────────────────────────────────
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = urlData?.publicUrl ?? null;

      // ── Step 4: Insert profile row ────────────────────────────────────────
      setLoadingStep('Salvando perfil…');

      const { error: insertError } = await supabase
        .from('alunos')
        .upsert({
          id:         userId,
          nome:       nome.trim(),
          email:      email.trim(),
          turma:      turmaSelecionada,
          avatar_url: avatarUrl,
          capicoins:  0,
        });

      if (insertError) {
        setErrorMessages([`Erro ao salvar perfil: ${insertError.message}`]);
        return;
      }

      // ── Step 5: Persist session data & redirect ───────────────────────────
      setLoadingStep('Redirecionando…');

      const alunoData = {
        id:         userId,
        nome:       nome.trim(),
        email:      email.trim(),
        turma:      turmaSelecionada,
        avatar_url: avatarUrl,
        capicoins:  0,
        is_admin:   false,
      };
      localStorage.setItem('aluno', JSON.stringify(alunoData));

      // Persist Supabase session token for authenticated API calls
      const session = authData?.session;
      if (session?.access_token) {
        localStorage.setItem('token', session.access_token);
      }

      setSuccessMessage('Conta criada com sucesso! Bem-vindo(a) ao Money Rank 🎉');
      setTimeout(() => navigate('/student'), 1500);

    } catch (erro) {
      console.error('[Cadastro] Erro inesperado:', erro);
      setErrorMessages(['Ocorreu um erro inesperado. Verifique sua conexão e tente novamente.']);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-4xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-amber-500/10">

        {/* Header */}
        <div className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.35em] text-amber-400">
            Money Rank
          </span>
          <h1 className="mt-4 text-4xl font-black text-white">Crie sua conta</h1>
          <p className="mt-3 text-sm text-slate-400">
            Preencha os dados abaixo para acessar o painel estudantil.
          </p>
        </div>

        {/* Error messages */}
        {errorMessages.length > 0 && (
          <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            <ul className="list-disc list-inside space-y-2">
              {errorMessages.map((mensagem, index) => (
                <li key={index}>{mensagem}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Success message */}
        {successMessage && (
          <div className="mb-6 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">

          {/* Nome */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Nome de Exibição
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={loading}
              placeholder="Maria Souza"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="seu@email.com"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
            {/* Live strength hint shown once the user starts typing */}
            {password.length > 0 && (
              <PasswordStrengthHint password={password} />
            )}
          </div>

          {/* Turma */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Turma
            </label>
            <select
              value={turmaSelecionada}
              onChange={(e) => setTurmaSelecionada(e.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="" disabled>Selecione sua Turma</option>
              <option value="3º DSA">3º DSA</option>
              <option value="3º DSB">3º DSB</option>
            </select>
          </div>

          {/* Avatar upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Foto de Perfil{' '}
              <span className="text-slate-500 font-normal">(JPG ou PNG, max 2 MB)</span>
            </label>

            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              accept={AVATAR_ACCEPT}
              onChange={handleAvatarChange}
              disabled={loading}
              className="hidden"
            />

            {/* Custom styled trigger + preview */}
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="shrink-0 rounded-2xl border border-dashed border-slate-600 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-400 transition hover:border-amber-400 hover:text-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {avatarFile ? '↺ Trocar foto' : '+ Escolher foto'}
              </button>

              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Pré-visualização do avatar"
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-amber-400/40"
                />
              ) : (
                <div className="h-14 w-14 rounded-2xl border border-slate-700 bg-slate-950 flex items-center justify-center text-slate-600 text-2xl select-none">
                  👤
                </div>
              )}

              {avatarFile && (
                <span className="text-xs text-slate-500 truncate max-w-32.5">
                  {avatarFile.name}
                </span>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black uppercase text-slate-950 transition ${
              loading ? 'cursor-not-allowed opacity-70' : 'hover:bg-amber-300'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                {loadingStep || 'Processando…'}
              </span>
            ) : (
              'Cadastrar'
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
          <p>
            Já tem conta?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300 font-semibold">
              Faça login
            </Link>
          </p>
          <p className="mt-3">
            <Link to="/" className="text-slate-400 hover:text-amber-300">
              Voltar para a página inicial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Password strength hint component ─────────────────────────────────────────
function PasswordStrengthHint({ password }) {
  const checks = [
    { label: '8+ caracteres',         ok: password.length >= 8 },
    { label: '1 letra maiúscula',     ok: /[A-Z]/.test(password) },
    { label: '1 letra minúscula',     ok: /[a-z]/.test(password) },
    { label: '1 número',              ok: /\d/.test(password) },
    { label: '1 especial (@#$%&)',    ok: /[@#$%&]/.test(password) },
  ];

  const passedCount = checks.filter((c) => c.ok).length;
  const allPassed   = passedCount === checks.length;

  return (
    <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 space-y-1.5">
      {/* Strength bar */}
      <div className="flex gap-1 mb-2">
        {checks.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < passedCount ? 'bg-amber-400' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {checks.map((check) => (
        <div key={check.label} className="flex items-center gap-2 text-xs">
          <span className={check.ok ? 'text-amber-400' : 'text-slate-600'}>
            {check.ok ? '✓' : '○'}
          </span>
          <span className={check.ok ? 'text-slate-400' : 'text-slate-600'}>
            {check.label}
          </span>
        </div>
      ))}

      {allPassed && (
        <p className="text-xs text-amber-400 font-semibold pt-1">Senha forte ✓</p>
      )}
    </div>
  );
}

// ─── Translate common Supabase auth errors to Portuguese ──────────────────────
function traduzirErroSupabase(msg = '') {
  if (msg.includes('already registered') || msg.includes('User already registered'))
    return 'Este e-mail já está cadastrado. Faça login ou use outro e-mail.';
  if (msg.includes('Invalid email'))
    return 'Endereço de e-mail inválido.';
  if (msg.includes('Password should be'))
    return 'Senha muito fraca. Siga os requisitos indicados.';
  if (msg.includes('rate limit') || msg.includes('too many'))
    return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
  return msg;
}