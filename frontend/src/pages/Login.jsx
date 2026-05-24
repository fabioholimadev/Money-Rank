import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Login as LoginIcon, Logout, ArrowBack } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const location = useLocation();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(
    location.state?.screen === 'register' ? false : true
  );
  const [isLoading, setIsLoading] = useState(false);
  
  // Estados dos inputs
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados de feedback visual (Substituindo os alerts)
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  // Regra 5: Reseta estados ao alternar entre Login e Cadastro
  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setErrorMessages([]);
    setSuccessMessage('');
    setPassword('');
    setNome('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessages([]);
    setSuccessMessage('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const url = `http://localhost:3000${endpoint}`;

    try {
      const resposta = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, password }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        // Regra 2: Trata erros 422 (detalhes) ou outros status do Express
        if (resposta.status === 422 && dados.detalhes) {
          setErrorMessages(dados.detalhes);
        } else {
          setErrorMessages([dados.error || 'Ocorreu um erro inesperado.']);
        }
        setIsLoading(false);
        return;
      }

      // Se der tudo certo:
      if (isLogin) {
        // Use AuthContext to update app auth state in a single place.
        login(dados);
        navigate('/student');
      } else {
        // Regra 4: UX Pós-cadastro (muda para login mas mantém o e-mail preenchido)
        setSuccessMessage('Conta criada com sucesso! Faça seu login agora.');
        setIsLogin(true);
        setPassword('');
        setNome('');
      }
    } catch (erro) {
      // Regra 2: Fallback de rede fora do ar
      setErrorMessages(['Não foi possível conectar ao servidor. Verifique se o Back-end está ligado.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">

      <div className="bg-zinc-900/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg shadow-amber-500/5 border border-zinc-800 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
            MONEY<span className="text-amber-400">RANK</span>
          </h1>
          <p className="text-slate-400">
            {isLogin ? 'Bem-vindo de volta! Faça seu login.' : 'Crie sua conta e comece a jogar!'}
          </p>
        </div>

        {/* Banners de Feedback Embutidos na Tela */}
        {errorMessages.length > 0 && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            <ul className="list-disc list-inside flex flex-col gap-1">
              {errorMessages.map((err, index) => <li key={index}>{err}</li>)}
            </ul>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-sm font-semibold">
            {successMessage}
          </div>
        )}

        {/* Formulário com Inputs Desativáveis (Regra 1) */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <label className="block text-slate-300 text-sm font-bold mb-1">Nome de Jogador</label>
              <input 
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                disabled={isLoading}
                placeholder="Como quer ser chamado?"
                className="w-full bg-slate-900 text-white border border-zinc-700 rounded-lg py-2.5 px-4 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                required={!isLogin} 
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 text-sm font-bold mb-1">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="seu@email.com"
              className="w-full bg-slate-900 text-white border border-zinc-700 rounded-lg py-2.5 px-4 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-bold mb-1">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="••••••••"
              className="w-full bg-slate-900 text-white border border-zinc-700 rounded-lg py-2.5 px-4 focus:outline-none focus:border-amber-400 disabled:opacity-50"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`mt-4 bg-amber-400 text-slate-950 text-lg font-extrabold py-3 rounded-xl transition-all ${
              isLoading 
                ? 'opacity-60 cursor-not-allowed shadow-none' 
                : 'hover:bg-amber-500 shadow-lg shadow-amber-400/20 active:translate-y-1 active:shadow-md'
            }`}
          >
            {isLoading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={handleModeSwitch}
            className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
          >
            {isLogin ? 'Ainda não tem conta? Crie uma agora.' : 'Já tem uma conta? Faça login.'}
          </button>
        </div>

        <div className="mt-3 text-center">
          <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center justify-center gap-2">
            <ArrowBack sx={{ fontSize: 16 }} />
            Voltar para o Início
          </Link>
        </div>
      </div>
    </div>
  );
}