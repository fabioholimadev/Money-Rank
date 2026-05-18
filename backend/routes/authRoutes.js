const express = require('express');
const router = express.Router();

// Auxiliares de validação de dados
function validateRegisterInput({ email, password, nome }) {
  const errors = [];
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push('E-mail inválido ou ausente.');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('A senha deve ter no mínimo 6 caracteres.');
  }
  if (nome !== undefined && (typeof nome !== 'string' || nome.trim().length === 0)) {
    errors.push('O nome, quando informado, não pode ser vazio.');
  }
  return errors;
}

function validateLoginInput({ email, password }) {
  const errors = [];
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push('E-mail inválido ou ausente.');
  }
  if (!password || typeof password !== 'string') {
    errors.push('Senha ausente.');
  }
  return errors;
}

module.exports = (supabase) => {

  // 1. ROTA DE CADASTRO (REGISTER)
  router.post('/register', async (req, res) => {
    const { email, password, nome } = req.body;
    const validationErrors = validateRegisterInput({ email, password, nome });
    
    if (validationErrors.length > 0) {
      return res.status(422).json({ error: 'Dados inválidos.', detalhes: validationErrors });
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: { nome: nome ? nome.trim() : 'Estudante' },
        },
      });

      if (error) return res.status(400).json({ error: error.message });
      if (!data.user) {
        return res.status(400).json({ error: 'Não foi possível criar a conta.' });
      }

      return res.status(201).json({
        message: 'Conta criada com sucesso!',
        usuario: { id: data.user.id, email: data.user.email }
      });
    } catch (err) {
      console.error('[/register] Erro inesperado:', err);
      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  });

  // 2. ROTA DE LOGIN
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const validationErrors = validateLoginInput({ email, password });
    
    if (validationErrors.length > 0) {
      return res.status(422).json({ error: 'Dados inválidos.', detalhes: validationErrors });
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) return res.status(401).json({ error: authError.message });
      if (!authData.session) {
        return res.status(403).json({ error: 'E-mail ainda não confirmado.' });
      }

      const { user, session } = authData;
      const { createClient } = require('@supabase/supabase-js');
      
      const authedClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
        global: { headers: { Authorization: `Bearer ${session.access_token}` } },
      });

      const { data: alunoData, error: alunoError } = await authedClient
        .from('alunos')
        .select('id, nome, capicoins, fase_atual, created_at')
        .eq('id', user.id)
        .single();

      if (alunoError) {
        return res.status(404).json({ error: 'Perfil do aluno não encontrado.' });
      }

      return res.status(200).json({
        message: 'Login realizado com sucesso!',
        token: session.access_token,
        refresh_token: session.refresh_token,
        expira_em: session.expires_at,
        aluno: alunoData,
      });
    } catch (err) {
      console.error('[/login] Erro inesperado:', err);
      return res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  });

  return router;
};