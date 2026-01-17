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
  apiKey: "AIzaSyDy2dmvol33xFAptmFaI_tJmm4qI0a9CVk",
  authDomain: "codym-6bd19.firebaseapp.com",
  projectId: "codym-6bd19",
  storageBucket: "codym-6bd19.firebasestorage.app",
  messagingSenderId: "811312845188",
  appId: "1:811312845188:web:12d6d556d331387a60cdd1",
  measurementId: "G-SML1B89SL9"
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
