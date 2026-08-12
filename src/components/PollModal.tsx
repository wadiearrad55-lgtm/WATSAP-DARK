import React, { useState } from 'react';
import { X, Plus, Trash2, BarChart2 } from 'lucide-react';

interface PollModalProps {
  onClose: () => void;
  onCreatePoll: (question: string, options: string[]) => void;
  isDarkMode: boolean;
}

export const PollModal: React.FC<PollModalProps> = ({
  onClose,
  onCreatePoll,
  isDarkMode,
}) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, idx) => idx !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim() || validOptions.length < 2) return;

    onCreatePoll(question.trim(), validOptions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border text-right space-y-5 ${
        isDarkMode ? 'bg-[#202c33] border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
      }`}>
        <div className="flex items-center justify-between border-b pb-3 border-gray-500/10">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-base">إنشاء استطلاع رأي جديد</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">السؤال:</label>
            <input
              type="text"
              placeholder="اكتب السؤال هنا..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-2xl text-sm focus:outline-none border ${
                isDarkMode ? 'bg-[#111b21] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-400">الخيارات:</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`الخيار ${idx + 1}...`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className={`flex-1 px-4 py-2 rounded-xl text-xs focus:outline-none border ${
                    isDarkMode ? 'bg-[#111b21] border-gray-700 text-white' : 'bg-gray-50 border-gray-200'
                  }`}
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {options.length < 5 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 hover:text-emerald-400 pt-1"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة خيار آخر</span>
              </button>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-gray-500/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:bg-gray-500/10"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!question.trim() || options.filter((o) => o.trim()).length < 2}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow"
            >
              إرسال الاستطلاع
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
