import {
  TaskRepository,
  SyncTaskRepository,
  AsyncTaskRepository,
  isSyncRepository,
  isAsyncRepository,
} from '../interfaces/TaskRepository';
import {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilter,
  TaskStatus,
} from '../types/calendar';

export class CalendarService {
  constructor(private repository: TaskRepository) {}

  async createTask(data: CreateTaskData): Promise<Task> {
    if (isSyncRepository(this.repository)) {
      return this.repository.create(data);
    } else {
      return await this.repository.create(data);
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    if (isSyncRepository(this.repository)) {
      return this.repository.getById(id);
    } else {
      return await this.repository.getById(id);
    }
  }

  async getAllTasks(): Promise<Task[]> {
    if (isSyncRepository(this.repository)) {
      return this.repository.getAll();
    } else {
      return await this.repository.getAll();
    }
  }

  async updateTask(id: string, data: UpdateTaskData): Promise<Task | null> {
    if (isSyncRepository(this.repository)) {
      return this.repository.update(id, data);
    } else {
      return await this.repository.update(id, data);
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    if (isSyncRepository(this.repository)) {
      return this.repository.delete(id);
    } else {
      return await this.repository.delete(id);
    }
  }

  async filterTasks(filter: TaskFilter): Promise<Task[]> {
    if (isSyncRepository(this.repository)) {
      return this.repository.filter(filter);
    } else {
      return await this.repository.filter(filter);
    }
  }

  async clearAllTasks(): Promise<void> {
    if (isSyncRepository(this.repository)) {
      this.repository.clear();
    } else {
      await this.repository.clear();
    }
  }

  // Дополнительные методы для удобства работы
  async getTasksByDate(date: Date): Promise<Task[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.filterTasks({
      dateFrom: startOfDay,
      dateTo: endOfDay,
    });
  }

  async getTasksByDateRange(dateFrom: Date, dateTo: Date): Promise<Task[]> {
    return this.filterTasks({
      dateFrom,
      dateTo,
    });
  }

  async searchTasksByText(searchText: string): Promise<Task[]> {
    return this.filterTasks({
      text: searchText,
    });
  }

  async getTasksByTags(tags: string[]): Promise<Task[]> {
    return this.filterTasks({
      tags,
    });
  }

  async getCompletedTasks(): Promise<Task[]> {
    return this.filterTasks({
      status: [TaskStatus.COMPLETED],
    });
  }

  async getPendingTasks(): Promise<Task[]> {
    return this.filterTasks({
      status: [TaskStatus.PENDING],
    });
  }

  // Полезные методы для статистики
  async getTasksCount(): Promise<number> {
    const tasks = await this.getAllTasks();
    return tasks.length;
  }

  async getTasksCountByStatus(): Promise<Record<string, number>> {
    const tasks = await this.getAllTasks();
    return tasks.reduce(
      (acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  switchRepository(newRepository: TaskRepository): void {
    this.repository = newRepository;
  }

  getRepositoryType(): 'sync' | 'async' {
    return isSyncRepository(this.repository) ? 'sync' : 'async';
  }
}
