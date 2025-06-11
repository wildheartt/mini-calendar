import { SyncTaskRepository } from '../interfaces/TaskRepository';
import {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilter,
  TaskStatus,
} from '../types/calendar';

export class LocalStorageTaskRepository implements SyncTaskRepository {
  private readonly STORAGE_KEY = 'calendar_tasks';

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getTasks(): Task[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];

      const tasks = JSON.parse(data);
      return tasks.map((task: any) => ({
        ...task,
        date: new Date(task.date),
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));
    } catch (error) {
      console.error('Ошибка при чтении задач из localStorage:', error);
      return [];
    }
  }

  private saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Ошибка при сохранении задач в localStorage:', error);
      throw new Error('Не удалось сохранить задачи');
    }
  }

  create(data: CreateTaskData): Task {
    const now = new Date();
    const task: Task = {
      id: this.generateId(),
      title: data.title,
      description: data.description,
      date: data.date,
      status: data.status || TaskStatus.PENDING,
      tags: data.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    const tasks = this.getTasks();
    tasks.push(task);
    this.saveTasks(tasks);

    return task;
  }

  getById(id: string): Task | null {
    const tasks = this.getTasks();
    return tasks.find((task) => task.id === id) || null;
  }

  getAll(): Task[] {
    return this.getTasks();
  }

  update(id: string, data: UpdateTaskData): Task | null {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) return null;

    const updatedTask: Task = {
      ...tasks[taskIndex],
      ...data,
      updatedAt: new Date(),
    };

    tasks[taskIndex] = updatedTask;
    this.saveTasks(tasks);

    return updatedTask;
  }

  delete(id: string): boolean {
    const tasks = this.getTasks();
    const initialLength = tasks.length;
    const filteredTasks = tasks.filter((task) => task.id !== id);

    if (filteredTasks.length === initialLength) return false;

    this.saveTasks(filteredTasks);
    return true;
  }

  filter(filter: TaskFilter): Task[] {
    const tasks = this.getTasks();

    return tasks.filter((task) => {
      if (filter.text) {
        const searchText = filter.text.toLowerCase();
        const titleMatch = task.title.toLowerCase().includes(searchText);
        const descriptionMatch = task.description
          ?.toLowerCase()
          .includes(searchText);
        if (!titleMatch && !descriptionMatch) return false;
      }

      if (filter.dateFrom && task.date < filter.dateFrom) {
        return false;
      }

      if (filter.dateTo && task.date > filter.dateTo) {
        return false;
      }

      if (
        filter.status &&
        filter.status.length > 0 &&
        !filter.status.includes(task.status)
      ) {
        return false;
      }

      if (filter.tags && filter.tags.length > 0) {
        const hasMatchingTag = filter.tags.some((tag) =>
          task.tags.includes(tag),
        );
        if (!hasMatchingTag) return false;
      }

      return true;
    });
  }

  clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
