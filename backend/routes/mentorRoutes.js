/**
 * Mentor Routes — CapiMentor (Tutor de IA)
 * Rota protegida por JWT do Supabase. A chave da IA vive apenas no backend.
 */
const express = require('express');
const { chatComMentor } = require('../controllers/mentorController');

module.exports = (supabase) => {
  const router = express.Router();

  // ────────────────────────────────────────────────────────────────────────
  // Middleware: Verificar token JWT do Supabase (mesmo padrão das outras rotas)
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
        console.error('[verifyToken] falha:', error?.message ?? 'user null');
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
  // Rate limiting simples, por aluno e em memória.
  // ⚠️ Para produção com múltiplas instâncias (Render/Vercel), troque por
  //    Redis/Upstash. Aqui serve para conter abuso e estourar custo da IA.
  // ────────────────────────────────────────────────────────────────────────
  const JANELA_MS = 60 * 1000; // 1 minuto
  const MAX_POR_JANELA = 15; // 15 mensagens por minuto por aluno
  const balde = new Map(); // userId -> { count, reset }

  const rateLimit = (req, res, next) => {
    const agora = Date.now();
    const id = req.userId;
    const registro = balde.get(id);

    if (!registro || agora > registro.reset) {
      balde.set(id, { count: 1, reset: agora + JANELA_MS });
      return next();
    }

    if (registro.count >= MAX_POR_JANELA) {
      const espera = Math.ceil((registro.reset - agora) / 1000);
      return res.status(429).json({
        error: `Calma aí! Você fez muitas perguntas seguidas. Tente de novo em ${espera}s.`,
      });
    }

    registro.count += 1;
    next();
  };

  // ────────────────────────────────────────────────────────────────────────
  // POST /api/mentor/chat
  // Body: { mensagem: string, historico?: [{ role, content }] }
  // ────────────────────────────────────────────────────────────────────────
  router.post('/chat', verifyToken, rateLimit, async (req, res) => {
    await chatComMentor(req, res, supabase);
  });

  return router;
};
