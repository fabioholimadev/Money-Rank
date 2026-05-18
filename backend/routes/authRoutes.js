const express = require('express');
const router = express.Router();

module.exports = (supabase) => {

  // 1. ROTA DE CADASTRO (SIGN UP)
  router.post('/cadastro', async (req, res) => {
    const { email, password, nome } = req.body;

    try {
      // Agora mandamos o 'nome' empacotado dentro do 'options.data'. 
      // O Gatilho do Supabase vai ler isso lá no banco!
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { nome: nome || 'Estudante' } 
        }
      });
      
      if (error) return res.status(400).json({ error: error.message });

      // Removemos o "insert" manual que tinha aqui. O banco de dados cuida do resto!
      res.status(201).json({ message: 'Conta criada com sucesso!', user: data.user });
    } catch (err) {
      res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  });

  // 2. ROTA DE LOGIN (SIGN IN)
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return res.status(400).json({ error: error.message });

      const { data: alunoData, error: alunoError } = await supabase
        .from('alunos').select('*').eq('id', data.user.id).single();
        
      if (alunoError) return res.status(400).json({ error: alunoError.message });

      res.status(200).json({ 
        message: 'Login realizado com sucesso!', 
        token: data.session.access_token,
        aluno: alunoData 
      });
    } catch (err) {
      res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  });

  return router;
};