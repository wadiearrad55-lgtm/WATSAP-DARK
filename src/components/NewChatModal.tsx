import React, { useState } from 'react';
import { X, UserPlus, Users, MessageSquare, Bot } from 'lucide-react';
import { User } from '../types';

interface NewChatModalProps {
  onClose: () => void;
  onSelectUser: (user: User) => void;
  onCreateGroup: (name: string, members: User[]) => void;
  availableUsers: User[];
  isDarkMode: boolean;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  onClose,
  onSelectUser,
  onCreateGroup,
  availableUsers,
  isDarkMode,
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'group'>('single');
  const [groupName, setGroupName] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');

  const handleToggleUserSelect = (id: string) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter((u) => u !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUserIds.length === 0) return;
    const members = availableUsers.filter((u) => selectedUserIds.includes(u.id));
    onCreateGroup(groupName.trim(), members);
    onClose();
  };

  const handleCreateCustomContact = () => {
    if (!customName.trim()) return;
    const newUser: User = {
      id: `user_custom_${Date.now()}`,
      name: customName.trim(),
      phone: customPhone || '+966 50 000 0000',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customName)}`,
      statusText: 'متاح في واتساب',
      isOnline: true,
    };
    onSelectUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border text-right space-y-4 ${
        isDarkMode ? 'bg-[#202c33] border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
      }`}>
        <div className="flex items-center justify-between border-b pb-3 border-gray-500/10">
          <h3 className="font-bold text-base">بدء محادثة جديدة</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 p-1 bg-gray-500/10 rounded-2xl">
          <button
            onClick={() => setActiveTab('single')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'single'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            جهات الاتصال
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'group'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            مجموعة جديدة
          </button>
        </div>

        {activeTab === 'single' ? (
          <div className="space-y-4">
            {/* Quick Contact Add Form */}
            <div className={`p-3 rounded-2xl space-y-2 border ${
              isDarkMode ? 'bg-[#111b21] border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}>
              <p className="text-xs font-bold text-emerald-500">إضافة جهة اتصال جديدة بالاسم:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="الاسم كامل..."
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className={`flex-1 px-3 py-1.5 rounded-xl text-xs focus:outline-none border ${
                    isDarkMode ? 'bg-[#202c33] border-gray-700 text-white' : 'bg-white border-gray-200'
                  }`}
                />
                <button
                  onClick={handleCreateCustomContact}
                  disabled={!customName.trim()}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow"
                >
                  بدء
                </button>
              </div>
            </div>

            {/* List of existing contacts */}
            <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
              {availableUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u);
                    onClose();
                  }}
                  className={`p-2.5 rounded-2xl flex items-center gap-3 cursor-pointer transition-colors border ${
                    isDarkMode ? 'border-gray-800 hover:bg-[#111b21]' : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-xs flex items-center gap-1">
                      <span>{u.name}</span>
                      {u.isAI && <Bot className="w-3.5 h-3.5 text-blue-400" />}
                    </h4>
                    <p className="text-[11px] text-gray-400 truncate">{u.statusText}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Group Creation Form */
          <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">اسم المجموعة:</label>
              <input
                type="text"
                placeholder="اسم المجموعة (مثل: عائلة العز)..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className={`w-full px-4 py-2 rounded-xl text-xs focus:outline-none border ${
                  isDarkMode ? 'bg-[#111b21] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">اختر الأعضاء:</label>
              <div className="max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar">
                {availableUsers.filter((u) => !u.isAI).map((u) => {
                  const isSelected = selectedUserIds.includes(u.id);
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleToggleUserSelect(u.id)}
                      className={`p-2 rounded-xl flex items-center justify-between cursor-pointer text-xs border ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 font-bold'
                          : isDarkMode
                          ? 'border-gray-800 hover:bg-[#111b21]'
                          : 'border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                        <span>{u.name}</span>
                      </div>
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-500'
                      }`}>
                        {isSelected && '✓'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={!groupName.trim() || selectedUserIds.length === 0}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow"
            >
              إنشاء المجموعة
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
