import React from 'react';
import { Trash2, ShoppingBag, Car, Home, Film, ShoppingCart, HeartPulse, Zap, HelpCircle } from 'lucide-react';
import { Expense, ExpenseCategory, PaymentMethod, User } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../constants';

interface ExpenseListProps {
  expenses: Expense[];
  users: User[];
  onDeleteExpense: (id: string) => void;
}

const getCategoryIcon = (category: ExpenseCategory) => {
  switch (category) {
    case ExpenseCategory.FOOD: return <ShoppingBag className="w-5 h-5" />;
    case ExpenseCategory.TRANSPORT: return <Car className="w-5 h-5" />;
    case ExpenseCategory.HOUSING: return <Home className="w-5 h-5" />;
    case ExpenseCategory.ENTERTAINMENT: return <Film className="w-5 h-5" />;
    case ExpenseCategory.SHOPPING: return <ShoppingCart className="w-5 h-5" />;
    case ExpenseCategory.HEALTH: return <HeartPulse className="w-5 h-5" />;
    case ExpenseCategory.UTILITIES: return <Zap className="w-5 h-5" />;
    default: return <HelpCircle className="w-5 h-5" />;
  }
};

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, users, onDeleteExpense }) => {
  
  // 過濾掉信用卡支出，只顯示現金支出
  const cashExpenses = expenses.filter(e => e.paymentMethod === PaymentMethod.CASH);
  
  const sortedExpenses = [...cashExpenses].sort((a, b) => {
    const dateComp = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComp !== 0) return dateComp;
    return b.timestamp - a.timestamp;
  });

  if (sortedExpenses.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-gray-300 text-center flex flex-col items-center">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-4xl animate-bounce">
          🦖
        </div>
        <h3 className="text-gray-800 font-bold text-xl">尚無支出紀錄</h3>
        <p className="text-gray-500 mt-2 font-medium">怪獸肚子餓了，快餵它一些數據吧！</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl monster-card monster-shadow overflow-hidden">
      <div className="px-6 py-5 border-b-2 border-gray-100 flex justify-between items-center bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            📜 近期交易
        </h2>
        <span className="text-xs font-bold text-primary bg-green-100 px-3 py-1.5 rounded-full border border-green-200">
            共 {cashExpenses.length} 筆 (現金)
        </span>
      </div>
      
      <div className="divide-y-2 divide-gray-100 max-h-[600px] overflow-y-auto p-2">
        {sortedExpenses.map((expense) => {
          const user = users.find(u => u.id === expense.userId);
          const color = CATEGORY_COLORS[expense.category];
          const categoryLabel = CATEGORY_LABELS[expense.category] || expense.category;
          
          return (
            <div key={expense.id} className="p-4 hover:bg-green-50 transition-colors flex items-center justify-between group rounded-2xl mx-2 my-1">
              <div className="flex items-center gap-4">
                {/* Category Icon */}
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm border-2 border-white transform group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                >
                  {getCategoryIcon(expense.category)}
                </div>
                
                {/* Details */}
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{expense.description}</h4>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-1 flex-wrap">
                    <span 
                        className="px-2 py-0.5 rounded-md text-white" 
                        style={{backgroundColor: color}}
                    >
                        {categoryLabel}
                    </span>
                    <span>•</span>
                    <span>{expense.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 bg-gray-200 px-2 py-0.5 rounded-full">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: user?.color}}></div>
                      {user?.name || '未知'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-900 text-xl">
                  -${expense.amount.toFixed(2)}
                </span>
                <button 
                  onClick={() => onDeleteExpense(expense.id)}
                  className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all transform hover:rotate-12"
                  title="刪除"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExpenseList;