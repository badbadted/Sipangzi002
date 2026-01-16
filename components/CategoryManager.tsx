import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { Category, Expense } from '../types';
import { USER_COLORS } from '../constants';
import { checkCategoryInUse } from '../services/storage';

interface CategoryManagerProps {
  categories: Category[];
  expenses: Expense[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onUpdateCategory: (category: Category) => void;
  onDeleteCategory: (id: string) => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  expenses,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(USER_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [editColor, setEditColor] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !newCategoryLabel.trim()) return;

    // 檢查名稱是否已存在
    if (categories.some(c => c.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      alert('此類別名稱已存在！');
      return;
    }

    onAddCategory({
      name: newCategoryName.trim(),
      label: newCategoryLabel.trim(),
      color: newCategoryColor,
    });

    setNewCategoryName('');
    setNewCategoryLabel('');
    setNewCategoryColor(USER_COLORS[0]);
  };

  const handleStartEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditLabel(category.label);
    setEditColor(category.color);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim() || !editLabel.trim()) return;

    // 檢查名稱是否與其他類別衝突
    const otherCategories = categories.filter(c => c.id !== id);
    if (otherCategories.some(c => c.name.toLowerCase() === editName.trim().toLowerCase())) {
      alert('此類別名稱已存在！');
      return;
    }

    onUpdateCategory({
      id,
      name: editName.trim(),
      label: editLabel.trim(),
      color: editColor,
    });

    setEditingId(null);
    setEditName('');
    setEditLabel('');
    setEditColor('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditLabel('');
    setEditColor('');
  };

  const handleDelete = (id: string) => {
    if (checkCategoryInUse(id, expenses)) {
      alert('此類別正在使用中，無法刪除！\n請先刪除或修改使用此類別的支出記錄。');
      return;
    }

    if (confirm('確定要刪除此類別嗎？')) {
      onDeleteCategory(id);
    }
  };

  return (
    <div className="bg-white p-6 monster-card monster-shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Tag className="w-6 h-6 text-secondary" />
        管理類別
      </h2>

      {/* Add Category Form */}
      <form onSubmit={handleAdd} className="mb-8 p-4 bg-gray-50 rounded-2xl border-2 border-gray-200">
        <h3 className="text-sm font-bold text-gray-700 mb-4">新增類別</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-gray-600 ml-1 mb-1 block">名稱（英文）</label>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="例如: Food"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 outline-none font-bold text-gray-700"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-600 ml-1 mb-1 block">顯示標籤（中文）</label>
            <input
              type="text"
              value={newCategoryLabel}
              onChange={(e) => setNewCategoryLabel(e.target.value)}
              placeholder="例如: 飲食 🍔"
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-0 outline-none font-bold text-gray-700"
              required
            />
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-600 ml-1 mb-1 block">顏色</label>
              <div className="flex gap-1 flex-wrap">
                {USER_COLORS.slice(0, 6).map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewCategoryColor(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                      newCategoryColor === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'border-white'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primaryLight text-white px-4 py-2 rounded-xl font-bold transition-all monster-shadow-sm"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>

      {/* Category List */}
      <div className="space-y-3">
        {categories.map(category => {
          const isInUse = checkCategoryInUse(category.id, expenses);
          const isEditing = editingId === category.id;

          return (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-gray-200 transition-colors group"
            >
              {isEditing ? (
                <>
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-sm border-2 border-white"
                      style={{ backgroundColor: editColor }}
                    >
                      <Tag className="w-6 h-6" />
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-primary outline-none font-bold text-sm"
                        placeholder="名稱"
                      />
                      <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        className="px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-primary outline-none font-bold text-sm"
                        placeholder="標籤"
                      />
                      <div className="flex gap-1 items-center">
                        {USER_COLORS.slice(0, 6).map(c => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setEditColor(c)}
                            className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                              editColor === c ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : 'border-white'
                            }`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(category.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2 rounded-xl transition-all"
                      title="儲存"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-xl transition-all"
                      title="取消"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-sm border-2 border-white"
                      style={{ backgroundColor: category.color }}
                    >
                      <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-800 text-lg">{category.label}</div>
                      <div className="text-xs text-gray-500 font-semibold">{category.name}</div>
                      {isInUse && (
                        <div className="text-xs text-orange-600 font-bold mt-1">⚠️ 使用中</div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEdit(category)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-xl transition-all"
                      title="編輯"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={isInUse}
                      className={`p-2 rounded-xl transition-all ${
                        isInUse
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      }`}
                      title={isInUse ? '使用中，無法刪除' : '刪除'}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryManager;
