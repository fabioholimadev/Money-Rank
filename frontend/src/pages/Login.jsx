import ArrowBack from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';

/**
 * Tela transitória entre a autenticação legada e o Firebase Auth.
 *
 * A Task 1.1 remove todos os campos e ações de e-mail/senha. A Task 1.2
 * substituirá o aviso abaixo pelo botão funcional "Continuar com o Google".
 */
export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/80 p-8 text-center shadow-lg shadow-amber-500/5 backdrop-blur-sm">
        <h1 className="mb-2 text-3xl font-black tracking-tighter text-white">
          MONEY<span className="text-amber-400">RANK</span>
        </h1>

        <p className="text-slate-300">
          Estamos preparando um acesso mais simples e seguro.
        </p>

        <div
          className="my-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 text-left"
          role="status"
        >
          <p className="font-bold text-amber-400">Novo acesso com Google</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Os formulários antigos de e-mail e senha foram desativados. A
            autenticação exclusiva com Google será habilitada na próxima etapa
            da atualização.
          </p>
        </div>

        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-slate-400 transition-colors hover:text-amber-400"
        >
          <ArrowBack sx={{ fontSize: 16 }} />
          Voltar para o início
        </Link>
      </section>
    </main>
  );
}
