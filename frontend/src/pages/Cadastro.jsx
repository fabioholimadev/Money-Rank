import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ✅ CORRETO: Cadastro via backend (Express), sem expor chaves do Supabase no frontend.
// O backend em http://localhost:3000/api/auth/register já trata toda a lógica
// de criação de conta no Supabase usando as chaves seguras do backend/.env

export default function Cadastro() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validarFormulario = () => {
    const erros = [];

    if (!nome.trim()) {
      erros.push('Nome de Exibição é obrigatório.');
    }

    if (!email.trim()) {
      erros.push('E-mail é obrigatório.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      erros.push('E-mail inválido.');
    }

    if (!password) {
      erros.push('Senha é obrigatória.');
    } else if (password.length < 6) {
      erros.push('Senha deve ter pelo menos 6 caracteres.');
    }

    if (!turmaSelecionada) {
      erros.push('Selecione sua turma.');
    }

    return erros;
  };

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
      // ✅ Chama o backend, que usa as chaves seguras do backend/.env
      const resposta = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          password,
          turma: turmaSelecionada,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        if (resposta.status === 422 && dados.detalhes) {
          setErrorMessages(dados.detalhes);
        } else {
          setErrorMessages([dados.error || 'Ocorreu um erro inesperado.']);
        }
        return;
      }

      if (dados.token && dados.aluno) {
        login(dados);
        navigate('/student');
        return;
      }

      setSuccessMessage('Cadastro realizado com sucesso! Faça seu login para continuar.');
      // Redireciona para o login após 2 segundos para o usuário ler a mensagem
      setTimeout(() => navigate('/login'), 2000);

    } catch (erro) {
      // Erro de rede: backend provavelmente não está rodando
      setErrorMessages(['Não foi possível conectar ao servidor. Verifique se o back-end está ligado (npm run dev na pasta backend).']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-[32px] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-amber-500/10">
        <div className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.35em] text-amber-400">Money Rank</span>
          <h1 className="mt-4 text-4xl font-black text-white">Crie sua conta</h1>
          <p className="mt-3 text-sm text-slate-400">Preencha os dados abaixo para acessar o painel estudantil.</p>
        </div>

        {errorMessages.length > 0 && (
          <div className="mb-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
            <ul className="list-disc list-inside space-y-2">
              {errorMessages.map((mensagem, index) => (
                <li key={index}>{mensagem}</li>
              ))}
            </ul>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Nome de Exibição</label>
            <input
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              disabled={loading}
              placeholder="Maria Souza"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={loading}
              placeholder="seu@email.com"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Turma</label>
            <select
              value={turmaSelecionada}
              onChange={(event) => setTurmaSelecionada(event.target.value)}
              disabled={loading}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="" disabled>
                Selecione sua Turma
              </option>
              <option value="3º Ano A">3º Ano A</option>
              <option value="3º Ano B">3º Ano B</option>
              <option value="3º Ano C">3º Ano C</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-2xl bg-amber-400 px-5 py-3 text-sm font-black uppercase text-slate-950 transition ${
              loading ? 'cursor-not-allowed opacity-70' : 'hover:bg-amber-300'
            }`}
          >
            {loading ? 'Registrando...' : 'Cadastrar'}
          </button>
        </form>

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