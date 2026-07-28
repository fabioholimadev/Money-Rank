export function normalizeCurrentPhase(value) {
  const currentPhase = Number(value);

  return Number.isInteger(currentPhase) && currentPhase >= 0
    ? currentPhase
    : 0;
}

export function getPhaseProgress(progressEntries, phaseNumber) {
  return (
    progressEntries.find(
      (entry) => Number(entry.phaseNumber) === Number(phaseNumber),
    ) ?? null
  );
}

export function isPhaseUnlocked(phaseNumber, currentPhase) {
  return Number(phaseNumber) <= Number(currentPhase);
}

export function isPhaseCompleted(phaseNumber, currentPhase, progress) {
  return (
    progress?.status === 'COMPLETED' ||
    Number(phaseNumber) < Number(currentPhase)
  );
}

export function isActivityUnlocked(
  phaseNumber,
  currentPhase,
  progress,
) {
  if (!isPhaseUnlocked(phaseNumber, currentPhase)) {
    return false;
  }

  return (
    isPhaseCompleted(phaseNumber, currentPhase, progress) ||
    progress?.status === 'IN_PROGRESS'
  );
}
