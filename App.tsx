import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PieChart, Users, Menu, X, Tag, CreditCard } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Expense, User, ViewMode, Category } from './types';
import { 
  subscribeExpenses, 
  addExpenseToDb, 
  deleteExpenseFromDb, 
  subscribeUsers, 
  addUserToDb, 
  deleteUserFromDb,
  seedInitialUser,
  subscribeCategories,
  addCategoryToDb,
  updateCategoryInDb,
  deleteCategoryFromDb,
  seedInitialCategories
} from './services/storage';
import { INITIAL_USERS } from './constants';

import Dashboard from './components/Dashboard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import UserManager from './components/UserManager';
import CategoryManager from './components/CategoryManager';
import CreditCardView from './components/CreditCardView'; 

const App: React.FC = () => {
  // -- State --
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // -- Initialization & Subscriptions --
  useEffect(() => {
    // 1. Initialize categories
    seedInitialCategories().catch(console.error);

    // 2. Subscribe to Categories
    const unsubscribeCategories = subscribeCategories((newCategories) => {
      setCategories(newCategories);
    });

    // 3. Subscribe to Expenses
    const unsubscribeExpenses = subscribeExpenses((newExpenses) => {
      setExpenses(newExpenses);
      setIsLoading(false);
    });

    // 4. Subscribe to Users
    const unsubscribeUsers = subscribeUsers((newUsers) => {
      if (newUsers.length === 0) {
        // Seed if empty
        seedInitialUser().catch(console.error);
        setUsers(INITIAL_USERS);
      } else {
        setUsers(newUsers);
      }
    });

    return () => {
      unsubscribeCategories();
      unsubscribeExpenses();
      unsubscribeUsers();
    };
  }, []); 

  // -- Handlers --
  
  const handleAddExpense = async (expenseData: Omit<Expense, 'id' | 'timestamp'>) => {
    try {
      console.log('App: 準備新增支出:', expenseData);
      await addExpenseToDb({
        ...expenseData,
        timestamp: Date.now()
      });
      console.log('App: 支出新增成功');
    } catch (error: any) {
      console.error('App: 新增支出失敗:', error);
      const errorMessage = error?.message || '儲存失敗，請檢查網路連線。';
      alert(`❌ ${errorMessage}\n\n如果問題持續，請檢查：\n1. 網路連線是否正常\n2. Firebase 規則是否允許寫入\n3. 瀏覽器控制台是否有更多錯誤信息`);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpenseFromDb(id);
    } catch (error) {
      console.error(error);
      alert("刪除失敗。");
    }
  };

  const handleAddUser = async (name: string, color: string) => {
    const newUser: User = { id: uuidv4(), name, color };
    try {
      await addUserToDb(newUser);
    } catch (error) {
      console.error(error);
      alert("新增使用者失敗。");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUserFromDb(id);
    } catch (error) {
      console.error(error);
      alert("刪除使用者失敗。");
    }
  };

  const handleAddCategory = async (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      id: categoryData.name, // 使用名稱作為 ID
      ...categoryData,
    };
    try {
      await addCategoryToDb(newCategory);
    } catch (error) {
      console.error(error);
      alert("新增類別失敗。");
    }
  };

  const handleUpdateCategory = async (category: Category) => {
    try {
      await updateCategoryInDb(category);
    } catch (error) {
      console.error(error);
      alert("更新類別失敗。");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategoryFromDb(id);
    } catch (error) {
      console.error(error);
      alert("刪除類別失敗。");
    }
  };

  // -- Navigation Config --
  const navItems = [
    { id: 'dashboard', label: '總覽', icon: LayoutDashboard },
    { id: 'expenses', label: '記帳', icon: PieChart },
    { id: 'creditcard', label: '信用卡', icon: CreditCard },
    { id: 'users', label: '成員', icon: Users },
    { id: 'categories', label: '類別', icon: Tag },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex justify-between items-center shadow-md z-20 sticky top-0 border-b-2 border-emerald-100">
        <div className="font-bold text-xl text-primary flex items-center gap-2">
            <span className="text-3xl">🦖</span>
            <span className="tracking-tight">怪獸記帳本</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 bg-gray-50 rounded-xl">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-72 bg-white border-r-2 border-emerald-100 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col shadow-xl md:shadow-none
      `}>
        <div className="p-8">
          <div className="font-extrabold text-2xl text-primary flex items-center gap-3 mb-10 hidden md:flex">
             <div className="w-12 h-12 bg-emerald-100 text-3xl rounded-2xl flex items-center justify-center border-2 border-emerald-200">
                🦖
            </div>
            <div className="flex flex-col">
                <span className="leading-none">怪獸</span>
                <span className="text-secondary text-lg">記帳本</span>
            </div>
          </div>
          
          <nav className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id as ViewMode);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-4 px-6 py-4 rounded-3xl font-bold transition-all duration-200 border-2
                    ${isActive 
                      ? 'bg-primary text-white border-primary monster-shadow-sm translate-x-1' 
                      : 'bg-white text-gray-500 border-transparent hover:bg-emerald-50 hover:text-primary hover:border-emerald-100'}
                  `}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-current'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="mt-auto m-4 space-y-4">
           <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border-2 border-emerald-100">
              <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-emerald-200 flex items-center justify-center text-2xl shadow-sm">
                      {users[0]?.name === '我' ? '😎' : '👤'}
                  </div>
                  <div>
                      <p className="text-sm font-bold text-gray-800">{users[0]?.name || '使用者'}</p>
                      <p className="text-xs font-semibold text-emerald-600">{users.length} 位怪獸成員</p>
                  </div>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto max-h-screen scroll-smooth">
        <div className="max-w-5xl mx-auto space-y-8 pb-10">
          
          {/* Header */}
          <div className="flex flex-col gap-2">
             <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
                    {navItems.find(i => i.id === currentView)?.label}
                </h1>
             </div>
             <p className="text-gray-500 font-medium text-lg">
                {currentView === 'dashboard' && '歡迎回來！看看今天的戰果 🍖'}
                {currentView === 'expenses' && '紀錄每一筆開銷，別讓錢錢溜走 💸'}
                {currentView === 'creditcard' && '查看信用卡消費明細 💳'}
                {currentView === 'users' && '召集你的怪獸夥伴們 🦕'}
                {currentView === 'categories' && '管理支出類別，讓記帳更清晰 🏷️'}
             </p>
          </div>

          {/* Views */}
          {currentView === 'dashboard' && (
            <div className="space-y-8">
              <Dashboard expenses={expenses} users={users} categories={categories} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ExpenseList 
                    expenses={expenses.slice(0, 5)} 
                    users={users} 
                    categories={categories}
                    onDeleteExpense={handleDeleteExpense} 
                />
                 {/* Decorative Box */}
                 <div className="rounded-3xl p-8 text-white flex flex-col justify-center items-center text-center monster-shadow monster-card border-none relative overflow-hidden transition-colors duration-500 bg-secondary">
                     <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                     <div className="z-10">
                         <div className="text-6xl mb-4">
                             🦖
                         </div>
                         <h3 className="text-2xl font-bold mb-2">
                             怪獸記帳本
                         </h3>
                         <p className="text-white/80 font-medium">
                             您的每一筆紀錄，都讓怪獸變得更強壯！資料自動同步雲端。
                         </p>
                     </div>
                 </div>
              </div>
            </div>
          )}

          {currentView === 'expenses' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                    <ExpenseForm users={users} categories={categories} expenses={expenses} onAddExpense={handleAddExpense} />
                </div>
              </div>
              <div className="lg:col-span-2">
                <ExpenseList expenses={expenses} users={users} categories={categories} onDeleteExpense={handleDeleteExpense} />
              </div>
            </div>
          )}

          {currentView === 'users' && (
             <div className="max-w-3xl mx-auto">
                 <UserManager 
                    users={users} 
                    onAddUser={handleAddUser} 
                    onDeleteUser={handleDeleteUser} 
                 />
             </div>
          )}

          {currentView === 'categories' && (
             <div className="max-w-4xl mx-auto">
                 <CategoryManager 
                    categories={categories} 
                    expenses={expenses}
                    onAddCategory={handleAddCategory} 
                    onUpdateCategory={handleUpdateCategory}
                    onDeleteCategory={handleDeleteCategory} 
                 />
             </div>
          )}

          {currentView === 'creditcard' && (
             <div className="max-w-6xl mx-auto">
                 <CreditCardView 
                    expenses={expenses} 
                    users={users} 
                    categories={categories}
                    onDeleteExpense={handleDeleteExpense} 
                 />
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;