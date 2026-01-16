import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Trash2, Tag, CreditCard } from 'lucide-react';
import { Expense, User, PaymentMethod, Category } from '../types';
import { getCategoryColor, getCategoryLabel } from '../constants';

interface CreditCardViewProps {
  expenses: Expense[];
  users: User[];
  categories: Category[];
  onDeleteExpense: (id: string) => void;
}

const CreditCardView: React.FC<CreditCardViewProps> = ({ 
  expenses, 
  users, 
  categories, 
  onDeleteExpense 
}) => {
  
  // 只統計信用卡支出
  const creditCardExpenses = useMemo(() => 
    expenses.filter(e => e.paymentMethod === PaymentMethod.CREDIT_CARD), 
    [expenses]
  );
  
  // 總信用卡支出
  const totalCreditCardSpent = useMemo(() => 
    creditCardExpenses.reduce((acc, curr) => acc + curr.amount, 0), 
    [creditCardExpenses]
  );
  
  // 本月信用卡支出
  const currentMonthCreditCardSpent = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return creditCardExpenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [creditCardExpenses]);

  // 每日信用卡支出統計
  const dailyData = useMemo(() => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const data: { date: string; amount: number }[] = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
        data.push({
            date: `${i}日`,
            amount: 0
        });
    }

    creditCardExpenses.forEach(e => {
        const d = new Date(e.date);
        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
            const day = d.getDate();
            if (data[day - 1]) {
                data[day - 1].amount += e.amount;
            }
        }
    });

    return data;
  }, [creditCardExpenses]);

  // 分類統計
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    creditCardExpenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.keys(map).map(key => ({
      name: getCategoryLabel(key, categories),
      originalKey: key,
      value: map[key],
      color: getCategoryColor(key, categories)
    })).filter(item => item.value > 0);
  }, [creditCardExpenses, categories]);

  // 成員統計
  const userStats = useMemo(() => {
      const map: Record<string, number> = {};
      creditCardExpenses.forEach(e => {
          map[e.userId] = (map[e.userId] || 0) + e.amount;
      });
      return Object.keys(map).map(uid => ({
          name: users.find(u => u.id === uid)?.name || '未知',
          value: map[uid],
          color: users.find(u => u.id === uid)?.color || '#ccc'
      }));
  }, [creditCardExpenses, users]);

  // 排序支出列表
  const sortedExpenses = useMemo(() => {
    return [...creditCardExpenses].sort((a, b) => {
      const dateComp = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateComp !== 0) return dateComp;
      return b.timestamp - a.timestamp;
    });
  }, [creditCardExpenses]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-500 p-6 monster-card monster-shadow text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">💳</div>
          <h3 className="text-indigo-100 text-sm font-bold uppercase tracking-wider">信用卡總計</h3>
          <p className="text-4xl font-bold mt-2">${totalCreditCardSpent.toLocaleString()}</p>
          <p className="text-indigo-100 text-xs mt-1">共 {creditCardExpenses.length} 筆</p>
        </div>
        <div className="bg-indigo-600 p-6 monster-card monster-shadow text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">📅</div>
          <h3 className="text-indigo-100 text-sm font-bold uppercase tracking-wider">本月信用卡支出</h3>
          <p className="text-4xl font-bold mt-2">${currentMonthCreditCardSpent.toLocaleString()}</p>
          <p className="text-indigo-100 text-xs mt-1">獨立統計，不列入總支出</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Trend */}
        <div className="bg-white p-6 monster-card monster-shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📊 每日信用卡支出 <span className="text-sm font-normal text-gray-500">(本月)</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '2px solid #6366F1', boxShadow: '4px 4px 0px #6366F1' }}
                    cursor={{fill: '#EEF2FF'}}
                />
                <Bar dataKey="amount" fill="#6366F1" radius={[8, 8, 8, 8]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 monster-card monster-shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-6">🍰 信用卡開銷分類</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#999'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '2px solid #6366F1' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Breakdown */}
      <div className="bg-white p-6 monster-card monster-shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-6">👥 成員信用卡支出</h3>
        <div className="space-y-4">
            {userStats.map(stat => (
                <div key={stat.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-gray-200 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{backgroundColor: stat.color}}></div>
                        <span className="text-gray-700 font-bold">{stat.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-100">
                          <div 
                              className="h-full rounded-full" 
                              style={{ width: `${totalCreditCardSpent > 0 ? (stat.value / totalCreditCardSpent) * 100 : 0}%`, backgroundColor: stat.color }}
                          ></div>
                      </div>
                      <span className="text-gray-900 font-bold w-20 text-right text-lg">${stat.value.toLocaleString()}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white rounded-3xl monster-card monster-shadow overflow-hidden">
        <div className="px-6 py-5 border-b-2 border-gray-100 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              💳 信用卡交易記錄
          </h2>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1.5 rounded-full border border-indigo-200">
              共 {creditCardExpenses.length} 筆
          </span>
        </div>
        
        {sortedExpenses.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="bg-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-4xl">
              💳
            </div>
            <h3 className="text-gray-800 font-bold text-xl">尚無信用卡支出紀錄</h3>
            <p className="text-gray-500 mt-2 font-medium">還沒有使用信用卡消費的記錄</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-gray-100 max-h-[600px] overflow-y-auto p-2">
            {sortedExpenses.map((expense) => {
              const user = users.find(u => u.id === expense.userId);
              const color = getCategoryColor(expense.category, categories);
              const categoryLabel = getCategoryLabel(expense.category, categories);
              
              return (
                <div key={expense.id} className="p-4 hover:bg-indigo-50 transition-colors flex items-center justify-between group rounded-2xl mx-2 my-1">
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
                        <span>•</span>
                        <span className="flex items-center gap-1 bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                          <CreditCard className="w-3 h-3" />
                          信用卡
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-indigo-600 text-xl">
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
        )}
      </div>
    </div>
  );
};

export default CreditCardView;
