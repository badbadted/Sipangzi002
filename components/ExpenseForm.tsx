import React, { useState } from 'react';
import { Plus, Calendar, Tag, DollarSign, FileText, UserCircle } from 'lucide-react';
import { Expense, ExpenseCategory, User } from '../types';
import { CATEGORY_LABELS } from '../constants';

interface ExpenseFormProps {
  users: User[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ users, onAddExpense }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.FOOD);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [userId, setUserId] = useState(users[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !userId) return;

    onAddExpense({
      amount: parseFloat(amount),
      description,
      category,
      date,
      userId
    });

    // Reset form partially
    setAmount('');
    setDescription('');
  };

  return (
    <div className="bg-white p-6 monster-card monster-shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <div className="bg-secondary text-white p-1.5 rounded-lg">
          <Plus className="w-5 h-5" />
        </div>
        新增支出
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">金額 💰</label>
            <div className="relative group">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all font-bold text-gray-800"
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">日期 📅</label>
            <div className="relative group">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all font-bold text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">描述 📝</label>
          <div className="relative group">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="您買了什麼？"
              required
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all font-bold text-gray-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">類別 🏷️</label>
            <div className="relative group">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all appearance-none text-gray-800 font-bold"
              >
                {Object.values(ExpenseCategory).map((cat) => (
                  <option key={cat} value={cat}>{CATEGORY_LABELS[cat] || cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* User */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">付款人 🦖</label>
             <div className="relative group">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all appearance-none text-gray-800 font-bold"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
             </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary hover:bg-primaryLight text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 mt-2 monster-shadow-sm active:translate-y-0.5 active:shadow-none"
        >
          <Plus className="w-6 h-6" />
          新增支出
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;