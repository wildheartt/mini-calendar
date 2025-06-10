const TASKS_KEY = 'mini-calendar-tasks';

export const getTasks = (from, to) => {
  const tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
  return tasks.filter((task) => task.date >= from && task.date <= to);
};

export const addTask = (date, { title, description }) => {
  const tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
  const newTask = {
    id: Date.now().toString(),
    date,
    text: JSON.stringify({ title, description }),
    title,
    description,
  };
  tasks.push(newTask);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  return newTask;
};

export const updateTask = (id, { title, description }) => {
  const tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex !== -1) {
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      text: JSON.stringify({ title, description }),
      title,
      description,
    };
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return tasks[taskIndex];
  }
  return null;
};

export const deleteTask = (id) => {
  const tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
  const filteredTasks = tasks.filter((task) => task.id !== id);
  localStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));
  return true;
};
