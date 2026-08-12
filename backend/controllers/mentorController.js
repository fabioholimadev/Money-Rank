/**
 * Mentor Controller — CapiMentor
 * Constrói o contexto pedagógico, conversa com o provedor de IA e devolve
 * apenas o texto da resposta. A chave da IA NUNCA sai daqui.
 *
 * Variáveis de ambiente esperadas (backend/.env):
 *   MENTOR_PROVIDER   = "gemini" | "anthropic"   (padrão: gemini)
 *   GEMINI_API_KEY    = ...                        (se gemini)
 *   GEMINI_MODEL      = gemini-3.6-flash           (opcional)
 *   ANTHROPIC_API_KEY = ...                        (se anthropic)
 *   ANTHROPIC_MODEL   = claude-3-5-haiku-20241022  (opcional)
 */

const LIMITE_MENSAGEM = 1000; // caracteres por mensagem do aluno
const MAX_HISTORICO = 10; // pares recentes considerados
const TIMEOUT_MS = 25000;

// ── Persona + Guardrails do CapiMentor ─────────────────────────────────────
function montarSystemPrompt(aluno) {
  const nome = aluno?.nome || 'estudante';
  const fase = aluno?.fase_atual ?? 1;

  return [
    'Você é o CapiMentor, um tutor de educação financeira e fiscal do app Money Rank.',
    'Sua mascote é uma capivara simpática e esperta. O público são estudantes do Ensino Médio no Brasil.',
    '',
    'COMO RESPONDER:',
    '- Sempre em português do Brasil, num tom amigável, jovem e encorajador (sem ser infantil).',
    '- Seja CONCISO: 2 a 5 frases na maioria dos casos. Use exemplos do dia a dia (refrigerante, lanche, celular).',
    '- Pode usar 1 ou 2 emojis quando ajudar, sem exagero.',
    '- Se a pergunta for complexa, explique passo a passo de forma simples.',
    '',
    'SOBRE O QUE FALAR:',
    '- Educação financeira: orçamento, poupança, juros, consumo consciente, planejamento.',
    '- Educação fiscal: impostos sobre consumo (ICMS, IBS, CBS), nota fiscal, como o tributo financia SUS e educação, ilusão fiscal.',
    '- Temas do app: trilhas, missões, CapiCoins, streak.',
    '',
    'LIMITES IMPORTANTES:',
    '- NÃO dê recomendações de investimento específicas, não indique ações, cripto ou casas de aposta.',
    '- Reforce sempre que aposta/jogo de azar NÃO é investimento — a banca sempre vence no longo prazo.',
    '- Se perguntarem algo totalmente fora de finanças/educação fiscal, redirecione com gentileza para o seu tema.',
    '- Nunca peça dados sensíveis (senha, cartão, CPF). Não invente números ou leis; se não souber, admita.',
    '',
    `CONTEXTO DO ALUNO: o nome dele(a) é ${nome} e está na fase ${fase} da trilha. Use o nome com naturalidade quando fizer sentido.`,
  ].join('\n');
}

// ── Sanitiza o histórico vindo do frontend (não confiar cegamente) ─────────
function sanitizarHistorico(historico) {
  if (!Array.isArray(historico)) return [];
  return historico
    .filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    )
    .slice(-MAX_HISTORICO)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, LIMITE_MENSAGEM),
    }));
}

// ── Provedor: Google Gemini (REST, sem dependência extra — usa fetch nativo) ─
async function chamarGemini(systemPrompt, mensagens) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('CONFIG: GEMINI_API_KEY ausente no backend.');

  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const contents = mensagens.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: { maxOutputTokens: 600 },
  };

  const opcoesFetch = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey, // Injetado via cabeçalho para evitar o bug do novo prefixo AQ.
    },
    body: JSON.stringify(body),
  };

  // ── Auto-Retry: até 2 tentativas para absorver picos de demanda (503) ─────
  const MAX_TENTATIVAS = 2;
  const ESPERA_MS = 2000;
  let resp;

  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    resp = await fetchComTimeout(url, opcoesFetch);

    if (resp.ok) break; // Sucesso — sai do loop imediatamente

    const txt = await resp.text().catch(() => '');
    console.error(`[Gemini] erro tentativa ${tentativa}/${MAX_TENTATIVAS}`, resp.status, txt);

    const ehSobrecarga = resp.status === 503 || txt.includes('high demand') || txt.includes('overloaded');

    if (tentativa < MAX_TENTATIVAS && ehSobrecarga) {
      console.warn(`[Gemini] 503 detectado — aguardando ${ESPERA_MS}ms antes de nova tentativa...`);
      await new Promise((resolve) => setTimeout(resolve, ESPERA_MS));
      continue;
    }

    // Falhou na última tentativa ou erro não-503: lança com mensagem adequada
    if (ehSobrecarga) {
      throw new Error(
        'A Capivara está muito requisitada neste momento! Os servidores estão um pouco cheios. Podes tentar perguntar de novo em alguns segundos?'
      );
    }
    throw new Error('Falha ao falar com o provedor de IA.');
  }

  const data = await resp.json();
  const texto =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  return texto.trim();
}

// ── Provedor: Anthropic / Claude (swap simples) ────────────────────────────
async function chamarAnthropic(systemPrompt, mensagens) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('CONFIG: ANTHROPIC_API_KEY ausente no backend.');

  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-haiku-20241022';

  const resp = await fetchComTimeout('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 600,
      temperature: 0.6,
      system: systemPrompt,
      messages: mensagens.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!resp.ok) {
    const txt = await resp.text().catch(() => '');
    console.error('[Anthropic] erro', resp.status, txt);
    throw new Error('Falha ao falar com o provedor de IA.');
  }

  const data = await resp.json();
  const texto =
    data?.content?.map((b) => (b.type === 'text' ? b.text : '')).join('') || '';
  return texto.trim();
}

// ── fetch com timeout (evita request preso segurando a conexão) ────────────
async function fetchComTimeout(url, options) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

// ── Handler principal ──────────────────────────────────────────────────────
const chatComMentor = async (req, res, supabase) => {
  try {
    const { mensagem, historico } = req.body || {};

    // Validação de entrada
    if (!mensagem || typeof mensagem !== 'string' || !mensagem.trim()) {
      return res.status(400).json({ error: 'Mensagem vazia ou inválida.' });
    }
    if (mensagem.length > LIMITE_MENSAGEM) {
      return res.status(413).json({
        error: `Mensagem muito longa (máx. ${LIMITE_MENSAGEM} caracteres).`,
      });
    }

    // Contexto do aluno (req.userId vem do verifyToken). Não-fatal se falhar.
    let aluno = null;
    try {
      const { data } = await supabase
        .from('alunos')
        .select('nome, fase_atual, capicoins')
        .eq('id', req.userId)
        .single();
      aluno = data;
    } catch (_) {
      /* segue sem personalização */
    }

    const systemPrompt = montarSystemPrompt(aluno);
    const conversa = [
      ...sanitizarHistorico(historico),
      { role: 'user', content: mensagem.trim().slice(0, LIMITE_MENSAGEM) },
    ];

    const provider = (process.env.MENTOR_PROVIDER || 'gemini').toLowerCase();
    const resposta =
      provider === 'anthropic'
        ? await chamarAnthropic(systemPrompt, conversa)
        : await chamarGemini(systemPrompt, conversa);

    if (!resposta) {
      return res.status(502).json({
        error: 'O mentor não retornou resposta. Tente reformular a pergunta.',
      });
    }

    return res.status(200).json({ resposta });
  } catch (err) {
    // Erros de configuração não devem vazar detalhes ao aluno
    if (String(err.message).startsWith('CONFIG:')) {
      console.error('[mentor] configuração:', err.message);
      return res
        .status(503)
        .json({ error: 'O CapiMentor está indisponível no momento.' });
    }
    if (err.name === 'AbortError') {
      return res
        .status(504)
        .json({ error: 'O mentor demorou demais pra responder. Tenta de novo?' });
    }
    console.error('[chatComMentor] erro inesperado:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

module.exports = { chatComMentor };
