import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch,
  Firestore,
} from 'firebase/firestore';
import { AsyncTaskRepository } from '../interfaces/TaskRepository';
import {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilter,
  TaskStatus,
} from '../types/calendar';

export class FirebaseTaskRepository implements AsyncTaskRepository {
  private readonly COLLECTION_NAME = 'calendar_tasks';

  constructor(private db: Firestore) {}

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private taskFromFirestore(id: string, data: any): Task {
    return {
      id,
      title: data.title,
      description: data.description,
      date: data.date.toDate(), 
      status: data.status,
      tags: data.tags || [],
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    };
  }

  private taskToFirestore(task: Omit<Task, 'id'>): any {
    return {
      title: task.title,
      description: task.description,
      date: task.date,
      status: task.status,
      tags: task.tags,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  async create(data: CreateTaskData): Promise<Task> {
    const now = new Date();
    const taskData = {
      title: data.title,
      description: data.description,
      date: data.date,
      status: data.status || TaskStatus.PENDING,
      tags: data.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    try {
      const docRef = await addDoc(
        collection(this.db, this.COLLECTION_NAME),
        taskData,
      );
      return {
        id: docRef.id,
        ...taskData,
      };
    } catch (error) {
      console.error('Ошибка при создании задачи в Firebase:', error);
      throw new Error('Не удалось создать задачу');
    }
  }

  async getById(id: string): Promise<Task | null> {
    try {
      const docRef = doc(this.db, this.COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return this.taskFromFirestore(docSnap.id, docSnap.data());
      }
      return null;
    } catch (error) {
      console.error('Ошибка при получении задачи из Firebase:', error);
      throw new Error('Не удалось получить задачу');
    }
  }

  async getAll(): Promise<Task[]> {
    try {
      const q = query(
        collection(this.db, this.COLLECTION_NAME),
        orderBy('createdAt', 'desc'),
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) =>
        this.taskFromFirestore(doc.id, doc.data()),
      );
    } catch (error) {
      console.error('Ошибка при получении всех задач из Firebase:', error);
      throw new Error('Не удалось получить задачи');
    }
  }

  async update(id: string, data: UpdateTaskData): Promise<Task | null> {
    try {
      const docRef = doc(this.db, this.COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const updateData = {
        ...data,
        updatedAt: new Date(),
      };

      await updateDoc(docRef, updateData);

      const updatedDocSnap = await getDoc(docRef);
      return this.taskFromFirestore(updatedDocSnap.id, updatedDocSnap.data());
    } catch (error) {
      console.error('Ошибка при обновлении задачи в Firebase:', error);
      throw new Error('Не удалось обновить задачу');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const docRef = doc(this.db, this.COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return false;

      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Ошибка при удалении задачи из Firebase:', error);
      throw new Error('Не удалось удалить задачу');
    }
  }

  async filter(filter: TaskFilter): Promise<Task[]> {
    try {
      let q = query(collection(this.db, this.COLLECTION_NAME));

      if (filter.status && filter.status.length > 0) {
        q = query(q, where('status', 'in', filter.status));
      }
    
      if (filter.dateFrom) {
        q = query(q, where('date', '>=', filter.dateFrom));
      }
      if (filter.dateTo) {
        q = query(q, where('date', '<=', filter.dateTo));
      }

      if (filter.tags && filter.tags.length > 0) {
        q = query(q, where('tags', 'array-contains-any', filter.tags));
      }

      const querySnapshot = await getDocs(q);
      let tasks = querySnapshot.docs.map((doc) =>
        this.taskFromFirestore(doc.id, doc.data()),
      );

      if (filter.text) {
        const searchText = filter.text.toLowerCase();
        tasks = tasks.filter((task) => {
          const titleMatch = task.title.toLowerCase().includes(searchText);
          const descriptionMatch = task.description
            ?.toLowerCase()
            .includes(searchText);
          return titleMatch || descriptionMatch;
        });
      }

      return tasks;
    } catch (error) {
      console.error('Ошибка при фильтрации задач в Firebase:', error);
      throw new Error('Не удалось отфильтровать задачи');
    }
  }

  async clear(): Promise<void> {
    try {
      const querySnapshot = await getDocs(
        collection(this.db, this.COLLECTION_NAME),
      );
      const batch = writeBatch(this.db);

      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Ошибка при очистке коллекции Firebase:', error);
      throw new Error('Не удалось очистить задачи');
    }
  }
}
