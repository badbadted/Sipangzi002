import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager
} from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCO6_D9GGCzr5Rmpi5luPRAehIP9BExZ4",
  authDomain: "sipangzi002.firebaseapp.com",
  projectId: "sipangzi002",
  storageBucket: "sipangzi002.firebasestorage.app",
  messagingSenderId: "858055135743",
  appId: "1:858055135743:web:fb7de37ae4d4c6c3b357ca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore with offline persistence enabled
// This keeps the offline-first capability (caching) but removes the manual disableNetwork call
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export { db };