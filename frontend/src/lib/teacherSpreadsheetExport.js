export const TEACHER_EXPORT_MIME_TYPE = 'text/csv;charset=utf-8';

const CSV_SEPARATOR = ';';
const CSV_BOM = '\uFEFF';
const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Fortaleza',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

const STATUS_LABELS = Object.freeze({
  DRAFT: 'Rascunho',
  SCHEDULED: 'Agendado',
  ACTIVE: 'Ativo',
  PAUSED: 'Pausado',
  CLOSED: 'Encerrado',
});

function formatNumber(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '';
  return String(number).replace('.', ',');
}

export function formatTeacherExportDate(value) {
  if (value === null || value === undefined || value === '') return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const parts = Object.fromEntries(
    DATE_TIME_FORMATTER.formatToParts(date)
      .filter(({ type }) => type !== 'literal')
      .map(({ type, value: partValue }) => [type, partValue]),
  );
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

function protectSpreadsheetText(value) {
  const text = String(value ?? '');
  return /^\s*[=+\-@]/u.test(text) ? `'${text}` : text;
}

export function escapeTeacherCsvCell(value) {
  const text = typeof value === 'number'
    ? formatNumber(value)
    : protectSpreadsheetText(value);
  if (/[;"\r\n]/u.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

function csvRow(values) {
  return values.map(escapeTeacherCsvCell).join(CSV_SEPARATOR);
}

function section(title, headers, rows) {
  return [
    [title],
    headers,
    ...rows,
    [],
  ];
}

function safeFileName(value) {
  const slug = String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
    .slice(0, 64)
    .replace(/-+$/gu, '');
  return slug || 'periodo';
}

function summaryRows(summary) {
  return [
    ['Alunos cadastrados', summary?.totalStudents, 'alunos'],
    ['Alunos participantes', summary?.participatingStudents, 'alunos'],
    ['Participação', summary?.participationRate, '%'],
    ['Pontos competitivos', summary?.totalPoints, 'pontos'],
    ['Tentativas', summary?.totalAttempts, 'tentativas'],
    ['Tentativas aprovadas', summary?.approvedAttempts, 'tentativas'],
    ['Aprovação', summary?.approvalRate, '%'],
    ['Média das notas', summary?.averageScore, '%'],
    ['Trilhas concluídas', summary?.completedTrailStudents, 'alunos'],
  ];
}

function classRows(classes) {
  return (Array.isArray(classes) ? classes : []).map((item) => [
    item.className,
    item.registeredStudents,
    item.participatingStudents,
    item.participationRate,
    item.totalPoints,
    item.totalAttempts,
    item.averageScore,
    item.progressPercent,
  ]);
}

function phaseRows(phases) {
  return (Array.isArray(phases) ? phases : []).map((item) => [
    item.phaseNumber,
    item.title,
    item.studentsReached,
    item.studentsCompleted,
    item.totalAttempts,
    item.approvedAttempts,
    item.approvalRate,
    item.averageScore,
    item.correctAnswers,
    item.wrongAnswers,
    item.difficultyRate,
  ]);
}

function studentRows(students) {
  return (Array.isArray(students) ? students : []).map((item) => [
    // Nome preferido e turma são os únicos identificadores pessoais exportados.
    item.preferredName,
    item.className,
    item.currentPhase,
    item.capiCoins,
    item.completedSteps,
    item.progressPercent,
    item.totalAttempts,
    item.averageScore,
    item.wrongAnswers,
    item.totalPoints,
    formatTeacherExportDate(item.lastActivityAt),
    item.participated ? 'Sim' : 'Não',
  ]);
}

const WORKSHOP_ACTIVITY_TITLES = Object.freeze({
  1: 'Verdadeiro ou falso',
  2: 'Ligar colunas',
  3: 'Completar frases',
  4: 'Quiz Ciência Delas',
});

function workshopSummaryRows(summary) {
  return [
    ['Participantes cadastrados', summary?.totalStudents, 'alunos'],
    ['Participantes que competiram', summary?.participatingStudents, 'alunos'],
    ['Equipes ativas', summary?.totalTeams, 'equipes'],
    ['CapiCoins distribuídos', summary?.totalPoints, 'pontos'],
    ['Rodadas concluídas', summary?.totalAttempts, 'rodadas'],
    ['Média das rodadas', summary?.averageScore, '%'],
    ['Respostas corretas', summary?.correctAnswers, 'respostas'],
    ['Respostas incorretas', summary?.wrongAnswers, 'respostas'],
  ];
}

function workshopTeamRows(teams) {
  return (Array.isArray(teams) ? teams : []).map((item) => [
    item.position,
    item.teamName,
    item.memberCount,
    item.capiCoins,
  ]);
}

function workshopIndividualRows(students) {
  return (Array.isArray(students) ? students : []).map((item) => [
    item.position,
    item.preferredName,
    item.teamName,
    item.className,
    item.capiCoins,
  ]);
}

function workshopActivityRows(activities) {
  return (Array.isArray(activities) ? activities : []).map((item) => {
    const totalAnswers = Number(item.correctAnswers) + Number(item.wrongAnswers);
    const difficultyRate = totalAnswers > 0
      ? Math.round((Number(item.wrongAnswers) / totalAnswers) * 100)
      : 0;
    return [
      item.phaseNumber,
      WORKSHOP_ACTIVITY_TITLES[item.phaseNumber] || `Atividade ${item.phaseNumber}`,
      item.totalAttempts,
      item.participants,
      item.averageScore,
      item.correctAnswers,
      item.wrongAnswers,
      difficultyRate,
    ];
  });
}

function workshopStudentRows(students) {
  return (Array.isArray(students) ? students : []).map((item) => [
    item.preferredName || item.fullName,
    item.teamName,
    item.className,
    item.totalAttempts,
    item.averageScore,
    item.correctAnswers,
    item.wrongAnswers,
    item.totalPoints,
    formatTeacherExportDate(item.lastActivityAt),
  ]);
}

export function buildWorkshopDashboardCsvExport({
  event,
  dashboard,
  generatedAt = new Date(),
} = {}) {
  if (!event || typeof event !== 'object') {
    throw new Error('Oficina inválida para exportação.');
  }
  if (!dashboard?.summary || typeof dashboard.summary !== 'object') {
    throw new Error('Dados da oficina indisponíveis para exportação.');
  }

  const rows = [
    ['Money Rank - Relatório da oficina'],
    ['Oficina', event.name],
    ['Período', event.periodName],
    ['Status da oficina', STATUS_LABELS[event.status] ?? event.status ?? ''],
    ['Status do período', STATUS_LABELS[event.periodStatus] ?? event.periodStatus ?? ''],
    ['Início', formatTeacherExportDate(event.startsAt)],
    ['Fim', formatTeacherExportDate(event.endsAt)],
    ['Gerado em', formatTeacherExportDate(generatedAt)],
    [],
    ...section(
      'Resumo da competição',
      ['Indicador', 'Valor', 'Unidade'],
      workshopSummaryRows(dashboard.summary),
    ),
    ...section(
      'Ranking das equipes',
      ['Posição', 'Equipe', 'Participantes', 'CapiCoins'],
      workshopTeamRows(dashboard.teamRanking),
    ),
    ...section(
      'Ranking individual',
      ['Posição', 'Nome preferido', 'Equipe', 'Turma informada', 'CapiCoins'],
      workshopIndividualRows(dashboard.individualRanking),
    ),
    ...section(
      'Atividades',
      [
        'Atividade',
        'Título',
        'Rodadas',
        'Participantes',
        'Média (%)',
        'Respostas corretas',
        'Respostas incorretas',
        'Dificuldade (%)',
      ],
      workshopActivityRows(dashboard.activities),
    ),
    ...section(
      'Participantes',
      [
        'Nome exibido',
        'Equipe',
        'Turma informada',
        'Rodadas',
        'Média (%)',
        'Respostas corretas',
        'Respostas incorretas',
        'CapiCoins',
        'Última atividade',
      ],
      workshopStudentRows(dashboard.students),
    ),
  ];

  return {
    fileName: `money-rank-oficina-${safeFileName(event.name || event.periodName)}.csv`,
    mimeType: TEACHER_EXPORT_MIME_TYPE,
    content: CSV_BOM + rows.map(csvRow).join('\r\n'),
    rowCount: rows.length,
  };
}

export function buildTeacherDashboardCsvExport({
  period,
  dashboard,
  generatedAt = new Date(),
} = {}) {
  if (!period || typeof period !== 'object') {
    throw new Error('Período inválido para exportação.');
  }
  if (!dashboard?.summary || typeof dashboard.summary !== 'object') {
    throw new Error('Dados do painel indisponíveis para exportação.');
  }

  const rows = [
    ['Money Rank - Relatório pedagógico'],
    ['Período', period.name],
    ['Status', STATUS_LABELS[period.status] ?? period.status ?? ''],
    ['Início', formatTeacherExportDate(period.startsAt)],
    ['Fim', formatTeacherExportDate(period.endsAt)],
    ['Gerado em', formatTeacherExportDate(generatedAt)],
    [],
    ...section('Resumo', ['Indicador', 'Valor', 'Unidade'], summaryRows(
      dashboard.summary,
    )),
    ...section(
      'Turmas',
      [
        'Turma',
        'Cadastrados',
        'Participantes',
        'Participação (%)',
        'Pontos',
        'Tentativas',
        'Nota média (%)',
        'Progresso (%)',
      ],
      classRows(dashboard.classes),
    ),
    ...section(
      'Fases',
      [
        'Fase',
        'Título',
        'Alunos alcançados',
        'Alunos concluintes',
        'Tentativas',
        'Aprovadas',
        'Aprovação (%)',
        'Nota média (%)',
        'Respostas corretas',
        'Respostas erradas',
        'Dificuldade (%)',
      ],
      phaseRows(dashboard.phases),
    ),
    ...section(
      'Alunos',
      [
        'Nome preferido',
        'Turma',
        'Fase atual',
        'CapiCoins',
        'Etapas concluídas',
        'Progresso (%)',
        'Tentativas',
        'Nota média (%)',
        'Respostas erradas',
        'Pontos',
        'Última atividade',
        'Participou',
      ],
      studentRows(dashboard.students),
    ),
  ];
  const content = CSV_BOM + rows.map(csvRow).join('\r\n');

  return {
    fileName: `money-rank-${safeFileName(period.name)}.csv`,
    mimeType: TEACHER_EXPORT_MIME_TYPE,
    content,
    rowCount: rows.length,
  };
}
