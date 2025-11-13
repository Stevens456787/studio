import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App | null = null;
let firestoreInstance: Firestore | null = null;

function initializeFirebaseAdmin(): Firestore | null {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  if (getApps().length > 0) {
    adminApp = getApps()[0]!;
    firestoreInstance = getFirestore(adminApp);
    return firestoreInstance;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[FieldAssist] Firebase Admin credentials missing. Falling back to local JSON storage. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY to enable Firestore.',
      );
    }
    return null;
  }

  adminApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  firestoreInstance = getFirestore(adminApp);
  return firestoreInstance;
}

export const adminFirestore = initializeFirebaseAdmin();
