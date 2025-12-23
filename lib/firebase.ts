import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHpV--QSS0L1MNyRP7m2RD-uQyqY4EkAM",
  authDomain: "focusedu-4ccd1.firebaseapp.com",
  projectId: "focusedu-4ccd1",
  storageBucket: "focusedu-4ccd1.appspot.com",
  messagingSenderId: "694054386034",
  appId: "1:694054386034:web:d3d001d6799ca3cfb085eb",
};

// ✅ Prevent multiple Firebase initializations
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Authentication
export const auth = getAuth(app);

// ✅ Firestore Database (THIS WAS MISSING)
export const db = getFirestore(app);

// Optional default export
export default app;
