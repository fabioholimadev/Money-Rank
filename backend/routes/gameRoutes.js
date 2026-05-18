const express = require('express');

module.exports = (supabase) => {
  const router = express.Router();

  // ────────────────────────────────────────────────────────────────────────
  // Middleware: Verificar token JWT do Supabase
  // ────────────────────────────────────────────────────────────────────────
  const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(403).json({ error: 'Token inválido ou expirado.' });
      }

      req.userId = user.id;
      next();
    } catch (err) {
      console.error('Erro ao verificar token:', err);
      return res.status(403).json({ error: 'Token inválido.' });
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // POST /api/game/complete-phase
  // Protegida: O aluno completa uma fase e recebe +100 CapiCoins
  // Atualiza: capicoins, fase_atual, streak_atual, ultima_atividade
  // ────────────────────────────────────────────────────────────────────────
  router.post('/complete-phase', verifyToken, async (req, res) => {
    try {
      const userId = req.userId;

      // 1. Buscar dados atuais do aluno
      const { data: aluno, error: fetchError } = await supabase
        .from('alunos')
        .select('id, nome, capicoins, fase_atual, streak_atual, ultima_atividade')
        .eq('id', userId)
        .single();

      if (fetchError || !aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado.' });
      }

      // 2. Calcular novo streak com comparação de datas de calendário
      const agora = new Date();
      const ultimaAtividadeDate = aluno.ultima_atividade
        ? new Date(aluno.ultima_atividade)
        : null;

      const hoje = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), agora.getUTCDate()));
      let novoStreak = aluno.streak_atual ?? 0;

      if (!ultimaAtividadeDate) {
        novoStreak = 1;
      } else {
        const ontem = new Date(hoje);
        ontem.setUTCDate(hoje.getUTCDate() - 1);

        const ultimaAtividadeUTC = new Date(
          Date.UTC(
            ultimaAtividadeDate.getUTCFullYear(),
            ultimaAtividadeDate.getUTCMonth(),
            ultimaAtividadeDate.getUTCDate()
          )
        );

        if (ultimaAtividadeUTC.getTime() === hoje.getTime()) {
          novoStreak = aluno.streak_atual ?? 0;
        } else if (ultimaAtividadeUTC.getTime() === ontem.getTime()) {
          novoStreak = (aluno.streak_atual ?? 0) + 1;
        } else {
          novoStreak = 1;
        }
      }

      // 3. Calcular novos valores
      const novoCapicoins = (aluno.capicoins || 0) + 100;
      const novaFase = (aluno.fase_atual || 1) + 1;
      const novaUltimaAtividade = agora.toISOString();

      // 4. Atualizar na base de dados
      const { data: alunoAtualizado, error: updateError } = await supabase
        .from('alunos')
        .update({
          capicoins: novoCapicoins,
          fase_atual: novaFase,
          streak_atual: novoStreak,
          ultima_atividade: novaUltimaAtividade,
        })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Erro ao atualizar aluno:', updateError);
        return res.status(500).json({ error: 'Erro ao atualizar dados do aluno.' });
      }

      // 5. Retornar dados atualizados
      return res.status(200).json({
        message: 'Fase concluída com sucesso! +100 CapiCoins 🪙',
        aluno: {
          id: alunoAtualizado.id,
          nome: alunoAtualizado.nome,
          capicoins: alunoAtualizado.capicoins,
          fase_atual: alunoAtualizado.fase_atual,
          streak_atual: alunoAtualizado.streak_atual,
        },
      });
    } catch (err) {
      console.error('[/complete-phase] Erro inesperado:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  });

  // ────────────────────────────────────────────────────────────────────────
  // GET /api/game/leaderboard
  // Aberta: Retorna os Top 10 alunos ordenados por CapiCoins DESC
  // ────────────────────────────────────────────────────────────────────────
  router.get('/leaderboard', async (req, res) => {
    try {
      const { data: alunos, error } = await supabase
        .from('alunos')
        .select('id, nome, capicoins, fase_atual')
        .order('capicoins', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erro ao buscar leaderboard:', error);
        return res.status(500).json({ error: 'Erro ao buscar ranking.' });
      }

      // Adicionar posição (1º, 2º, 3º...)
      const leaderboard = alunos.map((aluno, index) => ({
        posicao: index + 1,
        ...aluno,
      }));

      return res.status(200).json({
        message: 'Leaderboard obtido com sucesso!',
        leaderboard,
      });
    } catch (err) {
      console.error('[/leaderboard] Erro inesperado:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  });

  return router;
};
