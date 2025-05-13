const API_BASE = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_BASE_URL;

export async function fetchTasks(from, to) {
  try {
    const res = await fetch(`${API_BASE}/api/tasks?from=${from}&to=${to}`);
    if (!res.ok) throw new Error('Не удалось загрузить задачи');
    return res.json();
  } catch (error) {
    console.error('Ошибка при загрузке задач:', error);
    return [];
  }
}

export async function createTask(date, text) {
  try {
    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, text }),
    });
    if (!res.ok) throw new Error('Не удалось создать задачу');
    return res.json();
  } catch (error) {
    console.error('Ошибка при создании задачи:', error);
    throw error;
  }
}
