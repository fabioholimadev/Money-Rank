import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowBack, PhotoCamera } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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
  
  // Estados de Foto de Perfil (usado apenas no cadastro)
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  
  // Estados de feedback visual
  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  // Reseta estados ao alternar entre Login e Cadastro
  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setErrorMessages([]);
    setSuccessMessage('');
    setPassword('');
    // Limpamos o avatar ao trocar de tela
    setAvatarFile(null);
    setAvatarPreview(null);
    if (isLogin) setNome(''); // Se estava no login e foi pro cadastro, limpa o nome
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessages([]);
    setSuccessMessage('');

    try {
      if (isLogin) {
        // ── FLUXO DE LOGIN NO SUPABASE ──────────────────────────────────────
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw new Error('E-mail ou senha incorretos.');

        // Busca dados extras (capicoins, fase, nome)
        const { data: alunoData, error: alunoError } = await supabase
          .from('alunos')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (alunoError) throw new Error('Erro ao carregar dados do perfil.');

        // Salva no contexto
        login({
          token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          aluno: alunoData,
        });
        
        navigate('/student');

      } else {
        // ── FLUXO DE CADASTRO NO SUPABASE ───────────────────────────────────
        if (password.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres.');
        if (!nome.trim()) throw new Error('O nome de jogador é obrigatório.');

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { nome: nome.trim() } }
        });

        if (authError) {
          throw new Error(authError.message === 'User already registered' ? 'Este e-mail já está em uso.' : 'Erro ao criar conta.');
        }

        // Se escolheu foto, faz o upload e atualiza a tabela 'alunos'
        if (avatarFile && authData.user) {
          const fileExt = avatarFile.name.split('.').pop();
          const filePath = `${authData.user.id}/avatar.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile, { upsert: true });

          if (!uploadError) {
            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
            await supabase.from('alunos').update({ avatar_url: urlData.publicUrl }).eq('id', authData.user.id);
          }
        }

        // UX Pós-cadastro
        setSuccessMessage('Conta criada com sucesso! Faça seu login agora.');
        setIsLogin(true);
        setPassword('');
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch (erro) {
      setErrorMessages([erro.message || 'Não foi possível conectar ao servidor.']);
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {!isLogin && (
            <>
              {/* Botão de Upload de Avatar Integrado */}
              <div className="flex justify-center mb-2">
                <div className="relative group cursor-pointer">
                  <input type="file" hidden id="cadastro-avatar" accept="image/*" onChange={handleAvatarChange} disabled={isLoading} />
                  <label htmlFor="cadastro-avatar" className={`cursor-pointer ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/50" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-zinc-700 flex items-center justify-center hover:border-amber-400/50 transition-colors">
                        <PhotoCamera sx={{ fontSize: 28 }} className="text-slate-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <PhotoCamera className="text-white" />
                    </div>
                  </label>
                </div>
              </div>

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
            </>
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
              minLength={6}
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
            type="button"
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