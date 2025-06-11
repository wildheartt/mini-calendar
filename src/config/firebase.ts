import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain',
  projectId: 'your-project-id',
  storageBucket: 'your-storage-bucket',
  messagingSenderId: 'your-messaging-sender-id',
  appId: 'your-app-id',
};

export class FirebaseConfig {
  private static app: FirebaseApp | null = null;
  private static db: Firestore | null = null;

  static initialize(config: typeof firebaseConfig): void {
    this.app = initializeApp(config);
    this.db = getFirestore(this.app);
  }

  static getDb(): Firestore {
    if (!this.db) {
      throw new Error(
        'Firebase not initialized. Call FirebaseConfig.initialize() first.',
      );
    }
    return this.db;
  }

  static isInitialized(): boolean {
    return this.db !== null;
  }
}

export { firebaseConfig };
