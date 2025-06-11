import { Firestore } from 'firebase/firestore';
import { TaskRepository } from '../interfaces/TaskRepository';
import { LocalStorageTaskRepository } from '../repositories/LocalStorageTaskRepository';
import { FirebaseTaskRepository } from '../repositories/FirebaseTaskRepository';

export type RepositoryType = 'localStorage' | 'firebase';

export interface RepositoryConfig {
  type: RepositoryType;
  firebaseDb?: Firestore;
}

export class RepositoryFactory {
  static create(config: RepositoryConfig): TaskRepository {
    switch (config.type) {
      case 'localStorage':
        return new LocalStorageTaskRepository();

      case 'firebase':
        if (!config.firebaseDb) {
          throw new Error(
            'Firebase database instance required for Firebase repository',
          );
        }
        return new FirebaseTaskRepository(config.firebaseDb);

      default:
        throw new Error(`Unsupported repository type: ${config.type}`);
    }
  }

  static createLocalStorage(): TaskRepository {
    return new LocalStorageTaskRepository();
  }

  static createFirebase(db: Firestore): TaskRepository {
    return new FirebaseTaskRepository(db);
  }
}
