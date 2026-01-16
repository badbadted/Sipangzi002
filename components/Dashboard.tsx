import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { ChevronDown, Users } from 'lucide-react';
import { Expense, User, PaymentMethod, Category } from '../types';
import { getCategoryColor, getCategoryLabel, PAYMENT_METHOD_LABELS } from '../constants';

interface DashboardProps {
  expenses: Expense[];
  users: User[];
  categories: Category[];
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, users, categories }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('all');
  
  // 根據選中的成員過濾支出
  const filteredExpenses = useMemo(() => {
    if (selectedUserId === 'all') {
      return expenses;
    }
    return expenses.filter(e => e.userId === selectedUserId);
  }, [expenses, selectedUserId]);
  
  // 現金統計（主要統計，信用卡不列入）
  const cashExpenses = useMemo(() => 
    filteredExpenses.filter(e => e.paymentMethod === PaymentMethod.CASH), 
    [filteredExpenses]
  );
  
  // 信用卡統計（獨立統計，不列入總支出）
  const creditCardExpenses = useMemo(() => 
    filteredExpenses.filter(e => e.paymentMethod === PaymentMethod.CREDIT_CARD), 
    [filteredExpenses]
  );
  
  // 總支出只統計現金（信用卡不列入）
  const totalSpent = useMemo(() => 
    cashExpenses.reduce((acc, curr) => acc + curr.amount, 0), 
    [cashExpenses]
  );
  
  const totalCashSpent = useMemo(() => 
    cashExpenses.reduce((acc, curr) => acc + curr.amount, 0), 
    [cashExpenses]
  );
  
  const totalCreditCardSpent = useMemo(() => 
    creditCardExpenses.reduce((acc, curr) => acc + curr.amount, 0), 
    [creditCardExpenses]
  );
  
  // 本月支出只統計現金（信用卡不列入）
  const currentMonthSpent = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return cashExpenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [cashExpenses]);
  
  const currentMonthCashSpent = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return cashExpenses
      .filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [cashExpenses]);
  
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

  // 每日支出統計（主要以現金為主）
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

    // 只統計現金支出（主要以現金為主）
    cashExpenses.forEach(e => {
        const d = new Date(e.date);
        if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
            const day = d.getDate();
            if (data[day - 1]) {
                data[day - 1].amount += e.amount;
            }
        }
    });

    return data;
  }, [cashExpenses]);

  // 分類統計只統計現金（信用卡不列入）
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    cashExpenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.keys(map).map(key => ({
      name: getCategoryLabel(key, categories),
      originalKey: key,
      value: map[key],
      color: getCategoryColor(key, categories)
    })).filter(item => item.value > 0);
  }, [cashExpenses, categories]);

  // 成員統計只統計現金（信用卡不列入）
  const userStats = useMemo(() => {
      const map: Record<string, number> = {};
      cashExpenses.forEach(e => {
          map[e.userId] = (map[e.userId] || 0) + e.amount;
      });
      return Object.keys(map).map(uid => ({
          name: users.find(u => u.id === uid)?.name || '未知',
          value: map[uid],
          color: users.find(u => u.id === uid)?.color || '#ccc'
      }));
  }, [cashExpenses, users]);


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Member Filter */}
      <div className="bg-white p-4 monster-card monster-shadow rounded-2xl">
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            篩選成員：
          </label>
          <div className="relative">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="appearance-none bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2 pr-10 font-bold text-gray-800 focus:border-primary focus:ring-0 outline-none transition-all cursor-pointer"
            >
              <option value="all">全部合計</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          {selectedUserId !== 'all' && (
            <span className="text-xs font-semibold text-primary bg-green-100 px-3 py-1 rounded-full">
              顯示：{users.find(u => u.id === selectedUserId)?.name || '未知'}
            </span>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 monster-card monster-shadow relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🦖</div>
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">總支出 (現金)</h3>
          <p className="text-4xl font-bold text-gray-800 mt-2">${totalSpent.toLocaleString()}</p>
          <p className="text-gray-400 text-xs mt-1">信用卡不列入</p>
        </div>
        <div className="bg-primary p-6 monster-card monster-shadow text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">🔥</div>
          <h3 className="text-emerald-100 text-sm font-bold uppercase tracking-wider">本月支出 (現金)</h3>
          <p className="text-4xl font-bold mt-2">${currentMonthSpent.toLocaleString()}</p>
          <p className="text-emerald-100 text-xs mt-1">信用卡不列入</p>
        </div>
        <div className="bg-emerald-500 p-6 monster-card monster-shadow text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">💵</div>
          <h3 className="text-emerald-100 text-sm font-bold uppercase tracking-wider">現金總計</h3>
          <p className="text-4xl font-bold mt-2">${totalCashSpent.toLocaleString()}</p>
          <p className="text-emerald-100 text-xs mt-1">本月: ${currentMonthCashSpent.toLocaleString()}</p>
        </div>
        <div className="bg-indigo-500 p-6 monster-card monster-shadow text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">💳</div>
          <h3 className="text-indigo-100 text-sm font-bold uppercase tracking-wider">信用卡總計</h3>
          <p className="text-4xl font-bold mt-2">${totalCreditCardSpent.toLocaleString()}</p>
          <p className="text-indigo-100 text-xs mt-1">本月: ${currentMonthCreditCardSpent.toLocaleString()}</p>
          <p className="text-indigo-100 text-xs mt-1">獨立統計</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Daily Trend */}
        <div className="bg-white p-6 monster-card monster-shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            📊 每日支出 <span className="text-sm font-normal text-gray-500">(本月，現金為主)</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#6B7280'}} axisLine={false} tickLine={false} />
                <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '2px solid #059669', boxShadow: '4px 4px 0px #059669' }}
                    cursor={{fill: '#ECFDF5'}}
                />
                <Bar dataKey="amount" fill="#10B981" radius={[8, 8, 8, 8]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 monster-card monster-shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-6">🍰 開銷分類</h3>
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
                <Tooltip contentStyle={{ borderRadius: '12px', border: '2px solid #059669' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* User Breakdown */}
       <div className="bg-white p-6 monster-card monster-shadow">
          <h3 className="text-xl font-bold text-gray-800 mb-6">👥 成員支出</h3>
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
                                style={{ width: `${totalSpent > 0 ? (stat.value / totalSpent) * 100 : 0}%`, backgroundColor: stat.color }}
                            ></div>
                        </div>
                        <span className="text-gray-900 font-bold w-20 text-right text-lg">${stat.value.toLocaleString()}</span>
                      </div>
                  </div>
              ))}
          </div>
       </div>
    </div>
  );
};

export default Dashboard;