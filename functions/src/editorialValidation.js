const ACTIVITY_KEYS = Object.freeze({
  1: 'perigo-doce-quiz',
  2: 'custo-vicio',
  3: 'ilusao-dinheiro-caminhos-v1',
  4: 'engenharia-desejo-fato-fake-v1',
});

const MATERIAL_STATUSES = new Set(['available', 'pending']);

function cloneJson(value) {
  let serialized;
  try {
    serialized = JSON.stringify(value);
  } catch {
    throw new Error('O conteúdo precisa estar em uma estrutura válida.');
  }
  if (!serialized || serialized.length > 250_000) {
    throw new Error('O conteúdo excede o limite seguro de 250 KB.');
  }
  return JSON.parse(serialized);
}

function requireObject(value, message) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(message);
  }
  return value;
}

function requireArray(value, message, minimum = 0, maximum = 100) {
  if (
    !Array.isArray(value) ||
    value.length < minimum ||
    value.length > maximum
  ) {
    throw new Error(message);
  }
  return value;
}

export function normalizeEditorialText(
  value,
  field,
  minimum = 1,
  maximum = 240,
) {
  const text = typeof value === 'string'
    ? value.trim().replace(/[ \t]+/g, ' ')
    : '';
  if (text.length < minimum || text.length > maximum) {
    throw new Error(`${field} deve ter entre ${minimum} e ${maximum} caracteres.`);
  }
  return text;
}

function requireId(value, field) {
  const id = normalizeEditorialText(value, field, 2, 96);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    throw new Error(`${field} deve usar letras minúsculas, números e hífens.`);
  }
  return id;
}

export function requireHttpsUrl(value, field, { optional = false } = {}) {
  if (optional && (value === null || value === undefined || value === '')) {
    return null;
  }
  const urlText = normalizeEditorialText(value, field, 12, 2048);
  let url;
  try {
    url = new URL(urlText);
  } catch {
    throw new Error(`${field} precisa ser uma URL válida.`);
  }
  if (url.protocol !== 'https:') {
    throw new Error(`${field} precisa usar HTTPS.`);
  }
  return url.toString();
}

export function normalizeVideoEmbedUrl(value) {
  const normalized = requireHttpsUrl(value, 'vídeo.embedUrl');
  const url = new URL(normalized);
  const hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  const youtubeHosts = new Set([
    'youtube.com',
    'm.youtube.com',
    'youtube-nocookie.com',
  ]);

  let videoId = null;
  if (hostname === 'youtu.be') {
    videoId = url.pathname.split('/').filter(Boolean)[0] ?? null;
  } else if (youtubeHosts.has(hostname)) {
    if (url.pathname === '/watch') {
      videoId = url.searchParams.get('v');
    } else {
      const [kind, id] = url.pathname.split('/').filter(Boolean);
      if (['embed', 'shorts', 'live'].includes(kind)) videoId = id ?? null;
    }
  } else {
    return normalized;
  }

  if (!videoId || !/^[A-Za-z0-9_-]{6,32}$/.test(videoId)) {
    throw new Error(
      'URL do vídeo do YouTube inválida. Cole o link de um vídeo, não de um canal ou playlist.',
    );
  }

  const embed = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  const start = url.searchParams.get('start');
  if (start && /^\d{1,6}$/.test(start)) embed.searchParams.set('start', start);
  return embed.toString();
}

function assertUniqueIds(items, field) {
  const ids = new Set();
  for (const item of items) {
    const id = normalizeEditorialText(
      item?.id,
      `${field}: identificador`,
      1,
      96,
    );
    if (!/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/.test(id)) {
      throw new Error(`${field} possui identificador inválido.`);
    }
    if (ids.has(id)) throw new Error(`${field} possui identificadores repetidos.`);
    ids.add(id);
  }
}

function validateMaterial(material, slotName) {
  const item = requireObject(material, `Material ${slotName} inválido.`);
  if (!MATERIAL_STATUSES.has(item.status)) {
    throw new Error(`Status do material ${slotName} inválido.`);
  }
  normalizeEditorialText(item.title, `Título de ${slotName}`, 3, 160);
  normalizeEditorialText(
    item.description,
    `Descrição de ${slotName}`,
    3,
    500,
  );
  if (item.status === 'pending') return;

  const hasUrl = [item.embedUrl, item.documentUrl, item.sourceUrl]
    .some((value) => typeof value === 'string' && value.trim());
  const hasSections = Array.isArray(item.sections) && item.sections.length > 0;
  if (!hasUrl && !hasSections) {
    throw new Error(`O material ${slotName} precisa de URL ou seções.`);
  }
  for (const [field, value] of [
    ['embedUrl', item.embedUrl],
    ['documentUrl', item.documentUrl],
    ['sourceUrl', item.sourceUrl],
  ]) {
    if (!value) continue;
    item[field] = field === 'embedUrl' && slotName === 'vídeo'
      ? normalizeVideoEmbedUrl(value)
      : requireHttpsUrl(value, `${slotName}.${field}`);
  }
  if (item.sections) {
    for (const section of requireArray(
      item.sections,
      `${slotName} possui seções inválidas.`,
      1,
      10,
    )) {
      normalizeEditorialText(section?.title, 'Título da seção', 3, 120);
      normalizeEditorialText(
        section?.description,
        'Texto da seção',
        10,
        800,
      );
    }
  }
}

export function validateLearningModulePayload(
  rawPayload,
  expectedKey,
  expectedPhase,
) {
  const payload = cloneJson(rawPayload);
  requireObject(payload, 'Módulo de aprendizagem inválido.');
  if (requireId(payload.id, 'ID do módulo') !== expectedKey) {
    throw new Error('O identificador do módulo não pode ser alterado.');
  }
  if (Number(payload.phaseNumber) !== Number(expectedPhase)) {
    throw new Error('A fase do módulo não pode ser alterada.');
  }
  normalizeEditorialText(payload.title, 'Título', 3, 140);
  normalizeEditorialText(payload.description, 'Descrição', 10, 600);
  const slots = requireObject(payload.materialSlots, 'Materiais inválidos.');
  validateMaterial(slots.video, 'vídeo');
  if (slots.video.status !== 'available') {
    throw new Error('Cada módulo precisa de um vídeo publicado.');
  }
  if (Number(expectedPhase) > 0) {
    validateMaterial(slots.slides, 'slides');
    validateMaterial(slots.summary, 'resumo');
  }
  return payload;
}

function validatePerigoDoce(payload) {
  const facts = requireArray(
    payload.knowledge,
    'O Perigo do Doce precisa de pelo menos cinco fatos.',
    5,
    40,
  );
  assertUniqueIds(facts, 'Base de fatos');
  for (const fact of facts) {
    normalizeEditorialText(fact.topic, 'Tema do fato', 3, 120);
    normalizeEditorialText(fact.claim, 'Afirmação', 20, 900);
    normalizeEditorialText(fact.explanation, 'Explicação', 20, 900);
    const misconceptions = requireArray(
      fact.misconceptions,
      'Cada fato precisa de três equívocos.',
      3,
      6,
    );
    misconceptions.forEach((item) =>
      normalizeEditorialText(item, 'Equívoco', 10, 500));
    const source = requireObject(fact.source, 'Fonte do fato inválida.');
    normalizeEditorialText(source.publisher, 'Instituição', 2, 140);
    normalizeEditorialText(source.title, 'Título da fonte', 3, 220);
    requireHttpsUrl(source.url, 'URL da fonte');
  }
}

function validateCustoVicio(payload) {
  const cases = requireArray(
    payload.cases,
    'O Custo do Vício precisa de pelo menos três personagens.',
    3,
    12,
  );
  assertUniqueIds(cases, 'Personagens');
  for (const caseItem of cases) {
    normalizeEditorialText(caseItem.name, 'Nome do personagem', 2, 60);
    normalizeEditorialText(caseItem.story, 'História do personagem', 30, 1500);
    const decisions = requireArray(
      caseItem.decisions,
      'Cada personagem precisa de cinco decisões.',
      5,
      5,
    );
    assertUniqueIds(decisions, `Decisões de ${caseItem.name}`);
    for (const decision of decisions) {
      normalizeEditorialText(decision.question, 'Pergunta da decisão', 10, 500);
      const options = requireArray(
        decision.options,
        'Cada decisão precisa de três opções.',
        3,
        3,
      );
      assertUniqueIds(options, `Opções de ${decision.id}`);
      const points = options.map((option) => Number(option.points)).sort();
      if (points.join(',') !== '1,2,3') {
        throw new Error('Cada decisão deve usar os pesos 1, 2 e 3 uma vez.');
      }
      options.forEach((option) => {
        normalizeEditorialText(option.label, 'Texto da opção', 8, 500);
        normalizeEditorialText(option.feedback, 'Feedback da opção', 8, 700);
      });
    }
  }
}

function validateIlusaoDinheiro(payload) {
  const decisions = requireArray(
    payload.decisions,
    'A Ilusão do Dinheiro precisa de seis decisões.',
    6,
    6,
  );
  assertUniqueIds(decisions, 'Decisões');
  if (!Number.isFinite(Number(payload.initialBalance))) {
    throw new Error('Saldo inicial inválido.');
  }
  for (const decision of decisions) {
    normalizeEditorialText(decision.narrative, 'Narrativa da decisão', 15, 900);
    const choices = requireArray(
      decision.choices,
      'Cada decisão precisa de três caminhos.',
      3,
      3,
    );
    assertUniqueIds(choices, `Caminhos de ${decision.id}`);
    const points = choices.map((choice) => Number(choice.analysisPoints)).sort();
    if (points.join(',') !== '0,1,2') {
      throw new Error('Cada decisão deve usar análise 0, 1 e 2 uma vez.');
    }
    choices.forEach((choice) => {
      normalizeEditorialText(choice.label, 'Texto do caminho', 8, 500);
      normalizeEditorialText(choice.consequence, 'Consequência', 8, 700);
      const delta = Number(choice.balanceDelta);
      if (!Number.isInteger(delta) || Math.abs(delta) > 10_000) {
        throw new Error('Variação de saldo inválida.');
      }
    });
  }
}

function validateEngenhariaDesejo(payload) {
  const cards = requireArray(
    payload.cards,
    'A Engenharia do Desejo precisa de cards.',
    6,
    40,
  );
  assertUniqueIds(cards, 'Cards de publicidade');
  const realCount = cards.filter((card) => card.classification === 'REAL').length;
  const inventedCount = cards.filter(
    (card) => card.classification === 'INVENTED',
  ).length;
  if (realCount < 3 || inventedCount < 3) {
    throw new Error('A atividade precisa de três peças reais e três fictícias.');
  }
  for (const card of cards) {
    if (!['REAL', 'INVENTED'].includes(card.classification)) {
      throw new Error('Classificação de publicidade inválida.');
    }
    normalizeEditorialText(card.title, 'Título da publicidade', 3, 180);
    normalizeEditorialText(card.scenario, 'Cenário da publicidade', 20, 1200);
    normalizeEditorialText(card.explanation, 'Explicação da publicidade', 15, 1000);
    if (card.classification === 'REAL') {
      const evidence = requireObject(card.evidence, 'Peça real sem evidência.');
      requireHttpsUrl(evidence.url, 'URL da evidência');
    }
  }
}

export function validateActivityDefinitionPayload(
  rawPayload,
  expectedKey,
  expectedPhase,
) {
  const payload = cloneJson(rawPayload);
  requireObject(payload, 'Definição de atividade inválida.');
  if (requireId(payload.id, 'ID da atividade') !== expectedKey) {
    throw new Error('O identificador da atividade não pode ser alterado.');
  }
  if (Number(payload.phaseNumber) !== Number(expectedPhase)) {
    throw new Error('A fase da atividade não pode ser alterada.');
  }
  if (ACTIVITY_KEYS[Number(expectedPhase)] !== expectedKey) {
    throw new Error('Atividade incompatível com a fase.');
  }
  switch (Number(expectedPhase)) {
    case 1:
      validatePerigoDoce(payload);
      break;
    case 2:
      validateCustoVicio(payload);
      break;
    case 3:
      validateIlusaoDinheiro(payload);
      break;
    case 4:
      validateEngenhariaDesejo(payload);
      break;
    default:
      throw new Error('Fase editorial inválida.');
  }
  return payload;
}

export function validateEditorialPayload(type, rawPayload, key, phaseNumber) {
  if (type === 'LEARNING_MODULE') {
    return validateLearningModulePayload(rawPayload, key, phaseNumber);
  }
  if (type === 'ACTIVITY_DEFINITION') {
    return validateActivityDefinitionPayload(rawPayload, key, phaseNumber);
  }
  throw new Error('Tipo editorial inválido.');
}

function collectPedagogicalReviewItems(value, items = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectPedagogicalReviewItems(item, items));
    return items;
  }
  if (!value || typeof value !== 'object') return items;
  if (value.review && typeof value.review === 'object') items.push(value);
  Object.values(value).forEach((item) =>
    collectPedagogicalReviewItems(item, items));
  return items;
}

function getReviewSourceUrl(item) {
  return item.source?.url ?? item.evidence?.url ?? null;
}

export function validatePedagogicalApproval(
  rawPayload,
  { type, key, approvedResearchReviews = [] },
) {
  const payload = cloneJson(rawPayload);
  const reviewedItems = collectPedagogicalReviewItems(payload);

  for (const item of reviewedItems) {
    const itemId = normalizeEditorialText(
      item.id,
      'Identificador do conteúdo revisado',
      1,
      96,
    );
    if (item.review.pedagogical !== 'teacher_approved') {
      throw new Error(
        `O conteúdo ${itemId} ainda não possui aprovação pedagógica do professor.`,
      );
    }

    if (item.review.technical === 'project_created') continue;
    if (item.review.technical !== 'source_verified') {
      throw new Error(`O conteúdo ${itemId} possui revisão técnica inválida.`);
    }
    if (type !== 'ACTIVITY_DEFINITION') {
      throw new Error('Uma fonte revisada precisa pertencer a uma atividade.');
    }

    const sourceUrl = requireHttpsUrl(
      getReviewSourceUrl(item),
      `Fonte revisada de ${itemId}`,
    );
    const matchingReview = approvedResearchReviews.find((review) =>
      review?.activityKey === key &&
      review?.factKey === itemId &&
      review?.status === 'TEACHER_APPROVED' &&
      review?.reviewedByUid &&
      review?.reviewedAt &&
      requireHttpsUrl(review.sourceUrl, `Pesquisa aprovada de ${itemId}`) === sourceUrl &&
      (!item.claim || review.claim?.trim() === item.claim.trim()));

    if (!matchingReview) {
      throw new Error(
        `O conteúdo ${itemId} precisa estar vinculado a uma pesquisa aprovada pelo professor.`,
      );
    }
  }

  return payload;
}

export function getActivityKeyForPhase(phaseNumber) {
  return ACTIVITY_KEYS[Number(phaseNumber)] ?? null;
}
