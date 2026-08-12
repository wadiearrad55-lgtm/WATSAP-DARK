import React, { useState, useEffect } from 'react';
import { X, Plus, ChevronRight, ChevronLeft, Send, Sparkles, Image, Check } from 'lucide-react';
import { StatusStory, User } from '../types';

interface StatusViewerProps {
  statuses: StatusStory[];
  currentUser: User;
  onClose: () => void;
  onAddStatus: (status: Partial<StatusStory>) => void;
  onReplyStatus: (status: StatusStory, replyText: string) => void;
  isDarkMode: boolean;
}

export const StatusViewer: React.FC<StatusViewerProps> = ({
  statuses,
  currentUser,
  onClose,
  onAddStatus,
  onReplyStatus,
  isDarkMode,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [newStatusText, setNewStatusText] = useState('');
  const [newStatusBg, setNewStatusBg] = useState('from-emerald-600 to-teal-800');

  const currentStory = statuses[currentIndex];

  // Auto advance story timer
  useEffect(() => {
    if (showCreateModal || !currentStory) return;
    const timer = setTimeout(() => {
      if (currentIndex < statuses.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, statuses, showCreateModal]);

  const handleCreateStatus = () => {
    if (!newStatusText.trim()) return;
    onAddStatus({
      text: newStatusText,
      backgroundColor: newStatusBg,
      type: 'text',
      viewed: true,
    });
    setNewStatusText('');
    setShowCreateModal(false);
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !currentStory) return;
    onReplyStatus(currentStory, replyText);
    setReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 text-white flex flex-col justify-between p-4 select-none backdrop-blur-md">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold shadow"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة حالة جديدة</span>
          </button>
        </div>

        {currentStory && (
          <div className="flex items-center gap-3">
            <img
              src={currentStory.userAvatar}
              alt={currentStory.userName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
            />
            <div className="text-right">
              <h3 className="font-bold text-sm">{currentStory.userName}</h3>
              <p className="text-[11px] text-gray-300">{currentStory.timestamp}</p>
            </div>
          </div>
        )}
      </div>

      {/* Story Progress Indicators */}
      <div className="flex items-center gap-1.5 my-2 z-20 max-w-xl mx-auto w-full">
        {statuses.map((_, idx) => (
          <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className={`h-full bg-white transition-all duration-300 ${
                idx < currentIndex ? 'w-full' : idx === currentIndex ? 'w-full animate-pulse' : 'w-0'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Main Story Content Viewer */}
      <div className="flex-1 flex items-center justify-center relative my-4">
        {/* Navigation Buttons */}
        {currentIndex > 0 && (
          <button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="absolute left-4 z-30 p-3 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {currentIndex < statuses.length - 1 && (
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            className="absolute right-4 z-30 p-3 bg-black/40 hover:bg-black/60 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Story Body */}
        {currentStory ? (
          currentStory.type === 'image' ? (
            <div className="relative max-h-[75vh] max-w-lg w-full flex flex-col items-center justify-center">
              <img
                src={currentStory.mediaUrl}
                alt="Status"
                className="max-h-[70vh] rounded-2xl object-contain shadow-2xl"
              />
              {currentStory.caption && (
                <p className="mt-3 px-4 py-2 bg-black/60 backdrop-blur rounded-xl text-sm font-medium text-center">
                  {currentStory.caption}
                </p>
              )}
            </div>
          ) : (
            <div className={`w-full max-w-md h-[60vh] rounded-3xl p-8 flex items-center justify-center text-center shadow-2xl bg-gradient-to-br ${
              currentStory.backgroundColor || 'from-emerald-600 to-teal-800'
            }`}>
              <p className="text-xl md:text-2xl font-bold leading-relaxed">
                {currentStory.text}
              </p>
            </div>
          )
        ) : (
          <div className="text-center text-gray-400">لا توجد حالات حالياً</div>
        )}
      </div>

      {/* Story Reply Input */}
      {currentStory && (
        <div className="max-w-md mx-auto w-full z-20 flex items-center gap-2">
          <input
            type="text"
            placeholder={`الرد على حالة ${currentStory.userName}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 bg-white/10 backdrop-blur px-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-white/20"
          />
          <button
            onClick={handleSendReply}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      )}

      {/* Create New Status Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="bg-[#202c33] rounded-3xl p-6 w-full max-w-md text-right space-y-4 border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-emerald-400">إضافة حالة جديدة</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              rows={4}
              placeholder="اكتب ماذا يدور في ذهنك..."
              value={newStatusText}
              onChange={(e) => setNewStatusText(e.target.value)}
              className="w-full bg-[#111b21] border border-gray-700 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
            />

            <div>
              <p className="text-xs text-gray-400 mb-2">اختر لون الخلفية:</p>
              <div className="flex items-center gap-2">
                {[
                  'from-emerald-600 to-teal-800',
                  'from-blue-600 to-indigo-800',
                  'from-purple-600 to-pink-800',
                  'from-amber-600 to-rose-700',
                ].map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setNewStatusBg(bg)}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${bg} ring-2 ${
                      newStatusBg === bg ? 'ring-white' : 'ring-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-gray-300 hover:bg-white/10"
              >
                إلغاء
              </button>
              <button
                onClick={handleCreateStatus}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow"
              >
                نشر الحالة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
