import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdnYZnRlaouz7fO66-SSPI5mTevrcbNC4",
  authDomain: "pickle-business-b1b0e.firebaseapp.com",
  projectId: "pickle-business-b1b0e",
  storageBucket: "pickle-business-b1b0e.firebasestorage.app",
  messagingSenderId: "451508968397",
  appId: "1:451508968397:web:615b26b5b666c0634d0284",
  measurementId: "G-YMWD3N3V91"
};

// Initialize Firebase (only once)
let app: FirebaseApp;
let analytics: Analytics | null = null;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Analytics only works in browser
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, analytics, auth, db };
