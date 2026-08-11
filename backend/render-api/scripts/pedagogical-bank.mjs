import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser } from 'fast-xml-parser';
import JSZip from 'jszip';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '../../..');
const defaultWorkbook = path.join(
  repositoryRoot,
  'docs/sources/banco-pedagogico-money-rank-preenchido.xlsx',
);
const generatedBankPath = path.join(
  repositoryRoot,
  'functions/src/generated/pedagogical-bank.json',
);
const reportPath = path.join(
  repositoryRoot,
  'docs/evidence/pedagogical-bank-import-report.json',
);
const variablesPath = path.join(
  repositoryRoot,
  'outputs/pedagogical-bank-import-variables.json',
);

const SHEETS = Object.freeze({
  'Perigo Doce': {
    activityId: 'perigo-doce-quiz',
    phaseNumber: 1,
    itemType: 'QUESTION',
    expectedCount: 30,
  },
  'Custo do Vício': {
    activityId: 'custo-vicio',
    phaseNumber: 2,
    itemType: 'DECISION',
    expectedCount: 54,
  },
  'Ilusão do Dinheiro': {
    activityId: 'ilusao-dinheiro-caminhos-v1',
    phaseNumber: 3,
    itemType: 'PATH',
    expectedCount: 24,
  },
  'Engenharia do Desejo': {
    activityId: 'engenharia-desejo-fato-fake-v1',
    phaseNumber: 4,
    itemType: 'CARD',
    expectedCount: 32,
  },
});

const args = new Set(process.argv.slice(2));
const shouldCommit = args.has('--commit');
const shouldGenerate = args.has('--generate') || shouldCommit;
const sourceArgument = process.argv.find((value) => value.startsWith('--source='));
const workbookPath = sourceArgument
  ? path.resolve(repositoryRoot, sourceArgument.slice('--source='.length))
  : defaultWorkbook;

function asArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function columnIndex(reference) {
  const letters = String(reference).match(/^[A-Z]+/i)?.[0]?.toUpperCase() || '';
  return [...letters].reduce(
    (total, letter) => total * 26 + letter.charCodeAt(0) - 64,
    0,
  ) - 1;
}

function richText(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  if (value.t !== undefined) return richText(value.t);
  if (value.r !== undefined) return asArray(value.r).map(richText).join('');
  if (value['#text'] !== undefined) return String(value['#text']);
  return '';
}

function cellValue(cell, sharedStrings) {
  if (cell.t === 'inlineStr') return richText(cell.is);
  const raw = cell.v;
  if (cell.t === 's') return sharedStrings[Number(raw)] ?? '';
  if (cell.t === 'b') return String(raw) === '1';
  if (cell.t === 'str') return String(raw ?? '');
  if (raw === undefined || raw === null || raw === '') return null;
  const numeric = Number(raw);
  return Number.isFinite(numeric) ? numeric : String(raw);
}

async function readWorkbook(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    parseTagValue: false,
    removeNSPrefix: true,
    trimValues: false,
  });
  const workbook = parser.parse(
    await zip.file('xl/workbook.xml').async('string'),
  ).workbook;
  const relationships = parser.parse(
    await zip.file('xl/_rels/workbook.xml.rels').async('string'),
  ).Relationships;
  const relationshipTargets = new Map(
    asArray(relationships.Relationship).map((relationship) => [
      relationship.Id,
      relationship.Target,
    ]),
  );
  const sharedStringsFile = zip.file('xl/sharedStrings.xml');
  const sharedStringsDocument = sharedStringsFile
    ? parser.parse(await sharedStringsFile.async('string')).sst
    : null;
  const sharedStrings = asArray(sharedStringsDocument?.si).map(richText);
  const result = new Map();

  for (const sheet of asArray(workbook.sheets.sheet)) {
    const target = relationshipTargets.get(sheet.id ?? sheet['r:id']);
    if (!target) throw new Error(`A aba ${sheet.name} não possui relacionamento OOXML.`);
    const normalizedTarget = target.startsWith('/')
      ? target.slice(1)
      : `xl/${target.replace(/^\.\//, '')}`;
    const sheetFile = zip.file(normalizedTarget);
    if (!sheetFile) throw new Error(`Arquivo interno ausente para a aba ${sheet.name}.`);
    const worksheet = parser.parse(await sheetFile.async('string')).worksheet;
    const rows = asArray(worksheet.sheetData?.row).map((row) => {
      const values = [];
      for (const cell of asArray(row.c)) {
        values[columnIndex(cell.r)] = cellValue(cell, sharedStrings);
      }
      return { number: Number(row.r), values };
    });
    result.set(sheet.name, rows);
  }
  return result;
}

function text(value) {
  return String(value ?? '').trim();
}

function number(value) {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function boolean(value) {
  if (typeof value === 'boolean') return value;
  return ['TRUE', '1', 'SIM', 'YES'].includes(text(value).toUpperCase());
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex').toUpperCase();
}

function rowsAsObjects(rows, sheetName) {
  const headerRow = rows.find((row) => row.number === 4);
  if (!headerRow) throw new Error(`A aba ${sheetName} não possui cabeçalho na linha 4.`);
  const headers = headerRow.values.map((value) => text(value));
  return rows
    .filter((row) => row.number > 4)
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row.values[index] ?? null])))
    .filter((row) => text(row.item_id));
}

function normalizeOptions(row, optionIds) {
  return optionIds.map((id) => ({
    id,
    label: text(row[`option_${id.toLowerCase()}`]),
  }));
}

function normalizeItem(row, config) {
  const optionIds = config.phaseNumber === 4 ? ['A', 'B'] : ['A', 'B', 'C', 'D'];
  const scores = Object.fromEntries(optionIds.map((id) => [
    id,
    number(row[`score_${id.toLowerCase()}`]),
  ]));
  const creditDeltas = config.phaseNumber === 3
    ? Object.fromEntries(optionIds.map((id) => [
      id,
      number(row[`credit_delta_${id.toLowerCase()}`]),
    ]))
    : undefined;
  const feedback = config.phaseNumber === 2
    ? Object.fromEntries(optionIds.map((id) => [
      id,
      text(row[`feedback_${id.toLowerCase()}`]),
    ]))
    : undefined;
  const tags = text(row.tags).split(',').map((tag) => tag.trim()).filter(Boolean);
  const publicPayload = {
    itemId: text(row.item_id),
    prompt: text(row.prompt),
    options: normalizeOptions(row, optionIds),
    difficulty: text(row.difficulty).toUpperCase(),
    tags,
    ...(text(row.character_id) ? { characterId: text(row.character_id) } : {}),
    ...(number(row.stage) !== null ? { stage: number(row.stage) } : {}),
    ...(text(row.stage_name) ? { stageName: text(row.stage_name) } : {}),
    ...(text(row.path_condition) ? { pathCondition: text(row.path_condition) } : {}),
  };
  const secretPayload = {
    correctOptionId: text(row.correct_option_id) || null,
    scores,
    explanation: text(row.explanation),
    source: { id: text(row.source_id), url: text(row.source_url) },
    ...(feedback ? { feedback } : {}),
    ...(creditDeltas ? {
      creditDeltas,
      initialCredit: number(row.initial_credit),
      minCredit: number(row.min_credit),
      maxCredit: number(row.max_credit),
    } : {}),
  };
  const normalized = {
    activityId: text(row.activity_id),
    version: text(row.version),
    itemId: text(row.item_id),
    phaseNumber: config.phaseNumber,
    itemType: text(row.type).toUpperCase(),
    characterId: text(row.character_id) || null,
    difficulty: text(row.difficulty).toUpperCase(),
    stage: number(row.stage),
    pathCondition: text(row.path_condition) || null,
    publicPayload,
    secretPayload,
    sourceId: text(row.source_id),
    sourceUrl: text(row.source_url),
    tags,
    active: boolean(row.active),
    reviewStatus: text(row.review_status).toUpperCase(),
    origin: text(row.origin),
  };
  return { ...normalized, contentHash: sha256(stableStringify(normalized)) };
}

function validateBank(itemsBySheet) {
  const errors = [];
  const allItems = [];
  const seenKeys = new Set();

  for (const [sheetName, config] of Object.entries(SHEETS)) {
    const items = itemsBySheet.get(sheetName) ?? [];
    if (items.length !== config.expectedCount) {
      errors.push(`${sheetName}: esperado ${config.expectedCount}, encontrado ${items.length}.`);
    }
    for (const item of items) {
      const prefix = `${sheetName}/${item.itemId || 'sem-id'}`;
      const key = `${item.activityId}|${item.version}|${item.itemId}`;
      if (seenKeys.has(key)) errors.push(`${prefix}: chave composta duplicada.`);
      seenKeys.add(key);
      if (item.activityId !== config.activityId) errors.push(`${prefix}: activity_id inválido.`);
      if (item.itemType !== config.itemType) errors.push(`${prefix}: type inválido.`);
      if (!item.version) errors.push(`${prefix}: version obrigatória.`);
      if (!/^(pd|cv|id|ed)-\d{3}$/.test(item.itemId)) errors.push(`${prefix}: item_id fora do contrato.`);
      if (!['EASY', 'MEDIUM', 'HARD'].includes(item.difficulty)) errors.push(`${prefix}: difficulty inválida.`);
      if (!item.active) errors.push(`${prefix}: active precisa ser TRUE no piloto.`);
      if (item.reviewStatus !== 'PILOT_UNREVIEWED') errors.push(`${prefix}: review_status precisa preservar PILOT_UNREVIEWED.`);
      if (!item.publicPayload.prompt) errors.push(`${prefix}: prompt obrigatório.`);
      if (item.publicPayload.options.some((option) => !option.label)) errors.push(`${prefix}: alternativas incompletas.`);
      if (!item.sourceId) errors.push(`${prefix}: source_id obrigatório.`);
      try {
        const parsedUrl = new URL(item.sourceUrl);
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('protocol');
      } catch {
        errors.push(`${prefix}: source_url inválida.`);
      }
      const scoreValues = Object.values(item.secretPayload.scores);
      if (scoreValues.some((score) => !Number.isInteger(score) || score < 0 || score > 3)) {
        errors.push(`${prefix}: scores precisam ser inteiros entre 0 e 3.`);
      }
      if ([1, 4].includes(config.phaseNumber)) {
        if (!item.publicPayload.options.some((option) => option.id === item.secretPayload.correctOptionId)) {
          errors.push(`${prefix}: correct_option_id inválido.`);
        }
      }
      if (config.phaseNumber === 2 && !item.characterId) errors.push(`${prefix}: character_id obrigatório.`);
      if (config.phaseNumber === 3) {
        if (!Number.isInteger(item.stage) || item.stage < 1 || item.stage > 6) errors.push(`${prefix}: stage deve estar entre 1 e 6.`);
        const deltas = Object.values(item.secretPayload.creditDeltas);
        if (deltas.some((delta) => !Number.isInteger(delta))) errors.push(`${prefix}: deltas de crédito inválidos.`);
        if (item.secretPayload.initialCredit !== 100 || item.secretPayload.minCredit !== 0 || item.secretPayload.maxCredit !== 120) {
          errors.push(`${prefix}: limites de crédito devem ser 100/0/120.`);
        }
      }
      allItems.push(item);
    }
  }

  const phaseOne = allItems.filter((item) => item.phaseNumber === 1);
  for (const [difficulty, minimum] of Object.entries({ EASY: 2, MEDIUM: 2, HARD: 1 })) {
    if (phaseOne.filter((item) => item.difficulty === difficulty).length < minimum) errors.push(`Perigo Doce: banco insuficiente para ${difficulty}.`);
  }
  const characters = Map.groupBy(allItems.filter((item) => item.phaseNumber === 2), (item) => item.characterId);
  if (characters.size !== 3) errors.push(`Custo do Vício: esperados 3 personagens, encontrados ${characters.size}.`);
  for (const [characterId, items] of characters) {
    if (items.length !== 18) errors.push(`Custo do Vício/${characterId}: esperadas 18 decisões.`);
    for (const difficulty of ['EASY', 'MEDIUM', 'HARD']) {
      if (items.filter((item) => item.difficulty === difficulty).length < 2) errors.push(`Custo do Vício/${characterId}: faltam itens ${difficulty}.`);
    }
  }
  const phaseThree = allItems.filter((item) => item.phaseNumber === 3);
  for (let stage = 1; stage <= 6; stage += 1) {
    if (phaseThree.filter((item) => item.stage === stage).length !== 4) errors.push(`Ilusão do Dinheiro: etapa ${stage} precisa ter 4 itens.`);
  }
  const phaseFour = allItems.filter((item) => item.phaseNumber === 4);
  for (const [difficulty, minimum] of Object.entries({ EASY: 2, MEDIUM: 4, HARD: 2 })) {
    if (phaseFour.filter((item) => item.difficulty === difficulty).length < minimum) errors.push(`Engenharia do Desejo: banco insuficiente para ${difficulty}.`);
  }
  const trueCards = phaseFour.filter((item) => item.secretPayload.correctOptionId === 'A').length;
  const falseCards = phaseFour.filter((item) => item.secretPayload.correctOptionId === 'B').length;
  if (trueCards < 4 || falseCards < 4) errors.push('Engenharia do Desejo: o banco não suporta 4 V/4 F.');
  if (allItems.length !== 140) errors.push(`Total obrigatório: esperado 140, encontrado ${allItems.length}.`);
  if (errors.length) throw new Error(`Planilha rejeitada; nenhuma linha foi importada:\n- ${errors.join('\n- ')}`);
  return allItems;
}

function distribution(items, field) {
  return Object.fromEntries(
    [...Map.groupBy(items, (item) => item[field] ?? 'NONE')]
      .map(([key, values]) => [key, values.length]),
  );
}

function cliItems(items, loadHash) {
  return items.map((item) => ({
    activity_id: item.activityId,
    version: item.version,
    item_id: item.itemId,
    phase_number: item.phaseNumber,
    item_type: item.itemType,
    character_id: item.characterId,
    difficulty: item.difficulty,
    stage: item.stage,
    path_condition: item.pathCondition,
    public_payload: item.publicPayload,
    secret_payload: item.secretPayload,
    source_id: item.sourceId,
    source_url: item.sourceUrl,
    tags: item.tags,
    active: item.active,
    review_status: item.reviewStatus,
    origin: item.origin,
    content_hash: item.contentHash,
    load_hash: loadHash,
  }));
}

async function runFirebaseCli(parameters) {
  const command = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  return new Promise((resolve, reject) => {
    const child = spawn(command, ['-y', 'firebase-tools@latest', ...parameters], {
      cwd: repositoryRoot,
      env: process.env,
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Firebase CLI terminou com código ${code}.`)));
  });
}

const workbookBytes = await fs.readFile(workbookPath);
const workbookSheets = await readWorkbook(workbookBytes);
const normalizedBySheet = new Map();
for (const [sheetName, config] of Object.entries(SHEETS)) {
  const rows = rowsAsObjects(workbookSheets.get(sheetName) ?? [], sheetName);
  normalizedBySheet.set(sheetName, rows.map((row) => normalizeItem(row, config)));
}
const items = validateBank(normalizedBySheet);
const loadHash = sha256(workbookBytes);
const versions = [...new Set(items.map((item) => item.version))];
const loadVersion = versions.length === 1 ? versions[0] : versions.sort().join('+');
const report = {
  status: shouldCommit ? 'READY_TO_IMPORT' : 'VALIDATED',
  sourceFile: path.relative(repositoryRoot, workbookPath).replaceAll('\\', '/'),
  loadHash,
  loadVersion,
  totalItems: items.length,
  countsByActivity: distribution(items, 'activityId'),
  countsByDifficulty: distribution(items, 'difficulty'),
  countsByCharacter: distribution(items.filter((item) => item.phaseNumber === 2), 'characterId'),
  reviewStatuses: distribution(items, 'reviewStatus'),
  rejected: 0,
};

await fs.mkdir(path.dirname(reportPath), { recursive: true });
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

if (shouldGenerate) {
  const generated = {
    schemaVersion: 2,
    sourceFile: report.sourceFile,
    sourceHash: loadHash,
    loadVersion,
    items,
  };
  await fs.writeFile(generatedBankPath, `${JSON.stringify(generated, null, 2)}\n`, 'utf8');
}

if (shouldCommit) {
  const variables = {
    loadHash,
    loadVersion,
    sourceFile: path.basename(workbookPath),
    itemCount: items.length,
    items: cliItems(items, loadHash),
  };
  await fs.writeFile(variablesPath, `${JSON.stringify(variables)}\n`, 'utf8');
  await runFirebaseCli([
    'dataconnect:execute',
    'dataconnect/connector/mutations.gql',
    'ImportPedagogicalBank',
    '--project', 'money-rank',
    '--service', 'money-rank-service',
    '--location', 'southamerica-east1',
    '--variables', `@${variablesPath}`,
  ]);
  report.status = 'IMPORTED';
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

console.log(JSON.stringify(report, null, 2));
