import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence, 
  browserSessionPersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDrpa5WaFmBtV-Eto9iO9OFZB604B_PPJg",
  authDomain: "gen-lang-client-0827578716.firebaseapp.com",
  projectId: "gen-lang-client-0827578716",
  storageBucket: "gen-lang-client-0827578716.firebasestorage.app",
  messagingSenderId: "356741692732",
  appId: "1:356741692732:web:414b90817cbce24c9df239"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Use browser session/local persistence
setPersistence(auth, browserSessionPersistence).catch((err) => {
  console.error("Firebase Auth persistence error:", err);
});

// Initialize Firestore with custom database ID from config
export const db = getFirestore(app, "ai-studio-tnbnews-7479c9ab-37b5-4c08-812a-e67341f5b303");

export default app;
