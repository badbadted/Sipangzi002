import { initializeApp } from "firebase/app";
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  enableNetwork
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
// persistentLocalCache allows offline support but still syncs to server when online
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Ensure network is enabled for syncing to server
enableNetwork(db).catch((error) => {
  console.error("Failed to enable Firestore network:", error);
});

export { db };