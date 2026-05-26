import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PhotoCamera } from '@mui/icons-material';
import { supabase } from '../lib/supabase';

export default function Cadastro() {
  const navigate = useNavigate();
  
  // Estados originais
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  
  // Novos estados para a Foto de Perfil
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validarFormulario = () => {
    const erros = [];
    if (!nome.trim()) erros.push('Nome de Exibição é obrigatório.');
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
    if (!turmaSelecionada) erros.push('Selecione sua turma.');
    return erros;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
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
      // 1. Cria o usuário no Supabase Auth (O Trigger do banco criará o aluno)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { 
          data: { nome: nome.trim() } 
        }
      });

      if (authError) {
        throw new Error(authError.message.includes('already registered') ? 'Este e-mail já está em uso.' : 'Erro ao criar conta.');
      }

      if (!authData.user) throw new Error('Falha ao registrar usuário.');

      const userId = authData.user.id;
      let avatarUrl = null;

      // 2. Faz o upload da foto (se houver)
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${userId}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
          avatarUrl = urlData.publicUrl;
        }
      }

      // 3. Atualiza a tabela 'alunos' com a Turma escolhida e a Foto (se tiver)
      const updatePayload = { turma: turmaSelecionada };
      if (avatarUrl) updatePayload.avatar_url = avatarUrl;

      await supabase.from('alunos').update(updatePayload).eq('id', userId);

      // 4. Sucesso!
      setSuccessMessage('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => navigate('/login'), 2500);

    } catch (erro) {
      console.error(erro);
      setErrorMessages([erro.message || 'Ocorreu um erro inesperado.']);
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
          <div className="mb-6 rounded-3xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100 font-semibold text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* Seletor de Foto de Perfil */}
          <div className="flex justify-center mb-2">
            <div className="relative group cursor-pointer">
              <input type="file" hidden id="cadastro-avatar" accept="image/*" onChange={handleAvatarChange} disabled={loading} />
              <label htmlFor="cadastro-avatar" className={`cursor-pointer ${loading ? 'pointer-events-none opacity-50' : ''}`}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-amber-400/50" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center hover:border-amber-400/50 transition-colors">
                    <PhotoCamera sx={{ fontSize: 32 }} className="text-slate-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PhotoCamera className="text-white" />
                </div>
              </label>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500 -mt-2 mb-4">Escolha uma foto de perfil (Opcional)</p>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Nome de Exibição</label>
            <input
              type="text"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              disabled={loading}
              placeholder="Ex: Maria Souza"
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
              <option value="" disabled>Selecione sua Turma</option>
              <option value="3º DSA">3º DSA</option>
              <option value="3º DSB">3º DSB</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-2xl bg-amber-400 px-5 py-3.5 mt-2 text-sm font-black uppercase text-slate-950 transition ${
              loading ? 'cursor-not-allowed opacity-70' : 'hover:bg-amber-300 active:scale-95'
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
            <Link to="/" className="text-slate-500 hover:text-amber-300 transition-colors">
              Voltar para a página inicial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}