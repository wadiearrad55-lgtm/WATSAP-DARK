import React, { useState, useRef, useEffect } from 'react';
import {
  Smile,
  Paperclip,
  Mic,
  Send,
  X,
  Image,
  FileText,
  BarChart2,
  Square,
  Trash2,
  Check,
  MapPin,
  UserCheck
} from 'lucide-react';
import { Message } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string, type?: Message['type'], extraData?: any) => void;
  replyTargetMessage: Message | null;
  onClearReplyTarget: () => void;
  onOpenPollModal: () => void;
  isDarkMode: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  replyTargetMessage,
  onClearReplyTarget,
  onOpenPollModal,
  isDarkMode,
}) => {
  const [text, setText] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<any>(null);

  // Emojis array for quick picker
  const POPULAR_EMOJIS = ['😊', '😂', '❤️', '👍', '🔥', '🌸', '🎉', '🙏', '😍', '☕', '💻', '🚀', '✨', '👏', '🤝', '💯'];

  // Voice recording timer handle
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecording]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text.trim(), 'text');
    setText('');
    setShowEmojiPicker(false);
    setShowAttachments(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSendVoiceMessage = () => {
    setIsRecording(false);
    onSendMessage('رسالة صوتية', 'voice_note', { audioDuration: recordingSeconds || 5 });
    setRecordingSeconds(0);
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        onSendMessage(file.name, isImage ? 'image' : 'document', {
          mediaUrl: url,
          fileName: file.name,
          fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        });
      };
      reader.readAsDataURL(file);
    }
    setShowAttachments(false);
  };

  return (
    <div className={`relative z-20 border-t ${
      isDarkMode ? 'bg-[#202c33] border-gray-800' : 'bg-[#f0f2f5] border-gray-200'
    }`}>
      
      {/* Reply Bar Preview */}
      {replyTargetMessage && (
        <div className={`px-4 py-2 flex items-center justify-between border-b ${
          isDarkMode ? 'bg-[#182229] border-gray-700' : 'bg-gray-100 border-gray-200'
        }`}>
          <div className="border-r-4 border-emerald-500 pr-3 text-xs">
            <p className="font-bold text-emerald-500">{replyTargetMessage.senderName}</p>
            <p className="text-gray-400 truncate max-w-md">{replyTargetMessage.content}</p>
          </div>
          <button
            onClick={onClearReplyTarget}
            className="p-1 rounded-full hover:bg-gray-500/20 text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className={`absolute bottom-full right-4 mb-2 p-3 rounded-2xl shadow-xl border z-30 grid grid-cols-8 gap-2 w-72 ${
          isDarkMode ? 'bg-[#233138] border-gray-700' : 'bg-white border-gray-200'
        }`}>
          {POPULAR_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => {
                setText((prev) => prev + emoji);
              }}
              className="text-xl p-1.5 hover:bg-emerald-500/20 rounded-xl transition-transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Attachment Options Menu Popup */}
      {showAttachments && (
        <div className={`absolute bottom-full right-12 mb-3 p-3 rounded-2xl shadow-2xl border z-30 flex flex-col gap-2 w-48 ${
          isDarkMode ? 'bg-[#233138] border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
        }`}>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-500/10 text-xs font-semibold text-right transition-colors"
          >
            <span className="p-2 bg-purple-500/20 text-purple-400 rounded-full">
              <Image className="w-4 h-4" />
            </span>
            <span>صور وفيديوهات</span>
          </button>

          <button
            onClick={() => {
              setShowAttachments(false);
              onOpenPollModal();
            }}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-500/10 text-xs font-semibold text-right transition-colors"
          >
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-full">
              <BarChart2 className="w-4 h-4" />
            </span>
            <span>استطلاع رأي</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-500/10 text-xs font-semibold text-right transition-colors"
          >
            <span className="p-2 bg-blue-500/20 text-blue-400 rounded-full">
              <FileText className="w-4 h-4" />
            </span>
            <span>مستند</span>
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,video/*,.pdf,.doc,.docx"
      />

      {/* Input Control Area or Recording Mode */}
      <div className="px-3 py-2.5 flex items-center gap-2">
        {isRecording ? (
          /* Live Voice Recording Bar */
          <div className="flex-1 flex items-center justify-between px-4 py-2 bg-rose-500/10 rounded-2xl border border-rose-500/30 animate-pulse">
            <button onClick={handleCancelRecording} className="p-2 text-rose-500 hover:bg-rose-500/20 rounded-full">
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-rose-500 rounded-full animate-ping" />
              <span className="font-mono text-sm font-bold text-rose-500">
                00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
              </span>
              <span className="text-xs text-gray-400">جاري تسجيل الصوت...</span>
            </div>

            <button
              onClick={handleSendVoiceMessage}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow"
            >
              <Send className="w-4 h-4 mr-0.5" />
            </button>
          </div>
        ) : (
          /* Normal Message Input Bar */
          <>
            {/* Emoji Trigger */}
            <button
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowAttachments(false);
              }}
              className={`p-2 rounded-full transition-colors ${
                showEmojiPicker ? 'text-emerald-500 bg-emerald-500/10' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Smile className="w-6 h-6" />
            </button>

            {/* Attachment Trigger */}
            <button
              onClick={() => {
                setShowAttachments(!showAttachments);
                setShowEmojiPicker(false);
              }}
              className={`p-2 rounded-full transition-colors ${
                showAttachments ? 'text-emerald-500 bg-emerald-500/10' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Paperclip className="w-6 h-6" />
            </button>

            {/* Text Input Area */}
            <div className={`flex-1 rounded-2xl px-4 py-2 flex items-center border ${
              isDarkMode ? 'bg-[#2a3942] border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'
            }`}>
              <textarea
                rows={1}
                placeholder="اكتب رسالتك هنا..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent resize-none focus:outline-none text-sm max-h-24 py-1 placeholder-gray-400"
              />
            </div>

            {/* Send or Voice Record button */}
            {text.trim() ? (
              <button
                onClick={handleSend}
                className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-md active:scale-95 transition-all"
                title="إرسال"
              >
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            ) : (
              <button
                onClick={() => setIsRecording(true)}
                className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-md active:scale-95 transition-all"
                title="تسجيل رسالة صوتية"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
