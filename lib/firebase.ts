
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Helper to get env vars safely from either Vite or Create React App environments
const getEnvVar = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[`VITE_${key}`]) {
    // @ts-ignore
    return import.meta.env[`VITE_${key}`];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[`REACT_APP_${key}`]) {
    // @ts-ignore
    return process.env[`REACT_APP_${key}`];
  }
  return '';
};

const firebaseConfig = {
  apiKey: getEnvVar('FIREBASE_API_KEY') || 'AIzaSyD3NLWTzYCjIhw29GQb9Mq1S3cXI8UklYA',
  authDomain: getEnvVar('FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('FIREBASE_APP_ID')
};

// Only initialize if we have at least an API key to avoid crash
const isConfigValid = !!firebaseConfig.apiKey;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isConfigValid) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.warn("Firebase configuration is missing or incomplete. App running in Demo/Offline mode.");
}

export { app, auth, db };
export default app;
