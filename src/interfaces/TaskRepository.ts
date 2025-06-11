import {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilter,
} from '../types/calendar';

export interface SyncTaskRepository {
  create(data: CreateTaskData): Task;
  getById(id: string): Task | null;
  getAll(): Task[];
  update(id: string, data: UpdateTaskData): Task | null;
  delete(id: string): boolean;
  filter(filter: TaskFilter): Task[];
  clear(): void;
}

export interface AsyncTaskRepository {
  create(data: CreateTaskData): Promise<Task>;
  getById(id: string): Promise<Task | null>;
  getAll(): Promise<Task[]>;
  update(id: string, data: UpdateTaskData): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
  filter(filter: TaskFilter): Promise<Task[]>;
  clear(): Promise<void>;
}

export type TaskRepository = SyncTaskRepository | AsyncTaskRepository;

export function isSyncRepository(
  repo: TaskRepository,
): repo is SyncTaskRepository {
  const result = (repo as SyncTaskRepository).getAll();
  return !(result instanceof Promise);
}

export function isAsyncRepository(
  repo: TaskRepository,
): repo is AsyncTaskRepository {
  return !isSyncRepository(repo);
}
