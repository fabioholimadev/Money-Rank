import { fetchApiJson } from '../lib/api';

export function fetchTeacherDiagnostics() {
  return fetchApiJson('/api/teacher/diagnostics');
}
