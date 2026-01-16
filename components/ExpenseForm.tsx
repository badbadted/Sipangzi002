import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Plus, Calendar, Tag, DollarSign, FileText, UserCircle, CreditCard, ChevronDown } from 'lucide-react';
import { Expense, PaymentMethod, User, Category } from '../types';
import { PAYMENT_METHOD_LABELS, getCategoryLabel } from '../constants';

interface ExpenseFormProps {
  users: User[];
  categories: Category[];
  expenses: Expense[]; // 添加 expenses 以獲取歷史描述
  onAddExpense: (expense: Omit<Expense, 'id' | 'timestamp'>) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ users, categories, expenses, onAddExpense }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(categories[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [userId, setUserId] = useState(users[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [showDescriptionDropdown, setShowDescriptionDropdown] = useState(false);
  const [filteredDescriptions, setFilteredDescriptions] = useState<string[]>([]);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 從歷史支出中提取所有唯一的描述（根據當前選擇的類別過濾）
  const uniqueDescriptions = useMemo(() => {
    const descriptions = new Set<string>();
    // 只提取與當前類別相同的歷史描述
    expenses
      .filter(exp => exp.category === category)
      .forEach(exp => {
        if (exp.description && exp.description.trim()) {
          descriptions.add(exp.description.trim());
        }
      });
    return Array.from(descriptions).sort();
  }, [expenses, category]);

  // 根據輸入過濾描述
  useEffect(() => {
    if (description.trim() === '') {
      const top10 = uniqueDescriptions.slice(0, 10);
      setFilteredDescriptions(top10);
      setShowDescriptionDropdown(false);
    } else {
      const filtered = uniqueDescriptions
        .filter(desc => desc.toLowerCase().includes(description.toLowerCase()))
        .slice(0, 10);
      setFilteredDescriptions(filtered);
      setShowDescriptionDropdown(filtered.length > 0);
    }
  }, [description, uniqueDescriptions]);

  // 點擊外部關閉下拉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        descriptionInputRef.current &&
        !descriptionInputRef.current.contains(event.target as Node)
      ) {
        setShowDescriptionDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !userId) return;

    onAddExpense({
      amount: parseFloat(amount),
      description,
      category,
      date,
      userId,
      paymentMethod
    });

    // Reset form partially
    setAmount('');
    setDescription('');
    // 不重置 category，保持當前選擇
  };

  // 當類別改變時，清空描述以顯示新的類別相關描述
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setDescription(''); // 清空描述，讓用戶選擇新類別的歷史描述
    setShowDescriptionDropdown(false);
  };

  // 當 categories 改變時，更新預設類別
  useEffect(() => {
    if (categories.length > 0 && (!category || !categories.find(c => c.id === category))) {
      setCategory(categories[0].id);
    }
  }, [categories, category]);

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

        {/* Description with autocomplete */}
        <div className="space-y-2 relative">
          <label className="text-sm font-bold text-gray-700 ml-1">描述 📝</label>
          <div className="relative group">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
            <input
              ref={descriptionInputRef}
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setShowDescriptionDropdown(true);
              }}
              onFocus={() => {
                if (uniqueDescriptions.length > 0) {
                  if (description.trim() === '') {
                    setFilteredDescriptions(uniqueDescriptions.slice(0, 10));
                  }
                  setShowDescriptionDropdown(true);
                }
              }}
              placeholder={`您買了什麼？(${getCategoryLabel(category, categories)}類別的歷史記錄)`}
              required
              list="description-list"
              className="w-full pl-12 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all font-bold text-gray-800"
            />
            {uniqueDescriptions.length > 0 && (
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            )}
            
            {/* 自定義下拉選單 */}
            {showDescriptionDropdown && filteredDescriptions.length > 0 && (
              <div 
                ref={dropdownRef}
                className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto"
              >
                {filteredDescriptions.map((desc, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setDescription(desc);
                      setShowDescriptionDropdown(false);
                      descriptionInputRef.current?.focus();
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0 font-bold text-gray-700"
                  >
                    {desc}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* HTML5 datalist 作為備用 */}
          <datalist id="description-list">
            {uniqueDescriptions.map((desc, index) => (
              <option key={index} value={desc} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">類別 🏷️</label>
            <div className="relative group">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all appearance-none text-gray-800 font-bold"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">支付方式 💳</label>
            <div className="relative group">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-0 outline-none transition-all appearance-none text-gray-800 font-bold"
              >
                {Object.values(PaymentMethod).map((method) => (
                  <option key={method} value={method}>{PAYMENT_METHOD_LABELS[method]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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