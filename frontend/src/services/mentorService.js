import { fetchApiJson } from '../lib/api';

export async function askStudentMentor(question) {
  const result = await fetchApiJson('/api/actions/student-mentor', {
    method: 'POST',
    body: { question },
  });
  const answer = String(result?.answer || '').trim();
  if (!answer) throw new Error('O CapiMentor devolveu uma resposta vazia.');
  return {
    answer,
    sources: Array.isArray(result?.sources) ? result.sources.slice(0, 5) : [],
    searchSuggestionsHtml: typeof result?.searchSuggestionsHtml === 'string'
      ? result.searchSuggestionsHtml
      : '',
  };
}
