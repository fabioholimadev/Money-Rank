/**
 * Activity Controller
 * Responsável pela lógica de gamificação: recompensas, decisões e missões práticas
 */

// ────────────────────────────────────────────────────────────────────────
// 1. PROCESSADOR DE ATIVIDADES GERAIS
// ────────────────────────────────────────────────────────────────────────
const completeActivity = async (req, res, supabase) => {
  try {
    const { id_atividade, id_aluno, tipo } = req.body;
    const recompensa = Number(req.body.recompensa);
    const agora = new Date();
    const timestampAgora = agora.toISOString();

    // Validação básica
    if (!id_atividade || !id_aluno || Number.isNaN(recompensa) || !tipo) {
      return res.status(400).json({
        error: 'Campos obrigatórios faltando: id_atividade, id_aluno, recompensa, tipo',
      });
    }

    if (!['conteudo', 'atividade'].includes(tipo)) {
      return res.status(400).json({
        error: "Tipo inválido. Deve ser 'conteudo' ou 'atividade'.",
      });
    }

    // 1a. Verificar se a atividade já foi registrada no histórico
    const { data: existente, error: existenteError } = await supabase
      .from('historico_atividades')
      .select('vezes_concluida')
      .eq('id_aluno', id_aluno)
      .eq('id_atividade', id_atividade)
      .maybeSingle();

    if (existenteError) {
      console.error('Erro ao verificar histórico:', existenteError);
      return res.status(500).json({ error: 'Erro ao verificar histórico da atividade.' });
    }

    if (!existente) {
      const { error: insertError } = await supabase
        .from('historico_atividades')
        .insert([
          {
            id_aluno,
            id_atividade,
            vezes_concluida: 1,
            ultima_conclusao: timestampAgora,
          },
        ]);

      if (insertError) {
        console.error('Erro ao inserir histórico:', insertError);
        return res.status(500).json({ error: 'Erro ao registrar conclusão da atividade.' });
      }
    } else {
      const { error: updateHistoricoError } = await supabase
        .from('historico_atividades')
        .update({
          vezes_concluida: (existente.vezes_concluida || 0) + 1,
          ultima_conclusao: timestampAgora,
        })
        .match({ id_aluno, id_atividade });

      if (updateHistoricoError) {
        console.error('Erro ao atualizar histórico:', updateHistoricoError);
        return res.status(500).json({ error: 'Erro ao atualizar o histórico da atividade.' });
      }
    }

    // 1c. Buscar dados atuais do aluno, streak e última atividade
    const { data: aluno, error: alunoError } = await supabase
      .from('alunos')
      .select('id, capicoins, id_equipe, streak_atual, ultima_atividade')
      .eq('id', id_aluno)
      .single();

    if (alunoError || !aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado.' });
    }

    // Normalizar datas para comparar apenas dias (meia-noite local)
    const dataUltimaAtividade = aluno.ultima_atividade ? new Date(aluno.ultima_atividade) : null;

    let novoStreak = 1;

    if (!dataUltimaAtividade) {
      // Nunca fez antes
      novoStreak = 1;
    } else {
      const hoje = new Date(agora);
      hoje.setHours(0, 0, 0, 0);

      const ultima = new Date(dataUltimaAtividade);
      ultima.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(hoje - ultima);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const baseStreak = Number(aluno.streak_atual) || 0;

      // Regras com tolerância de 1 dia (diffDays === 2 perdoado)
      if (diffDays === 0) {
        // Já contou hoje: mantém
        novoStreak = baseStreak || 1;
      } else if (diffDays === 1 || diffDays === 2) {
        // Ontem ou anteontem (tolerância): incrementa
        novoStreak = baseStreak + 1;
      } else {
        // Muito tempo sem fazer: reset
        novoStreak = 1;
      }
    }

    // 1d. Recompensa de farming
    let recompensaFarming = 0;

    if (!existente) {
      recompensaFarming = recompensa;
    } else {
      recompensaFarming = tipo === 'conteudo' ? 0 : Math.round(recompensa * 0.3);
    }

    const recompensaFinal = Math.round(recompensaFarming * (1 + novoStreak * 0.05));
    const novoCapicoins = (aluno.capicoins || 0) + recompensaFinal;

    const { error: updateAlunoError } = await supabase
      .from('alunos')
      .update({
        capicoins: novoCapicoins,
        streak_atual: novoStreak,
        ultima_atividade: timestampAgora,
      })
      .eq('id', id_aluno);

    if (updateAlunoError) {
      console.error('Erro ao atualizar aluno:', updateAlunoError);
      return res.status(500).json({ error: 'Erro ao atualizar saldo do aluno.' });
    }

    // 1e. Se o aluno tem equipe, atualizar também a equipe com a recompensa final
    if (aluno.id_equipe) {
      const { data: equipe, error: equipeError } = await supabase
        .from('equipes')
        .select('capicoins_totais')
        .eq('id', aluno.id_equipe)
        .single();

      if (!equipeError && equipe) {
        const novasCapicoinsEquipe = (equipe.capicoins_totais || 0) + recompensaFinal;

        await supabase
          .from('equipes')
          .update({ capicoins_totais: novasCapicoinsEquipe })
          .eq('id', aluno.id_equipe);
      }
    }

    return res.status(200).json({
      message: `Atividade concluída com sucesso! +${recompensaFinal} CapiCoins 🪙`,
      reward: recompensaFinal,
      capicoins_atuais: novoCapicoins,
      streak_atual: novoStreak,
      aluno: {
        id: id_aluno,
        capicoins: novoCapicoins,
        recompensa: recompensaFinal,
        streak_atual: novoStreak,
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
        .select('vezes_concluida')
        .eq('id_aluno', id_aluno)
        .eq('id_atividade', 'roleta_trilha_3')
        .maybeSingle();

      if (historicoError) {
        console.error('Erro ao verificar histórico da roleta:', historicoError);
        return res.status(500).json({ error: 'Erro ao verificar histórico da roleta.' });
      }

      const tentativas = historicoDecisoes ? historicoDecisoes.vezes_concluida || 0 : 0;

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
        if (!historicoDecisoes) {
          const { error: insertHistoricoError } = await supabase
            .from('historico_atividades')
            .insert([
              {
                id_aluno,
                id_atividade: 'roleta_trilha_3',
                vezes_concluida: 1,
              },
            ]);

          if (insertHistoricoError) {
            console.error('Erro ao inserir histórico da roleta:', insertHistoricoError);
            return res.status(500).json({ error: 'Erro ao registrar histórico da roleta.' });
          }
        } else {
          const { error: updateHistoricoError } = await supabase
            .from('historico_atividades')
            .update({
              vezes_concluida: (historicoDecisoes.vezes_concluida || 0) + 1,
              ultima_conclusao: new Date().toISOString(),
            })
            .match({ id_aluno, id_atividade: 'roleta_trilha_3' });

          if (updateHistoricoError) {
            console.error('Erro ao atualizar histórico da roleta:', updateHistoricoError);
            return res.status(500).json({ error: 'Erro ao atualizar histórico da roleta.' });
          }
        }

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
        if (!historicoDecisoes) {
          const { error: insertHistoricoError } = await supabase
            .from('historico_atividades')
            .insert([
              {
                id_aluno,
                id_atividade: 'roleta_trilha_3',
                vezes_concluida: 1,
              },
            ]);

          if (insertHistoricoError) {
            console.error('Erro ao inserir histórico da roleta:', insertHistoricoError);
            return res.status(500).json({ error: 'Erro ao registrar histórico da roleta.' });
          }
        } else {
          const { error: updateHistoricoError } = await supabase
            .from('historico_atividades')
            .update({
              vezes_concluida: (historicoDecisoes.vezes_concluida || 0) + 1,
              ultima_conclusao: new Date().toISOString(),
            })
            .match({ id_aluno, id_atividade: 'roleta_trilha_3' });

          if (updateHistoricoError) {
            console.error('Erro ao atualizar histórico da roleta:', updateHistoricoError);
            return res.status(500).json({ error: 'Erro ao atualizar histórico da roleta.' });
          }
        }

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

    const { data: historicoMissao, error: historicoMissaoError } = await supabase
      .from('historico_atividades')
      .select('vezes_concluida')
      .eq('id_aluno', id_aluno)
      .eq('id_atividade', 'missao_nota_fiscal')
      .maybeSingle();

    if (historicoMissaoError) {
      console.error('Erro ao verificar histórico da missão:', historicoMissaoError);
      return res.status(500).json({ error: 'Erro ao verificar histórico da missão.' });
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
    if (!historicoMissao) {
      const { error: insertHistoricoError } = await supabase
        .from('historico_atividades')
        .insert([
          {
            id_aluno,
            id_atividade: 'missao_nota_fiscal',
            vezes_concluida: 1,
          },
        ]);

      if (insertHistoricoError) {
        console.error('Erro ao inserir histórico da missão:', insertHistoricoError);
        return res.status(500).json({ error: 'Erro ao registrar histórico da missão.' });
      }
    } else {
      const { error: updateHistoricoError } = await supabase
        .from('historico_atividades')
        .update({
          vezes_concluida: (historicoMissao.vezes_concluida || 0) + 1,
          ultima_conclusao: new Date().toISOString(),
        })
        .match({ id_aluno, id_atividade: 'missao_nota_fiscal' });

      if (updateHistoricoError) {
        console.error('Erro ao atualizar histórico da missão:', updateHistoricoError);
        return res.status(500).json({ error: 'Erro ao atualizar histórico da missão.' });
      }
    }

    // 3c. Retornar sucesso
    return res.status(200).json({
      message: 'Pesquisa de campo validada! +200 CapiCoins 📋',
      reward: recompensa,
      capicoins_atuais: novoCapicoins,
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
