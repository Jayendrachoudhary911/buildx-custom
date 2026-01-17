// Firebase core
import { initializeApp } from "firebase/app";

// Firestore
import { getFirestore } from "firebase/firestore";

// Authentication (optional but recommended)
import { getAuth } from "firebase/auth";

// Analytics (optional, browser only)
import { getAnalytics, isSupported } from "firebase/analytics";

/* ================= FIREBASE CONFIG ================= */

/*
IMPORTANT:
Use environment variables in production.
Never hardcode real keys in public repos.
*/

const firebaseConfig = {
apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

/* ================= INITIALIZE ================= */

const app = initializeApp(firebaseConfig);

/* ================= SERVICES ================= */

// Firestore Database
export const db = getFirestore(app);

// Firebase Authentication
export const auth = getAuth(app);

// Analytics (safe load)
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

export default app;
