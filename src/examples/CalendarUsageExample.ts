import { CalendarService } from '../services/CalendarService';
import { RepositoryFactory } from '../factories/RepositoryFactory';
import { FirebaseConfig, firebaseConfig } from '../config/firebase';
import { TaskStatus, CreateTaskData, TaskFilter } from '../types/calendar';

export function useLocalStorageCalendar() {
  const localStorageRepo = RepositoryFactory.createLocalStorage();

  const calendar = new CalendarService(localStorageRepo);

  console.log('Используется хранилище:', calendar.getRepositoryType());

  return calendar;
}

export function useFirebaseCalendar() {
  FirebaseConfig.initialize(firebaseConfig);

  const firebaseRepo = RepositoryFactory.createFirebase(FirebaseConfig.getDb());

  const calendar = new CalendarService(firebaseRepo);

  console.log('Используется хранилище:', calendar.getRepositoryType());

  return calendar;
}

export async function calendarUsageExample() {
  const calendar = useLocalStorageCalendar();

  try {
    const newTaskData: CreateTaskData = {
      title: 'Встреча с командой',
      description: 'Обсуждение планов на спринт',
      date: new Date('2024-01-15T10:00:00'),
      status: TaskStatus.PENDING,
      tags: ['работа', 'встреча'],
    };

    const createdTask = await calendar.createTask(newTaskData);
    console.log('Создана задача:', createdTask);
    const allTasks = await calendar.getAllTasks();
    console.log('Все задачи:', allTasks);

    const updatedTask = await calendar.updateTask(createdTask.id, {
      status: TaskStatus.IN_PROGRESS,
      description: 'Встреча началась',
    });
    console.log('Обновленная задача:', updatedTask);
    const todayTasks = await calendar.getTasksByDate(new Date());
    console.log('Задачи на сегодня:', todayTasks);
    const searchResults = await calendar.searchTasksByText('встреча');
    console.log('Результаты поиска:', searchResults);

    const workTasks = await calendar.getTasksByTags(['работа']);
    console.log('Рабочие задачи:', workTasks);

    const complexFilter: TaskFilter = {
      text: 'встреча',
      status: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS],
      dateFrom: new Date('2024-01-01'),
      dateTo: new Date('2024-01-31'),
      tags: ['работа'],
    };

    const filteredTasks = await calendar.filterTasks(complexFilter);
    console.log('Отфильтрованные задачи:', filteredTasks);

    const tasksCount = await calendar.getTasksCount();
    const tasksByStatus = await calendar.getTasksCountByStatus();
    console.log('Количество задач:', tasksCount);
    console.log('Статистика по статусам:', tasksByStatus);

    const deleted = await calendar.deleteTask(createdTask.id);
    console.log('Задача удалена:', deleted);
  } catch (error) {
    console.error('Ошибка при работе с календарем:', error);
  }
}

export async function repositorySwitchExample() {
  const calendar = useLocalStorageCalendar();

  const task = await calendar.createTask({
    title: 'Тестовая задача',
    date: new Date(),
    tags: ['тест'],
  });

  console.log('Создано в localStorage:', task);

  if (FirebaseConfig.isInitialized()) {
    const firebaseRepo = RepositoryFactory.createFirebase(
      FirebaseConfig.getDb(),
    );
    calendar.switchRepository(firebaseRepo);

    console.log('Переключились на:', calendar.getRepositoryType());

    const firebaseTasks = await calendar.getAllTasks();
    console.log('Задачи в Firebase:', firebaseTasks);
  }
}
