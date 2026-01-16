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
enableNetwork(db)
  .then(() => {
    console.log("✅ Firestore network enabled. Ready for real-time sync.");
    console.log("📡 Firebase Project ID:", firebaseConfig.projectId);
  })
  .catch((error) => {
    console.error("❌ Failed to enable Firestore network:", error);
    console.error("請檢查：");
    console.error("1. 網路連接是否正常");
    console.error("2. Firebase 專案是否啟用");
    console.error("3. Firestore 規則是否允許讀寫");
  });

export { db };