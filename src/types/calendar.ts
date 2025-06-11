export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: Date;
  status: TaskStatus;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFilter {
  text?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: TaskStatus[];
  tags?: string[];
}

export interface CreateTaskData {
  title: string;
  description?: string;
  date: Date;
  status?: TaskStatus;
  tags?: string[];
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  date?: Date;
  status?: TaskStatus;
  tags?: string[];
}
