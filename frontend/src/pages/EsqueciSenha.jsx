import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setIsLoading(true);

    try {
      if (!email.trim()) throw new Error('Informe o seu e-mail.');

      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });

      if (error) throw new Error('Não foi possível enviar o link. Verifique o e-mail informado.');

      setEnviado(true);
    } catch (err) {
      setErro(err.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="bg-zinc-900/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg shadow-amber-500/5 border border-zinc-800 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tighter">
            MONEY<span className="text-amber-400">RANK</span>
          </h1>
        </div>

        {/* Estado: link enviado com sucesso */}
        {enviado ? (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle size={56} className="text-green-400" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">Link enviado!</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Enviamos um link para <span className="text-amber-400 font-semibold">{email}</span>.
              Verifique sua caixa de entrada (e o spam) e clique no link para redefinir sua senha.
            </p>
            <Link
              to="/login"
              className="block w-full text-center bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 rounded-xl transition-colors"
            >
              Voltar para o Login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-black text-white mb-1">Esqueceu a senha?</h2>
              <p className="text-slate-400 text-sm">
                Sem problemas. Informe o e-mail da sua conta e te mandamos um link de recuperação.
              </p>
            </div>

            {/* Banner de erro */}
            {erro && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-slate-300 text-sm font-bold mb-1">E-mail</label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="seu@email.com"
                    className="w-full bg-slate-900 text-white border border-zinc-700 rounded-xl py-3 pl-9 pr-4 focus:outline-none focus:border-amber-400 disabled:opacity-50 transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`mt-2 bg-amber-400 text-slate-950 font-black py-3 rounded-xl transition-all ${
                  isLoading
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:bg-amber-300 shadow-lg shadow-amber-400/20 active:translate-y-0.5'
                }`}
              >
                {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-slate-400 hover:text-amber-400 text-sm transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft size={16} />
                Voltar para o Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
