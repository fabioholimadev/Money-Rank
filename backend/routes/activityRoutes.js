/**
 * Activity Routes
 * Rotas para gamificação: completar atividades, processar decisões e validar missões práticas
 */
const express = require('express');
const {
  completeActivity,
  processDecision,
  completeMissaoNotaFiscal,
} = require('../controllers/activityController');

module.exports = (supabase) => {
  const router = express.Router();

  // ────────────────────────────────────────────────────────────────────────
  // Middleware: Verificar token JWT do Supabase (opcional para essas rotas)
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
  // ROTA A: POST /api/activities/complete
  // Processador de Atividades Gerais
  // Payload: { id_atividade, id_aluno, recompensa }
  // ────────────────────────────────────────────────────────────────────────
  router.post('/complete', async (req, res) => {
    await completeActivity(req, res, supabase);
  });

  // ────────────────────────────────────────────────────────────────────────
  // ROTA B: POST /api/activities/decision
  // Mecanismo de Decisão e "Roleta Viciada" (Trilha 3)
  // Payload: { id_aluno, trilha, escolha }
  // ────────────────────────────────────────────────────────────────────────
  router.post('/decision', async (req, res) => {
    await processDecision(req, res, supabase);
  });

  // ────────────────────────────────────────────────────────────────────────
  // ROTA C: POST /api/mission/nota-fiscal
  // Validador da Missão Prática (Nota Fiscal)
  // Payload: { id_aluno, chave_acesso_nota, valor_imposto }
  // ────────────────────────────────────────────────────────────────────────
  router.post('/nota-fiscal', async (req, res) => {
    await completeMissaoNotaFiscal(req, res, supabase);
  });

  return router;
};
