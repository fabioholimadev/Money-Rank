const express = require('express');
const router = express.Router();

// Esta função recebe o "controle remoto" do Supabase que criamos no server.js
module.exports = (supabase) => {

  // ROTA DE CADASTRO (SIGN UP)
  router.post('/cadastro', async (req, res) => {
    const { email, password, nome } = req.body;

    try {
      // Cria o usuário no sistema de autenticação seguro do Supabase
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return res.status(400).json({ error: error.message });

      // Se o usuário foi criado, adicionamos ele na nossa tabela de 'alunos'
      if (data?.user) {
        const { error: dbError } = await supabase.from('alunos').insert([
          { 
            id: data.user.id, // Vincula com o ID secreto de autenticação
            nome: nome || 'Estudante',
            moedas: 150, // Bônus inicial de moedas da Money Rank!
            fase_atual: 1 
          }
        ]);
        if (dbError) return res.status(400).json({ error: dbError.message });
      }

      res.status(201).json({ message: 'Conta criada com sucesso!', user: data.user });
    } catch (err) {
      res.status(500).json({ error: 'Erro interno no servidor.' });
    }
  });

  // ROTA DE LOGIN (SIGN IN)
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      // Verifica as credenciais no Supabase
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return res.status(400).json({ error: error.message });

      // Busca os dados de moedas e fase do aluno
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