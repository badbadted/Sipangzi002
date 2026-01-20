import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, DollarSign, Repeat } from 'lucide-react';
import { FixedExpense } from '../types';

interface FixedExpenseManagerProps {
  fixedExpenses: FixedExpense[];
  onAddFixedExpense: (fixedExpense: Omit<FixedExpense, 'id' | 'timestamp'>) => void;
  onUpdateFixedExpense: (fixedExpense: FixedExpense) => void;
  onDeleteFixedExpense: (id: string) => void;
}

const FixedExpenseManager: React.FC<FixedExpenseManagerProps> = ({
  fixedExpenses,
  onAddFixedExpense,
  onUpdateFixedExpense,
  onDeleteFixedExpense,
}) => {
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');

  // 計算總額
  const totalAmount = useMemo(() => {
    return fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [fixedExpenses]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAmount.trim()) {
      alert('請填寫項目名稱和金額！');
      return;
    }

    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('金額必須是大於 0 的數字！');
      return;
    }

    onAddFixedExpense({
      name: newName.trim(),
      amount: amount,
    });

    setNewName('');
    setNewAmount('');
  };

  const handleStartEdit = (expense: FixedExpense) => {
    setEditingId(expense.id);
    setEditName(expense.name);
    setEditAmount(expense.amount.toString());
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim() || !editAmount.trim()) {
      alert('請填寫項目名稱和金額！');
      return;
    }

    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('金額必須是大於 0 的數字！');
      return;
    }

    const expense = fixedExpenses.find(e => e.id === id);
    if (!expense) return;

    onUpdateFixedExpense({
      ...expense,
      name: editName.trim(),
      amount: amount,
    });

    setEditingId(null);
    setEditName('');
    setEditAmount('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditAmount('');
  };

  const handleDelete = (id: string) => {
    const expense = fixedExpenses.find(e => e.id === id);
    if (!expense) return;

    if (confirm(`確定要刪除「${expense.name}」嗎？`)) {
      onDeleteFixedExpense(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 monster-card monster-shadow text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">💰</div>
        <h3 className="text-purple-100 text-sm font-bold uppercase tracking-wider mb-2">每月固定支出總額</h3>
        <p className="text-5xl font-black mt-2">${totalAmount.toLocaleString()}</p>
        <p className="text-purple-100 text-sm mt-2">共 {fixedExpenses.length} 個項目</p>
      </div>

      {/* Add Form */}
      <div className="bg-white p-6 monster-card monster-shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="bg-secondary text-white p-1.5 rounded-lg">
            <Plus className="w-5 h-5" />
          </div>
          新增固定支出項目
        </h2>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">項目名稱 📝</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="例如：房租、水電費、網路費..."
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all font-bold text-gray-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">金額 💰</label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all font-bold text-gray-800"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primaryLight text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 monster-shadow-sm active:translate-y-0.5 active:shadow-none"
          >
            <Plus className="w-6 h-6" />
            新增固定支出
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white p-6 monster-card monster-shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Repeat className="w-6 h-6 text-secondary" />
          固定支出項目列表
        </h2>

        {fixedExpenses.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="bg-purple-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 text-4xl">
              💳
            </div>
            <h3 className="text-gray-800 font-bold text-xl">尚無固定支出項目</h3>
            <p className="text-gray-500 mt-2 font-medium">開始新增您的每月固定支出吧！</p>
          </div>
        ) : (
          <div className="space-y-3">
          {fixedExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-gray-200 transition-colors group"
            >
              {editingId === expense.id ? (
                // Edit Mode
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary outline-none font-bold text-gray-800 bg-white"
                    placeholder="項目名稱"
                  />
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      step="0.01"
                      className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary outline-none font-bold text-gray-800 bg-white"
                      placeholder="金額"
                    />
                  </div>
                </div>
              ) : (
                // Display Mode
                <>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-sm border-2 border-white transform group-hover:scale-110 transition-transform">
                      <Repeat className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg">{expense.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">每月固定支出</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-xl">${expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      <p className="text-xs text-gray-500">/ 月</p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 ml-4">
                {editingId === expense.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(expense.id)}
                      className="text-green-600 hover:text-white hover:bg-green-500 p-2 rounded-xl transition-all shadow-sm"
                      title="儲存"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-white hover:bg-gray-500 p-2 rounded-xl transition-all shadow-sm"
                      title="取消"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartEdit(expense)}
                      className="text-gray-400 hover:text-blue-500 hover:bg-blue-50 p-2 rounded-xl transition-all shadow-sm"
                      title="編輯"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all shadow-sm"
                      title="刪除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FixedExpenseManager;
