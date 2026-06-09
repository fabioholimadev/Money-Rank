import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Regras de senha forte
const REGRAS = [
  { id: 'length',    label: 'Mínimo 8 caracteres',                       test: (s) => s.length >= 8 },
  { id: 'uppercase', label: 'Pelo menos 1 letra maiúscula',               test: (s) => /[A-Z]/.test(s) },
  { id: 'number',    label: 'Pelo menos 1 número',                        test: (s) => /\d/.test(s) },
  { id: 'special',   label: 'Pelo menos 1 caractere especial (!@#$...)',  test: (s) => /[^A-Za-z0-9]/.test(s) },
];

function IndicadorRegra({ ok, label }) {
  return (
    <li className={`flex items-center gap-2 text-xs transition-colors ${ok ? 'text-green-400' : 'text-slate-500'}`}>
      {ok
        ? <CheckCircle size={14} />
        : <AlertCircle size={14} />
      }
      {label}
    </li>
  );
}

export default function RedefinirSenha() {
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha]               = useState('');
  const [confirmarSenha, setConfirmarSenha]     = useState('');
  const [mostrarNova, setMostrarNova]           = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [isLoading, setIsLoading]               = useState(false);
  const [erro, setErro]                         = useState('');
  const [sucesso, setSucesso]                   = useState(false);
  const [sessaoValida, setSessaoValida]         = useState(false);
  const [verificando, setVerificando]           = useState(true);

  // Verifica se o Supabase estabeleceu uma sessão válida a partir do link do e-mail.
  // O Supabase dispara o evento PASSWORD_RECOVERY quando o usuário acessa via link.
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessaoValida(true);
      }
      setVerificando(false);
    });

    // Timeout de segurança: se em 3s nenhum evento chegar, encerra a verificação
    const timeout = setTimeout(() => setVerificando(false), 3000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const regrasOk = REGRAS.map((r) => ({ ...r, ok: r.test(novaSenha) }));
  const todasRegrasOk = regrasOk.every((r) => r.ok);
  const senhasIguais = novaSenha === confirmarSenha && confirmarSenha.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!todasRegrasOk) {
      setErro('A senha não cumpre todos os requisitos de segurança.');
      return;
    }
    if (!senhasIguais) {
      setErro('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: novaSenha });
      if (error) throw new Error('Não foi possível atualizar a senha. O link pode ter expirado.');

      setSucesso(true);
      // Redireciona para o login após 3 segundos
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setErro(err.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Tela de carregamento enquanto verifica a sessão ──
  if (verificando) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400 animate-pulse text-sm">Verificando link de recuperação...</p>
      </div>
    );
  }

  // ── Link inválido / sessão não reconhecida ──
  if (!sessaoValida) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 w-full max-w-md text-center">
          <AlertCircle size={52} className="text-red-400 mb-4 mx-auto" />
          <h2 className="text-xl font-black text-white mb-2">Link inválido ou expirado</h2>
          <p className="text-slate-400 text-sm mb-6">
            Este link de recuperação não é mais válido. Solicite um novo link para continuar.
          </p>
          <button
            onClick={() => navigate('/esqueci-senha')}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 rounded-xl transition-colors"
          >
            Solicitar novo link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="bg-zinc-900/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg shadow-amber-500/5 border border-zinc-800 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tighter">
            MONEY<span className="text-amber-400">RANK</span>
          </h1>
        </div>

        {/* Estado: senha redefinida com sucesso */}
        {sucesso ? (
          <div className="text-center">
            <CheckCircle size={56} className="text-green-400 mb-4 mx-auto" />
            <h2 className="text-xl font-black text-white mb-2">Senha atualizada!</h2>
            <p className="text-slate-400 text-sm">
              Sua nova senha foi salva. Redirecionando para o login...
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <KeyRound size={28} className="text-amber-400 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-black text-white leading-tight">Crie uma nova senha</h2>
                <p className="text-slate-400 text-xs">Escolha algo forte. A banca não perdoa.</p>
              </div>
            </div>

            {/* Banner de erro */}
            {erro && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Nova senha */}
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-1">Nova senha</label>
                <div className="relative">
                  <input
                    type={mostrarNova ? 'text' : 'password'}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="w-full bg-slate-900 text-white border border-zinc-700 rounded-xl py-3 px-4 pr-11 focus:outline-none focus:border-amber-400 disabled:opacity-50 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarNova(!mostrarNova)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors"
                    aria-label={mostrarNova ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {mostrarNova ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Checklist de requisitos — aparece enquanto está digitando */}
              {novaSenha.length > 0 && (
                <ul className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col gap-1.5">
                  {regrasOk.map((r) => (
                    <IndicadorRegra key={r.id} ok={r.ok} label={r.label} />
                  ))}
                </ul>
              )}

              {/* Confirmar senha */}
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-1">Confirmar nova senha</label>
                <div className="relative">
                  <input
                    type={mostrarConfirmar ? 'text' : 'password'}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    disabled={isLoading}
                    placeholder="••••••••"
                    className={`w-full bg-slate-900 text-white border rounded-xl py-3 px-4 pr-11 focus:outline-none disabled:opacity-50 transition-colors ${
                      confirmarSenha.length > 0
                        ? senhasIguais
                          ? 'border-green-500 focus:border-green-400'
                          : 'border-red-500 focus:border-red-400'
                        : 'border-zinc-700 focus:border-amber-400'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-400 transition-colors"
                    aria-label={mostrarConfirmar ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {mostrarConfirmar ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmarSenha.length > 0 && (
                  <p className={`text-xs mt-1.5 font-semibold ${senhasIguais ? 'text-green-400' : 'text-red-400'}`}>
                    {senhasIguais ? '✓ As senhas coincidem' : '✗ As senhas não coincidem'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || !todasRegrasOk || !senhasIguais}
                className={`mt-2 bg-amber-400 text-slate-950 font-black py-3 rounded-xl transition-all ${
                  isLoading || !todasRegrasOk || !senhasIguais
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-amber-300 shadow-lg shadow-amber-400/20 active:translate-y-0.5'
                }`}
              >
                {isLoading ? 'Salvando...' : 'Salvar nova senha'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
