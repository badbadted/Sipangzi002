import React, { useState } from 'react';
import { Users, Plus, X } from 'lucide-react';
import { User } from '../types';
import { USER_COLORS } from '../constants';

interface UserManagerProps {
  users: User[];
  onAddUser: (name: string, color: string) => void;
  onDeleteUser: (id: string) => void;
}

const UserManager: React.FC<UserManagerProps> = ({ users, onAddUser, onDeleteUser }) => {
  const [newUserName, setNewUserName] = useState('');
  const [selectedColor, setSelectedColor] = useState(USER_COLORS[0]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    onAddUser(newUserName, selectedColor);
    setNewUserName('');
    // Pick a random next color
    setSelectedColor(USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)]);
  };

  return (
    <div className="bg-white p-6 monster-card monster-shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-secondary" />
        管理使用者
      </h2>

      {/* Add User Form */}
      <form onSubmit={handleAdd} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
                <input 
                    type="text" 
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="輸入名稱 (例如: 哥吉拉)"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-2xl focus:border-primary focus:ring-0 outline-none font-bold text-gray-700 bg-gray-50"
                />
            </div>
            
            <div className="flex items-center justify-between sm:justify-start gap-3 bg-gray-50 p-2 rounded-2xl border-2 border-gray-100">
                <div className="flex gap-1 overflow-x-auto p-1">
                    {USER_COLORS.slice(0, 5).map(c => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setSelectedColor(c)}
                            className={`w-8 h-8 rounded-full transition-transform hover:scale-110 border-2 border-white shadow-sm ${selectedColor === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                            style={{backgroundColor: c}}
                        />
                    ))}
                </div>
            </div>

            <button 
                type="submit"
                disabled={!newUserName.trim()}
                className="bg-primary hover:bg-primaryLight disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-bold transition-all monster-shadow-sm active:translate-y-0.5 active:shadow-none whitespace-nowrap"
            >
                新增
            </button>
        </div>
      </form>

      {/* User List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-transparent hover:border-gray-200 transition-colors group">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm border-2 border-white transform group-hover:rotate-12 transition-transform"
                style={{ backgroundColor: user.color }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-gray-700 text-lg">{user.name}</span>
            </div>
            
            {users.length > 1 && (
                <button 
                    onClick={() => onDeleteUser(user.id)}
                    className="text-gray-400 hover:text-red-500 bg-white hover:bg-red-50 p-2 rounded-xl transition-all shadow-sm"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManager;