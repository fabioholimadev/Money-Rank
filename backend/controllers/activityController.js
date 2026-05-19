/**
 * Activity Controller
 * Responsável pela lógica de gamificação: recompensas, decisões e missões práticas
 */

// ────────────────────────────────────────────────────────────────────────
// 1. PROCESSADOR DE ATIVIDADES GERAIS
// ────────────────────────────────────────────────────────────────────────
const completeActivity = async (req, res, supabase) => {
  try {
    const { id_atividade, id_aluno, recompensa } = req.body;

    // Validação básica
    if (!id_atividade || !id_aluno || recompensa === undefined) {
      return res.status(400).json({
        error: 'Campos obrigatórios faltando: id_atividade, id_aluno, recompensa',
      });
    }

    // 1a. Verificar se a atividade já foi concluída
    const { data: historico, error: historicoError } = await supabase
      .from('historico_atividades')
      .select('id')
      .eq('id_aluno', id_aluno)
      .eq('id_atividade', id_atividade)
      .single();

    if (historico) {
      return res.status(400).json({
        error: 'Atividade já foi concluída por este aluno.',
      });
    }

    // 1b. Inserir novo registro no histórico
    const { error: insertError } = await supabase
      .from('historico_atividades')
      .insert([
        {
          id_aluno,
          id_atividade,
          data_conclusao: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      console.error('Erro ao inserir histórico:', insertError);
      return res.status(500).json({ error: 'Erro ao registrar conclusão da atividade.' });
    }

    // 1c. Buscar dados atuais do aluno
    const { data: aluno, error: alunoError } = await supabase
      .from('alunos')
      .select('id, capicoins, id_equipe')
      .eq('id', id_aluno)
      .single();

    if (alunoError || !aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado.' });
    }

    // 1d. Atualizar saldo de CapiCoins do aluno
    const novoCapicoins = (aluno.capicoins || 0) + recompensa;

    const { error: updateAlunoError } = await supabase
      .from('alunos')
      .update({ capicoins: novoCapicoins })
      .eq('id', id_aluno);

    if (updateAlunoError) {
      console.error('Erro ao atualizar aluno:', updateAlunoError);
      return res.status(500).json({ error: 'Erro ao atualizar saldo do aluno.' });
    }

    // 1e. Se o aluno tem equipe, atualizar também a equipe
    if (aluno.id_equipe) {
      const { data: equipe, error: equipeError } = await supabase
        .from('equipes')
        .select('capicoins_totais')
        .eq('id', aluno.id_equipe)
        .single();

      if (!equipeError && equipe) {
        const novasCapicoinsEquipe = (equipe.capicoins_totais || 0) + recompensa;

        await supabase
          .from('equipes')
          .update({ capicoins_totais: novasCapicoinsEquipe })
          .eq('id', aluno.id_equipe);
      }
    }

    return res.status(200).json({
      message: `Atividade concluída com sucesso! +${recompensa} CapiCoins 🪙`,
      aluno: {
        id: id_aluno,
        capicoins: novoCapicoins,
        recompensa,
      },
    });
  } catch (err) {
    console.error('[completeActivity] Erro inesperado:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ────────────────────────────────────────────────────────────────────────
// 2. MECANISMO DE DECISÃO E "ROLETA VICIADA"
// ────────────────────────────────────────────────────────────────────────
const processDecision = async (req, res, supabase) => {
  try {
    const { id_aluno, trilha, escolha } = req.body;

    // Validação básica
    if (!id_aluno || !trilha || !escolha) {
      return res.status(400).json({
        error: 'Campos obrigatórios faltando: id_aluno, trilha, escolha',
      });
    }

    // 2a. Verificar quantas vezes o aluno já jogou na roleta (Trilha 3)
    if (trilha === 3) {
      const { data: historicoDecisoes, error: historicoError } = await supabase
        .from('historico_atividades')
        .select('id')
        .eq('id_aluno', id_aluno)
        .eq('id_atividade', 'roleta_trilha_3');

      const tentativas = historicoDecisoes ? historicoDecisoes.length : 0;

      // Buscar aluno
      const { data: aluno, error: alunoError } = await supabase
        .from('alunos')
        .select('id, capicoins, id_equipe')
        .eq('id', id_aluno)
        .single();

      if (alunoError || !aluno) {
        return res.status(404).json({ error: 'Aluno não encontrado.' });
      }

      let resultado, recompensa, mensagem;

      // 2b. 1ª aposta: Vitória com +100 CapiCoins
      if (tentativas === 0) {
        recompensa = 100;
        resultado = true;
        mensagem = 'Iniciante com sorte! +100 CapiCoins 🍀';

        const novoCapicoins = (aluno.capicoins || 0) + recompensa;

        // Atualizar aluno
        await supabase
          .from('alunos')
          .update({ capicoins: novoCapicoins })
          .eq('id', id_aluno);

        // Atualizar equipe se existir
        if (aluno.id_equipe) {
          const { data: equipe } = await supabase
            .from('equipes')
            .select('capicoins_totais')
            .eq('id', aluno.id_equipe)
            .single();

          if (equipe) {
            const novasCapicoinsEquipe = (equipe.capicoins_totais || 0) + recompensa;
            await supabase
              .from('equipes')
              .update({ capicoins_totais: novasCapicoinsEquipe })
              .eq('id', aluno.id_equipe);
          }
        }

        // Registrar no histórico
        await supabase.from('historico_atividades').insert([
          {
            id_aluno,
            id_atividade: 'roleta_trilha_3',
            data_conclusao: new Date().toISOString(),
            resultado_decisao: 'vitoria',
          },
        ]);

        return res.status(200).json({
          ganhou: true,
          recompensa,
          mensagem,
          capicoins_atuais: novoCapicoins,
        });
      }

      // 2c. 2ª tentativa ou posterior: Derrota com -150 CapiCoins (drenagem)
      else {
        const perda = 150;
        resultado = false;
        mensagem = 'A banca sempre vence. Aposta não é investimento! -150 CapiCoins 💸';

        const novoCapicoins = Math.max(0, (aluno.capicoins || 0) - perda);

        // Atualizar aluno
        await supabase
          .from('alunos')
          .update({ capicoins: novoCapicoins })
          .eq('id', id_aluno);

        // Atualizar equipe se existir
        if (aluno.id_equipe) {
          const { data: equipe } = await supabase
            .from('equipes')
            .select('capicoins_totais')
            .eq('id', aluno.id_equipe)
            .single();

          if (equipe) {
            const novasCapicoinsEquipe = Math.max(0, (equipe.capicoins_totais || 0) - perda);
            await supabase
              .from('equipes')
              .update({ capicoins_totais: novasCapicoinsEquipe })
              .eq('id', aluno.id_equipe);
          }
        }

        // Registrar no histórico
        await supabase.from('historico_atividades').insert([
          {
            id_aluno,
            id_atividade: 'roleta_trilha_3',
            data_conclusao: new Date().toISOString(),
            resultado_decisao: 'derrota',
          },
        ]);

        return res.status(200).json({
          ganhou: false,
          perda,
          mensagem,
          capicoins_atuais: novoCapicoins,
        });
      }
    }

    // Se não é a trilha 3, retornar erro
    return res.status(400).json({
      error: 'Decisão só está disponível na Trilha 3 (Roleta).',
    });
  } catch (err) {
    console.error('[processDecision] Erro inesperado:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

// ────────────────────────────────────────────────────────────────────────
// 3. VALIDADOR DA MISSÃO PRÁTICA (NOTA FISCAL)
// ────────────────────────────────────────────────────────────────────────
const completeMissaoNotaFiscal = async (req, res, supabase) => {
  try {
    const { id_aluno, chave_acesso_nota, valor_imposto } = req.body;

    // 3a. Validação básica
    if (!id_aluno || !chave_acesso_nota || valor_imposto === undefined) {
      return res.status(400).json({
        error: 'Campos obrigatórios faltando: id_aluno, chave_acesso_nota, valor_imposto',
      });
    }

    if (chave_acesso_nota.trim() === '' || valor_imposto < 0) {
      return res.status(400).json({
        error: 'Chave de acesso e valor de imposto inválidos.',
      });
    }

    // Buscar aluno
    const { data: aluno, error: alunoError } = await supabase
      .from('alunos')
      .select('id, capicoins, id_equipe')
      .eq('id', id_aluno)
      .single();

    if (alunoError || !aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado.' });
    }

    // 3b. Bonificar com +200 CapiCoins
    const recompensa = 200;
    const novoCapicoins = (aluno.capicoins || 0) + recompensa;

    // Atualizar aluno
    const { error: updateAlunoError } = await supabase
      .from('alunos')
      .update({ capicoins: novoCapicoins })
      .eq('id', id_aluno);

    if (updateAlunoError) {
      console.error('Erro ao atualizar aluno:', updateAlunoError);
      return res.status(500).json({ error: 'Erro ao atualizar saldo do aluno.' });
    }

    // Atualizar equipe se existir
    if (aluno.id_equipe) {
      const { data: equipe } = await supabase
        .from('equipes')
        .select('capicoins_totais')
        .eq('id', aluno.id_equipe)
        .single();

      if (equipe) {
        const novasCapicoinsEquipe = (equipe.capicoins_totais || 0) + recompensa;
        await supabase
          .from('equipes')
          .update({ capicoins_totais: novasCapicoinsEquipe })
          .eq('id', aluno.id_equipe);
      }
    }

    // Registrar no histórico
    await supabase.from('historico_atividades').insert([
      {
        id_aluno,
        id_atividade: 'missao_nota_fiscal',
        data_conclusao: new Date().toISOString(),
        detalhes: {
          chave_acesso_nota,
          valor_imposto,
        },
      },
    ]);

    // 3c. Retornar sucesso
    return res.status(200).json({
      message: 'Pesquisa de campo validada! +200 CapiCoins 📋',
      aluno: {
        id: id_aluno,
        capicoins: novoCapicoins,
        recompensa,
      },
    });
  } catch (err) {
    console.error('[completeMissaoNotaFiscal] Erro inesperado:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = {
  completeActivity,
  processDecision,
  completeMissaoNotaFiscal,
};
