import {
  fromDataConnectAvatar,
  fromDataConnectClass,
} from './profileDataMapper.js';

const MAX_RANKING_POINTS = 10_000_000;

function toInteger(value, minimum, maximum) {
  const number = Number(value);
  return Number.isInteger(number) && number >= minimum && number <= maximum
    ? number
    : null;
}

function normalizeHttpsUrl(value) {
  if (typeof value !== 'string' || value.length > 2_048) return null;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? value : null;
  } catch {
    return null;
  }
}

function normalizeName(value) {
  if (typeof value !== 'string') return null;
  const name = value.trim().replace(/\s+/g, ' ');
  return name.length >= 2 && name.length <= 40 ? name : null;
}

export function normalizeIndividualRanking(rows) {
  if (!Array.isArray(rows)) return [];

  return rows.flatMap((row, index) => {
    const position = toInteger(row?.position, 1, 100);
    const totalPoints = toInteger(
      row?.totalPoints,
      0,
      MAX_RANKING_POINTS,
    );
    const preferredName = normalizeName(row?.preferredName);
    const className = fromDataConnectClass(row?.classGroup);

    if (
      position === null ||
      totalPoints === null ||
      !preferredName ||
      !className
    ) {
      return [];
    }

    return [{
      key: `student-${index}-${position}-${className}-${preferredName}`,
      position,
      preferredName,
      className,
      avatarId: fromDataConnectAvatar(row?.avatarId),
      avatarUrl: normalizeHttpsUrl(row?.avatarUrl),
      totalPoints,
    }];
  });
}

export function normalizeClassRanking(rows) {
  if (!Array.isArray(rows)) return [];

  return rows.flatMap((row) => {
    const position = toInteger(row?.position, 1, 2);
    const registeredStudents = toInteger(row?.registeredStudents, 0, 200);
    const participatingStudents = toInteger(
      row?.participatingStudents,
      0,
      200,
    );
    const totalPoints = toInteger(
      row?.totalPoints,
      0,
      MAX_RANKING_POINTS,
    );
    const className = fromDataConnectClass(row?.classGroup);

    if (
      position === null ||
      registeredStudents === null ||
      participatingStudents === null ||
      participatingStudents > registeredStudents ||
      totalPoints === null ||
      !className
    ) {
      return [];
    }

    return [{
      key: `class-${className}`,
      position,
      className,
      registeredStudents,
      participatingStudents,
      totalPoints,
    }];
  });
}
