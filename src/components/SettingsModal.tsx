import React from 'react';
import { X, Moon, Sun, Bell, Volume2, Shield, Lock, Smartphone, Palette } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm select-none">
      <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border text-right space-y-5 ${
        isDarkMode ? 'bg-[#202c33] border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
      }`}>
        <div className="flex items-center justify-between border-b pb-3 border-gray-500/10">
          <h3 className="font-bold text-base">إعدادات تطبيق واتساب</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Theme setting option */}
          <div
            onClick={onToggleDarkMode}
            className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer border transition-colors ${
              isDarkMode ? 'border-gray-700 bg-[#111b21]' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 text-emerald-500 rounded-xl">
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-bold text-xs">المظهر والخلفية</h4>
                <p className="text-[11px] text-gray-400">
                  {isDarkMode ? 'الوضع الداكن (Dark Mode)' : 'الوضع المضيء (Light Mode)'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-500">تغيير</span>
          </div>

          {/* Notifications setting option */}
          <div className={`p-3.5 rounded-2xl flex items-center justify-between border ${
            isDarkMode ? 'border-gray-700 bg-[#111b21]' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 text-blue-500 rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs">الإشعارات والتنبيهات</h4>
                <p className="text-[11px] text-gray-400">أصوات الرسائل، التنبيهات المنبثقة</p>
              </div>
            </div>
            <span className="text-xs text-emerald-500 font-bold">مفعل</span>
          </div>

          {/* Privacy setting option */}
          <div className={`p-3.5 rounded-2xl flex items-center justify-between border ${
            isDarkMode ? 'border-gray-700 bg-[#111b21]' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 text-purple-500 rounded-xl">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs">الخصوصية والأمان</h4>
                <p className="text-[11px] text-gray-400">آخر ظهور، مؤشرات القراءة، المجموعات</p>
              </div>
            </div>
            <span className="text-xs text-emerald-500 font-bold">محمي</span>
          </div>
        </div>

        <div className="pt-2 text-center text-[11px] text-gray-400">
          WhatsApp Web Clone v2.5 • التشفير التام بين الطرفين 🔒
        </div>
      </div>
    </div>
  );
};
