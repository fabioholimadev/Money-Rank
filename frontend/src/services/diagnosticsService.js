import { fetchApiJson } from '../lib/api';

export function fetchTeacherDiagnostics() {
  return fetchApiJson('/api/teacher/diagnostics');
}

export function runGeminiProbe() {
  return fetchApiJson('/api/teacher/diagnostics/gemini-probe', { method: 'POST' });
}
