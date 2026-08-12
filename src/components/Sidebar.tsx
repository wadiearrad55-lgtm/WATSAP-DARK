import React, { useState } from 'react';
import {
  Search,
  MessageSquarePlus,
  MoreVertical,
  CircleDashed,
  Radio,
  Archive,
  Pin,
  CheckCheck,
  Check,
  Bot,
  Users,
  Moon,
  Sun,
  Settings,
  UserCheck,
  Filter,
  X,
  Plus
} from 'lucide-react';
import { Chat, User, StatusStory } from '../types';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  currentUser: User;
  activeTab: 'chats' | 'status' | 'channels';
  onChangeTab: (tab: 'chats' | 'status' | 'channels') => void;
  unreadStatusesCount: number;
  onOpenNewChatModal: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onPinChat: (chatId: string) => void;
  onArchiveChat: (chatId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  currentUser,
  activeTab,
  onChangeTab,
  unreadStatusesCount,
  onOpenNewChatModal,
  onOpenSettings,
  onOpenProfile,
  isDarkMode,
  onToggleDarkMode,
  onPinChat,
  onArchiveChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'favorites' | 'groups'>('all');
  const [showMenu, setShowMenu] = useState(false);
  const [contextMenuChatId, setContextMenuChatId] = useState<string | null>(null);

  // Filter chats based on query and selected category filter
  const filteredChats = chats.filter((chat) => {
    if (chat.isArchived) return false;

    const matchesQuery = chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.lastMessage && chat.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesQuery) return false;

    if (filterType === 'unread') return chat.unreadCount > 0;
    if (filterType === 'favorites') return chat.isPinned;
    if (filterType === 'groups') return chat.isGroup;

    return true;
  });

  // Sort: Pinned first, then by last message timestamp
  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className={`w-full md:w-[380px] lg:w-[420px] flex flex-col h-full border-l border-emerald-900/10 dark:border-gray-800 ${
      isDarkMode ? 'bg-[#111b21] text-gray-100' : 'bg-white text-gray-800'
    } select-none transition-colors duration-200`}>
      
      {/* Sidebar Header */}
      <div className={`px-4 py-3 flex items-center justify-between border-b ${
        isDarkMode ? 'bg-[#202c33] border-gray-800' : 'bg-[#f0f2f5] border-gray-200'
      }`}>
        {/* User Profile Avatar */}
        <button
          onClick={onOpenProfile}
          className="relative group flex items-center gap-2 focus:outline-none"
          title="الملف الشخصي"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/50 group-hover:ring-emerald-500 transition-all"
          />
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold leading-none">{currentUser.name}</p>
            <span className="text-[11px] text-emerald-500">متصل</span>
          </div>
        </button>

        {/* Action Navigation Bar */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Tab: Status Stories */}
          <button
            onClick={() => onChangeTab('status')}
            className={`p-2 rounded-full transition-colors relative ${
              activeTab === 'status'
                ? 'bg-emerald-500/20 text-emerald-500'
                : 'hover:bg-gray-500/10 text-gray-500 dark:text-gray-400'
            }`}
            title="الحالات (Stories)"
          >
            <CircleDashed className="w-5 h-5" />
            {unreadStatusesCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#202c33]" />
            )}
          </button>

          {/* Tab: Channels */}
          <button
            onClick={() => onChangeTab('channels')}
            className={`p-2 rounded-full transition-colors relative ${
              activeTab === 'channels'
                ? 'bg-emerald-500/20 text-emerald-500'
                : 'hover:bg-gray-500/10 text-gray-500 dark:text-gray-400'
            }`}
            title="القنوات (Channels)"
          >
            <Radio className="w-5 h-5" />
          </button>

          {/* New Chat Icon */}
          <button
            onClick={onOpenNewChatModal}
            className="p-2 rounded-full hover:bg-gray-500/10 text-gray-500 dark:text-gray-400 transition-colors"
            title="محادثة جديدة"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-500/10 text-gray-500 dark:text-gray-400 transition-colors"
            title={isDarkMode ? 'الوضع المضيء' : 'الوضع الداكن'}
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* More Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-full hover:bg-gray-500/10 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className={`absolute left-0 mt-2 w-48 rounded-xl shadow-xl z-50 py-2 border ${
                  isDarkMode ? 'bg-[#233138] border-gray-700 text-gray-100' : 'bg-white border-gray-100 text-gray-800'
                }`}>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenNewChatModal();
                    }}
                    className="w-full text-right px-4 py-2.5 text-sm hover:bg-emerald-500/10 flex items-center justify-between"
                  >
                    <span>مجموعة جديدة</span>
                    <Users className="w-4 h-4 text-emerald-500" />
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenProfile();
                    }}
                    className="w-full text-right px-4 py-2.5 text-sm hover:bg-emerald-500/10 flex items-center justify-between"
                  >
                    <span>الملف الشخصي</span>
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onOpenSettings();
                    }}
                    className="w-full text-right px-4 py-2.5 text-sm hover:bg-emerald-500/10 flex items-center justify-between border-t border-gray-500/10"
                  >
                    <span>الإعدادات</span>
                    <Settings className="w-4 h-4 text-emerald-500" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search Input & Category Filters */}
      <div className="p-3 space-y-2 border-b border-gray-500/10">
        <div className={`flex items-center px-3 py-2 rounded-xl text-sm ${
          isDarkMode ? 'bg-[#202c33] text-gray-200' : 'bg-[#f0f2f5] text-gray-800'
        }`}>
          <Search className="w-4 h-4 text-gray-400 shrink-0 ml-2" />
          <input
            type="text"
            placeholder="البحث أو بدء محادثة جديدة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-sm placeholder-gray-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="p-1 text-gray-400 hover:text-gray-200">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'unread', label: 'غير مقروء' },
            { id: 'favorites', label: 'المفضلة' },
            { id: 'groups', label: 'المجموعات' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setFilterType(filter.id as any)}
              className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-all font-medium ${
                filterType === filter.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isDarkMode
                  ? 'bg-[#202c33] text-gray-300 hover:bg-[#2a3942]'
                  : 'bg-[#e9edef] text-gray-700 hover:bg-[#d1d7db]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-500/5 custom-scrollbar">
        {sortedChats.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            لا توجد محادثات مطابقة للبحث
          </div>
        ) : (
          sortedChats.map((chat) => {
            const isActive = chat.id === activeChatId;
            const lastMsg = chat.lastMessage;

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`group relative flex items-center gap-3 px-3.5 py-3 cursor-pointer transition-all ${
                  isActive
                    ? isDarkMode
                      ? 'bg-[#2a3942]'
                      : 'bg-[#f0f2f5]'
                    : isDarkMode
                    ? 'hover:bg-[#202c33]'
                    : 'hover:bg-[#f5f6f8]'
                }`}
              >
                {/* Avatar with Status/AI Indicators */}
                <div className="relative shrink-0">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {chat.isAI && (
                    <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-1 rounded-full shadow">
                      <Bot className="w-3 h-3" />
                    </span>
                  )}
                  {chat.isGroup && !chat.isAI && (
                    <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full shadow">
                      <Users className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Chat Information */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                      {chat.isAI && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">
                          AI
                        </span>
                      )}
                    </div>
                    {lastMsg && (
                      <span className={`text-[11px] shrink-0 ${
                        chat.unreadCount > 0 ? 'text-emerald-500 font-bold' : 'text-gray-400'
                      }`}>
                        {lastMsg.timestamp}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1 truncate max-w-[82%]">
                      {/* Read status ticks for outgoing messages */}
                      {lastMsg && lastMsg.senderId === currentUser.id && (
                        <span className="shrink-0">
                          {lastMsg.status === 'read' ? (
                            <CheckCheck className="w-4 h-4 text-sky-400" />
                          ) : (
                            <Check className="w-4 h-4 text-gray-400" />
                          )}
                        </span>
                      )}
                      
                      <p className="truncate">
                        {chat.typingText ? (
                          <span className="text-emerald-500 font-medium animate-pulse">
                            {chat.typingText}
                          </span>
                        ) : (
                          lastMsg ? lastMsg.content : 'انقر لبدء المحادثة'
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {chat.isPinned && (
                        <Pin className="w-3.5 h-3.5 text-gray-400 rotate-45" />
                      )}
                      {chat.unreadCount > 0 && (
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Hover Action Button */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPinChat(chat.id);
                    }}
                    className="p-1.5 bg-gray-700/80 hover:bg-gray-700 text-gray-200 rounded-full shadow"
                    title={chat.isPinned ? 'إلغاء التثبيت' : 'تثبيت المحادثة'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
