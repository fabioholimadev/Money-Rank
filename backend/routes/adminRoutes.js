const express = require('express');

module.exports = (supabase) => {
  const router = express.Router();

  // GET /api/admin/students
  // Retorna apenas usuários que NÃO são administradores
  router.get('/students', async (req, res) => {
    try {
      const { data: alunos, error } = await supabase
        .from('alunos')
        .select('id, nome, capicoins, fase_atual, streak_atual')
        // Incluir registros onde is_admin = false OU is_admin IS NULL (migrações/valores antigos)
        .or('is_admin.eq.false,is_admin.is.null')
        .order('capicoins', { ascending: false });

      // DEBUG: informar quantos alunos foram retornados
      console.log('[adminRoutes] alunos retornados:', Array.isArray(alunos) ? alunos.length : 0);

      if (error) {
        console.error('Erro ao buscar alunos para admin:', error);
        return res.status(500).json({ error: 'Erro ao buscar alunos.' });
      }

      return res.status(200).json({ students: alunos });
    } catch (err) {
      console.error('[/api/admin/students] Erro inesperado:', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  });

  return router;
};
