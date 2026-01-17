import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  setDoc,
  getDocs,
  getDoc,
  Unsubscribe,
  QuerySnapshot,
  DocumentData
} from "firebase/firestore";
import { db } from "./firebase";
import { Expense, User, PaymentMethod, Category } from '../types';
import { INITIAL_USERS, DEFAULT_CATEGORIES } from '../constants';

const COLLECTIONS = {
  EXPENSES: 'expenses',
  USERS: 'users',
  CATEGORIES: 'categories',
};

// -- Expenses --

export const subscribeExpenses = (callback: (expenses: Expense[]) => void): Unsubscribe => {
  const q = query(collection(db, COLLECTIONS.EXPENSES), orderBy("timestamp", "desc"));
  
  // First, try to get data from server to ensure we have latest data
  getDocs(q).then((serverSnapshot) => {
    if (!serverSnapshot.empty || serverSnapshot.metadata.fromCache === false) {
      console.log("✅ 已從伺服器獲取最新支出資料");
    }
  }).catch((error) => {
    console.warn("⚠️ 無法從伺服器獲取資料，將使用快取:", error);
  });
  
  // Use onSnapshot to listen for real-time updates
  // This will trigger whenever data changes on the server
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const expenses: Expense[] = [];
    snapshot.forEach((doc) => {
      // We store the ID inside the document object for the app to use,
      // but Firestore also has the ID as doc.id.
      // We prioritize doc.id from Firestore as the source of truth.
      const data = doc.data();
      
      // 處理舊資料兼容性：如果沒有 paymentMethod，預設為現金
      let paymentMethod = PaymentMethod.CASH;
      if (data.paymentMethod) {
        // 確保 paymentMethod 是有效的 enum 值
        if (data.paymentMethod === PaymentMethod.CREDIT_CARD || 
            data.paymentMethod === 'CreditCard' || 
            data.paymentMethod === 'CREDIT_CARD') {
          paymentMethod = PaymentMethod.CREDIT_CARD;
        } else {
          paymentMethod = PaymentMethod.CASH;
        }
      }
      
      expenses.push({ 
        ...data, 
        id: doc.id,
        paymentMethod 
      } as Expense);
    });
    
    // Log sync status for debugging
    if (snapshot.metadata.fromCache) {
      console.warn("⚠️ Expenses loaded from cache. Waiting for server sync...");
      console.warn("   如果有其他用戶的資料未顯示，請檢查：");
      console.warn("   1. 網路連接是否正常");
      console.warn("   2. Firebase Firestore 規則是否允許讀取");
      console.warn("   3. Firebase 專案是否正常運作");
    } else {
      console.log("✅ Expenses synced from server. Count:", expenses.length);
      console.log("   資料已從 Firebase 伺服器同步");
      // 統計支付方式
      const cashCount = expenses.filter(e => e.paymentMethod === PaymentMethod.CASH).length;
      const creditCount = expenses.filter(e => e.paymentMethod === PaymentMethod.CREDIT_CARD).length;
      console.log(`   現金: ${cashCount} 筆, 信用卡: ${creditCount} 筆`);
    }
    
    // Log pending writes
    if (snapshot.metadata.hasPendingWrites) {
      console.log("⏳ 有待同步的寫入操作...");
    }
    
    // Always call callback, but log if it's from cache
    // 確保按照 timestamp 排序（最新的在前）
    const sortedExpenses = expenses.sort((a, b) => {
      if (b.timestamp !== a.timestamp) {
        return b.timestamp - a.timestamp;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    callback(sortedExpenses);
  }, (error) => {
    console.error("❌ Error fetching expenses: ", error);
    console.error("錯誤詳情:", error.code, error.message);
    
    // Show more specific error messages
    if (error.code === 'permission-denied') {
      alert("❌ 權限錯誤：請檢查 Firebase Firestore 規則是否允許讀取資料。\n\n請前往 Firebase Console → Firestore Database → Rules 設定規則。");
    } else if (error.code === 'unavailable') {
      alert("❌ 無法連接：Firebase 服務暫時不可用，請稍後再試。");
    } else {
      alert("❌ 無法連接到 Firebase，請檢查網路連線。\n錯誤：" + error.message);
    }
  });
};

export const addExpenseToDb = async (expense: Omit<Expense, 'id'>) => {
  try {
    console.log("📝 正在新增支出到 Firebase...", expense);
    console.log("支付方式:", expense.paymentMethod);
    
    // 確保 paymentMethod 存在，如果沒有則設為預設值
    const expenseData = {
      ...expense,
      paymentMethod: expense.paymentMethod || PaymentMethod.CASH
    };
    
    // We let Firestore generate the ID, or we can generate one if we want to setDoc
    // Here we use addDoc which auto-generates ID.
    const docRef = await addDoc(collection(db, COLLECTIONS.EXPENSES), expenseData);
    console.log("✅ Expense added with ID:", docRef.id);
    console.log("✅ 支出已成功寫入 Firebase，其他用戶將看到此更新");
    console.log("✅ 支付方式:", expenseData.paymentMethod);
    
    return docRef.id;
  } catch (e: any) {
    console.error("❌ Error adding expense: ", e);
    console.error("錯誤代碼:", e.code);
    console.error("錯誤訊息:", e.message);
    console.error("支出數據:", expense);
    
    if (e.code === 'permission-denied') {
      throw new Error("權限錯誤：請檢查 Firebase Firestore 規則是否允許寫入資料。");
    } else if (e.code === 'unavailable') {
      throw new Error("無法連接：Firebase 服務暫時不可用，請稍後再試。");
    }
    throw e;
  }
};

export const deleteExpenseFromDb = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.EXPENSES, id));
  } catch (e) {
    console.error("Error deleting expense: ", e);
    throw e;
  }
};

// -- Users --

export const subscribeUsers = (callback: (users: User[]) => void): Unsubscribe => {
  // We can order users by name or creation time if we added a timestamp field to User.
  // For now, default order.
  const q = collection(db, COLLECTIONS.USERS);
  
  // First, try to get data from server to ensure we have latest data
  getDocs(q).then((serverSnapshot) => {
    if (!serverSnapshot.empty || serverSnapshot.metadata.fromCache === false) {
      console.log("✅ 已從伺服器獲取最新使用者資料");
    }
  }).catch((error) => {
    console.warn("⚠️ 無法從伺服器獲取資料，將使用快取:", error);
  });
  
  // Use onSnapshot to listen for real-time updates
  // This will trigger whenever data changes on the server
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const users: User[] = [];
    snapshot.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id } as User);
    });
    
    // Log sync status for debugging
    if (snapshot.metadata.fromCache) {
      console.warn("⚠️ Users loaded from cache. Waiting for server sync...");
      console.warn("   如果有其他用戶的資料未顯示，請檢查：");
      console.warn("   1. 網路連接是否正常");
      console.warn("   2. Firebase Firestore 規則是否允許讀取");
      console.warn("   3. Firebase 專案是否正常運作");
    } else {
      console.log("✅ Users synced from server. Count:", users.length);
      console.log("   資料已從 Firebase 伺服器同步");
    }
    
    // Log pending writes
    if (snapshot.metadata.hasPendingWrites) {
      console.log("⏳ 有待同步的寫入操作...");
    }
    
    // If no users exist in DB (first run), we might want to return INITIAL_USERS
    // However, it's better to actually Initialize the DB with the default user if empty.
    // For the UI, if empty, we can fallback to INITIAL_USERS or show empty.
    // Let's rely on the App logic to handle empty states or seeding.
    callback(users);
  }, (error) => {
    console.error("❌ Error fetching users: ", error);
    console.error("錯誤詳情:", error.code, error.message);
    
    // Show more specific error messages
    if (error.code === 'permission-denied') {
      alert("❌ 權限錯誤：請檢查 Firebase Firestore 規則是否允許讀取資料。\n\n請前往 Firebase Console → Firestore Database → Rules 設定規則。");
    } else if (error.code === 'unavailable') {
      alert("❌ 無法連接：Firebase 服務暫時不可用，請稍後再試。");
    } else {
      alert("❌ 無法連接到 Firebase，請檢查網路連線。\n錯誤：" + error.message);
    }
  });
};

export const addUserToDb = async (user: User) => {
  try {
    console.log("📝 正在新增使用者到 Firebase...", user);
    
    // Use setDoc to preserve the UUID generated by the frontend if we want, 
    // or use addDoc. The app currently generates UUIDs for users.
    // To keep it simple and consistent with Expense, we use setDoc with the passed ID.
    const userRef = doc(db, COLLECTIONS.USERS, user.id);
    await setDoc(userRef, user);
    console.log("✅ User added with ID:", user.id);
    console.log("✅ 使用者已成功寫入 Firebase，其他用戶將看到此更新");
  } catch (e: any) {
    console.error("❌ Error adding user: ", e);
    console.error("錯誤代碼:", e.code);
    console.error("錯誤訊息:", e.message);
    
    if (e.code === 'permission-denied') {
      throw new Error("權限錯誤：請檢查 Firebase Firestore 規則是否允許寫入資料。");
    } else if (e.code === 'unavailable') {
      throw new Error("無法連接：Firebase 服務暫時不可用，請稍後再試。");
    }
    throw e;
  }
};

export const deleteUserFromDb = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.USERS, id));
  } catch (e) {
    console.error("Error deleting user: ", e);
    throw e;
  }
};

// Helper to seed initial data if needed (optional)
export const seedInitialUser = async () => {
  const initialUser = INITIAL_USERS[0];
  await addUserToDb(initialUser);
};

// -- Categories --

export const subscribeCategories = (callback: (categories: Category[]) => void): Unsubscribe => {
  const q = collection(db, COLLECTIONS.CATEGORIES);
  
  // First, try to get data from server
  getDocs(q).then((serverSnapshot) => {
    if (!serverSnapshot.empty || serverSnapshot.metadata.fromCache === false) {
      console.log("✅ 已從伺服器獲取最新類別資料");
    }
  }).catch((error) => {
    console.warn("⚠️ 無法從伺服器獲取類別資料，將使用快取:", error);
  });
  
  return onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
    const categories: Category[] = [];
    snapshot.forEach((doc) => {
      categories.push({ ...doc.data(), id: doc.id } as Category);
    });
    
    // Log sync status
    if (snapshot.metadata.fromCache) {
      console.warn("⚠️ Categories loaded from cache. Waiting for server sync...");
    } else {
      console.log("✅ Categories synced from server. Count:", categories.length);
    }
    
    // 如果沒有類別，使用預設類別
    if (categories.length === 0) {
      callback(DEFAULT_CATEGORIES);
    } else {
      callback(categories);
    }
  }, (error) => {
    console.error("❌ Error fetching categories: ", error);
    // 如果出錯，使用預設類別
    callback(DEFAULT_CATEGORIES);
  });
};

export const addCategoryToDb = async (category: Category) => {
  try {
    console.log("📝 正在新增類別到 Firebase...", category);
    const categoryRef = doc(db, COLLECTIONS.CATEGORIES, category.id);
    await setDoc(categoryRef, category);
    console.log("✅ Category added with ID:", category.id);
  } catch (e: any) {
    console.error("❌ Error adding category: ", e);
    if (e.code === 'permission-denied') {
      throw new Error("權限錯誤：請檢查 Firebase Firestore 規則是否允許寫入資料。");
    }
    throw e;
  }
};

export const updateCategoryInDb = async (category: Category) => {
  try {
    console.log("📝 正在更新類別...", category);
    const categoryRef = doc(db, COLLECTIONS.CATEGORIES, category.id);
    await setDoc(categoryRef, category);
    console.log("✅ Category updated with ID:", category.id);
  } catch (e: any) {
    console.error("❌ Error updating category: ", e);
    throw e;
  }
};

export const deleteCategoryFromDb = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
    console.log("✅ Category deleted with ID:", id);
  } catch (e) {
    console.error("❌ Error deleting category: ", e);
    throw e;
  }
};

// 檢查類別是否有使用中的支出記錄
export const checkCategoryInUse = (categoryId: string, expenses: Expense[]): boolean => {
  return expenses.some(exp => exp.category === categoryId);
};

// 初始化預設類別
export const seedInitialCategories = async () => {
  try {
    const existingCategories = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
    if (existingCategories.empty) {
      console.log("📝 初始化預設類別...");
      for (const category of DEFAULT_CATEGORIES) {
        await addCategoryToDb(category);
      }
    }
  } catch (e) {
    console.error("❌ Error seeding categories: ", e);
  }
};