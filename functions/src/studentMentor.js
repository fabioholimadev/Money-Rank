import { GoogleGenAI } from '@google/genai';

const PHASE_TOPICS = Object.freeze({
  0: 'introdução à educação financeira, fiscal, cidadã e de saúde',
  1: 'açúcar, orçamento, saúde pública e tributação',
  2: 'gastos recorrentes, vícios e custo de oportunidade',
  3: 'consumo por impulso, pressão social e planejamento',
  4: 'publicidade de apostas, risco e proteção do orçamento',
});

const OUT_OF_SCOPE = [
  /\b(futebol|celebridade|fofoca|filme|série|namoro|receita culinária)\b/i,
  /\b(hack|senha|token|uid|e-?mail|sql|banco de dados|prompt interno)\b/i,
];
const ANSWER_REQUEST =
  /\b(gabarito|qual (é )?a (resposta|alternativa)|marco [abcd]|responda por mim)\b/i;

const OFFICIAL_SOURCES = Object.freeze({
  bets: [{ title: 'Ministério da Fazenda — Apostas de quota fixa', url: 'https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas' }],
  citizenship: [{ title: 'Constituição Federal — Câmara dos Deputados', url: 'https://www2.camara.leg.br/atividade-legislativa/legislacao/constituicao1988' }],
  consumer: [{ title: 'Consumidor.gov.br', url: 'https://www.consumidor.gov.br/' }],
  fiscal: [{ title: 'Receita Federal — Educação Fiscal', url: 'https://www.gov.br/receitafederal/pt-br/assuntos/educacao-fiscal' }],
  health: [{ title: 'Ministério da Saúde', url: 'https://www.gov.br/saude/pt-br' }],
  money: [{ title: 'Banco Central — Cidadania Financeira', url: 'https://www.bcb.gov.br/cidadaniafinanceira' }],
});

function cleanText(value, maximum = 500) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').slice(0, maximum);
}

export function normalizeMentorQuestion(value) {
  return cleanText(value, 500);
}

export function classifyMentorQuestion(question) {
  const normalized = normalizeMentorQuestion(question);
  if (!normalized || OUT_OF_SCOPE.some((pattern) => pattern.test(normalized))) {
    return 'OUT_OF_SCOPE';
  }
  if (ANSWER_REQUEST.test(normalized)) return 'ACTIVE_ANSWER';
  return 'MONEY_RANK_EDUCATION';
}

function fallbackAnswer(question) {
  if (/\b(aposta|bet|cassino)\b/i.test(question)) {
    return {
      answer: 'Aposta não é investimento. Um investimento procura preservar ou aumentar patrimônio dentro de uma estratégia, com análise de risco, prazo e objetivo. Na aposta, o resultado depende de um evento incerto e as regras são organizadas para sustentar a operação da plataforma, não para garantir ganho ao jogador.\n\nIsso também é uma questão de saúde e cidadania: publicidade, recompensa rápida e sensação de “quase ganhar” podem estimular novas tentativas. Antes de qualquer decisão, devem ser protegidos alimentação, transporte, contas, estudo e metas. Se uma aposta estiver causando perda de controle ou sofrimento, a atitude responsável é interromper e buscar ajuda de um adulto ou serviço de saúde.\n\nQuer que eu explique com um exemplo comparando aposta, poupança e investimento?',
      sources: OFFICIAL_SOURCES.bets,
    };
  }
  if (/\b(icms|imposto|tribut|taxa|educação fiscal)\b/i.test(question)) {
    return {
      answer: 'Tributos são valores arrecadados pelo poder público para financiar políticas e serviços coletivos. Eles se relacionam com cidadania porque a população não apenas paga: também pode acompanhar orçamento, exigir transparência e participar das decisões públicas. Educação fiscal significa compreender essa relação entre arrecadação, gasto público e controle social.\n\nO ICMS é um imposto estadual ligado à circulação de mercadorias e a determinados serviços. Em muitos produtos ele está incorporado ao preço, mas a forma de cálculo varia conforme mercadoria, estado e operação. Por isso, não é seguro aplicar uma porcentagem genérica sem conhecer o caso.\n\nQuer que eu mostre como investigar os tributos de um produto usando nota fiscal e fontes oficiais?',
      sources: OFFICIAL_SOURCES.fiscal,
    };
  }
  if (/\b(açúcar|refrigerante|doce|saúde|sus|doença)\b/i.test(question)) {
    return {
      answer: 'Saúde e finanças estão conectadas. Um produto barato consumido com frequência pode formar um gasto mensal relevante, enquanto hábitos de consumo também podem produzir impactos individuais, familiares e coletivos. A análise responsável evita culpar a pessoa e considera publicidade, acesso a alternativas, informação e condições de vida.\n\nNo orçamento, some o gasto ao longo de uma semana e de um mês e compare com uma meta. Na saúde, use orientações de órgãos oficiais e não transforme informação geral em diagnóstico: sintomas, tratamento e necessidades individuais devem ser discutidos com profissionais. Políticas públicas podem combinar informação, rotulagem, prevenção e incentivos econômicos.\n\nQuer que eu aprofunde a parte do orçamento, da saúde pública ou das políticas de prevenção?',
      sources: OFFICIAL_SOURCES.health,
    };
  }
  if (/\b(cidadania|direito|dever|democracia|participação|política pública)\b/i.test(question)) {
    return {
      answer: 'Cidadania é participar da vida coletiva com direitos, deveres e capacidade de acompanhar decisões públicas. Ela aparece quando uma pessoa usa serviços, respeita outras pessoas, busca informação, fiscaliza o uso de recursos e participa de espaços como escola, comunidade e canais públicos.\n\nDireitos não funcionam isolados: sua realização depende de políticas, orçamento, instituições e controle social. Por isso, educação cidadã se conecta à educação fiscal e financeira — entender de onde vêm os recursos e como são usados ajuda a avaliar prioridades e cobrar transparência.\n\nQuer que eu explique por meio de uma situação da escola, do bairro ou de um serviço público?',
      sources: OFFICIAL_SOURCES.citizenship,
    };
  }
  if (/\b(consumidor|propaganda|publicidade|compra|garantia)\b/i.test(question)) {
    return {
      answer: 'Consumir também é exercer cidadania. Antes de comprar, é importante comparar preço total, condições, necessidade real e confiabilidade da oferta. Publicidade pode informar, mas também usa urgência, influência social e recompensas para acelerar decisões.\n\nO consumidor deve guardar comprovantes, ler condições e procurar canais oficiais quando houver problema. Uma compra parcelada precisa ser analisada pelo valor final e pelo impacto das parcelas no orçamento, não apenas pelo valor mensal anunciado.\n\nQuer que eu ajude a analisar uma publicidade ou situação de compra específica?',
      sources: OFFICIAL_SOURCES.consumer,
    };
  }
  if (/\b(orçamento|economizar|guardar|meta|gasto)\b/i.test(question)) {
    return {
      answer: 'Um orçamento é uma ferramenta de decisão, não apenas uma lista de cortes. Comece registrando entradas, gastos necessários, gastos flexíveis e compromissos futuros. Depois transforme valores pequenos e recorrentes em totais mensais para enxergar o efeito real.\n\nDefina uma meta com valor e prazo, preserve necessidades básicas e escolha um ajuste possível de manter. Se o plano não funcionar, revise as hipóteses em vez de tratar isso como fracasso. Também vale observar pressões de consumo, assinaturas esquecidas e compras parceladas que comprometem meses seguintes.\n\nQuer que eu monte um exemplo passo a passo com valores fictícios?',
      sources: OFFICIAL_SOURCES.money,
    };
  }
  return {
    answer: 'Posso investigar sua dúvida pela ótica do Money Rank: educação financeira e fiscal, cidadania, saúde, consumo responsável, direitos, políticas públicas e impactos coletivos. Vou separar fatos, explicar as relações e indicar fontes quando a pesquisa online estiver disponível.\n\nPara eu aprofundar bem, diga qual situação você quer compreender, quem é afetado e qual decisão precisa ser analisada. Quer que eu ajude a reformular a pergunta?',
    sources: [...OFFICIAL_SOURCES.money, ...OFFICIAL_SOURCES.fiscal, ...OFFICIAL_SOURCES.health],
  };
}

function normalizeStudentContext(rawContext) {
  const profile = rawContext?.profile;
  if (!profile || profile.role !== 'STUDENT' || !profile.profileCompleted) return null;
  const currentPhase = Math.min(Math.max(Number(profile.currentPhase) || 0, 0), 4);
  const progress = Array.isArray(rawContext.progress) ? rawContext.progress : [];
  const difficultPhases = progress
    .filter((item) => Number(item.wrongAnswers) > Number(item.correctAnswers))
    .map((item) => Number(item.phaseNumber))
    .filter((phase) => phase >= 1 && phase <= 4)
    .slice(0, 2);
  return {
    currentTopic: PHASE_TOPICS[currentPhase],
    capiCoins: Math.max(Number(profile.capiCoins) || 0, 0),
    difficultTopics: difficultPhases.map((phase) => PHASE_TOPICS[phase]),
  };
}

function validateAiAnswer(value) {
  const answer = cleanText(value, 3500);
  if (answer.length < 180 || /\b(uid|e-?mail|token|prompt interno)\b/i.test(answer)) return null;
  return /quer que eu/i.test(answer)
    ? answer
    : `${answer}\n\nQuer que eu aprofunde algum ponto ou mostre um exemplo?`;
}

function extractGrounding(response) {
  const metadata = response?.candidates?.[0]?.groundingMetadata;
  const chunks = Array.isArray(metadata?.groundingChunks)
    ? metadata.groundingChunks
    : [];
  const sources = chunks.flatMap((chunk) => {
    const title = cleanText(chunk?.web?.title, 120);
    const url = cleanText(chunk?.web?.uri, 2048);
    return title && url.startsWith('https://') ? [{ title, url }] : [];
  }).filter((source, index, all) =>
    all.findIndex((item) => item.url === source.url) === index,
  ).slice(0, 5);
  return {
    sources,
    searchSuggestionsHtml:
      typeof metadata?.searchEntryPoint?.renderedContent === 'string'
        ? metadata.searchEntryPoint.renderedContent.slice(0, 20_000)
        : '',
  };
}

export function selectMentorResponse(response, fallback) {
  const answer = validateAiAnswer(response?.text);
  if (!answer) return null;
  const grounding = extractGrounding(response);
  return grounding.sources.length > 0
    ? { answer, ...grounding, generatedBy: 'gemini-grounded' }
    : {
      answer,
      sources: fallback.sources,
      searchSuggestionsHtml: '',
      generatedBy: 'gemini',
    };
}

function logMentorFallback(reason, error, model) {
  const details = { event: 'student_mentor_fallback', reason, model };
  if (error) {
    details.errorName = cleanText(error?.name || 'Error', 80);
    details.errorMessage = cleanText(error?.message || String(error), 500);
    details.errorStatus = Number(error?.status) || undefined;
  }
  console.warn(JSON.stringify(details));
}

export async function answerStudentMentor({ question, rawContext, apiKey, model }) {
  const normalizedQuestion = normalizeMentorQuestion(question);
  const classification = classifyMentorQuestion(normalizedQuestion);
  const context = normalizeStudentContext(rawContext);
  if (!context) return null;

  if (classification === 'OUT_OF_SCOPE') {
    return {
      answer: 'Eu cuido dos temas do Money Rank: educação financeira e fiscal, cidadania, saúde, consumo, direitos e políticas públicas relacionadas. Não acesso dados pessoais, sistemas ou assuntos sem relação com esse escopo.\n\nSe quiser, reformule a pergunta mostrando como o assunto afeta uma decisão, um direito, a saúde ou a vida coletiva.',
      sources: [],
      generatedBy: 'safe-fallback',
    };
  }
  if (classification === 'ACTIVE_ANSWER') {
    return {
      answer: 'Não posso entregar o gabarito de uma atividade em andamento. Posso explicar o conceito e ajudar você a comparar as alternativas com suas próprias palavras.\n\nQual parte da decisão está causando dúvida? Quer que eu explique o conceito com outro exemplo?',
      sources: [],
      generatedBy: 'safe-fallback',
    };
  }

  const fallback = fallbackAnswer(normalizedQuestion);
  const normalizedApiKey = typeof apiKey === 'string' ? apiKey.trim() : '';
  if (!normalizedApiKey || normalizedApiKey === 'local-fallback') {
    logMentorFallback('missing_api_key', null, model);
    return { ...fallback, generatedBy: 'safe-fallback' };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: normalizedApiKey });
    const response = await ai.models.generateContent({
      model,
      contents: [
        'Você é o CapiMentor, tutor jovem, encorajador e didático do Money Rank para alunos do terceiro ano de escola técnica.',
        'Seu domínio inclui educação financeira, educação fiscal, cidadania, saúde pública, consumo responsável, direitos, orçamento público e políticas públicas relacionadas.',
        'Antes de responder, use a Pesquisa Google para localizar ao menos uma fonte pertinente. Priorize fontes oficiais: órgãos públicos, legislação, universidades, OMS/OPAS e instituições reconhecidas. Diferencie fato, interpretação e exemplo.',
        'Responda em português brasileiro com quatro a seis parágrafos claros, aproximadamente 250 a 450 palavras.',
        'Explique relações individuais e coletivas, evite culpabilizar pessoas e termine perguntando se o aluno quer aprofundar algum ponto.',
        'Não invente leis, números, fontes ou fatos. Se houver incerteza, diga isso explicitamente.',
        'Não entregue gabaritos, não escolha alternativas e não mencione contexto invisível.',
        'Não forneça diagnóstico ou aconselhamento médico, jurídico ou financeiro individual.',
        `Tema atual da trilha: ${context.currentTopic}.`,
        `Saldo aproximado no jogo: ${context.capiCoins} CapiCoins.`,
        `Tópicos que podem precisar de reforço: ${context.difficultTopics.join('; ') || 'nenhum identificado'}.`,
        `Pergunta do aluno: ${normalizedQuestion}`,
      ].join('\n'),
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.35,
        maxOutputTokens: 1400,
      },
    });
    const selected = selectMentorResponse(response, fallback);
    if (selected) {
      if (selected.generatedBy === 'gemini') {
        console.warn(JSON.stringify({
          event: 'student_mentor_without_grounding_metadata',
          model,
        }));
      }
      return selected;
    }
    logMentorFallback('invalid_or_empty_model_response', null, model);
    return { ...fallback, generatedBy: 'safe-fallback' };
  } catch (error) {
    logMentorFallback('gemini_request_failed', error, model);
    return { ...fallback, generatedBy: 'safe-fallback' };
  }
}
