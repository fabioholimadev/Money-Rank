export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...(options.headers || {}) };
  const isForm = options.body instanceof FormData;

  if (!isForm && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let body = options.body;
  if (body && headers['Content-Type'] === 'application/json' && typeof body !== 'string') {
    body = JSON.stringify(body);
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const res = await fetch(url, { ...options, headers, body });
  return res;
}

export default fetchApi;
