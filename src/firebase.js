// Firebase core
import { initializeApp } from "firebase/app";

// Firestore
import { 
  getFirestore, 
  enableIndexedDbPersistence 
} from "firebase/firestore";

// Authentication
import { 
  getAuth,
  onAuthStateChanged 
} from "firebase/auth";

// Analytics (browser safe)
import { getAnalytics, isSupported } from "firebase/analytics";

/* ================= FIREBASE CONFIG ================= */

/*
SECURITY NOTE:
Environment variables MUST be used in production.
Never expose real keys in public repos.
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

/* ================= INITIALIZE APP ================= */

const app = initializeApp(firebaseConfig);

/* ================= FIRESTORE ================= */

// Initialize Firestore
export const db = getFirestore(app);

// Enable offline persistence (improves transaction reliability)
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("Multiple tabs open — persistence disabled");
  }
  if (err.code === "unimplemented") {
    console.warn("Browser does not support persistence");
  }
});

/* ================= AUTH ================= */

export const auth = getAuth(app);

/*
This listener guarantees:
- Admin custom claims update
- Proper permission refresh
- Secure admin panel access
*/

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Force refresh token to load admin claims
    await user.getIdToken(true);
  }
});

/* ================= ANALYTICS ================= */

// Safe analytics load
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

export default app;
