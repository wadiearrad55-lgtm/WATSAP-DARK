import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Video,
  Search,
  MoreVertical,
  Check,
  CheckCheck,
  Play,
  Pause,
  Download,
  FileText,
  Pin,
  Star,
  CornerUpLeft,
  Trash2,
  Bot,
  Users,
  Smile,
  Volume2,
  Info,
  ChevronDown
} from 'lucide-react';
import { Chat, Message, User } from '../types';

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  currentUser: User;
  onSendMessage: (text: string, type?: Message['type'], extraData?: any) => void;
  onStartCall: (type: 'voice' | 'video') => void;
  onVotePoll: (messageId: string, optionId: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onReplyMessage: (msg: Message) => void;
  replyTargetMessage: Message | null;
  onClearReplyTarget: () => void;
  isDarkMode: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  currentUser,
  onSendMessage,
  onStartCall,
  onVotePoll,
  onAddReaction,
  onDeleteMessage,
  onReplyMessage,
  replyTargetMessage,
  onClearReplyTarget,
  isDarkMode,
}) => {
  const [activeAudioMessageId, setActiveAudioMessageId] = useState<string | null>(null);
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState<number>(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [showSearchInChat, setShowSearchInChat] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Audio voice note simulation handler
  const handleToggleVoiceNote = (msgId: string, audioUrl?: string) => {
    if (activeAudioMessageId === msgId && isPlayingAudio) {
      audioRef.current?.pause();
      setIsPlayingAudio(false);
    } else {
      setActiveAudioMessageId(msgId);
      setIsPlayingAudio(true);
      setAudioProgress(0);

      // Simulated playback progress
      let p = 0;
      const interval = setInterval(() => {
        p += 5;
        setAudioProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setIsPlayingAudio(false);
          setActiveAudioMessageId(null);
        }
      }, 300);
    }
  };

  const filteredMessages = chatSearchQuery
    ? messages.filter((m) => m.content.toLowerCase().includes(chatSearchQuery.toLowerCase()))
    : messages;

  return (
    <div className={`flex-1 flex flex-col h-full relative overflow-hidden ${
      isDarkMode ? 'bg-[#0b141a]' : 'bg-[#efeae2]'
    }`}>
      
      {/* Background WhatsApp Doodle Pattern Wallpaper */}
      <div 
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04] pointer-events-none bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M11 18h2v2h-2zm8 0h2v2h-2zm-4 4h2v2h-2zm-4 4h2v2h-2zm8 0h2v2h-2zm4 4h2v2h-2zm-8 0h2v2h-2zm-4 4h2v2h-2zm8 0h2v2h-2zm4 4h2v2h-2zm-8 0h2v2h-2z'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Chat Window Header */}
      <div className={`px-4 py-2.5 flex items-center justify-between border-b z-10 shadow-sm ${
        isDarkMode ? 'bg-[#202c33] border-gray-800 text-gray-100' : 'bg-[#f0f2f5] border-gray-200 text-gray-800'
      }`}>
        {/* Contact Info */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            {chat.isAI && (
              <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full">
                <Bot className="w-3 h-3" />
              </span>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-sm flex items-center gap-1.5">
              <span>{chat.name}</span>
              {chat.isAI && (
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded font-normal">
                  ذكاء اصطناعي
                </span>
              )}
            </h2>
            <p className="text-xs text-emerald-500 font-medium">
              {chat.typingText ? chat.typingText : chat.isAI ? 'متصل دائماً للخدمة 🤖' : 'متصل الآن'}
            </p>
          </div>
        </div>

        {/* Action Buttons: Voice Call, Video Call, Search */}
        <div className="flex items-center gap-2">
          {!chat.isAI && (
            <>
              <button
                onClick={() => onStartCall('video')}
                className="p-2 rounded-full hover:bg-gray-500/10 text-gray-600 dark:text-gray-300 transition-colors"
                title="مكالمة فيديو"
              >
                <Video className="w-5 h-5" />
              </button>
              <button
                onClick={() => onStartCall('voice')}
                className="p-2 rounded-full hover:bg-gray-500/10 text-gray-600 dark:text-gray-300 transition-colors"
                title="مكالمة صوتية"
              >
                <Phone className="w-5 h-5" />
              </button>
            </>
          )}

          <button
            onClick={() => setShowSearchInChat(!showSearchInChat)}
            className="p-2 rounded-full hover:bg-gray-500/10 text-gray-600 dark:text-gray-300 transition-colors"
            title="البحث في المحادثة"
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-2 rounded-full hover:bg-gray-500/10 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showOptionsMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowOptionsMenu(false)} />
                <div className={`absolute left-0 mt-2 w-48 rounded-xl shadow-xl z-50 py-2 border ${
                  isDarkMode ? 'bg-[#233138] border-gray-700 text-gray-100' : 'bg-white border-gray-100 text-gray-800'
                }`}>
                  <button className="w-full text-right px-4 py-2 text-sm hover:bg-emerald-500/10 flex items-center justify-between">
                    <span>معلومات المحادثة</span>
                    <Info className="w-4 h-4 text-emerald-500" />
                  </button>
                  <button className="w-full text-right px-4 py-2 text-sm hover:bg-emerald-500/10 flex items-center justify-between text-rose-500">
                    <span>مسح المحادثة</span>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* In-chat Search Bar dropdown if active */}
      {showSearchInChat && (
        <div className={`px-4 py-2 z-10 border-b flex items-center gap-2 ${
          isDarkMode ? 'bg-[#202c33] border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن كلمة أو رسالة..."
            value={chatSearchQuery}
            onChange={(e) => setChatSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm focus:outline-none"
            autoFocus
          />
          {chatSearchQuery && (
            <button onClick={() => setChatSearchQuery('')} className="text-xs text-emerald-500 font-semibold">
              مسح
            </button>
          )}
        </div>
      )}

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 z-10 custom-scrollbar">
        {/* Date Divider */}
        <div className="flex justify-center my-2">
          <span className={`text-[11px] px-3 py-1 rounded-lg font-medium shadow-sm ${
            isDarkMode ? 'bg-[#182229] text-gray-400' : 'bg-white/80 text-gray-600'
          }`}>
            اليوم
          </span>
        </div>

        {filteredMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;

          return (
            <div
              key={msg.id}
              onMouseEnter={() => setHoveredMessageId(msg.id)}
              onMouseLeave={() => setHoveredMessageId(null)}
              className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className={`relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-3.5 py-2.5 shadow-sm text-sm ${
                isMe
                  ? isDarkMode
                    ? 'bg-[#005c4b] text-emerald-50 rounded-tl-2xl rounded-tr-sm'
                    : 'bg-[#d9fdd3] text-gray-900 rounded-tl-2xl rounded-tr-sm'
                  : isDarkMode
                  ? 'bg-[#202c33] text-gray-100 rounded-tr-2xl rounded-tl-sm'
                  : 'bg-white text-gray-900 rounded-tr-2xl rounded-tl-sm'
              }`}>
                
                {/* Group Sender Name */}
                {chat.isGroup && !isMe && (
                  <p className="text-xs font-bold text-emerald-500 mb-1">
                    {msg.senderName}
                  </p>
                )}

                {/* Quoted Reply Target Preview */}
                {msg.replyToMessage && (
                  <div className={`p-2 rounded-lg mb-2 text-xs border-r-4 border-emerald-500 ${
                    isDarkMode ? 'bg-black/20 text-gray-300' : 'bg-black/5 text-gray-700'
                  }`}>
                    <p className="font-bold text-emerald-500">{msg.replyToMessage.senderName}</p>
                    <p className="truncate opacity-80">{msg.replyToMessage.content}</p>
                  </div>
                )}

                {/* Message Content according to Message Type */}
                {msg.type === 'text' && (
                  <p className="whitespace-pre-wrap leading-relaxed text-[13.5px]">{msg.content}</p>
                )}

                {msg.type === 'image' && (
                  <div className="space-y-1.5">
                    <img
                      src={msg.mediaUrl}
                      alt="Attachment"
                      className="rounded-xl max-h-72 w-full object-cover shadow-sm hover:scale-[1.01] transition-transform cursor-pointer"
                    />
                    {msg.content && <p className="text-[13px]">{msg.content}</p>}
                  </div>
                )}

                {msg.type === 'voice_note' && (
                  <div className="flex items-center gap-3 py-1 min-w-[200px]">
                    <button
                      onClick={() => handleToggleVoiceNote(msg.id, msg.mediaUrl)}
                      className={`p-2.5 rounded-full shadow-md text-white transition-transform active:scale-95 ${
                        isMe ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600'
                      }`}
                    >
                      {activeAudioMessageId === msg.id && isPlayingAudio ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4 mr-0.5 fill-current" />
                      )}
                    </button>

                    <div className="flex-1 space-y-1">
                      {/* Waveform indicator */}
                      <div className="flex items-center gap-0.5 h-6">
                        {[40, 70, 30, 90, 60, 100, 50, 80, 30, 60, 90, 40, 70, 50, 80].map((h, idx) => (
                          <div
                            key={idx}
                            style={{ height: `${h}%` }}
                            className={`w-1 rounded-full transition-all ${
                              activeAudioMessageId === msg.id && (idx / 15) * 100 <= audioProgress
                                ? 'bg-emerald-500'
                                : isDarkMode
                                ? 'bg-gray-600'
                                : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>0:{msg.audioDuration || 18}</span>
                        <span>تسجيل صوتي</span>
                      </div>
                    </div>
                  </div>
                )}

                {msg.type === 'poll' && (
                  <div className="space-y-2 min-w-[220px] py-1">
                    <p className="font-bold text-sm border-b pb-1.5 border-emerald-500/20">
                      📊 {msg.pollTitle || msg.content}
                    </p>
                    <div className="space-y-2">
                      {msg.pollOptions?.map((opt) => {
                        const totalVotes = msg.pollOptions?.reduce((acc, o) => acc + o.votes.length, 0) || 1;
                        const hasVoted = opt.votes.includes(currentUser.id);
                        const pct = Math.round((opt.votes.length / (totalVotes || 1)) * 100);

                        return (
                          <button
                            key={opt.id}
                            onClick={() => onVotePoll(msg.id, opt.id)}
                            className={`w-full text-right p-2 rounded-xl border text-xs relative overflow-hidden transition-all ${
                              hasVoted
                                ? 'border-emerald-500 bg-emerald-500/10 font-bold'
                                : isDarkMode
                                ? 'border-gray-700 hover:bg-gray-800'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <div
                              className="absolute top-0 right-0 bottom-0 bg-emerald-500/20 transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            />
                            <div className="relative flex justify-between items-center">
                              <span>{opt.text}</span>
                              <span className="text-[10px] text-gray-500 font-semibold">{pct}% ({opt.votes.length})</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Message Footer: Timestamp & Read Status Ticks */}
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-400">
                  <span>{msg.timestamp}</span>
                  {isMe && (
                    <span>
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-3.5 h-3.5 text-sky-400" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </span>
                  )}
                </div>

                {/* Active Reactions beneath message */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="absolute -bottom-2.5 right-2 flex items-center gap-1 bg-white dark:bg-[#202c33] px-1.5 py-0.5 rounded-full shadow border border-gray-200 dark:border-gray-700 text-xs">
                    {Object.entries(msg.reactions).map(([emoji, userIds]) => {
                      const ids = userIds as string[];
                      return (
                        <span key={emoji} className="flex items-center gap-0.5">
                          <span>{emoji}</span>
                          {ids.length > 1 && <span className="text-[10px] font-bold">{ids.length}</span>}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Action Controls on Hover */}
                {hoveredMessageId === msg.id && (
                  <div className={`absolute -top-3 left-2 flex items-center gap-1 p-1 rounded-full shadow-lg border text-xs z-20 ${
                    isDarkMode ? 'bg-[#233138] border-gray-700' : 'bg-white border-gray-200'
                  }`}>
                    {['👍', '❤️', '😂', '😮', '😢', '🙏'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => onAddReaction(msg.id, emoji)}
                        className="hover:scale-125 transition-transform px-0.5"
                      >
                        {emoji}
                      </button>
                    ))}
                    <button
                      onClick={() => onReplyMessage(msg)}
                      className="p-1 hover:bg-gray-500/10 rounded-full text-gray-400 hover:text-emerald-500"
                      title="الرد على الرسالة"
                    >
                      <CornerUpLeft className="w-3.5 h-3.5" />
                    </button>
                    {isMe && (
                      <button
                        onClick={() => onDeleteMessage(msg.id)}
                        className="p-1 hover:bg-rose-500/10 rounded-full text-rose-400"
                        title="حذف الرسالة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
