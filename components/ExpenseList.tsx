import React, { useState, useMemo } from 'react';
import { Trash2, Tag, CreditCard, DollarSign, List } from 'lucide-react';
import { Expense, PaymentMethod, User, Category } from '../types';
import { getCategoryColor, getCategoryLabel, PAYMENT_METHOD_LABELS } from '../constants';

type FilterType = 'all' | 'cash' | 'creditcard';

interface ExpenseListProps {
  expenses: Expense[];
  users: User[];
  categories: Category[];
  onDeleteExpense: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, users, categories, onDeleteExpense }) => {
  const [filterType, setFilterType] = useState<FilterType>('cash');
  
  // 根據選擇的過濾類型過濾支出
  const filteredExpenses = useMemo(() => {
    switch (filterType) {
      case 'cash':
        return expenses.filter(e => e.paymentMethod === PaymentMethod.CASH);
      case 'creditcard':
        return expenses.filter(e => e.paymentMethod === PaymentMethod.CREDIT_CARD);
      case 'all':
      default:
        return expenses;
    }
  }, [expenses, filterType]);
  
  const sortedExpenses = useMemo(() => {
    return [...filteredExpenses].sort((a, b) => {
      const dateComp = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComp !== 0) return dateComp;
      return b.timestamp - a.timestamp;
    });
  }, [filteredExpenses]);

  // 統計各類型數量
  const cashCount = expenses.filter(e => e.paymentMethod === PaymentMethod.CASH).length;
  const creditCardCount = expenses.filter(e => e.paymentMethod === PaymentMethod.CREDIT_CARD).length;
  const totalCount = expenses.length;

  const getFilterLabel = () => {
    switch (filterType) {
      case 'cash':
        return `共 ${cashCount} 筆 (現金)`;
      case 'creditcard':
        return `共 ${creditCardCount} 筆 (信用卡)`;
      case 'all':
      default:
        return `共 ${totalCount} 筆 (全部)`;
    }
  };

  const getFilterColor = () => {
    switch (filterType) {
      case 'cash':
        return 'bg-green-100 border-green-200 text-primary';
      case 'creditcard':
        return 'bg-indigo-100 border-indigo-200 text-indigo-600';
      case 'all':
      default:
        return 'bg-gray-100 border-gray-200 text-gray-700';
    }
  };

  if (sortedExpenses.length === 0) {
    const emptyMessage = {
      cash: '尚無現金支出紀錄',
      creditcard: '尚無信用卡支出紀錄',
      all: '尚無支出紀錄'
    }[filterType];

    return (
      <div className="bg-white rounded-3xl monster-card monster-shadow overflow-hidden">
        <div className="px-6 py-5 border-b-2 border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            📜 近期交易
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('cash')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'cash' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <DollarSign className="w-3 h-3 inline mr-1" />
              現金
            </button>
            <button
              onClick={() => setFilterType('creditcard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'creditcard' 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CreditCard className="w-3 h-3 inline mr-1" />
              信用卡
            </button>
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === 'all' 
                  ? 'bg-gray-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List className="w-3 h-3 inline mr-1" />
              全部
            </button>
          </div>
        </div>
        <div className="p-12 text-center flex flex-col items-center">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-4xl animate-bounce">
            🦖
          </div>
          <h3 className="text-gray-800 font-bold text-xl">{emptyMessage}</h3>
          <p className="text-gray-500 mt-2 font-medium">怪獸肚子餓了，快餵它一些數據吧！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl monster-card monster-shadow overflow-hidden">
      <div className="px-6 py-5 border-b-2 border-gray-100 flex justify-between items-center bg-gray-50 flex-wrap gap-3">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          📜 近期交易
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('cash')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              filterType === 'cash' 
                ? 'bg-green-500 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <DollarSign className="w-3 h-3" />
            現金
          </button>
          <button
            onClick={() => setFilterType('creditcard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              filterType === 'creditcard' 
                ? 'bg-indigo-500 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <CreditCard className="w-3 h-3" />
            信用卡
          </button>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              filterType === 'all' 
                ? 'bg-gray-500 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <List className="w-3 h-3" />
            全部
          </button>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${getFilterColor()}`}>
            {getFilterLabel()}
          </span>
        </div>
      </div>
      
      <div className="divide-y-2 divide-gray-100 max-h-[600px] overflow-y-auto p-2">
        {sortedExpenses.map((expense) => {
          const user = users.find(u => u.id === expense.userId);
          const color = getCategoryColor(expense.category, categories);
          const categoryLabel = getCategoryLabel(expense.category, categories);
          
          const isCreditCard = expense.paymentMethod === PaymentMethod.CREDIT_CARD;
          const hoverColor = isCreditCard ? 'hover:bg-indigo-50' : 'hover:bg-green-50';
          const amountColor = isCreditCard ? 'text-indigo-600' : 'text-gray-900';
          
          return (
            <div key={expense.id} className={`p-4 ${hoverColor} transition-colors flex items-center justify-between group rounded-2xl mx-2 my-1`}>
              <div className="flex items-center gap-4">
                {/* Category Icon */}
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm border-2 border-white transform group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                >
                  <Tag className="w-5 h-5" />
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
                    {isCreditCard && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                          <CreditCard className="w-3 h-3" />
                          {PAYMENT_METHOD_LABELS[PaymentMethod.CREDIT_CARD]}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center gap-4">
                <span className={`font-bold ${amountColor} text-xl`}>
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