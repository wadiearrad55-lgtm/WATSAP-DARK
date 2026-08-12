import React, { useState } from 'react';
import { X, Camera, Check, Edit2, UserCheck } from 'lucide-react';
import { User } from '../types';

interface ProfileDrawerProps {
  currentUser: User;
  onClose: () => void;
  onUpdateProfile: (updated: Partial<User>) => void;
  isDarkMode: boolean;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  currentUser,
  onClose,
  onUpdateProfile,
  isDarkMode,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [statusText, setStatusText] = useState(currentUser.statusText);
  const [avatar, setAvatar] = useState(currentUser.avatar);

  const handleSave = () => {
    onUpdateProfile({ name, statusText, avatar });
    onClose();
  };

  const handleAvatarChange = () => {
    const newAvatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80&rand=${Date.now()}`;
    setAvatar(newAvatar);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-start backdrop-blur-xs select-none">
      <div className={`w-full max-w-sm h-full flex flex-col shadow-2xl transition-all ${
        isDarkMode ? 'bg-[#111b21] text-gray-100' : 'bg-white text-gray-800'
      }`}>
        {/* Drawer Header */}
        <div className={`px-4 py-5 flex items-center gap-4 ${
          isDarkMode ? 'bg-[#202c33]' : 'bg-[#008069]'
        } text-white`}>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-base">الملف الشخصي</h2>
        </div>

        {/* Profile Avatar Edit */}
        <div className="p-6 flex flex-col items-center justify-center space-y-4 border-b border-gray-500/10">
          <div className="relative group cursor-pointer" onClick={handleAvatarChange}>
            <img
              src={avatar}
              alt={name}
              className="w-32 h-32 rounded-full object-cover ring-4 ring-emerald-500/30 group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs gap-1">
              <Camera className="w-6 h-6" />
              <span>تغيير الصورة</span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400">انقر على الصورة لتحديثها تلقائياً</p>
        </div>

        {/* Profile Info Form */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-500">اسمك:</label>
            <div className="flex items-center gap-2 border-b py-2 border-gray-500/20">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none font-medium"
              />
              <Edit2 className="w-4 h-4 text-gray-400 shrink-0" />
            </div>
            <p className="text-[10px] text-gray-400 pt-1">
              هذا ليس اسم المستخدم الخاص بك أو رقم التعريف. سيرى جهات اتصالك هذا الاسم في واتساب.
            </p>
          </div>

          {/* Status/About Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-500">الأخبار (عنك):</label>
            <div className="flex items-center gap-2 border-b py-2 border-gray-500/20">
              <input
                type="text"
                value={statusText}
                onChange={(e) => setStatusText(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none font-medium"
              />
              <Edit2 className="w-4 h-4 text-gray-400 shrink-0" />
            </div>
          </div>

          {/* Phone Info */}
          <div className="space-y-1 pt-2">
            <label className="text-xs font-bold text-gray-400">رقم الهاتف:</label>
            <p className="text-sm font-mono text-gray-400">{currentUser.phone}</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="p-4 border-t border-gray-500/10">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Check className="w-5 h-5" />
            <span>حفظ التغييرات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
