"use client";

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Only initialize if we have valid config (not during build)
function getFirebaseApp(): FirebaseApp | null {
  if (getApps().length > 0) {
    return getApp();
  }
  // Skip initialization if no API key (during build)
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "") {
    return null;
  }
  return initializeApp(firebaseConfig);
}

const app = getFirebaseApp();

// Export auth and db with type assertions
export const auth: Auth = app ? getAuth(app) : (null as unknown as Auth);
export const db: Firestore = app ? getFirestore(app) : (null as unknown as Firestore);

// Helper to check if Firebase is initialized
export const isFirebaseReady = () => app !== null;
