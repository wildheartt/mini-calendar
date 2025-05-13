const API_BASE = import.meta.env.DEV
  ? '/api'
  : `${import.meta.env.VITE_API_BASE_URL}/api`;

function apiUrl(path, query = '') {
  return `${API_BASE}${path}${query}`;
}

export async function fetchTasks(from, to) {
  const res = await fetch(apiUrl('/tasks', `?from=${from}&to=${to}`));
  if (!res.ok) throw new Error('Не удалось загрузить задачи');
  return res.json();
}

export async function createTask(date, text) {
  const res = await fetch(apiUrl('/tasks'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, text }),
  });
  if (!res.ok) throw new Error('Не удалось создать задачу');
  return res.json();
}
